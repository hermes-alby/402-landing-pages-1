# SpyFu: SEO Keyword Performance API Uses

## What This Endpoint Group Does

Analyze organic rankings, ranking changes, top pages, live SERP stats, and organic competitive opportunities. In the MPP catalog this is exposed through one paid GET wildcard endpoint rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/serp_api/v2/seo/*` | SEO keyword research | `adCount.max`, `adCount.min`, `adultFilter`, `compareDomain`, `costPerClick.max`, `costPerClick.min`, `costPerClickOption`, `countryCode` | `resultCount`, `results`, `totalMatchingResults` |

Documented upstream operations represented by this group:

- `GET /apis/serp_api/v2/seo/*` wraps: `GET /apis/serp_api/v2/seo/getGainedClicksKeywords`, `GET /apis/serp_api/v2/seo/getGainedRanksKeywords`, `GET /apis/serp_api/v2/seo/getJustFellOffKeywords`, `GET /apis/serp_api/v2/seo/getJustMadeItKeywords`, `GET /apis/serp_api/v2/seo/getLiveSeoStats`, `GET /apis/serp_api/v2/seo/getLostClicksKeywords`, `GET /apis/serp_api/v2/seo/getLostRanksKeywords`, `GET /apis/serp_api/v2/seo/getMostTrafficTopPages`, `GET /apis/serp_api/v2/seo/getMostValuableKeywords`, `GET /apis/serp_api/v2/seo/getNewlyRankedKeywords`, `GET /apis/serp_api/v2/seo/getNewTopPages`, `GET /apis/serp_api/v2/seo/getOrganicOutrankingKeywords`, `GET /apis/serp_api/v2/seo/getSeoKeywords`, `GET /apis/serp_api/v2/seo/getSerpAnalysisKeywords`, `GET /apis/serp_api/v2/seo/getTopPages`, `GET /apis/serp_api/v2/seo/getWhereTheyJustSurpassedYou`, `GET /apis/serp_api/v2/seo/getWhereTheyOutRankYou`

## Field Notes

### Inputs

Common inputs include `adCount.max` query optional, `adCount.min` query optional, `adultFilter` query optional, `compareDomain` query required, `costPerClick.max` query optional, `costPerClick.min` query optional, `costPerClickOption` query optional, `countryCode` query optional, `excludeHomepageKeywords` query optional, `excludeTerms` query optional, `includeAnyTerm` query optional, `includeTerms` query optional, `keyword` query required, `keywordDifficulty.max` query optional, `keywordDifficulty.min` query optional, `keywordFilter` query optional, `monthlyCost.max` query optional, `monthlyCost.min` query optional. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `results`, `results[].keyword`, `results[].topRankedUrl`, `results[].rank`, `results[].rankChange`, `results[].searchVolume`, `results[].keywordDifficulty`, `results[].broadCostPerClick`, `results[].phraseCostPerClick`, `results[].exactCostPerClick`, `results[].seoClicks`, `results[].seoClicksChange`, `results[].totalMonthlyClicks`, `results[].percentMobileSearches`, `results[].percentDesktopSearches`, `results[].percentNotClicked`, `results[].percentPaidClicks`, `results[].percentOrganicClicks`, `results[].broadMonthlyCost`, and additional operation-specific fields. The most decision-relevant quantitative fields are `resultCount`, `results[].topRankedUrl`, `results[].rank`, `results[].rankChange`, `results[].searchVolume`, `results[].keywordDifficulty`, `results[].broadCostPerClick`, `results[].phraseCostPerClick`, `results[].exactCostPerClick`, `results[].seoClicks`, `results[].seoClicksChange`, `results[].totalMonthlyClicks`, with identifiers such as `results[].keyword`, `results[].topRankedUrl`, `results[].keywordDifficulty`, `results[].percentPaidClicks`, `results[].paidCompetitors`, `results[].yourUrl`, `domain`, `url`, `results[].url`, `results[].keywordCount`. Content-oriented fields include `results[].keyword`, `results[].keywordDifficulty`, `results[].broadCostPerClick`, `results[].broadMonthlyCost`, `results[].title`, `results[].keywordCount`, `results[].topKeyword`, `results[].topKeywordPosition`, `results[].topKeywordSearchVolume`, `results[].topKeywordClicks`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### Content prioritization from live keyword value

A content marketer can query most valuable keywords, newly ranked keywords, page-one entries and exits, and top pages for a domain or URL. Search volume, rank, click estimates, CPC, keyword difficulty, and rank-change fields help decide which pages to refresh, which terms are close enough to defend, and which new opportunities justify content work.

### Loss and recovery triage

An SEO team can use lost clicks, lost ranks, just-fell-off, and SERP analysis data to identify where traffic likely moved. Returned rank and click-change metrics make the triage actionable: fix pages with high lost click potential first, inspect SERP competitors, and separate brand-noise losses from commercially meaningful terms.

### Competitor gap tracking

A business can compare against a competitor with where-they-outrank-you and organic outranking keyword outputs. The fields support decisions about content briefs, link-building targets, and defensive monitoring when a rival just surpassed the domain on keywords with meaningful search volume or paid value.
