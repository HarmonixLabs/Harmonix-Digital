import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import { storage } from "./storage";
import { insertUserSchema, insertOrganizationSchema, insertAgentSchema, insertTaskSchema } from "@shared/schema";
import { z } from "zod";
import { processAgentTask } from "./openai";
import { updateCRM } from "./ghl-integration";
import { healthCheck, readinessCheck } from "./health-check";
import { corsMiddleware } from "./middleware/cors";

const JWT_SECRET = process.env.JWT_SECRET || "harmonix-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Apply CORS middleware
  app.use(corsMiddleware);

  // Health check endpoints
  app.get('/health', healthCheck);
  app.get('/health/ready', readinessCheck);
  
  // WebSocket setup for real-time updates with connection management
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    perMessageDeflate: false,
    maxPayload: 1024 * 1024 // 1MB max message size
  });
  
  // Connection rate limiting
  const connectionAttempts = new Map<string, { count: number; lastAttempt: number }>();
  
  wss.on('connection', (ws: WebSocket, req) => {
    const clientIP = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Rate limiting: max 3 connections per 10 seconds per IP
    const attempts = connectionAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    if (now - attempts.lastAttempt < 10000 && attempts.count >= 3) {
      ws.close(1008, 'Too many connection attempts');
      return;
    }
    
    connectionAttempts.set(clientIP, { count: attempts.count + 1, lastAttempt: now });
    console.log('WebSocket client connected');
    
    // Heartbeat mechanism
    let heartbeatInterval: NodeJS.Timeout;
    const startHeartbeat = () => {
      heartbeatInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        }
      }, 30000); // 30 second heartbeat
    };
    
    ws.on('pong', () => {
      // Client responded to ping
    });
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'user_identify':
            // Store user session info
            break;
          case 'sol_analyze':
            // Handle SŌL brain analysis requests
            break;
          default:
            console.log('Unhandled WebSocket message type:', data.type);
        }
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    });
    
    startHeartbeat();
  });

  // Helper function to broadcast to all connected clients
  const broadcast = (data: any) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create organization for the user
      const org = await storage.createOrganization({
        name: `${userData.name}'s Organization`,
        slug: `org-${Date.now()}`,
        planType: 'free',
        tokenQuota: 1000,
        tokensUsed: 0,
      });

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        organizationId: org.id,
        tokenBalance: 500, // Welcome bonus
      });

      // Update CRM with new contact and trigger GHL workflow
      console.log('Triggering CRM sync and workflow for new registration:', user.email);
      await updateCRM({
        email: user.email,
        name: user.name,
        phone: userData.phone,
        company: userData.company,
        source: 'Harmonix Platform Registration',
        interests: ['platform-signup'],
        activity: 'user-registration',
        tier: org.planType,
        timestamp: new Date().toISOString()
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: { ...user, password: undefined },
        organization: org,
        token,
        isNewUser: true,
        message: 'Registration successful'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: 'Invalid user data' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const organization = await storage.getOrganization(user.organizationId!);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: { ...user, password: undefined },
        organization,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const organization = await storage.getOrganization(req.user.organizationId!);
      res.json({
        user: { ...req.user, password: undefined },
        organization,
      });
    } catch (error) {
      console.error('Auth me error:', error);
      res.status(500).json({ message: 'Failed to get user data' });
    }
  });

  // Agent Types routes
  app.get('/api/agent-types', authenticateToken, async (req, res) => {
    try {
      const agentTypes = await storage.getAgentTypes();
      res.json(agentTypes);
    } catch (error) {
      console.error('Get agent types error:', error);
      res.status(500).json({ message: 'Failed to get agent types' });
    }
  });

  // Agents routes
  app.get('/api/agents', authenticateToken, async (req: any, res) => {
    try {
      const agents = await storage.getAgentsByOrganization(req.user.organizationId);
      res.json(agents);
    } catch (error) {
      console.error('Get agents error:', error);
      res.status(500).json({ message: 'Failed to get agents' });
    }
  });

  app.post('/api/agents', authenticateToken, async (req: any, res) => {
    try {
      const agentData = insertAgentSchema.parse({
        ...req.body,
        organizationId: req.user.organizationId,
      });

      const agent = await storage.createAgent(agentData);
      
      broadcast({
        type: 'agent_deployed',
        data: agent,
        organizationId: req.user.organizationId,
      });

      res.json(agent);
    } catch (error) {
      console.error('Create agent error:', error);
      res.status(400).json({ message: 'Invalid agent data' });
    }
  });

  app.put('/api/agents/:id', authenticateToken, async (req: any, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const agent = await storage.getAgent(agentId);
      
      if (!agent || agent.organizationId !== req.user.organizationId) {
        return res.status(404).json({ message: 'Agent not found' });
      }

      const updatedAgent = await storage.updateAgent(agentId, req.body);
      res.json(updatedAgent);
    } catch (error) {
      console.error('Update agent error:', error);
      res.status(400).json({ message: 'Failed to update agent' });
    }
  });

  app.delete('/api/agents/:id', authenticateToken, async (req: any, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const agent = await storage.getAgent(agentId);
      
      if (!agent || agent.organizationId !== req.user.organizationId) {
        return res.status(404).json({ message: 'Agent not found' });
      }

      await storage.deleteAgent(agentId);
      res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
      console.error('Delete agent error:', error);
      res.status(500).json({ message: 'Failed to delete agent' });
    }
  });

  // Tasks routes
  app.get('/api/tasks', authenticateToken, async (req: any, res) => {
    try {
      const tasks = await storage.getTasksByOrganization(req.user.organizationId);
      res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Failed to get tasks' });
    }
  });

  app.post('/api/tasks', authenticateToken, async (req: any, res) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        organizationId: req.user.organizationId,
        userId: req.user.id,
      });

      const task = await storage.createTask(taskData);
      
      // Process task with AI agent
      try {
        const agent = await storage.getAgent(task.agentId);
        const agentType = await storage.getAgentType(agent!.agentTypeId);
        
        broadcast({
          type: 'task_started',
          data: task,
          organizationId: req.user.organizationId,
        });

        // Process in background
        processAgentTask(task, agent!, agentType!, storage, broadcast).catch(console.error);
        
      } catch (error) {
        console.error('Task processing error:', error);
      }

      res.json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(400).json({ message: 'Invalid task data' });
    }
  });

  // Token transactions routes
  app.get('/api/token-transactions', authenticateToken, async (req: any, res) => {
    try {
      const transactions = await storage.getTokenTransactionsByOrganization(req.user.organizationId);
      res.json(transactions);
    } catch (error) {
      console.error('Get token transactions error:', error);
      res.status(500).json({ message: 'Failed to get token transactions' });
    }
  });

  app.post('/api/token-transactions', authenticateToken, async (req: any, res) => {
    try {
      const transactionData = {
        ...req.body,
        organizationId: req.user.organizationId,
        userId: req.user.id,
      };

      const transaction = await storage.createTokenTransaction(transactionData);
      
      // Update user token balance if it's a purchase
      if (transaction.type === 'purchase') {
        await storage.updateUser(req.user.id, {
          tokenBalance: req.user.tokenBalance + transaction.amount,
        });
      }

      res.json(transaction);
    } catch (error) {
      console.error('Create token transaction error:', error);
      res.status(400).json({ message: 'Invalid transaction data' });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', authenticateToken, async (req: any, res) => {
    try {
      const stats = await storage.getOrganizationStats(req.user.organizationId);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Failed to get organization stats' });
    }
  });

  // NFTs routes
  app.get('/api/nfts', authenticateToken, async (req: any, res) => {
    try {
      const nfts = await storage.getNftsByUser(req.user.id);
      res.json(nfts);
    } catch (error) {
      console.error('Get NFTs error:', error);
      res.status(500).json({ message: 'Failed to get NFTs' });
    }
  });

  // Onboarding completion route
  app.post('/api/onboarding/complete', authenticateToken, async (req: any, res) => {
    try {
      const { onboardingData } = req.body;
      const userId = req.user.id;

      // Update user with onboarding completion
      await storage.updateUser(userId, {
        onboardingCompleted: true,
        onboardingData: JSON.stringify(onboardingData),
      });

      // Create initial agents based on selections
      if (onboardingData.selectedAgents && onboardingData.selectedAgents.length > 0) {
        const agentTypes = await storage.getAgentTypes();
        
        for (const agentId of onboardingData.selectedAgents) {
          const agentType = agentTypes.find(t => 
            t.name.toLowerCase().includes(agentId) || 
            t.category === agentId
          );
          
          if (agentType) {
            await storage.createAgent({
              name: `${agentType.name} - ${req.user.name}`,
              agentTypeId: agentType.id,
              organizationId: req.user.organizationId,
              isActive: true,
              config: onboardingData
            });
          }
        }
      }

      // Update CRM with onboarding completion
      await updateCRM({
        email: req.user.email,
        name: req.user.name,
        activity: 'onboarding_completed',
        tier: onboardingData.tier,
        selectedAgents: onboardingData.selectedAgents,
        industry: onboardingData.industry,
        companySize: onboardingData.companySize,
        timestamp: new Date().toISOString()
      });

      res.json({ 
        success: true, 
        message: 'Onboarding completed successfully',
        redirectTo: '/dashboard'
      });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      res.status(500).json({ message: 'Failed to complete onboarding' });
    }
  });

  // Stripe payment routes
  app.post('/api/checkout/create-session', async (req, res) => {
    try {
      const { 
        tier, 
        customOptions, 
        industry, 
        useCase, 
        roiAdjustment = 0,
        promoCode,
        isDeposit = false 
      } = req.body;

      const pricingTiers = {
        starter: { setupFee: 440000, name: 'Harmony Starter Package' },
        growth: { setupFee: 800000, name: 'Harmony Growth Package' },
        expansion: { setupFee: 1500000, name: 'Harmony Expansion Package' },
        enterprise: { setupFee: 2150000, name: 'Harmony Enterprise Package' },
        deposit: { setupFee: 44400, name: 'Harmony Early Bird Deposit' }
      };

      const selectedTier = isDeposit ? 'deposit' : tier;
      const tierData = pricingTiers[selectedTier];
      
      if (!tierData) {
        return res.status(400).json({ error: 'Invalid tier selected' });
      }

      let finalAmount = tierData.setupFee;
      if (promoCode === 'EARLYBIRD30' || isDeposit) {
        finalAmount = Math.round(finalAmount * 0.7);
      }

      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Stripe not configured' });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: tierData.name,
              description: isDeposit 
                ? 'Early bird deposit - secure your 30% discount' 
                : `AI automation package with ${tier} tier agents`,
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/thank-you?payment=success&tier=${selectedTier}`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout?payment=cancelled`,
        metadata: {
          tier: selectedTier,
          industry: industry || '',
          useCase: useCase || '',
          promoCode: promoCode || '',
          isDeposit: isDeposit.toString(),
          originalAmount: tierData.setupFee.toString(),
          discountApplied: finalAmount < tierData.setupFee ? 'true' : 'false'
        },
        billing_address_collection: 'required',
        phone_number_collection: { enabled: true },
      });

      res.json({ 
        sessionId: session.id,
        url: session.url,
        amount: finalAmount,
        originalAmount: tierData.setupFee
      });

    } catch (error) {
      console.error('Stripe session creation error:', error);
      res.status(500).json({ 
        error: 'Failed to create payment session',
        message: error.message 
      });
    }
  });

  app.post('/api/crm/payment-success', async (req, res) => {
    try {
      const { timestamp, source, page } = req.body;
      
      const crmData = {
        email: req.user?.email || 'payment@harmonix.ai',
        name: req.user?.name || 'New Customer',
        source: `payment_${source}`,
        activity: `Payment completed via ${page}`,
        tier: 'paid_customer',
        timestamp
      };

      const result = await updateCRM(crmData);
      res.json({ success: true, crmResult: result });

    } catch (error) {
      console.error('CRM payment update error:', error);
      res.status(500).json({ error: 'Failed to update CRM' });
    }
  });

  // Add GHL webhook endpoint
  app.post('/api/webhooks/ghl', async (req, res) => {
    try {
      const { handleGHLWebhook } = await import('./webhook-handler');
      await handleGHLWebhook(req, res);
    } catch (error) {
      console.error('GHL webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  return httpServer;
}
