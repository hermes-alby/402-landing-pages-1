# CoinGecko API Uses

## Service Summary

CoinGecko provides crypto market data for prices, metadata, rankings, historical charts, categories, global market context, exchanges, NFTs, treasuries, and onchain data. The MPP wrapper exposes 15 CoinGecko endpoints as POST JSON calls with HTTP 402 payment, making the service most useful for occasional or agentic lookups that do not justify creating a CoinGecko account or buying a monthly API plan.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Price Quotes And Token Lookup | 5 | Identify assets, map contracts to quotes, fetch current prices, and convert BTC rates. | [api-uses/price-quotes-and-token-lookup.md](api-uses/price-quotes-and-token-lookup.md) |
| Market Rankings And Momentum | 4 | Screen coins, sectors, trending assets, and top movers by rank, volume, category, and price changes. | [api-uses/market-rankings-and-momentum.md](api-uses/market-rankings-and-momentum.md) |
| Coin Profiles And History | 3 | Build detailed asset briefs and reconstruct historical price, market-cap, and volume context. | [api-uses/coin-profiles-and-history.md](api-uses/coin-profiles-and-history.md) |
| Macro Market And DeFi Context | 2 | Add broad crypto and DeFi market regime context to asset-level decisions. | [api-uses/macro-market-and-defi-context.md](api-uses/macro-market-and-defi-context.md) |
| Exchange Discovery And Venue Quality | 1 | Compare exchanges by trust score, volume, country, and metadata. | [api-uses/exchange-discovery-and-venue-quality.md](api-uses/exchange-discovery-and-venue-quality.md) |

## Highest-Value Uses

- Mark crypto holdings to market by CoinGecko ID or token contract, including stale-price checks through timestamps where available.
- Normalize ambiguous symbols and contract addresses into CoinGecko IDs before downstream portfolio, tax, or research workflows.
- Screen market sectors, trending assets, and top movers while filtering for volume, rank, and market cap to avoid low-quality signals.
- Produce single-asset due diligence briefs that combine description, links, categories, supply, ATH/ATL, community/developer data, and historical chart arrays.
- Add macro context such as BTC dominance, total crypto market cap, total volume, and DeFi dominance to trading, reporting, and alerting workflows.
- Shortlist exchange venues by trust score, normalized BTC volume, country, and metadata before deeper compliance or operational review.

## Personal Use Opportunities

Individuals can use the wrapper for lightweight portfolio checks, watchlist enrichment, historical tax marks, token disambiguation, sector exploration, and current BTC exchange-rate conversion. The per-request model is strongest when calls are sporadic, such as checking a few holdings, researching a token before a trade, or producing a one-off historical valuation.

## Business Use Opportunities

Businesses can use the endpoints for wallet and portfolio enrichment, accounting marks, research automation, exchange metadata enrichment, risk triage, content workflows, and agentic market monitoring. Higher-volume production systems may still prefer a direct CoinGecko plan because official pricing includes monthly credits, plan-specific rate limits, commercial licensing terms, and Enterprise support.

## Endpoint Group Summaries

### Price Quotes And Token Lookup

This group covers `simple-price`, `simple-token-price`, `coins-list`, `search`, and `exchange-rates`. It is the main entry point for current valuation, asset normalization, contract lookup, and conversion workflows. Full details: [api-uses/price-quotes-and-token-lookup.md](api-uses/price-quotes-and-token-lookup.md).

### Market Rankings And Momentum

This group covers `coins-markets`, `trending`, `categories`, and `top-gainers-losers`. It is useful for sector rotation, momentum triage, trend discovery, and listing/watchlist review. Full details: [api-uses/market-rankings-and-momentum.md](api-uses/market-rankings-and-momentum.md).

### Coin Profiles And History

This group covers `coin-data`, `market-chart`, and `coin-history`. It supports detailed asset due diligence, historical valuation, drawdown analysis, and metadata monitoring. Full details: [api-uses/coin-profiles-and-history.md](api-uses/coin-profiles-and-history.md).

### Macro Market And DeFi Context

This group covers `global` and `global-defi`. It helps explain whether token moves are idiosyncratic or part of a wider market or DeFi regime. Full details: [api-uses/macro-market-and-defi-context.md](api-uses/macro-market-and-defi-context.md).

### Exchange Discovery And Venue Quality

This group covers `exchanges`. It supports venue shortlisting, metadata enrichment, and counterparty risk triage. Full details: [api-uses/exchange-discovery-and-venue-quality.md](api-uses/exchange-discovery-and-venue-quality.md).

## Field And Data Themes

Core identifiers are CoinGecko coin IDs, asset platform IDs, contract addresses, exchange IDs, category IDs, and currency codes. Key quantitative fields include price, market cap, volume, supply, rank, ATH/ATL, percentage change, market dominance, DeFi market cap, exchange trust score, and exchange volume. Important timestamps include `last_updated`, `last_updated_at`, `updated_at`, chart timestamps, and historical date inputs.
