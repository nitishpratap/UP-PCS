#!/usr/bin/env python3
"""Move List-I/List-II match dumps out of HYT reading sections into Table Matching Drill Qs.

Detects reading-section tables that look like shuffled Match List stems
(A–D vs 1–4) and converts them into proper MCQs with codes + Show answer.
"""

from __future__ import annotations

import argparse
import itertools
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HYT_ROOT = ROOT / "docs" / "revision" / "high-yield-tables"

QUIZ_HEAD = re.compile(
    r"(?m)^##\s+.*Revision Practice MCQs.*$",
    re.I,
)

# High-frequency locks used when page tables do not already state the pair.
KNOWN_LOCKS: dict[str, str] = {
    # moons / planets
    "ganymede": "jupiter",
    "phobos": "mars",
    "deimos": "mars",
    "titan": "saturn",
    "triton": "neptune",
    "nix": "pluto",
    "charon": "pluto",
    "hydra": "pluto",
    # rocks
    "granite": "gneiss",
    "limestone": "marble",
    "sandstone": "quartzite",
    "shale": "slate",
    "igneous": "cooled magma/lava; no fossils",
    "sedimentary": "layered + fossils",
    "metamorphic": "heat/pressure remake",
    # volcanoes / peaks
    "rainier": "usa",
    "mount rainier": "usa",
    "etna": "italy",
    "mount etna": "italy",
    "vesuvius": "italy",
    "paricutin": "mexico",
    "mount pericutine": "mexico",
    "apo": "philippines",
    "mount apo": "philippines",
    "taal": "philippines",
    "erebus": "ross island / antarctica",
    "cotopaxi": "ecuador",
    "sabancaya": "peru",
    "colima": "mexico",
    "merapi": "indonesia",
    "kinabalu": "malaysia",
    "elburz": "iran",
    "alborz": "iran",
    "aconcagua": "argentina",
    "kilimanjaro": "tanzania",
    "stromboli": "italy",
    "fuji": "japan",
    "krakatoa": "indonesia",
    "krakatau": "indonesia",
    # seismic
    "focus": "initial rupture point inside earth",
    "hypocentre": "initial rupture point inside earth",
    "epicentre": "point on surface above hypocentre",
    "seismogram": "graphical record of seismic waves",
    "seismograph": "instrument that records waves",
    # cyclone names
    "australia": "willy-willy",
    "china": "typhoons",
    "india": "cyclones",
    "u.s.a.": "hurricanes",
    "usa": "hurricanes",
    # treaties / scales
    "montreal protocol": "ozone",
    "kyoto protocol": "climate / ghg",
    "fujita scale": "tornado",
    "saffir–simpson": "hurricane",
    "saffir-simpson": "hurricane",
    # theories
    "big bang": "lemaître / gamow; hubble expansion",
    "steady state": "hoyle",
    "nebular hypothesis": "kant–laplace",
    "milky way": "barred spiral",
    # ring of fire
    "chile": "pacific-margin seismic arc",
    "japan": "pacific-margin seismic arc",
    "philippines": "pacific-margin seismic arc",
    "kilimanjaro (east africa)": "not classic ring of fire",
}


def norm(s: str) -> str:
    s = re.sub(r"\*\*", "", s or "")
    s = s.lower().strip()
    s = re.sub(r"^\[?\s*[a-d1-4]\s*[\.\)\]]\s*", "", s)
    s = re.sub(r"\s+", " ", s)
    s = s.replace("—", "-").replace("–", "-")
    return s


def parse_table(block: str) -> tuple[list[str], list[list[str]]] | None:
    rows = []
    for line in block.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not cells:
            continue
        if set(cells[0]) <= {"-", ":"} or re.fullmatch(r":?-{3,}:?", cells[0].replace(" ", "")):
            continue
        rows.append(cells)
    if len(rows) < 2:
        return None
    return rows[0], rows[1:]


_ROMAN = {"i": "1", "ii": "2", "iii": "3", "iv": "4", "v": "5"}


def _right_num_text(cell: str) -> tuple[str, str] | None:
    cell = cell.strip()
    m = re.match(r"^(\d+)[\.\)]\s+(.+)$", cell)
    if m:
        return m.group(1), m.group(2).strip()
    m = re.match(r"^\(?([ivx]+)\)?[\.\)]?\s+(.+)$", cell, re.I)
    if m and m.group(1).lower() in _ROMAN:
        return _ROMAN[m.group(1).lower()], m.group(2).strip()
    return None


