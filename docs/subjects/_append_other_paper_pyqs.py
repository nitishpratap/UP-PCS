# -*- coding: utf-8 -*-
"""Append OTHER-PAPER PYQs into Ghatnachakra Extra Drill (before Practice Zone)."""
from __future__ import annotations
from pathlib import Path
import re

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects")
MARKER = "### Other Papers — BPSC / MPPSC / RAS / UKPCS / UPSC / WBCS"


def fmt(tag: str, stem: str, opts: list[str], letter: str, ans: str, logic: str) -> tuple[str, str]:
    """Return (dedupe_key, body_without_Qnum)."""
    key = re.sub(r"\s+", " ", f"{tag}|{stem[:80]}").strip().lower()
    body = (
        f"PLACEHOLDER\n{stem}\n"
        + "\n".join(opts)
        + "\n\n<details>\n<summary>Show answer</summary>\n\n"
        f"**Logic:** {logic}\n\n**Ans: {letter}.** {ans}\n\n</details>\n\n"
    )
    return key, body


# (relpath, list of fmt tuples) — Q numbers assigned at inject time
RAW: dict[str, list[tuple[str, str]]] = {}


def add(rel: str, *items: tuple[str, str]):
    RAW.setdefault(rel, []).extend(items)


# ── Census 01 ──────────────────────────────────────────────
add(
    "census and urbanisation/01_Census_and_Population_Data.md",
    fmt(
        "BPSC 70th CCE (Pre) 2024",
        "What is the sex ratio in Bihar as per the Census 2011 of India?",
        ["A. 879", "B. 918", "C. 943", "D. 1084"],
        "B",
        "918 females per 1,000 males.",
        "National 2011 sex ratio ~943; Bihar sits below it. 879 is the Haryana trap.",
    ),
    fmt(
        "67th BPSC (Pre) 2022",
        "What is the female literacy rate of Bihar as per the Census 2011 of India?",
        ["A. 53.33%", "B. 61.80%", "C. 51.50%", "D. 71.20%"],
        "C",
        "51.50%.",
        "Overall Bihar literacy ~61.80%; male ~71.20%; female keyed at 51.50% in 67th BPSC.",
    ),
    fmt(
        "UKPSC (Pre) 2022",
        "Which districts of Uttarakhand recorded negative population growth during 2001–2011 as per Census 2011?",
        [
            "A. Tehri Garhwal and Bageshwar",
            "B. Pauri Garhwal and Almora",
            "C. Uttarkashi and Champawat",
            "D. Chamoli and Rudraprayag",
        ],
        "B",
        "Pauri Garhwal and Almora.",
        "Pauri about −1.41% and Almora about −1.28%; the classic UK “ghost village” pair.",
    ),
    fmt(
        "UKPSC / Census 2011 UK",
        "According to Census 2011, population density and sex ratio of Uttarakhand are respectively:",
        ["A. 382 and 943", "B. 189 and 943", "C. 189 and 963", "D. 382 and 963"],
        "C",
        "189 persons/km² and 963 females per 1,000 males.",
        "Do not paste all-India 382/943 into the State pair.",
    ),
    fmt(
        "RPSC RAS (Pre) 2021",
        "According to Census 2011, what was the work participation rate in India and Rajasthan respectively?",
        ["A. 43.6% and 41.8%", "B. 39.8% and 43.6%", "C. 42.4% and 41.8%", "D. 39.8% and 36.4%"],
        "B",
        "India 39.8%; Rajasthan 43.6%.",
        "Rajasthan’s WPR is higher than the national average — reverse of the literacy pattern.",
    ),
    fmt(
        "WBCS (Pre) 2020",
        "Literacy rate in West Bengal (Census 2011) is—",
        ["A. 97%", "B. 70%", "C. 80%", "D. 77%"],
        "D",
        "About 77% (actual ~76.26%, rounded in options).",
        "Above national 74.04%; Kerala remains the literacy leader.",
    ),
    fmt(
        "BPSC / Standard Bihar Census",
        "As per Census 2011, population density of Bihar was approximately:",
        ["A. 382", "B. 828", "C. 1,106", "D. 1,882"],
        "C",
        "About 1,106 persons/km² (highest among States).",
        "National density ~382; Sheohar is densest Bihar district (~1,882).",
    ),
    fmt(
        "WBCS (Pre)",
        "Which one among the following Indian States has the highest density of population (Census 2011)?",
        ["A. West Bengal", "B. Maharashtra", "C. Uttar Pradesh", "D. Bihar"],
        "D",
        "Bihar.",
        "WBCS and BPSC both hammer this — West Bengal led in 2001; Bihar leads in 2011 among States.",
    ),
)

