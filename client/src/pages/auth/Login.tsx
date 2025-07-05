import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { Loader2, Chrome, Shield, Building2, Key } from 'lucide-react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiOkta } from 'react-icons/si';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSSO, setShowSSO] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in to Harmonix',
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Initiate OAuth flow
      window.location.href = `/api/auth/oauth/${provider}`;
    } catch (error) {
      toast({
        title: 'OAuth Error',
        description: `Failed to login with ${provider}`,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleSSOLogin = (provider: string) => {
    toast({
      title: 'Enterprise SSO',
      description: `${provider} SSO integration coming soon`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-harmonix-deep-forest via-harmonix-cedar-mist to-harmonix-deep-forest p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(215, 183, 109, 0.1) 35px, rgba(215, 183, 109, 0.1) 70px)`,
        }} />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-harmonix-night-pine/95 backdrop-blur-xl border-harmonix-sage-fade/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <HarmonixLogo variant="icon" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-playfair text-harmonix-regal-gold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-harmonix-sage-fade">
            Sign in to access your AI agent command center
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* OAuth Providers */}
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="w-full border-harmonix-sage-fade/30 hover:bg-harmonix-cedar-mist/20 hover:border-harmonix-regal-gold/50"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
              Sign in with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-harmonix-sage-fade/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-harmonix-night-pine px-2 text-harmonix-sage-fade">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-harmonix-sage-fade">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...form.register('email')}
                className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white placeholder:text-harmonix-sage-fade/50"
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-harmonix-sage-fade">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs text-harmonix-regal-gold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register('password')}
                className="bg-harmonix-deep-forest/50 border-harmonix-sage-fade/30 text-white placeholder:text-harmonix-sage-fade/50"
                disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Enterprise SSO */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowSSO(!showSSO)}
              className="text-xs text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors"
            >
              Enterprise SSO options
            </button>
          </div>

          {showSSO && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-harmonix-sage-fade/30 hover:bg-harmonix-cedar-mist/20"
                onClick={() => handleSSOLogin('Azure AD')}
              >
                <FaMicrosoft className="mr-2 h-3 w-3 text-blue-500" />
                Azure AD
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-harmonix-sage-fade/30 hover:bg-harmonix-cedar-mist/20"
                onClick={() => handleSSOLogin('Okta')}
              >
                <SiOkta className="mr-2 h-3 w-3" />
                Okta
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-harmonix-sage-fade/30 hover:bg-harmonix-cedar-mist/20"
                onClick={() => handleSSOLogin('SAML')}
              >
                <Shield className="mr-2 h-3 w-3" />
                SAML 2.0
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-harmonix-sage-fade">
            Don't have an account?{' '}
            <Link href="/signup" className="text-harmonix-regal-gold hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-harmonix-sage-fade/70">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-harmonix-regal-gold hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-harmonix-regal-gold hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}