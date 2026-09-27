#!/usr/bin/env python3
from pathlib import Path
import re

root = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy")
for p in sorted(root.glob("*.md")):
    if not re.match(r"^\d{2}_", p.name) or "Syllabus" in p.name:
        continue
    t = p.read_text(encoding="utf-8")
    h2 = [m.group(0) for m in re.finditer(r"(?m)^## .+", t)]

    def idx(sub: str) -> int:
        for i, h in enumerate(h2):
            if sub.lower() in h.lower():
                return i
        return -1

    order_issues = []
    prac, traps, pyq = idx("Practice Zone"), idx("Common Traps"), idx("Complete PYQ")
    if prac >= 0 and pyq >= 0 and prac < pyq:
        order_issues.append("Practice before PYQ")
    if traps >= 0 and prac >= 0 and traps < prac:
        order_issues.append("Traps before Practice")
    if idx("Current Affairs") > 2:
        order_issues.append("CA late")

    prac_n = 0
    if "## Practice Zone" in t:
        block = t.split("## Practice Zone")[1]
        if "## Common Traps" in block:
            block = block.split("## Common Traps")[0]
        prac_n = len(re.findall(r"(?m)^\*\*Q", block))

    body = re.sub(r"(?is)<details>.*?</details>", "", t)
    body = re.sub(r"(?m)^\*\*Q[^\n]*", "", body)
    exam = len(re.findall(r"(?i)\bexam\b", body))
    lock = len(re.findall(r"(?i)\blocks?\b", body))
    consol = re.search(r"Consolidated[^\n]*?(\d+)", t)
    cf = int(consol.group(1)) if consol else 0
    ord_s = ",".join(order_issues) if order_issues else "OK"
    print(
        f"{p.name[:42]:42} prac={prac_n:2} consol~{cf:2} examBody={exam} lockBody={lock} order={ord_s}"
    )
