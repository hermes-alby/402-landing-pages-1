# Firecrawl: Site Discovery And Crawling API Uses

## What This Endpoint Group Does

This group handles site-scale discovery and crawl submission. `POST /v1/map` returns a site's URL set without scraping page content. `POST /v1/crawl` submits a bounded crawl job that can follow links, apply include/exclude rules, choose page scrape formats, send webhooks, and return a crawl job id.

The group is useful when the user does not know every URL in advance. Map is a planning and scoping step; crawl is a heavier acquisition step. Together they support workflows such as deciding which site sections to capture, building a docs or website index, monitoring content coverage, and preparing a crawl budget before spending more.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/map` | Discover URLs on a website. | `url`, `search`, `ignoreSitemap`, `sitemapOnly`, `includeSubdomains`, `limit`, `timeout`, `location` | `success`, `links`, error bodies for 402/429/500 |
| POST | `/v1/crawl` | Start a multi-page crawl job. | `url`, `includePaths`, `excludePaths`, `regexOnFullURL`, `maxDepth`, `maxDiscoveryDepth`, `ignoreSitemap`, `ignoreQueryParameters`, `limit`, `crawlEntireDomain`, `allowExternalLinks`, `allowSubdomains`, `delay`, `maxConcurrency`, `webhook`, `scrapeOptions`, `zeroDataRetention` | `success`, crawl `id`, `url`, error bodies for 402/429/500 |

## Field Notes

### Inputs

Both endpoints require a starting `url`. Map adds `search` for relevance ordering, sitemap controls, `includeSubdomains`, `limit`, and location settings. Crawl has more controls: `includePaths` and `excludePaths` define the page set; `maxDepth`, `maxDiscoveryDepth`, `limit`, `crawlEntireDomain`, `allowExternalLinks`, and `allowSubdomains` define scope; `delay` and `maxConcurrency` control load; `webhook.url`, `webhook.headers`, `webhook.metadata`, and `webhook.events` define event delivery; `scrapeOptions` chooses content extraction behavior for each crawled page.

### Outputs

Map returns `success` and `links`. The v1 inventory models `links` as an array of strings, while newer docs snapshots show richer link objects, so this artifact uses the inventory shape. Crawl returns `success`, an async job `id`, and the submitted `url`. The five-endpoint MPP bundle does not include crawl status, crawl errors, or crawl result retrieval endpoints, so result consumption depends on upstream webhooks or endpoints outside this inventory.

### Important Constraints Or Gaps

Direct Firecrawl billing says crawl is charged per processed page and map per call; crawl may require enough credits for the requested `limit`, and the default crawl limit is large. Upstream docs also describe concurrency queues and rate limits. The MPP wrapper has listed payment amounts, but this bundle does not document how upstream per-page billing maps to wrapper payment. No map or crawl jobs were submitted during research.

## Use Cases

### Crawl Budget Planning Before Site Ingestion

A person building a private knowledge base for a documentation site can call map to see whether a site has 30, 3,000, or 30,000 URLs before deciding what to capture. A business can use map to estimate crawl size, identify sitemap coverage, and build `includePaths`, `excludePaths`, and `limit` values before submitting a crawl.

The key fields are `map.links`, `map.limit`, `map.search`, `map.sitemapOnly`, and crawl scoping fields such as `includePaths`, `excludePaths`, `maxDiscoveryDepth`, and `limit`. This makes the workflow valuable because it reduces accidental high-volume crawls and focuses paid work on the sections that matter.

### Documentation Or Help Center Knowledge Base Ingestion

A personal agent can map a tool's docs site, select pages about a specific feature, and submit a crawl with `scrapeOptions.formats` set to markdown. A business can use the same pattern to keep support content, developer docs, policy manuals, or public API references available for RAG and internal assistants.

The crawl `id` is the handoff point, while `webhook.events` can be used for page/completed/failed event delivery when supported. The MPP gap matters here: this bundle does not expose the status/result endpoints, so an implementation needs an approved way to receive crawl pages or query upstream status before relying on the job for full ingestion.

### SEO And Content Coverage Audits

A person running a small site can map URLs and search within them for sections such as `blog`, `pricing`, or `docs`. A business SEO team can compare `map.links` against expected sections, detect missing sitemap pages, and submit crawls for selected page families to inspect metadata and content through crawl `scrapeOptions`.

The valuable fields are `search`, `sitemapOnly`, `includeSubdomains`, `ignoreQueryParameters`, `includePaths`, `excludePaths`, and `scrapeOptions.formats`. The workflow supports decisions such as which sections need redirects, which pages should be indexed, and which content should be refreshed. It should not be framed as a full SEO platform unless the caller also retrieves crawl results and analyzes page-level metadata.

### Competitor Site Structure Monitoring

A founder, investor, or product manager can map a competitor site periodically to see whether new product, pricing, docs, or careers sections appear. A business can compare `links` over time, then submit targeted crawls only for new or high-value sections.

Map is cheaper and lighter than scraping every page because it returns URLs without page content. The crawl endpoint can then apply `includePaths` and `limit` to retrieve only relevant sections. Freshness and cache behavior should be documented in the calling system because the MPP artifacts do not prove how sitemap cache state is shared for wrapper users.

### Controlled Crawling For Compliance And Site Courtesy

A business that crawls partner or customer websites can use `delay`, `maxConcurrency`, `limit`, `allowExternalLinks`, `allowSubdomains`, and `zeroDataRetention` to constrain behavior. A personal user can avoid accidentally leaving a target domain or crawling an entire site by keeping `allowExternalLinks` false and setting explicit path filters.

This use case is valuable because the input fields are operational guardrails, not just data selectors. They can prevent unbounded jobs, reduce target-site load, and make the crawl intent reviewable. The caller still needs to respect target-site terms, robots rules, privacy obligations, and the limitations of the MPP wrapper.
