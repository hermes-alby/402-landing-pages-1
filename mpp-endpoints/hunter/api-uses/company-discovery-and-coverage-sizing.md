# Hunter: Company Discovery And Coverage Sizing API Uses

## What This Endpoint Group Does

This group helps a user move from "who should I target?" to "is Hunter likely to have enough contacts for those targets?" `Discover Companies` finds matching companies from natural language or structured filters such as domain/name, location, industry, headcount, company type, keywords, technology, funding, and pagination. `Email Count` checks a known domain or company and returns total, personal, generic, department, and seniority counts without exposing the individual addresses.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/hunter/discover` | Find companies matching criteria. | `query`, `organization`, `similar_to`, `headquarters_location`, `industry`, `headcount`, `company_type`, `keywords`, `technology`, `limit`, `offset`; provider docs also include `year_founded` and `funding`. | Company `domain`, `organization`, `emails_count.personal`, `emails_count.generic`, `emails_count.total`, `meta.results`, `meta.filters`. |
| POST | `/hunter/email-count` | Count known email availability for a domain or company. | `domain` or `company`, optional `type`. | `total`, `personal_emails`, `generic_emails`, department counts, seniority counts, echoed params. |

## Field Notes

### Inputs

`Discover Companies` can start from a natural-language `query` or from explicit filters. The provider docs describe richer nested objects for `organization`, `headquarters_location`, `industry`, `keywords`, `technology`, `funding`, and `year_founded`, while the MPP OpenAPI simplifies several of these to strings and omits `funding` and `year_founded`. `Email Count` requires either `domain` or `company`; `domain` takes precedence and the provider requires company names to be at least 3 characters.

### Outputs

The discovery result is intentionally lightweight: domain, organization name, and `emails_count` by personal/generic/total. Email Count adds a deeper availability profile with department and seniority counts. Together, these fields show both account fit and contact coverage before retrieving specific people or addresses.

### Important Constraints Or Gaps

Discover returns up to 100 companies per response. Changing `limit`/`offset`, similar-company search, technology, funding, and year-founded filtering have Premium restrictions in the provider docs. The MPP wrapper charges `$0.008` for Discover and `$0.003` for Email Count, even though Hunter Data Platform help describes Discover as free for Data Platform users. No live discovery or email-count calls were made.

## Use Cases

### Build A Target Account List With Contact-Coverage Thresholds

A founder, recruiter, or salesperson can describe a market in `query`, such as companies in a region and industry, then use returned `domain`, `organization`, and `emails_count.total` to decide which accounts are worth researching further. A business can automate the same workflow for territory planning: use `headquarters_location`, `industry`, `headcount`, and `company_type` to build an account universe, then only send high-coverage domains to Domain Search when `emails_count.personal` is high enough to justify the higher contact-retrieval cost.

The useful decision is not just "which companies match?" but "which companies have reachable people in Hunter?" A low `emails_count.total` can suppress a domain before outbound work begins; a high personal count can prioritize SDR assignment or recruiting sourcing. The limitation is that counts do not guarantee specific decision-maker availability or deliverability, so deeper contact retrieval and verification are still needed.

### Segment Markets Before Buying Or Exporting Leads

A personal user evaluating a side project market can compare niches by running tightly scoped searches and reviewing `emails_count` density. A business team can compare segments by location, headcount, and industry, then estimate total reachable account volume before allocating budget.

The fields that matter are `meta.results`, `emails_count.total`, and counts from `Email Count` broken down by department and seniority. A RevOps workflow could rank "mid-market fintech in North America" against "SMB SaaS in EMEA" based on both company volume and sales/contact coverage. Premium filter constraints and MPP per-request cost matter when exploring many segments.

### Pre-Qualify Domains Submitted By Users Or Partners

When a user submits a company name or website in an onboarding form, an agent can call `Email Count` to see whether Hunter has enough contact coverage to support a warm introduction, procurement workflow, partner lookup, or sales handoff. A business can use the same signal to enrich inbound lead scoring without exposing any email addresses yet.

`total`, `personal_emails`, `generic_emails`, department counts, and seniority counts let the workflow decide whether to route a lead to sales, request a better domain, or skip automated outreach. This is less invasive than pulling all addresses immediately, but it still uses third-party contact metadata and should be handled under the user's privacy and compliance policy.

### Route Accounts To Specialized Teams

A sales organization can use `Discover Companies` to produce accounts and `Email Count` to infer where Hunter has likely departmental coverage. Domains with high executive or finance counts can route to enterprise account executives; high IT or operations counts can route to technical sales; high HR counts can route to recruiting or employer-platform offers.

The endpoint group enables this because `Email Count` returns named department and seniority buckets, not only a total. The output does not identify the actual person, so the routing step should be followed by Domain Search, Email Finder, or Enrichment only for accounts that pass fit and coverage rules.

### Track Coverage Changes For Strategic Accounts

A personal job seeker could periodically check whether a target employer has more public people data before attempting outreach. A business can monitor key account domains over time and trigger a review when `total`, `personal_emails`, or executive/department counts change materially.

This workflow uses repeated `Email Count` snapshots as a low-cost coverage metric. It should store the timestamp of each internal snapshot because Hunter's count response itself does not include a freshness timestamp. It also needs cost controls because the MPP wrapper charges per request.
