# EDGAR Full-Text Search API Uses

## Service Summary

EDGAR Full-Text Search is a paid MPP wrapper around the SEC's free public EDGAR full-text search. It exposes one practical capability: submit a targeted filing search with keyword, form type, company/entity, date range, and result-count fields, then receive matching filing metadata.

The service is most useful as a discovery step before deeper filing retrieval and review. It can point a user or agent to relevant issuers, form types, filing dates, and accession numbers, but it should not be treated as a full filing corpus, a legal conclusion engine, or a substitute for reading the source filing.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Filing Full-Text Search | 1 | Search public SEC filing text for specific disclosure terms, companies/entities, form types, and filing date ranges. | [`api-uses/filing-full-text-search.md`](api-uses/filing-full-text-search.md) |

## Highest-Value Uses

The highest-value use is targeted disclosure triage. Analysts can search for phrases like "material weakness", "going concern", "cybersecurity incident", or "customer concentration" and quickly identify which filings deserve human review.

The endpoint is also valuable for research workflows that need provenance. Entity names, form types, filing dates, and accession numbers can link a thematic question to concrete SEC records before downstream retrieval, summarization, citation, or risk review.

## Personal Use Opportunities

- Search a company before investing to find filings that mention risks, restatements, liquidity concerns, AI strategy, climate exposure, or other thesis-relevant terms.
- Build a focused reading list of recent `10-K`, `10-Q`, or `8-K` filings for a watchlist company.
- Use accession numbers from search results as durable anchors for later filing retrieval and notes.

## Business Use Opportunities

- Monitor portfolio companies, suppliers, borrowers, or acquisition targets for disclosure-risk terms and route hits to legal, credit, audit, or investment teams.
- Track competitor and market narratives by searching filing language for technologies, regulatory topics, geographies, or product categories.
- Seed research datasets with accession numbers for full-document retrieval, manual coding, or downstream analysis.
- Support journalist, academic, and policy research by turning precise Boolean searches into source-backed filing leads.

## Endpoint Group Summaries

### Filing Full-Text Search

This group covers `POST /edgar-search/search`. It accepts required `q` plus optional `forms`, `dateRange`, `startdt`, `enddt`, `entity`, and `hits`, then returns matching filing metadata according to the wrapper docs. It is best suited to narrow discovery and triage rather than exhaustive analysis, because the captured OpenAPI lacks a 200 schema and the docs state `hits` defaults to 10 with max 10.

Full details: [`api-uses/filing-full-text-search.md`](api-uses/filing-full-text-search.md)

## Field And Data Themes

- Query text: `q` carries keyword, phrase, Boolean, proximity, and wildcard searches.
- Filters: `forms`, `dateRange`, `startdt`, `enddt`, `entity`, and `hits` narrow the search scope.
- Filing identifiers: accession numbers, form types, entity names, and filing dates are the documented output themes.
- Payment metadata: the MPP feed/OpenAPI list a fixed Tempo charge of `8000`; the wrapper markdown estimates `$0.005 + $0.003 fee`.
- Source provenance: useful workflows should preserve accession numbers and later verify source filings directly.
