import { useAuth } from '@/lib/auth';
import FounderDashboard from './FounderDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';
import AgentCreatorDashboard from './AgentCreatorDashboard';
import ViewerDashboard from './ViewerDashboard';

/**
 * RoleDashboard - Routes users to the appropriate dashboard based on their role
 * This component acts as a smart router that provides different experiences
 * for different user types within the organization
 */
export default function RoleDashboard() {
  const { user } = useAuth();

  // Default to Founder Dashboard if no role specified
  if (!user || !user.role) {
    return <FounderDashboard />;
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'super_admin':
    case 'admin':
    case 'founder':
      return <FounderDashboard />;
    
    case 'team_member':
      return <TeamMemberDashboard />;
    
    case 'agent_creator':
      return <AgentCreatorDashboard />;
    
    case 'viewer':
      return <ViewerDashboard />;
    
    default:
      return <FounderDashboard />;
  }
}