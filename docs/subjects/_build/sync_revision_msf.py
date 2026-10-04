#!/usr/bin/env python3
"""Sync docs/revision/must-score-facts/<subject>/ from docs/subjects/<subject>/.

Copies Consolidated Must-Score Facts + Confused Pairs (+ Current Affairs table
when present) into the revision desk shell. Preserves an existing Mastery Drill
quiz block unless --strip-quiz is passed.

Usage:
  python docs/subjects/_build/sync_revision_msf.py Geography
  python docs/subjects/_build/sync_revision_msf.py Geography --only 14_Earth_and_Universe.md
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SUBJECTS = ROOT / "docs" / "subjects"
REVISION = ROOT / "docs" / "revision" / "must-score-facts"

SUBJECT_FOLDERS = {
    "Ancient History": "ancient history",
    "Art and Culture": "art and culture",
    "Medieval India": "medieval india",
    "Modern India": "mordern india",
    "Geography": "geography",
    "Environment and Ecology": "environments & ecology",
    "Polity": "polity",
    "Economy": "economy",
    "Science and Technology": "science and technology",
}

SUBJECT_EMOJI = {
    "geography": "🗺️ Geography",
    "polity": "⚖️ Polity & Constitution",
    "ancient history": "🏺 Ancient History",
    "medieval india": "🏰 Medieval India",
    "mordern india": "📜 Modern India",
    "art and culture": "🎨 Art & Culture",
    "environments & ecology": "🌿 Environment & Ecology",
    "economy": "💹 Economy",
    "science and technology": "🔬 Science & Technology",
}

SKIP_FILE = re.compile(
    r"^(index|00_syllabus|00_prelims_analysis|prompt|00_daily)",
    re.I,
)


def extract_title(text: str, fallback: str) -> str:
    m = re.search(r"^#\s+(.+)$", text, re.M)
    if not m:
        return fallback
    title = m.group(1).strip()
    title = re.sub(r"\s*[—\-]\s*Must-Score Facts\s*$", "", title, flags=re.I)
    return title


def extract_consolidated(text: str) -> tuple[str, list[str]]:
    m = re.search(
        r"<details[^>]*st-toggle-facts[^>]*>.*?</summary>\s*(.*?)</details>",
        text,
        re.S | re.I,
    )
    if not m:
        m = re.search(
            r"Consolidated[^<\n]*Must-Score Facts.*?</summary>\s*(.*?)</details>",
            text,
            re.S | re.I,
        )
    if not m:
        return "0", []
    block = m.group(1)
    count_m = re.search(r"Consolidated\s*—\s*(\d+)\s*Must-Score", text, re.I)
    facts = re.findall(r"^(\d+\.\s+.+)$", block, re.M)
    # Drop orphan --- separators inside the facts block
    facts = [f for f in facts if f.strip() and not f.strip() == "---"]
    count = count_m.group(1) if count_m else str(len(facts))
    return count, facts


def extract_first_md_table_after(text: str, heading_pat: str) -> str | None:
    m = re.search(heading_pat, text, re.I)
    if not m:
        return None
    rest = text[m.end() :]
    # Stop at next H2 so we do not fall into later chapter sections.
    rest = re.split(r"(?m)^##\s+", rest, maxsplit=1)[0]

    def first_table(scope: str) -> str | None:
        tm = re.search(r"((?:^\|.+\|\s*\n){2,})", scope, re.M)
        return (tm.group(1).rstrip() + "\n") if tm else None

    # Prefer a table that appears before any <details> (e.g. Current Affairs).
    pre_details = re.split(r"<details\b", rest, maxsplit=1, flags=re.I)[0]
    hit = first_table(pre_details)
    if hit:
        return hit

    # Otherwise read the first details body after the heading (Confused Pairs toggle).
    dm = re.search(r"</summary>\s*(.*?)</details>", rest, re.S | re.I)
    if dm:
        hit = first_table(dm.group(1))
        if hit:
            return hit
    return first_table(rest)


def extract_quiz_block(text: str) -> str | None:
    # Anchor on the Mastery Drill heading only — never match earlier ## sections.
    m = re.search(
        r"(?m)^(##\s+[^\n]*Revision Practice MCQs[^\n]*\n.*)\Z",
        text,
        re.S | re.I,
    )
    if not m:
        return None
    return m.group(1).rstrip() + "\n"


def build_revision_md(
    *,
    title: str,
    subject_folder: str,
    facts: list[str],
    confused_table: str | None,
    ca_table: str | None,
    quiz_block: str | None,
) -> str:
    meta = SUBJECT_EMOJI.get(subject_folder, subject_folder.title())
    facts_body = "\n".join(facts) + "\n"

    traps_parts: list[str] = []
    if ca_table:
        traps_parts.append("### Current Affairs anchors\n\n" + ca_table)
    if confused_table:
        traps_parts.append("### Confused pairs\n\n" + confused_table)
    if not traps_parts:
        traps_parts.append("_No confused-pair table found in the subject note._\n")
    traps_body = "\n---\n\n".join(traps_parts)

    quiz = quiz_block or (
        "## 🎯 Revision Practice MCQs (Mastery Drill)\n\n"
        "> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, "
        "and score &ge;80% to conquer this chapter.\n\n"
        "_Quiz pending refresh from updated notes._\n"
    )

    return f"""---
