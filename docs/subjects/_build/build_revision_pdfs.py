#!/usr/bin/env python3
"""Build two revision PDFs per subject:

1. Must-Score Facts — consolidated / must-score lists per chapter
2. Tables & High-Yield — teaching tables, confused pairs, traps, CA, spines
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parents[3]
SUBJECTS_ROOT = ROOT / "docs" / "subjects"
OUT_DIR = ROOT / "pdfs" / "subject-revision"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")

SKIP_TITLE = re.compile(
    r"complete pyq|practice zone|ghatnachakra|inline pyq|extra drill|"
    r"ukpcs complete|covers syllabus|pyq trend|trend analysis",
    re.I,
)
MUST_SCORE_TITLE = re.compile(
    r"must-score|must score|^consolidated\b|one-liner revision",
    re.I,
)
HIGH_YIELD_TITLE = re.compile(
    r"confused pair|common traps|current affairs|quick revision|"
    r"spine only|master table|high-yield",
    re.I,
)
SKIP_FILE = re.compile(
    r"^(index|00_syllabus|00_prelims_analysis|prompt)$|"
    r"pyq_bank|pyq_trend|trend_analysis|00_ukpcs_pyq",
    re.I,
)
H2_SPLIT = re.compile(r"(?m)^## ")
TABLE_SEP = re.compile(r"^\s*\|?\s*:?-{3,}")

CSS = """
:root { --ink: #1e293b; --muted: #64748b; --line: #e2e8f0; --navy: #273c75; --amber: #d97706; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  color: var(--ink);
  font-family: "Segoe UI", Calibri, "Nirmala UI", sans-serif;
  font-size: 10.4pt;
  line-height: 1.45;
}
.cover {
  page-break-after: always;
  padding: 28mm 8mm 0;
}
.cover h1 {
  margin: 0 0 .4rem;
  font-size: 28pt;
  line-height: 1.15;
  color: var(--navy);
  border: 0;
}
.cover .kind {
  display: inline-block;
  margin-bottom: 1.2rem;
  padding: .15rem .6rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--amber) 18%, white);
  color: #92400e;
  font-size: 10pt;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.cover p { color: var(--muted); max-width: 36rem; }
