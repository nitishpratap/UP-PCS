#!/usr/bin/env python3
"""Rebuild Science / leftover Show-answer blocks from git HEAD originals.

Maps each current **Q-…** stem to the git question's Correct Answer + explanation,
then writes Geography-style Logic + Ans using option text from the current file.
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS")
SUB = ROOT / "docs" / "subjects"

TARGETS = {
    "science and technology": True,  # full rebuild from git
    "economy": False,  # only leftovers / (*)
    "census and urbanisation": False,
    "up special": False,
}

DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)
Q_SPLIT = re.compile(r"(?m)(?=^\*\*Q)")


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


def stem_key(chunk: str) -> str:
    head = chunk.split("<details>", 1)[0]
    # drop tag line
    lines = head.splitlines()
    body_lines = []
    for i, ln in enumerate(lines):
        if i == 0 and ln.strip().startswith("**Q"):
            continue
        s = ln.strip()
        if not s:
            continue
        if re.match(r"^(?:[-*]\s*)?\(?[A-Ea-e]\)?[.)]", s):
            break
        if s.startswith("|") or s.startswith("<"):
            continue
        body_lines.append(s)
        if len(" ".join(body_lines)) > 80:
            break
    key = re.sub(r"\s+", " ", " ".join(body_lines)).lower()
    key = re.sub(r"[^a-z0-9 ]+", "", key)
    return key[:70]


def extract_options(chunk: str) -> dict[str, str]:
    head = chunk.split("<details>", 1)[0]
    opts: dict[str, str] = {}
    for pat in [
        r"(?m)^\s*([A-E])[.)]\s+(.+?)\s*$",
        r"(?m)^\s*[-*]\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        r"(?m)^\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
    ]:
        for m in re.finditer(pat, head):
            let = m.group(1).upper()
            txt = re.sub(r"\s+", " ", m.group(2)).strip(" .;")
            if let not in opts and txt:
                opts[let] = txt
    return opts


def parse_git_answer(body: str) -> tuple[str | None, list[str]]:
    """letter may be A-E or * / None for multi."""
    letter = None
    m = re.search(
        r"(?is)Correct Answer:?\*?\*?\s*\(?\s*([A-Ea-e*]+)\s*\)?\s*[—–:\-]*\s*([^\n<]*)",
        body,
    )
    if m:
        raw = m.group(1).strip()
        if raw == "*" or raw.lower() == "all":
            letter = "*"
        else:
            # take first letter if "a,b" etc.
            lm = re.search(r"[A-Ea-e]", raw)
            letter = lm.group(0).upper() if lm else None
        # label unused here
    bullets: list[str] = []
    sec = re.search(
        r"(?is)(?:Must-Score Points?\s*&?\s*Explanation|Detailed Explanation|Explanation)\s*:?\s*(.*)",
        body,
    )
    region = sec.group(1) if sec else body
    for bm in re.finditer(r"(?m)^\s*[-•*]\s+(.+)$", region):
        b = bm.group(1).strip()
        if re.match(r"(?i)correct answer|must-score|detailed explanation", b):
            continue
        if re.search(r"(?i)see the explanation of above|see above", b):
            continue
        bullets.append(b)
    if not bullets:
        # prose after correct answer
        raw = re.sub(r"(?is).*?Correct Answer:[^\n]*\n", "", body, count=1)
        raw = re.sub(r"<[^>]+>", " ", raw)
        raw = re.sub(r"\s+", " ", raw).strip()
        if raw and not re.search(r"(?i)see above", raw):
            bullets.append(raw)
    return letter, bullets


def build_git_bank(git_text: str) -> list[tuple[str, str | None, list[str]]]:
    """List of (stem_key, letter, bullets)."""
    rows = []
    parts = Q_SPLIT.split(git_text)
    for chunk in parts:
        if not chunk.lstrip().startswith("**Q"):
            continue
        if "<details>" not in chunk and "Correct Answer" not in chunk:
            continue
        key = stem_key(chunk)
        if not key:
            continue
        # details body or trailing answer dump
        dm = DETAILS.search(chunk)
        body = dm.group(2) if dm else chunk
        if "Correct Answer" not in body and "**Ans:" in body:
            # already had Ans in git — keep letter + logic text
            am = re.search(r"(?m)^\*\*Ans:\s*([A-E*])\.\*\*\s*(.*)$", body)
            lm = re.search(r"(?m)^\*\*(?:Logic|A/R logic):\*\*\s*(.+)$", body)
            letter = am.group(1) if am else None
            bullets = []
            if lm:
                bullets.append(lm.group(1).strip())
            if am and am.group(2).strip():
                bullets.append(am.group(2).strip())
            rows.append((key, letter, bullets))
            continue
        letter, bullets = parse_git_answer(body)
        rows.append((key, letter, bullets))
    return rows


def pick_row(bank: list[tuple[str, str | None, list[str]]], key: str):
    if not key:
        return None
    for k, let, bul in bank:
        if k[:40] == key[:40] or key[:35] in k or k[:35] in key:
            return let, bul
    # fuzzy token overlap
    kt = set(key.split())
    best = None
    best_n = 0
    for k, let, bul in bank:
        ot = set(k.split())
        n = len(kt & ot)
        if n > best_n and n >= 4:
            best_n = n
            best = (let, bul)
    return best


def format_answer(letter: str | None, opts: dict[str, str], bullets: list[str]) -> str:
    expl = one_liner(bullets[0]) if bullets else ""
    logic2 = one_liner(bullets[1]) if len(bullets) > 1 else ""

    if letter and letter != "*" and letter in opts:
        ans = one_liner(opts[letter], 120)
    elif letter == "*":
        # multi / all — use explanation key
        ans = expl or "All keyed options (see Logic)."
        letter = "A"  # fallback display — better keep as note
        # Prefer: Ans without false letter — use statement form
        return (
            (f"**Logic:** {expl}\n\n" if expl else "")
            + f"**Ans:** {ans}\n"
        )
    elif letter and letter in "ABCDE":
        ans = expl or f"Option {letter}."
    else:
        ans = expl or "See Logic."
        letter = letter or "A"

    logic = ""
    if expl and expl.lower().rstrip(".") not in ans.lower():
        logic = expl
    elif logic2:
        logic = logic2
    elif ans and letter in opts:
        logic = f"Standard key matches {opts[letter]}."

    parts = []
    if logic:
        parts.append(f"**Logic:** {logic}")
        parts.append("")
    parts.append(f"**Ans: {letter}.** {ans}")
    parts.append("")
    return "\n".join(parts)


def logic_matches_ans(logic: str, ans: str, opt: str, stem: str) -> bool:
    if not logic or len(logic) < 8:
        return False
    bag = (ans + " " + opt + " " + stem[:100]).lower()
    bag = re.sub(r"[^a-z0-9 ]+", " ", bag)
    words = [w for w in re.findall(r"[a-z]{4,}", logic.lower()) if w not in {
        "that", "this", "with", "from", "which", "their", "were", "have", "been",
        "also", "into", "only", "than", "then", "when", "where", "while", "about",
        "called", "known", "study", "under", "after", "before", "between",
    }]
    if not words:
        return True
    hits = sum(1 for w in words[:8] if w in bag)
    return hits >= 1


def process_science(path: Path, rel: str) -> int:
    git_text = git_show(rel)
    if not git_text:
        return 0
    bank = build_git_bank(git_text)
    text = path.read_text(encoding="utf-8")
    parts = Q_SPLIT.split(text)
    out = []
    n = 0
    for i, chunk in enumerate(parts):
        if i == 0 and not chunk.lstrip().startswith("**Q"):
            out.append(chunk)
            continue
        if "<details>" not in chunk:
            out.append(chunk)
            continue
        key = stem_key(chunk)
        opts = extract_options(chunk)
        picked = pick_row(bank, key)

        def repl(m: re.Match) -> str:
            nonlocal n
            head, body, tail = m.group(1), m.group(2), m.group(3)
            letter = None
            bullets: list[str] = []
            if picked:
                letter, bullets = picked
            # If current still has Correct Answer, parse it preferentially
            if re.search(r"Correct Answer", body, re.I):
                letter2, bullets2 = parse_git_answer(body)
                if letter2:
                    letter = letter2
                if bullets2:
                    bullets = bullets2
            am = re.search(r"(?m)^\*\*Ans:\s*([A-E])\.\*\*\s*(.*)$", body)
            lm = re.search(r"(?m)^\*\*(?:Logic|A/R logic):\*\*\s*(.+)$", body)
            # Decide whether to rebuild
            need = bool(re.search(r"Correct Answer", body, re.I))
            if am and lm:
                ans_txt = am.group(2).strip()
                logic_txt = lm.group(1).strip()
                let = am.group(1)
                opt = opts.get(let, "")
                if not logic_matches_ans(logic_txt, ans_txt, opt, key):
                    need = True
                    if not letter:
                        letter = let
                    if not bullets and picked:
                        letter, bullets = picked
            elif am and not lm:
                need = True
                if not letter:
                    letter = am.group(1)

            if not need and am:
                return m.group(0)

            if not letter and am:
                letter = am.group(1)
            if not bullets and lm:
                bullets = [lm.group(1).strip()]

            new_body = format_answer(letter, opts, bullets)
            n += 1
            return f"{head}\n{new_body}{tail}"

        new_chunk = DETAILS.sub(repl, chunk)
        out.append(new_chunk)

    new_text = "".join(out)
    new_text = re.sub(r"\n{3,}", "\n\n", new_text)
    if new_text != text:
        path.write_text(new_text.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return n


def convert_star_and_leftovers(path: Path) -> int:
    """For non-science: convert remaining Correct Answer including (*)."""
    text = path.read_text(encoding="utf-8")
    parts = Q_SPLIT.split(text)
    out = []
    n = 0
    for i, chunk in enumerate(parts):
        if i == 0 and not chunk.lstrip().startswith("**Q"):
            out.append(chunk)
            continue
        if "<details>" not in chunk:
            out.append(chunk)
            continue
        opts = extract_options(chunk)

        def repl(m: re.Match) -> str:
            nonlocal n
            head, body, tail = m.group(1), m.group(2), m.group(3)
            if not re.search(r"Correct Answer", body, re.I):
                return m.group(0)
            letter, bullets = parse_git_answer(body)
            new_body = format_answer(letter, opts, bullets)
            n += 1
            return f"{head}\n{new_body}{tail}"

        out.append(DETAILS.sub(repl, chunk))
    new_text = "".join(out)
    if new_text != text:
        path.write_text(new_text.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return n


def main() -> None:
    total = 0
    d = SUB / "science and technology"
    for path in sorted(d.rglob("*.md")):
        if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
            continue
        rel = str(path.relative_to(ROOT)).replace("\\", "/")
        n = process_science(path, rel)
        if n:
            print(f"science rebuild {path.name}: {n}")
            total += n
    for folder in ["economy", "census and urbanisation", "up special"]:
        for path in sorted((SUB / folder).rglob("*.md")):
            if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
                continue
            n = convert_star_and_leftovers(path)
            if n:
                print(f"leftover {folder}/{path.name}: {n}")
                total += n
    print("total rebuilt", total)
    # verify
    for folder in ["science and technology", "economy", "census and urbanisation", "up special"]:
        in_d = 0
        for path in (SUB / folder).rglob("*.md"):
            t = path.read_text(encoding="utf-8")
            for m in DETAILS.finditer(t):
                if re.search(r"Correct Answer", m.group(2), re.I):
                    in_d += 1
        print(f"  {folder}: Correct Answer still in details: {in_d}")


if __name__ == "__main__":
    main()
