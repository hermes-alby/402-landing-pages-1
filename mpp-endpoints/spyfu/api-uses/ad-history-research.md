# SpyFu: Ad History Research API Uses

## What This Endpoint Group Does

Review historical ad copy and ad performance by domain or keyword across months and countries. In the MPP catalog this is exposed through one paid GET wildcard endpoint rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/cloud_ad_history_api/v2/*` | Ad history research | `countryCode`, `domain`, `keywordFilter`, `pageSize`, `sortBy`, `startingRow`, `term` | `resultCount`, `results`, `domains`, `topAds` |

Documented upstream operations represented by this group:

- `GET /apis/cloud_ad_history_api/v2/*` wraps: `GET /v2/domain/getDomainAdHistory`, `GET /v2/term/getTermAdHistory`, `GET /v2/term/getTermAdHistoryWithStats`

## Field Notes

### Inputs

Common inputs include `countryCode` query optional, `domain` query required, `keywordFilter` query optional, `pageSize` query optional, `sortBy` query optional, `startingRow` query optional, `term` query required. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `results`, `results[].keywords`, `results[].position`, `results[].searchDateId`, `results[].title`, `results[].body`, `results[].url`, `results[].adId`, `results[].domainName`, `results[].urls`, `domains`, `domains[].ads`, `domains[].budget`, `domains[].coverage`, `domains[].domainName`, `domains[].percentageLeaderboard`, `domains[].totalAdsPurchased`, `domains[].adCount`, `topAds`, and additional operation-specific fields. The most decision-relevant quantitative fields are `resultCount`, `results[].position`, `domains[].budget`, `domains[].adCount`, `topAds[].averagePosition`, `topAds[].averageAdCount`, `topAds[].leaderboardCount`, with identifiers such as `results[].keywords`, `results[].searchDateId`, `results[].url`, `results[].adId`, `results[].domainName`, `results[].urls`, `domains`, `domains[].ads`, `domains[].budget`, `domains[].coverage`. Content-oriented fields include `results[].keywords`, `results[].title`, `results[].body`, `results[].adId`, `domains[].ads`, `domains[].percentageLeaderboard`, `domains[].totalAdsPurchased`, `domains[].adCount`, `topAds`, `topAds[].adId`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### Long-running creative pattern mining

A marketer can retrieve historical ads for a domain or term to see which calls to action, prices, claims, and landing pages recur over months. Repeated or long-lived ad variants are useful clues about what survived testing, while short-lived variants can flag experiments or seasonal pushes.

### Compliance and competitive claims review

A legal, brand, or market-intelligence team can preserve ad text, display URL, keyword, date, and country context for competitor claim monitoring. The data helps identify comparative claims, regulated language, or aggressive promotion patterns that need human review.

### Seasonality planning

Retail and service businesses can inspect keyword or domain ad history across past months and years to see when competitors started promotions. That supports campaign calendars and budget staging before seasonal demand peaks.
