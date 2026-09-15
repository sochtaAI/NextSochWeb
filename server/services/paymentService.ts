import { DatabaseSync } from 'node:sqlite';
import { getDatabase } from '../db/database';
import crypto from 'crypto';

export interface CheckoutSessionOptions {
  userId: string;
  planId: string;
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'wallet' | 'promo';
  promoCode?: string;
  autoRenew?: boolean;
}

export interface CheckoutSessionResult {
  paymentId: string;
  orderId: string;
  amountInr: number;
  currency: string;
  planId: string;
  planName: string;
  paymentMethod: string;
  provider: string;
  keyId?: string;
  discountAppliedInr: number;
  finalAmountInr: number;
  mockMode: boolean;
}

export interface VerifyPaymentOptions {
  paymentId: string;
  providerPaymentId?: string;
  providerSignature?: string;
  simulateFailure?: boolean;
  failureReason?: string;
}

export interface WebhookEventPayload {
  event: string;
  paymentId?: string;
  providerPaymentId?: string;
  orderId?: string;
  status?: string;
  signature?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export class PaymentService {
  /**
   * Abstract checkout session creation
   */
  static createCheckoutSession(options: CheckoutSessionOptions): CheckoutSessionResult {
    const db = getDatabase();
    const { userId, planId, paymentMethod = 'upi', promoCode, autoRenew = false } = options;

    const plan = db.prepare('SELECT * FROM plans WHERE id = ? AND is_active = 1').get(planId) as any;
    if (!plan) {
      throw new Error(`Plan '${planId}' does not exist or is inactive`);
    }

    let discountInr = 0;
    if (promoCode) {
      const promo = db.prepare('SELECT * FROM promo_codes WHERE code = ? AND is_active = 1').get(promoCode.trim().toUpperCase()) as any;
      if (promo) {
        if (promo.discount_flat_inr > 0) {
          discountInr += promo.discount_flat_inr;
        }
        if (promo.discount_percent > 0) {
          discountInr += Math.round((plan.price_inr * promo.discount_percent) / 100);
        }
        discountInr = Math.min(discountInr, plan.price_inr);
      }
    }

    const finalAmount = Math.max(0, plan.price_inr - discountInr);
    const paymentId = `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const orderId = `order_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const provider = process.env.PAYMENT_PROVIDER || 'mock';
    const now = Date.now();

    // Create payment record in DB
    const insertPayment = db.prepare(`
      INSERT INTO payments (
        id, user_id, plan_id, amount_inr, status, payment_method,
        provider, provider_payment_id, provider_order_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertPayment.run(
      paymentId,
      userId,
      planId,
      finalAmount,
      finalAmount === 0 ? 'captured' : 'created',
      paymentMethod,
      provider,
      null,
      orderId,
      now,
      now
    );

    // Record audit event
    this.recordPaymentEvent(paymentId, 'checkout.created', {
      userId,
      planId,
      finalAmount,
      promoCode,
      autoRenew,
      timestamp: now,
    });

    // If 100% discount, activate subscription immediately
    if (finalAmount === 0) {
      this.activateSubscription({
        userId,
        planId,
        paymentId,
        providerSubscriptionId: `sub_promo_${Date.now()}`,
        autoRenew: false,
      });
    }

    return {
      paymentId,
      orderId,
      amountInr: plan.price_inr,
      currency: 'INR',
      planId: plan.id,
      planName: plan.name,
      paymentMethod,
      provider,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_nextsoch',
      discountAppliedInr: discountInr,
      finalAmountInr: finalAmount,
      mockMode: provider === 'mock' || !process.env.RAZORPAY_KEY_SECRET,
    };
  }

  /**
   * Verify payment signature or simulate verification in dev mode
   */
  static verifyPayment(options: VerifyPaymentOptions): { success: boolean; subscription?: any; error?: string } {
    const db = getDatabase();
    const { paymentId, providerPaymentId, simulateFailure, failureReason } = options;

    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId) as any;
    if (!payment) {
      throw new Error(`Payment record '${paymentId}' not found`);
    }

    const now = Date.now();

    if (simulateFailure) {
      const reason = failureReason || 'Payment declined by bank / UPI gateway';
      this.handlePaymentFailure(paymentId, reason);
      return { success: false, error: reason };
    }

    const assignedProviderPaymentId = providerPaymentId || `sim_pay_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    // Update payment status to captured
    db.prepare(`
      UPDATE payments
      SET status = 'captured', provider_payment_id = ?, updated_at = ?
      WHERE id = ?
    `).run(assignedProviderPaymentId, now, paymentId);

    this.recordPaymentEvent(paymentId, 'payment.success', {
      paymentId,
      providerPaymentId: assignedProviderPaymentId,
      timestamp: now,
    });

    // Determine auto-renew: Passes never auto-renew; monthly/term can
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(payment.plan_id) as any;
    const isPass = plan.type === 'pass';
    const autoRenew = !isPass;

    const subscription = this.activateSubscription({
      userId: payment.user_id,
      planId: payment.plan_id,
      paymentId,
      providerSubscriptionId: `sub_act_${Date.now()}`,
      autoRenew,
    });

    return { success: true, subscription };
  }

  /**
   * Activate or extend a user's subscription or pass
   */
  static activateSubscription(params: {
    userId: string;
    planId: string;
    paymentId: string;
    providerSubscriptionId?: string;
    autoRenew?: boolean;
  }): any {
    const db = getDatabase();
    const { userId, planId, paymentId, providerSubscriptionId, autoRenew = false } = params;

    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId) as any;
    if (!plan) throw new Error(`Plan '${planId}' not found`);

    const now = Date.now();
    const durationMs = (plan.duration_days || 30) * 24 * 60 * 60 * 1000;

    // Check if user currently has an active subscription
    const currentSub = db.prepare(`
      SELECT * FROM subscriptions
      WHERE user_id = ? AND status = 'active' AND end_date > ?
      ORDER BY end_date DESC LIMIT 1
    `).get(userId, now) as any;

    let startDate = now;
    let endDate = now + durationMs;

    // If extending an active paid subscription, add on to existing end_date
    if (currentSub && currentSub.plan_id === planId) {
      startDate = currentSub.start_date;
      endDate = currentSub.end_date + durationMs;
      // Mark old sub superseded or updated
      db.prepare(`
        UPDATE subscriptions
        SET end_date = ?, updated_at = ?, auto_renew = ?
        WHERE id = ?
      `).run(endDate, now, autoRenew ? 1 : 0, currentSub.id);

      db.prepare(`
        UPDATE payments SET subscription_id = ? WHERE id = ?
      `).run(currentSub.id, paymentId);

      this.recordPaymentEvent(paymentId, 'subscription.extended', {
        userId,
        subscriptionId: currentSub.id,
        newEndDate: endDate,
      });

      return db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(currentSub.id);
    }

    // Cancel / expire previous subscriptions
    db.prepare(`
      UPDATE subscriptions
      SET status = 'expired', updated_at = ?
      WHERE user_id = ? AND status = 'active'
    `).run(now, userId);

    const subscriptionId = `sub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO subscriptions (
        id, user_id, plan_id, status, start_date, end_date,
        auto_renew, provider, provider_subscription_id, created_at, updated_at
      ) VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      subscriptionId,
      userId,
      planId,
      startDate,
      endDate,
      autoRenew ? 1 : 0,
      'mock',
      providerSubscriptionId || null,
      now,
      now
    );

    // Link payment to subscription
    db.prepare(`
      UPDATE payments SET subscription_id = ? WHERE id = ?
    `).run(subscriptionId, paymentId);

    // Reset daily counters and grant AI credits
    db.prepare(`
      UPDATE users
      SET ai_credits_used = 0, daily_free_questions_solved = 0, updated_at = ?
      WHERE id = ?
    `).run(now, userId);

    this.recordPaymentEvent(paymentId, 'subscription.activated', {
      userId,
      subscriptionId,
      planId,
      startDate,
      endDate,
      autoRenew,
    });

    return db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(subscriptionId);
  }

  /**
   * Handle payment failure gracefully
   */
  static handlePaymentFailure(paymentId: string, reason: string): void {
    const db = getDatabase();
    const now = Date.now();

    db.prepare(`
      UPDATE payments
      SET status = 'failed', failure_reason = ?, updated_at = ?
      WHERE id = ?
    `).run(reason, now, paymentId);

    this.recordPaymentEvent(paymentId, 'payment.failed', {
      paymentId,
      reason,
      timestamp: now,
    });
  }

  /**
   * Process refund and adjust subscription status
   */
  static handleRefund(paymentId: string, amountInr?: number, reason?: string): any {
    const db = getDatabase();
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId) as any;
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'captured') throw new Error(`Cannot refund payment in status '${payment.status}'`);

    const refundAmount = amountInr !== undefined ? amountInr : payment.amount_inr;
    const now = Date.now();

    db.prepare(`
      UPDATE payments
      SET status = 'refunded', refund_amount_inr = ?, updated_at = ?
      WHERE id = ?
    `).run(refundAmount, now, paymentId);

    if (payment.subscription_id) {
      db.prepare(`
        UPDATE subscriptions
        SET status = 'cancelled', updated_at = ?
        WHERE id = ?
      `).run(now, payment.subscription_id);
    }

    this.recordPaymentEvent(paymentId, 'refund.processed', {
      paymentId,
      refundAmount,
      reason: reason || 'Customer requested refund / admin status adjustment',
      timestamp: now,
    });

    return db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
  }

  /**
   * Generic Webhook Handler (for Razorpay / Cashfree / Stripe)
   */
  static handleWebhook(payload: WebhookEventPayload): { received: boolean; actionTaken: string } {
    const { event, paymentId, providerPaymentId, orderId, failureReason } = payload;
    const db = getDatabase();

    this.recordPaymentEvent(paymentId || 'webhook', `webhook.${event}`, payload);

    if (event === 'payment.captured' || event === 'charge.successful') {
      if (paymentId) {
        this.verifyPayment({ paymentId, providerPaymentId });
        return { received: true, actionTaken: 'payment_verified' };
      }
    } else if (event === 'payment.failed') {
      if (paymentId) {
        this.handlePaymentFailure(paymentId, failureReason || 'Gateway failure');
        return { received: true, actionTaken: 'payment_marked_failed' };
      }
    } else if (event === 'refund.processed') {
      if (paymentId) {
        this.handleRefund(paymentId);
        return { received: true, actionTaken: 'refund_recorded' };
      }
    }

    return { received: true, actionTaken: 'logged_only' };
  }

  /**
   * Record payment event for auditability
   */
  static recordPaymentEvent(paymentId: string | null, eventType: string, payload: any): void {
    try {
      const db = getDatabase();
      const id = `pe_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      db.prepare(`
        INSERT INTO payment_events (id, payment_id, event_type, payload_json, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, paymentId, eventType, JSON.stringify(payload), Date.now());
    } catch (err) {
      console.error('Failed to log payment event:', err);
    }
  }
}