# ── Census 02 ──────────────────────────────────────────────
add(
    "census and urbanisation/02_Population_Growth_Demographic_Transition_Theories.md",
    fmt(
        "UPSC (CSE) Prelims 2011",
        'India is regarded as a country with “Demographic Dividend”. This is due to:',
        [
            "A. Its high population in the age group below 15 years",
            "B. Its high population in the age group of 15–64 years",
            "C. Its high population in the age group above 65 years",
            "D. Its high total population",
        ],
        "B",
        "High share in the working-age group 15–64.",
        "Dividend is age-structure, not raw headcount or child share.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2012",
        "Consider stages of demographic transition associated with economic development:\n1. Low birth rate with low death rate\n2. High birth rate with high death rate\n3. High birth rate with low death rate\nCorrect order is:",
        ["A. 1 – 2 – 3", "B. 2 – 1 – 3", "C. 2 – 3 – 1", "D. 3 – 2 – 1"],
        "C",
        "2 → 3 → 1.",
        "Stage I both high → Stage II fertility high, mortality falls → Stage III both low.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2013",
        "To obtain full benefits of demographic dividend, what should India do?",
        [
            "A. Promoting skill development",
            "B. Introducing more social security schemes",
            "C. Reducing infant mortality rate",
            "D. Privatization of higher education",
        ],
        "A",
        "Promoting skill development.",
        "Dividend materialises only if working-age cohorts are employable.",
    ),
    fmt(
        "WBCS (Pre)",
        "What is Demographic Dividend?",
        [
            "A. Increase in 0–5 year age group of population",
            "B. Increase in 6–15 year age group of population",
            "C. Increase in 16–64 year age group of population",
            "D. Increase in over-65 year age group of population",
        ],
        "C",
        "Increase in working-age (16–64) share.",
        "Same idea as UPSC 15–64; WBCS options use the 16–64 band.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2009",
        "Consider the following statements:\n1. Between Census 1951 and Census 2001, the density of population of India has increased more than three times.\n2. Between Census 1951 and Census 2001 the annual growth rate (exponential) of the population of India has doubled.\nWhich is/are correct?",
        ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither 1 nor 2"],
        "D",
        "Neither 1 nor 2.",
        "Density rose from ~117 to ~324 (not 3×); growth rate did not double.",
    ),
)

# ── Census 03 ──────────────────────────────────────────────
add(
    "census and urbanisation/03_Population_Composition_Demographic_Characteristics.md",
    fmt(
        "67th BPSC (Pre) 2022",
        "Choose the correct order of the following districts of Bihar as per the ascending level of urbanisation:",
        [
            "A. Nalanda < Patna < Munger",
            "B. Patna < Munger < Nalanda",
            "C. Munger < Nalanda < Patna",
            "D. Nalanda < Munger < Patna",
        ],
        "D",
        "Nalanda < Munger < Patna.",
        "Patna tops (~44%); Munger next (~28%); Nalanda (~26%) is lowest of the three.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2006",
        "Consider the following statements:\n1. According to Census 2001, Kerala has the smallest gap in male and female literacy rates among the 28 States of India (Delhi and Pondicherry not included).\n2. According to Census 2001, Rajasthan has literacy rate above the national average literacy rate.\nWhich is/are correct?",
        ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither 1 nor 2"],
        "D",
        "Neither 1 nor 2.",
        "Rajasthan was below national literacy; Kerala gap claim fails the 2001 key.",
    ),
    fmt(
        "WBCS (Pre)",
        "Name the State of India where male–female ratio is adversely tilted against the female:",
        ["A. Uttar Pradesh", "B. West Bengal", "C. Punjab", "D. Haryana"],
        "D",
        "Haryana.",
        "Lowest sex ratio / child sex ratio cluster — Punjab is the twin distractor.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2005",
        "Consider the following:\n1. India is the second country in the world to adopt a National Family Planning Programme.\n2. The National Population Policy of India 2000 seeks to achieve replacement level of fertility by 2010 with a population of 111 crores.\n3. Kerala is the first State in India to achieve a replacement level of fertility.\nWhich are correct?",
        ["A. 1 only", "B. 1 and 2", "C. 2 and 3", "D. 1, 2 and 3"],
        "C",
        "2 and 3.",
        "Statement 1 is wrong — India was first (1952), not second.",
    ),
    fmt(
        "BPSC / Standard Bihar Census",
        "As per Census 2011, Bihar’s overall literacy rate was approximately:",
        ["A. 74.04%", "B. 61.80%", "C. 51.50%", "D. 82.14%"],
        "B",
        "About 61.80%.",
        "Female literacy 51.50% is a separate stem — don’t confuse the two.",
    ),
)

# ── Census 04 ──────────────────────────────────────────────
add(
    "census and urbanisation/04_Fertility_Mortality_Health_Population_Policies.md",
    fmt(
        "UPSC (CSE) Prelims 2024",
        "The total fertility rate in an economy is defined as:",
        [
            "A. the number of children born per 1,000 people in the population in a year",
            "B. the number of children born to a couple in their lifetime in a given population",
            "C. the birth rate minus death rate",
            "D. the average number of live births a woman would have by the end of her child-bearing age",
        ],
        "D",
        "Synthetic cohort average live births per woman.",
        "A is CBR; C is natural increase; B is vague — TFR is the period fertility measure.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2008",
        "As per India’s National Population Policy, 2000, by which year is it our long-term objective to achieve population stabilisation?",
        ["A. 2025", "B. 2035", "C. 2045", "D. 2055"],
        "C",
        "2045.",
        "Distinct from UPPCS 2023 key of 2070 — know both paper keys.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2009",
        "Consider the following statements:\n1. Infant mortality rate takes into account the death of infants within a month after birth.\n2. Infant mortality rate is the number of infant deaths in a particular year per 100 live births during that year.\nWhich is/are correct?",
        ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither 1 nor 2"],
        "D",
        "Neither 1 nor 2.",
        "IMR = deaths under age one per 1,000 live births — not one month, not per 100.",
    ),
    fmt(
        "WBCS (Pre)",
        "A high birth rate is associated with:",
        [
            "A. A female literacy rate",
            "B. A low female literacy rate",
            "C. A high male literacy rate",
            "D. None of the above",
        ],
        "B",
        "A low female literacy rate.",
        "Female education is the classic inverse correlate of fertility.",
    ),
)

