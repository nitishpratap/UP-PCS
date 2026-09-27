# -*- coding: utf-8 -*-
"""Inject Industrial Sector Ghat PYQs into Economy Topics 7, 11, 12."""
from pathlib import Path
import re

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy")
T7 = ROOT / "07_Industry_MSME_Infrastructure.md"
T11 = ROOT / "11_Services_Cooperatives_Regulators.md"
T12 = ROOT / "12_Economic_Laws_Reports_Rankings_Misc.md"
MARKER = "### Ghatnachakra Purvalokan — Industrial Sector"


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
    note = "> Extra Drill rebuilt from mixed RO/ARO–coaching stems (paste full Ghatnachakra Purvalokan later to expand).\n"
    if note in text[m_extra.end() : m_next.start()]:
        text = text.replace(
            note,
            "> Extra Drill filled from Ghatnachakra *Industrial Sector* Purvalokan.\n\n",
            1,
        )
        m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
        m_next = re.search(r"^## (UKPCS|Practice Zone)[^\n]*\n", text, re.M)
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
        print("NONE Extra", path.name)
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
        key = re.sub(r"\s+", " ", stem[:80]).lower()
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


T7_EXTRA = [
    ("Uttarakhand P.C.S. (Pre) 2006",
     "Which was the first Indian Private Sector Company to find place in Global 500 list of Fortune Magazine?",
     ["A. Wipro", "B. Infosys", "C. TCS", "D. Reliance Industries Ltd."],
     "D", "Reliance Industries Ltd.",
     "2006 Global 500 teaching — RIL first Indian private entrant."),
    ("U.P.B.E.O. (Pre) 2019",
     "According to Fortune India List of 500 Companies, the biggest Company/Corporation in 2019 was:",
     ["A. Indian Oil Corporation Ltd.", "B. Oil and Natural Gas Corporation", "C. Reliance Industries Ltd.", "D. State Bank of India"],
     "C", "Reliance Industries Ltd.",
     "RIL topped Fortune India 500 in 2019 and subsequent recent years."),
    ("70th B.P.S.C. (Pre) (Re-Exam) 2024",
     "Which company became the first Indian company to cross the 200 billion USD market capitalization?",
     ["A. Infosys", "B. HDFC Bank", "C. TCS", "D. Reliance Industries"],
     "D", "Reliance Industries (Sep 2020 teaching).",
     "TCS later crossed briefly; RIL sustained above USD 200 bn in later teaching."),
    ("I.A.S. (Pre) 2019",
     "Consider the following about PNGRB:\n1. PNGRB is the first regulatory body set up by the Government of India.\n2. One task of PNGRB is to ensure competitive markets for gas.\n3. Appeals against PNGRB decisions go before the Appellate Tribunal for Electricity.",
     ["A. 1 and 2 only", "B. 2 and 3 only", "C. 1 and 3 only", "D. 1, 2 and 3"],
     "B", "2 and 3 only.",
     "PNGRB (2006) is not India’s first regulator; appeals use Electricity Appellate Tribunal."),
    ("70th B.P.S.C. (Pre) 2024",
     "Which of the following is the full form of PCRA?",
     ["A. Partial Counting of Remaining Amendment", "B. Public Conservations Research Association",
      "C. Petroleum Conservation Research Association", "D. Public Council of Research Association"],
     "C", "Petroleum Conservation Research Association.",
     "MoPNG aegis energy-efficiency body."),
    ("U.P. R.O./A.R.O. (Pre) 2021",
     "With reference to Indian Railways, which is/are correct?\n1. Achieving 100 percent electrification by 2023.\n2. A net zero carbon emission network by 2030.",
     ["A. Only 1", "B. Only 2", "C. Both 1 and 2", "D. Neither 1 nor 2"],
     "C", "Both (as per the keyed mission statements).",
     "Electrification mission + net-zero 2030 green-railway target."),
    ("U.P. R.O./A.R.O. (Pre) 2021",
     "Where in India is the first rubber-based tyre Metro being built?",
     ["A. Ahmednagar", "B. Surat", "C. Vadodara", "D. Nashik"],
     "D", "Nashik (Metro Neo).",
     "Rubber-tyred rapid transit teaching."),
    ("65th B.P.S.C. (Pre) 2019",
     "The first showroom in India of retail furniture giant IKEA was opened in which city in 2018?",
     ["A. Bengaluru", "B. Hyderabad", "C. New Delhi", "D. Mumbai", "E. None of the above/More than one of the above"],
     "B", "Hyderabad (9 Aug 2018).",
     "Later stores in other metros — first was Hyderabad."),
    ("U.P.P.C.S. (Mains) 2017",
     "Who was the chairman of the committee on revisiting and revitalizing the PPP model of infrastructure development?",
     ["A. Rakesh Mohan", "B. V. Kelkar", "C. Arjun Sengupta", "D. Bibek Debroy"],
     "B", "Vijay Kelkar.",
     "Budget 2015–16 announcement → Kelkar PPP committee."),
    ("66th B.P.S.C. (Pre) 2020",
     "Which infrastructure sector is related with Bharatmala Project?",
     ["A. Telecom sector", "B. Railways", "C. Road infrastructure", "D. Port sector", "E. None of the above / More than one of the above"],
     "C", "Road infrastructure.",
     "Bharatmala = highways/roads; Sagarmala = ports."),
    ("U.P. P.C.S. (Pre) 2020",
     "Assertion (A): Government has launched the National Infrastructure Pipeline (NIP) for period of 2020–30.\nReason (R): The objective of NIP is to provide equitable access to infrastructure for all.",
     ["A. Both true and R explains A", "B. Both true but R not explanation", "C. A true R false", "D. A false but R true"],
     "D", "A false (horizon ≈ FY 2019–25); R true.",
     "Do not memorise NIP as 2020–30.", True),
    ("65th B.P.S.C. (Pre) 2019",
     "Which industrial/economic corridor of India is being developed in collaboration with Japan?",
     ["A. Chennai–Vizag", "B. Mumbai–Bengaluru", "C. Delhi–Mumbai", "D. Amritsar–Kolkata", "E. None of the above/More than one of the above"],
     "C", "Delhi–Mumbai Industrial Corridor (DMIC).",
     "Japan MoU 2006 teaching; Japan also assists CBIC."),
    ("I.A.S. (Pre) 2009",
     "Among other things, what was the purpose for which the Deepak Parekh Committee was constituted?",
     ["A. Socio-economic conditions of certain minority communities",
      "B. To suggest measures for financing the development of infrastructure",
      "C. Policy on production of GMOs", "D. Measures to reduce fiscal deficit"],
     "B", "Financing infrastructure development.",
     "Finance Ministry committee, Dec 2006."),
    ("63rd B.P.S.C. (Pre) 2017",
     "According to Indian Cellular Association data, India acquired what position in the world in producing mobile phones?",
     ["A. First", "B. Second", "C. Third", "D. Fourth", "E. None of the above/More than one of the above"],
     "B", "Second (after China).",
     "2017 ICA teaching; retained in later years."),
    ("U.P. P.C.S. (Pre) 2025",
     "Assertion (A): India is the second largest mobile gaming market in the world.\nReason (R): There are more than 950 million internet users in India.",
     ["A. Both true, R not explanation", "B. A false, R true", "C. A true, R false", "D. Both true and R explains A"],
     "B", "A false (downloads vs revenue framing); R true (~950m+ users).", True),
    ("I.A.S. (Pre) 2017",
     "With reference to National Investment and Infrastructure Fund, which is/are correct?\n1. It is an organ of NITI Aayog.\n2. It has a corpus of Rs. 4,00,000 crore at present.",
     ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither 1 nor 2"],
     "D", "Neither — not NITI; proposed corpus ≈ ₹40,000 crore teaching.",
     "NIIF = Finance Ministry infra fund."),
    ("69th B.P.S.C. (Pre) 2023",
     "About PLI scheme statements on applicant categories and ~8% incentive for six years — which are incorrect?",
     ["A. 1 and 4", "B. 2 and 4", "C. 1 and 3", "D. 2 and 3"],
     "D", "Statements 2 and 3 incorrect (categories/rate–period mix).",
     "Do not mix Large Electronics and IT Hardware 2.0 numbers."),
    ("Chhattisgarh / JPSC NMP",
     "When was the National Manufacturing Policy (NMP) released by the Government of India?",
     ["A. 25 December 2012", "B. 25 December 2011", "C. 25 December 2013", "D. 4 November 2011", "E. 25 November 2011"],
     "D", "4 November 2011.",
     "25% GDP / 100 million jobs / 12–14% growth objectives."),
    ("I.A.S. (Pre) 2012",
     "Recent policy initiatives to promote manufacturing:\n1. NIMZs\n2. Single window clearance\n3. Technology Acquisition and Development Fund",
     ["A. 1 only", "B. 2 and 3 only", "C. 1 and 3 only", "D. 1, 2 and 3"],
     "D", "All three under NMP.",
     "NMP toolkit."),
    ("I.A.S. (Pre) 2016",
     "India’s first National Investment and Manufacturing Zone was proposed to be set up in:",
     ["A. Andhra Pradesh", "B. Gujarat", "C. Maharashtra", "D. Uttar Pradesh"],
     "A", "Andhra Pradesh (Prakasam teaching).",
     "NIMZ under NMP 2011."),
    ("64th B.P.S.C. (Pre) 2018",
     "Which one is not an initiative for industrial development?",
     ["A. Make in India", "B. Ease of Doing Business", "C. Start-up India", "D. Digital India", "E. None of the above/More than one of the above"],
     "D", "Digital India.",
     "Digital society mission ≠ industrial facilitation package."),
    ("U.P.P.C.S. (Pre) 2017",
     "Specific requirements of start-ups can be fulfilled through:",
     ["A. Angel Investors", "B. Venture capital", "C. Crowd funding", "D. All the above"],
     "D", "All the above.",
     "New-age financing alternatives."),
    ("I.A.S. (Pre) 2016",
     "With reference to Stand-Up India Scheme, which is/are correct?\n1. Promotes entrepreneurship among SC/ST and women.\n2. Provides for refinance through SIDBI.",
     ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither"],
     "C", "Both.",
     "Greenfield loans ₹10 lakh–₹1 crore teaching."),
    ("I.A.S. (Pre) 2016",
     "Pradhan Mantri Mudra Yojana is aimed at:",
     ["A. Bringing small entrepreneurs into formal financial system",
      "B. Providing loans to poor farmers for particular crops",
      "C. Providing pensions to old and destitute persons",
      "D. Funding voluntary organisations for skill development"],
     "A", "Formal credit for non-corporate micro enterprises.",
     "Shishu/Kishore/Tarun (+ Tarun Plus to ₹20 lakh)."),
    ("U.P. P.C.S. (Pre) 2025",
     "Pradhan Mantri Mudra Yojana comes under which of the following?\n1. Ministry of Corporate Affairs\n2. Ministry of Rural Development\n3. Ministry of Finance",
     ["A. 1 and 2", "B. Only 3", "C. 2 and 3", "D. Only 1"],
     "B", "Only Ministry of Finance (DFS).",
     "Not Corporate Affairs / Rural Development."),
    ("I.A.S. (Pre) 2017",
     "With reference to Quality Council of India (QCI):\n1. QCI was set up jointly by Government of India and Indian Industry.\n2. Chairman of QCI is appointed by the Prime Minister on industry recommendations.",
     ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither"],
     "C", "Both.",
     "Cabinet decision 1996 / society 1997 teaching."),
    ("U.P.P.C.S. (Mains) 2017",
     "Correct chronological sequence of enactments:\n1. MRTP Act\n2. Industries (Development and Regulation) Act\n3. FERA\n4. Minimum Wages Act",
     ["A. 2, 3, 4, 1", "B. 2, 3, 1, 4", "C. 4, 2, 1, 3", "D. 4, 2, 3, 1"],
     "C", "Min Wages 1948 → IDR 1951 → MRTP 1969 → FERA 1973.",
     "Code 4-2-1-3."),
    ("I.A.S. (Pre) 2022",
     "Which compiles information on industrial disputes, closures, retrenchments and lay-offs in factories?",
     ["A. Central Statistics Office", "B. DPIIT", "C. Labour Bureau", "D. National Technical Manpower Information System"],
     "C", "Labour Bureau.",
     "Monthly voluntary returns from State labour departments."),
    ("U.P.P.C.S. (Mains) 2016",
     "Which activity has not been included in the Industrial Production Index of India?",
     ["A. Manufacturing", "B. Mining", "C. Electricity", "D. Construction"],
     "D", "Construction.",
     "IIP = mining + manufacturing + electricity."),
    ("I.A.S. (Pre) 2012",
     "Among Eight Core Industries with combined IIP weight, which are included?\n1. Cement 2. Fertilizers 3. Natural gas 4. Refinery products 5. Textiles",
     ["A. 1 and 5", "B. 2, 3 and 4", "C. 1, 2, 3 and 4", "D. 1, 2, 3, 4 and 5"],
     "C", "1–4; textiles not a Core Industry.",
     "Eight Core list excludes textiles."),
    ("I.A.S. (Pre) 2015",
     "In the Index of Eight Core Industries, which one is given the highest weight among the options?",
     ["A. Coal production", "B. Electricity generation", "C. Fertilizer production", "D. Steel production"],
     "B", "Electricity (among these options).",
     "Overall heaviest Core weight is refinery products — not listed here."),
    ("I.A.S. (Pre) 2019",
     "Coal sector statements:\n1. Coal sector was nationalised under Indira Gandhi.\n2. Now coal blocks are allocated on lottery basis.\n3. India is now self-sufficient in coal production.",
     ["A. 1 only", "B. 2 and 3 only", "C. 3 only", "D. 1, 2 and 3"],
     "A", "Only 1.",
     "Allocation is auction-based; India still imports coal."),
    ("I.A.S. (Pre) 2023",
     "MSMED Act medium-enterprise definition Rs 15–25 crore; all bank loans to MSMEs qualify under priority sector — which is correct?",
     ["A. 1 only", "B. 2 only", "C. Both", "D. Neither"],
     "B", "Only PSL statement.",
     "Medium ceilings changed in 2020/2025 — 15–25 crore is wrong."),
    ("70th B.P.S.C. (Pre) 2024",
     "What is the full form of CGTMSE?",
     ["A. Credit Guarantee Fund Trust for Macro and Small Enterprises",
      "B. Credit Guarantee Fund Trust for Medium and Small Enterprises",
      "C. Credit Guarantee Fund Trust for Micro and Medium Enterprises",
      "D. Credit Guarantee Fund Trust for Micro and Small Enterprises"],
     "D", "Credit Guarantee Fund Trust for Micro and Small Enterprises.",
     "GoI + SIDBI credit guarantee."),
    ("I.A.S. (Pre) 2002",
     "Which committee recommended abolition of reservation of items for the small scale sector?",
     ["A. Abid Hussain Committee", "B. Narasimham Committee", "C. Nayak Committee", "D. Rakesh Mohan Committee"],
     "A", "Abid Hussain Committee.",
     "Expert Committee on Small Enterprises, mid-1990s."),
    ("I.A.S. (Pre) 2025",
     "How many of these are regulated by PNGRB: crude production; refining/storage/distribution; marketing/sale; natural gas production?",
     ["A. Only one", "B. Only two", "C. Only three", "D. All four"],
     "B", "Only refining/storage/distribution and marketing/sale.",
     "PNGRB does not regulate production."),
    ("Chhattisgarh / steel map",
     "Match steel plant with collaborating country: Rourkela–Germany; Bhilai–USSR; Durgapur–UK; Bokaro–USA — which pair is NOT correct?",
     ["A. Rourkela–Germany", "B. Bhilai–USSR", "C. Durgapur–UK", "D. Bokaro–USA"],
     "D", "Bokaro was with USSR, not USA.",
     "Bokaro–Soviet collaboration."),
    ("U.P. R.O./A.R.O. (Pre) 2021",
     "Which Iron and Steel Plant is not located on a riverside?",
     ["A. Bhilai", "B. Bokaro", "C. Jamshedpur", "D. Bhadravati"],
     "A", "Bhilai.",
     "Bhilai sits on rail/highway corridor west of Raipur — not a riverside plant key."),
]

