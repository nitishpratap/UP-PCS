# UPPCS Study Notes — Master Prompt

Use this file to instruct any AI (or yourself) when creating or restructuring topic notes inside `subjects/`. Every topic file must be a **complete source of truth** — the student should never need to open NCERT, another book, or a different topic file to prepare for that topic's exam questions.

**Exam pattern standard:** `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md` (primary) + all files in `pyq/`  
**Syllabus source:** Each subject folder's `00_Syllabus.md`  
**Gold standard:** `subjects/environments & ecology/01_Environment_Basics.md` — **match this file's depth, not just its headings**

> **For the AI:** You must **self-verify** every topic before presenting it. The student should never need to ask "is this complete?" Run the full workflow in §Mandatory AI Workflow and output the §Delivery Report. If any gate fails, fix the file first — do not ask the student to cross-check.

### One-Line Universal Prompt (copy for any topic)

```
Create/restructure Topic N using @subjects/prompt.md + @00_Syllabus.md + @01_Environment_Basics.md + @pyq/.
Run Phase A→B→C from prompt.md. Self-verify (F1–F15). Output Delivery Report with "File ready: YES".
Match Topic 1 depth. No etc. in lists. One topic only. Wait for approval before next.
```

---

## Goal

Build UPPCS Prelims + Mains notes that maximize **ROI per minute studied**:

- Easy to **raata / revise** (memorize subtopics at a glance)
- Structured for **how UPPCS actually asks questions** — not textbook chapter order
- **Self-contained** per topic — no "see Topic X" deferrals
- **One topic file at a time** — fully complete and student-approved before moving on
- **Syllabus-complete** — every bullet in `00_Syllabus.md` for that topic is covered; nothing extra that isn't exam-relevant
- **Self-verified** — AI runs pre-audit + post-audit; student receives a completed Verification Report, not a draft to inspect

---

## Topic Boundary Rule (critical — stops false "incomplete" and true gaps)

**One topic file = one `##` heading in `00_Syllabus.md`, not one full NCERT book.**

| Rule | Meaning |
|------|---------|
| **In scope** | Only subtopics listed under this topic number in `00_Syllabus.md` + exam-critical expansions (e.g. Topic 25) |
| **Out of scope** | Content belonging to other syllabus topics — teach fully in *that* file, not here |
| **Brief cross-link OK** | 2–3 sentences + Exam note for overlap (e.g. EPA in Topic 1) — never "see Topic 17" |
| **NCERT split** | NCERT Environment chapters span Topics 1–25; extract only the headings that map to *this* topic |

**Before writing:** Build a **Topic Boundary Table** — for each NCERT/PYQ concept, mark IN / OUT / BRIEF MENTION. Reject content that belongs in another topic file unless needed for a UPPCS question on *this* topic.

Example (Topic 1): Liebig + Shelford = IN. Food pyramids = OUT (Topic 3). WPA schedules detail = OUT (Topic 17). Carrying capacity = IN (Topic 1.4).

---

## Mandatory AI Workflow (Do Not Skip — Self-Verifying)

Every topic must go through **Phase A → B → C**. Do not present output until Phase C passes all gates.

### Phase A — Pre-Audit (before writing a single section)

```
1. Read 00_Syllabus.md → copy EVERY bullet for this topic number into a list
2. Read 01_Environment_Basics.md → note section pattern (Definitions, How It Works, Exam Facts, PYQs, Examples)
3. Read NCERT chapters for this topic (see §NCERT map) → list every heading/subheading
4. Search pyq/ (all years) → list every question that maps to this topic
5. Build TOPIC BOUNDARY TABLE (IN / OUT / BRIEF)
6. Build SYLLABUS → N.X MAP (one row per bullet; no bullet unassigned)
7. Build CONCEPT INVENTORY — every exam concept that must appear, with target section:
   - definitions, mechanisms, paired concepts, complete lists, dates, UP examples, 2025 PYQ overlaps
8. Draft Syllabus Coverage Map "What must be inside" column — specific concepts, not vague labels
```

**Stop if:** Any syllabus bullet has no N.X assignment → fix map before writing.

### Phase B — Write (follow gold standard structure)

Write the full file per §Required Document Structure. While writing, enforce §Subtopic Depth Matrix and §Completeness Rules.

### Phase C — Post-Audit (before presenting to student)

Run every item in §Quality Checklist and §Automatic Fail Conditions. Fix all failures. Then append **Syllabus Coverage Checklist** inside the topic file and output **§Delivery Report** to the student.

**Do not say "this file is complete" until Phase C passes.**

---

## Completeness Rules (derived from Topic 1 audit — enforce automatically)

These are the gaps that made Topic 1 *look* incomplete. The AI must check each one:

| # | Rule | Fail example | Pass example |
|---|------|--------------|--------------|
| 1 | **No "etc." or truncated lists** | "14 biomes: rainforest, desert, etc." | Full numbered table of all 14 biomes |
| 2 | **2025 overlap taught in prose** | LiFE only in Practice Zone | LiFE + Agenda 21 in §1.4 prose + CA table |
| 3 | **Traps ↔ Dates sync** | WWD 3 March in traps but missing from Important Dates | Every trapped date in Consolidated Reference |
| 4 | **Paired concepts together** | Liebig without Shelford | Both laws in same subtopic with distinction |
| 5 | **Definitions in every N.X** | 1.3 starts with "Why Classify?" only | Definitions table then How It Works |
| 6 | **Mechanism prose mandatory** | 5 tables, zero paragraphs | 2–4 paragraphs per subtopic before tables |
| 7 | **UP Focus when applicable** | Kanpur pollution omitted in Topic 9 | UP Focus table in Consolidated Reference |
| 8 | **PYQ mined, not invented** | Generic "UPPCS asked this" | Full question text from pyq/ folder |
| 9 | **Practice mirrors 2025 format** | All simple MCQs | ≥40% multi-statement; mix A/R, matching |
| 10 | **Syllabus map = checklist** | Vague "covers basics" | Specific concepts per row |

