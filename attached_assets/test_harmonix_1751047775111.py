import pytest
import json
from unittest.mock import Mock, patch
from flask import Flask
from src.main import create_app
from src.models.user import User, Agent, AgentThread
from src.lib.auth import generate_token, verify_token
from src.lib.ghl import GoHighLevelService
from src.lib.stripe_service import StripeService

# Test configuration
@pytest.fixture
def app():
    """Create and configure a test Flask app."""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key",
        "STRIPE_SECRET_KEY": "sk_test_fake_key",
        "GHL_API_KEY": "test-ghl-key"
    })
    
    with app.app_context():
        from src.models.user import db
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """Create a test client."""
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    """Create authentication headers for testing."""
    # Create test user
    user_data = {
        "name": "Test User",
        "email": "test@harmonix.digital",
        "password": "TestPassword123!"
    }
    
    response = client.post('/api/auth/signup', 
                          data=json.dumps(user_data),
                          content_type='application/json')
    
    # Login to get token
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    
    response = client.post('/api/auth/login',
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}

class TestAuthRoutes:
    """Test authentication routes."""
    
    def test_signup_success(self, client):
        """Test successful user registration."""
        user_data = {
            "name": "New User",
            "email": "newuser@harmonix.digital",
            "password": "NewPassword123!"
        }
        
        response = client.post('/api/auth/signup',
                              data=json.dumps(user_data),
                              content_type='application/json')
        
        assert response.status_code == 201
        assert 'access_token' in response.json
        assert response.json['user']['email'] == user_data['email']
    
    def test_signup_duplicate_email(self, client):
        """Test registration with duplicate email."""
        user_data = {
            "name": "Test User",
            "email": "test@harmonix.digital",
            "password": "TestPassword123!"
        }
        
        # First registration
        client.post('/api/auth/signup',
                   data=json.dumps(user_data),
                   content_type='application/json')
        
        # Second registration with same email
        response = client.post('/api/auth/signup',
                              data=json.dumps(user_data),
                              content_type='application/json')
        
        assert response.status_code == 409
        assert 'already exists' in response.json['message']
    
    def test_login_success(self, client):
        """Test successful login."""
        # Create user first
        user_data = {
            "name": "Test User",
            "email": "test@harmonix.digital",
            "password": "TestPassword123!"
        }
        
        client.post('/api/auth/signup',
                   data=json.dumps(user_data),
                   content_type='application/json')
        
        # Login
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        response = client.post('/api/auth/login',
                              data=json.dumps(login_data),
                              content_type='application/json')
        
        assert response.status_code == 200
        assert 'access_token' in response.json
    
    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        login_data = {
            "email": "nonexistent@harmonix.digital",
            "password": "WrongPassword123!"
        }
        
        response = client.post('/api/auth/login',
                              data=json.dumps(login_data),
                              content_type='application/json')
        
        assert response.status_code == 401
        assert 'Invalid credentials' in response.json['message']

class TestAgentRoutes:
    """Test agent management routes."""
    
    def test_create_agent_success(self, client, auth_headers):
        """Test successful agent creation."""
        agent_data = {
            "name": "Test Sales Agent",
            "type": "sales",
            "description": "A test sales agent",
            "configuration": {
                "model": "gpt-4",
                "temperature": 0.7,
                "max_tokens": 1000
            }
        }
        
        response = client.post('/api/agents',
                              data=json.dumps(agent_data),
                              content_type='application/json',
                              headers=auth_headers)
        
        assert response.status_code == 201
        assert response.json['name'] == agent_data['name']
        assert response.json['type'] == agent_data['type']
    
    def test_get_agent_success(self, client, auth_headers):
        """Test successful agent retrieval."""
        # Create agent first
        agent_data = {
            "name": "Test Agent",
            "type": "concierge",
            "description": "Test agent"
        }
        
        create_response = client.post('/api/agents',
                                     data=json.dumps(agent_data),
                                     content_type='application/json',
                                     headers=auth_headers)
        
        agent_id = create_response.json['id']
        
        # Get agent
        response = client.get(f'/api/agents/{agent_id}',
                             headers=auth_headers)
        
        assert response.status_code == 200
        assert response.json['name'] == agent_data['name']
    
    def test_update_agent_success(self, client, auth_headers):
        """Test successful agent update."""
        # Create agent first
        agent_data = {
            "name": "Original Agent",
            "type": "hr",
            "description": "Original description"
        }
        
        create_response = client.post('/api/agents',
                                     data=json.dumps(agent_data),
                                     content_type='application/json',
                                     headers=auth_headers)
        
        agent_id = create_response.json['id']
        
        # Update agent
        update_data = {
            "name": "Updated Agent",
            "description": "Updated description"
        }
        
        response = client.put(f'/api/agents/{agent_id}',
                             data=json.dumps(update_data),
                             content_type='application/json',
                             headers=auth_headers)
        
        assert response.status_code == 200
        assert response.json['name'] == update_data['name']
        assert response.json['description'] == update_data['description']
    
    def test_delete_agent_success(self, client, auth_headers):
        """Test successful agent deletion."""
        # Create agent first
        agent_data = {
            "name": "Agent to Delete",
            "type": "content",
            "description": "Will be deleted"
        }
        
        create_response = client.post('/api/agents',
                                     data=json.dumps(agent_data),
                                     content_type='application/json',
                                     headers=auth_headers)
        
        agent_id = create_response.json['id']
        
        # Delete agent
        response = client.delete(f'/api/agents/{agent_id}',
                                headers=auth_headers)
        
        assert response.status_code == 204
        
        # Verify deletion
        get_response = client.get(f'/api/agents/{agent_id}',
                                 headers=auth_headers)
        assert get_response.status_code == 404

