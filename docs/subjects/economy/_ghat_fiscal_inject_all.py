# -*- coding: utf-8 -*-
"""
Parse Ghatnachakra Fiscal Policy & Revenue paste and inject ALL exam stems
into Topic 2 — UPPCS → Complete Bank; everything else → Extra Drill.
Skips near-duplicates already present in the chapter.
"""
from __future__ import annotations

import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASTE = ROOT / "_fiscal_paste_raw.txt"
MD = ROOT / "02_Public_Finance_Budget_Taxation.md"

EXAM_RE = re.compile(
    r"("
    r"I\.A\.S\.\s*\([^)]+\)\s*\d{4}"
    r"|U\.P\.P\.C\.S\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*R\.O\./A\.R\.O\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.R\.O\./A\.R\.O\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*Lower\s*Sub\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*U\.D\.A\./L\.D\.A\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.B\.E\.O\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.P\.S\.C\.\s*\(GIC\)\s*\d{4}"
    r"|\d+(?:st|nd|rd|th)\s*B\.P\.S\.C\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Chhattisgarh\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|R\.A\.S\./?\s*R\.T\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Uttarakhand\s*(?:P\.C\.S\.|U\.D\.A\./L\.D\.A\.)\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Jharkhand\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|M\.P\.P?\.?C\.S\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r")",
    re.I,
)

ANS_RE = re.compile(r"Ans\.?\s*\(([a-d\*])\)", re.I)
OPT_RE = re.compile(
    r"\(([a-d])\)\s*([^\n(]+?)(?=\s*\([a-d]\)|\s*Ans\.|\s*$)",
    re.I | re.S,
)


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def fingerprint(stem: str) -> str:
    # first ~12 significant words
    words = [w for w in norm(stem).split() if len(w) > 2][:14]
    return " ".join(words)


def clean_text(s: str) -> str:
    s = re.sub(r"\s+", " ", s)
    s = s.replace("º", "%").replace("°", "%")
    return s.strip(" .;")


def is_uppcs(exam: str) -> bool:
    e = exam.upper()
    return "U.P.P.C.S" in e or "U.P. P.C.S" in e or "UPPCS" in e


def is_ro_aro(exam: str) -> bool:
    e = exam.upper()
    return "R.O" in e or "A.R.O" in e or "U.D.A" in e or "L.D.A" in e or "BEO" in e or "LOWER" in e or "GIC" in e


