# UPPCS Study Notes — Master Prompt

Use this file to instruct any AI (or yourself) when creating or restructuring topic notes inside `subjects/`. Every topic file must be a **complete source of truth** — the student should never need to open NCERT, another book, or a different topic file to prepare for that topic's exam questions.

**Exam pattern standard:** `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md` (primary) + all files in `pyq/`  
**Syllabus source:** Each subject folder's `00_Syllabus.md`  
**Gold standard (structure + depth):** `subjects/environments & ecology/01_Environment_Basics.md` — **match this file's depth, not just its headings**  
**Per-subject gold standard:** Once a subject's Topic 1 is student-approved, that file becomes the gold standard for *that* subject (e.g. `subjects/art and culture/01_Institutions_Related_to_Indian_Culture.md`)

> **For the AI:** You must **self-verify** every topic before presenting it. The student should never need to ask "is this complete?" Run the full workflow in §Mandatory AI Workflow and output the §Delivery Report. If any gate fails, fix the file first — do not ask the student to cross-check.

### One-Line Universal Prompt (copy for any topic)

```
Create/restructure Topic N in @subjects/[subject]/ using @subjects/prompt.md + @00_Syllabus.md + subject Topic 1 gold standard + @pyq/.
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

Run every item in §Quality Checklist and §Automatic Fail Conditions. Fix all failures. Output **§Delivery Report** to the student (in chat only — do not put audit tables in the topic file).

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
| 6 | **Mechanism content mandatory (point-wise)** | 5 tables, zero explanation | Point-wise bullets per subtopic (≥8 substantive points) before tables |
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
| `### [Name] — How It Works` | **Always** | **Point-wise bullets** (not paragraph blocks): ≥8 substantive points covering mechanism, cause→effect, why it matters |
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

### Step 1 — Map NCERT headings to N.X (mandatory for Environment & Art & Culture topics)

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
| F2 | Any N.X lacks `How It Works` point-wise bullets (≥8 substantive points) |
| F3 | Any N.X lacks `Exam Facts` + (`PYQs` or Practice question for that subtopic) |
| F4 | Enumerated list uses "etc.", "…", or incomplete rows (biomes, zones, SDGs, Acts) |
| F5 | 2025 paper overlap cited but concept not taught in the matching N.X prose |
| F6 | Common Trap date/number not present in Consolidated Reference |
| F7 | `> **Exam note:**` missing from any N.X |
| F8 | Practice Zone is mostly simple MCQs (<40% multi-statement) |
| F9 | PYQs or PYQ Bank use summary-table only (no full question text); PYQ Bank answers visible without `<details>` |
| F10 | Internal syllabus audit fails — any bullet lacks N.X section or required blocks |
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

**Good output (required — point-wise, not paragraph blocks):**
```
### Definitions (learn all — exams pick different ones)
[General | NCERT | Legal table]

### [Topic] — How It Works

- **PM2.5** are particles ≤2.5 micrometres — penetrate deepest into lungs because of small size.
- **BOD** measures oxygen consumed when microbes decompose organic waste; higher BOD = more pollution.
- Cause → effect chain in bullets, not one dense paragraph.

> **Exam note:** Statement "BOD measures air pollution" = FALSE trap.

### PYQs
1. **(UPPCS 2018)** ...full question...
   → Answer + 1-line why the wrong options fail
```

**Bad output (reject — dense paragraph blocks):**
```
**Population ecology** tracks how single-species populations change over time. Key parameters: **birth rate, death rate, immigration, emigration, age structure, sex ratio**. Populations grow exponentially (J-curve) when resources are unlimited — rare in nature. Real populations follow **logistic growth** (S-curve), levelling off at **carrying capacity (K)** where birth rate equals death rate.
```
→ Same facts must appear as **scannable bullets** — one idea per point; bold only key terms; no material loss.

---

## Point-wise Format Rule (mandatory for all "How It Works" sections)

**Do NOT write dense paragraph blocks** where multiple facts run together in one paragraph (even with bold terms). Break every mechanism into **scannable bullets** — one idea per point.

