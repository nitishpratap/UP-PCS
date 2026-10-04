#!/usr/bin/env python3
"""Generate 20-Q Mastery Drills for geography revision MSF.

SOURCE RULE (hard — see .cursor/rules/revision-quiz-source.mdc):
  Every true stem/option must come only from Consolidated Must-Score Facts
  and tables on the revision page (Confused Pairs / CA). No teaching-body invents.

Also rewrites revision MSF shells to match subject consolidated + CA + confused pairs.
Skips chapters listed in --skip (default includes Topic 14 and already-handcrafted 20–22).
"""

from __future__ import annotations

import argparse
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

AR_OPTS = """A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
B. (A) is false, but (R) is true
C. (A) is true, but (R) is false
D. Both (A) and (R) are true and (R) is the correct explanation of (A)"""


def strip_md(s: str) -> str:
    s = re.sub(r"\*\*", "", s)
    s = re.sub(r"`", "", s)
    return re.sub(r"\s+", " ", s).strip()


def parse_confused(table: str | None) -> list[tuple[str, str, str]]:
    if not table:
        return []
    rows = []
    for line in table.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 3:
            continue
        if set(cells[0]) <= {"-", ":"} or cells[0].lower() in {"pair", "#"}:
            continue
        rows.append((strip_md(cells[0]), strip_md(cells[1]), strip_md(cells[2])))
    return rows


def bold_core(fact: str) -> str:
    m = re.search(r"\*\*([^*]{3,60})\*\*", fact)
    return m.group(1) if m else strip_md(fact)[:80]


def q_block(n: int, stem: str, opts: list[str], ans: str, logic: str, ar: bool = False) -> str:
    letters = "ABCD"
    opt_lines = "\n".join(f"{letters[i]}. {opts[i]}" for i in range(4))
    tag = "**A/R logic:**" if ar else "**Logic:**"
    return (
        f"**Q{n}.**\n{stem}\n\n{opt_lines}\n\n"
        f"<details>\n<summary>Show answer</summary>\n\n"
        f"**Ans: {ans}.**\n\n{tag} {logic}\n\n</details>\n"
    )


