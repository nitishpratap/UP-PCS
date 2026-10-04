"""Build Daily_Study_Planner.docx for Google Docs upload."""
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

doc = Document()
section = doc.sections[0]
section.top_margin = Cm(1.5)
section.bottom_margin = Cm(1.5)
section.left_margin = Cm(1.8)
section.right_margin = Cm(1.8)


def set_run_font(run, size=11, bold=False, color=None):
    run.font.name = "Calibri"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    run.font.size = Pt(size)
    run.bold = bold
    if color:
        run.font.color.rgb = RGBColor(*color)


def add_heading_styled(text, level=1):
    p = doc.add_heading(text, level=level)
    for run in p.runs:
        set_run_font(
            run,
            size={1: 20, 2: 14, 3: 12}.get(level, 11),
            bold=True,
            color=(15, 76, 129) if level <= 2 else (30, 30, 30),
        )
    return p


def add_para(text, bold=False, size=11, space_after=6):
    p = doc.add_paragraph()
    run = p.add_run(text)
    set_run_font(run, size=size, bold=bold)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(0)
    return p


def shade_cell(cell, hex_color):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), hex_color)
    shd.set(qn("w:val"), "clear")
    tcPr.append(shd)


def set_cell_text(cell, text, bold=False, size=10, center=False):
    cell.text = ""
    p = cell.paragraphs[0]
    if center:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    set_run_font(run, size=size, bold=bold)
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement("w:tcMar")
    for m in ("top", "left", "bottom", "right"):
        node = OxmlElement(f"w:{m}")
        node.set(qn("w:w"), "60")
        node.set(qn("w:type"), "dxa")
        tcMar.append(node)
    tcPr.append(tcMar)


def add_table(headers, rows, header_fill="0F4C81"):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        set_cell_text(table.rows[0].cells[i], h, bold=True, size=10, center=True)
        shade_cell(table.rows[0].cells[i], header_fill)
        for p in table.rows[0].cells[i].paragraphs:
            for run in p.runs:
                run.font.color.rgb = RGBColor(255, 255, 255)
    for r_idx, row in enumerate(rows):
        for c_idx, val in enumerate(row):
            set_cell_text(table.rows[r_idx + 1].cells[c_idx], val, size=10)
            if r_idx % 2 == 1:
                shade_cell(table.rows[r_idx + 1].cells[c_idx], "F3F6FA")
    doc.add_paragraph()
    return table


def add_blank_line(label, width=40):
    add_para(f"{label} {'_' * width}", size=11)


def add_checkbox_line(text):
    add_para(f"☐  {text}", size=11)


title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = title.add_run("DAILY STUDY PLANNER")
set_run_font(r, size=22, bold=True, color=(15, 76, 129))

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = sub.add_run("UPPCS / UKPCS Prelims  ·  Target date: 6 December 2026")
set_run_font(r, size=12, bold=False, color=(80, 80, 80))

meta = doc.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = meta.add_run(
    "Office: 10:30–18:00  ·  Wake: 08:00  ·  Morning = Ratta  ·  Evening = One subject deep read"
)
set_run_font(r, size=10, color=(90, 90, 90))

add_para(
    "How to use in Google Docs: File → Open → Upload this .docx. "
    "Fill blanks each morning and night. Duplicate a Day Log section when you need a new week.",
    size=10,
)

add_heading_styled("1. Fixed daily clock (office days)", 1)
add_table(
    ["Time", "Block", "What you do"],
    [
        ["08:00", "Wake", "Out of bed. No phone scroll."],
        ["08:00–08:20", "Prep", "Wash, water/tea, open planner + revision desk."],
        ["08:20–09:00", "Must-Score Facts", "Ratta only — today’s MSF cycle slice (see §2)."],
        ["09:00–09:40", "High-Yield Tables", "Tables / confused pairs / match spines — today’s HYT cycle."],
        ["09:40–10:15", "Buffer + leave", "Fill morning log. Bag. Leave for office."],
        ["10:30–18:00", "Office", "Work day. Optional: one 10-min weak-fact flashcard gap."],
        ["18:00–19:00", "Reset", "Commute / dinner / rest. No heavy reading yet."],
        ["19:00–21:30", "Subject deep read", "One subject from Subject Notes (see §3)."],
        ["21:30–21:50", "Close the day", "Tick Chapter Tracker. Log evening. 2–3 weak lines to Error Tracker."],
        ["22:30", "Sleep target", "Protect morning ratta energy."],
    ],
)

add_heading_styled("Weekend / holiday clock (optional)", 2)
add_table(
    ["Time", "Block"],
    [
        ["08:00–08:20", "Prep"],
        ["08:20–10:00", "MSF + HYT (fuller pass — same cycle day)"],
        ["10:15–13:00", "Subject deep read (session 1)"],
        ["14:30–17:30", "Subject deep read (session 2) or second subject if first is done"],
        ["19:00–20:00", "Weak facts + Error Tracker + light Active Recall"],
    ],
)

