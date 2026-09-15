import { getDatabase } from '../db/database';

export class UserService {
  /**
   * Records a user's answer attempt for a question.
   * Calculates correctness and XP, persists attempt, updates user stats,
   * and automatically verifies whether the entire page has been completed.
   */
  static recordAttempt(
    userId: string,
    data: { questionId: string; selectedOption: string; timeSpentSec?: number }
  ) {
    const db = getDatabase();

    // 1. Fetch question
    const question = db
      .prepare('SELECT id, chapter_id, page_number, correct_answer FROM questions WHERE id = ?')
      .get(data.questionId) as any;

    if (!question) {
      throw new Error(`Question with id '${data.questionId}' not found`);
    }

    const isCorrect = question.correct_answer === data.selectedOption;
    const xpEarned = isCorrect ? 15 : 2;
    const now = Date.now();
    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 2. Insert attempt
    db.prepare(`
      INSERT INTO user_attempts (
        id, user_id, question_id, chapter_id, page_number, selected_option, is_correct, xp_earned, time_spent_sec, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      attemptId,
      userId,
      question.id,
      question.chapter_id,
      question.page_number,
      data.selectedOption,
      isCorrect ? 1 : 0,
      xpEarned,
      data.timeSpentSec || 0,
      now
    );

    // 3. Increment User XP
    db.prepare(`
      UPDATE users SET total_xp = total_xp + ?, updated_at = ? WHERE id = ?
    `).run(xpEarned, now, userId);

    // 4. Verify if all questions on this page are now answered by the user
    const totalPageQuestions = db
      .prepare('SELECT COUNT(*) as count FROM question_page_mappings WHERE chapter_id = ? AND page_number = ?')
      .get(question.chapter_id, question.page_number) as { count: number };

    const distinctAnsweredOnPage = db
      .prepare(`
        SELECT COUNT(DISTINCT question_id) as count FROM user_attempts
        WHERE user_id = ? AND chapter_id = ? AND page_number = ?
      `)
      .get(userId, question.chapter_id, question.page_number) as { count: number };

    let pageCompleted = false;
    if (
      totalPageQuestions &&
      distinctAnsweredOnPage &&
      totalPageQuestions.count > 0 &&
      distinctAnsweredOnPage.count >= totalPageQuestions.count
    ) {
      pageCompleted = true;
      const progressId = `prog-${userId}-${question.chapter_id}-${question.page_number}`;
      db.prepare(`
        INSERT INTO user_page_progress (id, user_id, chapter_id, page_number, is_completed, completed_at, updated_at)
        VALUES (?, ?, ?, ?, 1, ?, ?)
        ON CONFLICT(user_id, chapter_id, page_number) DO UPDATE SET
          is_completed = 1,
          completed_at = COALESCE(completed_at, excluded.completed_at),
          updated_at = excluded.updated_at
      `).run(progressId, userId, question.chapter_id, question.page_number, now, now);
    }

    const updatedUser = db.prepare('SELECT total_xp, streak_days FROM users WHERE id = ?').get(userId) as any;

    return {
      attemptId,
      questionId: question.id,
      chapterId: question.chapter_id,
      pageNumber: question.page_number,
      selectedOption: data.selectedOption,
      correctAnswer: question.correct_answer,
      isCorrect,
      xpEarned,
      pageCompleted,
      totalXP: updatedUser?.total_xp || 0,
      streakDays: updatedUser?.streak_days || 1,
    };
  }

  /**
   * Retrieves comprehensive progress state for a user.
   */
  static getUserProgress(userId: string) {
    const db = getDatabase();

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!user) {
      throw new Error(`User '${userId}' not found`);
    }

    // Completed pages map: { chapterId: pageNumber[] }
    const completedPageRows = db
      .prepare('SELECT chapter_id, page_number FROM user_page_progress WHERE user_id = ? AND is_completed = 1')
      .all(userId) as any[];

    const completedPages: Record<string, number[]> = {};
    for (const row of completedPageRows) {
      if (!completedPages[row.chapter_id]) {
        completedPages[row.chapter_id] = [];
      }
      if (!completedPages[row.chapter_id].includes(row.page_number)) {
        completedPages[row.chapter_id].push(row.page_number);
      }
    }

    // Latest user attempts (keyed by questionId)
    const attemptRows = db
      .prepare(`
        SELECT question_id, selected_option, is_correct, MAX(created_at) as created_at
        FROM user_attempts
        WHERE user_id = ?
        GROUP BY question_id
      `)
      .all(userId) as any[];

    const answeredQuestions: Record<string, { selected: string; isCorrect: boolean; timestamp: number }> = {};
    for (const att of attemptRows) {
      answeredQuestions[att.question_id] = {
        selected: att.selected_option,
        isCorrect: !!att.is_correct,
        timestamp: att.created_at,
      };
    }

    // Bookmarks
    const bookmarkRows = db
      .prepare('SELECT question_id FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as any[];
    const bookmarks = bookmarkRows.map(b => b.question_id);

    // Mistakes
    const mistakes = this.getUserMistakes(userId);

    // Revision items
    const revisionQueue = this.getUserRevisionItems(userId);

    // Annotations (notes & highlights)
    const annotations = db
      .prepare('SELECT chapter_id, page_number, type, content FROM page_annotations WHERE user_id = ?')
      .all(userId) as any[];

    const pageNotes: Record<string, string[]> = {};
    const pageHighlights: Record<string, string[]> = {};

    for (const ann of annotations) {
      const key = `${ann.chapter_id}_${ann.page_number}`;
      if (ann.type === 'note') {
        pageNotes[key] = [...(pageNotes[key] || []), ann.content];
      } else {
        pageHighlights[key] = [...(pageHighlights[key] || []), ann.content];
      }
    }

    return {
      selectedExam: user.selected_exam,
      selectedClass: user.selected_class,
      streakDays: user.streak_days,
      lastActiveDate: new Date(user.updated_at).toISOString().split('T')[0],
      totalXP: user.total_xp,
      studyMood: user.study_mood || 'In the zone 🎯',
      personality: 'The Consistent One',
      lastStudied: {
        subjectId: 'BIOLOGY',
        chapterId: 'bio-11-cell',
        pageNumber: 1,
      },
      completedPages,
      answeredQuestions,
      bookmarks,
      mistakes,
      revisionQueue,
      pageNotes,
      pageHighlights,
    };
  }

  /**
   * Toggles bookmark state for a question
   */
  static toggleBookmark(userId: string, questionId: string, note?: string) {
    const db = getDatabase();

    const existing = db
      .prepare('SELECT id FROM bookmarks WHERE user_id = ? AND question_id = ?')
      .get(userId, questionId) as any;

    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?').run(userId, questionId);
      return { isBookmarked: false, questionId };
    }

    const question = db
      .prepare('SELECT chapter_id, page_number FROM questions WHERE id = ?')
      .get(questionId) as any;

    const id = `bm-${Date.now()}`;
    db.prepare(`
      INSERT INTO bookmarks (id, user_id, question_id, chapter_id, page_number, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      questionId,
      question?.chapter_id || 'general',
      question?.page_number || 1,
      note || null,
      Date.now()
    );

    return { isBookmarked: true, questionId };
  }

  /**
   * Retrieves list of user bookmarks with question context
   */
  static getUserBookmarks(userId: string) {
    const db = getDatabase();
    return db
      .prepare(`
        SELECT b.id as bookmark_id, b.created_at, b.note, q.*
        FROM bookmarks b
        JOIN questions q ON b.question_id = q.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
      `)
      .all(userId) as any[];
  }

  /**
   * Adds or updates an entry in the Mistake Notebook
   */
  static addMistake(
    userId: string,
    data: { questionId: string; selectedOption: string; category: string; userNote?: string }
  ) {
    const db = getDatabase();

    const question = db
      .prepare('SELECT id, chapter_id, page_number, correct_answer FROM questions WHERE id = ?')
      .get(data.questionId) as any;

    if (!question) {
      throw new Error(`Question '${data.questionId}' not found`);
    }

    const now = Date.now();
    const id = `mistake-${Date.now()}`;

    // Insert or replace mistake
    db.prepare(`
      INSERT INTO mistakes (
        id, user_id, question_id, chapter_id, page_number, selected_option, correct_option, category, user_note, resolved, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(
      id,
      userId,
      question.id,
      question.chapter_id,
      question.page_number,
      data.selectedOption,
      question.correct_answer,
      data.category,
      data.userNote || null,
      now,
      now
    );

    // Automatically enqueue into Spaced Repetition engine
    const revId = `rev-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO revision_items (
        id, user_id, question_id, chapter_id, page_number, due_date, interval_days, repetitions, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, 0, 'due', ?, ?)
      ON CONFLICT(user_id, question_id) DO UPDATE SET
        status = 'due',
        updated_at = excluded.updated_at
    `).run(revId, userId, question.id, question.chapter_id, question.page_number, today, now, now);

    return {
      id,
      questionId: question.id,
      chapterId: question.chapter_id,
      pageNumber: question.page_number,
      selectedOption: data.selectedOption,
      correctOption: question.correct_answer,
      category: data.category,
      userNote: data.userNote,
      resolved: false,
      timestamp: now,
    };
  }

  /**
   * Marks a mistake as resolved
   */
  static resolveMistake(userId: string, mistakeId: string) {
    const db = getDatabase();
    const now = Date.now();

    const result = db
      .prepare(`
        UPDATE mistakes
        SET resolved = 1, resolved_at = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
      `)
      .run(now, now, mistakeId, userId);

    if (result.changes === 0) {
      throw new Error(`Mistake '${mistakeId}' not found or not owned by user`);
    }

    return { id: mistakeId, resolved: true, resolvedAt: now };
  }

  /**
   * Retrieves all mistakes for a user
   */
  static getUserMistakes(userId: string, filter?: { resolved?: boolean; category?: string }) {
    const db = getDatabase();
    let query = 'SELECT * FROM mistakes WHERE user_id = ?';
    const params: any[] = [userId];

    if (filter?.resolved !== undefined) {
      query += ' AND resolved = ?';
      params.push(filter.resolved ? 1 : 0);
    }
    if (filter?.category) {
      query += ' AND category = ?';
      params.push(filter.category);
    }
    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      questionId: r.question_id,
      chapterId: r.chapter_id,
      pageNumber: r.page_number,
      selectedOption: r.selected_option,
      correctOption: r.correct_option,
      category: r.category,
      userNote: r.user_note,
      timestamp: r.created_at,
      resolved: !!r.resolved,
    }));
  }

  /**
   * Retrieves Spaced Repetition items
   */
  static getUserRevisionItems(userId: string, status?: string) {
    const db = getDatabase();
    let query = 'SELECT * FROM revision_items WHERE user_id = ?';
    const params: any[] = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY due_date ASC, created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      questionId: r.question_id,
      chapterId: r.chapter_id,
      pageNumber: r.page_number,
      dueDate: r.due_date,
      intervalDays: r.interval_days,
      repetitions: r.repetitions,
      status: r.status,
      lastReviewed: r.last_reviewed_at || undefined,
    }));
  }

  /**
   * Updates revision item interval based on retention
   */
  static updateRevisionStatus(userId: string, revisionId: string, status: 'retained' | 'mastered') {
    const db = getDatabase();
    const item = db
      .prepare('SELECT * FROM revision_items WHERE id = ? AND user_id = ?')
      .get(revisionId, userId) as any;

    if (!item) {
      throw new Error(`Revision item '${revisionId}' not found or not owned by user`);
    }

    const now = Date.now();
    const nextInterval = status === 'mastered' ? item.interval_days * 3 : item.interval_days * 2;
    const nextDueDate = new Date(now + nextInterval * 86400000).toISOString().split('T')[0];

    db.prepare(`
      UPDATE revision_items
      SET status = ?, interval_days = ?, repetitions = repetitions + 1, due_date = ?, last_reviewed_at = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(status, nextInterval, nextDueDate, now, now, revisionId, userId);

    return {
      id: revisionId,
      status,
      intervalDays: nextInterval,
      repetitions: item.repetitions + 1,
      dueDate: nextDueDate,
      lastReviewed: now,
    };
  }

  /**
   * Saves a note or highlight annotation on a page
   */
  static savePageAnnotation(
    userId: string,
    data: { chapterId: string; pageNumber: number; type: 'note' | 'highlight'; content: string }
  ) {
    const db = getDatabase();
    const id = `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = Date.now();

    db.prepare(`
      INSERT INTO page_annotations (id, user_id, chapter_id, page_number, type, content, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, data.chapterId, data.pageNumber, data.type, data.content, now);

    return { id, ...data, createdAt: now };
  }

  /**
   * Updates user preferences
   */
  static updateUserSettings(
    userId: string,
    data: { selectedExam?: string; selectedClass?: string; studyMood?: string; name?: string }
  ) {
    const db = getDatabase();
    const fields: string[] = [];
    const params: any[] = [];

    if (data.selectedExam) {
      fields.push('selected_exam = ?');
      params.push(data.selectedExam);
    }
    if (data.selectedClass) {
      fields.push('selected_class = ?');
      params.push(data.selectedClass);
    }
    if (data.studyMood) {
      fields.push('study_mood = ?');
      params.push(data.studyMood);
    }
    if (data.name) {
      fields.push('name = ?');
      params.push(data.name);
    }

    if (fields.length === 0) return this.getUserProgress(userId);

    fields.push('updated_at = ?');
    params.push(Date.now());
    params.push(userId);

    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    return this.getUserProgress(userId);
  }
}
