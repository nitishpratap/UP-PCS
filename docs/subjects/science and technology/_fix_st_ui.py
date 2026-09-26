# -*- coding: utf-8 -*-
"""Scrub Exam/Lock wording + move early Ghatnachakra blocks after UPPCS bank."""
from pathlib import Path
import re

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology")

# Preserve these substrings (medical / official paper names / missile tech)
KEEP_TOKENS = [
    "Re. Exam",
    "Re-Exam",
    "Re Exam",
    "(Re. Exam)",
    "(Re-Exam)",
    "Lockjaw",
    "lockjaw",
    "Lock-On",
    "Lock On",
]


def scrub_exam_lock(text: str) -> tuple[str, int]:
    """Replace teaching Exam/Lock wording; preserve Re. Exam / Lockjaw / Lock-On."""
    n = 0
    placeholders = {}
    for i, tok in enumerate(KEEP_TOKENS):
        key = f"__KEEP_{i}__"
        if tok in text:
            c = text.count(tok)
            text = text.replace(tok, key)
            placeholders[key] = tok
            # count not scrubbed

    reps = [
        (r"\*\*Exam Lock & Core Concepts:\*\*", "**Logic:**"),
        (r"\*\*Exam Lock:\*\*", "**Logic:**"),
        (r"\*Exam lock\*:", "**Logic:**"),
        (r"\*Exam lock\* :", "**Logic:**"),
        (r"Exam lock:", "Logic:"),
        (r"Exam Lock:", "Logic:"),
        (r"> \*\*Exam note:\*\*", "> **Note:**"),
        (r"\*\*Exam note:\*\*", "**Note:**"),
        (r"Exam note:", "Note:"),
        (r"Crucial Exam Fact", "Must-Score Fact"),
        (r"Accurate Exam Fact", "Correct Fact"),
        (r"High-Yield Exam Takeaway", "Must-Score Takeaway"),
        (r"High-Yield Exam Lock", "Must-Score Fact"),
        (r"Core Distinguishing Exam Fact", "Core Distinguishing Fact"),
        (r"Exam Significance", "Must-Score Significance"),
        (r"Exam Signature", "Must-Score Signature"),
        (r"Exam Signatures", "Must-Score Signatures"),
        (r"Exam Application", "Application"),
        (r"Exam Applications", "Applications"),
        (r"Exam Insights", "Key Insights"),
        (r"Exam Traps", "Common Traps"),
        (r"Exam Trap", "Common Trap"),
        (r"Exam Key", "Key Point"),
        (r"Exam Hierarchy", "Hierarchy"),
        (r"Exam Highlights", "Key Highlights"),
        (r"Exam Points", "Key Points"),
        (r"Exam Representative", "Classic Representative"),
        (r"Exam-Tested", "High-Yield"),
        (r"exam-tested", "high-yield"),
        (r"Exam Tested", "High-Yield"),
        (r"State Exam Locking Fact", "State Must-Score Fact"),
        (r"Formula Lock:", "Formula:"),
        (r"Agricultural Herbicide Lock:", "Agricultural Herbicide:"),
        (r"Absolute High-Yield Lock:", "Absolute High-Yield Fact:"),
        (r"Exact Gaseous Ratio Lock:", "Exact Gaseous Ratio:"),
        (r"Gaseous Ratio Lock:", "Gaseous Ratio:"),
        (r"Master Lock", "Master Fact"),
        (r"Anatomical Locks", "Anatomical Facts"),
        (r"Wildlife Locks", "Wildlife Facts"),
        (r"chemical locks", "chemical facts"),
        (r"Chemical locks", "Chemical facts"),
        (r"Organelle Locks", "Organelle Facts"),
        (r"Chromosome Locks", "Chromosome Facts"),
        (r"Cell Facts", "Cell Facts"),  # noop safety
        (r"Ghatnachakra High-Yield Locks", "Ghatnachakra High-Yield Facts"),
        (r"Ghatnachakra High-Yield Organelle Locks", "Ghatnachakra High-Yield Organelle Facts"),
        (r"Ghatnachakra Genetics & Chromosome Locks", "Ghatnachakra Genetics & Chromosome Facts"),
        (r"COVID Platform Locks", "COVID Platform Facts"),
        (r"Lucent lock:", "Lucent note:"),
        (r"\*Lucent lock\*:", "*Lucent note*:"),
        (r"Year \| Exam / Event", "Year | Event"),
        (r"Core Concept & Exam Significance", "Core Concept & Must-Score Significance"),
        (r"Primary Real-World Application / Exam Signature", "Primary Real-World Application / Signature"),
        (r"Primary Real-World & Exam Applications", "Primary Real-World Applications"),
        (r"Key Real-World Applications & Exam Traps", "Key Real-World Applications & Common Traps"),
        (r"Razor-Sharp Distinguishing Criteria & Exam Traps", "Razor-Sharp Distinguishing Criteria & Common Traps"),
        (r"Special Exam Facts & Applications", "Special Facts & Applications"),
        (r"India's Status & Crucial Exam Points", "India's Status & Crucial Points"),
        (r"Typical Locations & Exam Significance", "Typical Locations & Significance"),
        (r"recurring exam pair", "recurring pair"),
        (r"recurring exam trap", "recurring trap"),
        (r"classic exam examples", "classic examples"),
        (r"Frequently tested matching pair in state PSCs", "Frequently tested matching pair in state PSCs"),  # OK - no bare exam
        (r"\bexam pair\b", "confused pair"),
        (r"\bexam trap\b", "common trap"),
        (r"\bexam examples\b", "classic examples"),
        (r"\bexam fact\b", "key fact"),
        (r"\bExam fact\b", "Key fact"),
        (r"\bthe recurring exam\b", "the recurring"),
        (r"UPPCS Exam Hierarchy", "UPPCS Hierarchy"),
        (r"## Current Affairs & Must-Score", "## Current Affairs"),
    ]

    for a, b in reps:
        text2, c = re.subn(a, b, text)
        text = text2
        n += c

    # Remaining bare Exam (not inside KEEP placeholders) in teaching columns / prose
    # Avoid touching PYQ headings that say UPPCS (Pre) 2024 etc.
    def repl_exam(m):
        return "Must-Score"

    # "Exam" as standalone word in table headers / teaching (not year tags)
    text2, c = re.subn(r"(?<![A-Za-z])Exam(?![A-Za-z])", "Must-Score", text)
    # This is aggressive — restore Must-Score inside KEEP later; also fix bad double replacements
    text = text2
    n += c

    # Soften remaining Lock / Locks in teaching (not Lockjaw which is placeholder)
    text2, c = re.subn(r"\bLocks\b", "Facts", text)
    text = text2
    n += c
    text2, c = re.subn(r"\bLock\b", "Fact", text)
    text = text2
    n += c
    text2, c = re.subn(r"\blocks\b", "facts", text)
    text = text2
    n += c
    text2, c = re.subn(r"\block\b", "fact", text)
    text = text2
    n += c

    for key, tok in placeholders.items():
        text = text.replace(key, tok)

    # Fix over-eager Must-Score in official paper names if any slipped
    text = text.replace("Must-Score Lock", "Must-Score Fact")
    text = text.replace("Dense Facts · Zero Fluff", "Lucent / PW style")
    text = text.replace("Dense Facts", "Must-Score Facts")

    return text, n


