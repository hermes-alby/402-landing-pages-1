# Exa: Content Retrieval And Extraction API Uses

## What This Endpoint Group Does

This endpoint group covers Exa's `POST /contents` route. Its job is not web discovery; it turns already-known sources into usable content. A caller supplies `urls` or Exa search-result `ids`, then asks for one or more extraction views: clean markdown `text`, extractive `highlights`, LLM-generated `summary`, structured summaries through `summary.schema`, crawled `subpages`, and `extras.links` or `extras.imageLinks`.

The group is useful when an agent, researcher, or application already has candidate URLs and needs source-grounded material for reading, extraction, indexing, citations, monitoring, or structured records. The important operational detail is that success is mixed-granularity: the request can return HTTP 200 while individual sources fail in `statuses[]`, so clients need to inspect both `results[]` and `statuses[]` before using the content.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/contents` | Retrieve LLM-ready page contents for known URLs or Exa document IDs, optionally including text, highlights, summaries, structured summary fields, subpage crawls, extracted links, image links, per-source status records, and cost data. | Required `urls`; optional `ids`; top-level `text`, `text.maxCharacters`, `text.includeHtmlTags`, `text.verbosity`, `text.includeSections`, `text.excludeSections`, `highlights`, `highlights.query`, `highlights.maxCharacters`, `summary`, `summary.query`, `summary.schema`, `maxAgeHours`, `livecrawlTimeout`, `subpages`, `subpageTarget`, `extras.links`, and `extras.imageLinks`. | `requestId`; `results[].title`; `results[].url`; `results[].id`; `results[].publishedDate`; `results[].author`; `results[].text`; `results[].highlights`; `results[].highlightScores`; `results[].summary`; `results[].subpages`; `results[].extras.links`; `statuses[].id`; `statuses[].status`; `statuses[].error.tag`; `statuses[].error.httpStatusCode`; `costDollars.total`. |

## Field Notes

### Inputs

`urls` is required in the local endpoint record, while `ids` is optional and exists for document IDs obtained from search results. The docs say `urls` and `ids` are effectively interchangeable for content retrieval, but workflows that start with Exa `/search` should preserve the returned `id` and `url` so content fetches can be traced back to the discovery step.

`text`, `highlights`, and `summary` are top-level `/contents` parameters. They are not nested under `contents` as they are when requesting content during `/search`. `text: true` returns clean markdown. The object form controls size and shape with `text.maxCharacters`, `text.includeHtmlTags`, `text.verbosity`, `text.includeSections`, and `text.excludeSections`. `text.verbosity` values are `compact`, `standard`, and `full`; section filters cover `header`, `navigation`, `banner`, `body`, `sidebar`, `footer`, and `metadata`.

`highlights` returns extractive excerpts rather than generated prose. The docs recommend `highlights: true` for the best default and using `highlights.query` only when the workflow needs excerpts focused on a particular question. `highlights.maxCharacters` is the field to cap highlight output; older controls such as `numSentences` and `highlightsPerUrl` are deprecated.

`summary` produces generated summaries. The object form can use `summary.query` to direct the summary and `summary.schema` to request structured JSON-like extraction. That makes `/contents` useful not only for reading a page, but also for turning a set of known pages into typed fields such as company facts, product names, policy dates, pricing clauses, or research findings.

Freshness is controlled by `maxAgeHours`. Omitting it uses cached content when present and livecrawls only as a fallback. Positive values use cache when it is younger than the threshold. `0` always livecrawls and increases latency. `-1` is cache-only and fastest but can miss fresh changes. When using `maxAgeHours`, the docs recommend setting `livecrawlTimeout`, commonly in the 10000 to 15000 ms range.

`subpages` asks Exa to crawl linked pages under the starting source, while `subpageTarget` prioritizes which subpages matter, such as `api`, `pricing`, `terms`, `careers`, or `press`. `extras.links` and `extras.imageLinks` request extracted outbound URLs and image URLs. These fields are quantity knobs, so they can expand response size and cost quickly if used without caps.

### Outputs

`requestId` is the request-level audit handle. Each successful item in `results[]` carries source metadata: `title`, `url`, `id`, `publishedDate`, `author`, and sometimes image or favicon fields from the underlying result schema. Those fields should stay attached to extracted content for citation, deduplication, freshness review, and debugging.

The content outputs depend on requested modes. `results[].text` is full page text when `text` is enabled. `results[].highlights` and `results[].highlightScores` provide short source excerpts and similarity scores when `highlights` is enabled. `results[].summary` contains the generated summary, including structured data when requested with `summary.schema`. `results[].subpages` repeats the result-with-content shape for crawled subpages. `results[].extras.links` returns extracted links; the docs also expose `extras.imageLinks` as an input and response examples show image-related metadata, although the local inventory only lists `extras.links` as a response field.

`statuses[]` is mandatory to inspect in practice. It maps requested `statuses[].id` values to `success` or `error`. Per-URL failures can include `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `CRAWL_LIVECRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, `UNSUPPORTED_URL`, or `CRAWL_UNKNOWN_ERROR`, plus `statuses[].error.httpStatusCode` when available. A robust batch job should retry timeout cases differently from forbidden, unsupported, or not-found cases.

`costDollars.total` is provider-reported request cost. The shared `CostDollars` schema also includes a breakdown shape for operations such as content text, highlight, and summary generation. The MPP wrapper record lists a fixed Tempo MPP amount of `5000` raw 6-decimal units for `/contents`, while Exa's first-party x402 guide prices `/contents` per page and per content type. This artifact records both as source facts and does not assume the wrapper and first-party x402 pricing are identical.

### Important Constraints Or Gaps

- The assigned MPP endpoint is paid. This artifact is based on public docs and local metadata only; it does not call paid endpoints, sign payments, register accounts, buy API keys, or settle x402 payments.
- The local MPP catalog does not expose a wrapper-specific OpenAPI schema, payment headers, runtime limits, or error envelope for `/contents`. The request and response fields are mapped from Exa's official provider docs because the wrapper path matches the provider path.
- `/contents` can return HTTP 200 with per-source failures in `statuses[]`. Treating all 200 responses as full success will silently drop failed URLs.
- Wrapper-specific maximum batch size for `urls` or `ids` was not available from public MPP metadata.
- No live crawl behavior was tested. Latency, freshness, cache hit behavior, and timeout behavior are therefore documented expectations rather than observed wrapper behavior.
- `/contents` does not support streaming. Deprecated or wrong parameters include `useAutoprompt`, `numSentences`, `highlightsPerUrl`, `livecrawl`, `tokensNum`, `stream`, and nested `contents: { text: ... }`.
- Exa's default provider rate limit for `/contents` is 100 QPS. Exa first-party x402 has separate limits of 5 unpaid discovery requests per IP per 60 seconds and 10 paid requests per wallet per second. The MPP wrapper's applied rate limits are not exposed.
- Extracted text may contain copyrighted, paywalled, personal, or otherwise restricted source material. Applications should preserve source URLs, avoid overbroad redistribution, and apply their own compliance policy before storage, sharing, training, or automated decisions.

## Use Cases

### Evidence Pack From A Curated URL List

An individual researcher, attorney, journalist, student, or analyst can start with a small set of already-chosen URLs and use `/contents` to produce an evidence pack. The workflow is to submit `urls`, request `highlights: true` for compact excerpts, add `text.maxCharacters` for fuller inspection on the most important pages, and retain `title`, `url`, `publishedDate`, `author`, and `requestId` with every extracted claim.

This is stronger than generic search snippets because the returned excerpts and text come from the selected sources and can be linked back to their original pages. `statuses[]` matters when a batch includes stale links, PDFs, blocked sources, or pages that time out; a missing result should be marked as unavailable rather than treated as negative evidence. Cost and latency are controlled by keeping batches small, preferring highlights for first-pass review, and using `maxAgeHours` only as fresh as the research question requires.

### RAG Ingestion For Known High-Value Sources

A business knowledge product can use `/contents` as a source ingestion step after another system has selected canonical docs, blog posts, help-center pages, release notes, or policy pages. The application can request `text` with `maxCharacters`, exclude low-value sections such as `navigation`, `footer`, or `sidebar`, and store `results[].id`, `results[].url`, `results[].title`, `publishedDate`, and `author` as chunk metadata.

The returned content enables retrieval-augmented answers with source citations and deduplication across repeated crawls. `maxAgeHours` lets the pipeline balance freshness against latency: cache-only for stable archives, a positive threshold for docs that change occasionally, or `0` for pages whose current state matters. The main limitations are rights and freshness policy. The pipeline should not assume that clean text is licensed for broad redistribution or training, and it should record `statuses[].error.tag` so failed URLs can be retried or removed deliberately.

### Documentation Map And API Reference Extraction

Developer-tool teams and coding agents can use `/contents` to turn a docs entrypoint into a focused reference bundle. A caller can submit the docs home page or a known reference page, set `subpages` to a small number, use `subpageTarget` values such as `api`, `reference`, `guide`, `models`, or `errors`, and request `text.maxCharacters` plus `extras.links` to capture the pages and links worth following next.

The fields make this useful for agent workflows because `results[].subpages` preserves nested page content, `extras.links` exposes the local docs graph, and `statuses[]` reveals broken or blocked pages without losing successful pages. This is not a full site crawler. The actual number of subpages may be limited, subpage selection is best-effort without a target, and high subpage counts can expand cost and response size. Keeping `subpages` in the 5 to 15 range for initial runs is safer than trying to ingest an entire documentation site at once.

### Structured Company And Product Snapshot

A sales, recruiting, investing, or market-intelligence workflow can use `/contents` to convert selected company URLs into structured facts. The caller can combine `subpages` with `subpageTarget` values such as `about`, `pricing`, `customers`, `careers`, `press`, and `blog`, then request `summary` with a `summary.schema` for fields like company name, market, product categories, pricing signals, hiring areas, recent announcements, and source URLs.

This works for personal use too: a job seeker or buyer can summarize a vendor or employer from its own pages before a call. The returned `summary`, `title`, `url`, `publishedDate`, `author`, `subpages`, and extracted links make the output explainable and refreshable. The limitations are important: generated summaries can omit nuance, corporate pages can be promotional or stale, and `SOURCE_NOT_AVAILABLE` or `CRAWL_TIMEOUT` statuses may hide parts of the site. Structured fields should be treated as extracted leads, not verified facts, until reviewed against the underlying `text` or `highlights`.

### Policy, Pricing, And Terms Change Monitoring

A company can track known terms, privacy, pricing, changelog, or service-status URLs by periodically calling `/contents` with `maxAgeHours` tuned to the monitoring cadence. For stable pages, a 24-hour or longer cache threshold may be enough; for critical policy or incident pages, `maxAgeHours: 0` with a defined `livecrawlTimeout` can force live retrieval. `text.includeSections` or `text.excludeSections` can reduce noise from headers and footers, while `highlights.query` can focus on clauses about pricing, data use, retention, termination, uptime, or payment terms.

The output supports redline-style review, alerting, and audit trails when stored with `requestId`, `url`, `publishedDate`, `author`, `costDollars.total`, and crawl status. This workflow is sensitive to compliance and cost. Some pages may block crawling or require authentication, and a livecrawl timeout is not evidence that a page did not change. Teams should keep original source snapshots or hashes outside this endpoint's response, review legal implications before automating decisions, and budget for repeated calls across many monitored URLs.

### Link And Image Asset Discovery From Trusted Pages

Content operations, design, ecommerce, and brand-monitoring teams can use `/contents` when the high-value task is not the article body but the page's connected assets. A caller can provide known landing pages or product pages, request `extras.links` and `extras.imageLinks`, and optionally add limited `text` or `summary` so the extracted links and images are interpreted in context.

The returned links can reveal documentation paths, related products, references, partner pages, downloads, or offsite destinations. Image links and result image metadata can help populate internal review queues or asset inventories. The main caveat is rights and reliability: extracted image URLs are not usage licenses, links can be tracking or navigation noise, and the local response inventory explicitly lists `extras.links` but not a separate `results[].extras.imageLinks` field. Consumers should validate URLs, deduplicate by `results[].url` and extracted link, and avoid assuming every returned asset is reusable.

### Search-To-Read Agent Workflow

An agent that first discovers pages through Exa `/search` can hand the best `results[].id` or `results[].url` values into `/contents` for deeper reading. The workflow is search for candidates, select a small set using titles, domains, snippets, or dates, then call `/contents` with `highlights: true` for the first reading pass. The agent can escalate to `text` or a `summary.schema` only for pages that appear relevant.

This design reduces tokens and cost compared with fetching full text for every search result. It also keeps provenance clear because the same `id` and `url` can connect discovery, extraction, and final citations. The workflow still needs guardrails: stale cached content can be wrong for breaking news, per-URL errors can leave holes in evidence, and first-party x402 pricing charges per page and content type while MPP wrapper pricing is represented separately in local metadata.

### Batch Source Health And Crawlability Audit

Data teams maintaining a URL corpus can use `/contents` as a crawlability audit before relying on those sources in search, RAG, sales intelligence, or research automation. Submit a batch of `urls` or `ids` with a low-cost mode such as `highlights: true` or default text behavior, then classify each requested item by `statuses[].status`, `statuses[].error.tag`, and `statuses[].error.httpStatusCode`.

The returned status tags make remediation concrete. `CRAWL_NOT_FOUND` suggests URL correction or removal, `UNSUPPORTED_URL` suggests scheme filtering, `SOURCE_NOT_AVAILABLE` suggests access or robots limitations, and timeout tags suggest retry scheduling or longer `livecrawlTimeout`. The audit should avoid treating `/contents` as a general permission bypass. Blocked, paywalled, authenticated, or policy-restricted sources may require explicit rights or a different ingestion process.
