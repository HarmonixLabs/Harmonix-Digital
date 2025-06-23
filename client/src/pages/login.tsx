import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { HarmonixLogo } from "@/components/harmonix-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Chrome, Wallet, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to Harmony.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Sign-In",
      description: "Google authentication will be available soon.",
    });
  };

  const handleWalletLogin = () => {
    toast({
      title: "Wallet Sign-In",
      description: "Crypto wallet authentication will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-harmony-dark flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
      
      <div className="w-full max-w-md relative">
        <Card className="bg-gray-900/50 border-harmony-gold/30 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <HarmonixLogo size="lg" variant="gold" showText={false} />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white font-serif">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                Sign in to your Harmony platform
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Options */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-gray-600 text-white hover:border-harmony-gold hover:text-harmony-gold"
                onClick={handleGoogleLogin}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-600 text-white hover:border-harmony-gold hover:text-harmony-gold"
                onClick={handleWalletLogin}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Crypto Wallet
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-harmony-gold hover:text-harmony-gold/80">
                  Forgot password?
                </Link>
                <Link href="/signup" className="text-sm text-harmony-gold hover:text-harmony-gold/80">
                  Need an account?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold"
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-harmony-gold hover:text-harmony-gold/80">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-harmony-gold hover:text-harmony-gold/80">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}