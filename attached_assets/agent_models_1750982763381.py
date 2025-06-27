from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import uuid
import json

# Import from existing user models
from .user import db

class AgentThread(db.Model):
    """Agent conversation threads with context inheritance"""
    __tablename__ = 'agent_threads'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    agent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=False, index=True)
    user_agent_id = db.Column(db.String(36), db.ForeignKey('user_agents.id'), nullable=True, index=True)
    
    # Thread identification
    thread_name = db.Column(db.String(200), nullable=False)
    thread_description = db.Column(db.Text, nullable=True)
    
    # Context inheritance
    parent_thread_id = db.Column(db.String(36), db.ForeignKey('agent_threads.id'), nullable=True, index=True)
    context_snapshot = db.Column(db.JSON, nullable=True)  # Full context at thread creation
    inherited_variables = db.Column(db.JSON, nullable=True)  # Key variables passed down
    
    # Thread state
    status = db.Column(db.String(20), nullable=False, default='active', index=True)  # active, paused, completed, archived
    conversation_history = db.Column(db.JSON, nullable=True)
    current_context = db.Column(db.JSON, nullable=True)
    
    # Thread metadata
    total_messages = db.Column(db.Integer, default=0)
    total_tokens = db.Column(db.Integer, default=0)
    last_message_at = db.Column(db.DateTime, nullable=True)
    
    # Thread settings
    auto_save_interval = db.Column(db.Integer, default=5)  # Save context every N messages
    max_context_length = db.Column(db.Integer, default=10000)  # Max tokens to keep in context
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('agent_threads', lazy=True))
    agent = db.relationship('Agent', backref=db.backref('agent_threads', lazy=True))
    user_agent = db.relationship('UserAgent', backref=db.backref('agent_threads', lazy=True))
    parent_thread = db.relationship('AgentThread', remote_side=[id], backref='child_threads')
    
    def __repr__(self):
        return f'<AgentThread {self.thread_name} for {self.user_id}>'
    
    def inherit_context_from_parent(self):
        """Inherit context from parent thread"""
        if not self.parent_thread:
            return
        
        parent = self.parent_thread
        
        # Inherit conversation history (last N messages)
        if parent.conversation_history:
            # Take last 10 messages as context
            recent_messages = parent.conversation_history[-10:] if len(parent.conversation_history) > 10 else parent.conversation_history
            self.conversation_history = recent_messages.copy()
        
        # Inherit key variables and context
        if parent.current_context:
            self.current_context = parent.current_context.copy()
        
        # Store snapshot of parent state
        self.context_snapshot = {
            'parent_thread_id': parent.id,
            'parent_name': parent.thread_name,
            'inherited_at': datetime.utcnow().isoformat(),
            'parent_total_messages': parent.total_messages,
            'parent_status': parent.status,
            'context_summary': self._summarize_context(parent.current_context) if parent.current_context else None
        }
        
        # Extract key variables for quick access
        if parent.current_context:
            self.inherited_variables = self._extract_key_variables(parent.current_context)
    
    def _summarize_context(self, context):
        """Create a summary of the context for inheritance"""
        if not context:
            return None
        
        summary = {
            'user_preferences': context.get('user_preferences', {}),
            'project_details': context.get('project_details', {}),
            'key_decisions': context.get('key_decisions', []),
            'important_facts': context.get('important_facts', []),
            'current_goals': context.get('current_goals', [])
        }
        
        return summary
    
    def _extract_key_variables(self, context):
        """Extract key variables that should be inherited"""
        if not context:
            return {}
        
        key_vars = {}
        
        # Extract important variables
        for key in ['user_name', 'project_name', 'company_name', 'industry', 'budget', 'timeline', 'priorities']:
            if key in context:
                key_vars[key] = context[key]
        
        # Extract custom variables marked as inheritable
        if 'inheritable_vars' in context:
            key_vars.update(context['inheritable_vars'])
        
        return key_vars
    
    def add_message(self, role, content, metadata=None):
        """Add a message to the thread"""
        if not self.conversation_history:
            self.conversation_history = []
        
        message = {
            'id': str(uuid.uuid4()),
            'role': role,  # 'user', 'assistant', 'system'
            'content': content,
            'timestamp': datetime.utcnow().isoformat(),
            'metadata': metadata or {}
        }
        
        self.conversation_history.append(message)
        self.total_messages += 1
        self.last_message_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        
        # Auto-save context if interval reached
        if self.total_messages % self.auto_save_interval == 0:
            self.save_context_snapshot()
        
        # Trim context if too long
        self._trim_context_if_needed()
    
    def update_context(self, context_updates):
        """Update the current context"""
        if not self.current_context:
            self.current_context = {}
        
        self.current_context.update(context_updates)
        self.updated_at = datetime.utcnow()
    
    def save_context_snapshot(self):
        """Save current context as a snapshot"""
        if not hasattr(self, '_context_snapshots'):
            self._context_snapshots = []
        
        snapshot = {
            'timestamp': datetime.utcnow().isoformat(),
            'message_count': self.total_messages,
            'context': self.current_context.copy() if self.current_context else {},
            'recent_messages': self.conversation_history[-5:] if self.conversation_history else []
        }
        
        # Store in context_snapshot field (could also use separate table)
        if not self.context_snapshot:
            self.context_snapshot = {'snapshots': []}
        
        if 'snapshots' not in self.context_snapshot:
            self.context_snapshot['snapshots'] = []
        
        self.context_snapshot['snapshots'].append(snapshot)
        
        # Keep only last 10 snapshots
        if len(self.context_snapshot['snapshots']) > 10:
            self.context_snapshot['snapshots'] = self.context_snapshot['snapshots'][-10:]
    
    def _trim_context_if_needed(self):
        """Trim conversation history if it exceeds max length"""
        if not self.conversation_history or not self.max_context_length:
            return
        
        # Estimate token count (rough approximation)
        total_chars = sum(len(msg.get('content', '')) for msg in self.conversation_history)
        estimated_tokens = total_chars // 4  # Rough estimate: 4 chars per token
        
        if estimated_tokens > self.max_context_length:
            # Keep system messages and recent messages
            system_messages = [msg for msg in self.conversation_history if msg.get('role') == 'system']
            recent_messages = [msg for msg in self.conversation_history if msg.get('role') != 'system'][-20:]  # Keep last 20 non-system messages
            
            self.conversation_history = system_messages + recent_messages
    
    def create_child_thread(self, name, description=None):
        """Create a child thread that inherits this thread's context"""
        child_thread = AgentThread(
            user_id=self.user_id,
            agent_id=self.agent_id,
            user_agent_id=self.user_agent_id,
            thread_name=name,
            thread_description=description,
            parent_thread_id=self.id
        )
        
        # Inherit context
        child_thread.inherit_context_from_parent()
        
        return child_thread
    
    def get_full_context_for_ai(self):
        """Get complete context formatted for AI consumption"""
        context = {
            'thread_info': {
                'id': self.id,
                'name': self.thread_name,
                'description': self.thread_description,
                'created_at': self.created_at.isoformat() if self.created_at else None
            },
            'conversation_history': self.conversation_history or [],
            'current_context': self.current_context or {},
            'inherited_variables': self.inherited_variables or {},
            'thread_stats': {
                'total_messages': self.total_messages,
                'total_tokens': self.total_tokens,
                'last_message_at': self.last_message_at.isoformat() if self.last_message_at else None
            }
        }
        
        # Add parent context summary if available
        if self.context_snapshot and 'parent_thread_id' in self.context_snapshot:
            context['parent_context'] = self.context_snapshot
        
        return context
    
    def to_dict(self, include_full_history=False):
        """Convert thread to dictionary"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'agent_id': self.agent_id,
            'user_agent_id': self.user_agent_id,
            'thread_name': self.thread_name,
            'thread_description': self.thread_description,
            'parent_thread_id': self.parent_thread_id,
            'status': self.status,
            'total_messages': self.total_messages,
            'total_tokens': self.total_tokens,
            'last_message_at': self.last_message_at.isoformat() if self.last_message_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'inherited_variables': self.inherited_variables,
            'has_parent': self.parent_thread_id is not None,
            'child_count': len(self.child_threads) if hasattr(self, 'child_threads') else 0
        }
        
        if include_full_history:
            data.update({
                'conversation_history': self.conversation_history,
                'current_context': self.current_context,
                'context_snapshot': self.context_snapshot
            })
        else:
            # Include only recent messages for preview
            recent_messages = self.conversation_history[-3:] if self.conversation_history else []
            data['recent_messages'] = recent_messages
        
        return data

class AgentWorkflow(db.Model):
    """Agent workflows with multi-agent orchestration"""
    __tablename__ = 'agent_workflows'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Workflow definition
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    workflow_config = db.Column(db.JSON, nullable=False)  # Workflow steps and agent assignments
    
    # Execution state
    status = db.Column(db.String(20), nullable=False, default='draft', index=True)  # draft, active, paused, completed, failed
    current_step = db.Column(db.Integer, default=0)
    execution_context = db.Column(db.JSON, nullable=True)
    
    # Workflow metadata
    total_steps = db.Column(db.Integer, default=0)
    completed_steps = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('agent_workflows', lazy=True))
    
    def __repr__(self):
        return f'<AgentWorkflow {self.name} for {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'current_step': self.current_step,
            'total_steps': self.total_steps,
            'completed_steps': self.completed_steps,
            'progress_percentage': (self.completed_steps / self.total_steps * 100) if self.total_steps > 0 else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class AgentTemplate(db.Model):
    """Pre-built agent templates for quick deployment"""
    __tablename__ = 'agent_templates'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Template info
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False, index=True)
    tags = db.Column(db.JSON, nullable=True)
    
    # Template configuration
    prompt_template = db.Column(db.Text, nullable=False)
    model_config = db.Column(db.JSON, nullable=True)
    capabilities = db.Column(db.JSON, nullable=True)
    integrations = db.Column(db.JSON, nullable=True)
    
    # Template metadata
    is_public = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    usage_count = db.Column(db.Integer, default=0)
    rating_average = db.Column(db.Numeric(3, 2), default=0)
    rating_count = db.Column(db.Integer, default=0)
    
    # Creator info
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    creator = db.relationship('User', backref=db.backref('created_templates', lazy=True))
    
    def __repr__(self):
        return f'<AgentTemplate {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'tags': self.tags,
            'capabilities': self.capabilities,
            'integrations': self.integrations,
            'is_public': self.is_public,
            'is_featured': self.is_featured,
            'usage_count': self.usage_count,
            'rating_average': float(self.rating_average) if self.rating_average else 0,
            'rating_count': self.rating_count,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

