# -*- coding: utf-8 -*-
"""Inject Sustainable Economic Development Ghat PYQs into Economy Topics 8 & 12."""
from pathlib import Path
import re

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy")
T8 = ROOT / "08_Employment_Poverty_Human_Capital.md"
T12 = ROOT / "12_Economic_Laws_Reports_Rankings_Misc.md"
MARKER = "### Ghatnachakra Purvalokan — Sustainable Economic Development"


def q(tag, stem, opts, letter, ans, logic, ar=False):
    lk = "A/R logic:" if ar else "Logic:"
    return (
        f"**{tag}**\n{stem}\n"
        + "\n".join(opts)
        + "\n\n<details>\n<summary>Show answer</summary>\n\n"
        f"**{lk}** {logic}\n\n**Ans: {letter}.** {ans}\n\n</details>\n\n"
    )


def inject_extra(path: Path, items: list) -> int:
    text = path.read_text(encoding="utf-8")
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    m_next = re.search(r"^## (UKPCS|Practice Zone)[^\n]*\n", text, re.M)
    if not m_extra or not m_next:
        print("SKIP Extra", path.name)
        return 0
    if MARKER in text[m_extra.start() : m_next.start()]:
        print("ALREADY", path.name)
        return 0
    # replace thin placeholder if present
    note = "> Extra Drill rebuilt from mixed RO/ARO–coaching stems (paste full Ghatnachakra Purvalokan later to expand).\n"
    if note in text[m_extra.end() : m_next.start()]:
        text = text.replace(note, "> Extra Drill filled from Ghatnachakra *Sustainable Economic Development* Purvalokan.\n\n", 1)
        m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
        m_next = re.search(r"^## (UKPCS|Practice Zone)[^\n]*\n", text, re.M)
    extra = text[m_extra.end() : m_next.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra)), default=0)
    out = []
    for tag, stem, opts, letter, ans, logic, *rest in items:
        ar = rest[0] if rest else False
        key = re.sub(r"\s+", " ", stem[:70]).lower()
        if key in text.lower():
            continue
        n += 1
        out.append(q(f"Q{n}. {tag}", stem, opts, letter, ans, logic, ar=ar))
    if not out:
        print("NONE", path.name)
        return 0
    block = f"\n{MARKER}\n\n" + "".join(out)
    path.write_text(text[: m_next.start()] + block + text[m_next.start() :], encoding="utf-8", newline="\n")
    print(f"EXTRA +{len(out)} → {path.name}")
    return len(out)


