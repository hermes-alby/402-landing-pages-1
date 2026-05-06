# GovLaws: Semantic Legal Search API Uses

## What This Endpoint Group Does

The Semantic Legal Search endpoint group helps an agent find likely federal legal sources before it knows the exact citation to resolve. A caller sends a natural-language or keyword `query`, chooses how many ranked candidates to return with `limit`, and selects a `corpus` of current CFR regulations, canary U.S. Code coverage, or both. The response returns citation-level search hits with titles, relevance scores, snippets, source URLs when available, and corpus-level provenance.

The practical value is discovery and triage. Instead of guessing a citation or scraping government sites, a workflow can ask "which CFR or U.S. Code sections look relevant?", inspect `results[].citation`, `results[].title`, `results[].score`, and `results[].snippet`, then decide whether to open the upstream `results[].url`, call a citation-resolution endpoint for full text, route the issue to a specialist, or store the result as evidence in a research trail. The top-level `provenance` block matters because it tells downstream systems which source corpus was searched, how current it is, and whether the result category is suitable for research, reference, or legal filing contexts.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/mpp/search` | Run semantic search over current federal regulations, canary U.S. Code coverage, or both through the no-account MPP lane. MPP endpoint ID: `endp_dcf385cc26a504b98825`; MPP URL: `https://govlaws.ai/api/mpp/search`; provider analog: `/api/search`. | Required `Content-Type: application/json`; required body `query`; optional `limit` from 1 to 20, default 5; optional `corpus` enum `regulations`, `statutes`, or `all`, default `regulations`. | `results[]` with `citation`, `title`, `score`, `snippet`, and `url`; echoed `query`; searched `corpus`; `total`; top-level `provenance` with source, trust, official-edition, official-artifact, and currency fields when present. |

## Field Notes

### Inputs

`query` is the main control surface. It can be a plain keyword query or a natural-language description of the legal issue, such as a consumer-credit topic, mortgage-servicing obligation, safety requirement, benefits question, or statutory concept. The stronger workflows include the regulated activity, legal domain, agency or statute family if known, and the decision the caller needs to make.

`limit` controls result breadth. The schema allows 1 to 20 results and defaults to 5. Small limits are useful for fast routing or user-facing assistants; larger limits are better for due diligence, RAG corpus seeding, and internal review queues where recall matters more than latency or review effort.

`corpus` is a major relevance and risk control. `regulations` searches CFR material and is the default for backward compatibility. `statutes` searches U.S. Code canary coverage. `all` searches both CFR and canary U.S. Code material, which is useful for broad discovery but may mix source systems and citation standards in one result set.

The MPP route requires no pre-created API key for the initial request. A successful data response requires the payment flow: request, receive a `402 Payment Required` challenge, pay with an MPP client, and replay with payment proof. The inventory lists Tempo MPP amount `30000` with 6 decimals, published as `$0.03` per search request.

### Outputs

`results[]` is the primary output. `results[].citation` is the stable legal handle for follow-up resolution, `results[].title` explains the matched section, `results[].score` supports ranking and thresholding, `results[].snippet` gives enough context for triage, and `results[].url` can link a reviewer to the source when available. These fields are enough to build a shortlist, not enough to replace full-text legal analysis.

The echoed `query`, returned `corpus`, and `total` are useful for logging and audit trails. They let a team reconstruct what was searched, whether the search was limited to regulations or statutes, and how many candidates were returned under the chosen `limit`.

The top-level `provenance` block is the trust surface for the result set. Important fields include `source_system` (`ecfr`, `govinfo`, `federal_register`, or `olrc_uscode`), `currency.reflects_current_text`, `currency.as_of`, `currency.effective_date`, `official_artifact_url`, `official_edition`, and `trust.disclaimer_code`. Downstream agents should branch on `trust.citation_suitability` instead of parsing the human-readable disclaimer.

### Important Constraints Or Gaps

This endpoint is a discovery endpoint. Search snippets and scores identify likely legal sources, but workflows that quote text, make a compliance decision, or prepare a filing should resolve and inspect the full cited source.

The MPP route lacks a reusable 200-response schema in the OpenAPI source. The result object is example-derived, so fields beyond `citation`, `title`, `score`, `snippet`, and `url` may appear, and clients should tolerate schema drift.

U.S. Code support is documented as canary coverage. `corpus: "statutes"` and `corpus: "all"` can support statutory discovery, but they should not be treated as complete U.S. Code research without independent coverage validation.

eCFR current text is operationally current but not itself the official legal edition of the CFR. For compliance filings or formal legal citation, require `provenance.trust.citation_suitability` to include `legal_filing` and preserve the upstream official artifact URL when available.

Payment and replay details are not fully specified in the public OpenAPI component schemas. The artifact was produced from local source snapshots and public metadata only; no paid GovLaws endpoint was called, no payment was signed, no account was created, and no mutation was submitted.

## Use Cases

### Individual Legal Research Starting Point

A person trying to understand a federal rule can submit a plain-language `query` such as "qualified mortgage underwriting requirements" or "fair credit reporting congressional findings", keep `limit` at 5, and choose `corpus: "regulations"` or `corpus: "statutes"` depending on whether they need CFR rules or U.S. Code canary results. The returned `results[].citation`, `title`, `score`, and `snippet` help them identify which sections are worth reading next instead of searching broad web results with uncertain provenance.

