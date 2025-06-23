import React from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/harmonix-logo";
import { SolBrain } from "@/components/sol-brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Zap, Shield, ArrowRight, PlayCircle } from "lucide-react";

export default function HarmonyPage() {
  const features = [
    {
      icon: Brain,
      title: "SŌL Brain Engine",
      description: "Central intelligence that orchestrates all agents with spiritual wisdom and tactical precision"
    },
    {
      icon: Users,
      title: "12+ Digital Team Members",
      description: "Specialized AI agents for sales, HR, marketing, finance, and more"
    },
    {
      icon: Zap,
      title: "Intelligent Automation",
      description: "Build workflows that adapt and evolve with your business needs"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Multi-tenant architecture with role-based access and data sovereignty"
    }
  ];

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <HarmonixLogo size="xl" variant="gold" showText={false} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold text-white font-serif leading-tight">
                <span className="text-harmony-gold">Harmony</span> Platform
              </h1>
              <p className="text-2xl text-harmony-gold font-medium">
                Intelligent Systems for Timeless Sovereignty
              </p>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                The complete AI automation platform that helps visionary businesses Build, Automate, and Exit 
                through intelligent systems orchestrated by the SŌL brain engine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/soul-brain">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Try SŌL Brain Demo
                </Button>
              </Link>
              <Link href="/join">
                <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-serif mb-4">
              Platform Capabilities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Harmony combines AI agents, blockchain technology, and spiritual wisdom 
              to create intelligent systems that grow with your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-harmony-gold/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-harmony-gold" />
                  </div>
                  <CardTitle className="text-harmony-gold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SŌL Brain Demo Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-harmony-gold/10 text-harmony-gold border-harmony-gold/30 mb-4">
                  SŌL Brain Engine
                </Badge>
                <h3 className="text-4xl font-bold text-white font-serif mb-6">
                  Experience Intelligent Orchestration
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed">
                  The SŌL brain is the central intelligence that coordinates all your AI agents, 
                  learns from your business patterns, and provides strategic recommendations 
                  with spiritual wisdom and tactical precision.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Cross-agent learning and knowledge sharing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Strategic business recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Continuous system optimization</span>
                </div>
              </div>

              <Link href="/soul-brain">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                  Try Interactive Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="w-80 h-80">
                <SolBrain size="lg" animated={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
            <h3 className="text-4xl font-bold text-white font-serif mb-6">
              Ready to Transform Your Business?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the select group of visionary businesses using Harmony to build 
              intelligent systems for timeless sovereignty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                  Get Early Access
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                  Browse Agents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}