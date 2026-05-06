# Codex: Onchain Market Intelligence API Uses

## What This Endpoint Group Does

Codex exposes one MPP endpoint, `POST https://graph.codex.io/graphql`, that accepts GraphQL documents for onchain market intelligence. Through that single endpoint, a client can select query fields for token discovery, prices, OHLCV bars, pair metadata, liquidity and event streams, holders and balances, wallet analytics, supported network metadata, and prediction-market data.

The endpoint is strongest when the caller already knows what decision it is trying to support: discover a token set, inspect a token or pair, value wallet holdings, assess holder concentration, review trader behavior, or monitor prediction-market momentum. Because the response shape is controlled by the GraphQL selection set, teams can keep paid MPP calls narrow by requesting only the fields needed for a specific workflow.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `https://graph.codex.io/graphql` | Submit a GraphQL document to Codex for token, pair, chart, event, wallet, holder, network, and prediction-market intelligence. | `query`, `variables`, `operationName`; field-specific values such as token or pair address, `networkId`, wallet or maker address, symbol, phrase, rankings, filters, limit/cursor pagination, from/to timestamps, resolution, prediction market/event/trader IDs. | GraphQL `data` keyed by selected fields; token metadata and scam indicators; prices and OHLCV bars; pair liquidity, price-change, volume, and exchange fields; swap/event records; holder and balance records; wallet PnL/activity fields; network metadata; prediction market, trade, trader, category, outcome, price, liquidity, and volume fields; GraphQL errors or HTTP 402 payment challenges. |

## Field Notes

### Inputs

The endpoint accepts the standard JSON GraphQL request shape. `query` is required and selects the root field and response fields. `variables` is optional and is where most reusable applications should put addresses, network IDs, timestamps, pagination cursors, ranking choices, and filters. `operationName` is optional for named GraphQL documents.

Common token and pair workflows use token addresses, pair IDs in `pairAddress:networkId` format, token IDs in `tokenAddress:networkId` format, `networkId`, `phrase`, `rankings`, numeric filters, `limit`, `cursor`, `from`, `to`, and `resolution`. Charting fields such as `getBars` require a symbol, time range, and candle resolution; docs list resolutions from sub-minute values through daily and weekly bars, with sub-minute history limited to the last 24 hours.

Wallet and holder workflows use `walletAddress`, optional network filters, token lists, `removeScams`, sorting, `limit`, and `cursor`. Prediction-market workflows use market, event, and trader IDs plus filters for protocol, status, category, time windows, liquidity, volume, and ranking attributes such as `volumeUsd24h`, `trendingScore24h`, and `uniqueTraders24h`.

### Outputs

Token discovery and token-stat queries can return token name, symbol, address, network, image URLs, social or organization metadata, creator fields, creation timestamps, holder counts, liquidity, circulating market cap, buy/sell volume, transaction counts, prices, and change metrics over windows such as `min5`, `hour1`, `day1`, `week1`, and `day30`.

Chart and pair queries return OHLC arrays, timestamps, USD or native-token volume, pair address, exchange ID, fee tier, token0/token1 details, liquidity, pooled amounts, current price, high/low values, and price or volume windows such as 5m, 1h, 4h, 12h, and 24h. Event queries add transaction hashes, block context, maker/sender identifiers, event type, swap amounts, USD values, commitment level, and cursor pagination.

Wallet, balance, and holder queries return wallet IDs, token IDs, wallet addresses, token addresses, balances, shifted balances, USD valuations, token prices, first-held timestamps, holder counts, `top10HoldersPercent`, wallet labels, scammer and bot scores, realized PnL, volume, swap counts, unique-token counts, win/loss counts, network breakdowns, native balances, and first-funding information.

Prediction-market queries return market, event, trader, outcome, and venue identifiers; Polymarket or Kalshi protocol values; categories; questions, labels, rules, and resolution metadata; open/close/resolve timestamps; outcome labels and prices; liquidity and volume fields; trade counts and unique-trader counts; trend, relevance, and competitiveness scores; trade prices, amounts, transaction hashes, makers, and trader IDs.

