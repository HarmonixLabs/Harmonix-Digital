import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Sparkles, Target, Zap, Users, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredButton } from "@/components/ui/sacred-button";
import { FadeIn } from "@/components/ui/micro-animations";

interface OnboardingData {
  role: string;
  company: string;
  industry: string;
  teamSize: string;
  primaryGoals: string[];
  painPoints: string[];
  techStack: string[];
  budget: string;
  timeline: string;
  experience: string;
  customDescription: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ComponentType<any>;
}

const learningPaths: LearningPath[] = [
  {
    id: 'executive',
    title: 'Executive Leadership Path',
    description: 'Strategic AI implementation for business leaders',
    duration: '2-3 weeks',
    modules: ['AI Strategy Planning', 'ROI Measurement', 'Team Integration', 'Change Management'],
    difficulty: 'intermediate',
    icon: Target
  },
  {
    id: 'technical',
    title: 'Technical Implementation Path',
    description: 'Hands-on AI integration and customization',
    duration: '4-6 weeks',
    modules: ['API Integration', 'Custom Workflows', 'Data Mapping', 'Advanced Automation'],
    difficulty: 'advanced',
    icon: Zap
  },
  {
    id: 'sales',
    title: 'Sales Optimization Path',
    description: 'AI-powered sales process enhancement',
    duration: '3-4 weeks',
    modules: ['Lead Qualification', 'Pipeline Automation', 'CRM Integration', 'Performance Analytics'],
    difficulty: 'beginner',
    icon: TrendingUp
  },
  {
    id: 'operations',
    title: 'Operations Excellence Path',
    description: 'Streamline operations with intelligent automation',
    duration: '3-5 weeks',
    modules: ['Process Automation', 'Quality Control', 'Resource Optimization', 'Workflow Design'],
    difficulty: 'intermediate',
    icon: Users
  }
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Manufacturing', 
  'Real Estate', 'Education', 'Marketing/Advertising', 'Consulting', 'Other'
];

const teamSizes = ['1-5', '6-20', '21-50', '51-200', '200+'];
const budgetRanges = ['<$10K', '$10K-$50K', '$50K-$100K', '$100K+'];
const timelines = ['1 month', '3 months', '6 months', '1 year+'];

