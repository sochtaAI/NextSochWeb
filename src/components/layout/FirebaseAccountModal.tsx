import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cloud,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Database,
  Globe,
  Sparkles,
  X,
  Bookmark,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export const FirebaseAccountModal: React.FC = () => {
  const {
    currentUser,
    isAuthLoading,
    isCloudSyncing,
    lastCloudSync,
    loginWithGoogle,
    logoutUser,
    syncNowToCloud,
    isCloudAccountModalOpen,
    setIsCloudAccountModalOpen,
    userProgress
  } = useApp();

  if (!isCloudAccountModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                Firebase Cloud Sync
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Google Cloud Firestore & Authentication
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCloudAccountModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {currentUser ? (
            /* Signed-In State */
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-emerald-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.displayName || 'Verified Student'}
                    </h4>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Synced
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                    UID: {currentUser.uid}
                  </p>
                </div>
              </div>

              {/* Cloud Database Details */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                    Firestore Project
                  </span>
                  <span className="font-mono text-emerald-800 dark:text-emerald-200 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                    nextsoch-82538
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    Region
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    asia-south1 (Mumbai)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Access Model
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Zero-Trust ABAC Rules Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    Last Cloud Sync
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {lastCloudSync ? new Date(lastCloudSync).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
              </div>

              {/* Data Synchronized Overview */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {Object.keys(userProgress.answeredQuestions).length}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                    <CheckSquare className="w-3 h-3 text-indigo-500" /> Questions
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {userProgress.bookmarks.length}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                    <Bookmark className="w-3 h-3 text-amber-500" /> Bookmarks
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {userProgress.mistakes.length}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3 text-rose-500" /> Mistakes
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="firebase-sync-now-btn"
                  onClick={syncNowToCloud}
                  disabled={isCloudSyncing}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                  <span>{isCloudSyncing ? 'Syncing to Firestore...' : 'Sync Now'}</span>
                </button>
                <button
                  id="firebase-logout-btn"
                  onClick={logoutUser}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Signed-Out State */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/50 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Cross-Device Academic Sync</span>
                </div>
                <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  Sign in to link your study sessions to <strong>Firebase Firestore</strong> (Project: <code className="font-mono text-[11px] bg-indigo-100 dark:bg-indigo-900/50 px-1 py-0.5 rounded">nextsoch-82538</code>, Region: <code className="font-mono text-[11px] bg-indigo-100 dark:bg-indigo-900/50 px-1 py-0.5 rounded">asia-south1</code>).
                </p>
                <ul className="text-[11px] text-indigo-900/80 dark:text-indigo-300/80 space-y-1 pt-1">
                  <li>• NCERT margin notes & highlights securely saved</li>
                  <li>• Spaced repetition revision intervals preserved across devices</li>
                  <li>• Personal mistake notebook synced automatically</li>
                </ul>
              </div>

              {/* Sign In Button */}
              <button
                id="firebase-google-login-btn"
                onClick={loginWithGoogle}
                disabled={isAuthLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-60"
              >
                {/* Google "G" Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isAuthLoading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                Offline progress is preserved locally and synced automatically upon authentication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
