# SpyFu: Organic Ranking History API Uses

## What This Endpoint Group Does

Retrieve historical organic rankings for domains and keywords across date ranges. In the MPP catalog this is exposed through one paid GET wildcard endpoint rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/organic_history_api/v2/*` | Ranking history research | `countryCode`, `domain`, `domains`, `endDate`, `endRank.max`, `endRank.min`, `endRankChange.max`, `endRankChange.min` | `resultCount`, `results`, `totalVolume`, `totalClicks` |

Documented upstream operations represented by this group:

- `GET /apis/organic_history_api/v2/*` wraps: `GET /apis/organic_history_api/v2/historic/getHistoricRankingsForDomain`, `GET /apis/organic_history_api/v2/historic/getHistoricRankingsForDomainOnKeywords`, `GET /apis/organic_history_api/v2/historic/getHistoricRankingsForKeywordOnDomains`

## Field Notes

### Inputs

Common inputs include `countryCode` query optional, `domain` query required, `domains` query required, `endDate` query optional, `endRank.max` query optional, `endRank.min` query optional, `endRankChange.max` query optional, `endRankChange.min` query optional, `excludeTerms` query optional, `includeAnyTerm` query optional, `includeTerms` query optional, `keyword` query required, `keywords` query required, `pageSize` query optional, `queryType` query optional, `searchVolume.max` query optional, `searchVolume.min` query optional, `seoClicks.max` query optional. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `results`, `results[].keyword`, `results[].historicalRanks`, `results[].startRank`, `results[].endRank`, `results[].rankChange`, `results[].endClicks`, `results[].clicksChange`, `results[].searchVolume`, `totalVolume`, `totalClicks`, `totalClicksChange`, `totalRankChange`, `rankAverage`, `rankAverageChange`, `totalMatchingResults`, `results[].domain`, `results[].results`. The most decision-relevant quantitative fields are `resultCount`, `results[].historicalRanks`, `results[].startRank`, `results[].endRank`, `results[].rankChange`, `results[].endClicks`, `results[].clicksChange`, `results[].searchVolume`, `totalVolume`, `totalClicks`, `totalClicksChange`, `totalRankChange`, with identifiers such as `results[].keyword`, `results[].domain`. Content-oriented fields include `results[].keyword`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### Algorithm-impact diagnosis

An SEO analyst can retrieve historical rankings for a domain or keyword set around a known traffic change. Ranking dates, rank positions, domain, URL, and keyword fields help distinguish site-specific losses from broader SERP volatility.

### Long-term competitor strategy reconstruction

A business can inspect how a rival gained rankings across core terms over time. That supports reverse engineering content launches, category expansion, and keyword priorities without relying on a single current snapshot.

### Client reporting with evidence trails

Agencies can show when a client entered, improved, or lost rankings for important keywords. Date-bounded ranking history makes reports more defensible than current-rank screenshots and supports before/after campaign analysis.
