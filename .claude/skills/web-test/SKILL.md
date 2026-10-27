---
name: web-test
description: "Test a web app in a real browser. First check that the user allows the agent to open a browser, and that a browser tool is available. Then brainstorm with the user, write a test plan with test cases, and wait for the user to approve them. Then open the browser, run each test case, and report Pass / Fail / Blocked with evidence. Never changes code. Uses Claude in Chrome, the built-in Claude browser, or a Playwright MCP. Use when: test the web, test this page in the browser, run a browser test, check the UI, smoke test the site, manual QA in the browser, E2E check, /web-test."
---

# Web Test

> **Writing style:** Follow the writing rules in [AGENT_RULES](../../references/AGENT_RULES.md) for all text you write — chat messages, questions, plans, reports, and generated docs.

This skill tests a web app in a real browser. It has three parts:

| Part | What it does                                                                 | Needs user "yes"? |
| ---- | ---------------------------------------------------------------------------- | ----------------- |
| 1    | Checks that the user allows a browser, and that a browser tool is available. | Yes               |
| 2–4  | Brainstorms, writes a test plan and test cases, and waits for approval.      | Yes               |
| 5–6  | Opens the browser, runs each approved test case, and reports the results.    | No                |

> **This skill only tests. It never changes code.** It plans, runs tests in the browser, and reports. Coding is the job of [party-mode](../party-mode/SKILL.md). If a test fails, ask the user to run `/party-mode` with the report file to fix it. Do not start party-mode yourself.

---

## Step-by-Step Instructions

Load the step files in order. Do not skip them or only skim them.

1. [Step 1 — Check Browser Permission](./references/step-1-check-browser-permission.md)
2. [Step 2 — Brainstorming](./references/step-2-brainstorming.md)
3. [Step 3 — Test Plan](./references/step-3-test-plan.md)
4. [Step 4 — Approval Gate](./references/step-4-approval-gate.md)
5. [Step 5 — Run Tests in the Browser](./references/step-5-run-browser-tests.md)
6. [Step 6 — Test Report](./references/step-6-test-report.md)

---

## Constraints

- **No browser without a clear "yes".** Do not open a browser until Step 1 confirms the user allows it.
- **No test run without an approved plan.** The approval gate (Step 4) is required. Do not open the browser to run tests before the user approves the test cases.
- **The Root Agent drives the browser itself.** There is only one browser session. Do not start sub-agents to drive it. Read-only sub-agents may help in Step 2 to search the code.
- **Never change code.** Do not edit production code or test files. Do not start party-mode, or its developer or tester sub-agents. Fixes are done only when the user runs `/party-mode`.
- **Never type secrets.** If a page asks for a password, token, or payment details, stop and ask the user to type it. Never read or show secrets.
- **Only safe actions.** Do the actions in the approved test steps only. Before an action you cannot undo (delete data, send real emails, pay, publish), ask the user — even if the plan has it.
- **Do not hide failures.** Every test case ends as `Pass`, `Fail`, or `Blocked`. Report each one with evidence.
- **Stop when stuck.** If a browser tool fails 2–3 times on the same action, stop that test case. Mark it `Blocked`, and tell the user what went wrong.
