# Clado: Deep Research Job Workflow API Uses

## What This Endpoint Group Does

This group manages asynchronous people research. A user starts a job with a search query, polls for progress and results, can cancel unnecessary work, and can request more results from an existing job. It is useful when a search needs validation and richer profile bundles rather than a quick candidate list.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/clado/deep-research` | Start a deep-research job | `query`, `limit`, `hard_filter_company_urls` | `job_id`, `status`, `message` |
| POST | `/clado/deep-research-status` | Poll job status and retrieve results | `jobId`, `page`, `page_size` | `status`, `created_at`, progress counts, `results`, `pagination`, `error` |
| POST | `/clado/deep-research-cancel` | Cancel a running job | `jobId` | `success`, `message` |
| POST | `/clado/deep-research-more` | Request additional results | `jobId`, `additional_limit` | `job_id`, `status`, `message` |

## Field Notes

### Inputs

`query` defines the research target. `limit` and `additional_limit` control result volume. `hard_filter_company_urls` can restrict results to specific LinkedIn company URLs according to the MPP docs. `jobId` maps to the provider's native `job_id` path parameter. `page` and `page_size` make large result sets easier to consume.

### Outputs

The initial and continuation endpoints return `job_id`, `status`, and `message`. The status endpoint returns progress fields such as `opensearch_results`, `final_results_count`, `total_filtered`, `search_chunk_done`, and `search_chunk_total`, plus validated `results` using the same rich profile structures as search: profile, experience, education, posts, skills, projects, publications, patents, certifications, and GitHub repository signals where available.

### Important Constraints Or Gaps

Provider docs price initiation and continuation at one credit per result and describe status and cancel as free. The MPP wrapper/feed advertises fixed Tempo payment metadata for status and cancel, so the artifact preserves that drift rather than choosing one interpretation. Deep research is async; workflows need polling, backoff, cancellation, and duplicate-job controls.

## Use Cases

### Validated Executive Or Expert Shortlists

An individual investor, journalist, or founder can start deep research for "former payments infrastructure leaders at major fintechs" and review completed results only after Clado has filtered and validated profiles. A business can use the same workflow to build executive shortlists for sales, recruiting, expert-network calls, or partnership outreach.

The fields that matter are `final_results_count`, `total_filtered`, `profile.headline`, `experience.company_name`, `skills`, `posts`, and `recommendations`. These help decide whether a person is relevant enough for contact enrichment or manual outreach. Because the operation is billed by result, a workflow should start with a controlled `limit` and continue only if early results are strong.

### Company-Constrained Account Research

A sales or partnership team can use `hard_filter_company_urls` to research people at specific target organizations instead of relying on broad web search. A personal user could do the same for career networking at a shortlist of companies.

The resulting profile bundles expose current and prior roles, location, skills, and activity, which can support account maps: decision makers, technical evaluators, likely champions, and alumni ties. The gap is that the provider docs do not fully describe `hard_filter_company_urls` in the first-party request schema, so wrapper behavior should be verified with non-paid documentation before production reliance.

### Async Research Budget Control

An agent can start a job, poll `status`, monitor `search_chunk_done` versus `search_chunk_total`, and cancel jobs when the campaign, account, or query is no longer relevant. A business can use this to prevent stale research from consuming budget and to avoid overwhelming downstream systems with unneeded result pages.

The practical automation is a controller: if `final_results_count` is low after early chunks, adjust the query; if enough validated profiles exist, stop requesting more; if the status becomes `error`, route the query for human review. The MPP/provider pricing drift around status and cancel should be considered when estimating polling cost.

### Progressive Market Expansion

A recruiter or founder can initiate a narrow query, then call `deep-research-more` when the first batch shows good signal. A business can use this for progressive list building: seed a campaign with high-confidence prospects, measure conversion, then buy additional results only for winning segments.

`additional_limit`, `job_id`, and pagination fields make the workflow incremental. The result fields support downstream segmentation by location, skills, company, experience duration, and content activity. The limitation is that result freshness and exact ranking methodology are not publicly specified in the captured docs.
