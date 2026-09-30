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
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { MongoClient, ObjectId } = require('mongodb');
const { parseQuestionsFromMarkdown, syncChapterQuestions, syncAllQuestions } = require('./question_parser');

// Load .env from root or current folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to ./tracker-server/.env if any

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin";
const JWT_SECRET = process.env.JWT_SECRET || 'uppcs_study_vault_jwt_secret_key_2026_super_secure_neetish';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'neetishyadav4@gmail.com').toLowerCase().trim();
const ADMIN_NAME = (process.env.ADMIN_NAME || 'Nitish Pratap Yadav').trim();
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'admin';
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || 'uppcs2026';

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

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
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('revisions').createIndex({ userId: 1, subject: 1, topic: 1 });
    await db.collection('revisions').createIndex({ next_revision_due: 1 });
    await db.collection('pyqs').createIndex({ userId: 1, subject: 1, topic: 1 });
    await db.collection('tests').createIndex({ userId: 1, date: -1 });
    await db.collection('chapter_tests').createIndex({ userId: 1, date: -1 });
    await db.collection('questions').createIndex({ q_id: 1 }, { unique: true });
    await db.collection('questions').createIndex({ subject: 1, chapter: 1 });
    await db.collection('daily_study_time').createIndex({ userId: 1, date: 1 });
    await db.collection('weak_topics').createIndex({ userId: 1, subject: 1, topic: 1 });

    // Drop legacy single-field unique index on date in daily_planner if present
    try {
      const plannerIndexes = await db.collection('daily_planner').indexes();
      if (plannerIndexes.some(idx => idx.name === 'date_1' && idx.unique)) {
        await db.collection('daily_planner').dropIndex('date_1');
        console.log('[MongoDB] Dropped legacy single-field unique index date_1 on daily_planner');
      }
    } catch (e) {
      console.warn('[MongoDB] Index adjustment notice:', e.message);
    }
    await db.collection('daily_planner').createIndex({ userId: 1, date: 1 }, { unique: true });

    // Seed or ensure Super Admin account
    let adminUser = await db.collection('users').findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
      console.log(`[MongoDB] Initializing Super Admin account: ${ADMIN_EMAIL}...`);
      const defaultPassHash = await bcrypt.hash(BASIC_AUTH_PASS, 10);
      const insertRes = await db.collection('users').insertOne({
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: defaultPassHash,
        role: 'admin',
        status: 'active',
        created_at: new Date(),
        last_login: null
      });
      adminUser = { _id: insertRes.insertedId, email: ADMIN_EMAIL, name: ADMIN_NAME, role: 'admin' };
      console.log(`[MongoDB] Super Admin created: ${ADMIN_EMAIL} (${ADMIN_NAME})`);
    } else {
      // Ensure name and role are synchronized
      await db.collection('users').updateOne(
        { _id: adminUser._id },
        { $set: { role: 'admin', name: ADMIN_NAME } }
      );
      adminUser.name = ADMIN_NAME;
      adminUser.role = 'admin';
      console.log(`[MongoDB] Super Admin confirmed for: ${ADMIN_EMAIL} (${ADMIN_NAME})`);
    }

    // Migrate any existing unassociated study data to the super admin
    if (adminUser) {
      const adminIdStr = adminUser._id.toString();
      const collectionsToMigrate = [
        'chapter_tests',
        'tests',
        'weak_topics',
        'revisions',
        'daily_planner',
        'daily_study_time',
        'weak_subtopics',
        'pyqs'
      ];
      for (const colName of collectionsToMigrate) {
        try {
          const res = await db.collection(colName).updateMany(
            { userId: { $exists: false } },
            { $set: { userId: adminIdStr, userEmail: adminUser.email } }
          );
          if (res.modifiedCount > 0) {
            console.log(`[MongoDB] Associated ${res.modifiedCount} legacy records in ${colName} with admin.`);
          }
        } catch (mErr) {
          console.warn(`[MongoDB Migration] Notice in ${colName}:`, mErr.message);
        }
      }
    }

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

// ------------------- JWT AUTHENTICATION & AUTHORIZATION HELPERS ------------------- //

function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id ? user._id.toString() : user.userId,
      email: user.email.toLowerCase().trim(),
      name: user.name || 'User',
      role: user.role || 'student'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } // 7-day expiration
  );
}

function extractToken(req) {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^bearer$/i.test(parts[0])) {
      return parts[1].trim();
    }
    if (parts.length === 1 && parts[0].includes('.')) {
      return parts[0].trim();
    }
  }
  if (req.cookies) {
    if (req.cookies.uppcs_auth_token) return req.cookies.uppcs_auth_token;
    if (req.cookies.token) return req.cookies.token;
  }
  if (req.headers && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)(?:uppcs_auth_token|token)=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

function verifyJwtToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function verifyLegacyBasicAuthHeader(authHeader) {
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

async function requireAuth(req, res, next) {
  if (req.method === 'OPTIONS') return next();

  // Check JWT first
  const token = extractToken(req);
  if (token) {
    const decoded = verifyJwtToken(token);
    if (decoded && decoded.userId) {
      if (db) {
        try {
          const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
          if (!user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User account not found.' });
          }
          if (user.status === 'suspended') {
            return res.status(403).json({ error: 'Forbidden', message: 'Your account has been suspended by the administrator.' });
          }
          req.user = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
          return next();
        } catch (e) {
          req.user = decoded;
          return next();
        }
      } else {
        req.user = decoded;
        return next();
      }
    }
  }

  // Legacy Basic Auth fallback (for admin CLI scripts)
  if (verifyLegacyBasicAuthHeader(req.headers?.authorization)) {
    if (db) {
      const admin = await db.collection('users').findOne({ email: ADMIN_EMAIL });
      if (admin) {
        req.user = {
          userId: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: 'admin'
        };
        return next();
      }
    }
    req.user = {
      userId: 'legacy_admin',
      email: ADMIN_EMAIL,
      name: 'Super Admin',
      role: 'admin'
    };
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'Valid JWT authentication required (7-day session validity).'
  });
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.email.toLowerCase() === ADMIN_EMAIL)) {
      return next();
    }
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Administrative privileges required.'
    });
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

// ------------------- ADVANCED QUESTION RANDOMIZATION ------------------- //
// Prevents predictable answer patterns across all question types at serve-time:
// 1. Match-the-following: Permutes List-II items in the table, recalculates the code,
//    generates 3 genuine permutation distractors, and eliminates straight-row (1 2 3 4 / 2 1 3 4) give-aways.
// 2. Multi-statement questions: Re-balances statement formats into UPPCS 2024 Prelims quantity format
//    ("Only one / Only two / All three / None") preventing predictable "1, 2, 3" selection.
// 3. Option letter shuffling: Randomizes A/B/C/D positions per question with _option_map.
// All transformations preserve 100% factual accuracy and de-map back to canonical DB records for scoring.

