import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { AIHelpButton } from '@/components/ui/ai-tooltip-system';
import { selfHealingProtocol, useSelfHealing } from '@/lib/self-healing-protocol';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Activity } from 'lucide-react';

interface PlatformLayoutProps {
  children: React.ReactNode;
  showFeatures?: boolean;
  enableSelfHealing?: boolean;
}

export function PlatformLayout({ 
  children, 
  showFeatures = true, 
  enableSelfHealing = true 
}: PlatformLayoutProps) {
  const [healingStatus, setHealingStatus] = useState<any>(null);
  const { triggerHeal, getStatus } = useSelfHealing();

  useEffect(() => {
    if (enableSelfHealing) {
      // Initialize self-healing protocol
      console.log('🔧 Harmonix Self-Healing Protocol v2.0 Activated');
      
      // Update status periodically
      const statusInterval = setInterval(() => {
        setHealingStatus(getStatus());
      }, 5000);

      return () => clearInterval(statusInterval);
    }
  }, [enableSelfHealing]);

  const handleForceHeal = () => {
    console.log('🔧 User triggered force heal - Activating self-healing protocol...');
    triggerHeal();
  };

  return (
    <div className="min-h-screen bg-harmonix-black text-harmonix-sage relative">
      {/* Interactive Features Integration Layer */}
      {showFeatures && (
        <>
          {/* Floating Theme Switcher */}
          <ThemeSwitcher 
            variant="floating" 
            className="fixed bottom-20 right-6 z-40" 
          />
          
          {/* AI Help Assistant */}
          <AIHelpButton 
            personality="harmonix"
            className="fixed bottom-6 right-6 z-40"
          />
          
          {/* Self-Healing Status Indicator */}
          {enableSelfHealing && healingStatus && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              className="fixed top-20 right-6 z-30"
            >
              <div className="bg-harmonix-night/90 backdrop-blur-sm border border-harmonix-sage/20 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="w-4 h-4 text-jade-forest" />
                  </motion.div>
                  <span className="text-xs font-medium text-harmonix-sage">
                    Self-Healing Active
                  </span>
                </div>
                
                <div className="space-y-1">
                  {healingStatus.checks?.slice(0, 3).map((check: any) => (
                    <div key={check.id} className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          check.status === 'healthy' ? 'bg-green-500' :
                          check.status === 'healing' ? 'bg-yellow-500' :
                          check.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-xs text-harmonix-sage/70">
                        {check.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={handleForceHeal}
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 text-xs h-6"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Force Heal
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Feature Integration Notification */}
      <FeatureIntegrationNotification />
    </div>
  );
}

function FeatureIntegrationNotification() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Listen for feature integration events
    const handleFeatureIntegration = (event: CustomEvent) => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    window.addEventListener('harmonix:integrate-features', handleFeatureIntegration as EventListener);
    
    return () => {
      window.removeEventListener('harmonix:integrate-features', handleFeatureIntegration as EventListener);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-jade-forest/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1 }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <span className="text-sm font-medium">
          Interactive features integrated successfully!
        </span>
      </div>
    </motion.div>
  );
}