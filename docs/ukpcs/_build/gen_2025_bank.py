"""Generate docs/ukpcs/pyqs/2025_GS_I_Complete_Bank.md from embedded question data.

Question data lives in bank_2025_data.py. Run:

    python docs/ukpcs/_build/gen_2025_bank.py

The script refuses to write the bank until every number 1-150 is present, so a
partial run can never publish a half-invented paper.
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from bank_2025_data import QUESTIONS  # noqa: E402

REPO = Path(__file__).resolve().parents[3]
OUT = REPO / "docs" / "ukpcs" / "pyqs" / "2025_GS_I_Complete_Bank.md"

TOTAL = 150

# Bucket order in the rendered file. Keys are used in each question's "bucket".
BUCKETS = [
    ("uk_gk", "Uttarakhand GK / Demography / Economy / Industry / Institutions / Literature / Tribes / CA"),
    ("uk_history", "Uttarakhand History"),
    ("uk_geo", "Uttarakhand Geography / Environment"),
    ("uk_polity", "Uttarakhand Polity / Art & Culture"),
    ("ancient", "Ancient History"),
    ("medieval", "Medieval History"),
    ("modern", "Modern History"),
    ("geography", "Geography (national)"),
    ("polity", "Polity (national)"),
    ("economy", "Economy (national)"),
    ("science", "Environment / Science / Biology / Physics / Chemistry / Computer / S&T"),
    ("ca", "Current Affairs / IR / International"),
]

# Buckets that count as Uttarakhand-referenced for the analysis page.
UK_BUCKETS = {"uk_gk", "uk_history", "uk_geo", "uk_polity"}

# Fields on each QUESTIONS entry (see bank_2025_data.py):
#   n, title, bucket, logic, stem, options (4, in A-D order), ans, explain, uncertain

HEADER = """# UKPCS Prelims 2025 — GS Paper I Complete PYQ Bank

**Paper:** Uttarakhand PCS Prelims 2025, General Studies Paper I (English paper), 150 objective questions.

!!! warning "No official answer key in the source dump"
    The source dump carries the questions only. Every **Show answer** block below gives a
    **Provisional** key drawn from standard static sources. Where a Uttarakhand-specific
    current-affairs figure, budget number or survey statistic decides the option, the entry is
    flagged **Key uncertain** and must be checked against the official UKPSC key before you
    memorise it.

!!! note "Q1-Q4 were reconstructed from OCR fragments"
    In the dump, the text of the first four questions is scattered across the Q1-Q4 block.
    Q1 is rebuilt as the four-statement Census 2011 question (Rudraprayag least population,
    Nainital third in population, sex ratio 963, density 189). Q2 is the GSDP growth question
    from Economic Survey 2024-25, Q3 asks the location of the HMT unit, and Q4 asks the brand
    name used for state craft products.
"""


def render_question(q):
    letters = ["A", "B", "C", "D"]
    lines = [
        f"### Q{q['n']}. {q['title']}",
        "",
        f"**Logic:** {q['logic']}",
        "",
        q["stem"],
        "",
    ]
    for letter, opt in zip(letters, q["options"]):
        lines.append(f"{letter}. {opt}")
    flag = " **Key uncertain — verify official key.**" if q.get("uncertain") else ""
    lines += [
        "",
        "<details>",
        "<summary>Show answer</summary>",
        "",
        f"**Ans: {q['ans']} (Provisional).** {q['explain']}{flag}",
        "",
        "</details>",
        "",
    ]
    return "\n".join(lines)


def validate():
    numbers = [q["n"] for q in QUESTIONS]
    problems = []

    duplicates = sorted({n for n in numbers if numbers.count(n) > 1})
    if duplicates:
        problems.append(f"duplicate question numbers: {duplicates}")

    missing = [n for n in range(1, TOTAL + 1) if n not in set(numbers)]
    if missing:
        problems.append(f"{len(missing)} of {TOTAL} questions missing (first gaps: {missing[:12]})")

    valid_buckets = {key for key, _ in BUCKETS}
    for q in QUESTIONS:
        if q["bucket"] not in valid_buckets:
            problems.append(f"Q{q['n']}: unknown bucket {q['bucket']!r}")
        if len(q["options"]) != 4:
            problems.append(f"Q{q['n']}: expected 4 options, found {len(q['options'])}")
        if q["ans"] not in {"A", "B", "C", "D"}:
            problems.append(f"Q{q['n']}: bad answer letter {q['ans']!r}")

    return problems


def build():
    parts = [HEADER]
    for key, heading in BUCKETS:
        group = sorted((q for q in QUESTIONS if q["bucket"] == key), key=lambda q: q["n"])
        if not group:
            continue
        parts.append(f"\n## {heading}\n")
        parts.extend(render_question(q) for q in group)

    uk_numbers = sorted(q["n"] for q in QUESTIONS if q["bucket"] in UK_BUCKETS)
    uncertain = sorted(q["n"] for q in QUESTIONS if q.get("uncertain"))
    parts.append(
        "\n## Bank summary\n\n"
        f"- Questions in this bank: **{len(QUESTIONS)}** of {TOTAL}.\n"
        f"- Uttarakhand-referenced questions: **{len(uk_numbers)}** "
        f"({', '.join('Q' + str(n) for n in uk_numbers)}).\n"
        f"- Keys awaiting official verification: "
        f"{', '.join('Q' + str(n) for n in uncertain) if uncertain else 'none'}.\n"
    )
    return "\n".join(parts)


def main():
    problems = validate()
    if problems:
        print("Refusing to write the bank. Fix the data first:\n", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        print(
            "\nAdd the remaining dump text to bank_2025_data.py, then re-run.",
            file=sys.stderr,
        )
        return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(build(), encoding="utf-8")
    uk = sorted(q["n"] for q in QUESTIONS if q["bucket"] in UK_BUCKETS)
    unc = sorted(q["n"] for q in QUESTIONS if q.get("uncertain"))
    print(f"Wrote {OUT.relative_to(REPO)}")
    print(f"  questions: {len(QUESTIONS)}")
    print(f"  Uttarakhand-referenced: {len(uk)}")
    print("  UK Q numbers: " + ", ".join(str(n) for n in uk))
    print(f"  key uncertain: {len(unc)}")
    print("  uncertain Q numbers: " + ", ".join(str(n) for n in unc))
    for key, heading in BUCKETS:
        c = sum(1 for q in QUESTIONS if q["bucket"] == key)
        print(f"  bucket {key}: {c}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
