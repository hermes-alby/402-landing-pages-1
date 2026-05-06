# Diffbot: Media Extraction API Uses

## What This Endpoint Group Does

This endpoint group covers Diffbot's Image and Video extraction endpoints through the Locus MPP wrapper. A caller submits a public media-focused page URL and receives structured metadata about image or video assets found on that page. The two endpoints are useful when the workflow already has candidate URLs and needs normalized asset records rather than raw HTML.

The group is strongest for cataloging, triage, search indexing, media QA, and review queues. It can return source page identifiers, resolved URLs, asset URLs, image dimensions, video embed URLs, thumbnails/images, duration, view count, title, author/date context, tags, links, and crawl timestamps where Diffbot can extract them. It does not document rights, licenses, ownership, or guaranteed direct-download availability, so consumers need separate policy and rights checks before reuse.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/diffbot/image` | Extract structured image metadata from image-focused public pages. | Required `url`; optional `fields` with values such as `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, `quotes`; optional `timeout`; optional `discussion`. | `request.pageUrl`; `objects[].id`; `objects[].diffbotUri`; `objects[].pageUrl`; `objects[].resolvedPageUrl`; `objects[].url`; `objects[].title`; `objects[].naturalWidth`; `objects[].naturalHeight`; `objects[].displayWidth`; `objects[].displayHeight`; `objects[].tags`; `objects[].links`; `objects[].anchorUrl`; `objects[].xpath`; `objects[].crawlTimestamp`; 402 payment error when unpaid. |
| POST | `/diffbot/video` | Extract structured video metadata from public video pages. | Required `url`; optional `fields` with values such as `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, `quotes`; optional `timeout`; optional `discussion`. | `request.pageUrl`; `objects[].id`; `objects[].diffbotUri`; `objects[].pageUrl`; `objects[].resolvedPageUrl`; `objects[].url`; `objects[].embedUrl`; `objects[].title`; `objects[].author`; `objects[].date`; `objects[].duration`; `objects[].viewCount`; `objects[].naturalWidth`; `objects[].naturalHeight`; `objects[].images`; `objects[].mime`; `objects[].text`; `objects[].html`; `objects[].crawlTimestamp`; 402 payment error when unpaid. |

## Field Notes

### Inputs

`url` is the required input for both endpoints. It should be the public page URL to inspect, not a direct instruction to fetch arbitrary private or authenticated media. The wrapper OpenAPI models these endpoints as JSON `POST` requests, while the upstream Diffbot provider paths are `GET https://api.diffbot.com/v3/image` and `GET https://api.diffbot.com/v3/video`.

