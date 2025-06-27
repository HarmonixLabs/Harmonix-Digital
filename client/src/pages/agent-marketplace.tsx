import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  DollarSign, 
  Users, 
  MessageCircle, 
  Brain, 
  Briefcase, 
  TrendingUp,
  Shield,
  FileText,
  Calendar,
  BarChart,
  Zap,
  Star,
  Clock
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  pricing: {
    base: number;
    custom: number;
    maintenance: number;
  };
  features: string[];
  rating: number;
  deployments: number;
  setupTime: string;
  tags: string[];
}

export default function AgentMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const agents: Agent[] = [
    {
      id: "cashflow",
      name: "Cashflow Agent",
      description: "Elite revenue optimization AI agent with advanced lead qualification, pipeline automation, and conversion tracking",
      icon: DollarSign,
      category: "Sales",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Revenue Forecasting", "Lead Qualification", "Pipeline Automation", "CRM Integration", "ROI Analytics"],
      rating: 4.9,
      deployments: 347,
      setupTime: "2-3 weeks",
      tags: ["flagship", "high-roi", "proven"]
    },
    {
      id: "grace",
      name: "Grace Agent",
      description: "Velvet bridge concierge with sophisticated customer journey orchestration and premium service delivery",
      icon: MessageCircle,
      category: "Customer Experience",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Customer Journey Mapping", "Premium Support", "Personalized Service", "Escalation Management", "Experience Analytics"],
      rating: 4.8,
      deployments: 289,
      setupTime: "1-2 weeks",
      tags: ["premium", "customer-favorite", "elegant"]
    },
    {
      id: "aster",
      name: "Aster Agent",
      description: "Advanced content creation and social media management with brand voice consistency and engagement optimization",
      icon: FileText,
      category: "Marketing",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Content Generation", "Brand Voice", "Social Media", "SEO Optimization", "Engagement Analytics"],
      rating: 4.7,
      deployments: 256,
      setupTime: "1-2 weeks",
      tags: ["creative", "brand-focused", "viral"]
    },
    {
      id: "iris",
      name: "Iris Agent",
      description: "Digital host with sophisticated social amplification, influencer coordination, and viral content strategies",
      icon: TrendingUp,
      category: "Social Media",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Social Amplification", "Influencer Coordination", "Viral Strategies", "Community Management", "Trend Analysis"],
      rating: 4.8,
      deployments: 234,
      setupTime: "1-2 weeks",
      tags: ["viral", "influencer", "social-media"]
    },
    {
      id: "helios",
      name: "Helios Agent",
      description: "Executive assistant with advanced calendar optimization, strategic planning, and high-level administrative automation",
      icon: Briefcase,
      category: "Executive",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Calendar Optimization", "Strategic Planning", "Executive Reporting", "Meeting Coordination", "Priority Management"],
      rating: 4.7,
      deployments: 198,
      setupTime: "2-3 weeks",
      tags: ["executive-grade", "strategic", "premium"]
    },
    {
      id: "atlas",
      name: "Atlas Agent",
      description: "Project management powerhouse with advanced workflow automation, resource optimization, and delivery tracking",
      icon: BarChart,
      category: "Operations",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Workflow Automation", "Resource Optimization", "Delivery Tracking", "Team Coordination", "Performance Analytics"],
      rating: 4.6,
      deployments: 176,
      setupTime: "2-3 weeks",
      tags: ["enterprise", "scalable", "efficient"]
    },
    {
      id: "calliope",
      name: "Calliope Agent",
      description: "Creative storytelling agent with advanced narrative generation, brand messaging, and content personalization",
      icon: Star,
      category: "Creative",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Narrative Generation", "Brand Messaging", "Content Personalization", "Creative Strategy", "Storytelling Analytics"],
      rating: 4.8,
      deployments: 167,
      setupTime: "1-2 weeks",
      tags: ["creative", "storytelling", "brand"]
    },
    {
      id: "zephyr",
      name: "Zephyr Agent",
      description: "Communication specialist with advanced email automation, customer outreach, and relationship management",
      icon: MessageCircle,
      category: "Communications",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Email Automation", "Customer Outreach", "Relationship Management", "Communication Analytics", "Response Optimization"],
      rating: 4.7,
      deployments: 145,
      setupTime: "1-2 weeks",
      tags: ["communication", "automation", "relationship"]
    },
    {
      id: "aurum",
      name: "Aurum Agent",
      description: "Financial analyst with advanced revenue tracking, cost optimization, and financial intelligence reporting",
      icon: DollarSign,
      category: "Finance",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Revenue Tracking", "Cost Optimization", "Financial Intelligence", "Budget Planning", "Financial Analytics"],
      rating: 4.6,
      deployments: 134,
      setupTime: "2-3 weeks",
      tags: ["financial", "analytical", "optimization"]
    },
    {
      id: "athena",
      name: "Athena Agent",
      description: "Strategic advisor with advanced business intelligence, market analysis, and competitive intelligence capabilities",
      icon: Brain,
      category: "Strategy",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Business Intelligence", "Market Analysis", "Competitive Intelligence", "Strategic Planning", "Insight Analytics"],
      rating: 4.8,
      deployments: 123,
      setupTime: "2-3 weeks",
      tags: ["strategic", "intelligence", "advisor"]
    },
    {
      id: "phoenix",
      name: "Phoenix Agent",
      description: "Transformation specialist with change management, process optimization, and organizational development capabilities",
      icon: Zap,
      category: "Transformation",
      pricing: { base: 4400, custom: 5148, maintenance: 300 },
      features: ["Change Management", "Process Optimization", "Organizational Development", "Transformation Analytics", "Recovery Planning"],
      rating: 4.7,
      deployments: 98,
      setupTime: "3-4 weeks",
      tags: ["transformation", "change", "optimization"]
    },
    {
      id: "sol",
      name: "SŌL Agent",
      description: "Master orchestrator brain that coordinates all agents with advanced multi-agent workflows and unified intelligence",
      icon: Brain,
      category: "Orchestration",
      pricing: { base: 8000, custom: 9360, maintenance: 500 },
      features: ["Multi-Agent Coordination", "Unified Intelligence", "Workflow Orchestration", "Cross-Agent Analytics", "Master Control"],
      rating: 5.0,
      deployments: 89,
      setupTime: "4-6 weeks",
      tags: ["master", "orchestrator", "premium", "flagship"]
    }
  ];

  const categories = ["all", "Sales", "Marketing", "Operations", "Customer Service", "Human Resources", "Finance", "Legal"];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.deployments - a.deployments;
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.pricing.base - b.pricing.base;
      case "price-high":
        return b.pricing.base - a.pricing.base;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <HarmonixLogo size="lg" variant="gold" className="justify-center mb-6" />
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
                Agent <span className="text-harmony-gold">Marketplace</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Discover and deploy specialized AI agents designed for every aspect of your business. 
                From sales automation to compliance management, build your intelligent team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search agents by name, feature, or capability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-400 mb-6">
            Showing {sortedAgents.length} of {agents.length} agents
          </div>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAgents.map((agent) => (
              <Card key={agent.id} className="bg-gray-900/50 border-gray-800 hover:border-harmony-gold/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                        <agent.icon className="h-6 w-6 text-harmony-gold" />
                      </div>
                      <div>
                        <Badge className="bg-harmony-green/20 text-harmony-green border-harmony-green/30 mb-1">
                          {agent.category}
                        </Badge>
                        {agent.tags.includes("bestseller") && (
                          <Badge className="bg-harmony-gold/20 text-harmony-gold border-harmony-gold/30 ml-1">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-harmony-gold fill-current" />
                      <span className="text-sm font-semibold text-harmony-gold">{agent.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-harmony-gold font-serif text-lg">{agent.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Key Features:</h4>
                    <div className="space-y-1">
                      {agent.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Zap className="w-3 h-3 text-harmony-gold" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                      {agent.features.length > 3 && (
                        <div className="text-sm text-gray-400">
                          +{agent.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="text-harmony-gold font-semibold">{agent.deployments}</div>
                      <div className="text-gray-400">Deployments</div>
                    </div>
                    <div>
                      <div className="text-harmony-gold font-semibold">{agent.setupTime}</div>
                      <div className="text-gray-400">Setup Time</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Base Installation:</span>
                      <span className="text-harmony-gold font-semibold">${agent.pricing.base.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Custom Setup:</span>
                      <span className="text-harmony-gold font-semibold">${agent.pricing.custom.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monthly Maintenance:</span>
                      <span className="text-harmony-gold font-semibold">${agent.pricing.maintenance}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                      Deploy Agent
                    </Button>
                    <Button variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
            <Brain className="w-16 h-16 text-harmony-gold mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white font-serif mb-4">
              Need a Custom Agent Solution?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our SŌL brain can orchestrate multiple agents or create entirely custom solutions 
              for your unique business requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                  Request Custom Solution
                </Button>
              </Link>
              <Link href="/demo-deploy">
                <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                  Try Demo First
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