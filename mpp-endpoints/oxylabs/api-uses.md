# Oxylabs API Uses

## Service Summary

Oxylabs is a web data collection provider. Its native Web Scraper API handles proxy rotation, anti-bot bypassing, JavaScript rendering, parsing, and delivery for public web scraping jobs. The MPP service wraps this provider with one paid endpoint: `POST /v1/proxy`, described as scraping a public URL with optional geo-targeting and JavaScript rendering.

The strongest API-use opportunity is selective, accountless access to high-friction public page retrieval: pages that are localized, dynamic, blocked by simple HTTP clients, or valuable enough to justify a paid one-off scrape.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Public Web Page Scraping And Extraction | 1 | Fetch a public URL through Oxylabs-managed scraping infrastructure, optionally using proxy location, JavaScript rendering, and native extraction/output controls where the wrapper supports them. | [`api-uses/public-web-page-scraping-and-extraction.md`](api-uses/public-web-page-scraping-and-extraction.md) |

## Highest-Value Uses

- Location-aware price and availability checks for ecommerce, travel, marketplaces, and localized SaaS pages.
- Rendered capture of dynamic pages that direct HTTP clients cannot extract reliably.
- LLM-ready ingestion of public pages, especially if the wrapper supports native `markdown: true`.
- Paid fallback fetching for pages that fail direct requests, letting teams reserve spend for hard targets.
- Evidence capture of public page states with URL, timestamp, status code, and optionally screenshot-style output.

## Personal Use Opportunities

A personal agent can fetch a hard-to-access public page, compare regional variants with `geo_location`, or capture a rendered page before making a purchase or saving research notes. The most useful fields are `url`, `geo_location`, `render`, `results[].content`, `results[].url`, timestamps, and `status_code`.

The personal fit is strongest for occasional use. The MPP wrapper avoids a direct Oxylabs account and monthly minimum, but dynamic per-call pricing is not published.

## Business Use Opportunities

Businesses can use the endpoint as a focused extraction tool for competitive monitoring, regional ecommerce checks, dynamic page capture, compliance evidence, and fallback scraping. The endpoint can enrich existing workflows by turning a target URL into page content, parsed JSON, markdown, or screenshot output, depending on wrapper support.

The business fit is strongest when the workflow needs a small number of high-value public fetches. High-volume scraping may still favor direct Oxylabs plans because native pricing, result quotas, support, and rate limits are published for subscription customers.

## Endpoint Group Summaries

### Public Web Page Scraping And Extraction

This group covers `POST /v1/proxy`. The central input is `url`, with `geo_location` for location-aware retrieval and `render` for JavaScript-rendered HTML or PNG screenshot output. Native Oxylabs docs also describe `parse`, `markdown`, `user_agent_type`, and `context`, but the MPP wrapper does not publish its own schema, so those fields are marked as possible native capabilities rather than confirmed wrapper fields.

Full details: [`api-uses/public-web-page-scraping-and-extraction.md`](api-uses/public-web-page-scraping-and-extraction.md)

## Field And Data Themes

- Target selection: `url`, `source`.
- Localization: `geo_location`.
- Rendering and output mode: `render`, `parse`, `markdown`, `content_encoding`.
- Browser/request context: `user_agent_type`, `context.headers`, `context.cookies`, `context.http_method`, `context.content`, `context.follow_redirects`, `context.session_id`.
- Returned content: `results[].content`, which can be HTML, rendered HTML, parsed JSON, markdown, or base64 PNG in native Oxylabs flows.
- Provenance and operations: `results[].url`, `results[].job_id`, `results[].created_at`, `results[].updated_at`, `results[].status_code`.
- Payment: MPP dynamic Tempo charge with no static amount published.
