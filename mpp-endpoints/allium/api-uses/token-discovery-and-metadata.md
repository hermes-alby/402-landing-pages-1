# Allium: Token Discovery And Metadata API Uses

## What This Endpoint Group Does

This endpoint group helps a client turn a human token clue, such as a name, ticker, chain, or contract address, into an Allium-supported token identity that can safely feed downstream price, wallet, transaction, and PnL calls. It is the discovery and normalization layer for Allium's realtime data surface: search when the user only knows a symbol or name, list when an application needs top or filtered tokens, and chain-address when a system already has addresses and needs canonical metadata or not-found errors.

The returned data is useful because it combines identifiers with market context. A response can include chain, contract address, token type, decimals, name, symbol, current USD price, logo URL, supply, fully diluted valuation, liquidity, volume, trade counts, recent price changes, holder count, creation time, and chain-specific metadata. That lets an application choose the right asset, reject unsupported or suspicious inputs, and display or rank tokens before spending additional calls on valuation or wallet analysis.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/developer/tokens/search` | Search tokens by name or symbol. | Required `q`; optional `chain`, `sort`, `granularity`, `order`, `limit`, `volume_usd_1d_threshold`, `volume_usd_1h_threshold`. | Array of token objects with `chain`, `address`, `type`, `price`, `decimals`, `info.name`, `info.symbol`, and optional `attributes`. |
| POST | `/api/v1/developer/tokens/chain-address` | Resolve one or more known token contract addresses on specified chains. | JSON array of 1-200 objects with required `token_address` and lowercase `chain`. | Array containing token objects or `TokenNotFoundError` objects with `error`, `address`, and `chain`. |
| GET | `/api/v1/developer/tokens` | List supported tokens, optionally sorted or filtered by market activity. | Optional `chain`, `sort`, `granularity`, `order`, `limit`, `volume_usd_1d_threshold`, `volume_usd_1h_threshold`. | Array of token objects with identifiers, token standard, decimals, current USD price, name/symbol, and optional market attributes. |

## Field Notes

### Inputs

- `q` is required only for search and performs a case-insensitive substring search over token name and symbol.
- `chain` is optional for search/list; omitting it searches or lists across all supported tokens for the endpoint. Where provided, it should be a lowercase chain name.
- Search/list sorting supports `volume`, `trade_count`, and `fully_diluted_valuation`; `order` is `asc` or `desc` and defaults to `desc`.
- `granularity` is only relevant when sorting by `volume` or `trade_count`; the OpenAPI enum is `1h` or `1d`.
- `limit` defaults to 200 and has an OpenAPI maximum of 200.
- `volume_usd_1d_threshold` and `volume_usd_1h_threshold` can filter discovery results to tokens with at least that much USD-denominated trading volume.
- Chain-address lookup requires a JSON array with `token_address` and `chain` for each item, with a documented minimum of 1 and maximum of 200 items.

### Outputs

- Core identity fields are `chain`, `address`, token `type`, `decimals`, `info.name`, and `info.symbol`.
- `type` can distinguish native assets, EVM ERC-20/721/1155 tokens, Solana SPL tokens, Sui tokens, Near token standards, Stellar token types, and null values when classification is unavailable.
- `price` is the current USD price when available, which can support immediate display or rough ranking without a separate price endpoint.
- `attributes` can include liquidity, 1h/1d price changes, total supply, fully diluted valuation, 1h/1d/24h volume, trade counts, all-time high/low prices, logo URL, token creation time, holder count, and Stellar-specific fields.
- Chain-address results can include per-item not-found errors, preserving schema drift and unsupported-token cases instead of forcing the caller to infer missing records.

### Important Constraints Or Gaps

- These are paid machine-payment endpoints on `https://agents.allium.so`: search costs $0.03, chain-address costs $0.02, and list costs $0.03 per call in the pricing snapshot.
- Machine-payments docs say realtime endpoints need no API key, registration, subscription, or minimum spend, but the direct Allium OpenAPI still documents `APIKeyBearer` for standard API access.
- Calls require a wallet and USDC payment authorization over Tempo MPP or x402 unless using standard direct Allium API access.
- The `/developer/` data bucket is limited to 3 requests per second per wallet; HTTP `429` means callers should back off.
- Allium describes realtime API freshness as about 3-4 seconds, but token market attributes can still vary by chain, market coverage, and endpoint availability.
- The free supported-chain snapshot lists `/api/v1/developer/tokens` and `/api/v1/developer/tokens/search` on arbitrum, base, ethereum, near, optimism, polygon, solana, and stellar. The snapshot does not include `/api/v1/developer/tokens/chain-address`, even though the endpoint docs include a supported-chain widget; production clients should verify support before paid calls.
- For Stellar token search/list, docs require `chain=stellar` and say sort, granularity, order, and volume thresholds are currently not supported.
- USD prices, FDV, liquidity, holder counts, and volume metrics are discovery signals, not issuer verification, legal classification, sanctions screening, smart-contract audits, or investment advice.
- Data tips state Allium returns EVM addresses in lowercase and uses special native-token addresses, which matters when matching against wallet, portfolio, or compliance systems.

