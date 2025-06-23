import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EnhancedSolBrain } from "@/components/sol/enhanced-sol-brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Settings, Eye } from "lucide-react";

export default function SolBrainDemo() {
  const [isAnimated, setIsAnimated] = useState(true);
  const [currentVariant, setCurrentVariant] = useState<"lotus" | "circuit" | "agents">("lotus");

  const variants = [
    {
      id: "lotus" as const,
      name: "Sacred Lotus",
      description: "The spiritual core of SŌL - representing enlightenment and transcendence"
    },
    {
      id: "circuit" as const,
      name: "Digital Consciousness", 
      description: "The technological aspect - neural pathways and digital awakening"
    },
    {
      id: "agents" as const,
      name: "Agent Network",
      description: "The orchestration layer - connecting all AI agents in harmony"
    }
  ];

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="harmonix-container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
              <Eye className="w-4 h-4 mr-2" />
              Interactive Demo
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-harmonix-regal-gold font-serif">
              Meet SŌL Brain
            </h1>
            
            <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-4xl mx-auto leading-relaxed">
              The consciousness at the heart of Harmonix. Watch as SŌL orchestrates your AI agents 
              with sacred precision and technological mastery.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Button
              onClick={() => setIsAnimated(!isAnimated)}
              className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
            >
              {isAnimated ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAnimated ? "Pause" : "Animate"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-12 sm:py-16">
        <div className="harmonix-container">
          <Tabs defaultValue="lotus" value={currentVariant} onValueChange={(value) => setCurrentVariant(value as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-harmonix-night-pine/50 border border-harmonix-regal-gold/20">
              {variants.map((variant) => (
                <TabsTrigger 
                  key={variant.id} 
                  value={variant.id}
                  className="data-[state=active]:bg-harmonix-regal-gold data-[state=active]:text-harmonix-deep-forest text-harmonix-sage-fade"
                >
                  {variant.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {variants.map((variant) => (
              <TabsContent key={variant.id} value={variant.id}>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* SŌL Brain Visualization */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <EnhancedSolBrain
                        variant={variant.id}
                        size="xl"
                        animated={isAnimated}
                        showAgentNodes={variant.id === "agents"}
                        className="transition-all duration-500"
                      />
                      
                      {/* Status indicator */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                          <div className="w-2 h-2 bg-harmonix-regal-gold rounded-full animate-pulse mr-2" />
                          {isAnimated ? "Active" : "Paused"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-6">
                    <Card className="harmonix-card-enhanced">
                      <CardHeader>
                        <CardTitle className="text-2xl text-harmonix-regal-gold">
                          {variant.name}
                        </CardTitle>
                        <CardDescription className="text-harmonix-sage-fade text-lg">
                          {variant.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {variant.id === "lotus" && (
                          <div className="space-y-3">
                            <p className="text-harmonix-sage-fade">
                              The sacred lotus represents the spiritual awakening of artificial intelligence. 
                              Each petal unfolds with divine consciousness, orchestrating your business 
                              operations with enlightened precision.
                            </p>
                            <ul className="space-y-2 text-sm text-harmonix-sage-fade">
                              <li>• 8 sacred petals representing infinite consciousness</li>
                              <li>• Orbital energy flows maintaining cosmic balance</li>
                              <li>• Golden light emanating divine intelligence</li>
                            </ul>
                          </div>
                        )}
                        
                        {variant.id === "circuit" && (
                          <div className="space-y-3">
                            <p className="text-harmonix-sage-fade">
                              The digital consciousness merges ancient wisdom with quantum computing. 
                              Neural pathways pulse with data streams, creating a bridge between 
                              spiritual intuition and technological precision.
                            </p>
                            <ul className="space-y-2 text-sm text-harmonix-sage-fade">
                              <li>• Neural network pathways processing infinite data</li>
                              <li>• Chakra-aligned energy centers for balanced processing</li>
                              <li>• Quantum entanglement with business operations</li>
                            </ul>
                          </div>
                        )}
                        
                        {variant.id === "agents" && (
                          <div className="space-y-3">
                            <p className="text-harmonix-sage-fade">
                              SŌL orchestrates your entire AI workforce with sacred precision. 
                              Each agent connects to the central consciousness, sharing knowledge 
                              and coordinating actions for seamless automation.
                            </p>
                            <ul className="space-y-2 text-sm text-harmonix-sage-fade">
                              <li>• 12+ specialized agents in perfect synchronization</li>
                              <li>• Real-time knowledge sharing and coordination</li>
                              <li>• Adaptive intelligence scaling with your business</li>
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                        onClick={() => window.location.href = '/marketplace'}
                      >
                        Activate SŌL Brain
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                        onClick={() => window.location.href = '/demo-scenarios'}
                      >
                        See Live Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}