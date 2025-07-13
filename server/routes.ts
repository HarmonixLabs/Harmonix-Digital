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
// GHL integration will be imported dynamically when needed
import { healthCheck, readinessCheck } from "./health-check";
import { corsMiddleware } from "./middleware/cors";
import Stripe from "stripe";
import { pipedreamIntegration } from "./services/pipedream-integration";
import { generateEnhancedAgentResponse } from "./ai-enhancement-service";
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || "harmonix-secret-key";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

// Initialize Google OAuth
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
);

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

  // Demo interaction logging
  app.post('/api/demo/log', async (req, res) => {
    try {
      const { agentId, agentName, action, conversationPhase, messageCount, userContext, timestamp } = req.body;
      
      // Log demo interaction for analytics
      console.log('Demo Interaction:', {
        agentId,
        agentName,
        action,
        conversationPhase,
        messageCount,
        timestamp
      });

      // Send Slack notification for qualified demos (execution actions)
      if (action === 'waitlist' || action === 'reserve_spot' || action === 'pick_plan') {
        console.log(`🎯 Demo Conversion: ${agentName} - ${action} - ${conversationPhase}`);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Demo logging error:', error);
      res.status(500).json({ error: 'Failed to log demo interaction' });
    }
  });
  
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
    
    // Verify authentication token
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    
    if (!token) {
      // Silently reject unauthenticated connections without logging
      ws.close(1008, 'Authentication required');
      return;
    }
    
    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      // Attach user info to the WebSocket connection
      (ws as any).userId = decoded.userId;
      (ws as any).organizationId = decoded.organizationId;
    } catch (error) {
      console.log('WebSocket connection rejected: Invalid token');
      ws.close(1008, 'Invalid authentication token');
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

  // Multi-CRM Lead Capture Endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = req.body;
      
      // Basic validation
      if (!leadData.email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Add timestamp if not present
      if (!leadData.timestamp) {
        leadData.timestamp = new Date().toISOString();
      }

      console.log('Processing lead submission:', leadData.email);

      // Track success of each destination
      const results = {
        ghl: false,
        hubspot: false,
        sheets: false,
      };

      // Send to GoHighLevel
      try {
      } else {
        organization = await storage.getOrganization(user.organizationId!);
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: { ...user, password: undefined },
        organization,
        token,
        message: 'Google authentication successful'
      });

    } catch (error) {
      console.error('Google token verification error:', error);
      res.status(400).json({ message: 'Invalid Google token' });
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
              customPrompt: `Onboarding context: ${JSON.stringify(onboardingData)}`
            });
          }
        }
      }

      // Update CRM with onboarding completion

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

  // Waitlist endpoint for CRM capture
  // Demo API routes
  app.post('/api/demo/execute', async (req, res) => {
    try {
      const { scenarioId, companyName, industry } = req.body;
      
      // Simulate demo execution
      const demoResult = {
        success: true,
        scenarioId,
        companyName,
        industry,
        executionId: `demo_${Date.now()}`,
        status: 'completed',
        results: {
          leadsProcessed: Math.floor(Math.random() * 50) + 10,
          conversionRate: (Math.random() * 15 + 5).toFixed(1) + '%',
          timeSaved: Math.floor(Math.random() * 20) + 5 + ' hours',
          revenueGenerated: '$' + (Math.floor(Math.random() * 50000) + 10000).toLocaleString()
        },
        metrics: {
          efficiency: Math.floor(Math.random() * 30) + 70,
          accuracy: Math.floor(Math.random() * 20) + 80,
          satisfaction: Math.floor(Math.random() * 15) + 85
        }
      };
      
      res.json(demoResult);
    } catch (error) {
      console.error('Demo execution error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to execute demo',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/waitlist', async (req, res) => {
    try {
      const { name, email, company, phone, industry, interest, page } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }

      // Create CRM contact for waitlist
      const crmData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        company: company?.trim() || '',
        source: 'harmonix_waitlist',
        tags: ['waitlist', 'prospect'],
        customFields: {
          industry: industry || '',
          interest: interest || '',
          joinedPage: page || 'unknown',
          joinedAt: new Date().toISOString()
        }
      };

      // Update CRM with waitlist signup
        } catch (crmError) {
          console.warn('CRM update failed:', crmError);
        }
      }

      // Send success response
      res.json({
        success: true,
        message: 'Form submitted successfully',
        data: {
          timestamp,
          rowCount: appendResponse.data.updates?.updatedRows,
          range: appendResponse.data.updates?.updatedRange
        }
      });

    } catch (error) {
      console.error('❌ Error processing form submission:', error);
      
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Test Google Sheets connection endpoint
  app.get('/test-sheets', async (req, res) => {
    try {
      const { google } = await import('googleapis');
      
      const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
      const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!SPREADSHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        return res.status(500).json({
          success: false,
          error: 'Google Sheets configuration missing'
        });
      }

      const auth = new google.auth.JWT(
        GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        GOOGLE_PRIVATE_KEY,
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      await auth.authorize();
      const sheets = google.sheets({ version: 'v4', auth });

      // Test by getting spreadsheet metadata
      const response = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      res.json({
        success: true,
        message: 'Google Sheets connection successful',
        spreadsheet: {
          title: response.data.properties?.title,
          sheetCount: response.data.sheets?.length,
          sheets: response.data.sheets?.map(sheet => sheet.properties?.title)
        }
      });

    } catch (error) {
      console.error('❌ Google Sheets test failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Admin routes
  app.use('/api/admin', (await import('./routes/admin')).default);

  // Pipedream integration endpoints
  app.get('/api/pipedream/workflows', authenticateToken, async (req, res) => {
    try {
      const workflows = await pipedreamIntegration.getWorkflows();
      res.json({ workflows });
    } catch (error: any) {
      console.error('Failed to fetch Pipedream workflows:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch workflows' });
    }
  });

  app.post('/api/pipedream/execute', authenticateToken, async (req, res) => {
    try {
      const { agentId, action, data } = req.body;
      
      if (!agentId || !action) {
        return res.status(400).json({ message: 'Agent ID and action are required' });
      }

      const result = await pipedreamIntegration.executeAgentWorkflow(agentId, action, {
        ...data,
        user_id: req.user.id,
        organization_id: req.user.organizationId
      });

      res.json(result);
    } catch (error: any) {
      console.error('Failed to execute Pipedream workflow:', error);
      res.status(500).json({ message: error.message || 'Workflow execution failed' });
    }
  });

  app.get('/api/pipedream/status/:executionId', authenticateToken, async (req, res) => {
    try {
      const { executionId } = req.params;
      const status = await pipedreamIntegration.getExecutionStatus(executionId);
      res.json(status);
    } catch (error: any) {
      console.error('Failed to get execution status:', error);
      res.status(500).json({ message: error.message || 'Failed to get status' });
    }
  });

  // Get overall Pipedream integration status
  app.get('/api/pipedream/status', async (req, res) => {
    try {
      const mappings = pipedreamIntegration.getAgentWorkflowMappings();
      const status = {
        integration_active: true,
        api_key_configured: true,
        timestamp: new Date().toISOString(),
        agents: Object.keys(mappings).map(agentId => ({
          agent_id: agentId,
          agent_name: agentId.toUpperCase().replace('-AGENT', ''),
          actions: Object.keys((mappings as any)[agentId]),
          webhook_configured: Object.values((mappings as any)[agentId]).every(url => !!url),
          primary_webhook: Object.values((mappings as any)[agentId])[0]
        }))
      };
      
      res.json(status);
    } catch (error: any) {
      res.status(500).json({
        integration_active: false,
        api_key_configured: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Test endpoint for demo - processes user questions with AI
  app.post('/api/test-pipedream', async (req, res) => {
    try {
      const { agentId, action, data } = req.body;
      
      if (!agentId || !data?.message) {
        return res.status(400).json({ message: 'Agent ID and message are required' });
      }

      // Get agent-specific prompt and personality
      const agentPrompts = {
        'cash-agent': {
          name: 'CA$H',
          role: 'Elite Sales Agent',
          personality: 'Professional, results-driven, and data-focused',
          prompt: `You are CA$H, an elite AI sales agent. Respond professionally with specific sales insights, lead qualification questions, or revenue strategies. Keep responses under 150 words and focus on actionable business advice.`
        },
        'grace-agent': {
          name: 'GRACE',
          role: 'Customer Experience Specialist',
          personality: 'Empathetic, helpful, and solution-oriented',
          prompt: `You are GRACE, a premium customer experience AI. Respond with helpful, empathetic support that addresses the user's concerns. Provide specific solutions and show emotional intelligence. Keep responses under 150 words.`
        },
        'echo-agent': {
          name: 'ECHO',
          role: 'Social Media Manager',
          personality: 'Creative, trend-aware, and engaging',
          prompt: `You are ECHO, a social media AI expert. Respond with creative content ideas, social media strategies, or engagement tips. Be trendy and inspiring while staying professional. Keep responses under 150 words.`
        },
        'flow-agent': {
          name: 'FLOW',
          role: 'Process Automation Specialist',
          personality: 'Efficient, systematic, and optimization-focused',
          prompt: `You are FLOW, a workflow automation AI. Respond with process improvements, automation suggestions, or efficiency strategies. Be systematic and show how to streamline operations. Keep responses under 150 words.`
        },
        'kairos-agent': {
          name: 'KAIROS',
          role: 'Project Manager',
          personality: 'Organized, deadline-focused, and strategic',
          prompt: `You are KAIROS, a project management AI. Respond with project strategies, timeline optimization, or team coordination advice. Be organized and results-focused. Keep responses under 150 words.`
        },
        'sol-agent': {
          name: 'SŌL',
          role: 'AI Orchestration Brain',
          personality: 'Wise, coordinating, and holistically intelligent',
          prompt: `You are SŌL, the master AI orchestrator. Respond with high-level strategic insights, system optimization, or multi-agent coordination strategies. Show supreme intelligence and harmony. Keep responses under 150 words.`
        }
      };

      const agent = agentPrompts[agentId as keyof typeof agentPrompts];
      if (!agent) {
        return res.status(400).json({ message: 'Unknown agent' });
      }

      // Generate enhanced AI response with GPT-4o using highest-level data
      try {
        const enhancedResponse = await generateEnhancedAgentResponse(
          data.message,
          agentId,
          agent.prompt,
          agent.role
        );

        // Format response with enhanced structure and readability
        let formattedResponse = `# ${agent.name} Response

## Executive Summary
${enhancedResponse.mainResponse}

---`;

        // Add clarifying questions section if agent needs more info
        if (enhancedResponse.needsMoreInfo && enhancedResponse.clarifyingQuestions?.length) {
          formattedResponse += `

## 💭 Quick Questions for Better Recommendations

To provide you with the most targeted and effective solution, I'd like to understand:

${enhancedResponse.clarifyingQuestions.map((q, i) => `**${i + 1}.** ${q}`).join('\n\n')}

---

## Immediate Recommendations

Based on your current question, here's what I recommend:

---`;
        }

        // Add comprehensive details with enhanced formatting
        formattedResponse += `

## 🎯 Real-World Use Case

**Scenario:** ${enhancedResponse.useCase.scenario}

**The Challenge You're Facing:**
${enhancedResponse.useCase.challenge}

**Our Solution:**
${enhancedResponse.useCase.solution}

**Step-by-Step Implementation:**
${enhancedResponse.useCase.implementation.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## 📋 Your Strategic Action Plan

### 🚀 **Take Action Today**
${enhancedResponse.actionSteps.immediate.map(step => `• ${step}`).join('\n')}

### 📈 **30-Day Objectives**
${enhancedResponse.actionSteps.shortTerm.map(step => `• ${step}`).join('\n')}

### 🎯 **90-Day Goals**
${enhancedResponse.actionSteps.longTerm.map(step => `• ${step}`).join('\n')}

---

## 🔧 Platform Integration & Investment

### Recommended Services:
${enhancedResponse.platformIntegration.recommendedServices.map(service => 
  `**${service.service}**
   • Investment: $${service.price.toLocaleString()}
   • Expected ROI: ${service.roi}
   • Timeline: ${service.timeline}`
).join('\n\n')}

### Agent Workflow:
${enhancedResponse.platformIntegration.agentWorkflow.map((workflow, i) => `${i + 1}. ${workflow}`).join('\n')}

### Expected Business Outcomes:
${enhancedResponse.platformIntegration.expectedOutcomes.map(outcome => `✅ ${outcome}`).join('\n')}

---

## 📊 Success Metrics & KPIs

Track these key performance indicators to measure your progress:

${enhancedResponse.successMetrics.map(metric => 
  `**${metric.metric}**
   • Current State: ${metric.baseline}
   • Target Goal: ${metric.target}
   • Timeframe: ${metric.timeframe}`
).join('\n\n')}

---

## 🤝 Next Steps

Ready to move forward? Here's how to get started:

1. **Schedule a Consultation**: Let's discuss your specific needs in detail
2. **Platform Demo**: See exactly how our agents will work for your business
3. **Implementation Planning**: Create a customized deployment strategy

*This analysis is powered by our AI platform's comprehensive business intelligence and real-world success data.*`;

        const aiResponse = formattedResponse;

        // Execute the live workflow in the background (non-blocking)
        try {
          await pipedreamIntegration.executeAgentWorkflow(agentId, action, {
            ...data,
            ai_response: aiResponse,
            demo_mode: true
          });
        } catch (workflowError) {
          console.log('Workflow execution failed (non-blocking):', workflowError);
        }

        res.json({ 
          success: true,
          response: aiResponse,
          agent_name: agent.name,
          timestamp: new Date().toISOString()
        });

      } catch (aiError) {
        console.error('Enhanced AI processing failed:', aiError);
        
        // Get platform data for fallback
        const platformData = await storage.searchPlatformData(data.message);
        const relevantServices = platformData.services.slice(0, 2);
        const relevantMetrics = platformData.metrics.slice(0, 2);
        
        const fallbackResponse = `# ${agent.name} Response

## Executive Summary
Hello! I'm ${agent.name}, your ${agent.role}. I'm here to help you with your question: "${data.message}"

---

## 🛠️ Platform Capabilities

Based on our comprehensive platform, here's how I can assist you:

${relevantServices.map(service => 
  `### ${service.name}
   • **Description**: ${service.description.substring(0, 120)}...
   • **Investment**: Starting at $${service.pricing.fullPayment.toLocaleString()}
   • **Benefits**: Proven solution for businesses like yours`
).join('\n\n')}

---

## 📈 Proven Results

Here's what our clients typically achieve:

${relevantMetrics.map(metric => 
  `**${metric.metricName}**
   • **Achievement**: ${metric.value}
   • **Impact**: ${metric.description}`
).join('\n\n')}

---

## 🤝 Next Steps

Ready to explore how our platform can specifically help your business?

1. **Schedule a Consultation**: Let's discuss your unique needs in detail
2. **Custom Analysis**: I'll provide targeted recommendations for your situation
3. **Implementation Planning**: We'll create a roadmap tailored to your goals

*Let me connect you with our platform for a detailed consultation where I can provide specific recommendations based on your exact requirements.*`;
        
        res.json({ 
          success: true,
          response: fallbackResponse,
          agent_name: agent.name,
          timestamp: new Date().toISOString(),
          fallback: true
        });
      }

    } catch (error: any) {
      console.error('Test endpoint error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Agent processing failed' 
      });
    }
  });

  // Lead capture endpoint
  app.post("/api/capture-lead", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        businessName,
        industry,
        jobTitle,
        companySize,
        agentId,
        question,
        agentResponse,
        sessionId
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !agentId) {
        return res.status(400).json({
          success: false,
          message: "First name, last name, email, and agent ID are required"
        });
      }

      // Import GHL integration service
      const { ghlIntegration } = await import("./ghl-integration");

      // Create lead in database
      const leadData = {
        firstName,
        lastName,
        email,
        phone: phone || null,
        businessName: businessName || null,
        industry: industry || null,
        jobTitle: jobTitle || null,
        companySize: companySize || null,
        agentId,
        interactionData: {
          question: question || '',
          agentResponse: agentResponse || '',
          timestamp: new Date().toISOString(),
          sessionId: sessionId || undefined
        },
        leadStatus: 'new',
        leadSource: 'agent_chat'
      };

      const lead = await storage.createLead(leadData);

      // Create contact in GoHighLevel
      const ghlContact = {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        companyName: businessName || undefined,
        source: `Agent ${agentId} Interaction`,
        tags: [`agent-${agentId.toLowerCase()}`, 'harmonix-lead', 'needs-follow-up'],
        customFields: {
          agent_interaction: agentId,
          business_name: businessName,
          industry: industry,
          job_title: jobTitle,
          company_size: companySize,
          lead_quality: 'high',
          interaction_context: question,
          harmonix_lead_id: lead.id.toString()
        }
      };

      const ghlResult = await ghlIntegration.createContact(ghlContact);

      // Update lead with GHL contact ID if successful
      if (ghlResult.success && ghlResult.contactId) {
        await storage.updateLead(lead.id, {
          ghlContactId: ghlResult.contactId,
          leadStatus: 'contacted'
        });

        // Trigger lead nurturing workflow (optional)
        const workflowId = process.env.GHL_LEAD_NURTURING_WORKFLOW_ID;
        if (workflowId) {
          await ghlIntegration.triggerWorkflow(ghlResult.contactId, workflowId);
        }

        // Add agent-specific tags
        const agentTags = [`${agentId.toLowerCase()}-interested`, 'high-intent'];
        await ghlIntegration.addTagsToContact(ghlResult.contactId, agentTags);
      }

      res.json({
        success: true,
        message: "Lead captured successfully",
        leadId: lead.id,
        ghlSync: ghlResult.success,
        ghlContactId: ghlResult.contactId
      });

    } catch (error: any) {
      console.error('Lead capture error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to capture lead'
      });
    }
  });

  // Get recent leads endpoint (for admin/dashboard)
  app.get("/api/leads", async (req, res) => {
    try {
      const { agentId, limit } = req.query;
      
      let leads;
      if (agentId) {
        leads = await storage.getLeadsByAgent(agentId as string);
      } else {
        leads = await storage.getRecentLeads(parseInt(limit as string) || 50);
      }

      res.json({
        success: true,
        leads: leads,
        count: leads.length
      });

    } catch (error: any) {
      console.error('Get leads error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch leads'
      });
    }
  });

  // Enhanced Stripe Deposit Routes
  app.post("/api/stripe/create-reservation", async (req, res) => {
    try {
      const { agentId, customerEmail, customerName, userId } = req.body;
      
      const { stripeDepositService } = await import("./services/stripe-deposit-service");
      const result = await stripeDepositService.createReservationDeposit({
        agentId,
        customerEmail,
        customerName,
        userId
      });

      res.json(result);
    } catch (error) {
      console.error('Reservation deposit error:', error);
      res.status(500).json({ error: 'Failed to create reservation deposit' });
    }
  });

  app.post("/api/stripe/create-package-deposit", async (req, res) => {
    try {
      const { packageTier, customerEmail, customerName, userId, addOns, estimatedValue } = req.body;
      
      const { stripeDepositService } = await import("./services/stripe-deposit-service");
      const result = await stripeDepositService.createPackageDeposit({
        packageTier,
        customerEmail,
        customerName,
        userId,
        addOns,
        estimatedValue
      });

      res.json(result);
    } catch (error) {
      console.error('Package deposit error:', error);
      res.status(500).json({ error: 'Failed to create package deposit' });
    }
  });

  app.post("/api/stripe/process-deposit-success", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      const { stripeDepositService } = await import("./services/stripe-deposit-service");
      const result = await stripeDepositService.processDepositSuccess(sessionId);

      res.json(result);
    } catch (error) {
      console.error('Deposit success processing error:', error);
      res.status(500).json({ error: 'Failed to process deposit success' });
    }
  });

  // NFT Agent Routes
  app.post("/api/nft/mint-agent", async (req, res) => {
    try {
      const { userId, walletAddress, agentId, depositSessionId, mintTrigger } = req.body;
      
      const { nftAgentService } = await import("./services/nft-agent-service");
      const result = await nftAgentService.triggerNFTMint({
        userId,
        walletAddress,
        agentId,
        depositSessionId,
        mintTrigger
      });

      res.json(result);
    } catch (error) {
      console.error('NFT mint error:', error);
      res.status(500).json({ error: 'Failed to mint NFT' });
    }
  });

  app.get("/api/nft/collections", async (req, res) => {
    try {
      const { nftAgentService } = await import("./services/nft-agent-service");
      const collections = nftAgentService.getAgentCollections();
      res.json(collections);
    } catch (error) {
      console.error('NFT collections error:', error);
      res.status(500).json({ error: 'Failed to get NFT collections' });
    }
  });

  app.get("/api/nft/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { nftAgentService } = await import("./services/nft-agent-service");
      const userNFTs = await nftAgentService.getUserNFTs(userId);
      res.json(userNFTs);
    } catch (error) {
      console.error('User NFTs error:', error);
      res.status(500).json({ error: 'Failed to get user NFTs' });
    }
  });

  // GHL Integration with Affiliate Links
  app.post("/api/ghl/signup-with-affiliate", async (req, res) => {
    try {
      const { userEmail, affiliateId } = req.body;
      
      // GoHighLevel affiliate signup link
      const ghlAffiliateLink = `https://gohighlevel.com/?affiliate=${affiliateId || 'harmonix_default'}`;
      
      res.json({
        success: true,
        signupUrl: ghlAffiliateLink,
        message: "Affiliate link generated successfully"
      });
    } catch (error) {
      console.error('GHL affiliate error:', error);
      res.status(500).json({ error: 'Failed to generate affiliate link' });
    }
  });



  // Referral System Routes
  app.post('/api/referral/generate-code', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { ReferralService } = await import('./services/referral-service');
      
      const referralCode = await ReferralService.generateReferralCode(userId);
      
      res.json({
        success: true,
        referralCode,
        referralUrl: `https://harmonixdigital.com?r=${referralCode}`
      });
    } catch (error) {
      console.error('Failed to generate referral code:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate referral code' 
      });
    }
  });

  app.get('/api/referral/stats', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { ReferralService } = await import('./services/referral-service');
      
      const stats = await ReferralService.getReferralStats(userId);
      
      res.json({
        success: true,
        ...stats
      });
    } catch (error) {
      console.error('Failed to get referral stats:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get referral statistics' 
      });
    }
  });

  app.post('/api/referral/validate', async (req, res) => {
    try {
      const { referralCode } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({
          success: false,
          error: 'Referral code is required'
        });
      }
      
      const { ReferralService } = await import('./services/referral-service');
      const validation = await ReferralService.validateReferralCode(referralCode);
      
      res.json({
        success: true,
        ...validation
      });
    } catch (error) {
      console.error('Failed to validate referral code:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to validate referral code' 
      });
    }
  });

  app.post('/api/referral/apply-discount', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { basePrice } = req.body;
      
      const { ReferralService } = await import('./services/referral-service');
      const discountInfo = await ReferralService.applyReferralDiscount(userId, basePrice);
      
      res.json({
        success: true,
        ...discountInfo
      });
    } catch (error) {
      console.error('Failed to apply referral discount:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to apply referral discount' 
      });
    }
  });

  return httpServer;
}
*/
