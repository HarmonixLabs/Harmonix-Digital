import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { 
  Zap, 
  Shield, 
  Star, 
  Users, 
  TrendingUp, 
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  Wallet,
  CreditCard,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DeploymentPipeline } from '@/components/deployment-pipeline';
import { CryptoPayment } from '@/components/crypto-payment';

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
    thumbnail: '/api/placeholder/400/240',
    features: [
      'Advanced lead scoring',
      'CRM automation',
      'Email sequences',
      'Call scheduling',
      'ROI tracking'
    ],
    deployment: {
      difficulty: 'Easy',
      time: '5 minutes',
      requirements: ['CRM access', 'Email provider']
    }
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
    thumbnail: '/api/placeholder/400/240',
    features: [
      'Multi-platform content',
      'SEO optimization',
      'Brand voice adaptation',
      'Content calendar',
      'Performance analytics'
    ],
    deployment: {
      difficulty: 'Easy',
      time: '3 minutes',
      requirements: ['Social media accounts', 'Brand guidelines']
    }
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
    thumbnail: '/api/placeholder/400/240',
    features: [
      'Multi-language support',
      'Ticket routing',
      'Knowledge base integration',
      'Sentiment analysis',
      'Live chat handoff'
    ],
    deployment: {
      difficulty: 'Medium',
      time: '8 minutes',
      requirements: ['Help desk integration', 'Knowledge base']
    }
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
    thumbnail: '/api/placeholder/400/240',
    features: [
      'Real-time dashboards',
      'Predictive analytics',
      'Custom reports',
      'Data visualization',
      'API integrations'
    ],
    deployment: {
      difficulty: 'Advanced',
      time: '15 minutes',
      requirements: ['Database access', 'BI tools']
    }
  }
];

