#!/usr/bin/env python3
"""Expand thin geography consolidated blocks using confused pairs + must-score tables."""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sync_revision_msf import extract_consolidated, extract_first_md_table_after  # noqa: E402

ROOT = Path(__file__).resolve().parents[3]
SUBJ = ROOT / "docs/subjects/geography"
TARGET = 42


def strip_bold(s: str) -> str:
    return re.sub(r"\*\*", "", s).strip()


def norm_key(s: str) -> str:
    s = strip_bold(s).lower()
    return re.sub(r"[^a-z0-9]+", " ", s)[:90].strip()


def rows_from_table(table: str | None) -> list[list[str]]:
    if not table:
        return []
    rows = []
    for line in table.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not cells or set(cells[0]) <= {"-", ":"}:
            continue
        rows.append(cells)
    return rows


def extract_must_score_tables(text: str) -> list[list[list[str]]]:
    m = re.search(
        r"<details[^>]*st-toggle-must-score[^>]*>.*?</summary>\s*(.*?)</details>",
        text,
        re.S | re.I,
    )
    if not m:
        return []
    block = m.group(1)
    tables = []
    for tm in re.finditer(r"((?:^\|.+\|\s*\n){2,})", block, re.M):
        tables.append(rows_from_table(tm.group(1)))
    return tables


def expand_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    _c, facts = extract_consolidated(text)
    if len(facts) >= TARGET:
        print(f"OK enough {path.name}: {len(facts)}")
        return False

    existing = {norm_key(f) for f in facts}
    extras: list[str] = []

    conf = extract_first_md_table_after(text, r"st-toggle-confused|Confused Pairs")
    for row in rows_from_table(conf)[1:]:
        if len(row) < 3:
            continue
        pair, correct, trap = row[0], row[1], row[2]
        if pair.lower() in {"pair", "#"}:
            continue
        line = f"**{strip_bold(pair)}** = {correct}. Trap: {trap}."
        k = norm_key(line)
        if k and k not in existing:
            extras.append(line)
            existing.add(k)

    for table in extract_must_score_tables(text):
        if len(table) < 2:
            continue
        for row in table[1:]:
            if len(row) < 2:
                continue
            a, b = row[0], row[1]
            if a.lower() in {"item", "pair", "name", "city", "crop", "state", "region"}:
                continue
            line = f"**{strip_bold(a)}** — {b}."
            k = norm_key(line)
            if k and k not in existing:
                extras.append(line)
                existing.add(k)

    need = TARGET - len(facts)
    if need <= 0 or not extras:
        print(f"NO EXPAND {path.name}: have={len(facts)} extras={len(extras)}")
        return False

    add = extras[:need]
    new_facts = facts + add

    m = re.search(
        r"(<details class=\"st-chapter-toggle st-toggle-facts\" markdown=\"1\">\s*"
        r"<summary><strong>🎯 Consolidated — )(\d+)( Must-Score Facts[^<]*</strong>.*?</summary>\s*)"
        r"(.*?)(</details>)",
        text,
        re.S,
    )
    if not m:
        # looser summary match
        m = re.search(
            r"(<details class=\"st-chapter-toggle st-toggle-facts\"[^>]*>\s*"
            r"<summary><strong>🎯 Consolidated — )(\d+)( Must-Score Facts.*?</summary>\s*)"
            r"(.*?)(</details>)",
            text,
            re.S,
        )
    if not m:
        print(f"NO BLOCK {path.name}")
        return False

    body = "\n".join(f"{i}. {f}" for i, f in enumerate(new_facts, 1)) + "\n"
    new_block = f"{m.group(1)}{len(new_facts)}{m.group(3)}{body}\n{m.group(5)}"
    path.write_text(text[: m.start()] + new_block + text[m.end() :], encoding="utf-8", newline="\n")
    print(f"EXPANDED {path.name}: {len(facts)} -> {len(new_facts)} (+{len(add)})")
    return True


def main() -> int:
    only = sys.argv[1:]
    files = [SUBJ / n for n in only] if only else sorted(SUBJ.glob("[0-9][0-9]_*.md"))
    n = 0
    for f in files:
        if f.name.startswith("00_"):
            continue
        if expand_file(f):
            n += 1
    print(f"Expanded {n} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
