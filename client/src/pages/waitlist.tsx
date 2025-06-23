import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, DollarSign, Users, Zap, Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const benefits = [
  {
    icon: DollarSign,
    title: "30% Early Bird Discount",
    description: "Save thousands on your AI agent deployment"
  },
  {
    icon: Users,
    title: "Priority Access",
    description: "First in line when we launch new agent capabilities"
  },
  {
    icon: Zap,
    title: "Custom Setup",
    description: "Personalized onboarding and agent configuration"
  },
  {
    icon: Clock,
    title: "Launch Timeline",
    description: "Get access 30 days before general availability"
  }
];

const depositOptions = [
  {
    amount: 0,
    title: "Free Waitlist",
    description: "Reserve your spot at no cost",
    benefits: ["30% discount when launched", "Email updates", "Early access notification"]
  },
  {
    amount: 444,
    title: "Priority Reserve",
    description: "Secure your position with refundable deposit",
    benefits: ["Everything in Free", "Guaranteed spot in first 280", "Personal onboarding call", "Custom agent consultation"]
  }
];

export default function Waitlist() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    industry: "",
    teamSize: "",
    interests: "",
    goals: ""
  });
  const [selectedDeposit, setSelectedDeposit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedDeposit > 0) {
        // Redirect to payment for deposit
        window.location.href = `/checkout?deposit=${selectedDeposit}&email=${formData.email}`;
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-harmonix-deep-forest">
        <Navbar />
        <div className="pt-20 pb-16">
          <section className="py-16 sm:py-20">
            <div className="harmonix-container">
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <CheckCircle className="w-16 h-16 text-harmonix-regal-gold mx-auto mb-4" />
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white font-serif">
                    Welcome to the Waitlist!
                  </h1>
                  <p className="text-lg text-harmonix-sage-fade">
                    You're secured for 30% early bird pricing when we launch
                  </p>
                </div>

                <Card className="harmonix-card-enhanced">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-harmonix-regal-gold mb-4">
                          What Happens Next?
                        </h3>
                        <div className="text-left space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-harmonix-regal-gold rounded-full"></div>
                            <span className="text-harmonix-sage-fade">
                              Check your email for confirmation and early access updates
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-harmonix-regal-gold rounded-full"></div>
                            <span className="text-harmonix-sage-fade">
                              Get exclusive previews of new agent capabilities
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-harmonix-regal-gold rounded-full"></div>
                            <span className="text-harmonix-sage-fade">
                              Receive your 30% discount code 48 hours before public launch
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                          onClick={() => window.location.href = '/demo'}
                        >
                          Explore Platform Demo
                        </Button>
                        <Button 
                          variant="outline"
                          className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                          onClick={() => window.location.href = '/'}
                        >
                          Return Home
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6">
                Reserve My Spot
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                Join the AI Revolution
                <span className="text-harmonix-regal-gold block">With 30% Off</span>
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Be among the first 280 businesses to transform operations with Harmonix AI agents. 
                Secure early bird pricing and priority access to the future of business automation.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {benefits.map((benefit, index) => (
                <Card key={index} className="harmonix-card-enhanced text-center">
                  <CardContent className="p-6">
                    <benefit.icon className="w-8 h-8 text-harmonix-regal-gold mx-auto mb-4" />
                    <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-harmonix-sage-fade">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Deposit Selection */}
        <section className="py-16">
          <div className="harmonix-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-harmonix-regal-gold font-serif">
                Choose Your Reservation Level
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {depositOptions.map((option) => (
                  <Card 
                    key={option.amount}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedDeposit === option.amount 
                        ? "ring-2 ring-harmonix-regal-gold bg-harmonix-regal-gold/5" 
                        : "hover:border-harmonix-regal-gold/50"
                    }`}
                    onClick={() => setSelectedDeposit(option.amount)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{option.title}</CardTitle>
                        <div className="text-2xl font-bold text-harmonix-regal-gold">
                          {option.amount === 0 ? "Free" : `$${option.amount}`}
                        </div>
                      </div>
                      <p className="text-harmonix-sage-fade">{option.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {option.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-harmonix-regal-gold" />
                            <span className="text-sm text-harmonix-sage-fade">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Form */}
        <section className="py-16 bg-harmonix-night-pine/50">
          <div className="harmonix-container">
            <div className="max-w-2xl mx-auto">
              <Card className="harmonix-card-enhanced">
                <CardHeader>
                  <CardTitle className="text-2xl text-white text-center">
                    Complete Your Reservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-harmonix-sage-fade">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-harmonix-sage-fade">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-harmonix-sage-fade">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company" className="text-harmonix-sage-fade">
                          Company Name *
                        </Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-harmonix-sage-fade">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="industry" className="text-harmonix-sage-fade">
                          Industry *
                        </Label>
                        <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                          <SelectTrigger className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saas">SaaS/Technology</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="teamSize" className="text-harmonix-sage-fade">
                          Team Size
                        </Label>
                        <Select value={formData.teamSize} onValueChange={(value) => handleInputChange("teamSize", value)}>
                          <SelectTrigger className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white">
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="200+">200+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="goals" className="text-harmonix-sage-fade">
                        Primary Goals (Optional)
                      </Label>
                      <Textarea
                        id="goals"
                        value={formData.goals}
                        onChange={(e) => handleInputChange("goals", e.target.value)}
                        placeholder="What do you hope to achieve with AI agents?"
                        className="mt-2 bg-harmonix-night-pine border-harmonix-sage-fade/30 text-white"
                        rows={3}
                      />
                    </div>

                    <Alert className="border-harmonix-regal-gold/30 bg-harmonix-regal-gold/10">
                      <AlertDescription className="text-harmonix-regal-gold">
                        {selectedDeposit === 0 
                          ? "By joining the free waitlist, you'll receive 30% early bird pricing when we launch."
                          : `Your $${selectedDeposit} deposit is fully refundable and will be applied to your final purchase.`
                        }
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                    >
                      {loading ? (
                        "Processing..."
                      ) : selectedDeposit === 0 ? (
                        "Join Free Waitlist"
                      ) : (
                        <>
                          Reserve with ${selectedDeposit} Deposit
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-harmonix-sage-fade text-center">
                      By submitting, you agree to our{" "}
                      <a href="/legal/privacy" className="text-harmonix-regal-gold hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="/legal/terms" className="text-harmonix-regal-gold hover:underline">
                        Terms of Service
                      </a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}