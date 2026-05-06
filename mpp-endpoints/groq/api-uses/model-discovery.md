# Groq: Model Discovery API Uses

## What This Endpoint Group Does

The model-discovery endpoint lists available Groq models through the MPP wrapper. The upstream Groq API exposes model listing at `GET /openai/v1/models`; the MPP wrapper exposes it as `POST /groq/models` with no required parameters and a fixed MPP fee. The response is expected to return a list object with model records containing identifiers such as `data[].id`, ownership metadata such as `data[].owned_by`, activity state, and `data[].context_window` in the official example.

This endpoint does not generate content. Its value is upstream of inference: choosing valid model ids, keeping configuration current, and avoiding failed chat requests caused by stale or incompatible models.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/groq/models` | List available Groq models through the MPP wrapper. | No documented request fields; MPP example sends `{}`. | `object`, `data[].id`, `data[].object`, `data[].created`, `data[].owned_by`, `data[].active`, `data[].context_window`, `data[].public_apps` |

## Field Notes

### Inputs

There are no documented query parameters, path parameters, or request-body fields. The MPP markdown shows a `POST` request with an empty JSON body, while the upstream Groq API uses `GET /openai/v1/models`.

### Outputs

`data[].id` is the most important field because chat-completion requests need a valid `model`. `data[].context_window` helps decide whether a model can accept long prompts. `data[].active` can prevent choosing unavailable models. `data[].owned_by` helps users understand whether a model comes from Meta, OpenAI, Google, Hugging Face, or another model owner. The official supported-model page contains richer operational metadata, including speed, token prices, rate limits, context windows, max completion tokens, and file-size limits, but the official model-list response example does not guarantee all of those fields are returned by the API.

### Important Constraints Or Gaps

The MPP OpenAPI does not define a 200 response schema, so response fields were derived from official Groq API docs. The MPP wrapper uses `POST`, but the provider API uses `GET`. The model-list endpoint should not be treated as a complete pricing or rate-limit catalog unless the actual wrapper response includes those fields; callers may need to combine it with the official models docs or a maintained local model policy.

Because the endpoint itself costs money through MPP, automated polling should be rate-limited and cached. No paid request was made, so the exact wrapper response shape and headers remain unverified.

## Use Cases

### Dynamic Model Picker Before Chat Requests

An individual can list models before sending a chat request and choose a valid `data[].id` instead of guessing from an old blog post or code sample. A business can put the same lookup behind a model picker in an internal tool, allowing developers or support teams to select from currently active models without redeploying configuration. `data[].active` and `data[].context_window` are the fields that make this more than a static dropdown.

The value is fewer failed inference requests and more transparent model choice. A workflow can reject inactive models, warn when the prompt is too large for `context_window`, and store the selected `id` with each chat request for auditability. The limitation is that the official example does not include token prices or rate-limit fields in the model-list response, so price-aware selection may require joining against the official models page or a locally maintained pricing artifact.

### Model Migration And Deprecation Hygiene

A person maintaining scripts can use model discovery to check whether their configured model ids still appear active before a scheduled job or personal assistant runs. A business can run a periodic governance check against service configuration, prompt templates, and product defaults, flagging any model id that is missing, inactive, preview-only, or inconsistent with policy. The endpoint contributes the live `data[].id` and `data[].active` signals; the official models page contributes production/preview/deprecated context.

This use case reduces operational surprises from model churn. It is especially useful because Groq's docs separate production models, preview models, and deprecated models. The gap is that the model-list endpoint may not expose preview/deprecated status directly, so the governance workflow should keep an explicit allowlist of production-approved model ids and use the endpoint to confirm availability rather than infer production suitability from presence alone.

### Context-Window Based Routing

An individual can choose a model with enough `context_window` for a long prompt, document excerpt, or conversation history. A business can automatically route short support messages to a smaller low-cost model while sending long contracts, incident reports, or research packets to models with larger context windows. `data[].context_window` is the key output, and the chat endpoint's `usage.prompt_tokens` can be used after inference to improve future routing thresholds.

The decision enabled here is practical: truncate, summarize first, ask the user for a smaller input, or choose a larger-context model. The limitation is that context window alone is not enough. The workflow also needs max completion token limits, cost, latency, and task quality expectations from the official models docs or local evaluation results.

### Provider And Model-Owner Transparency

A person comparing AI providers can use `data[].owned_by` and `data[].id` to understand which model families are available through Groq at a given time. A business can surface model-owner metadata in compliance reviews, vendor-risk questionnaires, or customer-facing AI transparency pages. This is useful when model origin matters for procurement, customer disclosure, or internal policy.

The endpoint does not by itself provide license terms, training data details, or compliance certifications. It only gives high-level model identity and ownership metadata in the official example. Teams that need legal or procurement-grade evidence should link model ids to official model cards, vendor terms, and internal approvals.

### Cost-Aware Model Catalog Maintenance

An individual can avoid sending every task to the largest model by first maintaining a small model catalog based on currently available model ids. A business can combine `data[].id` with the official model docs' price, speed, rate-limit, and context-window tables to build a cost-aware routing policy: cheap fast models for simple classification, stronger models for complex reasoning, and preview models only in evaluation environments.

The model-list endpoint supplies the live identity layer, while pricing and speed come from docs or a maintained catalog. This supports decisions like "use `llama-3.1-8b-instant` for low-risk summaries" or "reserve higher-output models for tasks that need them." The limitation is freshness and cost: repeatedly calling a paid MPP model-list endpoint just to refresh a static catalog is wasteful, so results should be cached and refreshed intentionally.
