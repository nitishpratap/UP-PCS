"""Try downloading older UKPSC Prelims GS PDFs from known public mirrors."""

from __future__ import annotations

import ssl
import urllib.request
from pathlib import Path

PDF_DIR = Path(__file__).resolve().parent / "pdfs"
UA = {"User-Agent": "Mozilla/5.0"}
CTX = ssl._create_unverified_context()

CANDIDATES = {
    # 2024 — Prepp-style CDN guesses + known mirrors (try until one works)
    "2024_GS_QP.pdf": [
        "https://cdn-images.prepp.in/public/image/UKPSC_Prelims_2024_GS_Paper_Ia76fc5097a551bd308dca2b06194055c.pdf",
        "https://cdn-images.prepp.in/public/image/UKPSC_Prelims_2024_GS_QP.pdf",
    ],
    "2022_GS_QP.pdf": [
        "https://cdn-images.prepp.in/public/image/UKPSC_Prelims_2022_GS_Paper.pdf",
    ],
    "2016_GS_QP.pdf": [
        "https://cdn-images.prepp.in/public/image/UKPSC_Prelims_2016_GS_Paper.pdf",
    ],
}


def try_fetch(urls: list[str], dest: Path) -> bool:
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                data = r.read()
            if len(data) < 5000 or data[:4] != b"%PDF":
                print(f"skip non-pdf {url} ({len(data)})")
                continue
            dest.write_bytes(data)
            print(f"OK {dest.name} from {url} ({len(data)})")
            return True
        except Exception as e:
            print(f"FAIL {url}: {e}")
    return False


def main() -> None:
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    for name, urls in CANDIDATES.items():
        dest = PDF_DIR / name
        if dest.exists() and dest.stat().st_size > 5000:
            print(f"exists {name}")
            continue
        ok = try_fetch(urls, dest)
        if not ok:
            print(f"MISSING {name} — place PDF manually in {PDF_DIR}")


if __name__ == "__main__":
    main()
