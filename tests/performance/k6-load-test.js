import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter, Trend } from 'k6/metrics';

// Custom metrics for Harmonix platform
export const errorRate = new Rate('harmonix_errors');
export const agentCreationTime = new Trend('agent_creation_duration');
export const solBrainResponseTime = new Trend('sol_brain_response_duration');
export const tokenTransactionCount = new Counter('token_transactions');

// Test configuration optimized for Harmonix workloads
export const options = {
  stages: [
    { duration: '1m', target: 5 },   // Warm up
    { duration: '3m', target: 15 },  // Ramp up to normal load
    { duration: '5m', target: 15 },  // Stay at normal load
    { duration: '2m', target: 30 },  // Peak load simulation
    { duration: '3m', target: 30 },  // Sustain peak load
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests under 1s
    http_req_failed: ['rate<0.05'],    // Error rate under 5%
    harmonix_errors: ['rate<0.05'],    // Custom error rate under 5%
    agent_creation_duration: ['p(90)<2000'], // Agent creation under 2s
    sol_brain_response_duration: ['p(95)<3000'], // SŌL brain under 3s
  },
};

// Environment configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const WS_URL = __ENV.WS_URL || 'ws://localhost:5000/ws';

// Test user data for Harmonix
const TEST_USERS = [
  {
    name: 'Performance Test User 1',
    email: 'perf1@harmonix.digital',
    password: 'HarmonixTest123!',
    company: 'Test Corp',
    industry: 'Technology',
    teamSize: '10-50'
  },
  {
    name: 'Performance Test User 2', 
    email: 'perf2@harmonix.digital',
    password: 'HarmonixTest123!',
    company: 'Innovation Labs',
    industry: 'Consulting',
    teamSize: '50-200'
  }
];

// Agent types for testing
const AGENT_TYPES = [
  { name: 'Sales Agent', type: 'sales', category: 'flagship' },
  { name: 'HR Assistant', type: 'hr', category: 'flagship' },
  { name: 'Content Creator', type: 'content', category: 'next-wave' },
  { name: 'Finance Agent', type: 'finance', category: 'next-wave' },
  { name: 'Executive Assistant', type: 'executive', category: 'flagship' }
];

// Helper functions
function getRandomUser() {
  return TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];
}

function getRandomAgentType() {
  return AGENT_TYPES[Math.floor(Math.random() * AGENT_TYPES.length)];
}

function authenticate() {
  const user = getRandomUser();
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: user.email,
    password: user.password
  }), {
    headers: { 'Content-Type': 'application/json' },
    timeout: '10s'
  });

  const success = check(loginResponse, {
    'authentication successful': (r) => r.status === 200,
    'auth response time acceptable': (r) => r.timings.duration < 2000,
    'token received': (r) => r.json('token') !== undefined,
  });

  if (!success) {
    errorRate.add(1);
    return null;
  }

  return loginResponse.json('token');
}

// Main test scenarios
export default function () {
  const scenarios = [
    userJourneyTest,
    agentManagementTest,
    solBrainInteractionTest,
    tokenEconomyTest,
    marketplaceTest
  ];

  // Randomly select a scenario to simulate diverse user behavior
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario();
  
  sleep(Math.random() * 3 + 1); // Random sleep between 1-4 seconds
}

