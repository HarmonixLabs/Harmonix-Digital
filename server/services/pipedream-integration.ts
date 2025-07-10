/**
 * Pipedream Integration Service
 * Connects Harmonix AI agents with existing Pipedream workflows
 */

import axios from 'axios';

interface PipedreamWorkflow {
  id: string;
  name: string;
  description: string;
  trigger_url: string;
  status: 'active' | 'inactive';
  last_execution?: string;
}

interface PipedreamExecutionResult {
  execution_id: string;
  status: 'success' | 'error' | 'running';
  result?: any;
  error?: string;
  duration_ms?: number;
}

class PipedreamIntegrationService {
  private apiKey: string;
  private baseUrl = 'https://api.pipedream.com/v1';
  
  constructor() {
    // Use CLIENT_ID as API key if PIPEDREAM_API_KEY not available
    this.apiKey = process.env.PIPEDREAM_API_KEY || process.env.PIPEDREAM_CLIENT_ID || '';
    if (!this.apiKey) {
      console.warn('PIPEDREAM_API_KEY not configured - Pipedream integration disabled');
    } else {
      console.log('Pipedream integration initialized');
    }
  }

  /**
   * Get all available Pipedream workflows
   */
  async getWorkflows(): Promise<PipedreamWorkflow[]> {
    try {
      if (!this.apiKey) return [];
      
      const response = await axios.get(`${this.baseUrl}/workflows`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch Pipedream workflows:', error);
      return [];
    }
  }

  /**
   * Execute a specific Pipedream workflow
   */
  async executeWorkflow(workflowId: string, data: any = {}): Promise<PipedreamExecutionResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Pipedream API key not configured');
      }

      const response = await axios.post(`${this.baseUrl}/workflows/${workflowId}/execute`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        execution_id: response.data.execution_id,
        status: 'success',
        result: response.data.result,
        duration_ms: response.data.duration_ms
      };
    } catch (error: any) {
      console.error('Failed to execute Pipedream workflow:', error);
      return {
        execution_id: '',
        status: 'error',
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Trigger workflow via webhook URL
   */
  async triggerWebhook(webhookUrl: string, data: any = {}): Promise<PipedreamExecutionResult> {
    try {
      const response = await axios.post(webhookUrl, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      return {
        execution_id: response.data.execution_id || Date.now().toString(),
        status: 'success',
        result: response.data,
        duration_ms: response.data.duration_ms
      };
    } catch (error: any) {
      console.error('Failed to trigger Pipedream webhook:', error);
      return {
        execution_id: '',
        status: 'error',
        error: error.message || 'Webhook trigger failed'
      };
    }
  }

  /**
   * Get workflow execution status
   */
  async getExecutionStatus(executionId: string): Promise<PipedreamExecutionResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Pipedream API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/executions/${executionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        execution_id: executionId,
        status: response.data.status,
        result: response.data.result,
        duration_ms: response.data.duration_ms
      };
    } catch (error: any) {
      console.error('Failed to get execution status:', error);
      return {
        execution_id: executionId,
        status: 'error',
        error: error.message || 'Failed to get status'
      };
    }
  }

  /**
   * Map Harmonix agent actions to Pipedream workflows
   */
  getAgentWorkflowMappings() {
    return {
      'cash-agent': {
        lead_qualification: process.env.PIPEDREAM_CASH_LEAD_WEBHOOK,
        sales_automation: process.env.PIPEDREAM_CASH_SALES_WEBHOOK,
        revenue_analysis: process.env.PIPEDREAM_CASH_REVENUE_WEBHOOK,
        crm_sync: process.env.PIPEDREAM_CASH_CRM_WEBHOOK
      },
      'grace-agent': {
        customer_support: process.env.PIPEDREAM_GRACE_SUPPORT_WEBHOOK,
        live_chat: process.env.PIPEDREAM_GRACE_CHAT_WEBHOOK,
        ticket_routing: process.env.PIPEDREAM_GRACE_ROUTING_WEBHOOK,
        sentiment_analysis: process.env.PIPEDREAM_GRACE_SENTIMENT_WEBHOOK
      },
      'echo-agent': {
        social_media_posting: process.env.PIPEDREAM_ECHO_POSTING_WEBHOOK,
        content_scheduling: process.env.PIPEDREAM_ECHO_SCHEDULING_WEBHOOK,
        engagement_tracking: process.env.PIPEDREAM_ECHO_ENGAGEMENT_WEBHOOK,
        trend_analysis: process.env.PIPEDREAM_ECHO_TRENDS_WEBHOOK
      },
      'flow-agent': {
        process_automation: process.env.PIPEDREAM_FLOW_PROCESS_WEBHOOK,
        workflow_optimization: process.env.PIPEDREAM_FLOW_OPTIMIZATION_WEBHOOK,
        task_routing: process.env.PIPEDREAM_FLOW_ROUTING_WEBHOOK,
        integration_sync: process.env.PIPEDREAM_FLOW_INTEGRATION_WEBHOOK
      },
      'kairos-agent': {
        project_management: process.env.PIPEDREAM_KAIROS_PM_WEBHOOK,
        task_scheduling: process.env.PIPEDREAM_KAIROS_SCHEDULING_WEBHOOK,
        team_coordination: process.env.PIPEDREAM_KAIROS_COORDINATION_WEBHOOK,
        progress_tracking: process.env.PIPEDREAM_KAIROS_TRACKING_WEBHOOK
      },
      'sol-agent': {
        ai_orchestration: process.env.PIPEDREAM_SOL_ORCHESTRATION_WEBHOOK,
        agent_coordination: process.env.PIPEDREAM_SOL_COORDINATION_WEBHOOK,
        system_optimization: process.env.PIPEDREAM_SOL_OPTIMIZATION_WEBHOOK,
        harmony_analysis: process.env.PIPEDREAM_SOL_HARMONY_WEBHOOK
      }
    };
  }

  /**
   * Execute agent-specific workflow
   */
  async executeAgentWorkflow(
    agentId: string, 
    action: string, 
    data: any = {}
  ): Promise<PipedreamExecutionResult> {
    const mappings = this.getAgentWorkflowMappings();
    const agentMappings = (mappings as any)[agentId];
    
    if (!agentMappings || !agentMappings[action]) {
      return {
        execution_id: '',
        status: 'error',
        error: `No Pipedream workflow configured for ${agentId} -> ${action}`
      };
    }

    const webhookUrl = agentMappings[action];
    if (!webhookUrl) {
      return {
        execution_id: '',
        status: 'error',
        error: `Webhook URL not configured for ${agentId} -> ${action}`
      };
    }

    // Add agent context to the data
    const enrichedData = {
      ...data,
      agent_id: agentId,
      action: action,
      timestamp: new Date().toISOString(),
      harmonix_platform: true
    };

    return await this.triggerWebhook(webhookUrl, enrichedData);
  }
}

export const pipedreamIntegration = new PipedreamIntegrationService();
export type { PipedreamWorkflow, PipedreamExecutionResult };