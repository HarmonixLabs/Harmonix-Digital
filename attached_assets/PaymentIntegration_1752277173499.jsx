import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Shield,
  Zap,
  Crown,
  Building,
  Users,
  TrendingUp,
  Calendar,
  Receipt,
  Settings
} from 'lucide-react'

const PaymentIntegration = ({ agentId, deploymentType = 'setup', onPaymentSuccess, onPaymentCancel }) => {
  const { user, organization } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [paymentIntent, setPaymentIntent] = useState(null)
  const [error, setError] = useState(null)

  // Pricing plans for different deployment types
  const pricingPlans = {
    setup: [
      {
        id: 'setup_basic',
        name: 'Basic Setup',
        price: 99,
        description: 'Single agent deployment with basic configuration',
        features: [
          'Agent deployment and configuration',
          'Basic webhook setup',
          'Email support',
          '30-day money-back guarantee'
        ],
        popular: false
      },
      {
        id: 'setup_professional',
        name: 'Professional Setup',
        price: 299,
        description: 'Multi-agent deployment with advanced features',
        features: [
          'Up to 5 agent deployments',
          'Advanced webhook configuration',
          'GoHighLevel integration',
          'Priority support',
          'Custom branding',
          '60-day money-back guarantee'
        ],
        popular: true
      },
      {
        id: 'setup_enterprise',
        name: 'Enterprise Setup',
        price: 999,
        description: 'Full platform deployment with white-label options',
        features: [
          'Unlimited agent deployments',
          'Full platform customization',
          'White-label branding',
          'Dedicated account manager',
          'Custom integrations',
          'SLA guarantee'
        ],
        popular: false
      }
    ],
    subscription: [
      {
        id: 'starter',
        name: 'Starter',
        price: 49,
        description: 'Perfect for small businesses getting started',
        features: [
          '3 active agents',
          '1,000 interactions/month',
          'Basic analytics',
          'Email support',
          'Standard integrations'
        ],
        popular: false
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 149,
        description: 'Ideal for growing businesses',
        features: [
          '10 active agents',
          '5,000 interactions/month',
          'Advanced analytics',
          'Priority support',
          'Custom integrations',
          'Team collaboration'
        ],
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 499,
        description: 'For large organizations with complex needs',
        features: [
          'Unlimited agents',
          'Unlimited interactions',
          'White-label platform',
          'Dedicated support',
          'Custom development',
          'SLA guarantee'
        ],
        popular: false
      }
    ]
  }

  const currentPlans = pricingPlans[deploymentType] || pricingPlans.subscription

  useEffect(() => {
    // Load Stripe and initialize payment methods
    loadStripePaymentMethods()
  }, [])

  const loadStripePaymentMethods = async () => {
    try {
      const response = await fetch('/api/payments/methods')
      if (response.ok) {
        const data = await response.json()
        setPaymentMethod(data.default_method)
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error)
    }
  }

  const calculatePrice = (plan) => {
    const basePrice = plan.price
    if (billingCycle === 'annual') {
      return Math.round(basePrice * 12 * 0.8) // 20% discount for annual
    }
    return basePrice
  }

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    setError(null)
  }

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          billing_cycle: billingCycle,
          deployment_type: deploymentType,
          agent_id: agentId,
          organization_id: organization?.id,
          amount: calculatePrice(selectedPlan),
          currency: 'usd',
          metadata: {
            user_id: user?.id,
            organization_name: organization?.name,
            plan_name: selectedPlan.name
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPaymentIntent(data.payment_intent)
        
        // Process payment with Stripe
        const paymentResult = await processStripePayment(data.client_secret)
        
        if (paymentResult.success) {
          // Sync with GoHighLevel
          await syncWithGoHighLevel(data.payment_intent.id)
          
          // Trigger deployment
          await triggerDeployment()
          
          onPaymentSuccess && onPaymentSuccess(paymentResult)
        } else {
          setError(paymentResult.error)
        }
      } else {
        setError(data.message || 'Payment failed')
      }
    } catch (error) {
      setError('Payment processing failed. Please try again.')
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  const processStripePayment = async (clientSecret) => {
    // This would integrate with Stripe Elements in a real implementation
    // For now, we'll simulate the payment process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, payment_method: 'card_1234' })
      }, 2000)
    })
  }

  const syncWithGoHighLevel = async (paymentIntentId) => {
    try {
      await fetch('/api/integrations/gohighlevel/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          customer_data: {
            name: `${user?.first_name} ${user?.last_name}`,
            email: user?.email,
            organization: organization?.name,
            plan: selectedPlan.name,
            amount: calculatePrice(selectedPlan)
          }
        })
      })
    } catch (error) {
      console.error('GoHighLevel sync failed:', error)
    }
  }

  const triggerDeployment = async () => {
    try {
      await fetch('/api/deployments/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agent_id: agentId,
          plan_id: selectedPlan.id,
          deployment_type: deploymentType,
          organization_id: organization?.id
        })
      })
    } catch (error) {
      console.error('Deployment trigger failed:', error)
    }
  }

  const PlanCard = ({ plan, isSelected, onSelect }) => {
    const price = calculatePrice(plan)
    const originalPrice = plan.price
    const isDiscounted = billingCycle === 'annual' && price < originalPrice * 12

    return (
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected 
            ? 'border-purple-500 bg-purple-900/20' 
            : 'border-slate-700 bg-slate-800 hover:border-slate-600'
        } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
        onClick={() => onSelect(plan)}
      >
        {plan.popular && (
          <div className="bg-purple-600 text-white text-center py-1 text-sm font-medium rounded-t-lg">
            Most Popular
          </div>
        )}
        
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center">
            {plan.name}
            {plan.id.includes('enterprise') && (
              <Crown className="h-5 w-5 ml-2 text-yellow-400" />
            )}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {plan.description}
          </CardDescription>
          
          <div className="py-4">
            <div className="text-4xl font-bold text-white">
              ${billingCycle === 'annual' ? Math.round(price / 12) : price}
              {isDiscounted && (
                <span className="text-lg text-slate-400 line-through ml-2">
                  ${originalPrice}
                </span>
              )}
            </div>
            <div className="text-slate-400">
              per {billingCycle === 'annual' ? 'month (billed annually)' : 'month'}
            </div>
            {isDiscounted && (
              <Badge className="bg-green-600 mt-2">
                Save 20%
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            className={`w-full mt-6 ${
              isSelected 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            onClick={() => onSelect(plan)}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {deploymentType === 'setup' ? 'Setup & Deployment' : 'Choose Your Plan'}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {deploymentType === 'setup' 
            ? 'Get your Harmony AI agents deployed and configured by our experts'
            : 'Select the perfect plan for your business needs'
          }
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      {deploymentType === 'subscription' && (
        <div className="flex justify-center">
          <div className="bg-slate-800 p-1 rounded-lg">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
              className="px-6"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('annual')}
              className="px-6"
            >
              Annual
              <Badge className="ml-2 bg-green-600">Save 20%</Badge>
            </Button>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan?.id === plan.id}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>

      {/* Payment Section */}
      {selectedPlan && (
        <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
              Payment Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Secure payment processing with Stripe
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">{selectedPlan.name}</span>
                  <span className="text-white">${calculatePrice(selectedPlan)}</span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Annual discount (20%)</span>
                    <span className="text-green-400">-${selectedPlan.price * 12 - calculatePrice(selectedPlan)}</span>
                  </div>
                )}
                <hr className="border-slate-600" />
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${calculatePrice(selectedPlan)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Payment Method</h4>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white">Credit Card</p>
                    <p className="text-sm text-slate-400">Secure payment via Stripe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Status */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Integration Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-white">Stripe</span>
                  </div>
                  <p className="text-xs text-green-400 mt-1">Connected</p>
                </div>
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-white">GoHighLevel</span>
                  </div>
                  <p className="text-xs text-green-400 mt-1">Synced</p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={onPaymentCancel}
                className="flex-1 border-slate-600 text-slate-200"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-slate-400">
              <Shield className="h-4 w-4 inline mr-1" />
              Your payment information is secure and encrypted
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PaymentIntegration

