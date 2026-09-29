const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function checkDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const qCol = db.collection('questions');
  
  const total = await qCol.countDocuments();
  console.log('Total questions directly in MongoDB Atlas:', total);

  // Group by subject in MongoDB
  const bySubj = await qCol.aggregate([
    { $group: { _id: '$subject', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  console.log('\nBreakdown by subject in MongoDB:');
  bySubj.forEach(s => console.log(' ', s._id, ':', s.count));

  // Count AR questions directly in MongoDB
  // We should search for "Assertion" in stem OR in raw question fields
  const arTotal = await qCol.countDocuments({
    $or: [
      { stem: { $regex: /Assertion/i } },
      { question: { $regex: /Assertion/i } }
    ]
  });
  console.log('\nTotal AR questions directly in MongoDB:', arTotal);

  const arBySubj = await qCol.aggregate([
    {
      $match: {
        $or: [
          { stem: { $regex: /Assertion/i } },
          { question: { $regex: /Assertion/i } }
        ]
      }
    },
    { $group: { _id: '$subject', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  console.log('\nAR Questions Breakdown by subject in MongoDB:');
  arBySubj.forEach(s => console.log(' ', s._id, ':', s.count));

  // Also check if there are other collections in the database
  const collections = await db.listCollections().toArray();
  console.log('\nCollections in DB:', collections.map(c => c.name));

  await client.close();
}

checkDB().catch(console.error);