function randomizeMatchQuestion(question) {
  if (!question || !question.stem || !question.options) return null;
  const stem = question.stem;
  if (!/List\s*[-–—I1]\b|Match\b|सुमेलित/i.test(stem)) return null;

  const lines = stem.split('\n');
  const tableStart = lines.findIndex(l => /\|\s*List-I/i.test(l));
  if (tableStart === -1) return null;

  let tableEnd = tableStart + 1;
  while (tableEnd < lines.length && lines[tableEnd].trim().startsWith('|')) {
    tableEnd++;
  }

  const tableLines = lines.slice(tableStart, tableEnd);
  const rowLines = tableLines.slice(2).filter(l => l.trim().length > 0);
  if (rowLines.length < 3 || rowLines.length > 4) return null;

  const parsedRows = rowLines.map(row => {
    const parts = row.split('|').map(s => s.trim()).filter(Boolean);
    return { col1: parts[0] || '', col2: parts[1] || '' };
  });

  const correctLetter = (question.correct_answer || '').toUpperCase().trim();
  const correctOptText = question.options[correctLetter] || '';
  const digits = correctOptText.match(/\d/g);
  if (!digits || digits.length !== parsedRows.length) return null;

  const originalCode = digits.map(Number);
  const list2Items = parsedRows.map(r => r.col2.replace(/^\d+[\.\)]\s*/, ''));

  const pairs = parsedRows.map((r, i) => ({
    l1Tag: r.col1,
    matchingText: list2Items[originalCode[i] - 1]
  }));

  const n = parsedRows.length;
  let newPerm = [...Array(n).keys()];
  let attempts = 0;
  do {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPerm[i], newPerm[j]] = [newPerm[j], newPerm[i]];
    }
    attempts++;
  } while (attempts < 20 && newPerm.every((v, i) => v === i));

  const newList2Texts = newPerm.map(idx => list2Items[idx]);
  const newCode = pairs.map(p => newList2Texts.indexOf(p.matchingText) + 1);

  const newRowLines = parsedRows.map((r, i) => `| ${r.col1} | ${i + 1}. ${newList2Texts[i]} |`);
  const newTableLines = [tableLines[0], tableLines[1], ...newRowLines];
  const newStem = [...lines.slice(0, tableStart), ...newTableLines, ...lines.slice(tableEnd)].join('\n');

  const delimiter = correctOptText.includes(',') ? ', ' : (correctOptText.includes('-') ? '-' : ' ');
  const hasLetterPrefix = /^[A-D]\s*[-–—:]/i.test(correctOptText.trim());

  function formatCode(arr) {
    if (hasLetterPrefix) {
      const letters = ['A', 'B', 'C', 'D'];
      return arr.map((num, idx) => `${letters[idx]}-${num}`).join(', ');
    }
    return arr.join(delimiter);
  }

  const correctCodeStr = formatCode(newCode);

  const distractors = new Set();
  let distAttempts = 0;
  while (distractors.size < 3 && distAttempts < 50) {
    distAttempts++;
    const p = [...Array(n).keys()].map(x => x + 1);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    const dStr = formatCode(p);
    if (dStr !== correctCodeStr) {
      distractors.add(dStr);
    }
  }

  if (distractors.size < 3) return null;

  const allChoices = [correctCodeStr, ...Array.from(distractors)];
  for (let i = allChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
  }

  const letters = ['A', 'B', 'C', 'D'];
  const newOptions = {};
  let newCorrectLetter = 'A';
  const optionMap = {};

  letters.forEach((l, idx) => {
    newOptions[l] = allChoices[idx];
    if (allChoices[idx] === correctCodeStr) {
      newCorrectLetter = l;
      optionMap[l] = correctLetter;
    } else {
      const wrongOriginals = letters.filter(x => x !== correctLetter);
      optionMap[l] = wrongOriginals[idx % wrongOriginals.length];
    }
  });

  return {
    ...question,
    stem: newStem,
    options: newOptions,
    correct_answer: newCorrectLetter,
    all_correct_answers: [newCorrectLetter],
    _option_map: optionMap
  };
}

function randomizeStatementQuestion(question) {
  if (!question || !question.stem || !question.options) return null;
  const stem = question.stem;

  const stmtMatches = stem.match(/(?:^|\n)\s*(\d+)[\.\)]\s+(.+)/g);
  if (!stmtMatches || stmtMatches.length < 2 || stmtMatches.length > 4) return null;
  if (!/which of the (?:statements|pairs|above)/i.test(stem)) return null;

  const correctLetter = (question.correct_answer || '').toUpperCase().trim();
  const correctText = (question.options[correctLetter] || '').toLowerCase().trim();

  let correctCount = null;
  const totalStmts = stmtMatches.length;

  if (/\b(?:all\s+(?:three|four|1,\s*2|of the above)|1\s*,\s*2\s*(?:and|&)\s*3(?:\s*(?:and|&)\s*4)?|both\s+1\s+and\s+2)\b/i.test(correctText)) {
    correctCount = totalStmts;
  } else if (/^(?:only\s+one|only\s+[1-4]|[1-4]\s+only|1\s+only|2\s+only|3\s+only|4\s+only)$/i.test(correctText)) {
    correctCount = 1;
  } else if (/\b(?:1\s*and\s*2|2\s*and\s*3|1\s*and\s*3|2\s*and\s*4|only\s+two)\b/i.test(correctText)) {
    correctCount = 2;
  } else if (/\b(?:1\s*,\s*2\s*and\s*4|1\s*,\s*3\s*and\s*4|2\s*,\s*3\s*and\s*4|only\s+three)\b/i.test(correctText)) {
    correctCount = 3;
  } else if (/\b(?:neither|none)\b/i.test(correctText)) {
    correctCount = 0;
  }

  if (correctCount === null) return null;

  let newStem = stem;
  const promptRegex = /(?:Which of the (?:statements|pairs|above)[\s\S]*?(?:select the correct answer|code given below)?[:\?]?)\s*$/i;
  if (promptRegex.test(newStem)) {
    newStem = newStem.replace(promptRegex, 'How many of the above statements is/are correct?');
  } else {
    newStem += '\n\nHow many of the above statements is/are correct?';
  }

  const choices = [
    { text: 'Only one', count: 1 },
    { text: 'Only two', count: 2 },
    { text: totalStmts >= 3 ? 'All three' : 'Both 1 and 2', count: totalStmts },
    { text: 'None', count: 0 }
  ];

  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  const letters = ['A', 'B', 'C', 'D'];
  const newOptions = {};
  let newCorrectLetter = 'A';
  const optionMap = {};

  letters.forEach((l, idx) => {
    newOptions[l] = choices[idx].text;
    if (choices[idx].count === correctCount) {
      newCorrectLetter = l;
      optionMap[l] = correctLetter;
    } else {
      const wrongOriginals = letters.filter(x => x !== correctLetter);
      optionMap[l] = wrongOriginals[idx % wrongOriginals.length];
    }
  });

  return {
    ...question,
    stem: newStem,
    options: newOptions,
    correct_answer: newCorrectLetter,
    all_correct_answers: [newCorrectLetter],
    _option_map: optionMap
  };
}