# ── Census 05 ──────────────────────────────────────────────
add(
    "census and urbanisation/05_Migration_and_Population_Distribution.md",
    fmt(
        "UPSC (CSE) Prelims 2008",
        "Among the following, which one has the minimum population on the basis of data of Census of India, 2001?",
        ["A. Chandigarh", "B. Mizoram", "C. Puducherry", "D. Sikkim"],
        "D",
        "Sikkim.",
        "Least populous State; still the standard minimum-population trap.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2007",
        "Which one among the following States of India has the lowest density of population?",
        ["A. Himachal Pradesh", "B. Meghalaya", "C. Arunachal Pradesh", "D. Sikkim"],
        "C",
        "Arunachal Pradesh.",
        "Same ranking survives into Census 2011 (~17/km²).",
    ),
    fmt(
        "UPSC (CSE) Prelims 2008",
        "Amongst the following States, which one has the highest percentage of rural population (Census 2001)?",
        ["A. Himachal Pradesh", "B. Bihar", "C. Orissa", "D. Uttar Pradesh"],
        "A",
        "Himachal Pradesh.",
        "Highest rural % among these — not Bihar (often confused with low urbanisation).",
    ),
    fmt(
        "UPSC (CSE) Prelims 2005",
        "According to the Population Census 2001, which Indian State has the maximum population after Uttar Pradesh?",
        ["A. West Bengal", "B. Maharashtra", "C. Bihar", "D. Tamil Nadu"],
        "B",
        "Maharashtra.",
        "2001 order: UP > Maharashtra > Bihar… — do not project 2011 Bihar rise into 2001 keys.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2006",
        "Consider the following statements:\n1. Sikkim has the minimum area among the 28 Indian States (Delhi and Pondicherry not included).\n2. Chandigarh has the highest literacy rate among Pondicherry, NCT of Delhi and other Union Territories.\n3. Maharashtra has the highest population after Uttar Pradesh among the 28 Indian States.\nWhich is/are correct?",
        ["A. 1 and 2", "B. 2 and 3", "C. 1 only", "D. 3 only"],
        "D",
        "3 only.",
        "Goa is the smallest State by area, not Sikkim; statement 2 also fails the key.",
    ),
)

# ── Census 06 ──────────────────────────────────────────────
add(
    "census and urbanisation/06_Urbanisation_and_Urban_Development.md",
    fmt(
        "BPSC-type / Bihar urban",
        "As per Census 2011, share of urban population in Bihar was about:",
        ["A. 31.16%", "B. 22%", "C. 11.29%", "D. 40%"],
        "C",
        "~11.29%.",
        "Among the least urbanised major States vs India ~31%.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2008",
        "Which of the following are among the million-plus cities in India on the basis of Census 2001?\n1. Ludhiana\n2. Kochi\n3. Surat\n4. Nagpur",
        ["A. 1, 2 and 3 only", "B. 2, 3 and 4 only", "C. 1 and 4 only", "D. 1, 2, 3 and 4"],
        "D",
        "All four.",
        "2001 million-plus list included these industrial/port cities — don’t drop Kochi.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2008",
        "What is the approximate percentage of persons above 65 years of age in India’s population (as of that paper’s frame)?",
        ["A. 14–15%", "B. 11–12%", "C. 8–9%", "D. 5–6%"],
        "D",
        "About 5–6%.",
        "India was still young; double-digit elderly share is the developed-country trap.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2008",
        "For India, China, the UK and the USA, which is the correct sequence of the median age of their populations?",
        [
            "A. China < India < UK < USA",
            "B. India < China < USA < UK",
            "C. China < India < USA < UK",
            "D. India < China < UK < USA",
        ],
        "B",
        "India < China < USA < UK.",
        "Youngest median first — India then China; UK older than USA.",
    ),
)

# ── Census 07 ──────────────────────────────────────────────
add(
    "census and urbanisation/07_World_Population_and_Demographic_Misc.md",
    fmt(
        "UPSC (CSE) Prelims 2011 / WBCS (Pre)",
        "India is regarded as a country with demographic dividend due to high population in which age group?",
        ["A. Below 15 years", "B. 15–64 years", "C. Above 65 years", "D. Total population alone"],
        "B",
        "15–64 working-age share.",
        "Same stem across UPSC and WBCS — age band is the key.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2019",
        "In the context of any country, which one of the following would be considered as part of its social capital?",
        [
            "A. The proportion of literates in the population",
            "B. The stock of its buildings, other infrastructure and machines",
            "C. The size of population in the working age group",
            "D. The level of mutual trust and harmony in the society",
        ],
        "D",
        "Mutual trust and harmony.",
        "Literacy/working age are human capital/demography — not social capital.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2018",
        "Human capital formation as a concept is better explained in terms of a process which enables:\n1. Individuals of a country to accumulate more capital.\n2. Increasing the knowledge, skills level and capacities of the people of the country.\n3. Accumulation of tangible wealth.\n4. Accumulation of intangible wealth.\nWhich are correct?",
        ["A. 1 and 2", "B. 2 only", "C. 2 and 4", "D. 1, 3 and 4"],
        "C",
        "2 and 4.",
        "Human capital = knowledge/skills + intangible wealth — not physical capital stock.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2019",
        "Consider the following statements about Particularly Vulnerable Tribal Groups (PVTGs) in India:\n1. PVTGs reside in 18 States and one Union Territory.\n2. A stagnant or declining population is one of the criteria for determining PVTG status.\n3. There are 95 PVTGs officially notified in the country so far.\n4. Irular and Konda Reddi tribes are included in the list of PVTGs.\nWhich are correct?",
        ["A. 1, 2 and 3", "B. 2, 3 and 4", "C. 1, 2 and 4", "D. 1, 3 and 4"],
        "C",
        "1, 2 and 4.",
        "Statement 3 is wrong — notified PVTGs are 75, not 95.",
    ),
)

