# GovLaws API Uses

## Service Summary

GovLaws is a legal-data API for AI agents, retrieval systems, legal research, and compliance workflows that need current U.S. federal regulation context with source and provenance metadata. The assigned MPP surface exposes three paid no-account endpoints on `https://govlaws.ai`: exact citation resolution, semantic legal search, and recent regulatory change lookup.

The strongest opportunity is not generic legal Q&A. It is source-grounded legal workflow automation: find likely CFR or U.S. Code sources, resolve known citations to current text, monitor Federal Register changes, preserve source URLs and freshness timestamps, and branch on machine-readable provenance before using the result in research, compliance, audit, support, or filing-adjacent workflows. This synthesis is based on local artifacts and public docs/source metadata only; no paid GovLaws endpoints were called.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Citation Resolution | 1 | Resolve a known CFR or U.S. Code citation into current legal text, source links, freshness, recent-change context, and trust metadata. | [api-uses/citation-resolution.md](api-uses/citation-resolution.md) |
| Semantic Legal Search | 1 | Search regulations, canary U.S. Code coverage, or both by natural-language query and get ranked citation snippets for follow-up review. | [api-uses/semantic-legal-search.md](api-uses/semantic-legal-search.md) |
| Regulatory Change Tracking | 1 | Poll recent Federal Register change events by agency, citation prefix, or lookback window to trigger review and monitoring workflows. | [api-uses/regulatory-change-tracking.md](api-uses/regulatory-change-tracking.md) |

## Highest-Value Uses

1. Legal RAG with provenance gates: use semantic search to find candidate citations, resolve selected citations for full text, and require `provenance.trust.citation_suitability` before showing answers, drafting summaries, or escalating to a filing workflow.

2. Compliance watchlist monitoring: poll `/api/mpp/changes` for watched agencies or CFR prefixes, deduplicate by `document_number` and `detected_at`, then resolve affected citations before opening policy, procedure, training, or product review tasks.

3. Citation QA and document review: extract citations from memos, policies, customer notices, or knowledge-base content, resolve each one, and flag unresolved citations, stale source context, mismatched section titles, or research-only trust signals.

4. Obligation-library refresh: maintain an internal citation inventory, periodically resolve each citation, compare returned text and freshness fields against stored records, and attach source URLs plus provenance as audit evidence.

5. Regulatory intake triage: turn plain-language product, support, or risk questions into citation-backed candidate lists, then route high-impact issues to the right legal, compliance, or policy owner.

## Personal Use Opportunities

- Plain-language legal research starting point: search a question such as a mortgage, credit reporting, benefits, employment, or grant-compliance issue and inspect returned citations, snippets, and source URLs.
- Understanding cited notices or policies: resolve a CFR or U.S. Code citation found in a letter, contract, agency notice, or workplace policy to read the current source text and see where it came from.
- Focused rule monitoring: run low-frequency agency or citation-prefix checks for rules affecting a small business, professional license, regulated job function, or advocacy topic.
- Research note hygiene: preserve `citation`, `title`, `source.url`, `freshness.up_to_date_as_of`, and provenance fields beside summaries so later review can distinguish source-backed notes from unsupported interpretation.

## Business Use Opportunities

- Compliance operations: map controls to citations, monitor recent changes, resolve affected rules, and create review tickets with Federal Register links, effective dates, source timestamps, and trust metadata.
- Legal and policy assistant products: provide citation-backed search and answer workflows while gating high-stakes output on provenance, official-artifact links, and human review.
- Product and support triage: convert user complaints, internal launch questions, and regulatory references into candidate CFR or U.S. Code citations for escalation.
- GRC and audit tooling: assemble evidence packs showing what legal text was used, when it was current through, which source system supplied it, and whether it was suitable for research, reference, or filing-oriented use.
- Government-affairs monitoring: build regulator-centered digests from `agency`, `change_type`, `effective_date`, `summary`, and source URLs, then separate proposed rules from final rules and amendments.

## Endpoint Group Summaries

### Citation Resolution

`GET /api/mpp/resolve` is the point-lookup endpoint for workflows that already know the legal citation. It accepts required `citation`, costs a published $0.05 through Tempo MPP metadata (`amount: "50000"`, 6 decimals), and returns current text plus source, freshness, recent changes, and provenance fields. It is best for citation hydration, obligation refresh, document citation QA, support triage, and filing-suitability gates after a citation has already been identified. See [api-uses/citation-resolution.md](api-uses/citation-resolution.md).

### Semantic Legal Search

`POST /api/mpp/search` is the discovery endpoint for workflows that do not yet know the exact source. It accepts `query`, optional `limit` from 1 to 20, and `corpus` values `regulations`, `statutes`, or `all`; it costs a published $0.03 through Tempo MPP metadata (`amount: "30000"`, 6 decimals). The response returns ranked citation snippets and corpus provenance, making it useful for legal RAG source discovery, compliance intake, due diligence scoping, and watchlist seeding. See [api-uses/semantic-legal-search.md](api-uses/semantic-legal-search.md).

### Regulatory Change Tracking

`GET /api/mpp/changes` is the monitoring endpoint for recent Federal Register activity. It accepts optional `agency`, `citation`, and `days` filters, with `days` defaulting to 30 and capped at 90; it costs a published $0.03 through Tempo MPP metadata (`amount: "30000"`, 6 decimals). The response returns change events with citations, titles, change types, effective dates, detection timestamps, document numbers, source URLs, summaries, and per-event provenance. See [api-uses/regulatory-change-tracking.md](api-uses/regulatory-change-tracking.md).

## Field And Data Themes

- Legal identifiers: `citation`, `results[].citation`, `changes[].citation`, `document_number`, source URLs, `official_artifact_url`, `govinfo_source_url`, and `ecfr_url` are the main handles for follow-up review and evidence storage.
- Discovery and scope controls: `query`, `limit`, `corpus`, `agency`, `citation`, and `days` decide whether the workflow is searching broadly, resolving exactly, or monitoring a regulatory slice.
- Content outputs: resolved `text`, search `snippet`, section `title`, `agency`, change `summary`, and `change_type` are the fields most likely to feed user-facing summaries or internal review queues.
- Freshness and timing: `source.retrieved_at`, `freshness.up_to_date_as_of`, `provenance.currency.as_of`, `effective_date`, `detected_at`, `period.from`, and `period.to` should be preserved for audit and alerting.
- Trust and authority: `provenance.source_system`, `is_official_edition`, `official_edition`, `trust.disclaimer_code`, and `trust.citation_suitability` are central because eCFR current text, Federal Register notices, GovInfo artifacts, and U.S. Code canary records have different authority profiles.
- Payment metadata: `/api/mpp/resolve` is published at $0.05; `/api/mpp/search` and `/api/mpp/changes` are published at $0.03. Local OpenAPI and MPP feed metadata list Tempo MPP amounts with 6 decimals.
