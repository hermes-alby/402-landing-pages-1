# SpyFu: Keyword Overlap Analysis API Uses

## What This Endpoint Group Does

Compare domains across shared and exclusive SEO/PPC keywords to expose gaps and defensive opportunities. In the MPP catalog this is exposed through one paid GET wildcard endpoint rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/keyword_api/v2/kombat/*` | Keyword overlap analysis | `adCount.max`, `adCount.min`, `adultFilter`, `clicks.max`, `clicks.min`, `costPerClick.max`, `costPerClick.min`, `costPerClickOption` | `resultCount`, `totalMatchingResults`, `results` |

Documented upstream operations represented by this group:

- `GET /apis/keyword_api/v2/kombat/*` wraps: `GET /apis/keyword_api/v2/kombat/getCompetingPpcKeywords`, `GET /apis/keyword_api/v2/kombat/getCompetingSeoKeywords`

## Field Notes

### Inputs

Common inputs include `adCount.max` query optional, `adCount.min` query optional, `adultFilter` query optional, `clicks.max` query optional, `clicks.min` query optional, `costPerClick.max` query optional, `costPerClick.min` query optional, `costPerClickOption` query optional, `countryCode` query optional, `desktopSearchesPercentage.max` query optional, `desktopSearchesPercentage.min` query optional, `excludeDomainsCsv` query optional, `includeDomainsCsv` query required, `isIntersection` query required, `isQuestion` query optional, `isTransactionalIntent` query optional, `keywordDifficulty.max` query optional, `keywordDifficulty.min` query optional. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `totalMatchingResults`, `results`, `results[].keyword`, `results[].searchVolume`, `results[].liveSearchVolume`, `results[].rankingDifficulty`, `results[].totalMonthlyClicks`, `results[].percentMobileSearches`, `results[].percentDesktopSearches`, `results[].percentSearchesNotClicked`, `results[].percentPaidClicks`, `results[].percentOrganicClicks`, `results[].broadCostPerClick`, `results[].phraseCostPerClick`, `results[].exactCostPerClick`, `results[].broadMonthlyClicks`, `results[].phraseMonthlyClicks`, `results[].exactMonthlyClicks`, `results[].broadMonthlyCost`, and additional operation-specific fields. The most decision-relevant quantitative fields are `resultCount`, `results[].searchVolume`, `results[].liveSearchVolume`, `results[].rankingDifficulty`, `results[].totalMonthlyClicks`, `results[].percentSearchesNotClicked`, `results[].percentPaidClicks`, `results[].percentOrganicClicks`, `results[].broadCostPerClick`, `results[].phraseCostPerClick`, `results[].exactCostPerClick`, `results[].broadMonthlyClicks`, with identifiers such as `results[].keyword`, `results[].percentPaidClicks`, `results[].paidCompetitors`. Content-oriented fields include `results[].keyword`, `results[].broadCostPerClick`, `results[].broadMonthlyClicks`, `results[].broadMonthlyCost`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### SEO and PPC gap discovery

A marketer can compare a domain against two or more rivals to find shared, missing, and exclusive keywords. Keyword, domain, rank, paid/organic indicators, CPC, search volume, and difficulty fields turn a broad competitor question into a prioritized gap list.

### Defensive keyword monitoring

A business can use overlap results to find keywords competitors share that the business has lost or never covered. Those terms can feed content refreshes, paid tests, or executive reports explaining where demand is being ceded.

### Agency onboarding audit

An agency can run Kombat-style comparisons during a prospect or new-client audit to show immediate opportunity areas. The output supports concrete recommendations rather than generic SEO advice.
