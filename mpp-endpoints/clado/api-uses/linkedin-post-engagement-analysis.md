# Clado: LinkedIn Post Engagement Analysis API Uses

## What This Endpoint Group Does

This group analyzes reactions on a LinkedIn post. It accepts a post URL, optional pagination, and optional reaction-type filtering, then returns reaction counts and the profiles of people who reacted.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/clado/post-reactions` | Retrieve reactions on a LinkedIn post | `url`, `page`, `reaction_type` | `total_reactions`, `reaction_breakdown`, `reactions[].profile`, `reaction_type`, `timestamp`, `pagination` |

## Field Notes

### Inputs

`url` is the LinkedIn post URL. `page` paginates through reaction results. `reaction_type` filters by documented reaction examples such as `like`, `love`, `celebrate`, `support`, `insightful`, and `funny`.

### Outputs

The first-party schema includes post-level totals, a `reaction_breakdown` object with counts by reaction type, `reactions[]` entries with each reacting profile's `name`, `headline`, and `linkedin_url`, the reaction type, timestamp, and pagination fields.

### Important Constraints Or Gaps

The reaction type values are documented in prose but not enforced as an enum in the OpenAPI schema. The public docs do not state maximum page count, reaction-data freshness, or whether deleted/private engagement disappears from results.

## Use Cases

### Identify High-Intent Engagers

A creator, founder, or salesperson can inspect who reacted to a post about a specific problem and prioritize people whose `headline` matches the target audience. A business can route reacting profiles into a prospecting workflow when the content topic aligns with an active campaign.

The useful fields are `reactions[].profile.headline`, `reactions[].profile.linkedin_url`, `reaction_type`, and `timestamp`. A recent `insightful` or `love` reaction from a relevant role may be a stronger signal than a generic profile match. The endpoint returns engagement, not permission to contact; follow-up should respect platform rules and outreach compliance.

### Measure Content Resonance By Audience

An individual can compare reaction breakdown across posts to see which topics attract peers, recruiters, or prospective customers. A marketing team can use `reaction_breakdown`, total reactions, and reacting profile headlines to identify whether a post is reaching buyers, practitioners, investors, or job seekers.

This enables practical decisions: repeat a topic, adjust messaging, ask sales to review high-fit engagers, or stop promoting content that attracts the wrong audience. The API does not provide full impression data, so it measures visible engagement rather than reach.

### Build Event Or Webinar Follow-Up Lists

If a post promotes an event, a community manager can use reactions to identify people who showed interest before or after the event. A business can combine reaction profiles with profile enrichment to identify job titles and companies worth inviting to future sessions.

The returned `linkedin_url` values become the bridge to profile enrichment, while `reaction_type` and `timestamp` help rank recency and intent. This should be limited to relevant, respectful follow-up rather than broad scraping of every engagement event.
