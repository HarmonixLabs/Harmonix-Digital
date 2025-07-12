import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Shield, 
  Check, 
  Star, 
  Users, 
  Zap, 
  TrendingUp,
  Lock,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Crown,
  Calculator
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  oneTimePrice: number;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  agents: number;
  popular?: boolean;
  enterprise?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    description: 'Perfect for small businesses getting started with AI automation',
    oneTimePrice: 4400,
    monthlyPrice: 300,
    annualPrice: 3000,
    agents: 1,
    features: [
      '1 Premium AI Agent',
      '10,000 Monthly Interactions',
      'Basic Analytics Dashboard',
      'Email Support',
      'Standard Integrations'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Package',
    description: 'Ideal for growing businesses ready to scale operations',
    oneTimePrice: 8000,
    monthlyPrice: 500,
    annualPrice: 5000,
    agents: 3,
    popular: true,
    features: [
      '3 Premium AI Agents',
      '50,000 Monthly Interactions',
      'Advanced Analytics & Reports',
      'Priority Support',
      'Custom Integrations',
      'Multi-Agent Coordination'
    ]
  },
  {
    id: 'expansion',
    name: 'Expansion Package',
    description: 'For established businesses with complex automation needs',
    oneTimePrice: 15000,
    monthlyPrice: 800,
    annualPrice: 8000,
    agents: 6,
    features: [
      '6 Premium AI Agents',
      '150,000 Monthly Interactions',
      'Executive Analytics Suite',
      'Dedicated Account Manager',
      'Custom Workflows',
      'Advanced Security Features'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    description: 'Complete AI automation solution for large organizations',
    oneTimePrice: 21500,
    monthlyPrice: 1200,
    annualPrice: 12000,
    agents: 12,
    enterprise: true,
    features: [
      '12+ Premium AI Agents',
      'Unlimited Interactions',
      'White-label Solutions',
      '24/7 Dedicated Support',
      'Custom Development',
      'Enterprise Security & Compliance'
    ]
  }
];

interface CheckoutFormData {
  tier: string;
  paymentType: 'one-time' | 'subscription';
  billingCycle: 'monthly' | 'annual';
  customerInfo: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  useCase: string;
  industry: string;
}

