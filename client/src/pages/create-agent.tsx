import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Upload, 
  Palette, 
  Brain, 
  Settings, 
  DollarSign, 
  Star,
  Zap,
  Shield,
  Gem,
  Crown,
  Sparkles,
  Save,
  Eye,
  Rocket
} from 'lucide-react';
import { Link } from 'wouter';

const CATEGORIES = ['Sales', 'Marketing', 'Customer Service', 'HR', 'Operations', 'Finance', 'Development', 'Creative'];
const RARITY_OPTIONS = [
  { value: 'common', label: 'Common', color: 'bg-slate-500', icon: Shield },
  { value: 'rare', label: 'Rare', color: 'bg-blue-500', icon: Sparkles },
  { value: 'epic', label: 'Epic', color: 'bg-purple-500', icon: Gem },
  { value: 'legendary', label: 'Legendary', color: 'bg-yellow-500', icon: Crown }
];

const PRICING_TEMPLATES = [
  { name: 'Basic Agent', monthly: 97, setup: 500, description: 'Simple automation tasks' },
  { name: 'Professional Agent', monthly: 297, setup: 1500, description: 'Advanced workflows and integrations' },
  { name: 'Enterprise Agent', monthly: 497, setup: 2500, description: 'Complex business logic and AI' },
  { name: 'Custom Pricing', monthly: 0, setup: 0, description: 'Set your own rates' }
];

interface AgentForm {
  name: string;
  description: string;
  category: string;
  avatar: string;
  features: string[];
  pricing: {
    monthly: number;
    setup: number;
    nftPrice: number;
    royalty: number;
  };
  rarity: string;
  tags: string[];
  prompt: string;
  integrations: string[];
}

