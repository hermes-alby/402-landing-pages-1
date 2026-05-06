# Parallel: Page Extraction And Content Retrieval API Uses

## What This Endpoint Group Does

This group covers `POST /api/extract`, the MPP wrapper for Parallel Extract. It retrieves relevant text from known public URLs and can focus extraction with an optional objective. It is the right follow-up after Search has identified promising URLs, or when another system already has a URL list.

The practical value is turning web pages into LLM-ready content with per-URL success and error reporting. It does not discover new URLs by itself.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/extract` | Extract relevant page content from public URLs. | `urls`, optional `objective`, optional `search_queries`, optional `session_id`, `client_model`, provider advanced settings if passed through. | `extract_id`, `results[].url`, `results[].title`, `results[].excerpts`, `results[].full_content`, `errors[].url`, `errors[].error_type`, `errors[].http_status_code`, `warnings`, `usage`, `session_id`. |

## Field Notes

### Inputs

`urls` is required and the provider OpenAPI describes up to 20 URLs per request. `objective` and `search_queries` focus excerpts on the user's goal, which is useful when a page is long and only some sections matter. `session_id` can tie extraction to prior search context in direct provider docs; MPP passthrough should be verified before depending on it.

### Outputs

Successful results include the requested `url`, a `title`, `excerpts`, and potentially `full_content` when enabled. The `errors` array is important because partial failures are expected in web extraction. `errors[].http_status_code` and `errors[].error_type` help downstream systems decide whether to retry, replace the source, or mark it unavailable.

### Important Constraints Or Gaps

The MPP gateway charges `$0.01/url`, with a minimum `$0.01`. The provider's direct API charges per 1,000 URLs, so the wrapper is mainly valuable for no-account, per-call access rather than high-volume cost optimization.

The official provider OpenAPI has advanced extract settings for fetch, excerpt, and full-content behavior, but the MPP gateway does not publish a separate OpenAPI spec proving all fields pass through. Treat advanced extraction behavior as uncertain unless confirmed by allowed tests.

## Use Cases

### Turn Search Results Into Reviewable Evidence

A person researching a purchase, job opportunity, health topic, or legal issue can first search for relevant pages and then extract the strongest URLs into clean excerpts. `results[].excerpts`, `results[].title`, and `errors[]` make it clear what content was actually retrieved and which URLs failed.

A business can use the same pattern for analyst memos, content QA, or procurement research. Search provides candidates, Extract turns selected pages into reviewable text, and the workflow can reject sources with extraction errors. The limitation is that extracted content still needs source verification for high-stakes use.

### Vendor And Competitor Page Change Review

A person can extract product pages, pricing pages, docs pages, or terms pages before comparing options. The `objective` field can focus on prices, refund terms, limits, or supported features instead of collecting irrelevant page sections.

Businesses can feed known competitor or vendor URLs into Extract during review cycles. The returned `title`, `excerpts`, `full_content` if enabled, and per-URL errors can populate internal notes or diff workflows. This endpoint does not schedule monitoring; it supports an on-demand snapshot, so teams need an external scheduler or Parallel's direct Monitor API for continuous tracking.

### Due Diligence Source Normalization

An individual investor or job seeker can extract pages such as press releases, customer case studies, security reports, funding announcements, or leadership pages into consistent text for comparison. The objective can focus the extraction on claims that matter, such as revenue, adoption, partnerships, or risk disclosures.

Businesses can normalize source material before a human or model reviews it. For example, an M&A researcher can extract public pages across several target companies and ask an internal model to compare claims. The endpoint does not provide ground-truth validation; it only retrieves content from the supplied URLs, so teams must preserve source URLs and timestamps externally.

### Content Intake For RAG Or Knowledge Bases

A person can use Extract to collect clean page excerpts before adding them to a personal knowledge base. The value fields are `url`, `title`, `excerpts`, and potentially `full_content`.

Businesses can use the endpoint as an intake step for retrieval-augmented generation pipelines, especially when the URL list is curated and small. Per-URL errors help avoid silently indexing empty or failed pages. Compliance review is important: provider terms restrict certain caching, resale, competitive, and data-selling uses, and personal data processing may require proper notices and agreements.

### Incident And Support Briefing

A person troubleshooting a service issue can extract status pages, docs pages, and support articles into one compact evidence set. The objective can focus on outage details, remediation steps, or impacted products.

Support and operations teams can use Extract to build incident briefs from known URLs before escalating internally. `errors[].http_status_code` is useful because failed extraction itself may indicate a page is unavailable or blocked. The workflow should not treat missing content as proof that no incident exists.
