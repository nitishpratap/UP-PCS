#!/usr/bin/env python3
"""Diagnose mangled Logic/Ans and remaining Correct Answer across target subjects."""
from pathlib import Path
import re
from collections import Counter

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects")
FOLDERS = [
    "science and technology",
    "economy",
    "census and urbanisation",
    "up special",
]

details_re = re.compile(
    r"(?is)<details>\s*<summary>\s*Show answer\s*</summary>\s*(.*?)</details>"
)

for folder in FOLDERS:
    short_logic = 0
    short_ans = 0
    correct = 0
    good = 0
    samples_bad = []
    for p in (ROOT / folder).rglob("*.md"):
        if p.name.lower() in {"index.md"} or "syllabus" in p.name.lower():
            continue
        t = p.read_text(encoding="utf-8")
        for m in details_re.finditer(t):
            b = m.group(1)
            if re.search(r"Correct Answer|Detailed Explanation", b, re.I):
                correct += 1
                continue
            lm = re.search(r"(?m)^\*\*Logic:\*\*\s*(.+)$", b)
            am = re.search(r"(?m)^\*\*Ans:\s*[A-E]\.\*\*\s*(.*)$", b)
            if am:
                ans = (am.group(1) or "").strip()
                logic = (lm.group(1) if lm else "").strip()
                # mangled: very short truncated
                if len(ans) < 12 or ans.endswith(" Art.") or ans.endswith(" is") or ans.endswith("("):
                    short_ans += 1
                    if len(samples_bad) < 3:
                        samples_bad.append(("ANS", p.name, b[:250]))
                elif lm and len(logic) < 8:
                    short_logic += 1
                    if len(samples_bad) < 5:
                        samples_bad.append(("LOGIC", p.name, b[:250]))
                else:
                    good += 1
            else:
                # maybe A/R or other
                good += 1
    print(f"\n{folder}:")
    print(f"  remaining Correct Answer blocks: {correct}")
    print(f"  good-ish Logic/Ans: {good}")
    print(f"  short/mangled Ans: {short_ans}")
    print(f"  short Logic: {short_logic}")
    for s in samples_bad:
        print("  SAMPLE", s[0], s[1])
        print(s[2][:200].encode("ascii", "replace").decode())
        print("---")
