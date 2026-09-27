#!/usr/bin/env python3
"""Finalize Science PYQ tags + Show-answer across all formats after git restore."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology")
PREFIX = "ST"

DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*(?:Show answer|[^<]*Answer[^<]*)\s*</summary>\s*)(.*?)(</details>)"
)


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
    text = re.sub(r"<br\s*/?>", " ", text, flags=re.I)
    text = re.sub(r"[*_`]+", "", text)
    text = re.sub(r"\s+", " ", text).strip(" -–—\t;")
    parts = re.split(r"(?<=[.!?])\s+", text)
    s = parts[0].strip() if parts else text
    if len(s) > limit:
        s = s[: limit - 1].rstrip() + "…"
    return s


def normalize_exam(exam: str) -> str:
    for a, b in [
        ("U.P.P.C.S.", "UPPCS"),
        ("U.P.P.S.C.", "UPPSC"),
        ("U.P. P.C.S.", "UPPCS"),
        ("U.P. R.O./A.R.O.", "UP RO/ARO"),
        ("U.P.R.O./A.R.O.", "UP RO/ARO"),
        ("U.P. Lower Sub.", "UP Lower Sub"),
        ("R.A.S./R.T.S.", "RAS/RTS"),
    ]:
        exam = exam.replace(a, b)
    return re.sub(r"\s+", " ", exam).strip(" .[]")


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


def clean_exam_header(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("(") and ")" in raw:
        grp = balanced_paren(raw, 0)
        if grp:
            return normalize_exam(grp[0][1:-1])
    if raw.startswith("[") and raw.endswith("]"):
        return normalize_exam(raw[1:-1])
    return normalize_exam(raw)


def extract_options(before: str) -> dict[str, str]:
    opts: dict[str, str] = {}
    # Multiline standard
    for pat in [
        r"(?m)^\s*([A-E])[.)]\s+(.+?)\s*$",
        r"(?m)^\s*[-*]\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        r"(?m)^\s*\(([A-Ea-e])\)\s+(.+?)\s*$",
    ]:
        for m in re.finditer(pat, before):
            let = m.group(1).upper()
            txt = re.sub(r"\s+", " ", m.group(2)).strip(" .;")
            # strip trailing sibling options glued on same line: "Copper (c) Gold"
            txt = re.split(r"\s*\([a-e]\)\s+", txt, maxsplit=1, flags=re.I)[0].strip()
            if let not in opts and txt and len(txt) < 220:
                opts[let] = txt
    # Inline (a) X (b) Y (c) Z (d) W — possibly across lines
    blob = re.sub(r"\s+", " ", before)
    for m in re.finditer(r"\(([a-e])\)\s*([^()]+?)(?=\s*\([a-e]\)|$)", blob, flags=re.I):
        let = m.group(1).upper()
        txt = m.group(2).strip(" .;")
        # cut at Code : / Select /
        txt = re.split(r"\b(?:Code|Select the)\b", txt, maxsplit=1)[0].strip(" .;")
        if let not in opts and txt and 1 < len(txt) < 220:
            opts[let] = txt
    return opts


def parse_letter(body: str) -> str | None:
    patterns = [
        r"(?i)Correct Answer:?\*?\*?\s*`+Ans\.\s*\(([A-Ea-e*]+)\)`+",
        r"(?i)Correct Answer:?\*?\*?\s*`Ans\.\s*\(([A-Ea-e*]+)\)`",
        r"(?i)<b>Ans\.\s*\(([A-Ea-e*]+)\)</b>",
        r"(?i)\*\*Correct Answer:?\*\*\s*\*\*\(([A-Ea-e*,\s&]+)\)\*\*",
        r"(?i)\*\*Correct Answer:?\*\*\s*\(([A-Ea-e*,\s&]+)\)",
        r"(?i)\*\*Correct Answer:?\*\*\s*\*\*([A-Ea-e*]+)\*\*",
        r"(?i)Correct Answer:?\*?\*?\s*\(([A-Ea-e*,\s&]+)\)",
        r"(?i)Correct Answer:?\*?\*?\s*\*\*([A-Ea-e*]+)\*\*",
        r"(?i)Ans\.\s*\(([A-Ea-e*]+)\)",
    ]
    for pat in patterns:
        m = re.search(pat, body)
        if not m:
            continue
        raw = m.group(1).strip()
        if "*" in raw or "&" in raw or "," in raw:
            return "*"
        lm = re.search(r"[A-Ea-e]", raw)
        if lm:
            return lm.group(0).upper()
    return None


def parse_logic_text(body: str) -> str:
    # Prefer existing Logic / High-Yield / Detailed Explanation
    for pat in [
        r"(?is)\*\*Logic:\*\*\s*(.*?)(?=\Z|\*\*Ans:|\*\*Correct)",
        r"(?is)\*\*High-Yield Explanation:\*\*\s*(.*?)(?=\Z|\*\*Ans:|\*\*Correct)",
        r"(?is)\*\*Detailed Explanation:\*\*\s*(.*?)(?=\Z|\*\*Ans:|\*\*Correct)",
        r"(?is)\*\*Must-Score Points?\s*&?\s*Explanation:\*\*\s*(.*?)(?=\Z|\*\*Ans:|\*\*Correct)",
        r"(?is)High-Yield Explanation:\s*(.*?)(?=\Z|\*\*Ans:|\*\*Correct)",
    ]:
        m = re.search(pat, body)
        if m:
            raw = m.group(1).strip()
            raw = re.sub(r"(?m)^\s*[-•]\s*", "", raw)
            raw = re.sub(r"<br\s*/?>", " ", raw, flags=re.I)
            raw = re.sub(r"\s+", " ", raw).strip()
            if raw and not re.match(r"(?i)^(must-score|see the explanation)", raw):
                return raw
    # bullets
    for bm in re.finditer(r"(?m)^\s*[-•]\s+(.+)$", body):
        b = bm.group(1).strip()
        if re.match(r"(?i)correct answer|must-score|logic\s*$|high-yield", b):
            continue
        if re.search(r"(?i)see the explanation of above|see above", b):
            continue
        return b
    # HTML body after Ans.(x)
    m = re.search(r"(?is)<b>Ans\.\s*\([A-Ea-e]\)</b>\s*<br\s*/?>\s*(.*)", body)
    if m:
        return re.sub(r"<[^>]+>", " ", m.group(1))
    return ""


def is_see_above(t: str) -> bool:
    return bool(re.search(r"(?i)see the explanation of above|see above", t))


def build_answer(letter: str | None, opts: dict[str, str], logic_raw: str) -> str | None:
    if not letter:
        return None
    if letter == "*":
        expl = one_liner(logic_raw) if logic_raw and not is_see_above(logic_raw) else "Multi-correct / commission key."
        return f"**Logic:** {expl}\n\n**Ans:** {expl}\n"

    opt = opts.get(letter, "")
    ans = one_liner(opt, 140) if opt else f"Option {letter}."

    if logic_raw and not is_see_above(logic_raw):
        logic = one_liner(logic_raw)
        if logic.lower().startswith("correct answer"):
            logic = one_liner(re.sub(r"(?i)^correct answer:\s*", "", logic))
    elif opt:
        logic = f"Same teaching key as the linked stem above; answer is {opt}." if is_see_above(logic_raw) else f"Keyed option is {opt}."
    else:
        logic = ""

    parts = []
    if logic:
        parts += [f"**Logic:** {logic}", ""]
    parts += [f"**Ans: {letter}.** {ans}", ""]
    return "\n".join(parts)


def convert_hash_q_headers(text: str) -> tuple[str, int]:
    """#### Q2 [U.P.P.C.S. (Mains) 2014] → **Q-ST2. UPPCS (Mains) 2014**"""
    n = 0

    def repl(m: re.Match) -> str:
        nonlocal n
        num, exam = m.group(1), clean_exam_header(m.group(2))
        n += 1
        return f"**Q-{PREFIX}{num}. {exam}**\n"

    text2 = re.sub(
        r"(?m)^#{2,6}\s*Q\s*(\d+[A-Za-z]?)\s*[\[(]([^\]\n]+)[\])]\s*$",
        repl,
        text,
    )
    return text2, n


