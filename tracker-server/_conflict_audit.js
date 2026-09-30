/**
 * Full audit: scan ALL markdown source files and extract every question's
 * q_id + correct_answer. Group by q_id and flag any that have CONFLICTING
 * answers across different files.
 */
const fs = require('fs');
const path = require('path');
const { parseQuestionsFromMarkdown } = require('./question_parser');

const subjectsDir = path.resolve(__dirname, '../docs/subjects');
const subjects = fs.readdirSync(subjectsDir).filter(n => {
  return fs.statSync(path.join(subjectsDir, n)).isDirectory() && !n.startsWith('.');
});

// Map: q_id -> [{file, subject, chapter, correct_answer, stem_preview}]
const qMap = new Map();
let totalParsed = 0;

for (const subject of subjects) {
  const subDir = path.join(subjectsDir, subject);
  const files = fs.readdirSync(subDir).filter(f => f.endsWith('.md') && f !== 'index.md');
  for (const file of files) {
    const filePath = path.join(subDir, file);
    const chapterSlug = file.replace(/\.md$/, '');
    try {
      const { questions } = parseQuestionsFromMarkdown(filePath, subject, chapterSlug);
      for (const q of questions) {
        if (!q.q_id || !q.correct_answer) continue;
        totalParsed++;
        if (!qMap.has(q.q_id)) qMap.set(q.q_id, []);
        qMap.get(q.q_id).push({
          file: subject + '/' + file,
          correct_answer: q.correct_answer,
          stem_preview: (q.stem || q.question || '').substring(0, 80)
        });
      }
    } catch(e) {}
  }
}

console.log('Total questions parsed from markdown:', totalParsed);
console.log('Unique q_ids:', qMap.size);

// Find conflicts
const conflicts = [];
for (const [qid, entries] of qMap.entries()) {
  if (entries.length < 2) continue;
  const answers = [...new Set(entries.map(e => e.correct_answer))];
  if (answers.length > 1) {
    conflicts.push({ q_id: qid, entries });
  }
}

console.log('\n=== CONFLICTING ANSWERS (same q_id, different correct_answer across files) ===');
console.log('Total conflicts found:', conflicts.length);
for (const c of conflicts) {
  console.log('\nq_id:', c.q_id);
  for (const e of c.entries) {
    console.log('  [' + e.correct_answer + '] ' + e.file);
    console.log('    stem:', e.stem_preview);
  }
}

fs.writeFileSync(path.resolve(__dirname, '../scratch/md_conflicts.json'), JSON.stringify(conflicts, null, 2));
console.log('\nConflicts saved to scratch/md_conflicts.json');
