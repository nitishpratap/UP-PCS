"""Convert user Part dump (# N. Title + body) → Fact Lock markdown. Preserves ALL text."""
from __future__ import annotations

import re
import sys
from pathlib import Path

EMOJI_RE = re.compile(
    "["
    "\U0000FE0F"
    "\U0001F1E6-\U0001F1FF"
    "\U0001F300-\U0001FAFF"
    "\U00002700-\U000027BF"
    "\U00002600-\U000026FF"
    "]+",
    flags=re.UNICODE,
)


def strip_emoji(s: str) -> str:
    return EMOJI_RE.sub("", s).strip()


def clean_heading(title: str) -> str:
    title = strip_emoji(title)
    title = re.sub(r"\s{2,}", " ", title)
    return title.strip(" -–—")

def parse_sections(raw: str) -> list[tuple[int, str, str]]:
    """Split on # N. headings (level-1 only)."""
    raw = raw.strip()
    # Drop wrapper tags if pasted from chat
    m = re.search(r"<user_query>\s*(.*?)\s*</user_query>", raw, re.S | re.I)
    if m:
        raw = m.group(1)
    # Drop Part header boilerplate before first numbered section
    parts = re.split(r"(?m)^#\s*(\d+)\.\s*(.+)$", raw)
    if len(parts) < 3:
        raise ValueError("No '# N. Title' sections found in dump")
    preamble = parts[0]
    sections: list[tuple[int, str, str]] = []
    i = 1
    while i + 2 <= len(parts):
        num = int(parts[i])
        title = clean_heading(parts[i + 1])
        body = parts[i + 2].strip()
        body = re.sub(r"(?m)^---\s*$", "", body).strip()
        sections.append((num, title, body))
        i += 3
    return sections


def body_cleanup(body: str) -> str:
    """Keep ALL text (tables, blockquotes, bullets). Strip emoji from headings only."""
    lines: list[str] = []
    for line in body.splitlines():
        if line.startswith("####"):
            rest = strip_emoji(line.lstrip("#").strip())
            if not rest:
                continue
            line = f"#### {rest}"
        elif line.startswith("###"):
            rest = strip_emoji(line.lstrip("#").strip())
            if not rest:
                continue
            line = f"### {rest}"
        lines.append(line)
    return "\n".join(lines).strip()


HERO = {
    2: ("Geography · Part 2", "Geomorphology", "~9/10"),
    3: ("Geography · Part 3", "Climatology", "~9.5/10"),
    4: ("Geography · Part 4", "Oceanography", "~9/10"),
    5: ("Geography · Part 5", "World Geography", "~9/10"),
    6: ("Geography · Part 6", "Indian Physical Geography", "~9/10"),
}

TAIL_MARKERS = (
    "# MUST RATTA",
    "# 🔥 MUST RATTA",
    "## MUST RATTA",
    "# Final 50",
    "# TOP 50",
    "## Final 50",
    "## Top 50",
    "# THE 1-MINUTE",
    "## The 1-Minute",
    "# FINAL WORLD MAP",
    "## FINAL WORLD MAP",
    "# 🧠 FINAL WORLD MAP",
    "## 🧠 FINAL WORLD MAP",
    "# 60 FACTS TO REVISE",
    "## 60 FACTS TO REVISE",
    "## 🔥 60 FACTS",
    "# 🔥 60 FACTS",
    "## FINAL MASTER RATTA",
    "# FINAL MASTER RATTA",
    "# 🔥 INDIAN PHYSICAL GEOGRAPHY — FINAL MASTER RATTA",
    "## 🔥 INDIAN PHYSICAL GEOGRAPHY — FINAL MASTER RATTA",
    "# INDIAN PHYSICAL GEOGRAPHY — FINAL MASTER RATTA",
)


def cut_tail(raw: str) -> tuple[str, str]:
    """Split numbered sections from unnumbered MUST RATTA / Final blocks."""
    cut_at = None
    for marker in TAIL_MARKERS:
        idx = raw.find(marker)
        if idx != -1 and (cut_at is None or idx < cut_at):
            cut_at = idx
    if cut_at is None:
        return raw, ""
    extras = raw[cut_at:]
    # Promote # Title → ## Title; strip heading emojis; keep all body text
    lines_out: list[str] = []
    for line in extras.splitlines():
        if re.match(r"^#\s+", line) and not re.match(r"^##\s+", line):
            line = "## " + strip_emoji(line.lstrip("# ").strip())
        elif line.startswith("###"):
            rest = strip_emoji(line.lstrip("#").strip())
            line = f"### {rest}" if rest else "###"
        elif line.startswith("##"):
            line = "## " + strip_emoji(line.lstrip("# ").strip())
        lines_out.append(line)
    return raw[:cut_at], "\n".join(lines_out).strip()


def render(part: int, sections: list[tuple[int, str, str]], extras: str = "") -> str:
    eyebrow, title, prelims = HERO.get(part, (f"Geography · Part {part}", "Fact Locks", "~9/10"))
    out: list[str] = [
        "---",
        "hide:",
        "  - toc",
        "---",
        "",
        '<div class="fact-lock-hero" markdown="0">',
        f'<p class="fact-lock-hero__eyebrow">{eyebrow}</p>',
        f'<h1 class="fact-lock-hero__title">{title}</h1>',
        '<div class="fact-lock-meta">',
        '<span class="fact-lock-pill fact-lock-pill--high">Very high</span>',
        f'<span class="fact-lock-pill">Prelims {prelims}</span>',
        "</div>",
        "</div>",
        "",
        '<div class="fact-lock-sheet fact-lock-sheet--dense" markdown="1">',
    ]
    for num, sec_title, body in sections:
        out.append(f"## {num}. {sec_title}")
        out.append("")
        cleaned = body_cleanup(body)
        if cleaned:
            out.append(cleaned)
            out.append("")
    if extras.strip():
        out.append(extras.strip())
        out.append("")
    out.append("</div>")
    out.append("")
    return "\n".join(out)


def main() -> None:
    if len(sys.argv) < 4:
        print("Usage: python _convert_dump.py <part_num> <raw_dump.md> <out.md>")
        sys.exit(1)
    part = int(sys.argv[1])
    raw_path = Path(sys.argv[2])
    out_path = Path(sys.argv[3])
    raw = raw_path.read_text(encoding="utf-8")
    raw_main, extras = cut_tail(raw)
    sections = parse_sections(raw_main)
    md = render(part, sections, extras)
    out_path.write_text(md, encoding="utf-8")
    print(f"Wrote {out_path} — {len(sections)} sections, {out_path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
