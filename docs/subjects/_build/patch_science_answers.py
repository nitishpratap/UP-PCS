#!/usr/bin/env python3
"""Patch remaining Science PYQ answer issues after safe_fix_science_pyq."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology")
DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)


def one_liner(text: str, limit: int = 220) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[*_`]+", "", text)
    text = re.sub(r"\s+", " ", text).strip(" -–—\t;")
    text = re.sub(r"^\(?[A-Ea-e*]\)?[.\)]\s*", "", text)
    parts = re.split(r"(?<=[.!?])\s+", text)
    s = parts[0].strip() if parts else text
    if len(s) > limit:
        s = s[: limit - 1].rstrip() + "…"
    return s


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
            if let not in opts and txt and len(txt) < 200:
                opts[let] = txt
    return opts


def parse_letter_label(body: str) -> tuple[str | None, str]:
    # Same-line only — never DOTALL across Must-Score heading
    patterns = [
        r"(?i)\*\*Correct Answer:?\*\*\s*`?Ans\.\s*\(([A-Ea-e*]+)\)`?",
        r"(?i)\*\*Correct Answer:?\*\*\s*``?Ans\.\s*\(([A-Ea-e*]+)\)``?",
        r"(?i)Correct Answer:\s*`Ans\.\s*\(([A-Ea-e*]+)\)`",
        r"(?i)\*\*Correct Answer:?\*\*\s*\*\*\(([A-Ea-e*,\s&]+)\)\*\*",
        r"(?i)\*\*Correct Answer:?\*\*\s*\*\*([A-Ea-e*]+)\*\*\s*(?:\(([^)]*)\))?",
        r"(?i)\*\*Correct Answer:?\*\*\s*\(([A-Ea-e*,\s&]+)\)\s*(?:\(([^)]*)\))?",
        r"(?i)\*\*Correct Answer:?\*\*\s*\(([A-Ea-e*]+)\)\s*[—–:\-]*\s*([^\n]*)",
        r"(?i)\*\*Correct Answer:?\*\*\s*([A-Ea-e*]+)\b\s*(?:\(([^)]*)\))?",
        r"(?i)Correct Answer:\s*\(([A-Ea-e*]+)\)\s*[—–:\-]*\s*([^\n]*)",
        r"(?i)Correct Answer:\s*([A-Ea-e*]+)\b",
    ]
    for pat in patterns:
        m = re.search(pat, body)
        if not m:
            continue
        raw = m.group(1).strip()
        label = ""
        if m.lastindex and m.lastindex >= 2 and m.group(2):
            label = m.group(2).strip(" .:*)")
        # reject Must-Score leak
        if re.search(r"(?i)must-score|detailed explanation|explanation\s*$", label):
            label = ""
        if "*" in raw or "&" in raw or "," in raw:
            return "*", label
        lm = re.search(r"[A-Ea-e]", raw)
        if lm:
            return lm.group(0).upper(), label
    return None, ""


def bullets(body: str) -> list[str]:
    out = []
    sec = re.search(
        r"(?i)(?:Must-Score Points?\s*&?\s*Explanation|Detailed Explanation|Explanation)\s*:?\s*\n(.*)",
        body,
        re.S,
    )
    region = sec.group(1) if sec else body
    for m in re.finditer(r"(?m)^\s*[-•]\s+(.+)$", region):
        b = m.group(1).strip()
        if re.match(r"(?i)correct answer|must-score|detailed explanation", b):
            continue
        out.append(b)
    return out


def is_see_above(t: str) -> bool:
    return bool(re.search(r"(?i)see the explanation of above|see above", t))


def build(letter: str | None, label: str, opts: dict[str, str], buls: list[str]) -> str | None:
    real = [b for b in buls if not is_see_above(b)]
    if letter == "*":
        expl = one_liner(real[0]) if real else (label or "Commission key / multi-correct / ambiguous.")
        return f"**Logic:** {expl}\n\n**Ans:** {expl}\n"
    if not letter:
        if not real and not label:
            return None
        letter = "A"
    opt = opts.get(letter, "")
    if label and not is_see_above(label) and not re.search(r"(?i)must-score|explanation", label):
        ans = one_liner(label, 120)
    elif opt:
        ans = one_liner(opt, 120)
    elif real:
        ans = one_liner(real[0], 90)
    else:
        ans = f"Option {letter}."

    logic = ""
    if real:
        logic = one_liner(real[0])
    elif any(is_see_above(b) for b in buls) and opt:
        logic = f"Same teaching key as the linked stem above; answer is {opt}."
    elif opt:
        logic = f"Keyed option is {opt}."

    if logic and logic.lower().rstrip(".") == ans.lower().rstrip(".") and len(logic) < 50:
        logic = ""

    parts = []
    if logic:
        parts += [f"**Logic:** {logic}", ""]
    parts += [f"**Ans: {letter}.** {ans}", ""]
    return "\n".join(parts)


def fix_file(path: Path) -> tuple[int, int]:
    text = path.read_text(encoding="utf-8")
    # Fix garbage tag like **Q-ST61. d) Vitamin K**
    text2, n_tag = re.subn(
        r"(?m)^\*\*Q-ST(\d+)\.\s*[a-e]\)\s*([^*]+)\*\*\s*$",
        r"**Q-ST\1.**\n\n\2\n",
        text,
        flags=re.I,
    )
    converted = 0
    patched = 0
    pieces = []
    last = 0
    for m in DETAILS.finditer(text2):
        pieces.append(text2[last : m.start()])
        before = text2[max(0, m.start() - 900) : m.start()]
        qpos = before.rfind("**Q")
        if qpos >= 0:
            before = before[qpos:]
        opts = extract_options(before)
        head, body, tail = m.group(1), m.group(2), m.group(3)

        if re.search(r"Correct Answer", body, re.I):
            letter, label = parse_letter_label(body)
            new_body = build(letter, label, opts, bullets(body))
            if new_body:
                converted += 1
                pieces.append(f"{head}\n{new_body}{tail}")
            else:
                pieces.append(m.group(0))
        else:
            # Fix bad Ans: Must-Score Points
            am = re.search(r"(?m)^\*\*Ans:\s*([A-E])\.\*\*\s*(.+)$", body)
            if am and re.search(r"(?i)must-score|detailed explanation", am.group(2)):
                let = am.group(1)
                opt = opts.get(let, f"Option {let}.")
                lm = re.search(r"(?m)^\*\*Logic:\*\*\s*(.+)$", body)
                logic = lm.group(1).strip() if lm else f"Keyed option is {opt}."
                # If logic mentions option, keep; else ensure option in ans
                new_body = f"**Logic:** {one_liner(logic)}\n\n**Ans: {let}.** {one_liner(opt, 120)}\n"
                patched += 1
                pieces.append(f"{head}\n{new_body}{tail}")
            else:
                pieces.append(m.group(0))
        last = m.end()
    pieces.append(text2[last:])
    new = "".join(pieces)
    new = re.sub(r"\n{3,}", "\n\n", new)
    if new != text:
        path.write_text(new.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return converted, patched + n_tag


def main() -> None:
    tc = tp = 0
    for path in sorted(ROOT.rglob("*.md")):
        if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
            continue
        c, p = fix_file(path)
        if c or p:
            print(f"{path.name}: converted={c} patched={p}")
            tc += c
            tp += p
    print(f"TOTAL converted={tc} patched={tp}")
    rem = 0
    unbal = 0
    must = 0
    for path in ROOT.rglob("*.md"):
        t = path.read_text(encoding="utf-8")
        for m in DETAILS.finditer(t):
            if re.search(r"Correct Answer", m.group(2), re.I):
                rem += 1
            if re.search(r"(?i)Ans:.*Must-Score", m.group(2)):
                must += 1
        for line in t.splitlines():
            if line.startswith("**Q") and line.count("(") != line.count(")"):
                unbal += 1
    print(f"Remaining Correct Answer in details={rem}, Must-Score Ans={must}, unbalanced={unbal}")


if __name__ == "__main__":
    main()
