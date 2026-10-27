# Title: Plan — Clear history per person and for everyone, keep existing debt

- Classification: feature
- Description: Replace each person's rows with one row that carries their current balance, for one person or for all people at once.

---

## Approach Summary / Goal

- For each person, the app works out the balance from their rows. Then it deletes all their rows and adds **one** new row dated now:
  - balance > 0 → one `BORROW` row of the balance
  - balance < 0 (overpaid) → one `PAYMENT` row of the extra amount
  - balance = 0 → one `BORROW` row of amount 0, so the name stays in the list
- In Sheets mode, a new Apps Script action `clearHistory` does this in one request. It takes an optional `name`: with a name it clears that person, without a name it clears everyone. There is no fallback for old scripts.
- Goal: shorter history, while every person's balance and status stay exactly the same.

## Functional Requirements

- **Dashboard:** the `btn-clear-all` trash button now clears history for everyone and keeps debt. The old "delete every record" behavior is removed (store action, `api.clearAll`, and the `clearAll` script action).
- **Detail screen:** a new "Clear history" button with a confirm dialog clears only that person's history.
- After a clear, each person has exactly one row. The row note is `Balance carried over` (balance ≠ 0) or `History cleared` (balance 0).
- Balance and status for every person are the same before and after.
- The confirm dialogs say that history is removed, debt is kept, and this cannot be undone.
- Names are matched the same way as today: trimmed, case does not matter. The new row keeps the name casing of the person's first row.
- It works in both modes (local and Sheets). After the clear, the store reloads the data and the open history, and shows a success or error toast.
- The Add and Edit forms still need amount > 0. Only the clear action may write a 0-amount row.

## Non-Functional Requirements

- Sheets mode uses one POST request per clear (POST never retries).
- Apps Script rewrites the sheet in one batch write (`clearContents` on the data rows + one `setValues`), not row by row, so it stays fast.
- Follow `CODING_CONVENTIONS.md`: business logic stays in `useDebtStore.ts`, network calls stay in `api.ts`.

## Files in Scope

- `src/configs/appsScriptSource.ts`: add `clearHistory` action, remove `clearAll`
- `src/configs/api.ts`: add `api.clearHistory(scriptUrl, name?)`, remove `api.clearAll`
- `src/hooks/useDebtStore.ts`: add `clearHistory(name?)`, remove `clearAllRecords` and its row-by-row fallback
- `src/App.tsx`: dashboard button and confirm dialog text call the new action
- `src/components/DebtorDetailScreen.tsx`: new button and confirm dialog

## Risks & Assumptions

- **You must re-paste the Apps Script and deploy a new version.** Until then, the clear buttons in Sheets mode show an error toast (no fallback, as you chose).
- After a clear, the old row IDs are gone. This is expected.
- A row with amount 0 cannot be saved again from the Edit form (it needs > 0). The user can still delete it. I think this is fine.
- I assume the button text "Clear history" and the notes `Balance carried over` / `History cleared`. You can change these words.
- No tests (`Skip-Testing`). I check the work with `npm run lint`, `npm run build`, and by reading the code.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | In `src/configs/appsScriptSource.ts`, add the `clearHistory` POST action (optional `name`) and remove `clearAll` | developer | none | Groups rows by trimmed, lowercase name. Writes one row per affected person with the right type, amount and note. Leaves other people's rows untouched. Uses one batch write. Returns `{ success, cleared }` | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | DONE   | In `src/configs/api.ts`, add `clearHistory(scriptUrl, name?)` with JSDoc and remove `clearAll` | developer | task 1 | Sends `{ action: 'clearHistory', name? }` with `postJson`. Errors go through `toApiError` | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | DONE   | In `src/hooks/useDebtStore.ts`, add `clearHistory(name?)` for both modes. Remove `clearAllRecords` | developer | task 2 | Local mode builds the same rows as task 1 and saves them. Sheets mode calls `api.clearHistory`. Reloads data and history. Shows toasts. Balances do not change | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 4   | DONE   | In `src/App.tsx`, connect `btn-clear-all` and its confirm dialog to `clearHistory()`. Update the title, aria-label and dialog text | developer | task 3 | No reference to `clearAllRecords` is left. Dialog says debt is kept | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 5   | DONE   | In `src/components/DebtorDetailScreen.tsx`, add a "Clear history" button and confirm dialog that call `clearHistory(name)`. Copy the style of the existing "fully paid" dialog | developer | task 3 | Button is disabled while loading. Dialog names the person. `npm run lint` and `npm run build` pass | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
