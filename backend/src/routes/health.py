"""
Health monitoring routes for HARMONIX Platform
"""

from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import psutil
import os

from src.models.user import db
from src.lib.ghl import GoHighLevelService
from src.lib.stripe_service import StripeService
from src.lib.openai_service import OpenAIService

health_bp = Blueprint('health', __name__)

@health_bp.route('', methods=['GET'])
def basic_health_check():
    """Basic health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'harmonix-backend',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }), 200

@health_bp.route('/detailed', methods=['GET'])
def detailed_health_check():
    """Detailed health check with system metrics."""
    try:
        health_data = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'system': get_system_metrics(),
            'database': check_database_health(),
            'external_apis': check_external_apis(),
            'application': get_application_metrics()
        }
        
        # Determine overall status
        if any(check['status'] != 'healthy' for check in [
            health_data['database'],
            health_data['external_apis']['stripe'],
            health_data['external_apis']['openai']
        ]):
            health_data['status'] = 'degraded'
        
        status_code = 200 if health_data['status'] == 'healthy' else 503
        
        return jsonify(health_data), status_code
    
    except Exception as e:
        current_app.logger.error(f"Health check error: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 503

def get_system_metrics():
    """Get system resource metrics."""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            'cpu_usage': {
                'percent': cpu_percent,
                'status': 'healthy' if cpu_percent < 80 else 'warning' if cpu_percent < 90 else 'critical'
            },
            'memory_usage': {
                'percent': memory.percent,
                'available': memory.available,
                'status': 'healthy' if memory.percent < 80 else 'warning' if memory.percent < 90 else 'critical'
            },
            'disk_usage': {
                'percent': round((disk.used / disk.total) * 100, 2),
                'free': disk.free,
                'status': 'healthy' if disk.used / disk.total < 0.8 else 'warning' if disk.used / disk.total < 0.9 else 'critical'
            },
            'process_count': len(psutil.pids())
        }
    except Exception as e:
        return {
            'error': str(e),
            'status': 'unknown'
        }

def check_database_health():
    """Check database connectivity and performance."""
    try:
        start_time = datetime.utcnow()
        
        # Simple database query
        result = db.session.execute('SELECT 1').fetchone()
        
        end_time = datetime.utcnow()
        response_time = (end_time - start_time).total_seconds() * 1000
        
        # Check active connections
        connection_count = db.session.execute(
            "SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"
        ).scalar()
        
        return {
            'status': 'healthy' if response_time < 100 else 'warning' if response_time < 500 else 'critical',
            'response_time_ms': round(response_time, 2),
            'active_connections': connection_count,
            'last_check': datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
            'last_check': datetime.utcnow().isoformat()
        }

def check_external_apis():
    """Check external API connectivity."""
    apis = {}
    
    # Check Stripe
    try:
        stripe_service = StripeService(current_app.config.get('STRIPE_SECRET_KEY'))
        stripe_result = stripe_service.validate_api_key()
        
        apis['stripe'] = {
            'status': 'healthy' if stripe_result['success'] else 'unhealthy',
            'last_check': datetime.utcnow().isoformat()
        }
        
        if not stripe_result['success']:
            apis['stripe']['error'] = stripe_result.get('error', 'Unknown error')
    
    except Exception as e:
        apis['stripe'] = {
            'status': 'unhealthy',
            'error': str(e),
            'last_check': datetime.utcnow().isoformat()
        }
    
    # Check OpenAI
    try:
        openai_service = OpenAIService(current_app.config.get('OPENAI_API_KEY'))
        openai_result = openai_service.validate_api_key()
        
        apis['openai'] = {
            'status': 'healthy' if openai_result['success'] else 'unhealthy',
            'last_check': datetime.utcnow().isoformat()
        }
        
        if not openai_result['success']:
            apis['openai']['error'] = openai_result.get('error', 'Unknown error')
    
    except Exception as e:
        apis['openai'] = {
            'status': 'unhealthy',
            'error': str(e),
            'last_check': datetime.utcnow().isoformat()
        }
    
    # Check GoHighLevel
    try:
        ghl_service = GoHighLevelService(current_app.config.get('GHL_API_KEY'))
        ghl_result = ghl_service.validate_api_key()
        
        apis['gohighlevel'] = {
            'status': 'healthy' if ghl_result['success'] else 'unhealthy',
            'last_check': datetime.utcnow().isoformat()
        }
        
        if not ghl_result['success']:
            apis['gohighlevel']['error'] = ghl_result.get('error', 'Unknown error')
    
    except Exception as e:
        apis['gohighlevel'] = {
            'status': 'unhealthy',
            'error': str(e),
            'last_check': datetime.utcnow().isoformat()
        }
    
    return apis

def get_application_metrics():
    """Get application-specific metrics."""
    try:
        from src.models.user import User, Agent, AgentThread
        
        # Get basic counts
        user_count = User.query.count()
        agent_count = Agent.query.count()
        thread_count = AgentThread.query.count()
        
        # Get active users (logged in within last 24 hours)
        from datetime import timedelta
        yesterday = datetime.utcnow() - timedelta(days=1)
        active_users = User.query.filter(User.last_login >= yesterday).count()
        
        # Get deployed agents
        deployed_agents = Agent.query.filter_by(is_deployed=True).count()
        
        return {
            'users': {
                'total': user_count,
                'active_24h': active_users
            },
            'agents': {
                'total': agent_count,
                'deployed': deployed_agents
            },
            'threads': {
                'total': thread_count
            },
            'last_updated': datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        return {
            'error': str(e),
            'status': 'unknown'
        }

@health_bp.route('/metrics', methods=['GET'])
def get_metrics():
    """Get detailed metrics for monitoring."""
    try:
        metrics = {
            'timestamp': datetime.utcnow().isoformat(),
            'system': get_system_metrics(),
            'application': get_application_metrics(),
            'environment': {
                'python_version': f"{os.sys.version_info.major}.{os.sys.version_info.minor}.{os.sys.version_info.micro}",
                'flask_env': current_app.config.get('ENV', 'production'),
                'debug_mode': current_app.debug
            }
        }
        
        return jsonify(metrics), 200
    
    except Exception as e:
        current_app.logger.error(f"Metrics error: {str(e)}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@health_bp.route('/readiness', methods=['GET'])
def readiness_check():
    """Kubernetes-style readiness probe."""
    try:
        # Check if database is accessible
        db.session.execute('SELECT 1').fetchone()
        
        return jsonify({
            'status': 'ready',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({
            'status': 'not_ready',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 503

@health_bp.route('/liveness', methods=['GET'])
def liveness_check():
    """Kubernetes-style liveness probe."""
    return jsonify({
        'status': 'alive',
        'timestamp': datetime.utcnow().isoformat()
    }), 200