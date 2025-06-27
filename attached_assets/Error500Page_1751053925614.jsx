import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Home, 
  RefreshCw, 
  ArrowLeft, 
  Mail,
  CheckCircle,
  Server,
  Database,
  Wifi,
  Clock,
  Activity
} from 'lucide-react';

const Error500Page = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistData, setWaitlistData] = useState({
    name: '',
    email: '',
    company: '',
    issue: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    api: 'checking',
    database: 'checking',
    agents: 'checking',
    lastUpdate: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    // Simulate system status check
    const checkSystemStatus = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSystemStatus({
        api: Math.random() > 0.3 ? 'operational' : 'degraded',
        database: Math.random() > 0.2 ? 'operational' : 'down',
        agents: Math.random() > 0.4 ? 'operational' : 'degraded',
        lastUpdate: new Date().toLocaleTimeString()
      });
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Error report submission:', waitlistData);
      setSubmitted(true);
      setShowWaitlist(false);
      
      setTimeout(() => {
        setSubmitted(false);
        setWaitlistData({ name: '', email: '', company: '', issue: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Error report submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'down': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4 animate-pulse" />;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-green-900/20 border border-green-700 rounded-xl mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2>
              <p className="text-green-300">
                Thank you for reporting this issue. Our team has been notified and will investigate immediately.
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
                <Server className="h-16 w-16 text-red-400" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              500
            </h1>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Internal Server Error
            </h2>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Something went wrong on our end. Our AI agents are working to resolve this issue. 
              Please try again in a few moments or check our system status below.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
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
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              System Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-lg ${getStatusColor(systemStatus.api)}`}>
                      <Wifi className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">API Services</h4>
                  <div className={`flex items-center justify-center gap-2 ${getStatusColor(systemStatus.api)}`}>
                    {getStatusIcon(systemStatus.api)}
                    <span className="capitalize">{systemStatus.api}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-lg ${getStatusColor(systemStatus.database)}`}>
                      <Database className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Database</h4>
                  <div className={`flex items-center justify-center gap-2 ${getStatusColor(systemStatus.database)}`}>
                    {getStatusIcon(systemStatus.database)}
                    <span className="capitalize">{systemStatus.database}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-lg ${getStatusColor(systemStatus.agents)}`}>
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI Agents</h4>
                  <div className={`flex items-center justify-center gap-2 ${getStatusColor(systemStatus.agents)}`}>
                    {getStatusIcon(systemStatus.agents)}
                    <span className="capitalize">{systemStatus.agents}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span>Last updated: {systemStatus.lastUpdate}</span>
            </div>
          </div>

          {/* Error Details */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              What happened?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Possible Causes:</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>• Temporary server overload</li>
                  <li>• Database connection timeout</li>
                  <li>• AI agent processing error</li>
                  <li>• Scheduled maintenance</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">What we're doing:</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>• Automatically restarting services</li>
                  <li>• Monitoring system health</li>
                  <li>• Investigating root cause</li>
                  <li>• Preparing status updates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Report Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Report Issue
              </CardTitle>
              <CardDescription>
                Help us understand what went wrong so we can fix it faster
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
                    placeholder="Describe what you were trying to do when the error occurred..."
                    value={waitlistData.issue}
                    onChange={(e) => setWaitlistData(prev => ({ ...prev, issue: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !waitlistData.name || !waitlistData.email || !waitlistData.issue}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Report'}
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

export default Error500Page;

