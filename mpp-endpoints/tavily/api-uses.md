# Tavily API Uses

## Service Summary

Tavily provides AI-oriented public web search, content extraction, site mapping, and crawling APIs for agent, RAG, research, and enrichment workflows. The MPP service exposes four paid Tavily POST endpoints through `https://tavily.mpp.paywithlocus.com/tavily/`: Search, Extract, Map, and Crawl.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Web Search And Source Discovery | 1 | Query the live web for ranked source URLs, snippets, optional answer text, optional raw content, images, and relevance scores. | [api-uses/web-search-and-source-discovery.md](api-uses/web-search-and-source-discovery.md) |
| Known URL Content Extraction | 1 | Turn selected public URLs into clean markdown or text, with per-URL failure reporting and optional query-focused chunks. | [api-uses/known-url-content-extraction.md](api-uses/known-url-content-extraction.md) |
| Site Structure Mapping | 1 | Discover URL inventories from a website before deciding what to extract or crawl. | [api-uses/site-structure-mapping.md](api-uses/site-structure-mapping.md) |
| Site Crawling And Content Ingest | 1 | Traverse a public site and extract content from discovered pages in one operation. | [api-uses/site-crawling-and-content-ingest.md](api-uses/site-crawling-and-content-ingest.md) |

## Highest-Value Uses

Tavily is most valuable when a workflow needs current public web evidence that is already shaped for LLM or agent use. Strong uses include RAG source discovery, selected-page extraction for evidence review, public documentation ingestion, company and product research, competitive monitoring, and recurring content-change tracking.

The four endpoints fit together naturally: Search finds candidate sources, Map scopes first-party sites, Extract cleans selected URLs, and Crawl performs bounded multi-page ingest when the caller wants traversal and extraction together.

## Personal Use Opportunities

Individuals can use Tavily to prepare for meetings, compare products, monitor current events, research companies, build a personal searchable archive of public docs, or extract clean reading notes from selected pages. The most useful fields are source URLs, snippets or raw content, relevance scores, date/source filters, and per-URL extraction failures.

## Business Use Opportunities

Businesses can use Tavily for sales account research, vendor and competitor monitoring, support knowledge-base ingestion, public policy or terms review, documentation migration planning, and RAG pipelines that need current web context. The outputs enable routing, summarization, enrichment, human review, alerting, and retrieval workflows, but structured firmographics, legal judgments, and final classifications require downstream processing.

## Endpoint Group Summaries

### Web Search And Source Discovery

`POST /tavily/search` accepts a query plus controls for search depth, topic, time range, domains, country, answer generation, raw content, images, and usage. It returns ranked source results with URLs, titles, content snippets or chunks, relevance scores, optional raw content, and optional answer text. See [api-uses/web-search-and-source-discovery.md](api-uses/web-search-and-source-discovery.md).

### Known URL Content Extraction

`POST /tavily/extract` accepts one or more URLs and returns clean extracted content, optional images/favicons, and per-URL failures. It is best after a workflow already knows which URLs matter. See [api-uses/known-url-content-extraction.md](api-uses/known-url-content-extraction.md).

### Site Structure Mapping

`POST /tavily/map` discovers URLs from a root site without extracting page bodies. It is a low-content preflight step for migration, crawl planning, scope control, and URL inventory. See [api-uses/site-structure-mapping.md](api-uses/site-structure-mapping.md).

### Site Crawling And Content Ingest

`POST /tavily/crawl` combines traversal and extraction, returning page URLs and raw content from a bounded site crawl. It is best for public documentation ingestion, first-party company research, content audit, and recurring archive workflows. See [api-uses/site-crawling-and-content-ingest.md](api-uses/site-crawling-and-content-ingest.md).

## Field And Data Themes

Important input themes are query intent, URL scope, depth, breadth, limits, date or country filters, domain and path filters, content richness, output format, and usage reporting. Important output themes are source URLs, extracted content, relevance scores, generated answers, image/favicons, response time, usage credits, request IDs, and extraction failures.
