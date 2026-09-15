import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamGoal } from '../../types';
import {
  BookOpen,
  Sparkles,
  Flame,
  Search,
  Moon,
  Sun,
  Layers,
  CheckCircle2,
  HelpCircle,
  FileQuestion,
  History,
  Swords,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  Share2,
  Compass,
  Zap,
  Users,
  Award,
  Cloud,
  Database
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    examGoal,
    setExamGoal,
    theme,
    toggleTheme,
    userProgress,
    setIsAiModalOpen,
    setAiInitialPrompt,
    setIsShareModalOpen,
    setIsSearchModalOpen,
    subscription,
    setIsPricingModalOpen,
    setIsSubDashboardOpen,
    setIsReferralModalOpen,
    currentUser,
    isCloudSyncing,
    setIsCloudAccountModalOpen,
  } = useApp();

  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const examOptions: { id: ExamGoal; label: string; desc: string }[] = [
    { id: 'NEET', label: 'NEET', desc: 'NCERT Line-by-Line & Statements' },
    { id: 'JEE_MAIN', label: 'JEE Main', desc: 'Concept & Numericals' },
    { id: 'JEE_ADV', label: 'JEE Advanced', desc: 'Multi-concept High Rigor' },
    { id: 'BOARDS', label: 'CBSE Boards', desc: 'Descriptive & Textbook' },
  ];

  const navLinks: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'collections', label: 'Collections', icon: <Layers className="w-4 h-4" /> },
    { id: 'smart-study', label: 'Smart Study', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'pyqs', label: 'PYQs', icon: <FileQuestion className="w-4 h-4" /> },
    { id: 'mistakes', label: 'Mistakes', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'revision', label: 'Revision', icon: <History className="w-4 h-4" /> },
    { id: 'tests', label: 'CBT Tests', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'battle', label: 'Battle', icon: <Swords className="w-4 h-4" /> },
    { id: 'analytics', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pricing', icon: <Zap className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-6">
            <button
              id="nav-logo-btn"
              type="button"
              onClick={() => setActiveTab(activeTab === 'landing' ? 'landing' : 'dashboard')}
              className="flex items-center space-x-2 text-left group focus:outline-none"
              aria-label="NEXT SOCH Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <span className="font-display tracking-tight text-lg">NS</span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    NEXT SOCH
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wide">
                  Padhai Ki Next Soch.
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => setActiveTab(link.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global Search */}
            <button
              id="search-trigger-btn"
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Search NCERT, Questions & PYQs (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Exam Goal Selector Dropdown */}
            <div className="relative">
              <button
                id="exam-goal-selector-btn"
                onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{examGoal.replace('_', ' ')}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {isExamDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsExamDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Target Exam Goal
                    </span>
                  </div>
                  {examOptions.map(opt => (
                    <button
                      key={opt.id}
                      id={`exam-opt-${opt.id}`}
                      onClick={() => {
                        setExamGoal(opt.id);
                        setIsExamDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                        examGoal === opt.id
                          ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                      </div>
                      {examGoal === opt.id && <span className="text-indigo-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Streak Counter */}
            <div
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-bold"
              title={`${userProgress.streakDays} Day Learning Streak! Consistent practice builds mastery.`}
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{userProgress.streakDays}d</span>
            </div>

            {/* XP Badge */}
            <div
              className="hidden md:flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-indigo-700 dark:text-indigo-400 text-xs font-bold cursor-pointer hover:bg-indigo-100 transition"
              onClick={() => setIsShareModalOpen(true)}
              title="Click to generate shareable progress card"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{userProgress.totalXP} XP</span>
            </div>

            {/* SOCH Circle Referral Button */}
            <button
              id="navbar-referral-btn"
              onClick={() => setIsReferralModalOpen(true)}
              className="hidden xl:flex items-center space-x-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-lg text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition"
              title="SOCH Circle: Invite friends & earn 3-day pass"
            >
              <Users className="w-3.5 h-3.5 text-purple-500" />
              <span>SOCH Circle</span>
            </button>

            {/* Subscription Pill / Upgrade Button */}
            {subscription?.isPass ? (
              <button
                id="navbar-sub-badge-btn"
                onClick={() => setIsSubDashboardOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-lg text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition shadow-sm"
                title="Click to view Pass details & validity"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Pass: {subscription.hoursRemaining}h</span>
              </button>
            ) : subscription && subscription.planId !== 'plan_free' ? (
              <button
                id="navbar-sub-badge-btn"
                onClick={() => setIsSubDashboardOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition shadow-sm"
                title="Click to view subscription & entitlements"
              >
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span className="truncate max-w-[80px] sm:max-w-none">{subscription.planName}</span>
              </button>
            ) : (
              <button
                id="navbar-upgrade-btn"
                onClick={() => setIsPricingModalOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-lg text-indigo-700 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition"
                title="View Student Passes & Plans"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <span>Passes ₹9+</span>
              </button>
            )}

            {/* Ask AI Trigger */}
            <button
              id="navbar-ai-assistant-btn"
              onClick={() => {
                setAiInitialPrompt('');
                setIsAiModalOpen(true);
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Share Card Trigger */}
            <button
              id="navbar-share-btn"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Share Progress Card"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              id="navbar-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Firebase Cloud Sync Button */}
            <button
              id="navbar-cloud-sync-btn"
              onClick={() => setIsCloudAccountModalOpen(true)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                currentUser
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={
                currentUser
                  ? `Firebase Firestore Synced: ${currentUser.displayName || currentUser.email} (nextsoch-82538)`
                  : 'Connect to Firebase Firestore Cloud Sync'
              }
            >
              {currentUser ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden xl:inline">Cloud Synced</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="hidden xl:inline">Cloud Sync</span>
                </>
              )}
            </button>

            {/* Admin trigger */}
            <button
              id="navbar-admin-btn"
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded-lg transition ${
                activeTab === 'admin'
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Content Admin & Question Editor"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Streak: {userProgress.streakDays} days 🔥</span>
            <span>Total XP: {userProgress.totalXP} ⚡</span>
          </div>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-left transition ${
                activeTab === link.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <button
              onClick={() => {
                setIsCloudAccountModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition"
            >
              <Cloud className="w-4 h-4" />
              <span>{currentUser ? 'Firebase Cloud Account (Synced)' : 'Firebase Cloud Sync (Sign In)'}</span>
            </button>

            <button
              onClick={() => {
                setIsReferralModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left transition"
            >
              <Users className="w-4 h-4" />
              <span>SOCH Circle (Invite & Earn)</span>
            </button>

            <button
              onClick={() => {
                setIsSubDashboardOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition"
            >
              <Award className="w-4 h-4 text-indigo-500" />
              <span>My Subscription & Entitlements</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
