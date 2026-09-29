const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin';

async function compare() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  const qCol = db.collection('questions');

  // Group MongoDB questions by subject and chapter
  const dbGroups = await qCol.aggregate([
    { $group: { _id: { subject: '$subject', chapter: '$chapter' }, count: { $sum: 1 } } }
  ]).toArray();

  console.log('Total distinct (subject, chapter) groups in MongoDB:', dbGroups.length);

  // Group our parsed node_ar_questions or walk all questions from disk
  const { parseQuestionsFromMarkdown } = require('./question_parser');
  const subjectsDir = path.resolve(__dirname, '../docs/subjects');
  
  const diskCounts = {};
  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const p = path.join(dir, item);
      if (fs.statSync(p).isDirectory()) {
        if (item !== '_build' && !item.startsWith('.')) walk(p);
      } else if (item.endsWith('.md') && item !== 'index.md' && !item.startsWith('.')) {
        const rel = path.relative(subjectsDir, p);
        const parts = rel.split(path.sep);
        const subject = parts[0].toLowerCase();
        const chapter = path.basename(item, '.md');
        const key = `${subject}:::${chapter}`;
        const { questions } = parseQuestionsFromMarkdown(p, subject, chapter);
        diskCounts[key] = questions.length;
      }
    }
  }
  walk(subjectsDir);

  let diskTotal = Object.values(diskCounts).reduce((a, b) => a + b, 0);
  console.log('Total questions parsed directly from disk right now:', diskTotal);

  console.log('\nChapters where DB has questions but Disk has 0 (or vice versa):');
  let diffCount = 0;
  for (const g of dbGroups) {
    const key = `${(g._id.subject || '').toLowerCase()}:::${g._id.chapter}`;
    const onDisk = diskCounts[key];
    if (onDisk === undefined) {
      console.log(`  In DB only: ${g._id.subject} / ${g._id.chapter} -> ${g.count} questions in DB`);
      diffCount++;
    } else if (onDisk !== g.count) {
      console.log(`  Count mismatch: ${g._id.subject} / ${g._id.chapter} -> DB: ${g.count}, Disk: ${onDisk}`);
    }
  }

  await client.close();
}

compare().catch(console.error);
