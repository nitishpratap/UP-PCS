# -*- coding: utf-8 -*-
"""
Cap Science & Technology Consolidated Must-Score Facts at 50.
Overflow → teaching theory before Complete PYQ Bank.
Also sync title counts when claimed ≠ actual (even if ≤50).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MAX_N = 50


def split_consolidated(md: str) -> tuple[str, str, str, str]:
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
    bolds = re.findall(r"\*\*([^*]{3,40})\*\*", fact)
    if not bolds:
        words = [w for w in re.sub(r"[^a-zA-Z0-9]+", " ", fact).split() if len(w) > 3][:6]
        return sum(1 for w in words if w.lower() in text.lower()) >= 4
    hits = 0
    for b in bolds[:4]:
        if b in text or b.lower() in text.lower():
            hits += 1
    return hits >= min(2, len(bolds[:4]))


def make_theory_section(overflow: list[str]) -> str:
    bullets = "\n".join(f"- {f}" for f in overflow)
    return (
        "\n## Teaching expansion — additional theory (beyond Consolidated spine)\n\n"
        "These points sit in teaching theory (not the Consolidated spine).\n\n"
        + bullets
        + "\n\n"
    )


def insert_theory(post: str, theory: str) -> str:
    for anchor in (
        "## Complete PYQ Bank",
        "## Ghatnachakra Extra Drill",
        "## Practice Zone",
        "## Common Traps",
    ):
        # match dash variants (— / - / en dash)
        m = re.search(rf"(## {re.escape(anchor[3:])}[^\n]*)", post)
        # simpler: find any Complete PYQ
        break
    m = re.search(r"(## Complete PYQ Bank[^\n]*)", post)
    if m:
        return post[: m.start()] + theory + post[m.start() :]
    m = re.search(r"(## Practice Zone[^\n]*)", post)
    if m:
        return post[: m.start()] + theory + post[m.start() :]
    m = re.search(r"(## Common Traps[^\n]*)", post)
    if m:
        return post[: m.start()] + theory + post[m.start() :]
    return post + theory


def process(path: Path) -> str:
    md = path.read_text(encoding="utf-8")
    pre, title, facts_block, post = split_consolidated(md)
    items = parse_facts(facts_block)
    if not items:
        # title-only fix attempt
        claimed_m = re.search(r"(\d+)", title)
        claimed = int(claimed_m.group(1)) if claimed_m else 0
        if claimed and claimed != 0:
            # leave body; just note
            return f"{path.name}: no numbered facts parsed; title claims {claimed}"

    claimed_m = re.search(r"(\d+)", title)
    claimed = int(claimed_m.group(1)) if claimed_m else len(items)

    if len(items) <= MAX_N:
        # sync title only
        if claimed != len(items):
            new_title = f"## Consolidated — {len(items)} Must-Score Facts"
            out = pre + new_title + "\n\n" + facts_block.lstrip("\n")
            # facts_block may already include trailing content before ##
            # rebuild carefully
            out = pre + new_title + "\n\n" + render_facts([b for _, b in items]) + "---\n" + post.lstrip("\n")
            out = re.sub(r"\n---\n---\n", "\n---\n", out)
            path.write_text(out, encoding="utf-8")
            return f"{path.name}: title sync {claimed} → {len(items)} (no trim)"
        return f"{path.name}: ok ({len(items)})"

    # Keep first MAX_N in existing order (science spines usually front-loaded)
    keep_bodies = [b for _, b in items[:MAX_N]]
    overflow = [b for _, b in items[MAX_N:]]

    teaching_probe = pre + post
    need_theory = [f for f in overflow if not already_in_teaching(teaching_probe, f)]

    new_title = f"## Consolidated — {len(keep_bodies)} Must-Score Facts"
    new_facts = render_facts(keep_bodies)

    if need_theory and "Teaching expansion — additional theory" not in post:
        post = insert_theory(post, make_theory_section(need_theory))
    elif need_theory and "Teaching expansion — additional theory" in post:
        # append bullets into existing expansion
        extra = "\n".join(f"- {f}" for f in need_theory) + "\n"
        post = post.replace(
            "These points sit in teaching theory (not the Consolidated spine).\n\n",
            "These points sit in teaching theory (not the Consolidated spine).\n\n" + extra,
            1,
        )

    out = pre + new_title + "\n\n" + new_facts + "---\n" + post.lstrip("\n")
    out = re.sub(r"\n---\n---\n", "\n---\n", out)
    path.write_text(out, encoding="utf-8")
    return (
        f"{path.name}: consolidated {len(items)} → {len(keep_bodies)}; "
        f"overflow {len(overflow)}; new theory bullets {len(need_theory)}"
    )


def main() -> None:
    targets = []
    for p in sorted(ROOT.glob("*.md")):
        if p.name.startswith("_") or "Syllabus" in p.name or p.name == "index.md":
            continue
        t = p.read_text(encoding="utf-8")
        m = re.search(r"## Consolidated[^\n]*", t)
        if not m:
            continue
        claimed_m = re.search(r"(\d+)", m.group(0))
        claimed = int(claimed_m.group(1)) if claimed_m else 0
        after = t[m.end() :]
        m2 = re.search(r"\n## (?!Consolidated)", after)
        block = after[: m2.start()] if m2 else after[:12000]
        count = len(re.findall(r"(?m)^(\d+)\.\s", block))
        if count > MAX_N or claimed != count:
            targets.append(p)

    for p in targets:
        print(process(p))

    print("\nVERIFY:")
    for p in sorted(ROOT.glob("*.md")):
        if p.name.startswith("_") or "Syllabus" in p.name:
            continue
        t = p.read_text(encoding="utf-8")
        m = re.search(r"## Consolidated[^\n]*", t)
        if not m:
            continue
        claimed = re.search(r"(\d+)", m.group(0)).group(1)
        after = t[m.end() :]
        m2 = re.search(r"\n## (?!Consolidated)", after)
        block = after[: m2.start()] if m2 else after[:12000]
        count = len(re.findall(r"(?m)^(\d+)\.\s", block))
        flag = "BAD" if int(claimed) > MAX_N or count > MAX_N or int(claimed) != count else "ok"
        if flag != "ok" or int(claimed) >= 45:
            print(f"  {flag} {p.name}: title={claimed} count={count}")


if __name__ == "__main__":
    main()
