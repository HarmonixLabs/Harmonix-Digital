import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, CheckCircle, TrendingUp, Clock, DollarSign } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const successStories = [
  {
    id: 1,
    company: "TechFlow Solutions",
    industry: "SaaS",
    challenge: "Manual lead qualification taking 15+ hours weekly",
    solution: "Agent CA$H automated lead scoring and CRM integration",
    results: {
      timeSaved: "40+ hours/month",
      conversion: "85% increase",
      revenue: "$150K additional revenue",
      roi: "12x ROI in 3 months"
    },
    testimonial: "Agent CA$H transformed our sales process. We're closing deals faster and our team can focus on high-value prospects.",
    author: "Sarah Chen, VP Sales",
    beforeAfter: {
      before: "Manual lead qualification, scattered data, 25% conversion rate",
      after: "Automated scoring, unified CRM, 45% conversion rate"
    }
  },
  {
    id: 2,
    company: "GrowthLab Agency",
    industry: "Marketing",
    challenge: "Content creation bottleneck limiting client capacity",
    solution: "Content Creation Agent + Social Media Agent deployment",
    results: {
      timeSaved: "60+ hours/month",
      conversion: "300% content output",
      revenue: "$85K monthly capacity increase",
      roi: "8x ROI in 2 months"
    },
    testimonial: "We scaled from 8 to 25 clients without hiring. The content quality is consistently excellent.",
    author: "Marcus Rodriguez, Agency Owner",
    beforeAfter: {
      before: "2-3 posts per week, manual scheduling, limited client capacity",
      after: "15+ posts per week, automated scheduling, 3x client capacity"
    }
  },
  {
    id: 3,
    company: "Precision Manufacturing",
    industry: "Manufacturing",
    challenge: "HR processes consuming excessive administrative time",
    solution: "HR Agent + Operations Agent for workflow automation",
    results: {
      timeSaved: "35+ hours/month",
      conversion: "70% faster onboarding",
      revenue: "$45K cost savings annually",
      roi: "6x ROI in 4 months"
    },
    testimonial: "Our HR team can finally focus on people instead of paperwork. Employee satisfaction is up 40%.",
    author: "Jennifer Walsh, HR Director",
    beforeAfter: {
      before: "Manual onboarding, paper forms, 2-week process",
      after: "Digital onboarding, automated workflows, 3-day process"
    }
  }
];

const metrics = [
  { label: "Average ROI", value: "8.7x", description: "Return on investment within 90 days" },
  { label: "Time Saved", value: "45+ hrs", description: "Monthly time savings per agent" },
  { label: "Revenue Impact", value: "$93K", description: "Average additional revenue" },
  { label: "Success Rate", value: "94%", description: "Clients achieving target outcomes" }
];

export default function Success() {
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6">
                Proven Results
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                Success Stories & 
                <span className="text-harmonix-regal-gold block">Team Wins</span>
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto leading-relaxed">
                Real businesses achieving transformational results with Harmonix AI agents. 
                See the before and after impact on operations, revenue, and team productivity.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {metrics.map((metric, index) => (
                <Card key={index} className="harmonix-card-enhanced text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-harmonix-regal-gold mb-2">
                      {metric.value}
                    </div>
                    <div className="text-lg font-semibold text-white mb-1">
                      {metric.label}
                    </div>
                    <div className="text-sm text-harmonix-sage-fade">
                      {metric.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 sm:py-20">
          <div className="harmonix-container">
            <div className="space-y-12">
              {successStories.map((story, index) => (
                <Card key={story.id} className="harmonix-card-enhanced overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Story Content */}
                    <div className="p-8 lg:p-12">
                      <div className="space-y-6">
                        <div>
                          <Badge className="bg-harmonix-cedar-mist/20 text-harmonix-cedar-mist border-harmonix-cedar-mist/30 mb-4">
                            {story.industry}
                          </Badge>
                          <h3 className="text-2xl font-bold text-white mb-2 font-serif">
                            {story.company}
                          </h3>
                          <p className="text-harmonix-sage-fade text-lg">
                            {story.challenge}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-harmonix-regal-gold mb-2">
                            Solution Deployed
                          </h4>
                          <p className="text-white">
                            {story.solution}
                          </p>
                        </div>

                        <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-harmonix-regal-gold mb-4">
                            Before & After
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-red-400 font-medium">Before:</span>
                              <p className="text-harmonix-sage-fade text-sm mt-1">
                                {story.beforeAfter.before}
                              </p>
                            </div>
                            <div>
                              <span className="text-green-400 font-medium">After:</span>
                              <p className="text-harmonix-sage-fade text-sm mt-1">
                                {story.beforeAfter.after}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/20 rounded-lg p-6">
                          <p className="text-white italic mb-3">
                            "{story.testimonial}"
                          </p>
                          <p className="text-harmonix-regal-gold font-semibold">
                            — {story.author}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Results Panel */}
                    <div className="bg-harmonix-night-pine/50 p-8 lg:p-12">
                      <h4 className="text-2xl font-bold text-harmonix-regal-gold mb-6 font-serif">
                        Measurable Results
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="w-5 h-5 text-harmonix-regal-gold mr-2" />
                            <span className="text-2xl font-bold text-white">
                              {story.results.timeSaved}
                            </span>
                          </div>
                          <p className="text-sm text-harmonix-sage-fade">Time Saved</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-5 h-5 text-harmonix-regal-gold mr-2" />
                            <span className="text-2xl font-bold text-white">
                              {story.results.conversion}
                            </span>
                          </div>
                          <p className="text-sm text-harmonix-sage-fade">Improvement</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <DollarSign className="w-5 h-5 text-harmonix-regal-gold mr-2" />
                            <span className="text-2xl font-bold text-white">
                              {story.results.revenue}
                            </span>
                          </div>
                          <p className="text-sm text-harmonix-sage-fade">Revenue Impact</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <CheckCircle className="w-5 h-5 text-harmonix-regal-gold mr-2" />
                            <span className="text-2xl font-bold text-white">
                              {story.results.roi}
                            </span>
                          </div>
                          <p className="text-sm text-harmonix-sage-fade">ROI Achieved</p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button 
                          className="w-full touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                          onClick={() => window.location.href = '/demo'}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Try Similar Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-harmonix-night-pine/50">
          <div className="harmonix-container">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-harmonix-regal-gold font-serif">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-lg text-harmonix-sage-fade mb-8">
                Join 280+ businesses already transforming operations with AI agents
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                  onClick={() => window.location.href = '/get-started'}
                >
                  Start Your Transformation
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                  onClick={() => window.location.href = '/demo'}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Platform Demo
                </Button>
              </div>
              
              <p className="text-sm text-harmonix-sage-fade mt-6">
                30% early bird discount • 90-day money-back guarantee • No setup fees
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}