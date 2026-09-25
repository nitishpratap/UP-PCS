const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { parseQuestionsFromMarkdown } = require('./question_parser');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin";

async function runIngestion() {
  console.log('[Ingestion] Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('uppcs_study_tracker');
  console.log(`[Ingestion] Connected! Database: ${db.databaseName}`);

  const qCol = db.collection('questions');
  await qCol.createIndex({ q_id: 1 }, { unique: true });
  await qCol.createIndex({ subject: 1, chapter: 1 });

  const subjectsDir = path.resolve(__dirname, '../docs/subjects');
  const subjectFolders = fs.readdirSync(subjectsDir).filter(name => {
    const full = path.join(subjectsDir, name);
    return fs.statSync(full).isDirectory() && !name.startsWith('.') && name !== '_build';
  });

  console.log(`[Ingestion] Found ${subjectFolders.length} subject folders:`, subjectFolders);

  let totalQuestionsCount = 0;
  let totalChaptersWithQuestions = 0;
  const summaryBySubject = {};

  for (const subjectName of subjectFolders) {
    const subjPath = path.join(subjectsDir, subjectName);
    const files = fs.readdirSync(subjPath).filter(f => f.endsWith('.md') && !f.startsWith('.') && f !== 'index.md');

    summaryBySubject[subjectName] = { chapters: files.length, questions: 0 };

    for (const file of files) {
      const chapterSlug = file.replace(/\.md$/, '');
      const filePath = path.join(subjPath, file);
      const { chapterTitle, questions } = parseQuestionsFromMarkdown(filePath, subjectName, chapterSlug);

      if (questions.length > 0) {
        totalChaptersWithQuestions++;
        summaryBySubject[subjectName].questions += questions.length;
        totalQuestionsCount += questions.length;

        // Bulk upsert questions into MongoDB
        const bulkOps = questions.map(q => ({
          updateOne: {
            filter: { q_id: q.q_id },
            update: { $set: q },
            upsert: true
          }
        }));

        await qCol.bulkWrite(bulkOps);
      }
    }
  }

  console.log('\n================ INGESTION SUMMARY ================');
  console.log(`Total Questions Ingested: ${totalQuestionsCount}`);
  console.log(`Total Chapters With Questions: ${totalChaptersWithQuestions}`);
  console.log('Breakdown by Subject:', JSON.stringify(summaryBySubject, null, 2));
  console.log('===================================================\n');

  await client.close();
}

runIngestion().catch(err => {
  console.error('[Ingestion Error]', err);
  process.exit(1);
});
