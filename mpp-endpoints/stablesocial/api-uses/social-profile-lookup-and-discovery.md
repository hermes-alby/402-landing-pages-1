# StableSocial: Social Profile Lookup And Discovery API Uses

## What This Endpoint Group Does

Find and enrich public accounts, pages, people, groups, and user profiles across TikTok, Instagram, Facebook, and Reddit. These endpoints support the same job: locating social entities and retrieving base profile context before deeper content, audience, or monitoring work.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/tiktok/profile` | Get TikTok user profile | handle | token, then /api/jobs finished data |
| POST | `/api/tiktok/search-profiles` | Search TikTok user profiles | keywords, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/profile` | Get Instagram user profile | handle | token, then /api/jobs finished data |
| POST | `/api/facebook/profile` | Get Facebook page/user profile | profile_id | token, then /api/jobs finished data |
| POST | `/api/facebook/search-people` | Search Facebook people profiles | keywords, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/search-pages` | Search Facebook page profiles | keywords, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/search-groups` | Search Facebook group profiles | keywords, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/reddit/search-profiles` | Search Reddit user profiles | keywords, max_profiles, max_page_size, cursor | token, then /api/jobs finished data |

## Field Notes

### Inputs

- `handle`
- `keywords`
- `max_page_size`
- `cursor`
- `profile_id`
- `max_profiles`

### Outputs

- `token`
- `error`

Finished social-data payload fields are not documented in the public OpenAPI or `llms.txt`. The usable documented output contract is the async envelope: paid trigger returns `token`; polling returns `status`, optional `message`, `data`, or `error`.

### Important Constraints Or Gaps

- Paid trigger endpoints cost $0.06 and require x402/MPP payment; this research did not call them.
- Successful trigger calls return a job token; users must poll /api/jobs with SIWX wallet authentication to retrieve results.
- Public OpenAPI and llms.txt do not publish field-level schemas for finished social data payloads.
- Pagination uses cursor values and each additional page requires another paid trigger.
- The public docs do not define which profile fields are returned for each platform.

## Use Cases

### Influencer Or Creator Shortlisting

A person evaluating creators for a collaboration can search TikTok, Reddit, or Facebook entities by keyword and then refresh a promising profile before spending more on posts, followers, or comments. A business can use the same flow to pre-screen creators, pages, groups, or community accounts by collecting current profile data only for candidates that match a campaign niche. The key inputs are `keywords`, `handle`, `profile_id`, `max_page_size`, and `cursor`; the main limitation is that the public schema does not define which profile metrics or biography fields return inside `data`.

### Competitive Account Discovery

A founder or analyst can search for pages, people, groups, or profiles tied to a product category, then use profile endpoints to build a candidate list for deeper monitoring. For a brand team, this supports competitor watchlists and category maps before investing in content or comment collection. The API is useful because discovery and profile refresh can be paid one request at a time, but returned profile fields and ranking semantics are not documented.

### Lead And Community Source Identification

A business selling to creators, community operators, or niche merchants can use profile search endpoints to identify public accounts and groups associated with a topic, then route high-fit entities to manual review or CRM enrichment. The value comes from finding social surfaces that conventional company databases miss; the caveat is compliance and personal-data handling when storing or acting on public social profiles.

### Research Subject Validation

A journalist, researcher, or trust-and-safety analyst can verify whether a claimed handle or public page exists before collecting broader evidence. Profile lookup can be a cheap validation step that prevents unnecessary paid pagination across posts or comments for the wrong account. The workflow depends on exact identifiers and should treat absent or private results as uncertain rather than conclusive.
