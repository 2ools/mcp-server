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

Keep these boundaries explicit:

- `build_from_conversation` and `refine_project` create candidate work; they do
  not approve it.
- Version approval is separate authority.
- A share link is for one exact saved version. Do not imply a preview is a
  permanent public site.
- Exports are signed, short-lived download URLs—not source pasted into chat.

## Connect without a browser you control (device flow)

When you cannot complete a redirect-based OAuth flow — a chat session, a
non-interactive client, a headless or remote machine — use the RFC 8628
device authorization grant. It needs no localhost listener and no redirect:

1. Register once (no redirect URIs needed):
   `POST https://2ools.app/oauth/register` with JSON
   `{"client_name": "<your client>", "grant_types": ["urn:ietf:params:oauth:grant-type:device_code", "refresh_token"]}`.
2. Start the flow: `POST https://2ools.app/oauth/device_authorization`
   (form-encoded `client_id`, optional `scope`). The response contains
   `verification_uri_complete`, a human `user_code`, and a `device_code`.
3. Show the user ONE link — `verification_uri_complete` — and tell them to
   open it in their own browser, sign in if asked, and click Authorize.
   Never ask for their password yourself.
4. Poll `POST https://2ools.app/oauth/token` (form-encoded
   `grant_type=urn:ietf:params:oauth:grant-type:device_code`, `device_code`,
   `client_id`) no faster than the returned `interval`. `authorization_pending`
   means keep waiting; `access_denied` means the user declined; success returns
   the bearer tokens.

State plainly while waiting that the user has not approved yet. Do not claim
a connection exists before the token arrives.

## Client setup

Use the client’s native remote-MCP configuration with the endpoint above. For
Claude Code:

```bash
claude mcp add --transport http 2ools https://2ools.app/mcp
```

For clients that accept an MCP JSON configuration:

```json
{
  "mcpServers": {
    "2ools": {
      "type": "http",
      "url": "https://2ools.app/mcp"
    }
  }
}
```

Do not claim that every client supports remote MCP or Skill folders. When a
client does not, use its documented connector flow or the 2ools web app.
