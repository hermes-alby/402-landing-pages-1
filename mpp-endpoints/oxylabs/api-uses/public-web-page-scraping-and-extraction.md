# Oxylabs: Public Web Page Scraping And Extraction API Uses

## What This Endpoint Group Does

This endpoint group covers one paid MPP proxy endpoint for scraping a public web page through Oxylabs. The wrapper is useful when an agent or workflow needs one page fetch with stronger success characteristics than a plain HTTP client: managed proxy rotation, optional country-level location, JavaScript rendering for dynamic pages, and native Oxylabs output modes such as HTML, parsed JSON, screenshot, or markdown where the wrapper supports them.

The important caveat is schema uncertainty. The MPP service description explicitly mentions public URL scraping, geo-targeting, and JavaScript rendering. Other fields in this artifact come from official Oxylabs native Web Scraper API documentation and should be treated as likely or possible wrapper capabilities until tested against a payment-aware MPP client.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/proxy` | Scrape a public URL with optional geo-targeting and JavaScript rendering. | `url`, `geo_location`, `render`; native docs also describe `source`, `parse`, `markdown`, `user_agent_type`, and `context`. | Native docs show `results[].content`, timestamps, `page`, `url`, `job_id`, and `status_code`; wrapper envelope is unpublished. |

## Field Notes

### Inputs

`url` is the central field. It identifies the public web page to retrieve. The native Oxylabs universal source expects `source: "universal"` with `url`, while the MPP wrapper may hide `source` or require it.

`geo_location` lets the scrape run as if browsing from another country, which matters for localized prices, availability, SERP results, regulatory banners, or country-specific content. Oxylabs publishes a large list of supported country names and warns that SERP and ecommerce localization can have target-specific behavior.

`render` controls JavaScript rendering in the native API. `render: "html"` returns rendered page HTML, while `render: "png"` returns a base64 screenshot. This matters for client-rendered stores, dashboards, travel pages, and pages that load important content after the initial HTML response.

Native docs also describe `parse`, `markdown`, `user_agent_type`, and `context`. These fields can make the endpoint much more useful: `parse` can return structured JSON for supported page types; `markdown` can produce LLM-friendly page text; `user_agent_type` can switch between desktop, mobile, and browser-family presets; `context` can pass headers, cookies, redirects, sessions, target HTTP method, and base64 target POST body. The MPP wrapper does not independently document support for these options.

### Outputs

Native Realtime examples return a `results` array. Each result can include `content`, `created_at`, `updated_at`, `id`, `page`, `url`, `job_id`, and `status_code`.

`content` is the value-producing field. It can be raw HTML for extraction, rendered HTML for dynamic pages, markdown for RAG-style ingestion, base64 PNG for visual checks, or parsed JSON when `parse: true` and a dedicated parser exists. Official downloadable examples show both raw HTML content and parsed ecommerce objects.

`status_code` is operationally important. Native Oxylabs billing docs say target-site `2xx` and `4xx` results are treated as successful and billable, `429` is not billed, and Oxylabs-side `5xx`/`6xx` failures are not billed. The MPP wrapper may add its own payment and error envelope.

### Important Constraints Or Gaps

- The MPP host did not expose an OpenAPI schema, `llms.txt`, or x402 discovery document by public GET.
- The exact wrapper request and response schemas are unknown.
- The dynamic price formula is unknown.
- The wrapper may only support a subset of native Oxylabs fields.
- Native Realtime scraping is synchronous and requires the connection to remain open until completion or error.
- Rendering, parsing, screenshots, and large pages may cost more or take longer, but wrapper-specific pricing is not published.
- Public web scraping has legal and compliance constraints. Oxylabs docs tell users to consult legal advisors and target-site terms before scraping.

## Use Cases

### Location-Aware Price And Availability Checks

A shopper could check whether a product page shows different prices, shipping availability, or inventory messages in another country before buying or traveling. A business could monitor regional storefronts by submitting the same `url` with different `geo_location` values and comparing returned `content` or parsed fields. The valuable fields are `url`, `geo_location`, `results[].content`, `results[].status_code`, and timestamps for auditability.

This is especially useful for ecommerce, marketplaces, travel pages, and localized SaaS pricing pages. The limitation is that the wrapper does not document bulk submission, so repeated country comparisons would require multiple paid requests and careful spend control.

### Dynamic Page Capture For Research Agents

An individual research assistant can fetch pages that ordinary HTTP requests miss because content is loaded by JavaScript. A business research pipeline can use `render: "html"` to collect rendered product, pricing, competitor, or policy pages and then pass `results[].content` into downstream extractors. For visual QA, `render: "png"` can produce a screenshot-style artifact when the exact rendered state matters.

The key decision value is confidence: the returned content is closer to what a browser sees, not just the initial server response. The tradeoff is cost and latency. Native docs have separate rendered-job rate limits, and the MPP wrapper has unknown dynamic pricing for rendered requests.

### LLM-Ready Public Page Ingestion

A personal knowledge workflow could fetch a public article or documentation page and store markdown-like content in notes. A business RAG pipeline could use native `markdown: true` where the wrapper supports it, preserving `results[].url`, timestamps, and `job_id` as provenance for chunks or extracted claims. This is more useful than raw HTML when an LLM needs clean headings, paragraphs, links, and lists.

The gap is wrapper support. Oxylabs native docs clearly describe markdown output, but the MPP wrapper does not confirm the `markdown` parameter. If unsupported, the workflow can still fetch HTML and transform it separately.

### Competitor Change Monitoring

A person could watch a few public pages such as plan pages, release notes, or product listings and detect meaningful changes over time. A business could schedule paid calls to key competitor URLs, store `results[].content`, and diff normalized content by `url`, `created_at`, and `updated_at`. `status_code` helps distinguish real page changes from failed fetches or blocked states.

This endpoint is useful for low-volume, high-value monitoring where avoiding an Oxylabs monthly plan matters. It is less suitable for broad crawling because the MPP service publishes only a single-request proxy endpoint, not crawl scheduling, queues, or bulk job management.

### Mobile Versus Desktop Page Inspection

If the wrapper accepts native `user_agent_type`, an individual can inspect whether a page changes between mobile and desktop views. A business can compare mobile ecommerce layouts, ad placements, consent flows, or localized landing pages by varying `user_agent_type` and possibly `geo_location`. The key output remains `content`, but the operational fields `url`, `job_id`, and `status_code` let teams track which variant was fetched.

The limitation is that the MPP wrapper does not independently document `user_agent_type`. Also, browser headers and device presentation can affect compliance and website terms, so teams should review allowed use.

### Public Evidence Capture For Support Or Compliance

A user can capture the current public state of a page when disputing a price, policy, or availability statement. A business can record public policy pages, terms pages, or product detail pages as evidence inputs for support, compliance, or audit workflows. The most important fields are `results[].content`, `results[].url`, `results[].created_at`, `results[].updated_at`, `results[].status_code`, and possibly a rendered screenshot via `render: "png"`.

This is valuable because a successful scrape can preserve both the content and retrieval metadata. It should not be treated as a legally certified archive by itself; retention, chain-of-custody, and target-site terms remain outside the API.

### Fallback Fetching For Blocked Or Fragile Pages

A personal automation can use this endpoint only when normal `GET` requests fail or return incomplete content. A business extraction stack can route difficult pages to Oxylabs as a paid fallback while keeping cheap direct requests for simple pages. Fields such as `status_code`, `render`, `geo_location`, and `content` support automated retry decisions and escalation rules.

The endpoint's pay-per-request MPP shape is a good fit for fallback usage because occasional hard pages may not justify a direct monthly Oxylabs plan. The gap is cost predictability: the MPP feed marks payment as dynamic, and no price schedule was found for the wrapper.
