import OpenAI from "openai";
import { storage } from "./storage.js";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface EnhancedAgentResponse {
  mainResponse: string;
  useCase: {
    scenario: string;
    challenge: string;
    solution: string;
    implementation: string[];
  };
  actionSteps: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  platformIntegration: {
    recommendedServices: Array<{
      service: string;
      price: number;
      roi: string;
      timeline: string;
    }>;
    agentWorkflow: string[];
    expectedOutcomes: string[];
  };
  successMetrics: Array<{
    metric: string;
    baseline: string;
    target: string;
    timeframe: string;
  }>;
}

export async function generateEnhancedAgentResponse(
  userQuestion: string,
  agentId: string,
  agentPrompt: string,
  agentRole: string
): Promise<EnhancedAgentResponse> {
  
  // Get relevant platform data
  const platformData = await storage.searchPlatformData(userQuestion);
  
  // Enhanced prompt that leverages GPT-4o's advanced capabilities
  const enhancedPrompt = `You are an expert business consultant and AI strategist. Analyze the user's question and provide a comprehensive, actionable response.

CONTEXT:
- Agent Role: ${agentRole}
- Agent Expertise: ${getAgentExpertise(agentId)}
- User Question: "${userQuestion}"

AVAILABLE PLATFORM SERVICES:
${JSON.stringify(platformData.services.map(s => ({
  name: s.name,
  description: s.description,
  pricing: s.pricing,
  benefits: s.benefits,
  deliveryTime: s.deliveryTime
})), null, 2)}

PLATFORM FEATURES:
${JSON.stringify(platformData.features.map(f => ({
  name: f.name,
  description: f.description,
  howItHelps: f.howItHelps
})), null, 2)}

SUCCESS METRICS:
${JSON.stringify(platformData.metrics.map(m => ({
  metric: m.metricName,
  value: m.value,
  description: m.description,
  industry: m.industry
})), null, 2)}

INSTRUCTIONS:
Create a comprehensive response that includes:
1. A personalized main response addressing their specific question
2. A detailed real-world use case showing exactly how our platform solves their problem
3. Specific action steps (immediate, short-term, long-term) they can take
4. Clear platform integration recommendations with pricing and ROI
5. Measurable success metrics with baselines and targets

Respond in JSON format matching this structure:
{
  "mainResponse": "Direct answer to their question with expertise",
  "useCase": {
    "scenario": "Specific business scenario relevant to their question",
    "challenge": "Exact problem they're facing",
    "solution": "How our platform specifically solves this",
    "implementation": ["Step 1", "Step 2", "Step 3"]
  },
  "actionSteps": {
    "immediate": ["Action they can take today"],
    "shortTerm": ["Actions for next 30 days"],
    "longTerm": ["Actions for next 90 days"]
  },
  "platformIntegration": {
    "recommendedServices": [
      {
        "service": "Service name",
        "price": actual_price_number,
        "roi": "Specific ROI percentage or value",
        "timeline": "Implementation timeline"
      }
    ],
    "agentWorkflow": ["How agents will work together"],
    "expectedOutcomes": ["Specific measurable outcomes"]
  },
  "successMetrics": [
    {
      "metric": "Specific metric name",
      "baseline": "Current state",
      "target": "Goal state with numbers",
      "timeframe": "Time to achieve"
    }
  ]
}

Make this incredibly specific and actionable, showing exactly how our AI agents will help them achieve their goals.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: agentPrompt
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7
    });

    const enhancedResponse = JSON.parse(response.choices[0].message.content || "{}");
    return enhancedResponse as EnhancedAgentResponse;

  } catch (error) {
    console.error("Enhanced AI response failed:", error);
    
    // Create intelligent fallback using platform data
    return createIntelligentFallback(userQuestion, agentId, platformData);
  }
}

function getAgentExpertise(agentId: string): string {
  const expertise = {
    'cash-agent': 'Sales optimization, lead qualification, revenue generation, CRM automation, conversion rate improvement',
    'grace-agent': 'Customer experience, support automation, satisfaction improvement, retention strategies, service excellence',
    'echo-agent': 'Social media strategy, content creation, brand engagement, community building, digital marketing',
    'flow-agent': 'Process automation, workflow optimization, operational efficiency, system integration, productivity enhancement',
    'kairos-agent': 'Project management, timeline optimization, resource allocation, team coordination, delivery excellence',
    'sol-agent': 'AI orchestration, strategic planning, system coordination, multi-agent optimization, business intelligence'
  };
  
  return expertise[agentId as keyof typeof expertise] || 'General business optimization and automation';
}

function createIntelligentFallback(
  userQuestion: string, 
  agentId: string, 
  platformData: any
): EnhancedAgentResponse {
  
  const relevantService = platformData.services[0] || {
    name: "AI Agent Development",
    pricing: { fullPayment: 4400 },
    deliveryTime: "2-4 weeks"
  };
  
  const relevantMetric = platformData.metrics[0] || {
    metricName: "Operational Efficiency",
    value: "85% improvement",
    description: "Significant efficiency gains"
  };

  return {
    mainResponse: `Based on your question "${userQuestion}", I can help you implement specific solutions using our AI platform. Our ${getAgentExpertise(agentId)} capabilities are designed to address exactly these types of challenges.`,
    useCase: {
      scenario: `Business looking to solve: ${userQuestion}`,
      challenge: "Manual processes consuming time and reducing efficiency",
      solution: `Deploy specialized AI agents to automate and optimize these specific processes`,
      implementation: [
        "Analyze current workflow and identify automation opportunities",
        "Deploy relevant AI agents with custom configurations",
        "Integrate with existing systems and processes",
        "Monitor performance and optimize continuously"
      ]
    },
    actionSteps: {
      immediate: [
        "Schedule consultation to assess specific needs",
        "Identify top 3 processes for immediate automation"
      ],
      shortTerm: [
        `Begin ${relevantService.name} implementation`,
        "Train team on AI agent management",
        "Set up monitoring and analytics"
      ],
      longTerm: [
        "Scale automation across all relevant processes",
        "Optimize agent performance based on data",
        "Expand to additional business areas"
      ]
    },
    platformIntegration: {
      recommendedServices: [
        {
          service: relevantService.name,
          price: relevantService.pricing.fullPayment,
          roi: "200-300% within first year",
          timeline: relevantService.deliveryTime || "2-4 weeks"
        }
      ],
      agentWorkflow: [
        "Deploy specialized agents for your specific use case",
        "Integrate with existing CRM and business systems",
        "Coordinate multiple agents for comprehensive automation"
      ],
      expectedOutcomes: [
        `${relevantMetric.value} ${relevantMetric.description}`,
        "Significant time savings and cost reduction",
        "Improved customer experience and satisfaction"
      ]
    },
    successMetrics: [
      {
        metric: relevantMetric.metricName,
        baseline: "Current manual processes",
        target: relevantMetric.value,
        timeframe: "90 days"
      }
    ]
  };
}