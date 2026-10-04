# -*- coding: utf-8 -*-
"""One-shot: rewrite Mastery Drill quizzes for Geography Topics 01–04."""
from pathlib import Path

REV = Path(__file__).resolve().parents[2] / "revision" / "must-score-facts" / "geography"

HEADER = """## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

"""

QUIZZES = {}

QUIZZES["01_Indian_Physical_Geography_Mountains_Hills.md"] = HEADER + r"""
**Q1.**
With reference to the physiographic divisions of India, which of the following statements is/are correct?

1. India is commonly divided into six major physiographic divisions for map questions.
2. The Thar Desert is a Tertiary sand sheet older than the Himalayan foredeep fill.

A. Only 1
B. Only 2
C. Both 1 and 2
D. Neither 1 nor 2

<details>
<summary>Show answer</summary>

**Ans: A.** Only statement 1 is correct.

**Logic:** The Thar is a **Pleistocene–recent** sand sheet, not a Tertiary desert. Six-division map frame is standard.

</details>

**Q2.**
Arrange the Himalayan belts from north to south:

A. Himadri → Trans-Himalaya → Himachal → Shiwalik
B. Trans-Himalaya → Himadri → Himachal → Shiwalik
C. Shiwalik → Himachal → Himadri → Trans-Himalaya
D. Himachal → Himadri → Shiwalik → Trans-Himalaya

<details>
<summary>Show answer</summary>

**Ans: B.** Trans-Himalaya → Himadri → Himachal → Shiwalik.

**Logic:** Shiwalik is the outermost southern belt. Reversing the ladder is the classic trap.

</details>

**Q3.**
Which one of the following pairs is correctly matched?

A. Himadri — marine fossils
B. Himachal — fossil-less crystalline core
C. Shiwalik — unconsolidated sediments / human remains
D. Aravalli — youngest fold belt of India

<details>
<summary>Show answer</summary>

**Ans: C.** Shiwalik holds unconsolidated sediments and human remains.

**Logic:** Himadri is fossil-less crystalline; Himachal carries marine fossils; Aravalli is the oldest fold system among usual options.

</details>

**Q4.**
Assertion (A): The Kashmir Valley lies between the Pir Panjal in the south and the Himadri in the north.
Reason (R): Karewas are longitudinal valleys between Himachal and Shiwalik.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** Karewas are lacustrine terraces of Kashmir; a **dun** is the longitudinal valley between Himachal and Shiwalik.

</details>

**Q5.**
Which of the following is NOT crossed by the Tropic of Cancer?

A. Madhya Pradesh
B. Tripura
C. Uttar Pradesh
D. Mizoram

<details>
<summary>Show answer</summary>

**Ans: C.** Uttar Pradesh is not on the Tropic of Cancer.

**Logic:** Eight-state W→E list ends with Tripura and Mizoram; UP and Ladakh are classic exclusions.

</details>

**Q6.**
Indian Standard Time is based on which meridian?

A. 82°30′ E near Mirzapur
B. 82°30′ E near Prayagraj
C. 90° E near Kolkata
D. 75° E near Jaipur

<details>
<summary>Show answer</summary>

**Ans: A.** IST uses **82°30′ E** near **Mirzapur (UP)** for the whole country.

**Logic:** Trap swaps Mirzapur with Prayagraj or invents a second Indian time zone.

</details>

**Q7.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Pass / peak) | List-II (State / location) |
|---|---|
| 1. Lipulekh | A. Sikkim |
| 2. Nathu La | B. Uttarakhand |
| 3. Shipki La | C. Himachal Pradesh |
| 4. Guru Shikhar | D. Rajasthan |

A. 1-B, 2-A, 3-C, 4-D
B. 1-A, 2-B, 3-C, 4-D
C. 1-B, 2-C, 3-A, 4-D
D. 1-C, 2-A, 3-B, 4-D

<details>
<summary>Show answer</summary>

**Ans: A.** Lipulekh = Uttarakhand; Nathu La = Sikkim; Shipki La = Himachal; Guru Shikhar = Rajasthan.

**Logic:** Row order is not the answer code. Lipulekh ≠ Ladakh is the main trap.

</details>

**Q8.**
With reference to coasts of India, which of the following statements is/are correct?

1. The Konkan coast is a coast of submergence.
2. The Coromandel coast is a coast of emergence.

A. Only 1
B. Only 2
C. Both 1 and 2
D. Neither 1 nor 2

<details>
<summary>Show answer</summary>

**Ans: C.** Both statements are correct.

**Logic:** Malabar and Coromandel = emergence; Konkan = submergence.

</details>

**Q9.**
Which one of the following correctly distinguishes Andaman–Nicobar from Lakshadweep?

A. Both are coral atolls in the Bay of Bengal
B. Andaman–Nicobar are largely volcanic/tectonic; Lakshadweep is coral
C. Both are volcanic arcs in the Arabian Sea
D. Lakshadweep is volcanic; Andaman–Nicobar are coral

<details>
<summary>Show answer</summary>

**Ans: B.** Andaman–Nicobar = volcanic/tectonic (Bay of Bengal); Lakshadweep = coral (Arabian Sea).

**Logic:** Origin tags and seas are swapped in distractors.

</details>

**Q10.**
Which channel separates Andaman from Nicobar?

A. 8° Channel
B. 9° Channel
C. 10° Channel
D. Duncan Passage only

<details>
<summary>Show answer</summary>

**Ans: C.** The **10° Channel** separates Andaman from Nicobar.

**Logic:** 9° = Minicoy vs rest of Lakshadweep; 8° = Minicoy vs Maldives.

</details>

**Q11.**
Consider the following statements:

1. Western Ghats form a continuous wall; Eastern Ghats are discontinuous.
2. Anaimudi is the highest peak of South India.
3. Jindhagada is the usual highest peak of the Eastern Ghats.

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three statements are correct.

**Logic:** Continuous vs discontinuous Ghats, Anaimudi (2695 m), and Jindhagada (~1690 m) are standard crowns.

</details>

**Q12.**
Which one of the following is the southernmost point of Indian territory?

A. Kanyakumari
B. Indira Point
C. Indira Col
D. Guhar Moti

<details>
<summary>Show answer</summary>

**Ans: B.** **Indira Point** (Great Nicobar) is the southernmost **territory**.

**Logic:** Kanyakumari = southernmost mainland; Indira Col = northern extreme.

</details>

**Q13.**
Assertion (A): Vindhya lies north of the Narmada and Satpura lies south of the Narmada.
Reason (R): Central India hills from west to east run Satpura → Mahadeo → Maikal → Chhotanagpur.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: A.** Both are true, but R describes the W→E hill chain, not why Vindhya/Satpura flank the Narmada.

**A/R logic:** A is the Narmada sandwich fact; R is a separate central-India sequence fact.

</details>

**Q14.**
Tirupati’s Venkateswara temple stands on which hills?

A. Shevaroy Hills
B. Tirumala / Mallamalla Hills of the Eastern Ghats
C. Anamalai Hills
D. Cardamom Hills

<details>
<summary>Show answer</summary>

**Ans: B.** Tirumala / Mallamalla Hills — Eastern Ghats (Andhra Pradesh).

**Logic:** Shevaroy (Tamil Nadu) is the frequent wrong hill match.

</details>

**Q15.**
With reference to India, which of the following statements is/are correct?

1. India is the sixth-largest country by area.
2. India occupies about 2.4% of the world’s land area.
3. The Tropic of Cancer passes through the middle of the country.

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: B.** Statements 2 and 3 are correct.

**Logic:** Area rank is **7th**, not 6th. Middle-Tropic fact does not make India wholly tropical.

</details>

**Q16.**
Which one of the following peaks is the highest peak fully in India?

A. K2
B. Namcha Barwa
C. Kanchenjunga
D. Nanga Parbat

<details>
<summary>Show answer</summary>

**Ans: C.** **Kanchenjunga** is the highest peak fully in India.

**Logic:** K2 = Karakoram; Namcha Barwa = Tibet; Nanga Parbat = western syntaxial bend tag.

</details>

**Q17.**
Marwar Plateau and Marwar Plain are correctly distinguished as:

A. Plateau west of Aravalli; Plain east of Aravalli
B. Plateau east of Aravalli; Plain / Thar west of Aravalli
C. Both lie west of Aravalli
D. Both lie east of Aravalli

<details>
<summary>Show answer</summary>

**Ans: B.** Plateau = east of Aravalli; Plain / Thar = west of Aravalli.

**Logic:** East–west swap around the Aravalli is the core trap.

</details>

**Q18.**
Which of the following states has the longest mainland coastline?

A. Andhra Pradesh
B. Tamil Nadu
C. Gujarat
D. Maharashtra

<details>
<summary>Show answer</summary>

**Ans: C.** **Gujarat** has the longest mainland state coastline.

**Logic:** AP and Tamil Nadu follow; Telangana is not coastal.

</details>

**Q19.**
Consider the following statements about Meghalaya hills:

1. Garo, Khasi and Jaintia hills form the Meghalaya Plateau.
2. These hills are geologically Himalayan fold ranges.
3. Mawsynram and Cherrapunji sit on the Khasi Hills.

A. 1 and 2 only
B. 1 and 3 only
C. 2 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: B.** Statements 1 and 3 are correct.

**Logic:** Meghalaya Plateau is geologically **peninsular**, not a Himalayan fold belt.

</details>

**Q20.**
Which one of the following correctly describes the Atal Tunnel?

A. World’s longest highway tunnel without any altitude qualifier
B. Longest highway tunnel above 10,000 ft under Rohtang in the Pir Panjal
C. Tunnel under Zoji La linking Srinagar with Tawang
D. Twin-lane tunnel on the Eastern Ghats near Tirumala

<details>
<summary>Show answer</summary>

**Ans: B.** Atal Tunnel = Rohtang / Pir Panjal; safe tag is longest highway tunnel **above 10,000 ft**.

**Logic:** Unqualified “world’s longest” and Zoji La / Sela mix-ups are common distractors.

</details>
""".lstrip("\n")

