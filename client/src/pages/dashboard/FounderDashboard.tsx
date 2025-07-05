import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { 
  Users, TrendingUp, DollarSign, Cpu, Activity, Settings,
  UserPlus, CreditCard, BarChart3, PieChart, AlertCircle,
  Zap, Shield, Building2, Briefcase
} from 'lucide-react';
import { Link } from 'wouter';

// Mock data for demonstration
const mockMetrics = {
  totalAgents: 8,
  activeAgents: 6,
  teamMembers: 12,
  monthlySpend: 4850,
  apiCalls: 128540,
  successRate: 98.5,
  avgResponseTime: 245,
  tokensUsed: 2840000,
};

const mockTeamMembers = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin', lastActive: '2 hours ago' },
  { id: 2, name: 'Mike Johnson', email: 'mike@company.com', role: 'agent_creator', lastActive: '30 minutes ago' },
  { id: 3, name: 'Emily Davis', email: 'emily@company.com', role: 'team_member', lastActive: '1 day ago' },
];

export default function FounderDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-harmonix-regal-gold">
            Organization Overview
          </h1>
          <p className="text-harmonix-sage-fade mt-1">
            Welcome back, {user?.name}. Here's your command center.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings/billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Billing
            </Link>
          </Button>
          <Button size="sm" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Team
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Active Agents
            </CardTitle>
            <Cpu className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockMetrics.activeAgents}/{mockMetrics.totalAgents}</div>
            <Progress value={(mockMetrics.activeAgents / mockMetrics.totalAgents) * 100} className="mt-2" />
            <p className="text-xs text-harmonix-sage-fade mt-1">
              {mockMetrics.totalAgents - mockMetrics.activeAgents} agents inactive
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Monthly Spend
            </CardTitle>
            <DollarSign className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${mockMetrics.monthlySpend.toLocaleString()}</div>
            <p className="text-xs text-green-400 mt-1">
              <TrendingUp className="inline h-3 w-3" /> 12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockMetrics.teamMembers}</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              3 pending invitations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Success Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockMetrics.successRate}%</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              Avg response: {mockMetrics.avgResponseTime}ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-harmonix-deep-forest/50">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-harmonix-regal-gold">Usage Analytics</CardTitle>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-sm bg-harmonix-deep-forest border-harmonix-sage-fade/30 rounded px-2 py-1 text-harmonix-sage-fade"
                  >
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-harmonix-sage-fade">
                  <BarChart3 className="h-12 w-12 opacity-50" />
                  <span className="ml-2">Usage chart visualization</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
              <CardHeader>
                <CardTitle className="text-harmonix-regal-gold">Agent Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-harmonix-sage-fade">
                  <PieChart className="h-12 w-12 opacity-50" />
                  <span className="ml-2">Distribution chart</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Resource Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-harmonix-sage-fade">API Calls</span>
                    <span className="text-sm text-white">{mockMetrics.apiCalls.toLocaleString()} / 500,000</span>
                  </div>
                  <Progress value={(mockMetrics.apiCalls / 500000) * 100} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-harmonix-sage-fade">Tokens Used</span>
                    <span className="text-sm text-white">{(mockMetrics.tokensUsed / 1000000).toFixed(1)}M / 10M</span>
                  </div>
                  <Progress value={(mockMetrics.tokensUsed / 10000000) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-harmonix-regal-gold">Team Members</CardTitle>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-harmonix-deep-forest/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-sm text-harmonix-sage-fade">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-harmonix-regal-gold border-harmonix-regal-gold/50">
                        {member.role}
                      </Badge>
                      <span className="text-xs text-harmonix-sage-fade">{member.lastActive}</span>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Agent Overview</CardTitle>
              <CardDescription className="text-harmonix-sage-fade">
                Manage your organization's AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Cpu className="h-12 w-12 mx-auto text-harmonix-sage-fade/50 mb-4" />
                <p className="text-harmonix-sage-fade">Agent management interface coming soon</p>
                <Button className="mt-4" asChild>
                  <Link href="/marketplace">
                    Browse Marketplace
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">Billing Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-harmonix-deep-forest/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">Current Plan</p>
                  <p className="text-sm text-harmonix-sage-fade">Enterprise - 12 Agents</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-harmonix-regal-gold">$21,500</p>
                  <p className="text-sm text-harmonix-sage-fade">per month</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-harmonix-sage-fade">Next billing date</span>
                  <span className="text-white">January 30, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-harmonix-sage-fade">Payment method</span>
                  <span className="text-white">•••• 4242</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Update Payment
                </Button>
                <Button className="flex-1 bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}