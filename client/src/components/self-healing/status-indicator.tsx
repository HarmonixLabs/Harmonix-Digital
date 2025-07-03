import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  RefreshCw,
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { selfHealingMonitor, type SystemHealth } from "@/lib/self-healing";

interface HealthStatusIndicatorProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  expandable?: boolean;
}

export function HealthStatusIndicator({ 
  position = 'bottom-right',
  expandable = true 
}: HealthStatusIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Start monitoring
    selfHealingMonitor.startMonitoring();

    // Listen for health updates
    const handleHealthUpdate = (event: CustomEvent<SystemHealth>) => {
      setHealth(event.detail);
    };

    window.addEventListener('system-health-update' as any, handleHealthUpdate);

    // Initial health check
    selfHealingMonitor.runHealthChecks().then(setHealth);

    return () => {
      window.removeEventListener('system-health-update' as any, handleHealthUpdate);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const newHealth = await selfHealingMonitor.runHealthChecks();
    setHealth(newHealth);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4'
  };

  if (!health) return null;

  return (
    <>
      {/* Floating Indicator */}
      <div className={cn(
        "fixed z-50 transition-all duration-300",
        positionClasses[position]
      )}>
        {!isExpanded && (
          <button
            onClick={() => expandable && setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full shadow-lg",
              "bg-harmonix-night-pine/90 backdrop-blur border border-harmonix-cedar-mist/20",
              "hover:scale-105 transition-transform cursor-pointer"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              getStatusColor(health.overall)
            )} />
            <span className="text-xs text-white font-medium">
              System {health.overall}
            </span>
            {health.autoFixesApplied > 0 && (
              <span className="text-xs text-harmonix-regal-gold">
                ({health.autoFixesApplied} fixes)
              </span>
            )}
          </button>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <Card className="w-80 bg-harmonix-night-pine/95 backdrop-blur border-harmonix-cedar-mist/20 shadow-xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-harmonix-regal-gold" />
                  <h3 className="font-semibold text-white">System Health</h3>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded hover:bg-harmonix-cedar-mist/20 transition-colors"
                >
                  <X className="w-4 h-4 text-harmonix-sage-fade" />
                </button>
              </div>

              {/* Overall Status */}
              <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-harmonix-deep-forest/50">
                <div className="flex items-center gap-2">
                  {getStatusIcon(health.overall)}
                  <span className="text-sm font-medium text-white capitalize">
                    {health.overall} Status
                  </span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1 rounded hover:bg-harmonix-cedar-mist/20 transition-colors"
                >
                  <RefreshCw className={cn(
                    "w-4 h-4 text-harmonix-regal-gold",
                    isRefreshing && "animate-spin"
                  )} />
                </button>
              </div>

              {/* Health Checks */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {health.checks.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg bg-harmonix-deep-forest/30"
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5",
                      getStatusColor(check.status)
                    )} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">
                        {check.name}
                      </p>
                      <p className="text-xs text-harmonix-sage-fade">
                        {check.message}
                      </p>
                      {check.canAutoFix && check.status !== 'healthy' && (
                        <p className="text-xs text-harmonix-regal-gold mt-1">
                          ✨ Auto-fix available
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-harmonix-cedar-mist/20">
                <p className="text-xs text-harmonix-sage-fade">
                  Last checked: {new Date(health.lastChecked).toLocaleTimeString()}
                </p>
                {health.autoFixesApplied > 0 && (
                  <p className="text-xs text-harmonix-regal-gold mt-1">
                    {health.autoFixesApplied} issues auto-fixed
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}