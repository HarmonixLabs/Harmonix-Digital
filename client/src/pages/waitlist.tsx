import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Zap, Star, Timer, ArrowRight, Sparkles } from "lucide-react";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { MysticalTooltip } from "@/components/ui/animated-tooltip";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    useCase: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: Zap,
      title: "Priority Access",
      description: "First access to all 12+ AI agents and SŌL brain engine"
    },
    {
      icon: Star,
      title: "Early Bird Pricing",
      description: "30% discount locked in for your entire first year"
    },
    {
      icon: Users,
      title: "Exclusive Community",
      description: "Direct access to founders and priority support"
    },
    {
      icon: Timer,
      title: "Beta Features",
      description: "Test new agents and marketplace features first"
    }
  ];

  if (submitted) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-deep-space-black">
          <Navbar />
          
          <div className="pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex justify-center mb-8">
                <HarmonixLogo variant="monogram" className="w-20 h-20" />
              </div>
              
              <CheckCircle className="w-16 h-16 text-harmonix-gold mx-auto mb-6" />
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to the Inner Circle
              </h1>
              
              <p className="text-xl text-jade-forest/80 mb-8">
                You're now part of the exclusive Harmonix community. 
                <br />
                <span className="text-harmonix-gold">Build. Automate. Exit.</span> begins soon.
              </p>
              
              <div className="space-y-4 text-jade-forest/60">
                <p>• Check your email for priority access details</p>
                <p>• Follow-up with onboarding specialist within 24 hours</p>
                <p>• Early bird pricing locked in at 30% off</p>
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-deep-space-black">
        <Navbar />
        
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <HarmonixLogo variant="monogram" className="w-16 h-16" />
              </div>
              
              <Badge className="bg-gradient-to-r from-harmonix-gold/20 to-jade-forest/20 text-harmonix-gold border-harmonix-gold/40 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Limited Time Offer - Early Bird 30% Off
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Join the Harmonix Revolution
              </h1>
              
              <p className="text-xl text-jade-forest/80 max-w-2xl mx-auto mb-2">
                <span className="text-harmonix-gold">Intelligent Systems for Timeless Sovereignty</span>
              </p>
              
              <p className="text-lg text-jade-forest/60 max-w-2xl mx-auto">
                Be among the first to experience the future where your business works for you, 
                not you working for your business.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Waitlist Form */}
              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    Reserve Your Spot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Input
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-deep-space-black/50 border-jade-forest/30 text-white placeholder:text-jade-forest/50"
                        required
                      />
                      
                      <Input
                        type="email"
                        placeholder="Business Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-deep-space-black/50 border-jade-forest/30 text-white placeholder:text-jade-forest/50"
                        required
                      />
                      
                      <Input
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-deep-space-black/50 border-jade-forest/30 text-white placeholder:text-jade-forest/50"
                        required
                      />
                      
                      <Select onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select onValueChange={(value) => handleInputChange("useCase", value)}>
                        <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                          <SelectValue placeholder="Primary Use Case" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead-generation">Lead Generation</SelectItem>
                          <SelectItem value="customer-support">Customer Support</SelectItem>
                          <SelectItem value="content-creation">Content Creation</SelectItem>
                          <SelectItem value="workflow-automation">Workflow Automation</SelectItem>
                          <SelectItem value="data-analysis">Data Analysis</SelectItem>
                          <SelectItem value="project-management">Project Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <MysticalTooltip content="Join the exclusive early access community">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-harmonix-gold to-[#F4E4A1] text-deep-space-black font-semibold hover:scale-105 transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <WhimsicalLoader variant="minimal" size="sm" />
                        ) : (
                          <>
                            <ArrowRight className="w-5 h-5 mr-2" />
                            Secure Priority Access
                          </>
                        )}
                      </Button>
                    </MysticalTooltip>
                  </form>
                </CardContent>
              </Card>

              {/* Benefits */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Why Join Now?
                </h3>
                
                {benefits.map((benefit, index) => (
                  <Card key={index} className="bg-harmonix-night-pine/20 border-jade-forest/20 p-6">
                    <div className="flex items-start gap-4">
                      <benefit.icon className="w-6 h-6 text-harmonix-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">{benefit.title}</h4>
                        <p className="text-jade-forest/80 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Card className="bg-gradient-to-r from-jade-forest/10 to-harmonix-gold/10 border-harmonix-gold/30 p-6">
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-2">The Vision</h4>
                    <p className="text-jade-forest/80 text-sm italic">
                      "Have your business work for you, not you working for your business."
                    </p>
                    <p className="text-harmonix-gold text-xs mt-2">— Harmonix Founding Principle</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageWrapper>
  );
}