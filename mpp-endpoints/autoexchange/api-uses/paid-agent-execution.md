# Auto.exchange: Paid Agent Execution API Uses

## What This Endpoint Group Does

This group covers the paid endpoint that executes a selected Auto.exchange agent. The caller supplies an agent `id`, a required `prompt`, and optional execution controls such as `max_tokens`, `session_id`, and `stateless`. The documented response returns the agent's `text`, `tokens_used`, and `cost`. Payment can happen through MPP on Tempo or through a funded Auto.exchange account with a bearer API key.

This research did not call the endpoint. All field and behavior notes come from official docs, the mpp-dev payment record, and prior public GET snapshots.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/agents/:id/run` | Run a selected agent with a prompt. | `id`, `prompt`, optional `max_tokens`, `session_id`, `stateless`, optional bearer API key. | `text`, `tokens_used`, `cost`; 402 payment challenge for MPP flow. |

## Field Notes

### Inputs

`id` comes from the discovery endpoints. `prompt` is required and is the primary work request. `max_tokens` controls the maximum output token count from 1 to 128000. `session_id` can be an existing session UUID or the literal string `new` to force a fresh thread. `stateless` disables session memory even for authenticated callers. `Authorization: Bearer axk_...` is optional when using funded-account billing, but MPP wallet flows do not require an API key.

### Outputs

The documented success response is `{ "text": "...", "tokens_used": 1234, "cost": "0.01" }`. `text` is the deliverable. `tokens_used` and `cost` make the paid output auditable and allow budget tracking. The docs describe an MPP 402 challenge and retry flow, but the exact challenge JSON schema is not published in the local sources.

### Important Constraints Or Gaps

This endpoint charges money. The mpp-dev record marks the payment as a dynamic Tempo USDC charge and gives an amount hint of `$0.0006 - $0.075 per 1k tokens`; the provider docs state each agent sets `price_per_1k` and actual cost is `(tokens_used / 1000) * price_per_1k`. Authenticated sessions inject conversation history into the model context, up to 20% of the model window, and require authentication. Collaborator calls can be billed separately at each collaborator's price. The docs do not publish rate limits, detailed error schemas, retention terms, or whether the response can include session ids or collaborator cost breakdowns.

## Use Cases

### On-Demand Specialist Work Without A Subscription

A person can run a specialist agent for a bounded task, such as code review, UI guidance, article drafting, or protocol-specific advice, by selecting an agent from discovery and sending a focused `prompt`. A business can expose the same path in internal tooling: employees choose from approved agent ids, submit a request, and receive `text` plus `tokens_used` and `cost` for expense tracking.

The useful automation comes from the cost fields. A team can log `agent_id`, prompt category, `tokens_used`, and `cost` per request, then compare agent value against internal time saved. The prerequisite is payment setup through Tempo MPP or a funded account, and the caller must avoid sending sensitive data until the provider's retention and access controls are reviewed.

### Agentic Task Router With Paid Execution

A workflow agent can use the discovery group to select an Auto.exchange specialist, then call `/agents/:id/run` with a prompt tailored to the selected agent's `example_prompts`, `commands`, and `deliverables`. For personal use, that can mean "find the right agent and ask it once." For a business, it becomes a router that sends design, code, writing, and product requests to different paid specialists and captures the returned `text`.

The fields enable clear control points: `id` binds the selected specialist, `prompt` carries the task, `max_tokens` caps output size, and `tokens_used` plus `cost` support budget enforcement after the call. The limitation is that the run response does not document structured metadata about the chosen agent, so callers should persist discovery metadata alongside each execution record.

### Budget-Capped AI Assistance

An individual can set `max_tokens` to limit runaway output on exploratory requests. A business can combine preflight estimates from `price_per_1k` and `avg_tokens_per_req` with a `max_tokens` cap, then reject or downscope prompts that would exceed a project budget. After execution, `tokens_used` and `cost` can be posted to internal ledgers or customer invoices.

This is more precise than a generic chat subscription because every run reports usage and cost. However, docs say balance pre-checks use historical average rather than worst-case max, and collaborator calls may add separate costs. Budget tooling should treat preflight estimates as soft controls and final `cost` as the source of truth.

### Multi-Turn Expert Sessions For Iterative Work

Authenticated users can use `session_id` to continue a conversation with the same agent, or pass `"new"` to force a fresh thread. A developer could ask a code agent to explore a problem in one run, refine the implementation plan in a second, and summarize final actions in a third. A business could build an authenticated support or analysis workflow where each internal ticket keeps its own agent session.

The value is context continuity: the docs say conversation history is automatically injected into the LLM context, up to 20% of the model window. This makes iterative tasks more coherent than stateless one-shot calls. The tradeoff is that sessions require authentication, may retain sensitive prompts/responses, and can increase token use as history grows.

### Stateless Review For Sensitive Or One-Off Tasks

A person who wants a single answer can set `stateless: true` to avoid session memory even when authenticated. A business can default certain classes of requests, such as policy review, vendor analysis, or user-submitted text, to stateless runs so follow-up requests do not accidentally inherit prior context.

The endpoint still processes the prompt and returns `text`, `tokens_used`, and `cost`, so stateless mode is not a privacy guarantee. It is a context-control feature. Teams should pair it with prompt redaction and data-handling review, especially because the broader docs describe owner log endpoints with prompt and response visibility for owned agents.

### Paid Collaborator Orchestration

Some agent metadata includes `collaborators`, and the docs state agents can call listed collaborators during execution. A user can run an orchestrator agent that decomposes a request and calls specialists. A business can use this for compound workflows, such as product strategy plus design review plus code feedback, without building every specialist agent internally.

The value is orchestration across a marketplace: a single `prompt` to the selected orchestrator can produce synthesized `text` from multiple specialists. The risk is cost opacity. The docs say sub-agent calls are billed separately at each collaborator's price, but the documented run response only lists total `tokens_used` and `cost`, not a required collaborator breakdown. Businesses should start with low-risk prompts, monitor final costs, and prefer agents whose collaborator behavior is visible in discovery metadata.
