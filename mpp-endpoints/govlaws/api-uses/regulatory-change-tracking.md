# GovLaws: Regulatory Change Tracking API Uses

## What This Endpoint Group Does

The Regulatory Change Tracking group is for asking what changed recently in a U.S. federal regulatory area. Instead of starting with a known legal text or a broad semantic query, a caller supplies optional monitoring filters - an `agency`, a CFR `citation` prefix, and/or a `days` lookback window - and receives Federal Register change events that GovLaws has detected for that slice.

The value is triage. The response identifies the changed citation, agency, rule title, change type, effective date, detection time, document number, source URL, optional summary, period boundaries, total event count, and per-event provenance. A workflow can use those fields to decide whether to alert a reviewer, open a compliance task, fetch the linked Federal Register document, resolve the current CFR text, update an internal watchlist, or suppress the event because it is only a proposed rule or correction.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `GET` | `/api/mpp/changes` | Paid no-account MPP route for recent Federal Register change events; provider analog is `GET /api/changes`. | Optional `agency`; optional CFR `citation` prefix; optional `days` integer from 1 to 90, default 30. | `changes[]` events with citation, title, `change_type`, `effective_date`, `detected_at`, agency, source, `document_number`, URL, summary, provenance; `period.from`; `period.to`; `total`. |

## Field Notes

### Inputs

`agency` narrows monitoring to an agency name or abbreviation such as `CFPB`. It is useful when a compliance owner is responsible for a regulator rather than a specific CFR part.

`citation` narrows monitoring to a CFR citation prefix such as `12 CFR 1026`. It is useful for product, policy, or legal teams that already maintain a list of watched regulatory parts or sections.

`days` controls the lookback window. The OpenAPI inventory documents it as optional, defaulting to 30, with a minimum of 1 and maximum of 90. There is no request body for this `GET` endpoint.

### Outputs

`changes[]` is the primary work queue. Each event can include `citation`, `title`, `change_type`, `effective_date`, `detected_at`, `agency`, `source`, `document_number`, `url`, `summary`, and `provenance`. The documented `change_type` values are `amendment`, `final_rule`, `proposed_rule`, and `correction`, which are directly useful for prioritization rules.

`period.from`, `period.to`, and `total` let the caller confirm what window was searched and whether the run found no events, one event, or a larger review batch. `detected_at` is useful for de-duplication between polling runs, while `effective_date` is useful for deadline and implementation planning.

`changes[].provenance` carries trust metadata. For Federal Register events, examples show `source_system: federal_register`, `trust.disclaimer_code: FR_NOTICE`, `citation_suitability` including `legal_filing`, `official_artifact_url`, and `currency.reflects_current_text: false` because a Federal Register notice is a point-in-time publication rather than current CFR text.

### Important Constraints Or Gaps

The MPP route costs `30000` Tempo pathUSD units with 6 decimals, published as $0.03 per request. A first request receives a `402 Payment Required` challenge; the successful data response requires payment proof replay. This artifact did not call the paid endpoint.

The route has a `ChangeEvent` schema for individual events, but no reusable top-level response component beyond examples. Consumers should preserve raw responses and tolerate additional fields.

The docs do not state whether an empty filter combination returns all recent changes for the default lookback or is rejected. High-signal production jobs should send at least `agency` or `citation`.

MPP users are not documented as receiving webhook subscriptions. Webhooks are account-lane Pro-plan control-plane features, so an MPP implementation should assume polling unless the operator separately uses the account lane.

Federal Register notices can be suitable source artifacts, but they do not by themselves prove the current operative regulatory text. Workflows that need current text should follow up with citation resolution or source review before changing controls, policies, filings, or customer-facing guidance.

## Use Cases

### Compliance Watchlist Polling

