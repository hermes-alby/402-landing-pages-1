# Brave Search: News Monitoring And Research API Uses

## What This Endpoint Group Does

This group covers Brave News Search through the MPP wrapper. It is a dedicated news-index endpoint for finding articles by query, date freshness, and country. The key outputs are article titles, URLs, descriptions, age strings, publication dates, fetch dates, source hostnames, favicons, thumbnails, and optional extra snippets upstream.

The endpoint is most useful when recency and source identity matter. It can support monitoring, event research, public-relations triage, market intelligence, and historical article retrieval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/brave/news-search` | Search news articles from Brave's news index. | `q`, `count`, `freshness`, `country` | `query`, `results[].title`, `url`, `description`, `age`, `page_age`, `page_fetched`, `meta_url`, `thumbnail` |

## Field Notes

### Inputs

`q` is required. `freshness` is the most important workflow control: `pd` for the last 24 hours, `pw` for seven days, `pm` for 31 days, `py` for a year, or a custom `YYYY-MM-DDtoYYYY-MM-DD` range. The wrapper lists `count` and `country`; official upstream docs additionally document language, UI language, offset, SafeSearch, spellcheck, extra snippets, Goggles, search operators, and fetch metadata.

### Outputs

Each result can include title, source URL, description, human-readable age, `page_age` publication date, `page_fetched` crawl date, `meta_url` URL components and favicon, thumbnail, and optional `extra_snippets`. `query` may include spellcheck and operator details.

### Important Constraints Or Gaps

The MPP OpenAPI does not define the 200 response schema, so response fields are derived from official Brave docs. News relevance and freshness are search-derived; `page_age` and `page_fetched` may be absent or differ from the article's actual publication timeline. The wrapper does not confirm whether upstream offset, Goggles, and extra snippets are accepted.

## Use Cases

### Breaking News Alerts With Source Triage

A person tracking a topic such as severe weather, local policy, a product recall, or a sports transfer can query with `freshness=pd` and inspect `age`, `page_age`, `title`, `description`, and `meta_url.hostname` to quickly decide whether a result is new, relevant, and from a recognizable source.

A business can turn the same fields into alert rules for brand, industry, supply-chain, or executive-risk monitoring. The workflow can deduplicate by URL and hostname, prioritize articles with recent `page_age`, and send only high-value items to Slack, email, or an analyst queue. The system should preserve source URL and fetch date so humans can audit why an alert fired.

### PR And Reputation Monitoring

A founder, creator, or public figure can search their name, company, or product and use the news result list to see how coverage is changing. `description`, `thumbnail`, and `age` provide enough context to decide whether to open, ignore, or save an article.

For communications teams, the endpoint can support daily clipping reports and crisis monitoring. Query templates can include brand names, executives, product names, and negative terms. `meta_url.hostname` helps group coverage by publisher, while `freshness` prevents old articles from crowding a daily report. This use still needs human review because snippets may not capture article tone reliably.

### Market And Competitor Intelligence

An investor, job seeker, or buyer can monitor companies or sectors by querying competitor names, funding terms, partnerships, layoffs, litigation, or product launches. Date filters make it possible to compare the past day, week, or month.

A business can use this as a lightweight market-intelligence feed for sales and strategy teams. The returned title, URL, source, and publication/fetch fields can enrich account records or trigger sales outreach when a customer announces funding, expansion, or a leadership change. It is not a full entity-recognition product, so entity matching should be handled downstream.

### Historical Event Research

A person researching an event can use a custom date range in `freshness` to find contemporary coverage rather than current retrospectives. Article titles, source URLs, and dates help build a chronology.

Businesses can apply this to compliance, legal, due diligence, or investment research where the timing of public information matters. The endpoint can gather candidate articles for a human review pack, with `page_age` and `meta_url.hostname` supporting provenance. The docs do not promise complete historical coverage, so the artifact should be framed as search evidence, not exhaustive archive evidence.

### Locale-Specific News Discovery

A traveler, researcher, or multilingual user can target country and, if upstream fields are passed through, language preferences to surface regional coverage. That matters when an event is covered differently in local versus international media.

Businesses with country-specific operations can use locale controls to monitor regional regulations, strikes, launches, or customer sentiment. The wrapper currently documents only `country`; if language fields are required, they should be validated in an approved integration test before production use.
