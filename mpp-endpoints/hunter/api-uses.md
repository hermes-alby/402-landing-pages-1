# Hunter API Uses

## Service Summary

Hunter is a B2B email discovery, verification, company discovery, and enrichment provider. The MPP service wraps eight Hunter API functions behind pay-per-request endpoints for finding target companies, sizing available email coverage, retrieving domain contacts, finding a specific person's likely email, verifying deliverability, and enriching person/company records.

The strongest API-use opportunities are sales/recruiting prospecting, inbound lead qualification, CRM enrichment, data-quality checks, and account segmentation. The main caveats are privacy/compliance obligations, per-request cost, stale or null enrichment fields, accept-all/unknown verification ambiguity, and wrapper schema gaps where the MPP OpenAPI is less complete than Hunter's provider docs.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Company Discovery And Coverage Sizing | 2 | Find matching companies and estimate whether Hunter has enough address coverage before retrieving contacts. | [company-discovery-and-coverage-sizing.md](api-uses/company-discovery-and-coverage-sizing.md) |
| Domain Contact Search | 1 | Retrieve personal and generic addresses for a domain with confidence, source, role, and verification context. | [domain-contact-search.md](api-uses/domain-contact-search.md) |
| Person Email Finding | 1 | Find one likely email for a known person from name plus company/domain or LinkedIn handle. | [person-email-finding.md](api-uses/person-email-finding.md) |
| Email Deliverability Verification | 1 | Classify deliverability and risk of a known email address before using it. | [email-deliverability-verification.md](api-uses/email-deliverability-verification.md) |
| Person And Company Enrichment | 3 | Enrich people and companies with role, location, firmographic, technology, social, and freshness fields. | [person-and-company-enrichment.md](api-uses/person-and-company-enrichment.md) |

## Highest-Value Uses

- Pre-screen target account lists by company fit and Hunter contact coverage before paying for contact retrieval.
- Build role-specific outreach queues with email confidence, source evidence, department, seniority, and verification status.
- Fill missing emails for known decision-makers or candidates while avoiding blind address guessing.
- Verify imported or found emails before campaign enrollment to reduce bounces and protect sender reputation.
- Enrich inbound leads or CRM records with person role, company industry, headcount, technology, location, parent-company, and freshness data.

## Personal Use Opportunities

A personal user could use Hunter MPP calls sparingly to verify an important address before sending, research a company before a meeting or job application, find an official generic inbox for support/security/press/partnership contact, or locate a likely contact email for a specific person when the outreach is legitimate and targeted.

The personal value is convenience: no Hunter account, key management, or prepaid credit block. The caution is that contact and enrichment data still involves personal data, so the user should keep use narrow, respectful, and compliant.

## Business Use Opportunities

Businesses can plug these endpoints into RevOps, recruiting, partnership, marketing, and data pipelines. A practical pipeline could run Discover, use Email Count as a coverage gate, call Domain Search or Email Finder only for qualified accounts, verify risky emails, and enrich the final records before routing them to CRM or human review.

The fields support concrete automation: account scoring from `industry`, `headcount`, `metrics.employees`, `tech`, and `emails_count`; contact prioritization from `department`, `seniority`, `position`, `confidence`, and `verification.status`; and data-quality controls from `status`, `smtp_check`, `accept_all`, `sources[].last_seen_on`, `indexedAt`, and `activeAt`.

## Endpoint Group Summaries

### Company Discovery And Coverage Sizing

Use `Discover Companies` and `Email Count` to build or evaluate account lists before deeper enrichment. This group is best for territory planning, market sizing, lead scoring, and deciding whether a domain has enough personal or department-specific coverage to justify more expensive lookup work. Full details: [company-discovery-and-coverage-sizing.md](api-uses/company-discovery-and-coverage-sizing.md).

### Domain Contact Search

Use Domain Search when the account is already known and the workflow needs multiple potential contacts or role-based inboxes. Its most useful fields are email address, type, confidence, source evidence, role fields, department/seniority, and verification status. Full details: [domain-contact-search.md](api-uses/domain-contact-search.md).

### Person Email Finding

Use Email Finder when the target person is known but their address is missing. It is best for filling sparse CRM/recruiting/referral records and replacing fragile pattern guessing with a scored, sourced result. Full details: [person-email-finding.md](api-uses/person-email-finding.md).

### Email Deliverability Verification

Use Email Verifier as a data-quality and sender-reputation gate. It distinguishes valid, invalid, accept-all, webmail, disposable, and unknown outcomes and adds SMTP/MX/source diagnostics that can drive suppress, review, or accept decisions. Full details: [email-deliverability-verification.md](api-uses/email-deliverability-verification.md).

### Person And Company Enrichment

Use enrichment endpoints when an email, LinkedIn handle, or domain is known and the workflow needs context for scoring, routing, personalization, deduplication, or research. Combined Enrichment is the highest-value single call when both person and company context are needed from an email. Full details: [person-and-company-enrichment.md](api-uses/person-and-company-enrichment.md).

## Field And Data Themes

Hunter's most valuable data themes are contact identity (`email`, names, LinkedIn/social handles), role fit (`position`, `employment.role`, `seniority`, `department`), deliverability quality (`status`, `score`, SMTP/MX flags, `accept_all`, `sources`), company fit (`domain`, `industry`, `tags`, `headcount`, `metrics.employees`, `company_type`), technical/account fit (`tech`, `techCategories`), and freshness/provenance (`sources[].extracted_on`, `sources[].last_seen_on`, `indexedAt`, `activeAt`, `inactiveAt`).

The API is useful because it combines decision fields with evidence fields. Workflows should use those evidence fields rather than treating every returned address or enrichment attribute as equally reliable.
