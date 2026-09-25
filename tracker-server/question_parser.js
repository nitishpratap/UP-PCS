const fs = require('fs');
const path = require('path');

function extractChapterTitle(content, defaultName) {
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].replace(/¶/g, '').trim();
  return defaultName.replace(/_/g, ' ');
}

/**
 * Robustly parses multiple-choice questions from a subject markdown file.
 */
function parseQuestionsFromMarkdown(filePath, subject, chapterSlug) {
  if (!fs.existsSync(filePath)) return { chapterTitle: chapterSlug, questions: [] };

  const content = fs.readFileSync(filePath, 'utf8');
  const chapterTitle = extractChapterTitle(content, chapterSlug);
  const questions = [];

  // Parse all markdown headings with their file character offsets
  const headingRegex = /^#{1,4}\s+(.+)$/gm;
  let hMatch;
  const sections = [];
  while ((hMatch = headingRegex.exec(content)) !== null) {
    sections.push({ title: hMatch[1].trim(), index: hMatch.index });
  }

  // Extract syllabus subtopics (e.g. 3.1 Sharqi Sultanate, N.1 Company rule, N.9 Constituent Assembly, etc.)
  const numberedSubtopics = sections.filter(s => {
    const t = s.title.toLowerCase();
    const isDrill = t.includes('practice zone') || t.includes('ghatnachakra') || t.includes('pyq bank') || t.includes('complete pyq') || t.includes('common traps') || t.includes('revision sheet') || t.includes('confused pairs');
    if (isDrill) return false;
    return /^(?:[0-9]+(?:\.[0-9]+)?|[a-z]\.[0-9]+)\s+/i.test(s.title);
  });

  function getSectionInfoForPos(pos) {
    let curTitle = 'Chapter Notes';
    let curCategory = 'pyqs'; // Default for inline teaching notes questions
    for (const s of sections) {
      if (s.index > pos) break;
      curTitle = s.title;
      const t = s.title.toLowerCase();
      if (t.includes('practice zone') || t.includes('format drill') || t.includes('practice drill')) {
        curCategory = 'practice';
      } else if (t.includes('ghatnachakra') || t.includes('purvavlokan')) {
        curCategory = 'ghatnachakra';
      } else if (t.includes('pyq') || t.includes('prelims') || t.includes('mains')) {
        curCategory = 'pyqs';
      }
    }
    return { sectionTitle: curTitle, category: curCategory };
  }

  function resolveSubtopicForQuestion(pos, stemText, detailsText, currentSectionTitle) {
    // 1. If currently under a numbered subtopic or specific PYQ heading
    let directNumbered = null;
    for (const s of sections) {
      if (s.index > pos) break;
      if (/^(?:[0-9]+(?:\.[0-9]+)?|[a-z]\.[0-9]+)\s+/i.test(s.title)) {
        directNumbered = s.title;
      }
    }

    const tLower = currentSectionTitle.toLowerCase();
    const isGeneralDrill = tLower.includes('practice zone') || tLower.includes('ghatnachakra') || tLower.includes('complete pyq bank') || tLower.includes('other papers');

    // If it's directly inside a numbered subtopic note and not in the bottom drill block, use direct numbered
    if (directNumbered && !isGeneralDrill) {
      return directNumbered;
    }

    // 2. Otherwise match question text against numbered subtopics
    const combinedText = ((stemText || '') + ' ' + (detailsText || '')).toLowerCase();
    let bestMatch = directNumbered || currentSectionTitle;
    let maxScore = directNumbered ? 1 : 0;

    for (const sub of numberedSubtopics) {
      const cleanWords = sub.title
        .toLowerCase()
        .replace(/^(?:[0-9\.]+|[a-z]\.[0-9]+)\s+/i, '')
        .replace(/[\(\)\[\]\,\:\—\-\/\&]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['under', 'with', 'from', 'than', 'into', 'format', 'drill', 'notes', 'facts'].includes(w));

      let score = 0;
      for (const w of cleanWords) {
        if (combinedText.includes(w)) {
          score += 2;
        }
      }

      // Specific entity boosts: Medieval
      if (sub.title.toLowerCase().includes('sharqi')) {
        if (combinedText.includes('sharqi') || combinedText.includes('shirqui') || combinedText.includes('jaunpur') || combinedText.includes('atala') || combinedText.includes('lal darwaza') || combinedText.includes('malik sarwar') || combinedText.includes('siraj-e-hind') || combinedText.includes('shiraz')) {
          score += 6;
        }
      }
      if (sub.title.toLowerCase().includes('kashmir')) {
        if (combinedText.includes('zain-ul-abidin') || combinedText.includes('bud shah') || combinedText.includes('sikandar shah') || combinedText.includes('kashmir') || combinedText.includes('wular')) {
          score += 6;
        }
      }
      if (sub.title.toLowerCase().includes('gujarat')) {
        if (combinedText.includes('gujarat') || combinedText.includes('muzaffar shah') || combinedText.includes('mahmud begada') || combinedText.includes('bahadur shah') || combinedText.includes('champaner') || combinedText.includes('girnar')) {
          score += 6;
        }
      }
      if (sub.title.toLowerCase().includes('vijayanagara')) {
        if (combinedText.includes('vijayanagara') || combinedText.includes('hampi') || combinedText.includes('krishnadevaraya') || combinedText.includes('harihara') || combinedText.includes('bukka') || combinedText.includes('sangama') || combinedText.includes('amuktamalyada')) {
          score += 6;
        }
      }
      if (sub.title.toLowerCase().includes('bahmani')) {
        if (combinedText.includes('bahmani') || combinedText.includes('hasan gangu') || combinedText.includes('mahmud gawan') || combinedText.includes('bidar') || combinedText.includes('gulbarga')) {
          score += 6;
        }
      }
      if (sub.title.toLowerCase().includes('talikota')) {
        if (combinedText.includes('talikota') || combinedText.includes('rakkasa') || combinedText.includes('tangadi') || combinedText.includes('rama raya')) {
          score += 6;
        }
      }
      if (sub.title.toLowerCase().includes('deccan') || sub.title.toLowerCase().includes('bijapur')) {
        if (combinedText.includes('bijapur') || combinedText.includes('adil shahi') || combinedText.includes('gol gumbaz') || combinedText.includes('golkonda') || combinedText.includes('qutb shahi') || combinedText.includes('ahmadnagar') || combinedText.includes('nizam shahi')) {
          score += 6;
        }
      }

      // Specific entity boosts: Polity & Constitutional Development
      const subLower = sub.title.toLowerCase();
      if (subLower.includes('constituent assembly') || subLower.includes('drafting committee')) {
        if (combinedText.includes('constituent assembly') || combinedText.includes('drafting committee') || combinedText.includes('rajendra prasad') || combinedText.includes('ambedkar') || combinedText.includes('b.n. rau') || combinedText.includes('objectives resolution') || combinedText.includes('sessions') || combinedText.includes('sittings') || combinedText.includes('advisory committee')) {
          score += 8;
        }
      }
      if (subLower.includes('sources') || subLower.includes('borrowed')) {
        if (combinedText.includes('borrowed') || combinedText.includes('concurrent list') || combinedText.includes('australia') || combinedText.includes('ireland') || combinedText.includes('dpsp') || combinedText.includes('canada') || combinedText.includes('residuary') || combinedText.includes('fundamental rights') || combinedText.includes('weimar')) {
          score += 8;
        }
      }
      if (subLower.includes('1919')) {
        if (combinedText.includes('1919') || combinedText.includes('montagu') || combinedText.includes('chelmsford') || combinedText.includes('dyarchy') || combinedText.includes('transferred') || combinedText.includes('reserved subjects') || combinedText.includes('chamber of princes')) {
          score += 8;
        }
      }
      if (subLower.includes('1935')) {
        if (combinedText.includes('1935') || combinedText.includes('provincial autonomy') || combinedText.includes('federal court') || combinedText.includes('federation')) {
          score += 8;
        }
      }
      if (subLower.includes('wavell') || subLower.includes('cabinet mission') || subLower.includes('august offer') || subLower.includes('cripps')) {
        if (combinedText.includes('wavell') || combinedText.includes('shimla') || combinedText.includes('cabinet mission') || combinedText.includes('cripps') || combinedText.includes('linlithgow') || combinedText.includes('august offer')) {
          score += 8;
        }
      }
      if (subLower.includes('company rule') || subLower.includes('regulating') || subLower.includes('pitt') || subLower.includes('charter')) {
        if (combinedText.includes('1773') || combinedText.includes('1784') || combinedText.includes('1813') || combinedText.includes('1833') || combinedText.includes('1853') || combinedText.includes('regulating act') || combinedText.includes('pitt') || combinedText.includes('charter act') || combinedText.includes('board of control')) {
          score += 8;
        }
      }
      if (subLower.includes('crown rule') || subLower.includes('1858') || subLower.includes('1861') || subLower.includes('1892') || subLower.includes('1909')) {
        if (combinedText.includes('1858') || combinedText.includes('1861') || combinedText.includes('1892') || combinedText.includes('1909') || combinedText.includes('morley') || combinedText.includes('minto') || combinedText.includes('portfolio') || combinedText.includes('separate electorate')) {
          score += 8;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = sub.title;
      }
    }

    return bestMatch;
  }

  // Match each <details> block containing Answer / Explanation / Solution
  const detailsRegex = /<details>\s*<summary>[\s\S]*?(?:answer|ans|explanation|solution)[\s\S]*?<\/summary>([\s\S]*?)<\/details>/gi;
  let match;
  let lastIndex = 0;

  while ((match = detailsRegex.exec(content)) !== null) {
    const detailsContent = match[1];
    const detailsStart = match.index;
    
    // Look backward up to 4000 characters before <details> to capture question stem & options
    const lookbackChunk = content.substring(Math.max(lastIndex, detailsStart - 4000), detailsStart);
    
    // Question header patterns (handles both short headers and full stems inside bold)
    const qHeaderPattern = /\*\*((?:Q\s*[-–—]?\s*(?:GC)?\s*\d+|Q\s*[\.:\)]|Q\d+|PYQ\b|Inline PYQ\b|Practice Q\b|Question\s*\d+)[^\*]*?)\*\*/gi;
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
    
    // Parse Correct Answer Letter(s)
    let correctLetters = [];
    const ansMatch1 = detailsContent.match(/\*\*Correct Answer:\*\*\s*\*\*([A-D](?:\s*(?:and|,)\s*[A-D])*)/i);
    const ansMatch2 = detailsContent.match(/\*\*Ans:\s*([A-D])\.\*\*/i);
    const ansMatch3 = detailsContent.match(/\*\*Ans:\s*([A-D])\b/i);
    const ansMatch4 = detailsContent.match(/(?:Ans|Answer|Option):\s*([A-D])\b/i);

    if (ansMatch1) {
      const letters = ansMatch1[1].match(/[A-D]/gi);
      if (letters) correctLetters = letters.map(l => l.toUpperCase());
    } else if (ansMatch2) {
      correctLetters = [ansMatch2[1].toUpperCase()];
    } else if (ansMatch3) {
      correctLetters = [ansMatch3[1].toUpperCase()];
    } else if (ansMatch4) {
      correctLetters = [ansMatch4[1].toUpperCase()];
    }

    if (correctLetters.length === 0) {
      lastIndex = match.index + match[0].length;
      continue;
    }

    // Parse options A, B, C, D
    const options = { A: '', B: '', C: '', D: '' };
    const normalizedBlock = questionBlock.replace(/\r?\n\s*\(([A-D])\)\s+/gi, '\n$1. ');

    let stemPart = normalizedBlock;
    let optionsPart = '';

    // Check if there is an explicit "Code:" or "Codes:" block
    const codeMatch = normalizedBlock.match(/\r?\n\s*(?:Code|Codes)\s*:\s*\r?\n/i);
    if (codeMatch) {
      const codeIdx = codeMatch.index;
      stemPart = normalizedBlock.substring(0, codeIdx).trim();
      optionsPart = normalizedBlock.substring(codeIdx + codeMatch[0].length).trim();
    } else {
      // Find the LAST occurrence of "\nA." or "\n(A)" in the block where B, C, D follow
      const allA = [...normalizedBlock.matchAll(/\r?\n\s*(?:\(?A[\.\)]|\bA\.)\s+/gi)];
      if (allA.length > 0) {
        for (let i = allA.length - 1; i >= 0; i--) {
          const cand = allA[i];
          const afterCand = normalizedBlock.substring(cand.index);
          if (/\r?\n\s*(?:\(?B[\.\)]|\bB\.)\s+/i.test(afterCand) &&
              /\r?\n\s*(?:\(?C[\.\)]|\bC\.)\s+/i.test(afterCand) &&
              /\r?\n\s*(?:\(?D[\.\)]|\bD\.)\s+/i.test(afterCand)) {
            stemPart = normalizedBlock.substring(0, cand.index).trim();
            optionsPart = normalizedBlock.substring(cand.index).trim();
            break;
          }
        }
      }
    }

    if (optionsPart) {
      const optSplit = ('\n' + optionsPart).split(/\r?\n\s*([A-D])[\.\)]\s+/);
      for (let i = 1; i < optSplit.length; i += 2) {
        const letter = (optSplit[i] || '').toUpperCase();
        const text = optSplit[i + 1] ? optSplit[i + 1].trim() : '';
        if (['A', 'B', 'C', 'D'].includes(letter)) {
          options[letter] = text;
        }
      }
    }

    // Fallback if optionsPart failed
    if (!options.A || !options.B) {
      const optSplit = normalizedBlock.split(/\r?\n\s*([A-D])[\.\)]\s+/);
      if (optSplit.length >= 7) {
        for (let i = 1; i < optSplit.length; i += 2) {
          const letter = (optSplit[i] || '').toUpperCase();
          const text = optSplit[i + 1] ? optSplit[i + 1].trim() : '';
          if (['A', 'B', 'C', 'D'].includes(letter)) {
            options[letter] = text;
          }
        }
      }
    }

    let rawStem = stemPart.trim();
    let stem = rawStem.replace(/^\*\*(?:Q\s*[-–—]?\s*(?:GC)?\s*\d+|Q\s*[\.:\)]|Q\d+|PYQ\b|Inline PYQ\b|Practice Q\b|Question\s*\d+)[^\*]*?\*\*/i, '').trim();
    if (!stem) {
      // If the entire question stem was enclosed in bold, strip asterisks and prefix
      stem = rawStem.replace(/^\*\*|\*\*$/g, '').replace(/^(?:Q\s*[-–—]?\s*(?:GC)?\s*\d+|Q\s*[\.:\)]|Q\d+|PYQ\b|Inline PYQ\b|Practice Q\b|Question\s*\d+)[\.:\s\-]*/i, '').trim();
    }

      // Clean explanation
      let explanation = detailsContent
        .replace(/\*\*Correct Answer:\*\*.*?\n/i, '')
        .replace(/\*\*Ans:.*?\n/i, '')
        .replace(/^(?:Ans|Answer):\s*[A-D].*?\n/i, '')
        .trim();

      const qIndex = questions.length + 1;
      const qId = `${subject}_${chapterSlug}_${qIndex}`.replace(/[^a-z0-9_]/gi, '_').toLowerCase();

      // Determine accurate category based on section heading & header
      const sec = getSectionInfoForPos(detailsStart);
      let finalCategory = sec.category;

      const headerLower = lastQHeader.toLowerCase();
      if (headerLower.includes('practice') || headerLower.includes('drill')) {
        finalCategory = 'practice';
      } else if (headerLower.includes('gc') || headerLower.includes('ghatnachakra')) {
        finalCategory = 'ghatnachakra';
      } else if (headerLower.includes('inline pyq') || headerLower.includes('uppcs') || headerLower.includes('ukpcs') || headerLower.includes('ro/aro')) {
        finalCategory = 'pyqs';
      }

      let displayHeader = lastQHeader;
      if (finalCategory === 'practice' && !displayHeader.toLowerCase().includes('practice')) {
        displayHeader = `Practice Zone — ${displayHeader}`;
      } else if (finalCategory === 'ghatnachakra' && !displayHeader.toLowerCase().includes('ghatna') && !displayHeader.toLowerCase().includes('gc')) {
        displayHeader = `Ghatnachakra — ${displayHeader}`;
      }

      const subtopic = resolveSubtopicForQuestion(detailsStart, stem, detailsContent, sec.sectionTitle);

      questions.push({
        q_id: qId,
        subject: subject.toLowerCase().trim(),
        chapter: chapterSlug,
        chapter_title: chapterTitle,
        q_num: qIndex,
        q_header: displayHeader,
        section_title: subtopic,
        category: finalCategory, // 'pyqs' | 'ghatnachakra' | 'practice'
        stem,
        options,
        correct_answer: correctLetters[0],
        all_correct_answers: correctLetters,
        explanation
      });

    lastIndex = match.index + match[0].length;
  }

  // 2. Parse Inline Questions (e.g. **Q1...** with options A-D and *Answer:* **C**)
  const seenStems = new Set(questions.map(q => q.stem.substring(0, 40).toLowerCase().replace(/[^a-z0-9]/g, '')));
  const inlineRegex = /\*\*(Q\s*[-–—]?\s*(?:GC)?\s*\d+|Q\s*[\.:\)]|Q\d+|PYQ\b|Inline PYQ\b|Practice Q\b|Question\s*\d+)[^\*]*?\*\*([\s\S]*?)(?:\*Answer:\*|\*\*Answer:\*\*|\*Ans:\*|\*\*Ans:\*\*|Answer:)\s*\*?\*?([A-D])\*?\*?([^\n\r]*)/gi;
  let inM;
  while ((inM = inlineRegex.exec(content)) !== null) {
    const qHeader = inM[1].trim();
    const body = inM[2].trim();
    const correctAns = inM[3].toUpperCase();
    const restExplanation = inM[4].trim();

    const options = { A: '', B: '', C: '', D: '' };
    const optRegex = /(?:^|\n)\s*([A-D])[\.\)]\s+([^\n\r]+)/g;
    let optM;
    let firstOptIdx = -1;
    while ((optM = optRegex.exec(body)) !== null) {
      if (firstOptIdx === -1) firstOptIdx = optM.index;
      options[optM[1].toUpperCase()] = optM[2].trim();
    }

    let stem = body;
    if (firstOptIdx !== -1) {
      stem = body.substring(0, firstOptIdx).trim();
    }

    const normStemKey = stem.substring(0, 40).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normStemKey && seenStems.has(normStemKey)) continue; // skip if already captured
    if (normStemKey) seenStems.add(normStemKey);

    const qIndex = questions.length + 1;
    const qId = `${subject}_${chapterSlug}_${qIndex}`.replace(/[^a-z0-9_]/gi, '_').toLowerCase();

    const sec = getSectionInfoForPos(inM.index);
    let finalCategory = sec.category;
    const headerLower = qHeader.toLowerCase();
    if (headerLower.includes('practice') || headerLower.includes('drill')) {
      finalCategory = 'practice';
    } else if (headerLower.includes('gc') || headerLower.includes('ghatnachakra')) {
      finalCategory = 'ghatnachakra';
    } else if (headerLower.includes('inline pyq') || headerLower.includes('uppcs') || headerLower.includes('ukpcs') || headerLower.includes('ro/aro')) {
      finalCategory = 'pyqs';
    }

    let displayHeader = qHeader;
    if (finalCategory === 'practice' && !displayHeader.toLowerCase().includes('practice')) {
      displayHeader = `Practice Zone — ${displayHeader}`;
    }

    const subtopic = resolveSubtopicForQuestion(inM.index, stem, restExplanation, sec.sectionTitle);

    questions.push({
      q_id: qId,
      subject: subject.toLowerCase().trim(),
      chapter: chapterSlug,
      chapter_title: chapterTitle,
      q_num: qIndex,
      q_header: displayHeader,
      section_title: subtopic,
      category: finalCategory,
      stem,
      options,
      correct_answer: correctAns,
      all_correct_answers: [correctAns],
      explanation: restExplanation.replace(/^[\(\[\s]+|[\)\]\s]+$/g, '')
    });
  }

  return { chapterTitle, questions };
}

