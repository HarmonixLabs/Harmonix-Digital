import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Star, Zap, ArrowRight, Calculator, TrendingUp, Wallet, Users, Bot, Clock, DollarSign } from "lucide-react";
import { Link } from "wouter";

// Enhanced pricing tiers with Phase 3 specifications
const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses beginning their automation journey",
    setupFee: { min: 4400, max: 6200 },
    monthlyMRR: { min: 800, max: 1200 },
    agents: { min: 1, max: 2 },
    deposit: { min: 15, max: 25 },
    features: [
      "1-2 AI Agents",
      "Basic integrations",
      "Standard support",
      "SŌL brain access",
      "Monthly analytics",
      "Email automation"
    ],
    popular: false,
    color: "blue"
  },
  {
    id: "growth",
    name: "Growth",
    description: "Ideal for growing companies scaling operations",
    setupFee: { min: 8000, max: 12500 },
    monthlyMRR: { min: 3200, max: 4400 },
    agents: { min: 3, max: 5 },
    deposit: { min: 15, max: 30 },
    features: [
      "3-5 AI Agents",
      "Advanced integrations",
      "Priority support",
      "Custom workflows",
      "Real-time analytics",
      "CRM automation",
      "Team collaboration"
    ],
    popular: true,
    color: "gold"
  },
  {
    id: "expansion",
    name: "Expansion",
    description: "For established businesses ready for full automation",
    setupFee: { min: 15000, max: 18000 },
    monthlyMRR: { min: 6000, max: 6000 },
    agents: { min: 6, max: 10 },
    deposit: { min: 15, max: 33 },
    features: [
      "6-10 AI Agents",
      "Enterprise integrations",
      "Dedicated support",
      "Custom agent creation",
      "Advanced analytics",
      "Multi-location support",
      "API access",
      "White-label options"
    ],
    popular: false,
    color: "purple"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete automation ecosystem for large organizations",
    setupFee: { min: 21500, max: 50000 },
    monthlyMRR: { min: 8000, max: 15000 },
    agents: { min: 10, max: 999 },
    deposit: { min: 20, max: 40 },
    features: [
      "Unlimited AI Agents",
      "Custom integrations",
      "24/7 dedicated support",
      "Agent marketplace access",
      "Custom SŌL brain",
      "Enterprise security",
      "Multi-tenant setup",
      "Custom contracts"
    ],
    popular: false,
    color: "emerald"
  }
];

