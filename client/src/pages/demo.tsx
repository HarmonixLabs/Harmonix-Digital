import React, { useState } from "react";
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
import { useAuth } from "@/lib/auth";
import { Play, Users, MessageCircle, Calendar, User, ArrowRight, Bot, Zap, DollarSign, Clock, Target, Star, Sparkles, CheckCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const demoAgents = [
  {
    id: "cash",
    name: "Agent CA$H",
    specialty: "Sales & Revenue Generation",
    tier: "Elite",
    icon: DollarSign,
    description: "Elite sales agent specializing in lead conversion and revenue optimization",
    capabilities: ["Lead Qualification", "Sales Automation", "CRM Integration", "Revenue Analytics"],
    metrics: { efficiency: "98%", accuracy: "94%", speed: "< 2s" },
    demoResponse: "I've analyzed your sales funnel and identified 3 key optimization opportunities that could increase conversion by 47%. Would you like me to implement these changes?"
  },
  {
    id: "concierge",
    name: "AI Concierge",
    specialty: "Customer Experience",
    tier: "Premium",
    icon: Users,
    description: "Premium customer service agent for seamless client interactions",
    capabilities: ["24/7 Support", "Multi-channel", "Sentiment Analysis", "Escalation Management"],
    metrics: { efficiency: "96%", accuracy: "92%", speed: "< 1s" },
    demoResponse: "Hello! I'm here to assist you with any questions about our platform. I can help with onboarding, feature explanations, or technical support. How may I help you today?"
  },
  {
    id: "executive",
    name: "Executive Assistant",
    specialty: "Executive Support",
    tier: "Professional",
    icon: Calendar,
    description: "Professional executive support for scheduling and task management",
    capabilities: ["Calendar Management", "Email Automation", "Meeting Coordination", "Task Prioritization"],
    metrics: { efficiency: "95%", accuracy: "98%", speed: "< 3s" },
    demoResponse: "I've reviewed your calendar and identified 4 scheduling conflicts next week. I've prepared alternative meeting times and can send the updates to all participants. Shall I proceed?"
  }
];

export default function DemoPage() {
  const { user } = useAuth();
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

  const handleDemoSubmit = async () => {
    if (!demoInput.trim()) return;
    
    setIsProcessing(true);
    setAgentResponse("");
    
    // Simulate processing time for whimsical loader display
    setTimeout(() => {
      setAgentResponse(demoAgents[selectedAgent].demoResponse);
      setIsProcessing(false);
    }, 2000);
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
                            value={demoInput}
                            onChange={(e) => setDemoInput(e.target.value)}
                            placeholder={`Ask ${demoAgents[selectedAgent].name} a question...`}
                            className="flex-1 bg-harmonix-night-pine/30 border-harmonix-sage-fade/30 text-white placeholder:text-harmonix-sage-fade"
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
                        
                        <div className="bg-harmonix-night-pine/30 rounded-lg p-4 min-h-[120px] border border-harmonix-sage-fade/20">
                          <div className="text-sm text-harmonix-sage-fade mb-2">Agent Response:</div>
                          <div className="text-white">
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
}