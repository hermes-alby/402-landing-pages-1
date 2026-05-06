# RentCast API Uses

## Service Summary

RentCast provides first-party US real estate intelligence through property records, owner and tax data, AVM value estimates, rent estimates, sale/rental listings, and zip-code market statistics. The PayWithLocus MPP wrapper exposes ten RentCast functions as pay-per-request POST endpoints, with JSON body fields corresponding to RentCast's direct GET query and path parameters.

The strongest use cases are property enrichment, first-pass underwriting, rent setting, comparable evidence, listing monitoring, and zip-code market screening. The API is useful when a person or agent needs a small number of property-data calls without setting up a direct RentCast account and API subscription.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Property Record Lookup | 3 | Search, sample, or retrieve property records with owner, tax, physical-attribute, sale-history, and address/geocode fields. | [property-record-lookup.md](api-uses/property-record-lookup.md) |
| Valuation And Rent Estimates | 2 | Estimate current value or monthly rent and inspect the comparable listings behind the estimate. | [valuation-and-rent-estimates.md](api-uses/valuation-and-rent-estimates.md) |
| Listing Search And Monitoring | 4 | Search sale/rental listings, retrieve exact listings, track status/days-on-market/history, and enrich with MLS, agent, office, or builder fields. | [listing-search-and-monitoring.md](api-uses/listing-search-and-monitoring.md) |
| Market Statistics And Trends | 1 | Retrieve zip-code sale/rental aggregates and history for pricing, trend, inventory, and market-screening decisions. | [market-statistics-and-trends.md](api-uses/market-statistics-and-trends.md) |

## Highest-Value Uses

- Enrich inbound property leads with owner, owner-occupied, tax, sale-history, physical-attribute, and location fields before routing or underwriting.
- Pre-screen investment deals with AVM value/rent estimates, estimate ranges, comparable listings, distance, recency, and similarity scores.
- Set or review rent using RentCast's long-term rent estimate and nearby rental comps, while accounting for active/inactive status and days on market.
- Monitor sale and rental listings for stale inventory, price/rent positioning, recent removals, and listing history.
- Compare zip-code markets by median/average price or rent, price/rent per square foot, days on market, new listings, total listings, and historical trends.

## Personal Use Opportunities

A homeowner can investigate a property's tax assessments, sale history, owner-occupied status, and estimated value before deciding whether to sell, refinance, appeal taxes, or request a deeper valuation. A buyer can combine property records, AVM comps, sale listings, and zip-code trends to decide whether a listing price looks reasonable.

A renter or small landlord can compare rent estimates with nearby rental listings and zip-code rental trends. The most useful fields are rent/range, bedroom and square-foot attributes, comparable listing prices, days on market, and historical rent metrics.

## Business Use Opportunities

Real estate investors, brokerages, property managers, lenders, insurers, home-service companies, and proptech products can use RentCast to turn an address or zip code into structured decision data. High-value workflows include CRM enrichment, buy-box filtering, first-pass underwriting, renewal pricing, portfolio monitoring, listing intelligence, market scoring, and report generation.

The MPP wrapper is best for occasional or agentic calls where account setup and direct API subscription overhead are undesirable. Sustained high-volume use may fit RentCast's direct API plans better because the provider publishes monthly quotas and per-request overage rates.

## Endpoint Group Summaries

### Property Record Lookup

The property-record endpoints are the foundation for address-based enrichment. They return physical property attributes, location identifiers, taxes, sale history, and owner fields that support lead qualification, portfolio normalization, tax review, and sold-comparable discovery. See [property-record-lookup.md](api-uses/property-record-lookup.md).

### Valuation And Rent Estimates

The AVM endpoints produce a current value or rent estimate plus a range and comparable listings. They are strongest when a workflow needs a fast, explainable first-pass estimate, not a certified appraisal. The comparable fields are important because distance, recency, and correlation show whether the estimate has good support. See [valuation-and-rent-estimates.md](api-uses/valuation-and-rent-estimates.md).

### Listing Search And Monitoring

The listing endpoints expose active and inactive sale/rental listings, listing status, dates, price or rent, MLS identifiers, agent/office/builder details, and history. They support saved searches, competitive rent checks, stale listing monitoring, and listing-contact enrichment. See [listing-search-and-monitoring.md](api-uses/listing-search-and-monitoring.md).

### Market Statistics And Trends

The market endpoint provides zip-code sale and rental aggregates, including prices/rents, per-square-foot metrics, days on market, inventory counts, property-type and bedroom breakdowns, and history. It supports market selection, pricing guardrails, rent-growth analysis, and expansion planning. See [market-statistics-and-trends.md](api-uses/market-statistics-and-trends.md).

## Field And Data Themes

RentCast's most reusable identifiers are property/listing `id`, `zipCode`, county/FIPS fields, `mlsNumber`, and `assessorID`. Location fields are central across almost every endpoint. Money and quantity fields include list price/rent, AVM estimate ranges, last sale price, tax assessment values, property taxes, HOA fee, square footage, lot size, days on market, and listing counts.

The highest-value personal/company fields are owner names, owner type, owner mailing address, listing agent, listing office, and builder data. Use of those fields can raise privacy, consumer-protection, fair-housing, and solicitation concerns depending on workflow.
