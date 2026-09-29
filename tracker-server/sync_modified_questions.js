const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { syncChapterQuestions } = require('./question_parser');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

const modifiedFiles = [
  'ancient history/01_Stone_Age.md',
  'ancient history/03_Vedic_Civilization.md',
  'ancient history/09_Gupta_Age.md',
  'ancient history/11_Ancient_Indian_Administration.md',
  'ancient history/12_Ancient_Indian_Economy.md',
  'ancient history/13_Archaeology.md',
  'ancient history/14_Ancient_India_Miscellaneous.md',
  'art and culture/02_Religious_and_Philosophical_Traditions.md',
  'art and culture/03_Indian_Architecture.md',
  'art and culture/06_Indian_Dance.md',
  'art and culture/11_Medieval_Indian_Cultural_History.md',
  'art and culture/12_Sculpture.md',
  'environments & ecology/19_Climate_and_Environmental_Institutions.md',
  'medieval india/02_Turkish_Invasions_Delhi_Sultanate.md',
  'medieval india/04_Bhakti_Sufi_Movements.md',
  'medieval india/07_Mughal_Empire.md',
  'medieval india/08_Sher_Shah_Suri.md',
  'medieval india/09_Rajputs.md',
  'medieval india/10_Sikhism.md',
  'mordern india/04_British_Administration_and_Economy.md',
  'polity/13_Statutory_and_Non_Constitutional_Bodies.md'
];

async function runSync() {
  console.log('[Sync] Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  console.log(`[Sync] Connected to ${db.databaseName}!`);

  const subjectsDir = path.resolve(__dirname, '../docs/subjects');
  let totalUpdated = 0;

  for (const rel of modifiedFiles) {
    const fullPath = path.join(subjectsDir, rel);
    const parts = rel.split('/');
    const subject = parts[0];
    const chapterSlug = path.basename(rel, '.md');

    const res = await syncChapterQuestions(db, fullPath, subject, chapterSlug);
    console.log(`[Synced] ${subject}/${chapterSlug}: ${res.count} questions updated in DB`);
    totalUpdated += res.count;
  }

  console.log(`\n[Sync Complete] Successfully synchronized ${totalUpdated} questions across ${modifiedFiles.length} chapters to MongoDB Atlas!`);
  await client.close();
}

runSync().catch(console.error);
