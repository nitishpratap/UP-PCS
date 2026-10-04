#!/usr/bin/env python3
"""Upgrade Geography Topics 10–13 consolidated + revision twins."""

from __future__ import annotations

from _upgrade_geo_batch2_lib import apply_chapter

# ── Topic 10 ────────────────────────────────────────────────────────────────
FACTS_10 = [
    "Scheduled Tribe lists are **state-wise** under **Article 342**. Parliament amends the lists by law. A community listed in one State need not be listed in another.",
    "STs are about **8.6%** of India’s population (Census 2011). Among the largest groups are **Bhil, Gond and Santhal**. **Madhya Pradesh** often leads in absolute ST population.",
    "**Lokur Committee** criteria for ST listing include primitive traits, distinctive culture, geographical isolation, shyness of contact, and economic backwardness.",
    "There are **75 Particularly Vulnerable Tribal Groups (PVTGs)** (Dhebar PTG renamed PVTG in **2006**). **Odisha** has the most PVTG communities. **PM-JANMAN** is the main outreach mission.",
    "PVTG criteria stress pre-agricultural technology, stagnant or declining population, extremely low literacy, and a subsistence economy.",
    "The **Fifth Schedule** covers Scheduled Areas in many States. The **Sixth Schedule** covers autonomous councils in **Assam, Meghalaya, Tripura and Mizoram** only.",
    "State–tribe pairs: **Angami / Rengma = Nagaland**; **Toda / Paliyan = Tamil Nadu**; **Birhor = Jharkhand**; **Khasi = Meghalaya** (not Arunachal); **Yanadi = Andhra Pradesh**; **Chenchu = Andhra / Telangana**.",
    "**Kuki** is a North-East tribe and is **not** a Uttar Pradesh Scheduled Tribe. **Bodo = Assam**; **Lepcha = Sikkim**; **Meena = Rajasthan**; **Warli = Maharashtra**; **Apatani = Arunachal**.",
    "**Khasi and Garo** of Meghalaya are classic **matrilineal** societies.",
    "Uttar Pradesh has **15** notified ST entries. The classic five are **Tharu, Bhotia, Buksa, Jaunsari and Raji**. UP PVTGs are **Buksa and Raji**.",
    "In Uttar Pradesh, **Tharu** live in the **Terai**; **Buksa** on the Bijnor fringe; **Saharya** in **Lalitpur**; **Agariya** are linked to **iron smelting** in the Sonbhadra–Mirzapur belt.",
    "After the **2003** Act, many UP ST notifications are **district-limited**. Two clusters matter: Terai north versus Vindhyan / Sonbhadra south.",
    "Central Indian heartland tribes include **Gond** (with Maria/Muria), **Bhil**, Baiga, Kol, Korku, Sahariya, Halba, Warli and Meena.",
    "Jharkhand core tribes include **Santhal, Munda, Oraon**, Ho, Kharia, Birhor, Bhumij, Asur and **Birjia**. Birjia is **not** an Andaman tribe.",
    "Santhali uses the **Ol Chiki** script. **Birsa Munda** and the **Hul of 1855** are classic pairs. **Janjatiya Gaurav Diwas** is **15 November** (Birsa’s birth anniversary).",
    "Andaman **Negrito** natives are Great Andamanese, **Onge**, **Jarawa** and **Sentinelese** (North Sentinel Island). Nicobar **Mongoloid** groups are Nicobarese and **Shompen** (Great Nicobar PVTG).",
    "World habitat pairs: **Bushman = Kalahari**; **Eskimo = northern Canada**; **Pygmy = Congo**; **Masai = East Africa** (not West Africa); **Ainu = Japan**; **Punan = Borneo**; Lapps/Sami = Sweden–Finland.",
    "Also: **Semang = Malaysia** (not Indonesia); Bedouin = Arabia; **Kirghiz = Central Asia** (not Sudan); **Maori = New Zealand**; **Zulu = South Africa**; Bantu ≠ Sahara.",
    "**Transhumance** = seasonal valley–mountain herding. Gypsies’ original home in the usual teaching line = **India**. Cro-Magnon is the most recent among classic fossil-human options.",
    "**Koryak** live in north-east Siberia, not Alaska. **Rengma** is a Nagaland tribe, not an Andaman island tribe.",
    "**IMD** headquarters is New Delhi (**1875**). **ICAR** headquarters is New Delhi (**1929**). **IARI** is at **Pusa, New Delhi** — it is not the apex ICAR council itself.",
    "**FRI** and **ICFRE** are at **Dehradun**. **WII** is also Dehradun but is not the FRI answer. **NDRI** is at **Karnal**. **IVRI** is at **Izatnagar, Bareilly (UP)**.",
    "**NDDB** is at **Anand** and ran **Operation Flood** — it is not NDRI. **IIHR** is at Bengaluru. **CISH** is at Lucknow. **CSAUAT** is at Kanpur. **Pantnagar** is the first State Agricultural University tradition.",
    "The **Forest Rights Act** is **2006**. It recognises individual and community forest rights. **Adi Karmayogi** (June 2025) is a **Ministry of Tribal Affairs** programme.",
    "Main tribal belts are the North-Eastern hills, the central Indian plateau, western Bhil country, and the Andaman–Nicobar isolates.",
    "Krishi Vigyan Kendras (KVKs) are the frontline **extension** arms under the ICAR system.",
    "**PESA, 1996** extends panchayat provisions to Fifth Schedule areas with special gram-sabha powers over land, minor forest produce and local resources.",
    "**TRIFED** markets tribal products; **Van Dhan Vikas** clusters support value-addition of minor forest produce under MoTA / TRIFED framing.",
    "**Eklavya Model Residential Schools (EMRS)** are the flagship residential schooling network for ST students under the Ministry of Tribal Affairs.",
    "Odisha PVTG names often asked include **Dongria Kondh, Bonda, Juang and Lodha**. Do not park Birjia among Andaman Negrito groups.",
    "**Sentinelese** remain largely isolated on North Sentinel Island; **Jarawa** inhabit the Andaman trunk-road belt — do not treat them as Nicobar Mongoloid groups.",
    "Gond country spans **Madhya Pradesh–Chhattisgarh–Maharashtra–Odisha** belts; Bhil country is strongest in **Rajasthan–Gujarat–MP–Maharashtra**.",
    "**Article 275(1)** grants provide special Central assistance for Scheduled Tribes / Scheduled Areas welfare schemes.",
    "Sixth Schedule autonomous councils (e.g. Bodo / BTC framing) sit only in the four NE States named above — Fifth Schedule States do not get Sixth Schedule councils by default.",
    "**Keria / Kharia** map to **Odisha** (Kharia also Jharkhand). Do not park them as western-desert tribes.",
    "Institute traps: **NDRI = Karnal dairy research**; **NDDB = Anand cooperative board**; **IVRI = Izatnagar veterinary**; **FRI = Dehradun forestry**.",
    "World habitat extras: **Masai = East Africa**; **Ainu = Japan**; **Punan = Borneo**; Lapps / Sami = Sweden–Finland; **Maori = New Zealand**; **Zulu = South Africa**.",
    "**CMFRI** is classically linked to Kochi fisheries research; do not confuse it with FRI Dehradun or IARI Pusa.",
    "Primitive traits + isolation + distinctive culture remain the Lokur spine; economic backwardness alone does **not** make a community ST.",
    "UP ST desk: **15** entries, classic five, PVTGs **Buksa + Raji**, Tharu–Terai / Saharya–Lalitpur / Agariya–iron — keep district-limited notifications after 2003 in mind.",
    "Andaman Negrito set = Great Andamanese, Onge, Jarawa, Sentinelese; Nicobar Mongoloid set = Nicobarese + **Shompen** — **Rengma** is never in either island set.",
    "IMD’s **150-year** anniversary note still keeps headquarters at **New Delhi**; do not move IMD HQ to Pune or Lucknow in institute stems.",
    "**Ministry of Tribal Affairs** (not Social Justice / AYUSH) is the nodal ministry for PM-JANMAN and Adi Karmayogi framing.",
    "Santhal **Hul (1855)** and Birsa’s anti-colonial resistance are separate Jharkhand identity anchors — Janjatiya Gaurav Diwas marks Birsa’s birth, not the Hul date.",
    "Matriliny fact: Khasi–Garo of Meghalaya; do not extend that tag blindly to all North-East tribes.",
]

