import React from 'react';
import { DifficultyLevel, QuestionCategory, Question, getQuestionCategory } from '../../types';
import {
  Sparkles,
  Calculator,
  ImageIcon,
  Brain,
  X,
  Layers,
  Gauge,
  HelpCircle
} from 'lucide-react';

export interface QuestionFilters {
  status: 'all' | 'unsolved' | 'ncert' | 'pyq';
  difficulty: 'all' | DifficultyLevel;
  category: 'all' | QuestionCategory;
}

interface QuestionFilterBarProps {
  questions: Question[];
  filters: QuestionFilters;
  onFilterChange: (newFilters: Partial<QuestionFilters>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const QuestionFilterBar: React.FC<QuestionFilterBarProps> = ({
  questions,
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  // Count by difficulty for current page
  const countsByDifficulty: Record<'all' | DifficultyLevel, number> = {
    all: questions.length,
    Easy: questions.filter(q => q.difficulty === 'Easy').length,
    Medium: questions.filter(q => q.difficulty === 'Medium').length,
    Hard: questions.filter(q => q.difficulty === 'Hard').length,
    'Very Hard': questions.filter(q => q.difficulty === 'Very Hard').length,
  };

  // Count by question category (type) for current page
  const countsByCategory: Record<'all' | QuestionCategory, number> = {
    all: questions.length,
    concept: questions.filter(q => getQuestionCategory(q) === 'concept').length,
    numerical: questions.filter(q => getQuestionCategory(q) === 'numerical').length,
    diagram: questions.filter(q => getQuestionCategory(q) === 'diagram').length,
    application: questions.filter(q => getQuestionCategory(q) === 'application').length,
  };

  const isAnyFilterActive =
    filters.difficulty !== 'all' ||
    filters.category !== 'all' ||
    filters.status !== 'all';

  return (
    <div id="smart-study-filter-bar" className="space-y-2.5 pt-1 pb-2">
      {/* Primary Row: Difficulty & Question Type Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Difficulty Level Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-0.5 shrink-0">
            <Gauge className="w-3.5 h-3.5 text-indigo-500" />
            <span>Difficulty:</span>
          </div>

          {/* All Difficulties */}
          <button
            id="filter-difficulty-all"
            type="button"
            onClick={() => onFilterChange({ difficulty: 'all' })}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1 shrink-0 ${
              filters.difficulty === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>All</span>
            <span className="text-[10px] opacity-75">({countsByDifficulty.all})</span>
          </button>

          {/* Easy */}
          <button
            id="filter-difficulty-easy"
            type="button"
            onClick={() =>
              onFilterChange({
                difficulty: filters.difficulty === 'Easy' ? 'all' : 'Easy',
              })
            }
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1 shrink-0 ${
              filters.difficulty === 'Easy'
                ? 'bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-300 dark:ring-emerald-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Easy</span>
            <span className="text-[10px] opacity-80">({countsByDifficulty.Easy})</span>
          </button>

          {/* Medium */}
          <button
            id="filter-difficulty-medium"
            type="button"
            onClick={() =>
              onFilterChange({
                difficulty: filters.difficulty === 'Medium' ? 'all' : 'Medium',
              })
            }
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1 shrink-0 ${
              filters.difficulty === 'Medium'
                ? 'bg-amber-600 text-white shadow-2xs ring-2 ring-amber-300 dark:ring-amber-700'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Medium</span>
            <span className="text-[10px] opacity-80">({countsByDifficulty.Medium})</span>
          </button>

          {/* Hard */}
          <button
            id="filter-difficulty-hard"
            type="button"
            onClick={() =>
              onFilterChange({
                difficulty: filters.difficulty === 'Hard' ? 'all' : 'Hard',
              })
            }
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1 shrink-0 ${
              filters.difficulty === 'Hard'
                ? 'bg-rose-600 text-white shadow-2xs ring-2 ring-rose-300 dark:ring-rose-700'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 hover:bg-rose-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Hard</span>
            <span className="text-[10px] opacity-80">({countsByDifficulty.Hard})</span>
          </button>
        </div>

        {/* Clear Filters Button (when active) */}
        {isAnyFilterActive && (
          <button
            id="btn-reset-filters"
            type="button"
            onClick={onResetFilters}
            className="flex items-center space-x-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0 self-end sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Secondary Row: Question Type (Category) Filter */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-0.5 shrink-0">
          <Layers className="w-3.5 h-3.5 text-purple-500" />
          <span>Type:</span>
        </div>

        {/* All Types */}
        <button
          id="filter-type-all"
          type="button"
          onClick={() => onFilterChange({ category: 'all' })}
          className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1 shrink-0 ${
            filters.category === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
              : 'bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <HelpCircle className="w-3 h-3" />
          <span>All Types</span>
          <span className="text-[10px] opacity-75">({countsByCategory.all})</span>
        </button>

        {/* Concept-based */}
        <button
          id="filter-type-concept"
          type="button"
          onClick={() =>
            onFilterChange({
              category: filters.category === 'concept' ? 'all' : 'concept',
            })
          }
          className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1.5 shrink-0 ${
            filters.category === 'concept'
              ? 'bg-indigo-600 text-white shadow-2xs ring-2 ring-indigo-300 dark:ring-indigo-700'
              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 hover:bg-indigo-100'
          }`}
        >
          <Brain className="w-3 h-3" />
          <span>Concept-based</span>
          <span className="text-[10px] opacity-80">({countsByCategory.concept})</span>
        </button>

        {/* Numerical */}
        <button
          id="filter-type-numerical"
          type="button"
          onClick={() =>
            onFilterChange({
              category: filters.category === 'numerical' ? 'all' : 'numerical',
            })
          }
          className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1.5 shrink-0 ${
            filters.category === 'numerical'
              ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-300 dark:ring-blue-700'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 hover:bg-blue-100'
          }`}
        >
          <Calculator className="w-3 h-3" />
          <span>Numerical</span>
          <span className="text-[10px] opacity-80">({countsByCategory.numerical})</span>
        </button>

        {/* Diagram-based */}
        <button
          id="filter-type-diagram"
          type="button"
          onClick={() =>
            onFilterChange({
              category: filters.category === 'diagram' ? 'all' : 'diagram',
            })
          }
          className={`px-2.5 py-1 text-xs rounded-lg font-bold transition flex items-center space-x-1.5 shrink-0 ${
            filters.category === 'diagram'
              ? 'bg-purple-600 text-white shadow-2xs ring-2 ring-purple-300 dark:ring-purple-700'
              : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-100'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          <span>Diagram-based</span>
          <span className="text-[10px] opacity-80">({countsByCategory.diagram})</span>
        </button>
      </div>

      {/* Tertiary Row: Quick Target Tabs (Unsolved, PYQs, NCERT) + Result Counter */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/70 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            id="filter-status-all"
            type="button"
            onClick={() => onFilterChange({ status: 'all' })}
            className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition shrink-0 ${
              filters.status === 'all'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All Questions
          </button>
          <button
            id="filter-status-unsolved"
            type="button"
            onClick={() =>
              onFilterChange({
                status: filters.status === 'unsolved' ? 'all' : 'unsolved',
              })
            }
            className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition shrink-0 ${
              filters.status === 'unsolved'
                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Unsolved Only
          </button>
          <button
            id="filter-status-pyq"
            type="button"
            onClick={() =>
              onFilterChange({
                status: filters.status === 'pyq' ? 'all' : 'pyq',
              })
            }
            className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition shrink-0 ${
              filters.status === 'pyq'
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            ★ PYQs Only
          </button>
          <button
            id="filter-status-ncert"
            type="button"
            onClick={() =>
              onFilterChange({
                status: filters.status === 'ncert' ? 'all' : 'ncert',
              })
            }
            className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition shrink-0 ${
              filters.status === 'ncert'
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            NCERT Lines
          </button>
        </div>

        {/* Counter */}
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{totalFilteredCount}</span> of {questions.length}
        </div>
      </div>
    </div>
  );
};
