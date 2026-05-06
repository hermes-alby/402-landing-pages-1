# Exchange Rates: Rate Lookups And History API Uses

## What This Endpoint Group Does

This group retrieves exchange-rate tables for a base currency. `live` returns the latest available rates and `historical` returns rates for a specified `date`. Both endpoints accept a required `base` currency and optional `target` currency or comma-separated target currencies. If no target is supplied, the upstream docs say all available currencies are returned.

The returned data is useful when a workflow needs rate evidence rather than a precomputed converted amount. The key outputs are the base currency, a timestamp or requested date, and an `exchange_rates` object keyed by target currency code.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/abstract-exchange-rates/live` | Get latest rates for a base currency against one or more target currencies. | `base`, optional `target` | `base`, `last_updated`, `exchange_rates` |
| POST | `/abstract-exchange-rates/historical` | Get rates for a base currency on a specific historical date. | `base`, `date`, optional `target` | `base`, `date`, `exchange_rates` |

## Field Notes

### Inputs

`base` is the required source currency code for both endpoints. Official docs describe currency parameters as ISO 4217-style codes such as `USD`, `EUR`, and `JPY`, and examples also include crypto symbols such as `BTC` and `ETH`.

`target` is optional for both endpoints. For live and historical lookups, official docs say multiple targets can be comma-separated, for example `EUR,CAD,AUD`. If omitted, all available rates are returned, which is more useful for broad normalization but may return more data than a narrow workflow needs.

`date` is required only for historical lookups and must use `YYYY-MM-DD` format.

### Outputs

`exchange_rates` is an object whose keys are target currency codes and whose values are numeric rates versus `base`. The live endpoint also documents `last_updated` as a Unix timestamp, which lets users decide whether the data is fresh enough for the task. The historical endpoint returns the requested `date` instead.

### Important Constraints Or Gaps

The MPP OpenAPI does not publish detailed 200-response schemas, so output fields here are derived from official AbstractAPI docs. The upstream historical endpoint is marked closed beta in official docs, even though the MPP wrapper exposes it. The product page says paid plans can receive data updated every 60 seconds for most currencies, while free-plan data is typically updated every 45-60 minutes; the MPP wrapper's effective freshness tier is not documented.

## Use Cases

### Multi-Currency Price Localization

A person selling digital products internationally can use `live` rates to show approximate prices in a buyer's local currency without maintaining a monthly provider subscription. The workflow needs `base` for the seller's settlement currency, `target` for displayed currencies, `exchange_rates` to calculate local price labels, and `last_updated` to decide whether a cached quote should be refreshed.

A business can use the same endpoint to localize catalog prices across storefronts, emails, and checkout previews. The returned rate table enables automated price generation, country-specific price checks, and alerts when currency moves make local prices drift too far from margin targets. The endpoint should not be used as the final payment settlement source unless finance has approved the rate source, rounding rules, cache window, and tax treatment.

### Treasury And Cash-Position Monitoring

An individual with savings, invoices, or investments across currencies can query live rates for a base currency such as `USD` and targets such as `EUR,GBP,THB` to estimate current purchasing power. The field that matters is the `exchange_rates` map, with `last_updated` indicating whether the estimate is current enough for planning.

For a business, the same lookup can support daily treasury snapshots. Finance can convert foreign bank balances, payables, and receivables into the reporting currency, then trigger review when rate moves materially change net exposure. Because the endpoint returns rates rather than balances, it must be combined with internal ledger data and documented rounding/accounting policy.

### Historical Transaction Reconciliation

A person filing taxes or tracking investment records can use the `historical` endpoint to retrieve rates for a specific `date` when a foreign-currency transaction occurred. The `base`, `target`, `date`, and returned `exchange_rates` help reconstruct what a transaction was worth in a reporting currency on that date.

A business can use historical lookups to reconcile card charges, supplier invoices, refunds, and accounting entries when the transaction currency differs from the ledger currency. The endpoint helps automate back-office checks, but it does not replace official bank settlement rates or statutory exchange-rate requirements where those are mandated.

### Procurement And Vendor Quote Comparison

A person comparing overseas purchases can request current rates for the relevant vendor currencies and translate quoted prices into a common base currency. Using a narrow `target` set keeps the lookup focused and lets a spreadsheet or agent calculate landed-cost estimates alongside shipping and taxes.

Procurement teams can use live rates to normalize supplier quotes from multiple countries before routing them for approval. The output enables apples-to-apples comparison and threshold alerts when a quote becomes unfavorable due to currency movement. For binding decisions, teams still need quote validity windows, payment terms, fees, and hedge policies; the rate endpoint only supplies market-rate context.

### Currency Movement Backtesting

A person evaluating when to exchange money for travel, tuition, or a property deposit can use `historical` rates for selected dates to understand how volatile a currency pair has been. The useful fields are the date-specific `exchange_rates` and consistent `base`/`target` choices across calls.

Businesses can backtest pricing, hedging, or supplier-cost assumptions by sampling historical rates around invoice dates, order dates, or month-end closes. The endpoint enables scenario analysis and variance explanations, but users need separate scheduling, storage, and analytics logic because the API returns one requested date per call rather than a complete time series.

### Currency Coverage And Fallback Planning

A developer or agent can call live rates without a `target` to inspect the returned `exchange_rates` keys and verify whether planned currencies are available in the current response. This is useful before wiring a personal budgeting sheet or travel planner around a specific set of currency symbols.

A business can use the same approach to test coverage before launching into a new region or adding a checkout currency. If a needed symbol is missing or stale, the workflow can fall back to manual review, another rate source, or disabling a local-currency display. Exact supported-symbol coverage remains source-dependent, so production systems should not rely solely on marketing claims.
