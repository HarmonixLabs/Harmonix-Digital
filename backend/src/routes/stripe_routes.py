"""
Stripe payment routes for HARMONIX Platform
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from src.models.user import db, User
from src.lib.stripe_service import StripeService, HARMONIX_PRICING

stripe_bp = Blueprint('stripe', __name__)

@stripe_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    """Create a payment intent for one-time payments."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        tier = data.get('tier', 'starter')
        payment_type = data.get('payment_type', 'full')  # full or split
        
        if tier not in HARMONIX_PRICING:
            return jsonify({'error': 'Invalid pricing tier'}), 400
        
        # Calculate amount based on tier and payment type
        pricing = HARMONIX_PRICING[tier]
        if payment_type == 'split':
            amount = pricing['split_price']
        else:
            amount = pricing['full_price']
        
        # Apply early bird discount if applicable
        early_bird_discount = data.get('early_bird_discount', False)
        if early_bird_discount:
            amount = int(amount * 0.7)  # 30% discount
        
        stripe_service = StripeService()
        
        # Create or get customer
        if not user.stripe_customer_id:
            customer_result = stripe_service.create_customer(
                email=user.email,
                name=user.name,
                phone=user.phone,
                metadata={
                    'user_id': str(user.id),
                    'tier': tier,
                    'source': 'harmonix-platform'
                }
            )
            
            if customer_result['success']:
                user.stripe_customer_id = customer_result['customer_id']
                db.session.commit()
            else:
                return jsonify({'error': 'Failed to create customer'}), 500
        
        # Create payment intent
        intent_result = stripe_service.create_payment_intent(
            amount=amount,
            customer_id=user.stripe_customer_id,
            metadata={
                'user_id': str(user.id),
                'tier': tier,
                'payment_type': payment_type,
                'early_bird_discount': str(early_bird_discount)
            }
        )
        
        if intent_result['success']:
            return jsonify({
                'client_secret': intent_result['client_secret'],
                'amount': amount,
                'tier': tier,
                'payment_type': payment_type
            }), 200
        else:
            return jsonify({'error': intent_result['error']}), 500
    
    except Exception as e:
        current_app.logger.error(f"Payment intent error: {str(e)}")
        return jsonify({'error': 'Failed to create payment intent'}), 500

@stripe_bp.route('/create-subscription', methods=['POST'])
@jwt_required()
def create_subscription():
    """Create a subscription for recurring payments."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        tier = data.get('tier', 'starter')
        price_id = data.get('price_id')  # Stripe price ID
        
        if not price_id:
            return jsonify({'error': 'Price ID is required'}), 400
        
        stripe_service = StripeService()
        
        # Create or get customer
        if not user.stripe_customer_id:
            customer_result = stripe_service.create_customer(
                email=user.email,
                name=user.name,
                phone=user.phone,
                metadata={
                    'user_id': str(user.id),
                    'tier': tier,
                    'source': 'harmonix-platform'
                }
            )
            
            if customer_result['success']:
                user.stripe_customer_id = customer_result['customer_id']
                db.session.commit()
            else:
                return jsonify({'error': 'Failed to create customer'}), 500
        
        # Create subscription
        subscription_result = stripe_service.create_subscription(
            customer_id=user.stripe_customer_id,
            price_id=price_id,
            trial_period_days=7,  # 7-day trial
            metadata={
                'user_id': str(user.id),
                'tier': tier
            }
        )
        
        if subscription_result['success']:
            # Update user subscription info
            user.stripe_subscription_id = subscription_result['subscription_id']
            user.subscription_tier = tier
            user.subscription_status = 'active'
            db.session.commit()
            
            return jsonify({
                'client_secret': subscription_result['client_secret'],
                'subscription_id': subscription_result['subscription_id'],
                'tier': tier
            }), 200
        else:
            return jsonify({'error': subscription_result['error']}), 500
    
    except Exception as e:
        current_app.logger.error(f"Subscription error: {str(e)}")
        return jsonify({'error': 'Failed to create subscription'}), 500

@stripe_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    """Create a Stripe Checkout session."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        price_id = data.get('price_id')
        success_url = data.get('success_url', 'http://localhost:3000/success')
        cancel_url = data.get('cancel_url', 'http://localhost:3000/cancel')
        mode = data.get('mode', 'subscription')
        
        if not price_id:
            return jsonify({'error': 'Price ID is required'}), 400
        
        stripe_service = StripeService()
        
        session_result = stripe_service.create_checkout_session(
            price_id=price_id,
            success_url=success_url,
            cancel_url=cancel_url,
            customer_id=user.stripe_customer_id,
            mode=mode,
            metadata={
                'user_id': str(user.id),
                'source': 'harmonix-platform'
            }
        )
        
        if session_result['success']:
            return jsonify({
                'checkout_url': session_result['checkout_url'],
                'session_id': session_result['session_id']
            }), 200
        else:
            return jsonify({'error': session_result['error']}), 500
    
    except Exception as e:
        current_app.logger.error(f"Checkout session error: {str(e)}")
        return jsonify({'error': 'Failed to create checkout session'}), 500

@stripe_bp.route('/customer-portal', methods=['POST'])
@jwt_required()
def create_customer_portal():
    """Create a customer portal session for subscription management."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.stripe_customer_id:
            return jsonify({'error': 'No customer found'}), 404
        
        data = request.get_json()
        return_url = data.get('return_url', 'http://localhost:3000/settings')
        
        stripe_service = StripeService()
        
        portal_result = stripe_service.create_portal_session(
            customer_id=user.stripe_customer_id,
            return_url=return_url
        )
        
        if portal_result['success']:
            return jsonify({
                'portal_url': portal_result['portal_url']
            }), 200
        else:
            return jsonify({'error': portal_result['error']}), 500
    
    except Exception as e:
        current_app.logger.error(f"Customer portal error: {str(e)}")
        return jsonify({'error': 'Failed to create customer portal'}), 500

@stripe_bp.route('/subscription/<subscription_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_subscription(subscription_id):
    """Cancel a subscription."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.stripe_subscription_id != subscription_id:
            return jsonify({'error': 'Subscription not found'}), 404
        
        data = request.get_json()
        at_period_end = data.get('at_period_end', True)
        
        stripe_service = StripeService()
        
        cancel_result = stripe_service.cancel_subscription(
            subscription_id=subscription_id,
            at_period_end=at_period_end
        )
        
        if cancel_result['success']:
            if not at_period_end:
                user.subscription_status = 'cancelled'
                db.session.commit()
            
            return jsonify({
                'message': 'Subscription cancelled successfully',
                'cancelled_immediately': not at_period_end
            }), 200
        else:
            return jsonify({'error': cancel_result['error']}), 500
    
    except Exception as e:
        current_app.logger.error(f"Cancel subscription error: {str(e)}")
        return jsonify({'error': 'Failed to cancel subscription'}), 500

@stripe_bp.route('/pricing', methods=['GET'])
def get_pricing():
    """Get current pricing information."""
    return jsonify({
        'pricing': HARMONIX_PRICING,
        'currency': 'usd',
        'early_bird_discount': 0.3,  # 30% discount
        'trial_days': 7
    }), 200