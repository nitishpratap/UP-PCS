import sys
import os

sys.path.append('pyq/ro-aro')
from part1_q1_to_q50 import Q1_TO_Q50
from part2_q51_to_q100 import Q51_TO_Q100
from part3_q101_to_q140 import Q101_TO_Q140
from part4_q141_to_q200 import Q141_TO_Q200

gs_questions = Q1_TO_Q50 + Q51_TO_Q100 + Q101_TO_Q140
hindi_questions = Q141_TO_Q200
all_questions = gs_questions + hindi_questions

# 1. Generate GS1 Paper (Q1 to Q140)
gs_md = []
gs_md.append('# UPPSC RO/ARO Prelims 2023: General Studies (Paper-1)\n')
gs_md.append('**Exam:** UPPSC Samiksha Adhikari / Sahayak Samiksha Adhikari (RO/ARO) Prelims Examination 2023')
gs_md.append('**Paper:** Paper-1: General Studies (सामान्य अध्ययन)')
gs_md.append('**Booklet Code:** UNHSIV-01 | **Questions:** 1 to 140 | **Maximum Marks:** 140 | **Duration:** 2 Hours\n\n---\n')

for q in gs_questions:
    num = q['num']
    subj = q['subject']
    top = q['topic']
    subt = q['subtopic']
    ques = q['question']
    optA = q['options']['A']
    optB = q['options']['B']
    optC = q['options']['C']
    optD = q['options']['D']

    block = (
        f"# Question {num}\n\n"
        f"Subject: {subj}\n"
        f"Topic: {top}\n"
        f"Subtopic: {subt}\n\n"
        f"Question:\n"
        f"{ques}\n\n"
        f"Options:\n"
        f"A. {optA}\n"
        f"B. {optB}\n"
        f"C. {optC}\n"
        f"D. {optD}\n\n"
        f"Year: 2023\n"
        f"Exam: RO-ARO Prelims\n\n"
        f"---\n"
    )
    gs_md.append(block)

