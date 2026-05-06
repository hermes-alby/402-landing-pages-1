# DeepSeek: Model Discovery API Uses

## What This Endpoint Group Does

This group covers the MPP endpoint that lists available DeepSeek models. It has no meaningful request fields and returns a list object containing model records with `id`, `object`, and `owned_by`. The MPP wrapper exposes it as a paid `POST /deepseek/list-models`, while DeepSeek's upstream API reference documents the equivalent function as `GET /models`.

The endpoint is operational metadata rather than text generation. Its value is in validating model IDs, choosing model configuration, and detecting model availability changes before paying for generation endpoints.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepseek/list-models` | List available DeepSeek models through MPP payment. | Empty JSON body. | `object`, `data[].id`, `data[].object`, `data[].owned_by`. |

## Field Notes

### Inputs

No parameters are required. The MPP docs show an empty JSON body and `Content-Type: application/json`. The upstream provider path is a GET with no request body.

### Outputs

`object` identifies the response as a list. `data[].id` is the practical field: it is the model identifier to pass into chat or FIM calls. `data[].owned_by` attributes model ownership, and `data[].object` identifies each item as a model.

### Important Constraints Or Gaps

The MPP list endpoint costs a fixed `3000` amount with 6 decimals in the Tempo asset listed by the wrapper metadata. The wrapper docs do not state whether the returned models exactly match upstream DeepSeek's current list or whether aliases/filtering are applied. Because this research used public GET/docs only, the endpoint was not called.

## Use Cases

### Model ID Validation Before Generation

A person experimenting with DeepSeek through MPP can list models before a chat or FIM request to avoid paying for a generation call with an obsolete or misspelled model ID. The useful output is `data[].id`, which can be compared against a local configuration file.

A business can use the same check in deployment pipelines for AI features. If the configured model is no longer present, the pipeline can block a release, fall back to an approved model, or alert an owner. This is especially valuable because DeepSeek docs show model alias drift and planned deprecations.

### Runtime Model Catalog For Agent Configuration

A personal agent can refresh model options and present only currently available DeepSeek IDs in its settings UI. `owned_by` is simple provenance metadata, while `id` is the field that drives the selectable model list.

A business agent platform can cache the list and map approved model IDs to product tiers or cost policies. The endpoint does not provide prices, context windows, or capabilities, so it should be joined with pricing/docs metadata for complete selection logic. Since the MPP list call is itself paid, aggressive polling is not a good fit.

### Detecting Model Availability Drift

A developer can periodically compare saved model lists against the current response to detect additions, removals, or alias changes. The expected current upstream examples include `deepseek-v4-flash` and `deepseek-v4-pro`; any difference would be worth reviewing before changing production prompts.

A business can incorporate this into model governance. When a model disappears or a new model appears, owners can review evaluation baselines, cost assumptions, and compatibility before allowing it in production. The limitation is that this endpoint gives identity and ownership only, not quality, latency, pricing, or safety characteristics.

### Lightweight Provider Health Signal

A person can use model-list availability as a low-impact signal that the wrapper and upstream provider path are reachable before attempting more expensive generation. It is not a full health check, but it can catch obvious payment, wrapper, or provider availability problems.

A business can use the same endpoint during incident triage to distinguish configuration/model-catalog issues from prompt-specific generation failures. Because this MPP call has a fixed cost and still requires payment, it should be used sparingly and not as high-frequency monitoring.
