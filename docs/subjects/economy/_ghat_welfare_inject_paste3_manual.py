# -*- coding: utf-8 -*-
"""
Manual inject for Ghat Employment/Welfare continuation + Poverty & Unemployment desk.
Uses structured stems from the pasted block (Q246+ and Poverty section).
Does not touch Consolidated (cap 50).
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MD = ROOT / "08_Employment_Poverty_Human_Capital.md"

# (exam, stem, options dict, ans, logic)
ITEMS: list[dict] = [
    {
        "exam": "I.A.S. (Pre) 2024",
        "stem": "Consider the following statements regarding World Toilet Organization: 1. It is one of the agencies of the United Nations. 2. World Toilet Summit, World Toilet Day and World Toilet College are the initiatives of this organization. 3. The main focus of its function is to grant funds to LDCs/developing countries to end open defecation. Which is/are correct?",
        "options": {"a": "2 only", "b": "3 only", "c": "1 and 2", "d": "2 and 3"},
        "ans": "a",
        "logic": "WTO is a global NGO (ECOSOC consultative status), not a UN agency; Day/Summit/College are its initiatives; fund-granting is not its main focus.",
    },
    {
        "exam": "I.A.S. (Pre) 2021",
        "stem": "With reference to ‘WaterCredit’, consider the following statements: 1. It puts microfinance tools to work in the water and sanitation sector. 2. It is a global initiative launched under the aegis of WHO and the World Bank. 3. It aims to enable the poor to meet water needs without depending on subsidies. Which are correct?",
        "options": {"a": "1 and 2 only", "b": "2 and 3 only", "c": "1 and 3 only", "d": "1, 2 and 3"},
        "ans": "c",
        "logic": "WaterCredit is a Water.org initiative — microfinance for watsan and less subsidy dependence; not WHO/World Bank.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2019",
        "stem": "National Social Assistance Programme does not include the following scheme for BPL households:",
        "options": {
            "a": "National Family Benefit Scheme",
            "b": "Annapurna",
            "c": "Mahila Kisan Sashaktikaran Pariyojna",
            "d": "All of the above",
        },
        "ans": "c",
        "logic": "NSAP covers IGNOAPS, IGNWPS, IGNDPS, NFBS and Annapurna. MKSP is a DAY-NRLM sub-component.",
    },
    {
        "exam": "I.A.S. (Pre) 2008",
        "stem": "With reference to Indira Gandhi National Old Age Pension Scheme (IGNOAPS): 1. All persons of 60 years or above belonging to BPL households in rural areas are eligible. 2. Central Assistance is Rs. 300 per month per beneficiary and States have been urged to give matching amounts. Which is/are correct?",
        "options": {"a": "1 only", "b": "2 only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "a",
        "logic": "Age cut-off moved to 60 from 2011; the keyed present reading treats statement 1 as correct and the fixed Rs. 300 Central figure as not the live lock.",
    },
    {
        "exam": "R.A.S./R.T.S. (Pre) 1996",
        "stem": "The objective of ‘Minimum Needs Programme’ is to provide the infrastructure to:",
        "options": {
            "a": "Urban Population",
            "b": "Rural Population",
            "c": "Rural-Urban Population",
            "d": "Tribal Population",
        },
        "ans": "c",
        "logic": "MNP (Fifth Plan) builds a basic-services network for community needs across areas — investment in human resources.",
    },
    {
        "exam": "U.P.P.C.S. (Spl.) (Mains) 2004",
        "stem": "The concept of ‘Minimum Needs Programme’ is synonymous with which one of the following?",
        "options": {
            "a": "Antyodaya approach",
            "b": "Freedom from hunger approach",
            "c": "Investment in human approach",
            "d": "Infrastructure development approach",
        },
        "ans": "c",
        "logic": "MNP is framed as investment in human resources / social consumption norms.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Pre) 2013",
        "stem": "Which one of the following is not under the Minimum Needs Programme?",
        "options": {
            "a": "Rural Water Supply",
            "b": "Social Forestry",
            "c": "Rural Education",
            "d": "Improvement of urban slums",
        },
        "ans": "b",
        "logic": "Social forestry is the odd one out of the classic MNP heads.",
    },
    {
        "exam": "69th B.P.S.C. (Pre) 2023",
        "stem": "Consider the following statements regarding the SVAMITVA scheme: 1. It is a Central Sector Scheme under the Ministry of Mines. 2. It seeks to create geopositioning infrastructure like CORS network for ~5 cm accuracy. 3. CORS means Cross-Origin Resource Sharing. 4. It maps rural Abadi parcels using drone technology for clear ownership. Which statements are incorrect?",
        "options": {"a": "2 and 4", "b": "1 and 3", "c": "2 and 3", "d": "1 and 4"},
        "ans": "b",
        "logic": "SVAMITVA is under Panchayati Raj; CORS = Continuous Operating Referencing System — statements 1 and 3 are wrong.",
    },
    {
        "exam": "I.A.S. (Pre) 2024",
        "stem": "With reference to the Digital India Land Records Modernisation Programme, consider the following statements: 1. The Central Government provides 100% funding. 2. Under the Scheme, cadastral maps are digitised. 3. An initiative has been undertaken to transliterate Records of Rights into Constitution-recognised languages. Which are correct?",
        "options": {"a": "1 and 2 only", "b": "2 and 3 only", "c": "1 and 3 only", "d": "1, 2 and 3"},
        "ans": "d",
        "logic": "DILRMP is Central Sector with 100% Central funding; digitises cadastral maps; supports RoR transliteration.",
    },
    {
        "exam": "R.A.S./R.T.S. (Pre) (Re-Exam) 2013",
        "stem": "Government of India has launched a scheme of ‘Housing for all’ by the year:",
        "options": {"a": "2023", "b": "2020", "c": "2021", "d": "2022"},
        "ans": "d",
        "logic": "PMAY (June 2015) originally aimed at Housing for All by 2022.",
    },
    {
        "exam": "R.A.S./R.T.S. (Pre) 2012",
        "stem": "The main objective of Rajiv Awas Yojana (RAY) is:",
        "options": {
            "a": "to provide free houses to BPL families",
            "b": "to provide free houses to SC/ST families",
            "c": "to provide interest free loan for construction of houses in rural areas",
            "d": "slum free India",
        },
        "ans": "d",
        "logic": "RAY (2011) targeted a slum-free India; later succeeded by PMAY-Urban.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2024",
        "stem": "The Samagra Shiksha Abhiyan has emerged from the amalgamation of which of the following schemes?",
        "options": {
            "a": "SSA and National Skill Development Mission",
            "b": "RMSA and PM Gramin Digital Literacy Mission",
            "c": "SSA, RMSA and Teacher Education (TE)",
            "d": "Beti Bachao Beti Padhao and Sukanya Samriddhi Yojana",
        },
        "ans": "c",
        "logic": "Samagra Shiksha merges SSA + RMSA + Teacher Education.",
    },
    {
        "exam": "U.P.P.S.C. (R.I.) 2014",
        "stem": "Sarva Shiksha Abhiyan for universalization of elementary education was launched by Government of India in the year:",
        "options": {"a": "1996", "b": "2001", "c": "2006", "d": "2011"},
        "ans": "b",
        "logic": "SSA launched in 2001 for ages 6–14 elementary education.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2016",
        "stem": "Which one of the following age groups is eligible for enrolment under ‘Sarva Shiksha Abhiyan’?",
        "options": {"a": "4–12 years", "b": "6–14 years", "c": "5–15 years", "d": "8–16 years"},
        "ans": "b",
        "logic": "SSA covers children in the 6–14 age group.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2023",
        "stem": "In which year was ‘Mid-day Meal Scheme’ renamed as ‘PM Poshan Scheme’?",
        "options": {"a": "2020", "b": "2019", "c": "2018", "d": "2021"},
        "ans": "d",
        "logic": "Mid-day Meal was renamed PM POSHAN in 2021.",
    },
    {
        "exam": "M.P. P.C.S. (Pre) 2021",
        "stem": "Mid day Meal Scheme was launched in which year?",
        "options": {"a": "1991", "b": "1993", "c": "1995", "d": "2000"},
        "ans": "c",
        "logic": "NP-NSPE / Mid-day Meal launched 15 August 1995.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2015",
        "stem": "The Right to Education Act, 2009 aims at making free and compulsory education a right for children upto:",
        "options": {
            "a": "Elementary level",
            "b": "Secondary level",
            "c": "Higher Secondary level",
            "d": "Graduation level",
        },
        "ans": "a",
        "logic": "RTE covers elementary education for ages 6–14.",
    },
    {
        "exam": "I.A.S. (Pre) 2020",
        "stem": "With reference to funds under MPLADS, which statements are correct? 1. Funds must create durable assets. 2. A specified portion must benefit SC/ST populations. 3. Unused funds cannot be carried forward. 4. District authority must inspect at least 10% of works every year.",
        "options": {"a": "1 and 2 only", "b": "3 and 4 only", "c": "1, 2 and 3 only", "d": "1, 2 and 4 only"},
        "ans": "d",
        "logic": "MPLADS funds are non-lapsable — statement 3 is false.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2015",
        "stem": "Which programme was launched on 11th October, 2014, the birth anniversary of Lok Nayak Jayaprakash Narayan?",
        "options": {
            "a": "Swachh Bharat Mission",
            "b": "Digital India",
            "c": "Pradhan Mantri Jan Dhan Yojana",
            "d": "Saansad Adarsh Gram Yojana",
        },
        "ans": "d",
        "logic": "SAGY launched 11 October 2014 on JP Narayan’s birth anniversary.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2009",
        "stem": "‘AADHAAR’ is a programme:",
        "options": {
            "a": "to help senior citizens",
            "b": "to provide nutritional support to adolescent women",
            "c": "to provide identity to Indian Residents",
            "d": "to train people for social defence",
        },
        "ans": "c",
        "logic": "Aadhaar is the 12-digit resident identity number issued by UIDAI.",
    },
    {
        "exam": "64th B.P.S.C. (Pre) 2018",
        "stem": "PURA (Providing Urban Amenities to Rural Areas) model was advocated by:",
        "options": {
            "a": "A.P.J. Abdul Kalam",
            "b": "Manmohan Singh",
            "c": "Lal Krishna Advani",
            "d": "Rajiv Gandhi",
            "e": "None of the above/More than one of the above",
        },
        "ans": "a",
        "logic": "PURA was advocated by Dr A.P.J. Abdul Kalam.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2025",
        "stem": "Assertion (A): Poverty line differs across time and countries. Reason (R): The basic needs of people vary across regions and overtime. Select the correct answer.",
        "options": {
            "a": "Both true, but R is not the correct explanation of A",
            "b": "A false, R true",
            "c": "A true, R false",
            "d": "Both true and R is the correct explanation of A",
        },
        "ans": "d",
        "logic": "Changing basic-needs standards and prices make poverty lines vary across place and time — R explains A.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2023",
        "stem": "Which of the following are the types of poverty? 1. Absolute poverty 2. Relative poverty 3. Subjective poverty 4. Functional poverty",
        "options": {"a": "Only 1 and 4", "b": "Only 1, 2 and 3", "c": "Only 3 and 4", "d": "Only 1 and 2"},
        "ans": "b",
        "logic": "Absolute, relative and subjective are standard types; functional poverty is the distractor.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2017",
        "stem": "In which year UNO adopted a definition of absolute poverty?",
        "options": {"a": "1994", "b": "1995", "c": "1996", "d": "1997"},
        "ans": "b",
        "logic": "UNO absolute-poverty definition teaching year is 1995.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2020",
        "stem": "Which of the following methods has/have been used to estimate poverty in India? 1. Head Count Ratio 2. Calorie Intake 3. Household Consumption Expenditure 4. Per Capita Income",
        "options": {"a": "2 and 3", "b": "1, 2 and 3", "c": "3 only", "d": "1, 2, 3 and 4"},
        "ans": "b",
        "logic": "Indian estimation rests on consumption / calorie-linked baskets and HCR — not per capita income alone.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2018",
        "stem": "Which of the following is measured by the Lorenz curve?",
        "options": {"a": "Illiteracy", "b": "Unemployment", "c": "Population growth rate", "d": "Inequality of income"},
        "ans": "d",
        "logic": "Lorenz curve graphs income/wealth distribution inequality.",
    },
    {
        "exam": "Jharkhand P.C.S. (Pre) 2023",
        "stem": "Which of the following statements is/are correct regarding Gini coefficient? I. It measures the level of income inequality in the society. II. Higher the Gini coefficient, lower the inequality. III. It can be derived using the Lorenz curve.",
        "options": {"a": "I only", "b": "I and III only", "c": "I and II only", "d": "II and III only"},
        "ans": "b",
        "logic": "Higher Gini means higher inequality — statement II is false.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2020",
        "stem": "The idea of ‘Cultural Poverty’ was given by:",
        "options": {"a": "Oscar Lewis", "b": "Gunnar Myrdal", "c": "Aashish Bose", "d": "Amartya Sen"},
        "ans": "a",
        "logic": "Oscar Lewis proposed the culture of poverty.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2014",
        "stem": "The concept of ‘Vicious Circle of Poverty’ is related to:",
        "options": {"a": "Karl Marx", "b": "Nurkse", "c": "Adam Smith", "d": "None of the above"},
        "ans": "b",
        "logic": "Ragnar Nurkse’s vicious circle of poverty.",
    },
    {
        "exam": "Jharkhand P.C.S. (Pre) 2016",
        "stem": "The cyclic poor are those:",
        "options": {
            "a": "Who always remain poor",
            "b": "Who continuously shuffle between being poor and non-poor",
            "c": "Who mostly remain non-poor but sometimes they become poor",
            "d": "All of the above",
        },
        "ans": "b",
        "logic": "Cyclical/cyclic poverty is temporary shuffling between poor and non-poor.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2025",
        "stem": "Consider the following Committees relating to poverty and arrange their formation in correct chronological order: 1. Lakdawala 2. Rangarajan 3. Tendulkar 4. Dandekar and Rath",
        "options": {"a": "4, 1, 2, 3", "b": "1, 4, 3, 2", "c": "1, 4, 2, 3", "d": "4, 1, 3, 2"},
        "ans": "d",
        "logic": "Dandekar–Rath → Lakdawala → Tendulkar → Rangarajan.",
    },
    {
        "exam": "I.A.S. (Pre) 2019",
        "stem": "In a given year in India, official poverty lines are higher in some States than in others because:",
        "options": {
            "a": "Poverty rates vary from State to State",
            "b": "Price levels vary from State to State",
            "c": "Gross State Product varies from State to State",
            "d": "Quality of public distribution varies from State to State",
        },
        "ans": "b",
        "logic": "Inter-state price differentials raise or lower the rupee poverty line.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2006",
        "stem": "Which of the following is not a measure of reducing inequalities?",
        "options": {
            "a": "Minimum Needs Programme",
            "b": "Liberalization of economy",
            "c": "Taxation",
            "d": "Land reforms",
        },
        "ans": "b",
        "logic": "Liberalisation is reform, not a classic inequality-reduction social measure in this key set.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2016",
        "stem": "Kasturba Gandhi Balika Vidyalaya Yojana was started in:",
        "options": {"a": "2004", "b": "2010", "c": "2005", "d": "2012"},
        "ans": "a",
        "logic": "KGBV started in 2004 for girls in educationally backward blocks.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2015",
        "stem": "The focus of Saakshar Bharat Programme is on:",
        "options": {"a": "Female literacy", "b": "Male literacy", "c": "Infant literacy", "d": "Secondary education"},
        "ans": "a",
        "logic": "Saakshar Bharat emphasises adult/female literacy.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 1993",
        "stem": "Operation Black Board is related to:",
        "options": {"a": "Rural Education", "b": "Adult Education", "c": "Urban Education", "d": "Primary Education"},
        "ans": "d",
        "logic": "Operation Blackboard (1987) provided minimum facilities in primary schools.",
    },
]


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def fingerprint(stem: str) -> str:
    words = [w for w in norm(stem).split() if len(w) > 2][:14]
    return " ".join(words)


def is_uppcs(exam: str) -> bool:
    e = exam.upper()
    return "U.P.P.C.S" in e or "U.P. P.C.S" in e or "UPPCS" in e or "U.P.P.S.C. (R.I.)" in e


def is_ro_aro(exam: str) -> bool:
    e = exam.upper()
    return "R.O" in e or "A.R.O" in e or "U.D.A" in e or "L.D.A" in e or "LOWER" in e or "GIC" in e


def existing_fps(md: str) -> set[str]:
    fps = set()
    for m in re.finditer(r"(?:\*\*Q\d+\.[^*]*\*\*\s*)?([^\n]{25,200})", md):
        fps.add(fingerprint(m.group(1)))
    return {f for f in fps if f}


def fmt_q(item: dict, qid: int, bank: bool) -> str:
    lines = [f"**Q{qid}. {item['exam']}**", "", item["stem"], ""]
    for L, v in item["options"].items():
        lines.append(f"{L.upper()}. {v}")
    lines.append("")
    ans = item["ans"].upper()
    logic = item["logic"]
    if bank:
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Logic:** {logic}\n\n"
            f"**Ans: {ans}.**\n\n"
            "</details>\n"
        )
    else:
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Ans: {ans}.**\n\n"
            f"**Logic:** {logic}\n\n"
            "</details>\n"
        )
    lines.append(block)
    return "\n".join(lines)


def main() -> None:
    md = MD.read_text(encoding="utf-8")
    have = existing_fps(md)
    fresh = []
    for it in ITEMS:
        fp = fingerprint(it["stem"])
        if fp in have:
            continue
        fresh.append(it)

    bank, extra = [], []
    for it in fresh:
        if is_uppcs(it["exam"]) and not is_ro_aro(it["exam"]):
            bank.append(it)
        else:
            extra.append(it)

    print(f"fresh {len(fresh)} bank {len(bank)} extra {len(extra)}")

    bank_sec = md.split("## Complete PYQ Bank (UPPCS)")[1].split("## Ghatnachakra Extra Drill")[0]
    extra_sec = md.split("## Ghatnachakra Extra Drill")[1].split("## UKPCS")[0]
    next_bank = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", bank_sec)] or [0]) + 1
    next_extra = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra_sec)] or [0]) + 1

    bank_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(bank, next_bank))
    extra_blob = "\n".join(fmt_q(it, n, False) for n, it in enumerate(extra, next_extra))

    shutil.copy2(MD, MD.with_suffix(".md.bak_paste3"))
    bank_anchor = "## Ghatnachakra Extra Drill — Employment, Poverty and Human Capital"
    if bank_blob:
        md = md.replace(bank_anchor, bank_blob + "\n---\n\n" + bank_anchor, 1)
    if extra_blob:
        md = md.replace("## UKPCS", extra_blob + "\n---\n\n## UKPCS", 1)

    md = re.sub(
        r"> Extra Drill:.*",
        "> Extra Drill: Ghatnachakra **Employment & Welfare / Poverty & Unemployment** "
        "(housing, education, land, sanitation, poverty estimation) + earlier Purvalokan.",
        md,
        count=1,
    )

    m = re.search(r"## Consolidated — (\d+)", md)
    if m and int(m.group(1)) > 50:
        raise SystemExit("Consolidated bloated")

    MD.write_text(md, encoding="utf-8")
    print("wrote bank", next_bank, "-", next_bank + len(bank) - 1 if bank else "none")
    print("wrote extra", next_extra, "-", next_extra + len(extra) - 1 if extra else "none")
    print("consolidated", m.group(1) if m else "?")


if __name__ == "__main__":
    main()
