# StableTravel: Hotel Search Ratings And Booking API Uses

## What This Endpoint Group Does

Find hotels by city/geocode/name, search offers, inspect offer details, book a hotel offer, and pull sentiment ratings/reviews. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream hotel discovery, offer, booking, and rating data comes from Amadeus-backed hotel surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/hotels/list` | List hotels by city code | cityCode, radius, radiusUnit, chainCodes, amenities, ratings, hotelScore, max | data, meta |
| GET | `/api/hotels/list/by-geocode` | List hotels by geographic coordinates | latitude, longitude, radius, radiusUnit, chainCodes, amenities, ratings, hotelScore | data, meta |
| GET | `/api/hotels/search` | Search hotel offers by hotel IDs | hotelIds, adults, checkInDate, checkOutDate, countryOfResidence, priceRange, currencyCode, paymentPolicy | data |
| GET | `/api/hotels/search/by-hotel` | Search hotel offers for a specific hotel | hotelId, adults, checkInDate, checkOutDate, countryOfResidence, priceRange, currencyCode, paymentPolicy | data |
| GET | `/api/hotels/offer` | Get details of a specific hotel offer | offerId | data |
| POST | `/api/hotels/book` | Create a hotel booking order | data | data, warnings |
| GET | `/api/hotels/autocomplete` | Autocomplete hotel names | keyword, subType, countryCode, lang, max | data, meta |
| GET | `/api/hotels/ratings` | Get hotel sentiment ratings and reviews | hotelIds | data, meta, warnings |

## Field Notes

### Inputs

- cityCode (required)
- radius
- radiusUnit
- chainCodes
- amenities
- ratings
- hotelScore
- max
- latitude (required)
- longitude (required)
- hotelIds (required)
- adults
- checkInDate
- checkOutDate
- countryOfResidence
- priceRange
- currencyCode
- paymentPolicy
- boardType
- includeClosed
- bestRateOnly
- lang
- hotelId (required)
- offerId (required)
- data (required)
- keyword (required)
- subType (required)
- countryCode

### Outputs

- data
- meta
- warnings

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Hotel Shortlist To Confirmed Offer

A traveler or agency can list hotels by city or geocode, search offers by hotel ID, inspect an offer, and book only after dates, occupancy, board type, room terms, and price are acceptable. The required hotel ID and offer ID chain keeps the workflow grounded in current supplier inventory rather than free-form hotel names.

### Quality-Aware Lodging Selection

Autocomplete, hotel listing, offer search, and ratings endpoints let users combine availability and sentiment before committing. Businesses can rank hotels for traveler safety, customer satisfaction, or event blocks by combining location, ratings, reviews, and price fields, while clearly noting that public docs do not define the full ratings schema.

### Geo-Constrained Accommodation Planning

The city-code and latitude/longitude hotel list endpoints support neighborhoods, airport layovers, conferences, and operations lodging. Location fields, radius, amenities, ratings, and max results help an agent produce a bounded set of viable properties instead of searching an entire metro area.

### Low-Touch Hotel Procurement

For small teams without a direct Amadeus integration, the booking endpoint can turn a selected offer into an order after a paid request. Because booking is a mutation involving traveler and payment-sensitive details, production use needs explicit authorization, duplicate-booking controls, and supplier cancellation policy review.
