import stripe
import time
from flask import current_app
from src.models.user import db, ExternalSyncLog
from datetime import datetime

class StripeService:
    """Stripe payment integration service"""
    
    def __init__(self):
        self.api_key = current_app.config.get('STRIPE_SECRET_KEY')
        stripe.api_key = self.api_key
        self.webhook_secret = current_app.config.get('STRIPE_WEBHOOK_SECRET')
    
    def _log_operation(self, user_id, operation, request_data, response_data, status, error_message=None):
        """Log Stripe operation for audit trail"""
        try:
            sync_log = ExternalSyncLog(
                user_id=user_id,
                system_name='stripe',
                operation=operation,
                request_data=request_data,
                response_data=response_data,
                status=status,
                error_message=error_message,
                completed_at=datetime.utcnow()
            )
            db.session.add(sync_log)
            db.session.commit()
        except Exception as e:
            current_app.logger.error(f"Failed to log Stripe operation: {e}")
    
    def create_customer(self, customer_data, user_id=None):
        """Create a new Stripe customer"""
        try:
            # Prepare customer data
            stripe_data = {
                'name': customer_data.get('name'),
                'email': customer_data.get('email'),
                'phone': customer_data.get('phone'),
                'metadata': customer_data.get('metadata', {})
            }
            
            # Remove None values
            stripe_data = {k: v for k, v in stripe_data.items() if v is not None}
            
            # Create customer
            customer = stripe.Customer.create(**stripe_data)
            
            # Log success
            if user_id:
                self._log_operation(
                    user_id,
                    'create_customer',
                    stripe_data,
                    {'customer_id': customer.id},
                    'success'
                )
            
            return {
                'success': True,
                'customer_id': customer.id,
                'customer': customer
            }
        
        except stripe.error.StripeError as e:
            error_message = str(e)
            current_app.logger.error(f"Stripe customer creation error: {e}")
            
            if user_id:
                self._log_operation(
                    user_id,
                    'create_customer',
                    stripe_data,
                    None,
                    'failed',
                    error_message
                )
            
            return {
                'success': False,
                'error': error_message
            }
        
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            current_app.logger.error(f"Customer creation error: {e}")
            
            if user_id:
                self._log_operation(
                    user_id,
                    'create_customer',
                    customer_data,
                    None,
                    'failed',
                    error_message
                )
            
            return {
                'success': False,
                'error': error_message
            }
    
    def create_trial_subscription(self, customer_id, plan_id, user_id=None, trial_days=7):
        """Create a subscription with trial period"""
        try:
            # Calculate trial end date
            trial_end = int(time.time()) + (trial_days * 24 * 60 * 60)
            
            subscription_data = {
                'customer': customer_id,
                'items': [{'price': plan_id}],
                'trial_end': trial_end,
                'payment_behavior': 'default_incomplete',
                'payment_settings': {
                    'save_default_payment_method': 'on_subscription'
                },
                'expand': ['latest_invoice.payment_intent'],
                'metadata': {
                    'trial_days': str(trial_days),
                    'created_via': 'harmonix_platform'
                }
            }
            
            # Create subscription
            subscription = stripe.Subscription.create(**subscription_data)
            
            # Log success
            if user_id:
                self._log_operation(
                    user_id,
                    'create_trial_subscription',
                    subscription_data,
                    {
                        'subscription_id': subscription.id,
                        'status': subscription.status,
                        'trial_end': subscription.trial_end
                    },
                    'success'
                )
            
            return {
                'success': True,
                'subscription_id': subscription.id,
                'subscription': subscription,
                'trial_end': datetime.fromtimestamp(subscription.trial_end) if subscription.trial_end else None
            }
        
        except stripe.error.StripeError as e:
            error_message = str(e)
            current_app.logger.error(f"Stripe subscription creation error: {e}")
            
            if user_id:
                self._log_operation(
                    user_id,
                    'create_trial_subscription',
                    subscription_data,
                    None,
                    'failed',
                    error_message
                )
            
            return {
                'success': False,
                'error': error_message
            }
        
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            current_app.logger.error(f"Subscription creation error: {e}")
            
            if user_id:
                self._log_operation(
                    user_id,
                    'create_trial_subscription',
                    {'customer_id': customer_id, 'plan_id': plan_id},
                    None,
                    'failed',
                    error_message
                )
            
            return {
                'success': False,
                'error': error_message
            }
    
    def update_subscription(self, subscription_id, update_data, user_id=None):
        """Update subscription parameters"""
        try:
            # Update subscription
            subscription = stripe.Subscription.modify(subscription_id, **update_data)
            
            # Log success
            if user_id:
                self._log_operation(
                    user_id,
                    'update_subscription',
                    update_data,
                    {
                        'subscription_id': subscription.id,
                        'status': subscription.status
                    },
                    'success'
                )
            
            return {
                'success': True,
                'subscription': subscription
            }
        
        except stripe.error.StripeError as e:
            error_message = str(e)
            current_app.logger.error(f"Stripe subscription update error: {e}")
            
            if user_id:
                self._log_operation(
                    user_id,
                    'update_subscription',
                    update_data,
                    None,
                    'failed',
                    error_message
                )
            
            return {
                'success': False,
                'error': error_message
            }
        
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            current_app.logger.error(f"Subscription update error: {e}")
            
            return {
                'success': False,
                'error': error_message
            }
    
    def cancel_subscription(self, subscription_id, options=None, user_id=None):
        """Cancel a subscription"""
        try:
            cancel_options = options or {}
            
            # Cancel subscription
            subscription = stripe.Subscription.delete(subscription_id, **cancel_options)
            
            # Log success
            if user_id:
                self._log_operation(
                    user_id,
                    'cancel_subscription',
                    cancel_options,
                    {
                        'subscription_id': subscription.id,
                        'status': subscription.status,
                        'canceled_at': subscription.canceled_at
                    },
                    'success'
                )
            
            return {
                'success': True,
                'cancellation': subscription
            }
        
        except stripe.error.StripeError as e:
            error_message = str(e)
            current_app.logger.error(f"Stripe subscription cancellation error: {e}")
            
            if user_id:
                self._log_operation(
                    user_id,
                    'cancel_subscription',
                    options or {},
                    None,
                    'failed',
                    error_message
                )
            
            return {
                'success': False,
                'error': error_message
            }
        
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            current_app.logger.error(f"Subscription cancellation error: {e}")
            
            return {
                'success': False,
                'error': error_message
            }
    
    def get_subscription(self, subscription_id, user_id=None):
        """Retrieve subscription information"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            return {
                'success': True,
                'subscription': subscription
            }
        
        except stripe.error.StripeError as e:
            error_message = str(e)
            current_app.logger.error(f"Stripe subscription retrieval error: {e}")
            
            return {
                'success': False,
                'error': error_message
            }
        
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            current_app.logger.error(f"Subscription retrieval error: {e}")
            
            return {
                'success': False,
                'error': error_message
            }
    
    def create_payment_intent(self, amount, currency='usd', customer_id=None, metadata=None, user_id=None):
        """Create a payment intent for one-time payments"""
        try:
            payment_data = {
                'amount': amount,
                'currency': currency,
                'automatic_payment_methods': {'enabled': True},
                'metadata': metadata or {}
            }
            
            if customer_id:
                payment_data['customer'] = customer_id
            
            # Create payment intent
            payment_intent = stripe.PaymentIntent.create(**payment_data)
            
            # Log success
            if user_id:
                self._log_operation(
                    user_id,
                    'create_payment_intent',
                    payment_data,
                    {
                        'payment_intent_id': payment_intent.id,
                        'status': payment_intent.status,
                        'amount': payment_intent.amount
                    },
                    'success'
                )
            
            return {
                'success': True,
                'payment_intent': payment_intent,
                'client_secret': payment_intent.client_secret
            }
        
        except stripe.error.StripeError as e:
            error_message = str(e)
            current_app.logger.error(f"Stripe payment intent creation error: {e}")
            
            if user_id:
                self._log_operation(
                    user_id,
                    'create_payment_intent',
                    payment_data,
                    None,
                    'failed',
                    error_message
                )
            
            return {
                'success': False,
                'error': error_message
            }
        
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            current_app.logger.error(f"Payment intent creation error: {e}")
            
            return {
                'success': False,
                'error': error_message
            }
    
    def construct_webhook_event(self, payload, signature):
        """Construct and verify webhook event"""
        try:
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                self.webhook_secret
            )
            return {
                'success': True,
                'event': event
            }
        
        except ValueError as e:
            current_app.logger.error(f"Invalid webhook payload: {e}")
            return {
                'success': False,
                'error': 'Invalid payload'
            }
        
        except stripe.error.SignatureVerificationError as e:
            current_app.logger.error(f"Invalid webhook signature: {e}")
            return {
                'success': False,
                'error': 'Invalid signature'
            }
        
        except Exception as e:
            current_app.logger.error(f"Webhook construction error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_customer(self, customer_id):
        """Retrieve customer information"""
        try:
            customer = stripe.Customer.retrieve(customer_id)
            return {
                'success': True,
                'customer': customer
            }
        
        except stripe.error.StripeError as e:
            error_message = str(e)
            current_app.logger.error(f"Stripe customer retrieval error: {e}")
            return {
                'success': False,
                'error': error_message
            }
        
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            current_app.logger.error(f"Customer retrieval error: {e}")
            return {
                'success': False,
                'error': error_message
            }

