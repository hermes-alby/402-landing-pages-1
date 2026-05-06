# StableEnrich API Uses

## Service Summary

StableEnrich is a Merit Systems pay-per-request API origin for premium data access through HTTP 402/x402/MPP. It exposes local places, B2B prospecting, web search, scraping, crawling, social research, contact enrichment, identity resolution, email verification, and property lookup endpoints without requiring separate StableEnrich subscription plans or direct upstream API keys.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Local Places And Reviews | 6 | Find places by text or geography and retrieve place details, ratings, reviews, hours, contact data, amenities, price signals, and location identifiers. | [local-places-and-reviews.md](api-uses/local-places-and-reviews.md) |
| B2B Prospecting And Company Enrichment | 4 | Search for people and organizations, then enrich selected people or companies with professional, company, funding, employee, and contact attributes. | [b2b-prospecting-and-company-enrichment.md](api-uses/b2b-prospecting-and-company-enrichment.md) |
| Web Search, Content Extraction, And Crawling | 8 | Search the web semantically or by keyword, fetch page contents, answer research questions with citations, scrape pages, and run bounded browser-rendered site crawls. | [web-search-content-and-crawling.md](api-uses/web-search-content-and-crawling.md) |
| Market News, Shopping, And Visual Search | 3 | Use Serper-backed Google News, Shopping, and Lens-style reverse image search for market monitoring, product comparison, and image source discovery. | [market-news-shopping-and-visual-search.md](api-uses/market-news-shopping-and-visual-search.md) |
| Social Discussion And Influencer Enrichment | 4 | Find Reddit discussions, retrieve full post/comment threads, and enrich creator or influencer identities from email or social handles. | [social-discussion-and-influencer-enrichment.md](api-uses/social-discussion-and-influencer-enrichment.md) |
| Person Identity, Contact, And Email Verification | 6 | Resolve people from partial identity signals, enrich profiles with contact and demographic attributes, verify emails, and find contact details from LinkedIn URLs, email addresses, phone numbers, names, or addresses. | [person-identity-contact-and-email-verification.md](api-uses/person-identity-contact-and-email-verification.md) |
| Property And Resident Lookup | 1 | Look up property ownership, resident, and address-linked property details from a structured address. | [property-and-resident-lookup.md](api-uses/property-and-resident-lookup.md) |

## Highest-Value Uses

The highest-value use is a multi-step research and enrichment pipeline: discover sources with Exa, Firecrawl, Serper, Reddit, or Google Maps; qualify organizations with Apollo or local place fields; enrich selected people with Apollo, Minerva, Clado, Hunter, or Influencer only when the record is worth the extra cost; and preserve source links and uncertainty. StableEnrich is especially strong when the user needs occasional access to several premium data providers without creating separate accounts or prepaying provider credits.

Another strong use is spend-controlled agent research. The endpoint prices are fixed per call, the OpenAPI publishes fields, and several endpoints have cheaper scouting variants, such as Google Maps partial search, Exa contents, Minerva email validation, and Apollo search before enrichment. That lets workflows pay more only after a candidate, place, source, or person passes earlier filters.

## Personal Use Opportunities

Personal users can use local place search for venue selection, Exa/Firecrawl for source-backed research, Serper Shopping/Lens for product comparison and visual discovery, Reddit search/comments for community opinions, and Hunter or Minerva validation for narrow contact cleanup. Identity, property, resident, demographic, and contact enrichment endpoints expose sensitive data and should be used cautiously, with consent and legal constraints in mind.

## Business Use Opportunities

Businesses can use StableEnrich for lead sourcing, account qualification, CRM cleanup, vendor and competitor research, news monitoring, local market mapping, creator vetting, customer-support intelligence from Reddit, website audits, and property/address prep for field operations. The best workflows are selective: use low-cost search and validation to reduce candidate pools before calling high-cost enrichment endpoints such as Whitepages, Influencer, Clado, or full Google Maps details.

## Endpoint Group Summaries

### Local Places And Reviews

Find places by text or geography and retrieve place details, ratings, reviews, hours, contact data, amenities, price signals, and location identifiers. See [local-places-and-reviews.md](api-uses/local-places-and-reviews.md) for endpoint coverage, fields, use cases, source notes, and open questions.
### B2B Prospecting And Company Enrichment

Search for people and organizations, then enrich selected people or companies with professional, company, funding, employee, and contact attributes. See [b2b-prospecting-and-company-enrichment.md](api-uses/b2b-prospecting-and-company-enrichment.md) for endpoint coverage, fields, use cases, source notes, and open questions.
### Web Search, Content Extraction, And Crawling

Search the web semantically or by keyword, fetch page contents, answer research questions with citations, scrape pages, and run bounded browser-rendered site crawls. See [web-search-content-and-crawling.md](api-uses/web-search-content-and-crawling.md) for endpoint coverage, fields, use cases, source notes, and open questions.
### Market News, Shopping, And Visual Search

Use Serper-backed Google News, Shopping, and Lens-style reverse image search for market monitoring, product comparison, and image source discovery. See [market-news-shopping-and-visual-search.md](api-uses/market-news-shopping-and-visual-search.md) for endpoint coverage, fields, use cases, source notes, and open questions.
### Social Discussion And Influencer Enrichment

Find Reddit discussions, retrieve full post/comment threads, and enrich creator or influencer identities from email or social handles. See [social-discussion-and-influencer-enrichment.md](api-uses/social-discussion-and-influencer-enrichment.md) for endpoint coverage, fields, use cases, source notes, and open questions.
### Person Identity, Contact, And Email Verification

Resolve people from partial identity signals, enrich profiles with contact and demographic attributes, verify emails, and find contact details from LinkedIn URLs, email addresses, phone numbers, names, or addresses. See [person-identity-contact-and-email-verification.md](api-uses/person-identity-contact-and-email-verification.md) for endpoint coverage, fields, use cases, source notes, and open questions.
### Property And Resident Lookup

Look up property ownership, resident, and address-linked property details from a structured address. See [property-and-resident-lookup.md](api-uses/property-and-resident-lookup.md) for endpoint coverage, fields, use cases, source notes, and open questions.

## Field And Data Themes

StableEnrich fields fall into seven recurring themes: identifiers such as domains, emails, URLs, social handles, place IDs, Minerva PIDs, organization IDs, and crawl tokens; location fields such as addresses, city/state/country, coordinates, and radius; person and company fields such as names, titles, seniority, departments, employee counts, funding, revenue, and work history; content fields such as markdown, snippets, reviews, comments, article titles, and citations; commerce fields such as prices, ratings, employee counts, funding, and browser seconds; timestamps such as review publish times, last-seen emails, funding dates, and job status fields; and workflow-control fields such as pagination, excludeFields, result limits, crawl depth, and field-selection arrays.
