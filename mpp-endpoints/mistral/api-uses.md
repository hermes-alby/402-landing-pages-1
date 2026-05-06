# Mistral AI API Uses

## Service Summary

Mistral AI provides AI models and APIs for chat generation, reasoning, code, embeddings, moderation, multimodal inputs, and model discovery. The assigned MPP service is a third-party Locus wrapper around a small Mistral API subset: chat completions, embeddings, moderation, and model listing.

The strongest API-use opportunities are no-account, pay-per-request access to core AI primitives: generate structured answers, create vectors for retrieval, classify content for safety, and inspect model metadata before choosing a model. Mistral already offers first-party pay-as-you-go API pricing, so the MPP value is mainly payment/routing convenience and lower onboarding friction.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Chat Generation And Reasoning | 1 | Drafting, structured extraction, reasoning support, tool-call planning, multimodal interpretation, and prompt-controlled chat outputs. | [chat-generation-and-reasoning.md](api-uses/chat-generation-and-reasoning.md) |
| Semantic Embeddings And Retrieval | 1 | Vector search, RAG retrieval, clustering, deduplication, semantic matching, and lightweight classification. | [semantic-embeddings-and-retrieval.md](api-uses/semantic-embeddings-and-retrieval.md) |
| Content Safety And Policy Moderation | 1 | Safety category labels and scores for pre-publish screening, queue routing, PII-sensitive workflows, and LLM guardrails. | [content-safety-and-policy-moderation.md](api-uses/content-safety-and-policy-moderation.md) |
| Model Discovery And Capability Selection | 1 | Model preflight, capability routing, deprecation monitoring, context-length planning, and UI model pickers. | [model-discovery-and-capability-selection.md](api-uses/model-discovery-and-capability-selection.md) |

## Highest-Value Uses

The highest-value personal uses are semantic search over private notes, structured drafting or summarization, model-assisted decision support, and content safety checks before posting or sharing text.

The highest-value business uses are retrieval-augmented generation over internal knowledge, structured intake triage for tickets or leads, model preflight and lifecycle monitoring, moderation queue routing, and embedding-based clustering of feedback or support records.

The most defensible combined workflow is: list models to select a compatible model, embed internal documents for retrieval, call chat with retrieved context and structured output, then moderate inputs or outputs where user-visible or sensitive content is involved.

## Personal Use Opportunities

Personal knowledge search is a strong fit. A user can embed notes, articles, transcripts, and project documents, then search by meaning and pass retrieved context to chat for summaries or answers.

Writing and decision support are also strong fits. Chat generation can produce structured summaries, drafts, comparisons, checklists, and JSON outputs, while usage fields help track token-heavy prompts.

Moderation is useful for small communities, public posts, or shared workspaces where a person wants to catch unsafe or sensitive text before publishing.

## Business Use Opportunities

Businesses can build grounded AI assistants by embedding internal content, retrieving relevant chunks, and using chat generation for answers, summaries, or workflow-specific structured outputs.

Operations teams can use chat for intake extraction and classification, moderation for safety and compliance routing, and model listing for capability-aware routing and deprecation review.

Product and support teams can cluster feedback or tickets with embeddings, label the clusters with chat, and use moderation scores to prioritize sensitive queues. The endpoint fields support these workflows, but production systems still need logging, access control, human review, and pricing controls.

## Endpoint Group Summaries

### Chat Generation And Reasoning

`POST /mistral/chat` accepts model, messages, sampling controls, structured-output settings, tools, tool choice, reasoning effort, guardrails, and related generation options. It returns assistant messages, finish reasons, model ID, creation timestamp, and usage fields. Full details: [api-uses/chat-generation-and-reasoning.md](api-uses/chat-generation-and-reasoning.md).

### Semantic Embeddings And Retrieval

`POST /mistral/embed` accepts a model and text input, with optional output dimension, dtype, and encoding controls from the official provider schema. It returns embedding vectors with indexes and usage. Full details: [api-uses/semantic-embeddings-and-retrieval.md](api-uses/semantic-embeddings-and-retrieval.md).

### Content Safety And Policy Moderation

`POST /mistral/moderate` accepts a moderation model and text input, then returns category booleans and numeric category scores. It is best used as a signal for policy routing and review rather than as a complete enforcement system. Full details: [api-uses/content-safety-and-policy-moderation.md](api-uses/content-safety-and-policy-moderation.md).

### Model Discovery And Capability Selection

`POST /mistral/models` lists model metadata through the wrapper. Official provider schema fields include IDs, capability flags, context length, aliases, deprecation fields, default temperature, model type, and fine-tuned model lineage fields. Full details: [api-uses/model-discovery-and-capability-selection.md](api-uses/model-discovery-and-capability-selection.md).

## Field And Data Themes

Content fields dominate chat, embeddings, and moderation: `messages`, `input`, generated assistant content, embedding vectors, and category scores.

Operational metadata matters across all groups: `model`, model capabilities, `usage` token counts, context length, aliases, deprecation fields, and finish reasons.

Decision fields are strongest in moderation and model listing: category booleans/scores for policy decisions, and capability/deprecation/context fields for model-routing decisions.
