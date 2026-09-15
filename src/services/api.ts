import {
  ExamGoal,
  SubjectType,
  ClassLevel,
  MistakeCategory,
  Question,
  UserProgress,
} from '../types';

const API_BASE = '/api/v1';

// Student authorization header token
const DEFAULT_AUTH_TOKEN = 'next_soch_student_token';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${DEFAULT_AUTH_TOKEN}`);
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMsg = `HTTP ${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      if (data.error) errorMsg = data.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const NextSochApi = {
  // Curriculum Hierarchy
  async getHierarchy(examId?: ExamGoal) {
    const query = examId ? `?examId=${examId}` : '';
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/hierarchy${query}`);
  },

  async getExams() {
    return fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/exams`);
  },

  async getSubjects(classLevel?: ClassLevel) {
    const query = classLevel ? `?classLevel=${classLevel}` : '';
    return fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/subjects${query}`);
  },

  async getChapters(subjectId?: SubjectType, classLevel?: ClassLevel) {
    const params = new URLSearchParams();
    if (subjectId) params.append('subjectId', subjectId);
    if (classLevel) params.append('classLevel', classLevel);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/chapters${query}`);
  },

  async getChapter(chapterId: string) {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/chapters/${chapterId}`);
  },

  async getPage(chapterId: string, pageNumber: number) {
    return fetchJson<{ success: boolean; data: any }>(
      `${API_BASE}/chapters/${chapterId}/pages/${pageNumber}`
    );
  },

  // Question-to-Page mapping
  async getPageQuestions(
    chapterId: string,
    pageNumber: number,
    examGoal?: ExamGoal,
    filter?: string
  ) {
    const params = new URLSearchParams();
    if (examGoal) params.append('examGoal', examGoal);
    if (filter) params.append('filter', filter);
    const query = params.toString() ? `?${params.toString()}` : '';

    return fetchJson<{
      success: boolean;
      chapterId: string;
      pageNumber: number;
      count: number;
      data: Question[];
    }>(`${API_BASE}/chapters/${chapterId}/pages/${pageNumber}/questions${query}`);
  },

  async getChapterPageMappings(chapterId: string) {
    return fetchJson<{ success: boolean; chapterId: string; data: any[] }>(
      `${API_BASE}/chapters/${chapterId}/page-mappings`
    );
  },

  // User Services
  async getUserProgress() {
    return fetchJson<{ success: boolean; data: UserProgress }>(`${API_BASE}/user/progress`);
  },

  async submitAttempt(questionId: string, selectedOption: string, timeSpentSec: number = 0) {
    return fetchJson<{
      success: boolean;
      data: {
        attemptId: string;
        questionId: string;
        chapterId: string;
        pageNumber: number;
        selectedOption: string;
        correctAnswer: string;
        isCorrect: boolean;
        xpEarned: number;
        pageCompleted: boolean;
        totalXP: number;
        streakDays: number;
        practiceQuota?: {
          solvedToday: number;
          dailyLimit: number;
          remainingToday: number;
          isLimitReached: boolean;
        };
      };
      error?: string;
    }>(`${API_BASE}/user/attempts`, {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedOption, timeSpentSec }),
    });
  },

  async toggleBookmark(questionId: string, note?: string) {
    return fetchJson<{
      success: boolean;
      data: { isBookmarked: boolean; questionId: string };
    }>(`${API_BASE}/user/bookmarks/toggle`, {
      method: 'POST',
      body: JSON.stringify({ questionId, note }),
    });
  },

  async addMistake(
    questionId: string,
    selectedOption: string,
    category: MistakeCategory,
    userNote?: string
  ) {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/user/mistakes`, {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedOption, category, userNote }),
    });
  },

  async resolveMistake(mistakeId: string) {
    return fetchJson<{ success: boolean; data: { id: string; resolved: boolean } }>(
      `${API_BASE}/user/mistakes/${mistakeId}/resolve`,
      { method: 'PATCH' }
    );
  },

  async updateRevisionStatus(revisionId: string, status: 'retained' | 'mastered') {
    return fetchJson<{ success: boolean; data: any }>(
      `${API_BASE}/user/revision/${revisionId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  },

  async saveAnnotation(
    chapterId: string,
    pageNumber: number,
    type: 'note' | 'highlight',
    content: string
  ) {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/user/annotations`, {
      method: 'POST',
      body: JSON.stringify({ chapterId, pageNumber, type, content }),
    });
  },

  async updateSettings(settings: {
    selectedExam?: ExamGoal;
    selectedClass?: ClassLevel;
    studyMood?: string;
    name?: string;
  }) {
    return fetchJson<{ success: boolean; data: UserProgress }>(`${API_BASE}/user/settings`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },

  // =========================================================================
  // Subscription, Monetization & Entitlements
  // =========================================================================

  async getPlans() {
    return fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/subscription/plans`);
  },

  async getMySubscription() {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/subscription/my`);
  },

  async canAccessFeature(featureKey: string) {
    return fetchJson<{
      success: boolean;
      data: {
        allowed: boolean;
        reason?: string;
        featureKey: string;
        upgradeSuggestedPlan?: string;
        remainingQuota?: number;
      };
    }>(`${API_BASE}/subscription/can-access/${featureKey}`);
  },

  async createCheckoutSession(params: {
    planId: string;
    paymentMethod?: string;
    promoCode?: string;
    autoRenew?: boolean;
  }) {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/subscription/checkout`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async verifyPayment(params: {
    paymentId: string;
    providerPaymentId?: string;
    providerSignature?: string;
    simulateFailure?: boolean;
    failureReason?: string;
  }) {
    return fetchJson<{
      success: boolean;
      data?: { subscription: any; current: any };
      error?: string;
      message?: string;
    }>(
      `${API_BASE}/subscription/verify`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  },

  async cancelAutoRenew() {
    return fetchJson<{ success: boolean; data: { success: boolean; message: string } }>(
      `${API_BASE}/subscription/cancel-autorenew`,
      { method: 'POST' }
    );
  },

  async validatePromo(code: string, planId?: string) {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/subscription/apply-promo`, {
      method: 'POST',
      body: JSON.stringify({ code, planId }),
    });
  },

  async recordAiUsage(credits: number = 1) {
    return fetchJson<{ success: boolean; data: { used: number; remaining: number } }>(
      `${API_BASE}/subscription/record-ai-usage`,
      {
        method: 'POST',
        body: JSON.stringify({ credits }),
      }
    );
  },

  async testResetToFree() {
    return fetchJson<{ success: boolean; data: any; message: string }>(
      `${API_BASE}/subscription/test-reset-free`,
      { method: 'POST' }
    );
  },

  async testSimulateExpired() {
    return fetchJson<{ success: boolean; data: any; message: string }>(
      `${API_BASE}/subscription/test-simulate-expired`,
      { method: 'POST' }
    );
  },

  // Referral
  async getReferralProfile() {
    return fetchJson<{ success: boolean; data: any }>(`${API_BASE}/subscription/referral/my`);
  },

  async simulateReferralMilestone() {
    return fetchJson<{ success: boolean; message: string; currentSub: any }>(
      `${API_BASE}/subscription/referral/test-milestone`,
      { method: 'POST' }
    );
  },

  // Admin APIs
  async getAdminPlans() {
    return fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/subscription/admin/plans`);
  },

  async updateAdminPlan(planId: string, updates: any) {
    return fetchJson<{ success: boolean; data: any }>(
      `${API_BASE}/subscription/admin/plans/${planId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
  },

  async getAdminAnalytics() {
    return fetchJson<{ success: boolean; data: any }>(
      `${API_BASE}/subscription/admin/analytics`
    );
  },

  async grantAdminAccess(params: {
    userId?: string;
    planId: string;
    durationDays?: number;
    reason?: string;
  }) {
    return fetchJson<{ success: boolean; data: any; message: string }>(
      `${API_BASE}/subscription/admin/grant-access`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  },

  async refundAdminPayment(paymentId: string, amountInr?: number, reason?: string) {
    return fetchJson<{ success: boolean; data: any; message: string }>(
      `${API_BASE}/subscription/admin/refund`,
      {
        method: 'POST',
        body: JSON.stringify({ paymentId, amountInr, reason }),
      }
    );
  },
};