export default function CreateAgent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AgentForm>({
    name: '',
    description: '',
    category: '',
    avatar: '🤖',
    features: [],
    pricing: {
      monthly: 297,
      setup: 1500,
      nftPrice: 0.1,
      royalty: 10
    },
    rarity: 'common',
    tags: [],
    prompt: '',
    integrations: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handlePricingTemplate = (template: typeof PRICING_TEMPLATES[0]) => {
    if (template.name !== 'Custom Pricing') {
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          monthly: template.monthly,
          setup: template.setup
        }
      }));
    }
  };

  const getRarityDetails = (rarity: string) => {
    return RARITY_OPTIONS.find(r => r.value === rarity) || RARITY_OPTIONS[0];
  };

  const handleSubmit = () => {
    // Here you would submit to your API
    console.log('Creating agent:', formData);
    // Navigate to success page or back to marketplace
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-emerald-100 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-emerald-100">Agent Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Sales Automation Pro"
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-emerald-100">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-emerald-100">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category} className="text-emerald-100">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-emerald-100">Avatar (Emoji)</Label>
                    <Input
                      value={formData.avatar}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="🤖"
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-emerald-100">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your agent does and its key capabilities..."
                    rows={6}
                    className="bg-slate-800/50 border-slate-600 text-emerald-100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-emerald-100 mb-4">Features & Capabilities</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-emerald-100">Add Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="e.g., Lead Processing"
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button onClick={addFeature} className="bg-emerald-600 hover:bg-emerald-700">
                      Add
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-emerald-100">Current Features</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="bg-emerald-600/20 text-emerald-100 cursor-pointer hover:bg-red-600/20"
                        onClick={() => removeFeature(feature)}
                      >
                        {feature} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-emerald-100">Add Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="e.g., automation"
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} className="bg-emerald-600 hover:bg-emerald-700">
                      Add
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-emerald-100">Current Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-emerald-400/50 text-emerald-100 cursor-pointer hover:border-red-400/50"
                        onClick={() => removeTag(tag)}
                      >
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-emerald-100 mb-4">Pricing & Monetization</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-emerald-100 mb-3 block">Pricing Templates</Label>
                  <div className="space-y-2">
                    {PRICING_TEMPLATES.map((template) => (
                      <Card
                        key={template.name}
                        className="bg-slate-800/50 border-slate-600 cursor-pointer hover:border-emerald-400/50 transition-colors"
                        onClick={() => handlePricingTemplate(template)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-emerald-100 font-semibold">{template.name}</h4>
                              <p className="text-slate-400 text-sm">{template.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-400 font-semibold">
                                {template.monthly > 0 ? `$${template.monthly}/mo` : 'Custom'}
                              </div>
                              {template.setup > 0 && (
                                <div className="text-slate-400 text-sm">Setup: ${template.setup}</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-emerald-100">Monthly Price ($)</Label>
                    <Input
                      type="number"
                      value={formData.pricing.monthly}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, monthly: Number(e.target.value) }
                      }))}
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-emerald-100">Setup Fee ($)</Label>
                    <Input
                      type="number"
                      value={formData.pricing.setup}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, setup: Number(e.target.value) }
                      }))}
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-emerald-100">NFT Price (ETH)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.pricing.nftPrice}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, nftPrice: Number(e.target.value) }
                      }))}
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-emerald-100">Royalty Percentage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.pricing.royalty}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, royalty: Number(e.target.value) }
                      }))}
                      className="bg-slate-800/50 border-slate-600 text-emerald-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        const rarityDetails = getRarityDetails(formData.rarity);
        const RarityIcon = rarityDetails.icon;
        
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-emerald-100 mb-4">Rarity & AI Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-emerald-100 mb-3 block">Agent Rarity</Label>
                  <div className="space-y-2">
                    {RARITY_OPTIONS.map((rarity) => {
                      const Icon = rarity.icon;
                      return (
                        <Card
                          key={rarity.value}
                          className={`cursor-pointer transition-all ${
                            formData.rarity === rarity.value
                              ? 'border-emerald-400 bg-emerald-400/10'
                              : 'bg-slate-800/50 border-slate-600 hover:border-emerald-400/50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, rarity: rarity.value }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${rarity.color} flex items-center justify-center`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="text-emerald-100 font-semibold">{rarity.label}</h4>
                                <p className="text-slate-400 text-sm">
                                  {rarity.value === 'common' && 'Basic functionality, widely available'}
                                  {rarity.value === 'rare' && 'Enhanced features, limited supply'}
                                  {rarity.value === 'epic' && 'Advanced AI, exclusive capabilities'}
                                  {rarity.value === 'legendary' && 'Cutting-edge AI, ultra-rare'}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <Label className="text-emerald-100">AI Prompt Configuration</Label>
                  <Textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Define your agent's personality, capabilities, and behavior instructions..."
                    rows={10}
                    className="bg-slate-800/50 border-slate-600 text-emerald-100"
                  />
                  <p className="text-slate-400 text-sm mt-2">
                    This prompt will guide your agent's AI behavior and responses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-emerald-400/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-emerald-100 mb-2">Create Agent</h1>
              <p className="text-slate-400">Build and monetize your custom AI agent</p>
            </div>
            
            <Link href="/marketplace">
              <Button variant="outline" className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-20 h-1 mx-2 ${
                      step < currentStep ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className={currentStep >= 1 ? 'text-emerald-100' : 'text-slate-400'}>
              <h4 className="font-semibold">Basic Info</h4>
              <p className="text-sm">Name, category, description</p>
            </div>
            <div className={currentStep >= 2 ? 'text-emerald-100' : 'text-slate-400'}>
              <h4 className="font-semibold">Features</h4>
              <p className="text-sm">Capabilities and tags</p>
            </div>
            <div className={currentStep >= 3 ? 'text-emerald-100' : 'text-slate-400'}>
              <h4 className="font-semibold">Pricing</h4>
              <p className="text-sm">Monetization setup</p>
            </div>
            <div className={currentStep >= 4 ? 'text-emerald-100' : 'text-slate-400'}>
              <h4 className="font-semibold">AI Config</h4>
              <p className="text-sm">Rarity and behavior</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Content */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                {renderStepContent()}
                
                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
                  >
                    Previous
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Create Agent
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-emerald-100">Agent Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{formData.avatar}</div>
                  <div>
                    <h3 className="text-emerald-100 font-semibold">
                      {formData.name || 'Agent Name'}
                    </h3>
                    <Badge className={`${getRarityDetails(formData.rarity).color} text-white`}>
                      {getRarityDetails(formData.rarity).label}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm">
                  {formData.description || 'Agent description will appear here...'}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Monthly:</span>
                    <span className="text-emerald-400 font-semibold">
                      ${formData.pricing.monthly}/month
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Setup:</span>
                    <span className="text-emerald-400">
                      ${formData.pricing.setup}
                    </span>
                  </div>
                  {formData.pricing.nftPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">NFT:</span>
                      <span className="text-emerald-400">
                        {formData.pricing.nftPrice} ETH
                      </span>
                    </div>
                  )}
                </div>
                
                {formData.features.length > 0 && (
                  <div>
                    <h4 className="text-emerald-100 text-sm font-semibold mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                          {feature}
                        </Badge>
                      ))}
                      {formData.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                          +{formData.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-emerald-100 text-sm">Creator Economy Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Higher rarity agents command premium pricing</span>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>NFT royalties provide ongoing passive income</span>
                </div>
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Detailed prompts improve agent performance</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}