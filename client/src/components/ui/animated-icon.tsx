import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  animation?: "float" | "breathe" | "pulse" | "spin" | "bounce" | "wiggle";
  trigger?: "hover" | "always" | "focus";
  className?: string;
  size?: number;
}

export function AnimatedIcon({ 
  icon: Icon, 
  animation = "float", 
  trigger = "hover",
  className,
  size = 24,
  ...props 
}: AnimatedIconProps) {
  const animationClasses = {
    float: "animate-float",
    breathe: "animate-breathe", 
    pulse: "animate-pulse",
    spin: "animate-spin",
    bounce: "animate-bounce",
    wiggle: "hover:animate-[wiggle_0.5s_ease-in-out]"
  };

  const triggerClasses = {
    hover: `hover:${animationClasses[animation]}`,
    always: animationClasses[animation],
    focus: `focus:${animationClasses[animation]}`
  };

  return (
    <Icon
      size={size}
      className={cn(
        "transform-gpu transition-all duration-300",
        trigger === "always" ? animationClasses[animation] : triggerClasses[trigger],
        className
      )}
      {...props}
    />
  );
}