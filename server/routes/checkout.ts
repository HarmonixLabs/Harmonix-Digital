import { Router } from 'express';
import { stripeCheckoutService } from '../services/stripe-checkout';
import { sendToGHL } from '../ghl-integration';

const router = Router();

// Create checkout session for plan deposits
router.post('/api/create-checkout', async (req, res) => {
  try {
    const { plan, customerData, depositPercentage = 30 } = req.body;
    
    if (!plan || !customerData?.email) {
      return res.status(400).json({ 
        error: 'Plan and customer email are required' 
      });
    }

    // Plan pricing (in cents)
    const planPricing: Record<string, number> = {
      'growth': 299700,      // $2,997
      'scale': 499700,       // $4,997  
      'enterprise': 999700,  // $9,997
      'custom': 1999700      // $19,997
    };

    const setupFee = planPricing[plan] || planPricing['growth'];
    const depositAmount = Math.round(setupFee * (depositPercentage / 100));

    const checkoutData = {
      customerEmail: customerData.email,
      customerName: customerData.name || `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim(),
      amount: setupFee,
      depositAmount,
      planName: plan.charAt(0).toUpperCase() + plan.slice(1),
      successUrl: `${process.env.FRONTEND_URL || 'https://harmonix-agent-platform.replit.app'}/thank-you`,
      cancelUrl: `${process.env.FRONTEND_URL || 'https://harmonix-agent-platform.replit.app'}/join?canceled=true`,
      metadata: {
        source: 'harmonix_platform',
        customer_phone: customerData.phone || '',
        customer_company: customerData.company || '',
        business_type: customerData.businessType || '',
        team_size: customerData.teamSize || '',
        revenue: customerData.revenue || ''
      }
    };

    const checkout = await stripeCheckoutService.createDepositCheckout(checkoutData);

    res.json({
      sessionId: checkout.sessionId,
      url: checkout.url,
      customerId: checkout.customerId
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session' 
    });
  }
});

// Create VIP checkout session
router.post('/api/create-vip-checkout', async (req, res) => {
  try {
    const { customerData, accessType } = req.body;
    
    if (!customerData?.email) {
      return res.status(400).json({ 
        error: 'Customer email is required' 
      });
    }

    const checkout = await stripeCheckoutService.createVIPCheckout(customerData);

    res.json({
      sessionId: checkout.sessionId,
      url: checkout.url,
      customerId: checkout.customerId
    });

  } catch (error) {
    console.error('VIP checkout creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create VIP checkout session' 
    });
  }
});

// Retrieve checkout session
router.get('/api/checkout/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripeCheckoutService.retrieveSession(sessionId);
    
    res.json({
      id: session.id,
      status: session.status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      metadata: session.metadata
    });

  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(404).json({ 
      error: 'Session not found' 
    });
  }
});

// Stripe webhook endpoint
router.post('/api/stripe/webhook', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).json({ error: 'Missing signature or webhook secret' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    await stripeCheckoutService.handleWebhook(event);
    
    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ 
      error: 'Webhook signature verification failed' 
    });
  }
});

export default router;