import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');

    if (token && userData) {
      // Store token
      localStorage.setItem('harmonix_token', token);
      
      // Parse user data
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        
        toast({
          title: "Welcome to Harmonix!",
          description: `Successfully signed in as ${user.name}`,
        });

        // Redirect to dashboard
        setLocation('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to process authentication. Please try again.",
          variant: "destructive",
        });
        setLocation('/login');
      }
    } else {
      toast({
        title: "Authentication Failed",
        description: "Missing authentication data. Please try signing in again.",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-harmony-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-harmony-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white">Processing authentication...</h2>
        <p className="text-gray-400 mt-2">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}