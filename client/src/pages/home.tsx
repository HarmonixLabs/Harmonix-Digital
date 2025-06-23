import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SolBrain } from "@/components/sol-brain";
import { TokenMeter } from "@/components/token-meter";
import { AgentCard } from "@/components/agent-card";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { ChartLine, Cog, Shield, Search, Users, UserRoundCheck, Lock, TrendingUp, Activity, ArrowRight, Play } from "lucide-react";

export default function Home() {
  const [showOnboardingDemo, setShowOnboardingDemo] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const { data: agentTypes = [] } = useQuery({
    queryKey: ['/api/agent-types'],
    enabled: isAuthenticated
  });

  // Show different content based on authentication status
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Welcome back, <span className="text-harmonix-regal-gold">{user.name}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your SŌL brain is ready to orchestrate your AI agents. Access your dashboard to monitor tasks and deploy new capabilities.
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-12">
            <Button size="lg" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold hover:text-harmonix-deep-forest">
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card className="card-hover border-gray-800">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 harmony-gold">Your Organization</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Organization:</span>
                    <span>{user.organizationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Balance:</span>
                    <span className="harmony-gold">{user.tokenBalance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-gray-800">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 harmony-gold">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Activity className="mr-2 h-4 w-4" />
                    View Active Tasks
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Users className="mr-2 h-4 w-4" />
                    Deploy New Agent
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Cog className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
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
