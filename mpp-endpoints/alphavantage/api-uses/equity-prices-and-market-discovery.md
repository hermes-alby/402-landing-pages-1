# Alpha Vantage: Equity Prices And Market Discovery API Uses

## What This Endpoint Group Does

This endpoint group helps a caller move from "what instrument do I mean?" to "what is happening in the market?" It covers ticker search, global market-open status, latest quote snapshots, top US market movers, and intraday/daily/weekly/monthly OHLCV time series for equities.

The practical workflow is: resolve a company or keyword into a tradable symbol, check whether the relevant market is open, pull a current quote or ranked mover list, then retrieve price and volume history at the right time scale for monitoring, screening, portfolio review, or model input. The MPP wrapper exposes these as paid POST calls, while the upstream Alpha Vantage API documents them as GET calls to `/query?function=...`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/alphavantage/time-series-intraday` | Current and historical intraday OHLCV bars for one equity. | `symbol`, required `interval`; optional `adjusted`, `extended_hours`, `month`, `outputsize`, `datatype`. | `Meta Data`; timestamp-keyed `Time Series (<interval>)` bars with open, high, low, close, volume. |
| POST | `/alphavantage/time-series-daily` | Daily OHLCV history for one equity. | `symbol`; optional `outputsize`, `datatype`. | `Meta Data`; `Time Series (Daily)` bars with open, high, low, close, volume. |
| POST | `/alphavantage/time-series-weekly` | Weekly OHLCV history for one equity. | `symbol`; optional `datatype`. | `Meta Data`; `Weekly Time Series` bars with open, high, low, close, volume. |
| POST | `/alphavantage/time-series-monthly` | Monthly OHLCV history for one equity. | `symbol`; optional `datatype`. | `Meta Data`; `Monthly Time Series` bars with open, high, low, close, volume. |
| POST | `/alphavantage/global-quote` | Latest quote snapshot for one ticker. | `symbol`; optional `datatype`. | `Global Quote` with symbol, open, high, low, price, volume, latest trading day, previous close, change, and change percent. |
| POST | `/alphavantage/symbol-search` | Resolve company or instrument keywords into candidate ticker symbols. | `keywords`; optional `datatype`. | `bestMatches` with symbol, name, type, region, market hours, timezone, currency, and match score. |
| POST | `/alphavantage/market-status` | Check current open/closed status for major global equity, forex, and crypto venues. | No request fields in the wrapper inventory. | `endpoint`; `markets` records with market type, region, exchanges, local open/close, current status, and notes. |
| POST | `/alphavantage/top-gainers-losers` | Retrieve US market movers. | No request fields in the wrapper inventory. | `metadata`, `last_updated`, `top_gainers`, `top_losers`, and `most_actively_traded` arrays with price, change, percent change, and volume. |

## Field Notes

### Inputs

The central identifier is `symbol`; it is required for quote and time-series calls. `symbol-search` is the discovery step when a user has a company name, fuzzy keyword, regional listing, or ambiguous ticker. Its `bestMatches` output includes enough context to choose among similarly named instruments before spending additional calls on quote or history.

Intraday requests require `interval`, with documented values of `1min`, `5min`, `15min`, `30min`, and `60min`. Optional `adjusted` and `extended_hours` flags control split/dividend adjustment and inclusion of pre-market/post-market bars. `month` can target a specific historical month for intraday data. `outputsize` trades response size against history depth for intraday and daily series. `datatype` can be `json` or `csv`, although the inventory records JSON response fields because the wrapper OpenAPI does not define CSV column schemas.

### Outputs

The time-series endpoints return metadata plus timestamp-keyed OHLCV bars. These fields support trend calculations, volatility checks, liquidity screens, and before/after comparisons around events. Daily, weekly, and monthly bars are better suited to portfolio review and historical screening; intraday bars are better suited to near-term monitoring and market-session workflows.

`global-quote` returns a latest snapshot for a single ticker, including price, volume, previous close, change, and change percent. `top-gainers-losers` returns ranked US mover lists with price, change, percent change, and volume, which is useful for market-wide triage before drilling into individual symbols. `market-status` provides venue status, region, exchange, local open/close, and current status; this is important for scheduling alerts or avoiding stale assumptions outside trading hours.

### Important Constraints Or Gaps

Every endpoint in this group is an MPP paid POST endpoint with payment metadata showing `8000` units per request, estimated at `$0.008`, and requiring HTTP 402 auto-payment. This artifact was created from public docs and local source snapshots only; no paid calls were made.

The upstream Alpha Vantage docs note that realtime and 15-minute delayed US market data are premium/regulated data products. The wrapper request schemas in the local inventory do not expose the upstream `entitlement` parameter, so callers should not assume this MPP surface can select realtime or delayed entitlements unless wrapper behavior is separately confirmed. The official docs also mark intraday data as premium, while the support and premium pages distinguish free daily limits, premium request-per-minute plans, and regulated US market data entitlements.

The wrapper OpenAPI documents request bodies and 402 responses, but it does not publish machine-readable success response schemas. The response fields here are therefore docs-derived from the official Alpha Vantage documentation and local endpoint inventory. Upstream throttling and error payload mapping after MPP payment is not separately documented.

## Use Cases

### Ticker Resolution Before Portfolio Or Watchlist Actions

A personal investor can type "tesco", "tencent", or another company keyword and use `symbol-search` to choose the right listing by symbol, name, region, currency, timezone, and match score before adding it to a watchlist. This avoids common mistakes around duplicate tickers, regional suffixes, or companies with similar names.

A brokerage tool, spreadsheet add-on, CRM enrichment workflow, or finance app can use the same fields to power an autocomplete picker and persist the resolved symbol as the canonical identifier for later `global-quote` and time-series calls. The key limitation is that search confidence is a candidate ranking, not an investment suitability signal; downstream workflows should preserve the selected region and currency so later prices are interpreted correctly.

### Market-Hours-Aware Monitoring And Alert Scheduling

An individual can check `market-status` before interpreting a stale quote, deciding whether a price alert should fire now, or understanding whether a foreign venue is open in its local timezone. The `markets` records provide venue type, region, primary exchanges, local open/close, current status, and notes.

For businesses, this is useful in automated alerting, portfolio operations, customer notifications, and trading-adjacent workflows that should behave differently during open, closed, extended-hours, or cross-region sessions. A system can suppress noisy alerts outside local market hours, mark quote data as end-of-day, or schedule refreshes for the next open. The gap is entitlement visibility: the wrapper does not document a realtime/delayed selection field, so freshness should be displayed explicitly rather than assumed.

### Portfolio Snapshot And Daily Performance Review

A personal portfolio tracker can call `global-quote` for watched symbols to show the latest price, volume, previous close, absolute change, and percent change. It can then use daily time series to compare the current move against recent price and volume context.

A wealth dashboard, internal finance tool, or customer-facing fintech product can use the same fields to refresh holdings, flag large daily movers, and generate end-of-day summaries. The data is valuable because it combines a compact quote snapshot with historical OHLCV context, but high-volume portfolios need cost and rate planning because the wrapper exposes one-symbol quote calls and every MPP call has a per-request charge.

### Intraday Volatility And Liquidity Triage

An active individual investor can use `time-series-intraday` to inspect short-interval open, high, low, close, and volume bars, with `extended_hours` included when relevant. This supports questions such as whether a price move happened during regular trading, pre-market, or post-market, and whether it was accompanied by unusual volume.

Businesses can build monitoring jobs that flag instruments whose intraday range, volume, or bar-to-bar movement crosses a threshold before deeper research is triggered. The `interval`, `month`, `adjusted`, and `outputsize` fields make the same endpoint usable for recent monitoring and historical replay. Intraday data is the most entitlement-sensitive part of this group, so production workflows should account for premium requirements, regulated US data rules, and the absence of a documented wrapper entitlement parameter.

### Market-Mover Triage For Research Queues

A personal user can start with `top-gainers-losers` to see the top US gainers, losers, and most active tickers, then drill into `global-quote` and daily or intraday bars for the symbols that matter. The useful outputs are rank membership, price, change, percent change, volume, and `last_updated`.

A newsroom, investor-relations team, sales team, or research desk can use the same endpoint to populate a daily queue of companies that deserve attention. For example, a workflow can route top losers to risk review, top gainers to opportunity research, and high-volume names to liquidity or news checks. The endpoint only explains what moved, not why; stronger workflows should join this group with news, fundamentals, or internal exposure data before taking action.

### Historical Trend Screening And Backtesting Inputs

Personal users can use daily, weekly, and monthly OHLCV series to compare long-term price trends, review drawdowns, or test simple rules before making portfolio decisions. `outputsize=full` on daily data and the weekly/monthly endpoints provide broader context than a single quote snapshot.

Businesses can feed normalized OHLCV bars into screening pipelines, risk models, reporting jobs, or lightweight backtests. The field set is strong for price/volume research, but it lacks corporate fundamentals, dividends, split details for the unadjusted endpoints, and machine-readable corporate-action context in this group. Any backtest or model should document whether it used adjusted or raw intraday data and whether daily/weekly/monthly outputs include the exact adjustment policy needed for the analysis.
