# Codex API Uses

## Service Summary

Codex provides a first-party GraphQL API for enriched onchain market data across tokens, DEX pairs, trades, wallets, holders, networks, launchpad events, and prediction markets. The MPP catalog exposes one paid endpoint, `POST https://graph.codex.io/graphql`, which lets callers submit selected GraphQL queries through a pay-per-request HTTP 402 flow rather than using a Codex API key.

The strongest uses are decision-support workflows where one narrow GraphQL query can answer a concrete question: which tokens are gaining real activity, whether a pair has usable liquidity, how a wallet behaves, whether a token's supply is concentrated, or which prediction markets are moving.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Onchain Market Intelligence | 1 | Token discovery, real-time and historical prices, OHLCV charts, DEX pair and liquidity context, event streams, holder and balance views, wallet analytics, supported-network metadata, and prediction-market intelligence through one GraphQL endpoint. | [api-uses/onchain-market-intelligence.md](api-uses/onchain-market-intelligence.md) |

## Highest-Value Uses

- Cross-chain token discovery and risk triage: rank assets by trend, volume, liquidity, transaction count, holder count, market cap, and scam or quality indicators before adding them to a watchlist, token page, or analyst queue.
- Market charting and monitoring: power token pages, dashboards, alerts, and watchlists with current prices, OHLCV bars, pair metadata, liquidity, and buy/sell activity windows.
- DEX liquidity and pre-trade intelligence: compare pairs for a token, inspect exchange and fee context, review pooled amounts, and detect abnormal swaps, mints, burns, or liquidity changes before a separate execution system acts.
- Wallet and holder intelligence: inspect balances, USD exposure, wallet PnL/activity, labels, bot or scammer scores, first-held timestamps, holder lists, and top-holder concentration.
- Prediction-market discovery: surface active Polymarket or Kalshi-style markets by category, status, liquidity, volume, unique traders, price movement, event metadata, and trader behavior.

## Personal Use Opportunities

- Build a personal crypto watchlist that fetches latest prices, OHLCV bars, liquidity, and 24-hour activity only for tokens under review.
- Check whether a token has meaningful liquidity, broad holder distribution, and non-suspicious activity before spending time on deeper manual research.
- Review a wallet's holdings, realized profit, activity, and token exposure to understand personal portfolio risk or public wallets of interest.
- Monitor prediction markets by topic, implied outcome prices, liquidity, volume, and recent trade activity.

## Business Use Opportunities

- Add enriched token search, token pages, and market dashboards to trading, wallet, research, or portfolio products without running a multi-chain indexer.
- Feed risk, listing, or compliance workflows with token quality signals, holder concentration, wallet labels, scammer/bot scores, and recent event history.
- Build analyst queues and alerting systems for sudden changes in price, liquidity, volume, holders, wallet activity, or prediction-market momentum.
- Use narrow MPP queries for demos, agent workflows, low-volume automation, or pay-as-you-go enrichment where an API-key plan is not yet justified.

## Endpoint Group Summaries

### Onchain Market Intelligence

Codex's single MPP endpoint accepts GraphQL documents whose selection sets define the returned data. It can support token discovery, charts, pair analysis, wallet and holder review, network metadata, and prediction-market workflows, but the practical design constraint is cost-aware query shaping: ask for only the fields needed for the decision at hand. Full details are in [api-uses/onchain-market-intelligence.md](api-uses/onchain-market-intelligence.md).

## Field And Data Themes

- Inputs center on GraphQL `query`, optional `variables`, and optional `operationName`.
- Common variables include token, pair, wallet, maker, market, event, trader, and outcome identifiers; `networkId`; search `phrase`; rankings; filters; pagination cursors; `limit`; `from`/`to` timestamps; and chart `resolution`.
- Market outputs include token metadata, images, socials, scam or verification indicators, prices, OHLCV bars, liquidity, volume, buy/sell metrics, transaction counts, pair metadata, and event records.
- Wallet and holder outputs include wallet IDs, wallet addresses, token balances, USD values, first-held timestamps, holder counts, top-holder concentration, labels, PnL, volume, swap counts, wins/losses, and activity charts.
- Prediction-market outputs include event and market IDs, questions, labels, rules, categories, statuses, outcome labels, prices, liquidity, volume, trade counts, unique-trader counts, trader IDs, and resolution timestamps.
