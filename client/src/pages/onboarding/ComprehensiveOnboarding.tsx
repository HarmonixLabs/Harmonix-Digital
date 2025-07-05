import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { 
  Building2, Users, Code2, Eye, ChevronRight, ChevronLeft,
  Briefcase, Target, Zap, Shield, CheckCircle2, Loader2,
  Wallet, CreditCard, UserPlus, Settings, Cpu
} from 'lucide-react';

interface OnboardingData {
  organizationName: string;
  organizationType: string;
  teamSize: string;
  industry: string;
  role: 'founder' | 'admin' | 'team_member' | 'agent_creator' | 'viewer';
  primaryGoal: string;
  techStack: string[];
  budget: string;
  timeline: string;
  walletAddress?: string;
  paymentMethod?: string;
}

const steps = [
  { id: 1, title: 'Welcome', icon: Building2 },
  { id: 2, title: 'Organization', icon: Briefcase },
  { id: 3, title: 'Your Role', icon: Users },
  { id: 4, title: 'Goals', icon: Target },
  { id: 5, title: 'Technical', icon: Code2 },
  { id: 6, title: 'Setup', icon: Settings },
];

const roleDescriptions = {
  founder: 'Full organization control, billing management, and team administration',
  admin: 'Manage team members, agents, and organization settings',
  team_member: 'Deploy and manage agents, view analytics',
  agent_creator: 'Build, test, and publish custom AI agents',
  viewer: 'Read-only access to dashboards and reports',
};

const techOptions = [
  'Slack', 'Microsoft Teams', 'Google Workspace', 'Notion', 
  'Airtable', 'HubSpot', 'Salesforce', 'Zapier', 'Make.com'
];

