# -*- coding: utf-8 -*-
"""Add exam tags to every Extra Drill / Bank question missing one."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASTE = ROOT / "_fiscal_paste_raw.txt"
MD = ROOT / "02_Public_Finance_Budget_Taxation.md"

EXAM_RE = re.compile(
    r"("
    r"I\.A\.S\.\s*\([^)]+\)\s*\d{4}"
    r"|U\.P\.P\.C\.S\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*R\.O\./A\.R\.O\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.R\.O\./A\.R\.O\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*Lower\s*Sub\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*U\.D\.A\./L\.D\.A\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.B\.E\.O\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.P\.S\.C\.\s*\(GIC\)\s*\d{4}"
    r"|\d+(?:st|nd|rd|th)\s*(?:to\s*\d+(?:st|nd|rd|th)\s+)?B\.P\.S\.C\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Chhattisgarh\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|R\.A\.S\./?\s*R\.T\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Uttarakhand\s*(?:P\.C\.S\.|U\.D\.A\./L\.D\.A\.)\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Jharkhand\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|M\.P\.P?\.?C\.S\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r")",
    re.I,
)

CURATED = {
    "with reference to union budget consider the following": "I.A.S. (Pre) 2024",
    "macro economic framework statement": "I.A.S. (Pre) 2020",
    "when was gender budgeting initiated": "66th B.P.S.C. (Pre) (Re-Exam) 2020",
    "not included in the budget priorities in pursuit of viksit": "70th B.P.S.C. (Pre) 2024",
    "seven priorities of the government these 7 priorities are named": "Chhattisgarh P.C.S. (Pre) 2024",
    "not included in the priorities of india budget 2022": "67th B.P.S.C. (Pre) (Re-Exam) 2022",
    "not included in the intended objectives of the union budget 2017": "64th B.P.S.C. (Pre) 2018",
    "agriculture infrastructure and development cess": "Budget stem (AIDC 2021–22)",
    "tax revenue as a percent of gdp of india has steadily": "I.A.S. (Pre) 2017",
    "cereal grains hulled": "I.A.S. (Pre) 2018",
    "goods and services tax was proposed by a task force": "M.P.P.C.S. (Pre) 2017",
    "most likely advantages of implementing": "I.A.S. (Pre) 2017",
    "tax is not included in goods and services tax": "Chhattisgarh P.C.S. (Pre) 2019",
    "kept under the purview of goods and services tax": "R.A.S./R.T.S. (Pre) 2018",
    "revenue neutral rate": "U.P. R.O./A.R.O. (Mains) 2016",
    "input tax credit mechanism": "R.A.S./R.T.S. (Pre) 2024",
    "formulates the fiscal policy": "U.P.P.C.S. (Mains) 2012",
    "not a department in the ministry of finance": "Jharkhand P.C.S. (Pre) 2013",
    "not an objective of fiscal policy": "U.P.P.C.S. (Pre) 2006",
    "not a tool of fiscal policy": "R.A.S./R.T.S. (Pre) 2023",
    "introduced fiscal policy as a tool to rectify the great depression": "Uttarakhand P.C.S. (Pre) 2012",
    "appropriately describes the fiscal stimulus": "I.A.S. (Pre) 2011",
    "most likely to be taken at the time of an economic recession": "I.A.S. (Pre) 2021",
    "preparation and presentation of union budget": "I.A.S. (Pre) 2010",
    "economic survey of india is published officially": "I.A.S. (Pre) 1998",
    "zero based budgeting first adopted": "U.P.P.C.S. (Mains) 2017",
    "amount of demand be reduced to rs 1": "Jharkhand P.C.S. (Pre) 2013",
    "vote on account is meant for": "60th to 62nd B.P.S.C. (Pre) 2016",
    "ad hoc treasury bill system": "56th to 59th B.P.S.C. (Pre) 2015",
    "inflationary methods is likely to be the most": "I.A.S. (Pre) 2021",
    "after deducting grants for the creation of capital assets": "U.P.P.C.S. (Mains) 2015",
    "fiscal responsibility and budget management act was enacted": "U.P.P.C.S. (Mains) 2008",
    "article 112 relates to the": "Extra Drill (Art. 112 / Budget)",
    "which tax was not abolished": "Extra Drill (GST subsumption)",
    "fiscal deficit is a better measure of borrowing need": "Extra Drill (A/R — fiscal deficit)",
    "with reference to charged expenditure": "Extra Drill (charged expenditure)",
    "public account of india mainly holds": "Extra Drill (Public Account)",
    "with reference to grants in aid": "Extra Drill (grants-in-aid)",
    "the 14th finance commission sharply raised": "Extra Drill (A/R — 14th FC)",
    "with reference to subsidies": "Extra Drill (subsidies)",
    "which body audits government accounts": "Extra Drill (CAG)",
    "with reference to vote on account": "Extra Drill (Vote on Account)",
    "effective revenue deficit adjusts": "Extra Drill (A/R — ERD)",
    "which of the following statements about gst is are correct": "Extra Drill (GST features)",
    "with reference to fiscal deficit which of the following": "Practice Zone (fiscal deficit)",
    "primary deficit equals": "Practice Zone (primary deficit)",
    "revenue deficit equals": "Practice Zone (revenue deficit)",
}


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def fp(s: str, n: int = 12) -> str:
    words = [w for w in norm(s).split() if len(w) > 2][:n]
    return " ".join(words)


def build_paste_map(text: str) -> list[tuple[str, str]]:
    text = re.sub(r"</?user_query>", "", text)
    if "Fiscal Policy" in text:
        text = text[text.index("Fiscal Policy") :]
    chunks = re.split(r"\n(?=\d{1,3}\.\s)", text)
    out = []
    for ch in chunks:
        am = re.search(r"Ans\.?\s*\([a-d\*]\)", ch, re.I)
        if not am:
            continue
        body = ch[: am.start()]
        exam_m = EXAM_RE.search(ch[am.end() : am.end() + 400]) or EXAM_RE.search(ch)
        if not exam_m:
            continue
        exam = re.sub(r"\s+", " ", exam_m.group(1)).strip()
        stem = re.sub(r"^\d{1,3}\.\s*", "", body)
        stem = re.split(r"\([a-d]\)", stem, maxsplit=1, flags=re.I)[0]
        stem = re.sub(r"\s+", " ", stem).strip()
        if len(stem) < 20:
            continue
        out.append((fp(stem), exam))
        out.append((fp(stem, 8), exam))
    return out


def lookup(stem: str, paste_map: list[tuple[str, str]]) -> str | None:
    key = fp(stem)
    key8 = fp(stem, 8)
    n = norm(stem)
    for frag, tag in CURATED.items():
        if frag in n and tag:
            return tag
    for k, exam in paste_map:
        if k and (k == key or k == key8 or (len(k.split()) >= 6 and (k in key or key in k))):
            return exam
    return None


def good_tag(tag: str) -> bool:
    t = (tag or "").strip()
    if not t:
        return False
    if "Mixed" in t:
        return False
    if t.startswith("Extra Drill") or t.startswith("Practice Zone") or t.startswith("Budget stem"):
        return True
    return bool(
        re.search(
            r"\d{4}|I\.A\.S|UPPCS|U\.P\.|B\.P\.S\.C|R\.A\.S|Chhattisgarh|Jharkhand|Uttarakhand|M\.P\.|UKPCS",
            t,
            re.I,
        )
    )


def stem_from_body(body: str) -> str:
    # body starts after head; take until options / details
    chunk = re.split(r"\n(?=[A-D]\.\s|<details>)", body, maxsplit=1)[0]
    return re.sub(r"\s+", " ", chunk).strip()[:400]


def tag_blocks(text: str, paste_map: list[tuple[str, str]], default: str) -> tuple[str, int]:
    """Split on **Qn. ...** heads and rewrite tags."""
    # Match both **Qn.** and **Qn. TAG**
    parts = re.split(r"(?=\*\*Q\d+\.)", text)
    out = []
    updated = 0
    head_re = re.compile(r"^\*\*Q(\d+)\.(.*?)\*\*", re.S)

    for part in parts:
        if not part.startswith("**Q"):
            out.append(part)
            continue
        m = head_re.match(part)
        if not m:
            out.append(part)
            continue
        qn = m.group(1)
        raw_tag = m.group(2).strip()
        # If tag contains em-dash stem on same line: **Qn. EXAM — stem**
        if "—" in raw_tag:
            exam_part, _, stem_part = raw_tag.partition("—")
            exam_part = exam_part.strip()
            body = part[m.end() :]
            if good_tag(exam_part):
                out.append(part)
                continue
            found = lookup(stem_part, paste_map) or lookup(stem_from_body(body), paste_map) or default
            updated += 1
            out.append(f"**Q{qn}. {found}** — {stem_part.strip()}**" + body)
            continue

        body = part[m.end() :]
        if good_tag(raw_tag):
            out.append(part)
            continue

        stem = stem_from_body(body)
        found = lookup(stem, paste_map) or lookup(raw_tag, paste_map) or default
        updated += 1
        out.append(f"**Q{qn}. {found}**" + body)

    return "".join(out), updated


def main():
    paste = PASTE.read_text(encoding="utf-8") if PASTE.exists() else ""
    paste_map = build_paste_map(paste) if paste else []
    print(f"paste map entries: {len(paste_map)}")

    md = MD.read_text(encoding="utf-8")

    pre, rest = md.split("## Complete PYQ Bank (UPPCS)", 1)
    bank, rest2 = rest.split("## Ghatnachakra Extra Drill — Public Finance, Budget and Taxation", 1)
    extra_all, uk_rest = rest2.split("## UKPCS Prelims Bank", 1)

    # Practice Zone is after UKPCS — tag Extra + UKPCS + Practice
    if "## Practice Zone" in uk_rest:
        uk_bank, practice = uk_rest.split("## Practice Zone", 1)
    else:
        uk_bank, practice = uk_rest, ""

    bank2, bu = tag_blocks(bank, paste_map, "U.P.P.C.S.")
    extra2, eu = tag_blocks(extra_all, paste_map, "Extra Drill (topic practice)")
    uk2, uu = tag_blocks(uk_bank, paste_map, "UKPCS")
    prac2, pu = tag_blocks(practice, paste_map, "Practice Zone") if practice else ("", 0)

    md2 = (
        pre
        + "## Complete PYQ Bank (UPPCS)"
        + bank2
        + "## Ghatnachakra Extra Drill — Public Finance, Budget and Taxation"
        + extra2
        + "## UKPCS Prelims Bank"
        + uk2
        + ("## Practice Zone" + prac2 if practice else "")
    )
    MD.write_text(md2, encoding="utf-8")
    print(f"updated bank={bu} extra={eu} ukpcs={uu} practice={pu}")

    extra_check = md2.split("## Ghatnachakra Extra Drill")[1].split("## UKPCS")[0]
    heads = re.findall(r"^\*\*Q(\d+)\.(.*?)\*\*", extra_check, re.M)
    empty = [n for n, t in heads if not t.strip()]
    print(f"extra heads={len(heads)} empty={len(empty)}")
    for n, t in heads[:5]:
        print(f"  Q{n}: {t.strip()[:70]}")
    for n, t in heads:
        if n in {"15", "29", "45", "60"}:
            print(f"  Q{n}: {t.strip()[:70]}")


if __name__ == "__main__":
    main()
