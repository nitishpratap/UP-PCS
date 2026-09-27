#!/usr/bin/env python3
"""Normalize PYQ tags + Show-answer quality for Census, Science, Economy, UP Special.

1) Tag line = exam meta only (Geography-style pill), stem on following lines.
2) Convert Correct Answer / Detailed Explanation dumps → Logic + Ans one-liners.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects")

SUBJECTS = {
    "census and urbanisation": "CU",
    "science and technology": "ST",
    "economy": "EC",
    "up special": "UP",
}

# **Q....** possibly with stem on same line
Q_LINE = re.compile(
    r"(?m)^(\*\*)(?P<header>"
    r"(?:Q\s*[-–—]?\s*[A-Z]{0,4}\s*\d+[A-Za-z]?|"
    r"Q\d+[A-Za-z]?|"
    r"PYQ|"
    r"Inline PYQ|"
    r"Practice Q\d*"
    r")[^*\n]*?)"
    r"(\*\*)"
    r"(?P<rest>[^\n]*)\n?"
)

DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)

CORRECT_ANS = re.compile(
    r"(?is)\*\*Correct Answer:?\*\*\s*(?:\*\*)?(?P<letter>[A-E])(?:\*\*)?"
    r"(?:\s*[\(—–:-]\s*(?P<label>[^\n*<]+))?"
)
DETAILED = re.compile(
    r"(?is)\*\*Detailed Explanation:?\*\*\s*(?P<body>.*?)(?=\Z|\*\*(?:Ans|Logic|A/R logic|Correct))"
)
BULLET = re.compile(r"(?m)^\s*[-•*]\s+(?P<b>.+)$")


def clean_header(header: str, prefix: str) -> str:
    h = header.strip()
    # Drop topic hint after em/en dash: "**Q1. UPPCS (Pre) 2019** — CSR..."
    h = re.split(r"\s+[—–-]\s+", h, maxsplit=1)[0].strip()
    # Normalize **Q22. (U.P.P.C.S. (Pre) 1991)** → Q-ST22. UPPCS (Pre) 1991
    m = re.match(
        r"(?i)^Q\s*[-–—]?\s*(?P<pre>[A-Z]{0,4})?\s*(?P<num>\d+[A-Za-z]?)\.?\s*"
        r"(?:\((?P<paren>[^)]+)\))?\s*(?P<tail>.*)$",
        h,
    )
    if m:
        num = m.group("num")
        pre = (m.group("pre") or "").upper()
        paren = (m.group("paren") or "").strip()
        tail = (m.group("tail") or "").strip()
        # Prefer existing letter prefix (ST/EC/GC/CU/UP) else subject prefix for Extra-style
        if not pre:
            # Keep plain Q1 for Complete Bank unless paren-heavy science style needs ST
            if paren:
                pre = prefix
            else:
                pre = ""
        exam = paren or tail
        exam = re.sub(r"\s+", " ", exam)
        exam = exam.replace("U.P.P.C.S.", "UPPCS").replace("U.P. R.O./A.R.O.", "UP RO/ARO")
        exam = exam.replace("U.P.R.O./A.R.O.", "UP RO/ARO").replace("U.P. Lower Sub.", "UP Lower Sub")
        exam = re.sub(r"\s+[—–-]\s+.*$", "", exam).strip(" .")
        if pre:
            return f"Q-{pre}{num}. {exam}".strip() if exam else f"Q-{pre}{num}."
        return f"Q{num}. {exam}".strip() if exam else f"Q{num}."
    # Fallback: strip trailing topic after dash inside header
    h = re.split(r"\s+[—–-]\s+", h, maxsplit=1)[0].strip()
    return h


def one_liner(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip(" -–—\t")
    # Keep first sentence-ish
    parts = re.split(r"(?<=[.!?])\s+", text)
    s = parts[0].strip() if parts else text
    if len(s) > 220:
        s = s[:217].rstrip() + "…"
    return s


def upgrade_details(body: str) -> str:
    body = body.strip()
    # Already Geography-style?
    if re.search(r"(?m)^\*\*Ans:", body) and not re.search(r"Correct Answer|Detailed Explanation", body, re.I):
        # Tighten overly long Logic paragraphs (>2 sentences) lightly
        def trim_logic(m: re.Match) -> str:
            label = m.group(1)
            content = one_liner(m.group(2))
            return f"**{label}:** {content}\n"

        body2 = re.sub(
            r"(?m)^\*\*(Logic|A/R logic):\*\*\s*(.+?)(?=\n\n|\n\*\*Ans:|\Z)",
            trim_logic,
            body,
            flags=re.S,
        )
        return body2.strip() + "\n"

    m = CORRECT_ANS.search(body)
    if not m:
        # Soft: Ans: B without period / Correct Answer: B
        m2 = re.search(r"(?i)\*\*Ans:\*\*\s*([A-E])\b(?:\.\s*)?(?P<label>[^\n]*)", body)
        m3 = re.search(r"(?i)Correct Answer:\s*\*?([A-E])\b(?:\.\s*)?(?P<label>[^\n]*)", body)
        if m2:
            letter, label = m2.group(1).upper(), (m2.group("label") or "").strip(" .:*")
        elif m3:
            letter, label = m3.group(1).upper(), (m3.group("label") or "").strip(" .:*")
        else:
            return body if body.endswith("\n") else body + "\n"
    else:
        letter = m.group("letter").upper()
        label = (m.group("label") or "").strip(" .:*")

    det = DETAILED.search(body)
    bullets: list[str] = []
    if det:
        bullets = [b.group("b").strip() for b in BULLET.finditer(det.group("body"))]
        if not bullets:
            raw = re.sub(r"<[^>]+>", "", det.group("body"))
            raw = re.sub(r"\s+", " ", raw).strip()
            if raw:
                bullets = [raw]

    # Build Ans sentence
    if label and not label.lower().startswith("detailed"):
        ans_sent = one_liner(label)
    elif bullets:
        ans_sent = one_liner(re.sub(r"^\*\*?|\*\*?$", "", bullets[0]))
    else:
        ans_sent = f"Option {letter}."

    logic_sent = ""
    if len(bullets) >= 2:
        logic_sent = one_liner(re.sub(r"^\*\*?|\*\*?$", "", bullets[1]))
    elif len(bullets) == 1 and label:
        # single bullet already used as Ans; try rest of body for trap
        rest = re.sub(r"(?is)\*\*Correct Answer:?\*\*.*?(?=\*\*Detailed|\Z)", "", body)
        rest = DETAILED.sub("", rest)
        rest = re.sub(r"<[^>]+>", " ", rest)
        rest = re.sub(r"\s+", " ", rest).strip()
        if rest and rest.lower() not in ans_sent.lower():
            logic_sent = one_liner(rest)

    # Prefer Logic then Ans (bank / drill rule)
    out = []
    if logic_sent and logic_sent.lower() not in ans_sent.lower():
        out.append(f"**Logic:** {logic_sent}")
        out.append("")
    out.append(f"**Ans: {letter}.** {ans_sent}")
    out.append("")
    return "\n".join(out)


def fix_file(path: Path, prefix: str) -> tuple[int, int]:
    text = path.read_text(encoding="utf-8")
    orig = text
    tag_fixes = 0
    ans_fixes = 0

    def repl_q(m: re.Match) -> str:
        nonlocal tag_fixes
        header = m.group("header")
        rest = m.group("rest") or ""
        new_h = clean_header(header, prefix)
        # Strip leading colon/dash leftovers in rest
        rest = rest.strip()
        rest = re.sub(r"^[—–\-:\s]+", "", rest).strip()
        # If rest looks like a topic hint only (short, no question mark / options), drop it
        if rest and len(rest) < 80 and not re.search(r"\?$|^(With reference|Which|Consider|Match|Assertion|Given)", rest, re.I):
            # topic hint — discard from tag line
            if not re.search(r"\b(is|are|was|were|means|includes|among)\b", rest, re.I) or "—" in m.group(0) or " - " in m.group(0):
                # keep if it looks like a real stem start
                if re.match(r"^(With reference|Which|Consider|Match|Assertion|Given|The |Who |What |How |When |Where |Select |Arrange |India |Double|Change |Nitrogen)", rest, re.I):
                    pass
                else:
                    rest = ""
        changed = (new_h != header.strip()) or bool(rest) or (m.group(0).find("\n") == -1 and rest == "")
        # Always ensure blank line after tag when stem follows
        if rest:
            tag_fixes += 1
            return f"**{new_h}**\n\n{rest}\n"
        if new_h != header.strip():
            tag_fixes += 1
        return f"**{new_h}**\n"

    text2 = Q_LINE.sub(repl_q, text)

    def repl_details(m: re.Match) -> str:
        nonlocal ans_fixes
        head, body, tail = m.group(1), m.group(2), m.group(3)
        if re.search(r"Correct Answer|Detailed Explanation", body, re.I):
            new_body = upgrade_details(body)
            if new_body.strip() != body.strip():
                ans_fixes += 1
            return f"{head}\n{new_body.rstrip()}\n\n{tail}"
        # Tighten long Logic in census/up special if multi-sentence wall
        if re.search(r"(?m)^\*\*(?:Logic|A/R logic):\*\*", body):
            new_body = upgrade_details(body)
            if new_body.strip() != body.strip():
                ans_fixes += 1
                return f"{head}\n{new_body.rstrip()}\n\n{tail}"
        return m.group(0)

    text3 = DETAILS.sub(repl_details, text2)

    if text3 != orig:
        text3 = text3.replace("\r\n", "\n")
        # collapse 3+ blank lines
        text3 = re.sub(r"\n{3,}", "\n\n", text3)
        path.write_text(text3, encoding="utf-8", newline="\n")
    return tag_fixes, ans_fixes


def main() -> None:
    total_t = total_a = files = 0
    for folder, prefix in SUBJECTS.items():
        d = ROOT / folder
        if not d.is_dir():
            continue
        for path in sorted(d.rglob("*.md")):
            if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
                continue
            t, a = fix_file(path, prefix)
            if t or a:
                files += 1
                total_t += t
                total_a += a
                rel = path.relative_to(ROOT)
                print(f"{rel}: tags={t} answers={a}")
    print(f"\nDone. Files touched={files}, tag fixes={total_t}, answer upgrades={total_a}")


if __name__ == "__main__":
    main()
