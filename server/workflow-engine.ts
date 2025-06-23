import { storage } from "./storage";
import type { WorkflowSuggestion, UserWorkflowPreferences, WorkflowStep } from "@shared/workflow-schema";

interface BusinessContext {
  industry: string;
  size: string;
  goals: string[];
  challenges: string[];
  currentAgents: string[];
  techStack: string[];
  budget: string;
}

interface SuggestionScore {
  suggestion: WorkflowSuggestion;
  score: number;
  reasons: string[];
  feasibility: number; // 0-1
  impact: number; // 0-1
  urgency: number; // 0-1
}

export class WorkflowSuggestionEngine {
  
  /**
   * Generate personalized workflow suggestions based on business context
   */
  async generateSuggestions(
    organizationId: number, 
    userId: number,
    businessContext?: Partial<BusinessContext>
  ): Promise<SuggestionScore[]> {
    
    // Get user preferences
    const preferences = await storage.getUserWorkflowPreferences(userId);
    
    // Get organization data
    const organization = await storage.getOrganization(organizationId);
    const agents = await storage.getAgentsByOrganization(organizationId);
    
    // Get all available workflow suggestions
    const allSuggestions = await storage.getWorkflowSuggestions();
    
    // Build comprehensive business context
    const context: BusinessContext = {
      industry: preferences?.industry || businessContext?.industry || 'general',
      size: preferences?.businessSize || businessContext?.size || 'small',
      goals: preferences?.primaryGoals || businessContext?.goals || [],
      challenges: preferences?.currentChallenges || businessContext?.challenges || [],
      currentAgents: agents.map(a => a.name),
      techStack: preferences?.techStack || businessContext?.techStack || [],
      budget: preferences?.budgetRange || businessContext?.budget || 'unknown'
    };
    
    // Score each suggestion
    const scoredSuggestions = allSuggestions
      .filter(suggestion => this.isRelevantToContext(suggestion, context))
      .map(suggestion => this.scoreSuggestion(suggestion, context, preferences))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 suggestions
    
    return scoredSuggestions;
  }

  /**
   * Check if a workflow suggestion is relevant to the business context
   */
  private isRelevantToContext(suggestion: WorkflowSuggestion, context: BusinessContext): boolean {
    // Industry relevance
    if (suggestion.category === 'industry-specific' && !suggestion.tags.includes(context.industry)) {
      return false;
    }
    
    // Size appropriateness
    if (context.size === 'startup' && suggestion.difficulty === 'advanced') {
      return false;
    }
    
    if (context.size === 'enterprise' && suggestion.difficulty === 'beginner') {
      return false;
    }
    
    return true;
  }

  /**
   * Score a workflow suggestion based on business context and user preferences
   */
  private scoreSuggestion(
    suggestion: WorkflowSuggestion, 
    context: BusinessContext,
    preferences?: UserWorkflowPreferences
  ): SuggestionScore {
    
    let score = 0;
    const reasons: string[] = [];
    
    // Goal alignment (0-30 points)
    const goalAlignment = this.calculateGoalAlignment(suggestion, context.goals);
    score += goalAlignment * 30;
    if (goalAlignment > 0.7) {
      reasons.push(`Directly addresses your ${context.goals.join(', ')} goals`);
    }
    
    // Challenge solving (0-25 points)
    const challengeRelevance = this.calculateChallengeRelevance(suggestion, context.challenges);
    score += challengeRelevance * 25;
    if (challengeRelevance > 0.6) {
      reasons.push(`Helps solve your current challenges`);
    }
    
    // Agent availability (0-20 points)
    const agentAvailability = this.calculateAgentAvailability(suggestion, context.currentAgents);
    score += agentAvailability * 20;
    if (agentAvailability === 1) {
      reasons.push(`Uses agents you already have deployed`);
    } else if (agentAvailability > 0.5) {
      reasons.push(`Requires minimal additional agent setup`);
    }
    
    // ROI potential (0-15 points)
    const roiScore = this.calculateROIScore(suggestion);
    score += roiScore * 15;
    if (roiScore > 0.8) {
      reasons.push(`High ROI potential: ${suggestion.roiEstimate}`);
    }
    
    // Implementation feasibility (0-10 points)
    const feasibility = this.calculateFeasibility(suggestion, context);
    score += feasibility * 10;
    
    // Calculate component scores
    const impact = this.calculateImpact(suggestion, context);
    const urgency = this.calculateUrgency(suggestion, context);
    
    return {
      suggestion,
      score: Math.round(score),
      reasons,
      feasibility,
      impact,
      urgency
    };
  }

