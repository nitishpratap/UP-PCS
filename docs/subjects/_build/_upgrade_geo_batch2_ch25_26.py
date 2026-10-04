#!/usr/bin/env python3
"""Upgrade Geography Topics 25–26 consolidated + revision twins."""

from __future__ import annotations

from _upgrade_geo_batch2_lib import apply_chapter

FACTS_25 = [
    "India’s Census 2011 population was **1,210,854,977 (121.08 crore)**. Males **51.54%**, females **48.46%**. India holds about **17.5%** of world population on **2.4%** of world land area.",
    "Decadal growth **2001–2011** was about **17.7%** (Rural **12.3%**, Urban **31.8%**). Highest State growth: **Meghalaya (27.9%)**. Negative State growth: **Nagaland (−0.6%)**.",
    "Population density India **382**/km². Top States: **Bihar (1,106)** > West Bengal (1,028) > Kerala (860) > Uttar Pradesh (**829**). Lowest State: **Arunachal Pradesh (17)**.",
    "Highest density UT: **Delhi (11,320)**; lowest UT: **Andaman & Nicobar (46)**.",
    "Overall sex ratio **943** (+10 from 933 in 2001). Top State: **Kerala (1,084)**. Lowest State: **Haryana (879)**. Highest UT: Puducherry (1,037); lowest UT: Daman & Diu (618).",
    "Child sex ratio (0–6) **919** (fell from 927 in 2001). Highest State: **Arunachal Pradesh (972)**. Lowest State: **Haryana (834)**.",
    "Literacy **74.04%** (male **82.14%**, female **65.46%**; gap **16.68%**), counted for age **7+**. Top State: **Kerala (94.0%)**. Lowest State: **Bihar (61.8%)**. Lowest female literacy State: **Rajasthan (52.1%)**.",
    "SC population **20.14 crore (16.6%)**. Highest absolute SC: **Uttar Pradesh**. Highest SC proportion: **Punjab (31.9%)**. Zero SC: **Nagaland, Lakshadweep, Andaman & Nicobar**.",
    "ST population **10.43 crore (8.6%)**. Highest absolute ST: **Madhya Pradesh**. Highest ST proportion: **Lakshadweep (94.8%)** / **Mizoram (94.4%)**. Zero ST: **Punjab, Haryana, Chandigarh, Delhi, Puducherry**.",
    "Urban share **31.16%**; rural **68.84%**. Highest urban % State: **Goa (62.2%)**. Lowest urban % State: **Himachal Pradesh (10.0%)**. Highest absolute urban population: **Maharashtra**.",
    "Million-plus UAs: **53** in 2011 (35 in 2001). Top three: Greater Mumbai > Delhi UA > Kolkata UA. States with most million-plus cities: **Uttar Pradesh (7)** and **Kerala (7)**.",
    "Religious shares: Hindus **79.80%**; Muslims **14.23%**; Christians **2.30%**; Sikhs **1.72%**; Buddhists **0.70%**; Jains **0.37%**.",
    "Highest Muslim % pockets include Lakshadweep, J&K, Assam, West Bengal, Kerala. Highest Christian %: Nagaland, Mizoram, Meghalaya. Highest Jain % State tag: Maharashtra.",
    "Most populous State: **Uttar Pradesh (19.98 crore)**. Least populous State: **Sikkim (6.10 lakh)**. Most populous UT: **Delhi**; least: **Lakshadweep**.",
    "Uttar Pradesh = **16.51%** of India (~**19.98 crore**). If treated as a country in 2011 framing, it ranks among the world’s largest populations.",
    "UP decadal growth **20.23%**. Highest growth district: **Gautam Buddha Nagar (49.1%)**. Lowest growth district: **Kanpur Nagar (9.9%)**.",
    "UP density **829**/km². Highest density district: **Ghaziabad (3,971)**. Lowest density district: **Lalitpur (242)**.",
    "UP sex ratio **912**. Highest: **Jaunpur (1,024)**. Lowest: **Gautam Buddha Nagar (851)**.",
    "UP child sex ratio **902**. Highest: **Balrampur (950)**. Lowest: **Baghpat (841)**.",
    "UP literacy **67.72%** (male **77.28%**, female **57.18%**). Highest overall literacy district: **Gautam Buddha Nagar**. Lowest overall / female literacy district: **Shrawasti**.",
    "UP SC share about **20.69%**. Highest SC % district tag: **Kaushambi**. Highest absolute SC district tag: **Sitapur**.",
    "UP ST share only about **0.57%**. Highest ST district: **Sonbhadra**. Zero ST reported: **Ayodhya (Faizabad)** and **Jalaun** in 2011.",
    "UP urbanisation **22.27%**. Highest urban %: **Ghaziabad**. Lowest urban %: **Shrawasti**.",
    "Uttarakhand population about **1.01 crore (0.83% of India)**. Decadal growth **18.81%**. Negative growth districts: **Pauri Garhwal** and **Almora**.",
    "Uttarakhand density **189**/km² (Haridwar highest; Uttarkashi lowest). Sex ratio **963**. Highest sex ratio district: **Almora**; lowest: **Haridwar**.",
    "Uttarakhand child sex ratio **890** (Pithoragarh lowest). Literacy **78.82%** (Dehradun highest; Udham Singh Nagar / Haridwar among lower).",
    "First non-synchronous Census: **1872** (Lord Mayo). First synchronous decennial Census: **1881** (Lord Ripon; W.C. Plowden).",
    "**1921** is the **Year of the Great Divide** (negative growth about **−0.31%**).",
    "Census is governed by the **Census Act, 1948**. It is Entry **69** of the **Union List**. ORGI works under the **Ministry of Home Affairs**.",
    "Census 2011 was the **15th** national census and the **7th** since Independence. Motto: *Our Census, Our Future*. Commissioner: **C. Chandramouli**. Mascot: female enumerator.",
    "Keep **Census 2011** figures until **Census 2027** results replace them. UN “most populous” estimates around **2023** do not rewrite the 2011 table.",
    "Absolute SC leader (**UP**) ≠ highest SC percentage (**Punjab**). Absolute ST leader (**MP**) ≠ highest ST percentage (**Lakshadweep/Mizoram**).",
    "Overall sex ratio improved 2001→2011 while child sex ratio worsened — opposite directions are a standard trap.",
    "Highest population State (**UP**) ≠ highest density State (**Bihar**). Lowest population State (**Sikkim**) ≠ lowest density State (**Arunachal**).",
    "UP most populous district teaching tag is **Prayagraj**; densest is **Ghaziabad** — do not swap those two district crowns.",
    "Literacy age cut is **7+**; do not key Census literacy as 0–6 or 18+.",
    "Million-city top order Mumbai > Delhi > Kolkata is the **2011** order; Mumbai > Kolkata > Delhi is the **2001** trap.",
    "Dadra & Nagar Haveli had the highest UT decadal growth in the 2011 set (**55.9%**).",
    "Among large States, West Bengal and Kerala follow Bihar in density; Delhi’s extreme density is a UT fact, not a “State density” answer.",
    "Jains are the most urbanised religion in the usual national composition teaching set paired with Census chapters.",
    "Natural growth uses CBR−CDR; Census counts also embed migration when comparing places — district growth can be migration-led (e.g. GB Nagar).",
    "Uttarakhand “ghost village” negative growth in Pauri and Almora is a hill out-migration teaching tag.",
    "Zero-SC and zero-ST State/UT lists are mutually different — Nagaland has ST but zero SC; Punjab has SC but zero ST.",
    "Female literacy gap nationally (~16.7 points) is wider in UP (~20.1 points) — useful for UP vs India comparison stems.",
    "Census Act piloting association with Sardar Patel in Constituent Assembly notes sits beside the Union List Entry 69 fact.",
]

