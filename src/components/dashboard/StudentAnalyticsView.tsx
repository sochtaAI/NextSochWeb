import React from 'react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS, ALL_QUESTIONS, SUBJECTS } from '../../data/curriculumData';
import {
  Flame,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Award,
  Calendar,
  Share2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Brain
} from 'lucide-react';

export const StudentAnalyticsView: React.FC = () => {
  const {
    userProgress,
    examGoal,
    openSmartStudy,
    setActiveTab,
    setIsShareModalOpen,
  } = useApp();

  const answeredIds = Object.keys(userProgress.answeredQuestions);
  const totalSolved = answeredIds.length;
  const correctCount = answeredIds.filter(id => userProgress.answeredQuestions[id].isCorrect).length;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 100;

  const totalPagesMastered = (Object.values(userProgress.completedPages) as number[][]).reduce(
    (acc, pages) => acc + (pages?.length || 0),
    0
  );

  const totalCurriculumPages = CHAPTERS.reduce((acc, ch) => acc + ch.totalPages, 0);
  const syllabusProgress = Math.round((totalPagesMastered / Math.max(totalCurriculumPages, 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header Profile Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-500/20 font-display">
            RS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                Rahul Sharma
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800/80">
                {examGoal.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
              <span>Persona: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{userProgress.personality}</strong></span>
              <span>•</span>
              <span>Mood: {userProgress.studyMood}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Progress Card</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {userProgress.streakDays} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Top 5% consistency
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total XP</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {userProgress.totalXP}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Level 4 Aspirant
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {accuracy}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {correctCount} of {totalSolved} correct
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">NCERT Pages</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {totalPagesMastered}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
            Mastered with line practice
          </div>
        </div>
      </div>

      {/* Syllabus Coverage Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Subject Mastery Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              NCERT coverage and question precision tracked per subject
            </p>
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Overall Syllabus: <span className="text-indigo-600 dark:text-indigo-400">{syllabusProgress}%</span>
          </div>
        </div>

        <div className="space-y-4">
          {SUBJECTS.map(subj => {
            const subjectChapters = CHAPTERS.filter(c => c.subjectId === subj.id);
            const totalSubjPages = subjectChapters.reduce((a, b) => a + b.totalPages, 0);
            const masteredPages = subjectChapters.reduce((acc, ch) => {
              const p = userProgress.completedPages[ch.id] || [];
              return acc + p.length;
            }, 0);
            const percent = Math.round((masteredPages / Math.max(totalSubjPages, 1)) * 100);

            return (
              <div key={subj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-900 dark:text-white font-display text-sm">{subj.name}</span>
                    <span className="text-[10px] text-slate-400">({subjectChapters.length} Chapters)</span>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400">{percent}% Complete</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>{masteredPages} of {totalSubjPages} Pages Mastered</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('collections');
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    View Chapters →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
