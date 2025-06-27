#!/usr/bin/env python3
"""
HARMONIX Database Initialization Script
Creates all tables and seeds initial data for development
"""

import os
import sys
from datetime import datetime, timedelta

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from flask import Flask
from src.models.user import db, User, UserAuditLog, ExternalSyncLog, Agent, UserAgent, DemoSession, Subscription
from src.models.agent_models import AgentThread, AgentWorkflow, AgentTemplate

def create_app():
    """Create Flask app for database initialization"""
    app = Flask(__name__)
    
    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///harmonix.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    db.init_app(app)
    return app

def create_tables(app):
    """Create all database tables"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✓ Database tables created successfully")

def seed_agents(app):
    """Seed initial agent data"""
    with app.app_context():
        print("Seeding agent data...")
        
        agents_data = [
            {
                'name': 'Sales Agent',
                'description': 'AI-powered sales assistant that finds leads, follows up with prospects, and closes deals automatically.',
                'category': 'Sales',
                'icon': '💼',
                'base_price': 97.00,
                'setup_fee': 197.00,
                'capabilities': ['lead_generation', 'email_outreach', 'crm_integration', 'sales_analytics'],
                'integrations': ['salesforce', 'hubspot', 'pipedrive', 'gmail'],
                'prompt_template': 'You are a professional sales agent focused on generating leads and closing deals...',
                'is_featured': True
            },
            {
                'name': 'Marketing Agent',
                'description': 'Creates compelling content, manages campaigns, and drives customer acquisition across all channels.',
                'category': 'Marketing',
                'icon': '📈',
                'base_price': 97.00,
                'setup_fee': 197.00,
                'capabilities': ['content_creation', 'social_media', 'email_marketing', 'seo_optimization'],
                'integrations': ['facebook', 'instagram', 'linkedin', 'mailchimp'],
                'prompt_template': 'You are a creative marketing agent specialized in content creation and campaign management...',
                'is_featured': True
            },
            {
                'name': 'Customer Service Agent',
                'description': 'Provides 24/7 customer support, handles inquiries, and resolves issues with human-like empathy.',
                'category': 'Support',
                'icon': '🎧',
                'base_price': 67.00,
                'setup_fee': 97.00,
                'capabilities': ['live_chat', 'ticket_management', 'knowledge_base', 'sentiment_analysis'],
                'integrations': ['zendesk', 'intercom', 'freshdesk', 'slack'],
                'prompt_template': 'You are a helpful customer service agent focused on resolving customer issues...'
            },
            {
                'name': 'HR Agent',
                'description': 'Streamlines recruitment, onboarding, and employee management with intelligent automation.',
                'category': 'Human Resources',
                'icon': '👥',
                'base_price': 127.00,
                'setup_fee': 297.00,
                'capabilities': ['recruitment', 'onboarding', 'performance_tracking', 'policy_management'],
                'integrations': ['workday', 'bamboohr', 'greenhouse', 'linkedin'],
                'prompt_template': 'You are an HR agent specialized in talent management and employee relations...'
            },
            {
                'name': 'Finance Agent',
                'description': 'Manages invoicing, expense tracking, financial reporting, and budget optimization.',
                'category': 'Finance',
                'icon': '💰',
                'base_price': 157.00,
                'setup_fee': 397.00,
                'capabilities': ['invoicing', 'expense_tracking', 'financial_reporting', 'budget_analysis'],
                'integrations': ['quickbooks', 'xero', 'stripe', 'paypal'],
                'prompt_template': 'You are a finance agent focused on financial management and reporting...'
            },
            {
                'name': 'Project Manager Agent',
                'description': 'Coordinates teams, tracks progress, manages deadlines, and ensures project success.',
                'category': 'Project Management',
                'icon': '📋',
                'base_price': 97.00,
                'setup_fee': 197.00,
                'capabilities': ['task_management', 'team_coordination', 'progress_tracking', 'resource_planning'],
                'integrations': ['asana', 'trello', 'jira', 'monday'],
                'prompt_template': 'You are a project manager agent focused on team coordination and project delivery...'
            },
            {
                'name': 'Content Creator Agent',
                'description': 'Generates high-quality content, blog posts, social media, and marketing materials.',
                'category': 'Content',
                'icon': '✍️',
                'base_price': 77.00,
                'setup_fee': 147.00,
                'capabilities': ['blog_writing', 'social_content', 'copywriting', 'seo_content'],
                'integrations': ['wordpress', 'medium', 'buffer', 'hootsuite'],
                'prompt_template': 'You are a creative content creator focused on engaging and valuable content...'
            },
            {
                'name': 'Social Media Agent',
                'description': 'Manages social presence, engages with followers, and grows your online community.',
                'category': 'Social Media',
                'icon': '📱',
                'base_price': 67.00,
                'setup_fee': 97.00,
                'capabilities': ['post_scheduling', 'community_management', 'engagement_tracking', 'hashtag_optimization'],
                'integrations': ['facebook', 'instagram', 'twitter', 'tiktok'],
                'prompt_template': 'You are a social media agent focused on community building and engagement...'
            },
            {
                'name': 'Executive Assistant Agent',
                'description': 'Manages calendars, schedules meetings, handles correspondence, and organizes workflows.',
                'category': 'Administration',
                'icon': '📅',
                'base_price': 97.00,
                'setup_fee': 197.00,
                'capabilities': ['calendar_management', 'email_management', 'meeting_scheduling', 'task_organization'],
                'integrations': ['google_calendar', 'outlook', 'calendly', 'zoom'],
                'prompt_template': 'You are an executive assistant focused on organization and productivity...'
            },
            {
                'name': 'Data Analyst Agent',
                'description': 'Analyzes business data, creates reports, identifies trends, and provides actionable insights.',
                'category': 'Analytics',
                'icon': '📊',
                'base_price': 127.00,
                'setup_fee': 297.00,
                'capabilities': ['data_analysis', 'report_generation', 'trend_identification', 'predictive_analytics'],
                'integrations': ['google_analytics', 'tableau', 'powerbi', 'excel'],
                'prompt_template': 'You are a data analyst focused on extracting insights from business data...'
            },
            {
                'name': 'Automation Engineer Agent',
                'description': 'Builds workflows, integrates systems, and automates repetitive business processes.',
                'category': 'Automation',
                'icon': '⚙️',
                'base_price': 157.00,
                'setup_fee': 397.00,
                'capabilities': ['workflow_automation', 'system_integration', 'process_optimization', 'api_management'],
                'integrations': ['zapier', 'integromat', 'microsoft_flow', 'ifttt'],
                'prompt_template': 'You are an automation engineer focused on streamlining business processes...'
            },
            {
                'name': 'SŌL (Soul) Orchestrator',
                'description': 'The master AI that coordinates all agents, manages complex workflows, and provides unified intelligence.',
                'category': 'Orchestration',
                'icon': '🧠',
                'base_price': 297.00,
                'setup_fee': 597.00,
                'capabilities': ['agent_orchestration', 'workflow_management', 'decision_making', 'strategic_planning'],
                'integrations': ['all_harmonix_agents', 'external_apis', 'business_systems'],
                'prompt_template': 'You are SŌL, the master orchestrator that coordinates all HARMONIX agents...',
                'is_featured': True
            }
        ]
        
        for agent_data in agents_data:
            existing_agent = Agent.query.filter_by(name=agent_data['name']).first()
            if not existing_agent:
                agent = Agent(**agent_data)
                db.session.add(agent)
                print(f"✓ Created agent: {agent_data['name']}")
        
        db.session.commit()
        print("✓ Agent data seeded successfully")

def seed_agent_templates(app):
    """Seed agent templates"""
    with app.app_context():
        print("Seeding agent templates...")
        
        templates_data = [
            {
                'name': 'E-commerce Sales Agent',
                'description': 'Specialized sales agent for e-commerce businesses with product recommendations and cart recovery.',
                'category': 'Sales',
                'tags': ['ecommerce', 'retail', 'sales'],
                'prompt_template': 'You are an e-commerce sales specialist focused on product recommendations and conversion optimization...',
                'capabilities': ['product_recommendations', 'cart_recovery', 'upselling', 'customer_segmentation'],
                'integrations': ['shopify', 'woocommerce', 'magento'],
                'is_featured': True
            },
            {
                'name': 'SaaS Customer Success Agent',
                'description': 'Customer success agent tailored for SaaS companies with onboarding and retention focus.',
                'category': 'Support',
                'tags': ['saas', 'customer_success', 'retention'],
                'prompt_template': 'You are a SaaS customer success agent focused on user onboarding and retention...',
                'capabilities': ['user_onboarding', 'feature_adoption', 'churn_prevention', 'usage_analytics'],
                'integrations': ['intercom', 'mixpanel', 'amplitude'],
                'is_featured': True
            },
            {
                'name': 'Real Estate Lead Agent',
                'description': 'Real estate focused agent for lead generation and client relationship management.',
                'category': 'Sales',
                'tags': ['real_estate', 'leads', 'crm'],
                'prompt_template': 'You are a real estate agent focused on lead generation and client relationships...',
                'capabilities': ['lead_qualification', 'property_matching', 'market_analysis', 'client_communication'],
                'integrations': ['mls', 'zillow', 'realtor_com']
            }
        ]
        
        for template_data in templates_data:
            existing_template = AgentTemplate.query.filter_by(name=template_data['name']).first()
            if not existing_template:
                template = AgentTemplate(**template_data)
                db.session.add(template)
                print(f"✓ Created template: {template_data['name']}")
        
        db.session.commit()
        print("✓ Agent templates seeded successfully")

def create_admin_user(app):
    """Create admin user for testing"""
    with app.app_context():
        print("Creating admin user...")
        
        admin_email = 'admin@harmonix.com'
        existing_admin = User.query.filter_by(email=admin_email).first()
        
        if not existing_admin:
            admin_user = User(
                name='HARMONIX Admin',
                email=admin_email,
                status='active',
                email_verified=True,
                terms_accepted_at=datetime.utcnow(),
                privacy_accepted_at=datetime.utcnow()
            )
            admin_user.set_password('AdminPassword123!')
            
            db.session.add(admin_user)
            db.session.commit()
            print(f"✓ Admin user created: {admin_email} / AdminPassword123!")
        else:
            print(f"✓ Admin user already exists: {admin_email}")

def create_demo_user(app):
    """Create demo user for testing"""
    with app.app_context():
        print("Creating demo user...")
        
        demo_email = 'demo@harmonix.com'
        existing_demo = User.query.filter_by(email=demo_email).first()
        
        if not existing_demo:
            demo_user = User(
                name='Demo User',
                email=demo_email,
                status='trial',
                email_verified=True,
                company='Demo Company',
                industry='Technology',
                team_size='1-10',
                terms_accepted_at=datetime.utcnow(),
                privacy_accepted_at=datetime.utcnow()
            )
            demo_user.set_password('DemoPassword123!')
            demo_user.start_trial()
            
            db.session.add(demo_user)
            db.session.commit()
            print(f"✓ Demo user created: {demo_email} / DemoPassword123!")
        else:
            print(f"✓ Demo user already exists: {demo_email}")

def main():
    """Main initialization function"""
    print("🚀 Initializing HARMONIX Database...")
    print("=" * 50)
    
    app = create_app()
    
    try:
        # Create tables
        create_tables(app)
        
        # Seed data
        seed_agents(app)
        seed_agent_templates(app)
        
        # Create test users
        create_admin_user(app)
        create_demo_user(app)
        
        print("=" * 50)
        print("✅ Database initialization completed successfully!")
        print("\nTest Accounts:")
        print("Admin: admin@harmonix.com / AdminPassword123!")
        print("Demo:  demo@harmonix.com / DemoPassword123!")
        print("\nDatabase ready for development! 🎉")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

