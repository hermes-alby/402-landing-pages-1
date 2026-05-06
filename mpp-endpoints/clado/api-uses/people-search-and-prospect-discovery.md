# Clado: People Search And Prospect Discovery API Uses

## What This Endpoint Group Does

This group turns a natural-language people-search request into structured LinkedIn profile candidates. It is the front door for discovery: a user can describe the kind of person they want, optionally constrain by companies or schools, page through results with `search_id` and `offset`, and choose whether Clado's advanced AI filtering should trade volume for relevance.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/clado/search` | Search for people by query and filters | `query`, `limit`, `offset`, `search_id`, `companies`, `schools`, `advanced_filtering` | `results[].profile`, `experience`, `education`, `posts`, `total`, `query`, `search_id` |

## Field Notes

### Inputs

`query` is the main discovery prompt, such as a role, function, industry, seniority, or skill combination. `companies` and `schools` narrow the search to known organizations or alumni pools. `limit`, `offset`, and `search_id` support pagination. `advanced_filtering` defaults on in the first-party docs and asks an AI agent to review candidates before returning them.

### Outputs

The response returns profile identity fields (`id`, `name`, `headline`, `linkedin_url`, `picture_permalink`), location (`location`, `location_country`, `location_regions`), work and education history, public activity (`posts`, `liked_posts`, post metrics), and qualification signals such as `skills`, `is_working`, `is_decision_maker`, `connections_count`, `followers_count`, `recommendations_count`, and `total_experience_duration_months`.

### Important Constraints Or Gaps

The MPP wrapper is `POST`, while the first-party API documents `GET /api/search`. The MPP OpenAPI marks `companies` and `schools` as strings, but Paywithlocus Markdown and the first-party docs describe arrays. Native Clado pricing is one credit per returned result with advanced filtering, or five credits fixed when `advanced_filtering=false`; MPP pricing is advertised as `$0.01/result`.

## Use Cases

### Build A Target Account Prospect List

A founder, recruiter, or sales rep can search for people matching a narrow buyer or candidate profile, then use `headline`, `experience.company_name`, `skills`, `location_country`, and `is_decision_maker` to decide who deserves manual review. A business can use the same fields to pre-segment prospects by current company, role, geography, seniority proxy, and recent activity before routing them into a CRM enrichment queue.

The useful decision is not simply "show a list"; the returned work history and activity fields support prioritization. A prospect with the right title, current employer, relevant skills, and recent topical posts can be routed ahead of a weaker title match. The main caveat is that direct outreach still requires contact enrichment or another consent-aware contact source.

### Alumni And Warm-Intro Discovery

An individual can search within `schools` to find alumni in a target industry or company before asking for advice or referrals. A business development or recruiting team can combine school filters with `companies`, `headline`, and `experience` to identify likely warm-introduction paths across a portfolio, university network, or customer community.

The fields that matter are `education.school_name`, `experience.company_name`, `profile.linkedin_url`, and `profile.description`. These let a workflow build a short context note for each possible intro rather than treating every search hit equally. The limitation is that search results are still public-profile-derived signals; relationship strength is not provided.

### Talent Market Mapping

A hiring manager can search for specific skill clusters and locations to understand whether a target talent pool is broad enough before opening a role. A recruiting business can use `skills`, `total_experience_duration_months`, `location_regions`, `headline`, and current/past employers to compare candidate supply across regions, companies, and experience bands.

Returned counts and profile fields enable decisions such as whether to broaden geography, change title wording, or target adjacent companies. Because the endpoint charges by returned result in default mode, teams should use small `limit` values for exploratory searches and paginate only after validating that the query finds the right population.

### Content-Led Prospect Qualification

A seller or consultant can search for people in a target niche and inspect `posts`, `liked_posts`, `post_count`, and post reaction counts to find profiles already discussing a relevant problem. A company can feed those content signals into a lead-scoring workflow that prioritizes people showing current interest in a topic rather than relying only on title and employer.

This works when public LinkedIn activity is available in the returned profile bundle. It is weaker for inactive profiles or topics that people do not discuss publicly. If the workflow needs exact audience engagement for one post, the post-reactions endpoint is a better follow-up.
