# Tako: User Data Visualization API Uses

## What This Endpoint Group Does

This group charts data supplied by the caller. Unlike search endpoints, `/api/mpp/v1/visualize` does not search Tako's knowledge graph; it uses inline CSV or file ids plus a natural-language visualization instruction to produce a chart/card.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/mpp/v1/visualize` | Visualize caller-supplied data. | `csv`, `file_ids`, `query`, `viz_component_type` | `card_id`, `embed_url`, `visualization_data` |

## Field Notes

### Inputs

`csv` contains one or more inline CSV strings. `query` tells Tako how to chart the data. `viz_component_type` can steer the chart type with examples including `bar`, `timeseries`, `pie`, `scatter`, `table`, `heatmap`, `histogram`, `boxplot`, `choropleth`, `treemap`, and `waterfall`. `file_ids` are documented, but the agent guide says file upload is not yet available via MPP, so inline CSV is the reliable MPP path.

### Outputs

The useful outputs are `card_id`, `embed_url`, and `visualization_data`. They allow a caller to identify, embed, or custom-render the generated visualization.

### Important Constraints Or Gaps

CSV size, row limits, parsing behavior, and full response schema are not published. Because the caller supplies the data, source quality, privacy, and permission checks are the caller's responsibility.

## Use Cases

### Quick Personal Charting From Spreadsheets

A person can paste a small CSV export and ask for a line chart, bar chart, or table. The `query` field carries the intent, while `viz_component_type` can keep the output in the desired visual form.

This is useful for personal budgeting, fitness tracking, household energy use, portfolio snapshots, or class projects where a polished embeddable chart is more useful than manually configuring chart software. The user should avoid sending sensitive private data unless they understand Tako's handling terms.

### Customer-Facing Ad Hoc Analytics

A SaaS app can pass a small CSV slice and a visualization instruction to create an embeddable chart for a customer. For example, a CRM can visualize monthly pipeline by stage or a finance app can chart cash balance over time.

The business value is fast embedded analytics without building every chart type internally. The limitation is that this endpoint is best for bounded datasets because MPP file upload is not available and CSV limits are not public.

### Analyst Workflow Acceleration

An analyst can export cleaned data from SQL or a spreadsheet, send it as inline CSV, and get a chart card with `embed_url` for sharing. `visualization_data` can also support downstream custom rendering if the team has its own charting UI.

For businesses, this reduces repetitive chart setup for recurring exploratory analysis. It should not replace data validation: the analyst still owns the correctness of the CSV, joins, filters, and definitions.

### Geographic Or Category Comparisons

If the CSV includes geographic or categorical fields, the caller can ask for a choropleth, treemap, waterfall, or grouped bar chart. This helps a person compare state-level indicators, neighborhood data, or personal travel costs.

A business can use the same pattern for territory planning, regional sales performance, customer segmentation, or inventory mix. The endpoint fields make this practical because `viz_component_type` can nudge the visual form, but the caller must supply clean location/category columns.
