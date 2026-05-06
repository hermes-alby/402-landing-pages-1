# CoinGecko: Price Quotes And Token Lookup API Uses

## What This Endpoint Group Does

This group turns asset identifiers into usable quote data. It covers current prices by CoinGecko ID, current token prices by contract address, searchable asset metadata, the supported coin ID map, and BTC exchange rates. It is the best fit when a workflow first needs to identify a crypto asset, normalize it to a stable ID, and attach a current price or conversion value.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/coingecko/simple-price` | Current coin prices by ID | `ids`, `vs_currencies`, optional market cap, volume, change, timestamp | Dynamic coin keys with price, market cap, 24h volume/change, `last_updated_at` |
| POST | `/coingecko/simple-token-price` | Current token prices by contract | `platform_id`, `contract_addresses`, `vs_currencies` | Dynamic contract keys with prices and optional market metrics |
| POST | `/coingecko/coins-list` | Coin ID map | `include_platform`, `status` | Coin `id`, `symbol`, `name`, optional platform contract maps |
| POST | `/coingecko/search` | Search coins, exchanges, categories, NFTs | `query` | Matching `coins`, `exchanges`, `categories`, `nfts` with IDs, ranks, names, symbols, thumbnails |
| POST | `/coingecko/exchange-rates` | BTC exchange rates | none | Currency/unit codes, names, units, values, and type |

## Field Notes

### Inputs

Use `ids` for known CoinGecko IDs and `contract_addresses` plus `platform_id` when the source system has chain contracts instead of IDs. `vs_currencies` controls quote currencies and can include multiple comma-separated targets. `include_last_updated_at` on simple price is important for stale-price checks. `coins-list` can include inactive coins through `status`, but official docs mark some inactive historical workflows as paid-plan-only upstream.

### Outputs

`simple-price` and `simple-token-price` return dynamic object keys, so consumers should not expect a fixed top-level field list. `coins-list` supplies durable IDs for later market and history endpoints. `search` returns multiple entity types, useful for ambiguity resolution. `exchange-rates` expresses BTC rates across fiat, crypto, commodities, and units.

### Important Constraints Or Gaps

MPP request fields are narrower than the official upstream parameter list for some endpoints. For example, the upstream simple endpoints document `names`, `symbols`, `include_tokens`, `include_last_updated_at`, and `precision`, but the MPP token-price wrapper only exposes a subset. Downstream systems should store source timestamps and handle missing quote fields.

## Use Cases

### Portfolio Mark-To-Market Without Provider Accounts

A person can keep a lightweight wallet or spreadsheet current by sending known CoinGecko IDs to `simple-price` with `vs_currencies=usd` and optional `include_market_cap`, `include_24hr_vol`, `include_24hr_change`, and `include_last_updated_at`. A business wallet, accounting tool, or payroll system can use the same fields to value holdings, flag stale prices, and convert balances into reporting currencies without maintaining a CoinGecko monthly plan for occasional lookups.

### Contract-Based Token Normalization

Many wallet and onchain systems start with a contract address rather than a CoinGecko ID. `simple-token-price` maps `platform_id` and `contract_addresses` to current quote data, while `coins-list` with `include_platform=true` can build a local mapping table from contract addresses to CoinGecko IDs. This helps agents reconcile token transfers, tag positions, and avoid confusing duplicate symbols.

### Checkout And Invoice Conversion Checks

An individual seller can quote a BTC-denominated amount in a local currency by using `exchange-rates`. A business that accepts crypto payments can combine `exchange-rates` for BTC units with `simple-price` for specific assets to show approximate fiat values, compare customer-facing quotes with internal accounting rates, and log which currency code and timestamp supported a conversion.

### Asset Search Before Research Or Trading

`search` helps a user disambiguate names and symbols before requesting deeper data. For example, a research assistant can search `pepe`, inspect matching coin IDs, market cap rank, thumbnails, categories, and NFT matches, then pass the selected ID into `coins-markets` or `coin-data`. This reduces bad joins caused by ticker collisions.
