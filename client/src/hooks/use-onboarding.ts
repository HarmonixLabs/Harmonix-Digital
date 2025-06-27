import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

interface OnboardingState {
  showModal: boolean;
  userState: 'new_signup' | 'returning_incomplete' | 'manual_trigger' | 'complete';
  setupProgress: number;
  lastSeenStep: number;
}

export function useOnboarding() {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    showModal: false,
    userState: 'new_signup',
    setupProgress: 0,
    lastSeenStep: 0
  });

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = () => {
    if (!user) return;

    // Check if user has completed onboarding
    const isOnboardingComplete = user.onboardingCompleted;
    const isNewUser = checkIfNewUser();
    const hasIncompleteSetup = checkIncompleteSetup();

    if (isOnboardingComplete) {
      setOnboardingState(prev => ({
        ...prev,
        userState: 'complete',
        showModal: false
      }));
      return;
    }

    if (isNewUser) {
      setOnboardingState(prev => ({
        ...prev,
        userState: 'new_signup',
        showModal: true,
        setupProgress: 0
      }));
      // Mark as seen to avoid showing again
      markNewUserSeen();
    } else if (hasIncompleteSetup) {
      setOnboardingState(prev => ({
        ...prev,
        userState: 'returning_incomplete',
        showModal: shouldShowReturnBanner(),
        setupProgress: calculateProgress()
      }));
    }
  };

  const checkIfNewUser = (): boolean => {
    if (!user) return false;
    
    // Check if user signed up in the last 5 minutes and hasn't seen onboarding
    const signupTime = new Date(user.createdAt).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    const isRecentSignup = (now - signupTime) < fiveMinutes;
    const hasSeenOnboarding = localStorage.getItem(`onboarding_seen_${user.id}`);
    
    return isRecentSignup && !hasSeenOnboarding && !user.onboardingCompleted;
  };

  const markNewUserSeen = () => {
    if (user) {
      localStorage.setItem(`onboarding_seen_${user.id}`, 'true');
    }
  };

  const checkIncompleteSetup = (): boolean => {
    if (!user) return false;
    
    // Check if user has started but not completed onboarding
    const hasStartedOnboarding = user.onboardingData !== null;
    const hasCompletedOnboarding = user.onboardingCompleted;
    
    return hasStartedOnboarding && !hasCompletedOnboarding;
  };

  const shouldShowReturnBanner = (): boolean => {
    if (!user) return false;
    
    // Don't show banner too frequently
    const lastShown = localStorage.getItem(`banner_shown_${user.id}`);
    if (lastShown) {
      const lastShownTime = new Date(lastShown).getTime();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      // Only show banner once per day
      return (now - lastShownTime) > oneDay;
    }
    
    return true;
  };

  const calculateProgress = (): number => {
    if (!user || !user.onboardingData) return 0;
    
    const data = user.onboardingData;
    let progress = 0;
    
    // Calculate progress based on completed steps
    if (data.role) progress += 20;
    if (data.company) progress += 20;
    if (data.industry) progress += 20;
    if (data.primaryGoals && data.primaryGoals.length > 0) progress += 20;
    if (data.experience) progress += 20;
    
    return progress;
  };

  const triggerOnboarding = (type: 'setup' | 'tour' = 'setup') => {
    setOnboardingState(prev => ({
      ...prev,
      userState: 'manual_trigger',
      showModal: true
    }));
  };

  const dismissModal = () => {
    setOnboardingState(prev => ({
      ...prev,
      showModal: false
    }));
    
    // Mark banner as shown to avoid frequent re-displays
    if (user) {
      localStorage.setItem(`banner_shown_${user.id}`, new Date().toISOString());
    }
  };

  const completeOnboarding = () => {
    setOnboardingState(prev => ({
      ...prev,
      userState: 'complete',
      showModal: false,
      setupProgress: 100
    }));
  };

  const skipOnboarding = () => {
    dismissModal();
    
    // Track that user skipped
    if (user) {
      localStorage.setItem(`onboarding_skipped_${user.id}`, 'true');
    }
  };

  return {
    ...onboardingState,
    triggerOnboarding,
    dismissModal,
    completeOnboarding,
    skipOnboarding,
    isNewUser: onboardingState.userState === 'new_signup',
    hasIncompleteSetup: onboardingState.userState === 'returning_incomplete'
  };
}