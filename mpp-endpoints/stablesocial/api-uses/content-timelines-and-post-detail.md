# StableSocial: Content Timelines And Post Detail API Uses

## What This Endpoint Group Does

Collect account timelines, ephemeral Instagram content, highlights, specific Reddit posts, and subreddit post feeds. These endpoints retrieve the content stream or individual post object that downstream analysis, comment collection, or publishing research depends on.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/tiktok/posts` | Get TikTok user posts | handle, max_posts, order_by, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/posts` | Get Instagram user posts | handle, max_posts, order_by, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/stories` | Get Instagram user stories | handle, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/highlights` | Get Instagram user highlights | handle, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/posts` | Get Facebook page/user posts | profile_id, max_posts, order_by, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/reddit/post` | Get Reddit post details | post_id | token, then /api/jobs finished data |
| POST | `/api/reddit/subreddit` | Get subreddit posts | name, max_page_size, cursor | token, then /api/jobs finished data |

## Field Notes

### Inputs

- `handle`
- `max_posts`
- `order_by`
- `max_page_size`
- `cursor`
- `profile_id`
- `post_id`
- `name`

### Outputs

- `token`
- `error`

Finished social-data payload fields are not documented in the public OpenAPI or `llms.txt`. The usable documented output contract is the async envelope: paid trigger returns `token`; polling returns `status`, optional `message`, `data`, or `error`.

### Important Constraints Or Gaps

- Paid trigger endpoints cost $0.06 and require x402/MPP payment; this research did not call them.
- Successful trigger calls return a job token; users must poll /api/jobs with SIWX wallet authentication to retrieve results.
- Public OpenAPI and llms.txt do not publish field-level schemas for finished social data payloads.
- Pagination uses cursor values and each additional page requires another paid trigger.
- The docs do not publish media, caption, engagement, author, or timestamp fields returned in finished job data.

## Use Cases

### Content Cadence And Positioning Review

A creator or small business can refresh recent TikTok, Instagram, or Facebook posts for their own or competing accounts to understand cadence, themes, and public messaging before planning the next post. A brand team can use timeline collection to spot shifts in competitor positioning, campaign launches, or product complaints. Fields such as `handle`, `profile_id`, `max_posts`, `order_by`, and `cursor` make the collection bounded and paginated, but the returned media, engagement, and timestamp fields are not publicly specified.

### Campaign Evidence Collection

A marketer can collect account posts, Instagram stories, highlights, and Facebook posts around a launch window to verify whether contracted creators or partner pages posted required content. The business value is auditability: a paid lookup can capture current platform content on demand before it disappears or changes. Instagram stories are time-sensitive, and users should account for platform availability and legal rights to store or reuse collected content.

### Reddit Market And Support Intelligence

A product manager can fetch a specific Reddit post or subreddit feed to understand recurring feature requests, complaints, or comparisons. A company can triage high-signal posts from target subreddits and route them to support, product, or sales teams. The subreddit endpoint starts from `name`, while post detail uses `post_id`; the docs do not publish vote, author, flair, or timestamp fields, so downstream classifiers must inspect actual returned payloads after paid retrieval.

### Pre-Comment Collection Dependency Refresh

For TikTok, Instagram, and Facebook, comments depend on a fresh base post collection. A user who wants to analyze discussion quality can first refresh profile posts, identify the relevant `post_id`, then trigger comments. Businesses benefit by paying for only the account and post slices needed for a concrete moderation, support, or campaign question.
