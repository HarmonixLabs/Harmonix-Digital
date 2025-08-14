import React from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { ArrowRight, TrendingUp, Clock, DollarSign, Users, PlayCircle, LogIn, UserPlus, Check, Zap, Crown, Sparkles, Shield } from "lucide-react";

export default function CaseStudiesPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "10x Revenue Growth",
      description: "AI agents that never sleep, never miss leads, and continuously optimize your sales funnel"
    },
    {
      icon: Clock,
      title: "Save 40+ Hours Weekly",
      description: "Automate repetitive tasks and focus on what matters most - growing your business"
    },
    {
      icon: DollarSign,
      title: "680% Average ROI",
      description: "Our clients see massive returns within months of implementing Harmony agents"
    },
    {
      icon: Users,
      title: "Scale Without Limits",
      description: "Deploy unlimited AI agents to handle any business process imaginable"
    }
  ];

  const features = [
    "12+ Elite AI Agents Ready to Deploy",
    "Real-time CRM Integration",
    "Custom Agent Builder (No-Code)",
    "24/7 Performance Analytics",
    "NFT Agent Marketplace",
    "Enterprise-Grade Security"
  ];

  const plans = [
    {
      name: "Starter",
      price: "$97",
      period: "/month",
      description: "Perfect for solo entrepreneurs and small teams",
      features: [
        "3 Core AI Agents",
        "Basic CRM Integration",
        "Standard Support",
        "Up to 1,000 tasks/month"
      ],
      highlighted: false
    },
    {
      name: "Growth",
      price: "$297",
      period: "/month",
      description: "Ideal for growing businesses ready to scale",
      features: [
        "8 Elite AI Agents",
        "Advanced CRM Integration",
        "Priority Support",
        "Up to 10,000 tasks/month",
        "Custom Workflows",
        "Analytics Dashboard"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$997",
      period: "/month",
      description: "For large organizations needing unlimited power",
      features: [
        "All 12+ AI Agents",
        "White-label Solutions",
        "Dedicated Success Manager",
        "Unlimited tasks",
        "Custom Agent Development",
        "API Access"
      ],
      highlighted: false
    }
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <HarmonixLogo className="w-20 h-20 mx-auto mb-8" />
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-serif mb-6">
              Join the <span className="text-harmony-gold">Revolution</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the power of AI agent orchestration. Transform your business 
              with intelligent automation that scales infinitely.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold px-12 py-4 rounded-xl text-lg">
                  <UserPlus className="mr-2 h-6 w-6" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10 px-12 py-4 rounded-xl text-lg">
                  <LogIn className="mr-2 h-6 w-6" />
                  Sign In
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-400 mt-6">
              7-day free trial • No credit card required • Deploy in minutes
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white font-serif mb-4">
                Why Choose Harmony?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The most advanced AI agent platform trusted by forward-thinking businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800 text-center group hover:bg-gray-900/70 transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-harmony-gold/10 flex items-center justify-center group-hover:bg-harmony-gold/20 transition-colors">
                      <benefit.icon className="h-8 w-8 text-harmony-gold" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white font-serif mb-6">
                  Everything You Need to <span className="text-harmony-gold">Dominate</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Deploy a complete AI workforce in minutes. No coding required, infinite possibilities.
                </p>
                
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-harmony-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-harmony-gold" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-emerald-400/30 p-6">
                    <Zap className="h-8 w-8 text-emerald-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                    <p className="text-emerald-100/70 text-sm">Deploy agents in under 5 minutes</p>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 border-amber-400/30 p-6">
                    <Crown className="h-8 w-8 text-amber-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">Premium Quality</h3>
                    <p className="text-amber-100/70 text-sm">Enterprise-grade AI technology</p>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-400/30 p-6">
                    <Sparkles className="h-8 w-8 text-purple-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">Magic Simple</h3>
                    <p className="text-purple-100/70 text-sm">No-code drag & drop builder</p>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-400/30 p-6">
                    <Shield className="h-8 w-8 text-blue-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">Bank-Level Security</h3>
                    <p className="text-blue-100/70 text-sm">SOC 2 Type II certified</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white font-serif mb-4">
                Choose Your <span className="text-harmony-gold">Power Level</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Start free, scale infinitely. Every plan includes our core AI agents.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`
                  ${plan.highlighted 
                    ? 'bg-gradient-to-b from-harmony-gold/20 to-harmony-gold/10 border-harmony-gold/50 scale-105' 
                    : 'bg-gray-900/50 border-gray-800'
                  } relative overflow-hidden
                `}>
                  {plan.highlighted && (
                    <div className="absolute top-0 left-0 right-0 bg-harmony-gold text-black text-center py-2 text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <CardHeader className={plan.highlighted ? 'pt-12' : ''}>
                    <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-harmony-gold">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-harmony-gold flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                    
                    <Link href="/auth/signup">
                      <Button 
                        className={`w-full mt-6 ${
                          plan.highlighted 
                            ? 'bg-harmony-gold hover:bg-harmony-gold/80 text-black' 
                            : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                        }`}
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white font-serif mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of businesses already scaling with Harmony's AI agents. 
              Start your 7-day free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold px-12 py-4 rounded-xl text-lg">
                  <UserPlus className="mr-2 h-6 w-6" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10 px-12 py-4 rounded-xl text-lg">
                  <PlayCircle className="mr-2 h-6 w-6" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}