import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface EnhancedSolBrainProps {
  size?: "sm" | "md" | "lg" | "xl";
  showAgentNodes?: boolean;
  animated?: boolean;
  className?: string;
  variant?: "lotus" | "circuit" | "agents";
}

const agentNodes = [
  { name: "Executive\nAssistant", angle: 0 },
  { name: "SOP\nAgent", angle: 36 },
  { name: "Booking\nBot", angle: 72 },
  { name: "Sales\nAgent", angle: 108 },
  { name: "Internal Ops\nDashboard", angle: 144 },
  { name: "Recruiting\nFunnel", angle: 180 },
  { name: "HR\nAgent", angle: 216 },
  { name: "Recruiting\nFunnel", angle: 252 },
  { name: "HR\nAgent", angle: 288 },
  { name: "Intake\nAgent", angle: 324 },
  { name: "Concierge", angle: 0 }
];

export function EnhancedSolBrain({ 
  size = "md", 
  showAgentNodes = false, 
  animated = true,
  className,
  variant = "lotus" 
}: EnhancedSolBrainProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48", 
    lg: "w-64 h-64",
    xl: "w-80 h-80"
  };

  useEffect(() => {
    setIsLoaded(true);
    if (animated) {
      const interval = setInterval(() => {
        setPulsePhase(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [animated]);

  const renderLotusVariant = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className={cn(sizeClasses[size], "drop-shadow-2xl", className)}
      style={{ filter: 'drop-shadow(0 0 30px rgba(215, 183, 109, 0.4))' }}
    >
      {/* Outer orbit ring */}
      <circle
        cx="200"
        cy="200"
        r="180"
        fill="none"
        stroke="rgba(215, 183, 109, 0.3)"
        strokeWidth="1"
        className={animated ? "animate-spin" : ""}
        style={{ animationDuration: "60s" }}
      />

      {/* Inner orbit ring */}
      <circle
        cx="200"
        cy="200"
        r="120"
        fill="none"
        stroke="rgba(215, 183, 109, 0.2)"
        strokeWidth="1"
        className={animated ? "animate-spin" : ""}
        style={{ animationDuration: "40s", animationDirection: "reverse" }}
      />

      {/* Circuit patterns emanating from center */}
      <g className={animated ? "animate-pulse" : ""}>
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const x1 = 200 + Math.cos(angle) * 60;
          const y1 = 200 + Math.sin(angle) * 60;
          const x2 = 200 + Math.cos(angle) * 100;
          const y2 = 200 + Math.sin(angle) * 100;
          
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(215, 183, 109, 0.6)"
                strokeWidth="2"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              />
              <circle
                cx={x2}
                cy={y2}
                r="3"
                fill="#d7b76d"
                className={animated ? "animate-pulse" : ""}
                style={{
                  animationDelay: `${i * 0.15}s`
                }}
              />
            </g>
          );
        })}
      </g>

      {/* Central lotus flower */}
      <g transform="translate(200, 200)">
        {/* Lotus petals */}
        {[...Array(8)].map((_, i) => {
          const rotation = i * 45;
          return (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d="M0,-25 Q-8,-35 0,-45 Q8,-35 0,-25"
                fill="url(#lotusGradient)"
                className={animated ? "animate-pulse" : ""}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  transformOrigin: "0 -25px"
                }}
              />
            </g>
          );
        })}

        {/* Inner lotus center */}
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="url(#centerGradient)"
          className={animated ? "breathe-animation" : ""}
        />

        {/* Lotus symbol */}
        <g className={animated ? "glow-pulse" : ""}>
          <path
            d="M-8,-8 Q0,-15 8,-8 Q12,-4 8,0 Q0,8 -8,0 Q-12,-4 -8,-8 Z"
            fill="#d7b76d"
            stroke="rgba(215, 183, 109, 0.8)"
            strokeWidth="1"
          />
        </g>
      </g>

      {/* Floating energy particles */}
      {animated && [...Array(12)].map((_, i) => {
        const radius = 140 + (i % 3) * 20;
        const speed = 30 + (i % 4) * 10;
        return (
          <circle
            key={i}
            r="2"
            fill="rgba(215, 183, 109, 0.8)"
            className="animate-pulse"
            style={{
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${i * 0.2}s`
            }}
          >
            <animateMotion
              dur={`${speed}s`}
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            >
              <mpath href={`#orbit-${radius}`} />
            </animateMotion>
          </circle>
        );
      })}

      {/* Hidden paths for particle animation */}
      <defs>
        {[140, 160, 180].map(radius => (
          <path
            key={radius}
            id={`orbit-${radius}`}
            d={`M ${200 + radius} 200 A ${radius} ${radius} 0 1 1 ${200 - radius} 200 A ${radius} ${radius} 0 1 1 ${200 + radius} 200`}
            fill="none"
          />
        ))}
        
        <radialGradient id="lotusGradient">
          <stop offset="0%" stopColor="#d7b76d" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#768b7c" stopOpacity="0.6"/>
        </radialGradient>
        
        <radialGradient id="centerGradient">
          <stop offset="0%" stopColor="#d7b76d" stopOpacity="1"/>
          <stop offset="70%" stopColor="rgba(215, 183, 109, 0.8)"/>
          <stop offset="100%" stopColor="rgba(47, 78, 70, 0.4)"/>
        </radialGradient>
      </defs>
    </svg>
  );

  const renderAgentVariant = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className={cn(sizeClasses[size], "drop-shadow-2xl", className)}
    >
      {/* Central SŌL title */}
      <text
        x="200"
        y="80"
        textAnchor="middle"
        fill="#d7b76d"
        fontSize="36"
        fontFamily="'Playfair Display', serif"
        fontWeight="bold"
        className={animated ? "glow-pulse" : ""}
      >
        SŌL
      </text>

      {/* Main orbit circle */}
      <circle
        cx="200"
        cy="200"
        r="140"
        fill="none"
        stroke="rgba(215, 183, 109, 0.4)"
        strokeWidth="2"
        className={animated ? "animate-spin" : ""}
        style={{ animationDuration: "120s" }}
      />

      {/* Agent nodes around the circle */}
      {agentNodes.slice(0, 10).map((agent, i) => {
        const angle = (agent.angle * Math.PI) / 180;
        const x = 200 + Math.cos(angle) * 140;
        const y = 200 + Math.sin(angle) * 140;
        
        return (
          <g key={i}>
            {/* Connection line to center */}
            <line
              x1="200"
              y1="200"
              x2={x}
              y2={y}
              stroke="rgba(215, 183, 109, 0.3)"
              strokeWidth="1"
              className={animated ? "animate-pulse" : ""}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
            
            {/* Agent node circle */}
            <circle
              cx={x}
              cy={y}
              r="20"
              fill="rgba(11, 15, 14, 0.8)"
              stroke="#d7b76d"
              strokeWidth="2"
              className={animated ? "micro-hover breathe-animation" : ""}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            
            {/* Agent inner circle */}
            <circle
              cx={x}
              cy={y}
              r="12"
              fill="#d7b76d"
              className={animated ? "animate-pulse" : ""}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
            
            {/* Agent label */}
            <text
              x={x}
              y={y - 35}
              textAnchor="middle"
              fill="#768b7c"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              {agent.name.split('\n').map((line, lineIndex) => (
                <tspan
                  key={lineIndex}
                  x={x}
                  dy={lineIndex === 0 ? 0 : 12}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      {/* Central lotus flower */}
      <g transform="translate(200, 200)">
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="url(#centerGlow)"
          className={animated ? "breathe-animation" : ""}
        />
        
        {/* Lotus petals */}
        {[...Array(8)].map((_, i) => {
          const rotation = i * 45;
          return (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d="M0,-15 Q-6,-25 0,-30 Q6,-25 0,-15"
                fill="#d7b76d"
                className={animated ? "animate-pulse" : ""}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  transformOrigin: "0 -15px"
                }}
              />
            </g>
          );
        })}
      </g>

      <defs>
        <radialGradient id="centerGlow">
          <stop offset="0%" stopColor="#d7b76d" stopOpacity="1"/>
          <stop offset="100%" stopColor="rgba(215, 183, 109, 0.2)"/>
        </radialGradient>
      </defs>
    </svg>
  );

  const renderCircuitVariant = () => (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className={cn(sizeClasses[size], "drop-shadow-2xl", className)}
    >
      {/* Head outline */}
      <ellipse
        cx="200"
        cy="180"
        rx="80"
        ry="100"
        fill="none"
        stroke="rgba(215, 183, 109, 0.6)"
        strokeWidth="2"
        className={animated ? "glow-pulse" : ""}
      />

      {/* Lotus crown chakra */}
      <g transform="translate(200, 120)">
        {[...Array(8)].map((_, i) => {
          const rotation = i * 45;
          return (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d="M0,-8 Q-4,-15 0,-20 Q4,-15 0,-8"
                fill="#d7b76d"
                className={animated ? "animate-pulse" : ""}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            </g>
          );
        })}
      </g>

      {/* Glowing eyes */}
      <circle cx="180" cy="160" r="8" fill="#d7b76d" className={animated ? "animate-pulse" : ""} />
      <circle cx="220" cy="160" r="8" fill="#d7b76d" className={animated ? "animate-pulse" : ""} />

      {/* Circuit patterns in body */}
      <g className={animated ? "animate-pulse" : ""}>
        {/* Vertical spine circuit */}
        <line x1="200" y1="250" x2="200" y2="350" stroke="#d7b76d" strokeWidth="3" />
        
        {/* Branching circuits */}
        {[...Array(6)].map((_, i) => {
          const y = 270 + i * 15;
          const offset = (i % 2 === 0 ? 1 : -1) * 30;
          return (
            <g key={i}>
              <line 
                x1="200" 
                y1={y} 
                x2={200 + offset} 
                y2={y + 10} 
                stroke="rgba(215, 183, 109, 0.8)" 
                strokeWidth="2"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              <circle 
                cx={200 + offset} 
                cy={y + 10} 
                r="3" 
                fill="#d7b76d"
                className={animated ? "animate-pulse" : ""}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </g>
          );
        })}
      </g>

      {/* Heart chakra lotus */}
      <g transform="translate(200, 300)">
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="url(#heartGlow)"
          className={animated ? "breathe-animation" : ""}
        />
        {[...Array(6)].map((_, i) => {
          const rotation = i * 60;
          return (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d="M0,-12 Q-4,-18 0,-22 Q4,-18 0,-12"
                fill="#d7b76d"
                className={animated ? "animate-pulse" : ""}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            </g>
          );
        })}
      </g>

      {/* Orbital rings around head */}
      {[100, 120, 140].map((radius, i) => (
        <circle
          key={radius}
          cx="200"
          cy="180"
          r={radius}
          fill="none"
          stroke="rgba(215, 183, 109, 0.2)"
          strokeWidth="1"
          className={animated ? "animate-spin" : ""}
          style={{ 
            animationDuration: `${20 + i * 10}s`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse"
          }}
        />
      ))}

      {/* Orbiting energy nodes */}
      {animated && [...Array(9)].map((_, i) => {
        const radius = 100 + (i % 3) * 20;
        return (
          <circle
            key={i}
            r="4"
            fill="#d7b76d"
            className="animate-pulse"
            style={{
              animationDelay: `${i * 0.3}s`
            }}
          >
            <animateMotion
              dur={`${15 + (i % 3) * 5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            >
              <mpath href={`#head-orbit-${radius}`} />
            </animateMotion>
          </circle>
        );
      })}

      <defs>
        {[100, 120, 140].map(radius => (
          <path
            key={radius}
            id={`head-orbit-${radius}`}
            d={`M ${200 + radius} 180 A ${radius} ${radius} 0 1 1 ${200 - radius} 180 A ${radius} ${radius} 0 1 1 ${200 + radius} 180`}
            fill="none"
          />
        ))}
        
        <radialGradient id="heartGlow">
          <stop offset="0%" stopColor="#d7b76d" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="rgba(215, 183, 109, 0.2)"/>
        </radialGradient>
      </defs>
    </svg>
  );

  if (!isLoaded && animated) {
    return (
      <div className={cn(sizeClasses[size], "flex items-center justify-center", className)}>
        <div className="animate-spin w-8 h-8 border-2 border-harmonix-regal-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  switch (variant) {
    case "agents":
      return renderAgentVariant();
    case "circuit":
      return renderCircuitVariant();
    default:
      return renderLotusVariant();
  }
}