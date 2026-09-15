import React from 'react';
import { ExaminerMindset } from '../../types';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ExaminerMindsetCardProps {
  mindset: ExaminerMindset;
  onJumpToPage?: (pageNumber: number) => void;
}

export const ExaminerMindsetCard: React.FC<ExaminerMindsetCardProps> = ({
  mindset,
  onJumpToPage,
}) => {
  return (
    <div
      id={`examiner-mindset-${mindset.id}`}
      className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 shadow-sm space-y-4 transition hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Examiner Traps & Mindset
              </span>
              {mindset.pageNumber && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page {mindset.pageNumber}
                </span>
              )}
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              {mindset.topic}
            </h4>
          </div>
        </div>
      </div>

      {/* How It Is Tested */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 text-xs space-y-1">
        <span className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
          How The Examiner Frames This
        </span>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
          {mindset.howTested}
        </p>
      </div>

      {/* The Obvious Trap & Misconception */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/40 text-xs space-y-1">
          <span className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            The Obvious Trap
          </span>
          <p className="text-rose-950 dark:text-rose-200 leading-relaxed">
            {mindset.obviousTrap}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-xs space-y-1">
          <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            Root Misconception
          </span>
          <p className="text-amber-950 dark:text-amber-200 leading-relaxed">
            {mindset.misconceptionTargeted}
          </p>
        </div>
      </div>

      {/* What Happens When Conditions Change */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/40 text-xs space-y-1">
        <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          If Conditions Change (The Deciding Factor)
        </span>
        <p className="text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
          {mindset.conditionChangeImpact}
        </p>
      </div>

      {/* Overlooked NCERT Detail */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
        <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <strong className="text-gray-900 dark:text-gray-100 font-semibold">Overlooked Source Detail: </strong>
          <span>{mindset.overlookedDetail}</span>
        </div>
      </div>
    </div>
  );
};
