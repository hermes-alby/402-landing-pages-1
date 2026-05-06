# Nansen: Token Discovery And Market Intelligence API Uses

## What This Endpoint Group Does

Screen tokens and inspect token-level market data, flows, holders, transfers, trades, indicators, price history, and trader leaderboards.

These endpoints are centered on token selection, token market structure, token flow diagnostics, and token-specific rankings.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/tgm/flows` | Get TGM Flows Data | chain, token_address, date, date.from, date.to, label, pagination | data, data[]/date, data[]/price_usd, data[]/token_amount, data[]/value_usd, data[]/holders_count, data[]/total_inflows_count, data[]/total_outflows_count |
| POST | `/api/v1/tgm/who-bought-sold` | Get TGM Who Bought/Sold Data | chain, token_address, buy_or_sell, date, date.from, date.to, pagination | data, data[]/address, data[]/address_label, data[]/bought_token_volume, data[]/sold_token_volume, data[]/token_trade_volume, data[]/bought_volume_usd, data[]/sold_volume_usd |
| POST | `/api/v1/tgm/dex-trades` | Get TGM DEX Trades Data | chain, token_address, only_smart_money, date, date.from, date.to, pagination | data, data[]/block_timestamp, data[]/transaction_hash, data[]/trader_address, data[]/trader_address_label, data[]/action, data[]/token_address, data[]/token_name |
| POST | `/api/v1/tgm/transfers` | Get TGM Transfers Data | chain, token_address, date, date.from, date.to, pagination, pagination.page | data, data[]/block_timestamp, data[]/transaction_hash, data[]/from_address, data[]/to_address, data[]/from_address_label, data[]/to_address_label, data[]/transaction_type |
| POST | `/api/v1/tgm/holders` | Get TGM Holders Data | chain, token_address, aggregate_by_entity, label_type, pagination, pagination.page, pagination.per_page | data, data[]/address, data[]/address_label, data[]/token_amount, data[]/total_outflow, data[]/total_inflow, data[]/balance_change_24h, data[]/balance_change_7d |
| POST | `/api/v1/tgm/pnl-leaderboard` | Get TGM PnL Leaderboard Data | chain, token_address, date, date.from, date.to, pagination, pagination.page | data, data[]/trader_address, data[]/trader_address_label, data[]/price_usd, data[]/pnl_usd_realised, data[]/pnl_usd_unrealised, data[]/holding_amount, data[]/holding_usd |
| POST | `/api/v1/tgm/flow-intelligence` | Get TGM Flow Intelligence Data | chain, token_address, timeframe, filters, filters.public_figure_net_flow_usd, filters.public_figure_net_flow_usd.min, filters.public_figure_net_flow_usd.max | data, data[]/public_figure_net_flow_usd, data[]/public_figure_avg_flow_usd, data[]/public_figure_wallet_count, data[]/top_pnl_net_flow_usd, data[]/top_pnl_avg_flow_usd, data[]/top_pnl_wallet_count, data[]/whale_net_flow_usd |
| POST | `/api/v1/tgm/position-intelligence` | Token position intelligence | apikey, Authorization |  |
| POST | `/api/v1/tgm/token-information` | Get TGM Token Information Data | chain, token_address, timeframe | data, data.name, data.symbol, data.contract_address, data.logo, data.token_details, data.token_details.token_deployment_date, data.token_details.website |
| POST | `/api/v1/tgm/indicators` | Get Nansen Score Indicators | chain, token_address | token_address, chain, token_info, token_info.market_cap_usd, token_info.market_cap_group, token_info.is_stablecoin, risk_indicators, risk_indicators[]/indicator_type |
| POST | `/api/v1/tgm/token-ohlcv` | Get Token OHLCV Data | chain, token_address, date_range, date_range.start, date_range.end, date, date.from | chain, token_address, timeframe, data, data[]/interval_start, data[]/open, data[]/high, data[]/low |
| POST | `/api/v1/tgm/jup-dca` | Get TGM Jupiter DCA Data | token_address, pagination, pagination.page, pagination.per_page, filters, filters.include_smart_money_labels, filters.exclude_smart_money_labels | data, data[]/since_timestamp, data[]/last_timestamp, data[]/trader_address, data[]/creation_hash, data[]/trader_label, data[]/dca_vault_address, data[]/input_mint_address |
| POST | `/api/v1/token-screener` | Get Token Screening Data | chains, timeframe, date, date.from, date.to, pagination, pagination.page | data, data[]/chain, data[]/token_address, data[]/token_symbol, data[]/token_age_days, data[]/market_cap_usd, data[]/liquidity, data[]/price_usd |

## Field Notes

### Inputs

- `chain`
- `token_address`
- `date`
- `date.from`
- `date.to`
- `label`
- `pagination`
- `pagination.page`
- `pagination.per_page`
- `filters`
- `filters.price_usd`
- `filters.price_usd.min`
- `filters.price_usd.max`
- `filters.token_amount`
- `filters.token_amount.min`
- `filters.token_amount.max`
- `filters.value_usd`
- `filters.value_usd.min`
- `filters.value_usd.max`
- `filters.holders_count`
- `filters.holders_count.min`
- `filters.holders_count.max`
- `filters.total_inflows_count`
- `filters.total_inflows_count.min`
- `filters.total_inflows_count.max`
- `filters.total_outflows_count`
- `filters.total_outflows_count.min`
- `filters.total_outflows_count.max`
- `order_by`
- `order_by[]/field`
- `order_by[]/direction`
- `buy_or_sell`
- `filters.include_smart_money_labels`
- `filters.exclude_smart_money_labels`
- `filters.address`
- `filters.address_label`
- `filters.bought_token_volume`
- `filters.bought_token_volume.min`
- `filters.bought_token_volume.max`
- `filters.sold_token_volume`

### Outputs

- `data`
- `data[]/date`
- `data[]/price_usd`
- `data[]/token_amount`
- `data[]/value_usd`
- `data[]/holders_count`
- `data[]/total_inflows_count`
- `data[]/total_outflows_count`
- `data[]/total_inflows_dex`
- `data[]/total_outflows_dex`
- `data[]/total_inflows_cex`
- `data[]/total_outflows_cex`
- `pagination`
- `pagination.page`
- `pagination.per_page`
- `pagination.is_last_page`
- `data[]/address`
- `data[]/address_label`
- `data[]/bought_token_volume`
- `data[]/sold_token_volume`
- `data[]/token_trade_volume`
- `data[]/bought_volume_usd`
- `data[]/sold_volume_usd`
- `data[]/trade_volume_usd`
- `data[]/block_timestamp`
- `data[]/transaction_hash`
- `data[]/trader_address`
- `data[]/trader_address_label`
- `data[]/action`
- `data[]/token_address`
- `data[]/token_name`
- `data[]/traded_token_address`
- `data[]/traded_token_name`
- `data[]/traded_token_amount`
- `data[]/estimated_swap_price_usd`
- `data[]/estimated_value_usd`
- `data[]/from_address`
- `data[]/to_address`
- `data[]/from_address_label`
- `data[]/to_address_label`
- `data[]/transaction_type`
- `data[]/transfer_amount`
- `data[]/transfer_value_usd`
- `data[]/total_outflow`
- `data[]/total_inflow`

### Important Constraints Or Gaps

- 13 of 13 endpoints in this group have MPP payment metadata in the local feed. Unpriced feed endpoints may still require a native Nansen API key or a subscription plan.
- Native docs use the `apikey` header. Nansen MPP docs say supported priced `/api/v1/*` endpoints can use `Authorization: Payment` instead of an API key.
- Standard API rate limits are documented as 20 requests per second and 300 requests per minute. x402 docs separately mention wallet-based limits of 5 requests per second and 60 requests per minute.
- `POST /api/v1/tgm/position-intelligence`: No public OpenAPI/API-reference schema found in saved Nansen docs snapshots for this exact MPP feed path.
- `POST /api/v1/tgm/position-intelligence`: Direct position-intelligence docs page returned Page Not Found; docs query returned closest Perp Positions sources, so request/response schema is not asserted here.

## Use Cases

### Token screening for research pipelines

Token Screener, token information, indicators, holders, flows, trades, transfers, and OHLCV fields let users filter tokens by chain, timeframe, market cap, liquidity, price change, volume, smart-money labels, holder behavior, and flow metrics. A personal investor can narrow a watchlist; a business can feed ranked token candidates into research, listing, or risk review workflows.

### Launch and momentum monitoring

Timeframe, DEX trade, transfer, holder, flow, who-bought-sold, and DCA fields help identify fresh launches, unusual inflows, changing holder concentration, and smart-money participation. Automations can trigger when volume, buy/sell counts, market cap, liquidity, netflow, or fresh-wallet fields cross thresholds. Token Screener retention is limited to recent windows, so historical backtesting needs other sources.

### Token risk and quality review

Indicators, holder distribution, token information, and flow intelligence help assess whether a token has healthier liquidity, age, sector fit, concentration, exchange flows, or whale/smart-trader activity. Businesses can use this as a pre-screen for listings, integrations, treasury purchases, or customer-facing alerts. It should be combined with contract, legal, and market-risk checks.

### Trader leaderboard and market structure analysis

PnL leaderboard, DEX trades, transfers, and who-bought-sold endpoints expose which addresses are profitable, still holding, buying, selling, or transferring a token. A research team can separate one-off spikes from repeated profitable behavior and decide which addresses or cohorts deserve wallet-level follow-up.