  private calculateGoalAlignment(suggestion: WorkflowSuggestion, goals: string[]): number {
    if (goals.length === 0) return 0.5; // Default score if no goals specified
    
    const relevantKeywords = {
      sales: ['revenue', 'leads', 'conversion', 'pipeline', 'close'],
      marketing: ['brand', 'content', 'social', 'campaign', 'reach'],
      operations: ['efficiency', 'process', 'automation', 'workflow', 'optimize'],
      hr: ['hiring', 'onboarding', 'employee', 'recruitment', 'team'],
      finance: ['budget', 'expense', 'financial', 'reporting', 'analysis']
    };
    
    let maxAlignment = 0;
    for (const goal of goals) {
      const goalLower = goal.toLowerCase();
      const categoryKeywords = relevantKeywords[suggestion.category as keyof typeof relevantKeywords] || [];
      
      const alignment = categoryKeywords.some(keyword => 
        goalLower.includes(keyword) || suggestion.description.toLowerCase().includes(goalLower)
      ) ? 1 : 0.3;
      
      maxAlignment = Math.max(maxAlignment, alignment);
    }
    
    return maxAlignment;
  }

  private calculateChallengeRelevance(suggestion: WorkflowSuggestion, challenges: string[]): number {
    if (challenges.length === 0) return 0.4;
    
    const challengeKeywords = challenges.join(' ').toLowerCase();
    const suggestionText = (suggestion.description + ' ' + suggestion.title).toLowerCase();
    
    // Check for keyword overlap
    const commonTerms = ['time', 'manual', 'inefficient', 'slow', 'error', 'bottleneck', 'scale'];
    const matchCount = commonTerms.filter(term => 
      challengeKeywords.includes(term) && suggestionText.includes(term)
    ).length;
    
    return Math.min(matchCount / 3, 1); // Normalize to 0-1
  }

  private calculateAgentAvailability(suggestion: WorkflowSuggestion, currentAgents: string[]): number {
    const requiredAgents = suggestion.requiredAgents;
    const availableCount = requiredAgents.filter(required => 
      currentAgents.some(current => current.toLowerCase().includes(required.toLowerCase()))
    ).length;
    
    return requiredAgents.length > 0 ? availableCount / requiredAgents.length : 1;
  }

  private calculateROIScore(suggestion: WorkflowSuggestion): number {
    if (!suggestion.roiEstimate) return 0.5;
    
    const roiText = suggestion.roiEstimate.toLowerCase();
    if (roiText.includes('500%') || roiText.includes('high')) return 1;
    if (roiText.includes('300%') || roiText.includes('400%')) return 0.8;
    if (roiText.includes('200%') || roiText.includes('medium')) return 0.6;
    if (roiText.includes('100%') || roiText.includes('150%')) return 0.4;
    return 0.3;
  }

  private calculateFeasibility(suggestion: WorkflowSuggestion, context: BusinessContext): number {
    let feasibility = 1;
    
    // Complexity vs experience
    if (suggestion.difficulty === 'advanced' && context.size === 'startup') {
      feasibility -= 0.3;
    }
    
    // Tech stack compatibility
    const requiredIntegrations = suggestion.integrations || [];
    const compatibleIntegrations = requiredIntegrations.filter(integration =>
      context.techStack.some(tech => tech.toLowerCase().includes(integration.toLowerCase()))
    );
    
    if (requiredIntegrations.length > 0) {
      feasibility *= (compatibleIntegrations.length / requiredIntegrations.length);
    }
    
    return Math.max(feasibility, 0.1);
  }

