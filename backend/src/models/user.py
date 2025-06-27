"""
User and Agent Models for HARMONIX Platform
"""

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and profile management."""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    company = db.Column(db.String(100))
    
    # Profile information
    role = db.Column(db.String(20), default='user')  # user, admin, super_admin
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Subscription information
    subscription_tier = db.Column(db.String(20), default='trial')  # trial, starter, growth, expansion, enterprise
    subscription_status = db.Column(db.String(20), default='active')  # active, cancelled, expired
    trial_ends_at = db.Column(db.DateTime)
    
    # Stripe integration
    stripe_customer_id = db.Column(db.String(100))
    stripe_subscription_id = db.Column(db.String(100))
    
    # GoHighLevel integration
    ghl_contact_id = db.Column(db.String(100))
    
    # Token management
    token_balance = db.Column(db.Integer, default=1000)  # Starting tokens
    tokens_used = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    agents = db.relationship('Agent', backref='owner', lazy=True, cascade='all, delete-orphan')
    agent_threads = db.relationship('AgentThread', backref='user', lazy=True)
    token_transactions = db.relationship('TokenTransaction', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash and set password."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash."""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'company': self.company,
            'role': self.role,
            'subscription_tier': self.subscription_tier,
            'subscription_status': self.subscription_status,
            'token_balance': self.token_balance,
            'tokens_used': self.tokens_used,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    def deduct_tokens(self, amount):
        """Deduct tokens from user balance."""
        if self.token_balance >= amount:
            self.token_balance -= amount
            self.tokens_used += amount
            return True
        return False
    
    def add_tokens(self, amount, transaction_type='purchase'):
        """Add tokens to user balance."""
        self.token_balance += amount
        
        # Create transaction record
        transaction = TokenTransaction(
            user_id=self.id,
            amount=amount,
            transaction_type=transaction_type,
            description=f"Token {transaction_type}"
        )
        db.session.add(transaction)
        return True

class Agent(db.Model):
    """Agent model for AI agent instances."""
    
    __tablename__ = 'agents'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # sales, concierge, hr, content, etc.
    description = db.Column(db.Text)
    
    # Owner information
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Configuration
    configuration = db.Column(db.Text)  # JSON string for agent configuration
    prompt_template = db.Column(db.Text)
    model = db.Column(db.String(50), default='gpt-4')
    temperature = db.Column(db.Float, default=0.7)
    max_tokens = db.Column(db.Integer, default=1000)
    
    # Status and performance
    status = db.Column(db.String(20), default='active')  # active, inactive, error
    is_deployed = db.Column(db.Boolean, default=False)
    deployment_id = db.Column(db.String(100))
    
    # Performance metrics
    total_interactions = db.Column(db.Integer, default=0)
    successful_interactions = db.Column(db.Integer, default=0)
    avg_response_time = db.Column(db.Float, default=0.0)
    last_interaction = db.Column(db.DateTime)
    
    # NFT integration
    nft_token_id = db.Column(db.String(100))
    nft_contract_address = db.Column(db.String(100))
    is_minted = db.Column(db.Boolean, default=False)
    
    # Marketplace
    is_public = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float)
    category = db.Column(db.String(50))
    tags = db.Column(db.Text)  # JSON array of tags
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deployed_at = db.Column(db.DateTime)
    
    # Relationships
    threads = db.relationship('AgentThread', backref='agent', lazy=True)
    
    def get_configuration(self):
        """Get configuration as dictionary."""
        if self.configuration:
            return json.loads(self.configuration)
        return {}
    
    def set_configuration(self, config):
        """Set configuration from dictionary."""
        self.configuration = json.dumps(config)
    
    def get_tags(self):
        """Get tags as list."""
        if self.tags:
            return json.loads(self.tags)
        return []
    
    def set_tags(self, tags_list):
        """Set tags from list."""
        self.tags = json.dumps(tags_list)
    
    def to_dict(self):
        """Convert agent to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'description': self.description,
            'user_id': self.user_id,
            'configuration': self.get_configuration(),
            'status': self.status,
            'is_deployed': self.is_deployed,
            'total_interactions': self.total_interactions,
            'successful_interactions': self.successful_interactions,
            'avg_response_time': self.avg_response_time,
            'is_public': self.is_public,
            'price': self.price,
            'category': self.category,
            'tags': self.get_tags(),
            'is_minted': self.is_minted,
            'nft_token_id': self.nft_token_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'deployed_at': self.deployed_at.isoformat() if self.deployed_at else None,
            'last_interaction': self.last_interaction.isoformat() if self.last_interaction else None
        }
    
    def update_performance(self, response_time, success=True):
        """Update agent performance metrics."""
        self.total_interactions += 1
        if success:
            self.successful_interactions += 1
        
        # Update average response time
        if self.avg_response_time == 0:
            self.avg_response_time = response_time
        else:
            self.avg_response_time = (self.avg_response_time + response_time) / 2
        
        self.last_interaction = datetime.utcnow()

class AgentThread(db.Model):
    """Conversation threads between users and agents."""
    
    __tablename__ = 'agent_threads'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey('agents.id'), nullable=False)
    
    # Thread information
    title = db.Column(db.String(200))
    context = db.Column(db.Text)  # JSON string for conversation context
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, completed, archived
    is_demo = db.Column(db.Boolean, default=False)
    
    # Metrics
    message_count = db.Column(db.Integer, default=0)
    tokens_used = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_message_at = db.Column(db.DateTime)
    
    # Relationships
    messages = db.relationship('ThreadMessage', backref='thread', lazy=True, cascade='all, delete-orphan')
    
    def get_context(self):
        """Get context as dictionary."""
        if self.context:
            return json.loads(self.context)
        return {}
    
    def set_context(self, context_dict):
        """Set context from dictionary."""
        self.context = json.dumps(context_dict)
    
    def to_dict(self):
        """Convert thread to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'agent_id': self.agent_id,
            'title': self.title,
            'context': self.get_context(),
            'status': self.status,
            'is_demo': self.is_demo,
            'message_count': self.message_count,
            'tokens_used': self.tokens_used,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_message_at': self.last_message_at.isoformat() if self.last_message_at else None
        }

class ThreadMessage(db.Model):
    """Individual messages within agent threads."""
    
    __tablename__ = 'thread_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    thread_id = db.Column(db.Integer, db.ForeignKey('agent_threads.id'), nullable=False)
    
    # Message content
    role = db.Column(db.String(20), nullable=False)  # user, assistant, system
    content = db.Column(db.Text, nullable=False)
    
    # Metadata
    tokens_used = db.Column(db.Integer, default=0)
    response_time = db.Column(db.Float)
    model_used = db.Column(db.String(50))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert message to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'thread_id': self.thread_id,
            'role': self.role,
            'content': self.content,
            'tokens_used': self.tokens_used,
            'response_time': self.response_time,
            'model_used': self.model_used,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class TokenTransaction(db.Model):
    """Token purchase and usage transactions."""
    
    __tablename__ = 'token_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Transaction details
    amount = db.Column(db.Integer, nullable=False)  # Positive for purchases, negative for usage
    transaction_type = db.Column(db.String(50), nullable=False)  # purchase, usage, refund, bonus
    description = db.Column(db.String(200))
    
    # Payment information
    stripe_payment_intent_id = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert transaction to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'transaction_type': self.transaction_type,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }