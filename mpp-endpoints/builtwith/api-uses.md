# BuiltWith API Uses

## Service Summary

BuiltWith is a website technology-profiling and market-intelligence provider. The MPP wrapper exposes 12 paid POST endpoints that let a caller profile domains, find sites using technologies, map related domains, discover company URLs, inspect tags/IP-related domains, search ecommerce products, get recommendations, check redirects, extract domain keywords, fetch technology trends, evaluate trust signals, and request a lightweight technology summary.

The service is most valuable when a workflow needs concrete public website signals: detected technologies, categories, dates, spend estimates, ranks, company/location/contact metadata, product listings, redirect history, shared identifiers, and trust flags.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Domain Technology And Trust Profiling | 3 | Qualify a domain by current/historical stack, category counts, spend, metadata, and trust flags. | [`api-uses/domain-technology-and-trust-profiling.md`](api-uses/domain-technology-and-trust-profiling.md) |
| Market And Lead Discovery | 4 | Discover domains from technology, company, IP/tag/attribute, or keyword context before deeper enrichment. | [`api-uses/market-and-lead-discovery.md`](api-uses/market-and-lead-discovery.md) |
| Relationship And Redirect Mapping | 2 | Map connected domains through shared identifiers and inbound/outbound redirect history. | [`api-uses/relationship-and-redirect-mapping.md`](api-uses/relationship-and-redirect-mapping.md) |
| Product And Technology Market Intelligence | 3 | Research product availability, ecommerce shops, recommended technologies, and adoption coverage. | [`api-uses/product-and-technology-market-intelligence.md`](api-uses/product-and-technology-market-intelligence.md) |

## Highest-Value Uses

The strongest use is technology-qualified lead generation: query a technology, discover domains using it, then enrich high-potential domains with stack, spend, recency, company, and trust fields. This is immediately useful for sales, partnerships, agencies, and developer-tool companies.

Another high-value use is competitive and market intelligence. Domain profiles show what competitors run, trend endpoints show market size for technologies, product search shows which shops sell a product, and relationship/redirect endpoints reveal connected properties or brand migrations.

Risk and quality triage is also practical. Trust fields, parked status, live/dead technology summaries, redirect history, and shared identifiers help decide whether a merchant, lead, or related domain should be trusted, enriched, routed, or manually reviewed.

## Personal Use Opportunities

A person can vet an unfamiliar website before purchasing by checking trust flags, indexed history, payment/ecommerce indicators, parked status, and live technology presence.

A consultant, founder, or job seeker can inspect a company's domain to understand its stack, maturity, marketing tools, ecommerce posture, and likely vendors before outreach or a meeting.

A reseller or shopper can use product search to find stores listing a product, compare prices, and see when listings were indexed, while treating results as web observations rather than real-time inventory.

## Business Use Opportunities

B2B teams can build stack-qualified prospecting pipelines: `Technology Lists` for candidate domains, `Company to URL` for account cleanup, `Domain Lookup` for stack and spend, `Keywords` for segmentation, and `Trust` for quality controls.

Market intelligence teams can size technology ecosystems with `Trends`, benchmark competitor stacks with `Domain Lookup`, and identify connected domains through `Relationships` and `Redirects`.

Ecommerce, brand protection, and channel teams can use `Product Search` to discover shops selling a product and then profile those shops by technology, trust, and related domains.

Security and risk teams can use relationship identifiers, IP/tag matches, parked flags, earliest record, live technology presence, and redirect history as triage signals for suspicious or unfamiliar domains.

## Endpoint Group Summaries

### Domain Technology And Trust Profiling

This group covers `/builtwith/domain`, `/builtwith/free`, and `/builtwith/trust`. It supports stack enrichment, lead qualification, vendor migration monitoring, lightweight screening, and trust triage. Full details: [`api-uses/domain-technology-and-trust-profiling.md`](api-uses/domain-technology-and-trust-profiling.md).

### Market And Lead Discovery

This group covers `/builtwith/lists`, `/builtwith/company-to-url`, `/builtwith/tags`, and `/builtwith/keywords`. It supports technology-qualified prospecting, company-domain resolution, infrastructure neighborhood discovery, keyword segmentation, and parked-domain filtering. Full details: [`api-uses/market-and-lead-discovery.md`](api-uses/market-and-lead-discovery.md).

### Relationship And Redirect Mapping

This group covers `/builtwith/relationships` and `/builtwith/redirects`. It supports brand/subsidiary graph discovery, rebrand and migration research, shared-tracking risk review, and partner/channel mapping. Full details: [`api-uses/relationship-and-redirect-mapping.md`](api-uses/relationship-and-redirect-mapping.md).

### Product And Technology Market Intelligence

This group covers `/builtwith/product`, `/builtwith/recommendations`, and `/builtwith/trends`. It supports ecommerce assortment research, domain-specific product catalog discovery, technology market sizing, stack-gap recommendations, and product/technology cross-research. Full details: [`api-uses/product-and-technology-market-intelligence.md`](api-uses/product-and-technology-market-intelligence.md).

## Field And Data Themes

Core inputs are domains (`LOOKUP`), technology names (`TECH`), company names (`COMPANY`), product queries (`QUERY`), and tag/IP-like lookup values. Optional controls include privacy/performance suppressors (`NOPII`, `NOMETA`, `NOATTR`, `HIDETEXT`, `HIDEDL`), date filters (`FDRANGE`, `LDRANGE`), live-only filtering, and pagination (`OFFSET`, `SKIP`, `AMOUNT`, `PAGE`, `LIMIT`).

Core outputs are domains, technologies, categories, tags, detection/indexing dates, spend and rank metrics, company and location metadata, socials/contact fields, product prices and titles, relationship identifiers, redirect domains, trust booleans, keyword arrays, recommendation scores, and coverage counts.
