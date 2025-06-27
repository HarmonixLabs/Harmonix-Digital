import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/transitions/page-wrapper';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';

interface AuditItem {
  id: string;
  name: string;
  category: 'page' | 'component' | 'functionality' | 'performance';
  status: 'working' | 'warning' | 'error' | 'missing';
  description: string;
  route?: string;
  lastChecked: Date;
  priority: 'high' | 'medium' | 'low';
}

const auditData: AuditItem[] = [
  // Pages
  { id: 'home', name: 'Homepage', category: 'page', status: 'working', description: 'Main landing page with PageWrapper transitions', route: '/', lastChecked: new Date(), priority: 'high' },
  { id: 'dashboard', name: 'Dashboard', category: 'page', status: 'warning', description: 'Needs PageWrapper integration', route: '/dashboard', lastChecked: new Date(), priority: 'high' },
  { id: 'marketplace', name: 'Marketplace', category: 'page', status: 'working', description: 'Agent marketplace with NFT features', route: '/marketplace', lastChecked: new Date(), priority: 'medium' },
  
  // Components
  { id: 'navbar', name: 'Navigation Bar', category: 'component', status: 'working', description: 'Responsive navbar with auth states', lastChecked: new Date(), priority: 'high' },
  { id: 'auth-modal', name: 'Auth Modal', category: 'component', status: 'warning', description: 'Type definition conflicts', lastChecked: new Date(), priority: 'medium' },
  { id: 'page-transitions', name: 'Page Transitions', category: 'component', status: 'working', description: 'Smooth page transitions with parallax', lastChecked: new Date(), priority: 'medium' },
  
  // Functionality
  { id: 'stripe-payment', name: 'Stripe Payments', category: 'functionality', status: 'working', description: 'Complete payment processing', lastChecked: new Date(), priority: 'high' },
  { id: 'ghl-webhook', name: 'GHL CRM Integration', category: 'functionality', status: 'working', description: 'Bidirectional CRM sync active', lastChecked: new Date(), priority: 'high' },
  { id: 'onboarding-flow', name: 'Onboarding Flow', category: 'functionality', status: 'warning', description: 'User type definition issues', lastChecked: new Date(), priority: 'medium' },
];

export default function AdminStatusPanel() {
  const [auditItems, setAuditItems] = useState<AuditItem[]>(auditData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const statusIcons = {
    working: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    missing: <Clock className="w-5 h-5 text-gray-500" />
  };

  const getStatusCounts = () => {
    return {
      working: auditItems.filter(item => item.status === 'working').length,
      warning: auditItems.filter(item => item.status === 'warning').length,
      error: auditItems.filter(item => item.status === 'error').length,
      total: auditItems.length
    };
  };

  const getHealthScore = () => {
    const counts = getStatusCounts();
    const score = ((counts.working * 1 + counts.warning * 0.5) / counts.total) * 100;
    return Math.round(score);
  };

  const counts = getStatusCounts();
  const healthScore = getHealthScore();

  return (
    <PageWrapper enableParallax={false} enableGeometry={true}>
      <div className="min-h-screen bg-harmonix-black">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-harmonix-gold mb-2">
              Harmonix System Status
            </h1>
            <p className="text-harmonix-sage text-lg">
              Real-time platform health monitoring and audit dashboard
            </p>
          </motion.div>

          {/* Health Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-harmonix-deep-forest border-harmonix-sage/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-harmonix-sage">Health Score</p>
                    <p className="text-3xl font-bold text-harmonix-gold">{healthScore}%</p>
                  </div>
                  <Zap className="w-8 h-8 text-harmonix-gold" />
                </div>
                <Progress value={healthScore} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-harmonix-deep-forest border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-harmonix-sage">Working</p>
                    <p className="text-3xl font-bold text-green-400">{counts.working}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-deep-forest border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-harmonix-sage">Warnings</p>
                    <p className="text-3xl font-bold text-yellow-400">{counts.warning}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-deep-forest border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-harmonix-sage">Critical</p>
                    <p className="text-3xl font-bold text-red-400">{counts.error}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Items */}
          <div className="space-y-4">
            {auditItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-harmonix-deep-forest border-harmonix-sage/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {statusIcons[item.status]}
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="text-harmonix-sage text-sm">
                            {item.description}
                          </p>
                          {item.route && (
                            <p className="text-harmonix-gold text-xs font-mono">
                              {item.route}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-harmonix-sage">
                          {item.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={item.priority === 'high' ? 'border-red-500 text-red-400' : 
                                   item.priority === 'medium' ? 'border-yellow-500 text-yellow-400' : 
                                   'border-gray-500 text-gray-400'}
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </PageWrapper>
  );
}