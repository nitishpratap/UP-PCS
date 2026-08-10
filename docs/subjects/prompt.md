# UPPCS Study Notes — Master Prompt

Use this file to instruct any AI (or yourself) when creating or restructuring topic notes inside `subjects/`.

**Product goal:** Each topic file is a **Lucent-style / UPSC-portal revision note** — to the point, zero fluff, **zero repetition**. Not a textbook. Not an encyclopedic “source of truth.”  
**Look & feel gold standard:** **Lucent’s General Knowledge** (Polity/History pages) and crisp UPSC website / PIB-style static notes — headings → bullets/tables → exam locks only.  
**Length rule:** Size **may exceed 20 minutes** of reading when the chapter needs it (many syllabus bullets / dense PYQ surface). **Hard rule is no repetition** — never pad with restated facts. Prefer dense Lucent layout over cutting exam content.  
**Revision targets (soft):** aim for a Quick Revision pass in **2–5 minutes**; first full read as short as the chapter allows without dropping syllabus/PYQ locks.  
**Content rule:** Syllabus bullets + UPPCS/RO-ARO PYQ-tested facts (2018–2025) + **current affairs when needed** (schemes, appointments, amendments, reports — see §Current Affairs Protocol). If it is not syllabus, not PYQ-tested, not a needed trap, and not exam-relevant CA → **do not write it**.  
**Practice Zone:** **minimum 25** questions per topic; scale up with chapter size (see sizing table).

**Exam pattern standard:** `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md` (format reference) + **all files in `pyq/` from 2018–2025** + **RO-ARO** — **every matching UPPCS/RO-ARO question must be searched and added per §UPPCS PYQ Search & Addition Protocol**  
**External high-yield (mandatory when `pyq/` is thin):** Also run **§External High-Yield Completeness Protocol** — search UPSC/standard exam lists + known RO-ARO hits so books, poems, novels, authors, match-pairs are not missed just because they are absent from local `pyq/`.  
**Current affairs:** Run **§Current Affairs Protocol** when the topic can be asked with a recent fact (schemes, ministries, amendments, indices, appointments, UP-specific CA).  
**Syllabus source:** Each subject folder's `00_Syllabus.md`  
**Gold standard (structure + brevity):** **Lucent GK page layout** + this prompt’s §Lucent Voice + §Length Budget. Do **not** copy narrative depth from older encyclopedic Topic 1 files. Those files are **anti-patterns**.

> **For the AI:** Self-verify every topic before presenting it. Run §Mandatory AI Workflow and output the §Delivery Report. If any gate fails (including redundancy gates **R1–R8**, Practice **≥25**, CA when needed, and PYQ gates **F9/F22**), fix the file first.

### One-Line Universal Prompt (copy for any topic)

```
Create/restructure Topic N in @subjects/[subject]/ using @subjects/prompt.md + @00_Syllabus.md + @pyq/.
Run Phase A→B→C. Phase A Step 4: full UPPCS PYQ search (§UPPCS PYQ Search & Addition Protocol).
Phase A Step 4b: §External High-Yield Completeness Protocol when matching-heavy.
Phase A Step 4c: §Current Affairs Protocol when topic can carry recent exam facts.
Write LUCENT-STYLE notes — one-fact-one-home; NO repetition. Length may exceed 20 min if chapter needs it.
Practice Zone: minimum 25 (scale up by chapter size). Keep full PYQ Bank.
Self-verify (R1–R8 + F1–F22). Delivery Report with PYQ + CA + redundancy audit + "File ready: YES".
One topic only. Wait for approval before next.
```

---

## Goal

Build UPPCS Prelims (+ light Mains where required) notes that maximize **ROI per minute studied**:

| Priority | Meaning |
|----------|---------|
| **Revision-first** | Scannable bullets, tables, chronology boxes, article/scholar lists, trap boxes |
| **Syllabus-complete** | Every `00_Syllabus.md` bullet for this topic is covered |
| **PYQ-complete** | Every matching UPPCS/RO-ARO (2018–2025) from `pyq/` is mined and placed (see PYQ protocol — **unchanged**) |
| **One-fact-one-home** | Each exam fact appears in **exactly one** teaching home; other sections may only **point**, never re-teach |
| **Self-contained enough** | Student can answer this topic’s Prelims questions from this file alone — without textbook prose |
| **One topic at a time** | Fully complete and student-approved before moving on |

**Not the goal:** Academic completeness, narrative history essays, repeating the same fact in Quick Revision + Exam Facts + Traps + Consolidated Reference + PYQ explanations.

---

## North Star vs Anti-Pattern

| ✅ High-ROI revision note | ❌ Encyclopedic anti-pattern (REJECT) |
|---------------------------|----------------------------------------|
| 12–15 min first read | 60–90 min / 30–50+ pages |
| One chronology box + compact Act cards | Full Causes → Course → Results essays per Act |
| Fact taught once; traps as 1-line callouts | Same fact in Quick Revision, Exam Facts, Traps, Consolidated, PYQ “why” |
| Table / list where exam asks matching | Long narrative where a one-line exam point suffices |
| Practice Zone = short drill (see sizing) | 40–50 practice questions bloating the file |
| PYQ Bank = full (protocol unchanged) | Skipping PYQs to “save length” — **forbidden** |

