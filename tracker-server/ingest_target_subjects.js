#!/usr/bin/env node
/**
 * Ingest questions for selected subjects only (upsert by chapter).
 * Does NOT wipe other subjects' questions.
 */
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { syncChapterQuestions, parseQuestionsFromMarkdown } = require('./question_parser');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

const TARGETS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['polity', 'economy', 'science and technology', 'census and urbanisation', 'up special'];

function walkMd(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.') || entry === '_build' || entry.includes('.bak')) continue;
    const full = path.join(dir, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) results = results.concat(walkMd(full));
    else if (entry.endsWith('.md') && entry !== 'index.md' && entry !== 'prompt.md') {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  const subjectsDir = path.resolve(__dirname, '../docs/subjects');
  console.log('[Ingest] Connecting…');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  await db.collection('questions').createIndex({ q_id: 1 }, { unique: true });
  await db.collection('questions').createIndex({ subject: 1, chapter: 1 });

  // Baseline counts for non-target subjects (must not drop)
  const beforeOther = await db.collection('questions').countDocuments({
    subject: { $nin: TARGETS.map((s) => s.toLowerCase()) },
  });
  console.log(`[Ingest] Other-subject questions before: ${beforeOther}`);

  const summary = {};
  let total = 0;

  for (const subject of TARGETS) {
    const subDir = path.join(subjectsDir, subject);
    if (!fs.existsSync(subDir)) {
      console.warn(`[Ingest] Missing folder: ${subject}`);
      continue;
    }
    summary[subject] = { chapters: 0, questions: 0 };
    const files = walkMd(subDir);
    for (const filePath of files) {
      const rel = path.relative(subDir, filePath).replace(/\\/g, '/');
      const chapterSlug = rel.replace(/\.md$/i, '');
      const res = await syncChapterQuestions(db, filePath, subject, chapterSlug);
      summary[subject].chapters += 1;
      summary[subject].questions += res.count;
      total += res.count;
      if (res.count > 0) {
        console.log(`  ✓ ${subject}/${chapterSlug}: ${res.count}`);
      } else {
        console.log(`  · ${subject}/${chapterSlug}: 0`);
      }
    }
  }

  const afterOther = await db.collection('questions').countDocuments({
    subject: { $nin: TARGETS.map((s) => s.toLowerCase()) },
  });

  console.log('\n================ INGEST SUMMARY ================');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Total questions written (target subjects): ${total}`);
  console.log(`Other-subject questions before: ${beforeOther}`);
  console.log(`Other-subject questions after:  ${afterOther}`);
  if (afterOther < beforeOther) {
    console.error('WARNING: other-subject question count dropped!');
    process.exitCode = 2;
  } else {
    console.log('OK: other subjects untouched.');
  }
  console.log('================================================\n');

  // Spot-check API-shaped query
  for (const subject of TARGETS) {
    const n = await db.collection('questions').countDocuments({
      subject: subject.toLowerCase(),
    });
    console.log(`DB count [${subject}]: ${n}`);
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
