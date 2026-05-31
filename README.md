# Debt Tracker

A mobile-first PWA for tracking personal loans and debts. Stores data either in **Google Sheets** (via a Google Apps Script backend) or fully offline in **localStorage**. Hosted on Firebase Hosting.

---

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **State:** Zustand
- **Animations:** Motion (motion/react)
- **PWA:** vite-plugin-pwa (Workbox)
- **Backend:** Google Apps Script Web App → Google Sheets
- **Hosting:** Firebase Hosting

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- A Google account (for Google Sheets + Firebase)

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd app-debt-tracker
npm install
```

---

## 2. Local Development

```bash
npm run dev
```

The app starts at `http://localhost:3000`. On first load it runs in **Demo / Local Mode** — all data is stored in `localStorage` with pre-populated sample entries. No Google Sheets or Firebase setup is required to use this mode.

---

## 3. Google Apps Script Setup (optional — for Sheets sync)

The Sheets integration uses a Google Apps Script Web App as a lightweight REST backend.

### 3a. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it anything you like (e.g. `Debt Tracker`).

### 3b. Open the Apps Script editor

1. In the spreadsheet, go to **Extensions → Apps Script**.
2. Delete any existing code in the editor.

### 3c. Paste the script

Copy the full script from `src/appsScriptSource.ts` (the string inside `APPS_SCRIPT_CODE`), then paste it into the Apps Script editor and save (Ctrl+S / ⌘S).

> The script automatically creates a `Transactions` sheet with the correct column headers (`ID`, `Name`, `Amount`, `Note`, `Type`, `CreatedAt`) on first run.

### 3d. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to **Type** and select **Web app**.
3. Set **Execute as:** `Me`.
4. Set **Who has access:** `Anyone`.
5. Click **Deploy** and authorize the requested permissions.
6. Copy the **Web App URL** — you will paste this into the app's Configs screen.

### 3e. Connect the app

1. Open the app and tap **Configs** (top-right).
2. Paste the Web App URL and toggle off Local Mode.
3. Tap Save — the app will sync to your sheet immediately.

> **Re-deploy after script changes:** Any time you edit the Apps Script, go to **Deploy → Manage deployments**, select the deployment, click the edit (pencil) icon, choose **New version**, and click **Deploy**.

---

## 4. Firebase Setup

### 4a. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com).
2. Click **Add project**, name it (e.g. `app-debt-tracker`), and follow the wizard.
3. You do **not** need Google Analytics for this project.

### 4b. Enable Firebase Hosting

1. In the Firebase console, open your project.
2. Go to **Build → Hosting** in the left sidebar.
3. Click **Get started** and follow the setup steps (you can skip the SDK snippets).

### 4c. Log in with the Firebase CLI

```bash
firebase login
```

### 4d. Link the project

```bash
firebase use --add
```

Select the Firebase project you created and give it the alias `default`. This writes `.firebaserc`.

Alternatively, edit `.firebaserc` manually:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

---

## 5. Build & Deploy

### Build

```bash
npm run build
```

Output goes to the `dist/` folder.

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Firebase will upload `dist/` and print the live URL (e.g. `https://app-debt-tracker.web.app`).

### One-liner (build + deploy)

```bash
npm run build && firebase deploy --only hosting
```

---

## 6. PWA Behaviour

- The app is installable on iOS (Add to Home Screen) and Android (Install App prompt).
- All static assets are precached by the Workbox service worker on first load.
- When a new version is deployed, a **"Update Available"** banner appears at the bottom of the screen. Tapping **Update** reloads the app with the latest build.
- iOS Safari auto-zoom on input focus is suppressed via `font-size: 16px` on all inputs.

---

## 7. Project Structure

```
src/
├── api.ts                  # Fetch wrappers for the Apps Script Web App
├── appsScriptSource.ts     # Full Google Apps Script source (copy-paste into GAS editor)
├── store.ts                # Zustand store — all business logic, local + Sheets modes
├── types.ts                # Shared TypeScript interfaces
├── App.tsx                 # Root component + dashboard
├── index.css               # Global styles + Tailwind theme
└── components/
    ├── AddTransactionModal.tsx
    ├── DebtorDetailScreen.tsx
    ├── EditTransactionModal.tsx
    ├── PWAUpdateBanner.tsx
    ├── SetupGuideModal.tsx
    └── StatusToast.tsx
```

---

## 8. Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `localhost:3000` |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type-check (no emit) |
| `npm run clean` | Delete `dist/` and `server.js` |

---

## 9. Google Sheet Column Schema

The Apps Script expects (and auto-creates) columns in this order:

| Column | Header | Description |
|---|---|---|
| A | ID | UUID generated by Apps Script |
| B | Name | Debtor's name |
| C | Amount | Positive number (VND) |
| D | Note | Optional memo |
| E | Type | `BORROW` or `PAYMENT` |
| F | CreatedAt | ISO 8601 timestamp |

> If you have an existing sheet from a previous version (before the Note column was added), insert a blank column D and label it `Note` before re-deploying the script.
