import { useAuth } from '@/lib/auth';
import FounderDashboard from './FounderDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';
import AgentCreatorDashboard from './AgentCreatorDashboard';
import ViewerDashboard from './ViewerDashboard';

export default function RoleDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  // Render dashboard based on user role
  switch (user.role) {
    case 'founder':
    case 'admin':
      return <FounderDashboard />;
    case 'team_member':
      return <TeamMemberDashboard />;
    case 'agent_creator':
      return <AgentCreatorDashboard />;
    case 'viewer':
      return <ViewerDashboard />;
    default:
      return <TeamMemberDashboard />;
  }
}