import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_QUESTIONS } from '../../data/curriculumData';
import {
  History,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award
} from 'lucide-react';

export const SmartRevision: React.FC = () => {
  const { userProgress, updateRevisionStatus, openSmartStudy } = useApp();

  const [activeFilter, setActiveFilter] = useState<'due' | 'all' | 'mastered'>('due');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  const revisionItems = userProgress.revisionQueue;

  const filteredItems = revisionItems.filter(item => {
    if (activeFilter === 'due') return item.status === 'due';
    if (activeFilter === 'mastered') return item.status === 'mastered';
    return true;
  });

  const handleSelectOption = (revisionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [revisionId]: optionId }));
    setRevealedExplanations(prev => ({ ...prev, [revisionId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>SPACED REPETITION ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Smart Revision Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Combats the cognitive forgetting curve using dynamic 1-day, 3-day, 7-day, and 21-day spaced intervals.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
            {revisionItems.filter(i => i.status === 'due').length} Questions Due Today
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {(
          [
            { id: 'due', label: 'Due Today' },
            { id: 'all', label: 'All Scheduled' },
            { id: 'mastered', label: 'Mastered' },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
              All caught up with revisions! 🎉
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Continue reading and practicing. Questions will automatically queue here when their spaced intervals mature.
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const question = ALL_QUESTIONS.find(q => q.id === item.questionId);
            if (!question) return null;

            const selected = selectedAnswers[item.id];
            const isRevealed = revealedExplanations[item.id];
            const isCorrect = selected === question.correctAnswer;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
              >
                {/* Revision Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Interval: {item.intervalDays} Days</span>
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {question.subjectId} · Page {question.pageNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">
                      Repetition #{item.repetitions}
                    </span>
                  </div>

                  <button
                    onClick={() => openSmartStudy(question.subjectId, question.chapterId, question.pageNumber)}
                    className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View in NCERT (Page {question.pageNumber}) →</span>
                  </button>
                </div>

                {/* Question */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {question.questionText}
                </p>

                {/* Interactive Options */}
                <div className="space-y-2 text-xs">
                  {question.options.map(opt => {
                    const isOptionSelected = selected === opt.id;
                    let style =
                      'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

                    if (isRevealed) {
                      if (opt.id === question.correctAnswer) {
                        style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-950 dark:text-emerald-100';
                      } else if (isOptionSelected) {
                        style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 line-through text-rose-950';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isRevealed}
                        onClick={() => handleSelectOption(item.id, opt.id)}
                        className={`w-full text-left p-3 rounded-xl border flex items-start space-x-3 transition ${style}`}
                      >
                        <span className="font-bold shrink-0">({opt.id})</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Post Answer Feedback & Next Interval Selector */}
                {isRevealed && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correctly Recalled!</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          Incorrect. Correct Option: ({question.correctAnswer})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {question.explanation}
                    </p>

                    {/* How well was this retained? */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        How well did you recall this concept?
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateRevisionStatus(item.id, 'retained')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        >
                          <span>Retained 👍 (+{item.intervalDays * 2}d)</span>
                        </button>

                        <button
                          onClick={() => updateRevisionStatus(item.id, 'mastered')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Mastered 🌟</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
