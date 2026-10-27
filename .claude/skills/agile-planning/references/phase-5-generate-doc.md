# Phase 5 — Generate Docs

Write **one story doc for each user story** approved in Phase 3 and Phase 4. Also write **one overview file** that lists every story. It lets you track the whole work in one place.

The story doc is the one source of truth for the team that builds the story.

## File path

Write all files straight into the **Doc Directory** (see `references/PROJECT_OVERVIEW.md`, default `/docs`). Do not use sub-folders:

```
<Doc Directory>/yyyy-mm-dd-<summary>-story.md
```

- `yyyy-mm-dd` = the date you write the doc (e.g. `2026-08-07`)
- `<summary>` = the story name in kebab-case (max 6 words, lowercase, no special characters)

**Example:** `/docs/2026-08-07-create-assessment-story.md`

## Story doc template

```markdown
# S<n> — <Story Name>

- **Epic:** <epic ticket ID / URL, or path to the overview file, or `N/A`>
- **Story Points:** <number, or `?`>
- **Depends On:** <story IDs with their doc paths, or `—`>

## User Story

As a `<persona>`, I want to `<action>` so that I can `<benefit>`.

## Goal

**Problem:** <3–5 sentences about the user problem or business need this story solves>

**Solution:** <how this story solves that problem>

**Impact:** <results or metrics that should get better>

## Requirements

### Functional Requirements

- <what the system must do. Clear behavior that you can see>

### Non-Functional Requirements

- <limits and quality needs: performance, security, accessibility, data privacy>

## Acceptance Criteria

- [ ] Given <context>, when <action>, then <visible result>
- [ ] …

## Tasks

| #      | Task         | Done when | Depends On |
| ------ | ------------ | --------- | ---------- |
| S<n>.1 | [TAG] <task> | <check>   | —          |
| …      | …            | …         | …          |

## Estimate

- **Points:** <number>
- **Reason:** <effort, complexity, and uncertainty from Phase 4>

## Out of Scope

- <what is clearly not included in this story>
```

## Overview file

After the story docs, write **one** overview file:

```
<Doc Directory>/yyyy-mm-dd-<summary>-overview.md
```

- `<summary>` = the **epic** name in kebab-case (or the story name when the input is one story), max 6 words
- Use the same date and Doc Directory as the story docs. Then links are simple paths in the same folder (`./<file>.md`)

**Example:** `/docs/2026-08-07-performance-review-cycle-overview.md`

### Overview template

```markdown
# <Epic or Story Name> — Overview

- **Source:** <ticket ID / URL, or `Pasted text`>
- **Type:** epic | user story
- **Created:** yyyy-mm-dd
- **Stories:** <n> · **Total Points:** <sum> · **Done:** <n> · **In progress:** <n> · **Not started:** <n>

## Summary

<2–4 sentences: what this work gives, and to whom>

## Stories

| #   | User Story           | Doc                                            | Points | Depends On | Ticket | Status         |
| --- | -------------------- | ---------------------------------------------- | ------ | ---------- | ------ | -------------- |
| S1  | Create an assessment | [Doc](./2026-08-07-create-assessment-story.md) | 5      | —          | —      | ⬜ Not started |
| S2  | See team results     | [Doc](./2026-08-07-see-team-results-story.md)  | 3      | S1         | —      | ⬜ Not started |

**Status legend:** ⬜ Not started · 🚧 In progress · ✅ Done

## Delivery Order

<the order to build the stories, based on the Depends On column. Say which can be built at the same time>

1. S1 Create an assessment
2. S2 See team results _(blocked by S1)_

## Deferred to Later

- <stories raised in Phase 3 but left out>

## Open Questions

- [ ] <unclear point that is still open, and who must answer it>
```

## Rules

- **Rows match Phases 3 and 4 exactly.** Same IDs, names, points, and dependencies.
- **One file per story.** Do not put several stories in one doc.
- **Every story has a row** in the overview.
- **Ticket column starts as `—`.** Phase 6 fills it in.
- **Status starts as ⬜ Not started.** After that, people update it by hand.
- **Always keep Open Questions.** If there are none, write `- None`.
- **Out of Scope is never empty.** If nothing is left out, say so.
- **No code.** Tasks may name real modules and paths, but never hold code.

## After writing

Show a summary of the files you wrote:

```markdown
## 📄 Docs Generated

| #   | Story                | Points | Path                                        |
| --- | -------------------- | ------ | ------------------------------------------- |
| S1  | Create an assessment | 5      | /docs/2026-08-07-create-assessment-story.md |
| S2  | See team results     | 3      | /docs/2026-08-07-see-team-results-story.md  |

**Overview:** /docs/2026-08-07-performance-review-cycle-overview.md
```

Then ask: _"Docs saved ✅. Should I now create the story and task tickets in your ticket system?"_
