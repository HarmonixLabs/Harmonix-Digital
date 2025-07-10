import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard, Sparkles, Crown, Zap, Timer, DollarSign, Package } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
  userEmail?: string;
  userName?: string;
}

export function DepositModal({ isOpen, onClose, agentId, agentName, userEmail, userName }: DepositModalProps) {
  const [depositType, setDepositType] = useState<"reservation" | "package">("reservation");
  const [packageTier, setPackageTier] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState({
    email: userEmail || "",
    firstName: userName?.split(" ")[0] || "",
    lastName: userName?.split(" ")[1] || "",
    phone: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const packageTiers = {
    starter: {
      name: "Starter Package",
      agents: "1 Agent",
      total: 4400,
      deposit: 1320, // 30% of discounted price
      discount: 660, // 15% early bird
      features: ["Sales Agent CA$H", "Basic CRM integration", "Email support"]
    },
    growth: {
      name: "Growth Package", 
      agents: "3-5 Agents",
      total: 8000,
      deposit: 2400,
      discount: 1200,
      features: ["Multiple agents", "Advanced automation", "Priority support"]
    },
    expansion: {
      name: "Expansion Package",
      agents: "6-8 Agents",
      total: 15000,
      deposit: 4500,
      discount: 2250,
      features: ["Full agent suite", "Custom workflows", "Dedicated manager"]
    },
    enterprise: {
      name: "Enterprise Package",
      agents: "9-12 Agents", 
      total: 21500,
      deposit: 6450,
      discount: 3225,
      features: ["Complete platform", "White-label", "24/7 support"]
    }
  };

  const handleDeposit = async () => {
    if (!customerInfo.email || !customerInfo.firstName) {
      toast({
        title: "Missing Information",
        description: "Please provide email and name",
        variant: "destructive"
      });
      return;
    }

    if (depositType === "package" && !packageTier) {
      toast({
        title: "Select Package",
        description: "Please choose a package tier",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const endpoint = depositType === "reservation" 
        ? "/api/stripe/create-reservation"
        : "/api/stripe/create-package-deposit";

      const payload = depositType === "reservation" 
        ? {
            agentId,
            customerEmail: customerInfo.email,
            customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          }
        : {
            packageTier,
            customerEmail: customerInfo.email,
            customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create deposit session');
      }

    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Error",
        description: "Failed to process deposit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-harmonix-gold" />
            Secure Your {agentName} Access
          </DialogTitle>
          <DialogDescription>
            Choose your preferred deposit option to lock in early bird pricing and priority installation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={customerInfo.firstName}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={customerInfo.lastName}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Deposit Options */}
          <Tabs value={depositType} onValueChange={(value) => setDepositType(value as "reservation" | "package")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reservation" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Agent Reservation
              </TabsTrigger>
              <TabsTrigger value="package" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Package Deposit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservation" className="space-y-4">
              <Card className="border-2 border-harmonix-gold/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-harmonix-gold" />
                    $444 Agent Reservation
                  </CardTitle>
                  <CardDescription>
                    Reserve your {agentName} with no package commitment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-harmonix-gold/10 rounded-lg">
                      <span className="font-medium">Reservation Deposit</span>
                      <span className="text-2xl font-bold text-harmonix-gold">$444</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Priority installation queue</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Agent reserved for 30 days</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>No package commitment required</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Installation team contact within 24 hours</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="package" className="space-y-4">
              <div className="space-y-4">
                <Label>Select Package Tier</Label>
                <Select value={packageTier} onValueChange={setPackageTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your package" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(packageTiers).map(([key, tier]) => (
                      <SelectItem key={key} value={key}>
                        {tier.name} - {tier.agents}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {packageTier && (
                  <Card className="border-2 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-500" />
                        {packageTiers[packageTier as keyof typeof packageTiers].name}
                      </CardTitle>
                      <CardDescription>
                        30% deposit + 15% early bird discount locked in
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-green-500/10 rounded-lg">
                          <div>
                            <div className="text-sm text-gray-500">Original Price</div>
                            <div className="line-through">${packageTiers[packageTier as keyof typeof packageTiers].total.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Early Bird Discount</div>
                            <div className="text-green-500">-${packageTiers[packageTier as keyof typeof packageTiers].discount.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">30% Deposit</div>
                            <div className="text-2xl font-bold text-green-500">${packageTiers[packageTier as keyof typeof packageTiers].deposit.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Remaining Balance</div>
                            <div>${(packageTiers[packageTier as keyof typeof packageTiers].total - packageTiers[packageTier as keyof typeof packageTiers].discount - packageTiers[packageTier as keyof typeof packageTiers].deposit).toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {packageTiers[packageTier as keyof typeof packageTiers].features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 text-sm">
                            <Timer className="w-4 h-4 text-orange-500" />
                            <span>Installation within 12 hours</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Crown className="w-4 h-4 text-harmonix-gold" />
                            <span>15% discount locked for life</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Button */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit}
              className="flex-1 bg-harmonix-gold hover:bg-harmonix-gold/90 text-black"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {depositType === "reservation" ? "Reserve for $444" : "Lock Package with Deposit"}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}