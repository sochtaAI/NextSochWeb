import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { CHAPTERS, ALL_QUESTIONS, SUBJECTS } from '../../src/data/curriculumData';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'next_soch.db');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE);
    // Enable WAL mode for concurrent performance and foreign keys for relational integrity
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    initSchema(dbInstance);
    seedInitialData(dbInstance);
    seedSubscriptionData(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    -- 1. Exams
    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL
    );

    -- 2. Classes
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      class_level TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    -- 3. Exam to Class M2M mapping
    CREATE TABLE IF NOT EXISTS exam_classes (
      exam_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      PRIMARY KEY (exam_id, class_id),
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    );

    -- 4. Subjects
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      icon_name TEXT,
      color TEXT,
      accent_color TEXT,
      created_at INTEGER NOT NULL
    );

    -- 5. Subject to Class M2M mapping
    CREATE TABLE IF NOT EXISTS subject_classes (
      subject_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      PRIMARY KEY (subject_id, class_id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    );

    -- 6. Chapters (Belongs to Subject and Class)
    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      class_level TEXT NOT NULL,
      number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      total_pages INTEGER NOT NULL DEFAULT 1,
      weightage TEXT,
      high_yield_exams_json TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    -- 7. Pages (Belongs to Chapter)
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      subheading TEXT,
      source_reference TEXT,
      topics_json TEXT,
      sections_json TEXT,
      summary_points_json TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
      UNIQUE (chapter_id, page_number)
    );

    -- 8. Concepts (Mapped to Chapter and specific Page)
    CREATE TABLE IF NOT EXISTS concepts (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      name TEXT NOT NULL,
      high_yield INTEGER NOT NULL DEFAULT 0,
      exam_relevance_json TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    -- 9. Questions (Strictly linked to Chapter, Page, and Concept)
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      class_level TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      concept_id TEXT,
      concept_name TEXT,
      section_title TEXT,
      exam_goals_json TEXT NOT NULL,
      question_type TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      question_text TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      source_reference TEXT NOT NULL,
      source_snippet TEXT,
      source_anchor_id TEXT,
      is_pyq INTEGER NOT NULL DEFAULT 0,
      pyq_year TEXT,
      pyq_exam TEXT,
      tags_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    -- 10. Question-to-Page Mappings
    CREATE TABLE IF NOT EXISTS question_page_mappings (
      question_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (question_id, chapter_id, page_number),
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    -- 11. Users
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      selected_exam TEXT NOT NULL DEFAULT 'NEET',
      selected_class TEXT NOT NULL DEFAULT '11',
      total_xp INTEGER NOT NULL DEFAULT 0,
      streak_days INTEGER NOT NULL DEFAULT 1,
      study_mood TEXT DEFAULT 'In the zone 🎯',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- 12. User Attempts
    CREATE TABLE IF NOT EXISTS user_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      selected_option TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      xp_earned INTEGER NOT NULL DEFAULT 0,
      time_spent_sec INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    -- 13. User Page Progress
    CREATE TABLE IF NOT EXISTS user_page_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0,
      completed_at INTEGER,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
      UNIQUE (user_id, chapter_id, page_number)
    );

    -- 14. Bookmarks
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE (user_id, question_id)
    );

    -- 15. Mistakes (Mistake Notebook)
    CREATE TABLE IF NOT EXISTS mistakes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      selected_option TEXT NOT NULL,
      correct_option TEXT NOT NULL,
      category TEXT NOT NULL,
      user_note TEXT,
      resolved INTEGER NOT NULL DEFAULT 0,
      resolved_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    -- 16. Revision Items (Spaced Repetition Engine)
    CREATE TABLE IF NOT EXISTS revision_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      due_date TEXT NOT NULL,
      interval_days INTEGER NOT NULL DEFAULT 1,
      repetitions INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'due',
      last_reviewed_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE (user_id, question_id)
    );

    -- 17. Page Notes and Highlights
    CREATE TABLE IF NOT EXISTS page_annotations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'note' or 'highlight'
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    -- 18. Monetization & Subscription Plans
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'free', 'pass', 'recurring_monthly', 'recurring_term'
      duration_days INTEGER NOT NULL, -- 0 for free, 1, 3, 7, 30, 90, 180, 365
      price_inr INTEGER NOT NULL,
      billing_cycle TEXT NOT NULL, -- 'free', 'one_time', 'monthly', '3_months', '6_months', 'yearly'
      badge TEXT,
      description TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      ai_credits_monthly INTEGER NOT NULL DEFAULT 0,
      features_json TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- 19. Feature Entitlements (Decoupled Access Control Engine)
    CREATE TABLE IF NOT EXISTS entitlements (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      feature_key TEXT NOT NULL, -- e.g. 'smart_reader', 'unlimited_practice', 'cbt', 'ai_assistant', etc.
      is_enabled INTEGER NOT NULL DEFAULT 1,
      quota_limit INTEGER DEFAULT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
      UNIQUE (plan_id, feature_key)
    );

    -- 20. User Subscriptions & Active Passes
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL, -- 'active', 'expired', 'cancelled', 'trial_expired'
      start_date INTEGER NOT NULL,
      end_date INTEGER NOT NULL,
      auto_renew INTEGER NOT NULL DEFAULT 0,
      provider TEXT NOT NULL DEFAULT 'mock',
      provider_subscription_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );

    -- 21. Payments & Transactions (Abstraction Layer)
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subscription_id TEXT,
      plan_id TEXT NOT NULL,
      amount_inr INTEGER NOT NULL,
      status TEXT NOT NULL, -- 'created', 'captured', 'failed', 'refunded'
      payment_method TEXT, -- 'upi', 'card', 'netbanking', 'wallet', 'promo'
      provider TEXT NOT NULL DEFAULT 'mock',
      provider_payment_id TEXT,
      provider_order_id TEXT,
      failure_reason TEXT,
      refund_amount_inr INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );

    -- 22. Payment Events (Audit Log / Webhook Ledger)
    CREATE TABLE IF NOT EXISTS payment_events (
      id TEXT PRIMARY KEY,
      payment_id TEXT,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    -- 23. Promotional Codes
    CREATE TABLE IF NOT EXISTS promo_codes (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_percent INTEGER DEFAULT 0,
      discount_flat_inr INTEGER DEFAULT 0,
      free_days INTEGER DEFAULT 0,
      target_plan_id TEXT,
      max_redemptions INTEGER DEFAULT 100,
      current_redemptions INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL
    );

    -- 24. SOCH CIRCLE Ethical Referrals
    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      referrer_user_id TEXT NOT NULL,
      referred_user_id TEXT,
      referral_code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_signup', -- 'pending_signup', 'registered', 'qualified', 'rewarded', 'rejected_abuse'
      learning_milestone_met INTEGER DEFAULT 0,
      ip_address TEXT,
      created_at INTEGER NOT NULL,
      qualified_at INTEGER,
      rewarded_at INTEGER,
      FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 25. Referral Rewards
    CREATE TABLE IF NOT EXISTS referral_rewards (
      id TEXT PRIMARY KEY,
      referral_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reward_type TEXT NOT NULL, -- 'pass_days', 'practice_pack', 'badge', 'ai_credits'
      reward_value TEXT NOT NULL,
      claimed INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- =================== OPTIMIZATION INDEXES ===================
    CREATE INDEX IF NOT EXISTS idx_chapters_subj_class ON chapters(subject_id, class_level);
    CREATE INDEX IF NOT EXISTS idx_pages_chap_num ON pages(chapter_id, page_number);
    CREATE INDEX IF NOT EXISTS idx_concepts_chap_page ON concepts(chapter_id, page_number);
    CREATE INDEX IF NOT EXISTS idx_questions_chap_page ON questions(chapter_id, page_number);
    CREATE INDEX IF NOT EXISTS idx_questions_concept ON questions(concept_id);
    CREATE INDEX IF NOT EXISTS idx_qpm_chap_page ON question_page_mappings(chapter_id, page_number);
    CREATE INDEX IF NOT EXISTS idx_qpm_q ON question_page_mappings(question_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_user_q ON user_attempts(user_id, question_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_user_page ON user_attempts(user_id, chapter_id, page_number);
    CREATE INDEX IF NOT EXISTS idx_progress_user_chap ON user_page_progress(user_id, chapter_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
    CREATE INDEX IF NOT EXISTS idx_mistakes_user_status ON mistakes(user_id, resolved, category);
    CREATE INDEX IF NOT EXISTS idx_revision_user_due ON revision_items(user_id, status, due_date);
    CREATE INDEX IF NOT EXISTS idx_annotations_user_page ON page_annotations(user_id, chapter_id, page_number);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_entitlements_plan ON entitlements(plan_id);
    CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
    CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
  `);

  // Safe migrations for user table columns
  try { db.exec('ALTER TABLE users ADD COLUMN daily_free_questions_solved INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE users ADD COLUMN daily_free_date TEXT;'); } catch {}
  try { db.exec('ALTER TABLE users ADD COLUMN ai_credits_used INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE users ADD COLUMN referral_code TEXT;'); } catch {}
}

function seedInitialData(db: DatabaseSync) {
  const existingExams = db.prepare('SELECT COUNT(*) as count FROM exams').get() as { count: number };
  if (existingExams && existingExams.count > 0) {
    return; // Already seeded
  }

  const now = Date.now();

  // 1. Seed Exams
  const insertExam = db.prepare('INSERT INTO exams (id, code, name, description, created_at) VALUES (?, ?, ?, ?, ?)');
  const exams = [
    { id: 'NEET', code: 'NEET', name: 'NEET (UG)', desc: 'National Eligibility cum Entrance Test for Medical' },
    { id: 'JEE_MAIN', code: 'JEE_MAIN', name: 'JEE Main', desc: 'Joint Entrance Examination for Engineering' },
    { id: 'JEE_ADV', code: 'JEE_ADV', name: 'JEE Advanced', desc: 'Premier Entrance Examination for IITs' },
    { id: 'BOARDS', code: 'BOARDS', name: 'CBSE Boards', desc: 'Class 11 & 12 Central Board of Secondary Education' },
  ];
  for (const ex of exams) {
    insertExam.run(ex.id, ex.code, ex.name, ex.desc, now);
  }

  // 2. Seed Classes
  const insertClass = db.prepare('INSERT INTO classes (id, class_level, name, created_at) VALUES (?, ?, ?, ?)');
  insertClass.run('class-11', '11', 'Class 11', now);
  insertClass.run('class-12', '12', 'Class 12', now);

  // 3. Seed ExamClasses mappings
  const insertExamClass = db.prepare('INSERT INTO exam_classes (exam_id, class_id) VALUES (?, ?)');
  for (const ex of exams) {
    insertExamClass.run(ex.id, 'class-11');
    insertExamClass.run(ex.id, 'class-12');
  }

  // 4. Seed Subjects
  const insertSubject = db.prepare(
    'INSERT INTO subjects (id, code, name, icon_name, color, accent_color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  for (const s of SUBJECTS) {
    insertSubject.run(s.id, s.id, s.name, s.iconName, s.color, s.accentColor, now);
  }

  // 5. Seed SubjectClasses mappings
  const insertSubjClass = db.prepare('INSERT INTO subject_classes (subject_id, class_id) VALUES (?, ?)');
  for (const s of SUBJECTS) {
    for (const cl of s.classLevels) {
      insertSubjClass.run(s.id, `class-${cl}`);
    }
  }

  // 6. Seed Chapters
  const insertChapter = db.prepare(`
    INSERT INTO chapters (
      id, subject_id, class_level, number, title, description, total_pages, weightage, high_yield_exams_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 7. Seed Pages
  const insertPage = db.prepare(`
    INSERT INTO pages (
      id, chapter_id, page_number, title, subheading, source_reference, topics_json, sections_json, summary_points_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 8. Seed Concepts
  const insertConcept = db.prepare(`
    INSERT INTO concepts (
      id, chapter_id, page_number, name, high_yield, exam_relevance_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const ch of CHAPTERS) {
    insertChapter.run(
      ch.id,
      ch.subjectId,
      ch.classLevel,
      ch.number,
      ch.title,
      ch.description,
      ch.totalPages,
      ch.weightage,
      JSON.stringify(ch.highYieldFor),
      now
    );

    // Seed Pages for this chapter
    for (const pg of ch.pages) {
      const pageId = `${ch.id}_${pg.pageNumber}`;
      insertPage.run(
        pageId,
        ch.id,
        pg.pageNumber,
        pg.title,
        pg.subheading || '',
        pg.sourceReference,
        JSON.stringify(pg.topics || []),
        JSON.stringify(pg.sections || []),
        JSON.stringify(pg.summaryPoints || []),
        now
      );

      // Seed Concepts from page topics
      if (pg.topics && pg.topics.length > 0) {
        for (let i = 0; i < pg.topics.length; i++) {
          const conceptId = `c_${ch.id}_p${pg.pageNumber}_${i}`;
          insertConcept.run(
            conceptId,
            ch.id,
            pg.pageNumber,
            pg.topics[i],
            1,
            JSON.stringify(ch.highYieldFor),
            now
          );
        }
      }
    }
  }

  // 9. Seed Questions & Question-Page Mappings
  const insertQuestion = db.prepare(`
    INSERT INTO questions (
      id, subject_id, class_level, chapter_id, page_number, concept_id, concept_name, section_title,
      exam_goals_json, question_type, difficulty, question_text, options_json, correct_answer,
      explanation, source_reference, source_snippet, source_anchor_id, is_pyq, pyq_year, pyq_exam, tags_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertQPM = db.prepare(`
    INSERT INTO question_page_mappings (question_id, chapter_id, page_number, created_at)
    VALUES (?, ?, ?, ?)
  `);

  for (const q of ALL_QUESTIONS) {
    const conceptId = `c_${q.chapterId}_p${q.pageNumber}_0`;
    insertQuestion.run(
      q.id,
      q.subjectId,
      q.classLevel,
      q.chapterId,
      q.pageNumber,
      conceptId,
      q.concept,
      q.section,
      JSON.stringify(q.examGoals),
      q.questionType,
      q.difficulty,
      q.questionText,
      JSON.stringify(q.options),
      q.correctAnswer,
      q.explanation,
      q.sourceReference,
      q.sourceSnippet || '',
      q.sourceAnchorId || '',
      q.isPYQ ? 1 : 0,
      q.pyqYear || null,
      q.pyqExam || null,
      JSON.stringify(q.tags),
      now
    );

    // Question-page mapping
    insertQPM.run(q.id, q.chapterId, q.pageNumber, now);
  }

  // 10. Seed Default Student User with initial progress, bookmarks, mistakes, and revision items
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, name, role, selected_exam, selected_class, total_xp, streak_days, study_mood, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertUser.run(
    'user_default',
    'student@nextsoch.ai',
    'Aarav Sharma',
    'student',
    'NEET',
    '11',
    420,
    5,
    'In the zone 🎯',
    now,
    now
  );

  // Initial attempt
  const insertAttempt = db.prepare(`
    INSERT INTO user_attempts (id, user_id, question_id, chapter_id, page_number, selected_option, is_correct, xp_earned, time_spent_sec, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAttempt.run('att-seed-1', 'user_default', 'q-cell-p1-1', 'bio-11-cell', 1, 'B', 1, 15, 25, now - 3600000);

  // Initial completed page
  const insertProgress = db.prepare(`
    INSERT INTO user_page_progress (id, user_id, chapter_id, page_number, is_completed, completed_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertProgress.run('prog-seed-1', 'user_default', 'bio-11-cell', 1, 1, now - 3600000, now - 3600000);

  // Initial bookmark
  const insertBookmark = db.prepare(`
    INSERT INTO bookmarks (id, user_id, question_id, chapter_id, page_number, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertBookmark.run('bm-seed-1', 'user_default', 'q-cell-p1-2', 'bio-11-cell', 1, 'Revise Schwann botanical research discovery', now - 86400000);

  // Initial mistake
  const insertMistake = db.prepare(`
    INSERT INTO mistakes (id, user_id, question_id, chapter_id, page_number, selected_option, correct_option, category, user_note, resolved, resolved_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertMistake.run(
    'mistake-seed-1',
    'user_default',
    'q-cell-p3-3',
    'bio-11-cell',
    3,
    'B',
    'A',
    'confusion',
    'Confused identical with interconnected in Golgi cis vs trans faces.',
    0,
    null,
    now - 86400000,
    now - 86400000
  );

  // Initial revision items
  const insertRevision = db.prepare(`
    INSERT INTO revision_items (id, user_id, question_id, chapter_id, page_number, due_date, interval_days, repetitions, status, last_reviewed_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const today = new Date().toISOString().split('T')[0];
  insertRevision.run('rev-seed-1', 'user_default', 'q-cell-p1-2', 'bio-11-cell', 1, today, 1, 1, 'due', now - 86400000, now - 86400000, now);
  insertRevision.run('rev-seed-2', 'user_default', 'q-cell-p2-2', 'bio-11-cell', 2, today, 3, 2, 'due', now - 172800000, now - 172800000, now);
}

function seedSubscriptionData(db: DatabaseSync) {
  const existingPlans = db.prepare('SELECT COUNT(*) as count FROM plans').get() as { count: number };
  if (existingPlans && existingPlans.count > 0) {
    return; // Already initialized
  }

  const now = Date.now();

  const insertPlan = db.prepare(`
    INSERT INTO plans (
      id, name, type, duration_days, price_inr, billing_cycle,
      badge, description, is_active, sort_order, ai_credits_monthly,
      features_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEntitlement = db.prepare(`
    INSERT INTO entitlements (id, plan_id, feature_key, is_enabled, quota_limit, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // 1. FREE PLAN
  insertPlan.run(
    'plan_free',
    'Free',
    'free',
    0,
    0,
    'free',
    'FOREVER FREE',
    'Genuinely useful free plan for every student with daily practice & PYQs.',
    1,
    1,
    0,
    JSON.stringify([
      '5 practice questions daily (page-linked)',
      'NCERT chapter preview & basic reader',
      'Topic PYQs & solutions',
      'Daily challenge & streak tracking',
      'Basic progress analytics',
      'Telegram bot essentials',
    ]),
    now,
    now
  );

  const freeEntitlements = [
    { key: 'daily_practice_quota', enabled: 1, limit: 5 },
    { key: 'smart_reader_basic', enabled: 1, limit: null },
    { key: 'pyqs_basic', enabled: 1, limit: null },
    { key: 'daily_challenge', enabled: 1, limit: null },
    { key: 'basic_progress', enabled: 1, limit: null },
    { key: 'telegram_basic', enabled: 1, limit: null },
  ];
  freeEntitlements.forEach((e, idx) => {
    insertEntitlement.run(`ent_free_${idx}`, 'plan_free', e.key, e.enabled, e.limit, now);
  });

  // 2. SHORT PASSES (No auto-renewal)
  // 1-Day Pass (₹9)
  insertPlan.run(
    'pass_1day',
    '1-Day Pass',
    'pass',
    1,
    9,
    'one_time',
    '24-Hour Access',
    '24-hour full-access pass. Perfect for a marathon revision session before school tests.',
    1,
    10,
    10,
    JSON.stringify([
      '24-hour full access pass',
      'Full Split-Screen Smart Reader',
      'Unlimited page-linked practice',
      'NEET & JEE examination modes',
      'Mistake Notebook & Smart Spaced Revision',
      'Advanced Chapter Analytics',
      '10 AI Study Assistant credits',
      'No automatic renewal — expires cleanly',
    ]),
    now,
    now
  );

  // 3-Day Pass (₹19)
  insertPlan.run(
    'pass_3day',
    '3-Day Pass',
    'pass',
    3,
    19,
    'one_time',
    '3-Day Access',
    '3-day full-access pass. Ideal for weekend deep dives and unit test prep.',
    1,
    11,
    25,
    JSON.stringify([
      '72-hour full access pass',
      'Full Split-Screen Smart Reader',
      'Unlimited practice & PYQ library',
      'NEET & JEE modes',
      'Mistake Notebook & Smart Revision',
      '25 AI Study Assistant credits',
      'No automatic renewal',
    ]),
    now,
    now
  );

  // 7-Day Pass (₹29)
  insertPlan.run(
    'pass_7day',
    '7-Day Pass',
    'pass',
    7,
    29,
    'one_time',
    '7-Day Access',
    '7-day full-access pass. The complete weekly sprint for chapter mastery.',
    1,
    12,
    50,
    JSON.stringify([
      '7 days full access',
      'Full Split-Screen Smart Reader',
      'Unlimited practice & custom sets',
      'NEET & JEE modes with timer',
      'Mistake Notebook & Spaced Revision',
      '50 AI Study Assistant credits',
      'No automatic renewal',
    ]),
    now,
    now
  );

  // 3. MONTHLY PLANS
  // Student Plan (₹49/month)
  insertPlan.run(
    'plan_student_monthly',
    'Student',
    'recurring_monthly',
    30,
    49,
    'monthly',
    'BEST FOR MOST STUDENTS',
    'The indispensable everyday study companion. Full NCERT source practice, unlimited questions, and spaced revision.',
    1,
    2,
    0,
    JSON.stringify([
      'Full NCERT / source split-screen reader',
      'Unlimited page-linked questions & drills',
      'Dedicated NEET & JEE exam modes',
      '10+ Years PYQ archive with detailed hints',
      'Mistake Notebook with category tracking',
      'Smart Spaced Revision schedule',
      'Complete progress & accuracy metrics',
      'Telegram sync & daily reminders',
    ]),
    now,
    now
  );

  const studentEntitlements = [
    { key: 'smart_reader', enabled: 1, limit: null },
    { key: 'unlimited_practice', enabled: 1, limit: null },
    { key: 'neet_jee_modes', enabled: 1, limit: null },
    { key: 'pyqs', enabled: 1, limit: null },
    { key: 'mistake_notebook', enabled: 1, limit: null },
    { key: 'smart_revision', enabled: 1, limit: null },
    { key: 'basic_analytics', enabled: 1, limit: null },
    { key: 'telegram_sync', enabled: 1, limit: null },
  ];
  studentEntitlements.forEach((e, idx) => {
    insertEntitlement.run(`ent_stud_${idx}`, 'plan_student_monthly', e.key, e.enabled, e.limit, now);
  });

  // Smart Plan (₹69/month)
  insertPlan.run(
    'plan_smart_monthly',
    'Smart',
    'recurring_monthly',
    30,
    69,
    'monthly',
    'COMPREHENSIVE',
    'Everything in Student plus weak-topic engine, custom drills, expanded tests, and live Soch Battles.',
    1,
    3,
    20,
    JSON.stringify([
      'Everything in Student Plan',
      'Weak-Topic Diagnosis & Recommendation Engine',
      'Custom targeted practice by sub-topic',
      'Expanded multi-chapter test series',
      'Advanced spaced repetition intervals',
      'Soch Battles 1v1 student arena',
      '20 AI Assistant queries / month',
    ]),
    now,
    now
  );

  const smartEntitlements = [
    ...studentEntitlements,
    { key: 'advanced_analytics', enabled: 1, limit: null },
    { key: 'weak_topic_engine', enabled: 1, limit: null },
    { key: 'custom_practice', enabled: 1, limit: null },
    { key: 'more_tests', enabled: 1, limit: null },
    { key: 'advanced_revision', enabled: 1, limit: null },
    { key: 'soch_battles', enabled: 1, limit: null },
    { key: 'ai_assistant', enabled: 1, limit: 20 },
  ];
  smartEntitlements.forEach((e, idx) => {
    insertEntitlement.run(`ent_smart_${idx}`, 'plan_smart_monthly', e.key, e.enabled, e.limit, now);
  });

  // Pro Plan (₹99/month)
  insertPlan.run(
    'plan_pro_monthly',
    'Pro',
    'recurring_monthly',
    30,
    99,
    'monthly',
    'BEST FOR SERIOUS PREPARATION',
    'For students targeting top ranks. Full AI Study Assistant, dynamic study plans, adaptive practice, and full CBT simulator.',
    1,
    4,
    100,
    JSON.stringify([
      'Everything in Smart Plan',
      'AI Study Assistant with 100 queries/month',
      'AI-Powered Personalized Study Plan',
      'Real-time Adaptive Practice Engine',
      'Full CBT Examination Simulator with NTA interface',
      'Predicted percentile & national rank analytics',
      'Exclusive weekly high-yield challenges',
    ]),
    now,
    now
  );

  const proEntitlements = [
    ...smartEntitlements.filter(e => e.key !== 'ai_assistant'),
    { key: 'ai_assistant', enabled: 1, limit: 100 },
    { key: 'ai_study_plan', enabled: 1, limit: null },
    { key: 'adaptive_practice', enabled: 1, limit: null },
    { key: 'cbt', enabled: 1, limit: null },
    { key: 'premium_challenges', enabled: 1, limit: null },
  ];
  proEntitlements.forEach((e, idx) => {
    insertEntitlement.run(`ent_pro_${idx}`, 'plan_pro_monthly', e.key, e.enabled, e.limit, now);
  });

  // 4. LONG-TERM PLANS
  // 3-Month Plan (₹149 / 3 months) -> ~₹49.67/mo
  insertPlan.run(
    'plan_term_3month',
    '3-Month Pass',
    'recurring_term',
    90,
    149,
    '3_months',
    '₹49.67 / mo (Save 50%)',
    '3 months of complete Pro preparation. Pay once and focus on your syllabus.',
    1,
    20,
    250,
    JSON.stringify([
      '90 days uninterrupted access',
      'All Pro tier features included',
      '250 AI Study Assistant credits',
      'Full CBT Simulator & Adaptive engine',
      'Effective cost: ₹49.67 / month',
    ]),
    now,
    now
  );
  proEntitlements.forEach((e, idx) => {
    insertEntitlement.run(`ent_term3_${idx}`, 'plan_term_3month', e.key, e.enabled, e.limit, now);
  });

  // 6-Month Plan (₹299 / 6 months) -> ~₹49.83/mo
  insertPlan.run(
    'plan_term_6month',
    '6-Month Pass',
    'recurring_term',
    180,
    299,
    '6_months',
    '₹49.83 / mo (Save 50%)',
    'Semester power pack. Covers midterm to final exam prep with zero interruptions.',
    1,
    21,
    500,
    JSON.stringify([
      '180 days uninterrupted access',
      'All Pro tier features included',
      '500 AI Study Assistant credits',
      'Full CBT Simulator & Adaptive engine',
      'Effective cost: ₹49.83 / month',
    ]),
    now,
    now
  );
  proEntitlements.forEach((e, idx) => {
    insertEntitlement.run(`ent_term6_${idx}`, 'plan_term_6month', e.key, e.enabled, e.limit, now);
  });

  // 1-Year Plan (₹499 / year) -> ~₹41.58/mo
  insertPlan.run(
    'plan_term_1year',
    '1-Year Academic Pass',
    'recurring_term',
    365,
    499,
    'yearly',
    'BEST VALUE — ~₹41.58 / mo',
    'The complete academic year companion. Less than ₹42/month for top-tier preparation.',
    1,
    22,
    1200,
    JSON.stringify([
      '365 days full academic year access',
      'All Pro tier features included',
      '1,200 AI Study Assistant credits',
      'Full CBT Simulator, Soch Battles & Adaptive drills',
      'Lowest effective price: ~₹41.58 / month (58% Savings)',
      'Unconditional 7-day satisfaction promise',
    ]),
    now,
    now
  );
  proEntitlements.forEach((e, idx) => {
    insertEntitlement.run(`ent_term1y_${idx}`, 'plan_term_1year', e.key, e.enabled, e.limit, now);
  });

  // Add pass entitlements
  ['pass_1day', 'pass_3day', 'pass_7day'].forEach(passId => {
    studentEntitlements.forEach((e, idx) => {
      insertEntitlement.run(`ent_${passId}_${idx}`, passId, e.key, e.enabled, e.limit, now);
    });
    insertEntitlement.run(`ent_${passId}_ai`, passId, 'ai_assistant', 1, passId === 'pass_1day' ? 10 : passId === 'pass_3day' ? 25 : 50, now);
    insertEntitlement.run(`ent_${passId}_cbt`, passId, 'cbt', 1, null, now);
  });

  // 5. Seed Initial Promo Codes
  const insertPromo = db.prepare(`
    INSERT INTO promo_codes (
      id, code, discount_percent, discount_flat_inr, free_days,
      target_plan_id, max_redemptions, current_redemptions, is_active, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPromo.run('promo_1', 'SOCH50', 50, 0, 0, null, 1000, 12, 1, now);
  insertPromo.run('promo_2', 'EXAMPREP', 0, 20, 0, null, 500, 4, 1, now);
  insertPromo.run('promo_3', 'FREEPASS', 100, 0, 3, 'pass_3day', 200, 1, 1, now);

  // 6. Give user_default an initial 7-day student pass so they can immediately test both active features and expirations!
  const insertSub = db.prepare(`
    INSERT INTO subscriptions (
      id, user_id, plan_id, status, start_date, end_date,
      auto_renew, provider, provider_subscription_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  // Give active 7-day pass
  insertSub.run(
    'sub_seed_default',
    'user_default',
    'pass_7day',
    'active',
    now - 86400000,
    now + (6 * 24 * 60 * 60 * 1000), // 6 days remaining
    0,
    'mock',
    'sub_seed_initial',
    now,
    now
  );

  // Record initial payment record
  const insertPay = db.prepare(`
    INSERT INTO payments (
      id, user_id, subscription_id, plan_id, amount_inr, status,
      payment_method, provider, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertPay.run(
    'pay_seed_1',
    'user_default',
    'sub_seed_default',
    'pass_7day',
    29,
    'captured',
    'upi',
    'mock',
    now - 86400000,
    now - 86400000
  );

  // Set default user referral code
  db.prepare(`
    UPDATE users
    SET referral_code = 'SOCH-AARAV-77'
    WHERE id = 'user_default'
  `).run();
}

