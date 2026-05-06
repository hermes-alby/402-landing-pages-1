# Diffbot NL API Uses

## Service Summary

Diffbot NL is a third-party MPP wrapper for Diffbot's Natural Language API. It provides one paid text-analysis endpoint that can turn supplied freeform text into structured entities, linked identifiers, entity mentions, sentiment, facts with evidence, categories, sentence spans, language, Knowledge Graph-style records, and summaries.

The strongest uses are workflows where text needs to become auditable structured data: research triage, lead-note enrichment, customer feedback mining, due-diligence review, content routing, and knowledge graph seeding. The endpoint is not a general database lookup and should not be treated as a source of truth beyond the text supplied to it.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Text Understanding And Enrichment | 1 | Analyze raw text for linked entities, sentiment, facts, evidence passages, categories, sentence spans, language, records, and summaries. | [api-uses/text-understanding-and-enrichment.md](api-uses/text-understanding-and-enrichment.md) |

## Highest-Value Uses

- Evidence-backed research triage: extract salient entities, relationship facts, sentiment, summaries, and evidence passages from news, filings, memos, or reports.
- Lead and account note enrichment: turn company bios, inbound notes, and sales research into linked people, organizations, locations, facts, and summaries.
- Customer feedback mining: detect product or company mentions, entity-level sentiment, document sentiment, and source spans for review queues.
- Compliance and diligence pre-screening: identify parties, places, relationship claims, confidence, and supporting passages before human review.
- Knowledge graph seeding: convert narrative text into candidate entities and relationships with stable identifiers and evidence.

## Personal Use Opportunities

Individuals can use the endpoint to summarize and structure reading material, build personal research graphs, triage articles about companies or topics they follow, and extract entities and facts from notes. The main personal value is reducing rereading: `summary`, `entities[].salience`, `facts[].humanReadable`, and evidence passages show what a text is about and where key claims came from.

## Business Use Opportunities

Businesses can embed the endpoint in document intake, media monitoring, CRM enrichment, support triage, editorial routing, and analyst workflows. The useful operational fields are linked entity identifiers, entity types, mention offsets, sentiment, category confidence, fact confidence, and evidence passages. These fields make automation more defensible because reviewers can inspect the original text spans behind extracted data.

## Endpoint Group Summaries

### Text Understanding And Enrichment

The single endpoint, `POST /diffbot-nl/analyze`, accepts text plus optional field selection and upstream document hints. It can return the NLP signals needed to classify text, link entities, summarize content, extract relationship facts, and preserve source evidence. Full details: [api-uses/text-understanding-and-enrichment.md](api-uses/text-understanding-and-enrichment.md).

## Field And Data Themes

The API's most important data themes are:

- Entity linking: `diffbotUri`, `allUris`, and `allTypes` help connect extracted names to stable identifiers.
- Salience and sentiment: salience ranks which entities matter; document and entity sentiment support triage.
- Evidence: fact evidence passages and mention offsets keep extracted claims auditable.
- Classification: `categories`, `language`, and `summary` support routing and display.
- Graph structure: `facts`, `properties`, `qualifiers`, and `records` can seed downstream entity-relationship workflows.
