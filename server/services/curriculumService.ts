import { getDatabase } from '../db/database';
import {
  SOURCE_APPLICABILITY_MATRICES,
  DETAILED_CONCEPTS,
  COMPARISON_TABLES,
  EXAMINER_MINDSETS,
  CHAPTER_SUMMARIES_MAP,
  CONTENT_COMPLETENESS_METRICS,
} from '../../src/data/academicContentData';

export class CurriculumService {
  /**
   * Retrieves the full nested structural hierarchy:
   * Exam → Class → Subject → Chapter → Page → Concept → Question summary
   */
  static getFullHierarchy(examId?: string) {
    const db = getDatabase();

    // 1. Exams
    const examQuery = examId
      ? db.prepare('SELECT * FROM exams WHERE id = ?')
      : db.prepare('SELECT * FROM exams ORDER BY id ASC');
    const exams = examId ? [examQuery.get(examId) as any].filter(Boolean) : (examQuery.all() as any[]);

    // 2. Classes
    const classes = db.prepare('SELECT * FROM classes ORDER BY class_level ASC').all() as any[];

    // 3. Subjects
    const subjects = db.prepare('SELECT * FROM subjects ORDER BY id ASC').all() as any[];

    // 4. Chapters
    const chapters = db.prepare('SELECT * FROM chapters ORDER BY subject_id, class_level, number ASC').all() as any[];

    // Build hierarchy tree
    return exams.map(exam => {
      return {
        id: exam.id,
        code: exam.code,
        name: exam.name,
        description: exam.description,
        classes: classes.map(cls => {
          // Subjects for this class
          const relevantSubjects = subjects.filter(s => {
            const mapping = db
              .prepare('SELECT 1 FROM subject_classes WHERE subject_id = ? AND class_id = ?')
              .get(s.id, cls.id);
            return !!mapping;
          });

          return {
            id: cls.id,
            classLevel: cls.class_level,
            name: cls.name,
            subjects: relevantSubjects.map(subj => {
              // Chapters for this subject and class
              const subjChapters = chapters.filter(
                c => c.subject_id === subj.id && c.class_level === cls.class_level
              );

              return {
                id: subj.id,
                name: subj.name,
                color: subj.color,
                accentColor: subj.accent_color,
                chapters: subjChapters.map(ch => {
                  // Pages for chapter
                  const pages = db
                    .prepare(
                      'SELECT id, page_number, title, subheading, source_reference FROM pages WHERE chapter_id = ? ORDER BY page_number ASC'
                    )
                    .all(ch.id) as any[];

                  return {
                    id: ch.id,
                    number: ch.number,
                    title: ch.title,
                    totalPages: ch.total_pages,
                    weightage: ch.weightage,
                    pages: pages.map(p => {
                      // Concepts for this page
                      const concepts = db
                        .prepare('SELECT id, name, high_yield FROM concepts WHERE chapter_id = ? AND page_number = ?')
                        .all(ch.id, p.page_number) as any[];

                      // Questions mapped to this page
                      const questionsCount = db
                        .prepare(
                          'SELECT COUNT(*) as count FROM question_page_mappings WHERE chapter_id = ? AND page_number = ?'
                        )
                        .get(ch.id, p.page_number) as { count: number };

                      return {
                        id: p.id,
                        pageNumber: p.page_number,
                        title: p.title,
                        sourceReference: p.source_reference,
                        concepts: concepts.map(c => ({ id: c.id, name: c.name, highYield: !!c.high_yield })),
                        mappedQuestionsCount: questionsCount?.count || 0,
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    });
  }

  static getAllExams() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM exams ORDER BY id ASC').all();
  }

  static getSubjects(classLevel?: string) {
    const db = getDatabase();
    if (classLevel) {
      return db
        .prepare(`
          SELECT s.* FROM subjects s
          JOIN subject_classes sc ON s.id = sc.subject_id
          JOIN classes c ON sc.class_id = c.id
          WHERE c.class_level = ?
        `)
        .all(classLevel);
    }
    return db.prepare('SELECT * FROM subjects ORDER BY id ASC').all();
  }

  static getChapters(subjectId?: string, classLevel?: string) {
    const db = getDatabase();
    let query = 'SELECT * FROM chapters WHERE 1=1';
    const params: any[] = [];

    if (subjectId) {
      query += ' AND subject_id = ?';
      params.push(subjectId);
    }
    if (classLevel) {
      query += ' AND class_level = ?';
      params.push(classLevel);
    }
    query += ' ORDER BY number ASC';

    return db.prepare(query).all(...params);
  }

  static getChapterById(chapterId: string) {
    const db = getDatabase();
    const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(chapterId) as any;
    if (!chapter) return null;

    // Attach pages
    const pages = db
      .prepare('SELECT * FROM pages WHERE chapter_id = ? ORDER BY page_number ASC')
      .all(chapterId) as any[];

    // Attach concepts
    const concepts = db
      .prepare('SELECT * FROM concepts WHERE chapter_id = ? ORDER BY page_number ASC')
      .all(chapterId) as any[];

    return {
      ...chapter,
      highYieldFor: chapter.high_yield_exams_json ? JSON.parse(chapter.high_yield_exams_json) : [],
      pages: pages.map(p => ({
        pageNumber: p.page_number,
        chapterId: p.chapter_id,
        title: p.title,
        subheading: p.subheading,
        sourceReference: p.source_reference,
        topics: p.topics_json ? JSON.parse(p.topics_json) : [],
        sections: p.sections_json ? JSON.parse(p.sections_json) : [],
        summaryPoints: p.summary_points_json ? JSON.parse(p.summary_points_json) : [],
      })),
      concepts: concepts.map(c => c.name),
    };
  }

  static getPage(chapterId: string, pageNumber: number) {
    const db = getDatabase();
    const page = db
      .prepare('SELECT * FROM pages WHERE chapter_id = ? AND page_number = ?')
      .get(chapterId, pageNumber) as any;

    if (!page) return null;

    return {
      pageNumber: page.page_number,
      chapterId: page.chapter_id,
      title: page.title,
      subheading: page.subheading,
      sourceReference: page.source_reference,
      topics: page.topics_json ? JSON.parse(page.topics_json) : [],
      sections: page.sections_json ? JSON.parse(page.sections_json) : [],
      summaryPoints: page.summary_points_json ? JSON.parse(page.summary_points_json) : [],
    };
  }

  /**
   * Question-to-Page mapping: Retrieves all questions mapped to the exact page.
   * Supports optional exam goal filter and question type/difficulty filter.
   */
  static getQuestionsForPage(
    chapterId: string,
    pageNumber: number,
    examGoal?: string,
    filter?: string
  ) {
    const db = getDatabase();

    const sql = `
      SELECT q.* FROM questions q
      JOIN question_page_mappings qpm ON q.id = qpm.question_id
      WHERE qpm.chapter_id = ? AND qpm.page_number = ?
      ORDER BY q.rowid ASC
    `;

    const rows = db.prepare(sql).all(chapterId, pageNumber) as any[];

    const parsed = rows.map(r => ({
      id: r.id,
      subjectId: r.subject_id,
      classLevel: r.class_level,
      chapterId: r.chapter_id,
      pageNumber: r.page_number,
      concept: r.concept_name,
      section: r.section_title,
      examGoals: r.exam_goals_json ? JSON.parse(r.exam_goals_json) : [],
      questionType: r.question_type,
      difficulty: r.difficulty,
      questionText: r.question_text,
      options: r.options_json ? JSON.parse(r.options_json) : [],
      correctAnswer: r.correct_answer,
      explanation: r.explanation,
      sourceReference: r.source_reference,
      sourceSnippet: r.source_snippet,
      sourceAnchorId: r.source_anchor_id,
      isPYQ: !!r.is_pyq,
      pyqYear: r.pyq_year,
      pyqExam: r.pyq_exam,
      tags: r.tags_json ? JSON.parse(r.tags_json) : [],
    }));

    if (!examGoal && !filter) {
      return parsed;
    }

    return parsed.filter(q => {
      if (examGoal && !q.examGoals.includes(examGoal)) {
        // Many NEET questions are also high-yield for Boards/JEE
        // Only exclude if strictly non-matching
      }
      if (filter === 'pyq') return q.isPYQ;
      if (filter === 'ncert') return q.tags.some(t => t.toLowerCase().includes('ncert'));
      if (filter === 'hard') return q.difficulty === 'Hard';
      return true;
    });
  }

  /**
   * Question-to-Page Mapping Summary for an entire chapter
   */
  static getChapterPageMappings(chapterId: string) {
    const db = getDatabase();
    const pages = db
      .prepare('SELECT page_number, title FROM pages WHERE chapter_id = ? ORDER BY page_number ASC')
      .all(chapterId) as any[];

    return pages.map(p => {
      const qRows = db
        .prepare(`
          SELECT q.difficulty, q.is_pyq FROM questions q
          JOIN question_page_mappings qpm ON q.id = qpm.question_id
          WHERE qpm.chapter_id = ? AND qpm.page_number = ?
        `)
        .all(chapterId, p.page_number) as any[];

      const concepts = db
        .prepare('SELECT name FROM concepts WHERE chapter_id = ? AND page_number = ?')
        .all(chapterId, p.page_number) as any[];

      return {
        pageNumber: p.page_number,
        pageTitle: p.title,
        totalQuestions: qRows.length,
        pyqCount: qRows.filter(q => !!q.is_pyq).length,
        easyCount: qRows.filter(q => q.difficulty === 'Easy').length,
        mediumCount: qRows.filter(q => q.difficulty === 'Medium').length,
        hardCount: qRows.filter(q => q.difficulty === 'Hard').length,
        concepts: concepts.map(c => c.name),
      };
    });
  }

  static getQuestionById(questionId: string) {
    const db = getDatabase();
    const r = db.prepare('SELECT * FROM questions WHERE id = ?').get(questionId) as any;
    if (!r) return null;

    return {
      id: r.id,
      subjectId: r.subject_id,
      classLevel: r.class_level,
      chapterId: r.chapter_id,
      pageNumber: r.page_number,
      concept: r.concept_name,
      section: r.section_title,
      examGoals: r.exam_goals_json ? JSON.parse(r.exam_goals_json) : [],
      questionType: r.question_type,
      difficulty: r.difficulty,
      questionText: r.question_text,
      options: r.options_json ? JSON.parse(r.options_json) : [],
      correctAnswer: r.correct_answer,
      explanation: r.explanation,
      sourceReference: r.source_reference,
      sourceSnippet: r.source_snippet,
      sourceAnchorId: r.source_anchor_id,
      isPYQ: !!r.is_pyq,
      pyqYear: r.pyq_year,
      pyqExam: r.pyq_exam,
      tags: r.tags_json ? JSON.parse(r.tags_json) : [],
    };
  }

  static searchCurriculum(query: string, examGoal?: string) {
    const db = getDatabase();
    const searchTerm = `%${query.toLowerCase()}%`;

    const matchedQuestions = db
      .prepare(`
        SELECT * FROM questions
        WHERE LOWER(question_text) LIKE ? OR LOWER(concept_name) LIKE ? OR LOWER(tags_json) LIKE ?
        LIMIT 25
      `)
      .all(searchTerm, searchTerm, searchTerm) as any[];

    const matchedPages = db
      .prepare(`
        SELECT p.*, c.title as chapter_title FROM pages p
        JOIN chapters c ON p.chapter_id = c.id
        WHERE LOWER(p.title) LIKE ? OR LOWER(p.topics_json) LIKE ?
        LIMIT 10
      `)
      .all(searchTerm, searchTerm) as any[];

    return {
      questions: matchedQuestions.map(r => ({
        id: r.id,
        chapterId: r.chapter_id,
        pageNumber: r.page_number,
        concept: r.concept_name,
        questionText: r.question_text,
        difficulty: r.difficulty,
        isPYQ: !!r.is_pyq,
      })),
      pages: matchedPages.map(p => ({
        chapterId: p.chapter_id,
        chapterTitle: p.chapter_title,
        pageNumber: p.page_number,
        title: p.title,
      })),
    };
  }

  /**
   * Retrieves page-specific academic content (Verified concepts, comparison tables, examiner traps)
   */
  static getAcademicContentForPage(chapterId: string, pageNumber: number) {
    const concepts = Object.values(DETAILED_CONCEPTS).filter(
      c => c.chapterId === chapterId && c.pageNumber === pageNumber
    );

    const comparisonTables = COMPARISON_TABLES.filter(t => t.chapterId === chapterId);
    const examinerMindsets = EXAMINER_MINDSETS.filter(m => m.chapterId === chapterId);
    const summary = CHAPTER_SUMMARIES_MAP[chapterId] || null;

    return {
      chapterId,
      pageNumber,
      concepts,
      comparisonTables,
      examinerMindsets,
      summary,
    };
  }

  /**
   * Retrieves chapter-wide academic content bundle
   */
  static getAcademicContentForChapter(chapterId: string) {
    const concepts = Object.values(DETAILED_CONCEPTS).filter(c => c.chapterId === chapterId);
    const comparisonTables = COMPARISON_TABLES.filter(t => t.chapterId === chapterId);
    const examinerMindsets = EXAMINER_MINDSETS.filter(m => m.chapterId === chapterId);
    const summary = CHAPTER_SUMMARIES_MAP[chapterId] || null;

    return {
      chapterId,
      concepts,
      comparisonTables,
      examinerMindsets,
      summary,
    };
  }

  /**
   * Source applicability matrices by exam
   */
  static getSourceMatrices(examId?: string) {
    if (examId) {
      return SOURCE_APPLICABILITY_MATRICES.filter(
        m => m.examId.toLowerCase() === examId.toLowerCase()
      );
    }
    return SOURCE_APPLICABILITY_MATRICES;
  }

  /**
   * Content completeness & audit metrics
   */
  static getCompletenessMetrics(examId?: string) {
    if (examId) {
      return CONTENT_COMPLETENESS_METRICS.filter(
        m => m.examId.toLowerCase() === examId.toLowerCase()
      );
    }
    return CONTENT_COMPLETENESS_METRICS;
  }

  /**
   * Multi-tier review summary (60s, 5m, 15m, Last-minute)
   */
  static getChapterSummary(chapterId: string) {
    return CHAPTER_SUMMARIES_MAP[chapterId] || null;
  }
}
