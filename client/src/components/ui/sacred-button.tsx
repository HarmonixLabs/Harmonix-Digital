import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SacredButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function SacredButton({ 
  variant = "primary", 
  size = "md", 
  children, 
  className,
  glow = false,
  ...props 
}: SacredButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300 font-medium";
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-warm-gold to-warm-gold/90 
      text-deep-space-black 
      border border-warm-gold/50
      hover:shadow-lg hover:shadow-warm-gold/30
      hover:-translate-y-1
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:-translate-x-full before:transition-transform before:duration-500
      hover:before:translate-x-full
    `,
    secondary: `
      bg-transparent 
      text-warm-gold 
      border-2 border-warm-gold/50
      hover:bg-warm-gold/10 
      hover:border-warm-gold
      hover:-translate-y-1
      hover:shadow-md hover:shadow-warm-gold/20
    `,
    ghost: `
      bg-transparent 
      text-warm-gold/80 
      hover:text-warm-gold
      hover:bg-warm-gold/5
    `
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl", 
    lg: "px-8 py-4 text-lg rounded-xl"
  };

  const glowClasses = glow ? "animate-pulse shadow-lg shadow-warm-gold/40" : "";

  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}