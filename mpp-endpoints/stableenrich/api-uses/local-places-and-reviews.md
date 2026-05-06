# StableEnrich: Local Places And Reviews API Uses

## What This Endpoint Group Does

Find places by text or geography and retrieve place details, ratings, reviews, hours, contact data, amenities, price signals, and location identifiers.

These endpoints all serve local place discovery or place-detail workflows, with lower-cost partial variants and richer full variants for contact, review, and amenity data.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/google-maps/text-search/full` | Google Maps Text Search (Full) ($0.08) | textQuery, excludeFields, pageToken, locationBias, locationBias.circle, locationBias.circle.center, locationBias.circle.center.latitude, locationBias.circle.center.longitude | places, places.id, places.displayName, places.displayName.text, places.displayName.languageCode, places.formattedAddress, places.location, places.location.latitude |
| POST | `/api/google-maps/text-search/partial` | Google Maps Text Search (Partial) ($0.02) | textQuery, excludeFields, pageToken, locationBias, locationBias.circle, locationBias.circle.center, locationBias.circle.center.latitude, locationBias.circle.center.longitude | places, places.id, places.displayName, places.displayName.text, places.displayName.languageCode, places.formattedAddress, places.location, places.location.latitude |
| POST | `/api/google-maps/nearby-search/full` | Google Maps Nearby Search (Full) ($0.08) | excludeFields, locationRestriction, locationRestriction.circle, locationRestriction.circle.center, locationRestriction.circle.center.latitude, locationRestriction.circle.center.longitude, locationRestriction.circle.radius, includedTypes | places, places.id, places.displayName, places.displayName.text, places.displayName.languageCode, places.formattedAddress, places.location, places.location.latitude |
| POST | `/api/google-maps/nearby-search/partial` | Google Maps Nearby Search (Partial) ($0.02) | excludeFields, locationRestriction, locationRestriction.circle, locationRestriction.circle.center, locationRestriction.circle.center.latitude, locationRestriction.circle.center.longitude, locationRestriction.circle.radius, includedTypes | places, places.id, places.displayName, places.displayName.text, places.displayName.languageCode, places.formattedAddress, places.location, places.location.latitude |
| GET | `/api/google-maps/place-details/full` | Google Maps Place Details (Full) ($0.05) | placeId, excludeFields, languageCode | id, displayName, displayName.text, displayName.languageCode, formattedAddress, location, location.latitude, location.longitude |
| GET | `/api/google-maps/place-details/partial` | Google Maps Place Details (Partial) ($0.02) | placeId, excludeFields, languageCode | id, displayName, displayName.text, displayName.languageCode, formattedAddress, location, location.latitude, location.longitude |

## Field Notes

### Inputs

- `textQuery`
- `locationRestriction.circle.center`
- `locationRestriction.circle.radius`
- `placeId`
- `includedType`
- `maxResultCount`
- `pageToken`
- `openNow`
- `minRating`
- `priceLevels`
- `excludeFields`

### Outputs

- `places`
- `id`
- `displayName`
- `formattedAddress`
- `location`
- `rating`
- `userRatingCount`
- `reviews`
- `websiteUri`
- `phone numbers`
- `opening hours`
- `amenities`
- `parkingOptions`
- `paymentOptions`
- `nextPageToken`

### Important Constraints Or Gaps

- The docs do not publish a freshness SLA for place details or reviews.
- The exact provider-side field mask behind partial versus full variants is described by output fields but not separately enumerated as a named mask.
- Endpoints in this group cost /api/google-maps/text-search/full: $0.08; /api/google-maps/text-search/partial: $0.02; /api/google-maps/nearby-search/full: $0.08; /api/google-maps/nearby-search/partial: $0.02; /api/google-maps/place-details/full: $0.05; /api/google-maps/place-details/partial: $0.02.

## Use Cases

### Shortlist Local Vendors With Review Evidence

A person choosing a restaurant, medical office, repair shop, or coworking space can run a text or nearby search, filter by openNow, minRating, priceLevels, and geography, then use full details for ratings, review counts, reviews, hours, phone numbers, and website links before deciding where to go or call. The partial endpoints keep broad scouting cheaper, while full endpoints add the evidence needed for a final choice.

A business can use the same fields to build local vendor panels, territory lists, or competitor maps. Ratings, review text, hours, accessibility, parking, payment options, and service flags support routing decisions, vendor qualification, and branch comparison, but the docs do not publish review freshness guarantees.

### Retail Site And Territory Research

A founder or franchise operator can query nearby categories around candidate coordinates and compare place density, ratings, opening hours, and price levels. Location, types, primaryType, formattedAddress, and nextPageToken make it possible to map competitive concentration and customer-facing business mix.

Sales, real estate, and expansion teams can automate first-pass market scans before deeper human review. The API gives useful public place signals, but it does not replace foot traffic data, lease economics, or direct customer demographics.

### Accessibility And Amenity Filtering

A person planning a trip or event can prefer places with wheelchair access, parking options, outdoor seating, reservations, dietary signals, or child/group suitability when the full Google Maps fields expose those attributes.

Businesses arranging offsites, field visits, or customer meetings can use these same fields to reduce manual venue checks. Missing or stale amenity data should be verified with the place directly for high-stakes accessibility needs.