CA_25 = """## Current Affairs (this topic)

| Year | Fact | Why it matters | Source |
|------|------|----------------|--------|
| **Census 2011** | Official number set until **Census 2027** | Density / SR / literacy stems | ORGI |
| **~2023** | UN estimate: India most populous | CA only — does not rewrite 2011 tables | UN / UNFPA |
| **NFHS-5** | National TFR ~**2.0** | Survey fertility vs Census stock | MoHFW |
| Static | 15th Census / 7th after Independence; motto *Our Census, Our Future* | Chronology + branding | ORGI |
"""

QUIZ_25 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
India’s population density in Census 2011 was:

A. 324/km²
B. 382/km²
C. 829/km²
D. 1106/km²

<details>
<summary>Show answer</summary>

**Ans: B.** National density = **382**/km².

**Logic:** 829 = UP; 1106 = Bihar; 324 echoes older rounds.

</details>

**Q2.**
With reference to Census 2011, which of the following statements is/are correct?

1. Sex ratio was 943.
2. Child sex ratio was 919.
3. Child sex ratio improved from 2001 to 2011.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** CSR fell from 927 to 919 — it worsened.

</details>

**Q3.**
Highest SC proportion among States is usually keyed to:

A. Uttar Pradesh
B. Punjab
C. Bihar
D. West Bengal

