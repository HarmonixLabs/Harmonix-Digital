import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
export const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
    errors: ['rate<0.1'],             // Custom error rate must be below 10%
  },
};

// Test data
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const TEST_USER = {
  email: 'test@harmonix.digital',
  password: 'TestPassword123!',
  name: 'Test User'
};

// Helper function to generate random agent data
function generateAgentData() {
  return {
    name: `TestAgent_${Math.random().toString(36).substr(2, 9)}`,
    type: ['sales', 'concierge', 'hr', 'content'][Math.floor(Math.random() * 4)],
    description: 'Automated test agent',
    configuration: {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000
    }
  };
}

// Authentication helper
function authenticate() {
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: TEST_USER.email,
    password: TEST_USER.password
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'login successful': (r) => r.status === 200,
    'login returns token': (r) => r.json('access_token') !== undefined,
  }) || errorRate.add(1);

  return loginResponse.json('access_token');
}

// Main test function
export default function () {
  // Test 1: Health Check
  const healthResponse = http.get(`${BASE_URL}/api/health`);
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  // Test 2: Authentication
  const token = authenticate();
  if (!token) {
    errorRate.add(1);
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Test 3: Agent Creation
  const agentData = generateAgentData();
  const createAgentResponse = http.post(
    `${BASE_URL}/api/agents`,
    JSON.stringify(agentData),
    { headers }
  );

  check(createAgentResponse, {
    'agent creation successful': (r) => r.status === 201,
    'agent creation response time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  const agentId = createAgentResponse.json('id');

  // Test 4: Agent Retrieval
  if (agentId) {
    const getAgentResponse = http.get(`${BASE_URL}/api/agents/${agentId}`, { headers });
    check(getAgentResponse, {
      'agent retrieval successful': (r) => r.status === 200,
      'agent data matches': (r) => r.json('name') === agentData.name,
    }) || errorRate.add(1);

    // Test 5: Agent Update
    const updateData = { ...agentData, description: 'Updated test agent' };
    const updateAgentResponse = http.put(
      `${BASE_URL}/api/agents/${agentId}`,
      JSON.stringify(updateData),
      { headers }
    );

    check(updateAgentResponse, {
      'agent update successful': (r) => r.status === 200,
    }) || errorRate.add(1);

    // Test 6: Agent Demo Execution
    const demoResponse = http.post(
      `${BASE_URL}/api/agents/${agentId}/demo`,
      JSON.stringify({ message: 'Hello, this is a test message' }),
      { headers }
    );

    check(demoResponse, {
      'demo execution successful': (r) => r.status === 200,
      'demo response time < 5s': (r) => r.timings.duration < 5000,
    }) || errorRate.add(1);

    // Test 7: Agent Deletion
    const deleteAgentResponse = http.del(`${BASE_URL}/api/agents/${agentId}`, { headers });
    check(deleteAgentResponse, {
      'agent deletion successful': (r) => r.status === 204,
    }) || errorRate.add(1);
  }

  // Test 8: Dashboard Data
  const dashboardResponse = http.get(`${BASE_URL}/api/dashboard/stats`, { headers });
  check(dashboardResponse, {
    'dashboard data retrieval successful': (r) => r.status === 200,
    'dashboard response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  // Test 9: Marketplace Listing
  const marketplaceResponse = http.get(`${BASE_URL}/api/marketplace/agents`);
  check(marketplaceResponse, {
    'marketplace listing successful': (r) => r.status === 200,
    'marketplace response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  // Test 10: Billing Information
  const billingResponse = http.get(`${BASE_URL}/api/billing/subscription`, { headers });
  check(billingResponse, {
    'billing info retrieval successful': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1); // Wait 1 second between iterations
}

// Setup function (runs once before all VUs)
export function setup() {
  console.log('Starting HARMONIX Platform Performance Tests');
  console.log(`Base URL: ${BASE_URL}`);
  
  // Create test user if needed
  const signupResponse = http.post(`${BASE_URL}/api/auth/signup`, JSON.stringify(TEST_USER), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (signupResponse.status === 201 || signupResponse.status === 409) {
    console.log('Test user ready');
  } else {
    console.log('Warning: Could not create test user');
  }
}

// Teardown function (runs once after all VUs)
export function teardown() {
  console.log('HARMONIX Platform Performance Tests Completed');
}

