#!/usr/bin/env python3
"""Write one geography revision MSF file from subject + quiz markdown."""

from __future__ import annotations

import argparse
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


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("filename", help="e.g. 22_World_Industries.md")
    ap.add_argument("--quiz", required=True, help="Path to quiz markdown starting with ## Mastery")
    args = ap.parse_args()
    src = ROOT / "docs/subjects/geography" / args.filename
    dst = ROOT / "docs/revision/must-score-facts/geography" / args.filename
    quiz = Path(args.quiz).read_text(encoding="utf-8")
    text = src.read_text(encoding="utf-8")
    _count, facts = extract_consolidated(text)
    if not facts:
        print("No consolidated facts", file=sys.stderr)
        return 1
    out = build_revision_md(
        title=extract_title(text, args.filename),
        subject_folder="geography",
        facts=facts,
        confused_table=extract_first_md_table_after(
            text, r"st-toggle-confused|Confused Pairs"
        ),
        ca_table=extract_first_md_table_after(text, r"##\s*Current Affairs"),
        quiz_block=quiz,
    )
    dst.write_text(out, encoding="utf-8", newline="\n")
    print(f"Wrote {dst} facts={len(facts)} quiz_bytes={len(quiz)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
