# Groq API Uses

## Service Summary

Groq provides fast AI inference through GroqCloud. The assigned MPP service exposes two Groq-backed endpoints: one for OpenAI-compatible chat completions and one for listing available models. The MPP value is request-scoped access through HTTP 402 payment rather than direct Groq account setup, API-key management, or provider billing.

The practical API-use opportunity is low-latency text work: support triage, structured extraction, routing, rewriting, interactive assistants, and model-selection workflows. The service should not be treated as the full Groq API; the wrapper does not expose Groq's full audio, batch, file, Responses API, or other surfaces in the local endpoint inventory.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Chat Completions | 1 | Generate fast assistant messages, structured JSON, classifications, summaries, and tool-call plans from conversational inputs. | [api-uses/chat-completions.md](api-uses/chat-completions.md) |
| Model Discovery | 1 | List available model ids and metadata so callers can choose valid models before inference. | [api-uses/model-discovery.md](api-uses/model-discovery.md) |

## Highest-Value Uses

The strongest use is latency-sensitive text automation where a slow model would interrupt the workflow: support triage, live assistants, intake classification, and short structured transformations. The chat endpoint's `messages`, `model`, `response_format`, `temperature`, and token controls shape the work, while response `usage.*` and timing fields help monitor cost and latency.

The second strongest use is model-selection hygiene. The model-list endpoint lets a workflow avoid stale model ids before calling chat completions, and `context_window` can help route long inputs to appropriate models when the field is returned.

## Personal Use Opportunities

- Draft and refine support replies, personal emails, notes, and summaries with fast turnaround.
- Extract tasks, dates, owners, and decisions from notes into structured JSON for a personal task system.
- Check available model ids before running a personal script or agent, reducing failures from deprecated or renamed models.
- Use fixed `seed`, low `temperature`, and `system_fingerprint` monitoring for lightweight prompt regression checks, with the caveat that determinism is best effort.

## Business Use Opportunities

- Triage support tickets, bug reports, lead messages, or intake forms into categories, severities, owners, and next actions.
- Power low-latency internal or customer-facing assistants where response time affects adoption.
- Normalize unstructured operational text into machine-readable records for CRM, helpdesk, incident, or analytics pipelines.
- Maintain a model catalog and route tasks by valid model id, context window, cost policy, and production/preview status.
- Track `usage.*`, timing fields, `x_groq.id`, and `system_fingerprint` for cost observability, debugging, and reproducibility review.

## Endpoint Group Summaries

### Chat Completions

The [Chat Completions](api-uses/chat-completions.md) group is the inference surface. It accepts `model`, `messages`, generation controls, structured-output controls, and optional tool-calling fields, then returns assistant content, usage, timing metadata, and trace identifiers. It is most valuable for real-time support triage, structured extraction, interactive assistants, rewriting, classification, and prompt regression checks.

### Model Discovery

The [Model Discovery](api-uses/model-discovery.md) group supports model selection before inference. It has no documented inputs and is expected, based on official Groq docs, to return a list of model records with ids, owners, active state, and context windows. It is most useful for dynamic model pickers, model migration checks, context-window routing, transparency reviews, and cost-aware model catalog maintenance.

## Field And Data Themes

The service revolves around three field themes:

- **Model identity:** `model` on chat requests and `data[].id` from model listing connect every workflow to a concrete model choice.
- **Content transformation:** `messages[].content`, `response_format`, `choices[].message.content`, and optional tool-call/reasoning fields carry the actual user work.
- **Operational observability:** `usage.prompt_tokens`, `usage.completion_tokens`, `usage.total_tokens`, latency fields, `system_fingerprint`, `x_groq.id`, and model `context_window` support budgeting, debugging, and repeatability checks.
