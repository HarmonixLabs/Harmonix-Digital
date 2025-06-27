import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  animation?: "pulse" | "scale" | "shimmer" | "glow" | "ripple";
  intensity?: "subtle" | "medium" | "strong";
}

export function AnimatedButton({ 
  className, 
  animation = "scale", 
  intensity = "medium",
  children,
  ...props 
}: AnimatedButtonProps) {
  const animationClasses = {
    pulse: {
      subtle: "hover:animate-pulse",
      medium: "hover:animate-pulse animate-pulse",
      strong: "animate-pulse hover:animate-ping"
    },
    scale: {
      subtle: "hover:scale-[1.02] transition-transform duration-200",
      medium: "hover:scale-105 transition-transform duration-300",
      strong: "hover:scale-110 transition-transform duration-300 active:scale-95"
    },
    shimmer: {
      subtle: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:animate-[shimmer_1.5s_ease-in-out] before:transition-transform",
      medium: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-harmonix-gold/30 before:to-transparent hover:before:animate-[shimmer_1s_ease-in-out_infinite] before:transition-transform",
      strong: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-harmonix-gold/50 before:to-transparent before:animate-[shimmer_2s_ease-in-out_infinite] before:transition-transform"
    },
    glow: {
      subtle: "hover:shadow-lg hover:shadow-harmonix-gold/20 transition-shadow duration-300",
      medium: "hover:shadow-xl hover:shadow-harmonix-gold/30 transition-shadow duration-300",
      strong: "hover:shadow-2xl hover:shadow-harmonix-gold/40 animate-[glow_2s_ease-in-out_infinite_alternate] transition-shadow duration-300"
    },
    ripple: {
      subtle: "relative overflow-hidden active:after:absolute active:after:inset-0 active:after:rounded-[inherit] active:after:bg-white/10 active:after:animate-[ripple_0.6s_ease-out]",
      medium: "relative overflow-hidden active:after:absolute active:after:inset-0 active:after:rounded-[inherit] active:after:bg-white/20 active:after:animate-[ripple_0.8s_ease-out]",
      strong: "relative overflow-hidden active:after:absolute active:after:inset-0 active:after:rounded-[inherit] active:after:bg-harmonix-gold/30 active:after:animate-[ripple_1s_ease-out]"
    }
  };

  return (
    <Button
      className={cn(
        animationClasses[animation][intensity],
        "transform-gpu", // Use GPU acceleration
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}