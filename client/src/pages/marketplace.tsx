import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, Star, Users, Zap, DollarSign, TrendingUp, Bot, Sparkles, Shield,
  ShoppingCart, Heart, Download, Play, Crown, Plus, Gem, Lock, Grid, List,
  ChevronRight, Brain, MessageSquare, FileText, Briefcase, Code, Palette, Music
} from 'lucide-react';

import { PageWrapper } from '@/components/transitions/page-wrapper';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  category: string;
  monthlyPrice: number;
  setupPrice: number;
  rating: number;
  reviews: number;
  deployments: number;
  features: string[];
  tags: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  status: 'live' | 'coming-soon' | 'beta';
  discount?: number;
}

const FEATURED_AGENTS: Agent[] = [
  {
    id: 'cash-agent',
    name: 'Agent CA$H',
    icon: DollarSign,
    description: 'Elite revenue generation specialist with advanced CRM integration',
    category: 'Sales',
    monthlyPrice: 350,
    setupPrice: 1000,
    rating: 4.9,
    reviews: 247,
    deployments: 1240,
    features: ['Lead Processing', 'CRM Sync', 'Loom Scripts', 'Follow-up Automation'],
    tags: ['revenue', 'crm', 'automation', 'sales'],
    rarity: 'legendary',
    status: 'live',
    discount: 15
  },
  {
    id: 'grace-concierge',
    name: 'GRACE',
    icon: Crown,
    description: 'Sophisticated concierge agent for premium customer experience',
    category: 'Customer Service',
    monthlyPrice: 300,
    setupPrice: 900,
    rating: 4.8,
    reviews: 189,
    deployments: 890,
    features: ['24/7 Support', 'VIP Handling', 'Appointment Booking', 'Knowledge Base'],
    tags: ['customer-service', 'premium', 'support'],
    rarity: 'epic',
    status: 'live'
  },
  {
    id: 'echo-social',
    name: 'ECHO',
    icon: MessageSquare,
    description: 'Social media automation with trend analysis and content generation',
    category: 'Marketing',
    monthlyPrice: 320,
    setupPrice: 1000,
    rating: 4.7,
    reviews: 156,
    deployments: 670,
    features: ['Content Creation', 'Post Scheduling', 'Trend Analysis', 'Engagement Tracking'],
    tags: ['social-media', 'content', 'marketing'],
    rarity: 'epic',
    status: 'live'
  },
  {
    id: 'flow-operations',
    name: 'FLOW',
    icon: Zap,
    description: 'Operations optimizer with workflow automation and process management',
    category: 'Operations',
    monthlyPrice: 280,
    setupPrice: 800,
    rating: 4.8,
    reviews: 203,
    deployments: 1120,
    features: ['Process Automation', 'Workflow Design', 'Task Management', 'Team Coordination'],
    tags: ['operations', 'workflow', 'productivity'],
    rarity: 'rare',
    status: 'live'
  },
  {
    id: 'kairos-analytics',
    name: 'KAIROS',
    icon: TrendingUp,
    description: 'Advanced analytics and insights with predictive modeling',
    category: 'Analytics',
    monthlyPrice: 400,
    setupPrice: 1200,
    rating: 4.9,
    reviews: 98,
    deployments: 340,
    features: ['Predictive Analytics', 'Custom Reports', 'Data Visualization', 'KPI Tracking'],
    tags: ['analytics', 'data', 'insights'],
    rarity: 'legendary',
    status: 'beta'
  },
  {
    id: 'sol-brain',
    name: 'SŌL',
    icon: Brain,
    description: 'Master orchestrator connecting all agents for seamless collaboration',
    category: 'System',
    monthlyPrice: 500,
    setupPrice: 1500,
    rating: 5.0,
    reviews: 412,
    deployments: 2100,
    features: ['Agent Orchestration', 'Cross-Agent Communication', 'System Optimization', 'AI Learning'],
    tags: ['orchestration', 'ai', 'system'],
    rarity: 'legendary',
    status: 'live'
  }
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedAgents, setSavedAgents] = useState<string[]>([]);

  const categories = ['all', 'Sales', 'Marketing', 'Customer Service', 'Operations', 'Analytics', 'System'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  const filteredAgents = FEATURED_AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || agent.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'live': return 'text-green-400';
      case 'beta': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const toggleSaveAgent = (agentId: string) => {
    setSavedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-harmonix-deep-forest/20 to-harmonix-regal-gold/10 border-b border-harmonix-cedar-mist/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
          <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
            <div className="text-center space-y-6">
              <HarmonixLogo className="w-20 h-20 mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-serif">
                AI Agent <span className="text-harmonix-regal-gold">Marketplace</span>
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-3xl mx-auto">
                Deploy elite AI agents that transform your business operations. 
                Each agent is expertly crafted to deliver immediate value.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-harmonix-regal-gold">12+</div>
                  <div className="text-sm text-harmonix-sage-fade">Elite Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-harmonix-regal-gold">5,000+</div>
                  <div className="text-sm text-harmonix-sage-fade">Deployments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-harmonix-regal-gold">40hrs</div>
                  <div className="text-sm text-harmonix-sage-fade">Saved Weekly</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="sticky top-16 z-40 bg-harmonix-night-pine/95 backdrop-blur-md border-b border-harmonix-cedar-mist/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harmonix-sage-fade" />
                  <Input
                    placeholder="Search agents by name or capability..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white placeholder-harmonix-sage-fade/50 focus:border-harmonix-regal-gold"
                  />
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px] bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-harmonix-night-pine border-harmonix-cedar-mist/30">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-harmonix-cedar-mist/20">
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                  <SelectTrigger className="w-[150px] bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white">
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent className="bg-harmonix-night-pine border-harmonix-cedar-mist/30">
                    {rarities.map(rarity => (
                      <SelectItem key={rarity} value={rarity} className="text-white hover:bg-harmonix-cedar-mist/20">
                        {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 border-l border-harmonix-cedar-mist/30 pl-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "text-harmonix-sage-fade hover:text-harmonix-regal-gold",
                      viewMode === 'grid' && "text-harmonix-regal-gold"
                    )}
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "text-harmonix-sage-fade hover:text-harmonix-regal-gold",
                      viewMode === 'list' && "text-harmonix-regal-gold"
                    )}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Grid/List */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredAgents.map((agent) => (
              <Card 
                key={agent.id} 
                className={cn(
                  "bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20 hover:border-harmonix-regal-gold/50 transition-all duration-300",
                  "hover:shadow-lg hover:shadow-harmonix-regal-gold/10 hover:scale-[1.02]",
                  viewMode === 'list' && "flex"
                )}
              >
                <CardHeader className={cn(viewMode === 'list' && "flex-1")}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-harmonix-regal-gold/10 rounded-lg flex items-center justify-center">
                        <agent.icon className="w-7 h-7 text-harmonix-regal-gold" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          {agent.name}
                          {agent.status === 'live' && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              LIVE
                            </Badge>
                          )}
                          {agent.status === 'beta' && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                              BETA
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs", getRarityColor(agent.rarity))}>
                            {agent.rarity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-harmonix-sage-fade">{agent.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveAgent(agent.id)}
                      className="text-harmonix-sage-fade hover:text-harmonix-regal-gold"
                    >
                      <Heart className={cn("h-5 w-5", savedAgents.includes(agent.id) && "fill-harmonix-regal-gold text-harmonix-regal-gold")} />
                    </Button>
                  </div>
                  
                  <p className="text-harmonix-sage-fade text-sm mb-4">{agent.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="border-harmonix-cedar-mist/30 text-harmonix-sage-fade text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {agent.features.length > 3 && (
                      <Badge variant="outline" className="border-harmonix-cedar-mist/30 text-harmonix-sage-fade text-xs">
                        +{agent.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center py-3 border-y border-harmonix-cedar-mist/20">
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-harmonix-regal-gold fill-harmonix-regal-gold" />
                        <span className="text-white font-semibold">{agent.rating}</span>
                      </div>
                      <span className="text-xs text-harmonix-sage-fade">{agent.reviews} reviews</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{agent.deployments}</div>
                      <span className="text-xs text-harmonix-sage-fade">deployments</span>
                    </div>
                    <div>
                      <div className="text-harmonix-regal-gold font-semibold">${agent.monthlyPrice}</div>
                      <span className="text-xs text-harmonix-sage-fade">/month</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className={cn("pt-0", viewMode === 'list' && "flex items-center gap-4")}>
                  {/* Pricing & Actions */}
                  <div className={cn("space-y-3", viewMode === 'list' && "flex gap-3 space-y-0")}>
                    {agent.discount && (
                      <div className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold text-center py-2 px-3 rounded-lg text-sm font-medium">
                        🎉 {agent.discount}% OFF - Limited Time
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Deploy Now
                      </Button>
                      <Button variant="outline" className="border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-center text-xs text-harmonix-sage-fade">
                      Setup: ${agent.setupPrice} one-time
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-20">
              <Bot className="w-16 h-16 text-harmonix-sage-fade/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No agents found</h3>
              <p className="text-harmonix-sage-fade">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-harmonix-regal-gold/20 to-harmonix-regal-gold/10 border-t border-harmonix-cedar-mist/20">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build Your <span className="text-harmonix-regal-gold">AI Workforce?</span>
            </h2>
            <p className="text-harmonix-sage-fade mb-8 max-w-2xl mx-auto">
              Join thousands of businesses automating their operations with Harmony's elite AI agents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold">
                <Crown className="mr-2 h-5 w-5" />
                Get Full Access - $297/month
              </Button>
              <Button size="lg" variant="outline" className="border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10">
                <Plus className="mr-2 h-5 w-5" />
                Create Custom Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}