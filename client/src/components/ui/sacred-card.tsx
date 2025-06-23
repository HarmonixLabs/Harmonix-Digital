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
      ? 'linear-gradient(135deg, rgba(30, 104, 102, 0.15) 0%, rgba(15, 17, 21, 0.95) 50%, rgba(15, 17, 21, 0.98) 100%)'
      : variant === 'premium'
      ? 'linear-gradient(135deg, rgba(209, 191, 167, 0.08) 0%, rgba(15, 17, 21, 0.95) 50%, rgba(30, 104, 102, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(15, 17, 21, 0.98) 0%, rgba(30, 104, 102, 0.05) 50%, rgba(15, 17, 21, 0.98) 100%)',
    borderColor: '#D1BFA7',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    boxShadow: variant === 'agent' || variant === 'premium'
      ? '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(209, 191, 167, 0.15)'
      : '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(209, 191, 167, 0.1)'
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
    >
      {/* Sacred Geometry Accent */}
      <div className="absolute top-4 right-4 w-6 h-6 opacity-20">
        <div className="w-full h-full border border-warm-gold rounded-full">
          <div className="absolute inset-1 border border-warm-gold rounded-full">
            <div className="absolute inset-1 bg-warm-gold rounded-full opacity-30" />
          </div>
        </div>
      </div>
      
      {children}
    </Card>
  );
}