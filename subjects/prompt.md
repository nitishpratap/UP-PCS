# UPPCS Study Notes — Master Prompt

Use this file to instruct any AI (or yourself) when creating or restructuring topic notes inside `subjects/`. Every topic file must be a **complete source of truth** — the student should never need to open NCERT, another book, or a different topic file to prepare for that topic's exam questions.

**Exam pattern standard:** `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md` (format reference) + **all files in `pyq/` from 2018–2025** + **RO-ARO** — **every matching UPPCS/RO-ARO question must be searched and added per §UPPCS PYQ Search & Addition Protocol**  
**External high-yield (mandatory when `pyq/` is thin):** Also run **§External High-Yield Completeness Protocol** — search UPSC/standard exam lists + known RO-ARO hits so books, poems, novels, authors, match-pairs are not missed just because they are absent from local `pyq/`.  
**Syllabus source:** Each subject folder's `00_Syllabus.md`  
**Gold standard (structure + depth):** `subjects/environments & ecology/01_Environment_Basics.md` — **match this file's depth, not just its headings**  
**Per-subject gold standard:** Once a subject's Topic 1 is student-approved, that file becomes the gold standard for *that* subject (e.g. `subjects/art and culture/01_Institutions_Related_to_Indian_Culture.md`, `subjects/mordern india/01_Advent_of_Europeans.md`). Match **narrative depth and block structure**, not section headings alone.

> **For the AI:** You must **self-verify** every topic before presenting it. The student should never need to ask "is this complete?" or "why is this section thin?" Run the full workflow in §Mandatory AI Workflow and output the §Delivery Report. If any gate fails (including **F17–F21** history event depth and **F22** external high-yield gaps), fix the file first — do not ask the student to cross-check.

### One-Line Universal Prompt (copy for any topic)

```
Create/restructure Topic N in @subjects/[subject]/ using @subjects/prompt.md + @00_Syllabus.md + subject Topic 1 gold standard + @pyq/.
Run Phase A→B→C from prompt.md. **Phase A Step 4: run full UPPCS PYQ search protocol (§UPPCS PYQ Search & Addition Protocol) — grep all `pyq/` files for years 2018–2025 + RO-ARO, list every hit, add all to topic file.**
**Phase A Step 4b: run §External High-Yield Completeness Protocol** — web/standard UPSC–UPPCS match lists + RO-ARO culture hits for books/authors/poems/novels/schemes so nothing exam-critical is left only because local `pyq/` lacks it.
Self-verify (F1–F22). Output Delivery Report with PYQ audit + External high-yield audit + per-section depth audit + "File ready: YES".
Match subject Topic 1 gold-standard depth exactly — headings alone are NOT enough. For wars/battles/treaties/rebellions/annexations: enforce §History Event Depth Protocol (Causes + Step-by-Step Course + Results + Key Persons). Use full-sentence bullets, not label-fragments or semicolon chains. No etc. in lists. One topic only. Wait for approval before next.
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
2. Read subject **Topic 1 gold-standard file** (e.g. `01_Environment_Basics.md` or `01_Advent_of_Europeans.md`) → note section pattern **and narrative depth** (not headings only). For History: study one approved war section (Carnatic / Anglo-Maratha) as depth template.
3. Read NCERT chapters for this topic (see §NCERT map) → list every heading/subheading
4. **Run UPPCS PYQ search protocol** (§UPPCS PYQ Search & Addition Protocol) — grep **every file in `pyq/` (UPPCS Prelims 2018–2025 + RO-ARO)**; build a numbered PYQ inventory (Q#, year, exam type, subtopic, target §N.X); **do not write until this list exists**
4b. **Run External High-Yield Completeness Protocol** (§External High-Yield Completeness Protocol) — search **beyond local `pyq/`** (UPSC/standard match lists, known RO-ARO hits, standard freedom-struggle / culture lists) for books, poems, novels, authors, schemes, match-pairs that this syllabus topic owns; merge into Concept Inventory; **do not write matching-heavy sections until this inventory exists**
5. Build TOPIC BOUNDARY TABLE (IN / OUT / BRIEF)
6. Build SYLLABUS → N.X MAP (one row per bullet; no bullet unassigned)
7. Build CONCEPT INVENTORY — every exam concept that must appear, with target section:
   - definitions, mechanisms, paired concepts, complete lists, dates, UP examples, 2025 PYQ overlaps
   - **plus every row from External High-Yield inventory** (Step 4b)
8. Draft Syllabus Coverage Map "What must be inside" column — specific concepts, not vague labels
```

**Stop if:** Any syllabus bullet has no N.X assignment → fix map before writing.  
**Stop if:** Topic is matching-heavy (books/authors, poems, novels, culture names, scheme↔ministry, org↔report) and External High-Yield inventory was skipped → run Step 4b before writing.

### Phase B — Write (follow gold standard structure)

Write the full file per §Required Document Structure. While writing, enforce §Subtopic Depth Matrix, §History Event Depth Protocol (if applicable), and §Completeness Rules.

