# Tako: Knowledge Card Search And Deep Research API Uses

## What This Endpoint Group Does

This group turns natural-language research questions into cited visual knowledge cards. Fast search is the seconds-scale path for most questions; async deep search and streaming deep threads are for broader, higher-recall research that may take minutes. Outputs are useful because they combine an answer with card metadata, embeddable charts, static images, source citations, methodology notes, and raw visualization data when available.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/mpp/v1/search/fast` | Fast data search across Tako and optional web indexes. | `query`, `source_indexes`, `search_effort` | `outputs.knowledge_cards`, `outputs.answer`, `request_id`; possibly `task_id` for deep effort. |
| POST | `/api/mpp/v1/search/deep` | Starts an async deep search. | `query`, `source_indexes` | `task_id` |
| GET | `/api/mpp/v1/search/deep/status` | Polls deep search status. | `task_id`, receipt auth | `status`, final `outputs` |
| POST | `/api/mpp/v1/threads/deep` | Runs deep research as an SSE stream. | `knowledge_search_request.inputs.text`, `skip_routing` | `thread_created`, `activity`, `result`, `error` SSE events |
| GET | `/api/mpp/v1/threads/status` | Feed-listed status endpoint for async knowledge search. | likely task/thread id | Not publicly documented |

## Field Notes

### Inputs

`query` and `knowledge_search_request.inputs.text` are the core fields: they define the research question. `source_indexes` controls whether Tako searches the curated `tako` graph, broader `web`, or `connected_data` where available. `search_effort` can be `fast`, `medium`, `deep`, or `auto`; deep may return a `task_id` instead of a blocking result.

### Outputs

Knowledge card outputs matter most: `card_id`, `title`, `description`, `embed_url`, `image_url`, `webpage_url`, `sources`, `methodologies`, `visualization_data`, and `answer`. For streaming, `thread_created` gives a `thread_id`, `activity` gives progress text, and `result` carries final cards and answer.

### Important Constraints Or Gaps

Deep work can run from 30 seconds to 10 minutes. Status polling is free but receipt-authenticated. The full nested knowledge-card schema is not published. `/api/mpp/v1/threads/status` is present in the raw MPP feed but absent from the live `mpp.json` snapshot and the agent guide.

## Use Cases

### Cited Market And Company Research

A personal investor or analyst can ask for comparisons such as revenue, market cap, commodity prices, or stock trends and receive charts plus source citations. The key fields are `query`, `source_indexes`, `outputs.knowledge_cards`, `sources`, `methodologies`, `description`, and `answer`; these let the user verify where a number came from before relying on it.

A business can embed the same workflow into an internal research assistant for sales, strategy, or finance teams. Returned `embed_url` and `image_url` fields make the answer portable into dashboards, briefs, or presentations, while `visualization_data` can feed a custom rendering layer. The limitation is that Tako's exact data coverage varies by domain and the complete card schema is not published.

### Public Data Explainers For Customer-Facing Products

An app can let users ask questions like "US inflation vs unemployment since 2020" or "latest Premier League standings trend" and display a visual card instead of plain text. The card's `title`, `description`, `sources`, and `methodologies` make the answer more defensible than a generic generated paragraph.

For businesses building financial, sports, civic, education, or weather products, this can enrich user experiences without maintaining every upstream dataset. The app should still cache, label freshness, and handle missing or low-confidence results because response fields and data freshness are not guaranteed by a published schema.

### Research Triage Before A Deeper Report

A researcher can use `search/fast` to test whether Tako has enough relevant data before paying for `threads/deep` or a full report. Fast results reveal useful `sources`, preliminary `answer` text, and whether the knowledge cards match the intended domain.

For a company, this triage step can reduce wasted spend: an agent can run fast searches across a backlog of candidate research questions, keep the ones with useful cards, and escalate only the best prompts to deep research. This needs careful cost controls because paid endpoints are per request and deep search is materially more expensive.

### Live Research Progress In Agent Interfaces

The SSE `threads/deep` endpoint is useful when the user experience benefits from progress updates. `thread_created`, `activity`, and `result` events let a chat UI show that Tako is searching, reasoning, and assembling results rather than appearing stalled.

For businesses, this is valuable in research workbenches, analyst copilots, and customer support tools where a 30-second to 10-minute wait would otherwise be opaque. Clients need robust SSE handling, retry logic, timeout behavior, and receipt tracking.

### Grounding LLM Or Agent Answers With Visual Evidence

An AI agent can call fast or deep search to retrieve cited charts, then use `answer`, `sources`, `methodologies`, and `embed_url` to ground its final response. The card outputs help the agent avoid unsupported claims and give end users a way to inspect the underlying data.

Businesses can use this pattern in reference chatbots, market-intelligence agents, or generative presentation tools. The system should keep the model's generated prose separate from Tako's sourced fields and should not automate high-stakes decisions without human review.
