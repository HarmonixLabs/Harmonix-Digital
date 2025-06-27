import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  BarChart3, 
  Bot, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Zap,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  Server,
  Wifi,
  Database,
  Shield,
  RefreshCw,
  Settings,
  Eye,
  Play,
  Pause,
  MoreVertical
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Mock real-time data
  const [dashboardData, setDashboardData] = useState({
    overview: {
      total_agents: 12,
      active_agents: 10,
      total_conversations: 1247,
      avg_response_time: 1.2,
      uptime_percentage: 99.8,
      total_users: 156
    },
    agent_status: [
      { id: '1', name: 'Sales Agent Pro', status: 'active', health: 98, conversations: 234, last_active: '2 min ago', response_time: 0.8 },
      { id: '2', name: 'Marketing Genius', status: 'active', health: 95, conversations: 189, last_active: '1 min ago', response_time: 1.1 },
      { id: '3', name: 'Support Oracle', status: 'warning', health: 78, conversations: 156, last_active: '5 min ago', response_time: 2.3 },
      { id: '4', name: 'HR Assistant', status: 'active', health: 92, conversations: 89, last_active: '3 min ago', response_time: 1.5 },
      { id: '5', name: 'Finance Manager', status: 'error', health: 45, conversations: 67, last_active: '15 min ago', response_time: 5.2 },
      { id: '6', name: 'Content Creator', status: 'active', health: 88, conversations: 123, last_active: '1 min ago', response_time: 1.8 }
    ],
    integrations: [
      { name: 'Salesforce', status: 'connected', health: 100, last_sync: '1 min ago' },
      { name: 'HubSpot', status: 'connected', health: 98, last_sync: '2 min ago' },
      { name: 'Slack', status: 'warning', health: 85, last_sync: '10 min ago' },
      { name: 'Gmail', status: 'connected', health: 99, last_sync: '30 sec ago' },
      { name: 'Stripe', status: 'connected', health: 100, last_sync: '1 min ago' },
      { name: 'Zoom', status: 'error', health: 0, last_sync: '2 hours ago' }
    ],
    performance_data: [
      { time: '00:00', conversations: 45, response_time: 1.2, success_rate: 98 },
      { time: '04:00', conversations: 23, response_time: 0.9, success_rate: 99 },
      { time: '08:00', conversations: 89, response_time: 1.1, success_rate: 97 },
      { time: '12:00', conversations: 156, response_time: 1.4, success_rate: 96 },
      { time: '16:00', conversations: 134, response_time: 1.3, success_rate: 98 },
      { time: '20:00', conversations: 78, response_time: 1.0, success_rate: 99 }
    ],
    usage_analytics: [
      { name: 'Sales', value: 35, color: '#3B82F6' },
      { name: 'Support', value: 28, color: '#10B981' },
      { name: 'Marketing', value: 20, color: '#8B5CF6' },
      { name: 'HR', value: 12, color: '#F59E0B' },
      { name: 'Finance', value: 5, color: '#EF4444' }
    ]
  });

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update with slight variations to simulate real-time changes
    setDashboardData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        total_conversations: prev.overview.total_conversations + Math.floor(Math.random() * 5),
        avg_response_time: +(prev.overview.avg_response_time + (Math.random() - 0.5) * 0.2).toFixed(1)
      }
    }));
    
    setRefreshing(false);
  };

  useEffect(() => {
    // Set up real-time updates
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-500';
    if (health >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-400 text-lg">Real-time monitoring and analytics</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={refreshData}
              disabled={refreshing}
              variant="outline"
              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Agents</p>
                  <p className="text-3xl font-bold text-white">
                    {dashboardData.overview.active_agents}
                    <span className="text-slate-400 text-lg">/{dashboardData.overview.total_agents}</span>
                  </p>
                </div>
                <div className="p-3 bg-emerald-600 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={(dashboardData.overview.active_agents / dashboardData.overview.total_agents) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Conversations</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.overview.total_conversations.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 text-sm">+12%</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-600 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Response Time</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.overview.avg_response_time}s</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 text-sm">-5%</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">System Uptime</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.overview.uptime_percentage}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 text-sm">Excellent</span>
                  </div>
                </div>
                <div className="p-3 bg-green-600 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="agents" className="data-[state=active]:bg-emerald-600">Agent Status</TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-emerald-600">Integrations</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600">Analytics</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-emerald-600">Performance</TabsTrigger>
          </TabsList>

          {/* Agent Status Tab */}
          <TabsContent value="agents" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Agent Health Monitor
                </CardTitle>
                <CardDescription>Real-time status and performance of all deployed agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.agent_status.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${getStatusColor(agent.status)}`}>
                          {getStatusIcon(agent.status)}
                          <span className="font-medium">{agent.name}</span>
                        </div>
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {agent.conversations} conversations
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-slate-400">Health</p>
                          <p className={`text-lg font-bold ${getHealthColor(agent.health)}`}>
                            {agent.health}%
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-slate-400">Response Time</p>
                          <p className="text-lg font-bold text-white">{agent.response_time}s</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-slate-400">Last Active</p>
                          <p className="text-sm text-slate-300">{agent.last_active}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-700">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Integration Health Panel
                </CardTitle>
                <CardDescription>Monitor all external service connections and sync status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.integrations.map((integration, index) => (
                    <Card key={index} className="bg-slate-900 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-white">{integration.name}</h3>
                          <div className={`flex items-center gap-1 ${getStatusColor(integration.status)}`}>
                            {getStatusIcon(integration.status)}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Health</span>
                            <span className={getHealthColor(integration.health)}>
                              {integration.health}%
                            </span>
                          </div>
                          
                          <Progress value={integration.health} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Last Sync</span>
                            <span className="text-slate-300">{integration.last_sync}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-400 hover:bg-slate-700">
                            Test
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-400 hover:bg-slate-700">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Usage by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.usage_analytics}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {dashboardData.usage_analytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Conversation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.performance_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="conversations" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Response Time Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.performance_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="response_time" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.performance_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="success_rate" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* System Resources */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-slate-900 rounded-lg">
                      <Database className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Database</p>
                      <p className="text-2xl font-bold text-white">78%</p>
                      <Progress value={78} className="h-2 mt-2" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-slate-900 rounded-lg">
                      <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">CPU Usage</p>
                      <p className="text-2xl font-bold text-white">45%</p>
                      <Progress value={45} className="h-2 mt-2" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-slate-900 rounded-lg">
                      <Server className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Memory</p>
                      <p className="text-2xl font-bold text-white">62%</p>
                      <Progress value={62} className="h-2 mt-2" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-slate-900 rounded-lg">
                      <Shield className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Security</p>
                      <p className="text-2xl font-bold text-white">100%</p>
                      <Progress value={100} className="h-2 mt-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

