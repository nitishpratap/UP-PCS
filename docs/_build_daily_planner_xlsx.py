"""Build Daily_Study_Planner.xlsx for Google Sheets upload.

Morning rule: ONE layer per day (MSF or HYT), ~100 min (08:20–10:00).
6-day loop: MSF-1, HYT-1, MSF-2, HYT-2, MSF-3, HYT-3, repeat.
"""
from datetime import date, timedelta
from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).resolve().parent / "Daily_Study_Planner.xlsx"
EXAM = date(2026, 12, 6)
START = date(2026, 10, 6)

NAVY = PatternFill("solid", fgColor="0F4C81")
LIGHT = PatternFill("solid", fgColor="F3F6FA")
GREEN = PatternFill("solid", fgColor="E8F5E9")
AMBER = PatternFill("solid", fgColor="FFF8E1")
MSF_FILL = PatternFill("solid", fgColor="E3F2FD")
HYT_FILL = PatternFill("solid", fgColor="F3E5F5")
WHITE_FONT = Font(name="Calibri", bold=True, color="FFFFFF", size=11)
HEADER_FONT = Font(name="Calibri", bold=True, size=12, color="0F4C81")
TITLE_FONT = Font(name="Calibri", bold=True, size=16, color="0F4C81")
BODY = Font(name="Calibri", size=11)
THIN = Border(
    left=Side(style="thin", color="CFD8DC"),
    right=Side(style="thin", color="CFD8DC"),
    top=Side(style="thin", color="CFD8DC"),
    bottom=Side(style="thin", color="CFD8DC"),
)
WRAP = Alignment(wrap_text=True, vertical="center")
CENTER = Alignment(wrap_text=True, vertical="center", horizontal="center")

PACKS = {
    1: "Geography · Polity · Environment",
    2: "Modern · Medieval · Ancient · Art & Culture",
    3: "Economy · S&T · Census · UP Special",
}
LOOP_LETTERS = ["A", "B", "C", "D", "E", "F"]


