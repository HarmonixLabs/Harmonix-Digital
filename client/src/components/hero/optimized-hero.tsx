import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedSolBrain } from "@/components/sol/enhanced-sol-brain";
import { ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react";

interface OptimizedHeroProps {
  className?: string;
}

export function OptimizedHero({ className }: OptimizedHeroProps) {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sloganWords, setSloganWords] = useState<string[]>([]);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const words = "Intelligent Systems for Timeless Sovereignty".split(" ");
      words.forEach((word, index) => {
        setTimeout(() => {
          setSloganWords(prev => [...prev, word]);
        }, index * 80); // Faster animation for better engagement
      });

      // Show CTA after slogan completes
      setTimeout(() => {
        setShowCTA(true);
      }, words.length * 80 + 500);
    }
  }, [isLoaded]);

  return (
    <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-deep-space-black">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-jade-blue/20 via-transparent to-harmonix-gold/10" />
        
        {/* Starfall animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-8 bg-gradient-to-b from-harmonix-gold to-transparent starfall-animation"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Constellation web */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="webGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4A90E2" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Constellation connecting lines */}
            <g stroke="url(#webGradient)" strokeWidth="1" fill="none">
              <path d="M200,200 Q400,100 600,200 T1000,200" />
              <path d="M100,400 Q300,300 500,400 T900,400" />
              <path d="M300,600 Q500,500 700,600 T1100,600" />
              <path d="M200,200 L300,600" />
              <path d="M600,200 L700,600" />
              <path d="M1000,200 L900,400" />
            </g>
            {/* Constellation nodes */}
            <g fill="#d7b76d" opacity="0.6">
              <circle cx="200" cy="200" r="3" className="animate-pulse" />
              <circle cx="600" cy="200" r="3" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
              <circle cx="1000" cy="200" r="3" className="animate-pulse" style={{ animationDelay: "1s" }} />
              <circle cx="100" cy="400" r="3" className="animate-pulse" style={{ animationDelay: "1.5s" }} />
              <circle cx="500" cy="400" r="3" className="animate-pulse" style={{ animationDelay: "2s" }} />
              <circle cx="900" cy="400" r="3" className="animate-pulse" style={{ animationDelay: "2.5s" }} />
              <circle cx="300" cy="600" r="3" className="animate-pulse" style={{ animationDelay: "3s" }} />
              <circle cx="700" cy="600" r="3" className="animate-pulse" style={{ animationDelay: "3.5s" }} />
            </g>
          </svg>
        </div>

        {/* Sacred geometry grid */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(215, 183, 109, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(215, 183, 109, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 sm:space-y-12">
          
          {/* Early Bird Badge */}
          <div 
            className={cn(
              "transition-all duration-1000 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Badge 
              variant="secondary" 
              className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30 px-4 py-2 text-sm sm:text-base font-medium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Limited Time: 30% Off Early Access
            </Badge>
          </div>

          {/* Main Slogan */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="font-bold leading-tight tracking-tight">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif">
                {sloganWords.map((word, index) => (
                  <span
                    key={index}
                    className={cn(
                      "inline-block mr-3 sm:mr-4 transition-all duration-700 ease-out",
                      index < sloganWords.length ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                    )}
                    style={{
                      color: word === "Timeless" || word === "Sovereignty" ? "#d7b76d" : "#768b7c",
                      textShadow: word === "Timeless" || word === "Sovereignty" 
                        ? "0 0 30px rgba(215, 183, 109, 0.6)" 
                        : "0 0 20px rgba(118, 139, 124, 0.3)",
                      animationDelay: `${index * 0.08}s`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </h1>
            
            {/* Supporting headline */}
            <p 
              className={cn(
                "text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-5xl mx-auto leading-relaxed font-light transition-all duration-1000 ease-out delay-700",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                color: 'rgba(118, 139, 124, 0.95)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Build your business like a sacred machine. <br className="hidden sm:block" />
              <span className="text-harmonix-regal-gold font-medium">Powered by AI. Designed for freedom.</span>
            </p>
          </div>

          {/* Call to Action */}
          <div 
            className={cn(
              "flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-1000 ease-out delay-1000",
              showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <Button
              size="lg"
              onClick={() => setLocation('/marketplace')}
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-harmonix-regal-gold/25"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Activate Your Agents
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation('/demo-scenarios')}
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-medium border-2 border-harmonix-regal-gold/50 text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10 hover:border-harmonix-regal-gold transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              See Live Demo
            </Button>
          </div>

          {/* SŌL Brain Visualization */}
          <div 
            className={cn(
              "flex justify-center mb-8 transition-all duration-1000 ease-out delay-1200",
              showCTA ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <EnhancedSolBrain 
              variant="lotus"
              size="lg"
              animated={true}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Trust Indicators */}
          <div 
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm sm:text-base transition-all duration-1000 ease-out delay-1500",
              showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="flex items-center space-x-2 text-harmonix-sage-fade">
              <Users className="w-5 h-5 text-harmonix-regal-gold" />
              <span>280+ Early Adopters</span>
            </div>
            
            <div className="flex items-center space-x-2 text-harmonix-sage-fade">
              <TrendingUp className="w-5 h-5 text-harmonix-regal-gold" />
              <span>95% Automation Success</span>
            </div>
            
            <div className="flex items-center space-x-2 text-harmonix-sage-fade">
              <div className="w-3 h-3 bg-harmonix-regal-gold rounded-full animate-pulse" />
              <span>SŌL Brain Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-harmonix-regal-gold/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-harmonix-regal-gold rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}