import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Plus, 
  Save, 
  Play, 
  Upload, 
  Download, 
  Settings, 
  Code, 
  Zap, 
  Brain,
  Palette,
  DollarSign,
  Share,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react'

const CreatorStudio = () => {
  const { user } = useAuth()
  const [myAgents, setMyAgents] = useState([])
  const [activeAgent, setActiveAgent] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  // Agent creation form state
  const [agentForm, setAgentForm] = useState({
    name: '',
    role: '',
    description: '',
    core_powers: [''],
    superpowers: [''],
    demo_trigger: '',
    category: 'automation',
    webhook_url: '',
    pricing_tiers: [
      { name: 'Starter', price: 99, features: [''] },
      { name: 'Professional', price: 199, features: [''] },
      { name: 'Enterprise', price: 399, features: [''] }
    ],
    vault_share_percentage: 33
  })

  useEffect(() => {
    fetchMyAgents()
  }, [])

  const fetchMyAgents = async () => {
    try {
      const response = await fetch('/api/creator/agents')
      if (response.ok) {
        const data = await response.json()
        setMyAgents(data.agents)
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setActiveAgent(null)
    setAgentForm({
      name: '',
      role: '',
      description: '',
      core_powers: [''],
      superpowers: [''],
      demo_trigger: '',
      category: 'automation',
      webhook_url: '',
      pricing_tiers: [
        { name: 'Starter', price: 99, features: [''] },
        { name: 'Professional', price: 199, features: [''] },
        { name: 'Enterprise', price: 399, features: [''] }
      ],
      vault_share_percentage: 33
    })
  }

  const handleEditAgent = (agent) => {
    setActiveAgent(agent)
    setIsCreating(true)
    setAgentForm({
      ...agent,
      core_powers: agent.core_powers || [''],
      superpowers: agent.superpowers || [''],
      pricing_tiers: agent.pricing_tiers || [
        { name: 'Starter', price: 99, features: [''] },
        { name: 'Professional', price: 199, features: [''] },
        { name: 'Enterprise', price: 399, features: [''] }
      ]
    })
  }

  const handleSaveAgent = async () => {
    try {
      const url = activeAgent ? `/api/creator/agents/${activeAgent.id}` : '/api/creator/agents'
      const method = activeAgent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentForm)
      })

      if (response.ok) {
        await fetchMyAgents()
        setIsCreating(false)
        setActiveAgent(null)
      }
    } catch (error) {
      console.error('Failed to save agent:', error)
    }
  }

  const handleTestAgent = async () => {
    try {
      const response = await fetch('/api/creator/test-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhook_url: agentForm.webhook_url,
          test_input: { task: 'test', message: 'Hello, this is a test' }
        })
      })

      const result = await response.json()
      alert(`Test Result: ${result.success ? 'Success' : 'Failed'}\n${result.message}`)
    } catch (error) {
      alert('Test failed: ' + error.message)
    }
  }

  const addArrayField = (field) => {
    setAgentForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateArrayField = (field, index, value) => {
    setAgentForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeArrayField = (field, index) => {
    setAgentForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const categories = [
    'automation', 'sales', 'content', 'support', 'productivity', 'analytics', 'design', 'finance'
  ]

  if (!user?.is_creator) {
    return (
      <div className="text-center py-12">
        <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Creator Access Required</h2>
        <p className="text-slate-400 mb-6">
          You need creator permissions to access the Agent Builder Studio.
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Apply for Creator Access
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            {activeAgent ? 'Edit Agent' : 'Create New Agent'}
          </h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsCreating(false)}
              className="border-slate-600 text-slate-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTestAgent}
              variant="outline"
              className="border-purple-400 text-purple-400"
            >
              <Play className="h-4 w-4 mr-2" />
              Test Agent
            </Button>
            <Button 
              onClick={handleSaveAgent}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Agent
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Define your agent's identity and purpose
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Agent Name</label>
                    <Input
                      value={agentForm.name}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., ECHO, FLOW, CASH"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Role</label>
                    <Input
                      value={agentForm.role}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., AI Sales Closer, Content Creator"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Description</label>
                  <Textarea
                    value={agentForm.description}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your agent does and how it helps users..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Category</label>
                    <select
                      value={agentForm.category}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Demo Trigger</label>
                    <Input
                      value={agentForm.demo_trigger}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, demo_trigger: e.target.value }))}
                      placeholder="e.g., Help me create content"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capabilities" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Agent Capabilities</CardTitle>
                <CardDescription className="text-slate-400">
                  Define what your agent can do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-white">Core Powers</label>
                    <Button 
                      size="sm" 
                      onClick={() => addArrayField('core_powers')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {agentForm.core_powers.map((power, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={power}
                        onChange={(e) => updateArrayField('core_powers', index, e.target.value)}
                        placeholder="Describe a core capability..."
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      {agentForm.core_powers.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => removeArrayField('core_powers', index)}
                          className="border-red-500 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-white">Superpowers</label>
                    <Button 
                      size="sm" 
                      onClick={() => addArrayField('superpowers')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {agentForm.superpowers.map((power, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={power}
                        onChange={(e) => updateArrayField('superpowers', index, e.target.value)}
                        placeholder="Describe an advanced capability..."
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      {agentForm.superpowers.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => removeArrayField('superpowers', index)}
                          className="border-red-500 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Technical Configuration</CardTitle>
                <CardDescription className="text-slate-400">
                  Connect your agent to external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Webhook URL</label>
                  <Input
                    value={agentForm.webhook_url}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, webhook_url: e.target.value }))}
                    placeholder="https://your-webhook-url.com/endpoint"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    This is where Harmony will send requests to your agent
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Vault Share Percentage
                  </label>
                  <select
                    value={agentForm.vault_share_percentage}
                    onChange={(e) => setAgentForm(prev => ({ ...prev, vault_share_percentage: parseInt(e.target.value) }))}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value={8}>8% - High Volume</option>
                    <option value={17}>17% - Standard</option>
                    <option value={33}>33% - Premium</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-1">
                    Revenue share percentage for Harmony platform
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Pricing Tiers</CardTitle>
                <CardDescription className="text-slate-400">
                  Set up pricing for your agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {agentForm.pricing_tiers.map((tier, tierIndex) => (
                  <div key={tierIndex} className="p-4 bg-slate-700 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Tier Name</label>
                        <Input
                          value={tier.name}
                          onChange={(e) => {
                            const newTiers = [...agentForm.pricing_tiers]
                            newTiers[tierIndex].name = e.target.value
                            setAgentForm(prev => ({ ...prev, pricing_tiers: newTiers }))
                          }}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Price ($)</label>
                        <Input
                          type="number"
                          value={tier.price}
                          onChange={(e) => {
                            const newTiers = [...agentForm.pricing_tiers]
                            newTiers[tierIndex].price = parseInt(e.target.value)
                            setAgentForm(prev => ({ ...prev, pricing_tiers: newTiers }))
                          }}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-white">Features</label>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const newTiers = [...agentForm.pricing_tiers]
                            newTiers[tierIndex].features.push('')
                            setAgentForm(prev => ({ ...prev, pricing_tiers: newTiers }))
                          }}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2 mb-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newTiers = [...agentForm.pricing_tiers]
                              newTiers[tierIndex].features[featureIndex] = e.target.value
                              setAgentForm(prev => ({ ...prev, pricing_tiers: newTiers }))
                            }}
                            placeholder="Feature description..."
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                          {tier.features.length > 1 && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const newTiers = [...agentForm.pricing_tiers]
                                newTiers[tierIndex].features.splice(featureIndex, 1)
                                setAgentForm(prev => ({ ...prev, pricing_tiers: newTiers }))
                              }}
                              className="border-red-500 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Creator Studio</h1>
          <p className="text-purple-200">Build and manage your AI agents</p>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      {myAgents.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No agents created yet</h3>
            <p className="text-slate-400 mb-6">
              Start building your first AI agent to join the Harmony marketplace
            </p>
            <Button 
              onClick={handleCreateNew}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAgents.map((agent) => (
            <Card key={agent.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{agent.name}</CardTitle>
                    <CardDescription className="text-slate-400">{agent.role}</CardDescription>
                  </div>
                  <Badge className={`${agent.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}`}>
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300">{agent.description}</p>
                
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{agent.total_deployments || 0} deployments</span>
                  <span>${agent.total_revenue || 0} earned</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditAgent(agent)}
                    className="flex-1 border-slate-600 text-slate-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-slate-600 text-slate-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-slate-600 text-slate-200"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CreatorStudio

