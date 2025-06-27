import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Zap, 
  ShoppingCart, 
  Eye,
  Heart,
  TrendingUp,
  Award,
  Coins,
  Gem,
  Play,
  Download,
  Share2
} from 'lucide-react';

const AgentMarketplace = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  // Mock agent data with NFT information
  const mockAgents = [
    {
      id: '1',
      name: 'Sales Accelerator Pro',
      description: 'AI-powered sales agent that automates lead generation, follow-ups, and deal closing with 85% success rate.',
      category: 'Sales',
      icon: '💼',
      base_price: 97.00,
      setup_fee: 197.00,
      rating_average: 4.9,
      rating_count: 234,
      deployment_count: 1250,
      is_featured: true,
      capabilities: ['lead_generation', 'email_automation', 'crm_integration', 'sales_analytics'],
      integrations: ['salesforce', 'hubspot', 'pipedrive'],
      nft_contract_address: '0x1234...5678',
      nft_token_id: '001',
      total_minted: 1250,
      max_supply: 5000,
      creator: 'HARMONIX Team',
      created_at: '2024-01-15',
      tags: ['popular', 'verified', 'enterprise']
    },
    {
      id: '2',
      name: 'Content Creator Genius',
      description: 'Generate high-converting content across all platforms with AI that understands your brand voice.',
      category: 'Marketing',
      icon: '✍️',
      base_price: 77.00,
      setup_fee: 147.00,
      rating_average: 4.7,
      rating_count: 189,
      deployment_count: 890,
      is_featured: true,
      capabilities: ['content_creation', 'seo_optimization', 'social_media', 'brand_voice'],
      integrations: ['wordpress', 'buffer', 'hootsuite'],
      nft_contract_address: '0x2345...6789',
      nft_token_id: '002',
      total_minted: 890,
      max_supply: 3000,
      creator: 'ContentCorp',
      created_at: '2024-01-20',
      tags: ['trending', 'creative']
    },
    {
      id: '3',
      name: 'Customer Success Oracle',
      description: '24/7 customer support with emotional intelligence and 98% satisfaction rate.',
      category: 'Support',
      icon: '🎧',
      base_price: 67.00,
      setup_fee: 97.00,
      rating_average: 4.8,
      rating_count: 156,
      deployment_count: 670,
      is_featured: false,
      capabilities: ['customer_support', 'sentiment_analysis', 'ticket_management'],
      integrations: ['zendesk', 'intercom', 'freshdesk'],
      nft_contract_address: '0x3456...7890',
      nft_token_id: '003',
      total_minted: 670,
      max_supply: 2500,
      creator: 'SupportTech',
      created_at: '2024-02-01',
      tags: ['reliable', 'support']
    },
    {
      id: '4',
      name: 'SŌL Master Orchestrator',
      description: 'The ultimate AI that coordinates all your agents and manages complex multi-agent workflows.',
      category: 'Orchestration',
      icon: '🧠',
      base_price: 297.00,
      setup_fee: 597.00,
      rating_average: 5.0,
      rating_count: 89,
      deployment_count: 234,
      is_featured: true,
      capabilities: ['agent_orchestration', 'workflow_management', 'decision_making'],
      integrations: ['all_harmonix_agents'],
      nft_contract_address: '0x4567...8901',
      nft_token_id: '004',
      total_minted: 234,
      max_supply: 1000,
      creator: 'HARMONIX Team',
      created_at: '2024-01-10',
      tags: ['premium', 'exclusive', 'verified']
    }
  ];

  useEffect(() => {
    setAgents(mockAgents);
    setFilteredAgents(mockAgents);
  }, []);

  useEffect(() => {
    let filtered = agents;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(agent => agent.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sort agents
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating_average - a.rating_average);
        break;
      case 'popular':
        filtered.sort((a, b) => b.deployment_count - a.deployment_count);
        break;
      case 'price_low':
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    setFilteredAgents(filtered);
  }, [agents, searchTerm, selectedCategory, sortBy]);

  const categories = ['all', 'sales', 'marketing', 'support', 'hr', 'finance', 'orchestration'];

  const handleDeployAgent = (agent) => {
    console.log('Deploying agent:', agent.name);
    // Deployment logic would go here
  };

  const handleMintNFT = (agent) => {
    console.log('Minting NFT for agent:', agent.name);
    // NFT minting logic would go here
  };

  const handlePreviewAgent = (agent) => {
    console.log('Previewing agent:', agent.name);
    // Preview logic would go here
  };

  const AgentCard = ({ agent }) => (
    <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{agent.icon}</div>
            <div>
              <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors">
                {agent.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  {agent.category}
                </Badge>
                {agent.is_featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-slate-300 line-clamp-2">
          {agent.description}
        </CardDescription>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{agent.rating_average}</span>
            <span>({agent.rating_count})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{agent.deployment_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map(capability => (
            <Badge key={capability} variant="outline" className="text-xs border-slate-600 text-slate-400">
              {capability.replace('_', ' ')}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
              +{agent.capabilities.length - 3} more
            </Badge>
          )}
        </div>

        {/* NFT Info */}
        <div className="bg-slate-900 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
              <Gem className="h-4 w-4" />
              NFT Collection
            </span>
            <span className="text-xs text-slate-400">
              {agent.total_minted}/{agent.max_supply} minted
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
              style={{ width: `${(agent.total_minted / agent.max_supply) * 100}%` }}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">
              ${agent.base_price}
              <span className="text-sm text-slate-400 font-normal">/month</span>
            </div>
            <div className="text-xs text-slate-400">
              Setup: ${agent.setup_fee}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePreviewAgent(agent)}
              className="border-slate-600 text-slate-400 hover:bg-slate-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => handleDeployAgent(agent)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Download className="h-4 w-4 mr-1" />
              Deploy
            </Button>
          </div>
        </div>

        {/* NFT Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-700">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleMintNFT(agent)}
            className="flex-1 border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
          >
            <Coins className="h-4 w-4 mr-1" />
            Mint NFT
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-700">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Agent Marketplace
              </h1>
              <p className="text-slate-400 text-lg">Discover, deploy, and own AI agents as NFTs</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-sm text-slate-400">Active Agents</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">3.2K</div>
                    <div className="text-sm text-slate-400">Total Deployments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Gem className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">1.8K</div>
                    <div className="text-sm text-slate-400">NFTs Minted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">4.8</div>
                    <div className="text-sm text-slate-400">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search agents, capabilities, or integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-2">No agents found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              variant="outline"
              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentMarketplace;

