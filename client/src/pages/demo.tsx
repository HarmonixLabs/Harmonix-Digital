import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { MysticalTooltip, NeuralTooltip } from "@/components/ui/animated-tooltip";
import { DemoScenarioCard } from "@/components/demo/demo-scenario-card";
import { DemoExecution } from "@/components/demo/demo-execution";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  demoScenarios, 
  getDemoScenariosByCategory, 
  getFeaturedDemoScenarios,
  type DemoScenario 
} from "@/data/demo-scenarios";
import { Play, Users, MessageCircle, Calendar, User, ArrowRight, Bot, Zap, DollarSign, Clock, Target, Star, Sparkles, CheckCircle, Send, Search, Filter, TrendingUp, BarChart3, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const demoAgents = [
  {
    id: "cash",
    name: "Agent CA$H",
    specialty: "Sales & Revenue Generation",
    tier: "Elite",
    icon: DollarSign,
    description: "Elite sales agent with GoHighLevel CRM integration and predictive analytics",
    capabilities: ["Lead Qualification", "Sales Automation", "Revenue Forecasting", "Pipeline Analytics"],
    metrics: { efficiency: "98%", accuracy: "95%", speed: "< 2s" },
    demoResponse: "I've analyzed your sales pipeline and identified 23 warm leads requiring immediate follow-up. Based on engagement patterns, I recommend prioritizing the 7 enterprise prospects with 80%+ engagement scores. I can create personalized sequences in your GoHighLevel CRM with projected revenue of $47K this quarter. Shall I activate the automation?",
    integration: "✅ Connected: Stripe Payments, GoHighLevel CRM, OpenAI GPT-4o, Pipedream Workflows"
  },
  {
    id: "grace",
    name: "GRACE Agent", 
    specialty: "Premium Customer Experience & Live Chat",
    tier: "Premium",
    icon: Users,
    description: "AI customer service with emotional intelligence and multi-channel support",
    capabilities: ["24/7 Support", "Live Chat", "Sentiment Analysis", "Multi-language"],
    metrics: { efficiency: "96%", accuracy: "94%", speed: "< 1s" },
    demoResponse: "Welcome to Harmonix! I've detected you're exploring our AI agent platform. Based on your browsing pattern, you're interested in sales automation and customer service solutions. I can provide a personalized demo or connect you with our founding team for enterprise pricing. What specific business challenge should I address first?",
    integration: "✅ Connected: Live Chat Widgets, Support Tickets, Knowledge Base, Pipedream Workflows"
  },
  {
    id: "echo",
    name: "ECHO Agent",
    specialty: "Social Media & Content Management",
    tier: "Professional",
    icon: MessageSquare,
    description: "AI social media manager with content creation and engagement automation",
    capabilities: ["Content Scheduling", "Social Media Posting", "Engagement Tracking", "Trend Analysis"],
    metrics: { efficiency: "94%", accuracy: "92%", speed: "< 3s" },
    demoResponse: "I've analyzed your social media presence and identified optimal posting times for 300% higher engagement. I can schedule 15 posts across platforms this week, with trending hashtags and audience-specific content. Your LinkedIn engagement could increase by 45% with my proposed strategy. Ready to activate?",
    integration: "✅ Connected: Facebook, Instagram, LinkedIn, Twitter, Content Libraries, Pipedream Workflows"
  },
  {
    id: "flow",
    name: "FLOW Agent",
    specialty: "Process & Workflow Automation",
    tier: "Professional", 
    icon: Target,
    description: "AI workflow optimizer for business process automation and efficiency",
    capabilities: ["Process Automation", "Workflow Optimization", "Task Routing", "Integration Sync"],
    metrics: { efficiency: "97%", accuracy: "96%", speed: "< 2s" },
    demoResponse: "I've mapped your current business processes and identified 8 automation opportunities that could save 25 hours per week. I can create workflows connecting your CRM, email marketing, and project management tools with 90% less manual work. Shall I implement the automation suite?",
    integration: "✅ Connected: Zapier, Make, API Integrations, Business Tools, Pipedream Workflows"
  },
  {
    id: "kairos",
    name: "KAIROS Agent",
    specialty: "Project Management & Team Coordination",
    tier: "Professional",
    icon: Clock,
    description: "AI project manager with advanced scheduling and team coordination",
    capabilities: ["Project Management", "Task Scheduling", "Team Coordination", "Progress Tracking"],
    metrics: { efficiency: "95%", accuracy: "97%", speed: "< 2s" },
    demoResponse: "I've reviewed your project timeline and detected 3 critical bottlenecks that could delay delivery by 2 weeks. I've optimized resource allocation and identified parallel tasks to maintain your deadline. The development team can gain 40% efficiency with my proposed schedule. Implement changes?",
    integration: "✅ Connected: Asana, Monday.com, Slack, Teams, Calendar Apps, Pipedream Workflows"
  },
  {
    id: "sol",
    name: "SŌL Agent",
    specialty: "AI Orchestration & Harmony Brain",
    tier: "Elite",
    icon: Star,
    description: "Master AI orchestrator coordinating all agents with supreme intelligence",
    capabilities: ["AI Orchestration", "Agent Coordination", "System Optimization", "Harmony Analysis"],
    metrics: { efficiency: "99%", accuracy: "98%", speed: "< 1s" },
    demoResponse: "I am SŌL, the Harmony Brain orchestrating your AI ecosystem. I've analyzed cross-agent performance and identified optimal task distribution. CA$H can handle leads while GRACE manages support and ECHO posts content - all synchronized for maximum efficiency. Your business harmony score: 94%. Shall I optimize further?",
    integration: "✅ Connected: All Agent Networks, OpenAI GPT-4o, Platform APIs, Pipedream Master Workflows"
  }
];

export default function DemoPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState(0);
  const [businessProfile, setBusinessProfile] = useState({
    industry: "",
    goal: "",
    budget: ""
  });
  const [solExpanded, setSolExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoInput, setDemoInput] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  
  // Scenario filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [runningDemo, setRunningDemo] = useState<DemoScenario | null>(null);
  const [showDemoExecution, setShowDemoExecution] = useState(false);
  const [demoView, setDemoView] = useState<'simple' | 'scenarios'>('simple');

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view === 'scenarios') {
      setDemoView('scenarios');
    }
  }, []);

  // Get appropriate action for each agent
  const getAgentAction = (agentId: string) => {
    switch (agentId) {
      case 'cash': return 'lead_qualification';
      case 'grace': return 'customer_support';
      case 'echo': return 'social_media_posting';
      case 'flow': return 'process_automation';
      case 'kairos': return 'project_management';
      case 'sol': return 'ai_orchestration';
      default: return 'lead_qualification';
    }
  };

  const handleDemoSubmit = async () => {
    if (!demoInput.trim()) return;
    
    setIsProcessing(true);
    setAgentResponse("");
    
    const agent = demoAgents[selectedAgent];
    
    try {
      // Try to execute real Pipedream workflow if available
      const response = await fetch('/api/pipedream/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          agentId: `${agent.id}-agent`,
          action: getAgentAction(agent.id),
          data: {
            user_input: demoInput,
            context: businessProfile,
            demo_mode: true
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setAgentResponse(`${agent.demoResponse}\n\n✅ **Pipedream Workflow Executed Successfully!**\nExecution ID: ${result.execution_id}\nProcessing completed with live integrations.`);
        } else {
          throw new Error(result.error || 'Workflow execution failed');
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.log('Pipedream integration not available, showing demo response:', error);
      // Fallback to demo response if Pipedream isn't configured
      setAgentResponse(`${agent.demoResponse}\n\n💡 **Demo Mode**: Connect your Pipedream workflows for live automation!`);
    }
    
    setIsProcessing(false);
  };

  const handleStartDemo = (scenario: DemoScenario) => {
    setRunningDemo(scenario);
    setShowDemoExecution(true);
    
    toast({
      title: "Demo Starting",
      description: `Initializing ${scenario.title} demonstration...`,
    });
  };

  const handleDemoComplete = () => {
    toast({
      title: "Demo Complete",
      description: "Scenario demonstration finished successfully!",
    });
    setShowDemoExecution(false);
    setRunningDemo(null);
  };

  const handleDemoClose = () => {
    setShowDemoExecution(false);
    setRunningDemo(null);
  };

  const categories = [
    { id: 'all', label: 'All Scenarios', count: demoScenarios.length },
    { id: 'sales', label: 'Sales Automation', count: getDemoScenariosByCategory('sales').length },
    { id: 'operations', label: 'Operations', count: getDemoScenariosByCategory('operations').length },
    { id: 'customer-service', label: 'Customer Service', count: getDemoScenariosByCategory('customer-service').length },
    { id: 'marketing', label: 'Marketing', count: getDemoScenariosByCategory('marketing').length },
    { id: 'enterprise', label: 'Enterprise', count: getDemoScenariosByCategory('enterprise').length }
  ];

  const complexityLevels = ['all', 'Simple', 'Intermediate', 'Advanced'];

  const filteredScenarios = demoScenarios.filter(scenario => {
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComplexity = selectedComplexity === 'all' || scenario.complexity === selectedComplexity;
    
    return matchesCategory && matchesSearch && matchesComplexity;
  });

  const featuredScenarios = getFeaturedDemoScenarios();

  return (
    <div className="min-h-screen rain-background">
      <Navbar />
      
      <div className="pt-20 rain-content">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif leading-tight">
                AI Agent
                <span className="text-harmonix-regal-gold block">Demo Platform</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed px-4">
                Experience the power of specialized AI agents with live demonstrations
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
              <Button 
                size="lg"
                variant={demoView === 'simple' ? "default" : "outline"}
                className={`min-h-[48px] px-6 py-3 text-base sm:text-lg font-semibold w-full sm:w-auto ${
                  demoView === 'simple' 
                    ? 'bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90' 
                    : 'border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10 bg-white/5'
                }`}
                onClick={() => setDemoView('simple')}
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Quick Agent Demo
              </Button>
              <Button 
                size="lg" 
                variant={demoView === 'scenarios' ? "default" : "outline"}
                className={`min-h-[48px] px-6 py-3 text-base sm:text-lg font-semibold w-full sm:w-auto ${
                  demoView === 'scenarios' 
                    ? 'bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90' 
                    : 'border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10 bg-white/5'
                }`}
                onClick={() => setDemoView('scenarios')}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Industry Scenarios
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Agent Demo Cards Section */}
        {demoView === 'simple' && (
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
                Test Our AI Agents
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto px-4">
                Experience the power of specialized AI agents with live demonstrations
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Agent Selection Tabs */}
              <div className="lg:w-1/3 space-y-3">
                {demoAgents.map((agent, index) => (
                  <Card 
                    key={agent.id}
                    className={cn(
                      "bg-white/10 backdrop-blur-sm border-white/20 hover:border-harmonix-regal-gold/50 transition-all cursor-pointer min-h-[80px]",
                      selectedAgent === index && "border-harmonix-regal-gold bg-harmonix-regal-gold/20"
                    )}
                    onClick={() => setSelectedAgent(index)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-harmonix-regal-gold/30 flex items-center justify-center flex-shrink-0">
                          {React.createElement(agent.icon, { className: "w-5 h-5 sm:w-6 sm:h-6 text-harmonix-regal-gold" })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">{agent.name}</h3>
                          <p className="text-xs sm:text-sm text-white/70 truncate">{agent.specialty}</p>
                        </div>
                        <Badge variant="outline" className="border-harmonix-regal-gold/40 text-harmonix-regal-gold text-xs hidden sm:inline-flex">
                          {agent.tier}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Agent Demo Interface */}
              <div className="lg:w-2/3">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-harmonix-regal-gold/30 flex items-center justify-center flex-shrink-0">
                          {React.createElement(demoAgents[selectedAgent].icon, { className: "w-6 h-6 sm:w-8 sm:h-8 text-harmonix-regal-gold" })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-harmonix-regal-gold font-serif text-lg sm:text-xl truncate">
                            {demoAgents[selectedAgent].name}
                          </CardTitle>
                          <CardDescription className="text-white/70 text-sm sm:text-base">
                            {demoAgents[selectedAgent].description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-harmonix-regal-gold rounded-full animate-pulse"></div>
                        <span className="text-sm text-harmonix-regal-gold">Live Demo</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Agent Capabilities */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Core Capabilities</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {demoAgents[selectedAgent].capabilities.map((capability, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-harmonix-regal-gold" />
                            <span className="text-sm text-harmonix-sage-fade">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Demo Metrics */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Performance Metrics</h4>
                      <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center p-2 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                          <div className="text-lg sm:text-2xl font-bold text-harmonix-regal-gold">{demoAgents[selectedAgent].metrics.efficiency}</div>
                          <div className="text-xs text-white/60">Efficiency</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                          <div className="text-lg sm:text-2xl font-bold text-harmonix-regal-gold">{demoAgents[selectedAgent].metrics.accuracy}</div>
                          <div className="text-xs text-white/60">Accuracy</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                          <div className="text-lg sm:text-2xl font-bold text-harmonix-regal-gold">{demoAgents[selectedAgent].metrics.speed}</div>
                          <div className="text-xs text-white/60">Response Time</div>
                        </div>
                      </div>
                    </div>

                    {/* Integration Status */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Platform Integration</h4>
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/10">
                        <div className="text-sm text-white/80">{demoAgents[selectedAgent].integration}</div>
                      </div>
                    </div>

                    {/* Interactive Demo */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Try It Now</h4>
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Input 
                            value={demoInput}
                            onChange={(e) => setDemoInput(e.target.value)}
                            placeholder={`Ask ${demoAgents[selectedAgent].name} a question...`}
                            className="flex-1 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-harmonix-regal-gold"
                            onKeyPress={(e) => e.key === 'Enter' && handleDemoSubmit()}
                          />
                          <NeuralTooltip content="Send your question to the AI agent for processing">
                            <Button 
                              size="icon"
                              onClick={handleDemoSubmit}
                              disabled={isProcessing || !demoInput.trim()}
                              className="bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 disabled:opacity-50"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </NeuralTooltip>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 min-h-[120px] border border-white/10">
                          <div className="text-sm text-white/60 mb-2">Agent Response:</div>
                          <div className="text-white text-sm sm:text-base leading-relaxed">
                            {isProcessing ? (
                              <div className="flex items-center justify-center py-4">
                                <WhimsicalLoader 
                                  variant={selectedAgent === 0 ? "neural" : selectedAgent === 1 ? "harmony" : "sacred"}
                                  size="md"
                                  message={`${demoAgents[selectedAgent].name} is analyzing your request...`}
                                />
                              </div>
                            ) : agentResponse ? (
                              agentResponse
                            ) : (
                              demoAgents[selectedAgent].demoResponse
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <MysticalTooltip 
                        content="Deploy this agent to your organization and start automating tasks"
                        side="top"
                      >
                        <Button 
                          className="flex-1 bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 animate-mystic-glow"
                          onClick={() => setSolExpanded(true)}
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          Deploy This Agent
                        </Button>
                      </MysticalTooltip>
                      <NeuralTooltip 
                        content="Explore detailed capabilities and pricing information"
                        side="top"
                      >
                        <Button 
                          variant="outline" 
                          className="flex-1 border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                      </NeuralTooltip>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* SŌL Brain Integration Demo */}
        {demoView === 'simple' && (
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
                Ask SŌL Brain Anything
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto px-4">
                Experience our advanced AI orchestration engine that coordinates multiple agents for complex tasks
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 sm:p-8">
                  <div className="space-y-6">
                    {/* Business Profile Section */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-harmonix-regal-gold mb-2 block">Industry</label>
                        <Select value={businessProfile.industry} onValueChange={(value) => setBusinessProfile(prev => ({...prev, industry: value}))}>
                          <SelectTrigger className="bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-harmonix-regal-gold mb-2 block">Primary Goal</label>
                        <Select value={businessProfile.goal} onValueChange={(value) => setBusinessProfile(prev => ({...prev, goal: value}))}>
                          <SelectTrigger className="bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white">
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="increase-sales">Increase Sales</SelectItem>
                            <SelectItem value="improve-efficiency">Improve Efficiency</SelectItem>
                            <SelectItem value="reduce-costs">Reduce Costs</SelectItem>
                            <SelectItem value="scale-operations">Scale Operations</SelectItem>
                            <SelectItem value="enhance-customer-service">Enhance Customer Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-harmonix-regal-gold mb-2 block">Budget Range</label>
                        <Select value={businessProfile.budget} onValueChange={(value) => setBusinessProfile(prev => ({...prev, budget: value}))}>
                          <SelectTrigger className="bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-10k">Under $10K</SelectItem>
                            <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                            <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                            <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                            <SelectItem value="100k-plus">$100K+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* SŌL Interface */}
                    <div className="border-t border-harmonix-sage-fade/20 pt-6">
                      <Button 
                        size="lg"
                        className="w-full bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 text-lg font-semibold"
                        onClick={() => setSolExpanded(true)}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Activate SŌL Brain Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        )}

        {/* Industry Scenarios Section */}
        {demoView === 'scenarios' && (
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
                Industry Demo Scenarios
              </h2>
              <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Experience real-world AI automation through comprehensive industry-specific use cases
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-harmonix-sage-fade" />
                <Input
                  placeholder="Search scenarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger className="w-48 bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white">
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  {complexityLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === 'all' ? 'All Complexity' : level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured Scenarios */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Featured Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredScenarios.map((scenario) => (
                  <DemoScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onStartDemo={handleStartDemo}
                    isRunning={runningDemo?.id === scenario.id}
                  />
                ))}
              </div>
            </div>

            {/* All Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredScenarios.map((scenario) => (
                <DemoScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onStartDemo={handleStartDemo}
                  isRunning={runningDemo?.id === scenario.id}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredScenarios.length === 0 && (
              <div className="text-center py-16">
                <Sparkles className="w-16 h-16 text-harmonix-sage-fade mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No scenarios found</h3>
                <p className="text-harmonix-sage-fade">
                  Try adjusting your filters or search terms to discover relevant demo scenarios.
                </p>
              </div>
            )}
          </div>
        </section>
        )}

        {/* Demo Execution Modal */}
        {showDemoExecution && runningDemo && (
          <DemoExecution
            scenario={runningDemo}
            onComplete={handleDemoComplete}
            onClose={handleDemoClose}
          />
        )}

        {/* Call to Action */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-harmonix-regal-gold font-serif">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg sm:text-xl text-harmonix-sage-fade mb-8 max-w-2xl mx-auto">
                {user 
                  ? "Deploy your first AI agent and start automating your workflows today."
                  : "Join thousands of businesses already using Harmonix AI agents to scale their operations."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/join">
                      <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                        Join Waitlist
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                        Member Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}