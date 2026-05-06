# StableSocial: Conversation And Comment Analysis API Uses

## What This Endpoint Group Does

Collect comments, replies, and individual Reddit comments for conversation mining and engagement review. These endpoints all turn a post or comment identifier into the surrounding discussion needed for sentiment, support, risk, or community analysis.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/tiktok/post-comments` | Get TikTok video comments | profile_id, post_id, max_comments, order_by, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/tiktok/comment-replies` | Get TikTok comment replies | profile_id, post_id, comment_id, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/post-comments` | Get Instagram post comments | post_id, max_comments, order_by, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/instagram/comment-replies` | Get Instagram comment replies | post_id, comment_id, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/post-comments` | Get Facebook post comments | post_id, max_comments, order_by, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/facebook/comment-replies` | Get Facebook comment replies | post_id, comment_id, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/reddit/post-comments` | Get Reddit post comments | post_id, max_comments, order_by, max_page_size, cursor | token, then /api/jobs finished data |
| POST | `/api/reddit/comment` | Get Reddit comment details | comment_id | token, then /api/jobs finished data |

## Field Notes

### Inputs

- `profile_id`
- `post_id`
- `max_comments`
- `order_by`
- `max_page_size`
- `cursor`
- `comment_id`

### Outputs

- `token`
- `error`

Finished social-data payload fields are not documented in the public OpenAPI or `llms.txt`. The usable documented output contract is the async envelope: paid trigger returns `token`; polling returns `status`, optional `message`, `data`, or `error`.

### Important Constraints Or Gaps

- Paid trigger endpoints cost $0.06 and require x402/MPP payment; this research did not call them.
- Successful trigger calls return a job token; users must poll /api/jobs with SIWX wallet authentication to retrieve results.
- Public OpenAPI and llms.txt do not publish field-level schemas for finished social data payloads.
- Pagination uses cursor values and each additional page requires another paid trigger.
- Comment author, text, score/reaction, moderation, and timestamp fields are not documented in the public schema.

## Use Cases

### Customer Complaint And Sentiment Triage

A creator, community manager, or support team can collect comments and replies from a specific post to find complaints, confusion, praise, or escalation risks. The relevant inputs are `post_id`, sometimes `profile_id`, `comment_id`, `max_comments`, `order_by`, and `cursor`. For a business, this can feed a triage workflow that flags posts requiring response, but public docs do not define whether returned comments include author handles, likes, timestamps, moderation state, or nested reply depth.

### Campaign Reaction Analysis

A brand can collect comments on paid or owned posts after a launch to measure whether the message is landing, whether questions repeat, and whether misinformation is spreading. A person can use it to understand audience reaction before deciding whether to follow up with another post. Each page costs another paid trigger, so sampling strategy matters when high-volume posts have many comments.

### Community Risk And Moderation Review

Trust-and-safety analysts can inspect comment replies for harassment, scams, impersonation, or coordinated abuse around public posts. The API helps because it can fetch focused threads across multiple platforms with the same payment and polling model. The returned `data` schema is undocumented, so production moderation systems would need payload validation and source-specific drift handling before automation.

### Reddit Thread Understanding

A researcher can fetch Reddit post comments or a specific Reddit comment to understand the reasoning, objections, and evidence in a discussion. Businesses can use this to identify product pain points, competitor mentions, or support opportunities in relevant communities. The workflow should respect Reddit community rules and privacy expectations when storing or summarizing comments.
