import React from "react";
import { cn } from "@/lib/utils";

// Floating Action Component
export function FloatingElement({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <div 
      className={cn("animate-float", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Breathing Glow Effect
export function BreathingGlow({ 
  children, 
  className,
  intensity = "medium" 
}: { 
  children: React.ReactNode; 
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}) {
  const glowClasses = {
    subtle: "animate-breathe hover:shadow-lg hover:shadow-harmonix-gold/10",
    medium: "animate-breathe hover:shadow-xl hover:shadow-harmonix-gold/20",
    strong: "animate-breathe hover:shadow-2xl hover:shadow-harmonix-gold/30"
  };

  return (
    <div className={cn(glowClasses[intensity], className)}>
      {children}
    </div>
  );
}

// Stagger Item for Individual Elements
export function StaggerItem({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <div 
      className={cn("animate-fadeInUp", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Staggered Container for Lists (alias for compatibility)
export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 100 
}: { 
  children: React.ReactNode; 
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {React.Children.map(children, (child, index) => (
        <StaggerItem delay={index * staggerDelay}>
          {child}
        </StaggerItem>
      ))}
    </div>
  );
}

// Staggered Container for Lists
export function StaggeredContainer({ 
  children, 
  className,
  staggerDelay = 100 
}: { 
  children: React.ReactNode; 
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {React.Children.map(children, (child, index) => (
        <div 
          className="animate-fadeInUp"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Magnetic Hover Effect
export function MagneticHover({ 
  children, 
  className,
  strength = "medium" 
}: { 
  children: React.ReactNode; 
  className?: string;
  strength?: "subtle" | "medium" | "strong";
}) {
  const strengthClasses = {
    subtle: "hover:transform hover:scale-[1.02] transition-transform duration-200",
    medium: "hover:transform hover:scale-105 transition-transform duration-300",
    strong: "hover:transform hover:scale-110 transition-transform duration-300"
  };

  return (
    <div className={cn(strengthClasses[strength], className)}>
      {children}
    </div>
  );
}

// Ripple Effect for Click Interactions
export function RippleEffect({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        "active:after:absolute active:after:inset-0 active:after:rounded-[inherit]",
        "active:after:bg-harmonix-gold/20 active:after:animate-ripple",
        className
      )}
    >
      {children}
    </div>
  );
}

// FadeIn Component (was missing - causing import error)
export function FadeIn({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <div 
      className={cn("animate-fadeInUp", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Text Animation Component
export function AnimatedText({ 
  text, 
  className,
  animation = "typewriter",
  delay = 0 
}: { 
  text: string; 
  className?: string;
  animation?: "typewriter" | "fadeIn" | "slideUp";
  delay?: number;
}) {
  const animationClasses = {
    typewriter: "animate-[typewriter_3s_steps(40,end)] overflow-hidden whitespace-nowrap",
    fadeIn: "animate-fadeInUp",
    slideUp: "animate-slideInRight"
  };

  return (
    <span 
      className={cn(animationClasses[animation], className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {text}
    </span>
  );
}

// Loading Shimmer Component
export function LoadingShimmer({ 
  className,
  width = "100%",
  height = "20px" 
}: { 
  className?: string;
  width?: string;
  height?: string;
}) {
  return (
    <div 
      className={cn(
        "bg-gradient-to-r from-harmonix-cedar via-harmonix-sage to-harmonix-cedar",
        "animate-shimmer bg-[length:200%_100%]",
        "rounded-md",
        className
      )}
      style={{ width, height }}
    />
  );
}

// Hover Scale Animation
export function HoverScale({ 
  children, 
  className,
  scale = 1.05,
  duration = 300 
}: { 
  children: React.ReactNode; 
  className?: string;
  scale?: number;
  duration?: number;
}) {
  return (
    <div 
      className={cn("transition-transform cursor-pointer", className)}
      style={{
        transitionDuration: `${duration}ms`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
}

// Parallax Scroll Element
export function ParallaxElement({ 
  children, 
  className,
  speed = 0.5 
}: { 
  children: React.ReactNode; 
  className?: string;
  speed?: number;
}) {
  return (
    <div 
      className={cn("transform-gpu", className)}
      style={{
        transform: `translateY(calc(var(--scroll-y, 0px) * ${speed}))`
      }}
    >
      {children}
    </div>
  );
}