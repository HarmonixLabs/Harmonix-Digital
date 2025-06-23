import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, User, Phone, Building2, CheckCircle } from "lucide-react";

interface LeadCaptureFormProps {
  source?: string;
  onSuccess?: () => void;
  className?: string;
}

export function LeadCaptureForm({ source = "website", onSuccess, className = "" }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    company: "",
    interests: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const interestOptions = [
    "Sales Automation",
    "Lead Generation", 
    "CRM Integration",
    "Customer Support",
    "Content Creation",
    "Analytics & Reporting",
    "Custom AI Solutions"
  ];

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
      const response = await fetch("/api/leads/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      
      setIsSubmitted(true);
      toast({
        title: "Thank you!",
        description: "We've received your information and will be in touch soon.",
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={`harmonix-card-enhanced ${className}`}>
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-harmonix-regal-gold mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-harmonix-sage-fade">
            We've received your information and will contact you within 24 hours to discuss your AI automation needs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`harmonix-card-enhanced ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl text-white text-center">
          Get Started with Harmonix
        </CardTitle>
        <p className="text-harmonix-sage-fade text-center">
          Connect with our team to explore how AI agents can transform your business
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-harmonix-sage-fade flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name *</span>
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-harmonix-sage-fade flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address *</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-harmonix-sage-fade flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-harmonix-sage-fade flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Company Name</span>
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <Label className="text-harmonix-sage-fade mb-3 block">
              Which areas interest you most? (Select all that apply)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                    className="border-harmonix-cedar-mist data-[state=checked]:bg-harmonix-regal-gold"
                  />
                  <label 
                    htmlFor={`interest-${interest}`} 
                    className="text-harmonix-sage-fade text-sm cursor-pointer"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold py-3 text-lg"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Get Started Today"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}