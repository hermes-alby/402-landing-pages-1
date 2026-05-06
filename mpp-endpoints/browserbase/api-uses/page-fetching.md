# Browserbase: Page Fetching API Uses

## What This Endpoint Group Does

Browserbase Page Fetching retrieves the raw HTTP response for a known URL through `POST /fetch`, mapped to Browserbase's first-party `POST /v1/fetch`. It is for fast, non-interactive retrieval where the caller needs the response status, headers, body, MIME type, and encoding without starting a browser session.

The endpoint accepts a required `url` plus optional `allowRedirects`, `allowInsecureSsl`, and `proxies` booleans. It returns a fetch `id`, target `statusCode`, response `headers`, response `content`, `contentType`, and `encoding` (`utf-8` for text or `base64` for binary). Error responses expose `statusCode`, `error`, `message`, and sometimes `id`, which makes failures routable without parsing page content.

Use a Browserbase browser session instead when the target page requires JavaScript rendering, interactive navigation, authentication flows, long page loads, or more than the 1 MB content limit.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/fetch` | Fetch a page and return raw content, headers, and metadata without executing JavaScript. | `url`, `allowRedirects`, `allowInsecureSsl`, `proxies` | `id`, `statusCode`, `headers`, `content`, `contentType`, `encoding`, error `statusCode`/`error`/`message` |

## Field Notes

### Inputs

`url` is the required target URL and should be a public URL that can be useful from its raw HTTP response. `allowRedirects` defaults to `false`; leaving it off is useful for detecting redirect behavior, while setting it to `true` is useful when the final destination content matters more than the redirect chain. `allowInsecureSsl` defaults to `false` and bypasses TLS certificate verification only when explicitly enabled; it should be reserved for trusted targets with known certificate problems. `proxies` defaults to `false` and routes the fetch through Browserbase's proxy network when set to `true`, which can help when a site blocks direct retrieval but may increase response time.

The MPP feed lists payment amount `10000` with `decimals: 6` for this endpoint, interpreted in the inventory as 0.01 units of the listed stablecoin per request. Browserbase's first-party API uses `X-BB-API-Key`; the MPP wrapper uses a payment flow, but the wrapper-specific payment header details are not documented in the first-party Fetch docs.

### Outputs

`id` identifies the fetch request and is useful for logging, correlating retries, or escalating failures. `statusCode` is the HTTP status from the target page on success, and error responses also include a status code for the Browserbase fetch operation. `headers` contains target response headers as key-value pairs, which can expose redirects, cache behavior, content language, security headers, content length, or server metadata when present.

`content` is the response body as a string. Text responses are returned as UTF-8; binary responses are returned as Base64. `contentType` tells the caller how to parse or route the body, and `encoding` distinguishes `utf-8` from `base64`. Error responses use `error` and `message` to distinguish invalid requests, concurrent fetch limits, content-size/TLS failures, and timeouts.

### Important Constraints Or Gaps

Fetch does not execute JavaScript, so it sees only the raw HTTP response and not a client-rendered DOM. Responses over 1 MB return a 502 content-too-large error, and pages that take more than 10 seconds return a 504 timeout. The OpenAPI reference documents 400 for invalid request bodies, 429 for concurrent fetch request limits, 502 for oversized responses or TLS certificate verification failure, and 504 for timeouts. Browserbase plan docs list first-party Fetch API RPS and credit limits, but exact MPP wrapper rate or concurrency limits are not separately documented.

The request schema exposes only `url`, `allowRedirects`, `allowInsecureSsl`, and `proxies`; it does not expose browser-session controls such as clicks, waits, screenshots, cookies, persisted contexts, geolocation, or JavaScript evaluation. Workflows needing those controls should start a browser session.

## Use Cases

### Public Link Health And Redirect Diagnostics

A person maintaining a portfolio, blog, reading list, or personal wiki can periodically fetch important links and use `statusCode`, `headers`, and `contentType` to find broken pages, unexpected redirects, expired certificates, or content that changed from HTML to a download. Keeping `allowRedirects: false` makes redirects visible; setting it to `true` verifies the final page when the target legitimately moved. `id`, `error`, and `message` make failures easy to log without storing the full page.

A business can use the same pattern for marketing pages, partner links, help-center articles, public landing pages, and campaign URLs. The endpoint is valuable because it returns protocol-level evidence, not just a yes/no result. A 301, 404, 502 TLS error, or 504 timeout can trigger different actions: update links, renew certificates, route to site reliability, or fall back to a browser session if the page is slow or JavaScript-rendered. Each check has a per-request payment cost under the MPP feed, so large monitoring jobs should deduplicate URLs and avoid repeatedly fetching pages that cannot fit under 1 MB.

### Static Page Change Tracking For Pricing, Terms, And Documentation

An individual can track public pages that matter to daily decisions, such as product pricing, terms, availability pages, changelogs, or software documentation. Fetching the `url` and hashing `content` gives a lightweight change detector, while `headers` can preserve cache and last-modified metadata when the origin exposes it. `contentType` and `encoding` tell the workflow whether it can parse the body as text or needs to treat it as Base64.

For a business, this supports vendor monitoring, competitive intelligence, procurement review, and documentation drift detection. The endpoint can capture the raw page response before normalization, which is useful for evidence and reproducibility. The main limitation is that modern pricing pages and app docs may render important content with JavaScript or exceed 1 MB; those cases need a browser session or a targeted source such as an RSS feed, sitemap, API reference, or `llms.txt` file.

### Crawl Seeding From Known Machine-Readable URLs

A person building a personal knowledge base can fetch known static resources such as `robots.txt`, `sitemap.xml`, RSS feeds, changelog pages, or `llms.txt` files. `contentType` and `encoding` help route XML, text, HTML, and binary responses to the right parser, and `statusCode` prevents a failed fetch from becoming bad source material. `allowRedirects` can be enabled when the canonical resource moved.

A business can use this as the first step in a controlled public-web ingestion pipeline. Instead of launching browsers for every candidate URL, the workflow can fetch cheap static entry points, extract candidate links from `content`, and only spend browser-session time on pages that need rendering or interaction. The 10 second timeout and 1 MB limit are useful guardrails for keeping crawls bounded, but they also mean large feeds, generated sitemaps, and slow docs sites need fallback handling.

### Lightweight Competitive Or Market Snapshotting

A person comparing products, subscriptions, travel offers, or public listings can fetch known pages and extract visible raw HTML for price snippets, titles, canonical links, and metadata when the page is server-rendered. `statusCode` separates unavailable pages from unchanged content, and `headers` can reveal whether a result came from cached infrastructure. The endpoint is not appropriate when the comparison depends on logged-in pricing, infinite scroll, location-specific JavaScript, or checkout flows.

Businesses can use the same raw retrieval in market research, sales enablement, and product operations: watch public competitor pages, press pages, docs, or partner listings, then send changed `content` to a parser or review queue. `proxies: true` may help when a site blocks ordinary fetches, but the docs note proxying can increase response time, and the endpoint has no field for choosing a specific geography. For geo-sensitive or anti-bot-sensitive work, a browser session with explicit settings is the stronger fit.

### Public Asset And Download Preflight

A person can verify that small public files such as PDFs, images, release notes, or exported documents are reachable before sharing them. `contentType` confirms whether the target is really the expected MIME type, `encoding: base64` identifies binary payloads, and `statusCode` catches broken or forbidden links. Because binary content is returned in `content`, this should be limited to small files under the 1 MB limit.

A business can apply this to release pipelines, documentation sites, support portals, media libraries, and customer-facing download links. A preflight job can fetch URLs, check `headers` and `contentType`, and trigger repairs before customers see a broken asset. For large binaries, malware scanning, authenticated assets, or downloads requiring button clicks, the endpoint should only be used for metadata checks and the deeper workflow should move to a browser session or a dedicated storage API.

### Failure Triage Before Escalating To Browser Sessions

A person running an agent can use Fetch as a first pass before paying for or orchestrating a full browser session. If `statusCode` is 200 with `contentType: text/html` and `encoding: utf-8`, the agent can summarize or parse the returned `content`. If it receives a 502 content-too-large message, a 504 timeout, or content that clearly depends on JavaScript, the agent can escalate to a Browserbase session.

For a business automation platform, this creates a practical router: Fetch handles straightforward pages, while browser sessions are reserved for interactive, slow, or JavaScript-heavy targets. That keeps latency and spend more predictable, especially with a per-request MPP amount on Fetch and separate session-time pricing for browsers. The error fields are central to this use case because they turn operational failures into explicit decisions rather than ambiguous empty content.
