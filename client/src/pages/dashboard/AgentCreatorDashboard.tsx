import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Cpu, DollarSign, Users, TrendingUp, Code, 
  Package, Zap, Shield, Award
} from 'lucide-react';

/**
 * AgentCreatorDashboard - Dashboard for agent creators
 * Focuses on agent development, deployment, and revenue tracking
 */
export default function AgentCreatorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Build, deploy, and monetize your AI agents
          </p>
        </div>
        <Link href="/creator">
          <Button>
            <Code className="h-4 w-4 mr-2" />
            Create New Agent
          </Button>
        </Link>
      </div>

      {/* Creator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published Agents</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Cpu className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deployments</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">$3,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Agents */}
      <Card>
        <CardHeader>
          <CardTitle>My Published Agents</CardTitle>
          <CardDescription>
            Manage your agent portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Sales Accelerator Pro</h4>
                  <p className="text-sm text-muted-foreground">87 deployments • $1,740/mo</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Customer Success Guardian</h4>
                  <p className="text-sm text-muted-foreground">32 deployments • $960/mo</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Content Creation Master</h4>
                  <p className="text-sm text-muted-foreground">8 deployments • $750/mo</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}