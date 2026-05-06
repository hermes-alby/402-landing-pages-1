# Exa: Cited Answer Generation API Uses

## What This Endpoint Group Does

The `cited-answer-generation` group covers Exa's `POST /answer` workflow: submit a natural-language `query` and receive a generated `answer` grounded in Exa search results. The answer can be a plain string or, when `outputSchema` is supplied, a structured object shaped by JSON Schema Draft 7.

This group is useful when the product needs a synthesized answer rather than a ranked result list. The endpoint returns `citations` with source URLs, titles, optional authors, estimated publication dates, optional source text, media metadata, and provider-reported cost via `costDollars.total`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/answer` | Performs a search based on the query and generates either a direct answer or a detailed cited summary, depending on the query type. | `query` is required. Optional controls are `stream`, `text`, and `outputSchema` with `type`, `properties`, `required`, `description`, and `additionalProperties`. | `answer`, `citations[].id`, `citations[].url`, `citations[].title`, `citations[].author`, `citations[].publishedDate`, `citations[].text`, `citations[].image`, `citations[].favicon`, and `costDollars.total`. |

## Field Notes

### Inputs

- `query` is the required question or prompt. It is the main control surface because this endpoint does not expose the broader search filters available on `/search`, such as domain filters, category filters, result counts, or publication date bounds.
- `stream` requests a server-sent events response. The OpenAPI response shape lists partial `answer` chunks and possible `citations`, while the local inventory notes that wrapper-specific streaming behavior was not tested.
- `text` asks Exa to include full source text in citation records. This is important for audit trails, quote checking, compliance review, and downstream summarization, but it can increase payload size and may affect cost accounting.
- `outputSchema` lets the caller request a structured object instead of a plain answer string. The schema supports `type`, `properties`, `required`, `description`, and `additionalProperties`; invalid schemas can produce `400` errors with the `INVALID_JSON_SCHEMA` tag.

### Outputs

- `answer` is the generated answer. By default it is a string; with `outputSchema`, it can be an object matching the requested schema.
- `citations` are the evidence set used to generate the answer. Each citation can include a temporary `id`, canonical `url`, `title`, optional `author`, estimated `publishedDate`, optional `text`, `image`, and `favicon`.
- `citations[].text` is only expected when `text=true`. Treat it as the reviewable source material behind the generated answer rather than as a guaranteed complete archival copy.
- `costDollars.total` reports the provider-side dollar cost for the request. The MPP wrapper inventory separately lists a fixed payment amount of `10000` raw 6-decimal units for `/answer`.

### Important Constraints Or Gaps

- The exact endpoint group object says `/answer` "packages search and synthesis into one cited answer workflow instead of exposing raw ranked results as the main product."
- The MPP wrapper requires payment. The original Exa API uses `x-api-key` or `Authorization: Bearer`; Exa's first-party x402 documentation covers original `/search` and `/contents`, but excludes `/answer`.
- Default Exa rate limits list `/answer` at 10 QPS. The public MPP metadata does not document a separate wrapper-specific rate limit.
- The local MPP catalog does not expose a wrapper-specific OpenAPI schema, payment challenge header contract, streaming contract, or error envelope. Request and response fields are mapped from Exa's official provider docs because wrapper paths match provider paths.
- `/answer` can fail with `501` or `UNABLE_TO_GENERATE_RESPONSE` when Exa cannot generate a response from available information. It can also be blocked by content safety moderation via `403` or `PROHIBITED_CONTENT`.
- `citations[].publishedDate` is an estimate parsed from HTML and can be null. `citations[].author` can also be null, so workflows that need publication provenance should handle missing metadata.
- Because `/answer` exposes no explicit freshness, domain, category, or jurisdiction filters in the recorded request fields, high-stakes use cases should either phrase `query` carefully or use `/search` and `/contents` workflows when tighter source selection is required.

## Use Cases

### Source-Backed Executive Briefs

An individual analyst, founder, or operator can ask focused questions such as "What changed in the California AI safety bill this week?" and receive a concise `answer` with `citations[].url`, `citations[].title`, and `citations[].publishedDate` attached. Setting `text=true` gives the analyst source text for checking whether the generated summary reflects the cited pages.

For a business workflow, this can power internal briefing tools that turn a current-events or market question into a cited summary for leadership review. The returned citation metadata supports quick source triage, while `costDollars.total` supports per-brief cost logging. The main limitation is source control: without exposed domain or date filters on `/answer`, teams should treat the result as a fast first brief, not the final record for legal, financial, medical, or compliance decisions.

### Structured Competitive Intelligence

Teams can supply an `outputSchema` that asks for fields such as `company`, `recent_move`, `evidence_summary`, `source_urls`, `risk_level`, and `recommended_follow_up`. The endpoint can then return `answer` as a structured object while still attaching the underlying `citations`. This is useful for sales, product marketing, venture research, and strategy teams that want an object they can store in a CRM or research database.

The useful fields are `query` for the market question, `outputSchema.properties` and `outputSchema.required` for enforcing the intelligence shape, `citations[].url` and `citations[].title` for evidence, and `citations[].text` when reviewers need to inspect the cited material. The main gap is that `/answer` citations support the whole answer, not the field-level `output.grounding` shape recorded for `/search`, so downstream systems should not assume each structured field has its own explicit citation confidence.

### Cited Customer Support Answers

A support assistant can use `/answer` to respond to questions that require current web-backed information, such as outages, public documentation changes, shipping policies, or ecosystem compatibility notes. The `answer` field gives the draft response, while `citations` let the agent or customer see the public sources behind it.

For business support operations, `stream=true` can improve perceived latency in chat-style experiences, and `text=true` can preserve source excerpts for quality review. The constraints are material: wrapper-specific streaming behavior was not verified, sources may include external pages outside the company's canonical documentation unless the query is carefully written, and teams should review moderation and data-retention policies before exposing citation text to end users.

### Evidence-Grounded Research Notes

Students, independent researchers, and knowledge workers can ask open-ended questions and receive an answer that names the supporting sources. The most important fields are `answer` for the summary, `citations[].title` and `citations[].url` for the reading list, and `citations[].publishedDate` for recency checks.

In a business research desk, the same pattern can produce quick annotated notes for analysts before deeper review. Requesting `text=true` helps preserve the source material that informed the note, and `costDollars.total` lets teams track research spend by project. The limitation is that generated answers can still omit context or overcompress disagreement across sources, so workflows should retain citations and require human review before publishing findings.

### Compliance And Policy Change Triage

An operations, trust and safety, or compliance team can ask targeted questions about public policy changes, standards, enforcement actions, or platform rules, then inspect the returned `citations` for source type, title, author, and publication date. An `outputSchema` can force a triage shape such as `jurisdiction`, `rule_change`, `affected_products`, `effective_date`, `confidence_notes`, and `source_urls`.

This is a high-value use because the endpoint combines synthesis with evidence capture in one call, but it is also where limitations matter most. `/answer` has no recorded jurisdiction filter, explicit date filter, or official-source allowlist; `publishedDate` is estimated; and `501` generation failures or content moderation blocks are possible. Treat the output as an intake and prioritization layer, then verify against primary legal or regulatory materials.

### Citation-Aware Content Drafting

Writers and content teams can use `/answer` to create a sourced paragraph, FAQ answer, or research-backed outline from a specific question. The answer becomes the draft material, while `citations[].url`, `citations[].title`, and optional `citations[].text` provide the source trail needed for editing, fact checking, and link attribution.

For businesses, this is useful in content operations where every generated claim needs a source before publication. An `outputSchema` can request fields like `claim`, `supporting_source`, `date_context`, and `needs_editor_review`. The compliance concern is that citation metadata alone does not grant reuse rights, and full source text should not be republished blindly; editors need to check licensing, quote length, freshness, and whether the generated draft faithfully reflects the source.
