from flask import Blueprint, request, jsonify, current_app
from src.models.user import db, User, UserAuditLog
from src.lib.stripe_service import StripeService
from src.lib.ghl import GHLService
import json

webhooks_bp = Blueprint('webhooks', __name__)

def log_webhook_event(event_type, event_data, status, error_message=None):
    """Log webhook event for monitoring"""
    try:
        current_app.logger.info(f"Webhook event: {event_type} - Status: {status}")
        if error_message:
            current_app.logger.error(f"Webhook error: {error_message}")
    except Exception as e:
        current_app.logger.error(f"Failed to log webhook event: {e}")

@webhooks_bp.route('/stripe', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    try:
        payload = request.get_data()
        signature = request.headers.get('Stripe-Signature')
        
        if not signature:
            log_webhook_event('stripe', None, 'failed', 'Missing signature')
            return jsonify({'error': 'Missing signature'}), 400
        
        # Initialize Stripe service
        stripe_service = StripeService()
        
        # Construct and verify webhook event
        result = stripe_service.construct_webhook_event(payload, signature)
        if not result['success']:
            log_webhook_event('stripe', None, 'failed', result['error'])
            return jsonify({'error': result['error']}), 400
        
        event = result['event']
        event_type = event['type']
        event_data = event['data']['object']
        
        current_app.logger.info(f"Processing Stripe webhook: {event_type}")
        
        # Handle different event types
        if event_type == 'invoice.payment_succeeded':
            handle_payment_succeeded(event_data)
        
        elif event_type == 'invoice.payment_failed':
            handle_payment_failed(event_data)
        
        elif event_type == 'customer.subscription.created':
            handle_subscription_created(event_data)
        
        elif event_type == 'customer.subscription.updated':
            handle_subscription_updated(event_data)
        
        elif event_type == 'customer.subscription.deleted':
            handle_subscription_deleted(event_data)
        
        elif event_type == 'customer.subscription.trial_will_end':
            handle_trial_will_end(event_data)
        
        else:
            current_app.logger.info(f"Unhandled webhook event type: {event_type}")
        
        log_webhook_event(event_type, event_data, 'success')
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Stripe webhook error: {e}")
        log_webhook_event('stripe', None, 'failed', str(e))
        return jsonify({'error': 'Webhook processing failed'}), 500

def handle_payment_succeeded(invoice_data):
    """Handle successful payment"""
    try:
        customer_id = invoice_data.get('customer')
        subscription_id = invoice_data.get('subscription')
        
        # Find user by Stripe customer ID
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if not user:
            current_app.logger.warning(f"User not found for customer ID: {customer_id}")
            return
        
        # Update user status if this is their first payment
        if user.status == 'trial':
            user.status = 'active'
            user.updated_at = db.func.now()
            
            # Log the conversion
            audit_log = UserAuditLog(
                user_id=user.id,
                action='trial_converted',
                details={
                    'invoice_id': invoice_data.get('id'),
                    'amount_paid': invoice_data.get('amount_paid'),
                    'subscription_id': subscription_id
                }
            )
            db.session.add(audit_log)
        
        # Log payment success
        audit_log = UserAuditLog(
            user_id=user.id,
            action='payment_success',
            details={
                'invoice_id': invoice_data.get('id'),
                'amount_paid': invoice_data.get('amount_paid'),
                'subscription_id': subscription_id
            }
        )
        db.session.add(audit_log)
        db.session.commit()
        
        # Update contact in GoHighLevel
        try:
            ghl_service = GHLService()
            if user.ghl_contact_id:
                # Tag as converted customer
                ghl_service.tag_contact(user.ghl_contact_id, ['Converted', 'Paying Customer'], user.id)
                
                # Update contact with payment info
                ghl_service.update_contact(
                    user.ghl_contact_id,
                    {
                        'status': 'active',
                        'last_payment_date': invoice_data.get('created'),
                        'subscription_status': 'active'
                    },
                    user.id
                )
        except Exception as e:
            current_app.logger.error(f"Failed to update GHL contact after payment: {e}")
        
        current_app.logger.info(f"Payment succeeded for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling payment succeeded: {e}")
        db.session.rollback()

def handle_payment_failed(invoice_data):
    """Handle failed payment"""
    try:
        customer_id = invoice_data.get('customer')
        subscription_id = invoice_data.get('subscription')
        
        # Find user by Stripe customer ID
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if not user:
            current_app.logger.warning(f"User not found for customer ID: {customer_id}")
            return
        
        # Log payment failure
        audit_log = UserAuditLog(
            user_id=user.id,
            action='payment_failure',
            details={
                'invoice_id': invoice_data.get('id'),
                'amount_due': invoice_data.get('amount_due'),
                'subscription_id': subscription_id,
                'attempt_count': invoice_data.get('attempt_count')
            }
        )
        db.session.add(audit_log)
        db.session.commit()
        
        # Update contact in GoHighLevel
        try:
            ghl_service = GHLService()
            if user.ghl_contact_id:
                ghl_service.tag_contact(user.ghl_contact_id, ['Payment Failed'], user.id)
        except Exception as e:
            current_app.logger.error(f"Failed to update GHL contact after payment failure: {e}")
        
        current_app.logger.info(f"Payment failed for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling payment failed: {e}")
        db.session.rollback()

def handle_subscription_created(subscription_data):
    """Handle subscription creation"""
    try:
        customer_id = subscription_data.get('customer')
        subscription_id = subscription_data.get('id')
        
        # Find user by Stripe customer ID
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if not user:
            current_app.logger.warning(f"User not found for customer ID: {customer_id}")
            return
        
        # Update user with subscription ID
        user.stripe_subscription_id = subscription_id
        
        # Log subscription creation
        audit_log = UserAuditLog(
            user_id=user.id,
            action='subscription_start',
            details={
                'subscription_id': subscription_id,
                'status': subscription_data.get('status'),
                'trial_end': subscription_data.get('trial_end')
            }
        )
        db.session.add(audit_log)
        db.session.commit()
        
        current_app.logger.info(f"Subscription created for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling subscription created: {e}")
        db.session.rollback()

def handle_subscription_updated(subscription_data):
    """Handle subscription updates"""
    try:
        customer_id = subscription_data.get('customer')
        subscription_id = subscription_data.get('id')
        
        # Find user by Stripe customer ID
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if not user:
            current_app.logger.warning(f"User not found for customer ID: {customer_id}")
            return
        
        # Log subscription update
        audit_log = UserAuditLog(
            user_id=user.id,
            action='subscription_updated',
            details={
                'subscription_id': subscription_id,
                'status': subscription_data.get('status'),
                'trial_end': subscription_data.get('trial_end')
            }
        )
        db.session.add(audit_log)
        db.session.commit()
        
        current_app.logger.info(f"Subscription updated for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling subscription updated: {e}")
        db.session.rollback()

def handle_subscription_deleted(subscription_data):
    """Handle subscription cancellation"""
    try:
        customer_id = subscription_data.get('customer')
        subscription_id = subscription_data.get('id')
        
        # Find user by Stripe customer ID
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if not user:
            current_app.logger.warning(f"User not found for customer ID: {customer_id}")
            return
        
        # Update user status
        user.status = 'cancelled'
        user.updated_at = db.func.now()
        
        # Log subscription cancellation
        audit_log = UserAuditLog(
            user_id=user.id,
            action='subscription_cancel',
            details={
                'subscription_id': subscription_id,
                'canceled_at': subscription_data.get('canceled_at'),
                'cancellation_reason': subscription_data.get('cancellation_details', {}).get('reason')
            }
        )
        db.session.add(audit_log)
        db.session.commit()
        
        # Update contact in GoHighLevel
        try:
            ghl_service = GHLService()
            if user.ghl_contact_id:
                ghl_service.tag_contact(user.ghl_contact_id, ['Cancelled'], user.id)
                ghl_service.update_contact(
                    user.ghl_contact_id,
                    {'status': 'cancelled'},
                    user.id
                )
        except Exception as e:
            current_app.logger.error(f"Failed to update GHL contact after cancellation: {e}")
        
        current_app.logger.info(f"Subscription cancelled for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling subscription deleted: {e}")
        db.session.rollback()

def handle_trial_will_end(subscription_data):
    """Handle trial ending soon notification"""
    try:
        customer_id = subscription_data.get('customer')
        subscription_id = subscription_data.get('id')
        
        # Find user by Stripe customer ID
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if not user:
            current_app.logger.warning(f"User not found for customer ID: {customer_id}")
            return
        
        # Log trial ending notification
        audit_log = UserAuditLog(
            user_id=user.id,
            action='trial_ending_soon',
            details={
                'subscription_id': subscription_id,
                'trial_end': subscription_data.get('trial_end')
            }
        )
        db.session.add(audit_log)
        db.session.commit()
        
        # Update contact in GoHighLevel
        try:
            ghl_service = GHLService()
            if user.ghl_contact_id:
                ghl_service.tag_contact(user.ghl_contact_id, ['Trial Ending Soon'], user.id)
        except Exception as e:
            current_app.logger.error(f"Failed to update GHL contact for trial ending: {e}")
        
        current_app.logger.info(f"Trial ending soon for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling trial will end: {e}")
        db.session.rollback()

@webhooks_bp.route('/ghl', methods=['POST'])
def ghl_webhook():
    """Handle GoHighLevel webhook events"""
    try:
        data = request.get_json()
        event_type = data.get('type')
        
        current_app.logger.info(f"Processing GHL webhook: {event_type}")
        
        # Handle different GHL event types
        if event_type == 'contact.updated':
            handle_ghl_contact_updated(data.get('data', {}))
        elif event_type == 'contact.deleted':
            handle_ghl_contact_deleted(data.get('data', {}))
        else:
            current_app.logger.info(f"Unhandled GHL webhook event type: {event_type}")
        
        log_webhook_event(event_type, data, 'success')
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        current_app.logger.error(f"GHL webhook error: {e}")
        log_webhook_event('ghl', None, 'failed', str(e))
        return jsonify({'error': 'Webhook processing failed'}), 500

def handle_ghl_contact_updated(contact_data):
    """Handle GHL contact update"""
    try:
        contact_id = contact_data.get('id')
        
        # Find user by GHL contact ID
        user = User.query.filter_by(ghl_contact_id=contact_id).first()
        if not user:
            current_app.logger.warning(f"User not found for GHL contact ID: {contact_id}")
            return
        
        # Log the update
        audit_log = UserAuditLog(
            user_id=user.id,
            action='ghl_contact_updated',
            details={
                'contact_id': contact_id,
                'updated_fields': contact_data.get('updated_fields', [])
            }
        )
        db.session.add(audit_log)
        db.session.commit()
        
        current_app.logger.info(f"GHL contact updated for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling GHL contact updated: {e}")
        db.session.rollback()

def handle_ghl_contact_deleted(contact_data):
    """Handle GHL contact deletion"""
    try:
        contact_id = contact_data.get('id')
        
        # Find user by GHL contact ID
        user = User.query.filter_by(ghl_contact_id=contact_id).first()
        if not user:
            current_app.logger.warning(f"User not found for GHL contact ID: {contact_id}")
            return
        
        # Clear GHL contact ID
        user.ghl_contact_id = None
        
        # Log the deletion
        audit_log = UserAuditLog(
            user_id=user.id,
            action='ghl_contact_deleted',
            details={'contact_id': contact_id}
        )
        db.session.add(audit_log)
        db.session.commit()
        
        current_app.logger.info(f"GHL contact deleted for user {user.id}")
    
    except Exception as e:
        current_app.logger.error(f"Error handling GHL contact deleted: {e}")
        db.session.rollback()

