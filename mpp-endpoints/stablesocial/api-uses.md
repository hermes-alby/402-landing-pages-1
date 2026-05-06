# StableSocial API Uses

## Service Summary

StableSocial is a Merit Systems, first-party, MPP-native API for pay-per-request public social-media data from TikTok, Instagram, Facebook, and Reddit. It has no API-key or subscription workflow in the retrieved public docs. Instead, each data collection starts with a paid POST trigger and finishes through a free SIWX-authenticated polling endpoint.

The strongest opportunities are focused social-data workflows where a user needs a small number of profile, post, comment, follower, or search results on demand and can tolerate an async job token flow.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Social Profile Lookup And Discovery | 8 | Find and enrich public accounts, pages, people, groups, and user profiles across TikTok, Instagram, Facebook, and Reddit. | [`api-uses/social-profile-lookup-and-discovery.md`](api-uses/social-profile-lookup-and-discovery.md) |
| Content Timelines And Post Detail | 7 | Collect account timelines, ephemeral Instagram content, highlights, specific Reddit posts, and subreddit post feeds. | [`api-uses/content-timelines-and-post-detail.md`](api-uses/content-timelines-and-post-detail.md) |
| Conversation And Comment Analysis | 8 | Collect comments, replies, and individual Reddit comments for conversation mining and engagement review. | [`api-uses/conversation-and-comment-analysis.md`](api-uses/conversation-and-comment-analysis.md) |
| Audience Network Mapping | 6 | Collect followers and following lists for social graph, influencer, and audience overlap analysis. | [`api-uses/audience-network-mapping.md`](api-uses/audience-network-mapping.md) |
| Topic Trend And Search Monitoring | 7 | Search posts and tags by keyword, hashtag, sound, or platform-specific topic to monitor trends and conversations. | [`api-uses/topic-trend-and-search-monitoring.md`](api-uses/topic-trend-and-search-monitoring.md) |
| Job Status And Result Retrieval | 1 | Poll paid trigger jobs, enforce wallet ownership, and retrieve pending, finished, or failed result envelopes. | [`api-uses/job-status-and-result-retrieval.md`](api-uses/job-status-and-result-retrieval.md) |

## Highest-Value Uses

- Cross-platform social listening for specific brands, topics, campaign hashtags, TikTok sounds, Reddit communities, or Facebook conversations without a standing SaaS subscription.
- Creator, influencer, page, group, or community shortlisting by combining profile discovery, profile refresh, content timelines, follower samples, and comment quality checks.
- Customer complaint and launch reaction triage by collecting comments and replies around public posts after a campaign, outage, or announcement.
- Competitive intelligence using bounded post, search, subreddit, and profile lookups to identify messaging shifts, popular topics, or recurring objections.
- Agent-run social research where each lookup has an explicit $0.06 cost and a tokenized polling path that can be logged for auditability.

## Personal Use Opportunities

A creator or individual researcher can use StableSocial for occasional checks: find profiles in a niche, inspect recent posts, sample comments, check who follows an account, or search for a hashtag or sound before making content decisions. The pay-per-request model fits sporadic needs better than a monthly social-data product.

The most useful personal pattern is a small research chain: search a topic, fetch a few profiles or posts, then collect comments only where the first results justify it. The main caveat is uncertainty in returned fields; the public docs do not define the exact contents of finished `data` payloads.

## Business Use Opportunities

Businesses can use StableSocial as a lightweight enrichment layer for marketing, product, support, trust-and-safety, and partnerships workflows. A team can monitor campaign reactions, discover creator candidates, watch competitor messaging, collect Reddit community signals, or sample audience graphs with explicit per-request spend.

StableSocial is not documented as a full social listening suite. There are no public webhooks, dashboards, saved searches, rate limits, result schemas, compliance controls, or normalized cross-platform analytics in the retrieved sources. Production use should validate payloads, log raw results, respect platform and privacy obligations, and treat public social data as sensitive where it identifies people.

## Endpoint Group Summaries

### Social Profile Lookup And Discovery

Find and enrich public accounts, pages, people, groups, and user profiles before deeper collection. This group is the entry point for influencer discovery, competitive account mapping, lead/community sourcing, and research subject validation. Full details: [`api-uses/social-profile-lookup-and-discovery.md`](api-uses/social-profile-lookup-and-discovery.md).

### Content Timelines And Post Detail

Collect recent posts, Instagram stories/highlights, Reddit post detail, and subreddit feeds for content cadence, campaign evidence, Reddit market intelligence, and pre-comment dependency refreshes. Full details: [`api-uses/content-timelines-and-post-detail.md`](api-uses/content-timelines-and-post-detail.md).

### Conversation And Comment Analysis

Retrieve post comments, comment replies, Reddit post comments, and Reddit comment details for sentiment, support, moderation, and campaign reaction analysis. Full details: [`api-uses/conversation-and-comment-analysis.md`](api-uses/conversation-and-comment-analysis.md).

### Audience Network Mapping

Collect followers and following lists for audience quality checks, overlap analysis, partnership mapping, and relationship due diligence. Full details: [`api-uses/audience-network-mapping.md`](api-uses/audience-network-mapping.md).

### Topic Trend And Search Monitoring

Search topics, keywords, hashtags, tags, and TikTok sounds across supported platforms to discover trends, monitor brand or issue mentions, and sample market conversations. Full details: [`api-uses/topic-trend-and-search-monitoring.md`](api-uses/topic-trend-and-search-monitoring.md).

### Job Status And Result Retrieval

Poll paid trigger jobs with SIWX wallet authentication, retrieve pending/finished/failed envelopes, and enforce wallet-scoped access to results. Full details: [`api-uses/job-status-and-result-retrieval.md`](api-uses/job-status-and-result-retrieval.md).

## Field And Data Themes

- Identifier inputs: `handle`, `profile_id`, `post_id`, `comment_id`, `name`, `keywords`, `hashtag`, `tag`, `music_title`, `music_id`, `token`, and `cursor`.
- Collection bounds: `max_posts`, `max_comments`, `max_followers`, `max_profiles`, `max_page_size`, and cursor pagination.
- Sorting and freshness controls: `order_by`, TikTok `sort_type`, TikTok `date_posted`, and on-demand refresh dependencies.
- Async envelope outputs: paid triggers return `token`; polling returns `status`, `message`, `data`, and `error`.
- Money fields: every paid POST trigger is documented at $0.06; MPP feed amount is `60000` with 6 decimals for Tempo USDC.
