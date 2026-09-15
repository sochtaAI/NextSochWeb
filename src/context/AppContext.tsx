import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ExamGoal,
  SubjectType,
  ClassLevel,
  UserProgress,
  MistakeRecord,
  RevisionItem,
  MistakeCategory,
  Question,
  Plan,
  UserSubscriptionInfo,
  PickedGoogleDriveFile
} from '../types';
import { ALL_QUESTIONS } from '../data/curriculumData';
import { NextSochApi } from '../services/api';
import {
  auth,
  signInWithGoogle,
  logOut,
  onAuthStateChanged,
  getAccessToken,
  type FirebaseUser
} from '../services/firebase';
import { FirestoreSyncService } from '../services/firestoreSync';
import { openGooglePicker } from '../services/googlePicker';

export type NavigationTab =
  | 'landing'
  | 'dashboard'
  | 'collections'
  | 'smart-study'
  | 'practice'
  | 'tests'
  | 'pyqs'
  | 'mistakes'
  | 'revision'
  | 'battle'
  | 'squad'
  | 'analytics'
  | 'pricing'
  | 'admin';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface UpgradePromptDetails {
  title: string;
  message: string;
  featureKey?: string;
  suggestedPlanId?: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  examGoal: ExamGoal;
  setExamGoal: (goal: ExamGoal) => void;
  classLevel: ClassLevel;
  setClassLevel: (lvl: ClassLevel) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeSubjectId: SubjectType;
  setActiveSubjectId: (subj: SubjectType) => void;
  activeChapterId: string;
  setActiveChapterId: (chapId: string) => void;
  activePageNumber: number;
  setActivePageNumber: (page: number) => void;
  userProgress: UserProgress;
  openSmartStudy: (subjectId: SubjectType, chapterId: string, pageNumber?: number) => void;
  recordAnswer: (questionId: string, selectedOption: string) => { isCorrect: boolean; xpEarned: number };
  toggleBookmark: (questionId: string) => void;
  addMistake: (questionId: string, selectedOption: string, category: MistakeCategory, note?: string) => void;
  resolveMistake: (mistakeId: string) => void;
  updateRevisionStatus: (revisionId: string, status: 'retained' | 'mastered') => void;
  addPageNote: (chapterId: string, pageNumber: number, note: string) => void;
  addPageHighlight: (chapterId: string, pageNumber: number, text: string) => void;
  setStudyMood: (mood: string) => void;
  // Modal states
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiInitialPrompt: string;
  setAiInitialPrompt: (prompt: string) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  // Monetization & Subscription states
  subscription: UserSubscriptionInfo | null;
  plans: Plan[];
  refreshSubscription: () => Promise<void>;
  canAccess: (featureKey: string) => boolean;
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  checkoutPlan: Plan | null;
  startCheckout: (plan: Plan) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  upgradeDetails: UpgradePromptDetails | null;
  triggerUpgradePrompt: (prompt: UpgradePromptDetails) => void;
  isSubDashboardOpen: boolean;
  setIsSubDashboardOpen: (open: boolean) => void;
  isReferralModalOpen: boolean;
  setIsReferralModalOpen: (open: boolean) => void;
  // Firebase Auth & Cloud Firestore Sync
  currentUser: FirebaseUser | null;
  isAuthLoading: boolean;
  isCloudSyncing: boolean;
  lastCloudSync: string | null;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
  syncNowToCloud: () => Promise<void>;
  isCloudAccountModalOpen: boolean;
  setIsCloudAccountModalOpen: (open: boolean) => void;
  // Google Drive & Picker Integration
  studyDriveFiles: PickedGoogleDriveFile[];
  isGooglePickerModalOpen: boolean;
  setIsGooglePickerModalOpen: (open: boolean) => void;
  openDrivePicker: (chapterId?: string, chapterTitle?: string) => Promise<void>;
  removeDriveFile: (fileId: string) => Promise<boolean>;
}

