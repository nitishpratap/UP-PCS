#!/usr/bin/env python3
"""Upgrade Geography Topics 15–19 consolidated + revision twins."""

from __future__ import annotations

from _upgrade_geo_batch2_lib import apply_chapter

FACTS_15 = [
    "**Endogenic** processes (folding, faulting, volcanism, uplift) build relief from inside the Earth. **Exogenic** processes wear and deposit at the surface. **Gradation** = degradation + aggradation.",
    "Davis’s cycle of erosion is framed as **structure–process–time** (youth–mature–old). Penck and King modify timing, but the landform vocabulary stays useful.",
    "**Igneous** rocks are primary: **granite** is intrusive (acidic); **basalt** is extrusive (basic). Fossils belong to **sedimentary** rocks.",
    "Igneous bodies: batholith, laccolith, lopolith, phacolith; a **sill** is parallel to beds; a **dyke** cuts across beds.",
    "Metamorphic pairs: **limestone → marble**, **sandstone → quartzite**, **granite → gneiss**, **shale → slate / schist**. Marble and quartzite are non-foliated.",
    "**Weathering** breaks rock **in situ**. **Erosion** picks up and carries material. **Denudation** is weathering plus erosion. Chemical routes include carbonation, oxidation, hydrolysis and hydration.",
    "River load moves by traction, saltation, suspension and solution. Agents of erosion are river, wind, glacier, sea, groundwater (karst) and gravity (mass wasting).",
    "Fluvial stages: youth = **V-valley / waterfall / pothole**; mature = **meander / floodplain / levee**; old = **ox-bow / delta / peneplain**. Rejuvenation adds knickpoints, terraces and incised meanders.",
    "On a meander, the **concave** bank erodes and the **convex** bank builds a **point bar**. A **yazoo** stream is deferred behind a levee. Mountain-foot dumps are **alluvial fans**; coalescing fans form a **bajada**.",
    "Stream genetic types include consequent, subsequent, obsequent and resequent. **Antecedent** streams cut rising land; **superimposed** streams inherit a course from a cover.",
    "The **only** bird’s-foot example is the **Mississippi**. **Arcuate** examples include the **Nile** and the **Ganga–Brahmaputra**. The usual cuspate example is the **Tiber**.",
    "East-flowing Indian mouths often build deltas; **Narmada** and **Tapi** usually form estuaries into the Arabian Sea.",
    "Drainage patterns: **folded** beds → **trellis**; homogeneous rock → **dendritic**; dome → **radial**; joints / faults → **rectangular**; inward drain → **centripetal**.",
    "The classic fault-valley river tag is the **Damodar**, not the Chambal. **Narmada–Tapi** are rift / fault-line pairs as well.",
    "The **Imphal** basin is **lacustrine** (lake-filled), not loess or glacial. Kashmir Vale also has lacustrine / structural pairs. **Loess** is wind-laid silt (China belt).",
    "Structure landforms include cuesta, hogback, mesa and butte. A **mesa** is broader than a **butte**. Davis’s humid old-age plain is a **peneplain** with leftover **monadnocks**; King’s arid form is a **pediplain**.",
    "Glacial erosional forms: cirque, arête, horn, **U-valley**, hanging valley, fjord, tarn. Depositional forms: moraine, drumlin, esker, kame, outwash, erratic.",
    "A **fjord** is a drowned glacial trough. A **ria** is a drowned river valley. Do not treat them as the same estuary type.",
    "Aeolian points: **barchan** horns point **downwind**; parabolic dunes often show horns upwind. Yardang, zeugen and mushroom rocks are wind-eroded forms.",
    "Coastal deposition builds **spit, bar, tombolo and lagoon** with longshore drift. Coral reefs include fringing, barrier and atoll types. An **atoll** is horseshoe / ring around a lagoon.",
    "Karst needs **limestone plus carbonation**. **Stalactite** hangs from the **ceiling**; **stalagmite** grows from the **floor**. Forms include doline, cave, uvala and polje.",
    "River capture vocabulary includes pirate stream, beheaded stream, wind gap and elbow of capture.",
    "Conglomerate has rounded pebbles; breccia has angular fragments. Organic sedimentary rock pair includes coal.",
    "Intertrappean beds between Deccan lava flows hold **land and freshwater** fossils, not marine plant–animal assemblages.",
    "Himadri is fossil-poor crystalline rock; Lesser Himalaya carries marine fossils; Shiwalik holds human remains — keep the three belts distinct.",
    "A gorge is a steep mountain cut; a canyon is often the arid stair-step equivalent. U-valley = glacier; V-valley = youthful river.",
    "The rock cycle links magma ⇄ igneous → sedimentary → metamorphic → melt, so the same material can reappear as a different rock type.",
    "Mass wasting moves material downslope under gravity (creep, slide, flow, fall). It is an agent alongside river, wind, glacier, sea and groundwater.",
    "If the stem calls a moribund delta a **subdivision**, the answer is the **Bengal Delta** (moribund, mature, active). If it asks which river’s delta is the moribund **lobe**, the answer is the **Cauvery**.",
    "World delta locations: **Irrawaddy–southern Myanmar**; **Nile–northern Egypt**; **Indus–Sindh (Pakistan)**; **Danube–Black Sea (Romania/Ukraine)**; **Rhine–Netherlands**; **Volga–Caspian**; **Mekong–Vietnam**.",
    "The **Niger** has an inland delta in **Mali** and a sea delta in **Nigeria**. The **Amazon** meets the Atlantic in **Brazil** as a broad estuary. **Red River** delta = northern Vietnam.",
    "Indian delta States: Godavari and Krishna → **Andhra Pradesh**; Mahanadi → **Odisha**; Cauvery → **Tamil Nadu**.",
    "Dendritic rivers include Ganga and Indus plains, Godavari, Mahanadi, Krishna and Kaveri. From **Amarkantak**, Narmada west and Son toward Ganga give a **radial** spread (Mahanadi at Sihawa is outside that set).",
    "Indian **trellis** ground is the old folded belt of **Singhbhum** on the Chotanagpur plateau. **Rectangular** streams follow joints on **Vindhyan** rocks.",
    "**Centripetal** streams drain into **Loktak** and **Sambhar**. The **Sharavati** follows a **parallel** pattern down the Western Ghats.",
    "Mekong source is Tibet; its delta is in **Vietnam**, not Cambodia.",
    "Antecedent Himalayan streams keep courses while land rises; superimposed streams are let down from an older cover onto different structure below.",
    "Point-bar deposition on the convex bank pairs with cut-bank erosion on the concave bank — the meander migrates laterally toward the cut bank.",
    "Pediplain (King / arid) ≠ peneplain (Davis / humid old age). Monadnocks are resistant leftovers on a peneplain.",
    "Tombolo links an island to the mainland by a depositional bar; a spit is a free depositional finger built by longshore drift.",
    "Karst carbonation needs CO₂-charged water on limestone — sandstone country does not produce classic stalactite caves.",
    "Bird’s-foot delta grows finger distributaries into standing water (Mississippi); arcuate deltas have a bowed seaward front (Nile / Ganga–Brahmaputra).",
    "Bajada is coalesced alluvial fans along a mountain front; a single fan is not yet a bajada.",
    "Erratics are glacier-transported blocks left far from source; they are depositional evidence, not wind yardangs.",
    "Hanging valleys mark tributary glaciers that did not cut as deep as the main U-trough — waterfalls often mark their mouths after ice retreat.",
    "Rejuvenation signs — knickpoints, river terraces, incised meanders — mean renewed downcutting after uplift or base-level fall.",
    "Loess is wind-laid silt; do not tag Imphal basin as loess when the teaching key is lacustrine.",
    "West-flowing Narmada–Tapi estuary habit contrasts with east-coast delta habit — Arabian Sea macrotidal / structural factors sit behind the estuary tag.",
]

QUIZ_15 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
With reference to rock types, which of the following pairs is/are correctly matched?

1. Granite — intrusive acidic igneous
2. Basalt — extrusive basic igneous
3. Limestone → quartzite

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Limestone → **marble**; sandstone → **quartzite**.

</details>

**Q2.**
Weathering differs from erosion because weathering:

A. Always transports material to the sea
B. Breaks rock in situ without requiring transport
C. Occurs only in deserts
D. Is identical to mass wasting

<details>
<summary>Show answer</summary>

**Ans: B.** Weathering is **in situ** breakdown; erosion includes transport.

**Logic:** Denudation = weathering + erosion.

</details>

**Q3.**
The only classic bird’s-foot delta example in the usual set is the:

A. Nile
B. Ganga–Brahmaputra
C. Mississippi
D. Tiber

<details>
<summary>Show answer</summary>

**Ans: C.** Mississippi = bird’s-foot; Nile/Ganga–Brahmaputra = arcuate; Tiber = cuspate.

**Logic:** Shape tags are frequently swapped.

</details>

