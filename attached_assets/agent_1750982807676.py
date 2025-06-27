from flask import Blueprint, request, jsonify, current_app
from src.models.user import db, User, Agent, UserAgent
from src.models.agent_models import AgentThread, AgentWorkflow, AgentTemplate
from src.lib.auth import validate_jwt
from datetime import datetime, timedelta
import uuid
import json

agent_bp = Blueprint('agent', __name__)

def get_current_user():
    """Get current user from JWT token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    payload = validate_jwt(token)
    if not payload:
        return None
    
    return User.query.get(payload['user_id'])

@agent_bp.route('/agents', methods=['GET'])
def get_agents():
    """Get all available agents"""
    try:
        # Get query parameters
        category = request.args.get('category')
        featured_only = request.args.get('featured') == 'true'
        search = request.args.get('search', '').strip()
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 12)), 50)
        
        # Build query
        query = Agent.query.filter_by(is_active=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        if search:
            query = query.filter(
                db.or_(
                    Agent.name.ilike(f'%{search}%'),
                    Agent.description.ilike(f'%{search}%')
                )
            )
        
        # Order by featured first, then by rating
        query = query.order_by(Agent.is_featured.desc(), Agent.rating_average.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        agents = pagination.items
        
        # Get categories for filtering
        categories = db.session.query(Agent.category).filter_by(is_active=True).distinct().all()
        categories = [cat[0] for cat in categories]
        
        return jsonify({
            'success': True,
            'data': {
                'agents': [agent.to_dict() for agent in agents],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': pagination.total,
                    'pages': pagination.pages,
                    'has_next': pagination.has_next,
                    'has_prev': pagination.has_prev
                },
                'categories': categories
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get agents error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to fetch agents'
            }
        }), 500

@agent_bp.route('/agents/<agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get specific agent details"""
    try:
        agent = Agent.query.get(agent_id)
        if not agent or not agent.is_active:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_NOT_FOUND',
                    'message': 'Agent not found'
                }
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'agent': agent.to_dict()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get agent error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to fetch agent'
            }
        }), 500

@agent_bp.route('/agents/<agent_id>/deploy', methods=['POST'])
def deploy_agent(agent_id):
    """Deploy an agent for a user"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Agent name is required'
                }
            }), 400
        
        # Check if agent exists
        agent = Agent.query.get(agent_id)
        if not agent or not agent.is_active:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_NOT_FOUND',
                    'message': 'Agent not found'
                }
            }), 404
        
        # Check if user already has this agent deployed with same name
        existing_deployment = UserAgent.query.filter_by(
            user_id=user.id,
            agent_id=agent_id,
            name=data['name']
        ).first()
        
        if existing_deployment:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_EXISTS',
                    'message': 'Agent with this name already deployed'
                }
            }), 400
        
        # Create user agent deployment
        user_agent = UserAgent(
            user_id=user.id,
            agent_id=agent_id,
            name=data['name'],
            custom_prompt=data.get('custom_prompt'),
            custom_config=data.get('custom_config', {}),
            status='active'
        )
        
        db.session.add(user_agent)
        
        # Update agent deployment count
        agent.deployment_count += 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'user_agent': user_agent.to_dict()
            },
            'message': 'Agent deployed successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Deploy agent error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to deploy agent'
            }
        }), 500

@agent_bp.route('/my-agents', methods=['GET'])
def get_my_agents():
    """Get user's deployed agents"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        user_agents = UserAgent.query.filter_by(user_id=user.id).all()
        
        return jsonify({
            'success': True,
            'data': {
                'agents': [ua.to_dict() for ua in user_agents]
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get my agents error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to fetch your agents'
            }
        }), 500

