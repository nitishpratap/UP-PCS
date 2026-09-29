const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function checkUserData() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');

  const collections = ['tests', 'chapter_tests', 'weak_topics', 'revisions', 'daily_planner', 'daily_study_time', 'weak_subtopics'];
  
  for (const c of collections) {
    const col = db.collection(c);
    const count = await col.countDocuments();
    const sample = await col.findOne();
    console.log('=== Collection: ' + c + ' (Count: ' + count + ') ===');
    if (sample) {
      console.log('Sample fields:', Object.keys(sample));
      if (c === 'chapter_tests' || c === 'tests') {
        console.log('Sample:', JSON.stringify(sample, null, 2).substring(0, 300));
      }
    }
  }

  await client.close();
}

checkUserData().catch(console.error);
