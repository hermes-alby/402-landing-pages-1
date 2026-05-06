# Nansen: Smart Money Flows And Holdings API Uses

## What This Endpoint Group Does

Track aggregate behavior of Nansen-labeled smart traders, funds, whales, and other high-signal wallet cohorts across holdings, flows, DEX trades, perps, and DCA activity.

These endpoints aggregate by smart-money cohorts rather than one arbitrary wallet or one token market alone.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/smart-money/netflow` | Get Smart Money Netflow Data | chains, filters, filters.include_smart_money_labels, filters.exclude_smart_money_labels, filters.token_address, filters.include_stablecoins, filters.include_native_tokens | data, data[]/token_address, data[]/token_symbol, data[]/net_flow_1h_usd, data[]/net_flow_24h_usd, data[]/net_flow_7d_usd, data[]/net_flow_30d_usd, data[]/chain |
| POST | `/api/v1/smart-money/dex-trades` | Get Smart Money DEX Trades Data | chains, filters, filters.include_smart_money_labels, filters.exclude_smart_money_labels, filters.chain, filters.transaction_hash, filters.trader_address | data, data[]/chain, data[]/block_timestamp, data[]/transaction_hash, data[]/trader_address, data[]/trader_address_label, data[]/token_bought_address, data[]/token_sold_address |
| POST | `/api/v1/smart-money/perp-trades` | Get Smart Money Perpetual Trades Data | filters, filters.include_smart_money_labels, filters.exclude_smart_money_labels, filters.trader_address, filters.trader_address_label, filters.token_symbol, filters.type | data, data[]/trader_address_label, data[]/trader_address, data[]/token_symbol, data[]/side, data[]/action, data[]/token_amount, data[]/price_usd |
| POST | `/api/v1/smart-money/dcas` | Get Smart Money DCAs Data | filters, filters.include_smart_money_labels, filters.exclude_smart_money_labels, filters.dca_created_at, filters.dca_created_at.from, filters.dca_created_at.to, filters.transaction_hash | data, data[]/dca_created_at, data[]/dca_updated_at, data[]/trader_address, data[]/transaction_hash, data[]/trader_address_label, data[]/dca_vault_address, data[]/input_token_address |
| POST | `/api/v1/smart-money/holdings` | Get Smart Money Holdings Data | chains, filters, filters.include_smart_money_labels, filters.exclude_smart_money_labels, filters.include_stablecoins, filters.include_native_tokens, filters.value_usd | data, data[]/chain, data[]/token_address, data[]/token_symbol, data[]/token_sectors, data[]/value_usd, data[]/balance_24h_percent_change, data[]/holders_count |
| POST | `/api/v1/smart-money/historical-holdings` | Get Smart Money Historical Holdings Data | date_range, date_range.from, date_range.to, chains, filters, filters.include_smart_money_labels, filters.exclude_smart_money_labels | data, data[]/date, data[]/chain, data[]/token_address, data[]/token_symbol, data[]/token_sectors, data[]/smart_money_labels, data[]/balance |

## Field Notes

### Inputs

- `chains`
- `filters`
- `filters.include_smart_money_labels`
- `filters.exclude_smart_money_labels`
- `filters.token_address`
- `filters.include_stablecoins`
- `filters.include_native_tokens`
- `filters.token_sector`
- `filters.trader_count`
- `filters.trader_count.min`
- `filters.trader_count.max`
- `filters.token_age_days`
- `filters.token_age_days.min`
- `filters.token_age_days.max`
- `filters.market_cap_usd`
- `filters.market_cap_usd.min`
- `filters.market_cap_usd.max`
- `premium_labels`
- `pagination`
- `pagination.page`
- `pagination.per_page`
- `order_by`
- `order_by[]/field`
- `order_by[]/direction`
- `filters.chain`
- `filters.transaction_hash`
- `filters.trader_address`
- `filters.trader_address_label`
- `filters.token_bought_address`
- `filters.token_sold_address`
- `filters.token_bought_amount`
- `filters.token_bought_amount.min`
- `filters.token_bought_amount.max`
- `filters.token_sold_amount`
- `filters.token_sold_amount.min`
- `filters.token_sold_amount.max`
- `filters.token_bought_symbol`
- `filters.token_sold_symbol`
- `filters.token_bought_age_days`
- `filters.token_bought_age_days.min`

### Outputs

- `data`
- `data[]/token_address`
- `data[]/token_symbol`
- `data[]/net_flow_1h_usd`
- `data[]/net_flow_24h_usd`
- `data[]/net_flow_7d_usd`
- `data[]/net_flow_30d_usd`
- `data[]/chain`
- `data[]/token_sectors`
- `data[]/trader_count`
- `data[]/token_age_days`
- `data[]/market_cap_usd`
- `pagination`
- `pagination.page`
- `pagination.per_page`
- `pagination.is_last_page`
- `data[]/block_timestamp`
- `data[]/transaction_hash`
- `data[]/trader_address`
- `data[]/trader_address_label`
- `data[]/token_bought_address`
- `data[]/token_sold_address`
- `data[]/token_bought_amount`
- `data[]/token_sold_amount`
- `data[]/token_bought_symbol`
- `data[]/token_sold_symbol`
- `data[]/token_bought_age_days`
- `data[]/token_sold_age_days`
- `data[]/token_bought_market_cap`
- `data[]/token_sold_market_cap`
- `data[]/token_bought_fdv`
- `data[]/token_sold_fdv`
- `data[]/trade_value_usd`
- `data[]/side`
- `data[]/action`
- `data[]/token_amount`
- `data[]/price_usd`
- `data[]/value_usd`
- `data[]/type`
- `data[]/dca_created_at`
- `data[]/dca_updated_at`
- `data[]/dca_vault_address`
- `data[]/input_token_address`
- `data[]/output_token_address`
- `data[]/deposit_token_amount`

### Important Constraints Or Gaps

- 6 of 6 endpoints in this group have MPP payment metadata in the local feed. Unpriced feed endpoints may still require a native Nansen API key or a subscription plan.
- Native docs use the `apikey` header. Nansen MPP docs say supported priced `/api/v1/*` endpoints can use `Authorization: Payment` instead of an API key.
- Standard API rate limits are documented as 20 requests per second and 300 requests per minute. x402 docs separately mention wallet-based limits of 5 requests per second and 60 requests per minute.

## Use Cases

### Follow smart money accumulation and distribution

A person can identify tokens being accumulated or distributed by funds, smart traders, whales, and public figures using netflow, holdings, historical holdings, DEX trades, and DCA endpoints. A business can turn `net_flow_1h_usd`, `net_flow_24h_usd`, holdings, trader counts, labels, and chain filters into watchlists, alerts, or research notes. These signals are cohort analytics, not trading instructions.

### Fund and whale behavior monitoring

Asset managers, market makers, and protocol teams can watch whether selected smart-money labels are increasing exposure, exiting positions, or rotating between sectors. Fields such as `include_smart_money_labels`, `token_sector`, `trader_count`, `buy_volume`, `sell_volume`, and historical dates help separate broad market noise from high-signal cohort behavior.

### Copytrading candidate discovery with risk checks

Smart-money DEX trades, perps trades, holdings, and DCA orders can identify wallets or cohorts worth deeper review. A personal trader might shortlist addresses that repeatedly buy early or manage risk well; a business can score strategies before presenting candidates to users. The workflow needs downstream guardrails because labels can be gated by plan or premium-label settings and past performance can decay quickly.

### CEX and liquidity flow surveillance

Netflow definitions include DEX trading activity and centralized-exchange transfers. Protocol teams and liquidity managers can use smart-money flows to detect accumulation, exchange deposits, or withdrawal patterns that may affect liquidity campaigns, market making, or launch timing.
