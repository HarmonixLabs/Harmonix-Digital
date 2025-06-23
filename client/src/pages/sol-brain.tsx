import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Clock, 
  TrendingUp,
  Settings,
  Link as LinkIcon,
  Play,
  Send,
  Mic,
  MicOff
} from "lucide-react";
import { Link } from "wouter";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "sol";
  timestamp: Date;
  type?: "text" | "recommendation" | "integration";
}

export default function SolBrain() {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);

  // Check if this is an onboarding flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initOnboard = params.get('init') === 'onboard';
    if (initOnboard) {
      setIsOnboarding(true);
      // Initialize onboarding conversation
      setChatMessages([
        {
          id: "1",
          content: "Welcome! I'm SŌL — your AI systems architect. Let's calibrate your business setup. What industry are you in?",
          sender: "sol",
          timestamp: new Date(),
          type: "text"
        }
      ]);
    } else {
      // Initialize with demo greeting
      setChatMessages([
        {
          id: "1", 
          content: "Hello! I'm SŌL, your business's conscious brain. I can help you understand which AI agents would save you the most time. What would you like to explore?",
          sender: "sol",
          timestamp: new Date(),
          type: "text"
        }
      ]);
    }
  }, []);

  const predefinedQuestions = [
    "How can you save me time?",
    "Which tools can you integrate?", 
    "Which agent do I need most?",
    "Show me ROI projections",
    "I run a design agency with 4 clients",
    "Help me automate my sales process"
  ];

  const integrationTools = [
    { name: "Gmail", connected: true, logo: "📧" },
    { name: "Slack", connected: true, logo: "💬" },
    { name: "Notion", connected: false, logo: "📝" },
    { name: "ClickUp", connected: true, logo: "✅" },
    { name: "Stripe", connected: true, logo: "💳" },
    { name: "GHL", connected: true, logo: "📊" },
    { name: "Zapier", connected: false, logo: "⚡" },
    { name: "HubSpot", connected: false, logo: "🎯" }
  ];

  const agentRecommendations = [
    {
      name: "CA$H",
      role: "Sales Strategist", 
      timeSavings: "16-24 hours/week",
      monthlyValue: "$3,200",
      confidence: 94,
      reason: "Perfect for sales follow-up automation"
    },
    {
      name: "Maya",
      role: "HR Coordinator",
      timeSavings: "8-12 hours/week", 
      monthlyValue: "$1,600",
      confidence: 87,
      reason: "Streamlines team coordination tasks"
    },
    {
      name: "Virgil",
      role: "Brand Strategist",
      timeSavings: "12-18 hours/week",
      monthlyValue: "$2,400", 
      confidence: 91,
      reason: "Automates content strategy and brand alignment"
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate SŌL response
    setTimeout(() => {
      const solResponse = generateSolResponse(inputMessage);
      setChatMessages(prev => [...prev, solResponse]);
    }, 1000);

    setInputMessage("");
  };

  const generateSolResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();
    
    if (input.includes("time") || input.includes("save")) {
      return {
        id: Date.now().toString(),
        content: "Based on your business type, I estimate you could save 20-30 hours per week with the right agent configuration. The CA$H agent alone typically saves sales teams 16+ hours weekly through automated follow-ups and lead qualification.",
        sender: "sol",
        timestamp: new Date(),
        type: "recommendation"
      };
    } else if (input.includes("tools") || input.includes("integrate")) {
      return {
        id: Date.now().toString(),
        content: "I can integrate with 50+ business tools including Gmail, Slack, Notion, ClickUp, Stripe, and more. Would you like me to analyze your current tool stack and recommend the best integration approach?",
        sender: "sol", 
        timestamp: new Date(),
        type: "integration"
      };
    } else if (input.includes("agent") || input.includes("need")) {
      return {
        id: Date.now().toString(),
        content: "Let me analyze your needs... Based on common patterns, I'd recommend starting with CA$H for sales automation. It has a 94% success rate and typically pays for itself within 3 weeks. Would you like to see a detailed breakdown?",
        sender: "sol",
        timestamp: new Date(),
        type: "recommendation"
      };
    } else if (input.includes("design") || input.includes("agency")) {
      return {
        id: Date.now().toString(),
        content: "Perfect! For design agencies, I typically recommend Virgil (Brand Strategist) + Maya (Project Coordinator). This combination handles client communication, project timelines, and brand consistency. Estimated time savings: 25+ hours/week.",
        sender: "sol",
        timestamp: new Date(),
        type: "recommendation"
      };
    } else {
      return {
        id: Date.now().toString(),
        content: "I understand you're looking to optimize your operations. Based on thousands of implementations, most businesses see immediate ROI with sales automation. Would you like me to analyze your specific situation and recommend the best starting point?",
        sender: "sol",
        timestamp: new Date(),
        type: "text"
      };
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-harmonix-gold/20 border border-harmonix-gold rounded-full mb-6">
              <Brain className="w-12 h-12 text-harmonix-gold animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-harmonix-gold mb-6">
              SŌL: Your Business's Conscious Brain
            </h1>
            <p className="text-xl text-harmonix-sage max-w-3xl mx-auto mb-8">
              Ask, integrate, delegate — SŌL learns your systems and saves your time through intelligent agent orchestration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setCurrentDemo("chat")}
                className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat With SŌL
              </Button>
              <Link href="/get-started?step=sol">
                <Button 
                  variant="outline"
                  className="border-harmonix-gold text-harmonix-gold hover:bg-harmonix-gold hover:text-harmonix-black"
                >
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Connect Your Stack
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Live SŌL Chat Demo */}
            <Card className="bg-harmonix-night border-harmonix-cedar">
              <CardHeader>
                <CardTitle className="text-harmonix-gold flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Live SŌL Demo
                </CardTitle>
                <CardDescription className="text-harmonix-sage">
                  Experience intelligent agent recommendations in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-80 overflow-y-auto space-y-4 bg-harmonix-black border border-harmonix-cedar rounded-lg p-4">
                    {chatMessages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${
                          message.sender === "user" 
                            ? "bg-harmonix-gold text-harmonix-black" 
                            : "bg-harmonix-cedar text-harmonix-sage"
                        } rounded-lg p-3`}>
                          {message.sender === "sol" && (
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-harmonix-gold text-harmonix-black text-xs">
                                  SŌL
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-harmonix-gold font-semibold">SŌL Brain</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Questions */}
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-harmonix-sage text-sm font-semibold mb-2">Try asking:</p>
                    {predefinedQuestions.slice(0, 3).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuestionClick(question)}
                        className="text-left justify-start border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
                      >
                        "{question}"
                      </Button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask SŌL anything..."
                      className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsVoiceMode(!isVoiceMode)}
                      className={`border-harmonix-cedar ${isVoiceMode ? "bg-harmonix-gold text-harmonix-black" : "text-harmonix-sage"}`}
                    >
                      {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    Agent Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agentRecommendations.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-harmonix-black border border-harmonix-cedar rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-harmonix-gold">{agent.name}</h4>
                            <Badge className="bg-harmonix-gold/20 text-harmonix-gold text-xs">
                              {agent.confidence}% match
                            </Badge>
                          </div>
                          <p className="text-harmonix-sage text-sm">{agent.role}</p>
                          <p className="text-harmonix-sage text-xs mt-1">{agent.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-harmonix-gold font-semibold">{agent.monthlyValue}</p>
                          <p className="text-harmonix-sage text-xs">{agent.timeSavings}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Integration Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {integrationTools.map((tool, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          tool.connected 
                            ? "border-green-400 bg-green-400/10" 
                            : "border-harmonix-cedar bg-harmonix-black"
                        }`}
                      >
                        <span className="text-lg">{tool.logo}</span>
                        <span className={`text-sm ${tool.connected ? "text-green-400" : "text-harmonix-sage"}`}>
                          {tool.name}
                        </span>
                        {tool.connected && <span className="text-green-400 text-xs">✓</span>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="capabilities" className="mb-16">
            <TabsList className="grid w-full grid-cols-3 bg-harmonix-night border border-harmonix-cedar">
              <TabsTrigger value="capabilities" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                Capabilities
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                Scenarios
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                Integrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="capabilities" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-harmonix-night border-harmonix-cedar">
                  <CardContent className="p-6">
                    <TrendingUp className="w-8 h-8 text-harmonix-gold mb-4" />
                    <h3 className="font-semibold text-harmonix-gold mb-2">ROI Analysis</h3>
                    <p className="text-harmonix-sage text-sm">
                      Real-time calculation of time savings, cost reduction, and productivity gains across all agents.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-harmonix-night border-harmonix-cedar">
                  <CardContent className="p-6">
                    <Brain className="w-8 h-8 text-harmonix-gold mb-4" />
                    <h3 className="font-semibold text-harmonix-gold mb-2">Intelligent Routing</h3>
                    <p className="text-harmonix-sage text-sm">
                      Automatically assigns tasks to the most capable agent based on context and availability.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-harmonix-night border-harmonix-cedar">
                  <CardContent className="p-6">
                    <Zap className="w-8 h-8 text-harmonix-gold mb-4" />
                    <h3 className="font-semibold text-harmonix-gold mb-2">Scenario Planning</h3>
                    <p className="text-harmonix-sage text-sm">
                      Analyzes business patterns and recommends optimal agent configurations for maximum impact.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Design Agency with 4 Clients",
                    description: "Automate client communication, project tracking, and brand consistency",
                    agents: ["Virgil", "Maya"],
                    savings: "25+ hours/week"
                  },
                  {
                    title: "SaaS Startup",
                    description: "Lead qualification, customer onboarding, and support ticket routing",
                    agents: ["CA$H", "Support Agent"],
                    savings: "30+ hours/week"
                  },
                  {
                    title: "Consulting Firm",
                    description: "Proposal generation, client research, and follow-up automation",
                    agents: ["Research Agent", "CA$H"],
                    savings: "20+ hours/week"
                  },
                  {
                    title: "E-commerce Store",
                    description: "Inventory management, customer service, and marketing automation",
                    agents: ["Customer Agent", "Marketing Agent"],
                    savings: "35+ hours/week"
                  }
                ].map((scenario, index) => (
                  <Card key={index} className="bg-harmonix-night border-harmonix-cedar">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-harmonix-gold mb-2">{scenario.title}</h3>
                      <p className="text-harmonix-sage text-sm mb-4">{scenario.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-harmonix-sage text-xs">Recommended Agents:</p>
                          <p className="text-harmonix-gold text-sm">{scenario.agents.join(", ")}</p>
                        </div>
                        <Badge className="bg-green-400/20 text-green-400">
                          {scenario.savings}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  "Gmail", "Slack", "Notion", "ClickUp", "Stripe", "HubSpot", "Zapier", "Calendly",
                  "Zoom", "Trello", "Asana", "Monday.com", "Salesforce", "Mailchimp", "Shopify", "WordPress"
                ].map((integration, index) => (
                  <Card key={index} className="bg-harmonix-night border-harmonix-cedar">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 bg-harmonix-gold/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-harmonix-gold text-sm font-semibold">
                          {integration.charAt(0)}
                        </span>
                      </div>
                      <p className="text-harmonix-sage text-sm">{integration}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-harmonix-gold/10 to-harmonix-sage/10 border-harmonix-gold/20">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-harmonix-gold mb-4">
                  Ready to Bring SŌL Into Your Operations?
                </h2>
                <p className="text-xl text-harmonix-sage mb-8 max-w-2xl mx-auto">
                  Experience the power of conscious business intelligence. Start with a personalized analysis of your current operations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/pricing">
                    <Button 
                      size="lg"
                      className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Activate SŌL Brain
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-harmonix-gold text-harmonix-gold hover:bg-harmonix-gold hover:text-harmonix-black"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Demo
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar hover:text-harmonix-gold"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Browse Agents
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}