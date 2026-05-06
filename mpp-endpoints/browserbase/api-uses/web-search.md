# Browserbase: Web Search API Uses

## What This Endpoint Group Does

Browserbase Web Search performs a structured web search from a short `query` and returns a bounded list of candidate result records. It is useful when an agent or workflow needs to discover likely pages before deciding whether to fetch a page, open a browser session, queue human review, or store source metadata.

This group owns only search. It does not retrieve page bodies, execute JavaScript, interact with pages, fill forms, or verify that the result page content still matches the title or snippet implied by search. The value is in the low-friction candidate set: `requestId` for traceability, the executed `query`, and result-level `id`, `url`, `title`, optional `author`, optional `publishedDate`, optional `image`, and optional `favicon`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/search` | Run a web search and return structured result metadata. | `query` string from 1 to 200 characters; optional `numResults` integer from 1 to 25, default 10. | `requestId`, executed `query`, `results[].id`, `results[].url`, `results[].title`, optional `results[].author`, `results[].publishedDate`, `results[].image`, `results[].favicon`. |

## Field Notes

### Inputs

`query` is the main control surface. It should be specific enough to identify useful candidate pages, because the API does not expose advanced filters, ranking controls, geography, language, date ranges, safe-search controls, or search verticals in the documented schema.

`numResults` controls breadth and cost efficiency. The documented range is 1 to 25 and the default is 10. Small values are useful for routing or preflight checks; larger values are useful when a workflow needs multiple independent sources or enough candidates for deduplication.

### Outputs

`requestId` is important for logs, retries, audits, and joining downstream work back to the exact search call that produced the candidates. The returned `query` lets pipelines record the normalized or executed query alongside the request.

Each result has required `id`, `url`, and `title`. Those fields support deduplication, source routing, and queueing follow-up fetches or browser sessions. Optional `author` and `publishedDate` can help prioritize recent or attributable sources, but they may be missing and should not be treated as guaranteed freshness or authorship proof. Optional `image` and `favicon` help build review interfaces and quickly distinguish sources, but they are presentation metadata rather than evidence that a page is authoritative.

### Important Constraints Or Gaps

The MPP wrapper endpoint has payment metadata of `amount: 10000` with `decimals: 6`, interpreted in the inventory as 0.01 units of the listed currency per request. Browserbase's direct account pricing also lists Search API overage at $7 per 1,000 searches on Developer and Startup plans, but the source artifacts did not find a standalone public direct Search price outside plan credits and overages.

Browserbase's Search docs state a rate limit of 120 requests per minute per project and return `429` when exceeded. The plan table also lists Search API RPS as 2 for Free, Developer, and Startup, with custom limits on Scale. Workflows should throttle, batch, cache, and use exponential backoff.

Documented error statuses are `400` for invalid requests such as empty `query` or out-of-range `numResults`, `403` when Search is not enabled, `429` for rate limits, `503` for temporary service unavailability, and `500` for internal errors. The OpenAPI snippet defines the 200 response schema, while detailed error response bodies are not specified beyond status information in the local inventory.

The direct Browserbase API uses `X-BB-API-Key`. The MPP `/search` endpoint uses the wrapper payment flow, but Browserbase's first-party Search docs do not document MPP-specific payment headers for search.

## Use Cases

### Research Source Triage

A person researching a medical appointment, school choice, legal question, hobby purchase, or technical decision could run focused queries and use `title`, `url`, `author`, and `publishedDate` to assemble a shortlist of sources before reading them. `numResults` keeps the search bounded, while `requestId` and the returned `query` make it possible to save the provenance of a research run. The useful decision is not "what is true" from search alone, but which sources deserve deeper review.

For a business, the same pattern supports analyst workflows, market research, policy monitoring, and sales enablement. Search can find candidate pages from competitors, regulators, industry publications, or customer communities, then hand the URLs to a separate fetch, browser, or human-review step. The limitation is that this endpoint does not return page content or verify freshness beyond optional `publishedDate`; high-stakes analysis needs downstream source inspection and citation capture.

### RAG And Knowledge-Base Seeding

Developers can use Web Search to discover likely documents for a retrieval pipeline: official docs, changelogs, API references, forum posts, or release notes. `url` identifies crawl targets, `title` gives a cheap relevance signal, `publishedDate` helps prefer recent material when present, and `author` can help separate official or named sources from unattributed pages.

For a business knowledge base, this is valuable as a pre-crawl stage. Instead of sending broad web traffic into a crawler, the system can issue targeted queries, cap `numResults`, deduplicate by `url` or result `id`, then send only promising pages to a content extraction process. Search should not be treated as ingestion by itself; the body text, robots/compliance checks, source licensing, and page snapshots belong to downstream systems.

### Lead And Account Discovery

A person looking for jobs, collaborators, local services, or communities can search for specific combinations such as role, location, tool, or organization type. The endpoint returns candidate pages with `title` and `url`, and optional `favicon` or `image` can make a review list easier to scan. The user can then decide which organizations or pages to inspect manually.

For businesses, search can feed top-of-funnel discovery for accounts, partner lists, public directories, job posts, event pages, and buying-signal pages. `query` design matters because the endpoint does not expose filters for company size, geography, or industry as structured fields. Search results can identify candidate URLs, but enrichment, contact discovery, scoring, and CRM mutation require other systems and should not be inferred from this endpoint alone.

### Brand, Reputation, And Incident Monitoring

A person can monitor their name, project, open-source package, or creator handle by running saved queries and comparing new `url` and `title` values over time. Optional `publishedDate` can help prioritize recent mentions, and `favicon` can quickly distinguish social, forum, news, or vendor sources in a review queue.

A business can use the same workflow for product names, executive names, security advisories, outage reports, competitor mentions, and customer complaints. The endpoint enables early routing: send likely incidents to support, security, communications, or legal review based on result metadata. It is not a complete monitoring product by itself because there are no guaranteed alerts, sentiment fields, source credibility scores, or page body excerpts in the documented response.

### Competitive And Pricing Watchlists

An individual buyer can search for product names, alternatives, reviews, or pricing pages and use `title`, `url`, optional `image`, and optional `publishedDate` to decide which pages to compare next. This keeps exploratory shopping or vendor selection lightweight before opening each page.

Businesses can monitor competitors' public pricing, docs, launch posts, partnership pages, and comparison pages. Search results provide candidate URLs and a timestamp-like freshness signal when `publishedDate` is present, allowing a workflow to queue downstream fetches or browser sessions only when new or relevant pages appear. The search endpoint does not extract prices, terms, screenshots, or page diffs, so those decisions need follow-up retrieval and validation.

### Agent Preflight Before Browser Spend

Agent systems can call search before starting a more expensive or stateful browsing task. `numResults` can be set low for fast route selection, and result `url` plus `title` can determine whether the agent should fetch a static page, open a browser session, ask for clarification, or stop because no suitable candidates were found.

For businesses running many agents, this improves cost and rate-limit discipline. A search call with known per-request payment metadata can act as a cheap discovery step before browser sessions, proxy bandwidth, or human review are used. The important caveat is that the search result is only a candidate pointer; any automation that will make decisions, quote facts, or interact with a page should fetch or browse the target and preserve its own source snapshot.
