import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Sparkles, Zap, Users, ArrowRight, Play, Star } from 'lucide-react';
import TrialSignupModal from './components/TrialSignupModal.jsx';
import './App.css';

// Homepage Component
function Homepage() {
  const [showTrialModal, setShowTrialModal] = useState(false);

  const agents = [
    {
      name: "Sales Agent",
      description: "Finds and follows up with customers",
      benefit: "Never miss a lead again",
      icon: "💼",
      category: "Sales Team"
    },
    {
      name: "Marketing Agent", 
      description: "Creates content and campaigns",
      benefit: "Get more customers without the work",
      icon: "📈",
      category: "Sales Team"
    },
    {
      name: "Customer Service Agent",
      description: "Handles customer questions 24/7",
      benefit: "Happy customers, less work for you",
      icon: "🎧",
      category: "Sales Team"
    },
    {
      name: "HR Agent",
      description: "Handles employee questions and tasks", 
      benefit: "Happy employees, less work for you",
      icon: "👥",
      category: "Operations Team"
    },
    {
      name: "Finance Agent",
      description: "Tracks expenses and budgets",
      benefit: "Know where your money goes",
      icon: "💰",
      category: "Operations Team"
    },
    {
      name: "Project Manager Agent",
      description: "Keeps projects on track",
      benefit: "Never miss a deadline again",
      icon: "📋",
      category: "Operations Team"
    },
    {
      name: "Content Agent",
      description: "Writes blogs, emails, and posts",
      benefit: "Always have something to say",
      icon: "✍️",
      category: "Creative Team"
    },
    {
      name: "Design Agent",
      description: "Creates graphics and layouts",
      benefit: "Look professional without a designer",
      icon: "🎨",
      category: "Creative Team"
    },
    {
      name: "Social Media Agent",
      description: "Posts and engages on social media",
      benefit: "Stay active without the hassle",
      icon: "📱",
      category: "Creative Team"
    },
    {
      name: "IT Agent",
      description: "Fixes tech problems and setups",
      benefit: "Tech that just works",
      icon: "💻",
      category: "Tech Team"
    },
    {
      name: "Analytics Agent",
      description: "Shows what's working and what's not",
      benefit: "Make smart decisions with data",
      icon: "📊",
      category: "Tech Team"
    },
    {
      name: "Automation Agent",
      description: "Connects all your tools together",
      benefit: "Everything works together perfectly",
      icon: "⚡",
      category: "Tech Team"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "TechStart Inc",
      text: "My AI team saves me 15 hours every week. I can't imagine working without them.",
      rating: 5
    },
    {
      name: "Mike Rodriguez", 
      company: "Local Marketing Co",
      text: "Our sales went up 40% in the first month. These AI agents actually work.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      company: "Creative Studio",
      text: "Finally, AI that makes sense. Simple to use and gets real results.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold harmonix-text-gradient">HARMONIX</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#agents" className="text-muted-foreground hover:text-foreground transition-colors">See All Agents</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Success Stories</a>
              <Button variant="outline" size="sm">Sign In</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 harmonix-gradient opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-hero harmonix-text-gradient mb-6">
              Your AI Team is Ready to Work
            </h1>
            <p className="text-subtitle text-muted-foreground mb-8 max-w-3xl mx-auto">
              12 Smart Assistants. One Simple Dashboard. Real Results in Minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-6 harmonix-glow"
                onClick={() => setShowTrialModal(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Try Free Demo
              </Button>
              <Button variant="outline" size="lg" className="btn-secondary text-lg px-8 py-6">
                See How It Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-accent" />
                No Credit Card
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-accent" />
                10,000+ Users
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-accent" />
                5-Star Rated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Showcase */}
      <section id="agents" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">Meet Your 12 AI Assistants</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each one is an expert in their field. Together, they're your complete business team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <Card key={index} className="harmonix-card hover:harmonix-glow transition-all duration-300 animate-scale-in group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{agent.icon}</span>
                    <Badge variant="secondary" className="text-xs">{agent.category}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{agent.name}</CardTitle>
                  <CardDescription className="text-sm">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-accent-foreground bg-accent/20 rounded-lg p-3">
                    💡 {agent.benefit}
                  </p>
                  <Button variant="ghost" size="sm" className="w-full mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Try This Agent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See Why Teams Love Their AI</h2>
            <p className="text-xl text-muted-foreground">
              Real results from real businesses like yours
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="harmonix-card text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 harmonix-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Meet Your AI Team?</h2>
          <p className="text-xl mb-8 opacity-90">
            See what AI can do for your business in just 5 minutes
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100"
            onClick={() => setShowTrialModal(true)}
          >
            <Play className="mr-2 h-5 w-5" />
            Start Your Free Demo
          </Button>
          <p className="text-sm mt-4 opacity-75">No credit card required • 5-minute setup • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold harmonix-text-gradient">HARMONIX</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 Harmonix Digital. Your AI team is ready to work.
          </div>
        </div>
      </footer>

      {/* Trial Signup Modal */}
      <TrialSignupModal 
        isOpen={showTrialModal} 
        onClose={() => setShowTrialModal(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;

