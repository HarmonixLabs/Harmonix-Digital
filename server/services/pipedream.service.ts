import axios from 'axios';
import { z } from 'zod';

// Pipedream webhook configuration
const PIPEDREAM_CONFIG = {
  apiKey: process.env.PIPEDREAM_API_KEY || '',
  webhooks: {
    cash: process.env.PIPEDREAM_CASH_WEBHOOK || '',
    echo: process.env.PIPEDREAM_ECHO_WEBHOOK || '',
    flow: process.env.PIPEDREAM_FLOW_WEBHOOK || '',
    grace: process.env.PIPEDREAM_GRACE_WEBHOOK || '',
    kairos: process.env.PIPEDREAM_KAIROS_WEBHOOK || '',
    sol: process.env.PIPEDREAM_SOL_WEBHOOK || ''
  }
};

// Agent webhook payload schema
const AgentPayloadSchema = z.object({
  agentId: z.string(),
  action: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  data: z.record(z.any()),
  timestamp: z.string().optional()
});

export type AgentPayload = z.infer<typeof AgentPayloadSchema>;

// Agent types
export type AgentType = 'cash' | 'echo' | 'flow' | 'grace' | 'kairos' | 'sol';

// Agent response schema
const AgentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.record(z.any()).optional(),
  error: z.string().optional()
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;

export class PipedreamService {
  private static instance: PipedreamService;

  private constructor() {}

  public static getInstance(): PipedreamService {
    if (!PipedreamService.instance) {
      PipedreamService.instance = new PipedreamService();
    }
    return PipedreamService.instance;
  }

  /**
   * Send a request to a specific agent via Pipedream webhook
   */
  public async sendToAgent(
    agentType: AgentType,
    payload: AgentPayload
  ): Promise<AgentResponse> {
    try {
      const webhookUrl = PIPEDREAM_CONFIG.webhooks[agentType];
      
      if (!webhookUrl) {
        throw new Error(`Webhook URL not configured for agent: ${agentType}`);
      }

      // Add timestamp if not provided
      const enrichedPayload = {
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString()
      };

      // Validate payload
      const validatedPayload = AgentPayloadSchema.parse(enrichedPayload);

      // Send request to Pipedream webhook
      const response = await axios.post(webhookUrl, validatedPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PIPEDREAM_CONFIG.apiKey}`
        },
        timeout: 30000 // 30 second timeout
      });

      // Validate response
      const validatedResponse = AgentResponseSchema.parse(response.data);
      
      return validatedResponse;
    } catch (error) {
      console.error(`Error sending to ${agentType} agent:`, error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get agent status from Pipedream
   */
  public async getAgentStatus(agentType: AgentType): Promise<{
    online: boolean;
    lastActive?: string;
    metrics?: Record<string, any>;
  }> {
    try {
      const response = await this.sendToAgent(agentType, {
        agentId: agentType,
        action: 'status',
        userId: 'system',
        organizationId: 'system',
        data: {}
      });

      return {
        online: response.success,
        lastActive: response.data?.lastActive,
        metrics: response.data?.metrics
      };
    } catch (error) {
      return { online: false };
    }
  }

  /**
   * Execute agent action
   */
  public async executeAgentAction(
    agentType: AgentType,
    action: string,
    userId: string,
    organizationId: string,
    data: Record<string, any>
  ): Promise<AgentResponse> {
    return this.sendToAgent(agentType, {
      agentId: agentType,
      action,
      userId,
      organizationId,
      data
    });
  }

  /**
   * Batch execute actions across multiple agents
   */
  public async batchExecute(
    actions: Array<{
      agentType: AgentType;
      action: string;
      data: Record<string, any>;
    }>,
    userId: string,
    organizationId: string
  ): Promise<Record<AgentType, AgentResponse>> {
    const results: Record<string, AgentResponse> = {};
    
    // Execute all actions in parallel
    const promises = actions.map(async ({ agentType, action, data }) => {
      const response = await this.executeAgentAction(
        agentType,
        action,
        userId,
        organizationId,
        data
      );
      results[agentType] = response;
    });

    await Promise.all(promises);
    
    return results as Record<AgentType, AgentResponse>;
  }

  /**
   * Check if all agents are properly configured
   */
  public isConfigured(): boolean {
    return !!(
      PIPEDREAM_CONFIG.apiKey &&
      Object.values(PIPEDREAM_CONFIG.webhooks).every(url => url)
    );
  }

  /**
   * Get configuration status
   */
  public getConfigStatus(): {
    configured: boolean;
    missingWebhooks: AgentType[];
  } {
    const missingWebhooks: AgentType[] = [];
    
    (Object.keys(PIPEDREAM_CONFIG.webhooks) as AgentType[]).forEach(agent => {
      if (!PIPEDREAM_CONFIG.webhooks[agent]) {
        missingWebhooks.push(agent);
      }
    });

    return {
      configured: this.isConfigured(),
      missingWebhooks
    };
  }
}

// Export singleton instance
export const pipedreamService = PipedreamService.getInstance();