# Anthropic API Uses

## Service Summary

Anthropic provides Claude models for conversational generation, reasoning, coding, document and image understanding, structured extraction, and tool-using agents. In this MPP catalog, Anthropic is represented by the third-party wrapper `https://anthropic.mpp.tempo.xyz`, which exposes paid, dynamic-price access to two Claude chat endpoints: the native Anthropic Messages API shape and an OpenAI-compatible chat-completions shape.

The highest-value API opportunities come from using Claude as a reasoning and language layer over existing user, document, code, and business-process context. The native `/v1/messages` path is the better fit for production-grade Claude features such as documents, citations, prompt caching, structured output, extended thinking, and tool use. The OpenAI-compatible `/v1/chat/completions` path is most useful for quick evaluation, migration tests, or existing OpenAI SDK harnesses.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Claude Chat Completions | 2 | Generate Claude assistant responses from chat-style inputs; support native Claude Messages workflows and OpenAI-compatible chat-completion tests. | [Claude Chat Completions](api-uses/claude-chat-completions.md) |

## Highest-Value Uses

- Document and knowledge work: summarize, compare, question-answer, and extract from PDFs, contracts, manuals, research papers, transcripts, images, and long internal context, especially when citations or source-grounded review are needed.
- Developer productivity: review code, explain errors, propose patches, write tests, triage logs, and power repository-aware copilots with explicit project conventions and tool-call loops.
- Customer operations: draft support replies, classify tickets, extract sentiment and escalation flags, apply policy snippets, and route issues into CRM or support workflows.
- Structured business extraction: convert emails, invoices, RFPs, contracts, call notes, and free-form records into JSON-like fields for downstream systems.
- Agentic orchestration: turn natural-language tasks into bounded tool calls, inspect tool results, and plan next steps under budget, approval, and policy controls.
- Model evaluation and migration: compare Claude against existing OpenAI-style prompts before committing to a native Anthropic integration.

## Personal Use Opportunities

- Personal research assistant for papers, manuals, public filings, contracts, or long articles, with follow-up questions and source-backed summaries.
- Coding assistant for debugging stack traces, reviewing snippets, designing tests, and explaining unfamiliar code.
- Writing and planning helper for drafts, outlines, emails, resumes, study plans, and decision matrices.
- Personal document organizer that extracts dates, obligations, contacts, tasks, and summaries from uploaded text or PDFs.
- Lightweight experiment path for users who want occasional Claude calls through an MPP wrapper without first setting up a direct Anthropic billing relationship, subject to the wrapper's payment flow and dynamic pricing.

## Business Use Opportunities

- Support-agent assist: ticket triage, reply drafting, escalation recommendations, refund-policy interpretation, and structured case summaries for human agents.
- Internal knowledge assistant: answers over policy, product, sales, legal, engineering, and operations material with citations and reviewable source references.
- Sales and customer-success automation: extract account signals from calls, emails, notes, RFPs, and CRM records; draft follow-ups and action plans.
- Legal, procurement, and finance operations: extract contract obligations, renewal dates, invoice data, vendor terms, exceptions, and risk flags while retaining source references for review.
- Engineering productivity: code review, incident analysis, log explanation, migration planning, test generation, and tool-assisted developer workflows.
- Product embedding: add Claude-powered chat, document understanding, workflow automation, and structured extraction to SaaS products while tracking token usage and enforcing user-level controls.

## Endpoint Group Summaries

### Claude Chat Completions

The Claude Chat Completions group covers `POST /v1/messages` and `POST /v1/chat/completions` on the MPP wrapper. Together they let clients send model names, conversation turns, generation controls, and optional tool definitions to Claude, then receive assistant text, tool calls, finish/stop metadata, token usage, and errors. Native Messages is the strategic path for Claude-specific features such as document blocks, citations, prompt caching, structured output, extended thinking, server/client tools, service tiers, and inference geography; the OpenAI-compatible endpoint is best for trials, comparisons, and existing OpenAI SDK integrations with known compatibility limits. Full details: [api-uses/claude-chat-completions.md](api-uses/claude-chat-completions.md).

## Field And Data Themes

- Conversation content: `messages`, role-labeled turns, text blocks, image sources, document sources, tool results, and assistant response content are the core value-bearing fields.
- Control fields: `model`, `system`, `max_tokens`, `temperature`, `top_p`, stop controls, `stream`, `service_tier`, and `inference_geo` shape quality, latency, determinism, geography, and cost.
- Structured and agentic fields: native `tools`, `tool_choice`, `output_config.format`, `thinking`, `container`, `tool_use`, and `tool_result` make the API useful for extraction and workflow automation.
- Reviewability fields: citations, `stop_reason` or `finish_reason`, refusal details, request ids, and source-preserving outputs matter for audit, debugging, and human review.
- Cost and limits fields: token usage, cache creation/read counts, server-tool counts, dynamic MPP payment metadata, and rate-limit headers are central to budgeting and operational controls.
- Compatibility fields: the OpenAI-compatible endpoint preserves common chat-completion fields but ignores many OpenAI options, so production integrations should verify behavior before relying on parity.
