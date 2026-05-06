# StableEnrich: Web Search, Content Extraction, And Crawling API Uses

## What This Endpoint Group Does

Search the web semantically or by keyword, fetch page contents, answer research questions with citations, scrape pages, and run bounded browser-rendered site crawls.

These endpoints are the research and retrieval layer: they discover sources, extract readable content, answer questions, or crawl multiple pages from a site.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/exa/search` | Exa Search - Neural search across the web ($0.01) | numResults, includeDomains, excludeDomains, startCrawlDate, endCrawlDate, startPublishedDate, endPublishedDate, includeText | requestId, resolvedSearchType, results, results.title, results.url, results.publishedDate, results.author, results.score |
| POST | `/api/exa/find-similar` | Exa Find Similar - Find pages similar to a given URL ($0.01) | numResults, includeDomains, excludeDomains, startCrawlDate, endCrawlDate, startPublishedDate, endPublishedDate, includeText | requestId, results, results.title, results.url, results.publishedDate, results.author, results.score, results.id |
| POST | `/api/exa/contents` | Exa Contents - Retrieve content from URLs ($0.002) | text, text.maxCharacters, text.includeHtmlTags, highlights, highlights.numSentences, highlights.highlightsPerUrl, highlights.query, summary | requestId, results, results.title, results.url, results.publishedDate, results.author, results.score, results.id |
| POST | `/api/exa/answer` | Exa Answer - Get AI-generated answers with citations ($0.01) | query, stream, text | answer, citations, citations.id, citations.url, citations.title, citations.author, citations.publishedDate, citations.text |
| POST | `/api/firecrawl/scrape` | Firecrawl Scrape - Scrape a URL with full JavaScript rendering. Use as a fallback when WebFetch returns empty/JS-only content or 403s. ($0.0126) | url | url, title, content |
| POST | `/api/firecrawl/search` | Firecrawl Search - Search the web ($0.0252) | query, limit | results, results.title, results.url, results.description, results.snippet, query, resultCount |
| POST | `/api/cloudflare/crawl` | Cloudflare Browser Rendering Crawl - Start a crawl job and return a token to poll for results. Respects robots.txt and supports pattern-based URL filtering. ($0.1) | url, limit, depth, formats, render, source, options, options.includeExternalLinks | token |
| GET | `/api/cloudflare/jobs` | Poll Cloudflare crawl job status and retrieve results. Requires SIWX wallet auth - only the wallet that paid can poll. (free) | token | id, status, records, records.url, records.status, records.html, records.markdown, records.json |

## Field Notes

### Inputs

- `query`
- `url`
- `urls`
- `numResults`
- `category`
- `limit`
- `depth`
- `formats`
- `render`
- `source`
- `includeExternalLinks`
- `includeSubdomains`
- `includePatterns`
- `excludePatterns`
- `token`

### Outputs

- `results`
- `answer`
- `citations`
- `contents`
- `markdown`
- `html`
- `metadata`
- `links`
- `token`
- `crawl status`
- `records`
- `total`
- `finished`
- `skipped`
- `browserSecondsUsed`
- `cursor`

### Important Constraints Or Gaps

- The docs do not publish exact search index freshness, ranking behavior, or browser-rendering resource limits beyond Cloudflare crawl depth and page caps.
- Cloudflare jobs requires SIWX auth by the paying wallet; this inventory did not perform that auth flow.
- Endpoints in this group cost /api/exa/search: $0.01; /api/exa/find-similar: $0.01; /api/exa/contents: $0.002; /api/exa/answer: $0.01; /api/firecrawl/scrape: $0.0126; /api/firecrawl/search: $0.0252; /api/cloudflare/crawl: $0.1; /api/cloudflare/jobs: free.

## Use Cases

### Research Briefs With Source Retrieval

A person can use Exa search or answer for quick discovery, then use Exa contents or Firecrawl scrape to retrieve readable source material from selected URLs. Query, category, URL, markdown, metadata, answer, and citation fields let a workflow move from question to source-backed notes without manually opening every page.

Businesses can turn this into repeatable market, competitor, policy, or technical research pipelines. The strongest pattern is search broadly, extract selectively, and preserve citations; the docs do not publish index freshness or ranking details, so important claims still need source review.

### Blocked Or JavaScript-Heavy Page Extraction

When ordinary fetches return blocked pages, empty shells, or JavaScript-only content, Firecrawl scrape and Cloudflare crawl provide structured page extraction, markdown, HTML, metadata, and browser-rendered crawl records. A personal user can archive a small set of pages for reading or comparison.

A business can use this for website audits, documentation capture, vendor monitoring, or content migration prep. Cloudflare crawl is bounded by limit, depth, render mode, and patterns, and its polling endpoint requires SIWX auth by the wallet that paid for the crawl.

### Similarity Expansion And Candidate Discovery

A person who has one useful source can use Exa find-similar to discover related pages, then Exa contents to inspect them. This is useful for finding alternative tools, similar companies, comparable papers, or additional examples.

Analysts can use the same pattern for market maps and source expansion. The category filter, especially company, research paper, github, linkedin profile, and financial report, makes the output more operational than a generic web search, but downstream dedupe and quality scoring remain necessary.
