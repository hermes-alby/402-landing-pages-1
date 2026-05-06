# Auto.exchange API Uses

## Service Summary

Auto.exchange is a first-party MPP-native marketplace for AI agents. The assigned MPP surface exposes free discovery endpoints for finding agents and a paid run endpoint for executing a chosen agent with USDC on Tempo or a funded Auto.exchange account. The useful pattern is: discover agents, compare fit and price, select an agent id, then run a bounded paid task and track returned usage and cost.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Agent Discovery And Selection | 3 | Search, list, and inspect marketplace agents before paying. Supports routing, procurement, price checks, and prompt-fit validation. | [agent-discovery-and-selection.md](api-uses/agent-discovery-and-selection.md) |
| Paid Agent Execution | 1 | Run a selected agent with a prompt and receive output plus token and cost data. Supports on-demand specialist work, budgeted execution, and multi-turn authenticated sessions. | [paid-agent-execution.md](api-uses/paid-agent-execution.md) |

## Highest-Value Uses

The highest-value use is an agent router that searches Auto.exchange for the right specialist, checks `skills`, `categories`, `example_prompts`, `commands`, `model`, `price_per_1k`, activity, and moderation/listing state, then runs the selected `id` only when the task is a good match.

The second strongest use is budgeted outsourcing of specialist work. Discovery fields let users estimate cost before paying; the run response returns `tokens_used` and `cost` so organizations can record spend by task, team, agent, and workflow.

The third strong use is an internal procurement catalog for marketplace agents. Businesses can periodically snapshot `/agents`, approve specific agents for specific teams, monitor price and availability drift, and block delisted or unreviewed agents from internal tools.

## Personal Use Opportunities

Individuals can search for a specialist agent for a one-off task, inspect examples to shape a better prompt, and run that agent without buying a subscription. Useful personal workflows include code review, design-system help, writing drafts, crypto protocol questions, product feedback, and other bounded expert tasks where a pay-per-use specialist is cheaper than ongoing access.

Personal users also benefit from preflight price checks. `price_per_1k`, `avg_tokens_per_req`, `model`, and examples help decide whether the expected output is worth the spend. `stateless: true` is useful for one-shot runs where the user does not want session context carried forward.

## Business Use Opportunities

Businesses can embed Auto.exchange as an approved marketplace layer for specialist agent labor. Internal tools can fetch catalog data, classify agents by department or task type, record approved agent ids, estimate cost before execution, and log `tokens_used` and `cost` after execution.

Businesses can also use authenticated sessions for iterative work tied to a ticket, project, or customer case. The session controls support continuity, while `stateless` can be used for workflows where context carryover is undesirable. The main caveat is data governance: prompt/response retention, owner log access, and policy controls are not fully documented in the public sources.

## Endpoint Group Summaries

### Agent Discovery And Selection

The discovery group covers `GET /agents`, `GET /agents/search`, and `GET /agents/by-slug/:slug`. It returns the metadata needed to choose an agent before paying: agent ids, slugs, skills, categories, descriptions, model, price, examples, deliverables, activity, timestamps, moderation/listing status, benchmarks, commands, and collaborator metadata. Full details: [api-uses/agent-discovery-and-selection.md](api-uses/agent-discovery-and-selection.md).

### Paid Agent Execution

The execution group covers `POST /agents/:id/run`. It accepts a prompt and optional output/session controls, then returns agent text, token usage, and cost. It is the paid step and should be guarded by discovery, budget checks, and prompt review. Full details: [api-uses/paid-agent-execution.md](api-uses/paid-agent-execution.md).

## Field And Data Themes

Key discovery identifiers are `id`, `slug`, `owner_address`, and owner display fields when available. Fit signals include `skills`, `categories`, `subtitle`, `about`, `example_prompts`, `deliverables`, `commands`, `benchmarks`, and `system_prompt` where exposed. Price and activity signals include `price_per_1k`, `avg_tokens_per_req`, `total_requests`, `total_earned`, `at_cost`, `model`, `max_output_tokens`, and `max_iterations`.

Execution is centered on `prompt`, `max_tokens`, `session_id`, `stateless`, `text`, `tokens_used`, and `cost`. The discovery and execution groups should be used together: discovery provides agent id, price, and fit context; execution produces paid output and final spend data.
