import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mic, MicOff, X, Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedSolInterfaceProps {
  isExpanded: boolean;
  onClose: () => void;
  onResponse: (input: string) => string;
  businessProfile: {
    industry: string;
    goal: string;
    budget: string;
  };
  onProfileUpdate: (profile: any) => void;
}

export function EnhancedSolInterface({
  isExpanded,
  onClose,
  onResponse,
  businessProfile,
  onProfileUpdate
}: EnhancedSolInterfaceProps) {
  const [voiceMode, setVoiceMode] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [conversation, setConversation] = useState([
    {
      type: "sol",
      message: "Hello! I'm SŌL, your AI orchestration brain. Tell me about your business goals and I'll recommend the perfect agents for you."
    }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { type: "user", message: chatInput };
    const solResponse = { type: "sol", message: onResponse(chatInput) };
    
    setConversation(prev => [...prev, userMessage, solResponse]);
    setChatInput("");
  };

  const quickPrompts = [
    "I need to automate sales processes",
    "Help with content creation",
    "Streamline operations",
    "Improve customer support"
  ];

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 shadow-lg"
          onClick={() => setConversation(prev => prev.length === 1 ? prev : prev.slice(0, 1))}
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] bg-harmonix-night-pine border-harmonix-sage-fade/30">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-harmonix-regal-gold/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-harmonix-regal-gold" />
            </div>
            <div>
              <CardTitle className="text-harmonix-regal-gold">SŌL Brain Interface</CardTitle>
              <p className="text-sm text-harmonix-sage-fade">AI Agent Orchestration System</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceMode(!voiceMode)}
              className={cn(
                "border-harmonix-sage-fade/30",
                voiceMode 
                  ? "bg-harmonix-regal-gold text-harmonix-deep-forest" 
                  : "text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
              )}
            >
              {voiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              {voiceMode ? "Voice On" : "Voice Off"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4 text-harmonix-sage-fade" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-full space-y-4">
          {/* Business Profile Quick Setup */}
          <div className="grid grid-cols-3 gap-3">
            <Select
              value={businessProfile.industry}
              onValueChange={(value) => onProfileUpdate({ ...businessProfile, industry: value })}
            >
              <SelectTrigger className="bg-harmonix-deep-forest border-harmonix-sage-fade/30">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS/Technology</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Primary goal"
              value={businessProfile.goal}
              onChange={(e) => onProfileUpdate({ ...businessProfile, goal: e.target.value })}
              className="bg-harmonix-deep-forest border-harmonix-sage-fade/30"
            />

            <Select
              value={businessProfile.budget}
              onValueChange={(value) => onProfileUpdate({ ...businessProfile, budget: value })}
            >
              <SelectTrigger className="bg-harmonix-deep-forest border-harmonix-sage-fade/30">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1k">Under $1K/month</SelectItem>
                <SelectItem value="1k-5k">$1K - $5K/month</SelectItem>
                <SelectItem value="5k-10k">$5K - $10K/month</SelectItem>
                <SelectItem value="over-10k">$10K+/month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto space-y-4 bg-harmonix-deep-forest/50 rounded-lg p-4">
            {conversation.map((msg, index) => (
              <div key={index} className={cn(
                "flex",
                msg.type === "user" ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  msg.type === "user" 
                    ? "bg-harmonix-regal-gold text-harmonix-deep-forest"
                    : "bg-harmonix-sage-fade/20 text-harmonix-sage-fade"
                )}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer border-harmonix-sage-fade/30 text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
                onClick={() => setChatInput(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              placeholder="Ask SŌL about your business needs..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-harmonix-deep-forest border-harmonix-sage-fade/30"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}