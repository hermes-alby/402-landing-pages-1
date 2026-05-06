# SpyFu API Uses

## Service Summary

SpyFu provides competitive SEO and PPC intelligence: domain analytics, keyword research, paid ad history, competitor discovery, keyword overlap, and organic ranking history. The MPP service at `https://spyfu.mpp.tempo.xyz` wraps SpyFu's first-party API with nine paid GET wildcard endpoint families.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Domain Analytics | 1 | Retrieve current and historical domain-level SEO/PPC metrics, active dates, bulk domain snapshots, and matching domains. | [domain-analytics.md](api-uses/domain-analytics.md) |
| SEO Keyword Performance | 1 | Analyze organic rankings, ranking changes, top pages, live SERP stats, and organic competitive opportunities. | [seo-keyword-performance.md](api-uses/seo-keyword-performance.md) |
| PPC Ad And Keyword Intelligence | 2 | Inspect paid SERP ads and PPC keywords to understand competitor ad copy, bids, and campaign changes. | [ppc-ad-and-keyword-intelligence.md](api-uses/ppc-ad-and-keyword-intelligence.md) |
| Ad History Research | 1 | Review historical ad copy and ad performance by domain or keyword across months and countries. | [ad-history-research.md](api-uses/ad-history-research.md) |
| Competitor Discovery | 1 | Find top SEO, PPC, or combined competitors for a domain and quantify overlap or market proximity. | [competitor-discovery.md](api-uses/competitor-discovery.md) |
| Keyword Overlap Analysis | 1 | Compare domains across shared and exclusive SEO/PPC keywords to expose gaps and defensive opportunities. | [keyword-overlap-analysis.md](api-uses/keyword-overlap-analysis.md) |
| Related Keyword Expansion | 1 | Expand seed keywords into related, question, transactional, ad-buying, ranking, and bulk keyword intelligence. | [related-keyword-expansion.md](api-uses/related-keyword-expansion.md) |
| Organic Ranking History | 1 | Retrieve historical organic rankings for domains and keywords across date ranges. | [organic-ranking-history.md](api-uses/organic-ranking-history.md) |

## Highest-Value Uses

The strongest uses are practical marketing decisions that need competitor search data without a full SpyFu API setup: qualifying a competitor set, prioritizing SEO content, triaging ranking losses, finding PPC keywords and ad copy that competitors have tested, and enriching leads or client audits with domain-level search footprint. The API is most valuable when a workflow already has domains or seed keywords and needs measurable search-market context.

## Personal Use Opportunities

A solo founder, affiliate publisher, creator, or independent consultant can use MPP calls to research a niche before launching content or ads. The useful workflows are competitor baseline checks, finding related and question keywords, spotting ranking opportunities, reviewing ad copy before buying traffic, and checking whether a domain has meaningful organic or paid footprint before deeper research.

## Business Use Opportunities

Agencies and marketing teams can automate client audits, competitor monitoring, keyword-gap analysis, paid-search research, market-map refreshes, and ranking-loss investigations. Sales teams can enrich target accounts with search activity and competitor context before outreach. Product and strategy teams can watch competitor ad messaging and long-running keyword movement as market signals.

## Endpoint Group Summaries

### Domain Analytics

Retrieve current and historical domain-level SEO/PPC metrics, active dates, bulk domain snapshots, and matching domains. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/domain-analytics.md](api-uses/domain-analytics.md).

### SEO Keyword Performance

Analyze organic rankings, ranking changes, top pages, live SERP stats, and organic competitive opportunities. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/seo-keyword-performance.md](api-uses/seo-keyword-performance.md).

### PPC Ad And Keyword Intelligence

Inspect paid SERP ads and PPC keywords to understand competitor ad copy, bids, and campaign changes. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/ppc-ad-and-keyword-intelligence.md](api-uses/ppc-ad-and-keyword-intelligence.md).

### Ad History Research

Review historical ad copy and ad performance by domain or keyword across months and countries. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/ad-history-research.md](api-uses/ad-history-research.md).

### Competitor Discovery

Find top SEO, PPC, or combined competitors for a domain and quantify overlap or market proximity. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/competitor-discovery.md](api-uses/competitor-discovery.md).

### Keyword Overlap Analysis

Compare domains across shared and exclusive SEO/PPC keywords to expose gaps and defensive opportunities. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/keyword-overlap-analysis.md](api-uses/keyword-overlap-analysis.md).

### Related Keyword Expansion

Expand seed keywords into related, question, transactional, ad-buying, ranking, and bulk keyword intelligence. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/related-keyword-expansion.md](api-uses/related-keyword-expansion.md).

### Organic Ranking History

Retrieve historical organic rankings for domains and keywords across date ranges. The detailed artifact covers field notes, endpoint coverage, use cases, source notes, and open questions: [api-uses/organic-ranking-history.md](api-uses/organic-ranking-history.md).

## Field And Data Themes

The core identifiers are domains, URLs, keywords, competitor domains, countries, and dates. The most useful quantitative fields include ranks, rank changes, search volume, CPC, keyword difficulty, paid and organic clicks, organic value, estimated budget, keyword counts, ad positions, and overlap metrics. Content-oriented fields include ad text, keyword text, titles, URLs, SERP snippets, and top-page metadata.
