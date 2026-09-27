# -*- coding: utf-8 -*-
from pathlib import Path
import re

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects")
MARKER = "### Other Papers — BPSC / MPPSC / RAS / UKPCS / UPSC / WBCS"


def Q(tag, stem, opts, letter, ans, logic):
    return {
        "tag": tag,
        "stem": stem,
        "key": re.sub(r"\s+", " ", stem[:70]).strip().lower(),
        "body_tpl": (
            "{qline}\n"
            + stem
            + "\n"
            + "\n".join(opts)
            + "\n\n<details>\n<summary>Show answer</summary>\n\n"
            f"**Logic:** {logic}\n\n**Ans: {letter}.** {ans}\n\n</details>\n\n"
        ),
    }


PACKS = {
    "up special/01_Geography_Location_Physical_Features.md": [
        Q(
            "UKPSC / UK–UP border",
            "How many districts of Uttarakhand share a border with Uttar Pradesh?",
            ["A. 3", "B. 4", "C. 5", "D. 6"],
            "C",
            "Five — Dehradun, Haridwar, Pauri Garhwal, Nainital and Udham Singh Nagar.",
            "Southern UK–UP frontier for UP Special geography.",
        ),
        Q(
            "UK Upper PCS / multi-PSC",
            "Which of the following cities is NOT located on the banks of the Ganga?",
            ["A. Kanpur", "B. Varanasi", "C. Agra", "D. Prayagraj (Allahabad)"],
            "C",
            "Agra.",
            "Agra is on the Yamuna — classic river–city trap.",
        ),
        Q(
            "UK Upper PCS / multi-PSC",
            "Rihand Dam (Govind Ballabh Pant Sagar) is located in which district of Uttar Pradesh?",
            ["A. Mirzapur", "B. Sonbhadra", "C. Varanasi", "D. Prayagraj"],
            "B",
            "Sonbhadra.",
            "Rihand is a tributary of the Son; major reservoir by surface area in UP.",
        ),
    ],
    "up special/05_Agriculture_Irrigation_Rural_Economy.md": [
        Q(
            "67th BPSC (Pre) / Bihar agri",
            "Among the following districts of Bihar, which has the highest annual sugarcane production?",
            ["A. Rohtas", "B. West Champaran", "C. Patna", "D. Buxar"],
            "B",
            "West Champaran.",
            "Neighbour sugarcane belt — comparative for UP western Terai cane pattern.",
        ),
        Q(
            "BPSC / Canal–flood geography",
            "Which river is called the Sorrow of Bihar and drives major canal–flood projects?",
            ["A. Gandak", "B. Kosi", "C. Son", "D. Punpun"],
            "B",
            "Kosi.",
            "Flood + irrigation Extra Drill link for eastern UP–Bihar plain.",
        ),
    ],
    "up special/02_History_Culture_Art_Heritage.md": [
        Q(
            "UK Upper PCS / multi-PSC",
            "Which of the following cities is NOT located on the banks of the Ganga?",
            ["A. Kanpur", "B. Varanasi", "C. Agra", "D. Prayagraj"],
            "C",
            "Agra (Yamuna).",
            "Culture corridor cities — Agra is Yamuna, not Ganga.",
        ),
    ],
    "up special/08_Current_Affairs_Schemes_Miscellaneous.md": [
        Q(
            "UPSC (CSE) Prelims 2013",
            "To obtain full benefits of demographic dividend, what should India do?",
            [
                "A. Promoting skill development",
                "B. Introducing more social security schemes",
                "C. Reducing infant mortality rate",
                "D. Privatization of higher education",
            ],
            "A",
            "Promoting skill development.",
            "Scheme–skilling link for miscellaneous Extra Drill.",
        ),
    ],
}


def inject(rel, qs):
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    m_prac = re.search(r"^## Practice Zone[^\n]*\n", text, re.M)
    if not m_extra or not m_prac:
        print("SKIP", rel)
        return 0
    extra = text[m_extra.end() : m_prac.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra)), default=0)
    out = []
    for q in qs:
        if q["key"] in text.lower():
            continue
        n += 1
        out.append(q["body_tpl"].format(qline=f"**Q{n}. {q['tag']}**"))
    if not out:
        print("NONE", path.name)
        return 0
    block = (f"\n{MARKER}\n\n" if MARKER not in extra else "\n") + "".join(out)
    path.write_text(text[: m_prac.start()] + block + text[m_prac.start() :], encoding="utf-8", newline="\n")
    print(f"ADDED {path.name}: +{len(out)}")
    return len(out)


if __name__ == "__main__":
    total = sum(inject(r, qs) for r, qs in PACKS.items())
    print("EXTRA2_TOTAL", total)
