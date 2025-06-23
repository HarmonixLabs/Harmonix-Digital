import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
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

    // Enhanced AI response with personalized pain point analysis
    setTimeout(() => {
      let response = "";
      
      // Analyze user message for specific pain points and industry context
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("saas") || lowerMessage.includes("software") || lowerMessage.includes("tech")) {
        response = `For SaaS companies like yours, I see three critical automation opportunities:

**Lead Management Crisis**: Your sales team is likely drowning in unqualified leads. CA$HFLOW solves this by automatically scoring, nurturing, and routing only high-intent prospects to your sales team. Result: 300% more qualified conversations.

**Customer Success Bottleneck**: Your CS team can't scale 1:1 support. Our Concierge Agent handles routine inquiries, onboarding sequences, and escalation protocols 24/7. This frees your team for strategic accounts.

**Content & Social Media Chaos**: Creating consistent content across channels is eating your marketing budget. Our Content Creation + Social Media agents work together - one creates, the other distributes and engages. We've seen 400% content output increases.

Which of these pain points resonates most with your current situation?`;
      }
      else if (lowerMessage.includes("customer service") || lowerMessage.includes("support") || lowerMessage.includes("overwhelmed")) {
        response = `I understand customer service overwhelm - it's one of the most common scaling challenges. Here's exactly how our agents solve this:

**The Triage System**: Our Concierge Agent instantly categorizes all incoming requests using natural language processing. Simple questions get immediate answers, complex issues route to specialists, and urgent matters trigger immediate escalation.

**24/7 Intelligent Response**: Instead of basic chatbots, our agent understands context and customer history. It can handle password resets, billing questions, feature explanations, and even troubleshooting - all while maintaining your brand voice.

**Seamless Human Handoff**: When human intervention is needed, the agent provides complete context to your team, including customer sentiment, previous interactions, and suggested solutions.

**Real Impact**: One consulting firm reduced support tickets by 70% while improving customer satisfaction scores from 3.2 to 4.8 stars.

What's your current monthly support ticket volume? I can calculate your specific ROI.`;
      }
      else if (lowerMessage.includes("lead") || lowerMessage.includes("sales") || lowerMessage.includes("conversion")) {
        response = `Lead qualification and follow-up is where most businesses lose millions in revenue. Here's how CA$HFLOW transforms this:

**The Lead Scoring Matrix**: Every prospect gets automatically scored across 12 data points - budget authority, timeline, pain level, and buying signals. No more wasted time on tire-kickers.

**Intelligent Follow-Up Sequences**: Instead of generic drip campaigns, CA$HFLOW crafts personalized follow-ups based on each prospect's behavior, industry, and engagement patterns. Open rates average 68% vs industry standard of 21%.

**Real-Time Opportunity Alerts**: When a prospect visits your pricing page 3 times or downloads multiple resources, your sales team gets instant notifications with complete context.

**Calendar Integration**: Qualified prospects can instantly book meetings with the right team member based on deal size, industry, and complexity.

**Proven Results**: A FinTech startup increased qualified meetings by 480% and closed 85% more deals within 90 days.

What's your current lead-to-customer conversion rate? I can show you the specific improvement pathway.`;
      }
      else if (lowerMessage.includes("project") || lowerMessage.includes("team") || lowerMessage.includes("coordination")) {
        response = `Team coordination chaos is killing your productivity. Our Project Manager + Executive Assistant combo creates perfect organizational harmony:

**Intelligent Task Distribution**: The system analyzes team capacity, skill sets, and current workload to automatically assign tasks to the optimal team member. No more bottlenecks or overloaded individuals.

**Predictive Timeline Management**: Using historical data and current variables, it predicts project delays before they happen and automatically adjusts timelines or resources.

**Cross-Team Communication Hub**: All stakeholders get relevant updates without information overload. Engineers see technical blockers, executives see budget impacts, clients see progress milestones.

**Resource Optimization**: The system identifies when you're overstaffed, understaffed, or when freelancers would be more cost-effective than full-time hires.

**Real Success Story**: A 50-person consulting firm increased project delivery speed by 340% while reducing miscommunication incidents by 92%.

How many active projects is your team currently managing? I can calculate your specific efficiency gains.`;
      }
      else {
        response = `I'm analyzing your business context to provide the most relevant agent recommendations. Let me ask a few targeted questions:

**Industry Context**: What specific industry are you in? This helps me understand your unique compliance requirements, customer journey complexity, and seasonal patterns.

**Current Pain Points**: What's the #1 process that's eating most of your team's time right now? Is it lead qualification, customer support, content creation, or something else?

**Team Size**: How many people are in your organization? This determines whether you need enterprise-level orchestration or startup-focused growth tools.

**Revenue Stage**: Are you pre-revenue, growing steadily, or scaling rapidly? Each stage needs different automation priorities.

The more specific you are, the more precise my agent recommendations will be. Think of me as your personal AI strategist who's analyzed thousands of similar businesses.

What's the biggest operational headache keeping you up at night?`;
      }
      
      setConversation(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const demoQuestions = [
    "I run a SaaS company with 20 employees. We're struggling with lead quality and customer churn.",
    "Our customer service team is overwhelmed with 500+ tickets per month. We need immediate help.",
    "We're a consulting firm losing deals due to slow proposal generation and follow-up.",
    "Our startup needs to scale content marketing but can't afford a full marketing team.",
    "We're processing payroll and HR manually for 50 employees. It's consuming too much time.",
    "Our e-commerce business needs better inventory management and customer engagement."
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