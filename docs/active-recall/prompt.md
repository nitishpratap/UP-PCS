# Active Recall — GPT dump prompt

Copy the block below into ChatGPT (or any model). Paste the reply into Cursor and say: **add this to Active Recall**.

## Prompt to copy

```
You are making UPPCS Prelims active-recall cards.

Topic: [paste topic / chapter name]
Source I already studied: [optional — NCERT / Lucent / my notes]

Write 15–40 cards. Mix:
- direct fact
- “With reference to… consider the following statements”
- Assertion–Reason
- Match List-I with List-II
- NOT correctly matched

Rules:
- One idea per card.
- Stem must be self-contained. No “as discussed above”.
- Options A–D for MCQs. For short-answer cards, skip options and write a recall prompt.
- After each question write:
  ANSWER: [letter or key]
  WHY: 2–4 short sentences, exam locks only (article / year / list / trap).
- Do not write a textbook chapter. Do not repeat the same lock on five cards.
- Prefer traps: similar names, wrong schedule, Centre vs State, USA vs India.
```

## What Cursor does with the dump

The agent stores cards in `docs/active-recall/<subject>/` as Markdown:

- Question + options stay **visible**.
- Answer sits in `<details><summary>Show answer</summary>…</details>` (same as subject Practice Zones).
- One topic = one file, named like `polity/01_Parliament_of_India.md`.
- Subjects match Subject Notes: Ancient History, Medieval India, Modern India, Art and Culture, Geography, Environment and Ecology, Polity.
