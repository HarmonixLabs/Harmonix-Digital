import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { 
  Eye, FileText, BarChart3, Users, 
  Lock, MessageSquare, ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';

// Mock read-only data for viewer
const viewerStats = {
  activeAgents: 6,
  totalTasks: 1245,
  teamSize: 12,
  lastUpdated: '5 minutes ago',
};

export default function ViewerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-harmonix-regal-gold">
            Viewer Dashboard
          </h1>
          <p className="text-harmonix-sage-fade mt-1">
            Monitor organization performance and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/help">
              <MessageSquare className="h-4 w-4 mr-2" />
              Get Help
            </Link>
          </Button>
        </div>
      </div>

      {/* Viewer Notice */}
      <Card className="bg-harmonix-night-pine/50 border-harmonix-regal-gold/30">
        <CardContent className="flex items-center gap-4 p-6">
          <Lock className="h-8 w-8 text-harmonix-regal-gold" />
          <div className="flex-1">
            <h3 className="font-semibold text-white">Read-Only Access</h3>
            <p className="text-sm text-harmonix-sage-fade mt-1">
              You have viewer permissions. Contact your administrator to request additional access.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Request Access
          </Button>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Active Agents
            </CardTitle>
            <Eye className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{viewerStats.activeAgents}</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              View only
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Total Tasks
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{viewerStats.totalTasks.toLocaleString()}</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Team Size
            </CardTitle>
            <Users className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{viewerStats.teamSize}</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              Members
            </p>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-harmonix-sage-fade">
              Last Updated
            </CardTitle>
            <FileText className="h-4 w-4 text-harmonix-regal-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">{viewerStats.lastUpdated}</div>
            <p className="text-xs text-harmonix-sage-fade mt-1">
              Auto-refresh enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
        <CardHeader>
          <CardTitle className="text-harmonix-regal-gold">Available Reports</CardTitle>
          <CardDescription className="text-harmonix-sage-fade">
            View organization reports and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: 'Monthly Performance Report', date: 'December 2024', type: 'Performance' },
              { title: 'Agent Usage Analytics', date: 'Last 30 days', type: 'Analytics' },
              { title: 'Team Activity Summary', date: 'Week 52', type: 'Activity' },
              { title: 'Cost Analysis Report', date: 'Q4 2024', type: 'Financial' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-harmonix-deep-forest/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{report.title}</p>
                  <p className="text-sm text-harmonix-sage-fade">{report.date} • {report.type}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20">
        <CardHeader>
          <CardTitle className="text-harmonix-regal-gold">Need More Access?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-harmonix-sage-fade">
            As a viewer, you can monitor organization metrics and view reports. To create or manage agents, 
            you'll need elevated permissions.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">
              Contact Administrator
            </Button>
            <Button variant="outline">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}