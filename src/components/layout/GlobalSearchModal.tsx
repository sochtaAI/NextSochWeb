import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS, ALL_QUESTIONS, SUBJECTS } from '../../data/curriculumData';
import { Search, X, BookOpen, FileQuestion, ArrowRight, Sparkles, Layers } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    openSmartStudy,
    setActiveTab,
    setActiveSubjectId,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'chapters' | 'concepts' | 'questions'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.trim().toLowerCase();

  // Matched Chapters
  const matchedChapters = CHAPTERS.filter(ch => {
    if (!q) return true;
    return (
      ch.title.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q) ||
      ch.subjectId.toLowerCase().includes(q) ||
      ch.concepts.some(c => c.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  // Matched Questions
  const matchedQuestions = ALL_QUESTIONS.filter(quest => {
    if (!q) return false;
    return (
      quest.questionText.toLowerCase().includes(q) ||
      quest.concept.toLowerCase().includes(q) ||
      quest.explanation.toLowerCase().includes(q)
    );
  }).slice(0, 4);

  const handleSelectChapter = (subjectId: any, chapterId: string, pageNum: number = 1) => {
    openSmartStudy(subjectId, chapterId, pageNum);
    setIsSearchModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search NCERT Curriculum and Questions"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="searchbox"
            placeholder="Search NCERT chapters, topics, cell organelles, reactions... (Ctrl+K)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-md bg-slate-100 dark:bg-slate-800"
          >
            Esc
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex items-center space-x-1.5 px-4 py-2 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Filter:</span>
          {(['all', 'chapters', 'questions'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-0.5 rounded-full capitalize font-medium text-[11px] transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Recent / Suggested Quick Links when no query */}
          {!q && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                High-Yield NCERT Chapters
              </div>
              <div className="space-y-1.5">
                {CHAPTERS.map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChapter(ch.subjectId, ch.id, 1)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition flex items-center justify-between group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/60"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {ch.subjectId[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {ch.subjectId} · Class {ch.classLevel} · {ch.totalPages} Pages
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chapters Results */}
          {q && (activeCategory === 'all' || activeCategory === 'chapters') && matchedChapters.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>NCERT Chapters ({matchedChapters.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedChapters.map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChapter(ch.subjectId, ch.id, 1)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-800 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {ch.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {ch.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ch.concepts.slice(0, 3).map((concept, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-[9px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-3 flex items-center space-x-1">
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question Matches */}
          {q && (activeCategory === 'all' || activeCategory === 'questions') && matchedQuestions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center space-x-1.5">
                <FileQuestion className="w-3.5 h-3.5 text-emerald-500" />
                <span>Practice Questions ({matchedQuestions.length})</span>
              </div>
              <div className="space-y-2">
                {matchedQuestions.map(quest => (
                  <button
                    key={quest.id}
                    type="button"
                    onClick={() => handleSelectChapter(quest.subjectId, quest.chapterId, quest.pageNumber)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-slate-700/60 transition group"
                  >
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                      <span className="text-indigo-600 dark:text-indigo-400">{quest.concept}</span>
                      <span>•</span>
                      <span>Page {quest.pageNumber}</span>
                      {quest.isPYQ && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                          PYQ
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                      {quest.questionText}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty Search Result */}
          {q && matchedChapters.length === 0 && matchedQuestions.length === 0 && (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No results found for "{query}"
              </div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Try searching for broader keywords like "cell", "bonding", "biology", or check your spelling.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveTab('collections');
                  setIsSearchModalOpen(false);
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Browse All Collections
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search tips: Type topic name or PYQ year</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
