# StableEnrich: Social Discussion And Influencer Enrichment API Uses

## What This Endpoint Group Does

Find Reddit discussions, retrieve full post/comment threads, and enrich creator or influencer identities from email or social handles.

These endpoints center on social signals: public discussions and social profile enrichment for creator, community, or reputation workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/reddit/search` | Reddit Search - Search Reddit posts ($0.02) | query, sort, timeframe, after, maxResults | posts, posts.id, posts.title, posts.author, posts.subreddit, posts.score, posts.numComments, posts.createdAt |
| POST | `/api/reddit/post-comments` | Reddit Post Comments - Get post details and comments ($0.02) | url, cursor | post, post.id, post.title, post.author, post.subreddit, post.score, post.numComments, post.createdAt |
| POST | `/api/influencer/enrich-by-email` | Influencer Enrich by Email - Find social media profiles associated with an email address ($0.4) | email, platform, enrichment_mode, excludeFields | profiles, profiles.id, profiles.username, profiles.platform, profiles.email, profiles.followers, profiles.following, profiles.engagement_rate |
| POST | `/api/influencer/enrich-by-social` | Influencer Enrich by Social - Enrich social media profile with additional data including contact info ($0.4) | platform, username, enrichment_mode, email_required, excludeFields | profile, profile.id, profile.username, profile.platform, profile.email, profile.phone, profile.followers, profile.following |

## Field Notes

### Inputs

- `query`
- `sort`
- `timeframe`
- `maxResults`
- `url`
- `email`
- `platform`
- `username`
- `enrichment_mode`
- `email_required`

### Outputs

- `posts`
- `comments`
- `selftext`
- `selftextTruncated`
- `permalink`
- `subreddit`
- `score`
- `author`
- `social profiles`
- `contact info`
- `creator metrics when returned`

### Important Constraints Or Gaps

- The Influencer response schema is not deeply described in llms.txt beyond social profiles and contact info.
- Public social data may be incomplete, deleted, or platform-limited.
- Endpoints in this group cost /api/reddit/search: $0.02; /api/reddit/post-comments: $0.02; /api/influencer/enrich-by-email: $0.4; /api/influencer/enrich-by-social: $0.4.

## Use Cases

### Community Pain-Point Research

A person researching a purchase, hobby, or technical problem can search Reddit by query, sort, timeframe, and result count, then fetch full post comments for promising threads. The truncated-search plus comments-drilldown pattern keeps discovery cheap while exposing full selftext and discussion when needed.

Product, support, and strategy teams can use titles, subreddits, scores, comments, and full thread text to find recurring complaints, feature requests, vocabulary, and objections. Reddit content is public conversation data and can be noisy, sarcastic, or unrepresentative.

### Creator Vetting And Campaign Outreach

A person or small brand can enrich a creator from an email or social username to find associated social profiles and contact information when available. Platform, username, enrichment mode, and email requirements help scope the lookup.

Marketing teams can use this to connect inbound creator emails to social reach, validate handles, and prioritize outreach. The endpoint is relatively expensive, response details are not deeply documented in llms.txt, and contact use must respect consent and platform rules.

### Reputation And Launch Monitoring

A creator, founder, or community manager can combine Reddit search with post-comments to monitor public discussion around launches, support issues, or brand mentions. Full comments help separate isolated complaints from repeated patterns.

Businesses can automate triage queues from thread URLs, subreddits, scores, and comment content, then decide whether to reply, update docs, or escalate. The API does not guarantee complete social coverage outside Reddit and supported influencer platforms.
