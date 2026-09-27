#!/usr/bin/env python3
"""Build ONE complete Current Affairs print PDF for ratta.

Output: pdfs/current-affairs/Current Affairs — Complete Printout.pdf

Includes Master Tables + Month Digests + Topic Sheets.
Strips Practice Zone, MCQs, Show-answer blocks, and analysis/meta fluff.
"""

from __future__ import annotations

import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parents[3]
CA_ROOT = ROOT / "docs" / "current-affairs"
TOPICS = CA_ROOT / "topics"
MONTHS = TOPICS / "months"
OUT_DIR = ROOT / "pdfs" / "current-affairs"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
OUT_NAME = "Current Affairs — Complete Printout.pdf"

SKIP_STEM = re.compile(
    r"^(index|15_practice_zone|prompt|00_master_tables)$",
    re.I,
)

MONTH_LABEL = {
    "2026-01": "January 2026",
    "2026-02": "February 2026",
    "2026-03": "March 2026",
    "2026-04": "April 2026",
    "2026-05": "May 2026",
    "2026-06": "June 2026",
    "2026-07": "July 2026",
    "2026-08": "August 2026",
    "2026-09": "September 2026",
    "2026-10": "October 2026",
    "2026-11": "November 2026",
    "2026-12": "December 2026",
}

CSS = """
:root { --ink: #1e293b; --muted: #64748b; --line: #e2e8f0; --navy: #273c75; --amber: #d97706; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  color: var(--ink);
  font-family: "Segoe UI", Calibri, "Nirmala UI", sans-serif;
  font-size: 9.6pt;
  line-height: 1.38;
}
.cover {
  page-break-after: always;
  padding: 24mm 8mm 0;
}
.cover h1 {
  margin: 0 0 .35rem;
  font-size: 24pt;
  line-height: 1.15;
  color: var(--navy);
  border: 0;
}
.cover .kind {
  display: inline-block;
  margin-bottom: 1rem;
  padding: .12rem .55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--amber) 18%, white);
  color: #92400e;
  font-size: 9.5pt;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.cover p { color: var(--muted); max-width: 38rem; margin: .35rem 0; }
nav.toc { column-count: 2; column-gap: 1.2rem; font-size: 9pt; }
nav.toc a { color: var(--ink); text-decoration: none; }
nav.toc ol { margin: 0; padding-left: 1.1rem; }
nav.toc li { break-inside: avoid; margin: .12rem 0; }
h1, h2, h3, h4 { color: var(--navy); page-break-after: avoid; }
h1 {
  font-size: 14.5pt;
  margin: 0 0 .55rem;
  padding-bottom: .25rem;
  border-bottom: 3px solid var(--amber);
}
h2 { font-size: 11.5pt; margin: .85rem 0 .3rem; border-bottom: 1px solid var(--line); padding-bottom: .15rem; }
h3 { font-size: 10.4pt; margin: .7rem 0 .22rem; }
h4 { font-size: 9.8pt; margin: .55rem 0 .18rem; }
.chapter { page-break-before: always; }
.chapter:first-of-type { page-break-before: auto; }
.part {
  margin: 0 0 .4rem;
  color: var(--amber);
  font-size: 9pt;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}
p { margin: .18rem 0 .28rem; }
ul, ol { margin: .15rem 0 .4rem; padding-left: 1.1rem; }
li { margin: .08rem 0; }
strong { font-weight: 700; }
blockquote {
  margin: .35rem 0;
  padding: .25rem .55rem;
  border-left: 3px solid var(--navy);
  background: #f8fafc;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: .3rem 0 .55rem;
  font-size: 8.2pt;
  page-break-inside: auto;
}
thead { display: table-header-group; }
tr { page-break-inside: avoid; }
th, td {
  border: 1px solid #cbd5e1;
  padding: .16rem .32rem;
  vertical-align: top;
  text-align: left;
}
th {
  background: var(--navy);
  color: #fff;
  font-weight: 700;
}
tr:nth-child(even) td { background: #f8fafc; }
hr { border: 0; border-top: 1px solid var(--line); margin: .55rem 0; }
.empty { color: var(--muted); font-style: italic; }
a { color: inherit; text-decoration: none; }
@page {
  size: A4;
  margin: 11mm 9mm 12mm;
}
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
"""


def md_to_html(text: str) -> str:
    return markdown.markdown(
        text,
        extensions=["tables", "sane_lists", "smarty", "fenced_code"],
        output_format="html5",
    )


def slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s or "chapter"


def strip_for_ratta(text: str) -> str:
    """Keep facts only — drop questions, answers, practice, meta nav fluff."""
    # Hidden answers
    text = re.sub(r"<details>.*?</details>", "", text, flags=re.S | re.I)
    # Practice Zone / UKPCS practice / complete banks if any
    text = re.sub(
        r"(?im)^##\s+(Practice Zone|Complete PYQ|Ghatnachakra|Inline PYQ|Extra Drill)\b[\s\S]*",
        "",
        text,
    )
    # Standalone MCQ blocks starting with **Q1.** / Q1. / **Q12. UKPCS**
    text = re.sub(
        r"(?im)^\*\*Q\d+[\s\S]*?(?=^\*\*Q\d+|^##\s|^#\s|\Z)",
        "",
        text,
    )
    text = re.sub(
        r"(?im)^Q\d+\.\s[\s\S]*?(?=^Q\d+\.|^##\s|^#\s|\Z)",
        "",
        text,
    )
    # Admonition lines that only point elsewhere
    text = re.sub(
        r"(?im)^!!!\s+(tip|note|info|warning|trap)\s*(\"[^\"]*\")?\s*\n(?:[ \t].*\n)*",
        "",
        text,
    )
    # Cross-file “Open / Full card / see →” lines that waste print space
    text = re.sub(r"(?im)^.*\b(Full (easy )?card|Full board|Open the hub|see →|→ \[).*$\n?", "", text)
    # Month digest “Open” markdown links in table cells — leave cell text, strip link markup later
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Drop “Use this page…” / “What to note every time” meta intros if they are only process
    text = re.sub(
        r"(?im)^##\s+What to note every time\n(?:\|.*\n)+",
        "",
        text,
    )
    text = re.sub(
        r"(?im)^Use this page for quick revision\..*$",
        "",
        text,
    )
    text = re.sub(
        r"(?im)^Detail lives in the topic sheets\..*$",
        "",
        text,
    )
    text = re.sub(
        r"(?im)^##\s+Next\n[\s\S]*?(?=^##\s|\Z)",
        "",
        text,
    )
    # Collapse blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def drop_h1(text: str) -> str:
    return re.sub(r"^#\s+[^\n]+\n+", "", text).strip()