# ── UP Special packs ───────────────────────────────────────
add(
    "up special/01_Geography_Location_Physical_Features.md",
    fmt(
        "UKPSC (Pre) 2022",
        "Which districts of Uttarakhand recorded negative population growth during 2001–2011 as per Census 2011?",
        [
            "A. Tehri Garhwal and Bageshwar",
            "B. Pauri Garhwal and Almora",
            "C. Uttarkashi and Champawat",
            "D. Chamoli and Rudraprayag",
        ],
        "B",
        "Pauri Garhwal and Almora.",
        "UK neighbour out-migration pair on UP’s northern border.",
    ),
    fmt(
        "67th BPSC (Pre) 2022",
        "Which river is known as the ‘Sorrow of Bihar’?",
        ["A. Ganga", "B. Kosi", "C. Son", "D. Ghaghara"],
        "B",
        "Kosi.",
        "Flood geography of the UP–Bihar plain continuum.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2007",
        "Which one among the following States of India has the lowest density of population?",
        ["A. Himachal Pradesh", "B. Meghalaya", "C. Arunachal Pradesh", "D. Sikkim"],
        "C",
        "Arunachal Pradesh.",
        "Comparative density ranking for UP Special geography Extra Drill.",
    ),
)

add(
    "up special/06_Society_Population_Education_Social.md",
    fmt(
        "BPSC 70th CCE (Pre) 2024",
        "What is the sex ratio in Bihar as per the Census 2011 of India?",
        ["A. 879", "B. 918", "C. 943", "D. 1084"],
        "B",
        "918.",
        "Neighbour demography — Bihar below national 943.",
    ),
    fmt(
        "UKPSC (Pre) 2022",
        "Which districts of Uttarakhand recorded negative population growth during 2001–2011?",
        [
            "A. Dehradun and Haridwar",
            "B. Pauri Garhwal and Almora",
            "C. Nainital and Udham Singh Nagar",
            "D. Champawat and Pithoragarh",
        ],
        "B",
        "Pauri Garhwal and Almora.",
        "Hill out-migration contrast with UP’s plains growth.",
    ),
    fmt(
        "UKPSC / Census 2011 UK",
        "Literacy rate of Uttarakhand (Census 2011) was about:",
        ["A. 74.04%", "B. 67.7%", "C. 78.82%", "D. 63.8%"],
        "C",
        "78.82%.",
        "Above national average; Dehradun has the highest district literacy.",
    ),
    fmt(
        "RPSC RAS (Pre) 2021",
        "According to Census 2011, work participation rate in India and Rajasthan respectively was:",
        ["A. 43.6% and 41.8%", "B. 39.8% and 43.6%", "C. 42.4% and 41.8%", "D. 39.8% and 36.4%"],
        "B",
        "39.8% (India), 43.6% (Rajasthan).",
        "Comparative labour participation for society/economy Extra Drill.",
    ),
    fmt(
        "WBCS (Pre) 2020",
        "Literacy rate in West Bengal (Census 2011) is—",
        ["A. 97%", "B. 70%", "C. 80%", "D. 77%"],
        "D",
        "About 77%.",
        "Comparative State literacy — WB above national 74.04%.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2011",
        'India is regarded as a country with “Demographic Dividend”. This is due to:',
        [
            "A. Its high population in the age group below 15 years",
            "B. Its high population in the age group of 15–64 years",
            "C. Its high population in the age group above 65 years",
            "D. Its high total population",
        ],
        "B",
        "High share in the working-age group 15–64.",
        "Age-structure lock for UP society demography.",
    ),
)

add(
    "up special/03_Polity_Administration_Local_Government.md",
    fmt(
        "Standard multi-PSC / Constitution",
        "Census is a subject of which List of the Seventh Schedule?",
        ["A. State List", "B. Concurrent List", "C. Union List", "D. Residuary only"],
        "C",
        "Union List (Entry 69).",
        "Asked across State PCS; Census is not a State subject.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2008 / NPP frame",
        "As per India’s National Population Policy, 2000, long-term population stabilisation year was:",
        ["A. 2025", "B. 2035", "C. 2045", "D. 2055"],
        "C",
        "2045.",
        "Policy year for administration Extra Drill — distinct from UPPCS 2070 key.",
    ),
)

add(
    "up special/04_Economy_Industry_Infrastructure.md",
    fmt(
        "RPSC RAS (Pre) 2021",
        "According to Census 2011, what was the work participation rate in India and Rajasthan respectively?",
        ["A. 43.6% and 41.8%", "B. 39.8% and 43.6%", "C. 42.4% and 41.8%", "D. 39.8% and 36.4%"],
        "B",
        "39.8% (India), 43.6% (Rajasthan).",
        "Labour participation comparative for economy Extra Drill.",
    ),
    fmt(
        "UPSC (CSE) Prelims 2013",
        "To obtain full benefits of demographic dividend, what should India do?",
        [
            "A. Promoting skill development",
            "B. Introducing more social security schemes",
            "C. Reducing infant mortality rate",
            "D. Privatization of higher education",
        ],
        "A",
        "Promoting skill development.",
        "Economy lever that converts age-structure into growth.",
    ),
)

add(
    "up special/07_Transport_Tourism_Environment_Disaster.md",
    fmt(
        "67th BPSC (Pre) 2022",
        "Which river is known as the ‘Sorrow of Bihar’?",
        ["A. Ganga", "B. Kosi", "C. Son", "D. Gandak"],
        "B",
        "Kosi.",
        "Flood disaster geography shared with eastern UP plain.",
    ),
)


def max_q_in_extra(extra_chunk: str) -> int:
    nums = [int(n) for n in re.findall(r"\*\*Q(\d+)\.", extra_chunk)]
    return max(nums) if nums else 0


def already_has(text: str, key: str) -> bool:
    # stem fingerprint from key after |
    stem_bit = key.split("|", 1)[-1][:60]
    return stem_bit in text.lower()