class TestDemoRoutes:
    """Test demo functionality routes."""
    
    @patch('src.routes.demo.openai.ChatCompletion.create')
    def test_agent_demo_success(self, mock_openai, client, auth_headers):
        """Test successful agent demo execution."""
        # Mock OpenAI response
        mock_openai.return_value = {
            'choices': [{
                'message': {
                    'content': 'Hello! I am a sales agent. How can I help you today?'
                }
            }]
        }
        
        # Create agent first
        agent_data = {
            "name": "Demo Agent",
            "type": "sales",
            "description": "Demo agent for testing"
        }
        
        create_response = client.post('/api/agents',
                                     data=json.dumps(agent_data),
                                     content_type='application/json',
                                     headers=auth_headers)
        
        agent_id = create_response.json['id']
        
        # Execute demo
        demo_data = {
            "message": "Hello, can you help me with sales?"
        }
        
        response = client.post(f'/api/agents/{agent_id}/demo',
                              data=json.dumps(demo_data),
                              content_type='application/json',
                              headers=auth_headers)
        
        assert response.status_code == 200
        assert 'response' in response.json
        assert len(response.json['response']) > 0

class TestHealthRoutes:
    """Test health monitoring routes."""
    
    def test_health_check(self, client):
        """Test basic health check."""
        response = client.get('/api/health')
        
        assert response.status_code == 200
        assert response.json['status'] == 'healthy'
        assert 'timestamp' in response.json
    
    def test_detailed_health_check(self, client, auth_headers):
        """Test detailed health check with authentication."""
        response = client.get('/api/health/detailed',
                             headers=auth_headers)
        
        assert response.status_code == 200
        assert 'database' in response.json
        assert 'redis' in response.json
        assert 'external_apis' in response.json

class TestUtilityFunctions:
    """Test utility functions."""
    
    def test_generate_token(self):
        """Test JWT token generation."""
        user_id = 123
        token = generate_token(user_id)
        
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_verify_token(self):
        """Test JWT token verification."""
        user_id = 123
        token = generate_token(user_id)
        
        decoded_user_id = verify_token(token)
        assert decoded_user_id == user_id
    
    def test_verify_invalid_token(self):
        """Test verification of invalid token."""
        invalid_token = "invalid.token.here"
        
        result = verify_token(invalid_token)
        assert result is None

class TestGoHighLevelIntegration:
    """Test GoHighLevel integration."""
    
    @patch('src.lib.ghl.requests.post')
    def test_create_contact_success(self, mock_post):
        """Test successful contact creation in GHL."""
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            'contact': {'id': 'ghl_contact_123'}
        }
        
        ghl_service = GoHighLevelService('test-api-key')
        
        contact_data = {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'john.doe@example.com',
            'phone': '+1234567890'
        }
        
        result = ghl_service.create_contact(contact_data)
        
        assert result['success'] is True
        assert 'contact_id' in result
    
    @patch('src.lib.ghl.requests.post')
    def test_create_contact_failure(self, mock_post):
        """Test failed contact creation in GHL."""
        mock_post.return_value.status_code = 400
        mock_post.return_value.json.return_value = {
            'error': 'Invalid email format'
        }
        
        ghl_service = GoHighLevelService('test-api-key')
        
        contact_data = {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'invalid-email',
            'phone': '+1234567890'
        }
        
        result = ghl_service.create_contact(contact_data)
        
        assert result['success'] is False
        assert 'error' in result

