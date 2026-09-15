import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_QUESTIONS } from '../../data/curriculumData';
import { MistakeCategory } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Filter,
  Sparkles,
  RotateCcw,
  Check,
  Tag
} from 'lucide-react';

export const MistakeNotebook: React.FC = () => {
  const { userProgress, resolveMistake, openSmartStudy, recordAnswer } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [retestAnswers, setRetestAnswers] = useState<Record<string, string>>({});
  const [retestFeedback, setRetestFeedback] = useState<Record<string, boolean>>({});

  const mistakes = userProgress.mistakes;
  const unresolvedMistakes = mistakes.filter(m => !m.resolved);

  const filteredMistakes = unresolvedMistakes.filter(m => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'All Mistakes', count: unresolvedMistakes.length },
    { id: 'concept', label: 'Concept Gaps', count: unresolvedMistakes.filter(m => m.category === 'concept').length },
    { id: 'fact', label: 'NCERT Facts', count: unresolvedMistakes.filter(m => m.category === 'fact').length },
    { id: 'confusion', label: 'Option Confusion', count: unresolvedMistakes.filter(m => m.category === 'confusion').length },
    { id: 'careless', label: 'Careless Reading', count: unresolvedMistakes.filter(m => m.category === 'careless').length },
    { id: 'calculation', label: 'Calculation', count: unresolvedMistakes.filter(m => m.category === 'calculation').length },
  ];

  const handleRetestSubmit = (mistakeId: string, questionId: string) => {
    const selected = retestAnswers[mistakeId];
    if (!selected) return;

    const question = ALL_QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correctAnswer === selected;
    setRetestFeedback(prev => ({ ...prev, [mistakeId]: isCorrect }));

    if (isCorrect) {
      setTimeout(() => {
        resolveMistake(mistakeId);
      }, 1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>PERSONAL ERROR REPOSITORY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            My Mistake Notebook
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every question you answered incorrectly is stored here. Identify your error patterns, review the source lines, and re-test to master the concept.
          </p>
        </div>

        <div className="text-xs font-bold px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>{unresolvedMistakes.length} Unresolved Mistakes</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeCategory === cat.id
                  ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Mistakes List */}
      <div className="space-y-6">
        {filteredMistakes.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
              No mistakes here! You're all caught up. 🎉
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Continue your NCERT reading and practicing in Smart Study. If you make any errors, they'll appear here automatically.
            </p>
          </div>
        ) : (
          filteredMistakes.map(mistake => {
            const question = ALL_QUESTIONS.find(q => q.id === mistake.questionId);
            if (!question) return null;

            const selectedOptionText = question.options.find(o => o.id === mistake.selectedOption)?.text;
            const correctOptionText = question.options.find(o => o.id === mistake.correctOption)?.text;
            const retestResult = retestFeedback[mistake.id];

            return (
              <div
                key={mistake.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition"
              >
                {/* Error Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span>{mistake.category.toUpperCase()} ERROR</span>
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {question.subjectId} · Page {question.pageNumber}
                    </span>
                  </div>

                  <button
                    onClick={() => resolveMistake(mistake.id)}
                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/80 transition flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Concept Cleared</span>
                  </button>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {question.questionText}
                </p>

                {/* What Went Wrong Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs">
                  <div className="space-y-1">
                    <span className="text-rose-600 dark:text-rose-400 font-bold block">
                      ✕ You Selected: ({mistake.selectedOption})
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      {selectedOptionText || 'Selected option'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                      ✓ Correct Answer: ({mistake.correctOption})
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">
                      {correctOptionText || 'Correct option'}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-2">
                  <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>NCERT Pedagogical Fix:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {question.explanation}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    📖 Source: {question.sourceReference}
                  </div>
                </div>

                {/* Re-test Widget */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Quick Re-test to clear:</span>
                    </span>

                    <button
                      onClick={() => openSmartStudy(question.subjectId, question.chapterId, question.pageNumber)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Source Page {question.pageNumber} →</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {question.options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setRetestAnswers(prev => ({ ...prev, [mistake.id]: opt.id }))
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          retestAnswers[mistake.id] === opt.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Option ({opt.id})
                      </button>
                    ))}

                    <button
                      disabled={!retestAnswers[mistake.id]}
                      onClick={() => handleRetestSubmit(mistake.id, question.id)}
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition disabled:opacity-30 ml-auto"
                    >
                      Check Re-test
                    </button>
                  </div>

                  {retestResult !== undefined && (
                    <div className="mt-2 text-xs font-bold">
                      {retestResult ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          ✓ Correct! Concept cleared and resolving mistake...
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">
                          ✕ Still incorrect. Review the source page on the left panel!
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
