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

Ask an AI agent "Which pipelines were the slowest over the last 30 days?" and get the answer from your own CI/CD events.
The agent reads one CDviz Cloud workspace with read-only SQL.

> [!TIP] Self-hosted
> On a Community install, the events are in your own PostgreSQL. Connect your agent to it with the read-only `cdviz_reader` role. See the [PostgreSQL integration](/docs/integrations/postgresql).

## Prerequisites

- A [CDviz Cloud](/cloud) workspace that collects events.
- One of these clients:
  - an MCP ([Model Context Protocol](https://modelcontextprotocol.io)) client: Claude Code, Cursor, or another one;
  - a UTCP ([Universal Tool Calling Protocol](https://www.utcp.io)) client;
  - a script that sends HTTP requests.

## Create an API Token

1. In the CDviz Cloud app, open **Settings > API**.
2. Enter a name, pick an expiry, and create the token.
3. Copy the token now. CDviz Cloud shows it only once.

A token is read-only and works for one workspace only. Any member of the workspace can create one.

| Who      | Can list and revoke |
| -------- | ------------------- |
| A member | Their own tokens    |
| An admin | All tokens          |

When a member leaves the workspace, CDviz Cloud deletes their tokens.

## Connect Your Agent

<!-- TODO: run the commands of this page against app.cdviz.dev with a real token before merge. -->

The **AI Agents** page of the app (side menu) shows these commands with your workspace URL already in place.

The MCP endpoint of a workspace is:

```text
https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/mcp
```

`<WORKSPACE>` is the workspace slug. Find it in **Settings > API**.
The server uses the Streamable HTTP transport and keeps no session state.

### Claude Code

```shell
claude mcp add --transport http cdviz https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/mcp --header "Authorization: Bearer <YOUR_TOKEN>"
```

### Other MCP Clients

Cursor and most other MCP clients read this JSON configuration:

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

| Tool              | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `describe_schema` | Lists the tables and views of the workspace database, and notes |
| `query`           | Runs one read-only SQL query and returns the rows as JSON       |

The server also sends notes on the data model to the agent. They point to two tables first:

| Table                 | Content                                             |
| --------------------- | --------------------------------------------------- |
| `cdviz.executions`    | One row per pipeline run, task run or test case run |
| `cdviz.cdevents_lake` | Every CDEvent, as received                          |

## Verify It Works

Ask the agent a question about your data. Sample prompts:

- "Which pipelines were the slowest over the last 30 days? Show the median and p95 duration per pipeline."
- "What is the failure rate per pipeline this month? Which pipelines fail the most, and on which task?"
- "Which version of `<service>` runs in production now, and which version ran before it?"
- "Which test cases are flaky (they pass and fail on the same version) over the last 30 days?"
- "How long do pull requests stay open before merge, per repository, over the last quarter?"

The agent calls `describe_schema` first, then `query`.

| Error | Cause                                       |
| ----- | ------------------------------------------- |
| `401` | The token is missing, wrong, or expired     |
| `404` | The workspace slug does not match the token |

## Use the REST API

Scripts call the same two tools over HTTP. Send the `Authorization: Bearer <YOUR_TOKEN>` header with every request.

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

The response has these fields:

| Field        | Content                                     |
| ------------ | ------------------------------------------- |
| `rows`       | One JSON object per row                     |
| `row_count`  | Number of rows returned                     |
| `truncated`  | `true` when more rows exist than `max_rows` |
| `cu_seconds` | Compute used by this query                  |

## Use UTCP

A UTCP client reads a manual that describes the REST endpoints as tools. Then it calls the REST API directly.

| Manual                                                     | Access                                        |
| ---------------------------------------------------------- | --------------------------------------------- |
| `https://app.cdviz.dev/utcp`                               | Public. The tools take a `workspace` argument |
| `https://app.cdviz.dev/api/v1/workspaces/<WORKSPACE>/utcp` | Needs the token                               |

The manual sends `Authorization: Bearer ${CDVIZ_API_TOKEN}`.
UTCP clients add the manual name as a prefix to variables. For a manual named `cdviz`, set `cdviz_CDVIZ_API_TOKEN`.

The file `https://app.cdviz.dev/llms.txt` lists the same endpoints for AI crawlers.

## Limits

| Limit              | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| SQL                | One read query per call (`SELECT`, `WITH ... SELECT`, `VALUES`) |
| Timeout            | 15 s per query                                                  |
| Rows               | 200 by default, 2000 at most (`max_rows`)                       |
| Result size        | 4 MiB                                                           |
| Concurrent queries | 2 per workspace                                                 |
| Data retention     | 93 days in most workspaces. Filter every query on time          |

Each query uses part of the monthly compute budget of the workspace. **Settings > API** shows the budget.

| Status | Cause                                                    | What to do                       |
| ------ | -------------------------------------------------------- | -------------------------------- |
| `400`  | The query was rejected or failed                         | Read the database message        |
| `403`  | The workspace is suspended (trial expired or plan ended) | Renew the plan                   |
| `429`  | Too many requests, or the monthly budget is used         | Wait for the `Retry-After` delay |
| `503`  | The database is busy or starting                         | Retry in a few seconds           |

## Next Steps

- [Pipeline & Task Runs](/docs/cdviz-grafana/pipeline_runs): the dashboard view of `cdviz.executions`.
- [CDEvents](/docs/cdevents): the content of the events in `cdviz.cdevents_lake`.
