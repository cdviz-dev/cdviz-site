---
title: AI Agents (MCP) Integration
description: |
  Connect Claude Code, Cursor or your own scripts to a CDviz Cloud workspace. The agent
  reads your CI/CD events with read-only SQL, through MCP, UTCP or a REST API.
keywords: "MCP server,Model Context Protocol,AI agent CI/CD,Claude Code MCP,Cursor MCP,UTCP,CI/CD analytics API,CDEvents SQL,CDviz Cloud"
plans:
  - cloud
---

# AI Agents (MCP) Integration

Ask an AI agent about your CI/CD: "Which pipelines were the slowest over the last 30 days?". The agent reads the events of one CDviz Cloud workspace with read-only SQL, through MCP, UTCP or a REST API.

On a self-hosted (Community) install, the events are in your own PostgreSQL. Connect your agent or SQL tool to it with the read-only `cdviz_reader` role (see the [PostgreSQL integration](./postgresql.md)).

## Prerequisites

- A [CDviz Cloud](/cloud) workspace that collects events.
- An MCP client (Claude Code, Cursor, ...), a UTCP client, or a script that can send HTTP requests.

## Create an API Token

1. In the CDviz Cloud app, open **Settings > API**.
2. Enter a name, pick an expiry, and create the token.
3. Copy the token now: CDviz Cloud shows it only once.

Any member of the workspace can create a token. A token is read-only and works for one workspace only.
A member lists and revokes their own tokens; an admin sees and revokes all of them. When a member leaves the workspace, CDviz Cloud deletes their tokens.

The **AI Agents** page (side menu) shows the commands below, already filled in with the URL of your workspace.

## Connect Your Agent

The MCP endpoint of a workspace is:

```text
https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/mcp
```

`<WORKSPACE>` is the workspace slug, shown in **Settings > API**. The server uses the Streamable HTTP transport and is stateless.

### Claude Code

```shell
claude mcp add --transport http cdviz https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/mcp --header "Authorization: Bearer <YOUR_TOKEN>"
```

### Other MCP Clients (Cursor, ...)

```json
{
  "mcpServers": {
    "cdviz": {
      "url": "https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/mcp",
      "headers": { "Authorization": "Bearer <YOUR_TOKEN>" }
    }
  }
}
```

### MCP Tools

| Tool              | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `describe_schema` | Lists the tables and views of the workspace database, with notes     |
| `query`           | Runs one read-only SQL query and returns the rows as JSON (`max_rows`) |

The server sends notes on the data model as MCP instructions, so the agent knows where to look first: `cdviz.executions` (one row per pipeline run, task run, test case run) and `cdviz.cdevents_lake` (every CDEvent, as received).

## Verify It Works

Ask the agent a question about your own data. Sample prompts:

- "Which pipelines were the slowest over the last 30 days? Show the median and p95 duration per pipeline."
- "What is the failure rate per pipeline this month? Which pipelines fail the most, and on which task?"
- "Which version of `<service>` runs in production now, and which version ran before it?"
- "Which test cases are flaky (they pass and fail on the same version) over the last 30 days?"
- "How long do pull requests stay open before merge, per repository, over the last quarter?"

The agent should call `describe_schema`, then `query`. If it gets `401` or `404`, check the token and the workspace slug.

## Use the REST API

Scripts can call the same two tools over plain HTTP. Every request needs the `Authorization: Bearer <YOUR_TOKEN>` header.

| Method | Path                                    | Body                                     |
| ------ | --------------------------------------- | ---------------------------------------- |
| `GET`  | `/api/v1/workspaces/<WORKSPACE>/schema` |                                          |
| `POST` | `/api/v1/workspaces/<WORKSPACE>/query`  | `{"sql": "SELECT ...", "max_rows": 200}` |

```shell
curl -X POST "https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/query" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT outcome, count(*) FROM cdviz.executions WHERE finished_at > now() - interval '\''7 days'\'' GROUP BY outcome"}'
```

The response holds `rows` (one JSON object per row), `row_count`, `truncated` (more rows exist than `max_rows`) and `cu_seconds` (the compute this query used).

## Use UTCP

[UTCP](https://www.utcp.io) clients read a manual that describes the REST endpoints as tools, then call REST directly.

- `https://app.cdviz.dev/utcp`: public discovery manual. The tools take a `workspace` argument.
- `https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/utcp`: manual of one workspace, needs the token.

The call templates send `Authorization: Bearer ${CDVIZ_API_TOKEN}`. UTCP clients prefix variables with the manual name: for a manual named `cdviz`, set `cdviz_CDVIZ_API_TOKEN`.

AI crawlers find these endpoints in `https://app.cdviz.dev/llms.txt`.

## Limits

| Limit              | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| SQL                | One read query per call (`SELECT`, `WITH ... SELECT`, `VALUES`) |
| Timeout            | 15 s per query                                                  |
| Rows               | 200 by default, 2000 at most (`max_rows`)                       |
| Result size        | 4 MiB                                                           |
| Concurrent queries | 2 per workspace                                                 |
| Data retention     | Usually 93 days: filter every query on time                     |

Each query counts against a monthly compute budget of the workspace, shown in **Settings > API**.

| Status | Meaning                                                                 |
| ------ | ----------------------------------------------------------------------- |
| `400`  | The query was rejected or failed: the body holds the database message   |
| `403`  | The workspace is suspended (trial expired or subscription ended)        |
| `429`  | Rate limit, or monthly budget used: retry after the `Retry-After` delay |
| `503`  | The database is busy or waking up: retry in a few seconds               |

## Next Steps

- [Pipeline & Task Runs](../cdviz-grafana/pipeline_runs.md): the dashboard view of the same `cdviz.executions` data.
- [CDEvents](../cdevents.md): what the events in `cdviz.cdevents_lake` contain.
- [CDviz Cloud](/cloud): plans and trial.
