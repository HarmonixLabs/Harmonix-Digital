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
    <div className={cn("harmonix-hero min-h-screen flex items-center justify-center relative", className)}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-warm-gold/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Sacred Geometry Grid */}
      <div className="absolute inset-0 harmonix-sacred-grid opacity-30" />

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
          <h1 className="harmonix-header-font text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            {taglineWords.map((word, index) => (
              <span
                key={index}
                className={cn(
                  "inline-block mr-4 transition-all duration-500 ease-out",
                  index < taglineWords.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  color: word === "Timeless" || word === "Sovereignty" ? "var(--warm-gold)" : "inherit"
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          
          <p 
            className={cn(
              "harmonix-body-font text-xl lg:text-2xl text-warm-gold/80 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-1000",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
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
          <SacredButton
            variant="primary"
            size="lg"
            onClick={() => setLocation('/marketplace')}
            glow
            className="min-w-48"
          >
            Activate Agents
          </SacredButton>
          
          <SacredButton
            variant="secondary"
            size="lg"
            onClick={() => setLocation('/demo-scenarios')}
            className="min-w-48"
          >
            See Live Demo
          </SacredButton>
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