with open('pyq/ro-aro/RO_ARO_2023_Prelims_GS1_Question_Paper.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(gs_md))
print('Generated pyq/ro-aro/RO_ARO_2023_Prelims_GS1_Question_Paper.md')

# 2. Generate Hindi Paper (Q141 to Q200)
hindi_md = []
hindi_md.append('# UPPSC RO/ARO Prelims 2023: General Hindi (Paper-2)\n')
hindi_md.append('**Exam:** UPPSC Samiksha Adhikari / Sahayak Samiksha Adhikari (RO/ARO) Prelims Examination 2023')
hindi_md.append('**Paper:** Paper-2: General Hindi (सामान्य हिन्दी - सामान्य शब्द ज्ञान एवं व्याकरण)')
hindi_md.append('**Booklet Code:** UNHSIV-01 | **Questions:** 141 to 200 | **Maximum Marks:** 60 | **Duration:** 1 Hour\n\n---\n')

for q in hindi_questions:
    num = q['num']
    subj = q['subject']
    top = q['topic']
    subt = q['subtopic']
    ques = q['question']
    optA = q['options']['A']
    optB = q['options']['B']
    optC = q['options']['C']
    optD = q['options']['D']

    block = (
        f"# Question {num}\n\n"
        f"Subject: {subj}\n"
        f"Topic: {top}\n"
        f"Subtopic: {subt}\n\n"
        f"Question:\n"
        f"{ques}\n\n"
        f"Options:\n"
        f"A. {optA}\n"
        f"B. {optB}\n"
        f"C. {optC}\n"
        f"D. {optD}\n\n"
        f"Year: 2023\n"
        f"Exam: RO-ARO Prelims\n\n"
        f"---\n"
    )
    hindi_md.append(block)

with open('pyq/ro-aro/RO_ARO_2023_Prelims_Hindi_Question_Paper.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(hindi_md))
print('Generated pyq/ro-aro/RO_ARO_2023_Prelims_Hindi_Question_Paper.md')

# 3. Generate Complete Paper (Q1 to Q200)
complete_md = []
complete_md.append('# UPPSC RO/ARO Prelims 2023: Complete Question Booklet\n')
complete_md.append('**Exam:** UPPSC Samiksha Adhikari / Sahayak Samiksha Adhikari (RO/ARO) Prelims Examination 2023')
complete_md.append('**Booklet Code:** UNHSIV-01 | **Total Questions:** 200 | **Total Marks:** 200 | **Total Duration:** 3 Hours\n')
complete_md.append('- **Part I (भाग-1):** General Studies (सामान्य अध्ययन) — Questions 1 to 140 (140 Marks)')
complete_md.append('- **Part II (भाग-2):** General Hindi (सामान्य शब्द ज्ञान एवं व्याकरण) — Questions 141 to 200 (60 Marks)\n\n---\n')

for q in all_questions:
    num = q['num']
    subj = q['subject']
    top = q['topic']
    subt = q['subtopic']
    ques = q['question']
    optA = q['options']['A']
    optB = q['options']['B']
    optC = q['options']['C']
    optD = q['options']['D']

    block = (
        f"# Question {num}\n\n"
        f"Subject: {subj}\n"
        f"Topic: {top}\n"
        f"Subtopic: {subt}\n\n"
        f"Question:\n"
        f"{ques}\n\n"
        f"Options:\n"
        f"A. {optA}\n"
        f"B. {optB}\n"
        f"C. {optC}\n"
        f"D. {optD}\n\n"
        f"Year: 2023\n"
        f"Exam: RO-ARO Prelims\n\n"
        f"---\n"
    )
    complete_md.append(block)

with open('pyq/ro-aro/RO_ARO_2023_Prelims_Complete_Question_Paper.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(complete_md))
print('Generated pyq/ro-aro/RO_ARO_2023_Prelims_Complete_Question_Paper.md')

# 4. Generate Answer Key with Explanations (Q1 to Q200)
ans_md = []
ans_md.append('# UPPSC RO/ARO Prelims 2023: Answer Key & Detailed Explanations\n')
ans_md.append('**Exam:** UPPSC Samiksha Adhikari / Sahayak Samiksha Adhikari (RO/ARO) Prelims Examination 2023')
ans_md.append('**Booklet Code:** UNHSIV-01 | **Complete Solution for Questions 1 to 200**\n')
ans_md.append('> [!NOTE]\n> This document provides verified answers and comprehensive syllabus-aligned explanations for all 200 questions (140 General Studies + 60 General Hindi) of the UPPSC RO/ARO 2023 Prelims Examination.\n\n---\n')

ans_md.append('## Quick Answer Key Table\n')
ans_md.append('| Q.No | Ans | Q.No | Ans | Q.No | Ans | Q.No | Ans | Q.No | Ans |')
ans_md.append('|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|')
for i in range(0, 200, 5):
    row = []
    for j in range(5):
        qn = i + j + 1
        q_item = all_questions[qn - 1]
        row.append(f"{qn} | **{q_item['answer']}**")
    ans_md.append('| ' + ' | '.join(row) + ' |')
ans_md.append('\n---\n')

ans_md.append('## Detailed Question-Wise Explanations\n')
for q in all_questions:
    num = q['num']
    subj = q['subject']
    top = q['topic']
    subt = q['subtopic']
    ques = q['question']
    ans = q['answer']
    ans_text = q['options'][ans]
    expl = q['explanation']

    block = (
        f"### Question {num}\n"
        f"- **Subject:** {subj} | **Topic:** {top} | **Subtopic:** {subt}\n"
        f"- **Question:** {ques}\n"
        f"- **Correct Answer:** **({ans}) {ans_text}**\n\n"
        f"> **Explanation:**\n"
        f"> {expl}\n\n"
        f"---\n"
    )
    ans_md.append(block)

with open('pyq/ro-aro/RO_ARO_2023_Prelims_Answer_Key_With_Explanations.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ans_md))
print('Generated pyq/ro-aro/RO_ARO_2023_Prelims_Answer_Key_With_Explanations.md')
