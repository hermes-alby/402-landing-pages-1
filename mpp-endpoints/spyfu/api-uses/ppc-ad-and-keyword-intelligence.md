# SpyFu: PPC Ad And Keyword Intelligence API Uses

## What This Endpoint Group Does

Inspect paid SERP ads and PPC keywords to understand competitor ad copy, bids, and campaign changes. In the MPP catalog this is exposed through two paid GET wildcard endpoints rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/serp_api/v2/ppc/*` | PPC keyword research | `adCount.max`, `adCount.min`, `adultFilter`, `countryCode`, `excludeHomepageKeywords`, `excludeTerms`, `includeAnyTerm`, `includeTerms` | `resultCount`, `results`, `totalMatchingResults` |
| GET | `/apis/keyword_api/v2/ppc/*` | PPC keyword research | `adCount.max`, `adCount.min`, `adultFilter`, `clicks.max`, `clicks.min`, `costPerClick.max`, `costPerClick.min`, `costPerClickOption` | `resultCount`, `totalMatchingResults`, `results` |

Documented upstream operations represented by this group:

- `GET /apis/serp_api/v2/ppc/*` wraps: `GET /apis/serp_api/v2/ppc/getPaidSerps`
- `GET /apis/keyword_api/v2/ppc/*` wraps: `GET /apis/keyword_api/v2/ppc/getMostSuccessful`, `GET /apis/keyword_api/v2/ppc/getNewKeywords`

## Field Notes

### Inputs

Common inputs include `adCount.max` query optional, `adCount.min` query optional, `adultFilter` query optional, `countryCode` query optional, `excludeHomepageKeywords` query optional, `excludeTerms` query optional, `includeAnyTerm` query optional, `includeTerms` query optional, `keywordDifficulty.max` query optional, `keywordDifficulty.min` query optional, `onlyAdultKeywords` query optional, `pageSize` query optional, `query` query required, `searchVolume.max` query optional, `searchVolume.min` query optional, `sortBy` query optional, `sortOrder` query optional, `startingRow` query optional. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `results`, `results[].keyword`, `results[].termId`, `results[].adPosition`, `results[].adCount`, `results[].dateSearched`, `results[].title`, `results[].bodyHtml`, `results[].domain`, `results[].searchVolume`, `results[].keywordDifficulty`, `results[].isNsfw`, `totalMatchingResults`, `results[].liveSearchVolume`, `results[].rankingDifficulty`, `results[].totalMonthlyClicks`, `results[].percentMobileSearches`, `results[].percentDesktopSearches`, `results[].percentSearchesNotClicked`, and additional operation-specific fields. The most decision-relevant quantitative fields are `resultCount`, `results[].adPosition`, `results[].adCount`, `results[].searchVolume`, `results[].keywordDifficulty`, `results[].liveSearchVolume`, `results[].rankingDifficulty`, `results[].totalMonthlyClicks`, `results[].percentSearchesNotClicked`, `results[].percentPaidClicks`, `results[].percentOrganicClicks`, `results[].broadCostPerClick`, with identifiers such as `results[].keyword`, `results[].termId`, `results[].domain`, `results[].keywordDifficulty`, `results[].percentPaidClicks`, `results[].paidCompetitors`. Content-oriented fields include `results[].keyword`, `results[].adPosition`, `results[].adCount`, `results[].title`, `results[].bodyHtml`, `results[].keywordDifficulty`, `results[].broadCostPerClick`, `results[].broadMonthlyClicks`, `results[].broadMonthlyCost`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### Competitor ad-copy research before campaign launch

A small advertiser can inspect paid SERPs and successful PPC keywords for competitor domains before writing ads. Returned ad copy, keyword, CPC, position, search volume, and success metrics help identify tested language, expensive terms, and ads worth avoiding or adapting.

### Budget allocation and keyword pruning

A paid-search manager can compare most successful PPC keywords and newly bought terms across competitors. CPC, volume, paid clicks, rank, and change fields help decide which keywords deserve test budget, which are too expensive, and where a competitor is expanding.

### Landing-page and offer monitoring

Agencies can monitor paid SERP outputs for changed ad copy, destination URLs, and domain/keyword pairings. That helps detect new offers, seasonal pushes, and messaging tests without waiting for a manual SERP review.