## Use Cases

### Wallet Token Picker And Portfolio Import

A consumer wallet, tax tool, or personal portfolio tracker can let a user type "USDC", "ETH", or a partial token name, then use search results to show chain, symbol, logo, decimals, price, and liquidity/volume context before the user selects an asset. The selected `chain` and `address` become stable inputs for price, balance, transaction, or PnL calls.

The main value is reducing wrong-token selection, especially when symbols collide across chains or when spam tokens imitate known names. The application should still warn when liquidity, holder count, price, or metadata is missing, and it should avoid treating Allium metadata as a guarantee that a token is safe.

### Address Book Normalization For Crypto Operations

A business handling deposits, payments, treasury positions, or customer asset mappings can use chain-address lookup to validate contract addresses already stored in its systems. The endpoint returns canonical chain/address metadata, decimals for accounting math, and explicit per-item not-found errors for unsupported or invalid entries.

This is useful before pricing assets, reconciling balances, or building allowed-token lists. It also helps expose stale internal records, but it does not replace internal approval workflows, token-list governance, or legal review for supported assets.

### Liquid Token Discovery For Trading Or Market Monitoring

A trading dashboard, alerting agent, or market researcher can list tokens sorted by `volume`, `trade_count`, or `fully_diluted_valuation`, then apply 1h or 1d volume thresholds to find active markets. Returned price, volume, trade count, liquidity, FDV, and recent price-change fields can seed watchlists without first knowing token addresses.

This is strongest for lightweight discovery and triage. The 200-result limit, per-call cost, rate limit, and Stellar filter limitations mean broader market scans need caching, batching strategy, and endpoint support checks.

### Token Listing Intake And Risk Triage

An exchange, wallet, payments product, or fintech data team can use search/list outputs as an early intake screen for candidate assets. Fields like holders count, token creation time, liquidity, volume, FDV, token standard, and all-time price bounds can help prioritize which assets deserve deeper diligence.

The returned metadata can identify obvious low-activity or recently created tokens, but compliance teams still need sanctions checks, issuer review, smart-contract analysis, and jurisdiction-specific legal classification. Allium's metadata should be treated as factual market context, not as a final risk decision.

### Agentic Data Routing Before Paid Follow-Up Calls

An AI agent operating under a small USDC budget can call search or list first to resolve the exact token identity, then decide whether to spend more on price history, wallet balances, or PnL. The token metadata reduces wasted calls caused by ambiguous symbols, unsupported chains, or malformed contract addresses.

Because each discovery call costs $0.02-$0.03 and the data bucket is limited to 3 requests per second per wallet, agents should cache supported-chain data and recent token resolutions. They should also require explicit policy controls before signing payments in production, especially when user prompts could trigger repeated discovery loops.

### Cross-Chain Asset Catalog Maintenance

A business maintaining an internal asset catalog can periodically list supported tokens by chain and enrich its catalog with Allium addresses, decimals, token standards, names, symbols, logo URLs, and market attributes. This creates a practical reference table for product UI, reporting pipelines, and downstream Allium API calls.

The catalog should preserve null fields and per-chain differences rather than collapsing tokens by symbol. Freshness is useful for near-realtime market context, but production catalogs should record retrieval timestamps, source versions, and validation status because token metadata and market attributes can change.
