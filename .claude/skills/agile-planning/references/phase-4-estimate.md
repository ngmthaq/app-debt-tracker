# Phase 4 — Estimate

Give each user story a size in **story points**. Use only Fibonacci numbers:

```
1 · 2 · 3 · 5 · 8 · 13
```

Story points measure the size of a story compared to other stories. They are not hours or days. Tasks do not get story points.

## 4a. Find a reference story

Ask the user: _"Does your team have a reference story for a known size (for example, a 3-point story)?"_

- **Yes** → compare every story to it.
- **No** → use this scale:

| Points | Meaning                                                                     |
| ------ | --------------------------------------------------------------------------- |
| 1      | Very small, clear change. One task or two. No unknowns.                     |
| 2      | Small change. A few tasks in one area. No unknowns.                         |
| 3      | Normal story. Tasks in two or three areas (e.g. FE + BE). Few unknowns.     |
| 5      | Bigger story. Many tasks or a new pattern. Some unknowns.                   |
| 8      | Large story. Many areas, new data, or a third-party service. Real unknowns. |
| 13     | Very large story. Many unknowns. Try hard to split it.                      |

## 4b. Estimate each story

For each story, look at three things:

- **Effort** — how many tasks, and how much work in each one.
- **Complexity** — how hard the logic, data, or integrations are.
- **Uncertainty** — how much is still unknown (new code area, new library, unclear rules).

Then pick the Fibonacci number that fits best. If you are between two numbers, pick the bigger one.

**Rules:**

- A story **above 13 points is too big**. Do not give it a number. Go back to [Phase 3](./phase-3-breakdown.md) and split it.
- A story with **too many unknowns to size** gets `?`. Add a **spike** (a short time-boxed research task) to its task list. Tell the user.
- Never give points to tasks. Points are for stories only.

## Output format

```markdown
## 📏 Estimates

| #   | User Story           | Points | Effort | Complexity | Uncertainty | Reason                                   |
| --- | -------------------- | ------ | ------ | ---------- | ----------- | ---------------------------------------- |
| S1  | Create an assessment | 5      | medium | medium     | low         | New table, API, and form. Known patterns |
| S2  | See team results     | 3      | medium | low        | low         | Read-only view on data from S1           |
| …   | …                    | …      | …      | …          | …           | …                                        |

**Total:** <sum> points · **Stories:** <n> · **Unsized (`?`):** <n>
```

Then ask: _"These are my first estimates. The team owns the final numbers. Do you want to change any of them?"_

If the user gives a different number, use the user's number. Do not argue. You may say once why you picked yours.
