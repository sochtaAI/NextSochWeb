import { DatabaseSync } from 'node:sqlite';
import { getDatabase } from '../db/database';
import crypto from 'crypto';

export interface PlanRecord {
  id: string;
  name: string;
  type: 'free' | 'pass' | 'recurring_monthly' | 'recurring_term';
  duration_days: number;
  price_inr: number;
  billing_cycle: 'free' | 'one_time' | 'monthly' | '3_months' | '6_months' | 'yearly';
  badge: string | null;
  description: string | null;
  is_active: number;
  sort_order: number;
  ai_credits_monthly: number;
  features_json: string;
  created_at: number;
  updated_at: number;
}

export interface UserSubscriptionDetails {
  subscriptionId: string | null;
  planId: string;
  planName: string;
  planType: string;
  priceInr: number;
  billingCycle: string;
  status: 'active' | 'free' | 'trial_expired' | 'expired' | 'cancelled';
  badge: string | null;
  startDate: number | null;
  endDate: number | null;
  autoRenew: boolean;
  isPass: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialExpiredBanner: boolean;
  entitlements: Record<string, { isEnabled: boolean; quotaLimit: number | null }>;
  aiCredits: {
    used: number;
    total: number;
    remaining: number;
  };
  dailyPractice: {
    solvedToday: number;
    dailyLimit: number;
    remainingToday: number;
    isLimitReached: boolean;
  };
}

export class SubscriptionService {
  /**
   * Get active subscription details & compute live entitlements for a user
   */
  static getUserSubscription(userId: string): UserSubscriptionDetails {
    const db = getDatabase();
    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];

