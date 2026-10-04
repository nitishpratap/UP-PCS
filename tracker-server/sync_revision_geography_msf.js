/**
 * Sync docs/revision/must-score-facts/geography/*.md into MongoDB
 * using the revision desk keys the frontend expects:
 *   subject = "<folder> (Must Score Facts)"
 *   chapter = "msf__<filename_slug>"
 */
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { syncChapterQuestions } = require('./question_parser');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function run() {
  const only = process.argv.slice(2); // optional filenames
  const msfDir = path.resolve(__dirname, '../docs/revision/must-score-facts/geography');
  const files = fs
    .readdirSync(msfDir)
    .filter((f) => f.endsWith('.md') && !/^index|prompt/i.test(f) && /^\d/.test(f))
    .filter((f) => !only.length || only.includes(f) || only.includes(f.replace(/\.md$/, '')));

  console.log('[Sync] Connecting…');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');

  let total = 0;
  for (const file of files) {
    const full = path.join(msfDir, file);
    const slug = file.replace(/\.md$/, '');
    const subject = 'geography (Must Score Facts)';
    const chapter = `msf__${slug}`;
    const res = await syncChapterQuestions(db, full, subject, chapter);
    console.log(`[Synced] ${chapter}: ${res.count} questions`);
    total += res.count;
  }

  console.log(`[Done] ${total} questions across ${files.length} chapters`);
  await client.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
