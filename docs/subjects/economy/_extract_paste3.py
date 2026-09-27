# -*- coding: utf-8 -*-
"""Build paste3 from transcript line 978 (Q246+) plus appended continuation saved beside this script."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_welfare_schemes_paste3_raw.txt"
CONT = ROOT / "_welfare_schemes_paste3_cont.txt"
TRANS = Path(
    r"C:\Users\Axeno\.cursor\projects\c-Users-Axeno-Desktop-UP-PCS"
    r"\agent-transcripts\95c20838-1797-49eb-8dd1-2e2aa81aaf9e"
    r"\95c20838-1797-49eb-8dd1-2e2aa81aaf9e.jsonl"
)

def get_line(n: int) -> str:
    with TRANS.open(encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i != n:
                continue
            o = json.loads(line)
            c = o["message"]["content"]
            t = c[0]["text"] if isinstance(c, list) else c
            if t.count("\\n") > 50 and t.count("\n") < 5:
                t = t.replace("\\n", "\n")
            return t.replace("\\'", "'")
    return ""

text = get_line(978)
m = re.search(r"246\.\s*Consider the following statements regarding World", text, re.S)
part1 = m.group(0) if m else ""
# strip trailing </user_query> noise
part1 = re.sub(r"</user_query>.*", "", part1, flags=re.S)

part2 = CONT.read_text(encoding="utf-8") if CONT.exists() else ""
body = (part1 + "\n" + part2).strip() + "\n"
OUT.write_text(body, encoding="utf-8")
print("part1", len(part1), "part2", len(part2), "total", len(body))
print("has Minimum Needs", "Minimum Needs" in body)
print("has Lorenz", "Lorenz" in body)
print("qs", len(re.findall(r"(?m)^\d{1,3}\.\s", body)))
