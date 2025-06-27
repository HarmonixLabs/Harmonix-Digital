"""
Agent management routes for HARMONIX Platform
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json

from src.models.user import db, User, Agent, AgentThread, ThreadMessage
from src.lib.auth import token_required, subscription_required
from src.lib.openai_service import OpenAIService

agent_bp = Blueprint('agent', __name__)

@agent_bp.route('', methods=['GET'])
@jwt_required()
def get_agents():
    """Get all agents for the current user."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's agents
        agents = Agent.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'agents': [agent.to_dict() for agent in agents],
            'total': len(agents)
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Get agents error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve agents'}), 500

@agent_bp.route('', methods=['POST'])
@jwt_required()
def create_agent():
    """Create a new agent."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check subscription limits
        agent_count = Agent.query.filter_by(user_id=user_id).count()
        tier_limits = {
            'trial': 1,
            'starter': 2,
            'growth': 5,
            'expansion': 10,
            'enterprise': float('inf')
        }
        
        max_agents = tier_limits.get(user.subscription_tier, 1)
        if agent_count >= max_agents:
            return jsonify({
                'error': f'Agent limit reached for {user.subscription_tier} tier',
                'current_count': agent_count,
                'max_allowed': max_agents
            }), 402
        
        # Create agent
        agent = Agent(
            name=data['name'].strip(),
            type=data['type'],
            description=data.get('description', '').strip(),
            user_id=user_id,
            model=data.get('model', 'gpt-4'),
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens', 1000),
            category=data.get('category', 'general'),
            is_public=data.get('is_public', False),
            price=data.get('price', 0.0)
        )
        
        # Set configuration if provided
        if 'configuration' in data:
            agent.set_configuration(data['configuration'])
        
        # Set tags if provided
        if 'tags' in data:
            agent.set_tags(data['tags'])
        
        db.session.add(agent)
        db.session.commit()
        
        return jsonify({
            'message': 'Agent created successfully',
            'agent': agent.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create agent error: {str(e)}")
        return jsonify({'error': 'Failed to create agent'}), 500

@agent_bp.route('/<int:agent_id>', methods=['GET'])
@jwt_required()
def get_agent(agent_id):
    """Get a specific agent."""
    try:
        user_id = get_jwt_identity()
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user_id).first()
        
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        return jsonify({
            'agent': agent.to_dict()
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Get agent error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve agent'}), 500

@agent_bp.route('/<int:agent_id>', methods=['PUT'])
@jwt_required()
def update_agent(agent_id):
    """Update an agent."""
    try:
        user_id = get_jwt_identity()
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user_id).first()
        
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        updatable_fields = [
            'name', 'description', 'model', 'temperature', 
            'max_tokens', 'category', 'is_public', 'price'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(agent, field, data[field])
        
        # Update configuration if provided
        if 'configuration' in data:
            agent.set_configuration(data['configuration'])
        
        # Update tags if provided
        if 'tags' in data:
            agent.set_tags(data['tags'])
        
        agent.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Agent updated successfully',
            'agent': agent.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update agent error: {str(e)}")
        return jsonify({'error': 'Failed to update agent'}), 500

@agent_bp.route('/<int:agent_id>', methods=['DELETE'])
@jwt_required()
def delete_agent(agent_id):
    """Delete an agent."""
    try:
        user_id = get_jwt_identity()
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user_id).first()
        
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        db.session.delete(agent)
        db.session.commit()
        
        return jsonify({
            'message': 'Agent deleted successfully'
        }), 204
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete agent error: {str(e)}")
        return jsonify({'error': 'Failed to delete agent'}), 500

@agent_bp.route('/<int:agent_id>/deploy', methods=['POST'])
@jwt_required()
def deploy_agent(agent_id):
    """Deploy an agent."""
    try:
        user_id = get_jwt_identity()
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user_id).first()
        
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        # Update deployment status
        agent.is_deployed = True
        agent.deployed_at = datetime.utcnow()
        agent.status = 'active'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Agent deployed successfully',
            'agent': agent.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Deploy agent error: {str(e)}")
        return jsonify({'error': 'Failed to deploy agent'}), 500

@agent_bp.route('/<int:agent_id>/chat', methods=['POST'])
@jwt_required()
def chat_with_agent(agent_id):
    """Send a message to an agent."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user_id).first()
        
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        if not agent.is_deployed:
            return jsonify({'error': 'Agent is not deployed'}), 400
        
        data = request.get_json()
        message = data.get('message', '').strip()
        thread_id = data.get('thread_id')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Check token balance
        estimated_tokens = len(message.split()) * 2  # Rough estimate
        if user.token_balance < estimated_tokens:
            return jsonify({
                'error': 'Insufficient token balance',
                'required_tokens': estimated_tokens,
                'available_tokens': user.token_balance
            }), 402
        
        # Get or create thread
        if thread_id:
            thread = AgentThread.query.filter_by(
                id=thread_id, user_id=user_id, agent_id=agent_id
            ).first()
            if not thread:
                return jsonify({'error': 'Thread not found'}), 404
        else:
            thread = AgentThread(
                user_id=user_id,
                agent_id=agent_id,
                title=message[:50] + ('...' if len(message) > 50 else '')
            )
            db.session.add(thread)
            db.session.flush()  # Get thread ID
        
        # Add user message
        user_message = ThreadMessage(
            thread_id=thread.id,
            role='user',
            content=message
        )
        db.session.add(user_message)
        
        # Generate AI response
        openai_service = OpenAIService(current_app.config.get('OPENAI_API_KEY'))
        
        # Get conversation history
        messages = ThreadMessage.query.filter_by(thread_id=thread.id).order_by(ThreadMessage.created_at).all()
        conversation_history = [
            {'role': msg.role, 'content': msg.content}
            for msg in messages
        ]
        
        # Generate response
        start_time = datetime.utcnow()
        response_result = openai_service.generate_response(
            messages=conversation_history,
            agent_type=agent.type,
            model=agent.model,
            temperature=agent.temperature,
            max_tokens=agent.max_tokens
        )
        end_time = datetime.utcnow()
        response_time = (end_time - start_time).total_seconds()
        
        if response_result['success']:
            response_content = response_result['response']
            tokens_used = response_result.get('tokens_used', estimated_tokens)
            
            # Add AI response
            ai_message = ThreadMessage(
                thread_id=thread.id,
                role='assistant',
                content=response_content,
                tokens_used=tokens_used,
                response_time=response_time,
                model_used=agent.model
            )
            db.session.add(ai_message)
            
            # Update thread
            thread.message_count += 2  # User + AI message
            thread.tokens_used += tokens_used
            thread.last_message_at = datetime.utcnow()
            
            # Update agent performance
            agent.update_performance(response_time, success=True)
            
            # Deduct tokens from user
            user.deduct_tokens(tokens_used)
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'response': response_content,
                'thread_id': thread.id,
                'tokens_used': tokens_used,
                'remaining_tokens': user.token_balance,
                'response_time': response_time
            }), 200
        
        else:
            # Update agent performance for failure
            agent.update_performance(response_time, success=False)
            db.session.commit()
            
            return jsonify({
                'error': 'Failed to generate response',
                'details': response_result.get('error', 'Unknown error')
            }), 500
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Chat error: {str(e)}")
        return jsonify({'error': 'Failed to process chat message'}), 500

@agent_bp.route('/<int:agent_id>/threads', methods=['GET'])
@jwt_required()
def get_agent_threads(agent_id):
    """Get all threads for an agent."""
    try:
        user_id = get_jwt_identity()
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user_id).first()
        
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        threads = AgentThread.query.filter_by(
            agent_id=agent_id, user_id=user_id
        ).order_by(AgentThread.updated_at.desc()).all()
        
        return jsonify({
            'threads': [thread.to_dict() for thread in threads],
            'total': len(threads)
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Get threads error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve threads'}), 500

@agent_bp.route('/marketplace', methods=['GET'])
def get_marketplace_agents():
    """Get public agents in the marketplace."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = Agent.query.filter_by(is_public=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if search:
            query = query.filter(
                Agent.name.ilike(f'%{search}%') |
                Agent.description.ilike(f'%{search}%')
            )
        
        agents = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'agents': [agent.to_dict() for agent in agents.items],
            'total': agents.total,
            'pages': agents.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Marketplace error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve marketplace agents'}), 500