QUIZ_10 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
With reference to Scheduled Tribes in India, which of the following statements is/are correct?

1. ST lists are state-wise under Article 342.
2. A community listed as ST in one State is automatically ST in every other State.
3. STs were about 8.6% of India’s population in Census 2011.

A. 1 and 2
B. Only 3
C. 1 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: C.** Statements 1 and 3 are correct.

**Logic:** ST lists are state-specific; listing in one State does not travel automatically to another.

</details>

**Q2.**
Which State has the largest number of Particularly Vulnerable Tribal Groups (PVTGs)?

A. Madhya Pradesh
B. Jharkhand
C. Odisha
D. Chhattisgarh

<details>
<summary>Show answer</summary>

**Ans: C.** Odisha has the most PVTG communities among States.

**Logic:** National PVTG count is **75**; Odisha leads the State tally.

</details>

**Q3.**
Consider the following pairs:

1. Angami — Nagaland
2. Toda — Tamil Nadu
3. Khasi — Arunachal Pradesh
4. Birhor — Jharkhand

Which of the pairs given above is/are correctly matched?

A. 1, 2 and 4
B. Only 3
C. 2 and 3
D. 1 and 3

<details>
<summary>Show answer</summary>

**Ans: A.** Pairs 1, 2 and 4 are correct.

**Logic:** Khasi = **Meghalaya**, not Arunachal. That is the classic swap trap.

</details>

**Q4.**
Assertion (A): The Sixth Schedule applies to Assam, Meghalaya, Tripura and Mizoram.
Reason (R): The Fifth Schedule covers Scheduled Areas in many States outside that four-State set.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: A.** Both are true, but R describes a different schedule rather than explaining why Sixth Schedule is limited to four States.

**A/R logic:** A and R are both standard facts; R does not cause A.

</details>

**Q5.**
Which of the following is/are Uttar Pradesh PVTGs?

1. Buksa
2. Raji
3. Tharu

A. Only 1
B. 1 and 2
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: B.** UP PVTGs are **Buksa and Raji**.

**Logic:** Tharu is a classic UP ST but not the PVTG pair in the usual teaching set.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Tribe) | List-II (Association) |
|---|---|
| 1. Masai | A. East Africa |
| 2. Semang | B. Malaysia |
| 3. Koryak | C. NE Siberia |
| 4. Punan | D. Borneo |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Masai–East Africa; Semang–Malaysia; Koryak–NE Siberia; Punan–Borneo.

**Logic:** Row order is not the answer code. Common traps are Masai–West Africa and Koryak–Alaska.

</details>

**Q7.**
NDRI and NDDB are correctly distinguished as:

A. NDRI — Anand cooperative board; NDDB — Karnal dairy lab
B. NDRI — Karnal dairy research; NDDB — Anand cooperative board
C. Both are at Karnal
D. Both are at Anand

<details>
<summary>Show answer</summary>

**Ans: B.** NDRI is the Karnal lab; NDDB is the Anand board behind Operation Flood.

**Logic:** Swapping Karnal and Anand is the standard institute trap.

</details>

**Q8.**
With reference to Andaman and Nicobar tribes, which of the following statements is/are correct?

1. Sentinelese are a Negrito Andaman group.
2. Shompen are a Nicobar Mongoloid PVTG.
3. Rengma is an Andaman Negrito tribe.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Rengma = **Nagaland**, not an island tribe.

</details>

**Q9.**
Janjatiya Gaurav Diwas is observed on:

A. 15 August
B. 15 November
C. 26 January
D. 2 October

<details>
<summary>Show answer</summary>

**Ans: B.** It marks **Birsa Munda’s** birth anniversary on **15 November**.

**Logic:** Do not confuse with Hul (1855) or Independence Day.

</details>

**Q10.**
Which one of the following pairs is NOT correctly matched?

A. FRI — Dehradun
B. IVRI — Izatnagar, Bareilly
C. IARI — Pusa, New Delhi
D. CISH — Kanpur

<details>
<summary>Show answer</summary>

**Ans: D.** CISH is at **Lucknow**; CSAUAT is the Kanpur agricultural university tag.

**Logic:** Lucknow vs Kanpur institute swap is frequent.

</details>

**Q11.**
Consider the following statements about PESA:

1. PESA was enacted in 1996.
2. It extends panchayat provisions to Fifth Schedule areas.
3. It applies automatically to all Sixth Schedule States as their only tribal law.

A. Only 1
B. 1 and 2
C. 2 and 3
D. Only 2

<details>
<summary>Show answer</summary>

**Ans: B.** Statements 1 and 2 are correct.

**Logic:** Sixth Schedule States have a separate autonomous-council framework; PESA is the Fifth Schedule extension.

</details>

**Q12.**
Which of the following UP tribe–habitat pairs is/are correctly matched?

1. Tharu — Terai
2. Saharya — Lalitpur
3. Agariya — iron smelting in Sonbhadra–Mirzapur belt

A. Only 1
B. 1 and 2
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three pairs are correct.

**Logic:** These are the standard UP ST geography associations.

</details>

**Q13.**
Assertion (A): Khasi and Garo societies of Meghalaya are often cited as matrilineal.
Reason (R): All North-East tribes follow matriliny as a constitutional rule.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** Matriliny is a Khasi–Garo teaching tag, not a blanket NE rule.

</details>

**Q14.**
The Forest Rights Act was enacted in:

A. 1996
B. 2002
C. 2006
D. 2013

<details>
<summary>Show answer</summary>

**Ans: C.** The Forest Rights Act is **2006**.

**Logic:** Do not confuse with PESA 1996.

</details>

**Q15.**
Which one of the following is NOT a Sixth Schedule State?

A. Assam
B. Meghalaya
C. Nagaland
D. Mizoram

<details>
<summary>Show answer</summary>

**Ans: C.** Sixth Schedule covers Assam, Meghalaya, Tripura and Mizoram — **not Nagaland**.

**Logic:** Nagaland has special constitutional arrangements but is not in the four-State Sixth Schedule list.

</details>

**Q16.**
With reference to tribal institutes, which of the following is/are correct?

1. IMD headquarters is New Delhi.
2. ICAR headquarters is New Delhi.
3. WII and FRI are both at Dehradun, so WII is the correct FRI answer in institute stems.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Both sit in Dehradun, but FRI/ICFRE is the forestry answer; WII is wildlife — do not swap.

</details>

**Q17.**
Kuki is correctly placed as:

A. A Uttar Pradesh Scheduled Tribe
B. A North-East tribe (not a UP ST)
C. An Andaman Negrito group
D. A Nicobar Mongoloid group

<details>
<summary>Show answer</summary>

**Ans: B.** Kuki is North-East; it is **not** a UP ST entry.

