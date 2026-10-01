#!/usr/bin/env node
/**
 * Rebuild chapter-catalog.json + embedded CHAPTER_CATALOG in study-tracker.js
 * from docs/subjects/* markdown files. Safe: only regenerates from disk.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SUBJECTS_DIR = path.join(ROOT, 'docs', 'subjects');
const CATALOG_JSON = path.join(ROOT, 'docs', 'assets', 'javascripts', 'chapter-catalog.json');
const STUDY_TRACKER = path.join(ROOT, 'docs', 'assets', 'javascripts', 'study-tracker.js');

const SKIP_NAMES = new Set([
  'index.md',
  'prompt.md',
  '_TEMPLATE.md',
]);

function extractTitle(filePath, slug) {
  try {
    const head = fs.readFileSync(filePath, 'utf8').slice(0, 800);
    const h1 = head.match(/^#\s+(.+)$/m);
    if (h1) {
      return h1[1]
        .replace(/¶/g, '')
        .replace(/^Economy Topic\s*\d+\s*[—–-]\s*/i, '')
        .replace(/^.*?Topic\s*\d+\s*[—–-]\s*/i, '')
        .trim();
    }
  } catch (_) {}
  return slug.replace(/_/g, ' ').replace(/^\d+\s+/, '');
}

function walkMd(dir, base = '') {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.') || entry === '_build' || entry.endsWith('.bak') || entry.endsWith('.bak_pyq_fix')) {
      continue;
    }
    const full = path.join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      out.push(...walkMd(full, rel));
    } else if (entry.endsWith('.md') && !SKIP_NAMES.has(entry) && !entry.includes('.bak')) {
      const slug = rel.replace(/\.md$/i, '').replace(/\\/g, '/');
      // Skip pure syllabus stubs from being the only content — keep them but after real chapters
      out.push({
        slug,
        title: extractTitle(full, path.basename(slug)),
        isSyllabus: /syllabus/i.test(entry) || /^00_/.test(path.basename(slug)),
      });
    }
  }
  return out;
}

function buildCatalog() {
  const catalog = {};
  const folders = fs.readdirSync(SUBJECTS_DIR).filter((d) => {
    const p = path.join(SUBJECTS_DIR, d);
    return fs.statSync(p).isDirectory() && !d.startsWith('.') && d !== '_build';
  });

  for (const folder of folders) {
    const chapters = walkMd(path.join(SUBJECTS_DIR, folder))
      .filter((c) => !/prompt/i.test(c.slug))
      .sort((a, b) => {
        // Real numbered chapters first, then 00_ / syllabus
        if (a.isSyllabus !== b.isSyllabus) return a.isSyllabus ? 1 : -1;
        return a.slug.localeCompare(b.slug, undefined, { numeric: true });
      })
      .map(({ slug, title }) => ({ slug, title }));

    if (chapters.length) {
      catalog[folder] = chapters;
    }
  }
  return catalog;
}

function main() {
  const catalog = buildCatalog();
  fs.writeFileSync(CATALOG_JSON, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log('Wrote', CATALOG_JSON);
  for (const [k, v] of Object.entries(catalog)) {
    console.log(`  ${k}: ${v.length} chapters`);
  }

  let js = fs.readFileSync(STUDY_TRACKER, 'utf8');
  const compact = JSON.stringify(catalog);
  if (!/const CHAPTER_CATALOG = \{[\s\S]*?\};/.test(js)) {
    console.error('ERROR: CHAPTER_CATALOG pattern not found in study-tracker.js');
    process.exit(1);
  }
  const replaced = js.replace(
    /const CHAPTER_CATALOG = \{[\s\S]*?\};/,
    `const CHAPTER_CATALOG = ${compact};`
  );
  fs.writeFileSync(STUDY_TRACKER, replaced, 'utf8');
  console.log('Updated CHAPTER_CATALOG in study-tracker.js');
}

main();
