#!/usr/bin/env node

/**
 * HARMONIX Page Generator CLI
 * Generates blank pages with consistent styling and waitlist integration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Page template with HARMONIX styling
const generatePageTemplate = (pageName, pageTitle, pageDescription, includeWaitlist = true) => {
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
  
  return `import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Construction, 
  Home, 
  ArrowLeft, 
  Mail,
  CheckCircle,
  Sparkles,
  Bot,
  Zap,
  Users
} from 'lucide-react';

const ${componentName} = () => {
  ${includeWaitlist ? `
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
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...waitlistData,
          page: '${pageName}',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setShowWaitlist(false);
        
        setTimeout(() => {
          setSubmitted(false);
          setWaitlistData({ name: '', email: '', company: '', interest: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('Waitlist submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-harmonix-deep-space text-white flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-green-900/20 border border-green-700 rounded-xl mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">You're on the list!</h2>
              <p className="text-green-300">
                Thanks for your interest in ${pageTitle}. We'll notify you when this feature becomes available.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-harmonix-indigo to-harmonix-teal hover:opacity-90"
            >
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }` : ''}

  return (
    <div className="min-h-screen bg-harmonix-deep-space text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-harmonix-indigo/20 to-harmonix-teal/20 rounded-full border border-harmonix-indigo/30">
                <Construction className="h-16 w-16 text-harmonix-teal" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-harmonix-teal to-harmonix-champagne bg-clip-text text-transparent mb-4">
              ${pageTitle}
            </h1>
            
            <p className="text-xl text-harmonix-cloud max-w-2xl mx-auto mb-8">
              ${pageDescription}
            </p>

            <Badge variant="outline" className="border-harmonix-teal text-harmonix-teal mb-8">
              Coming Soon
            </Badge>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="border-harmonix-cloud/30 text-harmonix-cloud hover:bg-harmonix-cloud/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-harmonix-indigo to-harmonix-teal hover:opacity-90"
              >
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
              
              ${includeWaitlist ? `
              <Button 
                onClick={() => setShowWaitlist(true)}
                variant="outline"
                className="border-harmonix-teal text-harmonix-teal hover:bg-harmonix-teal hover:text-harmonix-deep-space"
              >
                <Mail className="h-4 w-4 mr-2" />
                Join Waitlist
              </Button>` : ''}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">What to Expect</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-harmonix-indigo/20 border-harmonix-indigo/30 hover:border-harmonix-teal transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-harmonix-teal/20 to-harmonix-champagne/20 rounded-lg w-fit mx-auto mb-4">
                    <Bot className="h-6 w-6 text-harmonix-teal" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI-Powered</h4>
                  <p className="text-harmonix-cloud text-sm">
                    Advanced AI capabilities integrated seamlessly into your workflow
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-harmonix-indigo/20 border-harmonix-indigo/30 hover:border-harmonix-teal transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg w-fit mx-auto mb-4">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
                  <p className="text-harmonix-cloud text-sm">
                    Optimized performance for enterprise-scale operations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-harmonix-indigo/20 border-harmonix-indigo/30 hover:border-harmonix-teal transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Team Collaboration</h4>
                  <p className="text-harmonix-cloud text-sm">
                    Built for teams with advanced sharing and permission controls
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      ${includeWaitlist ? `
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-harmonix-indigo border-harmonix-teal w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-harmonix-teal flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Join the Waitlist
              </CardTitle>
              <CardDescription>
                Be the first to know when ${pageTitle} becomes available
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={waitlistData.name}
                  onChange={(e) => setWaitlistData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-harmonix-deep-space/50 border-harmonix-cloud/30 text-white"
                />
                
                <Input
                  type="email"
                  placeholder="Email address"
                  value={waitlistData.email}
                  onChange={(e) => setWaitlistData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-harmonix-deep-space/50 border-harmonix-cloud/30 text-white"
                />
                
                <Input
                  placeholder="Company (optional)"
                  value={waitlistData.company}
                  onChange={(e) => setWaitlistData(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-harmonix-deep-space/50 border-harmonix-cloud/30 text-white"
                />
                
                <Textarea
                  placeholder="What interests you most about this feature?"
                  value={waitlistData.interest}
                  onChange={(e) => setWaitlistData(prev => ({ ...prev, interest: e.target.value }))}
                  className="bg-harmonix-deep-space/50 border-harmonix-cloud/30 text-white min-h-[80px]"
                />
                
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !waitlistData.name || !waitlistData.email}
                    className="flex-1 bg-gradient-to-r from-harmonix-indigo to-harmonix-teal hover:opacity-90"
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
                    className="border-harmonix-cloud/30 text-harmonix-cloud hover:bg-harmonix-cloud/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}` : ''}
    </div>
  );
};

export default ${componentName};`;
};

// CLI function
async function main() {
  console.log('🚀 HARMONIX Page Generator CLI');
  console.log('================================');
  console.log('Generate consistent blank pages with HARMONIX styling\n');

  try {
    const pageName = await question('Page name (e.g., "analytics", "reports"): ');
    const pageTitle = await question('Page title (e.g., "Analytics Dashboard"): ');
    const pageDescription = await question('Page description: ');
    const includeWaitlistInput = await question('Include waitlist modal? (y/n): ');
    const outputDir = await question('Output directory (default: ./client/src/pages): ') || './client/src/pages';

    const includeWaitlist = includeWaitlistInput.toLowerCase() === 'y' || includeWaitlistInput.toLowerCase() === 'yes';
    const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
    const fileName = `${pageName}.tsx`;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const componentContent = generatePageTemplate(pageName, pageTitle, pageDescription, includeWaitlist);
    const componentPath = path.join(outputDir, fileName);
    
    fs.writeFileSync(componentPath, componentContent);

    console.log('\n✅ Page generated successfully!');
    console.log(`📁 Component: ${componentPath}`);
    console.log('\n📋 Next steps:');
    console.log('1. Import the component in your app');
    console.log('2. Add the route to your router configuration');
    console.log('3. Customize the content as needed');
    
    if (includeWaitlist) {
      console.log('\n⚠️  Don\'t forget to:');
      console.log('- Implement the /api/waitlist endpoint');
      console.log('- Set up email notifications for waitlist submissions');
      console.log('- Configure GoHighLevel integration for lead capture');
    }

  } catch (error) {
    console.error('❌ Error generating page:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { generatePageTemplate };