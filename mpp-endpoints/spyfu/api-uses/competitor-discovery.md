# SpyFu: Competitor Discovery API Uses

## What This Endpoint Group Does

Find top SEO, PPC, or combined competitors for a domain and quantify overlap or market proximity. In the MPP catalog this is exposed through one paid GET wildcard endpoint rather than one manifest entry per upstream SpyFu operation. The useful payload is structured search-market data: domains, keywords, URLs, rankings, traffic estimates, click and cost estimates, ad text or history where applicable, dates, countries, and competitive overlap metrics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/apis/competitors_api/v2/*` | Competitor analysis | `countryCode`, `domain`, `pageSize`, `sortBy`, `sortOrder`, `startingRow` | `resultCount`, `totalMatchingResults`, `combinedCompetitors`, `ppcCompetitors`, `results` |

Documented upstream operations represented by this group:

- `GET /apis/competitors_api/v2/*` wraps: `GET /apis/competitors_api/v2/combined/getCombinedTopCompetitors`, `GET /apis/competitors_api/v2/ppc/getTopCompetitors`, `GET /apis/competitors_api/v2/seo/getTopCompetitors`

## Field Notes

### Inputs

Common inputs include `countryCode` query optional, `domain` query required, `pageSize` query optional, `sortBy` query optional, `sortOrder` query optional, `startingRow` query optional. Most operations also use a wildcard path suffix under the MPP route to select the first-party SpyFu operation. Country-scoped operations commonly use the 28-value `countryCode` enum. Some endpoints support filters such as include/exclude terms, rank ranges, search volume ranges, date ranges, page controls, or competitor domains depending on the operation.

### Outputs

The group returns fields such as `resultCount`, `totalMatchingResults`, `combinedCompetitors`, `combinedCompetitors[].rank`, `combinedCompetitors[].domain`, `ppcCompetitors`, `ppcCompetitors[].domain`, `ppcCompetitors[].commonTerms`, `ppcCompetitors[].rank`, `seoCompetitors`, `seoCompetitors[].domain`, `seoCompetitors[].commonTerms`, `seoCompetitors[].rank`, `results`, `results[].domain`, `results[].commonTerms`, `results[].rank`. The most decision-relevant quantitative fields are `resultCount`, `combinedCompetitors[].rank`, `ppcCompetitors[].rank`, `seoCompetitors[].rank`, `results[].rank`, with identifiers such as `combinedCompetitors[].domain`, `ppcCompetitors[].domain`, `seoCompetitors[].domain`, `results[].domain`.

### Important Constraints Or Gaps

No paid MPP requests or direct SpyFu API-key requests were made, so examples are from official OpenAPI schemas rather than live responses. The MPP feed documents wildcard endpoint families, not individual upstream operations; production routing, wrapper-specific errors, rate limits, pagination caps, and retry behavior remain unverified. Official SpyFu API pricing is per successful returned row; MPP pricing is listed as a fixed Tempo charge per wildcard request family, which may have different economics for large result sets.

## Use Cases

### Build a real search competitor set

A founder, SEO, or PPC analyst can start from one domain and retrieve top organic, paid, or combined competitors. Overlap, keyword-count, and strength-style fields help reveal search competitors that are not obvious product competitors but compete for the same demand.

### Market map refresh for agencies

An agency can periodically refresh each client account’s SEO and PPC competitor list, then route high-overlap rivals into domain stats, keyword gap, and ad-history workflows. That keeps competitive reporting tied to live search behavior rather than stale manual lists.

### Sales prospect context

A sales team serving marketing buyers can use competitor lists to understand the prospect’s market before outreach. Knowing which domains compete in SEO or paid search helps personalize audits and identify pain points.