export default function EnhancedCheckout() {
  const [selectedTier, setSelectedTier] = useState<string>('growth');
  const [paymentType, setPaymentType] = useState<'one-time' | 'subscription'>('subscription');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [formData, setFormData] = useState<CheckoutFormData['customerInfo']>({
    name: '',
    email: '',
    company: '',
    phone: ''
  });
  const [useCase, setUseCase] = useState('');
  const [industry, setIndustry] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const createCheckoutMutation = useMutation({
    mutationFn: async (checkoutData: any) => {
      return await apiRequest('POST', '/api/stripe/create-checkout-session', checkoutData);
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    }
  });

  const selectedTierData = PRICING_TIERS.find(tier => tier.id === selectedTier);
  if (!selectedTierData) return null;

  const calculatePrice = () => {
    if (paymentType === 'one-time') {
      let price = selectedTierData.oneTimePrice;
      if (appliedPromo === 'EARLYBIRD30') {
        price = Math.round(price * 0.7);
      }
      return price;
    } else {
      let price = billingCycle === 'annual' ? selectedTierData.annualPrice : selectedTierData.monthlyPrice;
      if (appliedPromo === 'EARLYBIRD30') {
        price = Math.round(price * 0.85);
      }
      return price;
    }
  };

  const calculateSavings = () => {
    if (paymentType === 'subscription' && billingCycle === 'annual') {
      return (selectedTierData.monthlyPrice * 12) - selectedTierData.annualPrice;
    }
    if (appliedPromo === 'EARLYBIRD30') {
      const originalPrice = paymentType === 'one-time' 
        ? selectedTierData.oneTimePrice 
        : (billingCycle === 'annual' ? selectedTierData.annualPrice : selectedTierData.monthlyPrice);
      const discountRate = paymentType === 'one-time' ? 0.3 : 0.15;
      return Math.round(originalPrice * discountRate);
    }
    return 0;
  };

  const handlePromoCode = () => {
    if (promoCode.toUpperCase() === 'EARLYBIRD30') {
      setAppliedPromo('EARLYBIRD30');
      toast({
        title: "Promo Code Applied!",
        description: paymentType === 'one-time' 
          ? "30% discount applied to one-time purchase!"
          : "15% discount applied to subscription!",
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid.",
        variant: "destructive"
      });
    }
  };

  const handleCheckout = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const checkoutData = {
      tier: selectedTier,
      paymentType,
      isSubscription: paymentType === 'subscription',
      subscriptionTier: billingCycle,
      customerEmail: formData.email,
      customerName: formData.name,
      industry,
      useCase,
      promoCode: appliedPromo,
      customOptions: {
        company: formData.company,
        phone: formData.phone
      }
    };

    createCheckoutMutation.mutate(checkoutData);
  };

  const finalPrice = calculatePrice();
  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 mt-2">
            Deploy your AI agents and transform your business operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Plan Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-emerald-600" />
                  Choose Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PRICING_TIERS.map((tier) => (
                    <Card
                      key={tier.id}
                      className={`cursor-pointer transition-all relative ${
                        selectedTier === tier.id 
                          ? 'ring-2 ring-emerald-500 bg-emerald-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      {tier.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-emerald-600 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">{tier.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                          
                          <div className="mb-3">
                            <div className="text-2xl font-bold text-emerald-600">
                              ${paymentType === 'one-time' 
                                ? tier.oneTimePrice.toLocaleString()
                                : billingCycle === 'annual'
                                  ? tier.annualPrice.toLocaleString()
                                  : tier.monthlyPrice.toLocaleString()
                              }
                            </div>
                            <div className="text-sm text-gray-500">
                              {paymentType === 'one-time' 
                                ? 'one-time payment'
                                : billingCycle === 'annual'
                                  ? 'per year'
                                  : 'per month'
                              }
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm">{tier.agents} AI Agent{tier.agents > 1 ? 's' : ''}</span>
                          </div>

                          <div className="space-y-1 text-xs text-left">
                            {tier.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                            {tier.features.length > 3 && (
                              <div className="text-center pt-1">
                                <span className="text-emerald-600">+{tier.features.length - 3} more features</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                    <TabsTrigger value="one-time">One-Time Payment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="subscription" className="space-y-4">
                    <Alert className="border-emerald-200 bg-emerald-50">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        Recommended: Get ongoing updates, support, and new features with a subscription.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      <Label>Billing Cycle</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Card 
                          className={`cursor-pointer transition-all ${
                            billingCycle === 'monthly' ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setBillingCycle('monthly')}
                        >
                          <CardContent className="p-4 text-center">
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                            <p className="font-medium">Monthly</p>
                            <p className="text-sm text-gray-600">${selectedTierData.monthlyPrice}/month</p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer transition-all ${
                            billingCycle === 'annual' ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setBillingCycle('annual')}
                        >
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                            <p className="font-medium">Annual</p>
                            <p className="text-sm text-gray-600">${selectedTierData.annualPrice}/year</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              Save ${(selectedTierData.monthlyPrice * 12) - selectedTierData.annualPrice}
                            </Badge>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="one-time" className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        One-time payment includes 1 year of updates and support. Extensions available separately.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="useCase">Primary Use Case</Label>
                    <Select value={useCase} onValueChange={setUseCase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales_automation">Sales Automation</SelectItem>
                        <SelectItem value="customer_support">Customer Support</SelectItem>
                        <SelectItem value="content_creation">Content Creation</SelectItem>
                        <SelectItem value="lead_generation">Lead Generation</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Plan */}
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedTierData.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTierData.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-emerald-600" />
                    {selectedTierData.agents} AI Agent{selectedTierData.agents > 1 ? 's' : ''}
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>
                      ${paymentType === 'one-time' 
                        ? selectedTierData.oneTimePrice.toLocaleString()
                        : billingCycle === 'annual'
                          ? selectedTierData.annualPrice.toLocaleString()
                          : selectedTierData.monthlyPrice.toLocaleString()
                      }
                    </span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        {appliedPromo ? 'Promo Discount' : 'Annual Savings'}
                      </span>
                      <span>-${savings.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">
                      ${finalPrice.toLocaleString()}
                      {paymentType === 'subscription' && (
                        <span className="text-sm font-normal text-gray-500">
                          /{billingCycle === 'annual' ? 'year' : 'month'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Promo Code */}
                <div className="space-y-2">
                  <Label htmlFor="promo">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      disabled={!!appliedPromo}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handlePromoCode}
                      disabled={!!appliedPromo || !promoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <p className="text-sm text-green-600">✓ Promo code applied!</p>
                  )}
                </div>

                <Separator />

                {/* Features Included */}
                <div className="space-y-2">
                  <h4 className="font-medium">What's Included:</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedTierData.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  Secure 256-bit SSL encryption
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  disabled={createCheckoutMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                >
                  {createCheckoutMutation.isPending ? (
                    "Processing..."
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Purchase - ${finalPrice.toLocaleString()}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}