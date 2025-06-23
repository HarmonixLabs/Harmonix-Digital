import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, Send, Sparkles, MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredButton } from "@/components/ui/sacred-button";
import { FadeIn } from "@/components/ui/micro-animations";
import { useAuth } from "@/lib/auth";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  context?: {
    page?: string;
    userRole?: string;
    currentTask?: string;
  };
}

interface IntegratedChatbotProps {
  userContext?: {
    role?: string;
    industry?: string;
    experience?: string;
    currentPage?: string;
    onboardingStep?: string;
  };
}

export function IntegratedChatbot({ userContext }: IntegratedChatbotProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize conversation based on context
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = generateWelcomeMessage(userContext);
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userContext]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateWelcomeMessage = (context?: any): ChatMessage => {
    let content = "Hi! I'm your AI assistant, here to help you navigate Harmonix.";
    let suggestions = [
      "How do I get started?",
      "Show me available agents",
      "Help with current task"
    ];

    if (context?.currentPage === 'onboarding') {
      content = "Welcome to Harmonix! I'm here to guide you through the onboarding process. What questions do you have?";
      suggestions = [
        "What information do I need to provide?",
        "How long does onboarding take?",
        "Can I skip steps and come back later?"
      ];
    } else if (context?.currentPage === 'dashboard') {
      content = `Welcome back${user?.name ? `, ${user.name}` : ''}! I can help you manage your agents, analyze performance, or answer any questions.`;
      suggestions = [
        "Show me my agent performance",
        "How do I deploy a new agent?",
        "Explain my dashboard metrics"
      ];
    } else if (context?.currentPage === 'marketplace') {
      content = "I can help you find the perfect AI agents for your needs. What type of automation are you looking for?";
      suggestions = [
        "Recommend agents for my industry",
        "Compare agent pricing",
        "Show agent capabilities"
      ];
    }

    return {
      id: '1',
      type: 'ai',
      content,
      timestamp: new Date(),
      suggestions,
      context: {
        page: context?.currentPage,
        userRole: context?.role
      }
    };
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      context: {
        page: userContext?.currentPage,
        userRole: userContext?.role,
        currentTask: userContext?.onboardingStep
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate AI processing with contextual responses
      const response = await generateAIResponse(content, userContext, messages);
      
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.content,
          timestamp: new Date(),
          suggestions: response.suggestions
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
        suggestions: ["Try asking again", "Contact support", "Go to help center"]
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const generateAIResponse = async (userInput: string, context?: any, messageHistory?: ChatMessage[]) => {
    const lowerInput = userInput.toLowerCase();
    
    // Context-aware responses based on current page
    if (context?.currentPage === 'onboarding') {
      if (lowerInput.includes('skip') || lowerInput.includes('later')) {
        return {
          content: "You can skip the onboarding and complete it later from your dashboard. However, I recommend finishing it now to get personalized agent recommendations. Would you like me to help you through the current step?",
          suggestions: [
            "Help me with current step",
            "Show me what I'm missing",
            "Skip to dashboard"
          ]
        };
      }
      
      if (lowerInput.includes('time') || lowerInput.includes('long')) {
        return {
          content: "The onboarding typically takes 5-10 minutes. It's designed to understand your business needs and recommend the best AI agents for your specific situation. Each step builds on the previous one to create your personalized experience.",
          suggestions: [
            "Continue with onboarding",
            "What happens after onboarding?",
            "Can I change answers later?"
          ]
        };
      }
    }

    if (context?.currentPage === 'dashboard') {
      if (lowerInput.includes('performance') || lowerInput.includes('metrics')) {
        return {
          content: "I can help you understand your agent performance metrics. Your dashboard shows token usage, task completion rates, and ROI metrics. Would you like me to explain any specific metric or help you optimize performance?",
          suggestions: [
            "Explain token usage",
            "Show ROI calculations",
            "How to improve performance"
          ]
        };
      }
      
      if (lowerInput.includes('deploy') || lowerInput.includes('new agent')) {
        return {
          content: "To deploy a new agent, go to the Marketplace, select an agent that fits your needs, and click 'Deploy'. I can recommend agents based on your industry and current goals. What type of automation are you looking for?",
          suggestions: [
            "Recommend agents for me",
            "Show me the marketplace",
            "Explain agent types"
          ]
        };
      }
    }

    // General AI assistance responses
    if (lowerInput.includes('get started') || lowerInput.includes('begin')) {
      return {
        content: `Based on your role as a ${context?.role || 'professional'}, I recommend starting with agent deployment. Our most popular starting agents are Sales, Customer Service, and Process Automation. Which area would you like to focus on first?`,
        suggestions: [
          "Help me choose an agent",
          "Show me quick wins",
          "Explain the process"
        ]
      };
    }

    if (lowerInput.includes('agent') && lowerInput.includes('recommend')) {
      const industryAgents = getIndustryRecommendations(context?.industry);
      return {
        content: `For ${context?.industry || 'your industry'}, I recommend starting with ${industryAgents.primary}. This agent typically delivers the fastest ROI and integrates well with existing processes. ${industryAgents.explanation}`,
        suggestions: [
          `Deploy ${industryAgents.primary}`,
          "See all recommendations",
          "Compare agent features"
        ]
      };
    }

    if (lowerInput.includes('roi') || lowerInput.includes('return')) {
      return {
        content: "ROI varies by agent and use case, but our clients typically see 20-40% efficiency gains within 30 days. I can calculate a personalized ROI estimate based on your specific situation. Would you like me to run those numbers?",
        suggestions: [
          "Calculate my ROI",
          "Show me case studies",
          "Explain ROI factors"
        ]
      };
    }

    // Default intelligent response
    return {
      content: "I understand you're asking about that. Let me provide you with the most relevant information based on your current context. Would you like me to be more specific about any particular aspect?",
      suggestions: [
        "Be more specific",
        "Show me examples",
        "Help with something else"
      ]
    };
  };

  const getIndustryRecommendations = (industry?: string) => {
    const recommendations: Record<string, { primary: string; explanation: string }> = {
      'technology': {
        primary: 'Technical Sales Agent',
        explanation: 'It can qualify leads based on technical requirements and integrate with your development workflow.'
      },
      'healthcare': {
        primary: 'Compliance Management Agent',
        explanation: 'It ensures HIPAA compliance while automating patient communication and scheduling.'
      },
      'finance': {
        primary: 'Risk Assessment Agent',
        explanation: 'It automates compliance checks and client onboarding while maintaining regulatory standards.'
      },
      'real estate': {
        primary: 'Lead Qualification Agent',
        explanation: 'It can score leads, schedule showings, and manage follow-ups automatically.'
      }
    };

    return recommendations[industry?.toLowerCase() || ''] || {
      primary: 'Sales Agent',
      explanation: 'It provides immediate value by qualifying leads and automating follow-ups.'
    };
  };

  const ChatInterface = () => (
    <div className={`${isMinimized ? 'h-16' : 'h-96'} flex flex-col transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b border-harmonix-sage/20">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-harmonix-gold" />
          <span className="harmonix-header-font text-white">AI Assistant</span>
          <Badge variant="outline" className="text-xs text-harmonix-gold border-harmonix-gold">
            Live
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-harmonix-sage hover:text-white"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-harmonix-sage hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-harmonix-gold text-harmonix-black'
                        : 'bg-harmonix-pine/30 text-harmonix-sage'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    {message.suggestions && message.type === 'ai' && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(suggestion)}
                            className="block w-full text-left text-xs p-2 rounded bg-harmonix-sage/10 hover:bg-harmonix-sage/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-harmonix-pine/30 text-harmonix-sage p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-harmonix-gold rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-harmonix-gold rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-harmonix-gold rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-harmonix-sage/20">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white placeholder:text-harmonix-sage/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    handleSendMessage(inputValue.trim());
                  }
                }}
              />
              <SacredButton
                size="sm"
                onClick={() => {
                  if (inputValue.trim()) {
                    handleSendMessage(inputValue.trim());
                  }
                }}
                disabled={!inputValue.trim() || isTyping}
                className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
              >
                <Send className="h-4 w-4" />
              </SacredButton>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <SacredButton
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </SacredButton>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96">
          <SacredCard className="bg-harmonix-black/95 backdrop-blur-sm border-harmonix-gold/30">
            <ChatInterface />
          </SacredCard>
        </div>
      )}
    </>
  );
}