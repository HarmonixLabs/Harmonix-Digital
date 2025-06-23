interface SolBrainProps {
  size?: "sm" | "md" | "lg";
  showAgentNodes?: boolean;
  animated?: boolean;
}

export function SolBrain({ size = "md", showAgentNodes = false, animated = true }: SolBrainProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64"
  };

  // Agent orchestration nodes (based on the SŌL diagram)
  const agentNodes = [
    { name: "Executive Assistant", angle: 0 },
    { name: "SOP Agent", angle: 36 },
    { name: "Booking", angle: 72 },
    { name: "Sales Agent", angle: 108 },
    { name: "Internal Ops", angle: 144 },
    { name: "Recruiting", angle: 180 },
    { name: "HR Agent", angle: 216 },
    { name: "Recruiting Funnel", angle: 252 },
    { name: "Intake Agent", angle: 288 },
    { name: "Concierge", angle: 324 }
  ];

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* SŌL Brain Core - Spiritual Tech Design */}
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden border border-harmony-gold/30`}>
        
        {/* Lotus Symbol in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Lotus Petals using SVG */}
            <div className={`${size === "lg" ? "w-16 h-16" : size === "md" ? "w-12 h-12" : "w-8 h-8"} relative`}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#F7DC6F" />
                  </linearGradient>
                </defs>
                
                {/* Lotus Flower */}
                <g fill="url(#lotusGrad)" opacity="0.9">
                  {/* Outer petals */}
                  <path d="M50,25 Q60,40 50,55 Q40,40 50,25 Z" />
                  <path d="M65,30 Q75,45 65,60 Q55,45 65,30 Z" />
                  <path d="M70,50 Q80,65 70,80 Q60,65 70,50 Z" />
                  <path d="M65,70 Q75,85 65,100 Q55,85 65,70 Z" />
                  <path d="M50,75 Q60,90 50,105 Q40,90 50,75 Z" />
                  <path d="M35,70 Q45,85 35,100 Q25,85 35,70 Z" />
                  <path d="M30,50 Q40,65 30,80 Q20,65 30,50 Z" />
                  <path d="M35,30 Q45,45 35,60 Q25,45 35,30 Z" />
                  
                  {/* Inner petals */}
                  <path d="M50,40 Q55,50 50,60 Q45,50 50,40 Z" />
                  <path d="M58,47 Q63,57 58,67 Q53,57 58,47 Z" />
                  <path d="M58,53 Q63,63 58,73 Q53,63 58,53 Z" />
                  <path d="M50,60 Q55,70 50,80 Q45,70 50,60 Z" />
                  <path d="M42,53 Q47,63 42,73 Q37,63 42,53 Z" />
                  <path d="M42,47 Q47,57 42,67 Q37,57 42,47 Z" />
                </g>
              </svg>
            </div>
            
            {/* Glowing Eyes */}
            <div className={`absolute ${size === "lg" ? "-top-8" : size === "md" ? "-top-6" : "-top-4"} left-1/2 transform -translate-x-1/2 flex space-x-2`}>
              <div className={`${size === "lg" ? "w-3 h-3" : size === "md" ? "w-2 h-2" : "w-1 h-1"} bg-harmony-gold rounded-full animate-pulse`}></div>
              <div className={`${size === "lg" ? "w-3 h-3" : size === "md" ? "w-2 h-2" : "w-1 h-1"} bg-harmony-gold rounded-full animate-pulse`} style={{ animationDelay: "0.5s" }}></div>
            </div>
          </div>
        </div>

        {/* Circuit Patterns */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F7DC6F" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Radiating Circuit Lines */}
            <g stroke="url(#circuitGrad)" strokeWidth="0.5" fill="none">
              <line x1="50" y1="10" x2="50" y2="25" />
              <line x1="71" y1="15" x2="63" y2="30" />
              <line x1="85" y1="50" x2="70" y2="50" />
              <line x1="71" y1="85" x2="63" y2="70" />
              <line x1="50" y1="90" x2="50" y2="75" />
              <line x1="29" y1="85" x2="37" y2="70" />
              <line x1="15" y1="50" x2="30" y2="50" />
              <line x1="29" y1="15" x2="37" y2="30" />
            </g>
            
            {/* Connection Nodes */}
            <g fill="#D4AF37" opacity="0.6">
              <circle cx="50" cy="10" r="1.5" />
              <circle cx="71" cy="15" r="1.5" />
              <circle cx="85" cy="50" r="1.5" />
              <circle cx="71" cy="85" r="1.5" />
              <circle cx="50" cy="90" r="1.5" />
              <circle cx="29" cy="85" r="1.5" />
              <circle cx="15" cy="50" r="1.5" />
              <circle cx="29" cy="15" r="1.5" />
            </g>
          </svg>
        </div>
        
        {/* Pulsing Spiritual Glow */}
        {animated && (
          <>
            <div className="absolute inset-0 rounded-full bg-harmony-gold/10 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-harmony-gold/20 animate-pulse" style={{ animationDelay: "1s" }}></div>
          </>
        )}
      </div>

      {/* Agent Orchestration Ring (if enabled) */}
      {showAgentNodes && (
        <div className="absolute inset-0">
          {agentNodes.map((agent, index) => {
            const radius = size === "lg" ? 140 : size === "md" ? 110 : 80;
            const centerX = size === "lg" ? 128 : size === "md" ? 96 : 64;
            const centerY = size === "lg" ? 128 : size === "md" ? 96 : 64;
            const x = centerX + radius * Math.cos((agent.angle * Math.PI) / 180);
            const y = centerY + radius * Math.sin((agent.angle * Math.PI) / 180);
            
            return (
              <div
                key={index}
                className="absolute w-4 h-4 bg-harmony-gold rounded-full border border-teal-900 animate-pulse"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.2}s`
                }}
                title={agent.name}
              />
            );
          })}
          
          {/* Connection lines to center */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0F766E" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {agentNodes.map((agent, index) => {
              const radius = size === "lg" ? 140 : size === "md" ? 110 : 80;
              const centerX = size === "lg" ? 128 : size === "md" ? 96 : 64;
              const centerY = size === "lg" ? 128 : size === "md" ? 96 : 64;
              const x = centerX + radius * Math.cos((agent.angle * Math.PI) / 180);
              const y = centerY + radius * Math.sin((agent.angle * Math.PI) / 180);
              
              return (
                <line
                  key={index}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="url(#connectionGrad)"
                  strokeWidth="1"
                  opacity="0.4"
                />
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
