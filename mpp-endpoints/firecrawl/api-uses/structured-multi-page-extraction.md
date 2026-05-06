# Firecrawl: Structured Multi-Page Extraction API Uses

## What This Endpoint Group Does

This group submits structured extraction jobs. `POST /v1/extract` accepts one or more URL globs, a natural-language `prompt`, an optional JSON `schema`, optional web search, sitemap/subdomain controls, source visibility, scrape options, and invalid URL handling. The direct response returns a job `id` and any invalid URLs when configured.

The endpoint is valuable when raw markdown is not enough and the caller needs normalized fields from one or more pages: product attributes, pricing terms, contact details, policy clauses, event facts, public company facts, or documentation tables. The major gap is result access: the five-endpoint MPP inventory includes job submission but not the status/result endpoint that would return completed structured data.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/extract` | Extract structured data from pages using LLMs. | `urls`, `prompt`, `schema`, `enableWebSearch`, `ignoreSitemap`, `includeSubdomains`, `showSources`, `scrapeOptions`, `ignoreInvalidURLs` | `success`, extraction job `id`, `invalidURLs`, error bodies for 400/500 |

## Field Notes

### Inputs

`urls` is required and can contain URL globs. `prompt` guides what to extract, while `schema` defines the JSON shape when the caller needs consistent fields. `enableWebSearch` can broaden discovery beyond the supplied URLs, and `showSources` asks the provider to include sources in the completed extraction response. `ignoreSitemap`, `includeSubdomains`, and `ignoreInvalidURLs` control scan scope and error handling. `scrapeOptions` controls page capture behavior before extraction, including content filters, cache freshness, PDF parsing, actions, proxy mode, location/language, and change-tracking options.

### Outputs

The submit endpoint returns `success`, `id`, and possibly `invalidURLs`. It does not return completed extracted fields in this inventory. A complete workflow needs an approved result retrieval mechanism outside the five listed MPP endpoints, such as an upstream status endpoint, provider webhook behavior, or another documented wrapper path.

### Important Constraints Or Gaps

Because this endpoint starts an async job, it is not enough by itself for a complete structured extraction workflow. The completed result schema is unknown from the submit response, even though the request can include a JSON Schema. Direct Firecrawl billing lists JSON extraction and page processing costs; the MPP wrapper lists a submit payment amount, but final cost behavior is not documented in local artifacts. No extraction jobs were submitted for this research.

## Use Cases

### Competitor Product And Pricing Extraction

A person comparing software plans or marketplace listings can provide pricing-page URLs and a schema for fields such as plan name, monthly price, annual price, included usage, limits, trial terms, and refund language. A business can run the same extraction across competitor pages or reseller catalogs and feed normalized results into pricing review.

The key inputs are `urls`, `prompt`, `schema`, `showSources`, `includeSubdomains`, and `scrapeOptions.maxAge`. The valuable output would be the completed structured data plus source references, but the MPP bundle only exposes the submit `id`. A production workflow needs documented result retrieval before it can make pricing decisions.

### Lead And Vendor Profile Normalization

A personal consultant can extract a prospect's services, target customers, locations, and contact-page links from a company website. A business can normalize vendor or lead websites into CRM-ready fields such as industry, product categories, geographic coverage, compliance signals, support channels, and integration partners.

The endpoint is suited to this because it accepts URL globs and a caller-defined `schema`, rather than forcing a fixed enrichment model. `ignoreInvalidURLs` prevents one bad URL from blocking the entire job when enabled, and `showSources` can help reviewers trace extracted claims. The gap remains that final extraction fields are not visible in the submit response.

### Public Policy, Terms, And Compliance Clause Extraction

A person can collect cancellation, warranty, privacy, or eligibility clauses from several public pages before making a consumer decision. A legal, procurement, or compliance team can define a schema for data retention terms, SLA promises, subprocessor references, security claims, refund windows, or jurisdiction language across vendor documents.

This workflow benefits from `schema` and `prompt` because it asks for specific clauses rather than full documents. `scrapeOptions.parsePDF`, `includeTags`, `excludeTags`, and `maxAge` can tune source capture. Teams should keep human review in the loop because extracted legal/compliance fields are derived from public pages and may be incomplete, stale, or ambiguous.

### Product Catalog And Event Listing Normalization

A person planning a purchase, trip, or event calendar can extract dates, venues, prices, availability, links, and restrictions from public listing pages. A business can normalize product catalog pages, class schedules, event listings, or real-estate pages into structured records for comparison or internal operations.

The useful request fields are `urls`, `schema`, `prompt`, `includeSubdomains`, `ignoreSitemap`, `scrapeOptions.formats`, and `scrapeOptions.location`. The value comes from turning heterogeneous pages into consistent records that can be sorted, filtered, deduplicated, or reviewed. Freshness-sensitive uses should set cache behavior deliberately and avoid assuming all dynamic inventory is captured.

### Documentation And Table Extraction For Migration

A developer can extract endpoints, parameters, configuration options, or compatibility tables from public docs into JSON for a personal tool. A business migrating docs or building internal tooling can convert public documentation sections into structured records before validating them against source pages.

The endpoint supports this better than plain scrape when the desired output is a normalized table rather than prose. The schema can encode fields such as name, type, default, description, deprecation status, and source URL. Result retrieval and validation against source snippets remain required because the submit response only provides a job id.
