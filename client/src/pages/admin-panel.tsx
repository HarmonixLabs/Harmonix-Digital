import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  Globe,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Eye,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Power,
  RefreshCw,
  AlertTriangle,
  Coins
} from "lucide-react";

interface FeatureStatus {
  status: 'active' | 'disabled' | 'beta' | 'alpha' | 'maintenance';
  lastUpdated: string;
  version?: string;
  health?: number;
  issues?: number;
  uptime?: string;
  errors?: number;
}

interface AdminAnalytics {
  users: {
    total: number;
    active: number;
    trial: number;
    premium: number;
    growth: string;
  };
  agents: {
    totalDeployments: number;
    activeAgents: number;
    topPerformer: string;
    averageEfficiency: number;
  };
  tokens: {
    totalEarned: number;
    totalSpent: number;
    circulation: number;
    averageBalance: number;
  };
  revenue: {
    monthly: number;
    growth: string;
    churn: string;
    ltv: number;
  };
  platform: {
    uptime: string;
    responseTime: string;
    errorRate: string;
    lastDeployment: string;
  };
}

export default function AdminPanel() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const { data: features, isLoading: featuresLoading } = useQuery({
    queryKey: ["/api/admin/features"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    refetchInterval: 60000, // Refresh every minute
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'disabled': return 'bg-red-500';
      case 'beta': return 'bg-yellow-500';
      case 'alpha': return 'bg-orange-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disabled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'beta': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'alpha': return <Settings className="w-4 h-4 text-orange-500" />;
      case 'maintenance': return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleFeature = async (featureId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/features/${featureId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      
      if (response.ok) {
        // Refresh features data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
    }
  };

  if (featuresLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-harmonix-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-harmonix-gold" />
            <span className="text-harmonix-sage">Loading admin panel...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-harmonix-gold mb-2">Admin Panel</h1>
          <p className="text-harmonix-sage">Monitor and manage all platform features and functionalities</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-harmonix-night border border-harmonix-cedar">
            <TabsTrigger value="overview" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
              <Settings className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
              <Globe className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
              <Activity className="w-4 h-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
              <Server className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {analytics && (
              <>
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-harmonix-sage">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-harmonix-gold" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-harmonix-gold">{analytics.users.total.toLocaleString()}</div>
                      <p className="text-xs text-harmonix-sage">
                        <span className="text-green-400">{analytics.users.growth}</span> from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-harmonix-sage">Active Agents</CardTitle>
                      <Zap className="h-4 w-4 text-harmonix-gold" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-harmonix-gold">{analytics.agents.activeAgents.toLocaleString()}</div>
                      <p className="text-xs text-harmonix-sage">
                        {analytics.agents.averageEfficiency}% avg efficiency
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-harmonix-sage">Token Circulation</CardTitle>
                      <Coins className="h-4 w-4 text-harmonix-gold" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-harmonix-gold">{(analytics.tokens.circulation / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-harmonix-sage">
                        {analytics.tokens.averageBalance} avg balance
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-harmonix-sage">Monthly Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-harmonix-gold" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-harmonix-gold">${analytics.revenue.monthly.toLocaleString()}</div>
                      <p className="text-xs text-harmonix-sage">
                        <span className="text-green-400">{analytics.revenue.growth}</span> growth
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* User Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader>
                      <CardTitle className="text-harmonix-gold">User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Trial Users</span>
                          <span className="text-harmonix-gold">{analytics.users.trial}</span>
                        </div>
                        <Progress value={(analytics.users.trial / analytics.users.total) * 100} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Premium Users</span>
                          <span className="text-harmonix-gold">{analytics.users.premium}</span>
                        </div>
                        <Progress value={(analytics.users.premium / analytics.users.total) * 100} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Active Users</span>
                          <span className="text-harmonix-gold">{analytics.users.active}</span>
                        </div>
                        <Progress value={(analytics.users.active / analytics.users.total) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader>
                      <CardTitle className="text-harmonix-gold">Platform Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Uptime</span>
                          <Badge className="bg-green-500 text-white">{analytics.platform.uptime}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Response Time</span>
                          <Badge className="bg-blue-500 text-white">{analytics.platform.responseTime}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Error Rate</span>
                          <Badge className="bg-green-500 text-white">{analytics.platform.errorRate}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Last Deployment</span>
                          <span className="text-harmonix-sage text-sm">
                            {new Date(analytics.platform.lastDeployment).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            {features && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Core Features */}
                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader>
                      <CardTitle className="text-harmonix-gold flex items-center gap-2">
                        <Cpu className="w-5 h-5" />
                        Core Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(features.core).map(([key, feature]: [string, any]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-harmonix-cedar/10 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(feature.status)}
                              <div>
                                <h4 className="font-medium text-harmonix-gold capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <p className="text-sm text-harmonix-sage">
                                  v{feature.version} • Updated {feature.lastUpdated}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getStatusColor(feature.status)} text-white`}>
                                {feature.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant={feature.status === 'active' ? 'destructive' : 'default'}
                                onClick={() => toggleFeature(key, feature.status !== 'active')}
                              >
                                {feature.status === 'active' ? 'Disable' : 'Enable'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Experimental Features */}
                  <Card className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader>
                      <CardTitle className="text-harmonix-gold flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Experimental Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(features.experimental).map(([key, feature]: [string, any]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-harmonix-cedar/10 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(feature.status)}
                              <div>
                                <h4 className="font-medium text-harmonix-gold capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <p className="text-sm text-harmonix-sage">
                                  v{feature.version} • Updated {feature.lastUpdated}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getStatusColor(feature.status)} text-white`}>
                                {feature.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant={feature.status === 'active' ? 'destructive' : 'default'}
                                onClick={() => toggleFeature(key, feature.status !== 'active')}
                              >
                                {feature.status === 'active' ? 'Disable' : 'Enable'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            {features && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(features.integrations).map(([key, integration]: [string, any]) => (
                  <Card key={key} className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader>
                      <CardTitle className="text-harmonix-gold flex items-center justify-between">
                        <span className="capitalize">{key}</span>
                        <Badge className={`${getStatusColor(integration.status)} text-white`}>
                          {integration.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Health</span>
                          <div className="flex items-center gap-2">
                            <Progress value={integration.health} className="w-24 h-2" />
                            <span className="text-harmonix-gold">{integration.health}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Last Updated</span>
                          <span className="text-harmonix-sage text-sm">{integration.lastUpdated}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Status</span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(integration.status)}
                            <span className="text-harmonix-gold capitalize">{integration.status}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            {features && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.entries(features.monitoring).map(([key, monitor]: [string, any]) => (
                  <Card key={key} className="bg-harmonix-night border-harmonix-cedar">
                    <CardHeader>
                      <CardTitle className="text-harmonix-gold capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Status</span>
                          <Badge className={`${getStatusColor(monitor.status)} text-white`}>
                            {monitor.status}
                          </Badge>
                        </div>
                        
                        {monitor.uptime && (
                          <div className="flex items-center justify-between">
                            <span className="text-harmonix-sage">Uptime</span>
                            <span className="text-harmonix-gold">{monitor.uptime}</span>
                          </div>
                        )}
                        
                        {monitor.issues !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-harmonix-sage">Issues</span>
                            <Badge className={monitor.issues > 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                              {monitor.issues}
                            </Badge>
                          </div>
                        )}
                        
                        {monitor.errors !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-harmonix-sage">Errors</span>
                            <Badge className={monitor.errors > 5 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                              {monitor.errors}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-harmonix-sage">Last Check</span>
                          <span className="text-harmonix-sage text-sm">{monitor.lastUpdated}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={65} className="h-3" />
                    <p className="text-sm text-harmonix-sage">65% utilization</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={72} className="h-3" />
                    <p className="text-sm text-harmonix-sage">72% utilization</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={45} className="h-3" />
                    <p className="text-sm text-harmonix-sage">45% utilization</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={28} className="h-3" />
                    <p className="text-sm text-harmonix-sage">28% utilization</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}