# Step 4 — Approval Gate

Show the full test plan from [Step 3 — Test Plan](./step-3-test-plan.md) to the user **as a chat message**. Then **STOP and wait** for a clear approval (for example "approved", "looks good", "go ahead"). At this point the plan is only in the chat. It is **not** in any file yet.

> **DO NOT** open the browser to run tests before the user approves. This gate is required for every planning round.

## Approved

Save the plan to the **Doc Directory** from [PROJECT_OVERVIEW](../../../references/PROJECT_OVERVIEW.md) as a Markdown file. Copy it word for word from the chat message. **DO NOT** make things up.

- File name format: `<yyyy-mm-dd-hh-mm-ss>-web-test-<plan-name>.md`
- Example: `2026-12-01-16-30-01-web-test-login-page.md`

Then:

- If the user allowed the browser and a browser tool was found (Step 1) → go to **Step 5**.
- If not → stop here. Tell the user where the plan file is.

## Requests Changes

Go back to [Step 2 — Brainstorming](./step-2-brainstorming.md) with the user's change request. Clear up the details again and write a new plan. Wait for approval again.

## Cancels

Stop the workflow. Tell the user it has stopped.
