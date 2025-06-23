import React from "react";

interface HarmonixLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark" | "gold" | "white" | "black";
  showText?: boolean;
  className?: string;
}

export function HarmonixLogo({ size = "md", variant = "gold", showText = false, className = "" }: HarmonixLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-3xl"
  };

  const getColor = () => {
    switch (variant) {
      case "light":
      case "gold":
        return "#D1BFA7"; // Royal Metallic Gold from your brand guidelines
      case "dark":
        return "#014321"; // Deep Forest Emerald Green from your brand guidelines
      case "white":
        return "#FFFFFF";
      case "black":
        return "#000000";
      default:
        return "#D1BFA7";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "light":
      case "gold":
        return "text-[#D1BFA7]"; // Royal Metallic Gold
      case "dark":
        return "text-[#014321]"; // Deep Forest Emerald Green
      case "white":
        return "text-white";
      case "black":
        return "text-black";
      default:
        return "text-[#D1BFA7]";
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Authentic Harmonix Logo - Circular H Design */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none"
        >
          {/* Outer circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="47" 
            stroke={getColor()} 
            strokeWidth="4"
            fill="none"
          />
          
          {/* Inner H structure - based on your authentic logo design */}
          <g fill={getColor()}>
            {/* Main vertical line on the left */}
            <rect x="30" y="25" width="4" height="50" />
            
            {/* Horizontal crossbar connecting to the H */}
            <rect x="34" y="47" width="22" height="4" />
            
            {/* Vertical line creating the right side of H */}
            <rect x="56" y="25" width="4" height="22" />
            <rect x="56" y="51" width="4" height="24" />
            
            {/* Additional geometric elements that form the distinctive H */}
            <rect x="60" y="35" width="10" height="4" />
            <rect x="66" y="35" width="4" height="15" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold tracking-wider ${getTextColor()}`} style={{ fontFamily: 'Playfair Display, serif' }}>
          HARMONIX
        </span>
      )}
    </div>
  );
}