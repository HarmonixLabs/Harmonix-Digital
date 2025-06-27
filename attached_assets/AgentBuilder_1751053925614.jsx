import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bot, 
  Wand2, 
  Save, 
  Play, 
  Settings, 
  MessageSquare, 
  Brain, 
  Zap,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload
} from 'lucide-react';

const AgentBuilder = () => {
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    category: '',
    prompt_template: '',
    model_config: {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1.0
    },
    capabilities: [],
    integrations: [],
    personality: {
      tone: 'professional',
      style: 'helpful',
      expertise_level: 'expert'
    },
    context_settings: {
      max_context_length: 10000,
      auto_save_interval: 5,
      thread_inheritance: true
    }
  });

  const [availableCapabilities] = useState([
    'text_generation', 'data_analysis', 'email_automation', 'calendar_management',
    'crm_integration', 'social_media', 'content_creation', 'lead_generation',
    'customer_support', 'project_management', 'financial_analysis', 'reporting'
  ]);

  const [availableIntegrations] = useState([
    'salesforce', 'hubspot', 'gmail', 'outlook', 'slack', 'teams',
    'zapier', 'stripe', 'quickbooks', 'google_calendar', 'zoom', 'linkedin'
  ]);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewMessages, setPreviewMessages] = useState([]);
  const [previewInput, setPreviewInput] = useState('');

  const handleConfigChange = (section, field, value) => {
    setAgentConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCapabilityToggle = (capability) => {
    setAgentConfig(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capability)
        ? prev.capabilities.filter(c => c !== capability)
        : [...prev.capabilities, capability]
    }));
  };

  const handleIntegrationToggle = (integration) => {
    setAgentConfig(prev => ({
      ...prev,
      integrations: prev.integrations.includes(integration)
        ? prev.integrations.filter(i => i !== integration)
        : [...prev.integrations, integration]
    }));
  };

  const handleSaveAgent = async () => {
    try {
      // Save agent configuration
      console.log('Saving agent:', agentConfig);
      // API call would go here
    } catch (error) {
      console.error('Failed to save agent:', error);
    }
  };

  const handleTestAgent = () => {
    setIsPreviewMode(true);
    setPreviewMessages([
      {
        role: 'assistant',
        content: `Hello! I'm ${agentConfig.name || 'your AI agent'}. ${agentConfig.description || 'I\'m here to help you with various tasks.'} How can I assist you today?`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handlePreviewMessage = () => {
    if (!previewInput.trim()) return;

    const userMessage = {
      role: 'user',
      content: previewInput,
      timestamp: new Date().toISOString()
    };

    // Simulate AI response based on agent configuration
    const aiResponse = {
      role: 'assistant',
      content: generatePreviewResponse(previewInput, agentConfig),
      timestamp: new Date().toISOString()
    };

    setPreviewMessages(prev => [...prev, userMessage, aiResponse]);
    setPreviewInput('');
  };

  const generatePreviewResponse = (input, config) => {
    const responses = {
      professional: "I understand your request. Let me provide you with a comprehensive solution based on my analysis.",
      friendly: "Great question! I'd be happy to help you with that. Here's what I recommend:",
      casual: "Sure thing! Let me break this down for you in a way that makes sense."
    };

    const baseResponse = responses[config.personality?.tone] || responses.professional;
    
    if (config.capabilities.includes('data_analysis')) {
      return `${baseResponse} Based on my data analysis capabilities, I can process this information and provide detailed insights.`;
    } else if (config.capabilities.includes('content_creation')) {
      return `${baseResponse} With my content creation expertise, I can help you craft compelling and engaging material.`;
    } else {
      return `${baseResponse} I'll use my specialized knowledge to address your needs effectively.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Agent Builder
              </h1>
              <p className="text-slate-400 text-lg">Create and customize your AI agents with advanced thread inheritance</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={handleSaveAgent}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Agent
            </Button>
            <Button 
              onClick={handleTestAgent}
              variant="outline"
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Test Agent
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
                <TabsTrigger value="basic" className="data-[state=active]:bg-emerald-600">Basic</TabsTrigger>
                <TabsTrigger value="prompt" className="data-[state=active]:bg-emerald-600">Prompt</TabsTrigger>
                <TabsTrigger value="capabilities" className="data-[state=active]:bg-emerald-600">Capabilities</TabsTrigger>
                <TabsTrigger value="personality" className="data-[state=active]:bg-emerald-600">Personality</TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-emerald-600">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Configuration */}
              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>Define your agent's core identity and purpose</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="agent-name">Agent Name</Label>
                      <Input
                        id="agent-name"
                        placeholder="e.g., Sales Assistant Pro"
                        value={agentConfig.name}
                        onChange={(e) => setAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="agent-description">Description</Label>
                      <Textarea
                        id="agent-description"
                        placeholder="Describe what your agent does and how it helps users..."
                        value={agentConfig.description}
                        onChange={(e) => setAgentConfig(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="agent-category">Category</Label>
                      <Select value={agentConfig.category} onValueChange={(value) => setAgentConfig(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="support">Customer Support</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Prompt Configuration */}
              <TabsContent value="prompt" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Prompt Template
                    </CardTitle>
                    <CardDescription>Define how your agent thinks and responds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="You are a professional AI assistant specialized in... Your role is to... When responding, you should..."
                      value={agentConfig.prompt_template}
                      onChange={(e) => setAgentConfig(prev => ({ ...prev, prompt_template: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white min-h-[300px] font-mono"
                    />
                    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                      <h4 className="text-sm font-medium text-emerald-400 mb-2">💡 Prompt Tips:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Be specific about the agent's role and expertise</li>
                        <li>• Include examples of desired behavior</li>
                        <li>• Specify the tone and communication style</li>
                        <li>• Define boundaries and limitations</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Capabilities */}
              <TabsContent value="capabilities" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Capabilities & Integrations
                    </CardTitle>
                    <CardDescription>Select what your agent can do and which services it can connect to</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-3">Capabilities</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {availableCapabilities.map(capability => (
                          <div key={capability} className="flex items-center space-x-2">
                            <Switch
                              id={capability}
                              checked={agentConfig.capabilities.includes(capability)}
                              onCheckedChange={() => handleCapabilityToggle(capability)}
                            />
                            <Label htmlFor={capability} className="text-sm">
                              {capability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-3">Integrations</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {availableIntegrations.map(integration => (
                          <div key={integration} className="flex items-center space-x-2">
                            <Switch
                              id={integration}
                              checked={agentConfig.integrations.includes(integration)}
                              onCheckedChange={() => handleIntegrationToggle(integration)}
                            />
                            <Label htmlFor={integration} className="text-sm">
                              {integration.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Personality */}
              <TabsContent value="personality" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Personality & Behavior
                    </CardTitle>
                    <CardDescription>Shape how your agent communicates and behaves</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Communication Tone</Label>
                      <Select 
                        value={agentConfig.personality.tone} 
                        onValueChange={(value) => handleConfigChange('personality', 'tone', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Response Style</Label>
                      <Select 
                        value={agentConfig.personality.style} 
                        onValueChange={(value) => handleConfigChange('personality', 'style', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="helpful">Helpful</SelectItem>
                          <SelectItem value="analytical">Analytical</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="concise">Concise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Expertise Level</Label>
                      <Select 
                        value={agentConfig.personality.expertise_level} 
                        onValueChange={(value) => handleConfigChange('personality', 'expertise_level', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="beginner">Beginner-friendly</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Advanced Configuration
                    </CardTitle>
                    <CardDescription>Fine-tune model parameters and thread inheritance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-3">Model Configuration</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Model</Label>
                          <Select 
                            value={agentConfig.model_config.model} 
                            onValueChange={(value) => handleConfigChange('model_config', 'model', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="claude-3">Claude 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Temperature: {agentConfig.model_config.temperature}</Label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={agentConfig.model_config.temperature}
                            onChange={(e) => handleConfigChange('model_config', 'temperature', parseFloat(e.target.value))}
                            className="w-full mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-3">Thread Inheritance Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Enable Thread Inheritance</Label>
                            <p className="text-sm text-slate-400">Allow new threads to inherit context from parent threads</p>
                          </div>
                          <Switch
                            checked={agentConfig.context_settings.thread_inheritance}
                            onCheckedChange={(value) => handleConfigChange('context_settings', 'thread_inheritance', value)}
                          />
                        </div>

                        <div>
                          <Label>Max Context Length: {agentConfig.context_settings.max_context_length}</Label>
                          <input
                            type="range"
                            min="1000"
                            max="20000"
                            step="1000"
                            value={agentConfig.context_settings.max_context_length}
                            onChange={(e) => handleConfigChange('context_settings', 'max_context_length', parseInt(e.target.value))}
                            className="w-full mt-2"
                          />
                        </div>

                        <div>
                          <Label>Auto-save Interval: {agentConfig.context_settings.auto_save_interval} messages</Label>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            step="1"
                            value={agentConfig.context_settings.auto_save_interval}
                            onChange={(e) => handleConfigChange('context_settings', 'auto_save_interval', parseInt(e.target.value))}
                            className="w-full mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 h-fit sticky top-8">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Agent Preview
                </CardTitle>
                <CardDescription>Test your agent configuration in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                {!isPreviewMode ? (
                  <div className="text-center py-8">
                    <Bot className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">Click "Test Agent" to start a preview conversation</p>
                    <Button 
                      onClick={handleTestAgent}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Test Agent
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-900 rounded-lg">
                      {previewMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-700 text-slate-100'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={previewInput}
                        onChange={(e) => setPreviewInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePreviewMessage()}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Button 
                        onClick={handlePreviewMessage}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Send
                      </Button>
                    </div>

                    <Button 
                      onClick={() => setIsPreviewMode(false)}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-400 hover:bg-slate-700"
                    >
                      Close Preview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;

