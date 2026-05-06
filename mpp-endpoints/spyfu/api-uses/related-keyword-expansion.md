# SpyFu: Related Keyword Expansion API Uses

## What This Endpoint Group Does

Expand seed keywords into related, question, transactional, ad-buying, ranking, and bulk keyword intelligence. In the MPP catalog this is exposed through one paid GET wildcard endpoint rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/keyword_api/v2/related/*` | Keyword research | `adCount.max`, `adCount.min`, `adultFilter`, `clicks.max`, `clicks.min`, `costPerClick.max`, `costPerClick.min`, `costPerClickOption` | `resultCount`, `totalMatchingResults`, `results` |

Documented upstream operations represented by this group:

- `GET /apis/keyword_api/v2/related/*` wraps: `GET /apis/keyword_api/v2/related/getAlsoBuysAdsForKeywords`, `GET /apis/keyword_api/v2/related/getAlsoRanksForKeywords`, `GET /apis/keyword_api/v2/related/getKeywordExpansions`, `GET /apis/keyword_api/v2/related/getKeywordInformation`, `GET /apis/keyword_api/v2/related/getQuestionKeywords`, `GET /apis/keyword_api/v2/related/getRelatedKeywords`, `GET /apis/keyword_api/v2/related/getTransactionKeywords`

## Field Notes

### Inputs

Common inputs include `adCount.max` query optional, `adCount.min` query optional, `adultFilter` query optional, `clicks.max` query optional, `clicks.min` query optional, `costPerClick.max` query optional, `costPerClick.min` query optional, `costPerClickOption` query optional, `countryCode` query optional, `desktopSearchesPercentage.max` query optional, `desktopSearchesPercentage.min` query optional, `excludeTerms` query optional, `includeAnyTerm` query optional, `includeTerms` query optional, `isQuestion` query optional, `isTransactionalIntent` query optional, `keywordDifficulty.max` query optional, `keywordDifficulty.min` query optional. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `totalMatchingResults`, `results`, `results[].keyword`, `results[].searchVolume`, `results[].liveSearchVolume`, `results[].rankingDifficulty`, `results[].totalMonthlyClicks`, `results[].percentMobileSearches`, `results[].percentDesktopSearches`, `results[].percentSearchesNotClicked`, `results[].percentPaidClicks`, `results[].percentOrganicClicks`, `results[].broadCostPerClick`, `results[].phraseCostPerClick`, `results[].exactCostPerClick`, `results[].broadMonthlyClicks`, `results[].phraseMonthlyClicks`, `results[].exactMonthlyClicks`, `results[].broadMonthlyCost`, and additional operation-specific fields. The most decision-relevant quantitative fields are `resultCount`, `results[].searchVolume`, `results[].liveSearchVolume`, `results[].rankingDifficulty`, `results[].totalMonthlyClicks`, `results[].percentSearchesNotClicked`, `results[].percentPaidClicks`, `results[].percentOrganicClicks`, `results[].broadCostPerClick`, `results[].phraseCostPerClick`, `results[].exactCostPerClick`, `results[].broadMonthlyClicks`, with identifiers such as `results[].keyword`, `results[].percentPaidClicks`, `results[].paidCompetitors`. Content-oriented fields include `results[].keyword`, `results[].broadCostPerClick`, `results[].broadMonthlyClicks`, `results[].broadMonthlyCost`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### Topic cluster and FAQ planning

A content team can expand seed keywords into related, question, and transaction keywords. Search volume, CPC, keyword difficulty, and relatedness fields help cluster terms into pages, FAQs, comparison content, and buying-intent pages.

### Paid-search seed expansion

A PPC analyst can discover keywords that other advertisers buy ads for or that domains also rank for. The output helps create test ad groups, negative-keyword lists, and cross-channel keyword candidates.

### Keyword enrichment for internal datasets

A product, SEO, or affiliate workflow can bulk-enrich a list of terms with search volume, CPC, difficulty, and related attributes. The MPP GET manifest only exposes GET behavior, so very large bulk jobs may need direct SpyFu API POST support rather than the wrapper.
