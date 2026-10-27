# Step 6 — Test Report

Send a report to the user **as a chat message**. Use the template below. Take every fact from the test run in Step 5. Do not make anything up.

Then save the same report to the **Doc Directory**, next to the plan file:

- File name format: `<yyyy-mm-dd-hh-mm-ss>-web-test-<plan-name>-report.md`
- Use the same `<plan-name>` as the plan file.

---

## Test Report Template

```md
# Title: Web Test Report — {short title, same as the plan title}

- Classification: feature | bug
- Description: {one sentence about the result}
- Target URL: {url}
- Environment: local | dev | staging | production
- Browser Tool: {tool used}
- Plan File: {path to the plan file}

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| {n}   | {n}  | {n}  | {n}     | {n}     |

## Test Results

| ID    | Title   | Result                          | Notes                   |
| ----- | ------- | ------------------------------- | ----------------------- |
| TC-01 | {title} | PASS - FAIL - BLOCKED - SKIPPED | {short note, or reason} |
| …     | …       | …                               | …                       |

## Failures

{One block per FAIL case. Leave empty if none.}

### TC-{id} — {title}

- Steps: {the steps you ran}
- Expected: {expected result from the plan}
- Actual: {what the page showed}
- Evidence: {screenshot, page text, console errors, failed requests}

## Blocked / Skipped

- TC-{id}: {reason}
- Leave empty if none.

## Console and Network Problems

- {Console errors or failed requests seen during the run, even in PASS cases. Or "none".}

## Next Steps

- {If there are FAIL cases: "To fix the FAIL cases, run `/party-mode` and give it this report file: {path to the report file}." Or "none".}
```

---

## Usage Notes

- Every row must come from Step 5. If you did not check something, do not say it passed.
- Remove secrets and personal data from evidence. Replace them with `[REDACTED]`.
- **This skill only tests. It never fixes.** Coding is the job of [party-mode](../../party-mode/SKILL.md).
- If there are `FAIL` cases, ask the user to run `/party-mode` to fix them. Give the path to the report file, so party-mode can use the failures as `bug` requests.
- Do not start party-mode yourself. Do not start developer or tester sub-agents. Do not edit any code. Then **end the session**.
