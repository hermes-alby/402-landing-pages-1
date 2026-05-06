# Allium: Explorer SQL Query Runs API Uses

## What This Endpoint Group Does

This endpoint group turns Allium Explorer into an asynchronous SQL execution and export surface. A caller can submit raw SQL through the machine-payments `run-sql` path, or execute a pre-existing saved Explorer query by `query_id`, receive a `run_id`, poll until the run reaches a terminal status, and then fetch structured results.

The value is not just "run a query." The returned `run_id`, status enum, executed `sql`, `data`, `meta.columns`, and `queried_at` timestamp let a caller build repeatable onchain analytics workflows: queue long-running blockchain queries, wait for completion without holding a synchronous request open, export rows as JSON or CSV, and preserve enough metadata to audit what was run and when. This is best suited to custom analytics over Allium's indexed blockchain datasets, not ultra-low-latency application reads.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/explorer/queries/run-async` | Submit raw SQL for asynchronous execution. | JSON body with inferred `sql` string; official request schema was not found. | Undocumented in fetched schema; expected to start an async query run, but response fields were not fetched. |
| POST | `/api/v1/explorer/queries/{query_id}/run-async` | Run a saved Explorer query asynchronously. | Path `query_id`; required `parameters` object for saved-query placeholders; optional `run_config.limit`; optional `run_config.compute_profile`. | `run_id` for polling and result retrieval. |
| GET | `/api/v1/explorer/query-runs/{run_id}/status` | Poll execution state for a query run. | Path `run_id`. | `QueryRunStatus`: `created`, `queued`, `running`, `success`, `failed`, or `canceled`. |
| GET | `/api/v1/explorer/query-runs/{run_id}/results` | Fetch results for a completed query run. | Path `run_id`; optional `f` response format: `json`, `json_file`, or `csv`. | `sql`, `data`, `meta.columns`, and `queried_at`. |

## Field Notes

### Inputs

The raw SQL endpoint centers on an inferred `sql` string, but the inventory could not fetch an official OpenAPI request or response schema for it. That makes it useful for exploratory accountless machine-payment access, but harder to integrate safely without a trial run or a separately documented SQL contract.

The saved-query run endpoint is more structured. It accepts a saved `query_id`, a required `parameters` object whose string values substitute into placeholders in the saved query, and optional `run_config` values. `run_config.limit` caps returned rows, with a documented maximum of 250,000 rows per query run unless Allium increases it on request. `run_config.compute_profile` selects the compute profile identifier when the caller has one configured.

Status and results calls use the `run_id` produced by query execution. Results also accept `f`, which lets a caller choose `json`, `json_file`, or `csv` output depending on whether the downstream consumer is an application, a data pipeline, or a spreadsheet/warehouse import.

### Outputs

The saved-query run endpoint returns a `run_id`, which is the durable handle for the rest of the lifecycle. The status endpoint returns a compact lifecycle enum, allowing callers to distinguish queue wait, active execution, success, failure, and cancellation before paying for or attempting result retrieval.

The results endpoint returns the executed `sql`, row `data`, `meta.columns`, and `queried_at`. The `meta.columns` entries include column names and data types, which is valuable for validating exports, mapping columns into warehouses, and detecting breaking changes in saved-query outputs. The `queried_at` timestamp helps consumers reason about data freshness and reproduce reports.

### Important Constraints Or Gaps

No paid endpoints were called for this artifact. All observations come from local source snapshots and OpenAPI/docs artifacts.

The raw SQL machine-payments endpoint is listed as machine-payments auth, but no official request or response schema was found in the fetched docs or OpenAPI files. Treat its `sql` input and any expected response shape as underdocumented until verified in a paid or authorized integration.

The saved-query `run`, `status`, and `results` endpoints are listed in the machine-payments pricing table, but Allium's own pricing docs and OpenAPI security mark them as API-key authenticated. This means the full saved-query lifecycle may require an Allium account/API key even though the endpoints appear in the MPP catalog.

Pricing is not uniform. Raw SQL submission, saved-query run, and status are listed at $0.01 per request. Results are listed as dynamic, with the inventory carrying a `$0.01 - $2.00` hint, so callers should avoid blind result polling/export loops and should cap query size before fetching.

Explorer is an OLAP analytics product. The product comparison snapshot describes Explorer freshness around 1 hour, while realtime APIs are the right surface for low-latency app reads. Explorer exports are capped at 250,000 rows per run unless increased on request.

