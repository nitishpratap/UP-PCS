# -*- coding: utf-8 -*-
"""Extract Economy part 2.pdf in 50-page batches; report coverage gaps."""
from __future__ import annotations
from pathlib import Path
import json
import re

import fitz  # PyMuPDF

PDF = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy\Economy part 2.pdf")
OUT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy\_ghat_extract")
BATCH = 50
# Pages with fewer than this many non-whitespace chars flagged as thin/empty
THIN = 80


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)
    n = doc.page_count
    print(f"PAGES={n}")
    print(f"FILE_MB={PDF.stat().st_size / 1e6:.1f}")

    report = {
        "pages": n,
        "batches": [],
        "empty_pages": [],
        "thin_pages": [],
        "image_heavy_hint": [],
        "total_chars": 0,
        "total_words_est": 0,
    }

    for start in range(0, n, BATCH):
        end = min(start + BATCH, n)
        parts = []
        batch_chars = 0
        batch_empty = []
        batch_thin = []
        for i in range(start, end):
            page = doc[i]
            text = page.get_text("text") or ""
            # normalize
            text = text.replace("\x00", "")
            chars = len(re.sub(r"\s+", "", text))
            words = len(re.findall(r"\S+", text))
            batch_chars += chars
            report["total_chars"] += chars
            report["total_words_est"] += words

            # image-only heuristic: little text but has images
            imgs = page.get_images(full=True) or []
            if chars < THIN:
                if chars == 0:
                    batch_empty.append(i + 1)  # 1-based
                    report["empty_pages"].append(i + 1)
                else:
                    batch_thin.append(i + 1)
                    report["thin_pages"].append(i + 1)
                if imgs:
                    report["image_heavy_hint"].append(
                        {"page": i + 1, "chars": chars, "images": len(imgs)}
                    )

            parts.append(f"\n\n===== PAGE {i + 1} =====\n\n{text}")

        out_file = OUT / f"batch_{start + 1:04d}_{end:04d}.txt"
        header = (
            f"# Extract from {PDF.name}\n"
            f"# Pages {start + 1}-{end} of {n}\n"
            f"# Non-ws chars in batch: {batch_chars}\n"
        )
        out_file.write_text(header + "".join(parts), encoding="utf-8", newline="\n")
        report["batches"].append(
            {
                "file": out_file.name,
                "pages": f"{start + 1}-{end}",
                "chars": batch_chars,
                "empty": batch_empty,
                "thin": batch_thin,
            }
        )
        print(
            f"BATCH {start + 1}-{end}: chars={batch_chars} "
            f"empty={len(batch_empty)} thin={len(batch_thin)} -> {out_file.name}"
        )

    # Sample first/middle/last page preview lengths
    samples = {}
    for label, idx in [("first", 0), ("mid", n // 2), ("last", n - 1)]:
        t = doc[idx].get_text("text") or ""
        samples[label] = {
            "page": idx + 1,
            "chars": len(re.sub(r"\s+", "", t)),
            "preview": re.sub(r"\s+", " ", t)[:240],
        }
    report["samples"] = samples

    # Coverage verdict
    empty_pct = 100.0 * len(report["empty_pages"]) / n if n else 0
    thin_pct = 100.0 * len(report["thin_pages"]) / n if n else 0
    report["verdict"] = {
        "empty_page_pct": round(empty_pct, 2),
        "thin_page_pct": round(thin_pct, 2),
        "avg_chars_per_page": round(report["total_chars"] / n, 1) if n else 0,
        "likely_full_text_extractable": empty_pct < 5 and report["total_chars"] / max(n, 1) > 200,
        "likely_needs_ocr_for_some_pages": len(report["image_heavy_hint"]) > 0,
    }

    (OUT / "_extract_report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    doc.close()
    print("\n=== VERDICT ===")
    print(json.dumps(report["verdict"], indent=2))
    print(f"empty_pages_count={len(report['empty_pages'])}")
    print(f"thin_pages_count={len(report['thin_pages'])}")
    print(f"image_heavy_hints={len(report['image_heavy_hint'])}")
    print(f"OUT_DIR={OUT}")


if __name__ == "__main__":
    main()
