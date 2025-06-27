"""
HARMONIX AI Agent Platform - Flask Backend
Main application entry point
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app(config_name=None):
    """Application factory function."""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'harmonix-dev-secret')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'harmonix-dev-secret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    
    # Stripe configuration
    app.config['STRIPE_SECRET_KEY'] = os.getenv('STRIPE_SECRET_KEY')
    app.config['STRIPE_WEBHOOK_SECRET'] = os.getenv('STRIPE_WEBHOOK_SECRET')
    
    # OpenAI configuration
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
    
    # GoHighLevel configuration
    app.config['GHL_API_KEY'] = os.getenv('GHL_API_KEY_HARMONIX')
    app.config['GHL_WEBHOOK_SECRET'] = os.getenv('HARMONIX_GHL_WEBHOOK')
    
    # Initialize extensions
    CORS(app, origins=["http://localhost:3000", "http://localhost:5000"])
    jwt = JWTManager(app)
    
    # Initialize database
    from src.models.user import db
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Register blueprints
    from src.routes.auth import auth_bp
    from src.routes.agent import agent_bp
    from src.routes.webhook import webhook_bp
    from src.routes.stripe_routes import stripe_bp
    from src.routes.demo import demo_bp
    from src.routes.health import health_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(agent_bp, url_prefix='/api/agents')
    app.register_blueprint(webhook_bp, url_prefix='/api/webhooks')
    app.register_blueprint(stripe_bp, url_prefix='/api/stripe')
    app.register_blueprint(demo_bp, url_prefix='/api/demo')
    app.register_blueprint(health_bp, url_prefix='/api/health')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token required'}), 401
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'harmonix-backend',
            'version': '1.0.0'
        })
    
    return app

def init_db(app):
    """Initialize database tables."""
    with app.app_context():
        from src.models.user import db
        db.create_all()
        print("Database tables created successfully")

if __name__ == '__main__':
    app = create_app()
    
    # Initialize database
    init_db(app)
    
    # Run the application
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting HARMONIX Backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)