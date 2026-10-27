# Coding Conventions

---

## Folders

```
src/
├── main.tsx              # entry, wraps App in ErrorBoundary
├── App.tsx               # root component + dashboard
├── assets/css/index.css  # Tailwind import + @theme fonts + global styles
├── configs/
│   ├── api.ts                # fetch calls to the Apps Script Web App
│   ├── appsScriptSource.ts   # Apps Script backend code, kept as a string
│   └── types.ts              # shared types
├── hooks/
│   └── useDebtStore.ts       # Zustand store: all business logic, local + Sheets modes
├── utils/                # small pure helpers (e.g. normalizeText.ts)
└── components/           # one component per file
```

## Format (Prettier)

- Semicolons: yes. Quotes: single. Tab size: 2 spaces.
- Line width: 100 chars. Trailing commas: `es5`.
- Run `npm run format` to format `src/`.

## Naming

- Component files and components: PascalCase (`AddTransactionModal.tsx`).
- Other files: camelCase (`useDebtStore.ts`, `appsScriptSource.ts`).
- Variables and functions: camelCase. Constants: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`).
- Types: `interface` for objects, `type` for unions (`TransactionType`). No `I` prefix.
- Booleans start with `is` or a clear verb (`isLoading`, `useLocalFallback`).
- The store hook is `useDebtStore`.

## Code Order in a File

1. Imports: React → libraries (`lucide-react`, `motion/react`) → local files.
2. Types and interfaces.
3. Constants.
4. Helper functions.
5. The component or main function. Components use `export default function Name()`.

## React and State

- Use function components. Only `ErrorBoundary` is a class.
- Read the store with one selector per value: `useDebtStore((state) => state.x)`.
- Put business logic in `hooks/useDebtStore.ts`, not in components. Components call store actions.
- Every store action must handle both modes: local (`useLocalFallback` or no `scriptUrl`) and Sheets.
- Use local `useState` only for UI state (modal open, search text).

## Styling and UI

- Use Tailwind classes inline. Theme fonts are in `@theme` in `assets/css/index.css`.
- Icons come from `lucide-react`. Animation uses `motion/react` with `AnimatePresence`.
- Inputs keep `font-size: 16px`. This stops iOS Safari from zooming in.
- The app is mobile-first, with tablet and desktop layouts. Content width is capped at 1200px.

## Errors

- `api.ts` throws `ApiError` (with `status` and `code`). Messages tell the user what to do next.
- Apps Script always returns 200. `parsePayload` turns `{ error }` into an `ApiError`.
- Store actions use `try/catch`. On error, set `error` and show a toast (`showToast` or `notification`).
- If Sheets fails to load, fall back to local data so the UI still works.
- GET may retry once (cold start). POST must never retry, so a write is not sent twice.

## Backend Connection

- All network calls go through `api.ts`. Components never call `fetch`.
- POST uses `Content-Type: text/plain` to avoid a CORS preflight.
- If you change `configs/appsScriptSource.ts`, tell the user to deploy a new Apps Script version.

## Comments

- Put a JSDoc block above API helpers and non-obvious functions.
- Short `//` comments explain why, not what.

## Imports

- Use relative paths. No barrel (`index.ts`) files. The `@/` alias exists but is not used.

## Testing

- There are no automated tests. Run `npm run lint` (type check) before you finish.
