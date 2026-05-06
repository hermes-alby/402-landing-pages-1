# Exchange Rates API Uses

## Service Summary

Exchange Rates is a Locus MPP wrapper around AbstractAPI's Exchange Rates API. It exposes live rates, historical rates, and amount conversion for fiat currencies plus selected crypto and commodity symbols. The original provider API requires an AbstractAPI key and quota-plan access; the MPP wrapper exposes the same practical jobs through paid per-request POST endpoints.

The service is most valuable when a user or agent needs occasional exchange-rate data without managing a provider account, or when a workflow needs to attach payment and access to a single request. It should be treated as a data lookup and conversion service, not as a payment settlement, accounting-policy, tax, or compliance authority.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Rate Lookups And History | 2 | Retrieve current or historical rate tables for one base currency against one or more target currencies. | [`api-uses/rate-lookups-and-history.md`](api-uses/rate-lookups-and-history.md) |
| Currency Amount Conversion | 1 | Convert a concrete amount from one currency into another with the rate used for the calculation. | [`api-uses/currency-amount-conversion.md`](api-uses/currency-amount-conversion.md) |

## Highest-Value Uses

The strongest use is transaction and quote normalization: turning a foreign-currency amount into a familiar reporting currency, with the converted amount and exchange rate preserved for review. This helps invoices, expense reports, procurement quotes, travel budgets, checkout previews, and agentic shopping workflows.

The second strongest use is rate-table lookup for multi-currency operations. Live and historical rate lookups can support price localization, treasury snapshots, historical reconciliation, currency movement checks, and coverage validation before a product expands into new currencies.

## Personal Use Opportunities

- Estimate international purchases, travel costs, rent, tuition, deposits, or subscriptions in a home currency.
- Convert receipt amounts for personal budgeting, reimbursement, or tax-preparation notes.
- Check current or historical currency movement before deciding when to exchange funds.
- Build lightweight spreadsheets or agents that need occasional exchange-rate lookups without a monthly API plan.

## Business Use Opportunities

- Localize product prices, invoice previews, and sales quotes across currencies.
- Normalize supplier quotes, expenses, card charges, refunds, and foreign-currency invoices before approval or reconciliation.
- Monitor treasury exposure by converting balances, receivables, and payables into a reporting currency.
- Backtest pricing, margin, revenue, or procurement assumptions using rates for specific historical dates.
- Add rate evidence to agent-generated procurement, finance, or customer-service workflows.

## Endpoint Group Summaries

### Rate Lookups And History

This group covers `POST /abstract-exchange-rates/live` and `POST /abstract-exchange-rates/historical`. Both endpoints accept `base` and optional `target`; historical also requires `date`. They return rate maps keyed by target currency code, with `last_updated` for live rates and `date` for historical rates. They are best for workflows that need a rate table, current freshness evidence, or historical context rather than a single converted amount.

Full details: [`api-uses/rate-lookups-and-history.md`](api-uses/rate-lookups-and-history.md)

### Currency Amount Conversion

This group covers `POST /abstract-exchange-rates/convert`. It accepts `base`, `target`, optional `base_amount`, and optional `date`, then returns the converted amount and exchange rate. It is best for transaction-level workflows such as checkout quotes, expense normalization, invoice review, procurement thresholds, and travel planning.

Full details: [`api-uses/currency-amount-conversion.md`](api-uses/currency-amount-conversion.md)

## Field And Data Themes

- Currency identifiers: `base` and `target` use ISO 4217-style currency codes; docs examples also include selected crypto symbols.
- Time context: `last_updated` indicates live-rate freshness, while `date` anchors historical lookups and conversions.
- Rate maps: `exchange_rates` is a dynamic object keyed by currency code, useful for multi-currency normalization.
- Transaction amounts: `base_amount`, `converted_amount`, and `exchange_rate` support quote, invoice, receipt, and approval workflows.
- Payment metadata: all three MPP endpoints list a Tempo charge amount of `6000` and the MPP markdown estimates `$0.006` per call.
