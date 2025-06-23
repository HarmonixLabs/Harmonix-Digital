import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard, Calculator, Sparkles, ArrowRight, Clock, Users, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  agents: string;
  setupFee: number;
  monthlyMRR: string;
  popular: boolean;
  features: string[];
}

export default function CheckoutPage() {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [industry, setIndustry] = useState("");
  const [useCase, setUseCase] = useState("");
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const { toast } = useToast();

  // Check for payment cancellation on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'cancelled') {
      setPaymentCancelled(true);
    }
  }, []);

  const pricingTiers: { [key: string]: PricingTier } = {
    Starter: {
      name: "Starter",
      agents: "1 Agent",
      setupFee: 4400,
      monthlyMRR: "$800 – $1.2K",
      popular: false,
      features: ["Sales Agent CA$H", "Basic CRM integration", "Email support", "Monthly reporting"]
    },
    Growth: {
      name: "Growth", 
      agents: "3–5 Agents",
      setupFee: 8000,
      monthlyMRR: "$3.2K – $4.4K",
      popular: true,
      features: ["All Starter features", "Concierge + HR Agents", "Advanced automation", "Priority support", "Weekly strategy calls"]
    },
    Expansion: {
      name: "Expansion",
      agents: "6–8 Agents", 
      setupFee: 15000,
      monthlyMRR: "~$6K",
      popular: false,
      features: ["All Growth features", "Content + SOP Agents", "Custom workflows", "Dedicated success manager", "Advanced analytics"]
    },
    Enterprise: {
      name: "Enterprise",
      agents: "9–12 Agents",
      setupFee: 21500,
      monthlyMRR: "$8K+",
      popular: false,
      features: ["Full agent suite", "White-label options", "Custom integrations", "24/7 support", "Quarterly business reviews"]
    }
  };

  const addOnOptions = [
    { name: "Advanced Analytics", price: 500, description: "Deep insights and performance tracking" },
    { name: "Custom Integrations", price: 1000, description: "Connect to your existing tools" },
    { name: "Priority Support", price: 300, description: "24/7 dedicated support channel" },
    { name: "Additional Training", price: 750, description: "Extended onboarding and team training" }
  ];

  const industries = [
    "Technology", "Healthcare", "Finance", "Real Estate", "E-commerce", 
    "Manufacturing", "Consulting", "Marketing Agency", "Legal", "Other"
  ];

  const useCases = [
    "Lead Generation", "Customer Support", "Content Creation", "Process Automation",
    "Sales Optimization", "HR Management", "Project Management", "Data Analysis"
  ];

  const calculateROI = () => {
    if (!selectedTier || !industry || !useCase) return 0;

    const baseTier = pricingTiers[selectedTier];
    let estimatedReturn = baseTier.setupFee * 2; // Base 2x return

    // Industry multipliers
    const industryMultipliers = {
      "Technology": 3.5,
      "Finance": 4.0,
      "Real Estate": 3.0,
      "E-commerce": 2.8,
      "Consulting": 3.2,
      "Marketing Agency": 2.5
    };

    // Use case multipliers
    const useCaseMultipliers = {
      "Lead Generation": 3.0,
      "Sales Optimization": 3.5,
      "Process Automation": 2.8,
      "Customer Support": 2.2
    };

    const industryMultiplier = industryMultipliers[industry] || 2.0;
    const useCaseMultiplier = useCaseMultipliers[useCase] || 2.0;

    estimatedReturn = Math.round(baseTier.setupFee * industryMultiplier * useCaseMultiplier);
    return estimatedReturn;
  };

  const handlePayment = async () => {
    if (!selectedTier) {
      toast({
        title: "Please select a package",
        description: "Choose a tier before proceeding to payment",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier.toLowerCase(),
          customOptions: {
            addOns: selectedAddOns,
            estimatedValue: estimatedValue
          },
          industry: industry || '',
          useCase: useCase || '',
          roiAdjustment: estimatedValue - pricingTiers[selectedTier].setupFee,
          promoCode: 'EARLYBIRD30', // Apply early bird discount
          isDeposit: false
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleDepositPayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'deposit',
          isDeposit: true,
          promoCode: 'EARLYBIRD30'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create deposit session');
      }

      window.location.href = data.url;

    } catch (error) {
      console.error('Deposit payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process deposit. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const roi = calculateROI();
    setEstimatedValue(roi);
  }, [selectedTier, industry, useCase]);

  const getDiscountedPrice = (originalPrice: number) => {
    return Math.round(originalPrice * 0.7); // 30% discount
  };

  const getTotalPrice = () => {
    if (!selectedTier) return 0;
    const basePrice = getDiscountedPrice(pricingTiers[selectedTier].setupFee);
    const addOnPrice = selectedAddOns.reduce((total, addOn) => {
      const option = addOnOptions.find(opt => opt.name === addOn);
      return total + (option ? option.price : 0);
    }, 0);
    return basePrice + addOnPrice;
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />

      {/* Payment Cancelled Alert */}
      {paymentCancelled && (
        <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 p-4 mx-4 mt-4 rounded-lg">
          <div className="harmonix-container">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-harmonix-regal-gold" />
              <div>
                <p className="text-harmonix-regal-gold font-medium">Payment was cancelled</p>
                <p className="text-harmonix-sage-fade text-sm">No worries! Your spot is still reserved. Complete your purchase when ready.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="py-12 sm:py-16">
        <div className="harmonix-container">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Early Bird Pricing - 30% Off
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-harmonix-regal-gold font-serif">
              Activate Your AI Workforce
            </h1>
            
            <p className="text-lg text-harmonix-sage-fade max-w-3xl mx-auto">
              Choose your package and let SŌL brain orchestrate your business transformation. 
              First 280 customers receive 30% discount.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="harmonix-container">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Package Selection */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Pricing Tiers */}
              <Card className="harmonix-card-enhanced p-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-harmonix-regal-gold">Choose Your Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(pricingTiers).map(([key, tier]) => (
                      <Card 
                        key={key}
                        className={cn(
                          "relative p-4 cursor-pointer transition-all duration-300 border-2",
                          selectedTier === key 
                            ? "border-harmonix-regal-gold bg-harmonix-regal-gold/10" 
                            : "border-harmonix-sage-fade/20 hover:border-harmonix-regal-gold/50"
                        )}
                        onClick={() => setSelectedTier(key)}
                      >
                        {tier.popular && (
                          <Badge className="absolute -top-2 left-4 bg-harmonix-regal-gold text-harmonix-deep-forest text-xs">
                            Most Popular
                          </Badge>
                        )}
                        
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-harmonix-regal-gold">{tier.name}</h3>
                            <p className="text-sm text-harmonix-sage-fade">{tier.agents}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-harmonix-sage-fade line-through">
                                ${tier.setupFee.toLocaleString()}
                              </span>
                              <Badge variant="secondary" className="text-xs bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
                                30% OFF
                              </Badge>
                            </div>
                            <div className="text-xl font-bold text-white">
                              ${getDiscountedPrice(tier.setupFee).toLocaleString()}
                            </div>
                            <div className="text-sm text-harmonix-sage-fade">
                              Monthly: {tier.monthlyMRR}
                            </div>
                          </div>

                          <div className="space-y-1">
                            {tier.features.slice(0, 3).map((feature, i) => (
                              <div key={i} className="flex items-center space-x-2 text-xs text-harmonix-sage-fade">
                                <CheckCircle className="w-3 h-3 text-harmonix-regal-gold" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Business Profile */}
              <Card className="harmonix-card-enhanced p-6">
                <CardHeader>
                  <CardTitle className="text-xl text-harmonix-regal-gold flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Business Profile & ROI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-harmonix-sage-fade mb-2 block">
                        Industry (Optional)
                      </label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/30">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-harmonix-sage-fade mb-2 block">
                        Primary Use Case (Optional)
                      </label>
                      <Select value={useCase} onValueChange={setUseCase}>
                        <SelectTrigger className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/30">
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                        <SelectContent>
                          {useCases.map((uc) => (
                            <SelectItem key={uc} value={uc}>{uc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {estimatedValue > 0 && (
                    <div className="bg-harmonix-regal-gold/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-harmonix-regal-gold">Estimated 12-Month Value</p>
                          <p className="text-xs text-harmonix-sage-fade">Based on industry benchmarks</p>
                        </div>
                        <div className="text-2xl font-bold text-harmonix-regal-gold">
                          ${estimatedValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add-ons */}
              <Card className="harmonix-card-enhanced p-6">
                <CardHeader>
                  <CardTitle className="text-xl text-harmonix-regal-gold">Optional Add-ons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {addOnOptions.map((addOn) => (
                      <div 
                        key={addOn.name}
                        className="flex items-center space-x-3 p-3 bg-harmonix-night-pine/30 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          id={addOn.name}
                          checked={selectedAddOns.includes(addOn.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAddOns([...selectedAddOns, addOn.name]);
                            } else {
                              setSelectedAddOns(selectedAddOns.filter(item => item !== addOn.name));
                            }
                          }}
                          className="w-4 h-4 text-harmonix-regal-gold bg-harmonix-night-pine border-harmonix-sage-fade rounded focus:ring-harmonix-regal-gold"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <label htmlFor={addOn.name} className="font-medium text-white cursor-pointer">
                              {addOn.name}
                            </label>
                            <span className="text-harmonix-regal-gold font-semibold">+${addOn.price}</span>
                          </div>
                          <p className="text-xs text-harmonix-sage-fade">{addOn.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="harmonix-card-enhanced p-6 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl text-harmonix-regal-gold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {selectedTier && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-harmonix-sage-fade">{pricingTiers[selectedTier].name} Package</span>
                        <span className="text-white font-semibold">
                          ${getDiscountedPrice(pricingTiers[selectedTier].setupFee).toLocaleString()}
                        </span>
                      </div>

                      {selectedAddOns.map((addOn) => {
                        const option = addOnOptions.find(opt => opt.name === addOn);
                        return option ? (
                          <div key={addOn} className="flex justify-between items-center text-sm">
                            <span className="text-harmonix-sage-fade">{addOn}</span>
                            <span className="text-white">+${option.price}</span>
                          </div>
                        ) : null;
                      })}

                      <div className="border-t border-harmonix-sage-fade/20 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white">Total</span>
                          <span className="text-xl font-bold text-harmonix-regal-gold">
                            ${getTotalPrice().toLocaleString()}
                          </span>
                        </div>
                        
                        <Badge className="w-full justify-center mt-2 bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
                          You save ${selectedTier ? (pricingTiers[selectedTier].setupFee - getDiscountedPrice(pricingTiers[selectedTier].setupFee)).toLocaleString() : 0}
                        </Badge>
                      </div>

                      {/* Payment Buttons */}
                      <div className="space-y-3 pt-4">
                        <Button 
                          onClick={handlePayment}
                          disabled={isProcessing}
                          className="w-full touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 font-semibold"
                        >
                          {isProcessing ? (
                            <div className="animate-spin w-4 h-4 border-2 border-harmonix-deep-forest border-t-transparent rounded-full mr-2" />
                          ) : (
                            <CreditCard className="mr-2 h-4 w-4" />
                          )}
                          {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                        </Button>

                        <div className="text-center">
                          <p className="text-xs text-harmonix-sage-fade mb-2">Or secure your spot with a deposit</p>
                          <Button 
                            variant="outline"
                            onClick={handleDepositPayment}
                            disabled={isProcessing}
                            className="w-full border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                          >
                            Pay $444 Deposit (30% Off)
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!selectedTier && (
                    <div className="text-center py-8">
                      <p className="text-harmonix-sage-fade">Select a package to see pricing</p>
                    </div>
                  )}

                  {/* Trust Indicators */}
                  <div className="pt-4 border-t border-harmonix-sage-fade/20 space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-harmonix-sage-fade">
                      <CheckCircle className="w-4 h-4 text-harmonix-regal-gold" />
                      <span>Secure payment via Stripe</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-harmonix-sage-fade">
                      <Users className="w-4 h-4 text-harmonix-regal-gold" />
                      <span>280+ early adopters</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-harmonix-sage-fade">
                      <TrendingUp className="w-4 h-4 text-harmonix-regal-gold" />
                      <span>95% customer satisfaction</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Option */}
              <Card className="harmonix-card-enhanced p-4 mt-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-harmonix-sage-fade">Want to see it in action first?</p>
                  <Button 
                    variant="ghost"
                    onClick={() => window.location.href = '/demo-scenarios'}
                    className="text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Watch Live Demo
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}