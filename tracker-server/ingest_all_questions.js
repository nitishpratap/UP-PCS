const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nitish:Test_123@cluster0.r8fqbuf.mongodb.net/uppcs?appName=Cluster0?replicaSet=MongodbReplica&authSource=admin";

function extractChapterTitle(content, defaultName) {
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  return defaultName;
}

function parseQuestionsFromMarkdown(filePath, subject, chapterSlug) {
  const content = fs.readFileSync(filePath, 'utf8');
  const chapterTitle = extractChapterTitle(content, chapterSlug);
  const questions = [];

  // Match each <details> block with "Show answer"
  const detailsRegex = /<details>\s*<summary>Show answer<\/summary>([\s\S]*?)<\/details>/gi;
  let match;
  let lastIndex = 0;

  while ((match = detailsRegex.exec(content)) !== null) {
    const detailsContent = match[1];
    const detailsStart = match.index;
    
    // Look backward up to 3500 characters
    const lookbackChunk = content.substring(Math.max(lastIndex, detailsStart - 3500), detailsStart);
    
    // Find real question markers
    const qHeaderPattern = /\*\*((?:Q\s*[-–—]?\s*(?:GC)?\s*\d+|Q\s*[\.:\)]|Q\d+|PYQ\b|Inline PYQ\b|Practice Q\b|Question\s*\d+)[\w\s\.\/\(\)\-–—,:;]*?)\*\*/gi;
    const qStarts = [...lookbackChunk.matchAll(qHeaderPattern)];
    let lastQPos = -1;
    let lastQHeader = '';

    if (qStarts.length > 0) {
      const best = qStarts[qStarts.length - 1];
      lastQPos = best.index;
      lastQHeader = best[1].trim();
    }

    if (lastQPos === -1) {
      lastIndex = match.index + match[0].length;
      continue;
    }

    const questionBlock = lookbackChunk.substring(lastQPos).trim();
    
    // Parse Correct Answer
    let correctLetters = [];
    const ansMatch1 = detailsContent.match(/\*\*Correct Answer:\*\*\s*\*\*([A-D](?:\s*(?:and|,)\s*[A-D])*)/i);
    const ansMatch2 = detailsContent.match(/\*\*Ans:\s*([A-D])\.\*\*/i);
    const ansMatch3 = detailsContent.match(/\*\*Ans:\s*([A-D])\b/i);

    if (ansMatch1) {
      const letters = ansMatch1[1].match(/[A-D]/gi);
      if (letters) correctLetters = letters.map(l => l.toUpperCase());
    } else if (ansMatch2) {
      correctLetters = [ansMatch2[1].toUpperCase()];
    } else if (ansMatch3) {
      correctLetters = [ansMatch3[1].toUpperCase()];
    }

    if (correctLetters.length === 0) {
      lastIndex = match.index + match[0].length;
      continue;
    }

    // Parse options A, B, C, D
    const options = { A: '', B: '', C: '', D: '' };
    const optSplit = questionBlock.split(/\n\s*([A-D])\.\s+/);

    if (optSplit.length >= 7) {
      let stem = optSplit[0].trim();
      stem = stem.replace(/^\*\*[\s\S]*?\*\*\s*/, '').trim();

      for (let i = 1; i < optSplit.length; i += 2) {
        const letter = optSplit[i].toUpperCase();
        const text = optSplit[i + 1] ? optSplit[i + 1].trim() : '';
        if (['A', 'B', 'C', 'D'].includes(letter)) {
          options[letter] = text;
        }
      }

      // Parse explanation
      let explanation = detailsContent.replace(/\*\*Correct Answer:\*\*.*?\n/i, '')
                                      .replace(/\*\*Ans:.*?\n/i, '')
                                      .trim();

      const qIndex = questions.length + 1;
      const qId = `${subject}_${chapterSlug}_${qIndex}`.replace(/[^a-z0-9_]/gi, '_').toLowerCase();

      questions.push({
        q_id: qId,
        subject: subject.toLowerCase().trim(),
        chapter: chapterSlug,
        chapter_title: chapterTitle,
        q_num: qIndex,
        q_header: lastQHeader,
        stem,
        options,
        correct_answer: correctLetters[0],
        all_correct_answers: correctLetters,
        explanation
      });
    }

    lastIndex = match.index + match[0].length;
  }

  return { chapterTitle, questions };
}

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