| Rule | Requirement |
|------|-------------|
| **Format** | Markdown bullets (`-`) under `### [Name] — How It Works` |
| **Density** | ≥8 substantive points per subtopic (mechanism, cause→effect, trap, example) |
| **Bold** | Only exam-critical terms (names, numbers, laws) — not every word |
| **No material loss** | Convert paragraph content to bullets; do not shorten facts to fit format |
| **Nested bullets** | OK for sub-types (grazing vs detritus chain); not for hiding paragraphs |
| **Tables** | Still follow bullets — max 1–3 tables after point-wise explanation |

**Reject:** Single 150-word paragraph with 6 bold terms.  
**Accept:** 10 bullets, each 1–2 lines, same facts, easier to raata.

---

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

1. Search `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md` for the topic's primary subject tag (`Environment`, `Art & Culture`, `History`, `Geography`, etc.) and related subjects (Current Affairs, Polity) that map to this topic.
2. Search `pyq/2024/` and any other year folders.
3. Include **UPPCS Prelims** first; add **UPSC Prelims** where concept overlaps.
4. Minimum PYQs per subtopic: **2 UPPCS** if available, else **1 UPPCS + 1 UPSC**.
5. Tag every inline PYQ with exam + year; add **full question text** to Complete PYQ Bank at end (answer hidden in `<details>`).

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
3. Every N.X needs: Definitions (if applicable) + How It Works (**point-wise bullets**, ≥8 points) + Exam note + Exam Facts + PYQs + Examples.
4. No "etc." — all enumerated lists must be complete (biomes, zones, categories).
5. Every 2025 paper overlap concept must appear in N.X prose, not only Practice Zone.
6. PYQs: mine pyq/ folder; full question text inline + Complete PYQ Bank self-test cards (exam+year in header, answers in `<details>`).
7. Practice Zone: scaled count (25–50); UPPCS 2025 format mix (≥40% multi-statement); answers in `<details>` blocks.
8. Hindi terms in Must-Know Term Comparisons.
9. UP Focus table if topic touches UP geography/forests/wildlife/rivers/pollution.
10. Internal Phase A syllabus map complete (do NOT put Syllabus Coverage Map/Checklist in the student file).
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
| … | One file per syllabus topic (Environment = 25 files; Art & Culture = 16 files) |
| `prompt.md` | This file — formatting rules |

**Folder structure:** `subjects/[subject name]/[numbered files]`

Examples: `subjects/environments & ecology/01_Environment_Basics.md` · `subjects/art and culture/01_Institutions_Related_to_Indian_Culture.md`

**Subject complete when:** All topics in `00_Syllabus.md` have a numbered file passing the Quality Checklist below.

---

## Required Document Structure (student-facing — in this exact order)

Topic files are **study notes only**. Do **not** include AI workflow artifacts (Syllabus Coverage Map, How to Use, How UPPCS Tests, Syllabus Coverage Checklist, "This file is complete" footer, Exam Intelligence priority tables). Build those internally in Phase A/C; put audit results only in the **Delivery Report** (chat).

Every topic file MUST follow this skeleton:

```markdown
# Topic N — [Topic Title]
### ★ Complete Source of Truth — No other book/notes needed for this topic

> **Covers syllabus:** [every bullet from 00_Syllabus.md — grouped but complete]
> **Sources baked in:** [NCERT chapters, official sources, PYQs]
> **Exam weight:** ★★★ / ★★ / ★
> **Last verified:** [Month Year] ← mandatory for Topic 24 and CA-heavy sections

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
[Self-test cards — full question text, exam+year in header, answers in `<details>` toggles]

---

## Mains Answer Framework
[Mandatory for Topics 6, 7, 8, 9, 15, 17, 18, 23, 24; optional elsewhere if thin]

---

## Common Traps — Don't Fall For These
[Minimum 10; 15+ for Topics 4, 9, 17, 24]
```

### AI-internal only (Phase A/C — never write into topic file)

