# Diffbot: Event Extraction API Uses

## What This Endpoint Group Does

The Event Extraction endpoint turns a public event page URL into structured event data when Diffbot can identify the page as an event. The wrapper accepts the source `url` plus extraction controls such as `fields`, `timeout`, and `discussion`, then returns event objects with fields such as `name`, `description`, `startDateTime`, `endDateTime`, `location`, `locations`, `venue`, `onlineLink`, `sponsors`, `categories`, `tags`, `image`, `images`, `id`, `diffbotUri`, `origins`, and `crawlTimestamp` when available.

This group is useful when the hard part is not finding one event page, but converting many differently formatted event pages into a common record that can be scheduled, compared, enriched, filtered, mapped, or routed. The strongest workflows depend on the date/time, location, description/category, sponsor, image, and source/provenance fields. They should still preserve the raw response because Diffbot notes ontology fields are not guaranteed on every entity, and the MPP wrapper documentation does not define the exact 200 response schema.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/diffbot/event` | Extract event details from a public event page, including dates, location/address, venue, online link, description, categories, sponsors, and media when available. | `url` required; optional `fields` for extras such as `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, `quotes`; optional `timeout`; optional `discussion`. | `objects[].name`, `description`, `startDateTime`, `endDateTime`, `timezone`, `timezoneOffset`, `location`, `locations`, `venue`, `onlineLink`, `sponsors`, `categories`, `tags`, `image`, `images`, `id`, `diffbotUri`, `allUris`, `origins`, `originDetails`, `crawlTimestamp`, `importance`. |

## Field Notes

### Inputs

`url` is the required input and should point to the public page describing the event. The endpoint is designed for page extraction, not event search; callers need to supply candidate event URLs from a crawler, RSS feed, partner list, newsletter, manual submission, or another discovery process.