QUIZZES["02_Climate_of_India.md"] = HEADER + r"""
**Q1.**
India’s climate is best described as:

A. Wholly tropical throughout the country
B. Tropical monsoon, with a subtropical north
C. Mediterranean in the north-west and tropical elsewhere
D. Equatorial wet in all coastal states

<details>
<summary>Show answer</summary>

**Ans: B.** Tropical monsoon — not wholly tropical because the north is subtropical.

**Logic:** Himalayan wall + seasonal wind reversal define the monsoon frame.

</details>

**Q2.**
With reference to the south-west monsoon, which of the following statements is/are correct?

1. About 75–90% of India’s annual rain falls during June–September.
2. Normal onset over Kerala is around 1 June.
3. Tamil Nadu’s south-east coast receives its main rain in the SW monsoon.

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Tamil Nadu SE coast is dry in SW monsoon and wet mainly in the **NE monsoon**.

</details>

**Q3.**
An active monsoon is correctly associated with:

A. Trough shifted onto the Himalaya and dry central India
B. Trough on the Ganga plain and wet plains
C. Withdrawal from Kerala toward Rajasthan
D. Western Disturbance rainfall decreasing east to west

<details>
<summary>Show answer</summary>

**Ans: B.** Active spell = trough on the Ganga plain.

**Logic:** Break monsoon parks the trough on the Himalaya. Break ≠ retreating monsoon.

</details>

**Q4.**
Assertion (A): Western Disturbances bring winter rain to north-west India.
Reason (R): Western Disturbances are tropical cyclones that form over the Bay of Bengal in October.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** WDs are Mediterranean **extra-tropical** systems. Bay October storms belong to the retreating-monsoon / cyclone season.

</details>

**Q5.**
Which jet stream is a summer easterly supporting the south-west monsoon?

A. Subtropical Westerly Jet south of the Himalaya
B. Polar Front Jet over Siberia
C. Tropical Easterly Jet around 14°N
D. Roaring Forties jet near 40°S

<details>
<summary>Show answer</summary>

**Ans: C.** **TEJ** ≈ 14°N summer easterly.

**Logic:** Main mid-latitude jets are westerly; “all jets are easterly” is false.

</details>

**Q6.**
El Niño is correctly characterised as:

A. Cool eastern Pacific phase that always strengthens the Indian monsoon
B. Warm eastern Pacific / Peru phase that usually weakens the Indian monsoon and reduces plankton
C. Positive IOD phase in the Pacific Ocean
D. Warm Arabian Sea current that forms on the equator only

<details>
<summary>Show answer</summary>

**Ans: B.** Warm E Pacific → usually weak monsoon + less upwelling / plankton.

**Logic:** La Niña is the cool opposite; IOD is an **Indian Ocean** dipole, not Pacific.

</details>

**Q7.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Köppen type) | List-II (India association) |
|---|---|
| 1. Am | A. Thar Desert |
| 2. Aw | B. Deccan |
| 3. As | C. Kerala / Konkan / NE |
| 4. BWh | D. Tamil Nadu dry-summer Coromandel |

A. 1-C, 2-B, 3-D, 4-A
B. 1-B, 2-C, 3-D, 4-A
C. 1-C, 2-D, 3-B, 4-A
D. 1-A, 2-B, 3-C, 4-D

<details>
<summary>Show answer</summary>

**Ans: A.** Am = wet west coast/NE; Aw = Deccan; As = Coromandel dry summer; BWh = Thar.

**Logic:** Row order is not the answer code. Cwg (not listed) covers much of the Ganga / UP plain.

</details>

**Q8.**
Which one of the following local phenomena is a violent pre-monsoon thunderstorm of eastern and north-eastern India?

A. Loo
B. Kal Baisakhi / Nor’wester
C. Mango shower
D. Blossom shower

<details>
<summary>Show answer</summary>

**Ans: B.** Kal Baisakhi / Nor’westers = violent April–May storms of the east / NE.

**Logic:** Loo is hot dry plains wind; mango/blossom showers are southern pre-monsoon rains.

</details>

**Q9.**
IMD defines a rainy day as any 24-hour period recording:

A. ≥ 1.0 mm
B. ≥ 2.5 mm
C. ≥ 5.0 mm
D. ≥ 10.0 mm

<details>
<summary>Show answer</summary>

**Ans: B.** Rainy day ≥ **2.5 mm**.

**Logic:** Threshold traps use 1 mm or 5 mm.

</details>

**Q10.**
With reference to humidity, which of the following statements is/are correct?

1. Absolute humidity is the mass of water vapour in air.
2. Relative humidity always rises when temperature rises if vapour mass is constant.

A. Only 1
B. Only 2
C. Both 1 and 2
D. Neither 1 nor 2

<details>
<summary>Show answer</summary>

**Ans: A.** Only statement 1 is correct.

**Logic:** Relative humidity is % of saturation and **falls** as temperature rises if vapour mass is unchanged.

</details>

**Q11.**
Tropical cyclones over the North Indian Ocean:

A. Form most often on the equator
B. Need sea surface temperatures of about 26–27°C and form more often over the Bay of Bengal than the Arabian Sea
C. Have the fiercest winds in the calm eye
D. Are called Willy-willies in the Atlantic

<details>
<summary>Show answer</summary>

**Ans: B.** SST ~26–27°C; Bay > Arabian Sea frequency.

**Logic:** No equator formation; eyewall is fiercest; Willy-willy = Australia.

</details>

**Q12.**
Assertion (A): Horse latitudes are dry subtropical high-pressure belts near 30°.
Reason (R): Doldrums mark the rainy ITCZ calm belt of rising air.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: A.** Both true, but R describes ITCZ/doldrums, not why horse latitudes are dry highs.

**A/R logic:** The two belts are opposites — do not treat R as the cause of A.

</details>

**Q13.**
Which one of the following is correctly matched?

A. Thornthwaite — letter codes based only on temperature
B. Köppen — vegetation is the true index of climate
C. Thornthwaite — vegetation is the true index of climate
D. Flohn — monsoon caused only by land–sea differential heating

<details>
<summary>Show answer</summary>

**Ans: C.** Thornthwaite’s key line is vegetation as the true climate index.

**Logic:** Köppen = T+P letter codes; classical thermal theory ≠ Flohn’s dynamic ITCZ migration.

</details>

**Q14.**
On the northern plains, rainfall generally:

A. Increases east to west
B. Declines east to west
C. Is equal at Delhi and Kolkata
D. Falls only in the north-east monsoon

<details>
<summary>Show answer</summary>

**Ans: B.** Rainfall generally **declines east → west** on the northern plains.

**Logic:** Kochi–Kolkata–Patna–Delhi teaching ladder and Rajasthan dryness reinforce the gradient.

</details>

**Q15.**
Which of the following pairs is NOT correctly matched?

A. Hurricane — USA / Atlantic
B. Typhoon — NW Pacific
C. Willy-willy — Australia
D. Brickfielder — North Indian Ocean cyclone

<details>
<summary>Show answer</summary>

**Ans: D.** Brickfielder is an Australian **hot local wind**, not a cyclone name.

**Logic:** Willy-willy is the Australian cyclone tag often swapped with Brickfielder.

</details>

**Q16.**
Consider the following statements about Uttar Pradesh climate:

1. Western UP receives more Western Disturbance winter rain than eastern UP.
2. May–June Loo heat waves hit the plains.
3. SW monsoon rain in UP often arrives with Bay of Bengal depressions.

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three statements are correct.

**Logic:** WD west→east decline, Loo, and Bay-depression monsoon feed are the UP spine.

</details>

**Q17.**
Retreating monsoon months are mainly:

A. December–February
B. March–May
C. June–September
D. October–November

<details>
<summary>Show answer</summary>

**Ans: D.** Retreating monsoon ≈ **October–November** (October heat + Bay/Andaman cyclone risk).

**Logic:** Do not call this the Western Disturbance season (Dec–Feb cold weather).

</details>

**Q18.**
Sea breeze and land breeze are correctly stated as:

A. Sea breeze by night toward land; land breeze by day toward sea
B. Sea breeze by day toward land; land breeze by night toward sea
C. Both blow only in the SW monsoon
D. Both are forms of katabatic drainage

<details>
<summary>Show answer</summary>

**Ans: B.** Day = sea→land; night = land→sea.

**Logic:** Anabatic/katabatic are slope winds; do not mix them with sea/land breezes.

</details>

**Q19.**
Positive Indian Ocean Dipole (+IOD) generally:

A. Strengthens El Niño in the Pacific
B. Helps the Indian monsoon
C. Suppresses the Indian monsoon always
D. Occurs only when TEJ disappears

<details>
<summary>Show answer</summary>

**Ans: B.** **+IOD** helps the Indian monsoon; **−IOD** hurts it.

**Logic:** IOD compares west vs east **Indian Ocean**, not the Pacific.

</details>

**Q20.**
Which one of the following onset dates is correctly matched in the usual teaching ladder?

A. Kerala — mid-July
B. Delhi — about 1 June
C. Mumbai / Kolkata — about 10 June
D. Rajasthan — about 29 June

<details>
<summary>Show answer</summary>

**Ans: C.** Mumbai / Kolkata ≈ **10 June**.

**Logic:** Kerala ≈ 1 June; Delhi ≈ 29 June; Rajasthan last ≈ mid-July.

</details>
""".lstrip("\n")