The workflow should treat the API as a research aid, not legal advice. If a result affects a deadline, filing, benefits claim, employment issue, or regulated activity, the user should follow `results[].url` when present or resolve the citation to full text, then check `provenance.currency.as_of`, `provenance.source_system`, and `provenance.trust.citation_suitability`. The cost is straightforward for one-off discovery at `$0.03` per paid MPP search, but every search requires an MPP-capable payment client.

### Compliance Triage For Product And Operations Teams

A compliance team can use semantic search when a product manager asks whether a workflow may be affected by federal regulations, but no one knows the exact citation. The team can issue focused `query` values, set `corpus: "regulations"` for CFR obligations, and raise `limit` toward 10 or 20 when recall matters. `results[].citation`, `title`, `snippet`, and `score` create a candidate list that can be assigned to counsel, mapped to controls, or passed into citation resolution for full text.

This supports faster issue intake and scoping. For example, a lender, fintech, health-tech vendor, logistics company, or government contractor can turn plain-language internal questions into citation-backed review queues. The important controls are logging the echoed `query` and `corpus`, preserving `provenance`, and avoiding automated yes/no compliance decisions from snippets alone. Formal policy changes still need attorney or compliance-owner review, especially where `citation_suitability` does not include `legal_filing`.

### Source-Grounded Legal RAG And Agent Retrieval

A retrieval system can use `/api/mpp/search` as the first stage in a legal RAG pipeline. The agent sends a user question as `query`, chooses `corpus` based on the task, caps `limit` to the number of sources it can afford to inspect, and uses `results[].citation` as the join key for follow-up citation-resolution or document-fetch steps. `results[].score` can drive reranking, while `results[].snippet` can help decide whether to spend more calls retrieving full text.

For businesses building legal assistants, this endpoint is valuable because it returns legal citations and provenance rather than generic web pages. The system should store `query`, `corpus`, `total`, result citations, snippets, URLs, and the `provenance` object alongside any generated answer. Limitations include the example-derived search schema, canary statutory coverage, and the need to keep legal disclaimers visible to the model or reviewer. Per-request pricing also means high-volume chat systems should cache repeated searches and set budget limits in the surrounding payment workflow.

### Regulatory Intake And Ticket Routing

Support, risk, or policy teams can use the endpoint to route inbound questions to the right subject-matter queue. A complaint like "my mortgage servicer changed escrow notices" or an internal question like "what federal rules mention adverse action notices?" can become a `query`; the returned `results[].citation`, `title`, and `snippet` identify candidate topic areas and agencies without requiring the intake agent to know legal citations.

Automation can tag tickets with CFR or U.S. Code citations, attach source URLs, and prioritize items when high-scoring results match known regulated processes. The main prerequisite is a taxonomy that maps citations or title ranges to internal owners. The main compliance concern is over-routing based on weak matches: scores are relevance signals, not legal conclusions, so low-confidence or high-impact tickets should go to manual review.

### Due Diligence And Policy Gap Scanning

A legal, risk, or corporate-development team can search broad concepts across `corpus: "all"` during diligence, vendor review, or new-market assessment. Queries can describe operational areas such as consumer reporting, mortgage servicing, food labeling, transportation safety, procurement restrictions, or records retention. The result set provides citations, snippets, and source provenance that help analysts build an initial issue list.

The endpoint enables decisions about where to spend deeper review time: which citations deserve full-text resolution, which policies need owner interviews, and which issues need outside counsel. It is especially useful early in a project when the team is trying to find the legal terrain rather than prove final compliance. The limitation is coverage and authority: canary U.S. Code results may be incomplete, eCFR results are not official CFR editions, and formal diligence should preserve official artifacts and reviewer notes.

### Legal Content Monitoring Seeds

Content teams, policy analysts, and government-affairs staff can use semantic search to discover stable citation seeds for recurring monitoring. A first pass with a domain-specific `query` and a higher `limit` can produce relevant `results[].citation` values; those citations can later feed exact citation resolution or Federal Register change tracking workflows. `results[].title` and `snippet` help humans decide which seeds are actually on topic.

This is useful for businesses that need watchlists around product obligations, agency rules, or statutory themes but do not already have a citation inventory. The endpoint itself does not alert on changes and does not return recent change events; it only finds likely legal sources. A complete monitoring workflow needs a separate scheduler, storage of selected citations, change tracking, and review thresholds.

### Filing Readiness And Citation Suitability Screening

Before a team relies on an automated answer in a memo, customer communication, or regulatory filing draft, it can run the underlying issue through search and inspect provenance on the returned corpus. `trust.disclaimer_code`, `trust.citation_suitability`, `official_artifact_url`, and `currency.as_of` provide a machine-readable screen for whether the source is suitable for research only, reference use, or legal filing use.

The business value is governance. A drafting assistant can prevent unsupported citations from entering a filing packet unless the provenance indicates `legal_filing` suitability or a reviewer has explicitly approved the source. The endpoint cannot certify legal sufficiency by itself, and the search response may only carry corpus-level provenance rather than per-result provenance, so final filing workflows should resolve exact citations and preserve official source artifacts.
