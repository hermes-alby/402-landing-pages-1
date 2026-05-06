# Perplexity: Raw Web Search API Uses

## What This Endpoint Group Does

This group returns ranked web search results rather than a generated answer. It is useful when an application needs source URLs, titles, snippets, publication dates, and update dates that can be stored, ranked, filtered, or passed to another system. It supports one or more queries plus geographic, language, domain, recency, and date controls.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/perplexity/search` | Retrieve ranked web page results and extracted snippets. | `query`, `max_results`, `max_tokens_per_page`, `country`, `search_domain_filter`, `search_language_filter`, `search_recency_filter`, date filters | `id`, `results[].title`, `results[].url`, `results[].snippet`, `results[].date`, `results[].last_updated`, `server_time` |

## Field Notes

### Inputs

`query` is required and can be a string or an array of strings. `max_results` controls result count, with the official provider range of 1 to 20 and default 10. `country` localizes results by ISO 3166-1 alpha-2 country code. `search_domain_filter`, `search_language_filter`, `search_recency_filter`, `search_after_date_filter`, and `search_before_date_filter` constrain source scope and freshness.

Official provider docs also list `max_tokens`, `max_tokens_per_page`, `last_updated_after_filter`, and `last_updated_before_filter`. Those fields are not listed in the inspected MPP docs, so wrapper support is uncertain.

### Outputs

The result set contains `results[]` with `title`, `url`, `snippet`, optional `date`, and optional `last_updated`. The response also has an `id` and may include `server_time`. These fields are directly usable for source collection, monitoring, deduplication, and downstream retrieval.

### Important Constraints Or Gaps

The endpoint does not synthesize a final answer; it returns source candidates. It is best when the downstream workflow can rank, inspect, summarize, or archive results. The MPP OpenAPI does not define a 200 response schema, so response fields are derived from official Perplexity OpenAPI. No paid call was made to confirm whether all official optional fields pass through the wrapper.

## Use Cases

### Fresh Source Discovery For Research Queues

A person researching a topic can submit one or more queries and receive a manageable set of `title`, `url`, `snippet`, `date`, and `last_updated` fields. Date and recency filters help avoid stale sources, and `max_results` keeps the queue small enough to review.

A business can use this as the first stage in a research pipeline: discover candidate sources, store the URLs and snippets, and then hand selected pages to a summarizer, analyst, or crawler. This is stronger than asking for a single answer when the business needs provenance, source diversity, or manual review before synthesis.

### Public Change Monitoring

An individual can monitor a product, policy, event, or local issue by running the same query with `search_recency_filter` or date filters and comparing returned URLs over time. `last_updated` helps distinguish newly updated pages from older pages that still rank well.

For businesses, this supports lightweight monitoring of competitors, vendors, regulatory pages, documentation, and market news. The workflow can trigger review when new URLs appear, when official domains publish updates, or when snippets mention important terms. It should not be used as the only alerting source for critical obligations because search coverage and page update metadata can vary.

### Domain-Restricted Documentation Lookup

A person troubleshooting a product can restrict `search_domain_filter` to official docs or trusted forums, reducing noise from stale copies and SEO pages. `snippet` gives quick context before opening the page.

A company can use this inside support tooling to retrieve candidate documentation pages for an agent or employee before drafting a response. The endpoint provides source candidates without generating unsupported claims. If the workflow needs a final answer, it can pass selected URLs to a separate answer-generation step.

### Localized Market And Policy Search

For personal decisions such as travel, housing, shopping, or civic research, `country` and `search_language_filter` can bias results toward the right region and language. `date` and `last_updated` help users decide whether the result is still relevant.

Businesses can localize market scans by country: compare regional policy updates, public procurement pages, product launches, or news coverage. The endpoint provides raw evidence that analysts can compare across regions. The limitation is that `country` is a broad country-level control; city-level targeting is not documented for this Search endpoint.

### Lead And Account Research Source Collection

A person preparing for a meeting can search a company or person topic and collect current public URLs, titles, and snippets before reading deeper. Domain filters can focus on official sites, news, or industry publications.

Sales, customer success, and recruiting teams can automate source collection before outreach: recent company announcements, hiring changes, product launches, or funding mentions. The endpoint does not return structured company fields directly, so enrichment workflows need downstream extraction or a separate enrichment API.

### Evaluation Sets For Search Or RAG Systems

Developers can use raw results to build benchmark datasets: query, returned URL, snippet, date, and rank. The `id` field can tie a result set to a run.

A business building internal search or RAG can periodically sample Perplexity search outputs to compare coverage against its own retriever. `max_tokens_per_page` from the official schema may help control extracted content size if supported by the MPP wrapper. The main caveat is that search rankings are dynamic, so stored snapshots should include retrieval time and query parameters.
