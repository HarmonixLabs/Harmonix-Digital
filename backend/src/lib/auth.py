"""
Authentication utilities for HARMONIX Platform
"""

import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import current_app, request, jsonify
from flask_jwt_extended import get_jwt_identity

def generate_token(user_id, expires_in_hours=24):
    """Generate JWT token for user."""
    payload = {
        'user_id': user_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=expires_in_hours)
    }
    
    secret_key = current_app.config.get('JWT_SECRET_KEY') or os.getenv('JWT_SECRET')
    return jwt.encode(payload, secret_key, algorithm='HS256')

def verify_token(token):
    """Verify JWT token and return user ID."""
    try:
        secret_key = current_app.config.get('JWT_SECRET_KEY') or os.getenv('JWT_SECRET')
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload.get('user_id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require valid JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        user_id = verify_token(token)
        if user_id is None:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        # Add user_id to request context
        request.current_user_id = user_id
        return f(*args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator to require admin role."""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        from src.models.user import User
        
        user_id = request.current_user_id
        user = User.query.get(user_id)
        
        if not user or user.role not in ['admin', 'super_admin']:
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated

def subscription_required(min_tier='starter'):
    """Decorator to require specific subscription tier."""
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(*args, **kwargs):
            from src.models.user import User
            
            user_id = request.current_user_id
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Define tier hierarchy
            tier_hierarchy = {
                'trial': 0,
                'starter': 1,
                'growth': 2,
                'expansion': 3,
                'enterprise': 4
            }
            
            user_tier_level = tier_hierarchy.get(user.subscription_tier, 0)
            required_tier_level = tier_hierarchy.get(min_tier, 1)
            
            if user_tier_level < required_tier_level:
                return jsonify({
                    'error': f'Subscription tier {min_tier} or higher required',
                    'current_tier': user.subscription_tier,
                    'required_tier': min_tier
                }), 402  # Payment Required
            
            # Check if subscription is active
            if user.subscription_status != 'active':
                return jsonify({
                    'error': 'Active subscription required',
                    'subscription_status': user.subscription_status
                }), 402
            
            return f(*args, **kwargs)
        
        return decorated
    return decorator

def rate_limit(max_requests=100, window_minutes=60):
    """Basic rate limiting decorator."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # Simple implementation - in production, use Redis
            # For now, just log the request
            current_app.logger.info(f"Rate limit check for {request.remote_addr}")
            return f(*args, **kwargs)
        
        return decorated
    return decorator