import { UserRoundCheck, Users, TrendingUp, Headphones, FileText, Calendar } from "lucide-react";

interface SolBrainProps {
  size?: "sm" | "md" | "lg";
  showAgentNodes?: boolean;
  animated?: boolean;
}

export function SolBrain({ size = "md", showAgentNodes = false, animated = true }: SolBrainProps) {
  const sizeClasses = {
    sm: "w-48 h-48",
    md: "w-64 h-64",
    lg: "w-80 h-80"
  };

  const agentNodes = showAgentNodes ? [
    { icon: Users, color: "bg-purple-500", position: { top: "4", left: "1/2" } },
    { icon: TrendingUp, color: "bg-orange-500", position: { top: "1/4", right: "4" } },
    { icon: UserRoundCheck, color: "bg-blue-500", position: { bottom: "1/4", right: "4" } },
    { icon: Headphones, color: "bg-green-500", position: { bottom: "4", left: "1/2" } },
    { icon: FileText, color: "bg-red-500", position: { bottom: "1/4", left: "4" } },
    { icon: Calendar, color: "bg-yellow-500", position: { top: "1/4", left: "4" } },
  ] : [];

  const connectionDots = [0, 1, 2, 3, 4, 5].map((i) => ({
    style: {
      top: `${50 + 40 * Math.cos(i * Math.PI / 3)}%`,
      left: `${50 + 40 * Math.sin(i * Math.PI / 3)}%`,
      transform: 'translate(-50%, -50%)'
    }
  }));

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Outer orbital rings */}
      <div className={`absolute inset-0 rounded-full border-2 border-harmony-teal opacity-20 ${animated ? 'sol-brain' : ''}`}></div>
      <div className={`absolute inset-8 rounded-full border border-harmony-teal opacity-30 ${animated ? 'sol-brain' : ''}`}></div>
      <div className={`absolute inset-16 rounded-full border border-harmony-gold opacity-40 ${animated ? 'sol-brain' : ''}`}></div>
      
      {/* Central SŌL core */}
      <div className="absolute inset-24 rounded-full bg-gradient-to-br from-harmony-teal to-harmony-gold flex items-center justify-center">
        <div className="text-4xl font-bold text-harmony-dark">SŌL</div>
      </div>
      
      {/* Connection dots around the brain */}
      {connectionDots.map((dot, index) => (
        <div
          key={index}
          className="absolute w-3 h-3 bg-harmony-gold rounded-full"
          style={dot.style}
        />
      ))}

      {/* Agent nodes (if enabled) */}
      {showAgentNodes && agentNodes.map((node, index) => {
        const IconComponent = node.icon;
        return (
          <div
            key={index}
            className={`absolute w-8 h-8 ${node.color} rounded-full flex items-center justify-center connection-dots`}
            style={{
              top: node.position.top ? `${node.position.top}px` : 'auto',
              right: node.position.right ? `${node.position.right}px` : 'auto',
              bottom: node.position.bottom ? `${node.position.bottom}px` : 'auto',
              left: node.position.left === '1/2' ? '50%' : node.position.left ? `${node.position.left}px` : 'auto',
              transform: node.position.left === '1/2' ? 'translateX(-50%)' : 'none'
            }}
          >
            <IconComponent className="text-white" size={12} />
          </div>
        );
      })}
    </div>
  );
}
