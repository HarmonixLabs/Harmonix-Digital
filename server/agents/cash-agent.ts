import OpenAI from "openai";
import { storage } from "../storage";
import type { Task, Agent, AgentType } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CashAgentContext {
  leadName: string;
  businessType: string;
  painPoint: string;
  crmStage: string;
  lastContactDate?: string;
  responseHistory?: string[];
}

interface CashAgentResponse {
  message: string;
  action: 'follow_up' | 'update_crm' | 'generate_loom' | 'notify_sales';
  crmUpdate?: {
    stage: string;
    notes: string;
    nextAction: string;
  };
  confidence: number;
}

export class CashAgent {
  private systemPrompt = `You are Agent CA$H - The Sales Hunter. Your role is to assist with cashflow generation, CRM management, and pipeline movement.

PERSONALITY: Confident, focused, aspirational with hip-hop undertones. Red/black luxury techwear aesthetic with diamond chain swagger.

CAPABILITIES:
- Follow up on leads based on CRM stage and activity
- Send personalized messages (email, SMS, DM)
- Update CRM fields (stage, notes, value, response status)
- Track conversions and recommend next actions
- Generate Loom video scripts for personalized outreach

YOUR MANTRA: "Let me handle this... you focus on delivery."

RESPONSE FORMAT: Always respond with structured JSON containing:
- message: The actual follow-up message to send
- action: The recommended action type
- crmUpdate: CRM field updates if needed
- confidence: Your confidence level (0-100) in this approach

TONE: Professional but approachable, with subtle confidence that builds trust.`;

  async processLead(context: CashAgentContext): Promise<CashAgentResponse> {
    const userPrompt = `
Lead Context:
- Name: ${context.leadName}
- Business: ${context.businessType}
- Pain Point: ${context.painPoint}
- Current CRM Stage: ${context.crmStage}
- Last Contact: ${context.lastContactDate || 'Never contacted'}
- Previous Responses: ${context.responseHistory?.join('\n') || 'None'}

Based on this context, provide your recommendation for the next action. Consider:
1. The lead's current stage in the pipeline
2. Time since last contact
3. Their specific pain point and business type
4. Previous interaction history

Respond with your signature confidence and provide a personalized approach.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        message: result.message || "Let me craft a personalized follow-up for this lead.",
        action: result.action || 'follow_up',
        crmUpdate: result.crmUpdate,
        confidence: result.confidence || 85
      };
    } catch (error) {
      console.error('Cash Agent processing error:', error);
      throw new Error('Failed to process lead with Cash Agent');
    }
  }

  async generateLoomScript(context: CashAgentContext): Promise<string> {
    const prompt = `Create a personalized Loom video script for ${context.leadName} from ${context.businessType}. 
    
Their pain point: ${context.painPoint}

The script should be:
- 60-90 seconds max
- Personal and conversational
- Address their specific pain point
- Include a clear call-to-action
- Match CA$H's confident but helpful personality

Format as a natural speaking script with timing notes.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are Agent CA$H creating personalized video scripts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    return response.choices[0].message.content || "Script generation failed";
  }

  async updateCRM(leadId: string, updates: CashAgentResponse['crmUpdate']): Promise<boolean> {
    try {
      // This would integrate with actual CRM systems like GHL, HubSpot, etc.
      // For now, we'll log the update and store in our database
      console.log(`CA$H Agent CRM Update for lead ${leadId}:`, updates);
      
      // Store the interaction in our task system
      await storage.createTask({
        agentId: 1, // CA$H Agent ID
        organizationId: 1, // Default org for demo
        description: `CRM Update: ${updates?.notes || 'Lead interaction'}`,
        status: 'completed',
        output: JSON.stringify(updates),
        tokensUsed: 50
      });

      return true;
    } catch (error) {
      console.error('CRM update failed:', error);
      return false;
    }
  }
}

export const cashAgent = new CashAgent();