# CoinGecko: Macro Market And DeFi Context API Uses

## What This Endpoint Group Does

This group provides market-wide context instead of asset-level data. `global` reports the size and composition of the full crypto market, and `global-defi` reports DeFi market cap, volume, DeFi-to-ETH ratio, dominance, and the top DeFi coin. These endpoints help decide whether a single-asset signal is happening against a broad risk-on/risk-off backdrop.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/coingecko/global` | Global crypto market data | none | Active cryptocurrencies, markets, total market cap, total volume, market-cap dominance, 24h market-cap/volume changes, `updated_at` |
| POST | `/coingecko/global-defi` | Global DeFi market data | none | DeFi market cap, ETH market cap, DeFi-to-ETH ratio, 24h trading volume, DeFi dominance, top DeFi coin and dominance |

## Field Notes

### Inputs

Neither endpoint takes a request body in the MPP docs. This makes them straightforward context calls for agents, reports, and risk checks.

### Outputs

`global` returns nested currency maps for `total_market_cap` and `total_volume`, plus `market_cap_percentage` keys such as BTC and ETH dominance. `global-defi` returns numeric-looking values as strings for several fields, so consumers should parse and validate before using them in calculations.

### Important Constraints Or Gaps

The endpoints are snapshots, not streams. `updated_at` should be captured and displayed. Broad market metrics are not a substitute for liquidity or venue-level analysis, so decisions about a specific token should combine this group with `coins-markets`, `market-chart`, or `exchanges`.

## Use Cases

### Market Regime Filter For Trade Decisions

A personal trader can check BTC dominance, total market cap, total volume, and 24-hour market-cap change before acting on a token-specific signal. A business trading desk can automate a pre-trade control: if `market_cap_change_percentage_24h_usd` is sharply negative or volume is abnormal, reduce position size, require human review, or widen risk limits.

### DeFi Exposure Reporting

`global-defi` can put DeFi holdings in context by comparing `defi_market_cap`, `trading_volume_24h`, `defi_to_eth_ratio`, and `defi_dominance`. An individual can see whether their DeFi-heavy portfolio is exposed to a shrinking sector; a fund or treasury team can include the same metrics in a daily exposure report.

### Macro Context For News And Research

A media analyst can use `global` to avoid overstating single-token stories when the entire market is moving. A research team can annotate reports with market-wide `total_market_cap`, `total_volume`, BTC/ETH dominance, and `updated_at` so readers know whether a token move is idiosyncratic or broad beta.

### Agentic Alert Suppression

An AI agent that monitors assets can suppress low-value alerts when macro movement explains most token moves. For example, if `global` shows a major market-wide drop, the agent can group individual drawdown alerts into a market-regime summary instead of sending dozens of separate asset warnings.
