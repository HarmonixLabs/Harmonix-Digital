import { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, Star, Zap, Clock, TrendingUp, ExternalLink, 
  Wallet, ShoppingCart, Info, CheckCircle2, AlertCircle,
  Copy, Share2, Download, Lock, Unlock, Award,
  Code2, GitBranch, Database, Globe
} from 'lucide-react';
import { agentProfiles } from '@/data/agentData';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Mock blockchain data
const mockBlockchainData = {
  contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f62a5E',
  tokenStandard: 'ERC-721',
  network: 'Ethereum Mainnet',
  blockExplorerUrl: 'https://etherscan.io/token/',
  gasEstimate: '0.02 ETH',
  transactionHistory: [
    { date: '2024-12-20', action: 'Minted', by: 'Harmonix Labs', txHash: '0x123...' },
    { date: '2024-12-22', action: 'Listed', by: 'Harmonix Labs', txHash: '0x456...' },
  ],
};

export default function AgentDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'connect' | 'confirm' | 'processing' | 'complete'>('connect');
  const [walletConnected, setWalletConnected] = useState(false);

  // Find agent by ID
  const agent = agentProfiles.find(a => a.id === parseInt(id || '0'));
  
  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-harmonix-sage-fade mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Agent Not Found</h2>
            <p className="text-harmonix-sage-fade mb-4">The requested agent could not be found.</p>
            <Button onClick={() => setLocation('/marketplace')}>
              Back to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePurchase = () => {
    setShowPurchaseModal(true);
    setPurchaseStep('connect');
  };

  const handleWalletConnect = async () => {
    // Simulate wallet connection
    setWalletConnected(true);
    setPurchaseStep('confirm');
  };

  const handleConfirmPurchase = async () => {
    setPurchaseStep('processing');
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setPurchaseStep('complete');
      toast({
        title: 'Purchase Successful!',
        description: `You now own ${agent.name} NFT #${1000 + agent.id}`,
      });
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Contract address copied successfully',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Back Navigation */}
      <Button variant="ghost" onClick={() => setLocation('/marketplace')} className="mb-4">
        ← Back to Marketplace
      </Button>

      {/* Agent Header */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* NFT Preview */}
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <div className="relative h-96 bg-gradient-to-br from-harmonix-deep-forest to-harmonix-cedar-mist rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">
                {['💰', '🎧', '👁️', '🌟', '☀️', '🗂️', '🎵', '🌀', '🌟', '🦉', '🔥', '🧠'][agent.id - 1] || '🤖'}
              </span>
            </div>
            <div className="absolute top-4 left-4">
              <Badge className={`${agent.nftLicensing.rarity === 'legendary' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}>
                {agent.nftLicensing.rarity}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                #{1000 + agent.id}
              </Badge>
            </div>
            <div className="absolute bottom-4 right-4">
              <Shield className="h-6 w-6 text-harmonix-regal-gold" />
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-harmonix-regal-gold">{agent.name}</h2>
                <p className="text-harmonix-sage-fade">{agent.codename}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-harmonix-sage-fade">Monthly Price</p>
                <p className="text-2xl font-bold text-white">${agent.monthlyPrice.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
                onClick={handlePurchase}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase NFT
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Agent Info */}
        <div className="space-y-6">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Agent Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Bio</h4>
                <p className="text-harmonix-sage-fade">{agent.bio}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Lore</h4>
                <p className="text-harmonix-sage-fade">{agent.lore}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Personality</h4>
                <p className="text-harmonix-sage-fade">{agent.personality.tone}</p>
                <p className="text-sm text-harmonix-sage-fade/70 mt-1">NLP Style: {agent.personality.nlpStyle}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-harmonix-sage-fade">Success Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={95} className="w-24" />
                  <span className="text-white">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-harmonix-sage-fade">Avg Response Time</span>
                <span className="text-white">245ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-harmonix-sage-fade">Total Deployments</span>
                <span className="text-white">1,287</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-harmonix-sage-fade">User Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white">4.8</span>
                  <span className="text-harmonix-sage-fade">(342 reviews)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-harmonix-deep-forest/50">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Modes</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Core Functions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agent.coreFunction.map((func, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                    <p className="text-white">{func}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-6 bg-harmonix-sage-fade/20" />

              <div>
                <h4 className="font-semibold text-white mb-4">Triggers</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h5 className="text-sm font-medium text-harmonix-sage-fade mb-2">Internal Triggers</h5>
                    <div className="space-y-2">
                      {agent.triggers.internal.map((trigger, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-harmonix-sage-fade" />
                          <span className="text-white">{trigger}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-harmonix-sage-fade mb-2">External Triggers</h5>
                    <div className="space-y-2">
                      {agent.triggers.external.map((trigger, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-harmonix-sage-fade" />
                          <span className="text-white">{trigger}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tech Stack Tab */}
        <TabsContent value="tech">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Primary Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.techStack.primary.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-harmonix-deep-forest/50">
                      <Code2 className="h-3 w-3 mr-1" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Integrations</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.techStack.integrations.map((integration, index) => (
                    <Badge key={index} variant="outline" className="bg-harmonix-deep-forest/50">
                      <Globe className="h-3 w-3 mr-1" />
                      {integration}
                    </Badge>
                  ))}
                </div>
              </div>

              {agent.techStack.optional && (
                <div>
                  <h4 className="font-semibold text-white mb-3">Optional Components</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.techStack.optional.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-harmonix-deep-forest/50 opacity-70">
                        <Database className="h-3 w-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {agent.dependencies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-3">Dependencies</h4>
                  <div className="space-y-2">
                    {agent.dependencies.map((dep, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <GitBranch className="h-4 w-4 text-harmonix-sage-fade" />
                        <span className="text-white">{dep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Modes Tab */}
        <TabsContent value="advanced">
          <div className="space-y-4">
            {agent.advancedModes.map((mode, index) => (
              <Card key={index} className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-harmonix-regal-gold">{mode.name}</CardTitle>
                    <Badge className="bg-purple-600">Advanced</Badge>
                  </div>
                  <CardDescription className="text-harmonix-sage-fade">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mode.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                        <p className="text-white">{feature}</p>
                      </div>
                    ))}
                    {mode.capacity && (
                      <div className="mt-4 p-3 bg-harmonix-deep-forest/50 rounded-lg">
                        <p className="text-sm text-harmonix-sage-fade">
                          <strong className="text-white">Capacity:</strong> {mode.capacity}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Blockchain Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-harmonix-sage-fade">Contract Address</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-white bg-harmonix-deep-forest/50 px-2 py-1 rounded">
                      {mockBlockchainData.contractAddress.slice(0, 10)}...{mockBlockchainData.contractAddress.slice(-8)}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(mockBlockchainData.contractAddress)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-harmonix-sage-fade">Token Standard</span>
                  <span className="text-white">{mockBlockchainData.tokenStandard}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-harmonix-sage-fade">Network</span>
                  <span className="text-white">{mockBlockchainData.network}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-harmonix-sage-fade">Gas Estimate</span>
                  <span className="text-white">{mockBlockchainData.gasEstimate}</span>
                </div>
              </div>

              <Separator className="bg-harmonix-sage-fade/20" />

              <div>
                <h4 className="font-semibold text-white mb-4">NFT Metadata</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-harmonix-sage-fade">Token Type</span>
                    <span className="text-white">{agent.nftLicensing.token_type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-harmonix-sage-fade">Tier</span>
                    <Badge>{agent.nftLicensing.tier}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-harmonix-sage-fade">Rarity</span>
                    <Badge className={agent.nftLicensing.rarity === 'legendary' ? 'bg-orange-600' : 'bg-blue-600'}>
                      {agent.nftLicensing.rarity}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="bg-harmonix-sage-fade/20" />

              <div>
                <h4 className="font-semibold text-white mb-4">Transaction History</h4>
                <div className="space-y-3">
                  {mockBlockchainData.transactionHistory.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-harmonix-sage-fade">{tx.date}</span>
                        <span className="text-white">{tx.action}</span>
                        <span className="text-harmonix-sage-fade">by {tx.by}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Pricing Options</CardTitle>
              <CardDescription className="text-harmonix-sage-fade">
                Choose the best pricing model for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 bg-harmonix-deep-forest/50 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Monthly Subscription</h4>
                  <p className="text-3xl font-bold text-harmonix-regal-gold mb-4">
                    ${agent.monthlyPrice.toLocaleString()}/mo
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Full agent access
                    </li>
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      All advanced modes
                    </li>
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Cancel anytime
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-harmonix-deep-forest/50 rounded-lg border-2 border-harmonix-regal-gold">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">One-Time Purchase</h4>
                    <Badge className="bg-harmonix-regal-gold text-harmonix-deep-forest">NFT</Badge>
                  </div>
                  <p className="text-3xl font-bold text-harmonix-regal-gold mb-4">
                    ${agent.oneTimePrice.toLocaleString()}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Lifetime ownership
                    </li>
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Tradeable NFT
                    </li>
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Royalty earnings
                    </li>
                    <li className="flex items-center gap-2 text-harmonix-sage-fade">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Exclusive benefits
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-6 bg-harmonix-sage-fade/20" />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="text-sm font-medium text-harmonix-sage-fade mb-2">Setup Fee</h5>
                  <p className="text-xl font-semibold text-white">
                    ${agent.setupPrice.toLocaleString()} <span className="text-sm text-harmonix-sage-fade font-normal">(one-time)</span>
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-harmonix-sage-fade mb-2">Maintenance</h5>
                  <p className="text-xl font-semibold text-white">
                    ${agent.maintenancePrice.toLocaleString()}/mo <span className="text-sm text-harmonix-sage-fade font-normal">(optional)</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="bg-harmonix-night-pine border-harmonix-sage-fade/20">
          <DialogHeader>
            <DialogTitle className="text-harmonix-regal-gold">
              Purchase {agent.name} NFT
            </DialogTitle>
            <DialogDescription className="text-harmonix-sage-fade">
              Complete your purchase to own this agent NFT
            </DialogDescription>
          </DialogHeader>

          {purchaseStep === 'connect' && (
            <div className="space-y-4">
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertDescription>
                  Connect your wallet to continue with the purchase
                </AlertDescription>
              </Alert>
              <Button 
                className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
                onClick={handleWalletConnect}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}

          {purchaseStep === 'confirm' && (
            <div className="space-y-4">
              <div className="p-4 bg-harmonix-deep-forest/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-harmonix-sage-fade">Agent</span>
                  <span className="text-white">{agent.name} #{1000 + agent.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-harmonix-sage-fade">Price</span>
                  <span className="text-white">${agent.oneTimePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-harmonix-sage-fade">Gas Fee</span>
                  <span className="text-white">{mockBlockchainData.gasEstimate}</span>
                </div>
                <Separator className="bg-harmonix-sage-fade/20" />
                <div className="flex justify-between font-semibold">
                  <span className="text-harmonix-sage-fade">Total</span>
                  <span className="text-harmonix-regal-gold">
                    ${agent.oneTimePrice.toLocaleString()} + Gas
                  </span>
                </div>
              </div>
              <Button 
                className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </Button>
            </div>
          )}

          {purchaseStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonix-regal-gold mx-auto mb-4" />
              <p className="text-white">Processing transaction...</p>
              <p className="text-sm text-harmonix-sage-fade mt-2">Please confirm in your wallet</p>
            </div>
          )}

          {purchaseStep === 'complete' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Purchase Complete!</h3>
              <p className="text-harmonix-sage-fade mb-4">
                You now own {agent.name} NFT #{1000 + agent.id}
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                  Close
                </Button>
                <Button 
                  className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
                  onClick={() => setLocation('/my-agents')}
                >
                  View My Agents
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}