import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cookie, Shield, BarChart3, Target, Settings, CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const cookieCategories = [
  {
    id: "essential",
    name: "Essential Cookies",
    icon: Shield,
    required: true,
    description: "Necessary for basic website functionality and security",
    examples: [
      "Authentication tokens",
      "Session management", 
      "Security preferences",
      "Load balancing"
    ]
  },
  {
    id: "analytics", 
    name: "Analytics Cookies",
    icon: BarChart3,
    required: false,
    description: "Help us understand how you use our platform to improve services",
    examples: [
      "Page view tracking",
      "Feature usage statistics",
      "Performance monitoring",
      "Error reporting"
    ]
  },
  {
    id: "marketing",
    name: "Marketing Cookies", 
    icon: Target,
    required: false,
    description: "Enable personalized marketing and advertising experiences",
    examples: [
      "Campaign tracking",
      "Conversion measurement",
      "Retargeting pixels",
      "Social media integration"
    ]
  },
  {
    id: "preferences",
    name: "Preference Cookies",
    icon: Settings,
    required: false,
    description: "Remember your settings and preferences for a better experience",
    examples: [
      "Language preferences",
      "Theme settings",
      "Dashboard layouts",
      "Notification preferences"
    ]
  }
];

export default function Cookies() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (category: string) => {
    if (category === "essential") return; // Cannot disable essential cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    // Save preferences to localStorage or send to server
    localStorage.setItem("harmonix-cookie-preferences", JSON.stringify(cookieSettings));
    setSaved(true);
    
    // Set a timeout to hide the success message
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCookieSettings(allAccepted);
    localStorage.setItem("harmonix-cookie-preferences", JSON.stringify(allAccepted));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const rejectOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCookieSettings(essentialOnly);
    localStorage.setItem("harmonix-cookie-preferences", JSON.stringify(essentialOnly));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6">
                Privacy Compliance
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                Cookie & Tracking Policy
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Transparent information about how we use cookies and tracking technologies 
                to enhance your experience on the Harmonix platform.
              </p>
              <p className="text-sm text-harmonix-sage-fade mt-4">
                Last updated: June 23, 2025
              </p>
            </div>

            {/* Cookie Management Panel */}
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="harmonix-card-enhanced">
                <CardHeader className="text-center">
                  <Cookie className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-4" />
                  <CardTitle className="text-2xl text-white">
                    Manage Your Cookie Preferences
                  </CardTitle>
                  <p className="text-harmonix-sage-fade">
                    Control which cookies and tracking technologies you allow
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {saved && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <AlertDescription className="text-green-400">
                        Your cookie preferences have been saved successfully.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    {cookieCategories.map((category) => (
                      <Card key={category.id} className="bg-harmonix-night-pine/30">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <category.icon className="w-6 h-6 text-harmonix-regal-gold mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-lg font-semibold text-white">
                                    {category.name}
                                  </h3>
                                  {category.required && (
                                    <Badge variant="outline" className="text-xs border-harmonix-regal-gold/30 text-harmonix-regal-gold">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-harmonix-sage-fade text-sm mb-3">
                                  {category.description}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {category.examples.map((example, index) => (
                                    <div key={index} className="flex items-center space-x-1">
                                      <div className="w-1 h-1 bg-harmonix-regal-gold rounded-full"></div>
                                      <span className="text-xs text-harmonix-sage-fade">{example}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Switch
                                checked={cookieSettings[category.id as keyof typeof cookieSettings]}
                                onCheckedChange={() => handleToggle(category.id)}
                                disabled={category.required}
                                className="data-[state=checked]:bg-harmonix-regal-gold"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-harmonix-sage-fade/20">
                    <Button
                      onClick={savePreferences}
                      className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                    >
                      Save Preferences
                    </Button>
                    <Button
                      onClick={acceptAll}
                      variant="outline"
                      className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                    >
                      Accept All
                    </Button>
                    <Button
                      onClick={rejectOptional}
                      variant="outline"
                      className="touch-friendly-btn border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
                    >
                      Essential Only
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Detailed Cookie Information */}
        <section className="py-16">
          <div className="harmonix-container">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">

                {/* What Are Cookies */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      What Are Cookies?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-harmonix-sage-fade">
                      Cookies are small text files stored on your device when you visit our website. They help us provide 
                      a better, more personalized experience by remembering your preferences and understanding how you use our platform.
                    </p>
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Types of Data We Collect</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Session identifiers and authentication status</li>
                          <li>User preferences and dashboard settings</li>
                          <li>Feature usage patterns and interaction data</li>
                        </ul>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Performance metrics and error reporting</li>
                          <li>Marketing campaign effectiveness data</li>
                          <li>Device and browser information</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Third-Party Services */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      Third-Party Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-harmonix-sage-fade">
                      We integrate with trusted third-party services that may set their own cookies. 
                      You can manage these through your browser settings or the service provider's opt-out tools.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Analytics Services</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Google Analytics (usage tracking)</li>
                          <li>Mixpanel (feature analytics)</li>
                          <li>Hotjar (user experience insights)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Functional Services</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Stripe (payment processing)</li>
                          <li>Intercom (customer support)</li>
                          <li>Calendly (appointment scheduling)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Rights & Controls */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      Your Rights & Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Browser Controls</h4>
                      <p className="text-harmonix-sage-fade text-sm mb-4">
                        Most browsers allow you to control cookies through their settings. You can:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                        <li>Block all cookies or only third-party cookies</li>
                        <li>Delete existing cookies from your device</li>
                        <li>Set notifications when cookies are being used</li>
                        <li>Browse in private/incognito mode</li>
                      </ul>
                    </div>
                    
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Impact of Disabling Cookies</h4>
                      <p className="text-harmonix-sage-fade text-sm">
                        Disabling cookies may affect your experience on our platform. Essential cookies are required for 
                        basic functionality, while optional cookies enhance features like personalization and analytics.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact & Updates */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      Updates & Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Policy Updates</h4>
                      <p className="text-harmonix-sage-fade text-sm">
                        We may update this cookie policy to reflect changes in our practices or legal requirements. 
                        Updates will be posted on this page with a revised "last updated" date.
                      </p>
                    </div>
                    
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Questions or Concerns</h4>
                      <p className="text-harmonix-sage-fade text-sm mb-3">
                        If you have questions about our cookie practices or need help managing your preferences:
                      </p>
                      <div className="space-y-1 text-harmonix-sage-fade text-sm">
                        <p><strong>Privacy Team:</strong> privacy@harmonixdigital.com</p>
                        <p><strong>Support:</strong> Available through in-platform chat</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}