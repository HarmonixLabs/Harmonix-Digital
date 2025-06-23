import React from "react";
import { cn } from "@/lib/utils";

interface SacredLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SacredLoader({ size = "md", className }: SacredLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Outer Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-warm-gold animate-spin" />
      
      {/* Middle Ring */}
      <div className="absolute inset-2 rounded-full border border-transparent border-r-circuit-teal animate-spin" 
           style={{ animationDirection: "reverse", animationDuration: "2s" }} />
      
      {/* Inner Lotus Core */}
      <div className="w-3 h-3 rounded-full bg-warm-gold opacity-80 animate-pulse" />
      
      {/* Sacred Geometry Lines */}
      <div className="absolute inset-0">
        {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-gradient-to-t from-transparent to-warm-gold opacity-40"
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>
    </div>
  );
}