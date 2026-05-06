# Dune: SQL Execution And Results API Uses

## What This Endpoint Group Does

This endpoint group lets a caller submit arbitrary DuneSQL against Dune's onchain data warehouse, receive an asynchronous `execution_id`, and retrieve the resulting rows either as JSON or CSV. It is useful when the caller needs a custom onchain analysis without first creating a saved Dune query: wallet activity reconstruction, protocol KPI checks, token flow research, stablecoin monitoring, grants analysis, compliance triage, or export into a notebook or BI job.

The core value comes from combining caller-supplied SQL with result lifecycle and metadata fields. `POST /api/v1/sql/execute` accepts the SQL and an optional `performance` tier, then returns `execution_id` and initial `state`. The result endpoints use that `execution_id` plus selection controls such as `columns`, `filters`, `sort_by`, `limit`, `offset`, `sample_count`, and `allow_partial_results`. JSON results include dynamic `result.rows`, `result.metadata.column_names`, `result.metadata.column_types`, row and byte counts, execution timing, pagination links, lifecycle timestamps, and errors. CSV results provide the same query output in a portable text format for downstream tools.

This is not a fixed metrics API. The row schema is dynamic and depends entirely on the SQL, selected Dune tables, and returned columns. Strong use requires knowing the relevant Dune datasets, writing efficient DuneSQL, keeping result size bounded, and treating MPP pricing/source metadata as dynamic.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/sql/execute` | Submit raw DuneSQL for asynchronous execution. | JSON body with required `sql`; optional `performance` engine tier: `small`, `medium`, or `large`. Native docs require `X-Dune-Api-Key` or `api_key`; MPP docs say MPP uses 402 payment credentials instead. | `execution_id`; initial `state`, for example `QUERY_STATE_PENDING`; errors including 402/payment and request failures. |
| GET | `/api/v1/execution/:execution_id/results` | Retrieve execution status, metadata, and JSON rows for a submitted execution. | Path `execution_id`; optional `allow_partial_results`, `columns`, `filters`, `ignore_max_credits_per_request`, `limit`, `offset`, `sample_count`, and `sort_by`. | `execution_id`, `query_id`, `state`, `is_execution_finished`, lifecycle timestamps, `expires_at`, `error`, `next_offset`, `next_uri`, `result.metadata`, `result.rows`, and `result.update_type`. |
| GET | `/api/v1/execution/:execution_id/csv` | Download execution results as CSV text. MPP docs/feed list this path; native docs/OpenAPI list `/api/v1/execution/{execution_id}/results/csv`. | Path `execution_id`; same result-selection query fields as JSON results. | CSV text whose columns and row values depend on the SQL; error text on failures; CSV pagination headers are documented separately as `X-Dune-Next-Offset` and `X-Dune-Next-Uri`. |

## Field Notes

### Inputs

`sql` is the decisive input. It determines which chains, tables, contracts, wallets, tokens, labels, time windows, aggregations, and output columns will exist in the returned rows. Because this endpoint runs arbitrary SQL rather than a saved query, callers should treat the SQL text as a versioned analytical artifact and keep it small enough to avoid unnecessary compute cost.

`performance` selects the engine tier for execution. The docs expose `small`, `medium`, and `large`; higher tiers can help heavy analytical queries but affect credit consumption. This matters for workflows that scan large DEX, transfer, trace, or decoded event tables.

The result endpoints require an `execution_id`, usually from the SQL execution response. They can shape output after execution with `columns`, `filters`, `sort_by`, `limit`, `offset`, and `sample_count`. `columns` can reduce transferred data and cost by selecting only fields needed by a workflow. `filters` applies SQL-like server-side row filtering, `sort_by` mirrors `ORDER BY`, and `limit` plus `offset` supports pagination. `sample_count` returns a randomized sample and is for exploratory or visualization-sized reads rather than exact reconciliation.

Auth differs by access mode. Native API docs include `X-Dune-Api-Key` and optional `api_key` with at least Read scope. Dune's MPP docs say MPP access uses the HTTP 402 payment flow with signed Tempo payment-channel vouchers and no Dune API key, user account, or credit card. This artifact did not perform paid calls, wallet signing, account creation, query execution, or API-key creation.

### Outputs

`execution_id` is the handle for the asynchronous workflow. `state` and `is_execution_finished` indicate whether a result is ready or terminal. Result bodies also include `submitted_at`, `execution_started_at`, `execution_ended_at`, `cancelled_at`, and `expires_at`, which are useful for audit trails, queue monitoring, freshness checks, and knowing when a saved result will no longer be available.

`result.rows` is an array of dynamic dictionaries. The keys and value types come from the SQL projection and any `columns` parameter, so consumers should validate against `result.metadata.column_names` and `result.metadata.column_types` before loading rows into typed downstream systems. `query_id` is not a durable saved-query ID for arbitrary SQL; the execute-SQL docs say unsaved arbitrary queries use `query_id` value `0`.

`result.metadata` makes result handling operationally useful. `row_count` and `total_row_count` show page size versus total rows. `result_set_bytes` and `total_result_set_bytes` help estimate export size and cost. `datapoint_count` tracks result cell count for billing/cost awareness. `execution_time_millis` and `pending_time_millis` show whether delays came from compute or queueing. `next_offset` and `next_uri` guide JSON pagination; CSV pagination uses documented response headers rather than JSON body fields.

CSV output is valuable when the next step is a spreadsheet, warehouse load, notebook, reconciliation script, or BI import. The tradeoff is that CSV lacks the JSON body's status and metadata fields, and the CSV path has source drift between the MPP docs/feed and native docs/OpenAPI.

### Important Constraints Or Gaps

- Results are asynchronous. The execute call returns an `execution_id` and initial `state`; callers must wait for completion before treating rows as final.
- The MPP docs show polling `GET /api/v1/execution/{execution_id}/status`, but the local MPP manifest for this service lists only SQL execute, JSON results, and CSV results. The status endpoint is therefore a documented workflow step but not present in the assigned manifest.
- Result schemas are dynamic. `result.rows` keys and types depend on caller SQL, Dune table schemas, and requested columns.
- Results data from an execution is stored for 90 days. The JSON response exposes `expires_at`; the CSV docs state the expiration timestamp is not visible on the CSV endpoint.
- Dune documents a maximum query result size of 32 GB. Larger results are truncated in storage; retrieving them without `allow_partial_results=true` returns a partial-result error, while enabling partial results means the caller is accepting truncated data.
- `sample_count` is incompatible with `offset`, `limit`, and `filters`. `filters` is incompatible with `sample_count`. Sampling is randomized and may return a slightly different row count or even zero rows for very low sample probabilities.
- Pagination is explicit. JSON responses use `next_offset` and `next_uri`; CSV responses use `X-Dune-Next-Offset` and `X-Dune-Next-Uri` headers documented in pagination docs but not described in the OpenAPI CSV operation.
- Filtering has a restricted SQL-like syntax. Relative expressions such as `now() - interval '1' day` are not allowed in result filters; callers should compute date values client-side or put time logic in the original SQL.
- Pricing metadata drifts across sources. The local MPP feed has dynamic amount hints of `$0.05-$4` for SQL execution and `$0.05-$10` for result retrieval, while OpenAPI `x-payment-info` says SQL execution reserves `$5.00` with actual cost based on compute and result retrieval is `$1.00 per MB of result data`. Native billing docs also describe compute credits, export credits, and charges for failed executions.
- Native API rate limits are plan-dependent and split between low-limit write-heavy and high-limit read-heavy endpoints, plus a 1000 rps per-IP limit. It is unclear whether no-account MPP sessions map to the same plan buckets.
- The CSV path drifts. MPP docs and the local MPP feed list `/v1/execution/:execution_id/csv`; detailed native endpoint docs and OpenAPI list `/v1/execution/{execution_id}/results/csv`.
- The endpoints can expose public onchain activity at scale. Compliance, tax, credit, sanctions, marketing, or user-profiling workflows need independent policy, attribution, and legal review before automated decisions.

## Use Cases

### Wallet Tax And Reconciliation Checks

An individual, accountant, fund operator, or treasury analyst can run SQL that reconstructs wallet activity across token transfers, DEX trades, bridges, and chain-specific transaction tables for a defined set of addresses and dates. The important inputs are the SQL itself, wallet and date filters embedded in SQL or passed as result `filters`, selected `columns` such as `block_time`, `blockchain`, `tx_hash`, `token_symbol`, `amount`, `amount_usd`, and `counterparty`, and `limit`/`offset` for complete page-by-page extraction.

The returned JSON rows or CSV can be reconciled against exchange records, internal ledgers, tax lots, or custody statements. `column_names`, `column_types`, `row_count`, `total_row_count`, and `next_uri` help verify that an export is complete and shaped consistently before import. This use case depends on knowing the relevant Dune tables and writing SQL that captures the user's actual accounting treatment; Dune rows are evidence for reconciliation, not a finished tax opinion.

### Protocol KPI And Treasury Monitoring

A protocol or DAO can encode daily or weekly SQL checks for metrics such as active wallets, protocol fees, DEX volume, stablecoin inflows, treasury movements, bridge deposits, or smart-contract event counts. `performance` matters when queries scan large historical windows, while `sort_by`, `columns`, and pagination keep the returned result focused on the metrics and periods the team needs.

The returned rows can update operating reports, compare internal dashboards to independent onchain calculations, or flag unexpected changes before governance, liquidity, or treasury decisions. Metadata fields such as `execution_time_millis`, `pending_time_millis`, `total_row_count`, and `total_result_set_bytes` also help an analyst detect when a previously cheap KPI query is becoming too expensive or broad.

### Token, DEX, And Trading Research

A trading researcher or market analyst can submit DuneSQL over DEX trades, token transfers, prices, liquidity pools, and wallet clusters to study volume, routing, slippage proxies, whale activity, or chain-by-chain token adoption. The useful result controls are `filters` for time and asset subsets, `sort_by` for largest trades or newest transfers, `columns` for narrow extracts, and `sample_count` for exploratory views over large result sets where exact completeness is not required.

The output helps decide what to investigate next: whether a volume spike is concentrated in one venue, whether a token's activity is organic or dominated by a few addresses, or whether stable liquidity exists across chains. The endpoint group does not provide trading execution or guaranteed realtime data; it provides analytical rows whose quality depends on the SQL, table coverage, and Dune's indexed data freshness.

### Stablecoin And Payment Flow Monitoring

A payments company, stablecoin issuer, DAO treasury, or merchant finance team can query token transfer and DEX/bridge data to monitor settlement flows, inflows and outflows by wallet, chain distribution, large payment movements, or adoption by known counterparties. The SQL can produce compact aggregates by day, chain, token, wallet, merchant, or corridor, and the result endpoints can export those aggregates as JSON for services or CSV for finance review.

The valuable fields are the returned row values plus `total_row_count`, `total_result_set_bytes`, and pagination links, because flow monitoring often involves many small transfers and can otherwise become an oversized export. This workflow requires reliable address lists, token contract mappings, and efficient SQL; if a query crosses the 32 GB result limit, `allow_partial_results=true` should be treated as an explicit acceptance of incomplete monitoring data.

### Ecosystem And Grants Analysis

An L1, L2, appchain, foundation, or grants team can use the group to evaluate whether funded projects or ecosystem campaigns created measurable onchain activity. SQL can join known grantee addresses, contracts, deployment events, transactions, user cohorts, DEX volume, and bridge activity before and after a grant or launch. Result rows might include project, chain, period, active wallets, transactions, fees, volume, retention, or contract interactions.

Those rows can support renewal decisions, milestone checks, retroactive public-goods analysis, and ecosystem benchmarking. `expires_at` and execution timestamps help preserve when the evidence was generated, while CSV export makes the result easy to attach to grant-review packets. The prerequisite is strong attribution: Dune can return onchain facts, but the team must maintain the address, contract, and project mappings used by the SQL.

### Compliance And Risk Triage

A compliance analyst can run SQL to gather transactions, counterparties, token movements, bridge hops, contract interactions, or exposure summaries for a wallet or contract under review. `columns` can limit output to evidence fields such as `block_time`, `tx_hash`, chain, token, USD amount, sender, recipient, and matched rule or list identifiers if the SQL joins to caller-supplied or Dune-available reference tables.

The returned rows can prioritize cases, populate an investigation work queue, or support a human review memo. `error.message` and syntax metadata help debug triage queries without silently dropping bad checks. This use case should not be automated into final enforcement decisions from Dune output alone: attribution, sanctions status, ownership, intent, and false-positive handling require external evidence and documented policy.

### Downstream Notebook, Warehouse, And BI Export

A data engineer or analyst can use SQL execution as an ad hoc extract job, then page through JSON results or pull CSV for loading into Pandas, DuckDB, a warehouse staging table, or a BI tool. JSON is better when the consumer needs metadata and pagination fields; CSV is better when the consumer expects flat files and can manage pagination headers.

The key value is controlled portability. `column_names`, `column_types`, `row_count`, `total_row_count`, byte counts, and `next_uri` let the pipeline validate schema, completeness, and export size before downstream load. The pipeline should store the SQL text, `execution_id`, timestamps, and source snapshot version because result rows expire, row schemas can change when SQL or Dune tables change, and MPP price hints may drift.
