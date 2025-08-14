import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not configured - payment functionality will be limited');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export interface CheckoutData {
  customerEmail: string;
  customerName: string;
  amount: number; // in cents
  depositAmount: number; // in cents
  planName: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
  customerId?: string;
}

export class StripeCheckoutService {
  async createDepositCheckout(data: CheckoutData): Promise<CheckoutResponse> {
    try {
      // Create or retrieve customer
      const customer = await this.getOrCreateCustomer(data.customerEmail, data.customerName);
      
      // Calculate discount (15% off setup fee if deposit is paid)
      const setupFee = data.amount;
      const discountAmount = Math.round(setupFee * 0.15); // 15% discount
      const finalSetupFee = setupFee - discountAmount;
      const depositAmount = data.depositAmount;
      const remainingBalance = finalSetupFee - depositAmount;

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${data.planName} - Setup Deposit (30%)`,
                description: `Deposit for ${data.planName} setup. Remaining balance: $${(remainingBalance / 100).toFixed(2)}`,
                metadata: {
                  plan_type: data.planName,
                  is_deposit: 'true',
                  setup_fee: setupFee.toString(),
                  discount_applied: discountAmount.toString(),
                  remaining_balance: remainingBalance.toString()
                }
              },
              unit_amount: depositAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: data.cancelUrl,
        metadata: {
          plan_name: data.planName,
          setup_fee: setupFee.toString(),
          deposit_amount: depositAmount.toString(),
          discount_amount: discountAmount.toString(),
          remaining_balance: remainingBalance.toString(),
          customer_email: data.customerEmail,
          ...data.metadata
        },
        automatic_tax: {
          enabled: true,
        },
        customer_update: {
          address: 'auto',
        },
        invoice_creation: {
          enabled: true,
        }
      });

      return {
        sessionId: session.id,
        url: session.url!,
        customerId: customer.id
      };
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  async createVIPCheckout(customerData: any): Promise<CheckoutResponse> {
    try {
      const customer = await this.getOrCreateCustomer(customerData.email, customerData.name);
      
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'VIP Priority Access - Refundable Deposit',
                description: 'Secure your spot in the first 100 users. 45% discount locked in. Fully refundable.',
                metadata: {
                  access_type: 'vip',
                  is_refundable: 'true'
                }
              },
              unit_amount: 44400, // $444
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}&payment=success&type=vip`,
        cancel_url: `${process.env.FRONTEND_URL}/join?canceled=true`,
        metadata: {
          access_type: 'vip',
          customer_email: customerData.email,
          customer_name: customerData.name,
          phone: customerData.phone || '',
          company: customerData.company || ''
        },
        automatic_tax: {
          enabled: true,
        }
      });

      return {
        sessionId: session.id,
        url: session.url!,
        customerId: customer.id
      };
    } catch (error) {
      console.error('VIP checkout error:', error);
      throw new Error('Failed to create VIP checkout session');
    }
  }

  private async getOrCreateCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    // Try to find existing customer
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer
    return await stripe.customers.create({
      email,
      name: name || email.split('@')[0],
      metadata: {
        source: 'harmonix_platform'
      }
    });
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent']
    });
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleSuccessfulPayment(session);
          break;
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Payment succeeded:', paymentIntent.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  private async handleSuccessfulPayment(session: Stripe.Checkout.Session): Promise<void> {
    console.log('Processing successful payment:', session.id);
    
    // Send confirmation to CRM
    try {
      const { sendToGHL } = await import('../ghl-integration');
      await sendToGHL({
        email: session.customer_details?.email || session.metadata?.customer_email || '',
        firstName: session.customer_details?.name?.split(' ')[0] || '',
        lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
        phone: session.customer_details?.phone || session.metadata?.phone || '',
        companyName: session.metadata?.company || '',
        source: 'stripe_payment',
        tags: ['paid-customer', session.metadata?.access_type || 'premium'],
        customFields: {
          stripe_session_id: session.id,
          payment_amount: session.amount_total?.toString() || '0',
          plan_name: session.metadata?.plan_name || 'unknown',
          payment_status: 'completed'
        }
      });
    } catch (error) {
      console.error('Failed to send payment data to CRM:', error);
    }
  }
}

export const stripeCheckoutService = new StripeCheckoutService();