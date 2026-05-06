# Exa: Web Search And Result Discovery API Uses

## What This Endpoint Group Does

The `web-search-and-result-discovery` group covers Exa's primary discovery workflow: find relevant web pages from a natural-language query, with controls for search type, result count, vertical category, domains, publication and crawl dates, geolocation bias, content extraction, and optional structured synthesis.

The group is backed by a single MPP endpoint, `POST /search`, mapped to Exa's official `/search` provider schema. It is useful when an agent or application needs fresh or source-bounded web evidence before deciding whether to retrieve full contents, answer a user, populate a research queue, or build a structured record from web results.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/search` | Search the web from a natural-language query and optionally return extracted content or synthesized structured output. MPP endpoint ID: `endp_5b9614c0dab3485e0f74`; MPP URL: `https://exa.mpp.tempo.xyz/search`; provider path: `/search`. | Required `query`; optional `type`, `stream`, `numResults`, `category`, `userLocation`, `includeDomains`, `excludeDomains`, published/crawl date filters, `moderation`, `additionalQueries`, `systemPrompt`, `outputSchema`, and nested `contents` controls for `text`, `highlights`, `summary`, `maxAgeHours`, `livecrawlTimeout`, `subpages`, `subpageTarget`, and `extras.links`/`extras.imageLinks`. | `requestId`, `searchType`, ranked `results[]` with title, URL, Exa document ID, publication date, author, image, favicon, requested text/highlights/summary/subpages/extras, optional `output.content`, `output.grounding` citations and confidence, streaming chunks when `stream: true`, and `costDollars.total`. |

## Field Notes

### Inputs

`query` is the required discovery prompt. It can be long and semantic, so the strongest uses describe the desired source class, evidence need, time window, and exclusion criteria in the query instead of relying only on keyword matching.

`type` controls latency and depth. The endpoint inventory lists `neural`, `fast`, `auto`, `deep-lite`, `deep`, `deep-reasoning`, and `instant`; the coding-agent guide recommends `auto` for most uses, `fast` or `instant` for low-latency product paths, and deep variants when the workflow needs multi-step search, reasoning, or more reliable synthesized output.

`category` narrows the search vertical to `company`, `research paper`, `news`, `personal site`, `financial report`, or `people`. This is central for targeted discovery, but `company` and `people` are constrained: they do not support published-date filters, crawl-date filters, or `excludeDomains`; `people` only accepts LinkedIn domains in `includeDomains`.

Domain and date fields make the endpoint practical for controlled evidence collection. `includeDomains` and `excludeDomains` accept up to 1200 domains, while `startPublishedDate`, `endPublishedDate`, `startCrawlDate`, and `endCrawlDate` use ISO 8601 timestamps. `userLocation` is a two-letter ISO country code that biases result geography, and `moderation` filters unsafe results.

Nested `contents` fields decide how much page material comes back with search results. `contents.highlights: true` is the most efficient agent default; `contents.text` is better for deeper analysis and can be capped with `maxCharacters`; `contents.summary` can target a summary query or schema; `contents.maxAgeHours` controls freshness, where `0` forces livecrawl, `-1` uses cache only, and omitted allows livecrawl only when no cached content exists. `contents.subpages`, `subpageTarget`, `extras.links`, and `extras.imageLinks` turn search results into a source-expansion seed list.

`outputSchema` asks Exa to synthesize `output.content` into a JSON schema or text response. The guide says it works with every search type, with a maximum nesting depth of 2 and at most 10 total properties. Use `systemPrompt` for source preferences and behavior, not response shape. Do not add citation or confidence fields to the schema because `/search` returns `output.grounding` automatically.

### Outputs

The result list is the primary discovery output. Each result can include `title`, `url`, `id`, `publishedDate`, `author`, `image`, and `favicon`; the `id` is useful for follow-up `/contents` calls, and `publishedDate` should be treated as an estimate from page parsing.

Requested content appears on each result. `results[].highlights` and `highlightScores` support quick evidence triage, `results[].text` supports deeper review, `results[].summary` supports compact handoff to downstream agents, and `results[].subpages` plus `results[].extras.links` can reveal pages that were not direct top-level matches.

When `outputSchema` is used, `output.content` holds the synthesized text or object and `output.grounding` maps fields such as `content` or `companies[0].funding` to citations and `low`, `medium`, or `high` confidence. This makes the endpoint useful for structured extraction, but consumers should still inspect the cited sources and confidence before treating extracted fields as facts.

`costDollars.total` reports provider-side request cost. The MPP wrapper inventory separately lists a Tempo MPP payment claim with amount `5000` in 6-decimal raw units for `/search`; Exa's first-party x402 docs list different search prices by type and options, so wrapper cost and provider cost should not be assumed equivalent without runtime verification.

### Important Constraints Or Gaps

The MPP wrapper requires payment metadata before executing paid requests. This artifact was produced from public docs and local metadata only; no paid endpoint was called, no payment was signed, no account was registered, and no mutation was submitted.

The public MPP catalog does not expose a wrapper-specific OpenAPI schema, wrapper error envelope, or runtime payment challenge headers. Request and response fields are therefore mapped from Exa official provider docs because the wrapper path matches the provider path.

Exa provider docs list `numResults` up to 100 for `/search`, while Exa first-party x402 caps `/search` at 10 results. Whether the MPP wrapper applies the same cap is not exposed in public metadata.

`stream: true` returns OpenAI-compatible `text/event-stream` chunks in provider docs, but wrapper-specific streaming behavior was not verified because no paid calls were made.

