#!/usr/bin/env python3
"""Final polish: leftover Correct Answer formats + weak Logic/Ans lines."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology")
DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)


def one_liner(text: str, limit: int = 220) -> str:
    text = re.sub(r"[*_`]+", "", text)
    text = re.sub(r"\s+", " ", text).strip(" -–—\t;")
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
        r"(?m)^\s*\(([A-Ea-e])\)\s+(.+?)\s*$",
    ]:
        for m in re.finditer(pat, before):
            let = m.group(1).upper()
            txt = re.sub(r"\s+", " ", m.group(2)).strip(" .;")
            if let not in opts and txt:
                opts[let] = txt
    blob = re.sub(r"\s+", " ", before)
    # Inline options — stop at next (a)/(b) only when it is a new option marker
    for m in re.finditer(
        r"(?<![A-Za-z])\(([a-e])\)\s*(.+?)(?=(?<![A-Za-z])\([a-e]\)|$)",
        blob,
        flags=re.I,
    ):
        let = m.group(1).upper()
        txt = m.group(2).strip(" .;")
        txt = re.split(r"\b(?:Code\s*:|Select the)\b", txt, maxsplit=1)[0].strip(" .;")
        if let not in opts and txt and 1 < len(txt) < 220:
            opts[let] = txt
    return opts


def polish_file(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    n = 0
    pieces = []
    last = 0
    for m in DETAILS.finditer(text):
        pieces.append(text[last : m.start()])
        before = text[max(0, m.start() - 1200) : m.start()]
        for marker in ("**Q", "#### Q"):
            qpos = before.rfind(marker)
            if qpos >= 0:
                before = before[qpos:]
                break
        opts = extract_options(before)
        head, body, tail = m.group(1), m.group(2), m.group(3)

        letter = None
        label = ""
        # leftover: **Correct Answer:** `(B) Narora`
        cm = re.search(
            r"(?i)Correct Answer:?\*?\*?\s*`+\(?([A-Ea-e*])\)?\s*([^`]*)`+",
            body,
        )
        if not cm:
            cm = re.search(
                r"(?i)Correct Answer:?\*?\*?\s*\(([A-Ea-e*])\)\s*([^\n`]*)",
                body,
            )
        if cm and re.search(r"Correct Answer", body, re.I):
            letter = cm.group(1).upper()
            label = (cm.group(2) or "").strip(" .:)")

        am = re.search(r"(?m)^\*\*Ans:\s*([A-E])\.\*\*\s*(.*)$", body)
        lm = re.search(r"(?m)^\*\*Logic:\*\*\s*(.*)$", body)

        need = False
        if letter and re.search(r"Correct Answer", body, re.I):
            need = True
        elif am:
            letter = am.group(1).upper()
            ans = (am.group(2) or "").strip()
            logic = (lm.group(1) if lm else "").strip()
            # weak logic
            if logic.lower() in {"ans.", "ans", "must-score points:", "must-score points", ""} or logic.lower().startswith(
                "correct answer"
            ):
                need = True
            # truncated ans like "Both" when option is longer
            opt = opts.get(letter, "")
            if opt and (not ans or ans == f"Option {letter}." or (len(ans) < 12 and len(opt) > len(ans) + 5)):
                need = True
                label = label or opt

        if need and letter:
            opt = opts.get(letter, "")
            ans = one_liner(label or opt or f"Option {letter}.", 140)
            # Prefer existing non-weak logic
            logic = ""
            if lm:
                raw = lm.group(1).strip()
                if raw and raw.lower() not in {"ans.", "ans", "must-score points:", "must-score points"} and not raw.lower().startswith(
                    "correct answer"
                ):
                    logic = one_liner(raw)
            if not logic and opt:
                logic = f"Keyed option is {opt}."
            new_body = ""
            if logic:
                new_body += f"**Logic:** {logic}\n\n"
            new_body += f"**Ans: {letter}.** {ans}\n"
            n += 1
            pieces.append(f"{head}\n{new_body}{tail}")
        else:
            pieces.append(m.group(0))
        last = m.end()
    pieces.append(text[last:])
    new = re.sub(r"\n{3,}", "\n\n", "".join(pieces))
    if new != text:
        path.write_text(new.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return n


def main() -> None:
    total = 0
    for path in sorted(ROOT.rglob("*.md")):
        if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
            continue
        n = polish_file(path)
        if n:
            print(f"{path.name}: {n}")
            total += n
    print("polished", total)
    ca = must = weak = 0
    for path in ROOT.rglob("*.md"):
        t = path.read_text(encoding="utf-8")
        for m in DETAILS.finditer(t):
            b = m.group(2)
            if re.search(r"Correct Answer", b, re.I):
                ca += 1
            if re.search(r"Must-Score Points", b):
                must += 1
            if re.search(r"(?m)^\*\*Logic:\*\*\s*Ans\.?\s*$", b):
                weak += 1
    print(f"remaining ca={ca} must={must} weak-logic-Ans={weak}")


if __name__ == "__main__":
    main()
