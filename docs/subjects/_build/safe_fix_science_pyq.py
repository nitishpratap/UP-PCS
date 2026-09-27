#!/usr/bin/env python3
"""Safe PYQ tag split + in-place Correct Answer → Logic/Ans for Science (and leftovers).

Rules:
- Tag line is exam meta only (Geography pill style); stem on following lines.
- Nested parentheses in exam strings are balanced (U.P.P.C.S. (Pre) 1991).
- Each <details> is converted from its OWN Correct Answer / bullets — no cross-Q matching.
- First explanation bullet = Logic; option/label = Ans.
- 'See above' → Logic omitted or short link line; Ans from option text.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects")

SUBJECTS = {
    "science and technology": "ST",
    # Economy/Census/UP already tagged; only convert leftover Correct Answer blocks
    "economy": "EC",
    "census and urbanisation": "CU",
    "up special": "UP",
}

DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)

# Bold Q line: **Q…** possibly with stem after closing **
Q_LINE = re.compile(r"(?m)^(\*\*)([^*\n]+)(\*\*)([^\n]*)\n?")


def one_liner(text: str, limit: int = 220) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\*\*?|__", "", text)
    text = re.sub(r"\s+", " ", text).strip(" -–—\t;")
    text = re.sub(r"^\(?[A-Ea-e*]\)?[.\)]\s*", "", text)
    parts = re.split(r"(?<=[.!?])\s+", text)
    s = parts[0].strip() if parts else text
    if len(s) > limit:
        s = s[: limit - 1].rstrip() + "…"
    return s


def balanced_paren_group(s: str, start: int) -> tuple[str, int] | None:
    """If s[start]=='(', return (inside_including_parens, end_index_exclusive)."""
    if start >= len(s) or s[start] != "(":
        return None
    depth = 0
    for i in range(start, len(s)):
        if s[i] == "(":
            depth += 1
        elif s[i] == ")":
            depth -= 1
            if depth == 0:
                return s[start : i + 1], i + 1
    return None


def normalize_exam(exam: str) -> str:
    exam = exam.strip()
    reps = [
        ("U.P.P.C.S.", "UPPCS"),
        ("U.P.P.S.C.", "UPPSC"),
        ("U.P. P.C.S.", "UPPCS"),
        ("U.P.P.C.S", "UPPCS"),
        ("U.P. R.O./A.R.O.", "UP RO/ARO"),
        ("U.P.R.O./A.R.O.", "UP RO/ARO"),
        ("U.P. Lower Sub.", "UP Lower Sub"),
        ("U.P. U.D.A./L.D.A.", "UP UDA/LDA"),
    ]
    for a, b in reps:
        exam = exam.replace(a, b)
    exam = re.sub(r"\s+", " ", exam).strip(" .")
    return exam


def clean_tag(header: str, prefix: str) -> str:
    h = header.strip()
    h = re.split(r"\s+[—–]\s+", h, maxsplit=1)[0].strip()  # em/en dash topic hint
    # Don't split on ASCII hyphen inside years — only " - " topic hints
    h = re.split(r"\s+-\s+(?=[A-Z])", h, maxsplit=1)[0].strip()

    m = re.match(r"(?i)^Q\s*[-–—]?\s*(?P<pre>[A-Z]{0,4})?\s*(?P<num>\d+[A-Za-z]?)\.?\s*(?P<rest>.*)$", h)
    if not m:
        return h
    num = m.group("num")
    pre = (m.group("pre") or "").upper()
    rest = (m.group("rest") or "").strip()

    exam = ""
    if rest.startswith("("):
        grp = balanced_paren_group(rest, 0)
        if grp:
            inside, end = grp
            exam = inside[1:-1].strip()
            rest = rest[end:].strip()
            if rest and not exam:
                exam = rest
            elif rest and len(rest) < 40 and not rest.endswith("?"):
                # trailing year outside? rare
                if re.match(r"^\d{4}", rest):
                    exam = f"{exam} {rest}".strip()
        else:
            exam = rest.strip("()")
    else:
        exam = rest

    exam = normalize_exam(exam)
    if not pre and exam:
        pre = prefix
    if pre:
        return f"Q-{pre}{num}. {exam}".strip() if exam else f"Q-{pre}{num}."
    return f"Q{num}. {exam}".strip() if exam else f"Q{num}."


def extract_options_before(text_before_details: str) -> dict[str, str]:
    opts: dict[str, str] = {}
    for pat in [
        r"(?m)^\s*([A-E])[.)]\s+(.+?)\s*$",
        r"(?m)^\s*[-*]\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        r"(?m)^\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        # inline (a) text (b) text
        r"(?i)\(([a-e])\)\s*([^(\n]+?)(?=\s*\([a-e]\)|$)",
    ]:
        for m in re.finditer(pat, text_before_details):
            let = m.group(1).upper()
            txt = re.sub(r"\s+", " ", m.group(2)).strip(" .;")
            if let not in opts and txt and len(txt) < 200:
                opts[let] = txt
    return opts


def parse_correct(body: str) -> tuple[str | None, str]:
    patterns = [
        r"(?is)\*\*Correct Answer:?\*\*\s*\*\*([A-Ea-e*]+)\*\*\s*\(([^)]*)\)",
        r"(?is)\*\*Correct Answer:?\*\*\s*\*\*([A-Ea-e*]+)\*\*",
        r"(?is)\*\*Correct Answer:?\*\*\s*\(([A-Ea-e*]+)\)\s*[—–:\-]*\s*([^\n<]*)",
        r"(?is)\*\*Correct Answer:?\*\*\s*([A-Ea-e*]+)\s*\(([^)]*)\)",
        r"(?is)\*\*Correct Answer:?\*\*\s*([A-Ea-e*]+)\b\s*[—–:\-]*\s*([^\n<]*)",
        r"(?is)Correct Answer:\s*\*\*([A-Ea-e*]+)\*\*\s*\(([^)]*)\)",
        r"(?is)Correct Answer:\s*\(([A-Ea-e*]+)\)\s*[—–:\-]*\s*([^\n<]*)",
        r"(?is)Correct Answer:\s*([A-Ea-e*]+)\b\s*[—–:\-]*\s*([^\n<]*)",
    ]
    for pat in patterns:
        m = re.search(pat, body)
        if m:
            raw = m.group(1).strip()
            label = (m.group(2) if m.lastindex and m.lastindex >= 2 else "") or ""
            label = label.strip(" .:*)")
            if raw == "*" or "," in raw:
                return "*", label
            lm = re.search(r"[A-Ea-e]", raw)
            if lm:
                return lm.group(0).upper(), label
    return None, ""


def explanation_bullets(body: str) -> list[str]:
    bullets = []
    sec = re.search(
        r"(?is)(?:\*\*)?(?:Must-Score Points?\s*&?\s*Explanation|Detailed Explanation|Explanation)(?:\*\*)?\s*:?\s*(.*)",
        body,
    )
    region = sec.group(1) if sec else ""
    if not region:
        # lines after Correct Answer
        region = re.sub(r"(?is).*?Correct Answer:[^\n]*\n", "", body, count=1)
    for m in re.finditer(r"(?m)^\s*[-•]\s+(.+)$", region):
        b = m.group(1).strip()
        if re.match(r"(?i)correct answer|must-score|detailed explanation", b):
            continue
        bullets.append(b)
    # wrapped dump: lines starting with "- " that are mid-sentence continuations already captured
    if not bullets:
        raw = re.sub(r"<[^>]+>", " ", region)
        raw = re.sub(r"\s+", " ", raw).strip()
        if raw:
            bullets.append(raw)
    return bullets


def is_see_above(text: str) -> bool:
    return bool(re.search(r"(?i)see the explanation of above|see above question|^see above", text))


def upgrade_details(body: str, opts: dict[str, str]) -> str | None:
    if not re.search(r"Correct Answer", body, re.I):
        return None
    letter, label = parse_correct(body)
    bullets = explanation_bullets(body)
    real = [b for b in bullets if not is_see_above(b)]

    if letter == "*":
        expl = one_liner(real[0]) if real else (label or "See statement key.")
        return f"**Logic:** {expl}\n\n**Ans:** {expl}\n"

    if not letter:
        return None

    opt = opts.get(letter, "")
    if label and not is_see_above(label):
        ans = one_liner(label, 120)
    elif opt:
        ans = one_liner(opt, 120)
    elif real:
        # pull a short noun phrase — keep first bullet shortened hard
        ans = one_liner(real[0], 80)
    else:
        ans = f"Option {letter}."

    logic = ""
    if real:
        logic = one_liner(real[0])
        # If first bullet is basically the ans label, and a second bullet adds distinction, keep first as logic still (it explains)
        if logic.lower().rstrip(".") == ans.lower().rstrip(".") and len(real) > 1:
            logic = one_liner(real[0])  # still fine — explanatory sentence usually longer
    elif is_see_above(" ".join(bullets)) and opt:
        logic = f"Same teaching key as the linked stem above; answer is {opt}."
    elif opt:
        logic = f"Keyed option is {opt}."

    if logic and logic.lower().rstrip(".") == ans.lower().rstrip(".") and len(logic) < 40:
        # too redundant — drop logic
        logic = ""

    parts = []
    if logic:
        parts.append(f"**Logic:** {logic}")
        parts.append("")
    parts.append(f"**Ans: {letter}.** {ans}")
    parts.append("")
    return "\n".join(parts)


def fix_tags(text: str, prefix: str, do_retag: bool) -> tuple[str, int]:
    if not do_retag:
        return text, 0
    n = 0

    def repl(m: re.Match) -> str:
        nonlocal n
        header = m.group(2)
        rest = (m.group(4) or "").strip()
        # Skip non-question bolds
        if not re.match(r"(?i)^Q\s*[-–—A-Z0-9]", header.strip()):
            return m.group(0)
        # Skip Extra Drill already fine
        new_h = clean_tag(header, prefix)
        rest = re.sub(r"^[—–\-:\s]+", "", rest).strip()
        # Drop short topic hints glued after tag
        if rest and len(rest) < 70 and not re.search(
            r"\?$|^(With reference|Which|Consider|Match|Assertion|Given|The |Who |What |How |When |Where |Select |Arrange |Double|Change |Nitrogen|In a |Long )",
            rest,
            re.I,
        ):
            if not re.search(r"\b(is|are|was|were|called|means)\b", rest, re.I):
                rest = ""
        if rest:
            n += 1
            return f"**{new_h}**\n\n{rest}\n"
        if new_h != header.strip():
            n += 1
        return f"**{new_h}**\n"

    return Q_LINE.sub(repl, text), n


def fix_file(path: Path, prefix: str, do_retag: bool) -> tuple[int, int]:
    text = path.read_text(encoding="utf-8")
    text2, tag_n = fix_tags(text, prefix, do_retag)

    ans_n = 0

    # Process details with preceding option context
    pieces = []
    last = 0
    for m in DETAILS.finditer(text2):
        pieces.append(text2[last : m.start()])
        before = text2[max(0, m.start() - 800) : m.start()]
        # limit to current question: after last **Q
        qpos = before.rfind("**Q")
        if qpos >= 0:
            before = before[qpos:]
        opts = extract_options_before(before)
        head, body, tail = m.group(1), m.group(2), m.group(3)
        new_body = upgrade_details(body, opts)
        if new_body:
            ans_n += 1
            pieces.append(f"{head}\n{new_body}{tail}")
        else:
            pieces.append(m.group(0))
        last = m.end()
    pieces.append(text2[last:])
    text3 = "".join(pieces)
    text3 = re.sub(r"\n{3,}", "\n\n", text3)

    if text3 != text:
        path.write_text(text3.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return tag_n, ans_n


def main() -> None:
    tot_t = tot_a = 0
    for folder, prefix in SUBJECTS.items():
        do_retag = folder == "science and technology"
        for path in sorted((ROOT / folder).rglob("*.md")):
            if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
                continue
            t, a = fix_file(path, prefix, do_retag)
            if t or a:
                print(f"{folder}/{path.name}: tags={t} answers={a}")
                tot_t += t
                tot_a += a
    print(f"\nTOTAL tags={tot_t} answers={tot_a}")

    for folder in SUBJECTS:
        in_d = unbal = 0
        for path in (ROOT / folder).rglob("*.md"):
            t = path.read_text(encoding="utf-8")
            for m in DETAILS.finditer(t):
                if re.search(r"Correct Answer", m.group(2), re.I):
                    in_d += 1
            for line in t.splitlines():
                if line.startswith("**Q") and line.count("(") != line.count(")"):
                    unbal += 1
        print(f"  {folder}: Correct Answer in details={in_d}, unbalanced tags={unbal}")


if __name__ == "__main__":
    main()
