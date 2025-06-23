import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { DemoScenarioCard } from "@/components/demo/demo-scenario-card";
import { DemoExecution } from "@/components/demo/demo-execution";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  demoScenarios, 
  getDemoScenariosByCategory, 
  getFeaturedDemoScenarios,
  type DemoScenario 
} from "@/data/demo-scenarios";
import { 
  Play, 
  Search, 
  Filter, 
  Sparkles, 
  TrendingUp, 
  Clock,
  BarChart3,
  Users
} from "lucide-react";

export default function DemoScenariosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [runningDemo, setRunningDemo] = useState<DemoScenario | null>(null);
  const [showDemoExecution, setShowDemoExecution] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'All Scenarios', count: demoScenarios.length },
    { id: 'sales', label: 'Sales Automation', count: getDemoScenariosByCategory('sales').length },
    { id: 'operations', label: 'Operations', count: getDemoScenariosByCategory('operations').length },
    { id: 'customer-service', label: 'Customer Service', count: getDemoScenariosByCategory('customer-service').length },
    { id: 'marketing', label: 'Marketing', count: getDemoScenariosByCategory('marketing').length },
    { id: 'enterprise', label: 'Enterprise', count: getDemoScenariosByCategory('enterprise').length }
  ];

  const complexityLevels = ['all', 'Simple', 'Intermediate', 'Advanced'];

  const filteredScenarios = demoScenarios.filter(scenario => {
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComplexity = selectedComplexity === 'all' || scenario.complexity === selectedComplexity;
    
    return matchesCategory && matchesSearch && matchesComplexity;
  });

  const featuredScenarios = getFeaturedDemoScenarios();

  const handleStartDemo = (scenario: DemoScenario) => {
    setRunningDemo(scenario);
    setShowDemoExecution(true);
    
    toast({
      title: "Demo Starting",
      description: `Initializing ${scenario.title} demonstration...`,
    });
  };

  const handleDemoComplete = () => {
    toast({
      title: "Demo Complete",
      description: "Scenario demonstration finished successfully!",
    });
    setShowDemoExecution(false);
    setRunningDemo(null);
  };

  const handleDemoClose = () => {
    setShowDemoExecution(false);
    setRunningDemo(null);
  };

  return (
    <div className="min-h-screen harmonix-gradient">
      <Navbar />
      
      <div className="harmonix-content-width py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 harmonix-visual-rhythm">
          <HarmonixLogo size="lg" variant="scenic" className="mx-auto mb-6" />
          <h1 className="harmonix-text-hierarchy text-6xl lg:text-7xl font-bold text-white mb-6">
            Interactive <span className="text-harmonix-regal-gold">Demo Scenarios</span>
          </h1>
          <p className="harmonix-text-hierarchy text-harmonix-sage-fade max-w-4xl mx-auto mb-8">
            Experience the power of AI automation through real-world use cases. 
            Watch as our agents transform business operations across different industries.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button className="harmonix-btn-primary">
              <Play className="w-5 h-5 mr-2" />
              Start Interactive Demo
            </Button>
            <Button className="harmonix-btn-secondary">
              <BarChart3 className="w-5 h-5 mr-2" />
              View ROI Calculator
            </Button>
          </div>
        </div>

        {/* Featured Scenarios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Featured <span className="text-harmonix-regal-gold">Scenarios</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredScenarios.map((scenario) => (
              <DemoScenarioCard
                key={scenario.id}
                scenario={scenario}
                onStartDemo={handleStartDemo}
                isRunning={runningDemo?.id === scenario.id}
              />
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="harmonix-card-enhanced mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-harmonix-sage-fade" />
                  <Input
                    placeholder="Search scenarios by industry, use case, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Complexity Filter */}
              <div className="lg:w-48">
                <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                  <SelectTrigger className="bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
                    <SelectValue placeholder="Complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    {complexityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level === 'all' ? 'All Levels' : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredScenarios.map((scenario) => (
            <DemoScenarioCard
              key={scenario.id}
              scenario={scenario}
              onStartDemo={handleStartDemo}
              isRunning={runningDemo?.id === scenario.id}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredScenarios.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-harmonix-sage-fade mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No scenarios found</h3>
            <p className="text-harmonix-sage-fade">
              Try adjusting your filters or search terms to discover relevant demo scenarios.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Implement These Solutions?
          </h3>
          <p className="text-harmonix-sage-fade text-lg mb-6 max-w-2xl mx-auto">
            Transform your business with the same AI automation showcased in these demos. 
            Get started with a custom solution tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button className="harmonix-btn-primary">
              <TrendingUp className="w-5 h-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button className="harmonix-btn-secondary">
              <Users className="w-5 h-5 mr-2" />
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Demo Execution Modal */}
      {showDemoExecution && runningDemo && (
        <DemoExecution
          scenario={runningDemo}
          onComplete={handleDemoComplete}
          onClose={handleDemoClose}
        />
      )}
    </div>
  );
}