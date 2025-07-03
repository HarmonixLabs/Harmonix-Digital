import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, CreditCard, Clock, Zap } from 'lucide-react';
import EnhancedLeadCaptureForm from '@/components/forms/EnhancedLeadCaptureForm';
import { PlatformLayout } from '@/components/layout/platform-layout';

export default function LeadCaptureDemo() {
  const [submissions, setSubmissions] = useState([]);

  const handleFormSuccess = (data) => {
    setSubmissions(prev => [{
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }, ...prev]);
  };

  const demoScenarios = [
    {
      id: 'waitlist',
      title: 'Waitlist Signup',
      description: 'Early access registration for platform launch',
      formType: 'waitlist',
      source: 'demo-waitlist',
      submitText: 'Join Waitlist',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'demo',
      title: 'Demo Request',
      description: 'Schedule a personalized platform demonstration',
      formType: 'demo',
      source: 'demo-request',
      submitText: 'Request Demo',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'consultation',
      title: 'Consultation Booking',
      description: 'Book a strategic consultation with AI experts',
      formType: 'consultation',
      source: 'demo-consultation',
      submitText: 'Book Consultation',
      icon: <Clock className="w-5 h-5" />
    }
  ];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-base/10 to-accent-base/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center space-y-6">
              <Badge 
                variant="outline" 
                className="bg-accent-base/10 text-accent-base border-accent-base/30 mb-4"
              >
                <Zap className="w-4 h-4 mr-2" />
                Multi-CRM Integration Demo
              </Badge>
              
              <h1 className="text-5xl font-secondary font-bold text-white leading-tight">
                Enhanced Lead Capture
                <span className="block text-accent-base">System Demo</span>
              </h1>
              
              <p className="text-xl text-neutral-light max-w-3xl mx-auto leading-relaxed">
                Experience our sophisticated lead capture system with real-time multi-CRM integration, 
                design system tokens, and comprehensive form validation.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-light">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-status-success" />
                  GoHighLevel Integration
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-status-success" />
                  HubSpot Backup
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-status-success" />
                  Google Sheets Fallback
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-status-success" />
                  Real-time Validation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Demo */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-secondary font-bold text-white mb-4">
                  Interactive Form Demo
                </h2>
                <p className="text-neutral-light leading-relaxed">
                  Test our enhanced lead capture forms with different scenarios. 
                  All submissions are processed through our multi-CRM integration system.
                </p>
              </div>

              <Tabs defaultValue="waitlist" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-background-secondary/50 border border-primary/20">
                  {demoScenarios.map((scenario) => (
                    <TabsTrigger 
                      key={scenario.id}
                      value={scenario.id}
                      className="data-[state=active]:bg-primary-base data-[state=active]:text-white text-neutral-light"
                    >
                      <div className="flex items-center gap-2">
                        {scenario.icon}
                        <span className="hidden sm:inline">{scenario.title}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {demoScenarios.map((scenario) => (
                  <TabsContent key={scenario.id} value={scenario.id} className="mt-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {scenario.title}
                        </h3>
                        <p className="text-neutral-light text-sm">
                          {scenario.description}
                        </p>
                      </div>
                      
                      <EnhancedLeadCaptureForm
                        formType={scenario.formType}
                        source={scenario.source}
                        title={scenario.title}
                        description={scenario.description}
                        submitButtonText={scenario.submitText}
                        onSuccess={handleFormSuccess}
                        className="max-w-md mx-auto"
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Features & Results */}
            <div className="space-y-8">
              {/* Features */}
              <Card className="bg-white/5 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-secondary">
                    Integration Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-base/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-accent-base" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Multi-CRM Delivery</h4>
                        <p className="text-neutral-light text-sm">
                          Simultaneous submission to GoHighLevel (primary), HubSpot (secondary), 
                          and Google Sheets (backup) with independent error handling.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-base/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-accent-base" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Design System Integration</h4>
                        <p className="text-neutral-light text-sm">
                          Built with comprehensive design tokens including 8px baseline grid, 
                          standardized colors, typography, and animation timing.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-base/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-accent-base" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Enhanced Validation</h4>
                        <p className="text-neutral-light text-sm">
                          Real-time form validation with animated feedback, 
                          comprehensive error handling, and user-friendly messaging.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-base/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-accent-base" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">UTM Tracking</h4>
                        <p className="text-neutral-light text-sm">
                          Automatic capture of UTM parameters, referrer data, 
                          and comprehensive lead source attribution.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Submissions */}
              <Card className="bg-white/5 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-secondary flex items-center gap-2">
                    Recent Demo Submissions
                    <Badge variant="secondary" className="text-xs">
                      {submissions.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <p className="text-neutral-light text-center py-8">
                      No submissions yet. Try submitting a form above to see real-time results.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {submissions.map((submission) => (
                        <div 
                          key={submission.id}
                          className="p-3 rounded-lg bg-background-secondary/30 border border-primary/10"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-medium text-sm">
                                {submission.firstName} {submission.lastName}
                              </p>
                              <p className="text-neutral-light text-xs">
                                {submission.email}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-accent-base/30 text-accent-base"
                            >
                              {submission.formType}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs text-neutral-medium">
                            <span>{submission.business}</span>
                            <span>{new Date(submission.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-gradient-to-r from-primary-base/10 to-accent-base/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-secondary font-bold text-white">
                  Platform Integration Status
                </h3>
                <p className="text-neutral-light">
                  All systems operational with self-healing protocol active
                </p>
                
                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-status-success/20 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-status-success" />
                    </div>
                    <p className="text-white font-medium">Design System</p>
                    <p className="text-neutral-light text-sm">Tokens Active</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-status-success/20 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-status-success" />
                    </div>
                    <p className="text-white font-medium">Multi-CRM</p>
                    <p className="text-neutral-light text-sm">Integration Live</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-status-success/20 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-status-success" />
                    </div>
                    <p className="text-white font-medium">Self-Healing</p>
                    <p className="text-neutral-light text-sm">Protocol v2.0</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PlatformLayout>
  );
}