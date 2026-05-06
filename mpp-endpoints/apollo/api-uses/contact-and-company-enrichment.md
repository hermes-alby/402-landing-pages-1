# Apollo: Contact And Company Enrichment API Uses

## What This Endpoint Group Does

This group enriches known people and companies. The people endpoints accept identifiers such as email, name, LinkedIn URL, company name, domain, or Apollo person ID, and return richer person, contact, employment, location, and organization data. The organization endpoints accept domain, organization name, or Apollo organization ID for single enrichment, and up to 10 domains for bulk enrichment.

This is the highest-value part of the Apollo wrapper because it turns sparse records into records that can drive CRM cleanup, routing, scoring, personalization, and account research.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/apollo/people-enrichment` | Enrich one person. | `first_name`, `last_name`, `email`, `linkedin_url`, `organization_name`, `domain`, `id`, `reveal_personal_emails`, `reveal_phone_number` | `person.name`, `person.title`, `person.email`, `person.email_status`, `person.employment_history`, `person.organization`, `waterfall` |
| POST | `/apollo/bulk-people-enrichment` | Enrich up to 10 people. | `details[]`, `reveal_phone_number`, `reveal_personal_emails` | `matches`, `missing_records`, `unique_enriched_records`, `credits_consumed`, `waterfall` |
| POST | `/apollo/org-enrichment` | Enrich one organization. | `domain`, `organization_name`, `id` | `organization.name`, `organization.primary_domain`, `organization.industry`, `organization.estimated_num_employees`, `organization.annual_revenue`, `organization.total_funding`, `organization.technology_names`, location fields |
| POST | `/apollo/bulk-org-enrichment` | Enrich up to 10 organizations by domain. | `domains[]` | `organizations`, `missing_records`, `unique_enriched_records`, `total_requested_domains` |

## Field Notes

### Inputs

The most reliable person enrichment inputs are exact identifiers such as email, LinkedIn URL, Apollo person ID, or a name plus company domain. Bulk people enrichment uses `details[]`, with each object carrying those identifiers. Organization enrichment is best keyed by clean domains without `www.` or `@`; bulk organization enrichment requires `domains[]`.

The reveal flags matter commercially and operationally. `reveal_phone_number` and `reveal_personal_emails` can increase cost and expose more sensitive contact data, so workflows should apply them only after a record is qualified.

### Outputs

Person enrichment returns fields such as `person.id`, `name`, `title`, `email`, `email_status`, LinkedIn URL, employment history, city/state/country, department/seniority, and an embedded `organization` object. Organization enrichment returns company identity, website/domain, LinkedIn, phone fields, industry, estimated employees, revenue, funding, location, descriptions, keywords, and technology names.

Bulk responses add operational fields such as `total_requested_enrichments`, `total_requested_domains`, `unique_enriched_records`, `missing_records`, and native Apollo `credits_consumed`.

### Important Constraints Or Gaps

The MPP docs state bulk people and bulk organization enrichment are limited to 10 records per request. Native Apollo docs include additional fields such as waterfall flags and `webhook_url` that are not listed in the MPP request body. People enrichment has dynamic MPP pricing, especially when revealing phone numbers. Contact data must be used with privacy, opt-out, and lawful outreach controls.

## Use Cases

### Clean And Complete CRM Records

A sales operations team can enrich CRM leads or contacts that only have a name, company, email, or LinkedIn URL. The returned title, employment history, organization ID, email status, and company object can fill missing CRM fields and identify stale records whose job title or employer changed.

For an individual consultant or founder, this same workflow can turn a small spreadsheet of prospects into a usable contact list. The business value comes from reducing manual research and making downstream routing, scoring, and segmentation depend on structured fields instead of free-text notes.

### Route Leads By Company Fit

Organization enrichment can add `industry`, `estimated_num_employees`, `annual_revenue`, `total_funding`, headquarters location, and technology names. A business can use those fields to route high-fit accounts to sales, send small accounts to self-serve nurture, or reject records outside a territory.

The same fields help a personal user prioritize who to approach first when researching partnerships or clients. The important dependency is a clean domain or Apollo organization ID; fuzzy organization names can be less reliable than domain-based enrichment.

### Decide When Contact Reveal Is Worth The Cost

A user can run search first, then call people enrichment only for people with the right title, seniority, account fit, and `has_email` or `has_direct_phone` availability. When phone numbers or personal emails are needed, the reveal flags can be enabled only for the final subset.

This makes MPP's pay-per-request model more practical: enrichment and phone reveal are treated as higher-cost steps after qualification. The tradeoff is that the user must design a staged workflow and avoid blindly revealing contact details for every search result.

### Personalize Outreach With Role And Company Context

Person enrichment returns a person's title, headline, employment history, and current organization context. Organization enrichment adds company descriptions, industry, revenue/funding indicators, employee counts, and technologies. Together, these fields can help draft relevant outreach, prepare meeting notes, or customize a recruiting message.

For a business, this enables sales engagement systems to insert concrete context such as recent role, company size, tech stack, or funding stage. The limitation is that generated messages still need review, opt-out handling, and compliance checks; enrichment data should not be treated as consent to contact.

### Bulk Enrich Event Or Webinar Leads

After a webinar, conference, or form submission, a team can batch up to 10 person records per request using `details[]`. The returned `matches`, `missing_records`, and `unique_enriched_records` help separate matched attendees from records needing manual review.

This is valuable because event data often includes incomplete company or job-title information. Enrichment can identify seniority, employer, and account fit before syncing to CRM campaigns. The 10-record MPP bulk limit means larger lists need batching and cost controls.

### Improve Account-Based Marketing Segmentation

Bulk organization enrichment can take a target-account domain list and return firmographic and technology fields. Marketing teams can segment accounts by headcount, industry, location, funding, and technologies before choosing campaign messaging or advertising audiences.

Personal users can use the same data for market research, such as comparing a set of companies by size and tech stack. The response includes missing-record counts, which should be tracked so gaps do not silently bias analysis.
