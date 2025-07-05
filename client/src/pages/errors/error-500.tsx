import { Link } from 'wouter';
import { ServerCrash, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error500() {
  return (
    <div className="min-h-screen bg-harmonix-deep-forest flex items-center justify-center px-4" role="main" id="main-content">
      <Card className="bg-harmonix-night-pine/50 border-harmonix-sage-fade/20 max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <ServerCrash className="h-16 w-16 text-red-500" aria-hidden="true" />
          </div>
          <CardTitle className="text-3xl font-bold text-harmonix-regal-gold">
            500 - Server Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-harmonix-sage-fade text-lg">
            Something went wrong on our servers. We've been notified and are working to fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button 
              className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
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
              If this problem persists, please check our{' '}
              <a 
                href="https://status.harmonix.ai" 
                className="text-harmonix-regal-gold hover:underline focus:outline-none focus:ring-2 focus:ring-harmonix-regal-gold focus:ring-offset-2 focus:ring-offset-harmonix-deep-forest"
                target="_blank"
                rel="noopener noreferrer"
              >
                status page
              </a>{' '}
              or contact{' '}
              <a 
                href="mailto:support@harmonix.ai" 
                className="text-harmonix-regal-gold hover:underline focus:outline-none focus:ring-2 focus:ring-harmonix-regal-gold focus:ring-offset-2 focus:ring-offset-harmonix-deep-forest"
              >
                support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}