function shuffleQuestionOptions(question) {
  if (!question || !question.options) return question;

  // 1. Try Match Question randomization first (shuffles List-II and recomputes answer codes)
  const matchResult = randomizeMatchQuestion(question);
  if (matchResult) return matchResult;

  // 2. Try Statement Question UPPCS 2024 format randomization (~50% chance for variety)
  if (Math.random() < 0.5) {
    const stmtResult = randomizeStatementQuestion(question);
    if (stmtResult) return stmtResult;
  }

  // 3. Fallback to standard option letter shuffling (A, B, C, D)
  const letters = ['A', 'B', 'C', 'D'];
  const hasAll = letters.every(l => question.options[l] && String(question.options[l]).trim());
  if (!hasAll) return question;

  const shuffled = [...letters];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const isIdentity = letters.every((l, idx) => shuffled[idx] === l);
  if (isIdentity) return question;

  const optionMap = {};
  const reverseMap = {};
  const newOptions = {};

  letters.forEach((newLetter, idx) => {
    const originalLetter = shuffled[idx];
    optionMap[newLetter] = originalLetter;
    reverseMap[originalLetter] = newLetter;
    newOptions[newLetter] = question.options[originalLetter];
  });

  const newCorrectAnswer = reverseMap[question.correct_answer] || question.correct_answer;
  const newAllCorrect = (question.all_correct_answers || [question.correct_answer])
    .map(a => reverseMap[a] || a);

  return {
    ...question,
    options: newOptions,
    correct_answer: newCorrectAnswer,
    all_correct_answers: newAllCorrect,
    _option_map: optionMap
  };
}

// ------------------- AUTHENTICATION ROUTES ------------------- //

// Public configuration endpoint
app.get('/api/auth/config', (req, res) => {
  res.json({
    success: true,
    adminEmail: ADMIN_EMAIL,
    adminName: ADMIN_NAME
  });
});

// Register new user (student or admin)
app.post('/api/auth/register', checkDb, async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existing = await db.collection('users').findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (cleanEmail === ADMIN_EMAIL) ? 'admin' : 'student';
    const defaultName = (cleanEmail === ADMIN_EMAIL) ? ADMIN_NAME : cleanEmail.split('@')[0];
    const newUser = {
      email: cleanEmail,
      name: (name || defaultName).trim(),
      password: hashedPassword,
      role: role,
      status: 'active',
      created_at: new Date(),
      last_login: new Date()
    };

    const insertResult = await db.collection('users').insertOne(newUser);
    newUser._id = insertResult.insertedId;

    const token = generateToken(newUser);
    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: false,
      path: '/',
      sameSite: 'lax'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        userId: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', checkDb, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const user = await db.collection('users').findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact administrator.' });
    }

    // Verify password
    let isMatch = await bcrypt.compare(password, user.password);
    // Backward compatibility for admin default password fallback
    if (!isMatch && cleanEmail === ADMIN_EMAIL && (password === BASIC_AUTH_PASS || password === 'Admin@2026!')) {
      isMatch = true;
      const upgradedHash = await bcrypt.hash(password, 10);
      await db.collection('users').updateOne({ _id: user._id }, { $set: { password: upgradedHash } });
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Update last login
    await db.collection('users').updateOne({ _id: user._id }, { $set: { last_login: new Date() } });

    const token = generateToken(user);
    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: false,
      path: '/',
      sameSite: 'lax'
    });

    res.json({
      success: true,
      token,
      user: {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify & Get Current User profile
app.get(['/api/auth/verify', '/api/auth/me'], requireAuth, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: req.user
  });
});

