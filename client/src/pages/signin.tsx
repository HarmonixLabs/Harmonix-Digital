import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Eye, EyeOff, Sparkles, Shield } from "lucide-react";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Welcome Back!",
        description: "Accessing your Harmonix dashboard...",
      });
      
      // Redirect to dashboard would happen here
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-deep-space-black">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-jade-forest/20 via-transparent to-harmonix-gold/10"></div>
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <HarmonixLogo variant="monogram" className="w-16 h-16" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-jade-forest/80">
                Access your intelligent automation dashboard
              </p>
            </div>

            {/* Sign In Form */}
            <Card className="bg-jade-forest/5 border-harmonix-gold/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-harmonix-gold">
                  Sign In to Harmonix
                </CardTitle>
                <CardDescription className="text-jade-forest/80">
                  Continue your automation journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <WhimsicalLoader variant="sacred" size="lg" />
                    <p className="text-jade-forest/80 mt-4">Authenticating...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-jade-forest">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-jade-forest">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                          className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-jade-forest/60 hover:text-harmonix-gold"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 text-jade-forest/80">
                        <input type="checkbox" className="rounded border-jade-forest/30" />
                        <span>Remember me</span>
                      </label>
                      <Link href="/forgot-password" className="text-harmonix-gold hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-gradient-to-r from-harmonix-gold to-harmonix-gold/80 text-deep-space-black hover:from-harmonix-gold/90 hover:to-harmonix-gold/70 font-semibold"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Access Dashboard
                    </Button>

                    <div className="text-center text-sm text-jade-forest/60">
                      Don't have an account?{" "}
                      <Link href="/signup" className="text-harmonix-gold hover:underline font-semibold">
                        Join the Revolution
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-xs text-jade-forest/60">
                Protected by enterprise-grade security
              </p>
              <div className="flex justify-center space-x-4 text-xs text-jade-forest/40">
                <span>256-bit SSL encryption</span>
                <span>•</span>
                <span>SOC 2 compliant</span>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}