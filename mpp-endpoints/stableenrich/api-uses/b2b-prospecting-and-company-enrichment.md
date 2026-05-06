# StableEnrich: B2B Prospecting And Company Enrichment API Uses

## What This Endpoint Group Does

Search for people and organizations, then enrich selected people or companies with professional, company, funding, employee, and contact attributes.

The four Apollo endpoints form a search-then-enrich funnel for B2B prospecting, account selection, and contact routing.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/apollo/people-search` | Apollo People Search - Find prospects by filters ($0.02) | q_keywords, person_titles, person_not_titles, person_seniorities, person_locations, q_organization_domains, organization_locations, organization_ids | people, people.id, people.first_name, people.last_name, people.name, people.linkedin_url, people.title, people.email |
| POST | `/api/apollo/people-enrich` | Apollo People Enrichment - Enrich single person by email/name/domain ($0.0495) | id, first_name, last_name, name, email, domain, organization_name, linkedin_url | person, person.id, person.first_name, person.last_name, person.name, person.linkedin_url, person.title, person.email |
| POST | `/api/apollo/org-search` | Apollo Organization Search - Find companies by filters ($0.02) | q_keywords, organization_locations, organization_num_employees_ranges, organization_industry_tag_ids, organization_ids, q_organization_domains, excludeFields, page | organizations, organizations.id, organizations.name, organizations.domain, organizations.website_url, organizations.linkedin_url, organizations.twitter_url, organizations.facebook_url |
| POST | `/api/apollo/org-enrich` | Apollo Organization Enrichment - Enrich single company by domain ($0.0495) | domain, excludeFields | organization, organization.id, organization.name, organization.domain, organization.website_url, organization.linkedin_url, organization.twitter_url, organization.facebook_url |

## Field Notes

### Inputs

- `q_keywords`
- `person_titles`
- `person_seniorities`
- `person_locations`
- `q_organization_domains`
- `organization_ids`
- `organization_locations`
- `organization_num_employees_ranges`
- `domain`
- `email`
- `first_name`
- `last_name`
- `id`
- `page`
- `per_page`
- `excludeFields`

### Outputs

- `people`
- `organizations`
- `organization`
- `pagination`
- `linkedin_url`
- `title`
- `email`
- `email_status`
- `phone_numbers`
- `departments`
- `functions`
- `industry`
- `estimated_num_employees`
- `annual_revenue`
- `funding fields`
- `technologies`
- `employment_history`

### Important Constraints Or Gaps

- People search names may be obfuscated until people-enrich is called, per llms.txt.
- No provider freshness or deliverability guarantee is published for enriched contact data.
- Endpoints in this group cost /api/apollo/people-search: $0.02; /api/apollo/people-enrich: $0.0495; /api/apollo/org-search: $0.02; /api/apollo/org-enrich: $0.0495.

## Use Cases

### Account-Based Prospect List Building

A salesperson can search organizations by keyword, location, employee range, industry tags, or domain, verify exact organization IDs, and then use those IDs in people search. The resulting person titles, seniority, departments, functions, LinkedIn URLs, and company attributes support ranked account and contact lists.

For a business, this turns vague target criteria into a structured lead queue with pagination, employee counts, revenue and funding signals, technologies, and current roles. The docs warn that incorrect Apollo organization IDs can waste requests or return wrong employees, so org-search verification is part of the workflow.

### Lead Routing And Qualification

A founder or operator can enrich inbound email domains or company domains to see industry, size, location, funding stage, public-market fields, technologies, and descriptions before deciding whether to reply personally, route to sales, or send a low-touch nurture sequence.

Revenue teams can combine people-enrich and org-enrich to route by seniority, department, geography, company size, and revenue/funding bands. Contact data should still be validated and used under applicable outreach and privacy rules.

### Hiring And Expert Discovery

A person researching experts can search for titles, seniorities, locations, domains, and keywords, then enrich selected records to understand work history and current company context.

Recruiting or expert-network teams can use the same fields for sourcing, but should treat Apollo people search as a discovery step: llms.txt says returned names may be obfuscated until people-enrich is used, and the provider does not publish a freshness SLA for employment history.