**Logic:** UP ST traps often plant NE names into the State list.

</details>

**Q18.**
Arrange the following in the correct chronological order:

1. Santhal Hul
2. PESA
3. Forest Rights Act

A. 1–2–3
B. 2–1–3
C. 1–3–2
D. 3–2–1

<details>
<summary>Show answer</summary>

**Ans: A.** Hul **1855** → PESA **1996** → FRA **2006**.

**Logic:** Nineteenth-century Hul precedes the 1990s–2000s statute cluster.

</details>

**Q19.**
Which of the following statements about PM-JANMAN is correct?

A. It is a Ministry of AYUSH mission for tribal medicine only
B. It is the main PVTG outreach mission under tribal-affairs framing
C. It replaces Article 342 list-making
D. It applies only to Andaman tribes

<details>
<summary>Show answer</summary>

**Ans: B.** PM-JANMAN is the living PVTG outreach mission (housing, health, education, connectivity).

**Logic:** Ministry trap is Social Justice / AYUSH; list-making stays with Article 342.

</details>

**Q20.**
Which one of the following pairs is correctly matched?

A. Bushman — Congo Basin
B. Pygmy — Kalahari
C. Eskimo — northern Canada
D. Masai — West Africa

<details>
<summary>Show answer</summary>

**Ans: C.** Eskimo = northern Canada in the usual habitat set.

**Logic:** Bushman–Kalahari, Pygmy–Congo, Masai–East Africa are the other correct pairs; options A/B/D swap them.

