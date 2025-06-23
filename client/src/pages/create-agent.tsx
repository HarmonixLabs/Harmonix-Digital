import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Wallet, Upload, Zap, DollarSign, Award, Users, Bot, Star } from "lucide-react";

// Agent Form Structure based on specifications
interface AgentFormData {
  basicInfo: {
    agentName: string;
    category: string;
    tagline: string;
    agentAvatar: string;
    agentType: string;
    monthlyMRR: number;
    setupFee: number;
    tokenUseEstimate: string;
  };
  performance: {
    avgTimeSaved: number;
    avgROI: number;
    toolIntegrations: string[];
    exampleUseCases: string[];
  };
  ownership: {
    creatorWalletAddress: string;
    nftMintToggle: boolean;
    nftName: string;
    royaltySplit: {
      creator: number;
      platform: number;
      investorSplit: number;
    };
  };
  customization: {
    description: string;
    prebuiltPrompts: string[];
    targetPersona: string;
    agentPreviewDemoLink: string;
    availableLanguages: string[];
  };
  visibility: {
    public: boolean;
    displayOnLeaderboard: boolean;
    featureInMarketplace: boolean;
  };
}

const initialFormData: AgentFormData = {
  basicInfo: {
    agentName: "",
    category: "",
    tagline: "",
    agentAvatar: "",
    agentType: "Base Setup",
    monthlyMRR: 444,
    setupFee: 0,
    tokenUseEstimate: "Medium",
  },
  performance: {
    avgTimeSaved: 0,
    avgROI: 0,
    toolIntegrations: [],
    exampleUseCases: [],
  },
  ownership: {
    creatorWalletAddress: "",
    nftMintToggle: false,
    nftName: "",
    royaltySplit: {
      creator: 70,
      platform: 20,
      investorSplit: 10,
    },
  },
  customization: {
    description: "",
    prebuiltPrompts: [],
    targetPersona: "",
    agentPreviewDemoLink: "",
    availableLanguages: ["English"],
  },
  visibility: {
    public: true,
    displayOnLeaderboard: true,
    featureInMarketplace: false,
  },
};

