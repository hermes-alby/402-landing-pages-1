# Diffbot: Job Posting Extraction API Uses

## What This Endpoint Group Does

This endpoint group covers Diffbot's `POST /diffbot/job` MPP wrapper. A caller supplies the public URL of a job posting and optional extraction controls, and the service returns structured hiring fields for the extracted job object. The main inputs are `url`, optional comma-separated `fields`, `timeout`, and `discussion`; the core outputs are `objects[]` records with job title/name, employer, locations, remote status, skills, requirements, tasks, posting date, summary, description, and Diffbot identity/provenance fields when present.

The group is useful for recruiting, job-search, competitive hiring intelligence, and labor-market monitoring when a workflow already has candidate job-post URLs and needs normalized hiring data. It is not a salary API or a live job board search endpoint. The reviewed JobPost ontology does not list salary or compensation fields, and Diffbot notes that ontology fields are not guaranteed to exist in every entity record.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/diffbot/job` | Extract structured details from a public job posting page. | Required `url`; optional `fields` for extra fields such as `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, or `quotes`; optional `timeout`; optional `discussion`. | `request.pageUrl`; `request.api`; `objects[].name`; `objects[].description`; `objects[].employer`; `objects[].locations`; `objects[].remote`; `objects[].skills`; `objects[].requirements`; `objects[].tasks`; `objects[].date`; `objects[].summary`; `objects[].jobCategories`; `objects[].language`; `objects[].id`; `objects[].diffbotUri`; `objects[].allUris`; `objects[].origins`; `objects[].originDetails`; `objects[].crawlTimestamp`; 402 payment error envelope when payment is missing. |

## Field Notes

### Inputs

`url` is the only required request field in the MPP OpenAPI and Locus docs. It should be the URL of a specific job posting page, not a search-results page, company careers index, or arbitrary site crawl target. The provider path mapped in the local inventory is Diffbot's `GET https://api.diffbot.com/v3/job`, but the assigned MPP wrapper exposes it as `POST /diffbot/job` with a JSON body.

