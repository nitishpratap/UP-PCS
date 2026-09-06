"""Parse UnlockIAS saved HTML/text dumps into UKPCS Complete Banks (no answer keys)."""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path(r"C:\Users\Axeno\Desktop\UP-PCS")
PYQS = REPO / "docs" / "ukpcs" / "pyqs"
AGENT = Path(r"C:\Users\Axeno\.cursor\projects\C-Users-Axeno-Desktop-UP-PCS\agent-tools")

# Map year -> saved fetch file
SOURCES = {
    "2024": AGENT / "6d8c1eb0-424e-4d7d-b66d-712cb35666e8.txt",
    "2021": AGENT / "8fb1f7d4-0792-4256-8b81-8cb5b89e257d.txt",
    "2016": AGENT / "d298548d-1698-44aa-8e96-692f8aee7417.txt",
}


def parse_unlock(text: str, paper_tag: str) -> list[dict]:
    """Extract GS-I / Paper-I MCQs from UnlockIAS page text."""
    # Prefer GS-I or Paper-I blocks
    # Pattern examples:
    # Q. 11 markMediumUKPSC Prelims 2024·GS-ISTEM...(a)...(b)...(c)...(d)...Report Issue
    qs: list[dict] = []
    # Split on Report Issue boundaries that follow options
    chunks = re.split(r"Report Issue", text)
    for chunk in chunks:
        if paper_tag not in chunk and f"·{paper_tag}" not in chunk:
            # also allow Paper-I for 2016
            if paper_tag == "GS-I" and "Paper-I" not in chunk and "·Paper-I" not in chunk:
                continue
        m = re.search(
            rf"UKPSC Prelims \d{{4}}·(?:GS-I|Paper-I)(.+?)\(a\)(.+?)\(b\)(.+?)\(c\)(.+?)\(d\)(.+)$",
            chunk,
            flags=re.S,
        )
        if not m:
            # try without year tag glued
            m = re.search(
                r"·(?:GS-I|Paper-I)(.+?)\(a\)(.+?)\(b\)(.+?)\(c\)(.+?)\(d\)(.+)$",
                chunk,
                flags=re.S,
            )
        if not m:
            continue
        stem = re.sub(r"\s+", " ", m.group(1)).strip()
        # strip Hindi mirror if present
        stem = re.split(r"हिंदी में प्रश्न देखें", stem)[0].strip()
        opts = []
        for i in range(2, 6):
            o = re.sub(r"\s+", " ", m.group(i)).strip()
            o = re.split(r"हिंदी में प्रश्न देखें", o)[0].strip()
            # cut at next option letter remnants
            opts.append(o)
        if len(stem) < 15:
            continue
        # skip CSAT-like if clearly aptitude for GS-I year files that mix
        qs.append({"stem": stem, "options": opts})
    return qs


def write_bank(year: str, questions: list[dict], held_note: str) -> Path:
    lines = [
        f"# UKPCS Prelims {year} — GS Paper I Complete PYQ Bank",
        "",
        f"**Paper:** UKPSC Upper PCS Prelims {year} General Studies Paper I.",
        f"**Source note:** {held_note}",
        "",
        "!!! warning \"Answer keys not in this ingest\"",
        "    Questions were harvested from a public UnlockIAS archive that **does not carry answer keys**.",
        "    Fill **Show answer** after matching the official UKPSC key (psc.uk.gov.in).",
        "",
    ]
    for i, q in enumerate(questions, 1):
        title = q["stem"][:72].rstrip(" ,;:")
        lines += [
            f"### Q{i}. {title}",
            "",
            "**Logic:** Topic recall from this year’s Prelims paper; confirm with the official key.",
            "",
            q["stem"],
            "",
            f"A. {q['options'][0]}",
            f"B. {q['options'][1]}",
            f"C. {q['options'][2]}",
            f"D. {q['options'][3]}",
            "",
            "<details>",
            "<summary>Show answer</summary>",
            "",
            "**Ans: pending official key.** Match this stem to the UKPSC answer key PDF for the correct series.",
            "",
            "</details>",
            "",
        ]
    lines += [
        "## Bank summary",
        "",
        f"- Questions harvested: **{len(questions)}** (target 150 for GS-I).",
        "- Answers: not included in source archive.",
        "",
    ]
    out = PYQS / f"{year}_GS_I_Complete_Bank.md"
    out.write_text("\n".join(lines), encoding="utf-8")
    return out


def main() -> None:
    PYQS.mkdir(parents=True, exist_ok=True)
    notes = {
        "2024": "Held 14 July 2024. UnlockIAS lists 150 GS-I + CSAT items.",
        "2021": "Notification year 2021; Prelims held 3 April 2022 (alias 2022 paper).",
        "2016": "2016 Upper PCS Prelims Paper-I.",
    }
    tags = {"2024": "GS-I", "2021": "GS-I", "2016": "Paper-I"}
    results = []
    for year, path in SOURCES.items():
        if not path.exists():
            results.append(f"MISSING source {year}: {path}")
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        qs = parse_unlock(text, tags[year])
        # Deduplicate near-identical stems
        seen = set()
        uniq = []
        for q in qs:
            key = q["stem"][:120].lower()
            if key in seen:
                continue
            seen.add(key)
            uniq.append(q)
        out = write_bank(year, uniq[:150], notes[year])
        results.append(f"{year}: {len(uniq)} parsed -> {out.name} (wrote {min(len(uniq),150)})")
    print("\n".join(results))


if __name__ == "__main__":
    main()
