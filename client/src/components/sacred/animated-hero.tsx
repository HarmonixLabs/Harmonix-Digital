import React, { useEffect, useState } from "react";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { SacredButton } from "@/components/ui/sacred-button";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface AnimatedHeroProps {
  className?: string;
}

export function AnimatedHero({ className }: AnimatedHeroProps) {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [taglineWords, setTaglineWords] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const words = "Intelligent Systems for Timeless Sovereignty".split(" ");
      words.forEach((word, index) => {
        setTimeout(() => {
          setTaglineWords(prev => [...prev, word]);
        }, index * 200);
      });
    }
  }, [isLoaded]);

  return (
    <div className={cn("min-h-screen flex items-center justify-center relative", className)} 
         style={{ background: '#0b0f0e' }}>
      
      {/* Living Circuit Mist */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" 
               style={{ 
                 background: 'radial-gradient(circle, rgba(47, 78, 70, 0.4) 0%, transparent 70%)',
                 animation: 'pulse 8s ease-in-out infinite'
               }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full" 
               style={{ 
                 background: 'radial-gradient(circle, rgba(215, 183, 109, 0.2) 0%, transparent 70%)',
                 animation: 'pulse 6s ease-in-out infinite reverse'
               }} />
        </div>
        
        {/* Floating Gold Particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              background: '#d7b76d',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Sacred Geometry Grid */}
      <div className="absolute inset-0" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(47, 78, 70, 0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(47, 78, 70, 0.03) 1px, transparent 1px)
             `,
             backgroundSize: '80px 80px'
           }} />

      {/* Main Content */}
      <div className="text-center px-4 relative z-10 max-w-6xl mx-auto">
        {/* Animated Logo */}
        <div 
          className={cn(
            "mb-12 transition-all duration-1000 ease-out",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="relative">
            <HarmonixLogo 
              size="xl" 
              variant="scenic" 
              className="mx-auto mb-8 animate-pulse"
            />
            
            {/* Breathing Aura */}
            <div className="absolute inset-0 -m-8">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-warm-gold/10 to-transparent animate-ping" />
            </div>
          </div>
        </div>

        {/* Animated Tagline */}
        <div className="mb-8">
          <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight" 
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: '#d7b76d'
              }}>
            {taglineWords.map((word, index) => (
              <span
                key={index}
                className={cn(
                  "inline-block mr-4 transition-all duration-500 ease-out",
                  index < taglineWords.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  color: word === "Timeless" || word === "Sovereignty" ? "#d7b76d" : "#768b7c",
                  textShadow: '0 0 30px rgba(215, 183, 109, 0.4)'
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          
          <p 
            className={cn(
              "text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-1000",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              fontFamily: 'Inter, sans-serif',
              color: 'rgba(118, 139, 124, 0.9)',
              fontWeight: '400'
            }}
          >
            Build your business like a sacred machine. Powered by AI. Designed for freedom.
          </p>
        </div>

        {/* Sacred Action Buttons */}
        <div 
          className={cn(
            "flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 ease-out delay-1500",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <button
            onClick={() => setLocation('/marketplace')}
            className="min-w-48 px-8 py-4 text-lg font-semibold rounded-xl border transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #d7b76d 0%, rgba(215, 183, 109, 0.9) 100%)',
              color: '#0b0f0e',
              border: '1px solid rgba(215, 183, 109, 0.5)',
              boxShadow: '0 4px 20px rgba(215, 183, 109, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(215, 183, 109, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(215, 183, 109, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ▸ Activate Agents
          </button>
          
          <button
            onClick={() => setLocation('/demo-scenarios')}
            className="min-w-48 px-8 py-4 text-lg font-medium rounded-xl border-2 transition-all duration-300"
            style={{
              background: 'transparent',
              color: '#d7b76d',
              border: '2px solid rgba(215, 183, 109, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(215, 183, 109, 0.1)';
              e.currentTarget.style.borderColor = '#d7b76d';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(215, 183, 109, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ▸ See Live Demo
          </button>
        </div>

        {/* Sacred Status Indicator */}
        <div 
          className={cn(
            "mt-12 flex items-center justify-center space-x-3 transition-all duration-1000 ease-out delay-2000",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="w-3 h-3 bg-warm-gold rounded-full animate-pulse" />
          <span className="harmonix-body-font text-warm-gold/70 text-sm tracking-wide uppercase">
            SŌL Brain Engine Active
          </span>
          <div className="w-3 h-3 bg-circuit-teal rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>

      {/* Cursor Ripple Effect */}
      <div 
        id="cursor-ripple" 
        className="absolute pointer-events-none w-6 h-6 border border-circuit-teal/50 rounded-full opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}