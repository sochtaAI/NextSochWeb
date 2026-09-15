import React, { useState, useEffect } from 'react';
import { NextSochApi } from '../../services/api';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  ShieldCheck,
  Edit2,
  Check,
  RotateCcw,
  Gift,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const MonetizationAdmin: React.FC = () => {
  const { addToast, refreshSubscription } = useApp();

  const [analytics, setAnalytics] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing plan price state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // Manual grant state
  const [grantUserId, setGrantUserId] = useState('user_default');
  const [grantPlanId, setGrantPlanId] = useState('pass_7day');
  const [grantDuration, setGrantDuration] = useState(7);
  const [grantReason, setGrantReason] = useState('Academic Scholarship');
  const [isGranting, setIsGranting] = useState(false);

  // Refund state
  const [refundPaymentId, setRefundPaymentId] = useState('');
  const [refundReason, setRefundReason] = useState('Accidental double charge');
  const [isRefunding, setIsRefunding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, plansRes] = await Promise.all([
        NextSochApi.getAdminAnalytics(),
        NextSochApi.getAdminPlans(),
      ]);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (plansRes.success) setPlans(plansRes.data);
    } catch (err: any) {
      addToast({ title: 'Failed to load admin analytics', description: err?.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePrice = async (planId: string) => {
    try {
      const res = await NextSochApi.updateAdminPlan(planId, { price_inr: editPrice });
      if (res.success) {
        addToast({ title: 'Plan price updated successfully', type: 'success' });
        setEditingPlanId(null);
        fetchData();
        refreshSubscription();
      }
    } catch (err: any) {
      addToast({ title: 'Update failed', description: err?.message, type: 'error' });
    }
  };

  const handleToggleActive = async (plan: any) => {
    try {
      const newStatus = plan.is_active === 1 ? 0 : 1;
      const res = await NextSochApi.updateAdminPlan(plan.id, { is_active: newStatus });
      if (res.success) {
        addToast({ title: `Plan ${newStatus ? 'Activated' : 'Deactivated'}`, type: 'info' });
        fetchData();
        refreshSubscription();
      }
    } catch (err: any) {
      addToast({ title: 'Status change failed', description: err?.message, type: 'error' });
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGranting(true);
    try {
      const res = await NextSochApi.grantAdminAccess({
        userId: grantUserId,
        planId: grantPlanId,
        durationDays: grantDuration,
        reason: grantReason,
      });
      if (res.success) {
        addToast({ title: 'Access Granted! 🎓', description: res.message, type: 'success' });
        fetchData();
        refreshSubscription();
      }
    } catch (err: any) {
      addToast({ title: 'Grant failed', description: err?.message, type: 'error' });
    } finally {
      setIsGranting(false);
    }
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundPaymentId.trim()) return;
    setIsRefunding(true);
    try {
      const res = await NextSochApi.refundAdminPayment(refundPaymentId.trim(), undefined, refundReason);
      if (res.success) {
        addToast({ title: 'Refund Processed 💸', description: res.message, type: 'success' });
        setRefundPaymentId('');
        fetchData();
        refreshSubscription();
      }
    } catch (err: any) {
      addToast({ title: 'Refund failed', description: err?.message, type: 'error' });
    } finally {
      setIsRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
        Loading Monetization & Revenue Console...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ₹{analytics?.totalRevenueInr?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            All-time collected
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Monthly Run-Rate (MRR)</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ₹{analytics?.mrrInr?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            Recurring subscription base
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Short Pass Revenue</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ₹{analytics?.passRevenueInr?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
            ₹9, ₹19, ₹29 pass volume
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Paid Subscribers</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.activeSubscribers || 0}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
            {analytics?.freeUsers || 0} free tier learners
          </div>
        </div>
      </div>

      {/* Plan Price & Availability Management Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pricing Plans & Pass Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live pricing configuration. Changes reflect immediately across mobile & web.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Plan Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Price (₹)</th>
                <th className="py-2.5 px-3">Badge</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {plans.map(plan => {
                const isEditing = editingPlanId === plan.id;

                return (
                  <tr key={plan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {plan.name}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-500 dark:text-slate-400">
                      {plan.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {plan.duration_days} days
                    </td>
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={e => setEditPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border rounded dark:bg-slate-800"
                          />
                          <button
                            onClick={() => handleUpdatePrice(plan.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{plan.price_inr}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {plan.badge ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          {plan.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          plan.is_active === 1
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {plan.is_active === 1 ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingPlanId(plan.id);
                            setEditPrice(plan.price_inr);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                          Edit Price
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Access & Refund Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Manual Grant Tool */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Grant Promotional Access
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Grant free passes or subscriptions to students with financial need, top performers, or support appeals.
          </p>

          <form onSubmit={handleGrantAccess} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={grantUserId}
                onChange={e => setGrantUserId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Plan to Grant
                </label>
                <select
                  value={grantPlanId}
                  onChange={e => setGrantPlanId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="pass_1day">1-Day Pass</option>
                  <option value="pass_3day">3-Day Pass</option>
                  <option value="pass_7day">7-Day Pass</option>
                  <option value="plan_student_monthly">Student Plan (30 Days)</option>
                  <option value="plan_pro_monthly">Pro Plan (30 Days)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  value={grantDuration}
                  onChange={e => setGrantDuration(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Audit Reason
              </label>
              <input
                type="text"
                value={grantReason}
                onChange={e => setGrantReason(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isGranting}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50"
            >
              {isGranting ? 'Granting Access...' : 'Grant Access Instantly'}
            </button>
          </form>
        </div>

        {/* Refund Management Tool */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Process Transaction Refund
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Issue full or partial refunds for student dispute requests or payment reconciliation.
          </p>

          <form onSubmit={handleProcessRefund} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Payment ID
              </label>
              <input
                type="text"
                value={refundPaymentId}
                onChange={e => setRefundPaymentId(e.target.value)}
                placeholder="e.g. pay_sample_123"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Reason for Refund
              </label>
              <input
                type="text"
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                required
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-500">
              Note: Issuing a refund automatically reverts the user's active subscription and entitlements to Free tier.
            </div>

            <button
              type="submit"
              disabled={isRefunding}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50"
            >
              {isRefunding ? 'Processing Refund...' : 'Process Refund'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
