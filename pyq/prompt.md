You are creating a UPPCS knowledge base.

Extract ONLY the English questions.
Ignore all Hindi text.
Ignore instructions, addresses, headers, footers and advertisements.

Output in markdown format:

# Question Number

Subject:
Topic:

Question:
...

Options:
A.
B.
C.
D.

---

**Do not include `Subtopic`, `Year`, or `Exam` fields** unless the user explicitly asks for them.

Then save the output under the correct folder:

| Exam | Year | Save path | Status |
|------|------|-----------|--------|
| UPPCS Prelims | 2018 | `pyq/2018/UP_PCS_PRE_2018_GS_PAPER_1.md` | ✅ Available |
| UPPCS Prelims | 2019 | `pyq/2019/UP_PCS_PRE_2019_GS_PAPER_1.md` | ✅ Available |
| UPPCS Prelims | 2020 | `pyq/2020/UP_PCS_PRE_2020_GS_PAPER_1.md` | ✅ Available |
| UPPCS Prelims | 2021 | `pyq/2021/UP_PCS_PRE_2021_GS_PAPER_1.md` | ✅ Available |
| UPPCS Prelims | 2022 | `pyq/2022/UP_PCS_PRE_2022_GS_PAPER_1.md` | ✅ Available |
| UPPCS Prelims | 2023 | `pyq/2023/UP_PCS_PRE_2023_GS_PAPER_1.md` | ✅ Available |
| UPPCS Prelims | 2024 | `pyq/2024/UPPCS_2024_Prelims_GS1_Question_Paper.md` | ✅ Available |
| UPPCS Prelims | 2025 | `pyq/2025/UP_PCS_Pre_2025_GS_Paper_1.md` | ✅ Available |
| RO-ARO Prelims | YYYY | `pyq/ro-aro/RO_ARO_YYYY_Prelims_GS1_Question_Paper.md` | As added |

**Coverage:** UPPCS Prelims GS Paper-I is complete for **2018–2025** (150 questions per year).

**Minimum coverage for topic notes:** UPPCS Prelims **2018–2025** + **RO-ARO** (see `subjects/prompt.md` §UPPCS PYQ Search & Addition Protocol).

### Extraction tips

- Prefer copy-pasted English text over PDF extraction for bilingual UPPSC papers.
- Use `---` between questions.
- Format match lists with `**List-I**` and `**List-II`**; Assertion–Reason with `**Assertion (A):**` and `**Reason (R):**`.
- Each file should contain exactly **150** questions (`# Question 1` … `# Question 150`).
