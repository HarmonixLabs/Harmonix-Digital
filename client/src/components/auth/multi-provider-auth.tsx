import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  Loader2,
  Smartphone,
  Fingerprint,
  Shield
} from 'lucide-react';
import { GoogleIcon, AppleIcon, MicrosoftIcon } from '@/components/icons/provider-icons';

interface AuthProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

export function MultiProviderAuth({ mode, onSuccess }: AuthProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneVerification, setPhoneVerification] = useState<{
    sent: boolean;
    verificationId: string | null;
  }>({ sent: false, verificationId: null });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    verificationCode: '',
    name: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');

    try {
      const endpoint = mode === 'signin' ? '/api/auth/signin' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: mode === 'signup' ? formData.name : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('harmonix_token', data.accessToken);
        toast({
          title: mode === 'signin' ? 'Welcome back!' : 'Account created!',
          description: mode === 'signin' ? 'You have been signed in successfully.' : 'Your account has been created successfully.',
        });
        onSuccess?.();
        setLocation('/dashboard');
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading('google');
    
    try {
      // Initialize Google OAuth
      window.location.href = '/api/auth/google';
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Error',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(null);
    }
  };

  const handleAppleAuth = async () => {
    setLoading('apple');
    toast({
      title: 'Coming Soon',
      description: 'Apple Sign-In will be available soon.',
      variant: 'default',
    });
    setLoading(null);
  };

  const handleMicrosoftAuth = async () => {
    setLoading('microsoft');
    toast({
      title: 'Coming Soon', 
      description: 'Microsoft Sign-In will be available soon.',
      variant: 'default',
    });
    setLoading(null);
  };

  const handlePhoneAuth = async () => {
    if (!phoneVerification.sent) {
      // Send SMS code
      setLoading('phone');
      
      try {
        const response = await fetch('/api/auth/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: formData.phone })
        });

        const data = await response.json();

        if (response.ok) {
          setPhoneVerification({
            sent: true,
            verificationId: data.verificationId
          });
          toast({
            title: 'Code Sent',
            description: 'Check your phone for the verification code.',
          });
        } else {
          throw new Error(data.error || 'Failed to send code');
        }
      } catch (error: any) {
        toast({
          title: 'SMS Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(null);
      }
    } else {
      // Verify SMS code
      setLoading('phone-verify');
      
      try {
        const response = await fetch('/api/auth/sms/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verificationId: phoneVerification.verificationId,
            code: formData.verificationCode,
            phoneNumber: formData.phone
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('harmonix_token', data.accessToken);
          toast({
            title: 'Phone Verified!',
            description: 'You have been signed in successfully.',
          });
          onSuccess?.();
          setLocation('/dashboard');
        } else {
          throw new Error(data.error || 'Invalid verification code');
        }
      } catch (error: any) {
        toast({
          title: 'Verification Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(null);
      }
    }
  };

  const handlePasskeyAuth = async () => {
    setLoading('passkey');
    toast({
      title: 'Coming Soon',
      description: 'Passkey authentication will be available soon.',
      variant: 'default',
    });
    setLoading(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-[#002a2d]/80 border-[#D8C9A9]/30">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#D8C9A9]">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-[#D8C9A9]/70">
          {mode === 'signin' 
            ? 'Sign in to your Harmonix account' 
            : 'Join the Harmonix AI platform'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* OAuth Providers */}
        <div className="space-y-3">
          <Button 
            onClick={handleGoogleAuth}
            disabled={!!loading}
            className="w-full bg-white text-black hover:bg-gray-100 transition-colors"
          >
            {loading === 'google' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <GoogleIcon className="w-4 h-4 mr-2" />
            )}
            Continue with Google
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleAppleAuth}
              disabled={!!loading}
              variant="outline"
              className="border-[#D8C9A9]/30 text-[#D8C9A9] hover:bg-[#D8C9A9]/10"
            >
              {loading === 'apple' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <AppleIcon className="w-4 h-4" />
              )}
            </Button>
            
            <Button 
              onClick={handleMicrosoftAuth}
              disabled={!!loading}
              variant="outline"
              className="border-[#D8C9A9]/30 text-[#D8C9A9] hover:bg-[#D8C9A9]/10"
            >
              {loading === 'microsoft' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MicrosoftIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#D8C9A9]/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#002a2d] px-2 text-[#D8C9A9]/60">Or continue with</span>
          </div>
        </div>

        {/* Alternative Auth Methods */}
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1b1b1b]/50">
            <TabsTrigger value="email" className="text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="passkey" className="text-xs">
              <Fingerprint className="w-3 h-3 mr-1" />
              Passkey
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4 mt-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#D8C9A9]">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-[#1b1b1b]/50 border-[#D8C9A9]/30 text-[#D8C9A9]"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#D8C9A9]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-[#1b1b1b]/50 border-[#D8C9A9]/30 text-[#D8C9A9]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#D8C9A9]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-[#1b1b1b]/50 border-[#D8C9A9]/30 text-[#D8C9A9] pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-[#D8C9A9]/60 hover:text-[#D8C9A9]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={!!loading}
                className="w-full bg-[#D8C9A9] text-[#002a2d] hover:bg-[#D8C9A9]/90"
              >
                {loading === 'email' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="phone" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#D8C9A9]">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-[#1b1b1b]/50 border-[#D8C9A9]/30 text-[#D8C9A9]"
                  disabled={phoneVerification.sent}
                  required
                />
              </div>
              
              {phoneVerification.sent && (
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-[#D8C9A9]">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    value={formData.verificationCode}
                    onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                    placeholder="123456"
                    className="bg-[#1b1b1b]/50 border-[#D8C9A9]/30 text-[#D8C9A9]"
                    maxLength={6}
                    required
                  />
                </div>
              )}
              
              <Button 
                onClick={handlePhoneAuth}
                disabled={!!loading || (!formData.phone && !phoneVerification.sent)}
                className="w-full bg-[#D8C9A9] text-[#002a2d] hover:bg-[#D8C9A9]/90"
              >
                {(loading === 'phone' || loading === 'phone-verify') ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Smartphone className="w-4 h-4 mr-2" />
                )}
                {phoneVerification.sent ? 'Verify Code' : 'Send Code'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="passkey" className="space-y-4 mt-4">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-[#D8C9A9]/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#D8C9A9]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#D8C9A9] mb-2">Biometric Sign-In</h3>
                <p className="text-sm text-[#D8C9A9]/70 mb-4">
                  Use Face ID, Touch ID, or Windows Hello for secure access
                </p>
                <Badge className="bg-yellow-500/20 text-yellow-500 mb-4">
                  Coming Soon
                </Badge>
              </div>
              
              <Button 
                onClick={handlePasskeyAuth}
                disabled={!!loading}
                className="w-full bg-[#D8C9A9] text-[#002a2d] hover:bg-[#D8C9A9]/90"
              >
                {loading === 'passkey' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Fingerprint className="w-4 h-4 mr-2" />
                )}
                Sign In with Passkey
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}