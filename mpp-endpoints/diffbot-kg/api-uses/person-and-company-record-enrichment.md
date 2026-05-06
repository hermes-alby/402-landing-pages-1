# Diffbot KG: Person And Company Record Enrichment API Uses

## What This Endpoint Group Does

This endpoint group enriches a known person or organization from partial identifiers. Instead of writing a DQL search, the caller provides fields such as `type`, `name`, `url`, `email`, `employer`, `title`, or `location`; Diffbot matches the record to a Knowledge Graph entity and returns a confidence score plus the matched entity record.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/diffbot-kg/enhance` | Resolve and enrich a person or organization from partial identifiers. | `type`, `name`, `url`, `email`, `phone`, `employer`, `title`, `location`, `refresh`, `size`, `threshold` | `hits`, `kgversion`, `request_ctx`, `data[].score`, `data[].entity`, `data[].refreshInfo`, `errors`, `searchInfo` |

## Field Notes

### Inputs

The wrapper requires `type` and documents `Person` or `Organization`. Additional identifiers improve match likelihood: `name`, `url`, `email`, `phone`, `employer`, `title`, and `location`. The `refresh` flag asks Diffbot to recrawl origins and costs more under Diffbot's native credit model. `size` controls number of matches, and `threshold` controls similarity/confidence.

### Outputs

The Enhance response includes `version`, `hits`, `kgversion`, `request_ctx`, `data`, response-level `errors`, and optional `searchInfo`. Each `data[]` item can include `score`, `entity`, `errors`, `refreshInfo`, `refreshDelta`, and `entity_ctx`. Official examples show `entity` fields such as `id`, `diffbotUri`, `name`, `type`, `allNames`, `origins`, `twitterUri`, and employee-edge counts, but the full object varies by entity and filters.

### Important Constraints Or Gaps

The MPP wrapper request schema is narrower than upstream Diffbot Enhance POST. Upstream documents additional fields such as `id`, `ip`, `description`, `school`, `customId`, `search`, `nonCanonicalFacts`, `jsonmode`, `filter`, and `filterExclude`; the wrapper does not say whether these pass through. Diffbot credit documentation says Enhance consumes credits only when a match is found, with 25 credits for a normal match and 100 credits with refresh. The MPP wrapper estimates `$0.03` per Enhance and `$0.12` with refresh.

## Use Cases

### CRM Lead Enrichment And Routing

A sales or growth team can enrich inbound leads by sending an organization domain/name or a person name/email/title/employer combination, then use the matched `entity`, `score`, and `origins` to append company size, canonical names, source evidence, and other public-web facts. A freelancer or solo founder could use the same endpoint to qualify a short list of prospects before spending time on outreach.

The key workflow is to enrich, check `data[].score` against a threshold, store the returned `entity.id` or `diffbotUri`, and route high-confidence matches to sales or manual review. The endpoint should not be treated as a definitive identity-verification service; low-score matches and ambiguous `hits > 1` responses need human review.

### Account Deduplication And Entity Resolution

Operations teams often have duplicate company records with slightly different names, domains, or locations. Enhance can return canonical entity identifiers such as `entity.id`, `diffbotUri`, `name`, and `allNames`, allowing a CRM, vendor master, or research database to merge records more safely. An individual maintaining a research spreadsheet can use the same pattern to normalize company names and source URLs.

The value comes from entity resolution plus evidence: `request_ctx` records the submitted identifiers, `data[].score` indicates confidence, and `entity.origins` helps explain why a match was made. The caveat is that the wrapper does not document custom correlation IDs, so callers may need to maintain request-to-row mapping outside the endpoint unless passthrough support is confirmed.

### Recruiting Profile Enrichment

Recruiting teams can enrich person records from name, email, current employer, title, and location to attach public Knowledge Graph data to candidate or talent-pool records. A person doing career research could enrich a small set of public professional contacts or speakers to understand their current company context.

Person-only fields such as `email`, `employer`, and `title` are useful disambiguators. Returned `score`, `entity`, and `origins` support review before outreach or analytics. The output should be used with care for privacy, fairness, and compliance; public-web-derived enrichment is not a substitute for consent, verified employment checks, or hiring decision rules.

### Vendor And Partner Data Hygiene

Procurement, partnership, or risk teams can enrich organization records from names, websites, phones, and locations, then use the returned entity to standardize vendor profiles and attach public sources. A small business owner can use it to sanity-check supplier or partner information before adding it to a vendor list.

Useful fields include `type=Organization`, `name`, `url`, `phone`, `location`, `data[].entity`, and `data[].score`. `refresh=true` is valuable when stale supplier data matters, but it has a higher published credit cost and should be reserved for cases where freshness changes the decision.

### Research Spreadsheet Enrichment

Analysts often start with a spreadsheet of company or person names from conference agendas, portfolio pages, press mentions, or manually collected leads. Enhance can turn partial rows into structured entity records with IDs, names, aliases, origins, and available public-web facts. A personal researcher can use this for cleaner notes and repeatable source tracking.

The endpoint's value is highest when paired with a conservative `threshold` and external row IDs maintained by the caller. Since the wrapper does not list `filter` or `customId`, users should expect to receive broad entity objects and trim fields downstream unless wrapper passthrough is later confirmed.

### Freshness Checks For High-Value Accounts

When an organization record may have changed, a team can use `refresh=true` to ask Diffbot to recrawl origins and reconstruct the entity from refreshed data. This is useful for key accounts, strategic suppliers, executive moves, or companies being evaluated for investment or partnership.

The returned `refreshInfo`, `refreshDelta`, `lastCrawlTime`, and updated `entity` fields can support a decision to update internal records or trigger review. The limitation is cost: Diffbot's native credit table lists 100 credits for Enhance with refresh, and the MPP wrapper estimates a higher `$0.12` cost.