**Q4.**
Assertion (A): Narmada and Tapi usually form estuaries rather than large deltas.
Reason (R): Most east-flowing Peninsular rivers build deltas on the Bay of Bengal coast.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: A.** Both are true contrast facts; R describes east-coast habit rather than directly causing the Narmada–Tapi estuary form.

**A/R logic:** Keep west-coast estuary vs east-coast delta as a paired contrast.

</details>

**Q5.**
Which drainage pattern develops on homogeneous rock?

A. Trellis
B. Dendritic
C. Rectangular
D. Radial

<details>
<summary>Show answer</summary>

**Ans: B.** Homogeneous lithology → **dendritic**.

**Logic:** Trellis = folded beds; rectangular = joints/faults; radial = dome/volcano.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Feature) | List-II (Association) |
|---|---|
| 1. Fjord | A. Drowned glacial trough |
| 2. Ria | B. Drowned river valley |
| 3. Barchan horns | C. Point downwind |
| 4. Stalactite | D. Hangs from cave ceiling |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Standard landform pairs.

**Logic:** Row order is not the answer code. Fjord/ria swap is common.

</details>

**Q7.**
The Imphal basin is best tagged as:

A. Loess basin
B. Lacustrine basin
C. Glacial trough only
D. Volcanic caldera

<details>
<summary>Show answer</summary>

**Ans: B.** Imphal = **lacustrine** (lake-filled) basin.

**Logic:** Loess is the wind-silt distractor.

</details>

**Q8.**
Which Indian river is the classic fault-valley tag (not Chambal)?

A. Godavari
B. Damodar
C. Kaveri
D. Betwa

<details>
<summary>Show answer</summary>

**Ans: B.** **Damodar** is the fault-valley river tag.

**Logic:** Chambal is the frequent wrong option.

</details>

**Q9.**
Peneplain and pediplain are correctly distinguished as:

A. Both arid King forms
B. Davis humid old-age plain vs King arid form
C. Both glacial plains
D. Both volcanic plateaus

<details>
<summary>Show answer</summary>

**Ans: B.** Peneplain = Davis humid old age; pediplain = King arid.

**Logic:** Monadnocks sit on peneplains as resistant leftovers.

</details>

**Q10.**
Consider the following statements:

1. Concave bank of a meander erodes.
2. Convex bank builds a point bar.
3. Yazoo stream flows freely across the main floodplain without levees.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** A yazoo is deferred **behind a levee**.

</details>

**Q11.**
Mekong delta lies in:

A. Cambodia
B. Southern Vietnam
C. Thailand
D. Laos

<details>
<summary>Show answer</summary>

**Ans: B.** Mekong delta = **southern Vietnam**.

**Logic:** Cambodia is the classic wrong country.

</details>

**Q12.**
From Amarkantak, the radial pair often taught is:

A. Mahanadi and Godavari
B. Narmada and Son
C. Narmada and Tapi
D. Son and Damodar

<details>
<summary>Show answer</summary>

**Ans: B.** Narmada west and Son toward the Ganga — radial from Amarkantak.

**Logic:** Mahanadi rises at Sihawa, outside that radial set.

</details>

**Q13.**
Assertion (A): A fjord and a ria are the same drowned-valley type.
Reason (R): A fjord is a drowned glacial trough.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Ria = drowned river valley; fjord = drowned glacial trough.

</details>

**Q14.**
Centripetal drainage into lakes is classically illustrated by:

A. Sharavati and Western Ghats
B. Loktak and Sambhar
C. Singhbhum trellis only
D. Mississippi bird’s-foot

<details>
<summary>Show answer</summary>

**Ans: B.** **Loktak** and **Sambhar** are centripetal examples.

**Logic:** Sharavati = parallel; Singhbhum = trellis.

</details>

**Q15.**
Which metamorphic pair is correct?

A. Sandstone → marble
B. Limestone → quartzite
C. Granite → gneiss
D. Shale → marble

<details>
<summary>Show answer</summary>

**Ans: C.** Granite → **gneiss**.

**Logic:** Limestone→marble; sandstone→quartzite; shale→slate/schist.

</details>

**Q16.**
If a stem calls a moribund delta a subdivision of a larger delta, the usual answer is:

A. Cauvery lobe alone as the whole Ganga system
B. Bengal Delta (moribund / mature / active)
C. Nile bird’s-foot
D. Tiber arcuate

<details>
<summary>Show answer</summary>

**Ans: B.** Bengal Delta subdivisions = moribund, mature, active.

**Logic:** Cauvery is the moribund **lobe** wording trap in a different stem shape.

</details>

**Q17.**
Which of the following is/are glacial depositional forms?

1. Moraine
2. Cirque
3. Esker
4. Drumlin

A. 1, 3 and 4
B. Only 2
C. 2 and 3
D. 1 and 2

<details>
<summary>Show answer</summary>

**Ans: A.** Cirque is erosional; moraine, esker and drumlin are depositional.

**Logic:** Split erosional vs depositional glacial sets carefully.

</details>

**Q18.**
Indian trellis drainage is classically linked to:

A. Vindhyan rectangular joints only
B. Singhbhum folded belt on Chotanagpur
C. Amarkantak radial node
D. Loktak centripetal basin

<details>
<summary>Show answer</summary>

**Ans: B.** Trellis ↔ **Singhbhum** folded belt.

**Logic:** Vindhyan = rectangular; Amarkantak = radial; Loktak = centripetal.

</details>

**Q19.**
Arrange fluvial stage features from youth to old age:

1. Ox-bow / delta / peneplain
2. V-valley / waterfall / pothole
3. Meander / floodplain / levee

A. 2–3–1
B. 3–2–1
C. 1–2–3
D. 2–1–3

<details>
<summary>Show answer</summary>

**Ans: A.** Youth → mature → old.

**Logic:** V-valley first; meanders mid; ox-bow/delta last.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. Stalagmite — grows from cave floor
B. Tombolo — links island to mainland
C. Barchan horns — point upwind
D. Bajada — coalesced alluvial fans

<details>
<summary>Show answer</summary>

**Ans: C.** Barchan horns point **downwind**.

**Logic:** Parabolic dunes often show horns upwind — the swap trap.

