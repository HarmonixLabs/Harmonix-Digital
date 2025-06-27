"""
Demo routes for HARMONIX Platform
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json

from src.models.user import db, User, Agent, AgentThread, ThreadMessage
from src.lib.openai_service import OpenAIService

demo_bp = Blueprint('demo', __name__)

@demo_bp.route('/agents/<int:agent_id>', methods=['POST'])
@jwt_required()
def demo_agent(agent_id):
    """Run a demo conversation with an agent."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user_id).first()
        
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Create demo thread
        demo_thread = AgentThread(
            user_id=user_id,
            agent_id=agent_id,
            title=f"Demo: {message[:50]}...",
            is_demo=True
        )
        db.session.add(demo_thread)
        db.session.flush()
        
        # Add user message
        user_message = ThreadMessage(
            thread_id=demo_thread.id,
            role='user',
            content=message
        )
        db.session.add(user_message)
        
        # Generate AI response
        openai_service = OpenAIService(current_app.config.get('OPENAI_API_KEY'))
        
        start_time = datetime.utcnow()
        response_result = openai_service.generate_response(
            messages=[{'role': 'user', 'content': message}],
            agent_type=agent.type,
            model=agent.model,
            temperature=agent.temperature,
            max_tokens=agent.max_tokens
        )
        end_time = datetime.utcnow()
        response_time = (end_time - start_time).total_seconds()
        
        if response_result['success']:
            response_content = response_result['response']
            
            # Add AI response
            ai_message = ThreadMessage(
                thread_id=demo_thread.id,
                role='assistant',
                content=response_content,
                response_time=response_time,
                model_used=agent.model
            )
            db.session.add(ai_message)
            
            # Update thread
            demo_thread.message_count = 2
            demo_thread.last_message_at = datetime.utcnow()
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'response': response_content,
                'thread_id': demo_thread.id,
                'response_time': response_time,
                'agent_type': agent.type
            }), 200
        
        else:
            db.session.rollback()
            return jsonify({
                'error': 'Failed to generate response',
                'details': response_result.get('error', 'Unknown error')
            }), 500
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Demo error: {str(e)}")
        return jsonify({'error': 'Demo execution failed'}), 500

@demo_bp.route('/scenarios', methods=['GET'])
def get_demo_scenarios():
    """Get available demo scenarios."""
    scenarios = [
        {
            'id': 'sales_lead',
            'title': 'Sales Lead Qualification',
            'description': 'Demonstrate lead qualification and conversion optimization',
            'agent_type': 'sales',
            'sample_message': 'I\'m interested in automating our sales process. Can you help?'
        },
        {
            'id': 'customer_support',
            'title': 'Customer Support Excellence',
            'description': 'Show premium customer service and issue resolution',
            'agent_type': 'concierge',
            'sample_message': 'I need help with setting up my new AI agent. Where do I start?'
        },
        {
            'id': 'hr_onboarding',
            'title': 'HR & Onboarding',
            'description': 'Streamline employee onboarding and management',
            'agent_type': 'hr',
            'sample_message': 'We need to improve our employee onboarding process. What are the key steps?'
        },
        {
            'id': 'content_creation',
            'title': 'Content Strategy',
            'description': 'Create compelling content that drives engagement',
            'agent_type': 'content',
            'sample_message': 'Help me create a content strategy for our new product launch.'
        },
        {
            'id': 'project_management',
            'title': 'Project Coordination',
            'description': 'Manage complex projects with precision and efficiency',
            'agent_type': 'project',
            'sample_message': 'I need to coordinate a multi-team project with tight deadlines. How should I approach this?'
        },
        {
            'id': 'financial_analysis',
            'title': 'Financial Intelligence',
            'description': 'Provide strategic financial insights and forecasting',
            'agent_type': 'finance',
            'sample_message': 'Can you help me analyze our quarterly performance and forecast next quarter?'
        }
    ]
    
    return jsonify({
        'scenarios': scenarios,
        'total': len(scenarios)
    }), 200

@demo_bp.route('/quick-test', methods=['POST'])
def quick_demo_test():
    """Quick demo test without authentication for public demos."""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        agent_type = data.get('agent_type', 'sales')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Generate AI response
        openai_service = OpenAIService(current_app.config.get('OPENAI_API_KEY'))
        
        start_time = datetime.utcnow()
        response_result = openai_service.generate_response(
            messages=[{'role': 'user', 'content': message}],
            agent_type=agent_type,
            model='gpt-4',
            temperature=0.7,
            max_tokens=500
        )
        end_time = datetime.utcnow()
        response_time = (end_time - start_time).total_seconds()
        
        if response_result['success']:
            return jsonify({
                'success': True,
                'response': response_result['response'],
                'response_time': response_time,
                'agent_type': agent_type,
                'demo_mode': True
            }), 200
        else:
            return jsonify({
                'error': 'Failed to generate response',
                'details': response_result.get('error', 'Unknown error')
            }), 500
    
    except Exception as e:
        current_app.logger.error(f"Quick demo error: {str(e)}")
        return jsonify({'error': 'Demo execution failed'}), 500