| Block | Used for |
|-------|----------|
| Syllabus Coverage Map | Phase A — verify every bullet mapped before writing |
| Syllabus Coverage Checklist | Phase C — verify every cell ✅ before delivery |
| How to Use This File | Optional in Delivery Report only |
| How UPPCS Tests This Topic | Delivery Report + weave traps into N.X `Exam note` |
| Exam Intelligence priority / UPPCS vs UPSC tables | Delivery Report only — student gets **Common Traps** instead |
| "End of Topic N — complete" footer | Do not add |

---

## Content Rules

### DO

| Rule | Why |
|------|-----|
| **Write like Topic 1** | Point-wise bullets + tables together; definitions from multiple sources |
| **Explain mechanisms** | UPPCS tests understanding via 2-statement questions — use cause→effect bullet chains |
| **"How It Works" point-wise bullets** | Student must know *why* warm water reduces DO — one mechanism per bullet, not paragraph soup |
| **> Exam note:** callouts | Flag traps directly where concept is taught |
| **Numbered PYQs with explanation** | Full question → answer → why wrong options fail |
| **UPPCS 2025 Practice Zone format** | Statements, A/R, matching — not simple one-liners only |
| **Collapsible Practice Zone answers** | Use `<details>` in markdown; import converts to Notion **toggle** blocks |
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
| **Table soup** — 5+ consecutive tables, zero point-wise explanation | Cannot answer UPPCS statement questions |
| **PYQ summary tables only** (`\| UPPCS 2018 \| answer \|`) or PYQ Bank as index table | Disconnected from exam wording; student cannot self-test |
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
| **Prose paragraphs** | **Point-wise bullets** (≥8 substantive points per subtopic) | Mechanism, cause–effect, context — scannable for raata |
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

## UPPCS Question Patterns (AI-internal — for Phase A/C and Delivery Report)

Use when self-verifying and in the **Delivery Report** — do **not** add a "How UPPCS Tests This Topic" section to the student file. Weave pattern traps into each N.X `> **Exam note:**` instead.

Reference real questions from `UP_PCS_Pre_2025_GS_Paper_1.md`. In Delivery Report include **2025 paper overlap** with Q numbers.

| UPPCS asks… | What student must know |
|-------------|------------------------|
| 2-statement correct? | Each statement true/false + why |
| A/R | A and R truth + whether R explains A |
| NOT correctly matched | Spot wrong pair (date/org/location) |
| Match List-I / II | Concept ↔ location / org ↔ year |
| UP-specific | District, museum, site, scheme in UP |
| Scheme / Programme | Year, ministry, objective, trap year |

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

- **Key term** — one mechanism or cause→effect per bullet; bold only exam-critical words.
- Continue until ≥8 substantive points (mechanism, trap, UP example where relevant).
- Use nested bullets only for sub-types (e.g. grazing vs detritus chain) — not for hiding paragraphs.

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
- Liebig's Law style — rule + examples in **point-wise bullets**, not dense paragraphs
- Lentic/Lotic with memory trick in bullets, not table-only

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

**Collapsible answers (mandatory):** Practice Zone is for self-testing. Answers must not be visible on first read.

Use HTML `<details>` / `<summary>` in the markdown file — works in **Cursor / VS Code** preview. On **Notion import**, `markdown-to-blocks.js` auto-converts each `<details>` block to a native **toggle block** (click to expand). Do not rely on raw HTML in Notion; it renders as plain text.

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

> **Notion note:** Re-import after editing Practice Zone (`node src/import-env-ecology.js --force --file=NN_....md`) so toggles update.

### 5. Complete PYQ Bank — Self-Test Format (mandatory)

**Not a summary table.** Every PYQ referenced inline must appear here as a **full self-test card** with hidden answer.

Add once under the PYQ Bank header:
`> **Answers hidden** — click *Show answer* under each question to reveal.`

**Format per question:**

```markdown
**Q1. UPPCS Prelims 2024**

[Full question text — statements, options, match lists as in actual paper]

<details>
<summary>Show answer</summary>

**Ans: C** — 1-line why + why wrong options fail.

</details>

---
```

