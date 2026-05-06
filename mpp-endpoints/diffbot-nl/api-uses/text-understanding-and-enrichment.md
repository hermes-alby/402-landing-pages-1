# Diffbot NL: Text Understanding And Enrichment API Uses

## What This Endpoint Group Does

This endpoint group turns raw text into structured NLP output. A caller submits text, optional language and format hints, optional document type context, optional summary settings, and requested output fields. The response can include linked entities, mentions with character offsets, entity-level and document-level sentiment, extracted facts with evidence passages, document categories, sentence spans, language detection, Knowledge Graph-style records, summaries, and per-document errors.

The group is useful when the value is not just "summarize this text", but "make this text operational": link people, companies, places, and products to stable identifiers; rank the important entities by salience; attach sentiment to the whole document and to specific entities; extract evidence-backed relationships; and keep offsets so the original passage can be highlighted or audited.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/diffbot-nl/analyze` | Analyze freeform text for entities, sentiment, facts, categories, sentences, language, and summary. | `content`, optional `fields`, upstream document fields such as `lang`, `format`, `documentType`, `customSummary.maxNumberOfSentences` | `entities`, `sentiment`, `facts`, `records`, `categories`, `sentences`, `language`, `summary`, `errors` |

## Field Notes

### Inputs

The wrapper documents `content` as either a single text string or an array of document objects. The official upstream OpenAPI models the request as `DocumentArray`, where each `Document` requires `content` and may include `lang`, `format`, `documentType`, and `customSummary`. `format` can be `plain text` or `plain text with title`; `documentType` can provide context such as `organization bio`, `person bio`, `news article`, `address`, or `discussion`; `customSummary.maxNumberOfSentences` can constrain summary length from 1 to 10 sentences.

`fields` selects output sections. Upstream documents it as an array query parameter with `entities`, `sentiment`, `facts`, `records`, `categories`, `sentences`, `language`, and `summary`. The MPP wrapper docs show it as a comma-separated request-body string.

### Outputs

The highest-value outputs are structured and auditable. `entities` includes `name`, `diffbotUri`, `confidence`, `salience`, `sentiment`, `allUris`, `allTypes`, mention spans, and optional coordinates for locations. `facts` includes readable relationships, subject and value entities, property metadata, qualifiers, confidence, and evidence passages with mention spans. `categories` can classify the document using IAB and Diffbot taxonomies. `sentences` and `mentions` preserve offsets back into the original text. `summary` and `language` support routing and display, while `records` can expose Knowledge Graph-style extracted entity attributes, though the Natural Language OpenAPI does not enumerate those record properties.

### Important Constraints Or Gaps

The MPP wrapper response schema is not documented in its OpenAPI, so response fields are based on the official upstream Diffbot Natural Language OpenAPI. The wrapper request schema also has drift: it declares `content` as a string but describes arrays of document objects in prose. Facts and other non-sentiment/entity features are English-only in the local Diffbot intro snapshot, while sentiment supports more than 100 languages and entity/salience support a smaller listed set. Open facts are described but marked disabled. The upstream docs set a 100,000-character maximum per document and 1,000,000 characters per API request. Costs are length-sensitive: Diffbot credits count one credit per 1 to 10,000-character document block, and the MPP service estimates `$0.004+ (per 10k chars)`.

## Use Cases

### Evidence-Backed News And Research Triage

A person tracking a company, founder, product, or policy topic can submit article text and request `entities`, `facts`, `sentiment`, `summary`, and `sentences`. `entities[].salience` helps separate the main subjects from incidental mentions, `facts[].humanReadable` and `facts[].evidence[].passage` expose relationship claims, and `summary` gives a short readout. This supports decisions like whether an article deserves manual review, whether a claimed relationship is actually in the source text, and which passages to cite.

For a business research team, the same fields can enrich media monitoring or competitive-intelligence queues. Instead of only keyword matching, the workflow can route stories by linked `diffbotUri`, entity type, fact property, category, and sentiment toward a named organization. The useful automation is not just alerting; it is prioritizing high-salience entity mentions, surfacing extracted facts with evidence, and sending analysts directly to the source spans that justify the extracted claim.

### Lead And Account Note Enrichment

A person managing a small pipeline can paste a company bio, founder profile, inbound email, or meeting note and receive linked organizations, people, locations, categories, and facts. The `documentType` hint can provide context, while entity types and `facts` can reveal headquarters, founder, affiliation, or other relationship claims when present in the text. `summary` turns long notes into a short CRM update.

For sales and customer-success teams, the endpoint can enrich inbound lead notes before routing. `entities[].allTypes` distinguishes people, organizations, locations, and products; `entities[].salience` identifies the account or buyer that matters most; `sentiment` can flag negative support context; and `facts[].evidence` keeps extracted CRM enrichment auditable. A limitation is that this endpoint extracts from supplied text; it is not a company database lookup unless `records` or linked entity URIs are later joined to a separate Diffbot Knowledge Graph workflow.

### Customer Feedback And Review Mining

A person can process product reviews, support messages, survey responses, or forum posts to identify which entities or products are mentioned and whether the surrounding sentiment is positive or negative. Entity-level `sentiment` matters because a review can praise one product while criticizing another. Mention offsets let a UI highlight the exact customer sentence behind a score.

For a business, this becomes a feedback-routing and product-insight tool. Support operations can route messages with strongly negative document `sentiment` to escalation queues, product teams can aggregate salient product or feature entities, and category output can split feedback into topical buckets. The workflow should retain evidence passages and original text because automated sentiment and entity extraction are decision-support signals, not a replacement for human review in high-impact customer actions.

### Compliance And Due-Diligence Source Review

A person reviewing a contract summary, public filing excerpt, policy memo, or investigative note can use extracted entities and facts to build a checklist of names, organizations, places, and relationships that require verification. `facts[].confidence`, `facts[].property`, and `facts[].evidence[].passage` help focus attention on claims rather than reading the whole text repeatedly.

For legal, compliance, and diligence teams, the practical value is auditable pre-screening. The endpoint can flag salient parties, locations, relationship facts, and negative sentiment in long narrative text, then hand reviewers evidence passages and offsets. It does not determine legal truth or compliance status. It only extracts what the supplied text appears to say, so teams still need source verification, privacy review, and policy controls before acting on sensitive personal or corporate data.

### Content Classification And Editorial Routing

A person managing a blog, newsletter, or reading queue can classify text with `categories`, detect `language`, and create a short `summary`. Combined with `entities[].salience`, this can sort articles by main topic and important named subjects instead of relying on titles alone.

For publishers, agencies, and knowledge-management teams, this supports routing content to desks, tagging archives, building entity pages, or deciding which items should be translated or summarized. Sentence spans and mention offsets enable richer editorial interfaces, such as highlighting all mentions of a person or organization. The output is strongest when paired with local taxonomy rules, because category confidence and entity salience need business-specific thresholds.

### Knowledge Graph Seeding From Unstructured Text

A person building a personal research graph can turn notes into nodes and relationships. `entities[].diffbotUri`, `allUris`, and `allTypes` provide stable linking hints; `facts` gives candidate edges; `evidence` stores the sentence that supports each edge. This can make a personal knowledge base easier to search and audit.

For businesses, this can seed internal knowledge graphs from reports, call notes, analyst memos, or web text. The valuable fields are identifiers, entity types, relationship properties, evidence passages, and confidence. The main limitation is that extraction is not canonical data governance by itself. Duplicate resolution, confidence thresholds, human approval, and joining against existing master data are still required before these extracted nodes and edges become system-of-record data.

### Multilingual Text Routing With Feature-Aware Fallbacks

A person dealing with multilingual text can request `language`, `sentiment`, `summary`, and `entities` to understand what language a document is in and what it is broadly about. The local Diffbot intro says sentiment supports over 100 languages, while entity and salience support a narrower language list and facts are English-only.

For global support, trust and safety, or market-research workflows, this enables feature-aware routing: use `language` to assign the right queue, use `sentiment` for broad urgency, and request entity/fact outputs only where the language supports those features. The important implementation detail is to avoid pretending all features work equally across languages. The workflow should record missing fields or unsupported-language behavior as a normal outcome.
