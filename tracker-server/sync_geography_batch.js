const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { syncChapterQuestions } = require('./question_parser');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

const targetFiles = [
  'geography/21_World_Minerals_Energy.md',
  'geography/22_World_Industries.md',
  'geography/09_Transport_Communication.md',
  'geography/16_Oceans.md',
  'geography/12_Human_Geography.md',
  'geography/14_Earth_and_Universe.md',
  'geography/15_Geomorphology_and_Landform_Processes.md',
  'geography/23_Political_Map_Geography.md'
];

async function runSync() {
  console.log('[Sync] Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  console.log(`[Sync] Connected to ${db.databaseName}!`);

  const subjectsDir = path.resolve(__dirname, '../docs/subjects');
  let totalUpdated = 0;

  for (const rel of targetFiles) {
    const fullPath = path.join(subjectsDir, rel);
    const parts = rel.split('/');
    const subject = parts[0];
    const chapterSlug = path.basename(rel, '.md');

    const res = await syncChapterQuestions(db, fullPath, subject, chapterSlug);
    console.log(`[Synced] ${subject}/${chapterSlug}: ${res.count} questions updated in DB`);
    totalUpdated += res.count;
  }

  console.log(`\n[Sync Complete] Successfully synchronized ${totalUpdated} questions across ${targetFiles.length} chapters to MongoDB Atlas!`);
  await client.close();
}

runSync().catch(console.error);
