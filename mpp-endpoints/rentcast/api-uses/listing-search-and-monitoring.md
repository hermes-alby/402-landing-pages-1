# RentCast: Listing Search And Monitoring API Uses

## What This Endpoint Group Does

This group searches and retrieves active or inactive property listings for sale and long-term rent. It supports location searches, property-attribute filters, status and price filters, pagination, and exact listing lookup by id. Listing responses can include MLS identifiers, agent and office contact details, builder data, listing dates, days on market, price/rent, and listing history.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/rentcast/sale-listings` | Search for-sale listings by address, area, or filters. | Location fields, `propertyType`, bedrooms/bathrooms/size filters, `status`, `price`, `daysOld`, pagination | Sale listing records with price, status, dates, MLS, agent/office/builder, history |
| POST | `/rentcast/sale-listing-by-id` | Retrieve one sale listing by id. | `id` | One sale listing record |
| POST | `/rentcast/rental-listings` | Search long-term rental listings by address, area, or filters. | Location fields, `propertyType`, bedrooms/bathrooms/size filters, `status`, `price`, `daysOld`, pagination | Rental listing records with rent in `price`, status, dates, MLS, agent/office/builder, history |
| POST | `/rentcast/rental-listing-by-id` | Retrieve one rental listing by id. | `id` | One rental listing record |

## Field Notes

### Inputs

The search endpoints accept exact address, city/state/zip, or circular geographic searches with `latitude`, `longitude`, and `radius`. Filters include `propertyType`, `bedrooms`, `bathrooms`, `squareFootage`, `lotSize`, `yearBuilt`, `status`, `price`, and `daysOld`; many numeric filters support ranges and multiple values. Pagination uses `limit` and `offset`; `includeTotalCount` is documented by RentCast as returning total result count in a response header.

### Outputs

Listings include address/geocode fields, physical attributes, `hoa.fee`, `status`, `price`, `listingType`, `listedDate`, `removedDate`, `createdDate`, `lastSeenDate`, `daysOnMarket`, `mlsName`, `mlsNumber`, `listingAgent`, `listingOffice`, `builder`, and `history`. For rental listings, the same `price` field represents rent.

### Important Constraints Or Gaps

RentCast says listing data is updated at least once per day and newly published listings are typically available within 12-24 hours. It does not retrieve directly from MLS feeds but expects comparable coverage to local MLS feeds for covered residential property types. The API covers residential properties and 5+ unit residential commercial dwellings, not office, retail, industrial, manufacturing, farm, or other non-residential commercial listings. MPP response-header forwarding is not documented.

## Use Cases

### Buyer Or Renter Search Automation

A buyer can search active sale listings by zip code, property type, price range, bedroom count, and days on market to surface properties that match a practical search profile. Returned `price`, `daysOnMarket`, listing dates, and history make it possible to distinguish fresh listings from stale ones and spot price/listing churn.

A rental-seeker or relocation service can do the same with rental listings, where `price` represents monthly rent. A business can automate saved-search alerts, route matching listings to agents, or enrich a client portal with MLS identifiers and listing contacts. Because data can lag 12-24 hours, urgent showing workflows should verify against the broker or listing source.

### Listing Staleness And Price-Change Monitoring

A homeowner, investor, or agent can retrieve exact listing ids over time and inspect `lastSeenDate`, `removedDate`, `daysOnMarket`, `status`, and `history`. Those fields help determine whether a listing is still active, recently removed, or repeatedly relisted.

A brokerage or pricing team can monitor stale inventory by market, property type, and price band. Listings with long `daysOnMarket`, repeated history entries, or inactive status can trigger repricing recommendations, outreach, or deeper comp review. The workflow is stronger when paired with market statistics and valuation endpoints.

### Agent, Office, And Builder Enrichment

A person researching a property can see listing-agent, office, or builder information when present, which can help identify the appropriate contact or understand whether a listing is new construction.

A business can enrich listing records in CRM or lead systems with `listingAgent`, `listingOffice`, `builder`, `mlsName`, and `mlsNumber`. That enables agent routing, builder/development tracking, broker relationship analysis, or duplicate detection across listing sources. Use of contact fields should be reviewed against applicable marketing and solicitation rules.

### Rental Supply And Competition Review

A small landlord can search nearby rental listings by bedroom count, square footage, property type, and price range to see what competing units are asking. `daysOnMarket` and `lastSeenDate` help distinguish high-confidence active competition from stale listings.

A property-management business can automate competitor snapshots for renewal pricing, vacancy planning, or leasing strategy. The returned rent, unit attributes, and listing status can be compared with internal inventory. Because listing records do not guarantee leased prices, the output should be treated as asking-rent evidence rather than closed-rent truth.

### New Construction And Development Tracking

A homebuyer or investor can identify new-construction listings and inspect builder details, development names, price, and days on market. That can reveal available inventory in a neighborhood and likely builder competition.

A business development team can track builders and developments by geography, identify active communities, and route sales or partnership efforts. The `builder` object and listing history are the key fields, but availability depends on what listing sources expose.
