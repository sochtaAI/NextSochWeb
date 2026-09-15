import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  FileQuestion,
  History,
  Swords,
  Layers,
  Send,
  ShieldCheck,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setExamGoal, openSmartStudy } = useApp();

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Tagline Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Padhai Ki Next Soch · Built for NEET & JEE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white leading-[1.15]">
            Read your source.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 dark:from-indigo-400 dark:via-emerald-400 dark:to-teal-300">
              Practice instantly.
            </span>{' '}
            Master what matters.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The split-screen ecosystem where textbook pages sit directly beside page-linked MCQs.
            Never switch tabs or lose your reading flow to find high-yield exam practice.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="hero-start-learning-btn"
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-explore-collections-btn"
              onClick={() => setActiveTab('collections')}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 transition"
            >
              Explore Collections
            </button>
          </div>

          {/* Exam Goal Quick Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <span>Tailored for:</span>
            {(['NEET', 'JEE_MAIN', 'JEE_ADV', 'BOARDS'] as const).map(goal => (
              <button
                key={goal}
                onClick={() => {
                  setExamGoal(goal);
                  setActiveTab('smart-study');
                }}
                className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-lg text-slate-700 dark:text-slate-300 transition hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {goal.replace('_', ' ')} →
              </button>
            ))}
          </div>
        </div>

        {/* 3. SIGNATURE INTERACTIVE VISUAL MOCKUP */}
        <div className="mt-14 relative z-10 max-w-5xl mx-auto">
          <div className="bg-slate-900 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800">
            {/* Mock Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 mb-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-2">
                <span>app.nextsoch.com/study/bio-11-cell</span>
                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[9px]">LIVE PREVIEW</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Page 1 ↔ Questions (3)</div>
            </div>

            {/* Split Screen Simulator */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-950 rounded-xl overflow-hidden p-2 sm:p-4 border border-slate-800/60">
              {/* Left Mock: Reader */}
              <div className="md:col-span-7 bg-slate-900/90 rounded-xl p-5 border border-slate-800 text-left">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-3">
                  <span>NCERT BIOLOGY · CLASS 11 · CH 8</span>
                  <span className="bg-indigo-950/60 px-2 py-0.5 rounded text-[10px] border border-indigo-800/60">Page 125</span>
                </div>
                <h4 className="text-base font-bold text-white font-display mb-2">
                  8.2 Cell Theory
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In 1838, Matthias Schleiden, a German botanist, examined plants... At about the same time, Theodore Schwann (1839), a British Zoologist, reported plasma membrane and deduced that{' '}
                  <span className="bg-amber-400/20 text-amber-300 font-semibold px-1 rounded border-b border-amber-400">
                    presence of cell wall is a unique character of plant cells
                  </span>
                  . Virchow added "Omnis cellula-e cellula" in 1855.
                </p>
                <div className="mt-4 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-[11px] text-indigo-300 flex items-center justify-between">
                  <span>💡 3 mapped questions waiting for this page</span>
                  <span className="text-emerald-400 font-bold">100% NCERT Verified</span>
                </div>
              </div>

              {/* Right Mock: Practice */}
              <div className="md:col-span-5 bg-slate-900/90 rounded-xl p-5 border border-slate-800 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-extrabold text-white">Q1 · NEET PYQ 2020</span>
                    <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded">High Yield</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 leading-relaxed mb-3">
                    Who concluded based on plant studies that presence of cell wall is a unique character of plant cells?
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                      A. Matthias Schleiden
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-200 font-bold flex items-center justify-between">
                      <span>B. Theodore Schwann</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Concept: Cell Theory</span>
                  <button
                    onClick={() => openSmartStudy('BIOLOGY', 'bio-11-cell', 1)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>Launch Study Mode</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW NEXT SOCH WORKS (6-Step Loop) */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              The Cognitive Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">
              How NEXT SOCH Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              A deliberate learning loop engineered for long-term retention and competitive exam accuracy.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                step: '01',
                title: 'READ',
                icon: BookOpen,
                desc: 'Open authentic source/NCERT pages with clean typography.',
              },
              {
                step: '02',
                title: 'UNDERSTAND',
                icon: Brain,
                desc: 'Observe key facts, definitions, and high-yield callout boxes.',
              },
              {
                step: '03',
                title: 'PRACTICE',
                icon: Target,
                desc: 'Solve questions mapped to that exact page without switching views.',
              },
              {
                step: '04',
                title: 'ANALYZE',
                icon: Zap,
                desc: 'Get instant explanation and click "Show in Source" to jump back.',
              },
              {
                step: '05',
                title: 'REVISE',
                icon: History,
                desc: 'Mistakes automatically enter spaced repetition queues.',
              },
              {
                step: '06',
                title: 'MASTER',
                icon: CheckCircle2,
                desc: 'Achieve verified concept mastery for top exam percentiles.',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-600 transition group"
                >
                  <div className="text-[11px] font-mono font-bold text-slate-400 mb-2">
                    {item.step}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EXAM MODES COMPARISON */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            One Core Material · Tailored Practice
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">
            Adaptive Exam Modes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            The same textbook page generates different question experiences based on your chosen exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'NEET',
              subtitle: 'Medical Entrance',
              color: 'emerald',
              border: 'border-emerald-500/30',
              badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
              features: [
                'NCERT Line-by-Line questions',
                'Statement I & Statement II focus',
                'Assertion-Reason accuracy',
                'High-yield PYQ orientation',
              ],
              cta: 'Practice for NEET',
              goal: 'NEET' as const,
            },
            {
              title: 'JEE Main',
              subtitle: 'Engineering Entrance',
              color: 'indigo',
              border: 'border-indigo-500/30',
              badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
              features: [
                'Conceptual clarity & derivations',
                'Numerical value type questions',
                'Formula application & tricks',
                'Time-per-question analytics',
              ],
              cta: 'Practice for JEE Main',
              goal: 'JEE_MAIN' as const,
            },
            {
              title: 'JEE Advanced',
              subtitle: 'IIT Entrance',
              color: 'purple',
              border: 'border-purple-500/30',
              badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
              features: [
                'Multi-concept linked questions',
                'Multiple correct options format',
                'Deep analytical problem-solving',
                'Rigorous edge cases',
              ],
              cta: 'Practice for JEE Adv',
              goal: 'JEE_ADV' as const,
            },
            {
              title: 'CBSE Boards',
              subtitle: 'Class 11 & 12',
              color: 'amber',
              border: 'border-amber-500/30',
              badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
              features: [
                'NCERT textbook in-text & back exercises',
                'Short & long descriptive preparation',
                'Diagram labeling & definitions',
                'Strict syllabus alignment',
              ],
              cta: 'Practice for Boards',
              goal: 'BOARDS' as const,
            },
          ].map((mode, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border ${mode.border} shadow-sm flex flex-col justify-between hover:shadow-md transition`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                    {mode.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${mode.badge}`}>
                    {mode.subtitle}
                  </span>
                </div>
                <div className="w-8 h-1 bg-indigo-500 rounded-full mb-4"></div>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  {mode.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setExamGoal(mode.goal);
                  setActiveTab('smart-study');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1"
              >
                <span>{mode.cta}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SMART FEATURES SHOWCASE */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Mistake Notebook */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                Intelligent Mistake Notebook
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Every wrong answer automatically logs into your personal mistake repository.
                Classify errors into Concept Gaps, NCERT Facts, Calculation, or Option Confusion, then re-test to clear them.
              </p>
              <button
                onClick={() => setActiveTab('mistakes')}
                className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>Open Mistake Notebook</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Feature 2: Spaced Revision Engine */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                Spaced Revision Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Fight the forgetting curve. Questions trigger review intervals (1, 3, 7, 21 days) based on
                your confidence and past accuracy, making sure high-yield NCERT facts remain locked in your mind.
              </p>
              <button
                onClick={() => setActiveTab('revision')}
                className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>View Revision Schedule</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Feature 3: Soch Battle & Squads */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                Soch Battle & Squads
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Create a 5-minute, 10-question sprint on Cell or Genetics and send a challenge link to your study partner.
                Compare scores, learn from each other, and maintain a shared study streak.
              </p>
              <button
                onClick={() => setActiveTab('battle')}
                className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>Try Soch Battle</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. COMMUNITY & ECOSYSTEM */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              NEXT SOCH Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 font-display">
              Connect Across Website, Telegram Bot, and Daily Soch
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              When you stop studying at Page 12 on NEXT SOCH, our shared architecture lets you review your daily MCQ
              or revision queue on Telegram without losing progress.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Telegram Bot Integration</span>
              </div>
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Daily Soch of the Day</span>
              </div>
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Gemini 3.8 AI Study Mentor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-16 text-center px-4 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Ready for Padhai Ki Next Soch?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
          Join thousands of focused aspirants mastering NCERT line-by-line and solving page-linked questions with zero distractions.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-6 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25 transition flex items-center space-x-2 mx-auto"
        >
          <span>Enter Student Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
