import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  hoverEffect?: "lift" | "glow" | "tilt" | "scale" | "border-glow";
  entranceAnimation?: "fadeInUp" | "slideInRight" | "none";
  delay?: number;
}

export function AnimatedCard({ 
  className, 
  hoverEffect = "lift", 
  entranceAnimation = "fadeInUp",
  delay = 0,
  children,
  ...props 
}: AnimatedCardProps) {
  const hoverClasses = {
    lift: "hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300",
    glow: "hover:shadow-2xl hover:shadow-harmonix-gold/20 hover:border-harmonix-gold/50 transition-all duration-300",
    tilt: "hover:transform hover:rotate-1 hover:scale-105 transition-all duration-300",
    scale: "hover:scale-105 transition-transform duration-300",
    "border-glow": "relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px] before:bg-gradient-to-r before:from-harmonix-gold/0 before:via-harmonix-gold/50 before:to-harmonix-gold/0 hover:before:via-harmonix-gold/80 before:transition-all before:duration-500 before:-z-10"
  };

  const entranceClasses = {
    fadeInUp: "animate-fadeInUp",
    slideInRight: "animate-slideInRight", 
    none: ""
  };

  return (
    <Card
      className={cn(
        "transform-gpu", // GPU acceleration
        hoverClasses[hoverEffect],
        entranceAnimation !== "none" && entranceClasses[entranceAnimation],
        className
      )}
      style={{ 
        animationDelay: delay ? `${delay}ms` : undefined 
      }}
      {...props}
    >
      {children}
    </Card>
  );
}