**Rules:**

| Rule | Requirement |
|------|-------------|
| **Header** | `**Q{N}. {Exam} {Year}**` — exam + year in **one label** (e.g. `UPPCS Prelims 2024`, `UPSC Prelims 2016`) |
| **No subtopic column** | Do not tag by §N.X — student tests recall, not section lookup |
| **Full question text** | Mine from `pyq/` when available; reconstruct for pattern PYQs from inline wording |
| **Hidden answer** | Wrap in `<details><summary>Show answer</summary>` — same toggle as Practice Zone |
| **Coverage** | Include **every** deduplicated question from inline PYQ sections |
| **Order** | UPPCS first (newest year first), then UPSC; numbered Q1, Q2… |
| **Pattern PYQs** | Header suffix `— pattern` if not verbatim from `pyq/` folder |

**Reject:** `| # | Exam | Yr | Subtopic | Question summary | Answer |` summary tables.

### 6. Mains Answer Framework

**Mandatory** for Topics **6, 7, 8, 9, 15, 17, 18, 23, 24**.

Each framework: **Question title → Structure (word count) → 5–7 bullet points → Indian/UP example to cite**

### 7. Common Traps

- Standalone `## Common Traps — Don't Fall For These` section at end (before or after Mains — match art & culture Topic 1)
- Minimum **10** traps (15+ for Topics 4, 9, 17, 24)
- Sync trap dates/numbers with Consolidated Reference **(F6)**
- Do **not** add Exam Intelligence priority tables or UPPCS vs UPSC comparison blocks to student files

---

## Quality Checklist (Phase C — before marking a topic "complete")

> This checklist is run **by the AI automatically**. Every item must pass; map failures to §Automatic Fail Conditions (F1–F15).

### Syllabus coverage
- [ ] Every `00_Syllabus.md` bullet for this topic has a dedicated N.X (or N.X.Y) section **(F1)**
- [ ] Header `Covers syllabus` lists all bullets — none missing
- [ ] Internal Phase A map lists **specific concepts** per bullet — not vague labels
- [ ] No orphan sections (content not in syllabus unless Topic 25-type expansion)
- [ ] Topic Boundary Table built — OUT-of-scope concepts listed in Delivery Report

### Content depth
- [ ] Every subtopic has **Definitions** table (where applicable) **(F7)**
- [ ] Every subtopic has **point-wise How It Works bullets** (≥8 substantive points) **(F2)**
- [ ] Every subtopic has **≥1 Exam note** callout **(F7)**
- [ ] No section has **4+ consecutive tables** without prose **(F12)**
- [ ] No "etc." or incomplete enumerated lists **(F4)**
- [ ] Mandatory comparison tables included (if topic covers those concepts)
- [ ] 2025 overlap concepts taught in matching N.X prose **(F5)**
- [ ] Common Trap items synced to Consolidated Reference **(F6)**

### Exam alignment
- [ ] 2025 overlap concepts in matching N.X prose + noted in Delivery Report **(F5)**
- [ ] Practice Zone ≥40% multi-statement **(F8)**
- [ ] Practice Zone answers wrapped in `<details><summary>Show answer</summary>` (hidden until click)
- [ ] Practice count matches topic size (25–50)
- [ ] PYQs mined from `pyq/` — full text inline + PYQ Bank self-test cards with hidden answers **(F9)**
- [ ] Hindi column in Must-Know Term Comparisons **(F14)**

### UP & completeness
- [ ] Internal syllabus audit passes — all bullets covered **(F10)**
- [ ] UP Focus table present if applicable **(F11)**
- [ ] Consolidated Reference (Acts/Orgs/Dates/Schemes/CA) present once
- [ ] Mains Framework present (if mandatory topic)
- [ ] Common Traps ≥10 (15+ for Topics 4, 9, 17, 24) **(F15)**
- [ ] `Last verified` date in header (Topic 24 and CA sections)
- [ ] No "See Topic X" anywhere **(F13)**
- [ ] No AI-internal sections in file (Syllabus Map, How to Use, How UPPCS Tests, Checklist, completion footer)
- [ ] **Delivery Report** output in chat with "File ready: YES"

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
  Step 12: Output Delivery Report in chat → must show "File ready: YES"
  Step 13: Present to student → wait for approval before Topic N+1