def wrap_document(chapters: list[tuple[str, str, str]]) -> str:
    """chapters: (part_label, title, md_body)"""
    toc_items = []
    body_parts = []
    for part, title, md_body in chapters:
        anchor = slug(f"{part}-{title}")
        toc_label = f"{title}" if not part else f"{title}"
        toc_items.append(f'<li><a href="#{anchor}">{toc_label}</a></li>')
        inner = md_to_html(md_body) if md_body.strip() else '<p class="empty">No content.</p>'
        part_html = f'<div class="part">{part}</div>' if part else ""
        body_parts.append(
            f'<article class="chapter" id="{anchor}">\n{part_html}<h1>{title}</h1>\n{inner}\n</article>'
        )
    toc = "<ol>" + "".join(toc_items) + "</ol>"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Current Affairs — Complete Printout</title>
  <style>{CSS}</style>
</head>
<body>
  <section class="cover">
    <div class="kind">Complete printout · Ratta pack</div>
    <h1>Current Affairs</h1>
    <p>One file for printing. Master tables, month digests, and all topic sheets.</p>
    <p>Questions, Practice Zone, and Show-answer blocks are removed.</p>
    <p>UPPCS + UKPCS Study Library · 2026 CA desk.</p>
    <h2>Contents</h2>
    <nav class="toc">{toc}</nav>
  </section>
  {"".join(body_parts)}
</body>
</html>
"""


def html_to_pdf(html_path: Path, pdf_path: Path) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    if pdf_path.exists():
        pdf_path.unlink()
    cmd = [
        str(CHROME),
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--allow-file-access-from-files",
        f"--print-to-pdf={pdf_path}",
        html_path.resolve().as_uri(),
    ]
    subprocess.run(cmd, check=True, timeout=600)


def topic_nav() -> list[tuple[str, Path]]:
    pages = TOPICS / ".pages"
    data = yaml.safe_load(pages.read_text(encoding="utf-8")) or {}
    items: list[tuple[str, Path]] = []
    for entry in data.get("nav") or []:
        if not isinstance(entry, dict):
            continue
        for label, target in entry.items():
            if target in (None, True, False) or str(target) == "months":
                continue
            path = TOPICS / str(target)
            if path.suffix == ".md" and path.exists() and not SKIP_STEM.search(path.stem):
                items.append((str(label), path))
    return items


def build_chapters() -> list[tuple[str, str, str]]:
    chapters: list[tuple[str, str, str]] = []

    master = TOPICS / "00_Master_Tables.md"
    if master.exists():
        body = strip_for_ratta(drop_h1(master.read_text(encoding="utf-8")))
        chapters.append(("Part A · Boards", "Master Fact Tables", body))

    for path in sorted(MONTHS.glob("2026-*.md")):
        body = strip_for_ratta(drop_h1(path.read_text(encoding="utf-8")))
        # Drop Open column header noise by renaming if present
        body = body.replace("| Open |", "| |").replace("|------|", "|---|")
        title = MONTH_LABEL.get(path.stem, path.stem)
        chapters.append(("Part B · Months", title, body))

    for label, path in topic_nav():
        body = strip_for_ratta(drop_h1(path.read_text(encoding="utf-8")))
        if not body:
            continue
        chapters.append(("Part C · Topics", label, body))

    return chapters


def main() -> int:
    if not CHROME.exists():
        print("Chrome not found at", CHROME)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chapters = build_chapters()
    if not chapters:
        print("No chapters found.")
        return 1

    print(f"Building one complete CA printout ({len(chapters)} chapters)...", flush=True)
    html = wrap_document(chapters)
    tmp = Path(tempfile.mkdtemp(prefix="uppcs-ca-one-"))
    try:
        html_path = tmp / "ca-complete.html"
        html_path.write_text(html, encoding="utf-8")
        pdf_path = OUT_DIR / OUT_NAME
        html_to_pdf(html_path, pdf_path)
        size = pdf_path.stat().st_size / (1024 * 1024)
        print(f"Wrote: {pdf_path}  ({size:.1f} MB)", flush=True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    # Remove older split packs so the folder is clear for printing
    for old in OUT_DIR.glob("Current Affairs — *.pdf"):
        if old.name != OUT_NAME:
            old.unlink(missing_ok=True)
            print(f"Removed old split: {old.name}", flush=True)

    (OUT_DIR / "README.md").write_text(
        "# Current Affairs print\n\n"
        f"**Print this file only:** `{OUT_NAME}`\n\n"
        "Complete ratta pack — Master Tables + Month Digests + Topic Sheets.\n"
        "Questions / Practice Zone / Show-answer blocks are stripped.\n\n"
        "Rebuild:\n\n"
        "```text\n"
        "python docs/current-affairs/_build/build_ca_pdfs.py\n"
        "```\n",
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
