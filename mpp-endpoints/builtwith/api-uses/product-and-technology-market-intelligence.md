# BuiltWith: Product And Technology Market Intelligence API Uses

## What This Endpoint Group Does

This group supports market research rather than just domain enrichment. `Product Search` finds shops selling matching products and returns product-level titles, URLs, prices, indexed dates, and shop fields. `Recommendations` suggests technologies for a domain based on similar sites. `Trends` returns technology metadata and adoption coverage across top-site cohorts plus live/expired counts.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/builtwith/product` | Find ecommerce shops and products matching a query | `QUERY`, `PAGE`, `LIMIT` | Query echo, pagination, credit counters, shops, products, titles, product URLs, indexed dates, prices, shop spend |
| POST | `/builtwith/recommendations` | Recommend technologies for a domain | `LOOKUP` | Domain, compiled date, recommended technology name/link/tag/categories, stars, match score |
| POST | `/builtwith/trends` | Get adoption data for a technology | `TECH` | Technology icon, categories, tag, premium flag, description, link, trends link, coverage counts |

## Field Notes

### Inputs

`Product Search` uses a free-text `QUERY`; official direct docs also show `dom:domain` syntax for all products sold by a domain. `PAGE` and `LIMIT` control pagination. `Recommendations` is domain-driven through `LOOKUP`. `Trends` is technology-driven through `TECH`.

### Outputs

Product outputs include `shops[].Domain`, `shops[].Products[].Title`, `Url`, `Indexed`, `FirstIndexed`, `Price`, shop `Type`, and `Spend`. Recommendation outputs include `name`, `link`, `tag`, `categories`, `stars`, and `match`. Trends output includes descriptive technology metadata plus `coverage.ten_k`, `hundred_k`, `milly`, `live`, and `expired`.

### Important Constraints Or Gaps

The direct BuiltWith Product API uses Product Credits, while the MPP wrapper documents a per-request estimated cost; the exact relationship between large result sets and MPP billing is not further documented. Recommendation scores are not explained beyond sample fields. Trend refresh cadence is not specified in local sources.

## Use Cases

### Ecommerce Assortment And Price Research

A buyer, reseller, or brand operator can search a product phrase and inspect which shops list matching products, what titles they use, what prices appear, and when listings were first indexed or last indexed. `Price`, `Title`, `Domain`, `Indexed`, and `FirstIndexed` make the result useful for market scans and competitive monitoring.

For a business, this can automate product-market surveillance. A brand can track unauthorized or unexpected sellers, a retailer can benchmark product availability, and an analyst can discover niche storefronts selling a product line. Results should be treated as indexed web observations, not inventory guarantees.

### Domain-Specific Product Catalog Discovery

Using the documented `dom:domain` product query pattern, a user can inspect products associated with a specific ecommerce domain. This is valuable when reviewing a retailer, supplier, competitor, or potential partner because it returns product titles, URLs, prices, and indexed dates in one structured response.

For a business, this can enrich vendor onboarding or competitor catalogs. A procurement or partnerships team can sample a store's product mix before manual review, while a market analyst can compare product positioning across shops. Pagination matters because one lookup can return many products.

### Technology Market Sizing

`Trends` gives adoption counts for a named technology across top-site cohorts and the broader live/expired universe. A person evaluating a tool can use `coverage.ten_k`, `hundred_k`, `milly`, `live`, and `expired` to understand whether a technology is niche, mainstream, or declining.

For a business, trend coverage can inform product strategy and partnership prioritization. A developer-tool company can rank integration opportunities by adoption, while an investor or analyst can compare market penetration across competing technologies. The endpoint returns a snapshot, so longitudinal trend analysis would require repeated retrievals or separate historical sources.

### Stack Gap And Procurement Recommendations

`Recommendations` can suggest tools similar sites use, including the recommendation `tag`, `categories`, `stars`, and `match` score. A site owner can use it to discover likely missing capabilities, such as support tools, CDN, fraud prevention, transactional email, or analytics.

For an agency or customer-success team, this supports stack audits. Given a client's domain, the recommendations can become a shortlist for discussion, prioritized by match score and category. The output should not be blindly converted into purchases because recommendation methodology and sponsorship/weighting are not documented in local sources.

### Product And Technology Cross-Research

A market analyst can combine `Product Search` with `Trends`: first discover shops selling a product category, then use domain profiling or trend data to understand the ecommerce platforms and technologies common in that market. Product prices and shop domains identify the market participants; trend coverage identifies ecosystem scale.

For businesses, this can support vertical go-to-market campaigns. For example, a company selling ecommerce tooling can find shops around a product niche, enrich their tech stacks, and prioritize those using relevant or competing technologies. The workflow requires calls across groups and should account for MPP per-request costs.
