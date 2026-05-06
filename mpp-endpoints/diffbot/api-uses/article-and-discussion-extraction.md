# Diffbot: Article And Discussion Extraction API Uses

## What This Endpoint Group Does

This endpoint group turns public text-heavy pages into structured records. `POST /diffbot/article` is for news, blog, and article-like pages; `POST /diffbot/discussion` is for forums, comments, reviews, and other threaded conversation pages. Both endpoints take a target `url` plus optional extraction controls and return extracted `objects` with content, provenance, authorship, timestamps, tags, sentiment, and discussion signals when available.

The practical value is that a workflow can treat messy pages as comparable data: article title/text/date/author fields for content understanding, and discussion `posts`, `numPosts`, `numParticipants`, post authors, post dates, and post text for audience reaction or community intelligence. The MPP wrapper OpenAPI documents request fields and payment status, but it does not publish detailed 200 response schemas; output fields here are grounded in the local endpoint inventory and Diffbot ontology snapshots and should be handled as optional.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/diffbot/article` | Extract clean article text, title, author, date, tags, images, sentiment, optional NLP outputs, and optionally embedded discussion data from article-like pages. | `url` required; optional `fields`, `timeout`, `discussion`, `paging`, `maxTags`, `naturalLanguage`. | `objects[].title`, `objects[].text`, `objects[].author`, `objects[].authorUrl`, `objects[].date`, `objects[].estimatedDate`, `objects[].sentiment`, `objects[].tags`, `objects[].categories`, `objects[].quotes`, `objects[].images`, `objects[].discussion`, `objects[].pageUrl`, `objects[].resolvedPageUrl`, `objects[].id`, `objects[].diffbotUri`, `objects[].crawlTimestamp`. |
| `POST` | `/diffbot/discussion` | Extract threaded comments, forum posts, reviews, participant counts, pagination, tags, and post-level content from discussion-like pages. | `url` required; optional `fields`, `timeout`, `discussion`, `paging`, `maxPages`. | `objects[].title`, `objects[].posts`, `objects[].numPosts`, `objects[].numParticipants`, `objects[].tags`, `objects[].language`, `objects[].provider`, `objects[].rssUrl`, `objects[].nextPage`, `objects[].nextPages`, `objects[].pageUrl`, `objects[].resolvedPageUrl`, `objects[].id`, `objects[].diffbotUri`, `objects[].crawlTimestamp`; post examples include `text`, `html`, `author`, `authorUrl`, `date`, `sentiment`, `images`, `language`, `pageUrl`. |

## Field Notes

### Inputs

`url` is the central required field for both endpoints. It identifies the public page to extract. The wrapper docs and OpenAPI describe this as the article page URL for `/diffbot/article` and the discussion page URL for `/diffbot/discussion`.

`fields` is a comma-separated optional control for extra fields such as `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, and `quotes`. It matters when a workflow needs page provenance, outbound-link context, quoted statements, or breadcrumb/category context in addition to the core extracted object.

`timeout` is an optional request timeout in milliseconds, with 30000 documented as the default in the wrapper schema. `paging` has endpoint-specific meaning: article extraction can concatenate multi-page articles, while discussion extraction can follow pagination links. `maxPages` limits paginated discussion traversal, with 20 documented as the default. `maxTags` limits article tags, with 10 documented as the default. `discussion` controls comment/discussion extraction and is documented as defaulting true for article-like extraction. `naturalLanguage` is available on article extraction for NLP features such as `entities`, `sentiment`, `summary`, `facts`, and `categories`.

### Outputs

Article outputs center on readable content and provenance: `title`, `text`, `html`, `author`, `authorUrl`, `date`, `estimatedDate`, `siteName`, `pageUrl`, `resolvedPageUrl`, `publisherCountry`, `publisherRegion`, `id`, `diffbotUri`, and `crawlTimestamp`. They also include enrichment fields such as `sentiment`, `tags`, `categories`, `quotes`, `images`, `videos`, `language`, `breadcrumb`, `nextPage`, `nextPages`, and `numPages` when present.

Discussion outputs center on conversation structure: `title`, `posts`, `numPosts`, `numParticipants`, `provider`, `rssUrl`, `language`, `pageUrl`, `resolvedPageUrl`, `nextPage`, `nextPages`, `numPages`, `tags`, `id`, `diffbotUri`, and `crawlTimestamp`. The ontology example for `posts` shows nested post fields including `date`, `sentiment`, `images`, `author`, `authorUrl`, `language`, `html`, `pageUrl`, and `text`.

The identifiers are useful for deduplication and audit trails: `id`, `diffbotUri`, `pageUrl`, `resolvedPageUrl`, `authorUrl`, and `rssUrl`. Timestamps are useful for sorting and freshness checks: article `date`, `estimatedDate`, `crawlTimestamp`, and post dates when returned. Quantity fields such as `numPages`, `numPosts`, `numParticipants`, `maxPages`, and `maxTags` support cost, coverage, and engagement controls.

### Important Constraints Or Gaps

The MPP endpoints are paid requests with an estimated cost of `$0.004` each and `x-payment-info.amount` of `4200` in the MPP OpenAPI. This artifact did not call the endpoints, make payments, use API keys, create accounts, sign wallet messages, or run live extraction.

The wrapper OpenAPI documents request bodies and 200/402 status descriptions, but not detailed 200 response schemas. Response fields are therefore mixed-source: wrapper/OpenAPI for inputs and payment metadata, Diffbot ontology and official reference snapshots for outputs. Diffbot's ontology snapshots explicitly note that fields are not guaranteed to exist in every entity record, so consumers should preserve raw output and tolerate missing, null, or type-varying fields.

