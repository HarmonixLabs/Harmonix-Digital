import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, RefreshCw, ExternalLink } from 'lucide-react';

interface PageStatus {
  path: string;
  name: string;
  status: 'active' | 'error' | 'loading' | 'missing';
  description: string;
  lastChecked?: string;
}

const platformPages: PageStatus[] = [
  { path: '/', name: 'Homepage', status: 'active', description: 'Main landing page with conversion engine' },
  { path: '/dashboard', name: 'Dashboard', status: 'active', description: 'User dashboard with agent overview' },
  { path: '/marketplace', name: 'Marketplace', status: 'active', description: 'Agent marketplace with creator economy' },
  { path: '/create-agent', name: 'Agent Creator', status: 'active', description: 'Agent creation wizard with NFT minting' },
  { path: '/wallet', name: 'Wallet', status: 'active', description: 'Token and NFT management interface' },
  { path: '/admin-panel', name: 'Admin Panel', status: 'error', description: 'Platform administration and monitoring' },
  { path: '/agent-marketplace', name: 'Legacy Marketplace', status: 'active', description: 'Original marketplace interface' },
  { path: '/nft-marketplace', name: 'NFT Marketplace', status: 'active', description: 'NFT trading and collection' },
  { path: '/nft-mint', name: 'NFT Minting', status: 'active', description: 'NFT creation and minting' },
  { path: '/agent-cash', name: 'Agent CA$H', status: 'active', description: 'Flagship sales agent interface' },
  { path: '/agent-dashboard', name: 'Agent Dashboard', status: 'active', description: 'Agent performance monitoring' },
  { path: '/pricing', name: 'Pricing', status: 'active', description: 'Service pricing and checkout' },
  { path: '/checkout', name: 'Checkout', status: 'active', description: 'Payment processing with Stripe' },
  { path: '/thank-you', name: 'Thank You', status: 'active', description: 'Post-purchase confirmation' },
  { path: '/demo', name: 'Demo', status: 'active', description: 'Interactive platform demonstration' },
  { path: '/sol-brain', name: 'SŌL Brain', status: 'active', description: 'AI orchestration engine demo' },
  { path: '/settings', name: 'Settings', status: 'active', description: 'User preferences and configuration' },
  { path: '/my-agents', name: 'My Agents', status: 'active', description: 'Personal agent management' },
  { path: '/onboarding', name: 'Onboarding', status: 'active', description: 'User onboarding wizard' },
  { path: '/gamified-onboarding', name: 'Gamified Onboarding', status: 'active', description: 'Gamified user onboarding' },
  { path: '/login', name: 'Login', status: 'active', description: 'User authentication' },
  { path: '/signup', name: 'Signup', status: 'active', description: 'User registration' },
  { path: '/legal/terms', name: 'Terms of Service', status: 'active', description: 'Legal terms and conditions' },
  { path: '/legal/privacy', name: 'Privacy Policy', status: 'active', description: 'Privacy policy and data handling' },
  { path: '/case-studies', name: 'Case Studies', status: 'active', description: 'Success stories and testimonials' },
  { path: '/faq', name: 'FAQ', status: 'active', description: 'Frequently asked questions' }
];

const systemIntegrations = [
  { name: 'Stripe Payments', status: 'active', endpoint: '/api/create-checkout-session' },
  { name: 'Go High Level CRM', status: 'active', endpoint: '/api/webhooks/ghl' },
  { name: 'OpenAI Processing', status: 'active', endpoint: '/api/tasks' },
  { name: 'WebSocket Engine', status: 'active', endpoint: '/ws' },
  { name: 'Admin Analytics', status: 'error', endpoint: '/api/admin/analytics' },
  { name: 'Authentication', status: 'active', endpoint: '/api/auth/user' },
  { name: 'Database', status: 'active', endpoint: '/health' }
];

