import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export const UpgradeTriggerModal: React.FC = () => {
  const {
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    upgradeDetails,
    plans,
    startCheckout,
    setIsPricingModalOpen,
  } = useApp();

  if (!isUpgradeModalOpen || !upgradeDetails) return null;

  const suggestedPlan =
    plans.find(p => p.id === (upgradeDetails.suggestedPlanId || 'plan_student_monthly')) ||
    plans.find(p => p.id === 'plan_student_monthly') ||
    plans[0];

  const pass1Day = plans.find(p => p.id === 'pass_1day');

  const handleUpgradeNow = () => {
    setIsUpgradeModalOpen(false);
    if (suggestedPlan) {
      startCheckout(suggestedPlan);
    } else {
      setIsPricingModalOpen(true);
    }
  };

  const handleChoosePass = () => {
    setIsUpgradeModalOpen(false);
    if (pass1Day) {
      startCheckout(pass1Day);
    } else {
      setIsPricingModalOpen(true);
    }
  };

  return (
    <div
      id="upgrade-trigger-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) setIsUpgradeModalOpen(false);
      }}
    >
      <div
        id="upgrade-trigger-modal"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden"
      >
        {/* Subtle decorative background circle */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header with icon */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
              {upgradeDetails.title}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Your notes & progress are completely safe.
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          {upgradeDetails.message}
        </p>

        {/* Plan Spotlight Card */}
        {suggestedPlan && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-5">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Recommended For You
                </span>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {suggestedPlan.name}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{suggestedPlan.price_inr}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {suggestedPlan.billing_cycle === 'monthly' ? '/month' : ` / ${suggestedPlan.duration_days} days`}
                </span>
              </div>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Unlimited page-by-page practice</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Full PYQ bank with exact NCERT line references</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Smart Mistake Notebook & Spaced Revision</span>
              </li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            id="upgrade-modal-accept-btn"
            type="button"
            onClick={handleUpgradeNow}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 transition"
          >
            <span>Upgrade to Student (₹49/mo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {pass1Day && (
            <button
              id="upgrade-modal-pass-btn"
              type="button"
              onClick={handleChoosePass}
              className="w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Or try 24-Hour Full Pass for just ₹9</span>
            </button>
          )}

          <button
            id="upgrade-modal-dismiss-btn"
            type="button"
            onClick={() => setIsUpgradeModalOpen(false)}
            className="w-full py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            Continue Free for Today
          </button>
        </div>

        {/* Reassurance */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Transparent pricing • Cancel anytime • No dark patterns</span>
        </div>
      </div>
    </div>
  );
};