The docs reviewed here do not establish wrapper-specific timeout behavior, failure payloads, per-field confidence, licensing/rights metadata, source-site permission status, or exact parity with every upstream Diffbot query parameter. Callers also need their own compliance checks for source-site terms, copyright, privacy, and robots/legal constraints.

## Use Cases

### Media Monitoring And Briefing Triage

A person tracking a topic can send saved article URLs through `/diffbot/article` to get `title`, `text`, `author`, `date`, `tags`, `categories`, `sentiment`, `quotes`, `pageUrl`, and `resolvedPageUrl` in a consistent shape. That makes a personal news digest or research notebook easier to sort by topic, source, date, and tone without hand-copying text from each page.

A communications, policy, or investor-relations team could use the same fields to triage coverage about a company, product, executive, or regulation. `naturalLanguage` outputs such as entities, summary, facts, categories, and sentiment can support routing and prioritization; `quotes` can flag directly attributable statements; `authorUrl`, `siteName`, `publisherCountry`, and `publisherRegion` support source review. The main caveats are that sentiment and categories need human review for high-stakes decisions, and the endpoint does not provide rights metadata for republishing extracted text.

### Competitive And Market Narrative Tracking

An individual founder, analyst, or investor can extract articles about competitors or markets and compare `text`, `tags`, `categories`, `sentiment`, `quotes`, publication dates, and source URLs across a small set of URLs. This supports questions like which product claims are recurring, which topics are rising, and which quotes are being reused across coverage.

A business can enrich competitive-intelligence workflows by normalizing news, blog posts, and analyst commentary into records that can be searched, clustered, summarized, or reviewed by human analysts. `id`, `diffbotUri`, `pageUrl`, and `resolvedPageUrl` help deduplicate articles, while `date`, `estimatedDate`, and `crawlTimestamp` help separate current coverage from stale references. This endpoint group does not crawl the web by itself; it operates on supplied URLs, so discovery, source selection, and freshness policy must come from another workflow.

### Research Corpus Building For Retrieval Or Analysis

A student, journalist, or independent researcher can turn article URLs and discussion threads into a small structured corpus. Article `text`, `html`, `quotes`, `tags`, `categories`, `author`, and dates provide the main document body and citation context; discussion `posts`, post authors, post dates, and post text preserve reader or community responses.

A business building internal search, retrieval-augmented generation, or qualitative research tooling can store these outputs alongside raw snapshots and provenance fields. The value is not just the extracted text, but the ability to filter by source, publication date, language, topic tags, sentiment, and discussion volume before sending content into downstream summarization or review. The limitation is schema variability: output objects should be validated and versioned, and raw extraction responses should be retained because the wrapper does not publish a complete response schema.

### Customer Voice And Community Feedback Mining

A person choosing a product, software tool, or service can use `/diffbot/discussion` on public review pages, forum threads, or comment pages to extract `posts`, `numPosts`, `numParticipants`, post text, authors, dates, and sentiment when available. That makes it easier to compare recurring complaints, praise, and unresolved questions across several discussion URLs.

A product, support, or user-research team can use discussion extraction to build a feedback queue from public communities. `numPosts` and `numParticipants` help prioritize high-activity threads; post `date` helps separate current issues from old ones; `tags` and post text support clustering into themes; `pageUrl`, `resolvedPageUrl`, `provider`, and `rssUrl` help preserve provenance. This is only suitable for public-source analysis with clear compliance boundaries, and sentiment should be treated as a triage signal rather than a definitive user-satisfaction score.

### Risk, Incident, Or Reputation Response

An individual public figure, project maintainer, or small business owner can extract article coverage and discussion threads around an incident to see what was published, when it appeared, what quotes are circulating, and how public conversation is developing. Article `sentiment`, `quotes`, `author`, `date`, and `tags` show the coverage frame; discussion `posts`, `numParticipants`, and `numPosts` show whether a conversation is expanding.

An enterprise communications or trust-and-safety team could connect these records to escalation workflows. High-volume discussions, recent post dates, negative sentiment, or specific tags can trigger human review; `pageUrl`, `resolvedPageUrl`, `id`, and `diffbotUri` preserve audit trails for follow-up. The endpoint group does not verify truthfulness, source authority, legal risk, or identity claims, so response playbooks need human validation and source ranking before action.

### Content Deduplication, Archiving, And Citation Management

A person maintaining bookmarks, reading notes, or a private archive can use article extraction to store normalized `title`, `author`, `date`, `text`, `pageUrl`, `resolvedPageUrl`, `siteName`, `language`, `images`, and `quotes`. This makes later search and citation easier than relying on browser titles and URLs alone.

A publisher, library, knowledge-management team, or compliance team can use identifiers and provenance fields to deduplicate references to the same article, track redirects, and preserve citation context. `breadcrumb`, `categories`, `publisherCountry`, and `publisherRegion` can support classification, while `crawlTimestamp` and page dates help record when the content was observed. The endpoint does not grant storage or republication rights, so archiving workflows need retention and copyright policy outside the API.

### Moderation Queue Seeding From Public Threads

A community manager or open-source maintainer can extract public thread text from selected URLs and review `posts`, `author`, `authorUrl`, `date`, `sentiment`, and `text` to identify threads that need a response, documentation update, or escalation. `paging` and `maxPages` help bound large threads so the workflow does not collect more pages than needed.

A platform, brand, or support organization can use discussion extraction to seed moderation or response queues from public forums it is allowed to monitor. `numPosts`, `numParticipants`, recent post dates, and negative sentiment can prioritize queues; `tags` can route threads by product, feature, or issue; `pageUrl` and `resolvedPageUrl` preserve review links. The endpoint does not expose platform moderation actions, user verification, or complete identity data, and it should not be used to bypass access controls or collect private conversations.
