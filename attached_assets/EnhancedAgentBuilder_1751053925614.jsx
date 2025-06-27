import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Play, Settings, Zap, Brain, MessageSquare, Database } from 'lucide-react';

// Custom Node Types
const AgentNode = ({ data, selected }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative bg-gradient-to-br from-indigo-900/90 to-indigo-800/90 
        border-2 rounded-xl p-4 min-w-[200px] backdrop-blur-sm
        ${selected ? 'border-gold-400 shadow-lg shadow-gold-400/20' : 'border-jade-400/30'}
        hover:border-jade-400/60 transition-all duration-300
      `}
    >
      {/* Agent Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
          {data.icon || <Brain className="w-5 h-5 text-indigo-900" />}
        </div>
        <div>
          <h3 className="font-semibold text-cloud-white text-sm">{data.label}</h3>
          <p className="text-xs text-jade-300">{data.type}</p>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-xs">
          <span className="text-jade-300">Reliability:</span>
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < (data.stats?.reliability || 3) ? 'bg-gold-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-xs">
          <span className="text-jade-300">Speed:</span>
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < (data.stats?.speed || 3) ? 'bg-gold-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-jade-400 rounded-full border-2 border-indigo-900 transform -translate-y-1/2" />
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-gold-400 rounded-full border-2 border-indigo-900 transform -translate-y-1/2" />
    </motion.div>
  );
};

const TriggerNode = ({ data, selected }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative bg-gradient-to-br from-teal-900/90 to-teal-800/90 
        border-2 rounded-lg p-3 min-w-[150px] backdrop-blur-sm
        ${selected ? 'border-gold-400 shadow-lg shadow-gold-400/20' : 'border-teal-400/30'}
        hover:border-teal-400/60 transition-all duration-300
      `}
    >
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-teal-300" />
        <span className="text-sm font-medium text-cloud-white">{data.label}</span>
      </div>
      <div className="absolute -right-2 top-1/2 w-3 h-3 bg-teal-400 rounded-full border border-teal-900 transform -translate-y-1/2" />
    </motion.div>
  );
};

const nodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
};