```

**Do NOT start Topic N+1 until student approves Topic N.**  
**Do NOT ask student to cross-verify syllabus — that is Phase C's job.**

---

## Gold Standard Structure Diff (compare every topic to Topic 1)

Before delivery, confirm the topic file has **every** structural block Topic 1 has (scaled to topic size):

| Block | Topic 1 has it? | Required for all topics? |
|-------|-----------------|--------------------------|
| Header (`Covers syllabus`, sources, weight, verified) | ✅ | **Yes** |
| Quick Revision Box (code block) | ✅ | **Yes** |
| Must-Know Term Comparisons + Hindi | ✅ | **Yes** |
| Memory Tricks | ✅ | **Yes** |
| N.X: Definitions + How It Works + Exam note + Exam Facts + PYQs + Examples | ✅ | **Yes, per subtopic** |
| Consolidated Reference (once) | ✅ | **Yes** |
| UP Focus | ✅ | If UP-relevant |
| Practice Zone (25–50, format mix) | ✅ | **Yes** |
| Complete PYQ Bank | ✅ | **Yes** |
| Mains Answer Framework | ✅ | Topics 6–9, 15, 17–18, 23–24 |
| Common Traps | ✅ | **Yes** |
| ~~Syllabus Coverage Map~~ | ❌ | **No — AI-internal only** |
| ~~How to Use / How UPPCS Tests / Checklist / footer~~ | ❌ | **No — AI-internal only** |

---

## Example Prompt for Next Topic (Environment)

```
Restructure environments & ecology/02_Ecology_and_Ecosystem.md using:
- @subjects/prompt.md (run Phase A → B → C; output Delivery Report)
- @00_Syllabus.md (all 16 subtopics — map each to 2.X)
- @01_Environment_Basics.md (gold standard depth — NOT table-only)
- @pyq/ (all years)

Self-verify per prompt.md — I should NOT need to cross-check completeness.
Phase A: boundary table + concept inventory before writing.
Phase C: F1–F15 pass + Delivery Report "File ready: YES" (no audit tables in file).
No "etc." in any list. 2025 overlap in prose. UP Focus if applicable.
Practice Zone: 40+ questions, UPPCS 2025 format.
Work on Topic 2 only. Wait for my approval before Topic 3.
```

## Example Prompt for Next Topic (Art & Culture)

```
Create art and culture/01_Institutions_Related_to_Indian_Culture.md using:
- @subjects/prompt.md (run Phase A → B → C; output Delivery Report)
- @subjects/art and culture/00_Syllabus.md (all 16 subtopics — map each to 1.X)
- @subjects/environments & ecology/01_Environment_Basics.md (structural gold standard until Topic 1 approved)
- @pyq/ (all years)

