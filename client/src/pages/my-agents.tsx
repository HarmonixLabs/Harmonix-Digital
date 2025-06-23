import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Settings, 
  Activity, 
  TrendingUp, 
  Clock, 
  Star, 
  Zap,
  DollarSign,
  MessageCircle,
  Calendar,
  BarChart,
  Shield,
  FileText,
  Briefcase,
  Plus,
  Play,
  Pause,
  MoreVertical
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "active" | "training" | "idle" | "offline";
  level: number;
  xp: number;
  maxXp: number;
  tasksToday: number;
  tasksTotal: number;
  efficiency: number;
  lastActive: string;
  icon: React.ElementType;
  description: string;
  specialties: string[];
}

export default function MyAgentsPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");

  const userAgents: Agent[] = [
    {
      id: "cashflow-001",
      name: "CA$HFLOW Alpha",
      type: "Sales Agent",
      status: "active",
      level: 8,
      xp: 2340,
      maxXp: 3000,
      tasksToday: 23,
      tasksTotal: 1247,
      efficiency: 94,
      lastActive: "2 minutes ago",
      icon: DollarSign,
      description: "Elite sales automation specialist focusing on lead qualification and conversion optimization",
      specialties: ["Lead Scoring", "Email Sequences", "CRM Integration", "Pipeline Management"]
    },
    {
      id: "concierge-002",
      name: "Harmony Assistant",
      type: "Concierge Agent",
      status: "active",
      level: 6,
      xp: 1890,
      maxXp: 2500,
      tasksToday: 47,
      tasksTotal: 892,
      efficiency: 87,
      lastActive: "5 minutes ago",
      icon: MessageCircle,
      description: "24/7 customer support specialist with advanced triage and escalation capabilities",
      specialties: ["Customer Support", "Ticket Triage", "Knowledge Base", "Multi-channel"]
    },
    {
      id: "executive-003",
      name: "Executive Coordinator",
      type: "Executive Assistant",
      status: "training",
      level: 4,
      xp: 650,
      maxXp: 1500,
      tasksToday: 8,
      tasksTotal: 234,
      efficiency: 76,
      lastActive: "1 hour ago",
      icon: Briefcase,
      description: "High-level administrative automation for calendar, email, and strategic coordination",
      specialties: ["Calendar Management", "Email Prioritization", "Meeting Coordination", "Task Delegation"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "training": return "bg-yellow-500";
      case "idle": return "bg-gray-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "training": return "Training";
      case "idle": return "Idle";
      case "offline": return "Offline";
      default: return "Unknown";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-harmony-dark">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto bg-gray-900/50 border-harmony-gold/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-harmony-gold font-serif">Access Required</CardTitle>
              <CardDescription className="text-gray-300">
                Please log in to view your AI agent team
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white font-serif mb-4">
                My <span className="text-harmony-gold">AI Team</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Manage and monitor your deployed agents. View performance metrics, 
                upgrade capabilities, and coordinate your digital workforce.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/marketplace">
                <Button variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Agent
                </Button>
              </Link>
              <Link href="/create">
                <Button className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                  <Zap className="mr-2 h-4 w-4" />
                  Create Agent
                </Button>
              </Link>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Agents</p>
                    <p className="text-2xl font-bold text-harmony-gold">{userAgents.filter(a => a.status === 'active').length}</p>
                  </div>
                  <Users className="h-8 w-8 text-harmony-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Tasks Today</p>
                    <p className="text-2xl font-bold text-harmony-gold">
                      {userAgents.reduce((sum, agent) => sum + agent.tasksToday, 0)}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-harmony-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Efficiency</p>
                    <p className="text-2xl font-bold text-harmony-gold">
                      {Math.round(userAgents.reduce((sum, agent) => sum + agent.efficiency, 0) / userAgents.length)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-harmony-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-harmony-gold">
                      {userAgents.reduce((sum, agent) => sum + agent.tasksTotal, 0)}
                    </p>
                  </div>
                  <BarChart className="h-8 w-8 text-harmony-gold" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Management Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark">
                Agent Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark">
                Performance
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark">
                Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAgents.map((agent) => (
                  <Card key={agent.id} className="bg-gray-900/50 border-gray-800 hover:border-harmony-gold/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                            <agent.icon className="h-6 w-6 text-harmony-gold" />
                          </div>
                          <div>
                            <CardTitle className="text-harmony-gold font-serif text-lg">{agent.name}</CardTitle>
                            <CardDescription className="text-gray-400">{agent.type}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <Badge variant="outline" className="border-harmony-gold/30 text-harmony-gold text-xs">
                            {getStatusLabel(agent.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm">{agent.description}</p>

                      {/* Level and XP */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Level {agent.level}</span>
                          <span className="text-harmony-gold">{agent.xp} / {agent.maxXp} XP</span>
                        </div>
                        <Progress value={(agent.xp / agent.maxXp) * 100} className="h-2" />
                      </div>

                      {/* Performance Stats */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-harmony-gold">{agent.tasksToday}</div>
                          <div className="text-xs text-gray-400">Tasks Today</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-harmony-gold">{agent.efficiency}%</div>
                          <div className="text-xs text-gray-400">Efficiency</div>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <p className="text-sm font-semibold text-white mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="border-harmony-gold/30 text-gray-300 text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {agent.specialties.length > 2 && (
                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              +{agent.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="flex-1 bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                          <Settings className="mr-1 h-3 w-3" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                          {agent.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600/10">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-xs text-gray-400 flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Last active {agent.lastActive}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add New Agent Card */}
              <Card className="bg-gray-900/50 border-gray-800 border-dashed hover:border-harmony-gold/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-lg bg-harmony-gold/10 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-harmony-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-harmony-gold mb-2">Add New Agent</h3>
                  <p className="text-gray-400 mb-6 max-w-sm">
                    Expand your AI team by deploying new agents from the marketplace or creating custom ones.
                  </p>
                  <div className="flex space-x-3">
                    <Link href="/marketplace">
                      <Button className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                        Browse Marketplace
                      </Button>
                    </Link>
                    <Link href="/create">
                      <Button variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                        Create Custom
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Team Performance Analytics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed metrics and insights for your AI agent team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart className="w-16 h-16 text-harmony-gold mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Performance Dashboard</h3>
                    <p className="text-gray-400 mb-6">
                      Detailed analytics and performance metrics will be available here
                    </p>
                    <Button className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Agent Management</CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure team settings, permissions, and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-harmony-gold mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Management Console</h3>
                    <p className="text-gray-400 mb-6">
                      Advanced management and configuration options will be available here
                    </p>
                    <Button className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}