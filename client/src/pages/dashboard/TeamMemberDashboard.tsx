import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { 
  Cpu, Activity, MessageSquare, Clock, TrendingUp,
  PlayCircle, Pause, Settings, BarChart, Calendar,
  FileText, Zap, Users, CheckCircle2
} from 'lucide-react';
import { Link } from 'wouter';

// Mock data for team member view
const mockAgents = [
  {
    id: 1,
    name: 'Cash Flow Agent',
    type: 'sales',
    status: 'active',
    lastRun: '2 hours ago',
    successRate: 96,
    tasksCompleted: 128,
    icon: '💰',
  },
  {
    id: 2,
    name: 'Echo Support Agent',
    type: 'support',
    status: 'active',
    lastRun: '30 minutes ago',
    successRate: 98,
    tasksCompleted: 456,
    icon: '🎧',
  },
  {
    id: 3,
    name: 'Iris Analytics Agent',
    type: 'analytics',
    status: 'paused',
    lastRun: '1 day ago',
    successRate: 94,
    tasksCompleted: 89,
    icon: '📊',
  },
];

const mockRecentActivity = [
  { id: 1, agent: 'Cash Flow', action: 'Processed 15 leads', time: '10 minutes ago', status: 'success' },
  { id: 2, agent: 'Echo Support', action: 'Resolved customer ticket #1234', time: '25 minutes ago', status: 'success' },
  { id: 3, agent: 'Cash Flow', action: 'Generated sales report', time: '1 hour ago', status: 'success' },
  { id: 4, agent: 'Iris Analytics', action: 'Paused by admin', time: '1 day ago', status: 'warning' },
];

export default function TeamMemberDashboard() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-harmonix-regal-gold">
            My Workspace
          </h1>
          <p className="text-harmonix-sage-fade mt-1">
            Manage your AI agents and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/marketplace">
              <Cpu className="h-4 w-4 mr-2" />
              Browse Agents
            </Link>
          </Button>
          <Button size="sm" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
            <MessageSquare className="h-4 w-4 mr-2" />
            Get Help
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Active Agents
            </CardTitle>
            <Cpu className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2 / 3</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              1 agent paused
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Tasks Today
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-green-400 mt-1">
              <TrendingUp className="inline h-3 w-3" /> 23% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Success Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">96.2%</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Time Saved
            </CardTitle>
            <Clock className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">18.5h</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-harmonix-deep-forest/50">
          <TabsTrigger value="agents">My Agents</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* My Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAgents.map((agent) => (
              <Card 
                key={agent.id}
                className={`bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 cursor-pointer transition-all hover:border-harmonix-regal-gold/50 ${
                  selectedAgent === agent.id ? 'ring-2 ring-harmonix-regal-gold' : ''
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{agent.icon}</span>
                      <div>
                        <CardTitle className="text-harmonix-regal-gold">{agent.name}</CardTitle>
                        <CardDescription className="text-harmonix-sage-fade capitalize">
                          {agent.type} Agent
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                      className={agent.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-harmonix-sage-fade">Success Rate</span>
                      <span className="text-white">{agent.successRate}%</span>
                    </div>
                    <Progress value={agent.successRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-harmonix-sage-fade">Tasks</p>
                      <p className="text-white font-medium">{agent.tasksCompleted}</p>
                    </div>
                    <div>
                      <p className="text-harmonix-sage-fade">Last Run</p>
                      <p className="text-white font-medium">{agent.lastRun}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {agent.status === 'active' ? (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1 bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Resume
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Recent Activity</CardTitle>
              <CardDescription className="text-harmonix-sage-fade">
                Track what your agents have been doing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-harmonix-deep-forest/50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-600/20' : 'bg-yellow-600/20'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.agent}</p>
                      <p className="text-sm text-harmonix-sage-fade">{activity.action}</p>
                    </div>
                    <span className="text-xs text-harmonix-sage-fade">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
              <CardHeader>
                <CardTitle className="text-harmonix-regal-gold">Task Completion Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-harmonix-sage-fade">
                  <BarChart className="h-12 w-12 opacity-50" />
                  <span className="ml-2">Performance chart</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
              <CardHeader>
                <CardTitle className="text-harmonix-regal-gold">Agent Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAgents.map((agent) => (
                    <div key={agent.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-harmonix-sage-fade flex items-center gap-2">
                          <span>{agent.icon}</span>
                          {agent.name}
                        </span>
                        <span className="text-white">{agent.successRate}%</span>
                      </div>
                      <Progress value={agent.successRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}