import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/harmonix-logo";
import { SolBrain } from "@/components/sol-brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, MessageCircle, Sparkles, ArrowRight, Send } from "lucide-react";

export default function SoulBrainPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Welcome to the SŌL brain engine. I'm here to help you discover which AI agents would be perfect for your business. What industry are you in and what challenges are you facing?"
    }
  ]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setIsLoading(true);

    // Add user message to conversation
    setConversation(prev => [...prev, { role: "user", content: userMessage }]);

    // Simulate AI response (in production, this would call your OpenAI API)
    setTimeout(() => {
      const responses = [
        "Based on your industry, I recommend starting with our CA$HFLOW sales agent to optimize lead conversion and our Executive Assistant agent for workflow management. Would you like to learn more about these agents?",
        "That's a common challenge! Our Project Manager and Finance agents work together to streamline operations and provide real-time insights. They've helped similar businesses reduce overhead by 40%. Shall I show you how they integrate?",
        "Excellent question! The SŌL brain orchestrates all agents to work as a unified team. For your use case, I'd suggest our Content Creation and Social Media agents paired with our Analyst agent for performance tracking. Would you like a custom demo?",
        "Perfect! For scaling businesses like yours, our HR agent can automate recruitment while our Legal/Compliance agent ensures everything meets regulations. Together with CA$HFLOW, they create a complete growth engine. Ready to see them in action?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setConversation(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  const demoQuestions = [
    "I run a SaaS company with 20 employees. What agents would help us scale?",
    "Our customer service is overwhelmed. Which agents can help?",
    "We need better lead qualification and follow-up processes.",
    "How can AI help with project management and team coordination?"
  ];

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32">
                <SolBrain size="lg" animated={true} />
              </div>
            </div>
            
            <div className="space-y-4">
              <Badge className="bg-harmony-gold/10 text-harmony-gold border-harmony-gold/30 mb-4">
                Interactive Demo
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
                Meet the <span className="text-harmony-gold">SŌL Brain</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience the central intelligence that orchestrates all Harmony agents. 
                Tell me about your business and I'll recommend the perfect AI agents for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-900/50 border-harmony-gold/30">
            <CardHeader>
              <CardTitle className="text-2xl text-harmony-gold font-serif text-center flex items-center justify-center">
                <Brain className="mr-3 h-6 w-6" />
                SŌL Brain Consultation
              </CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Get personalized AI agent recommendations for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Conversation Display */}
              <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-800/30 rounded-lg">
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-harmony-gold text-harmony-dark' 
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-harmony-gold rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-harmony-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-harmony-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your business or ask about specific agents..."
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Questions */}
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Try these questions:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {demoQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs border-gray-600 text-gray-300 hover:border-harmony-gold hover:text-harmony-gold text-left h-auto p-3 whitespace-normal"
                      onClick={() => setMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-serif mb-4">
              How SŌL Brain <span className="text-harmony-gold">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The central intelligence that makes all Harmony agents work together seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-harmony-gold" />
                </div>
                <CardTitle className="text-harmony-gold">Understands Your Business</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Analyzes your industry, team size, and challenges to recommend the perfect combination of AI agents
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-harmony-gold" />
                </div>
                <CardTitle className="text-harmony-gold">Orchestrates Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Coordinates multiple agents to work together, sharing knowledge and optimizing workflows across your business
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-harmony-gold" />
                </div>
                <CardTitle className="text-harmony-gold">Continuous Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Learns from every interaction to provide better recommendations and optimize agent performance over time
                </CardDescription>
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
              Ready to Deploy Your <span className="text-harmony-gold">AI Team</span>?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The SŌL brain has analyzed thousands of businesses to perfect agent recommendations. 
              Let's build your intelligent system for timeless sovereignty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                  Join Harmony Waitlist
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                  Browse Agent Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}