</details>
'''

# ── Topic 11 ────────────────────────────────────────────────────────────────
FACTS_11 = [
    "India’s first non-synchronous census was in **1872** (some papers key **1871**). The first **synchronous** all-India census was in **1881**.",
    "**1921** is the **Great Divide** year of Indian census history. **2011** was the **15th** census and the **7th** after Independence.",
    "Census 2011 India population was about **121.09 crore**. Decadal growth **2001–11** was **17.64%** (often rounded **17.7%**).",
    "Arithmetic density is **population / total area**. India’s 2011 arithmetic density is **382** persons per km².",
    "Physiological density is **population / net sown area**. Agricultural density is **agricultural population / net sown area**. Do not swap these three density types.",
    "Among States, **Bihar** has the highest density (**1106**). **Arunachal Pradesh** has the lowest State density (**17**). Uttar Pradesh is **829**. Delhi UT is very dense but is not a “lowest density State” answer.",
    "Core 2011 figures: sex ratio **943**, child sex ratio **919**, literacy **74.04%** (age **7+**), urban share **31.16%**. SC ~**16.6%**; ST ~**8.6%**.",
    "**Uttar Pradesh** is the most populous State and has the largest rural population. **Sikkim** is the least populous State. **Nagaland** showed negative growth in 2001–11.",
    "Highest State sex ratio is **Kerala**. Among States in the usual 2011 set, lowest sex ratio is **Haryana**. Lowest child sex ratio (rural + urban) is also **Haryana**.",
    "Literacy is highest in **Kerala** and lowest among States in **Bihar**. In Uttar Pradesh, **Shrawasti** has the lowest female literacy among districts.",
    "Absolute growth is **P₂ − P₁**. Growth rate is the percentage change. **Natural growth = CBR − CDR**. Induced change comes from **migration**.",
    "Replacement-level **TFR is 2.1** children per woman, not “per thousand”. NFHS-4 reported **2.2**; NFHS-5 reports about **2.0**.",
    "The National Population Policy **2000** aimed at population stability by **2045**. World Population Day is **11 July**. The World Population Report is associated with **UNFPA**.",
    "The demographic dividend window is the large share of working ages **15–59**, not 60+ or 0–6. Dependency compares young plus aged with workers.",
    "Urbanisation acceleration in the classic curve is linked to the **second stage** of demographic transition. Among religions, **Jains** are the most urbanised.",
    "Demographic Transition Theory is linked to **Thompson** (with **Notestein**). Optimum population is linked to **Edwin Cannan**. Social mal-adjustment is linked to **Henry George**.",
    "Malthus argued population grows **geometrically** while food grows **arithmetically**. Positive checks raise deaths; preventive checks lower births. **Karl Marx** criticised Malthus; **Ester Boserup** stressed agricultural intensification.",
    "The largest internal migration stream is **rural → rural**. Female migration is often for marriage; male migration is often for work. **Immigration** = in; **emigration** = out.",
    "Push factors drive people from the origin; pull factors attract them to the destination. Out-migration sources are often Uttar Pradesh–Bihar; destinations are often Maharashtra–Delhi–Gujarat.",
    "A **census town** needs population **≥5,000**, density **≥400/km²**, and **≥75%** of **male main workers** in non-agriculture.",
    "Census 2011 listed **53** million-plus urban agglomerations. Kanpur crossed the million mark in **1971**; Lucknow in **1981**. 2011 UP UA order is **Kanpur > Lucknow > Ghaziabad > Agra**.",
    "Uttar Pradesh district facts (2011): **Prayagraj** most populous; **Ghaziabad** densest; **Jaunpur** among higher sex-ratio districts; **Shrawasti** lowest female literacy.",
    "Uttar Pradesh holds about **16.5%** of India’s population. Rural share ~**77.7%** vs India **68.84%**. Urban share ~**22.3%** vs India **31.16%**. State sex ratio **912** vs India **943**. Literacy ~**67.7%** vs India **74.04%**.",
    "Crowded belts are the Ganga plain and coasts. Sparse belts are the Himalaya, North-East hills, Thar and dry interior pockets.",
    "Keep **Census 2011** numbers until **Census 2027** results replace them. UN estimates that India became most populous around **2023** do not rewrite the 2011 tables.",
    "A broad-base population pyramid signals high fertility. Ageing shows earlier in southern States than in the high-fertility northern belt.",
    "Occupational structure is taught as primary / secondary / tertiary. Primary still takes a large share of India’s workforce, with a slow shift toward secondary and tertiary.",
    "**CBR** and **CDR** are expressed **per thousand** of population; **TFR** is children **per woman**. Do not mix the units.",
    "Demographic Transition stages: high birth–high death → falling death (boom) → falling birth → low birth–low death.",
    "Age structure teaching bands are often **0–14**, **15–59** (workers) and **60+**.",
    "**Lorenz curve** is used for **income inequality**, not literacy or sex ratio.",
    "**Social capillarity** is linked to **Arsène Dumont** — aspiration and smaller families — distinct from Henry George’s social mal-adjustment tag.",
    "Literacy in Census 2011 is counted for age **7+**. Do not swap with school-enrolment rates or 0–6 literacy claims.",
    "Physiological density rises when net sown area is scarce relative to population — useful for comparing pressure on farmland across States.",
    "Million-city / UA stems use the **2011** Mumbai > Delhi > Kolkata order; the **2001** Mumbai > Kolkata > Delhi order is a trap.",
    "Sex ratio improved from **933 (2001)** to **943 (2011)**; child sex ratio worsened from **927** to **919** — keep the opposite directions.",
    "Highest urban % among States in the usual set is **Goa**; lowest urban % among large teaching States often points to **Himachal Pradesh**.",
    "SC absolute leader is **Uttar Pradesh**; SC proportion leader is often **Punjab**. ST absolute leader is **Madhya Pradesh**; ST proportion leaders include **Lakshadweep / Mizoram**.",
    "Natural increase can be high even when migration is low; induced change can reshape city growth without a high CBR–CDR gap.",
    "World Population Day (**11 July**) and UNFPA’s World Population Report are the usual international anchors — not IMF or WHO as the report house.",
    "Replacement fertility **2.1** is the long-run stationarity bench; NFHS-5 ~**2.0** means India is near/below replacement in the survey, while Census 2011 still frames older stems.",
    "Dependency ratio rises when the share of children and aged grows relative to **15–59** workers — the dividend fades as ageing advances.",
    "Rural→urban migration is highly visible in metros, but **rural→rural** remains the largest internal stream in Census teaching.",
    "Distribution factors include terrain, climate, soil, water, minerals, industry, transport and history — not density alone.",
    "Census town ≠ always a municipality; statutory town and census town are separate urban doors into the urban count.",
]

QUIZ_11 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
With reference to the Census of India, which of the following statements is/are correct?

1. The first synchronous all-India census was in 1881.
2. 1921 is called the Great Divide year.
3. Census 2011 was the 14th census of India.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** 2011 was the **15th** census and the **7th** after Independence.

</details>

**Q2.**
India’s arithmetic population density in Census 2011 was:

A. 324 persons/km²
B. 382 persons/km²
C. 829 persons/km²
D. 1106 persons/km²

<details>
<summary>Show answer</summary>

**Ans: B.** National arithmetic density = **382**/km².

**Logic:** 324 echoes 2001; 829 is UP; 1106 is Bihar.

</details>

**Q3.**
Which of the following density definitions is/are correct?

1. Arithmetic density = population / total area
2. Physiological density = agricultural population / net sown area
3. Agricultural density = population / net sown area

A. Only 1
B. 1 and 2
C. 2 and 3
D. Only 2

<details>
<summary>Show answer</summary>

**Ans: A.** Only statement 1 is correct.

**Logic:** Physiological = population / net sown; agricultural = agricultural population / net sown. Statements 2 and 3 are swapped.

</details>

**Q4.**
Assertion (A): Natural growth of population equals CBR minus CDR.
Reason (R): TFR is also expressed per thousand of population like CBR.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** TFR is children **per woman**, not per thousand.

</details>

**Q5.**
Among Indian States in Census 2011, the highest population density is in:

A. West Bengal
B. Uttar Pradesh
C. Bihar
D. Kerala

<details>
<summary>Show answer</summary>

**Ans: C.** Bihar (**1106**) leads State density.

**Logic:** WB and Kerala are high but below Bihar; UP is 829.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Concept) | List-II (Name) |
|---|---|
| 1. Demographic Transition | A. Thompson / Notestein |
| 2. Optimum population | B. Edwin Cannan |
| 3. Social mal-adjustment | C. Henry George |
| 4. Social capillarity | D. Arsène Dumont |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Standard theory–name pairs.

**Logic:** Row order is not the answer code. Cannan vs George vs Dumont is the trap cluster.

</details>

**Q7.**
Which one of the following is the largest internal migration stream in India?

A. Rural → urban
B. Urban → urban
C. Rural → rural
D. Urban → rural

<details>
<summary>Show answer</summary>

**Ans: C.** **Rural → rural** is the largest internal stream.

**Logic:** Rural→urban is visible in metros but not the largest stream.

</details>

**Q8.**
With reference to Census 2011, which of the following statements is/are correct?

1. Sex ratio was 943.
2. Child sex ratio was 919.
3. Literacy rate was counted for age 18+.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Literacy is for age **7+**, not 18+.

</details>

**Q9.**
The National Population Policy 2000 aimed at population stability by:

A. 2025
B. 2030
C. 2045
D. 2050

<details>
<summary>Show answer</summary>

**Ans: C.** Stability target year is **2045**.

**Logic:** Do not confuse with SDG 2030 horizons.

</details>

**Q10.**
Which religion is the most urbanised in the usual Census teaching set?

A. Hindus
B. Muslims
C. Christians
D. Jains

<details>
<summary>Show answer</summary>

**Ans: D.** **Jains** are the most urbanised.

**Logic:** Christian urban share is high but Jains lead the classic key.

</details>

**Q11.**
Consider the following statements:

1. Bihar has the lowest State literacy in the usual 2011 set.
2. Kerala has the highest State sex ratio.
3. Arunachal Pradesh has the lowest State density.

A. 1 and 2
B. Only 3
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three are correct.

**Logic:** These are the standard State extreme tags for 2011.

</details>

**Q12.**
A census town must satisfy which of the following?

A. Population ≥10,000 only
B. Population ≥5,000; density ≥400/km²; ≥75% male main workers in non-agriculture
C. Presence of a municipality only
D. Population ≥1 lakh

<details>
<summary>Show answer</summary>

**Ans: B.** The triple test is 5,000 + 400/km² + 75% non-agri male main workers.

**Logic:** Municipality is for statutory towns, not the census-town definition.

</details>

**Q13.**
Assertion (A): Demographic dividend is linked to a large share of population in ages 15–59.
Reason (R): Dependency ratio compares young and aged dependants with the working-age group.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: D.** Both are true and R explains why the 15–59 bulge matters.

**A/R logic:** Dividend = workers; dependency framing is the mirror concept.

</details>

**Q14.**
Which one of the following pairs is NOT correctly matched?

A. Kanpur million mark — 1971
B. Lucknow million mark — 1981
C. Lorenz curve — income inequality
D. World Population Report — IMF

<details>
<summary>Show answer</summary>

**Ans: D.** World Population Report is linked to **UNFPA**, not IMF.

**Logic:** A–C are standard correct pairs.

</details>

**Q15.**
Malthus’s positive checks and preventive checks are correctly distinguished as:

A. Positive = lower births; preventive = higher deaths
B. Positive = higher deaths; preventive = lower births
C. Both only raise deaths
D. Both only lower births

<details>
<summary>Show answer</summary>

**Ans: B.** Positive checks raise mortality; preventive checks reduce fertility.

**Logic:** Swap of the two check types is the classic trap.

</details>

**Q16.**
With reference to Uttar Pradesh (Census 2011), which of the following is/are correct?

1. State sex ratio was 912.
2. Ghaziabad was the densest district.
3. Shrawasti had the lowest female literacy among districts.

A. Only 1
B. 1 and 2
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three are correct.

**Logic:** UP vs India gaps (912 vs 943; literacy ~67.7% vs 74%) often sit beside district extremes.

</details>

**Q17.**
Urbanisation acceleration in the classic demographic-transition curve is linked mainly to the:

A. First stage
B. Second stage
C. Fourth stage
D. Post-transition only

<details>
<summary>Show answer</summary>

**Ans: B.** Acceleration is classically linked to the **second** stage.

**Logic:** Stage-3/4 keys are common distractors.

</details>

**Q18.**
Which of the following statements is/are correct?

1. Sex ratio improved from 2001 to 2011.
2. Child sex ratio improved from 2001 to 2011.
3. Literacy rate in 2011 was 74.04%.

A. 1 and 3
B. Only 2
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 3 are correct.

**Logic:** CSR fell from **927 to 919** — opposite direction from overall sex ratio.

</details>

**Q19.**
Which State showed negative decadal growth in 2001–11?

A. Kerala
B. Goa
C. Nagaland
D. Sikkim

<details>
<summary>Show answer</summary>

**Ans: C.** **Nagaland** recorded negative growth (−0.6%).

**Logic:** Kerala/Goa are low-growth, not negative; Sikkim is least populous, not negative-growth.

</details>

**Q20.**
Replacement-level fertility is:

A. TFR 2.1 children per woman
B. CBR 2.1 per thousand
C. TFR 2.1 per thousand
D. CDR 2.1 per thousand

<details>
<summary>Show answer</summary>

**Ans: A.** Replacement TFR ≈ **2.1 children per woman**.

**Logic:** “Per thousand” wording belongs to CBR/CDR, not TFR.

</details>
'''