@agent_bp.route('/my-agents/<user_agent_id>', methods=['PUT'])
def update_my_agent(user_agent_id):
    """Update user's deployed agent"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        user_agent = UserAgent.query.filter_by(id=user_agent_id, user_id=user.id).first()
        if not user_agent:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_NOT_FOUND',
                    'message': 'Agent not found'
                }
            }), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            user_agent.name = data['name']
        if 'custom_prompt' in data:
            user_agent.custom_prompt = data['custom_prompt']
        if 'custom_config' in data:
            user_agent.custom_config = data['custom_config']
        if 'status' in data:
            user_agent.status = data['status']
        
        user_agent.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'user_agent': user_agent.to_dict()
            },
            'message': 'Agent updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update agent error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to update agent'
            }
        }), 500

@agent_bp.route('/my-agents/<user_agent_id>', methods=['DELETE'])
def delete_my_agent(user_agent_id):
    """Delete user's deployed agent"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        user_agent = UserAgent.query.filter_by(id=user_agent_id, user_id=user.id).first()
        if not user_agent:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_NOT_FOUND',
                    'message': 'Agent not found'
                }
            }), 404
        
        db.session.delete(user_agent)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Agent deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete agent error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to delete agent'
            }
        }), 500

@agent_bp.route('/threads', methods=['POST'])
def create_thread():
    """Create new agent thread with context inheritance"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['agent_id', 'thread_name']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Missing required fields',
                    'details': missing_fields
                }
            }), 400
        
        # Verify agent access
        user_agent = UserAgent.query.filter_by(
            user_id=user.id,
            agent_id=data['agent_id']
        ).first()
        
        if not user_agent:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_NOT_FOUND',
                    'message': 'Agent not found or not deployed'
                }
            }), 404
        
        # Create thread
        thread = AgentThread(
            user_id=user.id,
            agent_id=data['agent_id'],
            user_agent_id=user_agent.id,
            thread_name=data['thread_name'],
            thread_description=data.get('thread_description'),
            parent_thread_id=data.get('parent_thread_id')
        )
        
        # Inherit context if parent thread specified
        if data.get('parent_thread_id'):
            parent_thread = AgentThread.query.filter_by(
                id=data['parent_thread_id'],
                user_id=user.id
            ).first()
            
            if parent_thread:
                thread.parent_thread = parent_thread
                thread.inherit_context_from_parent()
        
        db.session.add(thread)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'thread': thread.to_dict(include_full_history=True)
            },
            'message': 'Thread created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create thread error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to create thread'
            }
        }), 500

@agent_bp.route('/threads/<thread_id>/messages', methods=['POST'])
def add_message_to_thread(thread_id):
    """Add message to agent thread"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        thread = AgentThread.query.filter_by(id=thread_id, user_id=user.id).first()
        if not thread:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'THREAD_NOT_FOUND',
                    'message': 'Thread not found'
                }
            }), 404
        
        data = request.get_json()
        
        if not data.get('content'):
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Message content is required'
                }
            }), 400
        
        # Add user message
        thread.add_message(
            role='user',
            content=data['content'],
            metadata=data.get('metadata', {})
        )
        
        # Update context if provided
        if data.get('context_updates'):
            thread.update_context(data['context_updates'])
        
        db.session.commit()
        
        # Here you would typically call the AI agent to generate a response
        # For now, we'll add a placeholder response
        ai_response = f"I understand your message: '{data['content']}'. How can I help you further?"
        
        thread.add_message(
            role='assistant',
            content=ai_response,
            metadata={'generated_at': datetime.utcnow().isoformat()}
        )
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'thread': thread.to_dict(include_full_history=True)
            },
            'message': 'Message added successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Add message error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to add message'
            }
        }), 500

@agent_bp.route('/threads', methods=['GET'])
def get_my_threads():
    """Get user's agent threads"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_ERROR',
                    'message': 'Authentication required'
                }
            }), 401
        
        agent_id = request.args.get('agent_id')
        status = request.args.get('status')
        
        query = AgentThread.query.filter_by(user_id=user.id)
        
        if agent_id:
            query = query.filter_by(agent_id=agent_id)
        
        if status:
            query = query.filter_by(status=status)
        
        threads = query.order_by(AgentThread.updated_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': {
                'threads': [thread.to_dict() for thread in threads]
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get threads error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to fetch threads'
            }
        }), 500

@agent_bp.route('/templates', methods=['GET'])
def get_agent_templates():
    """Get agent templates"""
    try:
        category = request.args.get('category')
        featured_only = request.args.get('featured') == 'true'
        
        query = AgentTemplate.query.filter_by(is_public=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        templates = query.order_by(AgentTemplate.is_featured.desc(), AgentTemplate.usage_count.desc()).all()
        
        return jsonify({
            'success': True,
            'data': {
                'templates': [template.to_dict() for template in templates]
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get templates error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to fetch templates'
            }
        }), 500