</details>
'''

FACTS_16 = [
    "By area the oceans rank **Pacific > Atlantic > Indian > Southern > Arctic**. The Indian Ocean was the Greek **Erythraean Sea** and straddles **both sides of the Equator**.",
    "Ocean-floor order from the shore is **shelf → slope → rise (or trench) → abyssal plain**. A **guyot** is a flat-topped seamount.",
    "The continental shelf is shallow (about **200 m**), rich in fish and oil, and covers roughly **7.5%** of the ocean floor. Abyssal plains are the most extensive floor province (~**76%**).",
    "India’s **west shelf is wider than the east**. The Gujarat–Mumbai belt is widest and holds **Bombay High**. The east shelf is narrower but carries large delta fans.",
    "The **Telegraphic Plateau** is part of the **North Atlantic Ridge**, not a separate land plateau.",
    "Trench–ocean pairs: **Mariana–Pacific**, **Puerto Rico–Atlantic**, **Sunda/Java–Indian**, and **Molloy–Arctic**.",
    "**Agulhas** and **Brazil** are **warm** currents. **Humboldt (Peru)** and **California** are **cold**. Do not mark Agulhas or Brazil as cold.",
    "The **Benguela** is an **Atlantic** cold current off south-west Africa. It is **not** a Pacific current.",
    "Among classic options, the current linked to the **Indian Ocean** is the **Agulhas**. **Kuroshio** is warm (Japan); **Oyashio** is cold (Kurile).",
    "**El Niño** sends warm water off Peru, weakens upwelling, and cuts plankton and fish catch. **La Niña** is the cold opposite phase.",
    "Open-ocean **salinity** is about **35‰**. The maximum sits near the **Tropics of Cancer and Capricorn**, not on the Equator. The **Red Sea** is high; the **Baltic** is low.",
    "Seawater density rises when water is **colder** and **saltier**. Cold salty water sinks and drives the **thermohaline** circulation. **NaCl** is about **77%** of dissolved salts.",
    "Surface temperature peaks near the equator. The **thermocline** lies roughly **300–1000 m**. Deep water is cold in every ocean.",
    "A **spring tide** forms at **syzygy** (new/full moon) and is **large**. A **neap tide** forms at **quadrature** and is **small**. Tidal period ≈ **12 h 25 min**.",
    "A **tidal bore** is famous on the **Hooghly** and the **Amazon**. The **Bay of Fundy** has the world’s greatest tidal range. India’s tidal-energy coast fact is the **Gulf of Khambhat**.",
    "**Upwelling** is strongest on **west coasts**: Peru, California, Canary, Benguela, and Somalia.",
    "**Constructive** waves build beaches; **destructive** waves erode them. A **tsunami** is not a tide.",
    "Ocean currents shape climate (mild or foggy coasts, west-coast deserts), concentrate fish where warm and cold meet or upwelling occurs, and affect navigation routes.",
    "Deepest deposit is **red clay**. **Globigerina** and **pteropod** oozes are **calcareous**. **Diatom** and **radiolarian** oozes are **siliceous**. **Manganese nodules** sit on abyssal plains.",
    "The **Suez Canal** (Egypt, **1869**) joins the **Mediterranean** and the **Red Sea**. It is a **sea-level** cut — ships do **not** climb stepped chambers. Ends: **Port Said** (N) and **Suez** (S).",
    "Suez lakes north→south: **Manzala → Timsah → Great Bitter → Little Bitter**. India–Europe sea route is shorter by about **7000 km**. Suez does **not** itself touch the Atlantic or the open Indian Ocean.",
    "The **Panama Canal** (**1914**) joins the **Atlantic/Caribbean** and the **Pacific**. Ships **climb stepped chambers** and use **Gatun Lake**. The **Kiel Canal** joins the **North Sea** and the **Baltic**.",
    "UNCLOS belts: **territorial sea 12 nm**, **contiguous zone 24 nm**, **EEZ 200 nm**. The continental shelf starts at **200 nm** and may extend to **350 nm**.",
    "Classic fishery centres: **Grand Banks** (Labrador meets Gulf Stream), **Dogger Bank**, Peru upwelling, and the **Kuroshio–Oyashio** mix.",
    "India’s **operational** Antarctic stations are **Maitri** and **Bharati**. **Dakshin Gangotri** is not the operational pair. **Himadri** is India’s **Arctic** station.",
    "The **Antarctic Treaty** dates to **1959/61**. India joined in **1983**. India is an **observer** in the Arctic Council (Arctic Policy **2022**).",
    "Key straits: **Hormuz** (Persian Gulf ↔ Gulf of Oman; **Iran north / Oman south**; ~**25%** seaborne oil), **Malacca**, **Gibraltar**, **Bering**, **Bab-el-Mandeb**, **Palk**, and the **10° Channel**.",
    "Persian Gulf coasts = Iran, Iraq, Kuwait, Saudi Arabia, Bahrain, Qatar, UAE — **not Oman**. Oman sits on the Gulf of Oman / Musandam side of Hormuz.",
    "The **Carlsberg Ridge** lies in the north-west Indian Ocean. The **Ninetyeast Ridge** is not the Mid-Atlantic Ridge.",
    "The International Seabed Authority manages the seabed **Area** beyond national zones (HQ Jamaica).",
    "**Drake Passage** is not the Strait of Magellan. Panama opened in **1914** with stepped chambers; Suez opened in **1869** as a sea-level cut.",
    "Hydrosphere ≈ **71%** of Earth. Usable fresh ≈ **<1%** of all water. Of fresh water, ice ≫ groundwater ≫ rivers/lakes.",
    "**Datum line** = mean-sea-level height/depth zero. **Halocline** = salinity gradient with depth.",
    "**Sargasso** = North Atlantic, **no coast**. **Red Sea** = axial trough. **Diamantina** = Indian Ocean trench/fracture teaching tag.",
    "Türkiye clock: **N = Black**, **S = Mediterranean**, **W = Aegean**, **NW = Marmara**. West→east ladder: **Mediterranean → Black → Caspian → Aral**.",
    "**Gaza** faces the **Mediterranean**. Baltic coasts include Denmark, Germany, Poland, Baltic States, Russia, Finland, Sweden — **not Norway**. **Jordan** has no Mediterranean coast (only **Aqaba** / Red Sea).",
    "Warm currents raise coastal temperature and humidity; cold currents cool and dry coasts and help west-coast deserts. Fog is common where warm and cold currents meet.",
    "Coral needs warm clear shallow water; bleaching pairs with about **2°C** sea-surface warming. India’s reef facts: Andaman & Nicobar, Lakshadweep, Gulf of Mannar, Gulf of Kachchh.",
    "Hormuz oil/LNG chokepoint: roughly **20 mb/d** oil products (~**25%** seaborne oil) and ~**20%** world LNG in recent baseline years; most flows go to **Asia**.",
    "Only **Saudi Arabia** and the **UAE** have meaningful pipeline routes that can skip Hormuz; Iraq, Kuwait, Qatar, Bahrain and Iran lean almost entirely on the strait.",
    "**BBNJ 2023** is the high-seas biodiversity treaty path; UNCLOS **12 / 24 / 200 nm** belts remain the distance spine.",
    "Canary and California are **cold** eastern-boundary currents; Gulf Stream and Kuroshio are **warm** western-boundary currents.",
    "Somali upwelling is a seasonal Indian Ocean west-coast upwelling fact tied to monsoon winds.",
    "North Atlantic Deep Water / thermohaline “conveyor” links dense sinking in high latitudes to global deep circulation.",
    "India’s inland waterway **NW-1** is the **Ganga** from Haldia to Prayagraj — a waterway fact often parked beside ocean chapters in mixed papers.",
]

QUIZ_16 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
By area, the correct ocean order is:

A. Pacific > Indian > Atlantic > Southern > Arctic
B. Pacific > Atlantic > Indian > Southern > Arctic
C. Atlantic > Pacific > Indian > Arctic > Southern
D. Pacific > Atlantic > Southern > Indian > Arctic

<details>
<summary>Show answer</summary>

**Ans: B.** Pacific > Atlantic > Indian > Southern > Arctic.

**Logic:** Indian vs Southern order is a frequent swap.

</details>

**Q2.**
Which trench–ocean pair is correct?

A. Mariana — Atlantic
B. Puerto Rico — Pacific
C. Sunda/Java — Indian
D. Molloy — Pacific

<details>
<summary>Show answer</summary>

**Ans: C.** Sunda/Java trench = **Indian Ocean**.

**Logic:** Mariana–Pacific, Puerto Rico–Atlantic, Molloy–Arctic.

</details>

**Q3.**
With reference to ocean currents, which of the following is/are correct?

1. Agulhas is warm.
2. Benguela is a Pacific cold current.
3. Humboldt (Peru) is cold.

A. 1 and 3
B. Only 2
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 3 are correct.

**Logic:** Benguela is **Atlantic** cold off SW Africa, not Pacific.

</details>

**Q4.**
Assertion (A): Open-ocean salinity maximum lies near the Tropics of Cancer and Capricorn.
Reason (R): Equatorial waters always have the highest salinity because of strongest heating.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** Heavy equatorial rainfall lowers equatorial salinity relative to the subtropical highs.

</details>

**Q5.**
Spring and neap tides are correctly paired with:

A. Syzygy — small; quadrature — large
B. Syzygy — large; quadrature — small
C. Both always equal
D. Only solar distance matters

<details>
<summary>Show answer</summary>

**Ans: B.** Syzygy (new/full) = spring/large; quadrature = neap/small.

**Logic:** Straight-line alignment vs right-angle Moon–Sun geometry.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Canal) | List-II (Link) |
|---|---|
| 1. Suez | A. Mediterranean–Red Sea (sea-level) |
| 2. Panama | B. Atlantic/Caribbean–Pacific (stepped chambers) |
| 3. Kiel | C. North Sea–Baltic |
| 4. Hormuz | D. Persian Gulf–Gulf of Oman strait |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Canal/strait pairs as taught.

**Logic:** Row order is not the answer code. Suez vs Panama chamber trap is central.

</details>

**Q7.**
UNCLOS distances for territorial sea, contiguous zone and EEZ are:

A. 12, 24, 200 nm
B. 24, 12, 200 nm
C. 12, 200, 350 nm
D. 3, 12, 200 nm

<details>
<summary>Show answer</summary>

**Ans: A.** **12 / 24 / 200 nm**.

**Logic:** 350 nm is a possible continental-shelf outer limit, not the EEZ figure.

</details>

**Q8.**
India’s operational Antarctic stations are:

A. Maitri and Dakshin Gangotri
B. Maitri and Bharati
C. Himadri and Bharati
D. Bharati and Himadri only

<details>
<summary>Show answer</summary>

**Ans: B.** Operational pair = **Maitri and Bharati**.

**Logic:** Dakshin Gangotri is not the living operational pair; Himadri is Arctic.

</details>

**Q9.**
Which statement about the Strait of Hormuz is correct?

A. It joins the Red Sea and Mediterranean
B. Northern shore is mainly Oman; southern shore is Iran
C. It joins the Persian Gulf and the Gulf of Oman; Iran north, Oman south
D. It is an Atlantic chokepoint

<details>
<summary>Show answer</summary>

**Ans: C.** Hormuz = Persian Gulf ↔ Gulf of Oman; **Iran north / Oman south**.

**Logic:** Shore swap and Red Sea confusion are common.

</details>

**Q10.**
El Niño’s biological effect off Peru is typically:

A. Stronger upwelling and more fish
B. Weaker upwelling and fewer plankton/fish
C. No change in upwelling
D. Permanent ice cover

<details>
<summary>Show answer</summary>

**Ans: B.** Warm phase → **less upwelling** → less plankton and fish.

**Logic:** Warm water ≠ more fish in this eastern Pacific case.

</details>

**Q11.**
Consider the following statements:

1. India’s west continental shelf is wider than the east.
2. Bombay High sits on the wide western shelf.
3. Telegraphic Plateau is an Indian Ocean land plateau.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Telegraphic Plateau = North Atlantic Ridge feature.

</details>

**Q12.**
Which deposit type is siliceous?

A. Globigerina ooze
B. Pteropod ooze
C. Diatom ooze
D. All calcareous oozes

<details>
<summary>Show answer</summary>

**Ans: C.** Diatom (and radiolarian) oozes are **siliceous**.

**Logic:** Globigerina/pteropod are calcareous.

</details>

**Q13.**
Assertion (A): Suez Canal ships must climb stepped chambers like Panama.
Reason (R): Suez is a sea-level cut between the Mediterranean and the Red Sea.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Panama uses stepped chambers / Gatun Lake; Suez does not.

</details>

**Q14.**
The Bay of Fundy is famous for:

A. Lowest salinity
B. Greatest tidal range
C. Deepest trench
D. Warmest surface water

<details>
<summary>Show answer</summary>

**Ans: B.** Greatest tidal range teaching tag.

**Logic:** Hooghly/Amazon are tidal-bore pairs; Fundy is range.

</details>

**Q15.**
Which current is cold?

A. Brazil
B. Agulhas
C. California
D. Kuroshio

<details>
<summary>Show answer</summary>

**Ans: C.** California is a cold eastern-boundary current.

**Logic:** Brazil, Agulhas and Kuroshio are warm.

</details>

**Q16.**
With reference to polar presence, which is/are correct?

1. Antarctic Treaty ~1959/61; India joined 1983.
2. Himadri is India’s Arctic station.
3. India is a full member (not observer) of the Arctic Council.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** India is an **observer** in the Arctic Council.

</details>

**Q17.**
Coral bleaching is commonly paired with sea-surface warming of about:

A. 0.2°C
B. 2°C
C. 12°C
D. 20°C

<details>
<summary>Show answer</summary>

**Ans: B.** About **2°C** warming is the teaching bleach pair.

**Logic:** India’s reef belts remain Andaman–Nicobar, Lakshadweep, Mannar, Kachchh.

</details>

**Q18.**
Which country list for Persian Gulf coasts is correct in the usual set?

A. Includes Oman as a main Gulf littoral like UAE
B. Iran, Iraq, Kuwait, Saudi Arabia, Bahrain, Qatar, UAE — not Oman
C. Only Iran and Saudi Arabia
D. Includes Jordan

<details>
<summary>Show answer</summary>

**Ans: B.** Oman is on the Gulf of Oman / Hormuz south shore, not the classic Persian Gulf littoral list.

**Logic:** Jordan’s sea window is Aqaba/Red Sea.

</details>

**Q19.**
Arrange Suez Canal lakes from north to south:

1. Great Bitter
2. Manzala
3. Timsah
4. Little Bitter

A. 2–3–1–4
B. 3–2–1–4
C. 2–1–3–4
D. 1–2–3–4

<details>
<summary>Show answer</summary>

**Ans: A.** Manzala → Timsah → Great Bitter → Little Bitter.

**Logic:** North (Port Said) to south (Suez) lake ladder.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. Datum line — mean sea level reference
B. Sargasso — North Atlantic, no coast
C. Upwelling — strongest on east coasts of continents only
D. Grand Banks — Labrador meets Gulf Stream fishery

<details>
<summary>Show answer</summary>

**Ans: C.** Upwelling is strongest on **west coasts** (Peru, California, Canary, Benguela, Somalia).

**Logic:** Eastern-boundary cold currents drive classic upwelling.

</details>
'''

