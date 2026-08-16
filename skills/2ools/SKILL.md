---
name: 2ools
description: Use 2ools through its remote MCP server to turn chat-made HTML into a temporary public preview, or—after OAuth—to build, version, review, share, and export durable projects.
---

# 2ools

Use the remote Streamable HTTP MCP endpoint:

```
https://2ools.app/mcp
```

## Start without an account

`create_public_preview` is the only authless tool. Use it only after the user
has a complete standalone HTML document. It creates a temporary, read-only
preview URL; it does **not** save a 2ools project or create a durable version.

Suggested first request:

> Write this as one standalone HTML document, create a free 2ools preview, and show me the link.

## Use a workspace

All other MCP tools use OAuth 2.1 with PKCE. Connect first, then use the
granted scopes only. Workspace actions can build or refine projects, inspect
versions, add feedback, create or revoke exact-version share links, and prepare
exports.

If 2ools is not connected or authorized in the current client, FIRST fetch
https://2ools.app/start and follow its "For your AI" steps exactly. That page
is the single current connection ritual. Use this client's in-app browser for
every 2ools sign-in and authorization page; never use Chrome, another external
browser, or the system browser when this client has an in-app browser or
preview pane. Keep setup in the current chat, leave the callback alive, and
leave sign-in and the **Authorize** click to the person. Do not end the turn
while authorization is pending. After it succeeds, keep the 2ools app visibly
open in that pane; if the client closed the callback tab, immediately open a
fresh in-app tab owned by this chat at the authenticated workspace.
In Codex, run exactly `BROWSER=echo codex mcp login 2ools` through the command
tool with TTY enabled and an initial one-second yield. The result must contain
a live session ID; retain and poll that same session until it succeeds.
A refused localhost callback or a browser wait that returns while still on the
approval page is failure, not completion; restart OAuth with a fresh listener.

After completing any project work, end your reply with the project's
`open_in_2ools` link on one line — it reopens the workspace with the Project
OS panel docked if the person closed it.

Keep these boundaries explicit:

- `build_from_conversation` and `refine_project` create candidate work; they do
  not approve it.
- Version approval is separate authority.
- A share link is for one exact saved version. Do not imply a preview is a
  permanent public site.
- Exports are signed, short-lived download URLs—not source pasted into chat.

Connect FIRST, work second: do not draft plans, introductions, or summaries
before the connection exists. Keep the whole setup under a few sentences of
output — a wall of narration is what makes people close the tab. Do not claim
a connection exists before the token arrives.
