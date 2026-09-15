import { Router, Request, Response } from 'express';
import { CurriculumService } from '../services/curriculumService';
import { UserService } from '../services/userService';
import { SubscriptionService } from '../services/subscriptionService';
import subscriptionRoutes from './subscriptionRoutes';
import {
  SubmitAttemptSchema,
  ToggleBookmarkSchema,
  CreateMistakeSchema,
  UpdateRevisionSchema,
  UpdateUserSettingsSchema,
  AddPageAnnotationSchema,
  ChapterQuerySchema,
  PageQuestionsQuerySchema,
} from '../validation/schemas';
import { requireAuth } from '../middleware/auth';

const router = Router();

// =========================================================================
// 1. CURRICULUM RELATIONSHIPS: Exam → Class → Subject → Chapter → Page → Concept → Question
// =========================================================================

/**
 * GET /api/v1/hierarchy
 * Returns the entire hierarchical structural relation from Exam to Question summaries
 */
router.get('/hierarchy', (req: Request, res: Response) => {
  try {
    const examId = req.query.examId as string | undefined;
    const hierarchy = CurriculumService.getFullHierarchy(examId);
    res.json({ success: true, data: hierarchy });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch curriculum hierarchy', details: error?.message });
  }
});

/**
 * GET /api/v1/exams
 */
router.get('/exams', (_req: Request, res: Response) => {
  try {
    const exams = CurriculumService.getAllExams();
    res.json({ success: true, data: exams });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch exams', details: error?.message });
  }
});

/**
 * GET /api/v1/subjects
 */
