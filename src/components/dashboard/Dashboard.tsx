import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS, ALL_QUESTIONS, SOCH_OF_THE_DAY, FUN_STUDENT_MEMES, SUBJECTS } from '../../data/curriculumData';
import {
  Flame,
  Sparkles,
  BookOpen,
  ArrowRight,
  History,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  Smile,
  Coffee,
  Clock,
  ChevronRight,
  Share2,
  FileQuestion
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    examGoal,
    setExamGoal,
    userProgress,
    openSmartStudy,
    setActiveTab,
    setActiveSubjectId,
    setStudyMood,
    setIsShareModalOpen,
    setIsAiModalOpen,
    setAiInitialPrompt,
  } = useApp();

  const [collectionFilter, setCollectionFilter] = useState<'ALL' | 'NEET' | 'JEE' | 'BOARDS'>('ALL');

  // Time-aware greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Find last studied chapter
  const lastStudiedChapter =
    CHAPTERS.find(c => c.id === userProgress.lastStudied.chapterId) || CHAPTERS[0];
  const lastStudiedPageNum = userProgress.lastStudied.pageNumber || 1;

  // Calculate stats
  const answeredIds = Object.keys(userProgress.answeredQuestions);
  const totalSolved = answeredIds.length;
  const correctCount = answeredIds.filter(id => userProgress.answeredQuestions[id].isCorrect).length;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 100;
  const conceptsMastered = (Object.values(userProgress.completedPages) as number[][]).reduce(
    (acc: number, pages: number[]) => acc + (pages?.length || 0) * 2,
    0
  );

  const dueRevisionCount = userProgress.revisionQueue.filter(r => r.status === 'due').length;

  const currentSoch = SOCH_OF_THE_DAY[0];

  const moods = [
    { id: 'In the zone 🎯', label: 'In the zone 🎯' },
    { id: 'Need chai ☕', label: 'Need chai ☕' },
    { id: 'Brain fried 🍳', label: 'Brain fried 🍳' },
    { id: 'Revision mode 🔄', label: 'Revision mode 🔄' },
  ];

  // Filter subjects based on collectionFilter
  const displayedSubjects = SUBJECTS.filter(subj => {
    if (collectionFilter === 'ALL') return true;
    if (collectionFilter === 'NEET') return subj.id !== 'MATHEMATICS';
    if (collectionFilter === 'JEE') return subj.id !== 'BIOLOGY';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* 1. TOP GREETING & STATS ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {greeting} 👋 Rahul Sharma
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80">
              {examGoal.replace('_', ' ')} Aspirant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            "Read your source. Practice instantly. Master what matters."
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
            title="Generate shareable progress card"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Card</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAiInitialPrompt('Create a balanced study strategy for today based on my active chapters and revision items.');
              setIsAiModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Study Plan</span>
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {userProgress.streakDays} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Consistent learning 🔥
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Questions Solved</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {totalSolved}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {CHAPTERS.length} chapters
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {accuracy}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Targeting ≥85%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Concepts Mastered</span>
            <Brain className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {conceptsMastered}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            NCERT Verified 🔒
          </div>
        </div>
      </div>

      {/* 3. CONTINUE LEARNING (THE MOST IMPORTANT SECTION) */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CONTINUE LEARNING</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
              {lastStudiedChapter.subjectId} · Class {lastStudiedChapter.classLevel}
            </h2>

            <p className="text-base font-semibold text-indigo-200">
              {lastStudiedChapter.title} — Page {lastStudiedPageNum} / {lastStudiedChapter.totalPages}
            </p>

            {/* Progress bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-1.5">
                <span>Chapter Progress</span>
                <span>{Math.round((lastStudiedPageNum / lastStudiedChapter.totalPages) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-indigo-800/40">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{
                    width: `${(lastStudiedPageNum / lastStudiedChapter.totalPages) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <button
            id="dashboard-continue-learning-btn"
            type="button"
            onClick={() => openSmartStudy(lastStudiedChapter.subjectId, lastStudiedChapter.id, lastStudiedPageNum)}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-indigo-50 text-indigo-950 font-extrabold rounded-2xl text-sm shadow-md transition flex items-center justify-center space-x-2 shrink-0 group"
          >
            <span>Resume Reading & Practice</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 4. REVISION DUE & RECOMMENDED FOR YOU (TWO COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revision Due Section */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                    Revision Due Today
                  </h3>
                  <span className="text-xs text-slate-400">Spaced repetition queue</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
                {dueRevisionCount} questions
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Questions from past sessions are scheduled for review today to prevent the forgetting curve.
            </p>

            {dueRevisionCount === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 text-center py-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Revision Queue Clear! 🎉
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 max-w-xs mx-auto">
                  No spaced repetition items are due right now. Keep your momentum going by learning new pages.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {userProgress.revisionQueue.slice(0, 2).map((item, idx) => {
                  const question = ALL_QUESTIONS.find(q => q.id === item.questionId);
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                          {question?.concept || 'Cell Theory'}
                        </span>
                        <span>Due Now</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 line-clamp-1 font-medium">
                        {question?.questionText || 'NCERT Line-by-line question'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(dueRevisionCount > 0 ? 'revision' : 'mistakes')}
            className="w-full mt-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center space-x-1"
          >
            <span>{dueRevisionCount > 0 ? `Start Revision Session (${dueRevisionCount})` : 'Review Mistake Notebook'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recommended For You */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                  Recommended For You
                </h3>
                <span className="text-xs text-slate-400">
                  Targeted high-yield topics for {examGoal}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                subject: 'BIOLOGY',
                title: 'Prokaryotic Cell Envelope & Mesosomes',
                chapterId: 'bio-11-cell',
                page: 2,
                reason: 'High-yield NEET Assertion-Reason trap topic',
                weight: 'NEET 2021-2023 PYQ Hotspot',
              },
              {
                subject: 'BIOLOGY',
                title: 'Fluid Mosaic Model & Golgi Apparatus',
                chapterId: 'bio-11-cell',
                page: 3,
                reason: 'Erythrocyte 52% protein / 40% lipid memory fact',
                weight: 'Direct NCERT statement questions',
              },
              {
                subject: 'CHEMISTRY',
                title: 'Molecular Orbital Theory & Magnetism of O2',
                chapterId: 'chem-11-bonding',
                page: 2,
                reason: 'Frequently tested across both NEET and JEE Main',
                weight: 'Paramagnetism verification',
              },
            ].map((rec, idx) => (
              <div
                key={idx}
                onClick={() => openSmartStudy(rec.subject as any, rec.chapterId, rec.page)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-slate-200/70 dark:border-slate-700/60 cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center space-x-2 text-[11px] mb-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {rec.subject}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {rec.weight}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{rec.reason}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. EXPLORE COLLECTIONS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Explore Collections
            </h3>
            <p className="text-xs text-slate-500">
              Exam → Class → Subject → Chapter → Page hierarchy
            </p>
          </div>

          {/* Collection Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'NEET', 'JEE', 'BOARDS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setCollectionFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  collectionFilter === tab
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedSubjects.map(subj => {
            const subjectChapters = CHAPTERS.filter(c => c.subjectId === subj.id);
            return (
              <div
                key={subj.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Class 11 & 12
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      NCERT Source
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-display mb-1">
                    {subj.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {subj.chaptersCount} Chapters · {subj.questionsCount}+ Questions
                  </p>

                  <div className="space-y-1.5 mb-5">
                    {subjectChapters.map(ch => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => openSmartStudy(ch.subjectId, ch.id, 1)}
                        className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex items-center justify-between group"
                      >
                        <span className="truncate pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{ch.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSubjectId(subj.id);
                    setActiveTab('collections');
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <span>Explore {subj.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. SOCH OF THE DAY & STUDENT LIFE / FUN LAYER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soch of the Day */}
        <div className="bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/20 rounded-3xl p-6 border border-amber-200 dark:border-amber-800/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 text-xs font-bold mb-3">
              <span>💭</span>
              <span className="uppercase tracking-wider">SOCH OF THE DAY</span>
            </div>
            <blockquote className="text-base font-bold text-slate-900 dark:text-white leading-relaxed italic">
              "{currentSoch.quote}"
            </blockquote>
            <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold mt-3 p-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60">
              💡 {currentSoch.insight}
            </p>
          </div>
          <div className="text-[11px] text-slate-400 mt-4">
            {currentSoch.author} · {currentSoch.date}
          </div>
        </div>

        {/* Student Life & Study Mood */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Smile className="w-4 h-4 text-indigo-500" />
                <span>Student Life</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                {userProgress.personality}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Set Study Mood:
              </span>
              <div className="flex flex-wrap gap-2">
                {moods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setStudyMood(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      userProgress.studyMood === m.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Meme of the Day */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                {FUN_STUDENT_MEMES[0].title}
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic">
                {FUN_STUDENT_MEMES[0].caption}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Current Mood: {userProgress.studyMood}</span>
            <button
              onClick={() => setActiveTab('battle')}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Challenge Friend →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
