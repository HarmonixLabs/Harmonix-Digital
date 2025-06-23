import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, TrendingUp, Clock } from "lucide-react";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredButton } from "@/components/ui/sacred-button";

interface PricingCalculatorProps {
  onClose: () => void;
  onScheduleConsultation: () => void;
}

export function PricingCalculator({ onClose, onScheduleConsultation }: PricingCalculatorProps) {
  const [companySize, setCompanySize] = useState('21-50');
  const [industry, setIndustry] = useState('technology');
  const [agentCount, setAgentCount] = useState([3]);
  const [complexity, setComplexity] = useState('standard');
  const [timeline, setTimeline] = useState('3-months');
  const [currentRevenue, setCurrentRevenue] = useState('');

  const calculatePricing = () => {
    const agents = agentCount[0];
    
    // Base pricing tiers
    const tiers = {
      starter: { base: 4400, perAgent: 500, setup: 1000 },
      growth: { base: 8000, perAgent: 800, setup: 1500 },
      expansion: { base: 15000, perAgent: 1200, setup: 2000 },
      enterprise: { base: 21500, perAgent: 1500, setup: 3000 }
    };

    // Determine tier based on agent count
    let tier = 'starter';
    if (agents >= 10) tier = 'enterprise';
    else if (agents >= 6) tier = 'expansion';
    else if (agents >= 3) tier = 'growth';

    // Complexity multipliers
    const complexityMultipliers = {
      basic: 0.8,
      standard: 1.0,
      advanced: 1.3,
      enterprise: 1.6
    };

    const selectedTier = tiers[tier];
    const basePrice = selectedTier.base + (selectedTier.perAgent * Math.max(0, agents - 1));
    const complexityPrice = basePrice * complexityMultipliers[complexity];
    const totalPrice = complexityPrice + selectedTier.setup;

    // Early bird discount
    const discountedPrice = totalPrice * 0.7;
    const savings = totalPrice - discountedPrice;

    // Monthly costs
    const monthlyMaintenance = Math.round(totalPrice * 0.08);
    const financingMonthly = Math.round(discountedPrice / 24); // 24 months

    return {
      tier,
      totalPrice,
      discountedPrice,
      savings,
      monthlyMaintenance,
      financingMonthly,
      agents
    };
  };

  const calculateROI = () => {
    const revenue = parseFloat(currentRevenue.replace(/[,$]/g, '')) || 0;
    if (revenue === 0) return null;

    const pricing = calculatePricing();
    
    // Conservative ROI estimates
    const efficiencyGain = 0.25; // 25% efficiency improvement
    const timeValuePerYear = revenue * efficiencyGain;
    const paybackMonths = (pricing.discountedPrice / (timeValuePerYear / 12));
    const yearOneROI = ((timeValuePerYear - pricing.discountedPrice) / pricing.discountedPrice) * 100;

    return {
      timeValuePerYear,
      paybackMonths,
      yearOneROI
    };
  };

  const pricing = calculatePricing();
  const roi = calculateROI();

  return (
    <SacredCard className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="harmonix-header-font text-xl text-white flex items-center">
          <Calculator className="h-5 w-5 text-harmonix-gold mr-2" />
          AI Investment Calculator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="harmonix-header-font text-lg text-white">Your Requirements</h3>
            
            <div>
              <Label className="text-harmonix-sage">Company Size</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="200+">200+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-harmonix-sage">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="e-commerce">E-commerce</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-harmonix-sage">Number of AI Agents: {agentCount[0]}</Label>
              <Slider
                value={agentCount}
                onValueChange={setAgentCount}
                max={15}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-harmonix-sage">Complexity Level</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic - Simple automation</SelectItem>
                  <SelectItem value="standard">Standard - Multi-step workflows</SelectItem>
                  <SelectItem value="advanced">Advanced - Complex integrations</SelectItem>
                  <SelectItem value="enterprise">Enterprise - Custom development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-harmonix-sage">Annual Revenue (Optional)</Label>
              <Input
                value={currentRevenue}
                onChange={(e) => setCurrentRevenue(e.target.value)}
                placeholder="$1,000,000"
                className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="harmonix-header-font text-lg text-white">Investment Summary</h3>
            
            <div className="space-y-4">
              <div className="bg-harmonix-pine/20 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-harmonix-sage">Recommended Tier</span>
                  <Badge variant="outline" className="text-harmonix-gold border-harmonix-gold">
                    {pricing.tier.charAt(0).toUpperCase() + pricing.tier.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-harmonix-sage">
                  Perfect for {pricing.agents} agent{pricing.agents > 1 ? 's' : ''} • {complexity} complexity
                </div>
              </div>

              <div className="bg-harmonix-pine/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-harmonix-gold" />
                  <span className="text-harmonix-sage">Total Investment</span>
                </div>
                <div className="text-2xl harmonix-header-font text-white">
                  ${pricing.discountedPrice.toLocaleString()}
                </div>
                <div className="text-sm text-harmonix-sage line-through">
                  ${pricing.totalPrice.toLocaleString()}
                </div>
                <div className="text-sm text-harmonix-gold">
                  Save ${pricing.savings.toLocaleString()} with early bird pricing
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-harmonix-pine/20 p-3 rounded-lg">
                  <div className="text-harmonix-sage text-sm">Monthly Maintenance</div>
                  <div className="text-harmonix-gold font-semibold">
                    ${pricing.monthlyMaintenance.toLocaleString()}
                  </div>
                </div>
                <div className="bg-harmonix-pine/20 p-3 rounded-lg">
                  <div className="text-harmonix-sage text-sm">Financing Option</div>
                  <div className="text-harmonix-gold font-semibold">
                    ${pricing.financingMonthly.toLocaleString()}/mo
                  </div>
                </div>
              </div>

              {roi && (
                <div className="bg-gradient-to-r from-harmonix-gold/10 to-harmonix-sage/10 p-4 rounded-lg border border-harmonix-gold/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-harmonix-gold" />
                    <span className="text-harmonix-gold font-semibold">ROI Projection</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-harmonix-sage">Payback Period</div>
                      <div className="text-white">{roi.paybackMonths.toFixed(1)} months</div>
                    </div>
                    <div>
                      <div className="text-harmonix-sage">Year 1 ROI</div>
                      <div className="text-harmonix-gold">{roi.yearOneROI.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-harmonix-sage/20">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-harmonix-sage hover:text-white"
          >
            Close Calculator
          </Button>
          <div className="flex space-x-3">
            <SacredButton
              variant="outline"
              className="border-harmonix-sage/30 text-harmonix-sage hover:border-harmonix-gold hover:text-harmonix-gold"
            >
              Download Quote
            </SacredButton>
            <SacredButton
              onClick={onScheduleConsultation}
              className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
            >
              Schedule Consultation
            </SacredButton>
          </div>
        </div>
      </CardContent>
    </SacredCard>
  );
}