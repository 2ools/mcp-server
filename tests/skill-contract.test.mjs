import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skill = await readFile(new URL("../skills/2ools/SKILL.md", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("2ools skill preserves the public MCP authority boundary", () => {
  assert.match(skill, /https:\/\/2ools\.app\/mcp/);
  assert.match(skill, /`create_public_preview` is the only authless tool/);
  assert.match(skill, /complete standalone HTML document/);
  assert.match(skill, /does \*\*not\*\* save a 2ools project/);
  assert.match(skill, /OAuth 2\.1 with PKCE/);
  assert.match(skill, /Version approval is separate authority/);
  assert.doesNotMatch(skill, /no account.*build|build.*no account/i);
});

test("README links the public skill and keeps the free preview boundary", () => {
  assert.match(readme, /\[2ools Skill\]\(\.\/skills\/2ools\/SKILL\.md\)/);
  assert.match(readme, /One tool is free and needs no account at all/);
});
