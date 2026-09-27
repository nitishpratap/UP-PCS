#!/usr/bin/env python3
"""Move teaching / drill / one-liner blocks that sit after Common Traps
back to Lucent order: teaching → PYQ → Extra Drill → Practice → Common Traps.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOTS = [
    Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\census and urbanisation"),
    Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology"),
    Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy"),
    Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\up special"),
]

H2 = re.compile(r"(?m)^(?=## )")


def split_sections(text: str) -> tuple[str, list[str]]:
    bits = H2.split(text)
    preamble = bits[0]
    return preamble, [b for b in bits[1:] if b.strip()]


def title(section: str) -> str:
    return section.split("\n", 1)[0].strip()


def is_practice(section: str) -> bool:
    return bool(re.match(r"(?im)^##\s+Practice Zone\b", title(section)))


def is_traps(section: str) -> bool:
    return bool(re.match(r"(?im)^##\s+Common Traps\b", title(section)))


def is_pyqish(section: str) -> bool:
    return bool(
        re.match(
            r"(?im)^##\s+(Complete PYQ|Ghatnachakra|UKPCS Prelims|UKPCS Complete)\b",
            title(section),
        )
    )


def classify(section: str) -> str | None:
    t = title(section)
    if re.match(r"(?im)^##\s+Bilingual Terminology\b", t):
        return "teach"
    if re.match(r"(?im)^##\s+Extended Theory\b", t):
        return "teach"
    if re.match(r"(?im)^##\s+One-Liner Revision\b", t):
        return "pre_practice"
    if re.match(r"(?im)^##\s+Ghatnachakra\b", t):
        return "pre_practice"
    if re.search(r"(?i)extra drill", t) and not is_practice(section):
        return "pre_practice"
    if re.search(r"(?i)one-liner|bilingual terminology|extended theory", t):
        return "teach" if "one-liner" not in t.lower() else "pre_practice"
    return None


def fix_text(text: str) -> tuple[str, bool]:
    preamble, sections = split_sections(text)
    if not any(is_practice(s) for s in sections):
        return text, False

    prac_i = next(i for i, s in enumerate(sections) if is_practice(s))
    traps_i = next((i for i, s in enumerate(sections) if is_traps(s)), None)

    # Tail starts after Common Traps if present and after Practice; else after Practice
    if traps_i is not None and traps_i > prac_i:
        tail_start = traps_i + 1
    else:
        tail_start = prac_i + 1

    if tail_start >= len(sections):
        return text, False

    teach: list[str] = []
    pre_practice: list[str] = []
    leftover: list[str] = []
    moved = False

    for s in sections[tail_start:]:
        kind = classify(s)
        if kind == "teach":
            teach.append(s)
            moved = True
        elif kind == "pre_practice":
            pre_practice.append(s)
            moved = True
        else:
            leftover.append(s)

    if not moved:
        return text, False

    # Core before Practice, Practice, Traps (if any)
    before = sections[:prac_i]
    practice = sections[prac_i]
    traps = sections[traps_i] if traps_i is not None and traps_i > prac_i else None

    # Insert teach blocks before first PYQ-ish heading (or end of before)
    insert_at = len(before)
    for i, s in enumerate(before):
        if is_pyqish(s):
            insert_at = i
            break
    before = before[:insert_at] + teach + before[insert_at:]

    out = before + pre_practice + [practice]
    if traps is not None:
        out.append(traps)
    out.extend(leftover)

    return preamble + "".join(out), True


def main() -> None:
    fixed = 0
    scanned = 0
    for root in ROOTS:
        if not root.is_dir():
            continue
        for path in sorted(root.rglob("*.md")):
            name = path.name.lower()
            if name in {"index.md"} or name.startswith("00_syllabus") or "syllabus" == name:
                continue
            raw = path.read_text(encoding="utf-8")
            scanned += 1
            new, changed = fix_text(raw)
            if not changed:
                continue
            new = new.replace("\r\n", "\n")
            if not new.endswith("\n"):
                new += "\n"
            path.write_text(new, encoding="utf-8", newline="\n")
            fixed += 1
            try:
                rel = path.relative_to(Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects"))
            except ValueError:
                rel = path
            print(f"fixed: {rel}")
    print(f"\nDone. Fixed {fixed} / {scanned} files.")


if __name__ == "__main__":
    main()
