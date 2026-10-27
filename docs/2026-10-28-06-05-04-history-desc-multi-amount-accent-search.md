# Title: Plan — History newest-first, many amounts in Add form, accent-free name search

- Classification: feature
- Description: Three small UI changes in the store, the dashboard, the detail screen, and the Add form.

---

## Approach Summary / Goal

- **History:** Keep the store sorting oldest-first, so running balances stay correct. In `DebtorDetailScreen`, work out running balances oldest-first, then reverse the list for display.
- **Many amounts:** Change the single amount box in the Add form into a list of amount rows, with a "+ Add amount" button, an X on each extra row, and a live total. On save, send one transaction with the sum.
- **Search:** Add one small helper that makes text lowercase and removes Vietnamese accents (including `đ` → `d`). Use it in the dashboard search and the Add form name suggestions.
- Goal: less manual work when you add money and search for names.

## Functional Requirements

- FR1: The history list shows the newest transaction at the top.
- FR2: Each row's running balance is still the balance right after that transaction (same value as today).
- FR3: The Add form starts with one amount box. "+ Add amount" adds a new empty box. Each extra box has an X to remove it. The first box cannot be removed.
- FR4: The form shows "Total: X ₫" under the boxes, in `vi-VN` VND format, and updates as you type.
- FR5: Empty boxes are skipped. Any box that is not a number, or is ≤ 0, shows the error. If the total is 0, the form shows the error and does not save.
- FR6: Save sends one `addDebt` / `addPayment` call with the total. The note is not changed.
- FR7: When the form opens again, it resets to one empty box.
- FR8: Dashboard search: "nguyen" matches "Nguyễn Văn A". "NGUYEN" matches too. "dung" matches "Dũng". "do" matches "Đỗ".
- FR9: Add form name suggestions follow the same matching rule as FR8.

## Non-Functional Requirements

- No new npm packages. Use `String.normalize('NFD')` plus a regex for accent marks, and a manual swap for `đ/Đ`.
- Keep the mobile-first layout. Amount boxes must fit a phone screen.
- Keep the Edit form unchanged.

## Files in Scope

- `src/components/DebtorDetailScreen.tsx` — change (newest-first display)
- `src/components/AddTransactionModal.tsx` — change (amount rows, total, name suggestions)
- `src/App.tsx` — change (search match)
- `src/utils/normalizeText.ts` — new (accent-free lowercase helper)

## Risks & Assumptions

- Assumption: a new `src/utils/` folder is fine for the helper. The project has no utils folder yet.
- Assumption: only the history display order changes. The store order stays oldest-first, because other code may rely on it.
- Risk: the Sheets path that calls `api.getHistory` (`src/store.ts:316`) does not sort. If the server returns rows in a random order, running balances can be wrong today too. The developer will sort that result oldest-first in the store as well, to keep the screen correct.
- The project uses `Skip-Testing`, so there are no tester tasks. I will check with `npm run lint` and `npm run build`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked — requires user input on: —

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | DONE   | In `src/components/DebtorDetailScreen.tsx`, work out running balances oldest-first, then reverse for display. In `src/store.ts` `loadHistory`, sort the `api.getHistory` result oldest-first like the other two paths. | developer | none | FR1, FR2. Store order stays oldest-first. Lint passes. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/CLEAN_CODE/KISS.md` |
| 2   | DONE   | Create `src/utils/normalizeText.ts` with `normalizeText(s)`: lowercase, trim, remove accent marks, `đ`→`d`. Use it in `src/App.tsx:131` and `src/components/AddTransactionModal.tsx:68`. | developer | none | FR8, FR9. No new packages. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/CLEAN_CODE/DRY.md` |
| 3   | DONE   | In `src/components/AddTransactionModal.tsx`, change `amount` state into a list of strings. Add amount rows, "+ Add amount" button, X buttons, live total, and new checks. Submit the total. | developer | task 2 (same file) | FR3–FR7. Mobile layout OK. Lint and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/CLEAN_CODE/KISS.md` |
