# Step 6 — Create the PR

Use the access method you chose in [Step 1](../shared/step-1-choose-access-method.md). If it fails, try the next one in this order:

1. **Platform MCP** — best choice
2. **Platform CLI** — if there is no MCP
3. **Claude browser control** — if there is no MCP and no working CLI
4. **Copy-paste** — last choice

## Using MCP

1. Show the filled template to the user.
2. Ask: _"Should I create this PR now with the [Platform] MCP?"_
3. If yes, call the MCP tool. Use `<target-branch>` and the filled description.
4. Send the PR link to the user.

## Using the CLI

1. Show the filled template to the user.
2. Ask: _"Should I create this PR now with `<cli>`?"_
3. If yes, save the description to a temp file. This avoids quote problems with long Markdown. Then run:

   **GitHub**

   ```bash
   gh pr create --base <target-branch> --title "<title>" --body-file <tmpfile>
   ```

   **GitLab**

   ```bash
   glab mr create --target-branch <target-branch> --title "<title>" --description "$(cat <tmpfile>)"
   ```

   **Bitbucket** — each CLI has different flags. For `bb`:

   ```bash
   bb pr create --target <target-branch> --title "<title>" --description "$(cat <tmpfile>)"
   ```

4. Delete the temp file.
5. Send the PR link from the CLI output to the user.

## Using the browser

1. Show the filled template to the user.
2. Ask: _"Should I create this PR now in your browser?"_
3. If yes, check that your branch is on the remote: `git ls-remote --heads origin <current-branch>`. If it is not, ask the user first. Then run `git push -u origin <current-branch>`.
4. Open a **new tab** with the "new PR" page:

   | Platform  | "New PR" page URL                                                                                                                                         |
   | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | GitHub    | `https://github.com/<owner>/<repo>/compare/<target-branch>...<current-branch>?expand=1`                                                                   |
   | GitLab    | `https://<gitlab-host>/<group>/<project>/-/merge_requests/new?merge_request[source_branch]=<current-branch>&merge_request[target_branch]=<target-branch>` |
   | Bitbucket | `https://bitbucket.org/<workspace>/<repo>/pull-requests/new?source=<current-branch>&dest=<target-branch>`                                                 |

5. Check that both branches on the page are correct. Then type the title and description.
6. Click the create button. Do not click any other button that changes things (like merge, close, or delete).
7. Send the PR link to the user.

Follow the browser rules in [Step 1](../shared/step-1-choose-access-method.md). If a step fails 2–3 times, stop. Tell the user what went wrong. Then use copy-paste.

## Copy-paste

If nothing else works:

- Give the user the filled description in a Markdown code block. The user can copy it into the platform.
