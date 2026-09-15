import React, { useState } from 'react';
import { ChapterSummaryData } from '../../types';
import {
  X,
  Zap,
  Clock,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Flame,
  FileText,
  AlertCircle,
  Tag
} from 'lucide-react';

interface ChapterSummaryModalProps {
  summary: ChapterSummaryData | null;
  chapterTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChapterSummaryModal: React.FC<ChapterSummaryModalProps> = ({
  summary,
  chapterTitle,
  isOpen,
  onClose,
}) => {
  const [activeTier, setActiveTier] = useState<'60s' | '5m' | '15m' | 'checklist'>('60s');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!isOpen || !summary) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalChecklist = summary.lastMinuteChecklist.length;
  const completedChecklist = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div
        id="chapter-summary-modal"
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Clock className="w-3.5 h-3.5" />
                Multi-Tier Spaced Review
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {chapterTitle}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Intelligent Chapter Revision Hub
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Selector */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTier('60s')}
            className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTier === '60s'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            60-Second Flash Recap
          </button>
          <button
            onClick={() => setActiveTier('5m')}
            className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTier === '5m'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-500" />
            5-Minute High-Yield Review
          </button>
          <button
            onClick={() => setActiveTier('15m')}
            className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTier === '15m'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            15-Minute Comprehensive NCERT
          </button>
          <button
            onClick={() => setActiveTier('checklist')}
            className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTier === 'checklist'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Pre-Exam Checklist ({completedChecklist}/{totalChecklist})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TIER 1: 60s FLASH RECAP */}
          {activeTier === '60s' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>The highest-density bullet points designed to trigger rapid neurological recall before tests.</span>
              </div>
              <div className="space-y-2.5">
                {summary.quick60s.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 flex items-start gap-3 shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIER 2: 5-MINUTE HIGH YIELD */}
          {activeTier === '5m' && (
            <div className="space-y-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Organized by major syllabus modules. Focuses strictly on high-yield testable core mechanisms.
              </p>
              {summary.review5m.map((block, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm"
                >
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {block.heading}
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-800 dark:text-gray-200 pl-2">
                    {block.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TIER 3: 15-MINUTE COMPREHENSIVE */}
          {activeTier === '15m' && (
            <div className="space-y-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Full-depth NCERT conceptual consolidation with exact textbook quotations and memory anchors.
              </p>
              {summary.highYield15m.map((block, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm"
                >
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-500" />
                    {block.topic}
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                    {block.summary}
                  </p>
                  <div className="p-3 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 text-xs text-sky-950 dark:text-sky-200 space-y-1">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5" />
                      NCERT Verbatim Anchor:
                    </span>
                    <p className="italic font-serif leading-relaxed">
                      {block.ncertMustRemember}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TIER 4: LAST-MINUTE CHECKLIST */}
          {activeTier === 'checklist' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    Exam Day Confidence Tracker
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400">
                    Verify each high-yield item before stepping into the exam hall.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {Math.round((completedChecklist / totalChecklist) * 100)}%
                  </span>
                  <p className="text-[10px] text-gray-500">Verified</p>
                </div>
              </div>

              <div className="space-y-2">
                {summary.lastMinuteChecklist.map(item => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-gray-300 dark:border-gray-600 bg-transparent'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-medium ${isChecked ? 'line-through opacity-80' : ''}`}>
                          {item.label}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          item.tag === 'exception'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : item.tag === 'formula'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : item.tag === 'pyq'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            NEXT SOCH Spaced Review Engine · Senior Faculty Verified
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
