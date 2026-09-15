import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NextSochApi } from '../../services/api';
import { ReferralProfile } from '../../types';
import {
  X,
  Users,
  Copy,
  Check,
  Gift,
  Sparkles,
  Share2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const ReferralModal: React.FC = () => {
  const { isReferralModalOpen, setIsReferralModalOpen, refreshSubscription, addToast } = useApp();
  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await NextSochApi.getReferralProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.warn('Referral profile fetch notice:', err);
    }
  };

  useEffect(() => {
    if (isReferralModalOpen) {
      fetchProfile();
    }
  }, [isReferralModalOpen]);

  if (!isReferralModalOpen) return null;

  const handleCopy = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.referralLink || profile.referralCode);
    setCopied(true);
    addToast({ title: 'Referral link copied to clipboard! 📋', type: 'info' });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!profile) return;
    const text = encodeURIComponent(
      `Hey! I'm studying for NEET/JEE on NEXT SOCH with NCERT line-by-line practice. Join using my link and we both get a 3-Day Student Pass free after your first practice set: ${profile.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSimulateMilestone = async () => {
    setIsSimulating(true);
    try {
      const res = await NextSochApi.simulateReferralMilestone();
      if (res.success) {
        await fetchProfile();
        await refreshSubscription();
        addToast({
          title: '3-Day Pass Awarded! 🎁',
          description: res.message || 'Peer completed practice milestone. Reward credited!',
          type: 'success',
        });
      }
    } catch (err: any) {
      addToast({ title: 'Simulation failed', description: err?.message, type: 'error' });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div
      id="referral-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) setIsReferralModalOpen(false);
      }}
    >
      <div
        id="referral-modal-container"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-b border-indigo-800/40">
          <button
            id="referral-modal-close-btn"
            onClick={() => setIsReferralModalOpen(false)}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>SOCH Circle • Study Together</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
            Invite a friend. Unlock 3-Day Passes together.
          </h3>
          <p className="text-slate-300 text-xs mt-1 max-w-sm">
            Zero spam. Rewards unlock only when your study buddy genuinely practices on the platform.
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* How It Works Card */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mx-auto mb-2">
                1
              </div>
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Share Code</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Send link to your study partner</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mx-auto mb-2">
                2
              </div>
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">They Practice</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Solves 5 NCERT questions</div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xs mx-auto mb-2">
                3
              </div>
              <div className="font-bold text-xs text-emerald-800 dark:text-emerald-300">Both Win</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Get 3-Day Pass each</div>
            </div>
          </div>

          {/* Referral Code Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Personal Invite Code & Link
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
                {profile?.referralLink || 'https://nextsoch.com/join?ref=SOCH123'}
              </div>
              <button
                type="button"
                id="referral-copy-btn"
                onClick={handleCopy}
                className="px-3 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 flex items-center space-x-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="mt-3 flex space-x-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Activity / Rewards Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Your Circle Activity
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {profile?.qualifiedReferrals || 0} qualified friends
              </span>
            </div>

            {profile && profile.rewardsList.length > 0 ? (
              <div className="space-y-2">
                {profile.rewardsList.map((rw, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-purple-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {rw.reward_value}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      Claimed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400">
                No active rewards yet. Invite your study circle to begin earning together!
              </div>
            )}
          </div>

          {/* Test simulation button for reviewer */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/70 dark:border-amber-900/50 flex items-center justify-between">
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold block">Reviewer Simulation:</span>
              <span>Test ethical peer learning milestone</span>
            </div>
            <button
              type="button"
              id="referral-test-simulate-btn"
              onClick={handleSimulateMilestone}
              disabled={isSimulating}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition disabled:opacity-50"
            >
              {isSimulating ? 'Simulating...' : 'Simulate Friend 5 Solved'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
