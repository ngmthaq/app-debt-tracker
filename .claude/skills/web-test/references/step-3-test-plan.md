# Step 3 — Test Plan

When brainstorming has answered every open question, write the test plan. Show it to the user **as a chat message**, with the template below.

> Planning is read-only. Do not edit files. **DO NOT** save the plan to a file in this step. The plan is saved only in [Step 4 — Approval Gate](./step-4-approval-gate.md), after the user approves.

---

## Planning Rules

1. **Plan only when the test goal is clear.** Do not start while any question from [Step 2 — Brainstorming](./step-2-brainstorming.md) is still open.
2. **Link the plan to real pages and code.** Use real URLs, routes, and file paths. Do not make them up.
3. **Each test case checks one thing.**
4. **Steps are exact user actions.** Write "Click the **Sign in** button", not "Log in".
5. **Each test case has an expected result you can see** on the page: text, URL, element, or message.
6. **Cover the happy path, edge cases, and failure cases.**
7. **Mark actions that cannot be undone** (delete, send, pay, publish) with `⚠️` in the `Steps` column.
8. **List risks and assumptions.** Anything you guessed from context, that the user did not say, goes here.
9. **For a `bug`:** add one test case that reproduces the bug with the exact steps from the user. Its expected result is the correct behaviour.

---

## Test Plan Template

Fill in every section.

```md
# Title: Web Test Plan — {short title matching the original request}

- Classification: feature | bug
- Description: {one sentence about what this test run checks}
- Target URL: {url}
- Environment: local | dev | staging | production
- Browser Tool: Claude in Chrome | built-in Claude browser | Playwright MCP
- Screen Sizes: {e.g. desktop 1440x900, mobile 390x844}

---

## Goal

- {2–4 short sentences: what this test run must prove.}
- {For a bug: the bug to reproduce, or the fix to confirm.}

## Scope

- In scope: {pages and flows}
- Out of scope: {what is not tested}

## Preconditions

- {e.g. the app runs at the target URL, the user is logged in as a test account, test data exists}

## Risks & Assumptions

- {Assumptions you made while planning}
- {Actions that change data, and why they are safe here}

## Open Questions / Blockers

- {Questions the user must answer before the run}
- Leave empty if none.

## Status

- [ ] Ready to run
- [ ] Blocked — needs user input on: {each blocker}

## Test Cases

| ID    | Status | Title            | Priority            | Preconditions | Steps                   | Test Data   | Expected Result       |
| ----- | ------ | ---------------- | ------------------- | ------------- | ----------------------- | ----------- | --------------------- |
| TC-01 | TODO   | {what it checks} | high - medium - low | {or "none"}   | 1. {action} 2. {action} | {or "none"} | {what the page shows} |
| …     | …      | …                | …                   | …             | …                       | …           | …                     |
```

Status values in `Test Cases`:

- `TODO` — not run yet
- `PASS` — the page shows the expected result
- `FAIL` — the page shows something else
- `BLOCKED` — could not run (say why)
- `SKIPPED` — left out on purpose (say why)

---

## Usage Notes

- If anything is unclear, set Status to `Blocked` and list every open question. Go back to [Step 2 — Brainstorming](./step-2-brainstorming.md). Do not plan around missing information.
- In Step 5, you run the test cases exactly as written. So keep steps and expected results exact enough to check.

Then go to **Step 4**.
