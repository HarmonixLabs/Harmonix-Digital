import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Search, Filter, TrendingUp, Star, Shield, 
  Wallet, ShoppingCart, Info, ExternalLink,
  CheckCircle2, Clock, Zap, Award
} from 'lucide-react';
import { agentProfiles } from '@/data/agentData';

// Mock NFT data
const nftRarities = {
  common: { color: 'bg-gray-600', label: 'Common' },
  rare: { color: 'bg-blue-600', label: 'Rare' },
  epic: { color: 'bg-purple-600', label: 'Epic' },
  legendary: { color: 'bg-orange-600', label: 'Legendary' },
};

// Enhanced agent data with NFT properties
const enhancedAgents = agentProfiles.map((agent, index) => ({
  ...agent,
  icon: ['💰', '🎧', '👁️', '🌟', '☀️', '🗂️', '🎵', '🌀', '🌟', '🦉', '🔥', '🧠'][index] || '🤖',
  type: agent.role.toLowerCase().includes('sales') ? 'sales' : 
        agent.role.toLowerCase().includes('support') ? 'support' :
        agent.role.toLowerCase().includes('analytics') ? 'analytics' : 'automation',
  description: agent.bio,
  price: agent.monthlyPrice,
  nftId: `#${1000 + index}`,
  rarity: ['common', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 4)] as keyof typeof nftRarities,
  author: ['Harmonix Labs', 'Community', 'Partner'][Math.floor(Math.random() * 3)],
  rating: 4.5 + Math.random() * 0.5,
  reviews: Math.floor(Math.random() * 100) + 10,
  deployments: Math.floor(Math.random() * 1000) + 100,
  blockchain: 'Ethereum',
  royalty: 2.5,
  verified: Math.random() > 0.3,
}));

export default function EnhancedMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const filteredAgents = enhancedAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.type === selectedCategory;
    const matchesPrice = agent.price >= priceRange[0] && agent.price <= priceRange[1];
    const matchesRarity = selectedRarity === 'all' || agent.rarity === selectedRarity;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRarity;
  });

  const handleWalletConnect = () => {
    // Simulate wallet connection
    setWalletConnected(true);
  };

  const handleBuyAgent = (agent: any) => {
    if (!walletConnected) {
      handleWalletConnect();
      return;
    }
    setSelectedAgent(agent);
    // Initiate purchase flow
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-harmonix-regal-gold">
            Agent Marketplace
          </h1>
          <p className="text-harmonix-sage-fade mt-1">
            Browse, buy, and deploy AI agents with blockchain verification
          </p>
        </div>
        <div className="flex gap-2">
          {walletConnected ? (
            <Button variant="outline" size="sm">
              <Wallet className="h-4 w-4 mr-2" />
              0x742d...5aE8
            </Button>
          ) : (
            <Button size="sm" onClick={handleWalletConnect}>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          <Button size="sm" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart (0)
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-harmonix-sage-fade" />
                <Input
                  placeholder="Search agents by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Customer Support</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
              </SelectContent>
            </Select>

            {/* Rarity Filter */}
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-harmonix-sage-fade">Price Range</Label>
              <span className="text-sm text-white">
                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={50000}
              step={1000}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketplace Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Total Agents
            </CardTitle>
            <Award className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{enhancedAgents.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Total Deployments
            </CardTitle>
            <Zap className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,487</div>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Active Creators
            </CardTitle>
            <Star className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">348</div>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              24h Volume
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$84.5K</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="featured" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-harmonix-deep-forest/50">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => {
              const rarity = nftRarities[agent.rarity];
              return (
                <Card 
                  key={agent.id}
                  className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 hover:border-harmonix-regal-gold/50 transition-all group cursor-pointer"
                  onClick={() => setSelectedAgent(agent)}
                >
                  {/* NFT Header */}
                  <div className="relative h-48 bg-gradient-to-br from-harmonix-deep-forest to-harmonix-cedar-mist rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform">
                        {agent.icon}
                      </span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={`${rarity.color} text-white`}>
                        {rarity.label}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                        {agent.nftId}
                      </Badge>
                    </div>
                    {agent.verified && (
                      <div className="absolute bottom-2 right-2">
                        <Shield className="h-5 w-5 text-harmonix-regal-gold" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-harmonix-regal-gold">
                          {agent.name}
                        </CardTitle>
                        <CardDescription className="text-harmonix-sage-fade">
                          by {agent.author}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-harmonix-sage-fade line-clamp-2">
                      {agent.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-white">{agent.rating.toFixed(1)}</span>
                        <span className="text-harmonix-sage-fade">({agent.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-harmonix-sage-fade">
                        <Zap className="h-4 w-4" />
                        <span>{agent.deployments} deployments</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-harmonix-sage-fade/20">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          ${agent.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-harmonix-sage-fade">
                          {agent.royalty}% royalty
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyAgent(agent);
                        }}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Other tabs would have similar content */}
        <TabsContent value="popular">
          <div className="text-center py-12 text-harmonix-sage-fade">
            Popular agents coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}