# RentCast: Market Statistics And Trends API Uses

## What This Endpoint Group Does

This group retrieves aggregate sale and rental market statistics for a single US zip code. It can return sale data, rental data, or both, with current aggregate fields and historical records. The output includes prices or rents, per-square-foot metrics, square footage, days on market, new listings, total listings, and breakdowns by property type or bedroom count.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/rentcast/markets` | Retrieve zip-code sale/rental market statistics and history. | `zipCode`, `dataType`, `historyRange` | `saleData`, `rentalData`, average/median/min/max price or rent, per-square-foot metrics, days on market, inventory, property-type and bedroom breakdowns, historical records |

## Field Notes

### Inputs

The required input is `zipCode`. `dataType` can be `All`, `Sale`, or `Rental`; it defaults to all data in the provider docs. `historyRange` controls the number of months of historical entries and defaults to the provider's documented recent range when omitted.

### Outputs

Top-level fields include `id`, `zipCode`, and optional `saleData` and `rentalData`. Sale data includes price, price-per-square-foot, square-footage, days-on-market, listing-count, property-type, bedroom, and history metrics. Rental data includes rent, rent-per-square-foot, square-footage, days-on-market, listing-count, bedroom/property-type, and history metrics. `lastUpdatedDate` provides freshness for current aggregates.

### Important Constraints Or Gaps

Market data is aggregated from RentCast listing records with outlier removal. Current-month data is updated once per day, and month-end snapshots become historical records. Historical sale statistics are available from January 2024; historical rental statistics are available from April 2020. Sparse zip codes can omit sale or rental sections, or have gaps when there are not enough listings for statistically significant averages.

## Use Cases

### Neighborhood Screening For Buyers And Investors

A buyer or investor can compare zip codes by median price, average price per square foot, inventory, and days on market before evaluating individual listings. `dataByPropertyType` helps avoid misleading averages when a zip code mixes condos, land, and single-family homes.

A real estate investment business can use the same fields to rank markets for acquisition campaigns. Zip codes with rising prices, manageable days on market, and sufficient inventory can move forward; sparse or volatile markets can be held for manual review. Because the endpoint is zip-code based, hyper-local street or subdivision differences still require property/listing-level checks.

### Rent Growth And Yield Analysis

A landlord can compare current and historical rental metrics to judge whether a target area supports a rent increase or acquisition. `averageRent`, `medianRent`, rent-per-square-foot fields, bedroom breakdowns, and rental history are the core inputs.

A portfolio or asset-management team can combine rental market stats with property valuation outputs to estimate gross yield by zip code. The automation can flag areas where rents are rising, listings move quickly, or bedroom-specific rents support a target unit mix. The endpoint reports asking/listing market data, not lease execution data, so results should be treated as directional.

### Pricing Strategy For Listings

A seller can use sale market aggregates to understand whether a proposed list price sits above or below zip-code averages and medians. Days-on-market and inventory fields provide context for how quickly homes appear to move.

A brokerage or property-management business can build pricing guardrails by property type or bedroom count. When a listing's asking price or rent is outside the local median range, the workflow can ask for extra justification, attach comparable listing evidence, or route the case to an experienced agent.

### Market Trend Monitoring And Alerts

A homeowner, renter, or investor can periodically check a zip code's historical price or rent trend and watch changes in inventory and days on market. That supports personal decisions like whether to renew, list, buy, or wait.

A business can schedule daily or monthly market checks and trigger alerts when median rent, median sale price, inventory, or days-on-market metrics cross thresholds. The `historyRange` input and history output support trend calculations without storing every raw listing, but the workflow should account for missing history in sparse markets.

### Expansion Planning For Real Estate Services

A local services business can screen zip codes for housing density, active listings, and price/rent levels to decide where to focus sales coverage. New listings and total listings can act as demand signals for moving, inspection, renovation, cleaning, or property-management services.

A proptech or lending business can use market statistics to select launch markets or prioritize underwriting attention. Combining sale and rental trends with property-record and listing endpoints can create a market score that is more specific than population-level demographic data.
