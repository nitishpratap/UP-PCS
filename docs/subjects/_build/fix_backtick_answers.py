#!/usr/bin/env python3
"""Convert backtick Ans.(x) + Logic: blocks; retag restored physics files."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology")
PREFIX = "ST"

DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)
Q_LINE = re.compile(r"(?m)^(\*\*)([^*\n]+)(\*\*)([^\n]*)\n?")


def load_reorder():
    spec = importlib.util.spec_from_file_location(
        "fix",
        Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\_build\fix_post_practice_theory.py"),
    )
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def one_liner(text: str, limit: int = 220) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[*_`]+", "", text)
    text = re.sub(r"\s+", " ", text).strip(" -–—\t;")
    parts = re.split(r"(?<=[.!?])\s+", text)
    s = parts[0].strip() if parts else text
    if len(s) > limit:
        s = s[: limit - 1].rstrip() + "…"
    return s


def balanced_paren(s: str, start: int):
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
    for a, b in [
        ("U.P.P.C.S.", "UPPCS"),
        ("U.P.P.S.C.", "UPPSC"),
        ("U.P. P.C.S.", "UPPCS"),
        ("U.P. R.O./A.R.O.", "UP RO/ARO"),
        ("U.P.R.O./A.R.O.", "UP RO/ARO"),
        ("U.P. Lower Sub.", "UP Lower Sub"),
    ]:
        exam = exam.replace(a, b)
    return re.sub(r"\s+", " ", exam).strip(" .")


def clean_tag(header: str) -> str:
    h = header.strip()
    h = re.split(r"\s+[—–]\s+", h, maxsplit=1)[0].strip()
    m = re.match(
        r"(?i)^Q\s*[-–—]?\s*(?P<pre>[A-Z]{0,4})?\s*(?P<num>\d+[A-Za-z]?)\.?\s*(?P<rest>.*)$",
        h,
    )
    if not m:
        return h
    num, pre, rest = m.group("num"), (m.group("pre") or "").upper(), (m.group("rest") or "").strip()
    exam = ""
    if rest.startswith("("):
        grp = balanced_paren(rest, 0)
        if grp:
            inside, end = grp
            exam = inside[1:-1].strip()
            tail = rest[end:].strip()
            if re.match(r"^\d{4}", tail):
                exam = f"{exam} {tail}".strip()
        else:
            exam = rest.strip("()")
    else:
        exam = rest
    exam = normalize_exam(exam)
    if not pre and exam:
        pre = PREFIX
    if pre:
        return f"Q-{pre}{num}. {exam}".strip() if exam else f"Q-{pre}{num}."
    return f"Q{num}. {exam}".strip() if exam else f"Q{num}."


def extract_options(before: str) -> dict[str, str]:
    opts: dict[str, str] = {}
    for pat in [
        r"(?m)^\s*([A-E])[.)]\s+(.+?)\s*$",
        r"(?m)^\s*[-*]\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        r"(?m)^\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        r"(?i)\(([a-e])\)\s*([^(\n]+?)(?=\s*\([a-e]\)|$)",
    ]:
        for m in re.finditer(pat, before):
            let = m.group(1).upper()
            txt = re.sub(r"\s+", " ", m.group(2)).strip(" .;")
            if let not in opts and txt and len(txt) < 220:
                opts[let] = txt
    return opts


def parse_backtick_or_plain(body: str) -> tuple[str | None, str]:
    """Return letter, existing logic prose."""
    letter = None
    m = re.search(
        r"(?i)Correct Answer:?\*?\*?\s*`+Ans\.\s*\(([A-Ea-e*]+)\)`+",
        body,
    )
    if not m:
        m = re.search(r"(?i)Correct Answer:?\*?\*?\s*`Ans\.\s*\(([A-Ea-e*]+)\)`", body)
    if not m:
        m = re.search(r"(?i)Correct Answer:?\*?\*?\s*Ans\.\s*\(([A-Ea-e*]+)\)", body)
    if not m:
        # plain (a) same-line
        m = re.search(r"(?i)\*\*Correct Answer:?\*\*\s*\(([A-Ea-e*]+)\)", body)
    if m:
        raw = m.group(1)
        if "*" in raw or "&" in raw:
            letter = "*"
        else:
            lm = re.search(r"[A-Ea-e]", raw)
            letter = lm.group(0).upper() if lm else None

    logic = ""
    lm = re.search(r"(?is)\*\*Logic:\*\*\s*(.*?)(?=\Z|\*\*Ans:|\*\*Correct)", body)
    if lm:
        logic = lm.group(1).strip()
        # drop nested bullets markers
        logic = re.sub(r"(?m)^\s*[-•]\s*", "", logic)
        logic = re.sub(r"\s+", " ", logic).strip()
    if not logic:
        # Detailed Explanation bullets
        for bm in re.finditer(r"(?m)^\s*[-•]\s+(.+)$", body):
            b = bm.group(1).strip()
            if re.match(r"(?i)correct answer|must-score|logic\s*$", b):
                continue
            logic = b
            break
    return letter, logic


def is_see_above(t: str) -> bool:
    return bool(re.search(r"(?i)see the explanation of above|see above", t))


def upgrade(body: str, opts: dict[str, str]) -> str | None:
    if not re.search(r"Correct Answer", body, re.I):
        return None
    letter, logic_raw = parse_backtick_or_plain(body)
    if not letter:
        return None
    if letter == "*":
        expl = one_liner(logic_raw) if logic_raw and not is_see_above(logic_raw) else "Multi-correct / commission key."
        return f"**Logic:** {expl}\n\n**Ans:** {expl}\n"

    opt = opts.get(letter, "")
    ans = one_liner(opt, 120) if opt else f"Option {letter}."

    if logic_raw and not is_see_above(logic_raw):
        logic = one_liner(logic_raw)
    elif is_see_above(logic_raw) and opt:
        logic = f"Same teaching key as the linked stem above; answer is {opt}."
    elif opt:
        logic = f"Keyed option is {opt}."
    else:
        logic = ""

    if logic and logic.lower().startswith("correct answer"):
        # strip leaked prefix
        logic = re.sub(r"(?i)^correct answer:\s*", "", logic).strip()
        logic = one_liner(logic)

    parts = []
    if logic:
        parts += [f"**Logic:** {logic}", ""]
    parts += [f"**Ans: {letter}.** {ans}", ""]
    return "\n".join(parts)


def retag(text: str) -> tuple[str, int]:
    n = 0

    def repl(m: re.Match) -> str:
        nonlocal n
        header = m.group(2)
        rest = (m.group(4) or "").strip()
        if not re.match(r"(?i)^Q\s*[-–—A-Z0-9]", header.strip()):
            return m.group(0)
        new_h = clean_tag(header)
        rest = re.sub(r"^[—–\-:\s]+", "", rest).strip()
        if rest and len(rest) < 70 and not re.search(
            r"\?$|^(With reference|Which|Consider|Match|Assertion|Given|The |Who |What |How |When |Where |Select |Arrange |In a |Long |Double|Change |Nitrogen)",
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


def fix_file(path: Path, do_retag: bool) -> tuple[int, int]:
    text = path.read_text(encoding="utf-8")
    if do_retag:
        text, tag_n = retag(text)
    else:
        tag_n = 0
    ans_n = 0
    pieces = []
    last = 0
    for m in DETAILS.finditer(text):
        pieces.append(text[last : m.start()])
        before = text[max(0, m.start() - 900) : m.start()]
        qpos = before.rfind("**Q")
        if qpos >= 0:
            before = before[qpos:]
        opts = extract_options(before)
        head, body, tail = m.group(1), m.group(2), m.group(3)
        new_body = upgrade(body, opts)
        if new_body:
            ans_n += 1
            pieces.append(f"{head}\n{new_body}{tail}")
        else:
            # patch leftover Must-Score / Correct Answer: leaked into Logic
            if re.search(r"(?m)^\*\*Logic:\*\*\s*Correct Answer:", body) or re.search(
                r"(?i)Must-Score Points", body
            ):
                letter, logic_raw = parse_backtick_or_plain(
                    body.replace("**Logic:** Correct Answer:", "**Correct Answer:**")
                )
                # try extract letter from Logic line
                if not letter:
                    mm = re.search(r"(?i)Correct Answer:\s*\(([A-Ea-e])\)\s*(.*)", body)
                    if mm:
                        letter = mm.group(1).upper()
                        logic_raw = mm.group(2).strip()
                if letter and letter != "*":
                    opt = opts.get(letter, "")
                    ans = one_liner(opt, 120) if opt else one_liner(logic_raw, 120)
                    logic = one_liner(logic_raw) if logic_raw else f"Keyed option is {opt}."
                    new_body = f"**Logic:** {logic}\n\n**Ans: {letter}.** {ans}\n"
                    ans_n += 1
                    pieces.append(f"{head}\n{new_body}{tail}")
                else:
                    pieces.append(m.group(0))
            else:
                pieces.append(m.group(0))
        last = m.end()
    pieces.append(text[last:])
    new = re.sub(r"\n{3,}", "\n\n", "".join(pieces))
    if new != path.read_text(encoding="utf-8"):
        path.write_text(new.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return tag_n, ans_n


def main() -> None:
    reorder = load_reorder()
    restored = [
        "13_Sound_and_Wave_Motion.md",
        "14_Electricity_and_Magnetism.md",
        "15_Electronics_Semiconductors_and_Computers.md",
        "16_Nuclear_and_Atomic_Physics.md",
    ]
    for name in restored:
        path = ROOT / name
        text = path.read_text(encoding="utf-8")
        new, changed = reorder.fix_text(text)
        if changed:
            path.write_text(new.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
            print("reordered", name)

    total_t = total_a = 0
    for path in sorted(ROOT.rglob("*.md")):
        if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
            continue
        t, a = fix_file(path, do_retag=(path.name in restored))
        if t or a:
            print(f"{path.name}: tags={t} answers={a}")
            total_t += t
            total_a += a
    print(f"TOTAL tags={total_t} answers={total_a}")

    rem = wrongish = 0
    for path in ROOT.rglob("*.md"):
        t = path.read_text(encoding="utf-8")
        for m in DETAILS.finditer(t):
            b = m.group(2)
            if re.search(r"Correct Answer", b, re.I):
                rem += 1
            if re.search(r"(?m)^\*\*Logic:\*\*\s*Correct Answer:", b):
                wrongish += 1
            if re.search(r"(?i)Must-Score Points", b):
                wrongish += 1
    print(f"Remaining Correct Answer in details={rem}, wrongish Logic={wrongish}")


if __name__ == "__main__":
    main()
