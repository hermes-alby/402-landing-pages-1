# Replicate: Model Inference And Result Polling API Uses

## What This Endpoint Group Does

This endpoint group runs a selected public Replicate model and retrieves the resulting prediction. `run` accepts the model owner/name and model-specific input. The wrapper says it blocks synchronously up to 60 seconds and returns output directly when the model finishes, or a prediction ID when the run takes longer. `get-prediction` retrieves status and output for a prediction ID.

The core value is an inference lifecycle: submit structured input, receive generated media/text/data or a pending prediction record, then poll until the output, error, logs, metrics, and URLs are available.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/replicate/run` | Run a public model through the MPP wrapper. | `model_owner`, `model_name`, `input` | Prediction `id`, `status`, `output`, `error`, `metrics`, result URLs, timestamps. |
| POST | `/replicate/get-prediction` | Retrieve a pending or completed prediction. | `prediction_id` | Prediction `status`, `output`, `logs`, `error`, `metrics`, `urls`, `data_removed`. |

## Field Notes

### Inputs

`model_owner` and `model_name` select the target public model. `input` is the model-specific input object, so its fields must come from a model page or `latest_version.openapi_schema`; it might include prompts, image URLs, audio URLs, seed values, output format, number of outputs, or other model-specific settings. `prediction_id` is returned by a run that needs follow-up polling.

### Outputs

The most important outputs are `output`, `status`, `error`, `logs`, `metrics.predict_time`, `metrics.total_time`, `urls.web`, `urls.get`, `urls.stream`, `created_at`, `started_at`, `completed_at`, and `data_removed`. `status` drives control flow, `output` carries the generated result, `error` and `logs` support debugging, metrics support cost/performance analysis, and URLs support sharing, streaming, or follow-up retrieval.

### Important Constraints Or Gaps

Replicate model outputs can be any JSON-serializable value and file outputs are represented as HTTPS URLs. Replicate docs say API-created input, output, and logs are removed after an hour by default, so durable workflows must save needed files and metadata promptly. The MPP wrapper response schema is not fully documented, and model-specific fields are unknowable until a model is selected.

## Use Cases

### Generate Creative Assets On Demand

A personal user can run an image, video, music, or voice model from a simple agent flow by passing the selected model and input fields such as a prompt, media URL, aspect ratio, seed, or output format when the chosen model supports them. The `output` field returns the generated asset or asset URLs, while `status` and `prediction_id` allow the agent to continue polling if generation takes more than the synchronous window.

For a business, this supports ad variants, social media drafts, product mockups, explainer visuals, or localized creative tests. `metrics` and timestamps help compare model latency, while `urls.web` can be attached to review tickets for human approval. The workflow must preserve outputs quickly because Replicate removes API-created output data after an hour by default.

### Run Long Media Jobs Without Holding A User Session Open

Some models, especially video, upscaling, or complex image workflows, may exceed 60 seconds. A user-facing app can call `run`, show a pending state when a prediction ID is returned, and then call `get-prediction` until `status` reaches `succeeded`, `failed`, `canceled`, or `aborted`.

For businesses, this makes background queues practical without direct Replicate account management in every integration. The fields `created_at`, `started_at`, `completed_at`, `metrics.total_time`, and `error` can feed job status pages, retry policies, and customer notifications. Polling should be rate-aware because Replicate documents rate limits and `429` throttle responses.

### Prototype Model-Backed Product Features

A builder can wire a model into a prototype quickly: choose a model, submit a small `input`, receive `output`, and inspect `logs` and `error` when the result fails. Because the wrapper abstracts account setup and payment, this can be useful for a one-off experiment or agent-driven prototype.

In a business setting, product teams can compare candidate models for features such as image generation, transcription, classification, or structured extraction. By storing model name, version, input, output, status, and timing metrics, teams can evaluate quality and latency before committing to a direct provider integration. The main caveat is that serious production evaluation still needs model-specific pricing, terms, output retention, and safety review.

### Automate Content Enrichment For Existing Records

A personal knowledge workflow might run image captioning, audio transcription, translation, or summarization models against user-provided file URLs, then store the returned text or media URL back into notes. The `output` field is the enrichment payload; `error` and `logs` tell the agent when to ask for a different input or model.

For businesses, the same pattern can enrich support tickets, media libraries, product catalogs, or research databases. An operations pipeline can run a model, poll by `prediction_id`, and write completed outputs into a CMS, DAM, CRM, or warehouse. Because inputs may include file URLs or data URLs, privacy and data-governance review matters before submitting customer or proprietary content to third-party models.

### Monitor Cost And Performance Signals Per Model

The prediction response includes timing data such as `metrics.predict_time` and `metrics.total_time`, along with model and version identifiers. A personal user can use those fields to decide whether a model is too slow for casual use.

For a business, storing these fields across runs supports model benchmarking: which models succeed most often, which fail, which are slow, and which produce outputs that pass human review. The inventory does not expose exact final dollar cost in the prediction response, so timing metrics must be combined with Replicate pricing or MPP payment metadata for cost analysis.

### Human Review And Sharing Of Generated Results

`urls.web` gives a browser view of the prediction, and output files can be returned as HTTPS URLs. A user can send a generated result for review without copying raw JSON into a chat or document.

For companies, review links can be attached to approval workflows for brand, legal, or editorial review. The workflow should not assume links are durable forever; Replicate documents one-hour default removal of API-created input/output/log data, and output files may require authorization when fetched directly.
