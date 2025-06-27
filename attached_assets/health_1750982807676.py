from flask import Blueprint, request, jsonify, current_app
from src.models.user import db, User, Agent, UserAgent, DemoSession, Subscription
from src.models.agent_models import AgentThread, AgentWorkflow
from src.lib.auth import validate_jwt
from datetime import datetime, timedelta
import psutil
import os

health_bp = Blueprint('health', __name__)

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

@health_bp.route('/health/system', methods=['GET'])
def get_system_health():
    """Get comprehensive system health metrics"""
    try:
        user = get_current_user()
        if not user or user.role != 'admin':
            return jsonify({
                'success': False,
                'error': {
                    'code': 'UNAUTHORIZED',
                    'message': 'Admin access required'
                }
            }), 403

        # System metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Database metrics
        total_users = User.query.count()
        active_users = User.query.filter_by(status='active').count()
        trial_users = User.query.filter_by(status='trial').count()
        total_agents = Agent.query.count()
        deployed_agents = UserAgent.query.count()
        total_threads = AgentThread.query.count()
        active_threads = AgentThread.query.filter_by(status='active').count()
        
        # Recent activity
        recent_signups = User.query.filter(
            User.created_at >= datetime.utcnow() - timedelta(hours=24)
        ).count()
        
        recent_deployments = UserAgent.query.filter(
            UserAgent.created_at >= datetime.utcnow() - timedelta(hours=24)
        ).count()
        
        recent_conversations = AgentThread.query.filter(
            AgentThread.last_message_at >= datetime.utcnow() - timedelta(hours=24)
        ).count()

        # Integration health (mock data for now)
        integrations = [
            {'name': 'OpenAI API', 'status': 'healthy', 'response_time': 245, 'uptime': 99.9},
            {'name': 'Stripe API', 'status': 'healthy', 'response_time': 156, 'uptime': 99.8},
            {'name': 'GoHighLevel', 'status': 'warning', 'response_time': 890, 'uptime': 98.5},
            {'name': 'Email Service', 'status': 'healthy', 'response_time': 123, 'uptime': 99.7},
            {'name': 'Database', 'status': 'healthy', 'response_time': 45, 'uptime': 100.0}
        ]

        return jsonify({
            'success': True,
            'data': {
                'system': {
                    'cpu_usage': cpu_percent,
                    'memory_usage': memory.percent,
                    'memory_available': memory.available,
                    'memory_total': memory.total,
                    'disk_usage': (disk.used / disk.total) * 100,
                    'disk_free': disk.free,
                    'disk_total': disk.total,
                    'uptime': get_system_uptime()
                },
                'database': {
                    'total_users': total_users,
                    'active_users': active_users,
                    'trial_users': trial_users,
                    'total_agents': total_agents,
                    'deployed_agents': deployed_agents,
                    'total_threads': total_threads,
                    'active_threads': active_threads
                },
                'activity': {
                    'recent_signups': recent_signups,
                    'recent_deployments': recent_deployments,
                    'recent_conversations': recent_conversations
                },
                'integrations': integrations,
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"System health check error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to get system health'
            }
        }), 500

@health_bp.route('/health/agents', methods=['GET'])
def get_agent_health():
    """Get detailed agent health metrics"""
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

        # Get user's agents or all agents for admin
        if user.role == 'admin':
            user_agents = UserAgent.query.all()
        else:
            user_agents = UserAgent.query.filter_by(user_id=user.id).all()

        agent_health = []
        for ua in user_agents:
            # Calculate health metrics
            recent_threads = AgentThread.query.filter(
                AgentThread.user_agent_id == ua.id,
                AgentThread.created_at >= datetime.utcnow() - timedelta(hours=24)
            ).count()
            
            total_messages = db.session.query(
                db.func.sum(AgentThread.total_messages)
            ).filter(AgentThread.user_agent_id == ua.id).scalar() or 0
            
            avg_response_time = calculate_avg_response_time(ua.id)
            success_rate = calculate_success_rate(ua.id)
            
            health_score = calculate_health_score(ua, avg_response_time, success_rate)
            
            agent_health.append({
                'id': ua.id,
                'name': ua.name,
                'agent_name': ua.agent.name,
                'status': ua.status,
                'health_score': health_score,
                'recent_conversations': recent_threads,
                'total_messages': total_messages,
                'avg_response_time': avg_response_time,
                'success_rate': success_rate,
                'last_active': ua.last_used_at.isoformat() if ua.last_used_at else None,
                'created_at': ua.created_at.isoformat(),
                'user_email': ua.user.email if user.role == 'admin' else None
            })

        return jsonify({
            'success': True,
            'data': {
                'agents': agent_health,
                'summary': {
                    'total_agents': len(agent_health),
                    'healthy_agents': len([a for a in agent_health if a['health_score'] >= 90]),
                    'warning_agents': len([a for a in agent_health if 70 <= a['health_score'] < 90]),
                    'critical_agents': len([a for a in agent_health if a['health_score'] < 70]),
                    'avg_health_score': sum(a['health_score'] for a in agent_health) / len(agent_health) if agent_health else 0
                }
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Agent health check error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to get agent health'
            }
        }), 500

