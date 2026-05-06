# Exa API Uses

## Service Summary

Exa is an AI-oriented web search provider. The Exa MPP service exposes four paid POST endpoints through `https://exa.mpp.tempo.xyz`: web search, content extraction, similar-page discovery, and cited answer generation. Together they let an agent or application discover public web sources, retrieve clean content from known URLs, expand from useful seed pages, and synthesize cited answers from search results.

The strongest uses are evidence-grounded research workflows: finding current sources, extracting source text and metadata, building RAG corpora, monitoring policy or pricing changes, discovering comparable vendors or papers, and producing cited summaries for human review. This artifact is based on local MPP metadata and Exa public documentation snapshots only. No paid endpoint calls, account actions, wallet signatures, x402 settlements, or mutations were performed.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Web Search And Result Discovery | 1 | Search from natural-language queries, domain/date/category filters, optional content snippets, and optional structured output grounded to results. | [api-uses/web-search-and-result-discovery.md](api-uses/web-search-and-result-discovery.md) |
| Content Retrieval And Extraction | 1 | Turn known URLs or Exa document IDs into clean text, highlights, summaries, structured summaries, subpages, extracted links, crawl statuses, and source metadata. | [api-uses/content-retrieval-and-extraction.md](api-uses/content-retrieval-and-extraction.md) |
| Similar Page Discovery | 1 | Expand from a useful seed URL to semantically similar pages, optionally with filters and extracted content for the returned pages. | [api-uses/similar-page-discovery.md](api-uses/similar-page-discovery.md) |
| Cited Answer Generation | 1 | Submit a question and receive a generated answer or structured object with citations, source metadata, optional source text, and provider-reported cost. | [api-uses/cited-answer-generation.md](api-uses/cited-answer-generation.md) |

## Highest-Value Uses

- Evidence-first agent answering: use `/search` for controlled source discovery, `/contents` for deeper reading, and `/answer` only when a fast cited synthesis is more valuable than direct source control.
- RAG corpus seeding and ingestion: discover candidate pages with `/search` or `/findSimilar`, then retrieve selected `id` or `url` values through `/contents` with text, highlights, summaries, subpages, and crawl status handling.
- Policy, pricing, terms, and docs monitoring: search or retrieve trusted pages on a schedule, preserve source URLs and timestamps, inspect `statuses[]`, and route changes to legal, support, product, or operations teams.
- Competitive, market, and vendor research: combine domain filters, categories, similar-page expansion, highlights, summaries, and structured output to build review queues rather than unsupported final facts.
- Literature and technical research: use `category: "research paper"` or seed-paper similarity to find related work, then preserve title, URL, author, publication date, excerpts, and citations for manual validation.

## Personal Use Opportunities

An individual researcher can use Exa as a current-source layer for questions where static model knowledge is not enough. `/search` returns ranked URLs, titles, dates, authors, highlights, and optional structured output; `/contents` turns selected pages into readable markdown or summaries; `/answer` produces a quick cited brief when source selection is less critical.

Buyers, job seekers, students, writers, and technical learners can use `/findSimilar` and `/contents` to expand from a known high-quality page into alternatives, related reading, documentation bundles, or source-backed notes. The useful fields are concrete: `url`, `id`, `title`, `author`, `publishedDate`, `highlights`, `text`, `summary`, `citations`, and crawl `statuses[]`.

## Business Use Opportunities

Businesses can embed these endpoints into analyst desks, support tools, sales intelligence workflows, product research, vendor discovery, and RAG ingestion pipelines. `/search` is best when the workflow needs source constraints and discovery controls. `/contents` is best when the workflow already knows the URLs and needs clean, auditable material. `/findSimilar` is best for expanding from a trusted seed. `/answer` is best for fast synthesized briefs with citations.

The primary business value is not just "web search"; it is turning public web evidence into reviewable decisions: which sources to ingest, which policy change needs escalation, which competitor page changed, which candidate vendor deserves review, which cited answer is safe enough to show, or which failed URLs need retry or removal.

## Endpoint Group Summaries

### Web Search And Result Discovery

`POST /search` accepts a required `query` plus optional search type, streaming, result count, category, location bias, domain filters, date filters, moderation, additional queries, content extraction controls, and structured output controls. It returns ranked results with URLs, titles, IDs, dates, authors, optional page content, optional synthesized `output.content`, grounding citations and confidence, streaming chunks, and `costDollars.total`. See [api-uses/web-search-and-result-discovery.md](api-uses/web-search-and-result-discovery.md).

### Content Retrieval And Extraction

`POST /contents` accepts known `urls` or Exa document `ids` and can return text, highlights, summaries, structured summaries, subpages, extracted links, per-source statuses, and cost data. This group is central for RAG ingestion, evidence packs, docs extraction, URL health audits, and monitoring workflows because it turns selected sources into material that can be stored, cited, compared, or reviewed. See [api-uses/content-retrieval-and-extraction.md](api-uses/content-retrieval-and-extraction.md).

### Similar Page Discovery

`POST /findSimilar` starts from a seed `url` and returns pages that are semantically similar, with optional domain/date/moderation filters and optional content extraction. It is useful for competitor expansion, related reading, academic neighborhoods, alternative vendor discovery, source graph building, and corpus expansion from a trusted source. See [api-uses/similar-page-discovery.md](api-uses/similar-page-discovery.md).

### Cited Answer Generation

`POST /answer` accepts a required `query` plus optional streaming, source text inclusion, and `outputSchema`. It returns an `answer`, citations with source metadata and optional text, and `costDollars.total`. It is useful for executive briefs, cited support drafts, structured competitive intelligence, policy triage, and research notes, but it exposes fewer source-selection controls than `/search`. See [api-uses/cited-answer-generation.md](api-uses/cited-answer-generation.md).

## Field And Data Themes

- Discovery controls: `query`, `type`, `numResults`, `category`, `includeDomains`, `excludeDomains`, date filters, `userLocation`, `moderation`, and seed `url` determine what evidence enters the workflow.
- Content controls: `text`, `highlights`, `summary`, `summary.schema`, `contents`, `maxAgeHours`, `livecrawlTimeout`, `subpages`, `subpageTarget`, and `extras.links` decide how much source material and link context returns with each result.
- Provenance fields: `requestId`, `results[].id`, `results[].url`, `title`, `author`, `publishedDate`, `citations[]`, `output.grounding`, and `statuses[]` should be preserved for auditability.
- Cost and payment fields: provider responses can include `costDollars.total`; local MPP metadata lists fixed raw 6-decimal MPP amounts of `5000` for `/search`, `/contents`, and `/findSimilar`, and `10000` for `/answer`.
- Error and quality signals: `/contents` can return HTTP 200 while individual URLs fail in `statuses[]`; `/answer` can fail when Exa cannot generate a response; publication dates and authors may be estimated or null.
