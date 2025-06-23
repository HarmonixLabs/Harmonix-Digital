import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { SolBrain } from "@/components/sol-brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { Play, Users, MessageCircle, Calendar, User, ArrowRight, Lock, Bot, Zap, DollarSign, Clock, Target, Star, Sparkles, CheckCircle, InfoIcon, Mic, MicOff, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedSolInterface } from "@/components/demo/enhanced-sol-interface";

export default function DemoPage() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState(0);
  const [solExpanded, setSolExpanded] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [businessProfile, setBusinessProfile] = useState({
    industry: '',
    goal: '',
    budget: ''
  });

  const demoAgents = [
    {
      id: "sales-rep",
      name: "Sales Rep Agent",
      description: "Books, follows up, and closes for you.",
      monthlyPrice: 320,
      tokenUsage: "Moderate",
      timeSaved: "22 hrs/week",
      integrations: ["GHL", "Slack", "HubSpot", "Stripe"],
      features: ["Lead qualification", "Follow-up automation", "Deal closing", "Pipeline management"],
      demoAvailable: true,
      previewUrl: "/agent-cash"
    },
    {
      id: "sop-architect", 
      name: "SOP Architect",
      description: "Turns chaos into clean workflows.",
      monthlyPrice: 240,
      tokenUsage: "High",
      timeSaved: "18 hrs/week", 
      integrations: ["Notion", "ClickUp", "Monday.com", "Slack"],
      features: ["Process mapping", "Workflow automation", "Documentation", "Training materials"],
      demoAvailable: true,
      previewUrl: "/demo-scenarios"
    },
    {
      id: "content-producer",
      name: "Content Producer", 
      description: "Auto-creates, schedules, and posts with tone-match.",
      monthlyPrice: 280,
      tokenUsage: "Moderate",
      timeSaved: "25 hrs/week",
      integrations: ["Buffer", "Hootsuite", "Canva", "WordPress"],
      features: ["Content creation", "Social scheduling", "Brand voice", "Analytics tracking"],
      demoAvailable: true,
      previewUrl: "/marketplace"
    },
    {
      id: "executive-assistant",
      name: "Executive Assistant",
      description: "Manages your calendar, emails, and priorities.",
      monthlyPrice: 260,
      tokenUsage: "Low",
      timeSaved: "15 hrs/week",
      integrations: ["Gmail", "Calendar", "Zoom", "Slack"],
      features: ["Email management", "Calendar coordination", "Meeting prep", "Task prioritization"],
      demoAvailable: false,
      previewUrl: "/onboarding"
    }
  ];

  const handleSolResponse = (input: string) => {
    // Enhanced SŌL Brain response with business intelligence
    const context = {
      industry: businessProfile.industry || 'general',
      goal: businessProfile.goal.toLowerCase(),
      budget: businessProfile.budget || 'unknown'
    };
    
    const responses = {
      sales: `Perfect! For ${context.industry} sales optimization, I recommend our Sales Rep Agent ($320/month). Based on your ${context.budget} budget, this agent can automate lead qualification and follow-ups, typically saving 22 hours per week and generating 3x ROI within 6 months. Would you like to see it in action?`,
      
      marketing: `Excellent choice! For ${context.industry} marketing automation, our Content Producer ($280/month) paired with Social Media Agent creates a powerful combination. This setup saves 25+ hours weekly and typically increases engagement by 40%. Given your ${context.budget} budget, this offers optimal value. Shall we explore this setup?`,
      
      operations: `Great insight! Your ${context.industry} operations would be transformed by our SOP Architect ($240/month). It intelligently maps processes and creates workflows automatically, reducing operational overhead by 35%. For your ${context.budget} budget range, this delivers exceptional efficiency gains. Ready for a live demonstration?`,
      
      default: `Based on your ${context.industry} background and ${context.budget} budget, I can recommend the perfect agent combination. What's your primary business goal today - increasing sales velocity, scaling marketing efforts, or optimizing operations? Each path offers distinct advantages for your specific situation.`
    };
    
    if (context.goal.includes('sales') || context.goal.includes('revenue') || context.goal.includes('lead')) return responses.sales;
    if (context.goal.includes('marketing') || context.goal.includes('content') || context.goal.includes('brand')) return responses.marketing;
    if (context.goal.includes('operations') || context.goal.includes('process') || context.goal.includes('efficiency')) return responses.operations;
    return responses.default;
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                AI Agent
                <span className="text-harmonix-regal-gold block">Demo Platform</span>
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto leading-relaxed">
                Experience the power of specialized AI agents with live demonstrations
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                onClick={() => window.location.href = '/join'}
              >
                Join Waitlist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="touch-friendly-btn border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
                onClick={() => window.location.href = '/marketplace'}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Deploy Agent Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Agent Demo Cards Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
                Test Our AI Agents
              </h2>
              <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Experience the power of specialized AI agents with live demonstrations
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Agent Selection Tabs */}
              <div className="lg:w-1/3 space-y-4">
                {demoAgents.map((agent, index) => (
                  <Card 
                    key={agent.id}
                    className={cn(
                      "bg-harmonix-night-pine/50 border-harmonix-sage-fade/30 hover:border-harmonix-regal-gold/50 transition-all cursor-pointer",
                      selectedAgent === index && "border-harmonix-regal-gold bg-harmonix-regal-gold/10"
                    )}
                    onClick={() => setSelectedAgent(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-harmonix-regal-gold/20 flex items-center justify-center">
                          {React.createElement(agent.icon, { className: "w-6 h-6 text-harmonix-regal-gold" })}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{agent.name}</h3>
                          <p className="text-sm text-harmonix-sage-fade">{agent.specialty}</p>
                        </div>
                        <Badge variant="outline" className="border-harmonix-regal-gold/30 text-harmonix-regal-gold">
                          {agent.tier}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Agent Demo Interface */}
              <div className="lg:w-2/3">
                <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg bg-harmonix-regal-gold/20 flex items-center justify-center">
                          {React.createElement(demoAgents[selectedAgent].icon, { className: "w-8 h-8 text-harmonix-regal-gold" })}
                        </div>
                        <div>
                          <CardTitle className="text-harmonix-regal-gold font-serif">
                            {demoAgents[selectedAgent].name}
                          </CardTitle>
                          <CardDescription className="text-harmonix-sage-fade">
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
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                          <div className="text-2xl font-bold text-harmonix-regal-gold">{demoAgents[selectedAgent].metrics.efficiency}</div>
                          <div className="text-xs text-harmonix-sage-fade">Efficiency</div>
                        </div>
                        <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                          <div className="text-2xl font-bold text-harmonix-regal-gold">{demoAgents[selectedAgent].metrics.accuracy}</div>
                          <div className="text-xs text-harmonix-sage-fade">Accuracy</div>
                        </div>
                        <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                          <div className="text-2xl font-bold text-harmonix-regal-gold">{demoAgents[selectedAgent].metrics.speed}</div>
                          <div className="text-xs text-harmonix-sage-fade">Response Time</div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Demo */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Try It Now</h4>
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder={`Ask ${demoAgents[selectedAgent].name} a question...`}
                            className="flex-1 bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white placeholder:text-harmonix-sage-fade"
                          />
                          <Button 
                            size="icon"
                            className="bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-harmonix-night-pine/30 rounded-lg p-4 min-h-[120px] border border-harmonix-sage-fade/20">
                          <div className="text-sm text-harmonix-sage-fade mb-2">Agent Response:</div>
                          <div className="text-white">
                            {demoAgents[selectedAgent].demoResponse}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        className="flex-1 bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                        onClick={() => setSolExpanded(true)}
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Deploy This Agent
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* SŌL Brain Integration Demo */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-harmonix-night-pine/20 to-harmonix-cedar-mist/20">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
                Ask SŌL Brain Anything
              </h2>
              <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Experience our advanced AI orchestration engine that coordinates multiple agents for complex tasks
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/30">
                <CardContent className="p-8">
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
                  size="lg" 
                  variant="outline" 
                  className="touch-friendly-btn border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
                  onClick={() => window.location.href = '/marketplace'}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Deploy Agent Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Agent Demo Cards Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
                Test Our AI Agents
              </h2>
              <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Experience the power of specialized AI agents with live demonstrations
              </p>
            </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Agent Selection Tabs */}
            <div className="lg:w-1/3 space-y-4">
              {demoAgents.map((agent, index) => (
                <Card 
                  key={agent.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-lg hover:shadow-harmonix-regal-gold/20",
                    selectedAgent === index 
                      ? "border-harmonix-regal-gold bg-harmonix-regal-gold/10" 
                      : "border-harmonix-sage-fade/20 hover:border-harmonix-regal-gold/50"
                  )}
                  onClick={() => setSelectedAgent(index)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-harmonix-regal-gold">{agent.name}</h3>
                      {agent.demoAvailable ? (
                        <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
                          Live Demo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-harmonix-sage-fade/30 text-harmonix-sage-fade">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-harmonix-sage-fade">{agent.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-harmonix-sage-fade">
                        <span>Saves {agent.timeSaved}</span>
                        <br />
                        <span>Tokens: {agent.tokenUsage}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-harmonix-regal-gold">
                          ${agent.monthlyPrice}/month
                        </div>
                        <div className="text-xs text-harmonix-sage-fade">
                          Ongoing cost
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Active Agent Details */}
            <div className="lg:w-2/3">
              <Card className="harmonix-card-enhanced p-6 sm:p-8 h-full">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-harmonix-regal-gold mb-3 font-serif">
                        {demoAgents[selectedAgent].name}
                      </h3>
                      <p className="text-lg text-harmonix-sage-fade">
                        {demoAgents[selectedAgent].description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-harmonix-regal-gold">
                        ${demoAgents[selectedAgent].monthlyPrice}
                      </div>
                      <div className="text-xs text-harmonix-sage-fade">per month</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                      <div className="text-xl font-bold text-harmonix-regal-gold">
                        {demoAgents[selectedAgent].timeSaved}
                      </div>
                      <div className="text-xs text-harmonix-sage-fade">Time Saved</div>
                    </div>
                    <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                      <div className="text-xl font-bold text-harmonix-regal-gold">
                        {demoAgents[selectedAgent].tokenUsage}
                      </div>
                      <div className="text-xs text-harmonix-sage-fade">Token Usage</div>
                    </div>
                    <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                      <div className="text-xl font-bold text-harmonix-regal-gold">
                        {demoAgents[selectedAgent].integrations.length}+
                      </div>
                      <div className="text-xs text-harmonix-sage-fade">Integrations</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-harmonix-sage-fade">Integrations:</h5>
                    <div className="flex flex-wrap gap-2">
                      {demoAgents[selectedAgent].integrations.map((integration, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-xs border-harmonix-sage-fade/30 text-harmonix-sage-fade"
                        >
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Key Capabilities:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {demoAgents[selectedAgent].features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-harmonix-regal-gold" />
                          <span className="text-sm text-harmonix-sage-fade">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                      onClick={() => window.location.href = demoAgents[selectedAgent].previewUrl}
                      disabled={!demoAgents[selectedAgent].demoAvailable}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {demoAgents[selectedAgent].demoAvailable ? "Try Agent" : "Coming Soon"}
                    </Button>
                    <Button 
                      variant="outline"
                      className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                      onClick={() => window.location.href = '/checkout'}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Deploy Agent
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Demo Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-harmony-gold/10 text-harmony-gold border-harmony-gold/30 mb-4">
                  Featured Demo
                </Badge>
                <h3 className="text-4xl font-bold text-white font-serif mb-6">
                  SŌL Brain Interactive Experience
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  Experience our central AI intelligence that orchestrates all agents. 
                  Ask questions about your business challenges and get personalized 
                  agent recommendations with real ROI projections.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Industry-specific recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Real business case studies and metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Personalized automation strategies</span>
                </div>
              </div>

              <Link href="/soul-brain">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                  Start SŌL Brain Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="w-80 h-80 relative">
                <SolBrain size="xl" animated={true} />
                <div className="absolute inset-0 bg-gradient-to-t from-harmony-dark via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Levels */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white font-serif mb-4">
              Demo Access <span className="text-harmony-gold">Levels</span>
            </h3>
            <p className="text-xl text-gray-300">
              Different features available based on your access level
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-harmony-gold font-serif">Public Access</CardTitle>
                <CardDescription className="text-gray-300">
                  Available to all visitors without registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">SŌL Brain chat demo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Agent marketplace browsing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Deployment scenario previews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Platform overview videos</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-harmony-gold/30">
              <CardHeader>
                <CardTitle className="text-harmony-gold font-serif">Member Access</CardTitle>
                <CardDescription className="text-gray-300">
                  Full platform experience for authenticated users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Live dashboard and analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Agent deployment and management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Real workflow automation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Team collaboration features</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
            <h3 className="text-4xl font-bold text-white font-serif mb-6">
              Ready for the Full <span className="text-harmony-gold">Experience</span>?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {user 
                ? "Access your personalized dashboard and start building your AI team today."
                : "Join Harmonix to unlock the complete platform with live agent deployment and automation."
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