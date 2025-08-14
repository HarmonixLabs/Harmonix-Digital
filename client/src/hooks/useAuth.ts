import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Don't block the app if auth fails
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  // If there's an auth error (401), treat it as not authenticated but not loading
  const actuallyLoading = isLoading && !error;

  return {
    user,
    isLoading: actuallyLoading,
    isAuthenticated: !!user && !error,
    error,
  };
}