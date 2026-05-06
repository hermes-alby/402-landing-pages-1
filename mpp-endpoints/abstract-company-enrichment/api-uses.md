# Company Enrichment API Uses

## Service Summary

Company Enrichment is an MPP wrapper around Abstract API's domain-based company enrichment service. It accepts a company domain and returns a structured profile with company identity, description, logo, founding year, headquarters location, industry codes, employee and revenue estimates, contact arrays, public-market identifiers, social/profile URLs, and technology tags.

The main opportunity is pay-per-request enrichment without direct Abstract account setup, API keys, plan credits, or monthly quotas. It is most useful when an agent or workflow needs occasional company context from a domain and can justify a small paid lookup.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Company Domain Enrichment | 1 | Convert a domain into firmographic, location, contact, public-company, social/profile, and technology fields for routing, research, personalization, and data cleanup. | [`api-uses/company-domain-enrichment.md`](api-uses/company-domain-enrichment.md) |

## Highest-Value Uses

The strongest use is lead and account enrichment. A signup, inbound lead, vendor domain, or target-account list can be expanded into `company_name`, `industry`, `employee_range`, `revenue_range`, `country`, `type`, `ticker`, `exchange`, and `technologies`, which supports routing, scoring, segmentation, and manual review.

The second strongest use is company-context automation. Personal assistants, CRM cleanup jobs, onboarding systems, and research workflows can use one domain to build an organization card, prefill records, choose integration-specific messaging, or decide which follow-up data source is needed.

## Personal Use Opportunities

- Prepare for a meeting, interview, vendor call, or sales conversation by enriching the other company's domain into a concise profile.
- Build a personal CRM that turns domains into organization cards with logo, description, headquarters, industry, size, social links, and public/private status.
- Compare job opportunities or vendors by company size, revenue range, industry, country, and public-market identifiers, while verifying material claims in primary sources.

## Business Use Opportunities

- Score and route inbound leads by industry, employee range, revenue range, geography, public/private status, and technology tags.
- Prefill onboarding and CRM account fields from a domain, then queue uncertain or conflicting records for review.
- Build territory plans and market maps from lists of domains using industry, country, employee range, revenue range, tags, and technologies.
- Triage vendors, customers, and partners before deeper compliance, procurement, or finance review.
- Trigger integration-specific campaigns or onboarding flows based on detected website technologies.
- Use ticker/exchange fields as a handoff into public-company research systems.

## Endpoint Group Summaries

### Company Domain Enrichment

This group covers `POST /abstract-company-enrichment/lookup`. The request body requires `domain` and optionally accepts `fields` to select top-level response fields. It is the whole assigned API surface: one paid lookup that returns company identity, firmographic, location, contact, market, social/profile, and technology attributes.

Full details: [`api-uses/company-domain-enrichment.md`](api-uses/company-domain-enrichment.md)

## Field And Data Themes

- Lookup input: `domain`, plus optional comma-separated `fields`.
- Company identity: `company_name`, `description`, `logo`, `year_founded`, `domain`.
- Segmentation: `industry`, `sic_code`, `naics_code`, `tags`, `employee_count`, `employee_range`, `annual_revenue`, `revenue_range`.
- Location: `street_address`, `city`, `state`, `country`, `country_iso_code`, `postal_code`, `latitude`, `longitude`.
- Contact and profiles: `phone_numbers`, `email_addresses`, `linkedin_url`, `facebook_url`, `twitter_url`, `instagram_url`, `crunchbase_url`.
- Public-company context: `type`, `ticker`, `exchange`, `global_ranking`.
- Website stack: `technologies`.