# Topic 12 and 13 continue in same file...
FACTS_12 = [
    "Human geography studies the **man–environment relationship** and the spatial patterns of human life, settlements and economy.",
    "**Environmental determinism** (Ratzel / Semple) says nature controls culture. **Possibilism** (Vidal de la Blache) says humans choose among nature’s options. **Neo-determinism** (Griffith Taylor) is stop-and-go determinism.",
    "**Site** is the local ground of a settlement. **Situation** is its wider regional location relative to routes, resources and other places.",
    "A **census town** needs population **≥5,000**, density **≥400/km²**, and **≥75%** of **male main workers** in non-agriculture. It need not be a municipality.",
    "Rural settlements lean on primary activities and lower density. Urban places are statutory towns or census towns.",
    "Village types are **clustered / nucleated**, **semi-clustered**, **hamleted** and **dispersed**. Clustered villages appear on plains, around Rajasthan water points, and for defence in Bundelkhand / Nagaland — do **not** call the Thar “dispersed by default.”",
    "Dispersed villages typify **Meghalaya, Uttarakhand, Himachal Pradesh, Kerala** and many North-East forest–hill tracts.",
    "Hamlet local names include **panna, para, palli, nagla and dhani**. Semi-clustered villages often show a dominant-caste centre with lower strata on the flanks (Gujarat / Rajasthan).",
    "Linear villages follow a road, river, canal or coast. Circular / radial sketches appear around tanks or forts in coaching diagrams.",
    "Town functions are classed by the **dominant** job: administrative, industrial, transport, commercial, mining, garrison, educational, religious or tourist.",
    "Class I towns have **≥1 lakh** people (468 towns in 2011 held about **60%** of urban population). Classes II–VI step down from 50–99 thousand to under 5 thousand.",
    "In the standard Indian size ladder, metropolitan cities are **10 lakh–50 lakh** and mega cities are **above 50 lakh** — **six** in 2011. A UN megacity is **≥1 crore**.",
    "2011 million-plus UA rank starts **Mumbai > Delhi > Kolkata > Chennai > Bengaluru > Hyderabad**. There were **53** million-plus UAs. The **2001** order Mumbai > Kolkata > Delhi is a trap.",
    "An urban agglomeration can be a town with outgrowths, two contiguous towns, or a city with adjoining towns and outgrowths. Outgrowths include railway colonies, campuses, ports and cantonments.",
    "Settlement evolution pairs: ancient **Varanasi / Prayag / Madurai**; medieval **Delhi / Agra / Jaipur / Lucknow**; modern planned **Chandigarh** (Le Corbusier). Satellite towns include Ghaziabad.",
    "The **Smart Cities Mission** launched on **25 June 2015** for **100** cities under **MoHUA**, implemented through an SPV. ABD means area-based development plus pan-city ICT.",
    "Uttar Pradesh’s **Central / Mission** Smart City list is **10**: Lucknow, Kanpur, Prayagraj, Agra, Varanasi, Aligarh, Bareilly, Jhansi, Moradabad and Saharanpur. **Ghaziabad is not** in that Central-10.",
    "Uttar Pradesh’s **State Smart Cities (2019)** are seven Nagar Nigams (including Ghaziabad, Meerut, Gorakhpur, Mathura, Ayodhya, Firozabad, Shahjahanpur). State list does not rewrite Mission-100 keys.",
    "ISAC-2020 theme pairs: Culture **Indore**, Governance **Vadodara**, Social **Tirupati**, Urban environment **Bhopal**. Best State award went to **Uttar Pradesh**.",
    "**HRIDAY** covers **12** heritage cities. In Uttar Pradesh the pair is **Varanasi and Mathura** — not Prayagraj or Ayodhya.",
    "**SPMRM (Rurban)** was **launched on 21 February 2016** (Cabinet approval 2015). It is under **MoRD**, not MoHUA.",
    "**Rurbanization** is linked to sociologist **G.S. Ghurye**. McLuhan’s **Global Village** rests on **transport plus communication**.",
    "Scheme chronology: **JNNURM 2005** → Urban Housing Policy **2007** → **AMRUT June 2015** → **Jal Jeevan Mission 2019**. **AMRUT 2.0** is **1 October 2021**. **SAGY** is **2014**.",
    "Smart Cities = **MoHUA**; smart village / Rurban = **MoRD**. Keep the ministries separate.",
    "**Bhopal** is the classic “not on a major river bank” city trap against Agra, Patna or Kolkata.",
    "NCR slice of Uttar Pradesh includes Ghaziabad, Noida, Greater Noida and Meerut in the urban–industrial belt.",
    "Economic activities: **primary** (farming, mining, fishing), **secondary** (manufacturing), **tertiary** (services), with **quaternary** for knowledge / R&D.",
    "Approaches in human geography coaching sets include welfare, behavioural, radical and humanistic lenses on spatial problems.",
    "**Primate city** means one city dominates the urban system far above the second city; **rank-size** expects a more regular step-down of city sizes.",
    "Rural settlements lean on primary work and lower density; urban places are **statutory towns** or **census towns**.",
    "Functional town tags stay classed by the **dominant** job — a transport town may also trade, but the leading function decides the label.",
    "Planned modern city classic = **Chandigarh** (Le Corbusier). Do not park Lucknow or Jaipur as the Le Corbusier planned-city key.",
    "Smart Cities Mission timeline extension note (works to **31 Mar 2025**) does not change the **100 cities / 25 June 2015** launch facts.",
    "PMAY-U shares the **25 June 2015** launch day with Smart Cities — useful chronology glue with AMRUT (also June 2015).",
    "Hamleted villages break the main settlement into secondary units; they remain a **rural** pattern, not a census-town category.",
    "Dispersed settlement is hill/forest/high-rainfall logic (Meghalaya–UK–HP–Kerala), not the default Thar tag.",
    "Clustered settlement on the Ganga plain is the high-density rural norm; defence clustering also appears in Bundelkhand / Nagaland notes.",
    "Mega-city (NCERT >50 lakh) ≠ UN megacity (≥1 crore) ≠ metropolitan (10–50 lakh) — keep the three thresholds apart.",
    "Smallest million-plus UA in the 2011 set is often taught as **Kota** — useful against inventing a Himalayan million city.",
    "Outgrowths (railway colony, campus, cantonment, port colony) can sit inside an **urban agglomeration** without being separate Class-I towns.",
    "HRIDAY is heritage revitalisation; Smart Cities is urban ICT/ABD modernisation — do not treat them as the same mission.",
    "SAGY (2014) is village adoption / MP-linked rural development framing, distinct from SPMRM Rurban clusters.",
    "Global Village is **transport + communication**, not a UN political category alone.",
    "Site vs situation: a river-bank site can have a poor regional situation if routes bypass it — both must be read separately.",
    "Uttar Pradesh Mission-10 Smart Cities never include Ghaziabad; Ghaziabad appears only on the **State 2019** list for that trap.",
]

QUIZ_12 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
Which of the following pairs is/are correctly matched?

1. Determinism — Ratzel / Semple
2. Possibilism — Vidal de la Blache
3. Neo-determinism — Griffith Taylor

A. Only 1
B. 1 and 2
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three pairs are correct.

**Logic:** These are the standard approach–name pairs for human geography.

</details>

**Q2.**
A census town in India must have:

A. A municipal corporation only
B. Population ≥5,000; density ≥400/km²; ≥75% male main workers in non-agriculture
C. Population ≥1 lakh
D. Population ≥10,000 and a railway station

