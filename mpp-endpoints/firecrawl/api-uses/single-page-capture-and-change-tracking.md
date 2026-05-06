# Firecrawl: Single-Page Capture And Change Tracking API Uses

## What This Endpoint Group Does

This group captures one known URL and returns clean page content plus optional evidence and derived data. `POST /v1/scrape` can return markdown, HTML, raw HTML, links, screenshots, metadata, action outputs, LLM extraction output, warnings, and change-tracking results. The request controls DOM inclusion/exclusion, cache freshness, browser-like actions, proxy mode, location/language, PDF parsing, JSON extraction, and zero-data-retention.

The strongest use cases are workflows where the user already knows the page to inspect: a pricing page, product page, policy page, landing page, docs page, competitor page, or lead website. The endpoint is valuable because it gives both content and context fields such as `metadata.sourceURL`, `metadata.statusCode`, `metadata.error`, `links`, `llm_extraction`, screenshots, and `changeTracking`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/scrape` | Scrape a single URL and optionally extract information using an LLM. | `url`, `formats`, `onlyMainContent`, `includeTags`, `excludeTags`, `maxAge`, `headers`, `waitFor`, `mobile`, `timeout`, `parsePDF`, `jsonOptions.schema`, `jsonOptions.prompt`, `actions`, `location`, `proxy`, `storeInCache`, `changeTrackingOptions`, `zeroDataRetention` | `data.markdown`, `data.html`, `data.rawHtml`, `data.screenshot`, `data.links`, `data.actions.*`, `data.metadata.*`, `data.llm_extraction`, `data.warning`, `data.changeTracking.*`, error bodies for 402/429/500 |

## Field Notes

### Inputs

The required input is `url`. The most important workflow controls are `formats` for choosing markdown, HTML, raw HTML, links, screenshots, JSON, or change tracking; `maxAge` for allowing cached content; `includeTags` and `excludeTags` for narrowing the DOM; `jsonOptions.schema` and `jsonOptions.prompt` for structured extraction; and `actions` for simple page interaction before capture. `location.country` and `location.languages` help inspect localized or language-specific pages, while `proxy`, `headers`, `storeInCache`, and `zeroDataRetention` affect access behavior and retention posture.

### Outputs

The main content outputs are `data.markdown`, `data.html`, `data.rawHtml`, `data.links`, and `data.screenshot`. `data.metadata` provides page title, description, language, source URL, keywords, HTTP status code, and target-page error information. `data.llm_extraction` holds schema-guided extraction output when requested. `data.actions` can contain screenshot URLs, scraped HTML from action steps, JavaScript return values, and PDFs. `data.changeTracking` can report `previousScrapeAt`, `changeStatus`, `visibility`, `diff`, and JSON comparison output when change tracking is requested.

### Important Constraints Or Gaps

Firecrawl charges direct upstream credits for page processing and modifiers such as PDF parsing, JSON extraction, enhanced access, and zero-data-retention; the MPP wrapper also lists its own payment amount. Screenshots from action results expire after 24 hours in the upstream schema. The local artifacts do not document whether MPP users share upstream cache and change-tracking history, or whether upstream modifier costs can affect MPP payment beyond the listed amount. No paid scrape calls were made for this research.

## Use Cases

### Pricing, Terms, And Policy Change Monitoring

A person can track a subscription, insurance, school, airline, or government page and ask whether anything material changed before making a renewal, travel, or compliance decision. A business can monitor competitor pricing, vendor terms, privacy policies, or regulatory guidance by requesting `formats: ["markdown", "changeTracking"]` and reading `data.changeTracking.changeStatus`, `previousScrapeAt`, `diff`, and `metadata.statusCode`.

The useful fields are the content fields plus `metadata.sourceURL`, `metadata.title`, and target HTTP status. A workflow can alert only when `changeStatus` is `changed`, `new`, or `removed`, then attach the markdown or diff to a review ticket. The main caveat is freshness: `maxAge` should be low or zero for high-stakes monitoring, and the bundle does not prove that MPP access preserves Firecrawl's change-tracking history across calls.

### Personal Web Clipper For AI Notes

A personal agent can turn a saved article, recipe, documentation page, travel page, or forum post into markdown and metadata for a note system. The request can use `onlyMainContent`, `excludeTags`, `removeBase64Images`, and `formats: ["markdown", "links"]`; the response gives `data.markdown`, `data.links`, `metadata.title`, `metadata.description`, and `metadata.sourceURL`.

For a business, the same workflow becomes a controlled ingestion step for internal knowledge bases: capture vendor docs, support pages, release notes, and public knowledge articles as normalized markdown before indexing. `maxAge` can reduce repeated scraping cost for stable pages, while `metadata.statusCode` and `metadata.error` help avoid indexing blocked or broken pages as if they were valid content.

### Product And Marketplace Page Normalization

An individual shopping for a product, rental, event, or school program can ask for specific fields from one page, such as price, availability, delivery timing, address, refund terms, or features. A business can use `jsonOptions.schema` and `jsonOptions.prompt` to normalize product pages, competitor SKUs, job posts, directory listings, or partner pages into predictable fields inside `data.llm_extraction`.

The endpoint is useful because it pairs schema-guided extraction with original content evidence. A workflow can compare extracted fields against the markdown and use `warning` when extraction is uncertain. Missing dependencies should stay explicit: this endpoint captures one URL at a time and does not discover all product pages by itself; pair it with map, search, or an external URL list for broader coverage.

### Visual And Responsive Evidence Capture

A person can preserve a screenshot of a web page when filing a support case, documenting a booking detail, or saving proof of a public notice. A business can use `formats` or `actions` to capture screenshots for QA, brand compliance, regulatory evidence, or customer-support investigation. `mobile` and `location` help compare what different users may see.

The relevant outputs are `data.screenshot`, `data.actions.screenshots`, `metadata.sourceURL`, `metadata.statusCode`, and optional `rawHtml`. The limitation is retention: action screenshot URLs are documented as expiring after 24 hours, so a production evidence workflow needs to copy approved artifacts into its own storage according to its retention policy.

### Lead And Account Research From A Known Domain

A personal freelancer can summarize a target company's home page before outreach. A sales, recruiting, or partnerships team can capture the public website of a lead and extract company positioning, product categories, contact-page links, hiring signals, compliance statements, or partner language using `links`, `metadata`, markdown, and optional `llm_extraction`.

This endpoint supports a clear decision: whether the account is worth routing to a rep, a recruiting sequence, or a partner workflow. It should not be treated as a complete enrichment API by itself, because it only sees the requested URL and whatever links/content are present there. Site discovery or search may be needed first for coverage.
