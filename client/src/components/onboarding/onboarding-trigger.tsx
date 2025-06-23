import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { useLocation } from "wouter";
import { 
  Rocket, 
  ArrowRight, 
  CheckCircle, 
  Settings, 
  Target,
  Sparkles
} from "lucide-react";

interface OnboardingTriggerProps {
  onStart: () => void;
  className?: string;
}

export function OnboardingTrigger({ onStart, className = "" }: OnboardingTriggerProps) {
  const [, setLocation] = useLocation();

  const benefits = [
    {
      icon: Target,
      title: "Personalized Setup",
      description: "Configure AI agents based on your specific business needs"
    },
    {
      icon: Settings,
      title: "Smart Integrations",
      description: "Connect your existing tools for seamless automation"
    },
    {
      icon: Sparkles,
      title: "Optimized Performance",
      description: "Get recommendations for maximum ROI and efficiency"
    }
  ];

  return (
    <Card className={`harmonix-card-enhanced ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <HarmonixLogo size="md" variant="scenic" />
        </div>
        <CardTitle className="text-2xl text-white">
          Complete Your Platform Setup
        </CardTitle>
        <CardDescription className="text-harmonix-sage-fade">
          Unlock the full potential of your AI automation platform with our guided setup wizard
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Benefits */}
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-harmonix-regal-gold/20 flex items-center justify-center mt-0.5">
                <benefit.icon className="w-4 h-4 text-harmonix-regal-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{benefit.title}</h4>
                <p className="text-sm text-harmonix-sage-fade">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => setLocation('/onboarding')}
            className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold py-3"
            size="lg"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Start Setup Wizard
          </Button>
          
          <Button
            onClick={onStart}
            variant="outline"
            className="w-full border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade hover:text-harmonix-deep-forest"
            size="lg"
          >
            Quick Tour Instead
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            className="text-harmonix-sage-fade hover:text-white text-sm"
            onClick={() => {
              localStorage.setItem('harmonix_onboarding_skipped', 'true');
              window.location.reload();
            }}
          >
            Skip for now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}