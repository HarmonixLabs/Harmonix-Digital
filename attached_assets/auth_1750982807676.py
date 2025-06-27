from flask import Blueprint, request, jsonify, current_app
from src.models.user import db, User, UserAuditLog, DemoSession, Agent
from src.lib.ghl import GHLService
from src.lib.stripe_service import StripeService
from src.lib.auth import generate_jwt, validate_jwt
from src.lib.email_service import EmailService
import re
from datetime import datetime, timedelta
import secrets

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    if not re.search(r'[@$!%*?&]', password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

def log_user_action(user_id, action, details=None, ip_address=None, user_agent=None):
    """Log user action for audit trail"""
    try:
        audit_log = UserAuditLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.session.add(audit_log)
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Failed to log user action: {e}")

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new user and start trial"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'acceptTerms']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Missing required fields',
                    'details': {field: [f'{field} is required'] for field in missing_fields}
                }
            }), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Invalid email format',
                    'details': {'email': ['Please enter a valid email address']}
                }
            }), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Email already registered',
                    'details': {'email': ['This email is already registered']}
                }
            }), 400
        
        # Validate password
        password_valid, password_message = validate_password(data['password'])
        if not password_valid:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Invalid password',
                    'details': {'password': [password_message]}
                }
            }), 400
        
        # Validate terms acceptance
        if not data.get('acceptTerms'):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Terms must be accepted',
                    'details': {'acceptTerms': ['Please accept the terms to continue']}
                }
            }), 400
        
        # Create new user
        user = User(
            name=data['name'].strip(),
            email=data['email'].lower().strip(),
            phone=data.get('phone', '').strip() if data.get('phone') else None,
            company=data.get('company', '').strip() if data.get('company') else None,
            industry=data.get('industry', '').strip() if data.get('industry') else None,
            team_size=data.get('teamSize', '').strip() if data.get('teamSize') else None,
            marketing_consent=data.get('marketingConsent', False),
            sms_consent=data.get('smsConsent', False),
            terms_accepted_at=datetime.utcnow(),
            privacy_accepted_at=datetime.utcnow()
        )
        
        # Set password
        user.set_password(data['password'])
        
        # Start trial
        user.start_trial()
        
        # Generate email verification token
        verification_token = user.generate_email_verification_token()
        
        # Save user to database
        db.session.add(user)
        db.session.commit()
        
        # Log registration
        log_user_action(
            user.id, 
            'registration',
            {
                'industry': user.industry,
                'team_size': user.team_size,
                'marketing_consent': user.marketing_consent,
                'sms_consent': user.sms_consent
            },
            request.remote_addr,
            request.headers.get('User-Agent')
        )
        
        # Initialize external services
        ghl_service = GHLService()
        stripe_service = StripeService()
        email_service = EmailService()
        
        # Send email verification
        try:
            email_service.send_verification_email(user.email, user.name, verification_token)
        except Exception as e:
            current_app.logger.error(f"Email verification send failed: {e}")
        
        # Create contact in GoHighLevel
        try:
            ghl_result = ghl_service.create_contact({
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'company': user.company,
                'industry': user.industry,
                'team_size': user.team_size,
                'source': 'trial_signup'
            })
            
            if ghl_result['success']:
                user.ghl_contact_id = ghl_result['contact_id']
                # Tag as trial user
                ghl_service.tag_contact(ghl_result['contact_id'], ['Trial User', 'New Signup'])
        except Exception as e:
            current_app.logger.error(f"GHL contact creation failed: {e}")
        
        # Create Stripe customer and trial subscription
        try:
            stripe_result = stripe_service.create_customer({
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'metadata': {
                    'user_id': user.id,
                    'industry': user.industry or '',
                    'team_size': user.team_size or ''
                }
            })
            
            if stripe_result['success']:
                user.stripe_customer_id = stripe_result['customer_id']
                
                # Create trial subscription
                subscription_result = stripe_service.create_trial_subscription(
                    stripe_result['customer_id'],
                    'harmonix_pro_plan'  # This would be configured in Stripe
                )
                
                if subscription_result['success']:
                    user.stripe_subscription_id = subscription_result['subscription_id']
        except Exception as e:
            current_app.logger.error(f"Stripe setup failed: {e}")
        
        # Save external service IDs
        db.session.commit()
        
        # Generate JWT token
        token = generate_jwt(user.id)
        
        # Record login for new user
        user.record_login()
        db.session.commit()
        
        # Prepare response
        response_data = {
            'success': True,
            'data': {
                'user': user.to_dict(),
                'token': token,
                'subscription': {
                    'id': user.stripe_subscription_id,
                    'status': 'trialing',
                    'trial_end': user.trial_ends_at.isoformat() if user.trial_ends_at else None
                }
            },
            'message': 'Registration successful. Welcome to your 7-day free trial! Please check your email to verify your account.'
        }
        
        return jsonify(response_data), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Registration error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Registration failed. Please try again.',
                'retryAfter': 30
            }
        }), 500

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    """Verify user email address"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Verification token is required'
                }
            }), 400
        
        # Find user by verification token
        user = User.query.filter_by(email_verification_token=token).first()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_TOKEN',
                    'message': 'Invalid or expired verification token'
                }
            }), 400
        
        # Check if token is expired (24 hours)
        if user.email_verification_sent_at and \
           datetime.utcnow() - user.email_verification_sent_at > timedelta(hours=24):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'TOKEN_EXPIRED',
                    'message': 'Verification token has expired. Please request a new one.'
                }
            }), 400
        
        # Verify email
        user.email_verified = True
        user.email_verification_token = None
        user.email_verification_sent_at = None
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log email verification
        log_user_action(
            user.id,
            'email_verified',
            None,
            request.remote_addr,
            request.headers.get('User-Agent')
        )
        
        return jsonify({
            'success': True,
            'message': 'Email verified successfully!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Email verification error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Email verification failed. Please try again.'
            }
        }), 500

@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend email verification"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Email is required'
                }
            }), 400
        
        user = User.query.filter_by(email=email.lower().strip()).first()
        if not user:
            # Don't reveal if email exists
            return jsonify({
                'success': True,
                'message': 'If the email exists, a verification link has been sent.'
            }), 200
        
        if user.email_verified:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'ALREADY_VERIFIED',
                    'message': 'Email is already verified'
                }
            }), 400
        
        # Generate new verification token
        verification_token = user.generate_email_verification_token()
        db.session.commit()
        
        # Send verification email
        email_service = EmailService()
        try:
            email_service.send_verification_email(user.email, user.name, verification_token)
        except Exception as e:
            current_app.logger.error(f"Email verification send failed: {e}")
        
        return jsonify({
            'success': True,
            'message': 'Verification email sent successfully!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Resend verification error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to resend verification email'
            }
        }), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Email is required'
                }
            }), 400
        
        user = User.query.filter_by(email=email.lower().strip()).first()
        if not user:
            # Don't reveal if email exists
            return jsonify({
                'success': True,
                'message': 'If the email exists, a password reset link has been sent.'
            }), 200
        
        # Generate password reset token
        reset_token = user.generate_password_reset_token()
        db.session.commit()
        
        # Send password reset email
        email_service = EmailService()
        try:
            email_service.send_password_reset_email(user.email, user.name, reset_token)
        except Exception as e:
            current_app.logger.error(f"Password reset email send failed: {e}")
        
        # Log password reset request
        log_user_action(
            user.id,
            'password_reset_requested',
            None,
            request.remote_addr,
            request.headers.get('User-Agent')
        )
        
        return jsonify({
            'success': True,
            'message': 'Password reset email sent successfully!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Forgot password error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to send password reset email'
            }
        }), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset user password"""
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('password')
        
        if not token or not new_password:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Token and new password are required'
                }
            }), 400
        
        # Validate new password
        password_valid, password_message = validate_password(new_password)
        if not password_valid:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Invalid password',
                    'details': {'password': [password_message]}
                }
            }), 400
        
        # Find user by reset token
        user = User.query.filter_by(password_reset_token=token).first()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_TOKEN',
                    'message': 'Invalid or expired reset token'
                }
            }), 400
        
        # Check if token is expired (1 hour)
        if user.password_reset_sent_at and \
           datetime.utcnow() - user.password_reset_sent_at > timedelta(hours=1):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'TOKEN_EXPIRED',
                    'message': 'Reset token has expired. Please request a new one.'
                }
            }), 400
        
        # Reset password
        user.set_password(new_password)
        user.password_reset_token = None
        user.password_reset_sent_at = None
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log password reset
        log_user_action(
            user.id,
            'password_reset',
            None,
            request.remote_addr,
            request.headers.get('User-Agent')
        )
        
        return jsonify({
            'success': True,
            'message': 'Password reset successfully!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Password reset error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Password reset failed. Please try again.'
            }
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Email and password are required'
                }
            }), 400
        
        # Find user
        user = User.query.filter_by(email=data['email'].lower().strip()).first()
        if not user or not user.check_password(data['password']):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Invalid email or password'
                }
            }), 401
        
        # Check if user is deleted
        if user.deleted_at:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'ACCOUNT_DISABLED',
                    'message': 'Account has been disabled'
                }
            }), 403
        
        # Log login
        log_user_action(
            user.id,
            'login',
            {'login_method': 'email_password'},
            request.remote_addr,
            request.headers.get('User-Agent')
        )
        
        # Generate JWT token
        token = generate_jwt(user.id)
        
        # Update last login
        user.record_login()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'user': user.to_dict(),
                'token': token
            },
            'message': 'Login successful'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Login error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Login failed. Please try again.'
            }
        }), 500

