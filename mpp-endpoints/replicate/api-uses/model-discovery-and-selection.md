# Replicate: Model Discovery And Selection API Uses

## What This Endpoint Group Does

This endpoint group helps a user or agent decide which public Replicate model to use before spending money on inference. `list-models` provides paginated model browsing, and `get-model` retrieves detailed metadata for a specific model, including owner/name, description, visibility, official-maintenance signal, run count, source/paper/license links, cover image, default example, and latest-version schema when available.

The useful decision is not just "which model exists"; it is whether a model is credible, current enough, compatible with the required inputs, and appropriate for the workflow's licensing and provenance constraints.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/replicate/list-models` | Browse public Replicate models with wrapper pagination. | `cursor` | `next`, `previous`, `results[]` with model metadata. |
| POST | `/replicate/get-model` | Retrieve one model's detailed metadata. | `model_owner`, `model_name` | `url`, `owner`, `name`, `description`, `visibility`, `is_official`, `run_count`, `github_url`, `paper_url`, `license_url`, `default_example`, `latest_version.openapi_schema`. |

## Field Notes

### Inputs

`cursor` supports pagination in the wrapper list endpoint. `model_owner` and `model_name` identify a model namespace and model slug for detail lookup. The wrapper does not expose Replicate's provider-side `sort_by` or `sort_direction` parameters, so discovery appears constrained to the wrapper's pagination contract.

### Outputs

The strongest fields for decision-making are `description`, `is_official`, `run_count`, `github_url`, `paper_url`, `license_url`, `default_example`, and `latest_version.openapi_schema`. `run_count` is a demand/provenance signal, `is_official` indicates stable API and predictable pricing behavior in Replicate's docs, and `openapi_schema` is the key to knowing model-specific input and output fields before an inference request.

### Important Constraints Or Gaps

The MPP wrapper does not publish detailed response schemas, so the inventory uses Replicate's provider model schemas as the field reference. The exact wrapper pagination cursor format is not documented. `latest_version` is modeled as a generic object in the provider OpenAPI, so code using nested schema fields should tolerate missing or model-specific structure.

## Use Cases

### Preselect A Model Before A Paid Generation

A personal user trying to generate images, video clips, transcriptions, or text can browse available models and then inspect a candidate model before paying to run it. The useful fields are `description`, `run_count`, `is_official`, `default_example`, and `latest_version.openapi_schema`: together they show what the model does, whether it is widely used, whether it has a stable official interface, and which input fields are required.

For a business workflow, the same preselection step can happen inside an agent before it spends budget. A creative automation tool could list candidate models, fetch the top candidates' schemas, reject models without a required `prompt` or media input field, prefer official models when predictable pricing matters, and route only compatible model choices into the inference step.

### Validate Input Compatibility In A No-Code Or Agent Tool

Before exposing a model in a form builder, workflow engine, or chat-based agent, the system can call `get-model` and inspect `latest_version.openapi_schema`. That schema can drive dynamic form fields, validation, placeholder text, and required-field checks, reducing failed runs caused by missing or wrong input parameters.

For businesses, this matters when non-engineering teams run repeatable generation workflows. Marketing or support operations can be given a controlled interface that only asks for fields the selected model supports. The limitation is that schemas vary by model and may be absent or generic, so the application should fall back to manual review when `openapi_schema` is missing.

### Screen Models For Licensing And Provenance Review

Personal users may want to know whether a model has a source repository, paper, or license before using its output publicly. `github_url`, `paper_url`, and `license_url` are not a full compliance review, but they are useful first-pass signals.

For a business, these fields can trigger policy gates. A product team could require `license_url` or known official-model status before allowing generated assets into a commercial pipeline. Legal or procurement review can be routed only when a model lacks license metadata or when a paper/source URL suggests uncertain provenance.

### Build A Curated Internal Model Catalog

A person with recurring use cases can save a small list of known-good models with their owner/name, description, examples, and schema fields. This avoids re-discovering the same models and gives later personal agents a dependable shortlist.

In a company, the same data can back an approved model registry for creative, product, or data teams. `run_count` can help rank adoption, `is_official` can flag stable interfaces, `cover_image_url` and `default_example` can make the catalog understandable, and `latest_version.created_at` can support freshness review. The MPP list endpoint does not expose rich search filters, so maintaining a curated catalog may require repeated pagination and detail lookups.

### Compare Official And Community Model Tradeoffs

Replicate's official-model docs say official models have stable APIs and predictable input/output pricing. The `is_official` output lets a user choose between a potentially cheaper or specialized community model and a more predictable official model.

For a business, this supports budget and reliability policy. A production-facing feature might require official models, while an internal prototype can allow community models if `run_count`, examples, and schema are acceptable. The endpoint does not return complete price tables per model, so final cost estimates still need model page or pricing evidence.