QUIZZES["03_Drainage_System.md"] = HEADER + r"""
**Q1.**
About what share of India’s drainage area faces the Bay of Bengal?

A. About 23%
B. About 50%
C. About 77%
D. About 90%

<details>
<summary>Show answer</summary>

**Ans: C.** About **77%** of drainage **area** faces the Bay of Bengal.

**Logic:** Arabian Sea ≈ 23% area; water volume to the Bay is still >90%. Do not confuse area share with water share.

</details>

**Q2.**
Which one of the following is the largest river basin inside India?

A. Godavari
B. Brahmaputra
C. Ganga
D. Indus

<details>
<summary>Show answer</summary>

**Ans: C.** **Ganga** is the largest basin **inside India**.

**Logic:** Godavari is the largest **peninsular** basin; Brahmaputra leads water volume.

</details>

**Q3.**
With reference to drainage types, which of the following pairs is/are correctly matched?

1. Antecedent — Indus, Sutlej, Brahmaputra
2. Superimposed — Chambal
3. Consequent — follows weak belts later

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Consequent follows the **original slope**; subsequent follows weak belts later.

</details>

**Q4.**
Assertion (A): The river is named Ganga only from Devprayag onward.
Reason (R): At Devprayag the Alaknanda meets the Mandakini.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** Devprayag = Alaknanda + **Bhagirathi**. Mandakini meets at Rudraprayag.

</details>

**Q5.**
Panch Prayag upstream to downstream is:

A. Dev → Rudra → Karn → Nanda → Vishnu
B. Vishnu → Nanda → Karn → Rudra → Dev
C. Karn → Vishnu → Nanda → Rudra → Dev
D. Vishnu → Rudra → Nanda → Karn → Dev

<details>
<summary>Show answer</summary>

**Ans: B.** Vishnu → Nanda → Karn → Rudra → Dev (= Ganga).

**Logic:** Upstream–downstream order is heavily tested; reverse order is the trap.

</details>

**Q6.**
Under the Indus Waters Treaty, India gets which set?

A. Indus, Jhelum, Chenab
B. Ravi, Beas, Sutlej
C. Sutlej, Jhelum, Ravi
D. Beas, Chenab, Indus

<details>
<summary>Show answer</summary>

**Ans: B.** India = Ravi, Beas, Sutlej; Pakistan = Indus, Jhelum, Chenab.

**Logic:** Eastern rivers to India is the treaty lock.

</details>

**Q7.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Dam / feature) | List-II (River) |
|---|---|
| 1. Baglihar | A. Krishna |
| 2. Pandoh | B. Chenab |
| 3. Srisailam | C. Beas |
| 4. Tulbul | D. Jhelum / Wular |

A. 1-B, 2-C, 3-A, 4-D
B. 1-C, 2-B, 3-A, 4-D
C. 1-B, 2-A, 3-C, 4-D
D. 1-D, 2-C, 3-A, 4-B

<details>
<summary>Show answer</summary>

**Ans: A.** Baglihar–Chenab; Pandoh–Beas; Srisailam–Krishna; Tulbul–Jhelum/Wular.

**Logic:** Pandoh ≠ Ravi and Srisailam ≠ Tungabhadra are the main swaps.

</details>

**Q8.**
Which one of the following is a west-flowing river that forms an estuary in a rift valley?

A. Godavari
B. Mahanadi
C. Narmada
D. Cauvery

<details>
<summary>Show answer</summary>

**Ans: C.** **Narmada** (and Tapi) = rift-valley estuary builders.

**Logic:** Most east-flowing peninsular rivers build deltas.

</details>

**Q9.**
Ken–Betwa is correctly described as:

A. One of 16 Himalayan links already completed
B. The only National Perspective Plan link under implementation (Bundelkhand MP–UP)
C. A National Waterway from Ganga to Hooghly
D. An inland drainage canal of the Thar

<details>
<summary>Show answer</summary>

**Ans: B.** Ken–Betwa is the only NPP link under implementation.

**Logic:** “How many links operational?” traps invent multiple completed national links.

</details>

**Q10.**
Yamuna right-bank tributaries from west to east are:

A. Ken–Betwa–Sind–Chambal
B. Chambal–Sind–Betwa–Ken
C. Betwa–Chambal–Ken–Sind
D. Sind–Ken–Betwa–Chambal

<details>
<summary>Show answer</summary>

**Ans: B.** **Chambal–Sind–Betwa–Ken**.

**Logic:** Betwa meets at Hamirpur and does **not** join at Prayagraj.

</details>

**Q11.**
Which of the following statements is/are correct?

1. Kosi is called the Sorrow of Bihar.
2. Damodar is called the Sorrow of Bengal.
3. Luni is an inland drainage river with a saline lower course.

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three statements are correct.

**Logic:** Sorrow titles swap easily; Luni ≠ Barak (Bay via Meghna).

</details>

**Q12.**
Among the following, the trans-Himalayan river is:

A. Jhelum
B. Ravi
C. Sutlej
D. Ganga

<details>
<summary>Show answer</summary>

**Ans: C.** **Sutlej** rises north of the Great Himalaya and cuts through.

**Logic:** Indus and Brahmaputra are also trans-Himalayan; Jhelum/Ravi are not the Tibet-cut pick in this option set.

</details>

**Q13.**
Assertion (A): Most east-flowing peninsular rivers form deltas.
Reason (R): Narmada and Tapi flow through rift valleys and form estuaries.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: A.** Both true, but R explains west-flowing rift rivers, not why east-flowing rivers build deltas.

**A/R logic:** Contrast delta vs estuary; R is true but not the cause of A.

</details>

**Q14.**
National Waterway-1 corresponds to:

A. Brahmaputra
B. Kerala backwaters
C. Ganga–Hooghly
D. Krishna–Godavari

<details>
<summary>Show answer</summary>

**Ans: C.** **NW-1** = Ganga–Hooghly.

**Logic:** NW-2 Brahmaputra; NW-3 Kerala; NW-4 Krishna–Godavari; NW-5 Brahmani–Mahanadi.

</details>

**Q15.**
Which confluence is correctly matched?

A. Yamuna meets Ganga at Kannauj
B. Ghaghara meets Ganga at Prayagraj
C. Son meets Ganga at Patna
D. Kosi meets Ganga at Sonpur

<details>
<summary>Show answer</summary>

**Ans: C.** Son meets Ganga at **Patna**.

**Logic:** Yamuna–Prayagraj; Ramganga–Kannauj; Gandak–Sonpur; Kosi–Kursela.

</details>

**Q16.**
Tapi rises from:

A. Western Ghats near Mahabaleshwar
B. Amarkantak plateau
C. Multai in the Satpura range
D. Brahmagiri hills

<details>
<summary>Show answer</summary>

**Ans: C.** Tapi rises at **Multai (Satpura)** — not the Western Ghats.

**Logic:** Narmada–Amarkantak; Krishna–Mahabaleshwar; Kaveri–Brahmagiri.

</details>

**Q17.**
Arcuate and bird’s-foot deltas are correctly paired as:

A. Sundarbans — arcuate; Mississippi — bird’s-foot
B. Mississippi — arcuate; Sundarbans — bird’s-foot
C. Both Sundarbans and Mississippi — bird’s-foot
D. Both Sundarbans and Mississippi — arcuate

<details>
<summary>Show answer</summary>

**Ans: A.** Sundarbans = arcuate; Mississippi = bird’s-foot.

**Logic:** Do not call the Ganga delta bird’s-foot.

</details>

**Q18.**
Gandak:

A. Flows through Lucknow as the Gomti
B. Joins Ganga at Sonpur and does not flow through Uttar Pradesh in the usual state list
C. Is a right-bank tributary of the Yamuna
D. Is an inland drainage river of Rajasthan

<details>
<summary>Show answer</summary>

**Ans: B.** Gandak joins at Sonpur and is not a UP river in the usual list.

**Logic:** Gomti = Lucknow; Ghaghara = Ayodhya.

</details>

**Q19.**
Consider the following city–river pairs:

1. Hyderabad — Musi
2. Ludhiana — Sutlej
3. Hampi — Tungabhadra
4. Leh — left bank of the Indus

Which of the pairs given above are correctly matched?

A. 1, 2 and 3 only
B. 1, 2 and 4 only
C. 2, 3 and 4 only
D. 1, 2, 3 and 4

<details>
<summary>Show answer</summary>

**Ans: A.** Pairs 1–3 are correct; Leh is on the **right bank** of the Indus.

**Logic:** Hyderabad ≠ Krishna stem; Ludhiana ≠ Ravi.

</details>

**Q20.**
Which drainage pattern is typical of Amarkantak?

A. Trellis
B. Dendritic
C. Radial
D. Centripetal

<details>
<summary>Show answer</summary>

**Ans: C.** Amarkantak shows **radial** drainage (Narmada west, Son toward Ganga).

**Logic:** Trellis ≈ Singhbhum folds; centripetal ≈ Loktak / Sambhar; dendritic ≈ homogeneous plains/peninsula stems.

</details>
""".lstrip("\n")

