const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

const MONGODB_URI = 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0&authSource=admin';

async function run() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const qCol = db.collection('questions');

  const total = await qCol.countDocuments({});
  console.log('Total questions in DB:', total);

  const noAns = await qCol.countDocuments({ correct_answer: null });
  console.log('Questions with no correct_answer:', noAns);

  const arAll = await qCol.find(
    { stem: /Assertion/i },
    { projection: { q_id:1, subject:1, chapter:1, correct_answer:1, options:1, explanation:1 } }
  ).toArray();

  console.log('\nTotal A/R questions (by stem regex):', arAll.length);
  const dist = {};
  for(const q of arAll) { const k = q.correct_answer||'(none)'; dist[k]=(dist[k]||0)+1; }
  console.log('A/R answer distribution:', JSON.stringify(dist));

  fs.mkdirSync(path.resolve(__dirname, '../scratch'), { recursive: true });
  fs.writeFileSync(path.resolve(__dirname, '../scratch/ar_audit_full.json'), JSON.stringify(arAll, null, 2));
  console.log('Saved', arAll.length, 'AR questions to scratch/ar_audit_full.json');

  const suspicious = arAll.filter(q => {
    if(q.correct_answer !== 'A') return false;
    const optA = (q.options && q.options.A) ? q.options.A.toLowerCase() : '';
    return optA.includes('correct explanation');
  });
  console.log('\nAnswer=A where optA="...correct explanation...": ', suspicious.length);

  await client.close();
}
run().catch(err => { console.error('[ERR]', err.message); process.exit(1); });
