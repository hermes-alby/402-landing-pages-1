# Allium: Token Pricing API Uses

## What This Endpoint Group Does

Allium's Token Pricing endpoints turn token identities into USD-denominated price data derived from on-chain DEX trades. The group covers four related questions: what is this token worth now, what was it worth at a specific timestamp, what did its OHLC history look like across a time range, and what are its recent high/low/change statistics.

The practical value is that an application, analyst, or agent can value multi-chain token holdings without maintaining its own DEX trade index. The outputs are most useful when paired with wallet balances, token metadata, or transaction timestamps: balances become portfolio values, transaction times become historical fair-value lookups, and token watchlists become market-monitoring feeds.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/developer/prices` | Fetch latest USD price and OHLC values for up to 200 token-chain pairs. | JSON array of `token_address` and lowercase `chain`; optional `with_liquidity_info=true`. | `items[].timestamp`, `chain`, `address`, `decimals`, `price`, `open`, `high`, `close`, `low`; optional pagination/message envelope. |
| POST | `/api/v1/developer/prices/at-timestamp` | Fetch a token price at or before a requested UTC timestamp. | `addresses[]` with `token_address` and `chain`; `timestamp`; `time_granularity`; optional `staleness_tolerance`. | `items[].input_timestamp`, `price_timestamp`, `mint`, `chain`, `price`; optional pagination/message envelope. |
| POST | `/api/v1/developer/prices/history` | Fetch historical OHLC price candles for token-chain pairs over a time range. | `start_timestamp`, `end_timestamp`, `addresses[]`, `time_granularity`; legacy single-token fields; optional `cursor`. | `items[].mint`, `chain`, `decimals`, `prices[]` with `timestamp`, `price`, `open`, `high`, `close`, `low`; optional `cursor` and `message`. |
| POST | `/api/v1/developer/prices/stats` | Fetch recent price statistics for up to 200 token-chain pairs. | JSON array of `token_address` and lowercase `chain`. | `items[].mint`, `chain`, `timestamp`, `latest_price`, `low_24h`, `high_24h`, `low_1h`, `high_1h`, `percent_change_24h`, `percent_change_1h`, `decimals`; optional pagination/message envelope. |

## Field Notes

### Inputs

The primary identifiers are token contract addresses and lowercase chain names. The supported-chain discovery snapshot lists the same 16 chains for all four endpoints: `arbitrum`, `avalanche`, `bsc`, `base`, `blast`, `celo`, `ethereum`, `hyperevm`, `optimism`, `polygon`, `solana`, `soneium`, `unichain`, `worldchain`, `zora`, and `zksync`.

Latest prices and stats accept a direct array of token-chain objects and are capped at 200 tokens per request. Point-in-time lookup wraps token-chain objects in an `addresses` array and requires a UTC ISO 8601 `timestamp` plus `time_granularity`. History requires a UTC `start_timestamp`, `end_timestamp`, `addresses`, and `time_granularity`; the docs state a max of 50 tokens per request for history.

`time_granularity` is one of `15s`, `1m`, `5m`, `1h`, or `1d`. For point-in-time lookups, `staleness_tolerance` controls how far backward Allium may look for the closest prior price when no trade exists at the requested window. The latest price endpoint also supports `with_liquidity_info=true`, which can add liquidity context useful for filtering spam or scam tokens.

### Outputs

All price values are USD-denominated unless otherwise stated. Latest price responses return a timestamped OHLC snapshot from the most recent completed minute interval, or the most recent available trade-derived data when the token did not trade in the last minute. Point-in-time responses return both the requested `input_timestamp` and the actual `price_timestamp`, which is important for audit trails because the returned price may come from an earlier candle.

History returns candle arrays under `prices[]`, with each candle carrying a timestamp plus volume-weighted average `price` and OHLC fields. Stats returns a compact current market summary: latest price, 1-hour and 24-hour highs/lows, and 1-hour and 24-hour percentage changes. The docs say these high/low and change values are calculated from filtered prices to avoid outlying trades.

### Important Constraints Or Gaps

Each covered machine-payment endpoint costs `$0.02` per request on `https://agents.allium.so`. The machine-payments docs say realtime endpoints need no API key on the payment-enabled host, but payment clients must be able to handle `402 Payment Required` negotiation with Tempo MPP or x402 and pay in USDC. The Data bucket rate limit for `/developer/` endpoints is 3 requests per second per wallet.

