/**
 * Sync docs/revision/high-yield-tables/<subject>/*.md into MongoDB
 * using the revision desk keys the frontend expects:
 *   subject = "<folder> (High Yield Tables)"
 *   chapter = "hyt__<filename_slug>"
 *
 * Usage:
 *   node tracker-server/sync_revision_hyt.js
 *   node tracker-server/sync_revision_hyt.js geography
 *   node tracker-server/sync_revision_hyt.js geography 14_Earth_and_Universe.md
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
  const args = process.argv.slice(2);
  const hytRoot = path.resolve(__dirname, '../docs/revision/high-yield-tables');
  const subjectFilter = args.find((a) => !a.endsWith('.md') && !/^\d/.test(a));
  const fileFilters = args.filter((a) => a.endsWith('.md') || /^\d/.test(a));

  const subjects = fs
    .readdirSync(hytRoot)
    .filter((d) => fs.statSync(path.join(hytRoot, d)).isDirectory())
    .filter((d) => !subjectFilter || d.toLowerCase() === subjectFilter.toLowerCase());

  console.log('[Sync HYT] Connecting…');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');

  let total = 0;
  let chapters = 0;
  for (const subjectDir of subjects) {
    const dir = path.join(hytRoot, subjectDir);
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') && !/^index|prompt/i.test(f) && /^\d/.test(f))
      .filter(
        (f) =>
          !fileFilters.length ||
          fileFilters.includes(f) ||
          fileFilters.includes(f.replace(/\.md$/, ''))
      );

    for (const file of files) {
      const full = path.join(dir, file);
      const slug = file.replace(/\.md$/, '');
      const subject = `${subjectDir} (High Yield Tables)`;
      const chapter = `hyt__${slug}`;
      const res = await syncChapterQuestions(db, full, subject, chapter);
      console.log(`[Synced] ${subjectDir}/${chapter}: ${res.count} questions`);
      total += res.count;
      chapters += 1;
    }
  }

  console.log(`[Done] ${total} questions across ${chapters} chapters`);
  await client.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
