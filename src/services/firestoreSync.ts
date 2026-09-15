import {
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  handleFirestoreError,
  OperationType,
  FirebaseUser
} from './firebase';
import { UserProgress, MistakeRecord, RevisionItem } from '../types';

export interface FirestoreUserProfile {
  id: string;
  email?: string;
  displayName?: string;
  selectedExam: string;
  selectedClass: string;
  totalXP: number;
  streakDays: number;
  lastActiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export const FirestoreSyncService = {
  /**
   * Initialize or update student profile in Firestore
   */
  async syncUserProfile(user: FirebaseUser, progress: UserProgress): Promise<void> {
    const userDocRef = doc(db, 'users', user.uid);
    const path = `users/${user.uid}`;
    try {
      const existingSnap = await getDoc(userDocRef);
      const now = new Date().toISOString();
      const examGoal = progress.selectedExam === 'JEE_ADV' ? 'JEE_ADVANCED' :
        progress.selectedExam === 'BOARDS' ? 'CBSE_BOARDS' :
        progress.selectedExam === 'CUET' ? 'NEET' : progress.selectedExam;

      const profileData = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Student',
        selectedExam: examGoal,
        selectedClass: progress.selectedClass,
        totalXP: Number(progress.totalXP) || 0,
        streakDays: Number(progress.streakDays) || 1,
        lastActiveDate: progress.lastActiveDate || now.split('T')[0],
        updatedAt: now,
        ...(existingSnap.exists() ? {} : { createdAt: now })
      };

      await setDoc(userDocRef, profileData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Sync complete user progress document
   */
  async syncUserProgress(userId: string, progress: UserProgress): Promise<void> {
    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    const path = `users/${userId}/progress/current`;
    try {
      await setDoc(progressRef, {
        userId,
        studyMood: progress.studyMood || 'In the zone 🎯',
        personality: progress.personality || 'The Consistent One',
        completedPages: progress.completedPages || {},
        answeredQuestions: progress.answeredQuestions || {},
        pageNotes: progress.pageNotes || {},
        pageHighlights: progress.pageHighlights || {},
        lastStudied: progress.lastStudied || null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Sync a mistake to the user's personal notebook
   */
  async saveMistake(userId: string, mistake: MistakeRecord): Promise<void> {
    const cleanId = mistake.id.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const mistakeRef = doc(db, 'users', userId, 'mistakes', cleanId);
    const path = `users/${userId}/mistakes/${cleanId}`;
    try {
      await setDoc(mistakeRef, {
        id: cleanId,
        userId,
        questionId: mistake.questionId,
        chapterId: mistake.chapterId,
        pageNumber: mistake.pageNumber || 1,
        selectedOption: mistake.selectedOption || '',
        correctOption: mistake.correctOption || '',
        category: mistake.category,
        userNote: mistake.userNote || '',
        timestamp: mistake.timestamp || Date.now(),
        resolved: Boolean(mistake.resolved)
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Sync revision item
   */
  async saveRevisionItem(userId: string, item: RevisionItem): Promise<void> {
    const cleanId = item.id.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const revRef = doc(db, 'users', userId, 'revisionQueue', cleanId);
    const path = `users/${userId}/revisionQueue/${cleanId}`;
    try {
      await setDoc(revRef, {
        id: cleanId,
        userId,
        questionId: item.questionId,
        chapterId: item.chapterId,
        pageNumber: item.pageNumber || 1,
        dueDate: item.dueDate || new Date().toISOString().split('T')[0],
        intervalDays: Number(item.intervalDays) || 1,
        repetitions: Number(item.repetitions) || 0,
        status: item.status
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Bookmark or unbookmark a question
   */
  async toggleBookmark(userId: string, questionId: string, isBookmarked: boolean): Promise<void> {
    const cleanQId = questionId.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const bookmarkRef = doc(db, 'users', userId, 'bookmarks', cleanQId);
    const path = `users/${userId}/bookmarks/${cleanQId}`;
    try {
      if (isBookmarked) {
        await setDoc(bookmarkRef, {
          questionId: cleanQId,
          userId,
          createdAt: new Date().toISOString()
        });
      } else {
        await deleteDoc(bookmarkRef);
      }
    } catch (error) {
      handleFirestoreError(error, isBookmarked ? OperationType.CREATE : OperationType.DELETE, path);
    }
  },

  /**
   * Fetch all user data from Firestore upon login
   */
  async loadUserData(userId: string): Promise<Partial<UserProgress> | null> {
    const path = `users/${userId}`;
    try {
      const [userSnap, progressSnap, mistakesSnap, revSnap, bookmarksSnap] = await Promise.all([
        getDoc(doc(db, 'users', userId)),
        getDoc(doc(db, 'users', userId, 'progress', 'current')),
        getDocs(collection(db, 'users', userId, 'mistakes')),
        getDocs(collection(db, 'users', userId, 'revisionQueue')),
        getDocs(collection(db, 'users', userId, 'bookmarks'))
      ]);

      if (!userSnap.exists() && !progressSnap.exists()) {
        return null;
      }

      const userData = userSnap.data() || {};
      const progressData = progressSnap.data() || {};

      const mistakes: MistakeRecord[] = [];
      mistakesSnap.forEach(docSnap => {
        const d = docSnap.data();
        mistakes.push({
          id: d.id || docSnap.id,
          questionId: d.questionId,
          chapterId: d.chapterId,
          pageNumber: d.pageNumber,
          selectedOption: d.selectedOption,
          correctOption: d.correctOption,
          category: d.category,
          userNote: d.userNote,
          timestamp: d.timestamp,
          resolved: d.resolved
        });
      });

      const revisionQueue: RevisionItem[] = [];
      revSnap.forEach(docSnap => {
        const d = docSnap.data();
        revisionQueue.push({
          id: d.id || docSnap.id,
          questionId: d.questionId,
          chapterId: d.chapterId,
          pageNumber: d.pageNumber,
          dueDate: d.dueDate,
          intervalDays: d.intervalDays,
          repetitions: d.repetitions,
          status: d.status
        });
      });

      const bookmarks: string[] = [];
      bookmarksSnap.forEach(docSnap => {
        bookmarks.push(docSnap.id);
      });

      return {
        selectedExam: userData.selectedExam || 'NEET',
        selectedClass: userData.selectedClass || '11',
        totalXP: userData.totalXP || 0,
        streakDays: userData.streakDays || 1,
        lastActiveDate: userData.lastActiveDate || new Date().toISOString().split('T')[0],
        completedPages: progressData.completedPages || {},
        answeredQuestions: progressData.answeredQuestions || {},
        pageNotes: progressData.pageNotes || {},
        pageHighlights: progressData.pageHighlights || {},
        lastStudied: progressData.lastStudied || undefined,
        studyMood: progressData.studyMood || 'In the zone 🎯',
        personality: progressData.personality || 'The Consistent One',
        mistakes: mistakes.length > 0 ? mistakes : undefined,
        revisionQueue: revisionQueue.length > 0 ? revisionQueue : undefined,
        bookmarks: bookmarks.length > 0 ? bookmarks : undefined
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }
};