def parse_paste(text: str) -> list[dict]:
    # Drop user_query chrome
    text = re.sub(r"</?user_query>", "", text)
    text = text.replace("\r\n", "\n")
    # Cut at trailing assistant noise if any
    if "Fiscal Policy & Revenue" in text:
        i = text.index("Fiscal Policy & Revenue")
        text = text[i:]

    # Loose split on any numbered line; filter by Ans. + interrogative stem
    chunks = re.split(r"\n(?=\d{1,3}\.\s)", text)

    items = []
    seen_fp = set()

    for ch in chunks:
        ch = ch.strip()
        if len(ch) < 40:
            continue
        mnum = re.match(r"^(\d{1,3})\.\s+", ch)
        if not mnum:
            continue
        qnum = int(mnum.group(1))
        if qnum > 400:
            continue

        am = ANS_RE.search(ch)
        if not am:
            continue
        ans_letter = am.group(1).lower()
        if ans_letter == "*":
            # starred / year-sensitive — still keep with note
            ans_letter = "*"

        # body before Ans
        body = ch[: am.start()]
        # exam tag: prefer near Ans or after Ans first 400 chars
        after = ch[am.end() : am.end() + 500]
        exam_m = EXAM_RE.search(after) or EXAM_RE.search(body[-400:]) or EXAM_RE.search(ch)
        exam = clean_text(exam_m.group(1)) if exam_m else "Mixed / State PCS"

        # strip option lines from stem — take until first (a)
        opt_start = re.search(r"\n?\s*\(a\)", body, re.I)
        if opt_start:
            stem = body[: opt_start.start()]
            opts_blob = body[opt_start.start() :]
        else:
            # sometimes options inline after stem
            opt_start = re.search(r"\(a\)", body, re.I)
            if opt_start:
                stem = body[: opt_start.start()]
                opts_blob = body[opt_start.start() :]
            else:
                stem = body
                opts_blob = ""

        stem = re.sub(r"^\d{1,3}\.\s*", "", stem)
        stem = clean_text(stem)
        # Drop garbage stems (too short, or clearly not a question)
        if len(stem) < 20:
            continue
        low = stem.lower()
        if low.startswith(
            (
                "select the correct",
                "code:",
                "codes:",
                "of these",
                "see the explanation",
                "general studies",
                "economic & social",
            )
        ):
            continue
        # Skip pure explanatory numbered lists inside explanations / priority lists
        if re.match(
            r"^(Productivity and resilience|Inclusive Development|PM Gati|Manufacturing and Services|"
            r"Urban Development|Energy Security|Infrastructure|Innovation|Next Generation|"
            r"Decreasing food|Increasing taxes|Reducing taxes|Public assistance|Taxes, fees|"
            r"Grants|By State Government|From district|Market Borrowings|Short-term|"
            r"Securities against|State Provident|Other Receipts|External Debt|Draw Down)",
            stem,
            re.I,
        ):
            continue

        fp = fingerprint(stem)
        if not fp or fp in seen_fp:
            continue
        # Keep if interrogative OR classic stem verbs OR ends with ?
        if "?" not in stem and not re.search(
            r"\b(which|what|who|when|how|consider|match|assertion|regarding|with reference|"
            r"is/are|are|not included|not a|true for|related to|means|implies|equals|"
            r"formulates|published|introduced|levied|abolished|appointed|recommended|"
            r"correct|incorrect|largest|maximum|minimum|source|objective|tool|"
            r"concerned with|stands for|known as|first|latest)\b",
            stem,
            re.I,
        ):
            continue

        seen_fp.add(fp)

        # Parse options
        options = {}
        for om in re.finditer(r"\(([a-d])\)\s*([^(\n]+?)(?=\s*\([a-d]\)|\s*$)", opts_blob, re.I):
            letter = om.group(1).lower()
            val = clean_text(om.group(2))
            val = re.sub(r"\s*Ans\.?.*$", "", val, flags=re.I).strip()
            if 2 <= len(val) <= 220:
                options[letter] = val

        # If options thin, try whole body
        if len(options) < 2:
            options = {}
            for om in re.finditer(r"\(([a-d])\)\s*([^(\n]{2,200})", body, re.I):
                letter = om.group(1).lower()
                val = clean_text(om.group(2))
                val = re.sub(r"\s*(Ans\.|I\.A\.S\.|U\.P\.).*$", "", val, flags=re.I).strip()
                if 2 <= len(val) <= 220 and letter not in options:
                    options[letter] = val

        # Explanation snippet after Ans (before next numbered Q noise) — short
        expl = clean_text(ch[am.end() : am.end() + 350])
        expl = EXAM_RE.sub("", expl)
        expl = re.sub(r"^(General Studies|Economic & Social Development|E-\d+).*", "", expl)
        expl = clean_text(expl)[:280]

        items.append(
            {
                "qnum": qnum,
                "stem": stem,
                "options": options,
                "ans": ans_letter,
                "exam": exam,
                "expl": expl,
                "fp": fp,
            }
        )

    return items


def existing_fps(md: str) -> set[str]:
    fps = set()
    # rough: every **Q / With reference / Which / Consider lines
    for m in re.finditer(
        r"(?:\*\*Q\d+\.[^*]*\*\*\s*[—-]?\s*)?([^\n]{25,200})",
        md,
    ):
        fps.add(fingerprint(m.group(1)))
    for m in re.finditer(r"^[-*]?\s*\*\*[^*]+\*\*[^\n]{0,120}", md, re.M):
        fps.add(fingerprint(m.group(0)))
    return {f for f in fps if f}


def fmt_q(item: dict, qid: int, bank: bool) -> str:
    exam = item["exam"]
    stem = item["stem"]
    # Truncate absurdly long stems
    if len(stem) > 500:
        stem = stem[:497] + "…"

    head = f"**Q{qid}. {exam}**" if bank else f"**Q{qid}. {exam}**"
    lines = [head, "", stem, ""]

    opts = item["options"]
    if len(opts) >= 2:
        for L in "abcd":
            if L in opts:
                lines.append(f"{L.upper()}. {opts[L]}")
        lines.append("")
    else:
        # options failed OCR — keep stem + answer letter only with note
        lines.append("*(Options OCR-incomplete in source — key retained.)*")
        lines.append("")

    ans = item["ans"].upper() if item["ans"] != "*" else "*"
    expl = item["expl"]
    # strip leftover option letters from expl start
    expl = re.sub(r"^[A-D]\.\s*", "", expl)
    if len(expl) > 20 and not expl.lower().startswith(("see the", "general studies")):
        logic = expl
    else:
        logic = "Standard key from Ghatnachakra Fiscal Policy & Revenue."

    if bank:
        # Complete Bank: Logic then Ans
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Logic:** {logic}\n\n"
            f"**Ans: {ans}.**\n\n"
            "</details>\n"
        )
    else:
        # Extra Drill: Ans then Logic (same as existing Extra pattern mix — Extra had Ans first)
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Ans: {ans}.**\n\n"
            f"**Logic:** {logic}\n\n"
            "</details>\n"
        )

    lines.append(block)
    return "\n".join(lines)


