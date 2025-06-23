import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard or previous page
      window.location.href = '/dashboard';
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <section className="py-16 sm:py-20">
          <div className="harmonix-container">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white font-serif">
                  Welcome Back
                </h1>
                <p className="text-lg text-harmonix-sage-fade">
                  Sign in to access your AI agent platform
                </p>
              </div>

              {/* Sign In Form */}
              <Card className="harmonix-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-xl text-white text-center">
                    Member Login Portal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert className="border-red-500/50 bg-red-500/10">
                        <AlertDescription className="text-red-400">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-harmonix-sage-fade">
                          Email Address
                        </Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-harmonix-sage-fade" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="pl-10 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="password" className="text-harmonix-sage-fade">
                          Password
                        </Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-harmonix-sage-fade" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-harmonix-sage-fade hover:text-white"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          id="remember"
                          type="checkbox"
                          className="w-4 h-4 text-harmonix-regal-gold bg-harmonix-night-pine border-harmonix-sage-fade/30 rounded focus:ring-harmonix-regal-gold"
                        />
                        <Label htmlFor="remember" className="text-sm text-harmonix-sage-fade">
                          Remember me
                        </Label>
                      </div>
                      <Link href="/forgot-password">
                        <span className="text-sm text-harmonix-regal-gold hover:underline">
                          Forgot password?
                        </span>
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90 disabled:opacity-50"
                    >
                      {loading ? (
                        "Signing in..."
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-harmonix-sage-fade/30" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-harmonix-deep-forest text-harmonix-sage-fade">
                        New to Harmonix?
                      </span>
                    </div>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center space-y-4">
                    <Link href="/signup">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                      >
                        Create New Account
                      </Button>
                    </Link>
                    
                    <div className="text-sm text-harmonix-sage-fade">
                      Or{" "}
                      <Link href="/demo">
                        <span className="text-harmonix-regal-gold hover:underline">
                          try a demo first
                        </span>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Links */}
              <div className="text-center mt-8 space-y-2">
                <p className="text-sm text-harmonix-sage-fade">
                  Having trouble signing in?{" "}
                  <Link href="/support">
                    <span className="text-harmonix-regal-gold hover:underline">
                      Contact Support
                    </span>
                  </Link>
                </p>
                <p className="text-sm text-harmonix-sage-fade">
                  <Link href="/legal/privacy">
                    <span className="text-harmonix-regal-gold hover:underline">
                      Privacy Policy
                    </span>
                  </Link>
                  {" • "}
                  <Link href="/legal/terms">
                    <span className="text-harmonix-regal-gold hover:underline">
                      Terms of Service
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}