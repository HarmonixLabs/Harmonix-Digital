import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, Phone, Building2, CheckCircle, Loader2 } from 'lucide-react';
import { universalLeadCapture, LeadCaptureData, LeadCaptureResponse } from '@/lib/universal-lead-capture';
import { motion } from 'framer-motion';

interface UniversalLeadFormProps {
  formType: LeadCaptureData['formType'];
  source: string;
  title?: string;
  description?: string;
  submitButtonText?: string;
  onSuccess?: (response: LeadCaptureResponse) => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: 'default' | 'modal' | 'inline' | 'minimal';
  showInterests?: boolean;
  additionalData?: Partial<LeadCaptureData>;
}

const interestOptions = [
  'Sales Automation',
  'Lead Generation', 
  'CRM Integration',
  'Customer Support',
  'Content Creation',
  'Analytics & Reporting',
  'Custom AI Solutions',
  'Process Automation',
  'Data Analysis',
  'Customer Experience'
];

export default function UniversalLeadForm({
  formType,
  source,
  title,
  description,
  submitButtonText,
  onSuccess,
  onError,
  className = '',
  variant = 'default',
  showInterests,
  additionalData = {}
}: UniversalLeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    interests: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Get form configuration
  const config = universalLeadCapture.getFormConfig(formType);
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalSubmitText = submitButtonText || config.submitText;
  const shouldShowInterests = showInterests !== undefined ? showInterests : config.interests;
  const requiredFields = config.fields;

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare lead data
      const leadData: LeadCaptureData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        interests: formData.interests,
        formType,
        source,
        page: window.location.pathname,
        ...additionalData
      };

      // Submit through universal lead capture
      const response = await universalLeadCapture.captureeLead(leadData);

      if (response.success) {
        setIsSubmitted(true);
        toast({
          title: 'Success!',
          description: response.message || 'We\'ve received your information and will be in touch soon.',
        });

        if (onSuccess) {
          onSuccess(response);
        }
      } else {
        throw new Error(response.message || 'Failed to submit form');
      }

    } catch (error) {
      const errorMessage = error.message || 'Failed to submit form. Please try again.';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`${getVariantClasses(variant)} ${className}`}>
          <CardContent className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-status-success mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
            <p className="text-neutral-light text-sm">
              We've received your information and will contact you within 24 hours.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Form state
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${getVariantClasses(variant)} ${className}`}>
        {variant !== 'minimal' && (
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-white">
              {finalTitle}
            </CardTitle>
            {finalDescription && (
              <p className="text-neutral-light text-sm">
                {finalDescription}
              </p>
            )}
          </CardHeader>
        )}
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            {requiredFields.includes('name') && (
              <div>
                <Label htmlFor="name" className="text-neutral-light flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 bg-background-secondary border-primary/20 text-white placeholder:text-neutral-medium"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-neutral-light flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 bg-background-secondary border-primary/20 text-white placeholder:text-neutral-medium"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone Field */}
            {requiredFields.includes('phone') && (
              <div>
                <Label htmlFor="phone" className="text-neutral-light flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 bg-background-secondary border-primary/20 text-white placeholder:text-neutral-medium"
                  placeholder="Enter your phone number"
                />
              </div>
            )}

            {/* Company Field */}
            {requiredFields.includes('company') && (
              <div>
                <Label htmlFor="company" className="text-neutral-light flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  Company Name
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="mt-1 bg-background-secondary border-primary/20 text-white placeholder:text-neutral-medium"
                  placeholder="Enter your company name"
                />
              </div>
            )}

            {/* Message Field */}
            {requiredFields.includes('message') && (
              <div>
                <Label htmlFor="message" className="text-neutral-light text-sm">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="mt-1 bg-background-secondary border-primary/20 text-white placeholder:text-neutral-medium"
                  placeholder="Tell us about your needs..."
                  rows={3}
                />
              </div>
            )}

            {/* Interests */}
            {shouldShowInterests && (
              <div>
                <Label className="text-neutral-light mb-2 block text-sm">
                  Areas of Interest (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.slice(0, 6).map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        className="border-primary/30 data-[state=checked]:bg-accent-base data-[state=checked]:border-accent-base"
                      />
                      <label 
                        htmlFor={`interest-${interest}`} 
                        className="text-neutral-light text-xs cursor-pointer"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-base hover:bg-accent-dark text-background-primary font-medium py-2"
              size={variant === 'minimal' ? 'sm' : 'default'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                finalSubmitText
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getVariantClasses(variant: string): string {
  switch (variant) {
    case 'modal':
      return 'max-w-md mx-auto bg-background-primary/95 backdrop-blur border-primary/20';
    case 'inline':
      return 'bg-background-secondary/30 border-primary/10';
    case 'minimal':
      return 'bg-transparent border-0 shadow-none';
    default:
      return 'bg-background-primary/80 backdrop-blur border-primary/20';
  }
}