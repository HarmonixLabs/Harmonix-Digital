import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

export interface OnboardingState {
  isFirstLogin: boolean;
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  userProfile: {
    industry: string;
    role: string;
    goals: string[];
    experience: string;
    teamSize: string;
  };
}

export function useOnboarding() {
  const { user, isAuthenticated } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isFirstLogin: false,
    hasCompletedOnboarding: false,
    onboardingStep: 0,
    userProfile: {
      industry: '',
      role: '',
      goals: [],
      experience: '',
      teamSize: ''
    }
  });

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user needs onboarding  
      const userId = (user as any)?.id || 'anonymous';
      const hasOnboardingData = localStorage.getItem(`onboarding_${userId}`);
      const isFirstLogin = !hasOnboardingData;
      
      if (isFirstLogin) {
        setOnboardingState(prev => ({
          ...prev,
          isFirstLogin: true,
          hasCompletedOnboarding: false
        }));
        setShowOnboarding(true);
      } else {
        const savedData = JSON.parse(hasOnboardingData);
        setOnboardingState(prev => ({
          ...prev,
          ...savedData,
          hasCompletedOnboarding: true
        }));
      }
    }
  }, [isAuthenticated, user]);

  const updateOnboardingStep = (step: number) => {
    setOnboardingState(prev => ({
      ...prev,
      onboardingStep: step
    }));
  };

  const updateUserProfile = (profile: Partial<OnboardingState['userProfile']>) => {
    setOnboardingState(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...profile
      }
    }));
  };

  const completeOnboarding = () => {
    const completedState = {
      ...onboardingState,
      hasCompletedOnboarding: true,
      isFirstLogin: false
    };
    
    setOnboardingState(completedState);
    
    // Save to localStorage
    if (user) {
      const userId = (user as any)?.id || 'anonymous';
      localStorage.setItem(`onboarding_${userId}`, JSON.stringify(completedState));
    }
    
    setShowOnboarding(false);
  };

  const triggerOnboarding = () => {
    setShowOnboarding(true);
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    onboardingState,
    showOnboarding,
    updateOnboardingStep,
    updateUserProfile,
    completeOnboarding,
    triggerOnboarding,
    dismissOnboarding
  };
}