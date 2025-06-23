import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { SolBrain } from "@/components/sol-brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { Play, Users, MessageCircle, Calendar, User, ArrowRight, Lock, Bot, Zap, DollarSign, Clock, Target, Star, Sparkles, CheckCircle, InfoIcon, Mic, MicOff, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedSolInterface } from "@/components/demo/enhanced-sol-interface";

export default function DemoPage() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState(0);
  const [solExpanded, setSolExpanded] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [businessProfile, setBusinessProfile] = useState({
    industry: '',
    goal: '',
    budget: ''
  });

  const demoAgents = [
    {
      id: "sales-rep",
      name: "Sales Rep Agent",
      description: "Books, follows up, and closes for you.",
      monthlyPrice: 320,
      tokenUsage: "Moderate",
      timeSaved: "22 hrs/week",
      integrations: ["GHL", "Slack", "HubSpot", "Stripe"],
      features: ["Lead qualification", "Follow-up automation", "Deal closing", "Pipeline management"],
      demoAvailable: true,
      previewUrl: "/agent-cash"
    },
    {
      id: "sop-architect", 
      name: "SOP Architect",
      description: "Turns chaos into clean workflows.",
      monthlyPrice: 240,
      tokenUsage: "High",
      timeSaved: "18 hrs/week", 
      integrations: ["Notion", "ClickUp", "Monday.com", "Slack"],
      features: ["Process mapping", "Workflow automation", "Documentation", "Training materials"],
      demoAvailable: true,
      previewUrl: "/demo-scenarios"
    },
    {
      id: "content-producer",
      name: "Content Producer", 
      description: "Auto-creates, schedules, and posts with tone-match.",
      monthlyPrice: 280,
      tokenUsage: "Moderate",
      timeSaved: "25 hrs/week",
      integrations: ["Buffer", "Hootsuite", "Canva", "WordPress"],
      features: ["Content creation", "Social scheduling", "Brand voice", "Analytics tracking"],
      demoAvailable: true,
      previewUrl: "/marketplace"
    },
    {
      id: "executive-assistant",
      name: "Executive Assistant",
      description: "Manages your calendar, emails, and priorities.",
      monthlyPrice: 260,
      tokenUsage: "Low",
      timeSaved: "15 hrs/week",
      integrations: ["Gmail", "Calendar", "Zoom", "Slack"],
      features: ["Email management", "Calendar coordination", "Meeting prep", "Task prioritization"],
      demoAvailable: false,
      previewUrl: "/onboarding"
    }
  ];

  const handleFeatureSelect = (featureId: string) => {
    setSelectedDemo(featureId);
    
    switch (featureId) {
      case "soul-brain":
        window.location.href = "/soul-brain";
        break;
      case "agent-cards":
        window.location.href = "/marketplace";
        break;
      case "automation":
        window.location.href = "/demo-deploy";
        break;
      case "dashboard":
        if (user) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/login";
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24">
                <SolBrain size="lg" animated={true} />
              </div>
            </div>
            
            <div className="space-y-4">
              <Badge className="bg-harmony-gold/10 text-harmony-gold border-harmony-gold/30 mb-4">
                Interactive Platform Demo
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
                Experience <span className="text-harmony-gold">Harmonix</span> in Action
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Explore the future of intelligent automation through interactive demos, 
                agent previews, and live platform experiences.
              </p>
            </div>

            {!user && (
              <div className="bg-gray-900/50 border border-harmony-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-harmony-gold font-semibold mb-2">Demo Access Available</p>
                <p className="text-gray-300 text-sm">
                  Some features require account access. Sign up for full platform experience 
                  or browse our public demos below.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Demo Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-serif mb-4">
              Choose Your <span className="text-harmony-gold">Demo Experience</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Each demo showcases different aspects of the Harmonix platform. 
              Start with any that interests you most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {demoFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className={`bg-gray-900/50 border-gray-800 hover:border-harmony-gold/50 transition-colors cursor-pointer ${
                  !feature.available ? 'opacity-60' : ''
                }`}
                onClick={() => feature.available && handleFeatureSelect(feature.id)}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-harmony-gold/10 flex items-center justify-center relative">
                    <feature.icon className="h-8 w-8 text-harmony-gold" />
                    {!feature.available && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <Lock className="h-3 w-3 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-harmony-gold font-serif text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className="border-harmony-gold/30 text-harmony-gold text-xs"
                    >
                      {feature.demoType}
                    </Badge>
                    
                    <Button 
                      className={`w-full ${
                        feature.available 
                          ? "bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90" 
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      }`}
                      disabled={!feature.available}
                    >
                      {feature.available ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          {feature.demoType === "live" ? "Enter Dashboard" : "Try Demo"}
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Login Required
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Demo Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-harmony-gold/10 text-harmony-gold border-harmony-gold/30 mb-4">
                  Featured Demo
                </Badge>
                <h3 className="text-4xl font-bold text-white font-serif mb-6">
                  SŌL Brain Interactive Experience
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  Experience our central AI intelligence that orchestrates all agents. 
                  Ask questions about your business challenges and get personalized 
                  agent recommendations with real ROI projections.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Industry-specific recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Real business case studies and metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Personalized automation strategies</span>
                </div>
              </div>

              <Link href="/soul-brain">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                  Start SŌL Brain Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="w-80 h-80 relative">
                <SolBrain size="xl" animated={true} />
                <div className="absolute inset-0 bg-gradient-to-t from-harmony-dark via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Levels */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white font-serif mb-4">
              Demo Access <span className="text-harmony-gold">Levels</span>
            </h3>
            <p className="text-xl text-gray-300">
              Different features available based on your access level
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-harmony-gold font-serif">Public Access</CardTitle>
                <CardDescription className="text-gray-300">
                  Available to all visitors without registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">SŌL Brain chat demo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Agent marketplace browsing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Deployment scenario previews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Platform overview videos</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-harmony-gold/30">
              <CardHeader>
                <CardTitle className="text-harmony-gold font-serif">Member Access</CardTitle>
                <CardDescription className="text-gray-300">
                  Full platform experience for authenticated users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Live dashboard and analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Agent deployment and management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Real workflow automation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-harmony-gold rounded-full"></div>
                  <span className="text-gray-300">Team collaboration features</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
            <h3 className="text-4xl font-bold text-white font-serif mb-6">
              Ready for the Full <span className="text-harmony-gold">Experience</span>?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {user 
                ? "Access your personalized dashboard and start building your AI team today."
                : "Join Harmonix to unlock the complete platform with live agent deployment and automation."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/join">
                    <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                      Join Waitlist
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                      Member Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}