import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { AnimatedTooltip, MysticalTooltip, NeuralTooltip, SacredTooltip } from "@/components/ui/animated-tooltip";
import { Sparkles, Brain, Zap, Info, Settings, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const loaderVariants = [
  { name: "Sacred Geometry", variant: "sacred" as const, description: "Mystical sacred patterns with lotus symbolism" },
  { name: "Neural Network", variant: "neural" as const, description: "AI brain visualization with connected nodes" },
  { name: "Harmonic Waves", variant: "harmony" as const, description: "Rhythmic energy waves emanating outward" },
  { name: "Orbital Motion", variant: "orbit" as const, description: "Celestial bodies in synchronized dance" },
  { name: "Pulsing Core", variant: "pulse" as const, description: "Breathing energy from the center" },
  { name: "Minimal", variant: "minimal" as const, description: "Clean and simple spinner" }
];

const sizes = ["sm", "md", "lg", "xl"] as const;

export default function LoadingShowcase() {
  const [selectedLoader, setSelectedLoader] = useState(0);
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [showMessage, setShowMessage] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space-black via-[#1a2332] to-deep-space-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-jade-forest to-harmonix-gold bg-clip-text text-transparent">
            Whimsical Loading States
          </h1>
          <p className="text-jade-forest/80 text-lg max-w-2xl mx-auto">
            Sacred animations and mystical tooltips that enhance the user experience with purposeful beauty
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Loading Demo Section */}
          <Card className="bg-deep-space-black/50 border-jade-forest/30">
            <CardHeader>
              <CardTitle className="text-jade-forest flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Interactive Loading Demo
              </CardTitle>
              <CardDescription className="text-jade-forest/70">
                Experience different loading animations and customize their appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loader Display */}
              <div className="bg-gradient-to-br from-jade-forest/5 to-harmonix-gold/5 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                <WhimsicalLoader
                  variant={loaderVariants[selectedLoader].variant}
                  size={selectedSize}
                  message={showMessage ? loaderVariants[selectedLoader].description : undefined}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Variant Selection */}
                <div>
                  <label className="text-sm font-medium text-jade-forest mb-2 block">
                    Animation Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {loaderVariants.map((loader, index) => (
                      <Button
                        key={loader.name}
                        variant={selectedLoader === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLoader(index)}
                        className={selectedLoader === index 
                          ? "bg-harmonix-gold text-deep-space-black" 
                          : "border-jade-forest/30 text-jade-forest hover:border-jade-forest/50"
                        }
                      >
                        {loader.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="text-sm font-medium text-jade-forest mb-2 block">
                    Size
                  </label>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className={selectedSize === size 
                          ? "bg-harmonix-gold text-deep-space-black" 
                          : "border-jade-forest/30 text-jade-forest hover:border-jade-forest/50"
                        }
                      >
                        {size.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showMessage"
                    checked={showMessage}
                    onChange={(e) => setShowMessage(e.target.checked)}
                    className="w-4 h-4 text-harmonix-gold bg-deep-space-black border-jade-forest/30 rounded focus:ring-harmonix-gold"
                  />
                  <label htmlFor="showMessage" className="text-sm text-jade-forest">
                    Show descriptive message
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tooltip Demo Section */}
          <Card className="bg-deep-space-black/50 border-jade-forest/30">
            <CardHeader>
              <CardTitle className="text-jade-forest flex items-center gap-2">
                <Info className="w-5 h-5" />
                Animated Tooltips
              </CardTitle>
              <CardDescription className="text-jade-forest/70">
                Hover over elements to see mystical tooltip animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Mystical Tooltips */}
                <div>
                  <h3 className="text-sm font-medium text-jade-forest mb-4">Mystical Variant</h3>
                  <div className="flex flex-wrap gap-4">
                    <MysticalTooltip 
                      content="Mystical energy flows through this sacred interface element"
                      side="top"
                    >
                      <Button variant="outline" className="border-jade-forest/40 text-jade-forest">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Hover for Magic
                      </Button>
                    </MysticalTooltip>

                    <MysticalTooltip 
                      content={
                        <div className="space-y-1">
                          <div className="font-semibold">Sacred Wisdom</div>
                          <div className="text-xs opacity-80">
                            This element contains ancient knowledge waiting to be discovered
                          </div>
                        </div>
                      }
                      side="bottom"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-jade-forest to-harmonix-gold flex items-center justify-center cursor-pointer">
                        <Brain className="w-6 h-6 text-deep-space-black" />
                      </div>
                    </MysticalTooltip>
                  </div>
                </div>

                {/* Neural Tooltips */}
                <div>
                  <h3 className="text-sm font-medium text-jade-forest mb-4">Neural Variant</h3>
                  <div className="flex flex-wrap gap-4">
                    <NeuralTooltip 
                      content="AI neural pathways activate when you engage with this element"
                      side="left"
                    >
                      <Button variant="outline" className="border-harmonix-gold/40 text-harmonix-gold">
                        <Brain className="w-4 h-4 mr-2" />
                        AI Enhanced
                      </Button>
                    </NeuralTooltip>

                    <NeuralTooltip 
                      content="Processing quantum calculations in real-time"
                      side="right"
                    >
                      <div className="px-3 py-2 bg-harmonix-gold/10 border border-harmonix-gold/30 rounded-lg cursor-pointer">
                        <Zap className="w-5 h-5 text-harmonix-gold" />
                      </div>
                    </NeuralTooltip>
                  </div>
                </div>

                {/* Sacred Tooltips */}
                <div>
                  <h3 className="text-sm font-medium text-jade-forest mb-4">Sacred Variant</h3>
                  <div className="flex flex-wrap gap-4">
                    <SacredTooltip 
                      content="Sacred geometry guides the wisdom within"
                      side="top"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-jade-forest/20 to-harmonix-gold/20 border border-harmonix-gold/40 rounded-lg flex items-center justify-center cursor-pointer">
                        <div className="w-8 h-8 relative">
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-3 bg-harmonix-gold rounded-full opacity-70"
                              style={{
                                transform: `rotate(${i * 60}deg)`,
                                transformOrigin: 'center bottom',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </SacredTooltip>

                    <SacredTooltip 
                      content={
                        <div className="text-center space-y-2">
                          <div className="text-harmonix-gold font-semibold">Divine Connection</div>
                          <div className="text-xs">
                            Channel the infinite wisdom of the cosmos
                          </div>
                        </div>
                      }
                      side="bottom"
                    >
                      <Button className="bg-gradient-to-r from-jade-forest to-harmonix-gold text-deep-space-black">
                        Sacred Portal
                      </Button>
                    </SacredTooltip>
                  </div>
                </div>

                {/* Navigation Tooltips Example */}
                <div>
                  <h3 className="text-sm font-medium text-jade-forest mb-4">Navigation Examples</h3>
                  <div className="flex gap-2">
                    <AnimatedTooltip content="Return to the sacred homepage" variant="mystical">
                      <Button variant="ghost" size="sm" className="text-jade-forest hover:text-harmonix-gold">
                        <Home className="w-4 h-4" />
                      </Button>
                    </AnimatedTooltip>
                    <AnimatedTooltip content="Configure your divine settings" variant="neural">
                      <Button variant="ghost" size="sm" className="text-jade-forest hover:text-harmonix-gold">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </AnimatedTooltip>
                    <AnimatedTooltip content="Access your sacred profile" variant="sacred">
                      <Button variant="ghost" size="sm" className="text-jade-forest hover:text-harmonix-gold">
                        <User className="w-4 h-4" />
                      </Button>
                    </AnimatedTooltip>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="bg-deep-space-black/50 border-jade-forest/30">
          <CardHeader>
            <CardTitle className="text-jade-forest">Implementation Examples</CardTitle>
            <CardDescription className="text-jade-forest/70">
              Real-world usage scenarios in the Harmonix platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Agent Processing */}
              <div className="text-center space-y-4">
                <h3 className="text-jade-forest font-medium">Agent Processing</h3>
                <WhimsicalLoader 
                  variant="neural" 
                  size="lg" 
                  message="Agent CA$H is analyzing your leads..."
                />
              </div>

              {/* SŌL Brain Thinking */}
              <div className="text-center space-y-4">
                <h3 className="text-jade-forest font-medium">SŌL Brain Active</h3>
                <WhimsicalLoader 
                  variant="sacred" 
                  size="lg" 
                  message="Orchestrating divine intelligence..."
                />
              </div>

              {/* Harmony Synchronization */}
              <div className="text-center space-y-4">
                <h3 className="text-jade-forest font-medium">System Sync</h3>
                <WhimsicalLoader 
                  variant="harmony" 
                  size="lg" 
                  message="Harmonizing with the cosmic frequency..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}