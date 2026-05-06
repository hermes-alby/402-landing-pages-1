# Anthropic: Claude Chat Completions API Uses

## What This Endpoint Group Does

This endpoint group lets a client send chat-style inputs to Claude and receive the next assistant response. The native Messages endpoint is the richer Claude API shape: it accepts model selection, conversation turns, top-level system instructions, text, image and document content blocks, tool definitions and tool results, prompt-cache controls, extended-thinking options, structured-output configuration, streaming, service-tier and inference-geo controls, then returns a Claude `Message` with generated content blocks, stop metadata, usage counts, and optional tool/citation/container details.

The OpenAI-compatible chat-completions endpoint serves the same practical purpose for teams that already use OpenAI SDK clients. It accepts OpenAI-style `messages`, `tools`, `functions`, `temperature`, `top_p`, `stop`, `stream`, `max_tokens` or `max_completion_tokens`, and returns an OpenAI-style object with `choices[]`, `message.content`, `message.tool_calls`, `finish_reason`, and token usage. Anthropic documents this compatibility layer as mainly for testing and model comparison; production use that needs Claude-specific features should prefer `/v1/messages`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/messages` | Create a native Claude assistant message from structured conversational input. | Required `model`, `messages`, `max_tokens`; optional `system`, `temperature`, `top_p`, `top_k`, `stop_sequences`, `stream`, `metadata.user_id`, `service_tier`, `inference_geo`, `cache_control`, `output_config.format`, `thinking`, `tool_choice`, `tools`, `container`, and text/image/document/tool content blocks. | `id`, `type: message`, `role: assistant`, generated `content[]` blocks, `model`, `stop_reason`, `stop_sequence`, `stop_details`, optional `container`, `usage` token/cache/server-tool counts, and error objects with `request_id`. |
| POST | `/v1/chat/completions` | Create a Claude response through Anthropic's OpenAI-compatible chat-completions shape. | Required `model`, `messages`; optional `max_tokens`, `max_completion_tokens`, `stream`, `stream_options`, `top_p`, `temperature`, `stop`, `parallel_tool_calls`, `n: 1`, `tools`, `functions`, and extra-body `thinking`. | OpenAI-style `id`, `object`, `created`, `model`, `choices[]` with assistant `message.content` or `message.tool_calls`, `finish_reason`, `usage.prompt_tokens`, `usage.completion_tokens`, `usage.total_tokens`, and compatibility error shape. |

## Field Notes

### Inputs

- `model` chooses the Claude model class and therefore capability, latency, context/output limits, price, and rate-limit bucket. The inventory examples include current model ids such as `claude-opus-4-7`, `claude-sonnet-4-6`, and `claude-haiku-4-5`.
- Native `/v1/messages` requires `max_tokens`; OpenAI-compatible `/v1/chat/completions` supports either `max_tokens` or `max_completion_tokens`. The native docs note that `max_tokens: 0` can pre-warm prompt cache without generating text.
- `messages` is the central input. Native Messages uses `user` and `assistant` turns with `content` as a string or typed content blocks. The OpenAI-compatible endpoint accepts `developer`, `system`, `user`, `assistant`, `tool`, and `function` roles, but system/developer messages are hoisted into a single initial system prompt.
- Native content blocks are the richest input surface: text, images by URL or base64, documents including PDFs or plain text, prior `tool_use`, and `tool_result` blocks. These let a workflow combine instructions, evidence, images, files, and tool feedback in one request.
- `system`, `temperature`, `top_p`, `top_k`, and stop fields shape style, determinism, and response boundaries. Lower-temperature settings are better for classification, extraction, and repeatable business workflows; more varied settings are useful for brainstorming or drafting.
- Native `tools`, `tool_choice`, `output_config.format`, and `thinking` support agentic workflows, structured output, and harder reasoning tasks. The OpenAI-compatible path supports tools/functions, but `strict` is ignored and detailed Claude thinking is not returned through the OpenAI SDK shape.
- `cache_control` and block-level cache markers matter for repeated large prompts, long documents, or stable policy/context bundles. The OpenAI-compatible endpoint does not support prompt caching.
- `metadata.user_id` is only an opaque abuse-monitoring identifier in native Messages; Anthropic warns not to include identifying details such as names, emails, or phone numbers.

### Outputs

- The primary value is the assistant response: native `content[]` blocks or OpenAI-style `choices[0].message.content`. Applications can show the text to a user, feed it into a draft, store it as analysis, or parse it as structured output when using native structured-output controls.
- Tool-call outputs are decision points for automation. Native `tool_use` blocks or OpenAI-compatible `message.tool_calls` tell an agent which external function to call next and with what JSON-like input.
- `citations` can connect generated text to documents, web/search results, pages, or content-block locations, which is important for reviewable summaries, research workflows, and regulated knowledge work.
- `stop_reason` or `finish_reason` indicates whether the model naturally completed, hit `max_tokens`, matched a stop sequence, requested tool use, paused, or refused. Callers should use this before assuming a response is final.
- Native `usage` separates `input_tokens`, `output_tokens`, cache creation/read tokens, service tier, inference geography, and server tool counts. OpenAI-compatible `usage` provides prompt, completion, and total token counts. These fields drive cost attribution, budget controls, rate-limit planning, and prompt-cache tuning.
- Error fields identify validation, auth, billing/payment, permission, request-size, rate-limit, timeout, overload, and API failures. `request_id` or `request-id` should be logged for debugging.

### Important Constraints Or Gaps

- These are MPP-wrapped paid endpoints at `https://anthropic.mpp.tempo.xyz`. The local MPP metadata says pricing is dynamic, uses Tempo session payment, and varies by model, but it does not expose a fixed amount or formula. No paid calls were made.
- Wrapper-specific authentication, payment-challenge headers, streaming behavior, beta-header handling, and exact error bodies are not documented in the local metadata. Anthropic first-party docs require API-key/version headers, but the wrapper may abstract some of that.
- Native Messages requests have a documented 32 MB request-size limit; long requests can also hit timeout or overload conditions. Large documents, image payloads, and many-turn chats need size controls.
- Rate and spend limits apply by usage tier and model class. Native usage fields should be monitored; prompt-cache reads are cheaper and for most models do not count toward input-token-per-minute limits, but cache creation still has cost and rate-limit impact.
- The OpenAI-compatible endpoint ignores many OpenAI fields, often silently: `logprobs`, `metadata`, `response_format`, `presence_penalty`, `frequency_penalty`, `seed`, `service_tier`, `audio`, `logit_bias`, `store`, `user`, `modalities`, `top_logprobs`, `reasoning_effort`, and `strict` on tools/functions. It always returns one choice.
- Model outputs can be wrong, stale, incomplete, unsafe for a requested domain, or blocked by policy. High-risk use cases such as legal, health, finance, employment, housing, insurance, admissions, and externally published professional media require appropriate human review, disclosure, and policy controls.