<details>
<summary>Show answer</summary>

**Ans: B.** **Punjab** leads SC percentage; UP leads absolute SC count.

**Logic:** Absolute vs proportion is the core trap.

</details>

**Q4.**
Assertion (A): Madhya Pradesh has the highest absolute ST population.
Reason (R): Punjab has the highest ST percentage among States/UTs.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** Highest ST % tags are **Lakshadweep / Mizoram**; Punjab is in the zero-ST list.

</details>

**Q5.**
Which State showed negative decadal growth in 2001–11?

A. Kerala
B. Goa
C. Nagaland
D. Sikkim

<details>
<summary>Show answer</summary>

**Ans: C.** **Nagaland (−0.6%)**.

**Logic:** Sikkim is least populous, not negative-growth.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (UP 2011) | List-II (District) |
|---|---|
| 1. Highest density | A. Ghaziabad |
| 2. Highest sex ratio | B. Jaunpur |
| 3. Lowest female literacy | C. Shrawasti |
| 4. Highest CSR | D. Balrampur |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Standard UP district extremes.

**Logic:** Row order is not the answer code.

</details>

**Q7.**
First synchronous Census of India was in:

A. 1872 under Lord Mayo
B. 1881 under Lord Ripon
C. 1921 under Lord Reading
D. 1951 after Independence only

<details>
<summary>Show answer</summary>

**Ans: B.** **1881** / Ripon is the first synchronous decennial Census.

**Logic:** 1872 is first (non-synchronous) attempt.

</details>

**Q8.**
Census is listed in the Constitution as:

A. State List Entry
B. Concurrent List Entry
C. Union List Entry 69
D. Not a scheduled subject

<details>
<summary>Show answer</summary>

**Ans: C.** Union List **Entry 69**; ORGI under MHA.

**Logic:** Census Act 1948 is the statute frame.

</details>

**Q9.**
Uttar Pradesh’s share of India’s population in 2011 was about:

A. 8.6%
B. 16.5%
C. 31.2%
D. 2.4%

<details>
<summary>Show answer</summary>

**Ans: B.** About **16.5%** (19.98 crore).

**Logic:** 8.6% is ST share; 31.2% is urban India; 2.4% is land area.

</details>

**Q10.**
Which Uttarakhand districts showed negative decadal growth?

A. Dehradun and Nainital
B. Pauri Garhwal and Almora
C. Haridwar and US Nagar
D. Chamoli and Pithoragarh

<details>
<summary>Show answer</summary>

**Ans: B.** **Pauri Garhwal** and **Almora**.