def append_file(rel: str, items: list[tuple[str, str]]) -> int:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    m_prac = re.search(r"^## Practice Zone[^\n]*\n", text, re.M)
    if not m_extra or not m_prac:
        print("SKIP (no Extra/Practice)", rel)
        return 0

    extra = text[m_extra.end() : m_prac.start()]
    start_n = max_q_in_extra(extra)
    # If marker already present, still allow new unique stems after it
    bodies = []
    n = start_n
    for key, body in items:
        if already_has(text, key):
            continue
        n += 1
        # recover tag from key
        tag = key.split("|", 1)[0]
        # title-case light: use stored tag from body — body starts PLACEHOLDER
        # Rebuild with proper Q tag from original key prefix
        # key is "tag|stem..." lowercased — lose casing. Re-parse from body PLACEHOLDER line.
        numbered = body.replace("PLACEHOLDER", f"**Q{n}. {tag.title() if tag.islower() else tag}**", 1)
        # Fix: tag in key is lowercased. Store original tag in body differently.
        bodies.append((n, key, body))

    # Re-do properly: items already have lowercased keys; keep original tag in a parallel list
    return _append_numbered(path, text, m_extra, m_prac, extra, start_n, items)


def _append_numbered(path, text, m_extra, m_prac, extra, start_n, items):
    # items are (key, body) but body has PLACEHOLDER and we lost original tag case.
    # Fix by embedding tag in body as first line after PLACEHOLDER... rewrite fmt to include tag.
    # Simpler: re-read PACKS with tags in body.
    raise NotImplementedError


# Rewrite: store full ready bodies with __TAG__ and __STEMKEY__
PACKS2: dict[str, list[dict]] = {}


def Q(tag, stem, opts, letter, ans, logic):
    return {
        "tag": tag,
        "stem": stem,
        "key": re.sub(r"\s+", " ", stem[:70]).strip().lower(),
        "body_tpl": (
            "{qline}\n"
            + stem
            + "\n"
            + "\n".join(opts)
            + "\n\n<details>\n<summary>Show answer</summary>\n\n"
            f"**Logic:** {logic}\n\n**Ans: {letter}.** {ans}\n\n</details>\n\n"
        ),
    }


def put(rel, *qs):
    PACKS2.setdefault(rel, []).extend(qs)


# Rebuild packs cleanly
put(
    "census and urbanisation/01_Census_and_Population_Data.md",
    Q("BPSC 70th CCE (Pre) 2024", "What is the sex ratio in Bihar as per the Census 2011 of India?", ["A. 879", "B. 918", "C. 943", "D. 1084"], "B", "918 females per 1,000 males.", "National 2011 sex ratio ~943; Bihar sits below it. 879 is the Haryana trap."),
    Q("67th BPSC (Pre) 2022", "What is the female literacy rate of Bihar as per the Census 2011 of India?", ["A. 53.33%", "B. 61.80%", "C. 51.50%", "D. 71.20%"], "C", "51.50%.", "Overall Bihar literacy ~61.80%; male ~71.20%; female keyed at 51.50% in 67th BPSC."),
    Q("UKPSC (Pre) 2022", "Which districts of Uttarakhand recorded negative population growth during 2001–2011 as per Census 2011?", ["A. Tehri Garhwal and Bageshwar", "B. Pauri Garhwal and Almora", "C. Uttarkashi and Champawat", "D. Chamoli and Rudraprayag"], "B", "Pauri Garhwal and Almora.", "Pauri about −1.41% and Almora about −1.28%; the classic UK “ghost village” pair."),
    Q("UKPSC / Census 2011 UK", "According to Census 2011, population density and sex ratio of Uttarakhand are respectively:", ["A. 382 and 943", "B. 189 and 943", "C. 189 and 963", "D. 382 and 963"], "C", "189 persons/km² and 963 females per 1,000 males.", "Do not paste all-India 382/943 into the State pair."),
    Q("RPSC RAS (Pre) 2021", "According to Census 2011, what was the work participation rate in India and Rajasthan respectively?", ["A. 43.6% and 41.8%", "B. 39.8% and 43.6%", "C. 42.4% and 41.8%", "D. 39.8% and 36.4%"], "B", "India 39.8%; Rajasthan 43.6%.", "Rajasthan’s WPR is higher than the national average — reverse of the literacy pattern."),
    Q("WBCS (Pre) 2020", "Literacy rate in West Bengal (Census 2011) is—", ["A. 97%", "B. 70%", "C. 80%", "D. 77%"], "D", "About 77% (actual ~76.26%, rounded in options).", "Above national 74.04%; Kerala remains the literacy leader."),
    Q("BPSC / Standard Bihar Census", "As per Census 2011, population density of Bihar was approximately:", ["A. 382", "B. 828", "C. 1,106", "D. 1,882"], "C", "About 1,106 persons/km² (highest among States).", "National density ~382; Sheohar is densest Bihar district (~1,882)."),
    Q("WBCS (Pre)", "Which one among the following Indian States has the highest density of population (Census 2011)?", ["A. West Bengal", "B. Maharashtra", "C. Uttar Pradesh", "D. Bihar"], "D", "Bihar.", "WBCS and BPSC both hammer this — West Bengal led in 2001; Bihar leads in 2011 among States."),
)

