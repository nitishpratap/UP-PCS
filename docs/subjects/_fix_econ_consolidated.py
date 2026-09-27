# -*- coding: utf-8 -*-
from pathlib import Path
import re

p = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy\01_Indian_Economy_Basics_Planning.md")
text = p.read_text(encoding="utf-8")
m = re.search(
    r"(## Consolidated — \d+ Must-Score Facts\n\n)(.*?)(\n---\n\n## Confused Pairs)",
    text,
    re.S,
)
if not m:
    raise SystemExit("no block")
body = m.group(2)
lines = body.split("\n")
facts = []
cur = None
for line in lines:
    mm = re.match(r"^(\d+)\.\s+(.*)$", line)
    if mm:
        if cur is not None:
            facts.append(cur)
        cur = mm.group(2)
    elif cur is not None and line.strip():
        cur += "\n" + line
if cur is not None:
    facts.append(cur)

unique = []
for f in facts:
    key = re.sub(r"\s+", " ", f)[:80].lower()
    if any("green gdp" in key and "green gdp" in re.sub(r"\s+", " ", x).lower() for x in unique):
        if "green gdp" in key:
            continue
    if any(key[:50] == re.sub(r"\s+", " ", x).lower()[:50] for x in unique):
        continue
    unique.append(f)

# Keep first 37 (new Nature/NI block), then append plan/reform facts from old list starting at "Sectoral shares"
first = unique[:37]
# From broken renumbered old list, find from Sectoral shares onward (may be numbered wrong in unique)
rest = []
started = False
for f in unique[37:]:
    fl = f.lower()
    if "sectoral shares" in fl or started:
        started = True
        rest.append(f)

extra = [
    "Economic liberalisation started with substantial changes in **industrial licensing** (New Industrial Policy, 24 July 1991).",
    "**Stabilisation** is short-term demand management; **structural adjustment** is the longer supply-side reform track.",
    "**Manmohan Singh** is keyed as the **pioneer of liberalisation** (as Finance Minister, 1991).",
    "Occupational structure stayed agri-heavy partly because investment favoured **capital-intensive** industry.",
    "**Second Generation of Economic Reforms** list (oil, PSU, government institutions) — **Legal System Reforms** was the odd one out in the keyed stem.",
    "Indian mixed-economy model protects interests of **State and person both**.",
    "**Meltdown** ≈ fall in stock prices; **recession** ≠ mere dip in growth rate; **slowdown** ≠ simply fall in GDP.",
    "Economic growth is usually coupled with **inflation** (demand rise with incomes).",
    "Labour share in GNP falls when **wages lag behind prices**.",
    "**Technocrats and bureaucrats** are not keyed as major factors of economic growth.",
    "World Bank financial aid growth is **not** a usual measure when conceptualising economic growth.",
]

final = list(first) + list(rest)
for e in extra:
    k = re.sub(r"\s+", " ", e).lower()[:45]
    if any(k in re.sub(r"\s+", " ", x).lower() for x in final):
        continue
    final.append(e)

# Drop exact Green GDP duplicate at end if present twice
seen_gg = 0
cleaned = []
for f in final:
    if "green gdp" in f.lower():
        seen_gg += 1
        if seen_gg > 1:
            continue
    cleaned.append(f)

new_body = "\n".join(f"{i}. {f}" for i, f in enumerate(cleaned, 1)) + "\n"
new_head = f"## Consolidated — {len(cleaned)} Must-Score Facts\n\n"
text2 = text[: m.start()] + new_head + new_body + m.group(3) + text[m.end() :]
p.write_text(text2, encoding="utf-8", newline="\n")
print("FACTS", len(cleaned))