nav.toc { column-count: 2; column-gap: 1.4rem; font-size: 9.5pt; }
nav.toc a { color: var(--ink); text-decoration: none; }
nav.toc ol { margin: 0; padding-left: 1.2rem; }
nav.toc li { break-inside: avoid; margin: .18rem 0; }
h1, h2, h3, h4 { color: var(--navy); page-break-after: avoid; }
h1 {
  font-size: 16pt;
  margin: 0 0 .8rem;
  padding-bottom: .35rem;
  border-bottom: 3px solid var(--amber);
}
h2 { font-size: 12.5pt; margin: 1.1rem 0 .4rem; border-bottom: 1px solid var(--line); padding-bottom: .2rem; }
h3 { font-size: 11pt; margin: .9rem 0 .3rem; }
h4 { font-size: 10.4pt; margin: .7rem 0 .25rem; }
.chapter { page-break-before: always; }
.chapter:first-of-type { page-break-before: auto; }
p { margin: .28rem 0 .4rem; }
ul, ol { margin: .2rem 0 .55rem; padding-left: 1.2rem; }
li { margin: .12rem 0; }
strong { font-weight: 700; }
blockquote {
  margin: .5rem 0;
  padding: .35rem .7rem;
  border-left: 3px solid var(--navy);
  background: #f8fafc;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: .4rem 0 .8rem;
  font-size: 8.7pt;
  page-break-inside: auto;
}
thead { display: table-header-group; }
tr { page-break-inside: avoid; }
th, td {
  border: 1px solid #cbd5e1;
  padding: .22rem .4rem;
  vertical-align: top;
  text-align: left;
}
th {
  background: var(--navy);
  color: #fff;
  font-weight: 700;
}
tr:nth-child(even) td { background: #f8fafc; }
img { max-width: 100%; height: auto; }
hr { border: 0; border-top: 1px solid var(--line); margin: .8rem 0; }
.empty { color: var(--muted); font-style: italic; }
@page {
  size: A4;
  margin: 13mm 11mm 15mm;
  @bottom-center {
    content: counter(page);
    font-size: 8.5pt;
    color: #64748b;
  }
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


def clean_heading(title: str) -> str:
    title = title.strip()
    title = re.sub(r"\s*\{#[^}]+\}\s*$", "", title)
    title = title.replace("¶", "").strip()
    return title


def strip_noise(text: str) -> str:
    text = re.sub(r"<details>.*?</details>", "", text, flags=re.S | re.I)
    text = re.sub(r"\$\$([^$]+)\$\$", r"\1", text)
    text = re.sub(r"\$([^$]+)\$", r"\1", text)
    return text.strip()


def rewrite_images(text: str, base: Path) -> str:
    def repl(match: re.Match[str]) -> str:
        alt, src = match.group(1), match.group(2).strip()
        if src.startswith(("http://", "https://", "file:")):
            return match.group(0)
        path = (base / src).resolve()
        if path.exists():
            return f"![{alt}]({path.as_uri()})"
        return f"*{alt}*" if alt else ""

    return re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", repl, text)


def split_h2(md_text: str) -> tuple[str, list[tuple[str, str]]]:
    parts = H2_SPLIT.split(md_text)
    preamble = parts[0] if parts else ""
    sections: list[tuple[str, str]] = []
    for part in parts[1:]:
        title, _, body = part.partition("\n")
        sections.append((clean_heading(title), body))
    return preamble, sections


def is_table_row(line: str) -> bool:
    return line.strip().startswith("|")


def extract_teaching_tables(body: str) -> str:
    lines = body.splitlines()
    chunks: list[str] = []
    last_h3 = ""
    last_h4 = ""
    i = 0
    while i < len(lines):
        raw = lines[i]
        if raw.startswith("### "):
            last_h3 = raw
            last_h4 = ""
        elif raw.startswith("#### "):
            last_h4 = raw
        if is_table_row(raw) and i + 1 < len(lines) and TABLE_SEP.search(lines[i + 1] or ""):
            table: list[str] = []
            while i < len(lines) and is_table_row(lines[i]):
                table.append(lines[i])
                i += 1
            if len(table) >= 3:
                heading = last_h4 or last_h3
                block = (heading + "\n\n" if heading else "") + "\n".join(table)
                chunks.append(block)
            continue
        i += 1
    return "\n\n".join(chunks).strip()


def classify_file(path: Path) -> str | None:
    stem = path.stem
    if SKIP_FILE.search(stem):
        return None
    name = stem.lower()
    if "daily_revision" in name or "one_liner" in name:
        return "facts-file"
    if "chronology" in name:
        return "tables-file"
    return "chapter"


def extract_chapter(path: Path) -> tuple[str, str]:
    text = path.read_text(encoding="utf-8")
    text = rewrite_images(strip_noise(text), path.parent)
    kind = classify_file(path)
    if kind == "facts-file":
        _, sections = split_h2(text)
        body = "\n\n".join(f"## {t}\n\n{b}".strip() for t, b in sections) or text
        return body.strip(), ""
    if kind == "tables-file":
        _, sections = split_h2(text)
        body = "\n\n".join(f"## {t}\n\n{b}".strip() for t, b in sections) or text
        return "", body.strip()

    _, sections = split_h2(text)
    facts: list[str] = []
    tables: list[str] = []
    for title, body in sections:
        if SKIP_TITLE.search(title):
            continue
        block = f"## {title}\n\n{body}".strip()
        if MUST_SCORE_TITLE.search(title):
            facts.append(block)
            continue
        if HIGH_YIELD_TITLE.search(title):
            tables.append(block)
            continue
        teaching_tables = extract_teaching_tables(body)
        if teaching_tables:
            tables.append(f"## {title}\n\n{teaching_tables}")
    return "\n\n---\n\n".join(facts).strip(), "\n\n---\n\n".join(tables).strip()


def load_pages_nav(pages_file: Path) -> list:
    if not pages_file.exists():
        return []
    data = yaml.safe_load(pages_file.read_text(encoding="utf-8")) or {}
    return data.get("nav") or []


def walk_nav(folder: Path, nav: list, prefix: str = "") -> list[tuple[str, Path]]:
    chapters: list[tuple[str, Path]] = []
    for item in nav:
        if isinstance(item, str):
            path = folder / item
            if path.is_dir():
                nested = load_pages_nav(path / ".pages")
                label = path.name.replace("_", " ").title()
                chapters.extend(walk_nav(path, nested, prefix=f"{prefix}{label} — " if prefix else f"{label} — "))
            elif path.suffix == ".md":
                title = path.stem.replace("_", " ")
                chapters.append((prefix + title, path))
            continue
        if not isinstance(item, dict):
            continue
        for label, target in item.items():
            if target in (None, True, False):
                continue
            target = str(target)
            path = folder / target
            if path.is_dir():
                nested = load_pages_nav(path / ".pages")
                nest_prefix = f"{prefix}{label} — "
                if nested:
                    chapters.extend(walk_nav(path, nested, prefix=nest_prefix))
                else:
                    for child in sorted(path.glob("*.md")):
                        chapters.append((nest_prefix + child.stem.replace("_", " "), child))
            elif path.suffix == ".md":
                chapters.append((prefix + str(label), path))
    return chapters


def chapter_list(subject_dir: Path) -> list[tuple[str, Path]]:
    nav = load_pages_nav(subject_dir / ".pages")
    if nav:
        return walk_nav(subject_dir, nav)
    return [(p.stem.replace("_", " "), p) for p in sorted(subject_dir.rglob("*.md"))]


def wrap_document(subject: str, kind: str, blurb: str, chapters: list[tuple[str, str]]) -> str:
    toc_items = []
    body_parts = []
    for title, md_body in chapters:
        anchor = slug(title)
        toc_items.append(f'<li><a href="#{anchor}">{title}</a></li>')
        inner = md_to_html(md_body) if md_body else '<p class="empty">No items in this chapter.</p>'
        body_parts.append(
            f'<article class="chapter" id="{anchor}">\n<h1>{title}</h1>\n{inner}\n</article>'
        )
    toc = "<ol>" + "".join(toc_items) + "</ol>" if toc_items else "<p>No chapters.</p>"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{subject} — {kind}</title>
  <style>{CSS}</style>
</head>
<body>
  <section class="cover">
    <div class="kind">{kind}</div>
    <h1>{subject}</h1>
    <p>{blurb}</p>
    <p>UPPCS + UKPCS Study Library · chapter order follows Subject Notes.</p>
    <h2>Chapters</h2>
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
    subprocess.run(cmd, check=True, timeout=240)


def subject_folders() -> list[tuple[str, Path]]:
    pages = SUBJECTS_ROOT / ".pages"
    data = yaml.safe_load(pages.read_text(encoding="utf-8")) or {}
    out: list[tuple[str, Path]] = []
    for item in data.get("nav") or []:
        if isinstance(item, dict):
            for label, folder in item.items():
                path = SUBJECTS_ROOT / str(folder)
                if path.is_dir():
                    out.append((str(label), path))
    return out


def build_subject(label: str, folder: Path, tmp: Path) -> list[Path]:
    facts_chapters: list[tuple[str, str]] = []
    table_chapters: list[tuple[str, str]] = []
    for title, path in chapter_list(folder):
        if not path.exists() or classify_file(path) is None:
            continue
        facts, tables = extract_chapter(path)
        if facts:
            facts_chapters.append((title, facts))
        if tables:
            table_chapters.append((title, tables))

    written: list[Path] = []
    safe = re.sub(r"[\\\\/:*?\"<>|]", " ", label).strip()
    if facts_chapters:
        html = wrap_document(
            label,
            "Must-Score Facts",
            "Consolidated Must-Score Facts and must-score drill cards for every chapter.",
            facts_chapters,
        )
        html_path = tmp / f"{safe} — Must-Score Facts.html"
        html_path.write_text(html, encoding="utf-8")
        pdf_path = OUT_DIR / f"{safe} — Must-Score Facts.pdf"
        print(f"  PDF 1/2  {pdf_path.name}  ({len(facts_chapters)} chapters)", flush=True)
        html_to_pdf(html_path, pdf_path)
        written.append(pdf_path)
    else:
        print(f"  skip facts — nothing to extract", flush=True)

    if table_chapters:
        html = wrap_document(
            label,
            "Tables & High-Yield",
            "Teaching tables, Confused Pairs, Common Traps, Current Affairs, and other high-yield blocks.",
            table_chapters,
        )
        html_path = tmp / f"{safe} — Tables and High-Yield.html"
        html_path.write_text(html, encoding="utf-8")
        pdf_path = OUT_DIR / f"{safe} — Tables and High-Yield.pdf"
        print(f"  PDF 2/2  {pdf_path.name}  ({len(table_chapters)} chapters)", flush=True)
        html_to_pdf(html_path, pdf_path)
        written.append(pdf_path)
    else:
        print(f"  skip tables — nothing to extract", flush=True)
    return written


def main() -> int:
    if not CHROME.exists():
        print("Chrome not found at", CHROME, file=sys.stderr)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]
    subjects = subject_folders()
    if wanted:
        subjects = [
            item
            for item in subjects
            if item[0].lower() in {w.lower() for w in wanted}
            or item[1].name.lower() in {w.lower() for w in wanted}
        ]
    if not subjects:
        print("No matching subjects.", file=sys.stderr)
        return 1

    written: list[Path] = []
    tmp = Path(tempfile.mkdtemp(prefix="uppcs-pdfs-"))
    try:
        for label, folder in subjects:
            print(f"\n== {label} ==", flush=True)
            written.extend(build_subject(label, folder, tmp))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print("\nWrote:")
    for path in written:
        size = path.stat().st_size / (1024 * 1024)
        print(f"  {path}  ({size:.1f} MB)")
    print(f"\n{len(written)} PDFs in {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
