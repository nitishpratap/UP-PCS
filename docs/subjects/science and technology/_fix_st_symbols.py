# -*- coding: utf-8 -*-
"""Restore eaten LaTeX escapes and scrub Exam/Lock UI in Science & Technology notes."""
from pathlib import Path
import re

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\science and technology")

TAB, CR, LF, FF, VT, BEL, BS = "\t", "\r", "\n", "\x0c", "\x0b", "\x07", "\x08"

REPLS = [
    (TAB + "imes", r"\times"),
    (TAB + "ext", r"\text"),
    (TAB + "heta", r"\theta"),
    (TAB + "au", r"\tau"),
    (TAB + "mu", r"\mu"),
    (TAB + "rho", r"\rho"),
    (TAB + "pi", r"\pi"),
    (CR + "ightarrow", r"\rightarrow"),
    (CR + "ightleftarrows", r"\rightleftarrows"),
    (CR + "ight", r"\right"),  # leftover \right after CR eaten from \rightarrow partially
    (FF + "rac", r"\frac"),
    (VT + "ec", r"\vec"),
    (BEL + "lpha", r"\alpha"),
    (BEL + "pprox", r"\approx"),
    (BEL + "ngle", r"\angle"),
    (BEL + "st", r"\ast"),
    (BS + "eta", r"\beta"),
    (BS + "ar{", r"\bar{"),
    (BS + "ig", r"\big"),
]


def restore_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    original = text
    counts = {}

    for broken, fixed in REPLS:
        n = text.count(broken)
        if n:
            text = text.replace(broken, fixed)
            counts[fixed] = counts.get(fixed, 0) + n

    # nh\n u / h\n u → \nu
    text2, n = re.subn(r"(nh|[^\\\w]h)\s*\n\s*u(\$|\)| -|\\phi|,)", r"\1\\nu\2", text)
    text = text2
    if n:
        counts[r"\nu"] = counts.get(r"\nu", 0) + n

    # orphan ightarrow after newline (CR already became \n in some editors)
    text2, n = re.subn(r"\n[ \t]*ightarrow", r" \\rightarrow", text)
    text = text2
    if n:
        counts["orphan_rightarrow"] = n

    # orphan ightarrow mid-line after non-backslash
    text2, n = re.subn(r"(?<![\\a-zA-Z])ightarrow", r"\\rightarrow", text)
    text = text2
    if n:
        counts["mid_rightarrow"] = n

    # $...rac{ → \frac{ inside math (remaining after FF strip)
    def fix_rac_in_math(m):
        inner = m.group(1)
        if "rac{" in inner and r"\frac{" not in inner.replace("prac{", ""):
            # only replace rac{ that isn't part of a word
            inner2 = re.sub(r"(?<![A-Za-z\\])rac\{", r"\\frac{", inner)
            return "$" + inner2 + "$"
        return m.group(0)

    text2, n = re.subn(r"\$([^$\n]{0,120})\$", fix_rac_in_math, text)
    text = text2
    if n:
        counts["frac_pass"] = n

    # $-Linolenic → $\alpha$-Linolenic
    text2, n = re.subn(r"\$\-Linolenic", r"$\\alpha$-Linolenic", text)
    text = text2
    if n:
        counts["alpha_linolenic"] = n

    # Scrub Exam / Lock UI
    scrub = [
        ("## Current Affairs & Exam Locks", "## Current Affairs"),
        ("Current Affairs & Exam Locks", "Current Affairs"),
        ("High-Yield Exam Lock", "Must-Score Fact"),
        ("**Exam Lock & Core Concepts:**", "**Logic:**"),
        ("Exam Lock & Core Concepts", "Logic"),
        ("**Exam Lock:**", "**Logic:**"),
        ("Crucial Exam Lock", "Must-Score Fact"),
        ("### Ghatnachakra Master Locks", "## Ghatnachakra Extra Drill"),
        ("Ghatnachakra Master Locks", "Ghatnachakra Extra Drill"),
        ("Dense Locks · Zero Fluff", "Lucent / PW style"),
        ("Dense Locks", "Must-Score Facts"),
    ]
    for a, b in scrub:
        if a in text:
            c = text.count(a)
            text = text.replace(a, b)
            counts["scrub:" + a[:24]] = c

    text = re.sub(r"\bExam Locks?\b", "Must-Score", text)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
    return counts


def scan_remaining(path: Path) -> dict:
    raw = path.read_bytes()
    hits = {}
    for name, b in [
        ("TAB+imes", b"\times"),  # wrong
        ("TAB+imes", bytes([9]) + b"imes"),
        ("TAB+ext", bytes([9]) + b"ext"),
        ("TAB+heta", bytes([9]) + b"heta"),
        ("CR+ight", bytes([13]) + b"ight"),
        ("BEL+lpha", bytes([7]) + b"lpha"),
        ("BEL+pprox", bytes([7]) + b"pprox"),
        ("BS+eta", bytes([8]) + b"eta"),
        ("FF+rac", bytes([12]) + b"rac"),
        ("VT+ec", bytes([11]) + b"ec"),
        ("orphan_ightarrow", b"\nightarrow"),
    ]:
        n = raw.count(b)
        if n:
            hits[name] = n
    return hits


def main():
    total = {}
    for p in sorted(ROOT.glob("[0-9][0-9]_*.md")):
        c = restore_file(p)
        if c:
            print("FIXED", p.name, c)
            for k, v in c.items():
                total[k] = total.get(k, 0) + (v if isinstance(v, int) else 0)
    print("--- remaining control escapes ---")
    left = False
    for p in sorted(ROOT.glob("[0-9][0-9]_*.md")):
        h = scan_remaining(p)
        if h:
            left = True
            print("LEFT", p.name, h)
    if not left:
        print("clean")
    print("TOTAL_KEYS", len(total))


if __name__ == "__main__":
    main()
