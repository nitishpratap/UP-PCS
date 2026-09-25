const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {}

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const { parseQuestionsFromMarkdown, syncChapterQuestions, syncAllQuestions } = require('./question_parser');

// Load .env from root or current folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to ./tracker-server/.env if any

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin";
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'admin';
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || 'uppcs2026';

app.use(cors());
app.use(express.json());

let db = null;
let client = null;
let connectionStatus = {
  connected: false,
  message: 'Initializing...',
  uriConfigured: Boolean(MONGODB_URI)
};

// Spaced Repetition Days Interval Schedule
const REVISION_INTERVALS_DAYS = [1, 3, 7, 21, 30, 45, 60];

function calculateNextDueDate(lastDate, revisionNumber) {
  const base = new Date(lastDate || Date.now());
  const index = Math.min(revisionNumber - 1, REVISION_INTERVALS_DAYS.length - 1);
  const daysToAdd = REVISION_INTERVALS_DAYS[Math.max(0, index)];
  const nextDate = new Date(base.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return nextDate;
}

async function connectToMongo() {
  if (!MONGODB_URI || MONGODB_URI.trim() === '') {
    connectionStatus = {
      connected: false,
      message: 'MONGODB_URI not found in .env. Please set MONGODB_URI in your .env file.',
      uriConfigured: false
    };
    console.warn('[MongoDB] ' + connectionStatus.message);
    return;
  }

  try {
    console.log('[MongoDB] Connecting to MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    // Default database name if not specified in URI
    db = client.db('uppcs_study_tracker');
    connectionStatus = {
      connected: true,
      message: 'Connected to MongoDB Atlas successfully!',
      uriConfigured: true,
      database: db.databaseName
    };
    console.log(`[MongoDB] Connected! Using database: ${db.databaseName}`);

    // Create helpful indexes
    await db.collection('revisions').createIndex({ subject: 1, topic: 1 });
    await db.collection('revisions').createIndex({ next_revision_due: 1 });
    await db.collection('pyqs').createIndex({ subject: 1, topic: 1 });
    await db.collection('tests').createIndex({ date: -1 });
    await db.collection('questions').createIndex({ q_id: 1 }, { unique: true });
    await db.collection('questions').createIndex({ subject: 1, chapter: 1 });
    await db.collection('daily_planner').createIndex({ date: 1 }, { unique: true });

    // Initialize Auto-Sync File Watcher
    setupFileWatcher();
  } catch (err) {
    connectionStatus = {
      connected: false,
      message: `Failed to connect: ${err.message}`,
      uriConfigured: true
    };
    console.error('[MongoDB Error]', err);
  }
}

// Middleware to ensure DB connection is ready
function checkDb(req, res, next) {
  if (!db) {
    return res.status(503).json({
      error: 'Database not connected',
      status: connectionStatus
    });
  }
  next();
}

// ------------------- BASIC AUTH & AUTO-SYNC HELPERS ------------------- //

function verifyBasicAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;
  try {
    const b64 = authHeader.split(' ')[1];
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    const colonIdx = decoded.indexOf(':');
    if (colonIdx === -1) return false;
    const u = decoded.substring(0, colonIdx);
    const p = decoded.substring(colonIdx + 1);
    return u === BASIC_AUTH_USER && p === BASIC_AUTH_PASS;
  } catch {
    return false;
  }
}

function requireBasicAuth(req, res, next) {
  if (req.method === 'OPTIONS') return next();
  // Allow health check status without auth
  if (req.path === '/status' || req.originalUrl === '/api/status') return next();

  if (verifyBasicAuthHeader(req.headers.authorization)) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="UP-PCS Study Vault", charset="UTF-8"');
  return res.status(401).json({
    error: 'Unauthorized',
    message: 'Basic authentication required to access this study library and test engine.'
  });
}

// Search disk for chapter markdown file and sync into MongoDB on-demand
async function findAndSyncChapterFile(dbInstance, subject, targetTopic) {
  const subjectsDir = path.resolve(__dirname, '../docs/subjects');
  if (!fs.existsSync(subjectsDir)) return null;

  const normSubject = subject.toLowerCase().trim();
  const subDirs = fs.readdirSync(subjectsDir).filter(d => {
    const p = path.join(subjectsDir, d);
    return fs.statSync(p).isDirectory() && d.toLowerCase().trim() === normSubject;
  });

  const subjectDirName = subDirs.length > 0 ? subDirs[0] : subject;
  const targetDir = path.join(subjectsDir, subjectDirName);
  if (!fs.existsSync(targetDir)) return null;

  function cleanString(str) {
    return (str || '')
      .toLowerCase()
      .replace(/^topic\s*\d+\s*[-–—:]*\s*/i, '')
      .replace(/^[0-9\.\s\-_]+/, '')
      .replace(/[-_ ]/g, '');
  }

  const cleanTarget = cleanString(targetTopic);

  function searchFile(dir) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        const found = searchFile(full);
        if (found) return found;
      } else if (entry.endsWith('.md') && !entry.endsWith('index.md') && !entry.endsWith('prompt.md')) {
        const slug = entry.replace(/\.md$/, '');
        const cleanSlug = cleanString(slug);
        const relPath = path.relative(targetDir, full).replace(/\\/g, '/').replace(/\.md$/, '');
        const cleanRel = cleanString(relPath);

        if (cleanSlug === cleanTarget || cleanRel === cleanTarget || (cleanTarget.length >= 4 && cleanSlug.includes(cleanTarget)) || (cleanSlug.length >= 4 && cleanTarget.includes(cleanSlug))) {
          return { full, relSlug: relPath };
        }

        try {
          const head = fs.readFileSync(full, 'utf8').substring(0, 600);
          const h1Match = head.match(/^#\s+(.+)$/m);
          if (h1Match) {
            const cleanH1 = cleanString(h1Match[1]);
            if (cleanH1 === cleanTarget || (cleanTarget.length >= 4 && cleanH1.includes(cleanTarget)) || (cleanH1.length >= 4 && cleanTarget.includes(cleanH1))) {
              return { full, relSlug: relPath };
            }
          }
        } catch (e) {}
      }
    }
    return null;
  }

  const found = searchFile(targetDir);
  if (found) {
    const res = await syncChapterQuestions(dbInstance, found.full, subject, found.relSlug);
    console.log(`[On-Demand Sync] Found file "${found.full}" -> Ingested ${res.count} questions for [${subject} / ${found.relSlug}]`);
    return res;
  }
  return null;
}

// Background File Watcher for Automatic Ingestion
let fileWatcherInitialized = false;
let watcherDebounce = null;
const changedFilesQueue = new Set();

function setupFileWatcher() {
  if (fileWatcherInitialized) return;
  const subjectsDir = path.resolve(__dirname, '../docs/subjects');
  if (!fs.existsSync(subjectsDir)) return;

  try {
    fs.watch(subjectsDir, { recursive: true }, (eventType, filename) => {
      if (!filename || !filename.endsWith('.md')) return;
      const lower = filename.toLowerCase();
      if (lower.endsWith('index.md') || lower.endsWith('prompt.md')) return;

      changedFilesQueue.add(filename);
      clearTimeout(watcherDebounce);
      watcherDebounce = setTimeout(async () => {
        if (!db) return;
        const filesToProcess = Array.from(changedFilesQueue);
        changedFilesQueue.clear();

        for (const relFile of filesToProcess) {
          try {
            const fullPath = path.join(subjectsDir, relFile);
            if (!fs.existsSync(fullPath)) continue;

            const normalizedRel = relFile.replace(/\\/g, '/');
            const parts = normalizedRel.split('/');
            const subject = parts[0];
            const chapterSlug = parts.slice(1).join('/').replace(/\.md$/, '');

            const result = await syncChapterQuestions(db, fullPath, subject, chapterSlug);
            console.log(`[Auto-Sync] "${relFile}" -> Ingested ${result.count} questions into Atlas for [${subject} / ${chapterSlug}]`);
          } catch (err) {
            console.error(`[Auto-Sync Error] Failed processing ${relFile}:`, err.message);
          }
        }
      }, 1500);
    });

    fileWatcherInitialized = true;
    console.log(`[Auto-Sync] Live question watcher active on: ${subjectsDir}`);
  } catch (err) {
    console.warn('[Auto-Sync] Failed to initialize file watcher:', err.message);
  }
}