def main():
    paste = PASTE.read_text(encoding="utf-8")
    md = MD.read_text(encoding="utf-8")
    items = parse_paste(paste)
    print(f"parsed unique stems: {len(items)}")

    have = existing_fps(md)
    fresh = [it for it in items if it["fp"] not in have]
    print(f"already covered-ish: {len(items) - len(fresh)}; fresh: {len(fresh)}")

    # Prefer UPPCS Pre into Complete Bank; RO/ARO + other UP into Extra Drill with all other exams
    bank_items = []
    extra_items = []
    for it in fresh:
        if is_uppcs(it["exam"]) and not is_ro_aro(it["exam"]):
            bank_items.append(it)
        else:
            extra_items.append(it)

    # Sort by original paste number for stability
    bank_items.sort(key=lambda x: x["qnum"])
    extra_items.sort(key=lambda x: x["qnum"])

    print(f"to Complete Bank (UPPCS): {len(bank_items)}")
    print(f"to Extra Drill (all other): {len(extra_items)}")

    # Find next Q numbers — section-scoped so Extra tags don't inflate Bank
    bank_sec = md.split("## Complete PYQ Bank (UPPCS)")[1].split("## Ghatnachakra Extra Drill")[0]
    extra_sec = md.split("## Ghatnachakra Extra Drill")[1].split("## UKPCS")[0]
    bank_nums = [int(x) for x in re.findall(r"\*\*Q(\d+)\.", bank_sec)]
    next_bank = max(bank_nums) + 1 if bank_nums else 1
    extra_nums = [int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra_sec)]
    next_extra = max(extra_nums) + 1 if extra_nums else 1

    bank_md = []
    n = next_bank
    for it in bank_items:
        bank_md.append(fmt_q(it, n, bank=True))
        n += 1

    extra_md = []
    n = next_extra
    for it in extra_items:
        extra_md.append(fmt_q(it, n, bank=False))
        n += 1

    bank_blob = "\n".join(bank_md)
    extra_blob = "\n".join(extra_md)

    # Insert bank before Extra Drill
    bank_anchor = "## Ghatnachakra Extra Drill — Public Finance, Budget and Taxation"
    if bank_blob:
        if "---\n\n" + bank_anchor in md:
            md = md.replace(
                "---\n\n" + bank_anchor,
                bank_blob + "\n---\n\n" + bank_anchor,
                1,
            )
        else:
            md = md.replace(bank_anchor, bank_blob + "\n---\n\n" + bank_anchor, 1)

    # Insert extra before UKPCS
    extra_anchor = "## UKPCS Prelims Bank"
    if extra_blob:
        # Update Extra note
        md = md.replace(
            "Extra Drill absorbs Ghatnachakra **Fiscal Policy & Revenue** stems (IAS / BPSC / State PCS / RO–ARO) behind the UPPCS Complete Bank. Expand further when newer Purvalokan pages are pasted.",
            "Extra Drill: **full** Ghatnachakra Fiscal Policy & Revenue coverage — IAS, BPSC, Chhattisgarh, RAS, MP, Jharkhand, Uttarakhand, RO/ARO and other State papers (not UPPCS-only).",
            1,
        )
        if "---\n\n" + extra_anchor in md:
            md = md.replace(
                "---\n\n" + extra_anchor,
                extra_blob + "\n---\n\n" + extra_anchor,
                1,
            )
        else:
            md = md.replace(extra_anchor, extra_blob + "\n---\n\n" + extra_anchor, 1)

    MD.write_text(md, encoding="utf-8")
    print(f"wrote bank Q{next_bank}–{next_bank + len(bank_items) - 1 if bank_items else 'none'}")
    print(f"wrote extra Q{next_extra}–{next_extra + len(extra_items) - 1 if extra_items else 'none'}")
    print("done")


if __name__ == "__main__":
    main()