FACTS_17 = [
    "**New Orleans** stands on the **Mississippi**, not the Missouri. The Missouri joins the Mississippi at **St Louis**.",
    "**Budapest** is on the **Danube**. **Cologne** is on the **Rhine**. India’s **Hyderabad** is on the **Musi**, not the Godavari or Paleru.",
    "The **Mekong** rises in Tibet, flows **south / south-east**, and builds its delta in **southern Vietnam** — not Cambodia and not south-west.",
    "Direction pairs: **Amur** north-east; **Syr Darya** north-west into the Aral; **Angara** north out of Baikal; **Volga** from the Valdai Hills into the **Caspian**.",
    "The main USA–Mexico border river is the **Rio Grande**. The **Colorado** is the usual trap option for that border stem.",
    "**Lake Onega** is in **Russia**, not Canada. **Lake Michigan** lies wholly in the **USA**. **Maracaibo** is in Venezuela. **Baikal** is in Russia.",
    "Superlatives: the **Nile** is longest for Prelims teaching; the **Amazon** has the largest discharge; the **Congo** is deepest and crosses the Equator **twice**; the **Yangtze** is Asia’s longest; the **Volga** is Europe’s longest.",
    "Delta shapes: **Mississippi** = bird’s-foot; **Nile**, **Hwang Ho**, and **Niger** = arcuate (bow).",
    "The **Danube** crosses the most countries. The **Rhine** is Europe’s busiest navigation artery.",
    "**Khartoum** is where the White and Blue Nile meet. **Aswan** created **Lake Nasser**. **GERD** sits on the **Blue Nile** in Ethiopia.",
    "Dam pairs: **Three Gorges–Yangtze**, **Aswan–Nile**, **Itaipu–Paraná**, **Hoover–Colorado**, **Kariba–Zambezi**.",
    "The **Caspian** is the largest lake. **Superior** is the largest freshwater lake by area. **Baikal** is deepest, holds the most fresh volume, and is among the oldest.",
    "**Tanganyika** is second deepest and the longest freshwater lake. **Titicaca** is the highest navigable lake. The **Dead Sea** is the lowest land surface and is hypersaline (~**34%** salt).",
    "Great Lakes west to east: **Superior → Michigan → Huron → Erie → Ontario** (Super Man Helps Every One).",
    "Falls: **Angel** (Venezuela) is highest; **Victoria** is on the Zambezi; **Niagara** is US–Canada; **Iguazu** is Brazil–Argentina.",
    "The **St Lawrence** is the Great Lakes seaway. The **Rhine–Main–Danube** canal links the Black Sea system to the Rhine.",
    "The **Aral Sea** shrinks mainly because the **Amu Darya** and **Syr Darya** were diverted. **Lake Chad** is also shrinking.",
    "The **Niger** is the paradox river that first flows inland. The Congo is also known as the **Zaire**.",
    "The **Darling Range** is a highland of south-west Australia. It is **not** the same as the **Murray–Darling** river system.",
    "**Endorheic** lakes have no ocean outlet — Caspian, Aral, Dead Sea, Chad, and Eyre.",
    "City–river pairs: **Baghdad–Tigris**, **Paris–Seine**, **London–Thames**, **Cairo–Nile**, Phnom Penh–Mekong, Hanoi–Red, Yangon–Irrawaddy, Bangkok–Chao Phraya, Basra–Shatt al-Arab.",
    "Lake types include tectonic/rift, glacial, crater, lagoon, oxbow and artificial reservoir.",
    "Continent spine: Nile (Africa), Amazon (South America), Yangtze (Asia), Mississippi–Missouri (North America), Volga (Europe), Murray–Darling (Australia).",
    "**Limpopo** crosses the Tropic of Capricorn **twice**. **Congo/Zaire** crosses the Equator **twice**.",
    "**Mahaweli** = longest Sri Lanka river; Sri Lanka drainage is **radial** from central highlands.",
    "**Grand Canyon** = Colorado. **Chisapani Gorge** = Nepal (Karnali). Largest delta = **Ganga–Brahmaputra**. Inselberg ≠ glacier.",
    "Delta mouths: Mekong → **South China Sea**; Nile → **Mediterranean**; Mississippi → **Gulf of Mexico**; Danube → **Black Sea**; Indus → **Arabian Sea**.",
    "Border rivers beyond Rio Grande: **Amur** (Russia–China), **Orange** (South Africa–Namibia), **Zambezi** (Zambia–Zimbabwe at Victoria Falls).",
    "More dam–river pairs: **Guri–Caroní** (Venezuela), **Tucuruí–Tocantins** (Brazil), **Grand Coulee–Columbia** (USA), **Tarbela–Indus** (Pakistan).",
    "Yangtze chain: Tibetan Plateau → China → **Three Gorges** → Shanghai belt → **East China Sea**.",
    "Nile chain: Victoria / Tana → Sudan–Egypt → **Aswan High Dam** → Nile Delta → **Mediterranean**.",
    "Only a marked stretch of a river is the international border — do not treat the whole Mekong or Colorado course as one continuous border.",
    "Navigation classics include the Rhine, Danube, Volga, St Lawrence, Yangtze and Mississippi.",
    "Madrid–Manzanares is a European capital–river pair often used against inventing a Tagus-only Madrid key.",
    "Victoria Falls is on the **Zambezi**; Niagara is US–Canada; do not park Angel Falls on the Zambezi.",
    "Lake Michigan is wholly USA; Superior/Huron/Erie/Ontario are shared — Michigan’s “wholly USA” tag is the trap.",
    "Dead Sea hypersalinity (~34%) and lowest land surface tag differ from Baikal’s fresh-volume / depth tag.",
    "Murray–Darling is Australia’s classic basin; Darling **Range** is a SW highland — name overlap is intentional trap fuel.",
    "Itaipu is on the **Paraná**; Hoover on the **Colorado**; Kariba on the **Zambezi** — dam–river swaps are frequent.",
    "Amazon discharge leadership does not make it the “longest river” key when the stem asks length (Nile teaching key).",
    "White Nile / Blue Nile confluence at **Khartoum** precedes the Egyptian main Nile; GERD is Ethiopian Blue Nile.",
    "Endorheic Aral shrinkage is diversion-driven; do not blame only climate without the Amu–Syr diversion story.",
    "Rhine–Main–Danube canal creates a North Sea–Black Sea inland link via the Rhine and Danube systems.",
    "Titicaca = highest navigable; Tanganyika = longest freshwater / second deepest — do not swap with Baikal depth leadership.",
    "Inselberg is a residual / wind-related residual hill tag in teaching, not a glacial horn.",
]

