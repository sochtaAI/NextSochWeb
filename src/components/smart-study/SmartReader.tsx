import React, { useState, useRef, useEffect } from 'react';
import { PageData, Chapter, ConceptDetail } from '../../types';
import { useApp } from '../../context/AppContext';
import { DETAILED_CONCEPTS } from '../../data/academicContentData';
import { ConceptDeepDiveModal } from '../academic/ConceptDeepDiveModal';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bookmark,
  BookmarkCheck,
  FileText,
  Highlighter,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2,
  Type,
  X,
  BookOpen,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface SmartReaderProps {
  chapter: Chapter;
  currentPage: PageData;
  onPageChange: (pageNumber: number) => void;
  targetAnchorId?: string | null;
}

export const SmartReader: React.FC<SmartReaderProps> = ({
  chapter,
  currentPage,
  onPageChange,
  targetAnchorId,
}) => {
  const {
    userProgress,
    toggleBookmark,
    addPageNote,
    addPageHighlight,
    completePage,
    setIsAiModalOpen,
    setAiInitialPrompt,
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fontMode, setFontMode] = useState<'sans' | 'serif'>('sans');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionCoords, setSelectionCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<ConceptDetail | null>(null);
  const [isConceptModalOpen, setIsConceptModalOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const readerScrollRef = useRef<HTMLDivElement>(null);

  const pageKey = `${chapter.id}_${currentPage.pageNumber}`;
  const isBookmarked = userProgress.bookmarks.includes(`page-${pageKey}`);
  const currentNotes = userProgress.pageNotes[pageKey] || [];
  const currentHighlights = userProgress.pageHighlights[pageKey] || [];
  const isPageCompleted = (userProgress.completedPages[chapter.id] || []).includes(currentPage.pageNumber);

  // Scroll to target anchor when clicked from SmartPractice
  useEffect(() => {
    if (targetAnchorId) {
      const el = document.getElementById(targetAnchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('source-highlight-flash');
        // Trigger reflow to restart animation
        void el.offsetWidth;
        el.classList.add('source-highlight-flash');
      }
    } else {
      // Scroll to top on page change if not jumping
      if (readerScrollRef.current) {
        readerScrollRef.current.scrollTop = 0;
      }
    }
  }, [targetAnchorId, currentPage.pageNumber]);

  // Handle text selection
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      const text = selection.toString().trim();
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(text);
        setSelectionCoords({
          x: Math.max(rect.left + rect.width / 2, 80),
          y: Math.max(rect.top - 12, 50),
        });
      } catch (err) {
        // Fallback for selection range errors
      }
    } else {
      setSelectedText('');
      setSelectionCoords(null);
    }
  };

  const handleApplyHighlight = () => {
    if (selectedText) {
      addPageHighlight(chapter.id, currentPage.pageNumber, selectedText);
      setSelectedText('');
      setSelectionCoords(null);
    }
  };

  const handleAddNoteFromSelection = () => {
    if (selectedText) {
      addPageNote(chapter.id, currentPage.pageNumber, `Highlight: "${selectedText}"`);
      setSelectedText('');
      setSelectionCoords(null);
      setShowNotesDrawer(true);
    }
  };

  const handleAskAiFromSelection = () => {
    if (selectedText) {
      setAiInitialPrompt(`Explain this NCERT excerpt from Chapter "${chapter.title}" (Page ${currentPage.pageNumber}):\n"${selectedText}"\nWhat type of questions can NEET/JEE ask from this?`);
      setIsAiModalOpen(true);
      setSelectedText('');
      setSelectionCoords(null);
    }
  };

  // Helper to render paragraph with both search matches and user-saved highlights
  const renderFormattedParagraph = (paragraph: string) => {
    const termsToHighlight = [
      ...(searchTerm.trim() ? [{ text: searchTerm.trim(), isSearch: true }] : []),
      ...currentHighlights.map(h => ({ text: h, isSearch: false })),
    ].filter(t => t.text.length > 2);

    if (termsToHighlight.length === 0) {
      return paragraph;
    }

    // Escape regex characters
    const escapedTerms = termsToHighlight.map(t =>
      t.text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    );

    try {
      const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
      const parts = paragraph.split(regex);

      return parts.map((part, idx) => {
        const matchedTerm = termsToHighlight.find(
          t => t.text.toLowerCase() === part.toLowerCase()
        );

        if (matchedTerm) {
          return (
            <mark
              key={idx}
              className={`px-1 py-0.5 rounded-sm font-medium ${
                matchedTerm.isSearch
                  ? 'bg-amber-300 dark:bg-amber-800 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400'
                  : 'bg-yellow-200/90 dark:bg-yellow-900/60 text-slate-900 dark:text-yellow-100 border-b-2 border-yellow-400'
              }`}
            >
              {part}
            </mark>
          );
        }
        return part;
      });
    } catch {
      return paragraph;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative select-text"
    >
      {/* Reader Control Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800/60 tracking-wider">
            NCERT SOURCE
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px] sm:max-w-[220px]">
            {chapter.title}
          </span>
        </div>

        {/* Reader Toolbar Controls */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          {/* In-page search toggle */}
          {showSearchInput ? (
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-300 dark:border-slate-700">
              <input
                type="text"
                placeholder="Find in page..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
                className="w-24 sm:w-32 text-xs bg-transparent focus:outline-none text-slate-800 dark:text-slate-200"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowSearchInput(false);
                  setSearchTerm('');
                }}
                className="text-slate-400 hover:text-slate-600 text-[10px] ml-1"
              >
                Close
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearchInput(true)}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
              title="Search keywords in this NCERT page"
              aria-label="Search page"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Font Serif / Sans toggle */}
          <button
            type="button"
            onClick={() => setFontMode(fontMode === 'sans' ? 'serif' : 'sans')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
              fontMode === 'serif'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Toggle between Modern Sans and Paper Book Serif font"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{fontMode === 'serif' ? 'Serif' : 'Sans'}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(85, prev - 10))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition"
              title="Decrease font size"
              aria-label="Decrease text size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 font-semibold">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition"
              title="Increase font size"
              aria-label="Increase text size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Notes Drawer Button */}
          <button
            type="button"
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`p-1.5 rounded-lg transition relative ${
              showNotesDrawer
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="View or add NCERT page notes"
            aria-label="Toggle page notes"
          >
            <FileText className="w-3.5 h-3.5" />
            {currentNotes.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {currentNotes.length}
              </span>
            )}
          </button>

          {/* Bookmark Page */}
          <button
            type="button"
            onClick={() => toggleBookmark(`page-${pageKey}`)}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
            title={isBookmarked ? 'Page bookmarked' : 'Bookmark this NCERT page'}
            aria-label="Bookmark page"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Ask AI about full page */}
          <button
            type="button"
            onClick={() => {
              setAiInitialPrompt(`I am studying NCERT Chapter "${chapter.title}", Page ${currentPage.pageNumber} ("${currentPage.title}").\nPlease give me a 3-point high-yield concept summary, potential NEET/JEE traps, and key formulas or definitions from this page.`);
              setIsAiModalOpen(true);
            }}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shrink-0"
            title="Ask AI Tutor to break down this page"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Main Textbook Scroll Canvas */}
      <div
        ref={readerScrollRef}
        className={`flex-1 overflow-y-auto px-5 sm:px-10 lg:px-12 py-8 transition-all ${
          fontMode === 'serif' ? 'font-serif' : 'font-sans'
        }`}
        style={{ fontSize: `${(zoomLevel / 100) * 1.02}rem` }}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* NCERT Header Block */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span>NCERT Class {chapter.classLevel} · {chapter.subjectId}</span>
              <span>Page {currentPage.pageNumber} of {chapter.totalPages}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
              {currentPage.title}
            </h2>

            {/* Concept badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {currentPage.topics.map(topic => (
                <span
                  key={topic}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Textbook Sections */}
          <div className="space-y-8">
            {currentPage.sections.map(sec => {
              const matchingConcept = Object.values(DETAILED_CONCEPTS).find(
                c =>
                  c.chapterId === chapter.id &&
                  (c.pageNumber === currentPage.pageNumber ||
                    sec.title.toLowerCase().includes(c.name.toLowerCase()) ||
                    c.name.toLowerCase().includes(sec.title.toLowerCase()))
              );

              return (
                <section key={sec.id} id={sec.id} className="transition-all rounded-lg p-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-l-3 border-indigo-600 dark:border-indigo-400 pl-3">
                      {sec.title}
                    </h3>

                    {matchingConcept && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedConcept(matchingConcept);
                          setIsConceptModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition shadow-2xs font-sans"
                        title="View complete 6 core explanation pillars (What, Why, How, Where, Exam Angle, Confusion Alert)"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>6 Pillars Deep Dive</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {sec.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-justify leading-[1.75]">
                      {renderFormattedParagraph(p)}
                    </p>
                  ))}
                </div>

                {/* Key Terms Pill Grid */}
                {sec.keyTerms && sec.keyTerms.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 font-sans">
                      Key Terminology & Memory Hooks
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sec.keyTerms.map(term => (
                        <span
                          key={term}
                          className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 shadow-2xs font-sans"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* NCERT High Yield Callout Box */}
                {sec.ncertHighlight && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border-l-4 border-amber-500 dark:border-amber-400 text-amber-950 dark:text-amber-100 font-sans">
                    <div className="flex items-center space-x-1.5 mb-1 text-amber-800 dark:text-amber-300 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>NCERT High-Yield Line (Direct NEET/JEE Trap)</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed italic">
                      "{sec.ncertHighlight}"
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

          {/* Page Summary Checklist */}
          {currentPage.summaryPoints && currentPage.summaryPoints.length > 0 && (
            <div className="mt-10 p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 font-sans">
              <h4 className="text-sm font-extrabold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider mb-3">
                🎯 Core Takeaways Before Practicing
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-indigo-900 dark:text-indigo-300">
                {currentPage.summaryPoints.map((pt, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Page Mastery Action */}
          <div className="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 font-sans">
            <button
              type="button"
              onClick={() => completePage(chapter.id, currentPage.pageNumber)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                isPageCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isPageCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isPageCompleted ? 'Page Marked as Mastered ✓' : 'Mark Page as Mastered (+20 XP)'}</span>
            </button>

            <span className="text-[11px] text-slate-400">
              Tip: Select any sentence to highlight, note, or ask AI.
            </span>
          </div>
        </div>
      </div>

      {/* Floating Selection Tooltip */}
      {selectedText && selectionCoords && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2 py-1.5 rounded-xl shadow-xl flex items-center space-x-1 text-xs animate-in fade-in zoom-in-95 font-sans"
          style={{ left: `${selectionCoords.x}px`, top: `${selectionCoords.y}px` }}
        >
          <button
            type="button"
            onClick={handleApplyHighlight}
            className="flex items-center space-x-1 px-2 py-1 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-md transition"
            title="Highlight in page"
          >
            <Highlighter className="w-3 h-3 text-yellow-400 dark:text-yellow-600" />
            <span>Highlight</span>
          </button>
          <button
            type="button"
            onClick={handleAddNoteFromSelection}
            className="flex items-center space-x-1 px-2 py-1 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-md transition"
            title="Add Note"
          >
            <FileText className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
            <span>Note</span>
          </button>
          <button
            type="button"
            onClick={handleAskAiFromSelection}
            className="flex items-center space-x-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition"
            title="Ask AI about this excerpt"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ask AI</span>
          </button>
        </div>
      )}

      {/* Page Notes Slide-over Drawer */}
      {showNotesDrawer && (
        <div className="absolute right-0 top-11 bottom-14 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-30 flex flex-col p-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Page {currentPage.pageNumber} Notes</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowNotesDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2">
            {currentNotes.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No personal notes on this page yet.
                <br />
                Select text or write below to save a quick note.
              </div>
            ) : (
              currentNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200"
                >
                  {note}
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <textarea
              rows={2}
              placeholder="Add a quick NCERT note..."
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => {
                if (newNoteText.trim()) {
                  addPageNote(chapter.id, currentPage.pageNumber, newNoteText.trim());
                  setNewNoteText('');
                }
              }}
              className="w-full mt-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Page Navigation Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 font-sans z-20">
        <button
          id="reader-prev-page-btn"
          type="button"
          disabled={currentPage.pageNumber <= 1}
          onClick={() => onPageChange(currentPage.pageNumber - 1)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev Page</span>
        </button>

        {/* Page selector dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={currentPage.pageNumber}
            onChange={e => onPageChange(Number(e.target.value))}
            className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
            aria-label="Select NCERT Page"
          >
            {chapter.pages.map(p => (
              <option key={p.pageNumber} value={p.pageNumber}>
                Page {p.pageNumber} of {chapter.totalPages} : {p.title}
              </option>
            ))}
          </select>
        </div>

        <button
          id="reader-next-page-btn"
          type="button"
          disabled={currentPage.pageNumber >= chapter.totalPages}
          onClick={() => onPageChange(currentPage.pageNumber + 1)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Concept Deep Dive Modal */}
      <ConceptDeepDiveModal
        concept={selectedConcept}
        isOpen={isConceptModalOpen}
        onClose={() => setIsConceptModalOpen(false)}
        onJumpToPage={onPageChange}
      />
    </div>
  );
};
