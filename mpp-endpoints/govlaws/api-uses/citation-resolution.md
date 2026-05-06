# GovLaws: Citation Resolution API Uses

## What This Endpoint Group Does

Citation Resolution is a point lookup workflow for callers that already know the CFR or U.S. Code citation they want to inspect. The endpoint accepts one `citation` query parameter, such as `12 CFR 1026.43` or `15 U.S.C. 1681`, and returns the resolved legal text with enough metadata for an agent or application to decide how the result may be used.

The returned value is not just text. It includes the canonical citation, section title, agency when known, source system and source URL, retrieval and freshness timestamps, recent change context, and a provenance object. The provenance fields are especially important because they let software distinguish current operational text from an official legal edition, preserve upstream source links, and branch on machine-readable trust signals before citing the result in user-facing research, compliance work, or a legal filing workflow.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `GET` | `/api/mpp/resolve` | Resolve one CFR or U.S. Code citation through the no-account MPP lane. The first request returns a `402 Payment Required` challenge; a paid replay returns the resolved citation data and a payment receipt. | Required query parameter: `citation` string. Examples include `12 CFR 1026.43` and `15 U.S.C. 1681`. | `citation`, `title`, `agency`, `text`, `source.system`, `source.url`, `source.retrieved_at`, `freshness.up_to_date_as_of`, `freshness.status`, `recent_changes`, and `provenance`. |

## Field Notes

### Inputs

The only endpoint-specific input is `citation`, a required query string value. It should identify a CFR section or a U.S. Code section precisely enough for GovLaws to resolve it. This makes the endpoint best for citation hydration, verification, and current-text retrieval after another workflow has already found or extracted a candidate citation.

The MPP lane does not require a pre-created GovLaws account or API key for the initial request. A successful data response does require the MPP flow: request the endpoint, receive a `402 Payment Required` challenge, pay through an MPP client, then replay with payment proof. The published payment metadata for this endpoint is Tempo MPP, amount `50000` with `6` decimals, described as `$0.05` per resolve request.

### Outputs

The core content fields are `citation`, `title`, `agency`, and `text`. Together, these support canonicalizing the user-provided citation, displaying the section heading, associating the section with an agency when available, and placing the current legal text into a research, retrieval, or compliance workflow.

The source and freshness fields are the main operational controls. `source.system` identifies the upstream system, with documented values including `ecfr`, `govinfo`, `federal_register`, and `olrc_uscode`. `source.url`, `provenance.official_artifact_url`, `provenance.govinfo_source_url`, and `provenance.ecfr_url` preserve upstream source links. `source.retrieved_at`, `freshness.up_to_date_as_of`, `freshness.status`, `provenance.currency.as_of`, and `provenance.currency.effective_date` let an application show when the record was retrieved, current through, or effective.

The provenance object supports trust-aware automation. Important fields include `provenance.is_official_edition`, `provenance.disclaimer`, `provenance.source_system`, `provenance.currency.reflects_current_text`, `provenance.official_edition.is_official`, and `provenance.trust`. The documented `trust.disclaimer_code` values are `ECFR_UNOFFICIAL`, `GOVINFO_OFFICIAL`, `FR_NOTICE`, and `USCODE_CURRENT`; `trust.citation_suitability` may include `research`, `reference`, or `legal_filing`. Agents should use these machine-readable trust fields instead of trying to parse the human-readable disclaimer.

### Important Constraints Or Gaps

This artifact is based on public docs and saved source snapshots only. No paid GovLaws endpoint was called, no payment was submitted, no account was created, and no mutation route was used.

The endpoint is for exact citation resolution, not broad discovery. If the caller does not know the citation, the separate semantic search workflow is a better first step. If the caller needs ongoing monitoring by agency or citation prefix, the recent-changes workflow may be a better fit, although this resolve response can include `recent_changes` for the resolved citation.

The MPP OpenAPI route publishes examples rather than a complete resolved-citation response schema. The exact `recent_changes` item shape and the exact payment-proof replay header semantics are not fully specified in the source snapshots. Integrations should tolerate additional response fields, missing optional source URLs, `agency: null` for some U.S. Code records, `404` citation-not-found responses, and `400` errors for missing or invalid citation parameters.

Trust metadata is not the same as legal advice. eCFR current text is operationally current but not itself the official legal edition of the CFR. Public docs say filing-oriented workflows should require `provenance.trust.citation_suitability` to include `legal_filing`; eCFR current text and non-positive-law U.S. Code canary records may be suitable for research or reference but not for legal filing without additional official-source review.

## Use Cases

### Source-Grounded Legal Assistant Answers

A personal legal-research assistant or business support bot can use Citation Resolution after a user asks about a known citation, for example a CFR section listed in a mortgage disclosure, workplace policy, or compliance checklist. The workflow is: extract the citation, call `/api/mpp/resolve?citation=...`, then answer using `citation`, `title`, `text`, `source.url`, `freshness.up_to_date_as_of`, and `provenance`. The assistant can show the source URL and current-through timestamp beside the answer, reducing the risk of an unsupported summary.

