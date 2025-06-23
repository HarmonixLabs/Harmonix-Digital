import OpenAI from "openai";
import { Task, Agent, AgentType } from "@shared/schema";
import { IStorage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface AgentTaskResult {
  success: boolean;
  output: any;
  tokensUsed: number;
  error?: string;
}

export async function processAgentTask(
  task: Task,
  agent: Agent,
  agentType: AgentType,
  storage: IStorage,
  broadcast: (data: any) => void
): Promise<void> {
  try {
    // Update task status to in_progress
    await storage.updateTask(task.id, { status: 'in_progress' });
    
    broadcast({
      type: 'task_updated',
      data: { ...task, status: 'in_progress' },
      organizationId: task.organizationId,
    });

    // Process task with SŌL brain intelligence
    const result = await executeAgentTask(task, agent, agentType);
    
    if (result.success) {
      // Update task as completed
      await storage.updateTask(task.id, {
        status: 'completed',
        output: result.output,
        tokensUsed: result.tokensUsed,
        completedAt: new Date(),
      });

      // Update agent statistics
      await storage.updateAgent(agent.id, {
        tokensUsed: agent.tokensUsed + result.tokensUsed,
        tasksCompleted: agent.tasksCompleted + 1,
      });

      // Create token transaction
      await storage.createTokenTransaction({
        organizationId: task.organizationId,
        userId: task.userId,
        type: 'usage',
        amount: result.tokensUsed,
        description: `Task: ${task.title} - ${agent.name}`,
        taskId: task.id,
      });

      // Update organization token usage
      const org = await storage.getOrganization(task.organizationId);
      if (org) {
        await storage.updateOrganization(task.organizationId, {
          tokensUsed: org.tokensUsed + result.tokensUsed,
        });
      }

      broadcast({
        type: 'task_completed',
        data: { ...task, status: 'completed', output: result.output },
        organizationId: task.organizationId,
      });
    } else {
      // Update task as failed
      await storage.updateTask(task.id, {
        status: 'failed',
        output: { error: result.error },
      });

      broadcast({
        type: 'task_failed',
        data: { ...task, status: 'failed', error: result.error },
        organizationId: task.organizationId,
      });
    }
  } catch (error) {
    console.error('Error processing agent task:', error);
    
    await storage.updateTask(task.id, {
      status: 'failed',
      output: { error: 'Internal processing error' },
    });

    broadcast({
      type: 'task_failed',
      data: { ...task, status: 'failed', error: 'Internal processing error' },
      organizationId: task.organizationId,
    });
  }
}

async function executeAgentTask(
  task: Task,
  agent: Agent,
  agentType: AgentType
): Promise<AgentTaskResult> {
  try {
    // Construct the prompt using SŌL brain intelligence
    const systemPrompt = buildSystemPrompt(agentType, agent);
    const userPrompt = buildUserPrompt(task);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    const tokensUsed = response.usage?.total_tokens || agentType.tokenCost;

    return {
      success: true,
      output: result,
      tokensUsed: Math.max(tokensUsed, agentType.tokenCost),
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      output: null,
      tokensUsed: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function buildSystemPrompt(agentType: AgentType, agent: Agent): string {
  const basePrompt = agentType.basePrompt || getDefaultPromptForCategory(agentType.category);
  const customPrompt = agent.customPrompt || '';
  
  return `
You are ${agentType.name}, a specialized AI agent in the Harmonix platform powered by the SŌL brain engine.

${basePrompt}

${customPrompt ? `Additional customization: ${customPrompt}` : ''}

Your capabilities include: ${agentType.capabilities?.join(', ') || 'general assistance'}

Always respond in JSON format with the following structure:
{
  "success": boolean,
  "result": "your main response/output",
  "actions_taken": ["list", "of", "actions"],
  "recommendations": ["list", "of", "recommendations"],
  "follow_up_required": boolean,
  "confidence": number (0-1)
}

Be helpful, professional, and efficient. Focus on providing actionable results that align with your specialized role.
  `.trim();
}

function buildUserPrompt(task: Task): string {
  return `
Task: ${task.title}
${task.description ? `Description: ${task.description}` : ''}
${task.input ? `Input Data: ${JSON.stringify(task.input)}` : ''}

Please process this task according to your specialized capabilities and provide a comprehensive response.
  `.trim();
}

function getDefaultPromptForCategory(category: string): string {
  const prompts: Record<string, string> = {
    executive: `You are an Executive Assistant AI specializing in administrative tasks, scheduling, email management, and high-level support. You excel at organizing information, managing calendars, drafting professional communications, and coordinating complex workflows. You maintain the highest standards of professionalism and confidentiality.`,
    
    hr: `You are an HR AI Agent specializing in human resources management. You excel at recruitment processes, employee onboarding, policy guidance, performance management, and workplace communication. You understand employment law, best practices in talent management, and creating positive workplace cultures.`,
    
    sales: `You are a Sales AI Agent specializing in lead generation, customer relationship management, sales process optimization, and revenue growth. You excel at qualifying prospects, crafting persuasive communications, managing sales pipelines, and analyzing sales performance data.`,
    
    sop: `You are an SOP (Standard Operating Procedures) AI Agent specializing in process documentation, workflow optimization, quality control, and operational efficiency. You excel at creating detailed procedures, ensuring compliance, identifying process improvements, and maintaining operational standards.`,
    
    concierge: `You are a Concierge AI Agent specializing in customer service, personalized assistance, and premium support experiences. You excel at understanding customer needs, providing tailored solutions, managing special requests, and ensuring exceptional service delivery.`,
    
    booking: `You are a Booking AI Agent specializing in appointment scheduling, calendar management, resource allocation, and coordination services. You excel at managing complex schedules, handling booking conflicts, optimizing time slots, and ensuring smooth scheduling operations.`,
  };

  return prompts[category] || `You are a specialized AI agent designed to help with ${category}-related tasks. Provide helpful, accurate, and professional assistance based on your domain expertise.`;
}

// Specialized analysis functions for different agent types
export async function analyzeTaskComplexity(taskDescription: string): Promise<{
  complexity: 'low' | 'medium' | 'high';
  estimatedTokens: number;
  recommendedAgent: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the SŌL brain engine analyzer. Analyze task complexity and recommend the best agent type. Respond in JSON format with: {"complexity": "low|medium|high", "estimatedTokens": number, "recommendedAgent": "agent_category", "reasoning": "explanation"}`
        },
        {
          role: "user",
          content: `Analyze this task: ${taskDescription}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      complexity: result.complexity || 'medium',
      estimatedTokens: result.estimatedTokens || 50,
      recommendedAgent: result.recommendedAgent || 'executive',
    };
  } catch (error) {
    console.error('Task analysis error:', error);
    return {
      complexity: 'medium',
      estimatedTokens: 50,
      recommendedAgent: 'executive',
    };
  }
}
