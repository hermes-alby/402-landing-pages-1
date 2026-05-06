# Allium API Uses

## Service Summary

Allium is a blockchain data provider focused on onchain finance data. Its payment-enabled surface at `https://agents.allium.so` exposes 15 useful data endpoints through machine payments: token pricing, token discovery and metadata, wallet balances/activity/PnL, and asynchronous Explorer query runs.

The highest-value opportunity is not a single endpoint. It is the ability to stitch token identity, USD pricing, wallet state, transaction activity, and custom SQL analytics into lightweight portfolio, accounting, risk, research, and agentic decision-support workflows without first negotiating a full direct API subscription. Realtime `/developer/` endpoints are the strongest fit for product and agent reads; Explorer query runs are better suited to custom analytics and scheduled reporting.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Token Pricing | 4 | Current, point-in-time, historical, and statistical USD token prices for valuation, charts, alerts, tax records, and market monitoring. | [api-uses/token-pricing.md](api-uses/token-pricing.md) |
| Token Discovery And Metadata | 3 | Search, list, and resolve supported token identities before spending on pricing, wallet, PnL, or risk workflows. | [api-uses/token-discovery-and-metadata.md](api-uses/token-discovery-and-metadata.md) |
| Wallet Portfolio And Activity | 4 | Current balances, historical balances, enriched transactions, and current PnL for portfolio, support, tax, accounting, and compliance triage. | [api-uses/wallet-portfolio-and-activity.md](api-uses/wallet-portfolio-and-activity.md) |
| Explorer SQL Query Runs | 4 | Async raw SQL or saved-query runs, status polling, and result exports for custom analytics, dashboards, investigations, and audits. | [api-uses/explorer-sql-query-runs.md](api-uses/explorer-sql-query-runs.md) |

## Highest-Value Uses

1. Multi-chain portfolio intelligence: resolve tokens, fetch wallet balances, value them with current prices, and add PnL to show what a wallet holds and whether positions are up or down.

2. Transaction-time valuation and accounting support: combine wallet transactions with point-in-time prices and historical balances to produce defensible records for tax prep, bookkeeping, treasury close, and audit review.

3. Wallet activity and support diagnostics: use enriched transaction rows, fees, asset transfers, activities, labels, and transaction-hash filters to explain what happened in a wallet without running a custom indexer.

4. Token and wallet risk triage: use liquidity, holder count, token creation time, price changes, balances, counterparties, bridges, approvals, and labels as signals for intake review, suspicious-activity routing, or collateral/exposure checks.

5. Scheduled analytics and research exports: use Explorer query runs for repeatable protocol, market, compliance, investor, DAO, or fund reports where custom SQL is more valuable than a fixed realtime endpoint.

6. Agentic preflight checks: let an AI agent spend a small amount on read-only data before recommending or taking a separately approved action, such as checking whether a wallet already has the required asset, whether a recent transfer occurred, or whether a token identity is ambiguous.

## Personal Use Opportunities

- Portfolio dashboards that show current holdings, USD values, per-token PnL, and recent wallet activity across supported chains.
- Tax and personal record exports that price swaps or transfers at transaction time and preserve both requested and returned price timestamps.
- Token watchlists and alerts based on latest price, OHLC history, 1-hour and 24-hour high/low ranges, and percent changes.
- Safer token selection in wallets or spreadsheets by searching names/symbols, inspecting chain/address/decimals, and checking liquidity or volume before valuing an asset.
- Personal onchain research notebooks that run small Explorer SQL jobs and export JSON or CSV with `sql`, `meta.columns`, and `queried_at` for reproducibility.
- Pre-action wallet checks for users or agents, such as confirming available balances, reviewing recent transactions, or estimating gain/loss before a user-approved trade or transfer.

## Business Use Opportunities

