"""Download UKPSC Prelims GS papers for available years and build year hub notes."""

from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

BASE = Path(__file__).resolve().parent
PYQS = BASE.parent / "pyqs"
PDF_DIR = BASE / "pdfs"
UA = {"User-Agent": "Mozilla/5.0"}
CTX = ssl._create_unverified_context()

# Direct CDN / known public PDFs (Prepp and similar). Update as links rot.
DOWNLOADS = {
    "2025_GS_QP.pdf": "https://cdn-images.prepp.in/public/image/UKPSC_Prelims_2025_GS_QP_f0a0a56be14254ea9e578ccd6fad1044.pdf",
    "2025_GS_AK_provisional.pdf": "https://cdn-images.prepp.in/public/image/UKPSC_Prelims_2025_GS_Answer_Key_9b5050c51494395f49418126182ff5df.pdf",
}

# Year availability for Upper PCS Prelims (research note for the hub).
YEAR_STATUS = [
    {
        "year": "2025",
        "held": "29 June 2025",
        "status": "available",
        "note": "GS-I Complete Bank wired with Provisional Answer Key Series B (matches English dump order).",
        "bank": "2025_GS_I_Complete_Bank.md",
    },
    {
        "year": "2024",
        "held": "14 July 2024",
        "status": "pdf_pending",
        "note": "Prelims held. Download GS Paper I from psc.uk.gov.in Old Question Papers / Prepp / Testbook, then convert into a Complete Bank.",
        "bank": None,
    },
    {
        "year": "2023",
        "held": "—",
        "status": "no_prelims",
        "note": "No separate Upper PCS Prelims cycle labelled 2023. Sites listing 2023 usually show Mains papers from the 2021–22 cycle.",
        "bank": None,
    },
    {
        "year": "2022",
        "held": "3 April 2022",
        "status": "pdf_pending",
        "note": "Same sitting as the PCS-2021 cycle Prelims (notification 2021, paper dated 2022). Often filed under both 2021 and 2022.",
        "bank": None,
    },
    {
        "year": "2021",
        "held": "3 April 2022",
        "status": "alias_2022",
        "note": "UKPSC Combined State Civil/Upper Subordinate Services Examination-2021 Prelims was conducted on 3 April 2022. Use the 2022 paper.",
        "bank": None,
    },
    {
        "year": "2020",
        "held": "—",
        "status": "not_held",
        "note": "No Upper PCS Prelims paper for 2020 in public archives (gap year between 2016 and 2021 cycles).",
        "bank": None,
    },
    {
        "year": "2016",
        "held": "2016",
        "status": "pdf_pending",
        "note": "Prelims GS + Aptitude available on UKPSC old papers / coaching archives. Convert after PDF ingest.",
        "bank": None,
    },
]


def fetch(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
        dest.write_bytes(r.read())
    print(f"OK {dest.name} ({dest.stat().st_size} bytes)")


def write_year_hub() -> None:
    PYQS.mkdir(parents=True, exist_ok=True)
    rows = []
    for y in YEAR_STATUS:
        bank = f"[Complete Bank]({y['bank']})" if y["bank"] else "—"
        rows.append(
            f"| {y['year']} | {y['held']} | `{y['status']}` | {y['note']} | {bank} |"
        )
    md = f"""# UKPCS / UKPSC Prelims PYQs

Official name: **Uttarakhand Public Service Commission (UKPSC)** Combined State Civil / Upper Subordinate Services Preliminary Examination — General Studies Paper I.

## Year map (what exists)

UKPSC Upper PCS Prelims is **not annual**. Several calendar years have **no Prelims paper**.

| Year | Held on | Status | Note | Bank |
|------|---------|--------|------|------|
{chr(10).join(rows)}

## Sources used

- Official portal: [psc.uk.gov.in](https://psc.uk.gov.in/) → Answer Key / Old Question Papers
- 2025 GS QP + Provisional Answer Key (all series): Prepp CDN mirrors of UKPSC PDFs
- Coaching mirrors for older years: Drishti IAS Uttarakhand PYQ page, Testbook, Prepp, Adda247

## Gaps to fill next

1. Ingest **2024** GS-I English/Hindi PDF → Complete Bank + official key.
2. Ingest **2021/2022** (3 April 2022) GS-I → Complete Bank + final key.
3. Ingest **2016** GS-I → Complete Bank + key if available.
4. Replace 2025 **provisional** Series B key with **amended** final key (UKPSC released amended keys on 3 September 2025) once the amended PDF is stored under `_build/pdfs/`.

## 2025 dump gaps (OCR)

The pasted English dump scrambled **Q1–Q4**. Reconstructed as one Census-2011 four-statement stem (Q1) plus separate GSDP / HMT / Himadri items (Q2–Q4). Other stems were cleaned of scan noise (Fleming, Pataliputra, inclusive growth, etc.).
"""
    (PYQS / "index.md").write_text(md, encoding="utf-8")
    pages = """title: PYQs
nav:
  - Overview: index.md
  - "2025 GS Paper I — Complete Bank": 2025_GS_I_Complete_Bank.md
  - "Year map & gaps": index.md
"""
    # Avoid duplicate index; keep simple nav
    pages = """title: PYQs
nav:
  - Overview: index.md
  - "2025 GS Paper I — Complete Bank": 2025_GS_I_Complete_Bank.md
"""
    (PYQS / ".pages").write_text(pages, encoding="utf-8")
    print("Wrote pyqs/index.md and .pages")


def main() -> None:
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    for name, url in DOWNLOADS.items():
        dest = PDF_DIR / name
        if dest.exists() and dest.stat().st_size > 1000:
            print(f"skip {name}")
            continue
        try:
            fetch(url, dest)
        except Exception as e:
            print(f"FAIL {name}: {e}")
    # also copy already downloaded prepp files if present
    for src_name, dst_name in [
        ("2025_gs_qp_prepp.pdf", "2025_GS_QP.pdf"),
        ("2025_gs_ak_prepp.pdf", "2025_GS_AK_provisional.pdf"),
    ]:
        src = BASE / src_name
        dst = PDF_DIR / dst_name
        if src.exists() and not dst.exists():
            dst.write_bytes(src.read_bytes())
            print(f"copied {dst_name}")
    write_year_hub()


if __name__ == "__main__":
    main()
