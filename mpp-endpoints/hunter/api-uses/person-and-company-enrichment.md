# Hunter: Person And Company Enrichment API Uses

## What This Endpoint Group Does

This group turns known identifiers into richer profile data. Email Enrichment retrieves person attributes from an email or LinkedIn handle. Company Enrichment retrieves firmographic and technology data from a domain. Combined Enrichment returns both person and company data for an email in one call.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/hunter/email-enrichment` | Enrich a person from email or LinkedIn handle. | `email` or `linkedin_handle`; provider also supports `clearbit_format`. | Person `id`, `name`, `email`, `location`, `timeZone`, `geo`, `employment`, social handles, `emailProvider`, `indexedAt`, `activeAt`, `inactiveAt`. |
| POST | `/hunter/company-enrichment` | Enrich a company from a domain. | `domain`; provider also supports `clearbit_format`. | Company names, domain, aliases, site phones/emails, category, tags, description, founded year, location, geo, logo, social handles, email provider, company type, ticker, identifiers, metrics, technology, funding, parent domains. |
| POST | `/hunter/combined-enrichment` | Enrich both a person and their company from an email. | `email`; provider also supports `clearbit_format`. | `person` object and `company` object in the same response. |

## Field Notes

### Inputs

Email Enrichment requires `email` unless `linkedin_handle` is provided; LinkedIn handle takes precedence when both are supplied. Company Enrichment requires `domain`. Combined Enrichment requires `email`. Provider docs list `clearbit_format` for all enrichment endpoints, but the MPP OpenAPI omits it.

### Outputs

Person outputs include identity, location/time zone, employment role/seniority, social handles, provider, and freshness fields (`indexedAt`, `activeAt`, `inactiveAt`). Company outputs include sector/industry codes, tags, description, headquarters and coordinates, site contact info, tech stack, employee/traffic/revenue/funding metrics, social handles, identifiers, and parent-company fields. Actual coverage varies and many fields can be null.

### Important Constraints Or Gaps

The enrichment endpoints are upstream rate-limited to 15 requests/second and 500/minute. Provider docs return `404` when no person/company information is found. MPP pricing is `$0.013` for email or company enrichment and `$0.023` for combined enrichment. No live enrichment calls were performed.

## Use Cases

### Qualify Inbound Leads Before Routing

A business can enrich an inbound email or company domain before assigning a lead. `Combined Enrichment` can return the person's `employment.title`, role, seniority, location, and the company's `category`, `tags`, `metrics.employees`, `tech`, and `company_type` in one response.

These fields support routing decisions: send enterprise-fit accounts to sales, route small companies to self-serve nurture, assign by geography/time zone, or flag high-value industries. A personal user could use the same fields to prepare context before replying to an unfamiliar inbound email. The limitation is that enrichment fields can be null or stale, so high-impact decisions should tolerate missing data and use human review.

### Enrich CRM Records With Firmographics And Role Data

CRM records often contain only an email and domain. Email Enrichment can add person name, employment, social handles, and location, while Company Enrichment can add industry classification, headcount, tech stack, traffic rank, and parent-company context.

The business value is cleaner segmentation and less manual research. `company.category`, `tags`, `metrics.employees`, `techCategories`, and `foundedYear` support account scoring; `person.employment.role`, `seniority`, and `timeZone` support sales sequencing and ownership. The workflow should store source and timestamp metadata because enrichment freshness is not guaranteed beyond fields like `indexedAt` and `activeAt`.

### Personal Research Before A High-Stakes Conversation

A job seeker, founder, consultant, or investor can enrich a company domain or email before a meeting. Company fields such as `description`, `category`, `tags`, `tech`, `metrics.employees`, and `fundingRounds` provide a quick briefing; person fields like title, role, location, and social handles help tailor the conversation.

The endpoint group is valuable because it condenses company and person context into a structured response. It should be treated as a starting point for research rather than a source of truth, especially when metrics are null or old and when personal data is involved.

### Match And Deduplicate Accounts Across Systems

A data team can use `domain`, `domainAliases`, `legalName`, `identifiers.usEIN`, `ticker`, `parent.domain`, and `ultimateParent.domain` to reconcile duplicate company records. Person fields such as `email`, normalized `name`, and `employment.domain` can help tie contacts to the right account.

This is useful for CRM hygiene, partner databases, and procurement/vendor lists. The endpoint can reveal that two domains belong to the same parent or that a contact's employment domain does not match the account currently assigned. Because many identifiers can be null, the matching logic should be probabilistic and preserve uncertainty.

### Personalize Outreach With Relevant Context

Enrichment fields can make outreach more relevant without requiring a human to browse many pages. A business can tailor messaging by `industry`, `tags`, `tech`, `trafficRank`, company size, and the contact's role or seniority. A personal user can mention a relevant company category or role context when writing a concise, appropriate message.

The automation should avoid over-personalization from sensitive or weak fields. Strong uses include routing and relevance checks; weak uses include pretending to know someone based only on stale public data. The compliance caveat is that enrichment is still personal/business data processing and should be governed by consent, legitimate interest, opt-out, and retention policies.

### Score Product-Led Or Developer Leads By Technology Fit

For developer tools and B2B SaaS, Company Enrichment's `tech` and `techCategories` fields can indicate whether a company uses relevant infrastructure or marketing tools. Combined with `metrics.employees`, `category`, and geography, this can drive product-led sales scoring.

The resulting action might be to route a lead to a specialized team, trigger a targeted onboarding message, or suppress a campaign when the technology fit is poor. The key gap is that technology data may be incomplete and `indexedAt` should be checked before assuming current usage.