export function ContextualAIWizard({ onComplete }: { onComplete: (data: OnboardingData & { recommendedPath: LearningPath }) => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    role: '',
    company: '',
    industry: '',
    teamSize: '',
    primaryGoals: [],
    painPoints: [],
    techStack: [],
    budget: '',
    timeline: '',
    experience: '',
    customDescription: ''
  });
  const [recommendedPath, setRecommendedPath] = useState<LearningPath | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const analyzeUserProfile = () => {
    setIsAnalyzing(true);
    
    // AI-powered path recommendation logic
    setTimeout(() => {
      let recommendedPathId = 'operations'; // default
      
      if (data.role.toLowerCase().includes('ceo') || data.role.toLowerCase().includes('executive')) {
        recommendedPathId = 'executive';
      } else if (data.role.toLowerCase().includes('developer') || data.role.toLowerCase().includes('technical')) {
        recommendedPathId = 'technical';
      } else if (data.role.toLowerCase().includes('sales') || data.primaryGoals.includes('increase-sales')) {
        recommendedPathId = 'sales';
      }
      
      const path = learningPaths.find(p => p.id === recommendedPathId) || learningPaths[0];
      setRecommendedPath(path);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleGoalToggle = (goal: string) => {
    setData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const handlePainPointToggle = (painPoint: string) => {
    setData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(painPoint)
        ? prev.painPoints.filter(p => p !== painPoint)
        : [...prev.painPoints, painPoint]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FadeIn delay={0.2}>
            <SacredCard className="p-8">
              <CardHeader className="text-center">
                <Brain className="h-12 w-12 text-harmonix-gold mx-auto mb-4" />
                <CardTitle className="harmonix-header-font text-2xl text-white">Welcome to Harmonix AI</CardTitle>
                <p className="text-harmonix-sage">Let's personalize your AI journey based on your unique needs</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-harmonix-sage">Your Role</Label>
                  <Input
                    value={data.role}
                    onChange={(e) => setData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., CEO, Sales Manager, Developer"
                    className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-harmonix-sage">Company</Label>
                  <Input
                    value={data.company}
                    onChange={(e) => setData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name"
                    className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-harmonix-sage">Industry</Label>
                  <Select value={data.industry} onValueChange={(value) => setData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-harmonix-sage">Team Size</Label>
                  <Select value={data.teamSize} onValueChange={(value) => setData(prev => ({ ...prev, teamSize: value }))}>
                    <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamSizes.map(size => (
                        <SelectItem key={size} value={size}>{size} people</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </SacredCard>
          </FadeIn>
        );

      case 2:
        return (
          <FadeIn delay={0.2}>
            <SacredCard className="p-8">
              <CardHeader>
                <CardTitle className="harmonix-header-font text-xl text-white">What are your primary goals?</CardTitle>
                <p className="text-harmonix-sage">Select all that apply</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'increase-sales', 'reduce-costs', 'improve-efficiency', 
                    'enhance-customer-experience', 'automate-processes', 'scale-operations'
                  ].map(goal => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={data.primaryGoals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                      />
                      <Label htmlFor={goal} className="text-harmonix-sage capitalize">
                        {goal.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </SacredCard>
          </FadeIn>
        );

      case 3:
        return (
          <FadeIn delay={0.2}>
            <SacredCard className="p-8">
              <CardHeader>
                <CardTitle className="harmonix-header-font text-xl text-white">Current challenges?</CardTitle>
                <p className="text-harmonix-sage">What pain points are you experiencing?</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    'manual-repetitive-tasks', 'poor-lead-quality', 'data-silos',
                    'inefficient-workflows', 'lack-of-insights', 'team-burnout'
                  ].map(painPoint => (
                    <div key={painPoint} className="flex items-center space-x-2">
                      <Checkbox
                        id={painPoint}
                        checked={data.painPoints.includes(painPoint)}
                        onCheckedChange={() => handlePainPointToggle(painPoint)}
                      />
                      <Label htmlFor={painPoint} className="text-harmonix-sage capitalize">
                        {painPoint.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </SacredCard>
          </FadeIn>
        );

      case 4:
        return (
          <FadeIn delay={0.2}>
            <SacredCard className="p-8">
              <CardHeader>
                <CardTitle className="harmonix-header-font text-xl text-white">Technical preferences</CardTitle>
                <p className="text-harmonix-sage">Help us understand your technical environment</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-harmonix-sage">Budget Range</Label>
                  <Select value={data.budget} onValueChange={(value) => setData(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map(budget => (
                        <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-harmonix-sage">Implementation Timeline</Label>
                  <Select value={data.timeline} onValueChange={(value) => setData(prev => ({ ...prev, timeline: value }))}>
                    <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelines.map(timeline => (
                        <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-harmonix-sage">AI/Automation Experience</Label>
                  <Select value={data.experience} onValueChange={(value) => setData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - New to AI</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                      <SelectItem value="advanced">Advanced - Extensive experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </SacredCard>
          </FadeIn>
        );

      case 5:
        return (
          <FadeIn delay={0.2}>
            <SacredCard className="p-8">
              <CardHeader>
                <CardTitle className="harmonix-header-font text-xl text-white">Tell us more</CardTitle>
                <p className="text-harmonix-sage">Describe your specific use case or vision</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={data.customDescription}
                  onChange={(e) => setData(prev => ({ ...prev, customDescription: e.target.value }))}
                  placeholder="Describe your specific needs, goals, or any unique requirements..."
                  className="bg-harmonix-pine/30 border-harmonix-sage/30 text-white min-h-32"
                />
              </CardContent>
            </SacredCard>
          </FadeIn>
        );

      case 6:
        return (
          <FadeIn delay={0.2}>
            <SacredCard className="p-8">
              <CardHeader className="text-center">
                <Sparkles className="h-12 w-12 text-harmonix-gold mx-auto mb-4" />
                <CardTitle className="harmonix-header-font text-2xl text-white">
                  {isAnalyzing ? 'Analyzing Your Profile...' : 'Your Personalized Learning Path'}
                </CardTitle>
                {isAnalyzing ? (
                  <p className="text-harmonix-sage">AI is crafting your optimal learning journey</p>
                ) : recommendedPath && (
                  <p className="text-harmonix-sage">Based on your profile, we recommend:</p>
                )}
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="text-center space-y-4">
                    <div className="animate-pulse">
                      <Brain className="h-16 w-16 text-harmonix-gold mx-auto" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-harmonix-sage/20 rounded animate-pulse"></div>
                      <div className="h-2 bg-harmonix-sage/20 rounded animate-pulse"></div>
                      <div className="h-2 bg-harmonix-sage/20 rounded animate-pulse w-3/4 mx-auto"></div>
                    </div>
                  </div>
                ) : recommendedPath && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <recommendedPath.icon className="h-8 w-8 text-harmonix-gold" />
                      <div>
                        <h3 className="harmonix-header-font text-lg text-white">{recommendedPath.title}</h3>
                        <p className="text-harmonix-sage">{recommendedPath.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-harmonix-sage">Duration</Label>
                        <p className="text-white">{recommendedPath.duration}</p>
                      </div>
                      <div>
                        <Label className="text-harmonix-sage">Difficulty</Label>
                        <Badge variant="outline" className="text-harmonix-gold border-harmonix-gold">
                          {recommendedPath.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-harmonix-sage">Learning Modules</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {recommendedPath.modules.map((module, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-harmonix-gold" />
                            <span className="text-harmonix-sage text-sm">{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </SacredCard>
          </FadeIn>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      if (step === 5) {
        analyzeUserProfile();
      }
    } else if (recommendedPath) {
      onComplete({ ...data, recommendedPath });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.role && data.company && data.industry && data.teamSize;
      case 2:
        return data.primaryGoals.length > 0;
      case 3:
        return true; // pain points are optional
      case 4:
        return data.budget && data.timeline && data.experience;
      case 5:
        return true; // custom description is optional
      case 6:
        return !isAnalyzing && recommendedPath;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen harmonix-gradient p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-harmonix-pine/30" />
          <div className="flex justify-between mt-2">
            <span className="text-harmonix-sage text-sm">Step {step} of {totalSteps}</span>
            <span className="text-harmonix-sage text-sm">{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <SacredButton
            variant="ghost"
            onClick={handlePrevious}
            disabled={step === 1}
            className="text-harmonix-sage"
          >
            Previous
          </SacredButton>
          <SacredButton
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
          >
            {step === totalSteps ? 'Start Journey' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </SacredButton>
        </div>
      </div>
    </div>
  );
}