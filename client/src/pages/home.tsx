import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OptimizedHero } from "@/components/hero/optimized-hero";
import { EnhancedSolBrain } from "@/components/sol/enhanced-sol-brain";
import { TokenMeter } from "@/components/token-meter";
import { AgentCard } from "@/components/agent-card";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ChartLine, Cog, Shield, Search, Users, UserRoundCheck, Lock, TrendingUp, Activity, ArrowRight, Play, Zap, Link2, Clock, Brain, Bot, FileText, MessageSquare, Sparkles, CheckCircle, Timer, Star, InfoIcon } from "lucide-react";

// Platform Pillars Section
function PlatformPillarsSection() {
  const pillars = [
    {
      icon: Bot,
      title: "Agent Intelligence",
      description: "12 core agents trained for sales, systems, content, and client ops.",
      details: ["Sales automation", "Content creation", "Client management", "System optimization"]
    },
    {
      icon: Link2,
      title: "Seamless Integration", 
      description: "Plug into your tools: GHL, Stripe, Slack, Notion, ClickUp & more.",
      details: ["CRM sync", "Payment processing", "Team collaboration", "Project management"]
    },
    {
      icon: Clock,
      title: "Time Sovereignty",
      description: "Track time saved per task. Grow in flow — not in stress.",
      details: ["Time tracking", "Efficiency metrics", "Flow optimization", "Stress reduction"]
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-harmonix-night-pine/30">
      <div className="harmonix-container">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white font-serif">
            Build your business like a <span className="text-harmonix-regal-gold">sacred machine</span>
          </h2>
          <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
            A full AI operating system for teams who value freedom, clarity, and flow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, index) => (
            <Card key={index} className="harmonix-card-enhanced p-6 sm:p-8 group hover:scale-105 transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-harmonix-regal-gold/10 rounded-full flex items-center justify-center mb-6">
                  <pillar.icon className="w-8 h-8 text-harmonix-regal-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-harmonix-regal-gold">{pillar.title}</h3>
                <p className="text-harmonix-sage-fade leading-relaxed">{pillar.description}</p>
                <div className="space-y-2 pt-4">
                  {pillar.details.map((detail, i) => (
                    <div key={i} className="flex items-center justify-center space-x-2 text-sm text-harmonix-sage-fade">
                      <div className="w-1 h-1 bg-harmonix-regal-gold rounded-full" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Agent Showcase Section
function AgentShowcaseSection() {
  const [activeAgent, setActiveAgent] = React.useState(0);
  
  const agentCards = [
    {
      name: "Sales Rep Agent",
      description: "Books, follows up, and closes for you.",
      monthlyPrice: "$320/month",
      setupNote: "Requires Harmony Platform",
      tokensPerMonth: "50K",
      tokenUsage: "Moderate",
      timeSaved: "22 hrs/week",
      integrations: ["GHL", "Slack", "HubSpot"],
      features: ["Lead qualification", "Follow-up automation", "Deal closing", "Pipeline management"],
      agent: "cash"
    },
    {
      name: "SOP Architect",
      description: "Turns chaos into clean workflows.",
      monthlyPrice: "$240/month",
      setupNote: "Requires Harmony Platform",
      tokensPerMonth: "35K",
      tokenUsage: "High", 
      timeSaved: "18 hrs/week",
      integrations: ["Notion", "ClickUp", "Monday.com"],
      features: ["Process mapping", "Workflow automation", "Documentation", "Training materials"],
      agent: "sop"
    },
    {
      name: "Content Producer",
      description: "Auto-creates, schedules, and posts with tone-match.",
      monthlyPrice: "$280/month",
      setupNote: "Requires Harmony Platform",
      tokensPerMonth: "40K",
      tokenUsage: "Moderate",
      timeSaved: "25 hrs/week",
      integrations: ["Buffer", "Hootsuite", "Canva"],
      features: ["Content creation", "Social scheduling", "Brand voice", "Analytics tracking"],
      agent: "content"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="harmonix-container">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
            What Can Harmony Agents Do?
          </h2>
          <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
            Discover the specialized AI agents that will transform your business operations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Agent Tabs */}
          <div className="lg:w-1/3 space-y-4">
            {agentCards.map((agent, index) => (
              <Card 
                key={index}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-300 border-2",
                  activeAgent === index 
                    ? "border-harmonix-regal-gold bg-harmonix-regal-gold/10" 
                    : "border-harmonix-sage-fade/20 hover:border-harmonix-regal-gold/50"
                )}
                onClick={() => setActiveAgent(index)}
              >
                <h3 className="text-lg font-bold text-harmonix-regal-gold mb-2">{agent.name}</h3>
                <p className="text-sm text-harmonix-sage-fade">{agent.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs text-harmonix-sage-fade">
                    <span>Saves {agent.timeSaved}</span>
                    <br />
                    <span>Tokens: {agent.tokenUsage}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-harmonix-regal-gold">{agent.monthlyPrice}</div>
                    <div className="text-xs text-harmonix-sage-fade">{agent.setupNote}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Agent Details */}
          <div className="lg:w-2/3">
            <Card className="harmonix-card-enhanced p-6 sm:p-8 h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-harmonix-regal-gold mb-3">
                    {agentCards[activeAgent].name}
                  </h3>
                  <p className="text-lg text-harmonix-sage-fade">
                    {agentCards[activeAgent].description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                    <div className="text-xl font-bold text-harmonix-regal-gold">{agentCards[activeAgent].monthlyPrice}</div>
                    <div className="text-xs text-harmonix-sage-fade">Monthly Cost</div>
                  </div>
                  <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                    <div className="text-xl font-bold text-harmonix-regal-gold">{agentCards[activeAgent].tokensPerMonth}</div>
                    <div className="text-xs text-harmonix-sage-fade">Token Usage ({agentCards[activeAgent].tokenUsage})</div>
                  </div>
                  <div className="text-center p-3 bg-harmonix-night-pine/30 rounded-lg">
                    <div className="text-xl font-bold text-harmonix-regal-gold">{agentCards[activeAgent].timeSaved}</div>
                    <div className="text-xs text-harmonix-sage-fade">Time Saved</div>
                  </div>
                </div>

                {/* Integration badges */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-harmonix-sage-fade">Integrations:</h5>
                  <div className="flex flex-wrap gap-2">
                    {agentCards[activeAgent].integrations.map((integration, i) => (
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
                    {agentCards[activeAgent].features.map((feature, i) => (
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
                    onClick={() => window.location.href = `/marketplace/${agentCards[activeAgent].agent}`}
                  >
                    Deploy Agent
                  </Button>
                  <Button 
                    variant="outline"
                    className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                    onClick={() => window.location.href = `/demo?agent=${agentCards[activeAgent].agent}`}
                  >
                    <InfoIcon className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Why Different Section
function WhyDifferentSection() {
  const anchors = [
    { icon: "🌲", text: "Built with mysticism & discipline" },
    { icon: "📖", text: "Inspired by systems like GHL, Tesla, Notion, Christ & Tao" },
    { icon: "🎯", text: "Self-healing. Self-deploying. Self-executing." }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-harmonix-night-pine/20">
      <div className="harmonix-container">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light text-harmonix-regal-gold mb-12 sm:mb-16 font-serif leading-relaxed">
            "We didn't build another app — we built a new rhythm for how your business breathes."
          </blockquote>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {anchors.map((anchor, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="text-4xl sm:text-5xl mb-4">{anchor.icon}</div>
                <p className="text-lg sm:text-xl text-harmonix-sage-fade leading-relaxed font-medium">
                  {anchor.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const pricingTiers = [
    {
      name: "Starter",
      agents: "1 Agent",
      monthlyMRR: "$320/month",
      setupFee: "$4.4K",
      setupNote: "One-time platform setup",
      popular: false
    },
    {
      name: "Growth", 
      agents: "3–5 Agents",
      monthlyMRR: "$960 – $1,600/month",
      setupFee: "$8K",
      setupNote: "One-time platform setup",
      popular: true
    },
    {
      name: "Expansion",
      agents: "6–8 Agents", 
      monthlyMRR: "$1,920 – $2,560/month",
      setupFee: "$15K",
      setupNote: "One-time platform setup",
      popular: false
    },
    {
      name: "Enterprise",
      agents: "9–12 Agents",
      monthlyMRR: "$2,880 – $3,840/month",
      setupFee: "$21.5K+",
      setupNote: "One-time platform setup",
      popular: false
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="harmonix-container">
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
            <Timer className="w-4 h-4 mr-2" />
            Early Adopter Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
            Investment Tiers
          </h2>
          <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
            30% discount for the first 280 customers. Secure your spot before rates increase.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index}
              className={cn(
                "relative p-6 sm:p-8 transition-all duration-300 hover:scale-105",
                tier.popular 
                  ? "border-2 border-harmonix-regal-gold bg-harmonix-regal-gold/5" 
                  : "harmonix-card-enhanced"
              )}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-harmonix-regal-gold text-harmonix-deep-forest">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-harmonix-regal-gold">{tier.name}</h3>
                <div className="text-lg text-harmonix-sage-fade">{tier.agents}</div>
                
                <div className="space-y-4">
                  {/* Primary: Monthly Pricing */}
                  <div className="text-center py-3 bg-harmonix-deep-forest/50 rounded-lg">
                    <div className="text-2xl font-bold text-harmonix-regal-gold">
                      {tier.monthlyMRR}
                    </div>
                    <div className="text-xs text-harmonix-sage-fade">
                      Ongoing monthly cost
                    </div>
                  </div>
                  
                  {/* Secondary: Setup Fee (de-emphasized) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="text-harmonix-sage-fade line-through">
                        {tier.setupFee.replace('$', '$').replace('K', ',000')}
                      </span>
                      <Badge variant="secondary" className="text-xs bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
                        30% OFF
                      </Badge>
                    </div>
                    <div className="text-sm font-semibold text-white text-center">
                      {tier.setupFee.includes('+') ? tier.setupFee.replace('+', '+ setup') : tier.setupFee + ' setup'}
                    </div>
                    <div className="text-xs text-harmonix-sage-fade text-center">
                      {tier.setupNote}
                    </div>
                  </div>
                </div>

                <Button 
                  className={cn(
                    "w-full touch-friendly-btn",
                    tier.popular 
                      ? "bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                      : "border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                  )}
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => window.location.href = '/waitlist?ref=home'}
                >
                  Reserve My Spot
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// SōL Brain Section
function SolBrainSection() {
  const features = [
    "Diagnoses your business automatically",
    "Intelligent agent assignment logic", 
    "Real-time ROI calculator",
    "Adaptive learning from patterns"
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-harmonix-night-pine/30">
      <div className="harmonix-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <Badge className="mb-4 bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                <Brain className="w-4 h-4 mr-2" />
                SŌL Brain Preview
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
                What Is SŌL?
              </h2>
              <p className="text-lg sm:text-xl text-harmonix-sage-fade leading-relaxed">
                The consciousness that orchestrates your AI workforce. SŌL analyzes your business, 
                assigns the right agents, and optimizes your operations with sacred precision.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-harmonix-regal-gold mt-1 flex-shrink-0" />
                  <span className="text-harmonix-sage-fade">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg"
              className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
              onClick={() => window.location.href = '/sol-brain-demo'}
            >
              Ask SŌL how we can help your business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center">
            <EnhancedSolBrain 
              variant="agents"
              size="xl"
              animated={true}
              showAgentNodes={true}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Demo Success Section
function DemoSuccessSection() {
  const metrics = [
    { value: "40+", label: "Hours saved per week", icon: Clock },
    { value: "280+", label: "Early adopters", icon: Users },
    { value: "95%", label: "Automation success", icon: TrendingUp }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="harmonix-container">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
            This isn't theory — it's already saving teams 40+ hours/week
          </h2>
          <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
            Real results from businesses that have activated their AI workforce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="harmonix-card-enhanced p-6 sm:p-8 text-center">
              <metric.icon className="w-12 h-12 mx-auto mb-4 text-harmonix-regal-gold" />
              <div className="text-3xl sm:text-4xl font-bold text-harmonix-regal-gold mb-2">{metric.value}</div>
              <div className="text-harmonix-sage-fade">{metric.label}</div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg"
            className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
            onClick={() => window.location.href = '/demo-scenarios'}
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Live Demos
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
            onClick={() => window.location.href = '/case-studies'}
          >
            Read Success Stories
          </Button>
        </div>
      </div>
    </section>
  );
}

// Join Movement Section  
function JoinMovementSection() {
  const [email, setEmail] = React.useState("");
  const [deposit, setDeposit] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist submission
    window.location.href = deposit ? '/checkout?deposit=true' : '/checkout';
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-harmonix-night-pine/20">
      <div className="harmonix-container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
            Join the Movement
          </h2>
          <p className="text-lg sm:text-xl text-harmonix-sage-fade mb-8 sm:mb-12">
            Over 280+ early adopters have activated their agents. Secure your 30% discount before we reach capacity.
          </p>

          <Card className="harmonix-card-enhanced p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-harmonix-night-pine/50 border-harmonix-sage-fade/30 text-white placeholder:text-harmonix-sage-fade"
                  required
                />
                <Button 
                  type="submit"
                  className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                >
                  Reserve My Spot
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <input
                  type="checkbox"
                  id="deposit"
                  checked={deposit}
                  onChange={(e) => setDeposit(e.target.checked)}
                  className="w-4 h-4 text-harmonix-regal-gold bg-harmonix-night-pine border-harmonix-sage-fade rounded focus:ring-harmonix-regal-gold"
                />
                <label htmlFor="deposit" className="text-sm text-harmonix-sage-fade">
                  Pay $444 deposit now → Get 30% off + priority access
                </label>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  
  const { data: agentTypes = [] } = useQuery({
    queryKey: ['/api/agent-types'],
    enabled: isAuthenticated
  });

  // Show different content based on authentication status
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-harmonix-deep-forest">
        <Navbar />
        <div className="harmonix-container py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-harmonix-regal-gold font-serif">
              Welcome back, {user.name?.split(' ')[0]}
            </h1>
            <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto leading-relaxed">
              Your SŌL brain is ready to orchestrate your AI agents. Access your dashboard to monitor tasks and deploy new capabilities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
            <Button className="touch-friendly-btn w-full sm:w-auto bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 font-semibold">
              <Link href="/dashboard" className="flex items-center justify-center w-full">
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="touch-friendly-btn w-full sm:w-auto border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10">
              <Link href="/marketplace" className="flex items-center justify-center w-full">
                Explore Marketplace
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            <Card className="harmonix-card-enhanced p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-harmonix-regal-gold">Your Organization</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-harmonix-sage-fade">Organization:</span>
                  <span className="text-white font-medium">{user.organizationId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-harmonix-sage-fade">Role:</span>
                  <span className="text-white font-medium capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-harmonix-sage-fade">Token Balance:</span>
                  <span className="text-harmonix-regal-gold font-bold">{user.tokenBalance.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Card className="harmonix-card-enhanced p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-harmonix-regal-gold">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-left hover:bg-harmonix-regal-gold/10 p-3">
                  <Activity className="mr-3 h-5 w-5 text-harmonix-regal-gold" />
                  <span className="text-white">View Active Tasks</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left hover:bg-harmonix-regal-gold/10 p-3">
                  <Users className="mr-3 h-5 w-5 text-harmonix-regal-gold" />
                  <span className="text-white">Deploy New Agent</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left hover:bg-harmonix-regal-gold/10 p-3">
                  <Cog className="mr-3 h-5 w-5 text-harmonix-regal-gold" />
                  <span className="text-white">System Settings</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Landing page for non-authenticated users - Conversion engine
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      <OptimizedHero />
      <PlatformPillarsSection />
      <AgentShowcaseSection />
      <WhyDifferentSection />
      <PricingSection />
      <SolBrainSection />
      <DemoSuccessSection />
      <JoinMovementSection />
      <Footer />
    </div>
  );
  const featuredAgents = [
    {
      id: 1,
      name: "CA$H (Sales Agent)",
      description: "Lead generation, follow-up, and revenue optimization - Always Closing",
      icon: TrendingUp,
      category: "sales", 
      performance: "+85%",
      tier: "flagship",
      gradient: "from-red-500 to-black",
      available: true
    },
    {
      id: 2,
      name: "Concierge Agent",
      description: "24/7 customer support and client onboarding",
      icon: UserRoundCheck,
      category: "concierge",
      performance: "+75%",
      tier: "flagship", 
      gradient: "from-blue-500 to-cyan-600",
      available: true
    },
    {
      id: 3,
      name: "HR Agent", 
      description: "Talent acquisition and employee management",
      icon: Users,
      category: "hr",
      performance: "+68%",
      tier: "flagship",
      gradient: "from-purple-500 to-pink-600",
      available: true
    },
    {
      id: 4,
      name: "Executive Assistant",
      description: "High-level schedule and communication management",
      icon: Shield,
      category: "executive",
      performance: "+92%",
      tier: "flagship",
      gradient: "from-amber-500 to-yellow-600",
      available: true
    },
    {
      id: 5,
      name: "Finance Agent",
      description: "Cash flow monitoring and budget forecasting",
      icon: ChartLine,
      category: "finance",
      performance: "+78%",
      tier: "next-wave",
      gradient: "from-indigo-500 to-blue-600",
      available: true
    },
    {
      id: 6,
      name: "Content Creation Agent",
      description: "AI copywriting for blogs, emails, and SEO",
      icon: Search,
      category: "content",
      performance: "+84%",
      tier: "next-wave",
      gradient: "from-teal-500 to-green-600",
      available: false
    },

  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <HarmonixLogo size="xl" variant="gold" />
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight font-serif">
                      <span className="text-harmony-gold">Harmonix</span> AI Platform
                    </h1>
                    <p className="text-xl text-harmony-gold font-medium">
                      Intelligent Systems for Timeless Sovereignty
                    </p>
                  </div>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  The complete AI automation platform that helps visionary businesses Build, Automate, and Exit 
                  through intelligent systems orchestrated by the SŌL brain engine.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-harmony-gold hover:bg-yellow-500 text-harmony-dark font-semibold px-8 py-4"
                  onClick={() => window.location.href = '/marketplace'}
                >
                  Explore Digital Team Members
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold hover:text-harmony-dark font-semibold px-8 py-4"
                  onClick={() => window.location.href = '/agents/cash'}
                >
                  Meet Agent CA$H
                </Button>
              </div>

              {/* Feature Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold harmony-gold">12</div>
                  <div className="text-sm text-gray-400">AI Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold harmony-teal">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>

            {/* AI Agent Visualization */}
            <div className="relative flex justify-center">
              <SolBrain />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Discover the power of <span className="harmony-gold">AI Agents</span>
            </h2>
            <p className="text-xl text-gray-300">Automate tasks and boost productivity with our AI-powered agents.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-gray-800">
              <CardContent className="p-8">
                <div className="harmony-teal text-4xl mb-6">
                  <ChartLine size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Increase Efficiency</h3>
                <p className="text-gray-300 leading-relaxed">
                  AI agents handle routine tasks, freeing up your time for strategic work.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-gray-800">
              <CardContent className="p-8">
                <div className="harmony-gold text-4xl mb-6">
                  <Cog size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Customize Your Agents</h3>
                <p className="text-gray-300 leading-relaxed">
                  Tailor each AI agent to meet your specific business needs.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-gray-800">
              <CardContent className="p-8">
                <div className="text-green-400 text-4xl mb-6">
                  <Shield size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure and Reliable</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ensuring your data is protected and your operations run smoothly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agent Marketplace Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Agent <span className="harmony-gold">Marketplace</span>
            </h2>
            <p className="text-xl text-gray-300">Discover and deploy specialized AI agents for your business needs</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search agents"
                className="pl-12 bg-harmony-slate border-gray-800 focus:border-harmony-gold"
              />
            </div>
            <Select>
              <SelectTrigger className="bg-harmony-slate border-gray-800 focus:border-harmony-gold">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sales">Sales & Marketing</SelectItem>
                <SelectItem value="hr">HR & Recruiting</SelectItem>
                <SelectItem value="customer">Customer Service</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-harmony-slate border-gray-800 focus:border-harmony-gold">
                <SelectValue placeholder="All Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="high">High Performance</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agent Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* SŌL Brain Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Meet <span className="harmony-teal">SŌL</span> - The Brain Engine
            </h2>
            <p className="text-xl text-gray-300">The central intelligence that orchestrates all your AI agents</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Intelligent Task Routing</h3>
                <p className="text-gray-300 leading-relaxed">
                  SŌL analyzes incoming tasks and automatically routes them to the most suitable AI agent, 
                  ensuring optimal efficiency and accuracy across your entire operation.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Adaptive Learning</h3>
                <p className="text-gray-300 leading-relaxed">
                  The brain engine continuously learns from agent interactions and user feedback, 
                  becoming smarter and more efficient over time.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Unified Communication</h3>
                <p className="text-gray-300 leading-relaxed">
                  All your agents communicate through SŌL, enabling seamless collaboration and 
                  knowledge sharing across your AI workforce.
                </p>
              </div>
            </div>

            <div className="relative flex justify-center">
              <SolBrain showAgentNodes />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Onboarding Demo */}
      {showOnboardingDemo && (
        <OnboardingWizard 
          onComplete={() => setShowOnboardingDemo(false)}
          onSkip={() => setShowOnboardingDemo(false)}
        />
      )}
    </div>
  );
}
