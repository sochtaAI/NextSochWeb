import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plan } from '../../types';
import { NextSochApi } from '../../services/api';
import {
  CheckCircle2,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  Tag,
  Users,
  Check
} from 'lucide-react';

export const PricingView: React.FC = () => {
  const { plans, subscription, startCheckout, setIsReferralModalOpen, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'monthly' | 'passes' | 'long_term'>('monthly');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setIsValidatingPromo(true);
    try {
      const res = await NextSochApi.validatePromo(promoCodeInput.trim().toUpperCase());
      if (res.success && res.data.valid) {
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
    } catch {
      addToast({ title: 'Error checking code', type: 'error' });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200/80 dark:border-indigo-800/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Affordable • Transparent • Honest</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          Priced for students. No coachings required.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Unlock NCERT line-by-line smart practice, AI doubt solving, and full mock test series. Grab a ₹9 pass for exam day or study all term for ₹49/month.
        </p>

        {/* Category switcher */}
        <div className="inline-flex items-center p-1 mt-6 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setSelectedCategory('monthly')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              selectedCategory === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Plans
          </button>
          <button
            onClick={() => setSelectedCategory('passes')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition ${
              selectedCategory === 'passes'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Short Passes (₹9 - ₹29)</span>
          </button>
          <button
            onClick={() => setSelectedCategory('long_term')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              selectedCategory === 'long_term'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Long-Term (Save up to 58%)
          </button>
        </div>
      </div>

      {/* Referral Teaser Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-950/20 border border-indigo-700/40">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0 border border-purple-400/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Want free access? Try SOCH Circle 🤝</div>
            <div className="text-xs text-slate-300">
              Invite a study buddy. When they practice 5 questions, you both get a 3-Day Student Pass free!
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsReferralModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs whitespace-nowrap shadow-sm transition"
        >
          Open SOCH Circle
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPlans.map(plan => {
          const isCurrent = subscription?.planId === plan.id;
          const isRecommended =
            plan.id === 'plan_student_monthly' || plan.id === 'pass_1day' || plan.id === 'plan_yearly';

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 ${
                isRecommended
                  ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {plan.type === 'pass' && (
                    <span className="flex items-center space-x-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                      <Clock className="w-3 h-3" />
                      <span>{plan.duration_days} Day Pass</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
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
                      ? 'Free forever. Genuinely useful everyday.'
                      : plan.type === 'pass'
                      ? 'One-time payment • Never auto-renewed'
                      : plan.billing_cycle === 'monthly'
                      ? 'Cancel anytime in 1 tap • No lock-in'
                      : `Equivalent to ₹${Math.round(plan.price_inr / (plan.duration_days / 30))}/month`}
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
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
                    disabled
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default"
                  >
                    Currently Active
                  </button>
                ) : plan.id === 'plan_free' ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-500 cursor-default"
                  >
                    Included by Default
                  </button>
                ) : (
                  <button
                    onClick={() => startCheckout(plan)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                      isRecommended
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                    }`}
                  >
                    <span>{plan.type === 'pass' ? `Get Pass (₹${plan.price_inr})` : `Upgrade for ₹${plan.price_inr}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code Strip */}
      <div className="mt-8 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
          <Tag className="w-4 h-4 text-indigo-500" />
          <span>Have a student scholarship code or coupon?</span>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="e.g. NEET2025"
            value={promoCodeInput}
            onChange={e => setPromoCodeInput(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleApplyPromo}
            disabled={isValidatingPromo}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {isValidatingPromo ? 'Checking...' : 'Apply Code'}
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Safe UPI, Cards & NetBanking</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Award className="w-4 h-4 text-indigo-500" />
          <span>Your progress is safe forever</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-4 h-4 text-purple-500" />
          <span>1-Click Cancel Auto-Renewal Anytime</span>
        </div>
      </div>
    </div>
  );
};