`fields` is an optional comma-separated request for extra fields. The local wrapper schema lists `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, and `quotes`; workflows that depend on these extras should tolerate absence because the wrapper does not publish a detailed 200 response schema. `timeout` is optional and documented as milliseconds with a 30000 ms default. `discussion` is also present on both request schemas, but the inventory description appears inherited from article extraction, so its practical value for media pages is uncertain.

### Outputs

Both endpoints return an `objects[]` array when extraction succeeds, but the MPP OpenAPI does not define the 200 response schema in detail. The field list is therefore mixed: wrapper/OpenAPI for inputs and payment statuses, Diffbot ontology/reference materials for response fields. Diffbot's ontology notes that fields are not guaranteed to exist in every entity record.

For images, the most actionable fields are `objects[].url`, `title`, `naturalWidth`, `naturalHeight`, `displayWidth`, `displayHeight`, `pageUrl`, `resolvedPageUrl`, `anchorUrl`, `xpath`, `tags`, `links`, `id`, `diffbotUri`, and `crawlTimestamp`. These support deduplication, basic quality scoring, source-page traceability, image-size filtering, and topical indexing.

For videos, the most actionable fields are `objects[].url`, `embedUrl`, `title`, `author`, `date`, `duration`, `viewCount`, `naturalWidth`, `naturalHeight`, `images`, `mime`, `text`, `html`, `pageUrl`, `resolvedPageUrl`, `id`, `diffbotUri`, and `crawlTimestamp`. These support media inventory records, embed detection, thumbnail capture, duration filtering, popularity heuristics, and source review.

### Important Constraints Or Gaps

- These are paid MPP endpoints with documented estimated cost `$0.004` per request and `x-payment-info.amount` of `4200` in the Tempo currency address from the local OpenAPI. This artifact did not call the endpoints, sign payments, use API keys, or run live extraction.
- The wrapper OpenAPI documents request bodies and 200/402 statuses but not a detailed successful response schema. Runtime response envelopes, nullability, per-field confidence, exact error bodies, timeout behavior, and maximum URL length are not documented locally.
- Extracted media URLs may be direct assets, embeds, thumbnails, page-linked media, or mixed source references depending on the site and endpoint. The docs do not promise that every returned URL is downloadable or reusable.
- Rights, ownership, copyright, licensing, consent, and takedown status are not documented output fields. Asset reuse requires separate rights review.
- `crawlTimestamp` is useful for freshness review, but it is not a promise that the source page still has the same media at decision time.
- Source pages may redirect, block extraction, change layout, include tracking URLs, or contain copyrighted or personal data. Preserve `pageUrl`, `resolvedPageUrl`, and raw responses in downstream systems when auditing matters.

## Use Cases

### Media Asset Inventory From Known Pages

A person organizing a portfolio, research archive, or personal reference library can submit known gallery or video pages and store `objects[].url`, `title`, dimensions, `embedUrl`, thumbnails in `images`, `pageUrl`, and `resolvedPageUrl` as a structured media index. The useful outcome is not just collecting links; it is being able to filter assets by size, type, source page, and title without manually opening each page.

A business content team can use the same workflow for product pages, newsroom pages, campaign pages, or partner pages. `id`, `diffbotUri`, `url`, dimensions, `duration`, `viewCount`, `crawlTimestamp`, and source URLs make deduplication and periodic review easier. The limitation is rights: the endpoint can identify media, but it does not say whether the business may reuse, syndicate, train on, or publish those assets.

### Visual Quality And Format Triage

An individual creator can use Image extraction to find candidate images that meet a minimum size for printing, thumbnails, or presentations. `naturalWidth` and `naturalHeight` distinguish source asset size from `displayWidth` and `displayHeight`, which helps avoid choosing a browser-resized image that is too small for the intended use.

For businesses, this becomes a QA queue for ecommerce, marketing, or documentation pages. Pages whose extracted images are missing, below a resolution threshold, or only available through unexpected `resolvedPageUrl` redirects can be flagged for human review. The endpoint does not expose perceptual quality, alt text completeness, brand compliance, or accessibility judgments, so those checks need additional tools or review.

### Video Cataloging And Embed Review

A person collecting lectures, tutorials, interviews, or product demos can use Video extraction to normalize `url`, `embedUrl`, `title`, `author`, `date`, `duration`, `images`, and `text` into a watchlist or searchable archive. `duration` helps separate short clips from long-form material, while `date` and `crawlTimestamp` help sort stale from newer pages.

A business can use the same fields to maintain a catalog of public training videos, customer stories, webinars, or competitor demos. `embedUrl` helps decide whether the video can be embedded in an internal tool, and `viewCount` can support rough prioritization for review. The workflow should not treat `viewCount` as audited analytics, and it should verify embed terms and platform policies before displaying videos elsewhere.

### Brand, Partner, Or Campaign Media Monitoring

Marketing, communications, or partnerships teams can keep a list of public pages where brand or campaign media should appear, then extract `objects[].url`, `title`, `tags`, `pageUrl`, `resolvedPageUrl`, `images`, and video metadata on a review cadence. The fields support questions such as which assets are present, which source pages still resolve, whether dimensions match expected creative sizes, and whether new media appeared since the last captured `crawlTimestamp`.

For personal use, a creator or photographer can use the same pattern to maintain a lightweight record of where known public image or video pages point. This is only an inventory aid, not infringement detection by itself. The endpoint does not compare image fingerprints, identify ownership, detect altered copies, or expose license metadata.

### Search And Recommendation Index Enrichment

Developers building a small search, bookmarking, or recommendation system can enrich known media URLs with structured fields before indexing. Image records can use `title`, `tags`, dimensions, `pageUrl`, `links`, and `xpath`; video records can add `author`, `date`, `duration`, `viewCount`, `mime`, `text`, `html`, thumbnails in `images`, and `embedUrl`.

The business value is better filtering and ranking than a plain URL list. A search UI can filter out tiny images, prefer recent videos, group by source page, or show thumbnails and durations in result cards. The caveat is that tags are extracted/generated context, not a complete taxonomy or moderation label, and fields can be missing on any record.

### Moderation And Compliance Intake Queues

Individuals managing a community site or small publication can use the endpoints to prepare a review queue from submitted public media pages. The extraction result can capture asset URLs, page context, dimensions, video duration, `text` or `html` around videos, `tags`, and source identifiers before a human moderator reviews the material.

For businesses, this supports intake triage for user-submitted links, vendor-provided media, affiliate pages, or public campaign references. The fields help route high-duration videos, low-resolution images, unexpected redirects, or pages with missing metadata to different review paths. This endpoint group should not be treated as automated moderation by itself; it does not provide safety classification, consent status, age gating, license verification, or legal conclusions.

### Data Cleanup And Deduplication Across Media Sources

A personal archive or business DAM-adjacent workflow can use `objects[].url`, `id`, `diffbotUri`, `pageUrl`, `resolvedPageUrl`, `naturalWidth`, `naturalHeight`, `duration`, and `embedUrl` to cluster records that appear to refer to the same underlying media across multiple pages. This is useful before manual tagging, migration, or review because it reduces repeated inspection of the same asset.

The endpoint fields give enough structure for practical dedupe heuristics, especially when the same direct media URL or Diffbot identifier recurs. They are not a robust perceptual hash or canonical rights identifier. If two URLs host visually identical media under different filenames or CDNs, a separate image/video fingerprinting step would be needed.