// ------------------- API ROUTES ------------------- //

// Enforce Basic Auth across all API endpoints
app.use('/api', requireBasicAuth);

// Auth verification endpoint
app.get('/api/auth/verify', (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: BASIC_AUTH_USER
  });
});

// Manual / On-demand Question Sync endpoint
app.post('/api/sync-questions', checkDb, async (req, res) => {
  try {
    const { subject, chapter, full } = req.body || {};
    const subjectsDir = path.resolve(__dirname, '../docs/subjects');

    if (full || (!subject && !chapter)) {
      const summary = await syncAllQuestions(db, subjectsDir);
      return res.json({ success: true, mode: 'full', ...summary });
    }

    if (subject && chapter) {
      const syncResult = await findAndSyncChapterFile(db, subject, chapter);
      if (syncResult) {
        return res.json({ success: true, mode: 'single', ...syncResult });
      } else {
        return res.status(404).json({ error: `Chapter file not found for ${subject} / ${chapter}` });
      }
    }

    res.status(400).json({ error: 'Specify either full: true or both subject and chapter' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Health & Connection Status
app.get('/api/status', (req, res) => {
  res.json({
    status: connectionStatus,
    timestamp: new Date().toISOString()
  });
});

// Re-try connection endpoint (allows instant reconnect after editing .env)
app.post('/api/reconnect', async (req, res) => {
  dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
  process.env.MONGODB_URI = process.env.MONGODB_URI || req.body?.uri;
  await connectToMongo();
  res.json(connectionStatus);
});

// 2. Topic Status (For Note Pages Top Widget)
app.get('/api/topic-status', checkDb, async (req, res) => {
  try {
    const { subject, topic } = req.query;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic query parameters are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();

    // Query revisions
    const revisions = await db.collection('revisions')
      .find({ subject: normSubject, topic: normTopic })
      .sort({ date: -1 })
      .toArray();

    // Query PYQs
    const pyqs = await db.collection('pyqs')
      .find({ subject: normSubject, topic: normTopic })
      .sort({ date: -1 })
      .toArray();

    const revCount = revisions.length;
    const lastRevision = revisions[0] || null;
    const totalAttempted = pyqs.reduce((acc, curr) => acc + (Number(curr.attempted) || 0), 0);
    const totalCorrect = pyqs.reduce((acc, curr) => acc + (Number(curr.correct) || 0), 0);
    const totalIncorrect = pyqs.reduce((acc, curr) => acc + (Number(curr.incorrect) || 0), 0);
    const pyqAccuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(1) : null;

    const now = new Date();
    const isDue = lastRevision && lastRevision.next_revision_due ? new Date(lastRevision.next_revision_due) <= now : false;

    res.json({
      subject: normSubject,
      topic: normTopic,
      revision_count: revCount,
      last_revision: lastRevision ? {
        date: lastRevision.date,
        confidence: lastRevision.confidence,
        notes: lastRevision.notes,
        revision_number: lastRevision.revision_number,
        next_revision_due: lastRevision.next_revision_due
      } : null,
      is_due: isDue,
      pyqs: {
        total_attempted: totalAttempted,
        total_correct: totalCorrect,
        total_incorrect: totalIncorrect,
        accuracy_pct: pyqAccuracy,
        sessions_count: pyqs.length
      },
      recent_revisions: revisions.slice(0, 3),
      recent_pyqs: pyqs.slice(0, 3)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Log Revision
app.post('/api/revisions', checkDb, async (req, res) => {
  try {
    const { subject, topic, topic_title, confidence, notes, date } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();

    // Count existing revisions for this topic to determine next revision number
    const count = await db.collection('revisions').countDocuments({
      subject: normSubject,
      topic: normTopic
    });
    const revNum = count + 1;
    const logDate = date ? new Date(date) : new Date();
    const nextDue = calculateNextDueDate(logDate, revNum);

    const doc = {
      subject: normSubject,
      topic: normTopic,
      topic_title: topic_title || normTopic,
      revision_number: revNum,
      confidence: Number(confidence) || 3, // 1 to 5
      notes: (notes || '').trim(),
      date: logDate,
      next_revision_due: nextDue,
      created_at: new Date()
    };

    const result = await db.collection('revisions').insertOne(doc);
    res.status(201).json({ success: true, insertedId: result.insertedId, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Revisions List
app.get('/api/revisions', checkDb, async (req, res) => {
  try {
    const { subject, topic, limit = 50 } = req.query;
    const filter = {};
    if (subject) filter.subject = subject.toLowerCase().trim();
    if (topic) filter.topic = topic.trim();

    const items = await db.collection('revisions')
      .find(filter)
      .sort({ date: -1 })
      .limit(Number(limit))
      .toArray();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Due Revisions (Spaced Repetition Queue)
app.get('/api/revisions/due', checkDb, async (req, res) => {
  try {
    const now = new Date();
    // Aggregation to find the latest revision per subject+topic
    const pipeline = [
      { $sort: { date: -1 } },
      {
        $group: {
          _id: { subject: '$subject', topic: '$topic' },
          last_revision: { $first: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          subject: '$_id.subject',
          topic: '$_id.topic',
          topic_title: '$last_revision.topic_title',
          revision_number: '$last_revision.revision_number',
          confidence: '$last_revision.confidence',
          last_date: '$last_revision.date',
          next_revision_due: '$last_revision.next_revision_due',
          notes: '$last_revision.notes'
        }
      },
      {
        $match: {
          next_revision_due: { $lte: now }
        }
      },
      { $sort: { next_revision_due: 1 } }
    ];

    const dueItems = await db.collection('revisions').aggregate(pipeline).toArray();
    res.json(dueItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Practiced PYQs
app.post('/api/pyqs', checkDb, async (req, res) => {
  try {
    const {
      subject,
      topic,
      topic_title,
      source,
      attempted,
      correct,
      incorrect,
      mistakes,
      notes,
      date
    } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const att = Math.max(0, Number(attempted) || 0);
    const cor = Math.max(0, Number(correct) || 0);
    const inc = incorrect !== undefined ? Math.max(0, Number(incorrect)) : Math.max(0, att - cor);
    const accuracy = att > 0 ? Number(((cor / att) * 100).toFixed(1)) : 0;

    const doc = {
      subject: subject.toLowerCase().trim(),
      topic: topic.trim(),
      topic_title: topic_title || topic.trim(),
      source: (source || 'Ghatna Chakra').trim(),
      attempted: att,
      correct: cor,
      incorrect: inc,
      accuracy_pct: accuracy,
      mistakes: Array.isArray(mistakes) ? mistakes : (mistakes ? [mistakes] : []),
      notes: (notes || '').trim(),
      date: date ? new Date(date) : new Date(),
      created_at: new Date()
    };

    const result = await db.collection('pyqs').insertOne(doc);
    res.status(201).json({ success: true, insertedId: result.insertedId, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pyqs', checkDb, async (req, res) => {
  try {
    const { subject, topic, limit = 50 } = req.query;
    const filter = {};
    if (subject) filter.subject = subject.toLowerCase().trim();
    if (topic) filter.topic = topic.trim();

    const items = await db.collection('pyqs')
      .find(filter)
      .sort({ date: -1 })
      .limit(Number(limit))
      .toArray();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Tests Given
app.post('/api/tests', checkDb, async (req, res) => {
  try {
    const {
      title,
      provider,
      test_type,
      subject,
      total_questions = 150,
      attempted = 0,
      correct = 0,
      incorrect = 0,
      marks_per_correct = 1.333333,
      negative_ratio = 0.333333,
      weak_areas = [],
      analysis_notes = '',
      date
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Test title is required' });
    }

    const tot = Number(total_questions) || 150;
    const att = Number(attempted) || 0;
    const cor = Number(correct) || 0;
    const inc = Number(incorrect) || 0;
    const unatt = Math.max(0, tot - att);

    // Negative mark per incorrect = marks_per_correct * negative_ratio (e.g. 1.333 * 1/3 = 0.444)
    const posMarks = cor * Number(marks_per_correct);
    const negMarks = inc * (Number(marks_per_correct) * Number(negative_ratio));
    const netMarks = Number((posMarks - negMarks).toFixed(2));
    const accuracy = att > 0 ? Number(((cor / att) * 100).toFixed(1)) : 0;
    const percentage = tot > 0 ? Number(((netMarks / (tot * marks_per_correct)) * 100).toFixed(1)) : 0;

    const doc = {
      title: title.trim(),
      provider: (provider || 'Custom').trim(),
      test_type: test_type || 'Full Length (FLT)',
      subject: subject ? subject.trim() : 'Full Syllabus',
      total_questions: tot,
      attempted: att,
      correct: cor,
      incorrect: inc,
      unattempted: unatt,
      marks_per_correct: Number(marks_per_correct),
      negative_ratio: Number(negative_ratio),
      net_marks: netMarks,
      accuracy_pct: accuracy,
      percentage: percentage,
      weak_areas: Array.isArray(weak_areas) ? weak_areas : (weak_areas ? [weak_areas] : []),
      analysis_notes: (analysis_notes || '').trim(),
      date: date ? new Date(date) : new Date(),
      created_at: new Date()
    };

    const result = await db.collection('tests').insertOne(doc);
    res.status(201).json({ success: true, insertedId: result.insertedId, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tests', checkDb, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const items = await db.collection('tests')
      .find({})
      .sort({ date: -1 })
      .limit(Number(limit))
      .toArray();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tests/:id', checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('tests').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5a. Get Real Chapter Questions for Live Test
app.get('/api/chapter-questions', checkDb, async (req, res) => {
  try {
    const { subject, topic, chapter, limit, shuffle } = req.query;
    const targetTopic = (topic || chapter || '').trim();

    if (!subject || !targetTopic) {
      return res.status(400).json({ error: 'subject and topic (or chapter) are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const subjectRegex = new RegExp(`^${normSubject.replace(/[-_]/g, '[-_ ]')}$`, 'i');

    const cleanTopicStr = targetTopic
      .replace(/^topic\s*\d+\s*[-–—:]*\s*/i, '')
      .replace(/^[0-9\.\s\-_]+/, '')
      .replace(/[\(\)\[\]]/g, '')
      .trim();

    const cleanRegex = new RegExp(cleanTopicStr.replace(/[-_]/g, '[-_ ]'), 'i');
    const topicRegex = new RegExp(targetTopic.replace(/[-_]/g, '[-_ ]'), 'i');

    function buildQuery() {
      return {
        subject: { $regex: subjectRegex },
        $or: [
          { chapter: { $regex: topicRegex } },
          { chapter: { $regex: cleanRegex } },
          { chapter_title: { $regex: topicRegex } },
          { chapter_title: { $regex: cleanRegex } }
        ]
      };
    }

    const questionProjection = {
      q_id: 1,
      subject: 1,
      chapter: 1,
      chapter_title: 1,
      q_num: 1,
      q_header: 1,
      stem: 1,
      options: 1,
      category: 1,
      section_title: 1,
      correct_answer: 1,
      all_correct_answers: 1,
      explanation: 1
    };

    let questions = await db.collection('questions')
      .find(buildQuery())
      .project(questionProjection)
      .sort({ q_num: 1 })
      .toArray();

    // If 0 questions found in DB, attempt on-demand sync from markdown file on disk
    if (questions.length === 0) {
      await findAndSyncChapterFile(db, subject, targetTopic);
      questions = await db.collection('questions')
        .find(buildQuery())
        .project(questionProjection)
        .sort({ q_num: 1 })
        .toArray();
    }

    if (shuffle === 'true' || shuffle === true) {
      // Fisher-Yates shuffle
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }

    const totalAvailable = questions.length;
    if (limit && Number(limit) > 0 && Number(limit) < questions.length) {
      questions = questions.slice(0, Number(limit));
    }

    // Re-index displayed question numbers for clean test UI
    questions = questions.map((q, idx) => ({
      ...q,
      display_num: idx + 1
    }));

    res.json({
      subject: normSubject,
      chapter: targetTopic,
      chapter_title: questions[0]?.chapter_title || targetTopic,
      total_available: totalAvailable,
      count: questions.length,
      questions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5b. Live Test Evaluation Endpoint (Validates answers against DB and computes UPPCS score)
app.post('/api/chapter-test/evaluate', checkDb, async (req, res) => {
  try {
    const {
      subject,
      topic,
      chapter,
      topic_title,
      time_spent_seconds = 0,
      test_mode = 'Full Chapter Practice',
      answers = {} // Map of { [q_id]: 'A' | 'B' | 'C' | 'D' }
    } = req.body;

    const targetTopic = (topic || chapter || '').trim();
    if (!subject || !targetTopic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const questionIds = Object.keys(answers);
    const escapedTopic = targetTopic.replace(/[-_]/g, '[-_ ]');
    const topicRegex = new RegExp(`^${escapedTopic}$`, 'i');
    const subjectRegex = new RegExp(`^${subject.toLowerCase().trim().replace(/[-_]/g, '[-_ ]')}$`, 'i');

    let dbQuestions = [];
    if (questionIds.length > 0) {
      // Fetch specifically tested questions
      dbQuestions = await db.collection('questions')
        .find({ q_id: { $in: questionIds } })
        .sort({ q_num: 1 })
        .toArray();
    }

    // If answers map had fewer items than test or empty, fallback to fetching all chapter questions
    if (dbQuestions.length === 0) {
      dbQuestions = await db.collection('questions')
        .find({
          subject: { $regex: subjectRegex },
          chapter: { $regex: topicRegex }
        })
        .sort({ q_num: 1 })
        .toArray();
    }

    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const detailedReview = [];
    const wrongQuestions = [];

    dbQuestions.forEach((q, idx) => {
      const userAns = (answers[q.q_id] || '').toUpperCase().trim();
      const validAnswers = q.all_correct_answers || [q.correct_answer];
      let isCorrect = null;

      if (userAns) {
        attempted++;
        if (validAnswers.includes(userAns)) {
          isCorrect = true;
          correct++;
        } else {
          isCorrect = false;
          incorrect++;
          wrongQuestions.push({
            q_id: q.q_id,
            q_num: idx + 1,
            q_header: q.q_header,
            section_title: q.section_title || 'General Notes',
            stem: q.stem,
            options: q.options,
            user_answer: userAns,
            correct_answer: q.correct_answer,
            explanation: q.explanation
          });
        }
      } else {
        unattempted++;
      }

      detailedReview.push({
        q_id: q.q_id,
        q_num: idx + 1,
        q_header: q.q_header,
        section_title: q.section_title || 'General Notes',
        stem: q.stem,
        options: q.options,
        user_answer: userAns || null,
        correct_answer: q.correct_answer,
        all_correct_answers: validAnswers,
        is_correct: isCorrect,
        explanation: q.explanation
      });
    });

    const totalQuestions = dbQuestions.length;
    // UPPCS Standard: +1.33 for correct, -0.44 for wrong
    const grossPositive = Number((correct * 1.333333).toFixed(2));
    const negativePenalty = Number((incorrect * 0.444444).toFixed(2));
    const netMarks = Number((grossPositive - negativePenalty).toFixed(2));
    const maxMarks = Number((totalQuestions * 1.333333).toFixed(2));
    const accuracy = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(1)) : 0;
    const scorePct = maxMarks > 0 ? Number(((netMarks / maxMarks) * 100).toFixed(1)) : 0;

    // Automatic Chapter Subtopics Weakness Calculation
    const subtopicMistakesMap = {};
    const subtopicTotalMap = {};

    dbQuestions.forEach(q => {
      const sec = (q.section_title || 'General Notes').trim();
      subtopicTotalMap[sec] = (subtopicTotalMap[sec] || 0) + 1;
    });

    wrongQuestions.forEach(w => {
      const sec = (w.section_title || 'General Notes').trim();
      subtopicMistakesMap[sec] = (subtopicMistakesMap[sec] || 0) + 1;
    });

    const weakSubtopics = Object.entries(subtopicMistakesMap)
      .map(([subtopic, mistakes]) => ({
        subtopic,
        mistakes,
        total_in_section: subtopicTotalMap[subtopic] || mistakes,
        accuracy_pct: subtopicTotalMap[subtopic] ? Number((((subtopicTotalMap[subtopic] - mistakes) / subtopicTotalMap[subtopic]) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.mistakes - a.mistakes);

    const evaluationDoc = {
      subject: subject.toLowerCase().trim(),
      topic: targetTopic,
      topic_title: topic_title || dbQuestions[0]?.chapter_title || targetTopic,
      test_mode: test_mode,
      total_questions: totalQuestions,
      attempted,
      correct,
      incorrect,
      unattempted,
      gross_positive: grossPositive,
      negative_penalty: negativePenalty,
      net_marks: netMarks,
      max_marks: maxMarks,
      accuracy_pct: accuracy,
      score_pct: scorePct,
      time_spent_seconds: Number(time_spent_seconds) || 0,
      wrong_questions: wrongQuestions,
      weak_subtopics: weakSubtopics,
      detailed_review: detailedReview,
      date: new Date(),
      created_at: new Date()
    };

    // Save to chapter_tests collection
    const insertRes = await db.collection('chapter_tests').insertOne(evaluationDoc);

    // Automatically record / update weak subtopics in MongoDB Atlas
    for (const ws of weakSubtopics) {
      await db.collection('weak_subtopics').updateOne(
        { subject: evaluationDoc.subject, chapter: targetTopic, subtopic: ws.subtopic },
        {
          $set: {
            subject: evaluationDoc.subject,
            chapter: targetTopic,
            chapter_title: evaluationDoc.topic_title,
            subtopic: ws.subtopic,
            last_tested: new Date()
          },
          $inc: { mistakes_count: ws.mistakes, tests_count: 1 }
        },
        { upsert: true }
      );
    }

    // Automatically Flag or Clear Chapter Topic in weak_topics collection
    let isAutoFlagged = false;
    let isClearedMastery = false;
    const topWeakSecs = weakSubtopics.filter(ws => ws.mistakes > 0).map(ws => ws.subtopic).slice(0, 3).join(', ');

    // Strict Chapter Mastery Gate: Requires at least 80% accuracy/score to mark read
    const isMasteryGate = req.body.is_mastery_gate === true;
    const minMasteryAccuracy = 80;
    const isMasteryPassed = isMasteryGate && (accuracy >= minMasteryAccuracy || scorePct >= minMasteryAccuracy) && attempted >= Math.min(5, totalQuestions);
    let newRevisionNumber = null;

    if (isMasteryPassed) {
      // 1. Record officially certified +1 Read in revisions collection
      const count = await db.collection('revisions').countDocuments({
        subject: evaluationDoc.subject,
        topic: targetTopic
      });
      newRevisionNumber = count + 1;
      const logDate = new Date();
      await db.collection('revisions').insertOne({
        subject: evaluationDoc.subject,
        topic: targetTopic,
        topic_title: evaluationDoc.topic_title,
        revision_number: newRevisionNumber,
        confidence: 5,
        notes: `Chapter Mastery Exam Passed (${accuracy}% Accuracy, Net: ${netMarks}/${maxMarks} marks on ${totalQuestions} Qs)`,
        date: logDate,
        next_revision_due: calculateNextDueDate(logDate, newRevisionNumber),
        created_at: new Date()
      });

      // 2. Automatically resolve topic in daily_planner collections for any date & backlog
      await db.collection('daily_planner').updateMany(
        { 'reading_topics.subject': evaluationDoc.subject, 'reading_topics.topic': targetTopic },
        {
          $set: {
            'reading_topics.$[elem].status': 'achieved',
            'reading_topics.$[elem].achieved_at': new Date(),
            'reading_topics.$[elem].cleared_by': 'mastery_exam',
            updated_at: new Date()
          }
        },
        {
          arrayFilters: [{ 'elem.subject': evaluationDoc.subject, 'elem.topic': targetTopic }]
        }
      );

      // 3. Clear from weak topics
      await db.collection('weak_topics').deleteOne({
        subject: evaluationDoc.subject,
        topic: targetTopic
      });
      isClearedMastery = true;
    } else if ((accuracy < 75 || incorrect >= 2) && attempted > 0) {
      isAutoFlagged = true;
      await db.collection('weak_topics').updateOne(
        { subject: evaluationDoc.subject, topic: targetTopic },
        {
          $set: {
            subject: evaluationDoc.subject,
            topic: targetTopic,
            topic_title: evaluationDoc.topic_title,
            reason: `Auto-Flagged from Test (${accuracy}% Acc, ${incorrect} errors${topWeakSecs ? ` in ${topWeakSecs}` : ''})`,
            auto_flagged: true,
            accuracy_pct: accuracy,
            mistakes_count: incorrect,
            weak_subtopics: weakSubtopics.map(ws => ws.subtopic),
            updated_at: new Date()
          }
        },
        { upsert: true }
      );
    } else if (accuracy >= 85 && attempted >= 5) {
      isClearedMastery = true;
      await db.collection('weak_topics').deleteOne({
        subject: evaluationDoc.subject,
        topic: targetTopic
      });
    }

    // Also update pyqs collection for global dashboard metrics
    await db.collection('pyqs').insertOne({
      subject: evaluationDoc.subject,
      topic: evaluationDoc.topic,
      topic_title: evaluationDoc.topic_title,
      source: `${test_mode} (Real Test)`,
      attempted,
      correct,
      incorrect,
      accuracy_pct: accuracy,
      mistakes: wrongQuestions.map(w => `Q${w.q_num} [${w.section_title}]: ${w.stem?.substring(0, 60)}...`),
      date: evaluationDoc.date,
      created_at: new Date()
    });

    res.status(200).json({
      success: true,
      test_id: insertRes.insertedId,
      auto_flagged: isAutoFlagged,
      cleared_mastery: isClearedMastery,
      mastery_gate: isMasteryGate,
      mastery_passed: isMasteryPassed,
      new_read_count: newRevisionNumber,
      scorecard: {
        ...evaluationDoc,
        auto_flagged: isAutoFlagged,
        cleared_mastery: isClearedMastery,
        mastery_gate: isMasteryGate,
        mastery_passed: isMasteryPassed,
        new_read_count: newRevisionNumber,
        _id: insertRes.insertedId
      },
      detailed_review: detailedReview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chapter-tests', checkDb, async (req, res) => {
  try {
    const { subject, topic, limit = 50 } = req.query;
    const filter = {};
    if (subject) filter.subject = subject.toLowerCase().trim();
    if (topic) filter.topic = topic.trim();

    const items = await db.collection('chapter_tests')
      .find(filter)
      .sort({ date: -1 })
      .limit(Number(limit))
      .toArray();

    // Calculate aggregated stats
    const totalTests = items.length;
    let avgScore = 0;
    let avgAccuracy = 0;
    let frequentWrongQuestions = {};
    let trapQuestionsList = [];
    let aggregatedWeakSubtopics = [];

    if (totalTests > 0) {
      avgScore = Number((items.reduce((acc, t) => acc + (t.net_marks || 0), 0) / totalTests).toFixed(2));
      avgAccuracy = Number((items.reduce((acc, t) => acc + (t.accuracy_pct || 0), 0) / totalTests).toFixed(1));

      const trapMap = new Map();
      items.forEach(t => {
        (t.wrong_questions || []).forEach(w => {
          const key = w.q_id || (w.stem ? w.stem.substring(0, 100) : `q_${w.q_num}`);
          frequentWrongQuestions[key] = (frequentWrongQuestions[key] || 0) + 1;

          if (trapMap.has(key)) {
            const existing = trapMap.get(key);
            existing.times_missed += 1;
            if (!existing.explanation && w.explanation) existing.explanation = w.explanation;
            if (!existing.options && w.options) existing.options = w.options;
            if (w.user_answer) existing.user_answer = w.user_answer;
          } else {
            trapMap.set(key, {
              q_id: w.q_id || key,
              q_num: w.q_num,
              q_header: w.q_header || `Trap Question ${w.q_num || ''}`,
              section_title: w.section_title || 'General Notes',
              stem: w.stem,
              options: w.options || null,
              user_answer: w.user_answer,
              correct_answer: w.correct_answer,
              explanation: w.explanation,
              times_missed: 1,
              test_date: t.date
            });
          }
        });
      });

      // Enrich trap questions missing options from questions collection
      const missingOptionIds = Array.from(trapMap.values())
        .filter(t => (!t.options || !t.explanation) && t.q_id && !t.q_id.startsWith('q_'))
        .map(t => t.q_id);

      if (missingOptionIds.length > 0) {
        try {
          const enrichQs = await db.collection('questions')
            .find({ q_id: { $in: missingOptionIds } })
            .project({ q_id: 1, options: 1, explanation: 1, stem: 1, correct_answer: 1, q_header: 1 })
            .toArray();
          const enrichMap = new Map(enrichQs.map(q => [q.q_id, q]));
          for (const item of trapMap.values()) {
            if (enrichMap.has(item.q_id)) {
              const fullQ = enrichMap.get(item.q_id);
              if (!item.options) item.options = fullQ.options;
              if (!item.explanation && fullQ.explanation) item.explanation = fullQ.explanation;
              if (!item.correct_answer && fullQ.correct_answer) item.correct_answer = fullQ.correct_answer;
              if (!item.stem && fullQ.stem) item.stem = fullQ.stem;
            }
          }
        } catch (enrichErr) {
          console.warn('Trap questions enrichment error:', enrichErr.message);
        }
      }

      trapQuestionsList = Array.from(trapMap.values())
        .sort((a, b) => b.times_missed - a.times_missed);

      // Aggregate subtopic weakness across all past tests
      const subtopicMistakesAgg = {};
      items.forEach(t => {
        if (Array.isArray(t.weak_subtopics)) {
          t.weak_subtopics.forEach(ws => {
            const sec = ws.subtopic || 'General Notes';
            subtopicMistakesAgg[sec] = (subtopicMistakesAgg[sec] || 0) + (ws.mistakes || 1);
          });
        } else if (Array.isArray(t.wrong_questions)) {
          t.wrong_questions.forEach(w => {
            const sec = w.section_title || 'General Notes';
            subtopicMistakesAgg[sec] = (subtopicMistakesAgg[sec] || 0) + 1;
          });
        }
      });

      aggregatedWeakSubtopics = Object.entries(subtopicMistakesAgg)
        .map(([subtopic, total_mistakes]) => ({
          subtopic,
          total_mistakes,
          latest_mistakes: items[0]?.weak_subtopics?.find(ws => ws.subtopic === subtopic)?.mistakes || 0
        }))
        .sort((a, b) => b.total_mistakes - a.total_mistakes);
    }

    res.json({
      attempts: items,
      summary: {
        total_tests: totalTests,
        avg_score: avgScore,
        avg_accuracy: avgAccuracy,
        frequent_wrong_questions: frequentWrongQuestions,
        trap_questions: trapQuestionsList || [],
        weak_subtopics: aggregatedWeakSubtopics
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5c. Quick +1 Read Count Increment
app.post('/api/quick-read', checkDb, async (req, res) => {
  try {
    const { subject, topic, topic_title, notes = '', confidence = 3 } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();

    const count = await db.collection('revisions').countDocuments({
      subject: normSubject,
      topic: normTopic
    });
    const revNum = count + 1;
    const logDate = new Date();
    const nextDue = calculateNextDueDate(logDate, revNum);

    const doc = {
      subject: normSubject,
      topic: normTopic,
      topic_title: topic_title || normTopic,
      revision_number: revNum,
      confidence: Number(confidence) || 3,
      notes: notes || `Read #${revNum} marked`,
      date: logDate,
      next_revision_due: nextDue,
      created_at: new Date()
    };

    const result = await db.collection('revisions').insertOne(doc);
    res.status(201).json({ success: true, count: revNum, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Comprehensive Dashboard Summary
app.get('/api/dashboard/summary', checkDb, async (req, res) => {
  try {
    // Revisions stats
    const totalRevisions = await db.collection('revisions').countDocuments();

    // Due revisions count
    const now = new Date();
    const dueCountPipeline = [
      { $sort: { date: -1 } },
      {
        $group: {
          _id: { subject: '$subject', topic: '$topic' },
          last_revision: { $first: '$$ROOT' }
        }
      },
      {
        $match: {
          'last_revision.next_revision_due': { $lte: now }
        }
      },
      { $count: 'total_due' }
    ];
    const dueCountRes = await db.collection('revisions').aggregate(dueCountPipeline).toArray();
    const dueTodayCount = dueCountRes[0]?.total_due || 0;

    // Combine tests from both chapter_tests and tests collections
    const chapterTests = await db.collection('chapter_tests').find({}).sort({ date: -1 }).toArray();
    const customTests = await db.collection('tests').find({}).sort({ date: -1 }).toArray();
    const allTests = [...chapterTests, ...customTests].sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalTests = allTests.length;
    let avgTestScore = 0;
    let avgAccuracy = 0;
    if (totalTests > 0) {
      avgTestScore = Number((allTests.reduce((acc, t) => acc + (t.net_marks || 0), 0) / totalTests).toFixed(2));
      avgAccuracy = Number((allTests.reduce((acc, t) => acc + (Number(t.accuracy_pct) || 0), 0) / totalTests).toFixed(1));
    }

    // PYQs stats
    const pyqs = await db.collection('pyqs').find({}).toArray();
    const totalPyqsAttempted = pyqs.reduce((acc, p) => acc + (p.attempted || 0), 0);
    const totalPyqsCorrect = pyqs.reduce((acc, p) => acc + (p.correct || 0), 0);
    const overallPyqAccuracy = totalPyqsAttempted > 0
      ? ((totalPyqsCorrect / totalPyqsAttempted) * 100).toFixed(1)
      : 0;

    // Subject breakdown
    const subjectMap = {};
    pyqs.forEach(p => {
      const s = p.subject || 'other';
      if (!subjectMap[s]) subjectMap[s] = { subject: s, pyqsAttempted: 0, pyqsCorrect: 0, revisions: 0 };
      subjectMap[s].pyqsAttempted += p.attempted || 0;
      subjectMap[s].pyqsCorrect += p.correct || 0;
    });

    const allRevs = await db.collection('revisions').find({}).toArray();
    allRevs.forEach(r => {
      const s = r.subject || 'other';
      if (!subjectMap[s]) subjectMap[s] = { subject: s, pyqsAttempted: 0, pyqsCorrect: 0, revisions: 0 };
      subjectMap[s].revisions += 1;
    });

    const subjectBreakdown = Object.values(subjectMap).map(item => ({
      ...item,
      accuracy: item.pyqsAttempted > 0 ? Number(((item.pyqsCorrect / item.pyqsAttempted) * 100).toFixed(1)) : 0
    }));

    // Detect weak topics
    const manualWeak = await db.collection('weak_topics').find({}).sort({ updated_at: -1 }).toArray();
    const lowConfRevs = await db.collection('revisions').find({ confidence: { $lte: 2 } }).sort({ date: -1 }).toArray();
    const lowAccTests = await db.collection('chapter_tests').find({ accuracy_pct: { $lt: 60 }, attempted: { $gt: 0 } }).sort({ date: -1 }).toArray();

    const weakMap = {};
    manualWeak.forEach(w => {
      const key = `${w.subject}:::${w.topic}`;
      weakMap[key] = {
        subject: w.subject,
        topic: w.topic,
        topic_title: w.topic_title || w.topic,
        reason: w.reason || 'Manually Mapped Weak Area',
        notes: w.notes || '',
        manual: true,
        date: w.updated_at || w.created_at
      };
    });
    lowAccTests.forEach(t => {
      const key = `${t.subject}:::${t.topic}`;
      if (!weakMap[key]) {
        weakMap[key] = {
          subject: t.subject,
          topic: t.topic,
          topic_title: t.topic_title || t.topic,
          reason: `Low Test Accuracy (${t.accuracy_pct}% on ${t.correct}✔ / ${t.incorrect}✖)`,
          accuracy_pct: t.accuracy_pct,
          manual: false,
          date: t.date
        };
      }
    });
    lowConfRevs.forEach(r => {
      const key = `${r.subject}:::${r.topic}`;
      if (!weakMap[key]) {
        weakMap[key] = {
          subject: r.subject,
          topic: r.topic,
          topic_title: r.topic_title || r.topic,
          reason: `Low Reading Confidence (Rating: ${'★'.repeat(r.confidence || 1)})`,
          confidence: r.confidence,
          manual: false,
          date: r.date
        };
      }
    });

    res.json({
      total_revisions: totalRevisions,
      revisions_due_today: dueTodayCount,
      total_tests: totalTests,
      avg_test_score: avgTestScore,
      avg_test_accuracy: avgAccuracy,
      total_pyqs_practiced: totalPyqsAttempted,
      total_pyqs_correct: totalPyqsCorrect,
      overall_pyq_accuracy: overallPyqAccuracy,
      subject_breakdown: subjectBreakdown,
      recent_tests: allTests.slice(0, 10),
      weak_topics: Object.values(weakMap)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Weak Topics Management API
app.get('/api/weak-topics', checkDb, async (req, res) => {
  try {
    const manualWeak = await db.collection('weak_topics').find({}).sort({ updated_at: -1 }).toArray();
    const lowConfRevs = await db.collection('revisions').find({ confidence: { $lte: 2 } }).sort({ date: -1 }).toArray();
    const lowAccTests = await db.collection('chapter_tests').find({ accuracy_pct: { $lt: 75 }, attempted: { $gt: 0 } }).sort({ date: -1 }).toArray();

    const weakMap = {};
    manualWeak.forEach(w => {
      const key = `${w.subject}:::${w.topic}`;
      weakMap[key] = {
        subject: w.subject,
        topic: w.topic,
        topic_title: w.topic_title || w.topic,
        reason: w.reason || 'Manually Mapped Weak Area',
        notes: w.notes || '',
        auto_flagged: Boolean(w.auto_flagged),
        accuracy_pct: w.accuracy_pct,
        mistakes_count: w.mistakes_count,
        weak_subtopics: w.weak_subtopics || [],
        manual: !w.auto_flagged,
        date: w.updated_at || w.created_at
      };
    });
    lowAccTests.forEach(t => {
      const key = `${t.subject}:::${t.topic}`;
      if (!weakMap[key]) {
        weakMap[key] = {
          subject: t.subject,
          topic: t.topic,
          topic_title: t.topic_title || t.topic,
          reason: `Low Test Accuracy (${t.accuracy_pct}% on ${t.correct}✔ / ${t.incorrect}✖)`,
          accuracy_pct: t.accuracy_pct,
          manual: false,
          date: t.date
        };
      }
    });
    lowConfRevs.forEach(r => {
      const key = `${r.subject}:::${r.topic}`;
      if (!weakMap[key]) {
        weakMap[key] = {
          subject: r.subject,
          topic: r.topic,
          topic_title: r.topic_title || r.topic,
          reason: `Low Reading Confidence (Rating: ${'★'.repeat(r.confidence || 1)})`,
          confidence: r.confidence,
          manual: false,
          date: r.date
        };
      }
    });

    res.json(Object.values(weakMap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/weak-topics', checkDb, async (req, res) => {
  try {
    const { subject, topic, topic_title, reason, notes } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();

    const doc = {
      subject: normSubject,
      topic: normTopic,
      topic_title: topic_title || normTopic,
      reason: (reason || 'Manually Mapped Weak Area').trim(),
      notes: (notes || '').trim(),
      is_weak: true,
      updated_at: new Date()
    };

    await db.collection('weak_topics').updateOne(
      { subject: normSubject, topic: normTopic },
      { $set: doc },
      { upsert: true }
    );

    res.json({ success: true, message: `Mapped ${normTopic} as weak topic`, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/weak-topics', checkDb, async (req, res) => {
  try {
    const { subject, topic } = req.body || req.query;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();

    await db.collection('weak_topics').deleteOne({ subject: normSubject, topic: normTopic });
    res.json({ success: true, message: `Removed ${normTopic} from weak topics (marked mastered)` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7b. Weak Subtopics Radar (Automatic aggregation from live tests)
app.get('/api/weak-subtopics', checkDb, async (req, res) => {
  try {
    const { subject, chapter, limit = 50 } = req.query;
    const filter = {};
    if (subject) filter.subject = subject.toLowerCase().trim();
    if (chapter) filter.chapter = chapter.trim();

    const items = await db.collection('weak_subtopics')
      .find(filter)
      .sort({ mistakes_count: -1, last_tested: -1 })
      .limit(Number(limit))
      .toArray();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- 8. DAILY TARGET PLANNER & TASKS API ------------------- //

// Helper to get formatted ISO date (YYYY-MM-DD)
function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Get daily planner state for date
app.get('/api/daily-planner', checkDb, async (req, res) => {
  try {
    const targetDate = req.query.date || getTodayStr();
    let doc = await db.collection('daily_planner').findOne({ date: targetDate });

    if (!doc) {
      doc = {
        date: targetDate,
        reading_topics: [],
        daily_tasks: [],
        created_at: new Date(),
        updated_at: new Date()
      };
      await db.collection('daily_planner').insertOne(doc);
    }

    res.json({
      success: true,
      date: targetDate,
      reading_topics: doc.reading_topics || [],
      daily_tasks: doc.daily_tasks || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add reading topic
app.post('/api/daily-planner/topic', checkDb, async (req, res) => {
  try {
    const { date, subject, topic, slot = 'morning_12pm', notes = '' } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'Subject and topic are required' });
    }
    const targetDate = date || getTodayStr();
    const newTopic = {
      id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      subject: subject.toLowerCase().trim(),
      topic: topic.trim(),
      slot: slot, // 'morning_12pm' | 'evening' | 'all_day'
      notes: notes.trim(),
      status: 'pending', // 'pending' | 'achieved'
      achieved_by_12pm: false,
      missed_12pm: false,
      created_at: new Date(),
      achieved_at: null
    };

    await db.collection('daily_planner').updateOne(
      { date: targetDate },
      {
        $push: { reading_topics: newTopic },
        $set: { updated_at: new Date() }
      },
      { upsert: true }
    );

    res.json({ success: true, topic: newTopic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record and sync chapter study time for date
app.post('/api/daily-planner/study-time', checkDb, async (req, res) => {
  try {
    const { date, subject, topic, seconds, title } = req.body;
    if (!subject || !topic || seconds === undefined) {
      return res.status(400).json({ error: 'Subject, topic, and seconds are required' });
    }
    const targetDate = date || getTodayStr();
    const cleanSub = String(subject).toLowerCase().trim();
    const cleanTop = String(topic).trim();
    const secNum = parseInt(seconds, 10) || 0;

    // 1. Update daily_planner doc's reading_topics if the topic is present
    await db.collection('daily_planner').updateOne(
      { date: targetDate, 'reading_topics.subject': cleanSub, 'reading_topics.topic': cleanTop },
      {
        $set: {
          'reading_topics.$.study_seconds': secNum,
          'reading_topics.$.last_read_at': new Date(),
          updated_at: new Date()
        }
      }
    );

    // 2. Also record in daily_study_time for permanent analytics
    await db.collection('daily_study_time').updateOne(
      { date: targetDate, subject: cleanSub, topic: cleanTop },
      {
        $set: {
          title: title || cleanTop,
          seconds: secNum,
          updated_at: new Date()
        },
        $setOnInsert: { created_at: new Date() }
      },
      { upsert: true }
    );

    res.json({ success: true, date: targetDate, seconds: secNum });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch study times recorded for date across all devices
app.get('/api/daily-planner/study-time', checkDb, async (req, res) => {
  try {
    const targetDate = req.query.date || getTodayStr();
    const records = await db.collection('daily_study_time').find({ date: targetDate }).toArray();

    const chapters = {};
    let totalSeconds = 0;
    records.forEach(r => {
      const key = `${String(r.subject).toLowerCase().trim()}__${String(r.topic).trim()}`;
      const sec = parseInt(r.seconds, 10) || 0;
      chapters[key] = {
        subject: r.subject,
        topic: r.topic,
        title: r.title || r.topic,
        seconds: sec,
        lastActive: r.updated_at ? new Date(r.updated_at).getTime() : Date.now()
      };
      totalSeconds += sec;
    });

    res.json({
      success: true,
      date: targetDate,
      chapters,
      totalSeconds
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update reading topic (status, slot, notes)
app.patch('/api/daily-planner/topic/:id', checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const targetDate = req.body.date || req.query.date || getTodayStr();
    const { status, slot, notes, missed_12pm, achieved_by_12pm } = req.body;

    const setFields = { 'reading_topics.$.updated_at': new Date() };
    if (status !== undefined) {
      setFields['reading_topics.$.status'] = status;
      if (status === 'achieved') {
        setFields['reading_topics.$.achieved_at'] = new Date();
      } else {
        setFields['reading_topics.$.achieved_at'] = null;
      }
    }
    if (slot !== undefined) setFields['reading_topics.$.slot'] = slot;
    if (notes !== undefined) setFields['reading_topics.$.notes'] = notes;
    if (missed_12pm !== undefined) setFields['reading_topics.$.missed_12pm'] = missed_12pm;
    if (achieved_by_12pm !== undefined) setFields['reading_topics.$.achieved_by_12pm'] = achieved_by_12pm;

    const result = await db.collection('daily_planner').updateOne(
      { date: targetDate, 'reading_topics.id': id },
      { $set: setFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Topic target not found' });
    }

    res.json({ success: true, message: 'Reading target updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete reading topic
app.delete('/api/daily-planner/topic/:id', checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const targetDate = req.query?.date || (req.body && req.body.date);

    // If targetDate provided, try that first; otherwise remove from any date containing id
    let result = null;
    if (targetDate) {
      result = await db.collection('daily_planner').updateOne(
        { date: targetDate },
        {
          $pull: { reading_topics: { id: id } },
          $set: { updated_at: new Date() }
        }
      );
    }
    if (!result || result.modifiedCount === 0) {
      result = await db.collection('daily_planner').updateMany(
        { 'reading_topics.id': id },
        {
          $pull: { reading_topics: { id: id } },
          $set: { updated_at: new Date() }
        }
      );
    }

    res.json({ success: true, message: 'Reading target deleted' });
  } catch (err) {
    console.error('[Delete Topic Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Add daily task
app.post('/api/daily-planner/task', checkDb, async (req, res) => {
  try {
    const { date, text, priority = 'normal', time_est = '' } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Task text is required' });
    }
    const targetDate = date || req.query?.date || getTodayStr();
    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      text: text.trim(),
      priority: priority, // 'normal' | 'high' | 'urgent'
      time_est: (time_est || '').trim(),
      completed: false,
      created_at: new Date(),
      completed_at: null
    };

    await db.collection('daily_planner').updateOne(
      { date: targetDate },
      {
        $push: { daily_tasks: newTask },
        $set: { updated_at: new Date() }
      },
      { upsert: true }
    );

    res.json({ success: true, task: newTask });
  } catch (err) {
    console.error('[Add Task Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Update daily task (toggle completed, edit text)
app.patch('/api/daily-planner/task/:id', checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const targetDate = (req.body && req.body.date) || req.query?.date;
    const { completed, text, priority, time_est } = req.body || {};

    const setFields = { 'daily_tasks.$.updated_at': new Date() };
    if (completed !== undefined) {
      setFields['daily_tasks.$.completed'] = Boolean(completed);
      setFields['daily_tasks.$.completed_at'] = completed ? new Date() : null;
    }
    if (text !== undefined) setFields['daily_tasks.$.text'] = text.trim();
    if (priority !== undefined) setFields['daily_tasks.$.priority'] = priority;
    if (time_est !== undefined) setFields['daily_tasks.$.time_est'] = time_est;

    let result = null;
    if (targetDate) {
      result = await db.collection('daily_planner').updateOne(
        { date: targetDate, 'daily_tasks.id': id },
        { $set: setFields }
      );
    }
    if (!result || result.matchedCount === 0) {
      result = await db.collection('daily_planner').updateOne(
        { 'daily_tasks.id': id },
        { $set: setFields }
      );
    }

    res.json({ success: true, message: 'Task updated' });
  } catch (err) {
    console.error('[Update Task Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete daily task (safe from undefined body and cross-date deletion)
app.delete('/api/daily-planner/task/:id', checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const targetDate = req.query?.date || (req.body && req.body.date);

    let result = null;
    if (targetDate) {
      result = await db.collection('daily_planner').updateOne(
        { date: targetDate },
        {
          $pull: { daily_tasks: { id: id } },
          $set: { updated_at: new Date() }
        }
      );
    }
    if (!result || result.modifiedCount === 0) {
      result = await db.collection('daily_planner').updateMany(
        { 'daily_tasks.id': id },
        {
          $pull: { daily_tasks: { id: id } },
          $set: { updated_at: new Date() }
        }
      );
    }

    res.json({ success: true, message: 'Task removed' });
  } catch (err) {
    console.error('[Delete Task Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Overall Cumulative Backlog: All incomplete reading topics from past dates (or explicitly flagged pending)
app.get('/api/daily-planner/overall-backlog', checkDb, async (req, res) => {
  try {
    const todayStr = getTodayStr();
    const docs = await db.collection('daily_planner')
      .find({ 'reading_topics.status': { $ne: 'achieved' } })
      .toArray();

    const overallBacklog = [];
    docs.forEach(doc => {
      const docDate = doc.date;
      const isPast = docDate < todayStr;
      (doc.reading_topics || []).forEach(t => {
        // Only count as backlog if it's from a past date OR explicitly marked pending/missed
        const isBacklog = (isPast && t.status !== 'achieved') || (!isPast && t.status !== 'achieved' && (t.slot === 'pending' || t.missed_midnight || t.missed_12pm));
        if (isBacklog) {
          let daysOverdue = 0;
          try {
            const d1 = new Date(docDate);
            const d2 = new Date(todayStr);
            daysOverdue = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
          } catch {}

          overallBacklog.push({
            ...t,
            planned_date: docDate,
            days_overdue: daysOverdue,
            is_today: docDate === todayStr
          });
        }
      });
    });

    overallBacklog.sort((a, b) => (a.planned_date > b.planned_date ? 1 : -1));

    res.json({
      success: true,
      count: overallBacklog.length,
      backlog: overallBacklog
    });
  } catch (err) {
    console.error('[Overall Backlog Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Topic normalization and fuzzy matching helpers
function normalizeTopicName(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/^topic\s*\d+\s*[-–—:]*\s*/i, '')
    .replace(/^[0-9\.\s\-_]+/, '')
    .replace(/[^a-z0-9]/g, '');
}

function isTopicMatch(sub1, top1, sub2, top2) {
  if (!sub1 || !sub2 || !top1 || !top2) return false;
  const s1 = String(sub1).toLowerCase().trim();
  const s2 = String(sub2).toLowerCase().trim();
  const subMatch = (s1 === s2 || s1.includes(s2) || s2.includes(s1));
  if (!subMatch) return false;
  const clean1 = normalizeTopicName(top1);
  const clean2 = normalizeTopicName(top2);
  return clean1 === clean2 || clean1.includes(clean2) || clean2.includes(clean1);
}

// Resolve a reading topic by subject & topic slug across today and all backlog days
app.post('/api/daily-planner/resolve-by-topic', checkDb, async (req, res) => {
  try {
    const { subject, topic } = req.body || {};
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic required' });
    }

    const normSub = subject.toLowerCase().trim();
    const normTopic = topic.trim();

    const docs = await db.collection('daily_planner').find({
      'reading_topics.status': { $ne: 'achieved' }
    }).toArray();

    let resolvedCount = 0;
    for (const doc of docs) {
      let docModified = false;
      const updatedTopics = (doc.reading_topics || []).map(t => {
        const match = isTopicMatch(t.subject, t.topic, normSub, normTopic);

        if (match && t.status !== 'achieved') {
          docModified = true;
          resolvedCount++;
          return {
            ...t,
            status: 'achieved',
            achieved_at: new Date(),
            cleared_by: 'mastery_exam',
            updated_at: new Date()
          };
        }
        return t;
      });

      if (docModified) {
        await db.collection('daily_planner').updateOne(
          { date: doc.date },
          { $set: { reading_topics: updatedTopics, updated_at: new Date() } }
        );
      }
    }

    res.json({
      success: true,
      message: `Resolved ${resolvedCount} reading targets matching ${topic}`,
      resolvedCount
    });
  } catch (err) {
    console.error('[Resolve By Topic Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Complete Subject & Chapters Catalog for multi-select dropdowns
app.get('/api/subjects-catalog', (req, res) => {
  try {
    const subjectsDir = path.resolve(__dirname, '../docs/subjects');
    const catalog = {};

    if (fs.existsSync(subjectsDir)) {
      const dirs = fs.readdirSync(subjectsDir);
      for (const d of dirs) {
        const fullDir = path.join(subjectsDir, d);
        if (!fs.statSync(fullDir).isDirectory() || d === '_build') continue;
        const subKey = d.toLowerCase().trim();
        if (!catalog[subKey]) catalog[subKey] = [];

        function walk(dir, relPrefix = '') {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            const fp = path.join(dir, f);
            if (fs.statSync(fp).isDirectory() && f !== '_build') {
              walk(fp, relPrefix ? relPrefix + '/' + f : f);
            } else if (f.endsWith('.md') && f !== 'index.md' && f !== 'prompt.md') {
              const slug = relPrefix ? relPrefix + '/' + f.replace('.md', '') : f.replace('.md', '');
              const cleanTitle = f.replace('.md', '').replace(/^[0-9]+[_-]/, '').replace(/_/g, ' ');
              catalog[subKey].push({ slug, title: cleanTitle });
            }
          }
        }
        walk(fullDir);
      }
    }

    res.json({ success: true, catalog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Midnight / End-of-Day Audit Checkpoint: Flags incomplete targets to pending
app.post('/api/daily-planner/evaluate-midnight', checkDb, async (req, res) => {
  try {
    const targetDate = (req.body && req.body.date) || req.query?.date || getTodayStr();
    const doc = await db.collection('daily_planner').findOne({ date: targetDate });
    if (!doc || !doc.reading_topics) {
      return res.json({ success: true, count: 0 });
    }

    let modifiedCount = 0;
    const updatedTopics = doc.reading_topics.map(t => {
      if (t.status !== 'achieved') {
        modifiedCount++;
        return { ...t, missed_midnight: true, updated_at: new Date() };
      }
      return t;
    });

    await db.collection('daily_planner').updateOne(
      { date: targetDate },
      { $set: { reading_topics: updatedTopics, updated_at: new Date() } }
    );

    res.json({ success: true, flagged_count: modifiedCount, message: `Midnight evaluation complete: ${modifiedCount} pending targets flagged.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Backward-compatible evaluate-12pm endpoint
app.post('/api/daily-planner/evaluate-12pm', checkDb, async (req, res) => {
  try {
    const targetDate = (req.body && req.body.date) || req.query?.date || getTodayStr();
    const doc = await db.collection('daily_planner').findOne({ date: targetDate });
    if (!doc || !doc.reading_topics) {
      return res.json({ success: true, count: 0 });
    }

    let modifiedCount = 0;
    const updatedTopics = doc.reading_topics.map(t => {
      if (t.status !== 'achieved') {
        modifiedCount++;
        return { ...t, missed_midnight: true, updated_at: new Date() };
      }
      return t;
    });

    await db.collection('daily_planner').updateOne(
      { date: targetDate },
      { $set: { reading_topics: updatedTopics, updated_at: new Date() } }
    );

    res.json({ success: true, flagged_count: modifiedCount, message: `Evaluation complete: ${modifiedCount} pending targets flagged.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rollover pending reading topics and tasks from another date
app.post('/api/daily-planner/rollover', checkDb, async (req, res) => {
  try {
    const { from_date, to_date = getTodayStr() } = req.body || {};
    let sourceDate = from_date;
    if (!sourceDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      sourceDate = yesterday.toISOString().split('T')[0];
    }

    const sourceDoc = await db.collection('daily_planner').findOne({ date: sourceDate });
    if (!sourceDoc) {
      return res.json({ success: true, message: 'No source plan found to rollover from', rolled_topics: 0, rolled_tasks: 0 });
    }

    // Pending topics
    const pendingTopics = (sourceDoc.reading_topics || [])
      .filter(t => t.status !== 'achieved')
      .map(t => ({
        id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        subject: t.subject,
        topic: t.topic,
        slot: 'midnight',
        notes: (t.notes ? t.notes + ' ' : '') + `(Rolled over from ${sourceDate})`,
        status: 'pending',
        achieved_by_midnight: false,
        missed_midnight: true,
        created_at: new Date(),
        achieved_at: null
      }));

    // Incomplete tasks
    const incompleteTasks = (sourceDoc.daily_tasks || [])
      .filter(t => !t.completed)
      .map(t => ({
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        text: t.text,
        priority: t.priority || 'normal',
        time_est: t.time_est || '',
        completed: false,
        created_at: new Date(),
        completed_at: null
      }));

    if (pendingTopics.length > 0 || incompleteTasks.length > 0) {
      await db.collection('daily_planner').updateOne(
        { date: to_date },
        {
          $push: {
            reading_topics: { $each: pendingTopics },
            daily_tasks: { $each: incompleteTasks }
          },
          $set: { updated_at: new Date() }
        },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: `Rolled over ${pendingTopics.length} pending topics and ${incompleteTasks.length} pending tasks to ${to_date}`,
      rolled_topics: pendingTopics.length,
      rolled_tasks: incompleteTasks.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reverse Proxy all non-API requests to MkDocs (127.0.0.1:8000) with Basic Auth protection & site/ fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();

  // Basic auth check for MkDocs pages
  if (!verifyBasicAuthHeader(req.headers.authorization)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="UP-PCS Study Vault", charset="UTF-8"');
    return res.status(401).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>401 Unauthorized — UP-PCS Study Vault</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { text-align: center; background: #1e293b; padding: 2.5rem 3rem; border-radius: 1rem; border: 1px solid #334155; box-shadow: 0 20px 40px rgba(0,0,0,0.5); max-width: 440px; }
    h2 { color: #f59e0b; margin-top: 0; }
    p { color: #94a3b8; line-height: 1.5; font-size: 0.95rem; }
  </style>
</head>
<body>
  <div class="box">
    <h2>🔒 Access Restricted</h2>
    <p>This study library contains confidential notes and test records.</p>
    <p>HTTP Basic Authentication is required to proceed.</p>
  </div>
</body>
</html>`);
  }

  // Forward request to MkDocs running on 127.0.0.1:8000
  const options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: req.originalUrl,
    method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:8000'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    // If MkDocs dev server is not active on 8000, fall back to serving compiled site/ directory
    const siteDir = path.resolve(__dirname, '../site');
    if (fs.existsSync(siteDir)) {
      let reqPath = decodeURIComponent(req.path || '/');
      if (reqPath.startsWith('/UP-PCS/')) {
        reqPath = reqPath.replace(/^\/UP-PCS\//, '/');
      } else if (reqPath === '/UP-PCS') {
        return res.redirect('/UP-PCS/');
      }
      if (reqPath === '/') reqPath = '/index.html';

      let filePath = path.join(siteDir, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
        return res.sendFile(filePath);
      }
      // Check if .html can be appended
      if (fs.existsSync(filePath + '.html')) {
        return res.sendFile(filePath + '.html');
      }
      const notFoundPath = path.join(siteDir, '404.html');
      if (fs.existsSync(notFoundPath)) {
        return res.status(404).sendFile(notFoundPath);
      }
    }
    res.status(502).send('Error connecting to MkDocs dev server on 127.0.0.1:8000. Ensure mkdocs serve is running or site is built.');
  });

  req.pipe(proxyReq, { end: true });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`[Server] Study Tracker API running on http://localhost:${PORT}`);
  await connectToMongo();
});
