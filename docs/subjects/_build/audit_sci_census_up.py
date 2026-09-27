#!/usr/bin/env python3
import re
from pathlib import Path

DETAILS = re.compile(
    r"(?is)<details>\s*<summary>\s*Show answer\s*</summary>\s*(.*?)</details>"
)
WEAK = re.compile(
    r"(?im)^\*\*(?:Logic|A/R logic):\*\*\s*(The correct choice is|The keyed answer is|Statement \d+ is false\.?$|Keyed option is)"
)


def audit(folder: str) -> None:
    root = Path("docs/subjects") / folder
    files = tags = unbal = ans = weak = ca = 0
    prac_low = []
    order_bad = []
    for p in sorted(root.rglob("*.md")):
        if p.name.lower() in {"index.md"} or "syllabus" in p.name.lower():
            continue
        if ".bak" in p.name:
            continue
        t = p.read_text(encoding="utf-8")
        files += 1
        h2 = [m.group(0) for m in re.finditer(r"(?m)^## .+", t)]

        def idx(sub: str) -> int:
            for i, h in enumerate(h2):
                if sub.lower() in h.lower():
                    return i
            return -1

        prac_i, traps_i, pyq_i = idx("Practice Zone"), idx("Common Traps"), idx("Complete PYQ")
        issues = []
        if prac_i >= 0 and pyq_i >= 0 and prac_i < pyq_i:
            issues.append("Practice before PYQ")
        if traps_i >= 0 and prac_i >= 0 and traps_i < prac_i:
            issues.append("Traps before Practice")
        if idx("Current Affairs") > 2:
            issues.append("CA late")
        if traps_i >= 0:
            after = " ".join(h2[traps_i + 1 :])
            if re.search(r"(?i)extended theory|bilingual|one-liner", after):
                issues.append("theory after traps")
        if issues:
            order_bad.append((p.name, issues))

        if "## Practice Zone" in t:
            block = t.split("## Practice Zone")[1]
            if "## Common Traps" in block:
                block = block.split("## Common Traps")[0]
            prac_n = len(re.findall(r"(?m)^(?:\*\*Q\d+|\d+)\.", block))
            if prac_n < 25:
                prac_low.append((p.name, prac_n))

        for line in t.splitlines():
            if re.match(r"^\*\*Q", line):
                tags += 1
                if line.count("(") != line.count(")"):
                    unbal += 1
        for m in DETAILS.finditer(t):
            b = m.group(1)
            if re.search(r"(?m)^\*\*Ans:", b):
                ans += 1
            if WEAK.search(b):
                weak += 1
            if re.search(
                r"(?i)\*\*Correct Answer|\- \*\*Correct Answer|<b>Correct Answer", b
            ):
                ca += 1

    print(f"=== {folder} ===")
    print(
        f"  chapters~{files} Q-tags={tags} unbal={unbal} Ans={ans} weakLogic={weak} CorrectAnswerDumps={ca}"
    )
    print(f"  practice<25: {prac_low if prac_low else 'none'}")
    print(f"  order issues: {order_bad if order_bad else 'none'}")


for folder in ["science and technology", "census and urbanisation", "up special"]:
    audit(folder)
