import Stripe from "stripe";
import { storage } from "../storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export interface DepositOptions {
  type: "reservation" | "package_deposit";
  amount: number;
  userId?: number;
  agentId?: string;
  packageTier?: string;
  metadata?: Record<string, any>;
}

export interface ReservationDepositOptions {
  agentId: string;
  userId?: number;
  customerEmail: string;
  customerName: string;
}

export interface PackageDepositOptions {
  packageTier: "starter" | "growth" | "expansion" | "enterprise";
  userId?: number;
  customerEmail: string;
  customerName: string;
  addOns?: string[];
  estimatedValue?: number;
}

export class StripeDepositService {
  
  /**
   * Create $444 Reservation Deposit Session
   * Reserves 1 agent, enters priority queue
   */
  async createReservationDeposit(options: ReservationDepositOptions): Promise<{ url: string; sessionId: string }> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Agent Reservation - ${options.agentId.toUpperCase()}`,
              description: 'Reserve your AI agent with priority installation queue',
              images: ['https://harmonix.repl.co/agent-reservation-preview.png'],
            },
            unit_amount: 44400, // $444.00
          },
          quantity: 1,
        },
      ],
      customer_email: options.customerEmail,
      metadata: {
        deposit_type: 'reservation',
        agent_id: options.agentId,
        user_id: options.userId?.toString() || '',
        reservation_amount: '444',
        priority_queue: 'true',
        package_commitment: 'false'
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/success?session_id={CHECKOUT_SESSION_ID}&type=reservation`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/checkout?cancelled=true`,
      automatic_tax: {
        enabled: true,
      },
    });

    return {
      url: session.url!,
      sessionId: session.id
    };
  }

  /**
   * Create 30% Package Deposit Session
   * Locks service package + 15% discount + priority install
   */
  async createPackageDeposit(options: PackageDepositOptions): Promise<{ url: string; sessionId: string }> {
    const packagePricing = {
      starter: { total: 4400, deposit: 1320 }, // 30% of $4,400
      growth: { total: 8000, deposit: 2400 },   // 30% of $8,000
      expansion: { total: 15000, deposit: 4500 }, // 30% of $15,000
      enterprise: { total: 21500, deposit: 6450 }  // 30% of $21,500
    };

    const pricing = packagePricing[options.packageTier];
    const earlyBirdDiscount = Math.round(pricing.total * 0.15); // 15% off total
    const finalTotal = pricing.total - earlyBirdDiscount;
    const depositAmount = Math.round(finalTotal * 0.30); // 30% of discounted price

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${options.packageTier.charAt(0).toUpperCase() + options.packageTier.slice(1)} Package - 30% Deposit`,
              description: `Lock in your ${options.packageTier} package with 15% early bird discount`,
              images: ['https://harmonix.repl.co/package-deposit-preview.png'],
            },
            unit_amount: depositAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      discounts: [
        {
          coupon: await this.getOrCreateEarlyBirdCoupon(),
        },
      ],
      customer_email: options.customerEmail,
      metadata: {
        deposit_type: 'package_deposit',
        package_tier: options.packageTier,
        user_id: options.userId?.toString() || '',
        deposit_amount: depositAmount.toString(),
        total_package_value: finalTotal.toString(),
        remaining_balance: (finalTotal - depositAmount).toString(),
        early_bird_discount: earlyBirdDiscount.toString(),
        priority_install: 'true',
        locked_pricing: 'true'
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/success?session_id={CHECKOUT_SESSION_ID}&type=package_deposit`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/checkout?cancelled=true`,
      automatic_tax: {
        enabled: true,
      },
    });

    return {
      url: session.url!,
      sessionId: session.id
    };
  }

  /**
   * Process successful deposit payment
   */
  async processDepositSuccess(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent']
    });

    const metadata = session.metadata!;
    const depositType = metadata.deposit_type;

    // Store deposit record in database
    const depositRecord = {
      sessionId: session.id,
      customerId: session.customer as string,
      depositType,
      amount: session.amount_total! / 100, // Convert from cents
      status: 'completed',
      metadata: metadata,
      createdAt: new Date(),
    };

    if (depositType === 'reservation') {
      return this.processReservationDeposit(session, metadata);
    } else if (depositType === 'package_deposit') {
      return this.processPackageDeposit(session, metadata);
    }

    throw new Error('Unknown deposit type');
  }

  private async processReservationDeposit(session: Stripe.Checkout.Session, metadata: any) {
    // Mark agent as reserved for user
    const agentId = metadata.agent_id;
    const userId = metadata.user_id ? parseInt(metadata.user_id) : null;

    // Update GHL with reservation status
    try {
      const { ghlIntegration } = await import("../ghl-integration");
      await ghlIntegration.addTags(session.customer_email!, ['agent_reserved', `reserved_${agentId}`, 'priority_queue']);
      await ghlIntegration.createOpportunity({
        contactEmail: session.customer_email!,
        opportunityName: `Agent ${agentId.toUpperCase()} Reservation`,
        monetaryValue: 444,
        status: 'Reserved - Pending Install'
      });
    } catch (error) {
      console.error('GHL integration error during reservation:', error);
    }

    return {
      type: 'reservation',
      agentId,
      amount: 444,
      status: 'reserved',
      nextSteps: 'Agent reserved in priority queue. Installation team will contact you within 24 hours.'
    };
  }

  private async processPackageDeposit(session: Stripe.Checkout.Session, metadata: any) {
    // Lock in package pricing and setup installation
    const packageTier = metadata.package_tier;
    const totalValue = parseInt(metadata.total_package_value);
    const remainingBalance = parseInt(metadata.remaining_balance);

    // Update GHL with package deposit status
    try {
      const { ghlIntegration } = await import("../ghl-integration");
      await ghlIntegration.addTags(session.customer_email!, [
        'package_deposited', 
        `${packageTier}_package`, 
        'early_bird_locked',
        'priority_install'
      ]);
      await ghlIntegration.createOpportunity({
        contactEmail: session.customer_email!,
        opportunityName: `${packageTier.toUpperCase()} Package Deposit`,
        monetaryValue: totalValue,
        status: 'Deposited - Installation Scheduled'
      });
    } catch (error) {
      console.error('GHL integration error during package deposit:', error);
    }

    return {
      type: 'package_deposit',
      packageTier,
      depositAmount: session.amount_total! / 100,
      totalValue,
      remainingBalance,
      status: 'deposited',
      nextSteps: 'Package locked with 15% discount. Installation specialist will contact you within 12 hours.'
    };
  }

  private async getOrCreateEarlyBirdCoupon(): Promise<string> {
    try {
      // Try to retrieve existing coupon
      const coupon = await stripe.coupons.retrieve('EARLYBIRD15');
      return coupon.id;
    } catch (error) {
      // Create new early bird coupon
      const coupon = await stripe.coupons.create({
        id: 'EARLYBIRD15',
        percent_off: 15,
        duration: 'once',
        name: 'Early Bird 15% Discount',
        metadata: {
          campaign: 'soft_launch',
          valid_until: '2025-12-31'
        }
      });
      return coupon.id;
    }
  }

  /**
   * Get deposit summary for user
   */
  async getDepositSummary(customerEmail: string) {
    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email: customerEmail },
      status: 'complete',
      limit: 10
    });

    return sessions.data
      .filter(session => session.metadata?.deposit_type)
      .map(session => ({
        sessionId: session.id,
        type: session.metadata!.deposit_type,
        amount: session.amount_total! / 100,
        date: new Date(session.created * 1000),
        status: 'completed',
        metadata: session.metadata
      }));
  }
}

export const stripeDepositService = new StripeDepositService();