# Diffbot API Uses

## Service Summary

Diffbot's assigned MPP service wraps the provider's Extract APIs for turning public web pages into structured records. It is focused on page extraction, not the separate Diffbot Knowledge Graph or Natural Language MPP services. The wrapper exposes paid per-request endpoints for articles, products, discussions, images, videos, events, lists, job postings, and page-type auto-detection.

The main value is converting messy URLs into usable JSON without managing a direct Diffbot token. A workflow supplies a known public URL and receives fields such as article text, product prices, discussion posts, media metadata, event dates and locations, or job requirements, depending on the endpoint and page type.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Page Type Detection And Routing | 1 | Classify mixed public URLs and route them to article, product, discussion, image, video, list, event, or other type-specific processing. | [`api-uses/page-type-detection-and-routing.md`](api-uses/page-type-detection-and-routing.md) |
| Article And Discussion Extraction | 2 | Extract clean article content, authorship, dates, sentiment, tags, quotes, and public discussion-thread structure. | [`api-uses/article-and-discussion-extraction.md`](api-uses/article-and-discussion-extraction.md) |
| Commerce And Listing Extraction | 2 | Extract product detail fields and repeated listing items for price, catalog, assortment, and marketplace workflows. | [`api-uses/commerce-and-listing-extraction.md`](api-uses/commerce-and-listing-extraction.md) |
| Media Extraction | 2 | Extract image and video asset metadata, dimensions, embeds, thumbnails, source URLs, and review fields. | [`api-uses/media-extraction.md`](api-uses/media-extraction.md) |
| Event Extraction | 1 | Normalize event pages into date, timezone, location, venue, online-link, sponsor, category, image, and provenance fields. | [`api-uses/event-extraction.md`](api-uses/event-extraction.md) |
| Job Posting Extraction | 1 | Normalize public job pages into title, employer, location, remote status, skills, requirements, tasks, and provenance fields. | [`api-uses/job-posting-extraction.md`](api-uses/job-posting-extraction.md) |

## Highest-Value Uses

The strongest use is URL triage and routing. `POST /diffbot/analyze` lets an agent accept mixed links from feeds, search results, tickets, newsletters, or user submissions, then branch on `objects[].type` and type-specific fields before sending records into content, commerce, event, job, media, or discussion workflows.

The next strongest use is structured competitive and market research from known URLs. Product fields such as `offerPrice`, `regularPrice`, `availability`, `brand`, and SKU identifiers support price and catalog checks; article and discussion fields such as `text`, `author`, `date`, `sentiment`, `posts`, and `numParticipants` support market narrative and customer-voice review.

The service is also useful for operational intake: turning saved job posts into applicant trackers, event pages into calendar or CRM queues, media pages into asset review records, and listing pages into discovery pipelines that can feed narrower extraction.

## Personal Use Opportunities

- Sort mixed saved links into articles, products, events, videos, discussions, and jobs before deciding what to read, buy, attend, watch, or apply to.
- Build a personal research corpus from articles and discussion threads with text, authors, dates, quotes, tags, source URLs, and post-level conversation data.
- Compare product pages by title, brand, price, availability, image, and identifiers before purchase.
- Capture event pages into draft calendar entries using name, description, start/end time, timezone, venue, location, and online link.
- Enrich saved job URLs with employer, remote status, locations, skills, requirements, tasks, and posting date for job-search tracking.
- Catalog known image or video pages with dimensions, duration, embed URLs, thumbnails, titles, and source provenance.

## Business Use Opportunities

- Route inbound URLs from support, sales, research, or user submissions into the right downstream processor based on extracted type.
- Monitor competitor product pages and listing pages for price, availability, category, image, and identifier changes.
- Normalize public articles and discussions into media monitoring, reputation response, policy research, or customer-feedback queues.
- Convert event URLs into field-marketing, partnership, conference-intelligence, CRM, or CMS draft records.
- Track selected job postings for recruiting intake, competitive hiring intelligence, skills taxonomy updates, and remote/location policy monitoring.
- Create media review queues from known public pages using asset URLs, dimensions, video duration, thumbnails, source URLs, and crawl timestamps.

