import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plan, PlanBillingCycle } from '../../types';
import { NextSochApi } from '../../services/api';
import {
  CheckCircle2,
  X,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  ChevronRight,
  HelpCircle,
  Tag,
  ArrowRight
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'passes' | 'monthly' | 'long_term';
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'monthly',
}) => {
  const { plans, subscription, startCheckout, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'passes' | 'monthly' | 'long_term'>(defaultCategory);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; discountAmount?: number } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setIsValidatingPromo(true);
    try {
      const res = await NextSochApi.validatePromo(promoCodeInput.trim().toUpperCase());
      if (res.success && res.data.valid) {
        setAppliedPromo(res.data);
        addToast({
          title: `Promo Applied! 🎉`,
          description: res.data.description || 'Special student discount unlocked.',
          type: 'success',
        });
      } else {
        addToast({
          title: 'Invalid Promo Code',
          description: res.data?.message || 'Please check the code and try again.',
          type: 'error',
        });
      }
    } catch (err: any) {
      addToast({
        title: 'Error checking code',
        description: err?.message || 'Could not validate promo code',
        type: 'error',
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const getFilteredPlans = (): Plan[] => {
    if (selectedCategory === 'passes') {
      return plans.filter(p => p.type === 'pass');
    }
    if (selectedCategory === 'monthly') {
      return plans.filter(p => p.type === 'recurring_monthly' || p.id === 'plan_free');
    }
    return plans.filter(p => p.type === 'recurring_term');
  };

  const filteredPlans = getFilteredPlans();

  return (
    <div
      id="pricing-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="pricing-modal-container"
        className="relative w-full max-w-5xl my-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header with Title and Close Button */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border-b border-indigo-800/40">
          <button
            id="pricing-modal-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            aria-label="Close pricing"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent, Student-First Pricing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Invest in your rank, not overpriced coaching.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              No long commitments required. Grab a 24-hour ₹9 pass or study all month for ₹49.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 mt-5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 w-fit">
            <button
              id="pricing-tab-monthly"
              onClick={() => setSelectedCategory('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Monthly Plans
            </button>
            <button
              id="pricing-tab-passes"
              onClick={() => setSelectedCategory('passes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                selectedCategory === 'passes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Short Passes (₹9 - ₹29)</span>
            </button>
            <button
              id="pricing-tab-longterm"
              onClick={() => setSelectedCategory('long_term')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === 'long_term'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Long-Term (Save up to 58%)
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Active Plan Banner if applicable */}
          {subscription && subscription.planId !== 'plan_free' && (
            <div className="mb-6 p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Currently Active: {subscription.planName}
                  </div>
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-400">
                    {subscription.isPass
                      ? `${subscription.hoursRemaining} hours remaining on your pass`
                      : subscription.endDate
                      ? `Valid until ${new Date(subscription.endDate).toLocaleDateString()}`
                      : 'Active'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm">
                Current Plan
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredPlans.map(plan => {
              const isCurrent = subscription?.planId === plan.id;
              const isRecommended = plan.id === 'plan_student_monthly' || plan.id === 'pass_1day' || plan.id === 'plan_yearly';

              return (
                <div
                  key={plan.id}
                  id={`plan-card-${plan.id}`}
                  className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 ${
                    isRecommended
                      ? 'border-indigo-500/80 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-sm">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      {plan.type === 'pass' && (
                        <span className="flex items-center space-x-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                          <Clock className="w-3 h-3" />
                          <span>{plan.duration_days} Day Pass</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px]">
                      {plan.description}
                    </p>

                    {/* Price display */}
                    <div className="mt-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          ₹{plan.price_inr}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {plan.billing_cycle === 'free'
                            ? '/ forever'
                            : plan.type === 'pass'
                            ? ` / ${plan.duration_days} ${plan.duration_days === 1 ? 'day' : 'days'}`
                            : plan.billing_cycle === 'monthly'
                            ? ' / month'
                            : ` / ${plan.duration_days} days`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {plan.price_inr === 0
                          ? 'Zero cost. Genuinely useful everyday.'
                          : plan.type === 'pass'
                          ? 'One-time payment. Never auto-debited.'
                          : plan.billing_cycle === 'monthly'
                          ? 'Cancel anytime in 1 tap'
                          : `Equivalent to ₹${Math.round(plan.price_inr / (plan.duration_days / 30))}/month`}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isCurrent ? (
                      <button
                        id={`plan-current-btn-${plan.id}`}
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default"
                      >
                        Currently Active
                      </button>
                    ) : plan.id === 'plan_free' ? (
                      <button
                        id={`plan-free-btn`}
                        onClick={onClose}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        Continue Free
                      </button>
                    ) : (
                      <button
                        id={`plan-choose-btn-${plan.id}`}
                        onClick={() => startCheckout(plan)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                          isRecommended
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                        }`}
                      >
                        <span>{plan.type === 'pass' ? `Get Pass (₹${plan.price_inr})` : `Upgrade for ₹${plan.price_inr}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo code bar */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
              <Tag className="w-4 h-4 text-indigo-500" />
              <span>Have a student scholarship code or coupon?</span>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                id="promo-code-input"
                type="text"
                placeholder="e.g. NEET2025"
                value={promoCodeInput}
                onChange={e => setPromoCodeInput(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                id="promo-apply-btn"
                type="button"
                onClick={handleApplyPromo}
                disabled={isValidatingPromo}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
              >
                {isValidatingPromo ? 'Checking...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Guarantees */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Safe UPI & Cards</span>
            </span>
            <span className="flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              <span>Progress safe forever</span>
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant activation</span>
            </span>
          </div>

          <div className="text-slate-400">
            Need help? Reach out at <span className="underline">support@nextsoch.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
