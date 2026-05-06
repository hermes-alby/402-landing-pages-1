# EDGAR (SEC): Company Filing History And Profile API Uses

## What This Endpoint Group Does

This endpoint group looks up one SEC filer by Central Index Key (CIK) and returns the filer profile plus recent EDGAR filing history. It is the discovery and monitoring surface for answering questions such as who the filer is, where it is listed, what industry and fiscal year end it reports under, which forms it has recently filed, and which accession numbers or primary document filenames should be used for follow-on document retrieval.

The Locus MPP route wraps the public SEC submissions API. The upstream SEC route is `GET https://data.sec.gov/submissions/CIK##########.json`; the MPP route exposes it as a paid `POST /edgar/company-submissions` call with a JSON body containing `cik`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/edgar/company-submissions` | Retrieve company or filer identity metadata and recent filing history for one SEC CIK. | JSON body field `cik`; Locus docs say the value is automatically zero-padded to the 10-digit SEC CIK format. | CIK, entity type, name, tickers, exchanges, SIC, EIN, fiscal year end, state of incorporation, addresses, former names, recent filing arrays, accession numbers, filing dates, report dates, acceptance timestamps, form types, item codes, XBRL flags, primary documents, and historical filing-file references. |

## Field Notes

### Inputs

The only documented request body field is `cik`, a required string. SEC submissions URLs require the CIK as a 10-digit value with leading zeros, while the Locus documentation says its company-submissions wrapper accepts examples such as `320193` and automatically pads them.

Callers should treat CIK as the stable primary key. SEC guidance notes that CIKs are unique to filers and are not recycled, but name associations can be historical and cumulative, so name matching alone is not a reliable identifier.

### Outputs

The profile fields support company enrichment and identity matching: `cik`, `entityType`, `name`, `tickers`, `exchanges`, `sic`, `sicDescription`, `ein`, `fiscalYearEnd`, `stateOfIncorporation`, mailing and business addresses, phone when present, and `formerNames`.

The filing history is returned in compact arrays under `filings.recent`. Important fields include `accessionNumber`, `filingDate`, `reportDate`, `acceptanceDateTime`, `form`, `fileNumber`, `filmNumber`, `items`, `size`, `isXBRL`, `isInlineXBRL`, `primaryDocument`, and `primaryDocDescription`. The `filings.files` array points to older submission-history JSON files, with fields such as file `name`, `filingCount`, `filingFrom`, and `filingTo`.

### Important Constraints Or Gaps

The MPP route requires Tempo HTTP 402 payment and is documented at an estimated cost of `$0.005 + $0.003 fee` per request. The upstream SEC `data.sec.gov` API is public and unauthenticated, subject to SEC fair-access rules.

SEC fair-access guidance says scripted users should limit traffic to the current maximum of 10 requests per second, use efficient downloading, and declare a user agent. SEC also says `data.sec.gov` does not support CORS.

The SEC submissions API is updated throughout the day in real time as filings are disseminated, with a typical processing delay of less than a second for submissions. Bulk submissions ZIP files are available for large retrieval jobs and are recompiled nightly around 3:00 a.m. ET.

This endpoint returns metadata and filing locators, not the full filing document contents. To fetch the actual document, a caller needs to construct or use an SEC archive URL from the CIK, accession number, and document filename.

The MPP OpenAPI declares the request schema and 402 status but does not publish a detailed 200 response schema or payment-challenge body schema. The field list here is derived from SEC submissions API behavior, endpoint inventory, and Locus route prose; the wrapper was not sampled because paid calls are out of scope.

## Use Cases

### Public Company Filing Monitor

An investor relations team, analyst desk, or compliance tool can poll this endpoint by CIK to detect new forms for tracked public companies. The most important fields are `filings.recent.form`, `filingDate`, `acceptanceDateTime`, `accessionNumber`, `items`, `primaryDocument`, and `primaryDocDescription`, because those fields indicate what was filed, when EDGAR accepted it, and which filing object should be opened next.

This is valuable when the workflow needs a low-latency signal rather than full document parsing. A new `10-K`, `10-Q`, `8-K`, `DEF 14A`, or ownership form can trigger analyst review, customer alerts, model refreshes, or downstream archive retrieval. `items` are especially useful for 8-K triage because they help route material-event filings to the right reviewer.

### Company Profile Enrichment

A fintech, CRM, procurement, or due-diligence product can use the endpoint to normalize a known CIK into SEC-backed company metadata. Fields such as `name`, `tickers`, `exchanges`, `sic`, `sicDescription`, `ein`, `fiscalYearEnd`, `stateOfIncorporation`, and addresses help connect a company record to market listings, industry classification, corporate jurisdiction, and contact/location data.

The returned `formerNames` field helps reconcile historical names, acquisitions, or rebrands without relying only on current ticker symbols. That makes the endpoint useful for onboarding public-company customers, enriching account records, validating entities in a watchlist, or building a canonical company master keyed by CIK.

### Filing Document Retrieval Queue

A data engineering team can use this endpoint as the first step in an EDGAR ingestion pipeline. `accessionNumber`, `primaryDocument`, `form`, `filingDate`, `reportDate`, `isXBRL`, `isInlineXBRL`, and `size` let the pipeline decide which filings to fetch, how to prioritize them, and whether XBRL-aware processing should run after document retrieval.

The endpoint does not return the full filing content, but it provides the locator fields needed to build SEC archive paths. `filings.files` also tells the pipeline when older filing-history files exist and what date ranges they cover, which helps separate recent monitoring from backfill jobs.

### Governance And Event Review

Legal, governance, and compliance teams can use the endpoint to watch form patterns for issuers, funds, insiders, or other EDGAR filers. Form types, filing dates, report dates, file numbers, item codes, and accession numbers help reviewers identify proxy materials, registration statements, current reports, annual reports, and ownership filings that require policy or legal review.

The value is not only that a filing exists, but that it is tied to a stable filer identity and document locator. A workflow can combine `stateOfIncorporation`, `entityType`, `sicDescription`, `fiscalYearEnd`, and recent form history to route filings to the right subject-matter experts and preserve audit evidence of what was reviewed.