### Important Constraints Or Gaps

Codex MPP access is documented as a paid HTTP 402 flow at `$0.001` USDC per request on Tempo. This artifact does not test paid behavior, unpaid 402 body shape, runtime GraphQL errors, or plan-gated field availability.

The original Codex API also supports API-key access, WebSocket subscriptions, webhooks, and mutations. The local MPP catalog exposes only the HTTP `POST /graphql` endpoint. Subscription fields are relevant for application architecture but are not a separate MPP endpoint in this inventory, and mutation fields such as webhook or API-token management should not be invoked without explicit future approval.

Public pricing and docs indicate that some capabilities are plan-gated in the original Codex model. Wallet analytics, launchpad events, WebSockets, Webhooks, and prediction markets are noted as Growth/Enterprise-oriented features, while MPP docs describe pay-per-request access. Public docs do not prove whether every API-key plan-gated GraphQL field is available through MPP at the same price and limits.

No public full introspection JSON or OpenAPI spec was found. Field coverage here is docs-derived and representative, not a verified exhaustive schema export. Responses should be coded defensively for nulls, deprecated fields, cursor pagination, decimal strings for large values, scam/quality filters, and fields that may be unavailable for new, illiquid, unsupported, or plan-gated assets.

## Use Cases

### Cross-Chain Token Discovery And Risk Triage

A person can use Codex to scan for tokens matching a theme, symbol, contract address, or trend, then filter out low-quality assets before deciding what deserves manual review. A business can build a token discovery page, analyst queue, or agent workflow that ranks assets by `trendingScore24`, `volume24`, transaction count, liquidity, holder count, creation time, or market cap, while returning token identity fields such as address, symbol, name, `networkId`, image URLs, creator address, and creation transaction.

The workflow starts with `filterTokens` using `phrase`, rankings, `limit`, and quality filters such as minimum liquidity or volume. Follow-up selections can request `getDetailedTokenStats`, `getTokenPrices`, `holders`, `top10HoldersPercent`, or pair data to separate active, liquid markets from copied symbols, new illiquid pools, and scam-flagged tokens. The returned fields support actions such as watchlist creation, analyst prioritization, user-facing search results, alerting on newly active tokens, or suppressing risky results. The main constraints are response limits, per-request MPP cost, plan gating uncertainty, false positives or gaps in scam labeling, and the fact that very new tokens may not have complete historical or holder data.

### Market Charts, Watchlists, And Trading Dashboards

Codex can power a charting or market-monitoring surface for individuals tracking portfolios and for businesses building token pages, trading terminals, research dashboards, or bot inputs. `getTokenPrices` provides current or historical USD prices for batches of token inputs, while `getBars` and `getTokenBars` provide OHLCV arrays for charting across selected time windows and resolutions. `getDetailedTokenStats` adds current versus previous values for volume, buy volume, sell volume, close, liquidity, transactions, buyers, sellers, and traders.

The practical workflow is to use `getNetworks` or stored network IDs to normalize assets, fetch latest prices for a watchlist, load OHLCV bars for the selected token or pair, and enrich the display with pair metadata, liquidity, volume windows, and token stats. Those fields enable decisions such as whether price movement is supported by real volume, whether liquidity is deep enough to trade, whether buys and sellers are balanced, and whether an alert should fire for a sudden liquidity or volume change. Costs and freshness matter: each HTTP query counts as a request, high-frequency polling over MPP can become more expensive than an API key plan, and sub-minute bars are only available for the recent window documented by Codex.

### DEX Pair And Liquidity Analysis Before Execution

For traders, wallets, market makers, or routing systems, the endpoint can provide pre-trade context without executing a trade. `pairMetadata`, `filterPairs`, `listPairsForToken`, and related liquidity fields expose pair address, exchange ID, fee, token0/token1 details, pooled amounts, liquidity, price, price changes, high/low values, and volume windows. Event fields such as `getTokenEvents` can show recent swaps, mints, burns, makers, transaction hashes, amounts, and USD values.

