# SpyFu: Domain Analytics API Uses

## What This Endpoint Group Does

Retrieve current and historical domain-level SEO/PPC metrics, active dates, bulk domain snapshots, and matching domains. In the MPP catalog this is exposed through one paid GET wildcard endpoint rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/domain_stats_api/v2/*` | Domain stats lookup | `averageAdRank.max`, `averageAdRank.min`, `averageOrganicRank.max`, `averageOrganicRank.min`, `countryCode`, `domain`, `domains`, `month` | `resultCount`, `results`, `domain`, `totalMatchingResults` |

Documented upstream operations represented by this group:

- `GET /apis/domain_stats_api/v2/*` wraps: `GET /apis/domain_stats_api/v2/getActiveDatesForDomain`, `GET /apis/domain_stats_api/v2/getAllDomainStats`, `GET /apis/domain_stats_api/v2/getBulkDomainStats`, `GET /apis/domain_stats_api/v2/getDomainStatsForExactDate`, `GET /apis/domain_stats_api/v2/getLatestDomainStats`, `GET /apis/domain_stats_api/v2/getMatchingDomains`

## Field Notes

### Inputs

Common inputs include `averageAdRank.max` query optional, `averageAdRank.min` query optional, `averageOrganicRank.max` query optional, `averageOrganicRank.min` query optional, `countryCode` query optional, `domain` query required, `domains` query required, `month` query required, `monthlyBudget.max` query optional, `monthlyBudget.min` query optional, `monthlyOrganicClicks.max` query optional, `monthlyOrganicClicks.min` query optional, `monthlyOrganicValue.max` query optional, `monthlyOrganicValue.min` query optional, `monthlyPaidClicks.max` query optional, `monthlyPaidClicks.min` query optional, `pageSize` query optional, `pastNMonths` query optional. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `results`, `results[].dateString`, `results[].month`, `results[].year`, `domain`, `results[].searchMonth`, `results[].searchYear`, `results[].averageOrganicRank`, `results[].monthlyPaidClicks`, `results[].averageAdRank`, `results[].totalOrganicResults`, `results[].monthlyBudget`, `results[].monthlyOrganicValue`, `results[].totalAdsPurchased`, `results[].monthlyOrganicClicks`, `results[].strength`, `results[].totalInverseRank`, `results[].areStatsNormalized`, `totalMatchingResults`, and additional operation-specific fields. The most decision-relevant quantitative fields are `resultCount`, `results[].averageOrganicRank`, `results[].monthlyPaidClicks`, `results[].averageAdRank`, `results[].monthlyBudget`, `results[].monthlyOrganicValue`, `results[].monthlyOrganicClicks`, `results[].totalInverseRank`, with identifiers such as `domain`, `results[].monthlyPaidClicks`, `results[].domain`. Content-oriented fields include `results[].averageAdRank`, `results[].totalAdsPurchased`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### Competitor health baseline

A founder, marketer, or agency can pull current and historical domain metrics for a short list of rivals, then compare organic clicks, paid clicks, estimated budget, organic value, keyword counts, rank averages, and strength. That turns a vague competitor watch into a measurable baseline: which rival is buying traffic, who is gaining organic value, and which domains are worth deeper keyword or ad-history review.

### Lead and account qualification

A sales or partnerships team can score inbound company domains by search footprint before routing them. Fields such as total organic results, paid keyword counts, monthly paid clicks, monthly organic clicks, and domain strength help separate active digital marketers from companies with little searchable demand, while matching-domain lookups help discover related properties.

### Portfolio and SEO investment reporting

An agency can snapshot client domains monthly and compare performance against previous months using search month/year, organic value, budget, click estimates, and active dates. The workflow supports reports that explain whether visibility changes came from SEO gains, paid-search shifts, or broad domain strength changes.
