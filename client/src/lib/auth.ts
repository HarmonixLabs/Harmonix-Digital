import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  organizationId: number;
  role: string;
  tokenBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: number;
  name: string;
  slug: string;
  planType: string;
  tokenQuota: number;
  tokensUsed: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('harmonix_token') : null
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check authentication status
  const { 
    data: authData, 
    isLoading, 
    error: authError,
    refetch: refetchAuth 
  } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const user = authData?.user || null;
  const organization = authData?.organization || null;

  // Update authentication state when data changes
  useEffect(() => {
    if (token && authData && authData.user) {
      setIsAuthenticated(true);
      setError(null);
    } else if (authError) {
      // Token is invalid or expired
      console.warn('Authentication error:', authError);
      handleAuthError('Session expired. Please log in again.');
    } else if (token && !isLoading && !authData) {
      // Token exists but no data returned
      handleAuthError('Invalid session. Please log in again.');
    }
  }, [token, authData, authError, isLoading]);

  const handleAuthError = (message: string) => {
    localStorage.removeItem('harmonix_token');
    setToken(null);
    setIsAuthenticated(false);
    setError(message);
    queryClient.clear();
  };

  const setAuthToken = (newToken: string) => {
    localStorage.setItem('harmonix_token', newToken);
    setToken(newToken);
    setError(null);
  };

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      setError(null);
      try {
        const response = await apiRequest('POST', '/api/auth/login', { email, password });
        return response.json();
      } catch (error: any) {
        throw new Error(error.message || 'Login failed. Please check your credentials.');
      }
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${data.user.name}`,
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      setError(null);
      try {
        const response = await apiRequest('POST', '/api/auth/register', { email, password, name });
        return response.json();
      } catch (error: any) {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Welcome to Harmonix!",
        description: `Account created successfully. You've received ${data.user.tokenBalance} welcome tokens.`,
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!user) throw new Error('No user logged in');
      
      const response = await apiRequest('PUT', `/api/users/${user.id}`, updates);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['/api/auth/me'], (oldData: any) => ({
        ...oldData,
        user: updatedUser,
      }));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, name: string) => {
    await registerMutation.mutateAsync({ email, password, name });
  };

  const updateUser = async (updates: Partial<User>) => {
    await updateUserMutation.mutateAsync(updates);
  };

  const refreshAuth = async () => {
    await refetchAuth();
  };

  const logout = () => {
    localStorage.removeItem('harmonix_token');
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
    queryClient.clear();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Enhanced token validation
  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem('harmonix_token');
      if (storedToken && storedToken !== token) {
        setToken(storedToken);
      }
    };

    // Check token on storage events (for cross-tab syncing)
    window.addEventListener('storage', validateToken);
    return () => window.removeEventListener('storage', validateToken);
  }, [token]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    // Refresh auth data every 30 minutes
    const refreshInterval = setInterval(() => {
      refreshAuth().catch((error) => {
        console.warn('Failed to refresh auth:', error);
        handleAuthError('Session expired. Please log in again.');
      });
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [token, isAuthenticated]);

  const value: AuthContextType = {
    user,
    organization,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || updateUserMutation.isPending,
    isAuthenticated,
    error,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook for checking specific permissions
export function usePermissions() {
  const { user, organization } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions: Record<string, string[]> = {
      super_admin: ['*'], // All permissions
      admin: [
        'manage_agents',
        'manage_users',
        'view_analytics',
        'manage_tokens',
        'manage_organization',
      ],
      user: [
        'use_agents',
        'view_own_tasks',
        'manage_own_profile',
      ],
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const canManageAgents = () => hasPermission('manage_agents');
  const canViewAnalytics = () => hasPermission('view_analytics');
  const canManageTokens = () => hasPermission('manage_tokens');
  const canManageOrganization = () => hasPermission('manage_organization');

  return {
    hasPermission,
    canManageAgents,
    canViewAnalytics,
    canManageTokens,
    canManageOrganization,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
  };
}

// Hook for checking token balance and usage
export function useTokenUsage() {
  const { user, organization } = useAuth();

  const getTokenUsagePercentage = (): number => {
    if (!organization) return 0;
    return Math.round((organization.tokensUsed / organization.tokenQuota) * 100);
  };

  const getRemainingTokens = (): number => {
    if (!organization) return 0;
    return Math.max(0, organization.tokenQuota - organization.tokensUsed);
  };

  const isNearLimit = (): boolean => {
    return getTokenUsagePercentage() >= 80;
  };

  const hasExceededLimit = (): boolean => {
    return getTokenUsagePercentage() >= 100;
  };

  return {
    userTokenBalance: user?.tokenBalance || 0,
    organizationTokensUsed: organization?.tokensUsed || 0,
    organizationTokenQuota: organization?.tokenQuota || 0,
    getTokenUsagePercentage,
    getRemainingTokens,
    isNearLimit,
    hasExceededLimit,
  };
}

export { AuthContext };
