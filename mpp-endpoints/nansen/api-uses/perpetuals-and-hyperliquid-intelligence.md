# Nansen: Perpetuals And Hyperliquid Intelligence API Uses

## What This Endpoint Group Does

Analyze Hyperliquid and perpetual futures markets, including token screeners, profitable traders, wallet positions, and perp trade history.

These endpoints share a perps/Hyperliquid market context and return leverage, side, position, funding, unrealized PnL, or perp-specific trade fields.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/profiler/perp-positions` | Get Perpetual Positions Data | address, filters, filters.token_symbol, filters.position_value_usd, filters.position_value_usd.min, filters.position_value_usd.max, filters.position_type | data, data.assetPositions, data.assetPositions[]/position, data.assetPositions[]/position_type, data.crossMaintenanceMarginUsed, data.cross_margin_summary_account_value_usd, data.cross_margin_summary_total_margin_used_usd, data.cross_margin_summary_total_net_liquidation_position_on_usd |
| POST | `/api/v1/profiler/perp-trades` | Get Perpetual Trade Data | address, date, date.from, date.to, filters, filters.token_symbol, filters.side | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/timestamp, data[]/side, data[]/action |
| POST | `/api/v1/tgm/perp-pnl-leaderboard` | Get TGM Perp PnL Leaderboard Data | token_symbol, date, date.from, date.to, pagination, pagination.page, pagination.per_page | data, data[]/trader_address, data[]/trader_address_label, data[]/price_usd, data[]/pnl_usd_realised, data[]/pnl_usd_unrealised, data[]/holding_amount, data[]/position_value_usd |
| POST | `/api/v1/tgm/perp-positions` | Get TGM Perp Positions Data | token_symbol, label_type, pagination, pagination.page, pagination.per_page, filters, filters.include_smart_money_labels | data, data[]/address, data[]/address_label, data[]/side, data[]/position_value_usd, data[]/position_size, data[]/leverage, data[]/leverage_type |
| POST | `/api/v1/tgm/perp-trades` | Get TGM Perp Trades Data | token_symbol, date, date.from, date.to, pagination, pagination.page, pagination.per_page | data, data[]/trader_address_label, data[]/trader_address, data[]/token_symbol, data[]/side, data[]/action, data[]/token_amount, data[]/price_usd |
| POST | `/api/v1/perp-screener` | Get Perpetual Contract Screening Data | date, date.from, date.to, pagination, pagination.page, pagination.per_page, filters | data, data[]/volume, data[]/buy_volume, data[]/sell_volume, data[]/buy_sell_pressure, data[]/trader_count, data[]/token_symbol, data[]/mark_price |
| POST | `/api/v1/perp-leaderboard` | Get Perpetual Trading Leaderboard Data | date, date.from, date.to, pagination, pagination.page, pagination.per_page, filters | data, data[]/trader_address, data[]/trader_address_label, data[]/total_pnl, data[]/roi, data[]/account_value, pagination, pagination.page |

## Field Notes

### Inputs

- `address`
- `filters`
- `filters.token_symbol`
- `filters.position_value_usd`
- `filters.position_value_usd.min`
- `filters.position_value_usd.max`
- `filters.position_type`
- `filters.unrealized_pnl_usd`
- `filters.unrealized_pnl_usd.min`
- `filters.unrealized_pnl_usd.max`
- `order_by`
- `order_by[]/field`
- `order_by[]/direction`
- `date`
- `date.from`
- `date.to`
- `filters.side`
- `filters.action`
- `filters.crossed`
- `filters.size`
- `filters.size.min`
- `filters.size.max`
- `filters.start_position`
- `filters.start_position.min`
- `filters.start_position.max`
- `filters.closed_pnl`
- `filters.closed_pnl.min`
- `filters.closed_pnl.max`
- `filters.fee_usd`
- `filters.fee_usd.min`
- `filters.fee_usd.max`
- `filters.fee_token_symbol`
- `filters.oid`
- `filters.oid.min`
- `filters.oid.max`
- `filters.price`
- `filters.price.min`
- `filters.price.max`
- `filters.value_usd`
- `filters.value_usd.min`

### Outputs

- `data`
- `data.assetPositions`
- `data.assetPositions[]/position`
- `data.assetPositions[]/position_type`
- `data.crossMaintenanceMarginUsed`
- `data.cross_margin_summary_account_value_usd`
- `data.cross_margin_summary_total_margin_used_usd`
- `data.cross_margin_summary_total_net_liquidation_position_on_usd`
- `data.cross_margin_summary_total_raw_usd`
- `data.margin_summary_account_value_usd`
- `data.margin_summary_total_margin_used_usd`
- `data.margin_summary_total_net_liquidation_position_usd`
- `data.margin_summary_total_raw_usd`
- `data.time`
- `data.withdrawable`
- `pagination`
- `pagination.page`
- `pagination.per_page`
- `pagination.is_last_page`
- `data[]/timestamp`
- `data[]/side`
- `data[]/action`
- `data[]/block_number`
- `data[]/token_symbol`
- `data[]/price`
- `data[]/size`
- `data[]/value_usd`
- `data[]/start_position`
- `data[]/closed_pnl`
- `data[]/crossed`
- `data[]/fee_usd`
- `data[]/fee_token_symbol`
- `data[]/transaction_hash`
- `data[]/user`
- `data[]/oid`
- `data[]/trader_address`
- `data[]/trader_address_label`
- `data[]/price_usd`
- `data[]/pnl_usd_realised`
- `data[]/pnl_usd_unrealised`
- `data[]/holding_amount`
- `data[]/position_value_usd`
- `data[]/max_balance_held`
- `data[]/max_balance_held_usd`
- `data[]/still_holding_balance_ratio`

### Important Constraints Or Gaps

- 7 of 7 endpoints in this group have MPP payment metadata in the local feed. Unpriced feed endpoints may still require a native Nansen API key or a subscription plan.
- Native docs use the `apikey` header. Nansen MPP docs say supported priced `/api/v1/*` endpoints can use `Authorization: Payment` instead of an API key.
- Standard API rate limits are documented as 20 requests per second and 300 requests per minute. x402 docs separately mention wallet-based limits of 5 requests per second and 60 requests per minute.

## Use Cases

### Find profitable Hyperliquid traders

Perp leaderboard, perps screeners, token perp PnL leaderboards, wallet perp positions, and wallet perp trades can identify addresses with strong realized or unrealized performance. Personal users can study strategies; businesses can power copytrading research, trader rankings, or risk dashboards. Key fields include `address`, `token_symbol`, `side`, `position_value_usd`, `leverage`, `entry_price`, `mark_price`, `liquidation_price`, `funding_usd`, `upnl_usd`, and PnL fields.

### Monitor liquidation and leverage risk

Open position fields let analysts detect crowded long or short exposure, high leverage, negative funding, or liquidation prices near market. A trading desk can automate alerts for watched wallets or tokens; a protocol risk team can track whether influential traders are reducing or adding risk. The data is observational and should not be used as an execution guarantee.

### Perp token market selection

Perp screener and token perp endpoints help identify which Hyperliquid markets have active volume, leaderboards, and high-signal participants. This can guide which markets a person researches or which markets a business includes in alerts, reports, or routing logic.

### Smart-money perps strategy review

Combining smart-money perp trades with address perp positions and per-token leaderboards can show whether smart cohorts are opening, closing, or flipping positions. That supports strategy review, not automatic copying without separate execution, liquidity, slippage, and risk controls.
