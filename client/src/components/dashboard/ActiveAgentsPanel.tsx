import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { 
  Activity, 
  Zap, 
  DollarSign, 
  MessageCircle, 
  GitBranch, 
  Users, 
  Calendar,
  Brain,
  RefreshCw,
  Settings
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'cash' | 'echo' | 'flow' | 'grace' | 'kairos' | 'sol';
  status: 'active' | 'idle' | 'offline' | 'error';
  performance: number;
  tasksToday: number;
  lastActive: string;
  enabled: boolean;
}

const agentIcons = {
  cash: DollarSign,
  echo: MessageCircle,
  flow: GitBranch,
  grace: Users,
  kairos: Calendar,
  sol: Brain
};

export function ActiveAgentsPanel() {
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Fetch agent statuses
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/pipedream/agents/status'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Toggle agent mutation
  const toggleAgentMutation = useMutation({
    mutationFn: async ({ agentId, enabled }: { agentId: string; enabled: boolean }) => {
      return apiRequest('/api/pipedream/agents/toggle', {
        method: 'POST',
        body: JSON.stringify({ agentId, enabled })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pipedream/agents/status'] });
    }
  });

  // Refresh agent status
  const refreshAgentMutation = useMutation({
    mutationFn: async (agentId: string) => {
      return apiRequest('/api/pipedream/agents/refresh', {
        method: 'POST',
        body: JSON.stringify({ agentId })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pipedream/agents/status'] });
    }
  });

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'idle': return 'Idle';
      case 'offline': return 'Offline';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-harmonix-regal-gold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Active Agents
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/pipedream/agents/status'] })}
          className="text-harmonix-sage-fade hover:text-harmonix-regal-gold"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-harmonix-night-pine/30 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          agents.map((agent: Agent) => {
            const Icon = agentIcons[agent.type] || Zap;
            return (
              <div
                key={agent.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedAgent === agent.id
                    ? 'border-harmonix-regal-gold bg-harmonix-night-pine/70'
                    : 'border-harmonix-sage-fade/20 bg-harmonix-night-pine/30 hover:bg-harmonix-night-pine/50'
                }`}
                onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-harmonix-night-pine/50`}>
                      <Icon className="h-5 w-5 text-harmonix-regal-gold" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{agent.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                        <span className="text-xs text-harmonix-sage-fade">
                          {getStatusText(agent.status)}
                        </span>
                        <span className="text-xs text-harmonix-sage-fade">
                          • {agent.tasksToday} tasks today
                        </span>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={agent.enabled}
                    onCheckedChange={(checked) => {
                      toggleAgentMutation.mutate({ agentId: agent.id, enabled: checked });
                    }}
                    className="data-[state=checked]:bg-harmonix-regal-gold"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-harmonix-sage-fade">Performance</span>
                    <span className="text-harmonix-regal-gold">{agent.performance}%</span>
                  </div>
                  <Progress 
                    value={agent.performance} 
                    className="h-1.5 bg-harmonix-night-pine/50"
                  />
                </div>

                {selectedAgent === agent.id && (
                  <div className="mt-3 pt-3 border-t border-harmonix-sage-fade/20 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        refreshAgentMutation.mutate(agent.id);
                      }}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to agent settings
                      }}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}