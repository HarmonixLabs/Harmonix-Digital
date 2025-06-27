import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.webhooks import webhooks_bp
from src.routes.agent import agent_bp
from src.routes.demo import demo_bp

def create_app():
    """Application factory pattern for Flask app creation."""
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    # Load configuration from environment
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'harmonix-ai-platform-secret-key-2024')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'harmonix-jwt-secret-key-2024')
    
    # Enable CORS for all routes
    cors_origins = os.getenv('CORS_ORIGINS', '*')
    if cors_origins == '*':
        CORS(app, origins="*")
    else:
        CORS(app, origins=cors_origins.split(','))

    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(webhooks_bp, url_prefix='/api/webhooks')
    app.register_blueprint(agent_bp, url_prefix='/api')
    app.register_blueprint(demo_bp, url_prefix='/api')

    # Database configuration
    database_url = os.getenv('DATABASE_URL', f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}")
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'harmonix-backend',
            'version': '1.0.0',
            'timestamp': os.popen('date -u +"%Y-%m-%dT%H:%M:%SZ"').read().strip()
        })

    # API documentation endpoint
    @app.route('/api')
    def api_info():
        return jsonify({
            'service': 'HARMONIX Backend API',
            'version': '1.0.0',
            'endpoints': {
                'auth': {
                    'POST /api/auth/register': 'Register new user',
                    'POST /api/auth/login': 'User login',
                    'POST /api/auth/logout': 'User logout',
                    'GET /api/auth/me': 'Get current user',
                    'POST /api/auth/verify-email': 'Verify email address',
                    'POST /api/auth/forgot-password': 'Request password reset',
                    'POST /api/auth/reset-password': 'Reset password',
                    'POST /api/auth/demo-login': 'Create demo session',
                    'POST /api/auth/waitlist': 'Join waitlist'
                },
                'agents': {
                    'GET /api/agents': 'Get all agents',
                    'GET /api/agents/{id}': 'Get specific agent',
                    'POST /api/agents/{id}/deploy': 'Deploy agent',
                    'GET /api/my-agents': 'Get user deployed agents',
                    'PUT /api/my-agents/{id}': 'Update deployed agent',
                    'DELETE /api/my-agents/{id}': 'Delete deployed agent'
                },
                'threads': {
                    'POST /api/threads': 'Create agent thread',
                    'GET /api/threads': 'Get user threads',
                    'POST /api/threads/{id}/messages': 'Add message to thread'
                },
                'demo': {
                    'POST /api/demo/start': 'Start demo session',
                    'GET /api/demo/{token}': 'Get demo session',
                    'POST /api/demo/{token}/message': 'Send demo message',
                    'POST /api/demo/{token}/convert': 'Convert demo to trial'
                },
                'templates': {
                    'GET /api/templates': 'Get agent templates'
                },
                'webhooks': {
                    'POST /api/webhooks/stripe': 'Stripe webhook handler'
                }
            }
        })

    # Serve static files (for frontend if needed)
    @app.route('/')
    def serve_frontend():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def serve_static(path):
        return send_from_directory(app.static_folder, path)

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': {
                'code': 'NOT_FOUND',
                'message': 'Endpoint not found'
            }
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Internal server error'
            }
        }), 500

    return app

if __name__ == '__main__':
    app = create_app()
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Run the application
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    app.run(host='0.0.0.0', port=port, debug=debug)

