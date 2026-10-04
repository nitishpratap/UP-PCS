#!/usr/bin/env python3
"""Shared helpers to patch Geography consolidated MSF + write revision twins."""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sync_revision_msf import (  # noqa: E402
    build_revision_md,
    extract_consolidated,
    extract_first_md_table_after,
    extract_title,
)

ROOT = Path(__file__).resolve().parents[3]
SUBJ = ROOT / "docs/subjects/geography"
REV = ROOT / "docs/revision/must-score-facts/geography"
QUIZ_DIR = ROOT / "docs/subjects/_build/_quiz_tmp"
QUIZ_DIR.mkdir(parents=True, exist_ok=True)


def replace_consolidated(text: str, count: int, facts: list[str]) -> str:
    body = "\n".join(f"{i}. {f}" for i, f in enumerate(facts, 1)) + "\n"
    summary = (
        f'<summary><strong>🎯 Consolidated — {count} Must-Score Facts</strong> '
        f'<span class="st-toggle-hint">(Click to Expand)</span></summary>'
    )
    new_block = (
        f'<details class="st-chapter-toggle st-toggle-facts" markdown="1">\n'
        f"{summary}\n\n{body}\n</details>"
    )
    pat = re.compile(
        r'<details[^>]*st-toggle-facts[^>]*>.*?</details>',
        re.S | re.I,
    )
    if not pat.search(text):
        raise ValueError("No consolidated details block found")
    return pat.sub(new_block, text, count=1)


def ensure_ca_section(text: str, ca_md: str) -> str:
    if re.search(r"^##\s*Current Affairs", text, re.M | re.I):
        return text
    # Insert CA before first st-toggle-facts details
    m = re.search(r'<details class="st-chapter-toggle st-toggle-facts"', text)
    if not m:
        return text
    return text[: m.start()] + ca_md.rstrip() + "\n\n---\n\n" + text[m.start() :]


def write_revision(filename: str, quiz_md: str) -> tuple[int, int]:
    src = SUBJ / filename
    dst = REV / filename
    text = src.read_text(encoding="utf-8")
    _count, facts = extract_consolidated(text)
    if not facts:
        raise ValueError(f"No facts in {filename}")
    if not quiz_md.strip().startswith("##"):
        quiz_md = "## 🎯 Revision Practice MCQs (Mastery Drill)\n\n" + quiz_md
    out = build_revision_md(
        title=extract_title(text, filename),
        subject_folder="geography",
        facts=facts,
        confused_table=extract_first_md_table_after(
            text, r"st-toggle-confused|Confused Pairs"
        ),
        ca_table=extract_first_md_table_after(text, r"##\s*Current Affairs"),
        quiz_block=quiz_md if quiz_md.endswith("\n") else quiz_md + "\n",
    )
    dst.write_text(out, encoding="utf-8", newline="\n")
    qn = len(re.findall(r"^\*\*Q\d+\.\*\*", out, re.M))
    return len(facts), qn


def apply_chapter(
    filename: str,
    facts: list[str],
    quiz_md: str,
    ca_md: str | None = None,
) -> dict:
    assert 40 <= len(facts) <= 50, f"{filename}: {len(facts)} facts not in 40–50"
    # ban words
    joined = "\n".join(facts) + "\n" + quiz_md
    for bad in ("exam", "lock", "locks", "Exam", "Lock"):
        if re.search(rf"\b{bad}\b", joined):
            # allow inside Hindi? still ban English token
            raise ValueError(f"{filename}: forbidden word {bad!r}")
    text = (SUBJ / filename).read_text(encoding="utf-8")
    if ca_md:
        text = ensure_ca_section(text, ca_md)
    text = replace_consolidated(text, len(facts), facts)
    (SUBJ / filename).write_text(text, encoding="utf-8", newline="\n")
    n_facts, n_q = write_revision(filename, quiz_md)
    return {"file": filename, "facts": n_facts, "quiz": n_q}
