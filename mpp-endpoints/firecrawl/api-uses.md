# Firecrawl API Uses

## Service Summary

Firecrawl is a web data API for AI applications. It turns known URLs, search results, and websites into LLM-ready outputs such as markdown, HTML, links, screenshots, metadata, change-tracking output, and structured JSON. The MPP service at `https://firecrawl.mpp.tempo.xyz` wraps five Firecrawl-compatible `/v1` endpoints: scrape, crawl, map, search, and extract.

The most valuable pattern is controlled web-data acquisition. Firecrawl helps users decide which URLs matter, capture clean content from those URLs, monitor public changes, search for relevant sources, and submit structured extraction jobs. For MPP use, it is especially relevant for occasional paid web-data tasks where a caller wants endpoint-level access rather than a direct Firecrawl subscription.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Single-Page Capture And Change Tracking | 1 | Capture one known URL as markdown, HTML, raw HTML, links, screenshots, metadata, optional LLM extraction, and change-tracking output. | [Details](api-uses/single-page-capture-and-change-tracking.md) |
| Site Discovery And Crawling | 2 | Discover site URLs with map, then submit bounded multi-page crawl jobs with scrape options, path filters, concurrency controls, and webhooks. | [Details](api-uses/site-discovery-and-crawling.md) |
| Web Search And Result Capture | 1 | Search the public web, filter by time/location, and optionally scrape result pages into content and metadata. | [Details](api-uses/web-search-and-result-capture.md) |
| Structured Multi-Page Extraction | 1 | Submit URL sets or URL globs with prompts and JSON Schema to start structured extraction jobs. | [Details](api-uses/structured-multi-page-extraction.md) |

## Highest-Value Uses

1. Public page monitoring. Track pricing, terms, policies, docs, product pages, and public notices with scrape content, status metadata, and change-tracking output.

2. AI-ready knowledge ingestion. Turn public docs, help centers, articles, or site sections into normalized markdown and links before indexing or summarization.

3. Crawl planning and bounded acquisition. Use map to estimate URL scope, then submit crawls with explicit `includePaths`, `excludePaths`, `limit`, `delay`, and `maxConcurrency`.

4. Research source discovery. Use search to find relevant public sources, optionally scrape result pages, and pass vetted URLs into scrape, crawl, extract, or human review.

5. Structured web-data extraction. Use extract or scrape JSON options to convert heterogeneous pages into fields such as prices, product attributes, policy clauses, event details, or vendor profile data.

6. Web evidence and QA capture. Save page metadata, status codes, HTML, screenshots, mobile views, action outputs, and source URLs for support, compliance, or regression review.

## Personal Use Opportunities

- Monitor an important public page for changes before renewing, buying, traveling, applying, or filing a support case.
- Save articles, recipes, documentation, and reference pages as markdown with title, description, source URL, links, and optional screenshots.
- Search recent public sources with `query`, `limit`, `tbs`, and `location`, then scrape the most useful result pages for an AI assistant.
- Compare products, rentals, events, or services by extracting prices, availability, restrictions, dates, and source links from known pages.
- Map a documentation site before deciding which pages to ingest into a personal knowledge base.

## Business Use Opportunities

- Competitive intelligence: monitor competitor pricing, packaging, product pages, docs, changelogs, and hiring pages with scrape and change tracking.
- Sales and partnerships: search for accounts, scrape known company pages, and extract public positioning, product categories, integration language, and contact-page links.
- SEO and content operations: map site URLs, inspect section coverage, search for target terms, and crawl selected sections for page content.
- Support and developer experience: ingest public docs and help-center content as markdown for retrieval and assistant workflows.
- Procurement and compliance: extract vendor terms, data-retention statements, refund clauses, SLA language, and security claims into reviewable schemas.
- Data migration and catalog normalization: submit structured extraction jobs for public catalogs, docs tables, event listings, or product pages.

## Endpoint Group Summaries

### Single-Page Capture And Change Tracking

This group is for known URLs. `POST /v1/scrape` can return clean markdown, HTML, raw HTML, screenshots, extracted links, page metadata, status/error information, action results, LLM extraction output, and change-tracking fields. It is the best fit for page monitoring, web clipping, page evidence, product-page normalization, and known-domain lead research. Full details: [api-uses/single-page-capture-and-change-tracking.md](api-uses/single-page-capture-and-change-tracking.md).

### Site Discovery And Crawling

This group is for site-scale scope. `POST /v1/map` discovers URLs without scraping content, while `POST /v1/crawl` submits a multi-page crawl with path filters, depth controls, page limits, webhook options, and scrape options. It is useful for crawl planning, docs/help-center ingestion, SEO coverage audits, and controlled crawling. Full details: [api-uses/site-discovery-and-crawling.md](api-uses/site-discovery-and-crawling.md).

### Web Search And Result Capture

This group is for query-led discovery. `POST /v1/search` accepts a search query, limit, time filter, location, timeout, invalid URL handling, and optional scrape options. It returns result titles, descriptions, URLs, and optional scraped content/metadata. It is useful for fresh research, lead discovery, public issue triage, SEO gap research, and RAG source discovery. Full details: [api-uses/web-search-and-result-capture.md](api-uses/web-search-and-result-capture.md).

### Structured Multi-Page Extraction

This group submits schema-guided extraction jobs. `POST /v1/extract` accepts URL globs, prompts, JSON Schema, optional web search, source inclusion, sitemap/subdomain controls, scrape options, and invalid URL handling. It is useful for competitor pricing extraction, vendor profile normalization, public policy clause extraction, catalog/event normalization, and docs table extraction. The key caveat is that this MPP bundle includes the submit endpoint but not the result retrieval endpoint. Full details: [api-uses/structured-multi-page-extraction.md](api-uses/structured-multi-page-extraction.md).

## Field And Data Themes

- URL identity: `url`, `urls`, `data[].url`, `data.metadata.sourceURL`, `map.links`, crawl `url`, and job `id`.
- Content outputs: `markdown`, `html`, `rawHtml`, `links`, `screenshot`, action outputs, page metadata, `llm_extraction`, and extraction job ids.
- Scope controls: `includePaths`, `excludePaths`, `regexOnFullURL`, `maxDepth`, `maxDiscoveryDepth`, `ignoreSitemap`, `sitemapOnly`, `includeSubdomains`, `allowExternalLinks`, `allowSubdomains`, and `limit`.
- Freshness and timing: `maxAge`, `timeout`, `waitFor`, `delay`, `maxConcurrency`, `tbs`, and `changeTracking.previousScrapeAt`.
- Localization and access behavior: `location`, `location.country`, `location.languages`, `headers`, `mobile`, `proxy`, `storeInCache`, and `zeroDataRetention`.
- Structured extraction: `jsonOptions.schema`, `jsonOptions.prompt`, `schema`, `prompt`, `showSources`, `enableWebSearch`, and `invalidURLs`.
- Operational signals: `metadata.statusCode`, `metadata.error`, `warning`, 402 payment errors, 408 search timeout, 429 rate/concurrency errors, and 500 server errors.