/**
 * Syncs questions for a single chapter into MongoDB Atlas.
 */
async function syncChapterQuestions(db, filePath, subject, chapterSlug) {
  if (!db) throw new Error('Database is not connected');

  const { chapterTitle, questions } = parseQuestionsFromMarkdown(filePath, subject, chapterSlug);
  const qCol = db.collection('questions');

  const cleanSubject = subject.toLowerCase().trim();
  // Clear existing questions for this subject & chapter
  await qCol.deleteMany({ subject: cleanSubject, chapter: chapterSlug });

  if (questions.length > 0) {
    const bulkOps = questions.map(q => ({
      updateOne: {
        filter: { q_id: q.q_id },
        update: { $set: q },
        upsert: true
      }
    }));
    await qCol.bulkWrite(bulkOps);
  }

  return {
    success: true,
    subject: cleanSubject,
    chapter: chapterSlug,
    chapter_title: chapterTitle,
    count: questions.length
  };
}

/**
 * Recursively scans directory for all markdown files and ingests all questions.
 */
async function syncAllQuestions(db, subjectsDir) {
  if (!db) throw new Error('Database is not connected');
  const qCol = db.collection('questions');
  await qCol.createIndex({ q_id: 1 }, { unique: true });
  await qCol.createIndex({ subject: 1, chapter: 1 });

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

  const allFiles = walkFiles(subjectsDir);
  let totalQuestionsCount = 0;
  let totalChaptersWithQuestions = 0;
  const summaryBySubject = {};

  for (const filePath of allFiles) {
    const rel = path.relative(subjectsDir, filePath).replace(/\\/g, '/');
    const parts = rel.split('/');
    const subject = parts[0];
    const chapterSlug = parts.slice(1).join('/').replace(/\.md$/, '');

    const { chapterTitle, questions } = parseQuestionsFromMarkdown(filePath, subject, chapterSlug);

    if (!summaryBySubject[subject]) {
      summaryBySubject[subject] = { chapters: 0, questions: 0 };
    }
    summaryBySubject[subject].chapters++;

    if (questions.length > 0) {
      totalChaptersWithQuestions++;
      summaryBySubject[subject].questions += questions.length;
      totalQuestionsCount += questions.length;

      // Delete existing and bulk upsert
      await qCol.deleteMany({ subject: subject.toLowerCase().trim(), chapter: chapterSlug });
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

  return {
    totalQuestions: totalQuestionsCount,
    totalChaptersWithQuestions,
    totalScannedFiles: allFiles.length,
    summaryBySubject
  };
}

module.exports = {
  extractChapterTitle,
  parseQuestionsFromMarkdown,
  syncChapterQuestions,
  syncAllQuestions
};
