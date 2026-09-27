# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

p = Path(
    r"C:\Users\Axeno\.cursor\projects\c-Users-Axeno-Desktop-UP-PCS"
    r"\agent-transcripts\95c20838-1797-49eb-8dd1-2e2aa81aaf9e"
    r"\95c20838-1797-49eb-8dd1-2e2aa81aaf9e.jsonl"
)
out = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy\_welfare_schemes_paste2_raw.txt")
best = None
with p.open(encoding="utf-8") as f:
    for line in f:
        if "Swarnajayanti Gram Swarozgar Yojana was started" not in line:
            continue
        o = json.loads(line)
        msg = o.get("message") or o.get("content") or o
        # Cursor transcript: message may be dict with content list
        text = None
        if isinstance(msg, str):
            text = msg
        elif isinstance(msg, dict):
            c = msg.get("content")
            if isinstance(c, str):
                text = c
            elif isinstance(c, list):
                parts = []
                for x in c:
                    if isinstance(x, str):
                        parts.append(x)
                    elif isinstance(x, dict):
                        parts.append(x.get("text") or "")
                text = "\n".join(parts)
            else:
                text = json.dumps(msg)
        best = text
        break

if not best:
    raise SystemExit("paste not found")

if best.count("\\n") > 50 and best.count("\n") < 5:
    best = best.replace("\\n", "\n")
best = best.replace("\\'", "'")
m = re.search(r"169\.\s*Swarnajayanti.*", best, re.S)
body = m.group(0) if m else best
# strip trailing user instruction noise if any
out.write_text(body, encoding="utf-8")
print("chars", len(body), "nl", body.count("\n"), "start", repr(body[:120]))
print("has WaterCredit", "WaterCredit" in body)
print("q count approx", len(re.findall(r"(?m)^\d{2,3}\.\s", body)))
