#!/usr/bin/env python3
"""Upgrade Show-answer quality: fix leaked/wrong Logic, replace 'The correct choice is…' stubs."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS")
SUB = ROOT / "docs" / "subjects"

DETAILS = re.compile(
    r"(?is)(<details>\s*<summary>\s*Show answer\s*</summary>\s*)(.*?)(</details>)"
)
Q_SPLIT = re.compile(r"(?m)(?=^\*\*Q|^\d+\.\s)")


def git_show(rel: str) -> str | None:
    try:
        return subprocess.check_output(
            ["git", "show", f"HEAD:{rel.replace(chr(92), '/')}"],
            cwd=ROOT,
            stderr=subprocess.DEVNULL,
        ).decode("utf-8", errors="replace")
    except Exception:
        return None


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


def stem_key(chunk: str) -> str:
    head = chunk.split("<details>", 1)[0]
    lines = []
    for ln in head.splitlines():
        s = ln.strip()
        if not s or s.startswith("**Q") or re.match(r"^\d+\.\s*$", s):
            continue
        if re.match(r"^(?:[-*]\s*)?\(?[A-Da-d]\)?[.)]", s):
            break
        if s.startswith("|") or s.startswith("<"):
            continue
        # strip leading "1. " numbering
        s = re.sub(r"^\d+\.\s+", "", s)
        lines.append(s)
        if len(" ".join(lines)) > 90:
            break
    key = re.sub(r"[^a-z0-9 ]+", "", " ".join(lines).lower())
    return re.sub(r"\s+", " ", key)[:70]


def extract_options(before: str) -> dict[str, str]:
    opts: dict[str, str] = {}
    for pat in [
        r"(?m)^\s*([A-E])[.)]\s+(.+?)\s*$",
        r"(?m)^\s*[-*]\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
        r"(?m)^\s*\(([A-Ea-e])\)\s+(.+?)\s*$",
        r"(?m)^\s*\(([A-Ea-e])\)\s*(.+?)\s*$",
    ]:
        for m in re.finditer(pat, before):
            let = m.group(1).upper()
            txt = re.sub(r"\s+", " ", m.group(2)).strip(" .;")
            if let not in opts and txt and len(txt) < 200:
                opts[let] = txt
    return opts


def parse_git_html_answer(body: str) -> tuple[str | None, str]:
    """Return letter, explanation from git HTML or markdown Correct Answer blocks."""
    letter = None
    m = re.search(
        r"(?is)<b>Correct Answer:\s*\(([A-Ea-e])\)\s*([^<]*)</b>",
        body,
    )
    if m:
        letter = m.group(1).upper()
        label = m.group(2).strip()
    else:
        m = re.search(
            r"(?i)\*\*Correct Answer:?\*\*\s*\(([A-Ea-e])\)\s*([^\n<]*)",
            body,
        )
        if m:
            letter = m.group(1).upper()
            label = m.group(2).strip()
        else:
            label = ""
    expl = ""
    em = re.search(
        r"(?is)<b>Explanation:</b>\s*(.*?)(?=</details>|\Z)",
        body,
    )
    if em:
        expl = one_liner(em.group(1))
    if not expl:
        em = re.search(
            r"(?is)\*\*(?:Explanation|Detailed Explanation|Logic):\*\*\s*(.+?)(?=\n\n|\Z)",
            body,
        )
        if em:
            expl = one_liner(em.group(1))
    if not expl and label:
        expl = one_liner(label)
    return letter, expl


def build_git_bank(git_text: str) -> list[tuple[str, str | None, str]]:
    rows = []
    # Split on numbered practice items or **Q
    parts = re.split(r"(?m)(?=^\d+\.\s|^\*\*Q)", git_text)
    for chunk in parts:
        if "<details>" not in chunk and "Correct Answer" not in chunk:
            continue
        key = stem_key(chunk)
        if not key:
            continue
        dm = DETAILS.search(chunk)
        body = dm.group(2) if dm else chunk
        # also HTML details without Show answer summary
        if not dm:
            dm2 = re.search(r"(?is)<details>\s*<summary>.*?</summary>\s*(.*?)</details>", chunk)
            body = dm2.group(1) if dm2 else chunk
        letter, expl = parse_git_html_answer(body)
        if letter or expl:
            rows.append((key, letter, expl))
    return rows


def pick(bank, key):
    if not key:
        return None
    for k, let, expl in bank:
        if k[:35] == key[:35] or key[:30] in k or k[:30] in key:
            return let, expl
    kt = set(key.split())
    best = None
    best_n = 0
    for k, let, expl in bank:
        n = len(kt & set(k.split()))
        if n > best_n and n >= 5:
            best_n = n
            best = (let, expl)
    return best


def upgrade_choice_stub(body: str, opts: dict[str, str]) -> str | None:
    """Fix 'The correct choice is…' / thin Logic stubs using Ans + options."""
    am = re.search(r"(?m)^\*\*Ans:\s*([A-E*])\.\*\*\s*(.*)$", body)
    if not am:
        # Ans: without letter
        am2 = re.search(r"(?m)^\*\*Ans:\*\*\s*(.*)$", body)
        if not am2:
            return None
        letter, ans = None, am2.group(1).strip()
    else:
        letter, ans = am.group(1).upper(), (am.group(2) or "").strip()

    lm = re.search(r"(?m)^\*\*(Logic|A/R logic):\*\*\s*(.+)$", body)
    logic_label = lm.group(1) if lm else "Logic"
    logic = (lm.group(1) and lm.group(2) or "").strip() if lm else ""
    if lm:
        logic = lm.group(2).strip()

    opt = opts.get(letter, "") if letter else ""
    changed = False

    # Wrong leaked Logic (date leak, truncated crumbs)
    bad_logic = (
        not logic
        or len(logic) < 12
        or re.match(r"(?i)^(dr\.|r\.|of above|see above|ans\.?|must-score)", logic)
        or re.search(r"(?i)27 February 1931", logic)
        or re.match(r"(?i)^the correct choice is\b", logic)
        or re.match(r"(?i)^the keyed answer is\b", logic)
        or re.match(r"(?i)^statement \d+ is false\.?$", logic)
        or re.match(r"(?i)^keyed option is\b", logic)
        or logic.lower().startswith("correct answer")
    )

    if not bad_logic and ans and len(ans) >= 8:
        return None

    choice = ""
    m = re.match(r"(?i)^the correct choice is\s+(.+)$", logic)
    if m:
        choice = m.group(1).strip(" .")
    elif re.match(r"(?i)^the keyed answer is\s+(.+)$", logic):
        choice = re.match(r"(?i)^the keyed answer is\s+(.+)$", logic).group(1).strip(" .")

    # Prefer option text for Ans
    if letter and opt:
        new_ans = one_liner(opt, 140)
    elif choice and not re.match(r"(?i)^both \(A\)", choice):
        new_ans = one_liner(choice, 140)
    elif ans and not re.search(r"(?i)correct choice|27 February", ans):
        new_ans = ans
    else:
        new_ans = ans or (f"Option {letter}." if letter else "See Logic.")

    # Build real Logic
    if choice and re.match(r"(?i)^both \(A\)|^\(A\) is", choice):
        # A/R code restated as Logic — rewrite
        new_logic = one_liner(ans, 220) if ans and len(ans) > 20 else f"A/R code: {choice}."
        if letter:
            logic_label = "A/R logic"
    elif ans and len(ans) > 15 and ans.lower() not in new_ans.lower():
        # Ans was a teaching tag — use it as Logic
        new_logic = one_liner(ans if not ans.endswith("tag.") else ans, 220)
        if choice:
            new_logic = one_liner(f"{ans.rstrip('.')} — {choice}", 220)
    elif choice and len(choice) > 15:
        new_logic = one_liner(f"Standard key: {choice}.", 220)
    elif opt:
        new_logic = one_liner(f"Standard key matches {opt}.", 220)
    else:
        new_logic = one_liner(logic, 220) if logic and not bad_logic else ""

    # Avoid Logic == Ans echo
    if new_logic and new_ans and new_logic.lower().rstrip(".") == new_ans.lower().rstrip("."):
        new_logic = f"Decide from the stem options; keyed answer is {new_ans}."

    parts = []
    if new_logic:
        parts += [f"**{logic_label}:** {new_logic}", ""]
    if letter:
        parts += [f"**Ans: {letter}.** {new_ans}", ""]
    else:
        parts += [f"**Ans:** {new_ans}", ""]
    return "\n".join(parts)


def rebuild_up_special_from_git(path: Path) -> int:
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    git_text = git_show(rel)
    if not git_text:
        return 0
    bank = build_git_bank(git_text)
    if not bank:
        return 0
    text = path.read_text(encoding="utf-8")
    n = 0
    pieces = []
    last = 0
    for m in DETAILS.finditer(text):
        pieces.append(text[last : m.start()])
        before = text[max(0, m.start() - 1000) : m.start()]
        # find stem start
        for marker in ("\n1. ", "\n2. ", "\n3. ", "**Q"):
            pass
        # use last numbered item or Q
        qpos = max(before.rfind("\n1. "), before.rfind("\n2. "), before.rfind("\n3. "), before.rfind("**Q"))
        # better: search any "\nN. "
        nums = [before.rfind(f"\n{i}. ") for i in range(1, 40)]
        qpos = max([p for p in nums if p >= 0] + [before.rfind("**Q"), -1])
        chunk_before = before[qpos:] if qpos >= 0 else before
        key = stem_key(chunk_before + "<details>")
        opts = extract_options(chunk_before)
        head, body, tail = m.group(1), m.group(2), m.group(3)

        need = bool(
            re.search(r"(?i)27 February 1931|the correct choice is|Correct Answer", body)
            or (
                re.search(r"(?m)^\*\*Logic:\*\*\s*.{0,15}$", body)
            )
        )
        picked = pick(bank, key)
        if need and picked:
            letter, expl = picked
            if not letter:
                am = re.search(r"(?m)^\*\*Ans:\s*([A-E])\.\*\*", body)
                letter = am.group(1) if am else None
            opt = opts.get(letter or "", "")
            ans = one_liner(opt or expl, 140)
            logic = expl if expl and expl.lower() not in ans.lower() else (
                f"Standard key: {opt}." if opt else expl
            )
            new_body = ""
            if logic:
                new_body += f"**Logic:** {one_liner(logic)}\n\n"
            if letter:
                new_body += f"**Ans: {letter}.** {ans}\n"
            else:
                new_body += f"**Ans:** {ans}\n"
            n += 1
            pieces.append(f"{head}\n{new_body}{tail}")
        else:
            # still upgrade choice stubs
            up = upgrade_choice_stub(body, opts)
            if up and up.strip() != body.strip():
                n += 1
                pieces.append(f"{head}\n{up}{tail}")
            else:
                pieces.append(m.group(0))
        last = m.end()
    pieces.append(text[last:])
    new = re.sub(r"\n{3,}", "\n\n", "".join(pieces))
    if new != text:
        path.write_text(new.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    return n


def upgrade_file(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    n = 0
    pieces = []
    last = 0
    for m in DETAILS.finditer(text):
        pieces.append(text[last : m.start()])
        before = text[max(0, m.start() - 900) : m.start()]
        qpos = before.rfind("**Q")
        if qpos < 0:
            nums = [before.rfind(f"\n{i}. ") for i in range(1, 40)]
            qpos = max([p for p in nums if p >= 0] + [-1])
        before = before[qpos:] if qpos >= 0 else before
        opts = extract_options(before)
        head, body, tail = m.group(1), m.group(2), m.group(3)
        up = upgrade_choice_stub(body, opts)
        if up and up.strip() != body.strip():
            n += 1
            pieces.append(f"{head}\n{up}{tail}")
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
    # UP Special: rebuild from git first
    for path in sorted((SUB / "up special").rglob("*.md")):
        if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
            continue
        n = rebuild_up_special_from_git(path)
        print(f"UP rebuild {path.name}: {n}")
        total += n

    for folder in ["economy", "science and technology", "census and urbanisation", "up special"]:
        for path in sorted((SUB / folder).rglob("*.md")):
            if path.name.lower() in {"index.md"} or "syllabus" in path.name.lower():
                continue
            if folder == "up special":
                continue  # already rebuilt
            n = upgrade_file(path)
            if n:
                print(f"{folder}/{path.name}: {n}")
                total += n
    print("TOTAL upgraded", total)

    # recount weak
    WEAK = re.compile(
        r"(?im)^\*\*(?:Logic|A/R logic):\*\*\s*(The correct choice is|The keyed answer is|Statement \d+ is false\.?$|Keyed option is|27 February 1931)"
    )
    for folder in ["science and technology", "economy", "census and urbanisation", "up special"]:
        weak = total_ans = 0
        for path in (SUB / folder).rglob("*.md"):
            t = path.read_text(encoding="utf-8")
            for m in DETAILS.finditer(t):
                if re.search(r"(?m)^\*\*Ans:", m.group(1)):
                    total_ans += 1
                if WEAK.search(m.group(1)):
                    weak += 1
        print(f"  {folder}: Ans={total_ans} remaining-weak-Logic={weak}")


if __name__ == "__main__":
    main()
