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

> **For the AI:** Self-verify every topic before presenting it. Run §Mandatory AI Workflow and output the §Delivery Report. If any gate fails (including redundancy gates **R1–R9**, Practice **≥25**, CA when needed, and PYQ gates **F9/F22**), fix the file first.

### One-Line Universal Prompt (copy for any topic)

```
Create/restructure Topic N in @subjects/[subject]/ using @subjects/prompt.md + @00_Syllabus.md + @pyq/.
Run Phase A→B→C. Phase A Step 4: full UPPCS PYQ search (§UPPCS PYQ Search & Addition Protocol).
Phase A Step 4b: §External High-Yield Completeness Protocol when matching-heavy.
Phase A Step 4c: §Current Affairs Protocol when topic can carry recent exam facts.
Write LUCENT-STYLE notes — one-fact-one-home; NO repetition. Length may exceed 20 min if chapter needs it.
Practice Zone: minimum 25 (scale up by chapter size). Keep full PYQ Bank.
Self-verify (R1–R9 + F1–F22). Delivery Report with PYQ + CA + redundancy audit + "File ready: YES".
One topic only. Wait for approval before next.
```

---

## Goal

Build UPPCS Prelims (+ light Mains where required) notes that maximize **ROI per minute studied**:

| Priority | Meaning |
|----------|---------|
| **Lucent voice** | Headings → bullets/tables → locks only; no essay filler |
| **Syllabus-complete** | Every `00_Syllabus.md` bullet for this topic is covered |
| **PYQ-complete** | Every matching UPPCS/RO-ARO (2018–2025) from `pyq/` is mined and placed (see PYQ protocol — **unchanged**) |
| **CA when needed** | Recent exam-relevant facts added once (schemes, amendments, reports, UP CA) |
| **One-fact-one-home** | Each exam fact appears in **exactly one** teaching home; other sections may only **point**, never re-teach |
| **Practice ≥25** | Practice Zone minimum 25; scale up with chapter size |
| **Self-contained enough** | Student can answer this topic’s Prelims questions from this file alone — without textbook prose |
| **One topic at a time** | Fully complete and student-approved before moving on |

**Not the goal:** Academic completeness, narrative history essays, repeating the same fact in Quick Revision + Exam Facts + Traps + Consolidated Reference + PYQ explanations.

---

## Lucent Voice (mandatory look)

**Gold-standard layout = coaching/PW notes + Lucent GK**, not textbook chapters.

### Canonical Act / Event block (COPY THIS SHAPE)

```markdown
## Indian Councils Act, 1861
**Viceroy:** Lord Canning

- The Viceroy could nominate Indians as non-official members; in **1862** Canning nominated three: Raja of Benaras, Maharaja of Patiala, Sir Dinkar Rao.
- Restored legislative powers of Bombay and Madras (start of decentralisation).
- Enabled Viceroy to issue **Ordinances** (valid **6 months**) in emergencies without council consent.
- Portfolio system (from **1859**) was **legally recognised** by the 1861 Act — each member managed a department independently.

> **Exam note:** UPPCS 2021 Q13 — portfolio/departmental system = **1861**, not 1892/1909.
```

| Do | Don't |
|----|-------|
| **One heading → Viceroy/year → exam bullets** | `### Definitions` + `### How It Works` + `### Exam Facts` + `### Examples` stack |
| Put **all** locks for that Act in that single bullet list | Restate the same locks in Raata / Examples / second prose block |
| Include **exam specifics** (names, numbers, years, “firsts”) | Vague one-liners only (“introduced portfolio system”) with no exam meat |
| One optional `Exam note` / PYQ year tag under the block | Full PYQ dump under every Act **and** again as Raata |
| Comparison table only for confused pairs (Dyarchy vs Autonomy) | Narrative “How It Works” essays |

### Hard ban — the stack you rejected

**REJECT and rewrite if any N.X looks like this:**