`fields` is an optional comma-separated control for extra page fields. The wrapper inventory lists `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, and `quotes` as documented values. These extras matter when the downstream workflow needs source-page navigation, original metadata, breadcrumbs for category context, or outbound registration links in addition to the normalized event object.

`timeout` sets the request timeout in milliseconds, with the wrapper docs showing a default of 30000. This is a cost and reliability control for automation: longer timeouts may make slow pages more likely to complete, but the MPP endpoint is paid per request, so retries and timeouts should be budgeted.

`discussion` is documented on the wrapper body, but its description says it extracts comments/discussion threads and mentions the article default. For event pages, the exact effect is unclear. Treat it as a wrapper-supported extraction flag, not as a guaranteed source of attendee comments, reviews, or Q&A.

### Outputs

The core scheduling fields are `startDateTime`, `endDateTime`, `timezone`, and `timezoneOffset`. The ontology examples represent date/time values as objects with a string form, precision, and millisecond timestamp, but the wrapper's exact response shape is not specified. These fields enable calendar creation, deadline reminders, duplicate detection by time window, and conflict checks.

The core place fields are `location`, `locations`, and `venue`. The ontology example for `location` can include address, street, city, region, country, postal code, latitude, longitude, and linked place entities. Those fields support maps, regional filtering, distance calculations, venue matching, and offline/online routing. `onlineLink` is separately useful for webinars, livestreams, and hybrid events.

The descriptive fields are `name`, `allNames`, `description`, `allDescriptions`, `summary`, `categories`, `tags`, `descriptors`, `humanLanguage`, `image`, and `images`. These fields support search, topic classification, recommendation, moderation, display cards, deduplication, and language-aware workflows.

The relationship and provenance fields are `sponsors`, `id`, `diffbotUri`, `allUris`, `allUriDetails`, `origins`, `originDetails`, `crawlTimestamp`, `nbOrigins`, and `types`. They help connect an event to organizations and source pages, but some of these fields are only documented for extended JSON or Knowledge Graph entity records, so callers should verify what the MPP wrapper actually returns before depending on them.

### Important Constraints Or Gaps

The MPP endpoint is paid. The local inventory records estimated cost as `$0.004` per request and OpenAPI payment metadata with amount `4200` in the documented Tempo currency. This artifact used only local/public documentation snapshots and did not call the paid endpoint.

The MPP OpenAPI documents request fields and 200/402 status descriptions, but not a detailed 200 JSON schema. Response fields here are therefore derived from the Diffbot Event ontology, official Event reference snapshot, and local endpoint inventory. Diffbot explicitly notes ontology fields are not guaranteed to exist in every entity record.

Timezone normalization, recurrence handling, cancellation/postponement status, ticket price, capacity, registration status, attendee count, organizer contact details, and per-field confidence are not documented in the local field inventory. Use cases that need those capabilities require another source or manual review.

The endpoint extracts from supplied URLs. It does not discover events, decide whether extraction is legally allowed from a source site, or resolve copyright/privacy/terms-of-use questions. Callers remain responsible for source selection, consent, retention rules, and compliance.

## Use Cases

### Personal Event Calendar Capture

A person could save URLs from venue pages, conference announcements, community boards, or webinar pages and use Event Extraction to turn them into calendar-ready records. `name`, `description`, `startDateTime`, `endDateTime`, `timezone`, `location`, `venue`, and `onlineLink` are the important fields because they let a personal assistant create a draft calendar entry, choose an online versus in-person reminder flow, and show enough context to decide whether the event is worth attending.

For a business, the same workflow can power internal calendars for sales, recruiting, field marketing, or analyst teams. The endpoint can normalize events from many source formats into a shared intake queue. The main limitation is that fields may be absent or imprecise, so production calendar insertion should keep the source `url` and require confirmation when dates, timezones, venue, or online links are missing.

### Local Event Aggregation And Mapping

A community site, city guide, coworking space, or travel product can extract events from submitted URLs and use `startDateTime`, `endDateTime`, `location`, `locations`, `venue`, `categories`, `tags`, `image`, and `description` to populate a local event map. The location fields can support neighborhood filters and map pins, while categories and tags make browse pages more useful than a flat list of copied page titles.

The business value is reducing manual data entry across many event organizers and venues. The caveat is that the endpoint does not discover pages or guarantee geocoding quality, recurrence, cancellation state, or ticket availability. A strong implementation would track `origins` or the original `url`, store `crawlTimestamp` if returned, and refresh high-traffic events before publishing.

### Conference And Webinar Intelligence

A founder, investor, analyst, or sales team can collect URLs for conferences, webinars, meetups, and product launches, then extract `name`, `description`, `startDateTime`, `onlineLink`, `location`, `categories`, `tags`, `sponsors`, and `importance` to decide which events deserve attention. Personal users can prioritize learning and networking opportunities; businesses can prioritize sponsorship outreach, speaker monitoring, or lead-generation campaigns.

The sponsor and category fields are especially valuable because they can turn event pages into market signals: which organizations are attached, which topics are rising, and where activity is concentrated. This should be treated as an enrichment layer rather than a definitive market database because `sponsors`, `importance`, `wikipediaPageviews`, and provenance fields may not appear for every event and may reflect Knowledge Graph availability rather than the full event ecosystem.

### CRM And Outreach Triggering

Sales or partnerships teams can use event URLs from prospect newsletters, event platforms, or company blogs to detect upcoming events involving accounts they care about. `sponsors`, `name`, `description`, `categories`, `tags`, `location`, `onlineLink`, and `startDateTime` can route records into CRM tasks: invite local reps, prepare account-specific outreach, or flag events where a partner is sponsoring or hosting.

The personal analogue is a lightweight reminder system for people who follow a few companies, creators, or professional communities. The extracted record can decide whether to send a reminder, bookmark the source, or add a task to register. The missing pieces are organizer contact details, attendee lists, registration status, and ticketing fields, so any outreach workflow needs additional enrichment and should respect anti-spam, privacy, and source-site terms.

### Content Operations For Event Listings

Publishers, associations, and internal communications teams can use the endpoint to convert event announcement URLs into structured CMS drafts. `name`, `description`, `summary`, `image`, `images`, `startDateTime`, `endDateTime`, `location`, `venue`, `onlineLink`, `categories`, and optional `breadcrumb` or `meta` fields can fill a draft listing while preserving the source URL for editorial review.

This is valuable because editors can review normalized fields instead of manually copying from heterogeneous pages. It is not a replacement for editorial judgment: extracted descriptions may include promotional copy, missing fields need review, image rights are not documented, and the endpoint does not provide licensing metadata. Workflows should keep raw source snapshots or source links and require human approval before publication.

### Duplicate Detection And Event Record Reconciliation

Organizations that receive event URLs from multiple feeds can use `name`, `allNames`, `startDateTime`, `endDateTime`, `location`, `venue`, `onlineLink`, `allUris`, `origins`, `diffbotUri`, and `id` to identify duplicate listings for the same event. A personal user might use this to avoid adding the same webinar from both a speaker page and an event platform; a business can use it to merge duplicate submissions before analytics or publication.

The endpoint's value is that it exposes both human-readable matching fields and potential entity/provenance identifiers. The gap is that the wrapper does not document stable deduplication guarantees, and some identifier/provenance fields may be Knowledge Graph or extended JSON fields rather than always-present Extract output. Matching should therefore combine exact identifiers when present with conservative fuzzy matching on title, time window, location, and source URL.