Some legacy fields should be avoided: `useAutoprompt`, top-level `text`/`summary`/`highlights`, URL-level `includeUrls`/`excludeUrls`, deprecated `livecrawl`, `numSentences`, `highlightsPerUrl`, `tokensNum`, and deprecated `context`.

## Use Cases

### Fresh, Cited Answer Source Discovery

A personal research assistant can use `/search` before answering questions where current evidence matters, such as policy changes, product launches, or travel restrictions. The workflow is to send a specific `query`, choose `type: "fast"` or `type: "auto"` depending on latency tolerance, request `contents.highlights: true`, and set `contents.maxAgeHours: 0` only when stale cached content would be unacceptable. `results[].url`, `title`, `publishedDate`, `author`, and `highlights` let the agent show sources or decide which pages need a follow-up `/contents` call.

For a business support or analyst tool, the same pattern can gate model answers behind source discovery from approved domains. `includeDomains` can restrict sources to regulators, vendor docs, or official blogs, while `outputSchema` can produce a compact object such as `{answer, source_count, risk_notes}`. The limitation is cost and latency: livecrawl, summaries, output synthesis, and deep search add overhead, and `publishedDate` is estimated rather than guaranteed.

### Domain-Filtered News And Policy Monitoring

Teams tracking regulation, competitors, security advisories, or market-moving announcements can run scheduled `/search` calls with `category: "news"`, `includeDomains` for trusted outlets or agency sites, and `startPublishedDate`/`endPublishedDate` to bound the watch window. `contents.highlights` gives enough evidence for triage, while `outputSchema` can normalize fields such as topic, affected company, jurisdiction, date, and urgency.

This also has a personal version for people who want a focused daily brief without broad web noise. `userLocation` can bias geographically relevant results, and `excludeDomains` can remove low-value or duplicated sources. The main compliance concern is that monitoring pipelines should store result metadata and grounding, not only synthesized summaries, so reviewers can audit why an item was flagged.

### Company And People Prospect Discovery

Sales, recruiting, partnership, and market-mapping workflows can use `category: "company"` or `category: "people"` to find company pages, LinkedIn company profiles, or LinkedIn people profiles from natural-language criteria such as "B2B fintech infrastructure companies hiring protocol engineers in the US." Important fields are `query`, `category`, `numResults`, `includeDomains` where allowed, `results[].title`, `results[].url`, `results[].author`, and optional `contents.highlights` for qualification snippets.

The category restrictions matter here. For `company` and `people`, published-date filters, crawl-date filters, and `excludeDomains` are unsupported and can return 400 errors; for `people`, `includeDomains` only accepts LinkedIn domains. Personal use cases such as finding public speakers, authors, or professional profiles must respect privacy and downstream compliance rules because the endpoint can surface person-related records.

### Academic And Technical Literature Discovery

Researchers and engineering teams can use `category: "research paper"` with `includeDomains` such as `arxiv.org`, publisher domains, or benchmark sites to build a paper queue around a technical question. `startPublishedDate` and `endPublishedDate` help separate recent work from historical background, `contents.highlights` identifies claims quickly, and `contents.text.maxCharacters` can provide enough abstract or body text for preliminary ranking without fetching full pages for every result.

With `type: "deep"` or `deep-reasoning`, `additionalQueries`, `systemPrompt`, and `outputSchema`, the endpoint can return a structured comparison of papers, methods, datasets, limitations, and cited URLs. `output.grounding` is essential because synthesized comparisons can blend evidence across papers; downstream systems should preserve citations and confidence rather than treating `output.content` as source text.

### Financial Report And Investor Research Triage

Investors, finance teams, and competitive intelligence analysts can search `category: "financial report"` for filings, earnings materials, investor decks, or annual reports. Domain filters can favor official investor-relations sites, SEC sources, or exchange filings, while date filters can constrain the reporting period. Useful outputs include `title`, `url`, `publishedDate`, `summary`, `highlights`, and `costDollars.total` for tracking research spend.

`outputSchema` can normalize fields such as company, period, reported metric, guidance change, risk factor, and source URL, with `output.grounding` showing which page supports each field. This should be used as triage, not accounting-grade extraction: filings may be amended, publication dates may be parsed imperfectly, and any investment or compliance workflow needs human review against the source document.

### RAG Corpus Seeding And Source Expansion

A RAG builder can use `/search` to discover candidate sources before committing to ingestion. The workflow is to issue a domain-bounded or category-bounded `query`, request `contents.highlights` for relevance, add `contents.extras.links` and sometimes `contents.subpages` with `subpageTarget` to find documentation, pricing, changelog, terms, or support pages, then pass selected `results[].id` or `results[].url` into `/contents` for extraction.

This is stronger than blindly crawling a domain because `query`, `includeDomains`, `excludeDomains`, and date filters keep the seed list aligned with the corpus purpose. The tradeoff is that every search and optional content extraction has cost and freshness implications; teams should cap `numResults`, avoid forced livecrawl unless needed, and preserve raw result metadata so later normalization does not hide source drift.

### Structured Competitive Feature Tracking

Product and strategy teams can use `/search` with a query like "official pricing and feature pages for vector database hybrid search limits" plus `includeDomains` for known competitors. `contents.highlights` or capped `contents.text` pulls the relevant snippets, while `outputSchema` can require fields such as vendor, feature, limit, price, last_seen_source, and caveats.

The returned `output.grounding` makes this viable for dashboards because each extracted field can link back to a source URL and confidence score. The risk is freshness and terms compliance: product pages change, cached content may lag unless `maxAgeHours` is set aggressively, and automated monitoring should respect robots, provider terms, and any internal rules for storing competitor data.
