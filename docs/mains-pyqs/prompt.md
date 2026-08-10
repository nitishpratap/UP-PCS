# UPPCS Mains PYQ — Master Prompt

**Gold standard (lean student files):** `_GOLD_STANDARD.md`  
**Syllabus:** `00_SYLLABUS.md`  
**Template:** `_TEMPLATE.md`

> **Student files = 6 sections only:** PYQs → Quick Revision → Content → Answers → Traps.  
> **Diagrams** go **inside Content** (mermaid) — not a 7th section.  
> **No** Keyword Map, How to Use, Coverage Map, Ammunition Bank, Checklists, Cross-Links in student files.  
> AI verifies solvability internally → **Delivery Report** only.

---

## One-Line Prompt

```
Read @mains-pyqs/00_SYLLABUS.md → create ENRICHED LEAN subtopic file from @mains-pyqs/TOPIC_INPUT.md
per @mains-pyqs/_GOLD_STANDARD.md + @mains-pyqs/_TEMPLATE.md + Content enrichment rule in prompt.md.
Student file: PYQs | Quick Revision | Content (+ mermaid + Contemporary relevance subsection) | Answers (UPPCS topper format) | Traps ONLY.
Book-free bible Content: teachable full-sentence prose (what→how→why→proof) — NOT keyword stubs or "UPPCS tests N PYQs" meta. Meet word-count targets. Answers = labelled keywords + underline list + 30-sec ASCII diagram per Q.
AI verifies solvability + enrichment internally. Update @mains-pyqs/_INDEX.md. One subtopic.
```

---

## Student file rules (strict)