def build_quiz(title: str, facts: list[str], confused: list[tuple[str, str, str]]) -> str:
    qs: list[str] = []
    n = 1
    # 1–4: single-best from bold cores
    for fact in facts[:8]:
        if n > 4:
            break
        core = bold_core(fact)
        if len(core) < 4:
            continue
        distractors = [bold_core(f) for f in facts if f != fact][:3]
        while len(distractors) < 3:
            distractors.append("None of the above")
        opts = [core, distractors[0], distractors[1], distractors[2]]
        # rotate correct letter by n
        rot = (n - 1) % 4
        opts = opts[-rot:] + opts[:-rot] if rot else opts
        # ensure correct at rot position
        correct = core
        # rebuild with known key
        base = [core, distractors[0], distractors[1], distractors[2]]
        key_i = (n - 1) % 4
        opts = base[:]
        opts[0], opts[key_i] = opts[key_i], opts[0]
        # simpler: place correct at key_i
        others = [distractors[0], distractors[1], distractors[2]]
        opts = others[:]
        opts.insert(key_i, correct)
        ans = "ABCD"[key_i]
        stem = (
            f"With reference to {title}, which one of the following is a correct must-score association?"
        )
        qs.append(
            q_block(
                n,
                stem,
                [strip_md(o)[:110] for o in opts],
                ans,
                f"From consolidated facts: {strip_md(fact)[:180]}",
            )
        )
        n += 1

    # 5–10: multi-statement using consecutive facts; false stmt = Confused Pairs trap
    for i in range(0, min(12, len(facts) - 2), 2):
        if n > 10:
            break
        f1, f2 = facts[i], facts[i + 1]
        s1 = strip_md(f1)[:140]
        s2 = strip_md(f2)[:140]
        if confused:
            pair, correct, trap = confused[(n - 5) % len(confused)]
            s3 = f"{pair} is correctly matched with {trap}."
            logic_false = f"Statement 3 uses the page trap ({pair} → {trap}); correct lock is {correct}."
        else:
            # Reverse a page fact rather than inventing outside content
            s3 = f"The opposite of the following page lock is true: {s1[:100]}"
            logic_false = "Statement 3 reverses a consolidated lock on this page."
        opts = ["1 and 2", "Only 3", "2 and 3", "Only 1"]
        ans = "A"
        stem = (
            "With reference to the chapter, which of the following statements is/are correct?\n\n"
            f"1. {s1}\n2. {s2}\n3. {s3}"
        )
        qs.append(
            q_block(
                n,
                stem,
                opts,
                ans,
                f"Statements 1 and 2 are from Consolidated. {logic_false}",
            )
        )
        n += 1

    # 11–14: confused pair NOT matched
    for pair, correct, trap in confused[:8]:
        if n > 14:
            break
        opts = [
            f"{pair} — {correct}",
            f"{pair} — {trap}",
            f"{trap} — {correct}",
            "None of the pairs above is used in this chapter",
        ]
        key_i = (n - 1) % 4
        # question asks NOT correctly matched → answer is pair—trap
        target = f"{pair} — {trap}"
        others = [o for o in opts if o != target]
        opts = others[:]
        opts.insert(key_i, target)
        # ensure one correct pair also present
        if f"{pair} — {correct}" not in opts:
            opts[(key_i + 1) % 4] = f"{pair} — {correct}"
        ans = "ABCD"[opts.index(target)]
        stem = "Which one of the following pairs is NOT correctly matched?"
        qs.append(
            q_block(
                n,
                stem,
                opts,
                ans,
                f"Correct lock is {pair} → {correct}. Trap is {trap}.",
            )
        )
        n += 1

    # 15–16: A/R (options only A–D letters; stem carries full codes)
    ar_opt_lines = [
        "Both (A) and (R) are true, but (R) is not the correct explanation of (A)",
        "(A) is false, but (R) is true",
        "(A) is true, but (R) is false",
        "Both (A) and (R) are true and (R) is the correct explanation of (A)",
    ]
    if len(facts) >= 4:
        a_true = strip_md(facts[0])[:160]
        r_true = strip_md(facts[1])[:160]
        if confused:
            pair, correct, trap = confused[0]
            r_false = f"{pair} is correctly explained as {trap}."
            false_note = f"False line uses trap ({trap}); page lock is {correct}."
        else:
            r_false = f"Negation of page lock: {a_true[:120]}"
            false_note = "False line negates a consolidated lock on this page."
        qs.append(
            q_block(
                n,
                f"Assertion (A): {a_true}\nReason (R): {r_false}",
                ar_opt_lines,
                "C",
                f"A is from Consolidated. {false_note}",
                ar=True,
            )
        )
        n += 1
        qs.append(
            q_block(
                n,
                f"Assertion (A): {r_false}\nReason (R): {r_true}",
                ar_opt_lines,
                "B",
                f"A is false ({false_note}); R is from Consolidated.",
                ar=True,
            )
        )
        n += 1

    # 17–20: more single / multi from later facts
    for fact in facts[8:20]:
        if n > 20:
            break
        core = bold_core(fact)
        others = [bold_core(f) for f in facts if bold_core(f) != core][:3]
        while len(others) < 3:
            others.append("Not a standard association in this chapter")
        key_i = (n - 1) % 4
        opts = others[:]
        opts.insert(key_i, core)
        qs.append(
            q_block(
                n,
                "Which one of the following is correctly matched / stated?",
                [strip_md(o)[:110] for o in opts],
                "ABCD"[key_i],
                f"Supported by: {strip_md(fact)[:180]}",
            )
        )
        n += 1

    while n <= 20 and facts:
        fact = facts[(n * 3) % len(facts)]
        qs.append(
            q_block(
                n,
                "Which statement best reflects a must-score fact of this chapter?",
                [
                    strip_md(fact)[:110],
                    "This chapter has no decidable associations",
                    "All pairs in this chapter are interchangeable",
                    "Only current affairs matter; static facts never appear",
                ],
                "A",
                f"Directly from consolidated: {strip_md(fact)[:180]}",
            )
        )
        n += 1

    body = "\n".join(qs[:20])
    return (
        "## 🎯 Revision Practice MCQs (Mastery Drill)\n\n"
        "> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, "
        "and score &ge;80% to conquer this chapter.\n\n"
        f"{body}\n"
    )


def process(filename: str) -> None:
    src = SUBJ / filename
    text = src.read_text(encoding="utf-8")
    _c, facts = extract_consolidated(text)
    if len(facts) < 15:
        print(f"SKIP thin consolidated: {filename} ({len(facts)})")
        return
    confused_tbl = extract_first_md_table_after(text, r"st-toggle-confused|Confused Pairs")
    confused = parse_confused(confused_tbl)
    title = extract_title(text, filename)
    quiz = build_quiz(title, facts, confused)
    out = build_revision_md(
        title=title,
        subject_folder="geography",
        facts=facts,
        confused_table=confused_tbl,
        ca_table=extract_first_md_table_after(text, r"##\s*Current Affairs"),
        quiz_block=quiz,
    )
    dst = REV / filename
    dst.write_text(out, encoding="utf-8", newline="\n")
    print(f"OK {filename}: facts={len(facts)} confused={len(confused)} quiz=20")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="Specific filenames")
    ap.add_argument(
        "--skip",
        nargs="*",
        default=[
            "14_Earth_and_Universe.md",
            "20_World_Agriculture.md",
            "21_World_Minerals_Energy.md",
            "22_World_Industries.md",
        ],
    )
    args = ap.parse_args()
    files = sorted(SUBJ.glob("[0-9][0-9]_*.md"))
    if args.only:
        files = [SUBJ / n for n in args.only]
    for f in files:
        if f.name in set(args.skip or []):
            print(f"SKIP listed: {f.name}")
            continue
        process(f.name)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
