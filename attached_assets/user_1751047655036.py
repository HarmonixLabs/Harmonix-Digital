from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import uuid
import hashlib
import secrets
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(255), nullable=True)
    
    # User status and trial management
    status = db.Column(db.String(20), nullable=False, default='demo', index=True)
    demo_session_id = db.Column(db.String(100), nullable=True, index=True)
    trial_ends_at = db.Column(db.DateTime, nullable=True, index=True)
    
    # External service IDs
    stripe_customer_id = db.Column(db.String(100), nullable=True)
    stripe_subscription_id = db.Column(db.String(100), nullable=True)
    ghl_contact_id = db.Column(db.String(100), nullable=True)
    
    # Business information
    company = db.Column(db.String(200), nullable=True)
    industry = db.Column(db.String(50), nullable=True)
    team_size = db.Column(db.String(20), nullable=True)
    
    # Enhanced user profile
    avatar_url = db.Column(db.String(500), nullable=True)
    timezone = db.Column(db.String(50), nullable=True)
    language = db.Column(db.String(10), default='en')
    
    # Onboarding and engagement
    onboarding_completed = db.Column(db.Boolean, default=False)
    onboarding_step = db.Column(db.Integer, default=1)
    last_login_at = db.Column(db.DateTime, nullable=True)
    login_count = db.Column(db.Integer, default=0)
    
    # Email verification
    email_verified = db.Column(db.Boolean, default=False)
    email_verification_token = db.Column(db.String(100), nullable=True)
    email_verification_sent_at = db.Column(db.DateTime, nullable=True)
    
    # Password reset
    password_reset_token = db.Column(db.String(100), nullable=True)
    password_reset_sent_at = db.Column(db.DateTime, nullable=True)
    
    # Consent and preferences
    marketing_consent = db.Column(db.Boolean, default=False)
    sms_consent = db.Column(db.Boolean, default=False)
    terms_accepted_at = db.Column(db.DateTime, nullable=True)
    privacy_accepted_at = db.Column(db.DateTime, nullable=True)
    
    # Waitlist management
    waitlist_position = db.Column(db.Integer, nullable=True)
    waitlist_joined_at = db.Column(db.DateTime, nullable=True)
    waitlist_invited_at = db.Column(db.DateTime, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        """Hash and set password"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        self.password_hash = salt + password_hash.hex()
    
    def check_password(self, password):
        """Check if provided password matches stored hash"""
        if not self.password_hash:
            return False
        salt = self.password_hash[:32]
        stored_hash = self.password_hash[32:]
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return password_hash.hex() == stored_hash
    
    def generate_email_verification_token(self):
        """Generate email verification token"""
        self.email_verification_token = secrets.token_urlsafe(32)
        self.email_verification_sent_at = datetime.utcnow()
        return self.email_verification_token
    
    def generate_password_reset_token(self):
        """Generate password reset token"""
        self.password_reset_token = secrets.token_urlsafe(32)
        self.password_reset_sent_at = datetime.utcnow()
        return self.password_reset_token
    
    def start_trial(self):
        """Start 7-day trial period"""
        self.status = 'trial'
        self.trial_ends_at = datetime.utcnow() + timedelta(days=7)
        self.updated_at = datetime.utcnow()
    
    def is_trial_active(self):
        """Check if trial is still active"""
        if self.status != 'trial' or not self.trial_ends_at:
            return False
        return datetime.utcnow() < self.trial_ends_at
    
    def days_left_in_trial(self):
        """Get number of days left in trial"""
        if not self.is_trial_active():
            return 0
        delta = self.trial_ends_at - datetime.utcnow()
        return max(0, delta.days)
    
    def record_login(self):
        """Record user login"""
        self.last_login_at = datetime.utcnow()
        self.login_count += 1
        self.updated_at = datetime.utcnow()
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary for API responses"""
        data = {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'status': self.status,
            'company': self.company,
            'industry': self.industry,
            'team_size': self.team_size,
            'avatar_url': self.avatar_url,
            'timezone': self.timezone,
            'language': self.language,
            'onboarding_completed': self.onboarding_completed,
            'onboarding_step': self.onboarding_step,
            'email_verified': self.email_verified,
            'marketing_consent': self.marketing_consent,
            'sms_consent': self.sms_consent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'trial_ends_at': self.trial_ends_at.isoformat() if self.trial_ends_at else None,
            'is_trial_active': self.is_trial_active(),
            'days_left_in_trial': self.days_left_in_trial(),
            'last_login_at': self.last_login_at.isoformat() if self.last_login_at else None,
            'login_count': self.login_count
        }
        
        if include_sensitive:
            data.update({
                'phone': self.phone,
                'stripe_customer_id': self.stripe_customer_id,
                'stripe_subscription_id': self.stripe_subscription_id,
                'ghl_contact_id': self.ghl_contact_id,
                'waitlist_position': self.waitlist_position
            })
        
        return data

class Agent(db.Model):
    __tablename__ = 'agents'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False, index=True)
    icon = db.Column(db.String(100), nullable=True)
    
    # Agent configuration
    prompt_template = db.Column(db.Text, nullable=True)
    model_config = db.Column(db.JSON, nullable=True)
    capabilities = db.Column(db.JSON, nullable=True)
    integrations = db.Column(db.JSON, nullable=True)
    
    # Pricing and availability
    base_price = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    setup_fee = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    
    # NFT and marketplace
    nft_contract_address = db.Column(db.String(100), nullable=True)
    nft_token_id = db.Column(db.String(100), nullable=True)
    total_minted = db.Column(db.Integer, default=0)
    max_supply = db.Column(db.Integer, nullable=True)
    
    # Metrics
    deployment_count = db.Column(db.Integer, default=0)
    rating_average = db.Column(db.Numeric(3, 2), default=0)
    rating_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Agent {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'icon': self.icon,
            'capabilities': self.capabilities,
            'integrations': self.integrations,
            'base_price': float(self.base_price) if self.base_price else 0,
            'setup_fee': float(self.setup_fee) if self.setup_fee else 0,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'nft_contract_address': self.nft_contract_address,
            'nft_token_id': self.nft_token_id,
            'total_minted': self.total_minted,
            'max_supply': self.max_supply,
            'deployment_count': self.deployment_count,
            'rating_average': float(self.rating_average) if self.rating_average else 0,
            'rating_count': self.rating_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class UserAgent(db.Model):
    __tablename__ = 'user_agents'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    agent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=False, index=True)
    
    # Deployment configuration
    name = db.Column(db.String(100), nullable=False)
    custom_prompt = db.Column(db.Text, nullable=True)
    custom_config = db.Column(db.JSON, nullable=True)
    
    # Status and health
    status = db.Column(db.String(20), nullable=False, default='inactive', index=True)
    health_status = db.Column(db.String(20), nullable=False, default='unknown')
    last_health_check = db.Column(db.DateTime, nullable=True)
    
    # Usage metrics
    total_calls = db.Column(db.Integer, default=0)
    total_tokens = db.Column(db.Integer, default=0)
    last_used_at = db.Column(db.DateTime, nullable=True)
    
    # Billing
    monthly_cost = db.Column(db.Numeric(10, 2), default=0)
    usage_cost = db.Column(db.Numeric(10, 2), default=0)
    
    # Timestamps
    deployed_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('user_agents', lazy=True))
    agent = db.relationship('Agent', backref=db.backref('user_deployments', lazy=True))
    
    def __repr__(self):
        return f'<UserAgent {self.name} for {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'agent_id': self.agent_id,
            'name': self.name,
            'status': self.status,
            'health_status': self.health_status,
            'last_health_check': self.last_health_check.isoformat() if self.last_health_check else None,
            'total_calls': self.total_calls,
            'total_tokens': self.total_tokens,
            'last_used_at': self.last_used_at.isoformat() if self.last_used_at else None,
            'monthly_cost': float(self.monthly_cost) if self.monthly_cost else 0,
            'usage_cost': float(self.usage_cost) if self.usage_cost else 0,
            'deployed_at': self.deployed_at.isoformat() if self.deployed_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'agent': self.agent.to_dict() if self.agent else None
        }

