# Step 5 — Run Tests in the Browser

The Root Agent opens the browser and runs each test case from the approved plan. It drives the browser itself. Do not start sub-agents for this step.

> Run only the test cases in the approved plan. Do not add, remove, or change test cases during the run. If a test case is wrong, mark it `BLOCKED` and explain why in the report.

---

## 1. Start the browser

1. **Load the browser skill first, if the host has one.** For example, load `claude-in-chrome` (or `chrome-browser`) before Claude in Chrome tools, or `built-in-browser` before the built-in browser tools. Follow its rules.
2. **Load all the tools you need in one call** (if they are deferred). For example: tabs, navigate, click/type, read page, screenshot, console messages, and network requests.
3. **Check the open tabs.** Then open a **new tab**. Do not use the user's open tabs, unless the user asks you to.
4. **Go to the target URL.** If the page does not load, stop. Tell the user (for example: "Is the app running at `http://localhost:3000`?").
5. **If the test needs a login**, ask the user to log in in that tab. Wait until they say they are done. Never type a password or token yourself.

---

## 2. Run each test case

Run the test cases in the order of the plan. For each test case:

1. **Check the preconditions.** If one is not met, mark the case `BLOCKED` with the reason. Go to the next case.
2. **Do each step** exactly as written. Use the test data from the plan.
   - Before a step marked `⚠️`, ask the user to confirm. If the user says no, mark the case `SKIPPED`.
3. **Check the expected result.** Read the page (text, URL, elements). Do not guess from what you expect to see.
4. **Collect evidence:**
   - A screenshot, or the page text that shows the result.
   - Console errors (filter them, do not dump the whole log).
   - Failed network requests (status 4xx or 5xx), if any.
5. **Set the result:**

| Result    | When                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `PASS`    | The page shows the expected result.                                                |
| `FAIL`    | The page shows something else. Write what you saw, next to what you expected.      |
| `BLOCKED` | You could not finish the steps (page did not load, element not found, tool error). |
| `SKIPPED` | The user said not to run it.                                                       |

6. **Update the `Status` column** in the plan file for this test case.

To change the screen size for a case, use the browser tool's resize action. Set it back after the case.

---

## 3. Browser safety rules

- **No dialogs.** Do not click things that open browser `alert`, `confirm`, or `prompt` dialogs. They block the browser tool. If one shows, ask the user to close it.
- **Click only what the steps say.** Do not click links or buttons outside the test steps.
- **Never type secrets.** If a page asks for a password, token, or payment details that are not test data in the plan, stop and ask the user.
- **Stop when stuck.** If the same action fails 2–3 times, stop that case. Mark it `BLOCKED`. Go to the next case.
- **Stop the run** if the app crashes, or more than 3 cases in a row are `BLOCKED`. Tell the user what went wrong. Ask if you should go on.
- **Never fix code.** If a test fails, only report it.

---

## 4. Finish

When all cases are done, close the tab you opened. Do not close the user's own tabs. Then go to **Step 6**.
