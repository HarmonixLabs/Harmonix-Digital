import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Database, 
  Wifi, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Server,
  Mail,
  CreditCard,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthStatus {
  status: 'healthy' | 'warning' | 'error';
  timestamp: string;
  services: {
    database: string;
    storage: string;
    webSocket: string;
    stripe: string;
    ghl: string;
    hubspot: string;
    sheets: string;
    openai: string;
  };
  metrics: {
    uptime: number;
    responseTime: number;
    activeConnections: number;
    leadSubmissions24h: number;
    errorRate: number;
  };
  lastHealing: {
    timestamp: string;
    action: string;
    success: boolean;
  };
}

export default function SystemHealth() {
  const [manualRefresh, setManualRefresh] = useState(0);
  
  const { data: healthData, isLoading, refetch } = useQuery<HealthStatus>({
    queryKey: ['/api/health/detailed', manualRefresh],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleManualRefresh = () => {
    setManualRefresh(prev => prev + 1);
    refetch();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-status-warning" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-status-error" />;
      default:
        return <Activity className="w-5 h-5 text-neutral-medium" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-status-success/20 text-status-success border-status-success/30';
      case 'warning':
        return 'bg-status-warning/20 text-status-warning border-status-warning/30';
      case 'error':
        return 'bg-status-error/20 text-status-error border-status-error/30';
      default:
        return 'bg-neutral-medium/20 text-neutral-medium border-neutral-medium/30';
    }
  };

  const serviceIcons = {
    database: Database,
    storage: Server,
    webSocket: Wifi,
    stripe: CreditCard,
    ghl: Mail,
    hubspot: Globe,
    sheets: Activity,
    openai: Zap
  };

  if (isLoading && !healthData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-accent-base mx-auto mb-4" />
            <h2 className="text-xl text-white">Loading System Health...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-secondary font-bold text-white">
              System Health Dashboard
            </h1>
            <p className="text-neutral-light text-lg">
              Real-time monitoring and status of all Harmonix platform services
            </p>
          </motion.div>

          <div className="flex justify-center items-center gap-4">
            <Badge 
              variant="outline" 
              className={healthData ? getStatusColor(healthData.status) : 'bg-neutral-medium/20'}
            >
              {healthData ? getStatusIcon(healthData.status) : <Activity className="w-4 h-4" />}
              <span className="ml-2">
                {healthData ? healthData.status.toUpperCase() : 'LOADING'}
              </span>
            </Badge>
            
            <Button
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              className="border-primary/30 text-neutral-light hover:bg-primary/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {healthData && (
            <p className="text-neutral-medium text-sm">
              Last updated: {new Date(healthData.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        {/* Main Metrics */}
        {healthData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-background-primary/80 border-primary/20">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-accent-base mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {healthData.metrics.uptime.toFixed(1)}%
                </h3>
                <p className="text-neutral-light text-sm">Uptime</p>
              </CardContent>
            </Card>

            <Card className="bg-background-primary/80 border-primary/20">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-accent-base mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {healthData.metrics.responseTime}ms
                </h3>
                <p className="text-neutral-light text-sm">Response Time</p>
              </CardContent>
            </Card>

            <Card className="bg-background-primary/80 border-primary/20">
              <CardContent className="p-6 text-center">
                <Wifi className="w-8 h-8 text-accent-base mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {healthData.metrics.activeConnections}
                </h3>
                <p className="text-neutral-light text-sm">Active Connections</p>
              </CardContent>
            </Card>

            <Card className="bg-background-primary/80 border-primary/20">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-accent-base mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {healthData.metrics.leadSubmissions24h}
                </h3>
                <p className="text-neutral-light text-sm">Leads (24h)</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Service Status Grid */}
        {healthData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-background-primary/80 border-primary/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(healthData.services).map(([service, status]) => {
                    const IconComponent = serviceIcons[service] || Activity;
                    return (
                      <div
                        key={service}
                        className="flex items-center justify-between p-4 rounded-lg bg-background-secondary/30 border border-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-accent-base" />
                          <div>
                            <h4 className="text-white font-medium capitalize">
                              {service.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-neutral-medium text-xs">
                              {getServiceDescription(service)}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(status)}
                          size="sm"
                        >
                          {status.toUpperCase()}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Self-Healing Status */}
        {healthData && healthData.lastHealing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-background-primary/80 border-primary/20">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-accent-base" />
                  Self-Healing Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background-secondary/30 border border-primary/10">
                  <div>
                    <h4 className="text-white font-medium">Last Healing Action</h4>
                    <p className="text-neutral-light text-sm">
                      {healthData.lastHealing.action}
                    </p>
                    <p className="text-neutral-medium text-xs">
                      {new Date(healthData.lastHealing.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={healthData.lastHealing.success 
                      ? 'bg-status-success/20 text-status-success border-status-success/30'
                      : 'bg-status-error/20 text-status-error border-status-error/30'
                    }
                  >
                    {healthData.lastHealing.success ? 'SUCCESS' : 'FAILED'}
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-accent-base/10 border border-accent-base/30">
                  <h4 className="text-accent-base font-medium mb-2">Protocol Status</h4>
                  <p className="text-neutral-light text-sm">
                    Harmonix Self-Healing Protocol v2.0 is actively monitoring all services 
                    every 30 seconds and automatically resolving common issues.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error Rate Chart Placeholder */}
        {healthData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-background-primary/80 border-primary/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-light">Error Rate (24h)</span>
                    <Badge 
                      variant="outline" 
                      className={healthData.metrics.errorRate < 1 
                        ? 'bg-status-success/20 text-status-success border-status-success/30'
                        : 'bg-status-warning/20 text-status-warning border-status-warning/30'
                      }
                    >
                      {healthData.metrics.errorRate.toFixed(2)}%
                    </Badge>
                  </div>
                  
                  <div className="w-full bg-background-secondary/30 rounded-full h-2">
                    <div 
                      className="bg-accent-base h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, 100 - healthData.metrics.errorRate)}%` }}
                    />
                  </div>

                  <p className="text-neutral-medium text-sm">
                    Performance is {healthData.metrics.errorRate < 1 ? 'excellent' : 'good'} 
                    with {healthData.metrics.leadSubmissions24h} successful lead captures in the last 24 hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function getServiceDescription(service: string): string {
  const descriptions = {
    database: 'PostgreSQL connection',
    storage: 'File storage system',
    webSocket: 'Real-time connections',
    stripe: 'Payment processing',
    ghl: 'GoHighLevel CRM',
    hubspot: 'HubSpot integration',
    sheets: 'Google Sheets backup',
    openai: 'AI processing engine'
  };
  return descriptions[service] || 'Service status';
}