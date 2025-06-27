"""
Webhook routes for HARMONIX Platform
"""

from flask import Blueprint, request, jsonify, current_app
import hmac
import hashlib
import json
from datetime import datetime

from src.models.user import db, User
from src.lib.ghl import GoHighLevelService

webhook_bp = Blueprint('webhook', __name__)

@webhook_bp.route('/ghl', methods=['POST'])
def handle_ghl_webhook():
    """Handle GoHighLevel webhook events."""
    try:
        # Verify webhook signature
        signature = request.headers.get('X-GHL-Signature')
        webhook_secret = current_app.config.get('GHL_WEBHOOK_SECRET')
        
        if webhook_secret and signature:
            payload = request.get_data()
            expected_signature = hmac.new(
                webhook_secret.encode('utf-8'),
                payload,
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(signature, expected_signature):
                current_app.logger.warning("Invalid GHL webhook signature")
                return jsonify({'error': 'Invalid signature'}), 401
        
        data = request.get_json()
        event_type = data.get('type', '')
        
        current_app.logger.info(f"Received GHL webhook: {event_type}")
        
        # Handle different event types
        if event_type == 'contact.created':
            return handle_contact_created(data)
        elif event_type == 'contact.updated':
            return handle_contact_updated(data)
        elif event_type == 'opportunity.created':
            return handle_opportunity_created(data)
        elif event_type == 'workflow.triggered':
            return handle_workflow_triggered(data)
        else:
            current_app.logger.info(f"Unhandled GHL event type: {event_type}")
            return jsonify({'status': 'ignored'}), 200
    
    except Exception as e:
        current_app.logger.error(f"GHL webhook error: {str(e)}")
        return jsonify({'error': 'Webhook processing failed'}), 500

def handle_contact_created(data):
    """Handle contact creation from GHL."""
    try:
        contact_data = data.get('contact', {})
        email = contact_data.get('email')
        
        if not email:
            return jsonify({'status': 'no_email'}), 200
        
        # Check if user already exists
        user = User.query.filter_by(email=email.lower()).first()
        
        if user:
            # Update GHL contact ID if not set
            if not user.ghl_contact_id:
                user.ghl_contact_id = contact_data.get('id')
                db.session.commit()
                current_app.logger.info(f"Updated GHL contact ID for user {email}")
        else:
            # Create new user from GHL contact
            user = User(
                email=email.lower(),
                name=f"{contact_data.get('firstName', '')} {contact_data.get('lastName', '')}".strip(),
                phone=contact_data.get('phone', ''),
                company=contact_data.get('companyName', ''),
                ghl_contact_id=contact_data.get('id'),
                password_hash='',  # Will need to set password on first login
                is_verified=False
            )
            
            db.session.add(user)
            db.session.commit()
            
            current_app.logger.info(f"Created new user from GHL contact: {email}")
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Contact creation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_contact_updated(data):
    """Handle contact updates from GHL."""
    try:
        contact_data = data.get('contact', {})
        contact_id = contact_data.get('id')
        email = contact_data.get('email')
        
        # Find user by GHL contact ID or email
        user = None
        if contact_id:
            user = User.query.filter_by(ghl_contact_id=contact_id).first()
        
        if not user and email:
            user = User.query.filter_by(email=email.lower()).first()
        
        if user:
            # Update user information
            if email and email != user.email:
                user.email = email.lower()
            
            name = f"{contact_data.get('firstName', '')} {contact_data.get('lastName', '')}".strip()
            if name:
                user.name = name
            
            if contact_data.get('phone'):
                user.phone = contact_data.get('phone')
            
            if contact_data.get('companyName'):
                user.company = contact_data.get('companyName')
            
            if not user.ghl_contact_id and contact_id:
                user.ghl_contact_id = contact_id
            
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            current_app.logger.info(f"Updated user from GHL contact: {user.email}")
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Contact update error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_opportunity_created(data):
    """Handle opportunity creation from GHL."""
    try:
        opportunity_data = data.get('opportunity', {})
        contact_id = opportunity_data.get('contactId')
        
        if contact_id:
            # Find user by GHL contact ID
            user = User.query.filter_by(ghl_contact_id=contact_id).first()
            
            if user:
                # Add opportunity information to user metadata or create separate opportunity record
                current_app.logger.info(f"Opportunity created for user: {user.email}")
                
                # You could create an Opportunity model here if needed
                # For now, just log the event
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Opportunity creation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_workflow_triggered(data):
    """Handle workflow triggers from GHL."""
    try:
        workflow_data = data.get('workflow', {})
        contact_id = data.get('contactId')
        
        current_app.logger.info(f"Workflow triggered: {workflow_data.get('name')} for contact {contact_id}")
        
        # Handle specific workflow actions here
        # For example, sending welcome emails, updating user status, etc.
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Workflow trigger error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@webhook_bp.route('/stripe', methods=['POST'])
def handle_stripe_webhook():
    """Handle Stripe webhook events."""
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        webhook_secret = current_app.config.get('STRIPE_WEBHOOK_SECRET')
        
        # Verify webhook signature
        from src.lib.stripe_service import StripeService
        stripe_service = StripeService()
        
        event_result = stripe_service.construct_webhook_event(
            payload, sig_header, webhook_secret
        )
        
        if not event_result['success']:
            current_app.logger.warning(f"Invalid Stripe webhook: {event_result['error']}")
            return jsonify({'error': event_result['error']}), 400
        
        event = event_result['event']
        event_type = event['type']
        
        current_app.logger.info(f"Received Stripe webhook: {event_type}")
        
        # Handle different event types
        if event_type == 'customer.subscription.created':
            return handle_subscription_created(event)
        elif event_type == 'customer.subscription.updated':
            return handle_subscription_updated(event)
        elif event_type == 'customer.subscription.deleted':
            return handle_subscription_cancelled(event)
        elif event_type == 'payment_intent.succeeded':
            return handle_payment_succeeded(event)
        elif event_type == 'payment_intent.payment_failed':
            return handle_payment_failed(event)
        else:
            current_app.logger.info(f"Unhandled Stripe event type: {event_type}")
            return jsonify({'status': 'ignored'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Stripe webhook error: {str(e)}")
        return jsonify({'error': 'Webhook processing failed'}), 500

def handle_subscription_created(event):
    """Handle subscription creation."""
    try:
        subscription = event['data']['object']
        customer_id = subscription['customer']
        subscription_id = subscription['id']
        
        # Find user by Stripe customer ID
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        
        if user:
            user.stripe_subscription_id = subscription_id
            user.subscription_status = subscription['status']
            
            # Determine tier based on price
            price_id = subscription['items']['data'][0]['price']['id']
            user.subscription_tier = determine_tier_from_price(price_id)
            
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            current_app.logger.info(f"Subscription created for user: {user.email}")
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Subscription creation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_subscription_updated(event):
    """Handle subscription updates."""
    try:
        subscription = event['data']['object']
        subscription_id = subscription['id']
        
        # Find user by subscription ID
        user = User.query.filter_by(stripe_subscription_id=subscription_id).first()
        
        if user:
            user.subscription_status = subscription['status']
            
            # Update tier if price changed
            price_id = subscription['items']['data'][0]['price']['id']
            user.subscription_tier = determine_tier_from_price(price_id)
            
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            current_app.logger.info(f"Subscription updated for user: {user.email}")
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Subscription update error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_subscription_cancelled(event):
    """Handle subscription cancellation."""
    try:
        subscription = event['data']['object']
        subscription_id = subscription['id']
        
        # Find user by subscription ID
        user = User.query.filter_by(stripe_subscription_id=subscription_id).first()
        
        if user:
            user.subscription_status = 'cancelled'
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            current_app.logger.info(f"Subscription cancelled for user: {user.email}")
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Subscription cancellation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_payment_succeeded(event):
    """Handle successful payment."""
    try:
        payment_intent = event['data']['object']
        customer_id = payment_intent.get('customer')
        
        if customer_id:
            user = User.query.filter_by(stripe_customer_id=customer_id).first()
            
            if user:
                # Add tokens or update user status based on payment
                current_app.logger.info(f"Payment succeeded for user: {user.email}")
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Payment success error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def handle_payment_failed(event):
    """Handle failed payment."""
    try:
        payment_intent = event['data']['object']
        customer_id = payment_intent.get('customer')
        
        if customer_id:
            user = User.query.filter_by(stripe_customer_id=customer_id).first()
            
            if user:
                current_app.logger.warning(f"Payment failed for user: {user.email}")
        
        return jsonify({'status': 'processed'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Payment failure error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def determine_tier_from_price(price_id):
    """Determine subscription tier from Stripe price ID."""
    # This would map Stripe price IDs to your subscription tiers
    price_to_tier = {
        # Add your actual Stripe price IDs here
        'price_starter': 'starter',
        'price_growth': 'growth',
        'price_expansion': 'expansion',
        'price_enterprise': 'enterprise'
    }
    
    return price_to_tier.get(price_id, 'starter')