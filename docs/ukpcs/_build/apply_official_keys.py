"""Apply UKPSC 2025 Provisional Answer Key (Series B) to bank_2025_data.py.

User English dump order matches Series B:
  Q1 Census -> C, Q3 HMT Ranibagh -> A, Q4 Himadri -> D.
"""

from __future__ import annotations

import re
from pathlib import Path

BASE = Path(__file__).resolve().parent
BANK = BASE / "bank_2025_data.py"
AK_TEXT = BASE / "2025_ak_text.txt"


def parse_keys(text: str) -> dict[str, dict[int, str]]:
    parts = re.split(r"Provisional Answer Key Series ([ABCD])", text)
    keys: dict[str, dict[int, str]] = {}
    for i in range(1, len(parts), 2):
        series = parts[i]
        body = parts[i + 1]
        d: dict[int, str] = {}
        for q, a in re.findall(r"(\d+)\s+([ABCD])", body):
            qn = int(q)
            if 1 <= qn <= 150 and qn not in d:
                d[qn] = a
        keys[series] = d
    return keys


def main() -> None:
    keys = parse_keys(AK_TEXT.read_text(encoding="utf-8"))
    series = "B"
    official = keys[series]
    assert len(official) == 150, f"Series {series} has {len(official)}"

    (BASE / "series_b_key.txt").write_text(
        "\n".join(f"{n},{official[n]}" for n in range(1, 151)),
        encoding="utf-8",
    )

    src = BANK.read_text(encoding="utf-8")
    # Split on question objects that start with "n":
    parts = re.split(r'(\{\s*"n":\s*\d+)', src)
    # parts[0] = header; then pairs of (marker, rest)
    out = [parts[0]]
    changed = 0
    same = 0
    found = 0
    i = 1
    while i < len(parts):
        marker = parts[i]
        rest = parts[i + 1] if i + 1 < len(parts) else ""
        m = re.search(r'"n":\s*(\d+)', marker)
        if not m:
            out.append(marker + rest)
            i += 2
            continue
        n = int(m.group(1))
        found += 1
        ans = official[n]
        # replace first ans and uncertain inside this object (until next sibling handled by split)
        # rest begins after marker; find ans in rest before the closing of this dict is hard.
        # Replace first "ans": "X" and first "uncertain": bool in rest.
        new_rest, n_sub = re.subn(
            r'"ans":\s*"[ABCD]"',
            f'"ans": "{ans}"',
            rest,
            count=1,
        )
        if n_sub:
            # check if changed
            old_m = re.search(r'"ans":\s*"([ABCD])"', rest)
            old = old_m.group(1) if old_m else "?"
            if old == ans:
                same += 1
            else:
                changed += 1
                print(f"Q{n}: {old} -> {ans}")
                # append official note into explain if missing
                if "Official provisional key" not in new_rest:
                    new_rest = re.sub(
                        r'("explain":\s*\((?:.|\n)*?\))\s*,\s*\n\s*"uncertain"',
                        lambda mm: mm.group(1).rstrip().rstrip(")")
                        + f' \" Official provisional key (Series {series}) marks **{ans}**.\"),'
                        + '\n        "uncertain"',
                        new_rest,
                        count=1,
                    )
                    # fallback simpler: force uncertain False
            new_rest = re.sub(
                r'"uncertain":\s*(True|False)',
                '"uncertain": False',
                new_rest,
                count=1,
            )
        else:
            print(f"WARN no ans field for Q{n}")
        out.append(marker + new_rest)
        i += 2

    BANK.write_text("".join(out), encoding="utf-8")
    print(f"found={found} same={same} changed={changed} series={series}")


if __name__ == "__main__":
    main()
