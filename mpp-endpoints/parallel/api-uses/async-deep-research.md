# Parallel: Async Deep Research API Uses

## What This Endpoint Group Does

This group covers `POST /api/task`, the MPP wrapper for Parallel Task. It launches an asynchronous web research or enrichment run and returns a persistent `run_id`. The documented workflow is create a paid task, save the run ID, then poll the free `GET /api/task/{run_id}` support endpoint until the run completes.

Compared with Search or Extract, this group is for multi-hop work where the system plans retrieval and synthesis rather than returning immediate snippets.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/task` | Launch an asynchronous paid research task. | `input` or `query`, `processor`, and provider fields such as `metadata`, `source_policy`, `advanced_settings`, `task_spec`, `previous_interaction_id`, `enable_events`, and `webhook` if passed through. | `run_id`, possibly `interaction_id`, `status`, `is_active`, `processor`, `created_at`, `modified_at`; final output is retrieved later through the free polling support endpoint. |

## Field Notes

### Inputs

The MPP gateway documents `input + processor`, or `query + processor`. It lists `ultra` at `$0.30` and `pro` at `$0.10`. The provider OpenAPI requires `processor` and `input`, where `input` can be text or JSON. Direct provider docs include richer task fields such as `task_spec` for structured output, `source_policy`, `previous_interaction_id`, events, MCP servers, and webhooks, but wrapper passthrough is not confirmed.

### Outputs

The gateway schema says the task endpoint returns a `run_id`. Provider task creation returns a `TaskRun` object with `run_id`, `interaction_id`, `status`, `is_active`, `processor`, metadata, and timestamps. The provider result endpoint returns `run` plus `output`, where output can include `basis`, `type`, and `content`. For the MPP wrapper, the exact polling response shape is not documented as OpenAPI.

### Important Constraints Or Gaps

Task creation is paid and asynchronous. The docs say it can take 1-5+ minutes through the MPP gateway, while direct provider processor latency ranges can be longer depending on tier. The gateway docs advise exponential backoff when polling and note that polling is free.

Payment finality matters more for Task than Search because the per-run wrapper price is higher. Validate `input` and `processor` before paying. Also be careful with webhooks: using a webhook would cause an external callback, and this research did not test or invoke any mutation or paid task.

## Use Cases

### Deep Company Or Market Briefs

A person can ask for a multi-source brief on a company, industry, or product category when Search snippets are not enough. `input` carries the question, `processor` controls cost and depth, and `run_id` lets the person come back later instead of waiting synchronously.

A business can use the same flow for market-entry memos, investment screening, customer research, or board-prep summaries. The final output can inform whether to take a meeting, investigate a market, or assign an analyst. Because outputs are AI-generated, high-value decisions should preserve the run ID, source basis where returned, and human review.

### Structured Research Enrichment

A person can ask a task to enrich a small structured input, such as a company name plus domain, with public information like product category, recent news, or competitive positioning. If `task_spec` passthrough works, outputs could be shaped as JSON for personal spreadsheets or knowledge bases.

Businesses can use this for lead qualification, vendor review, portfolio monitoring, or account planning. The valuable fields are `input`, `processor`, `metadata`, `run_id`, and final `output.content`. The gap is important: the MPP wrapper does not explicitly document `task_spec` passthrough, so production structured enrichment should verify that before relying on schema-shaped output.

### Research Queue For Human Analysts

A person can launch a task for a complex question, save the `run_id`, and continue other work while the task runs. Polling lets them retrieve the result later without paying again.

Teams can build a research queue where requests are paid one at a time through MPP and tracked by `run_id`, `status`, and timestamps. A coordinator can retry failed work, notify reviewers when status becomes completed, and attach the final output to tickets or CRM records. Missing or uncertain response fields from the wrapper mean the queue should store the original request and not depend solely on provider metadata.

### Multi-Hop Procurement And Vendor Risk Checks

A person selecting a tool or service can ask for a synthesized comparison of pricing, limits, terms, support, and recent incidents. The endpoint is useful because the task can gather and reconcile multiple public sources.

A business procurement or security team can use Task for first-pass vendor risk checks before asking humans to review. `processor` selection determines spend and depth; `source_policy` would be valuable for preferring official domains if the wrapper supports it. The final output should not be treated as legal, security, or financial advice without expert review.

### Decision Support For Time-Sensitive Research

A person can use Task when they need a concise answer to a current-events or travel-like question but want the system to do more than return links. The async workflow fits questions where waiting a few minutes is acceptable.

Businesses can use it for operational research such as assessing regulatory changes, supply-chain disruptions, or customer-impacting news. The result can trigger actions like open a ticket, request legal review, or brief leadership. Freshness and source coverage remain uncertain unless the returned basis and citations are inspected.
