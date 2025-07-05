import { Link } from 'wouter';
import { ShieldX, Home, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error403() {
  return (
    <div className="min-h-screen bg-harmonix-deep-forest flex items-center justify-center px-4" role="main" id="main-content">
      <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <ShieldX className="h-16 w-16 text-orange-400" aria-hidden="true" />
          </div>
          <CardTitle className="text-3xl font-bold text-harmonix-regal-gold">
            403 - Forbidden
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-harmonix-sage-fade text-lg">
            You don't have permission to access this resource. Please contact an administrator if you believe this is an error.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90">
              <Link href="/dashboard">
                <Key className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-harmonix-sage-fade/30 text-harmonix-sage-fade hover:bg-harmonix-cedar-green/10"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
          <div className="mt-6 pt-6 border-t border-harmonix-sage-fade/20">
            <p className="text-sm text-harmonix-sage-fade/70">
              Need access? Contact your organization administrator or{' '}
              <a 
                href="mailto:support@harmonix.ai" 
                className="text-harmonix-regal-gold hover:underline focus:outline-none focus:ring-2 focus:ring-harmonix-regal-gold focus:ring-offset-2 focus:ring-offset-harmonix-deep-forest"
              >
                reach out to support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}