def convert_bold_q_headers(text: str) -> tuple[str, int]:
    """**Q2. (U.P.P.C.S. (Pre) 1991)** stem → tag + stem"""
    n = 0

    def repl(m: re.Match) -> str:
        nonlocal n
        header = m.group(1).strip()
        rest = (m.group(2) or "").strip()
        if not re.match(r"(?i)^Q", header):
            return m.group(0)
        # already Q-ST
        mm = re.match(
            r"(?i)^Q\s*[-–—]?\s*(?P<pre>[A-Z]{0,4})?\s*(?P<num>\d+[A-Za-z]?)\.?\s*(?P<rest>.*)$",
            header,
        )
        if not mm:
            return m.group(0)
        num = mm.group("num")
        pre = (mm.group("pre") or "").upper() or PREFIX
        exam_raw = (mm.group("rest") or "").strip()
        exam = clean_exam_header(exam_raw) if exam_raw else ""
        new_h = f"Q-{pre}{num}. {exam}".strip() if exam else f"Q-{pre}{num}."
        rest = re.sub(r"^[—–\-:\s]+", "", rest).strip()
        n += 1
        if rest:
            return f"**{new_h}**\n\n{rest}\n"
        return f"**{new_h}**\n"

    text2 = re.sub(r"(?m)^\*\*([^*\n]+)\*\*([^\n]*)\n?", repl, text)
    return text2, n


def normalize_summary(text: str) -> int:
    """Force Show answer summary label."""
    text_n, n = re.subn(
        r"(?is)(<details>\s*<summary>\s*)(?:<b>)?(?:View Answer[^<]*|Answer\s*&[^<]*|Show answer)(?:</b>)?(\s*</summary>)",
        r"\1Show answer\2",
        text,
    )
    return n  # caller must use returned text - fix signature


