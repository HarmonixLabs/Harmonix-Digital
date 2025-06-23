import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/harmonix-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Sparkles, Crown, Users } from "lucide-react";

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    businessType: "",
    teamSize: "",
    interests: "",
    revenue: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would integrate with GoHighLevel CRM
    // For now, we'll simulate the submission
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      toast({
        title: "Welcome to the Waitlist!",
        description: "You'll receive early access notifications and exclusive updates.",
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: Crown,
      title: "Early Access",
      description: "Be among the first to access Harmony's full capabilities"
    },
    {
      icon: Users,
      title: "Exclusive Community",
      description: "Join a select group of visionary business leaders"
    },
    {
      icon: Sparkles,
      title: "Personal Onboarding",
      description: "Get white-glove setup and agent customization"
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-harmony-dark">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-auto bg-gray-900/50 border-harmony-gold/30">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-harmony-gold/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-harmony-gold" />
              </div>
              <CardTitle className="text-2xl text-harmony-gold font-serif">Welcome to Harmony</CardTitle>
              <CardDescription className="text-gray-300">
                You're now on the exclusive waitlist for intelligent systems that create timeless sovereignty.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">
                Expect to hear from us soon with your early access invitation and personalized setup.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline" 
                className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10"
              >
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Benefits */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <HarmonixLogo size="lg" variant="gold" className="justify-center lg:justify-start mb-6" />
                <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif mb-6">
                  Join the <span className="text-harmony-gold">Harmony</span> Waitlist
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Get early access to intelligent systems for timeless sovereignty. 
                  Be among the first to experience AI automation that grows with your vision.
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-harmony-gold/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-harmony-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-harmony-gold mb-2">{benefit.title}</h3>
                      <p className="text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Form */}
            <Card className="bg-gray-900/50 border-harmony-gold/30">
              <CardHeader>
                <CardTitle className="text-2xl text-harmony-gold font-serif text-center">
                  Request Early Access
                </CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Tell us about your business and automation needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-300">Company Name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-gray-300">Business Type</Label>
                      <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS / Technology</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="finance">Financial Services</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamSize" className="text-gray-300">Team Size</Label>
                      <Select onValueChange={(value) => handleInputChange("teamSize", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 employees</SelectItem>
                          <SelectItem value="6-20">6-20 employees</SelectItem>
                          <SelectItem value="21-50">21-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="200+">200+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests" className="text-gray-300">What interests you most about AI automation?</Label>
                    <Textarea
                      id="interests"
                      placeholder="Tell us about your automation goals and challenges..."
                      value={formData.interests}
                      onChange={(e) => handleInputChange("interests", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold"
                    size="lg"
                  >
                    Join Harmony Waitlist
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}