import { Navbar } from "@/components/layout/navbar";
import { TokenMeter } from "@/components/token-meter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useWebSocket } from "@/hooks/use-websocket";
import { UserRoundCheck, Clock, CheckCircle, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { user, organization } = useAuth();
  const { isConnected } = useWebSocket();

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-400">Please log in to access the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="harmony-gold">Central Command</span> Dashboard
          </h1>
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
