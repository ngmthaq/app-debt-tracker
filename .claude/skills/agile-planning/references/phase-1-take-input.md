# Phase 1 — Take Input

Get the epic or user story, and find out what type it is.

## 1a. Find the input source

| Source                           | Action                       |
| -------------------------------- | ---------------------------- |
| User pasted text                 | Use it directly              |
| Jira ticket ID (e.g. `PROJ-123`) | Fetch via Atlassian Rovo MCP |
| Linear ticket ID/URL             | Fetch via Linear MCP         |
| GitHub Issue URL or `#number`    | Fetch via GitHub MCP         |

If the user gives a ticket ID but not the system, ask: _"Is that a Jira, Linear, or GitHub issue?"_

**If the MCP is not connected**, try these in order:

1. **CLI** — for GitHub, use `gh issue view <number-or-url>` if `gh` is installed and logged in.
2. **Claude browser control** — if a Claude browser tool is available (Claude in Chrome or the built-in browser in the Claude desktop app), open the ticket in a **new tab** and read the page as text. If you only have a ticket ID, ask the user for the full URL. If the page asks to log in, stop. Ask the user to log in. Never type a password yourself.
3. **Paste** — if nothing works, ask the user to paste the ticket text.

Also read the child tickets and linked tickets, if the input has any. They may already hold stories or tasks.

## 1b. Find the input type

| Type         | How to tell                                                                    | What the next phases do                     |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------- |
| `epic`       | Many user journeys, many personas, or too big for one sprint                   | Split into stories, then each into tasks    |
| `user story` | One persona, one goal, can fit in one sprint (often written "As a … I want …") | Do not split into stories. Split into tasks |

If you are not sure, ask: _"Is this an epic (many stories) or one user story?"_

## 1c. Show what you got

Show this summary. Then ask for approval before Phase 2:

```md
## 📥 Input

**Title:** <title>
**Source:** Jira / Linear / GitHub / Pasted text — <ticket ID or URL>
**Type:** epic | user story
**Linked tickets:** <child or linked tickets, or "none">

### Original Text

<the input text, word for word. Shorten only very long text, and say that you did>
```

Then ask: _"Is this the right input, and is the type correct?"_
