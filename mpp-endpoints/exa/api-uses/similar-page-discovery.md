# Exa: Similar Page Discovery API Uses

## What This Endpoint Group Does

Exa's Similar Page Discovery group uses `POST /findSimilar` to start from a known seed `url` and return semantically similar pages. The group purpose from `endpoint-groups.json` is to find similar pages while optionally applying domain, publication-date, crawl-date, and moderation filters, and optionally returning extracted content for those similar pages.

This is not query-based web search. Its practical value is expansion from a page that is already known to be useful: related papers, comparable vendor pages, competitor content, alternative documentation, source clusters, or reading lists. The fields that matter most are the seed `url`, breadth control through `numResults`, domain/date filters, optional `contents` controls, result metadata such as `title`, `url`, `id`, `publishedDate`, and `author`, and cost fields such as wrapper payment metadata and provider-reported `costDollars.total`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/findSimilar` | Find pages semantically similar to a seed URL and optionally retrieve text, highlights, summaries, subpages, or extracted links for the similar pages. | Required `url`; optional `numResults`, `includeDomains`, `excludeDomains`, `startPublishedDate`, `endPublishedDate`, `startCrawlDate`, `endCrawlDate`, `moderation`, and nested `contents` fields including `contents.text`, `contents.highlights`, `contents.summary`, `contents.maxAgeHours`, `contents.subpages`, and `contents.extras.links`. | `requestId`, `results[].title`, `results[].url`, `results[].id`, `results[].publishedDate`, `results[].author`, optional `results[].text`, `results[].highlights`, `results[].summary`, `results[].subpages`, `results[].extras.links`, and `costDollars.total`. |

## Field Notes

### Inputs

`url` is required and is the central control surface. It should be a concrete page whose topic, intent, audience, or evidence style represents what the caller wants to expand. A broad homepage may return a diffuse neighborhood; a specific paper, blog post, pricing page, changelog, standard, or documentation page gives the similarity model a clearer target.

`numResults` controls breadth. The official schema documents a default of 10 and maximum of 100 results. Workflows that only need a few candidate pages should keep this low, especially when also requesting content extraction, because response size, latency, and provider-reported cost can increase with more results and content fields.

`includeDomains` and `excludeDomains` shape the source universe. They are useful for "find similar pages only inside these official domains", "find comparable pages but exclude the seed publisher", or "discover alternatives outside known vendors." The OpenAPI common request schema documents up to 1200 domains for each list.

`startPublishedDate`, `endPublishedDate`, `startCrawlDate`, and `endCrawlDate` constrain freshness. Publication dates are estimated from HTML parsing, while crawl dates refer to when Exa discovered a link. For monitoring or competitive workflows, crawl-date filters can find newly discovered similar pages; for literature or news workflows, publication-date filters can limit stale results.

`moderation` can filter unsafe content. The source artifacts do not expose detailed policy categories or per-result moderation labels, so callers should treat it as a coarse filter rather than a compliance classification.

`contents` is optional and should be requested only when the workflow needs the body or excerpts immediately. `contents.text` can return full text or an object with `maxCharacters`, HTML-tag inclusion, verbosity, and section filters. `contents.highlights` can return relevant snippets and can be guided with a custom `query`; deprecated highlight controls should be avoided. `contents.summary` can produce a summary, optionally shaped by a query or schema. `contents.maxAgeHours` controls content freshness: positive values use fresh-enough cache, `0` always livecrawls, `-1` uses cache only, and omission livecrawls only when no cached content exists. `contents.subpages` and `contents.extras.links` can turn each similar page into a small local neighborhood, but they also increase response volume and potential cost.

### Outputs

`requestId` should be logged with the seed URL, filters, and budget policy. It is the main trace handle for retries, audit records, and joining downstream extraction or review work back to the exact similarity request.

Each result can include `title`, `url`, temporary Exa document `id`, estimated `publishedDate`, `author`, `image`, and `favicon` from the shared result schema. The inventory records `title`, `url`, `id`, `publishedDate`, and `author` as the core `/findSimilar` output fields. `id` is useful for later `/contents` retrieval, while `publishedDate` and `author` are helpful triage signals but may be absent or inferred.

Optional content fields appear only when requested. `results[].text` enables immediate reading or embedding; `results[].highlights` enables lightweight review; `results[].summary` supports faster clustering; `results[].subpages` exposes related pages under each result; and `results[].extras.links` can reveal citations, docs links, product links, or other outgoing references.

`costDollars.total` is provider-reported request cost in the response schema. Separately, the MPP wrapper inventory lists fixed payment metadata for `/findSimilar`: `protocol: MPP`, `method: tempo`, `amount: 5000`, `decimals: 6`, and `realm: mpp.tempo.xyz`. The artifact records both without assuming that wrapper payment amount is the same as direct Exa billing.

### Important Constraints Or Gaps

The MPP wrapper endpoint is `https://exa.mpp.tempo.xyz/findSimilar` and the original provider path is `https://api.exa.ai/findSimilar`. Original Exa API authentication uses `x-api-key` or `Authorization: Bearer`; Exa first-party x402 documentation is documented only for original `/search` and `/contents`, not `/findSimilar`.