QUIZZES["04_Lakes_Waterfalls_Water_Resources.md"] = HEADER + r"""
**Q1.**
Which one of the following is the largest east-coast lagoon of India?

A. Sambhar
B. Chilika
C. Wular
D. Loktak

<details>
<summary>Show answer</summary>

**Ans: B.** **Chilika** is the largest east-coast lagoon (Odisha).

**Logic:** Sambhar = largest **inland** saline; Wular = freshwater volume king; Loktak = Manipur phumdis.

</details>

**Q2.**
With reference to Indian lakes, which of the following pairs is/are correctly matched?

1. Lonar — meteorite crater in Maharashtra basalt
2. Kabartal — oxbow Ramsar lake of Bihar
3. Vembanad — India’s overall largest lake by area

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Vembanad is Kerala’s largest and India’s **longest** west-coast kayal — not the overall largest lake.

</details>

**Q3.**
India’s 100th Ramsar site (5 June 2026) is:

A. Sultanpur, Haryana
B. Surha Tal / JP Narayan Bird Sanctuary, Ballia, UP
C. Rudrasagar, Tripura
D. Hokera, Punjab

<details>
<summary>Show answer</summary>

**Ans: B.** Surha Tal / JP Narayan BS, Ballia — India’s 100th Ramsar; UP total **13**.

**Logic:** Sultanpur/Rudrasagar/Hokera are not-UP or wrong-state traps (Hokera is J&K, not Punjab).

</details>

**Q4.**
Assertion (A): Kunchikal is the usual highest waterfall key in UPPCS-type teaching sets.
Reason (R): Jog Falls on the Sharavati is famous mainly for its width, not for being India’s highest fall.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: A.** Both true; R correctly contrasts Jog but does not itself prove why Kunchikal is the height key (Nohkalikai is tallest plunge).

**A/R logic:** Height crowns split as Kunchikal (highest total) vs Nohkalikai (tallest plunge) vs Jog (width).

</details>

**Q5.**
Which dam–river pair is correctly matched?

A. Bhakra–Nangal — Beas
B. Tehri — Alaknanda alone
C. Hirakud — Mahanadi
D. Ban Sagar — Narmada

<details>
<summary>Show answer</summary>

**Ans: C.** Hirakud is on the **Mahanadi** (Odisha).

**Logic:** Bhakra = Sutlej; Tehri = Bhagirathi (+ Bhilangana); Ban Sagar = Son.

</details>

**Q6.**
Sardar Sarovar and Indira Sagar are correctly distinguished as:

A. Both on Krishna in Andhra Pradesh
B. SSP on Narmada in Gujarat; Indira Sagar on Narmada in Madhya Pradesh
C. Both on Son in Bundelkhand
D. SSP on Tapi; Indira Sagar on Mahi

<details>
<summary>Show answer</summary>

**Ans: B.** SSP = Narmada Gujarat; Indira Sagar = Narmada MP (volume king).

**Logic:** State swap and Ban Sagar–Son confusion are common.

</details>

**Q7.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Feature) | List-II (Association) |
|---|---|
| 1. DVC | A. First multipurpose valley project of independent India (1948) |
| 2. Sidrapong | B. Oldest hydro (Darjeeling, 1897) |
| 3. Shivasamudram | C. Second hydro (Cauvery, 1902) |
| 4. Farakka | D. Barrage diverting ~40,000 cusec to Hooghly |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** DVC 1948; Sidrapong 1897; Shivasamudram 1902; Farakka = diversion barrage.

**Logic:** Row order is not the answer code. Dam stores vs barrage diverts is the Farakka trap.

</details>

**Q8.**
National Water Policy 2012 places first priority on:

A. Irrigation
B. Hydropower
C. Drinking water
D. Industrial use

<details>
<summary>Show answer</summary>

**Ans: C.** NWP 2012 puts **drinking** first.

**Logic:** PMKSY / Atal Jal are scheme overlays, not the policy priority line.

</details>

**Q9.**
Which waterfall–river pair is correctly matched?

A. Kapildhara — Godavari
B. Jog — Cauvery
C. Shivanasamudra — Cauvery
D. Lodh / Budha Ghagh — Kanchi

<details>
<summary>Show answer</summary>

**Ans: C.** Shivanasamudra is on the **Cauvery** (volume king).

**Logic:** Kapildhara = Narmada; Jog = Sharavati; Lodh = Burha (Jharkhand highest).

</details>

**Q10.**
Indira Gandhi Canal takes off from:

A. Bhimgoda / Haridwar
B. Narora
C. Harike Barrage
D. Gandhi Sagar

<details>
<summary>Show answer</summary>

**Ans: C.** IGC offtake = **Harike Barrage** (Sutlej–Beas–Ravi waters → western Rajasthan).

**Logic:** Upper Ganga Canal = Bhimgoda/Haridwar; Lower Ganga Canal = Narora; Gang Canal (1927) is the older RJ system.

</details>

**Q11.**
Consider the following statements on water resources:

1. India has about 4% of the world’s water resources and over 17% of world population.
2. Groundwater now covers more than 60% of irrigated area.
3. Minor irrigation (CCA ≤ 2000 ha) accounts for about 62% of irrigation potential.

A. 1 and 2 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: D.** All three statements are correct.

**Logic:** People–water–land mismatch, GW dominance, and CCA size bands are standard resource stems.

</details>

**Q12.**
Which lake is associated with phumdis and Keibul Lamjao?

A. Wular
B. Dal
C. Loktak
D. Pulicat

<details>
<summary>Show answer</summary>

**Ans: C.** **Loktak** (Manipur) — phumdis, Keibul Lamjao, Sangai.

**Logic:** Do not park Keibul on Wular/Dal.

</details>

**Q13.**
Assertion (A): A dam stores water whereas a barrage mainly diverts water.
Reason (R): Farakka Barrage was built primarily as India’s tallest rock-fill storage dam on the Bhagirathi.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** Farakka diverts ~40,000 cusec to the Hooghly. Tallest rock-fill = **Tehri** on Bhagirathi.

</details>

**Q14.**
Narmada Bachao Andolan / Medha Patkar is classically linked with opposition to:

A. Hirakud height
B. Sardar Sarovar height
C. Tehri rock-fill design
D. Bhakra–Nangal reservoir

<details>
<summary>Show answer</summary>

**Ans: B.** NBA / Medha Patkar opposed **Sardar Sarovar** height.

**Logic:** Do not tag the movement only to Indira Sagar.

</details>

**Q15.**
Which one of the following is NOT correctly matched?

A. Dudhsagar — Goa (Mandovi)
B. Chitrakote — Indravati
C. Chachai — Bihad
D. Dhuandhar — Narmada at Bhedaghat

<details>
<summary>Show answer</summary>

**Ans: C.** **Chachai–Bihad** is a wrong pair.

**Logic:** Other three fall–river/state pairs are standard correct matches.

</details>

**Q16.**
Oldest hydro-electric project among the following is:

A. Shivasamudram (1902)
B. Sidrapong (1897)
C. Koyna (1960s)
D. Idukki arch dam

<details>
<summary>Show answer</summary>

**Ans: B.** **Sidrapong (Darjeeling, 1897)** is the oldest; Shivasamudram (1902) is second.

**Logic:** Age order is a frequent swap trap.

</details>

**Q17.**
Pulicat and Kolleru are correctly distinguished as:

A. Both are freshwater lagoons of Kerala
B. Pulicat is a major brackish lagoon (AP–TN); Kolleru is mainly freshwater
C. Both are tectonic lakes of Jammu & Kashmir
D. Pulicat is inland saline; Kolleru is a west-coast kayal

<details>
<summary>Show answer</summary>

**Ans: B.** Pulicat = 2nd major brackish lagoon; Kolleru = mainly freshwater.

**Logic:** Do not crown Kolleru as a lagoon king.

</details>

**Q18.**
Cauvery water dispute parties are:

A. Tamil Nadu, Karnataka, Kerala and Puducherry
B. Tamil Nadu, Karnataka and Gujarat only
C. Karnataka, Andhra Pradesh and Odisha
D. Tamil Nadu and Maharashtra only

<details>
<summary>Show answer</summary>

**Ans: A.** **TN–KA–KL–Puducherry**.

**Logic:** Adding Gujarat or dropping Puducherry is the distractor set.

</details>

**Q19.**
Telugu Ganga project is associated with supplying Krishna water to:

A. Bengaluru
B. Hyderabad
C. Chennai
D. Madurai

<details>
<summary>Show answer</summary>

**Ans: C.** Telugu Ganga = Krishna water to **Chennai**.

**Logic:** City swap with Bengaluru/Hyderabad/Madurai is common.

</details>

**Q20.**
Which one of the following correctly states utilisable water resources in the standard teaching figures?

A. About 4000 BCM utilisable; 1122 BCM precipitation
B. About 1122 BCM utilisable (surface ~690 + groundwater ~433)
C. About 1869 BCM utilisable; 1122 BCM available
D. About 690 BCM groundwater and 433 BCM surface utilisable

<details>
<summary>Show answer</summary>

**Ans: B.** Utilisable ≈ **1122 BCM** (surface ~690 + GW ~433).

**Logic:** Precipitation ~4000 BCM and available ~1869 BCM are upstream figures; do not swap the three.

</details>
""".lstrip("\n")


def replace_quiz(path: Path, quiz: str) -> None:
    text = path.read_text(encoding="utf-8")
    marker = "## 🎯 Revision Practice MCQs"
    i = text.find(marker)
    if i < 0:
        raise SystemExit(f"Quiz marker missing: {path.name}")
    path.write_text(text[:i] + quiz.rstrip() + "\n", encoding="utf-8", newline="\n")
    # count Qs and answer keys
    import re
    qs = re.findall(r"^\*\*Q(\d+)\.\*\*", quiz, re.M)
    ans = re.findall(r"\*\*Ans:\s*([A-D])", quiz)
    print(f"{path.name}: Qs={len(qs)} keys={''.join(ans)} ({ {k: ans.count(k) for k in 'ABCD'} })")


def main() -> None:
    for name, quiz in QUIZZES.items():
        replace_quiz(REV / name, quiz)


if __name__ == "__main__":
    main()
