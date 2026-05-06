# Parallel API Uses

## Service Summary

Parallel provides web intelligence APIs for search, extraction, and multi-hop research. The cataloged MPP service at `https://parallelmpp.dev` exposes three paid first-party wrapper endpoints: Search, Extract, and Task. It is most valuable when an agent or workflow needs small, no-account, pay-per-request access to current public web evidence.

The wrapper is not a full replacement for the direct Parallel API. Direct provider docs include broader products and more knobs, while the MPP catalog contains only three paid POST endpoints plus free support endpoints for discovery, task polling, wallet balance, and x402 status.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Web Search And Source Discovery | 1 | Find relevant public sources and evidence snippets for a research goal. | [api-uses/web-search-and-source-discovery.md](api-uses/web-search-and-source-discovery.md) |
| Page Extraction And Content Retrieval | 1 | Retrieve focused text from known URLs and surface per-URL extraction errors. | [api-uses/page-extraction-and-content-retrieval.md](api-uses/page-extraction-and-content-retrieval.md) |
| Async Deep Research | 1 | Launch a paid multi-hop research task, save a run ID, and poll for the final result. | [api-uses/async-deep-research.md](api-uses/async-deep-research.md) |

## Highest-Value Uses

- Evidence-first research pipelines: Search for candidate sources, Extract the best pages, then optionally launch a Task for synthesis.
- Market, vendor, and competitor research: collect current public signals before procurement, product, sales, or strategy decisions.
- Agentic web intelligence: let an agent pay per request for search, extraction, or deep research without direct Parallel API-key setup.
- Analyst queue automation: launch async research jobs, track run IDs, and route completed outputs for human review.
- Source-backed content and memo drafting: force workflows to gather URLs and excerpts before generating summaries.

## Personal Use Opportunities

Parallel MPP can help individuals compare vendors, research employers, collect evidence for a personal decision, summarize known pages, or request a deeper brief on a current topic. The best personal pattern is small and bounded: run one search, extract a handful of high-quality URLs, and use Task only when the question requires synthesis across multiple sources.

## Business Use Opportunities

Businesses can use the endpoints for lead and account research, procurement review, competitive tracking, market scans, incident briefing, and analyst enablement. The fields that matter are source URLs, titles, publish dates, excerpts, per-URL extraction errors, task run IDs, task status, and final research output. These fields make it possible to keep a traceable research trail rather than only storing an opaque answer.

## Endpoint Group Summaries

### Web Search And Source Discovery

`POST /api/search` returns ranked URLs and excerpts for a natural-language query or provider-style objective. It is most useful for source discovery, quick market signal triage, competitive watch, and citation pre-screening. Details: [api-uses/web-search-and-source-discovery.md](api-uses/web-search-and-source-discovery.md).

### Page Extraction And Content Retrieval

`POST /api/extract` turns known URLs into focused page excerpts or content and reports per-URL failures. It is the natural follow-up to Search and supports evidence normalization, vendor page review, RAG intake, and incident briefing. Details: [api-uses/page-extraction-and-content-retrieval.md](api-uses/page-extraction-and-content-retrieval.md).

### Async Deep Research

`POST /api/task` launches longer multi-hop research or enrichment. The gateway documents `pro` and `ultra` wrapper prices and a persistent `run_id` for free polling. It is best for briefs, structured enrichment, research queues, and questions that require synthesis rather than immediate snippets. Details: [api-uses/async-deep-research.md](api-uses/async-deep-research.md).

## Field And Data Themes

The service centers on public web content fields: query/objective text, URLs, titles, publish dates, excerpts, extracted content, run IDs, task statuses, timestamps, warnings, usage, and per-URL errors. `session_id` is a useful continuity field for Search and Extract in the provider OpenAPI. `run_id` is the key operational field for Task because the workflow is asynchronous.

Payment fields are externalized into MPP/x402 headers. The gateway schema documents `Authorization: Payment <credential>` for MPP/Tempo and `X-Payment: <base64-proof>` for x402/Base. The catalog payment claims identify Tempo pathUSD-style payments for the three paid endpoints.
