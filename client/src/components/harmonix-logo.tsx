interface HarmonixLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
}

export function HarmonixLogo({ size = "md", variant = "light", showText = false }: HarmonixLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Harmonix Logo - Golden Circle with H */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="harmonixGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          
          {/* Outer Circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="url(#harmonixGold)" 
            strokeWidth="4"
            opacity="0.9"
          />
          
          {/* Letter H with geometric design */}
          <g fill="url(#harmonixGold)" opacity="0.95">
            {/* Left vertical line */}
            <rect x="25" y="25" width="6" height="50" />
            
            {/* Right vertical line */}
            <rect x="69" y="25" width="6" height="50" />
            
            {/* Horizontal crossbar */}
            <rect x="31" y="47" width="38" height="6" />
            
            {/* Golden ratio inspired smaller elements */}
            <rect x="45" y="60" width="10" height="15" />
            <rect x="58" y="67" width="6" height="8" opacity="0.7" />
          </g>
        </svg>
      </div>

      {/* Company Name */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold ${variant === 'light' ? 'text-harmony-gold' : 'text-white'}`}>
            HARMONIX
          </span>
          <span className={`text-xs ${variant === 'light' ? 'text-teal-600' : 'text-teal-300'} font-medium tracking-wide`}>
            AI AUTOMATION PLATFORM
          </span>
        </div>
      )}
    </div>
  );
}