# EDGAR (SEC) API Uses

## Service Summary

SEC EDGAR is the primary public disclosure system for U.S. public companies, funds, insiders, and other SEC filers. The researched service is a Locus MPP wrapper around public SEC `data.sec.gov` APIs. It exposes paid POST calls for company submissions and standardized XBRL facts, while the upstream SEC APIs are public, unauthenticated, and free subject to SEC fair-access rules.

The highest-value opportunity is official, structured disclosure data without operating a full EDGAR ingestion pipeline: stable company identity by CIK, recent filing history, accession numbers and document locators, and machine-readable financial facts tied back to filing provenance.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Company Filing History And Profile | 1 | Company identity enrichment, filing monitoring, form/event triage, and construction of downstream filing-document retrieval queues. | [company-filing-history-and-profile.md](api-uses/company-filing-history-and-profile.md) |
| XBRL Financial Facts And Concepts | 2 | Structured financial-statement analysis, metric time series, broad company financial enrichment, audit checks, and comparable-company data collection. | [xbrl-financial-facts-and-concepts.md](api-uses/xbrl-financial-facts-and-concepts.md) |

## Highest-Value Uses

- Public-company filing monitors that alert on new 10-K, 10-Q, 8-K, proxy, registration, and ownership filings using form type, filing date, acceptance timestamp, item codes, accession number, and primary document.
- Investor and analyst workflows that pull standardized XBRL metrics such as revenue, assets, net income, share counts, and earnings per share for repeatable trend analysis.
- Company master-data enrichment keyed by CIK, combining names, tickers, exchanges, SIC, EIN, fiscal year end, incorporation state, addresses, and former names.
- Audit, accounting, and compliance checks that trace a normalized financial value back to its accession number, filing form, fiscal period, and filed date.
- EDGAR ingestion pipelines that use submissions metadata to prioritize filing fetches, choose XBRL-aware processing, and separate recent monitoring from historical backfills.

## Personal Use Opportunities

- Track filings for a watchlist of public companies and get low-latency signals when annual reports, quarterly reports, material-event 8-Ks, proxy statements, or ownership forms appear.
- Pull a company's official SEC profile before investing, including ticker/exchange associations, industry classification, fiscal year end, incorporation state, and former names.
- Compare reported fundamentals over time from SEC-standard XBRL facts instead of relying only on scraped pages or secondary data vendors.
- Inspect filing provenance for a reported number: which filing supplied it, when it was filed, what period it covers, and what unit it used.

## Business Use Opportunities

- Build public-company enrichment for fintech, CRM, procurement, KYB, risk, and due-diligence products using CIK-centered identity and listing metadata.
- Power analyst dashboards and screening systems with structured company facts and targeted concept time series.
- Automate compliance review queues for legal, governance, audit, and finance teams by routing filings based on form type, 8-K item codes, XBRL flags, and filer metadata.
- Maintain normalized SEC datasets without running a full crawler for every user request; use the API for targeted lookups and bulk SEC ZIP files for large backfills.
- Create agent tools that answer company-filing and financial-fact questions with official SEC identifiers and source-filing traceability.

## Endpoint Group Summaries

### Company Filing History And Profile

This group covers `POST /edgar/company-submissions`, a paid wrapper around SEC submissions JSON for one CIK. It is the best discovery surface for who a filer is and what it has recently filed: names, tickers, exchanges, SIC, EIN, fiscal year end, state of incorporation, addresses, former names, filing forms, dates, accession numbers, XBRL flags, primary documents, and older filing-history file references. Full details: [company-filing-history-and-profile.md](api-uses/company-filing-history-and-profile.md).

### XBRL Financial Facts And Concepts

This group covers `POST /edgar/company-facts` and `POST /edgar/company-concept`. `company-facts` retrieves the broad standardized XBRL fact set for a filer, while `company-concept` retrieves the full time series for one taxonomy/tag pair. Together they support financial statement trend analysis, metric discovery, audit cross-checks, and comparable-company datasets using values, units, accession numbers, fiscal periods, forms, filed dates, and reporting-period dates. Full details: [xbrl-financial-facts-and-concepts.md](api-uses/xbrl-financial-facts-and-concepts.md).

## Field And Data Themes

- Stable identifiers: CIK is the primary filer key; tickers, exchanges, SIC, EIN, accession numbers, file numbers, taxonomy names, XBRL tags, and frames provide secondary joins.
- Filing provenance: form type, filing date, report date, acceptance timestamp, accession number, primary document, and XBRL flags let workflows route, fetch, and audit source disclosures.
- Financial values: XBRL `val` fields must be interpreted with unit keys and fiscal context, including fiscal year, fiscal period, form, filed date, start date, end date, and optional frame.
- Entity context: company names, former names, entity type, incorporation state, fiscal year end, business/mailing addresses, and SIC description are useful for enrichment and matching.
- Discovery pattern: use submissions for identity and filing events; use company facts to discover available XBRL concepts; use company concept for targeted metric time series.
