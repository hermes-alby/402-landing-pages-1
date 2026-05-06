# Perplexity: Grounded Answer Generation API Uses

## What This Endpoint Group Does

This group covers Sonar chat completions through the MPP wrapper. It accepts a conversation, model choice, and search/output controls, then returns a generated answer with optional citations, source search results, images, related questions, and token/cost usage. Its main value is not just text generation; it is the combination of answer synthesis, source evidence, freshness controls, and structured-output controls.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/perplexity/chat` | Generate Sonar chat completions with real-time web grounding and citations. | `model`, `messages`, `response_format`, `web_search_options`, `search_domain_filter`, `search_recency_filter`, `return_images`, `return_related_questions`, `reasoning_effort` | `choices[].message.content`, `citations[]`, `search_results[]`, `images[]`, `related_questions[]`, `usage.cost.total_cost`, token counts |

## Field Notes

### Inputs

The required fields are `model` and `messages`. Model choices are `sonar`, `sonar-pro`, `sonar-deep-research`, and `sonar-reasoning-pro`. `messages` carries the actual task and context, with roles such as `system`, `user`, and `assistant`.

Search and freshness controls are the fields that make this endpoint operationally useful: `web_search_options.search_context_size`, `web_search_options.search_type`, `search_mode`, `search_domain_filter`, `search_language_filter`, `search_recency_filter`, date filters, and optional `user_location`. Output controls include `response_format` for JSON schema responses, `return_images`, `return_related_questions`, `reasoning_effort`, `temperature`, `top_p`, and `max_tokens`.

### Outputs

The central output is `choices[].message.content`. Evidence outputs include `citations[]` and `search_results[]` with titles, URLs, snippets, source type, publication dates, and last-updated dates. Optional enrichment outputs include `images[]` and `related_questions[]`. The `usage` object reports prompt, completion, total, citation, search-query, and reasoning token counts plus a cost breakdown, including `total_cost`.

### Important Constraints Or Gaps

The MPP OpenAPI does not define a detailed 200 response schema, so response fields are derived from official Perplexity OpenAPI. MPP docs do not list every official optional field, and this research did not make a paid call to verify passthrough behavior. Official Sonar rate limits are tier-based and model-specific; MPP wrapper limits may differ. Perplexity documents zero data retention for the Sonar API, but the MPP wrapper may still process payment/routing metadata.

## Use Cases

### Evidence-Backed Executive Briefings

A person could ask for a current briefing on a company, market, policy issue, or product category and receive a concise answer with `citations[]` and `search_results[]` that can be checked before acting. `search_recency_filter`, `search_domain_filter`, and `search_mode` keep the answer focused on current and trusted sources, while `related_questions[]` helps the user decide what to investigate next.

A business can automate daily or event-triggered briefings for leadership, sales, investor relations, or product strategy. The workflow can require structured JSON via `response_format`, store citations for auditability, and use `usage.cost.total_cost` to track the cost of each briefing. The limitation is that answer quality still depends on source availability and wrapper support for the chosen filters.

### Source-Scoped Competitive Monitoring

An individual tracking a product, employer, or investment can ask Sonar to summarize recent updates only from selected domains, such as official blogs, regulatory sites, or trusted news sources. `search_domain_filter`, date filters, and `search_recency_filter` make the result less noisy than open-ended search, while citations show which pages drove the conclusion.

For a business, the same fields can power competitive intelligence jobs: monitor competitor release notes, pricing pages, hiring pages, documentation, or partner announcements and produce structured deltas. `response_format` can force fields like `competitor`, `change_type`, `source_url`, and `confidence`. The endpoint is strongest when the monitored domains are public and crawlable; private dashboards or pages behind access controls are out of scope.

### Cited Support And Knowledge-Base Answers

A person can use the endpoint to answer questions against public docs by restricting `search_domain_filter` to official product documentation, then checking `citations[]` before following the guidance. `return_related_questions` can suggest follow-up checks before escalating a problem.

A support team can embed this into triage workflows to draft cited answers for agents, linking directly to official documentation pages. `language_preference` and `search_language_filter` can help localize answers when supported. The business should still review answers before sending them to customers, especially for billing, medical, legal, or operationally risky issues.

### Regulatory, Academic, Or SEC-Focused Research

For personal research, `search_mode` values such as `academic` or `sec` can narrow the answer to a more appropriate corpus. A user researching a public company, paper trail, or government topic can request a synthesized explanation with source dates and citations rather than manually scanning results.

Businesses can use this for compliance watchlists, investment research, procurement due diligence, or policy monitoring. `search_after_date_filter`, `search_before_date_filter`, `last_updated_*` fields, and `citations[]` support a repeatable research trail. The caveat is that generated summaries should not be treated as official filings or legal advice; downstream review and source verification remain necessary.

### Structured Market Or News Extraction

An individual can ask for current events or product comparisons in a fixed JSON shape using `response_format`, turning a web-grounded answer into sortable data. For example, a shopper could collect product names, prices, release dates, and cited URLs from public sources.

A business can use the same pattern for lightweight extraction pipelines: funding rounds, vendor changes, incident reports, launch announcements, or press coverage. `usage.cost` makes the workflow measurable, and `search_results[]` gives source evidence for each extraction. This is valuable when the target fields are visible in public pages; it is weaker when exact numeric fields require proprietary databases or authenticated portals.

### Cost-Aware Research Automation

The `usage` object lets a person or business observe token counts and cost components after each answer. A workflow can choose `sonar` versus `sonar-pro`, adjust `search_context_size`, or set `max_tokens` based on the importance of the task.

For companies running many automated research jobs, this enables budget-aware routing: use lower-cost settings for routine scans and higher-quality search/reasoning settings only when a change is detected or when a human requests deeper analysis. The MPP wrapper lists dynamic model-dependent pricing, so budgets should use actual returned cost data where available rather than only the estimate.
