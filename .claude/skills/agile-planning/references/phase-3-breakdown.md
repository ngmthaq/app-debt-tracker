# Phase 3 — Break Down Work

Split the work in two levels:

1. **Epic → User Stories** (only when the input is an `epic`). Split by user value.
2. **User Story → Tasks**. Split by the work steps the team does.

If the input is one `user story`, skip level 1. Use the input as the only story.

---

## 3a. Epic → User Stories

### What counts as a user story

- You can write it as: _"As a `<persona>`, I want to `<action>` so that I can `<benefit>`."_
- It gives value to a user or the business on its own.
- It follows **INVEST**: Independent, Negotiable, Valuable, Estimable, Small, Testable.
- An **enabler** story (e.g. "Audit log retention policy") is OK when it makes user value possible later. Say which stories it helps.

### What is NOT a user story

- A technical layer: `[DB] Add table`, `[API] Add endpoint`, `[FE] Build form`. These are **tasks**. Put them under their story.
- A story that only makes sense as part of another one. Merge them.

### How to split a big story

Split by one of these. Never by technical layer:

- **Workflow steps** — "create", "edit", "share" as separate stories.
- **Business rules** — the simple rule first, the special cases later.
- **Data types or personas** — one type or persona per story.
- **Happy path first** — the main path in one story, error and edge cases in the next.

---

## 3b. User Story → Tasks

Each task is one work step that one person can finish in **one day or less**.

- Start the title with a tag: `[FE]`, `[BE]`, `[DB]`, `[QA]`, `[DevOps]`, `[Design]`, or `[Docs]`.
- Name a clear output: a page, a module, an API, a migration, a test suite. Use real paths and module names from Phase 2 when the code exists.
- Add a short **Done when** line that someone can check.
- Every story has at least one `[QA]` task that checks its acceptance criteria.
- Do not write code, code snippets, or exact function bodies. Describe the work.
- Do not add tasks the story does not need.

---

## Output format

Show both levels in Markdown:

```markdown
## 🔨 Work Breakdown

### Stories

| #   | User Story                                                                                | Type  | Personas     | Depends On |
| --- | ----------------------------------------------------------------------------------------- | ----- | ------------ | ---------- |
| S1  | As a team manager, I want to create an assessment so that I can start reviews without ops | story | Team Manager | —          |
| S2  | As a team manager, I want to see my team's results so that I can follow up on low scores  | story | Team Manager | S1         |
| …   | …                                                                                         | …     | …            | …          |

### S1 — <short story name>

**Acceptance Criteria**

- [ ] Given <context>, when <action>, then <visible result>
- [ ] …

**Tasks**

| #    | Task                                               | Done when                                  | Depends On |
| ---- | -------------------------------------------------- | ------------------------------------------ | ---------- |
| S1.1 | [DB] Add assessment table and migration            | Migration runs up and down on a clean DB   | —          |
| S1.2 | [BE] Add create-assessment API in `src/assessment` | API saves an assessment and returns its ID | S1.1       |
| S1.3 | [FE] Build the "New assessment" form               | The form sends valid data and shows errors | S1.2       |
| S1.4 | [QA] Test S1 acceptance criteria                   | Every criterion above has a passing test   | S1.3       |

### S2 — <short story name>

…
```

After the stories, add:

```markdown
### Deferred to Later

<stories that came up but are clearly not part of this work>
```

## Dependencies

- **Story dependency:** story B has no value until story A exists. Write it as `S<number>`.
- **Task dependency:** task B cannot start until task A is done. Write it as `S<n>.<m>`.
- If there is none, write `—`.

Then ask: _"Is this breakdown correct? You can ask me to split, merge, reorder, defer, or change any story or task before I estimate."_