def is_list_match_table(header: list[str], body: list[list[str]]) -> bool:
    if len(body) < 3:
        return False
    left_ok = sum(1 for r in body if re.match(r"^[A-Da-d][\.\)]\s+", r[0].strip())) >= 3
    right_ok = sum(1 for r in body if len(r) > 1 and _right_num_text(r[1]) is not None) >= 3
    if left_ok and right_ok:
        return True
    # classic List-I / List-II headers (hyphen or en-dash)
    head = " ".join(header).lower().replace("–", "-").replace("—", "-")
    if re.search(r"list\s*-?\s*i\b", head) and re.search(r"list\s*-?\s*ii\b", head):
        return left_ok and right_ok
    return False


def extract_lr(body: list[list[str]]) -> tuple[list[tuple[str, str]], list[tuple[str, str]]]:
    left, right = [], []
    for r in body:
        if len(r) < 2:
            continue
        lm = re.match(r"^([A-D])[\.\)]\s+(.+)$", r[0].strip(), re.I)
        rm = _right_num_text(r[1])
        if lm:
            left.append((lm.group(1).upper(), lm.group(2).strip()))
        if rm:
            right.append(rm)
    # keep stable letter order A-D
    left.sort(key=lambda x: x[0])
    right.sort(key=lambda x: int(x[0]))
    return left, right


def _add_lock(locks: dict[str, str], a: str, b: str) -> None:
    a, b = norm(a), norm(b)
    if not a or not b:
        return
    if a in {"pair", "item", "feature", "term", "note", "list-i", "list-ii", "list i", "list ii"}:
        return
    if b in {"—", "-", "–", "na", "n/a"}:
        return
    # Prefer first non-empty lock; keep shorter/cleaner later overrides for oceans/rivers
    prev = locks.get(a)
    if prev is None or len(b) < len(prev) or any(
        k in b for k in ("ocean", "sea", "gulf", "river", "dam", "nile", "yangtze", "pacific", "arctic", "atlantic", "mediterranean")
    ):
        locks[a] = b