put(
    "census and urbanisation/02_Population_Growth_Demographic_Transition_Theories.md",
    Q("UPSC (CSE) Prelims 2011", 'India is regarded as a country with “Demographic Dividend”. This is due to:', ["A. Its high population in the age group below 15 years", "B. Its high population in the age group of 15–64 years", "C. Its high population in the age group above 65 years", "D. Its high total population"], "B", "High share in the working-age group 15–64.", "Dividend is age-structure, not raw headcount or child share."),
    Q("UPSC (CSE) Prelims 2012", "Consider stages of demographic transition associated with economic development:\n1. Low birth rate with low death rate\n2. High birth rate with high death rate\n3. High birth rate with low death rate\nCorrect order is:", ["A. 1 – 2 – 3", "B. 2 – 1 – 3", "C. 2 – 3 – 1", "D. 3 – 2 – 1"], "C", "2 → 3 → 1.", "Stage I both high → Stage II fertility high, mortality falls → Stage III both low."),
    Q("UPSC (CSE) Prelims 2013", "To obtain full benefits of demographic dividend, what should India do?", ["A. Promoting skill development", "B. Introducing more social security schemes", "C. Reducing infant mortality rate", "D. Privatization of higher education"], "A", "Promoting skill development.", "Dividend materialises only if working-age cohorts are employable."),
    Q("WBCS (Pre)", "What is Demographic Dividend?", ["A. Increase in 0–5 year age group of population", "B. Increase in 6–15 year age group of population", "C. Increase in 16–64 year age group of population", "D. Increase in over-65 year age group of population"], "C", "Increase in working-age (16–64) share.", "Same idea as UPSC 15–64; WBCS options use the 16–64 band."),
    Q("UPSC (CSE) Prelims 2009", "Consider the following statements:\n1. Between Census 1951 and Census 2001, the density of the population of India has increased more than three times.\n2. Between Census 1951 and Census 2001 the annual growth rate (exponential) of the population of India has doubled.\nWhich is/are correct?", ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither 1 nor 2"], "D", "Neither 1 nor 2.", "Density rose from ~117 to ~324 (not 3×); growth rate did not double."),
)

put(
    "census and urbanisation/03_Population_Composition_Demographic_Characteristics.md",
    Q("67th BPSC (Pre) 2022", "Choose the correct order of the following districts of Bihar as per the ascending level of urbanisation:", ["A. Nalanda < Patna < Munger", "B. Patna < Munger < Nalanda", "C. Munger < Nalanda < Patna", "D. Nalanda < Munger < Patna"], "D", "Nalanda < Munger < Patna.", "Patna tops (~44%); Munger next (~28%); Nalanda (~26%) is lowest of the three."),
    Q("UPSC (CSE) Prelims 2006", "Consider the following statements:\n1. According to Census 2001, Kerala has the smallest gap in male and female literacy rates among the 28 States of India (Delhi and Pondicherry not included).\n2. According to Census 2001, Rajasthan has literacy rate above the national average literacy rate.\nWhich is/are correct?", ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither 1 nor 2"], "D", "Neither 1 nor 2.", "Rajasthan was below national literacy; Kerala gap claim fails the 2001 key."),
    Q("WBCS (Pre)", "Name the State of India where male–female ratio is adversely tilted against the female:", ["A. Uttar Pradesh", "B. West Bengal", "C. Punjab", "D. Haryana"], "D", "Haryana.", "Lowest sex ratio / child sex ratio cluster — Punjab is the twin distractor."),
    Q("UPSC (CSE) Prelims 2005", "Consider the following:\n1. India is the second country in the world to adopt a National Family Planning Programme.\n2. The National Population Policy of India 2000 seeks to achieve replacement level of fertility by 2010 with a population of 111 crores.\n3. Kerala is the first State in India to achieve a replacement level of fertility.\nWhich are correct?", ["A. 1 only", "B. 1 and 2", "C. 2 and 3", "D. 1, 2 and 3"], "C", "2 and 3.", "Statement 1 is wrong — India was first (1952), not second."),
    Q("BPSC / Standard Bihar Census", "As per Census 2011, Bihar’s overall literacy rate was approximately:", ["A. 74.04%", "B. 61.80%", "C. 51.50%", "D. 82.14%"], "B", "About 61.80%.", "Female literacy 51.50% is a separate stem — don’t confuse the two."),
)

put(
    "census and urbanisation/04_Fertility_Mortality_Health_Population_Policies.md",
    Q("UPSC (CSE) Prelims 2024", "The total fertility rate in an economy is defined as:", ["A. the number of children born per 1,000 people in the population in a year", "B. the number of children born to a couple in their lifetime in a given population", "C. the birth rate minus death rate", "D. the average number of live births a woman would have by the end of her child-bearing age"], "D", "Synthetic cohort average live births per woman.", "A is CBR; C is natural increase; B is vague — TFR is the period fertility measure."),
    Q("UPSC (CSE) Prelims 2008", "As per India’s National Population Policy, 2000, by which year is it our long-term objective to achieve population stabilisation?", ["A. 2025", "B. 2035", "C. 2045", "D. 2055"], "C", "2045.", "Distinct from UPPCS 2023 key of 2070 — know both paper keys."),
    Q("UPSC (CSE) Prelims 2009", "Consider the following statements:\n1. Infant mortality rate takes into account the death of infants within a month after birth.\n2. Infant mortality rate is the number of infant deaths in a particular year per 100 live births during that year.\nWhich is/are correct?", ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither 1 nor 2"], "D", "Neither 1 nor 2.", "IMR = deaths under age one per 1,000 live births — not one month, not per 100."),
    Q("WBCS (Pre)", "A high birth rate is associated with:", ["A. A female literacy rate", "B. A low female literacy rate", "C. A high male literacy rate", "D. None of the above"], "B", "A low female literacy rate.", "Female education is the classic inverse correlate of fertility."),
)

put(
    "census and urbanisation/05_Migration_and_Population_Distribution.md",
    Q("UPSC (CSE) Prelims 2008", "Among the following, which one has the minimum population on the basis of data of Census of India, 2001?", ["A. Chandigarh", "B. Mizoram", "C. Puducherry", "D. Sikkim"], "D", "Sikkim.", "Least populous State; still the standard minimum-population trap."),
    Q("UPSC (CSE) Prelims 2007", "Which one among the following States of India has the lowest density of population?", ["A. Himachal Pradesh", "B. Meghalaya", "C. Arunachal Pradesh", "D. Sikkim"], "C", "Arunachal Pradesh.", "Same ranking survives into Census 2011 (~17/km²)."),
    Q("UPSC (CSE) Prelims 2008", "Amongst the following States, which one has the highest percentage of rural population (Census 2001)?", ["A. Himachal Pradesh", "B. Bihar", "C. Orissa", "D. Uttar Pradesh"], "A", "Himachal Pradesh.", "Highest rural % among these — not Bihar (often confused with low urbanisation)."),
    Q("UPSC (CSE) Prelims 2005", "According to the Population Census 2001, which Indian State has the maximum population after Uttar Pradesh?", ["A. West Bengal", "B. Maharashtra", "C. Bihar", "D. Tamil Nadu"], "B", "Maharashtra.", "2001 order: UP > Maharashtra > Bihar… — do not project 2011 Bihar rise into 2001 keys."),
    Q("UPSC (CSE) Prelims 2006", "Consider the following statements:\n1. Sikkim has the minimum area among the 28 Indian States (Delhi and Pondicherry not included).\n2. Chandigarh has the highest literacy rate among Pondicherry, NCT of Delhi and other Union Territories.\n3. Maharashtra has the highest population after Uttar Pradesh among the 28 Indian States.\nWhich is/are correct?", ["A. 1 and 2", "B. 2 and 3", "C. 1 only", "D. 3 only"], "D", "3 only.", "Goa is the smallest State by area, not Sikkim; statement 2 also fails the key."),
)

put(
    "census and urbanisation/06_Urbanisation_and_Urban_Development.md",
    Q("BPSC-type / Bihar urban", "As per Census 2011, share of urban population in Bihar was about:", ["A. 31.16%", "B. 22%", "C. 11.29%", "D. 40%"], "C", "~11.29%.", "Among the least urbanised major States vs India ~31%."),
    Q("UPSC (CSE) Prelims 2008", "Which of the following are among the million-plus cities in India on the basis of Census 2001?\n1. Ludhiana\n2. Kochi\n3. Surat\n4. Nagpur", ["A. 1, 2 and 3 only", "B. 2, 3 and 4 only", "C. 1 and 4 only", "D. 1, 2, 3 and 4"], "D", "All four.", "2001 million-plus list included these industrial/port cities — don’t drop Kochi."),
    Q("UPSC (CSE) Prelims 2008", "What is the approximate percentage of persons above 65 years of age in India’s population (as of that paper’s frame)?", ["A. 14–15%", "B. 11–12%", "C. 8–9%", "D. 5–6%"], "D", "About 5–6%.", "India was still young; double-digit elderly share is the developed-country trap."),
    Q("UPSC (CSE) Prelims 2008", "For India, China, the UK and the USA, which is the correct sequence of the median age of their populations?", ["A. China < India < UK < USA", "B. India < China < USA < UK", "C. China < India < USA < UK", "D. India < China < UK < USA"], "B", "India < China < USA < UK.", "Youngest median first — India then China; UK older than USA."),
)

put(
    "census and urbanisation/07_World_Population_and_Demographic_Misc.md",
    Q("UPSC (CSE) Prelims 2011 / WBCS (Pre)", "India is regarded as a country with demographic dividend due to high population in which age group?", ["A. Below 15 years", "B. 15–64 years", "C. Above 65 years", "D. Total population alone"], "B", "15–64 working-age share.", "Same stem across UPSC and WBCS — age band is the key."),
    Q("UPSC (CSE) Prelims 2019", "In the context of any country, which one of the following would be considered as part of its social capital?", ["A. The proportion of literates in the population", "B. The stock of its buildings, other infrastructure and machines", "C. The size of population in the working age group", "D. The level of mutual trust and harmony in the society"], "D", "Mutual trust and harmony.", "Literacy/working age are human capital/demography — not social capital."),
    Q("UPSC (CSE) Prelims 2018", "Human capital formation as a concept is better explained in terms of a process which enables:\n1. Individuals of a country to accumulate more capital.\n2. Increasing the knowledge, skills level and capacities of the people of the country.\n3. Accumulation of tangible wealth.\n4. Accumulation of intangible wealth.\nWhich are correct?", ["A. 1 and 2", "B. 2 only", "C. 2 and 4", "D. 1, 3 and 4"], "C", "2 and 4.", "Human capital = knowledge/skills + intangible wealth — not physical capital stock."),
    Q("UPSC (CSE) Prelims 2019", "Consider the following statements about Particularly Vulnerable Tribal Groups (PVTGs) in India:\n1. PVTGs reside in 18 States and one Union Territory.\n2. A stagnant or declining population is one of the criteria for determining PVTG status.\n3. There are 95 PVTGs officially notified in the country so far.\n4. Irular and Konda Reddi tribes are included in the list of PVTGs.\nWhich are correct?", ["A. 1, 2 and 3", "B. 2, 3 and 4", "C. 1, 2 and 4", "D. 1, 3 and 4"], "C", "1, 2 and 4.", "Statement 3 is wrong — notified PVTGs are 75, not 95."),
)

put(
    "up special/01_Geography_Location_Physical_Features.md",
    Q("UKPSC (Pre) 2022", "Which districts of Uttarakhand recorded negative population growth during 2001–2011 as per Census 2011?", ["A. Tehri Garhwal and Bageshwar", "B. Pauri Garhwal and Almora", "C. Uttarkashi and Champawat", "D. Chamoli and Rudraprayag"], "B", "Pauri Garhwal and Almora.", "UK neighbour out-migration pair on UP’s northern border."),
    Q("67th BPSC (Pre) 2022", "Which river is known as the ‘Sorrow of Bihar’?", ["A. Ganga", "B. Kosi", "C. Son", "D. Ghaghara"], "B", "Kosi.", "Flood geography of the UP–Bihar plain continuum."),
    Q("UPSC (CSE) Prelims 2007", "Which one among the following States of India has the lowest density of population?", ["A. Himachal Pradesh", "B. Meghalaya", "C. Arunachal Pradesh", "D. Sikkim"], "C", "Arunachal Pradesh.", "Comparative density ranking for UP Special geography Extra Drill."),
)

put(
    "up special/06_Society_Population_Education_Social.md",
    Q("BPSC 70th CCE (Pre) 2024", "What is the sex ratio in Bihar as per the Census 2011 of India?", ["A. 879", "B. 918", "C. 943", "D. 1084"], "B", "918.", "Neighbour demography — Bihar below national 943."),
    Q("UKPSC (Pre) 2022", "Which districts of Uttarakhand recorded negative population growth during 2001–2011?", ["A. Dehradun and Haridwar", "B. Pauri Garhwal and Almora", "C. Nainital and Udham Singh Nagar", "D. Champawat and Pithoragarh"], "B", "Pauri Garhwal and Almora.", "Hill out-migration contrast with UP’s plains growth."),
    Q("UKPSC / Census 2011 UK", "Literacy rate of Uttarakhand (Census 2011) was about:", ["A. 74.04%", "B. 67.7%", "C. 78.82%", "D. 63.8%"], "C", "78.82%.", "Above national average; Dehradun has the highest district literacy."),
    Q("RPSC RAS (Pre) 2021", "According to Census 2011, work participation rate in India and Rajasthan respectively was:", ["A. 43.6% and 41.8%", "B. 39.8% and 43.6%", "C. 42.4% and 41.8%", "D. 39.8% and 36.4%"], "B", "39.8% (India), 43.6% (Rajasthan).", "Comparative labour participation for society Extra Drill."),
    Q("WBCS (Pre) 2020", "Literacy rate in West Bengal (Census 2011) is—", ["A. 97%", "B. 70%", "C. 80%", "D. 77%"], "D", "About 77%.", "Comparative State literacy — WB above national 74.04%."),
    Q("UPSC (CSE) Prelims 2011", 'India is regarded as a country with “Demographic Dividend”. This is due to:', ["A. Its high population in the age group below 15 years", "B. Its high population in the age group of 15–64 years", "C. Its high population in the age group above 65 years", "D. Its high total population"], "B", "High share in the working-age group 15–64.", "Age-structure key for UP society demography."),
)

put(
    "up special/03_Polity_Administration_Local_Government.md",
    Q("Standard multi-PSC / Constitution", "Census is a subject of which List of the Seventh Schedule?", ["A. State List", "B. Concurrent List", "C. Union List", "D. Residuary only"], "C", "Union List (Entry 69).", "Asked across State PCS; Census is not a State subject."),
    Q("UPSC (CSE) Prelims 2008", "As per India’s National Population Policy, 2000, by which year is it our long-term objective to achieve population stabilisation?", ["A. 2025", "B. 2035", "C. 2045", "D. 2055"], "C", "2045.", "Policy year for administration Extra Drill — distinct from UPPCS 2070 key."),
)

put(
    "up special/04_Economy_Industry_Infrastructure.md",
    Q("RPSC RAS (Pre) 2021", "According to Census 2011, what was the work participation rate in India and Rajasthan respectively?", ["A. 43.6% and 41.8%", "B. 39.8% and 43.6%", "C. 42.4% and 41.8%", "D. 39.8% and 36.4%"], "B", "39.8% (India), 43.6% (Rajasthan).", "Labour participation comparative for economy Extra Drill."),
    Q("UPSC (CSE) Prelims 2013", "To obtain full benefits of demographic dividend, what should India do?", ["A. Promoting skill development", "B. Introducing more social security schemes", "C. Reducing infant mortality rate", "D. Privatization of higher education"], "A", "Promoting skill development.", "Economy lever that converts age-structure into growth."),
)

put(
    "up special/07_Transport_Tourism_Environment_Disaster.md",
    Q("67th BPSC (Pre) 2022", "Which river is known as the ‘Sorrow of Bihar’?", ["A. Ganga", "B. Kosi", "C. Son", "D. Gandak"], "B", "Kosi.", "Flood disaster geography shared with eastern UP plain."),
)


def inject(rel: str, qs: list[dict]) -> int:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    m_prac = re.search(r"^## Practice Zone[^\n]*\n", text, re.M)
    if not m_extra or not m_prac:
        print("SKIP", rel)
        return 0
    extra = text[m_extra.end() : m_prac.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra)), default=0)
    out = []
    for q in qs:
        if q["key"] in text.lower():
            continue
        n += 1
        out.append(q["body_tpl"].format(qline=f"**Q{n}. {q['tag']}**"))
    if not out:
        print("NONE_NEW", path.name)
        return 0
    block = ""
    if MARKER not in extra:
        block += f"\n{MARKER}\n\n"
    else:
        block += "\n"
    block += "".join(out)
    new = text[: m_prac.start()] + block + text[m_prac.start() :]
    path.write_text(new, encoding="utf-8", newline="\n")
    print(f"ADDED {path.name}: +{len(out)} (Extra now ~{n})")
    return len(out)


def main():
    total = 0
    for rel, qs in PACKS2.items():
        total += inject(rel, qs)
    print("TOTAL_OTHER_PAPER_QS_ADDED", total)


if __name__ == "__main__":
    main()