// Scenario 1: Complete user journey
function userJourneyTest() {
  // Health check
  const healthResponse = http.get(`${BASE_URL}/health`);
  check(healthResponse, {
    'health check ok': (r) => r.status === 200,
    'health response fast': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  // Authentication
  const token = authenticate();
  if (!token) return;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Get user profile
  const profileResponse = http.get(`${BASE_URL}/api/auth/me`, { headers });
  check(profileResponse, {
    'profile retrieval successful': (r) => r.status === 200,
  }) || errorRate.add(1);

  // Dashboard stats
  const statsResponse = http.get(`${BASE_URL}/api/analytics/stats`, { headers });
  check(statsResponse, {
    'dashboard stats loaded': (r) => r.status === 200,
    'stats response time acceptable': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
}

// Scenario 2: Agent management operations
function agentManagementTest() {
  const token = authenticate();
  if (!token) return;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Get available agent types
  const agentTypesResponse = http.get(`${BASE_URL}/api/agent-types`, { headers });
  check(agentTypesResponse, {
    'agent types loaded': (r) => r.status === 200,
  }) || errorRate.add(1);

  // Create new agent
  const agentType = getRandomAgentType();
  const agentData = {
    name: `${agentType.name} ${Date.now()}`,
    agentTypeId: 1, // Assuming ID 1 exists
    customPrompt: `You are a ${agentType.type} agent specialized in helping users.`,
    isActive: true
  };

  const createStart = Date.now();
  const createResponse = http.post(`${BASE_URL}/api/agents`, JSON.stringify(agentData), { headers });
  const createDuration = Date.now() - createStart;
  
  agentCreationTime.add(createDuration);
  
  const agentCreated = check(createResponse, {
    'agent creation successful': (r) => r.status === 200 || r.status === 201,
    'agent creation under 3s': (r) => r.timings.duration < 3000,
  });

  if (!agentCreated) {
    errorRate.add(1);
    return;
  }

  const agentId = createResponse.json('id');

  // Get created agent
  if (agentId) {
    const getAgentResponse = http.get(`${BASE_URL}/api/agents/${agentId}`, { headers });
    check(getAgentResponse, {
      'agent retrieval successful': (r) => r.status === 200,
    }) || errorRate.add(1);

    // Update agent
    const updateData = { ...agentData, customPrompt: 'Updated prompt for testing' };
    const updateResponse = http.put(`${BASE_URL}/api/agents/${agentId}`, JSON.stringify(updateData), { headers });
    check(updateResponse, {
      'agent update successful': (r) => r.status === 200,
    }) || errorRate.add(1);
  }
}

// Scenario 3: SŌL brain interaction
function solBrainInteractionTest() {
  const token = authenticate();
  if (!token) return;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // SŌL brain analysis request
  const solData = {
    query: 'Analyze my business needs for AI automation',
    context: {
      industry: 'Technology',
      teamSize: '10-50',
      challenges: ['lead generation', 'customer support', 'content creation']
    }
  };

  const solStart = Date.now();
  const solResponse = http.post(`${BASE_URL}/api/sol/analyze`, JSON.stringify(solData), { 
    headers,
    timeout: '15s' // SŌL brain may take longer
  });
  const solDuration = Date.now() - solStart;
  
  solBrainResponseTime.add(solDuration);

  check(solResponse, {
    'sol brain analysis successful': (r) => r.status === 200,
    'sol brain response contains recommendations': (r) => {
      try {
        const response = r.json();
        return response.recommendations && response.recommendations.length > 0;
      } catch {
        return false;
      }
    }
  }) || errorRate.add(1);
}

// Scenario 4: Token economy operations
function tokenEconomyTest() {
  const token = authenticate();
  if (!token) return;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Get token balance
  const balanceResponse = http.get(`${BASE_URL}/api/tokens/balance`, { headers });
  check(balanceResponse, {
    'token balance retrieved': (r) => r.status === 200,
  }) || errorRate.add(1);

  // Get token transactions
  const transactionsResponse = http.get(`${BASE_URL}/api/token-transactions`, { headers });
  check(transactionsResponse, {
    'token transactions loaded': (r) => r.status === 200,
  }) || errorRate.add(1);

  // Simulate token usage (create task)
  const taskData = {
    title: 'Performance Test Task',
    description: 'Testing token consumption',
    agentId: 1, // Assuming agent exists
    input: { message: 'Hello, this is a performance test' }
  };

  const taskResponse = http.post(`${BASE_URL}/api/tasks`, JSON.stringify(taskData), { headers });
  if (check(taskResponse, {
    'task creation successful': (r) => r.status === 200 || r.status === 201,
  })) {
    tokenTransactionCount.add(1);
  } else {
    errorRate.add(1);
  }
}

// Scenario 5: Marketplace browsing
function marketplaceTest() {
  // Marketplace doesn't require authentication for browsing
  const marketplaceResponse = http.get(`${BASE_URL}/api/marketplace/agents`);
  check(marketplaceResponse, {
    'marketplace loaded': (r) => r.status === 200,
    'marketplace response fast': (r) => r.timings.duration < 800,
  }) || errorRate.add(1);

  // Get specific agent category
  const categories = ['sales', 'hr', 'content', 'finance'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  const categoryResponse = http.get(`${BASE_URL}/api/marketplace/agents?category=${category}`);
  check(categoryResponse, {
    'category filtering works': (r) => r.status === 200,
  }) || errorRate.add(1);

  // Search marketplace
  const searchResponse = http.get(`${BASE_URL}/api/marketplace/agents?search=sales`);
  check(searchResponse, {
    'marketplace search works': (r) => r.status === 200,
  }) || errorRate.add(1);
}

// Setup phase
export function setup() {
  console.log('🚀 Starting HARMONIX Platform Performance Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`🎯 Target scenarios: User Journey, Agent Management, SŌL Brain, Token Economy, Marketplace`);
  
  // Create test users
  TEST_USERS.forEach((user, index) => {
    const signupResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
      ...user,
      acceptTerms: true
    }), {
      headers: { 'Content-Type': 'application/json' },
      timeout: '10s'
    });
    
    if (signupResponse.status === 201 || signupResponse.status === 400) {
      console.log(`✅ Test user ${index + 1} ready`);
    } else {
      console.log(`⚠️  Warning: Could not prepare test user ${index + 1}`);
    }
  });

  return { startTime: new Date().toISOString() };
}

// Teardown phase
export function teardown(data) {
  console.log('🏁 HARMONIX Platform Performance Tests Completed');
  console.log(`⏱️  Test duration: ${new Date().toISOString()} - ${data.startTime}`);
  console.log('📊 Check the metrics for detailed performance insights');
}