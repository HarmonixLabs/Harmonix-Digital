import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { MapPin, Clock, DollarSign, Users, Zap, Brain, Code, Palette, TrendingUp } from "lucide-react";

export default function Careers() {
  const positions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150k - $200k",
      description: "Build and optimize AI agents that power the future of business automation.",
      requirements: ["5+ years Python/TypeScript", "Machine Learning expertise", "OpenAI API experience"],
      icon: Brain
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Develop scalable web applications using React, Node.js, and modern technologies.",
      requirements: ["3+ years React/Node.js", "PostgreSQL experience", "AWS/Cloud platforms"],
      icon: Code
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$130k - $170k",
      description: "Design beautiful, intuitive interfaces for our AI agent platform.",
      requirements: ["5+ years UI/UX design", "Figma/Design systems", "B2B SaaS experience"],
      icon: Palette
    },
    {
      title: "Growth Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      salary: "$110k - $140k",
      description: "Drive user acquisition and revenue growth through data-driven marketing.",
      requirements: ["3+ years growth marketing", "SaaS marketing experience", "Analytics expertise"],
      icon: TrendingUp
    }
  ];

  const benefits = [
    "Competitive salary + equity package",
    "Comprehensive health, dental, vision",
    "Unlimited PTO policy",
    "$5,000 learning & development budget",
    "Top-tier equipment and home office setup",
    "Quarterly team retreats",
    "Stock options in a fast-growing AI company",
    "Flexible work arrangements"
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <HarmonixLogo className="w-20 h-20 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-white font-serif mb-4">
              Build the Future of <span className="text-harmony-gold">AI Automation</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join our mission to democratize AI agent technology and empower businesses worldwide. 
              Work with cutting-edge AI, solve complex problems, and shape the future of work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                Learn About Our Culture
              </Button>
            </div>
          </div>

          {/* Company Values */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center font-serif mb-12">
              Our <span className="text-harmony-gold">Values</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gray-900/50 border-gray-800 text-center">
                <CardContent className="p-8">
                  <Zap className="w-12 h-12 text-harmony-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Innovation First</h3>
                  <p className="text-gray-300">Push boundaries and create breakthrough AI solutions that transform industries.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800 text-center">
                <CardContent className="p-8">
                  <Users className="w-12 h-12 text-harmony-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Team Excellence</h3>
                  <p className="text-gray-300">Foster collaboration, diversity, and continuous learning in everything we do.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800 text-center">
                <CardContent className="p-8">
                  <Brain className="w-12 h-12 text-harmony-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Customer Impact</h3>
                  <p className="text-gray-300">Build products that genuinely improve lives and business outcomes.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Open Positions */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center font-serif mb-12">
              Open <span className="text-harmony-gold">Positions</span>
            </h2>
            <div className="space-y-6">
              {positions.map((position, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-harmony-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <position.icon className="w-6 h-6 text-harmony-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{position.title}</h3>
                            <Badge className="bg-harmony-gold/10 text-harmony-gold border-harmony-gold/30">
                              {position.department}
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-4">{position.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {position.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {position.type}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {position.salary}
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">Key Requirements:</p>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {position.requirements.map((req, idx) => (
                                <li key={idx}>• {req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold whitespace-nowrap">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white font-serif mb-6">
                  Why Work at <span className="text-harmony-gold">Harmony</span>?
                </h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  We believe that great people do their best work when they're supported, challenged, 
                  and inspired. Our comprehensive benefits package and culture of innovation create 
                  an environment where you can thrive.
                </p>
                <Button size="lg" className="bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold">
                  Join Our Team
                </Button>
              </div>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-harmony-gold rounded-full mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="bg-gradient-to-r from-harmony-gold/20 to-harmony-gold/10 border-harmony-gold/30">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-white font-serif mb-4">
                  Ready to Shape the Future?
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Don't see a perfect fit? We're always looking for exceptional talent. 
                  Send us your resume and let's start a conversation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold">
                    Send General Application
                  </Button>
                  <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                    Learn More About Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
        
        <Footer />
      </div>
    </PageWrapper>
  );
}