import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Zap, 
  Star, 
  Users, 
  TrendingUp, 
  Filter,
  Search,
  Clock,
  Shield,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Featured marketplace agents ready for one-click deployment
const MARKETPLACE_AGENTS = [
  {
    id: 'cashflow-pro',
    name: 'CA$HFLOW Pro',
    description: 'Advanced sales agent with CRM integration and lead scoring',
    category: 'Sales',
    price: 199,
    monthlyFee: 49,
    creator: 'Harmonix Team',
    rating: 4.9,
    users: 2847,
    revenue: '$1.2M+',
    difficulty: 'Easy',
    deployTime: '5 min',
    verified: true,
    featured: true
  },
  {
    id: 'content-creator',
    name: 'Content Genesis',
    description: 'AI content creation engine for blogs, social media, and marketing',
    category: 'Marketing',
    price: 149,
    monthlyFee: 39,
    creator: 'CreativeAI Labs',
    rating: 4.8,
    users: 1923,
    revenue: '$890K+',
    difficulty: 'Easy',
    deployTime: '3 min',
    verified: true,
    featured: false
  },
  {
    id: 'support-assistant',
    name: 'SupportBot Elite',
    description: 'Intelligent customer support with natural language processing',
    category: 'Support',
    price: 179,
    monthlyFee: 44,
    creator: 'ServiceTech',
    rating: 4.7,
    users: 3421,
    revenue: '$1.8M+',
    difficulty: 'Medium',
    deployTime: '8 min',
    verified: true,
    featured: true
  },
  {
    id: 'data-analyst',
    name: 'DataVision Pro',
    description: 'Advanced analytics and business intelligence agent',
    category: 'Analytics',
    price: 299,
    monthlyFee: 79,
    creator: 'AnalyticsPro',
    rating: 4.9,
    users: 1245,
    revenue: '$650K+',
    difficulty: 'Advanced',
    deployTime: '15 min',
    verified: true,
    featured: false
  },
  {
    id: 'hr-manager',
    name: 'PeopleFlow AI',
    description: 'HR automation for recruiting, onboarding, and employee management',
    category: 'HR',
    price: 229,
    monthlyFee: 59,
    creator: 'HRTech Solutions',
    rating: 4.6,
    users: 1876,
    revenue: '$420K+',
    difficulty: 'Medium',
    deployTime: '10 min',
    verified: true,
    featured: false
  },
  {
    id: 'finance-assistant',
    name: 'FinanceBot Pro',
    description: 'Automated bookkeeping, invoicing, and financial reporting',
    category: 'Finance',
    price: 249,
    monthlyFee: 64,
    creator: 'FinTech Innovations',
    rating: 4.8,
    users: 987,
    revenue: '$310K+',
    difficulty: 'Medium',
    deployTime: '12 min',
    verified: true,
    featured: true
  }
];

const CATEGORIES = ['All', 'Sales', 'Marketing', 'Support', 'Analytics', 'HR', 'Finance'];

interface OneClickMarketplaceProps {
  showHeader?: boolean;
  maxItems?: number;
}

export function OneClickMarketplace({ showHeader = true, maxItems }: OneClickMarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  
  const filteredAgents = MARKETPLACE_AGENTS
    .filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating;
        case 'rating':
          return b.rating - a.rating;
        case 'users':
          return b.users - a.users;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    })
    .slice(0, maxItems);

  return (
    <div className="space-y-4 md:space-y-6">
      {showHeader && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-responsive-2xl font-bold text-harmonix-regal-gold mb-2">
              One-Click Agent Marketplace
            </h2>
            <p className="text-responsive-base text-harmonix-sage-fade/70">
              Deploy powerful AI agents instantly to your organization
            </p>
          </div>
          
          <Badge variant="secondary" className="w-fit">
            {filteredAgents.length} agents available
          </Badge>
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-harmonix-sage-fade/50" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="users">Most Users</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredAgents.map((agent) => (
          <Card 
            key={agent.id} 
            className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 hover:border-harmonix-regal-gold/30 transition-colors group mx-auto w-full max-w-[320px] md:max-w-none"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg text-harmonix-regal-gold">
                      {agent.name}
                    </CardTitle>
                    {agent.verified && (
                      <Shield className="h-4 w-4 text-harmonix-regal-gold" />
                    )}
                    {agent.featured && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <Badge className="bg-harmonix-cedar-green/20 text-harmonix-sage-fade">
                    {agent.category}
                  </Badge>
                </div>
              </div>
              
              <CardDescription className="text-harmonix-sage-fade/70 text-sm">
                {agent.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-harmonix-sage-fade">
                      {agent.rating}
                    </span>
                  </div>
                  <p className="text-xs text-harmonix-sage-fade/70">Rating</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-3 w-3 text-harmonix-sage-fade/70" />
                    <span className="text-sm font-medium text-harmonix-sage-fade">
                      {agent.users.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-harmonix-sage-fade/70">Users</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-medium text-green-500">
                      {agent.revenue}
                    </span>
                  </div>
                  <p className="text-xs text-harmonix-sage-fade/70">Revenue</p>
                </div>
              </div>
              
              {/* Deployment Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-harmonix-sage-fade/70" />
                  <span className="text-harmonix-sage-fade/70">{agent.deployTime}</span>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    agent.difficulty === 'Easy' ? 'text-green-500 border-green-500/20' :
                    agent.difficulty === 'Medium' ? 'text-yellow-500 border-yellow-500/20' :
                    'text-orange-500 border-orange-500/20'
                  }`}
                >
                  {agent.difficulty}
                </Badge>
              </div>
              
              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-harmonix-sage-fade/70">Setup:</span>
                  <span className="font-semibold text-harmonix-sage-fade">${agent.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-harmonix-sage-fade/70">Monthly:</span>
                  <span className="font-semibold text-harmonix-sage-fade">${agent.monthlyFee}</span>
                </div>
              </div>
              
              {/* Deploy Button */}
              <Link href={`/marketplace/deploy/${agent.id}`}>
                <Button 
                  className="w-full bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90 group-hover:shadow-lg transition-all"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy Now
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-harmonix-sage-fade/50">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <Filter className="h-12 w-12 mx-auto text-harmonix-sage-fade/50" />
          </div>
          <h3 className="text-lg font-medium text-harmonix-sage-fade mb-2">
            No agents found
          </h3>
          <p className="text-harmonix-sage-fade/70">
            Try adjusting your search or filters
          </p>
        </div>
      )}
      
      {showHeader && maxItems && filteredAgents.length === maxItems && (
        <div className="text-center pt-6">
          <Link href="/marketplace">
            <Button variant="outline" className="text-harmonix-sage-fade">
              View All Agents
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}