export default function ComprehensiveOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [data, setData] = useState<OnboardingData>({
    organizationName: '',
    organizationType: '',
    teamSize: '',
    industry: '',
    role: 'team_member',
    primaryGoal: '',
    techStack: [],
    budget: '',
    timeline: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save onboarding data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: 'Welcome to Harmonix!',
        description: 'Your workspace is ready. Let\'s deploy your first agent!',
      });

      // Navigate to role-based dashboard
      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: 'Setup Error',
        description: 'Failed to complete setup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-24 h-24 bg-harmonix-deep-forest/50 rounded-full flex items-center justify-center">
              <HarmonixLogo variant="icon" className="w-16 h-16" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-harmonix-regal-gold mb-2">
                Welcome to Harmonix, {user?.name}!
              </h2>
              <p className="text-harmonix-sage-fade">
                Let's set up your AI agent command center. This will only take a few minutes.
              </p>
            </div>
            <div className="grid gap-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                <div>
                  <p className="font-medium text-white">Create Your Organization</p>
                  <p className="text-sm text-harmonix-sage-fade">Set up your workspace and team</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                <div>
                  <p className="font-medium text-white">Define Your Role</p>
                  <p className="text-sm text-harmonix-sage-fade">Get the right permissions and views</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                <div>
                  <p className="font-medium text-white">Configure Integrations</p>
                  <p className="text-sm text-harmonix-sage-fade">Connect your existing tools</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-harmonix-regal-gold mb-2">
                Organization Details
              </h3>
              <p className="text-harmonix-sage-fade">
                Tell us about your organization to customize your experience
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="org-name" className="text-harmonix-sage-fade">
                  Organization Name
                </Label>
                <Input
                  id="org-name"
                  value={data.organizationName}
                  onChange={(e) => setData({ ...data, organizationName: e.target.value })}
                  placeholder="Acme Corp"
                  className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white"
                />
              </div>

              <div>
                <Label className="text-harmonix-sage-fade">Organization Type</Label>
                <RadioGroup 
                  value={data.organizationType}
                  onValueChange={(value) => setData({ ...data, organizationType: value })}
                  className="grid grid-cols-2 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="startup" id="startup" />
                    <Label htmlFor="startup" className="cursor-pointer text-white">Startup</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="smb" id="smb" />
                    <Label htmlFor="smb" className="cursor-pointer text-white">SMB</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enterprise" id="enterprise" />
                    <Label htmlFor="enterprise" className="cursor-pointer text-white">Enterprise</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agency" id="agency" />
                    <Label htmlFor="agency" className="cursor-pointer text-white">Agency</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="team-size" className="text-harmonix-sage-fade">
                  Team Size
                </Label>
                <select
                  id="team-size"
                  value={data.teamSize}
                  onChange={(e) => setData({ ...data, teamSize: e.target.value })}
                  className="w-full mt-1 bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 rounded-md px-3 py-2 text-white"
                >
                  <option value="">Select team size</option>
                  <option value="1">Just me</option>
                  <option value="2-5">2-5 people</option>
                  <option value="6-20">6-20 people</option>
                  <option value="21-50">21-50 people</option>
                  <option value="50+">50+ people</option>
                </select>
              </div>

              <div>
                <Label htmlFor="industry" className="text-harmonix-sage-fade">
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={data.industry}
                  onChange={(e) => setData({ ...data, industry: e.target.value })}
                  placeholder="e.g., SaaS, E-commerce, Healthcare"
                  className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-harmonix-regal-gold mb-2">
                Your Role
              </h3>
              <p className="text-harmonix-sage-fade">
                Choose your role to get the right permissions and dashboard
              </p>
            </div>
            
            <RadioGroup 
              value={data.role}
              onValueChange={(value) => setData({ ...data, role: value as OnboardingData['role'] })}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 bg-harmonix-deep-forest/50 rounded-lg cursor-pointer hover:bg-harmonix-deep-forest/70">
                <RadioGroupItem value="founder" id="role-founder" className="mt-1" />
                <Label htmlFor="role-founder" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-harmonix-regal-gold" />
                    <span className="font-medium text-white">Founder / Owner</span>
                  </div>
                  <p className="text-sm text-harmonix-sage-fade">{roleDescriptions.founder}</p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-harmonix-deep-forest/50 rounded-lg cursor-pointer hover:bg-harmonix-deep-forest/70">
                <RadioGroupItem value="admin" id="role-admin" className="mt-1" />
                <Label htmlFor="role-admin" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-harmonix-regal-gold" />
                    <span className="font-medium text-white">Administrator</span>
                  </div>
                  <p className="text-sm text-harmonix-sage-fade">{roleDescriptions.admin}</p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-harmonix-deep-forest/50 rounded-lg cursor-pointer hover:bg-harmonix-deep-forest/70">
                <RadioGroupItem value="team_member" id="role-team" className="mt-1" />
                <Label htmlFor="role-team" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-harmonix-regal-gold" />
                    <span className="font-medium text-white">Team Member</span>
                  </div>
                  <p className="text-sm text-harmonix-sage-fade">{roleDescriptions.team_member}</p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-harmonix-deep-forest/50 rounded-lg cursor-pointer hover:bg-harmonix-deep-forest/70">
                <RadioGroupItem value="agent_creator" id="role-creator" className="mt-1" />
                <Label htmlFor="role-creator" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 className="h-4 w-4 text-harmonix-regal-gold" />
                    <span className="font-medium text-white">Agent Creator</span>
                  </div>
                  <p className="text-sm text-harmonix-sage-fade">{roleDescriptions.agent_creator}</p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-harmonix-deep-forest/50 rounded-lg cursor-pointer hover:bg-harmonix-deep-forest/70">
                <RadioGroupItem value="viewer" id="role-viewer" className="mt-1" />
                <Label htmlFor="role-viewer" className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-harmonix-regal-gold" />
                    <span className="font-medium text-white">Viewer</span>
                  </div>
                  <p className="text-sm text-harmonix-sage-fade">{roleDescriptions.viewer}</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-harmonix-regal-gold mb-2">
                Business Goals
              </h3>
              <p className="text-harmonix-sage-fade">
                What do you want to achieve with AI agents?
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="primary-goal" className="text-harmonix-sage-fade">
                  Primary Goal
                </Label>
                <select
                  id="primary-goal"
                  value={data.primaryGoal}
                  onChange={(e) => setData({ ...data, primaryGoal: e.target.value })}
                  className="w-full mt-1 bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 rounded-md px-3 py-2 text-white"
                >
                  <option value="">Select your primary goal</option>
                  <option value="sales">Increase Sales & Revenue</option>
                  <option value="support">Improve Customer Support</option>
                  <option value="efficiency">Automate Operations</option>
                  <option value="analytics">Better Data Analytics</option>
                  <option value="scale">Scale Business Processes</option>
                </select>
              </div>

              <div>
                <Label htmlFor="budget" className="text-harmonix-sage-fade">
                  Monthly Budget for AI Agents
                </Label>
                <select
                  id="budget"
                  value={data.budget}
                  onChange={(e) => setData({ ...data, budget: e.target.value })}
                  className="w-full mt-1 bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 rounded-md px-3 py-2 text-white"
                >
                  <option value="">Select budget range</option>
                  <option value="0-500">$0 - $500/mo</option>
                  <option value="500-2000">$500 - $2,000/mo</option>
                  <option value="2000-5000">$2,000 - $5,000/mo</option>
                  <option value="5000-10000">$5,000 - $10,000/mo</option>
                  <option value="10000+">$10,000+/mo</option>
                </select>
              </div>

              <div>
                <Label htmlFor="timeline" className="text-harmonix-sage-fade">
                  Implementation Timeline
                </Label>
                <select
                  id="timeline"
                  value={data.timeline}
                  onChange={(e) => setData({ ...data, timeline: e.target.value })}
                  className="w-full mt-1 bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 rounded-md px-3 py-2 text-white"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (This week)</option>
                  <option value="month">Within a month</option>
                  <option value="quarter">Within 3 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-harmonix-regal-gold mb-2">
                Technical Environment
              </h3>
              <p className="text-harmonix-sage-fade">
                Select the tools you currently use or want to integrate
              </p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-harmonix-sage-fade">Current Tech Stack</Label>
              <div className="grid grid-cols-2 gap-3">
                {techOptions.map((tech) => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={tech}
                      checked={data.techStack.includes(tech)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setData({ ...data, techStack: [...data.techStack, tech] });
                        } else {
                          setData({ ...data, techStack: data.techStack.filter(t => t !== tech) });
                        }
                      }}
                    />
                    <Label htmlFor={tech} className="cursor-pointer text-white">
                      {tech}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-harmonix-regal-gold mb-2">
                All Set!
              </h3>
              <p className="text-harmonix-sage-fade mb-6">
                Your workspace is ready. Let's explore your personalized dashboard.
              </p>
            </div>
            
            <div className="bg-harmonix-deep-forest/50 rounded-lg p-6 text-left space-y-3">
              <h4 className="font-semibold text-white mb-3">What's Next:</h4>
              <div className="flex items-start gap-3">
                <Cpu className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                <div>
                  <p className="font-medium text-white">Deploy Your First Agent</p>
                  <p className="text-sm text-harmonix-sage-fade">We'll recommend agents based on your goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserPlus className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                <div>
                  <p className="font-medium text-white">Invite Your Team</p>
                  <p className="text-sm text-harmonix-sage-fade">Collaborate with team members</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wallet className="h-5 w-5 text-harmonix-regal-gold mt-0.5" />
                <div>
                  <p className="font-medium text-white">Connect Wallet (Optional)</p>
                  <p className="text-sm text-harmonix-sage-fade">For NFT agent ownership</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmonix-deep-forest via-harmonix-cedar-mist to-harmonix-deep-forest p-4">
      <div className="container max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id 
                      ? 'bg-harmonix-regal-gold text-harmonix-deep-forest' 
                      : 'bg-harmonix-deep-forest/50 text-harmonix-sage-fade'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-1 mx-2 ${
                      currentStep > step.id 
                        ? 'bg-harmonix-regal-gold' 
                        : 'bg-harmonix-deep-forest/50'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Content */}
        <Card className="bg-harmonix-night-pine/95 backdrop-blur-xl border-harmonix-sage-fade/20">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-harmonix-sage-fade/30"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {currentStep < steps.length ? (
            <Button 
              onClick={handleNext}
              className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}