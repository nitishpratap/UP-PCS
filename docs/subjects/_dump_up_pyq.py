# -*- coding: utf-8 -*-
import json, re, os
from pathlib import Path

root = Path(r"c:\Users\Axeno\Desktop\UP-PCS")
p = root / "docs/subjects/_pyq_extract_census_up.json"
with open(p, encoding="utf-8") as f:
    d = json.load(f)
out = root / "docs/subjects/_up_pyq_dump.txt"
with open(out, "w", encoding="utf-8") as w:
    for key in ["up", "census"]:
        w.write(f"\n==== {key} ({len(d[key])}) ====\n")
        for q in d[key]:
            w.write(f"\n--- {q.get('year')} Q{q.get('qid')} | {q.get('subject')} | {q.get('topic')}\n")
            w.write((q.get("stem") or "").replace("\r", "") + "\n")
            w.write("OPTIONS:\n" + (q.get("options") or "") + "\n")
            raw = q.get("raw") or ""
            # keep statements block if present
            if "1." in raw and "Options:" in raw:
                m = re.search(r"Question:\s*(.*?)\nOptions:", raw, re.S)
                if m:
                    pass
            if q.get("answer"):
                w.write("ANS: " + str(q.get("answer")) + "\n")
print("wrote", out)

# Also scan papers for UP keywords
pyq = root / "pyq"
kw = re.compile(
    r"Uttar Pradesh|U\.P\.|ODOP|Dudhwa|Lakhimpur|Amethi|Sultanpur|Ghaziabad|"
    r"Shravasti|Shrawasti|Purvanchal|Bundelkhand|Legislative Council|"
    r"Moonj|One District|Varanasi|Ayodhya|Prayagraj|Gorakhpur|NOIDA|Noida|"
    r"Kushinagar|Chambal|Gomti|Gomati|Ramganga|Betwa|Keetham|Sur Sarovar|"
    r"Smart City|HRIDAY|Ramsar.*Uttar|Uttar.*Ramsar",
    re.I,
)
hits = []
for md in sorted(pyq.rglob("*.md")):
    text = md.read_text(encoding="utf-8", errors="ignore")
    # split by question markers
    year_m = re.search(r"20\d{2}", md.name)
    year = year_m.group(0) if year_m else "?"
    # find blocks containing UP
    for m in kw.finditer(text):
        start = max(0, m.start() - 400)
        end = min(len(text), m.end() + 600)
        snippet = text[start:end]
        hits.append((year, md.name, snippet[:800]))

# dedupe by first 120 chars of snippet
seen = set()
uniq = []
for h in hits:
    key = h[2][:120]
    if key in seen:
        continue
    seen.add(key)
    uniq.append(h)

scan_out = root / "docs/subjects/_up_pyq_scan.txt"
with open(scan_out, "w", encoding="utf-8") as w:
    w.write(f"unique hits: {len(uniq)}\n")
    for year, name, snip in uniq:
        w.write(f"\n===== {year} | {name} =====\n")
        w.write(snip.replace("\r", "") + "\n")
print("scan", scan_out, "hits", len(uniq))
