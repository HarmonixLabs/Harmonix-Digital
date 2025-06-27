"""
Stripe Payment Service for HARMONIX Platform
"""

import stripe
import os
from flask import current_app
from typing import Dict, Optional
from datetime import datetime

class StripeService:
    """Service for handling Stripe payment operations."""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or current_app.config.get('STRIPE_SECRET_KEY') or os.getenv('STRIPE_SECRET_KEY')
        stripe.api_key = self.api_key
    
    def create_customer(self, email: str, name: str = None, phone: str = None, metadata: Dict = None) -> Dict:
        """Create a new Stripe customer."""
        try:
            customer_data = {
                'email': email,
                'metadata': metadata or {}
            }
            
            if name:
                customer_data['name'] = name
            if phone:
                customer_data['phone'] = phone
            
            customer = stripe.Customer.create(**customer_data)
            
            return {
                'success': True,
                'customer_id': customer.id,
                'customer': customer
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def create_payment_intent(self, amount: int, currency: str = 'usd', 
                             customer_id: str = None, metadata: Dict = None) -> Dict:
        """Create a payment intent for one-time payments."""
        try:
            intent_data = {
                'amount': amount,  # Amount in cents
                'currency': currency,
                'metadata': metadata or {},
                'automatic_payment_methods': {
                    'enabled': True,
                }
            }
            
            if customer_id:
                intent_data['customer'] = customer_id
            
            intent = stripe.PaymentIntent.create(**intent_data)
            
            return {
                'success': True,
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id,
                'intent': intent
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def create_subscription(self, customer_id: str, price_id: str, 
                           trial_period_days: int = None, metadata: Dict = None) -> Dict:
        """Create a subscription for recurring payments."""
        try:
            subscription_data = {
                'customer': customer_id,
                'items': [{'price': price_id}],
                'payment_behavior': 'default_incomplete',
                'expand': ['latest_invoice.payment_intent'],
                'metadata': metadata or {}
            }
            
            if trial_period_days:
                subscription_data['trial_period_days'] = trial_period_days
            
            subscription = stripe.Subscription.create(**subscription_data)
            
            return {
                'success': True,
                'subscription_id': subscription.id,
                'client_secret': subscription.latest_invoice.payment_intent.client_secret,
                'subscription': subscription
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def get_customer(self, customer_id: str) -> Dict:
        """Retrieve customer information."""
        try:
            customer = stripe.Customer.retrieve(customer_id)
            
            return {
                'success': True,
                'customer': customer
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def get_subscription(self, subscription_id: str) -> Dict:
        """Retrieve subscription information."""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            return {
                'success': True,
                'subscription': subscription
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def cancel_subscription(self, subscription_id: str, at_period_end: bool = True) -> Dict:
        """Cancel a subscription."""
        try:
            if at_period_end:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True
                )
            else:
                subscription = stripe.Subscription.delete(subscription_id)
            
            return {
                'success': True,
                'subscription': subscription
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def create_checkout_session(self, price_id: str, success_url: str, cancel_url: str,
                               customer_id: str = None, metadata: Dict = None,
                               mode: str = 'subscription') -> Dict:
        """Create a Stripe Checkout session."""
        try:
            session_data = {
                'line_items': [{
                    'price': price_id,
                    'quantity': 1,
                }],
                'mode': mode,
                'success_url': success_url,
                'cancel_url': cancel_url,
                'metadata': metadata or {}
            }
            
            if customer_id:
                session_data['customer'] = customer_id
            else:
                session_data['customer_creation'] = 'always'
            
            if mode == 'subscription':
                session_data['subscription_data'] = {
                    'trial_period_days': 7  # 7-day trial
                }
            
            session = stripe.checkout.Session.create(**session_data)
            
            return {
                'success': True,
                'session_id': session.id,
                'checkout_url': session.url,
                'session': session
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def construct_webhook_event(self, payload: bytes, sig_header: str, 
                               webhook_secret: str = None) -> Dict:
        """Construct and verify a webhook event."""
        try:
            webhook_secret = webhook_secret or current_app.config.get('STRIPE_WEBHOOK_SECRET')
            
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
            
            return {
                'success': True,
                'event': event
            }
        
        except ValueError as e:
            return {
                'success': False,
                'error': f'Invalid payload: {str(e)}'
            }
        except stripe.error.SignatureVerificationError as e:
            return {
                'success': False,
                'error': f'Invalid signature: {str(e)}'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def get_prices(self, product_id: str = None, active: bool = True) -> Dict:
        """Get available prices."""
        try:
            params = {'active': active}
            if product_id:
                params['product'] = product_id
            
            prices = stripe.Price.list(**params)
            
            return {
                'success': True,
                'prices': prices.data
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def create_portal_session(self, customer_id: str, return_url: str) -> Dict:
        """Create a customer portal session for subscription management."""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )
            
            return {
                'success': True,
                'portal_url': session.url,
                'session': session
            }
        
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def validate_api_key(self) -> Dict:
        """Validate the Stripe API key."""
        try:
            # Try to retrieve account information
            account = stripe.Account.retrieve()
            
            return {
                'success': True,
                'account_id': account.id,
                'country': account.country,
                'business_profile': account.business_profile
            }
        
        except stripe.error.AuthenticationError as e:
            return {
                'success': False,
                'error': 'Invalid API key'
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }

# Pricing configuration for HARMONIX tiers
HARMONIX_PRICING = {
    'starter': {
        'full_price': 4400,  # $44.00
        'split_price': 5148,  # $51.48 (17% increase)
        'description': 'Perfect for small businesses getting started with AI automation',
        'features': [
            '2 AI Agents',
            'Basic automation workflows',
            'Email support',
            '1,000 monthly tokens'
        ]
    },
    'growth': {
        'full_price': 8000,  # $80.00
        'split_price': 9360,  # $93.60
        'description': 'Ideal for growing businesses ready to scale operations',
        'features': [
            '5 AI Agents',
            'Advanced automation workflows',
            'Priority support',
            '5,000 monthly tokens',
            'CRM integration'
        ]
    },
    'expansion': {
        'full_price': 15000,  # $150.00
        'split_price': 17550,  # $175.50
        'description': 'Comprehensive solution for established enterprises',
        'features': [
            '10 AI Agents',
            'Custom automation workflows',
            'Dedicated support',
            '15,000 monthly tokens',
            'Full platform access'
        ]
    },
    'enterprise': {
        'full_price': 21500,  # $215.00
        'split_price': 25155,  # $251.55
        'description': 'Ultimate AI platform for large-scale operations',
        'features': [
            'Unlimited AI Agents',
            'Enterprise automation',
            '24/7 dedicated support',
            'Unlimited tokens',
            'Custom integrations',
            'White-label options'
        ]
    }
}