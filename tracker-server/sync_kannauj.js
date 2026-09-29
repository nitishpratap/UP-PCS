const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { parseQuestionsFromMarkdown } = require('./question_parser');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function testSync() {
  const filePath = path.resolve(__dirname, '../docs/subjects/medieval india/08_Sher_Shah_Suri.md');
  const { chapterTitle, questions } = parseQuestionsFromMarkdown(filePath, 'medieval india', '08_Sher_Shah_Suri');
  const kannauj = questions.find(q => q.stem && q.stem.includes('Kannauj/Bilgram'));
  console.log('Parsed Kannauj Question from MD:');
  console.log('  ID:', kannauj.q_id);
  console.log('  Correct Answer:', kannauj.correct_answer);
  console.log('  Options:', kannauj.options);

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const qCol = db.collection('questions');
  const res = await qCol.updateOne(
    { q_id: kannauj.q_id },
    { $set: kannauj },
    { upsert: true }
  );
  console.log('[DB] Update result in MongoDB Atlas:', res);
  await client.close();
}

testSync().catch(console.error);
