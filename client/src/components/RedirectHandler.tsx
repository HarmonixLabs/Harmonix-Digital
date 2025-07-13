import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Route Redirect Handler
 * Handles legacy route redirects to unified endpoints
 */

const ROUTE_REDIRECTS: Record<string, string> = {
  // Agent Marketplace consolidation
  '/agents': '/marketplace',
  '/agent-store': '/marketplace',
  '/browse': '/marketplace',
  
  // Join/Waitlist consolidation  
  '/waitlist': '/join',
  '/early-access': '/join',
  '/reserve': '/join',
  '/harmony-waitlist': '/join',
  '/signup': '/join',
  '/get-started': '/join',
  
  // Dashboard consolidation
  '/home': '/dashboard',
  '/my-agents': '/dashboard',
  '/app': '/dashboard',
  
  // Auth consolidation
  '/signin': '/login',
  '/auth': '/login',
  '/register': '/login',
  
  // Creator zone consolidation
  '/create-agent': '/creator',
  '/upload': '/creator',
  '/builder': '/creator',
  
  // Demo consolidation
  '/try': '/demo',
  '/agents/demo': '/demo',
  '/sandbox-demo': '/demo',
};

export function RedirectHandler() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    const redirect = ROUTE_REDIRECTS[location];
    if (redirect) {
      console.log(`Redirecting from ${location} to ${redirect}`);
      setLocation(redirect);
    }
  }, [location, setLocation]);
  
  return null;
}

export default RedirectHandler;