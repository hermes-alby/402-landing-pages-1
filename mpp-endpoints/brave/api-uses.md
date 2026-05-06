# Brave Search API Uses

## Service Summary

Brave Search exposes an independent web index and AI-oriented search services. The MPP wrapper turns six Brave Search API capabilities into pay-per-request POST endpoints: broad web search, news search, image search, video search, LLM context retrieval, and AI-generated answers.

The strongest opportunities are source discovery, current-news monitoring, media curation, RAG grounding, and cited answer generation. The wrapper is especially useful for agents or low-volume workflows that want Brave-backed search without direct account setup, API-key management, or subscription-style integration work.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| General Web And Rich Search | 1 | Ranked web results, mixed verticals, structured snippets, source discovery, and broad search enrichment. | [api-uses/general-web-and-rich-search.md](api-uses/general-web-and-rich-search.md) |
| News Monitoring And Research | 1 | Current and historical news search with freshness, source, article, and publication metadata. | [api-uses/news-monitoring-and-research.md](api-uses/news-monitoring-and-research.md) |
| Media Discovery And Curation | 2 | Image and video discovery with thumbnails, source URLs, dimensions, duration, views, creator, and publisher fields. | [api-uses/media-discovery-and-curation.md](api-uses/media-discovery-and-curation.md) |
| LLM Grounding And Cited Answers | 2 | Raw extracted web context for RAG or complete Brave-generated answers with OpenAI-compatible response shapes upstream. | [api-uses/llm-grounding-and-cited-answers.md](api-uses/llm-grounding-and-cited-answers.md) |

## Highest-Value Uses

- Give agents a current web-search tool with source URLs, snippets, recency fields, and optional mixed verticals.
- Retrieve LLM-ready grounding snippets with token and URL budgets instead of scraping pages manually.
- Generate cited answers or deeper research drafts when the user wants synthesis rather than raw search results.
- Monitor brands, competitors, markets, or events with news-specific freshness and source metadata.
- Build media curation workflows that use image dimensions, thumbnails, video duration, views, creator, and publisher metadata before human review.

## Personal Use Opportunities

People can use the service to research decisions, monitor breaking topics, collect visual references, find tutorials, and ground personal AI assistants in current web sources. The most useful personal fields are `q`, `freshness`, `country`, result URLs, snippets, `page_age`, thumbnails, image dimensions, video durations, source hostnames, and LLM Context `sources`.

## Business Use Opportunities

Businesses can use the service for competitive intelligence, account research, PR monitoring, support-answer grounding, editorial workflows, CMS image suggestions, video trend monitoring, and AI chat experiences. The most business-critical fields are source URL, hostname, title, description, publication/fetch dates, structured web enrichments, media metadata, token/URL budgets, and answer usage/citation metadata upstream.

## Endpoint Group Summaries

### General Web And Rich Search

`POST /brave/web-search` is the broad discovery endpoint. It returns ranked web results and optional mixed verticals such as news, videos, discussions, FAQ, infoboxes, locations, and rich hints. It is best for search UIs, source discovery, CRM/account enrichment, market monitoring, and first-pass routing. Full details: [api-uses/general-web-and-rich-search.md](api-uses/general-web-and-rich-search.md).

### News Monitoring And Research

`POST /brave/news-search` is the recency-focused endpoint. It supports freshness filters and returns article titles, URLs, descriptions, ages, publication dates, fetch dates, source metadata, and thumbnails. It is best for breaking-news alerts, PR monitoring, market intelligence, and historical event research. Full details: [api-uses/news-monitoring-and-research.md](api-uses/news-monitoring-and-research.md).

### Media Discovery And Curation

`POST /brave/image-search` and `POST /brave/video-search` support visual and video discovery. Image Search returns thumbnails, original image URLs, dimensions, source pages, and safety metadata. Video Search returns duration, views, creator, publisher, author, tags, thumbnails, and page dates. These endpoints are best for media research, editorial suggestions, tutorial discovery, trend monitoring, and pre-review filtering. Full details: [api-uses/media-discovery-and-curation.md](api-uses/media-discovery-and-curation.md).

### LLM Grounding And Cited Answers

`POST /brave/llm-context` returns extracted web snippets and source metadata for a caller's own model. `POST /brave/answers` returns an OpenAI-compatible grounded answer upstream, with streaming, citations, research-mode tags, and usage tags documented by Brave. This group is best for RAG, agent tools, support assistants, cited chat, and research drafting. Full details: [api-uses/llm-grounding-and-cited-answers.md](api-uses/llm-grounding-and-cited-answers.md).

## Field And Data Themes

The shared input theme is query plus scope: `q`, `count`, locale, freshness, SafeSearch, and endpoint-specific budget fields. Search endpoints return source and ranking metadata: titles, URLs, descriptions, source hostnames, thumbnails, timestamps, and optional structured result types. Media endpoints add dimensions, original image URLs, duration, views, creators, and publishers. AI endpoints add grounding snippets, sources, chat completion choices, citations, research tags, and usage/cost signals upstream.
