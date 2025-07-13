import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyAgentsHub from '@/components/dashboard/MyAgentsHub';
import PipelinesHub from '@/components/dashboard/PipelinesHub';
import ContentCenter from '@/components/dashboard/ContentCenter';
import { useAuth } from '@/lib/auth';

/**
 * TeamMemberDashboard - Focused dashboard for team members
 * Provides access to agent management, pipelines, and content creation
 * without administrative features
 */
export default function TeamMemberDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Team Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Manage your agents and content.
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">My Agents</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <MyAgentsHub />
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <PipelinesHub />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}