def build_page_locks(text: str) -> dict[str, str]:
    locks = dict(KNOWN_LOCKS)
    # Harvest teaching tables (not List-I dumps): Pair|Correct, Item|Lock, Feature|Fact, etc.
    for tm in re.finditer(r"((?:^\|.+\|\s*\n){3,})", text, re.M):
        parsed = parse_table(tm.group(1))
        if not parsed:
            continue
        header, body = parsed
        if is_list_match_table(header, body):
            continue
        if len(header) < 2:
            continue
        h = [norm(x) for x in header]
        for row in body:
            if len(row) < 2:
                continue
            cells = [c.strip() for c in row]
            _add_lock(locks, cells[0], cells[1])
            # Multi-column geography tables: River|Source|Mouth|Country, City|Country|River, Dam|Country|River
            if len(cells) >= 3 and cells[2].strip():
                _add_lock(locks, cells[0], cells[2])
                # dam/city → river when middle is country
                if any(x in h[1] for x in ("country", "nation", "state")) and any(
                    x in (h[2] if len(h) > 2 else "") for x in ("river", "stream", "tributary")
                ):
                    _add_lock(locks, cells[0], cells[2])
            if len(cells) >= 4 and cells[3].strip():
                # River|Source|Mouth|Note — mouth often col2; also lock mouth keywords
                mouth = cells[2]
                if re.search(r"ocean|sea|gulf|bay|lake|channel", mouth, re.I):
                    _add_lock(locks, cells[0], mouth)
            # Reverse helpful city↔river when headers suggest it
            if len(cells) >= 3 and any(x in " ".join(h) for x in ("city", "capital", "town")):
                if any(x in " ".join(h) for x in ("river",)):
                    # find river column
                    for i, hh in enumerate(h):
                        if "river" in hh and i < len(cells):
                            _add_lock(locks, cells[0], cells[i])
                            _add_lock(locks, cells[i], cells[0])
    # Extra classic river / city / dam locks (HYT reading often states them in prose, not pairs)
    extras = {
        "lena": "arctic ocean",
        "amur": "pacific ocean",
        "tigris": "persian gulf",
        "euphrates": "persian gulf",
        "mahi": "arabian sea",
        "shatt-al-arab": "basra",
        "shatt al arab": "basra",
        "paraguay": "asuncion",
        "asuncion": "paraguay",
        "niger": "niamey",
        "niamey": "niger",
        "danube": "vienna",
        "vienna": "danube",
        "paris": "seine",
        "seine": "paris",
        "kinshasa": "zaire (congo)",
        "bangkok": "chao phraya",
        "chao phraya": "bangkok",
        "menam (chao phraya)": "bangkok",
        "washington d.c.": "river potomac",
        "washington dc": "river potomac",
        "washington d.c": "potomac",
        "berlin": "river spree",
        "spree": "berlin",
        "madrid": "river manzanares",
        "manzanares": "madrid",
        "lahore": "ravi",
        "ravi": "lahore",
        "new york": "hudson",
        "hudson": "new york",
        "rome": "tiber",
        "tiber": "rome",
        "phnom-penh": "mekong",
        "phnom penh": "mekong",
        "hanoi": "red river",
        "yangon": "irrawaddy",
        "khartoum": "nile",
        "brazzaville": "zaire",
        "rotterdam": "rhine",
        "colorado": "hoover",
        "hoover": "colorado",
        "damodar": "panchet",
        "panchet": "damodar",
        "nile": "aswan",
        "aswan": "nile",
        "zambezi": "kariba",
        "kariba": "zambezi",
        "three gorges": "yangtze",
        "yangtze": "three gorges",
        "itaipu": "parana",
        "paraná": "itaipu",
        "parana": "itaipu",
        "syr darya": "north-west into the aral",
        "angara": "north out of baikal",
        "volga": "valdai hills → caspian",
        "mekong": "tibet → se; delta in s. vietnam",
        "bird's-foot delta": "mississippi",
        "bird’s-foot delta": "mississippi",
        "arcuate delta": "nile / hwang ho / niger",
        "potomac": "washington",
        # dams / vegetation / parks / nicknames
        "cauvery": "mettur",
        "krishna": "almatti",
        "narmada": "sardar sarovar",
        "chambal": "gandhi sagar",
        "mettur": "cauvery",
        "almatti": "krishna",
        "sardar sarovar": "narmada",
        "gandhi sagar": "chambal",
        "teak": "central india",
        "deodar": "high altitude regions of himalaya",
        "sundari": "sunderban",
        "cinchona": "himalayan tarai region",
        "tropical moist deciduous": "middle ganga plain",
        "tropical dry deciduous": "tarai",
        "alpine": "arunachal pradesh",
        "tropical evergreen": "sahyadris",
        "simlipal": "odisha",
        "indravati": "chhattisgarh",
        "kanha": "madhya pradesh",
        "bandipur": "karnataka",
        "niagara falls": "new york state",
        "the land of thousand lakes": "finland",
        "country of thousand lakes": "finland",
        "eiffel tower": "paris",
        "the roof of the world": "pamir",
        "dark continent": "africa",
        "pearls island": "bahrain",
        "achra ratnagiri": "maharashtra",
        "coondapur": "karnataka",
        "pichavaram": "tamil nadu",
        "vembanad": "kerala",
        "jawahar sagar": "rajasthan",
        "nagarjuna sagar": "andhra pradesh",
        "sivasamudram": "kerala",
        "govind sagar": "satluj",
        "kolleru lake": "krishna",
        "ukai reservoir": "tapi",
        "wular lake": "jhelum",
    }
    for k, v in extras.items():
        _add_lock(locks, k, v)
    return locks


def score_pair(left_text: str, right_text: str, locks: dict[str, str]) -> int:
    L, R = norm(left_text), norm(right_text)
    if not L or not R:
        return 0
    # direct
    if locks.get(L) == R:
        return 10
    # substring / containment
    for k, v in locks.items():
        if not (k in L or L in k):
            continue
        if v == R or v in R or R in v:
            return 8
        v_toks = [t.strip() for t in re.split(r"[/;,()]", v) if len(t.strip()) > 2]
        r_toks = [t.strip() for t in re.split(r"[/;,()]", R) if len(t.strip()) > 2]
        if any(vt in R or vt in r_toks for vt in v_toks):
            return 7
        if any(rt in v for rt in r_toks if len(rt) > 3):
            return 6
    # soft token overlap (countries / short place names)
    l_core = re.sub(r"\b(mount|mt|peak|volcano|river|lake)\b", "", L).strip()
    if l_core and l_core in locks:
        v = locks[l_core]
        if v in R or R in v or any(t and t in R for t in re.split(r"[/;,]", v) if len(t) > 3):
            return 7
    # special NOT ring of fire
    if "kilimanjaro" in L and ("not" in R or "east africa" in R or "rift" in R):
        return 7
    if "titan" in L and "saturn" in R:
        return 10
    if "titan" in L and "mars" in R:
        return -5
    return 0