Machine-payment calls require wallet-funded USDC and 402 payment handling through Tempo MPP or x402. The published supported payment networks are Tempo mainnet USDC, x402 on Base mainnet USDC, and x402 on Solana mainnet USDC. The pricing docs only specify rate-limit buckets for `/developer/` and `/docs/` endpoints, so Explorer-specific rate limits remain unclear from the inspected sources.

SQL results can expose public onchain activity at scale. Teams using these endpoints for compliance, marketing, credit, fraud, or user profiling should review privacy, sanctions, attribution, and terms-of-use obligations before operationalizing derived decisions.

## Use Cases

### Personal Onchain Research Notebook

A power user or independent analyst can submit raw SQL or run a saved Explorer query to answer one-off questions such as "which wallets interacted with this contract before a token launch" or "what were the largest stablecoin flows for this address cluster." The async model is useful because blockchain analytics queries can be heavy: submit the job, poll for `success`, and export JSON or CSV when it is ready.

The main caveat is integration confidence. Raw SQL has no fetched official schema, and results retrieval for saved runs is documented as API-key authenticated and dynamically priced. A careful personal workflow would keep row limits low, inspect `meta.columns`, store the returned `sql` and `queried_at`, and avoid using Explorer when minute-by-minute freshness is required.

### Scheduled Protocol And Market Dashboards

A protocol, fund, or analytics team can maintain saved Explorer queries for recurring metrics: daily active wallets, bridge inflows, DEX volume, stablecoin supply movement, NFT collection activity, or cohort retention. Each dashboard refresh can call the saved-query run endpoint with date/window parameters, poll status, then fetch typed result rows for the BI layer.

This is a good fit when the value comes from flexible SQL over Allium's broader indexed datasets rather than a fixed realtime endpoint. The saved-query model also supports change control: analysts can update the underlying Explorer query while applications keep passing parameters. Production use needs an API key, cost controls around dynamic result export, and awareness that Explorer freshness is closer to analytics latency than realtime app latency.

### Compliance And Investigation Work Queues

Risk and compliance teams can encode repeatable investigations as saved parameterized queries, then run them for a wallet address, contract, bridge transaction, or token. Status polling makes it possible to queue many checks and only fetch results after completion. The returned `data` and `meta.columns` can feed case-management systems, while `sql` and `queried_at` provide audit context for what evidence was generated.

This use case needs extra review before acting on outputs. Onchain data may be incomplete without external attribution, and SQL bugs or schema assumptions can create false positives. Teams should preserve query versions, row limits, result metadata, and source timestamps, and they should treat Allium output as one input to a documented investigation process rather than an automatic enforcement decision.

### Agent-Driven Data Pulls For Decision Support

An AI agent can use the raw SQL machine-payments endpoint for occasional paid analytics pulls without provisioning a standard realtime API key, assuming it has a funded wallet and a 402-capable client. That enables lightweight workflows such as "run a custom query before drafting a market memo" or "fetch recent contract activity before suggesting an operational action."

The endpoint group is only partially accountless, however. The raw SQL run path is machine-payments-authenticated, but the documented status and results endpoints require API key authentication. Because result fetching is dynamic-cost and raw SQL response shape is undocumented, autonomous agents should require explicit budgets, query size limits, and allowlisted SQL templates before spending.

### Investor, Tax, And Audit Exports

Individuals, family offices, accounting teams, or auditors can use saved queries to produce repeatable exports for holdings analysis, transaction categorization, realized activity, or entity-level reporting across wallets and chains. CSV and JSON result formats make the output portable into spreadsheets, notebooks, tax tooling, and internal warehouses.

The returned `queried_at` and executed `sql` are especially valuable for audit trails because they show when the export was generated and what logic produced it. The constraints are material: row exports are capped by default at 250,000 rows, Explorer is not realtime, results pricing is dynamic, and tax/compliance interpretations should not rely solely on raw query rows without reconciliation and professional review.

### Data Quality And Schema Regression Checks

Engineering teams can run small saved queries as smoke tests against Allium's Explorer datasets, then use `meta.columns` and sample `data` rows to detect unexpected column, data type, or freshness changes before publishing downstream dashboards. Status polling gives CI or scheduled jobs a clean async control loop instead of a fragile long-lived request.

This is most reliable for known saved queries with API-key access. It is less reliable as a general schema-discovery mechanism because the raw SQL endpoint lacks a fetched schema and `meta.columns` arrives only after a completed result fetch. Teams should keep tests small, use explicit limits, and alert on both query failure statuses and incompatible result metadata.
