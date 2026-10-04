import ast
import re
from pathlib import Path

for path in [
    "docs/subjects/_build/_upgrade_geo_batch2_ch15_19.py",
]:
    t = Path(path).read_text(encoding="utf-8")
    mod = ast.parse(t)
    for node in mod.body:
        if isinstance(node, ast.Assign):
            for tgt in node.targets:
                if isinstance(tgt, ast.Name) and tgt.id.startswith("FACTS_"):
                    # may be list mutated later; evaluate Assign value only
                    try:
                        vals = ast.literal_eval(node.value)
                        print(tgt.id, len(vals))
                    except Exception as e:
                        print(tgt.id, "ERR", e)
    for bad in ("exam", "lock", "locks"):
        hits = [(m.start(), t[max(0, m.start() - 40) : m.end() + 40]) for m in re.finditer(rf"\b{bad}\b", t, flags=re.I)]
        print(bad, len(hits))
        for h in hits[:5]:
            print(" ", h[1].replace("\n", " "))
