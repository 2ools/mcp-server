# 2ools MCP Server

**Remote MCP server for [2ools](https://2ools.app) — build, version, review and export
websites, web apps and games from inside the AI chat you already use.**

[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-app.2ools%2Fmcp-0a7?style=flat-square)](https://registry.modelcontextprotocol.io/v0/servers?search=2ools)
[![Transport](https://img.shields.io/badge/transport-Streamable%20HTTP-444?style=flat-square)](https://modelcontextprotocol.io)
[![Tools](https://img.shields.io/badge/tools-43-444?style=flat-square)](#tools)

```
https://2ools.app/mcp
```

Your assistant writes the site. 2ools is where it lives: every result becomes a
restorable version, previews are shareable links that need no account to open,
and the source exports as plain files with no proprietary runtime.

**One tool is free and needs no account at all** — `create_public_preview` turns a
standalone HTML document your model just wrote into a real, viewable URL. The rest
connect over OAuth 2.1 with PKCE and least-privilege scopes.

---

## Quick start

Paste this into the AI client you want to connect:

> Connect this client to 2ools (github.com/2ools/mcp-server, MCP endpoint https://2ools.app/mcp). Retrieve https://2ools.app/start non-visibly with an HTTP or web-fetch tool; never navigate the in-app browser to that instructions page. Use this client's in-app browser for every 2ools sign-in and authorization page; never use Chrome, another external browser, or the system browser when this client has an in-app browser or preview pane. The exact OAuth approval URL must be the first 2ools page you visibly open. Before I must act, your only user-facing setup message may be `Connecting 2ools in this client's browser…`. Do not output insight blocks or narrate setup mechanics. Ask me exactly once to sign in and click Authorize. Do not end your turn while authorization is pending; after it succeeds, keep the 2ools app visibly open in that pane. Fetch https://2ools.app/start and follow its "For your AI" steps exactly.

The live [start page](https://2ools.app/start) is the single current connection
ritual for every client. It detects the current client path, keeps OAuth alive,
and leaves only sign-in and the **Authorize** click to the person. Manual MCP
configuration is a fallback only for clients that cannot manage their own
remote-MCP setup.

After authorization, the initiating context selects the app destination: an
exact project's Project OS when its ID is known, the new-project or
existing-project workspace flow when that intent is known, and the authenticated
MCP workspace for a generic install. The public homepage is never the fallback.

### Registry introspection proxy

Registries that require a local stdio process can run the included credential-free
proxy. It forwards MCP JSON-RPC traffic to the same verified remote endpoint; it
does not mock or reimplement any 2ools tools. It translates the stdio handshake
into the remote endpoint's current per-request MCP envelope and returns the live
schemas from 2ools.

```bash
npm ci
npm start
```

The included `Dockerfile` runs the same dependency-free proxy for reproducible
registry introspection. It intentionally does not perform an interactive OAuth
flow. Clients using authenticated workspace tools should connect directly to
`https://2ools.app/mcp` so OAuth remains end-to-end with 2ools.

### 2ools Skill

For assistants that support repository skills, add or copy the
[2ools Skill](./skills/2ools/SKILL.md). It keeps the temporary-preview and
OAuth workspace boundaries explicit. Client support for remote MCP and Skill
folders varies; the live start page routes each client to its supported flow.

### Try it with no account

Ask your assistant:

> Write this as one standalone HTML document, create a free 2ools preview, and show me the link.

You get back a real URL that anyone can open. It expires after 24 hours.

---

## What you can do with it

| Ask your assistant… | It uses |
|---|---|
| "Open this generated site in 2ools and give me a client-safe preview link" | `create_public_preview` |
| "Save this conversation as a durable 2ools project" | `build_from_conversation` |
| "Make the hours bigger and show me the new version" | `refine_project` |
| "Compare the last two versions" | `compare_versions` |
| "What changed on this project since Tuesday?" | `get_project_activity` |
| "Export the source as a zip" | `prepare_version_export` |

---

## Tools

43 tools, each with explicit `readOnlyHint` and `destructiveHint` annotations so a
client can reason about blast radius before calling anything.

### Free — no account required

| Tool | Effect | What it does |
|---|---|---|
| `create_public_preview` | write | Turn a complete standalone HTML document already created in this chat into a temporary, read-only 2ools preview. |

### Build and refine

| Tool | Effect | What it does |
|---|---|---|
| `build_from_conversation` | write | Create a new 2ools project from a structured conversation brief and queue one durable build. |
| `refine_project` | write | Create one protected child version from a saved base version and concrete review feedback. |
| `get_build` | read-only | Get one build's current status, progress, errors, completed version IDs, and protected preview URLs. |
| `cancel_build` | destructive | Cancel a queued or running non-Agent 2ools build. |
| `compare_versions` | read-only | Compare two saved versions in one project without returning source. |
| `list_build_systems` | read-only | List the Curators, Rulebooks, and Skills this paid account may explicitly apply. |

### Read a project

| Tool | Effect | What it does |
|---|---|---|
| `list_projects` | read-only | List recent 2ools projects the authenticated account can access, including owned and shared projects. |
| `get_project` | read-only | Get a 2ools project's brief, selected pages, active version, and compact version history. |
| `get_project_context` | read-only | Read one source-free operating packet before acting: the active version, exact frozen Curator snapshot, revision-… |
| `render_project_preview` | read-only | Render an interactive, read-only card for one saved 2ools version. |
| `get_project_activity` | read-only | Read the attributable project timeline across human work, external MCP agents, builds, versions, feedback, and… |
| `wait_for_project_activity` | read-only | Wait up to 20 seconds for attributable project events newer than a head_cursor or prior next_cursor. |

### Review and approval

| Tool | Effect | What it does |
|---|---|---|
| `list_approval_requests` | read-only | List exact saved versions waiting for a separately delegated reviewer. |
| `approve_version` | destructive | Use separately delegated review authority to approve one saved version and make it the project's active version. |
| `reject_version` | destructive | Use separately delegated review authority to reject one saved version. |

### Feedback and shared notes

| Tool | Effect | What it does |
|---|---|---|
| `list_project_feedback` | read-only | Read page-anchored review feedback for versions in a project, with explicit human or external-agent attribution. |
| `add_project_feedback` | write | Add an attributable review comment to a saved project version. |
| `resolve_project_feedback` | destructive | Owner-only review decision that resolves or reopens one saved feedback item. |
| `list_project_pins` | read-only | Read shared workspace notes and http(s) links, with explicit attribution. |
| `add_project_pin` | write | Add an attributable note or safe http(s) link to the shared project workspace. |
| `remove_project_pin` | destructive | Remove one shared workspace pin. |

### Export and sharing

| Tool | Effect | What it does |
|---|---|---|
| `prepare_version_export` | read-only | Create a five-minute download URL for an exact saved version. |
| `get_version_share_link` | read-only | Read the durable sharing state and current URL for one exact saved version. |
| `create_version_share_link` | write | Create or recover a durable public or code-protected link for one exact saved version. |
| `revoke_version_share_link` | destructive | Disable every existing public or code-protected URL for one exact saved version. |

### Artifacts

| Tool | Effect | What it does |
|---|---|---|
| `list_artifacts` | read-only | List durable project artifacts and each latest immutable version without returning stored bytes. |
| `get_artifact` | read-only | Read one artifact's immutable version history, provenance, attribution, digests, and review states without… |
| `prepare_artifact_upload` | write | Create a five-minute PUT URL for exact bytes. |
| `prepare_artifact_download` | read-only | Create a five-minute download URL for one immutable artifact version. |
| `list_artifact_approval_requests` | read-only | List exact artifact versions awaiting or carrying a human review decision. |
| `approve_artifact_version` | write | Approve one pending immutable artifact version and make it current. |
| `reject_artifact_version` | write | Reject one pending immutable artifact version with useful feedback. |

### Agents

| Tool | Effect | What it does |
|---|---|---|
| `list_project_agents` | read-only | List the authorizing account's built-in Agents assigned to one readable project. |
| `get_agent` | read-only | Read one Agent's saved Limits, trigger, immutable revision summaries, and redacted append-only run traces. |
| `run_project_agent` | write | Queue real execution for a project-linked Agent the person already test-ran and armed. |
| `cancel_agent_run` | destructive | Stop one queued or running Agent execution and close its durable run history. |

### Work assignments

| Tool | Effect | What it does |
|---|---|---|
| `list_work_assignments` | read-only | List durable project work contracts, bounded attempts, leases, budgets, and result references. |
| `create_work_assignment` | write | Create a durable assignment with acceptance criteria and hard step, time, and spend ceilings. |
| `claim_work_assignment` | write | Atomically claim one open assignment and receive a five-minute renewable lease plus an immutable budget snapshot. |
| `heartbeat_work_session` | write | Renew the authenticated worker's active lease without widening its immutable step, time, or spend ceilings. |
| `submit_work_session` | write | End the authenticated worker's lease and submit typed result references for a separate review decision. |
| `decide_work_assignment` | write | Complete submitted work or reopen it with useful feedback. |
---

## Authentication

| Access | Method | Scopes |
|---|---|---|
| `create_public_preview` | none — genuinely authless | — |
| Everything else | OAuth 2.1 authorization code + PKCE (S256) | least-privilege, consented per connection |

The authorization server publishes RFC 8414 and RFC 9728 discovery documents at
`/.well-known/oauth-authorization-server` and `/.well-known/oauth-protected-resource`,
supports RFC 7591 dynamic client registration, rotates refresh tokens with family
revocation on replay, and stores only token digests.

**Review authority is deliberately separate from build authority.** `projects:build`
lets an agent produce candidate versions; `approve_version` and `reject_version`
require `projects:approve`, which is excluded from default grants. An agent that can
build cannot sign off on its own work unless a human explicitly delegates that.

---

## Design notes

**Source never travels through the model transcript.** Exports and artifact downloads
are five-minute signed URLs bound to the action, the account and the exact version.
The MCP response carries metadata and links, not bytes — so a large site does not
consume the context window, and generated source is not replayed into a provider log.

**Shared previews run in an opaque-origin sandbox.** A shared page is served under a
CSP sandbox with `connect-src 'none'`, so a site built by a model cannot read the
viewer's cookies, storage, or reach the network.

**External agent output enters review, not production.** An artifact uploaded by an
outside agent is stored immutably and marked pending; it cannot become the current
version until a human with review authority approves that exact digest.

**Interactive previews use MCP Apps.** `render_project_preview` returns a real
interactive card via `ui://2ools/project-preview-v1.html` rather than a wall of text.

---

## Links

- **Product** — <https://2ools.app>
- **Connection guide** — <https://2ools.app/connect-ai>
- **Free website audit** (28 deterministic checks, no account) — <https://2ools.app/website-audit>
- **Benchmarks: 36 real sites scored** — <https://2ools.app/website-audit/benchmarks>
- **What 2ools does** — <https://2ools.app/product>
- **Pricing** — <https://2ools.app/pricing>
- **LLM guide** — <https://2ools.app/llms.txt>
- **Privacy & terms** — <https://2ools.app/legal>

## Registry

Published to the official Model Context Protocol registry under the
domain-verified namespace **`app.2ools/mcp`**.

```bash
curl "https://registry.modelcontextprotocol.io/v0/servers?search=2ools"
```

## Status

The endpoint is live in production. Health, including the exact deployed release:

```bash
curl https://2ools.app/api/health
```

## License

MIT — see [LICENSE](./LICENSE). This repository holds the server's public manifest
and documentation; the 2ools application itself is a hosted product.
