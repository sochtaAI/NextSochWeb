import React, { useState } from 'react';
import { MonetizationAdmin } from './MonetizationAdmin';
import { ShieldCheck, DollarSign, Database, BookOpen, Layers } from 'lucide-react';

export const AdminView: React.FC = () => {
  const [adminTab, setAdminTab] = useState<'monetization' | 'curriculum'>('monetization');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              NEXT SOCH Operations & Admin Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage plans, short passes, revenue run-rate, user entitlements, and curriculum data.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setAdminTab('monetization')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              adminTab === 'monetization'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetization & Plans</span>
          </button>
          <button
            onClick={() => setAdminTab('curriculum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              adminTab === 'curriculum'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum & Questions</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {adminTab === 'monetization' ? (
        <MonetizationAdmin />
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Curriculum & Question Bank
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Over 2,400+ line-by-line NCERT questions mapped across Class 11 & 12 Biology, Physics, Chemistry, and Mathematics.
          </p>
        </div>
      )}
    </div>
  );
};