| Include | Exclude |
|---------|---------|
| PYQs table | Syllabus Keyword Map |
| Quick Revision (1 code block) | How to Use This File |
| Content (all facts + optional mermaid) | PYQ Coverage Map |
| Answers (Topper format per Q# — see Answer writing rule) | Ammunition Bank (merge into Content) |
| Traps (4–8 rows) | Value-Add, Cross-Links, Exam Intelligence |
| Minimal header (title + 1 line) | Prelims Overlap, Checklists, verbose metadata |
| **0–2 mermaid diagrams inside Content** | Separate "Diagrams" section; decorative images |

**Content must answer every PYQ + likely future variants without external books.**

---

## Answer writing rule (mandatory — UPPCS topper format)

Answers must be **directly copyable in the Mains exam** — not analyst notes. Examiners reward **labelled dimensions + keywords + neat presentation**.

### Structure (every answer block)

```markdown
### Qn: [Exact PYQ] (Year, _M, _W)

**Introduction:** (1–2 lines — definitional + scope)
> ...

**Main Characteristics:** / **Main Points:** / **Main Advantages:** (match directive)
- **Exam Keyword Label** — One crisp line: characteristic + proof/example.
- **Second Label** — ...

**Keywords (underline in exam):** Keyword1 · Keyword2 · Keyword3 · ...

**Exam diagram (30 sec):** (ASCII in code block — drawable in margin)
\`\`\`
[tree / two-column / flow — max 8 nodes]
\`\`\`

**Conclusion:** (1 line — balanced, forward-looking)
> ...
```

### Point-count by marks

| Marks | Words | Labelled points | Notes |
|-------|-------|-----------------|-------|
| **8M** | **125W** | **6–8** | Describe / advantages / characteristics |
| **12M** | **~150–200W** | **7–9** | Discuss / analyse / throw light |
| **15M+** | **250W+** | **9–12** | Critically examine / elaborate |

### Label rule (critical)

- Every bullet **starts with the characteristic the question asks for** — not a narrative topic.
- **Good:** `**Unity in Diversity** — Coexistence of religions, 22 languages…`
- **Bad:** `**Spiritual-philosophical core:** Concepts of dharma…` (when Q asks "characteristics")
- Mix **NCERT-safe classic labels** (Assimilative Nature, Adaptability, Rich Artistic Heritage) with **value-add examples** (Kabir, UNESCO, Art 51A).

### Keywords line

- 4–7 **underline targets** per answer — constitutional/cultural terms examiners scan for.
- Examples: Unity in Diversity · Composite Culture · Sarva Dharma Sambhava · Vasudhaiva Kutumbakam · Sanskritization.

### Exam diagram rule

- **One ASCII diagram per answer** in a fenced code block — simple enough to **draw in 30 seconds** in the answer booklet margin or below text.
- Use for: characteristics tree, continuity vs change split, unity/diversity fork, process flow.
- **Not** mermaid in Answers — mermaid stays in Content only; Answers use **hand-drawable ASCII**.

### Introduction & conclusion

- **Introduction:** "X is…" + synthesis lineage or scope — never start with "During…" unless question is period-specific.
- **Conclusion:** tie back to **national unity / resilience / democratic integration** where relevant — one balanced sentence.

### Directive matching

| Directive | Answer heading | Extra requirement |
|-----------|----------------|-------------------|
| Describe / Enumerate | **Main Characteristics** | 6–8 labelled traits |
| Discuss / Examine | **Main Points** | Both sides if debate question |
| Analyse | **Logical Analysis** + **Illustrations** | Premise → proof → counter (if any) |
| Throw light on | **Main Points** split by theme | Sub-headings OK (Continuity / Change) |
| Advantages | **Main Advantages** | 6–7 benefit labels |

**Rule:** Every fact in Answers must exist in Content or Quick Revision. No new facts in Answers alone.

---

## Content enrichment rule (mandatory) — Content is the student's bible

Student files must be **book-free**. **Quick Revision** = shorthand raata. **Content** = the full teachable chapter the student reads once and consolidates — they must **never need Laxmikanth / NCERT / another book** for this keyword.

| Subtopic complexity | Content target | Quick Revision | Traps | Answer blocks |
|---------------------|----------------|----------------|-------|---------------|
| Simple (1 PYQ, narrow keyword) | **≥1200 words** | 15–25 lines | **8–10 rows** | PYQ + **1–2 future variants** |
| Medium (1–2 PYQs) | **≥1800 words** | 25–35 lines | **10–12 rows** | All PYQs + **1–2 future variants** |
| Rich (federalism, basic structure, compare) | **≥2500 words** | 35–45 lines | **12–14 rows** | All PYQs + **2–3 future variants** |

### Content writing style (critical — fail if violated)

| Do | Do not |
|----|--------|
| Teach **what it is → how it works → why it matters → named proof** | Keyword dumps: `Dual polity — Art 1, 245–246` with no explanation |
| **Full-sentence bullets** a student can read and remember | Semicolon chains and label-only stubs |
| **Context** = concept definition + historical/constitutional reason it exists | Meta fluff: "GS-II Topic 02 tests X — 9 PYQs (2020–2025)" |
| Expand every Article/case enough that the student understands the **mechanism** | Assume the student already knows Laxmikanth |
| Keep **Quick Revision** compact for daily raata | Duplicate QR shorthand as the entire Content |

**Bible test:** After reading Content alone, can the student explain the topic out loud and write every PYQ answer without opening a book? If no → rewrite Content.

### Required Content dimensions (merge into Content — no extra sections)

Every file's **Content** must include **all** of:

1. **Context** — teach the keyword (definition + why the Constitution/design exists this way) — **not** exam-meta
2. **Core features** — each trait explained in prose bullets with **Articles, cases, dates, examples**
3. **Tables** — at least **2** (comparison, chronology, parts, schools, or sites)
4. **Process / structure** — optional mermaid (0–2) where spatial/layer memory helps
5. **Significance** — historical + constitutional legacy
6. **Contemporary relevance** — **mandatory subsection inside Content** (see below)
7. **Limits / balanced view** — traps material, criticism, balanced verdict

### Contemporary relevance (inside Content — not a 7th section)

Add **`### Contemporary relevance`** near end of Content. Connect to **present** where exam-useful:

| Link when relevant | Examples |
|--------------------|----------|
| **UNESCO / ASI** (heritage topics) | Ajanta/Ellora, Taj Mahal, conservation |
| **Constitutional / policy** | Art **49**, **51A**; **NEP 2020**; federal forums; SC judgments |
| **Government schemes / institutions** | GST Council, Finance Commission, eGramSwaraj, SVAMITVA |
| **Recent developments** | Only **verified** stable facts — no invented news |

**Rule:** Contemporary points used in **Answers** must appear in Content or Quick Revision.

### Enrichment quality bar

- **Named density:** ≥15 named entities (Articles, cases, commissions, Acts, persons, institutions) per medium/rich file
- **No stub bullets** — each bullet carries **who/when/where/why**, not a label alone
- **Future PYQs:** Include **likely variant** answer scaffolds in Answers
- **Cross-compare** where syllabus expects it (India vs USA federalism; FR vs DPSP; etc.)

---

## Diagram rules (when building files)

### Add mermaid when

| Subtopic type | Example diagram |
|---------------|-----------------|
| **Corpus / layers** | Vedic Shruti stack; Buddhist Tripitaka tree |
| **Process / flow** | Gurukula path; state formation; LPG chain |
| **Spatial / architecture** | Stupa parts; Nagar temple plan; town grid |
| **Geography / expansion** | Sapta-Sindhu → Doab → Bihar arrow flow |
| **Timeline** | Only if period sequence is exam-critical and confusing in prose |

### Skip diagram when

- Facts fit a table or bullet list (most PYQs)
- Answers / Traps sections
- Data-heavy charts (use markdown table)
- Diagram would repeat Quick Revision ASCII with no gain

### Format

- **Default:** ` ```mermaid ` block inside **Content**, right after the subsection it illustrates
- **Max:** 2 per file · labels short · no decorative styling
- **Rule:** Every label in a diagram must also appear in text nearby — diagram is memory aid, not new source
- **PNG/image:** Use when **side-by-side visual comparison** helps (e.g. Nagara vs Dravida elevation) or mermaid cannot show spatial shape. Save to `assets/` in same topic folder; link from Content: `![caption](assets/file.png)`

---

## AI workflow

**Phase A:** Read syllabus → subtopic → PYQs for this keyword only  
**Phase B:** Write lean file (6 sections) + decide diagram yes/no per rules above  
**Phase C:** Internal check — solvability, answer-content match, diagram optional audit  
**Phase D:** Update `_INDEX.md` · output Delivery Report  

---

## Delivery Report (AI output — not in file)

```markdown
## Delivery Report — [Subtopic]
Path: ...
PYQs: __ | Answer blocks: __ | Solvable: YES/NO
Content word count: __ (target met: YES/NO)
Contemporary relevance: YES — [list links used]
Diagrams: 0 / 1 / 2 (mermaid) | PNG: none
Named entities: __ | Traps: __ rows
Book-free: YES — future angles covered: [list 2–3]
Next subtopic: ...
```

---

## Subtopic rules

- 1 file = 1 syllabus keyword cluster (`00_SYLLABUS.md`)
- Do not merge Mauryan + Vedic + Sangam in one file
- Gupta Golden Age + Gupta science → same file (same period)
- Vedic **literature** ≠ Vedic **education** — separate files

---

## Book-free rule (reminder)

Content must cover the **full keyword**, not only listed PYQs. Include significance, limits, comparisons, named examples, dates, sites. Every fact in Answers must exist in Content or Quick Revision.

---

*End of prompt.md*