**Logic:** Hill out-migration / “ghost village” teaching tag.

</details>

**Q11.**
Consider the following statements:

1. Bihar has the highest State density.
2. Arunachal Pradesh has the lowest State density.
3. Delhi’s density can be used as the lowest density State answer.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Delhi is a UT extreme (very high), not a lowest-density State.

</details>

**Q12.**
Literacy in Census 2011 is counted for age:

A. 0–6
B. 7+
C. 18+
D. 21+

<details>
<summary>Show answer</summary>

**Ans: B.** Age **7+**.

**Logic:** School-enrolment ages are not the Census literacy cut.

</details>

**Q13.**
Assertion (A): Highest population State and highest density State are the same in 2011.
Reason (R): Uttar Pradesh is the most populous State while Bihar has the highest density.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Population crown ≠ density crown.

</details>

**Q14.**
Number of million-plus UAs in Census 2011 was:

A. 35
B. 53
C. 100
D. 7

<details>
<summary>Show answer</summary>

**Ans: B.** **53** (up from 35 in 2001).

**Logic:** 7 is UP’s million-city count, not the all-India UA total.

</details>

**Q15.**
Which State has zero ST population in the usual 2011 list?

A. Odisha
B. Madhya Pradesh
C. Punjab
D. Meghalaya

<details>
<summary>Show answer</summary>

**Ans: C.** Punjab (with Haryana, Chandigarh, Delhi, Puducherry) is in the zero-ST set.

**Logic:** Zero-SC and zero-ST lists differ.

</details>

**Q16.**
UP’s overall sex ratio in 2011 was:

A. 943
B. 912
C. 919
D. 902

<details>
<summary>Show answer</summary>

**Ans: B.** UP = **912**; India = 943; UP CSR = 902.

**Logic:** Keep State vs national vs CSR numbers apart.

</details>

**Q17.**
Year of the Great Divide is:

A. 1872
B. 1881
C. 1921
D. 1951

<details>
<summary>Show answer</summary>

**Ans: C.** **1921** (negative growth).

**Logic:** 1872/1881 are first-census chronology; 1951 is first after Independence.

</details>

**Q18.**
Which of the following pairs is/are correctly matched?

1. Highest urban % State — Goa
2. Lowest urban % State — Himachal Pradesh
3. Highest absolute urban population — Uttar Pradesh

A. 1 and 2
B. Only 3
C. 2 and 3
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Highest absolute urban population = **Maharashtra**, not UP.

</details>

**Q19.**
Arrange chronologically:

1. Census Act
2. First synchronous Census
3. Great Divide year
4. Census 2011

A. 2–1–3–4
B. 1–2–3–4
C. 2–3–1–4
D. 2–1–4–3

<details>
<summary>Show answer</summary>

**Ans: A.** 1881 → 1948 Act → 1921 → 2011 is wrong; correct teaching order is synchronous Census **1881**, Great Divide **1921**, Census Act **1948**, then 2011 — so **2–3–1–4**.

**Logic:** Act is 1948, after 1921.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. Kerala — highest State sex ratio
B. Haryana — lowest State CSR
C. Bihar — lowest State literacy
D. Sikkim — lowest State density

<details>
<summary>Show answer</summary>

**Ans: D.** Lowest State density = **Arunachal Pradesh**; Sikkim is least populous.

**Logic:** Population vs density crowns differ.

