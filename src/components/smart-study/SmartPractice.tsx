import React, { useState, useEffect } from 'react';
import {
  Question,
  ExamGoal,
  MistakeCategory,
  DifficultyLevel,
  QuestionCategory,
  getQuestionCategory,
} from '../../types';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Zap,
  Filter,
  Check,
  ChevronRight,
  ChevronLeft,
  Quote,
  RotateCcw,
  Brain,
  Calculator,
  ImageIcon,
} from 'lucide-react';
import { QuestionFilterBar, QuestionFilters } from './QuestionFilterBar';

interface SmartPracticeProps {
  questions: Question[];
  currentPageNumber: number;
  chapterTitle: string;
  onJumpToSource: (anchorId?: string) => void;
  onNextPage: () => void;
  hasNextPage: boolean;
  onPrevPage?: () => void;
  hasPrevPage?: boolean;
}

export const SmartPractice: React.FC<SmartPracticeProps> = ({
  questions,
  currentPageNumber,
  chapterTitle,
  onJumpToSource,
  onNextPage,
  hasNextPage,
  onPrevPage,
  hasPrevPage,
}) => {
  const {
    examGoal,
    setExamGoal,
    userProgress,
    recordAnswer,
    toggleBookmark,
    addMistake,
    setIsAiModalOpen,
    setAiInitialPrompt,
  } = useApp();

  const [filters, setFilters] = useState<QuestionFilters>({
    status: 'all',
    difficulty: 'all',
    category: 'all',
  });
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [taggedMistakes, setTaggedMistakes] = useState<Record<string, MistakeCategory>>({});
  const [justAnsweredId, setJustAnsweredId] = useState<string | null>(null);

  // Filter questions by status, difficulty level, and question category
  const filteredQuestions = questions.filter(q => {
    // Status filter
    if (filters.status === 'unsolved') {
      const isAnswered = !!userProgress.answeredQuestions[q.id];
      if (isAnswered) return false;
    } else if (filters.status === 'pyq') {
      if (!q.isPYQ) return false;
    } else if (filters.status === 'ncert') {
      if (!q.tags.some(t => t.toLowerCase().includes('ncert'))) return false;
    }

    // Difficulty level filter (Easy, Medium, Hard)
    if (filters.difficulty !== 'all' && q.difficulty !== filters.difficulty) {
      return false;
    }

    // Question type / category filter (Concept-based, Numerical, Diagram-based)
    if (filters.category !== 'all') {
      const cat = getQuestionCategory(q);
      if (cat !== filters.category) return false;
    }

    return true;
  });

  const handleFilterChange = (newFilters: Partial<QuestionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      difficulty: 'all',
      category: 'all',
    });
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (userProgress.answeredQuestions[questionId]) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitAnswer = (questionId: string) => {
    const selected = selectedAnswers[questionId];
    if (!selected) return;
    recordAnswer(questionId, selected);
    setJustAnsweredId(questionId);
    setTimeout(() => setJustAnsweredId(null), 3000);
  };

  const handleSaveMistakeCategory = (questionId: string, category: MistakeCategory) => {
    const selected = selectedAnswers[questionId] || userProgress.answeredQuestions[questionId]?.selected;
    if (selected) {
      addMistake(questionId, selected, category);
      setTaggedMistakes(prev => ({ ...prev, [questionId]: category }));
    }
  };

  const scrollToQuestion = (questionId: string) => {
    const el = document.getElementById(`practice-q-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Calculate page question progress
  const answeredCount = questions.filter(q => !!userProgress.answeredQuestions[q.id]).length;
  const correctCount = questions.filter(q => userProgress.answeredQuestions[q.id]?.isCorrect).length;
  const isPageComplete = questions.length > 0 && answeredCount === questions.length;

  return (
    <div className="flex flex-col h-full bg-slate-50/80 dark:bg-slate-950/80 overflow-y-auto">
      {/* Practice Header Bar */}
      <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-display">
              Page {currentPageNumber} Mapped Practice
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              ({answeredCount}/{questions.length} solved · {correctCount} correct)
            </span>
          </div>

          {/* Exam Target Selector Pill */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">Exam:</span>
            <select
              value={examGoal}
              onChange={e => setExamGoal(e.target.value as ExamGoal)}
              className="text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
              aria-label="Exam Target"
            >
              <option value="NEET">🎯 NEET Focus</option>
              <option value="JEE_MAIN">⚡ JEE Main</option>
              <option value="JEE_ADV">🔥 JEE Advanced</option>
              <option value="BOARDS">📚 CBSE Boards</option>
            </select>
          </div>
        </div>

        {/* Question Numbers Quick Strip */}
        {questions.length > 0 && (
          <div className="flex items-center space-x-1.5 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Jump:
            </span>
            {questions.map((q, idx) => {
              const state = userProgress.answeredQuestions[q.id];
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToQuestion(q.id)}
                  className={`w-6 h-6 rounded-lg text-[11px] font-extrabold flex items-center justify-center transition shrink-0 ${
                    state
                      ? state.isCorrect
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : 'bg-rose-500 text-white shadow-2xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950'
                  }`}
                  title={`Question ${idx + 1} (${state ? (state.isCorrect ? 'Correct' : 'Incorrect') : 'Unattempted'})`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        )}

        {/* Dedicated Question Filter Component (Difficulty & Question Type) */}
        <QuestionFilterBar
          questions={questions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredQuestions.length}
        />
      </div>

      {/* Questions Scrollable Body */}
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No questions match your current filters
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Current filters:{' '}
              {filters.difficulty !== 'all' && (
                <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1.5">
                  Difficulty: {filters.difficulty}
                </span>
              )}
              {filters.category !== 'all' && (
                <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1.5">
                  Type: {filters.category}
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Status: {filters.status}
                </span>
              )}
              {filters.difficulty === 'all' &&
                filters.category === 'all' &&
                filters.status === 'all' &&
                'None'}
            </p>
            <button
              id="btn-empty-reset-filters"
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, qIndex) => {
            const answerState = userProgress.answeredQuestions[q.id];
            const hasAnswered = !!answerState;
            const isCorrect = answerState?.isCorrect;
            const currentSelected = answerState ? answerState.selected : selectedAnswers[q.id];
            const isBookmarked = userProgress.bookmarks.includes(q.id);
            const savedCategory = taggedMistakes[q.id];
            const category = getQuestionCategory(q);

            return (
              <div
                key={q.id}
                id={`practice-q-${q.id}`}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border transition-all shadow-2xs ${
                  hasAnswered
                    ? isCorrect
                      ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20'
                      : 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Question Header & Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                      Q{qIndex + 1}
                    </span>

                    {/* Question Category Badge (Concept, Numerical, Diagram) */}
                    {category === 'concept' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200/50 dark:border-indigo-800/50 flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>Concept-based</span>
                      </span>
                    )}
                    {category === 'numerical' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200/50 dark:border-blue-800/50 flex items-center space-x-1">
                        <Calculator className="w-3 h-3" />
                        <span>Numerical</span>
                      </span>
                    )}
                    {category === 'diagram' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-md border border-purple-200/50 dark:border-purple-800/50 flex items-center space-x-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>Diagram-based</span>
                      </span>
                    )}

                    {/* Question Type */}
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                      {q.questionType.replace(/_/g, ' ').toUpperCase()}
                    </span>

                    {/* PYQ Badge */}
                    {q.isPYQ && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 rounded-md border border-amber-300/60 dark:border-amber-700/60 flex items-center space-x-1">
                        <span>★</span>
                        <span>{q.pyqExam || 'NEET'} {q.pyqYear} PYQ</span>
                      </span>
                    )}

                    {/* Difficulty Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center space-x-1 ${
                        q.difficulty === 'Easy'
                          ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50'
                          : q.difficulty === 'Medium'
                          ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/50'
                          : 'text-rose-700 bg-rose-50 dark:bg-rose-950/50'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span>{q.difficulty}</span>
                    </span>

                    {/* XP Gain Flash */}
                    {justAnsweredId === q.id && isCorrect && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-md flex items-center space-x-0.5 animate-bounce">
                        <Zap className="w-3 h-3" />
                        <span>+15 XP Earned</span>
                      </span>
                    )}
                  </div>

                  {/* Bookmark Question */}
                  <button
                    type="button"
                    onClick={() => toggleBookmark(q.id)}
                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={isBookmarked ? 'Bookmarked' : 'Bookmark Question'}
                    aria-label="Bookmark Question"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Question Statement */}
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line mb-3">
                  {q.questionText}
                </p>

                {/* Diagram Rendering (if present) */}
                {q.diagramSvg && (
                  <div className="my-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      <span className="flex items-center space-x-1.5 text-purple-700 dark:text-purple-400 font-bold">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>NCERT Diagram / Visual Reference</span>
                      </span>
                      <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-md">
                        Figure Based
                      </span>
                    </div>
                    <div
                      className="w-full flex items-center justify-center [&>svg]:max-h-56 [&>svg]:w-full [&>svg]:h-auto [&>svg]:mx-auto"
                      dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                    />
                  </div>
                )}
                {q.diagramUrl && !q.diagramSvg && (
                  <div className="my-3.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={q.diagramUrl}
                      alt={`Question ${qIndex + 1} Diagram`}
                      className="w-full h-auto max-h-56 object-contain bg-slate-50 dark:bg-slate-800 p-2"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Options Grid */}
                <div className="space-y-2">
                  {q.options.map(opt => {
                    const isSelected = currentSelected === opt.id;
                    let optionStyle =
                      'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';

                    if (hasAnswered) {
                      if (opt.id === q.correctAnswer) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs';
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 line-through';
                      } else {
                        optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 font-semibold shadow-2xs';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`w-full text-left p-3 min-h-[46px] rounded-xl border text-xs sm:text-sm flex items-start space-x-3 transition ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="flex-1 mt-0.5 leading-relaxed">{opt.text}</span>
                        {hasAnswered && opt.id === q.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Check Answer Action Button */}
                {!hasAnswered && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {selectedAnswers[q.id] ? 'Option selected. Click to verify:' : 'Select an option to check'}
                    </span>
                    <button
                      type="button"
                      disabled={!selectedAnswers[q.id]}
                      onClick={() => handleSubmitAnswer(q.id)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Check Answer
                    </button>
                  </div>
                )}

                {/* Post-Answer Result & Detailed NCERT Explanation */}
                {hasAnswered && (
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
                    {/* Status & Show in Source Button */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct! Concept Mastered.</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-extrabold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect. Correct: ({q.correctAnswer})</span>
                          </span>
                        )}
                      </div>

                      {/* Signature NEXT SOCH Feature: Show in Source */}
                      <button
                        type="button"
                        onClick={() => onJumpToSource(q.sourceAnchorId)}
                        className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-800/80 transition shadow-2xs"
                        title="Scroll Reader to the exact NCERT line"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Show in Source 📖</span>
                      </button>
                    </div>

                    {/* Detailed NCERT Explanation Box */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>NCERT Explanation:</span>
                      </div>
                      <p className="leading-relaxed">{q.explanation}</p>

                      {/* Quoted Snippet from textbook */}
                      {q.sourceSnippet && (
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                          <Quote className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] italic text-slate-600 dark:text-slate-400 leading-relaxed">
                            "{q.sourceSnippet}"
                          </p>
                        </div>
                      )}

                      {/* Exact Source Citation Reference */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex items-start space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                          Citation:
                        </span>
                        <span className="font-mono">{q.sourceReference}</span>
                      </div>
                    </div>

                    {/* Mistake Categorization Bar for Mistakes Notebook */}
                    {!isCorrect && (
                      <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span>
                              {savedCategory
                                ? `Saved to Mistake Notebook as "${savedCategory}" ✓`
                                : 'Tag mistake to review in Notebook:'}
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(
                            [
                              { id: 'concept', label: 'Concept Gap' },
                              { id: 'fact', label: 'NCERT Fact' },
                              { id: 'confusion', label: 'Option Confusion' },
                              { id: 'careless', label: 'Careless Reading' },
                              { id: 'guessed', label: 'Guessed' },
                            ] as const
                          ).map(cat => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleSaveMistakeCategory(q.id, cat.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                                savedCategory === cat.id
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                  : 'bg-white dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800/80'
                              }`}
                            >
                              {savedCategory === cat.id ? '✓ ' : '+ '}
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ask AI Tutor */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAiInitialPrompt(`I am practicing for ${examGoal}. For this question from Chapter "${chapterTitle}" (Page ${currentPageNumber}):\n"${q.questionText}"\nCan you explain why Option (${q.correctAnswer}) is the correct answer and how to avoid confusion in NEET/JEE?`);
                          setIsAiModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Ask AI Tutor for deeper breakdown</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Page Cleared Celebration Banner */}
        {isPageComplete && hasNextPage && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold font-display flex items-center space-x-2">
                <span>Page {currentPageNumber} Cleared!</span>
                <span>🎉</span>
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                All questions on this page are solved. Advance to the next NCERT textbook page:
              </p>
            </div>
            <button
              type="button"
              onClick={onNextPage}
              className="px-5 py-2.5 bg-white text-emerald-800 rounded-xl text-xs font-extrabold shadow-sm hover:bg-emerald-50 transition flex items-center justify-center space-x-1.5 shrink-0"
            >
              <span>Next Page →</span>
            </button>
          </div>
        )}

        {/* Navigation Footer for flipping pages from practice view */}
        <div className="flex items-center justify-between pt-4 pb-8 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            disabled={currentPageNumber <= 1}
            onClick={onPrevPage}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition flex items-center space-x-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Page</span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            Page {currentPageNumber} Questions
          </span>

          <button
            type="button"
            disabled={!hasNextPage}
            onClick={onNextPage}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition flex items-center space-x-1"
          >
            <span>Next Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