  private calculateImpact(suggestion: WorkflowSuggestion, context: BusinessContext): number {
    let impact = 0.5;
    
    // Time savings impact
    if (suggestion.estimatedTimeSaved) {
      const timeSaved = suggestion.estimatedTimeSaved.toLowerCase();
      if (timeSaved.includes('40') || timeSaved.includes('50')) impact = 1;
      else if (timeSaved.includes('20') || timeSaved.includes('30')) impact = 0.8;
      else if (timeSaved.includes('10') || timeSaved.includes('15')) impact = 0.6;
    }
    
    // Category impact for business size
    if (context.size === 'enterprise' && suggestion.category === 'operations') impact += 0.2;
    if (context.size === 'startup' && suggestion.category === 'sales') impact += 0.3;
    
    return Math.min(impact, 1);
  }

  private calculateUrgency(suggestion: WorkflowSuggestion, context: BusinessContext): number {
    let urgency = 0.5;
    
    // Priority-based urgency
    urgency += (suggestion.priority || 1) * 0.15;
    
    // Challenge-based urgency
    if (context.challenges.some(challenge => 
      challenge.toLowerCase().includes('urgent') || 
      challenge.toLowerCase().includes('critical') ||
      challenge.toLowerCase().includes('immediate')
    )) {
      urgency += 0.3;
    }
    
    return Math.min(urgency, 1);
  }

