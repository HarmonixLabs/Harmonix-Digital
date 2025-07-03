import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PlatformLayout } from "@/components/layout/platform-layout";
import { TokenMeter } from "@/components/token-meter";
import { SacredButton } from "@/components/ui/sacred-button";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredLoader } from "@/components/ui/sacred-loader";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale, BreathingGlow, FloatingElement } from "@/components/ui/micro-animations";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { QuickStartTour } from "@/components/onboarding/quick-start-tour";
import { OnboardingTrigger } from "@/components/onboarding/onboarding-trigger";
import { DemoPreviewWidget } from "@/components/demo/demo-preview-widget";
import { 
  AgentPerformanceWidget,
  TaskCompletionWidget,
  EnergyMeterWidget,
  AchievementWidget,
  QuickStatsWidget
} from "@/components/ui/personalized-widgets";
import { AILoadingSkeleton } from "@/components/ui/ai-loading-skeleton";
import { AITooltip } from "@/components/ui/ai-tooltip-system";
import { UserRoundCheck, Clock, CheckCircle, Activity, HelpCircle, BarChart3, Users, Zap, Crown } from "lucide-react";

export default function Dashboard() {
  const { user, organization } = useAuth();
  const [showQuickStartTour, setShowQuickStartTour] = useState(false);

  // Check if user should see onboarding/tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('harmonix_tour_completed');
    const hasSkippedOnboarding = localStorage.getItem('harmonix_onboarding_skipped');
    
    if (!hasSeenTour && !hasSkippedOnboarding && user && !user.onboardingCompleted) {
      // Show onboarding trigger instead of tour for new users
      return;
    } else if (!hasSeenTour && user && user.onboardingCompleted) {
      setShowQuickStartTour(true);
    }
  }, [user]);

  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/agents'],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/analytics/stats'],
  });

  const currentAgent = agents[0]; // For demo, show first agent as "current"
  const recentTasks = tasks.slice(0, 5);

  // Mock data for demonstration
  const mockStats = {
    totalAgents: 3,
    activeTasks: 12,
    tokensUsed: 2847,
    tokensRemaining: 7153
  };

  const mockTasks = [
    {
      id: 1,
      title: "Process new leads from website",
      agent: "Agent CA$H",
      status: "completed",
      completedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: 2,
      title: "Send follow-up emails to prospects",
      agent: "Agent CA$H", 
      status: "in_progress",
      createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      id: 3,
      title: "Update CRM with lead scoring",
      agent: "Concierge Agent",
      status: "completed",
      completedAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen harmonix-gradient flex items-center justify-center">
        <SacredLoader size="lg" />
      </div>
    );
  }

  // Show onboarding trigger for new users who haven't completed setup
  const hasSkippedOnboarding = localStorage.getItem('harmonix_onboarding_skipped');
  if (!user.onboardingCompleted && !hasSkippedOnboarding) {
    return (
      <div className="min-h-screen harmonix-gradient">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <OnboardingTrigger
            onStart={() => setShowQuickStartTour(true)}
            className="max-w-lg w-full"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <PlatformLayout showFeatures={true} enableSelfHealing={true}>
      <div className="min-h-screen harmonix-gradient">
        <Navbar />
      
      <div className="harmonix-content-width py-8">
        {/* Sacred Welcome Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="w-8 h-8" style={{ color: '#d7b76d' }} />
            <h1 className="text-5xl font-bold" style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#768b7c'
            }}>
              Welcome back, <span style={{ color: '#d7b76d' }}>{user.name}</span>
            </h1>
            <Crown className="w-8 h-8" style={{ color: '#d7b76d' }} />
          </div>
          <p className="text-xl mb-6" style={{
            fontFamily: 'Inter, sans-serif',
            color: 'rgba(118, 139, 124, 0.8)',
            fontWeight: '400'
          }}>
            Your AI automation sanctuary is operating at peak efficiency
          </p>
          
          {/* Sacred Status Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#d7b76d' }} />
              <span className="text-sm" style={{ color: 'rgba(118, 139, 124, 0.7)' }}>SŌL Brain Active</span>
            </div>
            <div className="w-px h-4" style={{ background: 'rgba(118, 139, 124, 0.3)' }} />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" 
                   style={{ 
                     background: '#2f4e46',
                     animationDelay: "0.5s" 
                   }} />
              <span className="text-sm" style={{ color: 'rgba(47, 78, 70, 0.8)' }}>Agents Online</span>
            </div>
          </div>
        </div>

        {/* Sacred Stats Overview */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StaggerItem>
            <AnimatedCard delay={0.2}>
              <SacredCard variant="agent" className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider" style={{ 
                      color: 'rgba(118, 139, 124, 0.7)',
                      fontFamily: 'SF Mono, monospace'
                    }}>Sacred Agents</p>
                    <p className="text-3xl font-bold mt-2" style={{ 
                      color: '#768b7c',
                      fontFamily: 'Playfair Display, serif'
                    }}>{mockStats.totalAgents}</p>
                    <div className="w-12 h-0.5 mt-2" style={{ 
                      background: 'linear-gradient(to right, #d7b76d, transparent)'
                    }} />
                  </div>
                  <FloatingElement amplitude={5} duration={4}>
                    <div className="relative">
                      <Users className="w-10 h-10 harmonix-lotus" style={{ color: '#d7b76d' }} />
                      <div className="absolute inset-0 w-10 h-10 border rounded-full animate-ping" 
                           style={{ borderColor: 'rgba(215, 183, 109, 0.4)' }} />
                    </div>
                  </FloatingElement>
                </div>
              </SacredCard>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard delay={0.3}>
              <SacredCard variant="agent" className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warm-gold/60 text-sm harmonix-mono-font uppercase tracking-wider">Active Tasks</p>
                    <p className="text-3xl font-bold text-white harmonix-header-font">{mockStats.activeTasks}</p>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-warm-gold to-transparent mt-2" />
                  </div>
                  <FloatingElement amplitude={3} duration={3}>
                    <div className="relative">
                      <Activity className="w-10 h-10 text-warm-gold harmonix-lotus" />
                      <div className="absolute inset-0 w-10 h-10 border border-warm-gold/30 rounded-full animate-ping" />
                    </div>
                  </FloatingElement>
                </div>
              </SacredCard>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <BreathingGlow>
              <AnimatedCard delay={0.4}>
                <SacredCard variant="agent" className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-warm-gold/60 text-sm harmonix-mono-font uppercase tracking-wider">Tokens Used</p>
                      <p className="text-3xl font-bold text-white harmonix-header-font">{mockStats.tokensUsed.toLocaleString()}</p>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-warm-gold to-transparent mt-2" />
                    </div>
                    <FloatingElement amplitude={4} duration={2.5}>
                      <div className="relative">
                        <Zap className="w-10 h-10 text-warm-gold harmonix-lotus" />
                        <div className="absolute inset-0 w-10 h-10 border border-warm-gold/30 rounded-full animate-ping" />
                      </div>
                    </FloatingElement>
                  </div>
                </SacredCard>
              </AnimatedCard>
            </BreathingGlow>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard delay={0.5}>
              <SacredCard variant="agent" className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warm-gold/60 text-sm harmonix-mono-font uppercase tracking-wider">Performance</p>
                    <p className="text-3xl font-bold text-white harmonix-header-font">94%</p>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-warm-gold to-transparent mt-2" />
                  </div>
                  <FloatingElement amplitude={6} duration={3.5}>
                    <div className="relative">
                      <BarChart3 className="w-10 h-10 text-warm-gold harmonix-lotus" />
                      <div className="absolute inset-0 w-10 h-10 border border-warm-gold/30 rounded-full animate-ping" />
                    </div>
                  </FloatingElement>
                </div>
              </SacredCard>
            </AnimatedCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Recent Activity */}
        <FadeIn delay={0.7}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedCard delay={0.8}>
              <SacredCard variant="default" className="p-6">
                <div className="mb-4">
                  <h3 className="harmonix-header-font text-xl text-white mb-2">Recent Tasks</h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-warm-gold to-transparent" />
                </div>
                <StaggerContainer className="space-y-4">
                  {mockTasks.map((task, index) => (
                    <StaggerItem key={task.id}>
                      <HoverScale scale={1.02}>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-warm-gold/5 border border-warm-gold/20 hover:border-warm-gold/40 transition-all duration-300">
                          <div className="flex-1">
                            <h4 className="font-medium text-white harmonix-body-font">{task.title}</h4>
                            <p className="text-sm text-warm-gold/60">{task.agent}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-warm-gold" />
                            ) : (
                              <Clock className="w-5 h-5 text-circuit-teal" />
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.status === 'completed' 
                                ? 'bg-warm-gold/20 text-warm-gold'
                                : 'bg-circuit-teal/20 text-circuit-teal'
                            }`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </HoverScale>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </SacredCard>
            </AnimatedCard>

            <AnimatedCard delay={0.9}>
              <SacredCard variant="default" className="p-6">
                <div className="mb-4">
                  <h3 className="harmonix-header-font text-xl text-white mb-2">Token Usage</h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-warm-gold to-transparent" />
                </div>
                <TokenMeter 
                  used={mockStats.tokensUsed} 
                  total={mockStats.tokensUsed + mockStats.tokensRemaining} 
                />
              </SacredCard>
            </AnimatedCard>

            <AnimatedCard delay={1.1}>
              <DemoPreviewWidget />
            </AnimatedCard>
          </div>
        </FadeIn>
      </div>

      <Footer />
      
      {/* Quick Start Tour */}
      {showQuickStartTour && (
        <QuickStartTour
          onClose={() => {
            setShowQuickStartTour(false);
            localStorage.setItem('harmonix_tour_completed', 'true');
          }}
          onComplete={() => {
            setShowQuickStartTour(false);
            localStorage.setItem('harmonix_tour_completed', 'true');
          }}
        />
      )}
      </div>
    </PlatformLayout>
  );
}