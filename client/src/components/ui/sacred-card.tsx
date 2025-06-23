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
      bg-gradient-to-br from-deep-space-black/95 to-circuit-teal/10
      border border-warm-gold/20
      shadow-lg shadow-black/20
    `,
    agent: `
      bg-gradient-to-br from-circuit-teal/20 via-deep-space-black/90 to-deep-space-black/95
      border-2 border-warm-gold/30
      shadow-xl shadow-circuit-teal/10
      before:absolute before:inset-0 
      before:bg-gradient-to-br before:from-warm-gold/5 before:to-transparent
      before:opacity-0 before:transition-opacity before:duration-500
    `,
    premium: `
      bg-gradient-to-br from-warm-gold/10 via-deep-space-black/90 to-circuit-teal/20
      border-2 border-warm-gold/50
      shadow-2xl shadow-warm-gold/20
    `
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