A regulated business can maintain a watchlist of CFR prefixes, such as lending, privacy, labor, or benefits rules, and call `/api/mpp/changes?citation=...&days=...` on a schedule. The workflow uses `changes[].citation`, `change_type`, `effective_date`, `detected_at`, `document_number`, `url`, and `total` to create review tickets only when new events appear. `detected_at` and `document_number` support de-duplication across runs, while `change_type` can route `final_rule` and `amendment` events ahead of `proposed_rule` events.

The automation should attach `changes[].url` and `changes[].provenance.official_artifact_url` to the ticket so a compliance reviewer can inspect the Federal Register source. At $0.03 per MPP request, narrow citation polling is cheap for occasional checks, but broad daily coverage across many citations can add up. The organization still needs a legal/compliance owner to interpret the event and decide whether policy, procedure, training, or system changes are required.

### Agency-Specific Regulatory Radar

A government-affairs or policy team can query by `agency`, for example `agency=CFPB&days=30`, to build a regulator-centered activity feed. The returned `changes[].agency`, `title`, `summary`, `change_type`, `effective_date`, and Federal Register `url` can populate an internal digest that separates proposed rules from final rules and highlights approaching effective dates.

This is useful for business planning because rulemaking activity often affects product roadmaps, lobbying strategy, customer notices, and compliance budgets. It is also useful personally for attorneys, consultants, journalists, or advocates who follow one regulator. The limitation is that agency naming and filter matching are not fully specified in the source docs, so consumers should test saved queries in a paid environment before relying on exact agency aliases.

### Effective-Date Deadline Tracking

Operations teams can use `effective_date` as the bridge from legal monitoring to execution. A workflow can poll for `final_rule` and `amendment` events, compare `effective_date` against today, and trigger calendar deadlines, implementation epics, or escalation when the date falls inside an internal lead-time threshold.

The endpoint provides the event and provenance, not a compliance checklist. Before automating operational changes, the team should read the linked `url`, verify `provenance.trust.citation_suitability`, and usually resolve the affected citation to inspect current text. `currency.reflects_current_text: false` on Federal Register notices is an important reminder that a notice is a publication event, not the full current CFR state.

### Vendor And Control Mapping Updates

A compliance platform, GRC tool, or legal knowledge base can map internal controls to CFR prefixes and use the endpoint to find when related rules have changed. `changes[].citation` links the event to control mappings; `title` and `summary` help describe the change; `source`, `document_number`, and source URLs preserve audit evidence; `provenance` records why the source can be trusted.

The business value is keeping control libraries and obligation inventories from going stale without manually scraping Federal Register pages. The prerequisite is a maintained mapping between internal obligations and CFR citations. The endpoint does not classify business impact, so the automation should create "review needed" states rather than marking controls compliant or noncompliant on its own.

### Personal Rule Monitoring For Small Operators

A small business owner, independent broker, benefits administrator, or grant recipient can use a focused citation or agency query to watch rules that affect their work without signing up for a subscription plan. For example, a mortgage broker could monitor `12 CFR 1026` and review any `final_rule`, `amendment`, or `correction` with its Federal Register `url` and `effective_date`.

MPP is a practical fit for infrequent checks because each request is pay-per-use. The user still needs an MPP-capable client and should not treat an event title or summary as legal advice. If a change appears material, the next action is to read the official source and involve qualified counsel or a domain expert.

### Agentic Research Triage

An AI research assistant can call the change endpoint before answering questions like "has anything changed recently for this CFR part?" It can use `period.from`, `period.to`, and `total` to state the searched window; use `changes[].citation`, `title`, `change_type`, and `effective_date` to summarize events; and include `url` or `official_artifact_url` so the user can verify the source.

The assistant should branch on `provenance.trust.disclaimer_code` and `citation_suitability` rather than parsing disclaimer prose. It should also disclose when the query only covered up to 90 days and when no event was returned. For current operative text, the assistant should follow the event with citation resolution or direct source inspection instead of inferring the final CFR language from the change feed alone.
