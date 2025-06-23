import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Crown, Zap, Building2 } from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  setupMin: number;
  setupMax: number;
  mrrMin: number;
  mrrMax: number;
  agentsIncluded: number;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
  icon: React.ComponentType<any>;
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses getting started with AI automation",
    setupMin: 4400,
    setupMax: 6200,
    mrrMin: 800,
    mrrMax: 1200,
    agentsIncluded: 1,
    features: [
      "1 Core AI Agent",
      "Basic CRM Integration",
      "Email Support",
      "Standard Templates",
      "Monthly Reports",
      "Community Access"
    ],
    icon: Zap
  },
  {
    id: "growth",
    name: "Growth", 
    description: "Scale your operations with multiple AI agents working together",
    setupMin: 8000,
    setupMax: 12500,
    mrrMin: 3200,
    mrrMax: 4400,
    agentsIncluded: 3,
    features: [
      "3 AI Agents",
      "Advanced CRM Integration",
      "Priority Support",
      "Custom Workflows",
      "Real-time Analytics",
      "SŌL Brain Coordination",
      "API Access"
    ],
    popular: true,
    icon: Sparkles
  },
  {
    id: "expansion",
    name: "Expansion",
    description: "Comprehensive automation suite for growing enterprises",
    setupMin: 21500,
    setupMax: 28000,
    mrrMin: 5500,
    mrrMax: 7200,
    agentsIncluded: 6,
    features: [
      "6 AI Agents",
      "Full Integration Suite",
      "Dedicated Support Manager",
      "Custom Agent Training",
      "Advanced Analytics Dashboard",
      "White-label Options",
      "Multi-location Support",
      "Custom Reporting"
    ],
    icon: Crown
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete AI ecosystem with all 12+ agents and premium support",
    setupMin: 0,
    setupMax: 0,
    mrrMin: 8000,
    mrrMax: 12000,
    agentsIncluded: 12,
    features: [
      "All 12+ AI Agents",
      "SŌL Brain Orchestration",
      "24/7 Premium Support",
      "Custom Development",
      "Enterprise Security",
      "On-premise Options",
      "Dedicated Success Team",
      "Custom Integration",
      "ROI Guarantee"
    ],
    enterprise: true,
    icon: Building2
  }
];

export function PricingTiers() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showEarlyBird, setShowEarlyBird] = useState(true);

  const formatPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) return "Custom";
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getDiscountedPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) return "Custom";
    const discountedMin = Math.round(min * 0.7);
    const discountedMax = Math.round(max * 0.7);
    if (discountedMin === discountedMax) return `$${discountedMin.toLocaleString()}`;
    return `$${discountedMin.toLocaleString()} - $${discountedMax.toLocaleString()}`;
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-harmonix-regal-gold">Automation Journey</span>
          </h2>
          <p className="text-xl text-harmonix-sage-fade max-w-3xl mx-auto leading-relaxed">
            Transform your business with AI agents that work 24/7. Each tier includes setup, training, 
            and ongoing support to ensure your success.
          </p>

          {/* Early Bird Banner */}
          {showEarlyBird && (
            <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Sparkles className="w-5 h-5 text-harmonix-regal-gold" />
                <span className="text-harmonix-regal-gold font-semibold">Early Bird Special</span>
                <Sparkles className="w-5 h-5 text-harmonix-regal-gold" />
              </div>
              <p className="text-white text-sm">
                First 280 customers receive <strong>30% off setup fees</strong>. Limited time offer.
              </p>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 pt-8">
            <Label htmlFor="billing-toggle" className="text-harmonix-sage-fade">Monthly</Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-harmonix-regal-gold"
            />
            <Label htmlFor="billing-toggle" className="text-harmonix-sage-fade">
              Annual <Badge variant="secondary" className="ml-2 bg-harmonix-regal-gold/20 text-harmonix-regal-gold">Save 15%</Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            const monthlyRate = isAnnual ? tier.mrrMin * 0.85 : tier.mrrMin;
            const monthlyRateMax = isAnnual ? tier.mrrMax * 0.85 : tier.mrrMax;

            return (
              <Card 
                key={tier.id} 
                className={`relative card-hover border-2 transition-all duration-300 ${
                  tier.popular 
                    ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/5 scale-105' 
                    : 'border-harmonix-cedar-mist hover:border-harmonix-sage-fade'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-harmonix-regal-gold text-harmonix-deep-forest px-4 py-1 text-sm font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-6 pt-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-xl ${
                      tier.popular ? 'bg-harmonix-regal-gold/20' : 'bg-harmonix-cedar-mist/20'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        tier.popular ? 'text-harmonix-regal-gold' : 'text-harmonix-sage-fade'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white font-bold">{tier.name}</CardTitle>
                      <p className="text-harmonix-sage-fade text-sm mt-1">{tier.agentsIncluded} AI Agent{tier.agentsIncluded > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <CardDescription className="text-harmonix-sage-fade leading-relaxed text-base">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm text-harmonix-sage-fade">Setup Fee:</span>
                      </div>
                      {showEarlyBird && !tier.enterprise ? (
                        <div className="space-y-1">
                          <div className="text-lg text-harmonix-sage-fade line-through">
                            {formatPrice(tier.setupMin, tier.setupMax)}
                          </div>
                          <div className="text-2xl font-bold text-harmonix-regal-gold">
                            {getDiscountedPrice(tier.setupMin, tier.setupMax)}
                          </div>
                          <div className="text-xs text-harmonix-regal-gold">30% Early Bird Discount</div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-white">
                          {tier.enterprise ? "Custom Quote" : formatPrice(tier.setupMin, tier.setupMax)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm text-harmonix-sage-fade">Monthly:</span>
                        {isAnnual && <Badge variant="outline" className="text-xs">-15%</Badge>}
                      </div>
                      <div className="text-xl font-semibold text-white">
                        {tier.enterprise ? "Starting at $8,000" : `$${Math.round(monthlyRate).toLocaleString()} - $${Math.round(monthlyRateMax).toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">What's included:</h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="w-4 h-4 text-harmonix-regal-gold mt-1 flex-shrink-0" />
                          <span className="text-harmonix-sage-fade text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Button 
                      className={`w-full py-3 font-semibold transition-all duration-300 ${
                        tier.popular
                          ? 'bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest'
                          : 'bg-harmonix-cedar-mist hover:bg-harmonix-sage-fade text-white'
                      }`}
                      size="lg"
                    >
                      {tier.enterprise ? "Contact Sales" : "Get Started"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ROI Calculator CTA */}
        <div className="mt-20 text-center">
          <div className="bg-harmonix-cedar-mist/20 border border-harmonix-cedar-mist rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Calculate Your ROI
            </h3>
            <p className="text-harmonix-sage-fade mb-6 leading-relaxed">
              See how much time and money you'll save with AI automation. 
              Our interactive calculator shows personalized results based on your business metrics.
            </p>
            <Button 
              size="lg" 
              className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold px-8"
            >
              Try ROI Calculator
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}