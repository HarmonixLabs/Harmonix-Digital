import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Zap, 
  DollarSign, 
  TrendingUp,
  Bot,
  Sparkles,
  Shield,
  Wallet,
  ShoppingCart,
  Heart,
  Download,
  Play,
  Settings,
  Crown,
  Plus,
  Gem,
  Lock,
  Unlock,
  Grid,
  List,
  SlidersHorizontal,
  BarChart,
  Calendar,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageWrapper } from '@/components/transitions/page-wrapper';
import { MarketplaceQuickAccess } from '@/components/marketplace/MarketplaceQuickAccess';
import { CORE_AGENTS, DASHBOARD_PLANS } from '@/data/harmonixAgentPricing';

interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: string;
  monthlyPrice: number;
  setupPrice: number;
  rating: number;
  reviews: number;
  deployments: number;
  features: string[];
  creator: {
    name: string;
    verified: boolean;
    avatar: string;
  };
  tags: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  nftPrice?: number;
  royaltyPercentage?: number;
  available?: boolean;
}

const FEATURED_AGENTS: Agent[] = [
  {
    id: 'cash-agent',
    name: 'Agent CA$H',
    avatar: '💰',
    description: 'Elite revenue generation specialist with advanced CRM integration and Loom script generation',
    category: 'Sales',
    monthlyPrice: 350,
    setupPrice: 1000,
    rating: 4.9,
    reviews: 247,
    deployments: 1240,
    features: ['Lead Processing', 'CRM Sync', 'Loom Scripts', 'Follow-up Automation', 'Pipeline Management'],
    creator: {
      name: 'Harmonix Labs',
      verified: true,
      avatar: '🌟'
    },
    tags: ['revenue', 'crm', 'automation', 'sales'],
    rarity: 'legendary',
    nftPrice: 0.5,
    royaltyPercentage: 15
  },
  {
    id: 'grace-concierge',
    name: 'Grace "The Velvet Bridge"',
    avatar: '👸',
    description: 'Sophisticated concierge agent for premium customer experience management',
    category: 'Customer Service',
    monthlyPrice: 300,
    setupPrice: 900,
    rating: 4.8,
    reviews: 189,
    deployments: 890,
    features: ['24/7 Support', 'VIP Handling', 'Appointment Booking', 'Knowledge Base', 'Escalation Management'],
    creator: {
      name: 'Harmonix Labs',
      verified: true,
      avatar: '🌟'
    },
    tags: ['customer-service', 'premium', 'support'],
    rarity: 'epic',
    nftPrice: 0.3,
    royaltyPercentage: 12
  },
  {
    id: 'social-maven',
    name: 'Social Media Maven',
    avatar: '📱',
    description: 'Complete social media automation with trend analysis and content generation',
    category: 'Marketing',
    monthlyPrice: 320,
    setupPrice: 1000,
    rating: 4.7,
    reviews: 156,
    deployments: 675,
    features: ['Content Generation', 'Trend Analysis', 'Scheduling', 'Engagement Tracking', 'Multi-Platform'],
    creator: {
      name: 'Harmonix Labs',
      verified: true,
      avatar: '🌟'
    },
    tags: ['social-media', 'content', 'automation'],
    rarity: 'rare',
    nftPrice: 0.2,
    royaltyPercentage: 10
  },
  {
    id: 'hr-specialist',
    name: 'HR Operations Specialist',
    avatar: '👥',
    description: 'Comprehensive human resources management with onboarding and training automation',
    category: 'HR',
    monthlyPrice: 280,
    setupPrice: 800,
    rating: 4.6,
    reviews: 134,
    deployments: 542,
    features: ['Onboarding', 'Training Management', 'Performance Tracking', 'Compliance', 'Team Analytics'],
    creator: {
      name: 'Harmonix Labs',
      verified: true,
      avatar: '🌟'
    },
    tags: ['hr', 'onboarding', 'management'],
    rarity: 'epic',
    nftPrice: 0.35,
    royaltyPercentage: 13
  },
  {
    id: 'project-manager',
    name: 'Project Orchestrator Pro',
    avatar: '📊',
    description: 'Advanced project management with timeline optimization and resource allocation',
    category: 'Operations',
    monthlyPrice: 280,
    setupPrice: 800,
    rating: 4.8,
    reviews: 198,
    deployments: 723,
    features: ['Project Planning', 'Resource Management', 'Timeline Optimization', 'Risk Assessment', 'Team Coordination'],
    creator: {
      name: 'Harmonix Labs',
      verified: true,
      avatar: '🌟'
    },
    tags: ['project-management', 'operations', 'optimization'],
    rarity: 'epic',
    nftPrice: 0.4,
    royaltyPercentage: 14
  },
  {
    id: 'sop-builder',
    name: 'SOP Master Builder',
    avatar: '📋',
    description: 'Intelligent standard operating procedure creation and workflow optimization',
    category: 'Operations',
    monthlyPrice: 300,
    setupPrice: 950,
    rating: 4.5,
    reviews: 112,
    deployments: 445,
    features: ['SOP Creation', 'Workflow Design', 'Process Optimization', 'Documentation', 'Training Materials'],
    creator: {
      name: 'Harmonix Labs',
      verified: true,
      avatar: '🌟'
    },
    tags: ['sop', 'workflows', 'documentation'],
    rarity: 'rare',
    nftPrice: 0.25,
    royaltyPercentage: 11
  }
];