No paid endpoint calls were made for this artifact. Wrapper-specific payment challenge headers, runtime errors, result caps, response envelope differences, and exact parity with Exa's official OpenAPI schema were not verified.

The default documented rate limit for `/findSimilar` is 10 QPS. Production workflows should throttle, cache similarity results for stable seed pages, and back off on `429`.

The documented error surface includes `400` for invalid request shape or `numResults`, `401` for missing or invalid direct Exa credentials, `402` for payment or budget exhaustion, `403` for permissions, policy, robots, or moderation issues, `422` for well-formed requests that cannot be processed, `429` for rate limits, and `500/502/503` for server or upstream errors.

Similarity ranking is not accompanied by an explanation field in the local inventory. Callers should not assume that result order proves authority, factual agreement, endorsement, licensing compatibility, or business relationship.

Content extraction can be stale or unavailable depending on cache state, crawl success, publisher restrictions, and requested freshness controls. High-stakes workflows should preserve source URLs, retrieval timestamps, content snapshots, and any per-call request metadata before using returned text in downstream decisions.

## Use Cases

### Competitive Content And Positioning Expansion

A product marketer or founder can seed `/findSimilar` with a competitor pricing page, launch post, docs page, or comparison article to discover adjacent pages that discuss similar products, categories, or positioning. `excludeDomains` can remove the known competitor, `includeDomains` can limit discovery to review sites or industry publications, and `startPublishedDate` or `startCrawlDate` can focus on recent market movement. Returned `title`, `url`, `publishedDate`, and `author` let the user decide which pages deserve manual review.

For a business workflow, the same call can feed a competitive-intelligence queue. Requesting `contents.highlights` with a query such as "pricing model, target customer, differentiators" or `contents.summary` can help analysts cluster pages before deeper review. Limitations are material: similarity is not sentiment or fact extraction, pricing may be embedded in dynamic pages, and any automated comparison should preserve source snapshots and respect page terms before distributing summaries internally.

### RAG Corpus Expansion From A Trusted Seed

A developer building a retrieval corpus can seed the endpoint with one authoritative document, such as an API reference page, standards document, tutorial, policy page, or known high-quality article. `includeDomains` can restrict expansion to official docs, while `excludeDomains` can prevent the corpus from being filled with mirrors, aggregators, or low-value domains. `numResults` bounds the ingestion candidate set, and `results[].id` or `results[].url` can be stored for downstream `/contents` calls.

When the workflow needs immediate ingestion candidates, `contents.text` with `maxCharacters`, `contents.highlights`, or `contents.summary` can return enough body material to score relevance before spending more on crawling. The main constraints are freshness and licensing: returned text is convenient for triage, but production RAG systems should keep source attribution, crawl timestamps, robots/terms checks, and deduplication logic rather than blindly embedding every similar page.

