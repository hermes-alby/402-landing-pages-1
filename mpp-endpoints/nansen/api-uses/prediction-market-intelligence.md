# Nansen: Prediction Market Intelligence API Uses

## What This Endpoint Group Does

Discover prediction markets and analyze orderbooks, prices, positions, holders, trades, and PnL by address or market.

These endpoints use prediction-market identifiers, outcomes, orderbooks, positions, and market PnL rather than token-only or wallet-only data.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/prediction-market/ohlcv` | Get Prediction Market OHLCV Candles | market_id, pagination, pagination.page, pagination.per_page, date, date.from, date.to | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/market_id, data[]/token_id, data[]/side |
| POST | `/api/v1/prediction-market/orderbook` | Get Prediction Market Orderbook | market_id, pagination, pagination.page, pagination.per_page | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/market_id, data[]/event_id, data[]/outcome |
| POST | `/api/v1/prediction-market/top-holders` | Get Prediction Market Top Holders | market_id, pagination, pagination.page, pagination.per_page, order_by, order_by[]/field, order_by[]/direction | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/market_id, data[]/outcome_index, data[]/address |
| POST | `/api/v1/prediction-market/trades-by-market` | Get Prediction Market Trades by Market | market_id, pagination, pagination.page, pagination.per_page, date, date.from, date.to | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/timestamp, data[]/seller, data[]/buyer |
| POST | `/api/v1/prediction-market/market-screener` | Get Prediction Market Screener | order_by, order_by[]/field, order_by[]/direction, sort_by, query, status, tags | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/market_id, data[]/question, data[]/slug |
| POST | `/api/v1/prediction-market/event-screener` | Get Prediction Market Event Screener | order_by, order_by[]/field, order_by[]/direction, sort_by, query, status, tags | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/event_id, data[]/event_title, data[]/tags |
| POST | `/api/v1/prediction-market/pnl-by-market` | Get Prediction Market PnL by Market | market_id, pagination, pagination.page, pagination.per_page, order_by, order_by[]/field, order_by[]/direction | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/address, data[]/owner_address, data[]/side_held |
| POST | `/api/v1/prediction-market/pnl-by-address` | Get Prediction Market PnL by Address | address, pagination, pagination.page, pagination.per_page, order_by, order_by[]/field, order_by[]/direction | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/address, data[]/market_id, data[]/question |
| POST | `/api/v1/prediction-market/position-detail` | Get Prediction Market Position Detail | market_id, pagination, pagination.page, pagination.per_page | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/address, data[]/owner_address, data[]/outcome |
| POST | `/api/v1/prediction-market/trades-by-address` | Get Prediction Market Trades by Address | address, pagination, pagination.page, pagination.per_page, date, date.from, date.to | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/timestamp, data[]/seller, data[]/buyer |
| POST | `/api/v1/prediction-market/categories` | Get Prediction Market Categories | pagination, pagination.page, pagination.per_page | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/category, data[]/active_markets, data[]/total_open_interest |

## Field Notes

### Inputs

- `market_id`
- `pagination`
- `pagination.page`
- `pagination.per_page`
- `date`
- `date.from`
- `date.to`
- `order_by`
- `order_by[]/field`
- `order_by[]/direction`
- `sort`
- `sort[]/field`
- `sort[]/direction`
- `sort_by`
- `query`
- `status`
- `tags`
- `min_liquidity`
- `max_liquidity`
- `max_unique_traders_24h`
- `min_volume_24hr`
- `neg_risk`
- `min_open_interest`
- `max_open_interest`
- `end_date_before`
- `end_date_after`
- `min_price`
- `max_price`
- `address`

### Outputs

- `pagination`
- `pagination.page`
- `pagination.per_page`
- `pagination.is_last_page`
- `data`
- `data[]/market_id`
- `data[]/token_id`
- `data[]/side`
- `data[]/outcome_index`
- `data[]/period_start`
- `data[]/open`
- `data[]/high`
- `data[]/low`
- `data[]/close`
- `data[]/volume_usd`
- `data[]/trade_count`
- `data[]/unique_traders`
- `data[]/event_id`
- `data[]/outcome`
- `data[]/asset_id`
- `data[]/price`
- `data[]/size`
- `data[]/cumulative_size`
- `data[]/snapshot_timestamp`
- `data[]/address`
- `data[]/owner_address`
- `data[]/position_size`
- `data[]/avg_entry_price`
- `data[]/current_price`
- `data[]/unrealized_pnl_usd`
- `data[]/timestamp`
- `data[]/seller`
- `data[]/buyer`
- `data[]/taker_action`
- `data[]/usdc_value`
- `data[]/tx_hash`
- `data[]/question`
- `data[]/slug`
- `data[]/event_title`
- `data[]/active`
- `data[]/closed`
- `data[]/end_date`
- `data[]/neg_risk`
- `data[]/tags`
- `data[]/volume`

### Important Constraints Or Gaps

- 11 of 11 endpoints in this group have MPP payment metadata in the local feed. Unpriced feed endpoints may still require a native Nansen API key or a subscription plan.
- Native docs use the `apikey` header. Nansen MPP docs say supported priced `/api/v1/*` endpoints can use `Authorization: Payment` instead of an API key.
- Standard API rate limits are documented as 20 requests per second and 300 requests per minute. x402 docs separately mention wallet-based limits of 5 requests per second and 60 requests per minute.

## Use Cases

### Discover liquid prediction markets

Categories, market screener, event screener, OHLCV, orderbook, and top-holder endpoints help users find markets with sufficient liquidity, active prices, and concentration context. A personal trader can decide which markets are worth reading; a business can rank markets for research, alerts, or product surfaces.

### Evaluate market microstructure before trading

Orderbook, trades-by-market, OHLCV, top-holder, and position-detail fields can reveal spread, depth, recent prints, outcome prices, holder concentration, and position sizes. This helps decide whether an apparent opportunity is actually tradable or too thin. The API does not place orders, so execution still requires a separate venue and risk process.

### Track prediction-market trader performance

PnL by address, PnL by market, trades by address, and position detail let users study which addresses are profitable in specific markets and how positions changed. A business can use this for trader analytics, leaderboard features, or market-integrity monitoring.

### Event and category monitoring

Event screener and categories endpoints let researchers organize markets by theme, then layer prices, orderbooks, trades, and PnL onto the selected event set. This is useful for newsrooms, funds, or analysts monitoring elections, macro events, sports, or crypto events where market probabilities update faster than traditional reports.
