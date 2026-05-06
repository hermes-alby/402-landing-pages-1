# Tavily: Site Crawling And Content Ingest API Uses

## What This Endpoint Group Does

This group covers Tavily Crawl through the MPP wrapper. It starts from a root URL, traverses the site, and extracts content from discovered pages in one operation. It is the broadest Tavily MPP endpoint for turning a public website section into a set of page-content records.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/tavily/crawl` | Traverse a website and extract content from discovered pages. | `url`, `instructions`, `chunks_per_source`, `max_depth`, `max_breadth`, `limit`, `select_paths`, `exclude_paths`, `exclude_domains`, `allow_external`, `extract_depth`, `format`, `include_images`, `timeout` | `base_url`, `results[].url`, `results[].raw_content`, `results[].favicon`, `usage`, `response_time`, `request_id` |

## Field Notes

### Inputs

`url` is required. `instructions`, `select_paths`, `select_domains`, `exclude_paths`, and `exclude_domains` focus the crawl. `max_depth`, `max_breadth`, and `limit` bound the traversal. `extract_depth`, `format`, `include_images`, `include_favicon`, and `chunks_per_source` control extracted content shape and richness.

### Outputs

The response contains `base_url` and `results[]` records with at least `url` and `raw_content`, plus optional `favicon`. Provider docs also expose `response_time`, `usage`, and `request_id`. The schema does not include a separate failed-results array for Crawl in the OpenAPI excerpt reviewed, so callers should treat missing pages as an operational concern to track externally.

### Important Constraints Or Gaps

Crawl can become expensive or slow if depth and limits are too broad. Tavily's best-practice docs recommend conservative depth and explicit limits. The MPP wrapper docs list a smaller input set than the provider OpenAPI, so pass-through for newer fields remains unverified.

## Use Cases

### Knowledge Base Creation From Public Docs

A person can crawl a public documentation site with `instructions` such as "find API reference and quickstart pages", returning page URLs and markdown content that can be searched locally or summarized.

A business can build a public-docs ingestion pipeline for RAG, support tooling, or sales engineering. `results[].url` and `raw_content` become the source records, while `select_paths`, `limit`, and `extract_depth` control scope. The pipeline should store crawl time and source snapshots externally because Tavily does not return a per-page timestamp.

### Company Or Product Research From First-Party Sites

A person preparing for an interview, investment review, or purchase can crawl a company site for pricing, product, documentation, changelog, and security pages. `instructions` make the crawl semantic instead of just broad.

A business can automate first-party company research for sales, vendor review, or competitive intelligence. The output supports downstream extraction of product claims, use cases, integrations, pricing language, and compliance statements. The endpoint does not produce structured company profiles directly; classification and field extraction happen after Crawl.

### Content Audit And Policy Review

A person maintaining a site can crawl selected paths to inspect public copy, outdated mentions, or policy pages. `exclude_paths` prevents irrelevant sections from filling the result set.

A compliance, legal, or content team can crawl public terms, privacy, help, or policy pages and route extracted content into review workflows. `request_id`, `base_url`, and `results[].url` help preserve provenance. Human approval remains necessary for legal conclusions.

### Searchable Archive Of Rapidly Changing Sites

A person can periodically crawl a small public site or documentation section to keep a local archive of current content for offline search.

A business can schedule bounded crawls for product docs, release notes, partner portals, or public support sites, then diff extracted `raw_content` over time. `limit`, `max_depth`, and path filters keep the crawl focused enough for recurring use. The workflow should avoid private, authenticated, or paywalled areas and should not use Crawl for anti-bot bypass.
