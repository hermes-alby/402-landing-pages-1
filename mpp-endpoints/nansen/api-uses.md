# Nansen API Uses

## Service Summary

Nansen is a first-party blockchain analytics and smart-money intelligence API. The assigned MPP surface at `https://api.nansen.ai` covers wallet profiling, token analytics, smart-money cohorts, Hyperliquid/perpetuals intelligence, prediction markets, and lookup helpers. Nansen documents native API-key access plus first-party MPP/x402 pay-per-call access for supported endpoints, which makes it useful for agents and humans who need a small number of targeted onchain intelligence calls without setting up a Nansen API key.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Search And Account Lookup | 4 | Resolve tokens, entities, token sectors, and account context that other Nansen API calls need before deeper wallet, token, or market analysis. | [api-uses/search-and-account-lookup.md](api-uses/search-and-account-lookup.md) |
| Wallet Profiling And Portfolio Analysis | 11 | Analyze wallet or entity holdings, transfers, counterparties, labels, related wallets, DeFi positions, and spot-token PnL. | [api-uses/wallet-profiling-and-portfolio-analysis.md](api-uses/wallet-profiling-and-portfolio-analysis.md) |
| Smart Money Flows And Holdings | 6 | Track aggregate behavior of Nansen-labeled smart traders, funds, whales, and other high-signal wallet cohorts across holdings, flows, DEX trades, perps, and DCA activity. | [api-uses/smart-money-flows-and-holdings.md](api-uses/smart-money-flows-and-holdings.md) |
| Token Discovery And Market Intelligence | 13 | Screen tokens and inspect token-level market data, flows, holders, transfers, trades, indicators, price history, and trader leaderboards. | [api-uses/token-discovery-and-market-intelligence.md](api-uses/token-discovery-and-market-intelligence.md) |
| Perpetuals And Hyperliquid Intelligence | 7 | Analyze Hyperliquid and perpetual futures markets, including token screeners, profitable traders, wallet positions, and perp trade history. | [api-uses/perpetuals-and-hyperliquid-intelligence.md](api-uses/perpetuals-and-hyperliquid-intelligence.md) |
| Prediction Market Intelligence | 11 | Discover prediction markets and analyze orderbooks, prices, positions, holders, trades, and PnL by address or market. | [api-uses/prediction-market-intelligence.md](api-uses/prediction-market-intelligence.md) |

## Highest-Value Uses

- Pre-screen wallets before copying, funding, onboarding, or investigating them by combining balances, labels, counterparties, related wallets, transactions, DeFi positions, and PnL.
- Detect token momentum and risk by combining token screening, flows, holders, trades, transfers, OHLCV, indicators, and trader leaderboards.
- Track smart-money accumulation, distribution, DEX trades, DCA behavior, and perps activity by labeled cohorts such as funds, smart traders, whales, and public figures.
- Identify profitable Hyperliquid or token traders and evaluate leverage, side, liquidation, funding, and PnL context before deeper review.
- Research prediction markets by combining category/event discovery, orderbooks, OHLCV, trades, holders, positions, and PnL by address or market.
- Use lookup endpoints to resolve token addresses, entity names, and sectors before spending on higher-cost analytics calls.

## Personal Use Opportunities

Personal users can use Nansen to check a wallet's holdings and realized/unrealized PnL, identify related wallets, watch smart-money token flows, find tokens with unusual volume or fresh-wallet inflow, study profitable perps traders, and inspect prediction-market depth before deciding whether a market is worth attention. These outputs support research and alerts; they do not replace investment, tax, or legal judgment.

## Business Use Opportunities

Businesses can enrich wallet-risk workflows, customer support investigations, token-listing reviews, market surveillance systems, treasury monitoring, growth analytics, trader leaderboards, and research products. Nansen fields are especially useful when a workflow needs chain-aware identifiers, USD-denominated balances, labels, PnL, flow direction, holder concentration, timeframes, orderbooks, or payment-friendly one-off access through MPP.

## Endpoint Group Summaries

### Search And Account Lookup

Resolve tokens, entities, token sectors, and account context that other Nansen API calls need before deeper wallet, token, or market analysis. It covers 4 endpoints. Full details: [api-uses/search-and-account-lookup.md](api-uses/search-and-account-lookup.md).

### Wallet Profiling And Portfolio Analysis

Analyze wallet or entity holdings, transfers, counterparties, labels, related wallets, DeFi positions, and spot-token PnL. It covers 11 endpoints. Full details: [api-uses/wallet-profiling-and-portfolio-analysis.md](api-uses/wallet-profiling-and-portfolio-analysis.md).

### Smart Money Flows And Holdings

Track aggregate behavior of Nansen-labeled smart traders, funds, whales, and other high-signal wallet cohorts across holdings, flows, DEX trades, perps, and DCA activity. It covers 6 endpoints. Full details: [api-uses/smart-money-flows-and-holdings.md](api-uses/smart-money-flows-and-holdings.md).

### Token Discovery And Market Intelligence

Screen tokens and inspect token-level market data, flows, holders, transfers, trades, indicators, price history, and trader leaderboards. It covers 13 endpoints. Full details: [api-uses/token-discovery-and-market-intelligence.md](api-uses/token-discovery-and-market-intelligence.md).

### Perpetuals And Hyperliquid Intelligence

Analyze Hyperliquid and perpetual futures markets, including token screeners, profitable traders, wallet positions, and perp trade history. It covers 7 endpoints. Full details: [api-uses/perpetuals-and-hyperliquid-intelligence.md](api-uses/perpetuals-and-hyperliquid-intelligence.md).

### Prediction Market Intelligence

Discover prediction markets and analyze orderbooks, prices, positions, holders, trades, and PnL by address or market. It covers 11 endpoints. Full details: [api-uses/prediction-market-intelligence.md](api-uses/prediction-market-intelligence.md).

## Field And Data Themes

- Identifiers: wallet addresses, entity names, token addresses, token symbols, chains, transaction hashes, prediction-market identifiers, categories, events, and trader addresses.
- Money and quantity fields: USD values, balances, token amounts, market cap, FDV, liquidity, volume, buy/sell volume, netflow, PnL, ROI, leverage, funding, position value, orderbook levels, and holder counts.
- Time fields: date ranges, timeframes, OHLCV windows, transaction/block times, retention windows, and pagination state.
- Classification fields: labels, premium-label controls, trader type, smart-money label filters, token sectors, result type, side, outcome, and category.
- Operational fields: pagination, sorting, filters, credit headers, rate-limit headers, payment challenge headers, and MPP payment receipts.
