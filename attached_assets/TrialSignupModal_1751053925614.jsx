import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Sparkles, ArrowRight, CheckCircle, Users, Building, Shield, AlertCircle } from 'lucide-react';
import { authAPI, APIError, tokenManager } from '../lib/api.js';

const TrialSignupModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    teamSize: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    marketingConsent: false
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
    'Education', 'Real Estate', 'Marketing', 'Consulting', 'Other'
  ];

  const teamSizes = [
    { value: 'solo', label: 'Just Me' },
    { value: 'small', label: '2-10 people' },
    { value: 'medium', label: '11-50 people' },
    { value: 'large', label: '50+ people' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'What should we call you?';
      if (!formData.email.trim()) newErrors.email = 'Where should we send updates?';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (step === 2) {
      if (!formData.industry) newErrors.industry = 'This helps us customize your experience';
      if (!formData.teamSize) newErrors.teamSize = 'This helps us recommend the right features';
    }
    
    if (step === 3) {
      if (!formData.password) newErrors.password = 'Please create a password';
      else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Please accept the terms to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      // Prepare registration data
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone?.trim() || null,
        company: formData.company?.trim() || null,
        industry: formData.industry,
        teamSize: formData.teamSize,
        password: formData.password,
        acceptTerms: formData.acceptTerms,
        marketingConsent: formData.marketingConsent
      };

      // Call registration API
      const response = await authAPI.register(registrationData);
      
      if (response.success) {
        // Store token
        tokenManager.setToken(response.data.token);
        
        // Close modal and notify parent
        onClose();
        if (onSuccess) {
          onSuccess(response.data.user);
        }
        
        // Show success message (you could use a toast library here)
        console.log('Registration successful:', response.message);
      }
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error instanceof APIError) {
        if (error.isValidationError) {
          // Handle validation errors
          setErrors(error.validationErrors);
        } else if (error.isNetworkError) {
          setErrors({ 
            submit: 'Network error. Please check your connection and try again.' 
          });
        } else {
          setErrors({ 
            submit: error.message || 'Registration failed. Please try again.' 
          });
        }
      } else {
        setErrors({ 
          submit: 'Something went wrong. Please try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Almost There! Let's Set Up Your AI Team</h3>
        <p className="text-muted-foreground">Tell us a bit about yourself to get started</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium">What should we call you? *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your first name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className={`mt-1 ${errors.name ? 'border-destructive' : ''}`}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <Label htmlFor="email" className="text-base font-medium">Where should we send updates? *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div>
      </div>
      
      <Card className="bg-accent/10 border-accent/20">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-accent" />
            <span>Your information is secure and will never be shared</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Tell Us About Your Business</h3>
        <p className="text-muted-foreground">This helps us customize your AI team for you</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="company" className="text-base font-medium">What's your company called?</Label>
          <Input
            id="company"
            type="text"
            placeholder="Company name (optional)"
            value={formData.company}
            onChange={(e) => updateFormData('company', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-base font-medium">What industry are you in? *</Label>
          <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
            <SelectTrigger className={`mt-1 ${errors.industry ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Choose your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry.toLowerCase()}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-sm text-destructive mt-1">{errors.industry}</p>}
        </div>
        
        <div>
          <Label className="text-base font-medium">How big is your team? *</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {teamSizes.map((size) => (
              <Button
                key={size.value}
                type="button"
                variant={formData.teamSize === size.value ? "default" : "outline"}
                className="justify-start h-auto py-3"
                onClick={() => updateFormData('teamSize', size.value)}
              >
                <Users className="h-4 w-4 mr-2" />
                {size.label}
              </Button>
            ))}
          </div>
          {errors.teamSize && <p className="text-sm text-destructive mt-1">{errors.teamSize}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Secure Your Account</h3>
        <p className="text-muted-foreground">Create a password to protect your AI team</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="password" className="text-base font-medium">Create a password *</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className={`mt-1 ${errors.password ? 'border-destructive' : ''}`}
          />
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
        </div>
        
        <div>
          <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm your password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Type your password again"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className={`mt-1 ${errors.confirmPassword ? 'border-destructive' : ''}`}
          />
          {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
        </div>
        
        <div className="space-y-3 pt-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => updateFormData('acceptTerms', checked)}
              className={errors.acceptTerms ? 'border-destructive' : ''}
            />
            <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a> *
            </Label>
          </div>
          {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}
          
          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketingConsent"
              checked={formData.marketingConsent}
              onCheckedChange={(checked) => updateFormData('marketingConsent', checked)}
            />
            <Label htmlFor="marketingConsent" className="text-sm leading-relaxed text-muted-foreground">
              Send me tips and updates about AI and business automation
            </Label>
          </div>
        </div>
      </div>
      
      <Card className="bg-accent/10 border-accent/20">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span className="font-medium">Your 7-day trial starts immediately</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            No credit card required • Cancel anytime • Full access to all 12 AI agents
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Step {currentStep} of {totalSteps}
          </DialogTitle>
          <Progress value={progress} className="w-full mt-2" />
        </DialogHeader>
        
        <div className="py-4">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
        
        {errors.submit && (
          <div className="flex items-start space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}
        
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
          >
            Back
          </Button>
          
          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up...
              </div>
            ) : currentStep === totalSteps ? (
              <>
                Start Trial
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Join 10,000+ businesses already using AI • Trusted by teams worldwide
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrialSignupModal;

