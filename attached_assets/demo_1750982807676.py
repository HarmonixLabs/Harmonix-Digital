from flask import Blueprint, request, jsonify, current_app
from src.models.user import db, User, Agent, DemoSession
from src.lib.auth import validate_jwt
from datetime import datetime, timedelta
import uuid
import secrets

demo_bp = Blueprint('demo', __name__)

def get_current_user():
    """Get current user from JWT token (optional for demo)"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    payload = validate_jwt(token)
    if not payload:
        return None
    
    return User.query.get(payload['user_id'])

@demo_bp.route('/demo/start', methods=['POST'])
def start_demo():
    """Start a demo session for an agent"""
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
        
        # Verify agent exists and is active
        agent = Agent.query.get(agent_id)
        if not agent or not agent.is_active:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AGENT_NOT_FOUND',
                    'message': 'Agent not found or inactive'
                }
            }), 404
        
        # Get current user (optional for demo)
        user = get_current_user()
        
        # Create demo session
        session_token = secrets.token_urlsafe(32)
        demo_session = DemoSession(
            session_token=session_token,
            user_id=user.id if user else None,
            agent_id=agent_id,
            expires_at=datetime.utcnow() + timedelta(hours=24),
            demo_data=get_demo_data_for_agent(agent)
        )
        
        db.session.add(demo_session)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'demo_session': demo_session.to_dict(),
                'session_token': session_token,
                'agent': agent.to_dict()
            },
            'message': 'Demo session started successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Start demo error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to start demo session'
            }
        }), 500

@demo_bp.route('/demo/<session_token>', methods=['GET'])
def get_demo_session(session_token):
    """Get demo session details"""
    try:
        demo_session = DemoSession.query.filter_by(session_token=session_token).first()
        
        if not demo_session:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'SESSION_NOT_FOUND',
                    'message': 'Demo session not found'
                }
            }), 404
        
        if demo_session.is_expired():
            return jsonify({
                'success': False,
                'error': {
                    'code': 'SESSION_EXPIRED',
                    'message': 'Demo session has expired'
                }
            }), 410
        
        return jsonify({
            'success': True,
            'data': {
                'demo_session': demo_session.to_dict()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get demo session error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to fetch demo session'
            }
        }), 500

@demo_bp.route('/demo/<session_token>/message', methods=['POST'])
def send_demo_message(session_token):
    """Send message in demo session"""
    try:
        demo_session = DemoSession.query.filter_by(session_token=session_token).first()
        
        if not demo_session:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'SESSION_NOT_FOUND',
                    'message': 'Demo session not found'
                }
            }), 404
        
        if not demo_session.can_send_message():
            if demo_session.is_expired():
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'SESSION_EXPIRED',
                        'message': 'Demo session has expired'
                    }
                }), 410
            else:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'MESSAGE_LIMIT_REACHED',
                        'message': f'Demo message limit reached ({demo_session.messages_limit} messages)',
                        'upgrade_required': True
                    }
                }), 429
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Message is required'
                }
            }), 400
        
        # Add user message to conversation history
        if not demo_session.conversation_history:
            demo_session.conversation_history = []
        
        user_message = {
            'id': str(uuid.uuid4()),
            'role': 'user',
            'content': message,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        demo_session.conversation_history.append(user_message)
        demo_session.messages_used += 1
        
        # Generate AI response based on agent type
        ai_response = generate_demo_response(demo_session.agent, message, demo_session)
        
        ai_message = {
            'id': str(uuid.uuid4()),
            'role': 'assistant',
            'content': ai_response,
            'timestamp': datetime.utcnow().isoformat(),
            'metadata': {
                'agent_id': demo_session.agent_id,
                'demo_mode': True
            }
        }
        
        demo_session.conversation_history.append(ai_message)
        
        # Check if demo is complete
        if demo_session.messages_used >= demo_session.messages_limit:
            demo_session.status = 'completed'
            demo_session.completed_at = datetime.utcnow()
        
        db.session.commit()
        
        response_data = {
            'success': True,
            'data': {
                'demo_session': demo_session.to_dict(),
                'user_message': user_message,
                'ai_response': ai_message
            },
            'message': 'Message sent successfully'
        }
        
        # Add upgrade prompt if demo is complete
        if demo_session.status == 'completed':
            response_data['upgrade_prompt'] = {
                'title': 'Demo Complete!',
                'message': 'You\'ve experienced the power of HARMONIX. Ready to unlock unlimited conversations?',
                'cta': 'Start Your Free Trial'
            }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Send demo message error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to send message'
            }
        }), 500

@demo_bp.route('/demo/<session_token>/convert', methods=['POST'])
def convert_demo_to_trial(session_token):
    """Convert demo session to trial signup"""
    try:
        demo_session = DemoSession.query.filter_by(session_token=session_token).first()
        
        if not demo_session:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'SESSION_NOT_FOUND',
                    'message': 'Demo session not found'
                }
            }), 404
        
        if demo_session.converted_to_trial:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'ALREADY_CONVERTED',
                    'message': 'Demo session already converted'
                }
            }), 400
        
        # Mark as converted
        demo_session.converted_to_trial = True
        demo_session.status = 'converted'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'conversion_token': demo_session.session_token,
                'redirect_url': '/register?demo_token=' + demo_session.session_token
            },
            'message': 'Demo session marked for conversion'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Convert demo error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to convert demo session'
            }
        }), 500

def get_demo_data_for_agent(agent):
    """Get demo data specific to agent type"""
    demo_data = {
        'Sales Agent': {
            'leads': [
                {'name': 'John Smith', 'company': 'TechCorp', 'email': 'john@techcorp.com', 'status': 'qualified'},
                {'name': 'Sarah Johnson', 'company': 'StartupXYZ', 'email': 'sarah@startupxyz.com', 'status': 'contacted'},
                {'name': 'Mike Chen', 'company': 'Enterprise Inc', 'email': 'mike@enterprise.com', 'status': 'interested'}
            ],
            'pipeline_value': '$45,000',
            'conversion_rate': '23%'
        },
        'Marketing Agent': {
            'campaigns': [
                {'name': 'Q1 Product Launch', 'status': 'active', 'reach': '12,500', 'engagement': '4.2%'},
                {'name': 'Brand Awareness', 'status': 'completed', 'reach': '8,900', 'engagement': '3.8%'}
            ],
            'content_created': 15,
            'social_growth': '+12%'
        },
        'Customer Service Agent': {
            'tickets': [
                {'id': '#1234', 'subject': 'Login Issue', 'status': 'resolved', 'priority': 'medium'},
                {'id': '#1235', 'subject': 'Billing Question', 'status': 'open', 'priority': 'low'},
                {'id': '#1236', 'subject': 'Feature Request', 'status': 'in_progress', 'priority': 'high'}
            ],
            'satisfaction_score': '4.8/5',
            'response_time': '2 minutes'
        },
        'HR Agent': {
            'candidates': [
                {'name': 'Alex Rivera', 'position': 'Software Engineer', 'status': 'interview_scheduled'},
                {'name': 'Emma Davis', 'position': 'Product Manager', 'status': 'offer_sent'},
                {'name': 'James Wilson', 'position': 'Designer', 'status': 'screening'}
            ],
            'open_positions': 5,
            'time_to_hire': '18 days'
        }
    }
    
    return demo_data.get(agent.name, {
        'demo_mode': True,
        'sample_data': 'This is sample data for demonstration purposes'
    })

def generate_demo_response(agent, user_message, demo_session):
    """Generate contextual demo response based on agent type"""
    
    responses = {
        'Sales Agent': [
            f"I've analyzed your message about '{user_message[:50]}...' and found 3 potential leads that match your criteria. Would you like me to start outreach campaigns?",
            "Based on our conversation, I recommend focusing on enterprise clients. I can set up automated follow-up sequences for your warm leads.",
            "I've updated your sales pipeline. The projected close rate for this quarter is looking strong at 23%. Shall I schedule follow-up calls?",
            "Great insight! I'll add this to our lead qualification criteria. I'm also seeing increased engagement from the tech sector - want me to prioritize those leads?",
            "Perfect! I've created a personalized outreach sequence for your top prospects. Your conversion rate should improve significantly with this approach."
        ],
        'Marketing Agent': [
            f"Excellent point about '{user_message[:50]}...' I'll incorporate this into our content strategy. I'm already seeing 15% higher engagement with similar messaging.",
            "I love this direction! I can create a full campaign around this concept. Based on our audience data, this should resonate well with our target demographic.",
            "This aligns perfectly with our brand voice. I'll develop social media content, blog posts, and email sequences around this theme. Expected reach: 25,000+",
            "Brilliant strategy! I'm already drafting content that builds on this idea. Our engagement rates have been climbing 12% month-over-month with similar approaches.",
            "This is exactly what our audience needs to hear. I'll create a multi-channel campaign that amplifies this message across all our platforms."
        ],
        'Customer Service Agent': [
            f"I understand your concern about '{user_message[:50]}...' Let me check our knowledge base and provide you with the most accurate solution.",
            "Thank you for bringing this to my attention. I've escalated this to our technical team and you should receive an update within 2 hours.",
            "I've found a solution for your issue! Based on similar cases, this approach has a 95% success rate. Would you like me to walk you through it?",
            "Great question! This is actually a common request. I've prepared a detailed guide that should resolve this completely. Can I send that to you?",
            "I appreciate your patience. I've resolved your issue and also identified a way to prevent this from happening again. Your satisfaction is our priority!"
        ],
        'HR Agent': [
            f"Regarding '{user_message[:50]}...' I've identified 5 qualified candidates who match these requirements. Shall I schedule initial screenings?",
            "Excellent criteria! I'll update our job postings to attract candidates with these skills. Our current pipeline shows strong potential for this role.",
            "I've streamlined the interview process based on your feedback. This should reduce our time-to-hire by 30% while maintaining quality standards.",
            "Perfect timing! I just received applications from 3 candidates who fit this profile exactly. Would you like me to prioritize their reviews?",
            "I've implemented your suggestions into our hiring workflow. Our candidate satisfaction scores have improved to 4.8/5 with these changes."
        ],
        'Finance Agent': [
            f"I've analyzed the financial implications of '{user_message[:50]}...' and prepared a detailed cost-benefit analysis for your review.",
            "Excellent financial planning! Based on current trends, this approach could improve cash flow by 18%. I'll prepare the budget projections.",
            "I've updated your financial dashboard with this new information. Your ROI tracking shows strong performance across all key metrics.",
            "Smart financial decision! I've calculated the potential savings and created automated reporting to track the impact over time.",
            "I've processed this request and updated your financial forecasts. The projected impact looks very positive for Q2 performance."
        ]
    }
    
    agent_responses = responses.get(agent.name, [
        f"Thank you for your message about '{user_message[:50]}...' I'm processing this request and will provide you with a comprehensive solution.",
        "I understand your needs and I'm here to help optimize your workflow. Let me analyze the best approach for your specific situation.",
        "Excellent point! I'll incorporate this into my analysis and provide you with actionable recommendations based on industry best practices.",
        "I appreciate the detailed information. Based on my training, I can offer several strategies that have proven successful in similar scenarios.",
        "This is exactly the kind of challenge I excel at solving. I'll provide you with a step-by-step plan to achieve your objectives efficiently."
    ])
    
    # Select response based on message count to create progression
    message_index = min(demo_session.messages_used - 1, len(agent_responses) - 1)
    return agent_responses[message_index]

