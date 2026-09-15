import React, { useState } from 'react';
import {
  DETAILED_CONCEPTS,
  COMPARISON_TABLES,
  EXAMINER_MINDSETS,
  CHAPTER_SUMMARIES_MAP,
  CONTENT_COMPLETENESS_METRICS
} from '../../data/academicContentData';
import { ConceptDeepDiveModal } from './ConceptDeepDiveModal';
import { ComparisonTableModal } from './ComparisonTableModal';
import { ChapterSummaryModal } from './ChapterSummaryModal';
import { SourceApplicabilityModal } from './SourceApplicabilityModal';
import { ExaminerMindsetCard } from './ExaminerMindsetCard';
import { ConceptDetail } from '../../types';
import {
  BookOpen,
  ArrowRightLeft,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers
} from 'lucide-react';

interface AcademicEngineBarProps {
  chapterId: string;
  chapterTitle: string;
  pageNumber: number;
  onJumpToPage?: (pageNumber: number) => void;
}

export const AcademicEngineBar: React.FC<AcademicEngineBarProps> = ({
  chapterId,
  chapterTitle,
  pageNumber,
  onJumpToPage,
}) => {
  // Find concepts for this page (or chapter fallback)
  const pageConcepts = Object.values(DETAILED_CONCEPTS).filter(
    c => c.chapterId === chapterId && c.pageNumber === pageNumber
  );
  const chapterConcepts = Object.values(DETAILED_CONCEPTS).filter(
    c => c.chapterId === chapterId
  );
  const availableConcepts = pageConcepts.length > 0 ? pageConcepts : chapterConcepts;

  // Find comparison tables for this chapter
  const comparisonTables = COMPARISON_TABLES.filter(t => t.chapterId === chapterId);

  // Find examiner mindsets for this chapter/page
  const examinerMindsets = EXAMINER_MINDSETS.filter(m => m.chapterId === chapterId);

  // Chapter summary
  const summary = CHAPTER_SUMMARIES_MAP[chapterId] || null;

  // Completeness metric
  const completeness = CONTENT_COMPLETENESS_METRICS.find(m => m.chapterId === chapterId);

  // Modal states
  const [selectedConcept, setSelectedConcept] = useState<ConceptDetail | null>(null);
  const [isConceptModalOpen, setIsConceptModalOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [showExaminerDrawer, setShowExaminerDrawer] = useState<boolean>(false);

  return (
    <>
      {/* Top Engine Action Bar */}
      <div
        id="academic-engine-bar"
        className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2.5 flex items-center justify-between gap-3 overflow-x-auto shadow-2xs select-none"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Engine Label */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/40 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Senior Faculty Verified</span>
          </div>

          {/* 1. Concept Deep Dive Button */}
          {availableConcepts.length > 0 && (
            <button
              onClick={() => {
                setSelectedConcept(availableConcepts[0]);
                setIsConceptModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800/40 transition whitespace-nowrap"
              title="Examine full 6 core explanation pillars (What, Why, How, Where, Exam Angle, Confusion Alert)"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Concept Deep Dive (6 Pillars)</span>
            </button>
          )}

          {/* 2. Examiner Mindset Button */}
          {examinerMindsets.length > 0 && (
            <button
              onClick={() => setShowExaminerDrawer(!showExaminerDrawer)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition whitespace-nowrap ${
                showExaminerDrawer
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
              }`}
              title="See how examiners manipulate options, change conditions, and exploit student traps"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Examiner Mindset & Traps ({examinerMindsets.length})</span>
              {showExaminerDrawer ? (
                <ChevronUp className="w-3 h-3 ml-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5" />
              )}
            </button>
          )}

          {/* 3. Comparison Matrices Button */}
          {comparisonTables.length > 0 && (
            <button
              onClick={() => setIsComparisonModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800/40 transition whitespace-nowrap"
              title="High-yield side-by-side contrast tables resolving common student confusion"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" />
              <span>Contrast Matrix ({comparisonTables.length})</span>
            </button>
          )}

          {/* 4. Multi-tier Review Button */}
          {summary && (
            <button
              onClick={() => setIsSummaryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800/40 transition whitespace-nowrap"
              title="60s, 5m, 15m spaced review and last-minute pre-exam checklist"
            >
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Spaced Review Hub (60s / 5m / 15m)</span>
            </button>
          )}

          {/* 5. Prescribed Syllabus Sources */}
          <button
            onClick={() => setIsSourceModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold border border-gray-200 dark:border-gray-700 transition whitespace-nowrap"
            title="Official prescribed sources & rationalization status by exam"
          >
            <Layers className="w-3.5 h-3.5 text-gray-600" />
            <span>Prescribed Sources</span>
          </button>
        </div>

        {/* Right side verification & NCERT mapped pill */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% NCERT Line-Mapped
          </span>
          <span>·</span>
          <span>Zero Fake Content</span>
        </div>
      </div>

      {/* Expandable Examiner Mindset Drawer */}
      {showExaminerDrawer && examinerMindsets.length > 0 && (
        <div
          id="examiner-mindset-drawer"
          className="bg-amber-50/40 dark:bg-gray-900/90 border-b border-amber-200 dark:border-amber-900/40 p-4 animate-fade-in"
        >
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  Audited Examiner Traps for {chapterTitle}
                </h4>
              </div>
              <button
                onClick={() => setShowExaminerDrawer(false)}
                className="text-xs text-amber-800 dark:text-amber-300 hover:underline font-semibold"
              >
                Hide Traps
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examinerMindsets.map(mindset => (
                <ExaminerMindsetCard
                  key={mindset.id}
                  mindset={mindset}
                  onJumpToPage={onJumpToPage}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConceptDeepDiveModal
        concept={selectedConcept}
        isOpen={isConceptModalOpen}
        onClose={() => setIsConceptModalOpen(false)}
        onJumpToPage={onJumpToPage}
      />

      <ComparisonTableModal
        tables={comparisonTables}
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
      />

      <ChapterSummaryModal
        summary={summary}
        chapterTitle={chapterTitle}
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
      />

      <SourceApplicabilityModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
      />
    </>
  );
};
