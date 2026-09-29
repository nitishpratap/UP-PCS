const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function auditDB_AR() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const qCol = db.collection('questions');

  // Fetch all AR questions from MongoDB
  const arDocs = await qCol.find({
    $or: [
      { stem: { $regex: /Assertion/i } },
      { question: { $regex: /Assertion/i } }
    ]
  }).toArray();

  console.log(`Total AR questions fetched from MongoDB: ${arDocs.length}`);
  fs.writeFileSync(path.resolve(__dirname, '../scratch/db_all_ar.json'), JSON.stringify(arDocs, null, 2));

  // Analyze answer distribution
  const ansCounts = {};
  let claimedExplCount = 0;
  const claimedExplBySubj = {};

  const claimedExplList = [];

  for (const doc of arDocs) {
    const ans = doc.correct_answer;
    ansCounts[ans] = (ansCounts[ans] || 0) + 1;

    const optText = (doc.options && doc.options[ans] ? doc.options[ans] : '').toLowerCase();
    const isExpl = (optText.includes('correct explanation') || optText.includes('explains')) && !optText.includes('not');

    if (isExpl) {
      claimedExplCount++;
      const subj = doc.subject || 'unknown';
      claimedExplBySubj[subj] = (claimedExplBySubj[subj] || 0) + 1;
      claimedExplList.push({
        q_id: doc.q_id,
        subject: doc.subject,
        chapter: doc.chapter,
        correct_answer: doc.correct_answer,
        options: doc.options,
        stem: doc.stem || doc.question,
        explanation: doc.explanation
      });
    }
  }

  console.log('Answer distribution across all AR questions in DB:', ansCounts);
  console.log(`Total questions in DB claiming R IS correct explanation: ${claimedExplCount}`);
  console.log('Claimed explanation by subject in DB:', claimedExplBySubj);

  fs.writeFileSync(path.resolve(__dirname, '../scratch/db_claimed_expl.json'), JSON.stringify(claimedExplList, null, 2));

  await client.close();
}

auditDB_AR().catch(console.error);
