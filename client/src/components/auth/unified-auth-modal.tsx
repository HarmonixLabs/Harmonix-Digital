import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { Chrome, Wallet, ArrowRight, X, Eye, EyeOff, Mail, User, Building, Phone } from 'lucide-react';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function UnifiedAuthModal({ 
  isOpen, 
  onClose, 
  defaultTab = 'login'
}: UnifiedAuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(loginForm.email, loginForm.password);
      onClose();
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await register(
        signupForm.email,
        signupForm.password,
        signupForm.name
      );
      onClose();
      toast({
        title: "Account created!",
        description: "Welcome to Harmonix. Setting up your dashboard...",
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'google' | 'wallet') => {
    toast({
      title: `${provider === 'google' ? 'Google' : 'Wallet'} Authentication`,
      description: "Social authentication will be available soon.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-harmonix-deep-forest border-harmonix-sage/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HarmonixLogo size="sm" variant="icon" showText={false} />
                <DialogTitle className="text-xl font-bold text-harmonix-gold">
                  {activeTab === 'login' ? 'Welcome Back' : 'Join Harmonix'}
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-harmonix-sage hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex space-x-1 bg-harmonix-cedar/20 p-1 rounded-lg mt-4">
              <Button
                variant={activeTab === 'login' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('login')}
                className={`flex-1 ${activeTab === 'login' 
                  ? 'bg-harmonix-gold text-harmonix-black' 
                  : 'text-harmonix-sage hover:text-white'}`}
              >
                Sign In
              </Button>
              <Button
                variant={activeTab === 'signup' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 ${activeTab === 'signup' 
                  ? 'bg-harmonix-gold text-harmonix-black' 
                  : 'text-harmonix-sage hover:text-white'}`}
              >
                Get Started
              </Button>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <Alert className="border-red-500/50 bg-red-500/10">
                        <AlertDescription className="text-red-400">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="login-email" className="text-harmonix-sage">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-harmonix-sage" />
                          <Input
                            id="login-email"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 harmonix-input-base"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="login-password" className="text-harmonix-sage">Password</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                            className="pr-10 bg-harmonix-cedar/20 border-harmonix-sage/30 text-white"
                            placeholder="••••••••"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-harmonix-sage"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 font-semibold"
                      size="lg"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                      <Alert className="border-red-500/50 bg-red-500/10">
                        <AlertDescription className="text-red-400">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="signup-name" className="text-harmonix-sage">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-harmonix-sage" />
                          <Input
                            id="signup-name"
                            type="text"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10 bg-harmonix-cedar/20 border-harmonix-sage/30 text-white"
                            placeholder="John Smith"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="signup-email" className="text-harmonix-sage">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-harmonix-sage" />
                          <Input
                            id="signup-email"
                            type="email"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 bg-harmonix-cedar/20 border-harmonix-sage/30 text-white"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="signup-phone" className="text-harmonix-sage">Phone</Label>
                          <Input
                            id="signup-phone"
                            type="tel"
                            value={signupForm.phone}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-harmonix-cedar/20 border-harmonix-sage/30 text-white"
                            placeholder="(555) 123-4567"
                          />
                        </div>

                        <div>
                          <Label htmlFor="signup-company" className="text-harmonix-sage">Company</Label>
                          <Input
                            id="signup-company"
                            type="text"
                            value={signupForm.company}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, company: e.target.value }))}
                            className="bg-harmonix-cedar/20 border-harmonix-sage/30 text-white"
                            placeholder="Acme Inc"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="signup-password" className="text-harmonix-sage">Password</Label>
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={signupForm.password}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-harmonix-cedar/20 border-harmonix-sage/30 text-white"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="signup-confirm" className="text-harmonix-sage">Confirm Password</Label>
                        <Input
                          id="signup-confirm"
                          type={showPassword ? 'text' : 'password'}
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-harmonix-cedar/20 border-harmonix-sage/30 text-white"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 font-semibold"
                      size="lg"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-harmonix-sage/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-harmonix-deep-forest px-2 text-harmonix-sage">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialAuth('google')}
                  className="border-harmonix-sage/30 text-harmonix-sage hover:border-harmonix-gold hover:text-harmonix-gold"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialAuth('wallet')}
                  className="border-harmonix-sage/30 text-harmonix-sage hover:border-harmonix-gold hover:text-harmonix-gold"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </Button>
              </div>
            </div>

            <p className="text-xs text-harmonix-sage mt-4 text-center">
              By continuing, you agree to our{' '}
              <Link href="/legal/terms" className="text-harmonix-gold hover:text-harmonix-gold/80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-harmonix-gold hover:text-harmonix-gold/80">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}