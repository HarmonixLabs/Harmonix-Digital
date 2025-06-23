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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-harmony-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-harmony-gold">Loading Harmonix...</p>
        </div>
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
            <Crown className="w-8 h-8 text-warm-gold" />
            <h1 className="harmonix-header-font text-5xl font-bold text-white">
              Welcome back, <span className="text-warm-gold">{user.name}</span>
            </h1>
            <Crown className="w-8 h-8 text-warm-gold" />
          </div>
          <p className="harmonix-body-font text-xl text-warm-gold/70 mb-6">
            Your AI automation sanctuary is operating at peak efficiency
          </p>
          
          {/* Sacred Status Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warm-gold rounded-full animate-pulse" />
              <span className="text-warm-gold/60 text-sm">SŌL Brain Active</span>
            </div>
            <div className="w-px h-4 bg-warm-gold/30" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-circuit-teal rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
              <span className="text-circuit-teal/60 text-sm">Agents Online</span>
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
                
                {/* Agent Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border border-harmony-gold opacity-30"></div>
                    <div className="absolute inset-2 rounded-full border border-harmony-gold opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center harmony-gold text-4xl">
                      <UserRoundCheck size={48} />
                    </div>
                    {/* Connection dots */}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-harmony-gold rounded-full"
                        style={{
                          top: `${50 + 40 * Math.cos(i * Math.PI / 3)}%`,
                          left: `${50 + 40 * Math.sin(i * Math.PI / 3)}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold harmony-gold">
                    {currentAgent?.name || "CA$H"}
                  </h4>
                  <p className="text-gray-400">Agent #001 • Sales Division</p>
                  <div className="text-xs text-harmony-gold font-mono mt-1">Always Closing</div>
                </div>

                {/* Agent Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm harmony-gold font-medium">HARMONY TOKENS</div>
                    <div className="text-2xl font-bold">
                      {currentAgent?.tokensUsed || 1280}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm harmony-gold font-medium">COMPLETED TASKS</div>
                    <div className="text-2xl font-bold">
                      {currentAgent?.tasksCompleted || 145}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Meter & Recent Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Token Meter */}
            <Card className="card-hover border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-medium harmony-gold tracking-wide">HARMONY TOKEN METER</h3>
                  <Button variant="outline" size="sm" className="border-harmony-teal text-harmony-teal hover:bg-harmony-teal hover:text-harmony-dark">
                    Edit Prompts
                  </Button>
                </div>
                
                <div className="flex items-center gap-8">
                  <TokenMeter 
                    used={stats?.tokensUsed || 580}
                    total={organization?.tokenQuota || 1000}
                  />
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Tokens Remaining</div>
                    <div className="text-3xl font-bold">
                      {stats?.tokensRemaining || 420}
                    </div>
                    <div className="text-sm text-gray-400">
                      of {organization?.tokenQuota || 1000}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card className="card-hover border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium harmony-gold mb-6 tracking-wide">RECENT TASKS</h3>
                
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex items-center justify-between py-3">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-32"></div>
                          <div className="h-3 bg-gray-800 rounded w-48"></div>
                        </div>
                        <div className="h-3 bg-gray-700 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : recentTasks.length > 0 ? (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            task.status === 'completed' ? 'bg-green-600' :
                            task.status === 'in_progress' ? 'bg-blue-600' :
                            task.status === 'failed' ? 'bg-red-600' : 'bg-gray-600'
                          }`}>
                            {task.status === 'completed' ? <CheckCircle size={12} /> :
                             task.status === 'in_progress' ? <Activity size={12} /> :
                             <Clock size={12} />}
                          </div>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-400">{task.description}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No recent tasks found</p>
                    <p className="text-sm">Deploy an agent to start processing tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="card-hover border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Agents</p>
                  <p className="text-2xl font-bold">{stats?.totalAgents || 0}</p>
                </div>
                <UserRoundCheck className="harmony-gold" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold">{stats?.totalTasks || 0}</p>
                </div>
                <Activity className="harmony-teal" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tokens Used</p>
                  <p className="text-2xl font-bold">{stats?.tokensUsed || 0}</p>
                </div>
                <div className="harmony-gold text-2xl">⚡</div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold">97%</p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