// Enhanced Agent Builder Component
const EnhancedAgentBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [threadContext, setThreadContext] = useState({
    history: [],
    variables: {},
    metadata: {}
  });

  // Initial nodes setup
  useEffect(() => {
    const initialNodes = [
      {
        id: 'sol-1',
        type: 'agent',
        position: { x: 400, y: 100 },
        data: {
          label: 'SŌL Orchestrator',
          type: 'Central AI Conductor',
          icon: <Brain className="w-5 h-5 text-indigo-900" />,
          stats: { reliability: 5, speed: 4 }
        }
      },
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: { label: 'Email Received' }
      },
      {
        id: 'grace-1',
        type: 'agent',
        position: { x: 400, y: 300 },
        data: {
          label: 'Grace Concierge',
          type: 'Customer Support',
          icon: <MessageSquare className="w-5 h-5 text-indigo-900" />,
          stats: { reliability: 4, speed: 5 }
        }
      }
    ];

    const initialEdges = [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'sol-1',
        type: 'smoothstep',
        style: { stroke: '#4ECDC4', strokeWidth: 2 },
        animated: true
      },
      {
        id: 'e2-3',
        source: 'sol-1',
        target: 'grace-1',
        type: 'smoothstep',
        style: { stroke: '#D4AF37', strokeWidth: 2 },
        animated: true
      }
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  // Handle new connections
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        style: { stroke: '#4ECDC4', strokeWidth: 2 },
        animated: true
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Thread Inheritance System
  const saveThreadContext = useCallback(() => {
    const context = {
      nodes: nodes,
      edges: edges,
      timestamp: new Date().toISOString(),
      variables: threadContext.variables,
      history: threadContext.history
    };
    
    localStorage.setItem('harmonix_thread_context', JSON.stringify(context));
    console.log('Thread context saved:', context);
  }, [nodes, edges, threadContext]);

  const loadThreadContext = useCallback(() => {
    const saved = localStorage.getItem('harmonix_thread_context');
    if (saved) {
      const context = JSON.parse(saved);
      setNodes(context.nodes || []);
      setEdges(context.edges || []);
      setThreadContext({
        history: context.history || [],
        variables: context.variables || {},
        metadata: context.metadata || {}
      });
      console.log('Thread context loaded:', context);
    }
  }, [setNodes, setEdges]);

  // Agent Library
  const agentLibrary = [
    {
      id: 'sol',
      name: 'SŌL Orchestrator',
      type: 'Central AI Conductor',
      icon: <Brain className="w-5 h-5" />,
      color: 'from-gold-400 to-gold-600'
    },
    {
      id: 'grace',
      name: 'Grace Concierge',
      type: 'Customer Support',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'from-jade-400 to-jade-600'
    },
    {
      id: 'cashflow',
      name: 'Cashflow Agent',
      type: 'Finance Management',
      icon: <Database className="w-5 h-5" />,
      color: 'from-emerald-400 to-emerald-600'
    }
  ];

  // Add agent to canvas
  const addAgent = (agent) => {
    const newNode = {
      id: `${agent.id}-${Date.now()}`,
      type: 'agent',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 200 },
      data: {
        label: agent.name,
        type: agent.type,
        icon: agent.icon,
        stats: { reliability: 4, speed: 4 }
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Simulate agent execution
  const playWorkflow = () => {
    setIsPlaying(true);
    // Simulate execution flow
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-space-black via-indigo-900 to-space-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-space-black/80 backdrop-blur-sm border-b border-jade-400/20 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cloud-white">Agent Builder</h1>
          <div className="flex gap-3">
            <button
              onClick={saveThreadContext}
              className="flex items-center gap-2 px-4 py-2 bg-jade-600 hover:bg-jade-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Context
            </button>
            <button
              onClick={loadThreadContext}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Load Context
            </button>
            <button
              onClick={playWorkflow}
              disabled={isPlaying}
              className="flex items-center gap-2 px-4 py-2 bg-gold-600 hover:bg-gold-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              {isPlaying ? 'Running...' : 'Test Flow'}
            </button>
          </div>
        </div>
      </div>

      {/* Agent Library Sidebar */}
      <div className="absolute left-0 top-16 bottom-0 w-64 bg-space-black/90 backdrop-blur-sm border-r border-jade-400/20 p-4 z-10">
        <h3 className="text-lg font-semibold text-cloud-white mb-4">Agent Library</h3>
        <div className="space-y-3">
          {agentLibrary.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addAgent(agent)}
              className="p-3 bg-gradient-to-r from-indigo-800/50 to-indigo-700/50 rounded-lg border border-jade-400/20 cursor-pointer hover:border-jade-400/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                  {agent.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-cloud-white">{agent.name}</p>
                  <p className="text-xs text-jade-300">{agent.type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="ml-64 mt-16 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-transparent"
        >
          <Background color="#4ECDC4" gap={20} size={1} />
          <Controls className="bg-space-black/80 border border-jade-400/20" />
          <MiniMap
            className="bg-space-black/80 border border-jade-400/20"
            nodeColor="#4ECDC4"
            maskColor="rgba(15, 17, 21, 0.8)"
          />
          
          {/* Thread Context Panel */}
          <Panel position="top-right" className="bg-space-black/90 backdrop-blur-sm border border-jade-400/20 rounded-lg p-4 max-w-xs">
            <h4 className="text-sm font-semibold text-cloud-white mb-2">Thread Context</h4>
            <div className="text-xs text-jade-300 space-y-1">
              <p>Nodes: {nodes.length}</p>
              <p>Connections: {edges.length}</p>
              <p>Variables: {Object.keys(threadContext.variables).length}</p>
              <p>History: {threadContext.history.length} entries</p>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Execution Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-space-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-gradient-to-br from-gold-400/20 to-jade-400/20 border border-gold-400/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xl font-semibold text-cloud-white">Executing Workflow...</p>
              <p className="text-jade-300 mt-2">Processing agent interactions</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedAgentBuilder;