// Change own password
app.post('/api/auth/change-password', requireAuth, checkDb, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.collection('users').updateOne({ _id: user._id }, { $set: { password: hashed, updated_at: new Date() } });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ------------------- ADMIN USER MANAGEMENT ROUTES ------------------- //

// List all users with statistics
app.get('/api/admin/users', requireAdmin, checkDb, async (req, res) => {
  try {
    const users = await db.collection('users').find({}).sort({ created_at: -1 }).toArray();

    // Enrich users with study metrics
    const enrichedUsers = await Promise.all(users.map(async (u) => {
      const uId = u._id.toString();
      const testsCount = await db.collection('chapter_tests').countDocuments({ userId: uId });
      const revisionsCount = await db.collection('revisions').countDocuments({ userId: uId });
      
      const studyAgg = await db.collection('daily_study_time').aggregate([
        { $match: { userId: uId } },
        { $group: { _id: null, totalSeconds: { $sum: '$seconds' } } }
      ]).toArray();

      const totalStudySeconds = studyAgg[0]?.totalSeconds || 0;

      return {
        _id: uId,
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status || 'active',
        created_at: u.created_at,
        last_login: u.last_login,
        tests_count: testsCount,
        revisions_count: revisionsCount,
        total_study_seconds: totalStudySeconds
      };
    }));

    res.json({ success: true, users: enrichedUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin creates a user
app.post('/api/admin/users', requireAdmin, checkDb, async (req, res) => {
  try {
    const { email, password, name, role = 'student' } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.collection('users').findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email: cleanEmail,
      name: (name || cleanEmail.split('@')[0]).trim(),
      password: hashedPassword,
      role: (cleanEmail === ADMIN_EMAIL || role === 'admin') ? 'admin' : 'student',
      status: 'active',
      created_at: new Date(),
      last_login: null
    };

    const insertResult = await db.collection('users').insertOne(newUser);
    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        _id: insertResult.insertedId.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        created_at: newUser.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin updates a user's password
app.put('/api/admin/users/:id/password', requireAdmin, checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword, updated_at: new Date() } }
    );

    res.json({ success: true, message: `Password for ${user.email} updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin updates user role
app.put('/api/admin/users/:id/role', requireAdmin, checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    if (!['admin', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or student.' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.email.toLowerCase() === ADMIN_EMAIL && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot demote the primary Super Admin account.' });
    }

    await db.collection('users').updateOne({ _id: user._id }, { $set: { role, updated_at: new Date() } });
    res.json({ success: true, message: `Role for ${user.email} updated to ${role}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin updates user status (active / suspended)
app.put('/api/admin/users/:id/status', requireAdmin, checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be active or suspended.' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.email.toLowerCase() === ADMIN_EMAIL) {
      return res.status(400).json({ error: 'Cannot suspend the primary Super Admin account.' });
    }

    await db.collection('users').updateOne({ _id: user._id }, { $set: { status, updated_at: new Date() } });
    res.json({ success: true, message: `Account status for ${user.email} set to ${status}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin deletes a user
app.delete('/api/admin/users/:id', requireAdmin, checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.email.toLowerCase() === ADMIN_EMAIL || user._id.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete the Super Admin account or your own logged in account.' });
    }

    const uId = user._id.toString();
    await db.collection('users').deleteOne({ _id: user._id });

    // Cascade delete user data
    await Promise.all([
      db.collection('chapter_tests').deleteMany({ userId: uId }),
      db.collection('tests').deleteMany({ userId: uId }),
      db.collection('revisions').deleteMany({ userId: uId }),
      db.collection('daily_planner').deleteMany({ userId: uId }),
      db.collection('daily_study_time').deleteMany({ userId: uId }),
      db.collection('weak_topics').deleteMany({ userId: uId }),
      db.collection('weak_subtopics').deleteMany({ userId: uId })
    ]);

    res.json({ success: true, message: `User ${user.email} and associated data deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin platform overview statistics
app.get('/api/admin/stats', requireAdmin, checkDb, async (req, res) => {
  try {
    const totalUsers = await db.collection('users').countDocuments();
    const activeUsers = await db.collection('users').countDocuments({ status: 'active' });
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    const totalTests = await db.collection('chapter_tests').countDocuments();
    const totalRevisions = await db.collection('revisions').countDocuments();
    const totalQuestions = await db.collection('questions').countDocuments();

    const studyAgg = await db.collection('daily_study_time').aggregate([
      { $group: { _id: null, totalSeconds: { $sum: '$seconds' } } }
    ]).toArray();
    const totalStudySeconds = studyAgg[0]?.totalSeconds || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminCount,
        studentCount: Math.max(0, totalUsers - adminCount),
        totalTests,
        totalRevisions,
        totalQuestions,
        totalStudySeconds
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
app.get('/api/topic-status', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, topic } = req.query;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic query parameters are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();
    const uId = req.user.userId;

    // Query revisions for current user
    const revisions = await db.collection('revisions')
      .find({ userId: uId, subject: normSubject, topic: normTopic })
      .sort({ date: -1 })
      .toArray();

    // Query PYQs for current user
    const pyqs = await db.collection('pyqs')
      .find({ userId: uId, subject: normSubject, topic: normTopic })
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
      recent_revisions: revisions,
      recent_pyqs: pyqs.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Log Revision
app.post('/api/revisions', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, topic, topic_title, confidence, notes, date } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();
    const uId = req.user.userId;

    // Count existing revisions for this topic & user to determine next revision number
    const count = await db.collection('revisions').countDocuments({
      userId: uId,
      subject: normSubject,
      topic: normTopic
    });
    const revNum = count + 1;
    const logDate = date ? new Date(date) : new Date();
    const nextDue = calculateNextDueDate(logDate, revNum);

    const doc = {
      userId: uId,
      userEmail: req.user.email,
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
app.get('/api/revisions', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, topic, limit = 50, targetUserId } = req.query;
    const filter = {
      userId: (req.user.role === 'admin' && targetUserId) ? targetUserId : req.user.userId
    };
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
app.get('/api/revisions/due', requireAuth, checkDb, async (req, res) => {
  try {
    const now = new Date();
    const uId = req.user.userId;
    // Aggregation to find the latest revision per subject+topic for this user
    const pipeline = [
      { $match: { userId: uId } },
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
app.post('/api/pyqs', requireAuth, checkDb, async (req, res) => {
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
      userId: req.user.userId,
      userEmail: req.user.email,
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

app.get('/api/pyqs', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, topic, limit = 50, targetUserId } = req.query;
    const filter = {
      userId: (req.user.role === 'admin' && targetUserId) ? targetUserId : req.user.userId
    };
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
app.post('/api/tests', requireAuth, checkDb, async (req, res) => {
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
      userId: req.user.userId,
      userEmail: req.user.email,
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

app.get('/api/tests', requireAuth, checkDb, async (req, res) => {
  try {
    const { limit = 50, targetUserId } = req.query;
    const filter = {
      userId: (req.user.role === 'admin' && targetUserId) ? targetUserId : req.user.userId
    };
    const items = await db.collection('tests')
      .find(filter)
      .sort({ date: -1 })
      .limit(Number(limit))
      .toArray();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tests/:id', requireAuth, checkDb, async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    if (req.user.role !== 'admin') {
      filter.userId = req.user.userId;
    }
    await db.collection('tests').deleteOne(filter);
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
      // Fisher-Yates shuffle question order
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      // Shuffle A/B/C/D options within each question to prevent
      // predictable answer patterns (Match-List always A, Chronology always A, etc.)
      questions = questions.map(q => shuffleQuestionOptions(q));
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
app.post('/api/chapter-test/evaluate', requireAuth, checkDb, async (req, res) => {
  try {
    const {
      subject,
      topic,
      chapter,
      topic_title,
      time_spent_seconds = 0,
      test_mode = 'Full Chapter Practice',
      answers = {},        // Map of { [q_id]: 'A' | 'B' | 'C' | 'D' }
      option_maps = {}     // Map of { [q_id]: { A: origLetter, B: origLetter, ... } }
    } = req.body;

    const targetTopic = (topic || chapter || '').trim();
    if (!subject || !targetTopic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    // Client sends the full list of question_ids tested (e.g. 50 questions)
    const testQuestionIds = (Array.isArray(req.body.question_ids) && req.body.question_ids.length > 0)
      ? req.body.question_ids
      : Object.keys(answers || {});

    const escapedTopic = targetTopic.replace(/[-_]/g, '[-_ ]');
    const topicRegex = new RegExp(`^${escapedTopic}$`, 'i');
    const subjectRegex = new RegExp(`^${subject.toLowerCase().trim().replace(/[-_]/g, '[-_ ]')}$`, 'i');

    let dbQuestions = [];
    if (testQuestionIds.length > 0) {
      // Fetch all specifically tested questions from MongoDB
      const foundQuestions = await db.collection('questions')
        .find({ q_id: { $in: testQuestionIds } })
        .toArray();
      // Maintain exact test ordering
      const qMap = new Map();
      foundQuestions.forEach(q => qMap.set(q.q_id, q));
      dbQuestions = testQuestionIds.map(id => qMap.get(id)).filter(Boolean);
    }

    // Fallback if question_ids not found in DB
    if (dbQuestions.length === 0) {
      dbQuestions = await db.collection('questions')
        .find({
          subject: { $regex: subjectRegex },
          chapter: { $regex: topicRegex }
        })
        .sort({ q_num: 1 })
        .limit(req.body.is_mastery_gate ? 50 : 200)
        .toArray();
    }

    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const detailedReview = [];
    const wrongQuestions = [];
    const unattemptedQuestions = [];

    dbQuestions.forEach((q, idx) => {
      let userAns = (answers[q.q_id] || '').toUpperCase().trim();
      const validAnswers = q.all_correct_answers || [q.correct_answer];
      let isCorrect = null;

      // De-map shuffled user answer back to canonical letter using option_maps
      // option_maps[q_id] = { A: 'C', B: 'A', C: 'D', D: 'B' } means
      // "new A shows original C", so if user picked new A, canonical answer is C
      const qMap = option_maps[q.q_id];
      if (qMap && userAns && qMap[userAns]) {
        userAns = qMap[userAns].toUpperCase();
      }

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
            explanation: q.explanation,
            was_incorrect: true
          });
        }
      } else {
        unattempted++;
        unattemptedQuestions.push({
          q_id: q.q_id,
          q_num: idx + 1,
          q_header: q.q_header,
          section_title: q.section_title || 'General Notes',
          stem: q.stem,
          options: q.options,
          user_answer: null,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          was_unattempted: true
        });
      }

      // For the detailed review, show the canonical (original) options and answers
      // so the review makes sense regardless of what shuffled order was shown
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
      userId: req.user.userId,
      userEmail: req.user.email,
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
      unattempted_questions: unattemptedQuestions,
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
        { userId: req.user.userId, subject: evaluationDoc.subject, chapter: targetTopic, subtopic: ws.subtopic },
        {
          $set: {
            userId: req.user.userId,
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

    // Strict Chapter Mastery Gate: Requires at least 80% score of the TOTAL EXAM marks to mark read
    const isMasteryGate = req.body.is_mastery_gate === true;
    const isMasteryRedemption = req.body.is_mastery_redemption === true;
    const minMasteryScorePct = 80;

    // Must achieve >= 80% of total exam marks (netMarks / maxMarks) for standard qualifying exam,
    // OR strictly 100% accuracy (all questions correct) on targeted redemption drill
    const isStandardMasteryPassed = isMasteryGate && (totalQuestions >= 5) && (scorePct >= minMasteryScorePct) && (netMarks > 0);
    const isRedemptionPassed = isMasteryRedemption && (totalQuestions >= 5) && (correct === totalQuestions);
    const isMasteryPassed = isStandardMasteryPassed || isRedemptionPassed;
    let newRevisionNumber = null;

    if (isMasteryPassed) {
      // 1. Record officially certified +1 Read in revisions collection
      const count = await db.collection('revisions').countDocuments({
        userId: req.user.userId,
        subject: evaluationDoc.subject,
        topic: targetTopic
      });
      newRevisionNumber = count + 1;
      const logDate = new Date();
      const stageName = isRedemptionPassed ? '⚡ Chapter Conquered (100% Redemption Drill)' : '🏆 Chapter Mastery Exam Passed';
      const notesMsg = isRedemptionPassed
        ? `⚡ Chapter Conquered via 100% Mastery Redemption Drill • 100% Accuracy (${correct}/${totalQuestions} Correct) • All Previous Mistakes Eliminated`
        : `🏆 Chapter Mastery Exam Passed • Total Score: ${scorePct}% (${netMarks > 0 ? '+' : ''}${netMarks}/${maxMarks} marks) • Accuracy: ${accuracy}% (${correct}/${totalQuestions} Correct, ${incorrect} Incorrect, ${unattempted} Unattempted)`;

      await db.collection('revisions').insertOne({
        userId: req.user.userId,
        userEmail: req.user.email,
        subject: evaluationDoc.subject,
        topic: targetTopic,
        topic_title: evaluationDoc.topic_title,
        revision_number: newRevisionNumber,
        confidence: 5,
        stage: stageName,
        notes: notesMsg,
        score_pct: scorePct,
        net_marks: netMarks,
        max_marks: maxMarks,
        accuracy_pct: accuracy,
        total_questions: totalQuestions,
        correct: correct,
        incorrect: incorrect,
        unattempted: unattempted,
        time_spent_seconds: time_spent_seconds,
        test_id: insertRes.insertedId,
        date: logDate,
        next_revision_due: calculateNextDueDate(logDate, newRevisionNumber),
        created_at: new Date()
      });

      // 2. Automatically resolve topic in daily_planner collections for any date & backlog
      await db.collection('daily_planner').updateMany(
        { userId: req.user.userId, 'reading_topics.subject': evaluationDoc.subject, 'reading_topics.topic': targetTopic },
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
        userId: req.user.userId,
        subject: evaluationDoc.subject,
        topic: targetTopic
      });
      isClearedMastery = true;
    } else if ((accuracy < 75 || incorrect >= 2) && attempted > 0) {
      isAutoFlagged = true;
      await db.collection('weak_topics').updateOne(
        { userId: req.user.userId, subject: evaluationDoc.subject, topic: targetTopic },
        {
          $set: {
            userId: req.user.userId,
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
        userId: req.user.userId,
        subject: evaluationDoc.subject,
        topic: targetTopic
      });
    }

    // Also update pyqs collection for user dashboard metrics
    await db.collection('pyqs').insertOne({
      userId: req.user.userId,
      userEmail: req.user.email,
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
      is_mastery_redemption: isMasteryRedemption,
      mastery_passed: isMasteryPassed,
      redemption_passed: isRedemptionPassed,
      new_read_count: newRevisionNumber,
      scorecard: {
        ...evaluationDoc,
        auto_flagged: isAutoFlagged,
        cleared_mastery: isClearedMastery,
        mastery_gate: isMasteryGate,
        is_mastery_redemption: isMasteryRedemption,
        mastery_passed: isMasteryPassed,
        redemption_passed: isRedemptionPassed,
        new_read_count: newRevisionNumber,
        _id: insertRes.insertedId
      },
      detailed_review: detailedReview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chapter-tests', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, topic, limit = 50, targetUserId } = req.query;
    const filter = {
      userId: (req.user.role === 'admin' && targetUserId) ? targetUserId : req.user.userId
    };
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

      // Enrich trap questions missing/empty options from questions collection
      const missingOptionIds = Array.from(trapMap.values())
        .filter(t => {
          const opts = t.options;
          const hasText = opts && opts.A && String(opts.A).trim() && opts.B && String(opts.B).trim();
          return ((!hasText) || !t.explanation) && t.q_id && !t.q_id.startsWith('q_');
        })
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
              const hasText = item.options && item.options.A && String(item.options.A).trim();
              if (!hasText && fullQ.options) item.options = fullQ.options;
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
      subject: req.query.subject,
      topic: targetTopic,
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
app.post('/api/quick-read', requireAuth, checkDb, async (req, res) => {
  try {
    const {
      subject,
      topic,
      topic_title,
      notes = '',
      confidence = 3,
      stage = '',
      score_pct = null,
      net_marks = null,
      max_marks = null,
      accuracy_pct = null,
      total_questions = null,
      correct = null,
      incorrect = null,
      unattempted = null,
      time_spent_seconds = null,
      test_id = null
    } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();
    const uId = req.user.userId;

    const count = await db.collection('revisions').countDocuments({
      userId: uId,
      subject: normSubject,
      topic: normTopic
    });
    const revNum = count + 1;
    const logDate = new Date();
    const nextDue = calculateNextDueDate(logDate, revNum);

    const doc = {
      userId: uId,
      userEmail: req.user.email,
      subject: normSubject,
      topic: normTopic,
      topic_title: topic_title || normTopic,
      revision_number: revNum,
      confidence: Number(confidence) || 3,
      stage: stage || `Revision #${revNum}`,
      notes: notes || `Read #${revNum} marked`,
      score_pct: score_pct != null ? Number(score_pct) : null,
      net_marks: net_marks != null ? Number(net_marks) : null,
      max_marks: max_marks != null ? Number(max_marks) : null,
      accuracy_pct: accuracy_pct != null ? Number(accuracy_pct) : null,
      total_questions: total_questions != null ? Number(total_questions) : null,
      correct: correct != null ? Number(correct) : null,
      incorrect: incorrect != null ? Number(incorrect) : null,
      unattempted: unattempted != null ? Number(unattempted) : null,
      time_spent_seconds: time_spent_seconds != null ? Number(time_spent_seconds) : null,
      test_id: test_id || null,
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
app.get('/api/dashboard/summary', requireAuth, checkDb, async (req, res) => {
  try {
    const uId = req.user.userId;
    const userFilter = { userId: uId };

    // Revisions stats
    const totalRevisions = await db.collection('revisions').countDocuments(userFilter);

    // Due revisions count
    const now = new Date();
    const dueCountPipeline = [
      { $match: userFilter },
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
    const chapterTests = await db.collection('chapter_tests').find(userFilter).sort({ date: -1 }).toArray();
    const customTests = await db.collection('tests').find(userFilter).sort({ date: -1 }).toArray();
    const allTests = [...chapterTests, ...customTests].sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalTests = allTests.length;
    let avgTestScore = 0;
    let avgAccuracy = 0;
    if (totalTests > 0) {
      avgTestScore = Number((allTests.reduce((acc, t) => acc + (t.net_marks || 0), 0) / totalTests).toFixed(2));
      avgAccuracy = Number((allTests.reduce((acc, t) => acc + (Number(t.accuracy_pct) || 0), 0) / totalTests).toFixed(1));
    }

    // PYQs stats
    const pyqs = await db.collection('pyqs').find(userFilter).toArray();
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

    const allRevs = await db.collection('revisions').find(userFilter).toArray();
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
    const manualWeak = await db.collection('weak_topics').find(userFilter).sort({ updated_at: -1 }).toArray();
    const lowConfRevs = await db.collection('revisions').find({ ...userFilter, confidence: { $lte: 2 } }).sort({ date: -1 }).toArray();
    const lowAccTests = await db.collection('chapter_tests').find({ ...userFilter, accuracy_pct: { $lt: 60 }, attempted: { $gt: 0 } }).sort({ date: -1 }).toArray();

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
app.get('/api/weak-topics', requireAuth, checkDb, async (req, res) => {
  try {
    const uId = req.user.userId;
    const userFilter = { userId: uId };

    const manualWeak = await db.collection('weak_topics').find(userFilter).sort({ updated_at: -1 }).toArray();
    const lowConfRevs = await db.collection('revisions').find({ ...userFilter, confidence: { $lte: 2 } }).sort({ date: -1 }).toArray();
    const lowAccTests = await db.collection('chapter_tests').find({ ...userFilter, accuracy_pct: { $lt: 75 }, attempted: { $gt: 0 } }).sort({ date: -1 }).toArray();

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

app.post('/api/weak-topics', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, topic, topic_title, reason, notes } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();
    const uId = req.user.userId;

    const doc = {
      userId: uId,
      subject: normSubject,
      topic: normTopic,
      topic_title: topic_title || normTopic,
      reason: (reason || 'Manually Mapped Weak Area').trim(),
      notes: (notes || '').trim(),
      is_weak: true,
      updated_at: new Date()
    };

    await db.collection('weak_topics').updateOne(
      { userId: uId, subject: normSubject, topic: normTopic },
      { $set: doc },
      { upsert: true }
    );

    res.json({ success: true, message: `Mapped ${normTopic} as weak topic`, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/weak-topics', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, topic } = req.body || req.query;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic are required' });
    }

    const normSubject = subject.toLowerCase().trim();
    const normTopic = topic.trim();
    const uId = req.user.userId;

    await db.collection('weak_topics').deleteOne({ userId: uId, subject: normSubject, topic: normTopic });
    res.json({ success: true, message: `Removed ${normTopic} from weak topics (marked mastered)` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7b. Weak Subtopics Radar (Automatic aggregation from live tests)
app.get('/api/weak-subtopics', requireAuth, checkDb, async (req, res) => {
  try {
    const { subject, chapter, limit = 50, targetUserId } = req.query;
    const filter = {
      userId: (req.user.role === 'admin' && targetUserId) ? targetUserId : req.user.userId
    };
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
app.get('/api/daily-planner', requireAuth, checkDb, async (req, res) => {
  try {
    const targetDate = req.query.date || getTodayStr();
    const uId = req.user.userId;
    let doc = await db.collection('daily_planner').findOne({ userId: uId, date: targetDate });

    if (!doc) {
      doc = {
        userId: uId,
        userEmail: req.user.email,
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
app.post('/api/daily-planner/topic', requireAuth, checkDb, async (req, res) => {
  try {
    const { date, subject, topic, slot = 'morning_12pm', notes = '' } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: 'Subject and topic are required' });
    }
    const targetDate = date || getTodayStr();
    const uId = req.user.userId;

    // Enforce strict 10-chapter limit for active/pending reading targets
    const plannerDoc = await db.collection('daily_planner').findOne({ userId: uId, date: targetDate });
    const existingTopics = (plannerDoc && Array.isArray(plannerDoc.reading_topics)) ? plannerDoc.reading_topics : [];
    const pendingCount = existingTopics.filter(t => t.status !== 'achieved').length;

    if (pendingCount >= 10) {
      return res.status(400).json({
        error: 'Active Chapter Limit Reached: You can only have at most 10 active chapters at a time in your Prep Tracker. Please read these first and mark +1 Read count before adding more.',
        limit_reached: true,
        pending_count: pendingCount,
        max_allowed: 10
      });
    }

    const newTopic = {
      id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      userId: uId,
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
      { userId: uId, date: targetDate },
      {
        $push: { reading_topics: newTopic },
        $set: { updated_at: new Date() },
        $setOnInsert: { userEmail: req.user.email, created_at: new Date(), daily_tasks: [] }
      },
      { upsert: true }
    );

    res.json({ success: true, topic: newTopic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record and sync chapter study time for date
app.post('/api/daily-planner/study-time', requireAuth, checkDb, async (req, res) => {
  try {
    const { date, subject, topic, seconds, title } = req.body;
    if (!subject || !topic || seconds === undefined) {
      return res.status(400).json({ error: 'Subject, topic, and seconds are required' });
    }
    const targetDate = date || getTodayStr();
    const cleanSub = String(subject).toLowerCase().trim();
    const cleanTop = String(topic).trim();
    const secNum = parseInt(seconds, 10) || 0;
    const uId = req.user.userId;

    // 1. Update daily_planner doc's reading_topics if the topic is present
    await db.collection('daily_planner').updateOne(
      { userId: uId, date: targetDate, 'reading_topics.subject': cleanSub, 'reading_topics.topic': cleanTop },
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
      { userId: uId, date: targetDate, subject: cleanSub, topic: cleanTop },
      {
        $set: {
          userId: uId,
          userEmail: req.user.email,
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
app.get('/api/daily-planner/study-time', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const targetDate = req.query.date || getTodayStr();
    const records = await db.collection('daily_study_time').find({ userId: uId, date: targetDate }).toArray();

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
app.patch('/api/daily-planner/topic/:id', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
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

    let result = await db.collection('daily_planner').updateOne(
      { userId: uId, date: targetDate, 'reading_topics.id': id },
      { $set: setFields }
    );

    if (!result || result.matchedCount === 0) {
      result = await db.collection('daily_planner').updateOne(
        { userId: uId, 'reading_topics.id': id },
        { $set: setFields }
      );
    }

    if (!result || result.matchedCount === 0) {
      return res.status(404).json({ error: 'Topic target not found' });
    }

    res.json({ success: true, message: 'Reading target updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete reading topic
app.delete('/api/daily-planner/topic/:id', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const { id } = req.params;
    const targetDate = req.query?.date || (req.body && req.body.date);

    let result = null;
    if (targetDate) {
      result = await db.collection('daily_planner').updateOne(
        { userId: uId, date: targetDate },
        {
          $pull: { reading_topics: { id: id } },
          $set: { updated_at: new Date() }
        }
      );
    }
    if (!result || result.modifiedCount === 0) {
      result = await db.collection('daily_planner').updateMany(
        { userId: uId, 'reading_topics.id': id },
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
app.post('/api/daily-planner/task', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
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
      { userId: uId, date: targetDate },
      {
        $push: { daily_tasks: newTask },
        $set: { userId: uId, userEmail: req.user.email, updated_at: new Date() },
        $setOnInsert: { created_at: new Date() }
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
app.patch('/api/daily-planner/task/:id', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
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
        { userId: uId, date: targetDate, 'daily_tasks.id': id },
        { $set: setFields }
      );
    }
    if (!result || result.matchedCount === 0) {
      result = await db.collection('daily_planner').updateOne(
        { userId: uId, 'daily_tasks.id': id },
        { $set: setFields }
      );
    }

    res.json({ success: true, message: 'Task updated' });
  } catch (err) {
    console.error('[Update Task Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete daily task
app.delete('/api/daily-planner/task/:id', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const { id } = req.params;
    const targetDate = req.query?.date || (req.body && req.body.date);

    let result = null;
    if (targetDate) {
      result = await db.collection('daily_planner').updateOne(
        { userId: uId, date: targetDate },
        {
          $pull: { daily_tasks: { id: id } },
          $set: { updated_at: new Date() }
        }
      );
    }
    if (!result || result.modifiedCount === 0) {
      result = await db.collection('daily_planner').updateMany(
        { userId: uId, 'daily_tasks.id': id },
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
app.get('/api/daily-planner/overall-backlog', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const todayStr = getTodayStr();
    const docs = await db.collection('daily_planner')
      .find({ userId: uId, 'reading_topics.status': { $ne: 'achieved' } })
      .toArray();

    const overallBacklog = [];
    docs.forEach(doc => {
      const docDate = doc.date;
      const isPast = docDate < todayStr;
      (doc.reading_topics || []).forEach(t => {
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
app.post('/api/daily-planner/resolve-by-topic', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const { subject, topic } = req.body || {};
    if (!subject || !topic) {
      return res.status(400).json({ error: 'subject and topic required' });
    }

    const normSub = subject.toLowerCase().trim();
    const normTopic = topic.trim();

    const docs = await db.collection('daily_planner').find({
      userId: uId,
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
          { userId: uId, date: doc.date },
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
app.post('/api/daily-planner/evaluate-midnight', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const targetDate = (req.body && req.body.date) || req.query?.date || getTodayStr();
    const doc = await db.collection('daily_planner').findOne({ userId: uId, date: targetDate });
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
      { userId: uId, date: targetDate },
      { $set: { reading_topics: updatedTopics, updated_at: new Date() } }
    );

    res.json({ success: true, flagged_count: modifiedCount, message: `Midnight evaluation complete: ${modifiedCount} pending targets flagged.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Backward-compatible evaluate-12pm endpoint
app.post('/api/daily-planner/evaluate-12pm', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const targetDate = (req.body && req.body.date) || req.query?.date || getTodayStr();
    const doc = await db.collection('daily_planner').findOne({ userId: uId, date: targetDate });
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
      { userId: uId, date: targetDate },
      { $set: { reading_topics: updatedTopics, updated_at: new Date() } }
    );

    res.json({ success: true, flagged_count: modifiedCount, message: `Evaluation complete: ${modifiedCount} pending targets flagged.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rollover pending reading topics and tasks from another date
app.post('/api/daily-planner/rollover', checkDb, requireAuth, async (req, res) => {
  try {
    const uId = req.user.userId;
    const { from_date, to_date = getTodayStr() } = req.body || {};
    let sourceDate = from_date;
    if (!sourceDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      sourceDate = yesterday.toISOString().split('T')[0];
    }

    const sourceDoc = await db.collection('daily_planner').findOne({ userId: uId, date: sourceDate });
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
        { userId: uId, date: to_date },
        {
          $push: {
            reading_topics: { $each: pendingTopics },
            daily_tasks: { $each: incompleteTasks }
          },
          $set: { userId: uId, userEmail: req.user.email, updated_at: new Date() },
          $setOnInsert: { created_at: new Date() }
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

// Helper to generate a responsive, modern HTML Auth Portal for unauthenticated visitors
function getAuthPortalHtml(targetUrl = '/') {
  const safeTargetUrl = String(targetUrl).replace(/"/g, '&quot;');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UP-PCS Study Vault — Authentication Required</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(18, 25, 43, 0.85);
      --card-border: rgba(99, 102, 241, 0.2);
      --accent: #6366f1;
      --accent-hover: #4f46e5;
      --accent-glow: rgba(99, 102, 241, 0.4);
      --gold: #f59e0b;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --input-bg: #0f172a;
      --input-border: #334155;
      --error-bg: rgba(239, 68, 68, 0.15);
      --error-border: rgba(239, 68, 68, 0.35);
      --error-text: #fca5a5;
      --success-bg: rgba(16, 185, 129, 0.15);
      --success-border: rgba(16, 185, 129, 0.35);
      --success-text: #6ee7b7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      background-image: 
        radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 40%),
        linear-gradient(180deg, #090d16 0%, #06090e 100%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .portal-container {
      width: 100%;
      max-width: 480px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 1.25rem;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px -10px var(--accent-glow);
      overflow: hidden;
      animation: modalFadeIn 0.35s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .portal-header {
      padding: 2.25rem 2rem 1.5rem;
      text-align: center;
      background: linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .emblem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 1rem;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #fff;
      font-size: 1.75rem;
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
      margin-bottom: 1rem;
    }
    .title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.65rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #fff;
      margin-bottom: 0.35rem;
    }
    .subtitle {
      font-size: 0.88rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .badge-7d {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 600;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.25);
      padding: 0.15rem 0.55rem;
      border-radius: 9999px;
    }
    .tabs-bar {
      display: flex;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0 2rem;
      background: rgba(15, 23, 42, 0.4);
    }
    .tab-btn {
      flex: 1;
      padding: 0.95rem 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-muted);
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      color: #fff;
      border-bottom-color: var(--accent);
    }
    .tab-btn:hover:not(.active) {
      color: #cbd5e1;
    }
    .portal-body {
      padding: 2rem;
    }
    .alert {
      padding: 0.85rem 1rem;
      border-radius: 0.65rem;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
      display: none;
      line-height: 1.45;
    }
    .alert-error {
      background: var(--error-bg);
      border: 1px solid var(--error-border);
      color: var(--error-text);
    }
    .alert-success {
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: var(--success-text);
    }
    .form-group {
      margin-bottom: 1.2rem;
    }
    label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.45rem;
    }
    input {
      width: 100%;
      padding: 0.82rem 1rem;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 0.65rem;
      color: #fff;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }
    .btn-submit {
      width: 100%;
      padding: 0.88rem 1.25rem;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: #fff;
      border: none;
      border-radius: 0.65rem;
      font-size: 1rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      margin-top: 0.5rem;
    }
    .btn-submit:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
    }
    .btn-submit:active {
      transform: translateY(0);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .portal-footer {
      padding: 1.25rem 2rem 1.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .portal-footer strong {
      color: var(--gold);
    }
  </style>
</head>
<body>
  <div class="portal-container">
    <div class="portal-header">
      <div class="emblem">🏛️</div>
      <h1 class="title">UP-PCS Study Vault</h1>
      <div class="subtitle">
        <span>Protected Knowledge Base</span>
        <span class="badge-7d">7-Day JWT Session</span>
      </div>
    </div>

    <div class="tabs-bar">
      <button type="button" class="tab-btn active" id="tab-login-btn" onclick="switchAuthTab('login')">Sign In</button>
      <button type="button" class="tab-btn" id="tab-register-btn" onclick="switchAuthTab('register')">Create Account</button>
    </div>

    <div class="portal-body">
      <div id="alert-box" class="alert"></div>

      <!-- Login Form -->
      <form id="login-form" onsubmit="handleAuthSubmit(event, 'login')">
        <div class="form-group">
          <label for="login-email">Email Address</label>
          <input type="email" id="login-email" required placeholder="name@example.com" autocomplete="username">
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" required placeholder="••••••••••••" autocomplete="current-password">
        </div>
        <button type="submit" class="btn-submit" id="login-submit-btn">Sign In & Enter Vault</button>
      </form>

      <!-- Register Form -->
      <form id="register-form" style="display: none;" onsubmit="handleAuthSubmit(event, 'register')">
        <div class="form-group">
          <label for="reg-name">Full Name</label>
          <input type="text" id="reg-name" required placeholder="Aspirant Name">
        </div>
        <div class="form-group">
          <label for="reg-email">Email Address</label>
          <input type="email" id="reg-email" required placeholder="name@example.com" autocomplete="username">
        </div>
        <div class="form-group">
          <label for="reg-password">Password (min. 6 chars)</label>
          <input type="password" id="reg-password" minlength="6" required placeholder="Create strong password" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label for="reg-confirm">Confirm Password</label>
          <input type="password" id="reg-confirm" minlength="6" required placeholder="Repeat password" autocomplete="new-password">
        </div>
        <button type="submit" class="btn-submit" id="reg-submit-btn">Create Account & Enter</button>
      </form>
    </div>

    <div class="portal-footer">
      <div>Primary Administrator: <strong>${ADMIN_NAME} (${ADMIN_EMAIL})</strong></div>
      <div>Role-isolated study trackers & automated revision engine.</div>
    </div>
  </div>

  <script>
    const targetUrl = "${safeTargetUrl}";

    function switchAuthTab(tab) {
      const loginForm = document.getElementById('login-form');
      const regForm = document.getElementById('register-form');
      const loginBtn = document.getElementById('tab-login-btn');
      const regBtn = document.getElementById('tab-register-btn');
      const alertBox = document.getElementById('alert-box');
      alertBox.style.display = 'none';

      if (tab === 'register') {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
        loginBtn.classList.remove('active');
        regBtn.classList.add('active');
      } else {
        regForm.style.display = 'none';
        loginForm.style.display = 'block';
        regBtn.classList.remove('active');
        loginBtn.classList.add('active');
      }
    }

    function showAlert(msg, isSuccess = false) {
      const el = document.getElementById('alert-box');
      el.textContent = msg;
      el.className = 'alert ' + (isSuccess ? 'alert-success' : 'alert-error');
      el.style.display = 'block';
    }

    async function handleAuthSubmit(e, action) {
      e.preventDefault();
      const btn = document.getElementById(action === 'login' ? 'login-submit-btn' : 'reg-submit-btn');
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Authenticating...';

      try {
        let endpoint = '/api/auth/login';
        let payload = {};

        if (action === 'login') {
          payload.email = document.getElementById('login-email').value.trim();
          payload.password = document.getElementById('login-password').value;
        } else {
          endpoint = '/api/auth/register';
          const p1 = document.getElementById('reg-password').value;
          const p2 = document.getElementById('reg-confirm').value;
          if (p1 !== p2) {
            throw new Error('Passwords do not match');
          }
          payload.name = document.getElementById('reg-name').value.trim();
          payload.email = document.getElementById('reg-email').value.trim();
          payload.password = p1;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Authentication failed');
        }

        // Save token to cookie with 7-day expiration
        const maxAge7Days = 7 * 24 * 60 * 60;
        document.cookie = 'uppcs_auth_token=' + encodeURIComponent(data.token) + '; Max-Age=' + maxAge7Days + '; Path=/; SameSite=Lax';
        
        // Also save to localStorage for client-side study tracker
        try {
          localStorage.setItem('UP_PCS_JWT_TOKEN', data.token);
          localStorage.setItem('UP_PCS_USER', JSON.stringify(data.user));
        } catch (_) {}

        showAlert('Authenticated successfully! Redirecting...', true);
        setTimeout(() => {
          window.location.href = targetUrl || '/';
        }, 300);
      } catch (err) {
        showAlert(err.message || 'An error occurred during authentication');
        btn.disabled = false;
        btn.textContent = origText;
      }
    }
  </script>
</body>
</html>`;
}

// Forward request to MkDocs (127.0.0.1:8000) or compiled site/ directory
function forwardToProxyOrSite(req, res) {
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
      if (fs.existsSync(filePath + '.html')) {
        return res.sendFile(filePath + '.html');
      }
      const notFoundPath = path.join(siteDir, '404.html');
      if (fs.existsSync(notFoundPath)) {
        return res.status(404).sendFile(notFoundPath);
      }
    }

    // Direct fallback to docs directory for stylesheets, javascripts, and catalog assets
    const docsDir = path.resolve(__dirname, '../docs');
    let reqPathClean = decodeURIComponent(req.path || '/');
    let docsFilePath = path.join(docsDir, reqPathClean);
    if (fs.existsSync(docsFilePath) && !fs.statSync(docsFilePath).isDirectory()) {
      return res.sendFile(docsFilePath);
    }

    res.status(502).send('Error connecting to MkDocs dev server on 127.0.0.1:8000. Ensure mkdocs serve is running or site is built.');
  });

  req.pipe(proxyReq, { end: true });
}

// Enforce authentication on all website access and reverse-proxy to MkDocs / site
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();

  // Allow static assets (CSS, JS, images, fonts) to load freely
  const isStaticAsset = /\.(css|js|map|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp)(\?.*)?$/i.test(req.path) ||
    req.path.startsWith('/assets/') || req.path.startsWith('/stylesheets/') || req.path.startsWith('/javascripts/');

  if (isStaticAsset) {
    return forwardToProxyOrSite(req, res);
  }

  // Check JWT authentication for all page viewing
  const token = extractToken(req);
  const user = token ? verifyJwtToken(token) : null;

  if (!user) {
    return res.status(401).send(getAuthPortalHtml(req.originalUrl));
  }

  req.user = user;
  return forwardToProxyOrSite(req, res);
});

// Start Server
app.listen(PORT, async () => {
  console.log(`[Server] Study Tracker API running on http://localhost:${PORT}`);
  await connectToMongo();
});
