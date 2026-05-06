# Clado API Uses

## Service Summary

Clado provides people search, LinkedIn profile enrichment, contact discovery, LinkedIn post engagement analysis, and asynchronous deep research for lead generation, recruiting, partnerships, and professional research. The assigned MPP service wraps 11 Clado endpoints behind `https://clado.mpp.paywithlocus.com/clado/` with HTTP 402/Tempo payment.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| People Search And Prospect Discovery | 1 | Find candidate profiles from natural-language criteria, company filters, school filters, and pagination. | [people-search-and-prospect-discovery.md](api-uses/people-search-and-prospect-discovery.md) |
| Deep Research Job Workflow | 4 | Start, poll, cancel, and expand async research jobs that return validated profile bundles. | [deep-research-job-workflow.md](api-uses/deep-research-job-workflow.md) |
| Profile And Contact Enrichment | 3 | Turn a known LinkedIn URL, email, or phone into profile details and reachable contact channels. | [profile-and-contact-enrichment.md](api-uses/profile-and-contact-enrichment.md) |
| LinkedIn Post Engagement Analysis | 1 | Inspect reaction counts and reacting profiles for a LinkedIn post. | [linkedin-post-engagement-analysis.md](api-uses/linkedin-post-engagement-analysis.md) |
| Bulk Contact Enrichment | 2 | Submit large batches for async email/phone enrichment and track yield, failures, and credits used. | [bulk-contact-enrichment.md](api-uses/bulk-contact-enrichment.md) |

## Highest-Value Uses

The strongest use is staged prospecting: search for people, inspect profile fit, then spend contact-enrichment budget only on high-fit records. This takes advantage of search fields such as `headline`, `experience`, `skills`, `location`, `posts`, and `is_decision_maker`, then uses contact fields such as `contacts[].value`, `contacts[].rating`, and `contacts[].subType` only when there is a plausible reason to reach out.

The second high-value use is async research for account maps and expert shortlists. Deep research exposes job progress, validated result counts, and rich profile bundles, making it suitable for workflows that need better precision than one quick search page.

The third high-value use is enrichment yield measurement. Bulk contact status returns `total_urls`, `processed`, `successful`, `failed`, `credits_used`, and per-record results, which lets teams compare the real cost per usable contact across lead sources.

## Personal Use Opportunities

Individuals can use search and profile enrichment to identify alumni, mentors, hiring managers, prospective cofounders, or subject-matter experts. The most useful fields are current role, employer, location, education, skills, public posts, and LinkedIn URL. Contact enrichment can help find a work email for a small number of high-fit people, but use should stay respectful and compliance-aware.

LinkedIn post reaction analysis can help a creator or founder understand who is engaging with a topic. Reacting profile headlines, LinkedIn URLs, reaction type, and timestamps provide a lightweight way to identify relevant people for follow-up or content planning.

## Business Use Opportunities

Sales teams can build targeted account maps, enrich selected prospects, and route records by role, company, seniority proxies, location, and engagement. Recruiting teams can map talent markets, validate candidate fit, and prepare outreach queues. Growth and operations teams can monitor contact-enrichment yield by source and suppress low-performing or high-risk segments.

The API is especially useful when a workflow combines multiple endpoint groups: search to find candidates, profile enrichment to verify fit, post reactions to identify current topical interest, and bulk contact enrichment to process only qualified lists.

## Endpoint Group Summaries

### People Search And Prospect Discovery

`POST /clado/search` is the discovery entry point. It accepts a natural-language `query`, optional organization/school filters, pagination fields, and advanced filtering. It returns profile, work, education, location, activity, and scoring-adjacent fields that support prospect and candidate triage. Full details: [people-search-and-prospect-discovery.md](api-uses/people-search-and-prospect-discovery.md).

### Deep Research Job Workflow

The deep research endpoints form an async lifecycle: start a job, poll status and results, cancel unneeded work, and request more results. They are useful for validated executive shortlists, company-constrained research, budget-controlled async workflows, and progressive market expansion. Full details: [deep-research-job-workflow.md](api-uses/deep-research-job-workflow.md).

### Profile And Contact Enrichment

The profile/contact group enriches known people. Contact lookup returns emails or phones with confidence ratings and contact subtype; scrape/profile endpoints return structured work-history and activity fields. This group is best used after search or deep research has established fit. Full details: [profile-and-contact-enrichment.md](api-uses/profile-and-contact-enrichment.md).

### LinkedIn Post Engagement Analysis

`POST /clado/post-reactions` turns a LinkedIn post URL into reaction counts and reacting profile records. It supports content resonance analysis, high-intent engager identification, and event or webinar follow-up lists. Full details: [linkedin-post-engagement-analysis.md](api-uses/linkedin-post-engagement-analysis.md).

### Bulk Contact Enrichment

Bulk contact enrichment handles list-scale async email/phone lookup. It is most valuable for CRM backfill, recruiting queue preparation, campaign yield analysis, and deterministic record reconciliation through `people_ids`. Full details: [bulk-contact-enrichment.md](api-uses/bulk-contact-enrichment.md).

## Field And Data Themes

Clado's most important input theme is person identity and targeting: natural-language query text, LinkedIn profile URLs, company and school filters, LinkedIn company URLs, email, phone, and caller-supplied people IDs. Important output themes are professional identity, work history, education, skills, location, public activity, contactability, reaction engagement, async job status, and cost/yield metrics.

The fields most directly tied to decisions are `is_decision_maker`, `headline`, `experience.company_name`, `skills`, `location_country`, `followers_count`, `post_count`, `contacts[].rating`, `contacts[].subType`, `reaction_type`, `successful`, `failed`, and `credits_used`.
