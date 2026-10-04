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
                        vals = ast.literal_eval(node.valu