class DemoSession(db.Model):
    __tablename__ = 'demo_sessions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_token = db.Column(db.String(100), unique=True, nullable=False, index=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    agent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=False, index=True)
    
    # Demo configuration
    messages_used = db.Column(db.Integer, default=0)
    messages_limit = db.Column(db.Integer, default=5)
    
    # Session data
    conversation_history = db.Column(db.JSON, nullable=True)
    demo_data = db.Column(db.JSON, nullable=True)
    
    # Status
    status = db.Column(db.String(20), nullable=False, default='active', index=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    converted_to_trial = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    expires_at = db.Column(db.DateTime, nullable=False, index=True)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('demo_sessions', lazy=True))
    agent = db.relationship('Agent', backref=db.backref('demo_sessions', lazy=True))
    
    def __repr__(self):
        return f'<DemoSession {self.session_token}>'
    
    def is_expired(self):
        return datetime.utcnow() > self.expires_at
    
    def can_send_message(self):
        return self.messages_used < self.messages_limit and not self.is_expired() and self.status == 'active'
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_token': self.session_token,
            'agent_id': self.agent_id,
            'messages_used': self.messages_used,
            'messages_limit': self.messages_limit,
            'status': self.status,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'converted_to_trial': self.converted_to_trial,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'is_expired': self.is_expired(),
            'can_send_message': self.can_send_message(),
            'agent': self.agent.to_dict() if self.agent else None
        }

