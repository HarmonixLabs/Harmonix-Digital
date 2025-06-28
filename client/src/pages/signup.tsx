import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { createErrorToast, useFormErrorHandler } from "@/lib/errors";
import { Eye, EyeOff, Chrome, Wallet, ArrowRight, Building } from "lucide-react";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth(); // Use register instead of signup for consistency
  const { toast } = useToast();
  const { handleError } = useFormErrorHandler();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFieldErrors({}); // Clear previous errors

    try {
      await register(formData.email, formData.password, formData.name, undefined, formData.company);
      toast({
        title: "Welcome to Harmonix!",
        description: "Your account has been created successfully.",
      });
      setLocation("/dashboard");
    } catch (error) {
      const errorMessage = handleError(error, (field, message) => {
        setFieldErrors(prev => ({ ...prev, [field]: message }));
      });
      
      toast(createErrorToast(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Google Sign-Up",
      description: "Google authentication will be available soon.",
    });
  };

  const handleWalletSignup = () => {
    toast({
      title: "Wallet Sign-Up",
      description: "Crypto wallet authentication will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-harmony-dark flex items-center justify-center py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
      
      <div className="w-full max-w-md relative">
        <Card className="bg-gray-900/50 border-harmony-gold/30 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <HarmonixLogo size="lg" variant="gold" showText={false} />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white font-serif">
                Join Harmony
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                Create your account for intelligent systems
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Signup Options */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-gray-600 text-white hover:border-harmony-gold hover:text-harmony-gold"
                onClick={handleGoogleSignup}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-600 text-white hover:border-harmony-gold hover:text-harmony-gold"
                onClick={handleWalletSignup}
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
                <span className="bg-gray-900 px-2 text-gray-400">Or create account with email</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-300">Company</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-300">Role</Label>
                  <Select onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO/Founder</SelectItem>
                      <SelectItem value="cto">CTO</SelectItem>
                      <SelectItem value="coo">COO</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Link href="/login" className="text-sm text-harmony-gold hover:text-harmony-gold/80">
                  Already have an account? Sign in
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold"
                size="lg"
              >
                {isLoading ? "Creating account..." : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              By creating an account, you agree to our{" "}
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