# Step 2 — Brainstorming

Before you write any test case, make the test goal clear with the user. Brainstorming is a two-way talk. Look at the related code, and list every open question. All this happens **before** the test plan is written.

> Do not open the browser in this step. Read-only work only. Do not edit files.

---

## Classify the Intent

| Class     | Use it when the user wants to                       |
| --------- | --------------------------------------------------- |
| `feature` | Check that a feature works as expected.             |
| `bug`     | Reproduce a bug, or check that a bug fix now works. |

If you are not sure, ask the user. Never guess.

---

## Check the Test Scope

The scope is **too big** when it covers many pages or needs more than 20 test cases. If it is too big, ask the user to split it by page or by user flow. Test one part per run.

---

## Brainstorming Dialogue

1. **Repeat the request** in your own words. This shows any misunderstanding right away.
2. **Classify the intent** (`feature` or `bug`) with the table above.
3. **Check the test scope** with the rule above.
4. **Look at the codebase (read-only).** Find the routes, pages, forms, and rules for the area under test (for example field checks, error messages, and redirects). Use real paths. Do not make up files. If the search is big, you can start read-only sub-agents to search in parallel. They must never edit files.
5. **Load related documents.** Look in the **Doc Directory** from [PROJECT_OVERVIEW](../../../references/PROJECT_OVERVIEW.md) for old plans, test plans, story docs, or overview files about this area.
6. **Collect these details:**
   - Pages and user flows to test.
   - What is out of scope.
   - Test data to use (test accounts, sample inputs). Never put real passwords in the plan.
   - Screen sizes to test (desktop only, or also mobile).
   - Actions that change data (create, delete, send, pay). Ask if they are safe to run on this environment.
   - For a `bug`: what happens now, what should happen, and the steps to reproduce it.
7. **Show every open question to the user.** Write each one as a direct, specific question. **STOP and wait** until the user answers every question.
8. **Repeat.** If the answers bring new questions, ask again. Brainstorming ends only when nothing is left unclear.

Then go to **Step 3**.

---

## Usage Notes

- **ALWAYS ask the user when anything is unclear.** Never guess. Never go on with placeholders.
- You come back to this step when the user asks for plan changes at the approval gate (Step 4).
