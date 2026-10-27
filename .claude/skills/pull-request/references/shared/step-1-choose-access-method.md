# Step 1 — Choose the Access Method

Find the platform. Then choose how to read and write PR data. Use the same method in all next steps.

## Find the platform

Run this command to get the remote URL:

```bash
git remote get-url origin
```

| URL has                         | Platform                                              |
| ------------------------------- | ----------------------------------------------------- |
| `github.com`                    | GitHub                                                |
| `gitlab.com` or your own GitLab | GitLab                                                |
| `bitbucket.org`                 | Bitbucket                                             |
| Anything else                   | Other (`create` only: use the default template later) |

Get `<owner>/<repo>` (or `<group>/<project>`, `<workspace>/<repo>`) from the URL too.

## What each mode needs

The method you choose must be able to do everything the mode needs:

| Mode      | The method must be able to                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| `create`  | Create a PR/MR                                                                                                       |
| `review`  | Get a PR by number or URL, read its diff, and post review comments on a **file + line**                              |
| `resolve` | Get a PR, read its **review threads** (file, line, text, author, resolved or not), reply to a thread, and resolve it |

Try the options in this order.

## Tier 1 — Platform MCP (best)

Look for an MCP tool that can do what the mode needs. Some MCP tools can also return the PR that is open in the editor now.

| Platform  | Example MCP tools                                     |
| --------- | ----------------------------------------------------- |
| GitHub    | `github-pull-request_*` tools, or any GitHub MCP      |
| GitLab    | GitLab MCP (tools for merge requests and discussions) |
| Bitbucket | Bitbucket MCP (tools for pull requests and comments)  |

If you find one → use **MCP** for all next steps.

## Tier 2 — Platform CLI (backup)

If there is no MCP, check for the platform CLI:

| Platform  | CLI    | Is it installed?                           | Is it logged in?   |
| --------- | ------ | ------------------------------------------ | ------------------ |
| GitHub    | `gh`   | `command -v gh`                            | `gh auth status`   |
| GitLab    | `glab` | `command -v glab`                          | `glab auth status` |
| Bitbucket | `bb`   | `command -v bb` (or another Bitbucket CLI) | depends on the CLI |

If the CLI is installed and logged in → use the **CLI** for all next steps.

If the CLI is installed but **not logged in**, tell the user how to log in (e.g. `gh auth login`, `glab auth login`). Or offer Tier 3.

## Tier 3 — Claude browser control

If there is no MCP and no working CLI, check if a Claude browser tool is available:

- Claude in Chrome (`mcp__claude-in-chrome__*` tools)
- The built-in browser in the Claude desktop app (`mcp__Claude_Browser__*` tools)

If there is one → use the **browser** for all next steps. Follow these rules each time you use it:

- Work in a **new tab**.
- If the page asks to log in, stop. Ask the user to log in, then go on. Never type a password or token yourself.
- Click only the buttons the step needs. Never click merge, close, approve, request changes, or delete.
- If a page does not load, or an action fails 2–3 times, stop. Tell the user what went wrong.

PR page URLs:

| Platform  | PR page                                                             |
| --------- | ------------------------------------------------------------------- |
| GitHub    | `https://github.com/<owner>/<repo>/pull/<number>`                   |
| GitLab    | `https://<gitlab-host>/<group>/<project>/-/merge_requests/<number>` |
| Bitbucket | `https://bitbucket.org/<workspace>/<repo>/pull-requests/<number>`   |

## None available

- **`create`** → go on. At Step 6, give the user the filled description to copy and paste.
- **`review`** or **`resolve`** → tell the user:

  > "This skill needs an MCP, a platform CLI (`gh`, `glab`, or a Bitbucket CLI), or a Claude browser tool to work with the PR. I found none. Please set one up and try again."

  Then **end the session**.
