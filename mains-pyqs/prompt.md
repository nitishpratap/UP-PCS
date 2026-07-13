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
Student file: PYQs | Quick Revision | Content (+ mermaid + Contemporary relevance subsection) | Answers | Traps ONLY.
Book-free: full keyword + future variants. Meet word-count targets. Link stable contemporary policy/UNESCO/IKS where relevant.
AI verifies solvability + enrichment internally. Update @mains-pyqs/_INDEX.md. One subtopic.
```

---

## Student file rules (strict)

| Include | Exclude |
|---------|---------|
| PYQs table | Syllabus Keyword Map |
| Quick Revision (1 code block) | How to Use This File |
| Content (all facts + optional mermaid) | PYQ Coverage Map |
| Answers (Opening + Points + Conclusion per Q#) | Ammunition Bank (merge into Content) |
| Traps (4–8 rows) | Value-Add, Cross-Links, Exam Intelligence |
| Minimal header (title + 1 line) | Prelims Overlap, Checklists, verbose metadata |
| **0–2 mermaid diagrams inside Content** | Separate "Diagrams" section; decorative images |

**Content must answer every PYQ + likely future variants without external books.**

---

## Content enrichment rule (mandatory)

Student files must be **exam-deep**, not outline-thin. Target depth:

| Subtopic complexity | Content target | Quick Revision | Traps | Answer blocks |
|---------------------|----------------|----------------|-------|---------------|
| Simple (1 PYQ, narrow keyword) | **≥900 words** | 15–25 lines | **8–10 rows** | PYQ + **1–2 future variants** |
| Medium (1–2 PYQs) | **≥1200 words** | 25–35 lines | **10–12 rows** | All PYQs + **1–2 future variants** |
| Rich (architecture, period, compare) | **≥1500 words** | 35–45 lines | **12–14 rows** | All PYQs + **2–3 future variants** |

### Required Content dimensions (merge into Content — no extra sections)

Every file's **Content** must include **all** of:

1. **Context** — period, geography, why keyword matters
2. **Core features** — salient traits with **named examples, dates, sites, patrons**
3. **Tables** — at least **2** (comparison, chronology, parts, schools, or sites)
4. **Process / structure** — optional mermaid (0–2) where spatial/layer memory helps
5. **Significance** — historical + civilizational legacy
6. **Contemporary relevance** — **mandatory subsection inside Content** (see below)
7. **Limits / balanced view** — traps material, historiographic caution

### Contemporary relevance (inside Content — not a 7th section)

Add **`### Contemporary relevance`** near end of Content. Connect heritage to **present** where exam-useful:

| Link when relevant | Examples |
|--------------------|----------|
| **UNESCO World Heritage** | Ajanta/Ellora (1983), Taj Mahal (1983), etc. |
| **ASI / conservation** | Protected monuments, restoration, digital documentation |
| **Constitutional / policy** | Art **49** (state protect monuments), **51A(f)**; **NEP 2020 IKS** |
| **Government schemes** | PRASAD, Swadesh Darshan, Buddhist/culture circuits, Incredible India |
| **Living heritage** | AYUSH, yoga, handloom/GI tags, craft revival |
| **Soft power / tourism** | Pilgrimage economy, diaspora, international Buddhist/Hindu routes |
| **Recent developments** | Only **verified** facts — new museum, UNESCO listing, major restoration, IKS curriculum |

**Rule:** Contemporary points used in **Answers** must appear in Content or Quick Revision. Do not invent news — use stable policy/UNESCO/constitutional links.

### Enrichment quality bar

- **Named density:** ≥15 named entities (sites, rulers, texts, artists, dynasties) per medium/rich file
- **No stub bullets** — each bullet should carry a **fact** (who/when/where/why), not a label alone
- **Future PYQs:** Every file with only past PYQs should still include **likely variant** answer scaffolds in Answers
- **Cross-period compare** where syllabus expects it (e.g. Nagara vs Dravida, Gandhara vs Mathura)

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
