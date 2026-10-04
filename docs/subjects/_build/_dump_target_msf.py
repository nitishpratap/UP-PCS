#!/usr/bin/env python3
import re
from pathlib import Path

files = [
    "10_Tribes_Institutions.md",
    "11_Population_Geography.md",
    "12_Human_Geography.md",
    "13_Disaster_Geography.md",
    "15_Geomorphology_and_Landform_Processes.md",
    "16_Oceans.md",
    "17_World_Rivers_and_Lakes.md",
    "18_World_Landforms.md",
    "19_World_Regional_Geography.md",
    "25_Census_and_Demographics.md",
    "26_Agriculture_Minerals_Ranks.md",
]
root = Path("docs/subjects/geography")
out = Path("_tmp_geo_facts")
out.mkdir(exist_ok=True)
for f in files:
    t = (root / f).read_text(encoding="utf-8")
    m = re.search(
        r"Consolidated\s*—\s*(\d+)\s*Must-Score Facts.*?</summary>(.*?)</details>",
        t,
        re.S | re.I,
    )
    facts = re.findall(r"^(\d+\.\s+.+)$", m.group(2), re.M) if m else []
    ca = ""
    cm = re.search(r"##\s*Current Affairs.*?(?=\n## |\n<details|\Z)", t, re.S | re.I)
    if cm:
        ca = cm.group(0)[:3000]
    conf = ""
    c2 = re.search(r"st-toggle-confused.*?</summary>(.*?)</details>", t, re.S | re.I)
    if c2:
        conf = c2.group(1)[:5000]
    cov = ""
    c3 = re.search(r"Covers syllabus.*?</details>", t, re.S | re.I)
    if c3:
        cov = c3.group(0)[:1500]
    # Must-score drill sections if any
    must = ""
    c4 = re.search(
        r"st-toggle-must-score.*?</summary>(.*?)</details>", t, re.S | re.I
    )
    if c4:
        must = c4.group(1)[:4000]
    claimed = m.group(1) if m else "?"
    text = (
        f"CLAIMED={claimed} ACTUAL={len(facts)}\nCOVERS:\n{cov}\n\nFACTS:\n"
        + "\n".join(facts)
        + f"\n\nCA:\n{ca}\n\nCONFUSED:\n{conf}\n\nMUSTSCORE:\n{must}\n"
    )
    (out / f).write_text(text, encoding="utf-8")
    print(f, len(facts), "claimed", claimed)
