"""Expand telegraph · compression into full-sentence section bodies."""
from __future__ import annotations

import re

EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001FAFF"
    "\U00002700-\U000027BF"
    "\U00002600-\U000026FF"
    "]+",
    flags=re.UNICODE,
)


def strip_emoji(s: str) -> str:
    return EMOJI_RE.sub("", s).strip()


def _clause_to_sentence(clause: str) -> str:
    clause = clause.strip()
    if not clause:
        return ""
    # Already a full sentence
    if clause.endswith((".", "!", "?")):
        return clause
    # Lock line with arrow — keep as blockquote candidate
    if "→" in clause and len(clause) < 120:
        return f"> {clause}"
    # Definition pattern: **Term** = ...
    if re.match(r"^\*\*.+\*\*\s*=", clause):
        if not clause.endswith("."):
            clause += "."
        return clause
    # Short label: **Bold term** only
    if re.match(r"^\*\*[^*]+\*\*$", clause):
        return clause
    # Process list item style
    if clause[0].isupper() or clause.startswith("**"):
        if not clause.endswith("."):
            clause += "."
        return clause
    return clause + "." if not clause.endswith(".") else clause


def expand_body(body: str) -> str:
    """Turn ·-compressed prose into multi-line sentences; preserve tables/admonitions."""
    if not body or not body.strip():
        return body

    lines = body.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Pass through structural blocks unchanged
        if (
            not stripped
            or stripped.startswith("|")
            or stripped.startswith("!")
            or stripped.startswith(">")
            or stripped.startswith("#")
            or stripped.startswith("---")
            or stripped.startswith("<")
        ):
            out.append(line)
            i += 1
            continue

        # Collect contiguous non-table prose lines
        block: list[str] = []
        while i < len(lines):
            s = lines[i].strip()
            if not s:
                break
            if s.startswith("|") or s.startswith("!") or s.startswith("---"):
                break
            block.append(lines[i])
            i += 1

        prose = " ".join(x.strip() for x in block)
        if " · " in prose or (prose.count("·") >= 2 and len(prose) < 500):
            parts = [p.strip() for p in re.split(r"\s·\s", prose) if p.strip()]
            if len(parts) >= 2:
                for p in parts:
                    sent = _clause_to_sentence(p)
                    if sent.startswith("> "):
                        out.append(sent)
                    else:
                        out.append(sent)
                if i < len(lines) and not lines[i].strip():
                    out.append("")
                continue

        out.extend(block)
        if i < len(lines) and not lines[i].strip():
            out.append("")
            i += 1

    text = "\n".join(out)
    # Collapse triple newlines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def expand_markdown_sections(md: str, strip_heading_emoji: bool = False) -> str:
    """Expand bodies under ## N. headings."""
    parts = re.split(r"(?m)^(## \d+\. .+)$", md)
    if len(parts) < 2:
        return md

    out: list[str] = [parts[0]]
    i = 1
    while i + 1 < len(parts):
        heading = parts[i]
        if strip_heading_emoji:
            heading = strip_emoji(heading)
            heading = re.sub(r"\s{2,}", " ", heading)
        body = parts[i + 1]
        # Only expand sheet body (not hero)
        if "fact-lock-sheet" in parts[0] or i > 1:
            # Split body at next unnumbered ## (MUST RATTA, Final 50)
            tail = ""
            m = re.search(r"(?m)^## (?!\\d)", body)
            if m:
                tail = body[m.start() :]
                body = body[: m.start()]
            body = expand_body(body)
            if tail:
                if strip_heading_emoji:
                    tail_lines = []
                    for tl in tail.splitlines():
                        if tl.startswith("##"):
                            tail_lines.append(strip_emoji(tl))
                        else:
                            tail_lines.append(tl)
                    tail = "\n".join(tail_lines)
                body = body + "\n\n" + expand_body(tail) if " · " in tail else body + "\n\n" + tail
        out.append(heading)
        out.append("\n\n" + body.strip() + "\n\n")
        i += 2
    if i < len(parts):
        out.append(parts[i])
    return "".join(out)
