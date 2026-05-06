# OpenAI: Model Responses And Chat API Uses

## What This Endpoint Group Does

This group generates model outputs from prompts, messages, multimodal inputs, and tool definitions. `POST /v1/responses` is the newer recommended surface for text generation, structured outputs, tool use, streaming, image/file inputs, and multi-step model workflows. `POST /v1/chat/completions` is the chat conversation surface that remains important for existing integrations and some audio-capable chat workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/responses` | Create a model response with text, structured output, tools, multimodal input, or streaming. | `model`, `input`, `instructions`, `prompt`, `tools`, `tool_choice`, `text`, `reasoning`, `previous_response_id`, `stream`, `store` | `id`, `status`, `output[]`, `usage`, `error`, stream events |
| POST | `/v1/chat/completions` | Create a chat conversation completion, including compatibility chat flows and some audio-capable chat outputs. | `model`, `messages`, `modalities`, `audio`, `tools`, `tool_choice`, `response_format`, `temperature`, `stream`, `store` | `id`, `choices[]`, `message`, `tool_calls`, `usage`, stream chunks |

## Field Notes

### Inputs

The key decision fields are `model`, prompt or message content, system/developer instructions, output format, tool definitions, sampling controls, token limits, streaming, and storage. Responses also supports `previous_response_id` and reusable `prompt` references, which help build multi-turn and centrally managed workflows. Chat Completions uses `messages[]` as the main conversation state shape and can request audio output with `modalities` and `audio` for compatible models.

### Outputs

Responses returns an `output[]` array that may include assistant messages, tool calls, image generation calls, reasoning/tool metadata, or other items. OpenAI docs warn that callers should not assume the first item is always text. Chat Completions returns `choices[]` with assistant messages, optional tool calls, finish reasons, logprobs, and token usage. Both endpoints expose usage fields that support cost accounting and quota monitoring.

### Important Constraints Or Gaps

OpenAI recommends Responses for new text generation work. Parameter support differs by model, especially for reasoning, audio, and tool-capable models. Data retention controls can affect `store`; under Zero Data Retention, OpenAI docs say `store` is treated as `false` for Responses and Chat Completions. The MPP wrapper does not document whether every model, tool, streaming mode, and storage behavior is passed through.

## Use Cases

### Accountless Prompt Automation

A person could use the wrapper for a one-off summarization, rewrite, extraction, or coding help request without setting up a direct OpenAI account and API key. The useful fields are `model`, `input` or `messages`, `instructions`, and `text.format`; the output text or structured JSON can be pasted into a note, ticket, spreadsheet, or script.

A business could expose small, paid AI automations inside a marketplace or agent workflow where each caller pays for a task. Usage fields such as `input_tokens`, `output_tokens`, and `total_tokens` help reconcile cost, while `metadata` can label the job, tenant, or workflow. The main limitation is that dynamic MPP pricing must be understood before using high-cost models, tool calls, or long-context prompts.

### Structured Data Extraction From Unstructured Text

A person can turn receipts, notes, emails, or copied webpage text into structured JSON for budgeting, research, or personal knowledge management. Responses fields such as `text.format`, `instructions`, and `input` matter because they let the caller specify a schema-like output and keep extraction rules separate from user content.

For a business, this enables invoice intake, support ticket classification, lead qualification, policy extraction, contract metadata capture, or product catalog normalization. The returned structured fields can drive routing, approvals, CRM updates, and exception queues. The limitation is that validation still belongs in the caller's workflow; model output should be checked against schema and business rules before mutation.

### Tool-Orchestrated Agent Steps

A developer or power user can ask the model to decide when to call tools, return function arguments, or produce a next action. The key fields are `tools`, `tool_choice`, `output[]`, `tool_calls`, and tool call IDs. The returned function-call arguments can be inspected or passed to a separate tool runner.

Businesses can use this for support triage, sales research, operations copilots, or workflow automation where the model classifies intent and proposes the right downstream action. The MPP wrapper can fit agent marketplaces where the model call is paid per step. The important gap is that this research did not execute tools, and any mutation, purchase, payment, or account action must be explicitly approved and handled outside this public-doc-only research workflow.

### Multimodal Review And Explanation

Responses can accept image or file inputs and Chat Completions can support image and audio inputs for compatible models. A person could ask for an explanation of a diagram, screenshot, or spoken note and receive a plain-language answer.

In a business setting, this can support document review, QA of screenshots, accessibility descriptions, insurance/photo intake, and call-center audio workflows. The fields that matter are content item types, `modalities`, `audio`, and the output message content. Data controls are important: image and file inputs may have extra safety scanning and retention caveats even for organizations with modified abuse monitoring or Zero Data Retention.

### Cost-Aware AI Routing

A personal automation can choose a low-cost model for simple drafting and a stronger model for complex reasoning by setting `model`, token limits, and reasoning effort. The output `usage` object lets the user estimate cost after each request.

A company can use the same fields to implement model routing, budget enforcement, customer-tier controls, and internal chargeback. `service_tier`, token details, cached tokens, and reasoning tokens help distinguish expensive workloads from cheap ones. The MPP gap is that wrapper session pricing is dynamic but not fully mapped to OpenAI's published token and tool pricing in local docs.

### Streaming User Interfaces

With `stream=true`, a person can see partial text or chat output quickly instead of waiting for a full completion. This matters for long explanations, code generation, and conversational UIs.

Businesses can use streaming to reduce perceived latency in support bots, internal assistants, and content tools. Streaming events also make cancellation and progress indicators more ergonomic. The caveat is that the wrapper must preserve event-stream behavior; the local MPP feed confirms the endpoint but does not separately document streaming pass-through.
