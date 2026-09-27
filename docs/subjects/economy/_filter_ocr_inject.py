# -*- coding: utf-8 -*-
"""Filter garbled OCR injects in Complete Bank / Extra Drill."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def split_qs(section: str):
    parts = re.split(r"(?=\n\*\*Q\d+\. )", "\n" + section)
    return parts[0], parts[1:]


def is_clean(qblock: str) -> bool:
    opts = set(re.findall(r"(?m)^([A-E])\. ", qblock))
    if len(opts) < 3:
        return False
    am = re.search(r"\*\*Ans:\s*([A-E\*])", qblock)
    if not am:
        return False
    ans = am.group(1)
    if ans != "*" and ans not in opts:
        return False
    m = re.search(r"\*\*Q\d+\. [^\n]*\*\*\s*\n\n(.+?)\n\n[A-E]\. ", qblock, re.S)
    if not m:
        return False
    stem = m.group(1).strip()
    if len(stem) < 25:
        return False
    if re.match(r"^(for |and |Select the|Code:|Literacy to|Communications )", stem, re.I):
        return False
    return True


def clean_file(md_path: Path, bank_h: str, extra_h: str, uk_h: str, keep_bank_upto: int, keep_extra_upto: int):
    md = md_path.read_text(encoding="utf-8")
    pre, rest = md.split(bank_h, 1)
    bank_sec, rest2 = rest.split(extra_h, 1)
    extra_sec, uk_rest = rest2.split(uk_h, 1)

    bhead, bqs = split_qs(bank_sec)
    keep_early, keep_new = [], []
    for q in bqs:
        m = re.match(r"\n?\*\*Q(\d+)\.", q)
        n = int(m.group(1)) if m else 0
        if n <= keep_bank_upto:
            keep_early.append(q)
        elif is_clean(q):
            keep_new.append(q)

    ren_bank = []
    for i, q in enumerate(keep_new, keep_bank_upto + 1):
        ren_bank.append(re.sub(r"\*\*Q\d+\.", f"**Q{i}.", q, count=1))

    ehead, eqs = split_qs(extra_sec)
    keep_e_old, keep_e_new = [], []
    for q in eqs:
        m = re.match(r"\n?\*\*Q(\d+)\.", q)
        n = int(m.group(1)) if m else 0
        if n <= keep_extra_upto:
            keep_e_old.append(q)
        elif is_clean(q):
            keep_e_new.append(q)

    old_nums = [
        int(re.match(r"\n?\*\*Q(\d+)\.", q).group(1))
        for q in keep_e_old
        if re.match(r"\n?\*\*Q(\d+)\.", q)
    ]
    next_e = max(old_nums) + 1 if old_nums else keep_extra_upto + 1
    ren_extra = []
    for i, q in enumerate(keep_e_new, next_e):
        ren_extra.append(re.sub(r"\*\*Q\d+\.", f"**Q{i}.", q, count=1))

    new_bank = bhead + "".join(keep_early) + "".join(ren_bank)
    if not new_bank.endswith("\n"):
        new_bank += "\n"
    new_extra = ehead + "".join(keep_e_old) + "".join(ren_extra)
    if not new_extra.endswith("\n"):
        new_extra += "\n"

    out = pre + bank_h + new_bank + extra_h + new_extra + uk_h + uk_rest
    md_path.write_text(out, encoding="utf-8")
    print(
        md_path.name,
        f"bank keep {len(keep_early)}+{len(keep_new)} drop {len(bqs)-len(keep_early)-len(keep_new)}",
        f"extra keep {len(keep_e_old)}+{len(keep_e_new)} drop {len(eqs)-len(keep_e_old)-len(keep_e_new)}",
    )


def main():
    # Topic 8: original bank ~13?, inject started 14; Extra old ~31 before inject 32
    # From inject output: bank Q14-26, extra Q32-53 — so keep_bank_upto=13, keep_extra_upto=31
    clean_file(
        ROOT / "08_Employment_Poverty_Human_Capital.md",
        "## Complete PYQ Bank (UPPCS)",
        "## Ghatnachakra Extra Drill — Employment, Poverty and Human Capital",
        "## UKPCS",
        keep_bank_upto=13,
        keep_extra_upto=31,
    )
    # Topic 3: bank had Q1-4 before inject (wrote Q5-76); Extra had up to Q28 before Q29
    clean_file(
        ROOT / "03_Money_Banking_RBI_Financial_System.md",
        "## Complete PYQ Bank (UPPCS)",
        "## Ghatnachakra Extra Drill — Money, Banking, RBI and Financial System",
        "## UKPCS Prelims Bank",
        keep_bank_upto=4,
        keep_extra_upto=28,
    )


if __name__ == "__main__":
    main()
