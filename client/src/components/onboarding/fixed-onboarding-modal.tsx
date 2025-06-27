import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Play, Sparkles, CheckCircle, ArrowRight, Gift } from "lucide-react";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredButton } from "@/components/ui/sacred-button";
import { FadeIn } from "@/components/ui/micro-animations";
import { ContextualAIWizard } from "./contextual-ai-wizard";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSetup: () => void;
  onStartTour: () => void;
  onSkip: () => void;
  userState: 'new_signup' | 'returning_incomplete' | 'manual_trigger' | 'complete';
}

export function OnboardingModal({
  isOpen,
  onClose,
  onStartSetup,
  onStartTour,
  onSkip,
  userState
}: OnboardingModalProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showWizard, setShowWizard] = useState(false);
  const [showIncentive, setShowIncentive] = useState(false);

  useEffect(() => {
    // Show incentive for new signups
    if (userState === 'new_signup') {
      setShowIncentive(true);
    }
  }, [userState]);

  const handleStartSetup = () => {
    setShowWizard(true);
    trackEvent('wizard_started');
  };

  const handleStartTour = () => {
    onStartTour();
    trackEvent('tour_started');
    onClose();
  };

  const handleSkip = () => {
    trackEvent('wizard_skipped');
    
    // Smart routing based on user state
    if (user) {
      setLocation('/dashboard');
    } else {
      setLocation('/waitlist');
    }
    onSkip();
    onClose();
  };

  const handleWizardComplete = (data: any) => {
    trackEvent('wizard_completed');
    setShowWizard(false);
    onClose();
    
    // Route to dashboard or success page
    setLocation('/dashboard');
  };

  const trackEvent = (eventName: string) => {
    // Track onboarding events for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'onboarding',
        event_label: userState
      });
    }
  };

  const getModalTitle = () => {
    switch (userState) {
      case 'new_signup':
        return `Welcome to Harmonix, ${user?.name?.split(' ')[0] || 'there'}!`;
      case 'returning_incomplete':
        return 'Complete Your Setup';
      case 'manual_trigger':
        return 'Setup Wizard';
      default:
        return 'Welcome to Harmonix';
    }
  };

  const getModalDescription = () => {
    switch (userState) {
      case 'new_signup':
        return 'Let\'s get you set up with AI automation in just a few minutes.';
      case 'returning_incomplete':
        return 'You\'re just a few steps away from unlocking the full power of AI automation.';
      case 'manual_trigger':
        return 'Configure your AI agents and workflows for optimal performance.';
      default:
        return 'Get started with intelligent automation.';
    }
  };

  if (showWizard) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none">
          <ContextualAIWizard onComplete={handleWizardComplete} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-harmonix-black/95 backdrop-blur-sm border-harmonix-gold/30">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-2 -right-2 text-harmonix-sage hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="harmonix-header-font text-2xl text-white text-center">
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <FadeIn delay={0.2}>
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-harmonix-gold mx-auto mb-4" />
              <p className="text-harmonix-sage text-lg mb-4">
                {getModalDescription()}
              </p>
              
              {showIncentive && (
                <div className="bg-gradient-to-r from-harmonix-gold/10 to-harmonix-sage/10 border border-harmonix-gold/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Gift className="h-5 w-5 text-harmonix-gold" />
                    <span className="text-harmonix-gold font-semibold">Limited Time Offer</span>
                  </div>
                  <p className="text-white text-sm">
                    Complete setup today and get <strong>20% off</strong> your first agent deployment!
                  </p>
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="grid gap-4">
              <SacredCard className="p-4 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="harmonix-header-font text-lg text-white mb-1">
                      Start Setup Wizard
                    </h3>
                    <p className="text-harmonix-sage text-sm">
                      Personalized 6-step configuration (5-10 minutes)
                    </p>
                  </div>
                  <SacredButton
                    onClick={handleStartSetup}
                    className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </SacredButton>
                </div>
              </SacredCard>

              <SacredCard className="p-4 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="harmonix-header-font text-lg text-white mb-1">
                      Take Quick Tour
                    </h3>
                    <p className="text-harmonix-sage text-sm">
                      Interactive walkthrough of key features (3 minutes)
                    </p>
                  </div>
                  <SacredButton
                    variant="outline"
                    onClick={handleStartTour}
                    className="border-harmonix-sage/30 text-harmonix-sage hover:border-harmonix-gold hover:text-harmonix-gold"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Tour
                  </SacredButton>
                </div>
              </SacredCard>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex justify-center pt-4">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-harmonix-sage hover:text-white text-sm"
              >
                Skip for now - I'll explore on my own
              </Button>
            </div>
          </FadeIn>

          {userState === 'returning_incomplete' && (
            <FadeIn delay={0.5}>
              <div className="border-t border-harmonix-sage/20 pt-4">
                <div className="text-center">
                  <p className="text-harmonix-sage text-sm mb-2">Setup Progress</p>
                  <Progress value={35} className="h-2 bg-harmonix-pine/30" />
                  <p className="text-harmonix-sage text-xs mt-1">
                    Resume where you left off
                  </p>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}