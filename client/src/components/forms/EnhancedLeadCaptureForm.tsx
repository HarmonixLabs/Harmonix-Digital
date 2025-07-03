import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import leadService from '@/lib/multi-crm-lead-service';

// Form validation schema
const leadCaptureSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  business: z.string().min(1, 'Business name is required'),
  phone: z.string().optional(),
  source: z.string().optional(),
  formType: z.string().optional(),
});

type LeadCaptureData = z.infer<typeof leadCaptureSchema>;

interface EnhancedLeadCaptureFormProps {
  formType?: 'waitlist' | 'demo' | 'contact' | 'consultation';
  source?: string;
  title?: string;
  description?: string;
  submitButtonText?: string;
  onSuccess?: (data: LeadCaptureData) => void;
  className?: string;
}

export default function EnhancedLeadCaptureForm({
  formType = 'waitlist',
  source = 'website',
  title = 'Join the Waitlist',
  description = 'Get early access to Harmonix AI Agent Platform',
  submitButtonText = 'Join Waitlist',
  onSuccess,
  className = '',
}: EnhancedLeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const form = useForm<LeadCaptureData>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      business: '',
      phone: '',
      source,
      formType,
    },
  });

  const onSubmit = async (data: LeadCaptureData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Add UTM parameters and metadata
      const enrichedData = {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        utmSource: getUrlParam('utm_source'),
        utmMedium: getUrlParam('utm_medium'),
        utmCampaign: getUrlParam('utm_campaign'),
        utmTerm: getUrlParam('utm_term'),
        utmContent: getUrlParam('utm_content'),
      };

      const result = await leadService.submitLead(enrichedData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your information has been submitted successfully. We\'ll be in touch soon.',
        });
        form.reset();
        onSuccess?.(data);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'There was an error submitting your information. Please try again.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrlParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  };

  const clearStatus = () => setSubmitStatus({ type: null, message: '' });

  return (
    <Card className={`w-full max-w-md mx-auto bg-white/5 backdrop-blur-sm border-primary/20 ${className}`}>
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-secondary text-white">
          {title}
        </CardTitle>
        {description && (
          <p className="text-neutral-light text-sm leading-relaxed">
            {description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label 
                htmlFor="firstName" 
                className="text-neutral-light text-sm font-medium"
              >
                First Name*
              </Label>
              <Input
                id="firstName"
                type="text"
                className={`
                  bg-background-secondary/50 border-primary/30 text-white placeholder:text-neutral-medium
                  focus:border-accent-base focus:ring-accent-base/20
                  transition-all duration-normal
                  ${form.formState.errors.firstName ? 'border-status-error' : ''}
                `}
                placeholder="John"
                {...form.register('firstName')}
                onChange={(e) => {
                  form.setValue('firstName', e.target.value);
                  if (submitStatus.type) clearStatus();
                }}
              />
              {form.formState.errors.firstName && (
                <p className="text-status-error text-xs mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="lastName" 
                className="text-neutral-light text-sm font-medium"
              >
                Last Name*
              </Label>
              <Input
                id="lastName"
                type="text"
                className={`
                  bg-background-secondary/50 border-primary/30 text-white placeholder:text-neutral-medium
                  focus:border-accent-base focus:ring-accent-base/20
                  transition-all duration-normal
                  ${form.formState.errors.lastName ? 'border-status-error' : ''}
                `}
                placeholder="Doe"
                {...form.register('lastName')}
                onChange={(e) => {
                  form.setValue('lastName', e.target.value);
                  if (submitStatus.type) clearStatus();
                }}
              />
              {form.formState.errors.lastName && (
                <p className="text-status-error text-xs mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="text-neutral-light text-sm font-medium"
            >
              Email Address*
            </Label>
            <Input
              id="email"
              type="email"
              className={`
                bg-background-secondary/50 border-primary/30 text-white placeholder:text-neutral-medium
                focus:border-accent-base focus:ring-accent-base/20
                transition-all duration-normal
                ${form.formState.errors.email ? 'border-status-error' : ''}
              `}
              placeholder="john@company.com"
              {...form.register('email')}
              onChange={(e) => {
                form.setValue('email', e.target.value);
                if (submitStatus.type) clearStatus();
              }}
            />
            {form.formState.errors.email && (
              <p className="text-status-error text-xs mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Business Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="business" 
              className="text-neutral-light text-sm font-medium"
            >
              Business Name*
            </Label>
            <Input
              id="business"
              type="text"
              className={`
                bg-background-secondary/50 border-primary/30 text-white placeholder:text-neutral-medium
                focus:border-accent-base focus:ring-accent-base/20
                transition-all duration-normal
                ${form.formState.errors.business ? 'border-status-error' : ''}
              `}
              placeholder="Your Company"
              {...form.register('business')}
              onChange={(e) => {
                form.setValue('business', e.target.value);
                if (submitStatus.type) clearStatus();
              }}
            />
            {form.formState.errors.business && (
              <p className="text-status-error text-xs mt-1">
                {form.formState.errors.business.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="phone" 
              className="text-neutral-light text-sm font-medium"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              className="bg-background-secondary/50 border-primary/30 text-white placeholder:text-neutral-medium focus:border-accent-base focus:ring-accent-base/20 transition-all duration-normal"
              placeholder="(555) 123-4567"
              {...form.register('phone')}
              onChange={(e) => {
                form.setValue('phone', e.target.value);
                if (submitStatus.type) clearStatus();
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full bg-gradient-to-r from-accent-base to-accent-light 
              hover:from-accent-dark hover:to-accent-base
              text-primary-darker font-semibold py-3 px-6
              rounded-lg shadow-lg hover:shadow-xl
              transition-all duration-normal
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105 active:scale-95
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </form>

        {/* Status Messages */}
        {submitStatus.type && (
          <Alert 
            className={`
              border-2 transition-all duration-normal
              ${submitStatus.type === 'success' 
                ? 'border-status-success bg-status-success/10 text-status-success' 
                : 'border-status-error bg-status-error/10 text-status-error'
              }
            `}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <AlertDescription className="ml-2">
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Privacy Notice */}
        <p className="text-xs text-neutral-medium text-center leading-relaxed">
          By submitting this form, you agree to our privacy policy and consent to receive 
          communications about Harmonix AI Agent Platform.
        </p>
      </CardContent>
    </Card>
  );
}