import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Target, Users, Zap, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  character: {
    name: string;
    role: string;
    avatar: string;
    personality: string;
  };
  content: React.ReactNode;
  actionLabel: string;
  completed?: boolean;
}

interface UserProfile {
  industry: string;
  role: string;
  goals: string[];
  experience: string;
  teamSize: string;
}

export default function PersonalizedOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    industry: '',
    role: '',
    goals: [],
    experience: '',
    teamSize: ''
  });
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const characters = {
    harmony: {
      name: "Harmony",
      role: "Welcome Guide",
      avatar: "/api/placeholder/64/64",
      personality: "Warm and encouraging, helps you feel at home"
    },
    sage: {
      name: "Sage",
      role: "Strategy Advisor",
      avatar: "/api/placeholder/64/64", 
      personality: "Wise and analytical, helps you plan your journey"
    },
    phoenix: {
      name: "Phoenix",
      role: "Growth Catalyst",
      avatar: "/api/placeholder/64/64",
      personality: "Energetic and ambitious, helps you scale"
    },
    atlas: {
      name: "Atlas",
      role: "Technical Guide",
      avatar: "/api/placeholder/64/64",
      personality: "Reliable and thorough, helps you implement"
    }
  };

  const getPersonalizedSteps = (): OnboardingStep[] => [
    {
      id: 'welcome',
      title: 'Welcome to Your AI Empire',
      description: 'Let me introduce you to the Harmonix ecosystem',
      character: characters.harmony,
      actionLabel: 'Begin Journey',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-harmonix-regal-gold to-harmonix-gold-bright rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-harmonix-deep-forest" />
            </div>
            <h3 className="text-2xl font-bold text-harmonix-ivory-light mb-2">
              Welcome to Harmonix
            </h3>
            <p className="text-harmonix-sage-fade">
              I'm Harmony, and I'll be your personal guide through setting up your AI-powered business empire.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-harmonix-night-pine/20 rounded-lg border border-harmonix-cedar-mist/20">
              <Target className="w-6 h-6 text-harmonix-regal-gold mb-2" />
              <h4 className="font-semibold text-harmonix-ivory-light">Personalized Setup</h4>
              <p className="text-sm text-harmonix-sage-fade">Tailored to your industry and goals</p>
            </div>
            <div className="p-4 bg-harmonix-night-pine/20 rounded-lg border border-harmonix-cedar-mist/20">
              <Users className="w-6 h-6 text-harmonix-regal-gold mb-2" />
              <h4 className="font-semibold text-harmonix-ivory-light">Expert Guidance</h4>
              <p className="text-sm text-harmonix-sage-fade">Character-driven tutorials</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Tell Me About Your Business',
      description: 'Help me understand your goals so I can personalize your experience',
      character: characters.sage,
      actionLabel: 'Set My Profile',
      content: (
        <ProfileSetup 
          profile={userProfile} 
          onChange={setUserProfile} 
        />
      )
    },
    {
      id: 'agents',
      title: 'Meet Your AI Team',
      description: 'Discover the agents that will transform your business',
      character: characters.phoenix,
      actionLabel: 'Explore Agents',
      content: (
        <AgentIntroduction profile={userProfile} />
      )
    },
    {
      id: 'demo',
      title: 'See Them in Action',
      description: 'Watch your selected agents handle real business scenarios',
      character: characters.atlas,
      actionLabel: 'Run Demo',
      content: (
        <DemoExperience profile={userProfile} />
      )
    },
    {
      id: 'deployment',
      title: 'Deploy Your Empire',
      description: 'Set up your agents and start automating',
      character: characters.harmony,
      actionLabel: 'Launch Now',
      content: (
        <DeploymentGuide profile={userProfile} />
      )
    }
  ];

  const steps = getPersonalizedSteps();
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepComplete = () => {
    const stepId = steps[currentStep].id;
    setCompletedSteps(prev => [...prev, stepId]);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={cn(
      "fixed inset-0 bg-harmonix-deep-forest/95 backdrop-blur-sm z-50 transition-all duration-500",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-harmonix-night-pine border-harmonix-cedar-mist/30 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <div className="text-sm text-harmonix-sage-fade">
                {Math.round(progress)}% Complete
              </div>
            </div>
            <Progress value={progress} className="mb-6" />
            
            {/* Character Introduction */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-harmonix-regal-gold/50">
                <AvatarImage src={currentStepData.character.avatar} />
                <AvatarFallback className="bg-harmonix-regal-gold text-harmonix-deep-forest">
                  {currentStepData.character.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h3 className="font-semibold text-harmonix-ivory-light">
                  {currentStepData.character.name}
                </h3>
                <p className="text-sm text-harmonix-regal-gold">
                  {currentStepData.character.role}
                </p>
                <p className="text-xs text-harmonix-sage-fade">
                  {currentStepData.character.personality}
                </p>
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-harmonix-ivory-light mb-2">
              {currentStepData.title}
            </CardTitle>
            <p className="text-harmonix-sage-fade text-lg">
              {currentStepData.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="min-h-[400px]">
              {currentStepData.content}
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="border-harmonix-cedar-mist/40 text-harmonix-sage-fade hover:bg-harmonix-cedar-mist/10"
              >
                Previous
              </Button>

              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      index <= currentStep
                        ? "bg-harmonix-regal-gold"
                        : "bg-harmonix-cedar-mist/30"
                    )}
                  />
                ))}
              </div>

              <Button
                onClick={handleStepComplete}
                className="bg-gradient-to-r from-harmonix-regal-gold to-harmonix-gold-bright text-harmonix-deep-forest hover:scale-105 transition-all duration-300"
              >
                {currentStepData.actionLabel}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Profile Setup Component
function ProfileSetup({ profile, onChange }: { 
  profile: UserProfile; 
  onChange: (profile: UserProfile) => void; 
}) {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Consulting', 
    'Real Estate', 'Education', 'Manufacturing', 'Other'
  ];

  const roles = [
    'CEO/Founder', 'Operations Manager', 'Marketing Director', 
    'Sales Manager', 'Product Manager', 'Other'
  ];

  const goals = [
    'Automate repetitive tasks', 'Improve customer service', 'Increase sales',
    'Scale operations', 'Reduce costs', 'Enhance productivity'
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-harmonix-ivory-light mb-2">
            Industry
          </label>
          <select 
            value={profile.industry}
            onChange={(e) => onChange({ ...profile, industry: e.target.value })}
            className="w-full p-3 bg-harmonix-night-pine/30 border border-harmonix-cedar-mist/30 rounded-lg text-harmonix-ivory-light"
          >
            <option value="">Select your industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-harmonix-ivory-light mb-2">
            Role
          </label>
          <select 
            value={profile.role}
            onChange={(e) => onChange({ ...profile, role: e.target.value })}
            className="w-full p-3 bg-harmonix-night-pine/30 border border-harmonix-cedar-mist/30 rounded-lg text-harmonix-ivory-light"
          >
            <option value="">Select your role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-harmonix-ivory-light mb-2">
          Primary Goals (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {goals.map(goal => (
            <label key={goal} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.goals.includes(goal)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange({ ...profile, goals: [...profile.goals, goal] });
                  } else {
                    onChange({ ...profile, goals: profile.goals.filter(g => g !== goal) });
                  }
                }}
                className="rounded border-harmonix-cedar-mist/30 bg-harmonix-night-pine/30"
              />
              <span className="text-harmonix-sage-fade text-sm">{goal}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Agent Introduction Component
function AgentIntroduction({ profile }: { profile: UserProfile }) {
  const getRecommendedAgents = () => {
    const agents = [
      {
        name: "CA$HFLOW",
        role: "Sales Agent",
        description: "Converts leads into customers automatically",
        relevance: profile.goals.includes('Increase sales') ? 'high' : 'medium',
        icon: <Target className="w-6 h-6" />
      },
      {
        name: "GRACE",
        role: "Customer Service",
        description: "Handles customer inquiries 24/7",
        relevance: profile.goals.includes('Improve customer service') ? 'high' : 'medium',
        icon: <MessageCircle className="w-6 h-6" />
      },
      {
        name: "ATLAS",
        role: "Operations Manager",
        description: "Automates workflows and processes",
        relevance: profile.goals.includes('Automate repetitive tasks') ? 'high' : 'medium',
        icon: <Zap className="w-6 h-6" />
      }
    ];

    return agents.sort((a, b) => a.relevance === 'high' ? -1 : 1);
  };

  const recommendedAgents = getRecommendedAgents();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-harmonix-ivory-light mb-2">
          Based on your goals, here are your recommended agents:
        </h3>
        <p className="text-harmonix-sage-fade">
          Each agent is specifically chosen to help you achieve your objectives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedAgents.map((agent, index) => (
          <Card 
            key={agent.name}
            className={cn(
              "bg-harmonix-night-pine/20 border transition-all duration-300 hover:scale-105",
              agent.relevance === 'high' 
                ? "border-harmonix-regal-gold/50 shadow-lg shadow-harmonix-regal-gold/20" 
                : "border-harmonix-cedar-mist/30"
            )}
          >
            <CardContent className="p-4 text-center">
              {agent.relevance === 'high' && (
                <Badge className="mb-3 bg-harmonix-regal-gold text-harmonix-deep-forest">
                  Perfect Match
                </Badge>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-harmonix-regal-gold to-harmonix-gold-bright rounded-full mx-auto mb-3 flex items-center justify-center text-harmonix-deep-forest">
                {agent.icon}
              </div>
              <h4 className="font-bold text-harmonix-ivory-light mb-1">{agent.name}</h4>
              <p className="text-sm text-harmonix-regal-gold mb-2">{agent.role}</p>
              <p className="text-xs text-harmonix-sage-fade">{agent.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Demo Experience Component
function DemoExperience({ profile }: { profile: UserProfile }) {
  const [isRunning, setIsRunning] = useState(false);

  const runDemo = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-harmonix-ivory-light mb-2">
          Watch Your Agents in Action
        </h3>
        <p className="text-harmonix-sage-fade">
          See how they'll handle real scenarios in your business
        </p>
      </div>

      <div className="bg-harmonix-night-pine/20 rounded-lg p-6 border border-harmonix-cedar-mist/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-harmonix-ivory-light">Demo Scenario</h4>
          <Badge variant="secondary" className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
            {profile.industry || 'General'} Industry
          </Badge>
        </div>
        
        {isRunning ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-harmonix-cedar-mist/30 rounded mb-2"></div>
              <div className="h-4 bg-harmonix-cedar-mist/30 rounded w-3/4"></div>
            </div>
            <p className="text-harmonix-sage-fade">Running demo scenario...</p>
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={runDemo} className="bg-gradient-to-r from-harmonix-regal-gold to-harmonix-gold-bright text-harmonix-deep-forest">
              <Zap className="mr-2 w-4 h-4" />
              Start Demo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Deployment Guide Component
function DeploymentGuide({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-harmonix-regal-gold mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-harmonix-ivory-light mb-2">
          Ready to Deploy Your AI Empire
        </h3>
        <p className="text-harmonix-sage-fade">
          Your personalized setup is complete. Let's launch your agents!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-harmonix-night-pine/20 border-harmonix-cedar-mist/30">
          <CardContent className="p-4">
            <h4 className="font-semibold text-harmonix-ivory-light mb-2">
              Selected Agents: 3
            </h4>
            <p className="text-sm text-harmonix-sage-fade">
              Optimized for {profile.industry} industry
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-harmonix-night-pine/20 border-harmonix-cedar-mist/30">
          <CardContent className="p-4">
            <h4 className="font-semibold text-harmonix-ivory-light mb-2">
              Setup Time: 5 minutes
            </h4>
            <p className="text-sm text-harmonix-sage-fade">
              Automated configuration included
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}