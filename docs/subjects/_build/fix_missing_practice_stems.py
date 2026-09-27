#!/usr/bin/env python3
"""Insert missing Practice Zone stems for Economy Topics 07–12."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy")

STEMS: dict[str, dict[str, str]] = {
    "07_Industry_MSME_Infrastructure.md": {
        "Q8": "Production Linked Incentive (PLI) schemes are mainly designed to",
        "Q11": "Startup India is mainly aimed at supporting",
        "Q16": "Food processing industry primarily converts",
        "Q20": "Railway electrification is best tagged as",
        "Q28": "MSME credit support in teaching often flows through",
    },
    "08_Employment_Poverty_Human_Capital.md": {
        "Q3": "MGNREGA is best described as a programme for",
        "Q10": "The Head Count Ratio (HCR) of poverty measures the",
        "Q15": "Income / wealth inequality measures mainly show",
        "Q23": "A key portability concern for migrant workers is that",
    },
    "09_External_Sector_Foreign_Trade.md": {
        "Q1": "Balance of Trade (merchandise) is best defined as",
        "Q6": "Depreciation of the domestic currency typically makes",
        "Q19": "An increase in foreign-exchange reserves normally",
        "Q21": "Economic globalisation in teaching mainly refers to",
        "Q23": "India’s merchandise trade with China in recent years has typically shown",
        "Q24": "A Free Trade Agreement / CEPA is mainly meant to",
        "Q26": "Invisibles in the current account notably include",
        "Q28": "Foreign Direct Investment (FDI) inflows are recorded mainly on",
    },
    "10_International_Institutions_Groupings.md": {
        "Q7": "The first BRIC / BRICS Summit was held in",
        "Q9": "G7 membership count in the classic teaching list is",
        "Q14": "ASEAN Secretariat headquarters is in",
        "Q15": "The SAARC Summit hosted by India was held in",
        "Q21": "New Development Bank (NDB) headquarters is in",
        "Q27": "Which country joined BRICS last among the original BRIC+SA set in teaching lists?",
    },
    "11_Services_Cooperatives_Regulators.md": {
        "Q1": "The tertiary sector mainly includes",
        "Q2": "India’s GDP composition in recent decades is characterised by",
        "Q7": "IFSCA mainly regulates",
        "Q9": "TRAI’s mandate centres on",
        "Q11": "Article 43B in the Directive Principles relates to",
        "Q13": "The Competition Commission of India draws power mainly from",
        "Q15": "IT / BPM services exports help India chiefly to",
        "Q20": "Corporate Social Responsibility (CSR) spending is directed toward",
        "Q23": "A key distinction of a public company versus a private company is the",
        "Q24": "Tourism as a services activity mainly sells",
        "Q27": "Employment and GDP shares differ across sectors mainly because",
        "Q28": "Corporate governance norms are mainly meant to",
    },
    "12_Economic_Laws_Reports_Rankings_Misc.md": {
        "Q3": "RERA is primarily concerned with",
        "Q7": "In the Ease of Doing Business ranking teaching for India, a keyed milestone position was",
        "Q8": "India’s HDI rank in the 2021/22 HDR teaching edition was around",
        "Q15": "The four Labour Codes are mainly intended to",
        "Q19": "The Human Development Index (HDI) was first published around",
        "Q24": "Which statement correctly distinguishes FEMA and PMLA?",
        "Q26": "NITI Aayog’s SDG India Index mainly ranks",
    },
}


def fix_file(path: Path) -> int:
    stems = STEMS.get(path.name)
    if not stems:
        return 0
    text = path.read_text(encoding="utf-8")
    if "## Practice Zone" not in text:
        return 0
    pre, rest = text.split("## Practice Zone", 1)
    if "## Common Traps" in rest:
        prac, post = rest.split("## Common Traps", 1)
        post = "## Common Traps" + post
    else:
        prac, post = rest, ""

    n = 0

    def repl(m: re.Match) -> str:
        nonlocal n
        qid = m.group(1)
        body = m.group(2)
        stem = stems.get(qid)
        if not stem:
            return m.group(0)
        first = next(
            (ln.strip() for ln in body.splitlines() if ln.strip() and not ln.strip().startswith("<")),
            "",
        )
        if not re.match(r"^[A-D][\.)]", first):
            return m.group(0)  # already has stem
        n += 1
        return f"**{qid}.**\n\n{stem}\n\n{body.lstrip()}"

    new_prac = re.sub(
        r"(?ms)^\*\*(Q\d+)\.\*\*\s*\n+(.*?)(?=^\*\*Q\d+\.|\Z)",
        repl,
        prac,
    )
    if n:
        path.write_text(
            (pre + "## Practice Zone" + new_prac + post).replace("\r\n", "\n"),
            encoding="utf-8",
            newline="\n",
        )
    return n


def main() -> None:
    total = 0
    for name in STEMS:
        path = ROOT / name
        n = fix_file(path)
        print(f"{name}: inserted {n} stems")
        total += n
    print("total", total)
    # verify
    import subprocess

    subprocess.check_call(["python", str(ROOT.parent / "_build" / "list_missing_stems.py")])
    left = Path(ROOT.parent / "_build" / "_missing_stems.txt").read_text(encoding="utf-8")
    left_n = left.count("====")
    print("remaining missing stems", left_n)


if __name__ == "__main__":
    main()
