# Mistral AI: Content Safety And Policy Moderation API Uses

## What This Endpoint Group Does

This endpoint group classifies text for safety and policy risk. The MPP wrapper exposes `POST /mistral/moderate`, which maps most closely to official `POST /v1/moderations`. The official API also documents chat moderation separately, but the wrapper docs only describe text or array text input.

The response fields are designed for decisions: `results[].categories` gives category threshold booleans, and `results[].category_scores` gives numeric risk scores. Official examples include category keys such as sexual, hate and discrimination, violence and threats, dangerous and criminal content, self-harm, health, financial, law, and PII.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mistral/moderate` | Classify content for safety and policy categories. | `model`, `input`, `metadata` | `id`, `model`, `results[].categories`, `results[].category_scores` |

## Field Notes

### Inputs

The required inputs are `model` and `input`. The wrapper docs use `mistral-moderation-latest` as an example model. `input` can be a string or array of strings in the official schema and wrapper prose. `metadata` exists in the official classification request schema but is not called out in the wrapper docs.

### Outputs

`results[].categories` is an object whose keys are moderation categories and values are booleans indicating whether thresholds were crossed. `results[].category_scores` is an object with numeric scores for the same or related categories.

These fields support different application postures: category booleans are simple routing gates, while category scores support thresholds, review queues, trend analysis, and softer interventions.

### Important Constraints Or Gaps

The official schema leaves category names as dynamic additional properties. Category names listed in this artifact are from official examples, not a fixed enum. The endpoint returns safety signals, not policy enforcement; applications must decide thresholds, appeals, logging, user messaging, and human-review paths.

The wrapper does not document chat-shaped moderation input, even though official Mistral has `POST /v1/chat/moderations`. This artifact treats `/mistral/moderate` as text moderation unless wrapper behavior is separately verified.

## Use Cases

### Pre-Publish User Content Screening

A person running a small community, blog, or shared workspace can screen comments or posts before publishing. A business can screen marketplace listings, reviews, forum posts, support attachments converted to text, or user-generated profile text. The workflow sends proposed content in `input` with a moderation model and reads `results[].categories` and `results[].category_scores`.

The category booleans can block clearly risky posts, while scores can route borderline cases to moderators. This reduces manual review load and catches categories like violence, hate, sexual content, self-harm, or PII before publication. The endpoint should not be the only appeal mechanism; false positives and context-sensitive content need human review.

### Customer Support And Trust Queue Routing

A support system can screen inbound tickets for self-harm, threats, abuse, legal/financial claims, or exposed personal data. `input` contains ticket text; category scores determine which queue receives it. For example, high `selfharm` can route to urgent safety handling, while high `pii` can trigger redaction or restricted access.

The output helps businesses prioritize response time and specialist assignment without reading every ticket manually first. A personal user could similarly filter a shared inbox or family-safety monitoring workflow. The key limitation is that moderation does not understand the organization's full policy; custom escalation rules must be layered on top.

### LLM Input And Output Guardrails

A developer can moderate user prompts before sending them to chat generation and moderate model outputs before showing them to users. The fields that matter are `input`, `results[].categories`, and `results[].category_scores`; the calling application can decide whether to block, rewrite, ask for clarification, or route to a safer flow.

For a business, this is valuable in AI assistants, internal copilots, sales bots, and education tools where generated or user-submitted content may contain unsafe instructions or sensitive data. The caveat is that the chat endpoint also has `guardrails` and `safe_prompt`; teams should define how standalone moderation, chat guardrails, logging, and human review interact.

### PII And Sensitive-Topic Detection Before Storage

A person can screen notes or transcripts for accidental sensitive information before syncing to a shared tool. A business can check documents, chat logs, or form submissions for PII or sensitive legal, financial, or health topics before indexing, analytics, or model training. The output keys `pii`, `law`, `financial`, and `health` are especially relevant where present.

The moderation response enables redaction queues, restricted storage, or additional consent steps. It does not replace dedicated data-loss-prevention tools because category keys and thresholds are not guaranteed to cover every jurisdiction-specific definition of sensitive data.

### Abuse Trend Monitoring

A community or platform team can aggregate `category_scores` over time to detect spikes in harassment, threats, or illegal-content attempts. `model`, response `id`, and score objects support auditable event logs when joined with internal timestamps and content IDs outside the endpoint.

The returned data helps decide staffing, rate limits, feature changes, and policy updates. The endpoint itself does not provide timestamps, user IDs, or enforcement history; those must come from the application log. Aggregated moderation analytics should avoid storing raw sensitive content longer than necessary.