@auth_bp.route('/demo-login', methods=['POST'])
def demo_login():
    """Create demo session for agent testing"""
    try:
        data = request.get_json()
        agent_id = data.get('agent_id')
        
        if not agent_id:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Agent ID is required'
                }
            }), 400
        
        # Verify agent exists
        agent = Agent.query.get(agent_id)
        if not agent or not agent.is_active:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_NOT_FOUND',
                    'message': 'Agent not found or inactive'
                }
            }), 404
        
        # Create demo session
        session_token = secrets.token_urlsafe(32)
        demo_session = DemoSession(
            session_token=session_token,
            agent_id=agent_id,
            expires_at=datetime.utcnow() + timedelta(hours=24)
        )
        
        db.session.add(demo_session)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'demo_session': demo_session.to_dict(),
                'session_token': session_token
            },
            'message': 'Demo session created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Demo login error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to create demo session'
            }
        }), 500

@auth_bp.route('/waitlist', methods=['POST'])
def join_waitlist():
    """Join waitlist for early access"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Missing required fields',
                    'details': {field: [f'{field} is required'] for field in missing_fields}
                }
            }), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Invalid email format'
                }
            }), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            if existing_user.waitlist_joined_at:
                return jsonify({
                    'success': True,
                    'message': 'You are already on the waitlist!',
                    'data': {
                        'position': existing_user.waitlist_position
                    }
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'EMAIL_EXISTS',
                        'message': 'Email is already registered'
                    }
                }), 400
        
        # Get current waitlist position
        max_position = db.session.query(db.func.max(User.waitlist_position)).scalar() or 0
        new_position = max_position + 1
        
        # Create waitlist user
        user = User(
            name=data['name'].strip(),
            email=data['email'].lower().strip(),
            company=data.get('company', '').strip() if data.get('company') else None,
            industry=data.get('industry', '').strip() if data.get('industry') else None,
            status='waitlist',
            waitlist_position=new_position,
            waitlist_joined_at=datetime.utcnow(),
            marketing_consent=data.get('marketingConsent', False)
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Log waitlist join
        log_user_action(
            user.id,
            'waitlist_joined',
            {
                'position': new_position,
                'industry': user.industry,
                'company': user.company
            },
            request.remote_addr,
            request.headers.get('User-Agent')
        )
        
        # Add to GoHighLevel
        try:
            ghl_service = GHLService()
            ghl_result = ghl_service.create_contact({
                'name': user.name,
                'email': user.email,
                'company': user.company,
                'industry': user.industry,
                'source': 'waitlist'
            })
            
            if ghl_result['success']:
                user.ghl_contact_id = ghl_result['contact_id']
                ghl_service.tag_contact(ghl_result['contact_id'], ['Waitlist', f'Position-{new_position}'])
                db.session.commit()
        except Exception as e:
            current_app.logger.error(f"GHL waitlist contact creation failed: {e}")
        
        return jsonify({
            'success': True,
            'data': {
                'position': new_position,
                'total_waitlist': new_position
            },
            'message': f'Welcome to the waitlist! You are #{new_position} in line.'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Waitlist join error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to join waitlist. Please try again.'
            }
        }), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user information"""
    try:
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
        
        return jsonify({
            'success': True,
            'data': {
                'user': user.to_dict()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get current user error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to get user information'
            }
        }), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout endpoint"""
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            payload = validate_jwt(token)
            
            if payload:
                # Log logout
                log_user_action(
                    payload['user_id'],
                    'logout',
                    None,
                    request.remote_addr,
                    request.headers.get('User-Agent')
                )
        
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Logout error: {e}")
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        }), 200

