import Stripe from 'stripe';
import { PRICING_TIERS, DISCOUNT_CONFIG, FINANCING_CONFIG, calculateDiscountedPrice, calculateFinancedTotal } from '@shared/pricing-config';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export interface CheckoutSessionData {
  tierId: string;
  hasExistingPlatform: boolean;
  useFinancing: boolean;
  isEarlyBird: boolean;
  customerEmail?: string;
  companyName?: string;
  industry?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface WebhookEvent {
  type: string;
  data: {
    object: Stripe.Checkout.Session | Stripe.Subscription | Stripe.Invoice;
  };
}

export async function createCheckoutSession(sessionData: CheckoutSessionData): Promise<Stripe.Checkout.Session> {
  const tier = PRICING_TIERS.find(t => t.id === sessionData.tierId);
  if (!tier) {
    throw new Error(`Invalid tier ID: ${sessionData.tierId}`);
  }

  // Calculate pricing
  const baseSetupFee = (tier.setupMin + tier.setupMax) / 2;
  const baseMrrFee = (tier.mrrMin + tier.mrrMax) / 2;
  
  const finalSetupFee = calculateDiscountedPrice(
    baseSetupFee,
    sessionData.isEarlyBird,
    sessionData.hasExistingPlatform,
    tier.agentsIncluded
  );

  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (sessionData.useFinancing) {
    // Create financing payment plan
    const { monthlyPayment } = calculateFinancedTotal(finalSetupFee);
    
    // Create a subscription for financing payments
    const financingProduct = await stripe.products.create({
      name: `${tier.name} Plan - Financed`,
      description: `Financed setup fee for ${tier.name} plan`,
      metadata: {
        tier: tier.id,
        financing: 'true',
        originalSetupFee: finalSetupFee.toString(),
        interestRate: FINANCING_CONFIG.interestRate.toString()
      }
    });

    const financingPrice = await stripe.prices.create({
      unit_amount: Math.round(monthlyPayment * 100), // Convert to cents
      currency: 'usd',
      recurring: { interval: 'month', interval_count: 1 },
      product: financingProduct.id,
      metadata: {
        type: 'financing',
        tier: tier.id
      }
    });

    lineItems.push({
      price: financingPrice.id,
      quantity: 1
    });
  } else {
    // One-time setup fee
    const setupProduct = await stripe.products.create({
      name: `${tier.name} Plan - Setup`,
      description: `One-time setup fee for ${tier.name} plan`,
      metadata: {
        tier: tier.id,
        agentsIncluded: tier.agentsIncluded.toString(),
        setupType: 'one_time'
      }
    });

    const setupPrice = await stripe.prices.create({
      unit_amount: Math.round(finalSetupFee * 100), // Convert to cents
      currency: 'usd',
      product: setupProduct.id,
      metadata: {
        type: 'setup',
        tier: tier.id,
        hasEarlyBird: sessionData.isEarlyBird.toString(),
        hasPlatformDiscount: sessionData.hasExistingPlatform.toString()
      }
    });

    lineItems.push({
      price: setupPrice.id,
      quantity: 1
    });
  }

  // Monthly recurring maintenance fee
  const mrrProduct = await stripe.products.create({
    name: `${tier.name} Plan - Monthly Maintenance`,
    description: `Monthly maintenance and support for ${tier.name} plan`,
    metadata: {
      tier: tier.id,
      agentsIncluded: tier.agentsIncluded.toString()
    }
  });

  const mrrPrice = await stripe.prices.create({
    unit_amount: Math.round(baseMrrFee * 100), // Convert to cents
    currency: 'usd',
    recurring: { interval: 'month' },
    product: mrrProduct.id,
    metadata: {
      type: 'maintenance',
      tier: tier.id
    }
  });

  lineItems.push({
    price: mrrPrice.id,
    quantity: 1
  });

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: lineItems,
    customer_email: sessionData.customerEmail,
    metadata: {
      tier: tier.id,
      hasExistingPlatform: sessionData.hasExistingPlatform.toString(),
      useFinancing: sessionData.useFinancing.toString(),
      isEarlyBird: sessionData.isEarlyBird.toString(),
      companyName: sessionData.companyName || '',
      industry: sessionData.industry || '',
      agentsIncluded: tier.agentsIncluded.toString(),
      setupFee: finalSetupFee.toString(),
      monthlyFee: baseMrrFee.toString()
    },
    success_url: sessionData.successUrl,
    cancel_url: sessionData.cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    automatic_tax: {
      enabled: true // Enable Stripe Tax for automatic tax calculation
    },
    invoice_creation: {
      enabled: true
    }
  });

  return session;
}

export async function handleWebhook(event: WebhookEvent): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
      break;
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  console.log('Checkout completed:', {
    sessionId: session.id,
    customerId: session.customer,
    subscriptionId: session.subscription,
    metadata: session.metadata
  });

  // Here you would:
  // 1. Create or update customer record in your database
  // 2. Store subscription details
  // 3. Trigger onboarding workflow
  // 4. Send confirmation email
  // 5. Update early bird counter if applicable
  
  const metadata = session.metadata;
  if (metadata?.isEarlyBird === 'true') {
    // Decrement early bird counter
    console.log('Early bird purchase detected, updating counter');
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  console.log('Payment succeeded:', {
    invoiceId: invoice.id,
    customerId: invoice.customer,
    subscriptionId: invoice.subscription,
    amountPaid: invoice.amount_paid
  });

  // Handle successful payment
  // Update customer balance, send receipt, etc.
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  console.log('Subscription created:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status
  });

  // Initialize customer's Harmonix platform access
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  console.log('Subscription updated:', {
    subscriptionId: subscription.id,
    status: subscription.status
  });

  // Handle subscription changes (upgrade/downgrade)
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
  console.log('Subscription canceled:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer
  });

  // Handle cancellation - disable access, send retention emails, etc.
}

// Utility functions
export async function createCustomer(email: string, name?: string, companyName?: string): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      companyName: companyName || '',
      source: 'harmonix_platform'
    }
  });
}

export async function getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active'
  });
  
  return subscriptions.data;
}

export async function updateSubscription(
  subscriptionId: string, 
  updates: Partial<Stripe.SubscriptionUpdateParams>
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, updates);
}

export { stripe };