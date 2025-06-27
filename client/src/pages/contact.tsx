import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, Send } from "lucide-react";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { Link } from "wouter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    priority: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
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

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@harmonixdigital.com",
      description: "24-hour response for all inquiries"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      value: "Available in platform",
      description: "Real-time AI concierge assistance"
    },
    {
      icon: Phone,
      title: "Priority Line",
      value: "Enterprise customers only",
      description: "Direct founder access for qualified leads"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "24/7 Digital Operations",
      description: "AI agents never sleep"
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
              
              <Send className="w-16 h-16 text-harmonix-gold mx-auto mb-6" />
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Message Received
              </h1>
              
              <p className="text-xl text-jade-forest/80 mb-8">
                Our team will respond within 24 hours.
                <br />
                <span className="text-harmonix-gold">Build. Automate. Exit.</span> starts with great communication.
              </p>
              
              <div className="space-y-4 text-jade-forest/60">
                <p>• Priority support for enterprise inquiries</p>
                <p>• AI concierge available for immediate assistance</p>
                <p>• Follow-up automation ensures no message is missed</p>
              </div>
              
              <div className="mt-8">
                <Link href="/waitlist">
                  <Button className="bg-gradient-to-r from-harmonix-gold to-[#F4E4A1] text-deep-space-black">
                    Join Waitlist for Priority Support
                  </Button>
                </Link>
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <HarmonixLogo variant="monogram" className="w-16 h-16" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Connect with Harmonix
              </h1>
              
              <p className="text-xl text-jade-forest/80 max-w-2xl mx-auto mb-2">
                <span className="text-harmonix-gold">Intelligent Systems for Timeless Sovereignty</span>
              </p>
              
              <p className="text-lg text-jade-forest/60 max-w-2xl mx-auto">
                Have your business work for you, not you working for your business. 
                Let's discuss how we can help you achieve operational sovereignty.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
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
                    </div>
                    
                    <Input
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="bg-deep-space-black/50 border-jade-forest/30 text-white placeholder:text-jade-forest/50"
                    />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="bg-deep-space-black/50 border-jade-forest/30 text-white placeholder:text-jade-forest/50"
                        required
                      />
                      
                      <Select onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                          <SelectValue placeholder="Priority Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">General Inquiry</SelectItem>
                          <SelectItem value="medium">Business Discussion</SelectItem>
                          <SelectItem value="high">Enterprise Partnership</SelectItem>
                          <SelectItem value="urgent">Technical Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea
                      placeholder="Tell us about your automation needs, current challenges, or how we can help you Build. Automate. Exit."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="bg-deep-space-black/50 border-jade-forest/30 text-white placeholder:text-jade-forest/50 min-h-[120px]"
                      required
                    />
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-harmonix-gold to-[#F4E4A1] text-deep-space-black font-semibold hover:scale-105 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <WhimsicalLoader variant="minimal" size="sm" />
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Get in Touch
                </h3>
                
                {contactMethods.map((method, index) => (
                  <Card key={index} className="bg-harmonix-night-pine/20 border-jade-forest/20 p-6">
                    <div className="flex items-start gap-4">
                      <method.icon className="w-6 h-6 text-harmonix-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{method.title}</h4>
                        <p className="text-harmonix-gold text-sm font-medium mb-1">{method.value}</p>
                        <p className="text-jade-forest/80 text-sm">{method.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* Location Card */}
                <Card className="bg-harmonix-night-pine/20 border-jade-forest/20 p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-harmonix-gold mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Digital First</h4>
                      <p className="text-harmonix-gold text-sm font-medium mb-1">Global Operations</p>
                      <p className="text-jade-forest/80 text-sm">
                        Our AI agents operate across all time zones, ensuring continuous support and service delivery.
                      </p>
                    </div>
                  </div>
                </Card>
                
                {/* CTA Card */}
                <Card className="bg-gradient-to-r from-jade-forest/10 to-harmonix-gold/10 border-harmonix-gold/30 p-6">
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-4">Ready to Transform Your Business?</h4>
                    <p className="text-jade-forest/80 text-sm mb-4">
                      Join our waitlist for priority access to the platform that will change how you work.
                    </p>
                    <Link href="/waitlist">
                      <Button size="lg" variant="outline" className="border-harmonix-gold text-harmonix-gold hover:bg-harmonix-gold/10">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Join Priority Waitlist
                      </Button>
                    </Link>
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