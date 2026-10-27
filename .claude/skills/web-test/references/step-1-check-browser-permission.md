# Step 1 — Check Browser Permission

Before anything else, check two things:

1. The user allows the agent to open a browser.
2. A browser tool is available.

Do not open the browser in this step. Only check and ask.

---

## 1. Check that the user allows the browser

Read `Playwright Check` in [PROJECT_OVERVIEW](../../../references/PROJECT_OVERVIEW.md). Then use this table:

| `Playwright Check` | What to do                                                                           |
| ------------------ | ------------------------------------------------------------------------------------ |
| `Always`           | The user allows it. Go on.                                                           |
| `Ask-User`         | Ask the user (see the question below). Go on only after a clear "yes".               |
| `None`             | Browser checks are off for this project. Tell the user, then ask the question below. |
| Missing or `N/A`   | Ask the user (see the question below).                                               |

The user's message counts as a clear "yes" only when it clearly asks you to open a browser. For example: "open the browser and test the login page". Words like "test the login" alone are not enough. Ask.

Ask:

> "This skill opens a browser on your computer to test the web app. It will click, type, and read pages like a user.
>
> - **yes** — allow the browser for this session
> - **no** — do not open a browser
>
> Do you allow it?"

Wait for the answer.

- **yes** → go on.
- **no** → tell the user you will not open a browser. Offer to still write the test plan and test cases (Steps 2–4) without running them. If the user says no to that too, **end the session**.

The "yes" is for this session only. Do not save it. Do not change `PROJECT_OVERVIEW.md`.

---

## 2. Check that a browser tool is available

Look for one of these tools, in this order:

| Tool                    | Tool names                                         |
| ----------------------- | -------------------------------------------------- |
| Claude in Chrome        | `mcp__claude-in-chrome__*`                         |
| Built-in Claude browser | `mcp__Claude_Browser__*`                           |
| Playwright MCP          | `mcp__playwright__*` (or any Playwright MCP tools) |

Some tools are deferred. Their names show in the tool list, but you must load them before use. Seeing the name is enough for this check.

- **Found one** → use it for all next steps. Tell the user which one you will use.
- **Found more than one** → use the first one in the table. If the user asked for a different one, use that one.
- **Found none** → tell the user:

  > "I found no browser tool. Please set up Claude in Chrome, the built-in Claude browser, or a Playwright MCP, and try again."

  Offer to still write the test plan and test cases (Steps 2–4) without running them. If the user says no, **end the session**.

---

## 3. Get the target

Ask the user for anything below that is not clear yet:

- **URL** — the page or app to test (for example `http://localhost:3000`).
- **Environment** — local, dev, staging, or production. If it is **production**, warn the user that tests can change real data. Ask them to confirm.
- **Login** — does the test need a logged-in user? If yes, the user must log in in the browser themselves. Never ask for a password in chat.

Then go to **Step 2**.
