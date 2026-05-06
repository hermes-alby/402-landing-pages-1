# Brave Search: Media Discovery And Curation API Uses

## What This Endpoint Group Does

This group covers the image and video search endpoints. Both are discovery tools for media-oriented workflows, but they return different metadata. Image Search returns source pages, thumbnails, original image URLs, dimensions, placeholders, source domains, and confidence. Video Search returns URLs, titles, descriptions, thumbnails, page dates, duration, view counts, creators, publishers, subscription flags, tags, and author profiles.

The group is strongest when an application needs to find candidate visual or video assets and then decide what to inspect, rank, display, or pass into a downstream review pipeline.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/brave/image-search` | Find images from Brave's image index. | `q`, `count`, `safesearch` | `results[].title`, `url`, `source`, `thumbnail`, `properties.url`, `properties.width`, `properties.height`, `meta_url`, `confidence`, `extra.might_be_offensive` |
| POST | `/brave/video-search` | Find videos from Brave's video index. | `q`, `count`, `freshness` | `results[].title`, `url`, `description`, `thumbnail`, `video.duration`, `video.views`, `video.creator`, `video.publisher`, `video.author`, `page_age`, `page_fetched` |

## Field Notes

### Inputs

Both endpoints require `q`. Image Search emphasizes `count` and `safesearch`, with upstream docs supporting up to 200 images and `off` or `strict` SafeSearch. Video Search emphasizes `count` and `freshness`, with upstream docs supporting country, language, offset, SafeSearch, spellcheck, operators, and fetch metadata beyond the wrapper fields.

### Outputs

Image results include display and sourcing fields: thumbnail URL, original image URL, page URL, source domain, optional dimensions, placeholder, favicon, and confidence. Video results include content evaluation fields: duration, views, creator, publisher, author profile, tags, subscription requirement, thumbnail, page age, and fetch date.

### Important Constraints Or Gaps

Image URLs and thumbnails should be treated as references, not automatically reusable licensed assets. Dimensions may be missing. Video duration format is described as variable. The wrapper does not confirm whether locale, offset, spellcheck, and operator fields are accepted for media endpoints.

## Use Cases

### Visual Research And Mood Boards

A person planning a home renovation, trip, presentation, or creative project can search visual themes and use `thumbnail.src`, `properties.url`, dimensions, source page URL, and confidence to collect candidate images. `safesearch=strict` and source hostnames help keep results appropriate and traceable.

A design, editorial, or marketing team can use the endpoint to assemble visual references for a brief, then route selected source URLs into rights review or asset procurement. The endpoint should not be used as a license-clearing tool; it helps discover images and provenance fields, but it does not grant reuse rights.

### Content Enrichment With Source Traceability

A blogger, educator, or newsletter writer can search for images related to a topic and use result titles, thumbnails, original URLs, and page URLs to enrich drafts or choose illustrations for further review.

A business can automate candidate-image suggestions in a CMS. The CMS can show thumbnails, dimensions, and source domains beside each suggestion, making editorial approval faster. The valuable fields are `properties.width`, `properties.height`, `source`, and `meta_url.hostname`; the limitation is that users still need copyright and brand-safety review before publication.

### Video Tutorial And Explainer Discovery

A learner can search for tutorials and compare `video.duration`, `video.views`, `video.creator`, `video.publisher`, and `description` to pick a video that fits their time and trust needs. Freshness filters can prioritize recent technical videos where old advice may be obsolete.

A training or support team can use the same metadata to curate videos for customers or employees. View counts and creator fields help rank candidates, while duration helps choose content for a lesson plan or support article. The workflow should not assume higher views always mean higher quality; it should preserve source and creator metadata for human review.

### Trend And Campaign Monitoring In Video Channels

A creator or analyst can query a topic with `freshness=pd`, `pw`, or `pm` and review new video titles, descriptions, views, creators, and publishers. This supports quick monitoring of what videos are appearing around a launch, event, or trend.

Marketing and competitive-intelligence teams can track video coverage of brands, competitors, or industry themes. The endpoint returns enough fields to group by publisher, spot high-view items, and prioritize outreach or response. A downstream job can deduplicate by URL and track changes over time, but the API response itself is a snapshot rather than a persistent trend database.

### Media Quality And Suitability Filtering

A person building a collection can filter images by dimensions and confidence or videos by duration, publisher, and subscription requirement. That prevents low-resolution images or inaccessible videos from entering the shortlist.

A business can use these fields as prefilters before human moderation or downstream processing. For example, reject images without dimensions, prioritize videos under ten minutes, or exclude results where `requires_subscription` is true. The endpoint provides useful metadata, but final suitability still depends on source policy, rights, accessibility, and content review.
