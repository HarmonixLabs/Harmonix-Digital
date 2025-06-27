import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Home, 
  Search, 
  ArrowLeft, 
  Mail,
  CheckCircle,
  Sparkles,
  Bot,
  Zap
} from 'lucide-react';

const Error404Page = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistData, setWaitlistData] = useState({
    name: '',
    email: '',
    company: '',
    interest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to join waitlist
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make actual API call to /api/waitlist
      console.log('Waitlist submission:', waitlistData);
      
      setSubmitted(true);
      setShowWaitlist(false);
      
      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setWaitlistData({ name: '', email: '', company: '', interest: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Waitlist submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedPages = [
    { title: 'Agent Marketplace', path: '/marketplace', description: 'Discover and deploy AI agents' },
    { title: 'Agent Builder', path: '/builder', description: 'Create custom AI workflows' },
    { title: 'Demo Suite', path: '/demo', description: 'Try our agents for free' },
    { title: 'Dashboard', path: '/dashboard', description: 'Monitor your agents' },
    { title: 'Documentation', path: '/docs', description: 'Learn how to use HARMONIX' }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-green-900/20 border border-green-700 rounded-xl mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">You're on the list!</h2>
              <p className="text-green-300">
                Thanks for joining our waitlist. We'll notify you when this feature becomes available.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-500/30">
                <AlertTriangle className="h-16 w-16 text-red-400" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              404
            </h1>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, 
              or you entered the wrong URL. But don't worry – we've got some great alternatives!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
              
              <Button 
                onClick={() => setShowWaitlist(true)}
                variant="outline"
                className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Join Waitlist
              </Button>
            </div>
          </div>

          {/* Suggested Pages */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              Explore HARMONIX Instead
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedPages.map((page, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Bot className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {page.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      {page.description}
                    </p>
                    <Button 
                      onClick={() => window.location.href = page.path}
                      variant="ghost"
                      className="text-emerald-400 hover:bg-emerald-600 hover:text-white"
                      size="sm"
                    >
                      Visit Page
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Highlight */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Why Choose HARMONIX?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-blue-600 rounded-lg w-fit mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">AI Agents</h4>
                <p className="text-slate-400 text-sm">
                  Deploy intelligent agents that automate your business processes
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-purple-600 rounded-lg w-fit mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">No-Code Builder</h4>
                <p className="text-slate-400 text-sm">
                  Create complex workflows without writing a single line of code
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-green-600 rounded-lg w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Thread Inheritance</h4>
                <p className="text-slate-400 text-sm">
                  Seamless context preservation across all agent interactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Join the Waitlist
              </CardTitle>
              <CardDescription>
                Be the first to know when this feature becomes available
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your name"
                    value={waitlistData.name}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={waitlistData.email}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Input
                    placeholder="Company (optional)"
                    value={waitlistData.company}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, company: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder="What interests you most about this feature?"
                    value={waitlistData.interest}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, interest: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !waitlistData.name || !waitlistData.email}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => setShowWaitlist(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Error404Page;

