# Clado: Bulk Contact Enrichment API Uses

## What This Endpoint Group Does

This group enriches many people in one asynchronous job. A caller submits LinkedIn profile URLs or people IDs, asks for email and/or phone enrichment, then polls the status endpoint for processing counts, credits used, and per-record results.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/clado/bulk-contacts` | Start a bulk contact enrichment job | `linkedin_urls`, `people_ids`, `email_enrichment`, `phone_enrichment` | `job_id`, `status`, `message` |
| POST | `/clado/bulk-contacts-status` | Retrieve bulk job status and results | `jobId` | `status`, `total_urls`, `processed`, `successful`, `failed`, `credits_used`, `results`, `created_at`, `completed_at` |

## Field Notes

### Inputs

`linkedin_urls` is the primary batch input and is documented by the first-party OpenAPI as required with a maximum of 5000 URLs. `people_ids` can preserve a caller's own identifiers through the enrichment result. `email_enrichment` and `phone_enrichment` control whether the job searches for emails, phones, or both.

### Outputs

The start endpoint returns `job_id`, `status`, and `message`. The status endpoint returns progress and accounting fields: `total_urls`, `processed`, `successful`, `failed`, `credits_used`, timestamps, and `results[]` containing each `linkedin_url`, optional `people_id`, `success`, contact `data`, or `error`.

### Important Constraints Or Gaps

The MPP OpenAPI marks `linkedin_urls` and `people_ids` as strings, while the Paywithlocus Markdown and first-party OpenAPI document arrays. Native docs price email at four credits per successful find and phone at ten credits per successful find; the MPP docs summarize this as `$0.04+/contact`. Provider docs call status free, but the MPP wrapper/feed advertises a fixed Tempo payment amount for `/clado/bulk-contacts-status`.

## Use Cases

### CRM Backfill For Qualified Leads

A sales team can submit a list of already-qualified LinkedIn URLs from events, referrals, or Clado search and use `people_ids` to map results back to CRM lead IDs. The returned `successful`, `failed`, `credits_used`, and per-record `data` fields let operations teams update contact records while measuring yield and cost.

This is valuable because enrichment happens after qualification, not before. A workflow can reject low-fit profiles during search or profile enrichment, then spend contact-enrichment budget only on people likely to receive relevant outreach. Compliance and consent policies should govern which enriched contact channels are stored or used.

### Recruiting Outreach Queue Preparation

A recruiter can batch-enrich candidates who passed a role-fit screen and use `people_ids` to preserve application, referral, or sourcing IDs. A recruiting agency can use `successful` and `failed` counts to decide whether a sourcing channel is worth continuing.

The key outputs are `results[].people_id`, `results[].success`, `results[].data`, and `results[].error`. These make it possible to route successful records to outreach, failed records to manual research, and error-heavy jobs to source-quality review. Phone enrichment is more expensive and more sensitive, so many workflows should default to email-only unless phone contact is explicitly justified.

### Campaign Cost And Yield Monitoring

A growth team can compare `credits_used`, `successful`, and `failed` across batches to understand the real cost per usable contact for each source segment. A personal operator running a small campaign can stop a batch strategy when the successful-enrichment rate is too low.

The status endpoint's accounting fields support concrete decisions: pause low-yield sources, split batches by source quality, or use cheaper profile-only checks before attempting contact enrichment. The MPP/provider pricing drift for status polling should be included in cost models until clarified.

### Data Hygiene And Identifier Reconciliation

Businesses that already have `people_ids` from an internal database can use bulk enrichment to attach fresh contact data while preserving row-level lineage. `results[].linkedin_url`, `results[].people_id`, and `results[].error` support deterministic updates and audit trails.

This is useful for CRM cleanup, alumni database maintenance, or community records where the team needs to know exactly which records changed and why. The endpoint does not by itself validate whether outreach is appropriate; downstream systems should enforce suppression lists and consent requirements.