const defaultProgress: UserProgress = {
  selectedExam: 'NEET',
  selectedClass: '11',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXP: 380,
  lastStudied: {
    subjectId: 'BIOLOGY',
    chapterId: 'bio-11-cell',
    pageNumber: 1,
  },
  completedPages: {
    'bio-11-cell': [1],
  },
  answeredQuestions: {
    'q-cell-p1-1': { selected: 'B', isCorrect: true, timestamp: Date.now() - 3600000 },
  },
  bookmarks: ['q-cell-p1-2'],
  pageNotes: {
    'bio-11-cell_1': ['Remember: Schwann was British Zoologist but made discovery about plant cell walls!'],
  },
  pageHighlights: {
    'bio-11-cell_1': ['presence of cell wall is a unique character of the plant cells'],
  },
  mistakes: [
    {
      id: 'm-sample-1',
      questionId: 'q-cell-p3-3',
      chapterId: 'bio-11-cell',
      pageNumber: 3,
      selectedOption: 'B',
      correctOption: 'A',
      category: 'confusion',
      userNote: 'Confused identical with interconnected in Golgi cis vs trans faces.',
      timestamp: Date.now() - 86400000,
      resolved: false,
    }
  ],
  revisionQueue: [
    {
      id: 'rev-sample-1',
      questionId: 'q-cell-p1-2',
      chapterId: 'bio-11-cell',
      pageNumber: 1,
      dueDate: new Date().toISOString().split('T')[0],
      intervalDays: 1,
      repetitions: 1,
      status: 'due',
    },
    {
      id: 'rev-sample-2',
      questionId: 'q-cell-p2-2',
      chapterId: 'bio-11-cell',
      pageNumber: 2,
      dueDate: new Date().toISOString().split('T')[0],
      intervalDays: 3,
      repetitions: 2,
      status: 'due',
    }
  ],
  studyMood: 'In the zone 🎯',
  personality: 'The Consistent One',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [examGoal, setExamGoalState] = useState<ExamGoal>('NEET');
  const [classLevel, setClassLevelState] = useState<ClassLevel>('11');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const setExamGoal = (goal: ExamGoal) => {
    setExamGoalState(goal);
    NextSochApi.updateSettings({ selectedExam: goal }).catch(err =>
      console.warn('Exam goal sync notice:', err?.message)
    );
    if (currentUser) {
      FirestoreSyncService.syncUserProfile(currentUser, { ...userProgress, selectedExam: goal })
        .catch(err => console.warn('[Firebase] Exam goal sync notice:', err));
    }
  };

  const setClassLevel = (cls: ClassLevel) => {
    setClassLevelState(cls);
    NextSochApi.updateSettings({ selectedClass: cls }).catch(err =>
      console.warn('Class level sync notice:', err?.message)
    );
    if (currentUser) {
      FirestoreSyncService.syncUserProfile(currentUser, { ...userProgress, selectedClass: cls })
        .catch(err => console.warn('[Firebase] Class level sync notice:', err));
    }
  };

  const [activeSubjectId, setActiveSubjectId] = useState<SubjectType>('BIOLOGY');
  const [activeChapterId, setActiveChapterId] = useState<string>('bio-11-cell');
  const [activePageNumber, setActivePageNumber] = useState<number>(1);

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('next_soch_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return defaultProgress;
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Monetization & Subscription state
  const [subscription, setSubscription] = useState<UserSubscriptionInfo | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeDetails, setUpgradeDetails] = useState<UpgradePromptDetails | null>(null);
  const [isSubDashboardOpen, setIsSubDashboardOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  // Firebase Auth and Cloud State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);
  const [isCloudAccountModalOpen, setIsCloudAccountModalOpen] = useState<boolean>(false);

  // Monitor Firebase Auth state & sync with Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        try {
          setIsCloudSyncing(true);
          const cloudData = await FirestoreSyncService.loadUserData(user.uid);
          if (cloudData) {
            setUserProgress(prev => ({
              ...prev,
              totalXP: Math.max(prev.totalXP, cloudData.totalXP || 0),
              streakDays: Math.max(prev.streakDays, cloudData.streakDays || 1),
              selectedExam: cloudData.selectedExam || prev.selectedExam,
              selectedClass: cloudData.selectedClass || prev.selectedClass,
              completedPages: { ...prev.completedPages, ...(cloudData.completedPages || {}) },
              answeredQuestions: { ...prev.answeredQuestions, ...(cloudData.answeredQuestions || {}) },
              bookmarks: Array.from(new Set([...prev.bookmarks, ...(cloudData.bookmarks || [])])),
              mistakes: cloudData.mistakes?.length ? cloudData.mistakes : prev.mistakes,
              revisionQueue: cloudData.revisionQueue?.length ? cloudData.revisionQueue : prev.revisionQueue,
              pageNotes: { ...prev.pageNotes, ...(cloudData.pageNotes || {}) },
              pageHighlights: { ...prev.pageHighlights, ...(cloudData.pageHighlights || {}) },
            }));
          }
          await FirestoreSyncService.syncUserProfile(user, userProgress);
          setLastCloudSync(new Date().toISOString());
        } catch (err) {
          console.warn('[Firebase] Auth state Firestore sync notice:', err);
        } finally {
          setIsCloudSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsAuthLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        addToast({
          title: 'Google Sign-In Successful! 🚀',
          description: `Logged in as ${user.displayName || user.email}. Cloud sync active.`,
          type: 'success'
        });
      }
    } catch (err: any) {
      console.error('[Firebase Auth] Sign in error:', err);
      addToast({
        title: 'Sign In Cancelled or Failed',
        description: err?.message || 'Please check popup permissions and try again.',
        type: 'error'
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logOut();
      addToast({
        title: 'Signed Out',
        description: 'Switched to offline-first local mode.',
        type: 'info'
      });
      setIsCloudAccountModalOpen(false);
    } catch (err: any) {
      console.error('[Firebase Auth] Sign out error:', err);
    }
  };

  const syncNowToCloud = async () => {
    if (!currentUser) {
      setIsCloudAccountModalOpen(true);
      return;
    }
    setIsCloudSyncing(true);
    try {
      await Promise.all([
        FirestoreSyncService.syncUserProfile(currentUser, userProgress),
        FirestoreSyncService.syncUserProgress(currentUser.uid, userProgress)
      ]);
      setLastCloudSync(new Date().toISOString());
      addToast({
        title: 'Cloud Sync Complete! ☁️',
        description: 'All current progress safely updated in Firestore (nextsoch-82538).',
        type: 'success'
      });
    } catch (err: any) {
      console.error('[Firebase] Manual sync failed:', err);
      addToast({
        title: 'Sync Notice',
        description: err?.message || 'Could not sync with Firestore at this moment.',
        type: 'warning'
      });
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Google Drive & Picker integration state
  const [studyDriveFiles, setStudyDriveFiles] = useState<PickedGoogleDriveFile[]>(() => {
    try {
      const saved = localStorage.getItem('nextsoch_drive_files');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sample-ncert-bio-notes',
          name: 'Class 11 Cell Cycle & Division - High Yield Handwritten Notes.pdf',
          url: 'https://drive.google.com',
          mimeType: 'application/pdf',
          sizeBytes: 2450000,
          chapterId: 'bio-11-cell',
          chapterTitle: 'Cell: The Unit of Life',
          pickedAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [isGooglePickerModalOpen, setIsGooglePickerModalOpen] = useState<boolean>(false);

  const openDrivePicker = async (chapterId?: string, chapterTitle?: string) => {
    try {
      let token = await getAccessToken();
      if (!token) {
        addToast({
          title: 'Google Sign-In Required',
          description: 'Signing into Google to access your Google Drive files...',
          type: 'info'
        });
        const loginRes = await signInWithGoogle();
        token = loginRes?.accessToken || (await getAccessToken());
        if (!token) {
          addToast({
            title: 'Google Drive Auth Incomplete',
            description: 'Please sign in with Google to grant Drive Picker permissions.',
            type: 'warning'
          });
          return;
        }
      }

      await openGooglePicker({
        accessToken: token,
        title: chapterTitle ? `Pick Study Materials for ${chapterTitle}` : 'Pick Study Materials from Google Drive',
        onPicked: (picked) => {
          const filesWithMeta: PickedGoogleDriveFile[] = picked.map(f => ({
            ...f,
            chapterId: chapterId || activeChapterId,
            chapterTitle: chapterTitle || CHAPTERS.find(c => c.id === (chapterId || activeChapterId))?.title
          }));

          setStudyDriveFiles(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const fresh = filesWithMeta.filter(f => !existingIds.has(f.id));
            const updated = [...fresh, ...prev];
            try {
              localStorage.setItem('nextsoch_drive_files', JSON.stringify(updated));
            } catch (e) {
              console.error('Failed to save to localStorage', e);
            }
            return updated;
          });

          addToast({
            title: 'Attached from Google Drive! 📑',
            description: `Successfully linked ${picked.length} study document(s) via Google Picker.`,
            type: 'success'
          });
        },
        onCancel: () => {
          // Cleanly dismissed
        },
        onError: (err) => {
          console.error('[Google Picker error]', err);
          addToast({
            title: 'Google Picker Notice',
            description: err?.message || 'Could not initialize Google Picker.',
            type: 'error'
          });
        }
      });
    } catch (err: any) {
      console.error('[Google Picker launch error]', err);
      addToast({
        title: 'Could not open Google Picker',
        description: err?.message || 'Check browser permissions and popups.',
        type: 'error'
      });
    }
  };

  // User confirmation dialog for unlinking/removing Drive file (Workspace skill mandatory requirement)
  const removeDriveFile = async (fileId: string): Promise<boolean> => {
    const targetFile = studyDriveFiles.find(f => f.id === fileId);
    const targetName = targetFile?.name || 'this document';

    const confirmed = window.confirm(
      `Unlink "${targetName}" from your NEXT SOCH study workspace?\n\nThis will remove the file reference from your chapter attachments. Your original Google Drive file is not deleted.`
    );
    if (!confirmed) return false;

    setStudyDriveFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      try {
        localStorage.setItem('nextsoch_drive_files', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });

    addToast({
      title: 'File Unlinked',
      description: `Removed "${targetName}" from your study materials.`,
      type: 'info'
    });
    return true;
  };

  const refreshSubscription = async () => {
    try {
      const [subRes, plansRes] = await Promise.all([
        NextSochApi.getMySubscription(),
        NextSochApi.getPlans(),
      ]);
      if (subRes.success && subRes.data) {
        setSubscription(subRes.data);
      }
      if (plansRes.success && plansRes.data) {
        setPlans(plansRes.data);
      }
    } catch (err) {
      console.warn('Subscription sync error:', err);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, []);

  const canAccess = (featureKey: string): boolean => {
    if (!subscription) return true;
    if (featureKey === 'unlimited_practice') {
      if (subscription.planType === 'free') {
        return !subscription.dailyPractice.isLimitReached;
      }
      return true;
    }
    const ent = subscription.entitlements[featureKey];
    if (!ent) return true;
    return ent.isEnabled;
  };

  const triggerUpgradePrompt = (details: UpgradePromptDetails) => {
    setUpgradeDetails(details);
    setIsUpgradeModalOpen(true);
  };

  const startCheckout = (plan: Plan) => {
    setCheckoutPlan(plan);
    setIsPricingModalOpen(false);
    setIsUpgradeModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  // Persist progress to localStorage and sync initial from database
  useEffect(() => {
    try {
      localStorage.setItem('next_soch_progress', JSON.stringify(userProgress));
    } catch {
      // ignore
    }
  }, [userProgress]);

  // Initial fetch from backend relational database
  useEffect(() => {
    NextSochApi.getUserProgress()
      .then(res => {
        if (res && res.data) {
          setUserProgress(prev => ({
            ...prev,
            totalXP: Math.max(prev.totalXP, res.data.totalXP || 0),
            streakDays: Math.max(prev.streakDays, res.data.streakDays || 1),
            selectedExam: (res.data.selectedExam as ExamGoal) || prev.selectedExam,
            selectedClass: (res.data.selectedClass as ClassLevel) || prev.selectedClass,
            completedPages: { ...prev.completedPages, ...(res.data.completedPages || {}) },
            answeredQuestions: { ...prev.answeredQuestions, ...(res.data.answeredQuestions || {}) },
            bookmarks: Array.from(new Set([...prev.bookmarks, ...(res.data.bookmarks || [])])),
            mistakes: res.data.mistakes?.length ? res.data.mistakes : prev.mistakes,
            revisionQueue: res.data.revisionQueue?.length ? res.data.revisionQueue : prev.revisionQueue,
            pageNotes: { ...prev.pageNotes, ...(res.data.pageNotes || {}) },
            pageHighlights: { ...prev.pageHighlights, ...(res.data.pageHighlights || {}) },
          }));
        }
      })
      .catch(err => {
        console.warn('Initial server progress sync notice (using local offline cache):', err?.message);
      });
  }, []);

  // Apply theme class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openSmartStudy = (subjectId: SubjectType, chapterId: string, pageNumber: number = 1) => {
    setActiveSubjectId(subjectId);
    setActiveChapterId(chapterId);
    setActivePageNumber(pageNumber);
    setActiveTab('smart-study');

    // Update last studied
    setUserProgress(prev => ({
      ...prev,
      lastStudied: { subjectId, chapterId, pageNumber }
    }));
  };

  const recordAnswer = (questionId: string, selectedOption: string) => {
    // Check daily practice quota for free users on new question attempt
    const isAlreadyAttempted = !!userProgress.answeredQuestions[questionId];
    if (!isAlreadyAttempted && subscription?.planType === 'free' && subscription.dailyPractice.isLimitReached) {
      triggerUpgradePrompt({
        title: "You've completed today's free practice. 🎯",
        message: "Want to keep going? Student — ₹49/month. Full page practice + revision + PYQs.",
        featureKey: 'unlimited_practice',
        suggestedPlanId: 'plan_student_monthly',
      });
      return { isCorrect: false, xpEarned: 0 };
    }

    const question = ALL_QUESTIONS.find(q => q.id === questionId);
    const isCorrect = question ? question.correctAnswer === selectedOption : false;
    const xpEarned = isCorrect ? 15 : 2;

    setUserProgress(prev => {
      const updated = {
        ...prev,
        totalXP: prev.totalXP + xpEarned,
        answeredQuestions: {
          ...prev.answeredQuestions,
          [questionId]: {
            selected: selectedOption,
            isCorrect,
            timestamp: Date.now()
          }
        }
      };

      // If page has all questions answered, mark page completed
      if (question) {
        const pageQuestions = ALL_QUESTIONS.filter(
          q => q.chapterId === question.chapterId && q.pageNumber === question.pageNumber
        );
        const allAnswered = pageQuestions.every(
          q => q.id === questionId || !!updated.answeredQuestions[q.id]
        );

        if (allAnswered) {
          const currentCompleted = prev.completedPages[question.chapterId] || [];
          if (!currentCompleted.includes(question.pageNumber)) {
            updated.completedPages = {
              ...prev.completedPages,
              [question.chapterId]: [...currentCompleted, question.pageNumber]
            };
            addToast({
              title: `Page ${question.pageNumber} Completed! 🏆`,
              description: 'Great job! Concept locked into your learning streak.',
              type: 'success'
            });
          }
        }
      }

      return updated;
    });

    if (isCorrect) {
      addToast({
        title: 'Correct Answer! +15 XP ⚡',
        description: 'Target concept mastered.',
        type: 'success'
      });
    } else {
      addToast({
        title: 'Incorrect Attempt',
        description: 'Question recorded. Check the NCERT explanation beside it!',
        type: 'info'
      });
    }

    // Persist attempt to relational database service layer
    NextSochApi.submitAttempt(questionId, selectedOption)
      .then(res => {
        if (res?.data?.pageCompleted) {
          console.log(`[Database] Page ${res.data.pageNumber} completion verified by backend.`);
        }
        if (res?.data?.practiceQuota && subscription) {
          setSubscription(prev => prev ? {
            ...prev,
            dailyPractice: {
              solvedToday: res.data.practiceQuota.solvedToday,
              dailyLimit: res.data.practiceQuota.dailyLimit,
              remainingToday: res.data.practiceQuota.remainingToday,
              isLimitReached: res.data.practiceQuota.isLimitReached,
            }
          } : null);
        }
      })
      .catch(err => console.warn('Submit attempt server sync notice:', err?.message));

    // Firestore sync when signed in
    if (currentUser) {
      setUserProgress(latest => {
        FirestoreSyncService.syncUserProgress(currentUser.uid, latest)
          .catch(err => console.warn('[Firebase] Progress sync notice:', err));
        return latest;
      });
    }

    return { isCorrect, xpEarned };
  };

  const toggleBookmark = (questionId: string) => {
    let willBeBookmarked = false;
    setUserProgress(prev => {
      const exists = prev.bookmarks.includes(questionId);
      willBeBookmarked = !exists;
      const bookmarks = exists
        ? prev.bookmarks.filter(id => id !== questionId)
        : [...prev.bookmarks, questionId];

      addToast({
        title: exists ? 'Removed from Bookmarks' : 'Bookmarked for Revision 🔖',
        type: 'info'
      });

      return { ...prev, bookmarks };
    });

    NextSochApi.toggleBookmark(questionId)
      .catch(err => console.warn('Bookmark server sync notice:', err?.message));

    if (currentUser) {
      FirestoreSyncService.toggleBookmark(currentUser.uid, questionId, willBeBookmarked)
        .catch(err => console.warn('[Firebase] Bookmark sync notice:', err));
    }
  };

  const addMistake = (
    questionId: string,
    selectedOption: string,
    category: MistakeCategory,
    note?: string
  ) => {
    const question = ALL_QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    const newMistake: MistakeRecord = {
      id: `mistake-${Date.now()}`,
      questionId,
      chapterId: question.chapterId,
      pageNumber: question.pageNumber,
      selectedOption,
      correctOption: question.correctAnswer,
      category,
      userNote: note,
      timestamp: Date.now(),
      resolved: false,
    };

    setUserProgress(prev => ({
      ...prev,
      mistakes: [newMistake, ...prev.mistakes.filter(m => m.questionId !== questionId)]
    }));

    addToast({
      title: 'Added to Mistake Notebook 📓',
      description: `Categorized under "${category.toUpperCase()}" for targeted review.`,
      type: 'warning'
    });

    NextSochApi.addMistake(questionId, selectedOption, category, note)
      .catch(err => console.warn('Mistake server sync notice:', err?.message));

    if (currentUser) {
      FirestoreSyncService.saveMistake(currentUser.uid, newMistake)
        .catch(err => console.warn('[Firebase] Mistake sync notice:', err));
    }
  };

  const resolveMistake = (mistakeId: string) => {
    let resolvedItem: MistakeRecord | undefined;
    setUserProgress(prev => {
      const updatedList = prev.mistakes.map(m => {
        if (m.id === mistakeId) {
          resolvedItem = { ...m, resolved: true };
          return resolvedItem;
        }
        return m;
      });
      return { ...prev, mistakes: updatedList };
    });

    addToast({
      title: 'Mistake Resolved! 🎯',
      description: 'Concept successfully cleared from your weak areas.',
      type: 'success'
    });

    NextSochApi.resolveMistake(mistakeId)
      .catch(err => console.warn('Resolve mistake server sync notice:', err?.message));

    if (currentUser && resolvedItem) {
      FirestoreSyncService.saveMistake(currentUser.uid, resolvedItem)
        .catch(err => console.warn('[Firebase] Resolve mistake sync notice:', err));
    }
  };

  const updateRevisionStatus = (revisionId: string, status: 'retained' | 'mastered') => {
    let updatedRevision: RevisionItem | undefined;
    setUserProgress(prev => ({
      ...prev,
      revisionQueue: prev.revisionQueue.map(item => {
        if (item.id === revisionId) {
          const nextInterval = status === 'mastered' ? item.intervalDays * 3 : item.intervalDays * 2;
          const nextDue = new Date(Date.now() + nextInterval * 86400000).toISOString().split('T')[0];
          updatedRevision = {
            ...item,
            status,
            intervalDays: nextInterval,
            repetitions: item.repetitions + 1,
            dueDate: nextDue,
            lastReviewed: Date.now()
          };
          return updatedRevision;
        }
        return item;
      })
    }));

    addToast({
      title: status === 'mastered' ? 'Concept Mastered! 🌟' : 'Revision Retained! 👍',
      description: 'Interval scheduled forward in your spaced repetition engine.',
      type: 'success'
    });

    NextSochApi.updateRevisionStatus(revisionId, status)
      .catch(err => console.warn('Revision server sync notice:', err?.message));

    if (currentUser && updatedRevision) {
      FirestoreSyncService.saveRevisionItem(currentUser.uid, updatedRevision)
        .catch(err => console.warn('[Firebase] Revision item sync notice:', err));
    }
  };

  const addPageNote = (chapterId: string, pageNumber: number, note: string) => {
    const key = `${chapterId}_${pageNumber}`;
    setUserProgress(prev => {
      const updated = {
        ...prev,
        pageNotes: {
          ...prev.pageNotes,
          [key]: [...(prev.pageNotes[key] || []), note]
        }
      };
      if (currentUser) {
        FirestoreSyncService.syncUserProgress(currentUser.uid, updated)
          .catch(err => console.warn('[Firebase] Page note sync notice:', err));
      }
      return updated;
    });
    addToast({ title: 'Note saved on Page ' + pageNumber, type: 'info' });

    NextSochApi.saveAnnotation(chapterId, pageNumber, 'note', note)
      .catch(err => console.warn('Note annotation server sync notice:', err?.message));
  };

  const addPageHighlight = (chapterId: string, pageNumber: number, text: string) => {
    const key = `${chapterId}_${pageNumber}`;
    setUserProgress(prev => {
      const updated = {
        ...prev,
        pageHighlights: {
          ...prev.pageHighlights,
          [key]: [...(prev.pageHighlights[key] || []), text]
        }
      };
      if (currentUser) {
        FirestoreSyncService.syncUserProgress(currentUser.uid, updated)
          .catch(err => console.warn('[Firebase] Page highlight sync notice:', err));
      }
      return updated;
    });
    addToast({ title: 'Text highlighted in textbook', type: 'info' });

    NextSochApi.saveAnnotation(chapterId, pageNumber, 'highlight', text)
      .catch(err => console.warn('Highlight annotation server sync notice:', err?.message));
  };

  const setStudyMood = (mood: string) => {
    setUserProgress(prev => {
      const updated = { ...prev, studyMood: mood };
      if (currentUser) {
        FirestoreSyncService.syncUserProgress(currentUser.uid, updated)
          .catch(err => console.warn('[Firebase] Study mood sync notice:', err));
      }
      return updated;
    });
    addToast({ title: 'Study mood updated: ' + mood, type: 'info' });

    NextSochApi.updateSettings({ studyMood: mood })
      .catch(err => console.warn('Study mood server sync notice:', err?.message));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        examGoal,
        setExamGoal,
        classLevel,
        setClassLevel,
        theme,
        toggleTheme,
        activeSubjectId,
        setActiveSubjectId,
        activeChapterId,
        setActiveChapterId,
        activePageNumber,
        setActivePageNumber,
        userProgress,
        openSmartStudy,
        recordAnswer,
        toggleBookmark,
        addMistake,
        resolveMistake,
        updateRevisionStatus,
        addPageNote,
        addPageHighlight,
        setStudyMood,
        isAiModalOpen,
        setIsAiModalOpen,
        aiInitialPrompt,
        setAiInitialPrompt,
        isShareModalOpen,
        setIsShareModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        toasts,
        addToast,
        removeToast,
        subscription,
        plans,
        refreshSubscription,
        canAccess,
        isPricingModalOpen,
        setIsPricingModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutPlan,
        startCheckout,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        upgradeDetails,
        triggerUpgradePrompt,
        isSubDashboardOpen,
        setIsSubDashboardOpen,
        isReferralModalOpen,
        setIsReferralModalOpen,
        currentUser,
        isAuthLoading,
        isCloudSyncing,
        lastCloudSync,
        loginWithGoogle,
        logoutUser,
        syncNowToCloud,
        isCloudAccountModalOpen,
        setIsCloudAccountModalOpen,
        studyDriveFiles,
        isGooglePickerModalOpen,
        setIsGooglePickerModalOpen,
        openDrivePicker,
        removeDriveFile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
