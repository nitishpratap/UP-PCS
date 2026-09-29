const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

async function check() {
  console.log('[Connecting] URI:', uri ? uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'NONE');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const collections = await db.listCollections().toArray();
  console.log(`\n=== Collections in ${db.databaseName} ===`);
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(` - ${c.name.padEnd(20)}: ${count} documents`);
  }

  const qSummary = await db.collection('questions').aggregate([
    { $group: { _id: '$subject', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  console.log('\n=== Questions Breakdown in DB by Subject ===');
  console.table(qSummary);

  // Check chapter_tests summary
  const testCount = await db.collection('chapter_tests').countDocuments();
  console.log(`\n=== Past Solved Tests in 'chapter_tests': ${testCount} documents ===`);
  if (testCount > 0) {
    const recentTests = await db.collection('chapter_tests').find({}, { projection: { subject: 1, topic: 1, accuracy_pct: 1, date: 1 } }).sort({ date: -1 }).limit(5).toArray();
    console.log('Most recent solved tests:', recentTests);
  }

  await client.close();
}
check().catch(console.error);