A workflow can discover the relevant pairs for a token, rank them by liquidity or recent volume, inspect the selected pair's fee and pooled token composition, then check recent events for abnormal activity before a separate execution system acts. The returned data can trigger automation such as blocking trades in shallow pools, preferring the pair with stronger liquidity, flagging pools with sudden liquidity withdrawal, or routing analysts to transaction hashes for manual review. Codex does not execute swaps, and this repo's policy forbids mutations or paid endpoint tests without approval, so this use case is intelligence-only. Applications still need their own execution, slippage, compliance, and MEV controls.

### Wallet Intelligence, Smart-Money Tracking, And Compliance Screening

Individuals can inspect their own wallet exposure or evaluate public wallets they follow. Businesses can score wallets for research, risk, CRM enrichment, trader leaderboards, anti-abuse monitoring, or compliance triage. `detailedWalletStats` returns wallet address, last transaction time, labels, scammer score, bot score, USD volume, realized profit, average profit per trade, swaps, unique tokens, wins, losses, network breakdowns, native token balances, and first-funding data. `balances` adds token holdings, USD valuations, token prices, scam filtering, and pagination.

The workflow is to query a wallet address, request the relevant time windows and network breakdowns, join balances to current token prices, and optionally inspect event history by maker address. The fields support actions such as identifying profitable or bot-like wallets, segmenting wallets by activity level, alerting when a watched wallet accumulates a token, checking whether a wallet is exposed to scam-flagged assets, or tracing funding patterns for related-wallet investigation. Limitations are important: wallet analytics can be plan-gated, labels and scores are heuristics rather than legal determinations, balances may have null USD values for thin assets, native balances are not universal across networks, and high-volume monitoring should be designed around request cost and rate limits.

### Holder Concentration And Token Distribution Monitoring

Codex holder fields let a user or business inspect whether a token has broad distribution or concentrated ownership. `holders` accepts a token ID, pagination, sorting, and contract-filtering inputs, then returns holder addresses, balances, USD values, first-held timestamps, total holder count, status, and `top10HoldersPercent`. `balances` can then enrich important holder addresses with their broader token exposure, while `getDetailedTokenStats` adds market activity context.

This supports workflows such as launch diligence, token-listing review, risk dashboards, community health monitoring, and alerting on concentrated supply. A token page can display top holder concentration alongside liquidity, market cap, buy/sell volume, holder age, and price trend, then warn analysts when a small set of wallets controls a large share or when new large holders appear. The data should be treated as risk context, not proof of manipulation: holder coverage can vary by network and token activity, pagination is required for full lists, contract and burn-address filtering must be configured, and very new or unsupported assets may return incomplete status.

### Prediction-Market Discovery, Momentum, And Trader Review

Codex's prediction-market fields can help individuals find active markets and help businesses build news, odds, trading, or research dashboards over Polymarket and Kalshi-style data. `filterPredictionMarkets` supports phrase search, category and status filters, protocol filters, liquidity and time-window filters, rankings by `volumeUsd24h`, `trendingScore24h`, `uniqueTraders24h`, and related metrics. Outputs include event labels, market questions, categories, status, collateral, network IDs, open/close times, outcome labels, outcome prices, liquidity, volume, trade counts, unique-trader counts, and scoring metrics.

The workflow starts by filtering to open, liquid markets in a category or topic, then adding `predictionTrades`, `predictionMarketBars`, `predictionEventBars`, or detailed market/trader stats for price movement and participant behavior. These fields enable actions such as surfacing markets with accelerating activity, comparing implied probabilities across outcomes, alerting when liquidity or unique traders spike, building event dashboards, or reviewing a trader's market history. Constraints include beta/data-coverage caveats, Growth/Enterprise plan-gating in the original pricing model, protocol differences such as Polymarket transaction hashes versus Kalshi privacy limitations, and the need to handle resolved, suspended, cancelled, or pending statuses carefully.
