const fs = require('fs');
const path = require('path');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { syncChapterQuestions } = require('./question_parser');

dotenv.config({ path: path.resolve(__dirname, '.env') });
const MONGODB_URI = process.env.MONGODB_URI;

async function syncPolity() {
  console.log('[Sync Polity] Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  console.log('[Sync Polity] Connected!');

  const polityDir = path.resolve(__dirname, '../docs/subjects/polity');
  
  function walkFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file.startsWith('.') || file === '_build') continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(walkFiles(fullPath));
      } else if (file.endsWith('.md') && file !== 'index.md' && file !== 'prompt.md') {
        results.push(fullPath);
      }
    }
    return results;
  }

  const files = walkFiles(polityDir);
  console.log(`Found ${files.length} Polity markdown files to sync.`);

  let totalQuestions = 0;
  for (const filePath of files) {
    const rel = path.relative(polityDir, filePath).replace(/\\/g, '/');
    const chapterSlug = rel.replace(/\.md$/, '');
    const res = await syncChapterQuestions(db, filePath, 'polity', chapterSlug);
    console.log(`  ✓ polity/${chapterSlug}: ${res.count} questions`);
    totalQuestions += res.count;
  }

  console.log(`\n[Sync Complete] Successfully synced ${totalQuestions} questions across ${files.length} Polity files into MongoDB Atlas!`);
  await client.close();
}

syncPolity().catch(console.error);
