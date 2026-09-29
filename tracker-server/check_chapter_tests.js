const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function checkChapterTests() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const ctCol = db.collection('chapter_tests');

  const tests = await ctCol.find().toArray();
  console.log(`Found ${tests.length} tests in chapter_tests:`);
  
  for (const t of tests) {
    console.log(`- Test: ${t.subject} / ${t.topic} | Mode: ${t.test_mode} | Score: ${t.correct}/${t.total_questions} | Date: ${t.date || t.created_at}`);
    if (t.wrong_questions && t.wrong_questions.length > 0) {
      console.log('   Wrong question IDs / samples:', t.wrong_questions.map(wq => typeof wq === 'string' ? wq : (wq.q_id || wq.question_id || wq.q_num || Object.keys(wq))));
    }
  }

  await client.close();
}

checkChapterTests().catch(console.error);