  /**
   * Create default workflow suggestions for seeding the database
   */
  static getDefaultWorkflowSuggestions(): Partial<WorkflowSuggestion>[] {
    return [
      {
        title: "Automated Lead Qualification Pipeline",
        description: "Automatically qualify, score, and route leads using AI agents with CRM integration",
        category: "sales",
        difficulty: "intermediate",
        estimatedTimeToImplement: "1-2 weeks",
        estimatedTimeSaved: "25 hours/week",
        roiEstimate: "350% in 6 months",
        requiredAgents: ["Sales Rep Agent", "CRM Integration"],
        optionalAgents: ["Email Marketing Agent"],
        integrations: ["HubSpot", "Salesforce", "Pipedrive"],
        workflowSteps: [
          {
            id: "1",
            title: "Lead Capture",
            description: "Automatically capture leads from multiple sources",
            agentResponsible: "Sales Rep Agent",
            estimatedDuration: "Instant",
            dependencies: [],
            automationLevel: "fully-automated"
          },
          {
            id: "2", 
            title: "Lead Scoring",
            description: "Score leads based on predefined criteria",
            agentResponsible: "Sales Rep Agent",
            estimatedDuration: "2 minutes",
            dependencies: ["1"],
            automationLevel: "fully-automated"
          },
          {
            id: "3",
            title: "Qualification Follow-up",
            description: "Send personalized follow-up messages",
            agentResponsible: "Sales Rep Agent",
            estimatedDuration: "5 minutes",
            dependencies: ["2"],
            automationLevel: "semi-automated"
          }
        ],
        triggerConditions: [
          {
            type: "event",
            condition: "New lead submitted",
            description: "Triggers when a new lead is captured from any source"
          }
        ],
        successMetrics: [
          {
            metric: "Lead Response Time",
            targetValue: "< 2 minutes",
            timeframe: "Immediate",
            description: "Time from lead capture to first response"
          },
          {
            metric: "Qualification Rate",
            targetValue: "85%+",
            timeframe: "Monthly",
            description: "Percentage of leads properly qualified"
          }
        ],
        implementationGuide: "1. Deploy Sales Rep Agent\n2. Connect CRM integration\n3. Configure lead scoring rules\n4. Set up automated workflows\n5. Test with sample leads",
        priority: 5,
        tags: ["sales", "automation", "crm", "leads"]
      },
      {
        title: "Content Creation & Publishing Workflow",
        description: "Automated content ideation, creation, approval, and multi-platform publishing",
        category: "marketing",
        difficulty: "beginner",
        estimatedTimeToImplement: "3-5 days",
        estimatedTimeSaved: "20 hours/week",
        roiEstimate: "280% in 4 months",
        requiredAgents: ["Content Producer", "Social Media Agent"],
        optionalAgents: ["SEO Agent"],
        integrations: ["Buffer", "Hootsuite", "WordPress", "Canva"],
        workflowSteps: [
          {
            id: "1",
            title: "Content Ideation",
            description: "Generate content ideas based on trends and audience",
            agentResponsible: "Content Producer",
            estimatedDuration: "30 minutes",
            dependencies: [],
            automationLevel: "semi-automated"
          },
          {
            id: "2",
            title: "Content Creation",
            description: "Create written content and visual assets",
            agentResponsible: "Content Producer",
            estimatedDuration: "2 hours",
            dependencies: ["1"],
            automationLevel: "semi-automated"
          },
          {
            id: "3",
            title: "Multi-Platform Publishing",
            description: "Publish content across all social media platforms",
            agentResponsible: "Social Media Agent",
            estimatedDuration: "15 minutes",
            dependencies: ["2"],
            automationLevel: "fully-automated"
          }
        ],
        triggerConditions: [
          {
            type: "time",
            condition: "Daily at 9 AM",
            description: "Triggers content creation workflow daily"
          }
        ],
        successMetrics: [
          {
            metric: "Content Output",
            targetValue: "10+ pieces/week",
            timeframe: "Weekly",
            description: "Volume of content created and published"
          },
          {
            metric: "Engagement Rate",
            targetValue: "5%+ increase",
            timeframe: "Monthly",
            description: "Social media engagement improvement"
          }
        ],
        implementationGuide: "1. Deploy Content Producer Agent\n2. Connect social media accounts\n3. Set content calendars\n4. Configure approval workflows\n5. Schedule recurring content",
        priority: 4,
        tags: ["marketing", "content", "social-media", "automation"]
      },
      {
        title: "Employee Onboarding Automation",
        description: "Streamlined new hire onboarding with automated document collection and training",
        category: "hr",
        difficulty: "intermediate", 
        estimatedTimeToImplement: "1 week",
        estimatedTimeSaved: "15 hours/week",
        roiEstimate: "200% in 8 months",
        requiredAgents: ["HR Agent", "Document Management Agent"],
        optionalAgents: ["Training Agent"],
        integrations: ["BambooHR", "Workday", "Slack", "DocuSign"],
        workflowSteps: [
          {
            id: "1",
            title: "Welcome Package Creation",
            description: "Generate personalized welcome materials",
            agentResponsible: "HR Agent",
            estimatedDuration: "1 hour",
            dependencies: [],
            automationLevel: "semi-automated"
          },
          {
            id: "2",
            title: "Document Collection",
            description: "Automatically request and track required documents",
            agentResponsible: "Document Management Agent",
            estimatedDuration: "Ongoing",
            dependencies: ["1"],
            automationLevel: "fully-automated"
          },
          {
            id: "3",
            title: "Training Assignment",
            description: "Assign and track completion of onboarding training",
            agentResponsible: "Training Agent",
            estimatedDuration: "2 weeks",
            dependencies: ["2"],
            automationLevel: "semi-automated"
          }
        ],
        triggerConditions: [
          {
            type: "event",
            condition: "New employee hired",
            description: "Triggers when a new employee is added to the system"
          }
        ],
        successMetrics: [
          {
            metric: "Onboarding Completion Time",
            targetValue: "< 3 days",
            timeframe: "Per new hire",
            description: "Time to complete all onboarding tasks"
          },
          {
            metric: "Document Compliance",
            targetValue: "100%",
            timeframe: "Per new hire",
            description: "Percentage of required documents collected"
          }
        ],
        implementationGuide: "1. Deploy HR Agent\n2. Connect HRIS system\n3. Create document templates\n4. Set up training modules\n5. Configure approval workflows",
        priority: 3,
        tags: ["hr", "onboarding", "compliance", "training"]
      }
    ];
  }
}