const CATEGORIES = ['All', 'Sales', 'Marketing', 'Customer Service', 'HR', 'Operations', 'Finance', 'Development'];
const RARITY_COLORS = {
  common: 'bg-slate-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

export default function Marketplace() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState(FEATURED_AGENTS);
  const [filteredAgents, setFilteredAgents] = useState(FEATURED_AGENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let filtered = agents;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(agent => agent.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      if (priceRange === 'free') {
        filtered = filtered.filter(agent => agent.monthlyPrice === 0);
      } else if (priceRange === 'budget') {
        filtered = filtered.filter(agent => agent.monthlyPrice > 0 && agent.monthlyPrice <= 500);
      } else if (priceRange === 'premium') {
        filtered = filtered.filter(agent => agent.monthlyPrice > 500 && agent.monthlyPrice <= 1000);
      } else if (priceRange === 'enterprise') {
        filtered = filtered.filter(agent => agent.monthlyPrice > 1000);
      }
    }

    // Filter by rarity
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(agent => agent.rarity === rarityFilter);
    }

    // Filter by creator (for future expansion)
    if (creatorFilter !== 'all') {
      filtered = filtered.filter(agent => agent.creator.name === creatorFilter);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.deployments - a.deployments);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.monthlyPrice - a.monthlyPrice);
        break;
      case 'newest':
        // For demo, keeping original order as "newest"
        break;
    }

    setFilteredAgents(filtered);
  }, [searchTerm, selectedCategory, sortBy, priceRange, rarityFilter, creatorFilter, agents]);

  const toggleFavorite = (agentId: string) => {
    setFavorites(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  // Demo agents that are available without authentication
  const DEMO_AGENT_IDS = ['cash-agent', 'echo-agent', 'flow-agent', 'sol-agent'];
  
  const isAgentLocked = (agentId: string) => {
    // Agents are locked if user is not authenticated AND it's not a demo agent
    return !isAuthenticated && !DEMO_AGENT_IDS.includes(agentId);
  };

  const handleDeploy = async (agent: Agent) => {
    if (!isAuthenticated) {
      // Prompt login/signup if user is anonymous
      window.location.href = '/get-started';
      return;
    }
    
    try {
      const token = localStorage.getItem('harmonix_token');
      const response = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          agentId: agent.id,
          agentName: agent.name,
          monthlyPrice: agent.monthlyPrice,
          setupPrice: agent.setupPrice,
          paymentType: 'subscription'
        })
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      const errorMessage = error instanceof Error ? error.message : "Unable to process purchase. Please try again.";
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'epic': return <Gem className="w-4 h-4 text-purple-400" />;
      case 'rare': return <Sparkles className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        <div className="bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d] min-h-screen">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-harmony-gold/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white font-serif mb-3">
                Agent <span className="text-harmony-gold">Marketplace</span>
              </h1>
              <p className="text-gray-300 text-lg">Deploy, create, and trade elite AI agents for your business empire</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-harmony-gold/50 text-harmony-gold hover:bg-harmony-gold/10 px-6 py-3">
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
              <Link href="/create-agent">
                <Button className="bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold px-6 py-3">
                  <Bot className="w-5 h-5 mr-2" />
                  Create Agent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Marketplace Quick Access Navigation */}
        <div className="mb-8">
          <MarketplaceQuickAccess />
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search agents by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-emerald-100 placeholder-slate-400"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 bg-gray-800/50 border-gray-600 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category} className="text-emerald-100">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 bg-slate-800/50 border-slate-600 text-emerald-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="popular" className="text-emerald-100">Most Popular</SelectItem>
                <SelectItem value="rating" className="text-emerald-100">Highest Rated</SelectItem>
                <SelectItem value="price-low" className="text-emerald-100">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="text-emerald-100">Price: High to Low</SelectItem>
                <SelectItem value="newest" className="text-emerald-100">Newest</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode Toggle */}
            <div className="flex border border-slate-600 rounded-lg overflow-hidden bg-slate-800/50">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600 text-emerald-100">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-emerald-100">All Prices</SelectItem>
                <SelectItem value="free" className="text-emerald-100">Free</SelectItem>
                <SelectItem value="budget" className="text-emerald-100">$1-500</SelectItem>
                <SelectItem value="premium" className="text-emerald-100">$501-1000</SelectItem>
                <SelectItem value="enterprise" className="text-emerald-100">$1000+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-36 bg-slate-800/50 border-slate-600 text-emerald-100">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-emerald-100">All Rarities</SelectItem>
                <SelectItem value="common" className="text-emerald-100">Common</SelectItem>
                <SelectItem value="rare" className="text-emerald-100">Rare</SelectItem>
                <SelectItem value="epic" className="text-emerald-100">Epic</SelectItem>
                <SelectItem value="legendary" className="text-emerald-100">Legendary</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-400 hover:text-emerald-100"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              More Filters
            </Button>

            <div className="ml-auto text-sm text-slate-400">
              Showing {filteredAgents.length} of {agents.length} agents
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">12+</div>
                <div className="text-sm text-slate-400">Available Agents</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">4.2K+</div>
                <div className="text-sm text-slate-400">Total Deployments</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">98.7%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">24/7</div>
                <div className="text-sm text-slate-400">Agent Support</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Marketplace Tabs */}
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-600">
            <TabsTrigger value="browse" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Browse Agents
            </TabsTrigger>
            <TabsTrigger value="my-agents" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              My Agents ({user ? '3' : '0'})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Create & Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Agent Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredAgents.map((agent) => (
                <Card key={agent.id} className={`bg-slate-800/50 border-slate-600 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-400/10 hover:scale-105 transition-all duration-300 group ${isAgentLocked(agent.id) ? 'opacity-90' : ''} ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
                  <CardHeader className="relative">
                    {/* Lock overlay for locked agents */}
                    {isAgentLocked(agent.id) && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-t-lg flex items-center justify-center z-10">
                        <Lock className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl relative">
                          {agent.avatar}
                          {/* Small lock indicator next to avatar */}
                          {isAgentLocked(agent.id) && (
                            <Lock className="w-4 h-4 text-slate-400 absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-emerald-100 text-lg flex items-center gap-2">
                            {agent.name}
                            {!isAgentLocked(agent.id) && DEMO_AGENT_IDS.includes(agent.id) && (
                              <Badge variant="secondary" className="text-xs bg-emerald-600/20 text-emerald-400 border-emerald-400/30">
                                Demo
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={`${RARITY_COLORS[agent.rarity]} text-white`}>
                              {getRarityIcon(agent.rarity)}
                              <span className="ml-1 capitalize">{agent.rarity}</span>
                            </Badge>
                            {agent.creator.verified && (
                              <Shield className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(agent.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart 
                          className={`w-4 h-4 ${favorites.includes(agent.id) ? 'text-red-400 fill-current' : 'text-slate-400'}`} 
                        />
                      </Button>
                    </div>
                    
                    <p className="text-slate-400 text-sm mt-2 text-truncate-2">{agent.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {agent.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                          {feature}
                        </Badge>
                      ))}
                      {agent.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                          +{agent.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{agent.rating}</span>
                        <span>({agent.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{agent.deployments.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-semibold">${agent.monthlyPrice}/month</span>
                        <span className="text-slate-400 text-sm">Setup: ${agent.setupPrice}</span>
                      </div>
                      
                      {agent.nftPrice && (
                        <div className="text-xs text-slate-400">
                          NFT: {agent.nftPrice} ETH • {agent.royaltyPercentage}% royalty
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {isAgentLocked(agent.id) ? (
                        <>
                          <Button 
                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                            onClick={() => window.location.href = '/get-started'}
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Sign Up to Deploy
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-slate-500 text-slate-400"
                            disabled
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleDeploy(agent)}
                          >
                            {DEMO_AGENT_IDS.includes(agent.id) && !isAuthenticated ? (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Try Demo
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Deploy
                              </>
                            )}
                          </Button>
                          <Button variant="outline" className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">No agents found</h3>
                <p className="text-slate-500">Try adjusting your search criteria or browse all categories</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-agents">
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">Your Agent Collection</h3>
              <p className="text-slate-500 mb-4">
                {isAuthenticated ? 'Deploy your first agent to get started' : 'Sign in to view your agents'}
              </p>
              {!isAuthenticated && (
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/signup">Sign Up to Get Started</Link>
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">Your Favorites</h3>
              <p className="text-slate-500">
                {favorites.length === 0 
                  ? 'Save agents you like by clicking the heart icon'
                  : `You have ${favorites.length} favorite agents`
                }
              </p>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">Creator Economy</h3>
              <p className="text-slate-500 mb-6">Build and monetize your own AI agents</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="bg-slate-800/50 border-slate-600 text-center">
                  <CardContent className="p-6">
                    <Bot className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h4 className="text-emerald-100 font-semibold mb-2">Create Agents</h4>
                    <p className="text-slate-400 text-sm">Build custom AI agents with our no-code builder</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-600 text-center">
                  <CardContent className="p-6">
                    <DollarSign className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h4 className="text-emerald-100 font-semibold mb-2">Earn Revenue</h4>
                    <p className="text-slate-400 text-sm">Get monthly recurring revenue from subscriptions</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-600 text-center">
                  <CardContent className="p-6">
                    <Gem className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h4 className="text-emerald-100 font-semibold mb-2">Mint NFTs</h4>
                    <p className="text-slate-400 text-sm">Create tradeable NFTs with royalty splits</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <Link href="/create-agent">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Start Creating
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
      <Footer />
    </div>
    </PageWrapper>
  );
}