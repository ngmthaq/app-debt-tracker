# PROJECT OVERVIEW

---

- **Project Name**: `Debt Tracker` (package name `app-debt-tracker`)
- **Project Description**: `A mobile-first PWA to track money you lent to people and their payments. Data lives in Google Sheets (through a Google Apps Script backend) or offline in localStorage.`
- **Programming Languages**: `TypeScript`, `CSS`, `JavaScript (Google Apps Script, kept as a string in src/configs/appsScriptSource.ts)`
- **Frameworks**: `React 19`, `Vite 6`, `Tailwind CSS v4`
- **Package Managers**: `npm`
- **Key Libraries**: `zustand`, `motion` (motion/react), `lucide-react`, `vite-plugin-pwa`
- **Database**: `Google Sheets (through Apps Script Web App) or browser localStorage`
- **Doc Directory**: `docs/`
- **Testing Workflow**: `Skip-Testing` <!-- Code-First | Test-First | Skip-Testing -->
- **Playwright Check**: `Ask-User` <!-- Always | None | Ask-User -->

> Note: DO NOT change the list format above. Only fill in the values.

## Additional Information

### What the app does

- Shows a dashboard of debtors with their balance and status (`PAID` / `UNPAID`).
- Adds `BORROW` (lent) and `PAYMENT` (paid back) transactions. Amounts are in VND.
- Shows the history of one debtor. Lets the user edit, delete, mark fully paid, copy a summary, and clear all records.

### Two storage modes

| Mode                  | How it works                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Local (default, demo) | Data is in `localStorage` key `debt_tracker_local_transactions`. Demo data loads on first run.       |
| Sheets                | `src/configs/api.ts` calls the Apps Script Web App URL. The user sets the URL in the Configs screen.         |

- Settings are saved in `localStorage` keys `debt_tracker_script_url` and `debt_tracker_use_local`.
- If Sheets fails to load, the store shows an error toast and falls back to local data.

### Apps Script backend

- The backend code is the `APPS_SCRIPT_CODE` string in `src/configs/appsScriptSource.ts`. The user copies it into the Apps Script editor by hand.
- Sheet `Transactions` columns: `ID`, `Name`, `Amount`, `Note`, `Type`, `CreatedAt`.
- Apps Script always returns HTTP 200. Errors come back as `{ error: "..." }`.
- Calls are slow (cold start can be 15s+). Timeout is 60s. GET retries once. POST never retries, so a write is not sent twice.
- After a change to the script, the user must deploy a new version.

### Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start dev server at `http://localhost:3000`   |
| `npm run build`   | Build to `dist/`                              |
| `npm run preview` | Preview the build                             |
| `npm run lint`    | Type check only (`tsc --noEmit`). No ESLint.  |
| `npm run format`  | Run Prettier on `src/`                        |

### Hosting and CI

- Firebase Hosting serves `dist/` as a single-page app (all paths go to `index.html`).
- GitHub Actions deploy on merge to main and make a preview for each PR (`.github/workflows/`).

### Notes

- The repo started from a Google AI Studio template. The app uses no env variables.
- There are no automated tests.
- `graphify-out/` has a code-only knowledge graph of the repo.
