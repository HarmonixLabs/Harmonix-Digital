import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TokenMeter } from "@/components/token-meter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { QuickStartTour } from "@/components/onboarding/quick-start-tour";
import { OnboardingTrigger } from "@/components/onboarding/onboarding-trigger";
import { UserRoundCheck, Clock, CheckCircle, Activity, HelpCircle, BarChart3, Users, Zap } from "lucide-react";

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
        <div className="text-harmonix-regal-gold text-xl">Loading...</div>
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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold mb-2">
              <span className="harmony-gold">Central Command</span> Dashboard
            </h1>
            <Button
              variant="outline"
              onClick={resetOnboarding}
              className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold hover:text-slate-900"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Take Tour
            </Button>
          </div>
          <p className="text-xl text-gray-300">
            Monitor all your AI agents from a single, unified interface
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected to SŌL Brain' : 'Connecting...'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Agent Panel */}
          <div className="lg:col-span-1">
            <Card className="card-hover border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium harmony-gold mb-4 tracking-wide">CURRENT AGENT</h3>
                
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
