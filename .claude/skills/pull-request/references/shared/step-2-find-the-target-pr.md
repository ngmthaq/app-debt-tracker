# Step 2 — Find the Target PR

The `review` and `resolve` modes use this step. The `create` mode skips it.

Find the PR. Use this order:

1. **The user gave a PR number or URL** → get that PR.
2. **A PR is open in the editor** (MCP only) → use the MCP tool that returns it.
3. **`resolve` only: the current branch has a PR** → use the PR for the branch you are on now.
4. **No PR found** → ask the user:
   - `review`: _"Which PR should I review? Please give a PR number or URL."_
   - `resolve`: _"Which PR should I fix comments on? Please give a PR number or URL."_

## What to get from the PR

| Mode      | Get these                                                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `review`  | Title and description (body), author, base branch, head branch, labels and linked issues (if any)                                                                                         |
| `resolve` | Number, title, author, base branch, **head branch** (you must switch to it before you fix anything), head commit SHA (you need it to reply on lines), if the PR is open and can be merged |

## Using MCP

Use the MCP tool that gets a PR by number or URL, or the one that returns the PR open in the editor.

## Using the CLI

| Platform  | Get PR by number/URL                        | PR of the current branch |
| --------- | ------------------------------------------- | ------------------------ |
| GitHub    | `gh pr view <number-or-url> --json ...`     | `gh pr view --json ...`  |
| GitLab    | `glab mr view <number-or-url>`              | `glab mr view`           |
| Bitbucket | `bb pr view <number>` (flags differ by CLI) | depends on the CLI       |

> Tip (GitHub): one call gets all the fields.
>
> - `review`: `gh pr view <n> --json number,title,body,author,baseRefName,headRefName,labels`
> - `resolve`: `gh pr view <n> --json number,title,headRefName,baseRefName,headRefOid,state`

## Using the browser

- **PR number or URL given** → open the PR page (see the URL table in [Step 1](./step-1-choose-access-method.md)). Read the fields above from the page.
- **`resolve` only: current branch's PR** → open the PR list filtered by your branch. On GitHub: `https://github.com/<owner>/<repo>/pulls?q=is:pr+head:<branch>`. On GitLab: `.../-/merge_requests?source_branch=<branch>`. On Bitbucket, ask the user for the PR number.
- **No PR number or URL** → ask the user for one.
- `resolve`: get the head commit SHA with git, not the browser: `git fetch origin <head-branch>` then `git rev-parse origin/<head-branch>`.
