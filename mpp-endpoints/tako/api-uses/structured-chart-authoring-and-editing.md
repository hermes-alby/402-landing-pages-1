# Tako: Structured Chart Authoring And Editing API Uses

## What This Endpoint Group Does

This group creates and edits charts directly. `/api/mpp/v1/thinviz/create` accepts explicit ThinViz component definitions, while `/api/mpp/v1/charts/edit` modifies an existing chart/card from a `pub_id` and natural-language prompt.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/mpp/v1/thinviz/create` | Create an embeddable ThinViz card from structured components. | `components`, `title`, `description`, `source`, `height`, `postmessage_embed`, `normalize_currencies` | `card_id`, `embed_url`, `embed_mode` |
| POST | `/api/mpp/v1/charts/edit` | Edit an existing chart with a prompt. | `pub_id`, `prompt` | `card_id`, `embed_url`, `visualization_data` |

## Field Notes

### Inputs

For ThinViz creation, `components` is required and follows the public `CreateCardRequest` schema. Optional fields include `title`, `description`, `source`, `height`, `postmessage_embed`, and `normalize_currencies`. For chart editing, `pub_id` identifies the existing chart and `prompt` describes the requested change.

### Outputs

The expected outputs are chart/card identifiers and embed URLs. ThinViz may return `embed_mode` based on whether `postmessage_embed` is used. Chart editing likely returns updated chart data or a new embeddable card, but the exact response schema is not published.

### Important Constraints Or Gaps

The full ThinViz schema is large and should be read from `tako-thinviz-schema.json` for implementation. Supported edit operations, whether edits mutate or clone charts, and full response schemas are not documented.

## Use Cases

### Programmatic Chart Publishing

A developer can use `thinviz/create` when the application already has clean structured data and knows exactly which visual components it wants. `components`, `title`, `description`, and `source` allow a generated chart to carry both visual structure and attribution.

For a business, this supports automated chart publishing from internal pipelines, customer reports, or generated presentation systems. The lower per-request price makes it suitable for high-volume chart creation compared with full search or report generation, but the app must own data preparation and schema correctness.

### Embedded Analytics With Controlled Rendering

`postmessage_embed` lets an iframe receive visualization data from the parent page rather than embedding data in the URL, and `height` helps control layout. A personal project can use this to keep charts responsive in a blog, dashboard, or portfolio site.

For businesses, this is useful in white-labeled analytics where the host application controls data delivery and page layout. Teams should validate iframe messaging and avoid leaking sensitive data through embeds.

### Currency-Normalized Comparisons

`normalize_currencies` can request conversion to a target ISO 4217 currency, with methodology added according to the schema description. A person comparing expenses, investments, or travel prices across currencies can create a clearer visual.

A business can use this for multinational revenue, pricing, supplier costs, or market comparisons. The value comes from combining chart creation with methodology notes, but teams should verify conversion assumptions and historical rates for financial reporting.

### Fast Chart Iteration For Editors

`charts/edit` lets a user refine an existing chart with prompts such as changing a title, adjusting labeling, or making the visual clearer. `pub_id` anchors the edit to a known chart, and `prompt` captures the desired change without manually editing component JSON.

For a business, this can power editorial workflows where analysts or marketers improve generated charts before publication. The gap is that supported edit operations and mutation semantics are not public, so production workflows should treat edits as reviewable drafts.

### Chart Reuse Across Reports And Apps

Once a chart has an identifier and `embed_url`, it can be reused in reports, apps, docs, or dashboards. A personal user can maintain a small library of reusable cards; a business can store card ids alongside internal report metadata.

This is valuable when the same chart needs to appear in multiple contexts. The application should track provenance, source labels, and whether an edited chart supersedes or merely branches from the original.
