# -*- coding: utf-8 -*-
import re
from pathlib import Path

root = Path(r"c:/Users/Axeno/Desktop/UP-PCS/pyq")
patterns = [
    r"Uttar Pradesh", r"U\.P\.", r"Dudhwa", r"ODOP", r"Legislative Council",
    r"Purvanchal", r"Bundelkhand", r"Ghaziabad", r"Shrawasti", r"Shravasti",
    r"Kanpur and Lucknow", r"Smart City", r"Ramsar", r"Kushinagar", r"Moonj",
    r"One District", r"Amethi", r"Sultanpur", r"Lakhimpur", r"Biotechnology Park",
    r"HRIDAY", r"Chambal", r"Gomati", r"Gomti", r"Betwa", r"Ramganga",
    r"sex.?ratio", r"literacy", r"Express.?[Ww]ay", r"Ganga Express",
    r"million cit", r"Assembly", r"Rajya Sabha", r"Lok Sabha",
]
compiled = [re.compile(p, re.I) for p in patterns]
out = Path(r"c:/Users/Axeno/Desktop/UP-PCS/docs/subjects/_up_full_qs.txt")
buf = []
for md in sorted(root.rglob("*.md")):
    text = md.read_text(encoding="utf-8", errors="ignore")
    ym = re.search(r"20\d{2}", md.name)
    if not ym:
        continue
    year = ym.group(0)
    # split on question headers common in these papers
    parts = re.split(
        r"(?m)(?=^(?:#{1,3}\s*)?(?:\*\*)?Q(?:uestion)?[\.\s]*\d+|(?:^|\n)\d{1,3}\.\s+[A-Z\"'])",
        text,
    )
    for part in parts:
        if not any(c.search(part) for c in compiled):
            continue
        if len(part) < 80:
            continue
        part = part.strip()[:2000]
        qid_m = re.search(r"(?:Q(?:uestion)?[\.\s]*|^)(\d{1,3})", part)
        qn = qid_m.group(1) if qid_m else "?"
        buf.append(f"\n===== {year} Q{qn} | {md.name} =====\n{part}\n")
out.write_text("".join(buf), encoding="utf-8")
print("blocks", len(buf), "chars", out.stat().st_size)

# also grep key terms with context from all papers into a focused file
keys = ["Dudhwa", "ODOP", "Moonj", "Legislative Council", "Lakhimpur", "Amethi", "Sultanpur", "Purvanchal", "Bundelkhand Express", "Ganga Express", "sex ratio", "literacy rate", "Ghaziabad", "Shrawasti", "Shravasti", "Lalitpur", "Jaunpur", "million"]
focus = Path(r"c:/Users/Axeno/Desktop/UP-PCS/docs/subjects/_up_key_hits.txt")
lines = []
for md in sorted(root.rglob("*.md")):
    text = md.read_text(encoding="utf-8", errors="ignore")
    ym = re.search(r"20\d{2}", md.name)
    year = ym.group(0) if ym else "?"
    for k in keys:
        for m in re.finditer(re.escape(k), text, re.I):
            start = max(0, m.start() - 500)
            end = min(len(text), m.end() + 700)
            snip = text[start:end]
            lines.append(f"\n===== {year} | {k} | {md.name} =====\n{snip}\n")
focus.write_text("\n".join(lines), encoding="utf-8")
print("focus hits", len(lines))
