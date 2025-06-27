import { cn } from "@/lib/utils";
import { Sparkles, Zap, Brain, Loader2 } from "lucide-react";

interface WhimsicalLoaderProps {
  variant?: "pulse" | "orbit" | "sacred" | "neural" | "harmony" | "minimal";
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  className?: string;
}

export function WhimsicalLoader({ 
  variant = "sacred", 
  size = "md", 
  message,
  className 
}: WhimsicalLoaderProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20", 
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Pulsing Core */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-jade-forest to-harmonix-gold animate-pulse opacity-60" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-harmonix-gold to-jade-forest animate-pulse delay-150" />
          <div className="absolute inset-4 rounded-full bg-deep-space-black border border-jade-forest/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-harmonix-gold animate-spin" />
          </div>
        </div>
        {message && (
          <p className={cn("text-jade-forest/80 animate-pulse", textSizes[size])}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === "orbit") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Central Hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-jade-forest to-harmonix-gold animate-pulse" />
          </div>
          
          {/* Orbiting Elements */}
          <div className="absolute inset-0 animate-spin">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-harmonix-gold" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-jade-forest" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDelay: '1s' }}>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-jade-forest/60" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDelay: '1.5s', animationDirection: 'reverse' }}>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-harmonix-gold/60" />
          </div>
        </div>
        {message && (
          <p className={cn("text-jade-forest/80", textSizes[size])}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === "neural") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Neural Network Visualization */}
          <div className="absolute inset-0">
            {/* Nodes */}
            <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-jade-forest animate-pulse" />
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-harmonix-gold animate-pulse delay-100" />
            <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-jade-forest/60 animate-pulse delay-200" />
            <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-harmonix-gold/60 animate-pulse delay-300" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-jade-forest to-harmonix-gold animate-pulse delay-150" />
            
            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full">
              <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="url(#gradient1)" strokeWidth="1" className="animate-pulse" />
              <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="url(#gradient1)" strokeWidth="1" className="animate-pulse" />
              <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="url(#gradient1)" strokeWidth="1" className="animate-pulse" />
              <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="url(#gradient1)" strokeWidth="1" className="animate-pulse" />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1D6B4A" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Central Brain Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-6 h-6 text-harmonix-gold animate-pulse" />
          </div>
        </div>
        {message && (
          <p className={cn("text-jade-forest/80", textSizes[size])}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === "harmony") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Harmonic Waves */}
          <div className="absolute inset-0">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-jade-forest/30 animate-ping"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
          
          {/* Central Harmony Symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Zap className="w-8 h-8 text-harmonix-gold animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-jade-forest animate-bounce" />
              </div>
            </div>
          </div>
        </div>
        {message && (
          <p className={cn("text-jade-forest/80 text-center", textSizes[size])}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <Loader2 className={cn("text-jade-forest animate-spin", 
          size === "sm" ? "w-6 h-6" : 
          size === "md" ? "w-8 h-8" :
          size === "lg" ? "w-12 h-12" : "w-16 h-16"
        )} />
        {message && (
          <p className={cn("text-jade-forest/80", textSizes[size])}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default: Sacred Geometry
  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Sacred Geometry Background */}
        <div className="absolute inset-0">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-jade-forest/40 animate-spin" style={{ animationDuration: '8s' }} />
          
          {/* Middle Ring */}
          <div className="absolute inset-2 rounded-full border border-harmonix-gold/60 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          
          {/* Inner Sacred Symbol */}
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="relative">
              {/* Sacred Lotus Pattern */}
              <div className="w-8 h-8 relative">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-6 bg-gradient-to-t from-jade-forest to-harmonix-gold rounded-full opacity-70 animate-pulse"
                    style={{
                      transform: `rotate(${i * 60}deg)`,
                      transformOrigin: 'center bottom',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Central Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-harmonix-gold animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Energy Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-jade-forest/60 rounded-full animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>
      
      {message && (
        <p className={cn("text-jade-forest/80 text-center font-light", textSizes[size])}>
          {message}
        </p>
      )}
    </div>
  );
}