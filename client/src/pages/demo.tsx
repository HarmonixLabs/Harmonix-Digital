import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { MysticalTooltip, NeuralTooltip } from "@/components/ui/animated-tooltip";
import { DemoScenarioCard } from "@/components/demo/demo-scenario-card";
import { DemoExecution } from "@/components/demo/demo-execution";
import { InteractiveAgentChat } from "@/components/demo/interactive-agent-chat";
import { ConversionModal } from "@/components/demo/conversion-modal";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  demoScenarios, 
  getDemoScenariosByCategory, 
  getFeaturedDemoScenarios,
  type DemoScenario 
} from "@/data/demo-scenarios";
import { Play, Users, MessageCircle, Calendar, User, ArrowRight, Bot, Zap, DollarSign, Clock, Target, Star, Sparkles, CheckCircle, Send, Search, Filter, TrendingUp, BarChart3, MessageSquare, Upload, FileImage, X, Brain } from "lucide-react";
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
    integration: "✅ Connected: Stripe Payments, GoHighLevel CRM, OpenAI GPT-4o, Live Automation Workflows",
    sampleQuestions: [
      "How can I improve my sales conversion rate?",
      "What are my hottest leads this week?",
      "Create a follow-up sequence for my enterprise prospects",
      "Analyze my sales pipeline and identify bottlenecks"
    ]
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
    integration: "✅ Connected: Live Chat Widgets, Support Tickets, Knowledge Base, Live Automation Workflows",
    sampleQuestions: [
      "How can I reduce customer response time?",
      "Set up 24/7 customer support for my business",
      "What's the best way to handle negative reviews?",
      "Help me create a customer satisfaction survey"
    ]
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
    integration: "✅ Connected: Facebook, Instagram, LinkedIn, Twitter, Content Libraries, Live Automation Workflows",
    sampleQuestions: [
      "What are the best times to post on social media?",
      "Create a week's worth of content for my business",
      "How do I increase engagement on LinkedIn?",
      "Analyze my competitors' social media strategy"
    ]
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
    integration: "✅ Connected: Zapier, Make, API Integrations, Business Tools, Live Automation Workflows",
    sampleQuestions: [
      "How can I automate my invoice processing?",
      "Connect my CRM to email marketing platform",
      "What repetitive tasks can I eliminate?",
      "Build a customer onboarding workflow"
    ]
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
    integration: "✅ Connected: Asana, Monday.com, Slack, Teams, Calendar Apps, Live Automation Workflows",
    sampleQuestions: [
      "Help me plan a product launch timeline",
      "How can I improve team productivity?",
      "Optimize my project schedule for faster delivery",
      "What tasks are blocking our progress?"
    ]
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
    integration: "✅ Connected: All Agent Networks, OpenAI GPT-4o, Platform APIs, Master Automation Hub",
    sampleQuestions: [
      "Which AI agents do I need for my business?",
      "Create a complete automation strategy",
      "How can all agents work together efficiently?",
      "Analyze my business needs and recommend solutions"
    ]
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
  const [solInput, setSolInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [solResponse, setSolResponse] = useState("");
  
  // Scenario filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [runningDemo, setRunningDemo] = useState<DemoScenario | null>(null);
  const [showDemoExecution, setShowDemoExecution] = useState(false);
  const [demoView, setDemoView] = useState<'simple' | 'scenarios'>('simple');
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionContext, setConversionContext] = useState<any>(null);

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
      // Use the test endpoint that doesn't require authentication
      const response = await fetch('/api/test-pipedream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentId: `${agent.id}-agent`,
          action: getAgentAction(agent.id),
          data: {
            message: demoInput,
            user_input: demoInput,
            context: businessProfile,
            demo_mode: true,
            test_mode: true,
            timestamp: new Date().toISOString(),
            agent_name: agent.name
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.response) {
          // Use the actual AI response
          setAgentResponse(`${result.response}\n\n✅ **Live Agent Response Complete!**\n🔗 ${agent.name} successfully processed your request\n⚡ Real-time AI integration active\n📊 Connected to your business systems`);
        } else {
          throw new Error('Invalid response from agent');
        }
      } else {
        throw new Error('Agent processing failed');
      }
    } catch (error) {
      console.log('Live integration not available, showing demo response:', error);
      // Fallback to demo response if live integration isn't configured
      setAgentResponse(agent.demoResponse);
    }
    
    setIsProcessing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSolAnalysis = async () => {
    if (!solInput.trim() && uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    setSolResponse("");
    
    try {
      // Simulate SOL brain analysis
      const response = await fetch('/api/test-pipedream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentId: 'sol-agent',
          action: 'comprehensive_analysis',
          data: {
            message: solInput,
            user_input: solInput,
            context: businessProfile,
            files: uploadedFiles.map(f => f.name),
            demo_mode: true,
            test_mode: true,
            timestamp: new Date().toISOString(),
            agent_name: 'SŌL Brain'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.response) {
          setSolResponse(result.response);
        } else {
          throw new Error('Invalid response from SOL');
        }
      } else {
        throw new Error('SOL analysis failed');
      }
    } catch (error) {
      console.log('Live SOL integration not available, showing demo response:', error);
      // Fallback response for SOL
      setSolResponse(`# SŌL Brain Comprehensive Analysis

## 🧠 Strategic Overview
I've analyzed your business context and uploaded materials. Based on your ${businessProfile.industry || 'business'} industry focus and ${businessProfile.goal || 'growth objectives'}, here's my comprehensive assessment:

## 🎯 Recommended Agent Deployment Strategy

### Phase 1: Foundation (Week 1-2)
• Deploy **CA$H Agent** for immediate sales pipeline optimization
• Integrate **GRACE Agent** for customer experience enhancement
• Expected ROI: 200-300% within 60 days

### Phase 2: Automation (Week 3-4)
• Activate **FLOW Agent** for process automation
• Deploy **KAIROS Agent** for project coordination
• Expected efficiency gains: 40-60%

### Phase 3: Growth (Month 2-3)
• Launch **ECHO Agent** for social media amplification
• Full **SŌL Brain** orchestration activation
• Expected market expansion: 2-5x

## 📊 Projected Business Impact
• Revenue increase: 150-400% within 90 days
• Operational efficiency: +65%
• Customer satisfaction: +80%
• Time savings: 25-35 hours per week

## 🚀 Next Steps
1. **Reserve your priority spot** with $444 deposit
2. **Schedule strategy session** with our team
3. **Begin Phase 1 deployment** within 48 hours

*This analysis leverages our proprietary business intelligence and 10,000+ successful implementations.*`);
    }
    
    setIsProcessing(false);
  };
  
  // Format agent response with proper sections
  const formatAgentResponse = (response: string) => {
    // Split response by double newlines or specific markers
    const sections = response.split(/\n\n|\*\*|✅|🔗|⚡|📊|💡/);
    
    return (
      <div className="space-y-3">
        {sections.map((section, index) => {
          const trimmedSection = section.trim();
          if (!trimmedSection) return null;
          
          // Check if this is a special section (starts with emoji or has specific keywords)
          const isHighlight = trimmedSection.includes('Live Agent Response') || 
                            trimmedSection.includes('Demo Mode') ||
                            trimmedSection.includes('successfully processed');
          
          return (
            <div key={index} className={`${isHighlight ? 'p-3 bg-harmonix-regal-gold/10 rounded-lg border border-harmonix-regal-gold/30' : ''}`}>
              {isHighlight ? (
                <div className="text-sm text-harmonix-regal-gold">
                  {trimmedSection}
                </div>
              ) : (
                <p className="text-white/90 leading-relaxed">
                  {trimmedSection}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
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

              {/* Interactive Agent Chat */}
              <div className="lg:w-2/3">
                <InteractiveAgentChat 
                  agent={demoAgents[selectedAgent]}
                  businessProfile={businessProfile}
                />
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
                      {!solExpanded ? (
                        <Button 
                          size="lg"
                          className="w-full bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 text-lg font-semibold"
                          onClick={() => setSolExpanded(true)}
                        >
                          <Brain className="w-5 h-5 mr-2" />
                          Activate SŌL Brain Analysis
                        </Button>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-harmonix-regal-gold flex items-center gap-2">
                              <Brain className="w-6 h-6" />
                              SŌL Brain Analysis
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSolExpanded(false)}
                              className="text-white/60 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-harmonix-regal-gold mb-2 block">
                                Business Challenge or Question
                              </label>
                              <Textarea
                                value={solInput}
                                onChange={(e) => setSolInput(e.target.value)}
                                placeholder="Describe your business challenge, goals, or ask for strategic analysis..."
                                className="bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white placeholder:text-white/50 min-h-[100px]"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-harmonix-regal-gold mb-2 block">
                                Upload Business Documents (Optional)
                              </label>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.jpg,.png"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    className="border-harmonix-sage-fade/30 text-white hover:bg-white/5"
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Choose Files
                                  </Button>
                                  <span className="text-xs text-white/60">
                                    PDF, DOC, TXT, CSV, XLSX, Images
                                  </span>
                                </div>
                                
                                {uploadedFiles.length > 0 && (
                                  <div className="space-y-2">
                                    {uploadedFiles.map((file, index) => (
                                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                                        <div className="flex items-center gap-2">
                                          <FileImage className="w-4 h-4 text-harmonix-regal-gold" />
                                          <span className="text-sm text-white">{file.name}</span>
                                          <span className="text-xs text-white/60">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeFile(index)}
                                          className="text-white/60 hover:text-red-400 p-1"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Button
                              size="lg"
                              className="w-full bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 text-lg font-semibold"
                              onClick={handleSolAnalysis}
                              disabled={isProcessing || (!solInput.trim() && uploadedFiles.length === 0)}
                            >
                              {isProcessing ? (
                                <WhimsicalLoader variant="neural" message="SŌL Brain analyzing..." />
                              ) : (
                                <>
                                  <Sparkles className="w-5 h-5 mr-2" />
                                  Generate Comprehensive Analysis
                                </>
                              )}
                            </Button>
                            
                            {solResponse && (
                              <div className="mt-6 p-6 bg-black/20 rounded-lg border border-harmonix-regal-gold/20">
                                <div className="prose prose-invert max-w-none">
                                  <div className="whitespace-pre-line text-sm leading-relaxed">
                                    {solResponse}
                                  </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-harmonix-sage-fade/20 flex gap-3">
                                  <Button
                                    variant="outline"
                                    className="border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                                    onClick={() => window.location.href = '/join?deposit=444'}
                                  >
                                    Reserve Priority Spot ($444)
                                  </Button>
                                  <Button
                                    className="bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                                    onClick={() => window.location.href = '/pricing'}
                                  >
                                    View Full Packages
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
      
      {/* Conversion Modal */}
      <ConversionModal
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
        agent={conversionContext?.agent || demoAgents[selectedAgent]}
        actionPlan={conversionContext?.actionPlan}
        context={conversionContext?.context}
      />
    </div>
  );
}