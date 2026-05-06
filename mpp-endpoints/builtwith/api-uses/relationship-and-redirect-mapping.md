# BuiltWith: Relationship And Redirect Mapping API Uses

## What This Endpoint Group Does

This group maps how domains are connected beyond a single site's current tech stack. `Relationships` finds shared identifiers such as tracking IDs, analytics IDs, ad accounts, or other BuiltWith relationship keys. `Redirects` returns inbound and outbound redirect history with first/last detected dates.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/builtwith/relationships` | Discover domains related by shared identifiers | `LOOKUP`, `SKIP`, `AMOUNT` | Relationship domain, identifier `Value`, identifier `Type`, first/last dates, matched domains, `Overlap`, pagination fields |
| POST | `/builtwith/redirects` | Fetch inbound and outbound redirect history | `LOOKUP` | `Inbound[]` and `Outbound[]` domains with `FirstDetected` and `LastDetected` |

## Field Notes

### Inputs

Both endpoints use `LOOKUP` as the root domain. `Relationships` adds `SKIP` and `AMOUNT` so the caller can page through large relationship graphs; the sample response shows `results`, `max_per_page`, `next_skip`, and `more_results`.

### Outputs

`Relationships` returns identifier groups with `Value`, `Type`, `First`, `Last`, and `Matches[]`. Each match includes a related `Domain`, first/last seen timestamps, and an `Overlap` boolean. `Redirects` separates `Inbound` and `Outbound` domains, each with first and last detected dates.

### Important Constraints Or Gaps

The public sample shows identifier type codes such as `NR`, `GP`, `OP`, `GTM`, and `UA`, but the local docs do not define every code. Redirect records do not include HTTP status code, redirect target URL path, or redirect reason in the sample.

## Use Cases

### Brand And Subsidiary Graph Discovery

A researcher can enter a known company domain and inspect related domains through shared identifiers and redirect history. `Identifiers[].Matches[].Domain`, `Overlap`, `First`, and `Last` can reveal franchise sites, microsites, white-label properties, regional domains, or old brand domains that still point into the same web footprint.

For business development or account planning, this can expand a single CRM account into a domain graph. Sales ops can attach related domains to an account, then call profile/list endpoints only for the most relevant domains. The key value is finding relationships that company-name matching alone may miss.

### Acquisition, Rebrand, And Domain Migration Research

Redirect data can show whether a domain was folded into another brand, migrated across country-code domains, or consolidated after an acquisition. `Inbound` and `Outbound` records with `FirstDetected` and `LastDetected` provide a timeline for when redirects appeared and whether they persisted.

For a business analyst, these fields can support competitive history research. If many domains redirect to one brand at similar dates, that can suggest consolidation, campaign launches, or retired product lines. The limitation is that redirect records are domain-level in the sample and do not expose full URL paths.

### Risk Review Of Shared Tracking Infrastructure

A security or risk analyst can use `Relationships` to see whether a domain shares analytics, tag-manager, or other identifiers with domains that appear unrelated. The `Type`, `Value`, `Matches`, and `Overlap` fields provide evidence of shared operatorship or shared vendor implementation.

For a business, this can help triage suspicious merchant or affiliate domains. If a new merchant shares identifiers with domains already flagged internally, it can be escalated. The endpoint is not a definitive ownership proof, so results should be reviewed with context.

### Partner And Channel Mapping

Companies with partner ecosystems can use relationship and redirect data to understand how partner domains, booking engines, storefronts, and campaign microsites connect back to a primary domain. `Overlap` and first/last dates help separate current ties from historical ones.

For marketing operations, this can inform cleanup: old redirects, overlapping tracking IDs, or unmanaged microsites can be added to a remediation list. The endpoint group is especially valuable when paired with `Domain Lookup` to inspect the technologies on related domains.
