import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';

export const ExpiredPassBanner: React.FC = () => {
  const { subscription, startCheckout, plans, setIsPricingModalOpen } = useApp();

  if (!subscription || !subscription.trialExpiredBanner) return null;

  const studentPlan = plans.find(p => p.id === 'plan_student_monthly');
  const proPlan = plans.find(p => p.id === 'plan_pro_monthly');

  return (
    <aside
      id="expired-pass-banner"
      aria-label="Subscription Status Alert"
      className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white border-b border-indigo-700/50 px-4 py-2.5 sm:py-3 transition-all animate-in slide-in-from-top duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-emerald-300">Your progress is safe. </span>
            <span className="text-slate-200">
              Your pass has ended, but your notes, mistakes & bookmarks are preserved forever.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {studentPlan && (
            <button
              id="banner-upgrade-student-btn"
              onClick={() => startCheckout(studentPlan)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-sm"
            >
              Student ₹49/mo
            </button>
          )}

          {proPlan && (
            <button
              id="banner-upgrade-pro-btn"
              onClick={() => startCheckout(proPlan)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-sm hidden md:inline-block"
            >
              Pro ₹99/mo
            </button>
          )}

          <button
            id="banner-all-plans-btn"
            onClick={() => setIsPricingModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-semibold transition"
          >
            All Plans
          </button>
        </div>
      </div>
    </aside>
  );
};