QUIZ_17 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
New Orleans stands on which river?

A. Missouri
B. Mississippi
C. Ohio
D. Colorado

<details>
<summary>Show answer</summary>

**Ans: B.** New Orleans = **Mississippi**.

**Logic:** Missouri joins the Mississippi at St Louis — common trap.

</details>

**Q2.**
With reference to the Mekong, which of the following statements is/are correct?

1. It rises in Tibet.
2. It flows mainly south / south-east.
3. Its delta lies in Cambodia.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Delta is in **southern Vietnam**, not Cambodia.

</details>

**Q3.**
Which lake lies wholly in the USA?

A. Superior
B. Huron
C. Michigan
D. Ontario

<details>
<summary>Show answer</summary>

**Ans: C.** **Michigan** is wholly USA.

**Logic:** Other Great Lakes are shared with Canada.

</details>

**Q4.**
Assertion (A): The Amazon is usually keyed as the world’s longest river in length stems.
Reason (R): The Amazon has the world’s largest discharge.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false (Nile is the usual length key); R is true.

**A/R logic:** Length vs discharge must stay separate.

</details>

**Q5.**
The Grand Canyon is formed by the:

A. Missouri
B. St Lawrence
C. Colorado
D. Ohio

<details>
<summary>Show answer</summary>

**Ans: C.** Grand Canyon = **Colorado**.

**Logic:** UKPCS/UPPCS style trap options often plant Missouri/St Lawrence.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Dam) | List-II (River) |
|---|---|
| 1. Three Gorges | A. Yangtze |
| 2. Itaipu | B. Paraná |
| 3. Hoover | C. Colorado |
| 4. Kariba | D. Zambezi |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Standard dam–river pairs.

**Logic:** Row order is not the answer code.

</details>

**Q7.**
Great Lakes from west to east are:

A. Michigan → Superior → Huron → Erie → Ontario
B. Superior → Michigan → Huron → Erie → Ontario
C. Superior → Huron → Michigan → Erie → Ontario
D. Superior → Michigan → Erie → Huron → Ontario

<details>
<summary>Show answer</summary>

**Ans: B.** Superior → Michigan → Huron → Erie → Ontario.

**Logic:** “Super Man Helps Every One” mnemonic.

</details>

**Q8.**
Which river crosses the Equator twice?

A. Nile
B. Limpopo
C. Congo / Zaire
D. Niger

<details>
<summary>Show answer</summary>

**Ans: C.** Congo/Zaire crosses the Equator **twice**.

**Logic:** Limpopo crosses Capricorn twice.

</details>

**Q9.**
Hyderabad (India) is on the:

A. Godavari
B. Musi
C. Paleru
D. Krishna

<details>
<summary>Show answer</summary>

**Ans: B.** Hyderabad = **Musi**.

**Logic:** Godavari/Paleru are classic wrong options.

</details>

**Q10.**
Which of the following is endorheic?

A. Superior
B. Baikal
C. Caspian
D. Victoria

<details>
<summary>Show answer</summary>

**Ans: C.** Caspian (also Aral, Dead Sea, Chad, Eyre) has no ocean outlet.

**Logic:** Baikal/Superior/Victoria drain toward seas via river systems.

</details>

**Q11.**
Consider the following pairs:

1. Budapest — Danube
2. Cologne — Rhine
3. Baghdad — Euphrates only

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Baghdad = **Tigris** in the usual pair (not Euphrates-only).

</details>

**Q12.**
Aral Sea shrinkage is mainly linked to diversion of:

A. Nile and Congo
B. Amu Darya and Syr Darya
C. Volga and Don
D. Amur and Yangtze

<details>
<summary>Show answer</summary>

**Ans: B.** Amu Darya and Syr Darya diversion.

**Logic:** Lake Chad is the other shrinking-lake teaching pair.

</details>

**Q13.**
Assertion (A): Darling Range and Murray–Darling refer to the same Australian river system.
Reason (R): Darling Range is a highland of south-west Australia.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Name overlap is the trap; Range ≠ basin.

</details>

**Q14.**
Highest waterfall in the usual set is:

A. Victoria
B. Niagara
C. Angel
D. Iguazu

<details>
<summary>Show answer</summary>

**Ans: C.** **Angel** (Venezuela) is highest.

**Logic:** Victoria = Zambezi width/fame; Niagara = US–Canada.

</details>

**Q15.**
GERD is located on the:

A. White Nile in Sudan
B. Blue Nile in Ethiopia
C. Main Nile at Aswan
D. Atbara in Egypt

<details>
<summary>Show answer</summary>

**Ans: B.** GERD = **Blue Nile, Ethiopia**.

**Logic:** Aswan/Lake Nasser is the Egyptian Nile dam pair.

</details>

**Q16.**
Which delta mouth pairing is correct?

A. Nile — South China Sea
B. Mekong — Mediterranean
C. Danube — Black Sea
D. Mississippi — Arabian Sea

<details>
<summary>Show answer</summary>

**Ans: C.** Danube → **Black Sea**.

**Logic:** Nile–Mediterranean; Mekong–South China Sea; Mississippi–Gulf of Mexico; Indus–Arabian Sea.

</details>

**Q17.**
Lake Baikal is best known as:

A. Largest lake by area
B. Deepest lake with greatest fresh volume
C. Highest navigable lake
D. Lowest land surface

<details>
<summary>Show answer</summary>

**Ans: B.** Baikal = deepest / most fresh volume / ancient.

**Logic:** Caspian largest area; Titicaca highest navigable; Dead Sea lowest land.

</details>

**Q18.**
USA–Mexico border river in the usual stem is:

A. Colorado
B. Rio Grande
C. Mississippi
D. Columbia

<details>
<summary>Show answer</summary>

**Ans: B.** **Rio Grande**.

**Logic:** Colorado is the planted trap.

</details>

**Q19.**
Arrange Great Lakes west to east starting from Superior:

1. Erie
2. Michigan
3. Huron
4. Ontario

A. 2–3–1–4
B. 3–2–1–4
C. 2–1–3–4
D. 2–3–4–1

<details>
<summary>Show answer</summary>

**Ans: A.** Michigan → Huron → Erie → Ontario after Superior.

**Logic:** Same as full west→east mnemonic without renaming Superior.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. Mahaweli — longest Sri Lanka river
B. Limpopo — crosses Capricorn twice
C. Inselberg — glacial horn
D. St Lawrence — Great Lakes seaway

<details>
<summary>Show answer</summary>

**Ans: C.** Inselberg is not a glacial horn tag.

**Logic:** Glacial horns/arêtes are ice-erosion forms; inselberg is residual.

