# Tavily: Known URL Content Extraction API Uses

## What This Endpoint Group Does

This group covers Tavily Extract through the MPP wrapper. It starts from one or more known URLs and returns clean extracted content, with optional query-guided chunking, extraction depth, images, favicons, output format, timeout, usage, and per-URL failure reporting.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/tavily/extract` | Extract clean page content from selected URLs. | `urls`, `query`, `chunks_per_source`, `extract_depth`, `format`, `include_images`, `include_favicon`, `timeout` | `results[].url`, `results[].raw_content`, `results[].images`, `results[].favicon`, `failed_results[].url`, `failed_results[].error`, `usage`, `request_id` |

## Field Notes

### Inputs

`urls` is required and may be a single URL or an array. Wrapper docs say Extract can process up to 20 URLs. `extract_depth=advanced` can improve extraction on complex pages but may increase latency and direct provider credit use. `query` plus `chunks_per_source` narrows returned content to relevant chunks. `format` chooses markdown or plain text in provider docs.

### Outputs

Successful pages appear in `results[]` with `url`, `raw_content`, optional `images`, and optional `favicon`. Failures appear separately in `failed_results[]`, preserving per-URL errors rather than silently dropping pages. `usage`, `response_time`, and `request_id` help diagnose cost and latency.

### Important Constraints Or Gaps

The wrapper docs list only `urls` and `extract_depth`, while the provider OpenAPI includes `query`, `chunks_per_source`, `include_images`, `include_favicon`, `format`, `timeout`, and `include_usage`. This inventory treats the provider schema as the field source but marks pass-through support as an open question.

## Use Cases

### Clean Article And Documentation Ingestion

A person can save a handful of articles, manuals, or documentation pages and extract clean markdown for reading, summarization, or personal notes. `failed_results` makes it clear which URLs need manual handling instead of leaving gaps.

A business can use Extract after a search step to ingest selected public pages into a knowledge base. `raw_content`, `url`, and `favicon` preserve provenance, while `format=markdown` helps downstream chunking. The workflow should store source URLs and extraction timestamps outside Tavily because the endpoint response schema does not include page publish dates.

### Focused Evidence Pulling From Known Sources

A person comparing a policy, product, or technical claim can pass exact URLs and a `query` to retrieve only the relevant chunks. This reduces reading time when pages are long.

A legal, compliance, or analyst team can use query-guided extraction to pull relevant sections from public terms pages, help docs, or policy updates. The value comes from `query`, `chunks_per_source`, and `raw_content`: the workflow can attach source excerpts to a review ticket. Human review remains necessary for binding legal or compliance decisions.

### Lead, Vendor, Or Company Page Enrichment

A person preparing for a call can extract the public pages they already selected, such as a company homepage, pricing page, or docs page. The extracted `raw_content` can then be summarized into meeting notes.

A business can enrich CRM or vendor-review records from known public URLs. Unlike Search, Extract does not decide which source is relevant; it works best after a trusted URL list exists. It can populate fields such as product description, pricing signals, support terms, or integration details through downstream parsing, but those structured fields are not directly returned by Tavily.

### Batch Content Quality Checks

A person maintaining a personal website can extract selected pages to see how public content reads when cleaned for an LLM. `failed_results` identifies pages that are hard to process.

A content or docs team can batch extract important public pages and check whether markdown output contains the expected headings, tables, and body copy. `extract_depth=advanced` is useful for pages with tables or embedded content, but cost and latency should be controlled with small batches and timeouts.
