# Mistral AI: Model Discovery And Capability Selection API Uses

## What This Endpoint Group Does

This endpoint group lists available Mistral models and their metadata. It is a preflight endpoint for deciding which model to use in chat, embeddings, moderation, vision, OCR, audio, fine-tuning, or other workflows.

The MPP wrapper exposes `POST /mistral/models` with an empty JSON body. The official Mistral provider endpoint is `GET /v1/models` and includes optional `provider` and `model` query filters. This wrapper/provider method and parameter drift is preserved as a field gap.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mistral/models` | List available models with metadata and capability flags. | Empty JSON body through the wrapper; official provider docs also list optional `provider` and `model` filters. | `data[].id`, `data[].capabilities`, `data[].max_context_length`, `data[].aliases`, `data[].deprecation`, `data[].deprecation_replacement_model`, `data[].default_model_temperature`, `data[].type`, `data[].job`, `data[].root`, `data[].archived` |

## Field Notes

### Inputs

The MPP wrapper docs say no parameters are required and show `{}` as the body. The official provider OpenAPI documents optional query parameters `provider` and `model`, but these are not documented by the wrapper.

### Outputs

The most important fields are model IDs, capability booleans, context length, aliases, deprecation metadata, default temperature, and model type. Fine-tuned model cards add `job`, `root`, and `archived`.

Capability flags include `completion_chat`, `function_calling`, `completion_fim`, `fine_tuning`, `vision`, `ocr`, `classification`, `moderation`, `audio`, and `audio_transcription`.

### Important Constraints Or Gaps

Model listing is metadata, not pricing. Workflows need to join it with pricing artifacts before making cost decisions. Availability may also vary by direct provider account, deployment, region, or wrapper support.

Because the wrapper charges a fee for model listing, applications should cache results for an appropriate interval rather than calling the endpoint before every model request.

## Use Cases

### Model Preflight For Chat Workflows

A developer can call model listing before offering model choices in a personal writing tool or coding assistant. A business can use it to ensure a selected model supports `completion_chat`, `function_calling`, `vision`, or sufficient `max_context_length` before sending traffic to chat generation. The key fields are `data[].id`, `data[].capabilities`, `data[].max_context_length`, `data[].aliases`, and `data[].default_model_temperature`.

The output enables a workflow to hide incompatible models, choose defaults, and prevent avoidable request failures. Since pricing is not returned, cost-aware routing must join against pricing data from the existing pricing artifact.

### Deprecation And Migration Monitoring

A person maintaining a small app can periodically check `data[].deprecation` and `data[].deprecation_replacement_model` to know when a model alias should change. A business can automate model lifecycle reviews and create migration tickets when a production model is approaching deprecation.

This is valuable because model IDs and aliases change over time, and silent deprecation can break or degrade applications. The endpoint response does not include application usage, so teams must join model metadata with their own logs to identify affected workflows.

### Capability-Based Routing

An application can route requests based on capability flags: vision tasks require `vision`, moderation workflows require `moderation` or `classification`, audio workflows require `audio` or `audio_transcription`, and code completion may require `completion_fim`. The fields `data[].capabilities.*`, `data[].id`, and `data[].type` drive routing tables.

For a business, this supports a model broker that chooses a valid model for each feature rather than hard-coding model IDs into every service. The limitation is that capability flags do not encode quality, latency, price, or organization-specific policy; those need separate telemetry and configuration.

### Context-Length-Aware Prompt Planning

A personal researcher can choose a model with enough `max_context_length` before summarizing long notes. A business can select models for long contract review, knowledge-base synthesis, or multi-document support workflows based on `data[].max_context_length`.

The model metadata helps decide whether to chunk, summarize, retrieve, or send a full context. It does not return token counts for a specific prompt; callers still need tokenization or conservative budgeting before submitting large requests.

### Fine-Tuned Model Inventory

Where fine-tuned models are available, `data[].type`, `data[].job`, `data[].root`, and `data[].archived` help identify custom models and their lineage. A person might use this to distinguish a personal custom model from base models. A business can use it for governance, ownership review, and cleanup of archived models.

The output supports audits and deployment dashboards, but the wrapper docs do not confirm whether fine-tuned model records are exposed through MPP for all users. It also does not include training dataset metadata, evaluation metrics, or storage cost details.

### UI Model Picker And Feature Flags

A product can populate a model picker from `data[].id`, `data[].name`, `data[].description`, `data[].aliases`, and `data[].capabilities`. A personal tool can use the same fields to show only simple choices such as "chat", "vision", or "moderation" models.

This reduces stale hard-coded lists and makes model selection more transparent. The UI should cache results and gracefully handle empty descriptions or missing names because those fields are nullable in the official schema.