1. Definitions table  
2. How It Works (repeats Definitions)  
3. Exam Facts / Raata (repeats How It Works)  
4. Examples (repeats again)  
5. Inline PYQs  

That stack is why notes become unreadable. **One teaching home = the Act bullet list.**

### Density rule

- Prefer **5–12 solid bullets** per Act/event (PW density), not 2–3 empty lines and not 40-line essays.
- Expand with **new facts** only; never a second section that rephrases the first.
- Quick Revision Box = short spine for later raata — **does not** restate every bullet from Act blocks (years + one-line identity only).

---

## North Star vs Anti-Pattern

| ✅ Lucent-style revision note | ❌ Encyclopedic anti-pattern (REJECT) |
|------------------------------|----------------------------------------|
| Dense, readable, no repeated facts | Same fact 5× across sections (unreadably long) |
| One chronology box + compact Act cards | Full Causes → Course → Results essays per Act |
| Fact taught once; traps as 1-line callouts | Same fact in Quick Revision, Exam Facts, Traps, Consolidated, PYQ “why” |
| Table / list where exam asks matching | Long narrative where a one-line exam point suffices |
| Practice Zone **≥25**, scaled by chapter | Practice Zone under 25 |
| PYQ Bank = full (protocol unchanged) | Skipping PYQs to “save length” — **forbidden** |
| CA block only when topic needs recent facts | Random CA dump unrelated to syllabus |

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

## Length Budget (redundancy-first — not a hard time cap)

**Hard rule:** zero repetition (one-fact-one-home).  
**Soft rule:** keep Lucent-dense; do not write essays.  
**Allowed:** teaching body **may exceed ~20 minutes** when the chapter has many syllabus bullets or dense PYQ/CA surface — **only** by adding **new** locks, never by restating.

| Budget | Guidance | Notes |
|--------|----------|-------|
| **Teaching body** | As long as needed for syllabus + PYQ + needed CA | Fail only if repetitive / essay-padded (**R1–R3**) |
| **Quick Revision Box** | Dense spine; prefer tables | Cut low-density narrative, not exam locks |
| **Per syllabus bullet (N.X)** | Prefer **8–25 lines** of locks; expand only for new PYQ/CA locks | Tables beat essays; no Definitions+HowItWorks+ExamFacts+Examples echo |
| **Practice Zone** | **Minimum 25**; scale up by chapter (see sizing) | Not optional; not under 25 |
| **Common Traps** | **8–15** short lines; no re-teaching | Trap formulations only |
| **Mains Framework** | Only if mandatory; **1 short frame** | Skip if thin value |
| **Complete PYQ Bank** | Full protocol — length OK | Do not trim PYQs |

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
4c. Run Current Affairs Protocol — search recent (≈ last 12–24 months) exam-relevant CA for this topic; skip only if topic is purely historical with zero CA surface
5. Build TOPIC BOUNDARY TABLE (IN / OUT / BRIEF)
6. Build SYLLABUS → N.X MAP (one row per bullet)
7. Build CONCEPT INVENTORY — each concept tagged with ONE home section (include CA rows)
8. Draft coverage plan: every syllabus/PYQ/CA lock has a home; delete any planned section that would only restate another
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

Run §Quality Checklist + §Automatic Fail Conditions (including **R1–R9**). Fix all failures. Output **§Delivery Report** in chat only.

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

Every Act / event / concept uses **one block only**:

| Block | Required? | Rule |
|-------|-----------|------|
| Heading (`##` / `###`) + Viceroy / Year line | **Always** for Acts | e.g. `**Viceroy:** Lord Canning` |
| Exam bullets (PW/Lucent density) | **Always** | 5–12 locks; names/numbers/firsts included |
| `> **Exam note:**` | When trap exists | 1 line OK if **no** PYQ cited |
| Full PYQ under Act (when cited) | **Mandatory if citing** | Complete stem + options + `<details>` answer — never year/Q# only |
| Full PYQ text under every N.X | Not required for every Act | Only where a real PYQ is being referenced; all mapped PYQs still in Complete PYQ Bank |

