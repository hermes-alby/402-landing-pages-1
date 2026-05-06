# Browserbase API Uses

## Service Summary

Browserbase provides managed cloud browsers plus lightweight web retrieval APIs for agents, automation scripts, QA workflows, research pipelines, and data extraction. In this MPP catalog, Browserbase exposes six endpoints across three practical surfaces: remote browser session lifecycle, structured web search, and raw page fetching.

The highest-value opportunity is routing work to the cheapest adequate tool: use Search to discover candidate URLs, Fetch to retrieve static public responses, and a browser session when JavaScript execution, screenshots, interactive navigation, cookies, or real browser behavior are required. This makes Browserbase useful for spend-bounded agents, QA smoke checks, market and vendor monitoring, source discovery, and public-web ingestion workflows.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Browser Session Lifecycle | 4 | Create a remote browser session, connect Playwright/Puppeteer/Selenium, monitor time remaining, extend active work, and terminate a session. | [Details](api-uses/browser-session-lifecycle.md) |
| Web Search | 1 | Run bounded web searches and return structured result metadata for discovery, triage, and downstream routing. | [Details](api-uses/web-search.md) |
| Page Fetching | 1 | Retrieve raw HTTP response content, status, headers, content type, and encoding for known URLs without browser execution. | [Details](api-uses/page-fetching.md) |

## Highest-Value Uses

1. Cost-aware web-agent routing: search first, fetch static pages next, and reserve browser sessions for pages that need JavaScript, interaction, screenshots, or longer workflows.

2. Spend-bounded remote browser automation: use `estimatedMinutes`, `sessionId`, `connectUrl`, `expiresAt`, and `usage.minutesRemaining` to give agents a clear browser-time budget and cleanup handle.

3. QA and production smoke checks: run Playwright or Puppeteer against a hosted browser for login, checkout, navigation, screenshot, or JavaScript-heavy release checks without operating browser infrastructure.

4. Source discovery and research triage: use `/search` results to shortlist URLs, titles, authors, dates, favicons, and images before fetching pages, opening browser sessions, or queuing human review.

5. Public-page monitoring: use `/fetch` to check link health, redirects, TLS failures, content type changes, pricing pages, terms pages, changelogs, docs, feeds, sitemaps, and `llms.txt` files.

6. Evidence-preserving ingestion: store search `requestId`, result URLs, fetch `id`, target `statusCode`, `headers`, `contentType`, `encoding`, and raw `content` before downstream normalization.

7. Prototype-to-plan evaluation: measure whether one-off browser sessions, search calls, and fetch calls solve a workflow before committing to a direct Browserbase account plan and its concurrency model.

## Personal Use Opportunities

- Personal research assistant that searches for candidate sources, fetches static pages, and escalates only complex pages into a browser session.
- Link checker for personal sites, portfolios, blogs, reading lists, docs, and shared assets using `statusCode`, `headers`, `contentType`, `error`, and `message`.
- Small automation experiments such as screenshot capture, JavaScript-heavy page checks, travel or shopping comparison, and job or community discovery.
- Personal knowledge-base seeding from known public resources like `robots.txt`, `sitemap.xml`, RSS feeds, changelogs, and `llms.txt`.
- Countdown-aware browser tasks where a script polls `usage.minutesRemaining`, avoids starting work near expiry, and terminates the session when done.

## Business Use Opportunities

- Agent platforms can expose hosted browser capacity per task while logging session IDs, connection handoffs, purchased minutes, usage, and expiry.
- QA and release teams can run remote browser smoke tests against critical production flows without maintaining their own browser fleet.
- Market research, sales, and competitive-intelligence teams can search for candidate pages, fetch static evidence, and queue browser sessions for dynamic or blocked pages.
- Procurement, legal, and product operations can monitor public pricing, terms, documentation, changelogs, vendor pages, and asset links with raw source capture.
- Support and incident teams can route search hits about product names, outages, advisories, or customer complaints into review queues, then fetch or browse only the relevant URLs.
- Data and RAG teams can use Search as a pre-crawl filter and Fetch as the static ingestion path, preserving raw responses and explicit parse failures before indexing.

## Endpoint Group Summaries

### Browser Session Lifecycle

This group covers `POST /browser/session/create`, `GET /browser/session/:id/status`, `POST /browser/session/:id/extend`, and `DELETE /browser/session/:id` in the MPP feed. It is the browser-runtime surface: create a session from an `estimatedMinutes` budget, receive a `sessionId` and `connectUrl`, connect automation clients, monitor `usage.minutesPaid`, `usage.minutesUsed`, `usage.minutesRemaining`, and end the session when the work is complete. Full details: [api-uses/browser-session-lifecycle.md](api-uses/browser-session-lifecycle.md).

### Web Search

This group covers `POST /search`, mapped to Browserbase's first-party search shape. It accepts a `query` and optional `numResults`, then returns `requestId`, the executed `query`, and structured result records with required `id`, `url`, and `title` plus optional author, date, image, and favicon metadata. It is best used as discovery and routing, not as source verification by itself. Full details: [api-uses/web-search.md](api-uses/web-search.md).

### Page Fetching

This group covers `POST /fetch`, mapped to Browserbase's first-party fetch shape. It accepts `url`, `allowRedirects`, `allowInsecureSsl`, and `proxies`, then returns raw response content, status, headers, MIME type, and encoding without executing JavaScript. It is the right path for static public pages, link health, redirects, source snapshots, small assets, and known machine-readable URLs. Full details: [api-uses/page-fetching.md](api-uses/page-fetching.md).

## Field And Data Themes

- Routing fields: search `query`, `numResults`, result `url`, fetch `url`, `allowRedirects`, `allowInsecureSsl`, `proxies`, and browser-session `estimatedMinutes` decide which tool should run next.
- Operational identifiers: `requestId`, search result `id`, fetch `id`, `sessionId`, and direct API IDs such as `projectId` and `contextId` are the handles for logging, deduplication, retry joins, and source provenance.
- Browser handoff fields: `connectUrl`, `expiresAt`, `paidMinutes`, `usage.minutesPaid`, `usage.minutesUsed`, and `usage.minutesRemaining` make browser sessions usable by automation clients and budget-aware agents.
- Source evidence fields: result `title`, `author`, `publishedDate`, `image`, `favicon`, fetch `statusCode`, `headers`, `content`, `contentType`, and `encoding` are the core materials for review, parsing, and audit trails.
- Failure fields: fetch and search errors use HTTP statuses such as `400`, `403`, `429`, `500`, `502`, `503`, and `504`; fetch error bodies include `error` and `message`, which are useful for routing retries or browser-session fallback.
- Cost and quantity fields: `numResults`, session minutes, published x402 session pricing examples, and per-request MPP metadata for `/search` and `/fetch` are the key budgeting inputs.
