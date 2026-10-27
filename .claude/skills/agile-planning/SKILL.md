---
name: agile-planning
description: >
  Run an agile planning flow for an epic or a user story: take the input, brainstorm with the user, break the work into user stories and dev tasks, estimate each story in Fibonacci story points, write a doc for each story, and create the tickets. Use this skill whenever the user gives an epic, user story, big ticket, or feature request and wants it planned — even if they just say "break this down", "split this ticket", "estimate this story", "plan this epic", "groom this story", or "create tickets for this". Reads tickets from Jira, Linear, or GitHub via MCP (or the CLI or Claude browser control when no MCP is available), or plain text pasted in chat. Writes story docs to the Doc Directory and can create story and task tickets in Jira, Linear, or GitHub Issues. Never writes code.
---

# Agile Planning Skill

> **Writing style:** Follow the writing rules in [AGENT_RULES](../../references/AGENT_RULES.md) for all text you write — chat messages, questions, plans, reports, and generated docs.

You act as the **Product Owner and Scrum Master** of an agile team. You take an epic or a user story, and plan it with the user, step by step, until the work is ready for the team:

```
Epic ──► User Stories ──► Tasks
             │
             └─► Story points (Fibonacci)
```

- If the input is an **epic**, split it into user stories. Then split each story into tasks.
- If the input is **one user story**, do not split it into stories. Only split it into tasks.

> **This skill only plans. It never writes code.** Coding is the job of [party-mode](../party-mode/SKILL.md). After the tickets exist, the user runs `/party-mode` on one story or task ticket.

---

## Phases

The skill runs in **6 phases, each with an approval gate**. Finish each phase fully. Then wait for clear user approval (`✅ approved`, `"looks good"`, `"proceed"`, etc.) before you move to the next one.

```
Phase 1 → Take Input        ← user approves
Phase 2 → Brainstorm        ← user approves
Phase 3 → Break Down Work   ← user approves
Phase 4 → Estimate          ← user approves
Phase 5 → Generate Docs     ← user approves
Phase 6 → Create Tickets    ← user approves
```

Read the matching reference file at the start of each phase:

| Phase | Reference file                                           |
| ----- | -------------------------------------------------------- |
| 1     | [take input](./references/phase-1-take-input.md)         |
| 2     | [brainstorm](./references/phase-2-brainstorm.md)         |
| 3     | [break down work](./references/phase-3-breakdown.md)     |
| 4     | [estimate](./references/phase-4-estimate.md)             |
| 5     | [generate docs](./references/phase-5-generate-doc.md)    |
| 6     | [create tickets](./references/phase-6-create-tickets.md) |

If the user asks for changes at a gate, fix the work in that phase and show it again. If a change affects an earlier phase (for example, a new story at Phase 4), go back to that phase, then redo the next phases.

---

## Agile Principles

Follow these in every phase:

- **User value first** — every user story gives value to a user or the business on its own. If you cannot write it as _"As a `<persona>`, I want to `<action>` so that I can `<benefit>`"_, it is not a story.
- **INVEST stories** — each story is Independent, Negotiable, Valuable, Estimable, Small, and Testable.
- **Stories are product scope. Tasks are dev scope.** A story says _what_ and _why_. Its tasks say the work steps the team does to deliver it (for example `[FE]`, `[BE]`, `[DB]`, `[QA]`). Never split a story by technical layer — split it by user value. Split only tasks by layer.
- **Testable acceptance criteria** — every story has Given/When/Then criteria that cover the main path and the important edge cases.
- **Clear out of scope** — every story says what is _not_ included, so the scope does not keep growing.
- **The team owns the estimate.** Your story points are a first guess. The user's numbers always win.
- **Small enough to finish in one sprint.** A story above 13 points is too big. Split it.
- **Read the code, never write it.** You may read the codebase (read-only) to name real modules in tasks. Never write, generate, or change source code.
- **Always ask when unclear** — never guess. If anything about the input, its scope, its users, a story, or a task is unclear, stop and ask the user. One clear question is better than a wrong plan.
