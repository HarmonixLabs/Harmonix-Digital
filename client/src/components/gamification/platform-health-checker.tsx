import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Activity,
  Database,
  Wifi,
  Zap,
  Clock,
  TrendingUp,
  Settings
} from "lucide-react";

interface HealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  lastChecked: Date;
  responseTime?: number;
  message: string;
  category: 'system' | 'api' | 'database' | 'navigation' | 'performance';
}

interface PlatformHealthCheckerProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
}

export function PlatformHealthChecker({ autoRefresh = true, refreshInterval = 30 }: PlatformHealthCheckerProps) {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isChecking, setIsChecking] = useState(false);

  const performHealthChecks = async () => {
    setIsChecking(true);
    const checks: HealthCheck[] = [];
    
    try {
      // Navigation Health Check
      const navLinks = ['/dashboard', '/marketplace', '/sol-brain', '/my-agents'];
      for (const link of navLinks) {
        const startTime = Date.now();
        try {
          const response = await fetch(link, { method: 'HEAD' });
          const responseTime = Date.now() - startTime;
          
          checks.push({
            id: `nav-${link.replace('/', '')}`,
            name: `Navigation: ${link}`,
            status: response.ok ? 'healthy' : 'error',
            lastChecked: new Date(),
            responseTime,
            message: response.ok ? 'Route accessible' : `HTTP ${response.status}`,
            category: 'navigation'
          });
        } catch (error) {
          checks.push({
            id: `nav-${link.replace('/', '')}`,
            name: `Navigation: ${link}`,
            status: 'error',
            lastChecked: new Date(),
            message: 'Route unreachable',
            category: 'navigation'
          });
        }
      }

      // API Health Checks
      const apiEndpoints = [
        '/api/health',
        '/api/auth/user',
        '/api/dashboard/metrics',
        '/api/sol/chat'
      ];
      
      for (const endpoint of apiEndpoints) {
        const startTime = Date.now();
        try {
          const response = await fetch(endpoint, { method: 'HEAD' });
          const responseTime = Date.now() - startTime;
          
          checks.push({
            id: `api-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`,
            name: `API: ${endpoint}`,
            status: response.ok ? 'healthy' : response.status === 401 ? 'warning' : 'error',
            lastChecked: new Date(),
            responseTime,
            message: response.ok ? 'Endpoint responsive' : 
                    response.status === 401 ? 'Authentication required' : 
                    `HTTP ${response.status}`,
            category: 'api'
          });
        } catch (error) {
          checks.push({
            id: `api-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`,
            name: `API: ${endpoint}`,
            status: 'error',
            lastChecked: new Date(),
            message: 'Endpoint unreachable',
            category: 'api'
          });
        }
      }

      // Component Import Health Check
      const componentChecks = [
        { name: 'Navbar Component', check: () => document.querySelector('.navbar') !== null },
        { name: 'Footer Component', check: () => document.querySelector('footer') !== null },
        { name: 'SŌL Brain Chat', check: () => document.querySelector('[data-testid="sol-chat"]') !== null },
        { name: 'WebSocket Connection', check: () => window.WebSocket !== undefined }
      ];

      componentChecks.forEach(({ name, check }) => {
        const isHealthy = check();
        checks.push({
          id: `component-${name.toLowerCase().replace(/\s+/g, '-')}`,
          name: `Component: ${name}`,
          status: isHealthy ? 'healthy' : 'warning',
          lastChecked: new Date(),
          message: isHealthy ? 'Component loaded' : 'Component not found',
          category: 'system'
        });
      });

      // Performance Checks
      const performanceChecks = [
        {
          name: 'Page Load Time',
          check: () => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            return {
              status: loadTime < 3000 ? 'healthy' : loadTime < 5000 ? 'warning' : 'error',
              message: `${loadTime}ms load time`,
              responseTime: loadTime
            };
          }
        },
        {
          name: 'CSS Resources',
          check: () => {
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            const allLoaded = Array.from(stylesheets).every(sheet => !sheet.hasAttribute('disabled'));
            return {
              status: allLoaded ? 'healthy' : 'warning',
              message: `${stylesheets.length} stylesheets loaded`
            };
          }
        }
      ];

      performanceChecks.forEach(({ name, check }) => {
        const result = check();
        checks.push({
          id: `performance-${name.toLowerCase().replace(/\s+/g, '-')}`,
          name: `Performance: ${name}`,
          status: result.status,
          lastChecked: new Date(),
          responseTime: result.responseTime,
          message: result.message,
          category: 'performance'
        });
      });

    } catch (error) {
      console.error('Health check error:', error);
    }

    setHealthChecks(checks);
    setLastUpdate(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    performHealthChecks();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(performHealthChecks, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-harmonix-sage" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'api':
        return <Zap className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'navigation':
        return <Wifi className="w-4 h-4" />;
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const healthyCount = healthChecks.filter(check => check.status === 'healthy').length;
  const warningCount = healthChecks.filter(check => check.status === 'warning').length;
  const errorCount = healthChecks.filter(check => check.status === 'error').length;
  const totalChecks = healthChecks.length;
  const overallHealth = totalChecks > 0 ? (healthyCount / totalChecks) * 100 : 0;

  const getOverallStatus = () => {
    if (errorCount > 0) return 'error';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };

  const categories = ['system', 'api', 'database', 'navigation', 'performance'];

  return (
    <div className="space-y-6">
      {/* Overall Health Summary */}
      <Card className="bg-harmonix-night border-harmonix-cedar">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-harmonix-gold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Platform Health Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${
                getOverallStatus() === 'healthy' ? 'bg-green-500' :
                getOverallStatus() === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              } text-white`}>
                {getOverallStatus().toUpperCase()}
              </Badge>
              <Button
                size="sm"
                onClick={performHealthChecks}
                disabled={isChecking}
                className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
              >
                {isChecking ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{healthyCount}</div>
              <p className="text-harmonix-sage text-sm">Healthy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{warningCount}</div>
              <p className="text-harmonix-sage text-sm">Warnings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{errorCount}</div>
              <p className="text-harmonix-sage text-sm">Errors</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-harmonix-gold mb-1">{Math.round(overallHealth)}%</div>
              <p className="text-harmonix-sage text-sm">Overall Health</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-harmonix-sage">System Health</span>
              <span className="text-harmonix-gold">{Math.round(overallHealth)}%</span>
            </div>
            <Progress value={overallHealth} className="h-3" />
          </div>

          <p className="text-harmonix-sage text-sm mt-4">
            Last updated: {lastUpdate.toLocaleTimeString()}
            {autoRefresh && ` • Auto-refresh every ${refreshInterval}s`}
          </p>
        </CardContent>
      </Card>

      {/* Category-based Health Checks */}
      {categories.map(category => {
        const categoryChecks = healthChecks.filter(check => check.category === category);
        if (categoryChecks.length === 0) return null;

        return (
          <Card key={category} className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader>
              <CardTitle className="text-harmonix-gold flex items-center gap-2 capitalize">
                {getCategoryIcon(category)}
                {category} Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryChecks.map(check => (
                  <div key={check.id} className="flex items-center justify-between p-3 bg-harmonix-cedar/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h4 className="text-harmonix-gold font-medium">{check.name}</h4>
                        <p className="text-harmonix-sage text-sm">{check.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {check.responseTime && (
                        <div className="text-harmonix-sage text-sm">
                          {check.responseTime}ms
                        </div>
                      )}
                      <div className="text-harmonix-sage text-xs">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {check.lastChecked.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Auto-Healing Recommendations */}
      {(errorCount > 0 || warningCount > 0) && (
        <Card className="bg-harmonix-night border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Self-Healing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errorCount > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-semibold mb-2">Critical Issues Detected</h4>
                  <ul className="text-harmonix-sage text-sm space-y-1">
                    <li>• Check server connectivity and API endpoints</li>
                    <li>• Verify environment variables and secrets</li>
                    <li>• Review error logs for detailed diagnostics</li>
                  </ul>
                </div>
              )}
              
              {warningCount > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">Performance Optimization</h4>
                  <ul className="text-harmonix-sage text-sm space-y-1">
                    <li>• Consider optimizing slow-loading components</li>
                    <li>• Review authentication flows for efficiency</li>
                    <li>• Monitor resource loading patterns</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}