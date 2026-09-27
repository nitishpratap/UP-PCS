#!/usr/bin/env python3
import re
from pathlib import Path

for folder in ["science and technology", "census and urbanisation", "up special"]:
    print(f"=== {folder} ===")
    for p in sorted((Path("docs/subjects") / folder).glob("*.md")):
        if p.name.lower() in {"index.md"} or "syllabus" in p.name.lower():
            continue
        t = p.read_text(encoding="utf-8")
        if "## Practice Zone" not in t:
            print(f"  {p.name}: NO Practice Zone")
            continue
        block = t.split("## Practice Zone")[1]
        if "## Common Traps" in block:
            block = block.split("## Common Traps")[0]
        details = len(
            re.findall(
                r"(?is)<details>\s*<summary>\s*Show answer\s*</summary>", block
            )
        )
        flag = "OK" if details >= 25 else f"THIN ({details})"
        print(f"  {p.name}: Practice answers={details} [{flag}]")