</details>
'''

FACTS_18 = [
    "Area order (largest → smallest): **Asia → Africa → North America → South America → Antarctica → Europe → Australia**. Australia is the **smallest** continent; Africa has the **most countries (~54)**.",
    "Mean elevation leader is **Antarctica** (~2300 m). Europe has the **highest share of plains** in its area. **Guyana** is in **South America**, not Africa.",
    "The **Andes** are the world’s **longest** fold chain. The **Himalaya** are the **highest**. **Aconcagua** stands in the Andes of Argentina.",
    "Length ladder pair: Andes > Rockies > Great Dividing Range > Himalaya.",
    "**Pyrenees** = Spain–France; **Alps** = Switzerland / central Europe (**not England**); **Apennine** = Italy; **Balkan** = Bulgaria; **Urals** mark Europe–Asia.",
    "**Toubkal** (Atlas) is in **Morocco**. **Hoggar** is in **Algeria**. **Stanley / Rwenzori** is in Uganda. **Kilimanjaro** is in **Tanzania**. **Darling Range** = SW Australia.",
    "**Chimborazo** is in **Ecuador**. The Atlas system is North African. **Sierra Nevada** = block mountain (not young fold like Rockies/Alps/Himalaya).",
    "**Kilimanjaro** sits on the **East African Rift** and is **not** in the Pacific Ring of Fire. **Etna** is in Italy / the Mediterranean.",
    "Tertiary young folds: Alps, Andes, Himalaya, Rockies, Atlas; Appalachians = **Caledonian / old** residual fold belt.",
    "**Tibet** is the highest large plateau (~4500 m). The **Pamir** is the “**Roof of the world**”. The **Altiplano** is Bolivia–Peru. The **Meseta** / Madrid is Spain.",
    "The **Colorado Plateau** holds the Grand Canyon. The **Columbia Plateau** is a lava plateau. Do not swap the two. **Telegraphic Plateau** sits on the **North Atlantic Ridge**.",
    "Grassland names: **Pampas** = Argentina; **Campos** = Brazil; **Llanos** = Venezuela–Colombia; **Puszta** = Hungary; **Prairie** = North America; **Steppe** = Eurasia; **Veld** = South Africa; **Downs** = Australia.",
    "**Borneo** is shared by three countries and is **not** a volcanic dump. **Java** and **Sumatra** sit on a volcanic arc.",
    "Island rank by size: **Greenland > New Guinea > Borneo > Madagascar > Baffin > Sumatra > Honshu > Victoria > Great Britain > Ellesmere**. Australia is a continent, not ranked as an island here.",
    "**Honshu** = Japan’s largest island; **Faroe** = Sheep Islands (Denmark).",
    "The **Gobi** lies in **Mongolia and China** only. It is a cold desert, not Russia or Kazakhstan.",
    "Hot-desert size order: **Great Sandy < Gobi < Arabian < Sahara**. The **Sahara** is the largest hot desert. **Thar** = densest populated desert; **Atacama** = driest.",
    "**Gibson** = Australia (not Brazil). **Sonoran** = USA. **Taklamakan** = China. **Karakum** = Turkmenistan.",
    "The **Atacama** (N Chile / S Peru) is the driest. The **Namib** is a fog coast. **Patagonia** is Argentina’s rain-shadow / temperate desert.",
    "Hot deserts favour **west coasts** because of Horse Latitudes plus cold ocean currents (~15–30°).",
    "“Land of Big Games” points to the tropical **savanna**, not the Sahara.",
    "Sclerophyll scrub: **Maquis** = Mediterranean; **Fynbos** = South Africa; **Chaparral** = California; **Matorral** = Chile.",
    "**Epiphytes** mark equatorial forest; **baobab** marks savanna; **cedars** mark the Mediterranean; **acacia** marks the Sahara fringe.",
    "In Brazil, **Selva** is the rainforest and **Terra Roxa** is the famous coffee soil.",
    "The **Mediterranean** climate has **winter rain** on five **west coasts** near **30–45°**. Summer is dry under the subtropical high.",
    "**Taiga** is boreal conifer forest. **Tundra** is treeless. Climate letters: Savanna **Aw**, Steppe **BS**, Tundra **ET**.",
    "Volcano pairs: **Rainier** USA; **Etna** Italy; **Paricutin** Mexico; **Apo** Philippines; also Fuji (Japan), Pinatubo (Philippines), St Helens (USA).",
    "Peak continents: **Elbrus** = Europe (Caucasus / Russia); **Mont Blanc** = Alps; **Denali / McKinley** = North America; **Kosciuszko** = Australia mainland; **Cook / Aoraki** = New Zealand.",
    "Temperate grasslands (Prairie, Steppe, Pampas, Veld, Downs) sit on **chernozem**-type wheat soils.",
    "**Death Valley** (California) = rift valley, extreme heat. **Silicon Valley** = California chip belt. **Great Artesian Basin** = Australia. Blind valley / sinkhole = **karst**.",
    "**Arakan Yoma** = Myanmar. **Golan Heights** = Middle East (SW Syria / occupied note). **Black Forest** = Germany (east of Rhine; Vosges west).",
    "Plateau types: intermontane (**Tibet**), piedmont, and volcanic / lava (**Columbia**, Deccan).",
    "Valley tags: rift valleys (East Africa, Rhine), glacial U-valleys, and structural vales.",
    "Residual and dome mountains are worn or laccolith leftovers, not young fold belts like the Himalaya.",
    "British Columbia = “Sea of Mountains.” **Patagonia Plateau** = mineral storehouse pair in coaching notes.",
    "Europe has the least desertification problem among continents in the usual teaching contrast.",
    "Young fold vs block: Rockies/Alps/Himalaya/Andes = fold; Sierra Nevada / Vosges–Black Forest class = block / rift flanks.",
    "Equatorial rainforest ≠ Mediterranean sclerophyll ≠ taiga conifers — vegetation belts follow climate, not continent labels alone.",
    "Savanna Aw climate supports large herbivore / “big game” parks; hot desert does not get that tag.",
    "Island size list excludes Australia as an island; Greenland remains largest island.",
    "Atacama dryness pairs with cold current + subtropical high on a west coast — same logic as Namib fog-coast desert.",
    "Pamir phrase “Roof of the world” ≠ Tibet “highest large plateau” — keep the two plateau tags distinct.",
    "Appalachians are old/Caledonian; do not park them with Tertiary Alps–Himalaya–Andes–Rockies young folds.",
    "Pampas–Argentina vs Campos–Brazil vs Llanos–Venezuela/Colombia is the South American grassland triangle.",
    "Maquis–Mediterranean vs Chaparral–California vs Fynbos–South Africa vs Matorral–Chile is the sclerophyll west-coast set.",
]

QUIZ_18 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
Which continent has the most countries?

A. Asia
B. Europe
C. Africa
D. South America

<details>
<summary>Show answer</summary>

**Ans: C.** Africa (~**54** countries).

**Logic:** Asia is largest by area, not by country count.

</details>

**Q2.**
With reference to fold mountains, which of the following is/are correct?

1. Andes are the longest fold chain.
2. Himalaya are the highest.
3. Aconcagua stands in the Rockies of the USA.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Aconcagua = Andes of **Argentina**.

</details>

**Q3.**
Kilimanjaro is correctly placed on the:

A. Pacific Ring of Fire
B. East African Rift
C. Mid-Atlantic Ridge
D. Andes volcanic belt

<details>
<summary>Show answer</summary>

**Ans: B.** East African Rift; not Ring of Fire.

**Logic:** Fuji/Pinatubo/St Helens are Circum-Pacific distractors.

</details>

**Q4.**
Assertion (A): Hot deserts favour west coasts near 15–30° latitudes.
Reason (R): Cold ocean currents and subtropical highs promote aridity on those coasts.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: D.** Both true and R explains A.

**A/R logic:** East-coast desert claims reverse the standard pattern.

</details>

**Q5.**
Pampas and Campos are correctly matched with:

A. Brazil and Argentina respectively
B. Argentina and Brazil respectively
C. Both Argentina
D. Venezuela and Chile

<details>
<summary>Show answer</summary>

**Ans: B.** Pampas = **Argentina**; Campos = **Brazil**.

**Logic:** Llanos = Venezuela–Colombia.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Scrub) | List-II (Region) |
|---|---|
| 1. Maquis | A. Mediterranean |
| 2. Fynbos | B. South Africa |
| 3. Chaparral | C. California |
| 4. Matorral | D. Chile |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Sclerophyll west-coast set.

**Logic:** Row order is not the answer code.

</details>

**Q7.**
Largest island in the usual ranked list is:

A. New Guinea
B. Borneo
C. Greenland
D. Madagascar

<details>
<summary>Show answer</summary>

**Ans: C.** **Greenland** is largest; Australia is a continent.

**Logic:** New Guinea is second.

</details>

**Q8.**
Gobi desert lies in:

A. Mongolia and Kazakhstan
B. Mongolia and China only
C. Russia and China
D. Turkmenistan only

<details>
<summary>Show answer</summary>

**Ans: B.** Gobi = **Mongolia and China**; cold desert.

**Logic:** Karakum = Turkmenistan; Kazakhstan is a planted fringe trap.

</details>

**Q9.**
“Land of Big Games” points to:

A. Hot desert
B. Tropical savanna
C. Tundra
D. Taiga

<details>
<summary>Show answer</summary>

**Ans: B.** Tropical **savanna**.

**Logic:** Sahara safari wording is the distractor.

</details>

**Q10.**
Mediterranean climate rain is mainly in:

A. Summer
B. Winter
C. All months equally like Western Europe westerlies
D. Only equatorial convection months

<details>
<summary>Show answer</summary>

**Ans: B.** Mediterranean = **winter rain**, dry summer.

**Logic:** Do not confuse with all-month westerly Western Europe.

</details>

**Q11.**
Consider the following statements:

1. Tibet is the highest large plateau.
2. Pamir is phrased as Roof of the world.
3. Columbia Plateau holds the Grand Canyon.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Grand Canyon = **Colorado Plateau**; Columbia = lava plateau.

</details>

**Q12.**
Which peak–continent pair is correct?

A. Elbrus — Asia only (exclude Europe)
B. Denali — South America
C. Kosciuszko — Australia mainland
D. Aconcagua — Africa

<details>
<summary>Show answer</summary>

**Ans: C.** Kosciuszko = Australia mainland high peak teaching tag.

**Logic:** Elbrus = Europe (Caucasus/Russia); Denali = North America; Aconcagua = South America.

</details>

**Q13.**
Assertion (A): Sierra Nevada is a young fold mountain of the Rockies class.
Reason (R): Block mountains rise by faulting rather than simple young folding.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false; R is true.

**A/R logic:** Sierra Nevada = block mountain tag.

</details>

**Q14.**
Taiga and tundra differ because:

A. Both are treeless
B. Taiga is conifer forest; tundra is treeless
C. Tundra is equatorial rainforest
D. Taiga is hot desert scrub

<details>
<summary>Show answer</summary>

**Ans: B.** Taiga = boreal conifers; tundra = treeless cold.

**Logic:** Climate letters Aw/BS/ET help separate savanna/steppe/tundra.

</details>

**Q15.**
Which desert is the driest in the usual set?

A. Thar
B. Sahara
C. Atacama
D. Gobi

<details>
<summary>Show answer</summary>

**Ans: C.** **Atacama** = driest; Thar = densest populated desert; Sahara = largest hot desert.

**Logic:** Keep size / dryness / population tags separate.

</details>

**Q16.**
Gibson and Sonoran deserts are in:

A. Brazil and USA
B. Australia and USA
C. China and Australia
D. USA and Turkmenistan

<details>
<summary>Show answer</summary>

**Ans: B.** Gibson = **Australia**; Sonoran = **USA**.

**Logic:** Gibson–Brazil is a planted trap.

</details>

**Q17.**
Which of the following is/are young Tertiary fold mountains?

1. Alps
2. Appalachians
3. Andes
4. Himalaya

A. 1, 3 and 4
B. Only 2
C. 2 and 3
D. 1 and 2

<details>
<summary>Show answer</summary>

**Ans: A.** Appalachians are old/Caledonian, not Tertiary young folds.

**Logic:** Alps–Andes–Himalaya–Rockies–Atlas are the young set.

</details>

**Q18.**
Borneo differs from Java because Borneo is:

A. A pure volcanic-arc dump like Java
B. Shared by three countries and not a volcanic dump
C. Entirely in the Philippines
D. Larger than Greenland

<details>
<summary>Show answer</summary>

**Ans: B.** Borneo = three countries; not volcanic dump; Java/Sumatra = volcanic arc.

**Logic:** “All Indonesia = volcano” overgeneralises.

</details>

**Q19.**
Continent area order places Australia:

A. Larger than Europe
B. Smallest among the seven
C. Second after Asia
D. Larger than Antarctica

<details>
<summary>Show answer</summary>

**Ans: B.** Australia is the **smallest** continent.

**Logic:** Asia > Africa > NA > SA > Antarctica > Europe > Australia.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. Chernozem — temperate grassland wheat soils
B. Selva — Brazilian rainforest
C. Epiphytes — hot desert marker
D. Namib — fog-coast desert

<details>
<summary>Show answer</summary>

**Ans: C.** Epiphytes mark **equatorial forest**, not hot desert.

**Logic:** Baobab/acacia are the dry/savanna fringe markers.

</details>
'''

