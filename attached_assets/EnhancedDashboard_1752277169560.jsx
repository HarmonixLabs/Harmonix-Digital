import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Activity, 
  Users, 
  Zap, 
  TrendingUp, 
  Settings, 
  RefreshCw,
  Crown,
  Coins,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  DollarSign,
  Play,
  Pause,
  Eye,
  EyeOff,
  Shield,
  CreditCard,
  Webhook,
  Database,
  Globe
} from 'lucide-react'

const EnhancedDashboard = () => {
  const { user, organization } = useAuth()
  const [agents, setAgents] = useState([])
  const [metrics, setMetrics] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingAgent, setEditingAgent] = useState(null)
  const [deploymentSettings, setDeploymentSettings] = useState({})

  // Role-based permissions
  const canEditAgents = user?.role === 'admin' || user?.is_founder
  const canManageBilling = user?.role === 'admin' || user?.is_founder
  const canViewAnalytics = user?.role !== 'guest'
  const canDeployAgents = user?.role !== 'guest'

  useEffect(() => {
    fetchDashboardData()
    fetchDeploymentSettings()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [agentsRes, metricsRes] = await Promise.all([
        fetch('/api/admin/agents'),
        fetch('/api/dashboard/metrics')
      ])

      if (agentsRes.ok && metricsRes.ok) {
        const agentsData = await agentsRes.json()
        const metricsData = await metricsRes.json()
        
        setAgents(agentsData.agents)
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeploymentSettings = async () => {
    try {
      const response = await fetch('/api/admin/deployment-settings')
      if (response.ok) {
        const data = await response.json()
        setDeploymentSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch deployment settings:', error)
    }
  }

  const handleAgentUpdate = async (agentId, updates) => {
    if (!canEditAgents) return

    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchDashboardData()
        setEditingAgent(null)
      }
    } catch (error) {
      console.error('Failed to update agent:', error)
    }
  }

  const handleAgentStatusToggle = async (agentId, isActive) => {
    if (!canEditAgents) return

    await handleAgentUpdate(agentId, { 
      status: isActive ? 'active' : 'paused',
      updated_at: new Date().toISOString()
    })
  }

  const handleAgentVisibilityToggle = async (agentId, isVisible) => {
    if (!canEditAgents) return

    await handleAgentUpdate(agentId, { 
      is_marketplace_visible: isVisible,
      updated_at: new Date().toISOString()
    })
  }

  const handlePriceUpdate = async (agentId, newPrice) => {
    if (!canEditAgents) return

    await handleAgentUpdate(agentId, { 
      base_price: parseFloat(newPrice),
      updated_at: new Date().toISOString()
    })
  }

  const handleNameUpdate = async (agentId, newName) => {
    if (!canEditAgents) return

    await handleAgentUpdate(agentId, { 
      name: newName,
      updated_at: new Date().toISOString()
    })
  }

  const handleDeploymentSettingsUpdate = async (settings) => {
    if (!canEditAgents) return

    try {
      const response = await fetch('/api/admin/deployment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setDeploymentSettings(settings)
      }
    } catch (error) {
      console.error('Failed to update deployment settings:', error)
    }
  }

  const AgentControlCard = ({ agent }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
      name: agent.name,
      base_price: agent.base_price,
      description: agent.description
    })

    const handleSave = async () => {
      await handleAgentUpdate(agent.id, editForm)
      setIsEditing(false)
    }

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white font-bold text-lg"
                  />
                  <Input
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
              ) : (
                <div>
                  <CardTitle className="text-white flex items-center">
                    {agent.name}
                    {agent.is_harmony_core && (
                      <Crown className="h-4 w-4 ml-2 text-yellow-400" />
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {agent.description}
                  </CardDescription>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Badge className={`${agent.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>
                {agent.status}
              </Badge>
              {canEditAgents && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (isEditing) {
                      handleSave()
                    } else {
                      setIsEditing(true)
                    }
                  }}
                  className="border-slate-600 text-slate-200"
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Agent Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Status</label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={agent.status === 'active'}
                  onCheckedChange={(checked) => handleAgentStatusToggle(agent.id, checked)}
                  disabled={!canEditAgents}
                />
                <span className="text-sm text-slate-400">
                  {agent.status === 'active' ? 'Live' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Visibility Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Marketplace</label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={agent.is_marketplace_visible}
                  onCheckedChange={(checked) => handleAgentVisibilityToggle(agent.id, checked)}
                  disabled={!canEditAgents}
                />
                <span className="text-sm text-slate-400">
                  {agent.is_marketplace_visible ? (
                    <><Eye className="h-4 w-4 inline mr-1" />Visible</>
                  ) : (
                    <><EyeOff className="h-4 w-4 inline mr-1" />Hidden</>
                  )}
                </span>
              </div>
            </div>

            {/* Price Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Base Price</label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    value={editForm.base_price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, base_price: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              ) : (
                <div className="text-lg font-bold text-white">
                  ${agent.base_price}/mo
                </div>
              )}
            </div>
          </div>

          {/* Agent Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {agent.total_deployments?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-400">Deployments</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                ${agent.total_revenue?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-slate-400">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">
                {agent.average_rating || 0}★
              </div>
              <div className="text-xs text-slate-400">Rating</div>
            </div>
          </div>

          {/* Webhook Status */}
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <Webhook className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white">Webhook Status</span>
            </div>
            <Badge className="bg-green-600">
              Connected
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Role-based Actions */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Harmony Control Center
          </h1>
          <p className="text-purple-200">
            {organization?.name} • {user?.role?.toUpperCase()} Access
          </p>
        </div>
        
        <div className="flex gap-3">
          {canEditAgents && (
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
            </Button>
          )}
          
          {canManageBilling && (
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing & Payments
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${metrics.total_revenue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-slate-400">
              +{metrics.revenue_growth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Deployments</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.active_deployments?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-slate-400">
              Across {metrics.active_organizations || 0} organizations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Monthly Interactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.monthly_interactions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-slate-400">
              {metrics.success_rate || 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Platform Health</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {metrics.uptime_percentage || 99.9}%
            </div>
            <p className="text-xs text-slate-400">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="agents">Agent Control</TabsTrigger>
          {canViewAnalytics && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
          {canManageBilling && <TabsTrigger value="billing">Billing & Payments</TabsTrigger>}
          {canEditAgents && <TabsTrigger value="settings">Platform Settings</TabsTrigger>}
        </TabsList>

        {/* Agent Control Tab */}
        <TabsContent value="agents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Agent Management</h2>
            {canEditAgents && (
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-600 text-slate-200">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All Agents
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Deploy New Agent
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <AgentControlCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        {canViewAnalytics && (
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  Detailed insights into agent performance and revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Advanced analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Billing & Payments Tab */}
        {canManageBilling && (
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stripe Integration */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
                    Stripe Integration
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Payment processing and subscription management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-white">Stripe Status</span>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-white">GoHighLevel Sync</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Configure Payment Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Revenue Overview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                    Revenue Overview
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Monthly recurring revenue and growth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">MRR</span>
                      <span className="text-white font-bold">${metrics.mrr?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ARR</span>
                      <span className="text-white font-bold">${(metrics.mrr * 12)?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Growth Rate</span>
                      <span className="text-green-400 font-bold">+{metrics.growth_rate || 0}%</span>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    View Detailed Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Platform Settings Tab */}
        {canEditAgents && (
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deployment Settings */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-purple-400" />
                    Deployment Settings
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Global platform configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Default Token Allocation</label>
                    <Input
                      type="number"
                      value={deploymentSettings.default_tokens || 1000}
                      onChange={(e) => setDeploymentSettings(prev => ({ 
                        ...prev, 
                        default_tokens: parseInt(e.target.value) 
                      }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Auto-deployment</label>
                    <Switch
                      checked={deploymentSettings.auto_deploy || false}
                      onCheckedChange={(checked) => setDeploymentSettings(prev => ({ 
                        ...prev, 
                        auto_deploy: checked 
                      }))}
                    />
                  </div>

                  <Button 
                    onClick={() => handleDeploymentSettingsUpdate(deploymentSettings)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Save Settings
                  </Button>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-400" />
                    System Health
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Platform status and monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Database</span>
                      <Badge className="bg-green-600">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Pipedream Webhooks</span>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Stripe API</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">GoHighLevel Sync</span>
                      <Badge className="bg-green-600">Synced</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Run System Diagnostics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default EnhancedDashboard

