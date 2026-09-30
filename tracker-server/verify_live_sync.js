const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const { MongoClient } = require('mongodb');
const URI = 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0&authSource=admin';

async function check() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const total = await db.collection('questions').countDocuments();
  const nullAns = await db.collection('questions').countDocuments({
    $or: [{ correct_answer: null }, { correct_answer: '' }, { correct_answer: { $exists: false } }]
  });
  console.log('Total Questions in DB:', total);
  console.log('Null/Empty Answer Questions:', nullAns);

  // Check Asiatic Society questions
  const asiatics = await db.collection('questions').find({
    stem: { $regex: 'Asiatic Society of Bengal was established in the period of Warren Hastings', $options: 'i' }
  }).toArray();
  console.log('Asiatic Society questions in DB:', asiatics.length);
  asiatics.forEach(q => {
    console.log(`  - [${q.subject}/${q.chapter}] QID: ${q.q_id} | Ans: ${q.correct_answer}`);
  });

  // Check Q-GC80 Naqshbandi
  const sufi = await db.collection('questions').find({
    stem: { $regex: 'The most orthodox Sufi order was', $options: 'i' }
  }).toArray();
  console.log('Sufi order questions in DB:', sufi.length);
  sufi.forEach(q => {
    console.log(`  - [${q.subject}/${q.chapter}] QID: ${q.q_id} | Ans: ${q.correct_answer}`);
    console.log('    Options:', q.options);
  });

  // Check user tests and chapter tests integrity
  const userTestsCount = await db.collection('tests').countDocuments();
  const chapterTestsCount = await db.collection('chapter_tests').countDocuments();
  const revisionsCount = await db.collection('revisions').countDocuments();
  console.log('User Tests preserved:', userTestsCount);
  console.log('Chapter Tests preserved:', chapterTestsCount);
  console.log('User Revisions preserved:', revisionsCount);

  await client.close();
}
check().catch(console.error);