add_heading_styled("2. Morning ratta cycles (3-day full pass)", 1)
add_para(
    "Each layer finishes in about 3 office mornings, then restarts. "
    "Do both every morning — MSF first, HYT second."
)

add_heading_styled("Must-Score Facts — 3-day rotation", 2)
add_table(
    ["Cycle day", "Subjects to cover", "Aim"],
    [
        ["MSF-1", "Geography · Polity · Environment & Ecology", "Highest PYQ weight — never skip"],
        ["MSF-2", "Modern · Medieval · Ancient · Art & Culture", "History + culture block"],
        ["MSF-3", "Economy · S&T · Census · UP Special", "Remaining static + state"],
    ],
)
add_para("After MSF-3 → next morning is MSF-1 again (new loop).")

add_heading_styled("High-Yield Tables — 3-day rotation", 2)
add_table(
    ["Cycle day", "Subjects to cover", "Aim"],
    [
        ["HYT-1", "Geography · Polity · Environment & Ecology", "Matrices you confuse under time"],
        ["HYT-2", "Modern · Medieval · Ancient · Art & Culture", "Chronology / match / officer–book tables"],
        ["HYT-3", "Economy · S&T · Census · UP Special", "Schemes, ranks, science tables, UP traps"],
    ],
)
add_para("After HYT-3 → next morning is HYT-1 again.")

add_heading_styled("How to ratta (keep it mechanical)", 2)
for i, t in enumerate(
    [
        "Open only today’s cycle subjects — do not wander into evening subject reading.",
        "For each chapter: read Consolidated / tables aloud or under breath; mark weak lines.",
        "If interactive MCQs are ready and you have 5 minutes left, run them — otherwise leave drills for weekend.",
        "Stop at 09:40. Incomplete chapters roll to the same cycle day next loop, not into evening.",
    ],
    1,
):
    add_para(f"{i}. {t}")
add_para("Suggested start: first office morning = MSF-1 + HYT-1.", bold=True)

add_heading_styled("3. Evening subject deep read", 1)
add_para("Pick one subject per office evening. Finish open chapters before switching.")
add_table(
    ["Priority", "Subject", "Why first"],
    [
        ["1", "Geography", "Heaviest static scoring base"],
        ["2", "Polity", "Articles, bodies, Parliament, PRIs"],
        ["3", "Environment & Ecology", "SDGs, protected areas, climate"],
        ["4", "Modern India", "Chronology + movements"],
        ["5", "Medieval India", "Rising weight"],
        ["6", "Ancient History", "Precise site / text traps"],
        ["7", "Art & Culture", "Often rides inside History"],
        ["8", "Economy", "Schemes + basics"],
        ["9", "Science & Technology", "UKPCS Unit 5 + GS misc"],
        ["10", "Census & Urbanisation", "Data traps"],
        ["11", "UP Special", "State area share"],
    ],
)
add_para("Evening rules:", bold=True)
for t in [
    "One subject only (weekend may add a second).",
    "Read from Subject Notes teaching cards — not random YouTube.",
    "End by ticking finished chapters in Chapter Priority Tracker.",
    "Park wrong / shaky facts in Error Tracker.",
]:
    add_para(f"• {t}")

doc.add_page_break()
add_heading_styled("4. Blank Day Log template (duplicate for new days)", 1)
add_para("Fill in the morning buffer (09:40–10:15) before leaving. Fill evening result at 21:30.")

add_heading_styled(
    "Day log — ____ / ____ / 2026  (__________)  ·  D-___ to 6 Dec",
    2,
)
add_checkbox_line("Wake at 08:00 done")
add_checkbox_line("Woke late — actual time: __________")

add_heading_styled("Morning ratta", 3)
add_table(
    ["Layer", "Cycle day", "Subjects opened", "Chapters finished today", "Weak lines to revisit"],
    [
        ["Must-Score Facts", "MSF-__", "", "", ""],
        ["High-Yield Tables", "HYT-__", "", "", ""],
    ],
)
add_checkbox_line("MSF morning done")
add_checkbox_line("HYT morning done")
add_blank_line("Minutes used:", 20)

add_heading_styled("Office day", 3)
add_blank_line("Energy at desk (1–5):", 10)
add_checkbox_line("No flashcard gap")
add_checkbox_line("Used 10-min flashcard gap — topic: ____________________")

add_heading_styled("Evening plan (set in morning — execute after 19:00)", 3)
add_blank_line("Subject tonight:", 35)
add_blank_line("Target chapters:", 35)
add_blank_line("Stretch goal (only if time):", 28)