`fields` is optional and is documented as a comma-separated list of extra fields. The local group inventory records the important values as `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, and `quotes`. These are page/extraction extras, not job-specific filters. A workflow should request them only when it needs trace links, page metadata, or breadcrumb context for audit and deduplication.

`timeout` is optional and is documented as a request timeout in milliseconds, with `30000` shown as the default in the OpenAPI-derived field description. It is a runtime control, not a guarantee of extraction completeness. A timeout or missing object should be treated as an extraction failure or unknown result, not evidence that the posting does not exist.

`discussion` is optional and inherited across Diffbot wrapper schemas as "Extract comments/discussion threads (default true for article)." For job extraction, its practical value is unclear from the reviewed sources. Set it deliberately rather than assuming it affects job-specific fields such as skills, requirements, or employer.

### Outputs

The main response unit is `objects[]`. The wrapper OpenAPI documents only a generic successful 200 response, so the response field list is derived from Diffbot's public JobPost ontology and official reference context. The ontology says fields are not guaranteed to exist in every entity record, so downstream code should preserve raw responses and tolerate missing, empty, or type-varying fields.

`objects[].name` is the primary job label, effectively the job title. `objects[].description` and `objects[].allDescriptions` hold longer posting text when extracted. `objects[].summary` is a short disambiguating phrase, not necessarily a complete job summary. `objects[].date` is the date the job was posted online, represented as a Diffbot date object in ontology examples.

`objects[].employer` is a `LinkedEntity`, so it may include organization identity fields such as `name`, `diffbotUri`, `targetDiffbotId`, `type`, `types`, image, and summary. This makes employer matching stronger than plain text, but the artifact should still be reconciled against source URLs because the exact wrapper runtime behavior was not tested.

`objects[].locations` is an array of `Location` objects. Ontology examples include address, city, region, country, metro area, latitude, longitude, and precision fields. `objects[].remote` captures remote status with documented possible values `REMOTE`, `NOT_REMOTE`, `HYBRID`, and `UNDEFINED`. The wrapper OpenAPI does not document these enum values directly; they come from the ontology.

`objects[].skills` is an array of `LinkedEntity` values for required skills. `objects[].requirements` and `objects[].tasks` are arrays of strings describing qualifications and responsibilities. These are the strongest fields for structured matching, but they are extracted from the posting text and may omit implicit requirements, employer-specific language, or content hidden behind scripts/authentication.

`objects[].jobCategories` is an array of `LinkedEntity` values for employment categories, with the ontology pointing to an `Employment Categories` taxonomy but not listing all possible values in the reviewed wrapper materials. `objects[].language` identifies the human language of the job text when available.

Identifier and provenance fields include `objects[].id`, `objects[].diffbotUri`, `objects[].allUris`, `objects[].allUriDetails`, `objects[].origins`, `objects[].originDetails`, `objects[].nbOrigins`, and `objects[].crawlTimestamp`. These are useful for deduplication, source audit, and refresh tracking. Some provenance fields are marked as extended JSON only in the ontology, and the MPP wrapper does not document whether extended JSON mode is exposed.

### Important Constraints Or Gaps

- The assigned MPP endpoint is paid. This artifact is based on local source snapshots and public documentation only; no paid extraction calls, wallet signatures, API keys, accounts, or mutations were used.
- The MPP OpenAPI records `x-payment-info.amount` as `4200` in the Tempo currency address `0x20c000000000000000000000b9537d11c60e8b50`; local research also records an estimated cost of `$0.004`.
- The wrapper OpenAPI documents request fields and 200/402 status descriptions but does not define a detailed 200 JSON schema.
- Salary, compensation, benefits, employment type, seniority, application deadline, application URL, recruiter contact, and visa/work-authorization fields were not present in the reviewed JobPost ontology fields.
- Exact wrapper behavior for redirects, unavailable pages, JavaScript-heavy postings, expired listings, duplicate postings, and extraction failures is not documented in the local source set.
- Source-site terms, privacy, copyright, employment-law rules, and anti-discrimination rules still apply. Extracted fields should not be used as the sole basis for consequential hiring decisions without human review and compliance controls.

## Use Cases

### Recruiting Lead Normalization

A recruiter or sourcing tool can turn a list of known job-posting URLs into a normalized intake table. Submit each posting URL and store `objects[].name`, `objects[].employer`, `objects[].locations`, `objects[].remote`, `objects[].skills`, `objects[].requirements`, `objects[].tasks`, `objects[].date`, and provenance fields such as `pageUrl`, `id`, `diffbotUri`, and `allUris`.

This helps compare roles across employer career pages that all use different HTML structures. The field-level caveat is important: missing `skills` or `requirements` should mean "not extracted" unless the source text has been reviewed. The workflow should keep `description` or a raw response snapshot so a recruiter can inspect the original posting when structured fields look incomplete.

### Job Search Matching And Alerts

A job-search assistant can use the endpoint after it has already discovered candidate job URLs from a job board, company site, search engine, or user-provided list. It can compare `skills`, `requirements`, `tasks`, `remote`, `locations`, `jobCategories`, and `date` against a user's preferences or resume-derived profile.

The useful output is a structured match explanation: why a role fits, which requirements are clear blockers, whether it is remote/hybrid/on-site, and where the job appears to be located. The endpoint should not be treated as proof that a job is still open, because the reviewed fields do not include a documented open/closed status or application deadline.

### Competitive Hiring Intelligence

A market-intelligence team can track selected competitors' career-posting URLs and normalize them into role titles, employers, categories, skills, requirements, tasks, posting dates, and locations. Over time, this can show where competitors are hiring, what skills appear repeatedly, and whether hiring is shifting toward specific regions or remote work.

This use case depends on preserving `date`, `crawlTimestamp`, `origins`, and source URLs so trend changes can be explained and refreshed. It should not infer headcount or actual hiring volume from one extracted posting without deduplication, because `allUris`, `origins`, and duplicate URLs may represent the same job across multiple pages.

### Labor-Market Skill Taxonomy Updates

A workforce analytics product can use `objects[].skills`, `objects[].requirements`, `objects[].tasks`, and `objects[].jobCategories` to update a skills taxonomy from public postings. The value is that skills are returned as linked entities where available, while requirements and tasks preserve the source wording that explains how the skill is used.

The output should feed a review or scoring process rather than automatically rewriting a taxonomy. The ontology does not promise every skill will be extracted, and job postings often use ambiguous or employer-specific language. Keeping `description`, `allDescriptions`, and `pageUrl` lets analysts verify whether a skill label came from the posting or from extraction normalization.

### Remote And Location Policy Monitoring

A job-board operator, relocation advisor, or recruiting operations team can monitor a curated set of postings for `remote` and `locations`. The endpoint's `remote` values support a simple classification of `REMOTE`, `NOT_REMOTE`, `HYBRID`, or `UNDEFINED`, while `locations` can include structured city, region, country, metro area, and coordinates.

This enables filters such as "hybrid roles in the Bay Area" or "remote engineering jobs posted this week." The limitations are that location precision varies by source page, `remote` can be `UNDEFINED`, and the wrapper docs do not expose a confidence score. Ambiguous cases should be routed for review rather than hidden.

### Applicant Workflow Enrichment

An individual job seeker or career platform can enrich saved job links with structured fields for comparison and application planning. `name`, `employer`, `locations`, `remote`, `requirements`, `tasks`, `skills`, `summary`, and `date` can populate a tracker that supports prioritization, cover-letter drafting, interview preparation, and reminders.

The endpoint is most useful when the user has already chosen the postings and needs the messy page text organized. It should not replace reading the posting. Salary, benefits, application instructions, and legal eligibility requirements are not documented output fields in the reviewed ontology and may need separate manual extraction from `description` or the original page.

### Job Posting Deduplication Across Sources

A data pipeline can use `id`, `diffbotUri`, `allUris`, `origins`, `originDetails`, `employer`, `name`, `locations`, and `date` to detect when the same role appears on an employer site, job board, and partner page. `allUris` and `origins` are especially relevant because they represent source pages associated with the entity.

The implementation should be conservative. The ontology marks some origin/provenance fields as extended JSON only, and the MPP wrapper does not document whether they always appear. A practical dedupe key should combine Diffbot identifiers when present with fallback comparisons on employer, normalized title, location, posting date, and source URL.
