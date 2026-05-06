# RentCast: Property Record Lookup API Uses

## What This Endpoint Group Does

This group retrieves property-record data for US residential properties. It can search by exact address, city/state/zip, or circular geographic area; fetch a known RentCast property `id`; or return random records for testing and sampling. The value is not just address normalization. The response can include structural attributes, parcel and county identifiers, HOA fees, features, tax assessment history, property tax amounts, sale history, and current-owner details.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/rentcast/properties` | Search property records or retrieve a record by address. | `address`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `radius`, `propertyType`, numeric/range filters, `saleDateRange`, `limit`, `offset` | Property ids, address/geocode fields, physical attributes, tax assessments, property taxes, sale history, owner fields |
| POST | `/rentcast/property-by-id` | Retrieve one property record by RentCast id. | `id` | The same property-record schema for one known property |
| POST | `/rentcast/random-properties` | Retrieve random property records for testing or samples. | `limit` | Random property-record examples with the standard property schema |

## Field Notes

### Inputs

The search endpoint supports three useful location modes: exact `address`, area search by `city`/`state`/`zipCode`, or circular search by `address` plus `radius` or `latitude`/`longitude` plus `radius`. It can narrow results by `propertyType`, `bedrooms`, `bathrooms`, `squareFootage`, `lotSize`, `yearBuilt`, and `saleDateRange`; several numeric filters support ranges and multiple values. Pagination uses `limit` and `offset`, with `includeTotalCount` documented by RentCast for a total-count response header.

### Outputs

The property record contains `id`, address components, `county`, FIPS codes, latitude/longitude, `propertyType`, bedroom/bath/square-foot/lot/year-built attributes, `assessorID`, legal/subdivision/zoning fields, `hoa.fee`, feature details, tax assessments, property taxes, sale history, `lastSaleDate`, `lastSalePrice`, `owner.names`, `owner.type`, `owner.mailingAddress`, and `ownerOccupied`.

### Important Constraints Or Gaps

RentCast says field availability varies by county and state. Property records are updated about once per week, but recent sales and tax assessments can take longer because public-record sources lag. The MPP wrapper does not document whether provider headers such as `X-Total-Count` are forwarded. Random records are useful for validation, not for market-representative sampling unless the sampling method is separately verified.

## Use Cases

### Property Lead Enrichment And Routing

A person evaluating an inbound real estate lead can turn a raw address into a fuller profile: property type, square footage, year built, owner-occupied status, last sale date, last sale price, tax burden, and owner mailing address. That helps decide whether the lead is worth pursuing, whether the property matches a preferred buy box, and whether outreach should be framed around owner occupancy, recent purchase history, or apparent equity.

A business can attach these fields to CRM records before routing. For example, a wholesaling or home-services team can route owner-occupied single-family properties differently from investor-owned multi-family properties, suppress records outside target property types, and prioritize older properties or properties with large assessment changes. The value depends on local field availability and compliance rules for owner/contact usage.

### Sold-Comparable Discovery Before Valuation

A homeowner, buyer, or small investor can search around a subject `address` with `radius`, `propertyType`, bedroom/bathroom filters, and `saleDateRange` to find nearby sold properties. `lastSaleDate`, `lastSalePrice`, `squareFootage`, `lotSize`, and `yearBuilt` help distinguish relevant comps from misleading ones.

For an underwriting workflow, this endpoint can create a defensible comp set before calling the AVM endpoints or before a human analyst reviews a deal. The automation can reject comps too far from the subject property's physical profile, flag stale sales, and preserve the source property ids for audit. It should not replace appraisal judgment when financing, legal, or regulated valuation decisions require a certified process.

### Tax And Assessment Review

A homeowner can compare recent `taxAssessments`, `propertyTaxes`, and `lastSalePrice` to understand whether a property's assessed value has moved sharply relative to sale history. This can inform whether to investigate a possible tax appeal or budget for ownership costs.

A property manager or portfolio owner can run the same enrichment across owned addresses to spot tax increases, reassessment risk, or missing assessment data. Because assessment timing depends on public county sources, the workflow should include a freshness note and avoid treating every missing county field as a zero.

### Owner-Occupied And Mailing-Address Segmentation

For personal due diligence, `ownerOccupied` and owner mailing-address fields help answer whether a target property appears owner occupied or owned by someone with a different mailing address. That can change assumptions about maintenance, rental possibility, or outreach sensitivity.

For business operations, property managers, insurance marketers, and investor teams can segment outreach or internal review by `owner.type`, owner mailing geography, and owner-occupied status. This can reduce wasted contact attempts and make handoffs more precise, but it requires careful privacy, fair-housing, consumer-protection, and local solicitation compliance review.

### Portfolio Data Normalization

A small landlord can normalize a spreadsheet of property addresses by retrieving formatted addresses, county, FIPS codes, geocodes, physical attributes, and RentCast ids. Those ids can become stable references for future listing, valuation, or market calls.

A business can use the same workflow to clean acquisition lists, deduplicate addresses, join county-level attributes, and cache RentCast property ids. The endpoint's `id` output is especially useful because later exact lookups avoid repeating broad address searches.
