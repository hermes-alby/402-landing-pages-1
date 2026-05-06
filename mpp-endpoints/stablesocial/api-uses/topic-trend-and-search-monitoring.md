# StableSocial: Topic Trend And Search Monitoring API Uses

## What This Endpoint Group Does

Search posts and tags by keyword, hashtag, sound, or platform-specific topic to monitor trends and conversations. These endpoints start from a topic, tag, or sound rather than a known account or post, supporting discovery and monitoring jobs.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/tiktok/search` | Search TikTok posts by keyword | keywords, sort_type, date_posted, max_posts, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/tiktok/search-hashtag` | Search TikTok by hashtag | hashtag, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/tiktok/search-music` | Search TikTok posts by sound | music_title, music_id, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/search` | Search Instagram posts by keyword | keywords, max_posts, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/search-tags` | Search Instagram by tag | tag, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/search` | Search Facebook posts by keyword | keywords, max_posts, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/reddit/search` | Search Reddit posts by keyword | keywords, max_posts, max_page_size, cursor | token, then /api/jobs finished data |

## Field Notes

### Inputs

- `keywords`
- `sort_type`
- `date_posted`
- `max_posts`
- `max_page_size`
- `cursor`
- `hashtag`
- `music_title`
- `music_id`
- `tag`

### Outputs

- `token`
- `error`

Finished social-data payload fields are not documented in the public OpenAPI or `llms.txt`. The usable documented output contract is the async envelope: paid trigger returns `token`; polling returns `status`, optional `message`, `data`, or `error`.

### Important Constraints Or Gaps

- Paid trigger endpoints cost $0.06 and require x402/MPP payment; this research did not call them.
- Successful trigger calls return a job token; users must poll /api/jobs with SIWX wallet authentication to retrieve results.
- Public OpenAPI and llms.txt do not publish field-level schemas for finished social data payloads.
- Pagination uses cursor values and each additional page requires another paid trigger.
- Search result ranking fields, engagement counts, author fields, and de-duplication behavior are not documented.

## Use Cases

### Trend Discovery Before Content Planning

A creator can search TikTok by keyword, hashtag, or music and Instagram by tag before deciding what to post next. A business can run bounded social listening around product names, competitor names, campaign hashtags, or TikTok sounds and route promising findings into content planning. `sort_type`, `date_posted`, `max_posts`, and `cursor` make TikTok searches especially useful for recency or engagement-oriented exploration.

### Brand And Issue Monitoring

A company can search Facebook, Reddit, Instagram, and TikTok for mentions of a product, executive, outage, or controversial topic, then trigger deeper post or comment collection only on high-signal results. This turns the API into a pay-as-needed alert enrichment tool rather than a standing monitoring contract. The limitation is that no webhook, scheduled monitoring, or search-result schema is documented, so orchestration and de-duplication are external.

### Music And Meme Tracking

TikTok music search accepts `music_title` and `music_id`, enabling a creator, label, or campaign team to track posts tied to a particular sound. A business can use that to evaluate whether a sound is spreading in the intended niche before boosting or licensing content. The docs do not explain how to discover valid music IDs except from prior platform knowledge or returned content.

### Market Research Sampling

An analyst can sample Reddit posts, Facebook posts, Instagram tags, and TikTok searches for a product category to compare vocabulary, objections, and use cases across communities. The value comes from cross-platform collection with uniform payment and polling. Because results are paginated and paid per page, research designs should record query terms, cursors, and dates for reproducibility.
