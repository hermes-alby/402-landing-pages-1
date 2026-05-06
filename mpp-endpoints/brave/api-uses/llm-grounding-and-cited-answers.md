# Brave Search: LLM Grounding And Cited Answers API Uses

## What This Endpoint Group Does

This group covers Brave's two AI-facing search surfaces exposed through MPP. LLM Context returns extracted web snippets and source metadata for a caller's own model or RAG pipeline. AI Answers returns a Brave-generated, OpenAI-compatible chat completion that can stream, cite sources, or run deeper research mode upstream.

The practical distinction is control. LLM Context gives applications raw grounding material. AI Answers gives applications a completed answer and shifts synthesis to Brave's answer service.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/brave/llm-context` | Retrieve pre-extracted web content for LLM grounding. | `q`, `maximum_number_of_tokens`, `maximum_number_of_urls`, `freshness` | `grounding.generic[]`, `grounding.poi`, `grounding.map`, `sources` |
| POST | `/brave/answers` | Generate a grounded AI answer using an OpenAI-compatible chat format. | `messages`, `model`, `stream`, `max_completion_tokens` | OpenAI-style `choices`, `usage`, streaming chunks, optional citation/research/usage tags upstream |

## Field Notes

### Inputs

LLM Context centers on `q`, token limits, URL limits, and freshness. Official upstream docs add context-size knobs, threshold mode, Goggles, local recall, and location headers. AI Answers centers on a `messages` array, `model`, `stream`, and completion-token limit. Upstream docs add `enable_citations`, `enable_research`, country, language, SafeSearch, web search context size, and research budget controls.

### Outputs

LLM Context returns `grounding.generic[]` entries with source URL, title, and snippets, plus `sources` metadata keyed by URL. Local recall can add POI and map grounding. AI Answers can return an OpenAI-compatible blocking response with assistant content and usage, or streaming chunks. Upstream streaming can include `<citation>`, `<queries>`, `<progress>`, `<blindspots>`, `<answer>`, and `<usage>` tags depending on mode.

### Important Constraints Or Gaps

The MPP wrapper does not document response schemas or streaming behavior. Upstream Answers constraints are important: research mode requires streaming, research mode is incompatible with `enable_citations`, and citation mode requires streaming. The upstream docs and MPP docs differ on the default value of `stream`, and model options are not fully aligned.

## Use Cases

### Agent Web Tool With Bounded Context

A person using a personal coding or research agent can call LLM Context for a question like "current React server component best practices" and pass `grounding.generic[].snippets` plus `sources` into their own model. Token and URL limits keep the context small enough for a specific task.

A business can use the same pattern to give internal agents current web context while retaining control over the model, prompt, citation formatting, and downstream policy checks. The valuable fields are source URL, title, hostname, snippet text, and source age. The main caveat is that snippets can contain mixed plain text and structured data, so the caller's prompt should preserve source boundaries and avoid over-claiming.

### RAG Pre-Retrieval For Support And Documentation

A developer, student, or support user can query product docs, changelogs, or error messages and use LLM Context snippets as a fast retrieval layer before asking an LLM for an explanation. If upstream Goggles are available through the wrapper, a caller could restrict sources to official docs.

A company can wire this into a support assistant that searches public documentation, community pages, and release notes before composing an answer. The workflow should include source URLs and hostnames in the final response for auditability. For official-only answers, the wrapper's support for `goggles` should be verified before relying on it.

### Cited Chat Answers For End Users

A person can ask AI Answers a current-events or factual question and receive a synthesized answer without manually reading multiple search results. Streaming citations upstream can help the user inspect the evidence behind claims.

A business can embed AI Answers into a chat product, research mode, or concierge workflow where the desired output is an answer rather than raw search results. OpenAI-compatible response shapes lower integration cost for teams already using chat completion clients. The endpoint is more expensive than the Search-plan endpoints and may be slower, especially if research mode is enabled upstream.

### Deep Research Drafting

A user preparing a buying decision, policy memo, travel comparison, or technical recommendation can use upstream research mode to generate multiple search queries, analyze many URLs, expose blindspots, and return a final answer. The important outputs are progress tags, blindspots, final answer tags, citations, and usage.

For businesses, this supports analyst-assist workflows: gather a first draft for market research, vendor comparisons, or due diligence, then require human review before decisions. Research budgets such as maximum queries, iterations, seconds, and tokens are critical for controlling latency and cost. The MPP wrapper does not document whether all research-mode options pass through or how streaming is delivered.

### Local Question Answering

A person can ask location-aware questions such as "best coffee shops near me for working" through LLM Context when local recall and location headers are available upstream. The response can include `grounding.poi`, `grounding.map`, source URLs, titles, and snippets.

A business building a concierge or field-service assistant can use local grounding to answer area-specific questions or collect place context. Latitude and longitude are preferred over text location headers upstream. This use should respect user privacy: location should be explicit, minimal, and not retained unnecessarily.

### Cost-Aware Routing Between Context And Answers

A developer can choose LLM Context when they want raw source material for their own model and AI Answers when they want a complete Brave-generated answer. Fields such as `maximum_number_of_tokens`, `maximum_number_of_urls`, `max_completion_tokens`, and streaming usage tags support cost control.

A business can implement a router that starts with LLM Context for simple retrieval and escalates to AI Answers only when synthesis is needed. That saves spend and gives the organization better control over answer quality. Because the wrapper's streaming and usage-tag behavior is unverified, production budgets should be validated under a later approved paid-call task.
