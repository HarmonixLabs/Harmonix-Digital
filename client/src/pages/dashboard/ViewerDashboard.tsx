import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Eye, TrendingUp, BarChart3, Activity } from 'lucide-react';

/**
 * ViewerDashboard - Read-only dashboard for viewers
 * Provides high-level metrics and analytics without modification capabilities
 */
export default function ViewerDashboard() {
  const { user, organization } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome, {user?.name}. View-only access to organization metrics.
          </p>
        </div>
        <Badge variant="secondary">
          <Eye className="h-3 w-3 mr-1" />
          Viewer Access
        </Badge>
      </div>

      {/* Read-Only Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Tasks</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Organization-wide metrics and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">View-Only Access</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              As a viewer, you have read-only access to organization metrics. 
              Contact your administrator to request additional permissions.
            </p>
            <Button variant="outline" className="mt-4" disabled>
              Request Access Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}