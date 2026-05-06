# Replicate API Uses

## Service Summary

Replicate provides API access to public and private machine-learning models for image, video, audio, language, vision, transcription, and other AI workflows. The MPP wrapper exposes a smaller pay-per-request surface for browsing public models, inspecting one model, running a public model, and retrieving prediction results. The wrapper is most useful when an agent or user wants one-off model access without directly managing a Replicate account, billing setup, or API token.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Model Discovery And Selection | 2 | Browse candidate models, inspect metadata and schemas, and decide which model is appropriate before paying for inference. | [`api-uses/model-discovery-and-selection.md`](api-uses/model-discovery-and-selection.md) |
| Model Inference And Result Polling | 2 | Run a selected model, receive fast outputs directly, or poll by prediction ID for longer jobs. | [`api-uses/model-inference-and-result-polling.md`](api-uses/model-inference-and-result-polling.md) |

## Highest-Value Uses

The highest-value workflow is model-backed creative or data enrichment where the caller first checks model metadata/schema, then pays for exactly one inference request. This can support image generation, video jobs, audio transcription, summarization, classification, or other model-specific tasks, as long as the selected model's `openapi_schema` confirms the needed inputs and expected outputs.

The second high-value workflow is production prototyping. A team can compare models by owner/name, `is_official`, `run_count`, schema, output quality, status, errors, and timing metrics before deciding whether to build a direct Replicate integration.

## Personal Use Opportunities

Personal users can generate one-off assets, test models, transcribe or enrich personal files, and keep a curated shortlist of models for repeated use. The important fields are model metadata before the run and prediction `output`, `status`, `error`, `urls.web`, and `metrics` after the run.

## Business Use Opportunities

Businesses can use the wrapper for early-stage automation and controlled paid inference: creative-asset generation, content enrichment, model benchmarking, human-review workflows, and internal approved-model catalogs. For production use, teams still need model-specific price checks, licensing review, data-retention controls, and a plan for saving output files before provider-side cleanup.

## Endpoint Group Summaries

### Model Discovery And Selection

This group covers `POST /replicate/list-models` and `POST /replicate/get-model`. It helps users and agents choose a model before spending money. Outputs such as `description`, `is_official`, `run_count`, `license_url`, `default_example`, and `latest_version.openapi_schema` support compatibility checks, provenance review, schema-driven UI generation, and curated model catalogs. Full details: [`api-uses/model-discovery-and-selection.md`](api-uses/model-discovery-and-selection.md).

### Model Inference And Result Polling

This group covers `POST /replicate/run` and `POST /replicate/get-prediction`. It submits model-specific inputs and retrieves generated outputs, pending status, errors, logs, timing metrics, and URLs. It is useful for short synchronous generations and longer background jobs where a prediction ID must be polled. Full details: [`api-uses/model-inference-and-result-polling.md`](api-uses/model-inference-and-result-polling.md).

## Field And Data Themes

Model-selection fields identify the model and its credibility: `owner`, `name`, `description`, `is_official`, `run_count`, `github_url`, `paper_url`, `license_url`, and `latest_version.openapi_schema`.

Inference fields drive workflow state and result handling: `input`, `id`, `status`, `output`, `error`, `logs`, `metrics.predict_time`, `metrics.total_time`, `urls.web`, `urls.get`, `urls.stream`, `created_at`, `started_at`, `completed_at`, and `data_removed`.
