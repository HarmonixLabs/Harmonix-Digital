import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { 
  CheckCircle, Sparkles, Crown, Users, ArrowRight, Zap, Star, Timer,
  Building, Mail, Phone, Briefcase, DollarSign, UserCheck, Shield,
  Rocket, Eye, EyeOff, Globe, Target, TrendingUp
} from "lucide-react";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { MysticalTooltip } from "@/components/ui/animated-tooltip";

type AccessType = "waitlist" | "vip" | "premium" | "account";

interface FormData {
  // Basic info
  name: string;
  email: string;
  password?: string;
  phone: string;
  company: string;
  
  // Business info
  businessType: string;
  teamSize: string;
  revenue: string;
  interests: string;
  
  // Plan selection
  selectedPlan?: string;
}

export default function UnifiedJoinPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [accessType, setAccessType] = useState<AccessType>("waitlist");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessType: "",
    teamSize: "",
    revenue: "",
    interests: "",
    selectedPlan: "growth"
  });

  const accessOptions = [
    {
      id: "waitlist" as AccessType,
      title: "Join Waitlist",
      subtitle: "Free early access",
      price: "$0",
      description: "Get notified when we launch + early bird pricing",
      benefits: ["30% early bird discount", "Priority access when we launch", "Exclusive updates"],
      icon: Users,
      color: "text-harmonix-sage-fade",
      bgColor: "bg-harmonix-sage-fade/10",
      borderColor: "border-harmonix-sage-fade/30"
    },
    {
      id: "vip" as AccessType,
      title: "VIP Priority",
      subtitle: "Reserve your spot",
      price: "$444",
      description: "Secure priority access with refundable deposit",
      benefits: ["Guaranteed first 100 spots", "45% discount locked in", "White-glove onboarding", "Direct founder access"],
      icon: Crown,
      color: "text-harmonix-regal-gold",
      bgColor: "bg-harmonix-regal-gold/10",
      borderColor: "border-harmonix-regal-gold/30",
      badge: "Most Popular"
    },
    {
      id: "premium" as AccessType,
      title: "Premium Access",
      subtitle: "Start immediately",
      price: "30% deposit",
      description: "Begin with any package today",
      benefits: ["Immediate platform access", "50% founding member discount", "Dedicated success manager", "Custom agent development"],
      icon: Rocket,
      color: "text-harmonix-gold",
      bgColor: "bg-harmonix-gold/10",
      borderColor: "border-harmonix-gold/30",
      badge: "Best Value"
    },
    {
      id: "account" as AccessType,
      title: "Create Account",
      subtitle: "Already have access?",
      price: "Sign up",
      description: "Create your Harmonix account",
      benefits: ["Access your dashboard", "Manage your agents", "Track performance"],
      icon: UserCheck,
      color: "text-jade-forest",
      bgColor: "bg-jade-forest/10",
      borderColor: "border-jade-forest/30"
    }
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 4400,
      agents: 2,
      features: ["2 AI Agents", "Basic CRM", "Email support"]
    },
    {
      id: "growth",
      name: "Growth",
      price: 8000,
      agents: 5,
      features: ["5 AI Agents", "Advanced CRM", "Priority support"],
      recommended: true
    },
    {
      id: "expansion",
      name: "Expansion",
      price: 15000,
      agents: 8,
      features: ["8 AI Agents", "Full integration", "Success manager"]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 21500,
      agents: "Unlimited",
      features: ["Unlimited agents", "Custom development", "24/7 support"]
    }
  ];

  const handleAccessTypeChange = (type: AccessType) => {
    setAccessType(type);
    if (type === "account") {
      setCurrentStep(3); // Skip to account creation
    } else {
      setCurrentStep(1);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (accessType === "account" && (!formData.password || formData.password.length < 8)) {
      toast({
        title: "Password Required",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Determine submission data based on access type
      const submissionData = {
        ...formData,
        source: 'unified_join_page',
        accessType,
        tags: ['harmonix_join', accessType],
        leadValue: accessType === 'premium' ? (plans.find(p => p.id === formData.selectedPlan)?.price || 0) : 
                   accessType === 'vip' ? 444 : 0
      };

      if (accessType === "account") {
        // Create account directly
        await register(formData.email, formData.password!, formData.name, undefined, formData.company);
        toast({
          title: "Welcome to Harmonix!",
          description: "Your account has been created successfully.",
        });
        setLocation("/dashboard");
        return;
      }

      // Submit to GHL CRM for all other access types
      const response = await fetch('/api/ghl-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      const result = await response.json();

      // Handle different access types
      switch (accessType) {
        case "waitlist":
          toast({
            title: "Welcome to the Waitlist!",
            description: "You'll receive priority updates and early access notifications.",
          });
          setLocation("/thank-you?type=waitlist");
          break;
          
        case "vip":
          // Redirect to Stripe for VIP deposit
          const vipCheckout = await fetch('/api/create-vip-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accessType: 'vip',
              customerData: formData,
              ghlContactId: result.contactId
            }),
          });
          const { url: vipUrl } = await vipCheckout.json();
          window.location.href = vipUrl;
          break;
          
        case "premium":
          // Create checkout session for premium plan
          const premiumCheckout = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plan: formData.selectedPlan || 'growth',
              customerData: formData,
              depositPercentage: 30
            }),
          });
          const { url: premiumUrl } = await premiumCheckout.json();
          window.location.href = premiumUrl;
          break;
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: "Please try again or contact our support team.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Choose Your Access Level";
      case 2: return accessType === "premium" ? "Select Your Plan" : "Tell Us About You";
      case 3: return accessType === "account" ? "Create Your Account" : "Complete Your Profile";
      default: return "";
    }
  };

  const getProgress = () => {
    if (accessType === "account") return 100;
    return (currentStep / 3) * 100;
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-deep-space-black">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-jade-forest/30 via-transparent to-harmonix-gold/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <HarmonixLogo size="xl" variant="scenic" className="harmonix-logo-glow" />
              </div>
              
              <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Limited Early Access
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                Join the <span className="text-harmonix-regal-gold">Harmonix</span> Revolution
              </h1>
              
              <p className="text-xl sm:text-2xl text-harmonix-sage-fade max-w-3xl mx-auto mb-8">
                Build. Automate. Exit. Start your journey to business freedom with AI-powered automation.
              </p>
              
              {/* Progress Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-harmonix-sage-fade">
                    {getStepTitle()}
                  </span>
                  <span className="text-sm font-medium text-harmonix-sage-fade">
                    {Math.round(getProgress())}% Complete
                  </span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Step 1: Choose Access Type */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {accessOptions.map((option) => (
                    <Card 
                      key={option.id}
                      className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                        accessType === option.id ? 'ring-2 ring-harmonix-regal-gold' : ''
                      } ${option.bgColor} ${option.borderColor}`}
                      onClick={() => handleAccessTypeChange(option.id)}
                    >
                      {option.badge && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-harmonix-regal-gold text-deep-space-black">
                          {option.badge}
                        </Badge>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <div className={`mx-auto w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mb-4`}>
                          <option.icon className={`w-8 h-8 ${option.color}`} />
                        </div>
                        <CardTitle className={`text-xl font-bold ${option.color}`}>
                          {option.title}
                        </CardTitle>
                        <p className="text-2xl font-bold text-white mt-2">{option.price}</p>
                        <CardDescription className="text-harmonix-sage-fade mt-2">
                          {option.subtitle}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm text-harmonix-sage-fade mb-4">{option.description}</p>
                        <ul className="space-y-2">
                          {option.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className={`w-4 h-4 ${option.color} mr-2 mt-0.5 flex-shrink-0`} />
                              <span className="text-harmonix-sage-fade">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button 
                    size="lg"
                    onClick={handleNext}
                    disabled={!accessType}
                    className="touch-friendly-btn bg-harmonix-regal-gold text-deep-space-black hover:bg-harmonix-regal-gold/90"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Plan Selection (for premium) or Basic Info */}
            {currentStep === 2 && (
              <div className="animate-fade-in max-w-4xl mx-auto">
                {accessType === "premium" ? (
                  // Plan Selection for Premium Access
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-center text-harmonix-regal-gold mb-8">
                      Select Your Perfect Plan
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {plans.map((plan) => (
                        <Card 
                          key={plan.id}
                          className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                            formData.selectedPlan === plan.id ? 'ring-2 ring-harmonix-regal-gold' : ''
                          } ${plan.recommended ? 'border-harmonix-regal-gold' : 'border-jade-forest/30'}`}
                          onClick={() => updateFormData('selectedPlan', plan.id)}
                        >
                          {plan.recommended && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-harmonix-regal-gold text-deep-space-black">
                              Recommended
                            </Badge>
                          )}
                          
                          <CardHeader>
                            <CardTitle className="text-2xl text-harmonix-regal-gold">
                              {plan.name}
                            </CardTitle>
                            <p className="text-3xl font-bold text-white mt-2">
                              ${plan.price.toLocaleString()}
                              <span className="text-sm text-harmonix-sage-fade ml-2">
                                30% deposit: ${Math.round(plan.price * 0.3).toLocaleString()}
                              </span>
                            </p>
                          </CardHeader>
                          
                          <CardContent>
                            <p className="text-harmonix-sage-fade mb-4">
                              {typeof plan.agents === 'number' ? `${plan.agents} AI Agents` : plan.agents}
                            </p>
                            <ul className="space-y-2">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <CheckCircle className="w-4 h-4 text-harmonix-regal-gold mr-2 mt-0.5" />
                                  <span className="text-harmonix-sage-fade">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Basic Info Form
                  <Card className="harmonix-card-enhanced">
                    <CardHeader>
                      <CardTitle className="text-2xl text-harmonix-regal-gold">
                        Tell Us About You
                      </CardTitle>
                      <CardDescription>
                        We'll use this to customize your experience
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-harmonix-sage-fade">
                              Full Name *
                            </Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => updateFormData('name', e.target.value)}
                              placeholder="John Doe"
                              className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-harmonix-sage-fade">
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateFormData('email', e.target.value)}
                              placeholder="john@company.com"
                              className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-harmonix-sage-fade">
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => updateFormData('phone', e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="company" className="text-harmonix-sage-fade">
                              Company Name
                            </Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => updateFormData('company', e.target.value)}
                              placeholder="Acme Corp"
                              className="bg-deep-space-black/50 border-jade-forest/30 text-white"
                            />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline"
                    onClick={handleBack}
                    className="border-jade-forest/30 text-jade-forest hover:bg-jade-forest/10"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-harmonix-regal-gold text-deep-space-black hover:bg-harmonix-regal-gold/90"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Complete Profile or Create Account */}
            {currentStep === 3 && (
              <div className="animate-fade-in max-w-4xl mx-auto">
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold">
                      {accessType === "account" ? "Create Your Account" : "Complete Your Profile"}
                    </CardTitle>
                    <CardDescription>
                      {accessType === "account" 
                        ? "Set up your login credentials" 
                        : "Help us understand your business needs"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {accessType === "account" ? (
                        // Account Creation Fields
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-harmonix-sage-fade">
                                Full Name *
                              </Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateFormData('name', e.target.value)}
                                placeholder="John Doe"
                                className="bg-deep-space-black/50 border-jade-forest/30 text-white"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-harmonix-sage-fade">
                                Email Address *
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                placeholder="john@company.com"
                                className="bg-deep-space-black/50 border-jade-forest/30 text-white"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-harmonix-sage-fade">
                              Password *
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password || ""}
                                onChange={(e) => updateFormData('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                className="bg-deep-space-black/50 border-jade-forest/30 text-white pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-harmonix-sage-fade hover:text-white"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="company" className="text-harmonix-sage-fade">
                              Company Name
                            </Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => updateFormData('company', e.target.value)}
                              placeholder="Acme Corp"
                              className="bg-deep-space-black/50 border-jade-forest/30 text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        // Business Profile Fields
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="businessType" className="text-harmonix-sage-fade">
                                Business Type
                              </Label>
                              <Select value={formData.businessType} onValueChange={(value) => updateFormData('businessType', value)}>
                                <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="saas">SaaS</SelectItem>
                                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                                  <SelectItem value="agency">Agency</SelectItem>
                                  <SelectItem value="consulting">Consulting</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="teamSize" className="text-harmonix-sage-fade">
                                Team Size
                              </Label>
                              <Select value={formData.teamSize} onValueChange={(value) => updateFormData('teamSize', value)}>
                                <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-5">1-5</SelectItem>
                                  <SelectItem value="6-20">6-20</SelectItem>
                                  <SelectItem value="21-50">21-50</SelectItem>
                                  <SelectItem value="51-200">51-200</SelectItem>
                                  <SelectItem value="200+">200+</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="revenue" className="text-harmonix-sage-fade">
                                Annual Revenue
                              </Label>
                              <Select value={formData.revenue} onValueChange={(value) => updateFormData('revenue', value)}>
                                <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                                  <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0-100k">$0 - $100K</SelectItem>
                                  <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                                  <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                                  <SelectItem value="5m+">$5M+</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="interests" className="text-harmonix-sage-fade">
                              What are you most interested in?
                            </Label>
                            <Textarea
                              id="interests"
                              value={formData.interests}
                              onChange={(e) => updateFormData('interests', e.target.value)}
                              placeholder="Tell us about your automation goals..."
                              rows={4}
                              className="bg-deep-space-black/50 border-jade-forest/30 text-white"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          disabled={isSubmitting}
                          className="border-jade-forest/30 text-jade-forest hover:bg-jade-forest/10"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-harmonix-regal-gold text-deep-space-black hover:bg-harmonix-regal-gold/90"
                        >
                          {isSubmitting ? (
                            <>
                              <WhimsicalLoader variant="minimal" size="sm" className="mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {accessType === "account" ? "Create Account" : 
                               accessType === "waitlist" ? "Join Waitlist" :
                               accessType === "vip" ? "Proceed to Payment" :
                               "Continue to Checkout"}
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-harmonix-night-pine/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-harmonix-regal-gold mb-12">
              Why Join Harmonix?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="harmonix-card-enhanced">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 text-harmonix-regal-gold mb-4" />
                  <CardTitle className="text-xl text-harmonix-regal-gold">
                    10x Your Productivity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-harmonix-sage-fade">
                    Automate repetitive tasks and focus on strategy. Our AI agents handle the busy work while you scale.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="harmonix-card-enhanced">
                <CardHeader>
                  <Shield className="w-12 h-12 text-harmonix-regal-gold mb-4" />
                  <CardTitle className="text-xl text-harmonix-regal-gold">
                    Enterprise Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-harmonix-sage-fade">
                    Bank-level encryption and SOC 2 compliance. Your data and your customers' data are always protected.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="harmonix-card-enhanced">
                <CardHeader>
                  <Globe className="w-12 h-12 text-harmonix-regal-gold mb-4" />
                  <CardTitle className="text-xl text-harmonix-regal-gold">
                    Global Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-harmonix-sage-fade">
                    Join thousands of forward-thinking businesses already transforming their operations with AI.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}