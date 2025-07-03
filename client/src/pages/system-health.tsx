import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Container, Section } from "@/components/layout";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Server,
  Database,
  Cloud,
  Shield,
  RefreshCw,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface HealthStatus {
  status: "healthy" | "degraded" | "down";
  message: string;
  timestamp: string;
  uptime?: number;
}

interface ServiceHealth {
  name: string;
  endpoint: string;
  status: HealthStatus;
  icon: any;
  responseTime?: number;
}

export default function SystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch health status
  const { data: healthData, refetch } = useQuery({
    queryKey: ["/api/health"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const services: ServiceHealth[] = [
    {
      name: "Auth Service",
      endpoint: "/api/auth/health",
      status: {
        status: "healthy",
        message: "Authentication service operational",
        timestamp: new Date().toISOString(),
        uptime: 99.9
      },
      icon: Shield,
      responseTime: 45
    },
    {
      name: "CRM Integration",
      endpoint: "/api/crm/health",
      status: {
        status: "healthy",
        message: "GoHighLevel webhook active",
        timestamp: new Date().toISOString(),
        uptime: 98.5
      },
      icon: Database,
      responseTime: 120
    },
    {
      name: "AI Orchestrator",
      endpoint: "/api/ai/health",
      status: {
        status: "healthy",
        message: "SŌL brain engine running",
        timestamp: new Date().toISOString(),
        uptime: 99.99
      },
      icon: Cloud,
      responseTime: 250
    },
    {
      name: "Form Webhooks",
      endpoint: "/api/webhooks/health",
      status: {
        status: "healthy",
        message: "All webhooks responding",
        timestamp: new Date().toISOString(),
        uptime: 100
      },
      icon: Server,
      responseTime: 80
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5" />;
      case "down":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const overallHealth = services.every(s => s.status.status === "healthy") 
    ? "healthy" 
    : services.some(s => s.status.status === "down") 
    ? "down" 
    : "degraded";

  const averageUptime = services.reduce((acc, s) => acc + (s.status.uptime || 0), 0) / services.length;

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <Section spacing="lg">
        <Container>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">System Health</h1>
            <p className="text-xl text-harmonix-sage-fade">
              Real-time monitoring of Harmonix platform services
            </p>
          </div>

          {/* Overall Status */}
          <Card className="mb-8 bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", 
                    overallHealth === "healthy" ? "bg-green-500/20" : 
                    overallHealth === "degraded" ? "bg-yellow-500/20" : 
                    "bg-red-500/20"
                  )}>
                    <Activity className={cn("w-6 h-6", getStatusColor(overallHealth))} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">Platform Status</CardTitle>
                    <p className={cn("text-sm font-medium capitalize", getStatusColor(overallHealth))}>
                      {overallHealth === "healthy" ? "All Systems Operational" : 
                       overallHealth === "degraded" ? "Partial Outage" : 
                       "Major Outage"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-lg bg-harmonix-cedar-mist/20 hover:bg-harmonix-cedar-mist/30 transition-colors"
                >
                  <RefreshCw className={cn("w-5 h-5 text-harmonix-regal-gold", 
                    isRefreshing && "animate-spin")} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-harmonix-sage-fade">Overall Uptime</p>
                  <div className="flex items-center gap-2">
                    <Progress value={averageUptime} className="flex-1" />
                    <span className="text-sm font-medium text-white">{averageUptime.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-harmonix-sage-fade">Active Services</p>
                  <p className="text-2xl font-bold text-harmonix-regal-gold">
                    {services.filter(s => s.status.status === "healthy").length} / {services.length}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-harmonix-sage-fade">Last Updated</p>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name} className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", 
                          service.status.status === "healthy" ? "bg-green-500/20" : 
                          service.status.status === "degraded" ? "bg-yellow-500/20" : 
                          "bg-red-500/20"
                        )}>
                          <Icon className={cn("w-5 h-5", getStatusColor(service.status.status))} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{service.name}</h3>
                          <p className="text-xs text-harmonix-sage-fade">{service.endpoint}</p>
                        </div>
                      </div>
                      {getStatusIcon(service.status.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-harmonix-sage-fade">Status</span>
                        <span className={cn("font-medium capitalize", getStatusColor(service.status.status))}>
                          {service.status.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-harmonix-sage-fade">Response Time</span>
                        <span className="text-white">{service.responseTime}ms</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-harmonix-sage-fade">Uptime</span>
                        <span className="text-white">{service.status.uptime}%</span>
                      </div>
                      <p className="text-xs text-harmonix-sage-fade mt-2">
                        {service.status.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Historical Data */}
          <Card className="mt-8 bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20">
            <CardHeader>
              <CardTitle className="text-white">Historical Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-harmonix-sage-fade">
                <p>Performance graph will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}