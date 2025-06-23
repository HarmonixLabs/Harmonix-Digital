import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Sparkles, MessageCircle, BookOpen, Target } from "lucide-react";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredButton } from "@/components/ui/sacred-button";
import { FadeIn } from "@/components/ui/micro-animations";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AILearningAssistantProps {
  userContext?: {
    role: string;
    industry: string;
    experience: string;
    currentModule?: string;
  };
}

const predefinedQuestions = [
  "How do I get started with my first AI agent?",
  "What's the best agent for my industry?",
  "How long does implementation typically take?",
  "Can I integrate with my existing CRM?",
  "What ROI can I expect from AI automation?"
];

const contextualSuggestions = {
  beginner: [
    "Show me the basics of AI automation",
    "What should I learn first?",
    "Help me understand AI terminology"
  ],
  intermediate: [
    "How do I optimize my current workflows?",
    "What advanced features should I explore?",
    "Best practices for scaling AI implementation"
  ],
  advanced: [
    "Custom API integrations and development",
    "Building complex multi-agent workflows",
    "Performance optimization strategies"
  ]
};

export function AILearningAssistant({ userContext }: AILearningAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi! I'm your AI learning assistant. I'm here to help you navigate your Harmonix journey based on your role as a ${userContext?.role || 'professional'} in the ${userContext?.industry || 'industry'} sector. What would you like to learn about today?`,
      timestamp: new Date(),
      suggestions: userContext?.experience ? contextualSuggestions[userContext.experience] : predefinedQuestions
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with contextual intelligence
    setTimeout(() => {
      const aiResponse = generateContextualResponse(content, userContext);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateContextualResponse = (userInput: string, context?: any) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('get started') || lowerInput.includes('begin')) {
      return {
        content: `Perfect! Based on your role as a ${context?.role || 'professional'}, I recommend starting with our ${getRecommendedStartingPoint(context?.role)} module. This will give you the foundation you need for successful AI implementation in your specific context.`,
        suggestions: [
          "Show me the recommended learning path",
          "What tools will I need?",
          "How long will this take?"
        ]
      };
    }
    
    if (lowerInput.includes('agent') || lowerInput.includes('automation')) {
      return {
        content: `For ${context?.industry || 'your industry'}, I typically recommend starting with ${getRecommendedAgent(context?.industry)}. This agent is specifically designed to address the most common challenges in your sector and can deliver immediate value.`,
        suggestions: [
          "Show me agent capabilities",
          "How do I configure this agent?",
          "What results can I expect?"
        ]
      };
    }
    
    if (lowerInput.includes('roi') || lowerInput.includes('return')) {
      return {
        content: `Based on similar implementations in ${context?.industry || 'your industry'}, clients typically see 20-40% efficiency gains within the first 30 days. The specific ROI depends on your current processes, but our calculator can give you a personalized estimate.`,
        suggestions: [
          "Calculate my potential ROI",
          "Show me case studies",
          "What metrics should I track?"
        ]
      };
    }
    
    // Default contextual response
    return {
      content: `That's a great question! As someone with ${context?.experience || 'your'} experience level, let me provide you with the most relevant information. Would you like me to explain this in the context of your specific role and industry?`,
      suggestions: [
        "Yes, make it specific to my situation",
        "Show me general best practices",
        "Provide detailed technical information"
      ]
    };
  };

  const getRecommendedStartingPoint = (role?: string) => {
    if (!role) return "Introduction to AI Automation";
    
    const roleMap: Record<string, string> = {
      'ceo': 'Executive AI Strategy',
      'sales': 'Sales Automation Fundamentals',
      'marketing': 'Marketing Intelligence Setup',
      'operations': 'Process Optimization Basics',
      'developer': 'Technical Implementation Guide'
    };
    
    return roleMap[role.toLowerCase()] || "Introduction to AI Automation";
  };

  const getRecommendedAgent = (industry?: string) => {
    if (!industry) return "our Sales Agent";
    
    const industryMap: Record<string, string> = {
      'technology': 'our Technical Sales Agent with API integration capabilities',
      'healthcare': 'our Compliance-aware Healthcare Agent',
      'finance': 'our Regulatory-compliant Finance Agent',
      'real estate': 'our Property Management and Lead Qualification Agent',
      'e-commerce': 'our Customer Experience and Inventory Agent'
    };
    
    return industryMap[industry.toLowerCase()] || "our Sales Agent";
  };

  return (
    <FadeIn>
      <SacredCard className="h-96 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="harmonix-header-font text-lg text-white flex items-center">
            <Brain className="h-5 w-5 text-harmonix-gold mr-2" />
            AI Learning Assistant
            <Badge variant="outline" className="ml-auto text-xs text-harmonix-gold border-harmonix-gold">
              Contextual
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4">
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
                    {message.suggestions && (
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
                placeholder="Ask me anything about AI automation..."
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
            
            <div className="flex flex-wrap gap-1 mt-2">
              {predefinedQuestions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="text-xs px-2 py-1 rounded bg-harmonix-sage/10 text-harmonix-sage hover:bg-harmonix-sage/20 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </SacredCard>
    </FadeIn>
  );
}