These are on-chain DEX-derived prices, not a centralized exchange quote, NAV oracle, or legal valuation opinion. Allium describes its methodology as tracking DEX trades, converting trades to USD through known quote assets, constructing candles, calculating VWAP, and applying outlier filtering. That methodology is useful for low-latency long-tail token coverage, including newly traded tokens, but it can diverge from exchange marks or accounting policies.

Freshness and retention need explicit handling. Latest prices are minute-interval based, inactive tokens may return the last known trade-derived price, and the docs say no latest data is returned if no trade occurred within the past 7 days. Point-in-time and history retention is 5 days for `15s`, 30 days for `1m` and `5m`, and all available history for `1h` and `1d`. History forward-fills windows without trading activity when a prior datapoint exists, and the current window may be incomplete.

## Use Cases

### Personal Portfolio Valuation

A wallet user can combine Allium token prices with current token balances to estimate a multi-chain portfolio's USD value. The latest endpoint is the natural fit for a dashboard refresh because it accepts batches of token-chain pairs and returns the price, candle timestamp, and OHLC context needed to show whether the displayed mark is fresh.

The main prerequisite is a reliable list of token contract addresses and chains, usually from a wallet balance endpoint or a user's saved watchlist. The result should show price timestamps or mark stale values clearly, especially for illiquid tokens where the last available trade may be old or unavailable.

### Transaction-Time Valuation For Taxes And Records

For personal tax preparation, bookkeeping, or export tooling, the point-in-time endpoint can price swaps, transfers, purchases, or sales at the event timestamp. Its `input_timestamp` and `price_timestamp` pairing is valuable because it documents whether the returned value came from the exact requested window or the nearest prior available price.

This should be treated as supporting data, not a complete tax engine. Users still need jurisdiction-specific rules, transaction classification, fees, cost-basis logic, and defensible record retention. `staleness_tolerance` should be set conservatively for thinly traded tokens so old prices are not silently used as current fair value.

### Market Monitoring And Token Alerts

An individual trader, DAO operator, or agent can use latest prices and stats to monitor a token list for 1-hour and 24-hour moves, highs, lows, and possible volatility triggers. The stats endpoint gives a compact signal set, while the history endpoint can back a richer chart or confirm whether a move is sustained across candles.

Costs and rate limits matter for automation. At `$0.02` per request and 3 developer requests per second per wallet, the design should batch tokens, cache supported-chain metadata, and avoid polling every token at high frequency when minute-candle freshness is enough.

### Wallet, Portfolio, And Accounting Products

A business building a wallet, portfolio tracker, treasury dashboard, or accounting workflow can use these endpoints as a paid, accountless price data layer. Latest prices support current positions, point-in-time prices support historical transaction valuation, and history supports charts, exports, and period-end reports.

The returned `decimals`, token address, chain, and timestamp fields make reconciliation easier, but the application still needs token discovery, balance indexing, and internal controls around payment wallets. Production systems should record raw responses or normalized pricing snapshots so later audits can reproduce which price was used.

### Risk, Compliance, And Token Screening

Risk and compliance teams can use price stats, latest prices, and optional liquidity information to triage token exposure. For example, low or missing liquidity, stale prices, extreme 1-hour changes, or absent history can flag tokens that need manual review before they are accepted in a portfolio, collateral workflow, or customer-facing report.

This is only one signal. Allium's price endpoints do not determine sanctions status, issuer legitimacy, security classification, or fraud by themselves. Screening workflows still need address intelligence, token metadata, policy rules, and documented escalation paths.

### Token Launch And Long-Tail Asset Analytics

Because Allium's pricing is calculated from on-chain DEX trades and is described as available after a token's first DEX trade, product teams and analysts can use these endpoints to follow new or long-tail assets earlier than many exchange-oriented market data feeds. History and stats can support launch dashboards, volume/price-change summaries, and post-launch retrospectives.

The limitation is data quality around very early or illiquid markets. A few trades can produce sparse candles, forward-filled history, or prices that are technically available but not representative of executable size. Use liquidity context and show confidence caveats when presenting early-token pricing to end users.
