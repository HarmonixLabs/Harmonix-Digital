import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { storage } from '../server/storage';

// Test configuration for Harmonix platform
export const TEST_CONFIG = {
  JWT_SECRET: 'test-harmonix-secret-key',
  DATABASE_URL: 'sqlite:///:memory:',
  OPENAI_API_KEY: 'test-openai-key',
  STRIPE_SECRET_KEY: 'sk_test_fake_harmonix_key',
  GHL_API_KEY: 'test-ghl-harmonix-key',
  NODE_ENV: 'test'
};

// Set test environment variables
beforeAll(async () => {
  Object.entries(TEST_CONFIG).forEach(([key, value]) => {
    process.env[key] = value;
  });
  
  // Initialize test database and storage
  try {
    await storage.initialize?.();
    console.log('✅ Test database initialized');
  } catch (error) {
    console.log('⚠️ Database initialization skipped:', error.message);
  }
});

afterAll(async () => {
  // Cleanup test database
  try {
    await storage.cleanup?.();
    console.log('✅ Test database cleaned up');
  } catch (error) {
    console.log('⚠️ Database cleanup skipped:', error.message);
  }
});

beforeEach(async () => {
  // Reset database state before each test
  try {
    await storage.reset?.();
  } catch (error) {
    // Silent fail for optional reset
  }
});

afterEach(async () => {
  // Clean up after each test
  try {
    await storage.cleanup?.();
  } catch (error) {
    // Silent fail for optional cleanup
  }
});

// Test app factory for Harmonix platform
export async function createTestApp() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  const server = await registerRoutes(app);
  
  return { app, server };
}

// Harmonix-specific mock data generators
export const mockHarmonixUser = {
  name: 'Harmonix Test User',
  email: 'test@harmonix.digital',
  password: 'HarmonixSecure123!',
  phone: '+1-555-HARMONIX',
  company: 'Digital Transformation Corp',
  industry: 'Technology Consulting',
  teamSize: '10-50',
  marketingConsent: true,
  smsConsent: false,
  acceptTerms: true,
  onboardingData: JSON.stringify({
    businessGoals: ['automation', 'efficiency', 'growth'],
    currentChallenges: ['manual_processes', 'lead_generation', 'customer_support'],
    techStack: ['CRM', 'Email Marketing', 'Social Media'],
    budget: 'enterprise'
  })
};

export const mockAgentTypes = [
  {
    name: 'CA$H Sales Agent',
    description: 'Elite sales automation with SŌL brain integration',
    category: 'sales',
    tier: 'flagship',
    basePrompt: 'You are CA$H, an elite sales agent powered by the SŌL brain engine.',
    capabilities: ['lead_generation', 'crm_sync', 'loom_scripts', 'pipeline_management'],
    tokenCost: 5,
    xpMultiplier: 1.5
  },
  {
    name: 'Concierge Agent',
    description: 'Premium customer service and support automation',
    category: 'concierge',
    tier: 'flagship',
    basePrompt: 'You are a premium concierge agent providing exceptional customer service.',
    capabilities: ['customer_support', 'ticket_management', 'escalation_handling'],
    tokenCost: 3,
    xpMultiplier: 1.2
  },
  {
    name: 'Content Creation Agent',
    description: 'AI-powered content generation and marketing automation',
    category: 'content',
    tier: 'next-wave',
    basePrompt: 'You are a creative content agent specializing in marketing materials.',
    capabilities: ['content_creation', 'social_media', 'copywriting'],
    tokenCost: 4,
    xpMultiplier: 1.3
  }
];

export const mockAgent = {
  name: 'Test Sales Agent',
  agentTypeId: 1,
  customPrompt: 'You are a helpful sales assistant for testing purposes.',
  isActive: true
};

export const mockTask = {
  title: 'Test Agent Task',
  description: 'Testing agent processing capabilities',
  agentId: 1,
  input: { 
    message: 'Hello, can you help me with lead qualification?',
    context: 'enterprise_lead',
    priority: 'high'
  }
};

export const mockOrganization = {
  name: 'Test Organization',
  slug: 'test-org-harmonix',
  planType: 'trial',
  tokenQuota: 1000,
  tokensUsed: 0
};

// Helper functions for Harmonix testing
export function createAuthHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Harmonix-Client': 'test-suite'
  };
}

export function generateTestEmail() {
  return `test-${Date.now()}@harmonix.digital`;
}

export function generateAgentName(type: string = 'sales') {
  return `Test-${type}-Agent-${Date.now()}`;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Harmonix-specific validation helpers
export function validateHarmonixResponse(response: any) {
  return {
    hasSuccess: typeof response.success === 'boolean',
    hasData: response.data !== undefined,
    hasMessage: typeof response.message === 'string',
    isValidStructure: response.success !== undefined && 
                     (response.data !== undefined || response.error !== undefined)
  };
}

export function validateAgentResponse(agent: any) {
  const requiredFields = ['id', 'name', 'agentTypeId', 'organizationId', 'isActive'];
  return requiredFields.every(field => agent[field] !== undefined);
}

export function validateTokenTransaction(transaction: any) {
  const requiredFields = ['id', 'userId', 'organizationId', 'type', 'amount', 'description'];
  return requiredFields.every(field => transaction[field] !== undefined);
}

// Mock WebSocket for real-time testing
export class MockWebSocket {
  private listeners: Map<string, Function[]> = new Map();
  
  addEventListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  removeEventListener(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback({ data: JSON.stringify(data) }));
    }
  }
  
  close() {
    this.listeners.clear();
  }
}

// Performance testing utilities
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  startTimer(operation: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, []);
      }
      this.metrics.get(operation)!.push(duration);
      return duration;
    };
  }
  
  getMetrics(operation: string) {
    const times = this.metrics.get(operation) || [];
    if (times.length === 0) return null;
    
    const sum = times.reduce((a, b) => a + b, 0);
    const sorted = [...times].sort((a, b) => a - b);
    
    return {
      count: times.length,
      average: sum / times.length,
      median: sorted[Math.floor(sorted.length / 2)],
      min: Math.min(...times),
      max: Math.max(...times),
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }
  
  reset() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();