**Phase B depth rule:** Do not batch-write all sections then audit at the end. For History/Modern India topics, write **one war/event block at a time** and self-check it against §History Event Depth Protocol before moving to the next. A file with correct headings but thin bodies is a **Phase B failure** — fix before Phase C.

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
| 8 | **PYQ mined from pyq/, not invented** | Generic "UPPCS asked this"; only recent years searched | Full question text from `pyq/`; **all** matching UPPCS/RO-ARO (2018–2025) in PYQ Bank; Q# + year in Delivery Report |
| 8b | **External high-yield beyond pyq/** | Only syllabus eight + local PYQs; missed Firangiya / Bose / Savarkar / GG books | Ran §External High-Yield Completeness Protocol; Quick Revision + Master Match include standard UPSC–UPPCS match titles |
| 9 | **Practice mirrors 2025 format** | All simple MCQs | ≥40% multi-statement; mix A/R, matching |
| 10 | **Syllabus map = checklist** | Vague "covers basics" | Specific concepts per row |
| 11 | **History events = full narrative depth** | Anglo-Maratha as 8 date bullets only | Each war: Causes + Step-by-Step Course + Results + Key Persons (see §History Event Depth Protocol) |
| 12 | **Multi-war topics split per war** | "Four Anglo-Mysore Wars" in one 10-line block | Parent §N.X + sub-blocks `N.X.1` First War, `N.X.2` Second War, etc. |
| 13 | **Gold standard = depth, not headings** | File has Definitions + How It Works headings but body is thin | Match approved subject Topic 1 section **line count and block structure**, not just section titles |
| 14 | **Treaty-year traps need comparison table** | Salbai/Bassein/Madras/Mangalore mentioned only in bullets | Dedicated treaty comparison table when 2+ treaties in same subtopic |

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
| `### PYQs — [Subtopic]` | **Always** | **≥2 UPPCS or RO-ARO** (any year 2018–2025) if in `pyq/`; else **1 UPPCS/RO-ARO + 1 UPSC**; full text + why |
| `### Examples (N.X)` | **Always** | ≥3 rows; ≥1 UP/India-specific |

> **Geography exception (`subjects/geography/` — ALL topics 01–N, including future):** Follow `.cursor/rules/geography-anti-redundancy.mdc`. Student reads **one section at a time, once** — not Pass A→D skip reading. Each `##` section must be self-explanatory on first read (Definitions + full-sentence Teach + table + exam note + section PYQs). Quick Revision = later raata only. Practice stems = full questions + short why (no telegrams). Do **not** add Examples that only restate Teach/table. Exam Facts = traps only (omit if already clear). Prefer one teaching home per fact — no Overview + How It Works + Exam Facts + Examples + Consolidated echo stacks. No telegram PYQ shorthand in Teach (e.g. do not write “Amrit Bharat (Feb 2023 framing): 149” without explaining the scheme).

**NCERT depth:** For each NCERT subheading mapped IN to this topic, there must be corresponding prose — not just a one-line table row.

**Classification subtopics** must include: all bases, sub-types, India-specific list (if any), legal/administrative class (if any), comparison traps.

**Scheme/policy subtopics** must include: Scheme card (Year | Ministry | Objective | Trap).

**History event subtopics** (wars, battles, treaties, rebellions, annexations, administrative turning points) must follow **§History Event Depth Protocol** in addition to this matrix. Passing F2 (≥8 bullets) alone is **not sufficient** for event subtopics.

---

## History Event Depth Protocol (Mandatory — Ancient, Medieval, Modern India)

> **Why this exists:** Topic 2 (East India Company Expansion) initially passed heading checks but failed student review — sections like Anglo-Maratha Wars had only ~10 summary bullets while Carnatic Wars in Topic 1 had Causes, Step-by-Step Course, Results, and Key Persons. **Headings without narrative depth = incomplete.**

### When this protocol applies

Apply to **every** §N.X (or §N.X.Y) that covers any of:

| Event type | Examples |
|------------|----------|
| **War / campaign** | Anglo-Mysore Wars, Carnatic Wars, Anglo-Maratha Wars, Anglo-Sikh Wars |
| **Battle** | Plassey, Buxar, Assaye, Mudki, Wandiwash |
| **Treaty / settlement** | Salbai, Bassein, Sugauli, Lahore, Allahabad 1765 |
| **Rebellion / revolt** | Banaras Rebellion, Chait Singh, 1857 precursors |
| **Annexation** | Punjab, Sindh, Awadh, Doctrine of Lapse states |
| **Policy turning point** | Subsidiary Alliance, Dual Government, Doctrine of Lapse |

**Do NOT apply** to pure definition lists (e.g. "types of biomes") or scheme cards — those follow §Subtopic Depth Matrix only.

### Required blocks per event subtopic (all mandatory)

| Block | Required? | Minimum |
|-------|-----------|---------|
| `### Definitions` | **Always** | Terms, dates, key actors for this event |
| `### Causes` or `#### Causes` | **Always** | **4–5 numbered causes** — not one-line bullets |
| `### Course of [Event] — Step by Step` or `#### Course — Step by Step` | **Always** | **6–8 numbered steps** — chronological sequence |
| `### [Event] — How It Works` | **Always** | **≥8 full-sentence bullets** — mechanism, cause→effect, traps |
| `### Results of [Event]` or `#### Results` | **Always** | **Results table** (Result \| Why it matters) — minimum 4 rows |
| `### Key Persons` | If people matter | Table: Person \| Side \| Role — minimum 4 rows |
| `> **Exam note:**` | **Always** | Most-tested trap for this event |
| `### Exam Facts (raata)` | **Always** | 5–15 bullets |
| `### PYQs — [Subtopic]` | **Always** | Per §Subtopic Depth Matrix |
| `### Examples (N.X)` | **Always** | ≥3 rows |

### Multi-war / multi-event parent sections

When one syllabus bullet covers **2 or more wars, battles, or treaties** (e.g. Anglo-Mysore Wars, Anglo-Maratha Wars, Carnatic Wars):

1. Parent `## N.X` gets: **Definitions**, **Background**, **Master Overview Table**, **Treaty Comparison Table** (if applicable).
2. **Each war/event** gets its own sub-block: `### N.X.1 First … War`, `### N.X.2 Second … War`, etc.
3. **Each sub-block** must satisfy the full Required blocks table above — no shortcuts.
4. **Never** summarise all wars in one `How It Works` block only.

**Gold-standard reference (Modern India):** `subjects/mordern india/01_Advent_of_Europeans.md` §1.13–1.15 (Carnatic Wars) and `02_East_India_Company_Expansion.md` §2.10 (Anglo-Maratha Wars) after student-approved expansion.

### Thin-section smell test (auto-fail — expand before delivery)

Reject and expand if **any** of these are true for an event subtopic:

| Smell test | Fail signal |
|------------|-------------|
| **No Causes block** | Only dates and outcomes listed |
| **No Step-by-Step Course** | War covered in 3–5 summary bullets |
| **No Results table** | Results mentioned only inline |
| **Multi-war in one block** | "First War: … Second War: … Third War: …" in one How It Works |
| **Treaty trap without table** | Salbai vs Bassein, Madras vs Mangalore — no comparison table |
| **Section too short** | Event subtopic under **~35 lines** total (excluding PYQs) |
| **Checklist bullets only** | `How It Works` = date + treaty + trap list with no cause→course→result narrative |

### Bad vs Good (reject thin war sections)

**Bad (reject — looks complete but is not):**
```
### Anglo-Maratha Wars — How It Works
- First War 1775–82: Raghunath Rao; Salbai 1782.
- Second War 1803–05: Wellesley; Bassein 1802.
- Third War 1817–18: Peshwa removed.
- Trap: Salbai ended Third War.
```

**Good (required — each war expanded):**
```
### 2.10.1 First Anglo-Maratha War (1775–1782)
#### Causes
1. Succession dispute at Poona …
#### Course of the War — Step by Step
1. 1775: British troops march from Bombay …
#### First War — How It Works
- [8+ full-sentence bullets]
#### Results of the First Anglo-Maratha War
| Result | Why it matters |
```

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
| F9 | PYQs or PYQ Bank use summary-table only (no full question text); PYQ Bank answers visible without `<details>`; **any UPPCS Prelims (2018–2025) or RO-ARO question in `pyq/` that maps to this topic is missing from the topic file** |
| F10 | Internal syllabus audit fails — any bullet lacks N.X section or required blocks |
| F11 | UP-relevant topic (geo/forest/river/pollution) lacks UP Focus table |
| F12 | 4+ consecutive tables without prose between them |
| F13 | "See Topic X" appears anywhere |
| F14 | Must-Know Term Comparisons missing Hindi column |
| F15 | Fewer than 10 Common Traps (15 for Topics 4, 9, 17, 24) |
| F16 | Any explanatory bullet uses fragment style such as `Author: X. Fragment; fragment`, `Ruler: title; conquest; temple`, semicolon-chain notes, dash-chain notes (`Title — fact — trap`), or arrow-chain notes (`A → B → C`) instead of complete sentences |
| F17 | Any History **event subtopic** (war, battle, treaty, rebellion, annexation, policy turning point) lacks **`Causes`** section with ≥4 numbered causes |
| F18 | Any History **event subtopic** lacks **`Course — Step by Step`** section with ≥6 numbered steps |
| F19 | Any History **event subtopic** lacks **`Results`** table with ≥4 rows |
| F20 | Any parent section covering **2+ wars/events** lacks per-event sub-blocks (`N.X.1`, `N.X.2`, …) each with full §History Event Depth Protocol blocks |
| F21 | Any History event subtopic's `How It Works` is only a date/treaty/name checklist without cause→course→result narrative (thin summary disguised as depth) |
| F22 | Matching-heavy topic (books/authors, poems, novels, Bhojpuri/UP culture, schemes, org↔report) delivered **without** §External High-Yield Completeness Protocol — OR high-yield title known from UPSC/standard lists / RO-ARO is missing from Quick Revision / Master Match / teaching prose |

---

## Delivery Report (AI must output this with every completed topic)

After Phase C passes, output this table to the student — **no manual cross-check needed**:

```markdown
## Verification Report — Topic N

| Gate | Status | Notes |
|------|--------|-------|
| Syllabus bullets mapped (count) | ✅ N/N | [list any grouped bullets] |
| NCERT headings covered (IN scope) | ✅ | [chapters checked] |
| PYQs mined from pyq/ | ✅ | **UPPCS/RO-ARO: [list Q# + year + exam for every hit, 2018–2025]**; UPSC: [count]; all in PYQ Bank |
| UPPCS PYQ audit | ✅ | Searched: [list all pyq/ paths — Prelims 2018–2025 + RO-ARO]; Found: [N]; Added inline: [N]; Added PYQ Bank: [N]; Missing: 0 |
| External high-yield audit (F22) | ✅ | Sources searched: [list]; Titles added beyond syllabus/`pyq/`: [list]; Deliberately skipped: [list + why] |
| 2025 overlap in prose | ✅ | [Q numbers → sections] |
| Practice Zone count + format mix | ✅ | [N questions; X% multi-statement] |
| UP Focus included | ✅/N/A | |
| Automatic fail conditions (F1–F22) | ✅ 0 failures | |
| History event depth audit | ✅ | [list every war/battle/treaty §N.X — Causes ✅ / Course ✅ / Results ✅ / Key Persons ✅ or N/A] |
| Gold standard diff vs subject Topic 1 | ✅ | [same skeleton **and** same narrative depth — not headings only] |

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

### Full-Sentence Bullet Rule (mandatory — no fragment notes)

Every bullet in `How It Works`, `Exam Facts`, `Common Traps`, and consolidated prose sections must be a complete sentence or two short complete sentences. Lucent-style means concise, not telegraphic.

| Reject | Accept |
|--------|--------|
| `- **Author:** Nuruddin Jahangir himself. Personal observations; continued memoir tradition from Baburnama.` | `- **Author:** **Nuruddin Jahangir** wrote Tuzuk-i-Jahangiri himself. The work records his personal observations and continues the memoir tradition started by **Baburnama**.` |
| `- **Rajaraja I:** Conquered Madurai, Sri Lanka, Maldives; built Brihadishwara.` | `- **Rajaraja I** conquered **Madurai**, northern **Sri Lanka**, and the **Maldives**. He built the **Brihadishwara Temple** at Tanjore in **1010 CE**.` |
| `- **Language:** Persian. Court norm by 17th c.` | `- **Language:** The work was written in **Persian**, which had become the normal Mughal court language by the early 17th century.` |

**Hard rules:**
- Do not use semicolons (`;`) to pack separate facts into one bullet.
- Do not use dash chains (`—`) or arrow chains (`→`) to pack separate facts into one bullet.
- Do not write sentence fragments after a label, such as `Capital: Delhi. Important trade centre.`
- If a bullet has multiple facts, split them into 1–2 complete sentences with clear subjects and verbs.
- Tables and Quick Revision code blocks may stay compact, but explanatory bullets must pass this rule.

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
| **History — Ancient / Medieval / Modern India** | Advent of Europeans, EIC Expansion, Revolt, National Movement | **§History Event Depth Protocol mandatory** for every war, battle, treaty, rebellion, annexation; multi-war topics split into `N.X.1`–`N.X.N`; match subject Topic 1 Carnatic-war depth |

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

## UPPCS PYQ Search & Addition Protocol (Mandatory)

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

> **Reject:** Searching only `pyq/2025/` and `pyq/2024/` when **2018–2023** folders also exist (all eight years are now in the repo). **Reject:** Ignoring RO-ARO files when `pyq/ro-aro/` exists.

### Phase A — Search workflow (run before writing a single section)

```
Step 1: List syllabus keywords — every bullet for this topic + synonyms, Acts, schemes, place names, org names
Step 2: List ALL pyq/ paths to search:
        (a) pyq/2025/ → pyq/2024/ → pyq/2023/ → pyq/2022/ → pyq/2021/ → pyq/2020/ → pyq/2019/ → pyq/2018/
        (b) pyq/ro-aro/ (all files) OR grep pyq/ for RO-ARO / RO / ARO in filenames
        (c) Any other pyq/YYYY/ folders not listed above
Step 3: For EACH path, grep for:
        (a) Subject: line matching this subject (Environment, Art & Culture, History, Geography, Polity, Economy, Science, Current Affairs)
        (b) Topic: / Subtopic: metadata lines near syllabus labels
        (c) Body text — concept names, place names, scheme names, match-list pairs from Concept Inventory
Step 4: For EACH hit — record: Question # | Year | Exam (Prelims / RO-ARO) | Subject/Topic/Subtopic | Maps to §N.X | pyq/ file path
Step 5: Cross-subject sweep — re-grep across ALL years (2018–2025 + RO-ARO) for UP-specific traps (districts, rivers, NOT-in-UP negatives) even if Subject ≠ primary
Step 6: Build PYQ INVENTORY TABLE (AI-internal) — every row must map to a §N.X or "Topic-level PYQ Bank only"
Step 7: Stop if inventory has zero UPPCS/RO-ARO hits but topic is exam-weight ★★+ — broaden keywords and re-search all years before writing
```

**Tools:** Use workspace search (`grep`/ripgrep) on **entire `pyq/` tree** — do **not** skip because a folder is large or only recent years were used in a prior topic. Read matching `# Question N` blocks in full (question + options; `Year`/`Exam` lines only if present in that file).

### How to map a PYQ to a syllabus topic

| Signal | Rule |
|--------|------|
| **`Subtopic:` field** | Primary mapper when present — assign to matching §N.X |
| **`Topic:` field** | Primary mapper when `Subtopic:` is absent (standard in `pyq/2018/`–`pyq/2025/` per `pyq/prompt.md`) |
| **`Subject:` field** | Filter first; then apply cross-subject rule below |
| **Keyword in question body** | Map if concept is **primary** in this topic file (Topic Boundary Table IN) |
| **Cross-subject** | Include if UPPCS/RO-ARO tests a concept this file owns — e.g. Art 48A/51A(g) → Topic 1; ISFR/FSI → Topic 8/28; Ramsar NOT in UP → Topic 32; Chipko/Appiko → Topic 29; Agenda 21/LiFE → Topic 1/15/24 |
| **OUT of scope** | PYQ maps to another topic → do **not** add full text here; one-line trap note only if it affects this topic's questions |

### Minimum inclusion rules

| Level | Rule |
|-------|------|
| **Topic file (total)** | **Every** UPPCS Prelims (2018–2025) + **every** RO-ARO question from `pyq/` that maps to this topic → must appear in **Complete PYQ Bank** with full question text |
| **Per §N.X subtopic** | **≥2 UPPCS or RO-ARO** inline under `### PYQs — [Subtopic]` if available in `pyq/` across **any year 2018–2025**; else **1 UPPCS/RO-ARO + 1 UPSC** |
| **2025 paper** | Every matching **2025 Q** → taught in matching §N.X **prose** + inline PYQ + PYQ Bank (not Practice Zone only) **(F5)** |
| **Older UPPCS (2018–2024)** | Every matching Q → inline in best-matching §N.X + PYQ Bank; cite year in prose traps where high-yield (e.g. `2019 Q42`, `2022 Q88`) |
| **RO-ARO** | Same as UPPCS — full text, map to §N.X, tag `RO-ARO Prelims YYYY, Q#` |
| **UPSC Prelims** | Add where concept overlaps — **after** all UPPCS/RO-ARO for that subtopic are placed |
| **Pattern PYQs** | Allowed **only** when no UPPCS/RO-ARO/USC verbatim exists in `pyq/` for that concept — suffix `— pattern` in header |

### Where to add each PYQ (four placements)

1. **§N.X prose** — 1-line callout for high-yield traps: `> **2025 Q144 trap:** Nokrek = Meghalaya, not Manipur` (use actual year/Q# from inventory)
2. **`### PYQs — [Subtopic]`** — full question text + answer + why wrong options fail (exam + year + Q# tag, e.g. `UPPCS Prelims 2019, Q42` or `RO-ARO Prelims 2021, Q15`)
3. **`## Complete PYQ Bank`** — every deduplicated UPPCS/RO-ARO from `pyq/` for this topic; answers in `<details>`; **group by year** (2025 → 2018 → RO-ARO) or chronological
4. **Practice Zone** (optional) — reproduce 1–3 highest-yield UPPCS/RO-ARO if not already covered by original-format MCQs

### Subject-specific search hints (Environment & Ecology)

Grep **all years 2018–2025 + RO-ARO** in `pyq/` for these in addition to `Subject: Environment`:

| Topic band | Example grep terms |
|------------|-------------------|
| 1–4 | ecology, ecosystem, biodiversity, food chain, pyramid, niche, succession |
| 5–8, 32–33 | national park, sanctuary, biosphere, tiger, elephant, forest, Dudhwa, Ramsar, ISFR |
| 9, 38 | pollution, AQI, NCAP, BOD, plastic, waste |
| 10, 34–37 | climate, GHG, carbon, warming, ozone, Montreal |
| 15–18, 42–43 | SDG, Brundtland, Rio, CBD, UNFCCC, Paris, EPA, WPA, NGT |
| 24, 44 | LiFE, carbon credit, blue economy, microplastic |
| 29 | Chipko, Appiko, Silent Valley, Narmada |
| 31 | World Environment Day, Wetlands Day, Ozone Day |
| UP traps | Sultanpur, Valmiki, Bahraich, Pilibhit, NOT located, NOT in UP |

*(Add analogous keyword tables when new subjects are built — mirror §PYQ mining Art & Culture below.)*

### Reject conditions (PYQ-specific)

| Reject | Why |
|--------|-----|
| "UPPCS asked about X" with no question text | **F9** — must mine from `pyq/` |
| 2025 Q cited only in Practice Zone | **F5** — must be in §N.X prose |
| UPPCS in `pyq/` (any year 2018–2025) or RO-ARO mapped to topic but missing from PYQ Bank | **F9** |
| Summary table `\| Q# \| Year \| Answer \|` instead of full cards | **F9** |
| Pattern PYQ when verbatim exists in `pyq/` | Replace with mined text |

---

## PYQ Mining Rules (summary)

Do **not** rely only on inline memory. For each topic:

1. Run the full **§UPPCS PYQ Search & Addition Protocol** above — mandatory Phase A step.
2. Search **all `pyq/` folders: UPPCS Prelims 2018 → 2019 → … → 2025**, then **`pyq/ro-aro/`** (or RO-ARO filenames anywhere under `pyq/`). Use **`pyq/2025/`** as format reference only — not as the only source.
3. Filter by `Subject:`, `Topic:`, `Subtopic:` (if present) **and** keyword grep for cross-subject hits **across every year**.
4. Include **UPPCS Prelims + RO-ARO first** (all matching questions from 2018–2025); add **UPSC Prelims** where concept overlaps.
5. Minimum per §N.X: **≥2 UPPCS or RO-ARO** if available in `pyq/` (any year); else **1 UPPCS/RO-ARO + 1 UPSC**.
6. Tag every inline PYQ with **exam + year + Q number** when known (e.g. `UPPCS Prelims 2019, Q42`, `RO-ARO Prelims 2020, Q18`, `UPPCS Prelims 2025, Q144`).
7. Add **full question text** to **Complete PYQ Bank** at end (answer hidden in `<details>`) — include **all years**, not just latest paper.
8. Delivery Report must list **every UPPCS/RO-ARO Q# found (with year and exam type)** and confirm all were added **(PYQ audit row)**. Note any missing year folders in repo.

**Map PYQ subjects loosely to syllabus topics** — e.g. "Forestry / ISFR 2023" → Topic 8; "Lichens" → Topic 4 or 21; "LiFE" → Topic 24 or 15; "Biosphere Reserve / Nokrek" → Topic 33 (and brief in Topic 6).

---

## External High-Yield Completeness Protocol (Mandatory — F22)

> **Why this exists:** Modern India Topic 10 initially covered only syllabus eight + local Prelims PYQs. Student found **Firangiya (Manoranjan Prasad Sinha)** missing — a real **RO-ARO 2021** ask absent from local `pyq/` because `pyq/ro-aro/` was empty. Later audit also showed standard UPSC match titles (Bose *Indian Struggle*, Savarkar *War of Independence*, Curzon/Hardinge GG books, etc.) thin or missing. **Local `pyq/` alone is not a complete source of truth for matching-heavy topics.**

### When this protocol applies (do not skip)

Run **in Phase A Step 4b** for **every** topic. Treat as **hard mandatory** (cannot mark File ready: YES without it) when **any** of these are true:

| Trigger | Examples |
|---------|----------|
| Syllabus lists **Books / Authors / Literature / Poems / Novels** | Modern India Topic 10; Art & Culture literature bullets |
| Topic is **match-list heavy** | Book↔author, poem↔poet, scheme↔ministry, org↔report, day↔date, treaty↔year |
| UP / Purvanchal **language-culture** stream | Bhojpuri, Awadhi, Hindi realism, folk theatre |
| Local `pyq/ro-aro/` **missing or empty** but topic is ★★+ culture/history | Must still search known RO-ARO hits externally |
| Syllabus bullet is a **short label** that exams expand | "Bhojpuri Literature", "Books Related to Governors-General", "Realistic Novels" |

### Phase A — External search workflow (before writing matching sections)

```
Step 1: From 00_Syllabus.md, list every matching / name-pair bullet for this topic
Step 2: Search standard UPSC / UPPCS / SSC static-GK sources for that bullet family:
        - "Modern Indian History Books and Authors" / "Books of Freedom Struggle"
        - ClearIAS / standard UPSC portals / reputable exam compilations
        - Topic-specific: Bhojpuri literature, Premchand novels, Bankim novels, Ambedkar books
Step 3: Search known RO-ARO / UPPSC culture hits when pyq/ro-aro/ is empty:
        - e.g. "UPPSC RO ARO Firangiya", "Bidesiya", "Batohiya", district/culture poems
Step 4: Build EXTERNAL HIGH-YIELD INVENTORY (AI-internal):
        | Title / Work | Author | Type (book/poem/play/novel) | Why exam-relevant | Source | Target §N.X | Add? (YES/NO) |
Step 5: Merge every YES row into Concept Inventory + Quick Revision + Master Match Table
Step 6: For each YES row — teach in prose (not only a table cell): definition/tag + Exam note trap if swap-prone
Step 7: If a found RO-ARO/UPSC question is NOT in local pyq/ — still add full text to PYQ Bank tagged
        `(RO-ARO/UPSC YYYY — not yet in local pyq/)` and note gap in Delivery Report
Step 8: Stop if matching-heavy topic and inventory has < syllabus expansions for labelled bullets
        (e.g. "Bhojpuri Literature" with only one name = FAIL — broaden search)
```

### Minimum coverage rules (matching topics)

| Level | Rule |
|-------|------|
| **Syllabus named titles** | Every explicitly named book in `00_Syllabus.md` → full §N.X teaching |
| **Syllabus labelled streams** | "Bhojpuri Literature", "Realistic Novels", "Books by Ambedkar", "Books Related to Governors-General", "Books on Partition" → **≥ core high-yield set**, not one example only |
| **Standard freedom-struggle match list** | Include common UPSC/UPPCS pairs even if not in local `pyq/` this year (Bose, Savarkar, Prasad *India Divided*, Bhagat Singh essay, Neel Darpan, Unhappy India↔Mother India, etc.) when topic owns Books & Authors |
| **RO-ARO culture** | If `pyq/ro-aro/` empty, still search and add known hits (Firangiya-class) — do not wait for folder |
| **Depth** | Title in Master Table alone is **not** enough for syllabus-stream bullets — need How It Works / Exam Facts / traps for the stream |

### Canonical anti-pattern (reject)

**Bad (F22):**
```
### Bhojpuri Literature
- Bhikhari Thakur — Bidesiya
```
→ Misses Firangiya / Batohiya / Heera Dom already asked or standard in culture lists.

**Good:**
```
Quick Revision + §N.X with:
Firangiya → Manoranjan Prasad Sinha (1921; RO-ARO)
Batohiya → Raghuveer Narayan
Bidesiya → Bhikhari Thakur
Achhut Kee Shikayat → Heera Dom
+ traps swapping authors
```

### What NOT to dump

| Reject dumping | Why |
|----------------|-----|
| Entire Wikipedia author bibliographies | Not exam ROI |
| Current-affairs bestsellers unrelated to syllabus | Out of scope |
| Ancient/medieval historiography inside Modern India Books topic | Wrong topic boundary |
| Economy-thinker match lists inside Modern India Topic 10 | Wrong subject |

Mark those **OUT** in Topic Boundary Table and list under Delivery Report "Deliberately excluded".

### Delivery Report row (required)

```
| External high-yield audit (F22) | ✅ | Sources: [ClearIAS / UPSC portals / RO-ARO web]; Added: [titles]; Skipped: [titles + why]; pyq/ro-aro missing?: YES/NO |
```

---

## When Restructuring a Topic File

Copy-paste this block as your instruction:

```
Restructure @[topic_file].md using @subjects/prompt.md, @00_Syllabus.md, subject Topic 1 gold-standard file, and @pyq/ (Prelims 2018–2025 + RO-ARO).

MANDATORY WORKFLOW (from prompt.md — do not skip):
Phase A: Pre-audit → syllabus list, NCERT map, PYQ list, **External High-Yield inventory (F22)**, boundary table, concept inventory
Phase B: Write full file matching subject Topic 1 depth (headings + narrative — not headings only)
Phase C: Post-audit → run F1–F22 fail conditions + Quality Checklist; fix all gaps

Rules:
1. List every subtopic from 00_Syllabus.md — map each to N.X (no skips).
2. Match EXPLANATION DEPTH of subject Topic 1 gold standard — prose + tables, not table-only or thin checklists.
3. Every N.X needs: Definitions (if applicable) + How It Works (**point-wise bullets**, ≥8 points) + Exam note + Exam Facts + PYQs + Examples.
4. **History events (wars/battles/treaties/rebellions/annexations):** enforce §History Event Depth Protocol — Causes (≥4) + Course Step-by-Step (≥6) + Results table + Key Persons. Multi-war topics → `N.X.1`, `N.X.2`, … sub-blocks.
5. No "etc." — all enumerated lists must be complete (biomes, zones, categories).
6. Every 2025 paper overlap concept must appear in N.X prose, not only Practice Zone.
7. PYQs: run §UPPCS PYQ Search Protocol — grep all `pyq/` files (**2018–2025 Prelims + RO-ARO**); add **every** matching UPPCS/RO-ARO (full text inline + Complete PYQ Bank); list all Q# + year in Delivery Report.
7b. **External high-yield:** run §External High-Yield Completeness Protocol — UPSC/standard match lists + RO-ARO culture hits for books/poems/novels/authors; add to Quick Revision + Master Match + prose; Delivery Report External high-yield audit row.
8. Practice Zone: scaled count (25–50); UPPCS 2025 format mix (≥40% multi-statement); answers in `<details>` blocks.
9. Hindi terms in Must-Know Term Comparisons.
10. UP Focus table if topic touches UP geography/forests/wildlife/rivers/pollution.
11. Internal Phase A syllabus map complete (do NOT put Syllabus Coverage Map/Checklist in the student file).
12. Work on ONE topic only. Do not touch other files.
13. Output Delivery Report (from prompt.md) with History event depth audit + External high-yield audit + "File ready: YES" only if F1–F22 pass.
14. Stop and wait for my approval before starting the next topic.

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

<!-- DISABLED — do not create images / Exam Visuals section
## Exam Visuals — High-ROI Images
[0–2 images only — see §Exam Visuals Protocol; skip section entirely if no exam-tested visual]
-->

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

<!-- DISABLED — do not create / generate images for topic files
## Exam Visuals Protocol (History, Art & Culture, Geography)

Add **only** visuals that help answer UPPCS **location-matching, map, chronology, or "which site/feature"** questions. Decoration and random chapter photos are forbidden.

### Visual type priority (use in this order)

| Priority | Type | When to use | Example |
|----------|------|-------------|---------|
| **1** | **Location map** | Site ↔ state/district, capital matching, empire extent | Prehistoric sites map; 16 Mahajanapadas; IVC sites |
| **2** | **Conceptual diagram** | Structure, process, chronology, comparison | Bhimbetka rock-shelter cross-section; invasion timeline |
| **3** | **Labelled artefact sketch** | Only when PYQ asks identify monument/coin/inscription | Lion Capital parts, stupa plan |
| **4** | **Photograph** | Last resort — only if map/diagram cannot teach it | Skip if decorative |

**Reject:** Generic monument photos with no location context; Wikimedia hotlinks that break offline; "related to chapter" images with no exam trap.

### When required

| Subject type | Add visuals? | Max per topic |
|--------------|--------------|---------------|
| **Ancient/Medieval History** | Yes — if PYQ or classic trap exists | **1–2** |
| **Art & Culture** | Yes — site maps, monument plans, school comparison | **1–2** |
| **Geography / Environment** | Yes — maps, landforms, protected-area location | **1–2** |
| **Pure concept topics** (e.g. Vedic society, polity theory) | **Skip** — no forced images | **0** |

### Selection rules (all must pass)

1. **PYQ-linked or trap-linked** — visual must teach a `pyq/` or Common Trap answer (e.g. Bhimbetka = MP + rock shelter, not Bagor).
2. **Minimum count** — default **1**; **2** only if two distinct high-ROI types (e.g. location map + structure diagram).
3. **Must open offline** — save to `subjects/[subject]/images/`; use relative path `images/filename.png`. **Never rely on remote URLs alone.**
4. **Generate maps/diagrams** when no reliable local file exists — AI-generate **location maps and conceptual diagrams**; never generate fake photos of real artefacts.
5. **Caption = exam note** — every visual needs italic caption: *site ↔ state + PYQ year/trap*.

### Placement & format

Insert `## Exam Visuals — High-ROI Images` **after Memory Tricks, before first `## N.1`**.

```markdown
## Exam Visuals — High-ROI Images

> **Type priority:** location map → conceptual diagram. Images stored locally (`images/`) so they open offline.

### 1. [Site/Topic] — Location Map

![Alt — what student must match](images/topic_sites_map.png)

*Raata site ↔ state pairs. **UPPCS 2020 Q10**: Bhimbetka = MP rock paintings (trap: Bagor = Rajasthan).*
*Source: Study map — generated for UPPCS site-matching*

### 2. [Site] — Conceptual Diagram (optional second image)

![Alt — structure or process](images/site_structure_diagram.png)

*What the site looks like structurally — e.g. Bhimbetka = natural rock shelter in sandstone, not built cave.*
*Source: Study diagram — structure for identification*
```

### Phase C check

- [ ] 0–2 visuals only; each passes selection rules above
- [ ] **Every image is a local file** in `images/` (opens offline in VS Code/Cursor)
- [ ] At least one visual is a **map or diagram** (not photo-only section)
- [ ] Every visual has exam-caption (PYQ/trap) + source line
- [ ] Topics with no visual PYQ correctly have **no** Exam Visuals section
-->

> **Images disabled:** Do **not** add an `## Exam Visuals` section, do **not** generate maps/diagrams/photos, and do **not** save files under `images/`. Teach location/structure facts in prose and tables only.

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

> This checklist is run **by the AI automatically**. Every item must pass; map failures to §Automatic Fail Conditions (F1–F22).

### Syllabus coverage
- [ ] Every `00_Syllabus.md` bullet for this topic has a dedicated N.X (or N.X.Y) section **(F1)**
- [ ] Header `Covers syllabus` lists all bullets — none missing
- [ ] Internal Phase A map lists **specific concepts** per bullet — not vague labels
- [ ] No orphan sections (content not in syllabus unless Topic 25-type expansion)
- [ ] Topic Boundary Table built — OUT-of-scope concepts listed in Delivery Report

### Content depth
- [ ] Every subtopic has **Definitions** table (where applicable) **(F7)**
- [ ] Every subtopic has **point-wise How It Works bullets** (≥8 substantive points) **(F2)**
- [ ] **History event subtopics** have **Causes** (≥4), **Course Step-by-Step** (≥6), **Results table** (≥4 rows) **(F17–F19)**
- [ ] **Multi-war/event** parent sections split into per-war sub-blocks with full depth each **(F20)**
- [ ] No event subtopic is a thin date/treaty checklist only **(F21)**
- [ ] Every subtopic has **≥1 Exam note** callout **(F7)**
- [ ] No section has **4+ consecutive tables** without prose **(F12)**
- [ ] No "etc." or incomplete enumerated lists **(F4)**
- [ ] Mandatory comparison tables included (if topic covers those concepts)
- [ ] 2025 overlap concepts taught in matching N.X prose **(F5)**
- [ ] Common Trap items synced to Consolidated Reference **(F6)**

<!-- DISABLED — image / Exam Visuals checks
### Exam visuals (History / Art & Culture / Geography)
- [ ] `## Exam Visuals` present only when 1–2 high-ROI visuals exist (see §Exam Visuals Protocol)
- [ ] **All images stored locally** in `images/` — open offline (no remote-URL-only)
- [ ] At least one visual is a **location map or conceptual diagram** (not photo-only)
- [ ] Each visual has exam-caption (PYQ/trap) + source line
- [ ] Visual count ≤2 per topic; no decorative stock photos
-->
- [ ] **No images** — no `## Exam Visuals` section, no generated maps/diagrams/photos, no `images/` assets

### Exam alignment
- [ ] 2025 overlap concepts in matching N.X prose + noted in Delivery Report **(F5)**
- [ ] Practice Zone ≥40% multi-statement **(F8)**
- [ ] Practice Zone answers wrapped in `<details><summary>Show answer</summary>` (hidden until click)
- [ ] Practice count matches topic size (25–50)
- [ ] UPPCS PYQ search run on **all** `pyq/` files (**Prelims 2018–2025 + RO-ARO**) **(F9)**
- [ ] **Every** matching UPPCS/RO-ARO from `pyq/` added to Complete PYQ Bank with full question text **(F9)**
- [ ] PYQ inventory in Delivery Report lists all Q# + year + exam type found — Missing: 0 **(F9)**
- [ ] PYQs mined from `pyq/` — full text inline + PYQ Bank self-test cards with hidden answers **(F9)**
- [ ] **External High-Yield Completeness Protocol** run for matching-heavy topics; Delivery Report External high-yield audit row filled **(F22)**
- [ ] Standard UPSC/UPPCS match titles + known RO-ARO culture hits for this topic present in Quick Revision / Master Match / prose **(F22)**
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
- [ ] **History events:** student can explain cause → course → result → key trap for every war/battle/treaty section without opening another file
- [ ] **Multi-war sections:** student can distinguish treaties/years across wars (e.g. Salbai vs Bassein) using tables in the file

---

## Workflow — One Topic at a Time (strict)

```
Phase A — PRE-AUDIT (before writing)
  Step 1: Read 00_Syllabus.md → list ALL bullets for THIS topic
  Step 2: Read subject Topic 1 gold-standard file → structure **and narrative depth** (History: Carnatic/Anglo-Maratha war section as template)
  Step 3: Read NCERT chapters for this topic → heading list
  Step 4: Run §UPPCS PYQ Search Protocol — grep all `pyq/` (**2018–2025 Prelims + RO-ARO**) → PYQ inventory (Q#, year, exam, §N.X) — **mandatory before writing**
  Step 4b: Run §External High-Yield Completeness Protocol → EXTERNAL HIGH-YIELD INVENTORY (books/poems/novels/authors/match pairs beyond local pyq/) — **mandatory for matching-heavy topics (F22)**
  Step 5: Build Topic Boundary Table (IN / OUT / BRIEF)
  Step 6: Build Syllabus → N.X map + Concept Inventory (merge External High-Yield YES rows)
  Step 7: Draft Syllabus Coverage Map with specific "What must be inside"

Phase B — WRITE
  Step 8: Read existing NN_[Topic].md → preserve good content
  Step 9: Write/restructure ONE topic — all N.X sections, Consolidated Ref, Practice, etc.

Phase C — POST-AUDIT (before presenting)
  Step 10: Run Automatic Fail Conditions F1–F22
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
- @pyq/ (Prelims 2018–2025 + RO-ARO)

Self-verify per prompt.md — I should NOT need to cross-check completeness.
Phase A: boundary table + concept inventory + External High-Yield inventory (F22) before writing.
Phase C: F1–F22 pass + Delivery Report "File ready: YES" (no audit tables in file).
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
- @pyq/ (Prelims 2018–2025 + RO-ARO)

Self-verify per prompt.md — I should NOT need to cross-check completeness.
Phase A: boundary table + concept inventory + External High-Yield inventory (F22) before writing.
Phase C: F1–F22 pass + Delivery Report "File ready: YES" (no audit tables in file).
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

Run **§UPPCS PYQ Search & Addition Protocol** on all `pyq/` files (**UPPCS Prelims 2018–2025 + RO-ARO**). Search for `Subject: Art & Culture`, `Subject: History` (culture overlap), `Subject: Geography` (monument/site matching), and multi-statement questions on dance, music, UNESCO, temples. Add **every** matching UPPCS/RO-ARO to the topic file (inline + Complete PYQ Bank).

**UP Focus (Art & Culture):** Mathura/Vrindavan (Braj culture), Varanasi (classical music, ghats), Lucknow (Kathak, Awadhi), Sarnath (Buddhist art), Agra (Mughal), Khajuraho (UP-adjacent trap), Chunar/Chunar fort crafts, UP folk (Raslila, Nautanki), state museums (Lucknow State Museum, Allahabad Museum).

### Ancient History (in progress)

| Topic | File | Status | Exam Visuals (1–2 max) |
|-------|------|--------|------------------------|
| 1 | `01_Stone_Age.md` | ✅ Complete | Sites location map + Bhimbetka rock-shelter diagram |
| 2 | `02_Indus_Valley_Civilization.md` | ✅ Complete | IVC sites location map |
| 3 | `03_Vedic_Civilization.md` | ✅ Complete | None — concept topic, no visual PYQ |
| 4 | `04_Religious_Movements.md` | ✅ Complete | Buddhist sites location map |
| 5 | `05_Sixth_Century_BCE.md` | ✅ Complete | Mahajanapadas location map |
| 6 | `06_Foreign_Invasions.md` | ✅ Complete | Alexander invasion route map |
| 7 | `07_Mauryan_Empire.md` | ✅ Complete | Mauryan extent & key sites map |
| 8 | `08_Post_Mauryan_India.md` | ✅ Complete | Foreign invasion sequence diagram |
| 9 | `09_Gupta_Age.md` | ✅ Complete | Gupta extent & key sites map |
| 10 | `10_Post_Gupta_Period.md` | ✅ Complete | Harsha empire extent map |
| 11 | `11_Ancient_Indian_Administration.md` | ✅ Complete | Admin comparison + ruler-inscription chart |
| 12 | `12_Ancient_Indian_Economy.md` | ✅ Complete | Trade routes/ports map + coins chart |
| 13 | `13_Archaeology.md` | ✅ Complete | UP sites map + stratigraphy/C-14 diagram |
| 14 | `14_Ancient_India_Miscellaneous.md` | ✅ Complete | World civilizations chart + Kakatiya sites map |

<!-- DISABLED — image generation
**Visual priority for Ancient History:** (1) **location maps** for site/capital matching, (2) **conceptual diagrams** for structure/chronology, (3) labelled sketches only when PYQ demands artefact ID. All files in `images/` — must open offline.
-->
**Images disabled:** Cover site/capital matching and structure/chronology in prose and tables only — do not generate or attach image files.

### Modern India (in progress)

| Topic | File | Status | Depth reference |
|-------|------|--------|-----------------|
| 1 | `01_Advent_of_Europeans.md` | ✅ Student-approved | Carnatic Wars §1.13–1.15 = gold standard for war depth |
| 2 | `02_East_India_Company_Expansion.md` | ✅ Expanded | Anglo-Maratha §2.10, Anglo-Mysore §2.9 = multi-war sub-block pattern |

**Depth rule for Modern India:** Every war/battle/treaty/rebellion/annexation section must match §History Event Depth Protocol. Multi-war syllabus bullets **must** use `N.X.1`, `N.X.2`, … sub-blocks. Topic 2 thin-draft failure is the canonical anti-pattern — do not repeat.

**PYQ mining (Modern India):** Run §UPPCS PYQ Search & Addition Protocol on all `pyq/` files. Search `Subject: History`, treaty-year matching, battle chronology, Governor-General matching, Dalhousie/Wellesley/Hastings traps.

**External high-yield (Modern India — F22):** For Topic 10 (Books & Authors) and any literature/culture bullet, also run §External High-Yield Completeness Protocol. Canonical miss to never repeat: **Firangiya → Manoranjan Prasad Sinha (RO-ARO 2021)** when `pyq/ro-aro/` is empty. Also lock standard freedom-struggle match titles (Bose, Savarkar, Prasad *India Divided*, Bhagat Singh, Neel Darpan, Curzon/Hardinge GG books, Batohiya, Bidesiya, Heera Dom) into Quick Revision + Master Match even if absent from local Prelims `pyq/`.

**UP Focus (Modern India):** Prayagraj/Akbar Fort, Banaras/Chait Singh, Awadh annexation, Jhansi/Lapse, UP 1857 centres (Kanpur, Lucknow, Meerut link), Gorakhpur/Chunar fort.

### Future subjects

1. Create `00_Syllabus.md` with every exam subtopic as bullets *(Art & Culture — done)*
2. Link to this `prompt.md`
3. One topic file per `##` heading in syllabus
4. One topic at a time; student approval between topics
5. Mark subject complete only when all topic files pass Quality Checklist

---