</details>
'''

# Fix Q19 answer - I contradict myself in the answer. Let me fix the option letter.
QUIZ_25 = QUIZ_25.replace(
    """A. 2–1–3–4
B. 1–2–3–4
C. 2–3–1–4
D. 2–1–4–3

<details>
<summary>Show answer</summary>

**Ans: A.** 1881 → 1948 Act → 1921 → 2011 is wrong; correct teaching order is synchronous Census **1881**, Great Divide **1921**, Census Act **1948**, then 2011 — so **2–3–1–4**.

**Logic:** Act is 1948, after 1921.

</details>""",
    """A. 2–1–3–4
B. 1–2–3–4
C. 2–3–1–4
D. 2–1–4–3

<details>
<summary>Show answer</summary>

**Ans: C.** Synchronous Census **1881** → Great Divide **1921** → Census Act **1948** → Census **2011**.

**Logic:** The Act is 1948, after 1921.

</details>""",
)

FACTS_26 = [
    "Wheat producers: **Uttar Pradesh (#1)** > Madhya Pradesh > Punjab. Highest yield (kg/ha): **Punjab / Haryana**. UP grows over **32%** of India’s wheat.",
    "Rice producers: **West Bengal (#1)** > Uttar Pradesh > Punjab. Highest yield: **Punjab**. Rice is India’s principal kharif cereal by area.",
    "Total foodgrains: **Uttar Pradesh (#1)** > Madhya Pradesh > Punjab. UP is about **19%** of national foodgrain output.",
    "Sugarcane: **Uttar Pradesh (#1)** > Maharashtra > Karnataka. UP leads area, cane and mills; Maharashtra often competes in processed white sugar.",
    "Cotton (“White Gold”): **Gujarat (#1)** > Maharashtra > Telangana. Grown mainly on Deccan **regur** (black lava soil).",
    "Jute & mesta (“Golden Fibre”): **West Bengal (#1)** > Bihar > Assam. West Bengal holds more than **75%** of jute (Hooghly basin).",
    "Tea: **Assam (#1)** > West Bengal > Tamil Nadu. Assam alone is over **52%** of India’s tea. Nilgiri leads South India.",
    "Coffee: **Karnataka (#1)** > Kerala > Tamil Nadu. Karnataka is over **70%** (Kodagu, Chikmagalur, Hassan). Historic birthplace: **Baba Budan Giri**.",
    "Natural rubber: **Kerala (#1)** > Tripura > Karnataka. Kerala is over **72%** (Kottayam rubber capital tag).",
    "Total pulses: **Madhya Pradesh (#1)** > Maharashtra > Rajasthan. Gram leader **MP**; tur/arhar leader **Maharashtra**.",
    "Total oilseeds: **Rajasthan (#1)** > Madhya Pradesh > Gujarat. Mustard **Rajasthan**; groundnut **Gujarat**; soybean **MP/Maharashtra**.",
    "Spices (aggregate): **Madhya Pradesh (#1)** > Rajasthan > Gujarat. Black pepper: Kerala/Karnataka; cardamom: Kerala (Idukki).",
    "Total fruits: **Andhra Pradesh (#1)**. Total vegetables: **Uttar Pradesh (#1)**. Mango, guava, potato: **UP (#1)**. Banana: **Andhra Pradesh (#1)**.",
    "Milk: **India #1 globally**; within India **Uttar Pradesh (#1)** > Rajasthan > Madhya Pradesh. Total livestock population leader: **Uttar Pradesh**.",
    "Meat: **Uttar Pradesh (#1)**. Eggs: **Andhra Pradesh (#1)** (“Egg Bowl of Asia”) > Tamil Nadu.",
    "Inland fish: **Andhra Pradesh (#1)**. Marine fish: **Gujarat (#1)**. Total fish: **Andhra Pradesh (#1)**.",
    "Coal reserves: **Jharkhand (#1)** > Odisha > Chhattisgarh. Coal production: **Chhattisgarh (#1)** > Odisha > Madhya Pradesh > Jharkhand.",
    "Iron ore reserves and production leader: **Odisha** (production often **>52%**). Hematite belts in Odisha/Jharkhand/CG; magnetite in Karnataka (Kudremukh).",
    "Bauxite reserves and production leader: **Odisha** (Panchpatmali / Koraput–Kalahandi) — often **>50%** reserves and **>65%** output.",
    "Copper reserves: **Rajasthan (Khetri) #1**. Copper production: **Madhya Pradesh (Malanjkhand, Balaghat) #1**.",
    "Manganese reserves: **Odisha #1**. Manganese production: **Madhya Pradesh (Balaghat) #1**.",
    "Chromite: **Odisha** holds **>90%** reserves and nearly **100%** production (Sukinda, Jajpur).",
    "Lead and zinc: **Rajasthan** holds the overwhelming reserve and essentially **100%** production (Zawar, Rampura-Agucha).",
    "Gold: inferred resources leader often **Bihar (Jamui)**; operating mine production **Karnataka (~99%+)** (Hutti; historic Kolar).",
    "Diamond: reserves and active production **Madhya Pradesh (Panna / Majhgawan)**.",
    "Mica production leader: **Andhra Pradesh (Nellore belt)**. Historic mica capital tag: **Koderma (Jharkhand)**.",
    "Onshore crude oil: **Rajasthan (Barmer–Mangala) #1** > Gujarat > Assam (**Digboi** = Asia’s oldest operating oilfield). Offshore flagship: **Mumbai High**.",
    "Uranium: largest reserve tag **Andhra Pradesh (Tummalapalle)**; oldest operating mine **Jharkhand (Jaduguda)**. Thorium: Kerala–Tamil Nadu monazite beach sands.",
    "Global agri leaders: wheat & rice **China > India**; sugarcane **Brazil > India**; cotton **China > India**; tea **China > India**; coffee **Brazil > Vietnam**; milk **India #1**.",
    "Global mineral leaders: coal **China**; iron ore **Australia**; crude oil **USA**; copper **Chile**; bauxite **Australia**; gold **China**; uranium **Kazakhstan**.",
    "Horticulture reminder: potato/mango/guava → **UP**; banana/eggs/inland fish → **Andhra Pradesh**; marine fish → **Gujarat**.",
    "Reserves vs production traps to keep live: coal (Jharkhand vs Chhattisgarh) and copper (Rajasthan vs Madhya Pradesh).",
    "White Gold = cotton; Golden Fibre = jute — fibre nicknames are swapped in options constantly.",
    "Wheat production crown (**UP**) ≠ wheat productivity crown (**Punjab/Haryana**).",
    "Rice production crown (**West Bengal**) ≠ rice productivity crown (**Punjab**).",
    "Sugarcane cane/mills leadership (**UP**) can diverge from processed sugar leadership contests with **Maharashtra**.",
    "Odisha’s mineral sweep in teaching: iron ore, bauxite and chromite leadership often sit together — still keep copper/manganese production with MP where keyed.",
    "Rajasthan’s sweep: oilseeds/mustard, lead-zinc, and onshore crude — do not park chromite here.",
    "Karnataka coffee + gold production pairing is common; Bihar gold is the inferred-resource trap against Hutti output.",
    "Assam tea vs Karnataka coffee is the plantation-state swap pair.",
    "Gujarat leads cotton and marine fish; Andhra Pradesh leads eggs, inland fish and banana — west vs south coastal specialisation.",
    "MP leads pulses and often soybean; Rajasthan leads mustard/oilseeds — Central India vs dry-west oilseed logic.",
    "India’s global milk #1 does not automatically make it #1 in every livestock product; eggs still key to Andhra Pradesh domestically.",
    "Digboi (Assam) is heritage oil; Barmer–Mangala is the modern onshore volume leader tag.",
    "Thorium placer sands (Kerala–TN) are distinct from uranium mine/reserve tags (Jaduguda / Tummalapalle).",
]

CA_26 = """## Current Affairs (this topic)

| Year | Fact | Why it matters | Source |
|------|------|----------------|--------|
| Rolling | IBM / Agriculture Annual Report rank updates | Reserves vs production crowns can move | IBM / MoA&FW |
| Static | Odisha iron–bauxite–chromite sweep | Mineral State cluster | IBM |
| Static | UP wheat–sugarcane–potato–milk cluster | State rank cluster | MoA&FW |
| Static | China vs India global agri ranks; Kazakhstan uranium | World rank stems | FAO / USGS style tables |
"""

QUIZ_26 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
Top wheat-producing State is:

A. Punjab
B. Madhya Pradesh
C. Uttar Pradesh
D. Haryana

<details>
<summary>Show answer</summary>

**Ans: C.** **Uttar Pradesh** leads production; Punjab/Haryana lead yield.

**Logic:** Production vs productivity crowns differ.

</details>

**Q2.**
With reference to fibre crops, which of the following is/are correct?

1. Cotton’s top producer is Gujarat.
2. Jute’s top producer is West Bengal.
3. White Gold means jute and Golden Fibre means cotton.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** White Gold = cotton; Golden Fibre = jute — statement 3 swaps them.

</details>

**Q3.**
Coal reserves and coal production leaders are respectively:

A. Chhattisgarh and Jharkhand
B. Jharkhand and Chhattisgarh
C. Odisha and Jharkhand
D. Both Jharkhand

<details>
<summary>Show answer</summary>

**Ans: B.** Reserves **Jharkhand**; production **Chhattisgarh**.

**Logic:** Classic reserves vs production trap.

</details>

**Q4.**
Assertion (A): Rajasthan leads copper production in India.
Reason (R): Rajasthan (Khetri) leads copper reserves.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Production leader = **Madhya Pradesh (Malanjkhand)**.

</details>

**Q5.**
Top rice-producing State is:

A. Punjab
B. Uttar Pradesh
C. West Bengal
D. Andhra Pradesh

<details>
<summary>Show answer</summary>

**Ans: C.** **West Bengal #1**; Punjab is the yield leader.

**Logic:** Do not award production to the yield crown.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Mineral) | List-II (Top production State) |
|---|---|
| 1. Chromite | A. Odisha |
| 2. Lead–zinc | B. Rajasthan |
| 3. Mica | C. Andhra Pradesh |
| 4. Diamond | D. Madhya Pradesh |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Odisha chromite; Rajasthan Pb–Zn; AP mica; MP diamond.

**Logic:** Row order is not the answer code.

</details>

**Q7.**
India’s global rank in milk production is:

A. Second after USA
B. First
C. Third after EU and USA
D. Not among top five

<details>
<summary>Show answer</summary>

**Ans: B.** **India #1** globally; UP #1 within India.

**Logic:** Domestic State rank and global rank are separate.

</details>

**Q8.**
Bauxite leadership in India is best keyed to:

A. Jharkhand only
B. Odisha
C. Rajasthan
D. Karnataka

<details>
<summary>Show answer</summary>

**Ans: B.** **Odisha** leads reserves and production (Panchpatmali).

**Logic:** Odisha also leads iron ore and chromite in many tables.

</details>

**Q9.**
Which plantation pair is correct?

A. Tea — Karnataka #1; Coffee — Assam #1
B. Tea — Assam #1; Coffee — Karnataka #1
C. Both Assam
D. Both Kerala

<details>
<summary>Show answer</summary>

**Ans: B.** Assam tea; Karnataka coffee.

**Logic:** Plantation-state swap is frequent.

</details>

**Q10.**
Natural rubber top producer is:

A. Tripura
B. Karnataka
C. Kerala
D. Tamil Nadu

<details>
<summary>Show answer</summary>

**Ans: C.** **Kerala** (~72%+).

**Logic:** Tripura is #2 in the usual ladder.

</details>

**Q11.**
Consider the following statements:

1. Total pulses leader is Madhya Pradesh.
2. Total oilseeds leader is Rajasthan.
3. Groundnut leader is Rajasthan.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Groundnut leader = **Gujarat**; mustard = Rajasthan.

</details>

**Q12.**
Egg Bowl of Asia refers to:

A. Tamil Nadu
B. Andhra Pradesh
C. West Bengal
D. Uttar Pradesh

<details>
<summary>Show answer</summary>

**Ans: B.** **Andhra Pradesh** leads eggs.

**Logic:** TN is #2; UP leads meat/milk, not the egg bowl tag.

</details>

**Q13.**
Assertion (A): Bihar leads India’s operating gold-mine production.
Reason (R): Karnataka’s Hutti mines dominate actual gold output.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Bihar (Jamui) is an inferred-resource tag, not the production crown.

</details>

**Q14.**
Marine fish production leader is:

A. Andhra Pradesh
B. Kerala
C. Gujarat
D. Tamil Nadu

<details>
<summary>Show answer</summary>

**Ans: C.** **Gujarat** leads marine fish; Andhra Pradesh leads inland/total fish.

**Logic:** Inland vs marine split is the trap.

</details>

**Q15.**
Onshore crude oil leader in the usual recent teaching set is:

A. Assam
B. Gujarat
C. Rajasthan (Barmer–Mangala)
D. Mumbai High as an onshore field

<details>
<summary>Show answer</summary>

**Ans: C.** **Rajasthan** onshore; Mumbai High is offshore.

**Logic:** Digboi is heritage, not the volume leader.

</details>

**Q16.**
Which global pair is correct?

A. Iron ore #1 — India
B. Copper #1 — Chile
C. Uranium #1 — Canada
D. Coal #1 — USA

<details>
<summary>Show answer</summary>

**Ans: B.** Copper #1 = **Chile**.

**Logic:** Iron ore #1 Australia; uranium #1 Kazakhstan; coal #1 China.

</details>

**Q17.**
Which of the following is/are correctly matched for Uttar Pradesh leadership?

1. Wheat
2. Sugarcane
3. Rice (national #1)
4. Potato

A. 1, 2 and 4
B. Only 3
C. 2 and 3
D. 1 and 3

<details>
<summary>Show answer</summary>

**Ans: A.** Rice national #1 is **West Bengal**; UP is #2 rice.

**Logic:** UP cluster = wheat, sugarcane, potato, milk, vegetables.

</details>

**Q18.**
Chromite in India is overwhelmingly from:

A. Rajasthan
B. Odisha (Sukinda)
C. Karnataka
D. Jharkhand

<details>
<summary>Show answer</summary>

**Ans: B.** Odisha / Sukinda ≈ all-India chromite.

**Logic:** Do not park chromite with Rajasthan’s Pb–Zn sweep.

</details>

**Q19.**
Arrange the following crops by their usual #1 State association:

1. Jute — West Bengal
2. Cotton — Gujarat
3. Coffee — Karnataka
4. Tea — Assam

Which listing is entirely correct?

A. Only 1 and 2
B. Only 3 and 4
C. 1, 2, 3 and 4
D. Only 1, 2 and 3

<details>
<summary>Show answer</summary>

**Ans: C.** All four associations are correct.

**Logic:** Fibre and plantation crowns are high-yield rank facts.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. Thorium sands — Kerala and Tamil Nadu
B. Jaduguda — oldest operating uranium mine (Jharkhand)
C. Tummalapalle — largest uranium reserve tag (Andhra Pradesh)
D. Panna diamonds — Rajasthan

<details>
<summary>Show answer</summary>

**Ans: D.** Panna diamonds = **Madhya Pradesh**.

**Logic:** Rajasthan is Pb–Zn / oilseeds / onshore oil, not diamond.

</details>
'''


def main() -> None:
    rows = []
    rows.append(
        apply_chapter(
            "25_Census_and_Demographics.md", FACTS_25, QUIZ_25, ca_md=CA_25
        )
    )
    rows.append(
        apply_chapter(
            "26_Agriculture_Minerals_Ranks.md", FACTS_26, QUIZ_26, ca_md=CA_26
        )
    )
    for r in rows:
        print(f"{r['file']}: facts={r['facts']} quiz={r['quiz']}")


if __name__ == "__main__":
    main()