def solve_code(left: list[tuple[str, str]], right: list[tuple[str, str]], locks: dict[str, str]) -> str | None:
    if len(left) != 4 or len(right) != 4:
        # allow 3
        if len(left) < 3 or len(right) < 3:
            return None
    scored: list[tuple[int, str]] = []
    for perm in itertools.permutations(right, len(left)):
        score = 0
        code_parts = []
        for (letter, ltxt), (num, rtxt) in zip(left, perm):
            score += score_pair(ltxt, rtxt, locks)
            code_parts.append(num)
        scored.append((score, " ".join(code_parts)))
    scored.sort(key=lambda x: -x[0])
    best_score, best = scored[0]
    second = scored[1][0] if len(scored) > 1 else -10**9
    # require confidence: solid pairs, or clear unique winner
    if best_score >= 12:
        return best
    if best_score >= 8 and best_score - second >= 4:
        return best
    return None


def distractors(correct: str, n: int = 3) -> list[str]:
    parts = correct.split()
    if len(parts) != 4:
        # pad/truncate
        while len(parts) < 4:
            parts.append(str(len(parts) + 1))
        parts = parts[:4]
    cands = []
    # swap adjacent
    for i in range(3):
        p = parts[:]
        p[i], p[i + 1] = p[i + 1], p[i]
        cands.append(" ".join(p))
    # reverse
    cands.append(" ".join(reversed(parts)))
    # rotate
    cands.append(" ".join(parts[1:] + parts[:1]))
    # common wrong identity order
    cands.append("1 2 3 4")
    out = []
    for c in cands:
        if c != correct and c not in out:
            out.append(c)
        if len(out) >= n:
            break
    while len(out) < n:
        out.append("1 2 3 4" if "1 2 3 4" != correct else "4 3 2 1")
    return out[:n]


def render_question(
    qnum: int,
    title: str,
    header: list[str],
    left: list[tuple[str, str]],
    right: list[tuple[str, str]],
    correct_code: str,
    key_letter: str,
) -> str:
    h0 = header[0] if header else "List-I"
    h1 = header[1] if len(header) > 1 else "List-II"
    # normalize header labels
    if not re.search(r"list", h0, re.I):
        h0 = f"List-I ({h0})"
    if not re.search(r"list", h1, re.I):
        h1 = f"List-II ({h1})"

    rows = []
    # present List-I in A-D order and List-II in 1-4 order (standard paper layout)
    right_sorted = sorted(right, key=lambda x: int(x[0]))
    left_sorted = sorted(left, key=lambda x: x[0])
    for i in range(max(len(left_sorted), len(right_sorted))):
        lcell = f"{left_sorted[i][0]}. {left_sorted[i][1]}" if i < len(left_sorted) else ""
        rcell = f"{right_sorted[i][0]}. {right_sorted[i][1]}" if i < len(right_sorted) else ""
        rows.append(f"| {lcell} | {rcell} |")

    table = (
        f"| {h0} | {h1} |\n|---|---|\n" + "\n".join(rows) + "\n"
    )

    opts = distractors(correct_code, 3)
    # place correct at key_letter
    letters = ["A", "B", "C", "D"]
    opt_map = {}
    others = opts[:]
    for L in letters:
        if L == key_letter:
            opt_map[L] = correct_code
        else:
            opt_map[L] = others.pop(0)

    # pair explanation
    pair_lines = []
    right_by_num = {n: t for n, t in right_sorted}
    code_nums = correct_code.split()
    for (letter, ltxt), num in zip(left_sorted, code_nums):
        pair_lines.append(f"{letter} → {num} ({ltxt} ↔ {right_by_num.get(num, '?')})")

    stem_title = re.sub(r"^#+\s*", "", title).strip()
    stem_title = re.sub(
        r"^(Match Matrix:|High-Yield Match Matrix|Comparative Matrix:)\s*",
        "",
        stem_title,
        flags=re.I,
    ).strip()

    return (
        f"**Q{qnum}.**\n"
        f"Match List-I with List-II and select the correct answer using the code given below the lists:\n\n"
        f"**{stem_title or 'Match the following'}**\n\n"
        f"{table}\n"
        f"*Row order is not the answer code.*\n\n"
        f"A. {opt_map['A']}\n\n"
        f"B. {opt_map['B']}\n\n"
        f"C. {opt_map['C']}\n\n"
        f"D. {opt_map['D']}\n\n"
        f"<details>\n"
        f"<summary>Show answer</summary>\n\n"
        f"**Ans: {key_letter}.** Code **{correct_code}**.\n\n"
        f"**Logic:** {' '.join(pair_lines)}. Trap: treating table row order as the answer code.\n\n"
        f"</details>\n"
    )