hide:
  - toc
---

# {title} — Must-Score Facts

<div class="rev-hero-banner rev-facts-hero" markdown="0">
  <div class="rev-hero-badge">🎯 MUST-SCORE RATTA LAYER</div>
  <div class="rev-hero-meta">{meta} &bull; Target: 80% Mastery Gate Required</div>
  <p class="rev-hero-lead">High-density prelims revision facts, examiner traps, confused pairs, and memory anchors for <strong>{title}</strong>. Score at least <strong>80%</strong> in the live test below to officially certify this chapter as read.</p>
</div>

## 🎯 Consolidated Must-Score Facts

{facts_body}

---

## ⚡ Confused Pairs & Common Examiner Traps

{traps_body}

---

{quiz}
"""


def sync_subject(label: str, only: str | None = None, strip_quiz: bool = False) -> int:
    folder = SUBJECT_FOLDERS.get(label, label)
    src_dir = SUBJECTS / folder
    dst_dir = REVISION / folder
    if not src_dir.is_dir():
        print(f"Subject folder missing: {src_dir}", file=sys.stderr)
        return 1
    dst_dir.mkdir(parents=True, exist_ok=True)

    files = sorted(src_dir.glob("[0-9]*.md"))
    if only:
        files = [p for p in files if p.name == only]
        if not files:
            print(f"No source file named {only}", file=sys.stderr)
            return 1

    n = 0
    for src in files:
        if SKIP_FILE.search(src.stem):
            continue
        text = src.read_text(encoding="utf-8")
        count, facts = extract_consolidated(text)
        if not facts:
            print(f"SKIP (no consolidated): {src.name}")
            continue
        title = extract_title(text, src.stem)
        confused = extract_first_md_table_after(
            text, r"st-toggle-confused|Confused Pairs"
        )
        ca = extract_first_md_table_after(text, r"##\s*Current Affairs")
        dst = dst_dir / src.name
        old_quiz = None
        if dst.exists() and not strip_quiz:
            old_quiz = extract_quiz_block(dst.read_text(encoding="utf-8"))
        out = build_revision_md(
            title=title,
            subject_folder=folder,
            facts=facts,
            confused_table=confused,
            ca_table=ca,
            quiz_block=old_quiz,
        )
        dst.write_text(out, encoding="utf-8", newline="\n")
        print(f"OK  {src.name}: {len(facts)} facts (subject says {count})")
        n += 1
    print(f"Synced {n} chapter(s) for {label}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("subject", help='e.g. "Geography"')
    ap.add_argument("--only", help="Single filename, e.g. 14_Earth_and_Universe.md")
    ap.add_argument(
        "--strip-quiz",
        action="store_true",
        help="Do not preserve old quiz block",
    )
    args = ap.parse_args()
    return sync_subject(args.subject, only=args.only, strip_quiz=args.strip_quiz)


if __name__ == "__main__":
    raise SystemExit(main())
