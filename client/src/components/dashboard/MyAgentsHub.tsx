import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'wouter';
import { 
  Cpu, Activity, MessageSquare, Settings, Pause, Play, 
  AlertCircle, CheckCircle, Clock, BarChart3, DollarSign,
  Users, Zap, LogOut, Sparkles
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'paused';
  avatar: string;
  personality: string;
  nftLicense?: string;
  lastSync: string;
  tasksCompleted: number;
  apiCallsUsed: number;
  platformIntegrations: string[];
  revenue: number;
  accuracy: number;
}

const mockAgents: Agent[] = [
  {
    id: 'cash-001',
    name: 'CA$H',
    type: 'Sales Agent',
    status: 'active',
    avatar: '💰',
    personality: 'High-energy closer',
    nftLicense: 'FOUNDER-777',
    lastSync: '2 minutes ago',
    tasksCompleted: 1248,
    apiCallsUsed: 4821,
    platformIntegrations: ['Stripe', 'GoHighLevel', 'OpenAI'],
    revenue: 48500,
    accuracy: 98.5
  },
  {
    id: 'grace-001',
    name: 'GRACE',
    type: 'Concierge',
    status: 'active',
    avatar: '🌟',
    personality: 'Warm & empathetic',
    nftLicense: 'FOUNDER-223',
    lastSync: '5 minutes ago',
    tasksCompleted: 892,
    apiCallsUsed: 2104,
    platformIntegrations: ['Slack', 'Email', 'Calendar'],
    revenue: 12000,
    accuracy: 99.2
  },
  {
    id: 'echo-001',
    name: 'ECHO',
    type: 'Social Media',
    status: 'active',
    avatar: '📱',
    personality: 'Creative trendsetter',
    nftLicense: 'FOUNDER-445',
    lastSync: '1 hour ago',
    tasksCompleted: 567,
    apiCallsUsed: 1893,
    platformIntegrations: ['Instagram', 'LinkedIn', 'X'],
    revenue: 8900,
    accuracy: 96.8
  },
  {
    id: 'flow-001',
    name: 'FLOW',
    type: 'HR Manager',
    status: 'paused',
    avatar: '👥',
    personality: 'Analytical & fair',
    lastSync: '1 day ago',
    tasksCompleted: 234,
    apiCallsUsed: 567,
    platformIntegrations: ['ADP', 'BambooHR'],
    revenue: 3400,
    accuracy: 97.5
  }
];

export default function MyAgentsHub() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const toggleAgentStatus = (agentId: string) => {
    // Toggle agent active/inactive status
    console.log('Toggling agent:', agentId);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">
                  {mockAgents.filter(a => a.status === 'active').length}
                </p>
              </div>
              <Cpu className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">
                  {mockAgents.reduce((sum, a) => sum + a.tasksCompleted, 0).toLocaleString()}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Generated</p>
                <p className="text-2xl font-bold">
                  ${mockAgents.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API Calls</p>
                <p className="text-2xl font-bold">
                  {mockAgents.reduce((sum, a) => sum + a.apiCallsUsed, 0).toLocaleString()}
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockAgents.map((agent) => (
          <Card key={agent.id} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${
              agent.status === 'active' ? 'bg-green-500/10' : 
              agent.status === 'paused' ? 'bg-yellow-500/10' : 'bg-gray-500/10'
            } rounded-bl-full`} />
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{agent.avatar}</div>
                  <div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                    <CardDescription>{agent.type}</CardDescription>
                  </div>
                </div>
                <Switch
                  checked={agent.status === 'active'}
                  onCheckedChange={() => toggleAgentStatus(agent.id)}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={agent.status === 'active' ? 'default' : 
                       agent.status === 'paused' ? 'secondary' : 'outline'}>
                  {agent.status}
                </Badge>
                {agent.nftLicense && (
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {agent.nftLicense}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {agent.personality} • Last sync: {agent.lastSync}
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tasks Completed</span>
                    <span className="font-medium">{agent.tasksCompleted}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Accuracy</span>
                    <span className="font-medium">{agent.accuracy}%</span>
                  </div>
                  <Progress value={agent.accuracy} className="h-2" />
                </div>
              </div>

              {/* Platform Integrations */}
              <div className="flex flex-wrap gap-1">
                {agent.platformIntegrations.map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedAgent(agent)}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Open Chat
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowLogs(true);
                  }}
                  className="flex-1"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Agent Logs
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  {agent.status === 'active' ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Agent Card */}
        <Link href="/marketplace">
          <Card className="border-dashed cursor-pointer hover:border-primary transition-colors min-h-[400px] flex items-center justify-center">
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Deploy New Agent</h3>
              <p className="text-sm text-muted-foreground">
                Browse the marketplace to find and deploy new AI agents
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Agent Logs Dialog */}
      <Dialog open={showLogs && selectedAgent !== null} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAgent?.name} - Agent Logs
            </DialogTitle>
            <DialogDescription>
              View task history, API calls, and performance metrics
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Today's Tasks</p>
                  <p className="text-2xl font-bold">42</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">API Calls</p>
                  <p className="text-2xl font-bold">128</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </CardContent>
              </Card>
            </div>

            {/* Log entries would go here */}
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lead qualification completed</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago • API: GoHighLevel</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rate limit warning</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago • API: OpenAI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}