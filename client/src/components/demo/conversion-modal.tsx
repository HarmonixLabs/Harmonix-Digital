import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Crown, 
  Users, 
  Rocket, 
  CheckCircle, 
  ArrowRight, 
  DollarSign,
  Clock,
  Star,
  Zap,
  Target,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: any;
  actionPlan?: any;
  context?: string;
}

export function ConversionModal({ isOpen, onClose, agent, actionPlan, context }: ConversionModalProps) {
  const [selectedOption, setSelectedOption] = useState<'waitlist' | 'deposit' | 'package'>('deposit');
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    phone: '',
    timeline: '',
    budget: ''
  });

  if (!isOpen) return null;

  const conversionOptions = {
    waitlist: {
      title: "Join Waitlist (Free)",
      subtitle: "Get early access when we launch",
      price: "Free",
      benefits: [
        "Priority access to platform",
        "Exclusive launch pricing",
        "Direct founder access",
        "Weekly progress updates"
      ],
      cta: "Reserve Free Spot",
      icon: Users,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    deposit: {
      title: "VIP Priority Access",
      subtitle: "Skip the line with priority installation",
      price: "$444 Deposit",
      benefits: [
        "Immediate priority queue placement",
        "Personal onboarding call",
        "Custom strategy session",
        "Deposit applies to final package"
      ],
      cta: "Secure VIP Access",
      icon: Crown,
      color: "bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
    },
    package: {
      title: "Full Implementation",
      subtitle: "Complete setup + 90-day support",
      price: "Starting at $4,400",
      benefits: [
        "Complete agent deployment",
        "Full system integration",
        "90-day optimization period",
        "Dedicated success manager"
      ],
      cta: "View Package Options",
      icon: Rocket,
      color: "bg-green-600 hover:bg-green-700"
    }
  };

  const currentOption = conversionOptions[selectedOption];

  const handleSubmit = () => {
    const params = new URLSearchParams({
      type: selectedOption,
      agent: agent.id,
      email: formData.email,
      company: formData.company,
      phone: formData.phone,
      context: context || '',
      plan: actionPlan ? JSON.stringify(actionPlan) : ''
    });

    if (selectedOption === 'waitlist') {
      window.location.href = `/join?${params.toString()}`;
    } else if (selectedOption === 'deposit') {
      window.location.href = `/join?deposit=444&${params.toString()}`;
    } else {
      window.location.href = `/pricing?${params.toString()}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-harmonix-night border-harmonix-sage/20 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-harmonix-regal-gold/30 flex items-center justify-center">
                {React.createElement(agent.icon, { className: "w-6 h-6 text-harmonix-regal-gold" })}
              </div>
              <div>
                <CardTitle className="text-harmonix-regal-gold text-xl">
                  Ready to Deploy {agent.name}?
                </CardTitle>
                <p className="text-harmonix-sage-fade text-sm">
                  Choose how you'd like to proceed with your AI strategy
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-harmonix-sage-fade hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Conversion Options */}
          <div className="grid gap-4">
            {(Object.keys(conversionOptions) as Array<keyof typeof conversionOptions>).map((key) => {
              const option = conversionOptions[key];
              return (
                <div
                  key={key}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedOption === key
                      ? "border-harmonix-regal-gold bg-harmonix-regal-gold/10"
                      : "border-harmonix-sage/30 bg-harmonix-night-pine/30 hover:border-harmonix-sage/50"
                  )}
                  onClick={() => setSelectedOption(key)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedOption === key ? "bg-harmonix-regal-gold" : "bg-harmonix-sage/20"
                      )}>
                        {React.createElement(option.icon, { 
                          className: cn(
                            "w-5 h-5",
                            selectedOption === key ? "text-harmonix-deep-forest" : "text-harmonix-regal-gold"
                          )
                        })}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">{option.title}</h3>
                        <p className="text-harmonix-sage-fade text-sm mb-2">{option.subtitle}</p>
                        <div className="text-2xl font-bold text-harmonix-regal-gold mb-3">
                          {option.price}
                        </div>
                        <ul className="space-y-1">
                          {option.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-harmonix-sage-fade">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {selectedOption === key && (
                      <CheckCircle className="w-6 h-6 text-harmonix-regal-gold" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-harmonix-regal-gold">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-harmonix-sage-fade mb-2 block">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="bg-harmonix-night-pine/30 border-harmonix-sage/30 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-harmonix-sage-fade mb-2 block">
                  Company Name
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your Company"
                  className="bg-harmonix-night-pine/30 border-harmonix-sage/30 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-harmonix-sage-fade mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="bg-harmonix-night-pine/30 border-harmonix-sage/30 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-harmonix-sage-fade mb-2 block">
                  Implementation Timeline
                </label>
                <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
                  <SelectTrigger className="bg-harmonix-night-pine/30 border-harmonix-sage/30 text-white">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                    <SelectItem value="month">Within a month</SelectItem>
                    <SelectItem value="quarter">Next quarter</SelectItem>
                    <SelectItem value="planning">Still planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedOption === 'package' && (
              <div>
                <label className="text-sm font-medium text-harmonix-sage-fade mb-2 block">
                  Budget Range
                </label>
                <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger className="bg-harmonix-night-pine/30 border-harmonix-sage/30 text-white">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">$4.4K - $8K (Starter)</SelectItem>
                    <SelectItem value="growth">$8K - $15K (Growth)</SelectItem>
                    <SelectItem value="expansion">$15K - $25K (Expansion)</SelectItem>
                    <SelectItem value="enterprise">$25K+ (Enterprise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Strategy Summary */}
          {actionPlan && (
            <div className="bg-harmonix-night-pine/30 rounded-lg p-4">
              <h3 className="font-semibold text-harmonix-regal-gold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Custom Strategy Summary
              </h3>
              <div className="space-y-2 text-sm text-harmonix-sage-fade">
                <div>
                  <span className="font-medium">Immediate Actions:</span> {actionPlan.immediate?.length || 0} tasks
                </div>
                <div>
                  <span className="font-medium">30-Day Plan:</span> {actionPlan.shortTerm?.length || 0} strategic initiatives
                </div>
                <div>
                  <span className="font-medium">Long-term Vision:</span> {actionPlan.longTerm?.length || 0} optimization goals
                </div>
              </div>
            </div>
          )}

          {/* Special Offers */}
          <div className="bg-gradient-to-r from-harmonix-regal-gold/10 to-harmonix-sage/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-harmonix-regal-gold" />
              <span className="font-semibold text-harmonix-regal-gold">Limited Time Offers</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-harmonix-sage-fade">30% Early Adopter Discount (First 280 customers)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-harmonix-sage-fade">90-Day Performance Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-harmonix-sage-fade">Priority implementation queue</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!formData.email}
              className={cn(
                "flex-1 min-h-[48px] font-semibold",
                currentOption.color
              )}
            >
              {React.createElement(currentOption.icon, { className: "w-5 h-5 mr-2" })}
              {currentOption.cta}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-harmonix-sage/30 text-harmonix-sage-fade hover:bg-harmonix-sage/10"
            >
              Not Ready Yet
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs text-harmonix-sage-fade">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No Commitment</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Founder Support</span>
              </div>
            </div>
            <p className="text-xs text-harmonix-sage-fade/70">
              Join 500+ businesses already transforming their operations with AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}