import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Play, CheckCircle, Clock, Users, TrendingUp, Zap, Building, Briefcase, DollarSign } from "lucide-react";

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  industry: string;
  agents: string[];
  estimatedSetup: string;
  features: string[];
  results: {
    timesSaved: string;
    efficiency: string;
    roi: string;
  };
}

export default function DemoDeployPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "deploying" | "deployed">("idle");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const demoScenarios: DemoScenario[] = [
    {
      id: "sales-automation",
      title: "Sales Automation Suite",
      description: "Complete lead-to-close automation with CA$HFLOW, Executive Assistant, and CRM integration",
      icon: DollarSign,
      industry: "SaaS/Technology",
      agents: ["CA$HFLOW Sales Agent", "Executive Assistant", "CRM Integration", "Email Marketing"],
      estimatedSetup: "2 minutes",
      features: [
        "Automated lead qualification",
        "Smart follow-up sequences",
        "Calendar scheduling",
        "Pipeline management",
        "Performance analytics"
      ],
      results: {
        timesSaved: "25 hours/week",
        efficiency: "300% increase",
        roi: "480% in 6 months"
      }
    },
    {
      id: "startup-growth",
      title: "Startup Growth Engine",
      description: "All-in-one growth platform with marketing, operations, and finance automation",
      icon: TrendingUp,
      industry: "Startup/Scale-up",
      agents: ["Social Media Agent", "Content Creator", "Project Manager", "Finance Agent", "HR Agent"],
      estimatedSetup: "3 minutes",
      features: [
        "Content creation & posting",
        "Team coordination",
        "Financial reporting",
        "Hiring automation",
        "Growth analytics"
      ],
      results: {
        timesSaved: "40 hours/week",
        efficiency: "250% increase",
        roi: "620% in 8 months"
      }
    },
    {
      id: "enterprise-ops",
      title: "Enterprise Operations",
      description: "Large-scale business automation with compliance, security, and multi-department coordination",
      icon: Building,
      industry: "Enterprise",
      agents: ["Legal/Compliance", "Finance Agent", "HR Agent", "Project Manager", "Analyst", "Executive Assistant"],
      estimatedSetup: "5 minutes",
      features: [
        "Compliance monitoring",
        "Multi-department workflows",
        "Risk assessment",
        "Executive reporting",
        "Resource optimization"
      ],
      results: {
        timesSaved: "60 hours/week",
        efficiency: "180% increase",
        roi: "340% in 12 months"
      }
    },
    {
      id: "consulting-firm",
      title: "Consulting Excellence",
      description: "Professional services automation with client management and project delivery",
      icon: Briefcase,
      industry: "Professional Services",
      agents: ["Project Manager", "Executive Assistant", "Finance Agent", "Content Creator", "Analyst"],
      estimatedSetup: "3 minutes",
      features: [
        "Client project tracking",
        "Automated reporting",
        "Resource allocation",
        "Proposal generation",
        "Performance insights"
      ],
      results: {
        timesSaved: "35 hours/week",
        efficiency: "280% increase",
        roi: "520% in 6 months"
      }
    }
  ];

  const handleDeploy = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setDeploymentStatus("deploying");
    setProgress(0);

    // Simulate deployment progress
    const progressSteps = [
      { progress: 20, message: "Initializing SŌL brain engine..." },
      { progress: 40, message: "Configuring agent environments..." },
      { progress: 60, message: "Loading scenario data..." },
      { progress: 80, message: "Establishing agent connections..." },
      { progress: 100, message: "Demo environment ready!" }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
      toast({
        title: "Deployment Progress",
        description: step.message,
      });
    }

    setDeploymentStatus("deployed");
    toast({
      title: "Demo Deployed Successfully!",
      description: "Your demo environment is now ready to explore.",
    });
  };

  const resetDemo = () => {
    setSelectedScenario(null);
    setDeploymentStatus("idle");
    setProgress(0);
  };

  if (deploymentStatus === "deployed" && selectedScenario) {
    const scenario = demoScenarios.find(s => s.id === selectedScenario)!;
    
    return (
      <div className="min-h-screen bg-harmony-dark">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="bg-gray-900/50 border-harmony-gold/30">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-harmony-gold" />
              </div>
              <CardTitle className="text-3xl font-bold text-harmony-gold font-serif">
                Demo Environment Ready!
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {scenario.title} is now fully deployed and operational
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-harmony-gold/10 border-harmony-gold/30">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-harmony-gold">Active Agents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scenario.agents.map((agent, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-300">{agent}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-harmony-gold/10 border-harmony-gold/30">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-harmony-gold">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scenario.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-harmony-gold" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-harmony-gold/10 border-harmony-gold/30">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-harmony-gold">Expected Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-harmony-gold">{scenario.results.timesSaved}</div>
                        <div className="text-xs text-gray-400">Time Saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-harmony-gold">{scenario.results.efficiency}</div>
                        <div className="text-xs text-gray-400">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-harmony-gold">{scenario.results.roi}</div>
                        <div className="text-xs text-gray-400">ROI</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/agent-dashboard">
                  <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                    Explore Agent Dashboard
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                    Browse More Agents
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:border-gray-500"
                  onClick={resetDemo}
                >
                  Try Another Scenario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <HarmonixLogo size="lg" variant="gold" className="justify-center mb-6" />
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
                One-Click <span className="text-harmony-gold">Demo Deployment</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience pre-configured agent scenarios instantly. See how different combinations 
                of AI agents work together for your specific industry and use case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Progress */}
      {deploymentStatus === "deploying" && (
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gray-900/50 border-harmony-gold/30">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-harmony-gold/30"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-harmony-gold border-r-transparent animate-spin"></div>
                  </div>
                </div>
                <CardTitle className="text-2xl text-harmony-gold font-serif">
                  Deploying Demo Environment
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Setting up your personalized agent scenario...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-harmony-gold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
                <p className="text-center text-gray-400">
                  This usually takes 2-5 minutes depending on scenario complexity
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Demo Scenarios */}
      {deploymentStatus === "idle" && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white font-serif mb-4">
                Choose Your <span className="text-harmony-gold">Demo Scenario</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Each scenario includes pre-configured agents, sample data, and realistic workflows 
                to demonstrate the full power of intelligent automation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {demoScenarios.map((scenario) => (
                <Card key={scenario.id} className="bg-gray-900/50 border-gray-800 hover:border-harmony-gold/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                        <scenario.icon className="h-6 w-6 text-harmony-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-harmony-gold font-serif">{scenario.title}</CardTitle>
                          <Badge className="bg-harmony-green/20 text-harmony-green border-harmony-green/30">
                            {scenario.industry}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-300">
                          {scenario.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-harmony-gold">{scenario.results.timesSaved}</div>
                        <div className="text-xs text-gray-400">Time Saved</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-harmony-gold">{scenario.results.efficiency}</div>
                        <div className="text-xs text-gray-400">Efficiency</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-harmony-gold">{scenario.results.roi}</div>
                        <div className="text-xs text-gray-400">ROI</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Included Agents:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scenario.agents.map((agent, index) => (
                          <Badge key={index} variant="outline" className="border-harmony-gold/30 text-gray-300">
                            {agent}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Key Features:</h4>
                      <div className="space-y-1">
                        {scenario.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-harmony-gold" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                        {scenario.features.length > 3 && (
                          <div className="text-sm text-gray-400">
                            +{scenario.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Setup: {scenario.estimatedSetup}</span>
                      </div>
                      <Button 
                        className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
                        onClick={() => handleDeploy(scenario.id)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Deploy Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      {deploymentStatus === "idle" && (
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
              <Users className="w-16 h-16 text-harmony-gold mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white font-serif mb-4">
                What to Expect
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-harmony-gold mb-2">Real Agent Interactions</h4>
                  <p className="text-gray-300 text-sm">
                    Experience actual AI agents working together with realistic scenarios and data flows.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-harmony-gold mb-2">Live Dashboards</h4>
                  <p className="text-gray-300 text-sm">
                    See real-time analytics, agent performance metrics, and business insights.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-harmony-gold mb-2">Full Customization</h4>
                  <p className="text-gray-300 text-sm">
                    Modify agent behavior, add custom workflows, and see immediate results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}