import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AgentNode {
  id: string;
  name: string;
  angle: number;
  description: string;
  tier: 'I' | 'II' | 'III';
}

const agentNodes: AgentNode[] = [
  { id: 'executive', name: 'Executive\nAssistant', angle: 0, description: 'Strategic task management', tier: 'I' },
  { id: 'sop', name: 'SOP\nAgent', angle: 36, description: 'Process optimization', tier: 'II' },
  { id: 'booking', name: 'Booking\nBot', angle: 72, description: 'Automated scheduling', tier: 'I' },
  { id: 'sales', name: 'Sales\nAgent', angle: 108, description: 'Revenue generation', tier: 'I' },
  { id: 'ops', name: 'Internal Ops\nDashboard', angle: 144, description: 'Operations oversight', tier: 'II' },
  { id: 'recruiting', name: 'Recruiting\nFunnel', angle: 180, description: 'Talent acquisition', tier: 'II' },
  { id: 'hr-agent', name: 'HR\nAgent', angle: 216, description: 'Human resources', tier: 'I' },
  { id: 'recruiting-funnel', name: 'Recruiting\nFunnel', angle: 252, description: 'Candidate pipeline', tier: 'II' },
  { id: 'hr', name: 'HR\nAgent', angle: 288, description: 'Employee management', tier: 'I' },
  { id: 'intake', name: 'Intake\nAgent', angle: 324, description: 'Lead qualification', tier: 'I' },
  { id: 'concierge', name: 'Concierge', angle: 360, description: 'Customer experience', tier: 'I' },
];

const SolBrainNetwork: React.FC = () => {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const centerRadius = 120;
  const nodeRadius = 180;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Central SŌL Title */}
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-6xl font-playfair text-golden-primary font-light tracking-wide">
          Sōl
        </h1>
      </motion.div>

      {/* Main Network Container */}
      <div className="relative aspect-square w-full max-w-lg mx-auto">
        
        {/* Central Lotus Hub */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Lotus Symbol */}
            <div className="w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <g fill="#D4AF37">
                  {/* Lotus petals */}
                  <path d="M24 8 L28 16 L24 24 L20 16 Z" opacity="0.9" />
                  <path d="M32 12 L36 20 L28 28 L24 20 Z" opacity="0.8" />
                  <path d="M36 20 L40 28 L32 36 L28 28 Z" opacity="0.7" />
                  <path d="M36 28 L40 36 L32 44 L28 36 Z" opacity="0.6" />
                  <path d="M28 32 L32 40 L24 48 L20 40 Z" opacity="0.7" />
                  <path d="M20 32 L16 40 L24 48 L28 40 Z" opacity="0.7" />
                  <path d="M12 28 L8 36 L16 44 L20 36 Z" opacity="0.6" />
                  <path d="M12 20 L8 28 L16 36 L20 28 Z" opacity="0.7" />
                  <path d="M16 12 L12 20 L20 28 L24 20 Z" opacity="0.8" />
                </g>
              </svg>
            </div>
            
            {/* Breathing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-golden-primary opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Agent Nodes */}
        {agentNodes.map((agent, index) => {
          const x = Math.cos((agent.angle * Math.PI) / 180) * nodeRadius;
          const y = Math.sin((agent.angle * Math.PI) / 180) * nodeRadius;
          
          return (
            <motion.div
              key={agent.id}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.8 + index * 0.1, 
                duration: 0.6,
                ease: "easeOut" 
              }}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              {/* Connection Line to Center */}
              <motion.div
                className="absolute w-px bg-golden-primary opacity-40"
                style={{
                  height: `${nodeRadius - 32}px`,
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'top center',
                  transform: `translate(-50%, -100%) rotate(${agent.angle + 180}deg)`,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isActive ? 1 : 0 }}
                transition={{ delay: 1 + index * 0.05, duration: 0.8 }}
              />

              {/* Agent Node */}
              <motion.div
                className={`
                  relative w-12 h-12 rounded-full border-2 border-golden-primary
                  bg-deep-navy cursor-pointer transition-all duration-300
                  ${hoveredAgent === agent.id ? 'bg-golden-primary shadow-lg shadow-golden-primary/50' : ''}
                `}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Inner dot */}
                <div className={`
                  absolute inset-2 rounded-full transition-colors duration-300
                  ${hoveredAgent === agent.id ? 'bg-deep-navy' : 'bg-golden-primary'}
                `} />
                
                {/* Pulse effect */}
                {hoveredAgent === agent.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-golden-primary"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.div>

              {/* Agent Label */}
              <motion.div
                className={`
                  absolute mt-3 text-center transition-all duration-300 pointer-events-none
                  ${hoveredAgent === agent.id ? 'opacity-100 scale-105' : 'opacity-80'}
                `}
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  minWidth: '80px',
                }}
              >
                <p className="text-sm text-golden-primary font-medium leading-tight whitespace-pre-line">
                  {agent.name}
                </p>
                
                {/* Description on hover */}
                {hoveredAgent === agent.id && (
                  <motion.p
                    className="text-xs text-golden-light mt-1 opacity-90"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {agent.description}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Orbital rings */}
        <motion.div
          className="absolute inset-0"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div 
            className="absolute rounded-full border border-golden-primary/20"
            style={{
              width: `${nodeRadius * 2 + 48}px`,
              height: `${nodeRadius * 2 + 48}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      </div>

      {/* Network Status Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center space-x-2 px-4 py-2 bg-deep-navy/80 rounded-full border border-golden-primary/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-golden-light">
            {agentNodes.length} Agents Connected
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default SolBrainNetwork;