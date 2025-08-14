import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  Users, 
  TrendingUp, 
  Settings, 
  Shield, 
  Crown,
  Sparkles,
  Activity,
  Database,
  RefreshCw,
  LogOut
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tokenBalance: number;
    organizationId: number;
    profileImageUrl?: string;
  };
  organization: {
    id: number;
    name: string;
    planType: string;
    tokenQuota: number;
    tokensUsed: number;
  };
  agents: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    lastActive: string;
    tasksCompleted: number;
  }>;
  recentTasks: Array<{
    id: number;
    title: string;
    agentName: string;
    status: string;
    createdAt: string;
  }>;
  stats: {
    totalAgents: number;
    totalTasks: number;
    tokensUsed: number;
    tokensRemaining: number;
    tokenUsagePercentage: number;
  };
}

export default function Dashboard() {
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard/data"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Session Expired",
        description: "Please log in to continue",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [error, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-[#D8C9A9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#D8C9A9] font-medium">Loading Harmonix Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d] flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#D8C9A9]">Welcome to Harmonix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80 text-center">
              Access your AI agent orchestration platform
            </p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="w-full bg-[#D8C9A9] text-[#002a2d] hover:bg-[#D8C9A9]/90"
            >
              Sign In with Replit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/80">Unable to load dashboard data</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-[#D8C9A9] text-[#D8C9A9]"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { user, organization, agents, recentTasks, stats } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D8C9A9] to-[#B8A989] rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#002a2d]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Harmonix</h1>
                <p className="text-sm text-[#D8C9A9]">AI Agent Orchestration Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="text-right">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-sm text-[#D8C9A9]">{organization.name}</p>
                </div>
                <Badge 
                  variant="secondary"
                  className="bg-[#D8C9A9]/20 text-[#D8C9A9] border-[#D8C9A9]/30"
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              
              <Button
                onClick={() => window.location.href = "/api/logout"}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Active Agents</CardTitle>
              <Brain className="h-4 w-4 text-[#D8C9A9]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalAgents}</div>
              <p className="text-xs text-white/60">
                {agents.filter(a => a.status === 'active').length} currently active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Tasks Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#D8C9A9]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
              <p className="text-xs text-white/60">
                +{recentTasks.filter(t => t.status === 'completed').length} this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Token Usage</CardTitle>
              <Zap className="h-4 w-4 text-[#D8C9A9]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.tokenUsagePercentage}%</div>
              <Progress 
                value={stats.tokenUsagePercentage} 
                className="mt-2 h-2 bg-white/20"
              />
              <p className="text-xs text-white/60 mt-1">
                {stats.tokensRemaining.toLocaleString()} tokens remaining
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Plan Status</CardTitle>
              <Crown className="h-4 w-4 text-[#D8C9A9]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white capitalize">{organization.planType}</div>
              <p className="text-xs text-white/60">
                {organization.tokenQuota.toLocaleString()} token quota
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#D8C9A9] data-[state=active]:text-[#002a2d]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-[#D8C9A9] data-[state=active]:text-[#002a2d]">
              Agents
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-[#D8C9A9] data-[state=active]:text-[#002a2d]">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#D8C9A9] data-[state=active]:text-[#002a2d]">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Status Panel */}
              <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#D8C9A9]" />
                    Agent Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agents.slice(0, 4).map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{agent.name}</p>
                        <p className="text-sm text-white/60">{agent.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={agent.status === 'active' ? 'default' : 'secondary'}
                          className={agent.status === 'active' ? 
                            'bg-green-500/20 text-green-400 border-green-500/30' : 
                            'bg-white/10 text-white/60 border-white/20'
                          }
                        >
                          {agent.status}
                        </Badge>
                        <p className="text-xs text-white/60 mt-1">
                          {agent.tasksCompleted} tasks
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full border-[#D8C9A9] text-[#D8C9A9] hover:bg-[#D8C9A9]/10"
                  >
                    View All Agents
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#D8C9A9]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-white/60">{task.agentName}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary"
                          className={
                            task.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            task.status === 'running' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }
                        >
                          {task.status}
                        </Badge>
                        <p className="text-xs text-white/60 mt-1">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20 hover:border-[#D8C9A9]/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{agent.name}</span>
                      <Badge 
                        variant={agent.status === 'active' ? 'default' : 'secondary'}
                        className={agent.status === 'active' ? 
                          'bg-green-500/20 text-green-400 border-green-500/30' : 
                          'bg-white/10 text-white/60 border-white/20'
                        }
                      >
                        {agent.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-white/80 mb-2">Agent Type</p>
                      <p className="text-[#D8C9A9] font-medium">{agent.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/80 mb-2">Performance</p>
                      <p className="text-white">{agent.tasksCompleted} tasks completed</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/80 mb-2">Last Active</p>
                      <p className="text-white/60 text-sm">{agent.lastActive}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#D8C9A9] text-[#D8C9A9] hover:bg-[#D8C9A9]/10"
                    >
                      Configure Agent
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
              <CardHeader>
                <CardTitle className="text-white">Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{task.title}</h4>
                        <p className="text-sm text-white/60">Assigned to {task.agentName}</p>
                        <p className="text-xs text-white/50">{new Date(task.createdAt).toLocaleString()}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={
                          task.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          task.status === 'running' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Organization Settings */}
              <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#D8C9A9]" />
                    Organization Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-white/80">Organization Name</label>
                    <p className="text-white font-medium mt-1">{organization.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Plan Type</label>
                    <p className="text-[#D8C9A9] font-medium mt-1 capitalize">{organization.planType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Token Quota</label>
                    <p className="text-white font-medium mt-1">{organization.tokenQuota.toLocaleString()}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Button 
                      variant="outline" 
                      className="w-full border-[#D8C9A9] text-[#D8C9A9] hover:bg-[#D8C9A9]/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Organization
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* User Profile */}
              <Card className="bg-white/10 backdrop-blur-lg border-[#D8C9A9]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D8C9A9]" />
                    User Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-white/80">Name</label>
                    <p className="text-white font-medium mt-1">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Email</label>
                    <p className="text-white font-medium mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Role</label>
                    <p className="text-[#D8C9A9] font-medium mt-1 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Token Balance</label>
                    <p className="text-white font-medium mt-1">{user.tokenBalance.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Self-Heal Protocol (Founder only) */}
        {user.role === 'admin' && (
          <Card className="bg-gradient-to-r from-[#D8C9A9]/10 to-[#B8A989]/10 backdrop-blur-lg border-[#D8C9A9]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D8C9A9]" />
                Self-Healing Protocol
                <Badge className="bg-[#D8C9A9]/20 text-[#D8C9A9] border-[#D8C9A9]/30">
                  Founder Access
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80">
                Monitor and automatically remediate platform issues across your organization.
              </p>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="border-[#D8C9A9] text-[#D8C9A9] hover:bg-[#D8C9A9]/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run System Check
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#D8C9A9] text-[#D8C9A9] hover:bg-[#D8C9A9]/10"
                >
                  <Database className="w-4 h-4 mr-2" />
                  View System Health
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}