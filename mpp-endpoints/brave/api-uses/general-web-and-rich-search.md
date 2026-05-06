# Brave Search: General Web And Rich Search API Uses

## What This Endpoint Group Does

This group covers the broad Brave Web Search endpoint exposed through MPP. It accepts a search query plus pagination, locale, freshness, safety, result-type, and summary controls, then returns ranked web results and optional mixed verticals such as news, videos, discussions, FAQ, infoboxes, locations, and rich callback hints.

Its value is breadth and structure. A caller gets titles, URLs, snippets, source hostnames, timestamps, thumbnails, schema.org-style enrichments, and mixed-result ordering in one response, which is useful when an application needs source discovery or a search UI rather than full extracted page content.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/brave/web-search` | Search the web and return ranked results plus optional mixed verticals. | `q`, `count`, `offset`, `country`, `search_lang`, `freshness`, `safesearch`, `result_filter`, `summary` | `query`, `web.results[]`, `mixed`, optional `news`, `videos`, `discussions`, `faq`, `infobox`, `locations`, `rich.hint` |

## Field Notes

### Inputs

`q` is the core field and supports normal web-search operators upstream, such as exact phrases, exclusions, `site:`, and file type filters. `freshness` lets callers restrict results to a recent period or a custom date range. `result_filter` lets a workflow narrow to specific verticals such as `web`, `news`, `videos`, `discussions`, `faq`, or `infobox`. Locale and safety fields help tune the result set for a user or market.

The MPP wrapper OpenAPI lists a narrower field set than the upstream Brave docs. Upstream-only fields such as `goggles`, `extra_snippets`, `operators`, `include_fetch_metadata`, `enable_rich_callback`, and location headers are valuable but not confirmed as wrapper pass-through fields.

### Outputs

The web response can include `web.results[]` with title, URL, description, language, hostname, thumbnail, publisher profile, page age, extra snippets, structured schemas, and typed enrichments such as product, recipe, article, rating, FAQ, video, location, organization, and review. `mixed` gives display ordering across result types. `rich.hint.callback_key` can point to a follow-up rich-data workflow upstream, though the MPP wrapper does not list the rich callback endpoint.

### Important Constraints Or Gaps

The wrapper does not document a response schema, so response fields are derived from official Brave docs. Count is capped at 20 upstream and offset is capped at 9. Some results may omit optional timestamps, thumbnails, schemas, or vertical sections. Applications should not assume every query returns every result type.

## Use Cases

### Source Discovery For Research And Writing

A person writing an article, memo, or grant proposal can submit a focused `q` with `freshness` and `country` to find current sources, then use `web.results[].title`, `url`, `description`, `age`, `language`, and `meta_url.hostname` to decide which pages are worth reading. `extra_snippets` and typed fields such as `article` or `faq`, when available, reduce time spent opening irrelevant pages.

A business can use the same fields to build an internal research assistant that gathers candidate sources before a human analyst writes the final work. The assistant can rank by hostname, recency, result type, and structured metadata, then pass URLs to a later extraction or review step. The limitation is that Web Search returns snippets and metadata, not full page text; for LLM-ready context, the LLM Context endpoint is a better second step.

### Competitive And Market Monitoring

A founder, marketer, or product manager can query brand names, product categories, or competitor terms and use `freshness=pd`, `pw`, or `pm` to watch what changed recently. Result hostnames, page ages, snippets, and mixed news/video sections show whether the change is press coverage, a product page, a review, or community discussion.

For a business, this can feed monitoring workflows that classify results by competitor, publisher, content type, and recency. `result_filter` can narrow spend to web or news-like results, while optional search operators can limit to a domain or exclude noisy sources. The workflow should surface missing freshness fields and avoid treating result order as a precise popularity score.

### Search-Backed CRM Or Account Enrichment

A sales or support user can search a company domain, executive name, product line, or error phrase and get a compact view of public pages related to the account. Fields such as `profile`, `organization`, `article`, `schemas`, and `meta_url.hostname` can enrich a CRM record with public context and useful links.

A business can automate pre-call research by retrieving the top results for target accounts, filtering to official domains, recent announcements, product pages, and relevant articles. The returned URL and snippet fields help route accounts to sales, support, or risk review. This does not replace dedicated company-enrichment APIs because it is search-derived and may return noisy or stale public pages.

### Focused Search Experiences With Result-Type Control

A person building a personal search tool can use `result_filter` to create specialized searches: web-only for documentation, discussions-only for troubleshooting, or FAQ/infobox-heavy results for quick lookups. `mixed` can be used to display result sections in Brave's preferred order while still preserving the underlying result arrays.

A business can embed a scoped search experience in an app, knowledge base, or workflow tool. Search operators and, if passed through by the wrapper, Goggles can boost trusted domains and suppress low-quality sources. The important constraint is that the MPP wrapper does not confirm all upstream reranking controls, so production systems should test capabilities through approved paid-call procedures before depending on them.

### Rich Intent Detection Before Specialized Handling

A personal assistant can query practical intents such as weather, stock quotes, currency conversion, or sports and inspect `rich.hint.vertical` to decide whether the query has a structured rich-data path upstream. Even without making a follow-up call, the hint can help route the request to a weather, finance, sports, or normal-search workflow.

A business can use this as a low-friction intent classifier in a larger agent router: if `rich.hint.vertical` is present, the agent can ask for permission to use a specialized data source; otherwise it can continue with regular web results. The MPP wrapper does not expose the upstream rich callback endpoint in the Brave service manifest, so the hint should be treated as routing metadata unless a future approved task verifies callback access.
