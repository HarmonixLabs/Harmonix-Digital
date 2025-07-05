import { useState } from 'react';
import { Link } from 'wouter';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users, 
  Plus,
  CreditCard,
  Wallet,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { WalletConnector } from '@/components/wallet-connector';

// Membership tiers for creators
const MEMBERSHIP_TIERS = [
  {
    id: 'starter',
    name: 'Starter Creator',
    agentLimit: 1,
    basePrice: 30,
    description: 'Perfect for testing the waters',
    features: [
      '1 Agent deployment',
      'Basic analytics',
      '70% revenue share',
      'Community support'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Creator',
    agentLimit: 5,
    basePrice: 99,
    description: 'For serious creators',
    features: [
      'Up to 5 Agents',
      'Advanced analytics',
      '75% revenue share',
      'Priority support',
      'Custom branding'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    agentLimit: 20,
    basePrice: 299,
    description: 'Full creator suite',
    features: [
      'Up to 20 Agents',
      'Real-time analytics',
      '80% revenue share',
      'Dedicated support',
      'White-label options',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Creator',
    agentLimit: -1, // Unlimited
    basePrice: 999,
    description: 'Unlimited potential',
    features: [
      'Unlimited Agents',
      'Custom analytics',
      '85% revenue share',
      'Enterprise support',
      'Full customization',
      'Priority deployment'
    ]
  }
];

export default function CreatorDashboard() {
  const { toast } = useToast();
  const [walletOpen, setWalletOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState('starter');
  
  // Mock data for demonstration
  const creatorStats = {
    totalAgents: 3,
    activeAgents: 2,
    monthlyRevenue: 4567,
    totalUsers: 234,
    pendingPayout: 3197,
    lastPayout: '2025-06-28',
    membershipFee: currentTier === 'starter' ? 30 : currentTier === 'growth' ? 99 : currentTier === 'pro' ? 299 : 999
  };
  
  const myAgents = [
    {
      id: '1',
      name: 'Echo AI Writer',
      status: 'active',
      users: 89,
      revenue: 2670,
      usage: 'High',
      deploymentFee: 150
    },
    {
      id: '2', 
      name: 'Data Analyzer Pro',
      status: 'active',
      users: 145,
      revenue: 1897,
      usage: 'Medium',
      deploymentFee: 200
    },
    {
      id: '3',
      name: 'Support Assistant',
      status: 'pending',
      users: 0,
      revenue: 0,
      usage: 'None',
      deploymentFee: 100
    }
  ];
  
  const handleUpgradeTier = (tierId: string) => {
    toast({
      title: "Upgrading Membership",
      description: "Redirecting to payment...",
    });
    // Would integrate with Stripe here
    setTimeout(() => {
      setCurrentTier(tierId);
      toast({
        title: "Membership Upgraded!",
        description: "Your new tier is now active",
      });
    }, 2000);
  };
  
  const handleRequestPayout = () => {
    if (!connectedWallet) {
      setWalletOpen(true);
      return;
    }
    
    toast({
      title: "Payout Requested",
      description: `$${creatorStats.pendingPayout.toLocaleString()} will be sent to your wallet`,
    });
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      {/* Header */}
      <div className="bg-harmonix-night-pine border-b border-harmonix-sage-fade/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-harmonix-regal-gold">Creator Dashboard</h1>
              <p className="text-harmonix-sage-fade mt-1">Manage your agents and earnings</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setWalletOpen(true)}
                className="text-harmonix-sage-fade"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {connectedWallet ? `${connectedWallet}` : 'Connect Wallet'}
              </Button>
              <Link href="/agent-builder">
                <Button className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Agent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-harmonix-sage-fade">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-harmonix-regal-gold">
                ${creatorStats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+23%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-harmonix-sage-fade">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-harmonix-sage-fade">
                {creatorStats.activeAgents}/{creatorStats.totalAgents}
              </div>
              <Progress value={66} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-harmonix-sage-fade">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-harmonix-sage-fade">
                {creatorStats.totalUsers}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-harmonix-sage-fade/70" />
                <span className="text-xs text-harmonix-sage-fade/70">Active users</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-harmonix-sage-fade">Pending Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                ${creatorStats.pendingPayout.toLocaleString()}
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="mt-1 h-6 text-xs"
                onClick={handleRequestPayout}
              >
                Request Payout
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-harmonix-sage-fade">Membership Fee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                ${creatorStats.membershipFee}/mo
              </div>
              <Badge variant="secondary" className="mt-1">
                {MEMBERSHIP_TIERS.find(t => t.id === currentTier)?.name}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-harmonix-sage-fade">Your Deployed Agents</h2>
              <Badge variant="outline" className="text-harmonix-sage-fade">
                {creatorStats.activeAgents} Active • {creatorStats.totalAgents - creatorStats.activeAgents} Pending
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {myAgents.map((agent) => (
                <Card key={agent.id} className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-harmonix-sage-fade">
                            {agent.name}
                          </h3>
                          <Badge 
                            variant={agent.status === 'active' ? 'default' : 'secondary'}
                            className={agent.status === 'active' ? 'bg-green-500/20 text-green-500' : ''}
                          >
                            {agent.status === 'active' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-harmonix-sage-fade/70">Users</p>
                            <p className="text-lg font-semibold text-harmonix-sage-fade">{agent.users}</p>
                          </div>
                          <div>
                            <p className="text-sm text-harmonix-sage-fade/70">Revenue</p>
                            <p className="text-lg font-semibold text-green-500">${agent.revenue}</p>
                          </div>
                          <div>
                            <p className="text-sm text-harmonix-sage-fade/70">Usage</p>
                            <p className="text-lg font-semibold text-harmonix-sage-fade">{agent.usage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-harmonix-sage-fade/70">Deploy Fee</p>
                            <p className="text-lg font-semibold text-orange-500">${agent.deploymentFee}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
              <CardHeader>
                <CardTitle className="text-harmonix-regal-gold">Revenue Breakdown</CardTitle>
                <CardDescription className="text-harmonix-sage-fade/70">
                  Your earnings after platform fees (70% creator share)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-harmonix-sage-fade/20">
                    <span className="text-harmonix-sage-fade">Gross Revenue</span>
                    <span className="text-lg font-semibold text-harmonix-sage-fade">
                      ${(creatorStats.monthlyRevenue / 0.7).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-harmonix-sage-fade/20">
                    <span className="text-harmonix-sage-fade">Platform Fee (30%)</span>
                    <span className="text-lg font-semibold text-red-400">
                      -${(creatorStats.monthlyRevenue * 0.3 / 0.7).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-harmonix-sage-fade/20">
                    <span className="text-harmonix-sage-fade">Membership Fee</span>
                    <span className="text-lg font-semibold text-orange-500">
                      -${creatorStats.membershipFee}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-harmonix-sage-fade font-semibold">Net Earnings</span>
                    <span className="text-xl font-bold text-green-500">
                      ${(creatorStats.monthlyRevenue - creatorStats.membershipFee).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membership" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {MEMBERSHIP_TIERS.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 ${
                    currentTier === tier.id ? 'ring-2 ring-harmonix-regal-gold' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-harmonix-regal-gold">{tier.name}</CardTitle>
                    <CardDescription className="text-harmonix-sage-fade/70">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-harmonix-sage-fade">
                        ${tier.basePrice}
                      </span>
                      <span className="text-harmonix-sage-fade/70">/month</span>
                    </div>
                    
                    <div className="mb-4">
                      {tier.agentLimit === -1 ? (
                        <Badge variant="secondary">Unlimited Agents</Badge>
                      ) : (
                        <Badge variant="secondary">{tier.agentLimit} Agent{tier.agentLimit > 1 ? 's' : ''}</Badge>
                      )}
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-harmonix-sage-fade">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {currentTier === tier.id ? (
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleUpgradeTier(tier.id)}
                        className="w-full bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
                      >
                        {MEMBERSHIP_TIERS.findIndex(t => t.id === tier.id) > 
                         MEMBERSHIP_TIERS.findIndex(t => t.id === currentTier) 
                          ? 'Upgrade' 
                          : 'Downgrade'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-500">Usage-Based Build Out Fees</p>
                  <p className="text-sm text-harmonix-sage-fade/70 mt-1">
                    In addition to your membership, you'll be charged deployment fees when creating new agents:
                    $100-500 per agent based on complexity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4">
            <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
              <CardHeader>
                <CardTitle className="text-harmonix-regal-gold">Payout Settings</CardTitle>
                <CardDescription className="text-harmonix-sage-fade/70">
                  Choose how you want to receive your earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-harmonix-deep-forest/50 rounded-lg border border-harmonix-sage-fade/20">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-harmonix-sage-fade" />
                      <div>
                        <p className="font-medium text-harmonix-sage-fade">Bank Transfer (ACH)</p>
                        <p className="text-sm text-harmonix-sage-fade/70">2-3 business days</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-harmonix-deep-forest/50 rounded-lg border border-harmonix-sage-fade/20">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-harmonix-sage-fade" />
                      <div>
                        <p className="font-medium text-harmonix-sage-fade">Crypto Wallet (USDT)</p>
                        <p className="text-sm text-harmonix-sage-fade/70">Instant settlement</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-harmonix-deep-forest/50 rounded-lg border border-harmonix-sage-fade/20">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-harmonix-sage-fade" />
                      <div>
                        <p className="font-medium text-harmonix-sage-fade">Stripe Express</p>
                        <p className="text-sm text-harmonix-sage-fade/70">Next business day</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-harmonix-sage-fade/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-harmonix-sage-fade">Payout Schedule</span>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
                    onClick={handleRequestPayout}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Request Payout (${creatorStats.pendingPayout})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <WalletConnector 
        open={walletOpen}
        onOpenChange={setWalletOpen}
        onConnect={setConnectedWallet}
      />
    </div>
  );
}