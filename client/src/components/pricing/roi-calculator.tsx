import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Clock, DollarSign, Users } from "lucide-react";

interface ROIInputs {
  industry: string;
  teamSize: number;
  avgHourlyWage: number;
  leadsPerMonth: number;
  costPerLead: number;
  hoursSpentOnTasks: number;
}

interface ROIResults {
  monthlySavings: number;
  annualSavings: number;
  timeRecovered: number;
  paybackPeriod: number;
  roiPercentage: number;
}

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    industry: "",
    teamSize: 5,
    avgHourlyWage: 50,
    leadsPerMonth: 100,
    costPerLead: 25,
    hoursSpentOnTasks: 40
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [selectedTier, setSelectedTier] = useState("growth");

  const tierPricing = {
    starter: { setup: 5300, monthly: 1000, agents: 1 },
    growth: { setup: 10250, monthly: 3800, agents: 3 },
    expansion: { setup: 24750, monthly: 6350, agents: 6 },
    enterprise: { setup: 50000, monthly: 10000, agents: 12 }
  };

  const calculateROI = () => {
    const { teamSize, avgHourlyWage, leadsPerMonth, costPerLead, hoursSpentOnTasks } = inputs;
    const tier = tierPricing[selectedTier as keyof typeof tierPricing];
    
    // Calculate automation efficiency based on number of agents
    const automationEfficiency = Math.min(0.8, 0.2 + (tier.agents * 0.1)); // 20% base + 10% per agent, max 80%
    
    // Time savings calculation
    const hoursAutomated = hoursSpentOnTasks * automationEfficiency;
    const timeRecovered = hoursAutomated * 4; // monthly hours
    const laborSavings = timeRecovered * avgHourlyWage;
    
    // Lead generation improvements
    const improvedLeadConversion = leadsPerMonth * 0.3; // 30% improvement in lead conversion
    const leadCostSavings = improvedLeadConversion * costPerLead;
    
    // Total monthly savings
    const monthlySavings = laborSavings + leadCostSavings;
    const annualSavings = monthlySavings * 12;
    
    // ROI calculations
    const totalFirstYearCost = tier.setup + (tier.monthly * 12);
    const netBenefit = annualSavings - totalFirstYearCost;
    const roiPercentage = (netBenefit / totalFirstYearCost) * 100;
    const paybackPeriod = tier.setup / monthlySavings;

    setResults({
      monthlySavings,
      annualSavings,
      timeRecovered,
      paybackPeriod,
      roiPercentage
    });
  };

  const handleInputChange = (field: keyof ROIInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calculator className="w-8 h-8 text-harmonix-regal-gold" />
            <h2 className="text-4xl font-bold text-white">ROI Calculator</h2>
          </div>
          <p className="text-xl text-harmonix-sage-fade max-w-3xl mx-auto">
            Calculate your potential return on investment with Harmonix AI automation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="card-hover border-harmonix-cedar-mist">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-white flex items-center space-x-2">
                <Users className="w-6 h-6 text-harmonix-regal-gold" />
                <span>Business Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry" className="text-harmonix-sage-fade mb-2 block">Industry</Label>
                  <Select value={inputs.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS / Technology</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="realestate">Real Estate</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teamSize" className="text-harmonix-sage-fade mb-2 block">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={inputs.teamSize}
                      onChange={(e) => handleInputChange('teamSize', e.target.value)}
                      className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgHourlyWage" className="text-harmonix-sage-fade mb-2 block">Avg Hourly Wage ($)</Label>
                    <Input
                      id="avgHourlyWage"
                      type="number"
                      value={inputs.avgHourlyWage}
                      onChange={(e) => handleInputChange('avgHourlyWage', e.target.value)}
                      className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leadsPerMonth" className="text-harmonix-sage-fade mb-2 block">Leads/Month</Label>
                    <Input
                      id="leadsPerMonth"
                      type="number"
                      value={inputs.leadsPerMonth}
                      onChange={(e) => handleInputChange('leadsPerMonth', e.target.value)}
                      className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="costPerLead" className="text-harmonix-sage-fade mb-2 block">Cost/Lead ($)</Label>
                    <Input
                      id="costPerLead"
                      type="number"
                      value={inputs.costPerLead}
                      onChange={(e) => handleInputChange('costPerLead', e.target.value)}
                      className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hoursSpentOnTasks" className="text-harmonix-sage-fade mb-2 block">Hours/Week on Manual Tasks</Label>
                  <Input
                    id="hoursSpentOnTasks"
                    type="number"
                    value={inputs.hoursSpentOnTasks}
                    onChange={(e) => handleInputChange('hoursSpentOnTasks', e.target.value)}
                    className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="tier" className="text-harmonix-sage-fade mb-2 block">Harmonix Tier</Label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter (1 Agent)</SelectItem>
                      <SelectItem value="growth">Growth (3 Agents)</SelectItem>
                      <SelectItem value="expansion">Expansion (6 Agents)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (12+ Agents)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={calculateROI}
                className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold py-3"
                size="lg"
              >
                Calculate ROI
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="card-hover border-harmonix-cedar-mist">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-white flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-harmonix-regal-gold" />
                <span>ROI Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-harmonix-cedar-mist/20 rounded-xl p-4 text-center">
                      <DollarSign className="w-8 h-8 text-harmonix-regal-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-harmonix-regal-gold">
                        ${results.monthlySavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-harmonix-sage-fade">Monthly Savings</div>
                    </div>
                    <div className="bg-harmonix-cedar-mist/20 rounded-xl p-4 text-center">
                      <Clock className="w-8 h-8 text-harmonix-regal-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-harmonix-regal-gold">
                        {Math.round(results.timeRecovered)}h
                      </div>
                      <div className="text-sm text-harmonix-sage-fade">Hours Recovered</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-harmonix-cedar-mist/30">
                      <span className="text-harmonix-sage-fade">Annual Savings</span>
                      <span className="text-xl font-bold text-white">${results.annualSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-harmonix-cedar-mist/30">
                      <span className="text-harmonix-sage-fade">Payback Period</span>
                      <span className="text-xl font-bold text-white">{results.paybackPeriod.toFixed(1)} months</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-harmonix-sage-fade">ROI (Year 1)</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-harmonix-regal-gold">
                          {results.roiPercentage.toFixed(0)}%
                        </span>
                        {results.roiPercentage > 100 && (
                          <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
                            Excellent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-xl p-4">
                    <h4 className="font-semibold text-harmonix-regal-gold mb-2">Investment Summary</h4>
                    <div className="text-sm text-harmonix-sage-fade space-y-1">
                      <div>Setup: ${tierPricing[selectedTier as keyof typeof tierPricing].setup.toLocaleString()}</div>
                      <div>Monthly: ${tierPricing[selectedTier as keyof typeof tierPricing].monthly.toLocaleString()}</div>
                      <div>Total Year 1: ${(tierPricing[selectedTier as keyof typeof tierPricing].setup + (tierPricing[selectedTier as keyof typeof tierPricing].monthly * 12)).toLocaleString()}</div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold"
                    size="lg"
                  >
                    Get Started with {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-harmonix-sage-fade mx-auto mb-4 opacity-50" />
                  <p className="text-harmonix-sage-fade">
                    Enter your business metrics to see your potential ROI
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}