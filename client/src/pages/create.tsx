import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Wand2, 
  Upload, 
  Settings, 
  Coins, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  DollarSign,
  MessageCircle,
  Users,
  Calendar,
  BarChart,
  Shield,
  FileText,
  Briefcase,
  TrendingUp
} from "lucide-react";

interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function CreateAgentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  const [agentData, setAgentData] = useState({
    name: "",
    category: "",
    description: "",
    personality: "",
    avatar: null,
    skills: [] as string[],
    pricing: {
      price: "",
      license: "personal"
    },
    advanced: {
      prompt: "",
      integrations: [] as string[]
    }
  });

  const agentCategories = [
    { value: "sales", label: "Sales Agent", icon: DollarSign, description: "Lead generation, qualification, and conversion" },
    { value: "support", label: "Support Agent", icon: MessageCircle, description: "Customer service and technical support" },
    { value: "hr", label: "HR Agent", icon: Users, description: "Recruitment, onboarding, and employee management" },
    { value: "marketing", label: "Marketing Agent", icon: TrendingUp, description: "Content creation and campaign management" },
    { value: "operations", label: "Operations Agent", icon: Calendar, description: "Project management and workflow coordination" },
    { value: "finance", label: "Finance Agent", icon: BarChart, description: "Financial analysis and reporting" },
    { value: "legal", label: "Legal Agent", icon: Shield, description: "Compliance and document management" },
    { value: "content", label: "Content Agent", icon: FileText, description: "Writing, editing, and content strategy" },
    { value: "executive", label: "Executive Agent", icon: Briefcase, description: "Administrative and strategic assistance" }
  ];

  const availableSkills: AgentSkill[] = [
    { id: "email", name: "Email Management", description: "Send, organize, and respond to emails", category: "communication" },
    { id: "calendar", name: "Calendar Integration", description: "Schedule and manage appointments", category: "productivity" },
    { id: "crm", name: "CRM Integration", description: "Manage customer relationships and data", category: "sales" },
    { id: "data-analysis", name: "Data Analysis", description: "Analyze and interpret business data", category: "analytics" },
    { id: "social-media", name: "Social Media", description: "Manage social media accounts and content", category: "marketing" },
    { id: "document-gen", name: "Document Generation", description: "Create and format documents automatically", category: "productivity" },
    { id: "chat-support", name: "Chat Support", description: "Handle customer inquiries and support tickets", category: "support" },
    { id: "lead-scoring", name: "Lead Scoring", description: "Evaluate and score potential customers", category: "sales" }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    setAgentData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId) 
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleCreateAgent = async () => {
    setIsCreating(true);
    
    // Simulate agent creation and minting process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate blockchain transaction
      
      toast({
        title: "Agent Created Successfully!",
        description: `${agentData.name} has been minted and added to your team.`,
      });
      
      // Redirect to my-agents page
      window.location.href = "/my-agents";
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-harmony-dark">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto bg-gray-900/50 border-harmony-gold/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-harmony-gold font-serif">Creator Access Required</CardTitle>
              <CardDescription className="text-gray-300">
                Please log in with a Creator account to build custom agents
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Link href="/login">
                <Button className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                  Login to Continue
                </Button>
              </Link>
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
      
      {/* Header */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white font-serif mb-4">
              Create Your <span className="text-harmony-gold">Custom Agent</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Design and mint a personalized AI agent with unique capabilities, 
              personality, and specialized skills for your business needs.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep 
                      ? "bg-harmony-gold text-harmony-dark" 
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-0.5 ${
                      step < currentStep ? "bg-harmony-gold" : "bg-gray-700"
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="bg-gray-900/50 border-harmony-gold/30">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl text-harmony-gold font-serif flex items-center">
                    <Wand2 className="mr-3 h-6 w-6" />
                    Define Agent Basics
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Set up your agent's core identity and personality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Agent Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., SalesBot Pro"
                        value={agentData.name}
                        onChange={(e) => setAgentData({...agentData, name: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">Category</Label>
                      <Select onValueChange={(value) => setAgentData({...agentData, category: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {agentCategories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <category.icon className="h-4 w-4" />
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your agent does and its unique capabilities..."
                      value={agentData.description}
                      onChange={(e) => setAgentData({...agentData, description: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personality" className="text-gray-300">Personality & Tone</Label>
                    <Select onValueChange={(value) => setAgentData({...agentData, personality: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold">
                        <SelectValue placeholder="Choose personality style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional & Formal</SelectItem>
                        <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                        <SelectItem value="analytical">Analytical & Data-Driven</SelectItem>
                        <SelectItem value="creative">Creative & Innovative</SelectItem>
                        <SelectItem value="supportive">Supportive & Empathetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Avatar Upload</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-harmony-gold mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Upload agent avatar image</p>
                      <p className="text-sm text-gray-500">PNG or JPG, max 2MB</p>
                      <Button variant="outline" className="mt-4 border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Configure Abilities */}
            {currentStep === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl text-harmony-gold font-serif flex items-center">
                    <Settings className="mr-3 h-6 w-6" />
                    Configure Abilities
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Select skills and capabilities for your agent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Available Skills</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {availableSkills.map((skill) => (
                        <Card 
                          key={skill.id} 
                          className={`cursor-pointer transition-colors ${
                            agentData.skills.includes(skill.id)
                              ? "bg-harmony-gold/10 border-harmony-gold"
                              : "bg-gray-800/50 border-gray-700 hover:border-harmony-gold/50"
                          }`}
                          onClick={() => handleSkillToggle(skill.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">{skill.name}</h4>
                                <p className="text-sm text-gray-400">{skill.description}</p>
                                <Badge variant="outline" className="mt-2 border-harmony-gold/30 text-harmony-gold text-xs">
                                  {skill.category}
                                </Badge>
                              </div>
                              {agentData.skills.includes(skill.id) && (
                                <CheckCircle className="w-5 h-5 text-harmony-gold flex-shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advanced-prompt" className="text-gray-300">Custom Instructions (Optional)</Label>
                    <Textarea
                      id="advanced-prompt"
                      placeholder="Add specific instructions or custom behaviors for your agent..."
                      value={agentData.advanced.prompt}
                      onChange={(e) => setAgentData({
                        ...agentData, 
                        advanced: {...agentData.advanced, prompt: e.target.value}
                      })}
                      className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 3: Pricing & License */}
            {currentStep === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl text-harmony-gold font-serif flex items-center">
                    <Coins className="mr-3 h-6 w-6" />
                    Set Pricing & License
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure how others can access your agent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-gray-300">License Type</Label>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card 
                        className={`cursor-pointer transition-colors ${
                          agentData.pricing.license === "personal"
                            ? "bg-harmony-gold/10 border-harmony-gold"
                            : "bg-gray-800/50 border-gray-700 hover:border-harmony-gold/50"
                        }`}
                        onClick={() => setAgentData({
                          ...agentData, 
                          pricing: {...agentData.pricing, license: "personal"}
                        })}
                      >
                        <CardContent className="p-4 text-center">
                          <h4 className="font-semibold text-white mb-2">Personal Use</h4>
                          <p className="text-sm text-gray-400">For your team only</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-colors ${
                          agentData.pricing.license === "marketplace"
                            ? "bg-harmony-gold/10 border-harmony-gold"
                            : "bg-gray-800/50 border-gray-700 hover:border-harmony-gold/50"
                        }`}
                        onClick={() => setAgentData({
                          ...agentData, 
                          pricing: {...agentData.pricing, license: "marketplace"}
                        })}
                      >
                        <CardContent className="p-4 text-center">
                          <h4 className="font-semibold text-white mb-2">Marketplace</h4>
                          <p className="text-sm text-gray-400">Sell to others</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-colors ${
                          agentData.pricing.license === "open"
                            ? "bg-harmony-gold/10 border-harmony-gold"
                            : "bg-gray-800/50 border-gray-700 hover:border-harmony-gold/50"
                        }`}
                        onClick={() => setAgentData({
                          ...agentData, 
                          pricing: {...agentData.pricing, license: "open"}
                        })}
                      >
                        <CardContent className="p-4 text-center">
                          <h4 className="font-semibold text-white mb-2">Open Source</h4>
                          <p className="text-sm text-gray-400">Free for all</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {agentData.pricing.license === "marketplace" && (
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-gray-300">Price (in Harmony Tokens)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="e.g., 100"
                        value={agentData.pricing.price}
                        onChange={(e) => setAgentData({
                          ...agentData, 
                          pricing: {...agentData.pricing, price: e.target.value}
                        })}
                        className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      />
                    </div>
                  )}

                  <div className="bg-harmony-gold/10 border border-harmony-gold/30 rounded-lg p-4">
                    <h4 className="text-harmony-gold font-semibold mb-2">Minting Information</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Agent will be minted as an NFT on the blockchain</li>
                      <li>• You retain ownership and can transfer or sell the NFT</li>
                      <li>• Minting requires a small transaction fee</li>
                      <li>• Your wallet will need to confirm the transaction</li>
                    </ul>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 4: Review & Mint */}
            {currentStep === 4 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl text-harmony-gold font-serif flex items-center">
                    <CheckCircle className="mr-3 h-6 w-6" />
                    Review & Mint NFT
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Final review before minting your agent NFT
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Agent Preview */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Agent Preview</h3>
                      <Card className="bg-gray-800/50 border-harmony-gold/30">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <div className="w-20 h-20 mx-auto rounded-lg bg-harmony-gold/10 flex items-center justify-center mb-3">
                              {agentData.category && (
                                <div className="text-harmony-gold text-2xl">
                                  {agentCategories.find(c => c.value === agentData.category)?.icon && 
                                    React.createElement(agentCategories.find(c => c.value === agentData.category)!.icon, { size: 32 })
                                  }
                                </div>
                              )}
                            </div>
                            <h4 className="text-harmony-gold font-serif text-xl">{agentData.name || "Your Agent"}</h4>
                            <p className="text-gray-400 text-sm">
                              {agentCategories.find(c => c.value === agentData.category)?.label || "Custom Agent"}
                            </p>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">{agentData.description}</p>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-400">Skills: {agentData.skills.length}</p>
                            <p className="text-xs text-gray-400">License: {agentData.pricing.license}</p>
                            {agentData.pricing.price && (
                              <p className="text-xs text-gray-400">Price: {agentData.pricing.price} tokens</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Configuration Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Configuration Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-harmony-gold font-medium mb-2">Selected Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {agentData.skills.map(skillId => {
                              const skill = availableSkills.find(s => s.id === skillId);
                              return skill ? (
                                <Badge key={skillId} variant="outline" className="border-harmony-gold/30 text-harmony-gold text-xs">
                                  {skill.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-harmony-gold font-medium mb-2">Personality</h4>
                          <p className="text-gray-300 text-sm capitalize">{agentData.personality || "Not specified"}</p>
                        </div>

                        <div>
                          <h4 className="text-harmony-gold font-medium mb-2">Estimated Minting Cost</h4>
                          <p className="text-gray-300 text-sm">~0.05 ETH (gas fees may vary)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-3">Ready to Mint?</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      By clicking "Mint Agent NFT", you'll create a unique blockchain asset representing your custom AI agent. 
                      This process cannot be undone, so please review all details carefully.
                    </p>
                    <Button 
                      onClick={handleCreateAgent}
                      disabled={isCreating || !agentData.name || !agentData.category}
                      className="w-full bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold"
                      size="lg"
                    >
                      {isCreating ? (
                        <>
                          <Zap className="mr-2 h-5 w-5 animate-spin" />
                          Minting Agent NFT...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Mint Agent NFT
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Navigation Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-gray-600 text-gray-300 hover:border-harmony-gold hover:text-harmony-gold"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-gray-400">
                Step {currentStep} of 4
              </div>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (!agentData.name || !agentData.category)) ||
                    (currentStep === 2 && agentData.skills.length === 0)
                  }
                  className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10"
                  disabled
                >
                  Review Complete
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}