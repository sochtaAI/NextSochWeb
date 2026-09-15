import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plan } from '../../types';
import { NextSochApi } from '../../services/api';
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  QrCode,
  CreditCard,
  Building2,
  AlertCircle,
  Clock,
  ArrowRight,
  Check
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const { refreshSubscription, addToast } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiVpa, setUpiVpa] = useState('student@okaxis');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoAppliedMsg, setPromoAppliedMsg] = useState('');
  const [autoRenew, setAutoRenew] = useState(plan?.billing_cycle === 'monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'success' | 'failed'>('review');
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !plan) return null;

  const basePrice = plan.price_inr;
  const finalPrice = Math.max(0, basePrice - promoDiscount);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await NextSochApi.validatePromo(promoCode.trim().toUpperCase(), plan.id);
      if (res.success && res.data.valid) {
        if (res.data.discountPercent) {
          const disc = Math.round((basePrice * res.data.discountPercent) / 100);
          setPromoDiscount(disc);
        } else if (res.data.discountAmount) {
          setPromoDiscount(res.data.discountAmount);
        }
        setPromoAppliedMsg(res.data.description || 'Code applied successfully!');
        addToast({ title: 'Coupon Applied! 🎉', type: 'success' });
      } else {
        setPromoDiscount(0);
        setPromoAppliedMsg('');
        addToast({ title: 'Invalid Promo Code', description: res.data?.message, type: 'error' });
      }
    } catch {
      addToast({ title: 'Error validating code', type: 'error' });
    }
  };

  const handleStartPayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      // 1. Create checkout session on backend
      const sessionRes = await NextSochApi.createCheckoutSession({
        planId: plan.id,
        paymentMethod,
        promoCode: promoDiscount > 0 ? promoCode : undefined,
        autoRenew,
      });

      if (!sessionRes.success || !sessionRes.data) {
        throw new Error('Could not initiate checkout session');
      }

      const session = sessionRes.data;
      setPaymentSession(session);

      // 2. Mock payment / Live verification
      // Simulate payment delay
      await new Promise(r => setTimeout(r, 1000));

      const verifyRes = await NextSochApi.verifyPayment({
        paymentId: session.paymentId,
        providerPaymentId: `pay_${Date.now()}`,
        simulateFailure,
        failureReason: simulateFailure ? 'Bank network timed out during authorization' : undefined,
      });

      if (verifyRes.success) {
        setCheckoutStep('success');
        await refreshSubscription();
        addToast({
          title: `Welcome to ${plan.name}! 🚀`,
          description: 'Your account entitlements are now active.',
          type: 'success',
        });
      } else {
        setErrorMessage(verifyRes.error || 'Payment declined by bank');
        setCheckoutStep('failed');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Transaction could not be completed');
      setCheckoutStep('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setCheckoutStep('review');
    setErrorMessage('');
    setPromoDiscount(0);
    setPromoCode('');
    onClose();
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget && !isProcessing) handleResetAndClose();
      }}
    >
      <div
        id="checkout-modal-container"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              {checkoutStep === 'success' ? 'Payment Successful' : 'Complete Your Purchase'}
            </h3>
          </div>
          {!isProcessing && (
            <button
              id="checkout-close-btn"
              onClick={handleResetAndClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step: Success */}
        {checkoutStep === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mb-1">
              You're all set! Plan Activated.
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto mb-6">
              Full access to {plan.name} is now enabled on your account. All bookmarks and notes are ready.
            </p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-left text-xs mb-6 space-y-1">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Plan</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{plan.name}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Amount Paid</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{finalPrice}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Validity</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {plan.type === 'pass' ? `${plan.duration_days} Days Full Access` : `${plan.duration_days} Days`}
                </span>
              </div>
            </div>

            <button
              id="checkout-success-continue-btn"
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition"
            >
              Start Learning Now
            </button>
          </div>
        ) : checkoutStep === 'failed' ? (
          /* Step: Failed */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mb-1">
              Payment Not Completed
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto mb-6">
              {errorMessage || 'Your bank was unable to process the transaction. No amount was deducted.'}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setCheckoutStep('review')}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition"
              >
                Try Again
              </button>
              <button
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Step: Review & Pay */
          <div className="p-6 space-y-5">
            {/* Selected Plan Summary Card */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {plan.type === 'pass' ? 'Short Pass' : 'Subscription'}
                </span>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {plan.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {plan.duration_days} days validity • Instant unlock
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  ₹{finalPrice}
                </span>
                {promoDiscount > 0 && (
                  <span className="block text-xs line-through text-slate-400">
                    ₹{basePrice}
                  </span>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="pay-method-upi"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs">UPI / QR</span>
                </button>

                <button
                  type="button"
                  id="pay-method-card"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Debit / Card</span>
                </button>

                <button
                  type="button"
                  id="pay-method-netbanking"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">NetBanking</span>
                </button>
              </div>

              {/* UPI Input / QR details */}
              {paymentMethod === 'upi' && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Enter UPI ID</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">GPay • PhonePe • Paytm</span>
                  </div>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={e => setUpiVpa(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Coupon code (e.g. NEET2025)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 uppercase font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-semibold hover:bg-slate-700"
                >
                  Apply
                </button>
              </div>
              {promoAppliedMsg && (
                <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  ✓ {promoAppliedMsg}
                </span>
              )}
            </div>

            {/* Auto-renew checkbox (only for recurring monthly) */}
            {plan.billing_cycle === 'monthly' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  id="auto-renew-checkbox"
                  checked={autoRenew}
                  onChange={e => setAutoRenew(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="auto-renew-checkbox" className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold block text-slate-800 dark:text-slate-200">
                    Auto-renew monthly (optional)
                  </span>
                  Never worry about interrupted study. You can turn this off anytime with 1-click in your account dashboard.
                </label>
              </div>
            )}

            {/* Total breakdown */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>₹{basePrice}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px]">
                <span>GST (18% inclusive)</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Amount to Pay</span>
                <span>₹{finalPrice}</span>
              </div>
            </div>

            {/* Testing / Preview simulator controls */}
            <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span>Preview Mode: Mock Gateway</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={e => setSimulateFailure(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span className="font-medium">Test Failure</span>
              </label>
            </div>

            {/* Pay Button */}
            <button
              id="pay-submit-btn"
              type="button"
              onClick={handleStartPayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 transition"
            >
              {isProcessing ? (
                <span>Authorizing Payment...</span>
              ) : (
                <>
                  <span>Pay ₹{finalPrice} Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