    // Ensure user record has daily fields
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!user) {
      throw new Error(`User '${userId}' not found`);
    }

    // Reset daily count if day rolled over
    let dailySolved = user.daily_free_questions_solved || 0;
    if (user.daily_free_date !== todayStr) {
      dailySolved = 0;
      db.prepare(`
        UPDATE users SET daily_free_questions_solved = 0, daily_free_date = ? WHERE id = ?
      `).run(todayStr, userId);
    }

    // Find latest active subscription
    const activeSub = db.prepare(`
      SELECT s.*, p.name as plan_name, p.type as plan_type, p.price_inr,
             p.billing_cycle, p.badge as plan_badge, p.ai_credits_monthly, p.duration_days
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = ? AND s.status = 'active'
      ORDER BY s.end_date DESC LIMIT 1
    `).get(userId) as any;

    let trialExpiredBanner = false;

    // Check if pass or subscription has expired
    if (activeSub && activeSub.end_date <= now) {
      const isPass = activeSub.plan_type === 'pass';
      db.prepare(`
        UPDATE subscriptions
        SET status = ?, updated_at = ?
        WHERE id = ?
      `).run(isPass ? 'trial_expired' : 'expired', now, activeSub.id);

      if (isPass) {
        trialExpiredBanner = true;
      }
    }

    // Check if user recently had a trial_expired status
    if (!activeSub || activeSub.end_date <= now) {
      const recentExpiredPass = db.prepare(`
        SELECT * FROM subscriptions
        WHERE user_id = ? AND status = 'trial_expired'
        ORDER BY end_date DESC LIMIT 1
      `).get(userId) as any;

      if (recentExpiredPass) {
        trialExpiredBanner = true;
      }
    }

    // Active valid subscription check
    if (activeSub && activeSub.end_date > now) {
      const msLeft = activeSub.end_date - now;
      const hoursLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60)));
      const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
      const isPass = activeSub.plan_type === 'pass';

      // Load entitlements for this plan
      const entitlementsRows = db.prepare(`
        SELECT feature_key, is_enabled, quota_limit
        FROM entitlements WHERE plan_id = ?
      `).all(activeSub.plan_id) as any[];

      const entitlements: Record<string, { isEnabled: boolean; quotaLimit: number | null }> = {};
      for (const ent of entitlementsRows) {
        entitlements[ent.feature_key] = {
          isEnabled: ent.is_enabled === 1,
          quotaLimit: ent.quota_limit,
        };
      }

      const totalAi = activeSub.ai_credits_monthly || (isPass ? 25 : 0);
      const usedAi = user.ai_credits_used || 0;
      const remainingAi = Math.max(0, totalAi - usedAi);

      return {
        subscriptionId: activeSub.id,
        planId: activeSub.plan_id,
        planName: activeSub.plan_name,
        planType: activeSub.plan_type,
        priceInr: activeSub.price_inr,
        billingCycle: activeSub.billing_cycle,
        status: 'active',
        badge: activeSub.plan_badge,
        startDate: activeSub.start_date,
        endDate: activeSub.end_date,
        autoRenew: activeSub.auto_renew === 1,
        isPass,
        daysRemaining: daysLeft,
        hoursRemaining: hoursLeft,
        trialExpiredBanner: false,
        entitlements,
        aiCredits: {
          used: usedAi,
          total: totalAi,
          remaining: remainingAi,
        },
        dailyPractice: {
          solvedToday: dailySolved,
          dailyLimit: 999999,
          remainingToday: 999999,
          isLimitReached: false,
        },
      };
    }

    // Otherwise, user is on Free Plan
    const freePlan = db.prepare('SELECT * FROM plans WHERE id = ?').get('plan_free') as any;
    const freeEntitlementsRows = db.prepare(`
      SELECT feature_key, is_enabled, quota_limit
      FROM entitlements WHERE plan_id = 'plan_free'
    `).all() as any[];

    const entitlements: Record<string, { isEnabled: boolean; quotaLimit: number | null }> = {};
    for (const ent of freeEntitlementsRows) {
      entitlements[ent.feature_key] = {
        isEnabled: ent.is_enabled === 1,
        quotaLimit: ent.quota_limit,
      };
    }

    const freeLimit = 5; // 5 questions per day for free tier
    const isLimitReached = dailySolved >= freeLimit;
    const remainingToday = Math.max(0, freeLimit - dailySolved);

    return {
      subscriptionId: null,
      planId: 'plan_free',
      planName: freePlan ? freePlan.name : 'Free',
      planType: 'free',
      priceInr: 0,
      billingCycle: 'free',
      status: trialExpiredBanner ? 'trial_expired' : 'free',
      badge: trialExpiredBanner ? 'PASS EXPIRED' : 'FREE',
      startDate: null,
      endDate: null,
      autoRenew: false,
      isPass: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      trialExpiredBanner,
      entitlements,
      aiCredits: {
        used: user.ai_credits_used || 0,
        total: 0,
        remaining: 0,
      },
      dailyPractice: {
        solvedToday: dailySolved,
        dailyLimit: freeLimit,
        remainingToday,
        isLimitReached,
      },
    };
  }

  /**
   * Centralized access check for any feature in the application
   */
  static canAccess(userId: string, featureKey: string): {
    allowed: boolean;
    reason?: string;
    featureKey: string;
    upgradeSuggestedPlan?: string;
    remainingQuota?: number;
  } {
    const sub = this.getUserSubscription(userId);

    // 1. Unlimited Practice check
    if (featureKey === 'unlimited_practice') {
      if (sub.planType !== 'free') {
        return { allowed: true, featureKey };
      }
      if (sub.dailyPractice.isLimitReached) {
        return {
          allowed: false,
          featureKey,
          reason: 'daily_practice_limit_reached',
          upgradeSuggestedPlan: 'plan_student_monthly',
          remainingQuota: 0,
        };
      }
      return {
        allowed: true,
        featureKey,
        remainingQuota: sub.dailyPractice.remainingToday,
      };
    }

    // 2. AI Assistant / AI Credits check
    if (featureKey === 'ai_assistant' || featureKey === 'ai_study_plan') {
      if (sub.planType === 'free') {
        return {
          allowed: false,
          featureKey,
          reason: 'ai_pro_feature_required',
          upgradeSuggestedPlan: 'plan_pro_monthly',
          remainingQuota: 0,
        };
      }
      if (sub.aiCredits.remaining <= 0) {
        return {
          allowed: false,
          featureKey,
          reason: 'ai_credits_exhausted',
          upgradeSuggestedPlan: 'plan_pro_monthly',
          remainingQuota: 0,
        };
      }
      return {
        allowed: true,
        featureKey,
        remainingQuota: sub.aiCredits.remaining,
      };
    }

    // 3. General Entitlements lookup
    const ent = sub.entitlements[featureKey];
    if (ent && ent.isEnabled) {
      return { allowed: true, featureKey };
    }

    // Plan-specific feature mapping for upgrade suggestion
    let upgradeSuggestedPlan = 'plan_student_monthly';
    if (
      featureKey === 'cbt' ||
      featureKey === 'adaptive_practice' ||
      featureKey === 'premium_challenges'
    ) {
      upgradeSuggestedPlan = 'plan_pro_monthly';
    } else if (
      featureKey === 'weak_topic_engine' ||
      featureKey === 'soch_battles' ||
      featureKey === 'more_tests' ||
      featureKey === 'custom_practice'
    ) {
      upgradeSuggestedPlan = 'plan_smart_monthly';
    }

    return {
      allowed: false,
      featureKey,
      reason: 'plan_upgrade_required',
      upgradeSuggestedPlan,
    };
  }

  /**
   * Record practice question attempt for daily free quota enforcement
   */
  static recordPracticeUsage(userId: string): { dailySolved: number; dailyLimit: number; remainingToday: number; isLimitReached: boolean } {
    const db = getDatabase();
    const todayStr = new Date().toISOString().split('T')[0];
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;

    let currentSolved = user.daily_free_questions_solved || 0;
    if (user.daily_free_date !== todayStr) {
      currentSolved = 0;
    }

    currentSolved += 1;

    db.prepare(`
      UPDATE users
      SET daily_free_questions_solved = ?, daily_free_date = ?, updated_at = ?
      WHERE id = ?
    `).run(currentSolved, todayStr, Date.now(), userId);

    const limit = 5;
    return {
      dailySolved: currentSolved,
      dailyLimit: limit,
      remainingToday: Math.max(0, limit - currentSolved),
      isLimitReached: currentSolved >= limit,
    };
  }

  /**
   * Record AI token / credit usage
   */
  static recordAiUsage(userId: string, credits: number = 1): { used: number; remaining: number } {
    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    const newUsed = (user.ai_credits_used || 0) + credits;

    db.prepare(`
      UPDATE users SET ai_credits_used = ?, updated_at = ? WHERE id = ?
    `).run(newUsed, Date.now(), userId);

    const sub = this.getUserSubscription(userId);
    return {
      used: newUsed,
      remaining: sub.aiCredits.remaining,
    };
  }

  /**
   * Cancel auto-renew without losing current access
   */
  static cancelAutoRenew(userId: string): { success: boolean; message: string } {
    const db = getDatabase();
    const now = Date.now();
    const result = db.prepare(`
      UPDATE subscriptions
      SET auto_renew = 0, updated_at = ?
      WHERE user_id = ? AND status = 'active' AND auto_renew = 1
    `).run(now, userId);

    return {
      success: result.changes > 0,
      message: result.changes > 0
        ? 'Automatic renewal cancelled. Your access remains active until the end of your billing cycle.'
        : 'No active recurring subscription found.',
    };
  }

  /**
   * Get all plans with parsed features and entitlements
   */
  static getAllPlans(activeOnly: boolean = false): any[] {
    const db = getDatabase();
    const sql = activeOnly
      ? 'SELECT * FROM plans WHERE is_active = 1 ORDER BY sort_order ASC'
      : 'SELECT * FROM plans ORDER BY sort_order ASC';

    const plans = db.prepare(sql).all() as any[];
    const entitlements = db.prepare('SELECT * FROM entitlements').all() as any[];

    return plans.map(p => {
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(p.features_json || '[]');
      } catch {
        parsedFeatures = [];
      }
      const planEnts = entitlements.filter(e => e.plan_id === p.id);
      return {
        ...p,
        features: parsedFeatures,
        entitlements: planEnts,
      };
    });
  }

  /**
   * Validate a promo code
   */
  static validatePromoCode(code: string, planId?: string): any {
    const db = getDatabase();
    const cleanCode = code.trim().toUpperCase();
    const promo = db.prepare(`
      SELECT * FROM promo_codes
      WHERE code = ? AND is_active = 1 AND current_redemptions < max_redemptions
    `).get(cleanCode) as any;

    if (!promo) {
      return { valid: false, message: 'Invalid or expired promo code' };
    }

    if (promo.target_plan_id && planId && promo.target_plan_id !== planId) {
      return { valid: false, message: `This code is only applicable to the ${promo.target_plan_id} plan` };
    }

    return {
      valid: true,
      code: promo.code,
      discountPercent: promo.discount_percent,
      discountFlatInr: promo.discount_flat_inr,
      freeDays: promo.free_days,
      targetPlanId: promo.target_plan_id,
    };
  }

  /**
   * Admin: Grant promotional access to any student
   */
  static grantPromotionalAccess(params: {
    userId: string;
    planId: string;
    durationDays?: number;
    reason?: string;
  }): any {
    const db = getDatabase();
    const { userId, planId, durationDays, reason = 'Admin promotional grant' } = params;

    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId) as any;
    if (!plan) throw new Error(`Plan '${planId}' does not exist`);

    const now = Date.now();
    const days = durationDays || plan.duration_days || 30;
    const durationMs = days * 24 * 60 * 60 * 1000;
    const endDate = now + durationMs;

    // Expire old subscriptions
    db.prepare(`
      UPDATE subscriptions SET status = 'expired', updated_at = ?
      WHERE user_id = ? AND status = 'active'
    `).run(now, userId);

    const subscriptionId = `sub_promo_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO subscriptions (
        id, user_id, plan_id, status, start_date, end_date,
        auto_renew, provider, provider_subscription_id, created_at, updated_at
      ) VALUES (?, ?, ?, 'active', ?, ?, 0, 'admin_grant', ?, ?, ?)
    `).run(
      subscriptionId,
      userId,
      planId,
      now,
      endDate,
      `promo_${reason.slice(0, 20)}`,
      now,
      now
    );

    // Record $0 payment for ledger consistency
    const paymentId = `pay_promo_${Date.now()}`;
    db.prepare(`
      INSERT INTO payments (
        id, user_id, subscription_id, plan_id, amount_inr, status,
        payment_method, provider, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 0, 'captured', 'promo', 'admin', ?, ?)
    `).run(paymentId, userId, subscriptionId, planId, now, now);

    return db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(subscriptionId);
  }

  /**
   * Admin: Update plan pricing, status, or configuration
   */
  static updatePlan(planId: string, updates: Partial<PlanRecord>): any {
    const db = getDatabase();
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId) as any;
    if (!plan) throw new Error(`Plan '${planId}' not found`);

    const updatedPrice = updates.price_inr !== undefined ? updates.price_inr : plan.price_inr;
    const updatedName = updates.name !== undefined ? updates.name : plan.name;
    const updatedBadge = updates.badge !== undefined ? updates.badge : plan.badge;
    const updatedDesc = updates.description !== undefined ? updates.description : plan.description;
    const updatedIsActive = updates.is_active !== undefined ? updates.is_active : plan.is_active;
    const updatedAiCredits = updates.ai_credits_monthly !== undefined ? updates.ai_credits_monthly : plan.ai_credits_monthly;
    const updatedFeaturesJson = updates.features_json !== undefined ? updates.features_json : plan.features_json;
    const now = Date.now();

    db.prepare(`
      UPDATE plans
      SET name = ?, price_inr = ?, badge = ?, description = ?,
          is_active = ?, ai_credits_monthly = ?, features_json = ?, updated_at = ?
      WHERE id = ?
    `).run(
      updatedName,
      updatedPrice,
      updatedBadge,
      updatedDesc,
      updatedIsActive,
      updatedAiCredits,
      updatedFeaturesJson,
      now,
      planId
    );

    return db.prepare('SELECT * FROM plans WHERE id = ?').get(planId);
  }

  /**
   * Admin: Get comprehensive revenue & subscription analytics
   */
  static getRevenueAnalytics(): any {
    const db = getDatabase();
    const now = Date.now();

    const totalCaptured = db.prepare(`
      SELECT SUM(amount_inr) as total_revenue, COUNT(*) as total_payments
      FROM payments WHERE status = 'captured'
    `).get() as any;

    const passRevenue = db.prepare(`
      SELECT SUM(p.amount_inr) as pass_revenue, COUNT(*) as pass_count
      FROM payments p
      JOIN plans pl ON p.plan_id = pl.id
      WHERE p.status = 'captured' AND pl.type = 'pass'
    `).get() as any;

    const monthlyRevenue = db.prepare(`
      SELECT SUM(p.amount_inr) as monthly_revenue, COUNT(*) as sub_count
      FROM payments p
      JOIN plans pl ON p.plan_id = pl.id
      WHERE p.status = 'captured' AND pl.type IN ('recurring_monthly', 'recurring_term')
    `).get() as any;

    const activeSubscriptionsByPlan = db.prepare(`
      SELECT p.id as plan_id, p.name as plan_name, p.price_inr, p.type as plan_type,
             COUNT(s.id) as active_count
      FROM plans p
      LEFT JOIN subscriptions s ON p.id = s.plan_id AND s.status = 'active' AND s.end_date > ?
      GROUP BY p.id
      ORDER BY p.sort_order ASC
    `).all(now) as any[];

    const recentPayments = db.prepare(`
      SELECT p.*, pl.name as plan_name, u.name as user_name, u.email as user_email
      FROM payments p
      LEFT JOIN plans pl ON p.plan_id = pl.id
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 20
    `).all() as any[];

    const recentSubscriptions = db.prepare(`
      SELECT s.*, pl.name as plan_name, u.name as user_name, u.email as user_email
      FROM subscriptions s
      LEFT JOIN plans pl ON s.plan_id = pl.id
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 20
    `).all() as any[];

    return {
      totalRevenueInr: totalCaptured?.total_revenue || 0,
      totalPaymentsCount: totalCaptured?.total_payments || 0,
      passRevenueInr: passRevenue?.pass_revenue || 0,
      passPaymentsCount: passRevenue?.pass_count || 0,
      recurringRevenueInr: monthlyRevenue?.monthly_revenue || 0,
      recurringPaymentsCount: monthlyRevenue?.sub_count || 0,
      activeSubscriptionsByPlan,
      recentPayments,
      recentSubscriptions,
    };
  }

  /**
   * SOCH CIRCLE: Referral System Engine
   */
  static getReferralProfile(userId: string): any {
    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!user) throw new Error('User not found');

    let code = user.referral_code;
    if (!code) {
      code = `SOCH-${user.name.split(' ')[0].toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      db.prepare('UPDATE users SET referral_code = ? WHERE id = ?').run(code, userId);
    }

    const referrals = db.prepare(`
      SELECT r.*, u.name as referred_name, u.created_at as joined_at
      FROM referrals r
      LEFT JOIN users u ON r.referred_user_id = u.id
      WHERE r.referrer_user_id = ?
      ORDER BY r.created_at DESC
    `).all(userId) as any[];

    const rewards = db.prepare(`
      SELECT * FROM referral_rewards
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId) as any[];

    const qualifiedCount = referrals.filter(r => r.status === 'qualified' || r.status === 'rewarded').length;

    return {
      referralCode: code,
      referralLink: `https://nextsoch.app/join?ref=${code}`,
      totalReferrals: referrals.length,
      qualifiedReferrals: qualifiedCount,
      rewardsEarnedCount: rewards.length,
      referralsList: referrals.map(r => ({
        id: r.id,
        referredName: r.referred_name ? `${r.referred_name.slice(0, 1)}***${r.referred_name.slice(-1)}` : 'Friend',
        status: r.status,
        milestoneMet: r.learning_milestone_met === 1,
        date: r.created_at,
      })),
      rewardsList: rewards,
    };
  }

  /**
   * SOCH CIRCLE: Process meaningful milestone completion (anti-abuse verified)
   */
  static processReferralMilestone(referredUserId: string): any {
    const db = getDatabase();
    const now = Date.now();

    const referral = db.prepare(`
      SELECT * FROM referrals
      WHERE referred_user_id = ? AND status = 'registered'
    `).get(referredUserId) as any;

    if (!referral) return null;

    // Prevent self-referral
    if (referral.referrer_user_id === referredUserId) {
      db.prepare(`
        UPDATE referrals SET status = 'rejected_abuse' WHERE id = ?
      `).run(referral.id);
      return null;
    }

    // Mark referral qualified
    db.prepare(`
      UPDATE referrals
      SET status = 'rewarded', learning_milestone_met = 1, qualified_at = ?, rewarded_at = ?
      WHERE id = ?
    `).run(now, now, referral.id);

    // Grant 3-day student access reward to referrer
    const rewardId = `rw_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO referral_rewards (id, referral_id, user_id, reward_type, reward_value, claimed, created_at)
      VALUES (?, ?, ?, 'pass_days', '3-Day Student Pass Granted', 1, ?)
    `).run(rewardId, referral.id, referral.referrer_user_id, now);

    // Activate 3-day pass for referrer
    this.grantPromotionalAccess({
      userId: referral.referrer_user_id,
      planId: 'pass_3day',
      durationDays: 3,
      reason: 'SOCH Circle Referral Reward (Invited peer achieved milestone)',
    });

    return { rewarded: true, referrerId: referral.referrer_user_id };
  }
}
