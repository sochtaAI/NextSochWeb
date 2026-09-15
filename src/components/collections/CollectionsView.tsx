import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS, SUBJECTS, ALL_QUESTIONS } from '../../data/curriculumData';
import { SubjectType, ClassLevel } from '../../types';
import {
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  Swords,
  ChevronRight,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';

export const CollectionsView: React.FC = () => {
  const {
    examGoal,
    setExamGoal,
    openSmartStudy,
    setActiveTab,
    activeSubjectId,
    setActiveSubjectId,
    classLevel,
    setClassLevel,
    userProgress,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');

  // Filter chapters by subject, class, search, and status
  const filteredChapters = CHAPTERS.filter(ch => {
    if (ch.subjectId !== activeSubjectId) return false;
    if (ch.classLevel !== classLevel) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ch.title.toLowerCase().includes(q);
      const matchDesc = ch.description.toLowerCase().includes(q);
      const matchConcepts = ch.concepts.some(c => c.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchConcepts) return false;
    }

    const completedPages = userProgress.completedPages[ch.id] || [];
    const isCompleted = completedPages.length >= ch.totalPages;
    const isStarted = completedPages.length > 0;

    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'in_progress' && (!isStarted || isCompleted)) return false;
    if (statusFilter === 'not_started' && isStarted) return false;

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header & Hierarchy Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>{examGoal.replace('_', ' ')}</span>
            <span>→</span>
            <span>Class {classLevel}</span>
            <span>→</span>
            <span className="text-indigo-600 dark:text-indigo-400">{activeSubjectId}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            NCERT Curriculum Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Select chapter to initiate split-screen textbook reading and mapped question solving.
          </p>
        </div>

        {/* Class level pills */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-auto">
          {(['11', '12'] as const).map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => setClassLevel(lvl)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                classLevel === lvl
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Class {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {SUBJECTS.map(subj => {
          const isSelected = activeSubjectId === subj.id;
          const countForSubject = CHAPTERS.filter(c => c.subjectId === subj.id && c.classLevel === classLevel).length;

          return (
            <button
              key={subj.id}
              type="button"
              onClick={() => setActiveSubjectId(subj.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{subj.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {countForSubject}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeSubjectId.toLowerCase()} chapters or topics...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          {(
            [
              { id: 'all', label: 'All Chapters' },
              { id: 'not_started', label: 'Not Started' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
            ] as const
          ).map(filter => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
                statusFilter === filter.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.length === 0 ? (
          <div className="col-span-full py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No chapters match your selection
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No {activeSubjectId.toLowerCase()} chapters found in Class {classLevel} matching "{searchQuery || statusFilter}".
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              {classLevel === '11' && (
                <button
                  type="button"
                  onClick={() => setClassLevel('12')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Switch to Class 12
                </button>
              )}
              {classLevel === '12' && (
                <button
                  type="button"
                  onClick={() => setClassLevel('11')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Switch to Class 11
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredChapters.map(chapter => {
            const completedPages = userProgress.completedPages[chapter.id] || [];
            const completionPercent = Math.round(
              (completedPages.length / chapter.totalPages) * 100
            );
            const chapterQuestions = ALL_QUESTIONS.filter(q => q.chapterId === chapter.id);
            const pyqCount = chapterQuestions.filter(q => q.isPYQ).length;
            const lastPage = userProgress.lastStudied?.chapterId === chapter.id
              ? userProgress.lastStudied.pageNumber
              : (completedPages.length > 0 ? Math.min(completedPages.length + 1, chapter.totalPages) : 1);

            return (
              <div
                key={chapter.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-600 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Chapter {chapter.number}
                    </span>
                    <span>{chapter.totalPages} NCERT Pages</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display mb-1">
                    {chapter.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {chapter.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-indigo-800 dark:text-indigo-300 font-semibold mb-4">
                    🎯 Weightage: {chapter.weightage}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Progress</span>
                      <span>{completionPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${completionPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Concept tags */}
                  <div className="flex flex-wrap gap-1 mb-5">
                    {chapter.concepts.slice(0, 3).map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md truncate max-w-[200px]"
                      >
                        {concept}
                      </span>
                    ))}
                    {chapter.concepts.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                        +{chapter.concepts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => openSmartStudy(chapter.subjectId, chapter.id, lastPage)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs group"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {completedPages.length > 0 ? `Resume Chapter (Page ${lastPage})` : 'Start Smart Study (Read + Practice)'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('pyqs')}
                      className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition text-center"
                    >
                      PYQs ({pyqCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tests')}
                      className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition text-center"
                    >
                      Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('battle')}
                      className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition text-center"
                    >
                      Battle
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