def style_header_row(ws, row, cols):
    for c in range(1, cols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = NAVY
        cell.font = WHITE_FONT
        cell.alignment = CENTER
        cell.border = THIN


def style_body(ws, r1, r2, cols):
    for r in range(r1, r2 + 1):
        for c in range(1, cols + 1):
            cell = ws.cell(row=r, column=c)
            cell.font = BODY
            cell.border = THIN
            cell.alignment = WRAP
            if r % 2 == 0:
                cell.fill = LIGHT


def set_widths(ws, widths):
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w


def layer_for(day_index: int):
    """Alternate MSF / HYT. Even index = MSF, odd = HYT. Slice advances every two days."""
    loop_pos = day_index % 6
    letter = LOOP_LETTERS[loop_pos]
    slice_n = (loop_pos // 2) + 1
    pack = PACKS[slice_n]
    if loop_pos % 2 == 0:
        return letter, "MSF only", f"MSF-{slice_n}", pack
    return letter, "HYT only", f"HYT-{slice_n}", pack


wb = Workbook()

# ----- Daily Log -----
ws = wb.active
ws.title = "Daily Log"
ws["A1"] = "DAILY STUDY PLANNER — Fill Sheet (one layer per morning)"
ws["A1"].font = TITLE_FONT
ws.merge_cells("A1:P1")
ws["A2"] = (
    "Prelims: 6 Dec 2026  |  Wake 08:00  |  Office 10:30–18:00  |  "
    "Morning 08:20–10:00 = MSF OR HYT only (~100 min) — never both  |  "
    "6-day loop: MSF-1 → HYT-1 → MSF-2 → HYT-2 → MSF-3 → HYT-3 → repeat  |  "
    "Upload to Google Sheets: File → Import → Upload"
)
ws["A2"].font = Font(name="Calibri", size=10, italic=True, color="546E7A")
ws.merge_cells("A2:P2")
ws.row_dimensions[1].height = 24
ws.row_dimensions[2].height = 40

headers = [
    "Date",
    "Day",
    "D-day",
    "Loop day",
    "Morning layer",
    "Slice",
    "Subjects (auto)",
    "Wake 8 AM?",
    "Actual wake",
    "Morning done?",
    "Morning mins",
    "Chapters finished",
    "Weak lines",
    "Evening subject",
    "Evening done?",
    "Win / note",
]
for col, h in enumerate(headers, 1):
    ws.cell(row=4, column=col, value=h)
style_header_row(ws, 4, len(headers))
ws.freeze_panes = "A5"
ws.auto_filter.ref = f"A4:P4"

subjects = [
    "Geography",
    "Polity",
    "Environment & Ecology",
    "Modern India",
    "Medieval India",
    "Ancient History",
    "Art & Culture",
    "Economy",
    "Science & Technology",
    "Census & Urbanisation",
    "UP Special",
    "Current Affairs",
    "Rest / Buffer",
]
dv_wake = DataValidation(type="list", formula1='"Yes,Late,No"', allow_blank=True)
dv_yn = DataValidation(type="list", formula1='"Yes,No,Partial"', allow_blank=True)
dv_sub = DataValidation(type="list", formula1='"' + ",".join(subjects) + '"', allow_blank=True)
ws.add_data_validation(dv_wake)
ws.add_data_validation(dv_yn)
ws.add_data_validation(dv_sub)

row = 5
d = START
idx = 0
last_row = 5
while d <= EXAM:
    letter, layer, slice_name, pack = layer_for(idx)
    values = [
        d,
        d.strftime("%a"),
        (EXAM - d).days,
        f"Day {letter}",
        layer,
        slice_name,
        pack,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ]
    for c, v in enumerate(values, 1):
        cell = ws.cell(row=row, column=c, value=v)
        cell.font = BODY
        cell.border = THIN
        cell.alignment = WRAP
    ws.cell(row=row, column=1).number_format = "YYYY-MM-DD"
    # tint layer column
    layer_fill = MSF_FILL if "MSF" in layer else HYT_FILL
    for c in (4, 5, 6):
        ws.cell(row=row, column=c).fill = layer_fill
    if d.weekday() >= 5:
        ws.cell(row=row, column=2).fill = AMBER
    last_row = row
    row += 1
    d += timedelta(days=1)
    idx += 1

dv_wake.add(f"H5:H{last_row}")
dv_yn.add(f"J5:J{last_row}")
dv_yn.add(f"O5:O{last_row}")
dv_sub.add(f"N5:N{last_row}")
ws.conditional_formatting.add(
    f"J5:J{last_row}",
    FormulaRule(formula=['$J5="Yes"'], fill=GREEN),
)

set_widths(ws, [12, 6, 8, 10, 12, 10, 38, 12, 12, 13, 12, 26, 26, 22, 13, 28])
for r in range(5, last_row + 1):
    ws.row_dimensions[r].height = 22

# ----- Clock -----
ws2 = wb.create_sheet("Daily Clock")
ws2["A1"] = "Fixed daily clock (~2 hour morning, one layer only)"
ws2["A1"].font = TITLE_FONT
ws2.merge_cells("A1:C1")
for c, h in enumerate(["Time", "Block", "What you do"], 1):
    ws2.cell(row=3, column=c, value=h)
style_header_row(ws2, 3, 3)
clock_rows = [
    ("08:00", "Wake", "Out of bed. No phone scroll."),
    ("08:00–08:20", "Prep", "Open TODAY’s layer only (MSF desk OR HYT desk)."),
    ("08:20–10:00", "Morning ratta (~100 min)", "ONE layer only — full deep ratta. Never both."),
    ("10:00–10:15", "Buffer + leave", "Fill Daily Log morning columns. Leave for office."),
    ("10:30–18:00", "Office", "Optional one 10-min weak-fact flash."),
    ("18:00–19:00", "Reset", "Commute / dinner / rest."),
    ("19:00–21:30", "Subject deep read", "One subject from Evening Priority."),
    ("21:30–21:50", "Close", "Fill evening columns. Chapter Tracker. Error log."),
    ("22:30", "Sleep", "Protect tomorrow morning."),
]
for i, rowv in enumerate(clock_rows):
    for c, v in enumerate(rowv, 1):
        ws2.cell(row=4 + i, column=c, value=v)
style_body(ws2, 4, 12, 3)
ws2["A14"] = "Weekend: still one layer in the morning block; use extra day hours for subject deep read."
ws2["A14"].font = Font(name="Calibri", size=10, italic=True)
ws2.merge_cells("A14:C14")
set_widths(ws2, [18, 28, 70])

# ----- Cycles -----
ws3 = wb.create_sheet("Ratta Cycles")
ws3["A1"] = "6-day morning loop — MSF and HYT alternate (never same day)"
ws3["A1"].font = TITLE_FONT
ws3.merge_cells("A1:D1")
for c, h in enumerate(["Loop day", "Morning layer", "Slice", "Subjects"], 1):
    ws3.cell(row=3, column=c, value=h)
style_header_row(ws3, 3, 4)
loop_rows = [
    ("Day A", "MSF only", "MSF-1", PACKS[1]),
    ("Day B", "HYT only", "HYT-1", PACKS[1]),
    ("Day C", "MSF only", "MSF-2", PACKS[2]),
    ("Day D", "HYT only", "HYT-2", PACKS[2]),
    ("Day E", "MSF only", "MSF-3", PACKS[3]),
    ("Day F", "HYT only", "HYT-3", PACKS[3]),
]
for i, rowv in enumerate(loop_rows):
    for c, v in enumerate(rowv, 1):
        cell = ws3.cell(row=4 + i, column=c, value=v)
        cell.font = BODY
        cell.border = THIN
        cell.alignment = WRAP
        cell.fill = MSF_FILL if "MSF" in rowv[1] else HYT_FILL

ws3["A11"] = "Why alternate?"
ws3["A11"].font = HEADER_FONT
notes = [
    "Same morning MSF+HYT ≈ 40–50 min each → both stay shallow.",
    "One layer / morning ≈ 100 min deep ratta → real coverage.",
    "Full MSF pass = Days A+C+E. Full HYT pass = Days B+D+F. Both done every 6 mornings.",
    "Start: Mon 6 Oct = Day A (MSF-1 only).",
]
for i, t in enumerate(notes):
    ws3.cell(row=12 + i, column=1, value=t).font = BODY
    ws3.merge_cells(start_row=12 + i, start_column=1, end_row=12 + i, end_column=4)
set_widths(ws3, [12, 14, 12, 48])

# ----- Evening -----
ws4 = wb.create_sheet("Evening Priority")
ws4["A1"] = "Evening subject priority (pick ONE per office day)"
ws4["A1"].font = TITLE_FONT
for c, h in enumerate(["Priority", "Subject", "Why first"], 1):
    ws4.cell(row=3, column=c, value=h)
style_header_row(ws4, 3, 3)
prio = [
    (1, "Geography", "Heaviest static scoring base"),
    (2, "Polity", "Articles, bodies, Parliament, PRIs"),
    (3, "Environment & Ecology", "SDGs, protected areas, climate"),
    (4, "Modern India", "Chronology + movements"),
    (5, "Medieval India", "Rising weight"),
    (6, "Ancient History", "Precise site / text traps"),
    (7, "Art & Culture", "Often rides inside History"),
    (8, "Economy", "Schemes + basics"),
    (9, "Science & Technology", "UKPCS Unit 5 + GS misc"),
    (10, "Census & Urbanisation", "Data traps"),
    (11, "UP Special", "State area share"),
]
for i, rowv in enumerate(prio):
    for c, v in enumerate(rowv, 1):
        ws4.cell(row=4 + i, column=c, value=v)
style_body(ws4, 4, 14, 3)
set_widths(ws4, [12, 28, 40])

# ----- Weekly -----
ws5 = wb.create_sheet("Weekly Scoreboard")
ws5["A1"] = "Weekly scoreboard — fill every Sunday night"
ws5["A1"].font = TITLE_FONT
for c, h in enumerate(
    [
        "Week ending",
        "MSF slices done",
        "HYT slices done",
        "Full 6-day loops",
        "Evening subjects",
        "Chapters ticked",
        "Honest note",
    ],
    1,
):
    ws5.cell(row=3, column=c, value=h)
style_header_row(ws5, 3, 7)
week_ends = [
    date(2026, 10, 12),
    date(2026, 10, 19),
    date(2026, 10, 26),
    date(2026, 11, 2),
    date(2026, 11, 9),
    date(2026, 11, 16),
    date(2026, 11, 23),
    date(2026, 11, 30),
    date(2026, 12, 5),
]
for i, we in enumerate(week_ends):
    ws5.cell(row=4 + i, column=1, value=we).number_format = "YYYY-MM-DD"
    for c in range(2, 8):
        ws5.cell(row=4 + i, column=c, value="")
style_body(ws5, 4, 12, 7)
set_widths(ws5, [14, 16, 16, 16, 20, 16, 36])

# ----- Rules -----
ws6 = wb.create_sheet("Rules")
ws6["A1"] = "Non-negotiables"
ws6["A1"].font = TITLE_FONT
for i, t in enumerate(
    [
        "1. One morning layer only — MSF or HYT, never both.",
        "2. Give that layer the full 08:20–10:00 block (~100 min).",
        "3. Morning ratta is sacred — a thin one-layer day still beats skipping.",
        "4. Do not mix morning ratta with evening subject reading in the same sitting.",
        "5. One evening subject on office days.",
        "6. After Day F, restart Day A.",
        "",
        "MSF = Must-Score Facts desk. HYT = High-Yield Tables desk.",
    ]
):
    ws6.cell(row=3 + i, column=1, value=t).font = BODY
ws6.column_dimensions["A"].width = 100

wb.save(OUT)
print(f"Saved: {OUT}")
print(f"Size: {OUT.stat().st_size} bytes")
print(f"Days: {last_row - 4} ({START} to {EXAM})")
