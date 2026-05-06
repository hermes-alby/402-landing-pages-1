# OpenRouter: Multi-Model Chat Completions API Uses

## What This Endpoint Group Does

This endpoint group sends OpenAI-compatible chat-completion requests through OpenRouter's unified model router. A caller provides conversation messages and a selected `model`, fallback `models`, or routing preferences, then receives assistant output, tool calls, finish status, token usage, model identity, and cost metadata where available.

For the MPP catalog, this group is represented by one paid MPP endpoint that wraps OpenRouter chat completions. This research used public documentation and local catalog snapshots only; no paid calls were made, no OpenRouter API key was used, and no Tempo payment or wallet flow was exercised.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/chat/completions` | Create a chat completion through OpenRouter's multi-model router. The corresponding direct OpenRouter provider path is `/api/v1/chat/completions`. | `messages`, `model`, `models`, `provider`, `tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `reasoning`, `stream`, `temperature`, `top_p`, `max_completion_tokens`, `metadata`, `session_id`, `user` | `id`, `created`, `model`, `choices`, `choices[].finish_reason`, `choices[].message.content`, `choices[].message.tool_calls`, `usage.prompt_tokens`, `usage.completion_tokens`, `usage.total_tokens`, `usage.cost`, `usage.cost_details`, `service_tier` |

## Field Notes

### Inputs

The required body field is `messages`, a role-tagged conversation array using roles such as `system`, `developer`, `user`, `assistant`, and `tool`. Message content can be plain text or multimodal content parts, including text, image URLs, file data or references, audio input, and video input where the selected model and provider support them.

Model selection can be explicit with `model`, fallback-oriented with `models`, or shaped with `provider` preferences. Provider controls include fallback behavior, provider allow/ignore/order lists, price ceilings, sorting by price/throughput/latency, data-collection policy, ZDR preference, quantization filters, and a `require_parameters` option for filtering to providers that support requested parameters.

Generation behavior is controlled with common parameters such as `temperature`, `top_p`, `max_completion_tokens`, `stop`, `seed`, log-probability options, penalties, and `reasoning`. Structured and workflow outputs use `response_format`, including JSON mode or JSON schema when supported. Tool workflows use OpenAI-style `tools`, `tool_choice`, and `parallel_tool_calls`, plus OpenRouter server tools such as `openrouter:datetime`, `openrouter:image_generation`, `openrouter:experimental__search_models`, `openrouter:web_fetch`, and `openrouter:web_search`.

Direct OpenRouter calls require an `Authorization: Bearer <OPENROUTER_API_KEY>` header, and the quickstart documents optional `HTTP-Referer` and `X-OpenRouter-Title` attribution headers. The MPP feed lists Tempo session payment and dynamic pricing, but does not document whether MPP callers still send OpenRouter-style authorization or use only MPP payment/session headers.

### Outputs

The response is a chat completion object with `id`, `created`, `object`, `model`, `system_fingerprint`, `service_tier`, `choices`, and `usage`. Each choice includes an index, `finish_reason`, optional log probabilities, and an assistant `message` that can contain generated content, tool calls, reasoning text, refusals, audio data or transcript, and generated images where supported.

Usage fields include `prompt_tokens`, `completion_tokens`, `total_tokens`, and detailed prompt or completion token breakdowns for cached, audio, video, or reasoning tokens when available. Cost fields include `usage.cost` and `usage.cost_details` with upstream prompt and completion cost components, but exact MPP charge calculation was not verified because no paid request was made.

Streaming mode is enabled with `stream: true`. The docs describe Server-Sent Events for streaming output and note that full usage details are always returned, while streaming errors can arrive after generation has started as SSE events with a top-level error and a choice ending in `finish_reason: "error"`.

### Important Constraints Or Gaps

Model support varies by selected model and upstream provider. Parameters, tool calling, structured output, input/output modalities, context length, moderation rules, price, latency, and retention behavior should be checked against the Models API fields such as `supported_parameters`, `architecture`, `pricing`, and provider metadata before relying on a workflow.

Outputs require validation before automated action. Structured JSON can be requested, but business logic should still validate schemas, reject unsafe tool arguments, handle refusals, and account for `finish_reason` values such as `length`, `content_filter`, `tool_calls`, and `error`.

MPP streaming and payment details remain unknown. The catalog identifies a dynamic Tempo session payment wrapper for `/v1/chat/completions`, but the exact MPP handshake, preflight quote behavior, streaming compatibility, and interaction with OpenRouter auth headers were not exercised.

