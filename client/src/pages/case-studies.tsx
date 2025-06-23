import React from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/harmonix-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Clock, DollarSign, Users, PlayCircle } from "lucide-react";

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      company: "TechFlow Solutions",
      industry: "SaaS",
      challenge: "Manual lead qualification and follow-up processes",
      solution: "Deployed CA$HFLOW sales agent with custom CRM integration",
      results: {
        timesSaved: "30 hours/week",
        revenueIncrease: "185%",
        conversionRate: "42%",
        roi: "520%"
      },
      testimonial: "Harmony's AI agents transformed our sales process. We went from chasing leads manually to having intelligent systems that never miss an opportunity.",
      author: "Sarah Chen, CEO"
    },
    {
      company: "Global Consulting Partners",
      industry: "Professional Services",
      challenge: "Complex project coordination across multiple time zones",
      solution: "Implemented Project Manager + Executive Assistant agents with SŌL brain orchestration",
      results: {
        timesSaved: "45 hours/week",
        revenueIncrease: "210%",
        conversionRate: "38%",
        roi: "680%"
      },
      testimonial: "The SŌL brain's ability to coordinate our global team is remarkable. It's like having a digital operations director that never sleeps.",
      author: "Marcus Rodriguez, Partner"
    },
    {
      company: "EcoTech Manufacturing",
      industry: "Manufacturing",
      challenge: "Disconnected systems between finance, operations, and customer service",
      solution: "Full agent ecosystem deployment with custom integrations",
      results: {
        timesSaved: "60 hours/week",
        revenueIncrease: "295%",
        conversionRate: "55%",
        roi: "840%"
      },
      testimonial: "Harmony didn't just automate our processes – it created intelligent systems that grow with our business vision.",
      author: "Dr. Emily Watson, Founder"
    }
  ];

  const metrics = [
    {
      icon: Clock,
      value: "135+",
      label: "Hours Saved Weekly",
      description: "Across all client implementations"
    },
    {
      icon: DollarSign,
      value: "$2.8M+",
      label: "Revenue Generated",
      description: "Additional revenue attributed to Harmony"
    },
    {
      icon: TrendingUp,
      value: "680%",
      label: "Average ROI",
      description: "Return on investment within 6 months"
    },
    {
      icon: Users,
      value: "50+",
      label: "Teams Transformed",
      description: "Businesses using intelligent automation"
    }
  ];

  const roiCalculator = {
    avgHourlyCost: 75,
    avgHoursSaved: 45,
    avgImplementationCost: 25000,
    monthlyMaintenance: 600
  };

  const calculateROI = () => {
    const weeklyValue = roiCalculator.avgHoursSaved * roiCalculator.avgHourlyCost;
    const annualValue = weeklyValue * 52;
    const annualCost = roiCalculator.avgImplementationCost + (roiCalculator.monthlyMaintenance * 12);
    const roi = ((annualValue - annualCost) / annualCost) * 100;
    return Math.round(roi);
  };

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <HarmonixLogo size="lg" variant="gold" className="justify-center mb-6" />
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
                Success <span className="text-harmony-gold">Stories</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Discover how visionary businesses are using Harmony to build intelligent systems 
                for timeless sovereignty and unprecedented growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 text-center">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                    <metric.icon className="h-6 w-6 text-harmony-gold" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-harmony-gold">{metric.value}</CardTitle>
                  <CardDescription className="text-white font-semibold">{metric.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-serif mb-4">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real businesses achieving extraordinary results with intelligent automation
            </p>
          </div>

          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  {/* Company Info */}
                  <div className="space-y-4">
                    <div>
                      <Badge className="bg-harmony-gold/10 text-harmony-gold border-harmony-gold/30 mb-2">
                        {study.industry}
                      </Badge>
                      <h3 className="text-2xl font-bold text-harmony-gold font-serif">
                        {study.company}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-white mb-1">Challenge:</h4>
                        <p className="text-gray-300 text-sm">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Solution:</h4>
                        <p className="text-gray-300 text-sm">{study.solution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-harmony-gold">Key Results:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-harmony-gold/10 rounded-lg">
                        <div className="text-lg font-bold text-harmony-gold">{study.results.timesSaved}</div>
                        <div className="text-xs text-gray-300">Time Saved</div>
                      </div>
                      <div className="text-center p-3 bg-harmony-gold/10 rounded-lg">
                        <div className="text-lg font-bold text-harmony-gold">{study.results.revenueIncrease}</div>
                        <div className="text-xs text-gray-300">Revenue Growth</div>
                      </div>
                      <div className="text-center p-3 bg-harmony-gold/10 rounded-lg">
                        <div className="text-lg font-bold text-harmony-gold">{study.results.conversionRate}</div>
                        <div className="text-xs text-gray-300">Conversion Rate</div>
                      </div>
                      <div className="text-center p-3 bg-harmony-gold/10 rounded-lg">
                        <div className="text-lg font-bold text-harmony-gold">{study.results.roi}</div>
                        <div className="text-xs text-gray-300">ROI</div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-harmony-gold">Client Testimonial:</h4>
                    <blockquote className="text-gray-300 italic leading-relaxed">
                      "{study.testimonial}"
                    </blockquote>
                    <p className="text-harmony-gold font-semibold">— {study.author}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 border-harmony-gold/30">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white font-serif">
                Calculate Your ROI
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                See the potential impact of intelligent automation on your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-harmony-gold font-semibold">Average Scenario:</h4>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Hours saved per week:</span>
                      <span className="font-semibold">{roiCalculator.avgHoursSaved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average hourly cost:</span>
                      <span className="font-semibold">${roiCalculator.avgHourlyCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation cost:</span>
                      <span className="font-semibold">${roiCalculator.avgImplementationCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly maintenance:</span>
                      <span className="font-semibold">${roiCalculator.monthlyMaintenance}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-harmony-gold font-semibold">Your Potential ROI:</h4>
                  <div className="text-center p-6 bg-harmony-gold/10 rounded-lg">
                    <div className="text-4xl font-bold text-harmony-gold mb-2">
                      {calculateROI()}%
                    </div>
                    <div className="text-gray-300">Annual Return on Investment</div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm mb-4">
                      Based on industry averages from our client implementations
                    </p>
                    <Link href="/join">
                      <Button className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                        Get Your Custom ROI Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h3 className="text-4xl font-bold text-white font-serif">
              Ready to Write Your <span className="text-harmony-gold">Success Story</span>?
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join the growing community of businesses using Harmony to build 
              intelligent systems for timeless sovereignty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      <Footer />
    </div>
  );
}