import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_QUESTIONS, CBT_TESTS } from '../../data/curriculumData';
import { Question } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flag,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertTriangle
} from 'lucide-react';

export const TestInterface: React.FC = () => {
  const { examGoal, setActiveTab } = useApp();

  const testConfig = CBT_TESTS[0]; // Active test template
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [testQuestions, setTestQuestions] = useState<Question[]>(() => {
    // Select first 8 questions for demo test
    return ALL_QUESTIONS.slice(0, 8);
  });

  // State: questionId -> selectedOptionId
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // State: questionId -> boolean (marked for review)
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  // State: questionId -> boolean (has visited)
  const [visited, setVisited] = useState<Record<string, boolean>>({ [testQuestions[0]?.id]: true });

  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(testConfig.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const currentQ = testQuestions[activeQuestionIndex];

  const handleSelectQuestion = (idx: number) => {
    setActiveQuestionIndex(idx);
    const qId = testQuestions[idx].id;
    setVisited(prev => ({ ...prev, [qId]: true }));
  };

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleClearResponse = () => {
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleMarkReview = () => {
    setMarkedForReview(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleSaveAndNext = () => {
    if (activeQuestionIndex < testQuestions.length - 1) {
      handleSelectQuestion(activeQuestionIndex + 1);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Score calculation
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  testQuestions.forEach(q => {
    const ans = answers[q.id];
    if (!ans) {
      unattemptedCount++;
    } else if (ans === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const totalScore = correctCount * 4 - incorrectCount * 1; // Standard NTA NEET marking: +4, -1
  const maxScore = testQuestions.length * 4;

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-in fade-in space-y-8">
        {/* Scorecard Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            NTA CBT MOCK RESULT
          </span>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {testConfig.title}
          </h2>

          <div className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white">
            {totalScore} <span className="text-xl font-normal text-slate-400">/ {maxScore}</span>
          </div>

          <p className="text-xs text-slate-500">
            Official NTA Marking Applied: +4 for Correct, -1 for Incorrect.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {correctCount}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Correct (+{correctCount * 4})
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <div className="text-xl font-extrabold text-rose-700 dark:text-rose-300">
                {incorrectCount}
              </div>
              <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                Incorrect (-{incorrectCount})
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
              <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300">
                {unattemptedCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Unattempted
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
              <div className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300">
                {correctCount + incorrectCount > 0
                  ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
                  : 0}
                %
              </div>
              <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Accuracy
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center space-x-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setTimeLeftSeconds(testConfig.durationMinutes * 60);
                setAnswers({});
                setMarkedForReview({});
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
            >
              Re-attempt Test
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
            >
              Review in Mistake Notebook
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-4.5rem)] animate-in fade-in">
      {/* NTA Top Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl mb-4 shrink-0 shadow-md">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block">
            NTA CBT EXAMINATION CONSOLE
          </span>
          <h2 className="text-base font-bold font-display">{testConfig.title}</h2>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-400">Time Left:</span>
          <span className="font-mono text-base font-extrabold text-white">
            {formatTimer(timeLeftSeconds)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to submit the test now?')) {
              setIsSubmitted(true);
            }
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition shadow-xs"
        >
          Submit Test
        </button>
      </div>

      {/* Main Testing View (2 Columns) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left: Active Question Area */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Question {activeQuestionIndex + 1} of {testQuestions.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                +4 Marks · -1 Negative
              </span>
            </div>

            {/* Question Text */}
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line mb-6">
              {currentQ.questionText}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map(opt => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-start space-x-3 transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold text-indigo-950 dark:text-indigo-100 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="mt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Controls Bottom Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 mt-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleMarkReview}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  markedForReview[currentQ.id]
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
                </span>
              </button>

              <button
                onClick={handleClearResponse}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={() => handleSelectQuestion(activeQuestionIndex - 1)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition disabled:opacity-30"
              >
                Previous
              </button>

              <button
                onClick={handleSaveAndNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-xs"
              >
                <span>Save & Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette & Legend */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Question Palette
            </h3>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 mb-6">
              {testQuestions.map((q, idx) => {
                const isCurrent = idx === activeQuestionIndex;
                const isAnswered = !!answers[q.id];
                const isMarked = !!markedForReview[q.id];
                const hasVisited = !!visited[q.id];

                let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'; // Not visited

                if (isAnswered && isMarked) {
                  badgeStyle = 'bg-purple-600 text-white ring-2 ring-emerald-400'; // Answered & marked
                } else if (isMarked) {
                  badgeStyle = 'bg-purple-600 text-white'; // Marked
                } else if (isAnswered) {
                  badgeStyle = 'bg-emerald-600 text-white'; // Answered
                } else if (hasVisited) {
                  badgeStyle = 'bg-rose-500 text-white'; // Not answered
                }

                if (isCurrent) {
                  badgeStyle += ' ring-2 ring-indigo-500 font-extrabold scale-105';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition flex items-center justify-center shadow-2xs ${badgeStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-rose-500"></span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-purple-600"></span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-700"></span>
                <span>Not Visited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