router.get('/subjects', (req: Request, res: Response) => {
  try {
    const classLevel = req.query.classLevel as string | undefined;
    const subjects = CurriculumService.getSubjects(classLevel);
    res.json({ success: true, data: subjects });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch subjects', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters
 */
router.get('/chapters', (req: Request, res: Response) => {
  try {
    const validated = ChapterQuerySchema.safeParse(req.query);
    if (!validated.success) {
      return res.status(400).json({ error: 'Invalid query parameters', details: validated.error.format() });
    }
    const { subjectId, classLevel } = validated.data;
    const chapters = CurriculumService.getChapters(subjectId, classLevel);
    res.json({ success: true, data: chapters });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch chapters', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters/:chapterId
 */
router.get('/chapters/:chapterId', (req: Request, res: Response) => {
  try {
    const chapter = CurriculumService.getChapterById(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ error: `Chapter '${req.params.chapterId}' not found` });
    }
    res.json({ success: true, data: chapter });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch chapter', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters/:chapterId/pages/:pageNumber
 */
router.get('/chapters/:chapterId/pages/:pageNumber', (req: Request, res: Response) => {
  try {
    const pageNum = parseInt(req.params.pageNumber, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'pageNumber must be a positive integer' });
    }
    const page = CurriculumService.getPage(req.params.chapterId, pageNum);
    if (!page) {
      return res.status(404).json({ error: `Page ${pageNum} in chapter '${req.params.chapterId}' not found` });
    }
    res.json({ success: true, data: page });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch page', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters/:chapterId/pages/:pageNumber/questions
 * QUESTION-PAGE MAPPING: Returns the questions strictly linked to this exact page.
 */
router.get('/chapters/:chapterId/pages/:pageNumber/questions', (req: Request, res: Response) => {
  try {
    const pageNum = parseInt(req.params.pageNumber, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'pageNumber must be a positive integer' });
    }

    const validated = PageQuestionsQuerySchema.safeParse(req.query);
    const examGoal = validated.success ? validated.data.examGoal : undefined;
    const filter = validated.success ? validated.data.filter : undefined;

    const questions = CurriculumService.getQuestionsForPage(
      req.params.chapterId,
      pageNum,
      examGoal,
      filter
    );

    res.json({
      success: true,
      chapterId: req.params.chapterId,
      pageNumber: pageNum,
      count: questions.length,
      data: questions,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch page questions', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters/:chapterId/academic-content
 * Returns full verified academic content for the chapter (concepts, comparison tables, examiner traps, summary)
 */
router.get('/chapters/:chapterId/academic-content', (req: Request, res: Response) => {
  try {
    const data = CurriculumService.getAcademicContentForChapter(req.params.chapterId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch chapter academic content', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters/:chapterId/pages/:pageNumber/academic-content
 * Returns page-anchored academic content (concepts, comparison tables, examiner traps)
 */
router.get('/chapters/:chapterId/pages/:pageNumber/academic-content', (req: Request, res: Response) => {
  try {
    const pageNum = parseInt(req.params.pageNumber, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'pageNumber must be a positive integer' });
    }
    const data = CurriculumService.getAcademicContentForPage(req.params.chapterId, pageNum);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch page academic content', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters/:chapterId/summary
 * Returns chapter multi-tier spaced review summaries (60s, 5m, 15m, Last-Minute Checklist)
 */
router.get('/chapters/:chapterId/summary', (req: Request, res: Response) => {
  try {
    const summary = CurriculumService.getChapterSummary(req.params.chapterId);
    if (!summary) {
      return res.status(404).json({ error: `Summary for chapter '${req.params.chapterId}' not found` });
    }
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch chapter summary', details: error?.message });
  }
});

/**
 * GET /api/v1/academic/source-matrices
 * Returns prescribed syllabus sources, authorities, and rationalized status by exam
 */
router.get('/academic/source-matrices', (req: Request, res: Response) => {
  try {
    const examId = req.query.examId as string | undefined;
    const data = CurriculumService.getSourceMatrices(examId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch source matrices', details: error?.message });
  }
});

/**
 * GET /api/v1/academic/completeness-metrics
 * Returns content completeness, faculty review percent, and verification status
 */
router.get('/academic/completeness-metrics', (req: Request, res: Response) => {
  try {
    const examId = req.query.examId as string | undefined;
    const data = CurriculumService.getCompletenessMetrics(examId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch completeness metrics', details: error?.message });
  }
});

/**
 * GET /api/v1/chapters/:chapterId/page-mappings
 * Returns question distribution across all pages in this chapter
 */
router.get('/chapters/:chapterId/page-mappings', (req: Request, res: Response) => {
  try {
    const mappings = CurriculumService.getChapterPageMappings(req.params.chapterId);
    res.json({ success: true, chapterId: req.params.chapterId, data: mappings });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch page mappings', details: error?.message });
  }
});

/**
 * GET /api/v1/questions/:questionId
 */
router.get('/questions/:questionId', (req: Request, res: Response) => {
  try {
    const question = CurriculumService.getQuestionById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ error: `Question '${req.params.questionId}' not found` });
    }
    res.json({ success: true, data: question });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch question', details: error?.message });
  }
});

/**
 * GET /api/v1/curriculum/search
 */
router.get('/curriculum/search', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    if (q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
    }
    const results = CurriculumService.searchCurriculum(q);
    res.json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ error: 'Search failed', details: error?.message });
  }
});

// =========================================================================
// 2. USER SERVICE LAYER: Attempts, Progress, Bookmarks, Mistakes, Revision
// =========================================================================

/**
 * GET /api/v1/user/progress
 * Retrieves user's complete learning state, streak, XP, answered questions, completed pages
 */
router.get('/user/progress', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const progress = UserService.getUserProgress(userId);
    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user progress', details: error?.message });
  }
});

/**
 * POST /api/v1/user/attempts
 * Records an answer attempt for a question with automatic scoring, XP and page progress
 */
router.post('/user/attempts', requireAuth, (req: Request, res: Response) => {
  try {
    const parsed = SubmitAttemptSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const userId = req.user!.id;

    // Check entitlement for practice
    const access = SubscriptionService.canAccess(userId, 'unlimited_practice');
    if (!access.allowed) {
      return res.status(403).json({
        error: "You've reached today's free practice limit (5 questions).",
        limitReached: true,
        upgradeSuggestedPlan: 'plan_student_monthly',
      });
    }

    const result = UserService.recordAttempt(userId, parsed.data);

    // Record usage for free quota
    const usage = SubscriptionService.recordPracticeUsage(userId);

    // Check if learning milestone achieved for ethical referral (completed page or 5+ solved)
    if (result.pageCompleted || usage.dailySolved >= 5) {
      try {
        SubscriptionService.processReferralMilestone(userId);
      } catch (e) {
        // non-blocking
      }
    }

    res.status(201).json({
      success: true,
      data: {
        ...result,
        practiceQuota: usage,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to record attempt', details: error?.message });
  }
});

/**
 * GET /api/v1/user/bookmarks
 */
router.get('/user/bookmarks', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookmarks = UserService.getUserBookmarks(userId);
    res.json({ success: true, data: bookmarks });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch bookmarks', details: error?.message });
  }
});

/**
 * POST /api/v1/user/bookmarks/toggle
 */
router.post('/user/bookmarks/toggle', requireAuth, (req: Request, res: Response) => {
  try {
    const parsed = ToggleBookmarkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const userId = req.user!.id;
    const result = UserService.toggleBookmark(userId, parsed.data.questionId, parsed.data.note);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to toggle bookmark', details: error?.message });
  }
});

/**
 * GET /api/v1/user/mistakes
 */
router.get('/user/mistakes', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const resolved = req.query.resolved !== undefined ? req.query.resolved === 'true' : undefined;
    const category = req.query.category as string | undefined;

    const mistakes = UserService.getUserMistakes(userId, { resolved, category });
    res.json({ success: true, data: mistakes });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch mistakes', details: error?.message });
  }
});

/**
 * POST /api/v1/user/mistakes
 */
router.post('/user/mistakes', requireAuth, (req: Request, res: Response) => {
  try {
    const parsed = CreateMistakeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const userId = req.user!.id;
    const mistake = UserService.addMistake(userId, parsed.data);
    res.status(201).json({ success: true, data: mistake });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to record mistake', details: error?.message });
  }
});

/**
 * PATCH /api/v1/user/mistakes/:id/resolve
 */
router.patch('/user/mistakes/:id/resolve', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = UserService.resolveMistake(userId, req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ error: 'Failed to resolve mistake', details: error?.message });
  }
});

/**
 * GET /api/v1/user/revision
 */
router.get('/user/revision', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const status = req.query.status as string | undefined;
    const items = UserService.getUserRevisionItems(userId, status);
    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch revision items', details: error?.message });
  }
});

/**
 * PATCH /api/v1/user/revision/:id
 */
router.patch('/user/revision/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const parsed = UpdateRevisionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const userId = req.user!.id;
    const updated = UserService.updateRevisionStatus(userId, req.params.id, parsed.data.status);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(404).json({ error: 'Failed to update revision status', details: error?.message });
  }
});

/**
 * POST /api/v1/user/annotations
 */
router.post('/user/annotations', requireAuth, (req: Request, res: Response) => {
  try {
    const parsed = AddPageAnnotationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const userId = req.user!.id;
    const saved = UserService.savePageAnnotation(userId, parsed.data);
    res.status(201).json({ success: true, data: saved });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to save annotation', details: error?.message });
  }
});

/**
 * PATCH /api/v1/user/settings
 */
router.patch('/user/settings', requireAuth, (req: Request, res: Response) => {
  try {
    const parsed = UpdateUserSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const userId = req.user!.id;
    const updated = UserService.updateUserSettings(userId, parsed.data);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update settings', details: error?.message });
  }
});

// =========================================================================
// MONETIZATION, PLANS, PAYMENTS & ACCESS CONTROL
// =========================================================================
router.use('/subscription', subscriptionRoutes);

export default router;

