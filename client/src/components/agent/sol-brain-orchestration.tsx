import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flower, Zap, Brain, Users, Settings, Activity } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'processing';
  position: { x: number; y: number };
  avatar: string;
  description: string;
}

interface SolBrainOrchestrationProps {
  agents?: Agent[];
  isActive?: boolean;
}

export function SolBrainOrchestration({ 
  agents = [], 
  isActive = true 
}: SolBrainOrchestrationProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Default agent configuration matching the mockup
  const defaultAgents: Agent[] = [
    {
      id: 'sales-1',
      name: 'Sales Agent',
      type: 'SALES',
      status: 'active',
      position: { x: -200, y: -100 },
      avatar: '👨‍💼',
      description: 'Lead generation and conversion'
    },
    {
      id: 'sales-2', 
      name: 'Sales Agent',
      type: 'SALES',
      status: 'active',
      position: { x: 0, y: -150 },
      avatar: '👨‍💼',
      description: 'Deal closing and follow-up'
    },
    {
      id: 'concierge',
      name: 'Concierge Agent',
      type: 'CONCIERGE',
      status: 'active',
      position: { x: 200, y: -100 },
      avatar: '👩‍💼',
      description: 'Customer experience management'
    },
    {
      id: 'social',
      name: 'Social Agent',
      type: 'SOCIAL',
      status: 'active',
      position: { x: 250, y: 50 },
      avatar: '👨‍💻',
      description: 'Social media automation'
    },
    {
      id: 'hr',
      name: 'HR Agent',
      type: 'HR',
      status: 'active',
      position: { x: 150, y: 150 },
      avatar: '👩‍💼',
      description: 'Human resources management'
    },
    {
      id: 'designer',
      name: 'Designer Agent',
      type: 'DESIGNER',
      status: 'active',
      position: { x: -150, y: 150 },
      avatar: '🎨',
      description: 'Creative design automation'
    },
    {
      id: 'analyst',
      name: 'Analyst Agent',
      type: 'ANALYST',
      status: 'active',
      position: { x: -250, y: 50 },
      avatar: '📊',
      description: 'Data analysis and insights'
    },
    {
      id: 'ops',
      name: 'Ops Agent',
      type: 'OPS',
      status: 'processing',
      position: { x: 0, y: 200 },
      avatar: '🤖',
      description: 'Operations automation'
    }
  ];

  const displayAgents = agents.length > 0 ? agents : defaultAgents;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setPulseAnimation(prev => !prev);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'processing': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'SALES': 'bg-emerald-600',
      'CONCIERGE': 'bg-blue-600', 
      'SOCIAL': 'bg-purple-600',
      'HR': 'bg-pink-600',
      'DESIGNER': 'bg-orange-600',
      'ANALYST': 'bg-cyan-600',
      'OPS': 'bg-slate-600'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-600';
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 overflow-hidden">
      {/* Circuit Board Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10 L90 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="50" cy="50" r="3" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" className="text-emerald-400"/>
        </svg>
      </div>

      {/* Central SŌL Brain */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`relative transition-all duration-2000 ${pulseAnimation ? 'scale-110' : 'scale-100'}`}>
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400 opacity-30 blur-xl scale-150 animate-pulse"></div>
          
          {/* Brain Core */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-amber-400 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl">
            <Brain className="w-12 h-12 text-slate-900" />
            {/* Neural Network Pattern */}
            <div className="absolute inset-2 rounded-full border-2 border-slate-900/30">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-900/50 rounded-full"></div>
              <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-slate-900/50 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-slate-900/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Nodes */}
      {displayAgents.map((agent) => (
        <div
          key={agent.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
          style={{
            left: `calc(50% + ${agent.position.x}px)`,
            top: `calc(50% + ${agent.position.y}px)`,
          }}
        >
          {/* Connection Line to Center */}
          <svg
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: Math.abs(agent.position.x) + 100,
              height: Math.abs(agent.position.y) + 100,
              transform: `translate(-50%, -50%) rotate(${Math.atan2(agent.position.y, agent.position.x) * 180 / Math.PI}deg)`
            }}
          >
            <line
              x1="0"
              y1="50%"
              x2="80%"
              y2="50%"
              stroke="url(#gradient)"
              strokeWidth="2"
              className="animate-pulse opacity-60"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
          </svg>

          {/* Agent Card */}
          <Card className="bg-slate-800/90 border-2 border-emerald-400/30 backdrop-blur-sm hover:border-emerald-400/60 transition-all duration-300 group cursor-pointer">
            <div className="p-4 text-center relative">
              {/* Status Indicator */}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></div>
              
              {/* Agent Type Badge */}
              <Badge className={`absolute top-2 left-2 text-xs ${getTypeColor(agent.type)} text-white`}>
                {agent.type}
              </Badge>
              
              {/* Active Mode Label */}
              {agent.status === 'active' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white text-xs animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    ACTIVE MODE
                  </Badge>
                </div>
              )}

              {/* Agent Avatar */}
              <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {agent.avatar}
              </div>

              {/* Agent Info */}
              <h3 className="text-emerald-100 font-semibold text-sm">{agent.name}</h3>
              <p className="text-slate-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {agent.description}
              </p>

              {/* Activity Indicator */}
              {agent.status === 'processing' && (
                <div className="mt-2 flex items-center justify-center text-amber-400">
                  <Activity className="w-4 h-4 animate-spin mr-1" />
                  <span className="text-xs">Processing</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      ))}

      {/* Control Panel */}
      <div className="absolute top-6 right-6">
        <Card className="bg-slate-800/90 border border-emerald-400/30 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flower className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-100 font-semibold">SŌL Brain</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Active Agents:</span>
                <span className="text-emerald-400 font-mono">
                  {displayAgents.filter(a => a.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Processing:</span>
                <span className="text-amber-400 font-mono">
                  {displayAgents.filter(a => a.status === 'processing').length}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>System Status:</span>
                <Badge className="bg-emerald-500 text-white text-xs">Optimal</Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700">
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Settings className="w-4 h-4 mr-2" />
                Configure Network
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Network Statistics */}
      <div className="absolute bottom-6 left-6">
        <Card className="bg-slate-800/90 border border-emerald-400/30 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-100 font-semibold">Network Stats</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">98.7%</div>
                <div className="text-slate-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">2.4ms</div>
                <div className="text-slate-400">Latency</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}