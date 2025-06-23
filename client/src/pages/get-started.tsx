import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, Users, Building, Zap, Star } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 4400,
    originalPrice: 6200,
    description: "Perfect for small businesses getting started with AI automation",
    agents: 2,
    features: [
      "2 AI Agents (Sales + Concierge)",
      "Basic CRM integration",
      "Email & chat support",
      "Standard automation templates",
      "30-day onboarding support"
    ],
    recommended: false,
    badge: "Most Popular"
  },
  {
    id: "growth",
    name: "Growth", 
    price: 8000,
    originalPrice: 12500,
    description: "For growing businesses ready to scale operations",
    agents: 5,
    features: [
      "5 AI Agents (choose from 12+)",
      "Advanced CRM & integrations",
      "Priority support & training",
      "Custom automation workflows",
      "90-day strategic consultation",
      "Performance analytics dashboard"
    ],
    recommended: true,
    badge: "Best Value"
  },
  {
    id: "expansion",
    name: "Expansion",
    price: 15000,
    originalPrice: 18000,
    description: "Comprehensive solution for established businesses",
    agents: 8,
    features: [
      "8 AI Agents + custom development",
      "Full platform integration",
      "Dedicated success manager",
      "Custom agent development",
      "Advanced analytics & reporting",
      "White-label options available"
    ],
    recommended: false,
    badge: "Enterprise Ready"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 21500,
    originalPrice: null,
    description: "Tailored solutions for large organizations",
    agents: "Unlimited",
    features: [
      "Unlimited agents & customization",
      "Enterprise security & compliance",
      "24/7 dedicated support team",
      "Custom integrations & APIs",
      "On-premise deployment options",
      "Strategic business consultation"
    ],
    recommended: false,
    badge: "Custom Quote"
  }
];

const setupSteps = [
  {
    step: 1,
    title: "Choose Your Plan",
    description: "Select the plan that matches your business needs and growth goals",
    icon: Star,
    duration: "2 minutes"
  },
  {
    step: 2,
    title: "Complete Setup Wizard",
    description: "Answer a few questions to customize your AI agents for your industry",
    icon: Zap,
    duration: "10 minutes"
  },
  {
    step: 3,
    title: "Agent Deployment",
    description: "Our team deploys and configures your chosen agents with your systems",
    icon: Building,
    duration: "24-48 hours"
  },
  {
    step: 4,
    title: "Training & Launch",
    description: "Get trained on your new agents and start seeing results immediately",
    icon: Users,
    duration: "1 week"
  }
];

export default function GetStarted() {
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [currentStep, setCurrentStep] = useState(1);

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep(2);
  };

  const handleStartWizard = () => {
    window.location.href = '/onboarding';
  };

  const handleCheckout = () => {
    window.location.href = `/checkout?plan=${selectedPlan}`;
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6">
                Get Started Today
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                Choose Your Plan &
                <span className="text-harmonix-regal-gold block">Start Building</span>
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Select the perfect plan for your business and launch your AI agent team in under 48 hours
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-harmonix-sage-fade">
                  Step {currentStep} of 4
                </span>
                <span className="text-sm font-medium text-harmonix-sage-fade">
                  {Math.round((currentStep / 4) * 100)}% Complete
                </span>
              </div>
              <Progress value={(currentStep / 4) * 100} className="h-2" />
            </div>
          </div>
        </section>

        {/* Plan Selection */}
        <section className="py-16">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-harmonix-regal-gold font-serif">
                Select Your Perfect Plan
              </h2>
              <p className="text-lg text-harmonix-sage-fade max-w-3xl mx-auto">
                All plans include 30% early bird discount, 90-day money-back guarantee, and full setup support
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.id 
                      ? "ring-2 ring-harmonix-regal-gold bg-harmonix-regal-gold/5" 
                      : "hover:border-harmonix-regal-gold/50"
                  } ${plan.recommended ? "border-harmonix-regal-gold/50" : ""}`}
                  onClick={() => handlePlanSelection(plan.id)}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-harmonix-regal-gold text-harmonix-deep-forest px-4 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold text-harmonix-regal-gold">
                          ${plan.price.toLocaleString()}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-lg text-harmonix-sage-fade line-through">
                            ${plan.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-harmonix-sage-fade">
                        One-time setup fee
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-harmonix-sage-fade text-center">
                      {plan.description}
                    </p>
                    
                    <div className="text-center py-3 bg-harmonix-night-pine/30 rounded-lg">
                      <span className="text-lg font-bold text-harmonix-regal-gold">
                        {typeof plan.agents === 'number' ? `${plan.agents} AI Agents` : plan.agents}
                      </span>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-harmonix-regal-gold mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-harmonix-sage-fade">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full touch-friendly-btn ${
                        selectedPlan === plan.id
                          ? "bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                          : "bg-harmonix-night-pine border border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
                      }`}
                      onClick={() => handlePlanSelection(plan.id)}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Setup Process */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white text-center mb-8 font-serif">
                Your Setup Process
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {setupSteps.map((step) => (
                  <Card key={step.step} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-harmonix-regal-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-6 h-6 text-harmonix-regal-gold" />
                      </div>
                      <h4 className="font-semibold text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-sm text-harmonix-sage-fade mb-3">
                        {step.description}
                      </p>
                      <Badge variant="outline" className="text-xs border-harmonix-sage-fade/30 text-harmonix-sage-fade">
                        {step.duration}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                    onClick={handleStartWizard}
                  >
                    Start Setup Wizard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                    onClick={handleCheckout}
                  >
                    Skip to Checkout
                  </Button>
                </div>
                
                <p className="text-sm text-harmonix-sage-fade">
                  Questions? <a href="/faq" className="text-harmonix-regal-gold hover:underline">View FAQ</a> or 
                  <a href="/demo" className="text-harmonix-regal-gold hover:underline ml-1">try a demo first</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}