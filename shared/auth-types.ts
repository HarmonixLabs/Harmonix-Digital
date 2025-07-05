// Authentication and Role Types
export type UserRole = 'founder' | 'admin' | 'team_member' | 'agent_creator' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  organizationId?: string;
  organizationName?: string;
  role: UserRole;
  avatar?: string;
  walletAddress?: string;
  subscription: {
    plan: 'free' | 'starter' | 'growth' | 'expansion' | 'enterprise';
    agentLimit: number;
    activeAgents: number;
    expiresAt?: string;
  };
  metadata: {
    lastLogin: string;
    createdAt: string;
    onboardingCompleted: boolean;
    emailVerified: boolean;
  };
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  members: OrganizationMember[];
  subscription: {
    plan: string;
    agentLimit: number;
    activeAgents: number;
  };
  settings: {
    defaultRole: UserRole;
    ssoEnabled: boolean;
    allowedDomains?: string[];
  };
}

export interface OrganizationMember {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  joinedAt: string;
  lastActive?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  authUrl: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}