add_heading_styled("Evening result (fill at 21:30)", 3)
add_blank_line("Actually read:", 38)
add_blank_line("Chapters ticked in Chapter Tracker:", 22)
add_blank_line("Error Tracker entries added:", 15)
add_blank_line("Tomorrow morning continues: MSF-__ + HYT-__", 8)

add_heading_styled("One-line close", 3)
add_blank_line("Today's win:", 40)
add_blank_line("Tomorrow must not skip:", 32)

doc.add_page_break()
add_heading_styled("5. Live logs — Week of 6 Oct 2026", 1)
add_para("Pre-filled cycle days. Tick boxes and type into the blank cells in Google Docs.")

days = [
    ("2026-10-06 (Mon)", "D-61", "MSF-1", "HYT-1", "Geography · Polity · Environment", "MSF-2 + HYT-2"),
    ("2026-10-07 (Tue)", "D-60", "MSF-2", "HYT-2", "Modern · Medieval · Ancient · Art & Culture", "MSF-3 + HYT-3"),
    ("2026-10-08 (Wed)", "D-59", "MSF-3", "HYT-3", "Economy · S&T · Census · UP Special", "MSF-1 + HYT-1 (loop 2)"),
    ("2026-10-09 (Thu)", "D-58", "MSF-1", "HYT-1", "Geography · Polity · Environment", "MSF-2 + HYT-2"),
    ("2026-10-10 (Fri)", "D-57", "MSF-2", "HYT-2", "Modern · Medieval · Ancient · Art & Culture", "MSF-3 + HYT-3"),
    ("2026-10-11 (Sat)", "D-56", "MSF-3", "HYT-3", "Economy · S&T · Census · UP Special", "MSF-1 + HYT-1"),
    ("2026-10-12 (Sun)", "D-55", "MSF-1", "HYT-1", "Geography · Polity · Environment", "Mon: MSF-2 + HYT-2"),
]

for date, dcount, msf, hyt, subjects, tomorrow in days:
    add_heading_styled(f"Day log — {date}  ·  {dcount} to 6 Dec", 2)
    add_checkbox_line("Wake 08:00 done")
    add_checkbox_line("Woke late — actual: __________")
    add_table(
        ["Layer", "Cycle", "Subjects", "Chapters finished", "Weak lines"],
        [
            ["Must-Score Facts", msf, subjects, "", ""],
            ["High-Yield Tables", hyt, subjects, "", ""],
        ],
    )
    add_checkbox_line("MSF done")
    add_checkbox_line("HYT done")
    add_blank_line("Minutes used:", 12)
    add_blank_line("Evening subject plan:", 30)
    add_blank_line("Target chapters:", 34)
    add_blank_line("Evening result (read):", 30)
    add_blank_line("Tracker ticks / errors logged:", 22)
    add_blank_line(f"Win: ______________________________  ·  Tomorrow: {tomorrow}", 2)
    p = doc.add_paragraph()
    r = p.add_run("—" * 40)
    set_run_font(r, size=9, color=(180, 180, 180))

doc.add_page_break()
add_heading_styled("6. Weekly scoreboard (fill every Sunday night)", 1)
add_table(
    [
        "Week ending",
        "MSF loops finished",
        "HYT loops finished",
        "Evening subjects touched",
        "Chapters ticked",
        "Honest note",
    ],
    [
        ["2026-10-12", "", "", "", "", ""],
        ["2026-10-19", "", "", "", "", ""],
        ["2026-10-26", "", "", "", "", ""],
        ["2026-11-02", "", "", "", "", ""],
        ["2026-11-09", "", "", "", "", ""],
        ["2026-11-16", "", "", "", "", ""],
        ["2026-11-23", "", "", "", "", ""],
        ["2026-11-30", "", "", "", "", ""],
        ["2026-12-05", "", "", "", "", ""],
    ],
)

add_heading_styled("7. Non-negotiables", 1)
for i, t in enumerate(
    [
        "Morning ratta is sacred — even a thin 40-minute MSF+HYT day beats skipping.",
        "Do not mix morning ratta with evening subject reading in the same sitting.",
        "One evening subject on office days — depth over hopping.",
        "If you wake late: cut HYT short; never cut MSF-1 / Geo–Polity–Env when that is today’s cycle.",
        "After each full MSF-3 / HYT-3 day, you completed one full ratta pass — restart; do not invent a fourth day.",
    ],
    1,
):
    add_para(f"{i}. {t}")

add_heading_styled("8. Add next week’s logs", 1)
add_para(
    "In Google Docs: copy any Day Log section → paste below → update date, D-countdown, "
    "and MSF/HYT cycle numbers (1 → 2 → 3 → 1…). Pre-fill subject names for that cycle day. "
    "Fill blanks morning and night."
)

out = Path(__file__).resolve().parent / "Daily_Study_Planner.docx"
doc.save(out)
print(f"Saved: {out}")
print(f"Size: {out.stat().st_size} bytes")