<details>
<summary>Show answer</summary>

**Ans: B.** The triple census-town test is population, density and male non-agri work.

**Logic:** Municipality defines statutory towns, not census towns.

</details>

**Q3.**
With reference to rural settlement types, which of the following statements is/are correct?

1. Dispersed villages typify Meghalaya, Uttarakhand, Himachal Pradesh and Kerala.
2. The Thar is dispersed by default in every teaching key.
3. Hamlet names include panna, para, palli, nagla and dhani.

A. 1 and 3
B. Only 2
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 3 are correct.

**Logic:** Clustered villages also appear around Rajasthan water points — Thar ≠ automatically dispersed.

</details>

**Q4.**
Assertion (A): In the NCERT Indian size ladder, mega cities are above 50 lakh population.
Reason (R): A UN megacity threshold is 1 crore or more.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: A.** Both are true thresholds, but R is a different scale definition, not the explanation of the NCERT mega-city cut.

**A/R logic:** Mixing NCERT 50-lakh mega with UN 1-crore megacity is the trap.

</details>

**Q5.**
The 2011 million-plus UA rank begins with:

A. Mumbai > Kolkata > Delhi
B. Mumbai > Delhi > Kolkata
C. Delhi > Mumbai > Kolkata
D. Kolkata > Mumbai > Delhi

<details>
<summary>Show answer</summary>

**Ans: B.** **Mumbai > Delhi > Kolkata** is the 2011 order.

**Logic:** Mumbai > Kolkata > Delhi is the **2001** trap.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Scheme) | List-II (Year / tag) |
|---|---|
| 1. JNNURM | A. 2005 |
| 2. Smart Cities Mission | B. 25 June 2015 |
| 3. SPMRM launch | C. 21 February 2016 |
| 4. AMRUT 2.0 | D. 1 October 2021 |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Standard chronology pairs.

**Logic:** SPMRM launch is **2016**, not 2015 Cabinet year alone.

</details>

**Q7.**
Which city is NOT in Uttar Pradesh’s Central / Mission Smart City list of 10?

A. Lucknow
B. Varanasi
C. Ghaziabad
D. Jhansi

<details>
<summary>Show answer</summary>

**Ans: C.** Ghaziabad is on the **State 2019** list, not the Mission Central-10.

**Logic:** Papers often treat any large UP city as Mission-100 by default.

</details>

**Q8.**
HRIDAY cities in Uttar Pradesh are:

A. Prayagraj and Ayodhya
B. Varanasi and Mathura
C. Lucknow and Kanpur
D. Agra and Varanasi

<details>
<summary>Show answer</summary>

**Ans: B.** UP HRIDAY pair = **Varanasi and Mathura**.

**Logic:** Prayagraj/Ayodhya are heritage-famous distractors.

</details>

**Q9.**
Smart Cities Mission and SPMRM are under which ministries respectively?

A. Both MoHUA
B. MoHUA and MoRD
C. Both MoRD
D. MoRD and MoHUA

<details>
<summary>Show answer</summary>

**Ans: B.** Smart Cities = **MoHUA**; Rurban / SPMRM = **MoRD**.

**Logic:** Ministry swap is the scheme trap.

</details>

**Q10.**
Which one of the following cities is classically “not on a major river bank”?

A. Agra
B. Patna
C. Kolkata
D. Bhopal

<details>
<summary>Show answer</summary>

**Ans: D.** **Bhopal** is the classic non-river-bank city trap.

**Logic:** Agra–Yamuna, Patna–Ganga, Kolkata–Hooghly are river cities.

</details>

**Q11.**
Consider the following statements:

1. Class I towns have population ≥1 lakh.
2. Metropolitan cities in the NCERT ladder are 10 lakh–50 lakh.
3. There were 53 million-plus UAs in Census 2011.

A. Only 1
B. 1 and 2
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three are correct.

**Logic:** Do not raise Class I to the 10-lakh metropolitan cut.

</details>

**Q12.**
Rurbanization as a sociological tag is linked to:

A. M.N. Srinivas
B. G.S. Ghurye
C. Louis Wirth
D. Griffith Taylor

<details>
<summary>Show answer</summary>

**Ans: B.** **G.S. Ghurye** is the rurbanization name in option sets.

**Logic:** Srinivas is a common distractor.

</details>

**Q13.**
Assertion (A): Site and situation mean the same thing for a settlement.
Reason (R): Situation refers to the wider regional location relative to routes and resources.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Site = local ground; situation = wider location.

</details>

**Q14.**
Which of the following is a modern planned city associated with Le Corbusier?

A. Jaipur
B. Lucknow
C. Chandigarh
D. Madurai

<details>
<summary>Show answer</summary>

**Ans: C.** **Chandigarh** is the Le Corbusier planned-city classic.

**Logic:** Jaipur/Lucknow are medieval tags; Madurai is ancient.

</details>

**Q15.**
With reference to economic activities, quaternary activities mainly refer to:

A. Farming and fishing
B. Manufacturing
C. Knowledge / R&D services
D. Retail trade only

<details>
<summary>Show answer</summary>

**Ans: C.** Quaternary = knowledge / R&D in advanced teaching.

**Logic:** Primary/secondary/tertiary cover extraction, manufacturing and general services.

</details>

**Q16.**
SPMRM (Rurban) was launched on:

A. 25 June 2015
B. 21 February 2016
C. 1 October 2021
D. 15 August 2014

<details>
<summary>Show answer</summary>

**Ans: B.** Launch date is **21 February 2016**.

**Logic:** 2015 is Cabinet-approval / Smart Cities–AMRUT year trap.

</details>

**Q17.**
Which of the following statements is/are correct?

1. Global Village rests on transport plus communication.
2. Primate city means one city dominates far above the second city.
3. Rank-size rule expects a regular step-down of city sizes.

A. Only 1
B. 1 and 2
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three are correct.

**Logic:** These are standard settlement-system tags.

</details>

**Q18.**
Which ISAC-2020 pairing is correct?

A. Culture — Bhopal
B. Governance — Indore
C. Urban environment — Bhopal
D. Social — Vadodara

<details>
<summary>Show answer</summary>

**Ans: C.** Urban environment winner tag = **Bhopal**.

**Logic:** Culture–Indore, Governance–Vadodara, Social–Tirupati are the other theme pairs.

</details>

**Q19.**
Arrange the following in chronological order of launch / start year:

1. JNNURM
2. SAGY
3. Smart Cities Mission
4. AMRUT 2.0

A. 1–2–3–4
B. 2–1–3–4
C. 1–3–2–4
D. 1–2–4–3

<details>
<summary>Show answer</summary>

**Ans: A.** 2005 → 2014 → 2015 → 2021.

**Logic:** SAGY (2014) sits between JNNURM and Smart Cities.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. AMRUT — June 2015
B. HRIDAY in UP — Varanasi and Mathura
C. Smart Cities — MoRD
D. Chandigarh — Le Corbusier

<details>
<summary>Show answer</summary>

**Ans: C.** Smart Cities is under **MoHUA**, not MoRD.

**Logic:** MoRD is the Rurban / SPMRM ministry.

