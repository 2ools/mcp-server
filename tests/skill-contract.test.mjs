import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skill = await readFile(new URL("../skills/2ools/SKILL.md", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../server.json", import.meta.url), "utf8"));
const packageManifest = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const dockerfile = await readFile(new URL("../Dockerfile", import.meta.url), "utf8");
const proxy = await readFile(new URL("../proxy.mjs", import.meta.url), "utf8");
const normalizedSkill = skill.replace(/\s+/g, " ");
const canonicalPrompt =
  'Connect this client to 2ools (github.com/2ools/mcp-server, MCP endpoint https://2ools.app/mcp). Retrieve https://2ools.app/start non-visibly with an HTTP or web-fetch tool; never navigate the in-app browser to that instructions page. Use this client\'s in-app browser for every 2ools sign-in and authorization page; never use Chrome, another external browser, or the system browser when this client has an in-app browser or preview pane. The exact OAuth approval URL must be the first 2ools page you visibly open. Before I must act, your only user-facing setup message may be `Connecting 2ools in this client\'s browser…`. Do not output insight blocks or narrate setup mechanics. Ask me exactly once to sign in and click Authorize. Do not end your turn while authorization is pending; after it succeeds, keep the 2ools app visibly open in that pane. Fetch https://2ools.app/start and follow its "For your AI" steps exactly.';

test("2ools skill preserves the public MCP authority boundary", () => {
  assert.match(skill, /https:\/\/2ools\.app\/mcp/);
  assert.match(skill, /`create_public_preview` is the only authless tool/);
  assert.match(skill, /complete standalone HTML document/);
  assert.match(skill, /does \*\*not\*\* save a 2ools project/);
  assert.match(skill, /OAuth 2\.1 with PKCE/);
  assert.match(skill, /Version approval is separate authority/);
  assert.match(skill, /https:\/\/2ools\.app\/start/);
  assert.match(normalizedSkill, /single current connection ritual/);
  assert.match(normalizedSkill, /client has an in-app browser or preview pane/);
  assert.match(normalizedSkill, /do not end the turn while authorization is pending/i);
  assert.match(normalizedSkill, /single \*\*Authorize\*\* click/);
  assert.match(skill, /projects\/\{projectId\}\/os/);
  assert.match(skill, /workspace\?source=mcp&intent=new/);
  assert.match(skill, /workspace\?source=mcp&intent=existing/);
  assert.match(skill, /workspace\?source=mcp/);
  assert.match(normalizedSkill, /Never use `https:\/\/2ools\.app\/` as the post-authorization fallback/);
  assert.match(skill, /refused localhost callback/);
  assert.doesNotMatch(skill, /BROWSER=echo codex mcp login 2ools/);
  assert.doesNotMatch(skill, /oauth\/device_authorization|claude mcp add|"mcpServers"/);
  assert.doesNotMatch(skill, /no account.*build|build.*no account/i);
});

test("README links the public skill and keeps the free preview boundary", () => {
  assert.match(readme, /\[2ools Skill\]\(\.\/skills\/2ools\/SKILL\.md\)/);
  assert.match(readme, /One tool is free and needs no account at all/);
  assert.ok(readme.includes(canonicalPrompt));
});

test("public discovery makes the Free-to-paid scope boundary explicit", () => {
  assert.equal(
    manifest.description,
    "Free previews and workspace projects for LLM-built websites; paid plans add governance, agent, and artifact scopes.",
  );
});

test("the runnable proxy stays pinned to the verified remote server", () => {
  assert.equal(packageManifest.scripts.start, "node proxy.mjs");
  assert.equal(packageManifest.dependencies, undefined);
  assert.match(dockerfile, /npm ci --omit=dev/);
  assert.match(dockerfile, /ENTRYPOINT \["node", "proxy\.mjs"\]/);
  assert.match(proxy, /const REMOTE_URL = "https:\/\/2ools\.app\/mcp"/);
  assert.match(proxy, /const REMOTE_PROTOCOL_VERSION = "2026-07-28"/);
  assert.match(proxy, /"Mcp-Method": message\.method/);
  assert.match(proxy, /"io\.modelcontextprotocol\/protocolVersion"/);
  assert.match(proxy, /"io\.modelcontextprotocol\/clientCapabilities"/);
  assert.match(readme, /intentionally does not perform an interactive OAuth\s+flow/);
});
