# StableTravel: Travel Reference Data API Uses

## What This Endpoint Group Does

Resolve airports, cities, airlines, routes, nearby airports, and recommended destinations used as inputs to other travel workflows. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream lookup data comes from Amadeus-backed travel reference surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/reference/locations` | Search for airports and cities by keyword | subType, keyword, countryCode, page[limit], page[offset], sort, view | data, meta |
| GET | `/api/reference/airports` | Find nearby airports by geographic coordinates | latitude, longitude, radius, page[limit], page[offset], sort | data, meta |
| GET | `/api/reference/airlines` | Look up airline information by IATA code | airlineCodes | data, meta, warnings |
| GET | `/api/reference/airline-routes` | Get destinations served by an airline | airlineCode, max, arrivalCountryCode | data, meta, warnings |
| GET | `/api/reference/airport-routes` | Get direct destinations from an airport | departureAirportCode, max, arrivalCountryCode | data, meta, warnings |
| GET | `/api/reference/cities` | Search for cities by keyword | keyword, countryCode, max, include | data, included, meta, warnings |
| GET | `/api/reference/recommendations` | Get recommended travel destinations | cityCodes, travelerCountryCode, destinationCountryCodes | data, meta, warnings |

## Field Notes

### Inputs

- subType (required)
- keyword (required)
- countryCode
- page[limit]
- page[offset]
- sort
- view
- latitude (required)
- longitude (required)
- radius
- airlineCodes
- airlineCode (required)
- max
- arrivalCountryCode
- departureAirportCode (required)
- include
- cityCodes (required)
- travelerCountryCode
- destinationCountryCodes

### Outputs

- data
- meta
- warnings
- included

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Search Input Normalization

Reference endpoints resolve cities, airports, airline codes, nearby airports, direct routes, and recommended destinations before paid flight or hotel searches. A personal agent can turn vague user text like "Paris to Tokyo near the cheapest airport" into validated IATA inputs; a business can reduce failed searches and wrong-airport bookings.

### Route Network Planning

Airline-route and airport-route lookups help determine whether a direct flight is plausible before running deeper fare searches. This supports travel-policy routing, event-market planning, and airline partnership analysis where the key decision is which city pairs or carriers deserve further paid research.

### Destination Recommendation Workflows

Recommendation, city, airport, and location lookup endpoints can seed trip ideation from a keyword, coordinates, or known airport. The value is strongest when paired with price discovery and activities data; reference data alone should be treated as an input-quality layer, not a complete travel recommendation engine.
