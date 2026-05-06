# Firecrawl: Web Search And Result Capture API Uses

## What This Endpoint Group Does

This group starts from a search query rather than a known URL. `POST /v1/search` returns web result metadata and can optionally scrape each result through `scrapeOptions`. It supports query text, result limits, time-based filters, location, timeout, invalid URL handling, and many of the same scrape options used by page capture.

The endpoint is strongest for discovery and first-pass research: find relevant pages, collect titles and descriptions, optionally capture full page markdown or HTML, and pass vetted URLs to scrape, extract, crawl, or human review.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/search` | Search the web and optionally scrape search results. | `query`, `limit`, `tbs`, `location`, `timeout`, `ignoreInvalidURLs`, `scrapeOptions` | `success`, `data[].title`, `data[].description`, `data[].url`, optional `data[].markdown`, `data[].html`, `data[].rawHtml`, `data[].links`, `data[].screenshot`, `data[].metadata.*`, `warning`, `id`, error bodies for 408/500 |

## Field Notes

### Inputs

The required input is `query`. `limit` controls result count, `tbs` narrows recency or date range, and `location` localizes the search. `ignoreInvalidURLs` is useful when piping results into other Firecrawl endpoints. `scrapeOptions` can request result-page markdown, HTML, raw HTML, links, screenshots, JSON-like extraction options, page actions, location/language settings, proxy mode, and cache behavior.

### Outputs

The base search outputs are `title`, `description`, and `url` per result. When scraping is requested, each result can include `markdown`, `html`, `rawHtml`, `links`, `screenshot`, and `metadata` with source URL, status code, and error information. The response can also include `warning` and an `id` for the search job.

### Important Constraints Or Gaps

The v1 inventory exposes a narrower set of search fields than the current docs snapshot, so this artifact does not assume newer filters such as result categories or domain include/exclude fields are available through this MPP wrapper. Search may time out with 408. Direct Firecrawl billing prices search by result batches and adds scrape costs when results are scraped; the MPP wrapper has its own listed payment amount. No paid search requests were made for this research.

## Use Cases

### Fresh Topic Research With Source Capture

A personal agent can search for recent articles about a medical appointment topic, travel disruption, software release, or consumer purchase and request only a small `limit` with a recent `tbs` filter. A business analyst can run recurring searches for market events, competitor launches, regulatory changes, or customer mentions, then request markdown for the highest-value result pages.

The fields that matter are `query`, `limit`, `tbs`, `location`, `data[].title`, `data[].description`, `data[].url`, and optional `data[].markdown`. These fields support a decision about which sources are relevant enough to read, summarize, cite, or pass into deeper extraction. The caller should avoid treating search results as authoritative without source review.

### Lead, Account, And Partner Discovery

A freelancer can find a target company's public pages, leadership interviews, product mentions, or integration docs before outreach. A sales or partnerships team can search by company name, domain, product category, geography, or problem keywords, then use `scrapeOptions.formats` to capture page content for qualification.

The useful outputs are result URLs, titles, descriptions, optional markdown, links, and metadata. The workflow can score whether an account has a relevant use case, whether a partner integration exists, or whether a company is actively hiring or launching a product. If the business needs structured company fields, search should feed known URLs into scrape or extract rather than relying only on result snippets.

### Public Issue And Incident Triage

A person can search for an error message, service outage, product recall, or travel disruption with a time filter and use result descriptions to decide what to check first. A support or developer-relations team can search for customer-visible incidents across docs, forums, GitHub issues, or public web pages, optionally capturing result-page markdown.

`tbs`, `location`, `data[].metadata.statusCode`, and `warning` are useful for triage because they separate fresh results from stale ones and flag scrape problems. The limitation is that the v1 wrapper inventory does not expose source category fields, so workflows that need GitHub-only or PDF-only searches may need a newer provider endpoint or external filtering.

### SEO And Content Gap Research

A personal site owner can search for target terms and inspect which competitor or reference pages appear. A business SEO or content team can combine query operators such as quoted phrases or `site:` operators from the docs with `limit`, `location`, and optional result scraping to compare titles, descriptions, and content themes.

The endpoint helps decide which topics need content, which pages rank for specific terms, and which URLs should be scraped or crawled for deeper analysis. It is not a complete rank-tracking system by itself; persistent rankings, device segmentation, and SERP features require additional fields or external measurement.

### RAG Source Discovery Before Indexing

A personal agent can search for the best public sources before answering a question, then only ingest result markdown from trustworthy URLs. A business AI product can use search as a pre-indexing step: find candidate pages, reject irrelevant or invalid URLs, and pass accepted pages to scrape, crawl, or extract.

The useful inputs are `ignoreInvalidURLs` and `scrapeOptions`; the useful outputs are result metadata, markdown/HTML, links, and page status. This keeps ingestion bounded and explainable because every retrieved document starts with a search query and source URL. The caller still needs source ranking, deduplication, and compliance review outside this endpoint.
