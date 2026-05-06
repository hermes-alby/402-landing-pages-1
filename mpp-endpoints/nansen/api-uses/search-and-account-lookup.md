# Nansen: Search And Account Lookup API Uses

## What This Endpoint Group Does

Resolve tokens, entities, token sectors, and account context that other Nansen API calls need before deeper wallet, token, or market analysis.

These endpoints are lookup and context helpers rather than direct analytics endpoints.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/account` | Get account information | apikey |  |
| POST | `/api/v1/search/entity-name` | General Search | search_query, result_type, chain, limit | tokens, tokens[]/name, tokens[]/symbol, tokens[]/chain, tokens[]/address, tokens[]/price, tokens[]/volume_24h, tokens[]/market_cap |
| GET | `/api/v1/search/token-sectors` | List token sectors | apikey |  |
| POST | `/api/v1/search/general` | General Search | search_query, result_type, chain, limit | tokens, tokens[]/name, tokens[]/symbol, tokens[]/chain, tokens[]/address, tokens[]/price, tokens[]/volume_24h, tokens[]/market_cap |

## Field Notes

### Inputs

- `search_query`
- `result_type`
- `chain`
- `limit`

### Outputs

- `tokens`
- `tokens[]/name`
- `tokens[]/symbol`
- `tokens[]/chain`
- `tokens[]/address`
- `tokens[]/price`
- `tokens[]/volume_24h`
- `tokens[]/market_cap`
- `tokens[]/rank`
- `entities`
- `entities[]/name`
- `entities[]/tags`
- `entities[]/rank`
- `total_results`

### Important Constraints Or Gaps

- 0 of 4 endpoints in this group have MPP payment metadata in the local feed. Unpriced feed endpoints may still require a native Nansen API key or a subscription plan.
- Native docs use the `apikey` header. Nansen MPP docs say supported priced `/api/v1/*` endpoints can use `Authorization: Payment` instead of an API key.
- Standard API rate limits are documented as 20 requests per second and 300 requests per minute. x402 docs separately mention wallet-based limits of 5 requests per second and 60 requests per minute.
- `GET /api/v1/account`: No public OpenAPI/API-reference schema found in saved Nansen docs snapshots for this exact MPP feed path.
- `GET /api/v1/account`: Docs query could not find account endpoint fields.
- `POST /api/v1/search/entity-name`: No direct OpenAPI page for this MPP path; official docs query maps entity-name lookup to the General Search schema.
- `GET /api/v1/search/token-sectors`: No public OpenAPI/API-reference schema found in saved Nansen docs snapshots for this exact MPP feed path.
- `GET /api/v1/search/token-sectors`: Docs query could not find a documented token-sectors endpoint and only pointed to Token Screener sectors filters.

## Use Cases

### Resolve tokens and entities before paid calls

A person can search a ticker, contract address, or entity name before spending on deeper balance, PnL, or flow calls. A business can normalize user-entered symbols and entity names into chain-aware token addresses or Nansen entity names before routing jobs to wallet or token analysis pipelines. The useful fields are `search_query`, `result_type`, `chain`, token `address`, entity `name`, `tags`, and `rank`; the main limitation is that the entity-name and token-sector feed paths are not documented as standalone endpoints.

### Build safer workflow guards for agents

An agent can use search and account context as a cheap preflight step before calling higher-cost analytics endpoints. For example, it can reject ambiguous symbols, require a chain match, or ask a human to choose among multiple ranked token results. A business can log these lookups as provenance so later reports explain which token address or entity label was selected.

### Sector-aware token screening setup

Although `GET /search/token-sectors` is not documented in the current API reference, the docs confirm sector filters on Token Screener. A personal analyst or research desk can treat this feed path as a schema gap and fall back to known sector lists or Token Screener `filters.sectors` until the provider publishes a direct sector endpoint schema.
