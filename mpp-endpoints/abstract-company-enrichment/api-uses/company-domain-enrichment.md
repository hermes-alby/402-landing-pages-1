# Company Enrichment: Company Domain Enrichment API Uses

## What This Endpoint Group Does

This endpoint group enriches a company domain into a structured company profile. The MPP wrapper accepts `domain` and optional `fields`, then maps the request to Abstract's company-enrichment data. The returned fields can identify the company, describe what it does, locate its headquarters, estimate size and revenue, classify its industry, show whether it is public or private, surface contact channels, expose public-market identifiers, and list social/profile or technology tags.

The value is immediate company context from a minimal input. A workflow that only knows `example.com` can add `company_name`, `industry`, `employee_range`, `revenue_range`, `country`, `technologies`, `linkedin_url`, `ticker`, and other fields without building its own company-data pipeline. The optional `fields` parameter is useful when an agent needs only a subset, such as `company_name,industry,employee_range,country`, and wants to reduce response handling.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/abstract-company-enrichment/lookup` | Enrich one company domain through the MPP wrapper. | JSON body `domain` required; `fields` optional comma-separated list of top-level response fields. | Company identity, description, logo, founding year, headquarters address/coordinates, SIC/NAICS, industry, employee and revenue estimates, contact arrays, public/private status, ticker/exchange, ranking, tags, technologies, and social/profile URLs. |

## Field Notes

### Inputs

`domain` is the core lookup key. Provider docs describe it as the domain of the company to retrieve data from. The example uses `airbnb.com`. A consumer should normalize obvious URL input into a host before calling the wrapper, because the docs describe a domain rather than a full URL.

`fields` is optional and accepts a comma-separated list of top-level response keys. It can reduce the returned JSON to only the fields needed by a workflow, such as `domain,company_name,industry,employee_range,revenue_range,country`. The docs do not define nested selection, invalid field behavior, or whether `fields` changes cost.

### Outputs

Identity and descriptive fields include `domain`, `company_name`, `description`, `logo`, `year_founded`, `type`, `ticker`, `exchange`, `global_ranking`, and social/profile URLs such as `linkedin_url`, `facebook_url`, `twitter_url`, `instagram_url`, and `crunchbase_url`.

Segmentation fields include `industry`, `sic_code`, `naics_code`, `tags`, `technologies`, `employee_count`, `employee_range`, `annual_revenue`, and `revenue_range`. These are the most useful fields for scoring, routing, market maps, and account-tier decisions.

Location fields include `street_address`, `city`, `state`, `country`, `country_iso_code`, `postal_code`, `latitude`, and `longitude`. Contact fields include `phone_numbers` and `email_addresses`.

### Important Constraints Or Gaps

The endpoint is payment-gated through MPP. The wrapper docs estimate `$0.006` per lookup, while the MPP feed/OpenAPI represent payment as `amount: "6000"` with 6 decimals for a Tempo currency asset. This research did not call the paid endpoint.

The provider docs state that credits are counted per request, not per successful response, and even invalid domains count when using direct Abstract plans. Direct Abstract usage requires an API key. The MPP wrapper is useful because it avoids direct provider account setup, but clients should still treat each paid lookup as spend.

The provider response schema is documentation-derived rather than OpenAPI-derived. Requiredness, nullability, missing-value representation, and stable enum values are not documented. `employee_count` is documented as a string but examples show a number, so downstream code should preserve raw values and coerce only in a controlled normalization layer.

Abstract's product page says company data is updated weekly and references global coverage in 175+ or 180+ countries. The response does not include `updated_at`, per-field freshness, confidence scores, or source provenance, so important business decisions should treat enriched data as a starting point for review rather than sole evidence.

Contact and social/profile fields may carry privacy, outreach, and terms-of-use obligations. The docs reviewed here do not define redistribution rights, opt-out behavior, or permitted use for enriched phone and email data.

## Use Cases

### Lead Scoring And Sales Routing

A sales team can enrich inbound signup domains before assigning leads. `employee_range`, `annual_revenue`, `revenue_range`, `industry`, `country`, `type`, `ticker`, and `technologies` support rules such as routing enterprise-sized public companies to senior account executives, sending startups to a pooled queue, or prioritizing target industries for faster outreach.

For an individual consultant or solo founder, the same fields help decide whether a new inquiry is likely to be a small business, an enterprise, a public company, or a fit for a specific service package. The limitations are important: size and revenue are approximate, freshness is not returned per record, and outreach teams should verify contact details and honor consent/compliance requirements before contacting `phone_numbers` or `email_addresses`.

### Product-Led Signup Personalization

A SaaS app can enrich a new workspace's domain during onboarding and prefill organization fields such as `company_name`, `logo`, `industry`, `country`, and `employee_range`. That can personalize welcome screens, choose default templates, suggest integrations based on `technologies`, or decide which onboarding checklist to show.

Personal users can use the same enrichment pattern in a personal CRM or meeting-prep agent: entering a domain returns a compact organization card with logo, description, headquarters, and social links. The workflow should allow human correction because the API does not document confidence scores or missing-value behavior, and stale or ambiguous domains may map poorly.

### CRM And Account Data Cleanup

RevOps and data teams often have duplicated or incomplete account records keyed by website, email domain, or manually entered company names. This endpoint can standardize records around `domain`, `company_name`, `linkedin_url`, location fields, industry codes, and size/revenue ranges, then flag conflicts for review.

The endpoint is especially useful where only a website domain is trusted. A cleanup process can request selected fields with `fields` to avoid carrying unnecessary contact or social data into regulated systems. The main caveat is that the docs do not define deterministic matching rules, so records should keep the raw response and source timestamp of the enrichment run.

### Market Mapping And Territory Planning

A business analyst can enrich a list of company domains to build market maps by `industry`, `tags`, `country`, `state`, `employee_range`, `revenue_range`, `type`, and `technologies`. Sales leaders can use that to size territories, identify concentrations of target accounts, or compare public versus private company presence in a segment.

For personal career or investing research, a user can enrich a shortlist of companies to understand where they are headquartered, whether they are public, which exchange/ticker applies, and how large they appear. Because the API does not return source provenance or financial-statement detail, investment or hiring decisions should use the output as a directory layer and verify material facts in primary sources.

### Vendor, Customer, And Partner Triage

Procurement, finance, or partnerships teams can use the enriched company profile as a first-pass review before deeper diligence. `company_name`, `description`, `industry`, headquarters fields, `year_founded`, `type`, `ticker`, `exchange`, `annual_revenue`, `employee_range`, and `crunchbase_url` help determine whether the company is a recognizable vendor, public entity, startup, or small private business.

An individual can use the same workflow before buying from an unfamiliar B2B vendor or joining a partner call. The endpoint does not provide sanctions, legal, security, ownership, or risk scores, so it should not be treated as a compliance-screening API. It is a context builder that can decide whether a manual review or another data source is needed.

### Website Technology And Integration Targeting

The `technologies` array can help go-to-market, partner, and product teams identify which accounts use relevant tools such as analytics, CRM, monitoring, ecommerce, or marketing platforms. A team could enrich domains from signups or target-account lists, then trigger integration-specific messaging or route accounts to partner campaigns.

For personal automation, a builder evaluating a company can see which public website technologies are associated with the domain and use that to choose examples or integration notes before a meeting. Technology tags can be incomplete or inferred, and the docs do not define detection freshness or coverage, so automation should avoid making hard claims without verification.

### Public Company And Investor Context

When `type`, `ticker`, and `exchange` are present, the response can connect a domain to public-market identifiers. A finance workflow can use that to decide whether to fetch SEC filings, market data, investor relations material, or internal risk rules for publicly traded companies.

A personal research assistant can use these fields to distinguish a public company from a private one before summarizing a job opportunity, product vendor, or competitor. This endpoint does not return prices, filings, fundamentals, or legal identifiers, so public-market fields should be treated as a handoff to primary financial data sources rather than complete financial data.

### Contact Discovery For Support And Outreach Workflows

`phone_numbers`, `email_addresses`, and social URLs can help a support, sales, or operations workflow find a general company contact or profile URL after a domain is known. A business might use this to attach official contact channels to an account record, populate internal research notes, or send a human to the right LinkedIn or Crunchbase profile.

The fields are not a license to send unsolicited outreach. Teams should apply consent, jurisdiction, suppression-list, and acceptable-use checks before using contact data. The docs do not explain whether contact fields are role-based, verified, current, or opted in.
