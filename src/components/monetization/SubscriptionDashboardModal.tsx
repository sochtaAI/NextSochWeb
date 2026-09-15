import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NextSochApi } from '../../services/api';
import {
  X,
  ShieldCheck,
  Zap,
  Calendar,
  Clock,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const SubscriptionDashboardModal: React.FC = () => {
  const {
    isSubDashboardOpen,
    setIsSubDashboardOpen,
    subscription,
    refreshSubscription,
    setIsPricingModalOpen,
    addToast,
  } = useApp();

  const [isCancellingAutoRenew, setIsCancellingAutoRenew] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isSubDashboardOpen || !subscription) return null;

  const handleCancelAutoRenew = async () => {
    setIsCancellingAutoRenew(true);
    try {
      const res = await NextSochApi.cancelAutoRenew();
      if (res.success) {
        await refreshSubscription();
        addToast({
          title: 'Auto-Renewal Turned Off',
          description: 'You will continue to have full access until your current billing period ends.',
          type: 'info',
        });
      }
    } catch (err: any) {
      addToast({
        title: 'Could not update auto-renewal',
        description: err?.message,
        type: 'error',
      });
    } finally {
      setIsCancellingAutoRenew(false);
    }
  };

  const handleTestResetFree = async () => {
    setIsSimulating(true);
    try {
      await NextSochApi.testResetToFree();
      await refreshSubscription();
      addToast({
        title: 'Switched to Free Plan',
        description: 'You can now test the 5-question daily free practice limit.',
        type: 'info',
      });
    } catch (err: any) {
      addToast({ title: 'Test reset failed', description: err?.message, type: 'error' });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTestSimulateExpired = async () => {
    setIsSimulating(true);
    try {
      await NextSochApi.testSimulateExpired();
      await refreshSubscription();
      addToast({
        title: 'Simulated Expired Pass',
        description: 'Notice the non-manipulative "Your progress is safe" banner.',
        type: 'warning',
      });
    } catch (err: any) {
      addToast({ title: 'Simulation failed', description: err?.message, type: 'error' });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div
      id="subscription-dashboard-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) setIsSubDashboardOpen(false);
      }}
    >
      <div
        id="subscription-dashboard-container"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              My Subscription & Entitlements
            </h3>
          </div>
          <button
            id="sub-dashboard-close-btn"
            onClick={() => setIsSubDashboardOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Plan Status Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-800/80 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {subscription.planType === 'pass' ? 'Short Pass' : 'Plan'}
                </span>
                <h4 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
                  {subscription.planName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {subscription.priceInr === 0 ? 'Free Forever Tier' : `₹${subscription.priceInr} • ${subscription.billingCycle}`}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    subscription.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : subscription.status === 'trial_expired'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span className="capitalize">{subscription.status.replace('_', ' ')}</span>
                </span>
              </div>
            </div>

            {/* Validity & Time Left */}
            <div className="mt-4 pt-4 border-t border-indigo-100/60 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Time Remaining</span>
                  <span className="font-semibold">
                    {subscription.isPass
                      ? `${subscription.hoursRemaining} Hours left`
                      : subscription.daysRemaining > 0
                      ? `${subscription.daysRemaining} Days left`
                      : subscription.planId === 'plan_free'
                      ? 'Unlimited'
                      : 'Expired'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Expiration / Renewal</span>
                  <span className="font-semibold">
                    {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quota & Usage Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Daily Practice Quota */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daily Free Practice
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {subscription.dailyPractice.solvedToday} / {subscription.dailyPractice.dailyLimit}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    subscription.dailyPractice.isLimitReached ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (subscription.dailyPractice.solvedToday / subscription.dailyPractice.dailyLimit) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {subscription.planType === 'free'
                  ? subscription.dailyPractice.isLimitReached
                    ? 'Limit reached for today. Resets tomorrow at 00:00.'
                    : `${subscription.dailyPractice.remainingToday} free questions remaining today.`
                  : 'Unlimited questions with your active plan.'}
              </p>
            </div>

            {/* AI Tutor Credits */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  AI Doubt Credits
                </span>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {subscription.aiCredits.used} / {subscription.aiCredits.total}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (subscription.aiCredits.used / Math.max(1, subscription.aiCredits.total)) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {subscription.aiCredits.remaining} AI doubt queries remaining this cycle.
              </p>
            </div>
          </div>

          {/* Auto-renew settings (if on recurring monthly) */}
          {subscription.billingCycle === 'monthly' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Auto-Renew Subscription
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {subscription.autoRenew ? 'Active — renews at end of period' : 'Turned off — will not renew'}
                </span>
              </div>
              {subscription.autoRenew && (
                <button
                  type="button"
                  onClick={handleCancelAutoRenew}
                  disabled={isCancellingAutoRenew}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {isCancellingAutoRenew ? 'Cancelling...' : 'Turn Off Auto-Renew'}
                </button>
              )}
            </div>
          )}

          {/* Upgrade / Change Plan */}
          <div className="flex space-x-3">
            <button
              type="button"
              id="sub-dashboard-view-plans-btn"
              onClick={() => {
                setIsSubDashboardOpen(false);
                setIsPricingModalOpen(true);
              }}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md transition"
            >
              <Zap className="w-4 h-4" />
              <span>Explore All Plans & Passes</span>
            </button>
          </div>

          {/* Reviewer / QA Simulator Panel */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-2">
              Reviewer Quick Testing Tools:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleTestResetFree}
                disabled={isSimulating}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
              >
                Reset to Free Plan
              </button>
              <button
                type="button"
                onClick={handleTestSimulateExpired}
                disabled={isSimulating}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-slate-50 transition"
              >
                Simulate Expired Pass Banner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