For businesses, the same pattern supports internal compliance chat, customer-support escalation, or retrieval-augmented generation over regulatory content. The main automation is a trust gate: if `provenance.trust.citation_suitability` includes only `research` and `reference`, the assistant can label the answer as research/reference material and route filing-sensitive questions to counsel or to an official artifact. Costs are predictable at `$0.05` per resolved citation, but high-volume chat workflows need spend controls and caching.

### Compliance Obligation Refresh

A regulated company can maintain an obligation library keyed by exact citations, then periodically resolve each citation to refresh the current text and metadata. The workflow compares stored text and timestamps against returned `text`, `freshness.up_to_date_as_of`, `source.retrieved_at`, `provenance.currency.as_of`, and `recent_changes`. If the text changed or recent changes are present, the system can open a review task for the control owner and attach `source.url` plus provenance links as evidence.

This is strongest when the business already has a known citation inventory, such as consumer finance rules, workplace safety requirements, tax rules, or healthcare privacy obligations. It is weaker as a standalone monitoring system because the endpoint resolves one citation at a time and costs `$0.05` per call. Teams should batch or cache on their side, avoid unnecessary repeated paid resolves, and use the separate change-tracking endpoint when they need broad agency or citation-prefix monitoring.

### Document Citation QA

A law firm, compliance team, publisher, or individual researcher can scan a memo, policy, website, or contract for cited legal authorities, then resolve each extracted citation to validate that it still resolves and that the displayed title/source match the document's claim. The returned `citation` can normalize formatting, `title` and `agency` can confirm the subject area, and `text` can be checked against quoted excerpts or paraphrases in the document.

The workflow can flag three practical issues: unresolved citations through `404`, stale or unsupported source context through freshness/provenance fields, and citation-use mismatch through `provenance.trust.citation_suitability`. A document destined for public legal filing should not rely on a resolved record unless the trust metadata supports `legal_filing` or the reviewer separately verifies the official artifact. The endpoint does not replace Bluebook-style legal citation review or jurisdiction-specific legal analysis.

### Filing Suitability Gate

Before a compliance filing, comment letter, formal legal memo, or regulatory submission cites a resolved CFR or U.S. Code section, an application can require a machine-readable provenance check. The workflow resolves the citation, preserves `source.url` and `provenance.official_artifact_url`, then branches on `provenance.trust.disclaimer_code`, `provenance.trust.citation_suitability`, `provenance.official_edition.is_official`, and `provenance.is_official_edition`.

If `citation_suitability` includes `legal_filing`, the system can allow the citation to proceed with the official artifact attached for human review. If it returns `ECFR_UNOFFICIAL` or another research/reference-only signal, the system can stop automated filing use, request counsel review, or fetch the official source outside this MPP endpoint. This is valuable because the endpoint returns current text, but current operational text and official filing-grade authority are not always the same thing.

### Customer Support And Case Triage

Support teams in regulated businesses can use Citation Resolution when a customer, auditor, or internal stakeholder references a specific rule. A mortgage servicer, fintech, benefits administrator, or HR compliance team could resolve the citation, review `text` and `title`, and use `agency`, `source.system`, `freshness.status`, and `recent_changes` to decide whether the case needs policy review, legal escalation, or a standard response.

The personal version is similar: an individual who receives a notice citing a federal rule can resolve the citation to read the current section and see where the text came from. The limitation is that the returned text may be dense and source suitability may be research-only. Any workflow that affects rights, benefits, penalties, or legal strategy should treat the result as source-backed research input, not as final legal advice.

### RAG Corpus Hygiene And Citation Hydration

AI retrieval systems often store short snippets, old PDF extracts, or search results that contain citations but not full current text. Citation Resolution can hydrate those citations at answer time or during indexing. The returned `text` becomes the chunk to embed or quote, while `citation`, `title`, `source.url`, `freshness.up_to_date_as_of`, and `provenance` become metadata for ranking, filtering, and final-answer citations.

The fields enable useful automated decisions: exclude records whose `freshness.status` is not current, prefer records with official artifacts for high-stakes workflows, and preserve `provenance.source_system` so evaluators can distinguish eCFR, GovInfo, Federal Register, and OLRC U.S. Code records. Costs and latency matter because each unique citation hydration is a paid point lookup; production RAG systems should cache resolved citations with their freshness timestamp and refresh policy.

### Audit Evidence Pack Assembly

Internal audit, governance, risk, and compliance teams can assemble evidence packs for a control by resolving each supporting citation and storing the returned text, source URLs, retrieval timestamp, freshness timestamp, and provenance object. The workflow creates a traceable record: what rule text was used, when it was current through, what upstream source supplied it, and whether the source was suitable for research, reference, or legal filing.

This is useful for businesses preparing for regulator exams, SOC-style internal controls, model governance reviews, or policy-change signoff. The endpoint does not itself create an immutable audit record, so the caller must store the response, payment receipt if relevant, and any human approval steps in its own system. Reviewers should also preserve official artifact URLs when available and document any human verification performed outside GovLaws.
