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
      const words = "Intelligent systems for timeless sovereignty".split(" ");
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
      {/* Sacred Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-space-black via-[#1a2332] to-deep-space-black">
        {/* Multi-layer Brand Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-jade-forest/15 via-transparent to-harmonix-gold/20" />
        <div className="absolute inset-0 bg-gradient-to-tl from-harmonix-gold/10 via-transparent to-jade-forest/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jade-forest/5 to-transparent" />
        
        {/* Sacred Starfall animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-12 bg-gradient-to-b from-harmonix-gold via-jade-forest/50 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                animationName: 'starfallSacred',
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${8 + Math.random() * 6}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
              }}
            />
          ))}
          {/* Sacred geometry particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`sacred-${i}`}
              className="absolute w-2 h-2 bg-harmonix-gold rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `breathe ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
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

        {/* Enhanced Sacred geometry grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.15) 1px, transparent 1px),
              linear-gradient(45deg, rgba(74, 144, 226, 0.08) 1px, transparent 1px)
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
              className="bg-gradient-to-r from-harmonix-gold/20 to-jade-forest/20 text-harmonix-gold border-harmonix-gold/40 px-6 py-3 text-sm sm:text-base font-medium backdrop-blur-sm shadow-lg shadow-harmonix-gold/20"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Limited Time Offer - Early Bird 30% Off
            </Badge>
          </div>

          {/* Sacred Main Slogan */}
          <div className="space-y-6 sm:space-y-8">
            <h1 className="font-bold leading-tight tracking-tight relative">
              {/* Sacred geometric backdrop */}
              <div className="absolute inset-0 -z-10">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-harmonix-gold/5 to-transparent rounded-3xl blur-3xl"></div>
              </div>
              
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif leading-none">
                {sloganWords.map((word, index) => (
                  <span
                    key={index}
                    className={cn(
                      "inline-block mr-3 sm:mr-4 transition-all duration-700 ease-out relative",
                      index < sloganWords.length ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                    )}
                    style={{
                      background: word === "Timeless" || word === "Sovereignty" 
                        ? "linear-gradient(135deg, #D4AF37 0%, #F4E4A1 100%)"
                        : "linear-gradient(135deg, #1D6B4A 0%, #2A8059 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: word === "Timeless" || word === "Sovereignty"
                        ? "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))"
                        : "drop-shadow(0 0 15px rgba(29, 107, 74, 0.4))",
                      animationDelay: `${index * 0.08}s`,
                    }}
                  >
                    {word}
                    {(word === "Timeless" || word === "Sovereignty") && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-harmonix-gold/20 to-transparent rounded-lg blur-md -z-10"
                        style={{ animation: "breathe 3s ease-in-out infinite" }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </h1>
            
            {/* Sacred Supporting headline */}
            <div 
              className={cn(
                "text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-5xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-700",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <p className="font-light text-jade-forest/90 mb-3 text-2xl sm:text-3xl">
                Build • Automate • Exit
              </p>
              <p className="font-medium bg-gradient-to-r from-harmonix-gold via-[#F4E4A1] to-harmonix-gold bg-clip-text text-transparent mb-2">
                Powered By Harmony AI. Designed for Freedom
              </p>
              <p className="font-light text-jade-forest/80 text-lg sm:text-xl">
                Why work in your business when your business should work for you
              </p>
            </div>
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
              className="group relative w-full sm:w-auto min-w-[220px] h-14 sm:h-16 px-8 text-base sm:text-lg font-semibold bg-gradient-to-r from-harmonix-gold via-[#F4E4A1] to-harmonix-gold text-deep-space-black transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-harmonix-gold/40 border border-harmonix-gold/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-harmonix-gold/80 to-harmonix-gold/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ArrowRight className="relative mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="relative">Activate Your Agents</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation('/demo')}
              className="group relative w-full sm:w-auto min-w-[220px] h-14 sm:h-16 px-8 text-base sm:text-lg font-medium border-2 border-jade-forest/40 bg-gradient-to-r from-jade-forest/5 to-jade-forest/10 text-jade-forest hover:bg-gradient-to-r hover:from-jade-forest/15 hover:to-jade-forest/20 hover:border-jade-forest/60 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-jade-forest/20 backdrop-blur-sm"
            >
              <Sparkles className="relative mr-3 h-5 w-5 group-hover:animate-pulse" />
              <span className="relative">See Live Demo</span>
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