FACTS_19 = [
    "Continent area order: **Asia > Africa > North America > South America > Antarctica > Europe > Australia/Oceania**.",
    "The **Nobi** and **Kanto** plains are in **Japan**, not Korea.",
    "Iraq’s **Sunni Triangle** is **Baghdad, Tikrit, and Ramadi**. **Basra** (Shia south) is the trap.",
    "West Asia mountains west to east: **Pontic → Zagros → Hindu Kush → Karakoram**.",
    "Central Asia capitals: Uzbekistan **Tashkent**, Tajikistan **Dushanbe**, Kyrgyzstan **Bishkek**, Turkmenistan **Ashgabat**, Kazakhstan **Astana**.",
    "The **Kara Kum** desert is in **Turkmenistan**. **Kyzylkum** is the neighbouring “red sand” pair often contrasted with Kara Kum.",
    "**Borneo** is shared by Indonesia, Malaysia, and Brunei and is **not** a volcanic island dump.",
    "Philippines cane and coconut history fact: **Spanish and Americans** (not British/Dutch as the first key).",
    "Korea: **Seoul** south, **Pyongyang** north, roughly the **38th parallel**. Nobi/Kanto are not Korean plains.",
    "Palestine map: **Gaza** on the Egypt side, **West Bank** on the Jordan side, with the **Jordan River / Dead Sea** belt.",
    "Western Europe has **westerlies** and rain in **all months** (not Mediterranean winter-only).",
    "The **Suez Canal** shortened the India–Europe sea route by about **7000 km**.",
    "**Cape Verde**’s capital is **Praia**. **Bamako** is Mali’s capital — do not swap them.",
    "Maghreb capitals: Morocco **Rabat**, Algeria **Algiers**, Tunisia **Tunis**. Maghreb ≠ Sahel.",
    "Brazil points: **Selva** rainforest and **Terra Roxa** coffee soil are both true.",
    "Australia’s **interior is desert**. The **north is tropical**, not temperate. The **Darling Range** lies in **south-west** Australia.",
    "India’s operational Antarctic stations are **Maitri** and **Bharati**. **Dakshin Gangotri** is not the operational answer.",
    "**Madeira** is Atlantic Portugal and is **not** Caribbean.",
    "Indonesia west to east: **Sumatra → Java → Bali → Lombok**.",
    "The **Mekong** delta is in **southern Vietnam**, not Cambodia.",
    "South America’s landlocked pair is **Bolivia** and **Paraguay**. Uruguay, Peru, and Suriname have coasts.",
    "**Igarka** is in **Russia**, not China.",
    "New Zealand’s capital is **Wellington**. NZ has North and South Islands with **Cook Strait** and is **not** an Australian state.",
    "**Ethiopia** is landlocked after Eritrea’s secession; **Eritrea** holds the Red Sea coast. The Horn is Ethiopia–Somalia–Eritrea–Djibouti.",
    "Only **double-landlocked** states in the usual set are **Uzbekistan** and **Liechtenstein**.",
    "Capitals that are not the country’s most-famous tourist city: Turkey **Ankara**, Australia **Canberra**, Brazil **Brasília**, UAE **Abu Dhabi**, NZ **Wellington**.",
    "Boundary parallels: **38th** ≈ Koreas; **49th** ≈ Canada–USA (western land border).",
    "South Asia map: Nepal and Bhutan are landlocked; Maldives and Sri Lanka are islands; **Kabul** is Afghanistan’s capital.",
    "The Caucasus trio is Georgia–Armenia–Azerbaijan; Istanbul is not Turkey’s capital (**Ankara** is).",
    "**Esperanto** is an artificial world auxiliary language. **Tamil** is an official language of **Singapore**. **Bahasa** = Indonesia (not Thailand).",
    "Spanish is official in Chile/Colombia/Cuba — **not** Congo. Mandarin leads classic L-1 speaker counts; English often leads total L-1+L-2.",
    "Great Lakes west→east: **Superior → Michigan → Huron → Erie → Ontario**. The St Lawrence is the seaway outlet.",
    "Sahel is the semi-arid belt south of the Sahara — not the same as Maghreb (Morocco–Algeria–Tunisia).",
    "Alaska is USA; Greenland is Denmark politically / North America geographically.",
    "East Asia flash cards: Japan’s **Honshu** is the main island; Korea split near the **38th parallel**; China’s capital is **Beijing** (not Shanghai).",
    "Pontic = northern Turkey; Zagros = western Iran — keep the west→east mountain ladder ordered.",
    "ASEAN map diet often tests mainland SE Asia vs island SE Asia; Mekong countries vs maritime chokepoints (Malacca).",
    "Caribbean vs Atlantic island trap: Madeira/Cape Verde are Atlantic African/Portuguese tags, not West Indies.",
    "Landlocked Africa after Eritrea: Ethiopia; South America: Bolivia and Paraguay — do not add Uruguay.",
    "Astana (Kazakhstan) and Ashgabat (Turkmenistan) capital swaps are common Central Asia traps with Tashkent/Dushanbe/Bishkek.",
    "Palestine neighbours include Israel, Jordan, Egypt, Lebanon and Syria — map units remain West Bank and Gaza.",
    "Northern Australia tropical climate ≠ temperate — a frequent Australia climate stem.",
    "Cook Strait separates NZ North and South Islands; it is not an Australian state boundary.",
    "Double-landlocked means every neighbour is landlocked — Uzbekistan (Central Asia) and Liechtenstein (Europe).",
    "Igarka’s Russia tag pairs with other “not China” Siberian place traps in world regional stems.",
]

