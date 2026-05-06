# Diffbot: Page Type Detection And Routing API Uses

## What This Endpoint Group Does

This endpoint group covers Diffbot Analyze through the Locus MPP wrapper. It is for cases where the caller has a public URL but does not reliably know whether the page is an article, product, discussion, image, video, list, event, or another supported extraction target. The caller sends the URL and optional routing controls; Diffbot classifies the page and returns structured extraction objects for the detected or selected page type.

The central value is routing. Instead of building separate pre-classification logic before choosing `/diffbot/article`, `/diffbot/product`, `/diffbot/discussion`, and related endpoints, a workflow can submit mixed URLs to `/diffbot/analyze` and branch on returned fields such as `objects[].type`, `objects[].title`, `objects[].pageUrl`, `objects[].resolvedPageUrl`, and type-specific extracted fields. The wrapper OpenAPI documents the request body and payment metadata, but not a detailed 200 response schema, so downstream systems should preserve raw responses and tolerate missing or type-varying fields.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/diffbot/analyze` | Auto-detect a page type and route extraction to the matching Diffbot model. | Required `url`; optional `mode`, `fallback`, `fields`, `timeout`, `discussion`. | `objects[].type`, `objects[].title`, `objects[].pageUrl`, `objects[].resolvedPageUrl`, request metadata when present, and type-specific fields for article, product, discussion, image, video, event, list, or job-like outputs when returned. |

## Field Notes

### Inputs

`url` is the required target public page URL. It is the only required body field in the MPP OpenAPI schema.

`mode` is an optional routing constraint. The wrapper documents `article`, `product`, `discussion`, `image`, `video`, `list`, and `event` as supported values. Use it when a workflow has a strong expectation about the page type but still wants Analyze behavior rather than calling the narrower endpoint directly.

`fallback` is an optional fallback API name if classification fails. The wrapper source does not enumerate accepted fallback values or describe the exact failure behavior, so treat this as a best-effort control until verified against wrapper docs or non-paid examples.

`fields` is an optional comma-separated list for extra fields. The wrapper inventory records `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, and `quotes` as important documented values. These fields are most useful when the route decision needs supporting page evidence such as outbound links, metadata, or breadcrumbs.

`timeout` is an optional number in milliseconds; the wrapper docs describe a default of `30000`.

`discussion` is an optional boolean to request comment or discussion-thread extraction, documented as defaulting to true for article-style extraction.

### Outputs

The most important routing output is `objects[].type`, because it tells the caller which extraction shape was returned and which downstream processor should handle the record.

Common cross-type fields include page identity and display fields such as `objects[].title`, `objects[].pageUrl`, `objects[].resolvedPageUrl`, `objects[].id`, `objects[].diffbotUri`, and `objects[].crawlTimestamp` when present. These support deduplication, redirect handling, provenance, and freshness checks.

Type-specific fields are the payload that makes the routing decision valuable. Article-like pages can return content fields such as `text`, `author`, `date`, `tags`, `images`, and `sentiment`. Product-like pages can return commerce fields such as `offerPrice`, `regularPrice`, `availability`, `brand`, identifiers, images, and review or discussion signals. Event pages can return `startDateTime`, `endDateTime`, `location`, `venue`, `onlineLink`, sponsors, categories, and descriptions. Job-like pages can return employer, locations, remote status, skills, requirements, tasks, summaries, and dates. Discussion, image, video, and list outputs similarly vary by detected type.

The MPP OpenAPI only describes a generic successful response, so these output notes are based on the local endpoint inventory, Diffbot public ontology snapshot, and official Extract reference snapshots rather than a wrapper-specific 200 schema.

### Important Constraints Or Gaps

The endpoint is paid through MPP. This artifact is based on local snapshots and public docs only; no paid endpoint calls, wallet signatures, account actions, or live extraction requests were performed.

The wrapper price is documented as an estimated `$0.004` per request, with `x-payment-info.amount` of `4200` in the MPP OpenAPI. Workflows should avoid using Analyze as a blind crawler over large unknown URL sets without cost controls.

Analyze is useful for mixed or uncertain URLs, but it can be less deterministic than choosing a specific endpoint when the page type is already known. If a product catalog always submits product pages, `/diffbot/product` is easier to reason about.

Diffbot ontology fields are not guaranteed to exist in every record. Consumers should branch by `objects[].type`, validate required fields per workflow, keep raw outputs, and record parse failures instead of dropping records silently.

The exact wrapper response shape for classification failure, fallback behavior, redirects, unsupported page types, timeouts, and payment errors is not fully documented in the local OpenAPI snapshot.

