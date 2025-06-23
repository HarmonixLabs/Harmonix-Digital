import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SacredCardProps {
  children: React.ReactNode;
  variant?: "default" | "agent" | "premium";
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function SacredCard({ 
  children, 
  variant = "default", 
  className,
  hover = true,
  glow = false 
}: SacredCardProps) {
  const baseClasses = `
    relative overflow-hidden
    backdrop-filter backdrop-blur-xl
    transition-all duration-500 ease-out
  `;

  const variantClasses = {
    default: `
      border border-opacity-25 shadow-lg
    `,
    agent: `
      border-2 border-opacity-30 shadow-xl
      before:absolute before:inset-0 
      before:opacity-0 before:transition-opacity before:duration-500
    `,
    premium: `
      border-2 border-opacity-50 shadow-2xl
    `
  };

  const cardStyle = {
    background: variant === 'agent' 
      ? 'linear-gradient(135deg, rgba(47, 78, 70, 0.2) 0%, rgba(11, 15, 14, 0.95) 50%, rgba(17, 31, 26, 0.98) 100%)'
      : variant === 'premium'
      ? 'linear-gradient(135deg, rgba(215, 183, 109, 0.12) 0%, rgba(11, 15, 14, 0.95) 50%, rgba(47, 78, 70, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(11, 15, 14, 0.98) 0%, rgba(47, 78, 70, 0.08) 50%, rgba(17, 31, 26, 0.98) 100%)',
    borderColor: '#d7b76d',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    boxShadow: variant === 'agent' || variant === 'premium'
      ? '0 8px 32px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(215, 183, 109, 0.2)'
      : '0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(215, 183, 109, 0.15)'
  };

  const hoverClasses = hover ? `
    hover:scale-105 
    hover:border-warm-gold/60 
    hover:shadow-2xl hover:shadow-warm-gold/30
    hover:before:opacity-100
  ` : "";

  const glowClasses = glow ? "animate-pulse shadow-lg shadow-warm-gold/40" : "";

  return (
    <Card
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        glowClasses,
        className
      )}
      style={cardStyle}
    >
      {/* Sacred Geometry Accent */}
      <div className="absolute top-4 right-4 w-6 h-6 opacity-30">
        <div className="w-full h-full border rounded-full" style={{ borderColor: '#d7b76d' }}>
          <div className="absolute inset-1 border rounded-full" style={{ borderColor: '#d7b76d' }}>
            <div className="absolute inset-1 rounded-full opacity-40" style={{ background: '#d7b76d' }} />
          </div>
        </div>
      </div>
      
      {children}
    </Card>
  );
}