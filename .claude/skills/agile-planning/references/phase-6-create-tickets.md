# Phase 6 — Create Tickets

Create **one ticket per user story**, and **one sub-ticket per task** under its story.

## 6a. Choose where to create the tickets

Ask the user (if they did not say yet):

> "Where should I create these tickets?"
>
> - Jira (stories under the epic, tasks as sub-tasks)
> - Linear (stories as issues, tasks as sub-issues)
> - GitHub Issues (in a repo)

When the user picks a system, confirm where: project key, team, or repo.

Also ask: _"Should I create the task sub-tickets too, or only the stories?"_

## 6b. Create story tickets

**For each story**, create a ticket with the matching MCP. Use this content:

- **Title:** the short story name from Phase 3
- **Description:**
  - The user story ("As a … I want … so that …")
  - Goal: problem, solution, impact
  - Acceptance criteria, as a checklist
  - Out of scope
  - Link or path to the story doc
- **Story points:** the number from Phase 4. Use the system's story point field. If there is none, add it to the description and as a label (e.g. `points:5`).
- **Labels/Tags:** `story` (or `enabler`), and the product area if you know it.
- **Linked to parent:** link the story to the original epic, if there is one.
- **Dependencies:** add "blocked by" links for the story dependencies in Phase 3.

Create stories **in dependency order**. Then each "blocked by" link points to a ticket that already exists.

## 6c. Create task tickets

If the user wants task sub-tickets, create them **under each story**:

- **Title:** the task title with its tag (e.g. `[BE] Add create-assessment API`)
- **Description:** the "Done when" line, and a link to the story doc
- **Parent:** the story ticket from 6b
- **Labels/Tags:** the tag without brackets (e.g. `be`, `fe`, `qa`)
- **No story points** on tasks
- **Dependencies:** add "blocked by" links for the task dependencies in Phase 3

## 6d. Update the overview

Edit the overview file from Phase 5. In every row, fill in the **Ticket** column with the story ticket ID and its link, e.g. `[PROJ-124](<url>)`. Leave Status as ⬜ Not started.

## 6e. Show a summary

```markdown
## ✅ Tickets Created

| #   | Story Ticket | Story                | Points | Tasks | Link  |
| --- | ------------ | -------------------- | ------ | ----- | ----- |
| S1  | PROJ-124     | Create an assessment | 5      | 4     | <url> |
| S2  | PROJ-125     | See team results     | 3      | 3     | <url> |

**Parent epic:** PROJ-123 — stories linked ✅
**Overview updated:** /docs/2026-08-07-performance-review-cycle-overview.md
```

Then tell the user: _"Planning is done. To build a story or task, run `/party-mode` on its ticket."_

## MCP Reference

| System | MCP to use         | Notes                                                                     |
| ------ | ------------------ | ------------------------------------------------------------------------- |
| Jira   | Atlassian Rovo MCP | Stories link to the epic. Tasks are sub-tasks. Use the Story Points field |
| Linear | Linear MCP         | Tasks are sub-issues. Use the Estimate field for points. Set the project  |
| GitHub | GitHub MCP         | Tasks are sub-issues or a task list. Use a project board field for points |

## No MCP — use the browser

If the MCP is not connected, check if a Claude browser tool is available (Claude in Chrome or the built-in browser in the Claude desktop app). If there is one:

1. Tell the user you will create the tickets in the browser, and wait for a "yes".
2. Open the project in a **new tab**. If the page asks to log in, stop. Ask the user to log in. Never type a password yourself.
3. For each story, in dependency order, open the "new ticket" form. For GitHub: `https://github.com/<owner>/<repo>/issues/new`. For Jira and Linear, use the **Create** button.
4. Fill in the fields from 6b. Then click the create button. Do not click any other button that changes things.
5. Save the new ticket ID and URL from the page. Then create its task sub-tickets the same way (6c).
6. If a field cannot be set in the form (e.g. story points or a "blocked by" link), list it in the summary so the user can set it by hand.

If a page does not load, or an action fails 2–3 times, stop. Tell the user what went wrong.

If there is no MCP and no browser tool, tell the user: _"[Jira/Linear/GitHub] is not connected. You can turn it on in the tools menu."_
