# EDGAR Full-Text Search: Filing Full-Text Search API Uses

## What This Endpoint Group Does

This endpoint group lets a client search public SEC filing text with a required query and optional filters for form type, company/entity, custom filing date range, and result count. It is a paid MPP wrapper around the free SEC EDGAR Full-Text Search surface.

The practical value is targeted discovery. Instead of downloading indexes or browsing SEC search manually, an agent can ask a narrow question such as which recent 10-K filings mention "material weakness" or which 8-K filings mention "going concern", then use the returned filing dates, entity names, form types, and accession numbers to decide what filings need deeper review.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/edgar-search/search` | Search SEC EDGAR filing text and return matching filing records. | `q`; optional `forms`, `dateRange`, `startdt`, `enddt`, `entity`, `hits`. | Matching filings with filing dates, entity names, form types, and accession numbers; exact JSON schema not published. |

## Field Notes

### Inputs

`q` is the required search query. The SEC FAQ confirms keyword search, exact phrases, implied AND behavior, `OR`, `NOT` or hyphen exclusions, `NEAR()`, and suffix wildcard searches. Natural-language search is not supported, so users should craft precise terms rather than conversational prompts.

`forms` narrows results to filing types such as `10-K`, `10-Q`, `8-K`, or comma-separated combinations. `dateRange`, `startdt`, and `enddt` support custom filing windows when `dateRange` is set to `custom`. The SEC UI also has preset ranges such as last 30 days, last year, last 5 years, last 10 years, and all since 2001, but the wrapper documents only custom-date fields. `entity` filters by company name according to the wrapper docs; upstream SEC UI supports company, ticker, CIK, and individual-name search, but the wrapper's exact accepted values are not documented. `hits` caps result count, with default 10 and max 10.

### Outputs

The wrapper markdown says successful searches return matching filings with filing dates, entity names, form types, and accession numbers. Those fields can identify the relevant issuer, filing type, filing date, and SEC accession record for follow-up retrieval or citation.

The MPP OpenAPI does not publish the 200 response schema. It is unknown whether successful results include filing URLs, snippets, CIKs, relevance scores, period dates, accepted timestamps, exhibit paths, or upstream SEC facets. The upstream blank-search snapshot shows a JSON validation error with `error` and `hits.hits`, but that is not enough to prove the wrapper's successful schema.

### Important Constraints Or Gaps

The endpoint is payment-gated through HTTP 402 auto-payment and has a fixed manifest/OpenAPI Tempo amount of `8000`. The SEC upstream service is free, so the MPP value is wrapper convenience rather than avoiding SEC provider pricing.

SEC automated access requires fair-use behavior, efficient scripting, and a declared user agent. The current SEC fair-access guidance in the saved snapshot says automated access should stay within the 10 requests/second guideline. For this worker, no valid SEC search and no paid wrapper call were performed.

Search results are discovery metadata, not investment, legal, or compliance conclusions. Filing language can be boilerplate, negated, stale, amended, or superseded. Workflows should fetch and review the actual filing document before acting on a hit.

EDGAR coverage and freshness have limits. Full-Text Search covers electronic filings since 2001 according to the SEC UI/FAQ. Current business-day indexes update nightly, some submissions disseminate the next business day, post-acceptance corrections can alter indexes, and some paper filings are not available through EDGAR.

## Use Cases

### Disclosure Risk Monitoring

An investor, legal analyst, or compliance team can search for phrases such as "material weakness", "going concern", "substantial doubt", "restatement", "cybersecurity incident", or "supply chain disruption" across recent `10-K`, `10-Q`, and `8-K` filings. The `forms`, `startdt`, `enddt`, and `hits` fields keep the search focused, while returned entity names, form types, filing dates, and accession numbers identify which filings should be reviewed first.

For a business, this supports periodic watchlists of suppliers, portfolio companies, borrowers, or acquisition targets. The output can trigger a manual filing review, alert a risk owner, or enqueue accession numbers for downstream EDGAR document retrieval. The limitation is that a hit only proves term presence, not severity or context; the actual filing text and amendments still need review.

### Investor Thesis And Earnings Prep

A personal investor can search a target company for recurring terms such as "AI", "pricing pressure", "backlog", "customer concentration", or "liquidity" across recent annual and quarterly filings. `entity`, `forms`, and a custom date range help isolate the issuer and period, while filing dates and form types show where the language appears.

An investment team can use the same endpoint to pre-screen a basket of companies before earnings calls or investment committee meetings. Search hits can guide analysts to the specific filings and accession numbers that deserve closer reading, reducing time spent opening irrelevant EDGAR pages. Because `hits` is capped at 10 and the response schema is not fully documented, this is best used for targeted prompts rather than exhaustive corpus analysis.

### Legal And Regulatory Due Diligence

Law firms, audit teams, and corporate development groups can search for clauses or topics across public filings during diligence. Examples include "change in control", "related party", "sanctions", "material adverse", "internal control", "remediation plan", or named litigation matters. Form and date filters keep reviews aligned to the diligence scope.

The returned metadata can become a triage list for counsel: which issuers, filing types, filing dates, and accession records require full-document review. This is valuable when a team needs fast coverage across many filings but does not want to treat search hits as final legal analysis. Important caveats include search syntax limitations, missing full response schema, and the need to inspect original filings for context, exhibits, and amendments.

### Competitive And Market Narrative Tracking

Product, strategy, or market-intelligence teams can search public-company filings for how competitors discuss markets, technologies, geographies, or regulations. Queries such as `"generative AI"`, `"GPU supply"`, `"IRA tax credit"`, `"GLP-1"`, or `"carbon capture"` across `10-K`, `10-Q`, and `8-K` filings can reveal which companies are mentioning a theme and when.

The endpoint's strongest contribution is evidence-backed discovery. Entity names, filing dates, form types, and accession numbers provide a defensible trail from a trend question to source filings. The workflow should still download and quote from the original filing for reports, because the wrapper docs do not promise snippets or full text in the search response.

### Journalist And Academic Filing Discovery

Journalists and researchers can use targeted Boolean search to find companies that mention an issue across filings since 2001 or within a custom period. Exact phrases, `OR`, `NOT`, `NEAR()`, and suffix wildcard searches help construct reproducible searches for themes such as climate-risk language, executive compensation terms, data breaches, opioid litigation, or foreign operations.

For institutions, this supports source discovery before building a dataset. The search output can seed a list of accession numbers for manual coding or downstream bulk retrieval. The endpoint does not replace full corpus access: it has a documented max of 10 hits per request, unknown pagination behavior, and no published schema for snippets or relevance scores.

### Vendor, Customer, And Counterparty Screening

Procurement, credit, and partnership teams can search known public-company counterparties for terms relevant to operational risk, such as "bankruptcy", "material weakness", "going concern", "default", "supply disruption", or named regulatory matters. `entity` and date filters keep the search limited to the counterparty and current review period.

The returned filing metadata helps decide whether a counterparty needs enhanced diligence, legal escalation, credit review, or ongoing monitoring. This is especially useful where a business has many public-company vendors or customers and only needs to identify filings worth deeper reading. It should not be used as a sole adverse-media or credit-risk system because it covers SEC filings only and may miss private companies, non-U.S. disclosures, and context outside EDGAR.
