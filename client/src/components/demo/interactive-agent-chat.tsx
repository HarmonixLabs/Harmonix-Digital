import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Rocket, 
  CheckCircle, 
  ArrowRight, 
  Crown,
  DollarSign,
  Calendar,
  Target,
  Users,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentName?: string;
  actionPlan?: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  recommendedServices?: Array<{
    service: string;
    price: number;
    roi: string;
    timeline: string;
  }>;
  canExecute?: boolean;
  requiresAuth?: boolean;
}

interface InteractiveAgentChatProps {
  agent: any;
  businessProfile: {
    industry: string;
    goal: string;
    budget: string;
  };
  className?: string;
}

export function InteractiveAgentChat({ agent, businessProfile, className }: InteractiveAgentChatProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationPhase, setConversationPhase] = useState<'discovery' | 'strategy' | 'execution'>('discovery');
  const [collectedInfo, setCollectedInfo] = useState<{[key: string]: string}>({});
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting message
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: 'initial',
      type: 'agent',
      content: `Hello! I'm ${agent.name}, your AI ${agent.specialty} specialist. I'm here to understand your specific challenges and create a personalized strategy for your business.\n\nBased on your profile (${businessProfile.industry || 'Industry not specified'}, Goal: ${businessProfile.goal || 'Not specified'}), I can provide targeted recommendations.\n\nWhat specific challenge would you like me to help you solve?`,
      timestamp: new Date(),
      agentName: agent.name,
      canExecute: false
    };
    setMessages([initialMessage]);
  }, [agent, businessProfile]);

  const getAgentAction = (agentId: string) => {
    const actions = {
      'cash': 'lead_qualification',
      'grace': 'customer_support',
      'echo': 'social_media_posting',
      'flow': 'process_automation',
      'kairos': 'project_management',
      'sol': 'ai_orchestration'
    };
    return actions[agentId as keyof typeof actions] || 'lead_qualification';
  };

  // Agent-specific discovery questions based on their specialty
  const getDiscoveryQuestions = (agentId: string, userInput: string) => {
    const questionSets = {
      'cash': [
        "What's your current monthly revenue target?",
        "Which lead sources are performing best for you?", 
        "What's your biggest challenge in closing deals?",
        "How many leads do you typically get per month?"
      ],
      'grace': [
        "What's your most common customer complaint?",
        "How do you currently handle customer support?",
        "What's your average response time to customers?",
        "Which customer interaction channels do you use most?"
      ],
      'echo': [
        "Which social media platforms are most important for your business?",
        "How often do you currently post on social media?",
        "What type of content gets the best engagement?",
        "What's your biggest social media challenge?"
      ],
      'flow': [
        "Which business processes take up most of your time?",
        "How many manual tasks do you repeat daily?",
        "What software tools are you currently using?",
        "Which workflow bottlenecks slow you down most?"
      ],
      'kairos': [
        "How many projects are you managing simultaneously?",
        "What's your biggest project management challenge?",
        "Which project management tools do you use?",
        "How do you currently track project progress?"
      ],
      'sol': [
        "What's your biggest business challenge right now?",
        "Which business areas need the most improvement?",
        "How do you currently coordinate different business functions?",
        "What's your vision for business automation?"
      ]
    };
    
    return questionSets[agentId as keyof typeof questionSets] || questionSets['cash'];
  };

  // Check if user input provides sufficient detail for strategy/solution
  const hassufficientDetail = (input: string) => {
    const detailIndicators = ['because', 'currently', 'need', 'problem', 'challenge', 'goal', 'want', 'trying', 'revenue', 'customers', 'monthly', 'daily', 'using', 'tools'];
    const wordCount = input.split(' ').length;
    const hasDetails = detailIndicators.some(indicator => input.toLowerCase().includes(indicator));
    return wordCount > 15 && hasDetails;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update collected information
    setCollectedInfo(prev => ({
      ...prev,
      [`response_${questionsAsked + 1}`]: inputValue
    }));
    
    setInputValue("");
    setIsProcessing(true);

    try {
      // Determine response type based on conversation phase and input quality
      let agentResponse = "";
      let actionPlan = undefined;
      let recommendedServices = undefined;
      let canExecute = false;
      let shouldAskQuestion = false;

      // Phase 1: Discovery - Ask clarifying questions if needed
      if (conversationPhase === 'discovery') {
        const hasDetail = hassufficientDetail(inputValue);
        const questions = getDiscoveryQuestions(agent.id, inputValue);
        
        if (!hasDetail && questionsAsked < 2) {
          // Ask a clarifying question
          shouldAskQuestion = true;
          const questionIndex = questionsAsked;
          agentResponse = `Thank you for that information! To provide you with the most personalized strategy, I need to understand your situation better.\n\n**${questions[questionIndex]}**\n\nThis will help me create a targeted solution for your ${agent.specialty.toLowerCase()} needs.`;
          setQuestionsAsked(prev => prev + 1);
        } else {
          // Move to strategy phase
          setConversationPhase('strategy');
          agentResponse = `Perfect! Based on what you've shared, I can see the key opportunities for improvement. Let me create a strategic approach for you.\n\n## 🎯 **Strategic Analysis**\n\nI've identified your main challenges and I'm analyzing the best approach to solve them. Let me provide you with a comprehensive strategy...`;
        }
      }
      
      // Phase 2: Strategy - Provide high-level strategic approach
      else if (conversationPhase === 'strategy') {
        // Call the API for strategic response
        const response = await fetch('/api/test-pipedream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: `${agent.id}-agent`,
            action: getAgentAction(agent.id),
            data: {
              message: inputValue,
              context: businessProfile,
              conversation_history: messages,
              conversation_phase: 'strategy',
              collected_info: collectedInfo,
              demo_mode: true,
              agent_name: agent.name,
              request_type: 'strategy'
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.response) {
            agentResponse = `## 📋 **Strategic Roadmap**\n\n${result.response}\n\n---\n\n**Ready for the detailed implementation plan?** Type "yes" or ask me to dive deeper into any specific area.`;
            setConversationPhase('execution');
          }
        }
      }
      
      // Phase 3: Execution - Provide detailed personalized solution
      else if (conversationPhase === 'execution') {
        const response = await fetch('/api/test-pipedream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: `${agent.id}-agent`,
            action: getAgentAction(agent.id),
            data: {
              message: inputValue,
              context: businessProfile,
              conversation_history: messages,
              conversation_phase: 'execution',
              collected_info: collectedInfo,
              demo_mode: true,
              agent_name: agent.name,
              request_type: 'detailed_solution'
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.response) {
            agentResponse = `## 🚀 **Detailed Implementation Plan**\n\n${result.response}`;
            canExecute = true;
            
            // Parse enhanced response elements
            if (result.enhanced_response) {
              actionPlan = result.enhanced_response.actionSteps;
              recommendedServices = result.enhanced_response.platformIntegration?.recommendedServices;
            }
          }
        }
      }

      // Fallback response if no specific phase response
      if (!agentResponse) {
        agentResponse = `I understand. Let me provide you with a comprehensive solution based on our conversation.\n\n${agent.demoResponse}`;
        canExecute = true;
      }

      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'agent',
        content: agentResponse,
        timestamp: new Date(),
        agentName: agent.name,
        actionPlan,
        recommendedServices,
        canExecute,
        requiresAuth: !isAuthenticated && canExecute
      };

      setMessages(prev => [...prev, responseMessage]);

    } catch (error) {
      console.log('Error processing message:', error);
      // Fallback to default agent response
      const fallbackMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'agent',
        content: `Based on your question, here's what I recommend:\n\n${agent.demoResponse}`,
        timestamp: new Date(),
        agentName: agent.name,
        canExecute: true,
        requiresAuth: !isAuthenticated
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }

    setIsProcessing(false);
  };

  const handleExecutePlan = (message: ChatMessage) => {
    if (!isAuthenticated) {
      toast({
        title: "Account Required",
        description: "Sign up to execute this plan in your dashboard",
        variant: "default"
      });
      // Redirect to signup with context
      window.location.href = `/signup?plan=${agent.id}&context=${encodeURIComponent(message.content)}`;
      return;
    }

    // If authenticated, redirect to dashboard with plan context
    toast({
      title: "Executing Plan",
      description: `Deploying ${agent.name} strategy to your dashboard...`,
      variant: "default"
    });
    
    window.location.href = `/dashboard?execute=${agent.id}&plan=${encodeURIComponent(JSON.stringify(message.actionPlan))}`;
  };

  const handleReserveSpot = () => {
    toast({
      title: "Reserve Your Spot",
      description: "Secure priority access with a $444 deposit",
      variant: "default"
    });
    window.location.href = `/join?agent=${agent.id}&deposit=444`;
  };

  const handleUpgrade = () => {
    window.location.href = `/pricing?agent=${agent.id}&upgrade=true`;
  };

  const handleJoinWaitlist = (message: ChatMessage) => {
    // Log the demo interaction
    logDemoInteraction('waitlist', message);
    
    toast({
      title: "Joining Waitlist",
      description: "You'll receive updates and early access notifications",
      variant: "default"
    });
    
    window.location.href = `/signup?source=demo&agent=${agent.id}&action=waitlist`;
  };

  const handlePickPlan = (message: ChatMessage) => {
    // Log the demo interaction
    logDemoInteraction('pick_plan', message);
    
    toast({
      title: "Exploring Plans",
      description: "Choose the perfect package for your needs",
      variant: "default"
    });
    
    window.location.href = `/pricing?agent=${agent.id}&demo=true&context=${encodeURIComponent(message.content)}`;
  };

  const logDemoInteraction = async (action: string, message: ChatMessage) => {
    try {
      // Log demo usage statistics
      await fetch('/api/demo/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          agentName: agent.name,
          action,
          conversationPhase,
          messageCount: messages.length,
          userContext: businessProfile,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.log('Demo tracking error:', error);
    }
  };

  return (
    <Card className={cn("bg-white/10 backdrop-blur-sm border-white/20", className)}>
      {/* Top Banner with Mode Indicator */}
      <div className="bg-gradient-to-r from-harmonix-regal-gold/20 to-harmonix-sage-fade/20 p-3 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white">
            🧭 You're chatting with <span className="font-semibold text-harmonix-regal-gold">{agent.name}</span> in{' '}
            <span className={cn(
              "font-semibold",
              conversationPhase === 'discovery' && "text-blue-400",
              conversationPhase === 'strategy' && "text-yellow-400", 
              conversationPhase === 'execution' && "text-green-400"
            )}>
              {conversationPhase.charAt(0).toUpperCase() + conversationPhase.slice(1)} Mode
            </span>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            conversationPhase === 'discovery' && "bg-blue-400/20 text-blue-400",
            conversationPhase === 'strategy' && "bg-yellow-400/20 text-yellow-400",
            conversationPhase === 'execution' && "bg-green-400/20 text-green-400"
          )}>
            Mode: {conversationPhase.charAt(0).toUpperCase() + conversationPhase.slice(1)}
          </div>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-harmonix-regal-gold/30 flex items-center justify-center border border-harmonix-regal-gold/40">
              {React.createElement(agent.icon, { className: "w-7 h-7 text-harmonix-regal-gold" })}
            </div>
            <div>
              <CardTitle className="text-harmonix-regal-gold text-lg">
                {agent.name}
              </CardTitle>
              <p className="text-sm text-white/70">{agent.specialty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* 3-Mode Progress Indicator */}
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-3 h-3 rounded-full border-2",
                conversationPhase === 'discovery' ? 'bg-blue-400 border-blue-400 animate-pulse' : 'bg-white/20 border-white/30'
              )}></div>
              <div className={cn(
                "w-3 h-3 rounded-full border-2",
                conversationPhase === 'strategy' ? 'bg-yellow-400 border-yellow-400 animate-pulse' : 'bg-white/20 border-white/30'
              )}></div>
              <div className={cn(
                "w-3 h-3 rounded-full border-2",
                conversationPhase === 'execution' ? 'bg-green-400 border-green-400 animate-pulse' : 'bg-white/20 border-white/30'
              )}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Live Demo</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Suggested Questions (show when chat is empty) */}
        {messages.length === 0 && (
          <div className="mb-4 p-4 bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/20 rounded-lg">
            <h4 className="text-sm font-semibold text-harmonix-regal-gold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Suggested Questions for {agent.name}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {getSuggestedQuestions(agent.id, businessProfile).map((question, idx) => (
                <Button
                  key={`${agent.id}-question-${idx}`}
                  variant="ghost"
                  size="sm"
                  className="text-left justify-start h-auto p-3 text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-harmonix-regal-gold/30"
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  <span className="text-xs leading-relaxed">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages - Expanded Area */}
        <div className="h-[500px] overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Agent Avatar */}
              {message.type === 'agent' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-harmonix-regal-gold/30 flex items-center justify-center border border-harmonix-regal-gold/40">
                    {React.createElement(agent.icon, { className: "w-4 h-4 text-harmonix-regal-gold" })}
                  </div>
                </div>
              )}

              <div className={cn(
                "max-w-[75%] rounded-lg",
                message.type === 'user' 
                  ? 'bg-harmonix-regal-gold text-harmonix-deep-forest ml-auto p-3' 
                  : 'bg-white/10 text-white'
              )}>
                {message.type === 'agent' && (
                  <div className="flex items-center gap-2 mb-2 px-3 pt-3">
                    <span className="text-xs text-harmonix-regal-gold font-medium">
                      {message.agentName}
                    </span>
                    <div className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      conversationPhase === 'discovery' && "bg-blue-400/20 text-blue-400",
                      conversationPhase === 'strategy' && "bg-yellow-400/20 text-yellow-400",
                      conversationPhase === 'execution' && "bg-green-400/20 text-green-400"
                    )}>
                      {conversationPhase}
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  "text-sm whitespace-pre-line",
                  message.type === 'agent' ? 'px-3 pb-3' : ''
                )}>
                  {message.content}
                </div>
                
                <div className="text-sm whitespace-pre-line">
                  {message.content}
                </div>

                {/* Action Plan Display */}
                {message.actionPlan && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-semibold text-harmonix-regal-gold flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Action Plan
                    </h4>
                    
                    <div className="space-y-2">
                      <div>
                        <h5 className="text-xs font-medium text-white/80 mb-1">Immediate Actions</h5>
                        <ul className="text-xs space-y-1">
                          {message.actionPlan.immediate.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-xs font-medium text-white/80 mb-1">30-Day Strategy</h5>
                        <ul className="text-xs space-y-1">
                          {message.actionPlan.shortTerm.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Calendar className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommended Services */}
                {message.recommendedServices && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-harmonix-regal-gold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Recommended Investment
                    </h4>
                    {message.recommendedServices.map((service, idx) => (
                      <div key={idx} className="bg-black/20 rounded p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium">{service.service}</span>
                          <span className="text-xs text-harmonix-regal-gold">${service.price.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-white/70">
                          ROI: {service.roi} | Timeline: {service.timeline}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strategy Completion Badge */}
                {conversationPhase === 'strategy' && message.type === 'agent' && (
                  <div className="mt-4 px-3 pb-3">
                    <div className="bg-green-400/20 border border-green-400/40 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Strategy Complete</span>
                      </div>
                      <p className="text-xs text-white/80 mb-3">
                        Ready to move to execution mode and take action on this strategy?
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setConversationPhase('execution')}
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Yes, Let's Execute 🚀
                      </Button>
                    </div>
                  </div>
                )}

                {/* Execution Mode - Three CTA Options */}
                {conversationPhase === 'execution' && message.canExecute && (
                  <div className="mt-4 px-3 pb-3">
                    <div className="bg-gradient-to-r from-harmonix-regal-gold/20 to-harmonix-sage-fade/20 border border-harmonix-regal-gold/40 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-harmonix-regal-gold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Ready to Execute? Choose Your Next Step:
                      </h4>
                      
                      <div className="space-y-3">
                        {/* Join Waitlist */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleJoinWaitlist(message)}
                          className="w-full justify-start border-blue-400/40 text-blue-400 hover:bg-blue-400/10"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          🔒 Join Waitlist
                          <span className="ml-auto text-xs opacity-70">Free • Get Updates</span>
                        </Button>

                        {/* Reserve Spot */}
                        <Button
                          size="sm"
                          onClick={handleReserveSpot}
                          className="w-full justify-start bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          💎 Reserve My Spot
                          <span className="ml-auto text-xs opacity-80">$444 • Priority Access</span>
                        </Button>

                        {/* Pick a Plan */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePickPlan(message)}
                          className="w-full justify-start border-harmonix-regal-gold/40 text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          ⚙️ Pick a Plan
                          <span className="ml-auto text-xs opacity-70">Custom • Full Setup</span>
                        </Button>
                      </div>
                      
                      <p className="text-xs text-white/60 mt-3 text-center">
                        Choose your commitment level to get started with {agent.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-harmonix-regal-gold" />
                  <span className="text-xs text-harmonix-regal-gold font-medium">
                    {agent.name}
                  </span>
                </div>
                <WhimsicalLoader variant="neural" message={`${agent.name} is analyzing...`} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={conversationPhase === 'discovery' ? "Describe your specific challenge..." : 
                        conversationPhase === 'strategy' ? "Any questions about this strategy?" :
                        "How would you like to refine this plan?"}
            className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
            onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Conversation Progress */}
        <div className="flex items-center justify-center gap-2 text-xs text-white/60">
          <div className={cn(
            "w-2 h-2 rounded-full",
            conversationPhase === 'discovery' ? 'bg-harmonix-regal-gold' : 'bg-white/30'
          )} />
          <span>Discovery</span>
          <ArrowRight className="w-3 h-3" />
          <div className={cn(
            "w-2 h-2 rounded-full",
            conversationPhase === 'strategy' ? 'bg-harmonix-regal-gold' : 'bg-white/30'
          )} />
          <span>Strategy</span>
          <ArrowRight className="w-3 h-3" />
          <div className={cn(
            "w-2 h-2 rounded-full",
            conversationPhase === 'execution' ? 'bg-harmonix-regal-gold' : 'bg-white/30'
          )} />
          <span>Execution</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions for generating enhanced demo responses
function generateEnhancedDemoResponse(userInput: string, agent: any, businessProfile: any, messageCount: number): string {
  const responses = {
    'cash': [
      `I've analyzed your sales challenge and identified 3 key opportunities in the ${businessProfile.industry || 'your'} industry. Based on your goal to ${businessProfile.goal || 'grow revenue'}, I recommend implementing automated lead qualification that could increase your conversion rate by 35-50%.

Here's what I found: Your current manual process is likely missing 40% of qualified leads due to response delays. I can set up intelligent lead scoring, automated follow-up sequences, and CRM integration that works 24/7.

Would you like me to detail the specific automation workflows, or do you have questions about implementation timeline?`,
      
      `Perfect! Based on your feedback, I'm refining the strategy. For your ${businessProfile.industry || 'business'} context, I recommend a 3-phase implementation:

**Phase 1 (Week 1-2):** Lead scoring automation and instant response system
**Phase 2 (Week 3-4):** Advanced nurturing sequences and CRM optimization  
**Phase 3 (Week 5-6):** Performance analytics and continuous optimization

This approach typically generates $47K additional revenue in the first quarter for businesses similar to yours. The ROI breakeven happens around day 23.

Ready to see the detailed execution plan, or would you like to adjust any priorities?`
    ],
    'grace': [
      `I see you're looking to enhance customer experience. From your ${businessProfile.industry || 'industry'} background, I can implement a 24/7 support system that reduces response time from hours to under 30 seconds.

My analysis shows that businesses like yours lose approximately 23% of potential customers due to delayed support responses. I can deploy intelligent chatbots, sentiment analysis, and escalation protocols that maintain your brand voice while dramatically improving satisfaction scores.

The system includes multilingual support, knowledge base integration, and seamless handoffs to human agents when needed. What specific customer pain points should we prioritize?`,
      
      `Excellent direction! I'm customizing the support strategy for your specific needs. The enhanced system will include:

**Immediate Impact:** AI-powered chat with 98% accuracy rate
**Customer Journey:** Personalized support paths based on user behavior
**Analytics:** Real-time satisfaction tracking and improvement recommendations

This typically improves customer satisfaction by 40% and reduces support costs by 60%. Most clients see ROI within 45 days.

Should I proceed with the deployment specifications, or would you like to explore any particular customer scenarios?`
    ]
  };

  const agentResponses = responses[agent.id as keyof typeof responses] || [
    `Based on your ${businessProfile.goal || 'objectives'}, I've identified several automation opportunities specific to ${businessProfile.industry || 'your industry'}. The strategy I'm developing could save your team 25+ hours per week while improving accuracy by 85%.

My recommendation focuses on three core areas that deliver immediate impact while building toward long-term efficiency gains. The implementation timeline is typically 2-4 weeks with measurable results starting in week 1.

What specific aspect would you like me to elaborate on first?`,

    `Great questions! I'm refining the approach based on your input. The enhanced strategy leverages AI automation to eliminate the most time-consuming tasks while ensuring quality remains high.

The ROI projection shows positive returns within 30-45 days, with most clients achieving 200-300% ROI by month 6. This includes full integration with your existing tools and comprehensive training for your team.

Ready to see the detailed execution roadmap, or do you want to adjust any priorities based on your budget constraints?`
  ];

  return agentResponses[Math.min(messageCount - 1, agentResponses.length - 1)] || agentResponses[0];
}

function generateActionPlan(agentId: string, userInput: string) {
  const plans = {
    'cash': {
      immediate: [
        "Set up automated lead capture forms",
        "Configure CRM integration with lead scoring",
        "Create initial follow-up email sequence"
      ],
      shortTerm: [
        "Deploy advanced nurturing campaigns",
        "Implement pipeline analytics dashboard",
        "Train team on new sales automation tools"
      ],
      longTerm: [
        "Optimize conversion paths based on data",
        "Scale successful campaigns across channels",
        "Implement predictive sales forecasting"
      ]
    },
    'grace': {
      immediate: [
        "Deploy AI chatbot on website",
        "Set up ticket routing and prioritization",
        "Configure knowledge base integration"
      ],
      shortTerm: [
        "Implement sentiment analysis monitoring",
        "Create escalation workflows for complex issues",
        "Launch proactive customer outreach campaigns"
      ],
      longTerm: [
        "Deploy predictive customer success models",
        "Integrate voice and video support capabilities",
        "Implement customer journey optimization"
      ]
    }
  };

  return plans[agentId as keyof typeof plans] || plans['cash'];
}

function generateRecommendedServices(agentId: string) {
  const services = {
    'cash': [
      {
        service: "Sales Automation Suite",
        price: 8000,
        roi: "300% in 6 months",
        timeline: "2-3 weeks"
      }
    ],
    'grace': [
      {
        service: "Customer Experience Platform",
        price: 6500,
        roi: "250% in 4 months", 
        timeline: "2-3 weeks"
      }
    ]
  };

  return services[agentId as keyof typeof services] || services['cash'];
}

function getSuggestedQuestions(agentId: string, businessProfile: any): string[] {
  const baseQuestions = {
    'cash': [
      "How can I increase my monthly sales by 50% in the next 90 days?",
      "What's the best way to qualify leads in my industry?",
      "How do I create a high-converting sales funnel for my business?",
      "What metrics should I track to optimize my sales process?"
    ],
    'grace': [
      "How can I reduce customer support response time by 80%?",
      "What's the best strategy for handling difficult customer complaints?",
      "How do I implement a customer satisfaction system?",
      "What are the key metrics for measuring customer experience?"
    ],
    'echo': [
      "How can I grow my social media following organically?",
      "What content strategy works best for my industry?",
      "How do I create viral social media campaigns?",
      "What's the best posting schedule for maximum engagement?"
    ],
    'flow': [
      "Which business processes should I automate first?",
      "How can I eliminate manual data entry in my workflows?",
      "What's the ROI of implementing process automation?",
      "How do I identify bottlenecks in my current operations?"
    ],
    'kairos': [
      "How can I improve my team's project delivery time by 40%?",
      "What's the best project management methodology for my business?",
      "How do I prevent scope creep and keep projects on track?",
      "What metrics should I use to measure project success?"
    ],
    'sol': [
      "How can multiple AI agents work together for my business?",
      "What's the strategic roadmap for AI implementation?",
      "How do I coordinate different AI tools and platforms?",
      "What's the expected ROI timeline for AI transformation?"
    ]
  };

  const questions = baseQuestions[agentId as keyof typeof baseQuestions] || baseQuestions['cash'];
  
  // Customize questions based on business profile
  if (businessProfile.industry && businessProfile.goal) {
    const customizedQuestions = questions.map(q => {
      if (businessProfile.industry === 'technology' && q.includes('industry')) {
        return q.replace('my industry', 'the technology sector');
      }
      if (businessProfile.industry === 'healthcare' && q.includes('industry')) {
        return q.replace('my industry', 'healthcare');
      }
      if (businessProfile.industry === 'finance' && q.includes('industry')) {
        return q.replace('my industry', 'financial services');
      }
      return q;
    });
    return customizedQuestions;
  }
  
  return questions;
}