export default function MarketplaceDeploy() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/marketplace/deploy/:agentId');
  const { toast } = useToast();
  
  const [selectedAgent, setSelectedAgent] = useState<typeof MARKETPLACE_AGENTS[0] | null>(null);
  const [deploymentStep, setDeploymentStep] = useState('overview'); // overview, payment, deploying, success
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  
  const agentId = params?.agentId;
  const agent = MARKETPLACE_AGENTS.find(a => a.id === agentId);
  
  useEffect(() => {
    if (agentId && agent) {
      setSelectedAgent(agent);
    }
  }, [agentId, agent]);
  
  const handleOneClickDeploy = () => {
    if (!selectedAgent) return;
    
    setDeploymentStep('payment');
    toast({
      title: "Starting Deployment",
      description: `Preparing to deploy ${selectedAgent.name}`,
    });
  };
  
  const handlePaymentComplete = () => {
    setDeploymentStep('deploying');
  };
  
  const handleDeploymentComplete = (result: any) => {
    setDeploymentStep('success');
    toast({
      title: "Agent Deployed Successfully!",
      description: `${selectedAgent?.name} is now active in your dashboard`,
    });
  };
  
  const handleBackToMarketplace = () => {
    setLocation('/marketplace');
  };
  
  if (!match || !selectedAgent) {
    return (
      <div className="min-h-screen bg-harmonix-deep-forest flex items-center justify-center">
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-harmonix-sage-fade mb-4">
              Agent Not Found
            </h2>
            <p className="text-harmonix-sage-fade/70 mb-6">
              The requested agent could not be found in the marketplace.
            </p>
            <Button onClick={handleBackToMarketplace}>
              Back to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      {/* Header */}
      <div className="bg-harmonix-night-pine border-b border-harmonix-sage-fade/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToMarketplace}
                className="text-harmonix-sage-fade"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
              <div className="h-6 w-px bg-harmonix-sage-fade/20" />
              <div>
                <h1 className="text-2xl font-bold text-harmonix-regal-gold">
                  Deploy: {selectedAgent.name}
                </h1>
                <p className="text-harmonix-sage-fade/70">One-click agent deployment</p>
              </div>
            </div>
            
            <Badge variant="secondary" className="px-3 py-1">
              {deploymentStep === 'overview' ? 'Ready to Deploy' :
               deploymentStep === 'payment' ? 'Payment Required' :
               deploymentStep === 'deploying' ? 'Deploying...' : 'Deployed'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {deploymentStep === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Agent Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-harmonix-regal-gold">
                        {selectedAgent.name}
                      </CardTitle>
                      <CardDescription className="text-harmonix-sage-fade/70 mt-2">
                        {selectedAgent.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-harmonix-cedar-green/20 text-harmonix-sage-fade">
                      {selectedAgent.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-semibold text-harmonix-sage-fade">
                          {selectedAgent.rating}
                        </span>
                      </div>
                      <p className="text-sm text-harmonix-sage-fade/70">Rating</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="h-4 w-4 text-harmonix-sage-fade" />
                        <span className="text-lg font-semibold text-harmonix-sage-fade">
                          {selectedAgent.users.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-harmonix-sage-fade/70">Active Users</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-lg font-semibold text-green-500">
                          {selectedAgent.revenue}
                        </span>
                      </div>
                      <p className="text-sm text-harmonix-sage-fade/70">Revenue Generated</p>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="features" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="deployment">Deployment</TabsTrigger>
                      <TabsTrigger value="creator">Creator</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="features" className="mt-4">
                      <div className="space-y-3">
                        {selectedAgent.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-harmonix-sage-fade">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="deployment" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-harmonix-sage-fade mb-1">
                              Difficulty Level
                            </p>
                            <Badge variant={selectedAgent.deployment.difficulty === 'Easy' ? 'default' : 'secondary'}>
                              {selectedAgent.deployment.difficulty}
                            </Badge>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-harmonix-sage-fade mb-1">
                              Deployment Time
                            </p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-harmonix-sage-fade/70" />
                              <span className="text-harmonix-sage-fade">{selectedAgent.deployment.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-harmonix-sage-fade mb-2">
                            Requirements
                          </p>
                          <ul className="space-y-1">
                            {selectedAgent.deployment.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm text-harmonix-sage-fade/70">
                                • {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="creator" className="mt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-harmonix-regal-gold/20 rounded-full flex items-center justify-center">
                          <Shield className="h-6 w-6 text-harmonix-regal-gold" />
                        </div>
                        <div>
                          <p className="font-medium text-harmonix-sage-fade">{selectedAgent.creator}</p>
                          <p className="text-sm text-harmonix-sage-fade/70">Verified Creator</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Deployment Panel */}
            <div className="space-y-6">
              <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
                <CardHeader>
                  <CardTitle className="text-harmonix-regal-gold">Quick Deploy</CardTitle>
                  <CardDescription className="text-harmonix-sage-fade/70">
                    Deploy this agent to your organization instantly
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-harmonix-sage-fade">One-time Setup</span>
                      <span className="text-lg font-semibold text-harmonix-sage-fade">
                        ${selectedAgent.price}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-harmonix-sage-fade">Monthly Usage</span>
                      <span className="text-lg font-semibold text-harmonix-sage-fade">
                        ${selectedAgent.monthlyFee}/mo
                      </span>
                    </div>
                    
                    <div className="border-t border-harmonix-sage-fade/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-harmonix-sage-fade">Total Today</span>
                        <span className="text-xl font-bold text-harmonix-regal-gold">
                          ${selectedAgent.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleOneClickDeploy}
                    className="w-full bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
                    size="lg"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Deploy Now
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-harmonix-sage-fade/70">
                      30-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-harmonix-cedar-green/5 border-harmonix-sage-fade/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Rocket className="h-5 w-5 text-harmonix-regal-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-harmonix-sage-fade">
                        One-Click Deployment
                      </p>
                      <p className="text-xs text-harmonix-sage-fade/70 mt-1">
                        This agent will be automatically configured and deployed to your dashboard.
                        No technical setup required.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {deploymentStep === 'payment' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-harmonix-regal-gold mb-2">
                Choose Payment Method
              </h2>
              <p className="text-harmonix-sage-fade/70">
                Complete your payment to deploy {selectedAgent.name}
              </p>
            </div>
            
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="stripe" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Card Payment
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Crypto
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stripe">
                <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <p className="text-lg font-semibold text-harmonix-sage-fade">
                        ${selectedAgent.price} USD
                      </p>
                      <p className="text-sm text-harmonix-sage-fade/70">
                        One-time deployment fee for {selectedAgent.name}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handlePaymentComplete}
                      className="w-full bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
                      size="lg"
                    >
                      Pay with Stripe
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="crypto">
                <CryptoPayment
                  amount={selectedAgent.price}
                  itemDescription={`${selectedAgent.name} - Agent Deployment`}
                  orderId={`deploy_${selectedAgent.id}_${Date.now()}`}
                  onSuccess={handlePaymentComplete}
                  onCancel={() => setDeploymentStep('overview')}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {deploymentStep === 'deploying' && (
          <div className="max-w-4xl mx-auto">
            <DeploymentPipeline
              agentConfig={{
                name: selectedAgent.name,
                description: selectedAgent.description,
                prompt: `Advanced ${selectedAgent.category.toLowerCase()} agent`,
                licenseType: 'marketplace',
                price: selectedAgent.price
              }}
              onComplete={handleDeploymentComplete}
              onCancel={() => setDeploymentStep('overview')}
            />
          </div>
        )}
        
        {deploymentStep === 'success' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-500" />
                <h2 className="text-2xl font-bold text-harmonix-regal-gold mb-4">
                  Deployment Successful!
                </h2>
                <p className="text-harmonix-sage-fade/70 mb-6">
                  {selectedAgent.name} has been deployed to your organization and is ready to use.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <Button 
                    onClick={() => setLocation('/dashboard')}
                    className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Using Agent
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleBackToMarketplace}
                    className="text-harmonix-sage-fade"
                  >
                    Browse More Agents
                  </Button>
                </div>
                
                <div className="text-sm text-harmonix-sage-fade/70">
                  <p>Agent ID: {selectedAgent.id}-{Date.now()}</p>
                  <p>Monthly billing starts in 30 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}