## Endpoint Group Summaries

### Page Type Detection And Routing

Analyze is the front door for uncertain URLs. It accepts `url` plus optional `mode`, `fallback`, `fields`, `timeout`, and `discussion`, then returns typed extraction objects when classification succeeds. This is best for mixed URL queues and early pipeline QA before choosing narrower endpoints.

Full details: [`api-uses/page-type-detection-and-routing.md`](api-uses/page-type-detection-and-routing.md)

### Article And Discussion Extraction

Article and Discussion extraction convert text-heavy pages and public conversation pages into structured content records. The most useful fields are article `title`, `text`, `author`, `date`, `sentiment`, `tags`, `quotes`, and discussion `posts`, `numPosts`, `numParticipants`, nested post authors, dates, sentiment, and text.

Full details: [`api-uses/article-and-discussion-extraction.md`](api-uses/article-and-discussion-extraction.md)

### Commerce And Listing Extraction

Product extraction is for individual product pages; List extraction is for repeated-item pages such as category pages, search results, directories, or indexes. Together they support discovery plus detail: use lists to find candidate items, then product extraction for price, availability, brand, SKU, GTIN/UPC/MPN/ISBN, category, breadcrumbs, images, and source URLs.

Full details: [`api-uses/commerce-and-listing-extraction.md`](api-uses/commerce-and-listing-extraction.md)

### Media Extraction

Image and Video extraction provide structured asset metadata from known pages. Image fields include asset URL, dimensions, title, tags, links, source page, and crawl timestamp; video fields add embed URL, author, date, duration, view count, thumbnails/images, MIME, text, and HTML context.

Full details: [`api-uses/media-extraction.md`](api-uses/media-extraction.md)

### Event Extraction

Event extraction turns an event page into scheduling and place fields such as `name`, `description`, `startDateTime`, `endDateTime`, `timezone`, `location`, `venue`, `onlineLink`, `sponsors`, `categories`, `tags`, images, and provenance. It is strongest for draft calendar, local-event, field-marketing, and event-CMS workflows.

Full details: [`api-uses/event-extraction.md`](api-uses/event-extraction.md)

### Job Posting Extraction

Job extraction turns a known public job-posting URL into hiring fields such as `name`, `description`, `employer`, `locations`, `remote`, `skills`, `requirements`, `tasks`, `date`, `summary`, `jobCategories`, and source identifiers. It is useful after another workflow has already discovered candidate job URLs.

Full details: [`api-uses/job-posting-extraction.md`](api-uses/job-posting-extraction.md)

## Field And Data Themes

- Required input across endpoints: `url`.
- Common optional controls: `fields`, `timeout`, `discussion`; Article also has `paging`, `maxTags`, and `naturalLanguage`; Discussion has `paging` and `maxPages`; Analyze adds `mode` and `fallback`.
- Common provenance fields: `id`, `diffbotUri`, `pageUrl`, `resolvedPageUrl`, `crawlTimestamp`, and request metadata when present.
- Content fields: `title`, `text`, `html`, `description`, `summary`, `tags`, `categories`, `quotes`, `images`, `videos`, and discussion `posts`.
- Commerce fields: `offerPrice`, `regularPrice`, `shippingAmount`, `saveAmount`, price-detail objects, `availability`, `brand`, `sku`, `gtin`, `upc`, `mpn`, `isbn`, `productId`, and `category`.
- Event fields: `startDateTime`, `endDateTime`, `timezone`, `location`, `locations`, `venue`, `onlineLink`, and `sponsors`.
- Job fields: `employer`, `locations`, `remote`, `skills`, `requirements`, `tasks`, `jobCategories`, and posting `date`.
- Media fields: image/video `url`, `embedUrl`, dimensions, `duration`, `viewCount`, thumbnails/images, `mime`, `author`, and source page fields.