**Canonical length anti-pattern:** `subjects/polity/01_Constitutional_Development.md` (pre-rewrite) — huge Quick Revision + Must-Know + Memory Tricks + per-Act Definitions/How It Works/Exam Facts/Examples/PYQs stacks repeating the same chronology. **Never generate that shape again.**

---

## One-Fact-One-Home Rule (critical)

Every exam fact has **one teaching home**. Other places may cite it only as a **pointer** (e.g. `→ see §1.3` or a year tag), never a second explanation.

| Content type | Primary home | Must NOT also appear as full restate in |
|--------------|--------------|----------------------------------------|
| Chronology / Act spine / mission sequence | Quick Revision Box **or** one master chronology table in first N.X | Exam Facts, Consolidated dates list, Common Traps prose |
| Dyarchy vs Autonomy (and similar pairs) | Must-Know Term Comparisons **or** one comparison table in N.X | Repeated in How It Works + Exam Facts + Traps |
| Borrowed features / match lists | One Master Match table | Scattered prose restating every row |
| Trap formulation | `> **Exam note:**` at teaching home **or** Common Traps (pick one) | Both with full wording |
| Scheme / Act card | N.X card or Consolidated Reference (pick one) | Both |
| Full PYQ text | Inline PYQ section **and** Complete PYQ Bank (allowed — **PYQ protocol exception**) | Do not also paste full PYQ into Practice Zone unless needed for format drill |

**PYQ exception:** Full question text appears inline under the best §N.X **and** again in Complete PYQ Bank — that duplication is **required** by §UPPCS PYQ Search & Addition Protocol and is **not** a one-fact-one-home violation.

**Before writing each section ask:** “Does this add a **new** exam fact or only rephrase something already above?” If only rephrase → **delete**.

---

## Topic Boundary Rule

**One topic file = one `##` heading in `00_Syllabus.md`, not one full NCERT book.**

| Rule | Meaning |
|------|---------|
| **In scope** | Subtopics under this topic number in `00_Syllabus.md` + exam-critical expansions needed for UPPCS/RO-ARO on *this* topic |
| **Out of scope** | Content belonging to other syllabus topics — teach fully in *that* file |
| **Brief cross-link OK** | 1–2 lines + Exam note for overlap — never "see Topic X" as a substitute for a needed trap |
| **NCERT split** | Extract only headings that map to *this* topic |

**Before writing:** Build a **Topic Boundary Table** — IN / OUT / BRIEF. Reject OUT content.

---

## Length Budget (hard — R1–R4)

| Budget | Limit | Notes |
|--------|------:|-------|
| **First-read body** (header → end of teaching sections + Quick Revision + comparisons + traps + consolidated) | Target **~400–700 lines**; hard cap **~900 lines** excluding Practice Zone + Complete PYQ Bank | PYQ Bank may be long — that is OK |
| **Quick Revision Box** | Max **~80 lines** for large topics; prefer denser tables | Raata spine only |
| **Per syllabus bullet (N.X)** | Target **8–25 lines**; hard cap **~35 lines** excluding inline PYQs | Tables beat essays |
| **Practice Zone** | **8–15** questions (see sizing table) | Not 25–50 |
| **Common Traps** | **8–15** short lines; no re-teaching | Only trap formulations |
| **Mains Framework** | Only if mandatory; **1 short frame** (≤15 lines) | Skip if thin value |

**File may exceed line cap only because Complete PYQ Bank is large.** Teaching body must still pass the time-target smell test: a student who already knows the PYQ Bank can finish teaching content in ≤20 minutes.

---

## Mandatory AI Workflow (Do Not Skip)

Every topic: **Phase A → B → C**. Do not present until Phase C passes.

### Phase A — Pre-Audit (before writing)

```
1. Read 00_Syllabus.md → copy EVERY bullet for this topic
2. Read this prompt’s §Required Document Structure + §Length Budget (NOT old encyclopedic Topic 1 files as depth models)
3. Read NCERT / standard sources for this topic → list exam-relevant headings only
4. Run UPPCS PYQ search protocol (§UPPCS PYQ Search & Addition Protocol) — full inventory before writing
4b. Run External High-Yield Completeness Protocol when matching-heavy / F22 triggers
5. Build TOPIC BOUNDARY TABLE (IN / OUT / BRIEF)
6. Build SYLLABUS → N.X MAP (one row per bullet)
7. Build CONCEPT INVENTORY — each concept tagged with ONE home section
8. Draft length plan: estimate lines per N.X; cut any section that would only restate Quick Revision
```

**Stop if:** Any syllabus bullet has no N.X assignment.  
**Stop if:** Matching-heavy topic and External High-Yield inventory was skipped.

### Phase B — Write

Write per §Required Document Structure. Enforce one-fact-one-home while writing. Prefer:

1. Chronology / comparison / match **tables**
2. Compact **Act / scheme / event cards** (Year | Provision | Trap)
3. Short bullets (1 idea each)
4. `> **Exam note:**` for the single highest-yield trap per block

**Do not** write Causes / Step-by-Step Course / Results essays unless the exam tests process *and* a table cannot carry the marks (rare). For wars/treaties/rebellions use **§History Event Card Protocol** (compact), not old narrative depth protocol.

