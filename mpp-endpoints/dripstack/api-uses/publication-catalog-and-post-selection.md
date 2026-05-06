# DripStack: Publication Catalog And Post Selection API Uses

## What This Endpoint Group Does

This endpoint group is DripStack's free discovery and selection layer for Substack-backed content. It lets a client list stored publications, inspect one publication's normalized metadata, and collect valid post slugs before deciding whether any paid full-post retrieval is justified.

The practical value is triage. A user or agent can identify candidate publications from `slug`, `title`, `description`, `siteUrl`, and `lastSyncedAt`, then narrow a specific publication by reading its `posts[]` summaries. The group does not return full article bodies, post publication dates, canonical post URLs, or prices. It is therefore best used to decide what to read or purchase, not to replace the paid post endpoint or the original publisher.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/publications` | List all stored publications available through DripStack. | No documented parameters; optional empty JSON GET body may be omitted. | `publications[]` records with `slug`, `title`, `description`, `siteUrl`, and `lastSyncedAt`. |
| GET | `/api/v1/publications/{publicationSlug}` | Fetch one publication's metadata and post-summary catalog. | Required `publicationSlug` path parameter, using the normalized host such as `qualitystocks.substack.com`; optional empty JSON GET body may be omitted. | Publication `slug`, `title`, `description`, `siteUrl`, `imageUrl`, `language`, `authorName`, `authorEmail`, `copyright`, `lastSyncedAt`, plus `posts[]` with `slug`, `title`, and optional `subtitle`; returns `404` with `error` for missing publications. |

## Field Notes

### Inputs

`GET /api/v1/publications` has no documented query parameters, path parameters, or request fields. The OpenAPI snapshot describes an optional empty JSON body for the GET request, but clients can omit it.

`GET /api/v1/publications/{publicationSlug}` accepts one required path parameter: `publicationSlug`. DripStack defines publication slugs as normalized hosts. Substack subdomains use the host as-is, while custom domains remove a leading `www.`. Clients should use publication slugs exactly as returned by the list endpoint or local catalog responses.

### Outputs

The publication-list response returns `publications[]`. Each `PublicationListItem` includes a required `slug` and `siteUrl`, with optional nullable `title`, `description`, and `lastSyncedAt`. These fields are enough to build a publication shortlist, show human-readable labels, link back to the source publication, and reason about whether DripStack's stored catalog may be stale.

The publication-detail response expands the record into `PublicationCore`: required fields include `slug`, `title`, `description`, `siteUrl`, `imageUrl`, `language`, `authorName`, `authorEmail`, `copyright`, and `lastSyncedAt`, though most descriptive fields can be `null`. It also includes required `posts[]` records. Each `PostSummary` has required `slug` and `title`, plus nullable `subtitle`. The post slug is the key handoff field for any later full-post request.

### Important Constraints Or Gaps

Both covered routes are documented as free, with OpenAPI `authMode: none` and `price: "0.00"`. They should be safe for public GET discovery, but the full-post route is outside this group and is payment-gated.

The list endpoint has no documented pagination, ordering, filtering, rate limits, post counts, or per-publication pricing. The snapshot example contains 90 publications, but clients should not assume that count, order, or completeness is stable.

The publication-detail endpoint may import a publication on demand according to the DripStack docs, but the response does not indicate whether an import happened. Treat `lastSyncedAt` as a useful freshness hint, not a complete freshness SLA.

Post summaries do not include published dates, canonical post URLs, authorship details, images, full text, paywall status, or prices. A title and subtitle can help rank candidates, but they are weak evidence for substantive claims until the underlying article is fetched through an approved payment-aware flow or checked at the source.

The underlying content comes from third-party Substack publications. `authorEmail`, titles, descriptions, and copyright text should be handled as publisher-supplied metadata, not as DripStack-authored content or a license to redistribute full articles.

## Use Cases

### Paid Research Triage

An analyst or agent can use the free list endpoint to find relevant publication hosts, then inspect one publication's post catalog to choose a small set of candidate `post.slug` values. This avoids paying for full posts blindly: titles, subtitles, publication descriptions, and `lastSyncedAt` provide enough context to decide whether a paid fetch is likely to answer the question.

The limitation is that the free catalog has no post dates, prices, canonical URLs, or body text. A paid retrieval decision should therefore be conservative, especially where current market, legal, or health claims matter. Payment should happen only through an approved payment-aware client and only for selected posts whose slugs came from the catalog response.

### Newsletter Discovery For Topic And Source Mapping

Teams building a Substack source map can inventory stored publications by `slug`, `title`, `description`, `siteUrl`, and `language`. That supports workflows such as finding finance newsletters, AI infrastructure writers, political commentary sources, or creator-economy publications before assigning deeper review.

This works best for discovery and taxonomy, not exhaustive web search. The list endpoint has no filtering or pagination contract, and DripStack's catalog reflects what has been stored or imported, not every Substack publication. `lastSyncedAt` should be captured alongside source notes so downstream systems can separate fresh catalogs from older snapshots.

### Investment And Competitive Intelligence Watchlists

Investment, strategy, or competitive-intelligence teams can watch selected publications for new-looking post titles and subtitles, then route promising items to analysts. The detail endpoint's `posts[]` array gives a lightweight editorial feed for publications such as market commentary, sector research, startup analysis, or product newsletters.

Because the summaries omit `publishedAt`, post URLs, and prices, this is not a complete monitoring feed by itself. A watchlist implementation should compare returned slugs across snapshots, preserve the DripStack `lastSyncedAt` value, and verify important facts against paid content or original publisher pages before acting.

### Personal Reading Queue And Purchase Planning

A reader who follows many newsletters can browse publications and turn one publication's `posts[]` titles and subtitles into a reading queue. The `siteUrl`, `imageUrl`, author fields, and copyright text help present each source clearly, while post slugs preserve the exact item to fetch later.

The free routes are useful for deciding what looks worth attention, but they do not grant access to paid Substack content. Any full article access may require payment, and a reader should treat the catalog as a selection aid rather than a substitute for the publisher's paywall or subscription terms.

### Agent Retrieval Budget Control

An answer-generation agent can use this group as a preflight step before any wallet-gated calls. It can rank candidate publications using metadata, select post slugs using title and subtitle relevance, and cap the number of paid full-post attempts to the small set most likely to support the final answer.

This is especially valuable when the paid full-post route has dynamic pricing and returns a 402 challenge until paid. The catalog routes do not expose per-post prices, so budget controls still need to inspect the live payment challenge for a selected post before authorizing spend.

### Publisher Metadata And Catalog QA

A publication operator or platform analyst can inspect whether a stored publication appears with the expected host slug, title, description, source URL, image URL, language, author name, author email, copyright text, and recent sync timestamp. The post-summary list can reveal whether imported post slugs and titles look coherent enough for agent discovery.

The endpoint does not explain how metadata was imported, whether a GET triggered an on-demand import, or which source fields were missing upstream. QA workflows should preserve raw responses and null fields instead of assuming absent metadata is a DripStack error.