---

## History / Act Block Protocol (PW style)

Apply to Acts, wars, treaties, missions, CA events.

```markdown
## [Name], [Year]
**Viceroy / Key actor:** …

- Fact 1 (exam-specific)
- Fact 2
- …

> **Exam note:** [trap + PYQ year if any]
```

Multi-event parents (e.g. Charter Acts, Anglo-Mysore): one short intro line + separate `###` blocks per Act/war — each block is self-contained bullets, **no** shared How It Works that repeats children.

**Reject:** Causes → Course → Results novels; Definitions/How It Works/Raata/Examples stacks.

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
| R1 | Teaching body padded with **encyclopedic prose / repeated stacks** (length OK; **repetition is not**) |
| R2 | Same fact fully restated in **3+** of: Quick Revision, N.X teach, Exam Facts, Consolidated, Common Traps |
| R3 | Any N.X has Definitions + How It Works essay + Exam Facts + Examples all repeating one table |
| R4 | History/Act section uses full Causes/Course/Results novel instead of Event/Act card |
| R5 | Practice Zone **fewer than 25** questions |
| R6 | Common Traps re-explain concepts already taught (should be trap-only lines) |
| R7 | Quick Revision is low-density narrative that only restates N.X cards |
| R8 | File tagged or titled as “Complete Source of Truth — no other book needed” |
| R9 | Topic has clear CA surface (schemes/amendments/reports/appointments/UP CA) but §Current Affairs Protocol was skipped with no justification |

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
| F8 | Practice Zone not in **UPPCS 2024–25 format**: **<60% multi-statement/application**, OR missing any of {A/R, Match-List, chronology, NOT-matched}, OR dominated by direct single-fact recall (`"X is under: A…B…"`) **when Practice Zone is included** |
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
| Redundancy audit (one-fact-one-home) | ✅ | No triple restates; length may be >20 min if needed |
| PYQs mined from pyq/ | ✅ | **UPPCS/RO-ARO: [Q# + year + exam…]**; all in PYQ Bank |
| UPPCS PYQ audit | ✅ | Searched: [paths]; Found: [N]; Inline: [N]; Bank: [N]; Missing: 0 |
| External high-yield audit (F22) | ✅/N/A | |
| Current affairs audit (R9) | ✅/N/A | Sources: [PIB/…]; Added: [list]; Skipped: [why] |
| 2025 overlap in teaching home | ✅ | |
| Practice Zone count + mix | ✅ | **≥25** (actual: [N]); multi-statement % |
| UP Focus | ✅/N/A | |
| R1–R9 + F1–F22 | ✅ 0 failures | |
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
### ★ UPPCS Revision Sheet — Lucent-style (no repetition · Practice ≥25)

> **Covers syllabus:** put inside a toggle (see structure below) — do not leave as a long always-visible line  
> **Sources baked in:** …  
> **Exam weight:** …  
> **Last verified:** …  

```markdown
<details>
<summary><strong>Covers syllabus</strong> (click to expand)</summary>

Constitutional Development | Regulating Act 1773 | … (every bullet)

</details>
```

**PYQ citation rule:** If an Act/event block refers to a PYQ, write the **complete question** (stem + options) under that block with answer in `<details>`. Do **not** cite as only `UPPCS 2021 Q13`. Full bank at the end still required.

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
[**Minimum 25** questions; scale up by chapter; answers in `<details>`. **Must follow the UPPCS 2024–25 Format mix:** ≥60% multi-statement/application; include A/R, Match-List, chronology, NOT-matched; no direct one-liner recall as the majority. See §Format mix.]

---

## Complete PYQ Bank (Topic N)
[FULL protocol — every mapped UPPCS/RO-ARO with full text + `<details>` answers]

---

## Current Affairs (if needed)
[Only exam-relevant recent facts for THIS topic — Year | Fact | Why asked | Source. Skip section if N/A]

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
| **Practice Zone under 25** | Too thin for chapter drill |
| **"See Topic X"** to dodge needed trap | Breaks self-test |
| **"etc."** in match lists | Missed row = missed mark |
| **Skipping PYQs to shorten file** | **Forbidden** — PYQ protocol unchanged |
| **Skipping needed CA** | Misses Prelims currency (R9) |
| **Wikipedia dumps / non-exam colour** | Not ROI |
| **Repeating facts to “fill” a long chapter** | Length without new locks = fail |

### Practice Zone sizing (minimum 25)

| Subtopics in topic | Practice questions |
|--------------------|-------------------:|
| ≤5 | **25–30** |
| 6–12 | **30–40** |
| 13+ | **40–50** |
| CA-heavy | **30–50** (≥50% last 2 years’ patterns / CA locks) |

**Format mix (UPPCS 2024–25 standard — mandatory):** Practice questions must **mirror the current UPPCS/RO-ARO paper**, not direct one-liners. Reference: `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md`.

- **≥60%** of questions must be **multi-statement / application** style (not simple single-fact recall).
- **≤25%** may be single-best-answer, and even those should test a trap, not a bare definition.
- Use the **full UPPCS format toolkit**, spread across the set:
  - **"Which of the following statement(s) is/are correct?"** — 2–3 numbered statements + code (Only 1 / Only 2 / Both / Neither).
  - **"How many of the above statements are correct?"** — 3–4 statements + code (Only one / Only two / All three / None).
  - **Assertion–Reason (A/R)** — use the standard four options verbatim (A: both true & R explains A; B: both true, R not explanation; C: A true, R false; D: A false, R true).
  - **Match List-I with List-II** — 4 pairs + four code permutations (A-1,B-2,…).
  - **Chronological order** — arrange events/cases/amendments + code.
  - **"NOT correctly matched"** — numbered pairs + code (Only 2 / 1 and 2 / …).
- Each set should contain **at least one** of: A/R, Match-List, chronology, and NOT-matched.
- Answers hidden in `<details>`; give the **trap/why**, not just the letter.

> **Anti-pattern (fails F8):** a Practice Zone that is mostly `"X is guaranteed by: A. Art.12 B. Art.14 …"` direct recall. That is **not** UPPCS format.

---

## Current Affairs Protocol (add when needed — R9)

Run in **Phase A Step 4c** for every topic. Mark **N/A** only when the topic is purely static/historical with **no** plausible recent Prelims ask.

### When CA is required (do not skip)

| Trigger | Examples |
|---------|----------|
| Schemes / missions / portals | New launches, nodal ministry changes, target revisions |
| Constitutional / statutory updates | Amendments, new Bills passed, body strength/composition changes |
| Reports / indices / rankings | Latest edition year, publishing body |
| Appointments / offices | CEC, CAG, CJI, Governors, key UP posts when topic owns them |
| Environment / Economy / Science CA topics | Always check last 12–24 months |
| UP-specific polity/admin | New districts, local-body changes, UP schemes |

### How to add CA (Lucent density)

1. Search PIB / official ministry / India Year Book / reputable CA compilations for **this topic only**.
2. Keep only facts that can become a Prelims statement (year, ministry, number, “which is correct”).
3. Place each CA fact in **one home**: short `### Current Affairs` table **or** inside the matching N.X card — **not both**.
4. Put `**Last verified:** [Month Year]` in the topic header when any CA is included.
5. Optionally fold 2–4 CA-based items into Practice Zone (still count toward ≥25).

### Reject

| Reject | Why |
|--------|-----|
| Newspaper narrative paragraphs | Not Lucent |
| CA unrelated to this syllabus topic | Wrong boundary |
| Restating the same scheme card in CA + N.X + Consolidated | One-fact-one-home |

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
| **Per §N.X subtopic** | Prefer **Exam note with year/Q#**; optional **1** highest-yield full PYQ under that Act only if it adds self-test value. Do **not** place ≥2 full PYQs under every Act (that recreates the stack). All mapped PYQs still go to **Complete PYQ Bank** |
| **2025 paper** | Every matching **2025 Q** → taught in matching §N.X **teaching home** + inline PYQ + PYQ Bank **(F5)** |
| **Older UPPCS (2018–2024)** | Every matching Q → inline in best-matching §N.X + PYQ Bank |
| **RO-ARO** | Same as UPPCS — full text, map to §N.X, tag `RO-ARO Prelims YYYY, Q#` |
| **UPSC Prelims** | Add where concept overlaps — **after** all UPPCS/RO-ARO for that subtopic |
| **Pattern PYQs** | Allowed **only** when no UPPCS/RO-ARO/UPSC verbatim exists in `pyq/` — suffix `— pattern` |

### Where to add each PYQ (four placements)

1. **§N.X teaching home** — 1-line callout for high-yield traps: `> **2025 Q144 trap:** …`
2. **`> **Exam note:**` / year tag** — e.g. `UPPCS 2021 Q13 → portfolio = 1861`
3. **`## Complete PYQ Bank`** — every deduplicated UPPCS/RO-ARO from `pyq/` for this topic; answers in `<details>`; group by year (2025 → 2018 → RO-ARO) or chronological
4. **Practice Zone** — original drill questions; do not dump the whole PYQ Bank here

> **Anti-stack rule:** Do not put full PYQ cards under every Act *and* Exam Facts *and* Bank. Teaching bullets + Bank is enough; one inline PYQ only when high-yield.

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
Phase B: LUCENT-STYLE sheet. Act/Event cards. One-fact-one-home. NO repetition. Length may exceed 20 min if chapter needs new locks.
Phase C: R1–R9 + F1–F22; Delivery Report "File ready: YES"

Rules:
1. Map every 00_Syllabus.md bullet → N.X.
2. Prefer tables/chronology/cards over prose.
3. Do NOT use old Topic 1 encyclopedic depth as a model.
4. History/Acts: §History Event Card Protocol only.
5. No "etc." in exam lists.
6. PYQs: full §UPPCS PYQ Search Protocol — every matching UPPCS/RO-ARO full text inline + Complete PYQ Bank (do not trim PYQs for length).
7. External high-yield when matching-heavy (F22).
7b. Current affairs when needed (§Current Affairs Protocol / R9).
8. Practice Zone: **minimum 25** (scale by chapter size); **UPPCS 2024–25 format** (≥60% multi-statement/application; A/R + Match-List + chronology + NOT-matched; ≤25% direct recall); `<details>` answers.
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

**Minimum 25** UPPCS-format questions; scale up per sizing table. **Format = current UPPCS/RO-ARO paper** (see §Format mix): ≥60% multi-statement/application; must include A/R (standard 4 options), Match List-I/II, chronological order, and NOT-correctly-matched; single-fact recall ≤25%. Hidden answers:

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
- [ ] **No repetition** — one-fact-one-home **(R1–R3)** (length may exceed 20 min)
- [ ] No “Complete Source of Truth” framing **(R8)**
- [ ] History/Acts use cards, not novels **(R4)**
- [ ] Current affairs added when needed, or N/A justified **(R9)**

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
- [ ] **≥25** questions **(R5)**; scaled by chapter size
- [ ] **UPPCS 2024–25 format (F8):** ≥60% multi-statement/application; includes A/R, Match-List, chronology, NOT-matched; ≤25% direct recall
- [ ] Answers in `<details>`

### Student test
- [ ] 2-statement decidable from section locks alone
- [ ] Wrong options fail via Exam note / comparison
- [ ] PYQ Bank usable as pure self-test without rereading essays
- [ ] No section only restates another section

---

## Workflow — One Topic at a Time

```
Phase A — PRE-AUDIT
  Syllabus bullets → PYQ inventory → External HY if needed → Boundary → Concept homes → Length plan

Phase B — WRITE
  Revision sheet structure → Act/Event cards → CA if needed → Consolidated (deduped) → Practice ≥25 → Full PYQ Bank

Phase C — POST-AUDIT
  R1–R9 + F-gates → Delivery Report → File ready YES → wait for approval
```

**Do NOT start Topic N+1 until student approves Topic N.**

---

## Gold Standard Structure Diff (Lucent mode)

| Block | Required? |
|-------|-----------|
| Header (Revision Sheet framing + covers syllabus + weight + verified) | **Yes** |
| Quick Revision Box | **Yes** |
| Must-Know Term Comparisons + Hindi | **Yes** if ≥3 confused pairs; else skip |
| Memory Tricks | **Optional** — only PYQ-useful |
| N.X compact teach + Exam note + PYQs | **Yes** |
| Consolidated Reference (deduped) | **Yes** if shared lists remain |
| Current Affairs (if needed) | When R9 triggers; else omit |
| UP Focus | If UP-relevant |
| Practice Zone (**≥25**, scaled) | **Yes** |
| Complete PYQ Bank (full) | **Yes** |
| Mains Framework | Only if high value |
| Common Traps (trap-only) | **Yes** for ★★+ |
| Encyclopedic Definitions/How It Works/Examples stacks | **No** |
| AI-internal maps in student file | **No** |

---

## Example Prompt for Next Topic

```
Restructure subjects/polity/01_Constitutional_Development.md using:
- @subjects/prompt.md (Lucent style; Phase A→B→C)
- @subjects/polity/00_Syllabus.md
- @pyq/ (2018–2025 + RO-ARO)

Convert encyclopedic chapter → Lucent-style notes (no repetition).
Length may exceed 20 min if needed — only with NEW locks.
One-fact-one-home. Act/mission cards + chronology tables.
KEEP full PYQ protocol (every matching Q full text + Complete PYQ Bank).
Add CA only if this topic has recent exam surface (else N/A).
Practice Zone minimum 25 (scale up for large chapter).
Delivery Report with redundancy + PYQ + CA audit; File ready: YES.
Topic 1 only. Wait for approval.
```

---

## Subject-Specific Notes

### Environment & Ecology

Prefer mechanism **locks** (definitions that decide T/F) over essays. UP Focus for forests/Ramsar/pollution cities. Full PYQ protocol. **Practice ≥25**. Run CA for schemes/reports/climate targets.

### Art & Culture

Match tables (dance↔state, temple↔style, author↔work) as primary home. Run F22 for literature streams. UP Focus: Mathura, Varanasi, Lucknow, Sarnath, Agra, UP folk forms. **Practice ≥25**. CA for new GI tags / UNESCO / awards when relevant.

### Ancient / Medieval / Modern India

Use **Event cards + chronology/treaty tables**. Do **not** recreate Carnatic-war novel depth. Multi-war bullets → `N.X.1`… cards under one parent table. **Practice ≥25**.

**Modern India F22:** Topic 10 Books & Authors — never miss Firangiya → Manoranjan Prasad Sinha (RO-ARO) and standard freedom-struggle match titles.

**UP Focus (Modern):** Awadh, Banaras/Chait Singh, Jhansi, 1857 centres (Kanpur, Lucknow, Meerut link).

### Polity

Chronology + comparison tables (Dyarchy vs Autonomy, Adoption vs Enforcement, borrowed features). Constitutional Development = Act/mission cards, **not** per-Act textbooks. Full PYQ protocol remains mandatory. **Practice ≥25**. CA for recent amendments/appointments when topic owns them.

### Geography

One teaching home per fact; avoid Overview + Teach + Exam Facts + Examples echo stacks. Full PYQ protocol. **Practice ≥25**. CA for census/ISFR/scheme updates when relevant.

### Future subjects

1. Create `00_Syllabus.md`
2. Link this `prompt.md`
3. One topic file per syllabus `##`
4. One topic at a time
5. Complete only when R-gates + F-gates pass (PYQ Bank complete; Practice ≥25; no repetition; CA when needed)

---
