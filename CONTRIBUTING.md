# Contributing

This repository is the public discovery and installation package for the hosted
2ools MCP server. It contains the server manifest, tool reference, connection
documentation, and assistant skill. It does not contain the 2ools application
source or accept product-feature implementations.

Useful contributions keep this public contract accurate:

- reproduce a connection or documentation issue with the MCP client and its
  version;
- correct `server.json`, `tools.json`, README, or `skills/2ools/SKILL.md` when
  it no longer matches the live endpoint;
- add a focused regression test for a public-contract claim.

Before opening a pull request, run:

```bash
node --test tests/skill-contract.test.mjs
```

Do not include API keys, OAuth tokens, customer data, private preview URLs, or
security vulnerabilities in issues or pull requests. Report sensitive flaws by
following [SECURITY.md](./SECURITY.md).