def fix_summaries(text: str) -> tuple[str, int]:
    new, n = re.subn(
        r"(?is)(<details>\s*<summary>\s*)(?:<b>)?(?:View Answer[^<]*|Answer\s*&[^<]*|Show answer)(?:</b>)?(\s*</summary>)",
        r"\1Show answer\2",
        text,
    )
    return new, n


def convert_details(text: str) -> tuple[str, int]:
    n = 0
    pieces = []
    last = 0
    for m in DETAILS.finditer(text):
        pieces.append(text[last : m.start()])
        before = text[max(0, m.start() - 1200) : m.start()]
        # clip to current question
        for marker in ("**Q", "#### Q", "### Q"):
            qpos = before.rfind(marker)
            if qpos >= 0:
                before = before[qpos:]
                break
        opts = extract_options(before)
        head, body, tail = m.group(1), m.group(2), m.group(3)
        # skip syllabus covers
        if "Covers syllabus" in (head + body)[:80]:
            pieces.append(m.group(0))
            last = m.end()
            continue
        letter = parse_letter(body)
        logic_raw = parse_logic_text(body)
        # Already good?
        if re.search(r"(?m)^\*\*Ans:\s*[A-E]\.\*\*", body) and not re.search(
            r"Correct Answer|Must-Score Points|High-Yield Explanation|<b>Ans\.", body, re.I
        ):
            pieces.append(m.group(0))
            last = m.end()
            continue
        new_body = build_answer(letter, opts, logic_raw)
        if new_body:
            # normalize head summary
            head2 = re.sub(
                r"(?is)(<details>\s*<summary>\s*)(?:<b>)?.*?(?:</b>)?(\s*</summary>\s*)",
                r"\1Show answer\2",
                head,
            )
            n += 1
            pieces.append(f"{head2}\n{new_body}{tail}")
        else:
            pieces.append(m.group(0))
        last = m.end()
    pieces.append(text[last:])
    return "".join(pieces), n


def process_file(path: Path, reorder) -> tuple[int, int, int]:
    text = path.read_text(encoding="utf-8")
    text, changed = reorder.fix_text(text)
    text, n_hash = convert_hash_q_headers(text)
    text, n_bold = convert_bold_q_headers(text)
    text, n_sum = fix_summaries(text)
    text, n_ans = convert_details(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    path.write_text(text.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return n_hash + n_bold, n_ans, n_sum


def main() -> None:
    reorder = load_reorder()
    # Only chapters restored / still needing conversion (biology 01–08 already clean)
    targets = {
        "09_Physics_Fundamentals_and_Measurement.md",
        "10_Mechanics_and_Properties_of_Matter.md",
        "11_Energy_Heat_and_Thermal.md",
        "12_Light_Optics_and_Laser.md",
        "13_Sound_and_Wave_Motion.md",
        "14_Electricity_and_Magnetism.md",
        "15_Electronics_Semiconductors_and_Computers.md",
        "16_Nuclear_and_Atomic_Physics.md",
        "17_Scientists_Discoveries_and_Applications.md",
        "18_Atomic_Structure_and_Periodic_Table.md",
        "19_Matter_Solutions_and_Purification.md",
        "20_Metals_and_Chemical_Reactions.md",
        "21_Acids_Bases_Salts_and_Sucrose.md",
        "22_Carbon_Organic_and_Polymers.md",
        "23_Gases_Fuels_and_Energy.md",
        "24_Chemistry_Daily_Life_and_Agriculture.md",
        "25_Radiation_Nuclear_and_Environment_Chem.md",
    }
    tot_t = tot_a = 0
    for path in sorted(ROOT.rglob("*.md")):
        if path.name not in targets:
            continue
        t, a, s = process_file(path, reorder)
        if t or a or s:
            print(f"{path.name}: tags={t} answers={a} summaries={s}")
            tot_t += t
            tot_a += a
    print(f"\nTOTAL tags={tot_t} answers={tot_a}")

    print("\nScoreboard:")
    for path in sorted(ROOT.glob("*.md")):
        if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
            continue
        t = path.read_text(encoding="utf-8")
        tags = len(re.findall(r"(?m)^\*\*Q-ST", t))
        ans = len(re.findall(r"(?m)^\*\*Ans:\s*[A-E.\*]", t))
        ca = 0
        for m in re.finditer(r"(?is)<details>.*?</details>", t):
            if re.search(r"Correct Answer", m.group(0)) and "Covers syllabus" not in m.group(0):
                ca += 1
        must = len(re.findall(r"Must-Score Points", t))
        unbal = sum(
            1
            for line in t.splitlines()
            if line.startswith("**Q") and line.count("(") != line.count(")")
        )
        print(f"  {path.name}: tags={tags} ans={ans} ca={ca} must={must} unbal={unbal}")


if __name__ == "__main__":
    main()
