# Deepgram: Text Intelligence Analysis API Uses

## What This Endpoint Group Does

This endpoint group analyzes existing written text. It can summarize text, detect sentiment, identify topics, and recognize intents. Unlike the transcription endpoint, it does not require audio; it is useful when the content is already a chat log, transcript, support ticket, review, note, or document excerpt.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepgram/analyze` | Run text intelligence over supplied text. | `text`, `sentiment`, `summarize`, `topics`, `intents`, `language` | `summary`, `topics`, `intents`, `sentiments`, `metadata`, token accounting fields |

## Field Notes

### Inputs

`text` is required. Optional booleans select which intelligence outputs to generate: `sentiment`, `summarize`, `topics`, and `intents`. `language` provides a BCP-47 language hint and defaults to `en` in wrapper docs.

### Outputs

Provider docs show `metadata.metadata.request_id`, `created`, `language`, and optional model UUID plus token counts for each enabled feature. `results.summary.results.summary.text` contains a generated summary. Topic and intent outputs are segmented, with the segment text, start/end word offsets, labels, and confidence scores. Sentiment output includes segment-level sentiment plus an average sentiment and score.

### Important Constraints Or Gaps

The wrapper OpenAPI does not document a 200 response schema, so output fields are inferred from Deepgram `/v1/read` docs. The original provider supports URL or text input, callbacks, tags, custom topic and intent controls, and callback methods; the wrapper docs expose inline `text` and five simple options only. Text length limits are not documented in the wrapper. The output is model-generated and should be audited before automated high-impact decisions.

## Use Cases

### Support Ticket Triage

A support desk can run incoming ticket text through `sentiment`, `topics`, `intents`, and `summarize` before routing. Sentiment and intent fields can flag angry customers, cancellation threats, refund requests, setup confusion, or bug reports; topics can route issues to product areas; summaries can give agents a quick briefing.

For a personal workflow, someone managing a small business inbox could prioritize messages without reading each one in full. The endpoint helps decide which messages need immediate action, which can be batched, and which should be escalated. It does not replace human review for refunds, medical, legal, financial, or safety-sensitive replies.

### Customer Feedback And Review Mining

Product and marketing teams can process app reviews, survey responses, NPS comments, or community posts. `topics` reveal recurring themes, `sentiments` show pain or enthusiasm by segment, and summaries compress long free-form responses for product planning.

The business value is turning qualitative feedback into a triage queue: urgent negative themes go to support or product, positive recurring phrases inform positioning, and topic counts can guide roadmap discussions. The endpoint does not aggregate across many texts by itself; batching, storage, and trend analysis need a separate pipeline.

### Content Moderation Queue Enrichment

Community teams can analyze reported posts, comments, or chat transcripts to summarize the issue and identify intent or sentiment before human review. The fields can help sort "angry but benign" content from harassment reports, customer complaints, spam-like intent, or escalation language.

This is a decision-support use case, not an autonomous moderation system. The wrapper does not document safety-specific labels, policy taxonomies, or calibrated moderation categories. Human policy checks remain necessary, especially where false positives affect users.

### Research Note Distillation

Individuals, students, analysts, or researchers can paste notes, interview excerpts, or article snippets into the endpoint with summarization and topics enabled. The returned summary and topic segments make it easier to organize evidence, tag notes, and identify which source passages deserve deeper reading.

The most useful fields are summary text, topic segment text, word offsets, and confidence scores. The endpoint should not be treated as citation extraction or factual verification; it summarizes and labels supplied text but does not establish whether the content is true.

### Sales And Account Signal Extraction

Sales teams can analyze email replies, chat logs, discovery notes, or CRM notes for buyer intent, objections, sentiment, and topics. Intent segments can flag procurement, pricing, implementation, or renewal signals; sentiment can identify accounts that need executive attention; summaries can update CRM records.

The workflow value is routing and prioritization. It can suggest which opportunities need follow-up and what the rep should address. The endpoint does not expose company enrichment, contact data, or CRM identifiers, so those must come from other systems.