CA_19 = """## Current Affairs (this topic)

| Year | Fact | Why it matters | Source |
|------|------|----------------|--------|
| Static | Korea **38th** parallel / USA–Canada **49th** parallel | Boundary-line stems | Atlas |
| Static | Central Asian capital set (Tashkent–Dushanbe–Bishkek–Ashgabat–Astana) | Stan capital swaps | Atlas |
| **2023–26** | West Asia / Palestine map units (Gaza, West Bank) remain high-visibility | Map CA without rewriting physical facts | News / UN |
| Static | India Antarctic operational pair **Maitri + Bharati** | Polar station stem | MoES / MEA |
"""

QUIZ_19 = r'''## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

**Q1.**
Nobi and Kanto plains are in:

A. Korea
B. Japan
C. China
D. Vietnam

<details>
<summary>Show answer</summary>

**Ans: B.** Both plains are in **Japan**.

**Logic:** Korea is the planted trap.

</details>

**Q2.**
Iraq’s Sunni Triangle includes:

A. Baghdad, Tikrit and Basra
B. Baghdad, Tikrit and Ramadi
C. Basra, Mosul and Kirkuk only
D. Baghdad, Basra and Ramadi

<details>
<summary>Show answer</summary>

**Ans: B.** Baghdad–Tikrit–**Ramadi**; Basra is Shia south.

**Logic:** Basra substitution is the classic wrong corner.

</details>

**Q3.**
With reference to Central Asia, which pair is/are correct?

1. Tashkent — Uzbekistan
2. Ashgabat — Turkmenistan
3. Bishkek — Tajikistan

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Bishkek = **Kyrgyzstan**; Dushanbe = Tajikistan.

</details>

**Q4.**
Assertion (A): Western Europe receives rainfall in all months under westerlies.
Reason (R): Mediterranean climate also has rainfall in all months like Western Europe.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: C.** A is true; R is false.

**A/R logic:** Mediterranean rain is mainly **winter**.

</details>

**Q5.**
South America’s landlocked countries are:

A. Bolivia and Uruguay
B. Bolivia and Paraguay
C. Paraguay and Peru
D. Bolivia and Suriname

<details>
<summary>Show answer</summary>

**Ans: B.** **Bolivia and Paraguay**.

**Logic:** Uruguay/Peru/Suriname have coasts.

</details>

**Q6.**
Match List-I with List-II and select the correct answer using the code given below the lists:

| List-I (Country) | List-II (Capital) |
|---|---|
| 1. Turkey | A. Ankara |
| 2. Australia | B. Canberra |
| 3. Brazil | C. Brasília |
| 4. New Zealand | D. Wellington |

A. 1-A, 2-B, 3-C, 4-D
B. 1-B, 2-A, 3-C, 4-D
C. 1-A, 2-C, 3-B, 4-D
D. 1-A, 2-B, 3-D, 4-C

<details>
<summary>Show answer</summary>

**Ans: A.** Capitals that are not the tourist-famous cities.

**Logic:** Istanbul/Sydney/Rio/Auckland are distractors outside the key.

</details>

**Q7.**
Double-landlocked states in the usual set are:

A. Uzbekistan and Kazakhstan
B. Uzbekistan and Liechtenstein
C. Liechtenstein and Switzerland
D. Bolivia and Paraguay

<details>
<summary>Show answer</summary>

**Ans: B.** **Uzbekistan** and **Liechtenstein**.

**Logic:** Bolivia/Paraguay are landlocked but not double-landlocked.

</details>

**Q8.**
Madeira is correctly placed in the:

A. Caribbean
B. North-east Atlantic (Portugal)
C. Pacific
D. Red Sea

<details>
<summary>Show answer</summary>

**Ans: B.** Atlantic Portugal — not Caribbean.

**Logic:** West Indies dump is the trap.

</details>

**Q9.**
Australia’s north is mainly:

A. Temperate
B. Tropical
C. Polar
D. Mediterranean only

<details>
<summary>Show answer</summary>

**Ans: B.** Northern Australia = **tropical**; interior = desert.

**Logic:** Temperate is a common wrong climate tag.

</details>

**Q10.**
Which language–place pair is correct?

A. Bahasa — Thailand
B. Tamil — official set in Singapore
C. Spanish — Congo
D. Esperanto — mountain range in Andes

<details>
<summary>Show answer</summary>

**Ans: B.** Tamil is in Singapore’s official set; Bahasa = Indonesia; Esperanto = artificial language.

**Logic:** Language–country swaps are frequent.

</details>

**Q11.**
Consider the following statements:

1. Ethiopia became landlocked after Eritrea’s secession.
2. Eritrea holds Red Sea coast in the Horn.
3. Djibouti is landlocked.

A. 1 and 2
B. Only 3
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 2 are correct.

**Logic:** Djibouti has a coast on the Bab-el-Mandeb approaches.

</details>

**Q12.**
Kara Kum desert is in:

A. Kazakhstan
B. Turkmenistan
C. Tajikistan
D. Kyrgyzstan

<details>
<summary>Show answer</summary>

**Ans: B.** Kara Kum = **Turkmenistan**.

**Logic:** Stan desert/capital swaps cluster together.

</details>

**Q13.**
Assertion (A): Igarka is in China.
Reason (R): Many Siberian place names appear in “not China” traps.

A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)

<details>
<summary>Show answer</summary>

**Ans: B.** A is false (Igarka = **Russia**); R is true as a teaching note.

**A/R logic:** Place-country misattribution is the stem’s point.

</details>

**Q14.**
Indonesia west→east island order begins:

A. Java → Sumatra → Bali → Lombok
B. Sumatra → Java → Bali → Lombok
C. Bali → Java → Sumatra → Lombok
D. Sumatra → Bali → Java → Lombok

<details>
<summary>Show answer</summary>

**Ans: B.** Sumatra → Java → Bali → Lombok.

**Logic:** Putting Java first is the usual error.

</details>

**Q15.**
Boundary parallels: 38th and 49th refer mainly to:

A. Koreas and USA–Canada
B. India–China and USA–Mexico
C. Vietnam split and Brazil–Argentina
D. Egypt–Sudan and France–Spain

<details>
<summary>Show answer</summary>

**Ans: A.** **38th** ≈ Koreas; **49th** ≈ Canada–USA.

**Logic:** Do not invent India–China parallel keys here.

</details>

**Q16.**
Which capital–country pair is correct for Maghreb?

A. Morocco — Casablanca as capital
B. Algeria — Algiers
C. Tunisia — Tripoli
D. Mali — Praia

<details>
<summary>Show answer</summary>

**Ans: B.** Algeria = **Algiers**; Morocco capital = **Rabat**; Tunisia = **Tunis**.

**Logic:** Praia = Cape Verde; Bamako = Mali; Tripoli = Libya.

</details>

**Q17.**
Mekong delta lies in:

A. Cambodia
B. Southern Vietnam
C. Laos
D. Thailand

<details>
<summary>Show answer</summary>

**Ans: B.** Southern **Vietnam**.

**Logic:** Same Cambodia trap as in rivers/landforms chapters.

</details>

**Q18.**
Which of the following is/are correct?

1. Seoul is in South Korea; Pyongyang in North Korea.
2. China’s capital is Shanghai.
3. Honshu is Japan’s main island.

A. 1 and 3
B. Only 2
C. 2 and 3
D. Only 1

<details>
<summary>Show answer</summary>

**Ans: A.** Statements 1 and 3 are correct.

**Logic:** China’s capital is **Beijing**.

</details>

**Q19.**
Cape Verde’s capital is:

A. Bamako
B. Praia
C. Rabat
D. Dakar

<details>
<summary>Show answer</summary>

**Ans: B.** **Praia**.

**Logic:** Bamako = Mali swap trap.

</details>

**Q20.**
Which one of the following pairs is NOT correctly matched?

A. Maghreb — Morocco–Algeria–Tunisia
B. Sahel — semi-arid belt south of Sahara
C. Cook Strait — Australia–Tasmania
D. Suez shortening — about 7000 km on India–Europe sea route

<details>
<summary>Show answer</summary>

**Ans: C.** Cook Strait separates New Zealand’s North and South Islands.

**Logic:** Tasmania’s water is Bass Strait in Australian teaching.

</details>
'''


def main() -> None:
    rows = []
    rows.append(apply_chapter("15_Geomorphology_and_Landform_Processes.md", FACTS_15, QUIZ_15))
    rows.append(apply_chapter("16_Oceans.md", FACTS_16, QUIZ_16))
    rows.append(apply_chapter("17_World_Rivers_and_Lakes.md", FACTS_17, QUIZ_17))
    rows.append(apply_chapter("18_World_Landforms.md", FACTS_18, QUIZ_18))
    rows.append(
        apply_chapter(
            "19_World_Regional_Geography.md", FACTS_19, QUIZ_19, ca_md=CA_19
        )
    )
    for r in rows:
        print(f"{r['file']}: facts={r['facts']} quiz={r['quiz']}")


if __name__ == "__main__":
    main()
