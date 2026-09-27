# -*- coding: utf-8 -*-
"""
Parse Ghatnachakra Employment & Welfare Schemes paste → Topic 8.
UPPCS (Pre/Mains, not RO/ARO/Lower/UDA) → Complete Bank; everything else → Extra Drill.
Does not touch Consolidated (cap 50).
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASTE = ROOT / "_welfare_schemes_paste3_raw.txt"
MD = ROOT / "08_Employment_Poverty_Human_Capital.md"

EXAM_RE = re.compile(
    r"("
    r"I\.A\.S\.\s*\([^)]+\)\s*\d{4}"
    r"|U\.P\.P\.C\.S\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.P\.S\.C\.\s*\(R\.I\.\)\s*\d{4}"
    r"|U\.P\.\s*R\.O\./A\.R\.O\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.R\.O\./A\.R\.O\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*Lower\s*Sub\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.\s*U\.D\.A\./L\.D\.A\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.B\.E\.O\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|U\.P\.P\.S\.C\.\s*\(GIC\)\s*\d{4}"
    r"|\d+(?:st|nd|rd|th)\s*B\.P\.S\.C\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Chhattisgarh\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|R\.A\.S\./?\s*R\.T\.S\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Uttarakhand\s*(?:P\.C\.S\.|U\.D\.A\./L\.D\.A\.)\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Uttrakhand\s*(?:P\.C\.S\.|U\.D\.A\./L\.D\.A\.)\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|Jharkhand\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r"|M\.P\.P?\.?C\.S\.\s*(?:\([^)]+\))?\s*(?:\([^)]+\))?\s*\d{4}"
    r"|M\.P\.\s*P\.C\.S\.\s*(?:\([^)]+\))?\s*\d{4}"
    r")",
    re.I,
)

ANS_RE = re.compile(r"Ans\.?\s*\(([a-e\*])\)", re.I)


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def fingerprint(stem: str) -> str:
    words = [w for w in norm(stem).split() if len(w) > 2][:14]
    return " ".join(words)


def clean_text(s: str) -> str:
    s = re.sub(r"\s+", " ", s)
    s = s.replace("º", "%").replace("°", "%")
    return s.strip(" .;")


def is_uppcs(exam: str) -> bool:
    e = exam.upper()
    return "U.P.P.C.S" in e or "U.P. P.C.S" in e or "UPPCS" in e or "U.P.P.S.C. (R.I.)" in e


def is_ro_aro(exam: str) -> bool:
    e = exam.upper()
    return (
        "R.O" in e
        or "A.R.O" in e
        or "U.D.A" in e
        or "L.D.A" in e
        or "BEO" in e
        or "LOWER" in e
        or "GIC" in e
    )


def parse_paste(text: str) -> list[dict]:
    text = text.replace("\r\n", "\n")
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

        body = ch[: am.start()]
        after = ch[am.end() : am.end() + 600]
        exam_m = EXAM_RE.search(after) or EXAM_RE.search(body[-400:]) or EXAM_RE.search(ch)
        exam = clean_text(exam_m.group(1)) if exam_m else "Mixed / State PCS"

        opt_start = re.search(r"\(a\)", body, re.I)
        if opt_start:
            stem = body[: opt_start.start()]
        else:
            stem = body
        stem = re.sub(r"^\d{1,3}\.\s*", "", stem)
        stem = re.sub(r"\s+", " ", stem).strip(" .;")
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
                "the correctly matched",
                "hence,",
                "among the given",
            )
        ):
            continue
        if re.match(r"^[1234]\.\s+", stem) and not re.search(
            r"\b(consider|which|what|who|match|assertion)\b", stem, re.I
        ):
            continue

        fp = fingerprint(stem)
        if not fp or fp in seen_fp:
            continue
        if "?" not in stem and not re.search(
            r"\b(which|what|who|when|how|consider|match|assertion|regarding|with reference|"
            r"is/are|are|not included|not a|true for|related to|means|implies|"
            r"correct|incorrect|largest|objective|launched|scheme|yojana|mission|"
            r"associated with|concerned with|aims|purpose|responsible|feature|"
            r"arrange|chronological|not covered|not true|not correct|primary)\b",
            stem,
            re.I,
        ):
            continue

        seen_fp.add(fp)

        options = {}
        for om in re.finditer(
            r"\(([a-e])\)\s*([^\n(]+?)(?=\s*\([a-e]\)|\s*Ans\.|\s*$)",
            ch,
            re.I | re.S,
        ):
            letter = om.group(1).lower()
            val = clean_text(om.group(2))
            val = re.sub(
                r"\s*(Ans\.|I\.A\.S\.|U\.P\.|Uttarakhand|M\.P\.|Chhattisgarh|Jharkhand|"
                r"R\.A\.S\.|General Studies|Economic & Social|See the).*$",
                "",
                val,
                flags=re.I,
            ).strip()
            if len(val) < 2 or len(val) > 220:
                continue
            if letter not in options:
                options[letter] = val

        expl = clean_text(ch[am.end() : am.end() + 400])
        expl = EXAM_RE.sub("", expl)
        expl = re.sub(r"\([a-e]\)\s*[^()]{0,120}", " ", expl, flags=re.I)
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
    for m in re.finditer(r"(?:\*\*Q\d+\.[^*]*\*\*\s*)?([^\n]{25,200})", md):
        fps.add(fingerprint(m.group(1)))
    return {f for f in fps if f}


def fmt_q(item: dict, qid: int, bank: bool) -> str:
    exam = item["exam"]
    stem = item["stem"]
    if len(stem) > 500:
        stem = stem[:497] + "…"

    lines = [f"**Q{qid}. {exam}**", "", stem, ""]

    opts = item["options"]
    letters = "abcde" if any(k == "e" for k in opts) else "abcd"
    if len(opts) >= 2:
        for L in letters:
            if L in opts:
                lines.append(f"{L.upper()}. {opts[L]}")
        lines.append("")
    else:
        lines.append("*(Options OCR-incomplete in source — key retained.)*")
        lines.append("")

    ans = item["ans"].upper() if item["ans"] != "*" else "*"
    expl = item["expl"]
    expl = re.sub(r"^[A-E]\.\s*", "", expl)
    if len(expl) > 20 and not expl.lower().startswith(("see the", "general studies")):
        logic = expl
    else:
        logic = "Standard key from Ghatnachakra Employment & Welfare Schemes (livelihood / MGNREGA / social security / sanitation)."

    if bank:
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Logic:** {logic}\n\n"
            f"**Ans: {ans}.**\n\n"
            "</details>\n"
        )
    else:
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Ans: {ans}.**\n\n"
            f"**Logic:** {logic}\n\n"
            "</details>\n"
        )

    lines.append(block)
    return "\n".join(lines)


def main() -> None:
    paste = PASTE.read_text(encoding="utf-8")
    md = MD.read_text(encoding="utf-8")
    items = parse_paste(paste)
    print(f"parsed unique stems: {len(items)}")

    have = existing_fps(md)
    fresh = [it for it in items if it["fp"] not in have]
    print(f"already covered-ish: {len(items) - len(fresh)}; fresh: {len(fresh)}")

    bank_items = []
    extra_items = []
    for it in fresh:
        if is_uppcs(it["exam"]) and not is_ro_aro(it["exam"]):
            bank_items.append(it)
        else:
            extra_items.append(it)

    bank_items.sort(key=lambda x: x["qnum"])
    extra_items.sort(key=lambda x: x["qnum"])

    print(f"to Complete Bank (UPPCS): {len(bank_items)}")
    print(f"to Extra Drill (all other): {len(extra_items)}")

    bank_sec = md.split("## Complete PYQ Bank (UPPCS)")[1].split("## Ghatnachakra Extra Drill")[0]
    extra_sec = md.split("## Ghatnachakra Extra Drill")[1].split("## UKPCS")[0]
    bank_nums = [int(x) for x in re.findall(r"\*\*Q(\d+)\.", bank_sec)]
    next_bank = max(bank_nums) + 1 if bank_nums else 1
    extra_nums = [int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra_sec)]
    next_extra = max(extra_nums) + 1 if extra_nums else 1

    bank_md = [fmt_q(it, n, bank=True) for n, it in enumerate(bank_items, next_bank)]
    extra_md = [fmt_q(it, n, bank=False) for n, it in enumerate(extra_items, next_extra)]

    bank_blob = "\n".join(bank_md)
    extra_blob = "\n".join(extra_md)

    shutil.copy2(MD, MD.with_suffix(".md.bak_welfare"))

    bank_anchor = "## Ghatnachakra Extra Drill — Employment, Poverty and Human Capital"
    if bank_blob:
        if "---\n\n" + bank_anchor in md:
            md = md.replace(
                "---\n\n" + bank_anchor,
                bank_blob + "\n---\n\n" + bank_anchor,
                1,
            )
        else:
            md = md.replace(bank_anchor, bank_blob + "\n---\n\n" + bank_anchor, 1)

    new_note = (
        "Extra Drill: Ghatnachakra **Employment & Welfare Schemes** (all exams) "
        "including SGSY–NRLM, MGNREGA, pensions, Swachh Bharat "
        "+ Human Development / Sustainable Development Purvalokan."
    )
    md = re.sub(
        r"> Extra Drill:.*",
        f"> {new_note}",
        md,
        count=1,
    )

    extra_anchor = "## UKPCS"
    if extra_blob:
        if "---\n\n" + extra_anchor in md:
            md = md.replace(
                "---\n\n" + extra_anchor,
                extra_blob + "\n---\n\n" + extra_anchor,
                1,
            )
        else:
            md = md.replace(extra_anchor, extra_blob + "\n---\n\n" + extra_anchor, 1)

    # verify Consolidated still 50
    m = re.search(r"## Consolidated — (\d+)", md)
    if m and int(m.group(1)) > 50:
        raise SystemExit(f"Consolidated bloated to {m.group(1)}")

    MD.write_text(md, encoding="utf-8")
    end_b = next_bank + len(bank_items) - 1 if bank_items else "none"
    end_e = next_extra + len(extra_items) - 1 if extra_items else "none"
    print(f"wrote bank Q{next_bank}–{end_b}")
    print(f"wrote extra Q{next_extra}–{end_e}")
    print("consolidated title", m.group(1) if m else "?")
    print("done")


if __name__ == "__main__":
    main()
