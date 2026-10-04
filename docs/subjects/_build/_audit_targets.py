import re
from pathlib import Path

files = [
    "10_Tribes_Institutions.md",
    "11_Population_Geography.md",
    "12_Human_Geography.md",
    "13_Disaster_Geography.md",
    "15_Geomorphology_and_Landform_Processes.md",
    "16_Oceans.md",
    "17_World_Rivers_and_Lakes.md",
    "18_World_Landforms.md",
    "19_World_Regional_Geography.md",
    "25_Census_and_Demographics.md",
    "26_Agriculture_Minerals_Ranks.md",
]
subj = Path("docs/subjects/geography")
rev = Path("docs/revision/must-score-facts/geography")
print(f"{'file':42} {'sf':>3} {'rf':>3} {'rq':>3} {'claimed':>7} notes")
for name in files:
    st = (subj / name).read_text(encoding="utf-8")
    m = re.search(
        r"Consolidated\s*—\s*(\d+)\s*Must-Score Facts.*?</summary>(.*?)</details>",
        st,
        re.S | re.I,
    )
    claimed = m.group(1) if m else "?"
    facts = re.findall(r"^\d+\.\s+", m.group(2), re.M) if m else []
    rt = (rev / name).read_text(encoding="utf-8")
    m3 = re.search(r"Consolidated Must-Score Facts(.*?)(?=\n## |\Z)", rt, re.S)
    rf = len(re.findall(r"^\d+\.\s+", m3.group(1), re.M)) if m3 else 0
    rq = len(re.findall(r"^\*\*Q\d+\.\*\*", rt, re.M))
    notes = []
    if str(claimed) != str(len(facts)):
        notes.append("count_mismatch")
    if len(facts) != rf:
        notes.append("subj_rev_mismatch")
    if rq != 20:
        notes.append(f"quiz={rq}")
    if not (40 <= len(facts) <= 50):
        notes.append(f"out_of_range")
    print(
        f"{name:42} {len(facts):3} {rf:3} {rq:3} {str(claimed):>7} {', '.join(notes)}"
    )