def inject_uppcs(path: Path, items: list) -> int:
    text = path.read_text(encoding="utf-8")
    m_bank = re.search(r"^## Complete PYQ Bank \(UPPCS\)[^\n]*\n", text, re.M)
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    if not m_bank or not m_extra:
        print("SKIP bank", path.name)
        return 0
    chunk = text[m_bank.end() : m_extra.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", chunk)), default=0)
    out = []
    for tag, stem, opts, letter, ans, logic, *rest in items:
        ar = rest[0] if rest else False
        key = re.sub(r"\s+", " ", stem[:70]).lower()
        if key in text.lower():
            continue
        n += 1
        out.append(q(f"Q{n}. {tag}", stem, opts, letter, ans, logic, ar=ar))
    if not out:
        print("NONE bank", path.name)
        return 0
    path.write_text(text[: m_extra.start()] + "\n" + "".join(out) + text[m_extra.start() :], encoding="utf-8", newline="\n")
    print(f"BANK +{len(out)} → {path.name}")
    return len(out)


# ── Topic 12: NITI nodal + SDG Index ranks / goal numbers ──
T12_EXTRA = [
    ("Uttrakhand P.C.S. (Pre) 2024",
     "Which of the following is a Nodal Institution for implementation of Sustainable Development Goals in India?",
     ["A. Planning Commission", "B. Disinvestment Commission", "C. NITI Aayog", "D. Finance Commission"],
     "C", "NITI Aayog.",
     "NITI coordinates and tracks SDG implementation in India — not Planning Commission (abolished) or Finance Commission."),
    ("Sustainable Development Report / SDSN frame",
     "As per Sustainable Development Report 2023, what was the rank of India?",
     ["A. 111", "B. 112", "C. 131", "D. 140"],
     "B", "112 among 166 countries.",
     "SDSN Sustainable Development Report ranks shift yearly — 2024 ≈109; 2025 ≈99 (first time in top 100)."),
    ("60–62nd B.P.S.C. (Pre) 2016",
     "What is India’s rank in the 2016 Sustainable Development Goal Index?",
     ["A. 110th", "B. 88th", "C. 63rd", "D. 129th", "E. None of the above/More than one of the above"],
     "A", "110th among 149 countries.",
     "Edition-bound global SDG Index rank — do not import later SDSN ranks into 2016 stems."),
    ("U.P.P.C.S. (Pre) 2017",
     "What is India’s rank in the 2017 Sustainable Development Goal Index?",
     ["A. 116th", "B. 125th", "C. 108th", "D. 95th"],
     "A", "116th out of 157 nations.",
     "2017 global SDG Index key — distinct from later SDSN Report ranks."),
    ("70th B.P.S.C. (Pre) (Re-Exam) 2024",
     "Which Indian State topped the NITI Aayog’s SDG India Index 2023?",
     ["A. Gujarat", "B. Maharashtra", "C. Tamil Nadu", "D. Kerala"],
     "D", "Kerala (joint top with Uttarakhand at 79 in 2023–24).",
     "2023–24: Kerala & Uttarakhand 79; Bihar lowest at 57."),
    ("U.P. P.C.S. (Pre) 2020",
     "According to the Report released by NITI Aayog in December 2019 on ‘Sustainable Development Goals India Index 2019–20’, Uttar Pradesh is grouped under which category?",
     ["A. Aspirant", "B. Performer", "C. Front runner", "D. Achiever"],
     "B", "Performer.",
     "UP was Performer in 2019–20 and 2020–21; by 2023–24 UP is Front Runner (score 67)."),
    ("U.P.P.C.S. (Pre) 2021",
     "As per SDG India Index and Dashboard 2020–21 published by NITI Aayog, which State was NOT among the top five States?",
     ["A. Gujarat", "B. Andhra Pradesh", "C. Goa", "D. Tamil Nadu"],
     "A", "Gujarat.",
     "2020–21 top cluster: Kerala, HP, Tamil Nadu, AP, Goa, Karnataka, Uttarakhand… — Gujarat was not in that top-five set."),
    ("U.P. B.E.O. (Pre) 2019",
     "According to ‘Sustainable Development Goal (SDG) India Index, 2019’ released by NITI Aayog, which State holds the first position?",
     ["A. Uttar Pradesh", "B. Bihar", "C. Jharkhand", "D. Kerala"],
     "D", "Kerala (score 70).",
     "2019 top: Kerala 70 → HP 69 → AP/Telangana/TN 67."),
    ("U.P. B.E.O. (Pre) 2019",
     "Which of the following State is NOT in the list of top five States on the Sustainable Development Goals Index 2019–20 in India?",
     ["A. Gujarat", "B. Himachal Pradesh", "C. Andhra Pradesh", "D. Tamil Nadu"],
     "A", "Gujarat.",
     "Same 2019–20 top-five trap — Gujarat not in the lead pack."),
    ("Uttarakhand P.C.S. (Pre) 2025",
     "According to NITI Aayog’s SDG India Index 2023–24, which State/States has the highest SDG index score?\n1. Kerala\n2. Uttarakhand\n3. Goa\n4. Tamil Nadu",
     ["A. Only 1", "B. 1 and 2", "C. 2 and 3", "D. 3 and 4"],
     "B", "Kerala and Uttarakhand (79 each).",
     "TN 78; Goa & HP 77 — joint toppers are Kerala + UK."),
    ("M.P.P.C.S. (Pre) 2024",
     "According to NITI Aayog’s SDG India Index 2020, how are States’ categories defined by index score range?",
     ["A. Aspirant: 100; Performer: 65–99; Front-runner: 50–64; Achiever: 0–49",
      "B. Aspirant: 0–49; Performer: 50–64; Front-runner: 65–99; Achiever: 100",
      "C. Aspirant: 50–64; Performer: 65–99; Front-runner: 0–49; Achiever: 100",
      "D. Aspirant: 65–99; Performer: 50–64; Front-runner: 0–49; Achiever: 100"],
     "B", "Aspirant 0–49; Performer 50–64; Front-runner 65–99; Achiever 100.",
     "Achiever is the perfect-100 slot — do not reverse the bands."),
    ("U.P. R.O./A.R.O. (Mains) 2021",
     "Which city was not among the top three in the SDG Urban Index and Dashboard 2021–22 declared by NITI Aayog in November 2021?",
     ["A. Coimbatore", "B. Chandigarh", "C. Indore", "D. Shimla"],
     "C", "Indore.",
     "Top: Shimla → Coimbatore → Chandigarh / Thiruvananthapuram. Indore was outside the top ten."),
    ("U.P.P.C.S. (Pre) 2019",
     "Which Sustainable Development Goal targets water availability for all and its permanent management up to 2030?",
     ["A. SDG-6", "B. SDG-7", "C. SDG-8", "D. SDG-9"],
     "A", "SDG-6 — Clean Water and Sanitation.",
     "SDG-7 energy; SDG-8 decent work; SDG-9 industry/innovation."),
    ("M.P.P.C.S. (Pre) 2024",
     "According to SDG India Index 2018, SDG 1, SDG 2 and SDG 9 represent respectively:",
     ["A. No poverty; Zero hunger; Industry, Innovation and Infrastructure",
      "B. No poverty; Quality education; Life on land",
      "C. Clean water and sanitation; Climate action; Sustainable cities and communities",
      "D. Gender equality; Climate action; Zero hunger"],
     "A", "SDG-1 No Poverty; SDG-2 Zero Hunger; SDG-9 Industry, Innovation and Infrastructure.",
     "Memorise the 17 official titles — do not shuffle climate/gender into 1–2–9."),
    ("R.A.S./R.T.S. (Pre) 2024",
     "Which SDG under the 17 UN goals specifically focuses on “Life on Land”?",
     ["A. SDG 13", "B. SDG 14", "C. SDG 15", "D. SDG 16"],
     "C", "SDG 15 — Life on Land.",
     "13 Climate; 14 Life below water; 16 Peace/justice."),
    ("U.P. P.C.S. (Pre) 2023",
     "Match List-I with List-II:\nA. SDG-10 — 1. Climate Action\nB. SDG-13 — 2. Life on Land\nC. SDG-14 — 3. Reduced inequalities\nD. SDG-15 — 4. Life below water\nCodes A B C D:",
     ["A. 3 2 4 1", "B. 2 3 1 4", "C. 3 1 4 2", "D. 1 2 3 4"],
     "C", "10→Reduced inequalities; 13→Climate; 14→Life below water; 15→Life on Land.",
     "Code 3-1-4-2."),
    ("U.P. P.C.S. (Pre) 2025",
     "Match List-I with List-II:\nA. Goal 1 — 1. Clean water and sanitation\nB. Goal 3 — 2. Quality education\nC. Goal 4 — 3. To end poverty in all forms\nD. Goal 6 — 4. Good health and well-being\nCodes A B C D:",
     ["A. 4 3 1 2", "B. 3 4 2 1", "C. 3 4 1 2", "D. 4 3 2 1"],
     "B", "1→poverty (3); 3→health (4); 4→education (2); 6→water (1).",
     "Correct map is 3-4-2-1. Ignore any OCR/key swap that breaks the official titles."),
    ("U.P.P.C.S. (Pre) 2024",
     "Which measures are essential to achieve Goal 4 of the Sustainable Development Targets, 2030?\n1. Making education free and compulsory\n2. Improving basic school infrastructure and embracing digital transformation\n3. Expansion of agricultural programmes\n4. Increasing investment in technology",
     ["A. 1 and 2", "B. 1, 2, 3 and 4", "C. Only 4", "D. 1, 2 and 3"],
     "A", "1 and 2.",
     "SDG-4 = Quality Education — agri expansion and generic tech investment are not the keyed levers."),
    ("U.P. P.C.S. (Pre) 2025",
     "Assertion (A): India’s success is critical for the global success of Sustainable Development Goals.\nReason (R): India accounts for nearly one-sixth of the total world population.",
     ["A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)",
      "B. (A) is false, but (R) is true",
      "C. (A) is true, but (R) is false",
      "D. Both (A) and (R) are true and (R) is the correct explanation of (A)"],
     "D", "Both true and R explains A.",
     "Population-weighted SDG indicators make India’s progress globally decisive.", True),
    ("U.P. P.C.S. (Pre) 2023",
     "Consider the following statements about sustainable development:\n1. Based on the global indicator framework and data from National Statistical Systems, the UN Secretary-General presents an Annual Sustainable Development Goal Report.\n2. Global Sustainable Development Report is produced to inform the quadrennial SDG review at the UN General Assembly once every quarter.",
     ["A. Only 1", "B. Only 2", "C. Both 1 and 2", "D. Neither 1 nor 2"],
     "A", "Only 1.",
     "GSDR is once every four years — not every quarter."),
]

T12_BANK = [
    ("U.P.P.C.S. (Pre) 2017",
     "What is India’s rank in the 2017 Sustainable Development Goal Index?",
     ["A. 116th", "B. 125th", "C. 108th", "D. 95th"],
     "A", "116th out of 157.",
     "Edition-bound global SDG Index."),
    ("U.P. P.C.S. (Pre) 2020",
     "According to NITI Aayog’s SDG India Index 2019–20, Uttar Pradesh is grouped under which category?",
     ["A. Aspirant", "B. Performer", "C. Front runner", "D. Achiever"],
     "B", "Performer.",
     "Later (2023–24) UP moves to Front Runner — year matters."),
    ("U.P.P.C.S. (Pre) 2021",
     "As per SDG India Index 2020–21, which State was NOT among the top five?",
     ["A. Gujarat", "B. Andhra Pradesh", "C. Goa", "D. Tamil Nadu"],
     "A", "Gujarat.",
     "Gujarat ≠ top-five that year."),
    ("U.P.P.C.S. (Pre) 2019",
     "Which SDG targets water availability for all and sustainable management up to 2030?",
     ["A. SDG-6", "B. SDG-7", "C. SDG-8", "D. SDG-9"],
     "A", "SDG-6.",
     "Clean Water and Sanitation."),
    ("U.P. P.C.S. (Pre) 2023",
     "Match SDG-10, 13, 14, 15 with Reduced inequalities / Climate Action / Life below water / Life on Land.\nCodes for A B C D (10,13,14,15):",
     ["A. 3 2 4 1", "B. 2 3 1 4", "C. 3 1 4 2", "D. 1 2 3 4"],
     "C", "3-1-4-2.",
     "10 inequalities; 13 climate; 14 below water; 15 land."),
    ("U.P.P.C.S. (Pre) 2024",
     "Which measures are essential to achieve SDG Goal 4?\n1. Free and compulsory education\n2. Better school infrastructure and digital transformation\n3. Expansion of agricultural programmes\n4. Increasing investment in technology",
     ["A. 1 and 2", "B. 1, 2, 3 and 4", "C. Only 4", "D. 1, 2 and 3"],
     "A", "1 and 2.",
     "Quality Education levers only."),
    ("U.P. P.C.S. (Pre) 2025",
     "Assertion (A): India’s success is critical for global SDG success.\nReason (R): India accounts for nearly one-sixth of world population.",
     ["A. Both true, R not explanation", "B. A false, R true", "C. A true, R false", "D. Both true and R explains A"],
     "D", "Both true; demographic weight explains A.",
     "Population-weighted global goals.", True),
    ("U.P. P.C.S. (Pre) 2023",
     "UN Secretary-General’s Annual SDG Report uses national statistical systems; Global Sustainable Development Report informs quadrennial review once every quarter — which is correct?",
     ["A. Only statement 1 (Annual Report)", "B. Only statement 2", "C. Both", "D. Neither"],
     "A", "Only the Annual SDG Progress Report statement.",
     "GSDR is every four years, not every quarter."),
    ("U.P. P.C.S. (Pre) 2025",
     "Match Goal 1, 3, 4, 6 with poverty / health / education / water.\nCorrect code A B C D:",
     ["A. 4 3 1 2", "B. 3 4 2 1", "C. 3 4 1 2", "D. 4 3 2 1"],
     "B", "3-4-2-1.",
     "Goal 1 poverty; 3 health; 4 education; 6 water."),
]


# ── Topic 8: Brundtland, Limits, EKC, human/social capital, inclusive ──
T8_EXTRA = [
    ("U.P.P.C.S. (Pre) 2019",
     "Who has propounded the concept of ‘Limits to Growth’?",
     ["A. Club of Rome", "B. UNESCO", "C. Brundtland Commission", "D. Agenda 21"],
     "A", "Club of Rome (1972 report).",
     "Brundtland = Our Common Future (1987) — not Limits to Growth."),
    ("I.A.S. (Pre) 1998",
     "According to Meadows (1972), if present trends continue unchanged, the ‘Limits to Growth’ will be reached in the next:",
     ["A. 50 years", "B. 100 years", "C. 150 years", "D. 200 years"],
     "B", "100 years.",
     "1972 Meadows horizon; later updates shortened the warning window."),
    ("U.P.P.C.S. (Pre) 2014",
     "The Environmental Kuznets Curve (EKC) shows the relationship between per capita GDP and environmental loss. What is its shape?",
     ["A. Inverted ‘U’ shaped", "B. Inverted ‘V’ shaped", "C. Inverted ‘L’ shaped", "D. None of these"],
     "A", "Inverted U-shaped.",
     "Degradation rises then falls after a income threshold."),
    ("Jharkhand P.C.S. (Pre) 2023",
     "When did the term ‘Sustainable Development’ come into existence?",
     ["A. 1980", "B. 1987", "C. 1992", "D. 1998"],
     "A", "1980 (IUCN World Conservation Strategy).",
     "1987 popularised the definition; 1992 Rio/Agenda 21."),
    ("U.P.P.C.S. (Pre) 2024",
     "Assertion (A): The concept of Sustainable Development was popularised by the Brundtland Report.\nReason (R): The Brundtland Report is also known as “The Limits to Growth”.",
     ["A. Both true, R not explanation", "B. A false, R true", "C. Both true and R explains A", "D. A true, R false"],
     "D", "A true; R false.",
     "Brundtland = Our Common Future (1987). Limits to Growth = Club of Rome 1972.", True),
    ("U.P.P.C.S. (Pre) 2019",
     "Assertion (A): Sustainable development is important for well being of human society.\nReason (R): Sustainable development meets present needs without compromising future generations’ ability to meet their own needs.",
     ["A. Both true and R explains A", "B. Both true but R not explanation", "C. A true R false", "D. A false R true"],
     "A", "Both true; Brundtland definition explains why it matters.", True),
    ("U.P. P.C.S. (Pre) 2025",
     "Assertion (A): Sustainable development should not damage the environment or compromise future needs.\nReason (R): Agenda 21 was signed by world leaders in 1995.",
     ["A. Both true, R not explanation", "B. A false R true", "C. A true R false", "D. Both true and R explains A"],
     "C", "A true; R false — Agenda 21 was at Rio Earth Summit **1992**.", True),
    ("U.P.P.C.S. (Pre) 2018",
     "‘Saving energy and other resources for the future without sacrificing people’s comfort in the present’ defines:",
     ["A. Economic growth", "B. Economic development", "C. Sustainable development", "D. Human development"],
     "C", "Sustainable development.",
     "Present comfort + future resource care = Brundtland idea."),
    ("U.P. P.C.S. (Pre) 2023",
     "Natural resources used by the present generation with minimum degradation is called:",
     ["A. Economic Development", "B. Organic Development", "C. Social Development", "D. Sustainable Development"],
     "D", "Sustainable Development.",
     "Inter-generational resource care."),
    ("U.P. P.C.S. (Pre) 2023",
     "Balancing the need to use resources and also conserve them for the future is called:",
     ["A. Reducing consumption", "B. Future resources", "C. Resource conservation", "D. Sustainable development"],
     "D", "Sustainable development.",
     "Use + conserve for future = SD."),
    ("I.A.S. (Pre) 2010",
     "Sustainable development is inherently intertwined with which concept?",
     ["A. Social justice and empowerment", "B. Inclusive Growth", "C. Globalization", "D. Carrying capacity"],
     "D", "Carrying capacity.",
     "SD binds welfare goals to the environment’s sustainable support limit."),
    ("M.P.P.C.S. (Pre) 2015",
     "The base of sustainable development is:",
     ["A. Social approach", "B. Economic approach", "C. Environmental approach", "D. None of the above"],
     "C", "Environmental approach.",
     "Environment is the foundational lens in the keyed option set."),
    ("U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
     "Who is the author of the book ‘The Population Bomb’?",
     ["A. Malthus", "B. Paul R. Ehrlich", "C. Thompson", "D. Donald Bogue"],
     "B", "Paul R. Ehrlich (1968).",
     "Population–environment alarm classic."),
    ("M.P.P.C.S. (Pre) 2015",
     "What do we mean by sustainable economic development?",
     ["A. Future economic development with development of present generation",
      "B. Only economic development of present generation",
      "C. Industrial development",
      "D. Agriculture development"],
     "A", "Present needs met while sustaining resources for the future.",
     "Inter-generational economic + ecological balance."),
    ("U.P.U.D.A./L.D.A. (Pre) 2013",
     "Sustainable development is a case of inter-generational sensibilities in respect of use of:",
     ["A. Natural resources", "B. Material resources", "C. Industrial resources", "D. Social resources"],
     "A", "Natural resources.",
     "Classic inter-generational natural-resource framing."),
    ("I.A.S. (Pre) 2025",
     "Circular economy reduces GHG emissions; reduces raw-material use; reduces wastage — which is correct?",
     ["A. Both II and III correct and both explain I",
      "B. Both II and III correct but only one explains I",
      "C. Only one of II/III correct and that explains I",
      "D. Neither II nor III correct"],
     "A", "II and III both correct and both explain lower emissions.",
     "Less virgin material + less waste → lower GHG."),
    ("U.P.P.C.S. (Mains) 2010",
     "Neemrana, a model of sustainable economic development, is located in:",
     ["A. Haryana", "B. Punjab", "C. Rajasthan", "D. Uttar Pradesh"],
     "C", "Rajasthan.",
     "Industrial/sustainable-development model town teaching."),
    ("U.P. P.C.S. (Pre) 2020",
     "The main objective of sustainable tourism is:",
     ["A. To increase the number of tourists",
      "B. To manage mass scale tourism and small scale travel",
      "C. To manage tourism and environment while maintaining cultural integrity and ecological processes",
      "D. None of the above"],
     "C", "Tourism + environment + cultural integrity + ecology.",
     "Not mere headcount growth."),
    ("M.P. P.C.S. (Pre) 2020",
     "The task force of blue economy for sustainable development is a collaboration between India and:",
     ["A. Switzerland", "B. Norway", "C. Sweden", "D. France"],
     "B", "Norway (launched Jan 2019).",
     "India–Norway Blue Economy Task Force."),
    ("I.A.S. (Pre) 2019",
     "In the context of any country, which would be considered as part of its social capital?",
     ["A. Proportion of literates", "B. Stock of buildings and machines",
      "C. Size of working-age population", "D. Level of mutual trust and harmony in society"],
     "D", "Mutual trust and harmony.",
     "Literacy/working age = human capital; machines = physical capital."),
    ("I.A.S. (Pre) 2018",
     "Human capital formation enables:\n1. Individuals to accumulate more capital\n2. Increasing knowledge, skill levels and capacities\n3. Accumulation of tangible wealth\n4. Accumulation of intangible wealth",
     ["A. 1 and 2", "B. 2 only", "C. 2 and 4", "D. 1, 3 and 4"],
     "C", "2 and 4.",
     "Skills/knowledge + intangible wealth — not physical GCF."),
    ("69th B.P.S.C. (Pre) 2023",
     "Human capital formation is better explained as increasing the knowledge, skill levels and capacities of the people — which option captures this?",
     ["A. Only 1", "B. 1 and 2", "C. 3 and 4", "D. Only 4"],
     "D", "Only the full knowledge–skill–capacity statement.",
     "Same UPSC 2018 idea in BPSC options."),
    ("U.P.P.C.S. (Mains) 2011",
     "Skill development programme enhances:",
     ["A. Human Capital", "B. Physical Capital", "C. Working Capital", "D. Fixed Capital"],
     "A", "Human Capital.",
     "PMKVY-type skilling builds people’s productive capacity."),
    ("U.P. R.O./A.R.O. (Mains) 2017",
     "Which will not have a direct impact on human capital formation?",
     ["A. Education", "B. Medical Care", "C. Training", "D. Irrigation"],
     "D", "Irrigation.",
     "Irrigation is physical/agri capital — not direct HC."),
    ("U.P.P.C.S. (Pre) (Re-Exam) 2015",
     "Increasing investment in human capital leads to:",
     ["A. Proper use of resources", "B. Increase in productivity", "C. Skill development", "D. All of the above"],
     "D", "All of the above.",
     "Skills → better resource use → productivity."),
    ("66th B.P.S.C. (Pre) 2020",
     "Which country topped the Human Capital Index, 2020?",
     ["A. Japan", "B. South Korea", "C. Singapore", "D. Hong Kong", "E. None of the above/More than one of the above"],
     "C", "Singapore (World Bank HCI 2020).",
     "India ≈116th in HCI 2020 teaching."),
    ("U.P.P.C.S. (Mains) 2008",
     "Inclusive growth would necessitate:",
     ["A. Development of infrastructural facilities",
      "B. Revival of agriculture",
      "C. Increased availability of social services such as education and health",
      "D. All of the above"],
     "D", "All of the above.",
     "Inclusive growth = broad opportunity set."),
    ("U.P. U.D.A./L.D.A. (Pre) 2013",
     "Inclusive growth is not expected to increase from which one?",
     ["A. High growth rate of National Income",
      "B. Rural development",
      "C. Agriculture development",
      "D. Adequate credit to farmers"],
     "A", "High growth of National Income alone.",
     "Aggregate growth ≠ inclusive without distribution/access."),
    ("I.A.S. (Pre) 2012",
     "Which are essentially parts of Inclusive Governance?\n1. Permitting NBFCs to do banking\n2. Effective District Planning Committees\n3. Increasing government spending on public health\n4. Strengthening Mid-day Meal Scheme",
     ["A. 1 and 2 only", "B. 3 and 4 only", "C. 2, 3 and 4 only", "D. 1, 2, 3 and 4"],
     "C", "2, 3 and 4 only.",
     "NBFC banking permission is not inclusive governance."),
    ("I.A.S. (Pre) 2011",
     "Which can aid inclusive growth?\n1. Promoting SHGs\n2. Promoting MSMEs\n3. Implementing RTE Act",
     ["A. 1 only", "B. 1 and 2 only", "C. 2 and 3 only", "D. 1, 2 and 3"],
     "D", "All three.",
     "SHG + MSME + RTE widen opportunity."),
    ("U.P.P.C.S. (Pre) (Re-Exam) 2015",
     "A new chapter on sustainable development and climate change was first introduced in the Economic Survey of:",
     ["A. 2004–05", "B. 2011–12", "C. 2012–13", "D. 2013–14"],
     "B", "2011–12.",
     "Survey chapter debut year."),
]

T8_BANK = [
    ("U.P.P.C.S. (Pre) 2019",
     "Who has propounded the concept of ‘Limits to Growth’?",
     ["A. Club of Rome", "B. UNESCO", "C. Brundtland Commission", "D. Agenda 21"],
     "A", "Club of Rome.",
     "Not Brundtland."),
    ("U.P.P.C.S. (Pre) 2024",
     "Assertion (A): Sustainable Development was popularised by the Brundtland Report.\nReason (R): The Brundtland Report is also known as “The Limits to Growth”.",
     ["A. Both true, R not explanation", "B. A false R true", "C. Both true and R explains", "D. A true, R false"],
     "D", "A true; R false.",
     "Brundtland ≠ Limits to Growth.", True),
    ("U.P.P.C.S. (Pre) 2019",
     "Assertion (A): Sustainable development is important for well being of human society.\nReason (R): It meets present needs without compromising future generations.",
     ["A. Both true and R explains A", "B. Both true R not explanation", "C. A true R false", "D. A false R true"],
     "A", "Both true; R explains A.",
     "Brundtland definition.", True),
    ("U.P. P.C.S. (Pre) 2025",
     "Assertion (A): Sustainable development should not damage the environment or compromise future needs.\nReason (R): Agenda 21 was signed in 1995.",
     ["A. Both true R not explanation", "B. A false R true", "C. A true R false", "D. Both true and R explains"],
     "C", "A true; Agenda 21 was 1992, not 1995.", True),
    ("U.P.P.C.S. (Pre) 2018",
     "Saving energy and resources for the future without sacrificing present comfort defines:",
     ["A. Economic growth", "B. Economic development", "C. Sustainable development", "D. Human development"],
     "C", "Sustainable development.",
     "Brundtland-style definition."),
    ("U.P. P.C.S. (Pre) 2023",
     "Balancing use of resources with conservation for the future is called:",
     ["A. Reducing consumption", "B. Future resources", "C. Resource conservation", "D. Sustainable development"],
     "D", "Sustainable development.",
     "Use + conserve."),
    ("U.P. P.C.S. (Pre) 2020",
     "Main objective of sustainable tourism is:",
     ["A. Increase tourist numbers", "B. Manage mass and small travel",
      "C. Manage tourism and environment while maintaining cultural integrity and ecological processes",
      "D. None"],
     "C", "Tourism–environment–culture–ecology balance.",
     "Not headcount."),
    ("U.P.P.C.S. (Pre) (Re-Exam) 2015",
     "Economic Survey first introduced a chapter on sustainable development and climate change in:",
     ["A. 2004–05", "B. 2011–12", "C. 2012–13", "D. 2013–14"],
     "B", "2011–12.",
     "Survey chapter debut."),
]


def main():
    print("T12", inject_extra(T12, T12_EXTRA), inject_uppcs(T12, T12_BANK))
    print("T8", inject_extra(T8, T8_EXTRA), inject_uppcs(T8, T8_BANK))


if __name__ == "__main__":
    main()
