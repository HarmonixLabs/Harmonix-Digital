import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Bot, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  Users,
  Settings
} from "lucide-react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AgentMetrics {
  id: string;
  name: string;
  role: string;
  tasksCompleted: number;
  timeSaved: number; // hours
  tokenUsage: number;
  powerLevel: number; // 0-100
  status: "active" | "sleeping" | "issue";
  efficiency: number; // 0-100
  monthlyROI: number;
}

export default function ROIDashboard() {
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("month");
  const [displayMode, setDisplayMode] = useState<"time" | "money" | "impact">("money");

  // Mock data - in production this would come from API
  const [agentMetrics] = useState<AgentMetrics[]>([
    {
      id: "1",
      name: "CA$H",
      role: "Sales Strategist",
      tasksCompleted: 156,
      timeSaved: 24.5,
      tokenUsage: 3200,
      powerLevel: 94,
      status: "active",
      efficiency: 96,
      monthlyROI: 4800
    },
    {
      id: "2", 
      name: "Maya",
      role: "HR Coordinator",
      tasksCompleted: 89,
      timeSaved: 12.3,
      tokenUsage: 1800,
      powerLevel: 87,
      status: "active",
      efficiency: 91,
      monthlyROI: 2200
    },
    {
      id: "3",
      name: "Virgil",
      role: "Brand Strategist", 
      tasksCompleted: 67,
      timeSaved: 18.7,
      tokenUsage: 2400,
      powerLevel: 73,
      status: "sleeping",
      efficiency: 85,
      monthlyROI: 3100
    }
  ]);

  const [integrations] = useState([
    { name: "Gmail", status: "connected", health: 100 },
    { name: "Slack", status: "connected", health: 98 },
    { name: "ClickUp", status: "connected", health: 95 },
    { name: "Stripe", status: "connected", health: 100 },
    { name: "Notion", status: "issue", health: 45 },
    { name: "Zapier", status: "disconnected", health: 0 }
  ]);

  // Calculate totals
  const totalTimeSaved = agentMetrics.reduce((sum, agent) => sum + agent.timeSaved, 0);
  const totalTasks = agentMetrics.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const totalROI = agentMetrics.reduce((sum, agent) => sum + agent.monthlyROI, 0);
  const averageEfficiency = agentMetrics.reduce((sum, agent) => sum + agent.efficiency, 0) / agentMetrics.length;

  // Chart data
  const roiChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'ROI ($)',
        data: [1200, 2400, 3600, totalROI],
        borderColor: '#D1BFA7',
        backgroundColor: 'rgba(209, 191, 167, 0.1)',
        tension: 0.3
      },
      {
        label: 'Time Saved (hrs)',
        data: [8, 16, 24, totalTimeSaved],
        borderColor: '#1E6866',
        backgroundColor: 'rgba(30, 104, 102, 0.1)', 
        tension: 0.3
      }
    ]
  };

  const agentPerformanceData = {
    labels: agentMetrics.map(agent => agent.name),
    datasets: [
      {
        label: 'Tasks Completed',
        data: agentMetrics.map(agent => agent.tasksCompleted),
        backgroundColor: ['#D1BFA7', '#1E6866', '#768B7C'],
        borderColor: ['#D1BFA7', '#1E6866', '#768B7C'],
        borderWidth: 1
      }
    ]
  };

  const efficiencyData = {
    labels: ['Efficient', 'Moderate', 'Needs Attention'],
    datasets: [
      {
        data: [
          agentMetrics.filter(a => a.efficiency >= 90).length,
          agentMetrics.filter(a => a.efficiency >= 70 && a.efficiency < 90).length,
          agentMetrics.filter(a => a.efficiency < 70).length
        ],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#768B7C'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#768B7C'
        },
        grid: {
          color: 'rgba(118, 139, 124, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#768B7C'
        },
        grid: {
          color: 'rgba(118, 139, 124, 0.1)'
        }
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "sleeping":
      case "issue":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "disconnected":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-harmonix-sage" />;
    }
  };

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-harmonix-gold mb-2">ROI Dashboard</h1>
              <p className="text-harmonix-sage">Real-time insights into your AI agent performance and returns</p>
            </div>
            
            <div className="flex gap-4">
              <Tabs value={timeFrame} onValueChange={(value: any) => setTimeFrame(value)}>
                <TabsList className="bg-harmonix-night border border-harmonix-cedar">
                  <TabsTrigger value="week" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="year" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                    Year
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={displayMode} onValueChange={(value: any) => setDisplayMode(value)}>
                <TabsList className="bg-harmonix-night border border-harmonix-cedar">
                  <TabsTrigger value="time" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                    Time
                  </TabsTrigger>
                  <TabsTrigger value="money" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                    Money
                  </TabsTrigger>
                  <TabsTrigger value="impact" className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black">
                    Impact
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-harmonix-night border-harmonix-cedar">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-harmonix-sage text-sm">Time Saved This {timeFrame}</p>
                    <p className="text-2xl font-bold text-harmonix-gold">{totalTimeSaved.toFixed(1)} hrs</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">+23% vs last {timeFrame}</span>
                    </div>
                  </div>
                  <Clock className="w-8 h-8 text-harmonix-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night border-harmonix-cedar">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-harmonix-sage text-sm">ROI This {timeFrame}</p>
                    <p className="text-2xl font-bold text-harmonix-gold">${totalROI.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">+18% vs last {timeFrame}</span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-harmonix-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night border-harmonix-cedar">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-harmonix-sage text-sm">Tasks Completed</p>
                    <p className="text-2xl font-bold text-harmonix-gold">{totalTasks}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">+31% vs last {timeFrame}</span>
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-harmonix-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night border-harmonix-cedar">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-harmonix-sage text-sm">Avg Efficiency</p>
                    <p className="text-2xl font-bold text-harmonix-gold">{averageEfficiency.toFixed(0)}%</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">+5% vs last {timeFrame}</span>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-harmonix-gold" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            
            {/* ROI Trend Chart */}
            <Card className="bg-harmonix-night border-harmonix-cedar">
              <CardHeader>
                <CardTitle className="text-harmonix-gold flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  ROI & Time Savings Trend
                </CardTitle>
                <CardDescription className="text-harmonix-sage">
                  Track your returns and efficiency gains over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={roiChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Agent Performance */}
            <Card className="bg-harmonix-night border-harmonix-cedar">
              <CardHeader>
                <CardTitle className="text-harmonix-gold flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Agent Performance
                </CardTitle>
                <CardDescription className="text-harmonix-sage">
                  Individual agent contributions and efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={agentPerformanceData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            
            {/* Agent Cards */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold text-harmonix-gold mb-4">Agent Performance Breakdown</h3>
              {agentMetrics.map((agent) => (
                <Card key={agent.id} className="bg-harmonix-night border-harmonix-cedar">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-harmonix-gold/20 rounded-lg flex items-center justify-center">
                          <Bot className="w-6 h-6 text-harmonix-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-harmonix-gold">{agent.name}</h4>
                          <p className="text-harmonix-sage text-sm">{agent.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <Badge className={
                          agent.status === "active" 
                            ? "bg-green-400/20 text-green-400"
                            : agent.status === "sleeping"
                              ? "bg-yellow-400/20 text-yellow-400"
                              : "bg-red-400/20 text-red-400"
                        }>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-harmonix-sage text-xs">Tasks</p>
                        <p className="text-harmonix-gold font-semibold">{agent.tasksCompleted}</p>
                      </div>
                      <div>
                        <p className="text-harmonix-sage text-xs">Time Saved</p>
                        <p className="text-harmonix-gold font-semibold">{agent.timeSaved}h</p>
                      </div>
                      <div>
                        <p className="text-harmonix-sage text-xs">Monthly ROI</p>
                        <p className="text-harmonix-gold font-semibold">${agent.monthlyROI.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-harmonix-sage">Power Level</span>
                        <span className="text-harmonix-gold">{agent.powerLevel}%</span>
                      </div>
                      <Progress value={agent.powerLevel} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-harmonix-sage">Efficiency</span>
                        <span className="text-harmonix-gold">{agent.efficiency}%</span>
                      </div>
                      <Progress value={agent.efficiency} className="h-2" />
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar">
                        <Activity className="w-4 h-4 mr-1" />
                        View Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              
              {/* Efficiency Distribution */}
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Efficiency Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <Doughnut data={efficiencyData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </CardContent>
              </Card>

              {/* Integration Health */}
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Integration Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {integrations.map((integration, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <span className="text-harmonix-sage text-sm">{integration.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-harmonix-black rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                integration.health >= 90 ? "bg-green-400" :
                                integration.health >= 70 ? "bg-yellow-400" : "bg-red-400"
                              }`}
                              style={{ width: `${integration.health}%` }}
                            />
                          </div>
                          <span className="text-harmonix-sage text-xs">{integration.health}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Projected Growth */}
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Projected Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-harmonix-sage text-sm">With 2 More Agents</p>
                      <p className="text-harmonix-gold font-semibold">+$3,200/month</p>
                      <p className="text-harmonix-sage text-xs">15 hours/week additional savings</p>
                    </div>
                    <Button className="w-full bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90">
                      <Users className="w-4 h-4 mr-2" />
                      Deploy More Agents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}