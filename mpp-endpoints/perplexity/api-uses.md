# Perplexity API Uses

## Service Summary

Perplexity provides APIs for real-time web search, cited answer generation, and embeddings. The MPP wrapper exposes four selected Perplexity capabilities as pay-per-request endpoints: Sonar chat, raw web search, standard embeddings, and contextualized embeddings.

The highest-value uses come from source-grounded research and retrieval workflows: cited briefings, monitored public-source changes, raw source discovery, domain-restricted documentation lookup, semantic knowledge search, and document-aware RAG.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Grounded Answer Generation | 1 | Cited web-grounded answers with model, recency, domain, structured-output, image, related-question, and usage/cost controls. | [grounded-answer-generation.md](api-uses/grounded-answer-generation.md) |
| Raw Web Search | 1 | Ranked URLs, titles, snippets, publication dates, and update dates for query-driven source collection and monitoring. | [raw-web-search.md](api-uses/raw-web-search.md) |
| Vector Embeddings And RAG | 2 | Standard and document-aware embeddings for semantic search, clustering, recommendations, and retrieval pipelines. | [vector-embeddings-and-rag.md](api-uses/vector-embeddings-and-rag.md) |

## Highest-Value Uses

- Evidence-backed briefings for executives, analysts, investors, and researchers where answers need `citations[]`, `search_results[]`, and freshness filters.
- Public change monitoring across competitor pages, product docs, policy pages, filings, and trusted news sources using search date/domain controls.
- Domain-restricted support and documentation lookup, with source URLs preserved before any answer is sent to a customer.
- Semantic knowledge search over notes, documentation, policies, support tickets, or research archives using reusable embeddings.
- Document-aware RAG over long reports, contracts, manuals, and filings where ordered chunks need shared context.
- Cost-aware research automation using `usage` token and cost fields to route routine scans to cheaper settings and reserve deeper models/search for important tasks.

## Personal Use Opportunities

People can use the chat endpoint for cited current answers, product comparisons, academic or SEC-focused research, and structured extraction from public sources. The raw search endpoint is better when the person wants to review source pages directly instead of trusting a synthesized answer. The embedding endpoints support personal knowledge bases, bookmark search, note deduplication, and long-document retrieval.

## Business Use Opportunities

Businesses can use Perplexity MPP endpoints to add current web context to workflows without building their own search stack. Strong business applications include market and competitor intelligence, sales/account research, support-answer drafting with citations, source discovery for analysts, compliance and policy monitoring, RAG over internal or public documents, semantic ticket clustering, and recommendation/matching systems.

## Endpoint Group Summaries

### Grounded Answer Generation

`POST /perplexity/chat` generates Sonar answers with conversation input, model choice, web search controls, structured-output controls, citations, optional search results/images/related questions, and usage/cost telemetry. It is the best fit when the user needs a final explanation or structured answer with evidence. Full details: [api-uses/grounded-answer-generation.md](api-uses/grounded-answer-generation.md).

### Raw Web Search

`POST /perplexity/search` returns ranked source pages with title, URL, snippet, publication date, and last-updated metadata. It is the best fit for source collection, monitoring, downstream extraction, and workflows that need to keep search evidence separate from generated summaries. Full details: [api-uses/raw-web-search.md](api-uses/raw-web-search.md).

### Vector Embeddings And RAG

`POST /perplexity/embed` and `POST /perplexity/context-embed` create encoded vector representations for independent texts and context-aware document chunks. They are best suited to semantic search, RAG indexing, clustering, deduplication, matching, and recommendation workflows. Full details: [api-uses/vector-embeddings-and-rag.md](api-uses/vector-embeddings-and-rag.md).

## Field And Data Themes

Perplexity's search and chat fields center on source scope and freshness: domain filters, language filters, recency filters, date filters, country, search context size, and search mode. Their outputs preserve evidence through URLs, snippets, citations, source dates, and update dates.

The chat endpoint adds generative controls: `messages`, `model`, `temperature`, `top_p`, `response_format`, `reasoning_effort`, and optional images or related questions. Its `usage` fields allow cost and token accounting.

The embedding endpoints return base64-encoded vectors rather than readable JSON vectors. Their useful downstream value depends on storing original text IDs, decoding embeddings, and comparing vectors in a similarity engine or vector database.
