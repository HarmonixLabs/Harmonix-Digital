import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Target, TrendingUp, Users, Clock, ArrowRight, Star, CheckCircle } from "lucide-react";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredButton } from "@/components/ui/sacred-button";
import { FadeIn, StaggerContainer } from "@/components/ui/micro-animations";

interface WorkflowSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'sales' | 'operations' | 'marketing' | 'support' | 'analytics';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  expectedROI: string;
  confidence: number;
  steps: WorkflowStep[];
  requiredAgents: string[];
  benefits: string[];
  industry?: string;
  priority: 'high' | 'medium' | 'low';
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  agent?: string;
  estimatedDuration: string;
  automationLevel: number;
}

interface UserContext {
  industry?: string;
  role?: string;
  companySize?: string;
  primaryGoals?: string[];
  currentAgents?: string[];
  experience?: string;
  painPoints?: string[];
}

interface IntelligentWorkflowEngineProps {
  userContext: UserContext;
  onWorkflowSelect: (workflow: WorkflowSuggestion) => void;
  onStartWorkflow: (workflowId: string) => void;
}

export function IntelligentWorkflowEngine({ 
  userContext, 
  onWorkflowSelect, 
  onStartWorkflow 
}: IntelligentWorkflowEngineProps) {
  const [suggestions, setSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    analyzeAndGenerateSuggestions();
  }, [userContext]);

  const analyzeAndGenerateSuggestions = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with intelligent suggestions
    setTimeout(() => {
      const generatedSuggestions = generateIntelligentSuggestions(userContext);
      setSuggestions(generatedSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateIntelligentSuggestions = (context: UserContext): WorkflowSuggestion[] => {
    const suggestions: WorkflowSuggestion[] = [];

    // High-priority suggestions based on context
    if (context.primaryGoals?.includes('increase-sales') || context.role?.toLowerCase().includes('sales')) {
      suggestions.push({
        id: 'lead-qualification-workflow',
        title: 'Automated Lead Qualification Pipeline',
        description: 'Automatically score, qualify, and route leads based on predefined criteria',
        category: 'sales',
        difficulty: 'intermediate',
        estimatedTime: '2-3 hours',
        expectedROI: '40-60% increase in qualified leads',
        confidence: 92,
        priority: 'high',
        steps: [
          {
            id: 'step1',
            title: 'Deploy Sales Agent',
            description: 'Configure agent with lead scoring parameters',
            agent: 'Sales Agent',
            estimatedDuration: '30 min',
            automationLevel: 85
          },
          {
            id: 'step2',
            title: 'Setup CRM Integration',
            description: 'Connect to your existing CRM system',
            estimatedDuration: '45 min',
            automationLevel: 95
          },
          {
            id: 'step3',
            title: 'Configure Qualification Rules',
            description: 'Define scoring criteria and routing logic',
            estimatedDuration: '60 min',
            automationLevel: 90
          }
        ],
        requiredAgents: ['Sales Agent', 'CRM Integration Agent'],
        benefits: [
          'Reduce manual lead review by 80%',
          'Increase lead response time by 300%',
          'Improve conversion rates by 25-40%'
        ],
        industry: context.industry
      });
    }

    if (context.painPoints?.includes('manual-repetitive-tasks')) {
      suggestions.push({
        id: 'process-automation-workflow',
        title: 'End-to-End Process Automation',
        description: 'Automate repetitive business processes and eliminate manual bottlenecks',
        category: 'operations',
        difficulty: 'beginner',
        estimatedTime: '1-2 hours',
        expectedROI: '30-50% time savings',
        confidence: 88,
        priority: 'high',
        steps: [
          {
            id: 'step1',
            title: 'Process Mapping',
            description: 'Identify and map current manual processes',
            estimatedDuration: '30 min',
            automationLevel: 0
          },
          {
            id: 'step2',
            title: 'Deploy Process Agent',
            description: 'Configure automation workflows',
            agent: 'Process Automation Agent',
            estimatedDuration: '45 min',
            automationLevel: 90
          },
          {
            id: 'step3',
            title: 'Testing & Optimization',
            description: 'Test workflows and optimize performance',
            estimatedDuration: '30 min',
            automationLevel: 75
          }
        ],
        requiredAgents: ['Process Automation Agent'],
        benefits: [
          'Eliminate 70% of manual tasks',
          'Reduce processing time by 60%',
          'Increase accuracy by 95%'
        ]
      });
    }

    // Industry-specific suggestions
    if (context.industry === 'real estate') {
      suggestions.push({
        id: 'property-management-workflow',
        title: 'Automated Property Management System',
        description: 'Streamline property listings, client communications, and showing scheduling',
        category: 'operations',
        difficulty: 'intermediate',
        estimatedTime: '3-4 hours',
        expectedROI: '25-35% efficiency gain',
        confidence: 85,
        priority: 'medium',
        steps: [
          {
            id: 'step1',
            title: 'Property Listing Automation',
            description: 'Auto-generate and distribute property listings',
            agent: 'Real Estate Agent',
            estimatedDuration: '60 min',
            automationLevel: 85
          },
          {
            id: 'step2',
            title: 'Client Communication System',
            description: 'Automated follow-ups and scheduling',
            estimatedDuration: '90 min',
            automationLevel: 90
          }
        ],
        requiredAgents: ['Real Estate Agent', 'Communication Agent'],
        benefits: [
          'Reduce listing time by 50%',
          'Automate 80% of client communications',
          'Increase showing bookings by 40%'
        ],
        industry: 'real estate'
      });
    }

    if (context.primaryGoals?.includes('enhance-customer-experience')) {
      suggestions.push({
        id: 'customer-experience-workflow',
        title: 'AI-Powered Customer Experience Engine',
        description: 'Create personalized customer journeys with intelligent touchpoint optimization',
        category: 'support',
        difficulty: 'advanced',
        estimatedTime: '4-5 hours',
        expectedROI: '20-30% CSAT improvement',
        confidence: 90,
        priority: 'medium',
        steps: [
          {
            id: 'step1',
            title: 'Customer Journey Mapping',
            description: 'Analyze and map customer touchpoints',
            estimatedDuration: '90 min',
            automationLevel: 60
          },
          {
            id: 'step2',
            title: 'Deploy Customer Service Agent',
            description: 'Configure AI-powered support system',
            agent: 'Customer Service Agent',
            estimatedDuration: '120 min',
            automationLevel: 85
          },
          {
            id: 'step3',
            title: 'Personalization Engine',
            description: 'Setup dynamic content and experience personalization',
            estimatedDuration: '90 min',
            automationLevel: 80
          }
        ],
        requiredAgents: ['Customer Service Agent', 'Analytics Agent'],
        benefits: [
          'Increase customer satisfaction by 30%',
          'Reduce support tickets by 40%',
          'Improve retention by 25%'
        ]
      });
    }

    // Experience-based suggestions
    if (context.experience === 'beginner') {
      suggestions.push({
        id: 'quick-wins-workflow',
        title: 'Quick Wins Starter Pack',
        description: 'Easy-to-implement automations that deliver immediate value',
        category: 'operations',
        difficulty: 'beginner',
        estimatedTime: '1 hour',
        expectedROI: '15-25% immediate efficiency',
        confidence: 95,
        priority: 'high',
        steps: [
          {
            id: 'step1',
            title: 'Email Automation',
            description: 'Setup automated email responses and follow-ups',
            estimatedDuration: '20 min',
            automationLevel: 95
          },
          {
            id: 'step2',
            title: 'Basic Reporting',
            description: 'Automated daily/weekly reports',
            estimatedDuration: '25 min',
            automationLevel: 90
          },
          {
            id: 'step3',
            title: 'Task Scheduling',
            description: 'Automate routine task scheduling',
            estimatedDuration: '15 min',
            automationLevel: 85
          }
        ],
        requiredAgents: ['Email Agent', 'Analytics Agent'],
        benefits: [
          'See results within 24 hours',
          'Zero learning curve required',
          'Perfect foundation for advanced workflows'
        ]
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence;
    });
  };

  const categories = [
    { id: 'all', label: 'All Suggestions', icon: Brain },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'operations', label: 'Operations', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: Target },
    { id: 'support', label: 'Support', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Zap }
  ];

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-harmonix-sage border-harmonix-sage';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-harmonix-sage';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0.2}>
          <SacredCard className="p-8 text-center">
            <Brain className="h-16 w-16 text-harmonix-gold mx-auto mb-4 animate-pulse" />
            <h3 className="harmonix-header-font text-xl text-white mb-2">
              Analyzing Your Workflow Needs
            </h3>
            <p className="text-harmonix-sage mb-4">
              AI is examining your context to suggest optimal automation workflows
            </p>
            <Progress value={75} className="h-2 bg-harmonix-pine/30" />
          </SacredCard>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn delay={0.2}>
        <div className="text-center mb-8">
          <Brain className="h-12 w-12 text-harmonix-gold mx-auto mb-4" />
          <h2 className="harmonix-header-font text-2xl text-white mb-2">
            Intelligent Workflow Suggestions
          </h2>
          <p className="text-harmonix-sage">
            AI-generated workflows tailored to your business needs and goals
          </p>
        </div>
      </FadeIn>

      {/* Category Filter */}
      <FadeIn delay={0.3}>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <SacredButton
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-harmonix-gold text-harmonix-black" 
                  : "border-harmonix-sage/30 text-harmonix-sage hover:border-harmonix-gold hover:text-harmonix-gold"
                }
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {category.label}
              </SacredButton>
            );
          })}
        </div>
      </FadeIn>

      {/* Workflow Suggestions */}
      <StaggerContainer>
        <div className="grid gap-6">
          {filteredSuggestions.map((workflow, index) => (
            <FadeIn key={workflow.id} delay={0.1 * index}>
              <SacredCard className="p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="harmonix-header-font text-lg text-white mb-2">
                      {workflow.title}
                    </h3>
                    <p className="text-harmonix-sage text-sm mb-3">
                      {workflow.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(workflow.priority)}`}>
                      {workflow.priority} priority
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-harmonix-gold" />
                      <span className="text-xs text-harmonix-gold">{workflow.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-harmonix-sage">Difficulty</div>
                    <div className={`text-sm font-medium ${getDifficultyColor(workflow.difficulty)}`}>
                      {workflow.difficulty}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-harmonix-sage">Time Required</div>
                    <div className="text-sm text-white">{workflow.estimatedTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-harmonix-sage">Expected ROI</div>
                    <div className="text-sm text-harmonix-gold">{workflow.expectedROI}</div>
                  </div>
                  <div>
                    <div className="text-xs text-harmonix-sage">Agents Needed</div>
                    <div className="text-sm text-white">{workflow.requiredAgents.length}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-harmonix-sage mb-2">Key Benefits</div>
                  <div className="flex flex-wrap gap-1">
                    {workflow.benefits.slice(0, 3).map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-harmonix-sage border-harmonix-sage/30">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <SacredButton
                    variant="outline"
                    size="sm"
                    onClick={() => onWorkflowSelect(workflow)}
                    className="border-harmonix-sage/30 text-harmonix-sage hover:border-harmonix-gold hover:text-harmonix-gold"
                  >
                    View Details
                  </SacredButton>
                  <SacredButton
                    size="sm"
                    onClick={() => onStartWorkflow(workflow.id)}
                    className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                  >
                    Start Workflow
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </SacredButton>
                </div>
              </SacredCard>
            </FadeIn>
          ))}
        </div>
      </StaggerContainer>

      {filteredSuggestions.length === 0 && (
        <FadeIn delay={0.4}>
          <SacredCard className="p-8 text-center">
            <Brain className="h-12 w-12 text-harmonix-sage mx-auto mb-4" />
            <h3 className="harmonix-header-font text-lg text-white mb-2">
              No Suggestions Found
            </h3>
            <p className="text-harmonix-sage">
              Try selecting a different category or update your profile for more personalized suggestions.
            </p>
          </SacredCard>
        </FadeIn>
      )}
    </div>
  );
}