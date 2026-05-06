# Dune API Uses

## Service Summary

Dune is a first-party onchain data warehouse and analytics platform. The assigned MPP service is `https://api.dune.com`, and the assigned API-use surface is narrower than Dune's full native API: it covers only raw SQL execution and execution-result retrieval through the MPP catalog. Dune's MPP docs position this as no-account/no-Dune-key access through HTTP 402 payment credentials, but this compilation used only saved local research artifacts and made no paid calls, query executions, wallet signatures, account registrations, or mutations.

## API Surface

Only one endpoint group exists for this service, and it covers all three assigned MPP endpoints: `POST /api/v1/sql/execute`, `GET /api/v1/execution/:execution_id/results`, and `GET /api/v1/execution/:execution_id/csv`.

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| SQL Execution And Results | 3 | Run arbitrary DuneSQL against Dune's indexed onchain data, then retrieve the asynchronous execution output as JSON rows or CSV for analysis, reporting, monitoring, or downstream data pipelines. | [api-uses/sql-execution-and-results.md](api-uses/sql-execution-and-results.md) |

## Highest-Value Uses

- Wallet activity reconstruction for tax prep, reconciliation, custody review, and personal portfolio audit trails.
- Protocol and DAO KPI monitoring across fees, active wallets, DEX volume, treasury movements, deposits, and event counts.
- Token, DEX, stablecoin, and payment-flow research where custom SQL can answer questions that fixed metrics APIs do not expose.
- Ecosystem and grants analysis that joins project addresses, contracts, activity, retention, volume, and before/after campaign windows.
- Compliance and risk triage that gathers transaction evidence for human review without treating Dune output as a final decision system.
- Notebook, warehouse, BI, and spreadsheet exports where JSON metadata or CSV rows need to feed downstream tools.

## Personal Use Opportunities

- Reconcile one or more wallets across transfers, swaps, bridge activity, and dates before importing rows into accounting, tax, or portfolio tools.
- Investigate token or protocol activity with custom DuneSQL, including largest transfers, wallet cohorts, DEX venues, time windows, and chain splits.
- Export compact CSV slices for spreadsheets or notebooks when the user needs portable evidence rather than a dashboard-only view.

Personal use still requires care: the SQL defines the truth set, row schemas are dynamic, result exports may be usage-priced, and Dune rows are analytical evidence rather than tax, legal, or investment advice.

## Business Use Opportunities

- Automate operating reports for protocol, DAO, foundation, treasury, or growth teams using recurring SQL for onchain KPIs.
- Monitor stablecoin, payment, bridge, and settlement flows by chain, token, wallet, corridor, or merchant/counterparty mapping.
- Support grants, ecosystem, and campaign evaluation by measuring funded-project activity against defined addresses, contracts, and time windows.
- Feed internal data systems with JSON or CSV extracts, while preserving SQL text, execution IDs, timestamps, schema metadata, row counts, and export sizes for auditability.
- Triage compliance or risk cases by collecting onchain evidence fields such as `block_time`, `tx_hash`, chain, token, USD amount, sender, recipient, and matched rule/list identifiers when supplied by the query.

## Endpoint Group Summaries

### SQL Execution And Results

This single group is the full assigned MPP surface for Dune. It submits arbitrary SQL through `POST /api/v1/sql/execute`, receives an asynchronous `execution_id`, and retrieves rows through JSON or CSV result endpoints. The JSON path is strongest for automation because it includes lifecycle state, metadata, pagination, column names/types, row counts, byte counts, timings, and errors; the CSV path is strongest for flat-file export into spreadsheets, notebooks, warehouses, or BI tools. Full endpoint details, field notes, use cases, and open questions are in [api-uses/sql-execution-and-results.md](api-uses/sql-execution-and-results.md).

## Field And Data Themes

- Core inputs: `sql`, optional `performance` engine tier (`small`, `medium`, `large`), `execution_id`, and result-shaping controls such as `columns`, `filters`, `sort_by`, `limit`, `offset`, `sample_count`, and `allow_partial_results`.
- Core outputs: `execution_id`, `state`, `is_execution_finished`, lifecycle timestamps, `expires_at`, `error`, pagination fields, `result.metadata`, dynamic `result.rows`, and CSV text.
- Operational metadata: `column_names`, `column_types`, `row_count`, `total_row_count`, `datapoint_count`, `result_set_bytes`, `total_result_set_bytes`, `execution_time_millis`, and `pending_time_millis`.
- Data model theme: result schemas are not fixed; row keys and types depend on the caller's SQL, selected Dune datasets, table freshness, and projected columns.