GHAT_FILES = [
    "03_Nutrition_Diseases_and_Medicine.md",
    "04_Digestion_Respiration_and_Excretion.md",
    "05_Blood_Heart_and_Circulation.md",
]


def move_ghat_after_uppcs(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    # Collect contiguous early Ghatnachakra Extra Drill sections (before first Complete PYQ Bank)
    bank_m = re.search(r"^## Complete PYQ Bank", text, re.M)
    if not bank_m:
        return False
    bank_start = bank_m.start()

    # Find all ## Ghatnachakra Extra Drill before bank
    ghat_pat = re.compile(r"^## Ghatnachakra Extra Drill[^\n]*\n", re.M)
    matches = list(ghat_pat.finditer(text[:bank_start]))
    if not matches:
        return False

    # Extract each block from its heading to the next ## heading (or bank)
    blocks = []
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else bank_start
        # trim trailing whitespace before bank
        block = text[start:end].rstrip() + "\n\n"
        blocks.append(block)

    # Remove early blocks (reverse to keep indices valid)
    new_text = text
    for m in reversed(matches):
        # find end of this block
        idx = matches.index(m)
        start = m.start()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else bank_start
        new_text = new_text[:start] + new_text[end:]

    # Find insertion point: after UPPCS Complete PYQ Bank section ends
    # = start of next ## Complete PYQ Bank (UKPCS) OR ## Practice Zone OR ## Common Traps
    # First bank heading already at start of remaining content search
    m_bank = re.search(r"^## Complete PYQ Bank[^\n]*\n", new_text, re.M)
    if not m_bank:
        return False
    after_first = m_bank.end()
    # next major section after first Complete PYQ Bank
    next_m = re.search(
        r"^## (Complete PYQ Bank|Ghatnachakra Extra Drill|Practice Zone|Common Traps)",
        new_text[after_first:],
        re.M,
    )
    if not next_m:
        insert_at = len(new_text)
    else:
        insert_at = after_first + next_m.start()

    # If a Ghat already sits right after UPPCS bank, still OK to insert our moved blocks before UKPCS
    combined = "".join(blocks)
    # Avoid duplicate if somehow still present at insert point
    if combined.strip() and combined.strip() in new_text[insert_at : insert_at + len(combined) + 200]:
        return False

    new_text = new_text[:insert_at] + "\n" + combined + new_text[insert_at:]
    # Collapse excess blank lines
    new_text = re.sub(r"\n{4,}", "\n\n\n", new_text)
    path.write_text(new_text, encoding="utf-8", newline="\n")
    return True


def convert_practice_answers(path: Path) -> int:
    """Convert Practice Zone *Answer*: / Answer: lines into Show answer details."""
    text = path.read_text(encoding="utf-8")
    m = re.search(r"^## Practice Zone[^\n]*\n", text, re.M)
    if not m:
        return 0
    start = m.end()
    end_m = re.search(r"^## Common Traps", text[start:], re.M)
    end = start + end_m.start() if end_m else len(text)
    zone = text[start:end]
    if "<details>" in zone and "Show answer" in zone:
        return 0  # already proper

    # Pattern: numbered Q ending with *Answer*: **X**.... or Answer: **X**
    # Convert each question block
    def convert_zone(z: str) -> tuple[str, int]:
        count = 0
        # Match blocks like: N. **stem** ... options ... *Answer*: **B**....
        # Split on numbered items at line start
        parts = re.split(r"(?m)^(?=\d+\.\s)", z)
        out = [parts[0]] if parts and not re.match(r"\d+\.\s", parts[0] or "") else []
        items = parts[1:] if out else parts
        if not out and parts and re.match(r"\d+\.\s", parts[0] or ""):
            items = parts
            out = []

        for item in items:
            am = re.search(
                r"(?ms)^(?P<body>.*?)(?:^\s*\*Answer\*\s*:\s*(?P<ans>.*?)\s*$|^\s*Answer\s*:\s*(?P<ans2>.*?)\s*$)\s*\Z",
                item,
            )
            if not am:
                out.append(item)
                continue
            body = am.group("body").rstrip()
            ans = (am.group("ans") or am.group("ans2") or "").strip()
            # Promote "N. **stem**" to **QN.** style lightly
            body2 = re.sub(r"^(\d+)\.\s+", r"**Q\1.** ", body, count=1)
            # Strip trailing blank
            block = (
                f"{body2}\n\n"
                f"<details>\n"
                f"<summary>Show answer</summary>\n\n"
                f"**Logic:** Recall the Must-Score fact for this stem; eliminate unit/concept twin traps.\n\n"
                f"**Ans:** {ans}\n\n"
                f"</details>\n\n"
            )
            out.append(block)
            count += 1
        return "".join(out), count

    new_zone, n = convert_zone(zone)
    if n:
        text = text[:start] + new_zone + text[end:]
        path.write_text(text, encoding="utf-8", newline="\n")
    return n


def main():
    scrub_total = 0
    for p in sorted(ROOT.glob("[0-9][0-9]_*.md")):
        t = p.read_text(encoding="utf-8")
        nt, n = scrub_exam_lock(t)
        if nt != t:
            p.write_text(nt, encoding="utf-8", newline="\n")
            scrub_total += n
            print("SCRUB", p.name, n)

    for name in GHAT_FILES:
        p = ROOT / name
        ok = move_ghat_after_uppcs(p)
        print("GHAT_MOVE", name, ok)

    for name in [
        "09_Physics_Fundamentals_and_Measurement.md",
        "10_Mechanics_and_Properties_of_Matter.md",
        "12_Light_Optics_and_Laser.md",
        "11_Energy_Heat_and_Thermal.md",
        "13_Sound_and_Wave_Motion.md",
        "14_Electricity_and_Magnetism.md",
        "15_Electronics_Semiconductors_and_Computers.md",
        "16_Nuclear_and_Atomic_Physics.md",
        "17_Scientists_Discoveries_and_Applications.md",
    ]:
        n = convert_practice_answers(ROOT / name)
        print("PRACTICE", name, n)

    print("SCRUB_TOTAL", scrub_total)


if __name__ == "__main__":
    main()
