# Nansen: Wallet Profiling And Portfolio Analysis API Uses

## What This Endpoint Group Does

Analyze wallet or entity holdings, transfers, counterparties, labels, related wallets, DeFi positions, and spot-token PnL.

These endpoints start from an address, entity, transaction, or wallet set and return portfolio, activity, identity, relationship, and performance context.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/profiler/address/transactions` | Get Address Transactions Data | address, chain, date, date.from, date.to, hide_spam_token, filters | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/chain, data[]/method, data[]/tokens_sent |
| POST | `/api/v1/transaction-with-token-transfer-lookup` | Get Transaction with Token Transfer Lookup Data | chain, transaction_hash, block_timestamp | data, data[]/chain, data[]/transaction_hash, data[]/from_address, data[]/from_address_label, data[]/to_address, data[]/to_address_label, data[]/native_value |
| POST | `/api/v1/profiler/address/pnl-summary` | Get Address PnL Summary Data | address, entity_name, chain, date, date.from, date.to | pagination, pagination.page, pagination.per_page, pagination.is_last_page, top5_tokens, top5_tokens[]/realized_pnl, top5_tokens[]/realized_roi, top5_tokens[]/token_address |
| POST | `/api/v1/profiler/address/current-balance` | Get Address Current Balance Data | address, entity_name, chain, hide_spam_token, filters, filters.value_usd, filters.value_usd.min | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/chain, data[]/address, data[]/token_address |
| POST | `/api/v1/profiler/address/counterparties` | Get Address Counterparties Data | address, entity_name, chain, date, date.from, date.to, source_input | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/counterparty_address, data[]/counterparty_address_label, data[]/interaction_count |
| POST | `/api/v1/profiler/address/historical-balances` | Get Address Historical Balances Data | address, entity_name, chain, date, date.from, date.to, filters | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/block_timestamp, data[]/token_address, data[]/chain |
| POST | `/api/v1/profiler/address/related-wallets` | Get Address Related Wallets Data | address, chain, pagination, pagination.page, pagination.per_page, order_by, order_by[]/field | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/address, data[]/address_label, data[]/relation |
| POST | `/api/v1/profiler/address/pnl` | Get Address PnL Data | address, entity_name, chain, date, date.from, date.to, filters | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/token_address, data[]/token_symbol, data[]/token_price |
| POST | `/api/v1/profiler/address/labels` | Get Address Labels | address, chain, pagination, pagination.page, pagination.per_page | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/label, data[]/category |
| POST | `/api/v1/profiler/address/premium-labels` | Get Address Premium Labels | address, chain, pagination, pagination.page, pagination.per_page | pagination, pagination.page, pagination.per_page, pagination.is_last_page, data, data[]/label, data[]/category |
| POST | `/api/v1/portfolio/defi-holdings` | Get Portfolio DeFi Holdings Data | wallet_address | summary, summary.total_value_usd, summary.total_assets_usd, summary.total_debts_usd, summary.total_rewards_usd, summary.token_count, summary.protocol_count, protocols |

## Field Notes

### Inputs

- `address`
- `chain`
- `date`
- `date.from`
- `date.to`
- `hide_spam_token`
- `filters`
- `filters.token_symbol`
- `filters.token_address`
- `filters.counterparty_name`
- `filters.counterparty_address`
- `filters.volume_usd`
- `filters.volume_usd.min`
- `filters.volume_usd.max`
- `filters.method`
- `filters.source_type`
- `pagination`
- `pagination.page`
- `pagination.per_page`
- `order_by`
- `order_by[]/field`
- `order_by[]/direction`
- `transaction_hash`
- `block_timestamp`
- `entity_name`
- `filters.value_usd`
- `filters.value_usd.min`
- `filters.value_usd.max`
- `filters.price_usd`
- `filters.price_usd.min`
- `filters.price_usd.max`
- `filters.token_amount`
- `filters.token_amount.min`
- `filters.token_amount.max`
- `filters.token_name`
- `source_input`
- `group_by`
- `filters.interaction_count`
- `filters.interaction_count.min`
- `filters.interaction_count.max`

### Outputs

- `pagination`
- `pagination.page`
- `pagination.per_page`
- `pagination.is_last_page`
- `data`
- `data[]/chain`
- `data[]/method`
- `data[]/tokens_sent`
- `data[]/tokens_sent[]/token_symbol`
- `data[]/tokens_sent[]/token_amount`
- `data[]/tokens_sent[]/price_usd`
- `data[]/tokens_sent[]/value_usd`
- `data[]/tokens_sent[]/token_address`
- `data[]/tokens_sent[]/chain`
- `data[]/tokens_sent[]/from_address`
- `data[]/tokens_sent[]/to_address`
- `data[]/tokens_sent[]/from_address_label`
- `data[]/tokens_sent[]/to_address_label`
- `data[]/tokens_received`
- `data[]/tokens_received[]/token_symbol`
- `data[]/tokens_received[]/token_amount`
- `data[]/tokens_received[]/price_usd`
- `data[]/tokens_received[]/value_usd`
- `data[]/tokens_received[]/token_address`
- `data[]/tokens_received[]/chain`
- `data[]/tokens_received[]/from_address`
- `data[]/tokens_received[]/to_address`
- `data[]/tokens_received[]/from_address_label`
- `data[]/tokens_received[]/to_address_label`
- `data[]/volume_usd`
- `data[]/block_timestamp`
- `data[]/transaction_hash`
- `data[]/source_type`
- `data[]/from_address`
- `data[]/from_address_label`
- `data[]/to_address`
- `data[]/to_address_label`
- `data[]/native_value`
- `data[]/dated_native_price`
- `data[]/dated_native_value_usd`
- `data[]/current_native_price`
- `data[]/current_native_value_usd`
- `data[]/receipt_status`
- `data[]/token_transfer_array`
- `data[]/token_transfer_array[]/from_address`

### Important Constraints Or Gaps

- 8 of 11 endpoints in this group have MPP payment metadata in the local feed. Unpriced feed endpoints may still require a native Nansen API key or a subscription plan.
- Native docs use the `apikey` header. Nansen MPP docs say supported priced `/api/v1/*` endpoints can use `Authorization: Payment` instead of an API key.
- Standard API rate limits are documented as 20 requests per second and 300 requests per minute. x402 docs separately mention wallet-based limits of 5 requests per second and 60 requests per minute.

## Use Cases

### Wallet due diligence and relationship mapping

A person can inspect an address before copying, funding, or interacting with it by combining balances, labels, counterparties, related wallets, and transactions. A business can triage counterparty risk or customer wallet history by looking at token holdings, labels, interaction counts, related addresses, and transaction details. The strongest fields are `address`, `entity_name`, `chain`, `token_address`, `value_usd`, `counterparty_address`, labels, transaction hashes, timestamps, and pagination metadata.

### Portfolio monitoring across wallets and chains

Current and historical balances, DeFi holdings, and token transfer lookups let an investor or treasury team track exposure by chain, asset, USD value, and protocol position. Automations can alert when a watched wallet accumulates a token, bridges assets, increases DeFi exposure, or crosses a USD threshold. This is analytics evidence, not custody or accounting finality, and entity-wide queries can hide the source address in balance responses.

### PnL review for traders and tax preparation support

Address PnL and PnL summary fields show realized and unrealized PnL, ROI, cost basis, bought/sold amounts, current holdings, win rate, and top trades. A personal trader can identify which tokens drove gains or losses; a business can prefill human review queues for performance reporting or tax workflows. The endpoint does not replace professional tax logic because chain support, pricing methodology, and missing offchain context still matter.

### Investigation handoff with raw transaction evidence

Transactions and token-transfer lookup fields such as chain, transaction hash, token address, amount, USD value, timestamps, and labels can package evidence for analysts. Compliance, support, or incident teams can use this to reconstruct what happened before deciding whether to escalate, contact a user, or request more information. The artifacts should preserve source drift for endpoints without direct docs, such as account lookup.
