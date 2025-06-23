import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Users, 
  Target, 
  Brain, 
  Sparkles,
  Rocket,
  PlayCircle,
  Settings,
  Crown
} from "lucide-react";

interface OnboardingData {
  // Company Info
  companySize: string;
  industry: string;
  monthlyRevenue: string;
  currentTools: string[];
  
  // Business Goals
  primaryGoals: string[];
  painPoints: string[];
  automationAreas: string[];
  
  // Technical Setup
  integrations: string[];
  techStack: string[];
  
  // Agent Selection
  selectedAgents: string[];
  tier: string;
  
  // Personalization
  workflowPriorities: string[];
  reportingPreferences: string[];
}

interface WizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export function AdvancedOnboardingWizard({ onComplete, onSkip }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    companySize: "",
    industry: "",
    monthlyRevenue: "",
    currentTools: [],
    primaryGoals: [],
    painPoints: [],
    automationAreas: [],
    integrations: [],
    techStack: [],
    selectedAgents: [],
    tier: "",
    workflowPriorities: [],
    reportingPreferences: []
  });
  
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;
  const { toast } = useToast();

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    const currentArray = data[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateData(field, newArray);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Company Profile",
      "Business Goals", 
      "Current Challenges",
      "Technical Environment",
      "Agent Selection",
      "Workflow Configuration"
    ];
    return titles[currentStep - 1];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyProfileStep data={data} updateData={updateData} />;
      case 2:
        return <BusinessGoalsStep data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />;
      case 3:
        return <ChallengesStep data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />;
      case 4:
        return <TechnicalStep data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />;
      case 5:
        return <AgentSelectionStep data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />;
      case 6:
        return <WorkflowConfigStep data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen harmonix-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <HarmonixLogo size="lg" variant="scenic" className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Harmonix</h1>
          <p className="text-harmonix-sage-fade text-lg">
            Let's configure your AI automation platform for maximum impact
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-harmonix-sage-fade mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="harmonix-card-enhanced">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-harmonix-regal-gold flex items-center justify-center text-harmonix-deep-forest font-bold">
                {currentStep}
              </div>
              <span>{getStepTitle()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}
            
            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <div className="flex space-x-2">
                {currentStep > 1 && (
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade hover:text-harmonix-deep-forest"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                <Button
                  onClick={onSkip}
                  variant="ghost"
                  className="text-harmonix-sage-fade hover:text-white"
                >
                  Skip Setup
                </Button>
              </div>
              
              <Button
                onClick={nextStep}
                className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold"
              >
                {currentStep === totalSteps ? (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Platform
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Step Components
function CompanyProfileStep({ data, updateData }: any) {
  const companySizes = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-1000 employees",
    "1000+ employees"
  ];

  const industries = [
    "SaaS/Technology",
    "E-commerce",
    "Real Estate",
    "Healthcare", 
    "Finance/Banking",
    "Consulting",
    "Marketing Agency",
    "Manufacturing",
    "Other"
  ];

  const revenueRanges = [
    "Under $100K",
    "$100K - $500K",
    "$500K - $1M", 
    "$1M - $5M",
    "$5M - $10M",
    "$10M+"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-2" />
        <p className="text-harmonix-sage-fade">
          Help us understand your business to recommend the best AI agents and workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-harmonix-sage-fade">Company Size</Label>
          <Select value={data.companySize} onValueChange={(value) => updateData('companySize', value)}>
            <SelectTrigger className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map(size => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-harmonix-sage-fade">Industry</Label>
          <Select value={data.industry} onValueChange={(value) => updateData('industry', value)}>
            <SelectTrigger className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label className="text-harmonix-sage-fade">Monthly Revenue Range</Label>
          <Select value={data.monthlyRevenue} onValueChange={(value) => updateData('monthlyRevenue', value)}>
            <SelectTrigger className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent>
              {revenueRanges.map(range => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function BusinessGoalsStep({ data, toggleArrayItem }: any) {
  const goals = [
    "Increase sales revenue",
    "Improve lead generation", 
    "Enhance customer support",
    "Streamline operations",
    "Reduce manual tasks",
    "Scale team productivity",
    "Improve data insights",
    "Automate marketing"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-2" />
        <p className="text-harmonix-sage-fade">
          What are your primary business objectives for the next 12 months?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => (
          <div 
            key={goal}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              data.primaryGoals.includes(goal)
                ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                : 'border-harmonix-cedar-mist bg-harmonix-cedar-mist/5 hover:border-harmonix-sage-fade'
            }`}
            onClick={() => toggleArrayItem('primaryGoals', goal)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                data.primaryGoals.includes(goal)
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold'
                  : 'border-harmonix-sage-fade'
              }`}>
                {data.primaryGoals.includes(goal) && (
                  <CheckCircle className="w-4 h-4 text-harmonix-deep-forest" />
                )}
              </div>
              <span className="text-white font-medium">{goal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengesStep({ data, toggleArrayItem }: any) {
  const painPoints = [
    "Too many manual processes",
    "Poor lead conversion rates",
    "Inconsistent customer experience", 
    "Data scattered across tools",
    "Team overwhelmed with tasks",
    "Slow response times",
    "Lack of automation",
    "Difficulty scaling operations"
  ];

  const automationAreas = [
    "Sales pipeline management",
    "Customer onboarding",
    "Email marketing", 
    "Lead qualification",
    "Social media management",
    "Customer support tickets",
    "Reporting and analytics",
    "Appointment scheduling"
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <Brain className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-2" />
        <p className="text-harmonix-sage-fade">
          Identify your biggest challenges and areas where automation could help
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Current Pain Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {painPoints.map(point => (
            <div 
              key={point}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                data.painPoints.includes(point)
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                  : 'border-harmonix-cedar-mist hover:border-harmonix-sage-fade'
              }`}
              onClick={() => toggleArrayItem('painPoints', point)}
            >
              <span className="text-white text-sm">{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Priority Automation Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {automationAreas.map(area => (
            <div 
              key={area}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                data.automationAreas.includes(area)
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                  : 'border-harmonix-cedar-mist hover:border-harmonix-sage-fade'
              }`}
              onClick={() => toggleArrayItem('automationAreas', area)}
            >
              <span className="text-white text-sm">{area}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnicalStep({ data, toggleArrayItem }: any) {
  const integrations = [
    "Go High Level", "HubSpot", "Salesforce", "Mailchimp", "Zapier", 
    "Slack", "Microsoft Teams", "Google Workspace", "Notion", "Airtable"
  ];

  const techStack = [
    "CRM System", "Email Marketing", "Project Management", "Analytics", 
    "Social Media Tools", "E-commerce Platform", "Accounting Software", "HR Systems"
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <Settings className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-2" />
        <p className="text-harmonix-sage-fade">
          Select your current tools and desired integrations for seamless workflow automation
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Integration Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {integrations.map(integration => (
            <Badge
              key={integration}
              variant={data.integrations.includes(integration) ? "default" : "outline"}
              className={`p-2 cursor-pointer transition-all duration-300 justify-center ${
                data.integrations.includes(integration)
                  ? 'bg-harmonix-regal-gold text-harmonix-deep-forest'
                  : 'border-harmonix-cedar-mist text-harmonix-sage-fade hover:border-harmonix-regal-gold'
              }`}
              onClick={() => toggleArrayItem('integrations', integration)}
            >
              {integration}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Current Tech Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {techStack.map(tech => (
            <Badge
              key={tech}
              variant={data.techStack.includes(tech) ? "default" : "outline"}
              className={`p-2 cursor-pointer transition-all duration-300 justify-center ${
                data.techStack.includes(tech)
                  ? 'bg-harmonix-regal-gold text-harmonix-deep-forest'
                  : 'border-harmonix-cedar-mist text-harmonix-sage-fade hover:border-harmonix-regal-gold'
              }`}
              onClick={() => toggleArrayItem('techStack', tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentSelectionStep({ data, updateData, toggleArrayItem }: any) {
  const agents = [
    { id: "sales", name: "Agent CA$H", description: "Sales automation and lead management", icon: "💰" },
    { id: "concierge", name: "Concierge Agent", description: "Customer service and support", icon: "🎯" },
    { id: "hr", name: "HR Agent", description: "Talent acquisition and employee management", icon: "👥" },
    { id: "executive", name: "Executive Assistant", description: "Calendar and task management", icon: "📅" },
    { id: "content", name: "Content Creation", description: "Blog posts and marketing copy", icon: "✍️" },
    { id: "social", name: "Social Media Agent", description: "Social media management", icon: "📱" }
  ];

  const tiers = [
    { id: "starter", name: "Starter", agents: 1, price: "$4,400-$6,200" },
    { id: "growth", name: "Growth", agents: 5, price: "$8,000-$12,500" },
    { id: "expansion", name: "Expansion", agents: 8, price: "$15,000-$18,000" },
    { id: "enterprise", name: "Enterprise", agents: 12, price: "Custom" }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-2" />
        <p className="text-harmonix-sage-fade">
          Choose your AI agents and pricing tier based on your needs
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Recommended Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map(agent => (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all duration-300 ${
                data.selectedAgents.includes(agent.id)
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                  : 'border-harmonix-cedar-mist bg-harmonix-cedar-mist/5 hover:border-harmonix-sage-fade'
              }`}
              onClick={() => toggleArrayItem('selectedAgents', agent.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{agent.icon}</div>
                  <div>
                    <h4 className="font-bold text-white">{agent.name}</h4>
                    <p className="text-sm text-harmonix-sage-fade">{agent.description}</p>
                  </div>
                  {data.selectedAgents.includes(agent.id) && (
                    <CheckCircle className="w-6 h-6 text-harmonix-regal-gold ml-auto" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Select Your Tier</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map(tier => (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all duration-300 ${
                data.tier === tier.id
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                  : 'border-harmonix-cedar-mist bg-harmonix-cedar-mist/5 hover:border-harmonix-sage-fade'
              }`}
              onClick={() => updateData('tier', tier.id)}
            >
              <CardContent className="p-4 text-center">
                <h4 className="font-bold text-white text-lg">{tier.name}</h4>
                <p className="text-harmonix-sage-fade">{tier.agents} agents included</p>
                <p className="text-harmonix-regal-gold font-semibold">{tier.price}</p>
                {data.tier === tier.id && (
                  <Crown className="w-6 h-6 text-harmonix-regal-gold mx-auto mt-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkflowConfigStep({ data, toggleArrayItem }: any) {
  const priorities = [
    "Real-time notifications",
    "Daily summary reports",
    "Weekly performance reviews",
    "Custom dashboards",
    "Automated workflows",
    "Integration alerts"
  ];

  const reportingTypes = [
    "Email reports",
    "Slack notifications", 
    "Dashboard widgets",
    "SMS alerts",
    "Mobile app notifications",
    "API webhooks"
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <PlayCircle className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-2" />
        <p className="text-harmonix-sage-fade">
          Configure your workflow preferences and reporting settings
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Workflow Priorities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {priorities.map(priority => (
            <div 
              key={priority}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                data.workflowPriorities.includes(priority)
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                  : 'border-harmonix-cedar-mist hover:border-harmonix-sage-fade'
              }`}
              onClick={() => toggleArrayItem('workflowPriorities', priority)}
            >
              <span className="text-white">{priority}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Reporting Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reportingTypes.map(type => (
            <div 
              key={type}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                data.reportingPreferences.includes(type)
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                  : 'border-harmonix-cedar-mist hover:border-harmonix-sage-fade'
              }`}
              onClick={() => toggleArrayItem('reportingPreferences', type)}
            >
              <span className="text-white">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-xl p-6">
        <h4 className="text-lg font-bold text-harmonix-regal-gold mb-2">Ready to Launch!</h4>
        <p className="text-harmonix-sage-fade">
          Your personalized Harmonix platform is configured and ready. Click "Launch Platform" to start your AI automation journey.
        </p>
      </div>
    </div>
  );
}