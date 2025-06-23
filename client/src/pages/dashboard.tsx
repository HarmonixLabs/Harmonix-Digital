import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TokenMeter } from "@/components/token-meter";
import { SacredButton } from "@/components/ui/sacred-button";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredLoader } from "@/components/ui/sacred-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { QuickStartTour } from "@/components/onboarding/quick-start-tour";
import { OnboardingTrigger } from "@/components/onboarding/onboarding-trigger";
import { DemoPreviewWidget } from "@/components/demo/demo-preview-widget";
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
    <div className="min-h-screen harmonix-gradient">
      <Navbar />
      
      <div className="harmonix-content-width py-8">
        {/* Sacred Welcome Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="w-8 h-8" style={{ color: '#D1BFA7' }} />
            <h1 className="text-5xl font-bold" style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#F5EDDD'
            }}>
              Welcome back, <span style={{ color: '#D1BFA7' }}>{user.name}</span>
            </h1>
            <Crown className="w-8 h-8" style={{ color: '#D1BFA7' }} />
          </div>
          <p className="text-xl mb-6" style={{
            fontFamily: 'Inter, sans-serif',
            color: 'rgba(209, 191, 167, 0.7)',
            fontWeight: '400'
          }}>
            Your AI automation sanctuary is operating at peak efficiency
          </p>
          
          {/* Sacred Status Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#D1BFA7' }} />
              <span className="text-sm" style={{ color: 'rgba(209, 191, 167, 0.6)' }}>SŌL Brain Active</span>
            </div>
            <div className="w-px h-4" style={{ background: 'rgba(209, 191, 167, 0.3)' }} />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" 
                   style={{ 
                     background: '#1E6866',
                     animationDelay: "0.5s" 
                   }} />
              <span className="text-sm" style={{ color: 'rgba(30, 104, 102, 0.6)' }}>Agents Online</span>
            </div>
          </div>
        </div>

        {/* Sacred Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <SacredCard variant="agent" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-gold/60 text-sm harmonix-mono-font uppercase tracking-wider">Sacred Agents</p>
                <p className="text-3xl font-bold text-white harmonix-header-font">{mockStats.totalAgents}</p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-warm-gold to-transparent mt-2" />
              </div>
              <div className="relative">
                <Users className="w-10 h-10 text-warm-gold harmonix-lotus" />
                <div className="absolute inset-0 w-10 h-10 border border-warm-gold/30 rounded-full animate-ping" />
              </div>
            </div>
          </SacredCard>

          <SacredCard variant="agent" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-gold/60 text-sm harmonix-mono-font uppercase tracking-wider">Active Tasks</p>
                <p className="text-3xl font-bold text-white harmonix-header-font">{mockStats.activeTasks}</p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-warm-gold to-transparent mt-2" />
              </div>
              <div className="relative">
                <Activity className="w-10 h-10 text-warm-gold harmonix-lotus" />
                <div className="absolute inset-0 w-10 h-10 border border-warm-gold/30 rounded-full animate-ping" />
              </div>
            </div>
          </SacredCard>

          <SacredCard variant="agent" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-gold/60 text-sm harmonix-mono-font uppercase tracking-wider">Tokens Used</p>
                <p className="text-3xl font-bold text-white harmonix-header-font">{mockStats.tokensUsed.toLocaleString()}</p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-warm-gold to-transparent mt-2" />
              </div>
              <div className="relative">
                <Zap className="w-10 h-10 text-warm-gold harmonix-lotus" />
                <div className="absolute inset-0 w-10 h-10 border border-warm-gold/30 rounded-full animate-ping" />
              </div>
            </div>
          </SacredCard>

          <SacredCard variant="agent" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-gold/60 text-sm harmonix-mono-font uppercase tracking-wider">Performance</p>
                <p className="text-3xl font-bold text-white harmonix-header-font">94%</p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-warm-gold to-transparent mt-2" />
              </div>
              <div className="relative">
                <BarChart3 className="w-10 h-10 text-warm-gold harmonix-lotus" />
                <div className="absolute inset-0 w-10 h-10 border border-warm-gold/30 rounded-full animate-ping" />
              </div>
            </div>
          </SacredCard>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SacredCard variant="default" className="p-6">
            <div className="mb-4">
              <h3 className="harmonix-header-font text-xl text-white mb-2">Recent Tasks</h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-warm-gold to-transparent" />
            </div>
            <div className="space-y-4">
              {mockTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-warm-gold/5 border border-warm-gold/20">
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
              ))}
            </div>
          </SacredCard>

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

          <DemoPreviewWidget />
        </div>
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
  );
}