class TestStripeIntegration:
    """Test Stripe integration."""
    
    @patch('src.lib.stripe_service.stripe.Customer.create')
    def test_create_customer_success(self, mock_create):
        """Test successful Stripe customer creation."""
        mock_create.return_value = Mock(id='cus_test123')
        
        stripe_service = StripeService('sk_test_fake_key')
        
        customer_data = {
            'email': 'customer@example.com',
            'name': 'Test Customer'
        }
        
        result = stripe_service.create_customer(customer_data)
        
        assert result['success'] is True
        assert result['customer_id'] == 'cus_test123'
    
    @patch('src.lib.stripe_service.stripe.Subscription.create')
    def test_create_subscription_success(self, mock_create):
        """Test successful subscription creation."""
        mock_create.return_value = Mock(
            id='sub_test123',
            status='active',
            current_period_end=1234567890
        )
        
        stripe_service = StripeService('sk_test_fake_key')
        
        subscription_data = {
            'customer': 'cus_test123',
            'price': 'price_test123'
        }
        
        result = stripe_service.create_subscription(subscription_data)
        
        assert result['success'] is True
        assert result['subscription_id'] == 'sub_test123'

class TestDatabaseModels:
    """Test database models."""
    
    def test_user_model_creation(self, app):
        """Test User model creation."""
        with app.app_context():
            user = User(
                name="Test User",
                email="test@example.com",
                password_hash="hashed_password"
            )
            
            assert user.name == "Test User"
            assert user.email == "test@example.com"
            assert user.password_hash == "hashed_password"
    
    def test_agent_model_creation(self, app):
        """Test Agent model creation."""
        with app.app_context():
            agent = Agent(
                name="Test Agent",
                type="sales",
                description="Test description",
                user_id=1
            )
            
            assert agent.name == "Test Agent"
            assert agent.type == "sales"
            assert agent.description == "Test description"
            assert agent.user_id == 1
    
    def test_agent_thread_model_creation(self, app):
        """Test AgentThread model creation."""
        with app.app_context():
            thread = AgentThread(
                agent_id=1,
                context_data={"messages": []},
                metadata={"created_by": "test"}
            )
            
            assert thread.agent_id == 1
            assert thread.context_data == {"messages": []}
            assert thread.metadata == {"created_by": "test"}

# Performance tests
class TestPerformance:
    """Test performance-related functionality."""
    
    def test_bulk_agent_creation(self, client, auth_headers):
        """Test creating multiple agents efficiently."""
        import time
        
        start_time = time.time()
        
        # Create 10 agents
        for i in range(10):
            agent_data = {
                "name": f"Bulk Agent {i}",
                "type": "sales",
                "description": f"Bulk created agent {i}"
            }
            
            response = client.post('/api/agents',
                                  data=json.dumps(agent_data),
                                  content_type='application/json',
                                  headers=auth_headers)
            
            assert response.status_code == 201
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Should complete within 5 seconds
        assert total_time < 5.0
    
    def test_concurrent_requests(self, client, auth_headers):
        """Test handling concurrent requests."""
        import threading
        import time
        
        results = []
        
        def make_request():
            response = client.get('/api/health', headers=auth_headers)
            results.append(response.status_code)
        
        # Create 5 concurrent threads
        threads = []
        for _ in range(5):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
        
        start_time = time.time()
        
        # Start all threads
        for thread in threads:
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # All requests should succeed
        assert all(status == 200 for status in results)
        # Should complete within 2 seconds
        assert total_time < 2.0

# Fixtures for test data cleanup
@pytest.fixture(autouse=True)
def cleanup_test_data(app):
    """Clean up test data after each test."""
    yield
    
    with app.app_context():
        from src.models.user import db
        # Clean up any test data if needed
        db.session.rollback()

if __name__ == '__main__':
    pytest.main(['-v', '--tb=short'])

