const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function checkQuality() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const qCol = db.collection('questions');

  const total = await qCol.countDocuments();
  const emptyExp = await qCol.countDocuments({
    $or: [
      { explanation: { $exists: false } },
      { explanation: '' },
      { explanation: null }
    ]
  });

  const shortExp = await qCol.countDocuments({
    $expr: { $lt: [{ $strLenCP: { $ifNull: ['$explanation', ''] } }, 25] }
  });

  const missingAnswer = await qCol.countDocuments({
    $or: [
      { correct_answer: { $exists: false } },
      { correct_answer: '' },
      { correct_answer: { $nin: ['A', 'B', 'C', 'D'] } }
    ]
  });

  console.log('Total questions:', total);
  console.log('Empty explanations:', emptyExp);
  console.log('Short explanations (< 25 chars):', shortExp);
  console.log('Missing or non-ABCD answer keys:', missingAnswer);

  await client.close();
}

checkQuality().catch(console.error);
