# BuiltWith: Market And Lead Discovery API Uses

## What This Endpoint Group Does

This group helps discover candidate domains from a technology, company name, IP/tag/attribute, or domain keyword context. `Technology Lists` expands a technology such as Shopify or WordPress into sites using it. `Company to URL` maps a company name to likely domains. `Tags` maps IP-like or attribute values to related domains. `Keywords` extracts keywords associated with a known domain.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/builtwith/lists` | Find domains using a technology | `TECH`, `OFFSET`, `AMOUNT`, `ORDER`, `META` | `Results[].D`, first/last indexed, first/last detected, spend, rank, SKU/product counts, optional country/meta, `NextOffset` |
| POST | `/builtwith/company-to-url` | Discover domains owned by or associated with a company | `COMPANY`, `AMOUNT` | Domain, company name, spend, rank, parked flag, country/state/postcode/city, socials |
| POST | `/builtwith/tags` | Find domains related to an IP address, tag, or site attribute | `LOOKUP` such as `IP-75.126.76.154` | Lookup value and matched domains with first/last seen timestamps |
| POST | `/builtwith/keywords` | Extract keywords for a known domain | `LOOKUP` | Domain and keyword array |

## Field Notes

### Inputs

`TECH` and `COMPANY` are the two main market-expansion inputs. `LOOKUP` is overloaded: for tags it can be an IP-prefixed value or another supported attribute, while for keywords it is a domain. `AMOUNT`, `OFFSET`, `ORDER`, and `META` help control list size, pagination, sorting, and metadata inclusion.

### Outputs

Useful discovery outputs include domain names, first/last indexed dates, first/last technology-detected dates, spend and rank metrics, product/SKU counts, company names, parking status, country/state/city/postcode, social handles, and keyword arrays. These fields let a workflow score domains before a deeper profile lookup.

### Important Constraints Or Gaps

The MPP service manifest does not include BuiltWith's separate keyword-search endpoint, even though official BuiltWith docs describe one. This group only covers extracting keywords for a known domain. Some compact list fields such as `Q`, `A`, `U`, `M`, `F`, and `E` appear in samples but are not defined in the local docs.

## Use Cases

### Technology-Qualified Prospect List Building

A salesperson can query `Technology Lists` for a product ecosystem, such as Shopify, HubSpot, Segment, or WordPress, and get domains with first/last detected dates, spend, rank, and optional metadata. This lets them build a prospect list based on real stack usage rather than generic industry targeting.

For a business, `Results[].D`, `FD`, `LD`, `S`, `SKU`, and `Country` can feed lead scoring. Recent adoption of a complementary tool may indicate buying intent; high spend can indicate account size; country and rank help territory assignment. Pagination via `NextOffset` is important for list-building workflows.

### Account And Subsidiary Domain Discovery

An individual researcher can use `Company to URL` to resolve a company name into domains before doing deeper technology analysis. The endpoint returns possible domains with company names, spend, ranks, parked flags, location data, and socials, which helps decide which domains are legitimate and worth inspecting.

For sales operations or data enrichment teams, the same endpoint can normalize messy account records. If a CRM account lacks a website or has only a brand name, `COMPANY` can produce candidate URLs, and `Parked`, `CompanyName`, `Country`, and `Socials` can help filter weak matches before adding domains to account records.

### Infrastructure And Shared-Hosting Neighborhood Discovery

`Tags` can map an IP-like lookup to domains that have appeared on the same IP or related attribute. A person investigating a vendor, hosting change, or suspicious domain cluster can use the matched `Domain`, `First`, and `Last` fields to understand neighborhood history.

For a business, this can support account expansion or risk analysis. For example, a hosting provider can identify domains tied to a known infrastructure value, while a risk team can inspect whether many low-quality domains share an IP/tag. The docs do not enumerate every supported attribute format, so workflows should log unsupported lookup values and handle empty results.

### Messaging And Keyword-Based Segmentation

`Keywords` lets a user enrich a known domain with terms BuiltWith associates with that site's profile and content. For a single operator, these terms can help draft more relevant outreach or quickly understand what a site emphasizes without reading the whole site manually.

For marketing teams, keyword arrays can segment discovered domains into campaigns. A lead list from `Technology Lists` can be sampled through `Keywords`, then grouped by themes such as hospitality, retail, fintech, or developer tooling. Because keyword ranking semantics are not documented, keywords should be treated as supporting labels rather than exact taxonomy.

### Parked-Domain And Quality Filtering

`Company to URL` exposes `Parked`, rank, spend, and location fields, while `Technology Lists` exposes recency and spend/rank-like fields. These can help remove weak or irrelevant domains before a paid full-profile lookup.

A business can apply simple rules: drop parked domains, deprioritize domains with no recent activity, route high-spend domains to higher-touch sales, and send unknown-company domains to manual review. This keeps the discovery workflow practical and cost-aware.
