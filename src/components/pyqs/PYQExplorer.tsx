import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_QUESTIONS, CHAPTERS, SUBJECTS } from '../../data/curriculumData';
import { ExamGoal, SubjectType, DifficultyLevel } from '../../types';
import {
  FileQuestion,
  Filter,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';

export const PYQExplorer: React.FC = () => {
  const { examGoal, setExamGoal, openSmartStudy, recordAnswer, userProgress } = useApp();

  const [selectedExam, setSelectedExam] = useState<string>(examGoal);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const pyqQuestions = ALL_QUESTIONS.filter(q => q.isPYQ);

  const filteredPYQs = pyqQuestions.filter(q => {
    if (selectedExam !== 'all' && q.pyqExam !== selectedExam && !q.examGoals.includes(selectedExam as any)) {
      return false;
    }
    if (selectedYear !== 'all' && q.pyqYear !== selectedYear) return false;
    if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>AUTHENTIC PAST PAPERS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            PYQ Explorer (2020 – 2024)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every previous year question is tagged with its official year, exam, concept, and mapped NCERT source line.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Showing {filteredPYQs.length} verified PYQs
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Exam Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Exam
          </label>
          <select
            value={selectedExam}
            onChange={e => setSelectedExam(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Exams</option>
            <option value="NEET">NEET</option>
            <option value="JEE_MAIN">JEE Main</option>
            <option value="JEE_ADV">JEE Advanced</option>
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            <option value="BIOLOGY">Biology</option>
            <option value="PHYSICS">Physics</option>
            <option value="CHEMISTRY">Chemistry</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* PYQ Cards Grid */}
      <div className="space-y-4">
        {filteredPYQs.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <FileQuestion className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No PYQs match the current filters
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try setting Year or Exam to "All".
            </p>
          </div>
        ) : (
          filteredPYQs.map((q, idx) => {
            const isSolutionRevealed = revealedSolutions[q.id];
            const answerState = userProgress.answeredQuestions[q.id];

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
              >
                {/* PYQ Badges Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-extrabold flex items-center space-x-1 shadow-xs">
                      <span>★</span>
                      <span>{q.pyqExam || 'NEET'} {q.pyqYear}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {q.subjectId} · Class {q.classLevel}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">
                      Concept: {q.concept}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      q.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : q.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                {/* Question Body */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {q.questionText}
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map(opt => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                        isSolutionRevealed && opt.id === q.correctAnswer
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-900 dark:text-emerald-100'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold shrink-0">({opt.id})</span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                  >
                    {isSolutionRevealed ? 'Hide Solution' : 'View Verified Solution'}
                  </button>

                  {/* Open in Smart Study */}
                  <button
                    onClick={() => openSmartStudy(q.subjectId, q.chapterId, q.pageNumber)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in NCERT Reader (Page {q.pageNumber}) →</span>
                  </button>
                </div>

                {/* Solution Box */}
                {isSolutionRevealed && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-2 animate-in fade-in">
                    <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Official Answer: Option ({q.correctAnswer})</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                    <div className="text-[11px] text-slate-500">
                      📖 NCERT Citation: {q.sourceReference}
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
