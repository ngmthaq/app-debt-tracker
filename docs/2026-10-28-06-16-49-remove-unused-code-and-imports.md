# Title: Plan — Remove unused code and imports

- Classification: feature (cleanup)
- Description: Remove unused imports, unused API methods, unused dev packages, and AI Studio template leftovers. App behavior does not change.

---

## Approach Summary / Goal

- I found the unused code with `tsc --noUnusedLocals --noUnusedParameters`, then searched each export and store member by hand.
- All store state and actions are used. All components and utils are used.
- Goal: `npm run lint` and the stricter unused check both pass with zero errors. `npm run build` still works.

## Functional Requirements

- Remove 14 unused imports:
  - `src/App.tsx`: `Users`, `AlertCircle`, `Database`, `HelpCircle`, `UserCheck`, `ArrowUpRight`, `ArrowDownLeft`, `FileSpreadsheet`, `Terminal`
  - `src/components/AddTransactionModal.tsx`: `Landmark`
  - `src/components/DebtorDetailScreen.tsx`: `ChevronRight`
  - `src/components/EditTransactionModal.tsx`: `RotateCcw`
  - `src/components/SetupGuideModal.tsx`: `AnimatePresence`
  - `src/components/StatusToast.tsx`: `AnimatePresence`
- Remove `api.getDebts()` and `api.getNames()` from `src/configs/api.ts`. Remove the `Debtor` import there, since it becomes unused.
- Remove dev packages `autoprefixer`, `esbuild`, `tsx` with `npm uninstall`.
- Delete `metadata.json`.
- Change the `clean` script to `rm -rf dist`.
- In `vite.config.ts`: remove the `server` block (DISABLE_HMR), the `resolve.alias` block, and the `path` import.
- In `tsconfig.json`: remove the `paths` entry for `@/*`, so it matches the removed Vite alias.

## Non-Functional Requirements

- Do not change any UI or behavior.
- Do not touch the backend string in `src/configs/appsScriptSource.ts`.
- Keep your uncommitted `@types/react-dom` change in `package.json`.

## Files in Scope

- `src/App.tsx`, `src/components/AddTransactionModal.tsx`, `src/components/DebtorDetailScreen.tsx`, `src/components/EditTransactionModal.tsx`, `src/components/SetupGuideModal.tsx`, `src/components/StatusToast.tsx`
- `src/configs/api.ts`
- `package.json`, `package-lock.json`
- `vite.config.ts`, `tsconfig.json`
- `metadata.json` (delete)

## Risks & Assumptions

- With the `server` block gone, Vite uses its default HMR (hot reload) and file watching. This is the normal setup outside AI Studio.
- Removing the `tsconfig.json` `paths` entry is my addition. Nothing uses `@/`, so it is safe.
- The project has no tests (`Skip-Testing`), so there is no tester task. I check the work with `lint`, the strict unused check, and `build`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Remove the 14 unused imports in the 6 files listed above | developer | none | `npx tsc --noEmit --noUnusedLocals --noUnusedParameters` shows no unused-import errors | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2   | TODO   | Remove `getDebts()`, `getNames()`, and the `Debtor` import from `src/configs/api.ts` | developer | none | No `getDebts`/`getNames` left in `src/configs/api.ts`. The backend string is unchanged | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
| 3   | TODO   | Uninstall `autoprefixer`, `esbuild`, `tsx`. Fix the `clean` script. Delete `metadata.json` | developer | none | Packages are gone from `package.json` and the lock file. `@types/react-dom` stays | — |
| 4   | TODO   | Remove the `server` block, the `@` alias, and the `path` import from `vite.config.ts`. Remove `paths` from `tsconfig.json` | developer | none | `npm run lint` and `npm run build` pass | — |