T7_BANK = [
    ("U.P. P.C.S. (Pre) 2020",
     "Assertion (A): Government launched NIP for 2020–30.\nReason (R): NIP objective is equitable access to infrastructure for all.",
     ["A. Both true and R explains", "B. Both true R not explanation", "C. A true R false", "D. A false R true"],
     "D", "A false; R true.",
     "NIP horizon ≈ FY 2019–25.", True),
    ("U.P. P.C.S. (Pre) 2023",
     "PM Gati Shakti launched in 2022; seven engines include roads, railways, airports, ports, mass transport, waterways, logistics — which is correct?",
     ["A. Only 2", "B. Only 1", "C. Neither", "D. Both"],
     "A", "Only seven-engines statement.",
     "Launch year is 2021, not 2022."),
    ("U.P.P.C.S. (Pre) 2022",
     "Make in India launched 2014; aims to encourage manufacturing and facilitate investment — correct?",
     ["A. Both 1 and 2", "B. Only 1", "C. Neither", "D. Only 2"],
     "A", "Both.",
     "Already standard key."),
    ("U.P.P.C.S. (Pre) 2024",
     "Match States with infrastructure expenditure rank 2019–23: Maharashtra, UP, Tamil Nadu, Karnataka.",
     ["A. 1 2 3 4", "B. 2 1 3 4", "C. 4 1 2 3", "D. 2 3 4 1"],
     "B", "UP 1st, Maharashtra 2nd, TN 3rd, Karnataka 4th.",
     "UP topped that expenditure ranking."),
    ("U.P. P.C.S. (Pre) 2025",
     "Assertion (A): India is the second largest mobile gaming market.\nReason (R): More than 950 million internet users in India.",
     ["A. Both true R not explanation", "B. A false R true", "C. A true R false", "D. Both true and R explains"],
     "B", "A false; R true.", True),
    ("U.P. P.C.S. (Pre) 2025",
     "Pradhan Mantri Mudra Yojana comes under Ministry of Finance only — correct code?",
     ["A. 1 and 2", "B. Only 3 (Finance)", "C. 2 and 3", "D. Only 1"],
     "B", "Only Finance (DFS).",
     "Not Corporate Affairs / Rural Development."),
    ("U.P.P.C.S. (Mains) 2017",
     "Minimum Wages Act, Industries (D&R) Act, MRTP, FERA — correct chronological order?",
     ["A. 2,3,4,1", "B. 2,3,1,4", "C. 4,2,1,3", "D. 4,2,3,1"],
     "C", "1948 → 1951 → 1969 → 1973.",
     "Code 4-2-1-3."),
    ("U.P.P.C.S. (Mains) 2016",
     "Which is not included in IIP?",
     ["A. Manufacturing", "B. Mining", "C. Electricity", "D. Construction"],
     "D", "Construction.",
     "IIP trio only."),
    ("U.P.P.C.S. (Pre) 2017",
     "Start-up finance through angel / VC / crowdfunding?",
     ["A. Angel only", "B. VC only", "C. Crowdfunding only", "D. All the above"],
     "D", "All.",
     "New-age financing."),
    ("U.P. R.O./A.R.O. (Mains) 2021",
     "Stand-up India scheme is related to:",
     ["A. Minorities", "B. OBC", "C. Handicapped", "D. Women, SC and ST"],
     "D", "Women, SC and ST.",
     "Greenfield entrepreneurship."),
]

