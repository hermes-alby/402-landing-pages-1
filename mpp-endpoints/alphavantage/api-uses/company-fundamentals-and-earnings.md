# Alpha Vantage: Company Fundamentals And Earnings API Uses

## What This Endpoint Group Does

This endpoint group retrieves the company-level financial data needed for fundamental equity analysis. Given a stock ticker symbol, it can return a company profile and valuation snapshot, annual and quarterly income statements, balance sheets, cash-flow statements, and EPS history with estimates and surprise percentages.

The endpoints are useful together because they cover identity, scale, profitability, balance-sheet strength, cash generation, valuation ratios, and earnings execution for a public company. They are less useful for intraday trading or event monitoring by themselves; those workflows need price, news, transcript, or calendar endpoints from other Alpha Vantage groups.

## Endpoints Covered

| Method | Path | Provider function | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- | --- |
| POST | `/alphavantage/company-overview` | `OVERVIEW` | Retrieve a company profile and current valuation/ratio snapshot. | `symbol` | `Symbol`, `Name`, `Description`, `Exchange`, `Currency`, `Country`, `Sector`, `Industry`, `MarketCapitalization`, `PERatio`, `DividendYield`, `52WeekHigh`, `52WeekLow`, `AnalystTargetPrice` |
| POST | `/alphavantage/income-statement` | `INCOME_STATEMENT` | Retrieve annual and quarterly income statement history. | `symbol` | `symbol`, `annualReports`, `quarterlyReports`, revenue, gross profit, operating income, EBIT, EBITDA, net income, fiscal period fields |
| POST | `/alphavantage/balance-sheet` | `BALANCE_SHEET` | Retrieve annual and quarterly balance sheet history. | `symbol` | `symbol`, `annualReports`, `quarterlyReports`, assets, liabilities, shareholder equity, cash, debt, fiscal period fields |
| POST | `/alphavantage/cash-flow` | `CASH_FLOW` | Retrieve annual and quarterly cash-flow statement history. | `symbol` | `symbol`, `annualReports`, `quarterlyReports`, operating cash flow, capital expenditures, investing cash flow, financing cash flow, dividends |
| POST | `/alphavantage/earnings` | `EARNINGS` | Retrieve annual and quarterly EPS history, estimates, surprises, and surprise percentages. | `symbol` | `symbol`, `annualEarnings`, `quarterlyEarnings`, `fiscalDateEnding`, `reportedDate`, `reportedEPS`, `estimatedEPS`, `surprise`, `surprisePercentage` |

Each endpoint is documented locally as a paid MPP `POST` endpoint with JSON request bodies and per-request payment metadata of `8000` units, estimated as `$0.008` in the local inventory. This research did not call the paid endpoints.

## Field Notes

### Inputs

All endpoints in this group require only `symbol`, a public equity ticker such as `IBM`. The wrapper abstracts the upstream Alpha Vantage `apikey` query parameter and maps the upstream `GET /query?function=...&symbol=...` pattern to MPP `POST` endpoints with JSON request bodies.

Because the group is symbol-driven, practical workflows should resolve ticker ambiguity before spending requests. The company overview response includes `Exchange`, `Country`, `Currency`, `Sector`, and `Industry`, which can be used to confirm that the returned issuer is the intended company before chaining statement and earnings calls.

### Outputs

`company-overview` is the compact enrichment endpoint. It returns company identity, business description, listing venue, country, currency, sector, industry, market capitalization, valuation ratios, dividend yield, 52-week range, and analyst target price fields.

The three statement endpoints return annual and quarterly report arrays. The local inventory summarizes the important statement families as revenue, gross profit, operating income, EBIT, EBITDA, net income, assets, liabilities, shareholder equity, cash, debt, operating cash flow, capital expenditures, investing cash flow, financing cash flow, dividends, `fiscalDateEnding`, and reported currency fields.

`earnings` returns annual EPS records and quarterly EPS records. Quarterly rows include `fiscalDateEnding`, `reportedDate`, `reportedEPS`, `estimatedEPS`, `surprise`, and `surprisePercentage`, making it the core endpoint for earnings-execution analysis rather than full earnings-calendar discovery.