### Phase C — Post-Audit

Run §Quality Checklist + §Automatic Fail Conditions (including **R1–R8**). Fix all failures. Output **§Delivery Report** in chat only.

---

## Completeness Rules (exam coverage without encyclopedias)

| # | Rule | Fail | Pass |
|---|------|------|------|
| 1 | **No "etc." in exam lists** | "Charter Acts 1793, 1813, etc." | Full exam-relevant rows in table |
| 2 | **2025 overlap in teaching home** | Only in Practice Zone | 1-line in N.X + Exam note |
| 3 | **Paired concepts together** | Dyarchy without Autonomy | One comparison row/table |
| 4 | **One home per fact** | Same date in 4 sections | One home + pointers |
| 5 | **Syllabus map complete** | Bullet with no N.X | Every bullet → N.X |
| 6 | **PYQ mined from pyq/** | Invented / memory-only | Full protocol (§ below) |
| 7 | **External high-yield when needed** | Missed Firangiya-class titles | F22 protocol |
| 8 | **UP Focus when applicable** | UP geo topic with no UP rows | Short UP Focus table |
| 9 | **Prose only when table cannot** | 8+ sentence essay for a date list | Chronology table |
| 10 | **History = cards, not novels** | Full war narrative per Act | Event/Act card + trap |

---

## Subtopic Depth Matrix (revision mode)

Every `## N.X` includes **only what adds exam value**:

| Block | Required? | Maximum / rule |
|-------|-----------|----------------|
| Compact lead (1–3 bullets) **or** Definitions (only if wording variants are tested) | If needed | ≤5 lines total — skip empty “Definitions” tables |
| Teach block: bullets **and/or** 1 table | **Always** | Prefer table; ≤12 bullets if prose needed |
| `> **Exam note:**` | **Always** | 1 trap (2 only if both PYQ-proven) |
| Supporting table | If classifying/comparing | 1 primary table; 2nd only if distinct exam job |
| `### Exam Facts (raata)` | **Only if** facts are **not** already in Quick Revision / table above | ≤8 bullets; else **omit section** |
| `### PYQs — [Subtopic]` | **Always** (per PYQ protocol) | Full text + why — **unchanged rules** |
| `### Examples` | **Rarely** | Only if example teaches a **new** match/location; else **omit** |

> **Geography exception (`subjects/geography/`):** Follow any local anti-redundancy rule if present. Still obey length budget and one-fact-one-home.

**Scheme/policy:** Scheme card (Year | Ministry | Objective | Trap) — one card, one home.  
**Match-list topics:** Master Match table is the teaching home; prose only for swap traps.

---

## History Event Card Protocol (replaces encyclopedic war essays)

Apply to wars, battles, treaties, rebellions, annexations, constitutional Acts, missions/plans.

### Required card (compact)

```markdown
## N.X [Event / Act Name] ([Year])

| Field | Exam lock |
|-------|-----------|
| **What** | 1 line |
| **Why it matters** | 1 line (exam angle) |
| **Key provisions / outcomes** | 3–6 bullets OR mini-table |
| **Firsts / numbers** | Only PYQ-tested locks |

> **Exam note:** [single highest-yield trap]

### PYQs — [Subtopic]
[per PYQ protocol]
```

### Multi-event parents (e.g. Anglo-Mysore Wars, Charter Acts)

1. Parent gets **one master chronology / comparison table**.
2. Each war/Act gets a **short card** (`### N.X.1`, `### N.X.2`) — **not** Causes×5 + Course×8 + Results×4 essays.
3. Treaty-year traps → **one comparison table**, not repeated prose.

### Reject (thin *and* fat both fail)

| Reject | Why |
|--------|-----|
| Date checklist with no trap/comparison | Cannot beat wrong options |
| Full Causes → Course → Results novel per Act | Kills revision time |
| Restating the parent chronology inside every child card | Violates one-fact-one-home |

---

## NCERT & Syllabus Cross-Verification

### Three-way match

```
00_Syllabus.md bullet  ↔  N.X section  ↔  NCERT/exam heading (if IN scope)
```

### Completeness smell test (before delivery)

For each syllabus bullet:
- Can the student answer a **2-statement UPPCS** question from that section’s table/bullets alone?
- Can they see **why the wrong option fails** from the Exam note or comparison row?
- Is there a **PYQ** (inline or bank) touching this bullet when one exists in `pyq/`?

If NO → add the missing **exam lock**, not a paragraph essay.

---

## Automatic Fail Conditions

If **any** are true, the file is **NOT complete**:

### Redundancy & length (R-gates)

| # | Fail condition |
|---|----------------|
| R1 | Teaching body clearly exceeds **~20 min** first-read (encyclopedic prose / repeated stacks) |
| R2 | Same fact fully restated in **3+** of: Quick Revision, N.X teach, Exam Facts, Consolidated, Common Traps |
| R3 | Any N.X has Definitions + How It Works essay + Exam Facts + Examples all repeating one table |
| R4 | History/Act section uses full Causes/Course/Results novel instead of Event/Act card |
| R5 | Practice Zone **>15** questions without student requesting more |
| R6 | Common Traps re-explain concepts already taught (should be trap-only lines) |
| R7 | Quick Revision > ~80 lines of low-density narrative |
| R8 | File tagged or titled as “Complete Source of Truth — no other book needed” |

### Coverage & quality (F-gates)

| # | Fail condition |
|---|----------------|
| F1 | Any `00_Syllabus.md` bullet for this topic lacks an N.X section |
| F2 | Any N.X lacks a teach block (bullets and/or table) with enough locks to answer a 2-statement question |
| F3 | Any N.X lacks Exam note **and** has no PYQ/Practice touchpoint for that subtopic when PYQs exist |
| F4 | Enumerated exam list uses "etc." / incomplete rows for lists UPPCS matches |
| F5 | 2025 overlap cited but concept not in matching N.X teaching home |
| F6 | Common Trap date/number missing from its teaching home (Quick Revision or N.X/Consolidated) |
| F7 | `> **Exam note:**` missing from any substantial N.X |
| F8 | Practice Zone mostly simple MCQs (<40% multi-statement) **when Practice Zone is included** |
| F9 | PYQs or PYQ Bank use summary-table only (no full question text); PYQ Bank answers visible without `<details>`; **any UPPCS Prelims (2018–2025) or RO-ARO question in `pyq/` that maps to this topic is missing from the topic file** |
| F10 | Internal syllabus audit fails — bullet lacks N.X |
| F11 | UP-relevant topic lacks UP Focus table |
| F12 | 4+ consecutive tables with **zero** exam notes/traps and no scannable locks |
| F13 | "See Topic X" used to dodge a trap this file must carry |
| F14 | Must-Know Term Comparisons missing Hindi column (when section exists) |
| F15 | Common Traps fewer than **8** for ★★★ topics (or traps dumped as essays) |
| F16 | Explanatory bullets are unreadable fragment salad **without** a table carrying the same locks |
| F17–F21 | **Retired** as “must write war novels.” Use §History Event Card Protocol instead. Still fail if multi-war parent lacks per-event cards **or** treaty comparison table when 2+ treaties are tested |
| F22 | Matching-heavy topic delivered without §External High-Yield Completeness Protocol — OR known high-yield title missing from Quick Revision / Master Match / teaching home |

---

## Delivery Report (chat only)

```markdown
## Verification Report — Topic N

| Gate | Status | Notes |
|------|--------|-------|
| Syllabus bullets mapped | ✅ N/N | |
| Length / time target | ✅ | Est. first read: [min]; teaching lines ~[N]; PYQ Bank excluded from time target |
| One-fact-one-home audit | ✅ | No triple restates |
| PYQs mined from pyq/ | ✅ | **UPPCS/RO-ARO: [Q# + year + exam…]**; all in PYQ Bank |
| UPPCS PYQ audit | ✅ | Searched: [paths]; Found: [N]; Inline: [N]; Bank: [N]; Missing: 0 |
| External high-yield audit (F22) | ✅/N/A | |
| 2025 overlap in teaching home | ✅ | |
| Practice Zone count + mix | ✅ | [8–15]; multi-statement % |
| UP Focus | ✅/N/A | |
| R1–R8 + F1–F22 | ✅ 0 failures | |
| History/Act cards (not novels) | ✅ | |

**Deliberately excluded (other topics / non-exam fluff):** […]
**File ready for student review:** YES / NO
```

---

## The #1 Rule — Exam Locks, Not Essays

UPPCS asks multi-statement, A/R, matching, NOT-matched, chronology, scheme traps. Notes must make each **statement decidable** — usually via a row in a table or a one-line lock + Exam note.

| Bad (reject) | Good (required) |
|--------------|-----------------|
| 40-line essay on Regulating Act causes | Act card: GG of Bengal, Hastings, SC 1774, Bombay/Madras subordinate + Exam note |
| Exam Facts repeating Quick Revision | Omit Exam Facts; point to Quick Revision |
| “How It Works” ≥8 fluffy bullets | 4–8 **locks** only; cut colour |

**Still reject table-only mush with no trap:** a classification table needs at least one Exam note so wrong options fail.

### Bullet style

- One idea per bullet; bold **dates, numbers, names**.
- Prefer complete short sentences in teaching bullets.
- Quick Revision code blocks and tables may stay compact (semicolons OK there).
- Do not pack unrelated facts with semicolon chains in teaching bullets when a table row is clearer.

---

## Required Document Structure (exact order)

Topic files are **revision notes**. Do **not** include AI workflow artifacts in the file.

```markdown
# Topic N — [Topic Title]
### ★ UPPCS Revision Sheet — High-ROI (read 12–15 min · revise 2–3 min)

> **Covers syllabus:** [every bullet — grouped but complete]
> **Sources baked in:** [NCERT / standard book chapters, official sources, PYQs]
> **Exam weight:** ★★★ / ★★ / ★ — [what UPPCS actually repeats]
> **Last verified:** [Month Year]

---

## Quick Revision Box — Raata This First
[Code block or dense tables — spine only; 5 min revise]

### Must-Know Term Comparisons
[Term A | Term B | Core difference | Hindi] — only exam-confused pairs

### Memory Tricks
[Only tricks that lock PYQ traps — skip filler mnemonics]

---

## N.1 [Subtopic]
[Event/Act card OR compact teach + table + Exam note + PYQs]
[… all syllabus bullets …]

---

## Consolidated Reference — Once Only
[Only lists NOT already fully housed in Quick Revision / N.X]
[Acts / Articles / Orgs / Dates / Schemes / UP Focus as needed]

---

## Practice Zone — UPPCS Format Drill
[8–15 questions; answers in `<details>`]

---

## Complete PYQ Bank (Topic N)
[FULL protocol — every mapped UPPCS/RO-ARO with full text + `<details>` answers]

---

## Mains Answer Framework
[Only if mandatory topic type; one short frame]

---

## Common Traps — Don't Fall For These
[8–15 trap lines — no re-teaching]
```

### AI-internal only (never in topic file)

Syllabus Coverage Map, Checklist, How to Use, How UPPCS Tests, Exam Intelligence tables, “End of Topic” footer.

> **Images disabled:** Do not add Exam Visuals / generate image assets. Teach location/structure with tables and traps only.

---

## Content Rules

### DO

| Rule | Why |
|------|-----|
| **One-fact-one-home** | Stops 60–90 min reads |
| **Tables & chronology first** | Matching + chronology = UPPCS bread-and-butter |
| **Act/Event cards** | All locks, no novel |
| **Exam note at home** | Wrong-option killer |
| **Full PYQ protocol** | Unchanged — mine and bank everything |
| **Hindi in term comparisons** | UPPCS bilingual traps |
| **UP examples when tested** | District/river/site locks |
| **Bold dates/numbers/names** | Fast raata |
| **Scheme cards** | Year \| Ministry \| Objective \| Trap |

### DO NOT

| Anti-pattern | Why |
|--------------|-----|
| **Encyclopedic “source of truth” chapters** | Misses revision cycles before Prelims |
| **Triple restatement** across sections | Wasted minutes |
| **Causes/Course/Results novels** by default | Low marks per minute |
| **Empty Definitions / Examples / Exam Facts stacks** | Pure padding |
| **Practice Zone 25–50** | Bloat (PYQ Bank already trains) |
| **"See Topic X"** to dodge needed trap | Breaks self-test |
| **"etc."** in match lists | Missed row = missed mark |
| **Skipping PYQs to shorten file** | **Forbidden** — PYQ protocol unchanged |
| **Wikipedia dumps / non-exam colour** | Not ROI |

### Practice Zone sizing (revision mode)

| Subtopics in topic | Practice questions |
|--------------------|-------------------:|
| ≤5 | 8–10 |
| 6–12 | 10–12 |
| 13+ | 12–15 |
| CA-heavy | 12–15 (≥50% last 2 years’ patterns) |

**Format mix (unchanged intent):** ≥40% multi-statement; include A/R, matching, NOT-matched as relevant. Answers in `<details>`.

---

## UP-Specific Content

When topic touches UP geography, forests, wildlife, rivers, pollution, culture sites, or schemes — add a short **UP Focus** table (in Consolidated Reference or after Quick Revision):

Districts | Rivers | Cities | Protected areas | Schemes | Movements — **only rows that are exam-plausible**.

---

## UPPCS PYQ Search & Addition Protocol (Mandatory — UNCHANGED)

**Every topic file must include every UPPCS Prelims (2018–2025) and RO-ARO question from `pyq/` that maps to that topic.** Do not rely on memory, training data, or "pattern" questions when verbatim text exists in the repo. **Do not limit searches to 2024–2025 only** — older papers repeat concepts and traps.

### Repository layout (search all of these)

| Path | File | Exam | Status |
|------|------|------|--------|
| `pyq/2025/` | `UP_PCS_Pre_2025_GS_Paper_1.md` | UPPCS Prelims 2025 GS Paper 1 | ✅ Available |
| `pyq/2024/` | `UPPCS_2024_Prelims_GS1_Question_Paper.md` | UPPCS Prelims 2024 GS Paper 1 | ✅ Available |
| `pyq/2023/` | `UP_PCS_PRE_2023_GS_PAPER_1.md` | UPPCS Prelims 2023 | ✅ Available |
| `pyq/2022/` | `UP_PCS_PRE_2022_GS_PAPER_1.md` | UPPCS Prelims 2022 | ✅ Available |
| `pyq/2021/` | `UP_PCS_PRE_2021_GS_PAPER_1.md` | UPPCS Prelims 2021 | ✅ Available |
| `pyq/2020/` | `UP_PCS_PRE_2020_GS_PAPER_1.md` | UPPCS Prelims 2020 | ✅ Available |
| `pyq/2019/` | `UP_PCS_PRE_2019_GS_PAPER_1.md` | UPPCS Prelims 2019 | ✅ Available |
| `pyq/2018/` | `UP_PCS_PRE_2018_GS_PAPER_1.md` | UPPCS Prelims 2018 | ✅ Available |
| `pyq/ro-aro/` or `pyq/YYYY/*RO*ARO*` | `RO_ARO_YYYY_Prelims_GS1_Question_Paper.md` | **RO-ARO** Prelims | As added |
| `pyq/YYYY/` (any other folder) | — | UPPCS / UPPSC exams | As added |

**Coverage:** UPPCS Prelims GS Paper-I is complete for **2018–2025** (150 questions per year). Search **all eight year folders** — do not limit to 2024–2025 only.

**RO-ARO:** Include **Review Officer / Assistant Review Officer** papers under `pyq/ro-aro/` (or year folders with `RO`, `ARO`, `RO-ARO` in filename). Tag inline as `RO-ARO Prelims YYYY, Q#`. Same inclusion rules as UPPCS Prelims — full text in PYQ Bank, map to §N.X by subtopic.

> **Reject:** Searching only `pyq/2025/` and `pyq/2024/` when **2018–2023** folders also exist. **Reject:** Ignoring RO-ARO files when `pyq/ro-aro/` exists. **Reject:** Omitting PYQs or shrinking the PYQ Bank to “save length.”

### Phase A — Search workflow (run before writing a single section)

```
Step 1: List syllabus keywords — every bullet for this topic + synonyms, Acts, schemes, place names, org names
Step 2: List ALL pyq/ paths to search:
        (a) pyq/2025/ → pyq/2024/ → … → pyq/2018/
        (b) pyq/ro-aro/ (all files) OR grep pyq/ for RO-ARO / RO / ARO in filenames
        (c) Any other pyq/YYYY/ folders not listed above
Step 3: For EACH path, grep for:
        (a) Subject: line matching this subject
        (b) Topic: / Subtopic: metadata lines near syllabus labels
        (c) Body text — concept names, place names, scheme names, match-list pairs from Concept Inventory
Step 4: For EACH hit — record: Question # | Year | Exam | Subject/Topic/Subtopic | Maps to §N.X | pyq/ path
Step 5: Cross-subject sweep — re-grep across ALL years for UP-specific traps even if Subject ≠ primary
Step 6: Build PYQ INVENTORY TABLE — every row maps to §N.X or "Topic-level PYQ Bank only"
Step 7: Stop if inventory has zero UPPCS/RO-ARO hits but topic is ★★+ — broaden keywords and re-search
```

**Tools:** Workspace search on **entire `pyq/` tree**. Read matching `# Question N` blocks in full.

### How to map a PYQ to a syllabus topic

| Signal | Rule |
|--------|------|
| **`Subtopic:` field** | Primary mapper when present — assign to matching §N.X |
| **`Topic:` field** | Primary mapper when `Subtopic:` is absent |
| **`Subject:` field** | Filter first; then cross-subject rule |
| **Keyword in question body** | Map if concept is **primary** in this topic (IN scope) |
| **Cross-subject** | Include if UPPCS/RO-ARO tests a concept this file owns |
| **OUT of scope** | Do **not** add full text here; one-line trap note only if it affects this topic |

### Minimum inclusion rules

| Level | Rule |
|-------|------|
| **Topic file (total)** | **Every** UPPCS Prelims (2018–2025) + **every** RO-ARO question from `pyq/` that maps to this topic → must appear in **Complete PYQ Bank** with full question text |
| **Per §N.X subtopic** | **≥2 UPPCS or RO-ARO** inline under `### PYQs — [Subtopic]` if available in `pyq/` across **any year 2018–2025**; else **1 UPPCS/RO-ARO + 1 UPSC**; full text + why |
| **2025 paper** | Every matching **2025 Q** → taught in matching §N.X **teaching home** + inline PYQ + PYQ Bank **(F5)** |
| **Older UPPCS (2018–2024)** | Every matching Q → inline in best-matching §N.X + PYQ Bank |
| **RO-ARO** | Same as UPPCS — full text, map to §N.X, tag `RO-ARO Prelims YYYY, Q#` |
| **UPSC Prelims** | Add where concept overlaps — **after** all UPPCS/RO-ARO for that subtopic |
| **Pattern PYQs** | Allowed **only** when no UPPCS/RO-ARO/UPSC verbatim exists in `pyq/` — suffix `— pattern` |

### Where to add each PYQ (four placements)

1. **§N.X teaching home** — 1-line callout for high-yield traps: `> **2025 Q144 trap:** …`
2. **`### PYQs — [Subtopic]`** — full question text + answer + why wrong options fail
3. **`## Complete PYQ Bank`** — every deduplicated UPPCS/RO-ARO from `pyq/` for this topic; answers in `<details>`; group by year (2025 → 2018 → RO-ARO) or chronological
4. **Practice Zone** (optional) — reproduce 1–3 highest-yield UPPCS/RO-ARO only if useful for format drill (do not dump the whole bank here)

### Subject-specific search hints (Environment & Ecology)

Grep **all years 2018–2025 + RO-ARO** for topic keywords (ecology, biodiversity, national park, pollution, climate, SDG, EPA, Chipko, World Environment Day, UP negatives, etc.) in addition to `Subject: Environment`.

### Reject conditions (PYQ-specific)

| Reject | Why |
|--------|-----|
| "UPPCS asked about X" with no question text | **F9** |
| 2025 Q cited only in Practice Zone | **F5** |
| UPPCS/RO-ARO mapped to topic but missing from PYQ Bank | **F9** |
| Summary table instead of full cards | **F9** |
| Pattern PYQ when verbatim exists in `pyq/` | Replace with mined text |
| Dropping PYQs to meet length budget | **Forbidden** — shorten teaching prose instead |

---

## PYQ Mining Rules (summary — UNCHANGED intent)

1. Run full **§UPPCS PYQ Search & Addition Protocol** — mandatory Phase A step.
2. Search **all `pyq/` folders: 2018→2025**, then **`pyq/ro-aro/`**.
3. Filter by `Subject:` / `Topic:` / `Subtopic:` **and** keyword grep.
4. Include **UPPCS + RO-ARO first**; add **UPSC** where overlapping.
5. Minimum per §N.X: **≥2 UPPCS/RO-ARO** if available; else **1 + 1 UPSC**.
6. Tag every inline PYQ with **exam + year + Q number**.
7. Add **full question text** to **Complete PYQ Bank** (`<details>` answers).
8. Delivery Report lists **every** UPPCS/RO-ARO Q# found.

---

## External High-Yield Completeness Protocol (Mandatory — F22)

> **Why:** Local `pyq/` alone misses RO-ARO/culture match titles (e.g. Firangiya) when `pyq/ro-aro/` is empty. Matching-heavy topics need external high-yield inventory.

### When mandatory

| Trigger | Examples |
|---------|----------|
| Books / Authors / Poems / Novels in syllabus | Modern India Topic 10; Art literature |
| Match-list heavy | Book↔author, scheme↔ministry, org↔report, day↔date |
| UP language-culture stream | Bhojpuri, Awadhi, folk theatre |
| `pyq/ro-aro/` missing/empty but topic ★★+ | Still search known RO-ARO hits |
| Short syllabus label exams expand | "Bhojpuri Literature", "GG books" |

### Workflow

```
Step 1: List matching / name-pair bullets
Step 2: Search standard UPSC/UPPCS static-GK sources for that family
Step 3: Search known RO-ARO hits when local ro-aro folder empty
Step 4: Build EXTERNAL HIGH-YIELD INVENTORY → merge YES rows into Concept Inventory
Step 5: Place each YES row in ONE home (Quick Revision spine + Master Match / N.X)
Step 6: If found RO-ARO/UPSC Q not in local pyq/ — add full text to PYQ Bank tagged
        `(RO-ARO/UPSC YYYY — not yet in local pyq/)`
```

### What NOT to dump

Entire Wikipedia bibliographies, unrelated bestsellers, wrong-topic historiography — mark OUT.

---

## When Restructuring a Topic File

```
Restructure @[topic_file].md using @subjects/prompt.md, @00_Syllabus.md, and @pyq/ (2018–2025 + RO-ARO).

Phase A: syllabus list, PYQ inventory, External High-Yield if needed, boundary table, concept inventory with ONE home each
Phase B: HIGH-ROI revision sheet (12–15 min). Act/Event cards. One-fact-one-home. NO encyclopedic novels.
Phase C: R1–R8 + F1–F22; Delivery Report "File ready: YES"

Rules:
1. Map every 00_Syllabus.md bullet → N.X.
2. Prefer tables/chronology/cards over prose.
3. Do NOT use old Topic 1 encyclopedic depth as a model.
4. History/Acts: §History Event Card Protocol only.
5. No "etc." in exam lists.
6. PYQs: full §UPPCS PYQ Search Protocol — every matching UPPCS/RO-ARO full text inline + Complete PYQ Bank (do not trim PYQs for length).
7. External high-yield when matching-heavy (F22).
8. Practice Zone: 8–15 questions; ≥40% multi-statement; `<details>` answers.
9. Hindi column in term comparisons.
10. UP Focus if applicable.
11. One topic only; wait for approval.
```

---

## File Naming Convention

| File | Purpose |
|------|---------|
| `00_Syllabus.md` | Master syllabus — subtopics list only |
| `01_[Topic_Name].md` … | One file per syllabus topic |
| `prompt.md` | This file — generation rules |

**Folder:** `subjects/[subject name]/[numbered files]`

---

## Section-by-Section Guide

### 1. Quick Revision Box

- Spine for **2–3 min revise** after first read
- Chronology, number locks, mission sequences, borrowed-feature traps
- No paragraphs; no duplicate of every N.X card

### 2. Subtopic Sections (N.X)

```markdown
## N.X [Subtopic]

| Field | Exam lock |
|-------|-----------|
| … | … |

- Only bullets that are not already rows above.

> **Exam note:** [trap]

### PYQs — [Subtopic]
1. **(UPPCS 20XX, Q#)** [full question]
   → answer + why wrong options fail
```

Omit Definitions / How It Works / Exam Facts / Examples unless they add **new** locks.

### 3. Consolidated Reference

Lists **once**, and **only if** not already complete in Quick Revision:
Acts | Articles | Orgs | Dates | Schemes | Reports | UP Focus.

### 4. Practice Zone

8–15 UPPCS-format questions. Hidden answers:

```markdown
<details>
<summary>Show answer</summary>

**Ans: C** — … trap …

</details>
```

### 5. Complete PYQ Bank — Self-Test Format (mandatory — UNCHANGED)

**Not a summary table.** Every mapped PYQ as a **full self-test card** with hidden answer.

```markdown
**Q1. UPPCS Prelims 2024**

[Full question text]

<details>
<summary>Show answer</summary>

**Ans: C** — 1-line why + why wrong options fail.

</details>
```

| Rule | Requirement |
|------|-------------|
| **Header** | `**Q{N}. {Exam} {Year}**` |
| **Full question text** | From `pyq/` when available |
| **Hidden answer** | `<details>` |
| **Coverage** | Every deduplicated mapped UPPCS/RO-ARO |
| **Order** | UPPCS newest first, then UPSC |
| **Pattern PYQs** | Suffix `— pattern` if not verbatim |

**Reject:** summary-only PYQ tables.

### 6. Mains Answer Framework

Only when topic is law/governance/environment-policy heavy and a short frame helps. Else skip.

### 7. Common Traps

- Trap lines only (what people confuse → correct lock)
- Do not restate full Act cards
- Sync numbers with teaching home **(F6)**

---

## Quality Checklist (Phase C)

### Syllabus & ROI
- [ ] Every syllabus bullet has N.X **(F1)**
- [ ] Header covers all bullets
- [ ] Teaching body fits **≤20 min** first read **(R1)**
- [ ] One-fact-one-home holds **(R2–R3)**
- [ ] No “Complete Source of Truth” framing **(R8)**
- [ ] History/Acts use cards, not novels **(R4)**

### Teaching quality
- [ ] Each N.X has teach locks + Exam note **(F2/F7)**
- [ ] No "etc." in exam lists **(F4)**
- [ ] 2025 overlaps in teaching home **(F5)**
- [ ] Term comparisons have Hindi **(F14)**
- [ ] UP Focus if applicable **(F11)**
- [ ] Common Traps = trap-only, ≥8 for ★★★ **(F15/R6)**

### PYQ (unchanged strictness)
- [ ] Full search 2018–2025 + RO-ARO **(F9)**
- [ ] Every hit in Complete PYQ Bank with full text + `<details>` **(F9)**
- [ ] Inline PYQs per minimum rules **(F9)**
- [ ] Delivery Report PYQ audit Missing: 0 **(F9)**
- [ ] F22 external high-yield when required

### Practice
- [ ] 8–15 questions **(R5)**
- [ ] ≥40% multi-statement **(F8)**
- [ ] Answers in `<details>`

### Student test
- [ ] 2-statement decidable from section locks alone
- [ ] Wrong options fail via Exam note / comparison
- [ ] PYQ Bank usable as pure self-test without rereading essays

---

## Workflow — One Topic at a Time

```
Phase A — PRE-AUDIT
  Syllabus bullets → PYQ inventory → External HY if needed → Boundary → Concept homes → Length plan

Phase B — WRITE
  Revision sheet structure → Act/Event cards → Consolidated (deduped) → Practice 8–15 → Full PYQ Bank

Phase C — POST-AUDIT
  R1–R8 + F-gates → Delivery Report → File ready YES → wait for approval
```

**Do NOT start Topic N+1 until student approves Topic N.**

---

## Gold Standard Structure Diff (revision mode)

| Block | Required? |
|-------|-----------|
| Header (Revision Sheet framing + covers syllabus + weight + verified) | **Yes** |
| Quick Revision Box | **Yes** |
| Must-Know Term Comparisons + Hindi | **Yes** if ≥3 confused pairs; else skip |
| Memory Tricks | **Optional** — only PYQ-useful |
| N.X compact teach + Exam note + PYQs | **Yes** |
| Consolidated Reference (deduped) | **Yes** if shared lists remain |
| UP Focus | If UP-relevant |
| Practice Zone (8–15) | **Yes** |
| Complete PYQ Bank (full) | **Yes** |
| Mains Framework | Only if high value |
| Common Traps (trap-only) | **Yes** for ★★+ |
| Encyclopedic Definitions/How It Works/Examples stacks | **No** |
| AI-internal maps in student file | **No** |

---

## Example Prompt for Next Topic

```
Restructure subjects/polity/01_Constitutional_Development.md using:
- @subjects/prompt.md (high-ROI revision mode; Phase A→B→C)
- @subjects/polity/00_Syllabus.md
- @pyq/ (2018–2025 + RO-ARO)

Convert encyclopedic chapter → 12–15 min revision sheet.
One-fact-one-home. Act/mission cards + chronology tables.
KEEP full PYQ protocol (every matching Q full text + Complete PYQ Bank).
Practice Zone 8–15 only.
Delivery Report with length audit + PYQ audit; File ready: YES.
Topic 1 only. Wait for approval.
```

---

## Subject-Specific Notes

### Environment & Ecology

Prefer mechanism **locks** (definitions that decide T/F) over essays. UP Focus for forests/Ramsar/pollution cities. Full PYQ protocol. Practice 8–15.

### Art & Culture

Match tables (dance↔state, temple↔style, author↔work) as primary home. Run F22 for literature streams. UP Focus: Mathura, Varanasi, Lucknow, Sarnath, Agra, UP folk forms.

### Ancient / Medieval / Modern India

Use **Event cards + chronology/treaty tables**. Do **not** recreate Carnatic-war novel depth. Multi-war bullets → `N.X.1`… cards under one parent table.

**Mod