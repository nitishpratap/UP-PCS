# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parent
src = (ROOT / "_ghat_planning_inject.py").read_text(encoding="utf-8")

human = src
human = human.replace("_planning_paste_raw.txt", "_human_dev_paste_raw.txt")
human = human.replace("01_Indian_Economy_Basics_Planning.md", "08_Employment_Poverty_Human_Capital.md")
human = human.replace("Planning paste", "Human Development paste")
human = human.replace("Ghatnachakra Planning", "Ghatnachakra Human Development")
human = human.replace(
    "## Ghatnachakra Extra Drill — Indian Economy Basics and Planning",
    "## Ghatnachakra Extra Drill — Employment, Poverty and Human Capital",
)
human = human.replace("## UKPCS Prelims Bank", "## UKPCS")
# simplify note block: replace any old_note assignment block with human one via marker
human = human.replace(
    "Extra Drill filled from Ghatnachakra *Economic & Social Development* "
    "— Nature of Indian Economy + National Income & GDP (Purvalokan).",
    "> Extra Drill filled from Ghatnachakra *Sustainable Economic Development* Purvalokan.",
)
human = human.replace(
    "Extra Drill: Ghatnachakra **Planning** (all exams) + earlier Nature / National Income "
    "Purvalokan. Money & Banking stems are parked for Topic 3.",
    "> Extra Drill: Ghatnachakra **Human Development / Social Development** (all exams) "
    "+ Sustainable Development Purvalokan.",
)
(ROOT / "_ghat_human_inject.py").write_text(human, encoding="utf-8")

money = src
money = money.replace("_planning_paste_raw.txt", "_money_banking_paste_raw.txt")
money = money.replace("01_Indian_Economy_Basics_Planning.md", "03_Money_Banking_RBI_Financial_System.md")
money = money.replace("Planning paste", "Money and Banking paste")
money = money.replace("Ghatnachakra Planning", "Ghatnachakra Money and Banking")
money = money.replace(
    "## Ghatnachakra Extra Drill — Indian Economy Basics and Planning",
    "## Ghatnachakra Extra Drill — Money, Banking, RBI and Financial System",
)
money = money.replace(
    "Extra Drill filled from Ghatnachakra *Economic & Social Development* "
    "— Nature of Indian Economy + National Income & GDP (Purvalokan).",
    "Extra Drill rebuilt from coaching / mock stems (not a full Purvalokan dump). "
    "Expand when Ghatnachakra Economy MCQs are pasted.",
)
money = money.replace(
    "Extra Drill: Ghatnachakra **Planning** (all exams) + earlier Nature / National Income "
    "Purvalokan. Money & Banking stems are parked for Topic 3.",
    "Extra Drill: full Ghatnachakra **Money and Banking** coverage (all exams) "
    "behind the UPPCS Complete Bank.",
)
(ROOT / "_ghat_money_inject.py").write_text(money, encoding="utf-8")
print("wrote human + money inject scripts")
