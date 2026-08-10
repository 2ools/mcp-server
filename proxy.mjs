import { createInterface } from "node:readline";

const REMOTE_URL = "https://2ools.app/mcp";
const REMOTE_PROTOCOL_VERSION = "2026-07-28";

let protocolVersion;
let clientCapabilities = {};
let queue = Promise.resolve();

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function writeFailure(message, error) {
  if (message.id === undefined) {
    process.stderr.write(`2ools MCP proxy error: ${error.message}\n`);
    return;
  }

  writeMessage({
    jsonrpc: "2.0",
    id: message.id,
    error: {
      code: -32603,
      message: `2ools remote MCP request failed: ${error.message}`,
    },
  });
}

function responseMessages(body, contentType) {
  if (!body.trim()) return [];

  if (!contentType.includes("text/event-stream")) {
    return [JSON.parse(body)];
  }

  return body
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter((data) => data && data !== "[DONE]")
    .map((data) => JSON.parse(data));
}

async function forward(message) {
  if (message.method === "initialize") {
    protocolVersion = message.params?.protocolVersion ?? "2025-11-25";
    clientCapabilities = message.params?.capabilities ?? {};
    writeMessage({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "2ools MCP proxy", version: "0.3.1" },
      },
    });
    return;
  }

  if (message.method === "notifications/initialized") return;

  const headers = {
    Accept: "application/json, text/event-stream",
    "Content-Type": "application/json",
    "MCP-Protocol-Version": REMOTE_PROTOCOL_VERSION,
    "Mcp-Method": message.method,
  };

  if (typeof message.params?.name === "string") {
    headers["Mcp-Name"] = message.params.name;
  }

  const remoteMessage = {
    ...message,
    params: {
      ...(message.params ?? {}),
      _meta: {
        ...(message.params?._meta ?? {}),
        "io.modelcontextprotocol/protocolVersion": REMOTE_PROTOCOL_VERSION,
        "io.modelcontextprotocol/clientCapabilities": clientCapabilities,
      },
    },
  };

  const response = await fetch(REMOTE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(remoteMessage),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(body || `HTTP ${response.status}`);
  }

  for (const responseMessage of responseMessages(
    body,
    response.headers.get("content-type") ?? "",
  )) {
    writeMessage(responseMessage);
  }
}

const input = createInterface({ input: process.stdin, crlfDelay: Infinity });

input.on("line", (line) => {
  if (!line.trim()) return;

  let message;
  try {
    message = JSON.parse(line);
  } catch {
    process.stderr.write("2ools MCP proxy ignored invalid JSON input.\n");
    return;
  }

  queue = queue.then(() => forward(message)).catch((error) => {
    writeFailure(message, error);
  });
});
