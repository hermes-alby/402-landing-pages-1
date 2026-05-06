# Tavily: Site Structure Mapping API Uses

## What This Endpoint Group Does

This group covers Tavily Map through the MPP wrapper. It discovers URLs starting from a root site and returns a URL list without extracting full page content. It is useful for scoping, inventory, crawl planning, and deciding which pages deserve extraction.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/tavily/map` | Discover URLs on a website without extracting content. | `url`, `instructions`, `max_depth`, `max_breadth`, `limit`, `select_paths`, `select_domains`, `exclude_paths`, `exclude_domains`, `allow_external`, `timeout` | `base_url`, `results[]`, `usage`, `response_time`, `request_id` |

## Field Notes

### Inputs

`url` is required. `max_depth`, `max_breadth`, and `limit` control traversal scope and cost exposure. `instructions` can focus URL discovery semantically. Provider OpenAPI also supports regex path and domain selectors/exclusions, external-link behavior, timeout, and usage reporting.

### Outputs

`base_url` records the mapped root and `results[]` is a list of discovered URLs. The endpoint does not return page body text, titles, or structured page metadata in the documented provider schema. `usage`, `response_time`, and `request_id` are optional operational fields.

### Important Constraints Or Gaps

Map is not content extraction. Any workflow that needs page text must pass selected URLs to Extract or use Crawl. The wrapper docs list the basic controls but do not mention provider regex filters, `allow_external`, `timeout`, or `include_usage`.

## Use Cases

### Website Inventory Before Migration Or Redesign

A person moving a personal site can map the old domain to discover pages they might forget: blog posts, docs, landing pages, and support pages. `limit` and `max_depth` keep the scan bounded.

A business planning a docs migration, SEO cleanup, or support-site redesign can use Map to create a URL inventory before deciding what to archive, redirect, or extract. `select_paths` and `exclude_paths` help focus on `/docs`, `/blog`, or `/help` while avoiding account, admin, or irrelevant sections.

### Crawl Cost Planning

A person can map a site first to estimate how many URLs exist before paying for extraction or a deeper crawl. If the result set is too broad, they can refine with instructions or path filters.

A business can use Map as a preflight step in a content-ingestion pipeline. The URL count, path distribution, and selected domains inform crawl budgets, review queues, and whether extraction should happen page by page or through Crawl. This matters because Crawl and Extract have dynamic cost hints that scale with pages or URLs.

### Source Selection For Research Agents

A person researching a company, product, or project can map the official site and select high-value URLs, such as docs, pricing, changelog, or security pages, before extracting content.

A business research agent can use Map to discover authoritative first-party pages, then combine those URLs with Search results from third-party sources. The URL list supports a more transparent evidence workflow than blind crawling because reviewers can see which pages are candidates before extraction.

### Public Documentation Coverage Checks

A person maintaining open-source docs can map the docs domain to check whether expected sections are linked and discover orphan-adjacent URLs.

A developer-relations or documentation team can periodically map docs, SDK, and changelog paths to detect missing, renamed, or unexpectedly exposed pages. Map does not confirm page content quality, but it provides a lightweight URL-level coverage signal before deeper extraction.
