# Tako: Research Report Generation API Uses

## What This Endpoint Group Does

This group generates longer-form async research reports. The caller pays for `/api/mpp/v1/reports/generate`, receives a `report_id`, and polls `/api/mpp/v1/reports/status` until the report is ready.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/mpp/v1/reports/generate` | Starts report generation. | `report_type`, `title`, `config.query` | `report_id` |
| GET | `/api/mpp/v1/reports/status` | Polls report generation status. | `report_id`, receipt auth | `status`, `report` |

## Field Notes

### Inputs

`config.query` is the central input because it defines the report scope. `title` controls the report label, and `report_type` has an example value of `memo`; the complete enum is not published.

### Outputs

`report_id` connects the paid creation request to status polling. The status endpoint may return `status` and a final `report`, but the report object/string schema is not publicly specified.

### Important Constraints Or Gaps

The guide says reports take 10 to 30 minutes. The endpoint costs 5.500000 USD per generation request in the live MPP manifest. The output schema, export formats, progress fields, retention behavior, and full `report_type` enum are not published.

## Use Cases

### Investment Or Competitive Research Memos

A person can request a memo such as "NVIDIA competitive landscape and market position" and come back later with `report_id` polling. The value is in moving beyond a single chart toward a more complete narrative that can incorporate multiple data points, sources, and analysis.

A business strategy or finance team can use the same workflow for repeatable competitive briefs, market-entry scans, supplier analysis, or earnings-prep research. The endpoint is expensive enough that teams should reserve it for questions that need a full memo, using fast search first when possible.

### Briefing Packs For Meetings

An individual can generate a report before a board meeting, investor call, job interview, or client conversation. `title` and `config.query` make the request easy to align with a specific meeting topic.

For a business, scheduled agents can generate briefing packs for account reviews, leadership updates, or sales opportunities. The reports should be reviewed before distribution because the final schema and citation layout are not published, and the workflow may take up to 30 minutes.

### Long-Form Research Backlogs

A researcher can queue a small number of high-priority topics and poll later rather than staying in an interactive search loop. This is useful for complex questions where a single knowledge card would not provide enough context.

A business can use report generation as an analyst-assist step: collect candidate topics, fast-search each one, then promote only high-value topics to full reports. The important automation is not the report alone but the surrounding triage, cost control, and review process.

### Content And Presentation Drafting

Someone preparing a blog post, slide deck, or briefing note can use a generated memo as the factual starting point, then extract charts or cited points into the final artifact. The report query should be precise enough to avoid broad unfocused output.

For a company, report generation can support thought leadership, research newsletters, product marketing, and customer-facing data stories. Human editing remains necessary for brand tone, legal review, and source verification.
