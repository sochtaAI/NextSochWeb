export type ExamGoal = 'NEET' | 'JEE_MAIN' | 'JEE_ADV' | 'BOARDS' | 'CUET';

export type SubjectType = 'BIOLOGY' | 'PHYSICS' | 'CHEMISTRY' | 'MATHEMATICS';

export type ClassLevel = '11' | '12';

export type QuestionType =
  | 'single_correct'
  | 'multiple_correct'
  | 'assertion_reason'
  | 'statement_based'
  | 'match_the_following'
  | 'sequence_order'
  | 'numerical'
  | 'case_based'
  | 'fill_blank';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export type QuestionCategory = 'concept' | 'numerical' | 'diagram' | 'application';

export type ContentReviewStatus =
  | 'draft'
  | 'ai_generated'
  | 'faculty_reviewed'
  | 'verified'
  | 'published'
  | 'archived';

export type MistakeCategory =
  | 'concept'
  | 'fact'
  | 'calculation'
  | 'confusion'
  | 'careless'
  | 'guessed'
  | 'question_misread';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface DistractorAnalysis {
  [optionId: string]: string; // e.g. 'A': 'Why A is wrong...', 'C': '...'
}

export interface Question {
  id: string;
  subjectId: SubjectType;
  classLevel: ClassLevel;
  chapterId: string;
  pageNumber: number;
  concept: string;
  section: string;
  examGoals: ExamGoal[];
  questionType: QuestionType;
  questionCategory?: QuestionCategory;
  difficulty: DifficultyLevel;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string; // e.g. 'A', 'B'
  explanation: string;
  distractorAnalysis?: DistractorAnalysis;
  examAngle?: string;
  commonTrap?: string;
  sourceReference: string; // e.g. "NCERT Class 11 Biology, Ch 8, Page 126"
  sourceSnippet: string; // exact sentence or paragraph to highlight in reader
  sourceAnchorId?: string; // HTML id anchor in reader
  diagramSvg?: string; // Optional inline SVG diagram for diagram-based questions
  diagramUrl?: string;
  isPYQ: boolean;
  pyqYear?: string;
  pyqExam?: string;
  tags: string[];
  reviewStatus?: ContentReviewStatus;
}

export function getQuestionCategory(q: Question): QuestionCategory {
  if (q.questionCategory) return q.questionCategory;
  const tagsLower = (q.tags || []).map(t => t.toLowerCase());
  const textLower = (q.questionText || '').toLowerCase();

  if (
    tagsLower.some(t => t.includes('diagram') || t.includes('figure') || t.includes('graph') || t.includes('structure')) ||
    textLower.includes('diagram') ||
    textLower.includes('figure') ||
    textLower.includes('refer to the') ||
    textLower.includes('represented below') ||
    textLower.includes('shown in the') ||
    q.diagramSvg ||
    q.diagramUrl
  ) {
    return 'diagram';
  }

  if (
    q.questionType === 'numerical' ||
    tagsLower.some(t => t.includes('numerical') || t.includes('calculation') || t.includes('dimension') || t.includes('integral') || t.includes('ratio')) ||
    textLower.includes('calculate') ||
    textLower.includes('find the value') ||
    textLower.includes('find the change in') ||
    textLower.includes('percentage of') ||
    textLower.includes('µm') ||
    textLower.includes('joules')
  ) {
    return 'numerical';
  }

  return 'concept';
}

export interface TextbookSection {
  id: string;
  title: string;
  content: string[];
  keyTerms?: string[];
  ncertHighlight?: string;
  figureUrl?: string;
  figureCaption?: string;
  formulaBox?: string;
}

export interface PageData {
  pageNumber: number;
  chapterId: string;
  title: string;
  subheading: string;
  topics: string[];
  sourceReference: string;
  sections: TextbookSection[];
  summaryPoints: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subjectId: SubjectType;
  classLevel: ClassLevel;
  description: string;
  totalPages: number;
  pages: PageData[];
  concepts: string[];
  highYieldFor: ExamGoal[];
  weightage: string; // e.g. "8-10% in NEET"
}

