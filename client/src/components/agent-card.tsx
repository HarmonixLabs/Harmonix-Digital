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
    <Card className="card-hover border-gray-800 relative overflow-hidden">
      {agent.tier === 'flagship' && (
        <div className="absolute top-2 right-2 bg-harmony-gold text-harmony-dark text-xs px-2 py-1 rounded font-bold z-10">
          FLAGSHIP
        </div>
      )}
      {agent.tier === 'next-wave' && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded font-bold z-10">
          NEXT-WAVE
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${agent.gradient} rounded-xl flex items-center justify-center text-white text-2xl relative`}>
            {typeof IconComponent === 'string' ? (
              <span>{IconComponent}</span>
            ) : (
              <IconComponent size={32} />
            )}
            {agent.name?.includes('CA$H') && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-harmony-gold rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
          {agent.name?.includes('CA$H') && (
            <div className="text-xs text-harmony-gold font-mono mb-2">Agent #001 • Always Closing</div>
          )}
          <p className="text-sm text-gray-400 mb-3">
            {agent.description}
          </p>
          <div className="text-sm text-harmony-gold font-semibold">
            {agent.performance} Performance
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4 justify-center">
          <Badge variant="secondary" className="text-xs">
            {agent.category}
          </Badge>
          {agent.royalty && (
            <Badge variant="outline" className="text-xs border-harmony-gold text-harmony-gold">
              {agent.royalty} royalty
            </Badge>
          )}
        </div>
        
        {!agent.available ? (
          <Button 
            className="w-full bg-gray-600 text-gray-400 cursor-not-allowed" 
            disabled
          >
            🔒 Coming Soon
          </Button>
        ) : (
          <div className="space-y-2">
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
              ) : agent.name?.includes('CA$H') ? (
                "Deploy CA$H"
              ) : (
                "Deploy Agent"
              )}
            </Button>
            {agent.name?.includes('CA$H') && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-harmony-gold text-harmony-gold hover:bg-harmony-gold hover:text-harmony-dark"
                onClick={() => window.location.href = '/agents/cash'}
              >
                Manage CA$H
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
