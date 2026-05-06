# StableSocial: Audience Network Mapping API Uses

## What This Endpoint Group Does

Collect followers and following lists for social graph, influencer, and audience overlap analysis. Followers and following endpoints expose relationship lists rather than posts or comments, so they support graph and audience workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/tiktok/followers` | Get TikTok followers | handle, max_followers, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/tiktok/following` | Get TikTok following | handle, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/followers` | Get Instagram followers | handle, max_followers, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/following` | Get Instagram following | handle, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/followers` | Get Facebook followers | profile_id, max_followers, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/following` | Get Facebook following | profile_id, max_page_size, cursor | token, then /api/jobs finished data |

## Field Notes

### Inputs

- `handle`
- `max_followers`
- `max_page_size`
- `cursor`
- `profile_id`

### Outputs

- `token`
- `error`

Finished social-data payload fields are not documented in the public OpenAPI or `llms.txt`. The usable documented output contract is the async envelope: paid trigger returns `token`; polling returns `status`, optional `message`, `data`, or `error`.

### Important Constraints Or Gaps

- Paid trigger endpoints cost $0.06 and require x402/MPP payment; this research did not call them.
- Successful trigger calls return a job token; users must poll /api/jobs with SIWX wallet authentication to retrieve results.
- Public OpenAPI and llms.txt do not publish field-level schemas for finished social data payloads.
- Pagination uses cursor values and each additional page requires another paid trigger.
- The docs do not state whether returned accounts include display names, bios, verification, follower counts, or relationship timestamps.

## Use Cases

### Influencer Audience Quality Checks

A person considering a collaboration can collect a bounded sample of followers and following lists to look for obvious niche fit, suspicious patterns, or overlap with known communities. A business can compare candidate creator audiences before paying for sponsorships. Inputs such as `max_followers`, `max_page_size`, and `cursor` bound cost, but the docs do not state whether follower records include bios, follower counts, verification, geography, or account age.

### Partnership And Affinity Mapping

Marketing or partnerships teams can inspect which accounts a target profile follows and who follows it to infer affinities, partner ecosystems, and adjacent communities. This is useful for identifying co-marketing candidates or community entry points. Because each page requires a paid trigger and social graph availability can vary by platform, the workflow should sample deliberately rather than crawling broadly.

### Audience Overlap Monitoring

A brand can periodically refresh follower samples for a few public competitors or creators and compare overlap against internal watchlists. A personal creator can watch whether their audience is drifting toward adjacent niches. StableSocial does not document a built-in overlap metric, so the user must compute overlap after collecting account identifiers from finished job data.

### Account Relationship Due Diligence

Investigators or analysts can use following lists to understand public affiliations, source networks, or amplification relationships around an account. The endpoint group provides raw relationship lists, not conclusions; users need careful review and should avoid over-interpreting follows as endorsement.
