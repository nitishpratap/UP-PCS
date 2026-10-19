const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { syncChapterQuestions } = require('./question_parser');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function syncAdvent() {
  console.log('[Sync] Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  console.log(`[Sync] Connected to ${db.databaseName}!`);

  const filePath = path.resolve(__dirname, '../docs/subjects/mordern india/01_Advent_of_Europeans.md');
  const subject = 'mordern india';
  const chapterSlug = '01_Advent_of_Europeans';

  const res = await syncChapterQuestions(db, filePath, subject, chapterSlug);
  console.log(`[Synced] ${subject}/${chapterSlug}: ${res.count} questions updated in MongoDB Atlas.`);

  // Verify questions in DB
  const qCol = db.collection('questions');
  const dbCount = await qCol.countDocuments({ subject: 'mordern india', chapter: chapterSlug });
  console.log(`[DB Verification] Total questions in MongoDB for ${chapterSlug}: ${dbCount}`);

  const catCounts = await qCol.aggregate([
    { $match: { subject: 'mordern india', chapter: chapterSlug } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]).toArray();
  console.log('[DB Categories]:', catCounts);

  await client.close();
  console.log('[Sync] Completed successfully and connection closed.');
}

syncAdvent().catch(err => {
  console.error('[Sync Error]:', err);
  process.exit(1);
});