---

## Subtopic Depth Matrix (minimum per §N.X section)

Every subtopic section must include **all** rows that apply:

| Block | Required? | Minimum |
|-------|-----------|---------|
| `### Definitions` | Yes (if concept has variants) | General + NCERT + Legal/UNEP where applicable |
| `### [Name] — How It Works` | **Always** | 2–4 paragraphs: mechanism, cause→effect, why it matters |
| `> **Exam note:**` | **Always** | ≥1 per subtopic; flag the most-tested trap |
| Supporting tables | If classifying/comparing | Complete lists; max 1–3 tables per concept block |
| `### Exam Facts (raata)` | **Always** | 5–15 bullets |
| `### PYQs — [Subtopic]` | **Always** | 2 UPPCS or 1 UPPCS + 1 UPSC; full text + why |
| `### Examples (N.X)` | **Always** | ≥3 rows; ≥1 UP/India-specific |

**NCERT depth:** For each NCERT subheading mapped IN to this topic, there must be corresponding prose — not just a one-line table row.

**Classification subtopics** must include: all bases, sub-types, India-specific list (if any), legal/administrative class (if any), comparison traps.

**Scheme/policy subtopics** must include: Scheme card (Year | Ministry | Objective | Trap).

---

## NCERT & Syllabus Cross-Verification Protocol

### Step 1 — Map NCERT headings to N.X (mandatory for Environment topics)

| Topic | NCERT sources | Cross-check |
|-------|---------------|-------------|
| 1 | Bio 12 Ch 16 (env basics); Geo 11 Ch 15 | Spheres, components, classification, human interaction |
| 2 | Bio 12 Ch 13–14 | Ecosystem, niche, succession, productivity |
| 3 | Bio 12 Ch 14 | Food chain, web, trophic levels, pyramids |
| 4 | Bio 12 Ch 15 | Biodiversity, loss, conservation, hotspots |
| 5–8 | Bio 12 Ch 15–16; Geo 11 | Flora/fauna, forests, protected areas |
| 9 | Bio 12 Ch 16; Chem 12 (pollution) | Pollution types, waste, standards |
| 10–13 | Geo 11 Ch 14; Bio 12 Ch 16 | Climate, ozone, acid rain, desertification |
| 15–18 | Geo, India Year Book, MoEFCC | SD, laws, treaties, orgs |
| 21 | Bio 12 Ch 15–16 | Wetlands, mangroves, IUCN, red list |
| 22–25 | Geo 11/12, CA sources | Renewables, disasters, current issues, global geo |

### Step 2 — Three-way match (must be 100%)

```
00_Syllabus.md bullet  ↔  N.X section  ↔  NCERT heading (if IN scope)
```

If NCERT has an exam-relevant heading IN scope but syllabus uses a shorter label, still cover it inside the matching N.X.

### Step 3 — Completeness grep (mental scan before delivery)

For each syllabus bullet ask:
- Can a student answer a **2-statement UPPCS 2025 question** from this section alone?
- Can they explain **why the wrong option is wrong**?
- Is there at least **one PYQ or Practice question** touching this bullet?

If any answer is NO → section is incomplete. Expand before delivery.

---

## Automatic Fail Conditions (reject & fix — do not present)

If **any** of these are true, the file is **NOT complete**:

| # | Fail condition |
|---|----------------|
| F1 | Any `00_Syllabus.md` bullet for this topic lacks an N.X section |
| F2 | Any N.X lacks `How It Works` prose (2+ paragraphs) |
| F3 | Any N.X lacks `Exam Facts` + (`PYQs` or Practice question for that subtopic) |
| F4 | Enumerated list uses "etc.", "…", or incomplete rows (biomes, zones, SDGs, Acts) |
| F5 | 2025 paper overlap cited but concept not taught in the matching N.X prose |
| F6 | Common Trap date/number not present in Consolidated Reference |
| F7 | `> **Exam note:**` missing from any N.X |
| F8 | Practice Zone is mostly simple MCQs (<40% multi-statement) |
| F9 | PYQs are summary-table only (no full question text inline) |
| F10 | File says "complete" but Syllabus Coverage Checklist has any ❌ |
| F11 | UP-relevant topic (geo/forest/river/pollution) lacks UP Focus table |
| F12 | 4+ consecutive tables without prose between them |
| F13 | "See Topic X" appears anywhere |
| F14 | Must-Know Term Comparisons missing Hindi column |
| F15 | Fewer than 10 Common Traps (15 for Topics 4, 9, 17, 24) |

---

## Delivery Report (AI must output this with every completed topic)

After Phase C passes, output this table to the student — **no manual cross-check needed**:

```markdown
## Verification Report — Topic N

| Gate | Status | Notes |
|------|--------|-------|
| Syllabus bullets mapped (count) | ✅ N/N | [list any grouped bullets] |
| NCERT headings covered (IN scope) | ✅ | [chapters checked] |
| PYQs mined from pyq/ | ✅ | [UPPCS X, UPSC Y questions] |
| 2025 overlap in prose | ✅ | [Q numbers → sections] |
| Practice Zone count + format mix | ✅ | [N questions; X% multi-statement] |
| UP Focus included | ✅/N/A | |
| Automatic fail conditions (F1–F15) | ✅ 0 failures | |
| Gold standard diff vs Topic 1 structure | ✅ | [same skeleton] |

**Deliberately excluded (other topics):** [list OUT-of-scope concepts]
**File ready for student review:** YES / NO
```

If **File ready = NO**, fix and re-run Phase C. Never ask the student to verify syllabus coverage manually.

---

## The #1 Rule — Explain, Don't Just List

UPPCS does **not** ask "umbrella law for pollution?" as a one-liner. It asks:

| UPPCS 2025 format | What student must know |
|-------------------|------------------------|
| **Multi-statement (1, 2, 3)** | Whether each statement is true/false and *why* |
| **Assertion–Reason (A/R)** | Whether A and R are true + whether R explains A |
| **Which is/are NOT correctly matched** | Spot the one wrong pair in a list |
| **Which is/are correctly matched** | Confirm all pairs — one subtle wrong detail |
| **Match List-I / List-II** | Concept ↔ location / org ↔ report / day ↔ date / SDG ↔ area |
| **Organisation + Report** | Who prepares which report (e.g. CGWB, not CPCB) |
| **NOT located in / Which is NOT** | Negative geography — Ramsar, NP, districts |
| **Events in year X** | Chronology with 3 statements (e.g. 1911, Agenda 21) |
| **Scheme / Programme** | Launch year, nodal ministry, objective, trap year |
| **UP-specific** | District, river, city, scheme, forest %, pollution hotspot |

> **If notes only give tables of facts without explaining mechanisms, cause–effect, and traps — they are incomplete.**

**Bad output (reject this):**
```
| Pollutant | Source |
| PM2.5 | Vehicles |
| BOD | Sewage |
```
→ Student cannot answer a 2-statement UPPCS question from this.

**Good output (required):**
```
### Definitions (learn all — exams pick different ones)
[General | NCERT | Legal table]

PM2.5 are particles ≤2.5 micrometres. They penetrate deepest into lungs because...
BOD measures oxygen consumed when microbes decompose organic waste. Higher BOD means...

> **Exam note:** Statement "BOD measures air pollution" = FALSE trap.

### PYQs
1. **(UPPCS 2018)** ...full question...
   → Answer + 1-line why the wrong options fail
```

---

## Syllabus Mapping Rules (mandatory)

Before writing, **list every subtopic** from `00_Syllabus.md` for that topic number. Map 1:1 to section numbers.

| Syllabus pattern | How to map in file |
|------------------|-------------------|
| Flat list (`* Subtopic`) | `## N.1`, `## N.2`, … in syllabus order |
| Nested heading (`### Species Categories`) | Keep as `## N.15 Species Categories` parent + `### N.15.1 Endemic Species`, etc. **OR** separate `## N.15`–`N.23` if each species type is exam-heavy |
| Two blocks (e.g. Topic 9 Pollution + Waste) | `## 9.1`–`9.10` Pollution, then `## 9.11`–`9.14` Waste — do not merge unlike concepts |
| Single vague subtopic (Topic 25) | Expand into logical exam sections (see Topic-Type Guide below) |

**Coverage rule:** The header line `> **Covers syllabus:**` must list **every** bullet from `00_Syllabus.md` for that topic — verbatim or clearly grouped. After writing, verify: *no syllabus bullet lacks an N.X section; no N.X section lacks Exam Facts + at least 1 PYQ or Practice question.*

**Cross-topic overlap:** Topics repeat concepts (EPA 1986, biotic/abiotic, MoEFCC). Rule:
- Teach the concept **fully** where it is primary (e.g. EPA detail in Topic 17).
- In other topics: 2–3 sentences + `> **Exam note:**` trap — **never** "see Topic 17".
- Put shared Acts/Orgs/Dates **once** in Consolidated Reference; inline sections may repeat only the one line needed for that subtopic's questions.

---

## Topic-Type Guide (adjust depth, not quality)

Not all 25 topics are equal. Match effort to syllabus size and exam weight.

| Topic type | Examples | Extra requirements |
|------------|----------|-------------------|
| **Core concept** | 1, 2, 3, 4 | Full mechanism prose; heavy PYQs; 40–50 Practice questions |
| **Protected area / species** | 5, 6, 7, 21 | **UP Focus** table mandatory; comparison tables (NP vs Sanctuary vs BR vs Tiger Reserve); location matching |
| **Law & governance** | 15, 16, 17, 18 | Mains Framework **mandatory**; year + provision + why enacted + trap per Act/treaty |
| **Pollution / climate** | 9, 10, 11, 12, 13 | Standards (CPCB/WHO), units (BOD mg/L, dB, pH), cause→effect chains |
| **Current affairs** | 24 | **Last verified: [Month Year]** in header; govt sources (PIB, MoEFCC, Budget); schemes with launch year + nodal ministry; refresh every 6 months |
| **Sparse syllabus** | 25 Global Environmental Geography | Split into: Major biomes, Climate zones & environment, Global pollution hotspots, International env geography links — still full prose + 25+ Practice questions |
| **Renewable / disaster** | 22, 23 | India capacity, UP projects where relevant, disaster–environment cause chain |

### Practice Zone sizing (scale by subtopic count)