</details>
'''

FACTS_13 = [
    "Coaching risk fact: **Risk ≈ Hazard × Vulnerability / Capacity**. A disaster happens when a hazard hits exposed people or assets and capacity is too weak.",
    "The disaster-management cycle runs **mitigation → preparedness → response → recovery**. Mitigation is before impact; response is during and just after.",
    "Earthquake **focus** is the point **inside** the Earth; **epicentre** is the point on the **surface** above it. **Richter** measures magnitude; **Mercalli** measures intensity / damage.",
    "Seismic waves split into **body** (P, S) and **surface** (Love, Rayleigh). Body waves arrive **P then S**; surface waves come last and do most damage.",
    "**P-wave** shadow is about **103–142°**; **S-wave** shadow lies beyond about **103°** because the outer core is liquid. **P** travels through solids, liquids and gases; **S** through **solids only**.",
    "India uses seismic **Zones II–V** only (Zone I dropped in 2002). **Zone V is highest**. A draft Zone VI was **withdrawn in March 2026** — maps still follow the 2016 II–V zones.",
    "Zone V covers the North-East, Himalayan pockets, **Kutch** and the **Andaman & Nicobar** belt. Much of Rajasthan and the Deccan sits in Zones II–III.",
    "About **59%** of India’s landmass is earthquake-prone in NDMA note. Famous shocks: Kangra 1905, Bihar–Nepal 1934, **Koyna 1967 (reservoir-induced)**, **Latur 1993 (peninsular / Killari)**, Bhuj 2001.",
    "A **tsunami** (Japanese “harbour wave”) is caused by **seafloor displacement**, not ordinary wind waves. India’s warning hub is **INCOIS, Hyderabad**. Hall event: **26 Dec 2004**.",
    "**Kilimanjaro** sits on the East African Rift and is **not** part of the Pacific Ring of Fire.",
    "Landslide belts are the Himalaya, Western Ghats and North-East. Landmark pairs include Kedarnath **2013**, Joshimath subsidence **2023**, and Sikkim GLOF **2023**.",
    "Flood types include riverine (Ganga–Brahmaputra), flash floods in hills, urban floods and coastal storm surge. Drought is meteorological, hydrological and agricultural. IMD drought criteria often use rainfall deficiency **>25%** of normal.",
    "IMD **cloudburst** fact is rainfall **≥100 mm in one hour**, typically in Uttarakhand–Himachal–J&K–North-East hill belts around **1000–2500 m**.",
    "IMD plains heat-wave gate: when **Tmax ≥40°C**, a departure of **4.5–6.4°C** is a heat wave and **>6.4°C** is severe; or actual **≥45°C / ≥47°C**. Cold-wave plains gate is **Tmin ≤10°C** with a sharp drop.",
    "The **Bay of Bengal** produces **more** cyclones than the Arabian Sea. Peak seasons are roughly **May–June** and **October–December**.",
    "Cyclone-name pairs: **Baguio = Philippines**; Hurricane = USA; Typhoon = China–Japan; **Willy-willy = Australia**; cyclone = North Indian Ocean.",
    "**NDMA** is chaired by the **Prime Minister**. **SDMA** is chaired by the **Chief Minister**. **DDMA** is chaired by the District Magistrate / Collector.",
    "Framework years: **DM Act 2005**, **NPDM 2009**, **NDRF 2006** (MHA), **NDMP 2016**, **Sendai Framework 2015–2030**, **CDRI 2019**. International Day for DRR is **13 October**.",
    "NEC pair = Union Home Secretary. **NIDM** handles training from Delhi. Its ancestor **NCDM** was set up in **1995** under **IIPA**. India is **not** a disaster-free country.",
    "India’s multi-hazard note: ~**59%** quake-prone, ~**12%** flood-prone, ~**5,700 km** cyclone/tsunami coast, ~**68%** of cultivable area drought-vulnerable.",
    "**Mangroves** cut cyclone and surge impact. **Bhopal 1984** is the classic man-made industrial / chemical disaster.",
    "**DPAP** began in **1973–74**. The earlier Community Development Programme pair is **1952**.",
    "Uttar Pradesh sits mainly in seismic **Zones III–IV** (not Zone V as a whole-State label). Eastern districts face river floods; Bundelkhand faces drought.",
    "Plains heat waves (**Loo**) peak in **May–June**; cold-wave and fog risk in western UP and the Terai peaks in **December–January**.",
    "In the 2018 UP paper, the **Gomati** carried the “biological disaster” pollution label among the given rivers.",
    "Hazard is potential danger; disaster is when capacity fails. Do not treat the two words as identical.",
    "Hazard classes include geophysical, hydrological, meteorological, climatological and technological / industrial.",
    "Landslide triggers include steep slopes, heavy rain, earthquakes, deforestation and toe-cutting of slopes. Avalanche risk sits mainly in high Himalayan snow belts.",
    "Early-warning chain: **IMD** (weather / cyclone / heat), **INCOIS** (tsunami / ocean), **CWC** (floods), GSI / NDMA guidance for landslides.",
    "**Sendai Framework** has **seven** global targets and **four** priorities for action. Priority 4 includes **Build Back Better**. Adopted at the **Third** UN World Conference on DRR (Sendai, Japan).",
    "Cyclone formation needs warm SST (about **27°C**), Coriolis force, and low vertical wind shear — Arabian Sea can still produce severe storms (e.g. Tauktae).",
    "GLOF means glacial-lake outburst flood; Sikkim **2023** is the teaching CA pair, distinct from ordinary monsoon riverine floods.",
    "Joshimath **2023** = subsidence; Kedarnath **2013** = rain–debris–flood — do not merge the mechanisms.",
    "Pacific **Ring of Fire** holds most of the world’s quakes and volcanoes; India’s Himalayan quakes are mainly **Indian–Eurasian** convergence, not island-arc volcanoes.",
    "Reservoir-induced seismicity classic = **Koyna 1967**; peninsular Stable Continental Region shock classic = **Latur / Killari 1993**.",
    "Storm surge is a coastal cyclone hazard; flash flood is a hill / urban intense-rain hazard — do not label every flood as storm surge.",
    "CDRI (**2019**) is India’s coalition for disaster-resilient infrastructure — distinct from NDMA’s statutory authority role.",
    "Hyogo Framework (**2005–15**) preceded Sendai (**2015–30**); Yokohama is an older DRR conference tag, not the Sendai successor name.",
    "NDRF was raised in **2006** under MHA; DM Act year **2005** is the statute, not the force-raising year.",
    "Heat-wave plains need the **Tmax ≥40°C** gate before departure/actual cuts apply — a warm 36°C afternoon is not automatically a heat wave.",
    "Willy-willy = Australia; Baguio = Philippines; Hurricane = Atlantic/USA naming — regional name swaps are frequent.",
    "Tsunami warning for India is **INCOIS Hyderabad** (MoES), not NDMA HQ and not IMD Pune as the tsunami hub.",
    "Mitigation reduces risk before impact; preparedness stages people and systems; response saves lives in the impact window; recovery rebuilds — including Build Back Better under Sendai Priority 4.",
    "About **12%** flood-prone and **68%** drought-vulnerable cultivable area sit beside the **59%** quake-prone landmass note in multi-hazard stems.",
    "Man-made / technological disasters include industrial chemical events (Bhopal) and can intersect natural triggers (Natech) — India is not “natural disasters only.”",
]

QUIZ_13 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
Risk in disaster studies is commonly framed as:

A. Hazard − Vulnerability
B. Hazard × Vulnerability / Capacity
C. Capacity × Vulnerability only
D. Hazard + Capacity

<details>
<summary>Show answer</summary>

**Ans: B.** Risk ≈ Hazard × Vulnerability / Capacity.

**Logic:** Higher capacity lowers risk for the same hazard and vulnerability.

</details>

**Q2.**
With reference to earthquakes, which of the following statements is/are correct?

1. Focus is the surface point above the rupture.
2. Richter measures magnitude; Mercalli measures intensity.
3. S-waves travel through the liquid outer core.

A. Only 2
B. 1 and 2
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Only statement 2 is correct.

**Logic:** Focus is inside; epicentre is surface. S-waves are solids only.

</details>

**Q3.**
India’s seismic zoning map currently uses:

A. Zones I–V
B. Zones II–V
C. Zones I–VI
D. Only Zone V nationwide

<details>
<summary>Show answer</summary>

**Ans: B.** Official teaching map uses **Zones II–V** (Zone I dropped; draft Zone VI withdrawn).

**Logic:** Zone V is highest, not the only zone.

</details>

**Q4.**
Assertion (A): A tsunami is essentially a wind-raised tidal wave.
Reason (R): India’s tsunami early-warning hub is INCOIS, Hyderabad.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Tsunami = seafloor displacement / harbour-wave origin, not ordinary wind tide.

</details>

**Q5.**
IMD’s cloudburst threshold is rainfall of:

A. ≥50 mm in 24 hours
B. ≥100 mm in one hour
C. ≥200 mm in one day
D. Any rain above normal

<details>
<summary>Show answer</summary>

**Ans: B.** Cloudburst = **≥100 mm in one hour**.

**Logic:** Heavy rain alone is not the IMD cloudburst definition.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Name) | List-II (Region) |
|---|---|
| 1. Baguio | A. Philippines |
| 2. Willy-willy | B. Australia |
| 3. Hurricane | C. USA / Atlantic naming |
| 4. Typhoon | D. China–Japan seas |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Standard regional cyclone names.

**Logic:** Row order is not the answer code.

</details>

**Q7.**
NDMA is chaired by the:

A. Union Home Minister
B. Prime Minister
C. Cabinet Secretary
D. Chief of NDRF

<details>
<summary>Show answer</summary>

**Ans: B.** NDMA chair = **Prime Minister**.

**Logic:** SDMA = Chief Minister; DDMA = District Magistrate.

</details>

**Q8.**
Which of the following year–framework pairs is/are correctly matched?

1. DM Act — 2005
2. NPDM — 2009
3. Sendai Framework — 2005–15

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Sendai is **2015–2030**; Hyogo was 2005–15.

</details>

**Q9.**
Koyna 1967 and Latur 1993 are correctly tagged as:

A. Both pure Himalayan thrust quakes
B. Reservoir-induced and peninsular / Killari respectively
C. Both tsunami-generating megathrusts
D. Both Zone V Himalayan events

<details>
<summary>Show answer</summary>

**Ans: B.** Koyna = reservoir-induced; Latur/Killari = peninsular SCR shock.

**Logic:** “Only Himalaya shakes” is false.

</details>

**Q10.**
Which volcano is NOT on the Pacific Ring of Fire?

A. Mount Fuji
B. Mount Pinatubo
C. Mount Kilimanjaro
D. Mount St. Helens

<details>
<summary>Show answer</summary>

**Ans: C.** Kilimanjaro = **East African Rift**.

**Logic:** Fuji, Pinatubo and St. Helens are Circum-Pacific.

</details>

**Q11.**
Consider the following statements:

1. Bay of Bengal produces more cyclones than the Arabian Sea.
2. Peak cyclone seasons include May–June and October–December.
3. Arabian Sea never produces severe cyclones affecting India.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Tauktae-type storms show Arabian Sea can hit the west coast.

</details>

**Q12.**
Sendai Framework has:

A. Six targets and three priorities
B. Seven targets and four priorities
C. Five targets and five priorities
D. Ten targets and two priorities

<details>
<summary>Show answer</summary>

**Ans: B.** **Seven** global targets and **four** priorities (including Build Back Better).

**Logic:** Hyogo-era counts are common distractors.

</details>

**Q13.**
Assertion (A): Joshimath 2023 and Kedarnath 2013 are the same mechanism labelled differently.
Reason (R): GLOF refers to a glacial-lake outburst flood.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Joshimath = subsidence; Kedarnath 2013 = rain–debris–flood; Sikkim 2023 = GLOF example.

</details>

**Q14.**
India’s tsunami early-warning centre is at:

A. IMD Pune
B. NDMA New Delhi
C. INCOIS Hyderabad
D. NIDM Delhi

<details>
<summary>Show answer</summary>

**Ans: C.** Tsunami warning hub = **INCOIS, Hyderabad**.

**Logic:** IMD is weather/cyclone/heat; NIDM is training.

</details>

**Q15.**
Which of the following is a man-made industrial / chemical disaster classic?

A. Kangra 1905
B. Bhuj 2001
C. Bhopal 1984
D. Amphan 2020

<details>
<summary>Show answer</summary>

**Ans: C.** **Bhopal 1984** is the industrial chemical classic.

**Logic:** Others are natural / cyclone tags.

</details>

**Q16.**
With reference to heat waves on the plains, which statement is correct?

A. Any afternoon above 35°C is a heat wave
B. Plains gate often needs Tmax ≥40°C before departure/actual criteria apply
C. Heat waves peak in December–January in the Terai
D. Cold-wave criteria use Tmax ≥45°C

<details>
<summary>Show answer</summary>

**Ans: B.** Plains heat-wave teaching starts from the **≥40°C** gate.

**Logic:** Dec–Jan is cold-wave/fog season; Loo/heat is May–June.

</details>

**Q17.**
DPAP began in:

A. 1952
B. 1973–74
C. 2005
D. 2016

<details>
<summary>Show answer</summary>

**Ans: B.** DPAP = **1973–74**.

**Logic:** 1952 is Community Development Programme.

</details>

**Q18.**
Which of the following statements is/are correct for Uttar Pradesh?

1. The State as a whole is labelled Zone V.
2. Eastern districts face river floods.
3. Bundelkhand faces drought stress.

A. Only 1
B. 1 and 2
C. 2 and 3
D. Only 2

<details>
<summary>Show answer</summary>

**Ans: C.** Statements 2 and 3 are correct.

**Logic:** UP is mainly Zones **III–IV**, not whole-State Zone V.

</details>

**Q19.**
Arrange chronologically:

1. Hyogo Framework period start
2. DM Act
3. Sendai Framework adoption year
4. CDRI launch

A. 2–1–3–4
B. 1–2–3–4
C. 2–3–1–4
D. 1–2–4–3

<details>
<summary>Show answer</summary>

**Ans: B.** Hyogo 2005 → DM Act 2005 → Sendai 2015 → CDRI 2019 (same-year Hyogo/DM Act; order keeps Hyogo framing then statute then Sendai then CDRI).

**Logic:** If forced to split 2005, both Hyogo and DM Act share the year; Sendai and CDRI are later.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. NDRF — raised 2006
B. International Day for DRR — 13 October
C. Willy-willy — USA
D. Mangroves — reduce storm-surge impact

<details>
<summary>Show answer</summary>

**Ans: C.** Willy-willy = **Australia**, not USA.

**Logic:** Hurricane is the USA/Atlantic regional name.

</details>
'''


def main() -> None:
    rows = []
    rows.append(apply_chapter("10_Tribes_Institutions.md", FACTS_10, QUIZ_10))
    rows.append(apply_chapter("11_Population_Geography.md", FACTS_11, QUIZ_11))
    rows.append(apply_chapter("12_Human_Geography.md", FACTS_12, QUIZ_12))
    rows.append(apply_chapter("13_Disaster_Geography.md", FACTS_13, QUIZ_13))
    for r in rows:
        print(f"{r['file']}: facts={r['facts']} quiz={r['quiz']}")


if __name__ == "__main__":
    main()