export interface Subject {
  id: SubjectType;
  name: string;
  iconName: string;
  color: string;
  accentColor: string;
  classLevels: ClassLevel[];
  chaptersCount: number;
  questionsCount: number;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  chapterId: string;
  pageNumber: number;
  selectedOption: string;
  correctOption: string;
  category: MistakeCategory;
  userNote?: string;
  timestamp: number;
  resolved: boolean;
}

export interface RevisionItem {
  id: string;
  questionId: string;
  chapterId: string;
  pageNumber: number;
  dueDate: string; // ISO date
  intervalDays: number;
  repetitions: number;
  status: 'due' | 'retained' | 'mastered';
  lastReviewed?: number;
}

export interface CBTTestQuestion {
  question: Question;
  selectedAnswer?: string;
  status: 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked';
}

export interface CBTTest {
  id: string;
  title: string;
  exam: ExamGoal;
  durationMinutes: number;
  totalMarks: number;
  subjects: {
    subject: SubjectType;
    questionsCount: number;
    marksPerCorrect: number;
    negativeMarks: number;
  }[];
  questions: Question[];
}

export interface UserProgress {
  selectedExam: ExamGoal;
  selectedClass: ClassLevel;
  streakDays: number;
  lastActiveDate: string;
  totalXP: number;
  lastStudied: {
    subjectId: SubjectType;
    chapterId: string;
    pageNumber: number;
  };
  completedPages: Record<string, number[]>; // chapterId -> pageNumbers
  answeredQuestions: Record<string, { selected: string; isCorrect: boolean; timestamp: number }>;
  bookmarks: string[]; // questionIds or page keys
  pageNotes: Record<string, string[]>; // chapterId_pageNumber -> array of notes
  pageHighlights: Record<string, string[]>; // chapterId_pageNumber -> array of highlighted text
  mistakes: MistakeRecord[];
  revisionQueue: RevisionItem[];
  studyMood: string;
  personality: string;
}

// =========================================================================
// MONETIZATION, SUBSCRIPTIONS & ENTITLEMENTS
// =========================================================================

export type PlanBillingCycle = 'free' | 'one_time' | 'monthly' | '3_months' | '6_months' | 'yearly';
export type PlanType = 'free' | 'pass' | 'recurring_monthly' | 'recurring_term';

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  duration_days: number;
  price_inr: number;
  billing_cycle: PlanBillingCycle;
  badge: string | null;
  description: string | null;
  is_active: number;
  sort_order: number;
  ai_credits_monthly: number;
  features: string[];
}

export interface EntitlementStatus {
  isEnabled: boolean;
  quotaLimit: number | null;
}

export interface UserSubscriptionInfo {
  subscriptionId: string | null;
  planId: string;
  planName: string;
  planType: string;
  priceInr: number;
  billingCycle: string;
  status: 'active' | 'free' | 'trial_expired' | 'expired' | 'cancelled';
  badge: string | null;
  startDate: number | null;
  endDate: number | null;
  autoRenew: boolean;
  isPass: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialExpiredBanner: boolean;
  entitlements: Record<string, EntitlementStatus>;
  aiCredits: {
    used: number;
    total: number;
    remaining: number;
  };
  dailyPractice: {
    solvedToday: number;
    dailyLimit: number;
    remainingToday: number;
    isLimitReached: boolean;
  };
}

export interface CheckoutSessionData {
  paymentId: string;
  orderId: string;
  amountInr: number;
  currency: string;
  planId: string;
  planName: string;
  paymentMethod: string;
  provider: string;
  keyId?: string;
  discountAppliedInr: number;
  finalAmountInr: number;
  mockMode: boolean;
}

export interface ReferralProfile {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  qualifiedReferrals: number;
  rewardsEarnedCount: number;
  referralsList: {
    id: string;
    referredName: string;
    status: string;
    milestoneMet: boolean;
    date: number;
  }[];
  rewardsList: {
    id: string;
    reward_type: string;
    reward_value: string;
    created_at: number;
  }[];
}

