# Groq: Chat Completions API Uses

## What This Endpoint Group Does

The chat-completions endpoint sends conversational input to a selected Groq-hosted model and returns a generated assistant message, usage statistics, timing metadata, and trace identifiers. The valuable fields are the prompt-bearing `messages`, the model selector `model`, output controls such as `max_completion_tokens`, `temperature`, `top_p`, `response_format`, `tools`, and `reasoning_format`, and response fields such as `choices[].message.content`, `usage.*`, `system_fingerprint`, and `x_groq.id`.

This group is useful when a workflow needs fast text generation, classification, extraction, or structured transformation. It is less useful for workflows that require files, audio, batch jobs, streaming, or provider fields not documented in the MPP wrapper OpenAPI.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/groq/chat` | Create a Groq chat completion through the MPP wrapper. | `model`, `messages`, `max_completion_tokens`, `temperature`, `top_p`, `tools`, `tool_choice`, `response_format`, `stop`, `seed`, `reasoning_format` | `choices[].message.content`, `choices[].message.tool_calls`, `choices[].message.reasoning`, `finish_reason`, `usage.prompt_tokens`, `usage.completion_tokens`, `usage.total_tokens`, timing fields, `system_fingerprint`, `x_groq.id` |

## Field Notes

### Inputs

`model` controls which Groq-hosted model handles the request. It should be selected from current supported models rather than hard-coded permanently, because Groq's model docs distinguish production, preview, and deprecated models and list context-window and max-completion-token constraints.

`messages` is the workflow payload: instructions, user text, prior assistant context, and task-specific content. For extraction and routing use cases, `response_format` is important because JSON mode or JSON schema can make downstream automation more reliable. `temperature`, `top_p`, `seed`, and `system_fingerprint` matter when a workflow needs repeatable behavior. `tools` and `tool_choice` can ask the model to produce function calls, but this research does not validate wrapper support for external tool execution and does not recommend using this endpoint for code execution.

### Outputs

The main output is `choices[].message.content`. When tool calling is used, `choices[].message.tool_calls` may become the action plan that a separate trusted system evaluates and executes. `finish_reason` indicates whether the model stopped normally or hit another stop condition. `usage.prompt_tokens`, `usage.completion_tokens`, and `usage.total_tokens` support cost estimation and prompt budgeting, while `queue_time`, `prompt_time`, `completion_time`, and `total_time` support latency monitoring. `x_groq.id` and `system_fingerprint` are useful for debugging, audit trails, and reproducibility checks.

### Important Constraints Or Gaps

The MPP wrapper OpenAPI does not define a 200 response schema, so response fields are derived from official Groq docs. The wrapper schema is narrower than the official Groq chat-completions API; fields such as `stream`, `documents`, `search_settings`, `service_tier`, `citation_options`, `parallel_tool_calls`, and `user` appear upstream but are not explicit in the wrapper OpenAPI.

Groq documents unsupported OpenAI-compatible features including `logprobs`, `logit_bias`, `top_logprobs`, `messages[].name`, and `n` values other than 1. Groq also documents rate limits by requests, tokens, and audio units; chat workflows are most directly affected by requests-per-minute/day and tokens-per-minute/day. No paid calls were made to test wrapper-specific error bodies, headers, or payment metadata.

## Use Cases

### Real-Time Support Triage And Drafting

An individual can paste a support email, bug report, refund request, or internal helpdesk note into `messages` and ask the model to classify urgency, summarize the issue, and draft a response. A business can put the same pattern behind a support queue: the model returns `choices[].message.content` as a draft reply or a structured JSON object with category, sentiment, severity, suggested owner, and next action. `response_format` is the key field for making that output machine-readable, while `usage.total_tokens` helps detect unusually large or expensive tickets.

The value is speed and consistency. Low latency matters because agents or human reviewers can see draft responses while the customer is still waiting. The limitation is that the endpoint does not verify facts, access private ticket systems by itself, or guarantee deterministic classifications. For sensitive support data, the operator must decide what customer content is appropriate to send to a third-party model endpoint and must keep a human approval step where policy or legal risk is high.

### Structured Extraction From Unstructured Notes

A person can turn meeting notes, research snippets, or copied web text into structured tasks, dates, owners, risks, and decisions. A business can process call transcripts, sales notes, incident reports, or vendor emails into JSON records for a CRM, project tracker, or analytics pipeline. The important inputs are a carefully constrained `messages` prompt plus `response_format` set to JSON mode or JSON schema, and the important outputs are the returned content and `finish_reason`.

This use case is valuable because the endpoint can convert free-form text into fields that existing systems can sort, route, and validate. The workflow should treat the model output as a proposed extraction, not a source of truth. Downstream validation should check required keys, date formats, enum values, and whether `finish_reason` suggests truncation. The `max_completion_tokens` field should be set high enough for the expected record size but low enough to control cost.

### Low-Latency Interactive Assistants

An individual can use the endpoint as a fast writing, coding-assistance, or study companion where response latency directly affects flow. A business can embed it in customer-facing chat, sales enablement, onboarding, or internal knowledge assistant experiences where users abandon slow interactions. `model`, `messages`, `temperature`, and `max_completion_tokens` shape the assistant's behavior, while `queue_time`, `completion_time`, and `total_time` show whether the model is meeting the latency target.

The returned content enables immediate next actions: answer the user's question, ask a clarifying question, summarize a policy, or generate a draft. The gap is retrieval: the MPP schema does not explicitly document whether wrapper calls support Groq's upstream document context or search settings, so workflows needing grounded private knowledge should retrieve and inject relevant context into `messages` themselves and should cite source documents outside the model response.

### Automated Content Rewriting And Localization Prep

A person can use the chat endpoint to rewrite text into a shorter version, change tone, produce a plain-language explanation, or prepare translation-ready source copy. A business can standardize marketing copy, product descriptions, knowledge-base articles, or release notes across channels. `temperature` controls how creative the rewrite should be, `stop` can prevent unwanted sections, and `response_format` can return multiple variants or channel-specific fields.

The value is not just text generation; it is workflow compression. A content operation can ask for a headline, summary, social post, and compliance caveat in one structured response, then route each field to a review tool. The important limitation is that generated language can introduce claims not present in the input. Prompts should tell the model to preserve facts and flag unsupported claims, and review should remain mandatory for regulated, legal, medical, financial, or brand-sensitive copy.

### Classification And Routing For Agent Workflows

An individual agent can use the endpoint to choose the next step for incoming work: answer directly, ask for clarification, escalate, summarize, or call a domain-specific tool. A business can use it for email routing, lead qualification, incident routing, policy triage, or back-office intake. `tools` and `tool_choice` are relevant when the output should be an action proposal, while `response_format` can make the decision record explicit with labels, confidence, and rationale.

The returned `choices[].message.tool_calls` or structured content can drive automation, but the automation boundary matters. The model should propose actions; a separate deterministic system should validate permissions, required fields, and side effects before anything is executed. This is especially important because the research did not call the endpoint and did not validate wrapper behavior for tool-calling fields.

### Prompt And Model Regression Checks

A developer can run approved test prompts against a chosen `model` with fixed `seed`, `temperature`, and `response_format` to compare outputs over time. A business can use this pattern in evaluation pipelines for support classifiers, extraction prompts, or assistants before deploying prompt changes. The response fields `system_fingerprint`, `usage.*`, and timing metrics help explain whether output differences came from backend changes, prompt changes, model changes, or input size changes.

This use case helps teams keep model-backed workflows stable. It does not provide perfect reproducibility because Groq documents `seed` as best-effort and recommends watching `system_fingerprint`. It also requires careful cost control: regression checks should use a small representative prompt set and should not run through MPP payment without explicit approval and budget controls.