T11_EXTRA = [
    ("I.A.S. (Pre) 2024",
     "CSR rules in India:\n1. Expenditures benefiting the company directly or its employees will not be considered CSR.\n2. CSR rules do not specify minimum spending on CSR activities.",
     ["A. 1 only", "B. 2 only", "C. Both", "D. Neither"],
     "A", "Only 1.",
     "Minimum spend is 2% under Section 135 — statement 2 is false."),
    ("Chhattisgarh P.C.S. (Pre) 2015",
     "Which country made Corporate Social Responsibility Act first?",
     ["A. America", "B. Russia", "C. England", "D. India", "E. None of these"],
     "D", "India.",
     "First country with mandatory CSR under Companies Act 2013."),
    ("U.P.P.C.S. (Mains) 2017",
     "Which statement is incorrect about Uday Kotak Committee?",
     ["A. Instituted by SEBI", "B. Relates to Corporate Governance",
      "C. Recommends at least half the board be independent directors",
      "D. Recommends that the post of chairman and managing director must remain the same"],
     "D", "D is incorrect — Chair and MD should be separated.",
     "Kotak: separate Chair (non-executive) and MD."),
]

T12_EXTRA = [
    ("U.P.P.C.S. (Pre) 2021",
     "Which labour-related Acts were amalgamated into the Code on Wages, 2019?\nI. Minimum Wages Act\nII. Payment of Bonus Act\nIII. The Contract Labour Act\nIV. Equal Remuneration Act",
     ["A. I and II only", "B. II and III only", "C. I, II and IV only", "D. I, II, III and IV"],
     "C", "I, II and IV — not Contract Labour Act.",
     "Also Payment of Wages Act 1936 is subsumed."),
]


def main():
    print("T7", inject_extra(T7, T7_EXTRA), inject_uppcs(T7, T7_BANK))
    print("T11", inject_extra(T11, T11_EXTRA), 0)
    print("T12", inject_extra(T12, T12_EXTRA), 0)


if __name__ == "__main__":
    main()