export default function PricingEnhanced() {
  const [selectedTier, setSelectedTier] = useState<string>("growth");
  const [depositPercentage, setDepositPercentage] = useState([20]);
  const [isEarlyBird, setIsEarlyBird] = useState(true);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [roiInputs, setRoiInputs] = useState({
    currentHourlyRate: 50,
    hoursSpentWeekly: 20,
    expectedSavings: 80
  });

  // Calculate pricing with early bird discount
  const getCalculatedPrice = (tier: any) => {
    const baseSetup = (tier.setupFee.min + tier.setupFee.max) / 2;
    const discountedSetup = isEarlyBird ? baseSetup * 0.7 : baseSetup; // 30% early bird discount
    const depositAmount = (discountedSetup * depositPercentage[0]) / 100;
    const remainingAmount = discountedSetup - depositAmount;
    
    return {
      baseSetup,
      discountedSetup,
      depositAmount,
      remainingAmount,
      monthlyMRR: (tier.monthlyMRR.min + tier.monthlyMRR.max) / 2
    };
  };

  // ROI Calculator
  const calculateROI = () => {
    const { currentHourlyRate, hoursSpentWeekly, expectedSavings } = roiInputs;
    const currentMonthlyCost = currentHourlyRate * hoursSpentWeekly * 4.33; // avg weeks per month
    const savedHours = hoursSpentWeekly * (expectedSavings / 100);
    const monthlySavings = savedHours * currentHourlyRate * 4.33;
    const selectedTierData = pricingTiers.find(t => t.id === selectedTier);
    const tierPrice = selectedTierData ? getCalculatedPrice(selectedTierData) : null;
    const monthlyMRR = tierPrice?.monthlyMRR || 1000;
    const netMonthlySavings = monthlySavings - monthlyMRR;
    const yearlyROI = ((netMonthlySavings * 12) / (tierPrice?.discountedSetup || 10000)) * 100;
    
    return {
      currentMonthlyCost,
      monthlySavings,
      netMonthlySavings,
      yearlyROI,
      savedHours
    };
  };

  const roi = calculateROI();

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Enhanced Header with Early Bird */}
          <div className="text-center mb-16">
            {isEarlyBird && (
              <div className="inline-flex items-center gap-2 bg-harmonix-gold/20 border border-harmonix-gold rounded-full px-6 py-2 mb-6">
                <Star className="w-4 h-4 text-harmonix-gold" />
                <span className="text-harmonix-gold font-semibold">
                  Early Bird Special: 30% Off - Limited to First 280 Customers
                </span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-bold text-harmonix-gold mb-6">
              Intelligent Systems for Timeless Sovereignty
            </h1>
            <p className="text-xl text-harmonix-sage max-w-3xl mx-auto mb-8">
              Transform your business with AI agents designed to automate, optimize, and scale. From startup to enterprise - there's a perfect plan for your journey.
            </p>
            
            {/* Enhanced Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <Label htmlFor="early-bird" className="text-harmonix-sage">Early Bird Pricing</Label>
                <Switch
                  id="early-bird"
                  checked={isEarlyBird}
                  onCheckedChange={setIsEarlyBird}
                />
              </div>
              
              <Button
                variant={showROICalculator ? "default" : "outline"}
                onClick={() => setShowROICalculator(!showROICalculator)}
                className={showROICalculator 
                  ? "bg-harmonix-gold text-harmonix-black" 
                  : "border-harmonix-gold text-harmonix-gold hover:bg-harmonix-gold hover:text-harmonix-black"
                }
              >
                <Calculator className="w-4 h-4 mr-2" />
                ROI Calculator
              </Button>
            </div>
          </div>

          {/* ROI Calculator */}
          {showROICalculator && (
            <Card className="bg-harmonix-night border-harmonix-cedar mb-12">
              <CardHeader>
                <CardTitle className="text-harmonix-gold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  ROI Calculator
                </CardTitle>
                <CardDescription className="text-harmonix-sage">
                  Calculate your potential return on investment with Harmonix AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-harmonix-sage">Current Hourly Rate ($)</Label>
                      <Slider
                        value={[roiInputs.currentHourlyRate]}
                        onValueChange={([value]) => setRoiInputs(prev => ({ ...prev, currentHourlyRate: value }))}
                        max={200}
                        min={15}
                        step={5}
                        className="mt-2"
                      />
                      <div className="text-harmonix-gold font-semibold mt-1">${roiInputs.currentHourlyRate}/hour</div>
                    </div>
                    
                    <div>
                      <Label className="text-harmonix-sage">Hours Spent on Tasks Weekly</Label>
                      <Slider
                        value={[roiInputs.hoursSpentWeekly]}
                        onValueChange={([value]) => setRoiInputs(prev => ({ ...prev, hoursSpentWeekly: value }))}
                        max={60}
                        min={5}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-harmonix-gold font-semibold mt-1">{roiInputs.hoursSpentWeekly} hours/week</div>
                    </div>
                    
                    <div>
                      <Label className="text-harmonix-sage">Expected Time Savings (%)</Label>
                      <Slider
                        value={[roiInputs.expectedSavings]}
                        onValueChange={([value]) => setRoiInputs(prev => ({ ...prev, expectedSavings: value }))}
                        max={95}
                        min={30}
                        step={5}
                        className="mt-2"
                      />
                      <div className="text-harmonix-gold font-semibold mt-1">{roiInputs.expectedSavings}% time saved</div>
                    </div>
                  </div>
                  
                  <div className="bg-harmonix-black border border-harmonix-cedar rounded-lg p-6">
                    <h3 className="text-harmonix-gold font-semibold mb-4">ROI Projection</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-harmonix-sage">Current Monthly Cost:</span>
                        <span className="text-harmonix-gold font-semibold">${roi.currentMonthlyCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-harmonix-sage">Monthly Savings:</span>
                        <span className="text-green-400 font-semibold">${roi.monthlySavings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-harmonix-sage">Net Monthly Benefit:</span>
                        <span className="text-green-400 font-semibold">${roi.netMonthlySavings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-harmonix-cedar pt-3">
                        <span className="text-harmonix-sage">Yearly ROI:</span>
                        <span className="text-harmonix-gold font-bold text-lg">{roi.yearlyROI.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-harmonix-sage">Hours Saved Weekly:</span>
                        <span className="text-harmonix-gold font-semibold">{roi.savedHours.toFixed(1)} hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Pricing Cards */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {pricingTiers.map((tier) => {
              const pricing = getCalculatedPrice(tier);
              const isSelected = selectedTier === tier.id;
              
              return (
                <Card 
                  key={tier.id}
                  className={`relative bg-harmonix-night border-2 transition-all duration-300 cursor-pointer ${
                    tier.popular 
                      ? 'border-harmonix-gold scale-105' 
                      : isSelected 
                        ? 'border-harmonix-gold' 
                        : 'border-harmonix-cedar hover:border-harmonix-gold/50'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-harmonix-gold text-harmonix-black px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl text-harmonix-gold mb-2">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-harmonix-sage text-sm mb-4">
                      {tier.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      {isEarlyBird && (
                        <div className="text-sm text-red-400 line-through">
                          ${pricing.baseSetup.toLocaleString()}
                        </div>
                      )}
                      <div className="text-3xl font-bold text-harmonix-gold">
                        ${pricing.discountedSetup.toLocaleString()}
                        <span className="text-sm text-harmonix-sage block">
                          Setup Fee
                        </span>
                      </div>
                      <div className="text-lg text-harmonix-gold">
                        ${pricing.monthlyMRR.toLocaleString()}/mo
                        <span className="text-sm text-harmonix-sage block">
                          Monthly MRR
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center p-3 bg-harmonix-black border border-harmonix-cedar rounded-lg">
                      <div className="text-sm text-harmonix-sage">Agents Included</div>
                      <div className="text-harmonix-gold font-bold">
                        {tier.agents.min === tier.agents.max ? tier.agents.min : `${tier.agents.min}-${tier.agents.max}`}
                        {tier.agents.max === 999 ? "+ Unlimited" : ""}
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {tier.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-harmonix-gold flex-shrink-0" />
                          <span className="text-harmonix-sage text-sm">{feature}</span>
                        </li>
                      ))}
                      {tier.features.length > 4 && (
                        <li className="text-harmonix-sage text-sm">
                          +{tier.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Deposit Calculator for Selected Tier */}
          {selectedTier && (
            <Card className="bg-harmonix-night border-harmonix-cedar mb-12">
              <CardHeader>
                <CardTitle className="text-harmonix-gold flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Deposit Calculator - {pricingTiers.find(t => t.id === selectedTier)?.name}
                </CardTitle>
                <CardDescription className="text-harmonix-sage">
                  Customize your deposit amount (15-33% of total setup fee)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-harmonix-sage">Deposit Percentage</Label>
                      <Slider
                        value={depositPercentage}
                        onValueChange={setDepositPercentage}
                        max={33}
                        min={15}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-harmonix-sage mt-1">
                        <span>15%</span>
                        <span className="text-harmonix-gold font-semibold">{depositPercentage[0]}%</span>
                        <span>33%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-harmonix-black border border-harmonix-cedar rounded-lg p-6">
                    {(() => {
                      const tier = pricingTiers.find(t => t.id === selectedTier);
                      const pricing = tier ? getCalculatedPrice(tier) : null;
                      
                      return pricing ? (
                        <div className="space-y-4">
                          <h3 className="text-harmonix-gold font-semibold">Payment Breakdown</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-harmonix-sage">Setup Fee:</span>
                              <span className="text-harmonix-gold font-semibold">${pricing.discountedSetup.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-harmonix-sage">Deposit Today:</span>
                              <span className="text-harmonix-gold font-bold text-lg">${pricing.depositAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-harmonix-sage">Remaining Balance:</span>
                              <span className="text-harmonix-sage">${pricing.remainingAmount.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-harmonix-cedar pt-3">
                              <div className="flex justify-between">
                                <span className="text-harmonix-sage">Monthly MRR:</span>
                                <span className="text-harmonix-gold font-semibold">${pricing.monthlyMRR.toLocaleString()}/mo</span>
                              </div>
                            </div>
                          </div>
                          
                          <Link href={`/checkout?tier=${selectedTier}&deposit=${depositPercentage[0]}`}>
                            <Button className="w-full bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 mt-4">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Proceed to Checkout
                            </Button>
                          </Link>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Features Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-harmonix-gold mb-8">
              Complete Feature Comparison
            </h2>
            
            <Card className="bg-harmonix-night border-harmonix-cedar overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-harmonix-black">
                    <tr>
                      <th className="text-left p-4 text-harmonix-gold min-w-[200px]">Features</th>
                      {pricingTiers.map(tier => (
                        <th key={tier.id} className="text-center p-4 text-harmonix-gold min-w-[120px]">
                          {tier.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-harmonix-cedar">
                    {[
                      ["AI Agents Included", "1-2", "3-5", "6-10", "Unlimited"],
                      ["Setup & Training", "Basic", "Advanced", "Enterprise", "Custom"],
                      ["Integration Support", "Standard", "Priority", "Advanced", "24/7 Dedicated"],
                      ["Custom Workflows", "❌", "✅", "✅", "✅"],
                      ["Real-time Analytics", "Basic", "Advanced", "Enterprise", "Custom Dashboard"],
                      ["API Access", "❌", "Limited", "✅", "Full Access"],
                      ["White-label Options", "❌", "❌", "✅", "✅"],
                      ["SŌL Brain Access", "✅", "✅", "✅", "Custom SŌL"],
                      ["Agent Marketplace", "Browse Only", "Deploy", "Create & Deploy", "Full Access"],
                      ["NFT Features", "❌", "❌", "✅", "✅"],
                      ["Multi-location Support", "❌", "❌", "✅", "✅"],
                      ["Custom Integrations", "❌", "Limited", "✅", "Unlimited"],
                      ["Dedicated Support", "Email", "Priority", "Phone + Email", "24/7 + Slack"],
                      ["Training & Onboarding", "Self-service", "Group", "1-on-1", "Dedicated Team"]
                    ].map(([feature, ...values], index) => (
                      <tr key={index} className="hover:bg-harmonix-black/50">
                        <td className="p-4 font-medium text-harmonix-sage">{feature}</td>
                        {values.map((value, i) => (
                          <td key={i} className="p-4 text-center text-harmonix-sage">
                            {value === "✅" ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : value === "❌" ? (
                              <span className="text-red-400">—</span>
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Financing Options */}
          <Card className="bg-harmonix-night border-harmonix-cedar mb-12">
            <CardHeader>
              <CardTitle className="text-harmonix-gold">Financing Available</CardTitle>
              <CardDescription className="text-harmonix-sage">
                Flexible payment options to fit your budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-harmonix-black border border-harmonix-cedar rounded-lg">
                  <Clock className="w-8 h-8 text-harmonix-gold mx-auto mb-3" />
                  <h3 className="font-semibold text-harmonix-gold mb-2">12-Month Plan</h3>
                  <p className="text-harmonix-sage text-sm mb-3">21% APR</p>
                  <p className="text-harmonix-sage text-sm">Split your investment into manageable monthly payments</p>
                </div>
                
                <div className="text-center p-6 bg-harmonix-black border border-harmonix-cedar rounded-lg">
                  <Users className="w-8 h-8 text-harmonix-gold mx-auto mb-3" />
                  <h3 className="font-semibold text-harmonix-gold mb-2">Team Packages</h3>
                  <p className="text-harmonix-sage text-sm mb-3">Volume Discounts</p>
                  <p className="text-harmonix-sage text-sm">Additional savings for multiple agent deployments</p>
                </div>
                
                <div className="text-center p-6 bg-harmonix-black border border-harmonix-cedar rounded-lg">
                  <Bot className="w-8 h-8 text-harmonix-gold mx-auto mb-3" />
                  <h3 className="font-semibold text-harmonix-gold mb-2">Custom Enterprise</h3>
                  <p className="text-harmonix-sage text-sm mb-3">Tailored Pricing</p>
                  <p className="text-harmonix-sage text-sm">Enterprise agreements with custom terms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-harmonix-gold/10 to-harmonix-sage/10 border-harmonix-gold/20">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-harmonix-gold mb-4">
                  Ready to Build, Automate, and Exit?
                </h2>
                <p className="text-xl text-harmonix-sage mb-8 max-w-2xl mx-auto">
                  Join the first 280 customers to receive 30% early bird discount. Transform your business with intelligent automation designed for timeless sovereignty.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Link href="/sol-brain">
                    <Button 
                      size="lg"
                      className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Get SŌL Recommendation
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-harmonix-gold text-harmonix-gold hover:bg-harmonix-gold hover:text-harmonix-black"
                    >
                      Try Interactive Demo
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar hover:text-harmonix-gold"
                    >
                      Browse Marketplace
                    </Button>
                  </Link>
                </div>
                
                {isEarlyBird && (
                  <div className="inline-flex items-center gap-2 text-sm text-harmonix-gold">
                    <Star className="w-4 h-4" />
                    <span>Early bird pricing expires when we reach 280 customers</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}