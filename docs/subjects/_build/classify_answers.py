#!/usr/bin/env python3
from pathlib import Path
import re
from collections import Counter

root = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology")
pat = re.compile(r"(?is)<details>\s*<summary>\s*Show answer\s*</summary>\s*(.*?)</details>")
kinds = Counter()
samples = {k: [] for k in ["see_above", "bullets", "short", "already_good", "other"]}
for p in root.rglob("*.md"):
    t = p.read_text(encoding="utf-8")
    for m in pat.finditer(t):
        b = m.group(1).strip()
        if re.search(r"\*\*Ans:", b):
            kinds["already_good"] += 1
            continue
        if re.search(r"Correct Answer", b, re.I):
            if re.search(r"See the explanation of above|see above", b, re.I):
                kinds["see_above"] += 1
                if len(samples["see_above"]) < 2:
                    samples["see_above"].append(b[:350])
            elif re.search(r"Must-Score Points|Detailed Explanation|Explanation", b, re.I):
                kinds["bullets"] += 1
                if len(samples["bullets"]) < 2:
                    samples["bullets"].append(b[:450])
            else:
                kinds["short"] += 1
                if len(samples["short"]) < 2:
                    samples["short"].append(b[:350])
        else:
            kinds["other"] += 1
            if len(samples["other"]) < 2:
                samples["other"].append(b[:300])
print(kinds)
for k, v in samples.items():
    if v:
        print("\n==", k, "==")
        for s in v:
            print(s)
            print("---")
