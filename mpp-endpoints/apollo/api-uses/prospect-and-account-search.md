# Apollo: Prospect And Account Search API Uses

## What This Endpoint Group Does

This group finds people and companies in Apollo's B2B database before a user spends more on enrichment. People search supports filters such as keywords, titles, personal location, company domain, organization IDs, seniority, page, and per-page count. Organization search supports company keywords, name, industry tags, headquarters location, keyword tags, employee-count ranges, page, and per-page count.

The main value is narrowing a broad market into a workable list of person IDs and organization IDs. Those IDs can then feed people enrichment, company enrichment, job postings, or news search.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/apollo/people-search` | Find people by title, seniority, company, location, and keywords. | `person_titles`, `person_seniorities`, `person_locations`, `q_organization_domains`, `organization_ids`, `q_keywords`, `page`, `per_page` | `people[].id`, `people[].title`, `people[].organization`, `people[].has_email`, `people[].has_direct_phone`, `total_entries` |
| POST | `/apollo/org-search` | Find companies by name, location, size, industry, and keywords. | `q_organization_name`, `q_keywords`, `organization_locations`, `organization_num_employees_ranges`, `organization_industry_tag_ids`, `q_organization_keyword_tags`, `page`, `per_page` | `organizations[].id`, `organizations[].name`, `organizations[].website_url`, `organizations[].primary_domain`, `pagination` |

## Field Notes

### Inputs

The strongest search inputs are concrete filters: job titles and seniorities for people, employee ranges and locations for accounts, and domains or organization IDs when the user already has a target-account list. Apollo's native docs include more search filters than the MPP wrapper lists, including technology, revenue, funding, and job-posting filters; those are marked as a wrapper gap in the inventory.

### Outputs

People search returns profile and employer indicators, but Apollo's docs state it does not return email addresses or phone numbers. The useful outputs are IDs, titles, employer context, and availability flags such as `has_email` and `has_direct_phone`. Organization search returns company IDs, names, websites, primary domains, LinkedIn URLs, phones when available, and pagination.

### Important Constraints Or Gaps

Apollo's native search docs state a 50,000-record display limit, described as 100 records per page up to 500 pages. Searches should be filtered tightly and batched. People search requires enrichment for contact details. The MPP wrapper's accepted filter set may be narrower than the native Apollo OpenAPI.

## Use Cases

### Build A Focused Target-Account List

A founder, consultant, or sales team can use organization search to find companies in a specific location and size range, then pull `organizations[].id`, `name`, `website_url`, and `primary_domain` into a target-account list. The employee-range and location filters make the list specific enough to avoid paying to enrich irrelevant companies.

For a business, this supports territory planning, account scoring, and CRM import review. The organization IDs become stable keys for later job-posting, news, and organization-enrichment calls. The main limitation is that high-quality segmentation by revenue, funding, and technology appears in Apollo's native docs but is not listed in the MPP request body.

### Find Decision Makers Inside Known Accounts

After an account list exists, a user can run people search with `organization_ids`, `person_titles`, and `person_seniorities` to identify likely decision makers. A personal user might use this for careful networking research; a sales team might use it to map buying committees across target accounts.

The returned `people[].id`, `title`, `organization`, `has_email`, and `has_direct_phone` fields help decide which people are worth enriching next. Since people search omits contact details, it acts as a cost-control step before using phone or email reveal options.

### Segment Outreach By Role And Geography

A team selling into regional markets can combine `person_locations`, `person_titles`, and `person_seniorities` to find people in a region and role category. For example, a recruiter could search for directors of engineering in a geography, while a vendor could search for finance executives in a territory.

The output helps route records by region and role before enrichment. The geographic distinction matters: Apollo's native docs distinguish personal location from company headquarters location, so teams should choose filters based on whether they care where the person lives or where the employer is headquartered.

### Pre-Qualify Enrichment Spend

The search endpoints can be used as a low-cost qualification layer. People search exposes whether Apollo has email or direct phone data, and organization search exposes company identity and domain fields. A user can avoid enrichment calls for records that do not match role, account, or data-availability criteria.

For a business, this can reduce wasted enrichment costs and keep CRM hygiene workflows more selective. The limitation is that `has_email` and `has_direct_phone` are availability signals, not the actual contact data or deliverability guarantees.

### Discover Adjacent Accounts From Keywords

Users can search `q_keywords` and `q_organization_keyword_tags` to discover companies associated with a market, category, or business problem. This is useful for competitive mapping, market sizing, and finding non-obvious prospects.

The output's company names, websites, primary domains, and organization IDs can be reviewed, deduplicated, and enriched. The workflow is strongest when followed by manual or automated quality checks, because broad keyword searches can include companies that match text but are not a true fit.