Sensitive data and compliance review are needed before production use. Requests can include user content, files, images, audio, video, location hints for web search, user identifiers, and metadata; provider routing may send data to different upstream providers unless restricted with provider preferences such as `data_collection`, `zdr`, `only`, or `ignore`.

## Use Cases

### Model-Agnostic App Prototyping And Fallback Routing

A developer building a chat, coding, support, or document assistant can integrate once with `/v1/chat/completions` and test many model families by changing `model`, passing a fallback `models` list, or using `provider` routing. The most important fields are `messages`, `model` or `models`, `provider.allow_fallbacks`, `provider.sort`, and optional latency, throughput, or price preferences.

The returned `model`, `choices[].finish_reason`, and `usage` fields show which model served the request, whether it completed normally, and how much work it consumed. That makes the endpoint valuable for product teams that want rapid model comparison and resilient fallback behavior without building separate integrations for each upstream provider.

### Structured Extraction And Classification

A business can use this endpoint to turn messy text, emails, support tickets, contracts, or product descriptions into normalized JSON for review queues, CRM enrichment, compliance triage, or analytics. The fields that matter are `messages` for the extraction instructions and source text, `response_format` for JSON mode or JSON schema, `temperature` or `seed` for repeatability, and `max_completion_tokens` for bounding response size.

The useful returned data is `choices[].message.content`, plus `finish_reason` and token usage. The output should be parsed and validated against the target schema before it updates systems of record, because model output can be incomplete, refused, filtered, or malformed despite structured-output controls.

### Multimodal Document And Image Analysis

Teams can send message content with text plus image URLs, file data, audio, or video inputs to models that support the needed modalities. Practical examples include invoice review, screenshot QA, claims intake, product image inspection, slide summarization, and extracting fields from PDFs after a parser has prepared the input.

The key inputs are `messages[].content[]` multimodal parts, model selection, `plugins` such as file parsing where supported, and `response_format` if the result needs to be machine-readable. The response content, refusal fields, and token details help decide whether the asset was understood, whether more human review is needed, and how expensive the analysis was.

### Agent Tool Calling And Server Tools

Agent builders can expose application functions through `tools`, force or allow tool use with `tool_choice`, and let capable models make multiple calls with `parallel_tool_calls`. OpenRouter also documents server tools for date/time, image generation, model search, web fetch, and web search, which can reduce the amount of infrastructure the caller has to host.

The valuable response fields are `choices[].message.tool_calls`, `tool_call_id`, and later assistant content after tool results are supplied. This is useful for support automation, workflow copilots, internal operations agents, and research agents, but every tool argument should be validated and authorized before execution.

### Cost-Aware Model Evaluation And Procurement

Engineering and procurement teams can run controlled prompts across different models or provider routes to compare quality, latency preferences, token use, and cost. Useful inputs include `model`, `models`, `provider.max_price`, `provider.sort`, `provider.only`, `provider.ignore`, `provider.require_parameters`, `metadata`, and `session_id` for grouping evaluation runs.

The returned `model`, `usage.total_tokens`, `usage.cost`, `usage.cost_details`, `service_tier`, and finish status help teams estimate production spend and choose routing policies. The Models API pricing fields are also needed because costs vary by model, provider, modality, caching, and tokenization; the MPP wrapper's dynamic price behavior still needs direct verification.

### Live Research With Web Search And Fetch

Research tools can combine a reasoning-capable model with `openrouter:web_search` or `openrouter:web_fetch` to answer questions using current public web material. The fields that matter include the server tool `type`, engine selection, `allowed_domains`, `blocked_domains` or excluded domains, `max_results`, `max_total_results`, `max_content_tokens`, and approximate user location only when location bias is appropriate.

The response can contain synthesized findings, tool calls, and usage/cost metadata. This is valuable for analyst workflows, market scans, documentation lookups, and support investigations, but fetched content and model summaries should be cited, checked, and constrained to approved domains when accuracy or compliance matters.

### Streaming Chat UX And Incident Handling

Consumer chat products and internal copilots can use `stream: true` to render partial responses as tokens arrive, improving perceived latency and making long outputs easier to follow. Important fields are `stream`, `stream_options`, `messages`, selected model or provider route, and observability fields such as `metadata`, `trace`, and `session_id`.

Streaming clients must handle normal chunks, final completion state, and mid-stream errors. OpenRouter documents that some errors after generation starts can arrive as SSE data with a top-level error and `finish_reason: "error"`, so incident handling should capture partial output, display a clear failure state, and decide whether to retry with fallback routing.
