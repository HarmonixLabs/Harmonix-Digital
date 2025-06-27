import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    urgency: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 24 hours.",
      });
      
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        urgency: ""
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="harmonix-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-harmonix-regal-gold font-serif mb-6">
              Contact Harmonix
            </h1>
            <p className="text-lg text-harmonix-sage-fade max-w-2xl mx-auto">
              Ready to transform your business with AI automation? Get in touch with our team.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="harmonix-card-enhanced">
              <CardHeader>
                <CardTitle className="text-harmonix-regal-gold">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-harmonix-sage-fade">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 bg-harmonix-night border-harmonix-cedar-mist"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-harmonix-sage-fade">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 bg-harmonix-night border-harmonix-cedar-mist"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-harmonix-sage-fade">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="mt-1 bg-harmonix-night border-harmonix-cedar-mist"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-harmonix-sage-fade">Subject *</label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger className="mt-1 bg-harmonix-night border-harmonix-cedar-mist">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="demo">Schedule Demo</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-harmonix-sage-fade">Urgency</label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                      <SelectTrigger className="mt-1 bg-harmonix-night border-harmonix-cedar-mist">
                        <SelectValue placeholder="How urgent is this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry</SelectItem>
                        <SelectItem value="medium">Medium - Need response within 3 days</SelectItem>
                        <SelectItem value="high">High - Need response within 24 hours</SelectItem>
                        <SelectItem value="urgent">Urgent - Critical issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-harmonix-sage-fade">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="mt-1 bg-harmonix-night border-harmonix-cedar-mist min-h-[120px]"
                      placeholder="Tell us about your needs..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="harmonix-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-harmonix-regal-gold">Get in touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-5 h-5 text-harmonix-regal-gold mt-1" />
                    <div>
                      <h4 className="font-medium text-white">Email</h4>
                      <p className="text-harmonix-sage-fade">support@harmonix.digital</p>
                      <p className="text-harmonix-sage-fade">sales@harmonix.digital</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-5 h-5 text-harmonix-regal-gold mt-1" />
                    <div>
                      <h4 className="font-medium text-white">Phone</h4>
                      <p className="text-harmonix-sage-fade">+1 (555) 123-4567</p>
                      <p className="text-sm text-harmonix-sage-fade">Business hours only</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 text-harmonix-regal-gold mt-1" />
                    <div>
                      <h4 className="font-medium text-white">Business Hours</h4>
                      <p className="text-harmonix-sage-fade">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p className="text-harmonix-sage-fade">Saturday: 10:00 AM - 2:00 PM EST</p>
                      <p className="text-harmonix-sage-fade">Sunday: Closed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-harmonix-regal-gold mt-1" />
                    <div>
                      <h4 className="font-medium text-white">Headquarters</h4>
                      <p className="text-harmonix-sage-fade">Remote-First Organization</p>
                      <p className="text-harmonix-sage-fade">Serving clients globally</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="harmonix-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-harmonix-regal-gold">Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-harmonix-sage-fade">Sales Inquiries</span>
                    <span className="text-white">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-harmonix-sage-fade">Technical Support</span>
                    <span className="text-white">Within 4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-harmonix-sage-fade">General Questions</span>
                    <span className="text-white">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-harmonix-sage-fade">Urgent Issues</span>
                    <span className="text-white">Within 1 hour</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}