#!/usr/bin/env python3
"""List Practice Zone questions whose stem is missing (first line is an option)."""
from pathlib import Path
import re

root = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy")
out = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\_build\_missing_stems.txt")
lines = []
for p in sorted(root.glob("*.md")):
    if not re.match(r"^\d{2}_", p.name) or "Syllabus" in p.name:
        continue
    t = p.read_text(encoding="utf-8")
    if "## Practice Zone" not in t:
        continue
    block = t.split("## Practice Zone")[1]
    if "## Common Traps" in block:
        block = block.split("## Common Traps")[0]
    for m in re.finditer(
        r"(?ms)^\*\*(Q\d+)\.\*\*\s*\n+(.*?)(?=^\*\*Q\d+\.|\Z)", block
    ):
        qid = m.group(1)
        body = m.group(2).strip()
        first = next(
            (ln.strip() for ln in body.splitlines() if ln.strip() and not ln.strip().startswith("<")),
            "",
        )
        if re.match(r"^[A-D][\.)]", first):
            if re.search(r"(?i)match|with reference|which|given below|arrange|assertion", body[:250]):
                continue
            am = re.search(r"(?m)^\*\*Ans:\s*([A-E])\.\*\*\s*(.+)$", body)
            lm = re.search(r"(?m)^\*\*(?:Logic|A/R logic):\*\*\s*(.+)$", body)
            lines.append(f"==== {p.name} {qid}")
            lines.append(body[:900])
            lines.append(
                f"ANS={(am.group(1)+' '+am.group(2)) if am else '?'} | LOGIC={(lm.group(1)[:120] if lm else '?')}"
            )
            lines.append("")
out.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {len(lines)} lines to {out}")
