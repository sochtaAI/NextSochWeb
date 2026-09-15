import { z } from 'zod';

export const ExamGoalSchema = z.enum(['NEET', 'JEE_MAIN', 'JEE_ADV', 'BOARDS']);
export const ClassLevelSchema = z.enum(['11', '12']);
export const SubjectTypeSchema = z.enum(['BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'MATHEMATICS']);
export const MistakeCategorySchema = z.enum([
  'concept',
  'fact',
  'calculation',
  'confusion',
  'careless',
  'guessed'
]);

export const QuestionFilterSchema = z.enum(['all', 'unsolved', 'ncert', 'pyq', 'hard']).default('all');

export const SubmitAttemptSchema = z.object({
  questionId: z.string().min(1, 'questionId is required'),
  selectedOption: z.string().min(1, 'selectedOption is required').max(10),
  timeSpentSec: z.number().int().min(0).default(0),
});

export const ToggleBookmarkSchema = z.object({
  questionId: z.string().min(1, 'questionId is required'),
  note: z.string().max(500).optional(),
});

export const CreateMistakeSchema = z.object({
  questionId: z.string().min(1, 'questionId is required'),
  selectedOption: z.string().min(1, 'selectedOption is required').max(10),
  category: MistakeCategorySchema,
  userNote: z.string().max(500).optional(),
});

export const UpdateRevisionSchema = z.object({
  status: z.enum(['retained', 'mastered']),
});

export const UpdateUserPageProgressSchema = z.object({
  chapterId: z.string().min(1, 'chapterId is required'),
  pageNumber: z.number().int().positive('pageNumber must be a positive integer'),
  isCompleted: z.boolean(),
});

export const UpdateUserSettingsSchema = z.object({
  selectedExam: ExamGoalSchema.optional(),
  selectedClass: ClassLevelSchema.optional(),
  studyMood: z.string().max(100).optional(),
  name: z.string().min(1).max(100).optional(),
});

export const AddPageAnnotationSchema = z.object({
  chapterId: z.string().min(1, 'chapterId is required'),
  pageNumber: z.number().int().positive('pageNumber must be a positive integer'),
  type: z.enum(['note', 'highlight']),
  content: z.string().min(1).max(2000),
});

export const PageQuestionsQuerySchema = z.object({
  examGoal: ExamGoalSchema.optional(),
  filter: QuestionFilterSchema.optional(),
});

export const ChapterQuerySchema = z.object({
  subjectId: SubjectTypeSchema.optional(),
  classLevel: ClassLevelSchema.optional(),
  examGoal: ExamGoalSchema.optional(),
});
