import React, { useState } from "react";
import { useLocation } from "wouter";
import { AdvancedOnboardingWizard } from "@/components/onboarding/advanced-onboarding-wizard";
import { OnboardingCompletion } from "@/components/onboarding/onboarding-completion";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [onboardingData, setOnboardingData] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleOnboardingComplete = async (data: any) => {
    setOnboardingData(data);
    
    try {
      // Save onboarding data to backend
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('harmonix_token')}`
        },
        body: JSON.stringify({
          userId: user?.id,
          onboardingData: data,
          completedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setShowCompletion(true);
      } else {
        throw new Error('Failed to save onboarding data');
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSkipOnboarding = () => {
    toast({
      title: "Onboarding Skipped",
      description: "You can complete setup anytime from your dashboard.",
    });
    setLocation('/dashboard');
  };

  const handleContinueToDashboard = () => {
    toast({
      title: "Welcome to Harmonix!",
      description: "Your AI automation journey begins now.",
    });
    setLocation('/dashboard');
  };

  if (showCompletion && onboardingData) {
    return (
      <OnboardingCompletion
        onboardingData={onboardingData}
        onContinueToDashboard={handleContinueToDashboard}
      />
    );
  }

  return (
    <AdvancedOnboardingWizard
      onComplete={handleOnboardingComplete}
      onSkip={handleSkipOnboarding}
    />
  );
}