import { db } from "../db";
import { users, tokenTransactions } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { sendToGHL } from "../ghl-integration";

export class ReferralService {
  // Generate unique referral code for user
  static async generateReferralCode(userId: number): Promise<string> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length || user[0].referralId) {
      return user[0]?.referralId || "";
    }

    // Generate short, memorable code
    const referralCode = nanoid(8).toUpperCase();
    
    await db.update(users)
      .set({ referralId: referralCode })
      .where(eq(users.id, userId));

    return referralCode;
  }

  // Process new referral signup
  static async processReferral(referralCode: string, newUserId: number): Promise<{
    success: boolean;
    message: string;
    rewards?: {
      referrerTokens: number;
      refereeTokens: number;
      referrerDiscount: number;
    };
  }> {
    try {
      // Find referrer
      const referrer = await db.select().from(users)
        .where(eq(users.referralId, referralCode))
        .limit(1);

      if (!referrer.length) {
        return { success: false, message: "Invalid referral code" };
      }

      const referrerId = referrer[0].id;
      
      // Check for self-referral
      if (referrerId === newUserId) {
        return { success: false, message: "Cannot refer yourself" };
      }

      // Check if new user already used a referral
      const newUser = await db.select().from(users)
        .where(eq(users.id, newUserId))
        .limit(1);

      if (!newUser.length) {
        return { success: false, message: "User not found" };
      }

      if (newUser[0].hasUsedReferral) {
        return { success: false, message: "User has already used a referral code" };
      }

      // Update new user with referral info
      await db.update(users)
        .set({
          referredBy: referrerId,
          hasUsedReferral: true,
          tokenBalance: newUser[0].tokenBalance + 250 // Referee gets 250 tokens
        })
        .where(eq(users.id, newUserId));

      // Update referrer rewards
      const currentReferrerData = referrer[0];
      const newReferralCount = currentReferrerData.referralCount + 1;
      const newTokensEarned = currentReferrerData.referralTokensEarned + 500;
      const newDiscountPercent = Math.min(currentReferrerData.referralDiscountPercent + 5, 30); // Max 30%

      await db.update(users)
        .set({
          referralCount: newReferralCount,
          referralTokensEarned: newTokensEarned,
          referralDiscountPercent: newDiscountPercent,
          tokenBalance: currentReferrerData.tokenBalance + 500 // Referrer gets 500 tokens
        })
        .where(eq(users.id, referrerId));

      // Record token transactions
      await db.insert(tokenTransactions).values([
        {
          organizationId: currentReferrerData.organizationId,
          userId: referrerId,
          type: "referral_reward",
          amount: 500,
          description: `Referral reward for inviting ${newUser[0].email}`
        },
        {
          organizationId: newUser[0].organizationId,
          userId: newUserId,
          type: "referral_bonus",
          amount: 250,
          description: `Welcome bonus from referral by ${currentReferrerData.email}`
        }
      ]);

      // Send to GHL for automation
      await sendToGHL({
        email: currentReferrerData.email,
        tags: ["referral_success", `referral_count_${newReferralCount}`],
        customFields: {
          referral_tokens_earned: newTokensEarned.toString(),
          referral_discount: newDiscountPercent.toString(),
          last_referral_date: new Date().toISOString()
        }
      });

      await sendToGHL({
        email: newUser[0].email,
        tags: ["referred_user", "referral_bonus_received"],
        customFields: {
          referred_by: currentReferrerData.email,
          referral_bonus_tokens: "250"
        }
      });

      return {
        success: true,
        message: "Referral processed successfully",
        rewards: {
          referrerTokens: 500,
          refereeTokens: 250,
          referrerDiscount: newDiscountPercent
        }
      };
    } catch (error) {
      console.error("Error processing referral:", error);
      return { success: false, message: "Failed to process referral" };
    }
  }

  // Get referral statistics for user
  static async getReferralStats(userId: number) {
    const user = await db.select().from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw new Error("User not found");
    }

    const userData = user[0];
    
    // Get referred users
    const referredUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      joinedAt: users.createdAt,
      tokenBalance: users.tokenBalance
    })
    .from(users)
    .where(eq(users.referredBy, userId));

    return {
      referralCode: userData.referralId,
      referralCount: userData.referralCount,
      tokensEarned: userData.referralTokensEarned,
      currentDiscount: userData.referralDiscountPercent,
      referralLink: `https://harmonixdigital.com?r=${userData.referralId}`,
      referredUsers: referredUsers
    };
  }

  // Apply referral discount to Stripe subscription
  static async applyReferralDiscount(userId: number, basePrice: number): Promise<{
    finalPrice: number;
    discountAmount: number;
    discountPercent: number;
  }> {
    const user = await db.select().from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return { finalPrice: basePrice, discountAmount: 0, discountPercent: 0 };
    }

    const discountPercent = user[0].referralDiscountPercent;
    const discountAmount = basePrice * (discountPercent / 100);
    const finalPrice = basePrice - discountAmount;

    return {
      finalPrice,
      discountAmount,
      discountPercent
    };
  }

  // Check if referral code is valid
  static async validateReferralCode(code: string): Promise<{
    valid: boolean;
    referrerName?: string;
  }> {
    const referrer = await db.select({
      name: users.name,
      email: users.email
    })
    .from(users)
    .where(eq(users.referralId, code))
    .limit(1);

    if (!referrer.length) {
      return { valid: false };
    }

    return {
      valid: true,
      referrerName: referrer[0].name || referrer[0].email
    };
  }
}