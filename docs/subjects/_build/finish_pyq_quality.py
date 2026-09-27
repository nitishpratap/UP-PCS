#!/usr/bin/env python3
"""Finish PYQ quality: convert remaining Correct Answer blocks; thicken thin Logic/Ans;
fix truncated Extra Drill tags. Science / Economy / Census / UP Special."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects")
SUBJECTS = [
    "science and technology",
    "economy",
    "census and urbanisation",
    "up special",
]

DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)

# Split file into question chunks starting at **Q...**
Q_SPLIT = re.compile(r"(?m)(?=^\*\*Q)")

LETTER_MAP = {"a": "A", "b": "B", "c": "C", "d": "D", "e": "E"}


def one_liner(text: str, limit: int = 220) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip(" -–—\t*;")
    text = re.sub(r"^\(?[A-Ea-e]\)?[.\)]\s*", "", text)
    parts = re.split(r"(?<=[.!?])\s+", text)
    s = parts[0].strip() if parts else text
    if len(s) > limit:
        s = s[: limit - 1].rstrip() + "…"
    if s and s[-1] not in ".!?":
        # keep short keys without forcing period (Article 267)
        if len(s) > 40:
            s += "."
    return s


def extract_options(chunk: str) -> dict[str, str]:
    """Parse A–E options from the visible part before <details>."""
    head = chunk.split("<details>", 1)[0]
    opts: dict[str, str] = {}
    patterns = [
        # A. text / A) text
        r"(?m)^\s*([A-E])[.)]\s+(.+?)\s*$",
        # - (A) text / - (a) text
        r"(?m)^\s*[-*]\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        # (A) text alone
        r"(?m)^\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
    ]
    for pat in patterns:
        for m in re.finditer(pat, head):
            let = m.group(1).upper()
            txt = re.sub(r"\s+", " ", m.group(2)).strip(" .;")
            # skip code-only rows that are clearly match codes unless short
            if let not in opts and txt and not txt.lower().startswith("select the"):
                opts[let] = txt
    return opts


def parse_correct(body: str) -> tuple[str | None, str]:
    """Return (letter, label) from Correct Answer variants."""
    patterns = [
        r"(?is)\*\*Correct Answer:?\*\*\s*\(([A-Ea-e])\)\s*[—–:\-]*\s*([^\n<]*)",
        r"(?is)\*\*Correct Answer:?\*\*\s*(?:\*\*)?([A-Ea-e])(?:\*\*)?\s*[—–:\-\(]*\s*([^\n<]*)",
        r"(?is)Correct Answer:\s*\(([A-Ea-e])\)\s*[—–:\-]*\s*([^\n<]*)",
        r"(?is)Correct Answer:\s*([A-Ea-e])\b\s*[—–:\-]*\s*([^\n<]*)",
        r"(?is)<b>Correct Answer:\s*\(([A-Ea-e])\)\s*([^<]*)</b>",
    ]
    for pat in patterns:
        m = re.search(pat, body)
        if m:
            letter = m.group(1).upper()
            label = (m.group(2) or "").strip(" .:*)(")
            label = re.sub(r"^[\-—–\s]+", "", label)
            return letter, label
    return None, ""


def extract_explanation_bullets(body: str) -> list[str]:
    bullets: list[str] = []
    # Must-Score / Detailed / Explanation sections
    sec = re.search(
        r"(?is)(?:Must-Score Points?\s*&?\s*Explanation|Detailed Explanation|Explanation)\s*:?\s*(.*)",
        body,
    )
    region = sec.group(1) if sec else body
    for m in re.finditer(r"(?m)^\s*[-•*]\s+(.+)$", region):
        b = m.group(1).strip()
        if re.match(r"(?i)correct answer", b):
            continue
        if re.match(r"(?i)must-score|detailed explanation|explanation\s*$", b):
            continue
        bullets.append(b)
    # Also lines after Correct Answer that look like prose starting with -
    if not bullets:
        raw = re.sub(r"(?is).*?Correct Answer:[^\n]*\n", "", body, count=1)
        raw = re.sub(r"<[^>]+>", " ", raw)
        raw = re.sub(r"\s+", " ", raw).strip()
        if raw and not re.search(r"(?i)see the explanation of above|see above", raw):
            bullets.append(raw)
    return bullets


def is_see_above(text: str) -> bool:
    return bool(re.search(r"(?i)see the explanation of above|see above question|same as above", text))


def build_answer(
    letter: str,
    label: str,
    opts: dict[str, str],
    bullets: list[str],
    prev_logic: str | None,
) -> tuple[str, str | None]:
    """Return (details_body, logic_for_carry)."""
    opt = opts.get(letter, "")
    # Filter see-above bullets
    real = [b for b in bullets if not is_see_above(b)]
    expl = one_liner(real[0]) if real else ""

    # Ans line: prefer option text, else label, else short expl
    if opt:
        ans = one_liner(opt, 120)
    elif label and not is_see_above(label):
        ans = one_liner(label, 120)
    elif expl:
        # use a short key from explanation — first clause
        ans = one_liner(expl, 100)
    else:
        ans = f"Option {letter}."

    # Logic: explanation, or prev for see-above, or synthesise from option
    logic = ""
    if expl and expl.lower() not in ans.lower():
        logic = expl
    elif real and len(real) >= 2:
        logic = one_liner(real[1])
    elif not real and prev_logic:
        logic = prev_logic
    elif expl:
        logic = expl
    elif opt:
        logic = f"Keyed option is {opt}."

    # Avoid nonsense Logic that is just the same as Ans
    if logic and logic.lower().rstrip(".") == ans.lower().rstrip("."):
        logic = ""

    parts = []
    if logic:
        parts.append(f"**Logic:** {logic}")
        parts.append("")
    parts.append(f"**Ans: {letter}.** {ans}")
    parts.append("")
    return "\n".join(parts), (logic or prev_logic)


def thicken_existing(body: str, opts: dict[str, str]) -> str | None:
    """Improve thin Logic/Ans that already use **Ans:** form."""
    if re.search(r"Correct Answer|Detailed Explanation", body, re.I):
        return None
    am = re.search(r"(?m)^\*\*Ans:\s*([A-E])\.\*\*\s*(.*)$", body)
    if not am:
        return None
    letter = am.group(1).upper()
    ans = (am.group(2) or "").strip()
    lm = re.search(r"(?m)^\*\*(Logic|A/R logic):\*\*\s*(.+)$", body)
    logic_label = lm.group(1) if lm else "Logic"
    logic = (lm.group(2) if lm else "").strip()

    opt = opts.get(letter, "")
    changed = False

    # Empty or truncated Ans
    if (not ans or len(ans) < 3 or ans.endswith(" is Art.") or ans.endswith(" is")
            or ans.endswith(" Art.") or ans.endswith("(")):
        if opt:
            ans = one_liner(opt, 120)
            changed = True
        elif not ans:
            ans = f"Option {letter}."
            changed = True

    # Thin Logic like "267." / "11th." / "T.H." / "Dr." — expand with option
    thin = (
        not logic
        or len(logic) < 12
        or re.fullmatch(r"[\d./\s]+", logic.rstrip("."))
        or re.fullmatch(r"[A-Za-z]\.[A-Za-z]\.?", logic.rstrip("."))
        or logic.rstrip(".") in {"Dr", "Mixed", "Art", "267", "11th", "12th"}
    )
    if thin and opt:
        # Prefer a full sentence linking letter to option
        if re.search(r"(?i)article|art\b", opt) or re.match(r"^\d+$", opt.strip()):
            new_logic = f"The keyed answer is {opt}."
        else:
            new_logic = f"The correct choice is {opt}."
        # If old logic was a fragment like "267.", fold into sentence
        frag = logic.rstrip(".")
        if frag and frag.lower() not in new_logic.lower() and len(frag) >= 2:
            if re.match(r"^\d+", frag) and "Article" not in opt:
                new_logic = f"Article {frag} is the keyed provision ({opt})." if "Article" in (opts.get("A","")+opts.get("B","")+opts.get("C","")+opts.get("D","")) else new_logic
            elif frag.lower() not in {"dr", "t.h", "mixed"}:
                new_logic = f"{frag} — keyed as {opt}."
        logic = new_logic
        changed = True
    elif thin and not opt and logic and len(logic) < 12:
        # leave; nothing to thicken
        pass

    if not changed:
        return None

    parts = []
    if logic:
        parts.append(f"**{logic_label}:** {one_liner(logic, 220)}")
        parts.append("")
    parts.append(f"**Ans: {letter}.** {ans}")
    parts.append("")
    return "\n".join(parts)


def fix_extra_drill_tags(text: str) -> tuple[str, int]:
    n = 0

    def repl(m: re.Match) -> str:
        nonlocal n
        inside = m.group(1)
        if inside.count("(") == inside.count(")"):
            return m.group(0)
        # close dangling open paren before closing **
        fixed = inside + ")"
        n += 1
        return f"**{fixed}**"

    # Only Extra Drill / Practice tags that look truncated
    new = re.sub(
        r"(?m)^\*\*(Q\d+\.\s+Extra Drill\s+\([^)\n]+)\*\*\s*$",
        repl,
        text,
    )
    return new, n


def process_file(path: Path) -> tuple[int, int, int]:
    text = path.read_text(encoding="utf-8")
    text, tag_n = fix_extra_drill_tags(text)

    chunks = Q_SPLIT.split(text)
    # First chunk may be preamble
    out: list[str] = []
    converted = 0
    thickened = 0
    prev_logic: str | None = None

    for i, chunk in enumerate(chunks):
        if i == 0 and not chunk.lstrip().startswith("**Q"):
            out.append(chunk)
            continue
        if "<details>" not in chunk:
            out.append(chunk)
            continue

        opts = extract_options(chunk)

        def repl(m: re.Match) -> str:
            nonlocal converted, thickened, prev_logic
            head, body, tail = m.group(1), m.group(2), m.group(3)
            if re.search(r"Correct Answer|Detailed Explanation", body, re.I) or re.search(
                r"(?i)<b>Correct Answer", body
            ):
                letter, label = parse_correct(body)
                if not letter:
                    return m.group(0)
                bullets = extract_explanation_bullets(body)
                new_body, prev_logic = build_answer(letter, label, opts, bullets, prev_logic)
                converted += 1
                return f"{head}\n{new_body}{tail}"
            # Already Ans form — maybe thicken
            thick = thicken_existing(body, opts)
            if thick:
                # update prev_logic
                lm = re.search(r"(?m)^\*\*(?:Logic|A/R logic):\*\*\s*(.+)$", thick)
                if lm:
                    prev_logic = lm.group(1).strip()
                thickened += 1
                return f"{head}\n{thick}{tail}"
            lm = re.search(r"(?m)^\*\*(?:Logic|A/R logic):\*\*\s*(.+)$", body)
            if lm:
                prev_logic = lm.group(1).strip()
            return m.group(0)

        new_chunk = DETAILS.sub(repl, chunk, count=1)
        # If multiple details in chunk (rare), process all
        if new_chunk == chunk:
            new_chunk = DETAILS.sub(repl, chunk)
        out.append(new_chunk)

    new_text = "".join(out)
    new_text = re.sub(r"\n{3,}", "\n\n", new_text)
    if new_text != text or tag_n:
        path.write_text(new_text.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return converted, thickened, tag_n


def main() -> None:
    tot_c = tot_t = tot_tag = 0
    for folder in SUBJECTS:
        d = ROOT / folder
        for path in sorted(d.rglob("*.md")):
            if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
                continue
            c, t, g = process_file(path)
            if c or t or g:
                print(f"{path.relative_to(ROOT)}: converted={c} thickened={t} tags={g}")
                tot_c += c
                tot_t += t
                tot_tag += g
    print(f"\nTOTAL converted={tot_c} thickened={tot_t} tags={tot_tag}")

    # Verify
    for folder in SUBJECTS:
        rem = 0
        unbal = 0
        for path in (ROOT / folder).rglob("*.md"):
            t = path.read_text(encoding="utf-8")
            rem += len(re.findall(r"Correct Answer", t, re.I))
            for line in t.splitlines():
                if line.startswith("**Q") and line.count("(") != line.count(")"):
                    unbal += 1
        print(f"  {folder}: Correct Answer hits={rem}, unbalanced tags={unbal}")


if __name__ == "__main__":
    main()
