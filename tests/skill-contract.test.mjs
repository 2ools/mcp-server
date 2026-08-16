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
const canonicalPrompt =
  'Connect this client to 2ools (github.com/2ools/mcp-server, MCP endpoint https://2ools.app/mcp). Use this client\'s in-app browser for every 2ools sign-in and authorization page; never use Chrome, another external browser, or the system browser when this client has an in-app browser or preview pane. Do not end your turn while authorization is pending; after it succeeds, keep the 2ools app visibly open in that pane, opening a fresh in-app tab owned by this chat if the client closed the callback tab. Fetch https://2ools.app/start and follow its "For your AI" steps exactly.';

test("2ools skill preserves the public MCP authority boundary", () => {
  assert.match(skill, /https:\/\/2ools\.app\/mcp/);
  assert.match(skill, /`create_public_preview` is the only authless tool/);
  assert.match(skill, /complete standalone HTML document/);
  assert.match(skill, /does \*\*not\*\* save a 2ools project/);
  assert.match(skill, /OAuth 2\.1 with PKCE/);
  assert.match(skill, /Version approval is separate authority/);
  assert.match(skill, /https:\/\/2ools\.app\/start/);
  assert.match(skill, /single current connection ritual/);
  assert.match(skill, /this client's in-app browser/);
  assert.match(skill, /Do not end the turn\s+while authorization is pending/);
  assert.match(skill, /client closed the callback tab/);
  assert.match(skill, /PTY-backed tool session/);
  assert.match(skill, /refused localhost callback/);
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