| Subtopics in topic | Practice questions |
|--------------------|-------------------|
| ≤5 | 25–30 |
| 6–12 | 30–40 |
| 13+ | 40–50 |
| Topic 24 (CA) | 40–50 (≥50% from last 2 years' PYQ patterns) |

Exam weight still overrides: Topic 12 (4 subtopics) stays ★★ with strong traps; Topic 4 (22 subtopics) needs maximum depth.

---

## UP-Specific Content (mandatory where applicable)

UPPCS disproportionately tests **Uttar Pradesh**. Every topic file that touches geography, forests, wildlife, rivers, pollution, or schemes must include:

### UP Focus — [Topic Name] (subsection inside Consolidated Reference or after Quick Revision)

Minimum when applicable:

| Element | Examples |
|---------|----------|
| **Districts** | Bahraich, Chandauli, Shravasti (forest %); Pilibhit, Dudhwa |
| **Rivers** | Ganga, Yamuna, Gomti (Lucknow), Ghaghara, Betwa, Ken |
| **Cities** | Kanpur (air), Varanasi, Agra, Lucknow, Ghaziabad, Noida |
| **Protected areas** | UP Ramsar sites, NP, sanctuaries — which are NOT in UP (negative questions) |
| **Forests** | ISFR district data, Terai, Vindhyan, Bundelkhand |
| **Schemes in UP** | Namami Gange stretches, NCAP cities in UP, bio-decomposer (NCR overlap) |
| **Movements** | Chipko (Uttarakhand, erstwhile UP), Ganga pollution campaigns |

> **2025 reminders:** Q8 Bahraich/Chandauli/Shravasti forest %; Q59 Ramsar NOT in UP; Q123 Appiko (Karnataka, not UP).

---

## PYQ Mining Rules

Do **not** rely only on inline memory. For each topic:

1. Search `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md` for `Subject: Environment` and related subjects (Geography, Current Affairs, Polity) that map to this topic.
2. Search `pyq/2024/` and any other year folders.
3. Include **UPPCS Prelims** first; add **UPSC Prelims** where concept overlaps.
4. Minimum PYQs per subtopic: **2 UPPCS** if available, else **1 UPPCS + 1 UPSC**.
5. Tag every inline PYQ with exam + year; add to Complete PYQ Bank at end.

**Map PYQ subjects loosely to syllabus topics** — e.g. "Forestry / ISFR 2023" → Topic 8; "Lichens" → Topic 4 or 21; "LiFE" → Topic 24 or 15.

---

## When Restructuring a Topic File

Copy-paste this block as your instruction:

```
Restructure @[topic_file].md using @subjects/prompt.md, @00_Syllabus.md, @01_Environment_Basics.md, and @pyq/ (all years).

MANDATORY WORKFLOW (from prompt.md — do not skip):
Phase A: Pre-audit → syllabus list, NCERT map, PYQ list, boundary table, concept inventory
Phase B: Write full file matching Topic 1 depth
Phase C: Post-audit → run F1–F15 fail conditions + Quality Checklist; fix all gaps

Rules:
1. List every subtopic from 00_Syllabus.md — map each to N.X (no skips).
2. Match EXPLANATION DEPTH of 01_Environment_Basics.md — prose + tables, not table-only.
3. Every N.X needs: Definitions (if applicable) + How It Works (2–4 para) + Exam note + Exam Facts + PYQs + Examples.
4. No "etc." — all enumerated lists must be complete (biomes, zones, categories).
5. Every 2025 paper overlap concept must appear in N.X prose, not only Practice Zone.
6. PYQs: mine pyq/ folder; full question text + answer + why.
7. Practice Zone: scaled count (25–50); UPPCS 2025 format mix (≥40% multi-statement); answers in `<details>` blocks.
8. Hindi terms in Must-Know Term Comparisons.
9. UP Focus table if topic touches UP geography/forests/wildlife/rivers/pollution.
10. Syllabus Coverage Map at top + Syllabus Coverage Checklist at end (all ✅).
11. Work on ONE topic only. Do not touch other files.
12. Output Delivery Report (from prompt.md) showing 0 fail conditions.
13. Stop and wait for my approval before starting the next topic.

Do NOT present until Verification Report shows "File ready: YES".
```

---

## File Naming Convention

| File | Purpose |
|------|---------|
| `00_Syllabus.md` | Master syllabus — subtopics list only, do not delete |
| `01_[Topic_Name].md` | Topic 1 notes |
| `02_[Topic_Name].md` | Topic 2 notes |
| … | One file per syllabus topic (Environment = 25 files) |
| `prompt.md` | This file — formatting rules |

**Folder structure:** `subjects/[subject name]/[numbered files]`

Example: `subjects/environments & ecology/01_Environment_Basics.md`

**Subject complete when:** All topics in `00_Syllabus.md` have a numbered file passing the Quality Checklist below.

---

## Required Document Structure (in this exact order)

Every topic file MUST follow this skeleton:

```markdown
# Topic N — [Topic Title]
### ★ Complete Source of Truth — No other book/notes needed for this topic

> **Covers syllabus:** [every bullet from 00_Syllabus.md — grouped but complete]
> **Sources baked in:** [NCERT chapters, MoEFCC, CPCB, official reports, PYQs]
> **Exam weight:** ★★★ / ★★ / ★
> **Last verified:** [Month Year] ← mandatory for Topic 24 and CA-heavy sections

### Syllabus Coverage Map (mandatory)

Map **every** `00_Syllabus.md` bullet. The third column must list **specific concepts** — not vague labels like "covers basics".

| Syllabus subtopic | Section | What must be inside |
|-------------------|---------|---------------------|
| [bullet] | §N.X | [concrete concepts: laws, lists, mechanisms, UP examples] |

**End the file with:**

```markdown
## Syllabus Coverage Checklist (Topic N)

| # | Syllabus subtopic | Section | Definitions | Prose | Exam note | PYQs | Examples |
|---|-------------------|---------|-------------|-------|-----------|------|----------|
| 1 | … | N.1 | ✅ | ✅ | ✅ | ✅ | ✅ |

**Also included:** UP Focus | Consolidated Reference | [N] Practice Qs | PYQ Bank | Mains | [N]+ Traps
```

Every cell must be ✅ before marking complete.

---

## How to Use This File
[Table: First reading | Second reading | Daily revision | Before exam | Mains prep]

---

## How UPPCS Tests This Topic
[Map concepts to UPPCS 2025 question styles + real PYQ examples]

> **2025 paper overlap:** [List Q numbers from 2025 paper that this topic answers]

---

## Quick Revision Box — Raata This First
[Code block — scannable in 5 min AFTER first full read]

### Must-Know Term Comparisons
[Table: Term | One-line difference | Hindi ]

### Memory Tricks
[Table: Trick | Remembers]

---

## N.1 [Subtopic Name]
[... full subtopic structure — repeat for ALL syllabus bullets ...]

---

## Consolidated Reference — Everything in One Place
[Acts, Constitution, Orgs, Dates, Schemes, Reports, UP Focus — ONCE ONLY]

---

## Practice Zone — UPPCS Format Questions
[25–50 questions — scaled per topic size; **answers hidden in `<details>` until clicked**]

---

## Complete PYQ Bank (Topic N)
[Master index — every inline PYQ listed]

---

## Mains Answer Framework
[Mandatory for Topics 6, 7, 8, 9, 15, 17, 18, 23, 24; optional elsewhere if thin]

---

## Exam Intelligence — What to Expect
### UPPCS Prelims Priority
### UPPCS vs UPSC
### Common Traps — Don't Fall For These (minimum 10; 15+ for large topics)

---

*End of Topic N — [Title]. This file is complete.*
```

---

## Content Rules

### DO

| Rule | Why |
|------|-----|
| **Write like Topic 1** | Prose + tables together; definitions from multiple sources |
| **Explain mechanisms** | UPPCS tests understanding via 2-statement questions |
| **"How It Works" prose** | Student must know *why* warm water reduces DO, not just that it does |
| **> Exam note:** callouts | Flag traps directly where concept is taught |
| **Numbered PYQs with explanation** | Full question → answer → why wrong options fail |
| **UPPCS 2025 Practice Zone format** | Statements, A/R, matching — not simple one-liners only |
| **Collapsible Practice Zone answers** | Wrap every `**Ans:**` in `<details><summary>Show answer</summary>` — hidden until clicked |
| **Hindi terms** | Third column in term comparisons; key trap words in Hindi |
| **Indian/UP examples** | Kanpur, Ballia, Ghaziabad, Gomti-Lucknow, Dudhwa, etc. |
| **One consolidated reference** | Acts/Orgs repeated 14× = student skips reading |
| **Bold dates, numbers, names** | Scannable for raata |
| **Comparison tables** | NP vs Sanctuary vs BR; in-situ vs ex-situ; GHG sources; lentic vs lotic |
| **Scheme cards** | Name \| Year \| Ministry \| Objective \| Trap (wrong year/ministry) |
| **Units & standards** | BOD, PM2.5, dB, pH, CO₂ ppm — where topic is science-based |

### DO NOT

| Anti-pattern | Why it fails |
|--------------|--------------|
| **Table soup** — 5+ consecutive tables, zero prose | Cannot answer UPPCS statement questions |
| **PYQ summary tables only** (`\| UPPCS 2018 \| answer \|`) | Disconnected from exam question wording |
| **Simple MCQs only** (`Q1. Umbrella law? (a)(b)(c)(d)`) | UPPCS 2025 uses multi-statement + A/R |
| **Visible Practice Zone answers** | Spoils self-test — answers must be inside `<details>` blocks |
| **Facts without cause–effect** | A/R questions need logical chains |
| **"See Topic X"** | Breaks self-contained rule |
| **Skip subtopics** | Incomplete source of truth |
| **Batch multiple topics** | Quality drops — one topic at a time |
| **Outdated CA without date** | Student memorizes withdrawn schemes |
| **Wikipedia-only facts** | Prefer NCERT, MoEFCC, official reports |
| **"etc." / incomplete lists** | 14 biomes, 10 zones, SDGs must be full tables |
| **2025 overlap only in Practice Zone** | Must be in N.X prose where cited |
| **Marking "complete" without Phase C** | Delivery Report must show 0 fail conditions |

### Content Balance (per subtopic section)

| Element | Minimum | Purpose |
|---------|---------|---------|
| **Definitions table** | 1 (if concept has legal/NCERT variants) | UPPCS picks different wordings |
| **Prose paragraphs** | 2–4 short paragraphs | Mechanism, cause–effect, context |
| **Supporting tables** | 1–3 max | Classify/compare — not standalone |
| **Exam note callouts** | 1–2 | Trap flags inline |
| **Numbered PYQs** | 2 UPPCS or 1 UPPCS + 1 UPSC | Full text + explanation |
| **Indian examples** | 3+ rows | UP-specific where possible |

### Mandatory comparison tables (include when topic covers these)

| Comparison | Topics |
|------------|--------|
| NP vs Wildlife Sanctuary vs Biosphere Reserve vs Tiger Reserve | 6, 7 |
| In-situ vs Ex-situ conservation | 4, 20 |
| IUCN Red List categories | 4, 21 |
| Lentic vs Lotic vs Wetland vs Estuary | 1, 2, 21 |
| Water Act vs Air Act vs EPA vs WPA | 17 |
| Kyoto vs Paris vs Montreal vs Rio | 10, 11, 18 |
| Carbon credit vs carbon trading vs offset | 24 |

---

## How UPPCS Tests This Topic (mandatory section)

After "How to Use", map **this topic** to UPPCS 2025 patterns. Reference real questions from `UP_PCS_Pre_2025_GS_Paper_1.md`.

**Template:**

```markdown
## How UPPCS Tests This Topic

| UPPCS asks… | From this topic | Example trap |
|-------------|-----------------|--------------|
| 2-statement correct? | [concept] | Statement 1 true, Statement 2 false because… |
| A/R | [cause → effect] | A true, R false (wrong year/org) |
| NOT correctly matched | [pairs] | One wrong date/org/location |
| NOT located in UP | [Ramsar/NP/district] | Rudrasagar ≠ UP |
| Org + Report | [who publishes] | CGWB not CPCB for groundwater |
| UP-specific | [river/city/district] | Gomti→Lucknow, not Kanpur |

> **2025 paper overlap:** [e.g. Q23 carrying capacity, Q62 env days — cite Q numbers]
```

---

## Section-by-Section Guide

### 1. Quick Revision Box

- Fenced code block — readable in **5–10 minutes**
- For **revision after first read** — not a substitute for explanations
- Max ~60 lines for large topics; split by subtopic blocks
- Include UP-specific one-liners where relevant

### 2. Subtopic Sections (N.1, N.2, …) — THE MAIN CONTENT

**Mandatory structure per subtopic:**

```markdown
## N.X [Subtopic]

### Definitions (learn all — exams pick different ones)
| Source | Definition |
| General | … |
| NCERT | … ← Most asked in UPPCS |
| Legal/UNEP | … |

### [Topic] — How It Works
[2–4 paragraphs explaining mechanism, process, cause–effect]

> **Exam note:** [Trap or most-asked fact]

[Optional supporting table — max 1–2 per concept block]

### Exam Facts (raata)
- **Term** — detail

### PYQs — [Subtopic]
**UPPCS Prelims**
1. **(UPPCS 20XX)** [full question]
   → answer + why

**UPSC Prelims**
2. **(UPSC 20XX)** [full question]
   → answer + why

### Examples (N.X)
| Example | What it teaches |
```

**Copy the voice of `01_Environment_Basics.md` sections 1.1–1.4:**
- "Why Classify?" style headings
- Liebig's Law style — rule + examples in prose
- Lentic/Lotic with memory trick in prose, not table-only

### 3. Consolidated Reference

Shared content **once**: Constitution, Acts, Orgs, Committees, Dates, Schemes, Reports, CA, **UP Focus**.

Each Act entry: **Year + Key provision + Why enacted + Trap**

Each scheme entry: **Launch year + Nodal ministry + One-line objective + Common trap**

### 4. Practice Zone — UPPCS 2025 Format (mandatory mix)

**Minimum distribution per topic:**

| Format | Share | Template |
|--------|-------|----------|
| **Multi-statement (1, 2, 3)** | ≥40% | "With reference to X, which is/are correct? 1. … 2. …" |
| **Assertion–Reason** | ≥15% | "Assertion (A): … Reason (R): …" |
| **Match List-I / II** | ≥15% | 4 pairs |
| **NOT correctly matched** | ≥10% | "Which pairs is/are NOT correctly matched?" |
| **Correctly matched** | ≥5% | Positive matching — all pairs right except subtle error |
| **NOT located in / negative list** | ≥5% | Geography negative (esp. UP) |
| **Chronology / events in year** | ≥5% | "Which events in 1992?" |
| **Org + Report (3 options)** | ≥5% | "Prepared by: CPCB / CWC / CGWB" |
| **Simple direct** | ≤10% | Pure factual recall only |

**Every Practice Zone question must include:**
- Full question text (UPPCS 2025 style — "Select the correct answer from the code given below")
- Options: A / B / C / D
- **Ans:** with 1–2 line explanation including **why wrong options fail** — **hidden inside a collapsible block** (see below)

**Collapsible answers (mandatory):** Practice Zone is for self-testing. Answers must not be visible on first read. Wrap every answer in HTML `<details>` / `<summary>` — works in Cursor, VS Code, and GitHub Markdown preview.

Add this line once under the Practice Zone header:
`> **Answers hidden** — click *Show answer* under each question to reveal.`

**Example (required style):**

```markdown
**Q1.** With reference to 'National Clean Air Programme (NCAP)', which of the following statements is/are correct?

1. It was launched in 2019 targeting 122 non-attainment cities.
2. It aims to reduce PM concentration by 20–30% by 2024.

Select the correct answer from the code given below:

Options:
A. Only 1  B. Only 2  C. Both 1 and 2  D. Neither 1 nor 2

<details>
<summary>Show answer</summary>

**Ans: C** — Both correct. Trap: confusing 2019 with 2016 (NAQI year).

</details>
```

> **Do not** use `<details>` for inline PYQs in N.X sections — only Practice Zone answers are hidden. PYQ sections stay visible for revision.

### 5. Complete PYQ Bank

Master index at end. Inline PYQs use **numbered full text**; bank summarizes:

| # | Exam | Yr | Subtopic | Question summary | Answer |

### 6. Mains Answer Framework

**Mandatory** for Topics **6, 7, 8, 9, 15, 17, 18, 23, 24**.

Each framework: **Question title → Structure (word count) → 5–7 bullet points → Indian/UP example to cite**

### 7. Exam Intelligence

- Priority table (★★★ / ★★ / ★) per subtopic
- UPPCS vs UPSC pattern comparison
- Common Traps — minimum **10** (15+ for Topics 4, 9, 17, 24)

---

## Quality Checklist (Phase C — before marking a topic "complete")

> This checklist is run **by the AI automatically**. Every item must pass; map failures to §Automatic Fail Conditions (F1–F15).

### Syllabus coverage
- [ ] Every `00_Syllabus.md` bullet for this topic has a dedicated N.X (or N.X.Y) section **(F1)**
- [ ] Header `Covers syllabus` lists all bullets — none missing
- [ ] Syllabus Coverage Map "What must be inside" lists **specific concepts**, not vague labels
- [ ] No orphan sections (content not in syllabus unless Topic 25-type expansion)
- [ ] Topic Boundary Table built — OUT-of-scope concepts listed in Delivery Report

### Content depth
- [ ] Every subtopic has **Definitions** table (where applicable) **(F7)**
- [ ] Every subtopic has **2+ prose paragraphs** in How It Works **(F2)**
- [ ] Every subtopic has **≥1 Exam note** callout **(F7)**
- [ ] No section has **4+ consecutive tables** without prose **(F12)**
- [ ] No "etc." or incomplete enumerated lists **(F4)**
- [ ] Mandatory comparison tables included (if topic covers those concepts)
- [ ] 2025 overlap concepts taught in matching N.X prose **(F5)**
- [ ] Common Trap items synced to Consolidated Reference **(F6)**

### Exam alignment
- [ ] "How UPPCS Tests This Topic" + **2025 paper overlap** with Q numbers
- [ ] Practice Zone ≥40% multi-statement **(F8)**
- [ ] Practice Zone answers wrapped in `<details><summary>Show answer</summary>` (hidden until click)
- [ ] Practice count matches topic size (25–50)
- [ ] PYQs mined from `pyq/` — full text + explanation **(F9)**
- [ ] Hindi column in Must-Know Term Comparisons **(F14)**

### UP & completeness
- [ ] **Syllabus Coverage Map** at top + **Syllabus Coverage Checklist** at end (all ✅) **(F10)**
- [ ] UP Focus table present if applicable **(F11)**
- [ ] Consolidated Reference (Acts/Orgs/Dates/Schemes/CA) present once
- [ ] Mains Framework present (if mandatory topic)
- [ ] Common Traps ≥10 (15+ for Topics 4, 9, 17, 24) **(F15)**
- [ ] `Last verified` date in header (Topic 24 and CA sections)
- [ ] No "See Topic X" anywhere **(F13)**
- [ ] **Delivery Report** output with "File ready: YES"
- [ ] File ends with "This file is complete."

### Student test (AI self-tests before delivery)
- [ ] Each syllabus bullet: student can answer a 2-statement UPPCS question from that section alone
- [ ] Each Practice Zone wrong option: explanation says why it fails
- [ ] Student does not need NCERT or another topic file for this topic's questions

---

## Workflow — One Topic at a Time (strict)

```
Phase A — PRE-AUDIT (before writing)
  Step 1: Read 00_Syllabus.md → list ALL bullets for THIS topic
  Step 2: Read 01_Environment_Basics.md → gold standard structure
  Step 3: Read NCERT chapters for this topic → heading list
  Step 4: Search pyq/ (all years) → PYQ list for this topic
  Step 5: Build Topic Boundary Table (IN / OUT / BRIEF)
  Step 6: Build Syllabus → N.X map + Concept Inventory
  Step 7: Draft Syllabus Coverage Map with specific "What must be inside"

Phase B — WRITE
  Step 8: Read existing NN_[Topic].md → preserve good content
  Step 9: Write/restructure ONE topic — all N.X sections, Consolidated Ref, Practice, etc.

Phase C — POST-AUDIT (before presenting)
  Step 10: Run Automatic Fail Conditions F1–F15
  Step 11: Run Quality Checklist — fix every failure
  Step 12: Append Syllabus Coverage Checklist (all ✅) inside file
  Step 13: Output Delivery Report → must show "File ready: YES"
  Step 14: Present to student → wait for approval before Topic N+1
```

**Do NOT start Topic N+1 until student approves Topic N.**  
**Do NOT ask student to cross-verify syllabus — that is Phase C's job.**

---

## Gold Standard Structure Diff (compare every topic to Topic 1)

Before delivery, confirm the topic file has **every** structural block Topic 1 has (scaled to topic size):

| Block | Topic 1 has it? | Required for all topics? |
|-------|-----------------|--------------------------|
| Syllabus Coverage Map (specific concepts) | ✅ | **Yes** |
| How to Use This File | ✅ | **Yes** |
| How UPPCS Tests This Topic + 2025 overlap | ✅ | **Yes** |
| Quick Revision Box (code block) | ✅ | **Yes** |
| Must-Know Term Comparisons + Hindi | ✅ | **Yes** |
| Memory Tricks | ✅ | **Yes** |
| N.X: Definitions + How It Works + Exam note + Exam Facts + PYQs + Examples | ✅ | **Yes, per subtopic** |
| Consolidated Reference (once) | ✅ | **Yes** |
| UP Focus | ✅ | If UP-relevant |
| Practice Zone (25–50, format mix) | ✅ | **Yes** |
| Complete PYQ Bank | ✅ | **Yes** |
| Mains Answer Framework | ✅ | Topics 6–9, 15, 17–18, 23–24 |
| Exam Intelligence + Common Traps | ✅ | **Yes** |
| Syllabus Coverage Checklist | ✅ | **Yes** |
| "This file is complete." | ✅ | **Yes** |

---

## Example Prompt for Next Topic

```
Restructure environments & ecology/02_Ecology_and_Ecosystem.md using:
- @subjects/prompt.md (run Phase A → B → C; output Delivery Report)
- @00_Syllabus.md (all 16 subtopics — map each to 2.X)
- @01_Environment_Basics.md (gold standard depth — NOT table-only)
- @pyq/ (all years)

Self-verify per prompt.md — I should NOT need to cross-check completeness.
Phase A: boundary table + concept inventory before writing.
Phase C: F1–F15 pass + Syllabus Coverage Checklist all ✅ + Delivery Report "File ready: YES".
No "etc." in any list. 2025 overlap in prose. UP Focus if applicable.
Practice Zone: 40+ questions, UPPCS 2025 format.
Work on Topic 2 only. Wait for my approval before Topic 3.
```

---

## Subject-Specific Notes

### Environment & Ecology (25 topics)

| Topic | File | Subtopics | Status | Notes |
|-------|------|-----------|--------|-------|
| 1 | `01_Environment_Basics.md` | 4 | ✅ Complete (July 2026 audit) | Syllabus map + UP Focus + full biomes |
| 2 | `02_Ecology_and_Ecosystem.md` | 16 | Restructure | Largest concept topic |
| 3 | `03_Food_Chain_and_Energy_Flow.md` | 5 | Restructure | 10% rule, pyramids — high PYQ |
| 4 | `04_Biodiversity.md` | 22 | Restructure | Species categories need N.15+ |
| 5 | `05_Habitat_Flora_and_Fauna.md` | 3 | Restructure | UP flora/fauna |
| 6 | `06_Protected_Areas_and_Conservation.md` | 11 | Restructure | UP Ramsar, NP matching |
| 7 | `07_Wildlife_Conservation.md` | 9 | Restructure | Projects + UP species |
| 8 | `08_Forests_and_Forest_Management.md` | 8 | Restructure | ISFR, UP districts |
| 9 | `09_Pollution_and_Waste_Management.md` | 14 | Needs rewrite | Standards, BOD, UP cities |
| 10 | `10_Climate_Change.md` | 9 | Restructure | GHG, Paris, India targets |
| 11 | `11_Ozone_Layer.md` | 4 | Restructure | Montreal, CFC traps |
| 12 | `12_Acid_Rain.md` | 4 | Restructure | Smaller but frequent |
| 13 | `13_Desertification_and_Land_Degradation.md` | 3 | Restructure | UNCCD, India |
| 14 | `14_Environmental_Impact_Assessment.md` | 2 | Restructure | EIA 2020 notification traps |
| 15 | `15_Sustainable_Development_and_Environmental_Governance.md` | 12 | Restructure | SDG matching, Brundtland |
| 16 | `16_Environmental_Organizations_India.md` | 8 | Restructure | Org ↔ report ↔ HQ |
| 17 | `17_Environmental_Laws_and_Policies.md` | 11 | Mains-heavy | All Acts with traps |
| 18 | `18_International_Environmental_Agreements_and_Conferences.md` | 17 | Restructure | Treaty ↔ year ↔ HQ |
| 19 | `19_Climate_and_Environmental_Institutions.md` | 6 | Restructure | IPCC, UNEP, GEF |
| 20 | `20_Biodiversity_Conservation_Methods.md` | 6 | Restructure | Gene/seed banks |
| 21 | `21_Species_and_Ecology.md` | 7 | Restructure | Lichens, mangroves, IUCN |
| 22 | `22_Renewable_Energy.md` | 7 | Restructure | India capacity, green H2 |
| 23 | `23_Disaster_and_Environment.md` | 6 | Restructure | UP floods, heat waves |
| 24 | `24_Current_Environmental_Issues.md` | 7 | CA-heavy | LiFE, carbon markets — verify dates |
| 25 | `25_Global_Environmental_Geography.md` | 1 | Expand logically | Biomes, zones, global hotspots |

### NCERT chapter hints (Environment & Ecology)

| Topics | Primary NCERT |
|--------|---------------|
| 1–3 | Class 12 Biology Ch 13–14; Class 11 Geography Ch 15 |
| 4, 20, 21 | Class 12 Biology Ch 15–16 |
| 9 | Class 12 Chemistry (pollution); Biology Ch 16 |
| 10–13 | Class 11 Geography Ch 14; Class 12 Biology Ch 16 |
| 15–18 | Supplement with MoEFCC, India Year Book, official treaty texts |

### Future subjects

1. Create `00_Syllabus.md` with every exam subtopic as bullets
2. Link to this `prompt.md`
3. One topic file per `##` heading in syllabus
4. One topic at a time; student approval between topics
5. Mark subject complete only when all topic files pass Quality Checklist

---