- Wallet, portfolio, and custody products can use Allium as an accountless paid data layer for token pickers, balance views, activity feeds, PnL views, and support lookups.
- Treasury and accounting teams can reconcile onchain wallets using current balances, historical balance snapshots, transaction hashes, fees, raw balances, USD prices, and PnL summaries.
- Exchanges, payment products, and fintech data teams can maintain internal asset catalogs by resolving chain/address metadata, decimals, token standards, logo URLs, liquidity, volume, FDV, and holder signals.
- Risk and compliance teams can enrich wallet or token reviews with balances, transactions, labels, counterparties, bridge/DEX activity, token liquidity, and custom Explorer investigation queries.
- Protocols, DAOs, funds, and analyst teams can schedule saved Explorer queries for dashboards covering usage, flows, cohorts, liquidity, stablecoin movement, or treasury reporting.
- AI-agent products can route low-friction paid reads through machine payments while applying explicit budgets, caching, allowlists, and human approval for any signing, mutation, or asset movement.

## Endpoint Group Summaries

### Token Pricing

Four endpoints fetch latest prices, prices at a timestamp, historical OHLC candles, and recent price statistics for token-chain pairs. This group is the valuation layer: it turns token balances, transaction timestamps, and watchlists into USD marks, charts, alerts, and reporting inputs. Batch limits and retention windows make it practical for dashboards and records, but applications should expose stale or missing prices clearly for illiquid tokens. Full details: [api-uses/token-pricing.md](api-uses/token-pricing.md).

### Token Discovery And Metadata

Three endpoints search tokens by name/symbol, list supported tokens, and resolve known chain/address pairs into canonical metadata. This group is the routing layer before downstream spend: it reduces wrong-token selection, validates contract records, and supplies decimals, token standards, names, symbols, price, liquidity, volume, FDV, holder count, token creation time, and per-item not-found errors. Full details: [api-uses/token-discovery-and-metadata.md](api-uses/token-discovery-and-metadata.md).

### Wallet Portfolio And Activity

Four endpoints return current balances, historical balances, enriched wallet transactions, and current PnL. This group is the strongest product surface for both personal and business workflows because it can answer what a wallet holds, what changed, what it cost, and what it may be worth now. The most valuable implementations join balances, transaction rows, token metadata, price timestamps, and PnL totals into a wallet timeline. Full details: [api-uses/wallet-portfolio-and-activity.md](api-uses/wallet-portfolio-and-activity.md).

### Explorer SQL Query Runs

Four endpoints cover asynchronous query submission or saved-query execution, status polling, and result retrieval. This group is best for custom analytics that fixed realtime endpoints cannot answer: recurring dashboards, investigation queues, audit exports, investor reports, and data-quality checks. Its value depends on careful query limits, result-cost controls, and API-key planning for saved-query status/results workflows. Full details: [api-uses/explorer-sql-query-runs.md](api-uses/explorer-sql-query-runs.md).

## Field And Data Themes

- Core identifiers are lowercase `chain`, token contract `address` or `token_address`, wallet `address`, transaction `hash`, and Explorer `run_id`.
- Time is central: price endpoints use UTC request timestamps, `time_granularity`, `input_timestamp`, `price_timestamp`, and candle timestamps; wallet endpoints use `block_timestamp`; Explorer results include `queried_at`.
- Money and quantity fields include USD `price`, OHLC values, liquidity, volume, raw balances, fees, `total_balance`, realized PnL, unrealized PnL, and PnL ratio change.
- Metadata fields are useful for user-facing and control workflows: token name/symbol/decimals/type/logo, market attributes, transaction activities, labels, asset transfers, and Explorer `meta.columns`.
- Pagination and batching matter. Pricing and token resolution support bulk inputs, wallet history and transactions use cursors, and Explorer results can export large row sets.
- Error and drift signals should be preserved. Token lookup can return per-item not-found errors; endpoints may return `402`, `429`, validation errors, or partial-message envelopes; Explorer raw SQL lacks a fetched official schema.
