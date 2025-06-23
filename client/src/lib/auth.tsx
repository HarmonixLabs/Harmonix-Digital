import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';

interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  organizationId: number;
  role: string;
  tokenBalance: number;
}

interface Organization {
  id: number;
  name: string;
  slug: string;
  planType: string;
  tokenQuota: number;
  tokensUsed: number;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string, company?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('harmonix_token') : null
  );
  const queryClient = useQueryClient();

  // Check authentication status
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!token,
    retry: false,
  });

  const user = authData?.user || null;
  const organization = authData?.organization || null;

  useEffect(() => {
    if (token && authData) {
      setIsAuthenticated(true);
    } else if (error) {
      // Token is invalid, clear it
      localStorage.removeItem('harmonix_token');
      setToken(null);
      setIsAuthenticated(false);
    }
  }, [token, authData, error]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('harmonix_token', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, name, phone, company }: { 
      email: string; 
      password: string; 
      name: string; 
      phone?: string; 
      company?: string; 
    }) => {
      const response = await apiRequest('POST', '/api/auth/register', { 
        email, 
        password, 
        name, 
        phone, 
        company 
      });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('harmonix_token', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      // Redirect new users to onboarding
      if (data.isNewUser) {
        window.location.href = '/onboarding';
      }
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, name: string, phone?: string, company?: string) => {
    await registerMutation.mutateAsync({ email, password, name, phone, company });
  };

  const logout = () => {
    localStorage.removeItem('harmonix_token');
    setToken(null);
    setIsAuthenticated(false);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        login,
        register,
        logout,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
