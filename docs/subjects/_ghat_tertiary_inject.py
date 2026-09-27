# -*- coding: utf-8 -*-
"""Inject Tertiary Sector Ghat PYQs into Economy Topic 11."""
from pathlib import Path
import re

T11 = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy\11_Services_Cooperatives_Regulators.md")
MARKER = "### Ghatnachakra Purvalokan — Tertiary Sector"


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
        print("SKIP Extra")
        return 0
    if MARKER in text[m_extra.start() : m_next.start()]:
        print("ALREADY Extra")
        return 0
    extra = text[m_extra.end() : m_next.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra)), default=0)
    out = []
    for tag, stem, opts, letter, ans, logic, *rest in items:
        ar = rest[0] if rest else False
        key = re.sub(r"\s+", " ", stem[:80]).lower()
        if key in text.lower():
            continue
        n += 1
        out.append(q(f"Q{n}. {tag}", stem, opts, letter, ans, logic, ar=ar))
    if not out:
        print("NONE Extra")
        return 0
    block = f"\n{MARKER}\n\n" + "".join(out)
    path.write_text(text[: m_next.start()] + block + text[m_next.start() :], encoding="utf-8", newline="\n")
    print(f"EXTRA +{len(out)}")
    return len(out)


def inject_uppcs(path: Path, items: list) -> int:
    text = path.read_text(encoding="utf-8")
    m_bank = re.search(r"^## Complete PYQ Bank \(UPPCS\)[^\n]*\n", text, re.M)
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    if not m_bank or not m_extra:
        print("SKIP bank")
        return 0
    chunk = text[m_bank.end() : m_extra.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", chunk)), default=0)
    out = []
    for tag, stem, opts, letter, ans, logic, *rest in items:
        ar = rest[0] if rest else False
        key = re.sub(r"\s+", " ", stem[:80]).lower()
        if key in text.lower():
            continue
        n += 1
        out.append(q(f"Q{n}. {tag}", stem, opts, letter, ans, logic, ar=ar))
    if not out:
        print("NONE bank")
        return 0
    path.write_text(text[: m_extra.start()] + "\n" + "".join(out) + text[m_extra.start() :], encoding="utf-8", newline="\n")
    print(f"BANK +{len(out)}")
    return len(out)


EXTRA = [
    ("U.P. U.D.A./L.D.A. (Pre) 2002 / U.P.P.C.S. (Pre) 2003",
     "In India, Tertiary Sector includes:\n1. Trade and Transport\n2. Finance and Real Estate\n3. Forestry and Fishing",
     ["A. 1 only", "B. 1 and 2 only", "C. 2 and 3 only", "D. 3 only"],
     "B", "1 and 2 only.",
     "Forestry and fishing are primary — not tertiary."),
    ("U.P.P.C.S. (Mains) 2004",
     "In India, Service Sector includes:\nI. Mining and Quarrying\nII. Transport and Communication\nIII. Hotels\nIV. Forestry and Fishing",
     ["A. Only I and II", "B. Only II and III", "C. Only III and IV", "D. Only I and IV"],
     "B", "Only II and III.",
     "Mining and forestry/fishing are primary."),
    ("U.P. Lower Sub. (Pre) 2008",
     "Which one of the following is a tertiary activity?",
     ["A. Forestry", "B. Manufacturing", "C. Farming", "D. Marketing"],
     "D", "Marketing.",
     "Forestry/farming = primary; manufacturing = secondary."),
    ("U.P.P.C.S. (Pre) (Re-Exam) 2015",
     "Which among the following is the primary sector of Indian economy?",
     ["A. Agriculture", "B. Industry", "C. Cooperative", "D. None of the above"],
     "A", "Agriculture.",
     "Primary = agri and related resource extraction."),
    ("I.A.S. (Pre) 2024",
     "Match economic activity to sector:\n1. Storage of agricultural produce — Secondary\n2. Dairy farm — Primary\n3. Mineral exploration — Tertiary\n4. Weaving cloth — Secondary\nHow many pairs are correctly matched?",
     ["A. Only one", "B. Only two", "C. Only three", "D. All four"],
     "B", "Only two (dairy primary; weaving secondary).",
     "Storage is tertiary (not secondary); mineral exploration is primary-side mining support (not tertiary)."),
    ("U.P. R.O./A.R.O. (Mains) 2017",
     "Transport, Communication, Commerce come under the:",
     ["A. Primary activities", "B. Secondary activities", "C. Tertiary activities", "D. Rural activities"],
     "C", "Tertiary activities.",
     "Classic services trio."),
    ("U.P. R.O./A.R.O. (Pre) 2021",
     "The largest source of National Income in India is:",
     ["A. Service Sector", "B. Agriculture Sector", "C. Industrial Sector", "D. Trade Sector"],
     "A", "Service Sector.",
     "Services dominate GVA/national income share."),
    ("70th B.P.S.C. (Pre) 2024",
     "What were the shares of Agriculture, Industry and Services in overall GVA at current prices in FY 2024 (Economic Survey 2023–24)?",
     ["A. 17.7%, 27.6% and 54.7%", "B. 18.7%, 28.6% and 52.7%", "C. 17.7%, 28.6% and 53.7%", "D. 16.7%, 26.6% and 56.7%"],
     "A", "17.7%, 27.6% and 54.7%.",
     "Services lead; agri smallest among the three."),
    ("U.P.P.C.S. (Pre) 2012",
     "The largest share of Gross Domestic Product (GDP) in India comes from:",
     ["A. Agriculture and allied sectors", "B. Manufacturing, construction, electricity and gas",
      "C. Services sector", "D. Defence and public administration"],
     "C", "Services sector.",
     "Services > industry > agri in modern map."),
    ("U.P.P.C.S. (Mains) 2017 / U.P.P.C.S. (Pre) 2005",
     "Correct sequence in decreasing order of contributions of sectors to GDP of India:",
     ["A. Services > Agriculture > Industry", "B. Industry > Services > Agriculture",
      "C. Industry > Agriculture > Services", "D. Services > Industry > Agriculture"],
     "D", "Services > Industry > Agriculture.",
     "Current GVA share order."),
    ("M.P.P.C.S. (Pre) 2008",
     "Which among the following sectors contributes most to the GDP of India?",
     ["A. Primary sector", "B. Secondary sector", "C. Tertiary sector", "D. All three contribute equally"],
     "C", "Tertiary sector.",
     "Services dominate."),
    ("U.P.P.C.S. (Mains) 2004",
     "Which one of the following contributes highest share in India’s domestic production?",
     ["A. Agriculture and allied activities", "B. Manufacturing industries",
      "C. Electricity, gas and water supply", "D. Services"],
     "D", "Services.",
     "Same services-lead card."),
    ("U.P. P.C.S. (Mains) 2014",
     "The share of services in India’s GDP and total employment in 2012–13 respectively are approximately:",
     ["A. 50% and 20%", "B. 57% and 28%", "C. 64% and 34%", "D. 55% and 45%"],
     "B", "About 57% and 28%.",
     "Services share of GVA ≫ employment share."),
    ("U.P.P.C.S. (Pre) 2010",
     "Which statement is not true about the Indian Economy?\n(b-option style) The share of services sector in India’s GDP is only 25%.",
     ["A. World population/land share statements (near-correct for period)",
      "B. Services sector share in GDP is only 25%",
      "C. Workforce in agri vs agri income share (period-near)",
      "D. India occupies about 2.4% of world geographical area"],
     "B", "Services-only-25% is false.",
     "Services have long been ~half or more of GDP/GVA."),
    ("I.A.S. (Pre) 1999",
     "Since 1980, the share of the tertiary sector in the total GDP of India has:",
     ["A. shown an increasing trend", "B. shown a decreasing trend", "C. remained constant", "D. been fluctuating"],
     "A", "Increasing trend.",
     "Structural shift toward services."),
    ("U.P.P.C.S. (Mains) 2007",
     "In India, between 2001 to 2005, growth rate of which sector has consistently increased?",
     ["A. Agriculture", "B. Industry", "C. Services", "D. None of the above"],
     "C", "Services.",
     "Services growth consistency card for that window."),
    ("U.P.P.C.S. (Mains) 2006",
     "As the economy develops, the share of the tertiary sector in the GDP:",
     ["A. Decreases", "B. Decreases then increases", "C. Increases", "D. Remains constant"],
     "C", "Increases.",
     "Development → rising services share."),
    ("Chhattisgarh P.C.S. (Pre) 2014",
     "What was the rank of growth rate of services sector of India in world during 2001 to 2012?",
     ["A. First", "B. Second", "C. Third", "D. Fourth", "E. Fifth"],
     "B", "Second (after China in Survey 2013–14 teaching).",
     "CAGR ~9% India vs ~10.9% China for 2001–12."),
    ("U.P.P.C.S. (Mains) 2010",
     "During 2006–2010, which service sector registered fastest growth in India?",
     ["A. Banking and Insurance", "B. Construction", "C. Transportation", "D. Communication"],
     "D", "Communication.",
     "Construction is industry — not a services sub-sector in this stem."),
    ("U.P.P.C.S. (Pre) 2008",
     "Among the services sector, which had the highest share in India’s GDP in 2006?",
     ["A. Trade, Hotels, Transport and Communication",
      "B. Finance, Insurance, Real Estate and Business Services",
      "C. Community, Social and Personal Services",
      "D. Construction of buildings"],
     "A", "Trade, Hotels, Transport and Communication (2006 key).",
     "Later years often flip to finance–real estate as largest — year matters. Construction ≠ services."),
]

BANK = [
    ("U.P.P.C.S. (Pre) 2003 / Mains 2004",
     "Tertiary Sector includes Trade and Transport; Finance and Real Estate; Forestry and Fishing — correct code?",
     ["A. 1 only", "B. 1 and 2 only", "C. 2 and 3 only", "D. 3 only"],
     "B", "1 and 2 only.",
     "Forestry/fishing = primary."),
    ("U.P.P.C.S. (Mains) 2004",
     "Service Sector includes Mining; Transport & Communication; Hotels; Forestry & Fishing — correct?",
     ["A. Only I and II", "B. Only II and III", "C. Only III and IV", "D. Only I and IV"],
     "B", "Only II and III.",
     "Mining and forestry/fishing excluded."),
    ("U.P.P.C.S. (Pre) (Re-Exam) 2015",
     "Primary sector of Indian economy is:",
     ["A. Agriculture", "B. Industry", "C. Cooperative", "D. None"],
     "A", "Agriculture.",
     "Primary identity."),
    ("U.P. R.O./A.R.O. (Mains) 2017",
     "Transport, Communication, Commerce come under:",
     ["A. Primary", "B. Secondary", "C. Tertiary", "D. Rural"],
     "C", "Tertiary.",
     "Services activities."),
    ("U.P. R.O./A.R.O. (Pre) 2021",
     "Largest source of National Income in India is:",
     ["A. Service Sector", "B. Agriculture", "C. Industrial", "D. Trade Sector"],
     "A", "Service Sector.",
     "Services dominate GVA."),
    ("U.P.P.C.S. (Pre) 2012",
     "Largest share of GDP in India comes from:",
     ["A. Agriculture and allied", "B. Manufacturing, construction, electricity and gas",
      "C. Services sector", "D. Defence and public administration"],
     "C", "Services sector.",
     "Services lead."),
    ("U.P.P.C.S. (Mains) 2017",
     "Decreasing order of sector contributions to GDP:",
     ["A. Services > Agriculture > Industry", "B. Industry > Services > Agriculture",
      "C. Industry > Agriculture > Services", "D. Services > Industry > Agriculture"],
     "D", "Services > Industry > Agriculture.",
     "Modern share order."),
    ("U.P.P.C.S. (Pre) 2010",
     "Which is not true: services sector share in India’s GDP is only 25%?",
     ["A. Population/land near-correct statements", "B. Services share only 25%",
      "C. Agri workforce vs income near-correct", "D. 2.4% of world area"],
     "B", "The 25% claim is false.",
     "Services ≈ half+ of GDP/GVA."),
    ("U.P.P.C.S. (Mains) 2006",
     "As the economy develops, tertiary share in GDP:",
     ["A. Decreases", "B. Decreases then increases", "C. Increases", "D. Remains constant"],
     "C", "Increases.",
     "Structural shift."),
    ("U.P.P.C.S. (Mains) 2007",
     "Between 2001–2005, which sector’s growth rate consistently increased?",
     ["A. Agriculture", "B. Industry", "C. Services", "D. None"],
     "C", "Services.",
     "Services consistency window."),
]


def main():
    print("bank", inject_uppcs(T11, BANK))
    print("extra", inject_extra(T11, EXTRA))


if __name__ == "__main__":
    main()
