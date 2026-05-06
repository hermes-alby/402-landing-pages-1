# Tavily: Web Search And Source Discovery API Uses

## What This Endpoint Group Does

This group covers Tavily Search through the MPP wrapper. It accepts a natural-language query plus ranking, freshness, domain, country, content, and answer-generation controls, then returns ranked web results with URLs, titles, snippets or chunks, relevance scores, optional raw page content, optional images, optional answer text, response timing, usage, and a request ID.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/tavily/search` | Find ranked public web sources and optional answer/content for a query. | `query`, `search_depth`, `max_results`, `topic`, `time_range`, `start_date`, `end_date`, `include_answer`, `include_raw_content`, `include_domains`, `exclude_domains`, `country` | `answer`, `results[].url`, `results[].title`, `results[].content`, `results[].score`, `results[].raw_content`, `images`, `usage`, `request_id` |

## Field Notes

### Inputs

`query` is the only required field. `search_depth` controls latency and relevance; provider OpenAPI currently lists `advanced`, `basic`, `fast`, and `ultra-fast`, while the MPP wrapper docs mention `basic` and `advanced`. `topic`, `time_range`, `start_date`, `end_date`, and `country` are useful for freshness and geographic relevance. `include_domains`, `exclude_domains`, and `exact_match` help constrain source selection. `include_answer`, `include_raw_content`, `include_images`, `include_image_descriptions`, `include_favicon`, and `chunks_per_source` control payload richness.

### Outputs

The central output is `results[]`: each result can contain `title`, `url`, `content`, `score`, `raw_content`, `favicon`, and `images`. `answer` can provide a compact generated answer when requested, but cited source URLs and content remain the more auditable output. `usage.credits`, `response_time`, and `request_id` support cost tracking, latency monitoring, and support/debug workflows.

### Important Constraints Or Gaps

The MPP wrapper schema is narrower than the provider OpenAPI. It documents `days` and country-code examples, while the provider OpenAPI documents `time_range`, `start_date`, `end_date`, and country names. Paid calls were not made, so exact wrapper pass-through behavior is unverified.

## Use Cases

### Current Event And News Monitoring

A person can track a product launch, local policy change, sports injury, or travel disruption by using `topic=news`, `time_range`, `max_results`, and `include_domains` for trusted sources. The returned `results[].url`, `title`, `content`, and `score` let them skim what changed, open the most relevant sources, and decide whether to act.

A business can route news-monitoring alerts into sales, comms, or risk workflows. For example, a customer success team can monitor key accounts, competitors, or vendors, store result URLs and snippets, and trigger review only when highly relevant fresh results appear. The main limitation is source freshness and the need to validate important decisions against the underlying URLs.

### RAG Source Discovery Before Answer Generation

A person building a personal assistant can use Search to retrieve high-scoring context for questions that require current web knowledge. `include_raw_content` and `chunks_per_source` can return enough source text to ground a downstream answer without separately extracting every page.

A business can use this as the first step in an enterprise RAG pipeline: query expansion happens outside Tavily, Search finds candidate sources, and internal ranking or policy filters decide which `results[].url` and `raw_content` go into a vector store or answer prompt. The workflow should retain `request_id`, source URLs, and snippets for auditability.

### Lead And Account Enrichment

A person preparing for a meeting can search a company name plus product, funding, pricing, or executive terms, then use `include_domains` or `exclude_domains` to prioritize the company website, news, and industry sources. The returned URLs and snippets help identify recent events and talking points.

A sales or research team can enrich inbound leads by querying company domains and key fields, then routing records based on source evidence: recent funding, hiring, new markets, or product changes. This endpoint does not return structured firmographics by itself; any company-size, industry, or intent classification requires downstream extraction or modeling.

### Competitive And Market Scanning

A person can compare products by searching narrowly scoped queries and using `include_domains` or `exclude_domains` to avoid low-quality sources. `score`, snippets, and optional answer text help build a shortlist of pages worth deeper reading.

A product or strategy team can schedule recurring searches for competitor launches, pricing changes, documentation updates, or review trends. `time_range`, `topic`, and source filters make the scan specific enough to avoid a generic dashboard. Decisions enabled include whether to update battlecards, investigate a feature gap, or brief sales and support.

### Localized Research

A person researching services, regulations, or events in a specific country can use `country` and date filters to bias toward local results. This is useful when global search results would otherwise bury local sources.

A business operating across regions can localize market or policy research by country, then compare returned sources by region. The limitation is that `country` is documented by the provider as available only for `topic=general`, and the MPP wrapper's exact country-value handling is untested.