@health_bp.route('/health/integrations', methods=['GET'])
def get_integration_health():
    """Get integration health status"""
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

        # Test integrations
        integrations = []
        
        # OpenAI API test
        openai_status = test_openai_connection()
        integrations.append({
            'name': 'OpenAI API',
            'type': 'ai_service',
            'status': openai_status['status'],
            'response_time': openai_status['response_time'],
            'last_check': datetime.utcnow().isoformat(),
            'error_message': openai_status.get('error')
        })
        
        # Stripe API test
        stripe_status = test_stripe_connection()
        integrations.append({
            'name': 'Stripe API',
            'type': 'payment',
            'status': stripe_status['status'],
            'response_time': stripe_status['response_time'],
            'last_check': datetime.utcnow().isoformat(),
            'error_message': stripe_status.get('error')
        })
        
        # GoHighLevel test
        ghl_status = test_ghl_connection()
        integrations.append({
            'name': 'GoHighLevel',
            'type': 'crm',
            'status': ghl_status['status'],
            'response_time': ghl_status['response_time'],
            'last_check': datetime.utcnow().isoformat(),
            'error_message': ghl_status.get('error')
        })
        
        # Email service test
        email_status = test_email_service()
        integrations.append({
            'name': 'Email Service',
            'type': 'communication',
            'status': email_status['status'],
            'response_time': email_status['response_time'],
            'last_check': datetime.utcnow().isoformat(),
            'error_message': email_status.get('error')
        })

        # Calculate overall health
        healthy_count = len([i for i in integrations if i['status'] == 'healthy'])
        warning_count = len([i for i in integrations if i['status'] == 'warning'])
        error_count = len([i for i in integrations if i['status'] == 'error'])

        return jsonify({
            'success': True,
            'data': {
                'integrations': integrations,
                'summary': {
                    'total_integrations': len(integrations),
                    'healthy': healthy_count,
                    'warning': warning_count,
                    'error': error_count,
                    'overall_health': 'healthy' if error_count == 0 and warning_count <= 1 else 'warning' if error_count == 0 else 'critical'
                }
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Integration health check error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to get integration health'
            }
        }), 500

@health_bp.route('/health/notifications', methods=['POST'])
def create_notification():
    """Create system notification"""
    try:
        user = get_current_user()
        if not user or user.role != 'admin':
            return jsonify({
                'success': False,
                'error': {
                    'code': 'UNAUTHORIZED',
                    'message': 'Admin access required'
                }
            }), 403

        data = request.get_json()
        
        # Validate required fields
        required_fields = ['type', 'title', 'message']
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

        # Create notification (would typically save to database)
        notification = {
            'id': f"notif_{int(datetime.utcnow().timestamp())}",
            'type': data['type'],  # 'info', 'warning', 'error', 'success'
            'title': data['title'],
            'message': data['message'],
            'target_users': data.get('target_users', 'all'),
            'created_by': user.id,
            'created_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }

        # Here you would typically:
        # 1. Save to database
        # 2. Send via WebSocket to connected users
        # 3. Send email/SMS if configured
        
        return jsonify({
            'success': True,
            'data': {
                'notification': notification
            },
            'message': 'Notification created successfully'
        }), 201

    except Exception as e:
        current_app.logger.error(f"Create notification error: {e}")
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to create notification'
            }
        }), 500

def get_system_uptime():
    """Get system uptime in seconds"""
    try:
        return psutil.boot_time()
    except:
        return 0

def calculate_avg_response_time(user_agent_id):
    """Calculate average response time for an agent"""
    # Mock calculation - would analyze actual conversation data
    return round(1.2 + (hash(str(user_agent_id)) % 100) / 100, 1)

def calculate_success_rate(user_agent_id):
    """Calculate success rate for an agent"""
    # Mock calculation - would analyze actual conversation outcomes
    return round(95 + (hash(str(user_agent_id)) % 10), 1)

def calculate_health_score(user_agent, avg_response_time, success_rate):
    """Calculate overall health score for an agent"""
    base_score = 100
    
    # Deduct for slow response times
    if avg_response_time > 3.0:
        base_score -= 20
    elif avg_response_time > 2.0:
        base_score -= 10
    elif avg_response_time > 1.5:
        base_score -= 5
    
    # Deduct for low success rate
    if success_rate < 90:
        base_score -= 15
    elif success_rate < 95:
        base_score -= 5
    
    # Deduct for inactive agents
    if user_agent.status != 'active':
        base_score -= 30
    
    return max(0, base_score)

def test_openai_connection():
    """Test OpenAI API connection"""
    import time
    start_time = time.time()
    
    try:
        # Mock test - would make actual API call
        time.sleep(0.2)  # Simulate API call
        response_time = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'healthy',
            'response_time': response_time
        }
    except Exception as e:
        return {
            'status': 'error',
            'response_time': int((time.time() - start_time) * 1000),
            'error': str(e)
        }

def test_stripe_connection():
    """Test Stripe API connection"""
    import time
    start_time = time.time()
    
    try:
        # Mock test - would make actual API call
        time.sleep(0.15)  # Simulate API call
        response_time = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'healthy',
            'response_time': response_time
        }
    except Exception as e:
        return {
            'status': 'error',
            'response_time': int((time.time() - start_time) * 1000),
            'error': str(e)
        }

def test_ghl_connection():
    """Test GoHighLevel API connection"""
    import time
    start_time = time.time()
    
    try:
        # Mock test - would make actual API call
        time.sleep(0.8)  # Simulate slower API call
        response_time = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'warning',  # Simulating slower response
            'response_time': response_time
        }
    except Exception as e:
        return {
            'status': 'error',
            'response_time': int((time.time() - start_time) * 1000),
            'error': str(e)
        }

def test_email_service():
    """Test email service connection"""
    import time
    start_time = time.time()
    
    try:
        # Mock test - would test SMTP connection
        time.sleep(0.1)  # Simulate API call
        response_time = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'healthy',
            'response_time': response_time
        }
    except Exception as e:
        return {
            'status': 'error',
            'response_time': int((time.time() - start_time) * 1000),
            'error': str(e)
        }

