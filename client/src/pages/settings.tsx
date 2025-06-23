import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  CreditCard, 
  Palette, 
  Shield, 
  Link as LinkIcon,
  Wallet,
  Mail,
  Phone,
  Globe,
  Calendar,
  Zap,
  Settings as SettingsIcon
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || "",
      email: user?.email || "",
      bio: "",
      company: "",
      role: "",
      industry: "",
      avatar: user?.avatar || ""
    },
    notifications: {
      email: {
        agentUpdates: true,
        taskCompletion: true,
        systemAlerts: true,
        marketplaceUpdates: false,
        weeklyReports: true
      },
      push: {
        agentAlerts: true,
        taskNotifications: true,
        emergencyAlerts: true
      },
      sms: {
        enabled: false,
        criticalOnly: true
      }
    },
    billing: {
      plan: "pro",
      autoRecharge: true,
      rechargeThreshold: 100,
      rechargeAmount: 500
    },
    integrations: {
      calendar: { connected: false, provider: "" },
      email: { connected: false, provider: "" },
      crm: { connected: false, provider: "" },
      storage: { connected: false, provider: "" }
    },
    preferences: {
      theme: "dark",
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY"
    }
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Updated",
        description: `Your ${section} settings have been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    { id: "basic", name: "Basic", price: "$29/month", features: ["3 Agents", "1,000 Tasks/month", "Basic Support"] },
    { id: "pro", name: "Pro", price: "$99/month", features: ["10 Agents", "10,000 Tasks/month", "Priority Support", "Advanced Analytics"] },
    { id: "enterprise", name: "Enterprise", price: "Custom", features: ["Unlimited Agents", "Unlimited Tasks", "24/7 Support", "Custom Integrations"] }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-harmony-dark">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto bg-gray-900/50 border-harmony-gold/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-harmony-gold font-serif">Access Required</CardTitle>
              <CardDescription className="text-gray-300">
                Please log in to access settings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white font-serif mb-4">
              Account <span className="text-harmony-gold">Settings</span>
            </h1>
            <p className="text-xl text-gray-300">
              Manage your profile, preferences, and platform configuration
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-gray-900/50">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="data-[state=active]:bg-harmony-gold data-[state=active]:text-harmony-dark"
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Profile Information</CardTitle>
                  <CardDescription className="text-gray-300">
                    Update your personal and professional details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: {...settings.profile, name: e.target.value}
                        })}
                        className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: {...settings.profile, email: e.target.value}
                        })}
                        className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-300">Company</Label>
                      <Input
                        id="company"
                        value={settings.profile.company}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: {...settings.profile, company: e.target.value}
                        })}
                        className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-300">Role</Label>
                      <Input
                        id="role"
                        value={settings.profile.role}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: {...settings.profile, role: e.target.value}
                        })}
                        className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and your work..."
                      value={settings.profile.bio}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: {...settings.profile, bio: e.target.value}
                      })}
                      className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={() => handleSave("profile")}
                    disabled={isLoading}
                    className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
                  >
                    Save Profile Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Security</CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                    <Shield className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                    <Shield className="mr-2 h-4 w-4" />
                    Enable Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Email Notifications</CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure what you want to receive via email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <p className="text-sm text-gray-400">
                          {key === 'agentUpdates' && 'Get notified when your agents complete tasks or need attention'}
                          {key === 'taskCompletion' && 'Receive updates when automated tasks finish'}
                          {key === 'systemAlerts' && 'Important system maintenance and security alerts'}
                          {key === 'marketplaceUpdates' && 'New agents and marketplace announcements'}
                          {key === 'weeklyReports' && 'Weekly performance summaries and insights'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: {...settings.notifications.email, [key]: checked}
                          }
                        })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Push Notifications</CardTitle>
                  <CardDescription className="text-gray-300">
                    Real-time notifications in your browser
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.notifications.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            push: {...settings.notifications.push, [key]: checked}
                          }
                        })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button 
                onClick={() => handleSave("notifications")}
                disabled={isLoading}
                className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
              >
                Save Notification Settings
              </Button>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Current Plan</CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage your subscription and usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <Card 
                        key={plan.id}
                        className={`cursor-pointer transition-colors ${
                          settings.billing.plan === plan.id
                            ? "bg-harmony-gold/10 border-harmony-gold"
                            : "bg-gray-800/50 border-gray-700 hover:border-harmony-gold/50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h3 className="font-semibold text-white mb-2">{plan.name}</h3>
                            <p className="text-harmony-gold font-bold text-lg mb-3">{plan.price}</p>
                            <ul className="text-sm text-gray-400 space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                            {settings.billing.plan === plan.id && (
                              <Badge className="bg-harmony-gold text-harmony-dark mt-3">
                                Current Plan
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Token Auto-Recharge</h3>
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Enable Auto-Recharge</Label>
                      <Switch
                        checked={settings.billing.autoRecharge}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          billing: {...settings.billing, autoRecharge: checked}
                        })}
                      />
                    </div>
                    
                    {settings.billing.autoRecharge && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Recharge When Below</Label>
                          <Input
                            type="number"
                            value={settings.billing.rechargeThreshold}
                            onChange={(e) => setSettings({
                              ...settings,
                              billing: {...settings.billing, rechargeThreshold: parseInt(e.target.value)}
                            })}
                            className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Recharge Amount</Label>
                          <Input
                            type="number"
                            value={settings.billing.rechargeAmount}
                            onChange={(e) => setSettings({
                              ...settings,
                              billing: {...settings.billing, rechargeAmount: parseInt(e.target.value)}
                            })}
                            className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={() => handleSave("billing")}
                disabled={isLoading}
                className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
              >
                Save Billing Settings
              </Button>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Connected Services</CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage your third-party service integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: 'calendar', name: 'Calendar', icon: Calendar, description: 'Google Calendar, Outlook' },
                    { key: 'email', name: 'Email', icon: Mail, description: 'Gmail, Outlook, Exchange' },
                    { key: 'crm', name: 'CRM', icon: Globe, description: 'Salesforce, HubSpot, Pipedrive' },
                    { key: 'storage', name: 'Cloud Storage', icon: LinkIcon, description: 'Google Drive, Dropbox, OneDrive' }
                  ].map((integration) => (
                    <div key={integration.key} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                          <integration.icon className="h-5 w-5 text-harmony-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{integration.name}</h4>
                          <p className="text-sm text-gray-400">{integration.description}</p>
                        </div>
                      </div>
                      <Button
                        variant={settings.integrations[integration.key as keyof typeof settings.integrations].connected ? "outline" : "default"}
                        className={settings.integrations[integration.key as keyof typeof settings.integrations].connected 
                          ? "border-red-500 text-red-500 hover:bg-red-500/10" 
                          : "bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
                        }
                      >
                        {settings.integrations[integration.key as keyof typeof settings.integrations].connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-harmony-gold font-serif">Platform Preferences</CardTitle>
                  <CardDescription className="text-gray-300">
                    Customize your Harmonix experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Theme</Label>
                      <Select value={settings.preferences.theme} onValueChange={(value) => setSettings({
                        ...settings,
                        preferences: {...settings.preferences, theme: value}
                      })}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Language</Label>
                      <Select value={settings.preferences.language} onValueChange={(value) => setSettings({
                        ...settings,
                        preferences: {...settings.preferences, language: value}
                      })}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Timezone</Label>
                      <Select value={settings.preferences.timezone} onValueChange={(value) => setSettings({
                        ...settings,
                        preferences: {...settings.preferences, timezone: value}
                      })}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Date Format</Label>
                      <Select value={settings.preferences.dateFormat} onValueChange={(value) => setSettings({
                        ...settings,
                        preferences: {...settings.preferences, dateFormat: value}
                      })}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-harmony-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave("preferences")}
                    disabled={isLoading}
                    className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90"
                  >
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}