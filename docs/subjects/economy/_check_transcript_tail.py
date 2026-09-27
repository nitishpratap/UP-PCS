# -*- coding: utf-8 -*-
from pathlib import Path
import json

p = Path(
    r"C:\Users\Axeno\.cursor\projects\c-Users-Axeno-Desktop-UP-PCS"
    r"\agent-transcripts\95c20838-1797-49eb-8dd1-2e2aa81aaf9e"
    r"\95c20838-1797-49eb-8dd1-2e2aa81aaf9e.jsonl"
)
last = None
n = 0
with p.open(encoding="utf-8") as f:
    for i, line in enumerate(f):
        n += 1
        if '"role": "user"' in line or '"role":"user"' in line:
            last = i
print("last user line", last, "total", n)
with p.open(encoding="utf-8") as f:
    for i, line in enumerate(f):
        if i < n - 6:
            continue
        try:
            o = json.loads(line)
        except Exception:
            print(i, "bad")
            continue
        role = o.get("role")
        msg = o.get("message") or {}
        c = msg.get("content") if isinstance(msg, dict) else None
        text = ""
        if isinstance(c, list) and c and isinstance(c[0], dict):
            text = c[0].get("text") or ""
        print(i, role, "textlen", len(text), "snip", text[200:260].replace("\n", " "))
