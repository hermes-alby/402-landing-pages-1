# CoinGecko: Coin Profiles And History API Uses

## What This Endpoint Group Does

This group supports single-asset due diligence and historical context. It combines a detailed coin profile with market data toggles, historical chart arrays, and a point-in-time history endpoint. It is useful when an agent already has a CoinGecko ID and needs to explain what the asset is, where it trades, how its market metrics changed, and how current conditions compare with the past.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/coingecko/coin-data` | Comprehensive coin profile | `id`, optional `localization`, `tickers`, `market_data`, `community_data`, `developer_data`, `sparkline` | Metadata, descriptions, links, images, categories, tickers, market/community/developer data |
| POST | `/coingecko/market-chart` | Historical chart arrays | `id`, `vs_currency`, `days`, optional `interval`, `precision` | `prices`, `market_caps`, `total_volumes` as timestamp/value arrays |
| POST | `/coingecko/coin-history` | Point-in-time daily snapshot | `id`, `date`, optional `localization` | Historical metadata, image, localization, and market data snapshot |

## Field Notes

### Inputs

The core identifier is `id`, usually obtained from `coins-list` or `search`. `coin-data` toggles can reduce response size by excluding `tickers`, `market_data`, `community_data`, `developer_data`, or localization. `market-chart` uses `days` values such as `1`, `7`, `14`, `30`, `90`, `180`, `365`, or `max`, with optional `interval`. `coin-history` dates use `DD-MM-YYYY`.

### Outputs

`coin-data` can return descriptions, links, categories, contract addresses, images, market cap rank, current price maps, ATH/ATL data, supply fields, tickers, community metrics, developer metrics, and `last_updated`. `market-chart` returns numeric time-series arrays. `coin-history` gives a daily snapshot that can support audit trails and historical valuation.

### Important Constraints Or Gaps

Historical granularity is not fully specified in MPP docs. Official docs and changelog indicate interval behavior can vary by plan and date range. `coin-data` can be large when all toggles are enabled, and descriptions may contain escaped newline sequences that need formatting before display.

## Use Cases

### Due Diligence Brief For One Asset

A personal investor can request `coin-data` with market, community, and developer data enabled to inspect what a coin does, where its official links and repositories are, and whether current price and market cap align with community/developer activity. A research firm can turn the same fields into a standardized asset brief with ID, symbol, category, description, homepage, market rank, liquidity, supply, ATH/ATL, and update timestamp.

### Historical Portfolio Valuation

`coin-history` and `market-chart` support reconstructing portfolio values for tax, accounting, or audit workflows. A person can value a historical trade on a date in `DD-MM-YYYY` format; a business can produce repeatable month-end or transaction-date marks using `prices`, `market_caps`, and `total_volumes` arrays. The workflow should log the CoinGecko ID, requested date/range, quote currency, and source timestamp.

### Drawdown And Recovery Analysis

`market-chart` plus `coin-data` ATH/ATL fields can quantify drawdowns, volume changes, and recovery behavior. A trader can test whether a token's current price is recovering on meaningful volume; an institutional analyst can compare price and market-cap series against internal risk thresholds before changing exposure.

### Project Metadata Monitoring

`coin-data` exposes metadata that changes over time: links, social handles, categories, descriptions, contract addresses, tickers, and developer/community metrics when requested. A wallet or compliance team can periodically check whether an asset's official links, platform contracts, or status changed, while preserving raw snapshots for later audit. The MPP wrapper is best for targeted checks because every call has a per-request cost.