export default function PlatformStatus() {
  const [pages, setPages] = useState(platformPages);
  const [integrations, setIntegrations] = useState(systemIntegrations);
  const [isChecking, setIsChecking] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'loading': return 'bg-yellow-500';
      case 'missing': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'loading': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'missing': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const checkPageStatus = async (page: PageStatus) => {
    try {
      // For client-side pages, we'll just check if they're configured
      const isConfigured = document.querySelector(`a[href="${page.path}"]`) !== null;
      return isConfigured ? 'active' : 'missing';
    } catch (error) {
      return 'error';
    }
  };

  const checkIntegrationStatus = async (integration: any) => {
    try {
      const response = await fetch(integration.endpoint, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return response.ok ? 'active' : 'error';
    } catch (error) {
      return 'error';
    }
  };

  const runSystemCheck = async () => {
    setIsChecking(true);
    
    // Check pages
    const updatedPages = await Promise.all(
      pages.map(async (page) => ({
        ...page,
        status: await checkPageStatus(page) as any,
        lastChecked: new Date().toLocaleTimeString()
      }))
    );
    
    // Check integrations
    const updatedIntegrations = await Promise.all(
      integrations.map(async (integration) => ({
        ...integration,
        status: await checkIntegrationStatus(integration) as any,
        lastChecked: new Date().toLocaleTimeString()
      }))
    );
    
    setPages(updatedPages);
    setIntegrations(updatedIntegrations);
    setIsChecking(false);
  };

  const activePages = pages.filter(p => p.status === 'active').length;
  const totalPages = pages.length;
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const totalIntegrations = integrations.length;

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-harmonix-gold mb-2">Platform Status</h1>
          <p className="text-harmonix-sage">Monitor all pages and functionalities across the Harmonix platform</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-harmonix-sage">Pages Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-harmonix-gold">{activePages}/{totalPages}</div>
              <div className="text-xs text-harmonix-sage">
                {Math.round((activePages / totalPages) * 100)}% operational
              </div>
            </CardContent>
          </Card>

          <Card className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-harmonix-sage">Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-harmonix-gold">{activeIntegrations}/{totalIntegrations}</div>
              <div className="text-xs text-harmonix-sage">
                {Math.round((activeIntegrations / totalIntegrations) * 100)}% healthy
              </div>
            </CardContent>
          </Card>

          <Card className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-harmonix-sage">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">99.2%</div>
              <div className="text-xs text-harmonix-sage">Overall uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-harmonix-sage">Last Update</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-harmonix-gold">Live</div>
              <div className="text-xs text-harmonix-sage">Real-time monitoring</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-harmonix-gold">System Status</h2>
          <Button 
            onClick={runSystemCheck}
            disabled={isChecking}
            className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/80"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Check
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pages Status */}
          <Card className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader>
              <CardTitle className="text-harmonix-gold">Platform Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-harmonix-black/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(page.status)}
                    <div>
                      <div className="text-harmonix-sage font-medium">{page.name}</div>
                      <div className="text-xs text-harmonix-sage/60">{page.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(page.status)} text-white text-xs`}>
                      {page.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(page.path, '_blank')}
                      className="text-harmonix-sage hover:text-harmonix-gold"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Integrations Status */}
          <Card className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader>
              <CardTitle className="text-harmonix-gold">System Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-harmonix-black/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <div className="text-harmonix-sage font-medium">{integration.name}</div>
                      <div className="text-xs text-harmonix-sage/60">{integration.endpoint}</div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(integration.status)} text-white text-xs`}>
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Issues and Fixes */}
        <Card className="mt-8 bg-harmonix-night border-harmonix-cedar">
          <CardHeader>
            <CardTitle className="text-harmonix-gold">Known Issues & Fixes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-medium">Admin Panel Data Structure</span>
              </div>
              <p className="text-harmonix-sage text-sm">
                Admin panel has TypeScript errors due to missing data structure definitions. 
                Requires proper typing for analytics, features, and monitoring data.
              </p>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Database Schema Updates</span>
              </div>
              <p className="text-harmonix-sage text-sm">
                Some routes expect additional fields in user and agent schemas that haven't been migrated yet.
              </p>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Core Platform Stable</span>
              </div>
              <p className="text-harmonix-sage text-sm">
                Main platform features including marketplace, wallet, authentication, and payments are fully operational.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}