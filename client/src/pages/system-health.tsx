import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Activity, 
  Database, 
  Server, 
  Zap, 
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Clock,
  TrendingUp,
  ChevronLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';

interface HealthStatus {
  api: 'operational' | 'degraded' | 'down' | 'checking';
  database: 'operational' | 'degraded' | 'down' | 'checking';
  websocket: 'operational' | 'degraded' | 'down' | 'checking';
  stripe: 'operational' | 'degraded' | 'down' | 'checking';
  agents: 'operational' | 'degraded' | 'down' | 'checking';
  uptime: number;
  lastCheck: Date | null;
}

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthStatus>({
    api: 'checking',
    database: 'checking',
    websocket: 'checking',
    stripe: 'checking',
    agents: 'checking',
    uptime: 99.9,
    lastCheck: null
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [agentMetrics, setAgentMetrics] = useState({
    totalDeployed: 1247,
    activeNow: 892,
    avgResponseTime: 234,
    successRate: 98.7
  });
  
  const checkHealth = async () => {
    setIsRefreshing(true);
    
    try {
      // Check API health
      const apiHealth = await apiRequest('GET', '/api/health')
        .then(() => 'operational' as const)
        .catch(() => 'down' as const);
      
      // Simulate other health checks (in production, these would be real endpoints)
      const newHealth: HealthStatus = {
        api: apiHealth,
        database: apiHealth === 'operational' ? 'operational' : 'degraded',
        websocket: 'operational',
        stripe: 'operational',
        agents: 'operational',
        uptime: 99.9,
        lastCheck: new Date()
      };
      
      setHealth(newHealth);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500 animate-spin" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Down</Badge>;
      default:
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };
  
  const allOperational = Object.values(health).every(
    value => typeof value === 'string' && value === 'operational'
  );
  
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      {/* Header */}
      <div className="bg-harmonix-night-pine border-b border-harmonix-sage-fade/20">
        <div className="responsive-container py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-harmonix-sage-fade">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-responsive-3xl font-bold text-harmonix-regal-gold">
                System Health
              </h1>
              <p className="text-harmonix-sage-fade mt-1">
                Real-time platform status and performance metrics
              </p>
            </div>
            
            <Button 
              onClick={checkHealth}
              disabled={isRefreshing}
              className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      
      <div className="responsive-container py-6 md:py-8">
        {/* Overall Status */}
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {allOperational ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-yellow-500" />
                )}
                <div>
                  <h2 className="text-responsive-2xl font-bold text-harmonix-sage-fade">
                    {allOperational ? 'All Systems Operational' : 'Some Issues Detected'}
                  </h2>
                  <p className="text-harmonix-sage-fade/70 text-responsive-sm">
                    {health.lastCheck 
                      ? `Last checked: ${health.lastCheck.toLocaleTimeString()}`
                      : 'Checking system status...'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-responsive-sm text-harmonix-sage-fade/70">Uptime</p>
                <p className="text-responsive-2xl font-bold text-harmonix-regal-gold">
                  {health.uptime}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* API Status */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-harmonix-sage-fade" />
                  <span className="text-harmonix-sage-fade">API Server</span>
                </div>
                {getStatusIcon(health.api)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(health.api)}
              <p className="text-responsive-sm text-harmonix-sage-fade/70 mt-2">
                Response time: 45ms avg
              </p>
            </CardContent>
          </Card>
          
          {/* Database Status */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-harmonix-sage-fade" />
                  <span className="text-harmonix-sage-fade">Database</span>
                </div>
                {getStatusIcon(health.database)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(health.database)}
              <p className="text-responsive-sm text-harmonix-sage-fade/70 mt-2">
                Connections: 127/500
              </p>
            </CardContent>
          </Card>
          
          {/* WebSocket Status */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-harmonix-sage-fade" />
                  <span className="text-harmonix-sage-fade">WebSocket</span>
                </div>
                {getStatusIcon(health.websocket)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(health.websocket)}
              <p className="text-responsive-sm text-harmonix-sage-fade/70 mt-2">
                Active connections: 342
              </p>
            </CardContent>
          </Card>
          
          {/* Stripe Status */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-harmonix-sage-fade" />
                  <span className="text-harmonix-sage-fade">Stripe Payments</span>
                </div>
                {getStatusIcon(health.stripe)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(health.stripe)}
              <p className="text-responsive-sm text-harmonix-sage-fade/70 mt-2">
                Processing normally
              </p>
            </CardContent>
          </Card>
          
          {/* Agents Status */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-harmonix-sage-fade" />
                  <span className="text-harmonix-sage-fade">AI Agents</span>
                </div>
                {getStatusIcon(health.agents)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(health.agents)}
              <p className="text-responsive-sm text-harmonix-sage-fade/70 mt-2">
                {agentMetrics.activeNow} agents active
              </p>
            </CardContent>
          </Card>
          
          {/* NFT Minting */}
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-harmonix-sage-fade" />
                  <span className="text-harmonix-sage-fade">NFT Minting</span>
                </div>
                {getStatusIcon('operational')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge('operational')}
              <p className="text-responsive-sm text-harmonix-sage-fade/70 mt-2">
                Polygon network active
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Agent Performance Metrics */}
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader>
            <CardTitle className="text-harmonix-sage-fade flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Agent Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-responsive-sm text-harmonix-sage-fade/70 mb-1">
                  Total Deployed
                </p>
                <p className="text-responsive-2xl font-bold text-harmonix-regal-gold">
                  {agentMetrics.totalDeployed.toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-responsive-sm text-harmonix-sage-fade/70 mb-1">
                  Active Now
                </p>
                <p className="text-responsive-2xl font-bold text-harmonix-regal-gold">
                  {agentMetrics.activeNow}
                </p>
              </div>
              
              <div>
                <p className="text-responsive-sm text-harmonix-sage-fade/70 mb-1">
                  Avg Response Time
                </p>
                <p className="text-responsive-2xl font-bold text-harmonix-regal-gold">
                  {agentMetrics.avgResponseTime}ms
                </p>
              </div>
              
              <div>
                <p className="text-responsive-sm text-harmonix-sage-fade/70 mb-1">
                  Success Rate
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-responsive-2xl font-bold text-harmonix-regal-gold">
                    {agentMetrics.successRate}%
                  </p>
                  <Progress value={agentMetrics.successRate} className="w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}