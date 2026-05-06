# Apollo API Uses

## Service Summary

Apollo provides B2B people and company search, enrichment, and sales intelligence. The MPP wrapper exposes eight Apollo-style endpoints for finding prospects and accounts, enriching people and companies, and retrieving account signals such as job postings and news.

The highest-value use is staged go-to-market research: search first to identify likely people or companies, enrich only the qualified records, then use job and news signals to decide timing and outreach angle.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Prospect And Account Search | 2 | Find people and companies by role, seniority, domain, company name, location, size, and keywords before paying for richer data. | [prospect-and-account-search.md](api-uses/prospect-and-account-search.md) |
| Contact And Company Enrichment | 4 | Convert sparse person or company identifiers into contact, employment, firmographic, revenue, funding, technology, and location data. | [contact-and-company-enrichment.md](api-uses/contact-and-company-enrichment.md) |
| Account Signals And Triggers | 2 | Monitor companies for job-posting and news signals that affect prioritization and outreach timing. | [account-signals-and-triggers.md](api-uses/account-signals-and-triggers.md) |

## Highest-Value Uses

The most valuable workflow is a cost-controlled lead-generation pipeline. Use organization search to find target accounts, people search to identify relevant roles, people enrichment to reveal contact and employment details only for qualified records, and organization enrichment to score accounts by industry, size, revenue, funding, location, and technology stack.

The second strongest workflow is account monitoring. Once organization IDs are known, job postings and news search can surface fresh hiring and market events. Those signals can trigger CRM tasks, research briefs, or outreach only when there is a plausible business reason to engage.

## Personal Use Opportunities

Independent consultants, founders, recruiters, job seekers, and investors can use the API to research companies and people without buying a large Apollo plan. Practical personal uses include building a small target-client list, preparing for interviews or sales meetings, mapping decision makers at a company, and monitoring companies for hiring or news.

The personal-use caveat is that Apollo's data is business-contact and company intelligence. Contact reveal and outreach workflows should be selective and compliant with privacy, opt-out, and anti-spam rules.

## Business Use Opportunities

Businesses can use Apollo MPP endpoints for CRM enrichment, lead routing, account scoring, territory planning, ABM segmentation, event-lead cleanup, sales-trigger monitoring, and research automation. The wrapper is especially useful for occasional or agentic calls where buying seats, annual credits, or account-level API access is unnecessary.

Operationally, businesses should treat search as the low-cost discovery layer and enrichment as the higher-value, higher-cost layer. Bulk endpoints are limited to 10 records per request in the MPP docs, so production pipelines need batching, deduplication, and missing-record tracking.

## Endpoint Group Summaries

### Prospect And Account Search

People and organization search help narrow a broad market into concrete people and company IDs. People search can identify likely decision makers by title, seniority, location, and organization, while organization search can find accounts by name, size, location, industry, and keywords. Full details: [api-uses/prospect-and-account-search.md](api-uses/prospect-and-account-search.md).

### Contact And Company Enrichment

Enrichment turns known identifiers into useful structured data. People enrichment adds title, email status, employment history, location, and company context. Organization enrichment adds firmographics, revenue, funding, location, phone, descriptions, and technologies. Full details: [api-uses/contact-and-company-enrichment.md](api-uses/contact-and-company-enrichment.md).

### Account Signals And Triggers

Job postings and news search add time-sensitive context for known organization IDs. These endpoints help decide when an account deserves attention and which business event or hiring signal should shape the next action. Full details: [api-uses/account-signals-and-triggers.md](api-uses/account-signals-and-triggers.md).

## Field And Data Themes

Key identifiers are Apollo person IDs, Apollo organization IDs, company domains, LinkedIn URLs, and emails. Key person fields include name, title, seniority, department, email status, employment history, location, and organization. Key company fields include name, domain, website, industry, employee count, revenue, funding, technologies, headquarters location, descriptions, and phone fields.

The signal endpoints add `posted_at`, `last_seen_at`, `published_at`, job title/location, article title/snippet/URL, and news event categories. These timestamp and content fields are what make automation possible.
