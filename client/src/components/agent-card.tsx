import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon | string;
  category: string;
  performance: string;
  royalty: string;
  gradient: string;
  available: boolean;
}

interface AgentCardProps {
  agent: Agent;
  onDeploy?: (agentId: number) => void;
  onPurchase?: (agentId: number) => void;
  isDeploying?: boolean;
}

export function AgentCard({ agent, onDeploy, onPurchase, isDeploying }: AgentCardProps) {
  const IconComponent = agent.icon;

  return (
    <Card className="card-hover border-gray-800 relative">
      <CardContent className="p-6">
        <div className="absolute top-4 right-4 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
          {agent.performance} • {agent.royalty}
        </div>
        
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${agent.gradient} rounded-xl flex items-center justify-center text-white text-2xl`}>
            {typeof IconComponent === 'string' ? (
              <span>{IconComponent}</span>
            ) : (
              <IconComponent size={32} />
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-center">{agent.name}</h3>
        <p className="text-sm text-gray-400 mb-4 text-center">
          {agent.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4 justify-center">
          <Badge variant="secondary" className="text-xs">
            {agent.category}
          </Badge>
        </div>
        
        {!agent.available ? (
          <Button 
            className="w-full bg-gray-600 text-gray-400 cursor-not-allowed" 
            disabled
          >
            🔒 Unlock Required
          </Button>
        ) : (
          <Button
            className="w-full bg-harmony-gold hover:bg-yellow-500 text-harmony-dark font-semibold"
            onClick={() => onDeploy ? onDeploy(agent.id) : onPurchase?.(agent.id)}
            disabled={isDeploying}
          >
            {isDeploying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-harmony-dark border-t-transparent rounded-full animate-spin" />
                Deploying...
              </div>
            ) : onDeploy ? (
              "Deploy"
            ) : (
              "Purchase"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
