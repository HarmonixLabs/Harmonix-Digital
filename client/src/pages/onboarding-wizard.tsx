import React from 'react';
import PersonalizedOnboarding from '@/components/onboarding/PersonalizedOnboarding';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function OnboardingWizard() {
  const { showOnboarding, dismissOnboarding } = useOnboarding();

  if (!showOnboarding) {
    return null;
  }

  return <PersonalizedOnboarding />;
}