Self-verify per prompt.md — I should NOT need to cross-check completeness.
Phase A: boundary table + concept inventory before writing.
Phase C: F1–F15 pass + Delivery Report "File ready: YES" (no audit tables in file).
No "etc." in any list. UP Focus (Lucknow Museum, SNA, ASI HQ traps).
Practice Zone: 30+ questions, UPPCS 2025 format.
Work on Topic 1 only. Wait for my approval before Topic 2.
```

---

## Subject-Specific Notes

### Environment & Ecology (25 topics)

| Topic | File | Subtopics | Status | Notes |
|-------|------|-----------|--------|-------|
| 1 | `01_Environment_Basics.md` | 4 | ✅ Complete (July 2026 audit) | Syllabus map + UP Focus + full biomes |
| 2 | `02_Ecology_and_Ecosystem.md` | 16 | Restructure | Largest concept topic |
| 3 | `03_Food_Chain_and_Energy_Flow.md` | 5 | ✅ Complete (July 2026) | 10% rule, pyramids — high PYQ; point-wise format |
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

### Indian Art & Culture (16 topics)

| Topic | File | Subtopics | Status | Notes |
|-------|------|-----------|--------|-------|
| 1 | `01_Institutions_Related_to_Indian_Culture.md` | 16 | Pending | ASI, IGNCA, museums, culture schemes |
| 2 | `02_Religious_and_Philosophical_Traditions.md` | 8 | Pending | Shad Darshana, Bhakti, Sufi |
| 3 | `03_Indian_Architecture.md` | 26 | Pending | Nagara/Dravida/Vesara + monuments |
| 4 | `04_Indian_Painting.md` | 9 | Pending | Ajanta, Mughal, Rajput, Pahari |
| 5 | `05_Indian_Music.md` | 6 | Pending | Gharanas, instruments, musicians |
| 6 | `06_Indian_Dance.md` | 11 | Pending | 8 classical + folk/tribal |
| 7 | `07_Indian_Theatre_and_Performing_Arts.md` | 9 | Pending | Natyashastra, puppetry |
| 8 | `08_Indian_Languages_and_Literature.md` | 8 | Pending | Sanskrit, epics, regional lit |
| 9 | `09_Indian_Festivals_and_Fairs.md` | 9 | Pending | State-wise + govt festivals |
| 10 | `10_Ancient_Indian_History_Related_to_Culture.md` | 5 | Pending | Art, sculpture, agriculture |
| 11 | `11_Medieval_Indian_Cultural_History.md` | 6 | Pending | Akbar administration & culture |
| 12 | `12_Sculpture.md` | 9 | Pending | Gupta, Buddhist schools |
| 13 | `13_Folk_Culture.md` | 7 | Pending | Folk arts + handicrafts/GI |
| 14 | `14_Cultural_Heritage.md` | 6 | Pending | UNESCO WH + intangible (India) |
| 15 | `15_Archaeology.md` | 4 | Pending | Excavations, ancient sites |
| 16 | `16_Exam_Essentials_Awards_Personalities_GI_Tags.md` | 6 | Pending | Awards, GI tags, personalities |

### NCERT chapter hints (Indian Art & Culture)

| Topics | Primary NCERT / sources |
|--------|-------------------------|
| 1, 15 | Class 11–12 History (culture institutions); India Year Book (Culture Ministry) |
| 2 | Class 11–12 History; RS Sharma / AL Basham culture sections |
| 3, 10, 11, 12 | Class 11 Fine Arts (An Introduction to Indian Art); Class 12 History |
| 4, 5, 6, 7 | Class 11 Fine Arts; IGNCA / Akademi reference material |
| 8 | Class 11–12 History (literature); Hindi/Sanskrit NCERT where relevant |
| 9, 13 | State culture handbooks; India Year Book; folk surveys |
| 14 | UNESCO lists; ASI publications; Ministry of Culture |
| 16 | Akademi award lists; DPIIT GI registry; PIB culture awards |

### PYQ mining (Art & Culture)

Search `pyq/` for `Subject: Art & Culture`, `Subject: History` (culture overlap), `Subject: Geography` (monument/site matching), and multi-statement questions on dance, music, UNESCO, temples.

**UP Focus (Art & Culture):** Mathura/Vrindavan (Braj culture), Varanasi (classical music, ghats), Lucknow (Kathak, Awadhi), Sarnath (Buddhist art), Agra (Mughal), Khajuraho (UP-adjacent trap), Chunar/Chunar fort crafts, UP folk (Raslila, Nautanki), state museums (Lucknow State Museum, Allahabad Museum).

### Future subjects

1. Create `00_Syllabus.md` with every exam subtopic as bullets *(Art & Culture — done)*
2. Link to this `prompt.md`
3. One topic file per `##` heading in syllabus
4. One topic at a time; student approval between topics
5. Mark subject complete only when all topic files pass Quality Checklist

---
