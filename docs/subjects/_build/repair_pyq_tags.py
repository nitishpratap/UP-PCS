#!/usr/bin/env python3
"""Repair truncated PYQ tags + trailing ) on Ans lines; finish remaining answer upgrades safely."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS")
SUB = ROOT / "docs" / "subjects"

SUBJECTS = {
    "census and urbanisation": "CU",
    "science and technology": "ST",
    "economy": "EC",
    "up special": "UP",
}

BROKEN_TAG = re.compile(
    r"(?m)^(\*\*)(Q-[A-Z]{1,4}\d+\.\s+)([^*\n]*?)(\*\*)\s*$"
)
# unbalanced parens in tag
def unbalanced(s: str) -> bool:
    return s.count("(") != s.count(")")


def git_show(rel: str) -> str | None:
    try:
        out = subprocess.check_output(
            ["git", "show", f"HEAD:{rel.replace(chr(92), '/')}"],
            cwd=ROOT,
            stderr=subprocess.DEVNULL,
        )
        return out.decode("utf-8", errors="replace")
    except Exception:
        return None


def normalize_exam(exam: str) -> str:
    exam = exam.strip()
    exam = exam.replace("U.P.P.C.S.", "UPPCS").replace("U.P.P.S.C.", "UPPSC")
    exam = exam.replace("U.P. R.O./A.R.O.", "UP RO/ARO").replace("U.P.R.O./A.R.O.", "UP RO/ARO")
    exam = exam.replace("U.P. Lower Sub.", "UP Lower Sub").replace("U.P. U.D.A./L.D.A.", "UP UDA/LDA")
    exam = exam.replace("U.P. P.C.S.", "UPPCS").replace("U.P.P.C.S", "UPPCS")
    exam = re.sub(r"\s+", " ", exam).strip(" .")
    return exam


def extract_orig_map(git_text: str, prefix: str) -> list[tuple[str, str, str]]:
    """Return list of (qnum, clean_header, stem_prefix)."""
    rows = []
    for m in re.finditer(
        r"(?m)^\*\*(Q\s*[-–—]?\s*[A-Z]{0,4}\s*\d+[A-Za-z]?)\.?\s*(.*?)\*\*\s*(.*)$",
        git_text,
    ):
        raw_q = m.group(1)
        mid = m.group(2).strip()
        stem = (m.group(3) or "").strip()
        num_m = re.search(r"(\d+[A-Za-z]?)$", raw_q.replace(" ", ""))
        if not num_m:
            num_m = re.search(r"(\d+[A-Za-z]?)", raw_q)
        if not num_m:
            continue
        num = num_m.group(1)
        # mid may be "(U.P.P.C.S. (Pre) 1991)" or "UPPCS Pre 2018"
        exam = mid
        if exam.startswith("(") and exam.endswith(")"):
            exam = exam[1:-1]
        # balance nested — strip outer only once already done
        exam = normalize_exam(exam)
        # Drop topic hints after dash in mid
        exam = re.split(r"\s+[—–-]\s+", exam, maxsplit=1)[0].strip()
        header = f"Q-{prefix}{num}. {exam}".strip() if exam else f"Q-{prefix}{num}."
        stem_key = re.sub(r"\s+", " ", stem)[:60].lower()
        rows.append((num, header, stem_key))
    return rows


def repair_file(path: Path, prefix: str, rel: str) -> int:
    text = path.read_text(encoding="utf-8")
    git_text = git_show(rel)
    if not git_text:
        return 0
    rows = extract_orig_map(git_text, prefix)
    if not rows:
        return 0

    lines = text.splitlines(keepends=True)
    fixed = 0
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^(\*\*)(Q-[A-Z]{1,4}(\d+[A-Za-z]?)\.\s+)([^*\n]*)(\*\*)\s*\r?\n?$", line)
        if not m:
            i += 1
            continue
        num = m.group(3)
        inside = m.group(2) + m.group(4)  # Q-ST22. UPPCS (Pre
        full_inside = m.group(2) + m.group(4)
        if not unbalanced("**" + full_inside + "**") and not full_inside.rstrip().endswith("(") and "(Pre" not in full_inside[-8:]:
            # still check unbalanced on visible text without stars
            if not unbalanced(full_inside):
                i += 1
                continue
        # stem from next non-empty line
        stem_key = ""
        for j in range(i + 1, min(i + 6, len(lines))):
            s = lines[j].strip()
            if not s or s.startswith("<") or s.startswith("A.") or s.startswith("|"):
                continue
            stem_key = re.sub(r"\s+", " ", s)[:60].lower()
            break
        # find best orig row
        candidates = [r for r in rows if r[0] == num]
        best = None
        if stem_key and candidates:
            for r in candidates:
                if r[2] and (r[2][:30] in stem_key or stem_key[:30] in r[2]):
                    best = r
                    break
        if best is None and len(candidates) == 1:
            best = candidates[0]
        if best is None and candidates:
            # pick candidate whose header starts like truncated text
            trunc = full_inside.rstrip("*").strip()
            for r in candidates:
                if r[1].startswith(trunc[: max(12, len(trunc) - 2)]) or trunc[:20] in r[1]:
                    best = r
                    break
            if best is None:
                best = candidates[0]
        if best:
            lines[i] = f"**{best[1]}**\n"
            fixed += 1
        i += 1

    new = "".join(lines)
    # Fix Ans trailing )
    new2, n_paren = re.subn(
        r"(?m)^(\*\*Ans:\s*[A-E]\.\*\*\s+)([^(\n]+?)\)\s*$",
        r"\1\2",
        new,
    )
    # Fix empty Ans only lines by leaving them — later pass
    # Remaining Correct Answer inside <details>
    def up_details(m: re.Match) -> str:
        head, body, tail = m.group(1), m.group(2), m.group(3)
        if not re.search(r"Correct Answer|Detailed Explanation", body, re.I):
            # fix Watson and Crick)
            body2 = re.sub(
                r"(?m)^(\*\*Ans:\s*[A-E]\.\*\*\s+)(.+?)\)\s*$",
                r"\1\2",
                body,
            )
            return f"{head}{body2}{tail}"
        cm = re.search(
            r"(?is)\*\*Correct Answer:?\*\*\s*(?:\*\*)?([A-E])(?:\*\*)?(?:\s*[\(—–:-]\s*([^\n*<]+))?",
            body,
        )
        if not cm:
            return m.group(0)
        letter = cm.group(1).upper()
        label = (cm.group(2) or "").strip().strip("().: ")
        bullets = re.findall(r"(?m)^\s*[-•*]\s+(.+)$", body)
        ans = label or (bullets[0] if bullets else f"Option {letter}.")
        ans = re.sub(r"\s+", " ", ans).strip().rstrip(")")
        # first sentence
        ans = re.split(r"(?<=[.!?])\s+", ans)[0]
        logic = ""
        if len(bullets) >= 2:
            logic = re.sub(r"\s+", " ", bullets[1]).strip()
            logic = re.split(r"(?<=[.!?])\s+", logic)[0]
        parts = []
        if logic and logic.lower() not in ans.lower():
            parts += [f"**Logic:** {logic}", ""]
        parts += [f"**Ans: {letter}.** {ans}", ""]
        return f"{head}\n" + "\n".join(parts) + f"\n{tail}"

    new3 = re.sub(
        r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)",
        up_details,
        new2,
    )
    # HTML Correct Answer in UP Special dumps inside details-like blocks
    new4 = re.sub(
        r"(?i)<b>Correct Answer:\s*\(([A-E])\)\s*([^<]*)</b>\s*<br\s*/?>",
        lambda m: f"\n\n**Ans: {m.group(1).upper()}.** {m.group(2).strip()}\n\n",
        new3,
    )

    if new4 != text:
        path.write_text(new4.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return fixed + n_paren


def main() -> None:
    total = 0
    for folder, prefix in SUBJECTS.items():
        d = SUB / folder
        for path in sorted(d.rglob("*.md")):
            if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
                continue
            rel = str(path.relative_to(ROOT)).replace("\\", "/")
            n = repair_file(path, prefix, rel)
            if n:
                total += n
                print(f"repaired {path.relative_to(SUB)} ({n})")
    # recount broken
    broken = 0
    for folder in SUBJECTS:
        for path in (SUB / folder).rglob("*.md"):
            for line in path.read_text(encoding="utf-8").splitlines():
                if line.startswith("**Q") and line.count("(") != line.count(")"):
                    broken += 1
    print(f"\nTag repairs applied: {total}")
    print(f"Remaining unbalanced Q-tags: {broken}")


if __name__ == "__main__":
    main()
