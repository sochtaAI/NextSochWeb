import React, { useState } from 'react';
import { ConceptDetail } from '../../types';
import {
  X,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Target,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Flame,
  FileText
} from 'lucide-react';

interface ConceptDeepDiveModalProps {
  concept: ConceptDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onJumpToPage?: (pageNumber: number) => void;
}

export const ConceptDeepDiveModal: React.FC<ConceptDeepDiveModalProps> = ({
  concept,
  isOpen,
  onClose,
  onJumpToPage,
}) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'traps' | 'formulae' | 'pyqs'>('pillars');

  if (!isOpen || !concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div
        id="concept-deep-dive-modal"
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Academic Standard
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Page {concept.pageNumber} · {concept.sectionTitle}
              </span>
              {concept.pyqConnection && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                  <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  {concept.pyqConnection}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {concept.name}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-normal max-w-2xl line-clamp-2">
              {concept.shortDefinition}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/60 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pillars')}
            className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pillars'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            6 Core Explanation Pillars
          </button>
          <button
            onClick={() => setActiveTab('traps')}
            className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'traps'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Examiner Traps & Misconceptions ({concept.misconceptions.length + concept.examTraps.length})
          </button>
          {concept.formulae && concept.formulae.length > 0 && (
            <button
              onClick={() => setActiveTab('formulae')}
              className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'formulae'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Zap className="w-4 h-4 text-sky-500" />
              Formulae & Conditions ({concept.formulae.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('pyqs')}
            className={`py-3 px-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pyqs'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Target className="w-4 h-4 text-purple-500" />
            Key Facts & Source Citation
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 6 PILLARS */}
          {activeTab === 'pillars' && (
            <div className="space-y-6">
              {/* Introduction Callout */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-semibold text-xs tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Standard Senior Faculty Conceptual Framework
                </div>
                <p className="mt-1 text-xs text-emerald-950 dark:text-emerald-200/90 leading-relaxed">
                  Every concept on NEXT SOCH is prepared without shortcuts. Every explanation rigorously answers: WHAT, WHY, HOW, WHERE, EXAM ANGLE, and CONFUSION ALERT.
                </p>
              </div>

              {/* The 6 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. WHAT */}
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      1. WHAT is it?
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Formal Definition</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {concept.coreExplanation.what}
                  </p>
                </div>

                {/* 2. WHY */}
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      2. WHY does it exist?
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">First Principle Reason</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {concept.coreExplanation.why}
                  </p>
                </div>

                {/* 3. HOW */}
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      3. HOW does it work?
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Mechanism & Structure</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {concept.coreExplanation.how}
                  </p>
                </div>

                {/* 4. WHERE */}
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      4. WHERE does it apply?
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Domain & Scope</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {concept.coreExplanation.where}
                  </p>
                </div>
              </div>

              {/* EXAM ANGLE & CONFUSION ALERT (Special Prominence) */}
              <div className="space-y-4 pt-2">
                {/* 5. EXAM ANGLE */}
                <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                    <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    5. EXAM ANGLE — How Examiners Target This
                  </div>
                  <p className="text-sm text-amber-950 dark:text-amber-100 leading-relaxed">
                    {concept.coreExplanation.examAngle}
                  </p>
                </div>

                {/* 6. CONFUSION ALERT */}
                <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 shadow-sm">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    6. CONFUSION ALERT — Where Most Students Lose Marks
                  </div>
                  <p className="text-sm text-rose-950 dark:text-rose-100 leading-relaxed">
                    {concept.coreExplanation.confusionAlert}
                  </p>
                </div>
              </div>

              {/* Why It Matters */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Why this matters in the larger syllabus: </span>
                <span>{concept.whyItMatters}</span>
              </div>
            </div>
          )}

          {/* TAB 2: TRAPS & MISCONCEPTIONS */}
          {activeTab === 'traps' && (
            <div className="space-y-6">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>Audited real competitive exam traps based on 10-year question trends.</span>
              </div>

              {/* Misconceptions */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Targeted Student Misconceptions
                </h3>
                {concept.misconceptions.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        <X className="w-4 h-4" />
                        Common Student Myth:
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium pl-5">
                        "{m.myth}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified Scientific Reality:
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 pl-5">
                        {m.reality}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Flame className="w-3.5 h-3.5 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>
                        <strong className="font-semibold">The Examiner Trap: </strong>
                        {m.examinerTrap}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specific Exam Traps */}
              {concept.examTraps && concept.examTraps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Condition Changes & Statement Pitfalls
                  </h3>
                  <div className="space-y-2">
                    {concept.examTraps.map((trap, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-500 flex-shrink-0" />
                        <span>{trap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FORMULAE & CONDITIONS */}
          {activeTab === 'formulae' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Formulae are never presented blindly. Each formula includes exact definitions of variables, conditions of applicability, and where examiners set pitfalls.
              </p>
              {concept.formulae &&
                concept.formulae.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {f.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-mono">
                        Formula
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-900 text-emerald-400 font-mono text-center text-base tracking-wide overflow-x-auto">
                      {f.expression}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                        <strong className="text-gray-900 dark:text-white">Variables: </strong>
                        {f.variables}
                      </div>
                      <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                        <strong className="text-gray-900 dark:text-white">Applicable When: </strong>
                        {f.conditions}
                      </div>
                    </div>
                    {f.commonTrap && (
                      <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span><strong>Watch Out: </strong>{f.commonTrap}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* TAB 4: KEY FACTS & SOURCE CITATIONS */}
          {activeTab === 'pyqs' && (
            <div className="space-y-6">
              {/* Prescribed Source Reference */}
              <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    Prescribed Official Source
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {concept.sourceReference}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Line-by-line verification against the latest rationalized syllabus.
                  </p>
                </div>
                {onJumpToPage && (
                  <button
                    onClick={() => {
                      onJumpToPage(concept.pageNumber);
                      onClose();
                    }}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/60 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-800 transition flex items-center gap-1"
                  >
                    Open Page {concept.pageNumber}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Key Facts List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Essential Facts to Commit to Memory
                </h3>
                <div className="space-y-2">
                  {concept.keyFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 text-xs text-gray-800 dark:text-gray-200 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Concepts */}
              {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Connected Concepts in Syllabi
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {concept.relatedConcepts.map(rc => (
                      <span
                        key={rc.id}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        <ArrowRight className="w-3 h-3 text-emerald-600" />
                        {rc.name} ({rc.chapterTitle})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            NEXT SOCH Academic Content Engine · Senior Faculty Verified
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition"
          >
            Close Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
};