class UserAuditLog(db.Model):
    __tablename__ = 'user_audit_log'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    action = db.Column(db.String(50), nullable=False, index=True)
    details = db.Column(db.JSON, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('audit_logs', lazy=True))
    
    def __repr__(self):
        return f'<UserAuditLog {self.action} for {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action': self.action,
            'details': self.details,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ExternalSyncLog(db.Model):
    __tablename__ = 'external_sync_log'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    system_name = db.Column(db.String(50), nullable=False, index=True)  # 'stripe', 'ghl', 'email'
    operation = db.Column(db.String(50), nullable=False)
    external_id = db.Column(db.String(100), nullable=True)
    request_data = db.Column(db.JSON, nullable=True)
    response_data = db.Column(db.JSON, nullable=True)
    status = db.Column(db.String(20), nullable=False, index=True)  # 'pending', 'success', 'failed', 'retrying'
    error_message = db.Column(db.Text, nullable=True)
    retry_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('sync_logs', lazy=True))
    
    def __repr__(self):
        return f'<ExternalSyncLog {self.system_name}:{self.operation} for {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'system_name': self.system_name,
            'operation': self.operation,
            'external_id': self.external_id,
            'status': self.status,
            'error_message': self.error_message,
            'retry_count': self.retry_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Stripe information
    stripe_subscription_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    stripe_customer_id = db.Column(db.String(100), nullable=False)
    stripe_price_id = db.Column(db.String(100), nullable=False)
    
    # Subscription details
    plan_name = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False, index=True)
    current_period_start = db.Column(db.DateTime, nullable=False)
    current_period_end = db.Column(db.DateTime, nullable=False)
    trial_start = db.Column(db.DateTime, nullable=True)
    trial_end = db.Column(db.DateTime, nullable=True)
    
    # Billing
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='usd')
    interval = db.Column(db.String(20), nullable=False)  # 'month', 'year'
    
    # Cancellation
    cancel_at_period_end = db.Column(db.Boolean, default=False)
    canceled_at = db.Column(db.DateTime, nullable=True)
    cancellation_reason = db.Column(db.String(200), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('subscriptions', lazy=True))
    
    def __repr__(self):
        return f'<Subscription {self.plan_name} for {self.user_id}>'
    
    def is_active(self):
        return self.status in ['active', 'trialing']
    
    def is_trial(self):
        return self.status == 'trialing'
    
    def days_until_renewal(self):
        if not self.current_period_end:
            return 0
        delta = self.current_period_end - datetime.utcnow()
        return max(0, delta.days)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'stripe_subscription_id': self.stripe_subscription_id,
            'plan_name': self.plan_name,
            'status': self.status,
            'current_period_start': self.current_period_start.isoformat() if self.current_period_start else None,
            'current_period_end': self.current_period_end.isoformat() if self.current_period_end else None,
            'trial_start': self.trial_start.isoformat() if self.trial_start else None,
            'trial_end': self.trial_end.isoformat() if self.trial_end else None,
            'amount': float(self.amount) if self.amount else 0,
            'currency': self.currency,
            'interval': self.interval,
            'cancel_at_period_end': self.cancel_at_period_end,
            'canceled_at': self.canceled_at.isoformat() if self.canceled_at else None,
            'cancellation_reason': self.cancellation_reason,
            'is_active': self.is_active(),
            'is_trial': self.is_trial(),
            'days_until_renewal': self.days_until_renewal(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

