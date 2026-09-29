const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function verifyLiveDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const qCol = db.collection('questions');

  const testIds = [
    'medieval_india_08_sher_shah_suri_35',
    'ancient_history_03_vedic_civilization_107',
    'medieval_india_07_mughal_empire_275',
    'art_and_culture_03_indian_architecture_129',
    'mordern_india_04_british_administration_and_economy_55',
    'polity_13_statutory_and_non_constitutional_bodies_156'
  ];

  console.log('=== VERIFYING LIVE MONGODB ATLAS QUESTIONS ===');
  for (const id of testIds) {
    const q = await qCol.findOne({ q_id: id });
    if (q) {
      console.log('Question ID: ' + q.q_id + ' (' + q.subject + ')');
      console.log('  Live Correct Answer in DB: ' + q.correct_answer);
      console.log('  Live Option text: ' + q.options[q.correct_answer]);
      console.log('  Explanation snippet: ' + (q.explanation || '').substring(0, 150).replace(/\n/g, ' '));
      console.log('--------------------------------------------------');
    } else {
      console.log('Not found: ' + id);
    }
  }

  await client.close();
}

verifyLiveDB().catch(console.error);
