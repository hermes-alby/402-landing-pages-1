# Parallel: Web Search And Source Discovery API Uses

## What This Endpoint Group Does

This group covers `POST /api/search`, the MPP wrapper for Parallel Search. It turns a natural-language `query` or a provider-style `objective` plus `search_queries` into ranked public web results with titles, URLs, publish dates when available, and dense excerpts suitable for downstream LLM or analyst review.

The endpoint is best used when the user needs to discover which sources matter before reading full pages. It is less appropriate when the URLs are already known; in that case, `POST /api/extract` is the more direct follow-up.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/search` | Search the public web through the MPP gateway. | `query`, `objective`, `search_queries`, `mode`, `session_id`, `client_model`, optional provider advanced settings. | `search_id`, ranked `results[].url`, `results[].title`, `results[].publish_date`, `results[].excerpts`, `warnings`, `usage`, `session_id`. |

## Field Notes

### Inputs

The MPP gateway documents a simplified `query` field and optional `mode`. It also says `objective + search_queries` can be used, matching the provider OpenAPI shape for `/v1/search`. Provider fields such as `max_chars_total`, `session_id`, `client_model`, and `advanced_settings` are documented upstream, but wrapper passthrough is not confirmed by a published MPP OpenAPI spec.

`session_id` matters when search is part of a larger multi-step workflow. A user can search first, extract later, and preserve context if the wrapper supports the provider session behavior.

### Outputs

The provider response includes `search_id`, ordered `results`, optional `warnings`, optional `usage`, and `session_id`. Each result can include `url`, `title`, `publish_date`, and `excerpts`. The excerpts are the main value field because they let an agent decide whether a page is worth opening, citing, extracting, or ignoring.

### Important Constraints Or Gaps

The gateway charges `$0.01` per search request and payment is final after confirmation. The gateway docs and schema use `one-shot` and `fast` modes, while the current provider OpenAPI uses `basic` and `advanced`. Treat mode selection as wrapper-specific unless confirmed.

Search results are web-derived and can be incomplete, stale, or wrong. Parallel's terms and docs emphasize that outputs should be independently reviewed for important decisions.

## Use Cases

### Fast Market Signal Triage

A person considering a career move, investment, or purchase can search for recent signals about a company, product category, or technology and get a short ranked set of pages with excerpts. The useful fields are `results[].url`, `results[].title`, `results[].publish_date`, and `results[].excerpts`; they help the person decide which sources are current enough to read and whether the topic deserves deeper research.

A business can use the same workflow to triage market changes before starting expensive analysis. For example, a product team can search for new regulatory guidance, competitor announcements, pricing changes, or customer complaints, then route only the strongest URLs to extraction or a research task. The limitation is that Search is discovery, not verification; high-impact decisions should follow up with extraction and source review.

### Source Discovery For Agent Tool Chains

An agent can use Search as the first step in a pipeline: issue a focused `objective`, receive candidate URLs and excerpts, select the best sources, and call Extract on those URLs. The fields that enrich the workflow are `session_id` for continuity, `results[].excerpts` for ranking relevance, and `publish_date` for freshness checks.

For a business agent, this supports repeatable research playbooks such as "find official sources and recent analysis before drafting a memo." Search reduces unnecessary full-page fetches and gives the workflow a transparent evidence list. The main missing dependency is deterministic source policy passthrough through the MPP wrapper; if a regulated workflow must include or exclude domains, confirm advanced settings before relying on it.

### Competitive And Pricing Watch

A person can search for prices, feature comparisons, or product changes before buying software or services. The endpoint does not return normalized prices, but excerpts can show where pricing pages, release notes, or comparison articles live.

A business can schedule or trigger searches for competitor names plus product categories, then pass found URLs into internal review queues. `search_queries` make the workflow more precise, while `results[].title` and excerpts support quick human triage. Because Search itself is not a monitor and the MPP catalog does not expose Parallel Monitor, freshness depends on when the search is run and whether the returned pages include reliable dates.

### Evidence Gathering For Sales And Customer Success

A seller or customer-success manager can search a prospect's company name plus terms like hiring, funding, product launch, security incident, expansion, or layoffs. The returned URLs and excerpts help decide whether outreach should reference a recent public signal.

For teams, this can enrich CRM notes before calls without building a direct Parallel billing relationship. The endpoint does not return structured company fields, contact data, or firmographics; it returns evidence pages. Workflows that need normalized lead scoring should combine Search with Extract or a separate enrichment system.

### Research QA And Citation Pre-Screening

A researcher can use Search to pre-screen whether a claim is supported by public sources before spending time reading pages. The `excerpts` field provides immediate context, while `publish_date` helps reject old material when recency matters.

Organizations can use the endpoint as a quality gate in content, policy, legal, or analyst workflows: require an agent to provide candidate sources before drafting. The limitation is that snippets are compressed and may omit context, so final citations should come from extracted or manually reviewed page content.
