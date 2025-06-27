import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, TrendingUp, Heart, Zap, Brain, Globe } from "lucide-react";

export default function Careers() {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "5+ years",
      description: "Lead development of AI agent orchestration systems and SŌL brain engine improvements."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time", 
      experience: "3+ years",
      description: "Design intuitive interfaces for AI agent management and workflow automation."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years", 
      description: "Scale infrastructure for enterprise AI automation platform."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      experience: "2+ years",
      description: "Help enterprises maximize value from their AI agent implementations."
    }
  ];

  const benefits = [
    { icon: Globe, title: "Remote-First", description: "Work from anywhere in the world" },
    { icon: TrendingUp, title: "Equity Package", description: "Share in our growth and success" },
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive health coverage" },
    { icon: Brain, title: "Learning Budget", description: "$2000/year for professional development" },
    { icon: Clock, title: "Flexible Hours", description: "Work when you're most productive" },
    { icon: Users, title: "Team Retreats", description: "Annual in-person team gatherings" }
  ];

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="harmonix-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-harmonix-regal-gold font-serif mb-6">
              Join the Harmonix Team
            </h1>
            <p className="text-lg text-harmonix-sage-fade max-w-3xl mx-auto">
              Help us build the future of AI automation. We're looking for passionate individuals 
              who want to transform how businesses operate through intelligent systems.
            </p>
          </div>

          {/* Company Culture */}
          <Card className="harmonix-card-enhanced mb-12">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg text-harmonix-sage-fade">
                We believe in empowering visionary businesses to Build, Automate, and Exit through 
                intelligent AI systems. Our team is dedicated to creating technology that enhances 
                human potential rather than replacing it.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Badge className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                  Innovation-Driven
                </Badge>
                <Badge className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                  Remote-First
                </Badge>
                <Badge className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                  Customer-Obsessed
                </Badge>
                <Badge className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                  Continuous Learning
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-harmonix-regal-gold text-center mb-8">
              Why Work at Harmonix?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="harmonix-card-enhanced">
                  <CardContent className="p-6 text-center">
                    <benefit.icon className="w-8 h-8 text-harmonix-regal-gold mx-auto mb-4" />
                    <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-harmonix-sage-fade text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold text-harmonix-regal-gold text-center mb-8">
              Open Positions
            </h2>
            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <Card key={index} className="harmonix-card-enhanced">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">{position.title}</h3>
                          <Badge className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                            {position.department}
                          </Badge>
                        </div>
                        
                        <p className="text-harmonix-sage-fade mb-4">{position.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-harmonix-sage-fade">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {position.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {position.type}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {position.experience}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <Button className="bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="harmonix-card-enhanced mt-12">
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Don't see a perfect fit?
              </h3>
              <p className="text-harmonix-sage-fade mb-6">
                We're always looking for exceptional talent. Send us your resume and let us know 
                how you'd like to contribute to the future of AI automation.
              </p>
              <Button 
                className="bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                onClick={() => window.location.href = '/contact'}
              >
                Get in Touch
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}