// =========================================================================
// ACADEMIC CONTENT ENGINE TYPES (Source → Chapter → Topic → Concept)
// =========================================================================

export interface ConceptExplanation {
  what: string;
  why: string;
  how: string;
  where: string;
  examAngle: string;
  confusionAlert: string;
}

export interface ConceptPrerequisite {
  id: string;
  name: string;
  chapterTitle: string;
  description: string;
}

export interface ConceptMisconception {
  myth: string;
  reality: string;
  examinerTrap: string;
}

export interface ConceptFormula {
  name: string;
  expression: string;
  variables: string;
  conditions: string;
  commonTrap?: string;
}

export interface ConceptDetail {
  id: string;
  name: string;
  chapterId: string;
  pageNumber: number;
  sectionTitle: string;
  shortDefinition: string;
  coreExplanation: ConceptExplanation;
  whyItMatters: string;
  prerequisites: ConceptPrerequisite[];
  keyFacts: string[];
  formulae?: ConceptFormula[];
  examples: string[];
  visualSvg?: string;
  misconceptions: ConceptMisconception[];
  examTraps: string[];
  sourceReference: string;
  pyqConnection?: string;
  relatedConcepts: { id: string; name: string; chapterTitle: string }[];
  reviewStatus: ContentReviewStatus;
}

export interface ComparisonTableRow {
  parameter: string;
  valueA: string;
  valueB: string;
  examNote?: string;
}

export interface ComparisonTable {
  id: string;
  chapterId: string;
  title: string;
  conceptA: string;
  conceptB: string;
  rows: ComparisonTableRow[];
}

export interface ExaminerMindset {
  id: string;
  chapterId: string;
  topic: string;
  howTested: string;
  obviousTrap: string;
  misconceptionTargeted: string;
  conditionChangeImpact: string;
  overlookedDetail: string;
}

export interface ChapterSummaryData {
  quick60s: string[];
  review5m: { heading: string; points: string[] }[];
  highYield15m: { topic: string; summary: string; ncertMustRemember: string }[];
  lastMinuteChecklist: { id: string; label: string; tag: 'concept' | 'formula' | 'exception' | 'pyq' }[];
}

export interface ChapterMasteryScore {
  understanding: number; // 0-100
  practice: number;      // 0-100
  accuracy: number;      // 0-100
  retention: number;     // 0-100
  application: number;   // 0-100
  confidence: number;    // 0-100
  overallScore: number;  // 0-100
  attemptsCount: number;
  masteryLevel: 'Novice' | 'Developing' | 'Proficient' | 'Mastered';
}

export interface SourceApplicabilityMatrix {
  examId: ExamGoal;
  examName: string;
  authority: string; // e.g. 'NMC', 'NTA', 'CBSE'
  syllabusVersion: string; // e.g. 'NEET 2025-2026 Revised'
  applicableSubjects: {
    subjectId: SubjectType;
    subjectName: string;
    prescribedSources: string[];
    role: 'primary_ncert' | 'reference_problem_bank' | 'syllabus_framework';
    rationalizedStatus: string;
    weightage: string;
  }[];
}

export interface ContentCompletenessMetric {
  examId: ExamGoal;
  subjectId: SubjectType;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  totalPages: number;
  sourceMappedPercent: number;
  topicsMappedPercent: number;
  conceptsMappedPercent: number;
  questionsCount: number;
  facultyReviewedPercent: number;
  isPublished: boolean;
  status: 'fully_available' | 'review_pending' | 'coming_soon';
}

// =========================================================================
// GOOGLE DRIVE & GOOGLE PICKER INTEGRATION TYPES
// =========================================================================

export interface PickedGoogleDriveFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  iconUrl?: string;
  sizeBytes?: number;
  lastEditedUtc?: number;
  description?: string;
  chapterId?: string; // Optional chapter mapping in NEXT SOCH
  chapterTitle?: string;
  pickedAt: string;
}



