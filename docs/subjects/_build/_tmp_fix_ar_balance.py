# -*- coding: utf-8 -*-
import re
from collections import Counter
from pathlib import Path

REV = Path(__file__).resolve().parents[2] / "revision" / "must-score-facts" / "geography"

AR_OPTS = (
    "A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)\n"
    "B. (A) is false, but (R) is true\n"
    "C. (A) is true, but (R) is false\n"
    "D. Both (A) and (R) are true and (R) is the correct explanation of (A)\n"
)

# Correct letter under STANDARD 2024-25 A/R option order
AR_ANS = {
    ("01_Indian_Physical_Geography_Mountains_Hills.md", 4): "C",
    ("01_Indian_Physical_Geography_Mountains_Hills.md", 13): "A",
    ("02_Climate_of_India.md", 4): "C",
    ("02_Climate_of_India.md", 12): "A",
    ("03_Drainage_System.md", 4): "C",
    ("03_Drainage_System.md", 13): "A",
    ("04_Lakes_Waterfalls_Water_Resources.md", 4): "A",
    ("04_Lakes_Waterfalls_Water_Resources.md", 13): "C",
}

FILES = [
    "01_Indian_Physical_Geography_Mountains_Hills.md",
    "02_Climate_of_India.md",
    "03_Drainage_System.md",
    "04_Lakes_Waterfalls_Water_Resources.md",
]


def split_quiz(quiz: str):
    parts = re.split(r"(?m)(?=^\*\*Q\d+\.\*\*)", quiz)
    return parts[0], parts[1:]


def is_ar(q: str) -> bool:
    return "Assertion (A):" in q


def fix_ar_block(q: str, want: str) -> str:
    # Replace option quartet after Reason (R) line
    q2 = re.sub(
        r"(Reason \(R\):[^\n]*\n\n)(?:[A-D]\..*\n){4}",
        r"\1" + AR_OPTS,
        q,
        count=1,
    )
    q2 = re.sub(r"\*\*Ans:\s*[A-D]\.", f"**Ans: {want}.", q2, count=1)
    return q2


def rotate_non_ar(q: str, old: str, new: str) -> str:
    """Rotate A-D option texts so correct content moves from old -> new."""
    # Only option lines before <details>
    pre, sep, post = q.partition("<details>")
    opts = {}
    for m in re.finditer(r"^([A-D])\.\s+(.+)$", pre, re.M):
        opts[m.group(1)] = m.group(2)
    if set(opts) != set("ABCD"):
        raise ValueError("bad options")
    letters = "ABCD"
    remaining = [l for l in letters if l != new]
    others = [opts[l] for l in letters if l != old]
    new_opts = {new: opts[old]}
    for l, c in zip(remaining, others):
        new_opts[l] = c

    def repl(m):
        return f"{m.group(1)}. {new_opts[m.group(1)]}"

    pre2 = re.sub(r"^([A-D])\.\s+(.+)$", repl, pre, flags=re.M)
    post2 = re.sub(r"\*\*Ans:\s*[A-D]\.", f"**Ans: {new}.", post, count=1)
    return pre2 + sep + post2


def ans_of(q: str) -> str:
    m = re.search(r"\*\*Ans:\s*([A-D])\.", q)
    if not m:
        m = re.search(r"\*\*Ans:\s*([A-D])\b", q)
    if not m:
        raise ValueError("no ans in:\n" + q[:200])
    return m.group(1)


def main() -> None:
    for fname in FILES:
        path = REV / fname
        text = path.read_text(encoding="utf-8")
        marker = "## 🎯 Revision Practice MCQs"
        i = text.find(marker)
        pre, quiz = text[:i], text[i:]
        head, qs = split_quiz(quiz)
        assert len(qs) == 20, fname

        # 1) Fix A/R
        for idx, q in enumerate(qs):
            qn = idx + 1
            if (fname, qn) in AR_ANS:
                qs[idx] = fix_ar_block(q, AR_ANS[(fname, qn)])

        # 2) Rebalance non-A/R only
        frozen = {qn for (f, qn) in AR_ANS if f == fname}
        counts = Counter(ans_of(qs[qn - 1]) for qn in frozen)
        need = {k: 5 - counts.get(k, 0) for k in "ABCD"}
        remain = [i for i in range(20) if (i + 1) not in frozen]
        targets = []
        for k in "ABCD":
            targets.extend([k] * need[k])
        assert len(targets) == len(remain), (fname, need, len(remain), counts)

        for i, want in zip(remain, targets):
            cur = ans_of(qs[i])
            if cur == want:
                continue
            if is_ar(qs[i]):
                raise SystemExit(f"unexpected AR at Q{i+1} {fname}")
            qs[i] = rotate_non_ar(qs[i], cur, want)

        new_quiz = head + "".join(qs)
        path.write_text(pre + new_quiz, encoding="utf-8", newline="\n")

        ans = [ans_of(q) for q in qs]
        ar_ok = all(
            "A. Both (A) and (R) are true, but (R) is not the correct explanation of (A)" in q
            and "B. (A) is false, but (R) is true" in q
            and "C. (A) is true, but (R) is false" in q
            and "D. Both (A) and (R) are true and (R) is the correct explanation of (A)" in q
            for q in qs
            if is_ar(q)
        )
        print(fname, "".join(ans), Counter(ans), "AR_ok", ar_ok)


if __name__ == "__main__":
    main()