## Use Cases

### Mixed URL Intake Triage

A person saving links from newsletters, search results, marketplaces, forums, and event pages can use Analyze to turn a loose reading or research queue into typed records. The workflow submits each `url`, then branches on `objects[].type`: article records can be sent to a reading summarizer, product records to a price watchlist, event records to a calendar review queue, and discussion records to community monitoring. Fields such as `title`, `pageUrl`, `resolvedPageUrl`, `date`, `offerPrice`, `startDateTime`, and `location` determine what the user sees next.

For a business, the same pattern supports inbound URL triage from support tickets, sales notes, analyst research, or user-submitted forms. Instead of asking staff to classify each link manually, the system can route detected products to commerce analysis, articles to content intelligence, job pages to recruiting intelligence, and discussion pages to voice-of-customer review. The main limitation is that each request costs money and the response shape varies, so the triage pipeline needs per-type validation and a manual-review lane for low-confidence or incomplete records.

### Source-Agnostic Competitive Monitoring

A small operator tracking competitors can submit newly discovered competitor URLs without pre-labeling them. Analyze can distinguish product pages from press articles, event announcements, and discussion pages, then expose fields that support different decisions: product prices and availability for market checks, article titles and dates for news tracking, event times and locations for field marketing awareness, and discussion metadata for customer sentiment review.

For a business intelligence team, this is valuable when URL discovery comes from heterogeneous sources such as search alerts, RSS feeds, partner lists, social posts, or scraped sitemaps. `mode` can constrain extraction for known subsets, while unconstrained Analyze can classify the rest. The workflow should use `pageUrl` and `resolvedPageUrl` for deduplication, `crawlTimestamp` or returned dates for recency checks, and type-specific fields only after confirming `objects[].type`.

### Content Operations Routing

A personal knowledge manager can use Analyze as a front door for saved links. Article-like outputs can feed note-taking, citation, or quote capture; video/image outputs can feed a media library; event outputs can prompt calendar review. Optional `fields` such as `links`, `meta`, `breadcrumb`, and `quotes` add context when deciding whether a saved URL deserves follow-up.

For publishers, agencies, or content teams, the endpoint can route mixed source URLs into separate editorial workflows. Article results can enter content analysis, video and image records can enter media asset review, and list pages can be sent to item extraction or QA. The endpoint does not replace editorial judgment: returned fields may be absent, page terms and copyright still matter, and a final system should retain the original URL plus raw extraction for auditability.

### Marketplace And Catalog Link Normalization

A shopper can paste mixed links from stores, review pages, and blog posts into a personal comparison tool. Analyze can identify product pages and extract product-specific fields when available, while routing article or discussion pages into supporting research. Fields such as `offerPrice`, `regularPrice`, `brand`, `images`, `title`, and `discussion` signals can help separate direct buying options from contextual reviews.

For ecommerce businesses, affiliates, or procurement teams, Analyze helps normalize unstructured supplier and competitor links before deciding which narrower processing path to use. Product records can feed price comparison and SKU matching; article records can feed editorial mention tracking; discussion records can feed review mining. The workflow should not assume every URL with a product mention is a product page, and should verify commerce fields before making automated pricing or purchasing decisions.

### Event And Announcement Detection

A person planning travel, conferences, or local activities can submit mixed announcement URLs and let Analyze identify event-like pages. If the output includes event fields such as `startDateTime`, `endDateTime`, `location`, `venue`, `onlineLink`, and `description`, the user can decide whether to add the item to a calendar, save the venue, or ignore a non-event page.

For marketing, partnerships, and field teams, this supports monitoring links from newsletters, partner sites, and industry feeds where some pages are events, some are articles, and some are product announcements. Analyze provides the first routing layer; downstream automation should require date and location fields before creating calendar tasks or CRM activities, because the local sources do not document guaranteed field presence or fallback semantics.

### Extraction Pipeline QA And Endpoint Selection

A developer building a Diffbot integration can use Analyze on a controlled set of public test URLs to learn which page types Diffbot detects before choosing narrower endpoints for production. The useful fields are `objects[].type`, request metadata, page URLs, and the presence or absence of expected type-specific fields. `mode` and `fallback` can be evaluated as routing controls, while `fields` can test whether extra evidence like metadata or breadcrumbs is needed.

For a data platform team, this becomes a QA gate before scaling extraction. Analyze can sample new source domains and reveal whether pages are consistently classified as products, articles, lists, or discussions. Because the MPP wrapper does not document a detailed 200 schema, production pipelines should preserve raw results, log parse errors by source domain and detected type, and switch to specific endpoints once the page class is stable enough.
