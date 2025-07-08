import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Zap, Brain, DollarSign, Users, MessageSquare, Workflow, Clock } from 'lucide-react';

interface Agent {
    id: string;
    name: string;
    title: string;
    description: string;
    icon: React.ComponentType;
    color: string;
    capabilities: string[];
    demoSuggestions: string[];
}

const HARMONY_AGENTS: Agent[] = [
  {
        id: 'sol',
        name: 'SŌL',
        title: 'Harmony Brain Orchestrator',
        description: 'The conductor of your AI ecosystem. SŌL orchestrates all agents and provides intelligent coordination.',
        icon: Brain,
        color: 'from-indigo-500 to-purple-600',
        capabilities: ['Agent Orchestration', '24/7 Monitoring', 'Workflow Coordination', 'Real-time Insights'],
        demoSuggestions: [
                'Show me agent status dashboard',
                'Orchestrate a multi-agent workflow',
                'Generate system health report',
                'Coordinate agent deployment'
              ]
  },
  {
        id: 'cash',
        name: 'CASH',
        title: 'AI Sales Closer',
        description: 'Professional sales expert that qualifies leads, handles objections, and closes deals with precision.',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-600',
        capabilities: ['Lead Qualification', 'Objection Handling', 'Deal Closing', 'Sales Analytics'],
        demoSuggestions: [
                'Qualify this lead for me',
                'Create a sales proposal',
                'Handle price objections',
                'Generate follow-up sequence'
              ]
  },
  {
        id: 'concierge',
        name: 'Concierge',
        title: 'Client Success Assistant',
        description: 'Warm, helpful executive assistant that manages client relationships and onboarding processes.',
        icon: Users,
        color: 'from-blue-500 to-cyan-600',
        capabilities: ['Client Onboarding', 'Relationship Management', 'Support Coordination', 'Success Tracking'],
        demoSuggestions: [
                'Create client onboarding plan',
                'Schedule follow-up meetings',
                'Generate success metrics',
                'Handle support requests'
              ]
  },
  {
        id: 'echo',
        name: 'Echo',
        title: 'Social Media Storycaster',
        description: 'Creative, engaging storyteller that crafts compelling content and manages social media presence.',
        icon: MessageSquare,
        color: 'from-pink-500 to-rose-600',
        capabilities: ['Content Creation', 'Social Media Management', 'Brand Storytelling', 'Engagement Analytics'],
        demoSuggestions: [
                'Create 30-day content calendar',
                'Write viral social posts',
                'Generate brand story',
                'Analyze engagement metrics'
              ]
  },
  {
        id: 'flow',
        name: 'Flow',
        title: 'Process Optimization Specialist',
        description: 'Analytical optimizer that streamlines workflows, eliminates bottlenecks, and maximizes efficiency.',
        icon: Workflow,
        color: 'from-orange-500 to-amber-600',
        capabilities: ['Process Analysis', 'Workflow Optimization', 'Efficiency Metrics', 'Automation Design'],
        demoSuggestions: [
                'Analyze current workflows',
                'Optimize team processes',
                'Create automation blueprint',
                'Generate efficiency report'
              ]
  },
  {
        id: 'kairos',
        name: 'Kairos',
        title: 'Time & Project Manager',
        description: 'Organized, deadline-focused manager that coordinates projects, manages timelines, and ensures delivery.',
        icon: Clock,
        color: 'from-violet-500 to-purple-600',
        capabilities: ['Project Planning', 'Timeline Management', 'Resource Allocation', 'Deadline Tracking'],
        demoSuggestions: [
                'Create project timeline',
                'Allocate team resources',
                'Track milestone progress',
                'Generate status reports'
              ]
  }
  ];

interface AgentDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    agentId?: string;
}

export const AgentDemoModal: React.FC<AgentDemoModalProps> = ({ isOpen, onClose, agentId }) =>
}
        ]
  }
        ]
  }
        ]
  }
        ]
  }
        ]
  }
        ]
  }
]
}