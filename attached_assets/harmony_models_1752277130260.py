"""
Harmony Platform - Comprehensive Database Models
Includes all models for users, agents, organizations, marketplace, and more
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import json
from enum import Enum

db = SQLAlchemy()

class UserRole(Enum):
    GUEST = "guest"
    CREATOR = "creator"
    FOUNDER = "founder"
    ADMIN = "admin"
    TEAM_MEMBER = "team_member"

class AgentStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    MAINTENANCE = "maintenance"
    DISABLED = "disabled"

class SubscriptionTier(Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    WHITE_LABEL = "white_label"

class Organization(db.Model):
    __tablename__ = 'organizations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    logo_url = db.Column(db.String(500))
    website = db.Column(db.String(255))
    industry = db.Column(db.String(100))
    company_size = db.Column(db.String(50))
    
    # Subscription and billing
    subscription_tier = db.Column(db.Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    stripe_customer_id = db.Column(db.String(255))
    subscription_status = db.Column(db.String(50), default='active')
    trial_ends_at = db.Column(db.DateTime)
    
    # Platform settings
    harmony_status = db.Column(db.String(50), default='setup_required')
    api_key = db.Column(db.String(255))
    webhook_url = db.Column(db.String(500))
    
    # Token and usage
    token_balance = db.Column(db.Integer, default=100)
    monthly_token_limit = db.Column(db.Integer, default=1000)
    vault_share_percentage = db.Column(db.Float, default=33.0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = db.relationship('User', backref='organization', lazy=True)
    agent_instances = db.relationship('AgentInstance', backref='organization', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'logo_url': self.logo_url,
            'website': self.website,
            'industry': self.industry,
            'company_size': self.company_size,
            'subscription_tier': self.subscription_tier.value if self.subscription_tier else None,
            'harmony_status': self.harmony_status,
            'token_balance': self.token_balance,
            'monthly_token_limit': self.monthly_token_limit,
            'vault_share_percentage': self.vault_share_percentage,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True)
    
    # Profile information
    avatar_url = db.Column(db.String(500))
    bio = db.Column(db.Text)
    job_title = db.Column(db.String(100))
    phone = db.Column(db.String(50))
    timezone = db.Column(db.String(50), default='UTC')
    
    # Role and permissions
    role = db.Column(db.Enum(UserRole), default=UserRole.GUEST)
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'))
    is_founder = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Authentication and security
    email_verified_at = db.Column(db.DateTime)
    last_login = db.Column(db.DateTime)
    login_count = db.Column(db.Integer, default=0)
    
    # Creator profile (for agent creators)
    is_creator = db.Column(db.Boolean, default=False)
    creator_bio = db.Column(db.Text)
    creator_website = db.Column(db.String(255))
    creator_social_links = db.Column(db.Text)  # JSON string
    payout_wallet_address = db.Column(db.String(255))
    stripe_account_id = db.Column(db.String(255))
    
    # Referral system
    referral_code = db.Column(db.String(20), unique=True)
    referred_by_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    referral_earnings = db.Column(db.Float, default=0.0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    referred_users = db.relationship('User', backref=db.backref('referred_by', remote_side=[id]))
    created_agents = db.relationship('Agent', backref='creator', lazy=True)
    agent_interactions = db.relationship('AgentInteraction', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_referral_code(self):
        if not self.referral_code:
            self.referral_code = str(uuid.uuid4())[:8].upper()
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'avatar_url': self.avatar_url,
            'bio': self.bio,
            'job_title': self.job_title,
            'role': self.role.value if self.role else None,
            'organization_id': self.organization_id,
            'is_founder': self.is_founder,
            'is_verified': self.is_verified,
            'is_creator': self.is_creator,
            'referral_code': self.referral_code,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Agent(db.Model):
    __tablename__ = 'agents'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id = db.Column(db.String(50), unique=True, nullable=False)  # e.g., 'cash', 'echo', 'flow'
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    # Agent metadata
    role = db.Column(db.String(255))
    core_powers = db.Column(db.Text)  # JSON string
    superpowers = db.Column(db.Text)  # JSON string
    capabilities = db.Column(db.Text)  # JSON string
    demo_trigger = db.Column(db.String(500))
    nft_badge = db.Column(db.String(255))
    
    # Technical configuration
    webhook_url = db.Column(db.String(500))
    pipedream_workflow_id = db.Column(db.String(255))
    timeout_seconds = db.Column(db.Integer, default=30)
    
    # Marketplace and pricing
    is_marketplace_visible = db.Column(db.Boolean, default=True)
    is_demo_available = db.Column(db.Boolean, default=False)
    base_price = db.Column(db.Float, default=0.0)
    pricing_tiers = db.Column(db.Text)  # JSON string
    
    # Creator and ownership
    creator_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    is_harmony_core = db.Column(db.Boolean, default=False)
    vault_share_percentage = db.Column(db.Float, default=33.0)
    
    # NFT and blockchain
    nft_contract_address = db.Column(db.String(255))
    nft_token_id = db.Column(db.String(255))
    blockchain_network = db.Column(db.String(50), default='polygon')
    
    # Status and metrics
    status = db.Column(db.Enum(AgentStatus), default=AgentStatus.ACTIVE)
    total_deployments = db.Column(db.Integer, default=0)
    total_revenue = db.Column(db.Float, default=0.0)
    average_rating = db.Column(db.Float, default=0.0)
    total_ratings = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    instances = db.relationship('AgentInstance', backref='agent', lazy=True)
    interactions = db.relationship('AgentInteraction', backref='agent', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'name': self.name,
            'description': self.description,
            'role': self.role,
            'core_powers': json.loads(self.core_powers) if self.core_powers else [],
            'superpowers': json.loads(self.superpowers) if self.superpowers else [],
            'capabilities': json.loads(self.capabilities) if self.capabilities else [],
            'demo_trigger': self.demo_trigger,
            'nft_badge': self.nft_badge,
            'webhook_url': self.webhook_url,
            'is_marketplace_visible': self.is_marketplace_visible,
            'is_demo_available': self.is_demo_available,
            'base_price': self.base_price,
            'pricing_tiers': json.loads(self.pricing_tiers) if self.pricing_tiers else [],
            'creator_id': self.creator_id,
            'is_harmony_core': self.is_harmony_core,
            'vault_share_percentage': self.vault_share_percentage,
            'status': self.status.value if self.status else None,
            'total_deployments': self.total_deployments,
            'total_revenue': self.total_revenue,
            'average_rating': self.average_rating,
            'total_ratings': self.total_ratings,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AgentInstance(db.Model):
    __tablename__ = 'agent_instances'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=False)
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    
    # Instance configuration
    instance_name = db.Column(db.String(255))
    custom_settings = db.Column(db.Text)  # JSON string
    is_active = db.Column(db.Boolean, default=True)
    
    # Usage and billing
    tokens_used = db.Column(db.Integer, default=0)
    monthly_usage_limit = db.Column(db.Integer, default=1000)
    last_used = db.Column(db.DateTime)
    
    # Performance metrics
    total_interactions = db.Column(db.Integer, default=0)
    successful_interactions = db.Column(db.Integer, default=0)
    average_response_time = db.Column(db.Float, default=0.0)
    user_satisfaction = db.Column(db.Float, default=0.0)
    
    # Timestamps
    deployed_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'organization_id': self.organization_id,
            'instance_name': self.instance_name,
            'custom_settings': json.loads(self.custom_settings) if self.custom_settings else {},
            'is_active': self.is_active,
            'tokens_used': self.tokens_used,
            'monthly_usage_limit': self.monthly_usage_limit,
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'total_interactions': self.total_interactions,
            'successful_interactions': self.successful_interactions,
            'average_response_time': self.average_response_time,
            'user_satisfaction': self.user_satisfaction,
            'deployed_at': self.deployed_at.isoformat() if self.deployed_at else None
        }

class AgentInteraction(db.Model):
    __tablename__ = 'agent_interactions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'))
    
    # Interaction details
    session_id = db.Column(db.String(255))
    task = db.Column(db.String(255))
    input_data = db.Column(db.Text)  # JSON string
    output_data = db.Column(db.Text)  # JSON string
    context = db.Column(db.Text)  # JSON string
    
    # Execution metrics
    status = db.Column(db.String(50))  # success, error, timeout
    execution_time = db.Column(db.Float)
    tokens_used = db.Column(db.Integer, default=1)
    error_message = db.Column(db.Text)
    
    # User feedback
    user_rating = db.Column(db.Integer)  # 1-5 stars
    user_feedback = db.Column(db.Text)
    
    # Timestamps
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'user_id': self.user_id,
            'organization_id': self.organization_id,
            'session_id': self.session_id,
            'task': self.task,
            'input_data': json.loads(self.input_data) if self.input_data else {},
            'output_data': json.loads(self.output_data) if self.output_data else {},
            'status': self.status,
            'execution_time': self.execution_time,
            'tokens_used': self.tokens_used,
            'error_message': self.error_message,
            'user_rating': self.user_rating,
            'user_feedback': self.user_feedback,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class Lead(db.Model):
    __tablename__ = 'leads'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    company = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    job_title = db.Column(db.String(100))
    
    # Lead details
    source = db.Column(db.String(100))  # website, demo, referral, etc.
    agent_interest = db.Column(db.String(50))  # which agent they're interested in
    use_case = db.Column(db.Text)
    budget_range = db.Column(db.String(50))
    timeline = db.Column(db.String(50))
    
    # Lead scoring and status
    lead_score = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='new')  # new, qualified, contacted, converted, lost
    assigned_to_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    
    # Marketing attribution
    utm_source = db.Column(db.String(100))
    utm_medium = db.Column(db.String(100))
    utm_campaign = db.Column(db.String(100))
    referrer_url = db.Column(db.String(500))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'company': self.company,
            'phone': self.phone,
            'job_title': self.job_title,
            'source': self.source,
            'agent_interest': self.agent_interest,
            'use_case': self.use_case,
            'budget_range': self.budget_range,
            'timeline': self.timeline,
            'lead_score': self.lead_score,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    lead_id = db.Column(db.String(36), db.ForeignKey('leads.id'))
    
    # Booking details
    booking_type = db.Column(db.String(100))  # demo, consultation, onboarding
    agent_focus = db.Column(db.String(50))  # which agent they want to discuss
    scheduled_date = db.Column(db.DateTime)
    duration_minutes = db.Column(db.Integer, default=30)
    
    # Payment information
    amount = db.Column(db.Float, default=0.0)
    currency = db.Column(db.String(3), default='USD')
    payment_status = db.Column(db.String(50), default='pending')
    stripe_payment_intent_id = db.Column(db.String(255))
    
    # Meeting details
    meeting_link = db.Column(db.String(500))
    meeting_notes = db.Column(db.Text)
    status = db.Column(db.String(50), default='scheduled')  # scheduled, completed, cancelled, no_show
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'lead_id': self.lead_id,
            'booking_type': self.booking_type,
            'agent_focus': self.agent_focus,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'duration_minutes': self.duration_minutes,
            'amount': self.amount,
            'currency': self.currency,
            'payment_status': self.payment_status,
            'meeting_link': self.meeting_link,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class WorkflowExecution(db.Model):
    __tablename__ = 'workflow_executions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'))
    
    # Workflow details
    input_data = db.Column(db.Text)  # JSON string
    workflow_plan = db.Column(db.Text)  # JSON string
    execution_results = db.Column(db.Text)  # JSON string
    
    # Execution metrics
    status = db.Column(db.String(50))  # running, completed, failed, cancelled
    total_agents_used = db.Column(db.Integer, default=0)
    total_tokens_used = db.Column(db.Integer, default=0)
    total_execution_time = db.Column(db.Float, default=0.0)
    
    # Timestamps
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'workflow_name': self.workflow_name,
            'user_id': self.user_id,
            'organization_id': self.organization_id,
            'input_data': json.loads(self.input_data) if self.input_data else {},
            'workflow_plan': json.loads(self.workflow_plan) if self.workflow_plan else {},
            'execution_results': json.loads(self.execution_results) if self.execution_results else {},
            'status': self.status,
            'total_agents_used': self.total_agents_used,
            'total_tokens_used': self.total_tokens_used,
            'total_execution_time': self.total_execution_time,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

