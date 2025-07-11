import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
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
  AlertTriangle
} from 'lucide-react'

const Dashboard = () => {
  const { user, organization } = useAuth()
  const [agentInstances, setAgentInstances] = useState([])
  const [metrics, setMetrics] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [instancesRes, metricsRes] = await Promise.all([
        fetch('/api/agents/instances'),
        fetch('/api/dashboard/metrics')
      ])

      if (instancesRes.ok && metricsRes.ok) {
        const instancesData = await instancesRes.json()
        const metricsData = await metricsRes.json()
        
        setAgentInstances(instancesData.instances)
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelfHeal = async () => {
    if (!user?.is_founder) return
    
    setRefreshing(true)
    try {
      const response = await fetch('/api/organization/self-heal', {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchDashboardData()
        // Show success message
      }
    } catch (error) {
      console.error('Self-heal failed:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const getSubscriptionColor = (tier) => {
    const colors = {
      free: 'bg-gray-500',
      starter: 'bg-blue-500',
      professional: 'bg-purple-500',
      enterprise: 'bg-gold-500',
      white_label: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
    return colors[tier] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.first_name}
          </h1>
          <p className="text-purple-200">
            {organization?.name} • {organization?.subscription_tier?.replace('_', ' ').toUpperCase()}
          </p>
        </div>
        
        <div className="flex gap-3">
          {user?.is_founder && (
            <Button
              onClick={handleSelfHeal}
              disabled={refreshing}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Self-Heal Platform
            </Button>
          )}
          
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Settings className="h-4 w-4 mr-2" />
            Organization Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Token Balance</CardTitle>
            <Coins className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {organization?.token_balance?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-slate-400">
              of {organization?.monthly_token_limit?.toLocaleString() || 0} monthly limit
            </p>
            <Progress 
              value={(organization?.token_balance / organization?.monthly_token_limit) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {agentInstances.filter(a => a.is_active).length}
            </div>
            <p className="text-xs text-slate-400">
              of {agentInstances.length} total deployed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.monthly_interactions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-slate-400">
              agent interactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.success_rate || 0}%
            </div>
            <p className="text-xs text-slate-400">
              avg response time: {metrics.avg_response_time || 0}s
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Instances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Your Active Agents
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your deployed AI agents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentInstances.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No agents deployed yet</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Deploy Your First Agent
                </Button>
              </div>
            ) : (
              agentInstances.map((instance) => (
                <div key={instance.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${instance.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <h4 className="text-white font-medium">{instance.instance_name}</h4>
                      <p className="text-sm text-slate-400">
                        {instance.tokens_used} tokens used • Last active {instance.last_used}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={instance.is_active ? "default" : "secondary"}>
                      {instance.is_active ? "Active" : "Paused"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest agent interactions and system events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.recent_activities?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-slate-400">{activity.timestamp}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col">
              <Zap className="h-6 w-6 mb-2" />
              Deploy New Agent
            </Button>
            <Button variant="outline" className="h-20 border-slate-600 text-slate-200 hover:bg-slate-700 flex flex-col">
              <Users className="h-6 w-6 mb-2" />
              Invite Team Member
            </Button>
            <Button variant="outline" className="h-20 border-slate-600 text-slate-200 hover:bg-slate-700 flex flex-col">
              <Coins className="h-6 w-6 mb-2" />
              Purchase Tokens
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