### Important Constraints Or Gaps

The wrapper OpenAPI documents request schemas and 402 responses but does not define machine-readable success response schemas. The response fields in the inventory are derived from the saved Alpha Vantage documentation and examples, so consumers should preserve raw responses and tolerate missing, null, string-encoded numeric, or issuer-specific fields.

Accounting coverage can vary by issuer, fiscal period, reporting currency, restatement history, and data entitlement. The docs do not enumerate every possible financial-statement line item or define a strict accounting taxonomy across all companies.

The endpoints are point lookups by ticker. They do not provide screening, peer grouping, price history, news, calendar events, or transcript text inside this group. Strong workflows should combine this group with ticker search, market data, news sentiment, or transcript endpoints only when those additional facts are needed.

## Use Cases

### Fundamental Stock Research Packet

An investor or analyst can generate a structured company packet from one ticker: use `company-overview` for the business description, sector, industry, market cap, valuation ratios, dividend yield, and analyst target price, then add income statement, balance sheet, cash flow, and earnings records for historical context.

For an AI agent, this creates a compact research context before answering questions such as "what does this company do?", "how profitable is it?", or "is the valuation high relative to its earnings?" The workflow should keep the raw JSON attached because statement fields may be absent or differently populated across issuers.

### Valuation And Ratio Sanity Checks

Product teams building portfolio dashboards can use `company-overview` fields such as `MarketCapitalization`, `PERatio`, `DividendYield`, `52WeekHigh`, `52WeekLow`, and `AnalystTargetPrice` to show quick valuation context. Statement endpoints can add revenue, EBITDA, net income, cash, debt, and cash-flow fields for internal ratio calculations.

This is strongest as a sanity-check layer, not a complete valuation engine. It provides inputs for simple multiples, leverage, cash conversion, and dividend views, but downstream code must handle stale, missing, or string-formatted numeric values defensively.

### Earnings Quality And Surprise Tracking

The `earnings` endpoint exposes annual EPS history and quarterly reported-versus-estimated EPS records. A research workflow can calculate streaks of beats or misses, surprise magnitude, and EPS trend direction, then compare those signals with revenue, net income, and operating cash flow from the statement endpoints.

This is useful for screening companies whose EPS beats are backed by improving operations versus companies where EPS surprises diverge from cash generation. It does not include forward earnings calendars or transcript explanations in this group, so event timing and management commentary require other endpoints.

### Financial Health And Liquidity Review

A credit, procurement, or vendor-risk workflow can combine balance-sheet fields for assets, liabilities, shareholder equity, cash, and debt with cash-flow fields such as operating cash flow and capital expenditures. This supports lightweight checks for leverage, liquidity, cash burn, and capital intensity.

For business users, the value is fast public-company risk context before approving a vendor, partner, or customer exposure. It should not be treated as audited diligence by itself; issuer coverage, reporting lags, restatements, and missing fields remain open constraints.

### Portfolio Monitoring And Periodic Refresh

A portfolio tool can periodically refresh this group for held symbols and flag changes in company overview metrics, newly available quarterly statement rows, cash-flow deterioration, or large EPS surprises. The per-symbol design makes it straightforward to run only for positions that matter instead of collecting broad market data.

This use case benefits from preserving fiscal dates and reported dates. A workflow should compare report arrays by `fiscalDateEnding` rather than by array position, because new periods, restatements, or sparse historical coverage can change ordering and completeness.

### Company Data Enrichment For Internal Records

CRM, procurement, investor-relations, or finance systems can use `company-overview` to enrich public-company records with normalized business descriptions, exchange, country, currency, sector, and industry. Statement and earnings endpoints can add public financial scale and profitability context to accounts already known by ticker.

The strongest implementation first confirms ticker identity, then stores source timestamp and raw response alongside normalized fields. This avoids silently mixing companies when ticker symbols are ambiguous across exchanges or when company names change.