### Academic And Technical Literature Neighborhoods

A student, researcher, or engineer can start with a seed paper, benchmark page, RFC, architecture note, or incident postmortem and discover semantically related material without first designing a keyword query. The seed `url` carries more context than a few search terms, while `startPublishedDate` and `endPublishedDate` can narrow the result set to a research period. Result `title`, `url`, `author`, and `publishedDate` support quick screening.

For an organization, this pattern can support literature reviews, patent landscape triage, security research, or technical due diligence. `contents.highlights` can pull relevant excerpts, `contents.summary` can give a quick abstract-like overview, and `contents.extras.links` can expose outgoing references from similar pages. The endpoint does not return citation graphs, peer-review status, venue quality, or claim verification, so researchers still need manual validation and formal bibliographic tooling.

### Alternative Vendor And Tool Discovery

An individual buyer can seed the endpoint with a known SaaS product page, open-source project homepage, integration guide, or pricing page to find alternatives that occupy a similar space. `excludeDomains` can remove the original vendor, while `includeDomains` can focus on directories, marketplaces, docs sites, or review domains. The returned `title`, `url`, `favicon`, and optional `summary` make it practical to build a short comparison list.

Businesses can use the same pattern for procurement, partner discovery, build-vs-buy research, and ecosystem mapping. `contents.text` or `contents.highlights` can extract page-level claims such as supported integrations, deployment model, security posture, or target customer segment for analyst review. The endpoint should not be treated as a complete vendor-risk source: pricing, terms, data processing agreements, SOC reports, sanctions exposure, and current availability require separate verification.

### Editorial Related Reading And Content Clustering

A writer, editor, newsletter curator, or personal research assistant can seed `/findSimilar` with an article they trust and retrieve related reading without guessing the right keywords. Date filters can avoid stale recommendations, `moderation` can reduce unsafe material, and `numResults` keeps the reading list manageable. Returned metadata supports a simple queue: save the `url`, display `title` and `author`, and sort or filter by `publishedDate` when present.

For publishers or content teams, similar-page discovery can cluster archives, build related-article modules, identify coverage gaps, or find external references for editorial planning. `contents.summary` can help group results by angle, and `contents.extras.links` can reveal cited sources worth checking. Limitations include ranking opacity, possible topical drift from the seed page, and the need to respect copyright and syndication policies when using returned text.

### Fresh Similar-Source Monitoring

A monitoring workflow can keep a list of seed URLs representing important announcements, competitor launches, regulatory pages, vulnerability writeups, or market reports, then periodically call `/findSimilar` with `startCrawlDate` or `startPublishedDate` to find newly discovered related pages. `requestId`, seed `url`, filters, and returned `results[].url` values provide a provenance trail for each run.

For businesses, this can route new similar sources to security, legal, product, communications, or sales teams before a full crawler or analyst workflow runs. `contents.highlights` or `contents.summary` can provide enough context for routing, while `costDollars.total` and fixed wrapper payment metadata help enforce budget controls. The workflow still needs deduplication, rate-limit handling, alert fatigue controls, and human review for material decisions.

### Source Graph And Citation Trail Building

An analyst can start with a known source page and use `/findSimilar` plus `contents.extras.links` to collect pages that are both semantically close and link-rich. This is useful for building a map of documentation hubs, research clusters, media narratives, or product ecosystems. `results[].url` and `results[].id` identify the nodes, while `results[].extras.links` and `results[].subpages` expose edges for downstream graph analysis.

For a business, the same workflow can support knowledge-base maintenance, due-diligence source mapping, and lead-source attribution research. The endpoint can cheaply produce candidates, but the graph should preserve raw URLs, crawl timestamps, and content snapshots because extracted links can change and may include irrelevant navigation, tracking, or unrelated references. Compliance teams should also review whether storing or redistributing extracted text and links fits the source terms.
