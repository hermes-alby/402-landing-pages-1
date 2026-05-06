# RentCast: Valuation And Rent Estimates API Uses

## What This Endpoint Group Does

This group returns automated property value estimates and long-term rent estimates for a subject property. The endpoints accept a property address or latitude/longitude plus optional property attributes and comparable-selection controls. Responses include an estimate, an estimate range, subject-property details, and comparable sale or rental listings with distance, recency, and similarity fields.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/rentcast/value-estimate` | Estimate current property value or after-repair value and return sale comps. | `address` or `latitude`/`longitude`, `propertyType`, `bedrooms`, `bathrooms`, `squareFootage`, `maxRadius`, `daysOld`, `compCount` | `price`, `priceRangeLow`, `priceRangeHigh`, `subjectProperty`, comparable sale listings |
| POST | `/rentcast/rent-estimate` | Estimate long-term monthly rent and return rental comps. | `address` or `latitude`/`longitude`, `propertyType`, `bedrooms`, `bathrooms`, `squareFootage`, `maxRadius`, `daysOld`, `compCount` | `rent`, `rentRangeLow`, `rentRangeHigh`, `subjectProperty`, comparable rental listings |

## Field Notes

### Inputs

The core input is either a full `address` or `latitude` and `longitude`. Optional subject attributes include `propertyType`, `bedrooms`, `bathrooms`, and `squareFootage`. Comparable-selection controls include `maxRadius`, `daysOld`, and `compCount`. RentCast's provider docs also document `lookupSubjectAttributes`, which defaults to true and can use the property records database to fill subject attributes when an address is provided; the MPP wrapper OpenAPI did not list that field.

### Outputs

The value endpoint returns `price`, `priceRangeLow`, and `priceRangeHigh`; the rent endpoint returns the analogous monthly rent estimate fields. Both return `subjectProperty` and `comparables`. Comparable fields include address/geocode fields, physical attributes, `status`, `price`, `listingType`, `listedDate`, `removedDate`, `lastSeenDate`, `daysOnMarket`, `distance`, `daysOld`, and `correlation`.

### Important Constraints Or Gaps

AVM accuracy depends heavily on the subject property's attributes and the quality of comparable listings. Smaller `maxRadius` or `daysOld` values can produce too few comps. For multi-family properties, RentCast says value estimates apply to the entire building, while rent estimates apply to one unit. The provider supports automatic subject-property lookup only when an address is used, not latitude/longitude. The wrapper response schema is assumed to mirror RentCast's provider schema because the MPP OpenAPI only documents success status.

## Use Cases

### Offer Pre-Screening For Investors

A personal investor can call the value estimate endpoint for a target address and compare `price`, range bounds, and recent comparable sale listings before spending time on a full underwriting model. The `correlation`, `distance`, `daysOld`, and comparable `price` fields help decide whether the estimate is supported by close, recent, similar comps or by weaker evidence.

An acquisitions business can automate first-pass triage across inbound leads. Properties where the estimate range is too wide, comps are stale, or nearby comparables have low correlation can be routed to manual review, while better-supported estimates can flow into offer calculators. The output should be treated as screening evidence, not a regulated appraisal.

### Rent Setting And Renewal Review

A landlord can use the rent estimate endpoint to compare a current or proposed rent against RentCast's estimated monthly rent and nearby rental comps. The comparable `price`, `distance`, `daysOnMarket`, and `lastSeenDate` fields help explain whether the current rent is low, high, or aligned with similar active or recently inactive rentals.

A property management company can embed the same call into renewal workflows. Units can be flagged when the current lease is far below the estimated range, when comps are too sparse to justify an increase, or when local comps show long days on market that suggest caution. Multi-family users must remember that the rent endpoint estimates a single unit, not the whole building.

### Comparable Evidence For Client Reports

A buyer, seller, or agent can use the returned `comparables` list to make an AVM result explainable. Rather than showing only a single number, a report can display the subject property, range, nearby comparable addresses, listed prices or rents, distance, listing dates, and similarity scores.

A proptech or brokerage product can use these fields to generate transparent valuation/rent widgets. Users can inspect why a number was produced, and analysts can tune `maxRadius`, `daysOld`, and `compCount` for local market conditions. The report should disclose that RentCast uses listing-based AVM methods and that data availability varies by market.

### Refinance, Insurance, And Portfolio Monitoring

A homeowner can periodically check whether estimated value has moved materially, using range fields and comps to decide whether to ask a lender, insurance agent, or tax professional for a deeper review. The endpoint can provide a quick signal without requiring a full broker price opinion.

A business holding many properties can schedule periodic checks and trigger review when estimates cross loan-to-value, insurance coverage, or target sale thresholds. The most useful fields are the estimate, range, subject attributes, and comparable recency. Because live calls cost money through MPP, large portfolios should batch carefully and consider whether direct RentCast plans are more economical.
