# StableTravel: Flight Shopping And Booking API Uses

## What This Endpoint Group Does

Use Amadeus-backed GDS flight search, price confirmation, booking, order management, seat maps, upsells, availability, schedule status, and check-in links for executable flight-booking workflows. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream flight shopping and order data comes from Amadeus-backed GDS surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/flights/search` | Search flight offers by query parameters | originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children, infants, travelClass | data, dictionaries, meta, warnings |
| POST | `/api/flights/search` | Search flight offers with advanced criteria | currencyCode, originDestinations, travelers, sources, searchCriteria | data, dictionaries, meta, warnings |
| POST | `/api/flights/price` | Get confirmed pricing for flight offers | data | data, dictionaries, warnings |
| POST | `/api/flights/book` | Create a flight booking order | data | data, dictionaries, warnings |
| GET | `/api/flights/orders` | Retrieve a flight order by ID | id | data, dictionaries, warnings |
| POST | `/api/flights/orders/cancel` | Cancel a flight order by ID | id | data, dictionaries, warnings |
| GET | `/api/flights/seatmap` | Get seatmaps for a flight order | flight-orderId | data, dictionaries, warnings |
| POST | `/api/flights/seatmap` | Get seatmaps for flight offers | data, included | data, dictionaries, warnings |
| POST | `/api/flights/upsell` | Get upsell offers for existing flight offers | data | data, dictionaries, meta, warnings |
| POST | `/api/flights/availability` | Search flight availabilities | originDestinations, travelers, sources, searchCriteria | data, dictionaries, meta, warnings |
| GET | `/api/flights/status` | Get flight schedule and status information | carrierCode, flightNumber, scheduledDepartureDate, operationalSuffix | data, dictionaries, meta, warnings |
| GET | `/api/flights/checkin-links` | Get airline check-in page links | airlineCode, language | data, meta, warnings |

## Field Notes

### Inputs

- originLocationCode (required)
- destinationLocationCode (required)
- departureDate (required)
- returnDate
- adults (required)
- children
- infants
- travelClass
- includedAirlineCodes
- excludedAirlineCodes
- nonStop
- currencyCode
- maxPrice
- max
- originDestinations (required)
- travelers (required)
- sources (required)
- searchCriteria
- data (required)
- id (required)
- flight-orderId (required)
- included
- carrierCode (required)
- flightNumber (required)
- scheduledDepartureDate (required)
- operationalSuffix
- airlineCode (required)
- language

### Outputs

- data
- dictionaries
- meta
- warnings

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Autonomous Flight Booking With Price Confirmation

A traveler can give an agent origin, destination, dates, cabin preference, passenger counts, and price limits, then have it search Amadeus offers, confirm the chosen offer with the pricing endpoint, and proceed only when the confirmed total and itinerary still match the traveler's rules. A travel desk can use the same flow to enforce policy before booking: cabin class, allowed carriers, maximum fare, connection count, and currency all become machine-checkable inputs before a paid booking mutation is attempted.

### Corporate Travel Policy Screening

The search, availability, upsell, seatmap, and check-in-link endpoints let a company compare not only fare totals but also schedule fit, seat availability, ancillary options, and traveler logistics. Outputs such as flight offers, dictionaries, warnings, order identifiers, and seatmap data help route itineraries for approval, flag out-of-policy fare classes, and prepare traveler instructions after booking.

### Traveler Support And Itinerary Recovery

The order lookup, status, check-in links, and cancellation endpoints support after-booking support workflows. A person can ask whether a flight is still scheduled and where to check in, while a support team can retrieve order state, inspect schedule status, and decide whether cancellation or rebooking should be escalated. Cancellation is a mutation and should require explicit human approval and supplier-policy checks.

### Ancillary Revenue And Seat Selection Optimization

Upsell and seatmap endpoints expose paid add-ons and seat layouts around a known flight offer or order. A leisure traveler can decide whether extra bags, seat choices, or cabin upgrades are worth the price; a travel agency can automate prompts for high-value ancillaries while keeping a hard budget ceiling and avoiding duplicate paid calls.