export default function CreateAgent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<AgentFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableIntegrations = [
    "Zapier", "GHL", "Slack", "Notion", "HubSpot", "Webflow", 
    "ClickUp", "Calendly", "Zoom", "Stripe", "Canva", "Figma"
  ];

  const categories = [
    "Sales", "Operations", "Content", "SOP", "Concierge", "Custom"
  ];

  const handleWalletConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsWalletConnected(true);
        setFormData(prev => ({
          ...prev,
          ownership: {
            ...prev.ownership,
            creatorWalletAddress: accounts[0]
          }
        }));
        toast({
          title: "Wallet Connected",
          description: "You can now create and mint agents as NFTs.",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Please try connecting your wallet again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No Wallet Found",
        description: "Please install MetaMask or another Web3 wallet.",
        variant: "destructive",
      });
    }
  };

  const handleIntegrationToggle = (integration: string) => {
    setFormData(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        toolIntegrations: prev.performance.toolIntegrations.includes(integration)
          ? prev.performance.toolIntegrations.filter(i => i !== integration)
          : [...prev.performance.toolIntegrations, integration]
      }
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an agent.",
        variant: "destructive",
      });
      return;
    }

    if (formData.ownership.nftMintToggle && !isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint as NFT.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call for agent creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Agent Created Successfully!",
        description: formData.ownership.nftMintToggle 
          ? "Your agent has been created and minted as an NFT."
          : "Your agent has been created and added to the marketplace.",
      });

      // Reset form or redirect
      setFormData(initialFormData);
      setCurrentStep(1);
      
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-harmonix-black">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-harmonix-gold mb-6">
              Create Your AI Agent
            </h1>
            <p className="text-harmonix-sage mb-8">
              Please log in to access the agent creation studio.
            </p>
            <Button 
              className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
              onClick={() => window.location.href = "/login"}
            >
              Login to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-harmonix-gold mb-4">
              Agent Creation Studio
            </h1>
            <p className="text-xl text-harmonix-sage max-w-3xl mx-auto">
              Build, customize, and deploy intelligent AI agents. Mint as NFTs to earn royalties from every deployment.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-harmonix-gold text-harmonix-black' : 'bg-harmonix-cedar text-harmonix-sage'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-0.5 ${
                      currentStep > step ? 'bg-harmonix-gold' : 'bg-harmonix-cedar'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="bg-harmonix-night border-harmonix-cedar">
            <CardHeader>
              <CardTitle className="text-harmonix-gold">
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Performance & Integration"}
                {currentStep === 3 && "Ownership & NFT Settings"}
                {currentStep === 4 && "Customization & Visibility"}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="agentName" className="text-harmonix-sage">Agent Name</Label>
                      <Input
                        id="agentName"
                        value={formData.basicInfo.agentName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, agentName: e.target.value }
                        }))}
                        className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                        placeholder="e.g., CA$H, Virgil, Maya"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category" className="text-harmonix-sage">Category</Label>
                      <Select
                        value={formData.basicInfo.category}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, category: value }
                        }))}
                      >
                        <SelectTrigger className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tagline" className="text-harmonix-sage">Agent Role/Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.basicInfo.tagline}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, tagline: e.target.value }
                      }))}
                      className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      placeholder="e.g., Sales Strategist, Brand Designer, HR Coordinator"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="monthlyMRR" className="text-harmonix-sage">Monthly Price ($)</Label>
                      <Input
                        id="monthlyMRR"
                        type="number"
                        min="444"
                        value={formData.basicInfo.monthlyMRR}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, monthlyMRR: parseInt(e.target.value) || 444 }
                        }))}
                        className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      />
                      <p className="text-xs text-harmonix-sage mt-1">Minimum $444/month</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="agentType" className="text-harmonix-sage">Setup Type</Label>
                      <Select
                        value={formData.basicInfo.agentType}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, agentType: value }
                        }))}
                      >
                        <SelectTrigger className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Base Setup">Base Setup</SelectItem>
                          <SelectItem value="Custom Setup">Custom Setup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="tokenUse" className="text-harmonix-sage">Token Usage</Label>
                      <Select
                        value={formData.basicInfo.tokenUseEstimate}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, tokenUseEstimate: value }
                        }))}
                      >
                        <SelectTrigger className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Performance & Integration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="timeSaved" className="text-harmonix-sage">Average Time Saved (hours/week)</Label>
                      <Input
                        id="timeSaved"
                        type="number"
                        value={formData.performance.avgTimeSaved}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          performance: { ...prev.performance, avgTimeSaved: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="roi" className="text-harmonix-sage">Average ROI (%)</Label>
                      <Input
                        id="roi"
                        type="number"
                        value={formData.performance.avgROI}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          performance: { ...prev.performance, avgROI: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-harmonix-sage">Tool Integrations</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {availableIntegrations.map((integration) => (
                        <Badge
                          key={integration}
                          variant={formData.performance.toolIntegrations.includes(integration) ? "default" : "outline"}
                          className={`cursor-pointer text-center py-2 ${
                            formData.performance.toolIntegrations.includes(integration)
                              ? "bg-harmonix-gold text-harmonix-black"
                              : "border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
                          }`}
                          onClick={() => handleIntegrationToggle(integration)}
                        >
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="useCases" className="text-harmonix-sage">Example Use Cases (one per line)</Label>
                    <Textarea
                      id="useCases"
                      rows={4}
                      value={formData.performance.exampleUseCases.join('\n')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        performance: { ...prev.performance, exampleUseCases: e.target.value.split('\n').filter(Boolean) }
                      }))}
                      className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      placeholder="Lead qualification&#10;Follow-up sequences&#10;CRM automation"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Ownership & NFT Settings */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  
                  {/* Wallet Connection */}
                  <Card className="bg-harmonix-black border-harmonix-cedar">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-harmonix-gold font-semibold">Wallet Connection</h3>
                          <p className="text-harmonix-sage text-sm">
                            {isWalletConnected ? "Wallet connected successfully" : "Connect wallet to enable NFT minting"}
                          </p>
                        </div>
                        <Button
                          onClick={handleWalletConnect}
                          disabled={isWalletConnected}
                          variant={isWalletConnected ? "outline" : "default"}
                          className={isWalletConnected 
                            ? "border-green-500 text-green-400"
                            : "bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                          }
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          {isWalletConnected ? "Connected" : "Connect Wallet"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* NFT Minting Toggle */}
                  <div className="flex items-center justify-between p-4 bg-harmonix-black border border-harmonix-cedar rounded-lg">
                    <div>
                      <Label className="text-harmonix-gold font-semibold">Enable NFT Minting</Label>
                      <p className="text-harmonix-sage text-sm">
                        Mint your agent as an NFT for ownership verification and royalty tracking
                      </p>
                    </div>
                    <Switch
                      checked={formData.ownership.nftMintToggle}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        ownership: { ...prev.ownership, nftMintToggle: checked }
                      }))}
                      disabled={!isWalletConnected}
                    />
                  </div>
                  
                  {formData.ownership.nftMintToggle && (
                    <div>
                      <Label htmlFor="nftName" className="text-harmonix-sage">NFT Name</Label>
                      <Input
                        id="nftName"
                        value={formData.ownership.nftName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ownership: { ...prev.ownership, nftName: e.target.value }
                        }))}
                        className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                        placeholder="e.g., CA$H Sales Agent NFT"
                      />
                    </div>
                  )}
                  
                  {/* Royalty Split */}
                  <div>
                    <Label className="text-harmonix-sage">Royalty Split Configuration</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label className="text-xs text-harmonix-sage">Creator (%)</Label>
                        <Input
                          type="number"
                          min="50"
                          max="90"
                          value={formData.ownership.royaltySplit.creator}
                          onChange={(e) => {
                            const creator = parseInt(e.target.value) || 70;
                            const remaining = 100 - creator;
                            const platform = Math.min(30, remaining);
                            const investor = remaining - platform;
                            
                            setFormData(prev => ({
                              ...prev,
                              ownership: {
                                ...prev.ownership,
                                royaltySplit: { creator, platform, investorSplit: investor }
                              }
                            }));
                          }}
                          className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-harmonix-sage">Platform (%)</Label>
                        <Input
                          type="number"
                          value={formData.ownership.royaltySplit.platform}
                          disabled
                          className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-harmonix-sage">NFT Holder (%)</Label>
                        <Input
                          type="number"
                          value={formData.ownership.royaltySplit.investorSplit}
                          disabled
                          className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Customization & Visibility */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="description" className="text-harmonix-sage">Agent Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={formData.customization.description}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customization: { ...prev.customization, description: e.target.value }
                      }))}
                      className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      placeholder="Detailed description of your agent's capabilities and benefits..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="targetPersona" className="text-harmonix-sage">Target Persona</Label>
                    <Input
                      id="targetPersona"
                      value={formData.customization.targetPersona}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customization: { ...prev.customization, targetPersona: e.target.value }
                      }))}
                      className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      placeholder="e.g., SMB Coach, Clinic Admin, E-commerce Owner"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="demoLink" className="text-harmonix-sage">Demo Preview Link (Optional)</Label>
                    <Input
                      id="demoLink"
                      type="url"
                      value={formData.customization.agentPreviewDemoLink}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        customization: { ...prev.customization, agentPreviewDemoLink: e.target.value }
                      }))}
                      className="bg-harmonix-black border-harmonix-cedar text-harmonix-sage"
                      placeholder="https://..."
                    />
                  </div>
                  
                  {/* Visibility Settings */}
                  <div className="space-y-4">
                    <Label className="text-harmonix-sage">Visibility Settings</Label>
                    
                    <div className="flex items-center justify-between p-3 bg-harmonix-black border border-harmonix-cedar rounded">
                      <div>
                        <div className="font-medium text-harmonix-gold">Public Listing</div>
                        <div className="text-sm text-harmonix-sage">Make agent visible in marketplace</div>
                      </div>
                      <Switch
                        checked={formData.visibility.public}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          visibility: { ...prev.visibility, public: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-harmonix-black border border-harmonix-cedar rounded">
                      <div>
                        <div className="font-medium text-harmonix-gold">Leaderboard Display</div>
                        <div className="text-sm text-harmonix-sage">Show in top agents ranking</div>
                      </div>
                      <Switch
                        checked={formData.visibility.displayOnLeaderboard}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          visibility: { ...prev.visibility, displayOnLeaderboard: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="border-harmonix-cedar text-harmonix-sage"
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                  >
                    {isSubmitting ? "Creating..." : "Create Agent"}
                    {formData.ownership.nftMintToggle && <Award className="w-4 h-4 ml-2" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Creation Summary */}
          {currentStep === 4 && (
            <Card className="bg-harmonix-night border-harmonix-cedar mt-8">
              <CardHeader>
                <CardTitle className="text-harmonix-gold">Creation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-harmonix-gold mb-2">Agent Details</h4>
                    <div className="space-y-1 text-sm text-harmonix-sage">
                      <div>Name: {formData.basicInfo.agentName || "Not set"}</div>
                      <div>Category: {formData.basicInfo.category || "Not set"}</div>
                      <div>Monthly Price: ${formData.basicInfo.monthlyMRR}</div>
                      <div>Time Saved: {formData.performance.avgTimeSaved} hrs/week</div>
                      <div>Integrations: {formData.performance.toolIntegrations.length}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-harmonix-gold mb-2">Monetization</h4>
                    <div className="space-y-1 text-sm text-harmonix-sage">
                      <div>NFT Enabled: {formData.ownership.nftMintToggle ? "Yes" : "No"}</div>
                      <div>Creator Share: {formData.ownership.royaltySplit.creator}%</div>
                      <div>Platform Share: {formData.ownership.royaltySplit.platform}%</div>
                      <div>Public Listing: {formData.visibility.public ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}