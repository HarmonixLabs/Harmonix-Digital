import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Crown, 
  Zap,
  TrendingUp,
  Users,
  Clock,
  ExternalLink,
  Download,
  RefreshCw,
  X,
  Shield,
  Star,
  BarChart
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Subscription {
  id: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: Array<{
    price_id: string;
    quantity: number;
    amount: number;
  }>;
}

interface SubscriptionStatus {
  status: 'none' | 'active' | 'canceled' | 'past_due' | 'unpaid';
  subscription: Subscription | null;
}

const SUBSCRIPTION_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 297,
    features: ['1 AI Agent', '10K monthly interactions', 'Email support', 'Basic analytics'],
    color: 'emerald'
  },
  {
    id: 'growth',
    name: 'Growth', 
    price: 497,
    features: ['3 AI Agents', '50K monthly interactions', 'Priority support', 'Advanced analytics', 'Custom integrations'],
    color: 'blue',
    popular: true
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 897,
    features: ['6 AI Agents', '150K monthly interactions', 'Dedicated support', 'Custom workflows', 'White-label options'],
    color: 'purple'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1497,
    features: ['Unlimited AI Agents', 'Unlimited interactions', '24/7 phone support', 'Custom development', 'Enterprise SLA'],
    color: 'gold'
  }
];

export default function SubscriptionManager() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch subscription status
  const { data: subscriptionData, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/stripe/subscription-status'],
    retry: false
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async (immediate: boolean) => {
      return await apiRequest('POST', '/api/stripe/cancel-subscription', { immediate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been successfully canceled.",
      });
      setShowCancelDialog(false);
    },
    onError: () => {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update subscription mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { priceId: string; quantity: number }) => {
      return await apiRequest('POST', '/api/stripe/update-subscription', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been successfully updated.",
      });
      setShowUpgradeDialog(false);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Customer portal mutation
  const portalMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/stripe/customer-portal');
    },
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: () => {
      toast({
        title: "Portal Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'canceled': return 'text-red-600 bg-red-50';
      case 'past_due': return 'text-yellow-600 bg-yellow-50';
      case 'unpaid': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCurrentTier = () => {
    if (!subscriptionData?.subscription) return null;
    const amount = subscriptionData.subscription.items[0]?.amount || 0;
    return SUBSCRIPTION_TIERS.find(tier => tier.price * 100 === amount);
  };

  const handleCancelSubscription = (immediate = false) => {
    cancelMutation.mutate(immediate);
  };

  const handleUpgrade = (tierId: string) => {
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
    if (!tier) return;

    // This would normally use actual Stripe price IDs
    const priceId = `price_${tierId}`;
    updateMutation.mutate({ priceId, quantity: 1 });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const hasActiveSubscription = subscriptionData?.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600">Manage your Harmonix AI subscription and billing</p>
        </div>
        <Button
          variant="outline"
          onClick={() => portalMutation.mutate()}
          disabled={portalMutation.isPending}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Billing Portal
        </Button>
      </div>

      {/* Current Subscription Status */}
      {hasActiveSubscription ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Current Subscription
              </CardTitle>
              <Badge className={getStatusColor(subscriptionData.status)}>
                {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentTier && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{currentTier.name} Plan</h3>
                  <p className="text-gray-600">${currentTier.price}/month</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    ${(subscriptionData.subscription!.items[0].amount / 100).toFixed(0)}/mo
                  </p>
                  <p className="text-sm text-gray-500">Per month</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Current Period</Label>
                <p className="text-sm text-gray-900">
                  {format(new Date(subscriptionData.subscription!.current_period_start * 1000), 'MMM dd, yyyy')} - {' '}
                  {format(new Date(subscriptionData.subscription!.current_period_end * 1000), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Next Billing Date</Label>
                <p className="text-sm text-gray-900">
                  {format(new Date(subscriptionData.subscription!.current_period_end * 1000), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {subscriptionData.subscription!.cancel_at_period_end && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-yellow-800">
                  Your subscription is set to cancel at the end of the current billing period.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeDialog(true)}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              No Active Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You don't have an active subscription. Choose a plan to get started with Harmonix AI.
            </p>
            <Button onClick={() => setShowUpgradeDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Crown className="w-4 h-4 mr-2" />
              Choose Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Agents</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">of 6 included</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Interactions</p>
                <p className="text-2xl font-bold text-gray-900">24.5K</p>
              </div>
              <BarChart className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">of 50K included</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">1.2s</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">avg this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to cancel your subscription? You'll lose access to all premium features.
            </p>
            
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                Your subscription will remain active until the end of your current billing period.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                className="flex-1"
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCancelSubscription(false)}
                disabled={cancelMutation.isPending}
                className="flex-1"
              >
                {cancelMutation.isPending ? 'Canceling...' : 'Cancel Subscription'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {hasActiveSubscription ? 'Upgrade Your Plan' : 'Choose Your Plan'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  tier.popular ? 'ring-2 ring-emerald-500' : ''
                } ${currentTier?.id === tier.id ? 'border-emerald-500 bg-emerald-50' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-emerald-600">
                    ${tier.price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={updateMutation.isPending || currentTier?.id === tier.id}
                    className="w-full"
                    variant={currentTier?.id === tier.id ? "outline" : "default"}
                  >
                    {currentTier?.id === tier.id 
                      ? 'Current Plan' 
                      : updateMutation.isPending 
                        ? 'Processing...' 
                        : hasActiveSubscription 
                          ? 'Upgrade' 
                          : 'Select Plan'
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}