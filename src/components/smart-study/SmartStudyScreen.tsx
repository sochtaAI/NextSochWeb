import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS, ALL_QUESTIONS } from '../../data/curriculumData';
import { SmartReader } from './SmartReader';
import { SmartPractice } from './SmartPractice';
import { AcademicEngineBar } from '../academic/AcademicEngineBar';
import { ExamGoal } from '../../types';
import {
  BookOpen,
  Brain,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Target,
  Zap,
  Flame,
  GraduationCap,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

export const SmartStudyScreen: React.FC = () => {
  const {
    activeChapterId,
    setActiveChapterId,
    activePageNumber,
    setActivePageNumber,
    examGoal,
    setExamGoal,
    userProgress,
    setActiveTab,
  } = useApp();

  // Mobile view tab state: 'read' | 'practice'
  const [mobileTab, setMobileTab] = useState<'read' | 'practice'>('read');
  const [targetAnchorId, setTargetAnchorId] = useState<string | null>(null);
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState<boolean>(false);
  const [isPageMenuOpen, setIsPageMenuOpen] = useState<boolean>(false);
  const [sourceJumpNotice, setSourceJumpNotice] = useState<string | null>(null);

  // Find active chapter or fallback to first
  const currentChapter =
    CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];

  // Find current page data or fallback to page 1
  const currentPage =
    currentChapter.pages.find(p => p.pageNumber === activePageNumber) ||
    currentChapter.pages[0] || {
      pageNumber: 1,
      chapterId: currentChapter.id,
      title: currentChapter.title,
      subheading: `Class ${currentChapter.classLevel} ${currentChapter.subjectId}`,
      sourceReference: `NCERT Class ${currentChapter.classLevel} ${currentChapter.subjectId}`,
      topics: currentChapter.concepts.slice(0, 3),
      sections: [],
      summaryPoints: []
    };

  // Get questions strictly mapped to this chapter and page
  const pageQuestions = ALL_QUESTIONS.filter(
    q => q.chapterId === currentChapter.id && q.pageNumber === currentPage.pageNumber
  );

  const handlePageChange = (newPageNum: number) => {
    if (newPageNum >= 1 && newPageNum <= currentChapter.totalPages) {
      setActivePageNumber(newPageNum);
      setTargetAnchorId(null);
      setSourceJumpNotice(null);
      setIsPageMenuOpen(false);
    }
  };

  const handleJumpToSource = (anchorId?: string) => {
    if (anchorId) {
      setTargetAnchorId(anchorId);
      // If on mobile, switch to reader view so the student sees the text!
      setMobileTab('read');
      setSourceJumpNotice('Jumped directly to source paragraph in NCERT reader 📖');
      setTimeout(() => setSourceJumpNotice(null), 3500);
    }
  };

  const handleNextPage = () => {
    if (currentPage.pageNumber < currentChapter.totalPages) {
      handlePageChange(currentPage.pageNumber + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage.pageNumber > 1) {
      handlePageChange(currentPage.pageNumber - 1);
    }
  };

  // Keyboard navigation for page flip (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowRight' && currentPage.pageNumber < currentChapter.totalPages) {
        handlePageChange(currentPage.pageNumber + 1);
      } else if (e.key === 'ArrowLeft' && currentPage.pageNumber > 1) {
        handlePageChange(currentPage.pageNumber - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage.pageNumber, currentChapter.totalPages]);

  const solvedPageQuestionsCount = pageQuestions.filter(
    q => !!userProgress.answeredQuestions[q.id]
  ).length;

  const isPageCompleted = (userProgress.completedPages[currentChapter.id] || []).includes(currentPage.pageNumber);

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* Top Header Control Strip */}
      <header className="flex flex-wrap items-center justify-between px-3 sm:px-5 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-30 gap-2">
        {/* Left cluster: Back + Chapter Selector + Page Selector */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0">
          {/* Back to Collections */}
          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1 shrink-0"
            title="Return to Collections"
            aria-label="Back to Collections"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">Chapters</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

          {/* Chapter Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsChapterMenuOpen(!isChapterMenuOpen);
                setIsPageMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 transition truncate max-w-[170px] sm:max-w-[260px] md:max-w-[320px]"
              aria-label="Select Chapter"
            >
              <span className="truncate">{currentChapter.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
            </button>

            {isChapterMenuOpen && (
              <div
                className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in"
                onMouseLeave={() => setIsChapterMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Switch Chapter
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {CHAPTERS.map(ch => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setActiveChapterId(ch.id);
                        setActivePageNumber(1);
                        setIsChapterMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between ${
                        ch.id === currentChapter.id
                          ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="truncate font-semibold">{ch.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {ch.subjectId} · Class {ch.classLevel} · {ch.totalPages} Pages
                        </div>
                      </div>
                      {ch.id === currentChapter.id && <span className="text-indigo-600 font-bold shrink-0">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Page Navigator Dropdown & Prev/Next Arrows */}
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            <button
              type="button"
              disabled={currentPage.pageNumber <= 1}
              onClick={handlePrevPage}
              className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous Page (ArrowLeft)"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsPageMenuOpen(!isPageMenuOpen);
                  setIsChapterMenuOpen(false);
                }}
                className="flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
              >
                <span>Page {currentPage.pageNumber}/{currentChapter.totalPages}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPageMenuOpen && (
                <div
                  className="absolute left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in"
                  onMouseLeave={() => setIsPageMenuOpen(false)}
                >
                  <div className="px-3 py-1 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase">
                    Select Page
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {currentChapter.pages.map(p => {
                      const isComplete = (userProgress.completedPages[currentChapter.id] || []).includes(p.pageNumber);
                      return (
                        <button
                          key={p.pageNumber}
                          type="button"
                          onClick={() => handlePageChange(p.pageNumber)}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between ${
                            p.pageNumber === currentPage.pageNumber
                              ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="truncate">Page {p.pageNumber}: {p.title}</span>
                          {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={currentPage.pageNumber >= currentChapter.totalPages}
              onClick={handleNextPage}
              className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next Page (ArrowRight)"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center / Right cluster: Target Exam Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Dedicated Exam Goal Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-2 hidden xl:inline">Target:</span>
            {(
              [
                { id: 'NEET', label: 'NEET', icon: Target },
                { id: 'JEE_MAIN', label: 'JEE Main', icon: Zap },
                { id: 'JEE_ADV', label: 'JEE Adv', icon: Flame },
                { id: 'BOARDS', label: 'Boards', icon: GraduationCap },
              ] as const
            ).map(goal => {
              const Icon = goal.icon;
              const isSelected = examGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setExamGoal(goal.id as ExamGoal)}
                  className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`Focus practice on ${goal.label}`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{goal.label}</span>
                </button>
              );
            })}
          </div>

          {/* Solved Status Progress (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Page Solved</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {solvedPageQuestionsCount} / {pageQuestions.length} Qs
              </div>
            </div>
            <div className="w-12 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${
                    pageQuestions.length > 0
                      ? (solvedPageQuestionsCount / pageQuestions.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Mobile View Switcher Tabs: [Read] / [Practice] */}
          <div className="flex md:hidden items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setMobileTab('read')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold transition ${
                mobileTab === 'read'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('practice')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold transition ${
                mobileTab === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Practice ({pageQuestions.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Jump to Source Confirmation Banner */}
      {sourceJumpNotice && (
        <div className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-amber-200 dark:border-amber-800/60 animate-in slide-in-from-top-2 z-20">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>{sourceJumpNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSourceJumpNotice(null)}
            className="text-amber-700 dark:text-amber-400 text-xs hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Senior Faculty Academic Content Engine Bar */}
      <AcademicEngineBar
        chapterId={currentChapter.id}
        chapterTitle={currentChapter.title}
        pageNumber={currentPage.pageNumber}
        onJumpToPage={handlePageChange}
      />

      {/* Main Split Screen Area: LEFT = Source Reader, RIGHT = Page Questions */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANE: Source / Page Reader */}
        <div
          className={`h-full flex-1 ${
            mobileTab === 'practice' ? 'hidden md:block' : 'block'
          } md:w-[53%] lg:w-[54%] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative`}
        >
          <SmartReader
            chapter={currentChapter}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            targetAnchorId={targetAnchorId}
          />
        </div>

        {/* RIGHT PANE: Questions Mapped to the Exact Current Page */}
        <div
          className={`h-full flex-1 ${
            mobileTab === 'read' ? 'hidden md:block' : 'block'
          } md:w-[47%] lg:w-[46%] bg-slate-50 dark:bg-slate-950 relative`}
        >
          <SmartPractice
            questions={pageQuestions}
            currentPageNumber={currentPage.pageNumber}
            chapterTitle={currentChapter.title}
            onJumpToSource={handleJumpToSource}
            onNextPage={handleNextPage}
            hasNextPage={currentPage.pageNumber < currentChapter.totalPages}
            onPrevPage={handlePrevPage}
            hasPrevPage={currentPage.pageNumber > 1}
          />
        </div>

        {/* Mobile floating quick action when viewing Reader */}
        {mobileTab === 'read' && (
          <button
            type="button"
            onClick={() => setMobileTab('practice')}
            className="md:hidden absolute bottom-14 right-4 z-20 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-extrabold shadow-xl shadow-indigo-600/30 flex items-center space-x-1.5 active:scale-95 transition"
          >
            <Brain className="w-4 h-4" />
            <span>Practice Page {currentPage.pageNumber} ({pageQuestions.length})</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        )}

        {/* Mobile floating quick action when viewing Practice */}
        {mobileTab === 'practice' && (
          <button
            type="button"
            onClick={() => setMobileTab('read')}
            className="md:hidden absolute bottom-4 left-4 z-20 px-3.5 py-2 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur text-white rounded-full text-xs font-bold shadow-lg flex items-center space-x-1.5 active:scale-95 transition border border-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Source Text</span>
          </button>
        )}
      </div>
    </div>
  );
};
