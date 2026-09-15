import { Router, Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { PaymentService } from '../services/paymentService';
import { requireAuth } from '../middleware/auth';
import { getDatabase } from '../db/database';

const router = Router();

/**
 * GET /api/v1/subscription/plans
 * Public: List active plans with entitlements and pricing
 */
router.get('/plans', (_req: Request, res: Response) => {
  try {
    const plans = SubscriptionService.getAllPlans(true);
    res.json({ success: true, data: plans });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch plans', details: error?.message });
  }
});

/**
 * GET /api/v1/subscription/my
 * Returns current user subscription, remaining days/hours, quota, and entitlements
 */
router.get('/my', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const details = SubscriptionService.getUserSubscription(userId);
    res.json({ success: true, data: details });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch subscription status', details: error?.message });
  }
});

/**
 * GET /api/v1/subscription/can-access/:featureKey
 * Centralized entitlement check
 */
router.get('/can-access/:featureKey', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const access = SubscriptionService.canAccess(userId, req.params.featureKey);
    res.json({ success: true, data: access });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to check access', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/checkout
 * Initializes a checkout session
 */
router.post('/checkout', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { planId, paymentMethod, promoCode, autoRenew } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'planId is required' });
    }

    const session = PaymentService.createCheckoutSession({
      userId,
      planId,
      paymentMethod,
      promoCode,
      autoRenew,
    });

    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(400).json({ error: 'Checkout initiation failed', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/verify
 * Confirms payment and activates subscription
 */
router.post('/verify', requireAuth, (req: Request, res: Response) => {
  try {
    const { paymentId, providerPaymentId, providerSignature, simulateFailure, failureReason } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId is required' });
    }

    const result = PaymentService.verifyPayment({
      paymentId,
      providerPaymentId,
      providerSignature,
      simulateFailure,
      failureReason,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Payment verification failed' });
    }

    const updatedSub = SubscriptionService.getUserSubscription(req.user!.id);
    res.json({ success: true, data: { subscription: result.subscription, current: updatedSub } });
  } catch (error: any) {
    res.status(400).json({ error: 'Payment verification failed', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/cancel-autorenew
 * Disables auto renewal without cutting off active duration
 */
router.post('/cancel-autorenew', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = SubscriptionService.cancelAutoRenew(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to cancel auto-renewal', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/apply-promo
 * Validates a promo code
 */
router.post('/apply-promo', (req: Request, res: Response) => {
  try {
    const { code, planId } = req.body;
    if (!code) return res.status(400).json({ error: 'code is required' });

    const result = SubscriptionService.validatePromoCode(code, planId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: 'Promo validation error', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/record-ai-usage
 * Records AI token / credit consumption
 */
router.post('/record-ai-usage', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const credits = req.body.credits || 1;
    const usage = SubscriptionService.recordAiUsage(userId, credits);
    res.json({ success: true, data: usage });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to record AI usage', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/test-reset-free
 * Test helper: Reset current user to Free plan to test the free tier & upgrade triggers
 */
router.post('/test-reset-free', requireAuth, (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const userId = req.user!.id;
    db.prepare(`UPDATE subscriptions SET status = 'cancelled', updated_at = ? WHERE user_id = ?`).run(Date.now(), userId);
    db.prepare(`UPDATE users SET daily_free_questions_solved = 0 WHERE id = ?`).run(userId);
    const updated = SubscriptionService.getUserSubscription(userId);
    res.json({ success: true, data: updated, message: 'Switched to Free plan' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reset plan', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/test-simulate-expired
 * Test helper: Simulates an expired 1-day pass to test the "Your progress is safe" banner
 */
router.post('/test-simulate-expired', requireAuth, (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const userId = req.user!.id;
    const now = Date.now();
    // Mark current subscriptions expired
    db.prepare(`UPDATE subscriptions SET status = 'trial_expired', end_date = ?, updated_at = ? WHERE user_id = ?`).run(now - 1000, now, userId);
    const updated = SubscriptionService.getUserSubscription(userId);
    res.json({ success: true, data: updated, message: 'Pass expired simulated. Your progress is safe.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to simulate expiration', details: error?.message });
  }
});

/**
 * GET /api/v1/subscription/referral/my
 * SOCH CIRCLE Referral details
 */
router.get('/referral/my', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = SubscriptionService.getReferralProfile(userId);
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch referral profile', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/referral/test-milestone
 * Test helper: Simulates friend completing learning activity to trigger ethical reward
 */
router.post('/referral/test-milestone', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const db = getDatabase();
    const now = Date.now();

    // Create a mock referral record if none exists
    const existingRef = db.prepare(`SELECT * FROM referrals WHERE referrer_user_id = ? LIMIT 1`).get(userId) as any;
    let refId = existingRef?.id;

    if (!existingRef) {
      refId = `ref_sim_${Date.now()}`;
      db.prepare(`
        INSERT INTO referrals (id, referrer_user_id, referred_user_id, referral_code, status, learning_milestone_met, created_at)
        VALUES (?, ?, ?, 'TEST_CODE', 'registered', 0, ?)
      `).run(refId, userId, `user_sim_friend_${Date.now()}`, now);
    }

    // Award 3 days pass to current user
    SubscriptionService.grantPromotionalAccess({
      userId,
      planId: 'pass_3day',
      durationDays: 3,
      reason: 'SOCH Circle Referral Reward (Peer completed 5 practice questions)',
    });

    // Record reward
    const rewardId = `rw_${Date.now()}`;
    db.prepare(`
      INSERT INTO referral_rewards (id, referral_id, user_id, reward_type, reward_value, claimed, created_at)
      VALUES (?, ?, ?, 'pass_days', '3-Day Student Pass Granted (Milestone Achieved)', 1, ?)
    `).run(rewardId, refId, userId, now);

    res.json({
      success: true,
      message: 'Friend completed practice milestone! 3-Day Student Pass awarded to your account.',
      currentSub: SubscriptionService.getUserSubscription(userId),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to simulate referral reward', details: error?.message });
  }
});

// =========================================================================
// ADMIN MONETIZATION ROUTES
// =========================================================================

/**
 * GET /api/v1/subscription/admin/plans
 */
router.get('/admin/plans', (_req: Request, res: Response) => {
  try {
    const plans = SubscriptionService.getAllPlans(false);
    res.json({ success: true, data: plans });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch all plans', details: error?.message });
  }
});

/**
 * PATCH /api/v1/subscription/admin/plans/:id
 */
router.patch('/admin/plans/:id', (req: Request, res: Response) => {
  try {
    const planId = req.params.id;
    const updated = SubscriptionService.updatePlan(planId, req.body);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update plan', details: error?.message });
  }
});

/**
 * GET /api/v1/subscription/admin/analytics
 */
router.get('/admin/analytics', (_req: Request, res: Response) => {
  try {
    const analytics = SubscriptionService.getRevenueAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch revenue analytics', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/admin/grant-access
 */
router.post('/admin/grant-access', (req: Request, res: Response) => {
  try {
    const { userId = 'user_default', planId, durationDays, reason } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId is required' });

    const granted = SubscriptionService.grantPromotionalAccess({
      userId,
      planId,
      durationDays,
      reason,
    });
    res.json({ success: true, data: granted, message: 'Access successfully granted' });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to grant access', details: error?.message });
  }
});

/**
 * POST /api/v1/subscription/admin/refund
 */
router.post('/admin/refund', (req: Request, res: Response) => {
  try {
    const { paymentId, amountInr, reason } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'paymentId is required' });

    const refunded = PaymentService.handleRefund(paymentId, amountInr, reason);
    res.json({ success: true, data: refunded, message: 'Refund processed successfully' });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to process refund', details: error?.message });
  }
});

export default router;
