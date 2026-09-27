# -*- coding: utf-8 -*-
"""
Cap Economy Consolidated Must-Score Facts at 50.
Overflow that is not already in teaching body is appended as teaching theory
before Complete PYQ Bank.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MAX_N = 50


def split_consolidated(md: str) -> tuple[str, str, str, str]:
    """Return pre, title_line, facts_block (incl blank lines), post."""
    m = re.search(r"(## Consolidated[^\n]*)\n+", md)
    if not m:
        raise SystemExit("no Consolidated")
    start = m.start()
    title = m.group(1)
    after_title = m.end()
    m2 = re.search(r"\n## (?!Consolidated)", md[after_title:])
    if not m2:
        raise SystemExit("no section after Consolidated")
    end = after_title + m2.start()
    facts = md[after_title:end]
    return md[:start], title, facts, md[end:]


def parse_facts(facts_block: str) -> list[tuple[int, str]]:
    items = []
    for m in re.finditer(r"(?m)^(\d+)\.\s+(.+?)(?=\n\d+\.\s|\n*$)", facts_block, re.S):
        n = int(m.group(1))
        body = re.sub(r"\s+", " ", m.group(2)).strip()
        items.append((n, body))
    return items


def render_facts(bodies: list[str]) -> str:
    lines = [f"{i}. {b}" for i, b in enumerate(bodies, 1)]
    return "\n".join(lines) + "\n\n"


def already_in_teaching(text: str, fact: str) -> bool:
    # crude: key bold tokens present
    bolds = re.findall(r"\*\*([^*]{3,40})\*\*", fact)
    if not bolds:
        # first 8 significant words
        words = [w for w in re.sub(r"[^a-zA-Z0-9]+", " ", fact).split() if len(w) > 3][:6]
        return sum(1 for w in words if w.lower() in text.lower()) >= 4
    hits = 0
    for b in bolds[:4]:
        if b in text or b.lower() in text.lower():
            hits += 1
    return hits >= min(2, len(bolds[:4]))


def make_theory_section(title: str, overflow: list[str]) -> str:
    bullets = []
    for f in overflow:
        # strip leading bold-heavy numbering style into teaching sentence
        bullets.append(f"- {f}")
    return (
        f"\n## {title}\n\n"
        "These points sit in teaching theory (not the Consolidated spine).\n\n"
        + "\n".join(bullets)
        + "\n\n"
    )


# Curated keep indices (1-based original numbers) per file — highest-yield spine only.
# Do NOT re-run already-capped files (facts renumbered 1–50); only add still-oversize files.
KEEP: dict[str, list[int]] = {
    "11_Services_Cooperatives_Regulators.md": list(range(1, 51)),
    "12_Economic_Laws_Reports_Rankings_Misc.md": [
        1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
        33, 34, 36, 37, 39, 45, 46, 47,
        49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
    ],
}


def process(name: str) -> None:
    path = ROOT / name
    md = path.read_text(encoding="utf-8")
    pre, title, facts_block, post = split_consolidated(md)
    items = parse_facts(facts_block)
    by_n = {n: b for n, b in items}
    keep_ids = KEEP[name]
    # dedupe preserve order
    seen = set()
    keep_bodies = []
    for n in keep_ids:
        if n in by_n and n not in seen:
            keep_bodies.append(by_n[n])
            seen.add(n)
        if len(keep_bodies) >= MAX_N:
            break
    # if short, fill from remaining in order
    if len(keep_bodies) < MAX_N:
        for n, b in items:
            if n in seen:
                continue
            keep_bodies.append(b)
            seen.add(n)
            if len(keep_bodies) >= MAX_N:
                break

    overflow = [b for n, b in items if n not in seen]

    # teaching region = everything except Consolidated (use post + pre without consol)
    teaching_probe = pre + post
    need_theory = [f for f in overflow if not already_in_teaching(teaching_probe, f)]

    new_title = f"## Consolidated — {len(keep_bodies)} Must-Score Facts"
    new_facts = render_facts(keep_bodies)

    # Insert theory before Complete PYQ Bank in post
    if need_theory:
        theory = make_theory_section(
            "Teaching expansion — additional theory (beyond Consolidated spine)",
            need_theory,
        )
        if "## Complete PYQ Bank" in post:
            post = post.replace("## Complete PYQ Bank", theory + "## Complete PYQ Bank", 1)
        else:
            post = theory + post

    out = pre + new_title + "\n\n" + new_facts + "---\n" + post.lstrip("\n")
    # fix double --- if any
    out = re.sub(r"\n---\n---\n", "\n---\n", out)
    path.write_text(out, encoding="utf-8")
    print(
        f"{name}: consolidated {len(items)} → {len(keep_bodies)}; "
        f"overflow {len(overflow)}; new theory bullets {len(need_theory)}"
    )


def main():
    for name in KEEP:
        process(name)
    # verify
    for name in KEEP:
        t = (ROOT / name).read_text(encoding="utf-8")
        m = re.search(r"## Consolidated — (\d+)", t)
        nums = re.findall(
            r"(?m)^(\d+)\.\s",
            re.search(r"## Consolidated.*?(?=\n## )", t, re.S).group(0),
        )
        print("verify", name, "title", m.group(1) if m else "?", "count", len(nums))


if __name__ == "__main__":
    main()
