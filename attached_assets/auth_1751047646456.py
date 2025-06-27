import jwt
import datetime
from flask import current_app
from functools import wraps

def generate_jwt(user_id, expires_in_hours=24):
    """Generate JWT token for user authentication"""
    try:
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=expires_in_hours),
            'iat': datetime.datetime.utcnow(),
            'iss': 'harmonix-api'
        }
        
        token = jwt.encode(
            payload,
            current_app.config['JWT_SECRET'],
            algorithm='HS256'
        )
        
        return token
    except Exception as e:
        current_app.logger.error(f"JWT generation error: {e}")
        return None

def validate_jwt(token):
    """Validate JWT token and return payload"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET'],
            algorithms=['HS256'],
            issuer='harmonix-api'
        )
        return payload
    except jwt.ExpiredSignatureError:
        current_app.logger.warning("JWT token expired")
        return None
    except jwt.InvalidTokenError as e:
        current_app.logger.warning(f"Invalid JWT token: {e}")
        return None
    except Exception as e:
        current_app.logger.error(f"JWT validation error: {e}")
        return None

def require_auth(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, jsonify
        from src.models.user import User
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication token required'
                }
            }), 401
        
        token = auth_header.split(' ')[1]
        
        # Validate token
        payload = validate_jwt(token)
        if not payload:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Invalid or expired token'
                }
            }), 401
        
        # Get user
        user = User.query.get(payload['user_id'])
        if not user or user.deleted_at:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'USER_NOT_FOUND',
                    'message': 'User not found'
                }
            }), 404
        
        # Add user to request context
        request.current_user = user
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_trial_or_active(f):
    """Decorator to require trial or active subscription"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request, jsonify
        
        user = getattr(request, 'current_user', None)
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        if user.status not in ['trial', 'active'] or (user.status == 'trial' and not user.is_trial_active()):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'SUBSCRIPTION_REQUIRED',
                    'message': 'Active subscription or trial required',
                    'trial_expired': user.status == 'trial' and not user.is_trial_active()
                }
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function

def generate_demo_token(session_id):
    """Generate temporary token for demo users"""
    try:
        payload = {
            'demo_session_id': session_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2),
            'iat': datetime.datetime.utcnow(),
            'iss': 'harmonix-api',
            'type': 'demo'
        }
        
        token = jwt.encode(
            payload,
            current_app.config['JWT_SECRET'],
            algorithm='HS256'
        )
        
        return token
    except Exception as e:
        current_app.logger.error(f"Demo token generation error: {e}")
        return None

def validate_demo_token(token):
    """Validate demo token and return session info"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET'],
            algorithms=['HS256'],
            issuer='harmonix-api'
        )
        
        if payload.get('type') != 'demo':
            return None
            
        return payload
    except jwt.ExpiredSignatureError:
        current_app.logger.warning("Demo token expired")
        return None
    except jwt.InvalidTokenError as e:
        current_app.logger.warning(f"Invalid demo token: {e}")
        return None
    except Exception as e:
        current_app.logger.error(f"Demo token validation error: {e}")
        return None