## Use Cases

### Personal Research And Document Understanding

A person can use native `/v1/messages` to ask Claude questions about a long PDF, contract, paper, manual, or image-heavy document. The request can include `messages[].content[]` document blocks, a task-specific `system` prompt, low `temperature`, and optional citation settings so the returned `content[]` includes an explanation grounded in cited pages or document locations.

The value is not just a summary; the returned answer, `citations`, `stop_reason`, and token `usage` let the user decide whether the response is complete, where claims came from, and whether another paid call is worth making. The workflow should preserve the original document, avoid sending sensitive files without approval, and keep human judgment in the loop for legal, medical, financial, or other consequential interpretation.

### Customer Support Drafting And Triage

A business support tool can send a customer's message history, account-safe context, internal policy snippets, and desired tone in `system` plus `messages`, then ask Claude to draft a reply, classify urgency, or propose next actions. Native structured output or tool definitions can ask for fields such as issue category, sentiment, escalation flag, refund eligibility, and a draft response; OpenAI-compatible `choices[0].message.content` can support teams already wired to OpenAI-style chat completions.

Returned text helps agents answer faster, while `tool_use` or `message.tool_calls` can route to CRM lookup, refund calculation, or ticket escalation. `usage` supports per-ticket cost tracking. Limitations include privacy handling for customer data, disclosure rules for customer-facing chatbots, hallucinated policy interpretations, and the need to review high-impact decisions before sending.

### Code Review, Debugging, And Developer Copilots

An individual developer or engineering team can send code snippets, error logs, repository context, and explicit review criteria to Claude, then receive explanations, patch suggestions, tests to add, or tool calls for further inspection. The native endpoint is useful when including large stable instructions or codebase context with `cache_control`, while the OpenAI-compatible endpoint helps evaluate Claude in an existing chat-completion harness.

The important fields are `messages[].content` for code and logs, `system` for repository conventions, `thinking` for harder debugging, `tools` for agentic file/test operations, and `stop_reason` to detect truncated answers. The returned content can drive a developer's next edit or automated test plan, but it should not be applied blindly; generated code still needs tests, security review, license awareness, and validation against the actual runtime.

### Structured Extraction From Unstructured Business Content

Operations, finance, sales, or legal teams can use native Messages to transform emails, transcripts, invoices, RFPs, call notes, or support conversations into structured records. The request can include text/document blocks and `output_config.format` or tool schemas that define fields such as vendor name, renewal date, contract obligations, invoice totals, risk flags, customer intent, or follow-up tasks.

The returned structured content can populate a CRM, ticket queue, spreadsheet, approval workflow, or analytics table, while token and cache usage support cost controls for batch-like processing. The main risk is treating extraction as authoritative: systems should retain source references, preserve parse failures, ask for citations where possible, and route low-confidence or high-risk records to humans.

### Agentic Workflow Planning And Tool Orchestration

An automation agent can give Claude a task, current state, available `tools`, and prior `tool_result` blocks, then let the model choose the next tool call. Native `tool_choice`, `tools[].input_schema`, `content[].tool_use`, and follow-up `tool_result` blocks support loops such as research collection, data enrichment, incident response, or internal workflow coordination. OpenAI-compatible `tools` and `message.tool_calls` make similar flows possible for clients built around OpenAI SDK semantics.

The returned tool name and input object are valuable because they convert natural-language intent into a bounded action request. Agents should sandbox tools, require approval for mutations or spending, log `tool_use_id`/tool call ids, and cap loops by budget, token usage, time, and policy. In this repository's research context, the endpoint should be studied from public metadata only unless a later task explicitly approves paid calls.

### Product Prototyping And Model Comparison

A product team can use `/v1/chat/completions` to test Claude against existing OpenAI-style prompts by changing base URL, credentials, and model name, then comparing `choices[0].message.content`, `finish_reason`, latency logs, and `usage.total_tokens` against current model baselines. This is useful for personal experiments, demos, eval harnesses, and migration estimates where the engineering cost of a native integration is not yet justified.

The endpoint's value is speed of evaluation, not full production fidelity. Many OpenAI fields are ignored, system/developer messages are hoisted, `n` must be 1, strict tool schemas are not enforced, and prompt caching is unavailable. A team that decides to ship Claude-dependent features should move high-value workflows to native `/v1/messages` for better feature coverage and clearer cost/performance controls.
