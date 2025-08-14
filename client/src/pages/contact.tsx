import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Clock } from "lucide-react";

export default function Contact() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <HarmonixLogo className="w-20 h-20 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-white font-serif mb-4">
              Get in <span className="text-harmony-gold">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to transform your business with AI agents? Let's discuss your automation needs.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Send us a message</CardTitle>
                <CardDescription className="text-gray-300">
                  We'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your automation needs..."
                      rows={4}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <Button className="w-full bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold py-3">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-harmony-gold/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-harmony-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <p className="text-gray-300">hello@harmonix.ai</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-harmony-gold/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-harmony-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Phone</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-harmony-gold/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-harmony-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Office</h3>
                      <p className="text-gray-300">San Francisco, CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-harmony-gold/20 to-harmony-gold/10 border-harmony-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-harmony-gold">24h</div>
                      <div className="text-xs text-gray-300">Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-harmony-gold">500+</div>
                      <div className="text-xs text-gray-300">Clients Served</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-harmony-gold">99%</div>
                      <div className="text-xs text-gray-300">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageWrapper>
  );
}