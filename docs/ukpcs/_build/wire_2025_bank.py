"""Wire the 2025 UKPCS bank into navigation and cross-link it from subject hubs.

Idempotent: each edit is skipped when its marker text is already present.
Run:  python docs/ukpcs/_build/wire_2025_bank.py
"""

from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
DOCS = REPO / "docs"

BANK_REL = "ukpcs/pyqs/2025_GS_I_Complete_Bank.md"


def read(p):
    return p.read_text(encoding="utf-8")


def write(p, text):
    p.write_text(text, encoding="utf-8")


def add_pyqs_nav():
    p = DOCS / "ukpcs" / ".pages"
    text = read(p)
    if "PYQs: pyqs" in text:
        return "skip (already present)"
    anchor = '  - "Folder Map (where notes live)": 00_Folder_Map.md\n'
    if anchor not in text:
        return "FAILED (anchor not found)"
    write(p, text.replace(anchor, anchor + "  - PYQs: pyqs\n"))
    return "added PYQs nav entry"


def relabel_analysis_nav():
    p = DOCS / "prelims-analysis" / ".pages"
    text = read(p)
    old = '  - "UKPCS Overview (placeholder)": 09_UKPCS_Overview.md'
    new = '  - "UKPCS Overview (2025 paper)": 09_UKPCS_Overview.md'
    if old not in text:
        return "skip (already relabelled)"
    write(p, text.replace(old, new))
    return "relabelled UKPCS overview entry"


def add_ukpcs_index_card():
    p = DOCS / "ukpcs" / "index.md"
    text = read(p)
    if "2025 PYQs" in text:
        return "skip (already present)"
    anchor = """[**:material-newspaper-variant-outline: Uttarakhand CA**
<span>State current affairs sheet (fill as you paste monthly CA).</span>](../current-affairs/topics/16_UK_Special.md){ .study-card }
"""
    if anchor not in text:
        return "FAILED (anchor not found)"
    card = anchor + """
[**:material-file-document-multiple-outline: 2025 PYQs — GS Paper I**
<span>All 150 questions with Logic lines and hidden answers. 55 reference Uttarakhand.</span>](pyqs/2025_GS_I_Complete_Bank.md){ .study-card }
"""
    text = text.replace(anchor, card)

    old_line = "3. **PYQs next.** When you paste UKPCS PYQs, they go into teaching banks and a UKPCS Prelims Analysis track — same pattern as UPPCS 2018–2025."
    new_line = "3. **PYQs next.** The [2025 GS Paper I bank](pyqs/2025_GS_I_Complete_Bank.md) is tagged and analysed in the [UKPCS Prelims Analysis](../prelims-analysis/09_UKPCS_Overview.md). Further years join the same track, as with UPPCS 2018–2025."
    if old_line in text:
        text = text.replace(old_line, new_line)
    write(p, text)
    return "added study card and updated step 3"


CROSSLINKS = [
    ("subjects/geography/uttarakhand/index.md", "../../../"),
    ("subjects/polity/uttarakhand/index.md", "../../../"),
    ("subjects/mordern india/uttarakhand/index.md", "../../../"),
    ("subjects/medieval india/uttarakhand/index.md", "../../../"),
    ("subjects/ancient history/uttarakhand/index.md", "../../../"),
    ("subjects/economy/uttarakhand/index.md", "../../../"),
    ("subjects/environments & ecology/uttarakhand/index.md", "../../../"),
    ("current-affairs/topics/16_UK_Special.md", "../../"),
]


def add_crosslinks():
    results = []
    for rel, prefix in CROSSLINKS:
        p = DOCS / rel
        if not p.exists():
            results.append(f"  {rel}: skip (file missing)")
            continue
        text = read(p)
        if "2025_GS_I_Complete_Bank" in text:
            results.append(f"  {rel}: skip (already linked)")
            continue
        line = (
            "\n> **UKPCS 2025 PYQs:** state-referenced questions from GS Paper I are collected in the "
            f"[UKPCS Prelims 2025 Complete Bank]({prefix}{BANK_REL}).\n"
        )
        write(p, text.rstrip("\n") + "\n" + line)
        results.append(f"  {rel}: linked")
    return "\n".join(results)


def main():
    print("ukpcs/.pages:", add_pyqs_nav())
    print("prelims-analysis/.pages:", relabel_analysis_nav())
    print("ukpcs/index.md:", add_ukpcs_index_card())
    print("cross-links:")
    print(add_crosslinks())


if __name__ == "__main__":
    main()
