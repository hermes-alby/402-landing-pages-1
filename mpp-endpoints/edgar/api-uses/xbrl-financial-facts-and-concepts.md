# EDGAR (SEC): XBRL Financial Facts And Concepts API Uses

## What This Endpoint Group Does

This endpoint group retrieves standardized XBRL financial facts for one SEC filer. `company-facts` returns the broad company-wide set of concepts and units for a CIK, while `company-concept` returns the time series for one selected taxonomy and tag.

The group is useful when a workflow needs machine-readable financial statement values instead of filing documents. It can support trend analysis, point-in-time checks, comparable-company data extraction, and automated monitoring of reported values from 10-K, 10-Q, 8-K, 20-F, 40-F, 6-K, and related filings.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/edgar/company-facts` | Retrieve all available standardized XBRL company concepts for one filer in a single response. | JSON body with `cik`; `Content-Type: application/json`. | `cik`, `entityName`, `facts` keyed by taxonomy and tag, concept `label`, concept `description`, `units`, and fact rows with `val`, `accn`, `fy`, `fp`, `form`, `filed`, `frame`, `start`, and `end`. |
| POST | `/edgar/company-concept` | Retrieve every reported value for one company, taxonomy, and XBRL concept tag. | JSON body with `cik`, `taxonomy`, and `tag`; taxonomy examples include `us-gaap`, `ifrs-full`, `dei`, and `srt`; tag examples include `Assets`, `Revenues`, `NetIncomeLoss`, and `EarningsPerShareBasic`. | `cik`, `taxonomy`, `tag`, `label`, `description`, `entityName`, and `units` containing unit-specific fact arrays with `val`, `accn`, `fy`, `fp`, `form`, `filed`, `frame`, `start`, and `end`. |

## Field Notes

### Inputs

Both endpoints require a SEC CIK in the request body. The Locus docs show CIK values as strings, such as `320193`; upstream SEC examples use a 10-digit CIK with leading zeros in the URL path.

`company-concept` also requires `taxonomy` and `tag`. The documented taxonomy examples are `us-gaap`, `ifrs-full`, `dei`, and `srt`. The `tag` value is a specific XBRL concept name, such as `Assets`, `Revenues`, `NetIncomeLoss`, or `EarningsPerShareBasic`. Callers that do not already know the tag should first inspect `company-facts` for the company's available taxonomy/tag combinations.

### Outputs

The main value field is `val`, interpreted with its unit key. Units can represent currencies, shares, per-share values, ratios, or dimensionless values such as `pure`; SEC docs note that numerator/denominator units are represented with `-per-`, such as `USD-per-shares`.

Fact rows carry provenance and period context. `accn` identifies the SEC filing containing the fact, `form` identifies the filing type, `filed` gives the filing date, `fy` and `fp` identify fiscal year and fiscal period, `start` and `end` describe the reporting period, and `frame` may associate the fact with a SEC calendar frame.

### Important Constraints Or Gaps

The MPP routes are third-party paid wrappers around public SEC `data.sec.gov` APIs. Upstream SEC APIs require no authentication or API key, but the assigned MPP endpoints use HTTP 402 auto-payment through Tempo and are documented at an estimated `$0.005 + $0.003 fee` per request, with OpenAPI payment metadata showing `8000` base units.

SEC XBRL APIs aggregate facts that use a non-custom taxonomy and apply to the entire filing entity. Company-specific extension taxonomy facts are not the focus of these endpoints, so some detailed disclosure values visible in source filings may not appear in this normalized API surface.

The MPP OpenAPI documents request schemas and declares success/payment responses, but it does not publish detailed 200 response schemas or MPP-specific 402 challenge fields. The output field notes here are derived from SEC upstream API behavior and Locus endpoint prose.

SEC says `data.sec.gov` does not support CORS. Automated access must follow SEC fair-access guidance, including efficient scripting, a declared user agent, and a current maximum request rate of 10 requests per second. SEC also offers bulk `companyfacts.zip` files for large-scale retrieval, recompiled nightly, which may be better than repeated per-company API calls.

SEC says XBRL APIs are updated in real time as filings are disseminated, with a typical processing delay of under a minute, though delays can be longer during peak filing times.

## Use Cases

### Financial Statement Trend Analysis

An investor, analyst, or finance team can use `company-concept` to retrieve a clean time series for a single metric such as `us-gaap` `Revenues`, `Assets`, `NetIncomeLoss`, or `EarningsPerShareBasic`. The fields that matter most are `val`, the unit key, `fy`, `fp`, `form`, `filed`, `start`, and `end`, because they let the user separate annual and quarterly values, check whether a point came from a 10-K or 10-Q, and align reported values with reporting periods.

The returned data helps calculate growth, margins, balance-sheet changes, per-share trends, and filing-to-filing revisions without scraping filing HTML. It is valuable because the user can build repeatable metrics from official structured disclosures and keep links back to the source filing through `accn`.

### Company Financial Enrichment

A product team or data engineering team can use `company-facts` to enrich a company profile with many standardized metrics in one request. Instead of choosing tags upfront, the workflow can inspect `facts.{taxonomy}.{tag}` objects, read each concept `label` and `description`, and select useful units and fact rows for downstream normalization.

This is valuable for dashboards, screening tools, CRM enrichment, procurement risk checks, and agent workflows that need a broad first pass over a public company's financial data. The response lets the system discover which concepts are actually available for that filer, which units they use, and which filings contributed each value.

### Audit And Compliance Cross-Checks

An accounting, audit, or compliance workflow can use `company-concept` to verify a specific reported value across filings, such as assets, liabilities, revenue, net income, or share counts. `accn`, `form`, `filed`, `fy`, `fp`, `start`, and `end` are critical because they connect each value to the accepted filing and the fiscal period being tested.

The returned data helps compare reported values over time, find missing or unexpected periods, and detect unit differences before relying on a number. It is valuable because each fact row preserves enough filing context for review workflows to trace a normalized value back to an SEC accession number.

### Comparable Company Metric Collection

A research system can call `company-concept` across a known CIK set for a chosen taxonomy/tag pair, then normalize `val` by unit and fiscal period for peer comparison. When the tag is not consistently available across filers, the system can use `company-facts` as a discovery step to identify available concepts and labels before choosing fallback metrics.

This helps analysts compare revenue, assets, profitability, share counts, or per-share metrics across issuers without maintaining a full EDGAR ingestion pipeline. The value comes from using SEC-standard taxonomy tags and fact metadata, while still retaining caution around fiscal calendars, unit choices, and concept availability.