SECTION_RE = re.compile(
    r"(?ms)^(###\s+[^\n]+)\n+(.*?)(?=^###\s+|^##\s+|\Z)"
)


def process_file(path: Path, dry_run: bool = False) -> tuple[int, int]:
    text = path.read_text(encoding="utf-8")
    qm = QUIZ_HEAD.search(text)
    if not qm:
        return 0, 0
    reading = text[: qm.start()]
    quiz = text[qm.start() :]

    locks = build_page_locks(reading)
    moved = []
    removed_spans = []

    for m in SECTION_RE.finditer(reading):
        heading = m.group(1).strip()
        body = m.group(2)
        # only consider sections before Key Observations / quiz
        if re.search(r"Key Table Observations|Memory Anchors", heading, re.I):
            continue
        parsed = None
        tm = re.search(r"((?:^\|.+\|\s*\n){3,})", body, re.M)
        if not tm:
            continue
        parsed = parse_table(tm.group(1))
        if not parsed:
            continue
        header, rows = parsed
        heading_is_match = bool(
            re.search(
                r"Match Matrix|High-Yield Match(?:\s+Matrix)?|Comparative Matrix:\s*List|Master Comparison Table",
                heading,
                re.I,
            )
        )
        # Any A–D vs 1–4 (or i–iv) dump in reading is a match stem, regardless of heading
        if not is_list_match_table(header, rows):
            continue
        _ = heading_is_match  # retained for clarity / future filters

        left, right = extract_lr(rows)
        code = solve_code(left, right, locks)
        if not code:
            # still remove dump from reading, but skip quiz if unsolved
            removed_spans.append((m.start(), m.end(), heading, None, left, right, header))
            continue
        removed_spans.append((m.start(), m.end(), heading, code, left, right, header))

    if not removed_spans:
        return 0, 0

    # Remove from reading (reverse order)
    new_reading = reading
    unsolved = 0
    solved_payload = []
    for start, end, heading, code, left, right, header in sorted(removed_spans, key=lambda x: -x[0]):
        new_reading = new_reading[:start] + new_reading[end:]
        if code is None:
            unsolved += 1
        else:
            solved_payload.append((heading, code, left, right, header))

    # compact excess blank lines
    new_reading = re.sub(r"\n{4,}", "\n\n\n", new_reading)

    # existing quiz Q count
    existing_q = len(re.findall(r"(?m)^\*\*Q\d+\.\*\*", quiz))
    # append solved questions with balanced keys
    letters_cycle = ["A", "B", "C", "D"]
    # reverse payload because we collected while deleting reverse; restore document order
    solved_payload = list(reversed(solved_payload))
    new_qs = []
    for i, (heading, code, left, right, header) in enumerate(solved_payload):
        qnum = existing_q + i + 1
        key = letters_cycle[i % 4]
        new_qs.append(
            render_question(qnum, heading, header, left, right, code, key)
        )

    if new_qs:
        quiz = quiz.rstrip() + "\n\n" + "\n".join(new_qs) + "\n"

    out = new_reading + quiz
    if not dry_run:
        path.write_text(out, encoding="utf-8", newline="\n")
    return len(solved_payload), unsolved


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=str(HYT_ROOT))
    ap.add_argument("--only", nargs="*", help="Relative paths under high-yield-tables")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--geography-only", action="store_true")
    args = ap.parse_args()
    root = Path(args.root)
    files = sorted(root.rglob("*.md"))
    files = [f for f in files if f.name.lower() not in {"index.md", "prompt.md"} and not f.name.startswith(".")]
    if args.geography_only:
        files = [f for f in files if "geography" in f.parts]
    if args.only:
        wanted = set(args.only)
        files = [f for f in files if f.name in wanted or str(f.relative_to(root)).replace("\\", "/") in wanted]

    total_moved = total_unsolved = 0
    touched = 0
    for f in files:
        moved, unsolved = process_file(f, dry_run=args.dry_run)
        if moved or unsolved:
            touched += 1
            rel = f.relative_to(root)
            print(f"{rel}: moved={moved} unsolved_removed={unsolved}")
            total_moved += moved
            total_unsolved += unsolved
    print(f"FILES={touched} MOVED_TO_QUIZ={total_moved} REMOVED_UNSOLVED={total_unsolved}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
