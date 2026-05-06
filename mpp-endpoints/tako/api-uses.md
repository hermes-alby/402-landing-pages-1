# Tako API Uses

## Service Summary

Tako is an AI data visualization and research platform that turns natural-language questions and structured data into cited visual knowledge cards, embeddable charts, and reports. The MPP service is first-party at `https://tako.com` and lets agents use Tako without signup or API keys by paying per request through the Machine Payments Protocol.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Knowledge Card Search And Deep Research | 5 | Fast and deep natural-language data search that returns cited cards, answers, embeds, images, methodology, and async/streaming progress. | [knowledge-card-search-and-deep-research.md](api-uses/knowledge-card-search-and-deep-research.md) |
| Research Report Generation | 2 | Async generation of longer research memos/reports from a configured query. | [research-report-generation.md](api-uses/research-report-generation.md) |
| User Data Visualization | 1 | Charting caller-supplied inline CSV into an embeddable card. | [user-data-visualization.md](api-uses/user-data-visualization.md) |
| Structured Chart Authoring And Editing | 2 | Direct ThinViz card creation from components and prompt-based edits to existing charts. | [structured-chart-authoring-and-editing.md](api-uses/structured-chart-authoring-and-editing.md) |

## Highest-Value Uses

The strongest uses are workflows that need sourced data visuals rather than plain text: market and company comparisons, macroeconomic explainers, sports or election data cards, customer-facing embedded analytics, analyst research triage, and generated briefing memos. Tako is especially valuable when `sources`, `methodologies`, `description`, `answer`, `embed_url`, and `visualization_data` let a user inspect and reuse the evidence behind an answer.

## Personal Use Opportunities

Personal users can use Tako to create quick charts from CSV exports, compare public data such as prices or economic indicators, prepare meeting/interview briefings, build data-backed blog visuals, or generate a research memo for a complex topic. The MPP path is useful for occasional use because it avoids direct account setup, API keys, credit purchases, and monthly plans.

## Business Use Opportunities

Businesses can embed Tako into research agents, analyst copilots, sales and strategy workflows, customer-facing dashboards, generative presentation tools, and report-generation pipelines. The practical business value is not only the answer but the reusable artifacts: card ids, embed URLs, static images, source citations, methodology notes, and structured visualization data. Production systems should add caching, review, receipt tracking, idempotency keys, and cost controls.

## Endpoint Group Summaries

### Knowledge Card Search And Deep Research

This group covers fast search, async deep search, streaming deep research, and related status polling. It is the core Tako use case: ask a natural-language question and get cited visual knowledge cards plus answer text. See [api-uses/knowledge-card-search-and-deep-research.md](api-uses/knowledge-card-search-and-deep-research.md).

### Research Report Generation

This group turns a report query into a longer async memo/report. It is best for high-value questions that need more than a single card and can tolerate a 10-30 minute workflow. See [api-uses/research-report-generation.md](api-uses/research-report-generation.md).

### User Data Visualization

This group charts caller-supplied CSV rather than searching Tako's graph. It is useful for quick spreadsheet visualization, bounded embedded analytics, and analyst charting workflows. See [api-uses/user-data-visualization.md](api-uses/user-data-visualization.md).

### Structured Chart Authoring And Editing

This group is for applications that already know their chart structure or need to revise an existing chart. ThinViz creation uses explicit components; chart editing uses `pub_id` plus a prompt. See [api-uses/structured-chart-authoring-and-editing.md](api-uses/structured-chart-authoring-and-editing.md).

## Field And Data Themes

Natural-language fields drive intent: `query`, `knowledge_search_request.inputs.text`, `config.query`, and chart-edit `prompt`. Chart reuse centers on identifiers and presentation fields: `card_id`, `pub_id`, `embed_url`, `image_url`, `webpage_url`, `visualization_data`, and `embed_mode`. Evidence and trust come from `sources`, `methodologies`, descriptions, timestamps where present, and source attribution. Operational fields such as `task_id`, `report_id`, `thread_id`, status fields, SSE events, MPP receipts, and idempotency keys govern async and paid workflows.
